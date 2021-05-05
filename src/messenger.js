const chalk = require('chalk');
const _ = require('lodash');

const { generateLogMessage } = require('./utilities');

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
    const replyChannelId = _.get(reply, 'channel-id');
    const replyTagAuthor = _.get(reply, 'tag-author');
    const replyRegexPattern = _.get(reply, 'regex.pattern');
    const replyRegexFlags = _.get(reply, 'regex.flags');
    const replyMessages = _.get(reply, 'messages');

    // If auto-reply is limited to a channel or messages is not defined.
    if (
      (replyChannelId && replyChannelId !== message.channel.id)
      || (!_.isArray(replyMessages) || _.isEmpty(replyMessages) || !_.every(replyMessages, (replyMessage) => _.isString(replyMessage) && !_.isEmpty(replyMessage)))
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
            40,
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

module.exports = {
  autoReply,
};
