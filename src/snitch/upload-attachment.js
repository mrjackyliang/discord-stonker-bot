const chalk = require('chalk');
const _ = require('lodash');

const { createUploadAttachmentEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Upload attachment notification.
 *
 * @param {module:"discord.js".Message}                message       - Message object.
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userUploadAttachment(message, sendToChannel) {
  const links = [];

  // Throw attachment urls into array first.
  _.forEach(message.attachments.array(), (attachment) => {
    links.push(attachment.url);
  });

  if (_.size(links) > 0) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(message.author.toString()),
        'in',
        chalk.yellow(message.channel.toString()),
        'includes attachments',
      ].join(' '),
      30,
    );

    await sendToChannel.send({
      files: links,
      embed: createUploadAttachmentEmbed(
        message.author.toString(),
        message.channel.toString(),
        message.id,
        message.attachments,
        message.url,
      ),
    });
  }
}

module.exports = {
  userUploadAttachment,
};
