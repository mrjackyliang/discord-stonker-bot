import chalk from 'chalk';
import {
  Client,
  Intents,
  LimitedCollection,
  Options,
} from 'discord.js';
import _ from 'lodash';

import config from '../config.json';

import initialize from './modules';
import { generateServerFailedMessage } from './lib/utilities';

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
      sweepFilter: LimitedCollection.filterByLifetime({
        lifetime: 2592000,
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
client.login(configSettingsClientToken).catch((error: Error) => {
  generateServerFailedMessage(error.message.replace(/\.$/, ''));

  // Kills the process with error.
  process.exit(1);
});

/**
 * Client ready.
 *
 * @since 1.0.0
 */
client.on('ready', () => {
  const guild = client.guilds.cache.get(configSettingsGuildId);

  /**
   * Configuration pre-checks.
   *
   * @since 1.0.0
   */
  if (
    guild === undefined
    || (configSettingsBotPrefix && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3))
    || (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone))
    || !_.includes([10, 20, 30, 40], configSettingsLogLevel)
  ) {
    if (guild === undefined) {
      generateServerFailedMessage('"settings.guild-id" is not a valid guild or is unavailable');
    }

    if (configSettingsBotPrefix && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3)) {
      generateServerFailedMessage('"settings.bot-prefix" is not a string, is empty, or longer than 3 characters');
    }

    if (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone)) {
      generateServerFailedMessage('"settings.time-zone" is not configured');
    }

    if (!_.includes([10, 20, 30, 40], configSettingsLogLevel)) {
      generateServerFailedMessage('"settings.log-level" is not configured or is invalid');
    }

    // Kills the process with error.
    process.exit(1);
  } else {
    if (client.user && _.isString(configSettingsBotPrefix) && !_.isEmpty(configSettingsBotPrefix)) {
      client.user.setStatus('online');
      client.user.setActivity({
        name: `${configSettingsBotPrefix}help-menu | Powered by Discord Stonker Bot`,
        type: 'LISTENING',
      });
    }

    console.log(
      [
        chalk.green('Server is ready!'),
        ...(client.user) ? [`Logged in as @${client.user.tag} ...`] : ['Logged in as unknown user ...'],
      ].join(' '),
    );

    console.log(
      [
        guild.name,
        'has',
        chalk.cyan(guild.members.cache.size),
        'member(s),',
        chalk.cyan(guild.channels.cache.filter((channel) => (channel.isText() || channel.isVoice()) && !channel.isThread()).size),
        'channel(s), and',
        chalk.cyan(guild.channels.cache.filter((channel) => channel.isThread()).size),
        'active thread(s) ...',
      ].join(' '),
    );
  }

  /**
   * Initialize.
   *
   * @since 1.0.0
   */
  initialize(client, guild);
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

  console.log('Stopping server ...');

  // Kills the process.
  process.exit(0);
});
