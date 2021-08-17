import chalk from 'chalk';
import { Message, PartialMessage, TextBasedChannels } from 'discord.js';
import _ from 'lodash';

import { createUploadAttachmentEmbed } from '../lib/embed';
import { generateLogMessage } from '../lib/utilities';

/**
 * Upload attachment notification.
 *
 * @param {Message|PartialMessage}      message       - Message object.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function userUploadAttachment(message: Message | PartialMessage, sendToChannel: TextBasedChannels | undefined): Promise<void> {
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
  const links: string[] = [];

  // Throw attachment urls into array first.
  _.forEach([...attachments.values()], (attachment) => {
    links.push(attachment.url);
  });

  if (_.size(links) > 0) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(author.toString()),
        'in',
        chalk.yellow(channel.toString()),
        'includes attachments',
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      await sendToChannel.send({
        files: links,
        embeds: [
          createUploadAttachmentEmbed(
            author.toString(),
            channel.toString(),
            id,
            attachments,
            url,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send upload attachment embed',
        10,
        error,
      ));
    }
  }
}
