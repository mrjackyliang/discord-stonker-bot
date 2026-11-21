import type {
  ZodSafeParseResult,
  ZodType,
} from 'zod';

import type {
  Web_Backup_Grant,
  Web_Backup_ImportPreview,
  Web_Backup_ImportResult,
} from '@/types/web/backup.d.ts';
import type {
  Web_Notifications_Event,
  Web_Notifications_Target,
  Web_Notifications_TestResult,
} from '@/types/web/notifications.d.ts';
import type { Web_Schema_Node } from '@/types/web/schema.d.ts';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Schema<Value> = ZodType<Value>;

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Method = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Request_Options = {
  body?: unknown;
  file?: Blob | undefined;
  headers?: HeadersInit;
  method?: Web_Api_Method;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_ErrorIssue = {
  field: string;
  message: string;
  path: string[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_ErrorEnvelope = {
  error: {
    code: string;
    issues?: Web_Api_ErrorIssue[] | undefined;
    message: string;
  };
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_SetupStatus = {
  claimExpiresAt?: string | undefined;
  claimRequired: boolean;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Role = 'administrator' | 'operator' | 'owner' | 'viewer';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Permission = 'bot:control' | 'configuration:write' | 'users:manage';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Scope = 'bot:control' | 'features:read' | 'features:write' | 'logs:read';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_RemovedSecret = {
  featureKey?: string | undefined;
  featureName?: string | undefined;
  kind: 'authenticator' | 'bot-token' | 'feature-secrets' | 'notification';
  name?: string | undefined;
  notificationId?: string | undefined;
  removedAt: string;
  serverId?: string | undefined;
  serverName?: string | undefined;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Principal = {
  allServers?: boolean | undefined;
  authenticationType: 'session' | 'token';
  id: string;
  name?: string | undefined;
  permissions?: Web_Api_Permission[] | undefined;
  removedSecrets?: Web_Api_RemovedSecret[] | undefined;
  role?: Web_Api_Role | undefined;
  scopes?: string[] | undefined;
  serverIds?: string[] | undefined;
  username?: string | undefined;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_SessionUser = {
  id: string;
  role: Web_Api_Role;
  username: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_AuthenticationResponse = {
  csrfToken: string;
  expiresAt: string;
  status: 'authenticated';
  user: Web_Api_SessionUser;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_SecondFactorRequired = {
  challenge: string;
  expiresAt: string;
  status: 'second_factor_required';
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_LoginResult = Web_Api_AuthenticationResponse | Web_Api_SecondFactorRequired;

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_ClaimInput = {
  claimCode: string;
  password: string;
  username: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_LoginInput = {
  password: string;
  username: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Passkey = {
  createdAt: string;
  hostname: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_AccountSecurity = {
  hostname: string;
  passkeys: Web_Api_Passkey[];
  passkeysAvailable: boolean;
  recoveryCodesRemaining: number;
  role?: Web_Api_Role | undefined;
  totpEnabled: boolean;
  username: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_TotpSetup = {
  expiresAt: string;
  qrCode: string;
  secret: string;
  uri: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_RecoveryCodes = {
  recoveryCodes: string[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_PasskeyCeremony = {
  ceremonyId: string;
  options: Record<string, unknown>;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Token = {
  createdAt: string;
  expiresAt: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: Web_Api_Scope[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_CreatedToken = {
  plaintext: string;
  token: Web_Api_Token;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_CreateTokenInput = {
  expiresAt?: string | undefined;
  name: string;
  scopes: Web_Api_Scope[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_UpdateTokenInput = {
  expiresAt?: string | null | undefined;
  name: string;
  scopes: Web_Api_Scope[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Server = {
  available: boolean;
  enabledFeatures: number;
  iconUrl: string | null;
  id: string;
  name: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Channel = {
  available: boolean;
  id: string;
  name: string;
  type: number | string | null;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_DiscordRole = {
  available: boolean;
  id: string;
  name: string;
  position: number | null;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Resources = {
  channels: Web_Api_Channel[];
  roles: Web_Api_DiscordRole[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_FeatureCategory = 'automation' | 'community' | 'integrations' | 'moderation' | 'safety' | 'web';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_FeatureSummary = {
  category: Web_Api_FeatureCategory;
  configured: boolean;
  description: string;
  enabled: boolean;
  key: string;
  name: string;
  revision: number;
  updatedAt: string | null;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_FeatureDetail = Web_Api_FeatureSummary & {
  configuration: unknown;
  editor: Web_Schema_Node;
  example: unknown;
  secrets: Record<string, boolean>;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_FeatureSaveInput = {
  configuration: unknown;
  expectedRevision: number;
  secrets?: Record<string, string> | undefined;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_BotAction = 'restart' | 'start' | 'stop';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_ServiceComponent = 'bot' | 'web' | 'worker';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Service = {
  component: Web_Api_ServiceComponent;
  status: string | null;
  updatedAt: string | null;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Bot = {
  activeFeatures: string[];
  addServerUrl: string | null;
  applicationId: string | null;
  configurationErrors: string[];
  desiredState: 'running' | 'stopped';
  guildCount: number | null;
  resolution: string | null;
  services: Web_Api_Service[];
  status: string;
  tokenConfigured: boolean;
  userTag: string | null;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_LogLevel = 'debug' | 'error' | 'info' | 'warn';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_LogEntry = {
  component: Web_Api_ServiceComponent;
  context: Record<string, unknown>;
  event: string;
  id: string;
  level: Web_Api_LogLevel;
  occurredAt: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_LogPage = {
  cursor: string | null;
  items: Web_Api_LogEntry[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_LogQuery = {
  after?: string | undefined;
  component: Web_Api_ServiceComponent;
  level?: Web_Api_LogLevel | undefined;
  q?: string | undefined;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_Diagnostics = {
  debugLogging: boolean;
};

/**
 * API.
 *
 * @since 4.0.0
 */
/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_User = {
  allServers: boolean;
  createdAt: string;
  editable: boolean;
  enabled: boolean;
  id: string;
  lastSignInAt: string | null;
  passkeys: number;
  role: Web_Api_Role;
  serverIds: string[];
  twoFactor: boolean;
  username: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_CreateUserInput = {
  allServers: boolean;
  password: string;
  role: Exclude<Web_Api_Role, 'owner'>;
  serverIds: string[];
  username: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_UpdateUserInput = {
  allServers: boolean;
  enabled: boolean;
  role: Exclude<Web_Api_Role, 'owner'>;
  serverIds: string[];
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_InviteLogo = 'custom' | 'none' | 'server';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_InviteTheme = 'dark' | 'light' | 'system';

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_InvitePage = {
  accentColor: string;
  bannerImageId: string | null;
  bannerImageUrl: string | null;
  buttonLabel: string;
  description: string;
  footerText: string;
  logo: Web_Api_InviteLogo;
  logoImageId: string | null;
  logoImageUrl: string | null;
  revision: number;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: Web_Api_InviteTheme;
  title: string;
  updatedAt: string | null;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_InvitePageResponse = {
  enabled: boolean;
  page: Web_Api_InvitePage;
  publicUrl: string | null;
  server: {
    iconUrl: string | null;
    name: string;
  };
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_InvitePageInput = {
  accentColor: string;
  bannerImageId: string | null;
  buttonLabel: string;
  description: string;
  expectedRevision: number;
  footerText: string;
  logo: Web_Api_InviteLogo;
  logoImageId: string | null;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: Web_Api_InviteTheme;
  title: string;
};

/**
 * API.
 *
 * @since 4.0.0
 */
export type Web_Api_UploadedImage = {
  id: string;
  url: string;
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_AccountSecuritySchema = Web_Api_Schema<Web_Api_AccountSecurity>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_AddPasskey_Name = string;
export type Web_Api_AddPasskey_Password = string;
export type Web_Api_AddPasskey_Returns = Promise<Web_Api_Passkey>;
export type Web_Api_AddPasskey_Credential = Record<string, unknown>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ApiError_Code = string;
export type Web_Api_ApiError_Status = number;
export type Web_Api_ApiError_Issues = Web_Api_ErrorIssue[];

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ApiError_Constructor_Message = string;
export type Web_Api_ApiError_Constructor_Code = string;
export type Web_Api_ApiError_Constructor_Status = number;
export type Web_Api_ApiError_Constructor_Issues = Web_Api_ErrorIssue[];

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ApplyBackupImport_Grant = string;
export type Web_Api_ApplyBackupImport_Returns = Promise<Web_Backup_ImportResult>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_AuthenticationResponseSchema = Web_Api_Schema<Web_Api_AuthenticationResponse>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_BackupGrantSchema = Web_Api_Schema<Web_Backup_Grant>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_BackupImportPreviewSchema = Web_Api_Schema<Web_Backup_ImportPreview>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_BackupImportResultSchema = Web_Api_Schema<Web_Backup_ImportResult>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_BotSchema = Web_Api_Schema<Web_Api_Bot>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_BuildRequest_Returns = RequestInit;
export type Web_Api_BuildRequest_Method = string;
export type Web_Api_BuildRequest_Body = BodyInit | undefined;
export type Web_Api_BuildRequest_CsrfToken = string | undefined;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ChangePassword_CurrentPassword = string;
export type Web_Api_ChangePassword_NewPassword = string;
export type Web_Api_ChangePassword_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ChangeUsername_Username = string;
export type Web_Api_ChangeUsername_Password = string;
export type Web_Api_ChangeUsername_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ClaimInstallation_Returns = Promise<Web_Api_AuthenticationResponse>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ConfirmBackupOperation_Password = string;
export type Web_Api_ConfirmBackupOperation_Code = string;
export type Web_Api_ConfirmBackupOperation_Returns = Promise<string>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ConfirmBackupOperationWithPasskey_Returns = Promise<string>;
export type Web_Api_ConfirmBackupOperationWithPasskey_Credential = Record<string, unknown>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_CreatedTokenSchema = Web_Api_Schema<Web_Api_CreatedToken>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_CreateNotification_Returns = Promise<Web_Notifications_Target>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_CreateToken_Returns = Promise<Web_Api_CreatedToken>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_CreateUser_Returns = Promise<Web_Api_User>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_DeleteUser_UserId = string;
export type Web_Api_DeleteUser_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_DiagnosticsSchema = Web_Api_Schema<Web_Api_Diagnostics>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_DisableTotp_Password = string;
export type Web_Api_DisableTotp_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_DismissRemovedSecrets_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_DownloadBackupExport_Grant = string;
export type Web_Api_DownloadBackupExport_Returns = Promise<void>;
export type Web_Api_DownloadBackupExport_ContentDisposition = string;
export type Web_Api_DownloadBackupExport_FilenameMatch = RegExpMatchArray | null;
export type Web_Api_DownloadBackupExport_MatchedFilename = string | undefined;
export type Web_Api_DownloadBackupExport_Filename = string;
export type Web_Api_DownloadBackupExport_ObjectUrl = string;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_EditorSchema = Web_Api_Schema<Web_Schema_Node>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_EnableTotp_Code = string;
export type Web_Api_EnableTotp_Returns = Promise<Web_Api_RecoveryCodes>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ErrorEnvelopeSchema = Web_Api_Schema<Web_Api_ErrorEnvelope>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ErrorMessage_CaughtError = unknown;
export type Web_Api_ErrorMessage_Fallback = string;
export type Web_Api_ErrorMessage_Returns = string;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_FeatureDetailSchema = Web_Api_Schema<Web_Api_FeatureDetail>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_FeatureSummarySchema = Web_Api_Schema<Web_Api_FeatureSummary>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetAccountSecurity_Returns = Promise<Web_Api_AccountSecurity>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetBot_Returns = Promise<Web_Api_Bot>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetCurrentPrincipal_Returns = Promise<Web_Api_Principal | null>;
export type Web_Api_GetCurrentPrincipal_ResponseValue = unknown;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetDiagnostics_Returns = Promise<Web_Api_Diagnostics>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetFeature_ServerId = string;
export type Web_Api_GetFeature_FeatureKey = string;
export type Web_Api_GetFeature_Returns = Promise<Web_Api_FeatureDetail>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetFeatures_ServerId = string;
export type Web_Api_GetFeatures_Returns = Promise<Web_Api_FeatureSummary[]>;
export type Web_Api_GetFeatures_Response = {
  items: Web_Api_FeatureSummary[];
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetInvitePage_ServerId = string;
export type Web_Api_GetInvitePage_Returns = Promise<Web_Api_InvitePageResponse>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetLogs_Returns = Promise<Web_Api_LogPage>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetNotificationEvents_Returns = Promise<Web_Notifications_Event[]>;
export type Web_Api_GetNotificationEvents_Response = {
  items: Web_Notifications_Event[];
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetNotifications_Returns = Promise<Web_Notifications_Target[]>;
export type Web_Api_GetNotifications_Response = {
  items: Web_Notifications_Target[];
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetResources_ServerId = string;
export type Web_Api_GetResources_Returns = Promise<Web_Api_Resources>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetServers_Returns = Promise<Web_Api_Server[]>;
export type Web_Api_GetServers_Response = {
  items: Web_Api_Server[];
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetSetupStatus_Returns = Promise<Web_Api_SetupStatus>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetTokens_Returns = Promise<Web_Api_Token[]>;
export type Web_Api_GetTokens_Response = {
  items: Web_Api_Token[];
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_GetUsers_Returns = Promise<Web_Api_User[]>;
export type Web_Api_GetUsers_Response = {
  items: Web_Api_User[];
};

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_InvitePageResponseSchema = Web_Api_Schema<Web_Api_InvitePageResponse>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_InvitePageSchema = Web_Api_Schema<Web_Api_InvitePage>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_IssueFor_CaughtError = unknown;
export type Web_Api_IssueFor_Field = string;
export type Web_Api_IssueFor_Returns = string;
export type Web_Api_IssueFor_Issue = Web_Api_ErrorIssue | undefined;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_LogEntrySchema = Web_Api_Schema<Web_Api_LogEntry>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_Login_Returns = Promise<Web_Api_LoginResult>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_LoginResultSchema = Web_Api_Schema<Web_Api_LoginResult>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_Logout_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_LogPageSchema = Web_Api_Schema<Web_Api_LogPage>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_LogQuery_Returns = string;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_LogStreamPath_Returns = string;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_NotificationTargetSchema = Web_Api_Schema<Web_Notifications_Target>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_NotificationTestSchema = Web_Api_Schema<Web_Notifications_TestResult>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ParseLogEntry_Value = unknown;
export type Web_Api_ParseLogEntry_Returns = Web_Api_LogEntry | null;
export type Web_Api_ParseLogEntry_Parsed = ZodSafeParseResult<Web_Api_LogEntry>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_PasskeyCeremonySchema = Web_Api_Schema<Web_Api_PasskeyCeremony>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_PasskeySchema = Web_Api_Schema<Web_Api_Passkey>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_PreviewBackupImport_Returns = Promise<Web_Backup_ImportPreview>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_PrincipalSchema = Web_Api_Schema<Web_Api_Principal>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ReadCookie_Name = string;
export type Web_Api_ReadCookie_Returns = string | undefined;
export type Web_Api_ReadCookie_Prefix = string;
export type Web_Api_ReadCookie_Parts = string[];
export type Web_Api_ReadCookie_MatchingPart = string | undefined;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RecoveryCodesSchema = Web_Api_Schema<Web_Api_RecoveryCodes>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RegenerateRecoveryCodes_Password = string;
export type Web_Api_RegenerateRecoveryCodes_Returns = Promise<Web_Api_RecoveryCodes>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RemovedSecretSchema = Web_Api_Schema<Web_Api_RemovedSecret>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RemoveNotification_NotificationId = string;
export type Web_Api_RemoveNotification_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RemovePasskey_PasskeyId = string;
export type Web_Api_RemovePasskey_Password = string;
export type Web_Api_RemovePasskey_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RequestBotAction_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RequestJson_Path = string;
export type Web_Api_RequestJson_ResponseValue = unknown;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RequestVoid_Path = string;
export type Web_Api_RequestVoid_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ResetUserPassword_UserId = string;
export type Web_Api_ResetUserPassword_Password = string;
export type Web_Api_ResetUserPassword_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ResetUserTwoFactor_UserId = string;
export type Web_Api_ResetUserTwoFactor_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ResourcesSchema = Web_Api_Schema<Web_Api_Resources>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ResponseError_Returns = Promise<Web_Api_ResponseError_ApiError>;
export type Web_Api_ResponseError_ApiError = Error & {
  readonly code: string;
  readonly issues: Web_Api_ErrorIssue[];
  readonly status: number;
};
export type Web_Api_ResponseError_ResponseValue = unknown;
export type Web_Api_ResponseError_ParsedError = ZodSafeParseResult<Web_Api_ErrorEnvelope>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_RevokeToken_TokenId = string;
export type Web_Api_RevokeToken_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SaveBotToken_Token = string;
export type Web_Api_SaveBotToken_Returns = Promise<void>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SaveFeature_ServerId = string;
export type Web_Api_SaveFeature_FeatureKey = string;
export type Web_Api_SaveFeature_Returns = Promise<Web_Api_FeatureDetail>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SaveInvitePage_ServerId = string;
export type Web_Api_SaveInvitePage_Returns = Promise<Web_Api_InvitePage>;
export type Web_Api_SaveInvitePage_Response = unknown;
export type Web_Api_SaveInvitePage_Wrapped = ZodSafeParseResult<Web_Api_InvitePageResponse>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ServerPath_ServerId = string;
export type Web_Api_ServerPath_Suffix = string;
export type Web_Api_ServerPath_Returns = string;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_ServerSchema = Web_Api_Schema<Web_Api_Server>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SetFeatureEnabled_ServerId = string;
export type Web_Api_SetFeatureEnabled_FeatureKey = string;
export type Web_Api_SetFeatureEnabled_Enabled = boolean;
export type Web_Api_SetFeatureEnabled_Returns = Promise<Web_Api_FeatureSummary>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SetupStatusSchema = Web_Api_Schema<Web_Api_SetupStatus>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SignInWithPasskey_Returns = Promise<Web_Api_AuthenticationResponse>;
export type Web_Api_SignInWithPasskey_Credential = Record<string, unknown>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_StartTotpSetup_Password = string;
export type Web_Api_StartTotpSetup_Returns = Promise<Web_Api_TotpSetup>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SubmitSecondFactor_Challenge = string;
export type Web_Api_SubmitSecondFactor_Code = string;
export type Web_Api_SubmitSecondFactor_Returns = Promise<Web_Api_AuthenticationResponse>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_SummaryFor_CaughtError = unknown;
export type Web_Api_SummaryFor_ShownFields = string[];
export type Web_Api_SummaryFor_Fallback = string;
export type Web_Api_SummaryFor_Returns = string;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_TestNotification_NotificationId = string;
export type Web_Api_TestNotification_Returns = Promise<Web_Notifications_TestResult>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_TokenSchema = Web_Api_Schema<Web_Api_Token>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_TotpSetupSchema = Web_Api_Schema<Web_Api_TotpSetup>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UpdateDiagnostics_Returns = Promise<Web_Api_Diagnostics>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UpdateNotification_NotificationId = string;
export type Web_Api_UpdateNotification_Returns = Promise<Web_Notifications_Target>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UpdateToken_TokenId = string;
export type Web_Api_UpdateToken_Returns = Promise<Web_Api_Token>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UpdateUser_UserId = string;
export type Web_Api_UpdateUser_Returns = Promise<Web_Api_User>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UploadedImageSchema = Web_Api_Schema<Web_Api_UploadedImage>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UploadInviteImage_ServerId = string;
export type Web_Api_UploadInviteImage_Returns = Promise<Web_Api_UploadedImage>;

/**
 * API.
 *
 * @since 4.2.1
 */
export type Web_Api_UserSchema = Web_Api_Schema<Web_Api_User>;
