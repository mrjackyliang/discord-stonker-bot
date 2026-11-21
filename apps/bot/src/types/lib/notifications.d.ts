import type {
  ZodString,
  ZodType,
} from 'zod';

import type {
  Shared_Notifier,
  Shared_NotifierPayload,
} from '../shared.d.ts';

export type Lib_Notifications_Service = 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';
export type Lib_Notifications_Priority = 'default' | 'high' | 'low';
export type Lib_Notifications_FieldKind = 'discord-webhook' | 'email' | 'emails' | 'http-url' | 'https-url' | 'matrix-room' | 'ntfy-topic-url' | 'port' | 'security' | 'slack-webhook' | 'text';
export type Lib_Notifications_Field = {
  invalid: string;
  key: string;
  kind: Lib_Notifications_FieldKind;
  maximum: number;
  missing: string;
  required: boolean;
  secret: boolean;
};
export type Lib_Notifications_ServiceDefinition = {
  fields: Lib_Notifications_Field[];
  label: string;
};
export type Lib_Notifications_ServiceDefinitions = Record<Lib_Notifications_Service, Lib_Notifications_ServiceDefinition>;
export type Lib_Notifications_NotificationServices = Lib_Notifications_ServiceDefinitions;
export type Lib_Notifications_EventDefinition = {
  defaultEnabled: boolean;
  description: string;
  key: string;
  label: string;
  priority: Lib_Notifications_Priority;
  tags: string[];
};
export type Lib_Notifications_EventDefinitions = Lib_Notifications_EventDefinition[];
export type Lib_Notifications_App = {
  key: string;
  name: string;
};
export type Lib_Notifications_Details = Record<string, unknown>;
export type Lib_Notifications_Notification = {
  details: Lib_Notifications_Details;
  event: string;
  message: string;
  occurredAt: string;
  priority: Lib_Notifications_Priority;
  tags: string[];
  title: string;
};
export type Lib_Notifications_Values = Record<string, string>;
export type Lib_Notifications_Target = {
  secrets: Lib_Notifications_Values;
  service: Lib_Notifications_Service;
  settings: Lib_Notifications_Values;
};
export type Lib_Notifications_Result = {
  delivered: true;
} | {
  delivered: false;
  message: string;
};
export type Lib_Notifications_Payload = {
  app: string;
  details: Lib_Notifications_Details;
  event: string;
  message: string;
  occurredAt: string;
  priority: number;
  tags: string[];
  title: string;
  version: 1;
};
export type Lib_Notifications_MailOptions = {
  from: string;
  host: string;
  password: string;
  port: number;
  security: string;
  subject: string;
  text: string;
  to: string[];
  username: string;
};
export type Lib_Notifications_HttpRequest = {
  body: string;
  headers: Record<string, string>;
  method: 'POST' | 'PUT';
  url: string;
};
export type Lib_Notifications_Dependencies = {
  fetch: (url: string, init: RequestInit) => Promise<Response>;
  sendMail: (options: Lib_Notifications_MailOptions) => Promise<void>;
};
export type Lib_Notifications_Input = {
  clearSecrets: string[];
  events: string[];
  name: string;
  service?: string | undefined;
  settings: Record<string, string | undefined>;
};
export type Lib_Notifications_PriorityNumbers = Record<Lib_Notifications_Priority, number>;

export type Lib_Notifications_BuildEventNotification_Definition = Lib_Notifications_EventDefinition;
export type Lib_Notifications_BuildEventNotification_Message = string;
export type Lib_Notifications_BuildEventNotification_Details = Lib_Notifications_Details;
export type Lib_Notifications_BuildEventNotification_OccurredAt = Date;
export type Lib_Notifications_BuildEventNotification_Returns = Lib_Notifications_Notification;

export type Lib_Notifications_BuildPayload_App = Lib_Notifications_App;
export type Lib_Notifications_BuildPayload_Notification = Lib_Notifications_Notification;
export type Lib_Notifications_BuildPayload_Returns = Lib_Notifications_Payload;

export type Lib_Notifications_BuildSecretsRemovedNotification_App = Lib_Notifications_App;
export type Lib_Notifications_BuildSecretsRemovedNotification_KeyTerm = string;
export type Lib_Notifications_BuildSecretsRemovedNotification_Items = string[];
export type Lib_Notifications_BuildSecretsRemovedNotification_Returns = Lib_Notifications_Notification;

export type Lib_Notifications_BuildSignInLockedNotification_Address = string;
export type Lib_Notifications_BuildSignInLockedNotification_Returns = Lib_Notifications_Notification;

export type Lib_Notifications_BuildTestNotification_App = Lib_Notifications_App;
export type Lib_Notifications_BuildTestNotification_Returns = Lib_Notifications_Notification;

export type Lib_Notifications_DefaultDependencies = Lib_Notifications_Dependencies;

export type Lib_Notifications_FieldSchema_Service = Lib_Notifications_Service;
export type Lib_Notifications_FieldSchema_Field = Lib_Notifications_Field;
export type Lib_Notifications_FieldSchema_Keep = boolean;
export type Lib_Notifications_FieldSchema_Returns = ZodType<string | undefined>;
export type Lib_Notifications_FieldSchema_Missing = string;
export type Lib_Notifications_FieldSchema_Schema = ZodString;

export type Lib_Notifications_NotificationEventsSchema_Keys = string[];
export type Lib_Notifications_NotificationEventsSchema_Returns = ZodType<string[]>;

export type Lib_Notifications_NotificationInputSchema_Service = Lib_Notifications_Service;
export type Lib_Notifications_NotificationInputSchema_EventKeys = string[];
export type Lib_Notifications_NotificationInputSchema_SavedSecretKeys = string[];
export type Lib_Notifications_NotificationInputSchema_MissingSecretKeys = string[];
export type Lib_Notifications_NotificationInputSchema_Returns = ZodType<Lib_Notifications_Input>;
export type Lib_Notifications_NotificationInputSchema_ClearableSecretKeys = string[];

export type Lib_Notifications_NotificationNameSchema = ZodType<string>;

export type Lib_Notifications_NotificationSecretKeys_Service = Lib_Notifications_Service;
export type Lib_Notifications_NotificationSecretKeys_Returns = string[];

export type Lib_Notifications_NotificationServiceBody = ZodType<{
  service: Lib_Notifications_Service;
}>;

export type Lib_Notifications_NotificationServiceSchema = ZodType<Lib_Notifications_Service>;

export type Lib_Notifications_NotificationSettingsSchema_Service = Lib_Notifications_Service;
export type Lib_Notifications_NotificationSettingsSchema_SavedSecretKeys = string[];
export type Lib_Notifications_NotificationSettingsSchema_Returns = ZodType<Record<string, string | undefined>>;
export type Lib_Notifications_NotificationSettingsSchema_Shape = Record<string, ZodType<string | undefined>>;

export type Lib_Notifications_SendNotification_App = Lib_Notifications_App;
export type Lib_Notifications_SendNotification_Target = Lib_Notifications_Target;
export type Lib_Notifications_SendNotification_Notification = Lib_Notifications_Notification;
export type Lib_Notifications_SendNotification_Dependencies = Lib_Notifications_Dependencies;
export type Lib_Notifications_SendNotification_Returns = Promise<Lib_Notifications_Result>;
export type Lib_Notifications_SendNotification_Payload = Shared_NotifierPayload;
export type Lib_Notifications_SendNotification_Notifier = Shared_Notifier;

export type Lib_Notifications_Test_App = Lib_Notifications_App;
export type Lib_Notifications_Test_Dependencies = Lib_Notifications_Dependencies;
export type Lib_Notifications_Test_Notification = Lib_Notifications_Notification;
export type Lib_Notifications_Test_Reason = string;
export type Lib_Notifications_Test_Result = ReturnType<Lib_Notifications_NotificationInputSchema_Returns['safeParse']>;
export type Lib_Notifications_Test_ServiceResult = ReturnType<Lib_Notifications_NotificationServiceBody['safeParse']>;

export type Lib_Notifications_SplitNotificationSettings_Service = Lib_Notifications_Service;
export type Lib_Notifications_SplitNotificationSettings_Input = Record<string, string | undefined>;
export type Lib_Notifications_SplitNotificationSettings_Returns = {
  secrets: Lib_Notifications_Values;
  settings: Lib_Notifications_Values;
};
export type Lib_Notifications_SplitNotificationSettings_Settings = Lib_Notifications_Values;
export type Lib_Notifications_SplitNotificationSettings_Secrets = Lib_Notifications_Values;
export type Lib_Notifications_SplitNotificationSettings_Value = string | undefined;
