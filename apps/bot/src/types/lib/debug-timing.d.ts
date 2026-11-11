import type { Client, REST } from 'discord.js';
import type { Mock, MockInstance } from 'vitest';

import type { Shared_LogComponent, Shared_LogContext } from '../shared.d.ts';

export type Lib_DebugTiming_SlowQueryMilliseconds = number;
export type Lib_DebugTiming_SlowHandlerMilliseconds = number;

export type Lib_DebugTiming_DescribeStatement_Input = unknown;
export type Lib_DebugTiming_DescribeStatement_Returns = string;
export type Lib_DebugTiming_DescribeStatement_Text = string;
export type Lib_DebugTiming_DescribeStatement_ConfigText = unknown;

export type Lib_DebugTiming_TimeFeatureHandler_Module = string;
export type Lib_DebugTiming_TimeFeatureHandler_Event = string;
export type Lib_DebugTiming_TimeFeatureHandler_GuildIdentifier = string;
export type Lib_DebugTiming_TimeFeatureHandler_Run<Result> = () => Promise<Result>;
export type Lib_DebugTiming_TimeFeatureHandler_Returns<Result> = Promise<Result>;
export type Lib_DebugTiming_TimeFeatureHandler_StartedAt = number;
export type Lib_DebugTiming_TimeFeatureHandler_Elapsed = number;

export type Lib_DebugTiming_TimeQuery_Component = Shared_LogComponent;
export type Lib_DebugTiming_TimeQuery_Statement = string;
export type Lib_DebugTiming_TimeQuery_StartedAt = number;
export type Lib_DebugTiming_TimeQuery_Result = unknown;
export type Lib_DebugTiming_TimeQuery_Returns = unknown;
export type Lib_DebugTiming_TimeQuery_Pending = Promise<unknown>;
export type Lib_DebugTiming_TimeQuery_Elapsed = number;

export type Lib_DebugTiming_TimedPool_Target<Target extends object> = Target;
export type Lib_DebugTiming_TimedPool_Component = Shared_LogComponent;
export type Lib_DebugTiming_TimedPool_Returns<Target extends object> = Target;
export type Lib_DebugTiming_TimedPool_Value = unknown;
export type Lib_DebugTiming_TimedPool_Method = (...methodArguments: unknown[]) => unknown;
export type Lib_DebugTiming_TimedPool_Statement = string;
export type Lib_DebugTiming_TimedPool_StartedAt = number;
export type Lib_DebugTiming_TimedPool_Connected = unknown;
export type Lib_DebugTiming_TimedPool_PendingClient = Promise<object>;

export type Lib_DebugTiming_WatchDiscordDebug_Client = Client;
export type Lib_DebugTiming_WatchDiscordDebug_Returns = void;
export type Lib_DebugTiming_WatchDiscordDebug_AttachedAt = number;
export type Lib_DebugTiming_WatchDiscordDebug_DownSince = Map<number, number>;
export type Lib_DebugTiming_WatchDiscordDebug_MarkDown = (shardId: number) => void;
export type Lib_DebugTiming_WatchDiscordDebug_Recovered = (shardId: number) => Shared_LogContext;
export type Lib_DebugTiming_WatchDiscordDebug_DroppedAt = number | undefined;
export type Lib_DebugTiming_WatchDiscordDebug_Context = Shared_LogContext;

export type Lib_DebugTiming_WatchRestRateLimits_Rest = REST;
export type Lib_DebugTiming_WatchRestRateLimits_Component = Shared_LogComponent;
export type Lib_DebugTiming_WatchRestRateLimits_Returns = void;

export type Lib_DebugTiming_Test_Write = MockInstance<typeof process.stdout.write>;
export type Lib_DebugTiming_Test_Entry = {
  component: string;
  context: Record<string, unknown>;
  event: string;
  level: string;
};
export type Lib_DebugTiming_Test_Summary = {
  component: string;
  context: Record<string, unknown>;
  event: string;
};
export type Lib_DebugTiming_Test_ReadEntries_Write = Lib_DebugTiming_Test_Write;
export type Lib_DebugTiming_Test_ReadEntries_Returns = Lib_DebugTiming_Test_Summary[];
export type Lib_DebugTiming_Test_QueryResult = {
  rows: Record<string, unknown>[];
};
export type Lib_DebugTiming_Test_QueryFunction = (text: string, values?: unknown[]) => Promise<Lib_DebugTiming_Test_QueryResult>;
export type Lib_DebugTiming_Test_Query = Mock<Lib_DebugTiming_Test_QueryFunction>;
export type Lib_DebugTiming_Test_Release = Mock<() => void>;
export type Lib_DebugTiming_Test_FakeClient = {
  query: Lib_DebugTiming_Test_Query;
  release: Lib_DebugTiming_Test_Release;
};
export type Lib_DebugTiming_Test_FakePool = {
  connect: () => Promise<Lib_DebugTiming_Test_FakeClient>;
  query: Lib_DebugTiming_Test_Query;
};
export type Lib_DebugTiming_Test_Client = Client;
export type Lib_DebugTiming_Test_Output = string;
