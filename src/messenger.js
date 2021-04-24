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

  if (_.isEmpty(replies) || !_.isArray(replies) || !_.every(replies, _.isPlainObject)) {
    return;
  }

  _.map(replies, async (reply) => {
    const name = _.get(reply, 'name', 'Unknown');
    const channelId = _.get(reply, 'channel-id');
    const tagAuthor = _.get(reply, 'tag-author', false);
    const regexPattern = _.get(reply, 'regex.pattern', '(?:)');
    const regexFlags = _.get(reply, 'regex.flags', 'g');
    const messages = _.get(reply, 'messages', []);

    // If auto-reply is limited to a channel.
    if (channelId && channelId !== message.channel.id) {
      return;
    }

    try {
      if (new RegExp(regexPattern, regexFlags).test(messageContent)) {
        const userTag = (tagAuthor === true) ? `${message.author.toString()}, ` : '';
        const content = `${userTag}${_.sample(messages)}`;

        await message.channel.send(content).then(() => {
          generateLogMessage(
            [
              'Sent auto-reply message for',
              chalk.green(name),
            ].join(' '),
            40,
          );
        }).catch((error) => generateLogMessage(
          [
            'Failed to send auto-reply message for',
            chalk.red(name),
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
};
