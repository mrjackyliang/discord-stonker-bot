import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getFeatureCatalog } from './feature-catalog.js';
import {
  isFeatureConfigurationValid,
  validateFeatureConfiguration,
} from './feature-configuration-validation.js';

import type {
  Lib_FeatureConfigurationValidation_Test_CreateProxyConfiguration_ChannelId,
  Lib_FeatureConfigurationValidation_Test_CreateProxyConfiguration_Returns,
  Lib_FeatureConfigurationValidation_Test_Issues,
  Lib_FeatureConfigurationValidation_Test_OutputSpy,
  Lib_FeatureConfigurationValidation_Test_ResolveProxySecret_Key,
  Lib_FeatureConfigurationValidation_Test_ResolveProxySecret_Returns,
} from '../types/lib/feature-configuration-validation.d.ts';

/**
 * Feature Configuration Validation - Create Proxy Configuration.
 *
 * Builds one message proxy whose webhook URL is a stored secret reference.
 * The channel ID can be swapped for an invalid one.
 *
 * @param {Lib_FeatureConfigurationValidation_Test_CreateProxyConfiguration_ChannelId} channelId - Channel id.
 *
 * @returns {Lib_FeatureConfigurationValidation_Test_CreateProxyConfiguration_Returns}
 *
 * @since 4.0.0
 */
function createProxyConfiguration(channelId: Lib_FeatureConfigurationValidation_Test_CreateProxyConfiguration_ChannelId): Lib_FeatureConfigurationValidation_Test_CreateProxyConfiguration_Returns {
  return [{
    channel: {
      'channel-id': channelId,
    },
    name: 'Announcements',
    webhook: {
      'webhook-url': {
        $secret: 'proxy-webhook',
      },
    },
  }];
}

/**
 * Feature Configuration Validation - Resolve Proxy Secret.
 *
 * Returns a real-looking Discord webhook URL for the proxy's secret key.
 * Any other key has no value.
 *
 * @param {Lib_FeatureConfigurationValidation_Test_ResolveProxySecret_Key} key - Key.
 *
 * @returns {Lib_FeatureConfigurationValidation_Test_ResolveProxySecret_Returns}
 *
 * @since 4.0.0
 */
function resolveProxySecret(key: Lib_FeatureConfigurationValidation_Test_ResolveProxySecret_Key): Lib_FeatureConfigurationValidation_Test_ResolveProxySecret_Returns {
  if (key !== 'proxy-webhook') {
    return undefined;
  }

  return 'https://discord.com/api/webhooks/1209383231867326487/proxy-token';
}

/**
 * Feature Configuration Validation - Feature Configuration Validation.
 *
 * Checks settings with each feature's schema, then its compiler with real secret values.
 * Every issue path starts with "configuration".
 *
 * @since 4.0.0
 */
describe('feature configuration validation', () => {
  it('reports an issue for an empty configuration of every catalog feature', () => {
    for (const definition of getFeatureCatalog()) {
      const issues: Lib_FeatureConfigurationValidation_Test_Issues = validateFeatureConfiguration(definition['key'], null, () => undefined);

      expect(issues.length).toBeGreaterThan(0);

      for (const issue of issues) {
        expect(issue['path'][0]).toBe('configuration');

        expect(issue['field']).toBe(issue['path'].join('.'));
      }
    }

    return;
  });

  it('accepts a complete feature configuration', () => {
    expect(validateFeatureConfiguration('auto-replies', [{
      channels: [{
        'channel-id': '1197999049190674442',
      }],
      name: 'Greeting',
      payloads: [{
        content: 'Welcome!',
      }],
      regex: {
        flags: 'i',
        pattern: '^hello$',
      },
      reply: true,
    }], () => undefined)).toEqual([]);

    return;
  });

  it('explains schema problems in plain words at the field that has them', () => {
    expect(validateFeatureConfiguration('message-proxies', createProxyConfiguration('general'), () => undefined)).toEqual([{
      field: 'configuration.0.channel.channel-id',
      message: 'Enter a Discord ID (17 to 20 digits).',
      path: [
        'configuration',
        '0',
        'channel',
        'channel-id',
      ],
    }]);

    expect(validateFeatureConfiguration('anti-raid', {
      'auto-ban': {
        usernames: [{
          username: 'Discord Support',
        }],
      },
    }, () => undefined)).toEqual([{
      field: 'configuration.auto-ban.channel',
      message: 'Fill in this section.',
      path: [
        'configuration',
        'auto-ban',
        'channel',
      ],
    }]);

    return;
  });

  it('rejects settings the compiler refuses even when their shape is valid', () => {
    expect(validateFeatureConfiguration('regex-rules', [{
      match: true,
      name: 'Invalid expression',
      regex: {
        flags: 'i',
        pattern: '[',
      },
    }], () => undefined)).toEqual([{
      field: 'configuration.0.regex',
      message: 'Regular expression pattern or flags are invalid.',
      path: [
        'configuration',
        '0',
        'regex',
      ],
    }]);

    return;
  });

  it('compiles with the real secret values', () => {
    expect(validateFeatureConfiguration('message-proxies', createProxyConfiguration('1209383231867326487'), resolveProxySecret)).toEqual([]);

    expect(validateFeatureConfiguration('message-proxies', createProxyConfiguration('1209383231867326487'), () => 'not-a-webhook')).toEqual([{
      field: 'configuration.0.webhook.webhook-url',
      message: 'Enter a Discord webhook URL, starting with https://discord.com/api/webhooks/.',
      path: [
        'configuration',
        '0',
        'webhook',
        'webhook-url',
      ],
    }]);

    return;
  });

  it('keeps the compiler\'s rejection logs out of a settings check', () => {
    const output: Lib_FeatureConfigurationValidation_Test_OutputSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    try {
      expect(validateFeatureConfiguration('message-proxies', createProxyConfiguration('1209383231867326487'), () => 'not-a-webhook')).toHaveLength(1);

      expect(output).not.toHaveBeenCalled();
    } finally {
      output.mockRestore();
    }

    return;
  });

  it('checks only the schema without a secret resolver', () => {
    expect(validateFeatureConfiguration('message-proxies', createProxyConfiguration('1209383231867326487'), undefined)).toEqual([]);

    expect(validateFeatureConfiguration('message-proxies', createProxyConfiguration('general'), undefined)).toHaveLength(1);

    return;
  });

  it('stages legacy imports with a placeholder secret', () => {
    expect(isFeatureConfigurationValid('message-proxies', createProxyConfiguration('1209383231867326487'), () => 'https://discord.com/api/webhooks/1197999215838773279/fixture-token')).toBe(true);

    expect(isFeatureConfigurationValid('message-proxies', createProxyConfiguration('general'), () => 'https://discord.com/api/webhooks/1197999215838773279/fixture-token')).toBe(false);

    return;
  });

  return;
});
