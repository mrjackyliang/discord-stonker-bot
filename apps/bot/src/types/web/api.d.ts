import type { ZodType } from 'zod';

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
 * @since UNRELEASED
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
