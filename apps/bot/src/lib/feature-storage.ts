import type {
  Lib_FeatureStorage_AppendFeatureValue_ChildPath,
  Lib_FeatureStorage_AppendFeatureValue_Entries,
  Lib_FeatureStorage_AppendFeatureValue_Entry,
  Lib_FeatureStorage_AppendFeatureValue_EntryKey,
  Lib_FeatureStorage_AppendFeatureValue_EntryValue,
  Lib_FeatureStorage_AppendFeatureValue_Path,
  Lib_FeatureStorage_AppendFeatureValue_Returns,
  Lib_FeatureStorage_AppendFeatureValue_Rows,
  Lib_FeatureStorage_AppendFeatureValue_SerializedValue,
  Lib_FeatureStorage_AppendFeatureValue_Value,
  Lib_FeatureStorage_AppendFeatureValue_ValueType,
  Lib_FeatureStorage_CreateStoredValue_ParsedNumber,
  Lib_FeatureStorage_CreateStoredValue_Returns,
  Lib_FeatureStorage_CreateStoredValue_Row,
  Lib_FeatureStorage_DecodePath_Path,
  Lib_FeatureStorage_DecodePath_Returns,
  Lib_FeatureStorage_EncodePathSegment_Returns,
  Lib_FeatureStorage_EncodePathSegment_Segment,
  Lib_FeatureStorage_FlattenFeatureConfiguration_Configuration,
  Lib_FeatureStorage_FlattenFeatureConfiguration_Returns,
  Lib_FeatureStorage_FlattenFeatureConfiguration_Rows,
  Lib_FeatureStorage_InflateFeatureConfiguration_Child,
  Lib_FeatureStorage_InflateFeatureConfiguration_FinalSegment,
  Lib_FeatureStorage_InflateFeatureConfiguration_Parent,
  Lib_FeatureStorage_InflateFeatureConfiguration_Returns,
  Lib_FeatureStorage_InflateFeatureConfiguration_Root,
  Lib_FeatureStorage_InflateFeatureConfiguration_RootRow,
  Lib_FeatureStorage_InflateFeatureConfiguration_Rows,
  Lib_FeatureStorage_InflateFeatureConfiguration_Segment,
  Lib_FeatureStorage_InflateFeatureConfiguration_Segments,
  Lib_FeatureStorage_InflateFeatureConfiguration_SortedRows,
  Lib_FeatureStorage_InflateFeatureConfiguration_Value,
  Lib_FeatureStorage_IsRecord_Record,
  Lib_FeatureStorage_IsRecord_Value,
} from '../types/lib/feature-storage.d.ts';

/**
 * Feature Storage - Append Feature Value.
 *
 * Flattens one JSON-compatible configuration value into typed path rows.
 * Container rows preserve empty objects and arrays without storing a JSON blob.
 *
 * @param {Lib_FeatureStorage_AppendFeatureValue_Value} value - Value.
 * @param {Lib_FeatureStorage_AppendFeatureValue_Path}  path  - Path.
 * @param {Lib_FeatureStorage_AppendFeatureValue_Rows}  rows  - Rows.
 *
 * @returns {Lib_FeatureStorage_AppendFeatureValue_Returns}
 *
 * @since 4.0.0
 */
function appendFeatureValue(
  value: Lib_FeatureStorage_AppendFeatureValue_Value,
  path: Lib_FeatureStorage_AppendFeatureValue_Path,
  rows: Lib_FeatureStorage_AppendFeatureValue_Rows,
): Lib_FeatureStorage_AppendFeatureValue_Returns {
  if (value === null) {
    rows.push({
      path,
      type: 'null',
      value: undefined,
    });

    return;
  }

  if (Array.isArray(value) === true) {
    rows.push({
      path,
      type: 'array',
      value: undefined,
    });

    for (let index = 0; index < value.length; index += 1) {
      const childPath: Lib_FeatureStorage_AppendFeatureValue_ChildPath = `${path}/${index}`;

      appendFeatureValue(value[index], childPath, rows);
    }

    return;
  }

  if (isRecord(value) === true) {
    rows.push({
      path,
      type: 'object',
      value: undefined,
    });

    const entries: Lib_FeatureStorage_AppendFeatureValue_Entries = Object.entries(value);

    for (const entry of entries) {
      const typedEntry: Lib_FeatureStorage_AppendFeatureValue_Entry = entry;
      const key: Lib_FeatureStorage_AppendFeatureValue_EntryKey = typedEntry[0];
      const childValue: Lib_FeatureStorage_AppendFeatureValue_EntryValue = typedEntry[1];
      const childPath: Lib_FeatureStorage_AppendFeatureValue_ChildPath = `${path}/${encodePathSegment(key)}`;

      appendFeatureValue(childValue, childPath, rows);
    }

    return;
  }

  const valueType: Lib_FeatureStorage_AppendFeatureValue_ValueType = typeof value;

  if (
    valueType === 'boolean'
    || valueType === 'number'
    || valueType === 'string'
  ) {
    if (valueType === 'number' && Number.isFinite(value) === false) {
      throw new Error('Feature configuration numbers must be finite.');
    }

    const serializedValue: Lib_FeatureStorage_AppendFeatureValue_SerializedValue = String(value);

    rows.push({
      path,
      type: valueType,
      value: serializedValue,
    });
  } else {
    throw new Error('Feature configuration contains a value that cannot be stored.');
  }

  return;
}

/**
 * Feature Storage - Create Stored Value.
 *
 * Restores one typed scalar or container from its normalized database row.
 * Invalid database state fails closed before it reaches a feature compiler.
 *
 * @param {Lib_FeatureStorage_CreateStoredValue_Row} row - Row.
 *
 * @returns {Lib_FeatureStorage_CreateStoredValue_Returns}
 *
 * @since 4.0.0
 */
function createStoredValue(
  row: Lib_FeatureStorage_CreateStoredValue_Row,
): Lib_FeatureStorage_CreateStoredValue_Returns {
  switch (row['type']) {
    case 'array': {
      return [];
    }

    case 'boolean': {
      if (row['value'] !== 'true' && row['value'] !== 'false') {
        throw new Error(`Invalid stored boolean at ${row['path']}.`);
      }

      return row['value'] === 'true';
    }

    case 'null': {
      return null;
    }

    case 'number': {
      const parsedNumber: Lib_FeatureStorage_CreateStoredValue_ParsedNumber = Number(row['value']);

      if (Number.isFinite(parsedNumber) === false) {
        throw new Error(`Invalid stored number at ${row['path']}.`);
      }

      return parsedNumber;
    }

    case 'object': {
      return {};
    }

    case 'string': {
      return row['value'] ?? '';
    }

    default: {
      throw new Error(`Unsupported stored feature type at ${row['path']}.`);
    }
  }
}

/**
 * Feature Storage - Decode Path.
 *
 * Converts the storage-safe JSON pointer subset back to property segments.
 * Root paths return no segments and malformed paths are rejected.
 *
 * @param {Lib_FeatureStorage_DecodePath_Path} path - Path.
 *
 * @returns {Lib_FeatureStorage_DecodePath_Returns}
 *
 * @since 4.0.0
 */
function decodePath(path: Lib_FeatureStorage_DecodePath_Path): Lib_FeatureStorage_DecodePath_Returns {
  if (path === '$') {
    return [];
  }

  if (path.startsWith('$/') === false) {
    throw new Error(`Invalid stored feature path: ${path}`);
  }

  return path.slice(2).split('/').map(
    (segment) => segment.replaceAll('~1', '/').replaceAll('~0', '~'),
  );
}

/**
 * Feature Storage - Encode Path Segment.
 *
 * Escapes property names using the JSON Pointer escape sequence.
 * The dollar-prefixed root remains unambiguous for database constraints.
 *
 * @param {Lib_FeatureStorage_EncodePathSegment_Segment} segment - Segment.
 *
 * @returns {Lib_FeatureStorage_EncodePathSegment_Returns}
 *
 * @since 4.0.0
 */
function encodePathSegment(
  segment: Lib_FeatureStorage_EncodePathSegment_Segment,
): Lib_FeatureStorage_EncodePathSegment_Returns {
  return segment.replaceAll('~', '~0').replaceAll('/', '~1');
}

/**
 * Feature Storage - Flatten Feature Configuration.
 *
 * Produces normalized rows for transactionally replacing one feature's fields.
 * No complete feature configuration is serialized into one database value.
 *
 * @param {Lib_FeatureStorage_FlattenFeatureConfiguration_Configuration} configuration - Configuration.
 *
 * @returns {Lib_FeatureStorage_FlattenFeatureConfiguration_Returns}
 *
 * @since 4.0.0
 */
export function flattenFeatureConfiguration(
  configuration: Lib_FeatureStorage_FlattenFeatureConfiguration_Configuration,
): Lib_FeatureStorage_FlattenFeatureConfiguration_Returns {
  const rows: Lib_FeatureStorage_FlattenFeatureConfiguration_Rows = [];

  appendFeatureValue(configuration, '$', rows);

  return rows;
}

/**
 * Feature Storage - Inflate Feature Configuration.
 *
 * Reconstructs the runtime object expected by existing feature validators.
 * Parent containers are created before their normalized child fields.
 *
 * @param {Lib_FeatureStorage_InflateFeatureConfiguration_Rows} rows - Rows.
 *
 * @returns {Lib_FeatureStorage_InflateFeatureConfiguration_Returns}
 *
 * @since 4.0.0
 */
export function inflateFeatureConfiguration(
  rows: Lib_FeatureStorage_InflateFeatureConfiguration_Rows,
): Lib_FeatureStorage_InflateFeatureConfiguration_Returns {
  const rootRow: Lib_FeatureStorage_InflateFeatureConfiguration_RootRow = rows.find(
    (row) => row['path'] === '$',
  );

  if (rootRow === undefined) {
    return {};
  }

  const root: Lib_FeatureStorage_InflateFeatureConfiguration_Root = createStoredValue(rootRow);
  const sortedRows: Lib_FeatureStorage_InflateFeatureConfiguration_SortedRows = [...rows]
    .filter((row) => row['path'] !== '$')
    .sort((left, right) => decodePath(left['path']).length - decodePath(right['path']).length);

  for (const row of sortedRows) {
    const segments: Lib_FeatureStorage_InflateFeatureConfiguration_Segments = decodePath(row['path']);
    let parent: Lib_FeatureStorage_InflateFeatureConfiguration_Parent = root;

    for (let index = 0; index < segments.length - 1; index += 1) {
      const segment: Lib_FeatureStorage_InflateFeatureConfiguration_Segment = segments[index] ?? '';
      let child: Lib_FeatureStorage_InflateFeatureConfiguration_Child = undefined;

      if (Array.isArray(parent) === true) {
        child = parent[Number.parseInt(segment, 10)];
      } else if (isRecord(parent) === true) {
        child = parent[segment];
      } else {
        throw new Error(`Stored feature path has a scalar parent: ${row['path']}`);
      }

      parent = child;
    }

    const finalSegment: Lib_FeatureStorage_InflateFeatureConfiguration_FinalSegment = segments.at(-1) ?? '';
    const value: Lib_FeatureStorage_InflateFeatureConfiguration_Value = createStoredValue(row);

    if (Array.isArray(parent) === true) {
      Reflect.set(parent, Number.parseInt(finalSegment, 10), value);
    } else if (isRecord(parent) === true) {
      Reflect.set(parent, finalSegment, value);
    } else {
      throw new Error(`Stored feature path has a scalar destination: ${row['path']}`);
    }
  }

  return root;
}

/**
 * Feature Storage - Is Record.
 *
 * Narrows unknown values to mutable JSON object containers.
 * Arrays remain distinct so numeric path segments cannot become object keys.
 *
 * @param {Lib_FeatureStorage_IsRecord_Value} value - Value.
 *
 * @returns {Lib_FeatureStorage_IsRecord_Returns}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_FeatureStorage_IsRecord_Value,
): value is Lib_FeatureStorage_IsRecord_Record {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}
