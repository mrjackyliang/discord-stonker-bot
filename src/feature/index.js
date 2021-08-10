const _ = require('lodash');

const config = require('../../config.json');

const {
  antiRaidAutoBan,
  antiRaidMembershipGate,
  antiRaidMonitor,
} = require('./anti-raid');
const {
  fetchMembers,
  findDuplicateUsers,
  help,
  role,
  togglePerms,
  voice,
} = require('./commands');
const { rssFeed, schedulePost, stocktwitsTrending } = require('./content');
const { autoReply, messageCopier } = require('./messenger');
const {
  checkRegexChannels,
  removeAffiliateLinks,
} = require('./moderator');
const { changeRoles } = require('./roles');
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
const configAntiRaidMembershipGate = _.get(config, 'anti-raid.membership-gate');
const configAntiRaidMonitor = _.get(config, 'anti-raid.monitor');
const configSchedulePosts = _.get(config, 'schedule-posts');
const configRssFeeds = _.get(config, 'rss-feeds');
const configRegexRules = _.get(config, 'regex-rules');
const configRoles = _.get(config, 'roles');
const configAutoReply = _.get(config, 'auto-reply');
const configMessageCopier = _.get(config, 'message-copier');
const configAffiliateLinks = _.get(config, 'affiliate-links');
const configStocktwits = _.get(config, 'stocktwits');

/**
 * Feature mode.
 *
 * @param {Client} client - Discord client.
 * @param {Guild}  guild  - Discord guild.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function featureMode(client, guild) {
  /**
   * When user sends a command.
   *
   * @since 1.0.0
   */
  client.on('messageCreate', async (message) => {
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
  client.on('messageCreate', async (message) => {
    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.bot') === false // If message is not sent by a bot.
      && _.get(message, 'system') === false // If message is not sent by system.
    ) {
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
       * Message copier.
       *
       * @since 1.0.0
       */
      await messageCopier(message, configMessageCopier).catch((error) => generateLogMessage(
        'Failed to execute "messageCopier" function',
        10,
        error,
      ));

      /**
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      await removeAffiliateLinks(message, configAffiliateLinks).catch((error) => generateLogMessage(
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
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      await removeAffiliateLinks(message, configAffiliateLinks).catch((error) => generateLogMessage(
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
       * Anti-raid membership gate.
       *
       * @since 1.0.0
       */
      await antiRaidMembershipGate(oldMember, newMember, configAntiRaidMembershipGate).catch((error) => generateLogMessage(
        'Failed to execute "antiRaidMembershipGate" function',
        10,
        error,
      ));

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
   * Schedule post.
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
   * RSS feed.
   *
   * @since 1.0.0
   */
  if (_.isArray(configRssFeeds) && !_.isEmpty(configRssFeeds)) {
    _.forEach(configRssFeeds, (configRssFeed) => {
      const channel = getTextBasedChannel(guild, configRssFeed['channel-id']);

      rssFeed(configRssFeed, channel);
    });
  }

  /**
   * Stocktwits trending.
   *
   * @since 1.0.0
   */
  if (_.isArray(configStocktwits) && !_.isEmpty(configStocktwits)) {
    _.forEach(configStocktwits, (configStocktwit) => {
      const channel = getTextBasedChannel(guild, configStocktwit['channel-id']);

      stocktwitsTrending(configStocktwit, channel);
    });
  }
}

module.exports = {
  featureMode,
};
