import axios from 'axios';
import chalk from 'chalk';
import { TextBasedChannels } from 'discord.js';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import RssParser from 'rss-parser';

import { generateLogMessage } from '../lib/utilities';
import {
  ReoccurringSchedule,
  RssFeed,
  SchedulePost,
  Stocktwit,
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
  if (_.isArray(daysOfWeek) && _.every(daysOfWeek, (dayOfWeek) => _.isFinite(dayOfWeek) && _.inRange(dayOfWeek, 0, 7))) {
    rule.dayOfWeek = daysOfWeek;
  } else {
    rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
  }

  // Year.
  if (!_.isUndefined(year) && _.isFinite(year)) {
    rule.year = year;
  }

  // Month (0-11).
  if (!_.isUndefined(month) && _.isFinite(month) && _.inRange(month, 0, 12)) {
    rule.month = month;
  }

  // Date (1-31).
  if (!_.isUndefined(date) && _.isFinite(date) && _.inRange(date, 1, 32)) {
    rule.date = date;
  }

  // Hour (0-23).
  if (!_.isUndefined(hour) && _.isFinite(hour) && _.inRange(hour, 0, 24)) {
    rule.hour = hour;
  }

  // Minute (0-59).
  if (!_.isUndefined(minute) && _.isFinite(minute) && _.inRange(minute, 0, 60)) {
    rule.minute = minute;
  }

  // Second (0-59).
  if (!_.isUndefined(second) && _.isFinite(second) && _.inRange(second, 0, 60)) {
    rule.second = second;
  }

  return rule;
}

/**
 * RSS feed.
 *
 * @param {RssFeed}                     event         - Post event.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function rssFeed(event: RssFeed, sendToChannel: TextBasedChannels | undefined): void {
  const name = _.get(event, 'name', 'Unknown');
  const interval = _.get(event, 'interval', '* * * * *');
  const url = _.get(event, 'url');
  const message = _.get(event, 'message');
  const sentItems: string[] = [];

  // If "channel-id" is not a text-based channel.
  if (sendToChannel === undefined) {
    generateLogMessage(
      [
        '"channel-id" for',
        chalk.red(name),
        '(RSS feed) is not a valid text-based channel',
      ].join(' '),
      10,
    );

    return;
  }

  // If "message" is not a string or is empty.
  if (!_.isString(message) || _.isEmpty(message)) {
    generateLogMessage(
      [
        '"message" for',
        chalk.red(name),
        'RSS feed is not a string or is empty',
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
        const cleanItemLink = (link: string | undefined): string | undefined => {
          if (_.isString(link)) {
            return link
              .replace(/(&?utm_(.*?)|#(.*?))=[^&]+/g, '')
              .replace(/\?&/g, '?')
              .replace(/\?$/g, '');
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

        _.map(items, (item) => {
          const itemTitle = _.get(item, 'title', 'No Title');
          const itemLink = _.get(item, 'link');
          const itemLinkCleaned = cleanItemLink(itemLink);
          /**
           * Replace variables.
           *
           * @param {string} configMessage - Message from configuration.
           *
           * @return {string}
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
            sendToChannel.send({
              content: replaceVariables(message),
            }).then(() => {
              generateLogMessage(
                [
                  'Sent',
                  chalk.green(name),
                  'RSS feed item to',
                  chalk.green(sendToChannel.toString()),
                ].join(' '),
                30,
              );

              // Update the sent items array.
              sentItems.push(itemLinkCleaned);
            }).catch((error: Error) => generateLogMessage(
              [
                'Failed to send',
                chalk.red(name),
                'RSS feed item to',
                chalk.red(sendToChannel.toString()),
              ].join(' '),
              10,
              error,
            ));
          }
        });
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to parse',
          chalk.red(name),
          'RSS feed',
        ].join(' '),
        10,
        error,
      ));
    });

    generateLogMessage(
      [
        'Scheduled',
        chalk.green(name),
        'RSS feed',
      ].join(' '),
      40,
    );
  } catch (error) {
    generateLogMessage(
      [
        'Failed to schedule',
        chalk.red(name),
        'RSS feed',
      ].join(' '),
      10,
      error,
    );
  }
}

/**
 * Schedule post.
 *
 * @param {SchedulePost}                event         - Post event.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function schedulePost(event: SchedulePost, sendToChannel: TextBasedChannels | undefined): void {
  const name = _.get(event, 'name', 'Unknown');
  const message = _.get(event, 'message');
  const reactions = _.get(event, 'reactions');
  const sendEvery = _.get(event, 'send-every');
  const timeZone = _.get(sendEvery, 'time-zone', 'Etc/UTC');
  const skipDays = _.get(event, 'skip-days');

  // If "channel-id" is not a text-based channel.
  if (sendToChannel === undefined) {
    generateLogMessage(
      [
        '"channel-id" for',
        chalk.red(name),
        '(Schedule post) is not a valid text-based channel',
      ].join(' '),
      10,
    );

    return;
  }

  // If "message" is not a plain object, or is empty.
  if (!_.isPlainObject(message) || _.isEmpty(message)) {
    generateLogMessage(
      [
        '"message" for',
        chalk.red(name),
        'post event is not a plain object or is empty',
      ].join(' '),
      10,
    );

    return;
  }

  // If "reactions" is not string[].
  if (reactions && (!_.isArray(reactions) || !_.every(reactions, _.isString))) {
    generateLogMessage(
      [
        '"reactions" for',
        chalk.red(name),
        'post event must be a string[]',
      ].join(' '),
      10,
    );

    return;
  }

  // If "skip-days" does not match "YYYY-MM-DD"[].
  if (skipDays && (!_.isArray(skipDays) || !_.every(skipDays, (skipDay) => new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g).test(skipDay)))) {
    generateLogMessage(
      [
        '"skip-days" for',
        chalk.red(name),
        'post event does not match "YYYY-MM-DD"[]',
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
        sendToChannel.send(message).then((post) => {
          generateLogMessage(
            [
              'Sent',
              chalk.green(name),
              'post event to',
              chalk.green(sendToChannel.toString()),
            ].join(' '),
            30,
          );

          // React to message.
          _.forEach(reactions, (reaction) => {
            post.react(reaction).then(() => generateLogMessage(
              [
                'Successfully reacted',
                chalk.green(name),
                `post event with "${reaction}"`,
                'emoji',
              ].join(' '),
              40,
            )).catch((error: Error) => generateLogMessage(
              [
                'Failed to react',
                chalk.red(name),
                `post event with "${reaction}"`,
                'emoji',
              ].join(' '),
              10,
              error,
            ));
          });
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send',
            chalk.red(name),
            'post event to',
            chalk.red(sendToChannel.toString()),
          ].join(' '),
          10,
          error,
        ));
      } else {
        generateLogMessage(
          [
            'Skipped sending',
            chalk.yellow(name),
            'post event to',
            chalk.yellow(sendToChannel.toString()),
          ].join(' '),
          30,
        );
      }
    });

    generateLogMessage(
      [
        'Scheduled',
        chalk.green(name),
        'post event',
      ].join(' '),
      40,
    );
  } catch (error) {
    generateLogMessage(
      [
        'Failed to schedule',
        chalk.red(name),
        'post event',
      ].join(' '),
      10,
      error,
    );
  }
}

/**
 * Stocktwits.
 *
 * @param {Stocktwit}                   event         - Post event.
 * @param {TextBasedChannels|undefined} sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function stocktwits(event: Stocktwit, sendToChannel: TextBasedChannels | undefined): void {
  const name = _.get(event, 'name', 'Unknown');
  const message = _.get(event, 'message');
  const showEmbed = _.get(event, 'show-embed');
  const limit = _.get(event, 'limit');
  const sendEvery = _.get(event, 'send-every');
  const timeZone = _.get(sendEvery, 'time-zone', 'Etc/UTC');
  const skipDays = _.get(event, 'skip-days');

  // If "channel-id" is not a text-based channel.
  if (sendToChannel === undefined) {
    generateLogMessage(
      [
        '"channel-id" for',
        chalk.red(name),
        '(Stocktwits) is not a valid text-based channel',
      ].join(' '),
      10,
    );

    return;
  }

  // If "message" is not a string.
  if (!_.isString(message)) {
    generateLogMessage(
      [
        '"message" for Stocktwits post',
        `(${chalk.red(name)})`,
        'is not a string',
      ].join(' '),
      10,
    );

    return;
  }

  // If "limit" is not a finite number.
  if (!_.isFinite(limit)) {
    generateLogMessage(
      [
        '"limit" for Stocktwits post',
        `(${chalk.red(name)})`,
        'is not a finite number',
      ].join(' '),
      10,
    );

    return;
  }

  // If "skip-days" does not match "YYYY-MM-DD"[].
  if (skipDays && (!_.isArray(skipDays) || !_.every(skipDays, (skipDay) => new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g).test(skipDay)))) {
    generateLogMessage(
      [
        '"skip-days" for Stocktwits post',
        `(${chalk.red(name)})`,
        'does not match "YYYY-MM-DD"[]',
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
        const symbolLimit = (limit > 25) ? 25 : limit;

        axios.get(
          `https://api.stocktwits.com/api/2/trending/symbols.json?limit=${symbolLimit}`,
        ).then((response) => {
          if (response.status !== 200) {
            throw response;
          }

          return response.data;
        }).then((responseData) => {
          const symbols = _.get(responseData, 'symbols', []);
          const sortedSymbols = _.orderBy(symbols, ['watchlist_count'], ['desc']);
          const content = {
            content: message.replace(/%TICKERS%/g, _.map(sortedSymbols, (sortedSymbol) => `**${sortedSymbol.symbol}**`).join(', ')),
          };

          if (showEmbed === true) {
            _.assign(content, {
              embeds: [
                {
                  title: `Stocktwits Top ${symbolLimit} Tickers`,
                  type: 'rich',
                  description: `Here are the top ${symbolLimit} trending tickers happening right now. This list includes equities and non-equities (e.g. futures and forex) and is sorted based on popularity.`,
                  fields: _.map(sortedSymbols, (sortedSymbol) => {
                    const sortedSymbolSymbol = _.get(sortedSymbol, 'symbol');
                    const sortedSymbolTitle = _.get(sortedSymbol, 'title');
                    const sortedSymbolWatchlistCount = _.get(sortedSymbol, 'watchlist_count');

                    return {
                      name: `**$${sortedSymbolSymbol}** - ${sortedSymbolTitle}`,
                      value: `:eye: ${sortedSymbolWatchlistCount.toLocaleString()}\n:link: [More info](https://stocktwits.com/symbol/${sortedSymbolSymbol})`,
                      inline: true,
                    };
                  }),
                  color: 2264315,
                },
              ],
            });
          }

          sendToChannel.send(content).then(() => {
            generateLogMessage(
              [
                'Sent Stocktwits post',
                `(${chalk.green(name)})`,
                'to',
                chalk.green(sendToChannel.toString()),
              ].join(' '),
              30,
            );
          }).catch((error: Error) => generateLogMessage(
            [
              'Failed to send Stocktwits post',
              `(${chalk.red(name)})`,
              'to',
              chalk.red(sendToChannel.toString()),
            ].join(' '),
            10,
            error,
          ));
        }).catch((error: Error) => {
          generateLogMessage(
            'Failed to retrieve Stocktwits data',
            10,
            error,
          );
        });
      } else {
        generateLogMessage(
          [
            'Skipped sending Stocktwits post',
            `(${chalk.yellow(name)})`,
            'to',
            chalk.yellow(sendToChannel.toString()),
          ].join(' '),
          20,
        );
      }
    });

    generateLogMessage(
      [
        'Scheduled Stocktwits post',
        `(${chalk.green(name)})`,
      ].join(' '),
      40,
    );
  } catch (error) {
    generateLogMessage(
      [
        'Failed to schedule Stocktwits post',
        `(${chalk.red(name)})`,
      ].join(' '),
      10,
      error,
    );
  }
}
