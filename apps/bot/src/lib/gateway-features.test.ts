import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { prepareGatewayFeatures } from './gateway-features.js';

import type { Lib_GatewayFeatures_PrepareGatewayFeatures_Returns } from '../types/lib/gateway-features.d.ts';

/**
 * Gateway Features - Gateway Feature Preparation.
 *
 * Verifies event modules request privileged access only after validation.
 * Invalid feature settings remain isolated from other Gateway capabilities.
 *
 * @since 4.0.0
 */
describe('gateway feature preparation', () => {
  it('keeps optional Gateway intents disabled when every feature is disabled', () => {
    expect(prepareGatewayFeatures({
      features: {
        'role-messages': {
          configuration: [],
          enabled: false,
        },
      },
    })).toMatchObject({
      activeFeatureKeys: [],
      configurationErrors: [],
      intents: [],
    });

    return;
  });

  it('compiles scheduled events, thread reconciliation, and role messages', () => {
    const prepared: Lib_GatewayFeatures_PrepareGatewayFeatures_Returns = prepareGatewayFeatures({
      features: {
        'broadcast-alerts': {
          configuration: [{
            'channel': {
              'channel-id': '1197999049811439729',
            },
            'entity-types': [
              'STAGE_INSTANCE',
              'VOICE',
              'EXTERNAL',
            ],
            'message': 'Event: %EVENT_NAME%',
            'name': 'Event announcement',
            'status': 'SCHEDULED',
          }],
          enabled: true,
        },
        'bump-threads': {
          configuration: [{
            channel: {
              'channel-id': '1197999049811439729',
            },
            name: 'Daily thread',
            thread: {
              'thread-id': '1209383231867326487',
            },
          }],
          enabled: true,
        },
        'role-messages': {
          configuration: [{
            channel: {
              'channel-id': '1197999049811439729',
            },
            direction: 'add',
            name: 'Welcome members',
            payload: {
              content: 'Welcome, %MEMBER_MENTION%!',
              footer: {
                text: 'Community • %YEAR%',
              },
            },
            role: {
              'role-id': '1209383231867326487',
            },
          }],
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual([
      'broadcast-alerts',
      'bump-threads',
      'role-messages',
    ]);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildMembers,
    ]);

    return;
  });

  it('rejects a missing broadcast destination without blocking thread rules', () => {
    const prepared: Lib_GatewayFeatures_PrepareGatewayFeatures_Returns = prepareGatewayFeatures({
      features: {
        'broadcast-alerts': {
          configuration: [{
            'entity-types': ['VOICE'],
            'message': 'Event: %EVENT_NAME%',
            'name': 'Missing destination',
            'status': 'SCHEDULED',
          }],
          enabled: true,
        },
        'bump-threads': {
          configuration: [{
            channel: {
              'channel-id': '1197999049811439729',
            },
            name: 'Daily thread',
            thread: {
              'thread-id': '1209383231867326487',
            },
          }],
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['bump-threads']);

    expect(prepared['configurationErrors']).toHaveLength(1);

    expect(prepared['configurationErrors'][0]).toContain('broadcast-alerts');

    return;
  });

  return;
});
