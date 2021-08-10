const chalk = require('chalk');
const _ = require('lodash');

const {
  generateLogMessage,
  getTextBasedChannel,
} = require('../lib/utilities');

/**
 * Auto reply.
 *
 * @param {Message}  message - Message object.
 * @param {object[]} replies - Auto reply rules from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function autoReply(message, replies) {
  const messageContent = message.toString();

  if (!_.isArray(replies) || _.isEmpty(replies) || !_.every(replies, _.isPlainObject)) {
    return;
  }

  _.map(replies, async (reply) => {
    const replyName = _.get(reply, 'name', 'Unknown');
    const replyChannelIds = _.get(reply, 'channel-ids');
    const replyReply = _.get(reply, 'reply');
    const replyRegexPattern = _.get(reply, 'regex.pattern');
    const replyRegexFlags = _.get(reply, 'regex.flags');
    const replyMessages = _.get(reply, 'messages');

    // If auto-reply is limited to specific channels or if messages are not defined.
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

        await message.channel.send(content).then(() => {
          generateLogMessage(
            [
              'Sent auto-reply message for',
              chalk.green(replyName),
            ].join(' '),
            30,
          );
        }).catch((error) => generateLogMessage(
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
 * @param {Message}  message - Message object.
 * @param {object[]} copiers - Message copier rules from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function messageCopier(message, copiers) {
  const messageContent = message.toString();
  const replaceText = (rawText, name, replacements) => {
    let editedText = rawText;

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
  const replaceVariables = (rawText, name, replacements) => {
    if (_.isString(rawText) && !_.isEmpty(rawText)) {
      return rawText
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

  _.map(copiers, async (copier) => {
    const name = _.get(copier, 'name', 'Unknown');
    const channelId = _.get(copier, 'channel-id');
    const regexPattern = _.get(copier, 'regex.pattern');
    const regexFlags = _.get(copier, 'regex.flags');
    const replacements = _.get(copier, 'replacements');
    const format = _.get(copier, 'format');
    const allowedUsers = _.get(copier, 'allowed-users');
    const allowedChannels = _.get(copier, 'allowed-channels');

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
      )
    ) {
      return;
    }

    const channel = getTextBasedChannel(message.guild, channelId);

    try {
      if (new RegExp(regexPattern, regexFlags).test(messageContent) && !_.isUndefined(channel)) {
        await channel.send({
          content: replaceVariables(format, name, replacements),
        }).then(() => {
          generateLogMessage(
            [
              'Copied message for',
              chalk.green(name),
              'to',
              chalk.green(channel.toString()),
            ].join(' '),
            30,
          );
        }).catch((error) => generateLogMessage(
          [
            'Failed to copy message for',
            chalk.red(name),
            'to',
            chalk.red(channel.toString()),
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

module.exports = {
  autoReply,
  messageCopier,
};
