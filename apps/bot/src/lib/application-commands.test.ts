import { EventEmitter } from 'node:events';

import {
  Client,
  Events,
} from 'discord.js';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { registerApplicationCommands } from './application-commands.js';

import type { Mock } from 'vitest';

import type { Lib_ApplicationCommands_RegisterApplicationCommands_Client } from '../types/lib/application-commands.d.ts';

/**
 * Application Commands - Application Command Guild Registries.
 *
 * Verifies one Discord client can collect independent command contributions
 * for every configured server before the Gateway becomes ready.
 *
 * @since 4.0.0
 */
describe('application command guild registries', () => {
  it('accepts command contributions for more than one server', () => {
    const client: Lib_ApplicationCommands_RegisterApplicationCommands_Client = new Client({
      intents: [],
    });

    registerApplicationCommands(client, '1197999049190674442', []);

    expect(() => registerApplicationCommands(
      client,
      '1197999049190674443',
      [],
    )).not.toThrow();

    client.destroy();

    return;
  });

  it('synchronizes commands independently for every registered server', async () => {
    const client: Lib_ApplicationCommands_RegisterApplicationCommands_Client = new Client({
      intents: [],
    });
    const setCommands: Mock = vi.fn();
    const fetchGuild: Mock = vi.fn();

    fetchGuild.mockResolvedValue({
      commands: {
        set: setCommands,
      },
    });

    Object.assign(client['guilds'], {
      fetch: fetchGuild,
    });

    registerApplicationCommands(client, '1197999049190674442', []);
    registerApplicationCommands(client, '1197999049190674443', []);

    EventEmitter.prototype.emit.call(client, Events.ClientReady, client);

    await vi.waitFor(() => {
      expect(fetchGuild).toHaveBeenCalledTimes(2);

      return;
    });

    expect(fetchGuild).toHaveBeenNthCalledWith(1, '1197999049190674442');

    expect(fetchGuild).toHaveBeenNthCalledWith(2, '1197999049190674443');

    expect(setCommands).toHaveBeenCalledTimes(2);

    client.destroy();

    return;
  });

  return;
});
