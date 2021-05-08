const chalk = require('chalk');
const luxon = require('luxon');
const schedule = require('node-schedule');
const _ = require('lodash');

const { generateLogMessage } = require('./utilities');

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

  // If "message" is not a string, is empty, or is longer than 2000 characters.
  if (!_.isString(message) || _.isEmpty(message) || _.size(message) > 2000) {
    generateLogMessage(
      [
        '"message" for',
        chalk.red(name),
        'post event is not a string, is empty, or is longer than 2000 characters',
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

  /**
   * Create a new reoccurring schedule.
   *
   * @type {RecurrenceRule}
   */
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

  try {
    schedule.scheduleJob(rule, async () => {
      const todayDate = luxon.DateTime.now().setZone(timeZone).toISODate();

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
            await post.react(reaction).catch((error) => generateLogMessage(
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

module.exports = {
  schedulePost,
};
