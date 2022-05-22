import { EmbedFieldData, MessageEmbed } from 'discord.js';
import _ from 'lodash';

import { fetchFormattedDate, fetchFormattedDuration, splitStringChunks } from './utility';
import {
  AddAttachmentFieldsMessageAttachments,
  AddAttachmentFieldsReturns,
  AddMessageFieldsMessageContent,
  AddMessageFieldsReturns,
  AddMessageFieldsTitle,
  AddTimeDurationFieldsAccountAge,
  AddTimeDurationFieldsReturns,
  AddTimeDurationFieldsTimeOfStay,
  AddUserInformationFieldsReturns,
  AddUserInformationFieldsUserAvatar,
  AddUserInformationFieldsUserMention,
  AddUserInformationFieldsUserTag,
  CreateBulkBanEmbedProgressMessage,
  CreateBulkBanEmbedReturns,
  CreateBulkBanEmbedStatus,
  CreateBulkBanEmbedUserTag,
  CreateChangeNicknameEmbedNewNickname,
  CreateChangeNicknameEmbedOldNickname,
  CreateChangeNicknameEmbedReturns,
  CreateChangeNicknameEmbedUserAvatarUrl,
  CreateChangeNicknameEmbedUserMention,
  CreateChangeUsernameEmbedNewUserTag,
  CreateChangeUsernameEmbedOldUserTag,
  CreateChangeUsernameEmbedReturns,
  CreateChangeUsernameEmbedUserAvatarUrl,
  CreateChangeUsernameEmbedUserMention,
  CreateCommandErrorEmbedReason,
  CreateCommandErrorEmbedReturns,
  CreateCommandErrorEmbedUserTag,
  CreateDeleteMessageEmbedChannelMention,
  CreateDeleteMessageEmbedMessageAttachments,
  CreateDeleteMessageEmbedMessageContent,
  CreateDeleteMessageEmbedMessageId,
  CreateDeleteMessageEmbedMessageUrl,
  CreateDeleteMessageEmbedReturns,
  CreateDeleteMessageEmbedUserMention,
  CreateGuildJoinEmbedReturns,
  CreateGuildJoinEmbedUserAvatar,
  CreateGuildJoinEmbedUserAvatarUrl,
  CreateGuildJoinEmbedUserCreatedAt,
  CreateGuildJoinEmbedUserMention,
  CreateGuildJoinEmbedUserTag,
  CreateGuildLeaveEmbedMemberJoinedAt,
  CreateGuildLeaveEmbedMemberRoles,
  CreateGuildLeaveEmbedReturns,
  CreateGuildLeaveEmbedUserAvatar,
  CreateGuildLeaveEmbedUserAvatarUrl,
  CreateGuildLeaveEmbedUserCreatedAt,
  CreateGuildLeaveEmbedUserMention,
  CreateGuildLeaveEmbedUserTag,
  CreateIncludesLinkEmbedChannelMention,
  CreateIncludesLinkEmbedMessageAttachments,
  CreateIncludesLinkEmbedMessageContent,
  CreateIncludesLinkEmbedMessageId,
  CreateIncludesLinkEmbedMessageUrl,
  CreateIncludesLinkEmbedReturns,
  CreateIncludesLinkEmbedUserMention,
  CreateListEmojisEmbedReturns,
  CreateListEmojisEmbedRoute,
  CreateListEmojisEmbedUserTag,
  CreateListMembersEmbedReturns,
  CreateListMembersEmbedThumbnailUrl,
  CreateListMembersEmbedTitle,
  CreateListMembersEmbedUserTag,
  CreateNoResultsEmbedReason,
  CreateNoResultsEmbedReturns,
  CreateNoResultsEmbedUserTag,
  CreateRemoveAffiliatesEmbedChannelMention,
  CreateRemoveAffiliatesEmbedMessageAttachments,
  CreateRemoveAffiliatesEmbedMessageContent,
  CreateRemoveAffiliatesEmbedMessageId,
  CreateRemoveAffiliatesEmbedMessageUrl,
  CreateRemoveAffiliatesEmbedPlatforms,
  CreateRemoveAffiliatesEmbedReturns,
  CreateRemoveAffiliatesEmbedUserMention,
  CreateRoleChangeEmbedAddedMemberRoles,
  CreateRoleChangeEmbedRemovedMemberRoles,
  CreateRoleChangeEmbedReturns,
  CreateRoleChangeEmbedUserAvatarUrl,
  CreateRoleChangeEmbedUserMention,
  CreateRoleManagerEmbedProgressMessage,
  CreateRoleManagerEmbedReturns,
  CreateRoleManagerEmbedRoute,
  CreateRoleManagerEmbedStatus,
  CreateRoleManagerEmbedUserTag,
  CreateSuspiciousWordsEmbedCategories,
  CreateSuspiciousWordsEmbedChannelMention,
  CreateSuspiciousWordsEmbedMessageAttachments,
  CreateSuspiciousWordsEmbedMessageContent,
  CreateSuspiciousWordsEmbedMessageId,
  CreateSuspiciousWordsEmbedMessageUrl,
  CreateSuspiciousWordsEmbedReturns,
  CreateSuspiciousWordsEmbedUserMention,
  CreateTogglePermsEmbedProgressMessage,
  CreateTogglePermsEmbedReturns,
  CreateTogglePermsEmbedSuccess,
  CreateTogglePermsEmbedUserTag,
  CreateUpdateMessageEmbedChannelMention,
  CreateUpdateMessageEmbedMessageAttachments,
  CreateUpdateMessageEmbedMessageId,
  CreateUpdateMessageEmbedMessageUrl,
  CreateUpdateMessageEmbedNewMessageContent,
  CreateUpdateMessageEmbedOldMessageContent,
  CreateUpdateMessageEmbedReturns,
  CreateUpdateMessageEmbedUserMention,
  CreateUploadAttachmentEmbedChannelMention,
  CreateUploadAttachmentEmbedMessageAttachments,
  CreateUploadAttachmentEmbedMessageId,
  CreateUploadAttachmentEmbedMessageUrl,
  CreateUploadAttachmentEmbedReturns,
  CreateUploadAttachmentEmbedUserMention,
  CreateVoiceToolsEmbedProgressMessage,
  CreateVoiceToolsEmbedReturns,
  CreateVoiceToolsEmbedRoute,
  CreateVoiceToolsEmbedStatus,
  CreateVoiceToolsEmbedUserTag,
  GenerateColorKey,
  GenerateColorReturns,
  GenerateEmbedColor,
  GenerateEmbedDescription,
  GenerateEmbedFields,
  GenerateEmbedFooterText,
  GenerateEmbedReturns,
  GenerateEmbedThumbnailUrl,
  GenerateEmbedTitle,
  GenerateTitleKey,
  GenerateTitleReturns,
} from '../types';

/**
 * Generate color.
 *
 * @param {GenerateColorKey} key - Key.
 *
 * @returns {GenerateColorReturns}
 *
 * @since 1.0.0
 */
export function generateColor(key: GenerateColorKey): GenerateColorReturns {
  switch (key) {
    case 'complete':
    case 'success':
      return '#5fdc46';
    case 'fail':
    case 'error':
      return '#de564f';
    case 'in-progress':
    case 'warn':
      return '#eea942';
    case 'info':
      return '#4798e0';
    case 'default':
    default:
      return '#808080';
  }
}

/**
 * Generate embed.
 *
 * @param {GenerateEmbedTitle}        title        - Title.
 * @param {GenerateEmbedDescription}  description  - Description.
 * @param {GenerateEmbedFields}       fields       - Fields.
 * @param {GenerateEmbedColor}        color        - Color.
 * @param {GenerateEmbedFooterText}   footerText   - Footer text.
 * @param {GenerateEmbedThumbnailUrl} thumbnailUrl - Thumbnail url.
 *
 * @returns {GenerateEmbedReturns}
 *
 * @since 1.0.0
 */
export function generateEmbed(title: GenerateEmbedTitle, description: GenerateEmbedDescription, fields: GenerateEmbedFields, color: GenerateEmbedColor, footerText: GenerateEmbedFooterText, thumbnailUrl: GenerateEmbedThumbnailUrl): GenerateEmbedReturns {
  const messageEmbed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setFooter({
      text: footerText,
    })
    .setTimestamp();

  if (fields !== undefined) {
    messageEmbed.addFields(fields);
  }

  if (thumbnailUrl !== undefined) {
    messageEmbed.setThumbnail(thumbnailUrl);
  }

  return messageEmbed;
}

/**
 * Generate title.
 *
 * @param {GenerateTitleKey} key - Key.
 *
 * @returns {GenerateTitleReturns}
 *
 * @since 1.0.0
 */
export function generateTitle(key: GenerateTitleKey): GenerateTitleReturns {
  switch (key) {
    case 'bulk-ban-complete':
      return 'Banned Members';
    case 'bulk-ban-fail':
      return 'Failed to Ban Members';
    case 'bulk-ban-in-progress':
      return 'Banning Members';
    case 'role-manager-add-complete':
      return 'Roles Added';
    case 'role-manager-add-fail':
      return 'Failed to Add Roles';
    case 'role-manager-add-in-progress':
      return 'Adding Roles';
    case 'role-manager-remove-complete':
      return 'Roles Removed';
    case 'role-manager-remove-fail':
      return 'Failed to Remove Roles';
    case 'role-manager-remove-in-progress':
      return 'Removing Roles';
    case 'voice-tools-disconnect-complete':
      return 'Disconnected';
    case 'voice-tools-disconnect-fail':
      return 'Failed to Disconnect';
    case 'voice-tools-disconnect-in-progress':
      return 'Disconnecting';
    case 'voice-tools-unmute-complete':
      return 'Unmuted';
    case 'voice-tools-unmute-fail':
      return 'Failed to Unmute';
    case 'voice-tools-unmute-in-progress':
      return 'Unmuting';
    case 'voice-tools-invite-complete':
      return 'Invited to Speak';
    case 'voice-tools-invite-fail':
      return 'Failed to Invite to Speak';
    case 'voice-tools-invite-in-progress':
      return 'Inviting to Speak';
    default:
      return 'Unknown';
  }
}

/**
 * Add attachment fields.
 *
 * @param {AddAttachmentFieldsMessageAttachments} messageAttachments - Message attachments.
 *
 * @returns {AddAttachmentFieldsReturns}
 *
 * @since 1.0.0
 */
export function addAttachmentFields(messageAttachments: AddAttachmentFieldsMessageAttachments): AddAttachmentFieldsReturns {
  const fields: EmbedFieldData[] = [];

  messageAttachments.forEach((messageAttachment, messageAttachmentKey) => {
    const messageAttachmentUrl = messageAttachment.url;

    fields.push({
      name: `**Attachment ${messageAttachmentKey + 1}**`,
      value: messageAttachmentUrl,
    });
  });

  return fields;
}

/**
 * Add message fields.
 *
 * @param {AddMessageFieldsTitle}          title          - Title.
 * @param {AddMessageFieldsMessageContent} messageContent - Message content.
 *
 * @returns {AddMessageFieldsReturns}
 *
 * @since 1.0.0
 */
export function addMessageFields(title: AddMessageFieldsTitle, messageContent: AddMessageFieldsMessageContent): AddMessageFieldsReturns {
  const messageChunks = splitStringChunks(messageContent, 1020);

  const fields: EmbedFieldData[] = [];

  messageChunks.forEach((messageChunk, messageChunkKey) => {
    fields.push({
      name: [
        '**',
        title,
        ...(messageChunkKey > 0) ? [' (cont.)'] : [],
        '**',
      ].join(''),
      value: `>>> ${messageChunk}`, // 1024 characters max per field (">>> " is 4 characters).
    });
  });

  return fields;
}

/**
 * Add time duration fields.
 *
 * @param {AddTimeDurationFieldsAccountAge} accountAge   - Account age.
 * @param {AddTimeDurationFieldsTimeOfStay} [timeOfStay] - Time of stay.
 *
 * @returns {AddTimeDurationFieldsReturns}
 *
 * @since 1.0.0
 */
export function addTimeDurationFields(accountAge: AddTimeDurationFieldsAccountAge, timeOfStay?: AddTimeDurationFieldsTimeOfStay): AddTimeDurationFieldsReturns {
  const fields: EmbedFieldData[] = [];

  fields.push({
    name: '**Account Age**',
    value: fetchFormattedDuration(accountAge),
  });

  if (timeOfStay !== undefined) {
    fields.push({
      name: '**Time of Stay**',
      value: fetchFormattedDuration(timeOfStay),
    });
  }

  return fields;
}

/**
 * Add user information fields.
 *
 * @param {AddUserInformationFieldsUserTag}     userTag     - User tag.
 * @param {AddUserInformationFieldsUserMention} userMention - User mention.
 * @param {AddUserInformationFieldsUserAvatar}  userAvatar  - User avatar.
 *
 * @returns {AddUserInformationFieldsReturns}
 *
 * @since 1.0.0
 */
export function addUserInformationFields(userTag: AddUserInformationFieldsUserTag, userMention: AddUserInformationFieldsUserMention, userAvatar: AddUserInformationFieldsUserAvatar): AddUserInformationFieldsReturns {
  const id = userMention.replace(/[<@!>]/g, '');

  const fields: EmbedFieldData[] = [];

  fields.push({
    name: '**ID**',
    value: `\`${id}\``,
    inline: true,
  });

  fields.push({
    name: '**Tag**',
    value: `\`${userTag}\``,
    inline: true,
  });

  if (userAvatar !== null) {
    fields.push({
      name: '**Avatar**',
      value: `\`${userAvatar}\``,
    });
  }

  return fields;
}

/**
 * Create bulk ban embed.
 *
 * @param {CreateBulkBanEmbedProgressMessage} progressMessage - Progress message.
 * @param {CreateBulkBanEmbedStatus}          status          - Status.
 * @param {CreateBulkBanEmbedUserTag}         userTag         - User tag.
 *
 * @returns {CreateBulkBanEmbedReturns}
 *
 * @since 1.0.0
 */
export function createBulkBanEmbed(progressMessage: CreateBulkBanEmbedProgressMessage, status: CreateBulkBanEmbedStatus, userTag: CreateBulkBanEmbedUserTag): CreateBulkBanEmbedReturns {
  return generateEmbed(
    generateTitle(`bulk-ban-${status}`),
    progressMessage,
    undefined,
    generateColor(status),
    `Initiated by ${userTag}`,
    undefined,
  );
}

/**
 * Create change nickname embed.
 *
 * @param {CreateChangeNicknameEmbedOldNickname}   oldNickname   - Nickname (old).
 * @param {CreateChangeNicknameEmbedNewNickname}   newNickname   - Nickname (new).
 * @param {CreateChangeNicknameEmbedUserMention}   userMention   - User mention.
 * @param {CreateChangeNicknameEmbedUserAvatarUrl} userAvatarUrl - User avatar url.
 *
 * @returns {CreateChangeNicknameEmbedReturns}
 *
 * @since 1.0.0
 */
export function createChangeNicknameEmbed(oldNickname: CreateChangeNicknameEmbedOldNickname, newNickname: CreateChangeNicknameEmbedNewNickname, userMention: CreateChangeNicknameEmbedUserMention, userAvatarUrl: CreateChangeNicknameEmbedUserAvatarUrl): CreateChangeNicknameEmbedReturns {
  const id = userMention.replace(/[<@!>]/g, '');

  const fields: EmbedFieldData[] = [];

  let actionTitle;
  let actionDescription;

  if (oldNickname !== null) {
    fields.push({
      name: '**Old nickname**',
      value: `\`${oldNickname}\``,
      inline: true,
    });
  }

  if (newNickname !== null) {
    fields.push({
      name: '**New nickname**',
      value: `\`${newNickname}\``,
      inline: true,
    });
  }

  if (oldNickname === null) {
    actionTitle = 'Added';
    actionDescription = 'added a new nickname';
  } else if (newNickname === null) {
    actionTitle = 'Removed';
    actionDescription = 'removed their nickname';
  } else {
    actionTitle = 'Changed';
    actionDescription = 'changed their nickname';
  }

  return generateEmbed(
    `Nickname ${actionTitle}`,
    `:clown: ${userMention} ${actionDescription}`,
    fields,
    generateColor('info'),
    `User ID: ${id}`,
    userAvatarUrl,
  );
}

/**
 * Create change username embed.
 *
 * @param {CreateChangeUsernameEmbedOldUserTag}    oldUserTag    - User tag (old).
 * @param {CreateChangeUsernameEmbedNewUserTag}    newUserTag    - User tag (new).
 * @param {CreateChangeUsernameEmbedUserMention}   userMention   - User mention.
 * @param {CreateChangeUsernameEmbedUserAvatarUrl} userAvatarUrl - User avatar url.
 *
 * @returns {CreateChangeUsernameEmbedReturns}
 *
 * @since 1.0.0
 */
export function createChangeUsernameEmbed(oldUserTag: CreateChangeUsernameEmbedOldUserTag, newUserTag: CreateChangeUsernameEmbedNewUserTag, userMention: CreateChangeUsernameEmbedUserMention, userAvatarUrl: CreateChangeUsernameEmbedUserAvatarUrl): CreateChangeUsernameEmbedReturns {
  const id = userMention.replace(/[<@!>]/g, '');

  const fields: EmbedFieldData[] = [];

  if (oldUserTag !== null) {
    fields.push({
      name: '**Old username**',
      value: `\`${oldUserTag}\``,
      inline: true,
    });
  }

  fields.push({
    name: '**New username**',
    value: `\`${newUserTag}\``,
    inline: true,
  });

  return generateEmbed(
    'Username Changed',
    `:clown: ${userMention} changed their username`,
    fields,
    generateColor('info'),
    `User ID: ${id}`,
    userAvatarUrl,
  );
}

/**
 * Create command error embed.
 *
 * @param {CreateCommandErrorEmbedReason}  reason  - Reason.
 * @param {CreateCommandErrorEmbedUserTag} userTag - User tag.
 *
 * @returns {CreateCommandErrorEmbedReturns}
 *
 * @since 1.0.0
 */
export function createCommandErrorEmbed(reason: CreateCommandErrorEmbedReason, userTag: CreateCommandErrorEmbedUserTag): CreateCommandErrorEmbedReturns {
  return generateEmbed(
    'Error',
    reason,
    undefined,
    generateColor('error'),
    `Initiated by ${userTag}`,
    undefined,
  );
}

/**
 * Create delete message embed.
 *
 * @param {CreateDeleteMessageEmbedUserMention}        userMention        - User mention.
 * @param {CreateDeleteMessageEmbedChannelMention}     channelMention     - Channel mention.
 * @param {CreateDeleteMessageEmbedMessageId}          messageId          - Message id.
 * @param {CreateDeleteMessageEmbedMessageContent}     messageContent     - Message content.
 * @param {CreateDeleteMessageEmbedMessageAttachments} messageAttachments - Message attachments.
 * @param {CreateDeleteMessageEmbedMessageUrl}         messageUrl         - Message url.
 *
 * @returns {CreateDeleteMessageEmbedReturns}
 *
 * @since 1.0.0
 */
export function createDeleteMessageEmbed(userMention: CreateDeleteMessageEmbedUserMention, channelMention: CreateDeleteMessageEmbedChannelMention, messageId: CreateDeleteMessageEmbedMessageId, messageContent: CreateDeleteMessageEmbedMessageContent, messageAttachments: CreateDeleteMessageEmbedMessageAttachments, messageUrl: CreateDeleteMessageEmbedMessageUrl): CreateDeleteMessageEmbedReturns {
  const fields: EmbedFieldData[] = [];

  if (!_.isEmpty(messageContent)) {
    fields.push(...addMessageFields('Message', messageContent));
  }

  if (messageAttachments.length > 0) {
    fields.push(...addAttachmentFields(messageAttachments));
  }

  return generateEmbed(
    'Message Deleted',
    `:wastebasket: [Message](${messageUrl}) sent by ${userMention} was deleted in ${channelMention}`,
    fields,
    generateColor('error'),
    `Message ID: ${messageId}`,
    undefined,
  );
}

/**
 * Create guild join embed.
 *
 * @param {CreateGuildJoinEmbedUserTag}       userTag       - User tag.
 * @param {CreateGuildJoinEmbedUserMention}   userMention   - User mention.
 * @param {CreateGuildJoinEmbedUserAvatar}    userAvatar    - User avatar.
 * @param {CreateGuildJoinEmbedUserAvatarUrl} userAvatarUrl - User avatar url.
 * @param {CreateGuildJoinEmbedUserCreatedAt} userCreatedAt - User created at.
 *
 * @returns {CreateGuildJoinEmbedReturns}
 *
 * @since 1.0.0
 */
export function createGuildJoinEmbed(userTag: CreateGuildJoinEmbedUserTag, userMention: CreateGuildJoinEmbedUserMention, userAvatar: CreateGuildJoinEmbedUserAvatar, userAvatarUrl: CreateGuildJoinEmbedUserAvatarUrl, userCreatedAt: CreateGuildJoinEmbedUserCreatedAt): CreateGuildJoinEmbedReturns {
  const currentDateTime = fetchFormattedDate('now', undefined, 'config', 'DDDD ttt');

  const id = userMention.replace(/[<@!>]/g, '');

  const fields: EmbedFieldData[] = [];

  fields.push(...addUserInformationFields(userTag, userMention, userAvatar));

  fields.push(...addTimeDurationFields(userCreatedAt));

  return generateEmbed(
    'Member Joined the Guild',
    `:point_right: ${userMention} has joined the guild on **${currentDateTime}**`,
    fields,
    generateColor('warn'),
    `User ID: ${id}`,
    userAvatarUrl,
  );
}

/**
 * Create guild leave embed.
 *
 * @param {CreateGuildLeaveEmbedUserTag}        userTag        - User tag.
 * @param {CreateGuildLeaveEmbedUserMention}    userMention    - User mention.
 * @param {CreateGuildLeaveEmbedUserAvatar}     userAvatar     - User avatar.
 * @param {CreateGuildLeaveEmbedUserAvatarUrl}  userAvatarUrl  - User avatar url.
 * @param {CreateGuildLeaveEmbedUserCreatedAt}  userCreatedAt  - User created at.
 * @param {CreateGuildLeaveEmbedMemberJoinedAt} memberJoinedAt - Member joined at.
 * @param {CreateGuildLeaveEmbedMemberRoles}    memberRoles    - Member roles.
 *
 * @returns {CreateGuildLeaveEmbedReturns}
 *
 * @since 1.0.0
 */
export function createGuildLeaveEmbed(userTag: CreateGuildLeaveEmbedUserTag, userMention: CreateGuildLeaveEmbedUserMention, userAvatar: CreateGuildLeaveEmbedUserAvatar, userAvatarUrl: CreateGuildLeaveEmbedUserAvatarUrl, userCreatedAt: CreateGuildLeaveEmbedUserCreatedAt, memberJoinedAt: CreateGuildLeaveEmbedMemberJoinedAt, memberRoles: CreateGuildLeaveEmbedMemberRoles): CreateGuildLeaveEmbedReturns {
  const currentDateTime = fetchFormattedDate('now', undefined, 'config', 'DDDD ttt');

  const assignedRoles = _.filter(memberRoles, (memberRole) => memberRole.name !== '@everyone');
  const assignedRolesMention = _.map(assignedRoles, (assignedRole) => assignedRole.toString());
  const assignedRolesDisplay = (assignedRoles.length > 0) ? assignedRolesMention.join(', ') : '';
  const id = userMention.replace(/[<@!>]/g, '');

  const fields: EmbedFieldData[] = [];

  fields.push(...addUserInformationFields(userTag, userMention, userAvatar));

  fields.push(...addTimeDurationFields(userCreatedAt, memberJoinedAt));

  if (assignedRoles.length > 0) {
    fields.push({
      name: '**Assigned Roles**',
      value: assignedRolesDisplay,
    });
  }

  return generateEmbed(
    'Member Left the Guild',
    `:point_left: ${userMention} has left the guild on **${currentDateTime}**`,
    fields,
    generateColor('warn'),
    `User ID: ${id}`,
    userAvatarUrl,
  );
}

/**
 * Create includes link embed.
 *
 * @param {CreateIncludesLinkEmbedUserMention}        userMention        - User mention.
 * @param {CreateIncludesLinkEmbedChannelMention}     channelMention     - Channel mention.
 * @param {CreateIncludesLinkEmbedMessageId}          messageId          - Message id.
 * @param {CreateIncludesLinkEmbedMessageContent}     messageContent     - Message content.
 * @param {CreateIncludesLinkEmbedMessageAttachments} messageAttachments - Message attachments.
 * @param {CreateIncludesLinkEmbedMessageUrl}         messageUrl         - Message url.
 *
 * @returns {CreateIncludesLinkEmbedReturns}
 *
 * @since 1.0.0
 */
export function createIncludesLinkEmbed(userMention: CreateIncludesLinkEmbedUserMention, channelMention: CreateIncludesLinkEmbedChannelMention, messageId: CreateIncludesLinkEmbedMessageId, messageContent: CreateIncludesLinkEmbedMessageContent, messageAttachments: CreateIncludesLinkEmbedMessageAttachments, messageUrl: CreateIncludesLinkEmbedMessageUrl): CreateIncludesLinkEmbedReturns {
  const fields: EmbedFieldData[] = [];

  if (!_.isEmpty(messageContent)) {
    fields.push(...addMessageFields('Message', messageContent));
  }

  if (messageAttachments.length > 0) {
    fields.push(...addAttachmentFields(messageAttachments));
  }

  return generateEmbed(
    'Links Detected',
    `:link: [Message](${messageUrl}) sent by ${userMention} includes links in ${channelMention}`,
    fields,
    generateColor('info'),
    `Message ID: ${messageId}`,
    undefined,
  );
}

/**
 * Create list emojis embed.
 *
 * @param {CreateListEmojisEmbedRoute}   route   - Route.
 * @param {CreateListEmojisEmbedUserTag} userTag - User tag.
 *
 * @returns {CreateListEmojisEmbedReturns}
 *
 * @since 1.0.0
 */
export function createListEmojisEmbed(route: CreateListEmojisEmbedRoute, userTag: CreateListEmojisEmbedUserTag): CreateListEmojisEmbedReturns {
  const routeCapitalized = `${route[0].toUpperCase()}${route.substring(1)}`;

  return generateEmbed(
    `List of ${routeCapitalized} Emojis`,
    [
      'Both inline-formatted and table-formatted attachments are available for your convenience.',
      '**You may download the attached files or partially expand and review them directly on Discord.**',
    ].join('\n\n'),
    undefined,
    generateColor('info'),
    `Initiated by ${userTag}`,
    undefined,
  );
}

/**
 * Create list members embed.
 *
 * @param {CreateListMembersEmbedTitle}        title          - Title.
 * @param {CreateListMembersEmbedUserTag}      userTag        - User tag.
 * @param {CreateListMembersEmbedThumbnailUrl} [thumbnailUrl] - Thumbnail url.
 *
 * @returns {CreateListMembersEmbedReturns}
 *
 * @since 1.0.0
 */
export function createListMembersEmbed(title: CreateListMembersEmbedTitle, userTag: CreateListMembersEmbedUserTag, thumbnailUrl?: CreateListMembersEmbedThumbnailUrl): CreateListMembersEmbedReturns {
  return generateEmbed(
    title,
    [
      'Both inline-formatted and table-formatted attachments are available for your convenience.',
      '**You may download the attached files or partially expand and review them directly on Discord.**',
    ].join('\n\n'),
    undefined,
    generateColor('info'),
    `Initiated by ${userTag}`,
    thumbnailUrl,
  );
}

/**
 * Create no results embed.
 *
 * @param {CreateNoResultsEmbedReason}  reason  - Reason.
 * @param {CreateNoResultsEmbedUserTag} userTag - User tag.
 *
 * @returns {CreateNoResultsEmbedReturns}
 *
 * @since 1.0.0
 */
export function createNoResultsEmbed(reason: CreateNoResultsEmbedReason, userTag: CreateNoResultsEmbedUserTag): CreateNoResultsEmbedReturns {
  return generateEmbed(
    'No Results',
    reason,
    undefined,
    generateColor('default'),
    `Initiated by ${userTag}`,
    undefined,
  );
}

/**
 * Create remove affiliates embed.
 *
 * @param {CreateRemoveAffiliatesEmbedUserMention}        userMention        - User mention.
 * @param {CreateRemoveAffiliatesEmbedChannelMention}     channelMention     - Channel mention.
 * @param {CreateRemoveAffiliatesEmbedMessageId}          messageId          - Message id.
 * @param {CreateRemoveAffiliatesEmbedMessageContent}     messageContent     - Message content.
 * @param {CreateRemoveAffiliatesEmbedMessageAttachments} messageAttachments - Message attachments.
 * @param {CreateRemoveAffiliatesEmbedMessageUrl}         messageUrl         - Message url.
 * @param {CreateRemoveAffiliatesEmbedPlatforms}          platforms          - Platforms.
 *
 * @returns {CreateRemoveAffiliatesEmbedReturns}
 *
 * @since 1.0.0
 */
export function createRemoveAffiliatesEmbed(userMention: CreateRemoveAffiliatesEmbedUserMention, channelMention: CreateRemoveAffiliatesEmbedChannelMention, messageId: CreateRemoveAffiliatesEmbedMessageId, messageContent: CreateRemoveAffiliatesEmbedMessageContent, messageAttachments: CreateRemoveAffiliatesEmbedMessageAttachments, messageUrl: CreateRemoveAffiliatesEmbedMessageUrl, platforms: CreateRemoveAffiliatesEmbedPlatforms): CreateRemoveAffiliatesEmbedReturns {
  const fields: EmbedFieldData[] = [];

  fields.push({
    name: '**Platforms**',
    value: platforms.join(', '),
  });

  if (!_.isEmpty(messageContent)) {
    fields.push(...addMessageFields('Message', messageContent));
  }

  if (messageAttachments.length > 0) {
    fields.push(...addAttachmentFields(messageAttachments));
  }

  return generateEmbed(
    'Affiliates Detected',
    `:rotating_light: [Message](${messageUrl}) sent by ${userMention} includes affiliates in ${channelMention}`,
    fields,
    generateColor('warn'),
    `Message ID: ${messageId}`,
    undefined,
  );
}

/**
 * Create role change embed.
 *
 * @param {CreateRoleChangeEmbedUserMention}        userMention        - User mention.
 * @param {CreateRoleChangeEmbedUserAvatarUrl}      userAvatarUrl      - User avatar url.
 * @param {CreateRoleChangeEmbedAddedMemberRoles}   addedMemberRoles   - Member roles (added).
 * @param {CreateRoleChangeEmbedRemovedMemberRoles} removedMemberRoles - Member roles (removed).
 *
 * @returns {CreateRoleChangeEmbedReturns}
 *
 * @since 1.0.0
 */
export function createRoleChangeEmbed(userMention: CreateRoleChangeEmbedUserMention, userAvatarUrl: CreateRoleChangeEmbedUserAvatarUrl, addedMemberRoles: CreateRoleChangeEmbedAddedMemberRoles, removedMemberRoles: CreateRoleChangeEmbedRemovedMemberRoles): CreateRoleChangeEmbedReturns {
  const id = userMention.replace(/[<@!>]/g, '');

  const rolesAddedDisplay = _.map(addedMemberRoles, (addedMemberRole) => addedMemberRole.toString()).join(', ');
  const rolesRemovedDisplay = _.map(removedMemberRoles, (removedMemberRole) => removedMemberRole.toString()).join(', ');

  const fields: EmbedFieldData[] = [];

  if (addedMemberRoles.length > 0) {
    fields.push({
      name: '**Added**',
      value: rolesAddedDisplay,
    });
  }

  if (removedMemberRoles.length > 0) {
    fields.push({
      name: '**Removed**',
      value: rolesRemovedDisplay,
    });
  }

  return generateEmbed(
    'Member Role Changed',
    `:roller_skate: ${userMention} roles have been changed`,
    fields,
    generateColor('warn'),
    `User ID: ${id}`,
    userAvatarUrl,
  );
}

/**
 * Create role manager embed.
 *
 * @param {CreateRoleManagerEmbedProgressMessage} progressMessage - Progress message.
 * @param {CreateRoleManagerEmbedRoute}           route           - Route.
 * @param {CreateRoleManagerEmbedStatus}          status          - Status.
 * @param {CreateRoleManagerEmbedUserTag}         userTag         - User tag.
 *
 * @returns {CreateRoleManagerEmbedReturns}
 *
 * @since 1.0.0
 */
export function createRoleManagerEmbed(progressMessage: CreateRoleManagerEmbedProgressMessage, route: CreateRoleManagerEmbedRoute, status: CreateRoleManagerEmbedStatus, userTag: CreateRoleManagerEmbedUserTag): CreateRoleManagerEmbedReturns {
  return generateEmbed(
    generateTitle(`role-manager-${route}-${status}`),
    progressMessage,
    undefined,
    generateColor(status),
    `Initiated by ${userTag}`,
    undefined,
  );
}

/**
 * Create suspicious words embed.
 *
 * @param {CreateSuspiciousWordsEmbedUserMention}        userMention        - User mention.
 * @param {CreateSuspiciousWordsEmbedChannelMention}     channelMention     - Channel mention.
 * @param {CreateSuspiciousWordsEmbedMessageId}          messageId          - Message id.
 * @param {CreateSuspiciousWordsEmbedMessageContent}     messageContent     - Message content.
 * @param {CreateSuspiciousWordsEmbedMessageAttachments} messageAttachments - Message attachments.
 * @param {CreateSuspiciousWordsEmbedMessageUrl}         messageUrl         - Message url.
 * @param {CreateSuspiciousWordsEmbedCategories}         categories         - Categories.
 *
 * @returns {CreateSuspiciousWordsEmbedReturns}
 *
 * @since 1.0.0
 */
export function createSuspiciousWordsEmbed(userMention: CreateSuspiciousWordsEmbedUserMention, channelMention: CreateSuspiciousWordsEmbedChannelMention, messageId: CreateSuspiciousWordsEmbedMessageId, messageContent: CreateSuspiciousWordsEmbedMessageContent, messageAttachments: CreateSuspiciousWordsEmbedMessageAttachments, messageUrl: CreateSuspiciousWordsEmbedMessageUrl, categories: CreateSuspiciousWordsEmbedCategories): CreateSuspiciousWordsEmbedReturns {
  const fields: EmbedFieldData[] = [];

  fields.push({
    name: '**Categories**',
    value: categories.join(', '),
  });

  if (!_.isEmpty(messageContent)) {
    fields.push(...addMessageFields('Message', messageContent));
  }

  if (messageAttachments.length > 0) {
    fields.push(...addAttachmentFields(messageAttachments));
  }

  return generateEmbed(
    'Suspicious Word Detected',
    `:detective: [Message](${messageUrl}) sent by ${userMention} includes suspicious words in ${channelMention}`,
    fields,
    generateColor('info'),
    `Message ID: ${messageId}`,
    undefined,
  );
}

/**
 * Create toggle perms embed.
 *
 * @param {CreateTogglePermsEmbedProgressMessage} progressMessage - Progress message.
 * @param {CreateTogglePermsEmbedSuccess}         success         - Success.
 * @param {CreateTogglePermsEmbedUserTag}         userTag         - User tag.
 *
 * @returns {CreateTogglePermsEmbedReturns}
 *
 * @since 1.0.0
 */
export function createTogglePermsEmbed(progressMessage: CreateTogglePermsEmbedProgressMessage, success: CreateTogglePermsEmbedSuccess, userTag: CreateTogglePermsEmbedUserTag): CreateTogglePermsEmbedReturns {
  return generateEmbed(
    'Toggle Permissions',
    progressMessage,
    undefined,
    (success) ? generateColor('success') : generateColor('error'),
    `Initiated by ${userTag}`,
    undefined,
  );
}

/**
 * Create update message embed.
 *
 * @param {CreateUpdateMessageEmbedUserMention}        userMention        - User mention.
 * @param {CreateUpdateMessageEmbedChannelMention}     channelMention     - Channel mention.
 * @param {CreateUpdateMessageEmbedMessageId}          messageId          - Message id.
 * @param {CreateUpdateMessageEmbedOldMessageContent}  oldMessageContent  - Message content (old).
 * @param {CreateUpdateMessageEmbedNewMessageContent}  newMessageContent  - Message content (new).
 * @param {CreateUpdateMessageEmbedMessageAttachments} messageAttachments - Message attachments.
 * @param {CreateUpdateMessageEmbedMessageUrl}         messageUrl         - Message url.
 *
 * @returns {CreateUpdateMessageEmbedReturns}
 *
 * @since 1.0.0
 */
export function createUpdateMessageEmbed(userMention: CreateUpdateMessageEmbedUserMention, channelMention: CreateUpdateMessageEmbedChannelMention, messageId: CreateUpdateMessageEmbedMessageId, oldMessageContent: CreateUpdateMessageEmbedOldMessageContent, newMessageContent: CreateUpdateMessageEmbedNewMessageContent, messageAttachments: CreateUpdateMessageEmbedMessageAttachments, messageUrl: CreateUpdateMessageEmbedMessageUrl): CreateUpdateMessageEmbedReturns {
  const fields: EmbedFieldData[] = [];

  if (!_.isEmpty(oldMessageContent)) {
    fields.push(...addMessageFields('Old message', oldMessageContent));
  }

  if (!_.isEmpty(newMessageContent)) {
    fields.push(...addMessageFields('New message', newMessageContent));
  }

  if (messageAttachments.length > 0) {
    fields.push(...addAttachmentFields(messageAttachments));
  }

  return generateEmbed(
    'Message Updated',
    `:pencil: [Message](${messageUrl}) sent by ${userMention} was updated in ${channelMention}`,
    fields,
    generateColor('warn'),
    `Message ID: ${messageId}`,
    undefined,
  );
}

/**
 * Create upload attachment embed.
 *
 * @param {CreateUploadAttachmentEmbedUserMention}        userMention        - User mention.
 * @param {CreateUploadAttachmentEmbedChannelMention}     channelMention     - Channel mention.
 * @param {CreateUploadAttachmentEmbedMessageId}          messageId          - Message id.
 * @param {CreateUploadAttachmentEmbedMessageAttachments} messageAttachments - Message attachments.
 * @param {CreateUploadAttachmentEmbedMessageUrl}         messageUrl         - Message url.
 *
 * @returns {CreateUploadAttachmentEmbedReturns}
 *
 * @since 1.0.0
 */
export function createUploadAttachmentEmbed(userMention: CreateUploadAttachmentEmbedUserMention, channelMention: CreateUploadAttachmentEmbedChannelMention, messageId: CreateUploadAttachmentEmbedMessageId, messageAttachments: CreateUploadAttachmentEmbedMessageAttachments, messageUrl: CreateUploadAttachmentEmbedMessageUrl): CreateUploadAttachmentEmbedReturns {
  const fields: EmbedFieldData[] = [];

  if (messageAttachments.length > 0) {
    fields.push(...addAttachmentFields(messageAttachments));
  }

  return generateEmbed(
    'Attachment Uploaded',
    `:dividers: [Message](${messageUrl}) sent by ${userMention} includes attachments in ${channelMention}`,
    fields,
    generateColor('info'),
    `Message ID: ${messageId}`,
    undefined,
  );
}

/**
 * Create voice tools embed.
 *
 * @param {CreateVoiceToolsEmbedProgressMessage} progressMessage - Progress message.
 * @param {CreateVoiceToolsEmbedRoute}           route           - Route.
 * @param {CreateVoiceToolsEmbedStatus}          status          - Status.
 * @param {CreateVoiceToolsEmbedUserTag}         userTag         - User tag.
 *
 * @returns {CreateVoiceToolsEmbedReturns}
 *
 * @since 1.0.0
 */
export function createVoiceToolsEmbed(progressMessage: CreateVoiceToolsEmbedProgressMessage, route: CreateVoiceToolsEmbedRoute, status: CreateVoiceToolsEmbedStatus, userTag: CreateVoiceToolsEmbedUserTag): CreateVoiceToolsEmbedReturns {
  return generateEmbed(
    generateTitle(`voice-tools-${route}-${status}`),
    progressMessage,
    undefined,
    generateColor(status),
    `Initiated by ${userTag}`,
    undefined,
  );
}
