import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  findExternalLinkHosts,
  prepareAuditFeatures,
  summarizeRoleChanges,
} from './audit-features.js';
import {
  chatPlatformAssetUrlPattern,
  chatPlatformIntents,
} from './chat-platform/index.js';

import type { Lib_AuditFeatures_PrepareAuditFeatures_Returns } from '../types/lib/audit-features.d.ts';

/**
 * Audit Features - Privacy Aware Audit Runtime.
 *
 * Verifies host-only link inspection, role differences, and intent admission.
 * No test stores message bodies or contacts a live Discord server.
 *
 * @since 4.0.0
 */
describe('privacy aware audit runtime', () => {
  it('reports unique external hosts after configured exclusions', () => {
    expect(findExternalLinkHosts(
      'See https://example.com/private?token=hidden and https://cdn.discordapp.com/file.png',
      [new RegExp(chatPlatformAssetUrlPattern, 'i')],
    )).toEqual(['example.com']);

    return;
  });

  it('summarizes deterministic role changes', () => {
    expect(summarizeRoleChanges(
      [
        'everyone',
        'old-role',
      ],
      [
        'everyone',
        'new-role',
      ],
    )).toEqual({
      added: ['new-role'],
      removed: ['old-role'],
    });

    return;
  });

  it('derives member, message, and content intents from enabled routes', () => {
    const prepared: Lib_AuditFeatures_PrepareAuditFeatures_Returns = prepareAuditFeatures({
      features: {
        snitch: {
          configuration: {
            'guild-join': {
              channel: {
                'channel-id': '1209383231867326487',
              },
            },
            'includes-link': {
              channel: {
                'channel-id': '1209383231867326487',
              },
            },
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['snitch']);

    expect(prepared['intents']).toEqual([
      chatPlatformIntents['GuildMembers'],
      chatPlatformIntents['GuildMessages'],
      chatPlatformIntents['MessageContent'],
    ]);

    return;
  });

  return;
});
