import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  changedUserIdentities,
  findMatchingImpersonatorRule,
  normalizeIdentity,
  prepareImpersonatorFeatures,
} from './impersonator-features.js';
import { LIB_REGEX_PATTERN_IMPERSONATOR_MODERATOR } from './regex.js';

import type {
  Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns,
  Lib_ImpersonatorFeatures_Test_Rules,
} from '../types/lib/impersonator-features.d.ts';

/**
 * Impersonator Features - Impersonator Feature Preparation.
 *
 * Verifies identity normalization, trusted accounts, and conditional intents.
 * Invalid expressions remain isolated from the Discord connection.
 *
 * @since 4.0.0
 */
describe('impersonator feature preparation', () => {
  it('keeps member access disabled when impersonator alerts are disabled', () => {
    expect(prepareImpersonatorFeatures({
      features: {
        'impersonator-alerts': {
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

  it('compiles identity expressions and requests only member access', () => {
    const prepared: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns = prepareImpersonatorFeatures({
      features: {
        'impersonator-alerts': {
          configuration: {
            channel: {
              'channel-id': '1209383231867326487',
            },
            entities: [{
              name: 'Moderator impersonation',
              payload: {
                content: 'Review %MEMBER_USER_MENTION%.',
              },
              regex: {
                flags: 'i',
                pattern: '^moderator$',
              },
              user: {
                'user-id': '1197999215838773279',
              },
            }],
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['impersonator-alerts']);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([GatewayIntentBits.GuildMembers]);

    return;
  });

  it('normalizes equivalent names and exempts the configured trusted account', () => {
    const rules: Lib_ImpersonatorFeatures_Test_Rules = [{
      content: 'Review member.',
      name: 'Moderator impersonation',
      regularExpression: new RegExp(LIB_REGEX_PATTERN_IMPERSONATOR_MODERATOR, 'gi'),
      trustedUserIdentifier: '1197999215838773279',
    }];
    const trustedMatch: Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns = findMatchingImpersonatorRule(
      rules,
      'Módérator',
      '1197999215838773279',
    );
    const untrustedMatch: Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns = findMatchingImpersonatorRule(
      rules,
      'Ｍódérator',
      '1209383231867326487',
    );

    expect(normalizeIdentity('Ｍódérator')).toBe('moderator');

    expect(trustedMatch).toBeUndefined();

    expect(untrustedMatch).toMatchObject({
      name: 'Moderator impersonation',
    });

    expect(findMatchingImpersonatorRule(
      rules,
      'Ｍódérator',
      '1209383231867326487',
    )).toMatchObject({
      name: 'Moderator impersonation',
    });

    return;
  });

  it('rechecks a changed global display name even when the username stays the same', () => {
    expect(changedUserIdentities({
      globalName: 'Trusted member',
      username: 'member',
    }, {
      globalName: 'Moderator',
      username: 'member',
    })).toEqual(['Moderator']);

    expect(changedUserIdentities({
      globalName: 'Old name',
      username: 'old-name',
    }, {
      globalName: 'New name',
      username: 'new-name',
    })).toEqual([
      'new-name',
      'New name',
    ]);

    return;
  });

  it('rejects invalid expressions without activating the feature', () => {
    const prepared: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns = prepareImpersonatorFeatures({
      features: {
        'impersonator-alerts': {
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

    expect(prepared['configurationErrors'][0]).toContain('impersonator-alerts');

    return;
  });

  return;
});
