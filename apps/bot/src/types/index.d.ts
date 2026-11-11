import type {
  Client,
  GatewayIntentBits,
} from 'discord.js';
import type { Pool } from 'pg';

import type { Lib_AntiRaidFeatures_Prepared } from './lib/anti-raid-features.d.ts';
import type { Lib_AuditFeatures_Prepared } from './lib/audit-features.d.ts';
import type {
  Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry,
  Lib_ConfigurationDatabase_SyncDiscordServers_Server,
} from './lib/configuration-database.d.ts';
import type { Lib_Database_GetGuildSecrets_Secrets } from './lib/database.d.ts';
import type { Lib_GatewayFeatures_Prepared } from './lib/gateway-features.d.ts';
import type { Lib_ImpersonatorFeatures_Prepared } from './lib/impersonator-features.d.ts';
import type { Lib_MessageFeatures_Prepared } from './lib/message-features.d.ts';
import type {
  Lib_MessageRoutingFeatures_Prepared,
  Lib_MessageRoutingFeatures_SecretResolver,
} from './lib/message-routing-features.d.ts';
import type { Lib_RoleSyncFeatures_Prepared } from './lib/role-sync-features.d.ts';
import type { Lib_ScammerFeatures_Prepared } from './lib/scammer-features.d.ts';
import type { Lib_ServerToolFeatures_Prepared } from './lib/server-tool-features.d.ts';
import type {
  Shared_BotRuntimeControl,
  Shared_FeatureKey,
  Shared_JsonObject,
  Shared_RuntimeConfiguration,
  Shared_RuntimeHeartbeat_Details,
  Shared_RuntimeHeartbeat_Status,
} from './shared.d.ts';

export type Index_CompleteGatewayConnection_Client = Client;
export type Index_CompleteGatewayConnection_DiscordToken = string;
export type Index_CompleteGatewayConnection_Returns = Promise<string>;
export type Index_CompleteGatewayConnection_ClientReadyPromise = Promise<void>;

export type Index_ConnectGateway_RuntimeControl = Shared_BotRuntimeControl;
export type Index_ConnectGateway_CredentialKey = Buffer;
export type Index_ConnectGateway_Pool = Pool;
export type Index_ConnectGateway_Returns = Promise<Index_ConnectGateway_Connection>;
export type Index_ConnectGateway_GuildSettingsEntries = Lib_ConfigurationDatabase_ListNormalizedGuildSettings_Entry[];
export type Index_ConnectGateway_GuildSettings = Shared_JsonObject;
export type Index_ConnectGateway_AntiRaidFeatures = Lib_AntiRaidFeatures_Prepared;
export type Index_ConnectGateway_AuditFeatures = Lib_AuditFeatures_Prepared;
export type Index_ConnectGateway_GatewayFeatures = Lib_GatewayFeatures_Prepared;
export type Index_ConnectGateway_ImpersonatorFeatures = Lib_ImpersonatorFeatures_Prepared;
export type Index_ConnectGateway_MessageFeatures = Lib_MessageFeatures_Prepared;
export type Index_ConnectGateway_MessageRoutingFeatures = Lib_MessageRoutingFeatures_Prepared;
export type Index_ConnectGateway_RoleSyncFeatures = Lib_RoleSyncFeatures_Prepared;
export type Index_ConnectGateway_ScammerFeatures = Lib_ScammerFeatures_Prepared;
export type Index_ConnectGateway_ServerToolFeatures = Lib_ServerToolFeatures_Prepared;
export type Index_ConnectGateway_Intents = GatewayIntentBits[];
export type Index_ConnectGateway_ActiveFeatureKeys = Shared_FeatureKey[];
export type Index_ConnectGateway_ConfigurationErrors = string[];
export type Index_ConnectGateway_Client = Client;
export type Index_ConnectGateway_DiscordToken = string;
export type Index_ConnectGateway_SynchronizeRegistry = () => void;
export type Index_ConnectGateway_TimeoutTimer = NodeJS.Timeout | undefined;
export type Index_ConnectGateway_TimeoutPromise = Promise<never>;
export type Index_ConnectGateway_ReadyUserTag = string;
export type Index_ConnectGateway_EncryptedGuildSecrets = Lib_Database_GetGuildSecrets_Secrets;
export type Index_ConnectGateway_GuildSecretResolver = Lib_MessageRoutingFeatures_SecretResolver;
export type Index_ConnectGateway_GuildRuntimes = Index_ConnectGateway_GuildRuntime[];
export type Index_ConnectGateway_GuildRuntime = {
  antiRaidFeatures: Lib_AntiRaidFeatures_Prepared;
  auditFeatures: Lib_AuditFeatures_Prepared;
  gatewayFeatures: Lib_GatewayFeatures_Prepared;
  guildIdentifier: string;
  impersonatorFeatures: Lib_ImpersonatorFeatures_Prepared;
  messageFeatures: Lib_MessageFeatures_Prepared;
  messageRoutingFeatures: Lib_MessageRoutingFeatures_Prepared;
  roleSyncFeatures: Lib_RoleSyncFeatures_Prepared;
  scammerFeatures: Lib_ScammerFeatures_Prepared;
  serverToolFeatures: Lib_ServerToolFeatures_Prepared;
};
export type Index_ConnectGateway_DiscordServers = Lib_ConfigurationDatabase_SyncDiscordServers_Server[];
export type Index_ConnectGateway_Connection_Client = Client;
export type Index_ConnectGateway_Connection_UserTag = string;
export type Index_ConnectGateway_Connection_ActiveFeatureKeys = Shared_FeatureKey[];
export type Index_ConnectGateway_Connection_ConfigurationErrors = string[];
export type Index_ConnectGateway_Connection_GuildCount = number;
export type Index_ConnectGateway_Connection = {
  activeFeatureKeys: Index_ConnectGateway_Connection_ActiveFeatureKeys;
  client: Index_ConnectGateway_Connection_Client;
  configurationErrors: Index_ConnectGateway_Connection_ConfigurationErrors;
  guildCount: Index_ConnectGateway_Connection_GuildCount;
  userTag: Index_ConnectGateway_Connection_UserTag;
};

export type Index_CreateGuildSecretResolver_Ciphertext = string | undefined;
export type Index_CreateGuildSecretResolver_Ciphertexts = Record<string, string>;
export type Index_CreateGuildSecretResolver_CredentialKey = Buffer;
export type Index_CreateGuildSecretResolver_EncryptedSecrets = Lib_Database_GetGuildSecrets_Secrets;
export type Index_CreateGuildSecretResolver_GuildIdentifier = string;
export type Index_CreateGuildSecretResolver_Purpose = string;
export type Index_CreateGuildSecretResolver_Returns = Lib_MessageRoutingFeatures_SecretResolver;

export type Index_DisconnectGateway_Client = Client | undefined;
export type Index_DisconnectGateway_Returns = void;

export type Index_Lifecycle_Client = Client | undefined;
export type Index_Lifecycle_ActiveFeatureKeys = Shared_FeatureKey[];
export type Index_Lifecycle_AppliedGeneration = number | undefined;
export type Index_Lifecycle_AttemptedGeneration = number | undefined;
export type Index_Lifecycle_ConfigurationErrors = string[];
export type Index_Lifecycle_LastHeartbeatAt = number;
export type Index_Lifecycle_Status = string | undefined;
export type Index_Lifecycle_UserTag = string | undefined;
export type Index_Lifecycle_GuildCount = number;
export type Index_Lifecycle = {
  activeFeatureKeys: Index_Lifecycle_ActiveFeatureKeys;
  client: Index_Lifecycle_Client;
  appliedGeneration: Index_Lifecycle_AppliedGeneration;
  attemptedGeneration: Index_Lifecycle_AttemptedGeneration;
  configurationErrors: Index_Lifecycle_ConfigurationErrors;
  guildCount: Index_Lifecycle_GuildCount;
  lastHeartbeatAt: Index_Lifecycle_LastHeartbeatAt;
  status: Index_Lifecycle_Status;
  userTag: Index_Lifecycle_UserTag;
};

export type Index_Main_Returns = Promise<void>;
export type Index_Main_Configuration = Shared_RuntimeConfiguration;
export type Index_Main_Pool = Pool;
export type Index_Main_CredentialKey = Buffer;
export type Index_Main_Lifecycle = Index_Lifecycle;
export type Index_Main_ShutdownRequested = boolean;
export type Index_Main_RequestShutdown = () => void;
export type Index_Main_RuntimeControl = Shared_BotRuntimeControl;
export type Index_Main_StopDebugLogging = () => void;

export type Index_PublishHeartbeat_Pool = Pool;
export type Index_PublishHeartbeat_Lifecycle = Index_Lifecycle;
export type Index_PublishHeartbeat_Status = Shared_RuntimeHeartbeat_Status;
export type Index_PublishHeartbeat_Details = Shared_RuntimeHeartbeat_Details;
export type Index_PublishHeartbeat_Force = boolean;
export type Index_PublishHeartbeat_Returns = Promise<Index_Lifecycle>;
export type Index_PublishHeartbeat_CurrentTime = number;

export type Index_ReconcileGateway_Pool = Pool;
export type Index_ReconcileGateway_CredentialKey = Buffer;
export type Index_ReconcileGateway_Lifecycle = Index_Lifecycle;
export type Index_ReconcileGateway_RuntimeControl = Shared_BotRuntimeControl;
export type Index_ReconcileGateway_Returns = Promise<Index_Lifecycle>;
export type Index_ReconcileGateway_Configured = boolean;
export type Index_ReconcileGateway_NextLifecycle = Index_Lifecycle;
export type Index_ReconcileGateway_Connection = Index_ConnectGateway_Connection;

export type Index_SynchronizeDiscordRegistry_Client = Client;
export type Index_SynchronizeDiscordRegistry_Pool = Pool;
export type Index_SynchronizeDiscordRegistry_Returns = Promise<void>;
export type Index_SynchronizeDiscordRegistry_ApplicationIdentifier = string;
export type Index_SynchronizeDiscordRegistry_DiscordServers = Lib_ConfigurationDatabase_SyncDiscordServers_Server[];

export type Index_Run_Returns = Promise<void>;

export type Index_WaitForClientReady_Client = Client;
export type Index_WaitForClientReady_Returns = Promise<void>;
