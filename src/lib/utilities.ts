import chalk from 'chalk';
import {
  Guild,
  Message,
  NewsChannel,
  PartialMessage,
  Snowflake,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import _ from 'lodash';
import { DateTime, DurationObjectUnits } from 'luxon';

import config from '../../config.json';

import { LogMessagePriority, StoredMessages } from '../types';

let storedMessages: StoredMessages = [];

/**
 * Generate log message.
 *
 * @param {string}             message  - Message to log.
 * @param {LogMessagePriority} priority - Can be 10 (error), 20 (warn), 30 (info), or 40 (debug).
 * @param {unknown}            error    - The error object.
 *
 * @since 1.0.0
 */
export function generateLogMessage(message: string, priority: LogMessagePriority, error?: unknown): void {
  const logLevel = _.get(config, 'settings.log-level');
  const timeZone = _.get(config, 'settings.time-zone');
  const currentTime = DateTime.now().setZone(timeZone).toFormat('yyyy-MM-dd HH:mm:ss ZZZZ');

  if (logLevel >= priority) {
    // Messages will not be logged if priority is wrong.
    switch (priority) {
      case 10:
        console.error(`${currentTime} - ${chalk.red('ERROR')} - ${message} ...`);

        if (_.isError(error) && error.stack) {
          console.error(error.stack);
        }
        break;
      case 20:
        console.warn(`${currentTime} - ${chalk.yellow('WARN')} - ${message} ...`);

        if (_.isError(error) && error.stack) {
          console.warn(error.stack);
        }
        break;
      case 30:
        console.log(`${currentTime} - ${chalk.magenta('INFO')} - ${message} ...`);

        if (_.isError(error) && error.stack) {
          console.log(error.stack);
        }
        break;
      case 40:
        console.debug(`${currentTime} - ${chalk.gray('DEBUG')} - ${message} ...`);

        if (_.isError(error) && error.stack) {
          console.debug(error.stack);
        }
        break;
      default:
        break;
    }
  }
}

/**
 * Generate server message.
 *
 * @param {string}  message  - Message to log.
 * @param {boolean} failed   - If error related.
 * @param {number}  exitCode - Exit code.
 *
 * @since 1.0.0
 */
export function generateServerMessage(message: string, failed: boolean, exitCode?: number): void {
  const consoleMessage = [
    ...(failed) ? [chalk.red('Server failed to start!')] : [],
    message,
    '...',
  ].join(' ');

  if (failed) {
    console.error(consoleMessage);
  } else {
    console.log(consoleMessage);
  }

  // Kills the process with an exit code.
  if (_.isFinite(exitCode)) {
    process.exit(exitCode);
  }
}

/**
 * Generates a readable time duration.
 *
 * @param {DurationObjectUnits} duration - Duration object from Luxon.
 *
 * @returns {string}
 *
 * @since 1.0.0
 */
export function getReadableDuration(duration: DurationObjectUnits): string {
  const intervals = [];

  if (duration.years && duration.years > 0) {
    intervals.push(`${Math.round(duration.years)} year${(duration.years !== 1) ? 's' : ''}`);
  }

  if (duration.months && duration.months > 0) {
    intervals.push(`${Math.round(duration.months)} month${(duration.months !== 1) ? 's' : ''}`);
  }

  if (duration.days && duration.days > 0) {
    intervals.push(`${Math.round(duration.days)} day${(duration.days !== 1) ? 's' : ''}`);
  }

  if (duration.hours && duration.hours > 0) {
    intervals.push(`${Math.round(duration.hours)} hour${(duration.hours !== 1) ? 's' : ''}`);
  }

  if (duration.minutes && duration.minutes > 0) {
    intervals.push(`${Math.round(duration.minutes)} minute${(duration.minutes !== 1) ? 's' : ''}`);
  }

  if (duration.seconds && duration.seconds > 0) {
    intervals.push(`${Math.round(duration.seconds)} second${(duration.seconds !== 1) ? 's' : ''}`);
  }

  if (duration.milliseconds && duration.milliseconds > 0) {
    intervals.push(`${Math.round(duration.milliseconds)} millisecond${(duration.milliseconds !== 1) ? 's' : ''}`);
  }

  // Returns the duration if there is any.
  if (intervals[0]) {
    return `${intervals[0]}${(intervals[1]) ? ` and ${intervals[1]}` : ''}`;
  }

  return 'Unknown';
}

/**
 * Get text-based channel.
 *
 * @param {Guild|undefined}     guild     - Discord guild.
 * @param {Snowflake|undefined} channelId - The channel id.
 *
 * @returns {TextChannel|NewsChannel|ThreadChannel|undefined}
 *
 * @since 1.0.0
 */
export function getTextBasedChannel(guild: Guild | undefined, channelId: Snowflake | undefined): TextChannel | NewsChannel | ThreadChannel | undefined {
  if (!guild || !channelId) {
    return undefined;
  }

  const guildChannel = guild.channels.resolve(channelId);

  // If guild channel is text-based.
  if (guildChannel !== null && guildChannel.isText()) {
    return guildChannel;
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
export function splitStringChunks(string: string, maxSize: number): string[] {
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

/**
 * Track message.
 *
 * @param {Message} message - Message object.
 *
 * @returns {StoredMessages}
 *
 * @since 1.0.0
 */
export function trackMessage(message: Message | PartialMessage): StoredMessages {
  const {
    channelId,
    guildId,
    id,
    reactions,
  } = message;

  // Store message for reference later.
  storedMessages.push({
    id: `${guildId}/${channelId}/${id}`,
    content: reactions.message.toString() ?? message.toString(),
    timestamp: Date.now(),
  });

  // Only keep messages within the last 30 days.
  storedMessages = _.filter(storedMessages, (storedMessage) => {
    const messageTimestamp = storedMessage.timestamp;
    const thirtyDaysAgoTimestamp = Date.now() - 2592000000;

    return messageTimestamp > thirtyDaysAgoTimestamp;
  });

  // Return matched stored messages.
  return _.filter(storedMessages, { id: `${guildId}/${channelId}/${id}` });
}

/**
 * Track message is duplicate.
 *
 * @param {StoredMessages} matches - Matched stored messages.
 *
 * @returns {boolean}
 *
 * @since 1.0.0
 */
export function trackMessageIsDuplicate(matches: StoredMessages): boolean {
  const theMatches = _.map(matches, (match) => _.pick(match, ['id', 'content']));

  // If "last item" in array and "second to last item" in array are the same.
  return _.size(theMatches) > 1 && _.isEqual(theMatches[theMatches.length - 1], theMatches[theMatches.length - 2]);
}
