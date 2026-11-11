import { randomUUID } from 'node:crypto';

import nodemailer from 'nodemailer';
import { z } from 'zod';

import type {
  Lib_Notifications_BuildEventNotification_Definition,
  Lib_Notifications_BuildEventNotification_Details,
  Lib_Notifications_BuildEventNotification_Message,
  Lib_Notifications_BuildEventNotification_OccurredAt,
  Lib_Notifications_BuildEventNotification_Returns,
  Lib_Notifications_BuildPayload_App,
  Lib_Notifications_BuildPayload_Notification,
  Lib_Notifications_BuildPayload_Returns,
  Lib_Notifications_BuildRequest_App,
  Lib_Notifications_BuildRequest_Bearer,
  Lib_Notifications_BuildRequest_Notification,
  Lib_Notifications_BuildRequest_Returns,
  Lib_Notifications_BuildRequest_Secrets,
  Lib_Notifications_BuildRequest_Settings,
  Lib_Notifications_BuildRequest_Target,
  Lib_Notifications_BuildRequest_Title,
  Lib_Notifications_BuildSecretsRemovedNotification_App,
  Lib_Notifications_BuildSecretsRemovedNotification_Items,
  Lib_Notifications_BuildSecretsRemovedNotification_KeyTerm,
  Lib_Notifications_BuildSecretsRemovedNotification_Returns,
  Lib_Notifications_BuildSignInLockedNotification_Address,
  Lib_Notifications_BuildSignInLockedNotification_Returns,
  Lib_Notifications_BuildTestNotification_App,
  Lib_Notifications_BuildTestNotification_Returns,
  Lib_Notifications_DefaultDependencies,
  Lib_Notifications_DescribeError_Error,
  Lib_Notifications_DescribeError_Returns,
  Lib_Notifications_DescribeResponse_Body,
  Lib_Notifications_DescribeResponse_Candidate,
  Lib_Notifications_DescribeResponse_Detail,
  Lib_Notifications_DescribeResponse_Parsed,
  Lib_Notifications_DescribeResponse_Response,
  Lib_Notifications_DescribeResponse_Returns,
  Lib_Notifications_EmailAddressSchema,
  Lib_Notifications_EscapeSlack_Returns,
  Lib_Notifications_EscapeSlack_Value,
  Lib_Notifications_EventDefinitions,
  Lib_Notifications_FieldSchema_Field,
  Lib_Notifications_FieldSchema_Keep,
  Lib_Notifications_FieldSchema_Missing,
  Lib_Notifications_FieldSchema_Returns,
  Lib_Notifications_FieldSchema_Schema,
  Lib_Notifications_HasWhitespace_Returns,
  Lib_Notifications_HasWhitespace_Value,
  Lib_Notifications_InvalidMessages,
  Lib_Notifications_IsHttpUrl_Protocols,
  Lib_Notifications_IsHttpUrl_Returns,
  Lib_Notifications_IsHttpUrl_Url,
  Lib_Notifications_IsHttpUrl_Value,
  Lib_Notifications_IsMatrixRoomId_Colon,
  Lib_Notifications_IsMatrixRoomId_Returns,
  Lib_Notifications_IsMatrixRoomId_Value,
  Lib_Notifications_IsPort_Port,
  Lib_Notifications_IsPort_Returns,
  Lib_Notifications_IsPort_Value,
  Lib_Notifications_IsValidField_Kind,
  Lib_Notifications_IsValidField_Returns,
  Lib_Notifications_IsValidField_Value,
  Lib_Notifications_NotificationEventsSchema_Keys,
  Lib_Notifications_NotificationEventsSchema_Returns,
  Lib_Notifications_NotificationInputSchema_ClearableSecretKeys,
  Lib_Notifications_NotificationInputSchema_EventKeys,
  Lib_Notifications_NotificationInputSchema_MissingSecretKeys,
  Lib_Notifications_NotificationInputSchema_Returns,
  Lib_Notifications_NotificationInputSchema_SavedSecretKeys,
  Lib_Notifications_NotificationInputSchema_Service,
  Lib_Notifications_NotificationNameSchema,
  Lib_Notifications_NotificationSecretKeys_Returns,
  Lib_Notifications_NotificationSecretKeys_Service,
  Lib_Notifications_NotificationServiceBody,
  Lib_Notifications_NotificationServiceSchema,
  Lib_Notifications_NotificationSettingsSchema_Returns,
  Lib_Notifications_NotificationSettingsSchema_SavedSecretKeys,
  Lib_Notifications_NotificationSettingsSchema_Service,
  Lib_Notifications_NotificationSettingsSchema_Shape,
  Lib_Notifications_NtfyTopic_Returns,
  Lib_Notifications_NtfyTopic_Segments,
  Lib_Notifications_NtfyTopic_Topic,
  Lib_Notifications_NtfyTopic_Url,
  Lib_Notifications_NtfyTopic_Value,
  Lib_Notifications_PriorityNumbers,
  Lib_Notifications_SendMail_Options,
  Lib_Notifications_SendMail_Returns,
  Lib_Notifications_SendMail_Transport,
  Lib_Notifications_SendNotification_App,
  Lib_Notifications_SendNotification_Dependencies,
  Lib_Notifications_SendNotification_Notification,
  Lib_Notifications_SendNotification_Request,
  Lib_Notifications_SendNotification_Response,
  Lib_Notifications_SendNotification_Returns,
  Lib_Notifications_SendNotification_Target,
  Lib_Notifications_SendNotification_Title,
  Lib_Notifications_ServiceDefinitions,
  Lib_Notifications_SplitNotificationSettings_Input,
  Lib_Notifications_SplitNotificationSettings_Returns,
  Lib_Notifications_SplitNotificationSettings_Secrets,
  Lib_Notifications_SplitNotificationSettings_Service,
  Lib_Notifications_SplitNotificationSettings_Settings,
  Lib_Notifications_SplitNotificationSettings_Value,
  Lib_Notifications_TrimTrailingSlashes_End,
  Lib_Notifications_TrimTrailingSlashes_Returns,
  Lib_Notifications_TrimTrailingSlashes_Value,
} from '../types/lib/notifications.d.ts';

/**
 * Notifications - Notification Services.
 *
 * Lists the fields each service needs and which of them are secret.
 * Secret fields are sealed with the app's key and never returned by the API.
 *
 * @since 4.0.0
 */
export const notificationServices: Lib_Notifications_ServiceDefinitions = {
  'apprise': {
    fields: [
      {
        key: 'url',
        kind: 'http-url',
        maximum: 2048,
        missing: 'Enter the Apprise URL.',
        required: true,
        secret: true,
      },
      {
        key: 'urls',
        kind: 'text',
        maximum: 4096,
        missing: '',
        required: false,
        secret: true,
      },
    ],
    label: 'Apprise',
  },
  'discord': {
    fields: [{
      key: 'webhookUrl',
      kind: 'discord-webhook',
      maximum: 2048,
      missing: 'Enter the webhook URL.',
      required: true,
      secret: true,
    }],
    label: 'Discord',
  },
  'email': {
    fields: [
      {
        key: 'host',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the SMTP server.',
        required: true,
        secret: false,
      },
      {
        key: 'port',
        kind: 'port',
        maximum: 5,
        missing: 'Enter a port number.',
        required: true,
        secret: false,
      },
      {
        key: 'security',
        kind: 'security',
        maximum: 8,
        missing: 'Choose STARTTLS, TLS, or none.',
        required: true,
        secret: false,
      },
      {
        key: 'username',
        kind: 'text',
        maximum: 255,
        missing: '',
        required: false,
        secret: false,
      },
      {
        key: 'password',
        kind: 'text',
        maximum: 1024,
        missing: '',
        required: false,
        secret: true,
      },
      {
        key: 'from',
        kind: 'email',
        maximum: 255,
        missing: 'Enter the address to send from.',
        required: true,
        secret: false,
      },
      {
        key: 'to',
        kind: 'emails',
        maximum: 1024,
        missing: 'Enter the address to send to.',
        required: true,
        secret: false,
      },
    ],
    label: 'Email',
  },
  'gotify': {
    fields: [
      {
        key: 'url',
        kind: 'http-url',
        maximum: 2048,
        missing: 'Enter the server URL.',
        required: true,
        secret: false,
      },
      {
        key: 'token',
        kind: 'text',
        maximum: 1024,
        missing: 'Enter the app token.',
        required: true,
        secret: true,
      },
    ],
    label: 'Gotify',
  },
  'matrix': {
    fields: [
      {
        key: 'homeserverUrl',
        kind: 'https-url',
        maximum: 2048,
        missing: 'Enter the homeserver URL.',
        required: true,
        secret: false,
      },
      {
        key: 'roomId',
        kind: 'matrix-room',
        maximum: 255,
        missing: 'Enter the room ID.',
        required: true,
        secret: false,
      },
      {
        key: 'accessToken',
        kind: 'text',
        maximum: 1024,
        missing: 'Enter the access token.',
        required: true,
        secret: true,
      },
    ],
    label: 'Matrix',
  },
  'ntfy': {
    fields: [
      {
        key: 'url',
        kind: 'ntfy-topic-url',
        maximum: 2048,
        missing: 'Enter the topic URL.',
        required: true,
        secret: false,
      },
      {
        key: 'token',
        kind: 'text',
        maximum: 1024,
        missing: '',
        required: false,
        secret: true,
      },
    ],
    label: 'ntfy',
  },
  'ntfy-reverse-proxy': {
    fields: [
      {
        key: 'url',
        kind: 'https-url',
        maximum: 2048,
        missing: 'Enter the context URL.',
        required: true,
        secret: false,
      },
      {
        key: 'token',
        kind: 'text',
        maximum: 1024,
        missing: '',
        required: false,
        secret: true,
      },
    ],
    label: 'Reverse Proxy for ntfy',
  },
  'pushover': {
    fields: [
      {
        key: 'userKey',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the user key.',
        required: true,
        secret: true,
      },
      {
        key: 'appToken',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the app token.',
        required: true,
        secret: true,
      },
    ],
    label: 'Pushover',
  },
  'slack': {
    fields: [{
      key: 'webhookUrl',
      kind: 'slack-webhook',
      maximum: 2048,
      missing: 'Enter the webhook URL.',
      required: true,
      secret: true,
    }],
    label: 'Slack',
  },
  'telegram': {
    fields: [
      {
        key: 'botToken',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the bot token.',
        required: true,
        secret: true,
      },
      {
        key: 'chatId',
        kind: 'text',
        maximum: 255,
        missing: 'Enter the chat ID.',
        required: true,
        secret: false,
      },
    ],
    label: 'Telegram',
  },
  'webhook': {
    fields: [
      {
        key: 'url',
        kind: 'http-url',
        maximum: 2048,
        missing: 'Enter the URL.',
        required: true,
        secret: true,
      },
      {
        key: 'token',
        kind: 'text',
        maximum: 1024,
        missing: '',
        required: false,
        secret: true,
      },
    ],
    label: 'Webhook',
  },
};

/**
 * Notifications - Common Notification Events.
 *
 * Lists the events every app sends, before its own events.
 * Each app adds these to its catalog so the same alerts work everywhere.
 *
 * @since 4.0.0
 */
export const commonNotificationEvents: Lib_Notifications_EventDefinitions = [
  {
    defaultEnabled: true,
    description: 'The app started without its key and removed what it locked.',
    key: 'secrets-removed',
    label: 'Saved secrets were removed',
    priority: 'high',
    tags: [
      'key',
      'warning',
    ],
  },
  {
    defaultEnabled: true,
    description: 'Ten failed sign-ins from one address paused sign-in from it.',
    key: 'sign-in-locked',
    label: 'Sign-in locked',
    priority: 'high',
    tags: ['lock'],
  },
];

/**
 * Notifications - Invalid Messages.
 *
 * Gives each field kind the message shown when its value has the wrong form.
 * The same words appear in all four apps.
 *
 * @since 4.0.0
 */
const invalidMessages: Lib_Notifications_InvalidMessages = {
  'discord-webhook': 'Use a Discord webhook URL. It starts with https://discord.com/api/webhooks/.',
  'email': 'Use an email address, like alerts@example.com.',
  'emails': 'Use email addresses separated by commas.',
  'http-url': 'Use an http:// or https:// URL.',
  'https-url': 'Use an https:// URL.',
  'matrix-room': 'Use a room ID like !room:example.com.',
  'ntfy-topic-url': 'Use the full topic URL, like https://ntfy.sh/my-alerts.',
  'port': 'Use a port from 1 to 65535.',
  'security': 'Choose STARTTLS, TLS, or none.',
  'slack-webhook': 'Use a Slack webhook URL. It starts with https://hooks.slack.com/.',
  'text': 'Check this value.',
};

/**
 * Notifications - Priority Numbers.
 *
 * Maps a notification's priority to the 1-to-5 scale ntfy and the payload use.
 * Low is 2, default is 3, and high is 4.
 *
 * @since 4.0.0
 */
const priorityNumbers: Lib_Notifications_PriorityNumbers = {
  default: 3,
  high: 4,
  low: 2,
};

/**
 * Notifications - Email Address Schema.
 *
 * Checks one address for the From and To fields of the email service.
 * A list of addresses is split on commas and checked one address at a time.
 *
 * @since 4.0.0
 */
const emailAddressSchema: Lib_Notifications_EmailAddressSchema = z.email();

/**
 * Notifications - Notification Name Schema.
 *
 * Validates the name a destination is listed under.
 * Names are trimmed, up to 80 characters, and unique ignoring letter case.
 *
 * @since 4.0.0
 */
const notificationNameSchema: Lib_Notifications_NotificationNameSchema = z.string({ error: 'Name this notification.' })
  .trim()
  .min(1, 'Name this notification.')
  .max(80, 'Use 80 characters or fewer.');

/**
 * Notifications - Notification Service Schema.
 *
 * Validates the service a new destination uses.
 * The service can't change after the destination is added.
 *
 * @since 4.0.0
 */
export const notificationServiceSchema: Lib_Notifications_NotificationServiceSchema = z.enum([
  'apprise',
  'discord',
  'email',
  'gotify',
  'matrix',
  'ntfy',
  'ntfy-reverse-proxy',
  'pushover',
  'slack',
  'telegram',
  'webhook',
], { error: 'Choose a service.' });

/**
 * Notifications - Notification Service Body.
 *
 * Reads only the service from a new destination's body, before its fields are checked.
 * An unknown service is reported on the service field like any other field issue.
 *
 * @since 4.0.0
 */
export const notificationServiceBody: Lib_Notifications_NotificationServiceBody = z.object({ service: notificationServiceSchema }).loose();

/**
 * Notifications - Default Dependencies.
 *
 * Sends real requests with fetch and real email through SMTP.
 * Tests pass their own dependencies instead.
 *
 * @since 4.0.0
 */
const defaultDependencies: Lib_Notifications_DefaultDependencies = {
  fetch: (input, init) => fetch(input, init),
  sendMail,
};

/**
 * Notifications - Build Event Notification.
 *
 * Turns an event from an app's catalog into a notification with its message and details.
 * The label becomes the title, and the definition sets the priority and tags.
 *
 * @param {Lib_Notifications_BuildEventNotification_Definition} definition - Definition.
 * @param {Lib_Notifications_BuildEventNotification_Message}    message    - Message.
 * @param {Lib_Notifications_BuildEventNotification_Details}    details    - Details.
 * @param {Lib_Notifications_BuildEventNotification_OccurredAt} occurredAt - Occurred at.
 *
 * @returns {Lib_Notifications_BuildEventNotification_Returns}
 *
 * @since 4.0.0
 */
export function buildEventNotification(definition: Lib_Notifications_BuildEventNotification_Definition, message: Lib_Notifications_BuildEventNotification_Message, details: Lib_Notifications_BuildEventNotification_Details = {}, occurredAt: Lib_Notifications_BuildEventNotification_OccurredAt = new Date()): Lib_Notifications_BuildEventNotification_Returns {
  return {
    details,
    event: definition['key'],
    message,
    occurredAt: occurredAt.toISOString(),
    priority: definition['priority'],
    tags: [...definition['tags']],
    title: definition['label'],
  };
}

/**
 * Notifications - Build Notification Payload.
 *
 * Builds the JSON body that webhooks and ntfy-reverse-proxy receive from every app.
 * The shape is the same in all four apps so one interpreter per app can read it.
 *
 * @param {Lib_Notifications_BuildPayload_App}          app          - App.
 * @param {Lib_Notifications_BuildPayload_Notification} notification - Notification.
 *
 * @returns {Lib_Notifications_BuildPayload_Returns}
 *
 * @since 4.0.0
 */
export function buildNotificationPayload(app: Lib_Notifications_BuildPayload_App, notification: Lib_Notifications_BuildPayload_Notification): Lib_Notifications_BuildPayload_Returns {
  return {
    app: app['key'],
    details: notification['details'],
    event: notification['event'],
    message: notification['message'],
    occurredAt: notification['occurredAt'],
    priority: priorityNumbers[notification['priority']],
    tags: notification['tags'],
    title: notification['title'],
    version: 1,
  };
}

/**
 * Notifications - Build Secrets Removed Notification.
 *
 * Describes the secrets a lost key removed, in the same words as the log line.
 * Destinations that needed a removed secret are skipped, so only the others get it.
 *
 * @param {Lib_Notifications_BuildSecretsRemovedNotification_App}     app     - App.
 * @param {Lib_Notifications_BuildSecretsRemovedNotification_KeyTerm} keyTerm - Key term.
 * @param {Lib_Notifications_BuildSecretsRemovedNotification_Items}   items   - Items.
 *
 * @returns {Lib_Notifications_BuildSecretsRemovedNotification_Returns}
 *
 * @since 4.0.0
 */
export function buildSecretsRemovedNotification(app: Lib_Notifications_BuildSecretsRemovedNotification_App, keyTerm: Lib_Notifications_BuildSecretsRemovedNotification_KeyTerm, items: Lib_Notifications_BuildSecretsRemovedNotification_Items): Lib_Notifications_BuildSecretsRemovedNotification_Returns {
  return buildEventNotification(commonNotificationEvents[0]!, `${app['name']} started without its ${keyTerm}, so it made a new one. Enter these again: ${items.join(', ')}.`, { items });
}

/**
 * Notifications - Build Sign In Locked Notification.
 *
 * Reports the address that reached the failed sign-in limit.
 * Each address is reported once per 15-minute window by the caller.
 *
 * @param {Lib_Notifications_BuildSignInLockedNotification_Address} address - Address.
 *
 * @returns {Lib_Notifications_BuildSignInLockedNotification_Returns}
 *
 * @since 4.0.0
 */
export function buildSignInLockedNotification(address: Lib_Notifications_BuildSignInLockedNotification_Address): Lib_Notifications_BuildSignInLockedNotification_Returns {
  return buildEventNotification(commonNotificationEvents[1]!, `Ten failed sign-ins from ${address}. Sign-in from it is paused for 15 minutes.`, { address });
}

/**
 * Notifications - Build Test Notification.
 *
 * Builds the message the Send test button delivers to one destination.
 * It isn't an event, so destinations can't subscribe to it.
 *
 * @param {Lib_Notifications_BuildTestNotification_App} app - App.
 *
 * @returns {Lib_Notifications_BuildTestNotification_Returns}
 *
 * @since 4.0.0
 */
export function buildTestNotification(app: Lib_Notifications_BuildTestNotification_App): Lib_Notifications_BuildTestNotification_Returns {
  return {
    details: {},
    event: 'test',
    message: `This is a test from ${app['name']}. Alerts for the events you chose will look like this.`,
    occurredAt: new Date().toISOString(),
    priority: 'default',
    tags: ['bell'],
    title: 'Test notification',
  };
}

/**
 * Notifications - Notification Events Schema.
 *
 * Validates the events a destination listens to against the app's catalog.
 * At least one event is required, and each can appear only once.
 *
 * @param {Lib_Notifications_NotificationEventsSchema_Keys} keys - Keys.
 *
 * @returns {Lib_Notifications_NotificationEventsSchema_Returns}
 *
 * @since 4.0.0
 */
export function notificationEventsSchema(keys: Lib_Notifications_NotificationEventsSchema_Keys): Lib_Notifications_NotificationEventsSchema_Returns {
  return z.array(z.string().refine((key) => keys.includes(key), { error: 'Choose events from the list.' }), { error: 'Choose at least one event.' })
    .min(1, 'Choose at least one event.')
    .refine((events) => new Set(events).size === events.length, { error: 'Choose each event only once.' });
}

/**
 * Notifications - Notification Input Schema.
 *
 * Validates the body that adds or edits a destination, with field issues under settings.
 * When editing, the service is fixed, saved secrets can be left blank to keep them,
 * and optional secrets that are saved or missing can be cleared, never with a new value.
 *
 * @param {Lib_Notifications_NotificationInputSchema_Service}           service           - Service.
 * @param {Lib_Notifications_NotificationInputSchema_EventKeys}         eventKeys         - Event keys.
 * @param {Lib_Notifications_NotificationInputSchema_SavedSecretKeys}   savedSecretKeys   - Saved secret keys.
 * @param {Lib_Notifications_NotificationInputSchema_MissingSecretKeys} missingSecretKeys - Missing secret keys.
 *
 * @returns {Lib_Notifications_NotificationInputSchema_Returns}
 *
 * @since 4.0.0
 */
export function notificationInputSchema(service: Lib_Notifications_NotificationInputSchema_Service, eventKeys: Lib_Notifications_NotificationInputSchema_EventKeys, savedSecretKeys: Lib_Notifications_NotificationInputSchema_SavedSecretKeys, missingSecretKeys: Lib_Notifications_NotificationInputSchema_MissingSecretKeys): Lib_Notifications_NotificationInputSchema_Returns {
  const clearableSecretKeys: Lib_Notifications_NotificationInputSchema_ClearableSecretKeys = notificationServices[service]['fields']
    .filter((field) => (
      field['secret'] === true
      && field['required'] === false
      && (
        savedSecretKeys.includes(field['key']) === true
        || missingSecretKeys.includes(field['key']) === true
      )
    ))
    .map((field) => field['key']);

  return z.object({
    clearSecrets: z.array(z.string().refine((key) => clearableSecretKeys.includes(key), { error: 'Choose an optional saved secret.' }), { error: 'Choose an optional saved secret.' })
      .refine((keys) => new Set(keys).size === keys.length, { error: 'Choose each secret only once.' })
      .default([]),
    events: notificationEventsSchema(eventKeys),
    name: notificationNameSchema,
    service: z.literal(service, { error: 'The service can\'t be changed.' }).optional(),
    settings: notificationSettingsSchema(service, savedSecretKeys),
  }).strict().superRefine((input, context) => {
    for (const key of input['clearSecrets']) {
      if (clearableSecretKeys.includes(key) === true && (input['settings'][key] ?? '') !== '') {
        context.addIssue({
          code: 'custom',
          message: 'Enter a new value or clear this field, not both.',
          path: [
            'settings',
            key,
          ],
        });
      }
    }

    return;
  });
}

/**
 * Notifications - Notification Secret Keys.
 *
 * Lists the secret fields of a service, which the lost-key rule removes.
 * Plain fields such as URLs and chat IDs stay when a key is lost.
 *
 * @param {Lib_Notifications_NotificationSecretKeys_Service} service - Service.
 *
 * @returns {Lib_Notifications_NotificationSecretKeys_Returns}
 *
 * @since 4.0.0
 */
export function notificationSecretKeys(service: Lib_Notifications_NotificationSecretKeys_Service): Lib_Notifications_NotificationSecretKeys_Returns {
  return notificationServices[service]['fields'].filter((field) => field['secret'] === true).map((field) => field['key']);
}

/**
 * Notifications - Notification Settings Schema.
 *
 * Builds the schema for one service's fields, with the shared messages.
 * Unknown fields are rejected, and blank optional fields count as not set.
 *
 * @param {Lib_Notifications_NotificationSettingsSchema_Service}         service         - Service.
 * @param {Lib_Notifications_NotificationSettingsSchema_SavedSecretKeys} savedSecretKeys - Saved secret keys.
 *
 * @returns {Lib_Notifications_NotificationSettingsSchema_Returns}
 *
 * @since 4.0.0
 */
export function notificationSettingsSchema(service: Lib_Notifications_NotificationSettingsSchema_Service, savedSecretKeys: Lib_Notifications_NotificationSettingsSchema_SavedSecretKeys): Lib_Notifications_NotificationSettingsSchema_Returns {
  const shape: Lib_Notifications_NotificationSettingsSchema_Shape = {};

  for (const field of notificationServices[service]['fields']) {
    Reflect.set(shape, field['key'], fieldSchema(field, field['secret'] === true && savedSecretKeys.includes(field['key'])));
  }

  return z.object(shape, { error: 'Fill in the service settings.' }).strict();
}

/**
 * Notifications - Send Notification.
 *
 * Delivers one notification to one destination and reports what happened.
 * Every send has a 10-second limit, and a failure is returned instead of thrown.
 *
 * @param {Lib_Notifications_SendNotification_App}          app          - App.
 * @param {Lib_Notifications_SendNotification_Target}       target       - Target.
 * @param {Lib_Notifications_SendNotification_Notification} notification - Notification.
 * @param {Lib_Notifications_SendNotification_Dependencies} dependencies - Dependencies.
 *
 * @returns {Lib_Notifications_SendNotification_Returns}
 *
 * @since 4.0.0
 */
export async function sendNotification(app: Lib_Notifications_SendNotification_App, target: Lib_Notifications_SendNotification_Target, notification: Lib_Notifications_SendNotification_Notification, dependencies: Lib_Notifications_SendNotification_Dependencies = defaultDependencies): Lib_Notifications_SendNotification_Returns {
  try {
    if (target['service'] === 'email') {
      const title: Lib_Notifications_SendNotification_Title = `${app['name']}: ${notification['title']}`;

      await dependencies.sendMail({
        from: target['settings']['from'] ?? '',
        host: target['settings']['host'] ?? '',
        password: target['secrets']['password'] ?? '',
        port: Number(target['settings']['port'] ?? '587'),
        security: target['settings']['security'] ?? 'starttls',
        subject: title,
        text: notification['message'],
        to: (target['settings']['to'] ?? '').split(',').map((address) => address.trim()).filter((address) => address !== ''),
        username: target['settings']['username'] ?? '',
      });

      return { delivered: true };
    }

    const request: Lib_Notifications_SendNotification_Request = buildRequest(app, target, notification);
    const response: Lib_Notifications_SendNotification_Response = await dependencies.fetch(request['url'], {
      body: request['body'],
      headers: request['headers'],
      method: request['method'],
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok === false) {
      return {
        delivered: false,
        message: await describeResponse(response),
      };
    }

    return { delivered: true };
  } catch (error) {
    return {
      delivered: false,
      message: describeError(error),
    };
  }
}

/**
 * Notifications - Split Notification Settings.
 *
 * Separates checked fields into plain settings and secrets to seal.
 * Blank optional values and blank saved secrets are left out.
 *
 * @param {Lib_Notifications_SplitNotificationSettings_Service} service - Service.
 * @param {Lib_Notifications_SplitNotificationSettings_Input}   input   - Input.
 *
 * @returns {Lib_Notifications_SplitNotificationSettings_Returns}
 *
 * @since 4.0.0
 */
export function splitNotificationSettings(service: Lib_Notifications_SplitNotificationSettings_Service, input: Lib_Notifications_SplitNotificationSettings_Input): Lib_Notifications_SplitNotificationSettings_Returns {
  const settings: Lib_Notifications_SplitNotificationSettings_Settings = {};
  const secrets: Lib_Notifications_SplitNotificationSettings_Secrets = {};

  for (const field of notificationServices[service]['fields']) {
    const value: Lib_Notifications_SplitNotificationSettings_Value = input[field['key']];

    if (value === undefined || value === '') {
      continue;
    }

    Reflect.set((field['secret'] === true) ? secrets : settings, field['key'], value);
  }

  return {
    secrets,
    settings,
  };
}

/**
 * Notifications - Build Request.
 *
 * Builds the HTTP request each service expects, from the notification.
 * People see the app name before the title, except in the shared JSON payload.
 *
 * @param {Lib_Notifications_BuildRequest_App}          app          - App.
 * @param {Lib_Notifications_BuildRequest_Target}       target       - Target.
 * @param {Lib_Notifications_BuildRequest_Notification} notification - Notification.
 *
 * @private
 *
 * @returns {Lib_Notifications_BuildRequest_Returns}
 *
 * @since 4.0.0
 */
function buildRequest(app: Lib_Notifications_BuildRequest_App, target: Lib_Notifications_BuildRequest_Target, notification: Lib_Notifications_BuildRequest_Notification): Lib_Notifications_BuildRequest_Returns {
  const title: Lib_Notifications_BuildRequest_Title = `${app['name']}: ${notification['title']}`;
  const settings: Lib_Notifications_BuildRequest_Settings = target['settings'];
  const secrets: Lib_Notifications_BuildRequest_Secrets = target['secrets'];
  const bearer: Lib_Notifications_BuildRequest_Bearer = (secrets['token'] === undefined) ? {} : { Authorization: `Bearer ${secrets['token']}` };

  switch (target['service']) {
    case 'apprise': {
      return {
        body: JSON.stringify({
          body: notification['message'],
          title,
          type: (notification['priority'] === 'high') ? 'warning' : 'info',
          ...((secrets['urls'] === undefined) ? {} : { urls: secrets['urls'] }),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: secrets['url'] ?? '',
      };
    }

    case 'discord': {
      return {
        body: JSON.stringify({
          embeds: [{
            color: (notification['priority'] === 'high') ? parseInt('d04437', 16) : parseInt('2f81f7', 16),
            description: notification['message'],
            timestamp: notification['occurredAt'],
            title,
          }],
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: secrets['webhookUrl'] ?? '',
      };
    }

    case 'gotify': {
      return {
        body: JSON.stringify({
          message: notification['message'],
          priority: {
            default: 5,
            high: 8,
            low: 2,
          }[notification['priority']],
          title,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-Gotify-Key': secrets['token'] ?? '',
        },
        method: 'POST',
        url: `${trimTrailingSlashes(settings['url'] ?? '')}/message`,
      };
    }

    case 'matrix': {
      return {
        body: JSON.stringify({
          body: [
            title,
            notification['message'],
          ].join('\n'),
          msgtype: 'm.text',
        }),
        headers: {
          'Authorization': `Bearer ${secrets['accessToken'] ?? ''}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        url: `${trimTrailingSlashes(settings['homeserverUrl'] ?? '')}/_matrix/client/v3/rooms/${encodeURIComponent(settings['roomId'] ?? '')}/send/m.room.message/${randomUUID()}`,
      };
    }

    case 'ntfy': {
      const topic: Lib_Notifications_NtfyTopic_Returns = ntfyTopic(settings['url'] ?? '');

      return {
        body: JSON.stringify({
          message: notification['message'],
          priority: priorityNumbers[notification['priority']],
          tags: notification['tags'],
          title,
          topic: topic['topic'],
        }),
        headers: {
          'Content-Type': 'application/json',
          ...bearer,
        },
        method: 'POST',
        url: topic['server'],
      };
    }

    case 'pushover': {
      return {
        body: JSON.stringify({
          message: notification['message'],
          priority: {
            default: 0,
            high: 1,
            low: -1,
          }[notification['priority']],
          title,
          token: secrets['appToken'] ?? '',
          user: secrets['userKey'] ?? '',
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: 'https://api.pushover.net/1/messages.json',
      };
    }

    case 'slack': {
      return {
        body: JSON.stringify({
          text: [
            `*${escapeSlack(title)}*`,
            escapeSlack(notification['message']),
          ].join('\n'),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: secrets['webhookUrl'] ?? '',
      };
    }

    case 'telegram': {
      return {
        body: JSON.stringify({
          chat_id: settings['chatId'] ?? '',
          disable_web_page_preview: true,
          text: [
            title,
            '',
            notification['message'],
          ].join('\n'),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        url: `https://api.telegram.org/bot${secrets['botToken'] ?? ''}/sendMessage`,
      };
    }

    default: {
      return {
        body: JSON.stringify(buildNotificationPayload(app, notification)),
        headers: {
          'Content-Type': 'application/json',
          ...bearer,
        },
        method: 'POST',
        url: (target['service'] === 'webhook') ? (secrets['url'] ?? '') : (settings['url'] ?? ''),
      };
    }
  }
}

/**
 * Notifications - Describe Error.
 *
 * Turns a network or mail error into the short reason shown on the destination.
 * A send that took longer than 10 seconds says so in plain words.
 *
 * @param {Lib_Notifications_DescribeError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_Notifications_DescribeError_Returns}
 *
 * @since 4.0.0
 */
function describeError(error: Lib_Notifications_DescribeError_Error): Lib_Notifications_DescribeError_Returns {
  if (
    error instanceof Error
    && (
      error.name === 'TimeoutError'
      || error.name === 'AbortError'
    )
  ) {
    return 'No answer within 10 seconds.';
  }

  return ((error instanceof Error) ? error.message : String(error)).slice(0, 200);
}

/**
 * Notifications - Describe Response.
 *
 * Reports a refused send with its status and the service's own reason when it gives one.
 * The reason is cut short so a long error page can't flood the destination row.
 *
 * @param {Lib_Notifications_DescribeResponse_Response} response - Response.
 *
 * @private
 *
 * @returns {Lib_Notifications_DescribeResponse_Returns}
 *
 * @since 4.0.0
 */
async function describeResponse(response: Lib_Notifications_DescribeResponse_Response): Lib_Notifications_DescribeResponse_Returns {
  let detail: Lib_Notifications_DescribeResponse_Detail = '';

  try {
    const body: Lib_Notifications_DescribeResponse_Body = (await response.text()).trim();

    try {
      const parsed: Lib_Notifications_DescribeResponse_Parsed = JSON.parse(body);

      for (const key of [
        'description',
        'message',
        'error',
      ]) {
        const candidate: Lib_Notifications_DescribeResponse_Candidate = parsed[key];

        if (typeof candidate === 'string' && candidate !== '') {
          detail = candidate;

          break;
        }
      }
    } catch {
      detail = body.split('\n')[0] ?? '';
    }
  } catch {
    detail = '';
  }

  return (detail === '') ? `HTTP ${String(response.status)}` : `HTTP ${String(response.status)}: ${detail.slice(0, 200)}`;
}

/**
 * Notifications - Escape Slack.
 *
 * Escapes the three characters Slack treats as markup in message text.
 * Everything else is sent as written.
 *
 * @param {Lib_Notifications_EscapeSlack_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_EscapeSlack_Returns}
 *
 * @since 4.0.0
 */
function escapeSlack(value: Lib_Notifications_EscapeSlack_Value): Lib_Notifications_EscapeSlack_Returns {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Notifications - Field Schema.
 *
 * Builds the check for one service field with its missing and invalid messages.
 * A saved secret becomes optional, and a blank value keeps it.
 *
 * @param {Lib_Notifications_FieldSchema_Field} field - Field.
 * @param {Lib_Notifications_FieldSchema_Keep}  keep  - Keep.
 *
 * @private
 *
 * @returns {Lib_Notifications_FieldSchema_Returns}
 *
 * @since 4.0.0
 */
function fieldSchema(field: Lib_Notifications_FieldSchema_Field, keep: Lib_Notifications_FieldSchema_Keep): Lib_Notifications_FieldSchema_Returns {
  const missing: Lib_Notifications_FieldSchema_Missing = (field['missing'] === '') ? invalidMessages['text'] : field['missing'];
  const schema: Lib_Notifications_FieldSchema_Schema = z.string({ error: missing })
    .trim()
    .max(field['maximum'], `Use ${String(field['maximum'])} characters or fewer.`)
    .refine((value) => value === '' || isValidField(field['kind'], value), { error: invalidMessages[field['kind']] });

  if (field['required'] === true && keep === false) {
    return schema.refine((value) => value !== '', { error: missing });
  }

  return schema.optional();
}

/**
 * Notifications - Has Whitespace.
 *
 * Checks whether a value contains a space, tab, or line break anywhere.
 * Matrix room IDs can't contain any.
 *
 * @param {Lib_Notifications_HasWhitespace_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_HasWhitespace_Returns}
 *
 * @since 4.0.0
 */
function hasWhitespace(value: Lib_Notifications_HasWhitespace_Value): Lib_Notifications_HasWhitespace_Returns {
  return [...value].some((character) => character.trim() === '');
}

/**
 * Notifications - Is HTTP URL.
 *
 * Checks that a value is an absolute URL with one of the allowed protocols.
 * Credentials in the URL are allowed because some services put tokens there.
 *
 * @param {Lib_Notifications_IsHttpUrl_Value}     value     - Value.
 * @param {Lib_Notifications_IsHttpUrl_Protocols} protocols - Protocols.
 *
 * @private
 *
 * @returns {Lib_Notifications_IsHttpUrl_Returns}
 *
 * @since 4.0.0
 */
function isHttpUrl(value: Lib_Notifications_IsHttpUrl_Value, protocols: Lib_Notifications_IsHttpUrl_Protocols): Lib_Notifications_IsHttpUrl_Returns {
  try {
    const url: Lib_Notifications_IsHttpUrl_Url = new URL(value);

    return protocols.includes(url.protocol) && url.hostname !== '';
  } catch {
    return false;
  }
}

/**
 * Notifications - Is Matrix Room ID.
 *
 * Checks a room ID like !room:example.com.
 * Matrix aliases start with #, but the send endpoint needs the immutable room ID.
 *
 * @param {Lib_Notifications_IsMatrixRoomId_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_IsMatrixRoomId_Returns}
 *
 * @since 4.0.0
 */
function isMatrixRoomId(value: Lib_Notifications_IsMatrixRoomId_Value): Lib_Notifications_IsMatrixRoomId_Returns {
  const colon: Lib_Notifications_IsMatrixRoomId_Colon = value.indexOf(':');

  return (
    value.startsWith('!')
    && colon > 1
    && colon < value.length - 1
    && hasWhitespace(value) === false
  );
}

/**
 * Notifications - Is Port.
 *
 * Checks for a whole port number from 1 to 65535, written without extra characters.
 * Values like 0587 or 5e2 don't count.
 *
 * @param {Lib_Notifications_IsPort_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_IsPort_Returns}
 *
 * @since 4.0.0
 */
function isPort(value: Lib_Notifications_IsPort_Value): Lib_Notifications_IsPort_Returns {
  const port: Lib_Notifications_IsPort_Port = Number(value);

  return (
    Number.isInteger(port)
    && port >= 1
    && port <= 65535
    && String(port) === value
  );
}

/**
 * Notifications - Is Valid Field.
 *
 * Checks one non-blank field value against the rule for its kind.
 * Plain text fields only have a length limit.
 *
 * @param {Lib_Notifications_IsValidField_Kind}  kind  - Kind.
 * @param {Lib_Notifications_IsValidField_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_IsValidField_Returns}
 *
 * @since 4.0.0
 */
function isValidField(kind: Lib_Notifications_IsValidField_Kind, value: Lib_Notifications_IsValidField_Value): Lib_Notifications_IsValidField_Returns {
  switch (kind) {
    case 'discord-webhook': {
      return value.startsWith('https://discord.com/api/webhooks/') || value.startsWith('https://discordapp.com/api/webhooks/');
    }

    case 'email': {
      return emailAddressSchema.safeParse(value)['success'];
    }

    case 'emails': {
      return value.split(',').map((address) => address.trim()).every((address) => emailAddressSchema.safeParse(address)['success']);
    }

    case 'http-url': {
      return isHttpUrl(value, [
        'http:',
        'https:',
      ]);
    }

    case 'https-url': {
      return isHttpUrl(value, ['https:']);
    }

    case 'matrix-room': {
      return isMatrixRoomId(value);
    }

    case 'ntfy-topic-url': {
      return isHttpUrl(value, [
        'http:',
        'https:',
      ]) && ntfyTopic(value)['topic'] !== '';
    }

    case 'port': {
      return isPort(value);
    }

    case 'security': {
      return [
        'none',
        'starttls',
        'tls',
      ].includes(value);
    }

    case 'slack-webhook': {
      return value.startsWith('https://hooks.slack.com/');
    }

    default: {
      return true;
    }
  }
}

/**
 * Notifications - Ntfy Topic.
 *
 * Splits a topic URL into the server address and the topic name.
 * Publishing as JSON to the server keeps non-English titles intact.
 *
 * @param {Lib_Notifications_NtfyTopic_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_NtfyTopic_Returns}
 *
 * @since 4.0.0
 */
function ntfyTopic(value: Lib_Notifications_NtfyTopic_Value): Lib_Notifications_NtfyTopic_Returns {
  try {
    const url: Lib_Notifications_NtfyTopic_Url = new URL(value);
    const segments: Lib_Notifications_NtfyTopic_Segments = url.pathname.split('/').filter((segment) => segment !== '');
    const topic: Lib_Notifications_NtfyTopic_Topic = segments.pop() ?? '';

    url.pathname = `/${segments.join('/')}`;
    url.search = '';
    url.hash = '';

    return {
      server: url.toString(),
      topic: decodeURIComponent(topic),
    };
  } catch {
    return {
      server: '',
      topic: '',
    };
  }
}

/**
 * Notifications - Send Mail.
 *
 * Sends one plain-text email through the destination's SMTP server.
 * Connecting, greeting, and sending each give up after 10 seconds.
 *
 * @param {Lib_Notifications_SendMail_Options} options - Options.
 *
 * @private
 *
 * @returns {Lib_Notifications_SendMail_Returns}
 *
 * @since 4.0.0
 */
async function sendMail(options: Lib_Notifications_SendMail_Options): Lib_Notifications_SendMail_Returns {
  const transport: Lib_Notifications_SendMail_Transport = nodemailer.createTransport({
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    host: options['host'],
    ignoreTLS: options['security'] === 'none',
    port: options['port'],
    requireTLS: options['security'] === 'starttls',
    secure: options['security'] === 'tls',
    socketTimeout: 10_000,
    ...((options['username'] === '') ? {} : {
      auth: {
        pass: options['password'],
        user: options['username'],
      },
    }),
  });

  try {
    await transport.sendMail({
      from: options['from'],
      subject: options['subject'],
      text: options['text'],
      to: options['to'],
    });
  } finally {
    transport.close();
  }

  return;
}

/**
 * Notifications - Trim Trailing Slashes.
 *
 * Removes the slashes at the end of a server URL before a service path is added.
 * The rest of the URL is left as it is.
 *
 * @param {Lib_Notifications_TrimTrailingSlashes_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_Notifications_TrimTrailingSlashes_Returns}
 *
 * @since 4.0.0
 */
function trimTrailingSlashes(value: Lib_Notifications_TrimTrailingSlashes_Value): Lib_Notifications_TrimTrailingSlashes_Returns {
  let end: Lib_Notifications_TrimTrailingSlashes_End = value.length;

  while (end > 0 && value.charAt(end - 1) === '/') {
    end -= 1;
  }

  return value.slice(0, end);
}
