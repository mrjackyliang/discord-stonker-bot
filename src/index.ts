import chalk from 'chalk';
import {
  Client,
  Intents,
  Options,
  Sweepers,
} from 'discord.js';
import _ from 'lodash';

import config from '../config.json';

import { initialize } from './modules/initialize';
import { generateServerMessage } from './lib/utilities';

/**
 * Bot configuration.
 *
 * @since 1.0.0
 */
const configSettingsClientToken = _.get(config, 'settings.client-token');
const configSettingsGuildId = _.get(config, 'settings.guild-id');
const configSettingsBotPrefix = _.get(config, 'settings.bot-prefix');
const configSettingsTimeZone = _.get(config, 'settings.time-zone');
const configSettingsLogLevel = _.get(config, 'settings.log-level');

/**
 * Discord client.
 *
 * @since 1.0.0
 */
const client = new Client({
  makeCache: Options.cacheWithLimits({
    MessageManager: {
      sweepFilter: Sweepers.filterByLifetime({
        lifetime: 2592000, // 30 days in seconds.
        getComparisonTimestamp: (message) => message.editedTimestamp ?? message.createdTimestamp,
      }),
      sweepInterval: 60,
    },
  }),
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

/**
 * Client login.
 *
 * @since 1.0.0
 */
client.login(configSettingsClientToken).catch((error) => {
  generateServerMessage(error.message.replace(/\.$/, ''), true, 1);
});

/**
 * Client ready.
 *
 * @since 1.0.0
 */
client.on('ready', async () => {
  try {
    const guild = await client.guilds.fetch(configSettingsGuildId);
    const guildMembers = await guild.members.fetch();
    const guildChannels = await guild.channels.fetch();

    /**
     * Configuration pre-checks.
     *
     * @since 1.0.0
     */
    if (
      (configSettingsBotPrefix && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3))
      || (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone))
      || !_.includes([10, 20, 30, 40], configSettingsLogLevel)
    ) {
      if (configSettingsBotPrefix && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3)) {
        generateServerMessage('"settings.bot-prefix" is not a string, is empty, or longer than 3 characters', true, 1);
      }

      if (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone)) {
        generateServerMessage('"settings.time-zone" is not configured', true, 1);
      }

      if (!_.includes([10, 20, 30, 40], configSettingsLogLevel)) {
        generateServerMessage('"settings.log-level" is not configured or is invalid', true, 1);
      }
    } else {
      if (client.user && _.isString(configSettingsBotPrefix) && !_.isEmpty(configSettingsBotPrefix)) {
        client.user.setStatus('online');
        client.user.setActivity({
          name: `${configSettingsBotPrefix}help-menu | Powered by Discord Stonker Bot`,
          type: 'LISTENING',
        });
      }

      generateServerMessage(
        [
          chalk.green('Server is ready!'),
          ...(client.user) ? [`Logged in as @${client.user.tag}`] : ['Logged in as unknown user'],
        ].join(' '),
        false,
      );

      generateServerMessage(
        [
          guild.name,
          'has',
          _.size([...guildMembers.values()]),
          'member(s) and',
          _.size(_.filter([...guildChannels.values()], (channel) => channel.isText() || channel.isVoice())),
          'channel(s)',
        ].join(' '),
        false,
      );
    }

    /**
     * Initialize.
     *
     * @since 1.0.0
     */
    initialize(client, guild);
  } catch {
    if (!configSettingsGuildId) {
      generateServerMessage('"settings.guild-id" is not configured', true, 1);
    } else {
      generateServerMessage('Failed to access the guild, the members, or channels', true, 1);
    }
  }
});

/**
 * Capture signal interruption.
 *
 * @since 1.0.0
 */
process.on('SIGINT', () => {
  if (client.user && _.isString(configSettingsBotPrefix) && !_.isEmpty(configSettingsBotPrefix)) {
    client.user.setStatus('invisible');
  }

  generateServerMessage('Stopping server', false, 0);
});
