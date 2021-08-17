import chalk from 'chalk';
import { Message, PartialMessage, TextBasedChannels } from 'discord.js';
import _ from 'lodash';

import { createIncludesLinkEmbed } from '../lib/embed';
import { generateLogMessage } from '../lib/utilities';
import { StoredMessages } from '../typings';

const storedMessages: StoredMessages = [];

/**
 * Includes link notification.
 *
 * @param {Message|PartialMessage}      message       - Message object.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function userIncludesLink(message: Message | PartialMessage, sendToChannel: TextBasedChannels | undefined): Promise<void> {
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
  const theMessage = reactions.message.toString() || message.toString();

  // Store message so duplicates aren't sent.
  storedMessages.push({
    id,
    content: theMessage,
  });

  if (new RegExp(/https?:\/\//gi).test(theMessage)) {
    const filter = _.filter(storedMessages, { id });

    // If message is not a repeat. Happens when Discord creates embeds from auto-detected links.
    if (_.size(filter) === 1 || (_.size(filter) > 1 && !_.isEqual(filter[filter.length - 1], filter[filter.length - 2]))) {
      generateLogMessage(
        [
          'Message sent by',
          chalk.yellow(author.toString()),
          'in',
          chalk.yellow(channel.toString()),
          'includes links',
        ].join(' '),
        30,
      );

      if (sendToChannel) {
        await sendToChannel.send({
          embeds: [
            createIncludesLinkEmbed(
              author.toString(),
              channel.toString(),
              id,
              theMessage,
              attachments,
              url,
            ),
          ],
        }).catch((error: Error) => generateLogMessage(
          'Failed to send includes links embed',
          10,
          error,
        ));
      }
    }
  }

  // Keep storage size below 100k messages.
  if (_.size(storedMessages) > 100000) {
    storedMessages.shift();
  }
}
