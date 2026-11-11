import { z } from 'zod';

import {
  createPasskey,
  getPasskey,
} from '@/web/passkeys.ts';

import type {
  Web_Api_AccountSecurity,
  Web_Api_AuthenticationResponse,
  Web_Api_Bot,
  Web_Api_BotAction,
  Web_Api_ClaimInput,
  Web_Api_CreatedToken,
  Web_Api_CreateTokenInput,
  Web_Api_CreateUserInput,
  Web_Api_Diagnostics,
  Web_Api_ErrorEnvelope,
  Web_Api_ErrorIssue,
  Web_Api_FeatureDetail,
  Web_Api_FeatureSaveInput,
  Web_Api_FeatureSummary,
  Web_Api_InvitePage,
  Web_Api_InvitePageInput,
  Web_Api_InvitePageResponse,
  Web_Api_LogEntry,
  Web_Api_LoginInput,
  Web_Api_LoginResult,
  Web_Api_LogPage,
  Web_Api_LogQuery,
  Web_Api_Passkey,
  Web_Api_PasskeyCeremony,
  Web_Api_Permission,
  Web_Api_Principal,
  Web_Api_RecoveryCodes,
  Web_Api_RemovedSecret,
  Web_Api_Request_Options,
  Web_Api_Resources,
  Web_Api_Schema,
  Web_Api_Server,
  Web_Api_SetupStatus,
  Web_Api_Token,
  Web_Api_TotpSetup,
  Web_Api_UpdateTokenInput,
  Web_Api_UpdateUserInput,
  Web_Api_UploadedImage,
  Web_Api_User,
} from '@/types/web/api.d.ts';
import type {
  Web_Backup_ExportSections,
  Web_Backup_Grant,
  Web_Backup_ImportPreview,
  Web_Backup_ImportResult,
  Web_Backup_ImportSource,
  Web_Backup_Purpose,
} from '@/types/web/backup.d.ts';
import type {
  Web_Notifications_CreateInput,
  Web_Notifications_Event,
  Web_Notifications_Target,
  Web_Notifications_TestResult,
  Web_Notifications_UpdateInput,
} from '@/types/web/notifications.d.ts';
import type { Web_Schema_Node } from '@/types/web/schema.d.ts';

/**
 * API - Error envelope schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const errorEnvelopeSchema: Web_Api_Schema<Web_Api_ErrorEnvelope> = z.object({
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
 * API - Setup status schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const setupStatusSchema: Web_Api_Schema<Web_Api_SetupStatus> = z.object({
  claimExpiresAt: z.string().optional(),
  claimRequired: z.boolean(),
});

/**
 * API - Role schema.
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
 * API - Permission schema.
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
 * API - Scope schema.
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
 * API - Removed secret schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const removedSecretSchema: Web_Api_Schema<Web_Api_RemovedSecret> = z.object({
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
 * API - Notification target schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationTargetSchema: Web_Api_Schema<Web_Notifications_Target> = z.object({
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
 * API - Notification targets response schema.
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
 * API - Notification events response schema.
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
 * API - Notification test schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationTestSchema: Web_Api_Schema<Web_Notifications_TestResult> = z.object({
  delivered: z.boolean(),
  message: z.string().optional(),
});

/**
 * API - Principal schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const principalSchema: Web_Api_Schema<Web_Api_Principal> = z.object({
  allServers: z.boolean().optional(),
  authenticationType: z.enum([
    'session',
    'token',
  ]),
  id: z.coerce.string(),
  name: z.string().optional(),
  permissions: z.array(z.string()).transform((values: string[]): Web_Api_Permission[] => values.filter((value: string): value is Web_Api_Permission => permissionSchema.safeParse(value).success)).optional(),
  removedSecrets: z.array(removedSecretSchema).optional(),
  role: roleSchema.optional(),
  scopes: z.array(z.string()).optional(),
  serverIds: z.array(z.coerce.string()).optional(),
  username: z.string().optional(),
});

/**
 * API - Authentication response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const authenticationResponseSchema: Web_Api_Schema<Web_Api_AuthenticationResponse> = z.object({
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
 * API - Login result schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const loginResultSchema: Web_Api_Schema<Web_Api_LoginResult> = z.union([
  authenticationResponseSchema,
  z.object({
    challenge: z.string(),
    expiresAt: z.string(),
    status: z.literal('second_factor_required'),
  }),
]);

/**
 * API - Passkey schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeySchema: Web_Api_Schema<Web_Api_Passkey> = z.object({
  createdAt: z.string(),
  hostname: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
});

/**
 * API - Account security schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const accountSecuritySchema: Web_Api_Schema<Web_Api_AccountSecurity> = z.object({
  hostname: z.string(),
  passkeys: z.array(passkeySchema),
  passkeysAvailable: z.boolean(),
  recoveryCodesRemaining: z.number(),
  role: roleSchema.optional(),
  totpEnabled: z.boolean(),
  username: z.string(),
});

/**
 * API - Backup grant schema.
 *
 * Validates the short-lived credential returned by fresh authentication.
 * The raw value is held only long enough for one sensitive request.
 *
 * @since UNRELEASED
 */
const backupGrantSchema: Web_Api_Schema<Web_Backup_Grant> = z.object({
  expiresAt: z.string(),
  grant: z.string(),
}).strict();

/**
 * API - Backup import summary schema.
 *
 * Validates change counts shared by preview and apply answers.
 * Secret-bearing values never appear in this response shape.
 *
 * @since UNRELEASED
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
 * API - Backup import preview schema.
 *
 * Validates the comparison plan rendered by the import wizard.
 * Every fixed object boundary remains strict.
 *
 * @since UNRELEASED
 */
const backupImportPreviewSchema: Web_Api_Schema<Web_Backup_ImportPreview> = z.object({
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
 * API - Backup import result schema.
 *
 * Adds the committed section list to the reviewed summary.
 * The console uses it to complete the progress presentation.
 *
 * @since UNRELEASED
 */
const backupImportResultSchema: Web_Api_Schema<Web_Backup_ImportResult> = backupImportSummarySchema.extend({
  importedSections: z.array(z.enum([
    'connection',
    'features',
    'notifications',
    'accessTokens',
  ])),
}).strict();

/**
 * API - TOTP setup schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const totpSetupSchema: Web_Api_Schema<Web_Api_TotpSetup> = z.object({
  expiresAt: z.string(),
  qrCode: z.string(),
  secret: z.string(),
  uri: z.string(),
});

/**
 * API - Recovery codes schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const recoveryCodesSchema: Web_Api_Schema<Web_Api_RecoveryCodes> = z.object({
  recoveryCodes: z.array(z.string()),
});

/**
 * API - Passkey ceremony schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeyCeremonySchema: Web_Api_Schema<Web_Api_PasskeyCeremony> = z.object({
  ceremonyId: z.string(),
  options: z.record(z.string(), z.unknown()),
});

/**
 * API - Token schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const tokenSchema: Web_Api_Schema<Web_Api_Token> = z.object({
  createdAt: z.string(),
  expiresAt: z.string().nullable(),
  id: z.string(),
  lastUsedAt: z.string().nullable(),
  name: z.string(),
  scopes: z.array(scopeSchema),
});

/**
 * API - Tokens response schema.
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
 * API - Created token schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const createdTokenSchema: Web_Api_Schema<Web_Api_CreatedToken> = z.object({
  plaintext: z.string(),
  token: tokenSchema,
});

/**
 * API - Server schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serverSchema: Web_Api_Schema<Web_Api_Server> = z.object({
  available: z.boolean(),
  enabledFeatures: z.number(),
  iconUrl: z.string().nullable(),
  id: z.coerce.string(),
  name: z.string(),
});

/**
 * API - Servers response schema.
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
 * API - Resources schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const resourcesSchema: Web_Api_Schema<Web_Api_Resources> = z.object({
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
 * API - Feature category schema.
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
 * API - Feature summary shape.
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
 * API - Feature summary schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureSummarySchema: Web_Api_Schema<Web_Api_FeatureSummary> = z.object(featureSummaryShape);

/**
 * API - Features response schema.
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
 * API - Editor schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const editorSchema: Web_Api_Schema<Web_Schema_Node> = z.custom<Web_Schema_Node>(
  (value: unknown): boolean => typeof value === 'object' && value !== null && !Array.isArray(value),
  { message: 'The feature editor description is missing.' },
);

/**
 * API - Feature detail schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureDetailSchema: Web_Api_Schema<Web_Api_FeatureDetail> = z.object({
  ...featureSummaryShape,
  configuration: z.unknown(),
  editor: editorSchema,
  example: z.unknown(),
  secrets: z.record(z.string(), z.boolean()).default({}),
});

/**
 * API - Service schema.
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
 * API - Bot schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const botSchema: Web_Api_Schema<Web_Api_Bot> = z.object({
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
 * API - Log entry schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logEntrySchema: Web_Api_Schema<Web_Api_LogEntry> = z.object({
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
 * API - Log page schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logPageSchema: Web_Api_Schema<Web_Api_LogPage> = z.object({
  cursor: z.coerce.string().nullable().default(null),
  items: z.array(logEntrySchema),
});

/**
 * API - Diagnostics schema.
 *
 * Reads whether Debug logging is on.
 * The bot, the control panel, and the worker share this one switch.
 *
 * @since UNRELEASED
 */
const diagnosticsSchema: Web_Api_Schema<Web_Api_Diagnostics> = z.object({
  debugLogging: z.boolean(),
});

/**
 * API - User schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const userSchema: Web_Api_Schema<Web_Api_User> = z.object({
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
 * API - Users response schema.
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
 * API - Invite page schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const invitePageSchema: Web_Api_Schema<Web_Api_InvitePage> = z.object({
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
 * API - Invite page response schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const invitePageResponseSchema: Web_Api_Schema<Web_Api_InvitePageResponse> = z.object({
  enabled: z.boolean(),
  page: invitePageSchema,
  publicUrl: z.string().nullable(),
  server: z.object({
    iconUrl: z.string().nullable(),
    name: z.string(),
  }),
});

/**
 * API - Uploaded image schema.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const uploadedImageSchema: Web_Api_Schema<Web_Api_UploadedImage> = z.object({
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
  public readonly code: string;

  /**
   * API - Status.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public readonly status: number;

  /**
   * API - Issues.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public readonly issues: Web_Api_ErrorIssue[];

  /**
   * API - Constructor.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  public constructor(message: string, code: string, status: number, issues: Web_Api_ErrorIssue[]) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.issues = issues;
  }
}

// issueFor returns the message the API attached to one form field, if any.

/**
 * API - Issue for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const issueFor = (caughtError: unknown, field: string): string => {
  if (!(caughtError instanceof ApiError)) {
    return '';
  }

  const issue: Web_Api_ErrorIssue | undefined = caughtError.issues.find(
    (candidate: Web_Api_ErrorIssue): boolean => candidate['field'] === field,
  );

  return (issue === undefined) ? '' : issue['message'];
};

// summaryFor returns the banner text for an error, or nothing when a shown field already carries it.

/**
 * API - Summary for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const summaryFor = (caughtError: unknown, shownFields: string[], fallback: string): string => {
  if (caughtError === null || caughtError === undefined) {
    return '';
  }

  if (caughtError instanceof ApiError && caughtError.issues.some(
    (issue: Web_Api_ErrorIssue): boolean => shownFields.includes(issue['field']),
  )) {
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
 * API - Error message.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const errorMessage = (caughtError: unknown, fallback: string): string => (
  (caughtError instanceof Error && caughtError.message !== '') ? caughtError.message : fallback
);

// responseError converts the stable API error envelope into an ApiError.

/**
 * API - Response error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const responseError = async (response: Response): Promise<ApiError> => {
  const responseValue: unknown = await response.json().catch(() => undefined);
  const parsedError = errorEnvelopeSchema.safeParse(responseValue);
  if (parsedError.success) {
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
 * API - Reads cookie.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readCookie = (name: string): string | undefined => {
  const prefix: string = `${name}=`;
  const parts: string[] = document.cookie.split(';');
  const matchingPart: string | undefined = parts
    .map((part: string): string => part.trim())
    .find((part: string): boolean => part.startsWith(prefix));

  return (matchingPart === undefined) ? undefined : decodeURIComponent(matchingPart.slice(prefix.length));
};

// buildRequest adds the JSON or file body, the CSRF header for mutations, and same-origin cookies.

/**
 * API - Builds request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const buildRequest = (options: Web_Api_Request_Options): RequestInit => {
  const headers: Headers = new Headers(options.headers);
  const method: string = options.method ?? 'GET';
  let body: BodyInit | undefined = undefined;

  if (options.file !== undefined) {
    headers.set('Content-Type', (options.file.type === '') ? 'application/octet-stream' : options.file.type);
    body = options.file;
  } else if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  if (method !== 'GET') {
    const csrfToken: string | undefined = readCookie('dsb_csrf');
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
 * @since 4.0.0
 */
const requestJSON = async <ResponseValue>(
  path: string,
  schema: Web_Api_Schema<ResponseValue>,
  options: Web_Api_Request_Options = {},
): Promise<ResponseValue> => {
  const response: Response = await fetch(path, buildRequest(options));
  if (!response.ok) {
    throw await responseError(response);
  }

  const responseValue: unknown = await response.json();

  return schema.parse(responseValue);
};

// requestVoid performs one mutation whose successful response body is not needed.

/**
 * API - Request void.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const requestVoid = async (
  path: string,
  options: Web_Api_Request_Options,
): Promise<void> => {
  const response: Response = await fetch(path, buildRequest(options));
  if (!response.ok) {
    throw await responseError(response);
  }
};

// serverPath builds a path under one Discord server.

/**
 * API - Server path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const serverPath = (serverId: string, suffix: string): string => `/api/v1/servers/${encodeURIComponent(serverId)}${suffix}`;

/**
 * API - Gets setup status.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getSetupStatus = async (): Promise<Web_Api_SetupStatus> => requestJSON(
  '/api/v1/setup/status',
  setupStatusSchema,
);

/**
 * API - Gets current principal.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getCurrentPrincipal = async (): Promise<Web_Api_Principal | null> => {
  const response: Response = await fetch('/api/v1/auth/me', {
    credentials: 'same-origin',
  });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw await responseError(response);
  }

  const responseValue: unknown = await response.json();

  return principalSchema.parse(responseValue);
};

/**
 * API - Claim installation.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const claimInstallation = async (
  input: Web_Api_ClaimInput,
): Promise<Web_Api_AuthenticationResponse> => requestJSON(
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
 * @since 4.0.0
 */
export const login = async (
  input: Web_Api_LoginInput,
): Promise<Web_Api_LoginResult> => requestJSON(
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
 * API - Submit second factor.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const submitSecondFactor = async (
  challenge: string,
  code: string,
): Promise<Web_Api_AuthenticationResponse> => requestJSON(
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
 * API - Sign in with passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const signInWithPasskey = async (): Promise<Web_Api_AuthenticationResponse> => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON(
    '/api/v1/auth/passkeys/login/options',
    passkeyCeremonySchema,
    { method: 'POST' },
  );
  const credential: Record<string, unknown> = await getPasskey(ceremony['options']);

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
 * @since 4.0.0
 */
export const logout = async (): Promise<void> => requestVoid(
  '/api/v1/auth/logout',
  { method: 'POST' },
);

/**
 * API - Dismiss removed secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const dismissRemovedSecrets = async (): Promise<void> => requestVoid(
  '/api/v1/auth/removed-secrets',
  { method: 'DELETE' },
);

/**
 * API - Gets account security.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getAccountSecurity = async (): Promise<Web_Api_AccountSecurity> => requestJSON(
  '/api/v1/auth/security',
  accountSecuritySchema,
);

/**
 * API - Change password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => requestVoid(
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
 * API - Change username.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const changeUsername = async (
  username: string,
  password: string,
): Promise<void> => requestVoid(
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
 * API - Starts TOTP setup.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const startTotpSetup = async (password: string): Promise<Web_Api_TotpSetup> => requestJSON(
  '/api/v1/auth/totp/setup',
  totpSetupSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Enable TOTP.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const enableTotp = async (code: string): Promise<Web_Api_RecoveryCodes> => requestJSON(
  '/api/v1/auth/totp/enable',
  recoveryCodesSchema,
  {
    body: { code: code.trim() },
    method: 'POST',
  },
);

/**
 * API - Disable TOTP.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const disableTotp = async (password: string): Promise<void> => requestVoid(
  '/api/v1/auth/totp/disable',
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Regenerate recovery codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const regenerateRecoveryCodes = async (password: string): Promise<Web_Api_RecoveryCodes> => requestJSON(
  '/api/v1/auth/recovery-codes',
  recoveryCodesSchema,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Adds passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const addPasskey = async (name: string, password: string): Promise<Web_Api_Passkey> => {
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
  const credential: Record<string, unknown> = await createPasskey(ceremony['options']);

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
 * API - Removes passkey.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const removePasskey = async (passkeyId: string, password: string): Promise<void> => requestVoid(
  `/api/v1/auth/passkeys/${encodeURIComponent(passkeyId)}`,
  {
    body: { password },
    method: 'DELETE',
  },
);

/**
 * API - Gets tokens.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getTokens = async (): Promise<Web_Api_Token[]> => {
  const response = await requestJSON('/api/v1/auth/tokens', tokensResponseSchema);

  return response['items'];
};

/**
 * API - Create token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const createToken = async (
  input: Web_Api_CreateTokenInput,
): Promise<Web_Api_CreatedToken> => requestJSON(
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
 * API - Update token.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const updateToken = async (
  tokenId: string,
  input: Web_Api_UpdateTokenInput,
): Promise<Web_Api_Token> => requestJSON(
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
 * API - Revoke token.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const revokeToken = async (tokenId: string): Promise<void> => requestVoid(
  `/api/v1/auth/tokens/${encodeURIComponent(tokenId)}`,
  { method: 'DELETE' },
);

/**
 * API - Gets notifications.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getNotifications = async (): Promise<Web_Notifications_Target[]> => {
  const response = await requestJSON('/api/v1/notifications', notificationTargetsResponseSchema);

  return response['items'];
};

/**
 * API - Gets notification events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getNotificationEvents = async (): Promise<Web_Notifications_Event[]> => {
  const response = await requestJSON('/api/v1/notifications/events', notificationEventsResponseSchema);

  return response['items'];
};

/**
 * API - Create notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const createNotification = async (
  input: Web_Notifications_CreateInput,
): Promise<Web_Notifications_Target> => requestJSON(
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
 * API - Update notification.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const updateNotification = async (
  notificationId: string,
  input: Web_Notifications_UpdateInput,
): Promise<Web_Notifications_Target> => requestJSON(
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
 * API - Removes notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const removeNotification = async (notificationId: string): Promise<void> => requestVoid(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}`,
  { method: 'DELETE' },
);

/**
 * API - Test notification.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const testNotification = async (notificationId: string): Promise<Web_Notifications_TestResult> => requestJSON(
  `/api/v1/notifications/${encodeURIComponent(notificationId)}/test`,
  notificationTestSchema,
  { method: 'POST' },
);

/**
 * API - Gets servers.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getServers = async (): Promise<Web_Api_Server[]> => {
  const response = await requestJSON('/api/v1/servers', serversResponseSchema);

  return response['items'];
};

/**
 * API - Gets resources.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getResources = async (serverId: string): Promise<Web_Api_Resources> => requestJSON(
  serverPath(serverId, '/resources'),
  resourcesSchema,
);

/**
 * API - Gets features.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getFeatures = async (serverId: string): Promise<Web_Api_FeatureSummary[]> => {
  const response = await requestJSON(serverPath(serverId, '/features'), featuresResponseSchema);

  return response['items'];
};

/**
 * API - Gets feature.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getFeature = async (serverId: string, featureKey: string): Promise<Web_Api_FeatureDetail> => requestJSON(
  serverPath(serverId, `/features/${encodeURIComponent(featureKey)}`),
  featureDetailSchema,
);

/**
 * API - Save feature.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const saveFeature = async (
  serverId: string,
  featureKey: string,
  input: Web_Api_FeatureSaveInput,
): Promise<Web_Api_FeatureDetail> => requestJSON(
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
 * API - Set feature enabled.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const setFeatureEnabled = async (
  serverId: string,
  featureKey: string,
  enabled: boolean,
): Promise<Web_Api_FeatureSummary> => requestJSON(
  serverPath(serverId, `/features/${encodeURIComponent(featureKey)}/enabled`),
  featureSummarySchema,
  {
    body: { enabled },
    method: 'PUT',
  },
);

/**
 * API - Gets bot.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getBot = async (): Promise<Web_Api_Bot> => requestJSON(
  '/api/v1/bot',
  botSchema,
);

/**
 * API - Request bot action.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const requestBotAction = async (action: Web_Api_BotAction): Promise<void> => requestVoid(
  '/api/v1/bot/actions',
  {
    body: { action },
    method: 'POST',
  },
);

/**
 * API - Save bot token.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const saveBotToken = async (token: string): Promise<void> => requestVoid(
  '/api/v1/bot/token',
  {
    body: { token: token.trim() },
    method: 'PUT',
  },
);

// logQuery builds the query string for a log request, leaving out empty filters.

/**
 * API - Log query.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const logQuery = (query: Web_Api_LogQuery): string => {
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
 * API - Gets logs.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getLogs = async (query: Web_Api_LogQuery): Promise<Web_Api_LogPage> => requestJSON(
  `/api/v1/logs?${logQuery(query)}`,
  logPageSchema,
);

/**
 * API - Log stream path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const logStreamPath = (query: Web_Api_LogQuery): string => `/api/v1/logs/stream?${logQuery(query)}`;

/**
 * API - Gets diagnostics.
 *
 * Reads whether Debug logging is on.
 * Anyone who can read the logs can see it.
 *
 * @since UNRELEASED
 */
export const getDiagnostics = async (): Promise<Web_Api_Diagnostics> => requestJSON(
  '/api/v1/diagnostics',
  diagnosticsSchema,
);

/**
 * API - Update diagnostics.
 *
 * Turns Debug logging on or off and answers with the saved setting.
 * The bot and the worker follow within a few seconds.
 *
 * @since UNRELEASED
 */
export const updateDiagnostics = async (input: Web_Api_Diagnostics): Promise<Web_Api_Diagnostics> => requestJSON(
  '/api/v1/diagnostics',
  diagnosticsSchema,
  {
    body: input,
    method: 'PUT',
  },
);

/**
 * API - Parses log entry.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const parseLogEntry = (value: unknown): Web_Api_LogEntry | null => {
  const parsed = logEntrySchema.safeParse(value);

  return (parsed.success) ? parsed.data : null;
};

/**
 * API - Confirm backup operation.
 *
 * Exchanges fresh password and authenticator proof for one scoped grant.
 * The server binds the result to this browser session and purpose.
 *
 * @param {Web_Backup_Purpose} purpose  - Purpose.
 * @param {string}             password - Password.
 * @param {string}             code     - Code.
 *
 * @returns {Promise<string>}
 *
 * @since UNRELEASED
 */
export const confirmBackupOperation = async (purpose: Web_Backup_Purpose, password: string, code: string): Promise<string> => {
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
 * API - Confirm backup operation with passkey.
 *
 * Runs a session- and purpose-bound WebAuthn ceremony for one scoped grant.
 * Successful verification produces the same one-use credential as a password.
 *
 * @param {Web_Backup_Purpose} purpose - Purpose.
 *
 * @returns {Promise<string>}
 *
 * @since UNRELEASED
 */
export const confirmBackupOperationWithPasskey = async (purpose: Web_Backup_Purpose): Promise<string> => {
  const ceremony: Web_Api_PasskeyCeremony = await requestJSON('/api/v1/backup/confirmation/passkey/options', passkeyCeremonySchema, {
    body: { purpose },
    method: 'POST',
  });
  const credential: Record<string, unknown> = await getPasskey(ceremony['options']);
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
 * API - Download backup export.
 *
 * Sends the secret-bearing answer directly to a temporary browser download.
 * The response is never placed in application state or browser cache.
 *
 * @param {Web_Backup_ExportSections} sections - Sections.
 * @param {string}                    grant    - Grant.
 *
 * @returns {Promise<void>}
 *
 * @since UNRELEASED
 */
export const downloadBackupExport = async (sections: Web_Backup_ExportSections, grant: string): Promise<void> => {
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
  const contentDisposition: string = response.headers.get('Content-Disposition') ?? '';
  const filenameMatch: RegExpMatchArray | null = contentDisposition.match(/filename="([^"]+)"/u);
  const filename: string = filenameMatch?.[1] ?? `discord-stonker-bot-export-${new Date().toISOString().slice(0, 10)}.json`;
  const objectUrl: string = URL.createObjectURL(await response.blob());
  const link: HTMLAnchorElement = document.createElement('a');
  try {
    link.href = objectUrl;
    link.download = filename;
    link.click();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

/**
 * API - Preview backup import.
 *
 * Requests a read-only comparison for either wizard source.
 * Legacy parsing remains authoritative on the server.
 *
 * @param {Web_Backup_ImportSource} source - Source.
 *
 * @returns {Promise<Web_Backup_ImportPreview>}
 *
 * @since UNRELEASED
 */
export const previewBackupImport = async (source: Web_Backup_ImportSource): Promise<Web_Backup_ImportPreview> => requestJSON('/api/v1/backup/imports/preview', backupImportPreviewSchema, {
  body: { source },
  method: 'POST',
});

/**
 * API - Apply backup import.
 *
 * Applies the reviewed source with a freshly confirmed import grant.
 * The server repeats strict validation immediately before its transaction.
 *
 * @param {Web_Backup_ImportSource} source - Source.
 * @param {string}                  grant  - Grant.
 *
 * @returns {Promise<Web_Backup_ImportResult>}
 *
 * @since UNRELEASED
 */
export const applyBackupImport = async (source: Web_Backup_ImportSource, grant: string): Promise<Web_Backup_ImportResult> => requestJSON('/api/v1/backup/imports', backupImportResultSchema, {
  body: {
    grant,
    source,
  },
  method: 'POST',
});

/**
 * API - Gets users.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getUsers = async (): Promise<Web_Api_User[]> => {
  const response = await requestJSON('/api/v1/users', usersResponseSchema);

  return response['items'];
};

/**
 * API - Creates user.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const createUser = async (input: Web_Api_CreateUserInput): Promise<Web_Api_User> => requestJSON(
  '/api/v1/users',
  userSchema,
  {
    body: {
      allServers: input['allServers'],
      password: input['password'],
      role: input['role'],
      serverIds: (input['allServers']) ? [] : input['serverIds'],
      username: input['username'].trim(),
    },
    method: 'POST',
  },
);

/**
 * API - Updates user.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const updateUser = async (userId: string, input: Web_Api_UpdateUserInput): Promise<Web_Api_User> => requestJSON(
  `/api/v1/users/${encodeURIComponent(userId)}`,
  userSchema,
  {
    body: {
      allServers: input['allServers'],
      enabled: input['enabled'],
      role: input['role'],
      serverIds: (input['allServers']) ? [] : input['serverIds'],
    },
    method: 'PUT',
  },
);

/**
 * API - Reset user password.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const resetUserPassword = async (userId: string, password: string): Promise<void> => requestVoid(
  `/api/v1/users/${encodeURIComponent(userId)}/password`,
  {
    body: { password },
    method: 'POST',
  },
);

/**
 * API - Reset user two factor.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const resetUserTwoFactor = async (userId: string): Promise<void> => requestVoid(
  `/api/v1/users/${encodeURIComponent(userId)}/two-factor/reset`,
  { method: 'POST' },
);

/**
 * API - Deletes user.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const deleteUser = async (userId: string): Promise<void> => requestVoid(
  `/api/v1/users/${encodeURIComponent(userId)}`,
  { method: 'DELETE' },
);

/**
 * API - Gets invite page.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const getInvitePage = async (serverId: string): Promise<Web_Api_InvitePageResponse> => requestJSON(
  serverPath(serverId, '/invite-page'),
  invitePageResponseSchema,
);

/**
 * API - Save invite page.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const saveInvitePage = async (serverId: string, input: Web_Api_InvitePageInput): Promise<Web_Api_InvitePage> => {
  const response: unknown = await requestJSON(
    serverPath(serverId, '/invite-page'),
    z.unknown(),
    {
      body: input,
      method: 'PUT',
    },
  );
  const wrapped = invitePageResponseSchema.safeParse(response);

  return (wrapped.success) ? wrapped.data['page'] : invitePageSchema.parse(response);
};

/**
 * API - Upload invite image.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const uploadInviteImage = async (serverId: string, file: File): Promise<Web_Api_UploadedImage> => requestJSON(
  serverPath(serverId, '/invite-page/images'),
  uploadedImageSchema,
  {
    file,
    method: 'POST',
  },
);
