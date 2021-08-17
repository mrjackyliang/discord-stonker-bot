import { Client, Guild, TextBasedChannels } from 'discord.js';
import _ from 'lodash';

import config from '../../config.json';

import { generateLogMessage } from '../lib/utilities';
import userChangeNickname from './change-nickname';
import userChangeUsername from './change-username';
import userDeleteMessage from './delete-message';
import userIncludesLink from './includes-link';
import userUpdateMessage from './update-message';
import userUploadAttachment from './upload-attachment';

/**
 * Snitch mode.
 *
 * @param {Client}                      client     - Discord client.
 * @param {Guild}                       guild      - Discord guild.
 * @param {TextBasedChannels|undefined} logChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function snitchMode(client: Client, guild: Guild, logChannel: TextBasedChannels | undefined): Promise<void> {
  /**
   * When user creates a message.
   *
   * @since 1.0.0
   */
  client.on('messageCreate', async (message) => {
    if (
      message.guild
      && guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && !message.author.bot // If message is not sent by a bot.
      && !message.system // If message is not sent by system.
    ) {
      /**
       * Includes link notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.includes-link') === true) {
        await userIncludesLink(message, logChannel).catch((error: Error) => generateLogMessage(
          'Failed to execute "userIncludesLink" function',
          10,
          error,
        ));
      }

      /**
       * Upload attachment notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.upload-attachment') === true) {
        await userUploadAttachment(message, logChannel).catch((error: Error) => generateLogMessage(
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
      message.guild
      && message.author
      && guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && !message.author.bot // If message is not sent by a bot.
      && !message.system // If message is not sent by system.
    ) {
      /**
       * Update message notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.update-message') === true) {
        await userUpdateMessage(message, logChannel).catch((error: Error) => generateLogMessage(
          'Failed to execute "userUpdateMessage" function',
          10,
          error,
        ));
      }

      /**
       * Includes link notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.includes-link') === true) {
        await userIncludesLink(message, logChannel).catch((error: Error) => generateLogMessage(
          'Failed to execute "userIncludesLink" function',
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
      message.guild
      && message.author
      && client.user
      && guild.available // If guild is online.
      && message.guild.id === guild.id // If message was sent in the guild.
      && message.author.id !== client.user.id // If message was not sent by Stonker Bot.
    ) {
      /**
       * Delete message notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.delete-message') === true) {
        await userDeleteMessage(message, logChannel).catch((error: Error) => generateLogMessage(
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
    if (_.get(config, 'notifications.delete-bulk-messages') === true) {
      _.forEach([...messages.values()], async (message) => {
        if (
          message.guild
          && message.author
          && client.user
          && guild.available // If guild is online.
          && message.guild.id === guild.id // If message was sent in the guild.
          && message.author.id !== client.user.id // If message was not sent by Stonker Bot.
        ) {
          /**
           * Delete message notification.
           *
           * @since 1.0.0
           */
          await userDeleteMessage(message, logChannel).catch((error: Error) => generateLogMessage(
            'Failed to execute "userDeleteMessage" function',
            10,
            error,
          ));
        }
      });
    }
  });

  /**
   * When guild member is updated.
   *
   * @since 1.0.0
   */
  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (
      oldMember.guild.id === guild.id // If old member is in the guild.
      && newMember.guild.id === guild.id // If new member is in the guild.
    ) {
      /**
       * Change nickname notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.change-nickname') === true) {
        await userChangeNickname(oldMember, newMember, logChannel).catch((error: Error) => generateLogMessage(
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
      guild.available // If guild is online.
      && guild.members.cache.has(oldUser.id) // If old user is in the guild.
      && guild.members.cache.has(newUser.id) // If new user is in the guild.
    ) {
      /**
       * Change username notification.
       *
       * @since 1.0.0
       */
      if (_.get(config, 'notifications.change-username') === true) {
        await userChangeUsername(oldUser, newUser, logChannel).catch((error: Error) => generateLogMessage(
          'Failed to execute "userChangeUsername" function',
          10,
          error,
        ));
      }
    }
  });
}
