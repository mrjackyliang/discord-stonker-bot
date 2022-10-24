import axios from 'axios';
import Bottleneck from 'bottleneck';
import { decode } from 'html-entities';
import { MessageOptions } from 'discord.js';
import _ from 'lodash';
import cron from 'node-cron';
import RssParser from 'rss-parser';

import {
  escapeCharacters,
  fetchFormattedDate,
  generateCron,
  generateLogMessage,
  generateUserAgent,
  getTextBasedChannel,
  isTimeZoneValid,
} from '../lib/utility';
import {
  RssFeedsEventAllowedUrls,
  RssFeedsEventChannelChannelId,
  RssFeedsEventFetchOn,
  RssFeedsEventFetchOnDates,
  RssFeedsEventFetchOnDaysOfWeek,
  RssFeedsEventFetchOnHours,
  RssFeedsEventFetchOnMinutes,
  RssFeedsEventFetchOnMonths,
  RssFeedsEventFetchOnSeconds,
  RssFeedsEventFetchOnTimeZone,
  RssFeedsEventFollowRedirects,
  RssFeedsEventName,
  RssFeedsEventPayload,
  RssFeedsEventRemoveParameters,
  RssFeedsEvents,
  RssFeedsEventUrl,
  RssFeedsEventUserAgent,
  RssFeedsGuild,
  RssFeedsRemoveParametersItemLink,
  RssFeedsRemoveParametersReturns,
  RssFeedsRemoveSourceFromGoogleNewsRssTitleItemTitle,
  RssFeedsRemoveSourceFromGoogleNewsRssTitleReturns,
  RssFeedsReplaceVariablesConfigPayload,
  RssFeedsReplaceVariablesItemLink,
  RssFeedsReplaceVariablesItemTitle,
  RssFeedsReplaceVariablesReturns,
  RssFeedsReturns,
  SchedulePostsEventChannelChannelId,
  SchedulePostsEventName,
  SchedulePostsEventPayload,
  SchedulePostsEventReactions,
  SchedulePostsEvents,
  SchedulePostsEventSendOn,
  SchedulePostsEventSendOnDates,
  SchedulePostsEventSendOnDaysOfWeek,
  SchedulePostsEventSendOnHours,
  SchedulePostsEventSendOnMinutes,
  SchedulePostsEventSendOnMonths,
  SchedulePostsEventSendOnSeconds,
  SchedulePostsEventSendOnTimeZone,
  SchedulePostsEventSkipDates,
  SchedulePostsGuild,
  SchedulePostsReplaceVariablesConfigPayload,
  SchedulePostsReplaceVariablesReturns,
  SchedulePostsReturns,
  TwitterFeedsEventChannelChannelId,
  TwitterFeedsEventExcludeReplies,
  TwitterFeedsEventExcludeRetweets,
  TwitterFeedsEventName,
  TwitterFeedsEventPayload,
  TwitterFeedsEvents,
  TwitterFeedsEventTwitterId,
  TwitterFeedsGuild,
  TwitterFeedsReplaceVariablesConfigPayload,
  TwitterFeedsReplaceVariablesReturns,
  TwitterFeedsReplaceVariablesTweetLink,
  TwitterFeedsReplaceVariablesTweetText,
  TwitterFeedsReturns,
  TwitterFeedsStreamChannel,
  TwitterFeedsStreamEventExcludeReplies,
  TwitterFeedsStreamEventExcludeRetweets,
  TwitterFeedsStreamEventName,
  TwitterFeedsStreamEventPayload,
  TwitterFeedsStreamEventTwitterId,
  TwitterFeedsStreamReturns,
  TwitterFeedsStreamStartTime,
  TwitterFeedsTwitterClient,
} from '../types';
import { MemoryRssFeedsEventSentItemLinks, MemoryRssFeedsEventSentItemTitles } from '../types/memory';

/**
 * Bottleneck.
 *
 * @since 1.0.0
 */
const followRedirectsQueue = new Bottleneck({
  maxConcurrent: 1,
  minTime: 3000,
});

const twitterApiQueue = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

/**
 * Rss feeds.
 *
 * @param {RssFeedsGuild}  guild  - Guild.
 * @param {RssFeedsEvents} events - Events.
 *
 * @returns {RssFeedsReturns}
 *
 * @since 1.0.0
 */
export function rssFeeds(guild: RssFeedsGuild, events: RssFeedsEvents): RssFeedsReturns {
  /**
   * Rss feeds - Remove source from google news rss title.
   *
   * @param {RssFeedsRemoveSourceFromGoogleNewsRssTitleItemTitle} itemTitle - Item title.
   *
   * @returns {RssFeedsRemoveSourceFromGoogleNewsRssTitleReturns}
   *
   * @since 1.0.0
   */
  const removeSourceFromGoogleNewsRssTitle = (itemTitle: RssFeedsRemoveSourceFromGoogleNewsRssTitleItemTitle): RssFeedsRemoveSourceFromGoogleNewsRssTitleReturns => {
    if (
      _.isString(itemTitle)
      && !_.isEmpty(itemTitle)
    ) {
      return itemTitle.slice(0, itemTitle.lastIndexOf(' - '));
    }

    return undefined;
  };
  /**
   * Rss feeds - Remove parameters.
   *
   * @param {RssFeedsRemoveParametersItemLink} itemLink - Item link.
   *
   * @returns {RssFeedsRemoveParametersReturns}
   *
   * @since 1.0.0
   */
  const removeParameters = (itemLink: RssFeedsRemoveParametersItemLink): RssFeedsRemoveParametersReturns => {
    if (
      _.isString(itemLink)
      && !_.isEmpty(itemLink)
    ) {
      return itemLink.split('?')[0];
    }

    return undefined;
  };
  /**
   * Rss feeds - Replace variables.
   *
   * @param {RssFeedsReplaceVariablesConfigPayload} configPayload - Config payload.
   * @param {RssFeedsReplaceVariablesItemLink}      itemLink      - Item link.
   * @param {RssFeedsReplaceVariablesItemTitle}     itemTitle     - Item title.
   *
   * @returns {RssFeedsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: RssFeedsReplaceVariablesConfigPayload, itemLink: RssFeedsReplaceVariablesItemLink, itemTitle: RssFeedsReplaceVariablesItemTitle): RssFeedsReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%ITEM_LINK%/g, itemLink)
      .replace(/%ITEM_TITLE%/g, escapeCharacters(decode(itemTitle)));

    return JSON.parse(editedPayload);
  };

  // If "rss-feeds" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"rss-feeds" is not configured',
        `(function: rssFeeds, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "rss-feeds" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"rss-feeds" is not configured properly',
        `(function: rssFeeds, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <RssFeedsEventName>_.get(event, ['name']) ?? 'Unknown';
    const theUrl = <RssFeedsEventUrl>_.get(event, ['url']);
    const theUserAgent = <RssFeedsEventUserAgent>_.get(event, ['user-agent']);
    const theFollowRedirects = <RssFeedsEventFollowRedirects>_.get(event, ['follow-redirects']);
    const theRemoveParameters = <RssFeedsEventRemoveParameters>_.get(event, ['remove-parameters']);
    const theAllowedUrls = <RssFeedsEventAllowedUrls>_.get(event, ['allowed-urls']);
    const thePayload = <RssFeedsEventPayload>_.get(event, ['payload']);
    const theChannelChannelId = <RssFeedsEventChannelChannelId>_.get(event, ['channel', 'channel-id']);
    const theFetchOn = <RssFeedsEventFetchOn>_.get(event, ['fetch-on']);
    const theFetchOnTimeZone = <RssFeedsEventFetchOnTimeZone>_.get(event, ['fetch-on', 'time-zone']);
    const theFetchOnDaysOfWeek = <RssFeedsEventFetchOnDaysOfWeek>_.get(event, ['fetch-on', 'days-of-week']);
    const theFetchOnMonths = <RssFeedsEventFetchOnMonths>_.get(event, ['fetch-on', 'months']);
    const theFetchOnDates = <RssFeedsEventFetchOnDates>_.get(event, ['fetch-on', 'dates']);
    const theFetchOnHours = <RssFeedsEventFetchOnHours>_.get(event, ['fetch-on', 'hours']);
    const theFetchOnMinutes = <RssFeedsEventFetchOnMinutes>_.get(event, ['fetch-on', 'minutes']);
    const theFetchOnSeconds = <RssFeedsEventFetchOnSeconds>_.get(event, ['fetch-on', 'seconds']);

    const channel = getTextBasedChannel(guild, theChannelChannelId);

    const sentItemTitles: MemoryRssFeedsEventSentItemTitles = [];
    const sentItemLinks: MemoryRssFeedsEventSentItemLinks = [];

    let payload: MessageOptions = {};

    // If "rss-feeds[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].name" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].url" is not configured properly.
    if (
      !_.isString(theUrl)
      || _.isEmpty(theUrl)
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].url" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, url: ${JSON.stringify(theUrl)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].user-agent" is not configured properly.
    if (
      theUserAgent !== undefined
      && (
        !_.isString(theUserAgent)
        || _.isEmpty(theUserAgent)
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].user-agent" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, user agent: ${JSON.stringify(theUserAgent)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].follow-redirects" is not configured properly.
    if (
      theFollowRedirects !== undefined
      && !_.isBoolean(theFollowRedirects)
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].follow-redirects" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, follow redirects: ${JSON.stringify(theFollowRedirects)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].remove-parameters" is not configured properly.
    if (
      theRemoveParameters !== undefined
      && !_.isBoolean(theRemoveParameters)
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].remove-parameters" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, remove parameters: ${JSON.stringify(theRemoveParameters)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].allowed-urls" is not configured properly.
    if (
      theAllowedUrls !== undefined
      && (
        !_.isArray(theAllowedUrls)
        || _.isEmpty(theAllowedUrls)
        || !_.every(theAllowedUrls, (theAllowedUrl) => _.isString(theAllowedUrl) && !_.isEmpty(theAllowedUrl))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].allowed-urls" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, allowed urls: ${JSON.stringify(theAllowedUrls)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].payload" is not configured properly.
    if (
      thePayload === undefined
      || !_.isPlainObject(thePayload)
      || _.isEmpty(thePayload)
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].payload" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(thePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].channel.channel-id" is not configured properly.
    if (
      channel === undefined
      || channel === null
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on" is not configured properly.
    if (
      theFetchOn !== undefined
      && (
        !_.isPlainObject(theFetchOn)
        || _.isEmpty(theFetchOn)
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, fetch on: ${JSON.stringify(theFetchOn)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.time-zone" is not configured properly.
    if (
      theFetchOnTimeZone !== undefined
      && (
        !_.isString(theFetchOnTimeZone)
        || _.isEmpty(theFetchOnTimeZone)
        || !isTimeZoneValid(theFetchOnTimeZone)
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.time-zone" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, time zone: ${JSON.stringify(theFetchOnTimeZone)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.days-of-week" is not configured properly.
    if (
      theFetchOnDaysOfWeek !== undefined
      && (
        !_.isArray(theFetchOnDaysOfWeek)
        || _.isEmpty(theFetchOnDaysOfWeek)
        || !_.every(theFetchOnDaysOfWeek, (theFetchOnDayOfWeek) => _.isNumber(theFetchOnDayOfWeek) && _.inRange(theFetchOnDayOfWeek, 0, 7))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.days-of-week" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, days of week: ${JSON.stringify(theFetchOnDaysOfWeek)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.months" is not configured properly.
    if (
      theFetchOnMonths !== undefined
      && (
        !_.isArray(theFetchOnMonths)
        || _.isEmpty(theFetchOnMonths)
        || !_.every(theFetchOnMonths, (theFetchOnMonth) => _.isNumber(theFetchOnMonth) && _.inRange(theFetchOnMonth, 1, 13))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.months" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, months: ${JSON.stringify(theFetchOnMonths)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.dates" is not configured properly.
    if (
      theFetchOnDates !== undefined
      && (
        !_.isArray(theFetchOnDates)
        || _.isEmpty(theFetchOnDates)
        || !_.every(theFetchOnDates, (theFetchOnDate) => _.isNumber(theFetchOnDate) && _.inRange(theFetchOnDate, 1, 32))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.dates" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, dates: ${JSON.stringify(theFetchOnDates)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.hours" is not configured properly.
    if (
      theFetchOnHours !== undefined
      && (
        !_.isArray(theFetchOnHours)
        || _.isEmpty(theFetchOnHours)
        || !_.every(theFetchOnHours, (theFetchOnHour) => _.isNumber(theFetchOnHour) && _.inRange(theFetchOnHour, 0, 24))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.hours" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, hours: ${JSON.stringify(theFetchOnHours)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.minutes" is not configured properly.
    if (
      theFetchOnMinutes !== undefined
      && (
        !_.isArray(theFetchOnMinutes)
        || _.isEmpty(theFetchOnMinutes)
        || !_.every(theFetchOnMinutes, (theFetchOnMinute) => _.isNumber(theFetchOnMinute) && _.inRange(theFetchOnMinute, 0, 60))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.minutes" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, minutes: ${JSON.stringify(theFetchOnMinutes)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "rss-feeds[${eventKey}].fetch-on.seconds" is not configured properly.
    if (
      theFetchOnSeconds !== undefined
      && (
        !_.isArray(theFetchOnSeconds)
        || _.isEmpty(theFetchOnSeconds)
        || !_.every(theFetchOnSeconds, (theFetchOnSecond) => _.isNumber(theFetchOnSecond) && _.inRange(theFetchOnSecond, 0, 60))
      )
    ) {
      generateLogMessage(
        [
          `"rss-feeds[${eventKey}].fetch-on.seconds" is not configured properly`,
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, seconds: ${JSON.stringify(theFetchOnSeconds)})`,
        ].join(' '),
        10,
      );

      return;
    }

    try {
      const rssParser = new RssParser({
        headers: {
          'User-Agent': (theUserAgent !== undefined) ? theUserAgent : generateUserAgent(),
        },
      });
      const rule = generateCron({
        'days-of-week': theFetchOnDaysOfWeek,
        months: theFetchOnMonths,
        dates: theFetchOnDates,
        hours: theFetchOnHours,
        minutes: theFetchOnMinutes,
        seconds: theFetchOnSeconds,
      });

      cron.schedule(rule, () => {
        rssParser.parseURL(theUrl).then(async (parseURLResponse) => {
          let parseURLResponseItems = parseURLResponse.items;

          generateLogMessage(
            [
              'Parsed feed',
              `(function: rssFeeds, name: ${JSON.stringify(theName)}, response: ${JSON.stringify(parseURLResponse)})`,
            ].join(' '),
            40,
          );

          if (theFollowRedirects === true) {
            const links = _.map(parseURLResponseItems, (parseURLResponseItem, parseURLResponseItemKey) => {
              const parseURLResponseItemLink = parseURLResponseItem.link;

              if (parseURLResponseItemLink !== undefined) {
                return followRedirectsQueue.schedule(() => axios.get(parseURLResponseItemLink, {
                  headers: {
                    'User-Agent': generateUserAgent(),
                  },
                })).then((getResponse) => {
                  const getResponseRequestResResponseUrl = getResponse.request.res.responseUrl;

                  generateLogMessage(
                    [
                      'Resolved link',
                      `(function: rssFeeds, name: ${JSON.stringify(theName)}, link: ${JSON.stringify(parseURLResponseItemLink)}, response url: ${JSON.stringify(getResponseRequestResResponseUrl)})`,
                    ].join(' '),
                    40,
                  );

                  // Inject resolved link to response item.
                  parseURLResponseItems[parseURLResponseItemKey].link = getResponseRequestResResponseUrl;

                  return true;
                }).catch((error) => {
                  generateLogMessage(
                    [
                      'Failed to resolve link',
                      `(function: rssFeeds, name: ${JSON.stringify(theName)}, link: ${JSON.stringify(parseURLResponseItemLink)})`,
                    ].join(' '),
                    10,
                    error,
                  );

                  return false;
                });
              }

              return false;
            });

            await Promise.all(links);
          }

          if (
            _.isArray(theAllowedUrls)
            && !_.isEmpty(theAllowedUrls)
            && _.every(theAllowedUrls, (theAllowedUrl) => _.isString(theAllowedUrl) && !_.isEmpty(theAllowedUrl))
          ) {
            parseURLResponseItems = _.filter(parseURLResponseItems, (parseURLResponseItem) => {
              const parseURLResponseItemLink = parseURLResponseItem.link;

              if (parseURLResponseItemLink !== undefined) {
                const allowedUrls = _.map(theAllowedUrls, (theAllowedUrl) => _.isString(theAllowedUrl) && !_.isEmpty(theAllowedUrl) && parseURLResponseItemLink.startsWith(theAllowedUrl));

                return _.some(allowedUrls, (allowedUrl) => allowedUrl);
              }

              return false;
            });
          }

          // Prevent possible duplicate responses after bot reboot.
          if (sentItemTitles.length === 0 && sentItemLinks.length === 0) {
            parseURLResponseItems.forEach((parseURLResponseItem) => {
              const parseURLResponseItemTitle = parseURLResponseItem.title;
              const parseURLResponseItemLink = parseURLResponseItem.link;

              const newTitle = (/news\.google\.com\/rss\/search/.test(theUrl)) ? removeSourceFromGoogleNewsRssTitle(parseURLResponseItemTitle) : parseURLResponseItemTitle;
              const newLink = (theRemoveParameters === true) ? removeParameters(parseURLResponseItemLink) : parseURLResponseItemLink;

              if (newTitle !== undefined && newLink !== undefined) {
                sentItemTitles.push(newTitle);
                sentItemLinks.push(newLink);
              }
            });
          }

          parseURLResponseItems.forEach((parseURLResponseItem) => {
            const parseURLResponseItemLink = parseURLResponseItem.link;
            const parseURLResponseItemTitle = parseURLResponseItem.title;

            const newTitle = (/news\.google\.com\/rss\/search/.test(theUrl)) ? removeSourceFromGoogleNewsRssTitle(parseURLResponseItemTitle) : parseURLResponseItemTitle;
            const newLink = (theRemoveParameters === true) ? removeParameters(parseURLResponseItemLink) : parseURLResponseItemLink;

            // When feed item has not been sent before.
            if (
              newTitle !== undefined
              && newLink !== undefined
              && _.every(sentItemTitles, (sentItemTitle) => sentItemTitle !== newTitle)
              && _.every(sentItemLinks, (sentItemLink) => sentItemLink !== newLink)
            ) {
              payload = replaceVariables(thePayload, newLink, newTitle);

              channel.send(payload).then((sendResponse) => {
                const sendResponseUrl = sendResponse.url;

                generateLogMessage(
                  [
                    'Sent message',
                    `(function: rssFeeds, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
                  ].join(' '),
                  40,
                );

                // Add feed item title to sent items array.
                sentItemTitles.push(newTitle);

                // Add feed item link to sent items array.
                sentItemLinks.push(newLink);
              }).catch((error: Error) => generateLogMessage(
                [
                  'Failed to send message',
                  `(function: rssFeeds, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
                ].join(' '),
                10,
                error,
              ));
            }
          });
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to parse feed',
            `(function: rssFeeds, name: ${JSON.stringify(theName)}, url: ${JSON.stringify(theUrl)})`,
          ].join(' '),
          10,
          error,
        ));
      }, {
        recoverMissedExecutions: false,
        scheduled: true,
        timezone: theFetchOnTimeZone,
      });

      generateLogMessage(
        [
          'Initialized event',
          `(function: rssFeeds, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        30,
      );
    } catch (error) {
      generateLogMessage(
        [
          'Failed to initialize event',
          `(function: rssFeeds, name: ${JSON.stringify(theName)}, fetch on: ${JSON.stringify(theFetchOn)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Schedule posts.
 *
 * @param {SchedulePostsGuild}  guild  - Guild.
 * @param {SchedulePostsEvents} events - Events.
 *
 * @returns {SchedulePostsReturns}
 *
 * @since 1.0.0
 */
export function schedulePosts(guild: SchedulePostsGuild, events: SchedulePostsEvents): SchedulePostsReturns {
  /**
   * Schedule posts - Replace variables.
   *
   * @param {SchedulePostsReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {SchedulePostsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: SchedulePostsReplaceVariablesConfigPayload): SchedulePostsReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    return JSON.parse(editedPayload);
  };

  // If "schedule-posts" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"schedule-posts" is not configured',
        `(function: schedulePosts, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "schedule-posts" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"schedule-posts" is not configured properly',
        `(function: schedulePosts, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <SchedulePostsEventName>_.get(event, ['name']) ?? 'Unknown';
    const thePayload = <SchedulePostsEventPayload>_.get(event, ['payload']);
    const theReactions = <SchedulePostsEventReactions>_.get(event, ['reactions']);
    const theChannelChannelId = <SchedulePostsEventChannelChannelId>_.get(event, ['channel', 'channel-id']);
    const theSendOn = <SchedulePostsEventSendOn>_.get(event, ['send-on']);
    const theSendOnTimeZone = <SchedulePostsEventSendOnTimeZone>_.get(event, ['send-on', 'time-zone']);
    const theSendOnDaysOfWeek = <SchedulePostsEventSendOnDaysOfWeek>_.get(event, ['send-on', 'days-of-week']);
    const theSendOnMonths = <SchedulePostsEventSendOnMonths>_.get(event, ['send-on', 'months']);
    const theSendOnDates = <SchedulePostsEventSendOnDates>_.get(event, ['send-on', 'dates']);
    const theSendOnHours = <SchedulePostsEventSendOnHours>_.get(event, ['send-on', 'hours']);
    const theSendOnMinutes = <SchedulePostsEventSendOnMinutes>_.get(event, ['send-on', 'minutes']);
    const theSendOnSeconds = <SchedulePostsEventSendOnSeconds>_.get(event, ['send-on', 'seconds']);
    const theSkipDates = <SchedulePostsEventSkipDates>_.get(event, ['skip-dates']);

    const channel = getTextBasedChannel(guild, theChannelChannelId);

    const regExpIsoDate = /^\d{4}-\d{2}-\d{2}$/;

    let payload: MessageOptions = {};

    // If "schedule-posts[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].name" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].payload" is not configured properly.
    if (
      thePayload === undefined
      || !_.isPlainObject(thePayload)
      || _.isEmpty(thePayload)
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].payload" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(thePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].reactions" is not configured properly.
    if (
      theReactions !== undefined
      && (
        !_.isArray(theReactions)
        || _.isEmpty(theReactions)
        || !_.every(theReactions, (theReaction) => _.isString(theReaction) && !_.isEmpty(theReaction))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].reactions" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, reactions: ${JSON.stringify(theReactions)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].channel.channel-id" is not configured properly.
    if (
      channel === undefined
      || channel === null
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on" is not configured properly.
    if (
      theSendOn !== undefined
      && (
        !_.isPlainObject(theSendOn)
        || _.isEmpty(theSendOn)
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, send on: ${JSON.stringify(theSendOn)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.time-zone" is not configured properly.
    if (
      theSendOnTimeZone !== undefined
      && (
        !_.isString(theSendOnTimeZone)
        || _.isEmpty(theSendOnTimeZone)
        || !isTimeZoneValid(theSendOnTimeZone)
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.time-zone" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, time zone: ${JSON.stringify(theSendOnTimeZone)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.days-of-week" is not configured properly.
    if (
      theSendOnDaysOfWeek !== undefined
      && (
        !_.isArray(theSendOnDaysOfWeek)
        || _.isEmpty(theSendOnDaysOfWeek)
        || !_.every(theSendOnDaysOfWeek, (theSendOnDayOfWeek) => _.isNumber(theSendOnDayOfWeek) && _.inRange(theSendOnDayOfWeek, 0, 7))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.days-of-week" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, days of week: ${JSON.stringify(theSendOnDaysOfWeek)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.months" is not configured properly.
    if (
      theSendOnMonths !== undefined
      && (
        !_.isArray(theSendOnMonths)
        || _.isEmpty(theSendOnMonths)
        || !_.every(theSendOnMonths, (theSendOnMonth) => _.isNumber(theSendOnMonth) && _.inRange(theSendOnMonth, 1, 13))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.months" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, months: ${JSON.stringify(theSendOnMonths)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.dates" is not configured properly.
    if (
      theSendOnDates !== undefined
      && (
        !_.isArray(theSendOnDates)
        || _.isEmpty(theSendOnDates)
        || !_.every(theSendOnDates, (theSendOnDate) => _.isNumber(theSendOnDate) && _.inRange(theSendOnDate, 1, 32))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.dates" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, dates: ${JSON.stringify(theSendOnDates)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.hours" is not configured properly.
    if (
      theSendOnHours !== undefined
      && (
        !_.isArray(theSendOnHours)
        || _.isEmpty(theSendOnHours)
        || !_.every(theSendOnHours, (theSendOnHour) => _.isNumber(theSendOnHour) && _.inRange(theSendOnHour, 0, 24))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.hours" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, hours: ${JSON.stringify(theSendOnHours)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.minutes" is not configured properly.
    if (
      theSendOnMinutes !== undefined
      && (
        !_.isArray(theSendOnMinutes)
        || _.isEmpty(theSendOnMinutes)
        || !_.every(theSendOnMinutes, (theSendOnMinute) => _.isNumber(theSendOnMinute) && _.inRange(theSendOnMinute, 0, 60))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.minutes" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, minutes: ${JSON.stringify(theSendOnMinutes)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].send-on.seconds" is not configured properly.
    if (
      theSendOnSeconds !== undefined
      && (
        !_.isArray(theSendOnSeconds)
        || _.isEmpty(theSendOnSeconds)
        || !_.every(theSendOnSeconds, (theSendOnSecond) => _.isNumber(theSendOnSecond) && _.inRange(theSendOnSecond, 0, 60))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].send-on.seconds" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, seconds: ${JSON.stringify(theSendOnSeconds)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "schedule-posts[${eventKey}].skip-dates" is not configured properly.
    if (
      theSkipDates !== undefined
      && (
        !_.isArray(theSkipDates)
        || _.isEmpty(theSkipDates)
        || !_.every(theSkipDates, (theSkipDate) => theSkipDate !== undefined && regExpIsoDate.test(theSkipDate))
      )
    ) {
      generateLogMessage(
        [
          `"schedule-posts[${eventKey}].skip-dates" is not configured properly`,
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, skip dates: ${JSON.stringify(theSkipDates)})`,
        ].join(' '),
        10,
      );

      return;
    }

    try {
      const rule = generateCron({
        'days-of-week': theSendOnDaysOfWeek,
        months: theSendOnMonths,
        dates: theSendOnDates,
        hours: theSendOnHours,
        minutes: theSendOnMinutes,
        seconds: theSendOnSeconds,
      });

      cron.schedule(rule, () => {
        const todaysDate = fetchFormattedDate('now', undefined, theSendOnTimeZone, 'iso-date');

        // If today's date is a skipped date.
        if (
          theSkipDates !== undefined
          && _.isArray(theSkipDates)
          && !_.isEmpty(theSkipDates)
          && _.every(theSkipDates, (theSkipDate) => theSkipDate !== undefined && regExpIsoDate.test(theSkipDate))
          && theSkipDates.includes(todaysDate)
        ) {
          generateLogMessage(
            [
              'Skipped task',
              `(function: schedulePosts, name: ${JSON.stringify(theName)}, skip dates: ${JSON.stringify(theSkipDates)}, today's date: ${JSON.stringify(todaysDate)})`,
            ].join(' '),
            40,
          );

          return;
        }

        generateLogMessage(
          [
            'Continued task',
            `(function: schedulePosts, name: ${JSON.stringify(theName)}, skip dates: ${JSON.stringify(theSkipDates)}, today's date: ${JSON.stringify(todaysDate)})`,
          ].join(' '),
          40,
        );

        payload = replaceVariables(thePayload);

        channel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: schedulePosts, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );

          if (theReactions === undefined) {
            generateLogMessage(
              [
                'Skipped task',
                `(function: schedulePosts, name: ${JSON.stringify(theName)}, reactions: ${JSON.stringify(theReactions)})`,
              ].join(' '),
              40,
            );

            return;
          }

          generateLogMessage(
            [
              'Continued task',
              `(function: schedulePosts, name: ${JSON.stringify(theName)}, reactions: ${JSON.stringify(theReactions)})`,
            ].join(' '),
            40,
          );

          theReactions.forEach((theReaction) => {
            if (
              !_.isString(theReaction)
              || _.isEmpty(theReaction)
            ) {
              generateLogMessage(
                [
                  'Failed reaction type match',
                  `(function: schedulePosts, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, reaction: ${JSON.stringify(theReaction)})`,
                ].join(' '),
                40,
              );

              return;
            }

            generateLogMessage(
              [
                'Passed reaction type match',
                `(function: schedulePosts, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, reaction: ${JSON.stringify(theReaction)})`,
              ].join(' '),
              40,
            );

            sendResponse.react(theReaction).then((reactResponse) => {
              const reactResponseMessageUrl = reactResponse.message.url;

              generateLogMessage(
                [
                  'Reacted to message',
                  `(function: schedulePosts, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(reactResponseMessageUrl)}, reaction: ${JSON.stringify(theReaction)})`,
                ].join(' '),
                40,
              );
            }).catch((error: Error) => generateLogMessage(
              [
                'Failed to react to message',
                `(function: schedulePosts, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, reaction: ${JSON.stringify(theReaction)})`,
              ].join(' '),
              10,
              error,
            ));
          });
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: schedulePosts, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      }, {
        recoverMissedExecutions: false,
        scheduled: true,
        timezone: theSendOnTimeZone,
      });

      generateLogMessage(
        [
          'Initialized event',
          `(function: schedulePosts, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        30,
      );
    } catch (error) {
      generateLogMessage(
        [
          'Failed to initialize event',
          `(function: schedulePosts, name: ${JSON.stringify(theName)}, send on: ${JSON.stringify(theSendOn)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Twitter feeds.
 *
 * @param {TwitterFeedsTwitterClient} twitterClient - Twitter client.
 * @param {TwitterFeedsGuild}         guild         - Guild.
 * @param {TwitterFeedsEvents}        events        - Events.
 *
 * @returns {TwitterFeedsReturns}
 *
 * @since 1.0.0
 */
export function twitterFeeds(twitterClient: TwitterFeedsTwitterClient, guild: TwitterFeedsGuild, events: TwitterFeedsEvents): TwitterFeedsReturns {
  /**
   * Twitter feeds - Replace variables.
   *
   * @param {TwitterFeedsReplaceVariablesConfigPayload} configPayload - Config payload.
   * @param {TwitterFeedsReplaceVariablesTweetText}     tweetText     - Tweet text.
   * @param {TwitterFeedsReplaceVariablesTweetLink}     tweetLink     - Tweet link.
   *
   * @returns {TwitterFeedsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: TwitterFeedsReplaceVariablesConfigPayload, tweetText: TwitterFeedsReplaceVariablesTweetText, tweetLink: TwitterFeedsReplaceVariablesTweetLink): TwitterFeedsReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%TWEET_TEXT%/g, escapeCharacters(decode(tweetText)))
      .replace(/%TWEET_LINK%/g, tweetLink);

    return JSON.parse(editedPayload);
  };
  /**
   * Twitter feeds - Stream.
   *
   * @param {TwitterFeedsStreamEventName}            eventName            - Event name.
   * @param {TwitterFeedsStreamEventTwitterId}       eventTwitterId       - Event twitter id.
   * @param {TwitterFeedsStreamEventExcludeRetweets} eventExcludeRetweets - Event exclude retweets.
   * @param {TwitterFeedsStreamEventExcludeReplies}  eventExcludeReplies  - Event exclude replies.
   * @param {TwitterFeedsStreamEventPayload}         eventPayload         - Event payload.
   * @param {TwitterFeedsStreamChannel}              channel              - Channel.
   * @param {TwitterFeedsStreamStartTime}            startTime            - Start time.
   *
   * @returns {TwitterFeedsStreamReturns}
   *
   * @since 1.0.0
   */
  const stream = (eventName: TwitterFeedsStreamEventName, eventTwitterId: TwitterFeedsStreamEventTwitterId, eventExcludeRetweets: TwitterFeedsStreamEventExcludeRetweets, eventExcludeReplies: TwitterFeedsStreamEventExcludeReplies, eventPayload: TwitterFeedsStreamEventPayload, channel: TwitterFeedsStreamChannel, startTime: TwitterFeedsStreamStartTime): TwitterFeedsStreamReturns => {
    let endTime = startTime;
    let payload: MessageOptions = {};

    // If Twitter client not configured.
    if (twitterClient === undefined) {
      generateLogMessage(
        [
          'Twitter client not configured',
          `(function: twitterFeeds, name: ${JSON.stringify(eventName)}, twitter client: ${JSON.stringify(twitterClient)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Twitter client configured',
        `(function: twitterFeeds, name: ${JSON.stringify(eventName)}, twitter client: ${JSON.stringify(twitterClient)})`,
      ].join(' '),
      40,
    );

    twitterApiQueue.schedule(() => twitterClient.v2.userTimeline(eventTwitterId, {
      exclude: (eventExcludeRetweets === true || eventExcludeReplies === true) ? [
        ...(eventExcludeRetweets === true) ? ['retweets' as 'retweets'] : [],
        ...(eventExcludeReplies === true) ? ['replies' as 'replies'] : [],
      ] : undefined,
      expansions: [
        'author_id',
      ],
      max_results: 100,
      start_time: fetchFormattedDate('ts-millis', startTime, 'config', 'iso'),
    })).then(async (userTimelineResponse) => {
      // Retrieving tweets sent 10 seconds ago because of API delay.
      endTime = Date.now() - 10000;

      while (!userTimelineResponse.done) {
        // eslint-disable-next-line no-await-in-loop
        await twitterApiQueue.schedule(() => userTimelineResponse.fetchNext(100));
      }

      generateLogMessage(
        [
          'Fetched tweets',
          `(function: twitterFeeds, name: ${JSON.stringify(eventName)}, twitter id: ${JSON.stringify(eventTwitterId)}, start time: ${JSON.stringify(startTime)}, end time: ${JSON.stringify(endTime)}, length: ${JSON.stringify(userTimelineResponse.tweets.length)})`,
        ].join(' '),
        40,
      );

      // Send tweets from oldest to newest because of how Discord displays messages in channels.
      _.reverse(userTimelineResponse.tweets);

      userTimelineResponse.tweets.forEach((userTimelineResponseTweet) => {
        const userTimelineResponseTweetAuthorId = userTimelineResponseTweet.author_id;
        const userTimelineResponseTweetId = userTimelineResponseTweet.id;
        const userTimelineResponseTweetText = userTimelineResponseTweet.text;

        const author = userTimelineResponse.includes.author(userTimelineResponseTweet);
        const authorUsername = (author !== undefined) ? author.username : undefined;
        const tweetUrl = `https://twitter.com/${authorUsername ?? userTimelineResponseTweetAuthorId}/status/${userTimelineResponseTweetId}`;

        if (
          eventPayload !== undefined
          && _.isPlainObject(eventPayload)
          && !_.isEmpty(eventPayload)
        ) {
          payload = replaceVariables(eventPayload, userTimelineResponseTweetText, tweetUrl);
        } else {
          payload = {
            content: tweetUrl,
          };
        }

        channel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: twitterFeeds, name: ${JSON.stringify(eventName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: twitterFeeds, name: ${JSON.stringify(eventName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      });

      return stream(eventName, eventTwitterId, eventExcludeRetweets, eventExcludeReplies, eventPayload, channel, endTime);
    }).catch((error: Error) => {
      generateLogMessage(
        [
          'Failed to fetch tweets',
          `(function: twitterFeeds, name: ${JSON.stringify(eventName)}, twitter id: ${JSON.stringify(eventTwitterId)})`,
        ].join(' '),
        10,
        error,
      );

      return stream(eventName, eventTwitterId, eventExcludeRetweets, eventExcludeReplies, eventPayload, channel, endTime);
    });
  };

  // If "twitter-feeds" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"twitter-feeds" is not configured',
        `(function: twitterFeeds, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "twitter-feeds" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"twitter-feeds" is not configured properly',
        `(function: twitterFeeds, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <TwitterFeedsEventName>_.get(event, ['name']) ?? 'Unknown';
    const theTwitterId = <TwitterFeedsEventTwitterId>_.get(event, ['twitter-id']);
    const theExcludeRetweets = <TwitterFeedsEventExcludeRetweets>_.get(event, ['exclude-retweets']);
    const theExcludeReplies = <TwitterFeedsEventExcludeReplies>_.get(event, ['exclude-replies']);
    const thePayload = <TwitterFeedsEventPayload>_.get(event, ['payload']);
    const theChannelChannelId = <TwitterFeedsEventChannelChannelId>_.get(event, ['channel', 'channel-id']);

    const channel = getTextBasedChannel(guild, theChannelChannelId);

    // If "twitter-feeds[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"twitter-feeds[${eventKey}].name" is not configured properly`,
          `(function: twitterFeeds, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "twitter-feeds[${eventKey}].twitter-id" is not configured properly.
    if (
      !_.isString(theTwitterId)
      || _.isEmpty(theTwitterId)
    ) {
      generateLogMessage(
        [
          `"twitter-feeds[${eventKey}].twitter-id" is not configured properly`,
          `(function: twitterFeeds, name: ${JSON.stringify(theName)}, twitter id: ${JSON.stringify(theTwitterId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "twitter-feeds[${eventKey}].exclude-retweets" is not configured properly.
    if (
      theExcludeRetweets !== undefined
      && !_.isBoolean(theExcludeRetweets)
    ) {
      generateLogMessage(
        [
          `"twitter-feeds[${eventKey}].exclude-retweets" is not configured properly`,
          `(function: twitterFeeds, name: ${JSON.stringify(theName)}, exclude retweets: ${JSON.stringify(theExcludeRetweets)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "twitter-feeds[${eventKey}].exclude-replies" is not configured properly.
    if (
      theExcludeReplies !== undefined
      && !_.isBoolean(theExcludeReplies)
    ) {
      generateLogMessage(
        [
          `"twitter-feeds[${eventKey}].exclude-replies" is not configured properly`,
          `(function: twitterFeeds, name: ${JSON.stringify(theName)}, exclude replies: ${JSON.stringify(theExcludeReplies)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "twitter-feeds[${eventKey}].payload" is not configured properly.
    if (
      thePayload !== undefined
      && (
        !_.isPlainObject(thePayload)
        || _.isEmpty(thePayload)
      )
    ) {
      generateLogMessage(
        [
          `"twitter-feeds[${eventKey}].payload" is not configured properly`,
          `(function: twitterFeeds, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(thePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "twitter-feeds[${eventKey}].channel.channel-id" is not configured properly.
    if (
      channel === undefined
      || channel === null
    ) {
      generateLogMessage(
        [
          `"twitter-feeds[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: twitterFeeds, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // Retrieving tweets sent 10 seconds ago because of API delay.
    stream(theName, theTwitterId, theExcludeRetweets, theExcludeReplies, thePayload, channel, Date.now() - 10000);
  });
}
