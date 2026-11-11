import type { Pool, QueryResult } from 'pg';
import type { MockInstance } from 'vitest';

import type { Shared_LogComponent, Shared_LogContext } from '../shared.d.ts';
import type { Tests_Support_Database_TestDatabase } from '../tests/support/database.d.ts';

export type Lib_DebugLogging_FollowIntervalMilliseconds = number;
export type Lib_DebugLogging_LocalChanges = number;

export type Lib_DebugLogging_ApplyDebugLogging_Component = Shared_LogComponent;
export type Lib_DebugLogging_ApplyDebugLogging_Enabled = boolean;
export type Lib_DebugLogging_ApplyDebugLogging_Context = Shared_LogContext;
export type Lib_DebugLogging_ApplyDebugLogging_Returns = void;

export type Lib_DebugLogging_ChangeDebugLogging_Pool = Pool;
export type Lib_DebugLogging_ChangeDebugLogging_Component = Shared_LogComponent;
export type Lib_DebugLogging_ChangeDebugLogging_Enabled = boolean;
export type Lib_DebugLogging_ChangeDebugLogging_Context = Shared_LogContext;
export type Lib_DebugLogging_ChangeDebugLogging_Returns = Promise<void>;

export type Lib_DebugLogging_FollowDebugLogging_Pool = Pool;
export type Lib_DebugLogging_FollowDebugLogging_Component = Shared_LogComponent;
export type Lib_DebugLogging_FollowDebugLogging_Returns = () => void;
export type Lib_DebugLogging_FollowDebugLogging_Check = () => void;
export type Lib_DebugLogging_FollowDebugLogging_Seen = number;
export type Lib_DebugLogging_FollowDebugLogging_Timer = NodeJS.Timeout;

export type Lib_DebugLogging_ReadDebugLogging_Pool = Pool;
export type Lib_DebugLogging_ReadDebugLogging_Returns = Promise<boolean>;
export type Lib_DebugLogging_ReadDebugLogging_Row = {
  debug_logging: boolean;
};
export type Lib_DebugLogging_ReadDebugLogging_Result = QueryResult<Lib_DebugLogging_ReadDebugLogging_Row>;
export type Lib_DebugLogging_ReadDebugLogging_SavedRow = Lib_DebugLogging_ReadDebugLogging_Row | undefined;

export type Lib_DebugLogging_Test_TestDatabase = Tests_Support_Database_TestDatabase;
export type Lib_DebugLogging_Test_Pool = Pool;
export type Lib_DebugLogging_Test_Write = MockInstance<typeof process.stdout.write>;
export type Lib_DebugLogging_Test_Lines = string[];
export type Lib_DebugLogging_Test_Stop = () => void;
