import { ChannelMention, MessageOptions } from 'discord.js';
import _ from 'lodash';

import { createRemoveAffiliatesEmbed, createSuspiciousWordsEmbed } from '../lib/embed';
import {
  generateLogMessage,
  getCollectionItems,
  getTextBasedChannel,
  memberHasPermissions,
} from '../lib/utility';
import {
  DetectSuspiciousWordsMessage,
  DetectSuspiciousWordsReturns,
  DetectSuspiciousWordsSettings,
  DetectSuspiciousWordsSettingsCategories,
  DetectSuspiciousWordsSettingsCategoryCategory,
  DetectSuspiciousWordsSettingsCategoryWords,
  DetectSuspiciousWordsSettingsChannelChannelId,
  ImpersonatorAlertsGuild,
  ImpersonatorAlertsMemberOrUser,
  ImpersonatorAlertsNicknameOrUsername,
  ImpersonatorAlertsReplaceVariablesConfigPayload,
  ImpersonatorAlertsReplaceVariablesReturns,
  ImpersonatorAlertsReturns,
  ImpersonatorAlertsSettings,
  ImpersonatorAlertsSettingsChannelChannelId,
  ImpersonatorAlertsSettingsEntities,
  ImpersonatorAlertsSettingsEntityName,
  ImpersonatorAlertsSettingsEntityPayload,
  ImpersonatorAlertsSettingsEntityRegexFlags,
  ImpersonatorAlertsSettingsEntityRegexPattern,
  ImpersonatorAlertsSettingsEntityUserUserId,
  ImpersonatorAlertsViaGuildMemberAddGuild,
  ImpersonatorAlertsViaGuildMemberAddMember,
  ImpersonatorAlertsViaGuildMemberAddReturns,
  ImpersonatorAlertsViaGuildMemberAddSettings,
  ImpersonatorAlertsViaGuildMemberUpdateGuild,
  ImpersonatorAlertsViaGuildMemberUpdateNewMember,
  ImpersonatorAlertsViaGuildMemberUpdateOldMember,
  ImpersonatorAlertsViaGuildMemberUpdateReturns,
  ImpersonatorAlertsViaGuildMemberUpdateSettings,
  ImpersonatorAlertsViaUserUpdateGuild,
  ImpersonatorAlertsViaUserUpdateNewUser,
  ImpersonatorAlertsViaUserUpdateOldUser,
  ImpersonatorAlertsViaUserUpdateReturns,
  ImpersonatorAlertsViaUserUpdateSettings,
  RegexRulesEventChannelChannelId,
  RegexRulesEventDirectMessagePayload,
  RegexRulesEventExcludedRoleRoleId,
  RegexRulesEventExcludedRoles,
  RegexRulesEventMatch,
  RegexRulesEventName,
  RegexRulesEventRegexFlags,
  RegexRulesEventRegexPattern,
  RegexRulesEvents,
  RegexRulesMessage,
  RegexRulesReturns,
  RemoveAffiliatesMessage,
  RemoveAffiliatesReturns,
  RemoveAffiliatesSettings,
  RemoveAffiliatesSettingsChannelChannelId,
  RemoveAffiliatesSettingsDirectMessagePayload,
  RemoveAffiliatesSettingsExcludedRoleRoleId,
  RemoveAffiliatesSettingsExcludedRoles,
  RemoveAffiliatesSettingsPlatformPlatform,
  RemoveAffiliatesSettingsPlatformRegexFlags,
  RemoveAffiliatesSettingsPlatformRegexPattern,
  RemoveAffiliatesSettingsPlatforms,
} from '../types';
import { MemoryDetectSuspiciousWordsDetectedCategories, MemoryRemoveAffiliatesDetectedAffiliates } from '../types/memory';

/**
 * Detect suspicious words.
 *
 * @param {DetectSuspiciousWordsMessage}  message  - Message.
 * @param {DetectSuspiciousWordsSettings} settings - Settings.
 *
 * @returns {DetectSuspiciousWordsReturns}
 *
 * @since 1.0.0
 */
export function detectSuspiciousWords(message: DetectSuspiciousWordsMessage, settings: DetectSuspiciousWordsSettings): DetectSuspiciousWordsReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: detectSuspiciousWords, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: detectSuspiciousWords, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageContent = message.reactions.message.content ?? message.content;
  const messageGuild = message.guild;
  const messageId = message.id;
  const messageMember = message.member;
  const messageUrl = message.url;

  const settingsCategories = <DetectSuspiciousWordsSettingsCategories>_.get(settings, ['categories']);
  const settingsChannelChannelId = <DetectSuspiciousWordsSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const attachments = getCollectionItems(messageAttachments);
  const channel = getTextBasedChannel(messageGuild, settingsChannelChannelId);

  const cleanedMessage = messageContent
    .normalize('NFKC')
    .replace(/[.,\\/<>@#!?$%^&*;:{}=+|\-_'“"”`~[\]()]/g, '') // Remove all special characters.
    .replace(/0/g, 'o') // Convert "0" to "o".
    .replace(/1/g, 'l') // Convert "1" to "l".
    .replace(/2/g, 'z') // Convert "2" to "z".
    .replace(/3/g, 'e') // Convert "3" to "e".
    .replace(/4/g, 'a') // Convert "4" to "a".
    .replace(/5/g, 's') // Convert "5" to "s".
    .replace(/6/g, 'g') // Convert "6" to "g".
    .replace(/7/g, 't') // Convert "7" to "t".
    .replace(/8/g, 'b') // Convert "8" to "b".
    .toLowerCase();

  const detectedCategories: MemoryDetectSuspiciousWordsDetectedCategories = [];

  let payload: MessageOptions = {};

  // If "suspicious-words" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"suspicious-words" is not configured',
        `(function: detectSuspiciousWords, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "suspicious-words.categories" is not configured properly.
  if (
    !_.isArray(settingsCategories)
    || _.isEmpty(settingsCategories)
    || !_.every(settingsCategories, (settingsCategory) => _.isPlainObject(settingsCategory) && !_.isEmpty(settingsCategory))
  ) {
    generateLogMessage(
      [
        '"suspicious-words.categories" is not configured properly',
        `(function: detectSuspiciousWords, categories: ${JSON.stringify(settingsCategories)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "suspicious-words.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"suspicious-words.channel.channel-id" is not configured properly',
        `(function: detectSuspiciousWords, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  settingsCategories.forEach((settingsCategory, settingsCategoryKey) => {
    const theCategory = <DetectSuspiciousWordsSettingsCategoryCategory>_.get(settingsCategory, ['category']) ?? 'Unknown';
    const theWords = <DetectSuspiciousWordsSettingsCategoryWords>_.get(settingsCategory, ['words']);

    // If "suspicious-words.categories[${settingsCategoryKey}].category" is not configured properly.
    if (
      !_.isString(theCategory)
      || _.isEmpty(theCategory)
    ) {
      generateLogMessage(
        [
          `"suspicious-words.categories[${settingsCategoryKey}].category" is not configured properly`,
          `(function: detectSuspiciousWords, category: ${JSON.stringify(theCategory)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "suspicious-words.categories[${settingsCategoryKey}].words" is not configured properly.
    if (
      !_.isArray(theWords)
      || _.isEmpty(theWords)
      || !_.every(theWords, (theWord) => _.isString(theWord) && !_.isEmpty(theWord))
    ) {
      generateLogMessage(
        [
          `"suspicious-words.categories[${settingsCategoryKey}].words" is not configured properly`,
          `(function: detectSuspiciousWords, category: ${JSON.stringify(theCategory)}, words: ${JSON.stringify(theWords)})`,
        ].join(' '),
        10,
      );

      return;
    }

    try {
      const regExp = new RegExp(`(?:[\\s]|^)(${theWords.join('|')})(?=[\\s]|$)`);

      generateLogMessage(
        [
          'Constructed regular expression object',
          `(function: detectSuspiciousWords, category: ${JSON.stringify(theCategory)}, words: ${JSON.stringify(theWords)})`,
        ].join(' '),
        40,
      );

      if (regExp.test(cleanedMessage)) {
        detectedCategories.push(theCategory);
      }
    } catch (error) {
      generateLogMessage(
        [
          'Failed to construct regular expression object',
          `(function: detectSuspiciousWords, category: ${JSON.stringify(theCategory)}, words: ${JSON.stringify(theWords)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });

  if (detectedCategories.length === 0) {
    generateLogMessage(
      [
        'Failed suspicious words match',
        `(function: detectSuspiciousWords, cleaned message: ${JSON.stringify(cleanedMessage)}, detected categories: ${JSON.stringify(detectedCategories)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed suspicious words match',
      `(function: detectSuspiciousWords, cleaned message: ${JSON.stringify(cleanedMessage)}, detected categories: ${JSON.stringify(detectedCategories)})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createSuspiciousWordsEmbed(
        messageMember.toString(),
        // TODO Fix return type of "toString()" on channels (https://github.com/discordjs/discord.js/pull/7836).
        <ChannelMention>messageChannel.toString(),
        messageId,
        messageContent,
        attachments,
        messageUrl,
        detectedCategories,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: detectSuspiciousWords, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: detectSuspiciousWords, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Impersonator alerts.
 *
 * @param {ImpersonatorAlertsNicknameOrUsername} nicknameOrUsername - Nickname or username.
 * @param {ImpersonatorAlertsMemberOrUser}       memberOrUser       - Member or user.
 * @param {ImpersonatorAlertsGuild}              guild              - Guild.
 * @param {ImpersonatorAlertsSettings}           settings           - Settings.
 *
 * @returns {ImpersonatorAlertsReturns}
 *
 * @since 1.0.0
 */
export function impersonatorAlerts(nicknameOrUsername: ImpersonatorAlertsNicknameOrUsername, memberOrUser: ImpersonatorAlertsMemberOrUser, guild: ImpersonatorAlertsGuild, settings: ImpersonatorAlertsSettings): ImpersonatorAlertsReturns {
  const memberOrUserId = memberOrUser.id;

  const guildMembers = guild.members;

  const settingsEntities = <ImpersonatorAlertsSettingsEntities>_.get(settings, ['entities']);
  const settingsChannelChannelId = <ImpersonatorAlertsSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  /**
   * Impersonator alerts - Replace variables.
   *
   * @param {ImpersonatorAlertsReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {ImpersonatorAlertsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: ImpersonatorAlertsReplaceVariablesConfigPayload): ImpersonatorAlertsReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%MEMBER_USER_MENTION%/g, memberOrUser.toString());

    return JSON.parse(editedPayload);
  };

  // If "impersonator-alerts" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"impersonator-alerts" is not configured',
        `(function: impersonatorAlerts, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "impersonator-alerts.entities" is not configured properly.
  if (
    !_.isArray(settingsEntities)
    || _.isEmpty(settingsEntities)
    || !_.every(settingsEntities, (settingsEntity) => _.isPlainObject(settingsEntity) && !_.isEmpty(settingsEntity))
  ) {
    generateLogMessage(
      [
        '"impersonator-alerts.entities" is not configured properly',
        `(function: impersonatorAlerts, entities: ${JSON.stringify(settingsEntities)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "impersonator-alerts.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"impersonator-alerts.channel.channel-id" is not configured properly',
        `(function: impersonatorAlerts, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  settingsEntities.forEach((settingsEntity, settingsEntityKey) => {
    const theName = <ImpersonatorAlertsSettingsEntityName>_.get(settingsEntity, ['name']) ?? 'Unknown';
    const theUserUserId = <ImpersonatorAlertsSettingsEntityUserUserId>_.get(settingsEntity, ['user', 'user-id']);
    const theRegexPattern = <ImpersonatorAlertsSettingsEntityRegexPattern>_.get(settingsEntity, ['regex', 'pattern']);
    const theRegexFlags = <ImpersonatorAlertsSettingsEntityRegexFlags>_.get(settingsEntity, ['regex', 'flags']);
    const thePayload = <ImpersonatorAlertsSettingsEntityPayload>_.get(settingsEntity, ['payload']);

    let payload: MessageOptions = {};

    // If "impersonator-alerts.entities[${settingsEntityKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"impersonator-alerts.entities[${settingsEntityKey}].name" is not configured properly`,
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "impersonator-alerts.entities[${settingsEntityKey}].user.user-id" is not configured properly.
    if (
      theUserUserId !== undefined
      && guildMembers.resolve(theUserUserId) === null
    ) {
      generateLogMessage(
        [
          `"impersonator-alerts.entities[${settingsEntityKey}].user.user-id" is not configured properly`,
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, user id: ${JSON.stringify(theUserUserId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "impersonator-alerts.entities[${settingsEntityKey}].regex.pattern" is not configured properly.
    if (!_.isString(theRegexPattern)) {
      generateLogMessage(
        [
          `"impersonator-alerts.entities[${settingsEntityKey}].regex.pattern" is not configured properly`,
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "impersonator-alerts.entities[${settingsEntityKey}].regex.flags" is not configured properly.
    if (
      theRegexFlags !== undefined
      && !_.isString(theRegexFlags)
    ) {
      generateLogMessage(
        [
          `"impersonator-alerts.entities[${settingsEntityKey}].regex.flags" is not configured properly`,
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "impersonator-alerts.entities[${settingsEntityKey}].payload" is not configured properly.
    if (
      thePayload !== undefined
      && (
        !_.isPlainObject(thePayload)
        || _.isEmpty(thePayload)
      )
    ) {
      generateLogMessage(
        [
          `"impersonator-alerts.entities[${settingsEntityKey}].payload" is not configured properly`,
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(thePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // User cannot impersonate themself.
    if (
      theUserUserId !== undefined
      && theUserUserId === memberOrUserId
    ) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, specified user id: ${JSON.stringify(theUserUserId)}, current member or user id: ${JSON.stringify(memberOrUserId)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, specified user id: ${JSON.stringify(theUserUserId)}, current member or user id: ${JSON.stringify(memberOrUserId)})`,
      ].join(' '),
      40,
    );

    try {
      const regExp = new RegExp(theRegexPattern, theRegexFlags);

      generateLogMessage(
        [
          'Constructed regular expression object',
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        40,
      );

      if (regExp.test(nicknameOrUsername)) {
        if (
          thePayload !== undefined
          && _.isPlainObject(thePayload)
          && !_.isEmpty(thePayload)
        ) {
          payload = replaceVariables(thePayload);
        } else {
          payload = {
            content: 'An impersonator was detected.',
          };
        }

        generateLogMessage(
          [
            'Passed regex rule match',
            `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, member or user: ${JSON.stringify(memberOrUser.toString())}, test: ${JSON.stringify(regExp.test(nicknameOrUsername))})`,
          ].join(' '),
          40,
        );

        channel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      } else {
        generateLogMessage(
          [
            'Failed regex rule match',
            `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, member or user: ${JSON.stringify(memberOrUser.toString())}, test: ${JSON.stringify(regExp.test(nicknameOrUsername))})`,
          ].join(' '),
          40,
        );
      }
    } catch (error) {
      generateLogMessage(
        [
          'Failed to construct regular expression object',
          `(function: impersonatorAlerts, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Impersonator alerts via "guildMemberAdd".
 *
 * @param {ImpersonatorAlertsViaGuildMemberAddMember}   member   - Member.
 * @param {ImpersonatorAlertsViaGuildMemberAddGuild}    guild    - Guild.
 * @param {ImpersonatorAlertsViaGuildMemberAddSettings} settings - Settings.
 *
 * @returns {ImpersonatorAlertsViaGuildMemberAddReturns}
 *
 * @since 1.0.0
 */
export function impersonatorAlertsViaGuildMemberAdd(member: ImpersonatorAlertsViaGuildMemberAddMember, guild: ImpersonatorAlertsViaGuildMemberAddGuild, settings: ImpersonatorAlertsViaGuildMemberAddSettings): ImpersonatorAlertsViaGuildMemberAddReturns {
  const memberUserUsername = member.user.username;

  impersonatorAlerts(memberUserUsername, member, guild, settings);
}

/**
 * Impersonator alerts via "guildMemberUpdate".
 *
 * @param {ImpersonatorAlertsViaGuildMemberUpdateOldMember} oldMember - Member (old).
 * @param {ImpersonatorAlertsViaGuildMemberUpdateNewMember} newMember - Member (new).
 * @param {ImpersonatorAlertsViaGuildMemberUpdateGuild}     guild     - Guild.
 * @param {ImpersonatorAlertsViaGuildMemberUpdateSettings}  settings  - Settings.
 *
 * @returns {ImpersonatorAlertsViaGuildMemberUpdateReturns}
 *
 * @since 1.0.0
 */
export function impersonatorAlertsViaGuildMemberUpdate(oldMember: ImpersonatorAlertsViaGuildMemberUpdateOldMember, newMember: ImpersonatorAlertsViaGuildMemberUpdateNewMember, guild: ImpersonatorAlertsViaGuildMemberUpdateGuild, settings: ImpersonatorAlertsViaGuildMemberUpdateSettings): ImpersonatorAlertsViaGuildMemberUpdateReturns {
  const oldMemberNickname = oldMember.nickname;

  const newMemberNickname = newMember.nickname;

  // If user did not change their nickname or nickname was removed.
  if (
    oldMemberNickname === newMemberNickname
    || newMemberNickname === null
  ) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: impersonatorAlertsViaGuildMemberUpdate, old nickname: ${JSON.stringify(oldMemberNickname)}, new nickname: ${JSON.stringify(newMemberNickname)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: impersonatorAlertsViaGuildMemberUpdate, old nickname: ${JSON.stringify(oldMemberNickname)}, new nickname: ${JSON.stringify(newMemberNickname)})`,
    ].join(' '),
    40,
  );

  impersonatorAlerts(newMemberNickname, newMember, guild, settings);
}

/**
 * Impersonator alerts via "userUpdate".
 *
 * @param {ImpersonatorAlertsViaUserUpdateOldUser}  oldUser  - User (old).
 * @param {ImpersonatorAlertsViaUserUpdateNewUser}  newUser  - User (new).
 * @param {ImpersonatorAlertsViaUserUpdateGuild}    guild    - Guild.
 * @param {ImpersonatorAlertsViaUserUpdateSettings} settings - Settings.
 *
 * @returns {ImpersonatorAlertsViaUserUpdateReturns}
 *
 * @since 1.0.0
 */
export function impersonatorAlertsViaUserUpdate(oldUser: ImpersonatorAlertsViaUserUpdateOldUser, newUser: ImpersonatorAlertsViaUserUpdateNewUser, guild: ImpersonatorAlertsViaUserUpdateGuild, settings: ImpersonatorAlertsViaUserUpdateSettings): ImpersonatorAlertsViaUserUpdateReturns {
  const oldUserUsername = oldUser.username;

  const newUserUsername = newUser.username;

  // If user did not change their username.
  if (oldUserUsername === newUserUsername) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: impersonatorAlertsViaUserUpdate, old username: ${JSON.stringify(oldUserUsername)}, new username: ${JSON.stringify(newUserUsername)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: impersonatorAlertsViaUserUpdate, old username: ${JSON.stringify(oldUserUsername)}, new username: ${JSON.stringify(newUserUsername)})`,
    ].join(' '),
    40,
  );

  impersonatorAlerts(newUserUsername, newUser, guild, settings);
}

/**
 * Regex rules.
 *
 * @param {RegexRulesMessage} message - Message.
 * @param {RegexRulesEvents}  events  - Events.
 *
 * @returns {RegexRulesReturns}
 *
 * @since 1.0.0
 */
export function regexRules(message: RegexRulesMessage, events: RegexRulesEvents): RegexRulesReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: regexRules, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: regexRules, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannelId = message.channel.id;
  const messageContent = message.reactions.message.content ?? message.content;
  const messageGuildChannels = message.guild.channels;
  const messageGuildRoles = message.guild.roles;
  const messageMember = message.member;
  const messageUrl = message.url;

  let alreadyMatched = false;

  // If "regex-rules" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"regex-rules" is not configured',
        `(function: regexRules, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "regex-rules" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"regex-rules" is not configured properly',
        `(function: regexRules, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <RegexRulesEventName>_.get(event, ['name']) ?? 'Unknown';
    const theChannelChannelId = <RegexRulesEventChannelChannelId>_.get(event, ['channel', 'channel-id']);
    const theMatch = <RegexRulesEventMatch>_.get(event, ['match']);
    const theRegexPattern = <RegexRulesEventRegexPattern>_.get(event, ['regex', 'pattern']);
    const theRegexFlags = <RegexRulesEventRegexFlags>_.get(event, ['regex', 'flags']);
    const theExcludedRoles = <RegexRulesEventExcludedRoles>_.get(event, ['excluded-roles']);
    const theDirectMessagePayload = <RegexRulesEventDirectMessagePayload>_.get(event, ['direct-message-payload']);

    const hasPermissions = memberHasPermissions(messageMember, theExcludedRoles);

    const excludedRoleIds = _.map(theExcludedRoles, (theExcludedRole) => <RegexRulesEventExcludedRoleRoleId>_.get(theExcludedRole, ['role-id']));

    let payload: MessageOptions = {};

    // If previous regex rule already matched.
    if (alreadyMatched) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: regexRules, name: ${JSON.stringify(theName)}, already matched: ${JSON.stringify(alreadyMatched)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: regexRules, name: ${JSON.stringify(theName)}, already matched: ${JSON.stringify(alreadyMatched)})`,
      ].join(' '),
      40,
    );

    // If "regex-rules[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].name" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "regex-rules[${eventKey}].channel.channel-id" is not configured properly.
    if (
      theChannelChannelId !== undefined
      && messageGuildChannels.resolve(theChannelChannelId) === null
    ) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "regex-rules[${eventKey}].match" is not configured properly.
    if (!_.isBoolean(theMatch)) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].match" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)}, match: ${JSON.stringify(theMatch)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "regex-rules[${eventKey}].regex.pattern" is not configured properly.
    if (!_.isString(theRegexPattern)) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].regex.pattern" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "regex-rules[${eventKey}].regex.flags" is not configured properly.
    if (
      theRegexFlags !== undefined
      && !_.isString(theRegexFlags)
    ) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].regex.flags" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "regex-rules[${eventKey}].excluded-roles" is not configured properly.
    if (
      theExcludedRoles !== undefined
      && (
        !_.isArray(theExcludedRoles)
        || _.isEmpty(theExcludedRoles)
        || !_.every(theExcludedRoles, (theExcludedRole) => _.isPlainObject(theExcludedRole) && !_.isEmpty(theExcludedRole))
        || !_.every(excludedRoleIds, (excludedRoleId) => excludedRoleId !== undefined && messageGuildRoles.resolve(excludedRoleId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].excluded-roles" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)}, excluded roles: ${JSON.stringify(theExcludedRoles)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "regex-rules[${eventKey}].direct-message-payload" is not configured properly.
    if (
      theDirectMessagePayload !== undefined
      && (
        !_.isPlainObject(theDirectMessagePayload)
        || _.isEmpty(theDirectMessagePayload)
      )
    ) {
      generateLogMessage(
        [
          `"regex-rules[${eventKey}].direct-message-payload" is not configured properly`,
          `(function: regexRules, name: ${JSON.stringify(theName)}, direct message payload: ${JSON.stringify(theDirectMessagePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If current rule doesn't apply to the channel being checked.
    if (
      theChannelChannelId !== undefined
      && messageGuildChannels.resolve(theChannelChannelId) !== null
      && theChannelChannelId !== messageChannelId
    ) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: regexRules, name: ${JSON.stringify(theName)}, specified channel id: ${JSON.stringify(theChannelChannelId)}, current channel id: ${JSON.stringify(messageChannelId)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: regexRules, name: ${JSON.stringify(theName)}, specified channel id: ${JSON.stringify(theChannelChannelId)}, current channel id: ${JSON.stringify(messageChannelId)})`,
      ].join(' '),
      40,
    );

    try {
      const regExp = new RegExp(theRegexPattern, theRegexFlags);

      generateLogMessage(
        [
          'Constructed regular expression object',
          `(function: regexRules, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        40,
      );

      if (
        (
          theMatch // If regex match is true.
          && regExp.test(messageContent) // If regex matches.
        )
        || (
          !theMatch // If regex match is false.
          && !regExp.test(messageContent) // If regex does not match.
        )
      ) {
        alreadyMatched = true;

        generateLogMessage(
          [
            'Passed regex rule match',
            `(function: regexRules, name: ${JSON.stringify(theName)}, message content: ${JSON.stringify(messageContent)}, match: ${JSON.stringify(theMatch)}, test: ${JSON.stringify(regExp.test(messageContent))})`,
          ].join(' '),
          40,
        );

        if (hasPermissions) {
          generateLogMessage(
            [
              'Skipped task',
              `(function: regexRules, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(messageMember.toString())}, has permissions: ${JSON.stringify(hasPermissions)})`,
            ].join(' '),
            40,
          );

          return;
        }

        generateLogMessage(
          [
            'Continued task',
            `(function: regexRules, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(messageMember.toString())}, has permissions: ${JSON.stringify(hasPermissions)})`,
          ].join(' '),
          40,
        );

        if (theDirectMessagePayload !== undefined) {
          payload = theDirectMessagePayload;

          messageMember.createDM().then((createDMResponse) => {
            generateLogMessage(
              [
                'Created direct message channel',
                `(function: regexRules, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(messageMember.toString())})`,
              ].join(' '),
              40,
            );

            createDMResponse.send(payload).then((sendResponse) => {
              const sendResponseUrl = sendResponse.url;

              generateLogMessage(
                [
                  'Sent direct message',
                  `(function: regexRules, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
                ].join(' '),
                40,
              );
            }).catch((error: Error) => generateLogMessage(
              [
                'Failed to send direct message',
                `(function: regexRules, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(messageMember.toString())}, payload: ${JSON.stringify(payload)})`,
              ].join(' '),
              10,
              error,
            ));
          }).catch((error: Error) => generateLogMessage(
            [
              'Failed to create direct message channel',
              `(function: regexRules, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(messageMember.toString())})`,
            ].join(' '),
            10,
            error,
          ));
        }

        message.delete().then(() => generateLogMessage(
          [
            'Deleted message',
            `(function: regexRules, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(messageUrl)})`,
          ].join(' '),
          40,
        )).catch((error: Error) => generateLogMessage(
          [
            'Failed to delete message',
            `(function: regexRules, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(messageUrl)})`,
          ].join(' '),
          10,
          error,
        ));
      } else {
        generateLogMessage(
          [
            'Failed regex rule match',
            `(function: regexRules, name: ${JSON.stringify(theName)}, message content: ${JSON.stringify(messageContent)}, match: ${JSON.stringify(theMatch)}, test: ${JSON.stringify(regExp.test(messageContent))})`,
          ].join(' '),
          40,
        );
      }
    } catch (error) {
      generateLogMessage(
        [
          'Failed to construct regular expression object',
          `(function: regexRules, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Remove affiliates.
 *
 * @param {RemoveAffiliatesMessage}  message  - Message.
 * @param {RemoveAffiliatesSettings} settings - Settings.
 *
 * @returns {RemoveAffiliatesReturns}
 *
 * @since 1.0.0
 */
export function removeAffiliates(message: RemoveAffiliatesMessage, settings: RemoveAffiliatesSettings): RemoveAffiliatesReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: removeAffiliates, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: removeAffiliates, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageContent = message.reactions.message.content ?? message.content;
  const messageGuild = message.guild;
  const messageGuildRoles = message.guild.roles;
  const messageId = message.id;
  const messageMember = message.member;
  const messageUrl = message.url;

  const settingsPlatforms = <RemoveAffiliatesSettingsPlatforms>_.get(settings, ['platforms']);
  const settingsExcludedRoles = <RemoveAffiliatesSettingsExcludedRoles>_.get(settings, ['excluded-roles']);
  const settingsChannelChannelId = <RemoveAffiliatesSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);
  const settingsDirectMessagePayload = <RemoveAffiliatesSettingsDirectMessagePayload>_.get(settings, ['direct-message-payload']);

  const attachments = getCollectionItems(messageAttachments);
  const channel = getTextBasedChannel(messageGuild, settingsChannelChannelId);
  const hasPermissions = memberHasPermissions(messageMember, settingsExcludedRoles);

  const excludedRoleIds = _.map(settingsExcludedRoles, (settingsExcludedRole) => <RemoveAffiliatesSettingsExcludedRoleRoleId>_.get(settingsExcludedRole, ['role-id']));

  const detectedAffiliates: MemoryRemoveAffiliatesDetectedAffiliates = [];

  let payload: MessageOptions = {};

  // If "remove-affiliates" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"remove-affiliates" is not configured',
        `(function: removeAffiliates, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "remove-affiliates.platforms" is not configured properly.
  if (
    !_.isArray(settingsPlatforms)
    || _.isEmpty(settingsPlatforms)
    || !_.every(settingsPlatforms, (settingsPlatform) => _.isPlainObject(settingsPlatform) && !_.isEmpty(settingsPlatform))
  ) {
    generateLogMessage(
      [
        '"remove-affiliates.platforms" is not configured properly',
        `(function: removeAffiliates, platforms: ${JSON.stringify(settingsPlatforms)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "remove-affiliates.excluded-roles" is not configured properly.
  if (
    settingsExcludedRoles !== undefined
    && (
      !_.isArray(settingsExcludedRoles)
      || _.isEmpty(settingsExcludedRoles)
      || !_.every(settingsExcludedRoles, (settingsExcludedRole) => _.isPlainObject(settingsExcludedRole) && !_.isEmpty(settingsExcludedRole))
      || !_.every(excludedRoleIds, (excludedRoleId) => excludedRoleId !== undefined && messageGuildRoles.resolve(excludedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"remove-affiliates.excluded-roles" is not configured properly',
        `(function: removeAffiliates, excluded roles: ${JSON.stringify(settingsExcludedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "remove-affiliates.channel.channel-id" is not configured properly.
  if (
    settingsChannelChannelId !== undefined
    && (
      channel === undefined
      || channel === null
    )
  ) {
    generateLogMessage(
      [
        '"remove-affiliates.channel.channel-id" is not configured properly',
        `(function: removeAffiliates, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "remove-affiliates.direct-message-payload" is not configured properly.
  if (
    settingsDirectMessagePayload !== undefined
    && (
      !_.isPlainObject(settingsDirectMessagePayload)
      || _.isEmpty(settingsDirectMessagePayload)
    )
  ) {
    generateLogMessage(
      [
        '"remove-affiliates.direct-message-payload" is not configured properly',
        `(function: removeAffiliates, direct message payload: ${JSON.stringify(settingsDirectMessagePayload)})`,
      ].join(' '),
      10,
    );

    return;
  }

  settingsPlatforms.forEach((settingsPlatform, settingsPlatformKey) => {
    const thePlatform = <RemoveAffiliatesSettingsPlatformPlatform>_.get(settingsPlatform, ['platform']) ?? 'Unknown';
    const theRegexPattern = <RemoveAffiliatesSettingsPlatformRegexPattern>_.get(settingsPlatform, ['regex', 'pattern']);
    const theRegexFlags = <RemoveAffiliatesSettingsPlatformRegexFlags>_.get(settingsPlatform, ['regex', 'flags']);

    // If "remove-affiliates.platforms[${settingsPlatformKey}].platform" is not configured properly.
    if (
      !_.isString(thePlatform)
      || _.isEmpty(thePlatform)
    ) {
      generateLogMessage(
        [
          `"remove-affiliates.platforms[${settingsPlatformKey}].platform" is not configured properly`,
          `(function: removeAffiliates, platform: ${JSON.stringify(thePlatform)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "remove-affiliates.platforms[${settingsPlatformKey}].regex.pattern" is not configured properly.
    if (!_.isString(theRegexPattern)) {
      generateLogMessage(
        [
          `"remove-affiliates.platforms[${settingsPlatformKey}].regex.pattern" is not configured properly`,
          `(function: removeAffiliates, platform: ${JSON.stringify(thePlatform)}, pattern: ${JSON.stringify(theRegexPattern)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "remove-affiliates.platforms[${settingsPlatformKey}].regex.flags" is not configured properly.
    if (
      theRegexFlags !== undefined
      && !_.isString(theRegexFlags)
    ) {
      generateLogMessage(
        [
          `"remove-affiliates.platforms[${settingsPlatformKey}].regex.flags" is not configured properly`,
          `(function: removeAffiliates, platform: ${JSON.stringify(thePlatform)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
      );

      return;
    }

    try {
      const regExp = new RegExp(theRegexPattern, theRegexFlags);

      generateLogMessage(
        [
          'Constructed regular expression object',
          `(function: removeAffiliates, platform: ${JSON.stringify(thePlatform)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        40,
      );

      if (regExp.test(messageContent)) {
        detectedAffiliates.push(thePlatform);
      }
    } catch (error) {
      generateLogMessage(
        [
          'Failed to construct regular expression object',
          `(function: removeAffiliates, platform: ${JSON.stringify(thePlatform)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });

  if (detectedAffiliates.length === 0) {
    generateLogMessage(
      [
        'Failed affiliates match',
        `(function: removeAffiliates, message content: ${JSON.stringify(messageContent)}, detected affiliates: ${JSON.stringify(detectedAffiliates)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed affiliates match',
      `(function: removeAffiliates, message content: ${JSON.stringify(messageContent)}, detected affiliates: ${JSON.stringify(detectedAffiliates)})`,
    ].join(' '),
    40,
  );

  if (hasPermissions) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: removeAffiliates, member: ${JSON.stringify(messageMember.toString())}, has permissions: ${JSON.stringify(hasPermissions)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: removeAffiliates, member: ${JSON.stringify(messageMember.toString())}, has permissions: ${JSON.stringify(hasPermissions)})`,
    ].join(' '),
    40,
  );

  if (channel) {
    payload = {
      embeds: [
        createRemoveAffiliatesEmbed(
          messageMember.toString(),
          // TODO Fix return type of "toString()" on channels (https://github.com/discordjs/discord.js/pull/7836).
          <ChannelMention>messageChannel.toString(),
          messageId,
          messageContent,
          attachments,
          messageUrl,
          detectedAffiliates,
        ),
      ],
    };

    channel.send(payload).then((sendResponse) => {
      const sendResponseUrl = sendResponse.url;

      generateLogMessage(
        [
          'Sent message',
          `(function: removeAffiliates, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        40,
      );
    }).catch((error: Error) => generateLogMessage(
      [
        'Failed to send message',
        `(function: removeAffiliates, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      10,
      error,
    ));
  }

  if (settingsDirectMessagePayload !== undefined) {
    payload = settingsDirectMessagePayload;

    messageMember.createDM().then((createDMResponse) => {
      generateLogMessage(
        [
          'Created direct message channel',
          `(function: removeAffiliates, member: ${JSON.stringify(messageMember.toString())})`,
        ].join(' '),
        40,
      );

      createDMResponse.send(payload).then((sendResponse) => {
        const sendResponseUrl = sendResponse.url;

        generateLogMessage(
          [
            'Sent direct message',
            `(function: removeAffiliates, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          40,
        );
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to send direct message',
          `(function: removeAffiliates, member: ${JSON.stringify(messageMember.toString())}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        10,
        error,
      ));
    }).catch((error: Error) => generateLogMessage(
      [
        'Failed to create direct message channel',
        `(function: removeAffiliates, member: ${JSON.stringify(messageMember.toString())})`,
      ].join(' '),
      10,
      error,
    ));
  }

  message.delete().then(() => generateLogMessage(
    [
      'Deleted message',
      `(function: removeAffiliates, message url: ${JSON.stringify(messageUrl)})`,
    ].join(' '),
    40,
  )).catch((error: Error) => generateLogMessage(
    [
      'Failed to delete message',
      `(function: removeAffiliates, message url: ${JSON.stringify(messageUrl)})`,
    ].join(' '),
    10,
    error,
  ));
}
