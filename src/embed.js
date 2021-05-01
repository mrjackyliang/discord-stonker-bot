const Discord = require('discord.js');
const _ = require('lodash');

const { splitStringChunks } = require('./utilities');

/**
 * Add embed.
 *
 * @param {string}      title        - Embed title.
 * @param {string}      description  - Embed description.
 * @param {null|string} thumbnailUrl - Embed thumbnail url.
 * @param {any}         fields       - Embed fields.
 * @param {string}      footer       - Embed footer message.
 * @param {string}      color        - Embed hex color.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function addEmbed(title, description, thumbnailUrl = null, fields = undefined, footer, color = '#808080') {
  if (fields !== undefined) {
    return new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setThumbnail(thumbnailUrl)
      .addFields(fields)
      .setTimestamp()
      .setFooter(footer);
  }

  return new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setThumbnail(thumbnailUrl)
    .setTimestamp()
    .setFooter(footer);
}

/**
 * Add message fields.
 *
 * @param {string} message    - Message content.
 * @param {string} fieldTitle - Field title.
 *
 * @returns {object[]}
 *
 * @since 1.0.0
 */
function addMessageFields(message, fieldTitle = 'Message') {
  const theMessages = splitStringChunks(message, 1020);
  const fields = [];

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
 *
 * @returns {object[]}
 *
 * @since 1.0.0
 */
function addAttachmentFields(attachments) {
  const theAttachments = [];
  const fields = [];

  _.forEach(attachments.array(), (attachment) => {
    theAttachments.push(`[Original link](${attachment.url}) (or [alternative link](${attachment.proxyURL}))`);
  });

  _.forEach(theAttachments, (theAttachment, key) => {
    fields.push({
      name: `**Attachment ${key + 1}**`,
      value: theAttachment,
    });
  });

  return fields;
}

/**
 * Create add role embed.
 *
 * @param {string}                          message - Embed message.
 * @param {"complete"|"fail"|"in-progress"} status  - Status of add role command.
 * @param {string}                          userTag - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createAddRoleEmbed(message, status, userTag) {
  let title;
  let color;

  switch (status) {
    case 'complete':
      title = 'Roles Added';
      color = '#5fdc46';
      break;
    case 'fail':
      title = 'Failed to Add Roles';
      color = '#de564f';
      break;
    case 'in-progress':
    default:
      title = 'Adding Roles';
      color = '#eea942';
      break;
  }

  return addEmbed(
    title,
    message,
    null,
    undefined,
    `Initiated by @${userTag}`,
    color,
  );
}

/**
 * Create change nickname embed.
 *
 * @param {null|string} oldNickname - Old nickname.
 * @param {null|string} newNickname - New nickname.
 * @param {string}      userMention - User mention.
 * @param {string}      avatarUrl   - Avatar url.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createChangeNicknameEmbed(oldNickname, newNickname, userMention, avatarUrl) {
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
    `User ID: ${(_.isString(userMention)) ? userMention.replace(/[<@!>]/g, '') : userMention}`,
    '#4798e0',
  );
}

/**
 * Create change username embed.
 *
 * @param {string} oldTag      - Old tag.
 * @param {string} newTag      - New tag.
 * @param {string} userMention - User mention.
 * @param {string} avatarUrl   - Avatar url.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createChangeUsernameEmbed(oldTag, newTag, userMention, avatarUrl) {
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
    `User ID: ${(_.isString(userMention)) ? userMention.replace(/[<@!>]/g, '') : userMention}`,
    '#4798e0',
  );
}

/**
 * Create command error embed.
 *
 * @param {string} reason  - The reason of the command error.
 * @param {string} userTag - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createCommandErrorEmbed(reason, userTag) {
  return addEmbed(
    'Error',
    reason,
    null,
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
 * @param {string}                                   id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createDeleteMessageEmbed(userMention, channelMention, id, content, attachments, url) {
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
    null,
    fields,
    `Message ID: ${id}`,
    '#de564f',
  );
}

/**
 * Create help menu embed.
 *
 * @param {object[]} commands - Array of commands.
 * @param {string}   userTag  - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createHelpMenuEmbed(commands, userTag) {
  const fields = [];

  _.forEach(commands, (command) => {
    const allQueries = _.map(command.queries, (query) => `\`${query}\`\r\n`);

    fields.push(`${allQueries.join('')}${command.description}`);
  });

  return addEmbed(
    'Command Help Menu',
    fields.join('\r\n\r\n'),
    null,
    undefined,
    `Initiated by @${userTag}`,
  );
}

/**
 * Create list members embed.
 *
 * @param {string}      title     - The embed title.
 * @param {string[]}    mentions  - List of member mentions.
 * @param {null|string} thumbnail - The thumbnail url.
 * @param {string}      userTag   - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createListMembersEmbed(title, mentions, thumbnail = null, userTag) {
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
 * Create no results embed.
 *
 * @param {string} message - The reason of no results.
 * @param {string} userTag - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createNoResultsEmbed(message, userTag) {
  return addEmbed(
    'No Results',
    message,
    null,
    undefined,
    `Initiated by @${userTag}`,
  );
}

/**
 * Create remove affiliate links embed.
 *
 * @param {string}                                   userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {string}                                   id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 * @param {string[]}                                 websites       - Websites match.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createRemoveAffiliateLinksEmbed(userMention, channelMention, id, content, attachments, url, websites) {
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
    null,
    fields,
    `Message ID: ${id}`,
    '#eea942',
  );
}

/**
 * Create suspicious words embed.
 *
 * @param {string}                                   userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {string}                                   id             - Message id.
 * @param {string}                                   content        - Message content.
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 * @param {string[]}                                 categories     - Categories match.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createSuspiciousWordsEmbed(userMention, channelMention, id, content, attachments, url, categories) {
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
    null,
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
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createTogglePermsEmbed(message, success, userTag) {
  return addEmbed(
    'Toggle Permissions',
    message,
    null,
    undefined,
    `Initiated by @${userTag}`,
    (success) ? '#5fdc46' : '#de564f',
  );
}

/**
 * Create update message embed.
 *
 * @param {string}                                   userMention    - User mention.
 * @param {string}                                   channelMention - Channel mention.
 * @param {string}                                   id             - Message id.
 * @param {string}                                   oldContent     - Message content (old).
 * @param {string}                                   newContent     - Message content (new).
 * @param {Collection<Snowflake, MessageAttachment>} attachments    - Message attachments.
 * @param {string}                                   url            - Message url.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createUpdateMessageEmbed(userMention, channelMention, id, oldContent, newContent, attachments, url) {
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
    null,
    fields,
    `Message ID: ${id}`,
    '#eea942',
  );
}

/**
 * Create voice embed.
 *
 * @param {"disconnect"|"unmute"}           route   - Voice command route.
 * @param {string}                          message - Embed message.
 * @param {"complete"|"fail"|"in-progress"} status  - Status of voice command.
 * @param {string}                          userTag - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createVoiceEmbed(route, message, status, userTag) {
  let titleDisconnect;
  let titleUnmute;
  let title;
  let color;

  switch (status) {
    case 'complete':
      titleDisconnect = (route === 'disconnect') ? 'Disconnected' : undefined;
      titleUnmute = (route === 'unmute') ? 'Unmuted' : undefined;
      title = titleDisconnect || titleUnmute;
      color = '#5fdc46';
      break;
    case 'fail':
      titleDisconnect = (route === 'disconnect') ? 'Failed to Disconnect' : undefined;
      titleUnmute = (route === 'unmute') ? 'Failed to Unmute' : undefined;
      title = titleDisconnect || titleUnmute;
      color = '#de564f';
      break;
    case 'in-progress':
    default:
      titleDisconnect = (route === 'disconnect') ? 'Disconnecting' : undefined;
      titleUnmute = (route === 'unmute') ? 'Unmuting' : undefined;
      title = titleDisconnect || titleUnmute;
      color = '#eea942';
      break;
  }

  return addEmbed(
    title,
    message,
    null,
    undefined,
    `Initiated by @${userTag}`,
    color,
  );
}

/**
 * Create whitelist embed.
 *
 * @param {string} potentialUserId - Potential user id.
 * @param {string} userTag         - User tag of initiator.
 *
 * @returns {module:"discord.js".MessageEmbed}
 *
 * @since 1.0.0
 */
function createWhitelistEmbed(potentialUserId, userTag) {
  return addEmbed(
    'Whitelisted',
    `<@!${potentialUserId}> has been temporarily added into the anti-raid whitelist.`,
    null,
    undefined,
    `Initiated by @${userTag}`,
    '#5fdc46',
  );
}

module.exports = {
  createAddRoleEmbed,
  createChangeNicknameEmbed,
  createChangeUsernameEmbed,
  createCommandErrorEmbed,
  createDeleteMessageEmbed,
  createHelpMenuEmbed,
  createListMembersEmbed,
  createNoResultsEmbed,
  createRemoveAffiliateLinksEmbed,
  createSuspiciousWordsEmbed,
  createTogglePermsEmbed,
  createUpdateMessageEmbed,
  createVoiceEmbed,
  createWhitelistEmbed,
};
