import _ from 'lodash';

import config from '../../config.json';

import {
  generateLogMessage,
  getCollectionItems,
  trackMessage,
  trackMessageIsDuplicate,
} from '../lib/utility';
import { antiRaidAutoBan, antiRaidMembershipGate } from './anti-raid';
import { etherscanGasOracle, finnhubEarnings, stocktwitsTrending } from './api-fetch';
import { rssFeeds, schedulePosts } from './content';
import { broadcastAlertsViaGuildScheduledEventCreate, broadcastAlertsViaGuildScheduledEventDelete, broadcastAlertsViaGuildScheduledEventUpdate } from './event';
import { autoReplies, messageCopiers } from './messenger';
import {
  detectSuspiciousWords,
  impersonatorAlertsViaGuildMemberAdd,
  impersonatorAlertsViaGuildMemberUpdate,
  impersonatorAlertsViaUserUpdate,
  regexRules,
  removeAffiliates,
} from './moderator';
import { togglePerms } from './permission';
import { roleMessages, syncRoles } from './role';
import {
  bulkBan,
  fetchDuplicates,
  fetchEmojis,
  fetchMembers,
  roleManager,
  voiceTools,
} from './server-tool';
import {
  changeNickname,
  changeUsername,
  deleteMessage,
  guildJoin,
  guildLeave,
  includesLink,
  roleChange,
  updateMessage,
  uploadAttachment,
} from './snitch';
import { bumpThreads } from './thread';
import { twitterFeeds } from './twitter';
import { webApplicationsSetup } from './web-app';
import {
  AntiRaidAutoBanSettings,
  AntiRaidMembershipGateSettings,
  AutoRepliesEvents,
  BroadcastAlertsEvents,
  BulkBanSettings,
  BumpThreadsEvents,
  ChangeNicknameSettings,
  ChangeUsernameSettings,
  DeleteMessageSettings,
  DetectSuspiciousWordsSettings,
  EtherscanGasOracleSettings,
  FetchDuplicatesSettings,
  FetchEmojisSettings,
  FetchMembersSettings,
  FinnhubEarningsSettings,
  GuildJoinSettings,
  GuildLeaveSettings,
  ImpersonatorAlertsSettings,
  IncludesLinkSettings,
  InitializeDiscordClient,
  InitializeGuild,
  InitializeReturns,
  InitializeTwitterClient,
  MessageCopiersEvents,
  RegexRulesEvents,
  RemoveAffiliatesSettings,
  RoleChangeSettings,
  RoleManagerSettings,
  RoleMessagesEvents,
  RssFeedsEvents,
  SchedulePostsEvents,
  StocktwitsTrendingSettings,
  SyncRolesSettings,
  TogglePermsEvents,
  TwitterFeedsEvents,
  UpdateMessageSettings,
  UploadAttachmentSettings,
  VoiceToolsSettings,
  WebApplicationsSetupSettings,
} from '../types';

/**
 * Config.
 *
 * @since 1.0.0
 */
const configSnitchChangeNickname = <ChangeNicknameSettings>_.get(config, ['snitch', 'change-nickname']);
const configSnitchChangeUsername = <ChangeUsernameSettings>_.get(config, ['snitch', 'change-username']);
const configSnitchDeleteMessage = <DeleteMessageSettings>_.get(config, ['snitch', 'delete-message']);
const configSnitchGuildJoin = <GuildJoinSettings>_.get(config, ['snitch', 'guild-join']);
const configSnitchGuildLeave = <GuildLeaveSettings>_.get(config, ['snitch', 'guild-leave']);
const configSnitchIncludesLink = <IncludesLinkSettings>_.get(config, ['snitch', 'includes-link']);
const configSnitchRoleChange = <RoleChangeSettings>_.get(config, ['snitch', 'role-change']);
const configSnitchUpdateMessage = <UpdateMessageSettings>_.get(config, ['snitch', 'update-message']);
const configSnitchUploadAttachment = <UploadAttachmentSettings>_.get(config, ['snitch', 'upload-attachment']);
const configServerToolsBulkBan = <BulkBanSettings>_.get(config, ['server-tools', 'bulk-ban']);
const configServerToolsFetchDuplicates = <FetchDuplicatesSettings>_.get(config, ['server-tools', 'fetch-duplicates']);
const configServerToolsFetchEmojis = <FetchEmojisSettings>_.get(config, ['server-tools', 'fetch-emojis']);
const configServerToolsFetchMembers = <FetchMembersSettings>_.get(config, ['server-tools', 'fetch-members']);
const configServerToolsRoleManager = <RoleManagerSettings>_.get(config, ['server-tools', 'role-manager']);
const configServerToolsVoiceTools = <VoiceToolsSettings>_.get(config, ['server-tools', 'voice-tools']);
const configWebApplications = <WebApplicationsSetupSettings>_.get(config, ['web-applications']);
const configApiFetchEtherscanGasOracle = <EtherscanGasOracleSettings>_.get(config, ['api-fetch', 'etherscan-gas-oracle']);
const configApiFetchFinnhubEarnings = <FinnhubEarningsSettings>_.get(config, ['api-fetch', 'finnhub-earnings']);
const configApiFetchStocktwitsTrending = <StocktwitsTrendingSettings>_.get(config, ['api-fetch', 'stocktwits-trending']);
const configAntiRaidAutoBan = <AntiRaidAutoBanSettings>_.get(config, ['anti-raid', 'auto-ban']);
const configAntiRaidMembershipGate = <AntiRaidMembershipGateSettings>_.get(config, ['anti-raid', 'membership-gate']);
const configSchedulePosts = <SchedulePostsEvents>_.get(config, ['schedule-posts']);
const configRssFeeds = <RssFeedsEvents>_.get(config, ['rss-feeds']);
const configRegexRules = <RegexRulesEvents>_.get(config, ['regex-rules']);
const configDetectSuspiciousWords = <DetectSuspiciousWordsSettings>_.get(config, ['detect-suspicious-words']);
const configSyncRoles = <SyncRolesSettings>_.get(config, ['sync-roles']);
const configRoleMessages = <RoleMessagesEvents>_.get(config, ['role-messages']);
const configAutoReplies = <AutoRepliesEvents>_.get(config, ['auto-replies']);
const configMessageCopiers = <MessageCopiersEvents>_.get(config, ['message-copiers']);
const configRemoveAffiliates = <RemoveAffiliatesSettings>_.get(config, ['remove-affiliates']);
const configTogglePerms = <TogglePermsEvents>_.get(config, ['toggle-perms']);
const configBumpThreads = <BumpThreadsEvents>_.get(config, ['bump-threads']);
const configImpersonatorAlerts = <ImpersonatorAlertsSettings>_.get(config, ['impersonator-alerts']);
const configTwitterFeeds = <TwitterFeedsEvents>_.get(config, ['twitter-feeds']);
const configBroadcastAlerts = <BroadcastAlertsEvents>_.get(config, ['broadcast-alerts']);

/**
 * Initialize.
 *
 * @param {InitializeDiscordClient} discordClient - Discord client.
 * @param {InitializeTwitterClient} twitterClient - Twitter client.
 * @param {InitializeGuild}         guild         - Guild.
 *
 * @returns {InitializeReturns}
 *
 * @since 1.0.0
 */
export function initialize(discordClient: InitializeDiscordClient, twitterClient: InitializeTwitterClient, guild: InitializeGuild): InitializeReturns {
  const guildAvailable = guild.available;
  const guildId = guild.id;

  /**
   * Discord client on "messageCreate".
   *
   * @since 1.0.0
   */
  discordClient.on('messageCreate', (message) => {
    if (message.guild === null) {
      generateLogMessage(
        [
          'Failed to invoke event',
          `(event: messageCreate, guild: ${JSON.stringify(message.guild)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Invoked event',
        `(event: messageCreate, guild: ${JSON.stringify(message.guild)})`,
      ].join(' '),
      40,
    );

    const messageAuthorBot = message.author.bot;
    const messageGuildAvailable = message.guild.available;
    const messageGuildId = message.guild.id;
    const messageSystem = message.system;

    if (
      messageGuildAvailable // If guild (where message was sent in) is online.
      && messageGuildId === guildId // If message was sent in configured guild.
      && !messageAuthorBot // If message is not sent by a bot.
      && !messageSystem // If message is not sent by system.
    ) {
      const trackedMessage = trackMessage(message);
      const trackedMessageIsDuplicate = trackMessageIsDuplicate(trackedMessage);

      /**
       * If message is not a duplicate.
       *
       * Discord creates embeds from links and fires the "messageUpdate"
       * event causing repeated executions.
       *
       * @since 1.0.0
       */
      if (!trackedMessageIsDuplicate) {
        /**
         * Detect suspicious words.
         *
         * @since 1.0.0
         */
        detectSuspiciousWords(message, configDetectSuspiciousWords);

        /**
         * Includes link.
         *
         * @since 1.0.0
         */
        includesLink(message, guild, configSnitchIncludesLink);

        /**
         * Regex rules.
         *
         * @since 1.0.0
         */
        regexRules(message, configRegexRules);

        /**
         * Remove affiliates.
         *
         * @since 1.0.0
         */
        removeAffiliates(message, configRemoveAffiliates);
      }

      /**
       * Auto replies.
       *
       * @since 1.0.0
       */
      autoReplies(message, configAutoReplies);

      /**
       * Bulk ban.
       *
       * @since 1.0.0
       */
      bulkBan(message, configServerToolsBulkBan);

      /**
       * Etherscan gas oracle.
       *
       * @since 1.0.0
       */
      etherscanGasOracle(message, guild, configApiFetchEtherscanGasOracle);

      /**
       * Fetch duplicates.
       *
       * @since 1.0.0
       */
      fetchDuplicates(message, configServerToolsFetchDuplicates);

      /**
       * Fetch emojis.
       *
       * @since 1.0.0
       */
      fetchEmojis(message, configServerToolsFetchEmojis);

      /**
       * Fetch members.
       *
       * @since 1.0.0
       */
      fetchMembers(message, configServerToolsFetchMembers);

      /**
       * Finnhub earnings.
       *
       * @since 1.0.0
       */
      finnhubEarnings(message, guild, configApiFetchFinnhubEarnings);

      /**
       * Message copiers.
       *
       * @since 1.0.0
       */
      messageCopiers(message, twitterClient, configMessageCopiers);

      /**
       * Role manager.
       *
       * @since 1.0.0
       */
      roleManager(message, configServerToolsRoleManager);

      /**
       * Stocktwits trending.
       *
       * @since 1.0.0
       */
      stocktwitsTrending(message, guild, configApiFetchStocktwitsTrending);

      /**
       * Toggle perms.
       *
       * @since 1.0.0
       */
      togglePerms(message, guild, configTogglePerms);

      /**
       * Upload attachment.
       *
       * @since 1.0.0
       */
      uploadAttachment(message, guild, configSnitchUploadAttachment);

      /**
       * Voice tools.
       *
       * @since 1.0.0
       */
      voiceTools(message, configServerToolsVoiceTools);
    }
  });

  /**
   * Discord client on "messageUpdate".
   *
   * @since 1.0.0
   */
  discordClient.on('messageUpdate', (message) => {
    if (
      message.author === null
      || message.guild === null
    ) {
      generateLogMessage(
        [
          'Failed to invoke event',
          `(event: messageUpdate, author: ${JSON.stringify(message.author)}, guild: ${JSON.stringify(message.guild)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Invoked event',
        `(event: messageUpdate, author: ${JSON.stringify(message.author)}, guild: ${JSON.stringify(message.guild)})`,
      ].join(' '),
      40,
    );

    const messageAuthorBot = message.author.bot;
    const messageGuildAvailable = message.guild.available;
    const messageGuildId = message.guild.id;
    const messagePartial = message.partial;
    const messageSystem = message.system;

    if (
      !messagePartial
      && messageGuildAvailable // If guild (where message was sent in) is online.
      && messageGuildId === guildId // If message was sent in configured guild.
      && !messageAuthorBot // If message is not sent by a bot.
      && !messageSystem // If message is not sent by system.
    ) {
      const trackedMessage = trackMessage(message);
      const trackedMessageIsDuplicate = trackMessageIsDuplicate(trackedMessage);

      /**
       * If message is not a duplicate.
       *
       * Discord creates embeds from links and fires the "messageUpdate"
       * event causing repeated executions.
       *
       * @since 1.0.0
       */
      if (!trackedMessageIsDuplicate) {
        /**
         * Detect suspicious words.
         *
         * @since 1.0.0
         */
        detectSuspiciousWords(message, configDetectSuspiciousWords);

        /**
         * Includes link.
         *
         * @since 1.0.0
         */
        includesLink(message, guild, configSnitchIncludesLink);

        /**
         * Regex rules.
         *
         * @since 1.0.0
         */
        regexRules(message, configRegexRules);

        /**
         * Remove affiliates.
         *
         * @since 1.0.0
         */
        removeAffiliates(message, configRemoveAffiliates);
      }

      /**
       * Update message.
       *
       * @since 1.0.0
       */
      updateMessage(message, guild, configSnitchUpdateMessage);
    }
  });

  /**
   * Discord client on "messageDelete".
   *
   * @since 1.0.0
   */
  discordClient.on('messageDelete', (message) => {
    if (
      message.author === null
      || message.guild === null
    ) {
      generateLogMessage(
        [
          'Failed to invoke event',
          `(event: messageDelete, author: ${JSON.stringify(message.author)}, guild: ${JSON.stringify(message.guild)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Invoked event',
        `(event: messageDelete, author: ${JSON.stringify(message.author)}, guild: ${JSON.stringify(message.guild)})`,
      ].join(' '),
      40,
    );

    const messageAuthorBot = message.author.bot;
    const messageGuildAvailable = message.guild.available;
    const messageGuildId = message.guild.id;
    const messagePartial = message.partial;
    const messageSystem = message.system;

    if (
      !messagePartial
      && messageGuildAvailable // If guild (where message was sent in) is online.
      && messageGuildId === guildId // If message was sent in configured guild.
      && !messageAuthorBot // If message is not sent by a bot.
      && !messageSystem // If message is not sent by system.
    ) {
      /**
       * Delete message.
       *
       * @since 1.0.0
       */
      deleteMessage(message, guild, configSnitchDeleteMessage);
    }
  });

  /**
   * Discord client on "messageDeleteBulk".
   *
   * @since 1.0.0
   */
  discordClient.on('messageDeleteBulk', (messagesCollection) => {
    const messages = getCollectionItems(messagesCollection);

    messages.forEach((message) => {
      if (
        message.author === null
        || message.guild === null
      ) {
        generateLogMessage(
          [
            'Failed to invoke event',
            `(event: messageDeleteBulk, author: ${JSON.stringify(message.author)}, guild: ${JSON.stringify(message.guild)})`,
          ].join(' '),
          10,
        );

        return;
      }

      generateLogMessage(
        [
          'Invoked event',
          `(event: messageDeleteBulk, author: ${JSON.stringify(message.author)}, guild: ${JSON.stringify(message.guild)})`,
        ].join(' '),
        40,
      );

      const messageAuthorBot = message.author.bot;
      const messageGuildAvailable = message.guild.available;
      const messageGuildId = message.guild.id;
      const messagePartial = message.partial;
      const messageSystem = message.system;

      if (
        !messagePartial
        && messageGuildAvailable // If guild (where message was sent in) is online.
        && messageGuildId === guildId // If message was sent in configured guild.
        && !messageAuthorBot // If message is not sent by a bot.
        && !messageSystem // If message is not sent by system.
      ) {
        /**
         * Delete message.
         *
         * @since 1.0.0
         */
        deleteMessage(message, guild, configSnitchDeleteMessage);
      }
    });
  });

  /**
   * Discord client on "guildMemberAdd".
   *
   * @since 1.0.0
   */
  discordClient.on('guildMemberAdd', (member) => {
    const memberGuildAvailable = member.guild.available;
    const memberGuildId = member.guild.id;
    const memberUserBot = member.user.bot;
    const memberUserSystem = member.user.system;

    if (
      memberGuildAvailable // If guild (where member is) is online.
      && memberGuildId === guildId // If member is in configured guild.
      && !memberUserBot // If member is not a bot.
      && !memberUserSystem // If member is not system.
    ) {
      /**
       * Anti-raid auto ban.
       *
       * @since 1.0.0
       */
      antiRaidAutoBan(member, configAntiRaidAutoBan);

      /**
       * Guild join.
       *
       * @since 1.0.0
       */
      guildJoin(member, guild, configSnitchGuildJoin);

      /**
       * Impersonator alerts via "guildMemberAdd".
       *
       * @since 1.0.0
       */
      impersonatorAlertsViaGuildMemberAdd(member, guild, configImpersonatorAlerts);
    }
  });

  /**
   * Discord client on "guildMemberUpdate".
   *
   * @since 1.0.0
   */
  discordClient.on('guildMemberUpdate', (oldMember, newMember) => {
    const oldMemberGuildAvailable = oldMember.guild.available;
    const oldMemberGuildId = oldMember.guild.id;
    const oldMemberPartial = oldMember.partial;
    const oldMemberUserBot = oldMember.user.bot;
    const oldMemberUserSystem = oldMember.user.system;

    const newMemberGuildAvailable = newMember.guild.available;
    const newMemberGuildId = newMember.guild.id;
    const newMemberUserBot = newMember.user.bot;
    const newMemberUserSystem = newMember.user.system;

    if (
      !oldMemberPartial
      && oldMemberGuildAvailable // If guild (where old member is) is online.
      && newMemberGuildAvailable // If guild (where new member is) is online.
      && oldMemberGuildId === guildId // If old member is in configured guild.
      && newMemberGuildId === guildId // If new member is in configured guild.
      && !oldMemberUserBot // If old member is not a bot.
      && !newMemberUserBot // If new member is not a bot.
      && !oldMemberUserSystem // If old member is not system.
      && !newMemberUserSystem // If new member is not system.
    ) {
      /**
       * Anti-raid membership gate.
       *
       * @since 1.0.0
       */
      antiRaidMembershipGate(oldMember, newMember, guild, configAntiRaidMembershipGate);

      /**
       * Change nickname.
       *
       * @since 1.0.0
       */
      changeNickname(oldMember, newMember, guild, configSnitchChangeNickname);

      /**
       * Impersonator alerts via "guildMemberUpdate".
       *
       * @since 1.0.0
       */
      impersonatorAlertsViaGuildMemberUpdate(oldMember, newMember, guild, configImpersonatorAlerts);

      /**
       * Role change.
       *
       * @since 1.0.0
       */
      roleChange(oldMember, newMember, guild, configSnitchRoleChange);

      /**
       * Role messages.
       *
       * @since 1.0.0
       */
      roleMessages(oldMember, newMember, guild, configRoleMessages);

      /**
       * Sync roles.
       *
       * @since 1.0.0
       */
      syncRoles(newMember, guild, configSyncRoles);
    }
  });

  /**
   * Discord client on "guildMemberRemove".
   *
   * @since 1.0.0
   */
  discordClient.on('guildMemberRemove', (member) => {
    const memberGuildAvailable = member.guild.available;
    const memberGuildId = member.guild.id;
    const memberPartial = member.partial;
    const memberUserBot = member.user.bot;
    const memberUserSystem = member.user.system;

    if (
      !memberPartial
      && memberGuildAvailable // If guild (where member is) is online.
      && memberGuildId === guildId // If member is in configured guild.
      && !memberUserBot // If member is not a bot.
      && !memberUserSystem // If member is not system.
    ) {
      /**
       * Guild leave.
       *
       * @since 1.0.0
       */
      guildLeave(member, guild, configSnitchGuildLeave);
    }
  });

  /**
   * Discord client on "userUpdate".
   *
   * @since 1.0.0
   */
  discordClient.on('userUpdate', (oldUser, newUser) => {
    const oldUserBot = oldUser.bot;
    const oldUserPartial = oldUser.partial;
    const oldUserSystem = oldUser.system;

    const newUserBot = newUser.bot;
    const newUserSystem = newUser.system;

    if (
      !oldUserPartial
      && guildAvailable // If guild is online.
      && !oldUserBot // If old user is not a bot.
      && !newUserBot // If new user is not a bot.
      && !oldUserSystem // If old user is not system.
      && !newUserSystem // If new user is not system.
    ) {
      /**
       * Change username.
       *
       * @since 1.0.0
       */
      changeUsername(oldUser, newUser, guild, configSnitchChangeUsername);

      /**
       * Impersonator alerts via "userUpdate".
       *
       * @since 1.0.0
       */
      impersonatorAlertsViaUserUpdate(oldUser, newUser, guild, configImpersonatorAlerts);
    }
  });

  /**
   * Discord client on "guildScheduledEventCreate".
   *
   * @since 1.0.0
   */
  discordClient.on('guildScheduledEventCreate', (scheduledEvent) => {
    if (
      scheduledEvent.creator === null
      || scheduledEvent.guild === null
    ) {
      generateLogMessage(
        [
          'Failed to invoke event',
          `(event: guildScheduledEventCreate, creator: ${JSON.stringify(scheduledEvent.creator)}, guild: ${JSON.stringify(scheduledEvent.guild)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Invoked event',
        `(event: guildScheduledEventCreate, creator: ${JSON.stringify(scheduledEvent.creator)}, guild: ${JSON.stringify(scheduledEvent.guild)})`,
      ].join(' '),
      40,
    );

    const scheduledEventCreatorBot = scheduledEvent.creator.bot;
    const scheduledEventCreatorSystem = scheduledEvent.creator.system;
    const scheduledEventGuildAvailable = scheduledEvent.guild.available;
    const scheduledEventGuildId = scheduledEvent.guild.id;

    if (
      scheduledEventGuildAvailable // If guild (where scheduled event was created in) is online.
      && scheduledEventGuildId === guildId // If scheduled event was created in configured guild.
      && !scheduledEventCreatorBot // If scheduled event creator is not a bot.
      && !scheduledEventCreatorSystem // If scheduled event creator is not system.
    ) {
      /**
       * Broadcast alerts via "guildScheduledEventCreate".
       *
       * @since 1.0.0
       */
      broadcastAlertsViaGuildScheduledEventCreate(scheduledEvent, twitterClient, guild, configBroadcastAlerts);
    }
  });

  /**
   * Discord client on "guildScheduledEventUpdate".
   *
   * @since 1.0.0
   */
  discordClient.on('guildScheduledEventUpdate', (oldScheduledEvent, newScheduledEvent) => {
    if (
      oldScheduledEvent.creator === null
      || oldScheduledEvent.guild === null
      || newScheduledEvent.creator === null
      || newScheduledEvent.guild === null
    ) {
      generateLogMessage(
        [
          'Failed to invoke event',
          `(event: guildScheduledEventUpdate, old creator: ${JSON.stringify(oldScheduledEvent.creator)}, old guild: ${JSON.stringify(oldScheduledEvent.guild)}, new creator: ${JSON.stringify(newScheduledEvent.creator)}, new guild: ${JSON.stringify(newScheduledEvent.guild)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Invoked event',
        `(event: guildScheduledEventUpdate, old creator: ${JSON.stringify(oldScheduledEvent.creator)}, old guild: ${JSON.stringify(oldScheduledEvent.guild)}, new creator: ${JSON.stringify(newScheduledEvent.creator)}, new guild: ${JSON.stringify(newScheduledEvent.guild)})`,
      ].join(' '),
      40,
    );

    const oldScheduledEventCreatorBot = oldScheduledEvent.creator.bot;
    const oldScheduledEventCreatorSystem = oldScheduledEvent.creator.system;
    const oldScheduledEventGuildAvailable = oldScheduledEvent.guild.available;
    const oldScheduledEventGuildId = oldScheduledEvent.guild.id;

    const newScheduledEventCreatorBot = newScheduledEvent.creator.bot;
    const newScheduledEventCreatorSystem = newScheduledEvent.creator.system;
    const newScheduledEventGuildAvailable = newScheduledEvent.guild.available;
    const newScheduledEventGuildId = newScheduledEvent.guild.id;

    if (
      oldScheduledEventGuildAvailable // If guild (where old scheduled event was created in) is online.
      && newScheduledEventGuildAvailable // If guild (where new scheduled event was created in) is online.
      && oldScheduledEventGuildId === guildId // If old scheduled event was created in configured guild.
      && newScheduledEventGuildId === guildId // If new scheduled event was created in configured guild.
      && !oldScheduledEventCreatorBot // If old scheduled event creator is not a bot.
      && !newScheduledEventCreatorBot // If new scheduled event creator is not a bot.
      && !oldScheduledEventCreatorSystem // If old scheduled event creator is not system.
      && !newScheduledEventCreatorSystem // If new scheduled event creator is not system.
    ) {
      /**
       * Broadcast alerts via "guildScheduledEventUpdate".
       *
       * @since 1.0.0
       */
      broadcastAlertsViaGuildScheduledEventUpdate(oldScheduledEvent, newScheduledEvent, twitterClient, guild, configBroadcastAlerts);
    }
  });

  /**
   * Discord client on "guildScheduledEventDelete".
   *
   * @since 1.0.0
   */
  discordClient.on('guildScheduledEventDelete', (scheduledEvent) => {
    if (
      scheduledEvent.creator === null
      || scheduledEvent.guild === null
    ) {
      generateLogMessage(
        [
          'Failed to invoke event',
          `(event: guildScheduledEventDelete, creator: ${JSON.stringify(scheduledEvent.creator)}, guild: ${JSON.stringify(scheduledEvent.guild)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Invoked event',
        `(event: guildScheduledEventDelete, creator: ${JSON.stringify(scheduledEvent.creator)}, guild: ${JSON.stringify(scheduledEvent.guild)})`,
      ].join(' '),
      40,
    );

    const scheduledEventCreatorBot = scheduledEvent.creator.bot;
    const scheduledEventCreatorSystem = scheduledEvent.creator.system;
    const scheduledEventGuildAvailable = scheduledEvent.guild.available;
    const scheduledEventGuildId = scheduledEvent.guild.id;

    if (
      scheduledEventGuildAvailable // If guild (where scheduled event was created in) is online.
      && scheduledEventGuildId === guildId // If scheduled event was created in configured guild.
      && !scheduledEventCreatorBot // If scheduled event creator is not a bot.
      && !scheduledEventCreatorSystem // If scheduled event creator is not system.
    ) {
      /**
       * Broadcast alerts via "guildScheduledEventDelete".
       *
       * @since 1.0.0
       */
      broadcastAlertsViaGuildScheduledEventDelete(scheduledEvent, twitterClient, guild, configBroadcastAlerts);
    }
  });

  /**
   * Discord client on "error".
   *
   * @since 1.0.0
   */
  discordClient.on('error', (error) => {
    generateLogMessage(
      [
        'A client error has occurred',
        '(event: error)',
      ].join(' '),
      10,
      error,
    );
  });

  /**
   * Bump threads.
   *
   * @since 1.0.0
   */
  bumpThreads(guild, configBumpThreads);

  /**
   * Etherscan gas oracle.
   *
   * @since 1.0.0
   */
  etherscanGasOracle(undefined, guild, configApiFetchEtherscanGasOracle);

  /**
   * Finnhub earnings.
   *
   * @since 1.0.0
   */
  finnhubEarnings(undefined, guild, configApiFetchFinnhubEarnings);

  /**
   * Rss feeds.
   *
   * @since 1.0.0
   */
  rssFeeds(guild, configRssFeeds);

  /**
   * Schedule posts.
   *
   * @since 1.0.0
   */
  schedulePosts(guild, configSchedulePosts);

  /**
   * Stocktwits trending.
   *
   * @since 1.0.0
   */
  stocktwitsTrending(undefined, guild, configApiFetchStocktwitsTrending);

  /**
   * Toggle perms.
   *
   * @since 1.0.0
   */
  togglePerms(undefined, guild, configTogglePerms);

  /**
   * Twitter feeds.
   *
   * @since 1.0.0
   */
  twitterFeeds(twitterClient, guild, configTwitterFeeds);

  /**
   * Web applications setup.
   *
   * @since 1.0.0
   */
  webApplicationsSetup(guild, configWebApplications);
}
