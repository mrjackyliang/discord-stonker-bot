import { ChannelMention, MessageOptions } from 'discord.js';
import _ from 'lodash';

import {
  createChangeNicknameEmbed,
  createChangeUsernameEmbed,
  createDeleteMessageEmbed,
  createGuildJoinEmbed,
  createGuildLeaveEmbed,
  createIncludesLinkEmbed,
  createRoleChangeEmbed,
  createUpdateMessageEmbed,
  createUploadAttachmentEmbed,
} from '../lib/embed';
import { generateLogMessage, getCollectionItems, getTextBasedChannel } from '../lib/utility';
import {
  ChangeNicknameGuild,
  ChangeNicknameNewMember,
  ChangeNicknameOldMember,
  ChangeNicknameReturns,
  ChangeNicknameSettings,
  ChangeNicknameSettingsChannelChannelId,
  ChangeUsernameGuild,
  ChangeUsernameNewUser,
  ChangeUsernameOldUser,
  ChangeUsernameReturns,
  ChangeUsernameSettings,
  ChangeUsernameSettingsChannelChannelId,
  DeleteMessageGuild,
  DeleteMessageMessage,
  DeleteMessageReturns,
  DeleteMessageSettings,
  DeleteMessageSettingsChannelChannelId,
  GuildJoinGuild,
  GuildJoinMember,
  GuildJoinReturns,
  GuildJoinSettings,
  GuildJoinSettingsChannelChannelId,
  GuildLeaveGuild,
  GuildLeaveMember,
  GuildLeaveReturns,
  GuildLeaveSettings,
  GuildLeaveSettingsChannelChannelId,
  IncludesLinkGuild,
  IncludesLinkMessage,
  IncludesLinkReturns,
  IncludesLinkSettings,
  IncludesLinkSettingsChannelChannelId,
  IncludesLinkSettingsExcludedLinkName,
  IncludesLinkSettingsExcludedLinkRegexFlags,
  IncludesLinkSettingsExcludedLinkRegexPattern,
  IncludesLinkSettingsExcludedLinks,
  RoleChangeGuild,
  RoleChangeNewMember,
  RoleChangeOldMember,
  RoleChangeReturns,
  RoleChangeSettings,
  RoleChangeSettingsChannelChannelId,
  UpdateMessageGuild,
  UpdateMessageMessage,
  UpdateMessageReturns,
  UpdateMessageSettings,
  UpdateMessageSettingsChannelChannelId,
  UploadAttachmentGuild,
  UploadAttachmentMessage,
  UploadAttachmentReturns,
  UploadAttachmentSettings,
  UploadAttachmentSettingsChannelChannelId,
} from '../types';
import { MemoryUploadAttachmentAttachmentLinks } from '../types/memory';

/**
 * Change nickname.
 *
 * @param {ChangeNicknameOldMember} oldMember - Member (old).
 * @param {ChangeNicknameNewMember} newMember - Member (new).
 * @param {ChangeNicknameGuild}     guild     - Guild.
 * @param {ChangeNicknameSettings}  settings  - Settings.
 *
 * @returns {ChangeNicknameReturns}
 *
 * @since 1.0.0
 */
export function changeNickname(oldMember: ChangeNicknameOldMember, newMember: ChangeNicknameNewMember, guild: ChangeNicknameGuild, settings: ChangeNicknameSettings): ChangeNicknameReturns {
  const oldMemberNickname = oldMember.nickname;

  const newMemberNickname = newMember.nickname;

  const settingsChannelChannelId = <ChangeNicknameSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  let payload: MessageOptions = {};

  // If "snitch.change-nickname" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.change-nickname" is not configured',
        `(function: changeNickname, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.change-nickname.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.change-nickname.channel.channel-id" is not configured properly',
        `(function: changeNickname, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (oldMemberNickname === newMemberNickname) {
    generateLogMessage(
      [
        'Failed nickname change match',
        `(function: changeNickname, member: ${JSON.stringify(newMember.toString())}, old nickname: ${JSON.stringify(oldMemberNickname)}, new nickname: ${JSON.stringify(newMemberNickname)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed nickname change match',
      `(function: changeNickname, member: ${JSON.stringify(newMember.toString())}, old nickname: ${JSON.stringify(oldMemberNickname)}, new nickname: ${JSON.stringify(newMemberNickname)})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createChangeNicknameEmbed(
        oldMemberNickname,
        newMemberNickname,
        newMember.toString(),
        newMember.displayAvatarURL({
          format: 'webp',
          dynamic: true,
          size: 4096,
        }),
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: changeNickname, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: changeNickname, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Change username.
 *
 * @param {ChangeUsernameOldUser}  oldUser  - User (old).
 * @param {ChangeUsernameNewUser}  newUser  - User (new).
 * @param {ChangeUsernameGuild}    guild    - Guild.
 * @param {ChangeUsernameSettings} settings - Settings.
 *
 * @returns {ChangeUsernameReturns}
 *
 * @since 1.0.0
 */
export function changeUsername(oldUser: ChangeUsernameOldUser, newUser: ChangeUsernameNewUser, guild: ChangeUsernameGuild, settings: ChangeUsernameSettings): ChangeUsernameReturns {
  const oldUserTag = oldUser.tag;

  const newUserTag = newUser.tag;

  const settingsChannelChannelId = <ChangeUsernameSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  let payload: MessageOptions = {};

  // If "snitch.change-username" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.change-username" is not configured',
        `(function: changeUsername, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.change-username.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.change-username.channel.channel-id" is not configured properly',
        `(function: changeUsername, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (oldUserTag === newUserTag) {
    generateLogMessage(
      [
        'Failed username change match',
        `(function: changeUsername, user: ${JSON.stringify(newUser.toString())}, old tag: ${JSON.stringify(oldUserTag)}, new tag: ${JSON.stringify(newUserTag)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed username change match',
      `(function: changeUsername, user: ${JSON.stringify(newUser.toString())}, old tag: ${JSON.stringify(oldUserTag)}, new tag: ${JSON.stringify(newUserTag)})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createChangeUsernameEmbed(
        oldUserTag,
        newUserTag,
        newUser.toString(),
        newUser.displayAvatarURL({
          format: 'webp',
          dynamic: true,
          size: 4096,
        }),
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: changeUsername, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: changeUsername, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Delete message.
 *
 * @param {DeleteMessageMessage}  message  - Message.
 * @param {DeleteMessageGuild}    guild    - Guild.
 * @param {DeleteMessageSettings} settings - Settings.
 *
 * @returns {DeleteMessageReturns}
 *
 * @since 1.0.0
 */
export function deleteMessage(message: DeleteMessageMessage, guild: DeleteMessageGuild, settings: DeleteMessageSettings): DeleteMessageReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        '(function: deleteMessage)',
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      '(function: deleteMessage)',
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuildId = message.guild.id;
  const messageId = message.id;
  const messageMember = message.member;
  const messageUrl = message.url;

  const guildId = guild.id;

  const settingsChannelChannelId = <DeleteMessageSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const attachments = getCollectionItems(messageAttachments);
  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  let payload: MessageOptions = {};

  // If "snitch.delete-message" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.delete-message" is not configured',
        `(function: deleteMessage, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.delete-message.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.delete-message.channel.channel-id" is not configured properly',
        `(function: deleteMessage, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (messageGuildId !== guildId) {
    generateLogMessage(
      [
        'Failed message delete match',
        `(function: deleteMessage, member: ${JSON.stringify(messageMember.toString())}, message url: ${JSON.stringify(messageUrl)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed message delete match',
      `(function: deleteMessage, member: ${JSON.stringify(messageMember.toString())}, message url: ${JSON.stringify(messageUrl)})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createDeleteMessageEmbed(
        messageMember.toString(),
        // TODO Fix return type of "toString()" on channels (https://github.com/discordjs/discord.js/pull/7836).
        <ChannelMention>messageChannel.toString(),
        messageId,
        messageContent,
        attachments,
        messageUrl,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: deleteMessage, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: deleteMessage, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Guild join.
 *
 * @param {GuildJoinMember}   member   - Member.
 * @param {GuildJoinGuild}    guild    - Guild.
 * @param {GuildJoinSettings} settings - Settings.
 *
 * @returns {GuildJoinReturns}
 *
 * @since 1.0.0
 */
export function guildJoin(member: GuildJoinMember, guild: GuildJoinGuild, settings: GuildJoinSettings): GuildJoinReturns {
  const memberGuildId = member.guild.id;
  const memberUserAvatar = member.user.avatar;
  const memberUserCreatedAt = member.user.createdAt;
  const memberUserTag = member.user.tag;

  const guildId = guild.id;

  const settingsChannelChannelId = <GuildJoinSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  let payload: MessageOptions = {};

  // If "snitch.guild-join" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.guild-join" is not configured',
        `(function: guildJoin, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.guild-join.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.guild-join.channel.channel-id" is not configured properly',
        `(function: guildJoin, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (memberGuildId !== guildId) {
    generateLogMessage(
      [
        'Failed guild join match',
        `(function: guildJoin, member: ${JSON.stringify(member.toString())})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed guild join match',
      `(function: guildJoin, member: ${JSON.stringify(member.toString())})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createGuildJoinEmbed(
        memberUserTag,
        member.toString(),
        memberUserAvatar,
        member.displayAvatarURL({
          format: 'webp',
          dynamic: true,
          size: 4096,
        }),
        memberUserCreatedAt,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: guildJoin, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: guildJoin, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Guild leave.
 *
 * @param {GuildLeaveMember}   member   - Member.
 * @param {GuildLeaveGuild}    guild    - Guild.
 * @param {GuildLeaveSettings} settings - Settings.
 *
 * @returns {GuildLeaveReturns}
 *
 * @since 1.0.0
 */
export function guildLeave(member: GuildLeaveMember, guild: GuildLeaveGuild, settings: GuildLeaveSettings): GuildLeaveReturns {
  if (member.joinedAt === null) {
    generateLogMessage(
      [
        'Failed to invoke function',
        '(function: guildLeave)',
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      '(function: guildLeave)',
    ].join(' '),
    40,
  );

  const memberGuildId = member.guild.id;
  const memberJoinedAt = member.joinedAt;
  const memberRolesCache = member.roles.cache;
  const memberUserAvatar = member.user.avatar;
  const memberUserCreatedAt = member.user.createdAt;
  const memberUserTag = member.user.tag;

  const guildId = guild.id;

  const settingsChannelChannelId = <GuildLeaveSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);
  const roles = getCollectionItems(memberRolesCache);

  let payload: MessageOptions = {};

  // If "snitch.guild-leave" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.guild-leave" is not configured',
        `(function: guildLeave, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.guild-leave.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.guild-leave.channel.channel-id" is not configured properly',
        `(function: guildLeave, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (memberGuildId !== guildId) {
    generateLogMessage(
      [
        'Failed guild leave match',
        `(function: guildLeave, member: ${JSON.stringify(member.toString())})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed guild leave match',
      `(function: guildLeave, member: ${JSON.stringify(member.toString())})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createGuildLeaveEmbed(
        memberUserTag,
        member.toString(),
        memberUserAvatar,
        member.displayAvatarURL({
          format: 'webp',
          dynamic: true,
          size: 4096,
        }),
        memberUserCreatedAt,
        memberJoinedAt,
        roles,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: guildLeave, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: guildLeave, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Includes link.
 *
 * @param {IncludesLinkMessage}  message  - Message.
 * @param {IncludesLinkGuild}    guild    - Guild.
 * @param {IncludesLinkSettings} settings - Settings.
 *
 * @returns {IncludesLinkReturns}
 *
 * @since 1.0.0
 */
export function includesLink(message: IncludesLinkMessage, guild: IncludesLinkGuild, settings: IncludesLinkSettings): IncludesLinkReturns {
  if (message.member === null) {
    generateLogMessage(
      [
        'Failed to invoke function',
        '(function: includesLink)',
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      '(function: includesLink)',
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageContent = message.reactions.message.content ?? message.content;
  const messageId = message.id;
  const messageMember = message.member;
  const messageUrl = message.url;

  const settingsChannelChannelId = <IncludesLinkSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);
  const settingsExcludedLinks = <IncludesLinkSettingsExcludedLinks>_.get(settings, ['excluded-links']);

  const attachments = getCollectionItems(messageAttachments);
  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  const regExpUrl = /https?:\/\//gi;

  let payload: MessageOptions = {};

  // If "snitch.includes-link" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.includes-link" is not configured',
        `(function: includesLink, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.includes-link.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.includes-link.channel.channel-id" is not configured properly',
        `(function: includesLink, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "snitch.includes-link.excluded-links" is not configured properly.
  if (
    settingsExcludedLinks !== undefined
    && (
      !_.isArray(settingsExcludedLinks)
      || _.isEmpty(settingsExcludedLinks)
      || !_.every(settingsExcludedLinks, (settingsExcludedLink) => _.isPlainObject(settingsExcludedLink) && !_.isEmpty(settingsExcludedLink))
    )
  ) {
    generateLogMessage(
      [
        '"snitch.includes-link.excluded-links" is not configured properly',
        `(function: includesLink, excluded links: ${JSON.stringify(settingsExcludedLinks)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!regExpUrl.test(messageContent)) {
    generateLogMessage(
      [
        'Failed regex rule match',
        `(function: includesLink, message content: ${JSON.stringify(messageContent)}, test: ${JSON.stringify(regExpUrl.test(messageContent))})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed regex rule match',
      `(function: includesLink, message content: ${JSON.stringify(messageContent)}, test: ${JSON.stringify(regExpUrl.test(messageContent))})`,
    ].join(' '),
    40,
  );

  if (
    settingsExcludedLinks !== undefined
    && _.isArray(settingsExcludedLinks)
    && !_.isEmpty(settingsExcludedLinks)
    && _.every(settingsExcludedLinks, (settingsExcludedLink) => _.isPlainObject(settingsExcludedLink) && !_.isEmpty(settingsExcludedLink))
  ) {
    let matches = 0;

    settingsExcludedLinks.forEach((settingsExcludedLink, settingsExcludedLinkKey) => {
      const theName = <IncludesLinkSettingsExcludedLinkName>_.get(settingsExcludedLink, ['name']) ?? 'Unknown';
      const theRegexPattern = <IncludesLinkSettingsExcludedLinkRegexPattern>_.get(settingsExcludedLink, ['regex', 'pattern']);
      const theRegexFlags = <IncludesLinkSettingsExcludedLinkRegexFlags>_.get(settingsExcludedLink, ['regex', 'flags']);

      // If "snitch.includes-link.excluded-links[${settingsExcludedLinkKey}].name" is not configured properly.
      if (
        !_.isString(theName)
        || _.isEmpty(theName)
      ) {
        generateLogMessage(
          [
            `"snitch.includes-link.excluded-links[${settingsExcludedLinkKey}].name" is not configured properly`,
            `(function: includesLink, name: ${JSON.stringify(theName)})`,
          ].join(' '),
          10,
        );

        return;
      }

      // If "snitch.includes-link.excluded-links[${settingsExcludedLinkKey}].regex.pattern" is not configured properly.
      if (!_.isString(theRegexPattern)) {
        generateLogMessage(
          [
            `"snitch.includes-link.excluded-links[${settingsExcludedLinkKey}].regex.pattern" is not configured properly`,
            `(function: includesLink, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)})`,
          ].join(' '),
          10,
        );

        return;
      }

      // If "snitch.includes-link.excluded-links[${settingsExcludedLinkKey}].regex.flags" is not configured properly.
      if (
        theRegexFlags !== undefined
        && !_.isString(theRegexFlags)
      ) {
        generateLogMessage(
          [
            `"snitch.includes-link.excluded-links[${settingsExcludedLinkKey}].regex.flags" is not configured properly`,
            `(function: includesLink, name: ${JSON.stringify(theName)}, flags: ${JSON.stringify(theRegexFlags)})`,
          ].join(' '),
          10,
        );

        return;
      }

      try {
        const regExpExcludedLink = new RegExp(theRegexPattern, theRegexFlags);

        generateLogMessage(
          [
            'Constructed regular expression object',
            `(function: includesLink, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
          ].join(' '),
          40,
        );

        if (regExpExcludedLink.test(messageContent)) {
          matches += 1;
        }
      } catch (error) {
        generateLogMessage(
          [
            'Failed to construct regular expression object',
            `(function: includesLink, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
          ].join(' '),
          10,
          error,
        );
      }
    });

    if (matches > 0) {
      generateLogMessage(
        [
          'Passed message with excluded links match',
          `(function: includesLink, message content: ${JSON.stringify(messageContent)}, matches: ${JSON.stringify(matches)})`,
        ].join(' '),
        40,
      );

      // Skip sending embed if link matches regex.
      return;
    }

    generateLogMessage(
      [
        'Failed message with excluded links match',
        `(function: includesLink, message content: ${JSON.stringify(messageContent)}, matches: ${JSON.stringify(matches)})`,
      ].join(' '),
      40,
    );
  }

  payload = {
    embeds: [
      createIncludesLinkEmbed(
        messageMember.toString(),
        // TODO Fix return type of "toString()" on channels (https://github.com/discordjs/discord.js/pull/7836).
        <ChannelMention>messageChannel.toString(),
        messageId,
        messageContent,
        attachments,
        messageUrl,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: includesLink, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: includesLink, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Role change.
 *
 * @param {RoleChangeOldMember} oldMember - Member (old).
 * @param {RoleChangeNewMember} newMember - Member (new).
 * @param {RoleChangeGuild}     guild     - Guild.
 * @param {RoleChangeSettings}  settings  - Settings.
 *
 * @returns {RoleChangeReturns}
 *
 * @since 1.0.0
 */
export function roleChange(oldMember: RoleChangeOldMember, newMember: RoleChangeNewMember, guild: RoleChangeGuild, settings: RoleChangeSettings): RoleChangeReturns {
  const oldMemberRolesCache = oldMember.roles.cache;

  const newMemberRolesCache = newMember.roles.cache;

  const settingsChannelChannelId = <RoleChangeSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);
  const newMemberRoles = getCollectionItems(newMemberRolesCache);
  const oldMemberRoles = getCollectionItems(oldMemberRolesCache);

  const rolesAdded = _.difference(newMemberRoles, oldMemberRoles);
  const rolesRemoved = _.difference(oldMemberRoles, newMemberRoles);

  let payload: MessageOptions = {};

  // If "snitch.role-change" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.role-change" is not configured',
        `(function: roleChange, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.role-change.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.role-change.channel.channel-id" is not configured properly',
        `(function: roleChange, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (oldMemberRoles.length === newMemberRoles.length) {
    generateLogMessage(
      [
        'Failed member role change match',
        `(function: roleChange, member: ${JSON.stringify(newMember.toString())}, roles added: ${JSON.stringify(rolesAdded)}, roles removed: ${JSON.stringify(rolesRemoved)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed member role change match',
      `(function: roleChange, member: ${JSON.stringify(newMember.toString())}, roles added: ${JSON.stringify(rolesAdded)}, roles removed: ${JSON.stringify(rolesRemoved)})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createRoleChangeEmbed(
        newMember.toString(),
        newMember.displayAvatarURL({
          format: 'webp',
          dynamic: true,
          size: 4096,
        }),
        rolesAdded,
        rolesRemoved,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: roleChange, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: roleChange, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Update message.
 *
 * @param {UpdateMessageMessage}  message  - Message.
 * @param {UpdateMessageGuild}    guild    - Guild.
 * @param {UpdateMessageSettings} settings - Settings.
 *
 * @returns {UpdateMessageReturns}
 *
 * @since 1.0.0
 */
export function updateMessage(message: UpdateMessageMessage, guild: UpdateMessageGuild, settings: UpdateMessageSettings): UpdateMessageReturns {
  if (message.member === null) {
    generateLogMessage(
      [
        'Failed to invoke function',
        '(function: updateMessage)',
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      '(function: updateMessage)',
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageId = message.id;
  const messageMember = message.member;
  const messageReactionsMessageContent = message.reactions.message.content;
  const messageUrl = message.url;

  const settingsChannelChannelId = <UpdateMessageSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const attachments = getCollectionItems(messageAttachments);
  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  let payload: MessageOptions = {};

  // If "snitch.update-message" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.update-message" is not configured',
        `(function: updateMessage, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.update-message.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.update-message.channel.channel-id" is not configured properly',
        `(function: updateMessage, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If the updated message content is the same as non-updated message content.
  if (messageContent === messageReactionsMessageContent) {
    generateLogMessage(
      [
        'Failed message update match',
        `(function: updateMessage, old message content: ${JSON.stringify(messageContent)}, new message content: ${JSON.stringify(messageReactionsMessageContent)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed message update match',
      `(function: updateMessage, old message content: ${JSON.stringify(messageContent)}, new message content: ${JSON.stringify(messageReactionsMessageContent)})`,
    ].join(' '),
    40,
  );

  payload = {
    embeds: [
      createUpdateMessageEmbed(
        messageMember.toString(),
        // TODO Fix return type of "toString()" on channels (https://github.com/discordjs/discord.js/pull/7836).
        <ChannelMention>messageChannel.toString(),
        messageId,
        messageContent,
        messageReactionsMessageContent,
        attachments,
        messageUrl,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: updateMessage, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: updateMessage, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Upload attachment.
 *
 * @param {UploadAttachmentMessage}  message  - Message.
 * @param {UploadAttachmentGuild}    guild    - Guild.
 * @param {UploadAttachmentSettings} settings - Settings.
 *
 * @returns {UploadAttachmentReturns}
 *
 * @since 1.0.0
 */
export function uploadAttachment(message: UploadAttachmentMessage, guild: UploadAttachmentGuild, settings: UploadAttachmentSettings): UploadAttachmentReturns {
  if (message.member === null) {
    generateLogMessage(
      [
        'Failed to invoke function',
        '(function: uploadAttachment)',
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      '(function: uploadAttachment)',
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageId = message.id;
  const messageMember = message.member;
  const messageUrl = message.url;

  const settingsChannelChannelId = <UploadAttachmentSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const attachments = getCollectionItems(messageAttachments);
  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  const attachmentLinks: MemoryUploadAttachmentAttachmentLinks = [];

  let payload: MessageOptions = {};

  // If "snitch.upload-attachment" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"snitch.upload-attachment" is not configured',
        `(function: uploadAttachment, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "snitch.upload-attachment.channel.channel-id" is not configured properly.
  if (
    channel === undefined
    || channel === null
  ) {
    generateLogMessage(
      [
        '"snitch.upload-attachment.channel.channel-id" is not configured properly',
        `(function: uploadAttachment, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Only keep attachment links.
  attachments.forEach((attachment) => {
    const attachmentUrl = attachment.url;

    attachmentLinks.push(attachmentUrl);
  });

  if (attachmentLinks.length === 0) {
    generateLogMessage(
      [
        'Failed message with attachments match',
        `(function: uploadAttachment, attachments: ${JSON.stringify(messageAttachments)}, attachment links: ${JSON.stringify(attachmentLinks)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Passed message with attachments match',
      `(function: uploadAttachment, attachments: ${JSON.stringify(messageAttachments)}, attachment links: ${JSON.stringify(attachmentLinks)})`,
    ].join(' '),
    40,
  );

  payload = {
    files: attachmentLinks,
    embeds: [
      createUploadAttachmentEmbed(
        messageMember.toString(),
        // TODO Fix return type of "toString()" on channels (https://github.com/discordjs/discord.js/pull/7836).
        <ChannelMention>messageChannel.toString(),
        messageId,
        attachments,
        messageUrl,
      ),
    ],
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: uploadAttachment, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: uploadAttachment, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}
