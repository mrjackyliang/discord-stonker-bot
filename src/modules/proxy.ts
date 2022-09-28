import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';

import {
  fetchFormattedDate,
  generateLogMessage,
  generateOutputMessage,
  generateUserAgent,
  getCollectionItems,
} from '../lib/utility';
import {
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
import { MemoryMessageProxiesBuildAndSendAttachments, MemoryMessageProxiesBuildAndSendRequests } from '../types/memory';

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
