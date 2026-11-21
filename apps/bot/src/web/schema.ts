import {
  camelCaseBoundaryPattern,
  schemaReferencePattern,
  wordSeparatorsPattern,
} from '@/web/regex.js';

import type {
  Web_Schema_Acronyms,
  Web_Schema_ConstantOf_Returns,
  Web_Schema_ConstantOf_Schema,
  Web_Schema_CountChanges_Count,
  Web_Schema_CountChanges_Keys,
  Web_Schema_CountChanges_Left,
  Web_Schema_CountChanges_Returns,
  Web_Schema_CountChanges_Right,
  Web_Schema_DefaultValue_Input,
  Web_Schema_DefaultValue_Items,
  Web_Schema_DefaultValue_ItemTypes,
  Web_Schema_DefaultValue_Key,
  Web_Schema_DefaultValue_Minimum,
  Web_Schema_DefaultValue_Property,
  Web_Schema_DefaultValue_PropertyValue,
  Web_Schema_DefaultValue_Required,
  Web_Schema_DefaultValue_ResolvedProperty,
  Web_Schema_DefaultValue_Result,
  Web_Schema_DefaultValue_Returns,
  Web_Schema_DefaultValue_Root,
  Web_Schema_DefaultValue_Schema,
  Web_Schema_DefaultValue_Type,
  Web_Schema_DefaultValue_Union,
  Web_Schema_DefaultValue_Unwrapped,
  Web_Schema_IsHidden_Returns,
  Web_Schema_IsHidden_Schema,
  Web_Schema_IsRecord_TypeGuard,
  Web_Schema_IsRecord_Value,
  Web_Schema_IsSecretSchema_Properties,
  Web_Schema_IsSecretSchema_Returns,
  Web_Schema_IsSecretSchema_Schema,
  Web_Schema_PathKey_Path,
  Web_Schema_PathKey_Returns,
  Web_Schema_PointerPath_Pointer,
  Web_Schema_PointerPath_Returns,
  Web_Schema_PointerPath_Segments,
  Web_Schema_ResolveSchema_Container,
  Web_Schema_ResolveSchema_ContainerKey,
  Web_Schema_ResolveSchema_Guard,
  Web_Schema_ResolveSchema_Match,
  Web_Schema_ResolveSchema_Merged,
  Web_Schema_ResolveSchema_Parts,
  Web_Schema_ResolveSchema_Reference,
  Web_Schema_ResolveSchema_Resolved,
  Web_Schema_ResolveSchema_Rest,
  Web_Schema_ResolveSchema_Returns,
  Web_Schema_ResolveSchema_Root,
  Web_Schema_ResolveSchema_Schema,
  Web_Schema_ResolveSchema_Target,
  Web_Schema_SameValue_Left,
  Web_Schema_SameValue_Returns,
  Web_Schema_SameValue_Right,
  Web_Schema_SchemaTypes_Returns,
  Web_Schema_SchemaTypes_Schema,
  Web_Schema_SeparateSecrets_Returns,
  Web_Schema_SeparateSecrets_Secrets,
  Web_Schema_SeparateSecrets_Value,
  Web_Schema_SeparateSecrets_Walk,
  Web_Schema_SeparateSecrets_Walk_Draft,
  Web_Schema_SeparateSecrets_Walk_Entry,
  Web_Schema_SeparateSecrets_Walk_Item,
  Web_Schema_SeparateSecrets_Walk_Key,
  Web_Schema_SeparateSecrets_Walk_Path,
  Web_Schema_SeparateSecrets_Walk_Returns,
  Web_Schema_StripSecrets_Entry,
  Web_Schema_StripSecrets_Key,
  Web_Schema_StripSecrets_Returns,
  Web_Schema_StripSecrets_Value,
  Web_Schema_TitleCase_Acronym,
  Web_Schema_TitleCase_Key,
  Web_Schema_TitleCase_Lower,
  Web_Schema_TitleCase_Returns,
  Web_Schema_TitleCase_Words,
  Web_Schema_ToPointer_Path,
  Web_Schema_ToPointer_Returns,
  Web_Schema_UnionOf_Discriminator,
  Web_Schema_UnionOf_First,
  Web_Schema_UnionOf_FixedEverywhere,
  Web_Schema_UnionOf_FixedEverywhere_Key,
  Web_Schema_UnionOf_FixedEverywhere_Property,
  Web_Schema_UnionOf_FixedEverywhere_Returns,
  Web_Schema_UnionOf_Marked,
  Web_Schema_UnionOf_Options,
  Web_Schema_UnionOf_ResolvedOptions,
  Web_Schema_UnionOf_Returns,
  Web_Schema_UnionOf_Root,
  Web_Schema_UnionOf_Schema,
  Web_Schema_UnionOptionIndex_Index,
  Web_Schema_UnionOptionIndex_Property,
  Web_Schema_UnionOptionIndex_Returns,
  Web_Schema_UnionOptionIndex_Union,
  Web_Schema_UnionOptionIndex_Value,
  Web_Schema_UnwrapNullable_Inner,
  Web_Schema_UnwrapNullable_NullIndex,
  Web_Schema_UnwrapNullable_Options,
  Web_Schema_UnwrapNullable_ResolvedOptions,
  Web_Schema_UnwrapNullable_Rest,
  Web_Schema_UnwrapNullable_Returns,
  Web_Schema_UnwrapNullable_Root,
  Web_Schema_UnwrapNullable_Schema,
  Web_Schema_UnwrapNullable_Types,
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
const acronyms: Web_Schema_Acronyms = {
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
 * Schema - Is Record.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_IsRecord_Value} value - Value.
 *
 * @returns {Web_Schema_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
export const isRecord = (value: Web_Schema_IsRecord_Value): value is Web_Schema_IsRecord_TypeGuard => (
  typeof value === 'object'
  && value !== null
  && Array.isArray(value) === false
);

// titleCase turns a stored key such as "channel-id" into a label such as "Channel ID".

/**
 * Schema - Title Case.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_TitleCase_Key} key - Key.
 *
 * @returns {Web_Schema_TitleCase_Returns}
 *
 * @since 4.0.0
 */
export const titleCase = (key: Web_Schema_TitleCase_Key): Web_Schema_TitleCase_Returns => {
  const words: Web_Schema_TitleCase_Words = key
    .replace(new RegExp(camelCaseBoundaryPattern, 'gu'), '$1 $2')
    .split(new RegExp(wordSeparatorsPattern, 'u'))
    .filter((word) => word !== '');

  return words.map((word, index) => {
    const lower: Web_Schema_TitleCase_Lower = word.toLowerCase();
    const acronym: Web_Schema_TitleCase_Acronym = acronyms[lower];

    if (acronym !== undefined) {
      return acronym;
    }

    return (index === 0) ? `${lower.charAt(0).toUpperCase()}${lower.slice(1)}` : lower;
  }).join(' ');
};

// resolveSchema follows local references and folds allOf parts into one node.

/**
 * Schema - Resolve Schema.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_ResolveSchema_Schema} schema - Schema.
 * @param {Web_Schema_ResolveSchema_Root}   root   - Root.
 *
 * @returns {Web_Schema_ResolveSchema_Returns}
 *
 * @since 4.0.0
 */
export const resolveSchema = (schema: Web_Schema_ResolveSchema_Schema, root: Web_Schema_ResolveSchema_Root): Web_Schema_ResolveSchema_Returns => {
  if (schema === undefined) {
    return {};
  }

  let resolved: Web_Schema_ResolveSchema_Resolved = schema;
  let guard: Web_Schema_ResolveSchema_Guard = 0;

  while (resolved['$ref'] !== undefined && guard < 16) {
    const reference: Web_Schema_ResolveSchema_Reference = resolved['$ref'];
    const match: Web_Schema_ResolveSchema_Match = new RegExp(schemaReferencePattern, 'u').exec(reference);
    const container: Web_Schema_ResolveSchema_Container = (match === null) ? undefined : root[match[1] as Web_Schema_ResolveSchema_ContainerKey];
    const target: Web_Schema_ResolveSchema_Target = (match === null || container === undefined) ? undefined : container[decodeURIComponent(match[2] ?? '')];

    if (target === undefined) {
      break;
    }

    const rest: Web_Schema_ResolveSchema_Rest = { ...resolved };

    Reflect.deleteProperty(rest, '$ref');

    resolved = {
      ...target,
      ...rest,
    };
    guard += 1;
  }

  if (resolved['allOf'] !== undefined) {
    const parts: Web_Schema_ResolveSchema_Parts = resolved['allOf'].map((part) => resolveSchema(part, root));
    const rest: Web_Schema_ResolveSchema_Rest = { ...resolved };

    Reflect.deleteProperty(rest, 'allOf');

    let merged: Web_Schema_ResolveSchema_Merged = rest;

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
 * Schema - Types.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_SchemaTypes_Schema} schema - Schema.
 *
 * @returns {Web_Schema_SchemaTypes_Returns}
 *
 * @since 4.0.0
 */
export const schemaTypes = (schema: Web_Schema_SchemaTypes_Schema): Web_Schema_SchemaTypes_Returns => {
  if (Array.isArray(schema['type']) === true) {
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

  if (
    schema['enum'] !== undefined
    && schema['enum'].every((entry) => typeof entry === 'string') === true
  ) {
    return ['string'];
  }

  if (typeof schema['const'] === 'string') {
    return ['string'];
  }

  return [];
};

// unwrapNullable returns the non-null option of an "X or null" node and whether null is allowed.

/**
 * Schema - Unwrap Nullable.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_UnwrapNullable_Schema} schema - Schema.
 * @param {Web_Schema_UnwrapNullable_Root}   root   - Root.
 *
 * @returns {Web_Schema_UnwrapNullable_Returns}
 *
 * @since 4.0.0
 */
export const unwrapNullable = (schema: Web_Schema_UnwrapNullable_Schema, root: Web_Schema_UnwrapNullable_Root): Web_Schema_UnwrapNullable_Returns => {
  const options: Web_Schema_UnwrapNullable_Options = schema['anyOf'] ?? schema['oneOf'];

  if (options !== undefined && options.length === 2) {
    const resolvedOptions: Web_Schema_UnwrapNullable_ResolvedOptions = options.map((option) => resolveSchema(option, root));
    const nullIndex: Web_Schema_UnwrapNullable_NullIndex = resolvedOptions.findIndex((option) => {
      const types: Web_Schema_UnwrapNullable_Types = schemaTypes(option);

      return types.length === 1 && types[0] === 'null';
    });

    if (nullIndex !== -1) {
      const inner: Web_Schema_UnwrapNullable_Inner = resolvedOptions[(nullIndex === 0) ? 1 : 0] ?? {};
      const rest: Web_Schema_UnwrapNullable_Rest = { ...schema };

      Reflect.deleteProperty(rest, 'anyOf');

      Reflect.deleteProperty(rest, 'oneOf');

      return {
        nullable: true,
        schema: {
          ...inner,
          ...rest,
        },
      };
    }
  }

  const types: Web_Schema_UnwrapNullable_Types = schemaTypes(schema);

  if (types.length === 2 && types.includes('null') === true) {
    return {
      nullable: true,
      schema: {
        ...schema,
        type: types.find((type) => type !== 'null') ?? 'string',
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
 * Schema - Is Hidden.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_IsHidden_Schema} schema - Schema.
 *
 * @returns {Web_Schema_IsHidden_Returns}
 *
 * @since 4.0.0
 */
export const isHidden = (schema: Web_Schema_IsHidden_Schema): Web_Schema_IsHidden_Returns => schema !== undefined && schema['x-hidden'] === true;

// isSecretSchema spots a write-only secret: an object whose only property is "$secret".

/**
 * Schema - Is Secret Schema.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_IsSecretSchema_Schema} schema - Schema.
 *
 * @returns {Web_Schema_IsSecretSchema_Returns}
 *
 * @since 4.0.0
 */
export const isSecretSchema = (schema: Web_Schema_IsSecretSchema_Schema): Web_Schema_IsSecretSchema_Returns => {
  if (schema['x-widget'] === 'secret') {
    return true;
  }

  const properties: Web_Schema_IsSecretSchema_Properties = schema['properties'];

  return (
    properties !== undefined
    && Object.keys(properties).length === 1
    && properties['$secret'] !== undefined
  );
};

// unionOf describes a union of objects that share one constant property, such as "method".

/**
 * Schema - Union Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_UnionOf_Schema} schema - Schema.
 * @param {Web_Schema_UnionOf_Root}   root   - Root.
 *
 * @returns {Web_Schema_UnionOf_Returns}
 *
 * @since 4.0.0
 */
export const unionOf = (schema: Web_Schema_UnionOf_Schema, root: Web_Schema_UnionOf_Root): Web_Schema_UnionOf_Returns => {
  const options: Web_Schema_UnionOf_Options = schema['oneOf'] ?? schema['anyOf'];

  if (options === undefined || options.length < 2) {
    return null;
  }

  const resolvedOptions: Web_Schema_UnionOf_ResolvedOptions = options.map((option) => resolveSchema(option, root));
  const first: Web_Schema_UnionOf_First = resolvedOptions[0];

  if (first === undefined || first['properties'] === undefined) {
    return null;
  }

  /**
   * Schema - Fixed Everywhere.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_Schema_UnionOf_FixedEverywhere_Key} key - Key.
   *
   * @returns {Web_Schema_UnionOf_FixedEverywhere_Returns}
   *
   * @since 4.0.0
   */
  const fixedEverywhere: Web_Schema_UnionOf_FixedEverywhere = (key: Web_Schema_UnionOf_FixedEverywhere_Key): Web_Schema_UnionOf_FixedEverywhere_Returns => resolvedOptions.every((option) => {
    const property: Web_Schema_UnionOf_FixedEverywhere_Property = (option['properties'] === undefined) ? undefined : option['properties'][key];

    return (
      property !== undefined
      && (
        property['const'] !== undefined
        || (
          property['enum'] !== undefined
          && property['enum'].length === 1
        )
      )
    );
  });
  const marked: Web_Schema_UnionOf_Marked = schema['x-discriminator'];
  const discriminator: Web_Schema_UnionOf_Discriminator = (marked !== undefined && fixedEverywhere(marked) === true) ? marked : Object.keys(first['properties']).find(fixedEverywhere);

  return (discriminator === undefined) ? null : {
    discriminator,
    options: resolvedOptions,
  };
};

// constantOf reads the fixed value of a discriminator property.

/**
 * Schema - Constant Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_ConstantOf_Schema} schema - Schema.
 *
 * @returns {Web_Schema_ConstantOf_Returns}
 *
 * @since 4.0.0
 */
export const constantOf = (schema: Web_Schema_ConstantOf_Schema): Web_Schema_ConstantOf_Returns => {
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
 * Schema - Union Option Index.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_UnionOptionIndex_Union} union - Union.
 * @param {Web_Schema_UnionOptionIndex_Value} value - Value.
 *
 * @returns {Web_Schema_UnionOptionIndex_Returns}
 *
 * @since 4.0.0
 */
export const unionOptionIndex = (union: Web_Schema_UnionOptionIndex_Union, value: Web_Schema_UnionOptionIndex_Value): Web_Schema_UnionOptionIndex_Returns => {
  if (isRecord(value) === false) {
    return 0;
  }

  const index: Web_Schema_UnionOptionIndex_Index = union['options'].findIndex((option) => {
    const property: Web_Schema_UnionOptionIndex_Property = (option['properties'] === undefined) ? undefined : option['properties'][union['discriminator']];

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
 * @param {Value} value - Value.
 *
 * @returns {Value}
 *
 * @since 4.0.0
 */
export const clone = <Value>(value: Value): Value => ((value === undefined) ? value : structuredClone(value));

// defaultValue builds the starting value for a new field, row, or union option.

/**
 * Schema - Default Value.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_DefaultValue_Input} input - Input.
 * @param {Web_Schema_DefaultValue_Root}  root  - Root.
 *
 * @returns {Web_Schema_DefaultValue_Returns}
 *
 * @since 4.0.0
 */
export const defaultValue = (input: Web_Schema_DefaultValue_Input, root: Web_Schema_DefaultValue_Root): Web_Schema_DefaultValue_Returns => {
  const unwrapped: Web_Schema_DefaultValue_Unwrapped = unwrapNullable(resolveSchema(input, root), root);
  const schema: Web_Schema_DefaultValue_Schema = unwrapped['schema'];

  if (schema['default'] !== undefined) {
    return clone(schema['default']);
  }

  if (schema['const'] !== undefined) {
    return schema['const'];
  }

  if (unwrapped['nullable'] === true) {
    return null;
  }

  if (isSecretSchema(schema) === true) {
    return { $secret: '' };
  }

  const union: Web_Schema_DefaultValue_Union = unionOf(schema, root);

  if (union !== null) {
    return defaultValue(union['options'][0] ?? {}, root);
  }

  const type: Web_Schema_DefaultValue_Type = schemaTypes(schema)[0];

  if (type === 'object') {
    const result: Web_Schema_DefaultValue_Result = {};
    const required: Web_Schema_DefaultValue_Required = schema['required'] ?? [];

    for (const propertyEntry of Object.entries(schema['properties'] ?? {})) {
      const key: Web_Schema_DefaultValue_Key = propertyEntry[0];
      const property: Web_Schema_DefaultValue_Property = propertyEntry[1];
      const resolvedProperty: Web_Schema_DefaultValue_ResolvedProperty = resolveSchema(property, root);

      if (required.includes(key) === true || resolvedProperty['default'] !== undefined) {
        const propertyValue: Web_Schema_DefaultValue_PropertyValue = defaultValue(resolvedProperty, root);

        if (propertyValue !== undefined) {
          Reflect.set(result, key, propertyValue);
        }
      }
    }

    return result;
  }

  if (type === 'array') {
    const minimum: Web_Schema_DefaultValue_Minimum = schema['minItems'] ?? 0;
    const items: Web_Schema_DefaultValue_Items = resolveSchema(schema['items'], root);
    const itemTypes: Web_Schema_DefaultValue_ItemTypes = schemaTypes(items);

    if (
      minimum > 0
      && (
        itemTypes.includes('object') === true
        || unionOf(items, root) !== null
      )
    ) {
      return Array.from({ length: minimum }, () => defaultValue(items, root));
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
 * Schema - Strip Secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_StripSecrets_Value} value - Value.
 *
 * @returns {Web_Schema_StripSecrets_Returns}
 *
 * @since 4.0.0
 */
export const stripSecrets = (value: Web_Schema_StripSecrets_Value): Web_Schema_StripSecrets_Returns => {
  if (Array.isArray(value) === true) {
    return value.map((entry) => stripSecrets(entry));
  }

  if (isRecord(value) === false) {
    return value;
  }

  if (typeof value['$secret'] === 'string') {
    return { $secret: '' };
  }

  return Object.fromEntries(Object.entries(value).map((valueEntry) => {
    const key: Web_Schema_StripSecrets_Key = valueEntry[0];
    const entry: Web_Schema_StripSecrets_Entry = valueEntry[1];

    return [
      key,
      stripSecrets(entry),
    ];
  }));
};

// toPointer turns a path into a JSON pointer such as /0/webhook/webhook-url.

/**
 * Schema - To Pointer.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_ToPointer_Path} path - Path.
 *
 * @returns {Web_Schema_ToPointer_Returns}
 *
 * @since 4.0.0
 */
export const toPointer = (path: Web_Schema_ToPointer_Path): Web_Schema_ToPointer_Returns => path
  .map((segment) => `/${String(segment).replaceAll('~', '~0').replaceAll('/', '~1')}`)
  .join('');

// pathKey turns a path into the dotted form API issues use.

/**
 * Schema - Path Key.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_PathKey_Path} path - Path.
 *
 * @returns {Web_Schema_PathKey_Returns}
 *
 * @since 4.0.0
 */
export const pathKey = (path: Web_Schema_PathKey_Path): Web_Schema_PathKey_Returns => path.map((segment) => String(segment)).join('.');

// separateSecrets removes typed secret values from a configuration and returns them by JSON pointer.

/**
 * Schema - Separate Secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_SeparateSecrets_Value} value - Value.
 *
 * @returns {Web_Schema_SeparateSecrets_Returns}
 *
 * @since 4.0.0
 */
export const separateSecrets = (value: Web_Schema_SeparateSecrets_Value): Web_Schema_SeparateSecrets_Returns => {
  const secrets: Web_Schema_SeparateSecrets_Secrets = {};

  /**
   * Schema - Walk.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_Schema_SeparateSecrets_Walk_Entry} entry - Entry.
   * @param {Web_Schema_SeparateSecrets_Walk_Path}  path  - Path.
   *
   * @returns {Web_Schema_SeparateSecrets_Walk_Returns}
   *
   * @since 4.0.0
   */
  const walk: Web_Schema_SeparateSecrets_Walk = (entry: Web_Schema_SeparateSecrets_Walk_Entry, path: Web_Schema_SeparateSecrets_Walk_Path): Web_Schema_SeparateSecrets_Walk_Returns => {
    if (Array.isArray(entry) === true) {
      return entry.map((item, index) => walk(item, [
        ...path,
        index,
      ]));
    }

    if (isRecord(entry) === false) {
      return entry;
    }

    if (typeof entry['$secret'] === 'string') {
      const draft: Web_Schema_SeparateSecrets_Walk_Draft = entry['__draft'];

      if (typeof draft === 'string' && draft !== '') {
        Reflect.set(secrets, toPointer(path), draft);
      }

      return { $secret: entry['$secret'] };
    }

    return Object.fromEntries(Object.entries(entry).map((entryItem) => {
      const key: Web_Schema_SeparateSecrets_Walk_Key = entryItem[0];
      const item: Web_Schema_SeparateSecrets_Walk_Item = entryItem[1];

      return [
        key,
        walk(item, [
          ...path,
          key,
        ]),
      ];
    }));
  };

  return {
    configuration: walk(value, []),
    secrets,
  };
};

// sameValue compares two JSON values by content.

/**
 * Schema - Same Value.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_SameValue_Left}  left  - Left.
 * @param {Web_Schema_SameValue_Right} right - Right.
 *
 * @returns {Web_Schema_SameValue_Returns}
 *
 * @since 4.0.0
 */
export const sameValue = (left: Web_Schema_SameValue_Left, right: Web_Schema_SameValue_Right): Web_Schema_SameValue_Returns => JSON.stringify(left) === JSON.stringify(right);

// countChanges counts the values that differ between two configurations, for the save bar.

/**
 * Schema - Count Changes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_CountChanges_Left}  left  - Left.
 * @param {Web_Schema_CountChanges_Right} right - Right.
 *
 * @returns {Web_Schema_CountChanges_Returns}
 *
 * @since 4.0.0
 */
export const countChanges = (left: Web_Schema_CountChanges_Left, right: Web_Schema_CountChanges_Right): Web_Schema_CountChanges_Returns => {
  if (sameValue(left, right) === true) {
    return 0;
  }

  if (Array.isArray(left) === true && Array.isArray(right) === true) {
    let count: Web_Schema_CountChanges_Count = Math.abs(left.length - right.length);

    for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
      count += countChanges(left[index], right[index]);
    }

    return count;
  }

  if (isRecord(left) === true && isRecord(right) === true) {
    if (typeof left['$secret'] === 'string' || typeof right['$secret'] === 'string') {
      return 1;
    }

    const keys: Web_Schema_CountChanges_Keys = new Set([
      ...Object.keys(left),
      ...Object.keys(right),
    ]);
    let count: Web_Schema_CountChanges_Count = 0;

    for (const key of keys) {
      count += countChanges(left[key], right[key]);
    }

    return count;
  }

  return 1;
};

// pointerPath turns a JSON pointer such as /0/webhook back into a path.

/**
 * Schema - Pointer Path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Schema_PointerPath_Pointer} pointer - Pointer.
 *
 * @returns {Web_Schema_PointerPath_Returns}
 *
 * @since 4.0.0
 */
export const pointerPath = (pointer: Web_Schema_PointerPath_Pointer): Web_Schema_PointerPath_Returns => {
  const segments: Web_Schema_PointerPath_Segments = pointer
    .split('/')
    .slice(1);

  return segments.map((segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'));
};
