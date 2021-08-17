import chalk from 'chalk';
import { PartialUser, TextBasedChannels, User } from 'discord.js';

import { createChangeUsernameEmbed } from '../lib/embed';
import { generateLogMessage } from '../lib/utilities';

/**
 * Change username notification.
 *
 * @param {User|PartialUser}            oldUser       - User information (old).
 * @param {User|PartialUser}            newUser       - User information (new).
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function userChangeUsername(oldUser: User | PartialUser, newUser: User | PartialUser, sendToChannel: TextBasedChannels | undefined): Promise<void> {
  if (oldUser.tag !== newUser.tag) {
    generateLogMessage(
      [
        'Username for',
        chalk.blue(newUser.toString()),
        'was changed from',
        chalk.blue(`@${oldUser.tag}`),
        'to',
        chalk.blue(`@${newUser.tag}`),
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      await sendToChannel.send({
        embeds: [
          createChangeUsernameEmbed(
            oldUser.tag,
            newUser.tag,
            newUser.toString(),
            newUser.displayAvatarURL({
              format: 'webp',
              dynamic: true,
              size: 4096,
            }),
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send change username embed',
        10,
        error,
      ));
    }
  }
}
