import type {
  Pool,
  QueryResult,
} from 'pg';

export type Lib_RuntimeLogStore_RuntimeLog_Component = 'bot' | 'web' | 'worker';
export type Lib_RuntimeLogStore_RuntimeLog_Level = 'debug' | 'error' | 'info' | 'warn';
export type Lib_RuntimeLogStore_RuntimeLog = {
  component: Lib_RuntimeLogStore_RuntimeLog_Component;
  context: Record<string, unknown>;
  event: string;
  id: string;
  level: Lib_RuntimeLogStore_RuntimeLog_Level;
  occurredAt: string;
};

export type Lib_RuntimeLogStore_LogLevelOrder = Lib_RuntimeLogStore_RuntimeLog_Level[];

export type Lib_RuntimeLogStore_ListRuntimeLogs_Pool = Pool;
export type Lib_RuntimeLogStore_ListRuntimeLogs_Filters = {
  after: string | undefined;
  component: Lib_RuntimeLogStore_RuntimeLog_Component;
  limit: number;
  minimumLevel: Lib_RuntimeLogStore_RuntimeLog_Level;
  search: string;
};
export type Lib_RuntimeLogStore_ListRuntimeLogs_Returns = Promise<Lib_RuntimeLogStore_RuntimeLog[]>;
export type Lib_RuntimeLogStore_ListRuntimeLogs_Levels = Lib_RuntimeLogStore_RuntimeLog_Level[];
export type Lib_RuntimeLogStore_ListRuntimeLogs_SearchPattern = string | null;
export type Lib_RuntimeLogStore_ListRuntimeLogs_Parameters = unknown[];
export type Lib_RuntimeLogStore_ListRuntimeLogs_Row = {
  component: Lib_RuntimeLogStore_RuntimeLog_Component;
  context: Record<string, unknown>;
  event: string;
  id: string;
  level: Lib_RuntimeLogStore_RuntimeLog_Level;
  occurred_at: Date;
};
export type Lib_RuntimeLogStore_ListRuntimeLogs_Rows = Lib_RuntimeLogStore_ListRuntimeLogs_Row[];
export type Lib_RuntimeLogStore_ListRuntimeLogs_Result = QueryResult<Lib_RuntimeLogStore_ListRuntimeLogs_Row> | undefined;
