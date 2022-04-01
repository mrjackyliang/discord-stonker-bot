import { TextBasedChannel } from 'discord.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import RssParser from 'rss-parser';

import { generateLogMessage } from '../lib/utilities';
import {
  ReoccurringSchedule,
  RssFeed,
  SchedulePost,
} from '../types';

/**
 * Create re-occurring schedule.
 *
 * @param {ReoccurringSchedule|undefined} sendEvery - Reoccurring schedule.
 *
 * @returns {RecurrenceRule}
 *
 * @since 1.0.0
 */
function createReoccurringSchedule(sendEvery: ReoccurringSchedule | undefined): RecurrenceRule {
  const rule = new RecurrenceRule();
  const timeZone = _.get(sendEvery, 'time-zone', 'Etc/UTC');
  const daysOfWeek = _.get(sendEvery, 'days-of-week');
  const year = _.get(sendEvery, 'year');
  const month = _.get(sendEvery, 'month');
  const date = _.get(sendEvery, 'date');
  const hour = _.get(sendEvery, 'hour');
  const minute = _.get(sendEvery, 'minute');
  const second = _.get(sendEvery, 'second');

  rule.tz = timeZone;

  // Day of week (0-6) starting with Sunday.
  if (!_.isUndefined(daysOfWeek)) {
    rule.dayOfWeek = daysOfWeek;
  }

  // Year.
  if (!_.isUndefined(year)) {
    rule.year = year;
  }

  // Month (0-11).
  if (!_.isUndefined(month)) {
    rule.month = month;
  }

  // Date (1-31).
  if (!_.isUndefined(date)) {
    rule.date = date;
  }

  // Hour (0-23).
  if (!_.isUndefined(hour)) {
    rule.hour = hour;
  }

  // Minute (0-59).
  if (!_.isUndefined(minute)) {
    rule.minute = minute;
  }

  // Second (0-59).
  if (!_.isUndefined(second)) {
    rule.second = second;
  }

  return rule;
}

/**
 * RSS feed.
 *
 * @param {RssFeed}                    event         - Post event.
 * @param {TextBasedChannel|undefined} sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function rssFeed(event: RssFeed, sendToChannel: TextBasedChannel | undefined): void {
  const name = _.get(event, 'name', 'Unknown');
  const interval = _.get(event, 'interval', '* * * * *');
  const url = _.get(event, 'url');
  const message = _.get(event, 'message');
  const sentItems: string[] = [];

  // If "channel-id" is not a text-based channel.
  if (sendToChannel === undefined) {
    generateLogMessage(
      [
        '"channel.channel-id" is not a valid text-based channel',
        `(function: rssFeed, name: ${name})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "message" is not a string or is empty.
  if (!_.isString(message) || _.isEmpty(message)) {
    generateLogMessage(
      [
        '"message" is not a string or is empty',
        `(function: rssFeed, name: ${name})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Create a new RSS parser instance.
  const rssParser = new RssParser();

  try {
    scheduleJob(interval, () => {
      rssParser.parseURL(url).then((response) => {
        const { items } = response;
        /**
         * Clean item link.
         *
         * @param {string|undefined} link - The link.
         *
         * @returns {string|undefined}
         *
         * @since 1.0.0
         */
        const cleanItemLink = (link: string | undefined): string | undefined => {
          if (_.isString(link)) {
            return link
              .replace(/(&?(utm_(.*?)|siteid|#(.*?)))=[^&]+/g, '')
              .replace(/\?&/g, '?')
              .replace(/\?$/g, '')
              .trim();
          }

          return undefined;
        };

        // Prevents bot from spamming same item after reboot.
        if (_.isEmpty(sentItems)) {
          _.forEach(items, (item) => {
            const itemLink = cleanItemLink(item.link);

            if (itemLink) {
              sentItems.push(itemLink);
            }
          });
        }

        _.forEach(items, (item) => {
          const itemTitle = _.get(item, 'title', 'No Title');
          const itemLink = _.get(item, 'link');
          const itemLinkCleaned = cleanItemLink(itemLink);
          /**
           * Replace variables.
           *
           * @param {string} configMessage - Message from configuration.
           *
           * @returns {string}
           *
           * @since 1.0.0
           */
          const replaceVariables = (configMessage: string): string => {
            if (_.isString(configMessage) && !_.isEmpty(configMessage)) {
              return configMessage
                .replace(/%ITEM_TITLE%/, itemTitle)
                .replace(/%ITEM_LINK%/, `${itemLinkCleaned}`);
            }

            return '';
          };

          // Only send when there is an update to the feed.
          if (itemLinkCleaned && _.every(sentItems, (sentItem) => sentItem !== itemLinkCleaned)) {
            const payload = {
              content: replaceVariables(message),
            };

            sendToChannel.send(payload).then(() => {
              generateLogMessage(
                [
                  'Sent message',
                  `(function: rssFeed, name: ${name}, channel: ${sendToChannel.toString()})`,
                ].join(' '),
                30,
              );

              // Update the sent items array.
              sentItems.push(itemLinkCleaned);
            }).catch((error) => generateLogMessage(
              [
                'Failed to send message',
                `(function: rssFeed, name: ${name}, channel: ${sendToChannel.toString()}, payload: ${JSON.stringify(payload)})`,
              ].join(' '),
              10,
              error,
            ));
          }
        });
      }).catch((error) => generateLogMessage(
        [
          'Failed to parse feed',
          `(function: rssFeed, name: ${name})`,
        ].join(' '),
        10,
        error,
      ));
    });

    generateLogMessage(
      [
        'Initialized feed',
        `(function: rssFeed, name: ${name})`,
      ].join(' '),
      40,
    );
  } catch (error) {
    generateLogMessage(
      [
        'Failed to initialize feed',
        `(function: rssFeed, name: ${name})`,
      ].join(' '),
      10,
      error,
    );
  }
}

/**
 * Schedule post.
 *
 * @param {SchedulePost}               event         - Post event.
 * @param {TextBasedChannel|undefined} sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function schedulePost(event: SchedulePost, sendToChannel: TextBasedChannel | undefined): void {
  const name = _.get(event, 'name', 'Unknown');
  const payload = _.get(event, 'payload');
  const reactions = _.get(event, 'reactions');
  const sendEvery = _.get(event, 'send-every');
  const timeZone = _.get(sendEvery, 'time-zone', 'Etc/UTC');
  const skipDays = _.get(event, 'skip-days');

  // If "channel-id" is not a text-based channel.
  if (sendToChannel === undefined) {
    generateLogMessage(
      [
        '"channel.channel-id" is not a valid text-based channel',
        `(function: schedulePost, name: ${name})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "payload" is not a plain object or is empty.
  if (!_.isPlainObject(payload) || _.isEmpty(payload)) {
    generateLogMessage(
      [
        '"payload" is not a plain object or is empty',
        `(function: schedulePost, name: ${name})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "reactions" is not string[].
  if (reactions && (!_.isArray(reactions) || !_.every(reactions, _.isString))) {
    generateLogMessage(
      [
        '"reactions" must be a string[]',
        `(function: schedulePost, name: ${name})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "skip-days" does not match "YYYY-MM-DD"[].
  if (skipDays && (!_.isArray(skipDays) || !_.every(skipDays, (skipDay) => new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g).test(skipDay)))) {
    generateLogMessage(
      [
        '"skip-days" does not match "YYYY-MM-DD"[]',
        `(function: schedulePost, name: ${name})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Create a new re-occurring schedule.
  const rule = createReoccurringSchedule(sendEvery);

  try {
    scheduleJob(rule, () => {
      const todayDate = DateTime.now().setZone(timeZone).toISODate();

      // Send only on days not specified in "skip-days".
      if (!_.includes(skipDays, todayDate)) {
        sendToChannel.send(payload).then((post) => {
          generateLogMessage(
            [
              'Sent scheduled post',
              `(function: schedulePost, name: ${name}, channel: ${sendToChannel.toString()})`,
            ].join(' '),
            30,
          );

          // React to message.
          _.forEach(reactions, (reaction) => {
            post.react(reaction).then(() => generateLogMessage(
              [
                'Reacted scheduled post with emoji',
                `(function: schedulePost, name: ${name}, reaction: ${reaction})`,
              ].join(' '),
              40,
            )).catch((error) => generateLogMessage(
              [
                'Failed to react scheduled post with emoji',
                `(function: schedulePost, name: ${name}, reaction: ${reaction})`,
              ].join(' '),
              10,
              error,
            ));
          });
        }).catch((error) => generateLogMessage(
          [
            'Failed to send scheduled post',
            `(function: schedulePost, name: ${name}, channel: ${sendToChannel.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      } else {
        generateLogMessage(
          [
            'Skipped sending scheduled post',
            `(function: schedulePost, name: ${name}, today date: ${todayDate})`,
          ].join(' '),
          30,
        );
      }
    });

    generateLogMessage(
      [
        'Initialized scheduled post',
        `(function: schedulePost, name: ${name})`,
      ].join(' '),
      40,
    );
  } catch (error) {
    generateLogMessage(
      [
        'Failed to initialize scheduled post',
        `(function: schedulePost, name: ${name})`,
      ].join(' '),
      10,
      error,
    );
  }
}
