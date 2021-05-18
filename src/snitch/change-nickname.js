const chalk = require('chalk');

const { createChangeNicknameEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Change nickname notification.
 *
 * @param {module:"discord.js".GuildMember}            oldMember     - Member information (old).
 * @param {module:"discord.js".GuildMember}            newMember     - Member information (new).
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userChangeNickname(oldMember, newMember, sendToChannel) {
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

    await sendToChannel.send(createChangeNicknameEmbed(
      oldMember.nickname,
      newMember.nickname,
      newMember.toString(),
      newMember.user.displayAvatarURL({
        format: 'webp',
        dynamic: true,
        size: 4096,
      }),
    )).catch((error) => generateLogMessage(
      'Failed to send change nickname embed',
      10,
      error,
    ));
  }
}

module.exports = {
  userChangeNickname,
};
