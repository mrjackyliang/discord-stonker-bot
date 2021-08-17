import chalk from 'chalk';
import { Message, PartialMessage, TextBasedChannels } from 'discord.js';
import _ from 'lodash';

const { createDeleteMessageEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Delete message notification.
 *
 * @param {Message|PartialMessage}      message       - Message object.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function userDeleteMessage(message: Message | PartialMessage, sendToChannel: TextBasedChannels | undefined): Promise<void> {
  if (!message.author) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    id,
    url,
  } = message;

  if (!_.isEmpty(message.toString()) || !_.isEmpty(attachments)) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.red(author.toString()),
        'in',
        chalk.red(channel.toString()),
        'was deleted',
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      await sendToChannel.send({
        embeds: [
          createDeleteMessageEmbed(
            author.toString(),
            channel.toString(),
            id,
            message.toString(),
            attachments,
            url,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send delete message embed',
        10,
        error,
      ));
    }
  }
}
