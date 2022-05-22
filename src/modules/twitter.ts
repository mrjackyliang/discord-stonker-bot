import Bottleneck from 'bottleneck';
import { MessageOptions } from 'discord.js';
import _ from 'lodash';

import { fetchFormattedDate, generateLogMessage, getTextBasedChannel } from '../lib/utility';
import {
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

/**
 * Bottleneck.
 *
 * @since 1.0.0
 */
const twitterApiQueue = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000,
});

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
   * @param {TwitterFeedsReplaceVariablesTweetLink}     tweetLink     - Tweet link.
   *
   * @returns {TwitterFeedsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: TwitterFeedsReplaceVariablesConfigPayload, tweetLink: TwitterFeedsReplaceVariablesTweetLink): TwitterFeedsReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
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

        const author = userTimelineResponse.includes.author(userTimelineResponseTweet);
        const authorUsername = (author !== undefined) ? author.username : undefined;
        const tweetUrl = `https://twitter.com/${authorUsername ?? userTimelineResponseTweetAuthorId}/status/${userTimelineResponseTweetId}`;

        if (
          eventPayload !== undefined
          && _.isPlainObject(eventPayload)
          && !_.isEmpty(eventPayload)
        ) {
          payload = replaceVariables(eventPayload, tweetUrl);
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
