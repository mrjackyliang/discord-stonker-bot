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
import { Snitch } from '../types';

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
    const channelId = _.get(settings, 'channel.channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      generateLogMessage(
        [
          'Nickname changed',
          `(function: userChangeNickname, member: ${newMember.toString()}, old nickname: ${oldMember.nickname}, new nickname: ${newMember.nickname})`,
        ].join(' '),
        30,
      );

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
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to send embed',
          `(function: userChangeNickname, channel: ${sendToChannel.toString()})`,
        ].join(' '),
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
 * @param {User}             newUser  - User information (new).
 * @param {Snitch}           settings - Channel configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function userChangeUsername(guild: Guild, oldUser: User | PartialUser, newUser: User, settings: Snitch): void {
  if (oldUser.tag !== newUser.tag) {
    const channelId = _.get(settings, 'channel.channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      generateLogMessage(
        [
          'Username changed',
          `(function: userChangeUsername, user: ${newUser.toString()}, old tag: @${oldUser.tag}, new tag: @${newUser.tag})`,
        ].join(' '),
        30,
      );

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
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to send embed',
          `(function: userChangeUsername, channel: ${sendToChannel.toString()})`,
        ].join(' '),
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
    const channelId = _.get(settings, 'channel.channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      generateLogMessage(
        [
          'Message deleted',
          `(function: userDeleteMessage, author: ${author.toString()}, message id: ${id})`,
        ].join(' '),
        30,
      );

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
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to send embed',
          `(function: userDeleteMessage, channel: ${sendToChannel.toString()})`,
        ].join(' '),
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

  if (new RegExp(/https?:\/\//gi).test(theMessage)) {
    const channelId = _.get(settings, 'channel.channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      generateLogMessage(
        [
          'Message includes link',
          `(function: userIncludesLink, author: ${author.toString()}, message id: ${id})`,
        ].join(' '),
        30,
      );

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
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to send embed',
          `(function: userIncludesLink, channel: ${sendToChannel.toString()})`,
        ].join(' '),
        10,
        error,
      ));
    }
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
    const channelId = _.get(settings, 'channel.channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      generateLogMessage(
        [
          'Message updated',
          `(function: userUpdateMessage, author: ${author.toString()}, message id: ${id})`,
        ].join(' '),
        30,
      );

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
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to send embed',
          `(function: userUpdateMessage, channel: ${sendToChannel.toString()})`,
        ].join(' '),
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
    const channelId = _.get(settings, 'channel.channel-id');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      generateLogMessage(
        [
          'Message includes attachments',
          `(function: userUploadAttachment, author: ${author.toString()}, message id: ${id})`,
        ].join(' '),
        30,
      );

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
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to send embed',
          `(function: userUploadAttachment, channel: ${sendToChannel.toString()})`,
        ].join(' '),
        10,
        error,
      ));
    }
  }
}
