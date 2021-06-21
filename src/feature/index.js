const _ = require('lodash');

const config = require('../../config.json');

const {
  antiRaidAutoBan,
  antiRaidAutoVerify,
  antiRaidMonitor,
  antiRaidVerify,
} = require('./anti-raid');
const {
  fetchMembers,
  findDuplicateUsers,
  help,
  role,
  togglePerms,
  voice,
} = require('./commands');
const { autoReply } = require('./messenger');
const {
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
} = require('./moderator');
const { changeRoles } = require('./roles');
const { schedulePost } = require('./scheduler');
const {
  generateLogMessage,
  getTextBasedChannel,
} = require('../lib/utilities');

/**
 * Bot configuration.
 *
 * @since 1.0.0
 */
const configAntiRaidAutoBan = _.get(config, 'anti-raid.auto-ban');
const configAntiRaidMonitor = _.get(config, 'anti-raid.monitor');
const configAntiRaidVerify = _.get(config, 'anti-raid.verify');
const configSchedulePosts = _.get(config, 'schedule-posts');
const configRegexRules = _.get(config, 'regex-rules');
const configSuspiciousWords = _.get(config, 'suspicious-words');
const configRoles = _.get(config, 'roles');
const configAutoReply = _.get(config, 'auto-reply');
const configAffiliateLinks = _.get(config, 'affiliate-links');

/**
 * Feature mode.
 *
 * @param {module:"discord.js".Client}                 client     - Discord client.
 * @param {module:"discord.js".Guild}                  guild      - Discord guild.
 * @param {module:"discord.js".TextBasedChannelFields} logChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function featureMode(client, guild, logChannel) {
  /**
   * When user sends a command.
   *
   * @since 1.0.0
   */
  client.on('message', async (message) => {
    const botPrefix = _.get(config, 'settings.bot-prefix');
    const messageContent = message.toString();

    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.bot') === false // If message is not sent by a bot.
      && _.get(message, 'system') === false // If message is not sent by system.
      && messageContent.startsWith(botPrefix) // If message starts with the bot prefix.
    ) {
      /**
       * Fetch members.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${botPrefix}fetch-members`)) {
        await fetchMembers(message, botPrefix, _.get(config, 'commands.fetch-members')).catch((error) => generateLogMessage(
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
      if (messageContent.startsWith(`${botPrefix}find-duplicate-users`)) {
        await findDuplicateUsers(message, botPrefix, _.get(config, 'commands.find-duplicate-users')).catch((error) => generateLogMessage(
          'Failed to execute "findDuplicateUsers" function',
          10,
          error,
        ));
      }

      /**
       * Help.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${botPrefix}help`)) {
        await help(message, botPrefix, _.get(config, 'commands.help'), {
          fetchMembers: _.get(config, 'commands.fetch-members'),
          findDuplicateUsers: _.get(config, 'commands.find-duplicate-users'),
          role: _.get(config, 'commands.role'),
          togglePerms: _.get(config, 'commands.toggle-perms'),
          voice: _.get(config, 'commands.voice'),
        }).catch((error) => generateLogMessage(
          'Failed to execute "help" function',
          10,
          error,
        ));
      }

      /**
       * Role.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${botPrefix}role`)) {
        await role(message, botPrefix, _.get(config, 'commands.role')).catch((error) => generateLogMessage(
          'Failed to execute "role" function',
          10,
          error,
        ));
      }

      /**
       * Toggle permissions.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${botPrefix}toggle-perms`)) {
        await togglePerms(message, botPrefix, _.get(config, 'commands.toggle-perms'), _.get(config, 'toggle-perms')).catch((error) => generateLogMessage(
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
      if (messageContent.startsWith(`${botPrefix}voice`)) {
        await voice(message, botPrefix, _.get(config, 'commands.voice')).catch((error) => generateLogMessage(
          'Failed to execute "voice" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user creates a message.
   *
   * @since 1.0.0
   */
  client.on('message', async (message) => {
    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.bot') === false // If message is not sent by a bot.
      && _.get(message, 'system') === false // If message is not sent by system.
    ) {
      /**
       * Anti-raid verification.
       *
       * @since 1.0.0
       */
      await antiRaidVerify(message, configAntiRaidVerify).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidVerify" function',
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
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      await removeAffiliateLinks(message, configAffiliateLinks, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "removeAffiliateLinks" function',
        10,
        error,
      ));
    }
  });

  /**
   * When user updates a message.
   *
   * @since 1.0.0
   */
  client.on('messageUpdate', async (message) => {
    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.bot') === false // If message is not sent by a bot.
      && _.get(message, 'system') === false // If message is not sent by system.
    ) {
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
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      await removeAffiliateLinks(message, configAffiliateLinks, logChannel).catch((error) => generateLogMessage(
        'Failed to execute "removeAffiliateLinks" function',
        10,
        error,
      ));
    }
  });

  /**
   * When guild member is added.
   *
   * @since 1.0.0
   */
  client.on('guildMemberAdd', async (member) => {
    if (
      guild.available === true // If guild is online.
      && _.get(member, 'guild.id') === guild.id // If member is in the guild.
    ) {
      const guildJoinChannelId = _.get(configAntiRaidMonitor, 'guild-join.channel-id');
      const guildJoinChannel = getTextBasedChannel(guild, guildJoinChannelId);

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
       * Anti-raid auto-verify.
       *
       * @since 1.0.0
       */
      await antiRaidAutoVerify(member, configAntiRaidVerify).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidAutoVerify" function',
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
    if (
      guild.available === true // If guild is online.
      && _.get(member, 'guild.id') === guild.id // If member is in the guild.
    ) {
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
    if (
      guild.available === true // If guild is online.
      && _.get(oldMember, 'guild.id') === guild.id // If old member is in the guild.
      && _.get(newMember, 'guild.id') === guild.id // If new member is in the guild.
    ) {
      /**
       * Change roles.
       *
       * @since 1.0.0
       */
      await changeRoles(oldMember, newMember, configRoles).catch((error) => generateLogMessage(
        'Failed to execute "changeRoles" function',
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
      const channel = getTextBasedChannel(guild, configSchedulePost['channel-id']);

      schedulePost(configSchedulePost, channel);
    });
  }
}

module.exports = {
  featureMode,
};
