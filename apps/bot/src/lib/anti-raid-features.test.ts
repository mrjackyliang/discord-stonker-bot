import { EventEmitter } from 'node:events';

import {
  Client,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  findRaidSignals,
  prepareAntiRaidFeatures,
} from './anti-raid-features.js';

import type { Mock } from 'vitest';

import type {
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns,
  Lib_AntiRaidFeatures_Test_Client,
} from '../types/lib/anti-raid-features.d.ts';

/**
 * Anti Raid Features - Guild Identifier.
 *
 * Identifies the invented server the join tests run against.
 * The member and alert channel identifiers are invented as well.
 *
 * @since 4.0.0
 */
const GUILD_IDENTIFIER = '1197999049190674442';

/**
 * Anti Raid Features - Prepare Banning Runtime.
 *
 * Builds an enabled anti-raid feature that bans the username "Discord Support".
 * Each join test registers it on its own client.
 *
 * @returns {Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns}
 *
 * @since 4.0.0
 */
function prepareBanningRuntime(): Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns {
  return prepareAntiRaidFeatures({
    features: {
      'anti-raid': {
        configuration: {
          'auto-ban': {
            channel: {
              'channel-id': '1209383231867326487',
            },
            usernames: [{
              username: 'Discord Support',
            }],
          },
        },
        enabled: true,
      },
    },
  });
}

/**
 * Anti Raid Features - Anti Raid Runtime.
 *
 * Verifies raid fingerprints, automatic bans, and privileged-intent admission.
 * Joins are simulated with stand-in members, so nothing reaches a live Discord server.
 *
 * @since 4.0.0
 */
describe('anti raid runtime', () => {
  it('bans a joining member who matches and reports the ban', async () => {
    const client: Lib_AntiRaidFeatures_Test_Client = new Client({
      intents: [],
    });
    const ban: Mock = vi.fn();
    const send: Mock = vi.fn();
    const fetchChannel: Mock = vi.fn();

    ban.mockResolvedValue(undefined);

    fetchChannel.mockResolvedValue({
      isSendable: () => true,
      send,
    });

    prepareBanningRuntime().register(client, GUILD_IDENTIFIER);

    EventEmitter.prototype.emit.call(client, Events.GuildMemberAdd, {
      ban,
      displayName: 'Discord Support',
      guild: {
        channels: {
          fetch: fetchChannel,
        },
        id: GUILD_IDENTIFIER,
      },
      id: '1182746392018374656',
      user: {
        avatar: null,
        bot: false,
        username: 'discord support',
      },
    });

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(1);

      return;
    });

    expect(ban).toHaveBeenCalledWith({
      reason: 'Anti-raid: configured username',
    });

    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('Banned a joining member who matched anti-raid signals.'),
    }));

    client.destroy();

    return;
  });

  it('reports a ban that Discord refuses', async () => {
    const client: Lib_AntiRaidFeatures_Test_Client = new Client({
      intents: [],
    });
    const ban: Mock = vi.fn();
    const send: Mock = vi.fn();
    const fetchChannel: Mock = vi.fn();

    ban.mockRejectedValue(new Error('Missing Permissions'));

    fetchChannel.mockResolvedValue({
      isSendable: () => true,
      send,
    });

    prepareBanningRuntime().register(client, GUILD_IDENTIFIER);

    EventEmitter.prototype.emit.call(client, Events.GuildMemberAdd, {
      ban,
      displayName: 'Discord Support',
      guild: {
        channels: {
          fetch: fetchChannel,
        },
        id: GUILD_IDENTIFIER,
      },
      id: '1182746392018374656',
      user: {
        avatar: null,
        bot: false,
        username: 'discord support',
      },
    });

    await vi.waitFor(() => {
      expect(send).toHaveBeenCalledTimes(1);

      return;
    });

    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('Couldn\'t ban a joining member who matched anti-raid signals.'),
    }));

    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('Error: Missing Permissions'),
    }));

    client.destroy();

    return;
  });

  it('leaves members who match nothing alone', async () => {
    const client: Lib_AntiRaidFeatures_Test_Client = new Client({
      intents: [],
    });
    const ban: Mock = vi.fn();
    const fetchChannel: Mock = vi.fn();

    prepareBanningRuntime().register(client, GUILD_IDENTIFIER);

    EventEmitter.prototype.emit.call(client, Events.GuildMemberAdd, {
      ban,
      displayName: 'Regular Member',
      guild: {
        channels: {
          fetch: fetchChannel,
        },
        id: GUILD_IDENTIFIER,
      },
      id: '1182746392018374657',
      user: {
        avatar: null,
        bot: false,
        username: 'regular member',
      },
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 50);

      return;
    });

    expect(ban).not.toHaveBeenCalled();

    expect(fetchChannel).not.toHaveBeenCalled();

    client.destroy();

    return;
  });

  it('finds configured raid signals', () => {
    expect(findRaidSignals(
      'known-avatar',
      'Discord Support',
      'Discord Support',
      {
        alertChannelIdentifier: '1209383231867326487',
        avatarHashes: new Set(['known-avatar']),
        membershipGate: undefined,
        usernames: new Set(['discord support']),
      },
    )).toEqual([
      'known avatar fingerprint',
      'configured username',
    ]);

    return;
  });

  it('requests member events only for valid enabled configuration', () => {
    const prepared: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns = prepareAntiRaidFeatures({
      features: {
        'anti-raid': {
          configuration: {
            'auto-ban': {
              channel: {
                'channel-id': '1209383231867326487',
              },
              usernames: [{
                username: 'Discord Support',
              }],
            },
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['anti-raid']);

    expect(prepared['intents']).toEqual([GatewayIntentBits.GuildMembers]);

    return;
  });

  it('rejects the legacy automatic-ban shape until an alert channel is chosen', () => {
    const prepared: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns = prepareAntiRaidFeatures({
      features: {
        'anti-raid': {
          configuration: {
            'auto-ban': {
              usernames: [{
                username: 'Discord Support',
              }],
            },
          },
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual([]);

    expect(prepared['configurationErrors'][0]).toContain('auto-ban.channel');

    return;
  });

  return;
});
