import chalk from 'chalk';
import { Message, PartialMessage, TextBasedChannels } from 'discord.js';
import _ from 'lodash';

import { createUpdateMessageEmbed } from '../lib/embed';
import { generateLogMessage } from '../lib/utilities';

/**
 * Update message notification.
 *
 * @param {Message|PartialMessage}      message       - Message object.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function userUpdateMessage(message: Message | PartialMessage, sendToChannel: TextBasedChannels | undefined): Promise<void> {
  if (!message.author) {
    return;
  }

  const {
    attachments,
    author,
    channel,
    id,
    reactions,
    url,
  } = message;

  if (
    (!_.isEmpty(message.toString()) || !_.isEmpty(reactions.message.toString()) || !_.isEmpty(attachments))
    && (message.toString() !== reactions.message.toString())
  ) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(author.toString()),
        'in',
        chalk.yellow(channel.toString()),
        'was updated',
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      await sendToChannel.send({
        embeds: [
          createUpdateMessageEmbed(
            author.toString(),
            channel.toString(),
            id,
            message.toString(),
            reactions.message.toString(),
            attachments,
            url,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send update message embed',
        10,
        error,
      ));
    }
  }
}
