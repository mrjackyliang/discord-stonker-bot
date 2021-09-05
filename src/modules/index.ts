import { Client, Guild } from 'discord.js';
import _ from 'lodash';

import config from '../../config.json';

import {
  antiRaidAutoBan,
  antiRaidMembershipGate,
  antiRaidMonitor,
} from './anti-raid';
import {
  bulkBan,
  fetchMembers,
  fetchDuplicates,
  help,
  role,
  togglePerms,
  voice,
} from './commands';
import { rssFeed, schedulePost, stocktwits } from './content';
import { autoReply, messageCopier } from './messenger';
import {
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
} from './moderator';
import changeRoles from './roles';
import {
  userChangeNickname,
  userChangeUsername,
  userDeleteMessage,
  userDeleteMessage as userDeleteMessageBulk,
  userIncludesLink,
  userUpdateMessage,
  userUploadAttachment,
} from './snitch';
import bumpThreads from './threads';
import { getTextBasedChannel } from '../lib/utilities';
import {
  AffiliateLinks,
  AntiRaidAutoBan,
  AntiRaidMembershipGate,
  ChangeRoles,
  MessageCopiers,
  RegexRules,
  Replies,
  Snitch,
  SuspiciousWords,
} from '../typings';

/**
 * Bot configuration.
 *
 * @since 1.0.0
 */
const configSettingsBotPrefix = _.get(config, 'settings.bot-prefix');
const configSnitchChangeNickname = _.get(config, 'snitch.change-nickname');
const configSnitchChangeUsername = _.get(config, 'snitch.change-username');
const configSnitchDeleteMessage = _.get(config, 'snitch.delete-message');
const configSnitchIncludesLink = _.get(config, 'snitch.includes-link');
const configSnitchUpdateMessage = _.get(config, 'snitch.update-message');
const configSnitchUploadAttachment = _.get(config, 'snitch.upload-attachment');
const configAntiRaidAutoBan = _.get(config, 'anti-raid.auto-ban');
const configAntiRaidMembershipGate = _.get(config, 'anti-raid.membership-gate');
const configAntiRaidMonitor = _.get(config, 'anti-raid.monitor');
const configSchedulePosts = _.get(config, 'schedule-posts');
const configRssFeeds = _.get(config, 'rss-feeds');
const configRegexRules = _.get(config, 'regex-rules');
const configSuspiciousWords = _.get(config, 'suspicious-words');
const configRoles = _.get(config, 'roles');
const configAutoReply = _.get(config, 'auto-reply');
const configMessageCopier = _.get(config, 'message-copier');
const configAffiliateLinks = _.get(config, 'affiliate-links');
const configStocktwits = _.get(config, 'stocktwits');
const configBumpThreads = _.get(config, 'bump-threads');

/**
 * Initialize.
 *
 * @param {Client} client - Discord client.
 * @param {Guild}  guild  - Discord guild.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export default function initialize(client: Client, guild: Guild): void {
  /**
   * When user sends a command.
   *
   * @since 1.0.0
   */
  client.on('messageCreate', (message) => {
    const messageContent = message.toString();

    if (
      message.guild
      && message.guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && !message.author.bot // If message is not sent by a bot.
      && !message.system // If message is not sent by system.
      && _.isString(configSettingsBotPrefix) // If bot prefix is a string.
      && !_.isEmpty(configSettingsBotPrefix) // If bot prefix is not empty.
      && messageContent.startsWith(configSettingsBotPrefix) // If message starts with the bot prefix.
    ) {
      /**
       * Bulk ban.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}bulk-ban`)) {
        bulkBan(message, configSettingsBotPrefix, _.get(config, 'commands.bulk-ban'));
      }

      /**
       * Fetch members.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}fetch-members`)) {
        fetchMembers(message, configSettingsBotPrefix, _.get(config, 'commands.fetch-members'));
      }

      /**
       * Fetch duplicates.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}fetch-duplicates`)) {
        fetchDuplicates(message, configSettingsBotPrefix, _.get(config, 'commands.fetch-duplicates'));
      }

      /**
       * Help.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}help`)) {
        help(message, configSettingsBotPrefix, _.get(config, 'commands.help'), {
          bulkBan: _.get(config, 'commands.bulk-ban'),
          fetchMembers: _.get(config, 'commands.fetch-members'),
          fetchDuplicates: _.get(config, 'commands.fetch-duplicates'),
          role: _.get(config, 'commands.role'),
          togglePerms: _.get(config, 'commands.toggle-perms'),
          voice: _.get(config, 'commands.voice'),
        });
      }

      /**
       * Role.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}role`)) {
        role(message, configSettingsBotPrefix, _.get(config, 'commands.role'));
      }

      /**
       * Toggle permissions.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}toggle-perms`)) {
        togglePerms(message, configSettingsBotPrefix, _.get(config, 'commands.toggle-perms'), _.get(config, 'toggle-perms'));
      }

      /**
       * Voice.
       *
       * @since 1.0.0
       */
      if (messageContent.startsWith(`${configSettingsBotPrefix}voice`)) {
        voice(message, configSettingsBotPrefix, _.get(config, 'commands.voice'));
      }
    }
  });

  /**
   * When user creates a message.
   *
   * @since 1.0.0
   */
  client.on('messageCreate', (message) => {
    if (
      message.guild
      && message.guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && !message.author.bot // If message is not sent by a bot.
      && !message.system // If message is not sent by system.
    ) {
      /**
       * Auto reply.
       *
       * @since 1.0.0
       */
      autoReply(message, <Replies>configAutoReply);

      /**
       * Check regex channels.
       *
       * @since 1.0.0
       */
      checkRegexChannels(message, <RegexRules>configRegexRules);

      /**
       * Detect suspicious words.
       *
       * @since 1.0.0
       */
      detectSuspiciousWords(message, <SuspiciousWords>configSuspiciousWords);

      /**
       * Message copier.
       *
       * @since 1.0.0
       */
      messageCopier(message, <MessageCopiers>configMessageCopier);

      /**
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      removeAffiliateLinks(message, <AffiliateLinks>configAffiliateLinks);

      /**
       * User includes link.
       *
       * @since 1.0.0
       */
      userIncludesLink(message, <Snitch>configSnitchIncludesLink);

      /**
       * User upload attachment.
       *
       * @since 1.0.0
       */
      userUploadAttachment(message, <Snitch>configSnitchUploadAttachment);
    }
  });

  /**
   * When user updates a message.
   *
   * @since 1.0.0
   */
  client.on('messageUpdate', (message) => {
    if (
      message.guild
      && message.author
      && message.guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && !message.author.bot // If message is not sent by a bot.
      && !message.system // If message is not sent by system.
    ) {
      /**
       * Check regex channels.
       *
       * @since 1.0.0
       */
      checkRegexChannels(message, <RegexRules>configRegexRules);

      /**
       * Detect suspicious words.
       *
       * @since 1.0.0
       */
      detectSuspiciousWords(message, <SuspiciousWords>configSuspiciousWords);

      /**
       * Remove affiliate links.
       *
       * @since 1.0.0
       */
      removeAffiliateLinks(message, <AffiliateLinks>configAffiliateLinks);

      /**
       * User includes link.
       *
       * @since 1.0.0
       */
      userIncludesLink(message, <Snitch>configSnitchIncludesLink);

      /**
       * User update message.
       *
       * @since 1.0.0
       */
      userUpdateMessage(message, <Snitch>configSnitchUpdateMessage);
    }
  });

  /**
   * When user deletes a message.
   *
   * @since 1.0.0
   */
  client.on('messageDelete', (message) => {
    if (
      message.guild
      && message.author
      && message.client.user
      && message.guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && message.author.id !== message.client.user.id // If message was not sent by Stonker Bot.
    ) {
      /**
       * Delete message notification.
       *
       * @since 1.0.0
       */
      userDeleteMessage(message, <Snitch>configSnitchDeleteMessage);
    }
  });

  /**
   * When user deletes bulk messages.
   *
   * @since 1.0.0
   */
  client.on('messageDeleteBulk', (messages) => {
    _.forEach([...messages.values()], (message) => {
      if (
        message.guild
        && message.author
        && message.client.user
        && message.guild.available // If guild is online.
        && message.guild.id === guild.id // If message was sent in the guild.
        && message.author.id !== message.client.user.id // If message was not sent by Stonker Bot.
      ) {
        /**
         * Delete message notification.
         *
         * @since 1.0.0
         */
        userDeleteMessageBulk(message, <Snitch>configSnitchDeleteMessage);
      }
    });
  });

  /**
   * When guild member is added.
   *
   * @since 1.0.0
   */
  client.on('guildMemberAdd', (member) => {
    if (
      guild.available // If guild is online.
      && member.guild.id === guild.id // If member is in the guild.
    ) {
      const guildJoinChannelId = _.get(configAntiRaidMonitor, 'guild-join.channel-id');
      const guildJoinChannel = getTextBasedChannel(guild, guildJoinChannelId);

      /**
       * Anti-raid monitor.
       *
       * @since 1.0.0
       */
      antiRaidMonitor(member, 'join', guildJoinChannel);

      /**
       * Anti-raid auto-ban.
       *
       * @since 1.0.0
       */
      antiRaidAutoBan(member, <AntiRaidAutoBan>configAntiRaidAutoBan);
    }
  });

  /**
   * When guild member is removed.
   *
   * @since 1.0.0
   */
  client.on('guildMemberRemove', (member) => {
    if (
      guild.available // If guild is online.
      && member.guild.id === guild.id // If member is in the guild.
    ) {
      const guildLeaveChannelId = _.get(configAntiRaidMonitor, 'guild-leave.channel-id');
      const guildLeaveChannel = getTextBasedChannel(guild, guildLeaveChannelId);

      /**
       * Anti-raid monitor.
       *
       * @since 1.0.0
       */
      antiRaidMonitor(member, 'leave', guildLeaveChannel);
    }
  });

  /**
   * When guild member is updated.
   *
   * @since 1.0.0
   */
  client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (
      guild.available // If guild is online.
      && oldMember.guild.id === guild.id // If old member is in the guild.
      && newMember.guild.id === guild.id // If new member is in the guild.
    ) {
      /**
       * Anti-raid membership gate.
       *
       * @since 1.0.0
       */
      antiRaidMembershipGate(oldMember, newMember, <AntiRaidMembershipGate>configAntiRaidMembershipGate);

      /**
       * Change roles.
       *
       * @since 1.0.0
       */
      changeRoles(oldMember, newMember, <ChangeRoles>configRoles);

      /**
       * Change nickname notification.
       *
       * @since 1.0.0
       */
      userChangeNickname(oldMember, newMember, <Snitch>configSnitchChangeNickname);
    }
  });

  /**
   * When user is updated.
   *
   * @since 1.0.0
   */
  client.on('userUpdate', (oldUser, newUser) => {
    if (
      guild.available // If guild is online.
      && guild.members.cache.has(oldUser.id) // If old user is in the guild.
      && guild.members.cache.has(newUser.id) // If new user is in the guild.
    ) {
      /**
       * Change username notification.
       *
       * @since 1.0.0
       */
      userChangeUsername(guild, oldUser, newUser, <Snitch>configSnitchChangeUsername);
    }
  });

  /**
   * Schedule post.
   *
   * @since 1.0.0
   */
  if (_.isArray(configSchedulePosts) && !_.isEmpty(configSchedulePosts)) {
    _.forEach(configSchedulePosts, (configSchedulePost) => {
      const sendToChannel = getTextBasedChannel(guild, _.get(configSchedulePost, 'channel-id'));

      schedulePost(configSchedulePost, sendToChannel);
    });
  }

  /**
   * RSS feed.
   *
   * @since 1.0.0
   */
  if (_.isArray(configRssFeeds) && !_.isEmpty(configRssFeeds)) {
    _.forEach(configRssFeeds, (configRssFeed) => {
      const sendToChannel = getTextBasedChannel(guild, _.get(configRssFeed, 'channel-id'));

      rssFeed(configRssFeed, sendToChannel);
    });
  }

  /**
   * Stocktwits.
   *
   * @since 1.0.0
   */
  if (_.isArray(configStocktwits) && !_.isEmpty(configStocktwits)) {
    _.forEach(configStocktwits, (configStocktwit) => {
      const sendToChannel = getTextBasedChannel(guild, _.get(configStocktwit, 'channel-id'));

      stocktwits(configStocktwit, sendToChannel);
    });
  }

  /**
   * Bump threads.
   *
   * @since 1.0.0
   */
  if (_.isArray(configBumpThreads) && !_.isEmpty(configBumpThreads)) {
    _.forEach(configBumpThreads, (configBumpThread) => {
      bumpThreads(guild, configBumpThread);
    });
  }
}
