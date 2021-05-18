const _ = require('lodash');

const config = require('../../config.json');

const { generateLogMessage } = require('../lib/utilities');
const { userChangeNickname } = require('./change-nickname');
const { userChangeUsername } = require('./change-username');
const { userDeleteMessage } = require('./delete-message');
const { userUpdateMessage } = require('./update-message');
const { userUploadAttachment } = require('./upload-attachment');

/**
 * Snitch mode.
 *
 * @param {module:"discord.js".Client}                 client     - Discord client.
 * @param {module:"discord.js".Guild}                  guild      - Discord guild.
 * @param {module:"discord.js".TextBasedChannelFields} logChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function snitchMode(client, guild, logChannel) {
  /**
   * When user creates a message.
   *
   * @since 1.0.0
   */
  client.on('message', async (message) => {
    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.bot') === false // If message is not sent by a bot.
      && _.get(message, 'system') === false // If message is not sent by system.
    ) {
      /**
       * Upload attachment notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.upload-attachment') === true) {
        await userUploadAttachment(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userUploadAttachment" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user updates a message.
   *
   * @since 1.0.0
   */
  client.on('messageUpdate', async (message) => {
    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.bot') === false // If message is not sent by a bot.
      && _.get(message, 'system') === false // If message is not sent by system.
    ) {
      /**
       * Update message notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.update-message') === true) {
        await userUpdateMessage(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userUpdateMessage" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user deletes a message.
   *
   * @since 1.0.0
   */
  client.on('messageDelete', async (message) => {
    if (
      guild.available === true // If guild is online.
      && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
      && _.get(message, 'author.id') !== _.get(client, 'user.id') // If message was not sent by Stonker Bot.
    ) {
      /**
       * Delete message notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.delete-message') === true) {
        await userDeleteMessage(message, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userDeleteMessage" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user deletes bulk messages.
   *
   * @since 1.0.0
   */
  client.on('messageDeleteBulk', async (messages) => {
    _.forEach(messages.array(), async (message) => {
      if (
        guild.available === true // If guild is online.
        && _.get(message, 'guild.id') === guild.id // If message was sent in the guild.
        && _.get(message, 'author.id') !== _.get(client, 'user.id') // If message was not sent by Stonker Bot.
      ) {
        /**
         * Delete message notification.
         *
         * @since 1.0.0
         */
        if (_.get(config, 'notifications.delete-bulk-messages') === true) {
          await userDeleteMessage(message, logChannel).catch((error) => generateLogMessage(
            'Failed to execute "userDeleteMessage" function',
            10,
            error,
          ));
        }
      }
    });
  });

  /**
   * When guild member is updated.
   *
   * @since 1.0.0
   */
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (
      _.get(oldMember, 'guild.id') === guild.id // If old member is in the guild.
      && _.get(newMember, 'guild.id') === guild.id // If new member is in the guild.
    ) {
      /**
       * Change nickname notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.change-nickname') === true) {
        await userChangeNickname(oldMember, newMember, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userChangeNickname" function',
          10,
          error,
        ));
      }
    }
  });

  /**
   * When user is updated.
   *
   * @since 1.0.0
   */
  client.on('userUpdate', async (oldUser, newUser) => {
    if (
      guild.members.cache.has(oldUser.id) === true // If old user is in the guild.
      && guild.members.cache.has(newUser.id) === true // If new user is in the guild.
    ) {
      /**
       * Change username notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.change-username') === true) {
        await userChangeUsername(oldUser, newUser, logChannel).catch((error) => generateLogMessage(
          'Failed to execute "userChangeUsername" function',
          10,
          error,
        ));
      }
    }
  });
}

module.exports = {
  snitchMode,
};
