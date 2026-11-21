import { z } from 'zod';

import { Runner as HttpDelivery } from './notifiers/http.js';
import { Runner as NotifierRegistry } from './notifiers/registry.js';

import type {
  Lib_Notifications_BuildEventNotification_Definition,
  Lib_Notifications_BuildEventNotification_Details,
  Lib_Notifications_BuildEventNotification_Message,
  Lib_Notifications_BuildEventNotification_OccurredAt,
  Lib_Notifications_BuildEventNotification_Returns,
  Lib_Notifications_BuildPayload_App,
  Lib_Notifications_BuildPayload_Notification,
  Lib_Notifications_BuildPayload_Returns,
  Lib_Notifications_BuildSecretsRemovedNotification_App,
  Lib_Notifications_BuildSecretsRemovedNotification_Items,
  Lib_Notifications_BuildSecretsRemovedNotification_KeyTerm,
  Lib_Notifications_BuildSecretsRemovedNotification_Returns,
  Lib_Notifications_BuildSignInLockedNotification_Address,
  Lib_Notifications_BuildSignInLockedNotification_Returns,
  Lib_Notifications_BuildTestNotification_App,
  Lib_Notifications_BuildTestNotification_Returns,
  Lib_Notifications_DefaultDependencies,
  Lib_Notifications_EventDefinitions,
  Lib_Notifications_FieldSchema_Field,
  Lib_Notifications_FieldSchema_Keep,
  Lib_Notifications_FieldSchema_Missing,
  Lib_Notifications_FieldSchema_Returns,
  Lib_Notifications_FieldSchema_Schema,
  Lib_Notifications_FieldSchema_Service,
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
  Lib_Notifications_NotificationServices,
  Lib_Notifications_NotificationServiceSchema,
  Lib_Notifications_NotificationSettingsSchema_Returns,
  Lib_Notifications_NotificationSettingsSchema_SavedSecretKeys,
  Lib_Notifications_NotificationSettingsSchema_Service,
  Lib_Notifications_NotificationSettingsSchema_Shape,
  Lib_Notifications_PriorityNumbers,
  Lib_Notifications_SendNotification_App,
  Lib_Notifications_SendNotification_Dependencies,
  Lib_Notifications_SendNotification_Notification,
  Lib_Notifications_SendNotification_Notifier,
  Lib_Notifications_SendNotification_Payload,
  Lib_Notifications_SendNotification_Returns,
  Lib_Notifications_SendNotification_Target,
  Lib_Notifications_SplitNotificationSettings_Input,
  Lib_Notifications_SplitNotificationSettings_Returns,
  Lib_Notifications_SplitNotificationSettings_Secrets,
  Lib_Notifications_SplitNotificationSettings_Service,
  Lib_Notifications_SplitNotificationSettings_Settings,
  Lib_Notifications_SplitNotificationSettings_Value,
} from '../types/lib/notifications.d.ts';

/**
 * Notifications - Notification Services.
 *
 * Lists the fields each service needs and which of them are secret.
 * Each project-owned adapter supplies its own metadata and validation rules.
 *
 * @since 4.0.0
 */
export const notificationServices: Lib_Notifications_NotificationServices = NotifierRegistry.getDefinitions();

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
const defaultDependencies: Lib_Notifications_DefaultDependencies = NotifierRegistry.getDefaultDependencies();

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
 * When editing, saved secrets can stay blank or optional ones can be cleared.
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
    for (const key of input['clearSecrets'] ?? []) {
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
 * Builds the schema for one service's fields, with the adapter's validation rules.
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
    Reflect.set(shape, field['key'], fieldSchema(service, field, field['secret'] === true && savedSecretKeys.includes(field['key'])));
  }

  return z.object(shape, { error: 'Fill in the service settings.' }).strict();
}

/**
 * Notifications - Send Notification.
 *
 * Delivers one notification through the adapter for its destination.
 * Every send keeps the existing timeout and returns failures instead of throwing.
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
  const payload: Lib_Notifications_SendNotification_Payload = {
    notification,
    title: `${app['name']}: ${notification['title']}`,
    webhook: buildNotificationPayload(app, notification),
  };
  try {
    const notifier: Lib_Notifications_SendNotification_Notifier = NotifierRegistry.create(target);

    return await notifier.send(payload, dependencies);
  } catch (error) {
    return {
      delivered: false,
      message: HttpDelivery.describeError(error),
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
 * Notifications - Field Schema.
 *
 * Builds one field check while its service adapter owns the actual rule and words.
 * A saved secret becomes optional, and a blank value keeps it.
 *
 * @param {Lib_Notifications_FieldSchema_Service} service - Service.
 * @param {Lib_Notifications_FieldSchema_Field}   field   - Field.
 * @param {Lib_Notifications_FieldSchema_Keep}    keep    - Keep.
 *
 * @private
 *
 * @returns {Lib_Notifications_FieldSchema_Returns}
 *
 * @since 4.0.0
 */
function fieldSchema(service: Lib_Notifications_FieldSchema_Service, field: Lib_Notifications_FieldSchema_Field, keep: Lib_Notifications_FieldSchema_Keep): Lib_Notifications_FieldSchema_Returns {
  const missing: Lib_Notifications_FieldSchema_Missing = (field['missing'] === '') ? field['invalid'] : field['missing'];
  const schema: Lib_Notifications_FieldSchema_Schema = z.string({ error: missing })
    .trim()
    .max(field['maximum'], `Use ${String(field['maximum'])} characters or fewer.`)
    .refine((value) => value === '' || NotifierRegistry.validate(service, field['key'], value), { error: field['invalid'] });

  if (field['required'] === true && keep === false) {
    return schema.refine((value) => value !== '', { error: missing });
  }

  return schema.optional();
}
