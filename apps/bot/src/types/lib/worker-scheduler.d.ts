import type { Pool } from 'pg';

import type {
  Shared_FeatureKey,
  Shared_Job,
} from '../shared.d.ts';
import type { Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry } from './configuration-database.d.ts';
import type { Lib_WorkerFeatures_Prepared, Lib_WorkerFeatures_ScheduledJob } from './worker-features.d.ts';

export type Lib_WorkerScheduler_Summary_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_WorkerScheduler_Summary_ConfigurationErrors = string[];
export type Lib_WorkerScheduler_Summary_EnqueuedCount = number;
export type Lib_WorkerScheduler_Summary_ScannedThrough = string | undefined;
export type Lib_WorkerScheduler_Summary = {
  activeFeatureKeys: Lib_WorkerScheduler_Summary_ActiveFeatureKeys;
  configurationErrors: Lib_WorkerScheduler_Summary_ConfigurationErrors;
  enqueuedCount: Lib_WorkerScheduler_Summary_EnqueuedCount;
  scannedThrough: Lib_WorkerScheduler_Summary_ScannedThrough;
};

export type Lib_WorkerScheduler_GetScanInstants_PreviousInstant = Date | undefined;
export type Lib_WorkerScheduler_GetScanInstants_CurrentInstant = Date;
export type Lib_WorkerScheduler_GetScanInstants_Returns = Date[];
export type Lib_WorkerScheduler_GetScanInstants_CurrentTimestamp = number;
export type Lib_WorkerScheduler_GetScanInstants_EarliestTimestamp = number;
export type Lib_WorkerScheduler_GetScanInstants_PreviousTimestamp = number;
export type Lib_WorkerScheduler_GetScanInstants_StartTimestamp = number;
export type Lib_WorkerScheduler_GetScanInstants_Instants = Date[];

export type Lib_WorkerScheduler_ScheduleFeatureJobs_Pool = Pool;
export type Lib_WorkerScheduler_ScheduleFeatureJobs_CurrentDate = Date;
export type Lib_WorkerScheduler_ScheduleFeatureJobs_Returns = Promise<Lib_WorkerScheduler_Summary>;
export type Lib_WorkerScheduler_ScheduleFeatureJobs_ScannedThrough = Date;
export type Lib_WorkerScheduler_ScheduleFeatureJobs_PreviousInstant = Date | undefined;
export type Lib_WorkerScheduler_ScheduleFeatureJobs_Instants = Date[];
export type Lib_WorkerScheduler_ScheduleFeatureJobs_RuntimeControl = {
  desiredState: 'running' | 'stopped';
  discordTokenCiphertext: string | undefined;
  generation: number;
  updatedAt: string;
};
export type Lib_WorkerScheduler_ScheduleFeatureJobs_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_WorkerScheduler_ScheduleFeatureJobs_ConfigurationErrors = string[];
export type Lib_WorkerScheduler_ScheduleFeatureJobs_Jobs = Lib_WorkerFeatures_ScheduledJob[];
export type Lib_WorkerScheduler_ScheduleFeatureJobs_SettingsEntries = Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry[];
export type Lib_WorkerScheduler_ScheduleFeatureJobs_Prepared = Lib_WorkerFeatures_Prepared;
export type Lib_WorkerScheduler_ScheduleFeatureJobs_EnqueuedCount = number;

export type Lib_WorkerScheduler_Job = Shared_Job;
