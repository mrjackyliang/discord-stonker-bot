import type {
  Lib_RuntimeLogStore_ListRuntimeLogs_Filters,
  Lib_RuntimeLogStore_ListRuntimeLogs_Levels,
  Lib_RuntimeLogStore_ListRuntimeLogs_Parameters,
  Lib_RuntimeLogStore_ListRuntimeLogs_Pool,
  Lib_RuntimeLogStore_ListRuntimeLogs_Result,
  Lib_RuntimeLogStore_ListRuntimeLogs_Returns,
  Lib_RuntimeLogStore_ListRuntimeLogs_Rows,
  Lib_RuntimeLogStore_ListRuntimeLogs_SearchPattern,
  Lib_RuntimeLogStore_LogLevelOrder,
} from '../types/lib/runtime-log-store.d.ts';

/**
 * Runtime Log Store - Log Level Order.
 *
 * Orders levels from least to most severe so a minimum level includes everything above it.
 * Choosing warn therefore also shows errors.
 *
 * @since 4.0.0
 */
const logLevelOrder: Lib_RuntimeLogStore_LogLevelOrder = [
  'debug',
  'info',
  'warn',
  'error',
];

/**
 * Runtime Log Store - List Runtime Logs.
 *
 * Returns one process's newest entries, or the entries after a cursor in order.
 * A minimum level and a text search narrow the list on the database side.
 *
 * @param {Lib_RuntimeLogStore_ListRuntimeLogs_Pool}    pool    - Pool.
 * @param {Lib_RuntimeLogStore_ListRuntimeLogs_Filters} filters - Filters.
 *
 * @returns {Lib_RuntimeLogStore_ListRuntimeLogs_Returns}
 *
 * @since 4.0.0
 */
export async function listRuntimeLogs(
  pool: Lib_RuntimeLogStore_ListRuntimeLogs_Pool,
  filters: Lib_RuntimeLogStore_ListRuntimeLogs_Filters,
): Lib_RuntimeLogStore_ListRuntimeLogs_Returns {
  const levels: Lib_RuntimeLogStore_ListRuntimeLogs_Levels = logLevelOrder.slice(logLevelOrder.indexOf(filters['minimumLevel']));
  const searchPattern: Lib_RuntimeLogStore_ListRuntimeLogs_SearchPattern = (filters['search'] === '') ? null : `%${filters['search'].replaceAll('\\', '\\\\').replaceAll('%', '\\%').replaceAll('_', '\\_')}%`;
  const parameters: Lib_RuntimeLogStore_ListRuntimeLogs_Parameters = [
    filters['component'],
    levels,
    searchPattern,
    filters['limit'],
  ];
  let result: Lib_RuntimeLogStore_ListRuntimeLogs_Result = undefined;

  if (filters['after'] === undefined) {
    result = await pool.query(
      'SELECT id::text, component, level, event, context, occurred_at FROM (SELECT id, component, level, event, context, occurred_at FROM runtime_logs WHERE component = $1 AND level = ANY($2::text[]) AND ($3::text IS NULL OR event ILIKE $3 OR context::text ILIKE $3) ORDER BY id DESC LIMIT $4) AS recent ORDER BY id',
      parameters,
    );
  } else {
    result = await pool.query(
      'SELECT id::text, component, level, event, context, occurred_at FROM runtime_logs WHERE component = $1 AND level = ANY($2::text[]) AND ($3::text IS NULL OR event ILIKE $3 OR context::text ILIKE $3) AND id > $5 ORDER BY id LIMIT $4',
      [
        ...parameters,
        filters['after'],
      ],
    );
  }

  const rows: Lib_RuntimeLogStore_ListRuntimeLogs_Rows = result.rows;

  return rows.map((row) => ({
    component: row['component'],
    context: row['context'],
    event: row['event'],
    id: row['id'],
    level: row['level'],
    occurredAt: new Date(row['occurred_at']).toISOString(),
  }));
}
