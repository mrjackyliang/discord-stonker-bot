import { GatewayIntentBits } from 'discord.js';
import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  createCommandData,
  findDuplicateMemberNames,
  prepareServerToolFeatures,
} from './server-tool-features.js';

import type {
  Lib_ServerToolFeatures_CreateCommandData_Returns,
  Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns,
} from '../types/lib/server-tool-features.d.ts';

/**
 * Server Tool Features - Server Tool Runtime.
 *
 * Verifies bounded command admission and duplicate-name decisions without Discord mutations.
 * The tests never register commands or moderate a live server.
 *
 * @since 4.0.0
 */
describe('server tool runtime', () => {
  it('groups normalized duplicate display names deterministically', () => {
    expect(findDuplicateMemberNames([
      {
        displayName: 'Alice',
        identifier: '1',
      },
      {
        displayName: ' alice ',
        identifier: '2',
      },
      {
        displayName: 'Bob',
        identifier: '3',
      },
    ])).toEqual([{
      displayName: 'Alice',
      identifiers: [
        '1',
        '2',
      ],
    }]);

    return;
  });

  it('requests member and voice events for the full valid command set', () => {
    const prepared: Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns = prepareServerToolFeatures({
      features: {
        'server-tools': {
          configuration: {
            'bulk-ban': {
              'allowed-roles': [{
                'role-id': '1209383231867326487',
              }],
            },
            'fetch-duplicates': {
              'allowed-roles': [{
                'role-id': '1209383231867326487',
              }],
            },
            'fetch-emojis': {
              'allowed-roles': [{
                'role-id': '1209383231867326487',
              }],
            },
            'fetch-members': {
              'allowed-roles': [{
                'role-id': '1209383231867326487',
              }],
            },
            'role-manager': {
              'allowed-roles': [{
                'role-id': '1209383231867326487',
              }],
            },
            'voice-tools': {
              'allowed-roles': [{
                'role-id': '1209383231867326487',
              }],
            },
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['server-tools']);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(prepared['intents']).toEqual([
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ]);

    return;
  });

  it('rejects commands without an explicit trusted role', () => {
    const prepared: Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns = prepareServerToolFeatures({
      features: {
        'server-tools': {
          configuration: {
            'bulk-ban': {
              'allowed-roles': [],
            },
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual([]);

    expect(prepared['configurationErrors'][0]).toContain('bulk-ban.allowed-roles');

    return;
  });

  it('places required Discord options before optional options', () => {
    const commands: Lib_ServerToolFeatures_CreateCommandData_Returns = createCommandData({
      tools: {
        'bulk-ban': new Set(['1209383231867326487']),
        'voice-tools': new Set(['1209383231867326487']),
      },
    });

    expect(commands).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'stonker-voice',
        options: [
          expect.objectContaining({
            name: 'action',
            required: true,
          }),
          expect.objectContaining({
            name: 'member',
            required: true,
          }),
          expect.objectContaining({
            name: 'confirm',
            required: true,
          }),
          expect.objectContaining({
            name: 'channel',
            required: false,
          }),
        ],
      }),
      expect.objectContaining({
        name: 'stonker-bulk-ban',
        options: [
          expect.objectContaining({
            name: 'user-ids',
            required: true,
          }),
          expect.objectContaining({
            name: 'confirm',
            required: true,
          }),
          expect.objectContaining({
            name: 'delete-message-seconds',
            required: false,
          }),
        ],
      }),
    ]));

    return;
  });

  return;
});
