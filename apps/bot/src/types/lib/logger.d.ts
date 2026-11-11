import type { Pool } from 'pg';

import type {
  Shared_LogComponent,
  Shared_LogContext,
  Shared_LogEvent,
  Shared_LogLevel,
} from '../shared.d.ts';

export type Lib_Logger_ConfigureLogPersistence_Pool = Pool;
export type Lib_Logger_ConfigureLogPersistence_Returns = void;

export type Lib_Logger_GetErrorMessage_Error = unknown;
export type Lib_Logger_GetErrorMessage_Returns = string;

export type Lib_Logger_IsDebugLogging_Returns = boolean;

export type Lib_Logger_MuteLogs_Returns = void;

export type Lib_Logger_SetDebugLogging_Enabled = boolean;
export type Lib_Logger_SetDebugLogging_Returns = void;

export type Lib_Logger_UnmuteLogs_Returns = void;

export type Lib_Logger_WriteLog_Component = Shared_LogComponent;
export type Lib_Logger_WriteLog_Context = Shared_LogContext;
export type Lib_Logger_WriteLog_Entry_Component = Shared_LogComponent;
export type Lib_Logger_WriteLog_Entry_Context = Shared_LogContext;
export type Lib_Logger_WriteLog_Entry_Event = Shared_LogEvent;
export type Lib_Logger_WriteLog_Entry_Level = Shared_LogLevel;
export type Lib_Logger_WriteLog_Entry_Timestamp = string;
export type Lib_Logger_WriteLog_Entry = {
  component: Lib_Logger_WriteLog_Entry_Component;
  context: Lib_Logger_WriteLog_Entry_Context;
  event: Lib_Logger_WriteLog_Entry_Event;
  level: Lib_Logger_WriteLog_Entry_Level;
  timestamp: Lib_Logger_WriteLog_Entry_Timestamp;
};
export type Lib_Logger_WriteLog_Event = Shared_LogEvent;
export type Lib_Logger_WriteLog_Level = Shared_LogLevel;
export type Lib_Logger_WriteLog_Returns = void;
export type Lib_Logger_WriteLog_SerializedEntry = string;
export type Lib_Logger_WriteLog_PersistencePromise = Promise<unknown>;

export type Lib_Logger_LogPersistencePool = Pool | undefined;
export type Lib_Logger_MutedChecks = number;
export type Lib_Logger_DebugLogging = boolean;
