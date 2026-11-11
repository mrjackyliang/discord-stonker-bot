import type {
  Web_Schema_Node,
  Web_Schema_Path,
  Web_Schema_Separated,
  Web_Schema_TypeName,
  Web_Schema_Union,
  Web_Schema_Unwrapped,
} from '@/types/web/schema.d.ts';

// Words that read better in capitals inside generated labels.

/**
 * Schema - Acronyms.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const acronyms: Record<string, string> = {
  api: 'API',
  ca: 'CA',
  dm: 'DM',
  dms: 'DMs',
  html: 'HTML',
  http: 'HTTP',
  https: 'HTTPS',
  id: 'ID',
  ids: 'IDs',
  ip: 'IP',
  rss: 'RSS',
  url: 'URL',
  urls: 'URLs',
  usd: 'USD',
  utc: 'UTC',
};

/**
 * Schema - Checks whether record.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

// titleCase turns a stored key such as "channel-id" into a label such as "Channel ID".

/**
 * Schema - Title case.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const titleCase = (key: string): string => {
  const words: string[] = key
    .replace(/([a-z])([A-Z])/gu, '$1 $2')
    .split(/[-_\s]+/u)
    .filter((word: string): boolean => word !== '');

  return words.map((word: string, index: number): string => {
    const lower: string = word.toLowerCase();
    const acronym: string | undefined = acronyms[lower];

    if (acronym !== undefined) {
      return acronym;
    }

    return (index === 0) ? `${lower.charAt(0).toUpperCase()}${lower.slice(1)}` : lower;
  }).join(' ');
};

// resolveSchema follows local references and folds allOf parts into one node.

/**
 * Schema - Resolves schema.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const resolveSchema = (schema: Web_Schema_Node | undefined, root: Web_Schema_Node): Web_Schema_Node => {
  if (schema === undefined) {
    return {};
  }

  let resolved: Web_Schema_Node = schema;
  let guard: number = 0;

  while (resolved['$ref'] !== undefined && guard < 16) {
    const reference: string = resolved['$ref'];
    const match: RegExpExecArray | null = /^#\/(\$defs|definitions)\/(.+)$/u.exec(reference);
    const container: Record<string, Web_Schema_Node> | undefined = (match === null) ? undefined : root[match[1] as '$defs' | 'definitions'];
    const target: Web_Schema_Node | undefined = (match === null || container === undefined) ? undefined : container[decodeURIComponent(match[2] ?? '')];

    if (target === undefined) {
      break;
    }

    const {
      $ref: _reference,
      ...rest
    } = resolved;

    resolved = {
      ...target,
      ...rest,
    };
    guard += 1;
  }

  if (resolved['allOf'] !== undefined) {
    const parts: Web_Schema_Node[] = resolved['allOf'].map((part: Web_Schema_Node): Web_Schema_Node => resolveSchema(part, root));
    const {
      allOf: _allOf,
      ...rest
    } = resolved;
    let merged: Web_Schema_Node = rest;

    for (const part of parts) {
      merged = {
        ...part,
        ...merged,
        properties: {
          ...(part['properties'] ?? {}),
          ...(merged['properties'] ?? {}),
        },
        required: [
          ...(part['required'] ?? []),
          ...(merged['required'] ?? []),
        ],
      };
    }

    resolved = merged;
  }

  return resolved;
};

// schemaTypes lists the JSON types a node allows, inferring them when "type" is missing.

/**
 * Schema - Schema types.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const schemaTypes = (schema: Web_Schema_Node): Web_Schema_TypeName[] => {
  if (Array.isArray(schema['type'])) {
    return schema['type'];
  }

  if (schema['type'] !== undefined) {
    return [schema['type']];
  }

  if (schema['properties'] !== undefined) {
    return ['object'];
  }

  if (schema['items'] !== undefined) {
    return ['array'];
  }

  if (schema['enum'] !== undefined && schema['enum'].every((entry: unknown): boolean => typeof entry === 'string')) {
    return ['string'];
  }

  if (typeof schema['const'] === 'string') {
    return ['string'];
  }

  return [];
};

// unwrapNullable returns the non-null option of an "X or null" node and whether null is allowed.

/**
 * Schema - Unwrap nullable.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const unwrapNullable = (schema: Web_Schema_Node, root: Web_Schema_Node): Web_Schema_Unwrapped => {
  const options: Web_Schema_Node[] | undefined = schema['anyOf'] ?? schema['oneOf'];

  if (options !== undefined && options.length === 2) {
    const resolvedOptions: Web_Schema_Node[] = options.map((option: Web_Schema_Node): Web_Schema_Node => resolveSchema(option, root));
    const nullIndex: number = resolvedOptions.findIndex((option: Web_Schema_Node): boolean => {
      const types: Web_Schema_TypeName[] = schemaTypes(option);

      return types.length === 1 && types[0] === 'null';
    });

    if (nullIndex !== -1) {
      const inner: Web_Schema_Node = resolvedOptions[(nullIndex === 0) ? 1 : 0] ?? {};
      const {
        anyOf: _anyOf,
        oneOf: _oneOf,
        ...rest
      } = schema;

      return {
        nullable: true,
        schema: {
          ...inner,
          ...rest,
        },
      };
    }
  }

  const types: Web_Schema_TypeName[] = schemaTypes(schema);

  if (types.length === 2 && types.includes('null')) {
    return {
      nullable: true,
      schema: {
        ...schema,
        type: types.find((type: Web_Schema_TypeName): boolean => type !== 'null') ?? 'string',
      },
    };
  }

  return {
    nullable: false,
    schema,
  };
};

// isHidden says whether the editor keeps a value without showing it, such as a retired setting.

/**
 * Schema - Checks whether hidden.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const isHidden = (schema: Web_Schema_Node | undefined): boolean => schema !== undefined && schema['x-hidden'] === true;

// isSecretSchema spots a write-only secret: an object whose only property is "$secret".

/**
 * Schema - Checks whether secret schema.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const isSecretSchema = (schema: Web_Schema_Node): boolean => {
  if (schema['x-widget'] === 'secret') {
    return true;
  }

  const properties: Record<string, Web_Schema_Node> | undefined = schema['properties'];

  return properties !== undefined && Object.keys(properties).length === 1 && properties['$secret'] !== undefined;
};

// unionOf describes a union of objects that share one constant property, such as "method".

/**
 * Schema - Union of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const unionOf = (schema: Web_Schema_Node, root: Web_Schema_Node): Web_Schema_Union | null => {
  const options: Web_Schema_Node[] | undefined = schema['oneOf'] ?? schema['anyOf'];

  if (options === undefined || options.length < 2) {
    return null;
  }

  const resolvedOptions: Web_Schema_Node[] = options.map((option: Web_Schema_Node): Web_Schema_Node => resolveSchema(option, root));
  const first: Web_Schema_Node | undefined = resolvedOptions[0];

  if (first === undefined || first['properties'] === undefined) {
    return null;
  }

  /**
   * Schema - Fixed everywhere.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const fixedEverywhere = (key: string): boolean => resolvedOptions.every((option: Web_Schema_Node): boolean => {
    const property: Web_Schema_Node | undefined = (option['properties'] === undefined) ? undefined : option['properties'][key];

    return property !== undefined && (property['const'] !== undefined || (property['enum'] !== undefined && property['enum'].length === 1));
  });
  const marked: string | undefined = schema['x-discriminator'];
  const discriminator: string | undefined = (marked !== undefined && fixedEverywhere(marked)) ? marked : Object.keys(first['properties']).find(fixedEverywhere);

  return (discriminator === undefined) ? null : {
    discriminator,
    options: resolvedOptions,
  };
};

// constantOf reads the fixed value of a discriminator property.

/**
 * Schema - Constant of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const constantOf = (schema: Web_Schema_Node | undefined): unknown => {
  if (schema === undefined) {
    return undefined;
  }

  if (schema['const'] !== undefined) {
    return schema['const'];
  }

  return (schema['enum'] === undefined) ? undefined : schema['enum'][0];
};

// unionOptionIndex picks the union option that matches a value's discriminator.

/**
 * Schema - Union option index.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const unionOptionIndex = (union: Web_Schema_Union, value: unknown): number => {
  if (!isRecord(value)) {
    return 0;
  }

  const index: number = union['options'].findIndex((option: Web_Schema_Node): boolean => {
    const property: Web_Schema_Node | undefined = (option['properties'] === undefined) ? undefined : option['properties'][union['discriminator']];

    return constantOf(property) === value[union['discriminator']];
  });

  return (index === -1) ? 0 : index;
};

// clone copies JSON data without sharing nested objects.

/**
 * Schema - Clone.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const clone = <Value>(value: Value): Value => ((value === undefined) ? value : structuredClone(value));

// defaultValue builds the starting value for a new field, row, or union option.

/**
 * Schema - Default value.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const defaultValue = (input: Web_Schema_Node, root: Web_Schema_Node): unknown => {
  const unwrapped: Web_Schema_Unwrapped = unwrapNullable(resolveSchema(input, root), root);
  const schema: Web_Schema_Node = unwrapped['schema'];

  if (schema['default'] !== undefined) {
    return clone(schema['default']);
  }

  if (schema['const'] !== undefined) {
    return schema['const'];
  }

  if (unwrapped['nullable']) {
    return null;
  }

  if (isSecretSchema(schema)) {
    return { $secret: '' };
  }

  const union: Web_Schema_Union | null = unionOf(schema, root);

  if (union !== null) {
    return defaultValue(union['options'][0] ?? {}, root);
  }

  const type: Web_Schema_TypeName | undefined = schemaTypes(schema)[0];

  if (type === 'object') {
    const result: Record<string, unknown> = {};
    const required: string[] = schema['required'] ?? [];

    for (const [
      key,
      property,
    ] of Object.entries(schema['properties'] ?? {})) {
      const resolvedProperty: Web_Schema_Node = resolveSchema(property, root);

      if (required.includes(key) || resolvedProperty['default'] !== undefined) {
        const propertyValue: unknown = defaultValue(resolvedProperty, root);

        if (propertyValue !== undefined) {
          result[key] = propertyValue;
        }
      }
    }

    return result;
  }

  if (type === 'array') {
    const minimum: number = schema['minItems'] ?? 0;
    const items: Web_Schema_Node = resolveSchema(schema['items'], root);
    const itemTypes: Web_Schema_TypeName[] = schemaTypes(items);

    if (minimum > 0 && (itemTypes.includes('object') || unionOf(items, root) !== null)) {
      return Array.from({ length: minimum }, (): unknown => defaultValue(items, root));
    }

    return [];
  }

  if (type === 'boolean') {
    return false;
  }

  if (type === 'number' || type === 'integer') {
    return schema['minimum'];
  }

  if (type === 'string') {
    return '';
  }

  return undefined;
};

// stripSecrets copies a value with every secret reference emptied, for copied rows.

/**
 * Schema - Strip secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const stripSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((entry: unknown): unknown => stripSecrets(entry));
  }

  if (!isRecord(value)) {
    return value;
  }

  if (typeof value['$secret'] === 'string') {
    return { $secret: '' };
  }

  return Object.fromEntries(Object.entries(value).map(([
    key,
    entry,
  ]: [string, unknown,
  ]): [string, unknown] => [
    key,
    stripSecrets(entry),
  ]));
};

// toPointer turns a path into a JSON pointer such as /0/webhook/webhook-url.

/**
 * Schema - To pointer.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const toPointer = (path: Web_Schema_Path): string => path
  .map((segment: number | string): string => `/${String(segment).replaceAll('~', '~0').replaceAll('/', '~1')}`)
  .join('');

// pathKey turns a path into the dotted form API issues use.

/**
 * Schema - Path key.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const pathKey = (path: Web_Schema_Path): string => path.map((segment: number | string): string => String(segment)).join('.');

// separateSecrets removes typed secret values from a configuration and returns them by JSON pointer.

/**
 * Schema - Separate secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const separateSecrets = (value: unknown): Web_Schema_Separated => {
  const secrets: Record<string, string> = {};

  /**
   * Schema - Walk.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const walk = (entry: unknown, path: Web_Schema_Path): unknown => {
    if (Array.isArray(entry)) {
      return entry.map((item: unknown, index: number): unknown => walk(item, [
        ...path,
        index,
      ]));
    }

    if (!isRecord(entry)) {
      return entry;
    }

    if (typeof entry['$secret'] === 'string') {
      const draft: unknown = entry['__draft'];

      if (typeof draft === 'string' && draft !== '') {
        secrets[toPointer(path)] = draft;
      }

      return { $secret: entry['$secret'] };
    }

    return Object.fromEntries(Object.entries(entry).map(([
      key,
      item,
    ]: [string, unknown,
    ]): [string, unknown] => [
      key,
      walk(item, [
        ...path,
        key,
      ]),
    ]));
  };

  return {
    configuration: walk(value, []),
    secrets,
  };
};

// sameValue compares two JSON values by content.

/**
 * Schema - Same value.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const sameValue = (left: unknown, right: unknown): boolean => JSON.stringify(left) === JSON.stringify(right);

// countChanges counts the values that differ between two configurations, for the save bar.

/**
 * Schema - Count changes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const countChanges = (left: unknown, right: unknown): number => {
  if (sameValue(left, right)) {
    return 0;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    let count: number = Math.abs(left.length - right.length);

    for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
      count += countChanges(left[index], right[index]);
    }

    return count;
  }

  if (isRecord(left) && isRecord(right)) {
    if (typeof left['$secret'] === 'string' || typeof right['$secret'] === 'string') {
      return 1;
    }

    const keys: Set<string> = new Set([
      ...Object.keys(left),
      ...Object.keys(right),
    ]);
    let count: number = 0;

    for (const key of keys) {
      count += countChanges(left[key], right[key]);
    }

    return count;
  }

  return 1;
};

// pointerPath turns a JSON pointer such as /0/webhook back into a path.

/**
 * Schema - Pointer path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const pointerPath = (pointer: string): Web_Schema_Path => pointer
  .split('/')
  .slice(1)
  .map((segment: string): string => segment.replaceAll('~1', '/').replaceAll('~0', '~'));
