const chalk = require('chalk');
const Discord = require('discord.js');
const _ = require('lodash');

const config = require('../config.json');

const {
  addRole,
  fetchMembers,
  findDuplicateUsers,
  help,
  togglePerms,
  voice,
} = require('./commands');
const { autoReply } = require('./messenger');
const {
  antiRaidAutoBan,
  antiRaidMonitor,
  antiRaidScanner,
  antiRaidVerifyNotice,
  antiRaidVerifyRole,
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
} = require('./moderator');
const {
  removeRolesIfNoRoles,
  removeRolesIfRoles,
} = require('./roles');
const { schedulePost } = require('./scheduler');
const {
  userChangeNickname,
  userChangeUsername,
  userDeleteMessage,
  userUpdateMessage,
  userUploadAttachment,
} = require('./snitcher');
const {
  getGoogleCloudStorageObjects,
  getTextBasedChannel,
  generateLogMessage,
} = require('./utilities');

/**
 * Bot configuration.
 *
 * @since 1.0.0
 */
const configSettingsClientToken = _.get(config, 'settings.client-token');
const configSettingsGuildId = _.get(config, 'settings.guild-id');
const configSettingsLogChannelId = _.get(config, 'settings.log-channel-id');
const configSettingsLogLevel = _.get(config, 'settings.log-level');
const configSettingsBotPrefix = _.get(config, 'settings.bot-prefix');
const configSettingsTimeZone = _.get(config, 'settings.time-zone');

const configNotificationsChangeNickname = _.get(config, 'notifications.change-nickname');
const configNotificationsChangeUsername = _.get(config, 'notifications.change-username');
const configNotificationsDeleteMessage = _.get(config, 'notifications.delete-message');
const configNotificationsUpdateMessage = _.get(config, 'notifications.update-message');
const configNotificationsUploadAttachment = _.get(config, 'notifications.upload-attachment');

const configCommandsAddRole = _.get(config, 'commands.add-role');
const configCommandsFetchMembers = _.get(config, 'commands.fetch-members');
const configCommandsFindDuplicateUsers = _.get(config, 'commands.find-duplicate-users');
const configCommandsHelp = _.get(config, 'commands.help');
const configCommandsTogglePerms = _.get(config, 'commands.toggle-perms');
const configCommandsVoice = _.get(config, 'commands.voice');

const configAntiRaidAutoBan = _.get(config, 'anti-raid.auto-ban');
const configAntiRaidMonitor = _.get(config, 'anti-raid.monitor');
const configAntiRaidScanner = _.get(config, 'anti-raid.scanner');
const configAntiRaidVerify = _.get(config, 'anti-raid.verify');

const configSchedulePosts = _.get(config, 'schedule-posts');
const configRegexRules = _.get(config, 'regex-rules');
const configSuspiciousWords = _.get(config, 'suspicious-words');
const configRemoveRoles = _.get(config, 'remove-roles');
const configAutoReply = _.get(config, 'auto-reply');
const configAffiliateLinks = _.get(config, 'affiliate-links');
const configTogglePerms = _.get(config, 'toggle-perms');

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
  console.error([
    chalk.red('Server failed to start!'),
    error.message.replace(/\.$/, ''),
    '...',
  ].join(' '));

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
    || !_.isString(configSettingsBotPrefix)
    || _.isEmpty(configSettingsBotPrefix)
    || _.size(configSettingsBotPrefix) > 3
    || !_.isString(configSettingsTimeZone)
    || _.isEmpty(configSettingsTimeZone)
  ) {
    if (_.isUndefined(guild)) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.guild-id" is not a valid guild',
        '...',
      ].join(' '));
    }

    if (_.isUndefined(logChannel)) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.log-channel-id" is not a valid text-based channel',
        '...',
      ].join(' '));
    }

    if (!_.includes([10, 20, 30, 40], configSettingsLogLevel)) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.log-level" is not configured or is invalid',
        '...',
      ].join(' '));
    }

    if (!_.isString(configSettingsBotPrefix) || _.isEmpty(configSettingsBotPrefix) || _.size(configSettingsBotPrefix) > 3) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.bot-prefix" is not configured or too long',
        '...',
      ].join(' '));
    }

    if (!_.isString(configSettingsTimeZone) || _.isEmpty(configSettingsTimeZone)) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.time-zone" is not configured',
        '...',
      ].join(' '));
    }

    // Kills the process with error.
    process.exit(1);
  } else {
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

    console.log(
      [
        chalk.green('Server is ready!'),
        `Logged in as @${client.user.tag} ...`,
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
   * When user creates a message.
   *
   * @since 1.0.0
   */
  client.on('message', async (message) => {
    const messageSystem = _.get(message, 'system');
    const messageAuthorBot = _.get(message, 'author.bot');
    const messageGuildId = _.get(message, 'guild.id');

    if (guild.id === messageGuildId && messageSystem === false && messageAuthorBot === false) {
      /**
       * Add role.
       *
       * @since 1.0.0
       */
      if (message.toString().startsWith(`${configSettingsBotPrefix}add-role`)) {
        await addRole(message, configSettingsBotPrefix, configCommandsAddRole).catch((error) => generateLogMessage(
          'Failed to execute "addRole" function',
          10,
          error,
        ));
      }

      /**
       * Anti-raid verification role.
       *
       * @since 1.0.0
       */
      await antiRaidVerifyRole(message, configAntiRaidVerify).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidVerifyRole" function',
        10,
        error,
      ));

      /**
       * Auto reply.
       *
       * @since 1.0.0
       */
      await autoReply(message, configAutoReply).catch((error) => generateLogMessage(
        'Failed to execute "autoReply" function',
        10,
        error,
      ));

      /**
       * Check regex channels.
       *
       * @since 1.0.0
       */
      await checkRegexChannels(message, configRegexRules).catch((error) => generateLogMessage(
        'Failed to execute "checkRegexChannels" function',
        10,
        error,
      ));

      /**
       * Detect suspicious words.
       *
       * @since 1.0.0
       */
      await detectSuspiciousWords(message, configSuspiciousWords, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "detectSuspiciousWords" function',
        10,
        error,
      ));

      /**
       * Fetch members.
       *
       * @since 1.0.0
       */
      if (message.toString().startsWith(`${configSettingsBotPrefix}fetch-members`)) {
        await fetchMembers(message, configSettingsBotPrefix, configCommandsFetchMembers).catch((error) => generateLogMessage(
          'Failed to execute "fetchMembers" function',
          10,
          error,
        ));
      }

      /**
       * Find duplicate users.
       *
       * @since 1.0.0
       */
      if (message.toString().startsWith(`${configSettingsBotPrefix}find-duplicate-users`)) {
        await findDuplicateUsers(message, configSettingsBotPrefix, configCommandsFindDuplicateUsers).catch((error) => generateLogMessage(
          'Failed to execute "findDuplicateUsers" function',
          10,
          error,
        ));
      }

      /**
       * Get Google Cloud Storage objects.
       *
       * @since 1.0.0
       */
      await getGoogleCloudStorageObjects(message).catch((error) => generateLogMessage(
        'Failed to execute "getGoogleCloudStorageObjects" function',
        10,
        error,
      ));

      /**
       * Help.
       *
       * @since 1.0.0
       */
      if (message.toString().startsWith(`${configSettingsBotPrefix}help`)) {
        await help(message, configSettingsBotPrefix, configCommandsHelp, {
          configCommandsAddRole,
          configCommandsFetchMembers,
          configCommandsFindDuplicateUsers,
          configCommandsTogglePerms,
          configCommandsVoice,
        }).catch((error) => generateLogMessage(
          'Failed to execute "help" function',
          10,
          error,
        ));
      }

      /**
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      await removeAffiliateLinks(message, configAffiliateLinks, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "removeAffiliateLinks" function',
        10,
        error,
      ));

      /**
       * Toggle permissions.
       *
       * @since 1.0.0
       */
      if (message.toString().startsWith(`${configSettingsBotPrefix}toggle-perms`)) {
        await togglePerms(message, configSettingsBotPrefix, configCommandsTogglePerms, configTogglePerms).catch((error) => generateLogMessage(
          'Failed to execute "togglePerms" function',
          10,
          error,
        ));
      }

      /**
       * Upload attachment notification.
       *
       * @since 1.0.0
       */
      if (configNotificationsUploadAttachment === true) {
        await userUploadAttachment(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userUploadAttachment" function',
          10,
          error,
        ));
      }

      /**
       * Voice.
       *
       * @since 1.0.0
       */
      if (message.toString().startsWith(`${configSettingsBotPrefix}voice`)) {
        await voice(message, configSettingsBotPrefix, configCommandsVoice).catch((error) => generateLogMessage(
          'Failed to execute "voice" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user updates a message.
   *
   * @since 1.0.0
   */
  client.on('messageUpdate', async (message) => {
    const messageSystem = _.get(message, 'system');
    const messageAuthorBot = _.get(message, 'author.bot');
    const messageGuildId = _.get(message, 'guild.id');

    if (guild.id === messageGuildId && messageSystem === false && messageAuthorBot === false) {
      /**
       * Detect suspicious words.
       *
       * @since 1.0.0
       */
      await detectSuspiciousWords(message, configSuspiciousWords, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "detectSuspiciousWords" function',
        10,
        error,
      ));

      /**
       * Get Google Cloud Storage objects.
       *
       * @since 1.0.0
       */
      await getGoogleCloudStorageObjects(message).catch((error) => generateLogMessage(
        'Failed to execute "getGoogleCloudStorageObjects" function',
        10,
        error,
      ));

      /**
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      await removeAffiliateLinks(message, configAffiliateLinks, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "removeAffiliateLinks" function',
        10,
        error,
      ));

      /**
       * Update message notification.
       *
       * @since 1.0.0
       */
      if (configNotificationsUpdateMessage === true) {
        await userUpdateMessage(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userUpdateMessage" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user deletes a message or bulk messages.
   *
   * @since 1.0.0
   */
  _.forEach(['single', 'bulk'], (deleteEvent) => {
    const messageDeleteAction = async (message) => {
      const clientUserId = _.get(client, 'user.id');
      const messageAuthorId = _.get(message, 'author.id');
      const messageGuildId = _.get(message, 'guild.id');

      // If message was not sent by Stonker Bot.
      if (guild.id === messageGuildId && messageAuthorId !== clientUserId) {
        /**
         * Delete message notification.
         *
         * @since 1.0.0
         */
        if (configNotificationsDeleteMessage === true) {
          await userDeleteMessage(message, logChannel).catch((error) => generateLogMessage(
            'Failed to execute "userDeleteMessage" function',
            10,
            error,
          ));
        }
      }
    };

    // Single message.
    if (deleteEvent === 'single') {
      client.on('messageDelete', messageDeleteAction);
    }

    // Bulk messages.
    if (deleteEvent === 'bulk') {
      client.on('messageDeleteBulk', async (messages) => {
        _.forEach(messages.array(), messageDeleteAction);
      });
    }
  });

  /**
   * When guild member is added.
   *
   * @since 1.0.0
   */
  client.on('guildMemberAdd', async (member) => {
    const memberGuildId = _.get(member, 'guild.id');

    // If member is in the guild.
    if (guild.id === memberGuildId) {
      const guildJoinChannelId = _.get(configAntiRaidMonitor, 'guild-join.channel-id');
      const guildJoinChannel = getTextBasedChannel(guild, guildJoinChannelId);
      const verifyChannelId = _.get(configAntiRaidVerify, 'channel-id');
      const verifyChannel = getTextBasedChannel(guild, verifyChannelId);

      /**
       * Anti-raid monitor.
       *
       * @since 1.0.0
       */
      await antiRaidMonitor(member, 'join', guildJoinChannel).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidMonitor" function',
        10,
        error,
      ));

      /**
       * Anti-raid auto-ban.
       *
       * @since 1.0.0
       */
      await antiRaidAutoBan(member, configAntiRaidAutoBan).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidAutoBan" function',
        10,
        error,
      ));

      /**
       * Anti-raid verification notice.
       *
       * @since 1.0.0
       */
      await antiRaidVerifyNotice(member, configAntiRaidVerify, verifyChannel).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidVerifyNotice" function',
        10,
        error,
      ));
    }
  });

  /**
   * When guild member is removed.
   *
   * @since 1.0.0
   */
  client.on('guildMemberRemove', async (member) => {
    const memberGuildId = _.get(member, 'guild.id');

    // If member is in the guild.
    if (guild.id === memberGuildId) {
      const guildLeaveChannelId = _.get(configAntiRaidMonitor, 'guild-leave.channel-id');
      const guildLeaveChannel = getTextBasedChannel(guild, guildLeaveChannelId);

      /**
       * Anti-raid monitor.
       *
       * @since 1.0.0
       */
      await antiRaidMonitor(member, 'leave', guildLeaveChannel).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidMonitor" function',
        10,
        error,
      ));
    }
  });

  /**
   * When guild member is updated.
   *
   * @since 1.0.0
   */
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const newMemberGuildId = _.get(newMember, 'guild.id');

    // If member is in the guild.
    if (guild.id === newMemberGuildId) {
      /**
       * Remove roles if no roles.
       *
       * @since 1.0.0
       */
      await removeRolesIfNoRoles(newMember, configRemoveRoles).catch((error) => generateLogMessage(
        'Failed to execute "removeRolesIfNoRoles" function',
        10,
        error,
      ));

      /**
       * Remove roles if roles.
       *
       * @since 1.0.0
       */
      await removeRolesIfRoles(newMember, configRemoveRoles).catch((error) => generateLogMessage(
        'Failed to execute "removeRolesIfRoles" function',
        10,
        error,
      ));

      /**
       * Change nickname notification.
       *
       * @since 1.0.0
       */
      if (configNotificationsChangeNickname === true) {
        await userChangeNickname(oldMember, newMember, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userChangeNickname" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user is updated.
   *
   * @since 1.0.0
   */
  client.on('userUpdate', async (oldUser, newUser) => {
    // If member is in the guild.
    if (guild.members.cache.has(newUser.id) === true) {
      /**
       * Change username notification.
       *
       * @since 1.0.0
       */
      if (configNotificationsChangeUsername === true) {
        await userChangeUsername(oldUser, newUser, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userChangeUsername" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * Schedule posts to publish.
   *
   * @since 1.0.0
   */
  if (_.isArray(configSchedulePosts) && !_.isEmpty(configSchedulePosts)) {
    _.forEach(configSchedulePosts, (configSchedulePost) => {
      const channel = getTextBasedChannel(guild, configSchedulePost['channel-id']);

      schedulePost(configSchedulePost, channel);
    });
  }

  /**
   * Anti-raid scanner.
   *
   * @since 1.0.0
   */
  if (_.isPlainObject(configAntiRaidScanner) && !_.isEmpty(configAntiRaidScanner)) {
    const channel = getTextBasedChannel(guild, configAntiRaidScanner['channel-id']);

    await antiRaidScanner(guild, configAntiRaidScanner, channel).catch((error) => generateLogMessage(
      'Failed to execute "antiRaidScanner" function',
      10,
      error,
    ));
  }
});

/**
 * Capture signal interruption.
 *
 * @since 1.0.0
 */
process.on('SIGINT', async () => {
  await client.user.setStatus('invisible').catch((error) => generateLogMessage(
    'Failed to set user status to "invisible"',
    10,
    error,
  ));

  console.log('Stopping server ...');

  // Kills the process.
  process.exit(0);
});
