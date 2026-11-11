import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import { LIB_REGEX_PATTERN_SCAMMER_ACCOUNT } from './regex.js';
import {
  findMatchingScammerRule,
  prepareScammerFeatures,
} from './scammer-features.js';

import type {
  Lib_ScammerFeatures_FindMatchingScammerRule_Returns,
  Lib_ScammerFeatures_PrepareScammerFeatures_Returns,
  Lib_ScammerFeatures_Test_Rules,
} from '../types/lib/scammer-features.d.ts';

/**
 * Scammer Features - Scammer Feature Preparation.
 *
 * Verifies bounded message detection and conditional privileged intents.
 * Invalid expressions remain isolated from the Discord connection.
 *
 * @since 4.0.0
 */
describe('scammer feature preparation', () => {
  it('keeps message content access disabled when scammer alerts are disabled', () => {
    expect(prepareScammerFeatures({
      features: {
        'scammer-alerts': {
          configuration: {},
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

  it('compiles scammer expressions and requests only message access', () => {
    const prepared: Lib_ScammerFeatures_PrepareScammerFeatures_Returns = prepareScammerFeatures({
      features: {
        'scammer-alerts': {
          configuration: {
            channel: {
              'channel-id': '1209383231867326487',
            },
            entities: [{
              name: 'Credential recovery',
              payload: {
                content: 'Review %MEMBER_USER_MENTION%.',
              },
              regex: {
                flags: 'gi',
                pattern: 'recover.{0,40}account',
              },
            }],
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['scammer-alerts']);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ]);

    return;
  });

  it('selects only the first rule and resets global expression state', () => {
    const rules: Lib_ScammerFeatures_Test_Rules = [
      {
        content: 'First',
        name: 'First match',
        regularExpression: new RegExp(LIB_REGEX_PATTERN_SCAMMER_ACCOUNT, 'gi'),
      },
      {
        content: 'Second',
        name: 'Second match',
        regularExpression: new RegExp(LIB_REGEX_PATTERN_SCAMMER_ACCOUNT, 'i'),
      },
    ];
    const firstMatch: Lib_ScammerFeatures_FindMatchingScammerRule_Returns = findMatchingScammerRule(
      rules,
      'Recover your account',
    );
    const repeatedMatch: Lib_ScammerFeatures_FindMatchingScammerRule_Returns = findMatchingScammerRule(
      rules,
      'Recover your account',
    );

    expect(firstMatch).toMatchObject({
      name: 'First match',
    });

    expect(repeatedMatch).toMatchObject({
      name: 'First match',
    });

    return;
  });

  it('rejects invalid expressions without activating the feature', () => {
    const prepared: Lib_ScammerFeatures_PrepareScammerFeatures_Returns = prepareScammerFeatures({
      features: {
        'scammer-alerts': {
          configuration: {
            channel: {
              'channel-id': '1209383231867326487',
            },
            entities: [{
              name: 'Broken expression',
              regex: {
                pattern: '(',
              },
            }],
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual([]);

    expect(prepared['configurationErrors']).toHaveLength(1);

    expect(prepared['configurationErrors'][0]).toContain('scammer-alerts');

    return;
  });

  return;
});
