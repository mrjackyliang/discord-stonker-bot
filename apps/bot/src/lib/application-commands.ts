import { Events } from 'discord.js';

import {
  getErrorMessage,
  writeLog,
} from './logger.js';

import type {
  Lib_ApplicationCommands_RegisterApplicationCommands_Client,
  Lib_ApplicationCommands_RegisterApplicationCommands_Commands,
  Lib_ApplicationCommands_RegisterApplicationCommands_GuildCommands,
  Lib_ApplicationCommands_RegisterApplicationCommands_GuildIdentifier,
  Lib_ApplicationCommands_RegisterApplicationCommands_Returns,
  Lib_ApplicationCommands_RegisterApplicationCommands_State,
  Lib_ApplicationCommands_Registries,
  Lib_ApplicationCommands_SynchronizeCommands_Client,
  Lib_ApplicationCommands_SynchronizeCommands_Commands,
  Lib_ApplicationCommands_SynchronizeCommands_Entry,
  Lib_ApplicationCommands_SynchronizeCommands_Guild,
  Lib_ApplicationCommands_SynchronizeCommands_GuildIdentifier,
  Lib_ApplicationCommands_SynchronizeCommands_Returns,
  Lib_ApplicationCommands_SynchronizeCommands_State,
} from '../types/lib/application-commands.d.ts';

/**
 * Application Commands - Registries.
 *
 * Owns one per-server command registry for each Discord client generation.
 * Weak keys allow destroyed clients and their configuration to be collected.
 *
 * @since 4.0.0
 */
const registries: Lib_ApplicationCommands_Registries = new WeakMap();

/**
 * Application Commands - Register Application Commands.
 *
 * Collects feature-owned commands per server before the Gateway becomes ready.
 * One overwrite per server prevents modules from deleting each other's commands.
 *
 * @param {Lib_ApplicationCommands_RegisterApplicationCommands_Client}          client          - Client.
 * @param {Lib_ApplicationCommands_RegisterApplicationCommands_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ApplicationCommands_RegisterApplicationCommands_Commands}        commands        - Commands.
 *
 * @returns {Lib_ApplicationCommands_RegisterApplicationCommands_Returns}
 *
 * @since 4.0.0
 */
export function registerApplicationCommands(
  client: Lib_ApplicationCommands_RegisterApplicationCommands_Client,
  guildIdentifier: Lib_ApplicationCommands_RegisterApplicationCommands_GuildIdentifier,
  commands: Lib_ApplicationCommands_RegisterApplicationCommands_Commands,
): Lib_ApplicationCommands_RegisterApplicationCommands_Returns {
  let state: Lib_ApplicationCommands_RegisterApplicationCommands_State = registries.get(client);

  if (state === undefined) {
    state = {
      guildCommands: new Map(),
    };

    registries.set(client, state);

    client.once(Events.ClientReady, (readyClient) => {
      void synchronizeCommands(readyClient, state as Lib_ApplicationCommands_SynchronizeCommands_State).catch(
        (error) => {
          writeLog('error', 'bot', 'application_command_registration_failed', {
            error: getErrorMessage(error),
          });

          return;
        },
      );

      return;
    });
  }

  let guildCommands: Lib_ApplicationCommands_RegisterApplicationCommands_GuildCommands = state[
    'guildCommands'
  ].get(guildIdentifier);

  if (guildCommands === undefined) {
    guildCommands = [];

    state['guildCommands'].set(guildIdentifier, guildCommands);
  }

  guildCommands.push(...commands);

  return;
}

/**
 * Application Commands - Synchronize Commands.
 *
 * Replaces each configured server's command set with its feature contributions.
 * Disabled features contribute no commands, removing stale definitions on restart.
 *
 * @param {Lib_ApplicationCommands_SynchronizeCommands_Client} client - Client.
 * @param {Lib_ApplicationCommands_SynchronizeCommands_State}  state  - State.
 *
 * @private
 *
 * @returns {Lib_ApplicationCommands_SynchronizeCommands_Returns}
 *
 * @since 4.0.0
 */
async function synchronizeCommands(
  client: Lib_ApplicationCommands_SynchronizeCommands_Client,
  state: Lib_ApplicationCommands_SynchronizeCommands_State,
): Lib_ApplicationCommands_SynchronizeCommands_Returns {
  for (const rawEntry of state['guildCommands']) {
    const entry: Lib_ApplicationCommands_SynchronizeCommands_Entry = rawEntry;
    const guildIdentifier: Lib_ApplicationCommands_SynchronizeCommands_GuildIdentifier = entry[0];
    const commands: Lib_ApplicationCommands_SynchronizeCommands_Commands = entry[1];

    try {
      const guild: Lib_ApplicationCommands_SynchronizeCommands_Guild = await client['guilds'].fetch(
        guildIdentifier,
      );

      await guild['commands'].set(commands);

      writeLog('info', 'bot', 'application_commands_registered', {
        commandCount: commands.length,
        guildIdentifier,
      });
    } catch (error) {
      writeLog('error', 'bot', 'application_command_registration_failed', {
        error: getErrorMessage(error),
        guildIdentifier,
      });
    }
  }

  return;
}
