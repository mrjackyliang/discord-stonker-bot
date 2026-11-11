import { readFileSync } from 'node:fs';

import {
  describe,
  expect,
  it,
} from 'vitest';

import { prepareAntiRaidFeatures } from './anti-raid-features.js';
import { prepareAuditFeatures } from './audit-features.js';
import { getFeatureState } from './feature-state.js';
import { prepareGatewayFeatures } from './gateway-features.js';
import { prepareImpersonatorFeatures } from './impersonator-features.js';
import { importLegacyConfiguration } from './legacy-import.js';
import { prepareMessageFeatures } from './message-features.js';
import { prepareMessageRoutingFeatures } from './message-routing-features.js';
import { prepareRoleSyncFeatures } from './role-sync-features.js';
import { prepareScammerFeatures } from './scammer-features.js';
import { prepareServerToolFeatures } from './server-tool-features.js';
import { prepareWebApplicationFeatures } from './web-application-features.js';
import { prepareWorkerFeatures } from './worker-features.js';

import type { Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns } from '../types/lib/anti-raid-features.d.ts';
import type { Lib_AuditFeatures_PrepareAuditFeatures_Returns } from '../types/lib/audit-features.d.ts';
import type { Lib_FeatureState_FeatureState } from '../types/lib/feature-state.d.ts';
import type { Lib_GatewayFeatures_PrepareGatewayFeatures_Returns } from '../types/lib/gateway-features.d.ts';
import type { Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns } from '../types/lib/impersonator-features.d.ts';
import type {
  Lib_LegacyImport_ImportLegacyConfiguration_Returns,
  Lib_LegacyImport_Test_StagedFeatureKeys,
} from '../types/lib/legacy-import.d.ts';
import type { Lib_MessageFeatures_PrepareMessageFeatures_Returns } from '../types/lib/message-features.d.ts';
import type {
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns,
  Lib_MessageRoutingFeatures_Test_SecretValues,
} from '../types/lib/message-routing-features.d.ts';
import type { Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns } from '../types/lib/role-sync-features.d.ts';
import type { Lib_ScammerFeatures_PrepareScammerFeatures_Returns } from '../types/lib/scammer-features.d.ts';
import type { Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns } from '../types/lib/server-tool-features.d.ts';
import type { Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns } from '../types/lib/web-application-features.d.ts';
import type { Lib_WorkerFeatures_PrepareWorkerFeatures_Returns } from '../types/lib/worker-features.d.ts';

/**
 * Legacy Import - Legacy Import Boundaries.
 *
 * Verifies feature discovery, secret extraction, and disabled-by-default upgrade
 * behavior without database or Discord state.
 *
 * @since 4.0.0
 */
describe('legacy import boundaries', () => {
  it('imports recognized feature groups and extracts credentials', () => {
    const result: Lib_LegacyImport_ImportLegacyConfiguration_Returns = importLegacyConfiguration(
      JSON.stringify({
        'auto-replies': [{
          name: 'Hello',
        }],
        'settings': {
          discord: {
            guild: {
              'guild-id': '1197999049190674442',
            },
            token: 'legacy-discord-token',
          },
          twitter: {
            'api-key': 'twitter-key',
          },
        },
      }),
      false,
      new Date('2026-10-22T12:00:00.000Z'),
    );

    expect(result['guildIdentifier']).toBe('1197999049190674442');

    expect(result['discordToken']).toBe('legacy-discord-token');

    expect(result['report']['recognizedFeatureKeys']).toEqual(['auto-replies']);

    expect(result['report']['enabledFeatureKeys']).toEqual([]);

    expect(result['report']['secretCount']).toBe(1);

    expect(JSON.stringify(result['settings'])).not.toContain('legacy-discord-token');

    expect(JSON.stringify(result['settings'])).not.toContain('twitter-key');

    expect(result['report']['warnings']).toContain(
      'Twitter/X keys were skipped and not stored, since the bot no longer supports Twitter/X.',
    );

    expect(result['report']['warnings']).not.toContain('Imported features stay off until you turn them on.');

    expect(result['settings']).toMatchObject({
      features: {
        'auto-replies': {
          enabled: false,
        },
      },
      migration: {
        importedAt: '2026-10-22T12:00:00.000Z',
        source: 'legacy-config.json',
      },
      schemaVersion: 1,
    });

    return;
  });

  it('removes retired Twitter behavior while preserving Discord copier destinations', () => {
    const result: Lib_LegacyImport_ImportLegacyConfiguration_Returns = importLegacyConfiguration(
      JSON.stringify({
        'message-copiers': [
          {
            destinations: [
              {
                channel: {
                  'channel-id': '1197999049811439729',
                },
                method: 'discord-channel',
              },
              {
                method: 'twitter-account',
              },
            ],
            name: 'Mixed destinations',
            regex: {
              flags: 'i',
              pattern: '^announcement$',
            },
          },
          {
            destinations: [{
              method: 'twitter-account',
            }],
            name: 'Retired destination only',
          },
        ],
        'settings': {
          twitter: {
            'access-token': 'retired-access-token',
            'api-key': 'retired-api-key',
          },
        },
        'twitter-feeds': [
          {
            'channel': {
              'channel-id': 'destination-channel-id',
            },
            'exclude-replies': true,
            'exclude-retweets': true,
            'name': 'Community news',
            'payload': {
              content: [
                '%TWEET_TEXT%',
                '%TWEET_LINK%',
              ].join('\n'),
            },
            'twitter-id': 'source-account-id',
          },
          {
            name: 'Incomplete feed',
          },
        ],
      }),
      true,
      new Date('2026-10-22T12:00:00.000Z'),
    );

    expect(result['report']['recognizedFeatureKeys']).toEqual(['message-copiers']);

    expect(result['report']['secretCount']).toBe(0);

    expect(result['settings']).toMatchObject({
      core: {},
      features: {
        'message-copiers': {
          configuration: [{
            destinations: [{
              channel: {
                'channel-id': '1197999049811439729',
              },
              method: 'discord-channel',
            }],
            name: 'Mixed destinations',
          }],
          enabled: true,
        },
      },
    });

    expect(JSON.stringify(result)).not.toContain('retired-api-key');

    expect(JSON.stringify(result)).not.toContain('retired-access-token');

    expect(JSON.stringify(result['settings'])).not.toContain('twitter-account');

    expect(JSON.stringify(result['settings'])).not.toContain('%TWEET_');

    expect(result['report']['warnings'].join(' ')).toContain(
      'Twitter/X feeds were skipped, since the bot no longer supports Twitter/X.',
    );

    expect(result['report']['warnings'].join(' ')).toContain(
      'that only posted to Twitter/X.',
    );

    return;
  });

  it('enables runtime-ready modules while ignoring removed X settings', () => {
    const result: Lib_LegacyImport_ImportLegacyConfiguration_Returns = importLegacyConfiguration(
      JSON.stringify({
        'auto-replies': [{
          name: 'Ready',
          payloads: [{
            content: 'Ready',
          }],
          regex: {
            flags: 'i',
            pattern: '^ready$',
          },
        }],
        'x-feeds': {
          name: 'Pending',
        },
      }),
      true,
      new Date('2026-10-22T12:00:00.000Z'),
    );

    expect(result['settings']).toMatchObject({
      features: {
        'auto-replies': {
          enabled: true,
        },
      },
    });

    expect(result['report']['enabledFeatureKeys']).toEqual(['auto-replies']);

    expect(result['report']['invalidFeatureKeys']).toEqual([]);

    expect(result['report']['warnings'].join(' ')).toContain(
      'Twitter/X feeds were skipped, since the bot no longer supports Twitter/X.',
    );

    expect(result['report']['warnings']).not.toContain('Imported features stay off until you turn them on.');

    return;
  });

  it('imports the migration rehearsal fixture into runnable Gateway modules', () => {
    const result: Lib_LegacyImport_ImportLegacyConfiguration_Returns = importLegacyConfiguration(
      readFileSync(new URL('../../examples/legacy-config.e2e.json', import.meta.url), 'utf8'),
      true,
      new Date('2026-10-22T12:00:00.000Z'),
    );
    const antiRaidPrepared: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns = prepareAntiRaidFeatures(
      result['settings'],
    );
    const auditPrepared: Lib_AuditFeatures_PrepareAuditFeatures_Returns = prepareAuditFeatures(
      result['settings'],
    );
    const gatewayPrepared: Lib_GatewayFeatures_PrepareGatewayFeatures_Returns = prepareGatewayFeatures(
      result['settings'],
    );
    const impersonatorPrepared: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns = prepareImpersonatorFeatures(
      result['settings'],
    );
    const messagePrepared: Lib_MessageFeatures_PrepareMessageFeatures_Returns = prepareMessageFeatures(
      result['settings'],
    );
    const secretValues: Lib_MessageRoutingFeatures_Test_SecretValues = Object.fromEntries(
      result['secrets'].map((secret) => [
        secret['key'],
        secret['value'],
      ]),
    );
    const messageRoutingPrepared: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns = prepareMessageRoutingFeatures(
      result['settings'],
      (key) => secretValues[key],
    );
    const roleSyncPrepared: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns = prepareRoleSyncFeatures(
      result['settings'],
    );
    const scammerPrepared: Lib_ScammerFeatures_PrepareScammerFeatures_Returns = prepareScammerFeatures(
      result['settings'],
    );
    const serverToolPrepared: Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns = prepareServerToolFeatures(
      result['settings'],
    );
    const webApplicationPrepared: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns = prepareWebApplicationFeatures(
      result['settings'],
      (key) => secretValues[key],
    );
    const workerPrepared: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures(result['settings']);

    expect(antiRaidPrepared['activeFeatureKeys']).toEqual(['anti-raid']);

    expect(antiRaidPrepared['configurationErrors']).toEqual([]);

    expect(auditPrepared['activeFeatureKeys']).toEqual(['snitch']);

    expect(auditPrepared['configurationErrors']).toEqual([]);

    expect(gatewayPrepared['activeFeatureKeys']).toEqual([
      'broadcast-alerts',
      'bump-threads',
      'role-messages',
    ]);

    expect(gatewayPrepared['configurationErrors']).toEqual([]);

    expect(impersonatorPrepared['activeFeatureKeys']).toEqual(['impersonator-alerts']);

    expect(impersonatorPrepared['configurationErrors']).toEqual([]);

    expect(messagePrepared['activeFeatureKeys']).toEqual([
      'remove-affiliates',
      'auto-replies',
      'regex-rules',
      'detect-suspicious-words',
    ]);

    expect(messagePrepared['configurationErrors']).toEqual([]);

    expect(messageRoutingPrepared['activeFeatureKeys']).toEqual([
      'message-copiers',
      'message-proxies',
    ]);

    expect(messageRoutingPrepared['configurationErrors']).toEqual([]);

    expect(roleSyncPrepared['activeFeatureKeys']).toEqual(['sync-roles']);

    expect(roleSyncPrepared['configurationErrors']).toEqual([]);

    expect(scammerPrepared['activeFeatureKeys']).toEqual(['scammer-alerts']);

    expect(scammerPrepared['configurationErrors']).toEqual([]);

    expect(serverToolPrepared['activeFeatureKeys']).toEqual(['server-tools']);

    expect(serverToolPrepared['configurationErrors']).toEqual([]);

    expect(webApplicationPrepared['activeFeatureKeys']).toEqual(['web-applications']);

    expect(webApplicationPrepared['configurationErrors']).toEqual([]);

    expect(workerPrepared['activeFeatureKeys']).toEqual([
      'toggle-perms',
      'rss-feeds',
      'schedule-posts',
    ]);

    expect(workerPrepared['configurationErrors']).toEqual([]);

    return;
  });

  it('stages the untouched v3.4.3 sample', () => {
    const result: Lib_LegacyImport_ImportLegacyConfiguration_Returns = importLegacyConfiguration(
      readFileSync(new URL('../../../../assets/legacy/config-sample.json', import.meta.url), 'utf8'),
      true,
      new Date('2026-10-22T12:00:00.000Z'),
    );
    const stagedFeatureKeys: Lib_LegacyImport_Test_StagedFeatureKeys = [
      'anti-raid',
      'broadcast-alerts',
      'sync-roles',
      'toggle-perms',
      'web-applications',
    ];

    for (const featureKey of stagedFeatureKeys) {
      const featureState: Lib_FeatureState_FeatureState = getFeatureState(
        result['settings'],
        featureKey,
      );

      if (featureState === undefined) {
        throw new Error(`Expected ${featureKey} to be imported.`);
      }

      expect(featureState['enabled']).toBe(false);
    }

    expect(result['report']['invalidFeatureKeys']).toContain('anti-raid');

    expect(result['report']['enabledFeatureKeys']).not.toContain('anti-raid');

    expect(result['settings']['features']).not.toHaveProperty('api-fetch');

    expect(result['report']['warnings']).toContain('Market data (api-fetch) was skipped, since the bot no longer supports market data.');

    expect(result['report']['unknownSections']).not.toContain('api-fetch');

    expect(result).not.toHaveProperty('template');

    return;
  });

  return;
});
