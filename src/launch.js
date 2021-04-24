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
  automaticBan,
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
  userScanner,
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
} = require('./snooper');
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
const configClientToken = _.get(config, 'settings.client-token');
const configLogChannelId = _.get(config, 'settings.log-channel-id');
const configLogLevel = _.get(config, 'settings.log-level');
const configBotPrefix = _.get(config, 'settings.bot-prefix');
const configFeatures = _.get(config, 'features');
const configSchedulePosts = _.get(config, 'schedule-posts');
const configRegexRules = _.get(config, 'regex-rules');
const configSuspiciousWords = _.get(config, 'suspicious-words');
const configRemoveRoles = _.get(config, 'remove-roles');
const configAutoReply = _.get(config, 'auto-reply');
const configAffiliateLinks = _.get(config, 'affiliate-links');
const configBannedUsers = _.get(config, 'banned-users');
const configUserScanners = _.get(config, 'user-scanners');
const configAddRole = _.get(config, 'add-role');
const configFetchMembers = _.get(config, 'fetch-members');
const configFindDuplicateUsers = _.get(config, 'find-duplicate-users');
const configHelp = _.get(config, 'help');
const configTogglePerms = _.get(config, 'toggle-perms');
const configVoice = _.get(config, 'voice');

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
client.login(configClientToken).catch((error) => {
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
  const logChannel = getTextBasedChannel(client, configLogChannelId);

  /**
   * Configuration pre-checks.
   *
   * @since 1.0.0
   */
  if (!logChannel || !_.includes([10, 20, 30, 40], configLogLevel) || !_.isString(configBotPrefix) || _.isEmpty(configBotPrefix)) {
    if (!logChannel) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.log-channel-id" is not a valid text-based channel',
        '...',
      ].join(' '));
    }

    if (!_.includes([10, 20, 30, 40], configLogLevel)) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.log-level" is not configured or is invalid',
        '...',
      ].join(' '));
    }

    if (!_.isString(configBotPrefix) || _.isEmpty(configBotPrefix)) {
      console.error([
        chalk.red('Server failed to start!'),
        '"settings.bot-prefix" is not configured or is invalid',
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
      `${configBotPrefix}help | Powered by Discord Stonker Bot`,
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
        'Guild has',
        chalk.cyan(client.users.cache.size),
        'member(s) and',
        chalk.cyan(client.channels.cache.filter((channel) => channel.type !== 'category').size),
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
    if (!message.author.bot) {
      /**
       * Add role.
       *
       * @since 1.0.0
       */
      if (message.content.startsWith(`${configBotPrefix}add-role`)) {
        await addRole(message, configBotPrefix, configAddRole).catch((error) => generateLogMessage(
          'Failed to execute "addRole" function',
          10,
          error,
        ));
      }

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
       * Check regular expression restricted channels.
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
      if (message.content.startsWith(`${configBotPrefix}fetch-members`)) {
        await fetchMembers(message, configBotPrefix, configFetchMembers).catch((error) => generateLogMessage(
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
      if (message.content.startsWith(`${configBotPrefix}find-duplicate-users`)) {
        await findDuplicateUsers(message, configBotPrefix, configFindDuplicateUsers).catch((error) => generateLogMessage(
          'Failed to execute "findDuplicateUsers" function',
          10,
          error,
        ));
      }

      /**
       * Cache attachments.
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
      if (message.content.startsWith(`${configBotPrefix}help`)) {
        await help(message, configBotPrefix, configHelp, {
          configAddRole,
          configFetchMembers,
          configFindDuplicateUsers,
          configTogglePerms,
          configVoice,
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
      if (message.content.startsWith(`${configBotPrefix}toggle-perms`)) {
        await togglePerms(message, configBotPrefix, configTogglePerms).catch((error) => generateLogMessage(
          'Failed to execute "togglePerms" function',
          10,
          error,
        ));
      }

      /**
       * Voice.
       *
       * @since 1.0.0
       */
      if (message.content.startsWith(`${configBotPrefix}voice`)) {
        await voice(message, configBotPrefix, configVoice).catch((error) => generateLogMessage(
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
    if (!message.author.bot) {
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
       * Cache attachments.
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
      if (configFeatures['update-message-notification'] === true) {
        await userUpdateMessage(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userUpdateMessage" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user deletes a message.
   *
   * @since 1.0.0
   */
  client.on('messageDelete', async (message) => {
    const messageAuthorId = message.author.id;
    const clientUserId = client.user.id;

    // If message was not sent by Stonker Bot.
    if (messageAuthorId !== clientUserId) {
      /**
       * Delete message notification.
       *
       * @since 1.0.0
       */
      if (configFeatures['delete-message-notification'] === true) {
        await userDeleteMessage(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userDeleteMessage" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When bulk messages are deleted.
   *
   * @since 1.0.0
   */
  client.on('messageDeleteBulk', (messages) => {
    _.forEach(messages.array(), async (message) => {
      const messageAuthorId = message.author.id;
      const clientUserId = client.user.id;

      // If message was not sent by Stonker Bot.
      if (messageAuthorId !== clientUserId) {
        /**
         * Delete message notification.
         *
         * @since 1.0.0
         */
        if (configFeatures['delete-message-notification'] === true) {
          await userDeleteMessage(message, logChannel).catch((error) => generateLogMessage(
            'Failed to execute "userDeleteMessage" function',
            10,
            error,
          ));
        }
      }
    });
  });

  /**
   * When guild member is added.
   *
   * @since 1.0.0
   */
  client.on('guildMemberAdd', async (member) => {
    /**
     * Automatic ban.
     *
     * @since 1.0.0
     */
    await automaticBan(member, configBannedUsers).catch((error) => generateLogMessage(
      'Failed to execute "automaticBan" function',
      10,
      error,
    ));
  });

  /**
   * When guild member is updated.
   *
   * @since 1.0.0
   */
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
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
    if (configFeatures['change-nickname-notification'] === true) {
      await userChangeNickname(oldMember, newMember, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "userChangeNickname" function',
        10,
        error,
      ));
    }
  });

  /**
   * When user is updated.
   *
   * @since 1.0.0
   */
  client.on('userUpdate', async (oldMember, newMember) => {
    /**
     * Change username notification.
     *
     * @since 1.0.0
     */
    if (configFeatures['change-username-notification'] === true) {
      await userChangeUsername(oldMember, newMember, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "userChangeUsername" function',
        10,
        error,
      ));
    }
  });

  /**
   * Schedule posts to publish.
   *
   * @since 1.0.0
   */
  if (_.isArray(configSchedulePosts) && !_.isEmpty(configSchedulePosts)) {
    _.forEach(configSchedulePosts, (configSchedulePost) => {
      const channel = getTextBasedChannel(client, configSchedulePost['channel-id']);

      schedulePost(configSchedulePost, channel);
    });
  }

  /**
   * User scanner.
   *
   * @since 1.0.0
   */
  if (_.isArray(configUserScanners) && !_.isEmpty(configUserScanners)) {
    _.forEach(configUserScanners, async (configUserScanner) => {
      const guild = client.guilds.cache.get(configUserScanner['guild-id']);
      const channel = getTextBasedChannel(client, configUserScanner['channel-id']);
      const message = _.get(configUserScanner, 'message');

      await userScanner(guild, message, channel).catch((error) => generateLogMessage(
        'Failed to execute "userScanner" function',
        10,
        error,
      ));
    });
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
