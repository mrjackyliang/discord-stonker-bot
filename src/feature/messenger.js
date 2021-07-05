const chalk = require('chalk');
const _ = require('lodash');

const {
  generateLogMessage,
  getTextBasedChannel,
} = require('../lib/utilities');

/**
 * Auto reply.
 *
 * @param {module:"discord.js".Message} message - Message object.
 * @param {object[]}                    replies - Auto reply rules from configuration.
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
    const replyTagAuthor = _.get(reply, 'tag-author');
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
      )
      || (
        !_.isArray(replyMessages)
        || _.isEmpty(replyMessages)
        || !_.every(replyMessages, (replyMessage) => _.isString(replyMessage) && !_.isEmpty(replyMessage))
      )
    ) {
      return;
    }

    try {
      if (new RegExp(replyRegexPattern, replyRegexFlags).test(messageContent)) {
        const userTag = (replyTagAuthor === true) ? `${message.author.toString()}, ` : '';
        const content = `${userTag}${_.sample(replyMessages)}`;

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
 * @param {module:"discord.js".Message} message - Message object.
 * @param {object[]}                    copiers - Message copier rules from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function messageCopier(message, copiers) {
  const messageContent = message.toString();
  const replaceVariables = (rawMessage) => {
    if (_.isString(rawMessage) && !_.isEmpty(rawMessage)) {
      return rawMessage
        .replace(/%AUTHOR_MENTION%/g, message.author.toString())
        .replace(/%AUTHOR_TAG%/g, message.author.tag);
    }

    return '';
  };

  if (!_.isArray(copiers) || _.isEmpty(copiers) || !_.every(copiers, _.isPlainObject)) {
    return;
  }

  _.map(copiers, async (copier) => {
    const name = _.get(copier, 'name', 'Unknown');
    const channelId = _.get(copier, 'channel-id');
    const regexPattern = _.get(copier, 'regex.pattern');
    const regexFlags = _.get(copier, 'regex.flags');
    const removeMentions = _.get(copier, 'remove-mentions');
    const prefix = _.get(copier, 'prefix', '');
    const suffix = _.get(copier, 'suffix', '');
    const allowedUsers = _.get(copier, 'allowed-users');

    // If message copier is limited to specific users.
    if (
      _.isArray(allowedUsers)
      && !_.isEmpty(allowedUsers)
      && _.every(allowedUsers, (replyChannelId) => _.isString(replyChannelId) && !_.isEmpty(replyChannelId))
      && !_.includes(allowedUsers, message.author.id)
    ) {
      return;
    }

    /**
     * @type {undefined|TextBasedChannel}
     */
    const channel = getTextBasedChannel(message.guild, channelId);

    try {
      if (new RegExp(regexPattern, regexFlags).test(messageContent) && !_.isUndefined(channel)) {
        await channel.send([
          replaceVariables(prefix),
          (removeMentions === true) ? _.replace(messageContent, /<@.?[0-9]*?>/g, '') : messageContent,
          replaceVariables(suffix),
        ].join('')).then(() => {
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
