const axios = require('axios').default;
const chalk = require('chalk');
const { DateTime } = require('luxon');
const schedule = require('node-schedule');
const _ = require('lodash');

const { generateLogMessage } = require('../lib/utilities');

/**
 * Create re-occurring schedule.
 *
 * @param {string}   timeZone   - Time zone.
 * @param {number[]} daysOfWeek - Days of the week.
 * @param {number}   hour       - Hour.
 * @param {number}   minute     - Minute.
 * @param {number}   second     - Second.
 *
 * @since 1.0.0
 */
function createReoccurringSchedule(timeZone, daysOfWeek, hour, minute, second) {
  const rule = new schedule.RecurrenceRule();

  rule.tz = timeZone;

  if (_.isArray(daysOfWeek) && !_.isEmpty(daysOfWeek) && _.every(daysOfWeek, (dayOfWeek) => dayOfWeek >= 0 && dayOfWeek <= 6)) {
    rule.dayOfWeek = daysOfWeek;
  } else {
    rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
  }

  if (_.isFinite(hour) && hour >= 0 && hour <= 23) {
    rule.hour = hour;
  }

  if (_.isFinite(minute) && minute >= 0 && minute <= 59) {
    rule.minute = minute;
  }

  if (_.isFinite(second) && second >= 0 && second <= 59) {
    rule.second = second;
  }

  return rule;
}

/**
 * Schedule post.
 *
 * @param {object}           event         - Post event.
 * @param {TextBasedChannel} sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function schedulePost(event, sendToChannel) {
  const name = _.get(event, 'name', 'Unknown');
  const message = _.get(event, 'message');
  const reactions = _.get(event, 'reactions');
  const timeZone = _.get(event, 'send-every.time-zone', 'Etc/UTC');
  const daysOfWeek = _.get(event, 'send-every.days-of-week');
  const hour = _.get(event, 'send-every.hour');
  const minute = _.get(event, 'send-every.minute');
  const second = _.get(event, 'send-every.second');
  const skipDays = _.get(event, 'skip-days');

  // If "channel-id" is not a text-based channel.
  if (_.isUndefined(sendToChannel)) {
    generateLogMessage(
      [
        '"channel-id" for',
        chalk.red(name),
        'post event is not a valid text-based channel',
      ].join(' '),
      10,
    );

    return;
  }

  // If "message" is not a string, is not a plain object, or is empty.
  if ((!_.isString(message) && !_.isPlainObject(message)) || _.isEmpty(message)) {
    generateLogMessage(
      [
        '"message" for',
        chalk.red(name),
        'post event is not a string and is not a plain object or is empty',
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
  const rule = createReoccurringSchedule(timeZone, daysOfWeek, hour, minute, second);

  try {
    schedule.scheduleJob(rule, async () => {
      const todayDate = DateTime.now().setZone(timeZone).toISODate();

      // Send only on days not specified in "skip-days".
      if (!_.includes(skipDays, todayDate)) {
        await sendToChannel.send(message).then((post) => {
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
          _.forEach(reactions, async (reaction) => {
            await post.react(reaction).then(() => generateLogMessage(
              [
                'Successfully reacted',
                chalk.green(name),
                `post event with "${reaction}"`,
                'emoji',
              ].join(' '),
              40,
            )).catch((error) => generateLogMessage(
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
        }).catch((error) => generateLogMessage(
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
          20,
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
 * Stocktwits trending.
 *
 * @param {object}           event         - When to send post.
 * @param {TextBasedChannel} sendToChannel - Send message to channel.
 *
 * @since 1.0.0
 */
function stocktwitsTrending(event, sendToChannel) {
  const name = _.get(event, 'name', 'Unknown');
  const message = _.get(event, 'message');
  const limit = _.get(event, 'limit');
  const timeZone = _.get(event, 'send-every.time-zone', 'Etc/UTC');
  const daysOfWeek = _.get(event, 'send-every.days-of-week');
  const hour = _.get(event, 'send-every.hour');
  const minute = _.get(event, 'send-every.minute');
  const second = _.get(event, 'send-every.second');
  const skipDays = _.get(event, 'skip-days');

  // If "channel-id" is not a text-based channel.
  if (_.isUndefined(sendToChannel)) {
    generateLogMessage(
      [
        '"channel-id" for Stocktwits post',
        `(${chalk.red(name)})`,
        'is not a valid text-based channel',
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
  const rule = createReoccurringSchedule(timeZone, daysOfWeek, hour, minute, second);

  try {
    schedule.scheduleJob(rule, async () => {
      const todayDate = DateTime.now().setZone(timeZone).toISODate();

      // Send only on days not specified in "skip-days".
      if (!_.includes(skipDays, todayDate)) {
        const symbolLimit = (limit > 25) ? 25 : limit;

        await axios.get(
          `https://api.stocktwits.com/api/2/trending/symbols.json?limit=${symbolLimit}`,
        ).then((response) => {
          const responseStatus = _.get(response, 'status');

          if (responseStatus !== 200) {
            throw response;
          }

          return response.data;
        }).then(async (responseData) => {
          const symbols = _.get(responseData, 'symbols', []);
          const sortedSymbols = _.orderBy(symbols, ['watchlist_count'], ['desc']);
          const mappedSymbols = _.map(sortedSymbols, (symbol) => {
            const symbolSymbol = _.get(symbol, 'symbol');
            const symbolTitle = _.get(symbol, 'title');
            const symbolWatchlistCount = _.get(symbol, 'watchlist_count');

            return {
              name: `**$${symbolSymbol}** - ${symbolTitle}`,
              value: `:eye: ${symbolWatchlistCount.toLocaleString()}\n:link: [More info](https://stocktwits.com/symbol/${symbolSymbol})`,
              inline: true,
            };
          });

          await sendToChannel.send({
            content: message,
            embed: {
              title: `Stocktwits Top ${symbolLimit} Tickers`,
              type: 'rich',
              description: `Here are the top ${symbolLimit} trending tickers happening right now. This list includes equities and non-equities (e.g. futures and forex) and is sorted based on popularity.`,
              fields: mappedSymbols,
              color: 2264315,
            },
          }).then(() => {
            generateLogMessage(
              [
                'Sent Stocktwits post',
                `(${chalk.green(name)})`,
                'to',
                chalk.green(sendToChannel.toString()),
              ].join(' '),
              30,
            );
          }).catch((error) => generateLogMessage(
            [
              'Failed to send Stocktwits post',
              `(${chalk.red(name)})`,
              'to',
              chalk.red(sendToChannel.toString()),
            ].join(' '),
            10,
            error,
          ));
        }).catch((error) => {
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

module.exports = {
  schedulePost,
  stocktwitsTrending,
};
