import chalk from 'chalk';
import { GuildMember, PartialGuildMember, TextBasedChannels } from 'discord.js';

import { createChangeNicknameEmbed } from '../lib/embed';
import { generateLogMessage } from '../lib/utilities';

/**
 * Change nickname notification.
 *
 * @param {GuildMember|PartialGuildMember} oldMember     - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember     - Member information (new).
 * @param {TextBasedChannels|undefined}    sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function userChangeNickname(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, sendToChannel: TextBasedChannels | undefined): Promise<void> {
  if (!oldMember.user || !newMember.user) {
    return;
  }

  if (oldMember.nickname !== newMember.nickname) {
    generateLogMessage(
      [
        'Nickname for',
        chalk.blue(newMember.toString()),
        'was changed from',
        chalk.blue(oldMember.nickname),
        'to',
        chalk.blue(newMember.nickname),
      ].join(' '),
      30,
    );

    if (sendToChannel) {
      await sendToChannel.send({
        embeds: [
          createChangeNicknameEmbed(
            oldMember.nickname,
            newMember.nickname,
            newMember.toString(),
            newMember.user.displayAvatarURL({
              format: 'webp',
              dynamic: true,
              size: 4096,
            }),
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to send change nickname embed',
        10,
        error,
      ));
    }
  }
}
