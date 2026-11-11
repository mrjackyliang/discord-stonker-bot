import type {
  Lib_FeatureCatalog_FeatureCatalog,
  Lib_FeatureCatalog_GetFeatureCatalog_Returns,
  Lib_FeatureCatalog_GetFeatureDefinition_FeatureDefinition,
  Lib_FeatureCatalog_GetFeatureDefinition_FeatureKey,
  Lib_FeatureCatalog_GetFeatureDefinition_Returns,
  Lib_FeatureCatalog_IsFeatureKey_FeatureDefinition,
  Lib_FeatureCatalog_IsFeatureKey_Value,
} from '../types/lib/feature-catalog.d.ts';

/**
 * Feature Catalog - Feature Catalog.
 *
 * Records every legacy top-level capability as an independently managed unit.
 * Runtime status stays explicit so imported configuration cannot imply parity.
 *
 * @since 4.0.0
 */
const featureCatalog: Lib_FeatureCatalog_FeatureCatalog = [
  {
    category: 'safety',
    description: 'Ban known raid accounts on join and give screened members their roles.',
    key: 'anti-raid',
    legacyCapabilityCount: 2,
    name: 'Anti-raid',
    status: 'ported',
  },
  {
    category: 'community',
    description: 'Reply to matching member messages with configured responses.',
    key: 'auto-replies',
    legacyCapabilityCount: 1,
    name: 'Auto replies',
    status: 'ported',
  },
  {
    category: 'community',
    description: 'Announce Discord scheduled-event lifecycle changes.',
    key: 'broadcast-alerts',
    legacyCapabilityCount: 1,
    name: 'Event broadcasts',
    status: 'ported',
  },
  {
    category: 'automation',
    description: 'Keep selected active threads discoverable.',
    key: 'bump-threads',
    legacyCapabilityCount: 1,
    name: 'Thread bumping',
    status: 'ported',
  },
  {
    category: 'safety',
    description: 'Alert moderators when configured suspicious phrases appear.',
    key: 'detect-suspicious-words',
    legacyCapabilityCount: 1,
    name: 'Suspicious words',
    status: 'ported',
  },
  {
    category: 'safety',
    description: 'Detect names that may impersonate trusted identities.',
    key: 'impersonator-alerts',
    legacyCapabilityCount: 1,
    name: 'Impersonator alerts',
    status: 'ported',
  },
  {
    category: 'automation',
    description: 'Copy matching messages to approved destinations.',
    key: 'message-copiers',
    legacyCapabilityCount: 1,
    name: 'Message copiers',
    status: 'ported',
  },
  {
    category: 'automation',
    description: 'Re-publish bot messages through configured webhooks.',
    key: 'message-proxies',
    legacyCapabilityCount: 1,
    name: 'Message proxies',
    status: 'ported',
  },
  {
    category: 'moderation',
    description: 'Apply configurable message policies using regular expressions.',
    key: 'regex-rules',
    legacyCapabilityCount: 1,
    name: 'Regex rules',
    status: 'ported',
  },
  {
    category: 'moderation',
    description: 'Remove configured affiliate tracking content.',
    key: 'remove-affiliates',
    legacyCapabilityCount: 1,
    name: 'Affiliate cleanup',
    status: 'ported',
  },
  {
    category: 'community',
    description: 'Post notifications when members gain or lose selected roles.',
    key: 'role-messages',
    legacyCapabilityCount: 1,
    name: 'Role messages',
    status: 'ported',
  },
  {
    category: 'integrations',
    description: 'Publish new entries from approved RSS feeds.',
    key: 'rss-feeds',
    legacyCapabilityCount: 1,
    name: 'RSS feeds',
    status: 'ported',
  },
  {
    category: 'safety',
    description: 'Alert moderators when known scam patterns are detected.',
    key: 'scammer-alerts',
    legacyCapabilityCount: 1,
    name: 'Scammer alerts',
    status: 'ported',
  },
  {
    category: 'automation',
    description: 'Publish approved messages on a defined schedule.',
    key: 'schedule-posts',
    legacyCapabilityCount: 1,
    name: 'Scheduled posts',
    status: 'ported',
  },
  {
    category: 'moderation',
    description: 'Provide bounded member, role, emoji, duplicate, and voice tools.',
    key: 'server-tools',
    legacyCapabilityCount: 6,
    name: 'Server tools',
    status: 'ported',
  },
  {
    category: 'moderation',
    description: 'Audit member, role, message, link, and attachment activity.',
    key: 'snitch',
    legacyCapabilityCount: 9,
    name: 'Audit notifications',
    status: 'ported',
  },
  {
    category: 'moderation',
    description: 'Keep configured role relationships synchronized.',
    key: 'sync-roles',
    legacyCapabilityCount: 1,
    name: 'Role synchronization',
    status: 'ported',
  },
  {
    category: 'moderation',
    description: 'Apply scheduled channel permission changes.',
    key: 'toggle-perms',
    legacyCapabilityCount: 1,
    name: 'Permission toggles',
    status: 'ported',
  },
  {
    category: 'web',
    description: 'Host verified invite pages and map signed inbound webhooks.',
    key: 'web-applications',
    legacyCapabilityCount: 2,
    name: 'Web applications',
    status: 'ported',
  },
];

/**
 * Feature Catalog - Get Feature Catalog.
 *
 * Returns the ordered operator-facing capability inventory.
 * Callers receive the same immutable source used by migration validation.
 *
 * @returns {Lib_FeatureCatalog_GetFeatureCatalog_Returns}
 *
 * @since 4.0.0
 */
export function getFeatureCatalog(): Lib_FeatureCatalog_GetFeatureCatalog_Returns {
  return featureCatalog;
}

/**
 * Feature Catalog - Get Feature Definition.
 *
 * Resolves a validated key to its immutable catalog entry.
 * Missing entries fail closed instead of inventing feature state.
 *
 * @param {Lib_FeatureCatalog_GetFeatureDefinition_FeatureKey} featureKey - Feature key.
 *
 * @returns {Lib_FeatureCatalog_GetFeatureDefinition_Returns}
 *
 * @since 4.0.0
 */
export function getFeatureDefinition(
  featureKey: Lib_FeatureCatalog_GetFeatureDefinition_FeatureKey,
): Lib_FeatureCatalog_GetFeatureDefinition_Returns {
  const featureDefinition: Lib_FeatureCatalog_GetFeatureDefinition_FeatureDefinition = featureCatalog.find(
    (candidate) => candidate['key'] === featureKey,
  );

  if (featureDefinition === undefined) {
    throw new Error(`Unknown feature key: ${featureKey}`);
  }

  return featureDefinition;
}

/**
 * Feature Catalog - Is Feature Key.
 *
 * Checks operator input against the static feature inventory.
 * Database paths are accepted only after this boundary succeeds.
 *
 * @param {Lib_FeatureCatalog_IsFeatureKey_Value} value - Value.
 *
 * @returns {Lib_FeatureCatalog_IsFeatureKey_Returns}
 *
 * @since 4.0.0
 */
export function isFeatureKey(
  value: Lib_FeatureCatalog_IsFeatureKey_Value,
): value is Lib_FeatureCatalog_GetFeatureDefinition_FeatureKey {
  const featureDefinition: Lib_FeatureCatalog_IsFeatureKey_FeatureDefinition = featureCatalog.find(
    (candidate) => candidate['key'] === value,
  );

  return featureDefinition !== undefined;
}
