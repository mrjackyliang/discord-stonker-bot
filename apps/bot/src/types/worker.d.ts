import type { REST } from 'discord.js';
import type { Pool } from 'pg';

import type {
  Lib_WorkerFeatures_DiscordMessageJobPayload,
  Lib_WorkerFeatures_DiscordMessageResponse,
  Lib_WorkerFeatures_DiscordPermissionJobPayload,
} from './lib/worker-features.d.ts';
import type { Lib_WorkerScheduler_Summary } from './lib/worker-scheduler.d.ts';
import type {
  Shared_BotRuntimeControl,
  Shared_Job,
  Shared_RuntimeConfiguration,
} from './shared.d.ts';

export type Worker_Main_Configuration = Shared_RuntimeConfiguration;
export type Worker_Main_CredentialKey = Buffer;
export type Worker_Main_ErrorMessage = string;
export type Worker_Main_HeartbeatTimer = NodeJS.Timeout;
export type Worker_Main_Job = Shared_Job | undefined;
export type Worker_Main_JobElapsed = number;
export type Worker_Main_JobStartedAt = number;
export type Worker_Main_NextSchedulerAt = number;
export type Worker_Main_Pool = Pool;
export type Worker_Main_Returns = Promise<void>;
export type Worker_Main_SchedulerSummary = Lib_WorkerScheduler_Summary;
export type Worker_Main_Stop = () => void;
export type Worker_Main_StopDebugLogging = () => void;
export type Worker_Main_Stopping = boolean;
export type Worker_Main_WorkerIdentifier = string;

export type Worker_ProcessJob_Job = Shared_Job;
export type Worker_ProcessJob_Pool = Pool;
export type Worker_ProcessJob_CredentialKey = Buffer;
export type Worker_ProcessJob_Returns = Promise<void>;

export type Worker_ProcessDiscordMessageJob_Job = Shared_Job;
export type Worker_ProcessDiscordMessageJob_Pool = Pool;
export type Worker_ProcessDiscordMessageJob_CredentialKey = Buffer;
export type Worker_ProcessDiscordMessageJob_Returns = Promise<void>;
export type Worker_ProcessDiscordMessageJob_Payload = Lib_WorkerFeatures_DiscordMessageJobPayload;
export type Worker_ProcessDiscordMessageJob_RuntimeControl = Shared_BotRuntimeControl;
export type Worker_ProcessDiscordMessageJob_DiscordToken = string;
export type Worker_ProcessDiscordMessageJob_MessageIdentifier = string;
export type Worker_ProcessDiscordMessageJob_Rest = REST;
export type Worker_ProcessDiscordMessageJob_Response = Lib_WorkerFeatures_DiscordMessageResponse;
export type Worker_ProcessDiscordMessageJob_ReactionTasks = Promise<void>[];

export type Worker_ProcessDiscordPermissionJob_Job = Shared_Job;
export type Worker_ProcessDiscordPermissionJob_Pool = Pool;
export type Worker_ProcessDiscordPermissionJob_CredentialKey = Buffer;
export type Worker_ProcessDiscordPermissionJob_Returns = Promise<void>;
export type Worker_ProcessDiscordPermissionJob_Payload = Lib_WorkerFeatures_DiscordPermissionJobPayload;
export type Worker_ProcessDiscordPermissionJob_RuntimeControl = Shared_BotRuntimeControl;
export type Worker_ProcessDiscordPermissionJob_DiscordToken = string;
export type Worker_ProcessDiscordPermissionJob_Rest = REST;
export type Worker_ProcessDiscordPermissionJob_Tasks = Promise<void>[];

export type Worker_Run_Returns = Promise<void>;

export type Worker_SlowJobMilliseconds = number;
