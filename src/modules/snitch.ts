import chalk from 'chalk';
import {
  Guild,
  GuildMember,
  Message,
  PartialGuildMember,
  PartialMessage,
  PartialUser,
  User,
} from 'discord.js';
import _ from 'lodash';

import { generateLogMessage, getTextBasedChannel } from '../lib/utilities';
import {
  createChangeNicknameEmbed,
  createChangeUsernameEmbed,
  createDeleteMessageEmbed,
  createIncludesLinkEmbed,
  createUpdateMessageEmbed,
  createUploadAttachmentEmbed,
} from '../lib/embed';
import { Snitch, StoredMessages } from '../types';

const storedMessages: StoredMessages = [];

/**
 * User change nickname.
 *
 * @param {GuildMember|PartialGuildMember} oldMember - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember - Member information (new).
 * @param {Snitch}                         settings  - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userChangeNickname(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, settings: Snitch): void {
  if (!oldMember.user || !newMember.user) {
    return;
  }

  if (oldMember.nickname !== newMember.nickname) {
    const guild = newMember.guild ?? oldMember.guild;
    const channelId = _.get(settings, 'channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    generateLogMessage(
      [
        'Nickname for',
        chalk.blue(newMember.toString()),
        'was changed from',
        chalk.blue(oldMember.nickname),
        'to',
        chalk.blue(newMember.nickname),
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      sendToChannel.send({
        embeds: [
          createChangeNicknameEmbed(
            oldMember.nickname,
            newMember.nickname,
            newMember.toString(),
            newMember.user.displayAvatarURL({
              format: 'webp',
              dynamic: true,
              size: 4096,
            }),
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send change nickname embed',
        10,
        error,
      ));
    }
  }
}

/**
 * User change username.
 *
 * @param {Guild}            guild    - Discord guild.
 * @param {User|PartialUser} oldUser  - User information (old).
 * @param {User|PartialUser} newUser  - User information (new).
 * @param {Snitch}           settings - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userChangeUsername(guild: Guild, oldUser: User | PartialUser, newUser: User | PartialUser, settings: Snitch): void {
  if (oldUser.tag !== newUser.tag) {
    const channelId = _.get(settings, 'channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    generateLogMessage(
      [
        'Username for',
        chalk.blue(newUser.toString()),
        'was changed from',
        chalk.blue(`@${oldUser.tag}`),
        'to',
        chalk.blue(`@${newUser.tag}`),
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      sendToChannel.send({
        embeds: [
          createChangeUsernameEmbed(
            oldUser.tag,
            newUser.tag,
            newUser.toString(),
            newUser.displayAvatarURL({
              format: 'webp',
              dynamic: true,
              size: 4096,
            }),
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send change username embed',
        10,
        error,
      ));
    }
  }
}

/**
 * User delete message.
 *
 * @param {Message|PartialMessage} message  - Message object.
 * @param {Snitch}                 settings - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userDeleteMessage(message: Message | PartialMessage, settings: Snitch): void {
  if (!message.author || !message.guild) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    guild,
    id,
    url,
  } = message;

  if (!_.isEmpty(message.toString()) || !_.isEmpty(attachments)) {
    const channelId = _.get(settings, 'channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    generateLogMessage(
      [
        'Message sent by',
        chalk.red(author.toString()),
        'in',
        chalk.red(channel.toString()),
        'was deleted',
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      sendToChannel.send({
        embeds: [
          createDeleteMessageEmbed(
            author.toString(),
            channel.toString(),
            id,
            message.toString(),
            attachments,
            url,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send delete message embed',
        10,
        error,
      ));
    }
  }
}

/**
 * User includes link.
 *
 * @param {Message|PartialMessage} message  - Message object.
 * @param {Snitch}                 settings - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userIncludesLink(message: Message | PartialMessage, settings: Snitch): void {
  if (!message.author || !message.guild) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    guild,
    id,
    reactions,
    url,
  } = message;
  const theMessage = reactions.message.toString() ?? message.toString();

  // Store message so duplicates aren't sent.
  storedMessages.push({
    id,
    content: theMessage,
  });

  if (new RegExp(/https?:\/\//gi).test(theMessage)) {
    const filter = _.filter(storedMessages, { id });

    // If message is not a repeat. Happens when Discord creates embeds from auto-detected links.
    if (_.size(filter) === 1 || (_.size(filter) > 1 && !_.isEqual(filter[filter.length - 1], filter[filter.length - 2]))) {
      const channelId = _.get(settings, 'channel-id');
      const sendToChannel = getTextBasedChannel(guild, channelId);

      generateLogMessage(
        [
          'Message sent by',
          chalk.yellow(author.toString()),
          'in',
          chalk.yellow(channel.toString()),
          'includes links',
        ].join(' '),
        30,
      );

      if (sendToChannel) {
        sendToChannel.send({
          embeds: [
            createIncludesLinkEmbed(
              author.toString(),
              channel.toString(),
              id,
              theMessage,
              attachments,
              url,
            ),
          ],
        }).catch((error: Error) => generateLogMessage(
          'Failed to send includes links embed',
          10,
          error,
        ));
      }
    }
  }

  // Keep storage size below 100k messages.
  if (_.size(storedMessages) > 100000) {
    storedMessages.shift();
  }
}

/**
 * User update message.
 *
 * @param {Message|PartialMessage} message  - Message object.
 * @param {Snitch}                 settings - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userUpdateMessage(message: Message | PartialMessage, settings: Snitch): void {
  if (!message.author || !message.guild) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    guild,
    id,
    reactions,
    url,
  } = message;

  if (
    (!_.isEmpty(message.toString()) || !_.isEmpty(reactions.message.toString()) || !_.isEmpty(attachments))
    && (message.toString() !== reactions.message.toString())
  ) {
    const channelId = _.get(settings, 'channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(author.toString()),
        'in',
        chalk.yellow(channel.toString()),
        'was updated',
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      sendToChannel.send({
        embeds: [
          createUpdateMessageEmbed(
            author.toString(),
            channel.toString(),
            id,
            message.toString(),
            reactions.message.toString(),
            attachments,
            url,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send update message embed',
        10,
        error,
      ));
    }
  }
}

/**
 * User upload attachment.
 *
 * @param {Message|PartialMessage} message  - Message object.
 * @param {Snitch}                 settings - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userUploadAttachment(message: Message | PartialMessage, settings: Snitch): void {
  if (!message.author || !message.guild) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    guild,
    id,
    url,
  } = message;
  const links: string[] = [];

  // Throw attachment urls into array first.
  _.forEach([...attachments.values()], (attachment) => {
    links.push(attachment.url);
  });

  if (_.size(links) > 0) {
    const channelId = _.get(settings, 'channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(author.toString()),
        'in',
        chalk.yellow(channel.toString()),
        'includes attachments',
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      sendToChannel.send({
        files: links,
        embeds: [
          createUploadAttachmentEmbed(
            author.toString(),
            channel.toString(),
            id,
            attachments,
            url,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send upload attachment embed',
        10,
        error,
      ));
    }
  }
}
