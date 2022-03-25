import {
  Guild,
  GuildMember,
  Message,
  MessageOptions,
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
import { Snitch, SnitchChangeName, SnitchIncludesLink } from '../types';

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
export function userChangeNickname(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, settings: SnitchChangeName): void {
  if (!oldMember.user || !newMember.user) {
    return;
  }

  if (oldMember.nickname !== newMember.nickname) {
    const guild = newMember.guild ?? oldMember.guild;
    const channelId = _.get(settings, 'channel.channel-id');
    const detectors = _.get(settings, 'detectors');
    const message = _.get(settings, 'message', '');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      const payload: MessageOptions = {
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
      };

      generateLogMessage(
        [
          'Nickname changed',
          `(function: userChangeNickname, member: ${newMember.toString()}, old nickname: ${oldMember.nickname}, new nickname: ${newMember.nickname})`,
        ].join(' '),
        30,
      );

      // Add message if new nickname matches regex and is not "null".
      if (_.isArray(detectors) && !_.isEmpty(detectors) && _.every(detectors, (detector) => _.isPlainObject(detector)) && newMember.nickname !== null) {
        const users: string[] = [];

        _.forEach(detectors, (detector, key) => {
          const regexPattern = _.get(detector, 'regex.pattern');
          const regexFlags = _.get(detector, 'regex.flags');
          const userId = _.get(detector, 'user.user-id');

          try {
            if (new RegExp(regexPattern, regexFlags).test(<string>newMember.nickname) && userId) {
              users.push(`<@!${userId}>`);
            }
          } catch (error) {
            generateLogMessage(
              [
                `"detectors[${key}].regex" regular expression is invalid`,
                `(function: userChangeNickname, pattern: ${regexPattern}, flags: ${regexFlags})`,
              ].join(' '),
              10,
              error,
            );
          }
        });

        // Add message on embed if nicknames were matched.
        if (_.size(users) > 0) {
          const additionalPayload = {
            content: `${users.join(', ')}${(message.startsWith('<@&')) ? ', ' : ' '}${message}`,
          };

          _.assign(payload, additionalPayload);
        }
      }

      sendToChannel.send(payload).catch((error: any) => generateLogMessage(
        [
          'Failed to send message',
          `(function: userChangeNickname, channel: ${sendToChannel.toString()}, payload: ${JSON.stringify(payload)})`,
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
export function userChangeUsername(guild: Guild, oldUser: User | PartialUser, newUser: User, settings: SnitchChangeName): void {
  if (oldUser.tag !== newUser.tag) {
    const channelId = _.get(settings, 'channel.channel-id');
    const detectors = _.get(settings, 'detectors');
    const message = _.get(settings, 'message', '');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      const payload: MessageOptions = {
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
      };

      generateLogMessage(
        [
          'Username changed',
          `(function: userChangeUsername, user: ${newUser.toString()}, old tag: @${oldUser.tag}, new tag: @${newUser.tag})`,
        ].join(' '),
        30,
      );

      // Add message if new tag matches regex.
      if (_.isArray(detectors) && !_.isEmpty(detectors) && _.every(detectors, (detector) => _.isPlainObject(detector))) {
        const users: string[] = [];

        _.forEach(detectors, (detector, key) => {
          const regexPattern = _.get(detector, 'regex.pattern');
          const regexFlags = _.get(detector, 'regex.flags');
          const userId = _.get(detector, 'user.user-id');

          try {
            if (new RegExp(regexPattern, regexFlags).test(newUser.tag) && userId) {
              users.push(`<@!${userId}>`);
            }
          } catch (error) {
            generateLogMessage(
              [
                `"detectors[${key}].regex" regular expression is invalid`,
                `(function: userChangeUsername, pattern: ${regexPattern}, flags: ${regexFlags})`,
              ].join(' '),
              10,
              error,
            );
          }
        });

        // Add message on embed if tags were matched.
        if (_.size(users) > 0) {
          const additionalPayload = {
            content: `${users.join(', ')}${(message.startsWith('<@&')) ? ', ' : ' '}${message}`,
          };

          _.assign(payload, additionalPayload);
        }
      }

      sendToChannel.send(payload).catch((error: any) => generateLogMessage(
        [
          'Failed to send message',
          `(function: userChangeUsername, channel: ${sendToChannel.toString()}, payload: ${JSON.stringify(payload)}))`,
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
export function userIncludesLink(message: Message | PartialMessage, settings: SnitchIncludesLink): void {
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
    const excludeLinks = _.get(settings, 'exclude-links');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (sendToChannel) {
      // Skip if excluded link matches regex.
      if (_.isArray(excludeLinks) && !_.isEmpty(excludeLinks) && _.every(excludeLinks, (excludeLink) => _.isPlainObject(excludeLink))) {
        let matches = 0;

        _.forEach(excludeLinks, (excludeLink) => {
          const regexPattern = _.get(excludeLink, 'regex.pattern');
          const regexFlags = _.get(excludeLink, 'regex.flags');

          try {
            if (new RegExp(regexPattern, regexFlags).test(theMessage)) {
              matches += 1;
            }
          } catch (error) {
            generateLogMessage(
              [
                '"regex.pattern" or "regex.flags" is invalid',
                `(function: userIncludesLink, pattern: ${regexPattern}, flags: ${regexFlags})`,
              ].join(' '),
              10,
              error,
            );
          }
        });

        // Skip sending embed if excluded link matches regex.
        if (matches > 0) {
          generateLogMessage(
            [
              'Message includes excluded link',
              `(function: userIncludesLink, author: ${author.toString()}, message id: ${id})`,
            ].join(' '),
            40,
          );

          return;
        }
      }

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
