const chalk = require('chalk');
const { DateTime } = require('luxon');
const _ = require('lodash');

const config = require('../../config.json');

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
  const timeZone = _.get(config, 'settings.time-zone', 'Etc/UTC');
  const currentTime = DateTime.now().setZone(timeZone).toFormat('yyyy-MM-dd HH:mm:ss ZZZZ');

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
 * Generate server failed message.
 *
 * @param {string} message - Message to log.
 *
 * @since 1.0.0
 */
function generateServerFailedMessage(message) {
  console.error([
    chalk.red('Server failed to start!'),
    message,
    '...',
  ].join(' '));
}

/**
 * Generates a readable time duration.
 *
 * @param {object} durationObject - Duration object from Luxon.
 *
 * @returns {string}
 *
 * @since 1.0.0
 */
function getReadableDuration(durationObject) {
  const intervals = [];

  if (_.get(durationObject, 'years', 0) > 0) {
    intervals.push(`${Math.round(durationObject.years)} year${(durationObject.years !== 1) ? 's' : ''}`);
  }

  if (_.get(durationObject, 'months', 0) > 0) {
    intervals.push(`${Math.round(durationObject.months)} month${(durationObject.months !== 1) ? 's' : ''}`);
  }

  if (_.get(durationObject, 'days', 0) > 0) {
    intervals.push(`${Math.round(durationObject.days)} day${(durationObject.days !== 1) ? 's' : ''}`);
  }

  if (_.get(durationObject, 'hours', 0) > 0) {
    intervals.push(`${Math.round(durationObject.hours)} hour${(durationObject.hours !== 1) ? 's' : ''}`);
  }

  if (_.get(durationObject, 'minutes', 0) > 0) {
    intervals.push(`${Math.round(durationObject.minutes)} minute${(durationObject.minutes !== 1) ? 's' : ''}`);
  }

  if (_.get(durationObject, 'seconds', 0) > 0) {
    intervals.push(`${Math.round(durationObject.seconds)} second${(durationObject.seconds !== 1) ? 's' : ''}`);
  }

  // Fallback in case others don't show.
  intervals.push(`${Math.round(durationObject.milliseconds)} millisecond${(durationObject.milliseconds !== 1) ? 's' : ''}`);

  return `${intervals[0] || ''}${(intervals[1]) ? ` and ${intervals[1]}` : ''}`;
}

/**
 * Get text-based channel.
 *
 * @param {module:"discord.js".Guild} guild     - Discord guild.
 * @param {string}                    channelId - The channel id.
 *
 * @returns {undefined|module:"discord.js".GuildChannel}
 *
 * @since 1.0.0
 */
function getTextBasedChannel(guild, channelId) {
  const guildChannels = _.get(guild, 'channels.cache');
  const textChannel = (!_.isUndefined(guildChannels)) ? guildChannels.get(channelId) : undefined;

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

    let currentChunk = chunks[_.size(chunks) - 1];

    // If a piece is simply too long, split it up harshly. Otherwise, split it nicely at space.
    // If max chars for this chunk, start a new chunk.
    if (_.size(piece) > maxSize) {
      const startingPieceIndex = maxSize - _.size((chunkSeparator + currentChunk));
      const leftover = piece.substring(startingPieceIndex);

      currentChunk += chunkSeparator + piece.substring(0, startingPieceIndex);
      theChunks[_.size(chunks) - 1] = currentChunk;

      for (let i = 0; i < _.size(leftover); i += maxSize) {
        theChunks.push(leftover.substring(i, i + maxSize));
      }
    } else if (_.size((currentChunk + chunkSeparator + piece)) <= maxSize) {
      currentChunk += chunkSeparator + piece;
      theChunks[_.size(theChunks) - 1] = currentChunk;
    } else {
      currentChunk = piece;
      theChunks.push('');
      theChunks[_.size(theChunks) - 1] = currentChunk;
    }

    return theChunks;
  }, ['']);
}

module.exports = {
  generateLogMessage,
  generateServerFailedMessage,
  getReadableDuration,
  getTextBasedChannel,
  splitStringChunks,
};
