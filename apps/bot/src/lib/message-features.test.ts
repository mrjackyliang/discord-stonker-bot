import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  prepareMessageFeatures,
  truncateContent,
} from './message-features.js';

import type {
  Lib_MessageFeatures_PrepareMessageFeatures_Returns,
  Lib_MessageFeatures_Test_TruncatedContent,
} from '../types/lib/message-features.d.ts';

/**
 * Message Features - Message Feature Preparation.
 *
 * Verifies imported modules request privileged access only after validation.
 * Invalid feature settings remain isolated from other Gateway capabilities.
 *
 * @since 4.0.0
 */
describe('message feature preparation', () => {
  it('bounds complete moderation alert descriptions to Discord\'s embed limit', () => {
    const content: Lib_MessageFeatures_Test_TruncatedContent = truncateContent('x'.repeat(5_000), 4_096);

    expect(content).toHaveLength(4_096);

    expect(content.endsWith('…')).toBe(true);

    return;
  });

  it('keeps message content access disabled when every feature is disabled', () => {
    expect(prepareMessageFeatures({
      features: {
        'auto-replies': {
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

  it('compiles the first four migrated message modules', () => {
    const prepared: Lib_MessageFeatures_PrepareMessageFeatures_Returns = prepareMessageFeatures({
      features: {
        'auto-replies': {
          configuration: [{
            channels: [{
              'channel-id': '1197999049190674442',
            }],
            name: 'Greeting',
            payloads: [{
              content: 'Hello!',
            }],
            regex: {
              flags: 'i',
              pattern: '^hello$',
            },
            reply: true,
          }],
          enabled: true,
        },
        'detect-suspicious-words': {
          configuration: {
            categories: [{
              category: 'Recruitment scam',
              words: ['paid task'],
            }],
            channel: {
              'channel-id': '1197999049190674442',
            },
          },
          enabled: true,
        },
        'regex-rules': {
          configuration: [{
            match: true,
            name: 'Blocked phrase',
            regex: {
              flags: 'i',
              pattern: 'blocked',
            },
          }],
          enabled: true,
        },
        'remove-affiliates': {
          configuration: {
            platforms: [{
              platform: 'Example',
              regex: {
                flags: 'i',
                pattern: 'ref=',
              },
            }],
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual([
      'remove-affiliates',
      'auto-replies',
      'regex-rules',
      'detect-suspicious-words',
    ]);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]);

    return;
  });

  it('rejects one invalid module without blocking another valid module', () => {
    const prepared: Lib_MessageFeatures_PrepareMessageFeatures_Returns = prepareMessageFeatures({
      features: {
        'auto-replies': {
          configuration: [{
            name: 'Broken expression',
            payloads: [{
              content: 'Never sent',
            }],
            regex: {
              pattern: '(',
            },
          }],
          enabled: true,
        },
        'regex-rules': {
          configuration: [{
            match: true,
            name: 'Valid rule',
            regex: {
              pattern: 'blocked',
            },
          }],
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['regex-rules']);

    expect(prepared['configurationErrors']).toHaveLength(1);

    expect(prepared['configurationErrors'][0]).toContain('auto-replies');

    return;
  });

  return;
});
