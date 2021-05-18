const chalk = require('chalk');
const _ = require('lodash');

const { createDeleteMessageEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Delete message notification.
 *
 * @param {module:"discord.js".Message}                message       - Message object.
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userDeleteMessage(message, sendToChannel) {
  if (!_.isEmpty(message.toString()) || !_.isEmpty(message.attachments)) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.red(message.author.toString()),
        'in',
        chalk.red(message.channel.toString()),
        'was deleted',
      ].join(' '),
      30,
    );

    await sendToChannel.send(createDeleteMessageEmbed(
      message.author.toString(),
      message.channel.toString(),
      message.id,
      message.toString(),
      message.attachments,
      message.url,
    )).catch((error) => generateLogMessage(
      'Failed to send delete message embed',
      10,
      error,
    ));
  }
}

module.exports = {
  userDeleteMessage,
};
