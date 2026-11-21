import type {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

import type { Secret } from 'otpauth';
import type {
  Plugin,
  ViteDevServer,
} from 'vite';

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_MockRole = 'administrator' | 'operator' | 'owner' | 'viewer';

export type MockApi_MockPermission = 'bot:control' | 'configuration:write' | 'users:manage';

export type MockApi_MockScope = 'bot:control' | 'features:read' | 'features:write' | 'logs:read';

export type MockApi_MockComponent = 'bot' | 'web' | 'worker';

export type MockApi_MockLevel = 'debug' | 'error' | 'info' | 'warn';

export type MockApi_MockIssue = {
  field: string;
  message: string;
  path: string[];
};

export type MockApi_MockUser = {
  allServers: boolean;
  createdAt: string;
  enabled: boolean;
  id: string;
  lastSignInAt: string | null;
  password: string;
  recoveryCodes: string[];
  role: MockApi_MockRole;
  serverIds: string[];
  totpEnabled: boolean;
  totpPending: boolean;
  username: string;
};

export type MockApi_MockToken = {
  createdAt: string;
  expiresAt: string | null;
  hash: string;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: MockApi_MockScope[];
  userId: string;
};

export type MockApi_MockPasskey = {
  createdAt: string;
  hostname: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
};

export type MockApi_MockPrincipal = {
  kind: 'session' | 'token';
  token: MockApi_MockToken | null;
  user: MockApi_MockUser;
};

export type MockApi_MockServer = {
  available: boolean;
  boostTier: number;
  iconUrl: string | null;
  id: string;
  memberCount: number;
  name: string;
};

export type MockApi_MockChannel = {
  available: boolean;
  id: string;
  name: string;
  type: number;
};

export type MockApi_MockDiscordRole = {
  available: boolean;
  id: string;
  name: string;
  position: number;
};

export type MockApi_MockCatalogEntry = {
  category: string;
  description: string;
  key: string;
  name: string;
};

export type MockApi_MockFeatureState = {
  configuration: unknown;
  enabled: boolean;
  revision: number;
  updatedAt: string | null;
};

export type MockApi_MockLegacyResult = {
  discordToken?: string | undefined;
  guildIdentifier?: string | undefined;
  report: Record<string, unknown>;
  secrets: {
    key: string;
    value: string;
  }[];
  settings: {
    features?: Record<string, {
      configuration: unknown;
      enabled: boolean;
    }>;
  };
};

export type MockApi_MockModules = {
  blank: (value: unknown) => unknown;
  catalog: MockApi_MockCatalogEntry[];
  editorFor: (featureKey: string) => Record<string, unknown>;
  exampleFor: ((featureKey: string, starterSettings: unknown) => unknown) | null;
  importLegacy: ((text: string, enable: boolean) => MockApi_MockLegacyResult) | null;
  real: boolean;
  validate: ((featureKey: string, configuration: unknown, resolve: (key: string) => string | undefined) => MockApi_MockIssue[]) | null;
};

// MockApi_MockBackupPurpose names the sensitive operation one fresh-authentication grant can authorize.
export type MockApi_MockBackupPurpose = 'export' | 'import';

// MockApi_MockBackupFeature keeps one feature's portable settings and opened secrets together.
export type MockApi_MockBackupFeature = {
  configuration: unknown;
  enabled: boolean;
  key: string;
  secrets: Record<string, string>;
};

// MockApi_MockBackupServerFeatures groups portable feature state by Discord server identifier.
export type MockApi_MockBackupServerFeatures = {
  features: MockApi_MockBackupFeature[];
  serverId: string;
  timeZone: string;
};

export type MockApi_MockNotificationService = 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';

// MockApi_MockBackupNotification opens one notification target's secret fields for the temporary file.
export type MockApi_MockBackupNotification = {
  events: string[];
  id: string;
  name: string;
  secrets: Record<string, string>;
  service: MockApi_MockNotificationService;
  settings: Record<string, string>;
};

// MockApi_MockBackupAccessToken carries the one-way token material that can be restored without exposing a token.
export type MockApi_MockBackupAccessToken = {
  expiresAt: string | null;
  id: string;
  name: string;
  scopes: MockApi_MockScope[];
  tokenHash: string;
};

// MockApi_MockBackupDocument mirrors the browser and server version-one export contract.
export type MockApi_MockBackupDocument = {
  accessTokens?: MockApi_MockBackupAccessToken[] | undefined;
  appVersion: string;
  connection?: {
    botToken: string | null;
    desiredState: 'running' | 'stopped';
  } | undefined;
  exportedAt: string;
  features?: MockApi_MockBackupServerFeatures[] | undefined;
  format: 'discord-stonker-bot-export';
  notifications?: MockApi_MockBackupNotification[] | undefined;
  version: 1;
};

// MockApi_MockBackupSource represents either source card in the shared import wizard.
export type MockApi_MockBackupSource = {
  document: MockApi_MockBackupDocument;
  type: 'export';
} | {
  configuration: string;
  enableFeatures: boolean;
  serverId: string;
  type: 'legacy';
};

// MockApi_MockBackupSummary holds the counts rendered by Settings and Review.
export type MockApi_MockBackupSummary = {
  accessTokens: {
    added: number;
    skipped: number;
  };
  connection: 'added' | 'replaced' | 'skipped';
  features: {
    features: number;
    servers: number;
  };
  notifications: {
    added: number;
    replaced: number;
  };
};

// MockApi_MockBackupGrantRecord retains only the grant digest with its browser-session binding.
export type MockApi_MockBackupGrantRecord = {
  expiresAt: number;
  purpose: MockApi_MockBackupPurpose;
  sessionId: string;
};

// MockApi_MockBackupPasskeyCeremony binds the passkey prompt to the requesting session and purpose.
export type MockApi_MockBackupPasskeyCeremony = MockApi_MockBackupGrantRecord;

export type MockApi_MockInvitePage = {
  accentColor: string;
  bannerImageId: string | null;
  buttonLabel: string;
  description: string;
  footerText: string;
  logo: 'custom' | 'none' | 'server';
  logoImageId: string | null;
  revision: number;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: 'dark' | 'light' | 'system';
  title: string;
  updatedAt: string | null;
};

export type MockApi_MockImage = {
  contentType: string;
  data: Buffer;
  serverId: string;
};

export type MockApi_MockLogEntry = {
  component: MockApi_MockComponent;
  context: Record<string, unknown>;
  event: string;
  id: string;
  level: MockApi_MockLevel;
  occurredAt: string;
};

export type MockApi_MockBot = {
  activeFeatures: string[];
  applicationId: string | null;
  configurationErrors: string[];
  desiredState: 'running' | 'stopped';
  resolution: string | null;
  status: string;
  tokenConfigured: boolean;
  userTag: string | null;
};

export type MockApi_MockNotification = {
  createdAt: string;
  events: string[];
  id: string;
  lastAttemptAt: string | null;
  lastError: string | null;
  name: string;
  secrets: Record<string, true>;
  secretsMissing: string[];
  service: MockApi_MockNotificationService;
  settings: Record<string, string>;
  updatedAt: string;
};

// MockApi_MockNotificationField is one service field: [key, message when missing, secret, required].
export type MockApi_MockNotificationField = [string, string, boolean, boolean];

// MockApi_MockNotificationInput is a checked create or edit body, with the optional secrets to clear.
export type MockApi_MockNotificationInput = Pick<MockApi_MockNotification, 'events' | 'name' | 'secrets' | 'service' | 'settings'> & {
  clearSecrets: string[];
};

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_NotificationFields = Record<MockApi_MockNotificationService, MockApi_MockNotificationField[]>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_NotificationEvents_NotificationEvent = {
  defaultEnabled: boolean;
  description: string;
  key: string;
  label: string;
};
export type MockApi_NotificationEvents = MockApi_NotificationEvents_NotificationEvent[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SetupCode = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_MockPassword = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Minute = number;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_StartedAt = number;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LevelOrder = MockApi_MockLevel[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ScopeOrder = MockApi_MockScope[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_RolePermissions = Record<MockApi_MockRole, MockApi_MockPermission[]>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PermissionMessages = Record<MockApi_MockPermission, string>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_RecaptchaTestSiteKey = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LoungeIcon = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Servers = MockApi_MockServer[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LoungeId = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ClubId = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Channels = Record<string, MockApi_MockChannel[]>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Roles = Record<string, MockApi_MockDiscordRole[]>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Owner = MockApi_MockUser | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_UserSequence = number;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Users = MockApi_MockUser[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PasskeysByUser = Map<string, MockApi_MockPasskey[]>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PasskeyCeremonies = Map<string, string>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_BackupGrants = Map<string, MockApi_MockBackupGrantRecord>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_BackupPasskeyCeremonies = Map<string, MockApi_MockBackupPasskeyCeremony>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Tokens = MockApi_MockToken[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Sessions_Session = {
  csrfToken: string;
  userId: string;
};
export type MockApi_Sessions = Map<string, MockApi_Sessions_Session>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PendingChallenge_Challenge = {
  challenge: string;
  failures: number;
  userId: string;
};
export type MockApi_PendingChallenge = MockApi_PendingChallenge_Challenge | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_KeyReplaced = boolean;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Bot = MockApi_MockBot;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_DebugLogging = boolean;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_RemovedSecrets_RemovedSecret = {
  featureKey?: string;
  featureName?: string;
  kind: 'authenticator' | 'bot-token' | 'feature-secrets' | 'notification';
  name?: string;
  notificationId?: string;
  removedAt: string;
  serverId?: string;
  serverName?: string;
  userId?: string;
};
export type MockApi_RemovedSecrets = MockApi_RemovedSecrets_RemovedSecret[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_BotTimer = NodeJS.Timeout | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Notifications = MockApi_MockNotification[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SecretKeys = string[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Logs = MockApi_MockLogEntry[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LogSequence = number;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FeatureStates = Map<string, Map<string, MockApi_MockFeatureState>>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SecretStores = Map<string, Map<string, string>>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Examples = Map<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FeaturesReady = Promise<void> | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ViteServer = ViteDevServer | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FallbackNoticeShown = boolean;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_InvitePages = Map<string, MockApi_MockInvitePage>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Images = Map<string, MockApi_MockImage>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_InviteAttempts = Map<string, number[]>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_NowIso_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_AgoIso_Minutes = number;
export type MockApi_AgoIso_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SnowflakeAt_Time = number;
export type MockApi_SnowflakeAt_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_IsRecord_Value = unknown;
export type MockApi_IsRecord_TypeGuard = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_Digest_Value = string;
export type MockApi_Digest_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_UserIdFor_Sequence = number;
export type MockApi_UserIdFor_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PermissionsOf_User = MockApi_MockUser;
export type MockApi_PermissionsOf_Returns = MockApi_MockPermission[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ServerVisible_User = MockApi_MockUser;
export type MockApi_ServerVisible_ServerId = string;
export type MockApi_ServerVisible_Returns = boolean;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_NormalizeCode_Value = string;
export type MockApi_NormalizeCode_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_UsernameIssue_Value = string;
export type MockApi_UsernameIssue_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PasswordIssue_Value = unknown;
export type MockApi_PasswordIssue_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_NewRecoveryCodes_Returns = string[];
export type MockApi_NewRecoveryCodes_Code = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_AddServerUrl_Returns = string | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_WriteLog_Component = MockApi_MockComponent;
export type MockApi_WriteLog_Level = MockApi_MockLevel;
export type MockApi_WriteLog_Event = string;
export type MockApi_WriteLog_Context = Record<string, unknown>;
export type MockApi_WriteLog_MinutesAgo = number;
export type MockApi_WriteLog_Returns = void;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SeedLogs_Returns = void;
export type MockApi_SeedLogs_Entry = [MockApi_MockComponent, MockApi_MockLevel, string, Record<string, unknown>, number];
export type MockApi_SeedLogs_Entries = MockApi_SeedLogs_Entry[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LiveEvents_LiveEvent = [MockApi_MockComponent, MockApi_MockLevel, string, () => Record<string, unknown>];
export type MockApi_LiveEvents = MockApi_LiveEvents_LiveEvent[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_WriteLiveLog_Returns = void;
export type MockApi_WriteLiveLog_Pick = MockApi_LiveEvents_LiveEvent | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_MatchesLogFilters_Entry = MockApi_MockLogEntry;
export type MockApi_MatchesLogFilters_Component = string;
export type MockApi_MatchesLogFilters_MinimumLevel = MockApi_MockLevel;
export type MockApi_MatchesLogFilters_Search = string;
export type MockApi_MatchesLogFilters_Returns = boolean;
export type MockApi_MatchesLogFilters_Needle = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SeedAccounts_Claimed = MockApi_MockUser;
export type MockApi_SeedAccounts_Returns = void;
export type MockApi_SeedAccounts_Seed = [string, MockApi_MockRole, boolean, string[], boolean, boolean, number | null];
export type MockApi_SeedAccounts_Seeds = MockApi_SeedAccounts_Seed[];
export type MockApi_SeedAccounts_Username = string;
export type MockApi_SeedAccounts_Role = MockApi_MockRole;
export type MockApi_SeedAccounts_AllServers = boolean;
export type MockApi_SeedAccounts_ServerIds = string[];
export type MockApi_SeedAccounts_Enabled = boolean;
export type MockApi_SeedAccounts_TotpEnabled = boolean;
export type MockApi_SeedAccounts_LastSignIn = number | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_EditableBy_Manager = MockApi_MockUser;
export type MockApi_EditableBy_User = MockApi_MockUser;
export type MockApi_EditableBy_Returns = boolean;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_UserResource_User = MockApi_MockUser;
export type MockApi_UserResource_Manager = MockApi_MockUser;
export type MockApi_UserResource_Returns = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_TokenResource_Token = MockApi_MockToken;
export type MockApi_TokenResource_Returns = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_RoleRank = Record<MockApi_MockRole, number>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FallbackEditors = Record<string, Record<string, unknown>>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FallbackCatalog = MockApi_MockCatalogEntry[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FallbackConfigurations = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_BlankSecrets_Value = unknown;
export type MockApi_BlankSecrets_Returns = unknown;
export type MockApi_BlankSecrets_Entry = [string, unknown];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FallbackModules_Returns = MockApi_MockModules;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LoadModules_Returns = Promise<MockApi_MockModules>;
export type MockApi_LoadModules_CatalogModule = Record<string, unknown>;
export type MockApi_LoadModules_EditorModule = Record<string, unknown>;
export type MockApi_LoadModules_ImportModule = Record<string, unknown>;
export type MockApi_LoadModules_ValidationModule = Record<string, unknown>;
export type MockApi_LoadModules_SecretsModule = Record<string, unknown>;
export type MockApi_LoadModules_GetFeatureCatalog = unknown;
export type MockApi_LoadModules_GetFeatureEditor = unknown;
export type MockApi_LoadModules_GetFeatureExample = unknown;
export type MockApi_LoadModules_ImportLegacyConfiguration = unknown;
export type MockApi_LoadModules_ValidateFeatureConfiguration = unknown;
export type MockApi_LoadModules_BlankSecretReferences = unknown;
export type MockApi_LoadModules_Catalog = MockApi_MockCatalogEntry[];
export type MockApi_LoadModules_Editor = Record<string, unknown>;
export type MockApi_LoadModules_LegacyResult = MockApi_MockLegacyResult;
export type MockApi_LoadModules_Issues = MockApi_MockIssue[];
export type MockApi_LoadModules_ErrorMessage = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_StatesFor_ServerId = string;
export type MockApi_StatesFor_Returns = Map<string, MockApi_MockFeatureState>;
export type MockApi_StatesFor_Existing = Map<string, MockApi_MockFeatureState> | undefined;
export type MockApi_StatesFor_Created = Map<string, MockApi_MockFeatureState>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SecretsFor_ServerId = string;
export type MockApi_SecretsFor_Returns = Map<string, string>;
export type MockApi_SecretsFor_Existing = Map<string, string> | undefined;
export type MockApi_SecretsFor_Created = Map<string, string>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_StateOf_ServerId = string;
export type MockApi_StateOf_FeatureKey = string;
export type MockApi_StateOf_Returns = MockApi_MockFeatureState;
export type MockApi_StateOf_States = Map<string, MockApi_MockFeatureState>;
export type MockApi_StateOf_Existing = MockApi_MockFeatureState | undefined;
export type MockApi_StateOf_Created = MockApi_MockFeatureState;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PrepareFeatures_Returns = Promise<void>;
export type MockApi_PrepareFeatures_Modules = MockApi_MockModules;
export type MockApi_PrepareFeatures_LoungeOn = string[];
export type MockApi_PrepareFeatures_ExampleText = string;
export type MockApi_PrepareFeatures_Imported = MockApi_MockLegacyResult | null;
export type MockApi_PrepareFeatures_ImportedFeatures_ImportedFeature = {
  configuration: unknown;
  enabled: boolean;
};
export type MockApi_PrepareFeatures_ImportedFeatures = Record<string, MockApi_PrepareFeatures_ImportedFeatures_ImportedFeature>;
export type MockApi_PrepareFeatures_ImportedFeature = MockApi_PrepareFeatures_ImportedFeatures_ImportedFeature | undefined;
export type MockApi_PrepareFeatures_Configuration = unknown;
export type MockApi_PrepareFeatures_Example = unknown;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_EnsureFeatures_Returns = Promise<void>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FeatureSummary_Entry = MockApi_MockCatalogEntry;
export type MockApi_FeatureSummary_ServerId = string;
export type MockApi_FeatureSummary_Returns = Record<string, unknown>;
export type MockApi_FeatureSummary_State = MockApi_MockFeatureState;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_CollectReferences_Value = unknown;
export type MockApi_CollectReferences_Path = string[];
export type MockApi_CollectReferences_Returns = {
  key: string;
  path: string[];
}[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_StringList_Value = unknown;
export type MockApi_StringList_Returns = string[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FeatureDisplayName_FeatureKey = string;
export type MockApi_FeatureDisplayName_Modules = MockApi_MockModules;
export type MockApi_FeatureDisplayName_Returns = string;
export type MockApi_FeatureDisplayName_Feature = MockApi_MockCatalogEntry | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_LegacyWarningLabel_Warning = string;
export type MockApi_LegacyWarningLabel_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_EmptyBackupSummary_Returns = MockApi_MockBackupSummary;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_IssueBackupGrant_SessionId = string;
export type MockApi_IssueBackupGrant_Purpose = MockApi_MockBackupPurpose;
export type MockApi_IssueBackupGrant_Returns = {
  expiresAt: string;
  grant: string;
};
export type MockApi_IssueBackupGrant_Grant = string;
export type MockApi_IssueBackupGrant_ExpiresAt = number;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ConsumeBackupGrant_Value = unknown;
export type MockApi_ConsumeBackupGrant_SessionId = string;
export type MockApi_ConsumeBackupGrant_Purpose = MockApi_MockBackupPurpose;
export type MockApi_ConsumeBackupGrant_Returns = boolean;
export type MockApi_ConsumeBackupGrant_Key = string;
export type MockApi_ConsumeBackupGrant_Record = MockApi_MockBackupGrantRecord | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ParseMockBackupSource_Value = unknown;
export type MockApi_ParseMockBackupSource_Returns = MockApi_MockBackupSource | null;
export type MockApi_ParseMockBackupSource_Document = Record<string, unknown>;
export type MockApi_ParseMockBackupSource_Source = MockApi_MockBackupSource;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_CreateMockBackupDocument_Sections = Record<string, unknown>;
export type MockApi_CreateMockBackupDocument_User = MockApi_MockUser;
export type MockApi_CreateMockBackupDocument_Returns = MockApi_MockBackupDocument;
export type MockApi_CreateMockBackupDocument_Document = MockApi_MockBackupDocument;
export type MockApi_CreateMockBackupDocument_Key = string;
export type MockApi_CreateMockBackupDocument_State = MockApi_MockFeatureState;
export type MockApi_CreateMockBackupDocument_Store = Map<string, string>;
export type MockApi_CreateMockBackupDocument_Secrets = Record<string, string>;
export type MockApi_CreateMockBackupDocument_Secret = string | undefined;
export type MockApi_CreateMockBackupDocument_SecretEntry = [string, string];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PreviewMockBackup_Source = MockApi_MockBackupSource;
export type MockApi_PreviewMockBackup_User = MockApi_MockUser;
export type MockApi_PreviewMockBackup_Modules = MockApi_MockModules;
export type MockApi_PreviewMockBackup_Returns = Record<string, unknown>;
export type MockApi_PreviewMockBackup_Summary = MockApi_MockBackupSummary;
export type MockApi_PreviewMockBackup_Result = MockApi_MockLegacyResult;
export type MockApi_PreviewMockBackup_Recognized = string[];
export type MockApi_PreviewMockBackup_Enabled = string[];
export type MockApi_PreviewMockBackup_Invalid = string[];
export type MockApi_PreviewMockBackup_Unsupported = string[];
export type MockApi_PreviewMockBackup_Warnings = string[];
export type MockApi_PreviewMockBackup_RecognizedPlural = string;
export type MockApi_PreviewMockBackup_Sections = Record<string, unknown>[];
export type MockApi_PreviewMockBackup_FeaturesRequiringFixes = Record<string, string>[];
export type MockApi_PreviewMockBackup_Document = MockApi_MockBackupDocument;
export type MockApi_PreviewMockBackup_FileState = string;
export type MockApi_PreviewMockBackup_FileToken = string;
export type MockApi_PreviewMockBackup_HereState = string;
export type MockApi_PreviewMockBackup_HereToken = string;
export type MockApi_PreviewMockBackup_CurrentFeatures = number;
export type MockApi_PreviewMockBackup_FileFeaturesPlural = string;
export type MockApi_PreviewMockBackup_FileServersPlural = string;
export type MockApi_PreviewMockBackup_HereFeaturesPlural = string;
export type MockApi_PreviewMockBackup_HereServersPlural = string;
export type MockApi_PreviewMockBackup_Names = Set<string>;
export type MockApi_PreviewMockBackup_FilePlural = string;
export type MockApi_PreviewMockBackup_HerePlural = string;
export type MockApi_PreviewMockBackup_OwnTokens = MockApi_MockToken[];
export type MockApi_PreviewMockBackup_Hashes = Set<string>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ApplyMockBackup_Source = MockApi_MockBackupSource;
export type MockApi_ApplyMockBackup_User = MockApi_MockUser;
export type MockApi_ApplyMockBackup_Modules = MockApi_MockModules;
export type MockApi_ApplyMockBackup_Returns = Record<string, unknown>;
export type MockApi_ApplyMockBackup_Preview = Record<string, unknown>;
export type MockApi_ApplyMockBackup_Summary = MockApi_MockBackupSummary;
export type MockApi_ApplyMockBackup_ImportedSections = string[];
export type MockApi_ApplyMockBackup_Result = MockApi_MockLegacyResult;
export type MockApi_ApplyMockBackup_FeatureKey = string;
export type MockApi_ApplyMockBackup_Feature = {
  configuration: unknown;
  enabled: boolean;
};
export type MockApi_ApplyMockBackup_State = MockApi_MockFeatureState;
export type MockApi_ApplyMockBackup_Document = MockApi_MockBackupDocument;
export type MockApi_ApplyMockBackup_States = Map<string, MockApi_MockFeatureState>;
export type MockApi_ApplyMockBackup_Secrets = Map<string, string>;
export type MockApi_ApplyMockBackup_UsedIds = Set<string>;
export type MockApi_ApplyMockBackup_Existing = MockApi_MockNotification | undefined;
export type MockApi_ApplyMockBackup_Id = string;
export type MockApi_ApplyMockBackup_Next = MockApi_MockNotification;
export type MockApi_ApplyMockBackup_SecretEntry = [string, true];
export type MockApi_ApplyMockBackup_Names = Set<string>;
export type MockApi_ApplyMockBackup_Hashes = Set<string>;
export type MockApi_ApplyMockBackup_Ids = Set<string>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ReadPointer_Value = unknown;
export type MockApi_ReadPointer_Pointer = string;
export type MockApi_ReadPointer_Returns = unknown;
export type MockApi_ReadPointer_Current = unknown;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FeatureDetail_Entry = MockApi_MockCatalogEntry;
export type MockApi_FeatureDetail_ServerId = string;
export type MockApi_FeatureDetail_Returns = Promise<Record<string, unknown>>;
export type MockApi_FeatureDetail_Modules = MockApi_MockModules;
export type MockApi_FeatureDetail_State = MockApi_MockFeatureState;
export type MockApi_FeatureDetail_Store = Map<string, string>;
export type MockApi_FeatureDetail_Saved = Record<string, boolean>;
export type MockApi_FeatureDetail_Editor = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_InvitePageFor_Server = MockApi_MockServer;
export type MockApi_InvitePageFor_Returns = MockApi_MockInvitePage;
export type MockApi_InvitePageFor_Existing = MockApi_MockInvitePage | undefined;
export type MockApi_InvitePageFor_Created = MockApi_MockInvitePage;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_InvitePathFor_ServerId = string;
export type MockApi_InvitePathFor_Returns = string | null;
export type MockApi_InvitePathFor_Configuration = unknown;
export type MockApi_InvitePathFor_Generator = unknown;
export type MockApi_InvitePathFor_Options = unknown;
export type MockApi_InvitePathFor_Path = unknown;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_MediaUrl_ImageId = string | null;
export type MockApi_MediaUrl_Returns = string | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_DesignerResponse_Server = MockApi_MockServer;
export type MockApi_DesignerResponse_Origin = string;
export type MockApi_DesignerResponse_Returns = Record<string, unknown>;
export type MockApi_DesignerResponse_Page = MockApi_MockInvitePage;
export type MockApi_DesignerResponse_Path = string | null;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_EscapeHtml_Value = string;
export type MockApi_EscapeHtml_Returns = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SendJson_Response = ServerResponse;
export type MockApi_SendJson_Status = number;
export type MockApi_SendJson_Body = unknown;
export type MockApi_SendJson_Returns = void;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SendEmpty_Response = ServerResponse;
export type MockApi_SendEmpty_Status = number;
export type MockApi_SendEmpty_Returns = void;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SendError_Response = ServerResponse;
export type MockApi_SendError_Status = number;
export type MockApi_SendError_Code = string;
export type MockApi_SendError_Message = string;
export type MockApi_SendError_Returns = void;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SendIssues_Response = ServerResponse;
export type MockApi_SendIssues_Status = number;
export type MockApi_SendIssues_Code = string;
export type MockApi_SendIssues_Issues = MockApi_MockIssue[];
export type MockApi_SendIssues_Returns = void;
export type MockApi_SendIssues_FirstIssue = MockApi_MockIssue | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_FieldIssue_Field = string;
export type MockApi_FieldIssue_Message = string;
export type MockApi_FieldIssue_Returns = MockApi_MockIssue;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ReadRaw_Request = IncomingMessage;
export type MockApi_ReadRaw_Returns = Promise<Buffer>;
export type MockApi_ReadRaw_Chunks = Buffer[];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_ReadCookies_Request = IncomingMessage;
export type MockApi_ReadCookies_Returns = Record<string, string>;
export type MockApi_ReadCookies_Entry = [string, string];

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_StartSession_Response = ServerResponse;
export type MockApi_StartSession_User = MockApi_MockUser;
export type MockApi_StartSession_Status = number;
export type MockApi_StartSession_Returns = void;
export type MockApi_StartSession_SessionId = string;
export type MockApi_StartSession_CsrfToken = string;
export type MockApi_StartSession_SignedIn = MockApi_MockUser | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_PrincipalOf_Request = IncomingMessage;
export type MockApi_PrincipalOf_Returns = MockApi_MockPrincipal | null;
export type MockApi_PrincipalOf_Authorization = string;
export type MockApi_PrincipalOf_Token = MockApi_MockToken | undefined;
export type MockApi_PrincipalOf_User = MockApi_MockUser | undefined;
export type MockApi_PrincipalOf_Session = MockApi_Sessions_Session | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_CsrfValid_Request = IncomingMessage;
export type MockApi_CsrfValid_Returns = boolean;
export type MockApi_CsrfValid_Session = MockApi_Sessions_Session | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SignOutUser_UserId = string;
export type MockApi_SignOutUser_Returns = void;
export type MockApi_SignOutUser_SessionId = string;
export type MockApi_SignOutUser_Session = MockApi_Sessions_Session;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_SetBotStatus_Status = string;
export type MockApi_SetBotStatus_Delay = number;
export type MockApi_SetBotStatus_Next = string | null;
export type MockApi_SetBotStatus_Returns = void;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_BotResource_Returns = Record<string, unknown>;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandlePublic_Request = IncomingMessage;
export type MockApi_HandlePublic_Response = ServerResponse;
export type MockApi_HandlePublic_Url = URL;
export type MockApi_HandlePublic_Returns = Promise<boolean>;
export type MockApi_HandlePublic_Method = string;
export type MockApi_HandlePublic_MediaMatch = RegExpMatchArray | null;
export type MockApi_HandlePublic_Image = MockApi_MockImage | undefined;
export type MockApi_HandlePublic_Server = MockApi_MockServer | undefined;
export type MockApi_HandlePublic_Page = MockApi_MockInvitePage;
export type MockApi_HandlePublic_Available = boolean;
export type MockApi_HandlePublic_Address = string;
export type MockApi_HandlePublic_Recent = number[];
export type MockApi_HandlePublic_Body = unknown;
export type MockApi_HandlePublic_Origin = string;
export type MockApi_HandlePublic_BannerUrl = string | null;
export type MockApi_HandlePublic_LogoUrl = string | null;
export type MockApi_HandlePublic_StatsParts = string[];
export type MockApi_HandlePublic_Description = string;
export type MockApi_HandlePublic_PreviewImage = string | null;
export type MockApi_HandlePublic_TwitterCard = string;
export type MockApi_HandlePublic_Head = string;
export type MockApi_HandlePublic_Data = string;
export type MockApi_HandlePublic_Template = string;
export type MockApi_HandlePublic_Html = string;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_Request = IncomingMessage;
export type MockApi_HandleRequest_Response = ServerResponse;
export type MockApi_HandleRequest_Returns = Promise<boolean>;
export type MockApi_HandleRequest_Url = URL;
export type MockApi_HandleRequest_Path = string;
export type MockApi_HandleRequest_Method = string;
export type MockApi_HandleRequest_UploadRoute = boolean;
export type MockApi_HandleRequest_Raw = Buffer;
export type MockApi_HandleRequest_Body = Record<string, unknown>;
export type MockApi_HandleRequest_Parsed = unknown;
export type MockApi_HandleRequest_ClaimUsername = string;
export type MockApi_HandleRequest_ClaimUsernameIssue = string;
export type MockApi_HandleRequest_LoginUsername = string;
export type MockApi_HandleRequest_LoginPassword = unknown;
export type MockApi_HandleRequest_LoginUser = MockApi_MockUser | undefined;
export type MockApi_HandleRequest_Code = string;
export type MockApi_HandleRequest_CurrentChallenge = MockApi_PendingChallenge_Challenge | null;
export type MockApi_HandleRequest_ChallengeUser = MockApi_MockUser | undefined;
export type MockApi_HandleRequest_IsTotpCode = boolean;
export type MockApi_HandleRequest_RecoveryCode = string | undefined;
export type MockApi_HandleRequest_Principal = MockApi_MockPrincipal | null;
export type MockApi_HandleRequest_User = MockApi_MockUser;
export type MockApi_HandleRequest_IsSession = boolean;
export type MockApi_HandleRequest_VisibleSecret = MockApi_RemovedSecrets_RemovedSecret;
export type MockApi_HandleRequest_Purpose = unknown;
export type MockApi_HandleRequest_SessionId = string;
export type MockApi_HandleRequest_CeremonyId = string;
export type MockApi_HandleRequest_CeremonyIdInput = unknown;
export type MockApi_HandleRequest_Binding = MockApi_MockBackupPasskeyCeremony | undefined;
export type MockApi_HandleRequest_Selected = unknown;
export type MockApi_HandleRequest_Document = MockApi_MockBackupDocument;
export type MockApi_HandleRequest_Source = MockApi_MockBackupSource | null;
export type MockApi_HandleRequest_Message = string;
export type MockApi_HandleRequest_Result = Record<string, unknown>;
export type MockApi_HandleRequest_ServerMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_ServerId = string;
export type MockApi_HandleRequest_Rest = string;
export type MockApi_HandleRequest_Server = MockApi_MockServer | undefined;
export type MockApi_HandleRequest_Modules = MockApi_MockModules;
export type MockApi_HandleRequest_FeatureMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_Entry = MockApi_MockCatalogEntry | undefined;
export type MockApi_HandleRequest_State = MockApi_MockFeatureState;
export type MockApi_HandleRequest_Store = Map<string, string>;
export type MockApi_HandleRequest_Issues = MockApi_MockIssue[];
export type MockApi_HandleRequest_UnknownKeys = string[];
export type MockApi_HandleRequest_Configuration = unknown;
export type MockApi_HandleRequest_SecretValues = Record<string, unknown>;
export type MockApi_HandleRequest_FreshSecrets = Map<string, string>;
export type MockApi_HandleRequest_Pointer = string;
export type MockApi_HandleRequest_Plaintext = unknown;
export type MockApi_HandleRequest_Node = unknown;
export type MockApi_HandleRequest_Key = string;
export type MockApi_HandleRequest_Referenced = Set<string>;
export type MockApi_HandleRequest_Page = MockApi_MockInvitePage;
export type MockApi_HandleRequest_Allowed = string[];
export type MockApi_HandleRequest_Logo = unknown;
export type MockApi_HandleRequest_Theme = unknown;
export type MockApi_HandleRequest_LogoImageId = string | null;
export type MockApi_HandleRequest_BannerImageId = string | null;
export type MockApi_HandleRequest_ImageCheck = [string, string | null];
export type MockApi_HandleRequest_ImageChecks = MockApi_HandleRequest_ImageCheck[];
export type MockApi_HandleRequest_Field = string;
export type MockApi_HandleRequest_ImageId = string | null;
export type MockApi_HandleRequest_Image = MockApi_MockImage | undefined;
export type MockApi_HandleRequest_PageLogo = MockApi_MockInvitePage['logo'];
export type MockApi_HandleRequest_PageTheme = MockApi_MockInvitePage['theme'];
export type MockApi_HandleRequest_ContentTypeHeader = string | undefined;
export type MockApi_HandleRequest_ContentType = string;
export type MockApi_HandleRequest_SignatureCheck = (data: Buffer) => boolean;
export type MockApi_HandleRequest_Signatures = Record<string, MockApi_HandleRequest_SignatureCheck>;
export type MockApi_HandleRequest_Signature = MockApi_HandleRequest_SignatureCheck | undefined;
export type MockApi_HandleRequest_NewImageId = string;
export type MockApi_HandleRequest_Action = unknown;
export type MockApi_HandleRequest_Token = string;
export type MockApi_HandleRequest_Component = string;
export type MockApi_HandleRequest_MinimumLevel = MockApi_MockLevel;
export type MockApi_HandleRequest_LevelParam = MockApi_MockLevel;
export type MockApi_HandleRequest_Search = string;
export type MockApi_HandleRequest_After = string | null;
export type MockApi_HandleRequest_Matching = MockApi_MockLogEntry[];
export type MockApi_HandleRequest_Items = MockApi_MockLogEntry[];
export type MockApi_HandleRequest_LastItem = MockApi_MockLogEntry | undefined;
export type MockApi_HandleRequest_LastMatching = MockApi_MockLogEntry | undefined;
export type MockApi_HandleRequest_LastMatchingId = string;
export type MockApi_HandleRequest_CursorStart = string | string[];
export type MockApi_HandleRequest_Cursor = number;
export type MockApi_HandleRequest_Poll = NodeJS.Timeout;
export type MockApi_HandleRequest_KeepAlive = NodeJS.Timeout;
export type MockApi_HandleRequest_Requested = unknown;
export type MockApi_HandleRequest_NextUsername = string;
export type MockApi_HandleRequest_NextUsernameIssue = string;
export type MockApi_HandleRequest_TotpSecret = Secret;
export type MockApi_HandleRequest_TotpUri = string;
export type MockApi_HandleRequest_PasskeyName = string;
export type MockApi_HandleRequest_PendingPasskeyName = string | undefined;
export type MockApi_HandleRequest_Passkey = MockApi_MockPasskey;
export type MockApi_HandleRequest_PasskeyId = string;
export type MockApi_HandleRequest_Saved = MockApi_MockPasskey[];
export type MockApi_HandleRequest_NotificationInputValue = MockApi_MockNotificationInput | null;
export type MockApi_HandleRequest_Notification = MockApi_MockNotification;
export type MockApi_HandleRequest_NotificationMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_Index = number;
export type MockApi_HandleRequest_FoundNotification = MockApi_MockNotification | undefined;
export type MockApi_HandleRequest_TokenInputValue = MockApi_HandleRequest_TokenInput_Accepted | null;
export type MockApi_HandleRequest_TokenPlaintext = string;
export type MockApi_HandleRequest_NewToken = MockApi_MockToken;
export type MockApi_HandleRequest_TokenMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_FoundToken = MockApi_MockToken | undefined;
export type MockApi_HandleRequest_Username = string;
export type MockApi_HandleRequest_UsernameProblem = string;
export type MockApi_HandleRequest_PasswordProblem = string;
export type MockApi_HandleRequest_Problems = MockApi_MockIssue[];
export type MockApi_HandleRequest_Access = MockApi_HandleRequest_AccessInput_Accepted | null;
export type MockApi_HandleRequest_Created = MockApi_MockUser;
export type MockApi_HandleRequest_UserMatch = RegExpMatchArray | null;
export type MockApi_HandleRequest_Target = MockApi_MockUser | undefined;
export type MockApi_HandleRequest_Candidate = MockApi_MockToken | undefined;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_RequireScope_Scope = MockApi_MockScope;
export type MockApi_HandleRequest_RequireScope_Returns = boolean;
export type MockApi_HandleRequest_RequireScope = (scope: MockApi_HandleRequest_RequireScope_Scope) => MockApi_HandleRequest_RequireScope_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_RequireSession_Returns = boolean;
export type MockApi_HandleRequest_RequireSession = () => MockApi_HandleRequest_RequireSession_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_RequirePermission_Permission = MockApi_MockPermission;
export type MockApi_HandleRequest_RequirePermission_Returns = boolean;
export type MockApi_HandleRequest_RequirePermission = (permission: MockApi_HandleRequest_RequirePermission_Permission) => MockApi_HandleRequest_RequirePermission_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_CheckPassword_Field = string;
export type MockApi_HandleRequest_CheckPassword_Returns = boolean;
export type MockApi_HandleRequest_CheckPassword = (field?: MockApi_HandleRequest_CheckPassword_Field) => MockApi_HandleRequest_CheckPassword_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_Resolve_Key = string;
export type MockApi_HandleRequest_Resolve_Returns = string | undefined;
export type MockApi_HandleRequest_Resolve = (key: MockApi_HandleRequest_Resolve_Key) => MockApi_HandleRequest_Resolve_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_Text_Key = string;
export type MockApi_HandleRequest_Text_Returns = string;
export type MockApi_HandleRequest_Text = (key: MockApi_HandleRequest_Text_Key) => MockApi_HandleRequest_Text_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_NotificationInput_Existing = MockApi_MockNotification | null;
export type MockApi_HandleRequest_NotificationInput_Returns = MockApi_MockNotificationInput | null;
export type MockApi_HandleRequest_NotificationInput_Service = MockApi_MockNotificationService;
export type MockApi_HandleRequest_NotificationInput_Name = string;
export type MockApi_HandleRequest_NotificationInput_Events = string[];
export type MockApi_HandleRequest_NotificationInput_Values = Record<string, unknown>;
export type MockApi_HandleRequest_NotificationInput_Settings = Record<string, string>;
export type MockApi_HandleRequest_NotificationInput_Secrets = Record<string, true>;
export type MockApi_HandleRequest_NotificationInput_Key = string;
export type MockApi_HandleRequest_NotificationInput_Missing = string;
export type MockApi_HandleRequest_NotificationInput_Secret = boolean;
export type MockApi_HandleRequest_NotificationInput_Required = boolean;
export type MockApi_HandleRequest_NotificationInput_Value = string;
export type MockApi_HandleRequest_NotificationInput_Saved = boolean;
export type MockApi_HandleRequest_NotificationInput_Clearable = string[];
export type MockApi_HandleRequest_NotificationInput_ClearSecrets = unknown[];
export type MockApi_HandleRequest_NotificationInput_InvalidIndex = number;
export type MockApi_HandleRequest_NotificationInput_ClearSecretKeys = string[];
export type MockApi_HandleRequest_NotificationInput_Replaced = string | undefined;
export type MockApi_HandleRequest_NotificationInput_ExistingId = string | undefined;
export type MockApi_HandleRequest_NotificationInput = (existing: MockApi_HandleRequest_NotificationInput_Existing) => MockApi_HandleRequest_NotificationInput_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_TokenInput_ExceptId = string;
export type MockApi_HandleRequest_TokenInput_Accepted = {
  name: string;
  scopes: MockApi_MockScope[];
};
export type MockApi_HandleRequest_TokenInput_Returns = MockApi_HandleRequest_TokenInput_Accepted | null;
export type MockApi_HandleRequest_TokenInput_Name = string;
export type MockApi_HandleRequest_TokenInput_Scopes = MockApi_MockScope[];
export type MockApi_HandleRequest_TokenInput_Grantable = MockApi_MockScope[];
export type MockApi_HandleRequest_TokenInput_Ungrantable = MockApi_MockScope | undefined;
export type MockApi_HandleRequest_TokenInput = (exceptId: MockApi_HandleRequest_TokenInput_ExceptId) => MockApi_HandleRequest_TokenInput_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_HandleRequest_AccessInput_Accepted = {
  allServers: boolean;
  role: MockApi_MockRole;
  serverIds: string[];
};
export type MockApi_HandleRequest_AccessInput_Returns = MockApi_HandleRequest_AccessInput_Accepted | null;
export type MockApi_HandleRequest_AccessInput_Role = unknown;
export type MockApi_HandleRequest_AccessInput_AllServers = boolean;
export type MockApi_HandleRequest_AccessInput_ServerIds = string[];
export type MockApi_HandleRequest_AccessInput_Issues = MockApi_MockIssue[];
export type MockApi_HandleRequest_AccessInput_AccessRole = MockApi_MockRole;
export type MockApi_HandleRequest_AccessInput = () => MockApi_HandleRequest_AccessInput_Returns;

/**
 * Mock API.
 *
 * @since 4.2.1
 */
export type MockApi_MockApi_Returns = Plugin;
export type MockApi_MockApi_LiveTimer = NodeJS.Timeout;
export type MockApi_MockApi_Request = IncomingMessage;
export type MockApi_MockApi_Response = ServerResponse;
export type MockApi_MockApi_Next = () => void;
export type MockApi_MockApi_ErrorMessage = string;
