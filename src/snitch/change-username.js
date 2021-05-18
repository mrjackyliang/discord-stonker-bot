const chalk = require('chalk');

const { createChangeUsernameEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Change username notification.
 *
 * @param {module:"discord.js".User}                   oldUser       - User information (old).
 * @param {module:"discord.js".User}                   newUser       - User information (new).
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userChangeUsername(oldUser, newUser, sendToChannel) {
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

    await sendToChannel.send(createChangeUsernameEmbed(
      oldUser.tag,
      newUser.tag,
      newUser.toString(),
      newUser.displayAvatarURL({
        format: 'webp',
        dynamic: true,
        size: 4096,
      }),
    )).catch((error) => generateLogMessage(
      'Failed to send change username embed',
      10,
      error,
    ));
  }
}

module.exports = {
  userChangeUsername,
};
