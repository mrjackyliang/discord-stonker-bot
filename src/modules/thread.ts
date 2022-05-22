import _ from 'lodash';
import cron from 'node-cron';

import { generateLogMessage, getTextBasedNonThreadChannel } from '../lib/utility';
import {
  BumpThreadsEventChannelChannelId,
  BumpThreadsEventName,
  BumpThreadsEvents,
  BumpThreadsEventThreadThreadId,
  BumpThreadsGuild,
  BumpThreadsReturns,
} from '../types';

/**
 * Bump threads.
 *
 * @param {BumpThreadsGuild}  guild  - Guild.
 * @param {BumpThreadsEvents} events - Events.
 *
 * @returns {BumpThreadsReturns}
 *
 * @since 1.0.0
 */
export function bumpThreads(guild: BumpThreadsGuild, events: BumpThreadsEvents): BumpThreadsReturns {
  // If "bump-threads" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"bump-threads" is not configured',
        `(function: bumpThreads, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "bump-threads" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"bump-threads" is not configured properly',
        `(function: bumpThreads, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach(async (event, eventKey) => {
    const theName = <BumpThreadsEventName>_.get(event, ['name']) ?? 'Unknown';
    const theChannelChannelId = <BumpThreadsEventChannelChannelId>_.get(event, ['channel', 'channel-id']);
    const theThreadThreadId = <BumpThreadsEventThreadThreadId>_.get(event, ['thread', 'thread-id']);

    const channel = getTextBasedNonThreadChannel(guild, theChannelChannelId);

    // If "bump-threads[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"bump-threads[${eventKey}].name" is not configured properly`,
          `(function: bumpThreads, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "bump-threads[${eventKey}].channel.channel-id" is not configured properly.
    if (
      channel === undefined
      || channel === null
    ) {
      generateLogMessage(
        [
          `"bump-threads[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: bumpThreads, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "bump-threads[${eventKey}].thread.thread-id" is not configured properly.
    if (
      !_.isString(theThreadThreadId)
      || _.isEmpty(theThreadThreadId)
    ) {
      generateLogMessage(
        [
          `"bump-threads[${eventKey}].thread.thread-id" is not configured properly`,
          `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread id: ${JSON.stringify(theThreadThreadId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    try {
      const thread = await channel.threads.fetch(theThreadThreadId);

      generateLogMessage(
        [
          'Fetched thread',
          `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread: ${JSON.stringify(thread)})`,
        ].join(' '),
        40,
      );

      if (thread === null) {
        generateLogMessage(
          [
            'Failed to parse thread',
            `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread: ${JSON.stringify(thread)})`,
          ].join(' '),
          10,
        );

        return;
      }

      generateLogMessage(
        [
          'Parsed thread',
          `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread: ${JSON.stringify(thread)})`,
        ].join(' '),
        40,
      );

      cron.schedule('* * * * * *', () => {
        const threadArchived = thread.archived;

        if (threadArchived === true) {
          thread.setArchived(false).then(() => generateLogMessage(
            [
              'Un-archived thread',
              `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread: ${JSON.stringify(thread.toString())})`,
            ].join(' '),
            40,
          )).catch((error: Error) => generateLogMessage(
            [
              'Failed to un-archive thread',
              `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread: ${JSON.stringify(thread.toString())})`,
            ].join(' '),
            10,
            error,
          ));
        }
      }, {
        scheduled: true,
      });
    } catch (error) {
      generateLogMessage(
        [
          'Failed to fetch thread',
          `(function: bumpThreads, name: ${JSON.stringify(theName)}, thread id: ${JSON.stringify(theThreadThreadId)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}
