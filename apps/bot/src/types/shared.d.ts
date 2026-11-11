export type Shared_BotAction = 'restart' | 'start' | 'stop';

export type Shared_BotConfiguration_ControlPollIntervalMilliseconds = number;
export type Shared_BotConfiguration_CredentialKeyFile = string;
export type Shared_BotConfiguration = {
  controlPollIntervalMilliseconds: Shared_BotConfiguration_ControlPollIntervalMilliseconds;
  credentialKeyFile: Shared_BotConfiguration_CredentialKeyFile;
};

export type Shared_BotDesiredState = 'running' | 'stopped';

export type Shared_BotRuntimeControl_DesiredState = Shared_BotDesiredState;
export type Shared_BotRuntimeControl_DiscordApplicationId = string | undefined;
export type Shared_BotRuntimeControl_DiscordTokenCiphertext = string | undefined;
export type Shared_BotRuntimeControl_Generation = number;
export type Shared_BotRuntimeControl_UpdatedAt = string;
export type Shared_BotRuntimeControl = {
  desiredState: Shared_BotRuntimeControl_DesiredState;
  discordApplicationId: Shared_BotRuntimeControl_DiscordApplicationId;
  discordTokenCiphertext: Shared_BotRuntimeControl_DiscordTokenCiphertext;
  generation: Shared_BotRuntimeControl_Generation;
  updatedAt: Shared_BotRuntimeControl_UpdatedAt;
};

export type Shared_DatabaseConfiguration_ConnectionString = string;
export type Shared_DatabaseConfiguration_MaxConnections = number;
export type Shared_DatabaseConfiguration = {
  connectionString: Shared_DatabaseConfiguration_ConnectionString;
  maxConnections: Shared_DatabaseConfiguration_MaxConnections;
};

export type Shared_JsonObject = Record<string, unknown>;

export type Shared_FeatureCategory = 'automation' | 'community' | 'integrations' | 'moderation' | 'safety' | 'web';
export type Shared_FeatureKey =
  | 'anti-raid'
  | 'auto-replies'
  | 'broadcast-alerts'
  | 'bump-threads'
  | 'detect-suspicious-words'
  | 'impersonator-alerts'
  | 'message-copiers'
  | 'message-proxies'
  | 'regex-rules'
  | 'remove-affiliates'
  | 'role-messages'
  | 'rss-feeds'
  | 'scammer-alerts'
  | 'schedule-posts'
  | 'server-tools'
  | 'snitch'
  | 'sync-roles'
  | 'toggle-perms'
  | 'web-applications';
export type Shared_FeatureMigrationStatus = 'import-ready' | 'ported' | 'redesigning';
export type Shared_FeatureDefinition = {
  category: Shared_FeatureCategory;
  description: string;
  key: Shared_FeatureKey;
  legacyCapabilityCount: number;
  name: string;
  status: Shared_FeatureMigrationStatus;
};
export type Shared_FeatureConfiguration = {
  configuration: unknown;
  enabled: boolean;
};
export type Shared_FeatureConfigurations = Partial<Record<Shared_FeatureKey, Shared_FeatureConfiguration>>;

export type Shared_Job_Attempts = number;
export type Shared_Job_Id = string;
export type Shared_Job_Payload = Shared_JsonObject;
export type Shared_Job_Type = string;
export type Shared_Job = {
  attempts: Shared_Job_Attempts;
  id: Shared_Job_Id;
  payload: Shared_Job_Payload;
  type: Shared_Job_Type;
};

export type Shared_LogComponent = 'bot' | 'database' | 'health' | 'migration' | 'web' | 'worker';
export type Shared_LogContext = Record<string, unknown>;
export type Shared_LogEvent = string;
export type Shared_LogLevel = 'debug' | 'error' | 'info' | 'warn';

export type Shared_RuntimeHeartbeat_Component = 'bot' | 'web' | 'worker';
export type Shared_RuntimeHeartbeat_Details = Shared_JsonObject;
export type Shared_RuntimeHeartbeat_ObservedAt = string;
export type Shared_RuntimeHeartbeat_Status = string;
export type Shared_RuntimeHeartbeat = {
  component: Shared_RuntimeHeartbeat_Component;
  details: Shared_RuntimeHeartbeat_Details;
  observedAt: Shared_RuntimeHeartbeat_ObservedAt;
  status: Shared_RuntimeHeartbeat_Status;
};

export type Shared_WebConfiguration_Host = string | undefined;
export type Shared_WebConfiguration_Port = number;
export type Shared_WebConfiguration = {
  host: Shared_WebConfiguration_Host;
  port: Shared_WebConfiguration_Port;
};

export type Shared_WorkerConfiguration_AttemptLimit = number;
export type Shared_WorkerConfiguration_PollIntervalMilliseconds = number;
export type Shared_WorkerConfiguration = {
  attemptLimit: Shared_WorkerConfiguration_AttemptLimit;
  pollIntervalMilliseconds: Shared_WorkerConfiguration_PollIntervalMilliseconds;
};

export type Shared_RuntimeConfiguration = {
  bot: Shared_BotConfiguration;
  database: Shared_DatabaseConfiguration;
  web: Shared_WebConfiguration;
  worker: Shared_WorkerConfiguration;
};

export type Shared_ErrorIssue_Field = string;
export type Shared_ErrorIssue_Message = string;
export type Shared_ErrorIssue_Path = string[];
export type Shared_ErrorIssue = {
  field: Shared_ErrorIssue_Field;
  message: Shared_ErrorIssue_Message;
  path: Shared_ErrorIssue_Path;
};
export type Shared_ErrorIssues = Shared_ErrorIssue[];

export type Shared_WebauthnConfiguration_Origin = string;
export type Shared_WebauthnConfiguration_RpId = string;
export type Shared_WebauthnConfiguration_RpName = string;
export type Shared_WebauthnConfiguration = {
  origin: Shared_WebauthnConfiguration_Origin;
  rpId: Shared_WebauthnConfiguration_RpId;
  rpName: Shared_WebauthnConfiguration_RpName;
};

export type Shared_PanelRole = 'administrator' | 'operator' | 'owner' | 'viewer';
export type Shared_PanelPermission = 'bot:control' | 'configuration:write' | 'users:manage';
export type Shared_TokenScope = 'bot:control' | 'features:read' | 'features:write' | 'logs:read';

export type Shared_AccessUser_AllServers = boolean;
export type Shared_AccessUser_Id = string;
export type Shared_AccessUser_ServerIds = string[];
export type Shared_AccessUser_Username = string;
export type Shared_AccessUser = {
  allServers: Shared_AccessUser_AllServers;
  id: Shared_AccessUser_Id;
  role: Shared_PanelRole;
  serverIds: Shared_AccessUser_ServerIds;
  username: Shared_AccessUser_Username;
};

export type Shared_AccessSession_CsrfHash = string;
export type Shared_AccessSession_ExpiresAt = string;
export type Shared_AccessSession = {
  csrfHash: Shared_AccessSession_CsrfHash;
  expiresAt: Shared_AccessSession_ExpiresAt;
  user: Shared_AccessUser;
};

export type Shared_AccessToken_Id = string;
export type Shared_AccessToken_Name = string;
export type Shared_AccessToken_Scopes = Shared_TokenScope[];
export type Shared_AccessToken = {
  id: Shared_AccessToken_Id;
  name: Shared_AccessToken_Name;
  scopes: Shared_AccessToken_Scopes;
  user: Shared_AccessUser;
};

export type Shared_Principal_Kind = 'session' | 'token';
export type Shared_Principal_SessionToken = string | undefined;
export type Shared_Principal_Token = Omit<Shared_AccessToken, 'user'> | undefined;
export type Shared_Principal = {
  kind: Shared_Principal_Kind;
  sessionToken: Shared_Principal_SessionToken;
  token: Shared_Principal_Token;
  user: Shared_AccessUser;
};

export type Shared_RemovedSecret_FeatureKey = string;
export type Shared_RemovedSecret_FeatureName = string;
export type Shared_RemovedSecret_Kind = 'authenticator' | 'bot-token' | 'feature-secrets' | 'notification';
export type Shared_RemovedSecret_Name = string;
export type Shared_RemovedSecret_NotificationId = string;
export type Shared_RemovedSecret_RemovedAt = string;
export type Shared_RemovedSecret_ServerId = string;
export type Shared_RemovedSecret_ServerName = string;
export type Shared_RemovedSecret = {
  featureKey?: Shared_RemovedSecret_FeatureKey;
  featureName?: Shared_RemovedSecret_FeatureName;
  kind: Shared_RemovedSecret_Kind;
  name?: Shared_RemovedSecret_Name;
  notificationId?: Shared_RemovedSecret_NotificationId;
  removedAt: Shared_RemovedSecret_RemovedAt;
  serverId?: Shared_RemovedSecret_ServerId;
  serverName?: Shared_RemovedSecret_ServerName;
};
export type Shared_RemovedSecrets = Shared_RemovedSecret[];
