import { z } from 'zod';

import { notificationServices } from '@/web/notification-services.js';
import {
  discordSnowflakePattern,
  featureKeyPattern,
  notificationTargetIdPattern,
  sha256HashPattern,
  tokenIdPattern,
} from '@/web/regex.js';

import type {
  Web_BackupFormat_BackupDocumentSchema,
  Web_BackupFormat_BackupDocumentSchema_Groups,
  Web_BackupFormat_BackupDocumentSchema_Keys,
  Web_BackupFormat_BackupDocumentSchema_NotificationIds,
  Web_BackupFormat_BackupDocumentSchema_NotificationNames,
  Web_BackupFormat_BackupDocumentSchema_ServerIds,
  Web_BackupFormat_BackupDocumentSchema_TokenHashes,
  Web_BackupFormat_BackupDocumentSchema_TokenIds,
  Web_BackupFormat_BackupDocumentSchema_TokenNames,
  Web_BackupFormat_CollectSecretReferences_References,
  Web_BackupFormat_CollectSecretReferences_Returns,
  Web_BackupFormat_CollectSecretReferences_Value,
  Web_BackupFormat_CollectSecretReferences_Visit,
  Web_BackupFormat_CollectSecretReferences_Visit_Candidate,
  Web_BackupFormat_CollectSecretReferences_Visit_Record,
  Web_BackupFormat_CollectSecretReferences_Visit_Returns,
  Web_BackupFormat_FeatureSchema_References,
  Web_BackupFormat_JsonValueSchema,
  Web_BackupFormat_NotificationSchema_PlainKeys,
  Web_BackupFormat_NotificationSchema_SecretKeys,
  Web_BackupFormat_NotificationSchema_Service,
  Web_BackupFormat_ParseBackupDocument_Returns,
  Web_BackupFormat_ParseBackupDocument_Value,
} from '@/types/web/backup-format.d.ts';

/**
 * Backup Format - JSON Value Schema.
 *
 * Accepts only finite JSON-compatible feature configuration.
 * Size bounds keep untrusted uploads practical to validate.
 *
 * @since 4.0.0
 */
const jsonValueSchema: Web_BackupFormat_JsonValueSchema = z.lazy(() => z.union([
  z.null(),
  z.boolean(),
  z.number().finite(),
  z.string().max(262_144),
  z.array(jsonValueSchema).max(10_000),
  z.record(z.string().min(1).max(512), jsonValueSchema),
]));

/**
 * Backup Format - String Map Schema.
 *
 * Bounds portable public settings and plain-text secrets.
 * Nested values are rejected by the record value schema.
 *
 * @since 4.0.0
 */
const stringMapSchema = z.record(z.string().min(1).max(512), z.string().max(32_768));

/**
 * Backup Format - Collect Secret References.
 *
 * Finds every portable secret key referenced by feature configuration.
 * Only explicit $secret objects contribute keys.
 *
 * @param {Web_BackupFormat_CollectSecretReferences_Value} value - Value.
 *
 * @returns {Web_BackupFormat_CollectSecretReferences_Returns}
 *
 * @since 4.0.0
 */
const collectSecretReferences = (value: Web_BackupFormat_CollectSecretReferences_Value): Web_BackupFormat_CollectSecretReferences_Returns => {
  const references: Web_BackupFormat_CollectSecretReferences_References = new Set();

  /**
   * Backup Format - Visit.
   *
   * Walks one nested JSON value and records explicit secret references.
   * Arrays and objects recurse while scalar values stop the walk.
   *
   * @param {Web_BackupFormat_CollectSecretReferences_Visit_Candidate} candidate - Candidate.
   *
   * @returns {Web_BackupFormat_CollectSecretReferences_Visit_Returns}
   *
   * @since 4.0.0
   */
  const visit: Web_BackupFormat_CollectSecretReferences_Visit = (candidate: Web_BackupFormat_CollectSecretReferences_Visit_Candidate): Web_BackupFormat_CollectSecretReferences_Visit_Returns => {
    if (Array.isArray(candidate) === true) {
      candidate.forEach(visit);
      return;
    }
    if (typeof candidate !== 'object' || candidate === null) {
      return;
    }
    const record: Web_BackupFormat_CollectSecretReferences_Visit_Record = candidate as Web_BackupFormat_CollectSecretReferences_Visit_Record;
    if (typeof record['$secret'] === 'string' && record['$secret'] !== '') {
      references.add(record['$secret']);
    }
    Object.values(record).forEach(visit);

    return;
  };

  visit(value);

  return references;
};

/**
 * Backup Format - Feature Schema.
 *
 * Keeps plain-text feature secrets limited to keys used by its configuration.
 * Unreferenced values make the complete file invalid.
 *
 * @since 4.0.0
 */
const featureSchema = z.object({
  configuration: jsonValueSchema,
  enabled: z.boolean(),
  key: z.string().regex(new RegExp(featureKeyPattern, 'u')),
  secrets: stringMapSchema,
}).strict().superRefine((feature, context) => {
  const references: Web_BackupFormat_FeatureSchema_References = collectSecretReferences(feature['configuration']);

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
});

/**
 * Backup Format - Notification Schema.
 *
 * Restricts targets to services, events, and fields supported by this console.
 * Public and secret values stay in their respective maps.
 *
 * @since 4.0.0
 */
const notificationSchema = z.object({
  events: z.array(z.enum([
    'secrets-removed',
    'sign-in-locked',
    'bot-sign-in-failed',
    'bot-disconnected',
    'bot-reconnected',
    'job-failed',
  ])).min(1).max(6).refine((events) => new Set(events).size === events.length),
  id: z.string().regex(new RegExp(notificationTargetIdPattern, 'u')),
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
}).strict().superRefine((notification, context) => {
  const service: Web_BackupFormat_NotificationSchema_Service = notificationServices.find((definition) => definition['key'] === notification['service']);
  if (service === undefined) {
    return;
  }
  const plainKeys: Web_BackupFormat_NotificationSchema_PlainKeys = new Set(service['fields'].filter((field) => field['secret'] === false).map((field) => field['key']));
  const secretKeys: Web_BackupFormat_NotificationSchema_SecretKeys = new Set(service['fields'].filter((field) => field['secret']).map((field) => field['key']));

  for (const key of Object.keys(notification['settings'])) {
    if (plainKeys.has(key) === false) {
      context.addIssue({
        code: 'custom',
        message: 'The file has an unsupported notification setting.',
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
        message: 'The file has an unsupported notification secret.',
        path: [
          'secrets',
          key,
        ],
      });
    }
  }

  return;
});

/**
 * Backup Format - Backup Document Schema.
 *
 * Mirrors the server's strict version-one portable contract.
 * Unknown keys and duplicate identities are rejected.
 *
 * @since 4.0.0
 */
export const backupDocumentSchema: Web_BackupFormat_BackupDocumentSchema = z.object({
  accessTokens: z.array(z.object({
    expiresAt: z.iso.datetime({ offset: true }).nullable(),
    id: z.string().regex(new RegExp(tokenIdPattern, 'u')),
    name: z.string().trim().min(1).max(80),
    scopes: z.array(z.enum([
      'bot:control',
      'features:read',
      'features:write',
      'logs:read',
    ])).min(1).max(4).refine((scopes) => new Set(scopes).size === scopes.length),
    tokenHash: z.string().regex(new RegExp(sha256HashPattern, 'u')),
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
    serverId: z.string().regex(new RegExp(discordSnowflakePattern, 'u')),
    timeZone: z.string().trim().min(1).max(100),
  }).strict()).max(1000).optional(),
  format: z.literal('discord-stonker-bot-export'),
  notifications: z.array(notificationSchema).max(1000).optional(),
  version: z.literal(1),
}).strict().superRefine((document, context) => {
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
  if (
    document['connection'] !== undefined
    && document['connection']['desiredState'] === 'running'
    && document['connection']['botToken'] === null
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
  const serverIds: Web_BackupFormat_BackupDocumentSchema_ServerIds = (document['features'] ?? []).map((server) => server['serverId']);
  const notificationIds: Web_BackupFormat_BackupDocumentSchema_NotificationIds = (document['notifications'] ?? []).map((notification) => notification['id']);
  const notificationNames: Web_BackupFormat_BackupDocumentSchema_NotificationNames = (document['notifications'] ?? []).map((notification) => notification['name'].toLocaleLowerCase());
  const tokenIds: Web_BackupFormat_BackupDocumentSchema_TokenIds = (document['accessTokens'] ?? []).map((token) => token['id']);
  const tokenNames: Web_BackupFormat_BackupDocumentSchema_TokenNames = (document['accessTokens'] ?? []).map((token) => token['name'].toLocaleLowerCase());
  const tokenHashes: Web_BackupFormat_BackupDocumentSchema_TokenHashes = (document['accessTokens'] ?? []).map((token) => token['tokenHash']);
  const groups: Web_BackupFormat_BackupDocumentSchema_Groups = [
    serverIds,
    notificationIds,
    notificationNames,
    tokenIds,
    tokenNames,
    tokenHashes,
  ];

  if (groups.some((values) => new Set(values).size !== values.length) === true) {
    context.addIssue({
      code: 'custom',
      message: 'The export contains duplicate servers, targets, or tokens.',
    });
  }

  for (const server of document['features'] ?? []) {
    const keys: Web_BackupFormat_BackupDocumentSchema_Keys = server['features'].map((feature) => feature['key']);
    if (new Set(keys).size !== keys.length) {
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
});

/**
 * Backup Format - Parse Backup Document.
 *
 * Converts untrusted file JSON to the strict portable shape.
 * The wizard never sends the original unvalidated value.
 *
 * @param {Web_BackupFormat_ParseBackupDocument_Value} value - Value.
 *
 * @returns {Web_BackupFormat_ParseBackupDocument_Returns}
 *
 * @since 4.0.0
 */
export const parseBackupDocument = (value: Web_BackupFormat_ParseBackupDocument_Value): Web_BackupFormat_ParseBackupDocument_Returns => backupDocumentSchema.parse(value);
