import chalk from 'chalk';
import {
  Client,
  Intents,
  Options,
  LimitedCollection,
} from 'discord.js';
import _ from 'lodash';

import config from '../config.json';

import featureMode from './feature';
import { getTextBasedChannel, generateLogMessage, generateServerFailedMessage } from './lib/utilities';
import snitchMode from './snitch';

/**
 * Bot configuration.
 *
 * @since 1.0.0
 */
const configSettingsClientToken = _.get(config, 'settings.client-token');
const configSettingsGuildId = _.get(config, 'settings.guild-id');
const configSettingsLogChannelId = _.get(config, 'settings.log-channel-id');
const configSettingsLogLevel = _.get(config, 'settings.log-level');
const configSettingsMode = _.get(config, 'settings.mode');
const configSettingsBotPrefix = _.get(config, 'settings.bot-prefix');
const configSettingsTimeZone = _.get(config, 'settings.time-zone');

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
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
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
client.on('ready', async () => {
  const guild = client.guilds.cache.get(configSettingsGuildId);
  const logChannel = getTextBasedChannel(guild, configSettingsLogChannelId);

  /**
   * Configuration pre-checks.
   *
   * @since 1.0.0
   */
  if (
    guild === undefined
    || (configSettingsMode !== 'snitch' && configSettingsMode !== 'feature' && configSettingsMode !== 'all')
    || ((configSettingsMode === 'snitch' || configSettingsMode === 'all') && logChannel === undefined)
    || ((configSettingsMode === 'feature' || configSettingsMode === 'all') && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3))
    || (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone))
    || !_.includes([10, 20, 30, 40], configSettingsLogLevel)
  ) {
    if (guild === undefined) {
      generateServerFailedMessage('"settings.guild-id" is not a valid guild or is unavailable');
    }

    if (configSettingsMode !== 'snitch' && configSettingsMode !== 'feature' && configSettingsMode !== 'all') {
      generateServerFailedMessage('"settings.mode" is not configured or is invalid');
    }

    if ((configSettingsMode === 'snitch' || configSettingsMode === 'all') && logChannel === undefined) {
      generateServerFailedMessage('"settings.log-channel-id" is not a valid text-based channel');
    }

    if ((configSettingsMode === 'feature' || configSettingsMode === 'all') && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3)) {
      generateServerFailedMessage('"settings.bot-prefix" is not configured or longer than 3 characters');
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
    if (client.user && (configSettingsMode === 'feature' || configSettingsMode === 'all')) {
      client.user.setStatus('online');
      client.user.setActivity({
        name: `${configSettingsBotPrefix}help | Powered by Discord Stonker Bot`,
        type: 'LISTENING',
      });
    }

    console.log(
      [
        chalk.green('Server is ready!'),
        ...(client.user) ? [`Logged in as @${client.user.tag} under "${configSettingsMode}" mode ...`] : [`Logged in under "${configSettingsMode}" mode ...`],
      ].join(' '),
    );

    console.log(
      [
        guild.name,
        'has',
        chalk.cyan(guild.members.cache.size),
        'member(s) and',
        chalk.cyan(guild.channels.cache.filter((channel) => channel.type !== 'GUILD_CATEGORY').size),
        'channel(s) ...',
      ].join(' '),
    );
  }

  /**
   * Initialize mode.
   *
   * @since 1.0.0
   */
  switch (configSettingsMode) {
    case 'snitch':
      await snitchMode(client, guild, logChannel).catch((error: Error) => generateLogMessage(
        'Failed to execute "snitchMode" function',
        10,
        error,
      ));
      break;
    case 'feature':
      await featureMode(client, guild).catch((error: Error) => generateLogMessage(
        'Failed to execute "featureMode" function',
        10,
        error,
      ));
      break;
    case 'all':
    default:
      await snitchMode(client, guild, logChannel).catch((error: Error) => generateLogMessage(
        'Failed to execute "snitchMode" function',
        10,
        error,
      ));
      await featureMode(client, guild).catch((error: Error) => generateLogMessage(
        'Failed to execute "featureMode" function',
        10,
        error,
      ));
      break;
  }
});

/**
 * Capture signal interruption.
 *
 * @since 1.0.0
 */
process.on('SIGINT', async () => {
  if (client.user && (configSettingsMode === 'feature' || configSettingsMode === 'all')) {
    client.user.setStatus('invisible');
  }

  console.log('Stopping server ...');

  // Kills the process.
  process.exit(0);
});
