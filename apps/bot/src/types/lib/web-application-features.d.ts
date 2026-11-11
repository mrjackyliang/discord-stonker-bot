import type { REST } from 'discord.js';
import type { Pool } from 'pg';
import type { z } from 'zod';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';
import type { Tests_Support_Database_TestDatabase } from '../tests/support/database.d.ts';

export type Lib_WebApplicationFeatures_SecretResolver = (key: string) => string | undefined;
export type Lib_WebApplicationFeatures_SecretReference = {
  $secret: string;
};
export type Lib_WebApplicationFeatures_InviteConfiguration = {
  maxAgeSeconds: number;
  maxUses: number;
  path: string;
  recaptchaSecret: string;
  recaptchaSiteKey: string;
};
export type Lib_WebApplicationFeatures_WebhookVariableType = 'boolean' | 'string' | 'ts-millis' | 'ts-seconds' | 'usd-cents' | 'usd-dollars';
export type Lib_WebApplicationFeatures_WebhookVariable = {
  identifier: string;
  path: string;
  type: Lib_WebApplicationFeatures_WebhookVariableType;
};
export type Lib_WebApplicationFeatures_WebhookRoute = {
  channelIdentifier: string;
  name: string;
  path: string;
  signingSecret: string;
  template: string;
  variables: Lib_WebApplicationFeatures_WebhookVariable[];
};
export type Lib_WebApplicationFeatures_Runtime = {
  invite?: Lib_WebApplicationFeatures_InviteConfiguration | undefined;
  webhookRoutes: Map<string, Lib_WebApplicationFeatures_WebhookRoute>;
};
export type Lib_WebApplicationFeatures_Prepared = {
  activeFeatureKeys: Shared_FeatureKey[];
  configurationErrors: string[];
  runtime?: Lib_WebApplicationFeatures_Runtime | undefined;
};
export type Lib_WebApplicationFeatures_GuildMetadata = {
  memberCount: number | undefined;
  name: string;
  premiumTier: number;
  rulesChannelIdentifier: string | undefined;
};
export type Lib_WebApplicationFeatures_ParsedInviteConfiguration = {
  options: {
    'max-age': number;
    'max-uses': number;
    'path': string;
  };
  recaptcha: {
    'secret-key': Lib_WebApplicationFeatures_SecretReference;
    'site-key': string;
  };
};
export type Lib_WebApplicationFeatures_ParsedWebhookRoute = {
  'channel': {
    'channel-id': string;
  };
  'name': string;
  'path': string;
  'payload': {
    content: string;
    footer?: {
      text: string;
    } | undefined;
  };
  'signing-secret': Lib_WebApplicationFeatures_SecretReference;
  'variables': Array<{
    id: string;
    path: string;
    type: Lib_WebApplicationFeatures_WebhookVariableType;
  }>;
};
export type Lib_WebApplicationFeatures_ParsedConfiguration = {
  'http-server'?: unknown;
  'https-server'?: unknown;
  'invite-generator'?: Lib_WebApplicationFeatures_ParsedInviteConfiguration | undefined;
  'map-webhooks'?: Lib_WebApplicationFeatures_ParsedWebhookRoute[] | undefined;
};
export type Lib_WebApplicationFeatures_CaptchaResponse = {
  'error-codes'?: string[] | undefined;
  'hostname'?: string | undefined;
  'success': boolean;
};
export type Lib_WebApplicationFeatures_DiscordGuildResponse = {
  approximate_member_count?: number | undefined;
  member_count?: number | undefined;
  name: string;
  premium_tier: number;
  rules_channel_id: string | null;
};
export type Lib_WebApplicationFeatures_DiscordInviteResponse = {
  code: string;
};

export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Configuration = unknown;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Secrets = Lib_WebApplicationFeatures_SecretResolver;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Returns = Lib_WebApplicationFeatures_Runtime;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Parsed = Lib_WebApplicationFeatures_ParsedConfiguration;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_InviteConfiguration = Lib_WebApplicationFeatures_ParsedInviteConfiguration | undefined;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_InviteSecret = string | undefined;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Invite = Lib_WebApplicationFeatures_InviteConfiguration | undefined;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_PathSet = Set<string>;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_RouteIndex = number;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Route = Lib_WebApplicationFeatures_ParsedWebhookRoute;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_RouteSecret = string | undefined;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Routes = Map<string, Lib_WebApplicationFeatures_WebhookRoute>;
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_TemplateParts = string[];
export type Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Variables = Lib_WebApplicationFeatures_WebhookVariable[];

export type Lib_WebApplicationFeatures_CreateDiscordInvite_Rest = REST;
export type Lib_WebApplicationFeatures_CreateDiscordInvite_ChannelIdentifier = string;
export type Lib_WebApplicationFeatures_CreateDiscordInvite_Configuration = Lib_WebApplicationFeatures_InviteConfiguration;
export type Lib_WebApplicationFeatures_CreateDiscordInvite_Returns = Promise<string>;
export type Lib_WebApplicationFeatures_CreateDiscordInvite_Response = unknown;
export type Lib_WebApplicationFeatures_CreateDiscordInvite_Parsed = Lib_WebApplicationFeatures_DiscordInviteResponse;

export type Lib_WebApplicationFeatures_CreateWebhookSignature_Body = string;
export type Lib_WebApplicationFeatures_CreateWebhookSignature_Timestamp = string;
export type Lib_WebApplicationFeatures_CreateWebhookSignature_Secret = string;
export type Lib_WebApplicationFeatures_CreateWebhookSignature_Returns = string;

export type Lib_WebApplicationFeatures_EscapeDiscordText_Value = string;
export type Lib_WebApplicationFeatures_EscapeDiscordText_Returns = string;
export type Lib_WebApplicationFeatures_EscapeDiscordText_Pattern = RegExp;

export type Lib_WebApplicationFeatures_FetchGuildMetadata_Rest = REST;
export type Lib_WebApplicationFeatures_FetchGuildMetadata_GuildIdentifier = string;
export type Lib_WebApplicationFeatures_FetchGuildMetadata_Returns = Promise<Lib_WebApplicationFeatures_GuildMetadata>;
export type Lib_WebApplicationFeatures_FetchGuildMetadata_Response = unknown;
export type Lib_WebApplicationFeatures_FetchGuildMetadata_Parsed = Lib_WebApplicationFeatures_DiscordGuildResponse;
export type Lib_WebApplicationFeatures_FetchGuildMetadata_ReportedMemberCount = number | undefined;

export type Lib_WebApplicationFeatures_FormatConfigurationError_Error = unknown;
export type Lib_WebApplicationFeatures_FormatConfigurationError_Returns = string;
export type Lib_WebApplicationFeatures_FormatConfigurationError_Messages = string[];

export type Lib_WebApplicationFeatures_FormatWebhookVariable_Type = Lib_WebApplicationFeatures_WebhookVariableType;
export type Lib_WebApplicationFeatures_FormatWebhookVariable_Value = unknown;
export type Lib_WebApplicationFeatures_FormatWebhookVariable_Returns = string;
export type Lib_WebApplicationFeatures_FormatWebhookVariable_NumberValue = number;
export type Lib_WebApplicationFeatures_FormatWebhookVariable_TimestampSeconds = number;

export type Lib_WebApplicationFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_WebApplicationFeatures_GetEnabledFeature_Returns = Lib_WebApplicationFeatures_GetEnabledFeature_Feature | undefined;
export type Lib_WebApplicationFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_WebApplicationFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_WebApplicationFeatures_GetEnabledFeature_Feature = {
  configuration: unknown;
};

export type Lib_WebApplicationFeatures_GetValueAtPath_Value = unknown;
export type Lib_WebApplicationFeatures_GetValueAtPath_Path = string;
export type Lib_WebApplicationFeatures_GetValueAtPath_Returns = unknown;
export type Lib_WebApplicationFeatures_GetValueAtPath_Current = unknown;
export type Lib_WebApplicationFeatures_GetValueAtPath_Segments = string[];

export type Lib_WebApplicationFeatures_IsRecord_Value = unknown;
export type Lib_WebApplicationFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Settings = Shared_JsonObject;
export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Secrets = Lib_WebApplicationFeatures_SecretResolver;
export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns = Lib_WebApplicationFeatures_Prepared;
export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Feature = Lib_WebApplicationFeatures_GetEnabledFeature_Returns;
export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_ConfigurationErrors = string[];
export type Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Runtime = Lib_WebApplicationFeatures_Runtime | undefined;

export type Lib_WebApplicationFeatures_RenderWebhookContent_Route = Lib_WebApplicationFeatures_WebhookRoute;
export type Lib_WebApplicationFeatures_RenderWebhookContent_Body = unknown;
export type Lib_WebApplicationFeatures_RenderWebhookContent_Returns = string;
export type Lib_WebApplicationFeatures_RenderWebhookContent_Content = string;
export type Lib_WebApplicationFeatures_RenderWebhookContent_RawValue = unknown;
export type Lib_WebApplicationFeatures_RenderWebhookContent_FormattedValue = string;

export type Lib_WebApplicationFeatures_VerifyRecaptcha_Token = string;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_Secret = string;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_ExpectedHostname = string;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_RemoteAddress = string;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_Returns = Promise<boolean>;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_Parsed = z.ZodSafeParseResult<Lib_WebApplicationFeatures_CaptchaResponse>;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_SolvedHostname = string | undefined;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_Form = URLSearchParams;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_Response = Response;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_ResponseText = string;
export type Lib_WebApplicationFeatures_VerifyRecaptcha_ParsedJson = unknown;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_Body = string;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_Timestamp = string;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_Signature = string;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_Secret = string;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_CurrentTime = number;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_Returns = boolean;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_TimestampSeconds = number;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_NormalizedSignature = string;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_ExpectedSignature = string;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_ProvidedBuffer = Buffer;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_ExpectedBuffer = Buffer;
export type Lib_WebApplicationFeatures_VerifyWebhookSignature_Pattern = RegExp;

export type Lib_WebApplicationFeatures_PublicRoute_Kind = 'invite' | 'webhook';
export type Lib_WebApplicationFeatures_PublicRoute = {
  guildIdentifier: string;
  kind: Lib_WebApplicationFeatures_PublicRoute_Kind;
};
export type Lib_WebApplicationFeatures_RouteCacheEntry = {
  expiresAt: number;
  routes: Map<string, Lib_WebApplicationFeatures_PublicRoute>;
};
export type Lib_WebApplicationFeatures_RouteCache = WeakMap<Pool, Lib_WebApplicationFeatures_RouteCacheEntry>;

export type Lib_WebApplicationFeatures_CompileGuildWebApplication_Pool = Pool;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_CredentialKey = Buffer;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_GuildIdentifier = string;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_Returns = Promise<Lib_WebApplicationFeatures_Runtime | undefined>;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_Settings = Shared_JsonObject | undefined;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_SecretRows = Array<{
  ciphertext: string;
  key: string;
}>;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_SecretMap = Map<string, string>;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_Prepared = Lib_WebApplicationFeatures_Prepared;
export type Lib_WebApplicationFeatures_CompileGuildWebApplication_Ciphertext = string | undefined;

export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Pool = Pool;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Path = string;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Returns = Promise<Lib_WebApplicationFeatures_PublicRoute | undefined>;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Cached = Lib_WebApplicationFeatures_RouteCacheEntry | undefined;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Now = number;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Routes = Map<string, Lib_WebApplicationFeatures_PublicRoute>;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_SettingsEntries = Array<{
  guildIdentifier: string;
  settings: Shared_JsonObject;
}>;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_Feature = Lib_WebApplicationFeatures_GetEnabledFeature_Returns;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_InvitePath = unknown;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_WebhookRoutes = unknown;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_WebhookPath = unknown;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_ConflictingPaths = Set<string>;
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteKind = 'invite' | 'webhook';
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntry = [unknown, Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteKind];
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntries = Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntry[];
export type Lib_WebApplicationFeatures_FindWebApplicationRoute_RoutePath = unknown;

export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Pool = Pool;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_GuildIdentifier = string;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Settings = Shared_JsonObject;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Returns = Promise<string[]>;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Feature = Lib_WebApplicationFeatures_GetEnabledFeature_Returns;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_CandidatePaths = Set<string>;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Conflicts = Set<string>;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_SettingsEntries = Lib_WebApplicationFeatures_FindWebApplicationRoute_SettingsEntries;
export type Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_ExistingFeature = Lib_WebApplicationFeatures_GetEnabledFeature_Returns;

export type Lib_WebApplicationFeatures_GetPublicPaths_Configuration = unknown;
export type Lib_WebApplicationFeatures_GetPublicPaths_Returns = string[];
export type Lib_WebApplicationFeatures_GetPublicPaths_Paths = Set<string>;
export type Lib_WebApplicationFeatures_GetPublicPaths_InvitePath = unknown;
export type Lib_WebApplicationFeatures_GetPublicPaths_WebhookRoutes = unknown;
export type Lib_WebApplicationFeatures_GetPublicPaths_WebhookPath = unknown;

export type Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Pool = Pool;
export type Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Returns = void;

export type Lib_WebApplicationFeatures_InviteSettings = {
  enabled: boolean;
  path: string | null;
};

export type Lib_WebApplicationFeatures_ReadInviteSettings_Pool = Pool;
export type Lib_WebApplicationFeatures_ReadInviteSettings_GuildIdentifier = string;
export type Lib_WebApplicationFeatures_ReadInviteSettings_Returns = Promise<Lib_WebApplicationFeatures_InviteSettings>;
export type Lib_WebApplicationFeatures_ReadInviteSettings_Settings = Shared_JsonObject | undefined;
export type Lib_WebApplicationFeatures_ReadInviteSettings_Features = unknown;
export type Lib_WebApplicationFeatures_ReadInviteSettings_RawFeature = unknown;
export type Lib_WebApplicationFeatures_ReadInviteSettings_Path = unknown;

export type Lib_WebApplicationFeatures_Test_Database = Tests_Support_Database_TestDatabase;
export type Lib_WebApplicationFeatures_Test_Configuration = Shared_JsonObject;
export type Lib_WebApplicationFeatures_Test_Pool = Pool;
export type Lib_WebApplicationFeatures_Test_Settings = Shared_JsonObject;
