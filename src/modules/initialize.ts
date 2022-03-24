import { Client, Guild } from 'discord.js';
import express from 'express';
import fs from 'fs';
import _ from 'lodash';

import config from '../../config.json';

import {
  antiRaidAutoBan,
  antiRaidMembershipGate,
  antiRaidMonitor,
} from './anti-raid';
import { etherscanGasOracle, stocktwitsTrending } from './api-fetch';
import {
  bulkBan,
  fetchDuplicates,
  fetchMembers,
  helpMenu,
  roleManager,
  togglePerms,
  voiceTools,
} from './commands';
import { rssFeed, schedulePost } from './content';
import { inviteGenerator } from './invite';
import { autoReply, messageCopier } from './messenger';
import {
  checkRegexChannels,
  detectSuspiciousWords,
  removeAffiliateLinks,
} from './moderator';
import { changeRoles } from './roles';
import {
  userChangeNickname,
  userChangeUsername,
  userDeleteMessage,
  userDeleteMessage as userDeleteMessageBulk,
  userIncludesLink,
  userUpdateMessage,
  userUploadAttachment,
} from './snitch';
import { bumpThreads } from './threads';
import {
  generateLogMessage,
  getTextBasedChannel,
  trackMessage,
  trackMessageIsDuplicate,
} from '../lib/utilities';
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
} from '../types';
import { webServerSetup } from './server';

/**
 * Bot configuration.
 *
 * @since 1.0.0
 */
const configSettingsBotPrefix = _.get(config, 'settings.bot-prefix');
const configSettingsServerHttpPort = _.get(config, 'settings.server-http-port');
const configSettingsServerHttpsPort = _.get(config, 'settings.server-https-port');
const configSettingsServerHttpsKey = _.get(config, 'settings.server-https-key');
const configSettingsServerHttpsCert = _.get(config, 'settings.server-https-cert');
const configSettingsServerHttpsCa = _.get(config, 'settings.server-https-ca');
const configSnitchChangeNickname = _.get(config, 'snitch.change-nickname');
const configSnitchChangeUsername = _.get(config, 'snitch.change-username');
const configSnitchDeleteMessage = _.get(config, 'snitch.delete-message');
const configSnitchIncludesLink = _.get(config, 'snitch.includes-link');
const configSnitchUpdateMessage = _.get(config, 'snitch.update-message');
const configSnitchUploadAttachment = _.get(config, 'snitch.upload-attachment');
const configCommandsBulkBan = _.get(config, 'commands.bulk-ban');
const configCommandsFetchDuplicates = _.get(config, 'commands.fetch-duplicates');
const configCommandsFetchMembers = _.get(config, 'commands.fetch-members');
const configCommandsHelpMenu = _.get(config, 'commands.help-menu');
const configCommandsRoleManager = _.get(config, 'commands.role-manager');
const configCommandsTogglePerms = _.get(config, 'commands.toggle-perms');
const configCommandsVoiceTools = _.get(config, 'commands.voice-tools');
const configApiFetchEtherscanGasOracle = _.get(config, 'api-fetch.etherscan-gas-oracle');
const configApiFetchStocktwitsTrending = _.get(config, 'api-fetch.stocktwits-trending');
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
const configInviteGenerator = _.get(config, 'invite-generator');
const configTogglePerms = _.get(config, 'toggle-perms');
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
export function initialize(client: Client, guild: Guild): void {
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
      if (new RegExp(`^${configSettingsBotPrefix}(bulk-ban|ban|bb)`).test(messageContent)) {
        bulkBan(message, configCommandsBulkBan).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: bulkBan)',
          ].join(' '),
          10,
          error,
        ));
      }

      /**
       * Fetch duplicates.
       *
       * @since 1.0.0
       */
      if (new RegExp(`^${configSettingsBotPrefix}(fetch-duplicates|duplicates|fd)`).test(messageContent)) {
        fetchDuplicates(message, configCommandsFetchDuplicates).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: fetchDuplicates)',
          ].join(' '),
          10,
          error,
        ));
      }

      /**
       * Fetch members.
       *
       * @since 1.0.0
       */
      if (new RegExp(`^${configSettingsBotPrefix}(fetch-members|members|fm)`).test(messageContent)) {
        fetchMembers(message, configCommandsFetchMembers).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: fetchMembers)',
          ].join(' '),
          10,
          error,
        ));
      }

      /**
       * Help menu.
       *
       * @since 1.0.0
       */
      if (new RegExp(`^${configSettingsBotPrefix}(help-menu|help|hm)`).test(messageContent)) {
        helpMenu(message, configCommandsHelpMenu, {
          botPrefix: configSettingsBotPrefix,
          bulkBan: configCommandsBulkBan,
          fetchDuplicates: configCommandsFetchDuplicates,
          fetchMembers: configCommandsFetchMembers,
          roleManager: configCommandsRoleManager,
          togglePerms: configCommandsTogglePerms,
          voiceTools: configCommandsVoiceTools,
        }).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: helpMenu)',
          ].join(' '),
          10,
          error,
        ));
      }

      /**
       * Role manager.
       *
       * @since 1.0.0
       */
      if (new RegExp(`^${configSettingsBotPrefix}(role-manager|role|rm)`).test(messageContent)) {
        roleManager(message, configCommandsRoleManager).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: roleManager)',
          ].join(' '),
          10,
          error,
        ));
      }

      /**
       * Toggle perms.
       *
       * @since 1.0.0
       */
      if (new RegExp(`^${configSettingsBotPrefix}(toggle-perms|perms|tp)`).test(messageContent)) {
        togglePerms(message, configCommandsTogglePerms, configTogglePerms).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: togglePerms)',
          ].join(' '),
          10,
          error,
        ));
      }

      /**
       * Voice tools.
       *
       * @since 1.0.0
       */
      if (new RegExp(`^${configSettingsBotPrefix}(voice-tools|voice|vt)`).test(messageContent)) {
        voiceTools(message, configCommandsVoiceTools).catch((error: any) => generateLogMessage(
          [
            'Failed to invoke function',
            '(function: voiceTools)',
          ].join(' '),
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user sends an API fetch request.
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
       * Etherscan gas oracle.
       *
       * @since 1.0.0
       */
      etherscanGasOracle(guild, configApiFetchEtherscanGasOracle, message);

      /**
       * Stocktwits trending.
       *
       * @since 1.0.0
       */
      stocktwitsTrending(guild, configApiFetchStocktwitsTrending, message);
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
      const trackedMessage = trackMessage(message);
      const trackedMessageIsDuplicate = trackMessageIsDuplicate(trackedMessage);

      // If message is not a repeat. Happens when Discord creates embeds from links.
      if (!trackedMessageIsDuplicate) {
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
      const trackedMessage = trackMessage(message);
      const trackedMessageIsDuplicate = trackMessageIsDuplicate(trackedMessage);

      // If message is not a repeat. Happens when Discord creates embeds from links.
      if (!trackedMessageIsDuplicate) {
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
      const sendToChannel = getTextBasedChannel(guild, _.get(configSchedulePost, 'channel.channel-id'));

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
      const sendToChannel = getTextBasedChannel(guild, _.get(configRssFeed, 'channel.channel-id'));

      rssFeed(configRssFeed, sendToChannel);
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

  /**
   * Etherscan gas oracle.
   *
   * @since 1.0.0
   */
  if (_.isPlainObject(configApiFetchEtherscanGasOracle) && !_.isEmpty(configApiFetchEtherscanGasOracle)) {
    etherscanGasOracle(guild, configApiFetchEtherscanGasOracle);
  }

  /**
   * Stocktwits trending.
   *
   * @since 1.0.0
   */
  if (_.isPlainObject(configApiFetchStocktwitsTrending) && !_.isEmpty(configApiFetchStocktwitsTrending)) {
    stocktwitsTrending(guild, configApiFetchStocktwitsTrending);
  }

  /**
   * Web server.
   *
   * @since 1.0.0
   */
  if (
    _.inRange(configSettingsServerHttpPort, 1, 65536)
    || (
      _.inRange(configSettingsServerHttpsPort, 1, 65536)
      && fs.existsSync(configSettingsServerHttpsKey)
      && fs.existsSync(configSettingsServerHttpsCert)
      && fs.existsSync(configSettingsServerHttpsCa)
    )
  ) {
    const server = express();

    /**
     * Web server setup.
     *
     * @since 1.0.0
     */
    webServerSetup(
      server,
      configSettingsServerHttpPort,
      configSettingsServerHttpsPort,
      configSettingsServerHttpsKey,
      configSettingsServerHttpsCert,
      configSettingsServerHttpsCa,
    );

    /**
     * Invite generator.
     *
     * @since 1.0.0
     */
    if (_.isPlainObject(configInviteGenerator)) {
      inviteGenerator(server, guild, configInviteGenerator);
    }
  }
}