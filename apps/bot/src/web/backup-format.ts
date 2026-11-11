import { z } from 'zod';

import { notificationServices } from '@/web/notification-services.js';

import type { Web_Api_Schema } from '@/types/web/api.d.ts';
import type { Web_Backup_Document } from '@/types/web/backup.d.ts';

/**
 * Backup Format - JSON value schema.
 *
 * Accepts only finite JSON-compatible feature configuration.
 * Size bounds keep untrusted uploads practical to validate.
 *
 * @since UNRELEASED
 */
const jsonValueSchema: z.ZodType<unknown> = z.lazy(() => z.union([
  z.null(),
  z.boolean(),
  z.number().finite(),
  z.string().max(262_144),
  z.array(jsonValueSchema).max(10_000),
  z.record(z.string().min(1).max(512), jsonValueSchema),
]));

/**
 * Backup Format - String map schema.
 *
 * Bounds portable public settings and plain-text secrets.
 * Nested values are rejected by the record value schema.
 *
 * @since UNRELEASED
 */
const stringMapSchema = z.record(z.string().min(1).max(512), z.string().max(32_768));

/**
 * Backup Format - Collect secret references.
 *
 * Finds every portable secret key referenced by feature configuration.
 * Only explicit $secret objects contribute keys.
 *
 * @param {unknown} value - Value.
 *
 * @returns {Set<string>}
 *
 * @since UNRELEASED
 */
const collectSecretReferences = (value: unknown): Set<string> => {
  const references: Set<string> = new Set();
  /**
   * Backup Format - Collect secret references - Visit.
   *
   * Walks one nested JSON value and records explicit secret references.
   * Arrays and objects recurse while scalar values stop the walk.
   *
   * @param {unknown} candidate - Candidate.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const visit = (candidate: unknown): void => {
    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }
    if (typeof candidate !== 'object' || candidate === null) {
      return;
    }
    const record: Record<string, unknown> = candidate as Record<string, unknown>;
    if (typeof record['$secret'] === 'string' && record['$secret'] !== '') {
      references.add(record['$secret']);
    }
    Object.values(record).forEach(visit);
  };
  visit(value);
  return references;
};

/**
 * Backup Format - Feature schema.
 *
 * Keeps plain-text feature secrets limited to keys used by its configuration.
 * Unreferenced values make the complete file invalid.
 *
 * @since UNRELEASED
 */
const featureSchema = z.object({
  configuration: jsonValueSchema,
  enabled: z.boolean(),
  key: z.string().regex(/^[a-z][a-z0-9-]{0,99}$/u),
  secrets: stringMapSchema,
}).strict().superRefine((feature, context): void => {
  const references: Set<string> = collectSecretReferences(feature['configuration']);
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
});

/**
 * Backup Format - Notification schema.
 *
 * Restricts targets to services, events, and fields supported by this console.
 * Public and secret values stay in their respective maps.
 *
 * @since UNRELEASED
 */
const notificationSchema = z.object({
  events: z.array(z.enum([
    'secrets-removed',
    'sign-in-locked',
    'bot-sign-in-failed',
    'bot-disconnected',
    'bot-reconnected',
    'job-failed',
  ])).min(1).max(6).refine((events): boolean => new Set(events).size === events.length),
  id: z.string().regex(/^ntf-[0-9a-f]{16}$/u),
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
}).strict().superRefine((notification, context): void => {
  const service = notificationServices.find((definition): boolean => definition['key'] === notification['service']);
  if (service === undefined) {
    return;
  }
  const plainKeys: Set<string> = new Set(service['fields'].filter((field): boolean => field['secret'] === false).map((field): string => field['key']));
  const secretKeys: Set<string> = new Set(service['fields'].filter((field): boolean => field['secret']).map((field): string => field['key']));
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
});

/**
 * Backup Format - Document schema.
 *
 * Mirrors the server's strict version-one portable contract.
 * Unknown keys and duplicate identities are rejected.
 *
 * @since UNRELEASED
 */
export const backupDocumentSchema: Web_Api_Schema<Web_Backup_Document> = z.object({
  accessTokens: z.array(z.object({
    expiresAt: z.iso.datetime({ offset: true }).nullable(),
    id: z.string().regex(/^tok-[0-9a-f]{16}$/u),
    name: z.string().trim().min(1).max(80),
    scopes: z.array(z.enum([
      'bot:control',
      'features:read',
      'features:write',
      'logs:read',
    ])).min(1).max(4).refine((scopes): boolean => new Set(scopes).size === scopes.length),
    tokenHash: z.string().regex(/^[0-9a-f]{64}$/u),
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
    serverId: z.string().regex(/^[0-9]{17,20}$/u),
    timeZone: z.string().trim().min(1).max(100),
  }).strict()).max(1000).optional(),
  format: z.literal('discord-stonker-bot-export'),
  notifications: z.array(notificationSchema).max(1000).optional(),
  version: z.literal(1),
}).strict().superRefine((document, context): void => {
  if (document['connection'] === undefined && document['features'] === undefined && document['notifications'] === undefined && document['accessTokens'] === undefined) {
    context.addIssue({
      code: 'custom',
      message: 'The export does not contain any sections.',
    });
  }
  if (document['connection']?.['desiredState'] === 'running' && document['connection']['botToken'] === null) {
    context.addIssue({
      code: 'custom',
      message: 'A running connection needs a Bot Token.',
      path: [
        'connection',
        'botToken',
      ],
    });
  }
  const serverIds: string[] = (document['features'] ?? []).map((server): string => server['serverId']);
  const notificationIds: string[] = (document['notifications'] ?? []).map((notification): string => notification['id']);
  const notificationNames: string[] = (document['notifications'] ?? []).map((notification): string => notification['name'].toLocaleLowerCase());
  const tokenIds: string[] = (document['accessTokens'] ?? []).map((token): string => token['id']);
  const tokenNames: string[] = (document['accessTokens'] ?? []).map((token): string => token['name'].toLocaleLowerCase());
  const tokenHashes: string[] = (document['accessTokens'] ?? []).map((token): string => token['tokenHash']);
  if (new Set(serverIds).size !== serverIds.length || new Set(notificationIds).size !== notificationIds.length || new Set(notificationNames).size !== notificationNames.length || new Set(tokenIds).size !== tokenIds.length || new Set(tokenNames).size !== tokenNames.length || new Set(tokenHashes).size !== tokenHashes.length) {
    context.addIssue({
      code: 'custom',
      message: 'The export contains duplicate servers, targets, or tokens.',
    });
  }
  for (const server of document['features'] ?? []) {
    const keys: string[] = server['features'].map((feature): string => feature['key']);
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
});

/**
 * Backup Format - Parse backup document.
 *
 * Converts untrusted file JSON to the strict portable shape.
 * The wizard never sends the original unvalidated value.
 *
 * @param {unknown} value - Value.
 *
 * @returns {Web_Backup_Document}
 *
 * @since UNRELEASED
 */
export const parseBackupDocument = (value: unknown): Web_Backup_Document => backupDocumentSchema.parse(value);
