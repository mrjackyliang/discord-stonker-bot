import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  isValidDiscordWebhookUrl,
  prepareMessageRoutingFeatures,
} from './message-routing-features.js';

import type {
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns,
  Lib_MessageRoutingFeatures_Test_CreateSecretResolver_Returns,
  Lib_MessageRoutingFeatures_Test_CreateSecretResolver_SecretValues,
  Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Key,
  Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Returns,
  Lib_MessageRoutingFeatures_Test_SecretValues,
} from '../types/lib/message-routing-features.d.ts';

/**
 * Message Routing Features - Create Secret Resolver.
 *
 * Creates the same narrow lookup contract used by the Gateway bootstrap.
 * Test values remain inert and never contact their example endpoints.
 *
 * @param {Lib_MessageRoutingFeatures_Test_CreateSecretResolver_SecretValues} secretValues - Secret values.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_Test_CreateSecretResolver_Returns}
 *
 * @since 4.0.0
 */
function createSecretResolver(
  secretValues: Lib_MessageRoutingFeatures_Test_CreateSecretResolver_SecretValues,
): Lib_MessageRoutingFeatures_Test_CreateSecretResolver_Returns {
  return (key) => secretValues[key];
}

/**
 * Message Routing Features - Resolve No Secret.
 *
 * Models an installation without imported integration credentials.
 * Missing lookups let failure-isolation behavior run deterministically.
 *
 * @param {Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Key} _key - Key.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Returns}
 *
 * @since 4.0.0
 */
function resolveNoSecret(
  _key: Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Key,
): Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Returns {
  return undefined;
}

/**
 * Message Routing Features - Message Routing Feature Preparation.
 *
 * Verifies encrypted destinations, isolated failures, and conditional intents.
 * Ordinary tests never contact Discord channels or webhook endpoints.
 *
 * @since 4.0.0
 */
describe('message routing feature preparation', () => {
  it('keeps message access disabled when routing features are disabled', () => {
    expect(prepareMessageRoutingFeatures({
      features: {
        'message-copiers': {
          configuration: [],
          enabled: false,
        },
        'message-proxies': {
          configuration: [],
          enabled: false,
        },
      },
    }, resolveNoSecret)).toMatchObject({
      activeFeatureKeys: [],
      configurationErrors: [],
      intents: [],
    });

    return;
  });

  it('compiles channel and encrypted webhook routes', () => {
    const secretValues: Lib_MessageRoutingFeatures_Test_SecretValues = {
      'copier-webhook': 'https://discord.com/api/webhooks/1197999215838773279/copier-token',
      'proxy-webhook': 'https://discord.com/api/webhooks/1209383231867326487/proxy-token',
    };
    const prepared: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns = prepareMessageRoutingFeatures({
      features: {
        'message-copiers': {
          configuration: [{
            'allowed-channels': [{
              'channel-id': '1209383231867326487',
            }],
            'destinations': [
              {
                channel: {
                  'channel-id': '1197999049811439729',
                },
                method: 'discord-channel',
              },
              {
                method: 'discord-webhook',
                webhook: {
                  url: {
                    $secret: 'copier-webhook',
                  },
                  username: 'News desk',
                },
              },
            ],
            'include-attachments': true,
            'message': [
              '%MESSAGE_CONTENT%',
              '%MESSAGE_URL%',
            ].join('\n'),
            'name': 'Reviewed alerts',
            'regex': {
              flags: 'i',
              pattern: '^announcement',
            },
          }],
          enabled: true,
        },
        'message-proxies': {
          configuration: [{
            channel: {
              'channel-id': '1209383231867326487',
            },
            name: 'Approved bot announcements',
            replacements: [{
              'flags': 'i',
              'pattern': '^approved: ',
              'replace-with': '',
            }],
            webhook: {
              'webhook-url': {
                $secret: 'proxy-webhook',
              },
            },
          }],
          enabled: true,
        },
      },
    }, createSecretResolver(secretValues));

    expect(prepared['activeFeatureKeys']).toEqual([
      'message-copiers',
      'message-proxies',
    ]);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]);

    return;
  });

  it('isolates a missing proxy secret from a channel-only copier', () => {
    const prepared: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns = prepareMessageRoutingFeatures({
      features: {
        'message-copiers': {
          configuration: [{
            destinations: [{
              channel: {
                'channel-id': '1197999049811439729',
              },
              method: 'discord-channel',
            }],
            name: 'Channel copy',
            regex: {
              pattern: 'alert',
            },
          }],
          enabled: true,
        },
        'message-proxies': {
          configuration: [{
            channel: {
              'channel-id': '1209383231867326487',
            },
            name: 'Missing secret',
            webhook: {
              'webhook-url': {
                $secret: 'missing-webhook',
              },
            },
          }],
          enabled: true,
        },
      },
    }, resolveNoSecret);

    expect(prepared['activeFeatureKeys']).toEqual(['message-copiers']);

    expect(prepared['configurationErrors']).toHaveLength(1);

    expect(prepared['configurationErrors'][0]).toContain('message-proxies');

    return;
  });

  it('accepts only canonical Discord webhook URLs', () => {
    expect(isValidDiscordWebhookUrl(
      'https://discord.com/api/webhooks/1197999215838773279/example-token',
    )).toBe(true);

    expect(isValidDiscordWebhookUrl(
      'https://discord.com.evil.example/api/webhooks/1197999215838773279/example-token',
    )).toBe(false);

    expect(isValidDiscordWebhookUrl(
      'https://discord.com/api/webhooks/1197999215838773279/example-token?wait=true',
    )).toBe(false);

    return;
  });

  return;
});
