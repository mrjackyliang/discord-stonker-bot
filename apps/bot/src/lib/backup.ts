import { randomBytes } from 'node:crypto';

import { z } from 'zod';

import { applicationVersion } from './application-metadata.js';
import {
  listNormalizedGuildSettings,
  writeGuildConfiguration,
} from './configuration-database.js';
import {
  decryptDiscordToken,
  decryptSecret,
  encryptDiscordToken,
  encryptSecret,
} from './credential-vault.js';
import {
  getGuildSecrets,
  saveLegacyImport,
} from './database.js';
import {
  getFeatureDefinition,
  isFeatureKey,
} from './feature-catalog.js';
import { collectSecretReferences } from './feature-secrets.js';
import { importLegacyConfiguration } from './legacy-import.js';
import {
  notificationInputSchema,
  notificationServices,
} from './notifications.js';
import {
  LIB_REGEX_PATTERN_BACKUP_FEATURE_KEY,
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_NOTIFICATION_TARGET_ID,
  LIB_REGEX_PATTERN_PANEL_TOKEN_ID,
  LIB_REGEX_PATTERN_SHA256_HASH,
} from './regex.js';
import {
  findWebApplicationPathConflicts,
  forgetWebApplicationRoutes,
} from './web-application-features.js';

import type {
  Lib_Backup_AccessToken,
  Lib_Backup_AccessTokenHashMapper,
  Lib_Backup_AccessTokenIdMapper,
  Lib_Backup_AccessTokenNameMapper,
  Lib_Backup_AccessTokenScopesPredicate,
  Lib_Backup_CountLabel_Count,
  Lib_Backup_CountLabel_Noun,
  Lib_Backup_CountLabel_Returns,
  Lib_Backup_Document,
  Lib_Backup_DocumentRefinement,
  Lib_Backup_DocumentSchema,
  Lib_Backup_EmptySummary_Returns,
  Lib_Backup_FeatureKeyMapper,
  Lib_Backup_FeatureRefinement,
  Lib_Backup_FeatureSchema,
  Lib_Backup_ImportPreview,
  Lib_Backup_ImportSourceSchema,
  Lib_Backup_ImportSummary,
  Lib_Backup_IsRecord_Record,
  Lib_Backup_IsRecord_Value,
  Lib_Backup_JsonValueSchema,
  Lib_Backup_LegacySource,
  Lib_Backup_LegacyWarningLabel_Returns,
  Lib_Backup_LegacyWarningLabel_Warning,
  Lib_Backup_NewNotificationId_Returns,
  Lib_Backup_NewTokenId_Returns,
  Lib_Backup_NonEmptyStringPredicate,
  Lib_Backup_Notification,
  Lib_Backup_NotificationEventKeys,
  Lib_Backup_NotificationEventsPredicate,
  Lib_Backup_NotificationFieldMapper,
  Lib_Backup_NotificationFieldPredicate,
  Lib_Backup_NotificationFields,
  Lib_Backup_NotificationIdMapper,
  Lib_Backup_NotificationNameMapper,
  Lib_Backup_NotificationRefinement,
  Lib_Backup_NotificationSchema,
  Lib_Backup_OptionalConnection,
  Lib_Backup_ParseBackupDocument_Returns,
  Lib_Backup_ParseBackupDocument_Value,
  Lib_Backup_ParsedNotification,
  Lib_Backup_ParseImportSource_Returns,
  Lib_Backup_ParseImportSource_Value,
  Lib_Backup_SecretReferenceMapper,
  Lib_Backup_ServerIdMapper,
  Lib_Backup_Service_AccessTokenPredicate,
  Lib_Backup_Service_Apply_Returns,
  Lib_Backup_Service_Apply_Source,
  Lib_Backup_Service_Apply_UserId,
  Lib_Backup_Service_Ciphertexts,
  Lib_Backup_Service_Client,
  Lib_Backup_Service_Configuration,
  Lib_Backup_Service_ConnectionCiphertext,
  Lib_Backup_Service_Constructor_Context,
  Lib_Backup_Service_Context,
  Lib_Backup_Service_Count,
  Lib_Backup_Service_CreateDocument_Returns,
  Lib_Backup_Service_CreateDocument_Sections,
  Lib_Backup_Service_CreateDocument_UserId,
  Lib_Backup_Service_CurrentHashes,
  Lib_Backup_Service_CurrentNames,
  Lib_Backup_Service_Description,
  Lib_Backup_Service_EncryptedSecrets,
  Lib_Backup_Service_ExistingId,
  Lib_Backup_Service_FeatureCountReducer,
  Lib_Backup_Service_FeatureEntry,
  Lib_Backup_Service_FeatureObject,
  Lib_Backup_Service_FeatureServers,
  Lib_Backup_Service_FeaturesObject,
  Lib_Backup_Service_HasToken,
  Lib_Backup_Service_Identifier,
  Lib_Backup_Service_Ids,
  Lib_Backup_Service_ImportedSections,
  Lib_Backup_Service_LegacyReport,
  Lib_Backup_Service_LegacyResult,
  Lib_Backup_Service_LegacySecretMapper,
  Lib_Backup_Service_LegacySecretPredicate,
  Lib_Backup_Service_NameMap,
  Lib_Backup_Service_NotificationPredicate,
  Lib_Backup_Service_NotificationsResult,
  Lib_Backup_Service_OptionalCiphertext,
  Lib_Backup_Service_PortableFeatures,
  Lib_Backup_Service_Preview_Returns,
  Lib_Backup_Service_Preview_Source,
  Lib_Backup_Service_Preview_UserId,
  Lib_Backup_Service_PreviewLegacy_InvalidFeature,
  Lib_Backup_Service_PreviewLegacy_UnsupportedSection,
  Lib_Backup_Service_PreviewLegacy_WarningItem,
  Lib_Backup_Service_RowNameIdMapper_Returns,
  Lib_Backup_Service_RowResult,
  Lib_Backup_Service_Rows,
  Lib_Backup_Service_RowStringMapper_Returns,
  Lib_Backup_Service_RowStringMapper_Row,
  Lib_Backup_Service_Runtime,
  Lib_Backup_Service_RuntimeResult,
  Lib_Backup_Service_SealedSecrets,
  Lib_Backup_Service_Secrets,
  Lib_Backup_Service_Sections,
  Lib_Backup_Service_SettingsEntries,
  Lib_Backup_Service_SettingsEntry,
  Lib_Backup_Service_StoredSecretMapper,
  Lib_Backup_Service_StoredSecrets,
  Lib_Backup_Service_TokenCiphertext,
  Lib_Backup_Service_TokensResult,
  Lib_Backup_StringList,
  Lib_Backup_StringMapSchema,
  Lib_Backup_StringSet,
} from '../types/lib/backup.d.ts';

export { GrantStore } from './backup-grants.js';

/**
 * Backup - Notification Event Keys.
 *
 * Restricts portable subscriptions to events this application can emit.
 * The tuple also supplies Zod's non-empty enum contract.
 *
 * @since UNRELEASED
 */
const notificationEventKeys: Lib_Backup_NotificationEventKeys = [
  'secrets-removed',
  'sign-in-locked',
  'bot-sign-in-failed',
  'bot-disconnected',
  'bot-reconnected',
  'job-failed',
];

/**
 * Backup - Unique Notification Events.
 *
 * Prevents duplicate subscriptions from entering normalized notification state.
 * Every imported target uses the same named predicate.
 *
 * @returns {boolean}
 *
 * @since UNRELEASED
 */
const uniqueNotificationEvents: Lib_Backup_NotificationEventsPredicate = (events) => new Set(events).size === events.length;

/**
 * Backup - Unique Access Token Scopes.
 *
 * Keeps portable access token scopes compatible with their normalized database rows.
 * Duplicate scopes invalidate the document before apply begins.
 *
 * @returns {boolean}
 *
 * @since UNRELEASED
 */
const uniqueAccessTokenScopes: Lib_Backup_AccessTokenScopesPredicate = (scopes) => new Set(scopes).size === scopes.length;

/**
 * Backup - JSON Value Schema.
 *
 * Accepts only finite, JSON-compatible feature configuration values.
 * Recursive size bounds constrain untrusted uploaded documents.
 *
 * @since UNRELEASED
 */
const jsonValueSchema: Lib_Backup_JsonValueSchema = z.lazy(() => z.union([
  z.null(),
  z.boolean(),
  z.number().finite(),
  z.string().max(262_144),
  z.array(jsonValueSchema).max(10_000),
  z.record(z.string().min(1).max(512), jsonValueSchema),
]));

/**
 * Backup - String Map Schema.
 *
 * Bounds portable settings and plain-text secret maps.
 * Nested values and unbounded field names are rejected.
 *
 * @since UNRELEASED
 */
const stringMapSchema: Lib_Backup_StringMapSchema = z.record(z.string().min(1).max(512), z.string().max(32_768));

/**
 * Backup - Validate Notification.
 *
 * Keeps secret fields separate from ordinary service settings.
 * The established notification validator also checks required values.
 *
 * @returns {void}
 *
 * @since UNRELEASED
 */
const validateNotification: Lib_Backup_NotificationRefinement = (notification, context) => {
  const fields: Lib_Backup_NotificationFields = notificationServices[notification['service']]['fields'];

  /**
   * Backup - Is Plain Field.
   *
   * Identifies service values stored in public settings.
   * Secret fields must never pass this predicate.
   *
   * @returns {boolean}
   *
   * @since UNRELEASED
   */
  const isPlainField: Lib_Backup_NotificationFieldPredicate = (field) => field['secret'] === false;

  /**
   * Backup - Is Secret Field.
   *
   * Identifies values opened only inside the temporary backup document.
   * Public settings must never pass this predicate.
   *
   * @returns {boolean}
   *
   * @since UNRELEASED
   */
  const isSecretField: Lib_Backup_NotificationFieldPredicate = (field) => field['secret'] === true;

  /**
   * Backup - Field Key.
   *
   * Projects one service field into its stable portable map key.
   * Public and secret allowlists use the same projection.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const fieldKey: Lib_Backup_NotificationFieldMapper = (field) => field['key'];
  const plainKeys: Lib_Backup_StringSet = new Set(fields.filter(isPlainField).map(fieldKey));
  const secretKeys: Lib_Backup_StringSet = new Set(fields.filter(isSecretField).map(fieldKey));

  for (const key of Object.keys(notification['settings'])) {
    if (plainKeys.has(key) === false) {
      context.addIssue({
        code: 'custom',
        message: 'The notification has an unsupported setting.',
        path: [
          'settings',
          key,
        ],
      });
    }
  }

  for (const key of Object.keys(notification['secrets'])) {
    if (secretKeys.has(key) === false) {
      context.addIssue({
        code: 'custom',
        message: 'The notification has an unsupported secret.',
        path: [
          'secrets',
          key,
        ],
      });
    }
  }

  const parsed: Lib_Backup_ParsedNotification = notificationInputSchema(notification['service'], notificationEventKeys, [], []).safeParse({
    events: notification['events'],
    name: notification['name'],
    settings: {
      ...notification['settings'],
      ...notification['secrets'],
    },
  });

  if (parsed.success === false) {
    for (const issue of parsed.error.issues) {
      context.addIssue({
        code: 'custom',
        message: issue.message,
        path: issue.path,
      });
    }
  }

  return;
};

/**
 * Backup - Notification Schema.
 *
 * Validates one complete portable notification target.
 * Strict objects reject unrelated fields before service refinement.
 *
 * @since UNRELEASED
 */
const notificationSchema: Lib_Backup_NotificationSchema = z.object({
  events: z.array(z.enum(notificationEventKeys)).min(1).max(notificationEventKeys.length).refine(uniqueNotificationEvents),
  id: z.string().regex(LIB_REGEX_PATTERN_NOTIFICATION_TARGET_ID),
  name: z.string().trim().min(1).max(80),
  secrets: stringMapSchema,
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
  settings: stringMapSchema,
}).strict().superRefine(validateNotification);

/**
 * Backup - Validate Feature.
 *
 * Limits opened feature secrets to keys referenced by the same configuration.
 * Unrelated plaintext values make the complete document invalid.
 *
 * @returns {void}
 *
 * @since UNRELEASED
 */
const validateFeature: Lib_Backup_FeatureRefinement = (feature, context) => {
  /**
   * Backup - Secret Reference Key.
   *
   * Projects one configuration reference into its portable secret key.
   * Empty keys are filtered before membership checks.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const secretReferenceKey: Lib_Backup_SecretReferenceMapper = (reference) => reference['key'];

  /**
   * Backup - Is Non Empty String.
   *
   * Rejects blank secret reference keys from the allowlist.
   * Valid paths remain available for portable secret membership.
   *
   * @returns {boolean}
   *
   * @since UNRELEASED
   */
  const isNonEmptyString: Lib_Backup_NonEmptyStringPredicate = (value) => value !== '';
  const references: Lib_Backup_StringSet = new Set(collectSecretReferences(feature['configuration']).map(secretReferenceKey).filter(isNonEmptyString));

  for (const key of Object.keys(feature['secrets'])) {
    if (references.has(key) === false) {
      context.addIssue({
        code: 'custom',
        message: 'The feature includes a secret it does not reference.',
        path: [
          'secrets',
          key,
        ],
      });
    }
  }

  return;
};

/**
 * Backup - Feature Schema.
 *
 * Keeps one feature's settings and opened secrets together.
 * The refinement rejects secrets unrelated to its configuration.
 *
 * @since UNRELEASED
 */
const featureSchema: Lib_Backup_FeatureSchema = z.object({
  configuration: jsonValueSchema,
  enabled: z.boolean(),
  key: z.string().regex(LIB_REGEX_PATTERN_BACKUP_FEATURE_KEY),
  secrets: stringMapSchema,
}).strict().superRefine(validateFeature);

/**
 * Backup - Validate Document.
 *
 * Requires content and rejects duplicate portable identities before database work.
 * Connection state and per-server feature keys receive cross-field checks here.
 *
 * @returns {void}
 *
 * @since UNRELEASED
 */
const validateDocument: Lib_Backup_DocumentRefinement = (document, context) => {
  if (
    document['connection'] === undefined
    && document['features'] === undefined
    && document['notifications'] === undefined
    && document['accessTokens'] === undefined
  ) {
    context.addIssue({
      code: 'custom',
      message: 'The export does not contain any sections.',
    });
  }

  const connection: Lib_Backup_OptionalConnection = document['connection'];

  if (
    connection !== undefined
    && connection['desiredState'] === 'running'
    && connection['botToken'] === null
  ) {
    context.addIssue({
      code: 'custom',
      message: 'A running connection needs a Bot Token.',
      path: [
        'connection',
        'botToken',
      ],
    });
  }

  /**
   * Backup - Server ID.
   *
   * Projects a portable server section into its stable identifier.
   * Duplicate identifiers would make replacement order ambiguous.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const serverId: Lib_Backup_ServerIdMapper = (server) => server['serverId'];

  /**
   * Backup - Notification ID.
   *
   * Projects one target into its portable identifier.
   * Duplicate IDs are rejected before collision handling.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const notificationId: Lib_Backup_NotificationIdMapper = (notification) => notification['id'];

  /**
   * Backup - Notification Name.
   *
   * Normalizes one target name for case-insensitive duplicate checks.
   * Import uses the same identity when deciding whether to replace.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const notificationName: Lib_Backup_NotificationNameMapper = (notification) => notification['name'].toLocaleLowerCase();

  /**
   * Backup - Access Token ID.
   *
   * Projects one stored token into its portable identifier.
   * Repeated IDs cannot enter transactional collision handling.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const accessTokenId: Lib_Backup_AccessTokenIdMapper = (token) => token['id'];

  /**
   * Backup - Access Token Name.
   *
   * Normalizes token names for the current user's duplicate policy.
   * Case-only duplicates are rejected in the file itself.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const accessTokenName: Lib_Backup_AccessTokenNameMapper = (token) => token['name'].toLocaleLowerCase();

  /**
   * Backup - Access Token Hash.
   *
   * Projects the restorable one-way hash used for duplicate detection.
   * Raw token values never exist in the portable contract.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const accessTokenHash: Lib_Backup_AccessTokenHashMapper = (token) => token['tokenHash'];

  /**
   * Backup - Feature Key.
   *
   * Projects one server's feature entry into its stable catalog key.
   * Repeated keys would make replacement order ambiguous.
   *
   * @returns {string}
   *
   * @since UNRELEASED
   */
  const featureKey: Lib_Backup_FeatureKeyMapper = (feature) => feature['key'];
  const serverIds: Lib_Backup_StringList = (document['features'] ?? []).map(serverId);
  const notificationIds: Lib_Backup_StringList = (document['notifications'] ?? []).map(notificationId);
  const notificationNames: Lib_Backup_StringList = (document['notifications'] ?? []).map(notificationName);
  const tokenIds: Lib_Backup_StringList = (document['accessTokens'] ?? []).map(accessTokenId);
  const tokenNames: Lib_Backup_StringList = (document['accessTokens'] ?? []).map(accessTokenName);
  const tokenHashes: Lib_Backup_StringList = (document['accessTokens'] ?? []).map(accessTokenHash);

  if (
    new Set(serverIds).size !== serverIds.length
      || new Set(notificationIds).size !== notificationIds.length
      || new Set(notificationNames).size !== notificationNames.length
      || new Set(tokenIds).size !== tokenIds.length
      || new Set(tokenNames).size !== tokenNames.length
      || new Set(tokenHashes).size !== tokenHashes.length
  ) {
    context.addIssue({
      code: 'custom',
      message: 'The export contains duplicate servers, targets, or tokens.',
    });
  }

  for (const server of document['features'] ?? []) {
    const featureKeys: Lib_Backup_StringList = server['features'].map(featureKey);

    if (new Set(featureKeys).size !== featureKeys.length) {
      context.addIssue({
        code: 'custom',
        message: 'A server contains duplicate features.',
        path: [
          'features',
          server['serverId'],
        ],
      });
    }
  }

  return;
};

/**
 * Backup - Document Schema.
 *
 * Defines the strict version-one export format at every fixed object boundary.
 * Cross-field and duplicate checks run after nested validation.
 *
 * @since UNRELEASED
 */
export const backupDocumentSchema: Lib_Backup_DocumentSchema = z.object({
  accessTokens: z.array(z.object({
    expiresAt: z.iso.datetime({ offset: true }).nullable(),
    id: z.string().regex(LIB_REGEX_PATTERN_PANEL_TOKEN_ID),
    name: z.string().trim().min(1).max(80),
    scopes: z.array(z.enum([
      'bot:control',
      'features:read',
      'features:write',
      'logs:read',
    ])).min(1).max(4).refine(uniqueAccessTokenScopes),
    tokenHash: z.string().regex(LIB_REGEX_PATTERN_SHA256_HASH),
  }).strict()).max(1000).optional(),
  appVersion: z.string().min(1).max(100),
  connection: z.object({
    botToken: z.string().min(1).max(4096).nullable(),
    desiredState: z.enum([
      'running',
      'stopped',
    ]),
  }).strict().optional(),
  exportedAt: z.iso.datetime({ offset: true }),
  features: z.array(z.object({
    features: z.array(featureSchema).max(1000),
    serverId: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    timeZone: z.string().trim().min(1).max(100),
  }).strict()).max(1000).optional(),
  format: z.literal('discord-stonker-bot-export'),
  notifications: z.array(notificationSchema).max(1000).optional(),
  version: z.literal(1),
}).strict().superRefine(validateDocument);

/**
 * Backup - Import Source Schema.
 *
 * Accepts either a strict export or the text accepted by the older importer.
 * Both preview and apply use this same discriminated contract.
 *
 * @since UNRELEASED
 */
export const backupImportSourceSchema: Lib_Backup_ImportSourceSchema = z.discriminatedUnion('type', [
  z.object({
    document: backupDocumentSchema,
    type: z.literal('export'),
  }).strict(),
  z.object({
    configuration: z.string().min(1).max(750_000),
    enableFeatures: z.boolean().default(false),
    serverId: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    type: z.literal('legacy'),
  }).strict(),
]);

/**
 * Backup - Parse Backup Document.
 *
 * Parses an untrusted export through the complete server contract.
 * Callers receive only normalized version-one values.
 *
 * @param {Lib_Backup_ParseBackupDocument_Value} value - Value.
 *
 * @returns {Lib_Backup_ParseBackupDocument_Returns}
 *
 * @since UNRELEASED
 */
export function parseBackupDocument(value: Lib_Backup_ParseBackupDocument_Value): Lib_Backup_ParseBackupDocument_Returns {
  return backupDocumentSchema.parse(value);
}

/**
 * Backup - Parse Import Source.
 *
 * Parses either supported wizard source before preview or apply.
 * Unknown discriminator fields and object keys are rejected.
 *
 * @param {Lib_Backup_ParseImportSource_Value} value - Value.
 *
 * @returns {Lib_Backup_ParseImportSource_Returns}
 *
 * @since UNRELEASED
 */
export function parseImportSource(value: Lib_Backup_ParseImportSource_Value): Lib_Backup_ParseImportSource_Returns {
  return backupImportSourceSchema.parse(value);
}

/**
 * Backup.
 *
 * Opens selected secrets for export, plans imports, and applies each import atomically.
 * Secret-bearing values remain confined to transient request objects.
 *
 * @since UNRELEASED
 */
export class BackupService {
  /**
   * Backup - Context.
   *
   * Provides database, encryption, and application configuration dependencies.
   * Every operation shares this immutable server context.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #context: Lib_Backup_Service_Context;

  /**
   * Backup - Constructor.
   *
   * Binds portable configuration operations to this process context.
   * No secret-bearing state is retained on the service instance.
   *
   * @param {Lib_Backup_Service_Constructor_Context} context - Context.
   *
   * @since UNRELEASED
   */
  public constructor(context: Lib_Backup_Service_Constructor_Context) {
    this.#context = context;
    return;
  }

  /**
   * Backup - Create Document.
   *
   * Opens only selected configuration and secrets into a short-lived response object.
   * Users, sign-in security, sessions, logs, and runtime Discord data remain excluded.
   *
   * @param {Lib_Backup_Service_CreateDocument_Sections} sections - Sections.
   * @param {Lib_Backup_Service_CreateDocument_UserId}   userId   - User id.
   *
   * @returns {Lib_Backup_Service_CreateDocument_Returns}
   *
   * @since UNRELEASED
   */
  public async createDocument(sections: Lib_Backup_Service_CreateDocument_Sections, userId: Lib_Backup_Service_CreateDocument_UserId): Lib_Backup_Service_CreateDocument_Returns {
    const document: Lib_Backup_Document = {
      appVersion: applicationVersion,
      exportedAt: new Date().toISOString(),
      format: 'discord-stonker-bot-export',
      version: 1,
    };

    if (sections['connection'] === true) {
      const runtimeResult: Lib_Backup_Service_RuntimeResult = await this.#context['pool'].query('SELECT desired_state, discord_token_ciphertext FROM bot_runtime_control WHERE singleton = TRUE');
      const runtime: Lib_Backup_Service_Runtime = runtimeResult.rows[0];
      if (runtime === undefined) {
        throw new Error('The bot connection could not be read.');
      }
      Reflect.set(document, 'connection', {
        botToken: (runtime['discord_token_ciphertext'] === null) ? null : decryptDiscordToken(runtime['discord_token_ciphertext'], this.#context['credentialKey']),
        desiredState: runtime['desired_state'],
      });
    }

    if (sections['features'] === true) {
      const settingsEntries: Lib_Backup_Service_SettingsEntries = await listNormalizedGuildSettings(this.#context['pool']);
      const featureServers: Lib_Backup_Service_FeatureServers = [];

      for (const entry of settingsEntries) {
        const typedEntry: Lib_Backup_Service_SettingsEntry = entry;
        const settings: Lib_Backup_IsRecord_Record = typedEntry['settings'];
        const core: Lib_Backup_IsRecord_Record = (isRecord(settings['core']) === true) ? settings['core'] : {};
        const features: Lib_Backup_Service_FeaturesObject = (isRecord(settings['features']) === true) ? settings['features'] : {};
        const storedSecrets: Lib_Backup_Service_StoredSecrets = await getGuildSecrets(this.#context['pool'], typedEntry['guildIdentifier']);

        /**
         * Backup - Create Document - Stored Secret Entry.
         *
         * Projects one encrypted guild secret into its key and ciphertext pair.
         * The map supports opening only references used by each feature.
         *
         * @returns {[string, string]}
         *
         * @since UNRELEASED
         */
        const storedSecretEntry: Lib_Backup_Service_StoredSecretMapper = (secret) => [
          secret['key'],
          secret['ciphertext'],
        ];
        const ciphertexts: Lib_Backup_Service_Ciphertexts = new Map(storedSecrets.map(storedSecretEntry));
        const portableFeatures: Lib_Backup_Service_PortableFeatures = [];

        for (const entryValue of Object.entries(features)) {
          const featureEntry: Lib_Backup_Service_FeatureEntry = entryValue;
          const feature: Lib_Backup_Service_FeatureObject = (isRecord(featureEntry[1]) === true) ? featureEntry[1] : {};
          const configuration: Lib_Backup_Service_Configuration = feature['configuration'] ?? {};
          const secrets: Lib_Backup_Service_Secrets = {};

          for (const reference of collectSecretReferences(configuration)) {
            const ciphertext: Lib_Backup_Service_OptionalCiphertext = ciphertexts.get(reference['key']);

            if (reference['key'] !== '' && ciphertext !== undefined) {
              Reflect.set(secrets, reference['key'], decryptSecret(ciphertext, `guild-secret:${typedEntry['guildIdentifier']}:${reference['key']}`, this.#context['credentialKey']));
            }
          }

          portableFeatures.push({
            configuration,
            enabled: feature['enabled'] === true,
            key: featureEntry[0],
            secrets,
          });
        }

        featureServers.push({
          features: portableFeatures,
          serverId: typedEntry['guildIdentifier'],
          timeZone: (typeof core['time-zone'] === 'string') ? core['time-zone'] : 'UTC',
        });
      }

      Reflect.set(document, 'features', featureServers);
    }

    if (sections['notifications'] === true) {
      const result: Lib_Backup_Service_NotificationsResult = await this.#context['pool'].query('SELECT id, name, service, events, settings, secrets_ciphertext FROM notification_targets ORDER BY name, id');

      Reflect.set(document, 'notifications', result.rows.map((row): Lib_Backup_Notification => notificationSchema.parse({
        events: row['events'],
        id: row['id'],
        name: row['name'],
        secrets: (row['secrets_ciphertext'] === null) ? {} : JSON.parse(decryptSecret(String(row['secrets_ciphertext']), `notification:${String(row['id'])}`, this.#context['credentialKey'])),
        service: row['service'],
        settings: row['settings'],
      })));
    }

    if (sections['accessTokens'] === true) {
      const result: Lib_Backup_Service_TokensResult = await this.#context['pool'].query('SELECT id, name, token_hash, scopes, expires_at FROM panel_api_tokens WHERE user_id = $1 ORDER BY created_at, id', [userId]);

      Reflect.set(document, 'accessTokens', result.rows.map((row): Lib_Backup_AccessToken => ({
        expiresAt: (row['expires_at'] === null) ? null : new Date(String(row['expires_at'])).toISOString(),
        id: String(row['id']),
        name: String(row['name']),
        scopes: z.array(z.enum([
          'bot:control',
          'features:read',
          'features:write',
          'logs:read',
        ])).parse(row['scopes']),
        tokenHash: String(row['token_hash']),
      })));
    }

    return parseBackupDocument(document);
  }

  /**
   * Backup - Preview.
   *
   * Compares a strict source with current configuration without writing.
   * Human-readable rows drive the shared Settings and Review screens.
   *
   * @param {Lib_Backup_Service_Preview_Source} source - Source.
   * @param {Lib_Backup_Service_Preview_UserId} userId - User id.
   *
   * @returns {Lib_Backup_Service_Preview_Returns}
   *
   * @since UNRELEASED
   */
  public async preview(source: Lib_Backup_Service_Preview_Source, userId: Lib_Backup_Service_Preview_UserId): Lib_Backup_Service_Preview_Returns {
    if (source['type'] === 'legacy') {
      return this.previewLegacy(source);
    }

    const document: Lib_Backup_Document = source['document'];
    const summary: Lib_Backup_ImportSummary = emptySummary();
    const sections: Lib_Backup_Service_Sections = [];
    const runtimeResult: Lib_Backup_Service_RuntimeResult = await this.#context['pool'].query('SELECT desired_state, discord_token_ciphertext FROM bot_runtime_control WHERE singleton = TRUE');
    const runtime: Lib_Backup_Service_Runtime = runtimeResult.rows[0];
    const featureCountRow: Lib_Backup_Service_RowResult = (await this.#context['pool'].query('SELECT COUNT(*)::text AS count FROM guild_features')).rows[0];
    const serverCountRow: Lib_Backup_Service_RowResult = (await this.#context['pool'].query('SELECT COUNT(*)::text AS count FROM guild_profiles')).rows[0];
    const currentFeatureCount: Lib_Backup_Service_Count = Number((featureCountRow === undefined) ? 0 : featureCountRow['count']);
    const currentServerCount: Lib_Backup_Service_Count = Number((serverCountRow === undefined) ? 0 : serverCountRow['count']);
    const currentNotificationRows: Lib_Backup_Service_Rows = (await this.#context['pool'].query('SELECT id, name FROM notification_targets')).rows;
    const currentTokenRows: Lib_Backup_Service_Rows = (await this.#context['pool'].query('SELECT name, token_hash FROM panel_api_tokens WHERE user_id = $1', [userId])).rows;

    if (document['connection'] !== undefined) {
      const currentHasToken: Lib_Backup_Service_HasToken = runtime !== undefined && runtime['discord_token_ciphertext'] !== null;
      const fileState: Lib_Backup_Service_Description = (document['connection']['desiredState'] === 'running') ? 'Running' : 'Stopped';
      const fileToken: Lib_Backup_Service_Description = (document['connection']['botToken'] === null) ? 'no Bot Token' : 'Bot Token set';
      const currentState: Lib_Backup_Service_Description = (runtime !== undefined && runtime['desired_state'] === 'running') ? 'Running' : 'Stopped';
      const currentToken: Lib_Backup_Service_Description = (currentHasToken === true) ? 'Bot Token set' : 'no Bot Token';

      Reflect.set(summary, 'connection', (currentHasToken === true) ? 'replaced' : 'added');

      sections.push({
        file: `${fileState}, ${fileToken}`,
        here: `${currentState}, ${currentToken}`,
        id: 'connection',
        label: 'Connection',
        willImport: true,
      });
    } else {
      sections.push({
        file: 'Not included',
        here: 'Kept as it is',
        id: 'connection',
        label: 'Connection',
        reason: 'This export does not include Connection.',
        willImport: false,
      });
    }

    if (document['features'] !== undefined) {
      /**
       * Backup - Preview - Add Feature Count.
       *
       * Sums portable feature entries across every included server.
       * Features the bot no longer has are left out, since the import skips them.
       *
       * @returns {number}
       *
       * @since UNRELEASED
       */
      const addFeatureCount: Lib_Backup_Service_FeatureCountReducer = (count, server) => count + server['features'].filter((feature) => isFeatureKey(feature['key'])).length;

      Reflect.set(summary, 'features', {
        features: document['features'].reduce(addFeatureCount, 0),
        servers: document['features'].length,
      });

      sections.push({
        file: `${countLabel(summary['features']['features'], 'feature')} for ${countLabel(summary['features']['servers'], 'server')}`,
        here: `${countLabel(currentFeatureCount, 'feature')} for ${countLabel(currentServerCount, 'server')}`,
        id: 'features',
        label: 'Features',
        willImport: true,
      });
    } else {
      sections.push({
        file: 'Not included',
        here: 'Kept as they are',
        id: 'features',
        label: 'Features',
        reason: 'This export does not include Features.',
        willImport: false,
      });
    }

    if (document['notifications'] !== undefined) {
      const names: Lib_Backup_StringSet = new Set(currentNotificationRows.map(rowName));

      /**
       * Backup - Preview - Notification Exists.
       *
       * Applies the same case-insensitive target identity used by import.
       * Matching targets are replaced while new names are added.
       *
       * @returns {boolean}
       *
       * @since UNRELEASED
       */
      const notificationExists: Lib_Backup_Service_NotificationPredicate = (target) => names.has(target['name'].toLocaleLowerCase());

      Reflect.set(summary['notifications'], 'replaced', document['notifications'].filter(notificationExists).length);

      Reflect.set(summary['notifications'], 'added', document['notifications'].length - summary['notifications']['replaced']);

      sections.push({
        file: countLabel(document['notifications'].length, 'notification'),
        here: countLabel(currentNotificationRows.length, 'notification'),
        id: 'notifications',
        label: 'Notifications',
        willImport: true,
      });
    } else {
      sections.push({
        file: 'Not included',
        here: 'Kept as they are',
        id: 'notifications',
        label: 'Notifications',
        reason: 'This export does not include Notifications.',
        willImport: false,
      });
    }

    if (document['accessTokens'] !== undefined) {
      const names: Lib_Backup_StringSet = new Set(currentTokenRows.map(rowName));
      const hashes: Lib_Backup_StringSet = new Set(currentTokenRows.map(rowTokenHash));

      /**
       * Backup - Preview - Access Token Exists.
       *
       * Applies the current user's case-insensitive name and global hash policy.
       * Matching entries remain unchanged during import.
       *
       * @returns {boolean}
       *
       * @since UNRELEASED
       */
      const accessTokenExists: Lib_Backup_Service_AccessTokenPredicate = (token) => names.has(token['name'].toLocaleLowerCase()) || hashes.has(token['tokenHash']);

      Reflect.set(summary['accessTokens'], 'skipped', document['accessTokens'].filter(accessTokenExists).length);

      Reflect.set(summary['accessTokens'], 'added', document['accessTokens'].length - summary['accessTokens']['skipped']);

      sections.push({
        file: countLabel(document['accessTokens'].length, 'access token'),
        here: countLabel(currentTokenRows.length, 'access token'),
        id: 'accessTokens',
        label: 'Access tokens',
        willImport: true,
      });
    } else {
      sections.push({
        file: 'Not included',
        here: 'Kept as they are',
        id: 'accessTokens',
        label: 'Access tokens',
        reason: 'This export does not include Access tokens.',
        willImport: false,
      });
    }

    return {
      appVersion: document['appVersion'],
      excluded: [],
      exportedAt: document['exportedAt'],
      sections,
      source: 'export',
      summary,
    };
  }

  /**
   * Backup - Apply.
   *
   * Applies a reviewed source in one transaction and leaves secrets out of its result.
   * Feature and connection generations activate changes through existing runtime paths.
   *
   * @param {Lib_Backup_Service_Apply_Source} source - Source.
   * @param {Lib_Backup_Service_Apply_UserId} userId - User id.
   *
   * @returns {Lib_Backup_Service_Apply_Returns}
   *
   * @since UNRELEASED
   */
  public async apply(source: Lib_Backup_Service_Apply_Source, userId: Lib_Backup_Service_Apply_UserId): Lib_Backup_Service_Apply_Returns {
    if (source['type'] === 'legacy') {
      return this.applyLegacy(source);
    }

    const preview: Lib_Backup_ImportPreview = await this.preview(source, userId);
    const document: Lib_Backup_Document = source['document'];
    const client: Lib_Backup_Service_Client = await this.#context['pool'].connect();
    const importedSections: Lib_Backup_Service_ImportedSections = [];

    try {
      await client.query('BEGIN');

      if (document['connection'] !== undefined) {
        const ciphertext: Lib_Backup_Service_ConnectionCiphertext = (document['connection']['botToken'] === null) ? null : encryptDiscordToken(document['connection']['botToken'], this.#context['credentialKey']);

        await client.query('UPDATE bot_runtime_control SET desired_state = $1, discord_token_ciphertext = $2, generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE', [
          document['connection']['desiredState'],
          ciphertext,
        ]);

        if (ciphertext === null) {
          await client.query('INSERT INTO removed_secrets (kind) VALUES (\'bot-token\') ON CONFLICT DO NOTHING');
        } else {
          await client.query('DELETE FROM removed_secrets WHERE kind = \'bot-token\'');
        }

        importedSections.push('connection');
      }

      if (document['features'] !== undefined) {
        for (const server of document['features']) {
          const features: Lib_Backup_Service_FeaturesObject = {};

          // Features the bot no longer has, such as market data in an older export, are left out.
          for (const feature of server['features']) {
            if (isFeatureKey(feature['key']) === false) {
              continue;
            }

            Reflect.set(features, feature['key'], {
              configuration: feature['configuration'],
              enabled: feature['enabled'],
            });
          }

          await writeGuildConfiguration(client, server['serverId'], {
            core: { 'time-zone': server['timeZone'] },
            features,
            schemaVersion: 2,
          });

          await client.query('DELETE FROM guild_secrets WHERE guild_id = $1', [server['serverId']]);

          await client.query('DELETE FROM removed_secrets WHERE kind = \'feature-secrets\' AND guild_id = $1', [server['serverId']]);

          const inserted: Lib_Backup_StringSet = new Set();

          for (const feature of server['features']) {
            if (isFeatureKey(feature['key']) === false) {
              continue;
            }

            for (const entry of Object.entries(feature['secrets'])) {
              if (inserted.has(entry[0]) === false) {
                await client.query('INSERT INTO guild_secrets (guild_id, secret_key, ciphertext, updated_at) VALUES ($1, $2, $3, NOW())', [
                  server['serverId'],
                  entry[0],
                  encryptSecret(entry[1], `guild-secret:${server['serverId']}:${entry[0]}`, this.#context['credentialKey']),
                ]);

                inserted.add(entry[0]);
              }
            }
          }
        }

        importedSections.push('features');
      }

      if (document['notifications'] !== undefined) {
        const existingRows: Lib_Backup_Service_Rows = (await client.query('SELECT id, name FROM notification_targets')).rows;
        const ids: Lib_Backup_Service_Ids = new Set(existingRows.map(rowId));
        const byName: Lib_Backup_Service_NameMap = new Map(existingRows.map(rowNameId));

        for (const target of document['notifications']) {
          const existingId: Lib_Backup_Service_ExistingId = byName.get(target['name'].toLocaleLowerCase());
          let id: Lib_Backup_Service_Identifier = existingId ?? target['id'];

          if (existingId === undefined && ids.has(id) === true) {
            id = newNotificationId();
          }

          const sealed: Lib_Backup_Service_SealedSecrets = (Object.keys(target['secrets']).length === 0) ? null : encryptSecret(JSON.stringify(target['secrets']), `notification:${id}`, this.#context['credentialKey']);

          if (existingId === undefined) {
            await client.query('INSERT INTO notification_targets (id, name, service, events, settings, secret_fields, missing_secrets, secrets_ciphertext) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, \'[]\'::jsonb, $7)', [
              id,
              target['name'],
              target['service'],
              JSON.stringify(target['events']),
              JSON.stringify(target['settings']),
              JSON.stringify(Object.keys(target['secrets']).sort()),
              sealed,
            ]);
          } else {
            await client.query('UPDATE notification_targets SET name = $2, service = $3, events = $4::jsonb, settings = $5::jsonb, secret_fields = $6::jsonb, missing_secrets = \'[]\'::jsonb, secrets_ciphertext = $7, updated_at = NOW() WHERE id = $1', [
              id,
              target['name'],
              target['service'],
              JSON.stringify(target['events']),
              JSON.stringify(target['settings']),
              JSON.stringify(Object.keys(target['secrets']).sort()),
              sealed,
            ]);
          }

          await client.query('DELETE FROM removed_secrets WHERE kind = \'notification\' AND notification_id = $1', [id]);

          ids.add(id);

          byName.set(target['name'].toLocaleLowerCase(), id);
        }

        importedSections.push('notifications');
      }

      if (document['accessTokens'] !== undefined) {
        const ownRows: Lib_Backup_Service_Rows = (await client.query('SELECT name, token_hash FROM panel_api_tokens WHERE user_id = $1', [userId])).rows;
        const idRows: Lib_Backup_Service_Rows = (await client.query('SELECT id, token_hash FROM panel_api_tokens')).rows;
        const names: Lib_Backup_Service_CurrentNames = new Set(ownRows.map(rowName));
        const hashes: Lib_Backup_Service_CurrentHashes = new Set(idRows.map(rowTokenHash));
        const ids: Lib_Backup_Service_Ids = new Set(idRows.map(rowId));

        for (const token of document['accessTokens']) {
          if (names.has(token['name'].toLocaleLowerCase()) === true || hashes.has(token['tokenHash']) === true) {
            continue;
          }

          let id: Lib_Backup_Service_Identifier = token['id'];

          if (ids.has(id) === true) {
            id = newTokenId();
          }

          await client.query('INSERT INTO panel_api_tokens (id, user_id, name, token_hash, scopes, expires_at) VALUES ($1, $2, $3, $4, $5, $6)', [
            id,
            userId,
            token['name'],
            token['tokenHash'],
            token['scopes'],
            token['expiresAt'],
          ]);

          names.add(token['name'].toLocaleLowerCase());

          hashes.add(token['tokenHash']);

          ids.add(id);
        }

        importedSections.push('accessTokens');
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    if (document['features'] !== undefined) {
      forgetWebApplicationRoutes(this.#context['pool']);
    }

    return {
      ...preview['summary'],
      importedSections,
    };
  }

  /**
   * Backup - Preview Legacy.
   *
   * Moves the old config.json parser and compatibility report into the shared wizard.
   * Unsupported and invalid legacy sections become excluded rows with reasons.
   *
   * @param {Lib_Backup_LegacySource} source - Source.
   *
   * @private
   *
   * @returns {Lib_Backup_Service_Preview_Returns}
   *
   * @since UNRELEASED
   */
  private async previewLegacy(source: Lib_Backup_LegacySource): Lib_Backup_Service_Preview_Returns {
    const result: Lib_Backup_Service_LegacyResult = importLegacyConfiguration(source['configuration'], source['enableFeatures'], new Date());

    if (result['guildIdentifier'] !== undefined && result['guildIdentifier'] !== source['serverId']) {
      throw new Error('This config.json belongs to another Discord server. Switch to that server first.');
    }

    const conflicts: Lib_Backup_StringList = await findWebApplicationPathConflicts(this.#context['pool'], source['serverId'], result['settings']);

    if (conflicts.length > 0) {
      throw new Error(`Another server already uses ${conflicts[0]}. Choose a unique public path before importing.`);
    }

    const summary: Lib_Backup_ImportSummary = emptySummary();

    Reflect.set(summary, 'connection', (result['discordToken'] === undefined) ? 'skipped' : 'replaced');

    Reflect.set(summary, 'features', {
      features: result['report']['recognizedFeatureKeys'].length,
      servers: 1,
    });

    const sections: Lib_Backup_Service_Sections = [{
      file: `${countLabel(summary['features']['features'], 'feature')} for 1 server`,
      here: 'Current settings for this server',
      id: 'features',
      label: 'Features',
      willImport: true,
    }];

    if (result['discordToken'] !== undefined) {
      sections.unshift({
        file: 'Bot Token set',
        here: 'Current connection',
        id: 'connection',
        label: 'Connection',
        willImport: true,
      });
    }

    /**
     * Backup - Preview Legacy - Invalid Feature.
     *
     * Explains a recognized legacy feature whose settings did not validate.
     * The wizard imports its settings but keeps the feature switched off.
     *
     * @returns {Lib_Backup_ExcludedItem}
     *
     * @since UNRELEASED
     */
    const invalidFeature: Lib_Backup_Service_PreviewLegacy_InvalidFeature = (key) => ({
      id: `needs-attention-${key}`,
      label: getFeatureDefinition(key)['name'],
      reason: 'Imported switched off. Fix its settings on the Features page before turning it on.',
    });

    /**
     * Backup - Preview Legacy - Unsupported Section.
     *
     * Explains one older section that this application does not recognize.
     * The source remains reviewable alongside all supported settings.
     *
     * @returns {Lib_Backup_ExcludedItem}
     *
     * @since UNRELEASED
     */
    const unsupportedSection: Lib_Backup_Service_PreviewLegacy_UnsupportedSection = (key) => ({
      id: `unsupported-${key}`,
      label: key,
      reason: 'This older section is not supported.',
    });

    /**
     * Backup - Preview Legacy - Warning.
     *
     * Preserves skipped compatibility notes with specific operator-facing labels.
     * Stable positional ids distinguish repeated human messages.
     *
     * @returns {Lib_Backup_ExcludedItem}
     *
     * @since UNRELEASED
     */
    const warningItem: Lib_Backup_Service_PreviewLegacy_WarningItem = (warning, index) => ({
      id: `warning-${String(index)}`,
      label: legacyWarningLabel(warning),
      reason: warning,
    });

    return {
      appVersion: null,
      excluded: [
        ...result['report']['unknownSections'].map(unsupportedSection),
        ...result['report']['warnings'].map(warningItem),
      ],
      exportedAt: null,
      legacy: {
        featuresRequiringFixes: result['report']['invalidFeatureKeys'].map(invalidFeature),
        featuresThatTurnOn: result['report']['enabledFeatureKeys'].length,
      },
      sections,
      source: 'legacy',
      summary,
    };
  }

  /**
   * Backup - Apply Legacy.
   *
   * Reuses the established legacy mapping and its single transaction.
   * The compatibility report remains available through the same stored audit record.
   *
   * @param {Lib_Backup_LegacySource} source - Source.
   *
   * @private
   *
   * @returns {Lib_Backup_Service_Apply_Returns}
   *
   * @since UNRELEASED
   */
  private async applyLegacy(source: Lib_Backup_LegacySource): Lib_Backup_Service_Apply_Returns {
    const preview: Lib_Backup_ImportPreview = await this.previewLegacy(source);
    const importedAt: Date = new Date();
    const result: Lib_Backup_Service_LegacyResult = importLegacyConfiguration(source['configuration'], source['enableFeatures'], importedAt);

    /**
     * Backup - Apply Legacy - Portable Secret.
     *
     * Keeps the Discord connection token in its dedicated credential field.
     * All feature secrets continue through the established guild vault.
     *
     * @returns {boolean}
     *
     * @since UNRELEASED
     */
    const isPortableSecret: Lib_Backup_Service_LegacySecretPredicate = (secret) => secret['key'] !== 'settings.discord.token';

    /**
     * Backup - Apply Legacy - Encrypt Secret.
     *
     * Seals one legacy feature secret with its guild-scoped associated data.
     * Plaintext does not enter the audit report.
     *
     * @returns {Lib_Database_SaveLegacyImport_EncryptedSecret}
     *
     * @since UNRELEASED
     */
    const encryptPortableSecret: Lib_Backup_Service_LegacySecretMapper = (secret) => ({
      ciphertext: encryptSecret(secret['value'], `guild-secret:${source['serverId']}:${secret['key']}`, this.#context['credentialKey']),
      key: secret['key'],
    });
    const encryptedSecrets: Lib_Backup_Service_EncryptedSecrets = result['secrets'].filter(isPortableSecret).map(encryptPortableSecret);
    const tokenCiphertext: Lib_Backup_Service_TokenCiphertext = (result['discordToken'] === undefined) ? undefined : encryptDiscordToken(result['discordToken'], this.#context['credentialKey']);
    const report: Lib_Backup_Service_LegacyReport = {
      botTokenImported: tokenCiphertext !== undefined,
      enabled: result['report']['enabledFeatureKeys'],
      imported: result['report']['recognizedFeatureKeys'],
      importedAt: importedAt.toISOString(),
      needsAttention: result['report']['invalidFeatureKeys'],
      secretsImported: encryptedSecrets.length,
      skipped: result['report']['unknownSections'],
      warnings: result['report']['warnings'],
    };

    await saveLegacyImport(this.#context['pool'], source['serverId'], result['settings'], encryptedSecrets, report, tokenCiphertext);

    forgetWebApplicationRoutes(this.#context['pool']);

    const importedSections: Lib_Backup_Service_ImportedSections = ['features'];

    if (tokenCiphertext !== undefined) {
      importedSections.unshift('connection');
    }

    return {
      ...preview['summary'],
      importedSections,
    };
  }
}

/**
 * Backup - Row Name.
 *
 * Projects a database row into its normalized case-insensitive name.
 * Notification and access token comparisons share this behavior.
 *
 * @returns {string}
 *
 * @since UNRELEASED
 */
function rowName(row: Lib_Backup_Service_RowStringMapper_Row): Lib_Backup_Service_RowStringMapper_Returns {
  return String(row['name']).toLocaleLowerCase();
}

/**
 * Backup - Row Token Hash.
 *
 * Projects a token row into its stored one-way hash.
 * Duplicate detection never needs the raw personal access token.
 *
 * @returns {string}
 *
 * @since UNRELEASED
 */
function rowTokenHash(row: Lib_Backup_Service_RowStringMapper_Row): Lib_Backup_Service_RowStringMapper_Returns {
  return String(row['token_hash']);
}

/**
 * Backup - Row ID.
 *
 * Projects a database row into its stable identifier.
 * Collision handling uses the resulting in-memory set.
 *
 * @returns {string}
 *
 * @since UNRELEASED
 */
function rowId(row: Lib_Backup_Service_RowStringMapper_Row): Lib_Backup_Service_RowStringMapper_Returns {
  return String(row['id']);
}

/**
 * Backup - Row Name ID.
 *
 * Projects a target row into its normalized name and stable identifier pair.
 * Notification replacement uses the resulting lookup map.
 *
 * @returns {[string, string]}
 *
 * @since UNRELEASED
 */
function rowNameId(row: Lib_Backup_Service_RowStringMapper_Row): Lib_Backup_Service_RowNameIdMapper_Returns {
  return [
    String(row['name']).toLocaleLowerCase(),
    String(row['id']),
  ];
}

/**
 * Backup - Empty Summary.
 *
 * Starts one import plan with zero changes.
 * Optional sections update their own counts during preview.
 *
 * @returns {Lib_Backup_EmptySummary_Returns}
 *
 * @since UNRELEASED
 */
function emptySummary(): Lib_Backup_EmptySummary_Returns {
  return {
    accessTokens: {
      added: 0,
      skipped: 0,
    },
    connection: 'skipped',
    features: {
      features: 0,
      servers: 0,
    },
    notifications: {
      added: 0,
      replaced: 0,
    },
  };
}

/**
 * Backup - Count Label.
 *
 * Formats a human count with correct singular and plural text.
 * Preview and review copy share the same grammar.
 *
 * @param {Lib_Backup_CountLabel_Count} count - Count.
 * @param {Lib_Backup_CountLabel_Noun}  noun  - Noun.
 *
 * @returns {Lib_Backup_CountLabel_Returns}
 *
 * @since UNRELEASED
 */
function countLabel(count: Lib_Backup_CountLabel_Count, noun: Lib_Backup_CountLabel_Noun): Lib_Backup_CountLabel_Returns {
  const suffix: Lib_Backup_CountLabel_Returns = (count === 1) ? '' : 's';

  return `${String(count)} ${noun}${suffix}`;
}

/**
 * Backup - Is Record.
 *
 * Narrows an unknown JSON value to a plain object.
 * Arrays and null remain outside the accepted record shape.
 *
 * @param {Lib_Backup_IsRecord_Value} value - Value.
 *
 * @returns {Lib_Backup_IsRecord_Returns}
 *
 * @since UNRELEASED
 */
function isRecord(value: Lib_Backup_IsRecord_Value): value is Lib_Backup_IsRecord_Record {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}

/**
 * Backup - Legacy Warning Label.
 *
 * Names each skipped legacy value by what the importer left behind.
 * The Settings step uses these labels instead of repeating a generic note.
 *
 * @param {Lib_Backup_LegacyWarningLabel_Warning} warning - Warning.
 *
 * @returns {Lib_Backup_LegacyWarningLabel_Returns}
 *
 * @since UNRELEASED
 */
function legacyWarningLabel(warning: Lib_Backup_LegacyWarningLabel_Warning): Lib_Backup_LegacyWarningLabel_Returns {
  if (warning.startsWith('Twitter/X keys ') === true) {
    return 'Twitter/X keys';
  }

  if (warning.startsWith('Twitter/X feeds ') === true) {
    return 'Twitter/X feeds';
  }

  if (warning.startsWith('Market data ') === true) {
    return 'Market data';
  }

  if (warning.includes('message-copier destination ') === true) {
    return 'Message copier destination on Twitter/X';
  }

  if (warning.includes('message-copier destinations ') === true) {
    return 'Message copier destinations on Twitter/X';
  }

  if (warning.includes('message-copier rule ') === true) {
    return 'Message copier rule on Twitter/X';
  }

  if (warning.includes('message-copier rules ') === true) {
    return 'Message copier rules on Twitter/X';
  }

  if (warning.startsWith('Unrecognized legacy sections ') === true) {
    return 'Unsupported legacy sections';
  }

  return 'Legacy settings';
}

/**
 * Backup - New Notification ID.
 *
 * Creates an id when a portable id already belongs to another target.
 * Eight random bytes preserve the established notification identifier shape.
 *
 * @returns {Lib_Backup_NewNotificationId_Returns}
 *
 * @since UNRELEASED
 */
function newNotificationId(): Lib_Backup_NewNotificationId_Returns {
  return `ntf-${randomBytes(8).toString('hex')}`;
}

/**
 * Backup - New Token ID.
 *
 * Creates an id when a portable id already belongs to another token.
 * Eight random bytes preserve the established access token identifier shape.
 *
 * @returns {Lib_Backup_NewTokenId_Returns}
 *
 * @since UNRELEASED
 */
function newTokenId(): Lib_Backup_NewTokenId_Returns {
  return `tok-${randomBytes(8).toString('hex')}`;
}
