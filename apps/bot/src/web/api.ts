import { z } from 'zod';

import {
  createPasskey,
  getPasskey,
} from '@/web/passkeys.ts';
import { contentDispositionFilenamePattern } from '@/web/regex.js';

import type {
  Web_Api_AccountSecuritySchema,
  Web_Api_AddPasskey_Credential,
  Web_Api_AddPasskey_Name,
  Web_Api_AddPasskey_Password,
  Web_Api_AddPasskey_Returns,
  Web_Api_ApiError_Code,
  Web_Api_ApiError_Constructor_Code,
  Web_Api_ApiError_Constructor_Issues,
  Web_Api_ApiError_Constructor_Message,
  Web_Api_ApiError_Constructor_Status,
  Web_Api_ApiError_Issues,
  Web_Api_ApiError_Status,
  Web_Api_ApplyBackupImport_Grant,
  Web_Api_ApplyBackupImport_Returns,
  Web_Api_AuthenticationResponseSchema,
  Web_Api_BackupGrantSchema,
  Web_Api_BackupImportPreviewSchema,
  Web_Api_BackupImportResultSchema,
  Web_Api_BotAction,
  Web_Api_BotSchema,
  Web_Api_BuildRequest_Body,
  Web_Api_BuildRequest_CsrfToken,
  Web_Api_BuildRequest_Method,
  Web_Api_BuildRequest_Returns,
  Web_Api_ChangePassword_CurrentPassword,
  Web_Api_ChangePassword_NewPassword,
  Web_Api_ChangePassword_Returns,
  Web_Api_ChangeUsername_Password,
  Web_Api_ChangeUsername_Returns,
  Web_Api_ChangeUsername_Username,
  Web_Api_ClaimInput,
  Web_Api_ClaimInstallation_Returns,
  Web_Api_ConfirmBackupOperation_Code,
  Web_Api_ConfirmBackupOperation_Password,
  Web_Api_ConfirmBackupOperation_Returns,
  Web_Api_ConfirmBackupOperationWithPasskey_Credential,
  Web_Api_ConfirmBackupOperationWithPasskey_Returns,
  Web_Api_CreatedTokenSchema,
  Web_Api_CreateNotification_Returns,
  Web_Api_CreateToken_Returns,
  Web_Api_CreateTokenInput,
  Web_Api_CreateUser_Returns,
  Web_Api_CreateUserInput,
  Web_Api_DeleteUser_Returns,
  Web_Api_DeleteUser_UserId,
  Web_Api_Diagnostics,
  Web_Api_DiagnosticsSchema,
  Web_Api_DisableTotp_Password,
  Web_Api_DisableTotp_Returns,
  Web_Api_DismissRemovedSecrets_Returns,
  Web_Api_DownloadBackupExport_ContentDisposition,
  Web_Api_DownloadBackupExport_Filename,
  Web_Api_DownloadBackupExport_FilenameMatch,
  Web_Api_DownloadBackupExport_Grant,
  Web_Api_DownloadBackupExport_MatchedFilename,
  Web_Api_DownloadBackupExport_ObjectUrl,
  Web_Api_DownloadBackupExport_Returns,
  Web_Api_EditorSchema,
  Web_Api_EnableTotp_Code,
  Web_Api_EnableTotp_Returns,
  Web_Api_ErrorEnvelopeSchema,
  Web_Api_ErrorMessage_CaughtError,
  Web_Api_ErrorMessage_Fallback,
  Web_Api_ErrorMessage_Returns,
  Web_Api_FeatureDetailSchema,
  Web_Api_FeatureSaveInput,
  Web_Api_FeatureSummarySchema,
  Web_Api_GetAccountSecurity_Returns,
  Web_Api_GetBot_Returns,
  Web_Api_GetCurrentPrincipal_ResponseValue,
  Web_Api_GetCurrentPrincipal_Returns,
  Web_Api_GetDiagnostics_Returns,
  Web_Api_GetFeature_FeatureKey,
  Web_Api_GetFeature_Returns,
  Web_Api_GetFeature_ServerId,
  Web_Api_GetFeatures_Response,
  Web_Api_GetFeatures_Returns,
  Web_Api_GetFeatures_ServerId,
  Web_Api_GetInvitePage_Returns,
  Web_Api_GetInvitePage_ServerId,
  Web_Api_GetLogs_Returns,
  Web_Api_GetNotificationEvents_Response,
  Web_Api_GetNotificationEvents_Returns,
  Web_Api_GetNotifications_Response,
  Web_Api_GetNotifications_Returns,
  Web_Api_GetResources_Returns,
  Web_Api_GetResources_ServerId,
  Web_Api_GetServers_Response,
  Web_Api_GetServers_Returns,
  Web_Api_GetSetupStatus_Returns,
  Web_Api_GetTokens_Response,
  Web_Api_GetTokens_Returns,
  Web_Api_GetUsers_Response,
  Web_Api_GetUsers_Returns,
  Web_Api_InvitePageInput,
  Web_Api_InvitePageResponseSchema,
  Web_Api_InvitePageSchema,
  Web_Api_IssueFor_CaughtError,
  Web_Api_IssueFor_Field,
  Web_Api_IssueFor_Issue,
  Web_Api_IssueFor_Returns,
  Web_Api_LogEntrySchema,
  Web_Api_Login_Returns,
  Web_Api_LoginInput,
  Web_Api_LoginResultSchema,
  Web_Api_Logout_Returns,
  Web_Api_LogPageSchema,
  Web_Api_LogQuery,
  Web_Api_LogQuery_Returns,
  Web_Api_LogStreamPath_Returns,
  Web_Api_NotificationTargetSchema,
  Web_Api_NotificationTestSchema,
  Web_Api_ParseLogEntry_Parsed,
  Web_Api_ParseLogEntry_Returns,
  Web_Api_ParseLogEntry_Value,
  Web_Api_PasskeyCeremony,
  Web_Api_PasskeyCeremonySchema,
  Web_Api_PasskeySchema,
  Web_Api_Permission,
  Web_Api_PreviewBackupImport_Returns,
  Web_Api_PrincipalSchema,
  Web_Api_ReadCookie_MatchingPart,
  Web_Api_ReadCookie_Name,
  Web_Api_ReadCookie_Parts,
  Web_Api_ReadCookie_Prefix,
  Web_Api_ReadCookie_Returns,
  Web_Api_RecoveryCodesSchema,
  Web_Api_RegenerateRecoveryCodes_Password,
  Web_Api_RegenerateRecoveryCodes_Returns,
  Web_Api_RemovedSecretSchema,
  Web_Api_RemoveNotification_NotificationId,
  Web_Api_RemoveNotification_Returns,
  Web_Api_RemovePasskey_PasskeyId,
  Web_Api_RemovePasskey_Password,
  Web_Api_RemovePasskey_Returns,
  Web_Api_Request_Options,
  Web_Api_RequestBotAction_Returns,
  Web_Api_RequestJson_Path,
  Web_Api_RequestJson_ResponseValue,
  Web_Api_RequestVoid_Path,
  Web_Api_RequestVoid_Returns,
  Web_Api_ResetUserPassword_Password,
  Web_Api_ResetUserPassword_Returns,
  Web_Api_ResetUserPassword_UserId,
  Web_Api_ResetUserTwoFactor_Returns,
  Web_Api_ResetUserTwoFactor_UserId,
  Web_Api_ResourcesSchema,
  Web_Api_ResponseError_ParsedError,
  Web_Api_ResponseError_ResponseValue,
  Web_Api_ResponseError_Returns,
  Web_Api_RevokeToken_Returns,
  Web_Api_RevokeToken_TokenId,
  Web_Api_SaveBotToken_Returns,
  Web_Api_SaveBotToken_Token,
  Web_Api_SaveFeature_FeatureKey,
  Web_Api_SaveFeature_Returns,
  Web_Api_SaveFeature_ServerId,
  Web_Api_SaveInvitePage_Response,
  Web_Api_SaveInvitePage_Returns,
  Web_Api_SaveInvitePage_ServerId,
  Web_Api_SaveInvitePage_Wrapped,
  Web_Api_Schema,
  Web_Api_ServerPath_Returns,
  Web_Api_ServerPath_ServerId,
  Web_Api_ServerPath_Suffix,
  Web_Api_ServerSchema,
  Web_Api_SetFeatureEnabled_Enabled,
  Web_Api_SetFeatureEnabled_FeatureKey,
  Web_Api_SetFeatureEnabled_Returns,
  Web_Api_SetFeatureEnabled_ServerId,
  Web_Api_SetupStatusSchema,
  Web_Api_SignInWithPasskey_Credential,
  Web_Api_SignInWithPasskey_Returns,
  Web_Api_StartTotpSetup_Password,
  Web_Api_StartTotpSetup_Returns,
  Web_Api_SubmitSecondFactor_Challenge,
  Web_Api_SubmitSecondFactor_Code,
  Web_Api_SubmitSecondFactor_Returns,
  Web_Api_SummaryFor_CaughtError,
  Web_Api_SummaryFor_Fallback,
  Web_Api_SummaryFor_Returns,
  Web_Api_SummaryFor_ShownFields,
  Web_Api_TestNotification_NotificationId,
  Web_Api_TestNotification_Returns,
  Web_Api_TokenSchema,
  Web_Api_TotpSetupSchema,
  Web_Api_UpdateDiagnostics_Returns,
  Web_Api_UpdateNotification_NotificationId,
  Web_Api_UpdateNotification_Returns,
  Web_Api_UpdateToken_Returns,
  Web_Api_UpdateToken_TokenId,
  Web_Api_UpdateTokenInput,
  Web_Api_UpdateUser_Returns,
  Web_Api_UpdateUser_UserId,
  Web_Api_UpdateUserInput,
  Web_Api_UploadedImageSchema,
  Web_Api_UploadInviteImage_Returns,
  Web_Api_UploadInviteImage_ServerId,
  Web_Api_UserSchema,
} from '@/types/web/api.d.ts';
import type {
  Web_Backup_ExportSections,
  Web_Backup_Grant,
  Web_Backup_ImportSource,
  Web_Backup_Purpose,
} from '@/types/web/backup.d.ts';
import type {
  Web_Notifications_CreateInput,
  Web_Notifications_UpdateInput,
} from '@/types/web/notifications.d.ts';
import type { Web_Schema_Node } from '@/types/web/schema.d.ts';

/**
 * API - Error Envelope Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const errorEnvelopeSchema: Web_Api_ErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    issues: z.array(z.object({
      field: z.string(),
      message: z.string(),
      path: z.array(z.coerce.string()),
    })).optional(),
    message: z.string(),
  }),
});

/**
 * API - Setup Status Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const setupStatusSchema: Web_Api_SetupStatusSchema = z.object({
  claimExpiresAt: z.string().optional(),
  claimRequired: z.boolean(),
});

/**
 * API - Role Schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 4.0.0
 */
const roleSchema = z.enum([
  'administrator',
  'operator',
  'owner',
  'viewer',
]);

/**
 * API - Permission Schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 4.0.0
 */
const permissionSchema = z.enum([
  'bot:control',
  'configuration:write',
  'users:manage',
]);

/**
 * API - Scope Schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 4.0.0
 */
const scopeSchema = z.enum([
  'bot:control',
  'features:read',
  'features:write',
  'logs:read',
]);

/**
 * API - Removed Secret Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const removedSecretSchema: Web_Api_RemovedSecretSchema = z.object({
  featureKey: z.string().optional(),
  featureName: z.string().optional(),
  kind: z.enum([
    'authenticator',
    'bot-token',
    'feature-secrets',
    'notification',
  ]),
  name: z.string().optional(),
  notificationId: z.string().optional(),
  removedAt: z.string(),
  serverId: z.string().optional(),
  serverName: z.string().optional(),
});

/**
 * API - Notification Target Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationTargetSchema: Web_Api_NotificationTargetSchema = z.object({
  createdAt: z.string(),
  events: z.array(z.string()),
  id: z.string(),
  lastAttemptAt: z.string().nullable(),
  lastError: z.string().nullable(),
  name: z.string(),
  secrets: z.record(z.string(), z.literal(true)),
  secretsMissing: z.array(z.string()),
  service: z.enum([
    'apprise',
    'discord',
    'email',
    'gotify',
    'matrix',
    'ntfy',
    'ntfy-reverse-proxy',
    'pushover',
    'slack',
    'telegram',
    'webhook',
  ]),
  settings: z.record(z.string(), z.string()),
  updatedAt: z.string(),
});

/**
 * API - Notification Targets Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationTargetsResponseSchema = z.object({
  items: z.array(notificationTargetSchema),
});

/**
 * API - Notification Events Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationEventsResponseSchema = z.object({
  items: z.array(z.object({
    defaultEnabled: z.boolean(),
    description: z.string(),
    key: z.string(),
    label: z.string(),
  })),
});

/**
 * API - Notification Test Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationTestSchema: Web_Api_NotificationTestSchema = z.object({
  delivered: z.boolean(),
  message: z.string().optional(),
});

/**
 * API - Principal Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const principalSchema: Web_Api_PrincipalSchema = z.object({
  allServers: z.boolean().optional(),
  authenticationType: z.enum([
    'session',
    'token',
  ]),
  id: z.coerce.string(),
  name: z.string().optional(),
  permissions: z.array(z.string()).transform((values) => values.filter((value): value is Web_Api_Permission => permissionSchema.safeParse(value).success)).optional(),
  removedSecrets: z.array(removedSecretSchema).optional(),
  role: roleSchema.optional(),
  scopes: z.array(z.string()).optional(),
  serverIds: z.array(z.coerce.string()).optional(),
  username: z.string().optional(),
});

/**
 * API - Authentication Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const authenticationResponseSchema: Web_Api_AuthenticationResponseSchema = z.object({
  csrfToken: z.string(),
  expiresAt: z.string(),
  status: z.literal('authenticated'),
  user: z.object({
    id: z.coerce.string(),
    role: roleSchema,
    username: z.string(),
  }),
});

/**
 * API - Login Result Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const loginResultSchema: Web_Api_LoginResultSchema = z.union([
  authenticationResponseSchema,
  z.object({
    challenge: z.string(),
    expiresAt: z.string(),
    status: z.literal('second_factor_required'),
  }),
]);

/**
 * API - Passkey Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeySchema: Web_Api_PasskeySchema = z.object({
  createdAt: z.string(),
  hostname: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
});

/**
 * API - Account Security Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const accountSecuritySchema: Web_Api_AccountSecuritySchema = z.object({
  hostname: z.string(),
  passkeys: z.array(passkeySchema),
  passkeysAvailable: z.boolean(),
  recoveryCodesRemaining: z.number(),
  role: roleSchema.optional(),
  totpEnabled: z.boolean(),
  username: z.string(),
});

/**
 * API - Backup Grant Schema.
 *
 * Validates the short-lived credential returned by fresh authentication.
 * The raw value is held only long enough for one sensitive request.
 *
 * @since 4.0.0
 */
const backupGrantSchema: Web_Api_BackupGrantSchema = z.object({
  expiresAt: z.string(),
  grant: z.string(),
}).strict();

/**
 * API - Backup Import Summary Schema.
 *
 * Validates change counts shared by preview and apply answers.
 * Secret-bearing values never appear in this response shape.
 *
 * @since 4.0.0
 */
const backupImportSummarySchema = z.object({
  accessTokens: z.object({
    added: z.number().int().nonnegative(),
    skipped: z.number().int().nonnegative(),
  }).strict(),
  connection: z.enum([
    'added',
    'replaced',
    'skipped',
  ]),
  features: z.object({
    features: z.number().int().nonnegative(),
    servers: z.number().int().nonnegative(),
  }).strict(),
  notifications: z.object({
    added: z.number().int().nonnegative(),
    replaced: z.number().int().nonnegative(),
  }).strict(),
}).strict();

/**
 * API - Backup Import Preview Schema.
 *
 * Validates the comparison plan rendered by the import wizard.
 * Every fixed object boundary remains strict.
 *
 * @since 4.0.0
 */
const backupImportPreviewSchema: Web_Api_BackupImportPreviewSchema = z.object({
  appVersion: z.string().nullable(),
  excluded: z.array(z.object({
    id: z.string(),
    label: z.string(),
    reason: z.string(),
  }).strict()),
  exportedAt: z.string().nullable(),
  legacy: z.object({
    featuresRequiringFixes: z.array(z.object({
      id: z.string(),
      label: z.string(),
      reason: z.string(),
    }).strict()),
    featuresThatTurnOn: z.number().int().nonnegative(),
  }).strict().optional(),
  sections: z.array(z.object({
    file: z.string(),
    here: z.string(),
    id: z.enum([
      'connection',
      'features',
      'notifications',
      'accessTokens',
    ]),
    label: z.string(),
    reason: z.string().optional(),
    willImport: z.boolean(),
  }).strict()),
  source: z.enum([
    'export',
    'legacy',
  ]),
  summary: backupImportSummarySchema,
}).strict();

/**
 * API - Backup Import Result Schema.
 *
 * Adds the committed section list to the reviewed summary.
 * The console uses it to complete the progress presentation.
 *
 * @since 4.0.0
 */
const backupImportResultSchema: Web_Api_BackupImportResultSchema = backupImportSummarySchema.extend({
  importedSections: z.array(z.enum([
    'connection',
    'features',
    'notifications',
    'accessTokens',
  ])),
}).strict();

/**
 * API - Totp Setup Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const totpSetupSchema: Web_Api_TotpSetupSchema = z.object({
  expiresAt: z.string(),
  qrCode: z.string(),
  secret: z.string(),
  uri: z.string(),
});

/**
 * API - Recovery Codes Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const recoveryCodesSchema: Web_Api_RecoveryCodesSchema = z.object({
  recoveryCodes: z.array(z.string()),
});

/**
 * API - Passkey Ceremony Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeyCeremonySchema: Web_Api_PasskeyCeremonySchema = z.object({
  ceremonyId: z.string(),
  options: z.record(z.string(), z.unknown()),
});

/**
 * API - Token Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const tokenSchema: Web_Api_TokenSchema = z.object({
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
  scopes: z.array(scopeSchema),
});

/**
 * API - Tokens Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const tokensResponseSchema = z.object({
  items: z.array(tokenSchema),
});

/**
 * API - Created Token Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const createdTokenSchema: Web_Api_CreatedTokenSchema = z.object({
  plaintext: z.string(),
  token: tokenSchema,
});

/**
 * API - Server Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serverSchema: Web_Api_ServerSchema = z.object({
  available: z.boolean(),
  enabledFeatures: z.number(),
  iconUrl: z.string().nullable(),
  id: z.coerce.string(),
  name: z.string(),
});

/**
 * API - Servers Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serversResponseSchema = z.object({
  items: z.array(serverSchema),
});

/**
 * API - Resources Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const resourcesSchema: Web_Api_ResourcesSchema = z.object({
  channels: z.array(z.object({
    available: z.boolean().default(true),
    id: z.coerce.string(),
    name: z.string(),
    type: z.union([
      z.number(),
      z.string(),
    ]).nullable().default(null),
  })),
  roles: z.array(z.object({
    available: z.boolean().default(true),
    id: z.coerce.string(),
    name: z.string(),
    position: z.number().nullable().default(null),
  })),
});

/**
 * API - Feature Category Schema.
 *
 * Encapsulates the related behavior behind one reusable interface.
 * Callers share the same lifecycle and state management.
 *
 * @since 4.0.0
 */
const featureCategorySchema = z.enum([
  'automation',
  'community',
  'integrations',
  'moderation',
  'safety',
  'web',
]);

/**
 * API - Feature Summary Shape.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureSummaryShape = {
  category: featureCategorySchema,
  configured: z.boolean(),
  description: z.string(),
  enabled: z.boolean(),
  key: z.string(),
  name: z.string(),
  revision: z.number(),
  updatedAt: z.string().nullable(),
};

/**
 * API - Feature Summary Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureSummarySchema: Web_Api_FeatureSummarySchema = z.object(featureSummaryShape);

/**
 * API - Features Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featuresResponseSchema = z.object({
  items: z.array(featureSummarySchema),
});

/**
 * API - Editor Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const editorSchema: Web_Api_EditorSchema = z.custom<Web_Schema_Node>(
  (value) => (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  ),
  { message: 'The feature editor description is missing.' },
);

/**
 * API - Feature Detail Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureDetailSchema: Web_Api_FeatureDetailSchema = z.object({
  ...featureSummaryShape,
  configuration: z.unknown(),
  editor: editorSchema,
  example: z.unknown(),
  secrets: z.record(z.string(), z.boolean()).default({}),
});

/**
 * API - Service Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serviceSchema = z.object({
  component: z.enum([
    'bot',
    'web',
    'worker',
  ]),
  status: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

/**
 * API - Bot Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const botSchema: Web_Api_BotSchema = z.object({
  activeFeatures: z.array(z.string()).default([]),
  addServerUrl: z.string().nullable(),
  applicationId: z.string().nullable(),
  configurationErrors: z.array(z.string()).default([]),
  desiredState: z.enum([
    'running',
    'stopped',
  ]),
  guildCount: z.number().nullable().default(null),
  resolution: z.string().nullable().default(null),
  services: z.array(serviceSchema),
  status: z.string(),
  tokenConfigured: z.boolean(),
  userTag: z.string().nullable().default(null),
});

/**
 * API - Log Entry Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logEntrySchema: Web_Api_LogEntrySchema = z.object({
  component: z.enum([
    'bot',
    'web',
    'worker',
  ]),
  context: z.record(z.string(), z.unknown()).default({}),
  event: z.string(),
  id: z.coerce.string(),
  level: z.enum([
    'debug',
    'error',
    'info',
    'warn',
  ]),
  occurredAt: z.string(),
});

/**
 * API - Log Page Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logPageSchema: Web_Api_LogPageSchema = z.object({
  cursor: z.coerce.string().nullable().default(null),
  items: z.array(logEntrySchema),
});

/**
 * API - Diagnostics Schema.
 *
 * Reads whether Debug logging is on.
 * The bot, the control panel, and the worker share this one switch.
 *
 * @since 4.0.0
 */
const diagnosticsSchema: Web_Api_DiagnosticsSchema = z.object({
  debugLogging: z.boolean(),
});

/**
 * API - User Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const userSchema: Web_Api_UserSchema = z.object({
  allServers: z.boolean(),
  createdAt: z.string(),
  editable: z.boolean().default(false),
  enabled: z.boolean(),
  id: z.coerce.string(),
  lastSignInAt: z.string().nullable(),
  passkeys: z.number(),
  role: roleSchema,
  serverIds: z.array(z.coerce.string()),
  twoFactor: z.boolean(),
  username: z.string(),
});

/**
 * API - Users Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const usersResponseSchema = z.object({
  items: z.array(userSchema),
});

/**
 * API - Invite Page Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const invitePageSchema: Web_Api_InvitePageSchema = z.object({
  accentColor: z.string(),
  bannerImageId: z.string().nullable().default(null),
  bannerImageUrl: z.string().nullable(),
  buttonLabel: z.string(),
  description: z.string(),
  footerText: z.string(),
  logo: z.enum([
    'custom',
    'none',
    'server',
  ]),
  logoImageId: z.string().nullable().default(null),
  logoImageUrl: z.string().nullable(),
  revision: z.number(),
  showBoostTier: z.boolean(),
  showMemberCount: z.boolean(),
  theme: z.enum([
    'dark',
    'light',
    'system',
  ]),
  title: z.string(),
  updatedAt: z.string().nullable(),
});

/**
 * API - Invite Page Response Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const invitePageResponseSchema: Web_Api_InvitePageResponseSchema = z.object({
  enabled: z.boolean(),
  page: invitePageSchema,
  publicUrl: z.string().nullable(),
  server: z.object({
    iconUrl: z.string().nullable(),
    name: z.string(),
  }),
});

/**
 * API - Uploaded Image Schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const uploadedImageSchema: Web_Api_UploadedImageSchema = z.object({
  id: z.coerce.string(),
  url: z.string(),
});

/**
 * API.
 *
 * Keeps the machine-readable code and field issues from the shared error envelope so
 * screens can react to specific failures and show each message next to its field.
 *
 * @since 4.0.0
 */
export class ApiError extends Error {
  /**
   * API - Code.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public readonly code: Web_Api_ApiError_Code;

  /**
   * API - Status.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public readonly status: Web_Api_ApiError_Status;

  /**
   * API - Issues.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public readonly issues: Web_Api_ApiError_Issues;

  /**
   * API - Constructor.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public constructor(message: Web_Api_ApiError_Constructor_Message, code: Web_Api_ApiError_Constructor_Code, status: Web_Api_ApiError_Constructor_Status, issues: Web_Api_ApiError_Constructor_Issues) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.issues = issues;

    return;
  }
}

// issueFor returns the message the API attached to one form field, if any.

/**
 * API - Issue For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_IssueFor_CaughtError} caughtError - Caught error.
 * @param {Web_Api_IssueFor_Field}       field       - Field.
 *
 * @returns {Web_Api_IssueFor_Returns}
 *
 * @since 4.0.0
 */
export const issueFor = (caughtError: Web_Api_IssueFor_CaughtError, field: Web_Api_IssueFor_Field): Web_Api_IssueFor_Returns => {
  if (!(caughtError instanceof ApiError)) {
    return '';
  }

  const issue: Web_Api_IssueFor_Issue = caughtError.issues.find(
    (candidate) => candidate['field'] === field,
  );

  return (issue === undefined) ? '' : issue['message'];
};

// summaryFor returns the banner text for an error, or nothing when a shown field already carries it.

/**
 * API - Summary For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_SummaryFor_CaughtError} caughtError - Caught error.
 * @param {Web_Api_SummaryFor_ShownFields} shownFields - Shown fields.
 * @param {Web_Api_SummaryFor_Fallback}    fallback    - Fallback.
 *
 * @returns {Web_Api_SummaryFor_Returns}
 *
 * @since 4.0.0
 */
export const summaryFor = (caughtError: Web_Api_SummaryFor_CaughtError, shownFields: Web_Api_SummaryFor_ShownFields, fallback: Web_Api_SummaryFor_Fallback): Web_Api_SummaryFor_Returns => {
  if (caughtError === null || caughtError === undefined) {
    return '';
  }

  if (
    caughtError instanceof ApiError
    && caughtError.issues.some(
      (issue) => shownFields.includes(issue['field']),
    ) === true
  ) {
    return '';
  }

  if (caughtError instanceof DOMException && caughtError.name === 'NotAllowedError') {
    return 'The passkey prompt was closed before it finished.';
  }

  if (caughtError instanceof DOMException && caughtError.name === 'InvalidStateError') {
    return 'This device already has a passkey for this account.';
  }

  return (caughtError instanceof Error) ? caughtError.message : fallback;
};

// errorMessage turns any failure into one sentence for a banner.

/**
 * API - Error Message.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ErrorMessage_CaughtError} caughtError - Caught error.
 * @param {Web_Api_ErrorMessage_Fallback}    fallback    - Fallback.
 *
 * @returns {Web_Api_ErrorMessage_Returns}
 *
 * @since 4.0.0
 */
export const errorMessage = (caughtError: Web_Api_ErrorMessage_CaughtError, fallback: Web_Api_ErrorMessage_Fallback): Web_Api_ErrorMessage_Returns => (
  (caughtError instanceof Error && caughtError.message !== '') ? caughtError.message : fallback
);

// responseError converts the stable API error envelope into an ApiError.

/**
 * API - Response Error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Response} response - Response.
 *
 * @returns {Web_Api_ResponseError_Returns}
 *
 * @since 4.0.0
 */
const responseError = async (response: Response): Web_Api_ResponseError_Returns => {
  const responseValue: Web_Api_ResponseError_ResponseValue = await response.json().catch(() => undefined);
  const parsedError: Web_Api_ResponseError_ParsedError = errorEnvelopeSchema.safeParse(responseValue);
  if (parsedError.success === true) {
    return new ApiError(
      parsedError.data['error']['message'],
      parsedError.data['error']['code'],
      response.status,
      parsedError.data['error']['issues'] ?? [],
    );
  }

  return new ApiError(`Request failed with status ${response.status}.`, 'request_failed', response.status, []);
};

// readCookie returns one non-HTTP-only same-origin cookie.

/**
 * API - Read Cookie.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ReadCookie_Name} name - Name.
 *
 * @returns {Web_Api_ReadCookie_Returns}
 *
 * @since 4.0.0
 */
const readCookie = (name: Web_Api_ReadCookie_Name): Web_Api_ReadCookie_Returns => {
  const prefix: Web_Api_ReadCookie_Prefix = `${name}=`;
  const parts: Web_Api_ReadCookie_Parts = document.cookie.split(';');
  const matchingPart: Web_Api_ReadCookie_MatchingPart = parts
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return (matchingPart === undefined) ? undefined : decodeURIComponent(matchingPart.slice(prefix.length));
};

// buildRequest adds the JSON or file body, the CSRF header for mutations, and same-origin cookies.

/**
 * API - Build Request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_Request_Options} options - Options.
 *
 * @returns {Web_Api_BuildRequest_Returns}
 *
 * @since 4.0.0
 */
const buildRequest = (options: Web_Api_Request_Options): Web_Api_BuildRequest_Returns => {
  const headers: Headers = new Headers(options['headers']);
  const method: Web_Api_BuildRequest_Method = options['method'] ?? 'GET';
  let body: Web_Api_BuildRequest_Body = undefined;

  if (options['file'] !== undefined) {
    headers.set('Content-Type', (options['file'].type === '') ? 'application/octet-stream' : options['file'].type);
    body = options['file'];
  } else if (options['body'] !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options['body']);
  }

  if (method !== 'GET') {
    const csrfToken: Web_Api_BuildRequest_CsrfToken = readCookie('dsb_csrf');
    if (csrfToken !== undefined) {
      headers.set('X-CSRF-Token', csrfToken);
    }
  }

  return {
    ...((body === undefined) ? {} : { body }),
    credentials: 'same-origin',
    headers,
    method,
  };
};

// requestJSON performs one same-origin request and validates its response contract.

/**
 * API - Request JSON.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_RequestJson_Path}      path      - Path.
 * @param {Web_Api_Schema<ResponseValue>} schema    - Schema.
 * @param {Web_Api_Request_Options}       [options] - Options.
 *
 * @returns {Promise<ResponseValue>}
 *
 * @since 4.0.0
 */
const requestJSON = async <ResponseValue>(
  path: Web_Api_RequestJson_Path,
  schema: Web_Api_Schema<ResponseValue>,
  options: Web_Api_Request_Options = {},
): Promise<ResponseValue> => {
  const response: Response = await fetch(path, buildRequest(options));
  if (response.ok === false) {
    throw await responseError(response);
  }

  const responseValue: Web_Api_RequestJson_ResponseValue = await response.json();

  return schema.parse(responseValue);
};

// requestVoid performs one mutation whose successful response body is not needed.

/**
 * API - Request Void.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_RequestVoid_Path} path    - Path.
 * @param {Web_Api_Request_Options}  options - Options.
 *
 * @returns {Web_Api_RequestVoid_Returns}
 *
 * @since 4.0.0
 */
const requestVoid = async (
  path: Web_Api_RequestVoid_Path,
  options: Web_Api_Request_Options,
): Web_Api_RequestVoid_Returns => {
  const response: Response = await fetch(path, buildRequest(options));
  if (response.ok === false) {
    throw await responseError(response);
  }

  return;
};

// serverPath builds a path under one Discord server.

/**
 * API - Server Path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ServerPath_ServerId} serverId - Server id.
 * @param {Web_Api_ServerPath_Suffix}   suffix   - Suffix.
 *
 * @returns {Web_Api_ServerPath_Returns}
 *
 * @since 4.0.0
 */
const serverPath = (serverId: Web_Api_ServerPath_ServerId, suffix: Web_Api_ServerPath_Suffix): Web_Api_ServerPath_Returns => `/api/v1/servers/${encodeURIComponent(serverId)}${suffix}`;

/**
 * API - Get Setup Status.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetSetupStatus_Returns}
 *
 * @since 4.0.0
 */
export const getSetupStatus = async (): Web_Api_GetSetupStatus_Returns => requestJSON(
  '/api/v1/setup/status',
  setupStatusSchema,
);

/**
 * API - Get Current Principal.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetCurrentPrincipal_Returns}
 *
 * @since 4.0.0
 */
export const getCurrentPrincipal = async (): Web_Api_GetCurrentPrincipal_Returns => {
  const response: Response = await fetch('/api/v1/auth/me', {
    credentials: 'same-origin',
  });
  if (response.status === 401) {
    return null;
  }
  if (response.ok === false) {
    throw await responseError(response);
  }

  const responseValue: Web_Api_GetCurrentPrincipal_ResponseValue = await response.json();

  return principalSchema.parse(responseValue);
};

/**
 * API - Claim Installation.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_ClaimInput} input - Input.
 *
 * @returns {Web_Api_ClaimInstallation_Returns}
 *
 * @since 4.0.0
 */
export const claimInstallation = async (
  input: Web_Api_ClaimInput,
): Web_Api_ClaimInstallation_Returns => requestJSON(
  '/api/v1/setup/claim',
  authenticationResponseSchema,
  {
    body: {
      claimCode: input['claimCode'].trim(),
      password: input['password'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Login.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_LoginInput} input - Input.
 *
 * @returns {Web_Api_Login_Returns}
 *
 * @since 4.0.0
 */
export const login = async (
  input: Web_Api_LoginInput,
): Web_Api_Login_Returns => requestJSON(
  '/api/v1/auth/login',
  loginResultSchema,
  {
    body: {
      password: input['password'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Submit Second Factor.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_SubmitSecondFactor_Challenge} challenge - Challenge.
 * @param {Web_Api_SubmitSecondFactor_Code}      code      - Code.
 *
 * @returns {Web_Api_SubmitSecondFactor_Returns}
 *
 * @since 4.0.0
 */
export const submitSecondFactor = async (
  challenge: Web_Api_SubmitSecondFactor_Challenge,
  code: Web_Api_SubmitSecondFactor_Code,
): Web_Api_SubmitSecondFactor_Returns => requestJSON(
  '/api/v1/auth/login/second-factor',
  authenticationResponseSchema,
  {
    body: {
      challenge,
      code: code.trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Sign In With Passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_SignInWithPasskey_Returns}
 *
 * @since 4.0.0
 */
export const signInWithPasskey = async (): Web_Api_SignInWithPasskey_Returns => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/login/options',
    passkeyCeremonySchema,
    { method: 'POST' },
  );
  const credential: Web_Api_SignInWithPasskey_Credential = await getPasskey(ceremony['options']);

  return requestJSON(
    '/api/v1/auth/passkeys/login/verify',
    authenticationResponseSchema,
    {
      body: {
        ceremonyId: ceremony['ceremonyId'],
        credential,
      },
      method: 'POST',
    },
  );
};

/**
 * API - Logout.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_Logout_Returns}
 *
 * @since 4.0.0
 */
export const logout = async (): Web_Api_Logout_Returns => requestVoid(
  '/api/v1/auth/logout',
  { method: 'POST' },
);

/**
 * API - Dismiss Removed Secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_DismissRemovedSecrets_Returns}
 *
 * @since 4.0.0
 */
export const dismissRemovedSecrets = async (): Web_Api_DismissRemovedSecrets_Returns => requestVoid(
  '/api/v1/auth/removed-secrets',
  { method: 'DELETE' },
);

/**
 * API - Get Account Security.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetAccountSecurity_Returns}
 *
 * @since 4.0.0
 */
export const getAccountSecurity = async (): Web_Api_GetAccountSecurity_Returns => requestJSON(
  '/api/v1/auth/security',
  accountSecuritySchema,
);

/**
 * API - Change Password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_ChangePassword_CurrentPassword} currentPassword - Current password.
 * @param {Web_Api_ChangePassword_NewPassword}     newPassword     - New password.
 *
 * @returns {Web_Api_ChangePassword_Returns}
 *
 * @since 4.0.0
 */
export const changePassword = async (
  currentPassword: Web_Api_ChangePassword_CurrentPassword,
  newPassword: Web_Api_ChangePassword_NewPassword,
): Web_Api_ChangePassword_Returns => requestVoid(
  '/api/v1/auth/password',
  {
    body: {
      currentPassword,
      newPassword,
    },
    method: 'POST',
  },
);

/**
 * API - Change Username.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_ChangeUsername_Username} username - Username.
 * @param {Web_Api_ChangeUsername_Password} password - Password.
 *
 * @returns {Web_Api_ChangeUsername_Returns}
 *
 * @since 4.0.0
 */
export const changeUsername = async (
  username: Web_Api_ChangeUsername_Username,
  password: Web_Api_ChangeUsername_Password,
): Web_Api_ChangeUsername_Returns => requestVoid(
  '/api/v1/auth/username',
  {
    body: {
      password,
      username: username.trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Start Totp Setup.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_StartTotpSetup_Password} password - Password.
 *
 * @returns {Web_Api_StartTotpSetup_Returns}
 *
 * @since 4.0.0
 */
export const startTotpSetup = async (password: Web_Api_StartTotpSetup_Password): Web_Api_StartTotpSetup_Returns => requestJSON(
  '/api/v1/auth/totp/setup',
  totpSetupSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Enable Totp.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_EnableTotp_Code} code - Code.
 *
 * @returns {Web_Api_EnableTotp_Returns}
 *
 * @since 4.0.0
 */
export const enableTotp = async (code: Web_Api_EnableTotp_Code): Web_Api_EnableTotp_Returns => requestJSON(
  '/api/v1/auth/totp/enable',
  recoveryCodesSchema,
  {
    body: { code: code.trim() },
    method: 'POST',
  },
);

/**
 * API - Disable Totp.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_DisableTotp_Password} password - Password.
 *
 * @returns {Web_Api_DisableTotp_Returns}
 *
 * @since 4.0.0
 */
export const disableTotp = async (password: Web_Api_DisableTotp_Password): Web_Api_DisableTotp_Returns => requestVoid(
  '/api/v1/auth/totp/disable',
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Regenerate Recovery Codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RegenerateRecoveryCodes_Password} password - Password.
 *
 * @returns {Web_Api_RegenerateRecoveryCodes_Returns}
 *
 * @since 4.0.0
 */
export const regenerateRecoveryCodes = async (password: Web_Api_RegenerateRecoveryCodes_Password): Web_Api_RegenerateRecoveryCodes_Returns => requestJSON(
  '/api/v1/auth/recovery-codes',
  recoveryCodesSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Add Passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_AddPasskey_Name}     name     - Name.
 * @param {Web_Api_AddPasskey_Password} password - Password.
 *
 * @returns {Web_Api_AddPasskey_Returns}
 *
 * @since 4.0.0
 */
export const addPasskey = async (name: Web_Api_AddPasskey_Name, password: Web_Api_AddPasskey_Password): Web_Api_AddPasskey_Returns => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/register/options',
    passkeyCeremonySchema,
    {
      body: {
        name: name.trim(),
        password,
      },
      method: 'POST',
    },
  );
  const credential: Web_Api_AddPasskey_Credential = await createPasskey(ceremony['options']);

  return requestJSON(
    '/api/v1/auth/passkeys/register/verify',
    passkeySchema,
    {
      body: {
        ceremonyId: ceremony['ceremonyId'],
        credential,
      },
      method: 'POST',
    },
  );
};

/**
 * API - Remove Passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RemovePasskey_PasskeyId} passkeyId - Passkey id.
 * @param {Web_Api_RemovePasskey_Password}  password  - Password.
 *
 * @returns {Web_Api_RemovePasskey_Returns}
 *
 * @since 4.0.0
 */
export const removePasskey = async (passkeyId: Web_Api_RemovePasskey_PasskeyId, password: Web_Api_RemovePasskey_Password): Web_Api_RemovePasskey_Returns => requestVoid(
  `/api/v1/auth/passkeys/${encodeURIComponent(passkeyId)}`,
  {
    body: { password },
    method: 'DELETE',
  },
);

/**
 * API - Get Tokens.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetTokens_Returns}
 *
 * @since 4.0.0
 */
export const getTokens = async (): Web_Api_GetTokens_Returns => {
  const response: Web_Api_GetTokens_Response = await requestJSON('/api/v1/auth/tokens', tokensResponseSchema);

  return response['items'];
};

/**
 * API - Create Token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_CreateTokenInput} input - Input.
 *
 * @returns {Web_Api_CreateToken_Returns}
 *
 * @since 4.0.0
 */
export const createToken = async (
  input: Web_Api_CreateTokenInput,
): Web_Api_CreateToken_Returns => requestJSON(
  '/api/v1/auth/tokens',
  createdTokenSchema,
  {
    body: {
      ...((input['expiresAt'] === undefined) ? {} : { expiresAt: input['expiresAt'] }),
      name: input['name'].trim(),
      scopes: input['scopes'],
    },
    method: 'POST',
  },
);

/**
 * API - Update Token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_UpdateToken_TokenId} tokenId - Token id.
 * @param {Web_Api_UpdateTokenInput}    input   - Input.
 *
 * @returns {Web_Api_UpdateToken_Returns}
 *
 * @since 4.0.0
 */
export const updateToken = async (
  tokenId: Web_Api_UpdateToken_TokenId,
  input: Web_Api_UpdateTokenInput,
): Web_Api_UpdateToken_Returns => requestJSON(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  tokenSchema,
  {
    body: {
      ...((input['expiresAt'] === undefined) ? {} : { expiresAt: input['expiresAt'] }),
      name: input['name'].trim(),
      scopes: input['scopes'],
    },
    method: 'PUT',
  },
);

/**
 * API - Revoke Token.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RevokeToken_TokenId} tokenId - Token id.
 *
 * @returns {Web_Api_RevokeToken_Returns}
 *
 * @since 4.0.0
 */
export const revokeToken = async (tokenId: Web_Api_RevokeToken_TokenId): Web_Api_RevokeToken_Returns => requestVoid(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  { method: 'DELETE' },
);

/**
 * API - Get Notifications.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetNotifications_Returns}
 *
 * @since 4.0.0
 */
export const getNotifications = async (): Web_Api_GetNotifications_Returns => {
  const response: Web_Api_GetNotifications_Response = await requestJSON('/api/v1/notifications', notificationTargetsResponseSchema);

  return response['items'];
};

/**
 * API - Get Notification Events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetNotificationEvents_Returns}
 *
 * @since 4.0.0
 */
export const getNotificationEvents = async (): Web_Api_GetNotificationEvents_Returns => {
  const response: Web_Api_GetNotificationEvents_Response = await requestJSON('/api/v1/notifications/events', notificationEventsResponseSchema);

  return response['items'];
};

/**
 * API - Create Notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Notifications_CreateInput} input - Input.
 *
 * @returns {Web_Api_CreateNotification_Returns}
 *
 * @since 4.0.0
 */
export const createNotification = async (
  input: Web_Notifications_CreateInput,
): Web_Api_CreateNotification_Returns => requestJSON(
  '/api/v1/notifications',
  notificationTargetSchema,
  {
    body: {
      events: input['events'],
      name: input['name'].trim(),
      service: input['service'],
      settings: input['settings'],
    },
    method: 'POST',
  },
);

/**
 * API - Update Notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_UpdateNotification_NotificationId} notificationId - Notification id.
 * @param {Web_Notifications_UpdateInput}             input          - Input.
 *
 * @returns {Web_Api_UpdateNotification_Returns}
 *
 * @since 4.0.0
 */
export const updateNotification = async (
  notificationId: Web_Api_UpdateNotification_NotificationId,
  input: Web_Notifications_UpdateInput,
): Web_Api_UpdateNotification_Returns => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  notificationTargetSchema,
  {
    body: {
      clearSecrets: input['clearSecrets'],
      events: input['events'],
      name: input['name'].trim(),
      settings: input['settings'],
    },
    method: 'PUT',
  },
);

/**
 * API - Remove Notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_RemoveNotification_NotificationId} notificationId - Notification id.
 *
 * @returns {Web_Api_RemoveNotification_Returns}
 *
 * @since 4.0.0
 */
export const removeNotification = async (notificationId: Web_Api_RemoveNotification_NotificationId): Web_Api_RemoveNotification_Returns => requestVoid(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  { method: 'DELETE' },
);

/**
 * API - Test Notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_TestNotification_NotificationId} notificationId - Notification id.
 *
 * @returns {Web_Api_TestNotification_Returns}
 *
 * @since 4.0.0
 */
export const testNotification = async (notificationId: Web_Api_TestNotification_NotificationId): Web_Api_TestNotification_Returns => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}/test`,
  notificationTestSchema,
  { method: 'POST' },
);

/**
 * API - Get Servers.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetServers_Returns}
 *
 * @since 4.0.0
 */
export const getServers = async (): Web_Api_GetServers_Returns => {
  const response: Web_Api_GetServers_Response = await requestJSON('/api/v1/servers', serversResponseSchema);

  return response['items'];
};

/**
 * API - Get Resources.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_GetResources_ServerId} serverId - Server id.
 *
 * @returns {Web_Api_GetResources_Returns}
 *
 * @since 4.0.0
 */
export const getResources = async (serverId: Web_Api_GetResources_ServerId): Web_Api_GetResources_Returns => requestJSON(
  serverPath(serverId, '/resources'),
  resourcesSchema,
);

/**
 * API - Get Features.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_GetFeatures_ServerId} serverId - Server id.
 *
 * @returns {Web_Api_GetFeatures_Returns}
 *
 * @since 4.0.0
 */
export const getFeatures = async (serverId: Web_Api_GetFeatures_ServerId): Web_Api_GetFeatures_Returns => {
  const response: Web_Api_GetFeatures_Response = await requestJSON(serverPath(serverId, '/features'), featuresResponseSchema);

  return response['items'];
};

/**
 * API - Get Feature.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_GetFeature_ServerId}   serverId   - Server id.
 * @param {Web_Api_GetFeature_FeatureKey} featureKey - Feature key.
 *
 * @returns {Web_Api_GetFeature_Returns}
 *
 * @since 4.0.0
 */
export const getFeature = async (serverId: Web_Api_GetFeature_ServerId, featureKey: Web_Api_GetFeature_FeatureKey): Web_Api_GetFeature_Returns => requestJSON(
  serverPath(serverId, `/features/${encodeURIComponent(featureKey)}`),
  featureDetailSchema,
);

/**
 * API - Save Feature.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_SaveFeature_ServerId}   serverId   - Server id.
 * @param {Web_Api_SaveFeature_FeatureKey} featureKey - Feature key.
 * @param {Web_Api_FeatureSaveInput}       input      - Input.
 *
 * @returns {Web_Api_SaveFeature_Returns}
 *
 * @since 4.0.0
 */
export const saveFeature = async (
  serverId: Web_Api_SaveFeature_ServerId,
  featureKey: Web_Api_SaveFeature_FeatureKey,
  input: Web_Api_FeatureSaveInput,
): Web_Api_SaveFeature_Returns => requestJSON(
  serverPath(serverId, `/features/${encodeURIComponent(featureKey)}`),
  featureDetailSchema,
  {
    body: {
      configuration: input['configuration'],
      expectedRevision: input['expectedRevision'],
      ...((input['secrets'] === undefined || Object.keys(input['secrets']).length === 0) ? {} : { secrets: input['secrets'] }),
    },
    method: 'PUT',
  },
);

/**
 * API - Set Feature Enabled.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_Api_SetFeatureEnabled_ServerId}   serverId   - Server id.
 * @param {Web_Api_SetFeatureEnabled_FeatureKey} featureKey - Feature key.
 * @param {Web_Api_SetFeatureEnabled_Enabled}    enabled    - Enabled.
 *
 * @returns {Web_Api_SetFeatureEnabled_Returns}
 *
 * @since 4.0.0
 */
export const setFeatureEnabled = async (
  serverId: Web_Api_SetFeatureEnabled_ServerId,
  featureKey: Web_Api_SetFeatureEnabled_FeatureKey,
  enabled: Web_Api_SetFeatureEnabled_Enabled,
): Web_Api_SetFeatureEnabled_Returns => requestJSON(
  serverPath(serverId, `/features/${encodeURIComponent(featureKey)}/enabled`),
  featureSummarySchema,
  {
    body: { enabled },
    method: 'PUT',
  },
);

/**
 * API - Get Bot.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetBot_Returns}
 *
 * @since 4.0.0
 */
export const getBot = async (): Web_Api_GetBot_Returns => requestJSON(
  '/api/v1/bot',
  botSchema,
);

/**
 * API - Request Bot Action.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_BotAction} action - Action.
 *
 * @returns {Web_Api_RequestBotAction_Returns}
 *
 * @since 4.0.0
 */
export const requestBotAction = async (action: Web_Api_BotAction): Web_Api_RequestBotAction_Returns => requestVoid(
  '/api/v1/bot/actions',
  {
    body: { action },
    method: 'POST',
  },
);

/**
 * API - Save Bot Token.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_SaveBotToken_Token} token - Token.
 *
 * @returns {Web_Api_SaveBotToken_Returns}
 *
 * @since 4.0.0
 */
export const saveBotToken = async (token: Web_Api_SaveBotToken_Token): Web_Api_SaveBotToken_Returns => requestVoid(
  '/api/v1/bot/token',
  {
    body: { token: token.trim() },
    method: 'PUT',
  },
);

// logQuery builds the query string for a log request, leaving out empty filters.

/**
 * API - Log Query.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_LogQuery} query - Query.
 *
 * @returns {Web_Api_LogQuery_Returns}
 *
 * @since 4.0.0
 */
const logQuery = (query: Web_Api_LogQuery): Web_Api_LogQuery_Returns => {
  const parameters: URLSearchParams = new URLSearchParams({ component: query['component'] });

  if (query['after'] !== undefined && query['after'] !== '') {
    parameters.set('after', query['after']);
  }

  if (query['level'] !== undefined) {
    parameters.set('level', query['level']);
  }

  if (query['q'] !== undefined && query['q'].trim() !== '') {
    parameters.set('q', query['q'].trim());
  }

  return parameters.toString();
};

/**
 * API - Get Logs.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_LogQuery} query - Query.
 *
 * @returns {Web_Api_GetLogs_Returns}
 *
 * @since 4.0.0
 */
export const getLogs = async (query: Web_Api_LogQuery): Web_Api_GetLogs_Returns => requestJSON(
  `/api/v1/logs?${logQuery(query)}`,
  logPageSchema,
);

/**
 * API - Log Stream Path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_LogQuery} query - Query.
 *
 * @returns {Web_Api_LogStreamPath_Returns}
 *
 * @since 4.0.0
 */
export const logStreamPath = (query: Web_Api_LogQuery): Web_Api_LogStreamPath_Returns => `/api/v1/logs/stream?${logQuery(query)}`;

/**
 * API - Get Diagnostics.
 *
 * Reads whether Debug logging is on.
 * Anyone who can read the logs can see it.
 *
 * @returns {Web_Api_GetDiagnostics_Returns}
 *
 * @since 4.0.0
 */
export const getDiagnostics = async (): Web_Api_GetDiagnostics_Returns => requestJSON(
  '/api/v1/diagnostics',
  diagnosticsSchema,
);

/**
 * API - Update Diagnostics.
 *
 * Turns Debug logging on or off and answers with the saved setting.
 * The bot and the worker follow within a few seconds.
 *
 * @param {Web_Api_Diagnostics} input - Input.
 *
 * @returns {Web_Api_UpdateDiagnostics_Returns}
 *
 * @since 4.0.0
 */
export const updateDiagnostics = async (input: Web_Api_Diagnostics): Web_Api_UpdateDiagnostics_Returns => requestJSON(
  '/api/v1/diagnostics',
  diagnosticsSchema,
  {
    body: input,
    method: 'PUT',
  },
);

/**
 * API - Parse Log Entry.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ParseLogEntry_Value} value - Value.
 *
 * @returns {Web_Api_ParseLogEntry_Returns}
 *
 * @since 4.0.0
 */
export const parseLogEntry = (value: Web_Api_ParseLogEntry_Value): Web_Api_ParseLogEntry_Returns => {
  const parsed: Web_Api_ParseLogEntry_Parsed = logEntrySchema.safeParse(value);

  return (parsed.success === true) ? parsed.data : null;
};

/**
 * API - Confirm Backup Operation.
 *
 * Exchanges fresh password and authenticator proof for one scoped grant.
 * The server binds the result to this browser session and purpose.
 *
 * @param {Web_Backup_Purpose}                      purpose  - Purpose.
 * @param {Web_Api_ConfirmBackupOperation_Password} password - Password.
 * @param {Web_Api_ConfirmBackupOperation_Code}     code     - Code.
 *
 * @returns {Web_Api_ConfirmBackupOperation_Returns}
 *
 * @since 4.0.0
 */
export const confirmBackupOperation = async (purpose: Web_Backup_Purpose, password: Web_Api_ConfirmBackupOperation_Password, code: Web_Api_ConfirmBackupOperation_Code): Web_Api_ConfirmBackupOperation_Returns => {
  const result: Web_Backup_Grant = await requestJSON('/api/v1/backup/confirmation', backupGrantSchema, {
    body: {
      ...((code === '') ? {} : { code }),
      password,
      purpose,
    },
    method: 'POST',
  });

  return result['grant'];
};

/**
 * API - Confirm Backup Operation With Passkey.
 *
 * Runs a session- and purpose-bound WebAuthn ceremony for one scoped grant.
 * Successful verification produces the same one-use credential as a password.
 *
 * @param {Web_Backup_Purpose} purpose - Purpose.
 *
 * @returns {Web_Api_ConfirmBackupOperationWithPasskey_Returns}
 *
 * @since 4.0.0
 */
export const confirmBackupOperationWithPasskey = async (purpose: Web_Backup_Purpose): Web_Api_ConfirmBackupOperationWithPasskey_Returns => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON('/api/v1/backup/confirmation/passkey/options', passkeyCeremonySchema, {
    body: { purpose },
    method: 'POST',
  });
  const credential: Web_Api_ConfirmBackupOperationWithPasskey_Credential = await getPasskey(ceremony['options']);
  const result: Web_Backup_Grant = await requestJSON('/api/v1/backup/confirmation/passkey/verify', backupGrantSchema, {
    body: {
      ceremonyId: ceremony['ceremonyId'],
      credential,
      purpose,
    },
    method: 'POST',
  });

  return result['grant'];
};

/**
 * API - Download Backup Export.
 *
 * Sends the secret-bearing answer directly to a temporary browser download.
 * The response is never placed in application state or browser cache.
 *
 * @param {Web_Backup_ExportSections}          sections - Sections.
 * @param {Web_Api_DownloadBackupExport_Grant} grant    - Grant.
 *
 * @returns {Web_Api_DownloadBackupExport_Returns}
 *
 * @since 4.0.0
 */
export const downloadBackupExport = async (sections: Web_Backup_ExportSections, grant: Web_Api_DownloadBackupExport_Grant): Web_Api_DownloadBackupExport_Returns => {
  const response: Response = await fetch('/api/v1/backup/export', {
    ...buildRequest({
      body: {
        grant,
        sections,
      },
      method: 'POST',
    }),
    cache: 'no-store',
  });
  if (response.ok === false) {
    throw await responseError(response);
  }
  const contentDisposition: Web_Api_DownloadBackupExport_ContentDisposition = response.headers.get('Content-Disposition') ?? '';
  const filenameMatch: Web_Api_DownloadBackupExport_FilenameMatch = contentDisposition.match(new RegExp(contentDispositionFilenamePattern, 'u'));
  const matchedFilename: Web_Api_DownloadBackupExport_MatchedFilename = (filenameMatch !== null) ? filenameMatch[1] : undefined;
  const filename: Web_Api_DownloadBackupExport_Filename = matchedFilename ?? `discord-stonker-bot-export-${new Date().toISOString().slice(0, 10)}.json`;
  const objectUrl: Web_Api_DownloadBackupExport_ObjectUrl = URL.createObjectURL(await response.blob());
  const link: HTMLAnchorElement = document.createElement('a');
  try {
    link.href = objectUrl;
    link.download = filename;
    link.click();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  return;
};

/**
 * API - Preview Backup Import.
 *
 * Requests a read-only comparison for either wizard source.
 * Legacy parsing remains authoritative on the server.
 *
 * @param {Web_Backup_ImportSource} source - Source.
 *
 * @returns {Web_Api_PreviewBackupImport_Returns}
 *
 * @since 4.0.0
 */
export const previewBackupImport = async (source: Web_Backup_ImportSource): Web_Api_PreviewBackupImport_Returns => requestJSON('/api/v1/backup/imports/preview', backupImportPreviewSchema, {
  body: { source },
  method: 'POST',
});

/**
 * API - Apply Backup Import.
 *
 * Applies the reviewed source with a freshly confirmed import grant.
 * The server repeats strict validation immediately before its transaction.
 *
 * @param {Web_Backup_ImportSource}         source - Source.
 * @param {Web_Api_ApplyBackupImport_Grant} grant  - Grant.
 *
 * @returns {Web_Api_ApplyBackupImport_Returns}
 *
 * @since 4.0.0
 */
export const applyBackupImport = async (source: Web_Backup_ImportSource, grant: Web_Api_ApplyBackupImport_Grant): Web_Api_ApplyBackupImport_Returns => requestJSON('/api/v1/backup/imports', backupImportResultSchema, {
  body: {
    grant,
    source,
  },
  method: 'POST',
});

/**
 * API - Get Users.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_Api_GetUsers_Returns}
 *
 * @since 4.0.0
 */
export const getUsers = async (): Web_Api_GetUsers_Returns => {
  const response: Web_Api_GetUsers_Response = await requestJSON('/api/v1/users', usersResponseSchema);

  return response['items'];
};

/**
 * API - Create User.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_CreateUserInput} input - Input.
 *
 * @returns {Web_Api_CreateUser_Returns}
 *
 * @since 4.0.0
 */
export const createUser = async (input: Web_Api_CreateUserInput): Web_Api_CreateUser_Returns => requestJSON(
  '/api/v1/users',
  userSchema,
  {
    body: {
      allServers: input['allServers'],
      password: input['password'],
      role: input['role'],
      serverIds: (input['allServers'] === true) ? [] : input['serverIds'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Update User.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_UpdateUser_UserId} userId - User id.
 * @param {Web_Api_UpdateUserInput}   input  - Input.
 *
 * @returns {Web_Api_UpdateUser_Returns}
 *
 * @since 4.0.0
 */
export const updateUser = async (userId: Web_Api_UpdateUser_UserId, input: Web_Api_UpdateUserInput): Web_Api_UpdateUser_Returns => requestJSON(
  `/api/v1/users/${encodeURIComponent(userId)}`,
  userSchema,
  {
    body: {
      allServers: input['allServers'],
      enabled: input['enabled'],
      role: input['role'],
      serverIds: (input['allServers'] === true) ? [] : input['serverIds'],
    },
    method: 'PUT',
  },
);

/**
 * API - Reset User Password.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ResetUserPassword_UserId}   userId   - User id.
 * @param {Web_Api_ResetUserPassword_Password} password - Password.
 *
 * @returns {Web_Api_ResetUserPassword_Returns}
 *
 * @since 4.0.0
 */
export const resetUserPassword = async (userId: Web_Api_ResetUserPassword_UserId, password: Web_Api_ResetUserPassword_Password): Web_Api_ResetUserPassword_Returns => requestVoid(
  `/api/v1/users/${encodeURIComponent(userId)}/password`,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Reset User Two Factor.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_ResetUserTwoFactor_UserId} userId - User id.
 *
 * @returns {Web_Api_ResetUserTwoFactor_Returns}
 *
 * @since 4.0.0
 */
export const resetUserTwoFactor = async (userId: Web_Api_ResetUserTwoFactor_UserId): Web_Api_ResetUserTwoFactor_Returns => requestVoid(
  `/api/v1/users/${encodeURIComponent(userId)}/two-factor/reset`,
  { method: 'POST' },
);

/**
 * API - Delete User.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_DeleteUser_UserId} userId - User id.
 *
 * @returns {Web_Api_DeleteUser_Returns}
 *
 * @since 4.0.0
 */
export const deleteUser = async (userId: Web_Api_DeleteUser_UserId): Web_Api_DeleteUser_Returns => requestVoid(
  `/api/v1/users/${encodeURIComponent(userId)}`,
  { method: 'DELETE' },
);

/**
 * API - Get Invite Page.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_GetInvitePage_ServerId} serverId - Server id.
 *
 * @returns {Web_Api_GetInvitePage_Returns}
 *
 * @since 4.0.0
 */
export const getInvitePage = async (serverId: Web_Api_GetInvitePage_ServerId): Web_Api_GetInvitePage_Returns => requestJSON(
  serverPath(serverId, '/invite-page'),
  invitePageResponseSchema,
);

/**
 * API - Save Invite Page.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_SaveInvitePage_ServerId} serverId - Server id.
 * @param {Web_Api_InvitePageInput}         input    - Input.
 *
 * @returns {Web_Api_SaveInvitePage_Returns}
 *
 * @since 4.0.0
 */
export const saveInvitePage = async (serverId: Web_Api_SaveInvitePage_ServerId, input: Web_Api_InvitePageInput): Web_Api_SaveInvitePage_Returns => {
  const response: Web_Api_SaveInvitePage_Response = await requestJSON(
    serverPath(serverId, '/invite-page'),
    z.unknown(),
    {
      body: input,
      method: 'PUT',
    },
  );
  const wrapped: Web_Api_SaveInvitePage_Wrapped = invitePageResponseSchema.safeParse(response);

  return (wrapped.success === true) ? wrapped.data['page'] : invitePageSchema.parse(response);
};

/**
 * API - Upload Invite Image.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Api_UploadInviteImage_ServerId} serverId - Server id.
 * @param {File}                               file     - File.
 *
 * @returns {Web_Api_UploadInviteImage_Returns}
 *
 * @since 4.0.0
 */
export const uploadInviteImage = async (serverId: Web_Api_UploadInviteImage_ServerId, file: File): Web_Api_UploadInviteImage_Returns => requestJSON(
  serverPath(serverId, '/invite-page/images'),
  uploadedImageSchema,
  {
    file,
    method: 'POST',
  },
);
