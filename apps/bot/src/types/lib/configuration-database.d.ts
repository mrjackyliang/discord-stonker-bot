import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type {
  Shared_FeatureConfigurations,
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

import type { Lib_FeatureStorage_FeatureValueRow } from './feature-storage.d.ts';

export type Lib_ConfigurationDatabase_DiscordServer_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_DiscordServer_Name = string;
export type Lib_ConfigurationDatabase_DiscordServer_IconHash = string | undefined;
export type Lib_ConfigurationDatabase_DiscordServer_Available = boolean;
export type Lib_ConfigurationDatabase_DiscordServer_LastSeenAt = string | undefined;
export type Lib_ConfigurationDatabase_DiscordServer = {
  available: Lib_ConfigurationDatabase_DiscordServer_Available;
  guildIdentifier: Lib_ConfigurationDatabase_DiscordServer_GuildIdentifier;
  iconHash: Lib_ConfigurationDatabase_DiscordServer_IconHash;
  lastSeenAt: Lib_ConfigurationDatabase_DiscordServer_LastSeenAt;
  name: Lib_ConfigurationDatabase_DiscordServer_Name;
};

export type Lib_ConfigurationDatabase_DiscordChannel_Available = boolean;
export type Lib_ConfigurationDatabase_DiscordChannel_Id = string;
export type Lib_ConfigurationDatabase_DiscordChannel_Name = string;
export type Lib_ConfigurationDatabase_DiscordChannel_Type = number;
export type Lib_ConfigurationDatabase_DiscordChannel = {
  available: Lib_ConfigurationDatabase_DiscordChannel_Available;
  id: Lib_ConfigurationDatabase_DiscordChannel_Id;
  name: Lib_ConfigurationDatabase_DiscordChannel_Name;
  type: Lib_ConfigurationDatabase_DiscordChannel_Type;
};
export type Lib_ConfigurationDatabase_DiscordRole_Available = boolean;
export type Lib_ConfigurationDatabase_DiscordRole_Id = string;
export type Lib_ConfigurationDatabase_DiscordRole_Name = string;
export type Lib_ConfigurationDatabase_DiscordRole_Position = number;
export type Lib_ConfigurationDatabase_DiscordRole = {
  available: Lib_ConfigurationDatabase_DiscordRole_Available;
  id: Lib_ConfigurationDatabase_DiscordRole_Id;
  name: Lib_ConfigurationDatabase_DiscordRole_Name;
  position: Lib_ConfigurationDatabase_DiscordRole_Position;
};
export type Lib_ConfigurationDatabase_DiscordResources = {
  channels: Lib_ConfigurationDatabase_DiscordChannel[];
  roles: Lib_ConfigurationDatabase_DiscordRole[];
};

export type Lib_ConfigurationDatabase_FeatureState_Configured = boolean;
export type Lib_ConfigurationDatabase_FeatureState_Enabled = boolean;
export type Lib_ConfigurationDatabase_FeatureState_Revision = number;
export type Lib_ConfigurationDatabase_FeatureState_UpdatedAt = string;
export type Lib_ConfigurationDatabase_FeatureState = {
  configured: Lib_ConfigurationDatabase_FeatureState_Configured;
  enabled: Lib_ConfigurationDatabase_FeatureState_Enabled;
  revision: Lib_ConfigurationDatabase_FeatureState_Revision;
  updatedAt: Lib_ConfigurationDatabase_FeatureState_UpdatedAt;
};
export type Lib_ConfigurationDatabase_FeatureStates = Map<Shared_FeatureKey, Lib_ConfigurationDatabase_FeatureState>;

export type Lib_ConfigurationDatabase_StoredFeature_Configuration = unknown;
export type Lib_ConfigurationDatabase_StoredFeature = {
  configuration: Lib_ConfigurationDatabase_StoredFeature_Configuration;
  enabled: Lib_ConfigurationDatabase_FeatureState_Enabled;
  revision: Lib_ConfigurationDatabase_FeatureState_Revision;
  updatedAt: Lib_ConfigurationDatabase_FeatureState_UpdatedAt;
};

export type Lib_ConfigurationDatabase_FeatureSecret_Ciphertext = string;
export type Lib_ConfigurationDatabase_FeatureSecret_Key = string;
export type Lib_ConfigurationDatabase_FeatureSecret = {
  ciphertext: Lib_ConfigurationDatabase_FeatureSecret_Ciphertext;
  key: Lib_ConfigurationDatabase_FeatureSecret_Key;
};

export type Lib_ConfigurationDatabase_EnsureDiscordServer_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_EnsureDiscordServer_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_EnsureDiscordServer_Name = string | undefined;
export type Lib_ConfigurationDatabase_EnsureDiscordServer_Returns = Promise<void>;
export type Lib_ConfigurationDatabase_EnsureDiscordServer_FallbackName = string;

export type Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Returns = Promise<Map<string, number>>;
export type Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Result = QueryResult<Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Row>;
export type Lib_ConfigurationDatabase_CountEnabledGuildFeatures_Row = {
  enabled_count: string;
  guild_id: string;
};

export type Lib_ConfigurationDatabase_GetGuildFeature_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_GetGuildFeature_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_GetGuildFeature_FeatureKey = Shared_FeatureKey;
export type Lib_ConfigurationDatabase_GetGuildFeature_Returns = Promise<Lib_ConfigurationDatabase_StoredFeature | undefined>;
export type Lib_ConfigurationDatabase_GetGuildFeature_FeatureResult = QueryResult<Lib_ConfigurationDatabase_GetGuildFeature_FeatureRow>;
export type Lib_ConfigurationDatabase_GetGuildFeature_FeatureRow = {
  enabled: boolean;
  revision: string;
  updated_at: Date;
};
export type Lib_ConfigurationDatabase_GetGuildFeature_FeatureRowResult = Lib_ConfigurationDatabase_GetGuildFeature_FeatureRow | undefined;
export type Lib_ConfigurationDatabase_GetGuildFeature_ValueResult = QueryResult<Lib_ConfigurationDatabase_GetGuildFeature_ValueRow>;
export type Lib_ConfigurationDatabase_GetGuildFeature_ValueRow = {
  value_path: string;
  value_text: string | null;
  value_type: Lib_FeatureStorage_FeatureValueRow['type'];
};
export type Lib_ConfigurationDatabase_GetGuildFeature_Configuration = unknown;

export type Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_SecretKeys = readonly string[];
export type Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Returns = Promise<Map<string, string>>;
export type Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Result = QueryResult<Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Row>;
export type Lib_ConfigurationDatabase_GetGuildSecretCiphertexts_Row = {
  ciphertext: string;
  secret_key: string;
};

export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Returns = Promise<Shared_JsonObject | undefined>;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerResult = QueryResult<Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRow>;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRow_TimeZone = string;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRow = {
  time_zone: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRow_TimeZone;
};
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRowResult = Lib_ConfigurationDatabase_GetNormalizedGuildSettings_ServerRow | undefined;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureResult = QueryResult<Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow>;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_FeatureKey = Shared_FeatureKey;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_Enabled = boolean;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_ValuePath = string | null;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_ValueType = Lib_FeatureStorage_FeatureValueRow['type'] | null;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_ValueText = string | null;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow = {
  enabled: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_Enabled;
  feature_key: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_FeatureKey;
  value_path: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_ValuePath;
  value_text: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_ValueText;
  value_type: Lib_ConfigurationDatabase_GetNormalizedGuildSettings_FeatureRow_ValueType;
};
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Features = Shared_FeatureConfigurations;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentFeatureKey = Shared_FeatureKey | undefined;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentFeatureEnabled = boolean;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_CurrentRows = Lib_FeatureStorage_FeatureValueRow[];
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Configuration = unknown;
export type Lib_ConfigurationDatabase_GetNormalizedGuildSettings_Settings = Shared_JsonObject;

export type Lib_ConfigurationDatabase_ListDiscordServers_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_ListDiscordServers_Returns = Promise<Lib_ConfigurationDatabase_DiscordServer[]>;
export type Lib_ConfigurationDatabase_ListDiscordServers_Result = QueryResult<Lib_ConfigurationDatabase_ListDiscordServers_Row>;
export type Lib_ConfigurationDatabase_ListDiscordServers_Row_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_ListDiscordServers_Row_Name = string;
export type Lib_ConfigurationDatabase_ListDiscordServers_Row_IconHash = string | null;
export type Lib_ConfigurationDatabase_ListDiscordServers_Row_Available = boolean;
export type Lib_ConfigurationDatabase_ListDiscordServers_Row_LastSeenAt = Date | null;
export type Lib_ConfigurationDatabase_ListDiscordServers_Row = {
  available: Lib_ConfigurationDatabase_ListDiscordServers_Row_Available;
  guild_id: Lib_ConfigurationDatabase_ListDiscordServers_Row_GuildIdentifier;
  icon_hash: Lib_ConfigurationDatabase_ListDiscordServers_Row_IconHash;
  last_seen_at: Lib_ConfigurationDatabase_ListDiscordServers_Row_LastSeenAt;
  name: Lib_ConfigurationDatabase_ListDiscordServers_Row_Name;
};

export type Lib_ConfigurationDatabase_ListDiscordResources_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_ListDiscordResources_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_ListDiscordResources_Returns = Promise<Lib_ConfigurationDatabase_DiscordResources>;
export type Lib_ConfigurationDatabase_ListDiscordResources_ChannelResult = QueryResult<Lib_ConfigurationDatabase_ListDiscordResources_ChannelRow>;
export type Lib_ConfigurationDatabase_ListDiscordResources_ChannelRow = {
  available: boolean;
  channel_id: string;
  channel_type: number;
  name: string;
};
export type Lib_ConfigurationDatabase_ListDiscordResources_RoleResult = QueryResult<Lib_ConfigurationDatabase_ListDiscordResources_RoleRow>;
export type Lib_ConfigurationDatabase_ListDiscordResources_RoleRow = {
  available: boolean;
  name: string;
  role_id: string;
  role_position: number;
};

export type Lib_ConfigurationDatabase_ListGuildFeatureStates_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_ListGuildFeatureStates_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_ListGuildFeatureStates_Returns = Promise<Lib_ConfigurationDatabase_FeatureStates>;
export type Lib_ConfigurationDatabase_ListGuildFeatureStates_Result = QueryResult<Lib_ConfigurationDatabase_ListGuildFeatureStates_Row>;
export type Lib_ConfigurationDatabase_ListGuildFeatureStates_Row = {
  configured: boolean;
  enabled: boolean;
  feature_key: Shared_FeatureKey;
  revision: string;
  updated_at: Date;
};

export type Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Pool = Pool | PoolClient;
export type Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Returns = Promise<Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry[]>;
export type Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Servers = Lib_ConfigurationDatabase_DiscordServer[];
export type Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entries = Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry[];
export type Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Settings = Shared_JsonObject | undefined;
export type Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry = {
  guildIdentifier: string;
  settings: Shared_JsonObject;
};

export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Client = PoolClient;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Pool = Pool;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Settings = Shared_JsonObject;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Revision = number;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Returns = Promise<
  Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Revision
>;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Core = Shared_JsonObject;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_CoreValue = unknown;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Entry = [string, unknown];
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_EntryFeatureKey = string;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_EntryRawFeature = unknown;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_TimeZone = string;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_RawTimeZone = unknown;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_Features = Shared_JsonObject;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_FeaturesValue = unknown;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_RevisionResult = QueryResult<Lib_ConfigurationDatabase_ReplaceGuildConfiguration_RevisionRow>;
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_RevisionRow = {
  revision: string;
};
export type Lib_ConfigurationDatabase_ReplaceGuildConfiguration_RevisionRowResult = Lib_ConfigurationDatabase_ReplaceGuildConfiguration_RevisionRow | undefined;

export type Lib_ConfigurationDatabase_WriteGuildConfiguration_Client = PoolClient;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_Settings = Shared_JsonObject;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_Returns = Promise<number>;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_Core = Shared_JsonObject;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_CoreValue = unknown;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_Entry = [string, unknown];
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_EntryFeatureKey = string;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_EntryRawFeature = unknown;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_TimeZone = string;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_RawTimeZone = unknown;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_Features = Shared_JsonObject;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_FeaturesValue = unknown;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionResult = QueryResult<
  Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionRow
>;
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionRow = {
  revision: string;
};
export type Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionRowResult =
  Lib_ConfigurationDatabase_WriteGuildConfiguration_RevisionRow | undefined;

export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Pool = Pool;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Input = {
  configuration: unknown;
  expectedRevision: number;
  featureKey: Shared_FeatureKey;
  guildIdentifier: string;
  secrets: readonly Lib_ConfigurationDatabase_FeatureSecret[];
};
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Outcome = {
  revision: number;
  status: 'revision-conflict' | 'saved';
};
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Returns = Promise<Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Outcome>;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Client = PoolClient;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentResult = QueryResult<Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Row>;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentRow = Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Row | undefined;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_CurrentRevision = number;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Result = QueryResult<Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Row>;
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Row = {
  revision: string;
};
export type Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_RowResult = Lib_ConfigurationDatabase_SaveGuildFeatureConfiguration_Row | undefined;

export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Pool = Pool;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_FeatureKey = Shared_FeatureKey;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Enabled = boolean;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Outcome = 'changed' | 'missing' | 'unchanged';
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Returns = Promise<Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Outcome>;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Client = PoolClient;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_CurrentResult = QueryResult<Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Row>;
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Row = {
  enabled: boolean;
};
export type Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_CurrentRow = Lib_ConfigurationDatabase_SetNormalizedGuildFeatureEnabled_Row | undefined;

export type Lib_ConfigurationDatabase_SyncDiscordServers_Pool = Pool;
export type Lib_ConfigurationDatabase_SyncDiscordServers_Servers = readonly Lib_ConfigurationDatabase_SyncDiscordServers_Server[];
export type Lib_ConfigurationDatabase_SyncDiscordServers_Server = {
  channels: readonly Lib_ConfigurationDatabase_SyncDiscordServers_Channel[];
  guildIdentifier: string;
  iconHash: string | undefined;
  name: string;
  roles: readonly Lib_ConfigurationDatabase_SyncDiscordServers_Role[];
};
export type Lib_ConfigurationDatabase_SyncDiscordServers_Channel = {
  channelIdentifier: string;
  name: string;
  type: number;
};
export type Lib_ConfigurationDatabase_SyncDiscordServers_Role = {
  name: string;
  position: number;
  roleIdentifier: string;
};
export type Lib_ConfigurationDatabase_SyncDiscordServers_Returns = Promise<void>;
export type Lib_ConfigurationDatabase_SyncDiscordServers_Client = PoolClient;

export type Lib_ConfigurationDatabase_WriteFeatureRows_Client = PoolClient;
export type Lib_ConfigurationDatabase_WriteFeatureRows_GuildIdentifier = string;
export type Lib_ConfigurationDatabase_WriteFeatureRows_FeatureKey = Shared_FeatureKey;
export type Lib_ConfigurationDatabase_WriteFeatureRows_Configuration = unknown;
export type Lib_ConfigurationDatabase_WriteFeatureRows_Returns = Promise<void>;
export type Lib_ConfigurationDatabase_WriteFeatureRows_Rows = Lib_FeatureStorage_FeatureValueRow[];

export type Lib_ConfigurationDatabase_IsRecord_Value = unknown;
export type Lib_ConfigurationDatabase_IsRecord_Record = Record<string, unknown>;
