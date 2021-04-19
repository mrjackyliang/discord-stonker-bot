const chalk = require('chalk');
const _ = require('lodash');

const { generateLogMessage } = require('./utilities');

/**
 * Auto responder.
 *
 * @param {module:"discord.js".Message} message     - Message object.
 * @param {object[]}                    autoReplies - Auto reply rules from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function autoResponder(message, autoReplies) {
  const messageContent = message.toString();

  if (_.isEmpty(autoReplies) || !_.isArray(autoReplies) || !_.every(autoReplies, _.isPlainObject)) {
    return;
  }

  autoReplies.map(async (autoReply) => {
    const name = _.get(autoReply, 'name', 'Unknown');
    const channelId = _.get(autoReply, 'channel-id');
    const tagAuthor = _.get(autoReply, 'tag-author', false);
    const regexPattern = _.get(autoReply, 'regex.pattern', '(?:)');
    const regexFlags = _.get(autoReply, 'regex.flags', 'g');
    const messages = _.get(autoReply, 'messages', []);

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
  autoResponder,
};
