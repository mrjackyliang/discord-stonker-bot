const chalk = require('chalk');
const _ = require('lodash');

const { createIncludesLinkEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

const storedMessages = [];

/**
 * Includes link notification.
 *
 * @param {Message}     message       - Message object.
 * @param {TextChannel} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userIncludesLink(message, sendToChannel) {
  const theMessage = message.reactions.message.toString() || message.toString();

  // Store message so duplicates aren't sent.
  storedMessages.push({
    id: message.id,
    content: theMessage,
  });

  if (new RegExp(/https?:\/\//gi).test(theMessage) === true) {
    const filter = _.filter(storedMessages, { id: message.id });

    // If message is not a repeat. Happens when Discord creates embeds from auto-detected links.
    if (_.size(filter) === 1 || (_.size(filter) > 1 && !_.isEqual(filter[filter.length - 1], filter[filter.length - 2]))) {
      generateLogMessage(
        [
          'Message sent by',
          chalk.yellow(message.author.toString()),
          'in',
          chalk.yellow(message.channel.toString()),
          'includes links',
        ].join(' '),
        30,
      );

      await sendToChannel.send({
        embeds: [
          createIncludesLinkEmbed(
            message.author.toString(),
            message.channel.toString(),
            message.id,
            theMessage,
            message.attachments,
            message.url,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to send includes links embed',
        10,
        error,
      ));
    }
  }

  // Keep storage size below 100k messages.
  if (_.size(storedMessages) > 100000) {
    storedMessages.shift();
  }
}

module.exports = {
  userIncludesLink,
};
