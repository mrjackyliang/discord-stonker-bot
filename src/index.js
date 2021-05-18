const chalk = require('chalk');
const Discord = require('discord.js');
const _ = require('lodash');

const config = require('../config.json');

const { featureMode } = require('./feature/index');
const {
  getTextBasedChannel,
  generateLogMessage,
  generateServerFailedMessage,
} = require('./lib/utilities');
const { snitchMode } = require('./snitch/index');

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
const client = new Discord.Client({
  messageCacheMaxSize: Infinity,
  messageCacheLifetime: 2592000, // 30 days.
  messageSweepInterval: 60, // 1 minute.
  messageEditHistoryMaxSize: -1,
  fetchAllMembers: true,
});

/**
 * Client login.
 *
 * @since 1.0.0
 */
client.login(configSettingsClientToken).catch((error) => {
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
    _.isUndefined(guild)
    || _.isUndefined(logChannel)
    || !_.includes([10, 20, 30, 40], configSettingsLogLevel)
    || (!_.includes(['feature', 'snitch', 'all'], configSettingsMode))
    || (configSettingsMode !== 'snitch' && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3))
    || (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone))
  ) {
    if (_.isUndefined(guild)) {
      generateServerFailedMessage('"settings.guild-id" is not a valid guild');
    }

    if (_.isUndefined(logChannel)) {
      generateServerFailedMessage('"settings.log-channel-id" is not a valid text-based channel');
    }

    if (!_.includes([10, 20, 30, 40], configSettingsLogLevel)) {
      generateServerFailedMessage('"settings.log-level" is not configured or is invalid');
    }

    if (!_.includes(['feature', 'snitch', 'all'], configSettingsMode)) {
      generateServerFailedMessage('"settings.mode" is not configured or is invalid');
    }

    if (configSettingsMode !== 'snitch' && (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3)) {
      generateServerFailedMessage('"settings.bot-prefix" is not configured or longer than 3 characters');
    }

    if (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone)) {
      generateServerFailedMessage('"settings.time-zone" is not configured');
    }

    // Kills the process with error.
    process.exit(1);
  } else {
    if (configSettingsMode !== 'snitch') {
      await client.user.setStatus('online').catch((error) => generateLogMessage(
        'Failed to set user status to "online"',
        10,
        error,
      ));

      await client.user.setActivity(
        `${configSettingsBotPrefix}help | Powered by Discord Stonker Bot`,
        { type: 'LISTENING' },
      ).catch((error) => generateLogMessage(
        'Failed to set user activity',
        10,
        error,
      ));
    }

    console.log(
      [
        chalk.green('Server is ready!'),
        `Logged in as @${client.user.tag} under "${configSettingsMode}" mode ...`,
      ].join(' '),
    );

    console.log(
      [
        guild.name,
        'has',
        chalk.cyan(guild.members.cache.size),
        'member(s) and',
        chalk.cyan(guild.channels.cache.filter((channel) => channel.type !== 'category').size),
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
    case 'feature':
      await featureMode(client, guild, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "featureMode" function',
        10,
        error,
      ));
      break;
    case 'snitch':
      await snitchMode(client, guild, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "snitchMode" function',
        10,
        error,
      ));
      break;
    case 'all':
    default:
      await featureMode(client, guild, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "featureMode" function',
        10,
        error,
      ));
      await snitchMode(client, guild, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "snitchMode" function',
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
  if (configSettingsMode !== 'snitch') {
    await client.user.setStatus('invisible').catch((error) => generateLogMessage(
      'Failed to set user status to "invisible"',
      10,
      error,
    ));
  }

  console.log('Stopping server ...');

  // Kills the process.
  process.exit(0);
});
