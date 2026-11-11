import type express from 'express';
import type { ZodSafeParseResult } from 'zod';

import type {
  Lib_RuntimeLogStore_ListRuntimeLogs_Filters,
  Lib_RuntimeLogStore_RuntimeLog,
  Lib_RuntimeLogStore_RuntimeLog_Component,
  Lib_RuntimeLogStore_RuntimeLog_Level,
} from '../lib/runtime-log-store.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type { Shared_Principal } from '../shared.d.ts';

export type Routes_Logs_StreamPollMilliseconds = number;
export type Routes_Logs_StreamKeepAliveMilliseconds = number;

export type Routes_Logs_ReadFilters_Query = unknown;
export type Routes_Logs_ReadFilters_Response = express.Response;
export type Routes_Logs_ReadFilters_Returns = Lib_RuntimeLogStore_ListRuntimeLogs_Filters | undefined;
export type Routes_Logs_ReadFilters_Filters = ZodSafeParseResult<{
  after?: string | undefined;
  component: Lib_RuntimeLogStore_RuntimeLog_Component;
  level: Lib_RuntimeLogStore_RuntimeLog_Level;
  limit: number;
  q: string;
}>;

export type Routes_Logs_Runner_Access = Server_Access;
export type Routes_Logs_Runner_Context = Server_Context;
export type Routes_Logs_Runner_Constructor_Context = Server_Context;
export type Routes_Logs_Runner_Constructor_Access = Server_Access;
export type Routes_Logs_Runner_Register_App = express.Express;
export type Routes_Logs_Runner_Register_Returns = void;

export type Routes_Logs_Runner_RouteDiagnostics_Request = express.Request;
export type Routes_Logs_Runner_RouteDiagnostics_Response = express.Response;
export type Routes_Logs_Runner_RouteDiagnostics_Returns = Promise<void>;

export type Routes_Logs_Runner_RouteList_Request = express.Request;
export type Routes_Logs_Runner_RouteList_Response = express.Response;
export type Routes_Logs_Runner_RouteList_Returns = Promise<void>;
export type Routes_Logs_Runner_RouteList_Filters = Lib_RuntimeLogStore_ListRuntimeLogs_Filters | undefined;
export type Routes_Logs_Runner_RouteList_Items = Lib_RuntimeLogStore_RuntimeLog[];
export type Routes_Logs_Runner_RouteList_LastItem = Lib_RuntimeLogStore_RuntimeLog | undefined;

export type Routes_Logs_Runner_RouteStream_Request = express.Request;
export type Routes_Logs_Runner_RouteStream_Response = express.Response;
export type Routes_Logs_Runner_RouteStream_Returns = Promise<void>;
export type Routes_Logs_Runner_RouteStream_Filters = Lib_RuntimeLogStore_ListRuntimeLogs_Filters | undefined;
export type Routes_Logs_Runner_RouteStream_LastEventId = string | undefined;
export type Routes_Logs_Runner_RouteStream_Cursor = string | undefined;
export type Routes_Logs_Runner_RouteStream_Closed = boolean;
export type Routes_Logs_Runner_RouteStream_Polling = boolean;
export type Routes_Logs_Runner_RouteStream_PollTimer = ReturnType<typeof setInterval>;
export type Routes_Logs_Runner_RouteStream_KeepAliveTimer = ReturnType<typeof setInterval>;

export type Routes_Logs_Runner_RouteUpdateDiagnostics_Request = express.Request;
export type Routes_Logs_Runner_RouteUpdateDiagnostics_Response = express.Response;
export type Routes_Logs_Runner_RouteUpdateDiagnostics_Returns = Promise<void>;
export type Routes_Logs_Runner_RouteUpdateDiagnostics_Body = ZodSafeParseResult<{
  debugLogging: boolean;
}>;
export type Routes_Logs_Runner_RouteUpdateDiagnostics_Principal = Shared_Principal;
