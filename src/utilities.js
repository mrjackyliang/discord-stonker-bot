const axios = require('axios').default;
const chalk = require('chalk');
const { DateTime } = require('luxon');
const _ = require('lodash');

const config = require('../config.json');

/**
 * Generate log message.
 *
 * @param {any}              message  - Message to log.
 * @param {number}           priority - Can be 10 (error), 20 (warn), 30 (info), or 40 (debug).
 * @param {undefined|Error}  error    - The error object.
 *
 * @since 1.0.0
 */
function generateLogMessage(message, priority, error = undefined) {
  const logLevel = _.get(config, 'settings.log-level', 30);
  const currentTime = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss ZZZZ');

  if (logLevel >= priority) {
    // Messages will not be logged if priority is wrong.
    switch (priority) {
      case 10:
        console.error(`${currentTime} - ${chalk.red('ERROR')} - ${message} ...`);
        break;
      case 20:
        console.warn(`${currentTime} - ${chalk.yellow('WARN')} - ${message} ...`);
        break;
      case 30:
        console.log(`${currentTime} - ${chalk.magenta('INFO')} - ${message} ...`);
        break;
      case 40:
        console.debug(`${currentTime} - ${chalk.gray('DEBUG')} - ${message} ...`);
        break;
      default:
        break;
    }

    // Logs the error stack if available.
    if (_.isError(error) && _.has(error, 'stack')) {
      console.log(error.stack);
    }
  }
}

/**
 * Get Google Cloud Storage objects.
 *
 * @param {module:"discord.js".Message} message - Discord message object.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function getGoogleCloudStorageObjects(message) {
  const { attachments } = message;
  const links = [];

  // Throw attachment urls into array first.
  _.forEach(attachments.array(), (attachment) => {
    links.push(attachment.url);
    links.push(attachment.proxyURL);
  });

  if (links.length) {
    _.forEach(links, (attachmentsLink) => {
      axios.get(attachmentsLink).then((response) => {
        const responseStatusText = response.statusText;
        const responseConfigUrl = response.config.url;

        if (responseStatusText !== 'OK') {
          throw response;
        }

        generateLogMessage(
          `Successfully cached attachment (${responseConfigUrl})`,
          40,
        );
      }).catch((error) => generateLogMessage(
        'Failed to cache attachment',
        10,
        error,
      ));
    });
  }
}

/**
 * Get text-based channel.
 *
 * @param {module:"discord.js".Client} client    - Discord client.
 * @param {string}                     channelId - The channel id.
 *
 * @returns {undefined|module:"discord.js".Channel}
 *
 * @since 1.0.0
 */
function getTextBasedChannel(client, channelId) {
  const textChannel = client.channels.cache.get(channelId);

  // If channel is a text-based channel.
  if (textChannel !== undefined && textChannel.isText()) {
    return textChannel;
  }

  return undefined;
}

/**
 * Split string into chunks.
 *
 * @param {string} string  - Original string.
 * @param {number} maxSize - Maximum characters allowed per string.
 *
 * @returns {string[]}
 *
 * @since 1.0.0
 */
function splitStringChunks(string, maxSize) {
  const spacePieces = string.split(' ');

  return spacePieces.reduce((chunks, piece, index) => {
    const theChunks = chunks;
    const isFirstPiece = index === 0;
    const chunkSeparator = isFirstPiece ? '' : ' ';

    let currentChunk = chunks[chunks.length - 1];

    // If a piece is simply too long, split it up harshly. Otherwise, split it nicely at space.
    // If max chars for this chunk, start a new chunk.
    if (piece.length > maxSize) {
      const startingPieceIndex = maxSize - (chunkSeparator + currentChunk).length;
      const leftover = piece.substring(startingPieceIndex);

      currentChunk += chunkSeparator + piece.substring(0, startingPieceIndex);
      theChunks[chunks.length - 1] = currentChunk;

      for (let i = 0; i < leftover.length; i += maxSize) {
        theChunks.push(leftover.substring(i, i + maxSize));
      }
    } else if ((currentChunk + chunkSeparator + piece).length <= maxSize) {
      currentChunk += chunkSeparator + piece;
      theChunks[theChunks.length - 1] = currentChunk;
    } else {
      currentChunk = piece;
      theChunks.push('');
      theChunks[theChunks.length - 1] = currentChunk;
    }

    return theChunks;
  }, ['']);
}

module.exports = {
  generateLogMessage,
  getGoogleCloudStorageObjects,
  getTextBasedChannel,
  splitStringChunks,
};
