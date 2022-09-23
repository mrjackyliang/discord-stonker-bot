import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';

import { generateLogMessage, generateUserAgent, getCollectionItems } from '../lib/utility';
import {
  MessageProxiesEventChannelChannelId,
  MessageProxiesEventName,
  MessageProxiesEvents,
  MessageProxiesEventWebhookAvatarUrl,
  MessageProxiesEventWebhookUrl,
  MessageProxiesEventWebhookUsername,
  MessageProxiesMessage,
  MessageProxiesReturns,
  MessageProxiesSendViaWebhookEventKey,
  MessageProxiesSendViaWebhookEventName,
  MessageProxiesSendViaWebhookOriginalMessageAttachments,
  MessageProxiesSendViaWebhookOriginalMessageContent,
  MessageProxiesSendViaWebhookOriginalMessageEmbeds,
  MessageProxiesSendViaWebhookWebhookAvatarUrl,
  MessageProxiesSendViaWebhookWebhookUrl,
  MessageProxiesSendViaWebhookWebhookUsername,
} from '../types';
import { ApiDiscordWebhook } from '../types/api';
import { MemoryMessageProxiesSendViaWebhookAttachments } from '../types/memory';

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
  const messageChannelId = message.channel.id;
  const messageContent = message.content;
  const messageGuildChannels = message.guild.channels;
  const messageEmbeds = message.embeds;

  /**
   * Message proxies - Send via webhook.
   *
   * @param {MessageProxiesSendViaWebhookEventName}                  eventName                  - Event name.
   * @param {MessageProxiesSendViaWebhookEventKey}                   eventKey                   - Event key.
   * @param {MessageProxiesSendViaWebhookWebhookUsername}            webhookUsername            - Webhook username.
   * @param {MessageProxiesSendViaWebhookWebhookAvatarUrl}           webhookAvatarUrl           - Webhook avatar url.
   * @param {MessageProxiesSendViaWebhookWebhookUrl}                 webhookUrl                 - Webhook url.
   * @param {MessageProxiesSendViaWebhookOriginalMessageContent}     originalMessageContent     - Original message content.
   * @param {MessageProxiesSendViaWebhookOriginalMessageEmbeds}      originalMessageEmbeds      - Original message embeds.
   * @param {MessageProxiesSendViaWebhookOriginalMessageAttachments} originalMessageAttachments - Original message attachments.
   *
   * @returns {MessageProxiesSendViaWebhookReturns}
   *
   * @since 1.0.0
   */
  const sendViaWebhook = (eventName: MessageProxiesSendViaWebhookEventName, eventKey: MessageProxiesSendViaWebhookEventKey, webhookUsername: MessageProxiesSendViaWebhookWebhookUsername, webhookAvatarUrl: MessageProxiesSendViaWebhookWebhookAvatarUrl, webhookUrl: MessageProxiesSendViaWebhookWebhookUrl, originalMessageContent: MessageProxiesSendViaWebhookOriginalMessageContent, originalMessageEmbeds: MessageProxiesSendViaWebhookOriginalMessageEmbeds, originalMessageAttachments: MessageProxiesSendViaWebhookOriginalMessageAttachments) => {
    const form = new FormData();

    const attachmentRequests = _.map(originalMessageAttachments, (originalMessageAttachment) => {
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
            `(function: messageProxies, name: ${JSON.stringify(eventName)}, content type: ${JSON.stringify(originalMessageAttachmentContentType)}, url: ${JSON.stringify(originalMessageAttachmentUrl)})`,
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
            `(function: messageProxies, name: ${JSON.stringify(eventName)}, content type: ${JSON.stringify(originalMessageAttachmentContentType)}, url: ${JSON.stringify(originalMessageAttachmentUrl)})`,
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

    Promise.all(attachmentRequests).then(async (fetchedRequests) => {
      const attachments = <MemoryMessageProxiesSendViaWebhookAttachments>_.filter(fetchedRequests, (fetchedRequest) => {
        const fetchedRequestName = fetchedRequest.name;
        const fetchedRequestType = fetchedRequest.type;
        const fetchedRequestContent = fetchedRequest.content;

        return fetchedRequestName !== null && fetchedRequestType !== null && fetchedRequestContent !== null;
      });

      // Construct the form payload.
      form.append('payload_json', JSON.stringify({
        ...(webhookUsername !== undefined) ? {
          username: webhookUsername,
        } : {},
        ...(webhookAvatarUrl !== undefined) ? {
          avatar_url: webhookAvatarUrl,
        } : {},
        ...(!_.isEmpty(originalMessageContent)) ? {
          content: originalMessageContent,
        } : {},
        ...(originalMessageEmbeds.length > 0) ? {
          embeds: originalMessageEmbeds,
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
        await axios.post<ApiDiscordWebhook>(webhookUrl, form, {
          headers: form.getHeaders({
            'User-Agent': generateUserAgent(),
          }),
        });

        generateLogMessage(
          [
            'Sent message via webhook',
            `(function: messageProxies, name: ${JSON.stringify(eventName)}, webhook url: ${JSON.stringify(webhookUrl)}, form: ${JSON.stringify(form)})`,
          ].join(' '),
          40,
        );
      } catch (error) {
        generateLogMessage(
          [
            'Failed to send message via webhook',
            `(function: messageProxies, name: ${JSON.stringify(eventName)}, webhook url: ${JSON.stringify(webhookUrl)}, form: ${JSON.stringify(form)})`,
          ].join(' '),
          10,
          error,
        );
      }
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
    const theWebhookUsername = <MessageProxiesEventWebhookUsername>_.get(event, ['webhook', 'username']);
    const theWebhookAvatarUrl = <MessageProxiesEventWebhookAvatarUrl>_.get(event, ['webhook', 'avatar-url']);
    const theWebhookUrl = <MessageProxiesEventWebhookUrl>_.get(event, ['webhook', 'url']);

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

    // If "message-proxies[${eventKey}].webhook.username" is not configured properly.
    if (
      theWebhookUsername !== undefined
      && (
        !_.isString(theWebhookUsername)
        || _.isEmpty(theWebhookUsername)
      )
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].webhook.username" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, username: ${JSON.stringify(theWebhookUsername)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-proxies[${eventKey}].webhook.avatar-url" is not configured properly.
    if (
      theWebhookAvatarUrl !== undefined
      && (
        !_.isString(theWebhookAvatarUrl)
        || _.isEmpty(theWebhookAvatarUrl)
      )
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].webhook.avatar-url" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, avatar url: ${JSON.stringify(theWebhookAvatarUrl)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "message-proxies[${eventKey}].webhook.url" is not configured properly.
    if (
      !_.isString(theWebhookUrl)
      || !/^https:\/\/discord\.com\/api\/webhooks\/(\d+)\/(.+)$/.test(theWebhookUrl)
    ) {
      generateLogMessage(
        [
          `"message-proxies[${eventKey}].webhook.url" is not configured properly`,
          `(function: messageProxies, name: ${JSON.stringify(theName)}, url: ${JSON.stringify(theWebhookUrl)})`,
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

    sendViaWebhook(
      theName,
      eventKey,
      theWebhookUsername,
      theWebhookAvatarUrl,
      theWebhookUrl,
      messageContent,
      messageEmbeds,
      getCollectionItems(messageAttachments),
    );
  });
}
