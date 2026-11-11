import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type {
  Shared_BotAction,
  Shared_BotDesiredState,
  Shared_BotRuntimeControl,
  Shared_DatabaseConfiguration,
  Shared_Job,
  Shared_JsonObject,
  Shared_RuntimeHeartbeat,
  Shared_RuntimeHeartbeat_Component,
  Shared_RuntimeHeartbeat_Details,
  Shared_RuntimeHeartbeat_Status,
} from '../shared.d.ts';
import type { Tests_Support_Database_TestDatabase } from '../tests/support/database.d.ts';

export type Lib_Database_ClaimNextJob_Client = PoolClient;
export type Lib_Database_ClaimNextJob_Payload = Shared_JsonObject;
export type Lib_Database_ClaimNextJob_Pool = Pool;
export type Lib_Database_ClaimNextJob_AttemptLimit = number;
export type Lib_Database_ClaimNextJob_Result = QueryResult<Lib_Database_ClaimNextJob_Row>;
export type Lib_Database_ClaimNextJob_Returns = Promise<Shared_Job | undefined>;
export type Lib_Database_ClaimNextJob_Row_Attempts = number;
export type Lib_Database_ClaimNextJob_Row_Id = string;
export type Lib_Database_ClaimNextJob_Row_Payload = unknown;
export type Lib_Database_ClaimNextJob_Row_Type = string;
export type Lib_Database_ClaimNextJob_Row = {
  attempts: Lib_Database_ClaimNextJob_Row_Attempts;
  id: Lib_Database_ClaimNextJob_Row_Id;
  payload: Lib_Database_ClaimNextJob_Row_Payload;
  type: Lib_Database_ClaimNextJob_Row_Type;
};
export type Lib_Database_ClaimNextJob_RowResult = Lib_Database_ClaimNextJob_Row | undefined;
export type Lib_Database_ClaimNextJob_WorkerIdentifier = string;

export type Lib_Database_CompleteJob_JobIdentifier = string;
export type Lib_Database_CompleteJob_Pool = Pool;
export type Lib_Database_CompleteJob_Returns = Promise<void>;

export type Lib_Database_UpdateRunningJobPayload_JobIdentifier = string;
export type Lib_Database_UpdateRunningJobPayload_Payload = Shared_JsonObject;
export type Lib_Database_UpdateRunningJobPayload_Pool = Pool;
export type Lib_Database_UpdateRunningJobPayload_Result = QueryResult;
export type Lib_Database_UpdateRunningJobPayload_Returns = Promise<void>;

export type Lib_Database_CreateDatabasePool_ApplicationName = string;
export type Lib_Database_CreateDatabasePool_Configuration = Shared_DatabaseConfiguration;
export type Lib_Database_CreateDatabasePool_Returns = Pool;

export type Lib_Database_EnqueueDurableJob_DedupeKey = string;
export type Lib_Database_EnqueueDurableJob_Payload = Shared_JsonObject;
export type Lib_Database_EnqueueDurableJob_Pool = Pool;
export type Lib_Database_EnqueueDurableJob_Result = QueryResult;
export type Lib_Database_EnqueueDurableJob_Returns = Promise<boolean>;
export type Lib_Database_EnqueueDurableJob_SerializedPayload = string;
export type Lib_Database_EnqueueDurableJob_Type = string;

export type Lib_Database_EnqueueScheduledJobs_Pool = Pool;
export type Lib_Database_EnqueueScheduledJobs_SchedulerKey = string;
export type Lib_Database_EnqueueScheduledJobs_ScannedThrough = Date;
export type Lib_Database_EnqueueScheduledJobs_Job_DedupeKey = string;
export type Lib_Database_EnqueueScheduledJobs_Job_Payload = Shared_JsonObject;
export type Lib_Database_EnqueueScheduledJobs_Job_Type = string;
export type Lib_Database_EnqueueScheduledJobs_Job = {
  dedupeKey: Lib_Database_EnqueueScheduledJobs_Job_DedupeKey;
  payload: Lib_Database_EnqueueScheduledJobs_Job_Payload;
  type: Lib_Database_EnqueueScheduledJobs_Job_Type;
};
export type Lib_Database_EnqueueScheduledJobs_Jobs = Lib_Database_EnqueueScheduledJobs_Job[];
export type Lib_Database_EnqueueScheduledJobs_Returns = Promise<number>;
export type Lib_Database_EnqueueScheduledJobs_Client = PoolClient;
export type Lib_Database_EnqueueScheduledJobs_SerializedJobs = string;
export type Lib_Database_EnqueueScheduledJobs_Result = QueryResult;

export type Lib_Database_EnqueueRssItems_Pool = Pool;
export type Lib_Database_EnqueueRssItems_GuildIdentifier = string;
export type Lib_Database_EnqueueRssItems_FeedKey = string;
export type Lib_Database_EnqueueRssItems_Etag = string | undefined;
export type Lib_Database_EnqueueRssItems_LastModified = string | undefined;
export type Lib_Database_EnqueueRssItems_SeenItems = string[];
export type Lib_Database_EnqueueRssItems_Initialized = boolean;
export type Lib_Database_EnqueueRssItems_Jobs = Lib_Database_EnqueueScheduledJobs_Job[];
export type Lib_Database_EnqueueRssItems_Returns = Promise<number>;
export type Lib_Database_EnqueueRssItems_Client = PoolClient;
export type Lib_Database_EnqueueRssItems_SerializedJobs = string;
export type Lib_Database_EnqueueRssItems_SerializedSeenItems = string;
export type Lib_Database_EnqueueRssItems_Result = QueryResult;

export type Lib_Database_FailJob_AttemptLimit = number;
export type Lib_Database_FailJob_ErrorMessage = string;
export type Lib_Database_FailJob_JobIdentifier = string;
export type Lib_Database_FailJob_Pool = Pool;
export type Lib_Database_FailJob_Returns = Promise<void>;

export type Lib_Database_GetBotRuntimeControl_Pool = Pool;
export type Lib_Database_GetBotRuntimeControl_Returns = Promise<Shared_BotRuntimeControl>;
export type Lib_Database_GetBotRuntimeControl_Result = QueryResult<Lib_Database_GetBotRuntimeControl_Row>;
export type Lib_Database_GetBotRuntimeControl_Row_DesiredState = Shared_BotDesiredState;
export type Lib_Database_GetBotRuntimeControl_Row_DiscordApplicationId = string | null;
export type Lib_Database_GetBotRuntimeControl_Row_DiscordTokenCiphertext = string | null;
export type Lib_Database_GetBotRuntimeControl_Row_Generation = string;
export type Lib_Database_GetBotRuntimeControl_Row_UpdatedAt = Date;
export type Lib_Database_GetBotRuntimeControl_Row = {
  desired_state: Lib_Database_GetBotRuntimeControl_Row_DesiredState;
  discord_application_id: Lib_Database_GetBotRuntimeControl_Row_DiscordApplicationId;
  discord_token_ciphertext: Lib_Database_GetBotRuntimeControl_Row_DiscordTokenCiphertext;
  generation: Lib_Database_GetBotRuntimeControl_Row_Generation;
  updated_at: Lib_Database_GetBotRuntimeControl_Row_UpdatedAt;
};
export type Lib_Database_GetBotRuntimeControl_RowResult = Lib_Database_GetBotRuntimeControl_Row | undefined;

export type Lib_Database_GetGuildSettings_GuildIdentifier = string;
export type Lib_Database_GetGuildSettings_Pool = Pool;
export type Lib_Database_GetGuildSettings_Result = QueryResult<Lib_Database_GetGuildSettings_Row>;
export type Lib_Database_GetGuildSettings_Returns = Promise<Shared_JsonObject | undefined>;
export type Lib_Database_GetGuildSettings_Row_Settings = unknown;
export type Lib_Database_GetGuildSettings_Row = {
  settings: Lib_Database_GetGuildSettings_Row_Settings;
};
export type Lib_Database_GetGuildSettings_RowResult = Lib_Database_GetGuildSettings_Row | undefined;

export type Lib_Database_GetGuildSecrets_GuildIdentifier = string;
export type Lib_Database_GetGuildSecrets_Pool = Pool;
export type Lib_Database_GetGuildSecrets_Result = QueryResult<Lib_Database_GetGuildSecrets_Row>;
export type Lib_Database_GetGuildSecrets_Returns = Promise<Lib_Database_GetGuildSecrets_Secrets>;
export type Lib_Database_GetGuildSecrets_Row_Ciphertext = string;
export type Lib_Database_GetGuildSecrets_Row_SecretKey = string;
export type Lib_Database_GetGuildSecrets_Row = {
  ciphertext: Lib_Database_GetGuildSecrets_Row_Ciphertext;
  secret_key: Lib_Database_GetGuildSecrets_Row_SecretKey;
};
export type Lib_Database_GetGuildSecrets_Secret = {
  ciphertext: string;
  key: string;
};
export type Lib_Database_GetGuildSecrets_Secrets = Lib_Database_GetGuildSecrets_Secret[];

export type Lib_Database_GetRssFeedCursor_Pool = Pool;
export type Lib_Database_GetRssFeedCursor_GuildIdentifier = string;
export type Lib_Database_GetRssFeedCursor_FeedKey = string;
export type Lib_Database_GetRssFeedCursor_Returns = Promise<Lib_Database_GetRssFeedCursor_Cursor | undefined>;
export type Lib_Database_GetRssFeedCursor_Cursor_Etag = string | undefined;
export type Lib_Database_GetRssFeedCursor_Cursor_Initialized = boolean;
export type Lib_Database_GetRssFeedCursor_Cursor_LastModified = string | undefined;
export type Lib_Database_GetRssFeedCursor_Cursor_SeenItems = string[];
export type Lib_Database_GetRssFeedCursor_Cursor = {
  etag: Lib_Database_GetRssFeedCursor_Cursor_Etag;
  initialized: Lib_Database_GetRssFeedCursor_Cursor_Initialized;
  lastModified: Lib_Database_GetRssFeedCursor_Cursor_LastModified;
  seenItems: Lib_Database_GetRssFeedCursor_Cursor_SeenItems;
};
export type Lib_Database_GetRssFeedCursor_Result = QueryResult<Lib_Database_GetRssFeedCursor_Row>;
export type Lib_Database_GetRssFeedCursor_Row_Etag = string | null;
export type Lib_Database_GetRssFeedCursor_Row_Initialized = boolean;
export type Lib_Database_GetRssFeedCursor_Row_LastModified = string | null;
export type Lib_Database_GetRssFeedCursor_Row_SeenItems = unknown;
export type Lib_Database_GetRssFeedCursor_Row = {
  etag: Lib_Database_GetRssFeedCursor_Row_Etag;
  initialized: Lib_Database_GetRssFeedCursor_Row_Initialized;
  last_modified: Lib_Database_GetRssFeedCursor_Row_LastModified;
  seen_items: Lib_Database_GetRssFeedCursor_Row_SeenItems;
};
export type Lib_Database_GetRssFeedCursor_RowResult = Lib_Database_GetRssFeedCursor_Row | undefined;
export type Lib_Database_GetRssFeedCursor_SeenItems = string[];

export type Lib_Database_ListRuntimeHeartbeats_Pool = Pool;
export type Lib_Database_ListRuntimeHeartbeats_Result = QueryResult<Lib_Database_ListRuntimeHeartbeats_Row>;
export type Lib_Database_ListRuntimeHeartbeats_Returns = Promise<Shared_RuntimeHeartbeat[]>;
export type Lib_Database_ListRuntimeHeartbeats_Row_Component = Shared_RuntimeHeartbeat_Component;
export type Lib_Database_ListRuntimeHeartbeats_Row_Details = unknown;
export type Lib_Database_ListRuntimeHeartbeats_Row_ObservedAt = Date;
export type Lib_Database_ListRuntimeHeartbeats_Row_Status = Shared_RuntimeHeartbeat_Status;
export type Lib_Database_ListRuntimeHeartbeats_Row = {
  component: Lib_Database_ListRuntimeHeartbeats_Row_Component;
  details: Lib_Database_ListRuntimeHeartbeats_Row_Details;
  observed_at: Lib_Database_ListRuntimeHeartbeats_Row_ObservedAt;
  status: Lib_Database_ListRuntimeHeartbeats_Row_Status;
};

export type Lib_Database_PingDatabase_Pool = Pool;
export type Lib_Database_PingDatabase_Returns = Promise<boolean>;

export type Lib_Database_RecordHeartbeat_Component = Shared_RuntimeHeartbeat_Component;
export type Lib_Database_RecordHeartbeat_Details = Shared_RuntimeHeartbeat_Details;
export type Lib_Database_RecordHeartbeat_Pool = Pool;
export type Lib_Database_RecordHeartbeat_Returns = Promise<void>;
export type Lib_Database_RecordHeartbeat_Status = Shared_RuntimeHeartbeat_Status;

export type Lib_Database_ReadSchedulerCursor_Pool = Pool;
export type Lib_Database_ReadSchedulerCursor_SchedulerKey = string;
export type Lib_Database_ReadSchedulerCursor_Returns = Promise<Date | undefined>;
export type Lib_Database_ReadSchedulerCursor_Result = QueryResult<Lib_Database_ReadSchedulerCursor_Row>;
export type Lib_Database_ReadSchedulerCursor_Row_ScannedThrough = Date;
export type Lib_Database_ReadSchedulerCursor_Row = {
  scanned_through: Lib_Database_ReadSchedulerCursor_Row_ScannedThrough;
};
export type Lib_Database_ReadSchedulerCursor_RowResult = Lib_Database_ReadSchedulerCursor_Row | undefined;

export type Lib_Database_RequestBotAction_Pool = Pool;
export type Lib_Database_RequestBotAction_Action = Shared_BotAction;
export type Lib_Database_RequestBotAction_Returns = Promise<boolean>;
export type Lib_Database_RequestBotAction_Result = QueryResult<Lib_Database_RequestBotAction_Row>;
export type Lib_Database_RequestBotAction_Row_Singleton = boolean;
export type Lib_Database_RequestBotAction_Row = {
  singleton: Lib_Database_RequestBotAction_Row_Singleton;
};

export type Lib_Database_SaveBotConfiguration_Pool = Pool;
export type Lib_Database_SaveBotConfiguration_TokenCiphertext = string | undefined;
export type Lib_Database_SaveBotConfiguration_Returns = Promise<number>;
export type Lib_Database_SaveBotConfiguration_DatabaseTokenCiphertext = string | null;
export type Lib_Database_SaveBotConfiguration_Result = QueryResult<Lib_Database_SaveBotConfiguration_Row>;
export type Lib_Database_SaveBotConfiguration_Row_Generation = string;
export type Lib_Database_SaveBotConfiguration_Row = {
  generation: Lib_Database_SaveBotConfiguration_Row_Generation;
};
export type Lib_Database_SaveBotConfiguration_RowResult = Lib_Database_SaveBotConfiguration_Row | undefined;

export type Lib_Database_SaveDiscordApplicationIdentifier_Pool = Pool;
export type Lib_Database_SaveDiscordApplicationIdentifier_ApplicationIdentifier = string;
export type Lib_Database_SaveDiscordApplicationIdentifier_Returns = Promise<void>;

export type Lib_Database_SaveGuildSettings_GuildIdentifier = string;
export type Lib_Database_SaveGuildSettings_Pool = Pool;
export type Lib_Database_SaveGuildSettings_Result = QueryResult<Lib_Database_SaveGuildSettings_Row>;
export type Lib_Database_SaveGuildSettings_Returns = Promise<number>;
export type Lib_Database_SaveGuildSettings_Revision = number;
export type Lib_Database_SaveGuildSettings_Row_Revision = string;
export type Lib_Database_SaveGuildSettings_Row = {
  revision: Lib_Database_SaveGuildSettings_Row_Revision;
};
export type Lib_Database_SaveGuildSettings_RowResult = Lib_Database_SaveGuildSettings_Row | undefined;
export type Lib_Database_SaveGuildSettings_SerializedSettings = string;
export type Lib_Database_SaveGuildSettings_Settings = Shared_JsonObject;

export type Lib_Database_SaveLegacyImport_Client = PoolClient;
export type Lib_Database_SaveLegacyImport_EncryptedSecret_Ciphertext = string;
export type Lib_Database_SaveLegacyImport_EncryptedSecret_Key = string;
export type Lib_Database_SaveLegacyImport_EncryptedSecret = {
  ciphertext: Lib_Database_SaveLegacyImport_EncryptedSecret_Ciphertext;
  key: Lib_Database_SaveLegacyImport_EncryptedSecret_Key;
};
export type Lib_Database_SaveLegacyImport_EncryptedSecrets = Lib_Database_SaveLegacyImport_EncryptedSecret[];
export type Lib_Database_SaveLegacyImport_GuildIdentifier = string;
export type Lib_Database_SaveLegacyImport_Pool = Pool;
export type Lib_Database_SaveLegacyImport_Report = Shared_JsonObject;
export type Lib_Database_SaveLegacyImport_Revision = number;
export type Lib_Database_SaveLegacyImport_Result = QueryResult<Lib_Database_SaveLegacyImport_Row>;
export type Lib_Database_SaveLegacyImport_Returns = Promise<Lib_Database_SaveLegacyImport_Revision>;
export type Lib_Database_SaveLegacyImport_Row_Revision = string;
export type Lib_Database_SaveLegacyImport_Row = {
  revision: Lib_Database_SaveLegacyImport_Row_Revision;
};
export type Lib_Database_SaveLegacyImport_RowResult = Lib_Database_SaveLegacyImport_Row | undefined;
export type Lib_Database_SaveLegacyImport_SerializedReport = string;
export type Lib_Database_SaveLegacyImport_SerializedSettings = string;
export type Lib_Database_SaveLegacyImport_Settings = Shared_JsonObject;
export type Lib_Database_SaveLegacyImport_TokenCiphertext = string | undefined;

export type Lib_Database_Test_QueryRow_Revision = string;
export type Lib_Database_Test_ConnectReturns = Promise<PoolClient>;
export type Lib_Database_Test_QueryRow = {
  revision: Lib_Database_Test_QueryRow_Revision;
};
export type Lib_Database_Test_QueryResult = QueryResult<Lib_Database_Test_QueryRow>;
export type Lib_Database_Test_QueryReturns = Promise<Lib_Database_Test_QueryResult>;
export type Lib_Database_Test_QueryRows = Lib_Database_Test_QueryRow[];
export type Lib_Database_Test_QueryText = string;
export type Lib_Database_Test_QueryTexts = string[];
export type Lib_Database_Test_Job = Record<string, unknown> | undefined;
export type Lib_Database_Test_Pool = Pool;
export type Lib_Database_Test_TestDatabase = Tests_Support_Database_TestDatabase;
