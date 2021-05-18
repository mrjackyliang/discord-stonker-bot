const chalk = require('chalk');
const _ = require('lodash');

const { createUpdateMessageEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Update message notification.
 *
 * @param {module:"discord.js".Message}                message       - Message object.
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userUpdateMessage(message, sendToChannel) {
  if (
    (!_.isEmpty(message.toString()) || !_.isEmpty(message.reactions.message.toString()) || !_.isEmpty(message.attachments))
    && (message.toString() !== message.reactions.message.toString())
  ) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(message.author.toString()),
        'in',
        chalk.yellow(message.channel.toString()),
        'was updated',
      ].join(' '),
      30,
    );

    await sendToChannel.send(createUpdateMessageEmbed(
      message.author.toString(),
      message.channel.toString(),
      message.id,
      message.toString(),
      message.reactions.message.toString(),
      message.attachments,
      message.url,
    )).catch((error) => generateLogMessage(
      'Failed to send update message embed',
      10,
      error,
    ));
  }
}

module.exports = {
  userUpdateMessage,
};
