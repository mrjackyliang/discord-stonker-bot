import chalk from 'chalk';
import { Message } from 'discord.js';
import _ from 'lodash';

import {
  generateLogMessage,
  getTextBasedChannel,
} from '../lib/utilities';
import {
  MessageCopiers,
  RegularExpressionReplacements,
  Replies,
} from '../types';

/**
 * Auto reply.
 *
 * @param {Message} message - Message object.
 * @param {Replies} replies - Auto reply rules from configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function autoReply(message: Message, replies: Replies): void {
  const messageContent = message.toString();

  if (!_.isArray(replies) || _.isEmpty(replies) || !_.every(replies, _.isPlainObject)) {
    return;
  }

  _.map(replies, (reply) => {
    const replyName = _.get(reply, 'name', 'Unknown');
    const replyChannelIds = _.get(reply, 'channel-ids');
    const replyReply = _.get(reply, 'reply');
    const replyRegexPattern = _.get(reply, 'regex.pattern');
    const replyRegexFlags = _.get(reply, 'regex.flags');
    const replyMessages = _.get(reply, 'messages');

    // If auto-reply is limited to specific channels or if reply messages are not defined correctly.
    if (
      (
        _.isArray(replyChannelIds)
        && !_.isEmpty(replyChannelIds)
        && _.every(replyChannelIds, (replyChannelId) => _.isString(replyChannelId) && !_.isEmpty(replyChannelId))
        && !_.includes(replyChannelIds, message.channel.id)
      ) || (
        !_.isArray(replyMessages)
        || _.isEmpty(replyMessages)
        || !_.every(replyMessages, (replyMessage) => _.isString(replyMessage) && !_.isEmpty(replyMessage))
      )
    ) {
      return;
    }

    try {
      if (new RegExp(replyRegexPattern, replyRegexFlags).test(messageContent)) {
        const content = {
          content: _.sample(replyMessages),
        };

        if (replyReply === true) {
          _.assign(content, {
            reply: {
              messageReference: message.id,
            },
          });
        }

        message.channel.send(content).then(() => {
          generateLogMessage(
            [
              'Sent auto-reply message for',
              chalk.green(replyName),
            ].join(' '),
            30,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send auto-reply message for',
            chalk.red(replyName),
          ].join(' '),
          10,
          error,
        ));
      }
    } catch (error) {
      generateLogMessage(
        [
          '"regex.pattern" or "regex.flags" for',
          chalk.red(replyName),
          'is invalid',
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Message copier.
 *
 * @param {Message}        message - Message object.
 * @param {MessageCopiers} copiers - Message copier rules from configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function messageCopier(message: Message, copiers: MessageCopiers): void {
  if (!message.guild) {
    return;
  }

  const { attachments, guild } = message;
  const messageContent = message.toString();
  const links: string[] = [];
  /**
   * Replace text.
   *
   * @param {string}                                  originalMessage - Original message.
   * @param {string}                                  name            - Message copier name.
   * @param {RegularExpressionReplacements|undefined} replacements    - Text replacements from configuration.
   *
   * @return {string}
   *
   * @since 1.0.0
   */
  const replaceText = (originalMessage: string, name: string, replacements: RegularExpressionReplacements | undefined): string => {
    let editedText = originalMessage;

    // Makes sure the "replace-text" configuration is correct.
    if (_.isArray(replacements) && _.every(replacements, (replacement) => _.isPlainObject(replacement))) {
      _.forEach(replacements, (replacement, key) => {
        const pattern = _.get(replacement, 'pattern');
        const flags = _.get(replacement, 'flags');
        const replaceWith = _.get(replacement, 'replace-with');

        try {
          editedText = editedText.replace(new RegExp(pattern, flags), replaceWith);
        } catch (error) {
          generateLogMessage(
            [
              `"replace-text[${key}]" for`,
              chalk.red(name),
              'is invalid',
            ].join(' '),
            10,
            error,
          );
        }
      });
    }

    return editedText.trim();
  };
  /**
   * Replace variables.
   *
   * @param {string|undefined}                        configFormat - Format from configuration.
   * @param {string}                                  name         - Message copier name.
   * @param {RegularExpressionReplacements|undefined} replacements - Text replacements from configuration.
   *
   * @return {string}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configFormat: string | undefined, name: string, replacements: RegularExpressionReplacements | undefined): string => {
    if (_.isString(configFormat) && !_.isEmpty(configFormat)) {
      return configFormat
        .replace(/%AUTHOR_MENTION%/g, message.author.toString())
        .replace(/%AUTHOR_TAG%/g, message.author.tag)
        .replace(/%MESSAGE_CONTENT%/g, replaceText(messageContent, name, replacements))
        .replace(/%MESSAGE_URL%/g, message.url);
    }

    return replaceText(messageContent, name, replacements);
  };

  if (!_.isArray(copiers) || _.isEmpty(copiers) || !_.every(copiers, _.isPlainObject)) {
    return;
  }

  _.map(copiers, (copier) => {
    const name = _.get(copier, 'name', 'Unknown');
    const channelId = _.get(copier, 'channel-id');
    const regexPattern = _.get(copier, 'regex.pattern');
    const regexFlags = _.get(copier, 'regex.flags');
    const replacements = _.get(copier, 'replacements');
    const format = _.get(copier, 'format');
    const includeAttachments = _.get(copier, 'include-attachments');
    const deleteMessage = _.get(copier, 'delete-message');
    const allowedUsers = _.get(copier, 'allowed-users');
    const allowedChannels = _.get(copier, 'allowed-channels');
    const disallowedUsers = _.get(copier, 'disallowed-users');
    const disallowedChannels = _.get(copier, 'disallowed-channels');

    // If message copier is limited to specific users or is limited to specific channels.
    if (
      (
        _.isArray(allowedUsers)
        && !_.isEmpty(allowedUsers)
        && _.every(allowedUsers, (allowedUser) => _.isString(allowedUser) && !_.isEmpty(allowedUser))
        && !_.includes(allowedUsers, message.author.id)
      ) || (
        _.isArray(allowedChannels)
        && !_.isEmpty(allowedChannels)
        && _.every(allowedChannels, (allowedChannel) => _.isString(allowedChannel) && !_.isEmpty(allowedChannel))
        && !_.includes(allowedChannels, message.channel.id)
      ) || (
        _.isArray(disallowedUsers)
        && !_.isEmpty(disallowedUsers)
        && _.every(disallowedUsers, (disallowedUser) => _.isString(disallowedUser) && !_.isEmpty(disallowedUser))
        && _.includes(disallowedUsers, message.author.id)
      ) || (
        _.isArray(disallowedChannels)
        && !_.isEmpty(disallowedChannels)
        && _.every(disallowedChannels, (disallowedChannel) => _.isString(disallowedChannel) && !_.isEmpty(disallowedChannel))
        && _.includes(disallowedChannels, message.channel.id)
      )
    ) {
      return;
    }

    const sendToChannel = getTextBasedChannel(guild, channelId);

    try {
      if (new RegExp(regexPattern, regexFlags).test(messageContent) && sendToChannel) {
        const content = {
          content: replaceVariables(format, name, replacements),
        };

        if (includeAttachments === true) {
          // Throw attachment urls into array first.
          _.forEach([...attachments.values()], (attachment) => {
            links.push(attachment.url);
          });

          // If there are attachments, add them into the content.
          if (_.size(links) > 0) {
            _.assign(content, {
              files: links,
            });
          }
        }

        if (deleteMessage === true) {
          message.delete().catch((error: Error) => generateLogMessage(
            'Failed to delete message',
            10,
            error,
          ));
        }

        sendToChannel.send(content).then(() => {
          generateLogMessage(
            [
              'Copied message for',
              chalk.green(name),
              'to',
              chalk.green(sendToChannel.toString()),
            ].join(' '),
            30,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to copy message for',
            chalk.red(name),
            'to',
            chalk.red(sendToChannel.toString()),
          ].join(' '),
          10,
          error,
        ));
      }
    } catch (error) {
      generateLogMessage(
        [
          '"regex.pattern" or "regex.flags" for',
          chalk.red(name),
          'is invalid',
        ].join(' '),
        10,
        error,
      );
    }
  });
}
