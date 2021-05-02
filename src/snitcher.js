const chalk = require('chalk');
const _ = require('lodash');

const {
  createChangeNicknameEmbed,
  createChangeUsernameEmbed,
  createDeleteMessageEmbed,
  createUpdateMessageEmbed,
  createUploadAttachmentEmbed,
} = require('./embed');
const { generateLogMessage } = require('./utilities');

/**
 * When user changes their nickname.
 *
 * @param {module:"discord.js".GuildMember} oldMember     - Member information (old).
 * @param {module:"discord.js".GuildMember} newMember     - Member information (new).
 * @param {TextBasedChannel}                sendToChannel - Send message to channel.
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
      40,
    );

    await sendToChannel.send(createChangeNicknameEmbed(
      oldMember.nickname,
      newMember.nickname,
      newMember.toString(),
      newMember.user.displayAvatarURL(),
    )).catch((error) => generateLogMessage(
      'Failed to send change nickname embed',
      10,
      error,
    ));
  }
}

/**
 * When user changes their username.
 *
 * @param {module:"discord.js".User} oldUser       - User information (old).
 * @param {module:"discord.js".User} newUser       - User information (new).
 * @param {TextBasedChannel}         sendToChannel - Send message to channel.
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
      40,
    );

    await sendToChannel.send(createChangeUsernameEmbed(
      oldUser.tag,
      newUser.tag,
      newUser.toString(),
      newUser.displayAvatarURL(),
    )).catch((error) => generateLogMessage(
      'Failed to send change username embed',
      10,
      error,
    ));
  }
}

/**
 * When user deletes the message.
 *
 * @param {module:"discord.js".Message} message       - Message object.
 * @param {TextBasedChannel}            sendToChannel - Send message to channel.
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
      40,
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

/**
 * When user updates the message.
 *
 * @param {module:"discord.js".Message} message       - Message object.
 * @param {TextBasedChannel}            sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function userUpdateMessage(message, sendToChannel) {
  if (
    (!_.isEmpty(message.toString()) || !_.isEmpty(message.reactions.message.toString()) || !_.isEmpty(message.attachments))
    && (message.toString() !== message.reactions.message.toString())
  ) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(message.author.toString()),
        'in',
        chalk.yellow(message.channel.toString()),
        'was updated',
      ].join(' '),
      40,
    );

    await sendToChannel.send(createUpdateMessageEmbed(
      message.author.toString(),
      message.channel.toString(),
      message.id,
      message.toString(),
      message.reactions.message.toString(),
      message.attachments,
      message.url,
    )).catch((error) => generateLogMessage(
      'Failed to send update message embed',
      10,
      error,
    ));
  }
}

/**
 * When user uploads attachments.
 *
 * @param {module:"discord.js".Message} message       - Message object.
 * @param {TextBasedChannel}            sendToChannel - Send message to channel.
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

  if (_.size(links)) {
    generateLogMessage(
      [
        'Message sent by',
        chalk.yellow(message.author.toString()),
        'in',
        chalk.yellow(message.channel.toString()),
        'includes attachments',
      ].join(' '),
      40,
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
  userChangeNickname,
  userChangeUsername,
  userDeleteMessage,
  userUpdateMessage,
  userUploadAttachment,
};
