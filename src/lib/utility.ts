import chalk from 'chalk';
import { Permissions } from 'discord.js';
import _ from 'lodash';
import { DateTime, DurationUnits, Interval } from 'luxon';
import { serializeError } from 'serialize-error';

import config from '../../config.json';

import {
  FetchFormattedDateFormat,
  FetchFormattedDateFrom,
  FetchFormattedDateReturns,
  FetchFormattedDateTimeZone,
  FetchFormattedDateType,
  FetchFormattedDurationReturns,
  FetchFormattedDurationTimeBegin,
  GenerateCronReturns,
  GenerateCronRule,
  GenerateLogMessageErrorObject,
  GenerateLogMessageLogMessage,
  GenerateLogMessagePriority,
  GenerateLogMessageReturns,
  GenerateServerMessageErrorObject,
  GenerateServerMessageLogMessage,
  GenerateServerMessageReturns,
  GetCollectionItemsCollection,
  GetCollectionItemsReturns,
  GetTextBasedChannelGuild,
  GetTextBasedChannelId,
  GetTextBasedChannelReturns,
  GetTextBasedNonThreadChannelGuild,
  GetTextBasedNonThreadChannelId,
  GetTextBasedNonThreadChannelReturns,
  GetVoiceBasedChannelGuild,
  GetVoiceBasedChannelId,
  GetVoiceBasedChannelReturns,
  IsTimeZoneValidReturns,
  IsTimeZoneValidTimeZone,
  MemberHasPermissionsAllowedRoleRoleId,
  MemberHasPermissionsAllowedRoles,
  MemberHasPermissionsMember,
  MemberHasPermissionsReturns,
  SettingsLogLevel,
  SettingsTimeZone,
  SplitStringChunksMaxSize,
  SplitStringChunksOriginalString,
  SplitStringChunksReturns,
  TrackMessageIsDuplicateReturns,
  TrackMessageIsDuplicateTrackedMessages,
  TrackMessageMessage,
  TrackMessageReturns,
  TrackRouteIsTrackedReturns,
  TrackRouteIsTrackedServerMethod,
  TrackRouteIsTrackedServerPath,
  TrackRouteReturns,
  TrackRouteServerMethod,
  TrackRouteServerPath,
} from '../types';
import { MemoryTrackedMessages, MemoryTrackedRoutes } from '../types/memory';

/**
 * Config.
 *
 * @since 1.0.0
 */
const configSettingsLogLevel = <SettingsLogLevel>_.get(config, ['settings', 'log-level']);
const configSettingsTimeZone = <SettingsTimeZone>_.get(config, ['settings', 'time-zone']);

/**
 * Memory.
 *
 * @since 1.0.0
 */
let memoryTrackedMessages: MemoryTrackedMessages = [];
let memoryTrackedRoutes: MemoryTrackedRoutes = [];

/**
 * Fetch formatted date.
 *
 * @param {FetchFormattedDateType}     type     - Type.
 * @param {FetchFormattedDateFrom}     from     - From.
 * @param {FetchFormattedDateTimeZone} timeZone - Time zone.
 * @param {FetchFormattedDateFormat}   format   - Format.
 *
 * @returns {FetchFormattedDateReturns}
 *
 * @since 1.0.0
 */
export function fetchFormattedDate(type: FetchFormattedDateType, from: FetchFormattedDateFrom, timeZone: FetchFormattedDateTimeZone, format: FetchFormattedDateFormat): FetchFormattedDateReturns {
  let dateTime;

  if (
    type === 'date'
    && from instanceof Date
  ) {
    dateTime = DateTime.fromJSDate(from);
  } else if (
    type === 'iso'
    && _.isString(from)
    && !_.isEmpty(from)
  ) {
    dateTime = DateTime.fromISO(from);
  } else if (
    type === 'ts-millis'
    && _.isNumber(from)
    && _.isFinite(from)
  ) {
    dateTime = DateTime.fromMillis(from);
  } else if (
    type === 'ts-seconds'
    && _.isNumber(from)
    && _.isFinite(from)
  ) {
    dateTime = DateTime.fromSeconds(from);
  } else {
    dateTime = DateTime.now();
  }

  if (timeZone === 'config') {
    dateTime = dateTime.setZone(configSettingsTimeZone);
  } else if (_.isString(timeZone)) {
    dateTime = dateTime.setZone(timeZone);
  }

  if (format === 'iso') {
    dateTime = dateTime.toISO();
  } else if (format === 'iso-date') {
    dateTime = dateTime.toISODate();
  } else if (format === 'iso-time') {
    dateTime = dateTime.toISOTime();
  } else {
    dateTime = dateTime.toFormat(format);
  }

  return dateTime;
}

/**
 * Fetch formatted duration.
 *
 * @param {FetchFormattedDurationTimeBegin} timeBegin - Time begin.
 *
 * @returns {FetchFormattedDurationReturns}
 *
 * @since 1.0.0
 */
export function fetchFormattedDuration(timeBegin: FetchFormattedDurationTimeBegin): FetchFormattedDurationReturns {
  const timeEnd = DateTime.now();
  const interval = Interval.fromDateTimes(timeBegin, timeEnd);
  const durationUnits: DurationUnits = ['years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
  const duration = interval.toDuration(durationUnits);

  const intervals: string[] = [];

  if (duration.years > 0) {
    intervals.push(`${Math.floor(duration.years)} year${(Math.floor(duration.years) !== 1) ? 's' : ''}`);
  }

  if (duration.months > 0) {
    intervals.push(`${Math.floor(duration.months)} month${(Math.floor(duration.months) !== 1) ? 's' : ''}`);
  }

  if (duration.days > 0) {
    intervals.push(`${Math.floor(duration.days)} day${(Math.floor(duration.days) !== 1) ? 's' : ''}`);
  }

  if (duration.hours > 0) {
    intervals.push(`${Math.floor(duration.hours)} hour${(Math.floor(duration.hours) !== 1) ? 's' : ''}`);
  }

  if (duration.minutes > 0) {
    intervals.push(`${Math.floor(duration.minutes)} minute${(Math.floor(duration.minutes) !== 1) ? 's' : ''}`);
  }

  if (duration.seconds > 0) {
    intervals.push(`${Math.floor(duration.seconds)} second${(Math.floor(duration.seconds) !== 1) ? 's' : ''}`);
  }

  if (duration.milliseconds > 0) {
    intervals.push(`${Math.floor(duration.milliseconds)} millisecond${(duration.milliseconds !== 1) ? 's' : ''}`);
  }

  if (intervals.length > 0) {
    return [
      intervals[0],
      ...(intervals[1]) ? [`and ${intervals[1]}`] : [],
    ].join(' ');
  }

  return 'Unknown';
}

/**
 * Generate cron.
 *
 * @param {GenerateCronRule} rule - Rule.
 *
 * @returns {GenerateCronReturns}
 *
 * @since 1.0.0
 */
export function generateCron(rule: GenerateCronRule): GenerateCronReturns {
  const ruleDaysOfWeek = rule['days-of-week'];
  const ruleMonths = rule.months;
  const ruleDates = rule.dates;
  const ruleHours = rule.hours;
  const ruleMinutes = rule.minutes;
  const ruleSeconds = rule.seconds;

  const cron = [];

  // Second (0-59).
  if (
    _.isArray(ruleSeconds)
    && _.every(ruleSeconds, (ruleSecond) => _.isNumber(ruleSecond) && _.inRange(ruleSecond, 0, 60))
  ) {
    cron.push(ruleSeconds.join(','));
  } else {
    cron.push('*');
  }

  // Minute (0-59).
  if (
    _.isArray(ruleMinutes)
    && _.every(ruleMinutes, (ruleMinute) => _.isNumber(ruleMinute) && _.inRange(ruleMinute, 0, 60))
  ) {
    cron.push(ruleMinutes.join(','));
  } else {
    cron.push('*');
  }

  // Hour (0-23).
  if (
    _.isArray(ruleHours)
    && _.every(ruleHours, (ruleHour) => _.isNumber(ruleHour) && _.inRange(ruleHour, 0, 24))
  ) {
    cron.push(ruleHours.join(','));
  } else {
    cron.push('*');
  }

  // Dates (1-31).
  if (
    _.isArray(ruleDates)
    && _.every(ruleDates, (ruleDate) => _.isNumber(ruleDate) && _.inRange(ruleDate, 1, 32))
  ) {
    cron.push(ruleDates.join(','));
  } else {
    cron.push('*');
  }

  // Month (1-12).
  if (
    _.isArray(ruleMonths)
    && _.every(ruleMonths, (ruleMonth) => _.isNumber(ruleMonth) && _.inRange(ruleMonth, 1, 13))
  ) {
    cron.push(ruleMonths.join(','));
  } else {
    cron.push('*');
  }

  // Days of Week (0-6).
  if (
    _.isArray(ruleDaysOfWeek)
    && _.every(ruleDaysOfWeek, (ruleDayOfWeek) => _.isNumber(ruleDayOfWeek) && _.inRange(ruleDayOfWeek, 0, 7))
  ) {
    cron.push(ruleDaysOfWeek.join(','));
  } else {
    cron.push('*');
  }

  return cron.join(' ');
}

/**
 * Generate log message.
 *
 * @param {GenerateLogMessageLogMessage}  logMessage    - Log message.
 * @param {GenerateLogMessagePriority}    priority      - Priority.
 * @param {GenerateLogMessageErrorObject} [errorObject] - Error object.
 *
 * @returns {GenerateLogMessageReturns}
 *
 * @since 1.0.0
 */
export function generateLogMessage(logMessage: GenerateLogMessageLogMessage, priority: GenerateLogMessagePriority, errorObject?: GenerateLogMessageErrorObject): GenerateLogMessageReturns {
  const currentDateTime = fetchFormattedDate('now', undefined, 'config', 'yyyy-MM-dd HH:mm:ss ZZZZ');

  if (
    configSettingsLogLevel !== undefined
    && configSettingsLogLevel >= priority
  ) {
    switch (priority) {
      case 10:
        console.error(`${currentDateTime} - ${chalk.red('ERROR')} - ${logMessage} ...`);

        if (_.isError(errorObject)) {
          console.error(serializeError(errorObject));
        }
        break;
      case 20:
        console.warn(`${currentDateTime} - ${chalk.yellow('WARN')} - ${logMessage} ...`);

        if (_.isError(errorObject)) {
          console.warn(serializeError(errorObject));
        }
        break;
      case 30:
        console.log(`${currentDateTime} - ${chalk.magenta('INFO')} - ${logMessage} ...`);

        if (_.isError(errorObject)) {
          console.log(serializeError(errorObject));
        }
        break;
      case 40:
        console.debug(`${currentDateTime} - ${chalk.gray('DEBUG')} - ${logMessage} ...`);

        if (_.isError(errorObject)) {
          console.debug(serializeError(errorObject));
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
 * @param {GenerateServerMessageLogMessage}  logMessage    - Log message.
 * @param {GenerateServerMessageErrorObject} [errorObject] - Error object.
 *
 * @returns {GenerateServerMessageReturns}
 *
 * @since 1.0.0
 */
export function generateServerMessage(logMessage: GenerateServerMessageLogMessage, errorObject?: GenerateServerMessageErrorObject): GenerateServerMessageReturns {
  if (_.isError(errorObject)) {
    console.error(`${chalk.red('Server failed to start!')} ${logMessage} ...`);
    console.error(serializeError(errorObject));
  } else {
    console.log(`${logMessage} ...`);
  }
}

/**
 * Get collection items.
 *
 * @param {GetCollectionItemsCollection<Key,Value>} collection - Collection.
 *
 * @returns {GetCollectionItemsReturns<Value>}
 *
 * @since 1.0.0
 */
export function getCollectionItems<Key, Value>(collection: GetCollectionItemsCollection<Key, Value>): GetCollectionItemsReturns<Value> {
  return [...collection.values()];
}

/**
 * Get text-based channel.
 *
 * @param {GetTextBasedChannelGuild} guild - Guild.
 * @param {GetTextBasedChannelId}    id    - Id.
 *
 * @returns {GetTextBasedChannelReturns}
 *
 * @since 1.0.0
 */
export function getTextBasedChannel(guild: GetTextBasedChannelGuild, id: GetTextBasedChannelId): GetTextBasedChannelReturns {
  const guildChannels = guild.channels;

  if (id === undefined) {
    return undefined;
  }

  const textBasedChannel = guildChannels.resolve(id);

  if (
    textBasedChannel !== null
    && textBasedChannel.isText()
  ) {
    return textBasedChannel;
  }

  return null;
}

/**
 * Get text-based non-thread channel.
 *
 * @param {GetTextBasedNonThreadChannelGuild} guild - Guild.
 * @param {GetTextBasedNonThreadChannelId}    id    - Id.
 *
 * @returns {GetTextBasedNonThreadChannelReturns}
 *
 * @since 1.0.0
 */
export function getTextBasedNonThreadChannel(guild: GetTextBasedNonThreadChannelGuild, id: GetTextBasedNonThreadChannelId): GetTextBasedNonThreadChannelReturns {
  const guildChannels = guild.channels;

  if (id === undefined) {
    return undefined;
  }

  const textBasedNonThreadChannel = guildChannels.resolve(id);

  if (
    textBasedNonThreadChannel !== null
    && textBasedNonThreadChannel.isText()
    && !textBasedNonThreadChannel.isThread()
  ) {
    return textBasedNonThreadChannel;
  }

  return null;
}

/**
 * Get voice-based channel.
 *
 * @param {GetVoiceBasedChannelGuild} guild - Guild.
 * @param {GetVoiceBasedChannelId}    id    - Id.
 *
 * @returns {GetVoiceBasedChannelReturns}
 *
 * @since 1.0.0
 */
export function getVoiceBasedChannel(guild: GetVoiceBasedChannelGuild, id: GetVoiceBasedChannelId): GetVoiceBasedChannelReturns {
  const guildChannels = guild.channels;

  if (id === undefined) {
    return undefined;
  }

  const voiceBasedChannel = guildChannels.resolve(id);

  if (
    voiceBasedChannel !== null
    && voiceBasedChannel.isVoice()
  ) {
    return voiceBasedChannel;
  }

  return null;
}

/**
 * Is time zone valid.
 *
 * @param {IsTimeZoneValidTimeZone} timeZone - Time zone.
 *
 * @returns {IsTimeZoneValidReturns}
 *
 * @since 1.0.0
 */
export function isTimeZoneValid(timeZone: IsTimeZoneValidTimeZone): IsTimeZoneValidReturns {
  return DateTime.now().setZone(timeZone).isValid;
}

/**
 * Member has permissions.
 *
 * @param {MemberHasPermissionsMember}       member       - Member.
 * @param {MemberHasPermissionsAllowedRoles} allowedRoles - Allowed roles.
 *
 * @returns {MemberHasPermissionsReturns}
 *
 * @since 1.0.0
 */
export function memberHasPermissions(member: MemberHasPermissionsMember, allowedRoles: MemberHasPermissionsAllowedRoles): MemberHasPermissionsReturns {
  const memberPermissions = member.permissions;
  const memberRoles = member.roles;

  const allowedRolesIds = _.map(allowedRoles, (allowedRole) => <MemberHasPermissionsAllowedRoleRoleId>_.get(allowedRole, ['role-id']));
  const hasAllowedRoles = _.some(allowedRolesIds, (allowedRolesId) => allowedRolesId !== undefined && memberRoles.resolve(allowedRolesId) !== null);
  const hasAdministrator = memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR);

  return hasAllowedRoles || hasAdministrator;
}

/**
 * Split string chunks.
 *
 * Original code derived from: https://jsfiddle.net/MadLittleMods/n0n2euwc/.
 *
 * @param {SplitStringChunksOriginalString} originalString - Original string.
 * @param {SplitStringChunksMaxSize}        maxSize        - Max size.
 *
 * @returns {SplitStringChunksReturns}
 *
 * @since 1.0.0
 */
export function splitStringChunks(originalString: SplitStringChunksOriginalString, maxSize: SplitStringChunksMaxSize): SplitStringChunksReturns {
  const spacePieces = originalString.split(' ');

  return spacePieces.reduce((chunks, piece, index) => {
    const isFirstPiece = index === 0;
    const chunkSeparator = isFirstPiece ? '' : ' ';
    const newChunks = chunks;

    let currentChunk = chunks[chunks.length - 1];

    /**
     * If a piece is simply too long, split it up harshly. Otherwise, split it nicely at space.
     * If max chars for this chunk, start a new chunk.
     *
     * @since 1.0.0
     */
    if (piece.length > maxSize) {
      const startingPieceIndex = maxSize - (chunkSeparator + currentChunk).length;
      const leftover = piece.substring(startingPieceIndex);

      currentChunk += chunkSeparator + piece.substring(0, startingPieceIndex);
      newChunks[chunks.length - 1] = currentChunk;

      for (let i = 0; i < leftover.length; i += maxSize) {
        newChunks.push(leftover.substring(i, i + maxSize));
      }
    } else if ((currentChunk + chunkSeparator + piece).length <= maxSize) {
      currentChunk += chunkSeparator + piece;
      newChunks[newChunks.length - 1] = currentChunk;
    } else {
      currentChunk = piece;
      newChunks.push('');
      newChunks[newChunks.length - 1] = currentChunk;
    }

    return newChunks;
  }, ['']);
}

/**
 * Track message.
 *
 * @param {TrackMessageMessage} message - Message.
 *
 * @returns {TrackMessageReturns}
 *
 * @since 1.0.0
 */
export function trackMessage(message: TrackMessageMessage): TrackMessageReturns {
  const messageContent = message.reactions.message.content ?? message.content;
  const messageUrl = message.url;

  memoryTrackedMessages.push({
    url: messageUrl,
    content: messageContent,
    timestamp: Date.now(),
  });

  // Only keep messages within the last 30 days.
  memoryTrackedMessages = _.filter(memoryTrackedMessages, (memoryTrackedMessage) => {
    const memoryTrackedMessageTimestamp = memoryTrackedMessage.timestamp;
    const thirtyDaysAgoTimestamp = Date.now() - 2592000000; // 30 days in milliseconds.

    return memoryTrackedMessageTimestamp > thirtyDaysAgoTimestamp;
  });

  return _.filter(memoryTrackedMessages, { url: messageUrl });
}

/**
 * Track message is duplicate.
 *
 * @param {TrackMessageIsDuplicateTrackedMessages} trackedMessages - Tracked messages.
 *
 * @returns {TrackMessageIsDuplicateReturns}
 *
 * @since 1.0.0
 */
export function trackMessageIsDuplicate(trackedMessages: TrackMessageIsDuplicateTrackedMessages): TrackMessageIsDuplicateReturns {
  const matches = _.map(trackedMessages, (trackedMessage) => _.pick(trackedMessage, ['url', 'content']));

  // When "last item" in array and "second to last item" in array are the same.
  return matches.length > 1 && _.isEqual(matches[matches.length - 1], matches[matches.length - 2]);
}

/**
 * Track route.
 *
 * @param {TrackRouteServerPath}   serverPath   - Server path.
 * @param {TrackRouteServerMethod} serverMethod - Server method.
 *
 * @returns {TrackRouteReturns}
 *
 * @since 1.0.0
 */
export function trackRoute(serverPath: TrackRouteServerPath, serverMethod: TrackRouteServerMethod): TrackRouteReturns {
  memoryTrackedRoutes.push({
    path: serverPath,
    method: serverMethod,
  });

  // Clean up duplicated objects.
  memoryTrackedRoutes = _.uniqWith(memoryTrackedRoutes, _.isEqual);

  return memoryTrackedRoutes;
}

/**
 * Track route is tracked.
 *
 * @param {TrackRouteIsTrackedServerPath}   serverPath   - Server path.
 * @param {TrackRouteIsTrackedServerMethod} serverMethod - Server method.
 *
 * @returns {TrackRouteIsTrackedReturns}
 *
 * @since 1.0.0
 */
export function trackRouteIsTracked(serverPath: TrackRouteIsTrackedServerPath, serverMethod: TrackRouteIsTrackedServerMethod): TrackRouteIsTrackedReturns {
  return _.some(memoryTrackedRoutes, {
    path: serverPath,
    method: serverMethod,
  });
}
