import axios from 'axios';
import { MessageOptions } from 'discord.js';
import FormData from 'form-data';
import _ from 'lodash';

import {
  fetchFormattedDate,
  generateLogMessage,
  generateOutputMessage,
  generateUserAgent,
  getCollectionItems,
  getTextBasedChannel,
  splitStringChunks,
} from '../lib/utility';
import {
  AutoRepliesEventChannelChannelId,
  AutoRepliesEventChannels,
  AutoRepliesEventName,
  AutoRepliesEventPayloads,
  AutoRepliesEventRegexFlags,
  AutoRepliesEventRegexPattern,
  AutoRepliesEventReply,
  AutoRepliesEvents,
  AutoRepliesMessage,
  AutoRepliesReturns,
  MessageCopiersEventAllowedChannelChannelId,
  MessageCopiersEventAllowedChannels,
  MessageCopiersEventAllowedUsers,
  MessageCopiersEventAllowedUserUserId,
  MessageCopiersEventDestinationChannelChannelId,
  MessageCopiersEventDestinationMethod,
  MessageCopiersEventDestinations,
  MessageCopiersEventDestinationWebhookAvatarUrl,
  MessageCopiersEventDestinationWebhookUrl,
  MessageCopiersEventDestinationWebhookUsername,
  MessageCopiersEventDisallowedChannelChannelId,
  MessageCopiersEventDisallowedChannels,
  MessageCopiersEventDisallowedUsers,
  MessageCopiersEventDisallowedUserUserId,
  MessageCopiersEventIncludeAttachments,
  MessageCopiersEventMessage,
  MessageCopiersEventName,
  MessageCopiersEventRegexFlags,
  MessageCopiersEventRegexPattern,
  MessageCopiersEventReplacementFlags,
  MessageCopiersEventReplacementPattern,
  MessageCopiersEventReplacementReplaceWith,
  MessageCopiersEventReplacements,
  MessageCopiersEvents,
  MessageCopiersMessage,
  MessageCopiersReplaceTextAndVariablesEventKey,
  MessageCopiersReplaceTextAndVariablesEventMessage,
  MessageCopiersReplaceTextAndVariablesEventName,
  MessageCopiersReplaceTextAndVariablesEventReplacements,
  MessageCopiersReplaceTextAndVariablesOriginalMessageContent,
  MessageCopiersReplaceTextAndVariablesReturns,
  MessageCopiersReturns,
  MessageCopiersSendToDestinationsEventDestinations,
  MessageCopiersSendToDestinationsEventIncludeAttachments,
  MessageCopiersSendToDestinationsEventKey,
  MessageCopiersSendToDestinationsEventName,
  MessageCopiersSendToDestinationsModifiedMessageContent,
  MessageCopiersSendToDestinationsOriginalMessageAttachments,
  MessageCopiersSendToDestinationsReturns,
  MessageCopiersTwitterClient,
  MessageProxiesBuildAndSendEventKey,
  MessageProxiesBuildAndSendEventName,
  MessageProxiesBuildAndSendEventPrintPayload,
  MessageProxiesBuildAndSendEventReplacements,
  MessageProxiesBuildAndSendEventWebhookUrl,
  MessageProxiesBuildAndSendPayloadAttachments,
  MessageProxiesBuildAndSendPayloadAvatarUrl,
  MessageProxiesBuildAndSendPayloadContent,
  MessageProxiesBuildAndSendPayloadEmbeds,
  MessageProxiesBuildAndSendPayloadMentions,
  MessageProxiesBuildAndSendPayloadTts,
  MessageProxiesBuildAndSendPayloadUsername,
  MessageProxiesBuildAndSendReturns,
  MessageProxiesEventChannelChannelId,
  MessageProxiesEventName,
  MessageProxiesEventPrintPayload,
  MessageProxiesEventReplacementFlags,
  MessageProxiesEventReplacementPattern,
  MessageProxiesEventReplacementReplaceWith,
  MessageProxiesEventReplacements,
  MessageProxiesEvents,
  MessageProxiesEventWebhookWebhookUrl,
  MessageProxiesMessage,
  MessageProxiesReturns,
} from '../types';
import { ApiDiscordWebhook } from '../types/api';
import {
  MemoryMessageCopiersSendToDestinationsAttachments,
  MemoryMessageCopiersSendToDestinationsRequests,
  MemoryMessageProxiesBuildAndSendAttachments,
  MemoryMessageProxiesBuildAndSendRequests,
} from '../types/memory';

/**
 * Auto replies.
 *
 * @param {AutoRepliesMessage} message - Message.
 * @param {AutoRepliesEvents}  events  - Events.
 *
 * @returns {AutoRepliesReturns}
 *
 * @since 1.0.0
 */
export function autoReplies(message: AutoRepliesMessage, events: AutoRepliesEvents): AutoRepliesReturns {
  if (message.guild === null) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: autoReplies, guild: ${JSON.stringify(message.guild)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: autoReplies, guild: ${JSON.stringify(message.guild)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageChannelId = message.channel.id;
  const messageContent = message.content;
  const messageGuildChannels = message.guild.channels;

  let alreadyMatched = false;

  // If "auto-replies" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"auto-replies" is not configured',
        `(function: autoReplies, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "auto-replies" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"auto-replies" is not configured properly',
        `(function: autoReplies, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <AutoRepliesEventName>_.get(event, ['name']) ?? 'Unknown';
    const theChannels = <AutoRepliesEventChannels>_.get(event, ['channels']);
    const theRegexPattern = <AutoRepliesEventRegexPattern>_.get(event, ['regex', 'pattern']);
    const theRegexFlags = <AutoRepliesEventRegexFlags>_.get(event, ['regex', 'flags']);
    const thePayloads = <AutoRepliesEventPayloads>_.get(event, ['payloads']);
    const theReply = <AutoRepliesEventReply>_.get(event, ['reply']);

    const channelIds = _.map(theChannels, (theChannel) => <AutoRepliesEventChannelChannelId>_.get(theChannel, ['channel-id']));

    let payload: MessageOptions = {};

    // If previous regex rule already matched.
    if (alreadyMatched) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: autoReplies, name: ${JSON.stringify(theName)}, already matched: ${JSON.stringify(alreadyMatched)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: autoReplies, name: ${JSON.stringify(theName)}, already matched: ${JSON.stringify(alreadyMatched)})`,
      ].join(' '),
      40,
    );

    // If "auto-replies[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"auto-replies[${eventKey}].name" is not configured properly`,
          `(function: autoReplies, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "auto-replies[${eventKey}].channels" is not configured properly.
    if (
      theChannels !== undefined
      && (
        !_.isArray(theChannels)
        || _.isEmpty(theChannels)
        || !_.every(theChannels, (theChannel) => _.isPlainObject(theChannel) && !_.isEmpty(theChannel))
        || !_.every(channelIds, (channelId) => channelId !== undefined && messageGuildChannels.resolve(channelId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"auto-replies[${eventKey}].channels" is not configured properly`,
          `(function: autoReplies, name: ${JSON.stringify(theName)}, channels: ${JSON.stringify(theChannels)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "auto-replies[${eventKey}].regex.pattern" is not configured properly.
    if (!_.isString(theRegexPattern)) {
      generateLogMessage(
        [
          `"auto-replies[${eventKey}].regex.pattern" is not configured properly`,
          `(function: autoReplies, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "auto-replies[${eventKey}].regex.flags" is not configured properly.
    if (
      theRegexFlags !== undefined
      && !_.isString(theRegexFlags)
    ) {
      generateLogMessage(
        [
          `"auto-replies[${eventKey}].regex.flags" is not configured properly`,
          `(function: autoReplies, name: ${JSON.stringify(theName)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "auto-replies[${eventKey}].payloads" is not configured properly.
    if (
      !_.isArray(thePayloads)
      || _.isEmpty(thePayloads)
      || !_.every(thePayloads, (thePayload) => _.isPlainObject(thePayload) && !_.isEmpty(thePayload))
    ) {
      generateLogMessage(
        [
          `"auto-replies[${eventKey}].payloads" is not configured properly`,
          `(function: autoReplies, name: ${JSON.stringify(theName)}, payloads: ${JSON.stringify(thePayloads)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "auto-replies[${eventKey}].reply" is not configured properly.
    if (
      theReply !== undefined
      && !_.isBoolean(theReply)
    ) {
      generateLogMessage(
        [
          `"auto-replies[${eventKey}].reply" is not configured properly`,
          `(function: autoReplies, name: ${JSON.stringify(theName)}, reply: ${JSON.stringify(theReply)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If current channel is not specified in the configuration.
    if (
      theChannels !== undefined
      && _.isArray(theChannels)
      && !_.isEmpty(theChannels)
      && _.every(theChannels, (theChannel) => _.isPlainObject(theChannel) && !_.isEmpty(theChannel))
      && _.every(channelIds, (channelId) => _.isString(channelId) && !_.isEmpty(channelId))
      && !channelIds.includes(messageChannelId)
    ) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: autoReplies, name: ${JSON.stringify(theName)}, specified channel ids: ${JSON.stringify(theChannels)}, current channel id: ${JSON.stringify(messageChannelId)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: autoReplies, name: ${JSON.stringify(theName)}, specified channel ids: ${JSON.stringify(theChannels)}, current channel id: ${JSON.stringify(messageChannelId)})`,
      ].join(' '),
      40,
    );

    try {
      const regExp = new RegExp(theRegexPattern, theRegexFlags);

      generateLogMessage(
        [
          'Constructed regular expression object',
          `(function: autoReplies, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        40,
      );

      if (regExp.test(messageContent)) {
        alreadyMatched = true;

        generateLogMessage(
          [
            'Passed regex rule match',
            `(function: autoReplies, name: ${JSON.stringify(theName)}, message content: ${JSON.stringify(messageContent)}, test: ${JSON.stringify(regExp.test(messageContent))})`,
          ].join(' '),
          40,
        );

        payload = _.sample(thePayloads as MessageOptions[]) ?? thePayloads[0] as MessageOptions;

        if (theReply === true) {
          _.assign(payload, {
            reply: {
              messageReference: message,
            },
          });
        }

        messageChannel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: autoReplies, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: autoReplies, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      } else {
        generateLogMessage(
          [
            'Failed regex rule match',
            `(function: autoReplies, name: ${JSON.stringify(theName)}, message content: ${JSON.stringify(messageContent)}, test: ${JSON.stringify(regExp.test(messageContent))})`,
          ].join(' '),
          40,
        );
      }
    } catch (error) {
      generateLogMessage(
        [
          'Failed to construct regular expression object',
          `(function: autoReplies, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Message copiers.
 *
 * @param {MessageCopiersMessage}       message       - Message.
 * @param {MessageCopiersTwitterClient} twitterClient - Twitter client.
 * @param {MessageCopiersEvents}        events        - Events.
 *
 * @returns {MessageCopiersReturns}
 *
 * @since 1.0.0
 */
export function messageCopiers(message: MessageCopiersMessage, twitterClient: MessageCopiersTwitterClient, events: MessageCopiersEvents): MessageCopiersReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: messageCopiers, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: messageCopiers, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageChannel = message.channel;
  const messageChannelId = message.channel.id;
  const messageContent = message.content;
  const messageGuild = message.guild;
  const messageGuildChannels = message.guild.channels;
  const messageGuildMembers = message.guild.members;
  const messageMember = message.member;
  const messageMemberId = message.member.id;
  const messageMemberUserTag = message.member.user.tag;
  const messageUrl = message.url;

  /**
   * Message copiers - Replace text and variables.
   *
   * @param {MessageCopiersReplaceTextAndVariablesEventName}              eventName              - Event name.
   * @param {MessageCopiersReplaceTextAndVariablesEventKey}               eventKey               - Event key.
   * @param {MessageCopiersReplaceTextAndVariablesEventReplacements}      eventReplacements      - Event replacements.
   * @param {MessageCopiersReplaceTextAndVariablesEventMessage}           eventMessage           - Event message.
   * @param {MessageCopiersReplaceTextAndVariablesOriginalMessageContent} originalMessageContent - Original message content.
   *
   * @returns {MessageCopiersReplaceTextAndVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceTextAndVariables = (eventName: MessageCopiersReplaceTextAndVariablesEventName, eventKey: MessageCopiersReplaceTextAndVariablesEventKey, eventReplacements: MessageCopiersReplaceTextAndVariablesEventReplacements, eventMessage: MessageCopiersReplaceTextAndVariablesEventMessage, originalMessageContent: MessageCopiersReplaceTextAndVariablesOriginalMessageContent): MessageCopiersReplaceTextAndVariablesReturns => {
    let editedMessage = originalMessageContent;

    // Replace text.
    if (
      _.isArray(eventReplacements)
      && !_.isEmpty(eventReplacements)
      && _.every(eventReplacements, (eventReplacement) => _.isPlainObject(eventReplacement) && !_.isEmpty(eventReplacement))
    ) {
      eventReplacements.forEach((eventReplacement, eventReplacementKey) => {
        const thePattern = <MessageCopiersEventReplacementPattern>_.get(eventReplacement, ['pattern']);
        const theFlags = <MessageCopiersEventReplacementFlags>_.get(eventReplacement, ['flags']);
        const theReplaceWith = <MessageCopiersEventReplacementReplaceWith>_.get(eventReplacement, ['replace-with']);

        // If "message-copiers[${eventKey}].replacements[${eventReplacementKey}].pattern" is not configured properly.
        if (!_.isString(thePattern)) {
          generateLogMessage(
            [
              `"message-copiers[${eventKey}].replacements[${eventReplacementKey}].pattern" is not configured properly`,
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)})`,
            ].join(' '),
            10,
          );

          return;
        }

        // If "message-copiers[${eventKey}].replacements[${eventReplacementKey}].flags" is not configured properly.
        if (
          theFlags !== undefined
          && !_.isString(theFlags)
        ) {
          generateLogMessage(
            [
              `"message-copiers[${eventKey}].replacements[${eventReplacementKey}].flags" is not configured properly`,
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, flags: ${JSON.stringify(theFlags)})`,
            ].join(' '),
            10,
          );

          return;
        }

        // If "message-copiers[${eventKey}].replacements[${eventReplacementKey}].replace-with" is not configured properly.
        if (!_.isString(theReplaceWith)) {
          generateLogMessage(
            [
              `"message-copiers[${eventKey}].replacements[${eventReplacementKey}].replace-with" is not configured properly`,
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, replace with: ${JSON.stringify(theReplaceWith)})`,
            ].join(' '),
            10,
          );

          return;
        }

        try {
          const regExp = new RegExp(thePattern, theFlags);

          generateLogMessage(
            [
              'Constructed regular expression object',
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)}, flags: ${JSON.stringify(theFlags)})`,
            ].join(' '),
            40,
          );

          editedMessage = editedMessage.replace(regExp, theReplaceWith);
        } catch (error) {
          generateLogMessage(
            [
              'Failed to construct regular expression object',
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)}, flags: ${JSON.stringify(theFlags)})`,
            ].join(' '),
            10,
            error,
          );
        }
      });
    }

    // Replace variables.
    if (
      _.isString(eventMessage)
      && !_.isEmpty(eventMessage)
    ) {
      return eventMessage
        .replace(/%CHANNEL_MENTION%/g, messageChannel.toString())
        .replace(/%MEMBER_MENTION%/g, messageMember.toString())
        .replace(/%MEMBER_TAG%/g, messageMemberUserTag)
        .replace(/%MESSAGE_CONTENT%/g, editedMessage)
        .replace(/%MESSAGE_EXCERPT%/g, _.head(splitStringChunks(editedMessage, 500)) ?? 'Failed to retrieve message excerpt')
        .replace(/%MESSAGE_URL%/g, messageUrl);
    }

    return editedMessage;
  };
  /**
   * Message copiers - Send to destinations.
   *
   * @param {MessageCopiersSendToDestinationsEventName}                  eventName                  - Event name.
   * @param {MessageCopiersSendToDestinationsEventKey}                   eventKey                   - Event key.
   * @param {MessageCopiersSendToDestinationsEventIncludeAttachments}    eventIncludeAttachments    - Event include attachments.
   * @param {MessageCopiersSendToDestinationsEventDestinations}          eventDestinations          - Event destinations.
   * @param {MessageCopiersSendToDestinationsModifiedMessageContent}     modifiedMessageContent     - Modified message content.
   * @param {MessageCopiersSendToDestinationsOriginalMessageAttachments} originalMessageAttachments - Original message attachments.
   *
   * @returns {MessageCopiersSendToDestinationsReturns}
   *
   * @since 1.0.0
   */
  const sendToDestinations = (eventName: MessageCopiersSendToDestinationsEventName, eventKey: MessageCopiersSendToDestinationsEventKey, eventIncludeAttachments: MessageCopiersSendToDestinationsEventIncludeAttachments, eventDestinations: MessageCopiersSendToDestinationsEventDestinations, modifiedMessageContent: MessageCopiersSendToDestinationsModifiedMessageContent, originalMessageAttachments: MessageCopiersSendToDestinationsOriginalMessageAttachments): MessageCopiersSendToDestinationsReturns => {
    let requests: MemoryMessageCopiersSendToDestinationsRequests = [];

    if (eventIncludeAttachments === true) {
      requests = _.map(originalMessageAttachments, (originalMessageAttachment) => {
        const originalMessageAttachmentContentType = originalMessageAttachment.contentType;
        const originalMessageAttachmentDescription = originalMessageAttachment.description;
        const originalMessageAttachmentName = originalMessageAttachment.name;
        const originalMessageAttachmentUrl = originalMessageAttachment.url;

        return axios.get<Buffer>(originalMessageAttachmentUrl, {
          headers: {
            'User-Agent': generateUserAgent(),
          },
          responseType: 'arraybuffer',
        }).then((getResponse) => {
          const getResponseData = getResponse.data;

          generateLogMessage(
            [
              'Fetched attachment',
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, content type: ${JSON.stringify(originalMessageAttachmentContentType)}, url: ${JSON.stringify(originalMessageAttachmentUrl)})`,
            ].join(' '),
            40,
          );

          return {
            name: originalMessageAttachmentName,
            description: originalMessageAttachmentDescription,
            type: originalMessageAttachmentContentType,
            content: getResponseData,
          };
        }).catch((error: Error) => {
          generateLogMessage(
            [
              'Failed to fetch attachment',
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, content type: ${JSON.stringify(originalMessageAttachmentContentType)}, url: ${JSON.stringify(originalMessageAttachmentUrl)})`,
            ].join(' '),
            10,
            error,
          );

          return {
            name: originalMessageAttachmentName,
            description: originalMessageAttachmentDescription,
            type: originalMessageAttachmentContentType,
            content: null,
          };
        });
      });
    }

    Promise.all(requests).then((fetchedRequests) => {
      const attachments = <MemoryMessageCopiersSendToDestinationsAttachments>_.filter(fetchedRequests, (fetchedRequest) => {
        const fetchedRequestName = fetchedRequest.name;
        const fetchedRequestType = fetchedRequest.type;
        const fetchedRequestContent = fetchedRequest.content;

        return fetchedRequestName !== null && fetchedRequestType !== null && fetchedRequestContent !== null;
      });

      eventDestinations.forEach(async (eventDestination, eventDestinationKey) => {
        const theMethod = <MessageCopiersEventDestinationMethod>_.get(eventDestination, ['method']);

        // If "message-copiers[${eventKey}].destinations[${eventDestinationKey}].method" is not configured properly.
        if (
          theMethod !== 'discord-channel'
          && theMethod !== 'discord-webhook'
          && theMethod !== 'twitter-account'
        ) {
          generateLogMessage(
            [
              `"message-copiers[${eventKey}].destinations[${eventDestinationKey}].method" is not configured properly`,
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, method: ${JSON.stringify(theMethod)})`,
            ].join(' '),
            10,
          );

          return;
        }

        if (theMethod === 'discord-channel') {
          const theChannelChannelId = <MessageCopiersEventDestinationChannelChannelId>_.get(eventDestination, ['channel', 'channel-id']);

          const channel = getTextBasedChannel(messageGuild, theChannelChannelId);

          const payload: MessageOptions = {};

          // If "message-copiers[${eventKey}].destinations[${eventDestinationKey}].channel.channel-id" is not configured properly.
          if (
            channel === undefined
            || channel === null
          ) {
            generateLogMessage(
              [
                `"message-copiers[${eventKey}].destinations[${eventDestinationKey}].channel.channel-id" is not configured properly`,
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
              ].join(' '),
              10,
            );

            return;
          }

          // If there is content, add them into the content.
          if (!_.isEmpty(modifiedMessageContent)) {
            _.assign(payload, {
              content: modifiedMessageContent,
            });
          }

          // If there are attachments, add them into the content.
          if (attachments.length > 0) {
            _.assign(payload, {
              files: _.map(attachments, (attachment) => {
                const attachmentName = attachment.name;
                const attachmentDescription = attachment.description;
                const attachmentContent = attachment.content;

                return {
                  attachment: attachmentContent,
                  name: attachmentName,
                  description: attachmentDescription,
                };
              }),
            });
          }

          try {
            const sendResponse = await channel.send(payload);
            const sendResponseUrl = sendResponse.url;

            generateLogMessage(
              [
                'Sent message',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
              ].join(' '),
              40,
            );
          } catch (error) {
            generateLogMessage(
              [
                'Failed to send message',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
              ].join(' '),
              10,
              error,
            );
          }
        }

        if (theMethod === 'discord-webhook') {
          const theUsername = <MessageCopiersEventDestinationWebhookUsername>_.get(eventDestination, ['webhook', 'username']);
          const theAvatarUrl = <MessageCopiersEventDestinationWebhookAvatarUrl>_.get(eventDestination, ['webhook', 'avatar-url']);
          const theUrl = <MessageCopiersEventDestinationWebhookUrl>_.get(eventDestination, ['webhook', 'url']);

          const form = new FormData();

          // If "message-copiers[${eventKey}].destinations[${eventDestinationKey}].webhook.username" is not configured properly.
          if (
            theUsername !== undefined
            && (
              !_.isString(theUsername)
              || _.isEmpty(theUsername)
            )
          ) {
            generateLogMessage(
              [
                `"message-copiers[${eventKey}].destinations[${eventDestinationKey}].webhook.username" is not configured properly`,
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, username: ${JSON.stringify(theUsername)})`,
              ].join(' '),
              10,
            );

            return;
          }

          // If "message-copiers[${eventKey}].destinations[${eventDestinationKey}].webhook.avatar-url" is not configured properly.
          if (
            theAvatarUrl !== undefined
            && (
              !_.isString(theAvatarUrl)
              || _.isEmpty(theAvatarUrl)
            )
          ) {
            generateLogMessage(
              [
                `"message-copiers[${eventKey}].destinations[${eventDestinationKey}].webhook.avatar-url" is not configured properly`,
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, avatar url: ${JSON.stringify(theAvatarUrl)})`,
              ].join(' '),
              10,
            );

            return;
          }

          // If "message-copiers[${eventKey}].destinations[${eventDestinationKey}].webhook.url" is not configured properly.
          if (
            !_.isString(theUrl)
            || !/^https:\/\/discord\.com\/api\/webhooks\/(\d+)\/(.+)$/.test(theUrl)
          ) {
            generateLogMessage(
              [
                `"message-copiers[${eventKey}].destinations[${eventDestinationKey}].webhook.url" is not configured properly`,
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, url: ${JSON.stringify(theUrl)})`,
              ].join(' '),
              10,
            );

            return;
          }

          // Construct the form payload.
          form.append('payload_json', JSON.stringify({
            ...(theUsername !== undefined) ? {
              username: theUsername,
            } : {},
            ...(theAvatarUrl !== undefined) ? {
              avatar_url: theAvatarUrl,
            } : {},
            ...(!_.isEmpty(modifiedMessageContent)) ? {
              content: modifiedMessageContent,
            } : {},
            ...(attachments.length > 0) ? {
              attachments: _.map(attachments, (attachment, attachmentKey) => {
                const attachmentDescription = attachment.description;
                const attachmentName = attachment.name;

                return {
                  id: attachmentKey,
                  description: attachmentDescription,
                  filename: attachmentName,
                };
              }),
            } : {},
          }), {
            contentType: 'application/json',
          });

          // Construct the form attachments.
          if (attachments.length > 0) {
            attachments.forEach((attachment, attachmentKey) => {
              const attachmentName = attachment.name;
              const attachmentType = attachment.type;
              const attachmentContent = attachment.content;

              form.append(`files[${attachmentKey}]`, attachmentContent, {
                contentType: attachmentType,
                filename: attachmentName,
              });
            });
          }

          try {
            await axios.post<ApiDiscordWebhook>(theUrl, form, {
              headers: form.getHeaders({
                'User-Agent': generateUserAgent(),
              }),
            });

            generateLogMessage(
              [
                'Sent message via webhook',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, webhook url: ${JSON.stringify(theUrl)}, form: ${JSON.stringify(form)})`,
              ].join(' '),
              40,
            );
          } catch (error) {
            generateLogMessage(
              [
                'Failed to send message via webhook',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, webhook url: ${JSON.stringify(theUrl)}, form: ${JSON.stringify(form)})`,
              ].join(' '),
              10,
              error,
            );
          }
        }

        if (theMethod === 'twitter-account') {
          // If Twitter client not configured.
          if (twitterClient === undefined) {
            generateLogMessage(
              [
                'Twitter client not configured',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, twitter client: ${JSON.stringify(twitterClient)})`,
              ].join(' '),
              10,
            );

            return;
          }

          generateLogMessage(
            [
              'Twitter client configured',
              `(function: messageCopiers, name: ${JSON.stringify(eventName)}, twitter client: ${JSON.stringify(twitterClient)})`,
            ].join(' '),
            40,
          );

          const images = _.filter(attachments, (attachment) => {
            const attachmentType = attachment.type;

            return attachmentType === 'image/jpe' || attachmentType === 'image/jpg' || attachmentType === 'image/jpeg' || attachmentType === 'image/png' || attachmentType === 'image/webp';
          });
          const gifs = _.filter(attachments, (attachment) => {
            const attachmentType = attachment.type;

            return attachmentType === 'image/gif';
          });

          let selectedAttachments: MemoryMessageCopiersSendToDestinationsAttachments = [];

          if (_.inRange(images.length, 1, 5)) { // Only 1 to 4 images allowed per tweet.
            selectedAttachments = images;
          } else if (_.inRange(gifs.length, 1, 2)) { // Only 1 animated image allowed per tweet.
            selectedAttachments = gifs;
          }

          try {
            if (selectedAttachments.length > 0) {
              const uploadingMedias = _.map(selectedAttachments, async (selectedAttachment) => {
                const selectedAttachmentType = selectedAttachment.type;
                const selectedAttachmentContent = selectedAttachment.content;

                let mediaType;

                switch (selectedAttachmentType) {
                  case 'image/gif':
                    mediaType = 'gif';
                    break;
                  case 'image/jpe':
                  case 'image/jpg':
                  case 'image/jpeg':
                    mediaType = 'jpg';
                    break;
                  case 'image/png':
                    mediaType = 'png';
                    break;
                  case 'image/webp':
                    mediaType = 'webp';
                    break;
                  default:
                    break;
                }

                return twitterClient.v1.uploadMedia(selectedAttachmentContent, {
                  mimeType: selectedAttachmentType,
                  type: mediaType,
                }).then((uploadMediaResponse) => {
                  generateLogMessage(
                    [
                      'Uploaded media',
                      `(function: messageCopiers, name: ${JSON.stringify(eventName)}, selected attachment: ${JSON.stringify(selectedAttachment)})`,
                    ].join(' '),
                    40,
                  );

                  return uploadMediaResponse;
                }).catch((error: Error) => {
                  generateLogMessage(
                    [
                      'Failed to upload media',
                      `(function: messageCopiers, name: ${JSON.stringify(eventName)}, selected attachment: ${JSON.stringify(selectedAttachment)})`,
                    ].join(' '),
                    10,
                    error,
                  );

                  return null;
                });
              });
              const uploadedMedias = await Promise.all(uploadingMedias);
              const mediaIds = _.filter(uploadedMedias, _.isString);

              await twitterClient.v2.tweet(modifiedMessageContent, {
                media: {
                  media_ids: mediaIds,
                },
              });
            } else {
              await twitterClient.v2.tweet(modifiedMessageContent);
            }

            generateLogMessage(
              [
                'Sent tweet',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, modified message content: ${JSON.stringify(modifiedMessageContent)}, selected attachments: ${JSON.stringify(selectedAttachments)})`,
              ].join(' '),
              40,
            );
          } catch (error) {
            generateLogMessage(
              [
                'Failed to send tweet',
                `(function: messageCopiers, name: ${JSON.stringify(eventName)}, modified message content: ${JSON.stringify(modifiedMessageContent)}, selected attachments: ${JSON.stringify(selectedAttachments)})`,
              ].join(' '),
              10,
              error,
            );
          }
        }
      });
    });
  };

  // If "message-copiers" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"message-copiers" is not configured',
        `(function: messageCopiers, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "message-copiers" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"message-copiers" is not configured properly',
        `(function: messageCopiers, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <MessageCopiersEventName>_.get(event, ['name']) ?? 'Unknown';
    const theRegexPattern = <MessageCopiersEventRegexPattern>_.get(event, ['regex', 'pattern']);
    const theRegexFlags = <MessageCopiersEventRegexFlags>_.get(event, ['regex', 'flags']);
    const theAllowedUsers = <MessageCopiersEventAllowedUsers>_.get(event, ['allowed-users']);
    const theAllowedChannels = <MessageCopiersEventAllowedChannels>_.get(event, ['allowed-channels']);
    const theDisallowedUsers = <MessageCopiersEventDisallowedUsers>_.get(event, ['disallowed-users']);
    const theDisallowedChannels = <MessageCopiersEventDisallowedChannels>_.get(event, ['disallowed-channels']);
    const theReplacements = <MessageCopiersEventReplacements>_.get(event, ['replacements']);
    const theMessage = <MessageCopiersEventMessage>_.get(event, ['message']);
    const theIncludeAttachments = <MessageCopiersEventIncludeAttachments>_.get(event, ['include-attachments']);
    const theDestinations = <MessageCopiersEventDestinations>_.get(event, ['destinations']);

    const allowedUserIds = _.map(theAllowedUsers, (theAllowedUser) => <MessageCopiersEventAllowedUserUserId>_.get(theAllowedUser, ['user-id']));
    const allowedChannelIds = _.map(theAllowedChannels, (theAllowedChannel) => <MessageCopiersEventAllowedChannelChannelId>_.get(theAllowedChannel, ['channel-id']));
    const disallowedUserIds = _.map(theDisallowedUsers, (theDisallowedUser) => <MessageCopiersEventDisallowedUserUserId>_.get(theDisallowedUser, ['user-id']));
    const disallowedChannelIds = _.map(theDisallowedChannels, (theDisallowedChannel) => <MessageCopiersEventDisallowedChannelChannelId>_.get(theDisallowedChannel, ['channel-id']));

    // If "message-copiers[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].name" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].regex.pattern" is not configured properly.
    if (!_.isString(theRegexPattern)) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].regex.pattern" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].regex.flags" is not configured properly.
    if (
      theRegexFlags !== undefined
      && !_.isString(theRegexFlags)
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].regex.flags" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].allowed-users" and "message-copiers[${eventKey}].disallowed-users" is not configured properly.
    if (
      theAllowedUsers !== undefined
      && theDisallowedUsers !== undefined
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].allowed-users" and "message-copiers[${eventKey}].disallowed-users" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, allowed users: ${JSON.stringify(theAllowedUsers)}, disallowed users: ${JSON.stringify(theDisallowedUsers)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].allowed-channels" and "message-copiers[${eventKey}].disallowed-channels" is not configured properly.
    if (
      theAllowedChannels !== undefined
      && theDisallowedChannels !== undefined
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].allowed-channels" and "message-copiers[${eventKey}].disallowed-channels" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, allowed channels: ${JSON.stringify(theAllowedChannels)}, disallowed channels: ${JSON.stringify(theDisallowedChannels)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].allowed-users" is not configured properly.
    if (
      theAllowedUsers !== undefined
      && (
        !_.isArray(theAllowedUsers)
        || _.isEmpty(theAllowedUsers)
        || !_.every(theAllowedUsers, (theAllowedUser) => _.isPlainObject(theAllowedUser) && !_.isEmpty(theAllowedUser))
        || !_.every(allowedUserIds, (allowedUserId) => allowedUserId !== undefined && messageGuildMembers.resolve(allowedUserId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].allowed-users" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, allowed users: ${JSON.stringify(theAllowedUsers)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].allowed-channels" is not configured properly.
    if (
      theAllowedChannels !== undefined
      && (
        !_.isArray(theAllowedChannels)
        || _.isEmpty(theAllowedChannels)
        || !_.every(theAllowedChannels, (theAllowedChannel) => _.isPlainObject(theAllowedChannel) && !_.isEmpty(theAllowedChannel))
        || !_.every(allowedChannelIds, (allowedChannelId) => allowedChannelId !== undefined && messageGuildChannels.resolve(allowedChannelId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].allowed-channels" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, allowed channels: ${JSON.stringify(theAllowedChannels)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].disallowed-users" is not configured properly.
    if (
      theDisallowedUsers !== undefined
      && (
        !_.isArray(theDisallowedUsers)
        || _.isEmpty(theDisallowedUsers)
        || !_.every(theDisallowedUsers, (theDisallowedUser) => _.isPlainObject(theDisallowedUser) && !_.isEmpty(theDisallowedUser))
        || !_.every(disallowedUserIds, (disallowedUserId) => disallowedUserId !== undefined && messageGuildMembers.resolve(disallowedUserId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].disallowed-users" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, disallowed users: ${JSON.stringify(theDisallowedUsers)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].disallowed-channels" is not configured properly.
    if (
      theDisallowedChannels !== undefined
      && (
        !_.isArray(theDisallowedChannels)
        || _.isEmpty(theDisallowedChannels)
        || !_.every(theDisallowedChannels, (theDisallowedChannel) => _.isPlainObject(theDisallowedChannel) && !_.isEmpty(theDisallowedChannel))
        || !_.every(disallowedChannelIds, (disallowedChannelId) => disallowedChannelId !== undefined && messageGuildChannels.resolve(disallowedChannelId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].disallowed-channels" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, disallowed channels: ${JSON.stringify(theDisallowedChannels)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].replacements" is not configured properly.
    if (
      theReplacements !== undefined
      && (
        !_.isArray(theReplacements)
        || _.isEmpty(theReplacements)
        || !_.every(theReplacements, (theReplacement) => _.isPlainObject(theReplacement) && !_.isEmpty(theReplacement))
      )
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].replacements" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, replacements: ${JSON.stringify(theReplacements)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].message" is not configured properly.
    if (
      theMessage !== undefined
      && (
        !_.isString(theMessage)
        || _.isEmpty(theMessage)
      )
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].message" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, message: ${JSON.stringify(theMessage)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].include-attachments" is not configured properly.
    if (
      theIncludeAttachments !== undefined
      && !_.isBoolean(theIncludeAttachments)
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].include-attachments" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, include attachments: ${JSON.stringify(theIncludeAttachments)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-copiers[${eventKey}].destinations" is not configured properly.
    if (
      !_.isArray(theDestinations)
      || _.isEmpty(theDestinations)
      || !_.every(theDestinations, (theDestination) => _.isPlainObject(theDestination) && !_.isEmpty(theDestination))
    ) {
      generateLogMessage(
        [
          `"message-copiers[${eventKey}].destinations" is not configured properly`,
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, destinations: ${JSON.stringify(theDestinations)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If limited to specific users or specific channels.
    if (
      (
        theAllowedUsers !== undefined
        && _.isArray(theAllowedUsers)
        && !_.isEmpty(theAllowedUsers)
        && _.every(theAllowedUsers, (theAllowedUser) => _.isPlainObject(theAllowedUser) && !_.isEmpty(theAllowedUser))
        && _.every(allowedUserIds, (allowedUserId) => allowedUserId !== undefined && messageGuildMembers.resolve(allowedUserId) !== null)
        && !allowedUserIds.includes(messageMemberId)
      )
      || (
        theAllowedChannels !== undefined
        && _.isArray(theAllowedChannels)
        && !_.isEmpty(theAllowedChannels)
        && _.every(theAllowedChannels, (theAllowedChannel) => _.isPlainObject(theAllowedChannel) && !_.isEmpty(theAllowedChannel))
        && _.every(allowedChannelIds, (allowedChannelId) => allowedChannelId !== undefined && messageGuildChannels.resolve(allowedChannelId) !== null)
        && !allowedChannelIds.includes(messageChannelId)
      )
      || (
        theDisallowedUsers !== undefined
        && _.isArray(theDisallowedUsers)
        && !_.isEmpty(theDisallowedUsers)
        && _.every(theDisallowedUsers, (theDisallowedUser) => _.isPlainObject(theDisallowedUser) && !_.isEmpty(theDisallowedUser))
        && _.every(disallowedUserIds, (disallowedUserId) => disallowedUserId !== undefined && messageGuildMembers.resolve(disallowedUserId) !== null)
        && disallowedUserIds.includes(messageMemberId)
      )
      || (
        theDisallowedChannels !== undefined
        && _.isArray(theDisallowedChannels)
        && !_.isEmpty(theDisallowedChannels)
        && _.every(theDisallowedChannels, (theDisallowedChannel) => _.isPlainObject(theDisallowedChannel) && !_.isEmpty(theDisallowedChannel))
        && _.every(disallowedChannelIds, (disallowedChannelId) => disallowedChannelId !== undefined && messageGuildChannels.resolve(disallowedChannelId) !== null)
        && disallowedChannelIds.includes(messageChannelId)
      )
    ) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, allowed users: ${JSON.stringify(theAllowedUsers)}, allowed channels: ${JSON.stringify(theAllowedChannels)}, disallowed users: ${JSON.stringify(theDisallowedUsers)}, disallowed channels: ${JSON.stringify(theDisallowedChannels)}, current user id: ${JSON.stringify(messageMemberId)}, current channel id: ${JSON.stringify(messageChannelId)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: messageCopiers, name: ${JSON.stringify(theName)}, allowed users: ${JSON.stringify(theAllowedUsers)}, allowed channels: ${JSON.stringify(theAllowedChannels)}, disallowed users: ${JSON.stringify(theDisallowedUsers)}, disallowed channels: ${JSON.stringify(theDisallowedChannels)}, current user id: ${JSON.stringify(messageMemberId)}, current channel id: ${JSON.stringify(messageChannelId)})`,
      ].join(' '),
      40,
    );

    try {
      const regExp = new RegExp(theRegexPattern, theRegexFlags);

      generateLogMessage(
        [
          'Constructed regular expression object',
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        40,
      );

      if (regExp.test(messageContent)) {
        const replacedTextAndVariables = replaceTextAndVariables(theName, eventKey, theReplacements, theMessage, messageContent);

        sendToDestinations(
          theName,
          eventKey,
          theIncludeAttachments,
          theDestinations,
          replacedTextAndVariables,
          getCollectionItems(messageAttachments),
        );
      }
    } catch (error) {
      generateLogMessage(
        [
          'Failed to construct regular expression object',
          `(function: messageCopiers, name: ${JSON.stringify(theName)}, pattern: ${JSON.stringify(theRegexPattern)}, flags: ${JSON.stringify(theRegexFlags)})`,
        ].join(' '),
        10,
        error,
      );
    }
  });
}

/**
 * Message proxies.
 *
 * @param {MessageProxiesMessage} message - Message.
 * @param {MessageProxiesEvents}  events  - Events.
 *
 * @returns {MessageProxiesReturns}
 *
 * @since 1.0.0
 */
export function messageProxies(message: MessageProxiesMessage, events: MessageProxiesEvents): MessageProxiesReturns {
  if (message.guild === null) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: messageProxies, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: messageProxies, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageAttachments = message.attachments;
  const messageAuthor = message.author;
  const messageAuthorUsername = message.author.username;
  const messageChannelId = message.channel.id;
  const messageContent = message.content;
  const messageGuildChannels = message.guild.channels;
  const messageEmbeds = message.embeds;
  const messageMentions = message.mentions;
  const messageTts = message.tts;

  /**
   * Message proxies - Build and send.
   *
   * @param {MessageProxiesBuildAndSendEventName}          eventName          - Event name.
   * @param {MessageProxiesBuildAndSendEventKey}           eventKey           - Event key.
   * @param {MessageProxiesBuildAndSendEventReplacements}  eventReplacements  - Event replacements.
   * @param {MessageProxiesBuildAndSendEventPrintPayload}  eventPrintPayload  - Event print payload.
   * @param {MessageProxiesBuildAndSendEventWebhookUrl}    eventWebhookUrl    - Event webhook url.
   * @param {MessageProxiesBuildAndSendPayloadUsername}    payloadUsername    - Payload username.
   * @param {MessageProxiesBuildAndSendPayloadAvatarUrl}   payloadAvatarUrl   - Payload avatar url.
   * @param {MessageProxiesBuildAndSendPayloadContent}     payloadContent     - Payload content.
   * @param {MessageProxiesBuildAndSendPayloadEmbeds}      payloadEmbeds      - Payload embeds.
   * @param {MessageProxiesBuildAndSendPayloadTts}         payloadTts         - Payload tts.
   * @param {MessageProxiesBuildAndSendPayloadMentions}    payloadMentions    - Payload mentions.
   * @param {MessageProxiesBuildAndSendPayloadAttachments} payloadAttachments - Payload attachments.
   *
   * @returns {MessageProxiesBuildAndSendReturns}
   *
   * @since 1.0.0
   */
  const buildAndSend = (eventName: MessageProxiesBuildAndSendEventName, eventKey: MessageProxiesBuildAndSendEventKey, eventReplacements: MessageProxiesBuildAndSendEventReplacements, eventPrintPayload: MessageProxiesBuildAndSendEventPrintPayload, eventWebhookUrl: MessageProxiesBuildAndSendEventWebhookUrl, payloadUsername: MessageProxiesBuildAndSendPayloadUsername, payloadAvatarUrl: MessageProxiesBuildAndSendPayloadAvatarUrl, payloadContent: MessageProxiesBuildAndSendPayloadContent, payloadEmbeds: MessageProxiesBuildAndSendPayloadEmbeds, payloadTts: MessageProxiesBuildAndSendPayloadTts, payloadMentions: MessageProxiesBuildAndSendPayloadMentions, payloadAttachments: MessageProxiesBuildAndSendPayloadAttachments): MessageProxiesBuildAndSendReturns => {
    const payloadMentionsRoles = payloadMentions.roles;
    const payloadMentionsRolesSize = payloadMentions.roles.size;
    const payloadMentionsUsers = payloadMentions.users;
    const payloadMentionsUsersSize = payloadMentions.users.size;
    const payloadMentionsEveryone = payloadMentions.everyone;

    const form = new FormData();

    const requests: MemoryMessageProxiesBuildAndSendRequests = _.map(payloadAttachments, (payloadAttachment) => {
      const payloadAttachmentContentType = payloadAttachment.contentType;
      const payloadAttachmentDescription = payloadAttachment.description;
      const payloadAttachmentName = payloadAttachment.name;
      const payloadAttachmentUrl = payloadAttachment.url;

      return axios.get<Buffer>(payloadAttachmentUrl, {
        headers: {
          'User-Agent': generateUserAgent(),
        },
        responseType: 'arraybuffer',
      }).then((getResponse) => {
        const getResponseData = getResponse.data;

        generateLogMessage(
          [
            'Fetched attachment',
            `(function: messageProxies, name: ${JSON.stringify(eventName)}, content type: ${JSON.stringify(payloadAttachmentContentType)}, url: ${JSON.stringify(payloadAttachmentUrl)})`,
          ].join(' '),
          40,
        );

        return {
          name: payloadAttachmentName,
          description: payloadAttachmentDescription,
          type: payloadAttachmentContentType,
          content: getResponseData,
        };
      }).catch((error: Error) => {
        generateLogMessage(
          [
            'Failed to fetch attachment',
            `(function: messageProxies, name: ${JSON.stringify(eventName)}, content type: ${JSON.stringify(payloadAttachmentContentType)}, url: ${JSON.stringify(payloadAttachmentUrl)})`,
          ].join(' '),
          10,
          error,
        );

        return {
          name: payloadAttachmentName,
          description: payloadAttachmentDescription,
          type: payloadAttachmentContentType,
          content: null,
        };
      });
    });

    Promise.all(requests).then((fetchedRequests) => {
      const attachments = <MemoryMessageProxiesBuildAndSendAttachments>_.filter(fetchedRequests, (fetchedRequest) => {
        const fetchedRequestName = fetchedRequest.name;
        const fetchedRequestType = fetchedRequest.type;
        const fetchedRequestContent = fetchedRequest.content;

        return fetchedRequestName !== null && fetchedRequestType !== null && fetchedRequestContent !== null;
      });

      // Build a "payload_json" object.
      let payloadJson = JSON.stringify({
        username: payloadUsername,
        avatar_url: payloadAvatarUrl,
        content: payloadContent,
        embeds: _.map(payloadEmbeds, (payloadEmbed) => {
          const payloadEmbedColor = payloadEmbed.color;
          const payloadEmbedAuthor = payloadEmbed.author;
          const payloadEmbedTitle = payloadEmbed.title;
          const payloadEmbedUrl = payloadEmbed.url;
          const payloadEmbedDescription = payloadEmbed.description;
          const payloadEmbedFields = payloadEmbed.fields;
          const payloadEmbedThumbnail = payloadEmbed.thumbnail;
          const payloadEmbedImage = payloadEmbed.image;
          const payloadEmbedFooter = payloadEmbed.footer;
          const payloadEmbedTimestamp = payloadEmbed.timestamp;

          return {
            ...(payloadEmbedColor !== null) ? {
              color: payloadEmbedColor,
            } : {},
            ...(payloadEmbedAuthor !== null) ? {
              author: {
                name: payloadEmbedAuthor.name,
                ...(payloadEmbedAuthor.url) ? {
                  url: payloadEmbedAuthor.url,
                } : {},
                ...(payloadEmbedAuthor.iconURL) ? {
                  icon_url: payloadEmbedAuthor.iconURL,
                } : {},
              },
            } : {},
            ...(payloadEmbedTitle !== null) ? {
              title: payloadEmbedTitle,
            } : {},
            ...(payloadEmbedUrl !== null) ? {
              url: payloadEmbedUrl,
            } : {},
            ...(payloadEmbedDescription !== null) ? {
              description: payloadEmbedDescription,
            } : {},
            ...(payloadEmbedFields.length > 0) ? {
              fields: _.map(payloadEmbedFields, (payloadEmbedField) => {
                const payloadEmbedFieldName = payloadEmbedField.name;
                const payloadEmbedFieldValue = payloadEmbedField.value;
                const payloadEmbedFieldInline = payloadEmbedField.inline;

                return {
                  name: payloadEmbedFieldName,
                  value: payloadEmbedFieldValue,
                  inline: payloadEmbedFieldInline,
                };
              }),
            } : {},
            ...(payloadEmbedThumbnail !== null) ? {
              thumbnail: {
                url: payloadEmbedThumbnail.url,
              },
            } : {},
            ...(payloadEmbedImage !== null) ? {
              image: {
                url: payloadEmbedImage.url,
              },
            } : {},
            ...(payloadEmbedFooter !== null) ? {
              footer: {
                text: payloadEmbedFooter.text,
                ...(payloadEmbedFooter.iconURL) ? {
                  icon_url: payloadEmbedFooter.iconURL,
                } : {},
              },
            } : {},
            ...(payloadEmbedTimestamp !== null) ? {
              timestamp: fetchFormattedDate('ts-millis', payloadEmbedTimestamp, 'UTC', 'iso'),
            } : {},
          };
        }),
        tts: payloadTts,
        ...(payloadMentionsRolesSize > 0 || payloadMentionsUsersSize > 0 || payloadMentionsEveryone) ? {
          allowed_mentions: {
            ...(payloadMentionsRolesSize > 100 || payloadMentionsUsersSize > 100 || payloadMentionsEveryone) ? {
              parse: [
                ...(payloadMentionsRolesSize > 100) ? ['roles'] : [],
                ...(payloadMentionsUsersSize > 100) ? ['users'] : [],
                ...(payloadMentionsEveryone) ? ['everyone'] : [],
              ],
            } : {},
            ...(_.inRange(payloadMentionsRolesSize, 1, 101)) ? {
              roles: [...payloadMentionsRoles.keys()],
            } : {},
            ...(_.inRange(payloadMentionsUsersSize, 1, 101)) ? {
              users: [...payloadMentionsUsers.keys()],
            } : {},
          },
        } : {},
        ...(attachments.length > 0) ? {
          attachments: _.map(attachments, (attachment, attachmentKey) => {
            const attachmentDescription = attachment.description;
            const attachmentName = attachment.name;

            return {
              id: attachmentKey,
              description: attachmentDescription,
              filename: attachmentName,
            };
          }),
        } : {},
      });

      // Print the "payload_json" object before modification.
      if (eventPrintPayload === true) {
        generateOutputMessage(
          `"payload_json" for ${eventName} (before modification)`,
          payloadJson,
        );
      }

      // Replace text from "payload_json" object.
      if (
        _.isArray(eventReplacements)
        && !_.isEmpty(eventReplacements)
        && _.every(eventReplacements, (eventReplacement) => _.isPlainObject(eventReplacement) && !_.isEmpty(eventReplacement))
      ) {
        eventReplacements.forEach((eventReplacement, eventReplacementKey) => {
          const thePattern = <MessageProxiesEventReplacementPattern>_.get(eventReplacement, ['pattern']);
          const theFlags = <MessageProxiesEventReplacementFlags>_.get(eventReplacement, ['flags']);
          const theReplaceWith = <MessageProxiesEventReplacementReplaceWith>_.get(eventReplacement, ['replace-with']);

          // If "message-proxies[${eventKey}].replacements[${eventReplacementKey}].pattern" is not configured properly.
          if (!_.isString(thePattern)) {
            generateLogMessage(
              [
                `"message-proxies[${eventKey}].replacements[${eventReplacementKey}].pattern" is not configured properly`,
                `(function: messageProxies, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)})`,
              ].join(' '),
              10,
            );

            return;
          }

          // If "message-proxies[${eventKey}].replacements[${eventReplacementKey}].flags" is not configured properly.
          if (
            theFlags !== undefined
            && !_.isString(theFlags)
          ) {
            generateLogMessage(
              [
                `"message-proxies[${eventKey}].replacements[${eventReplacementKey}].flags" is not configured properly`,
                `(function: messageProxies, name: ${JSON.stringify(eventName)}, flags: ${JSON.stringify(theFlags)})`,
              ].join(' '),
              10,
            );

            return;
          }

          // If "message-proxies[${eventKey}].replacements[${eventReplacementKey}].replace-with" is not configured properly.
          if (!_.isString(theReplaceWith)) {
            generateLogMessage(
              [
                `"message-proxies[${eventKey}].replacements[${eventReplacementKey}].replace-with" is not configured properly`,
                `(function: messageProxies, name: ${JSON.stringify(eventName)}, replace with: ${JSON.stringify(theReplaceWith)})`,
              ].join(' '),
              10,
            );

            return;
          }

          try {
            const regExp = new RegExp(thePattern, theFlags);

            generateLogMessage(
              [
                'Constructed regular expression object',
                `(function: messageProxies, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)}, flags: ${JSON.stringify(theFlags)})`,
              ].join(' '),
              40,
            );

            payloadJson = payloadJson.replace(regExp, theReplaceWith);
          } catch (error) {
            generateLogMessage(
              [
                'Failed to construct regular expression object',
                `(function: messageProxies, name: ${JSON.stringify(eventName)}, pattern: ${JSON.stringify(thePattern)}, flags: ${JSON.stringify(theFlags)})`,
              ].join(' '),
              10,
              error,
            );
          }
        });
      }

      // Print the "payload_json" object after modification.
      if (eventPrintPayload === true) {
        generateOutputMessage(
          `"payload_json" for ${eventName} (after modification)`,
          payloadJson,
        );
      }

      // Construct the form payload.
      form.append('payload_json', payloadJson);

      // Construct the form attachments.
      if (attachments.length > 0) {
        attachments.forEach((attachment, attachmentKey) => {
          const attachmentName = attachment.name;
          const attachmentType = attachment.type;
          const attachmentContent = attachment.content;

          form.append(`files[${attachmentKey}]`, attachmentContent, {
            contentType: attachmentType,
            filename: attachmentName,
          });
        });
      }

      axios.post<ApiDiscordWebhook>(eventWebhookUrl, form, {
        headers: form.getHeaders({
          'User-Agent': generateUserAgent(),
        }),
      }).then(() => generateLogMessage(
        [
          'Sent message via webhook',
          `(function: messageProxies, name: ${JSON.stringify(eventName)}, webhook url: ${JSON.stringify(eventWebhookUrl)}, form: ${JSON.stringify(form)})`,
        ].join(' '),
        40,
      )).catch((error) => generateLogMessage(
        [
          'Failed to send message via webhook',
          `(function: messageProxies, name: ${JSON.stringify(eventName)}, webhook url: ${JSON.stringify(eventWebhookUrl)}, form: ${JSON.stringify(form)})`,
        ].join(' '),
        10,
        error,
      ));
    });
  };

  // If "message-proxies" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"message-proxies" is not configured',
        `(function: messageProxies, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "message-proxies" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"message-proxies" is not configured properly',
        `(function: messageProxies, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <MessageProxiesEventName>_.get(event, ['name']) ?? 'Unknown';
    const theChannelChannelId = <MessageProxiesEventChannelChannelId>_.get(event, ['channel', 'channel-id']);
    const theReplacements = <MessageProxiesEventReplacements>_.get(event, ['replacements']);
    const thePrintPayload = <MessageProxiesEventPrintPayload>_.get(event, ['print-payload']);
    const theWebhookWebhookUrl = <MessageProxiesEventWebhookWebhookUrl>_.get(event, ['webhook', 'webhook-url']);

    // If "message-proxies[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].name" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-proxies[${eventKey}].channel.channel-id" is not configured properly.
    if (
      theChannelChannelId === undefined
      || messageGuildChannels.resolve(theChannelChannelId) === null
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-proxies[${eventKey}].replacements" is not configured properly.
    if (
      theReplacements !== undefined
      && (
        !_.isArray(theReplacements)
        || _.isEmpty(theReplacements)
        || !_.every(theReplacements, (theReplacement) => _.isPlainObject(theReplacement) && !_.isEmpty(theReplacement))
      )
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].replacements" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, replacements: ${JSON.stringify(theReplacements)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-proxies[${eventKey}].print-payload" is not configured properly.
    if (
      thePrintPayload !== undefined
      && !_.isBoolean(thePrintPayload)
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].print-payload" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, print payload: ${JSON.stringify(thePrintPayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-proxies[${eventKey}].webhook.webhook-url" is not configured properly.
    if (
      !_.isString(theWebhookWebhookUrl)
      || !/^https:\/\/discord\.com\/api\/webhooks\/(\d+)\/(.+)$/.test(theWebhookWebhookUrl)
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].webhook.webhook-url" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, webhook url: ${JSON.stringify(theWebhookWebhookUrl)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If current rule doesn't apply to the channel being checked.
    if (theChannelChannelId !== messageChannelId) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: messageProxies, name: ${JSON.stringify(theName)}, specified channel id: ${JSON.stringify(theChannelChannelId)}, current channel id: ${JSON.stringify(messageChannelId)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: messageProxies, name: ${JSON.stringify(theName)}, specified channel id: ${JSON.stringify(theChannelChannelId)}, current channel id: ${JSON.stringify(messageChannelId)})`,
      ].join(' '),
      40,
    );

    buildAndSend(
      theName,
      eventKey,
      theReplacements,
      thePrintPayload,
      theWebhookWebhookUrl,
      messageAuthorUsername,
      messageAuthor.displayAvatarURL(),
      messageContent,
      messageEmbeds,
      messageTts,
      messageMentions,
      getCollectionItems(messageAttachments),
    );
  });
}
