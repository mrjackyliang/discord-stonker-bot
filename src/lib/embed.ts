import {
  Collection,
  ColorResolvable,
  EmbedFieldData,
  MessageAttachment,
  MessageEmbed,
  Role,
  Snowflake,
} from 'discord.js';
import _ from 'lodash';
import { DateTime, DurationUnit, Interval } from 'luxon';

import config from '../../config.json';

import { getReadableDuration, splitStringChunks } from './utilities';
import {
  EmbedStatus,
  MemberMonitorMode,
  RoleRoute,
  VoiceRoute,
} from '../typings';

/**
 * Add embed.
 *
 * @param {string}                     title        - Embed title.
 * @param {string}                     description  - Embed description.
 * @param {string|undefined}           thumbnailUrl - Embed thumbnail url.
 * @param {EmbedFieldData[]|undefined} fields       - Embed fields.
 * @param {string}                     footer       - Embed footer message.
 * @param {ColorResolvable}            color        - Embed hex color.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
function addEmbed(title: string, description: string, thumbnailUrl: string | undefined, fields: EmbedFieldData[] | undefined, footer: string, color: ColorResolvable = '#808080'): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter(footer);

  if (thumbnailUrl !== undefined) {
    embed.setThumbnail(thumbnailUrl);
  }

  if (fields !== undefined) {
    embed.addFields(fields);
  }

  return embed;
}

/**
 * Add message fields.
 *
 * @param {string} message    - Message content.
 * @param {string} fieldTitle - Field title.
 *
 * @returns {EmbedFieldData[]}
 *
 * @since 1.0.0
 */
export function addMessageFields(message: string, fieldTitle: string = 'Message'): EmbedFieldData[] {
  const theMessages = splitStringChunks(message, 1020);
  const fields: EmbedFieldData[] = [];

  _.forEach(theMessages, (theMessage, key) => {
    fields.push({
      name: `**${fieldTitle}${(key > 0) ? ' (cont.)' : ''}**`,
      value: `>>> ${theMessage}`,
    });
  });

  return fields;
}

/**
 * Add attachment fields.
 *
 * @param {Collection<Snowflake, MessageAttachment>} attachments - The attachments.
 * @param {string}                                   fieldTitle  - Field title.
 *
 * @returns {EmbedFieldData[]}
 *
 * @since 1.0.0
 */
export function addAttachmentFields(attachments: Collection<Snowflake, MessageAttachment>, fieldTitle: string = 'Attachment'): EmbedFieldData[] {
  const fields: EmbedFieldData[] = [];

  _.forEach([...attachments.values()], (attachment, key) => {
    fields.push({
      name: `**${fieldTitle} ${key + 1}**`,
      value: attachment.url,
    });
  });

  return fields;
}

/**
 * Create bulk ban embed.
 *
 * @param {string}      message - Embed message.
 * @param {EmbedStatus} status  - Status of role command.
 * @param {string}      userTag - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createBulkBanEmbed(message: string, status: EmbedStatus, userTag: string): MessageEmbed {
  const generateTitle = (theStatus: EmbedStatus): string => {
    switch (theStatus) {
      case 'complete':
        return 'Banned Members';
      case 'fail':
        return 'Failed to Ban Members';
      case 'in-progress':
        return 'Banning Members';
      default:
        return 'Unknown';
    }
  };
  const generateColor = (theStatus: EmbedStatus): ColorResolvable => {
    switch (theStatus) {
      case 'complete':
        return '#5fdc46';
      case 'fail':
        return '#de564f';
      case 'in-progress':
      default:
        return '#eea942';
    }
  };

  return addEmbed(
    generateTitle(status),
    message,
    undefined,
    undefined,
    `Initiated by @${userTag}`,
    generateColor(status),
  );
}

/**
 * Create change nickname embed.
 *
 * @param {string|null}      oldNickname - Old nickname.
 * @param {string|null}      newNickname - New nickname.
 * @param {string}           userMention - User mention.
 * @param {string|undefined} avatarUrl   - Avatar url.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createChangeNicknameEmbed(oldNickname: string | null, newNickname: string | null, userMention: string, avatarUrl: string | undefined): MessageEmbed {
  const fields = [];

  let actionTitle;
  let actionDescription;

  if (oldNickname) {
    fields.push({
      name: '**Old nickname**',
      value: `\`${oldNickname}\``,
      inline: true,
    });
  }

  if (newNickname) {
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

  return addEmbed(
    `Nickname ${actionTitle}`,
    `:clown: ${userMention} ${actionDescription}`,
    avatarUrl,
    fields,
    `User ID: ${_.replace(userMention, /[<@!>]/g, '')}`,
    '#4798e0',
  );
}

/**
 * Create change username embed.
 *
 * @param {string|null} oldTag      - Old tag.
 * @param {string|null} newTag      - New tag.
 * @param {string}      userMention - User mention.
 * @param {string}      avatarUrl   - Avatar url.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createChangeUsernameEmbed(oldTag: string | null, newTag: string | null, userMention: string, avatarUrl: string): MessageEmbed {
  const fields = [];

  if (oldTag) {
    fields.push({
      name: '**Old username**',
      value: `\`@${oldTag}\``,
      inline: true,
    });
  }

  if (newTag) {
    fields.push({
      name: '**New username**',
      value: `\`@${newTag}\``,
      inline: true,
    });
  }

  return addEmbed(
    'Username Changed',
    `:clown: ${userMention} changed their username`,
    avatarUrl,
    fields,
    `User ID: ${_.replace(userMention, /[<@!>]/g, '')}`,
    '#4798e0',
  );
}

/**
 * Create command error embed.
 *
 * @param {string} reason  - The reason of the command error.
 * @param {string} userTag - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createCommandErrorEmbed(reason: string, userTag: string): MessageEmbed {
  return addEmbed(
    'Error',
    reason,
    undefined,
    undefined,
    `Initiated by @${userTag}`,
    '#de564f',
  );
}

/**
 * Create delete message embed.
 *
 * @param {string}                                   userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {Snowflake}                                id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createDeleteMessageEmbed(userMention: string, channelMention: string, id: Snowflake, content: string, attachments: Collection<Snowflake, MessageAttachment>, url: string): MessageEmbed {
  const fields = [];

  if (content) {
    fields.push(...addMessageFields(content));
  }

  if (attachments) {
    fields.push(...addAttachmentFields(attachments));
  }

  return addEmbed(
    'Message Deleted',
    `:wastebasket: [Message](${url}) sent by ${userMention} was deleted in ${channelMention}`,
    undefined,
    fields,
    `Message ID: ${id}`,
    '#de564f',
  );
}

/**
 * Create help menu embed.
 *
 * @param {{ queries: string[]; description: string; }[]} commands - Array of commands.
 * @param {string}                                        userTag  - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createHelpMenuEmbed(commands: { queries: string[]; description: string; }[], userTag: string): MessageEmbed {
  const fields: string[] = [];

  _.forEach(commands, (command) => {
    fields.push(`\`${command.queries.join('`\n`')}\`\n${command.description}`);
  });

  return addEmbed(
    'Command Help Menu',
    fields.join('\n\n'),
    undefined,
    undefined,
    `Initiated by @${userTag}`,
  );
}

/**
 * Create includes link embed.
 *
 * @param {string|undefined}                         userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {Snowflake}                                id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createIncludesLinkEmbed(userMention: string | undefined, channelMention: string, id: Snowflake, content: string, attachments: Collection<Snowflake, MessageAttachment>, url: string): MessageEmbed {
  const fields = [];

  if (content) {
    fields.push(...addMessageFields(content));
  }

  if (attachments) {
    fields.push(...addAttachmentFields(attachments));
  }

  return addEmbed(
    'Links Detected',
    `:link: [Message](${url}) sent by ${userMention} includes links in ${channelMention}`,
    undefined,
    fields,
    `Message ID: ${id}`,
    '#4798e0',
  );
}

/**
 * Create list members embed.
 *
 * @param {string}           title     - The embed title.
 * @param {string[]}         mentions  - List of member mentions.
 * @param {string|undefined} thumbnail - The thumbnail url.
 * @param {string}           userTag   - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createListMembersEmbed(title: string, mentions: string[], thumbnail: string | undefined, userTag: string): MessageEmbed {
  return addEmbed(
    title,
    mentions.join(', '),
    thumbnail,
    undefined,
    `Initiated by @${userTag}`,
    '#4798e0',
  );
}

/**
 * Create member monitor embed.
 *
 * @param {MemberMonitorMode}           mode      - Whether a user joined or left a guild.
 * @param {string}                      tag       - User tag.
 * @param {string}                      mention   - User mention.
 * @param {string|null}                 avatar    - User avatar.
 * @param {string}                      avatarUrl - User avatar url.
 * @param {Date}                        createdAt - User created at.
 * @param {Date}                        joinedAt  - User joined at.
 * @param {Collection<Snowflake, Role>} roles     - User roles.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createMemberMonitorEmbed(mode: MemberMonitorMode, tag: string, mention: string, avatar: string | null, avatarUrl: string, createdAt: Date, joinedAt: Date, roles: Collection<Snowflake, Role>): MessageEmbed {
  const fields = [];
  const serverJoin = (mode === 'join') ? ['Joined', 'joined'] : [];
  const serverLeave = (mode === 'leave') ? ['Left', 'left'] : [];
  const timeZone = _.get(config, 'settings.time-zone', 'Etc/UTC');
  const dateNow = DateTime.now();
  const toDurationUnit: DurationUnit[] = [
    'years',
    'months',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
  ];
  const accountAge = Interval.fromDateTimes(createdAt, dateNow).toDuration(toDurationUnit).toObject();
  const timeOfStay = Interval.fromDateTimes(joinedAt, dateNow).toDuration(toDurationUnit).toObject();

  if (mention) {
    fields.push({
      name: '**ID**',
      value: `\`${_.replace(mention, /[<@!>]/g, '')}\``,
      inline: true,
    });
  }

  if (tag) {
    fields.push({
      name: '**Tag**',
      value: `\`@${tag}\``,
      inline: true,
    });
  }

  if (avatar !== null) {
    fields.push({
      name: '**Avatar Hash**',
      value: `\`${avatar}\``,
    });
  }

  fields.push({
    name: '**Account Age**',
    value: getReadableDuration(accountAge),
  });

  if (mode === 'leave') {
    const timeOfStayDuration = getReadableDuration(timeOfStay);
    const assignedRoles = _.filter([...roles.values()], (role) => role.name !== '@everyone');
    const assignedRolesMention = _.map(assignedRoles, (assignedRole) => assignedRole.toString());
    const displayRoles = (_.size(assignedRoles) > 0) ? `roles (${assignedRolesMention.join(', ')})` : 'no roles';

    fields.push({
      name: '**Additional Information**',
      value: `Member stayed in the guild for ${timeOfStayDuration} and has ${displayRoles}.`,
    });
  }

  return addEmbed(
    `Member ${serverJoin[0] || serverLeave[0]} the Guild`,
    `${mention} has ${serverJoin[1] || serverLeave[1]} the guild on **${dateNow.setZone(timeZone).toFormat('DDDD ttt')}**`,
    avatarUrl,
    fields,
    `User ID: ${_.replace(mention, /[<@!>]/g, '')}`,
    '#eea942',
  );
}

/**
 * Create no results embed.
 *
 * @param {string} message - The reason of no results.
 * @param {string} userTag - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createNoResultsEmbed(message: string, userTag: string): MessageEmbed {
  return addEmbed(
    'No Results',
    message,
    undefined,
    undefined,
    `Initiated by @${userTag}`,
  );
}

/**
 * Create remove affiliate links embed.
 *
 * @param {string}                                   userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {Snowflake}                                id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 * @param {string[]}                                 websites       - Websites match.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createRemoveAffiliateLinksEmbed(userMention: string, channelMention: string, id: Snowflake, content: string, attachments: Collection<Snowflake, MessageAttachment>, url: string, websites: string[]): MessageEmbed {
  const fields = [];

  if (websites) {
    fields.push({
      name: '**Websites**',
      value: websites.join(', '),
    });
  }

  if (content) {
    fields.push(...addMessageFields(content));
  }

  if (attachments) {
    fields.push(...addAttachmentFields(attachments));
  }

  return addEmbed(
    'Affiliate Link Detected',
    `:rotating_light: [Message](${url}) sent by ${userMention} includes affiliate links in ${channelMention}.`,
    undefined,
    fields,
    `Message ID: ${id}`,
    '#eea942',
  );
}

/**
 * Create role manager embed.
 *
 * @param {RoleRoute}   route   - Role command route.
 * @param {string}      message - Embed message.
 * @param {EmbedStatus} status  - Status of role command.
 * @param {string}      userTag - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createRoleManagerEmbed(route: RoleRoute, message: string, status: EmbedStatus, userTag: string): MessageEmbed {
  const generateTitle = (theRoute: RoleRoute, theStatus: EmbedStatus): string => {
    const mode = `${theRoute}-${theStatus}`;

    switch (mode) {
      case 'add-complete':
        return 'Roles Added';
      case 'remove-complete':
        return 'Roles Removed';
      case 'add-fail':
        return 'Failed to Add Roles';
      case 'remove-fail':
        return 'Failed to Add Roles';
      case 'add-in-progress':
        return 'Adding Roles';
      case 'remove-in-progress':
        return 'Removing Roles';
      default:
        return 'Unknown';
    }
  };
  const generateColor = (theStatus: EmbedStatus): ColorResolvable => {
    switch (theStatus) {
      case 'complete':
        return '#5fdc46';
      case 'fail':
        return '#de564f';
      case 'in-progress':
      default:
        return '#eea942';
    }
  };

  return addEmbed(
    generateTitle(route, status),
    message,
    undefined,
    undefined,
    `Initiated by @${userTag}`,
    generateColor(status),
  );
}

/**
 * Create suspicious words embed.
 *
 * @param {string|undefined}                         userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {Snowflake}                                id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 * @param {string[]}                                 categories     - Categories match.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createSuspiciousWordsEmbed(userMention: string | undefined, channelMention: string, id: Snowflake, content: string, attachments: Collection<Snowflake, MessageAttachment>, url: string, categories: string[]): MessageEmbed {
  const fields = [];

  if (categories) {
    fields.push({
      name: '**Categories**',
      value: categories.join(', '),
    });
  }

  if (content) {
    fields.push(...addMessageFields(content));
  }

  if (attachments) {
    fields.push(...addAttachmentFields(attachments));
  }

  return addEmbed(
    'Suspicious Word Detected',
    `:detective: [Message](${url}) sent by ${userMention} includes suspicious words in ${channelMention}`,
    undefined,
    fields,
    `Message ID: ${id}`,
    '#4798e0',
  );
}

/**
 * Create toggle perms embed.
 *
 * @param {string}  message - Embed message.
 * @param {boolean} success - Is toggle perms task completed.
 * @param {string}  userTag - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createTogglePermsEmbed(message: string, success: boolean, userTag: string): MessageEmbed {
  return addEmbed(
    'Toggle Permissions',
    message,
    undefined,
    undefined,
    `Initiated by @${userTag}`,
    (success) ? '#5fdc46' : '#de564f',
  );
}

/**
 * Create update message embed.
 *
 * @param {undefined|string}                         userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {Snowflake}                                id             - Message id.
 * @param {string}                                   oldContent     - Message content (old).
 * @param {string}                                   newContent     - Message content (new).
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createUpdateMessageEmbed(userMention: undefined | string, channelMention: string, id: Snowflake, oldContent: string, newContent: string, attachments: Collection<Snowflake, MessageAttachment>, url: string): MessageEmbed {
  const fields = [];

  if (oldContent) {
    fields.push(...addMessageFields(oldContent, 'Old message'));
  }

  if (newContent) {
    fields.push(...addMessageFields(newContent, 'New message'));
  }

  if (attachments) {
    fields.push(...addAttachmentFields(attachments));
  }

  return addEmbed(
    'Message Updated',
    `:pencil: [Message](${url}) sent by ${userMention} was updated in ${channelMention}`,
    undefined,
    fields,
    `Message ID: ${id}`,
    '#eea942',
  );
}

/**
 * Create voice tools embed.
 *
 * @param {VoiceRoute}  route   - Voice command route.
 * @param {string}      message - Embed message.
 * @param {EmbedStatus} status  - Status of voice command.
 * @param {string}      userTag - User tag of initiator.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createVoiceToolsEmbed(route: VoiceRoute, message: string, status: EmbedStatus, userTag: string): MessageEmbed {
  const generateTitle = (theRoute: VoiceRoute, theStatus: EmbedStatus): string => {
    const mode = `${theRoute}-${theStatus}`;

    switch (mode) {
      case 'disconnect-complete':
        return 'Disconnected';
      case 'unmute-complete':
        return 'Unmuted';
      case 'disconnect-fail':
        return 'Failed to Disconnect';
      case 'unmute-fail':
        return 'Failed to Unmute';
      case 'disconnect-in-progress':
        return 'Disconnecting';
      case 'unmute-in-progress':
        return 'Unmuting';
      default:
        return 'Unknown';
    }
  };
  const generateColor = (theStatus: EmbedStatus): ColorResolvable => {
    switch (theStatus) {
      case 'complete':
        return '#5fdc46';
      case 'fail':
        return '#de564f';
      case 'in-progress':
      default:
        return '#eea942';
    }
  };

  return addEmbed(
    generateTitle(route, status),
    message,
    undefined,
    undefined,
    `Initiated by @${userTag}`,
    generateColor(status),
  );
}

/**
 * Create upload attachment embed.
 *
 * @param {undefined|string}                         userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {Snowflake}                                id             - Message id.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 *
 * @returns {MessageEmbed}
 *
 * @since 1.0.0
 */
export function createUploadAttachmentEmbed(userMention: undefined | string, channelMention: string, id: Snowflake, attachments: Collection<Snowflake, MessageAttachment>, url: string): MessageEmbed {
  const fields = [];

  if (attachments) {
    fields.push(...addAttachmentFields(attachments, 'Original attachment'));
  }

  return addEmbed(
    'Attachment Uploaded',
    `:dividers: [Message](${url}) sent by ${userMention} includes attachments in ${channelMention}`,
    undefined,
    fields,
    `Message ID: ${id}`,
    '#4798e0',
  );
}
