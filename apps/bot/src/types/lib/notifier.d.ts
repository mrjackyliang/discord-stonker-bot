import type { Client } from 'discord.js';
import type { Pool } from 'pg';
import type { Mock } from 'vitest';
import type { ZodType } from 'zod';

import type {
  Shared_Job,
  Shared_JsonObject,
} from '../shared.d.ts';
import type { Tests_Support_Database_TestDatabase } from '../tests/support/database.d.ts';
import type {
  Lib_NotificationTargets_CreateNotificationTarget_Returns,
  Lib_NotificationTargets_OpenNotificationTarget_Returns,
} from './notification-targets.d.ts';
import type {
  Lib_Notifications_App,
  Lib_Notifications_EventDefinitions,
  Lib_Notifications_Notification,
  Lib_Notifications_Result,
  Lib_Notifications_Target,
} from './notifications.d.ts';

export type Lib_Notifier_App = Lib_Notifications_App;
export type Lib_Notifier_NotificationEvents = Lib_Notifications_EventDefinitions;
export type Lib_Notifier_JobLabels = Record<string, string>;
export type Lib_Notifier_JobPayload = {
  notification: Lib_Notifications_Notification;
  targetId: string;
};
export type Lib_Notifier_JobPayloadSchema = ZodType<Lib_Notifier_JobPayload>;
export type Lib_Notifier_Send = (app: Lib_Notifications_App, target: Lib_Notifications_Target, notification: Lib_Notifications_Notification) => Promise<Lib_Notifications_Result>;
export type Lib_Notifier_GatewayWatchers = WeakMap<Client, () => void>;
export type Lib_Notifier_Milliseconds = number;
export type Lib_Notifier_JobType = string;

export type Lib_Notifier_DeliverNotificationJob_Pool = Pool;
export type Lib_Notifier_DeliverNotificationJob_CredentialKey = Buffer;
export type Lib_Notifier_DeliverNotificationJob_Payload = Shared_JsonObject;
export type Lib_Notifier_DeliverNotificationJob_Send = Lib_Notifier_Send;
export type Lib_Notifier_DeliverNotificationJob_Returns = Promise<void>;
export type Lib_Notifier_DeliverNotificationJob_JobPayload = Lib_Notifier_JobPayload;
export type Lib_Notifier_DeliverNotificationJob_Delivery = Awaited<Lib_NotificationTargets_OpenNotificationTarget_Returns>;
export type Lib_Notifier_DeliverNotificationJob_Result = Lib_Notifications_Result;

export type Lib_Notifier_FormatDuration_Milliseconds = number;
export type Lib_Notifier_FormatDuration_Returns = string;
export type Lib_Notifier_FormatDuration_Minutes = number;
export type Lib_Notifier_FormatDuration_Hours = number;
export type Lib_Notifier_FormatDuration_RemainingMinutes = number;
export type Lib_Notifier_FormatDuration_MinuteWord = string;
export type Lib_Notifier_FormatDuration_HourWord = string;

export type Lib_Notifier_NotifyBotDisconnected_Pool = Pool;
export type Lib_Notifier_NotifyBotDisconnected_DownSince = Date;
export type Lib_Notifier_NotifyBotDisconnected_Returns = Promise<void>;

export type Lib_Notifier_NotifyBotReconnected_Pool = Pool;
export type Lib_Notifier_NotifyBotReconnected_DownSince = Date;
export type Lib_Notifier_NotifyBotReconnected_UpAt = Date;
export type Lib_Notifier_NotifyBotReconnected_Returns = Promise<void>;

export type Lib_Notifier_NotifyBotSignInFailed_Pool = Pool;
export type Lib_Notifier_NotifyBotSignInFailed_Generation = number;
export type Lib_Notifier_NotifyBotSignInFailed_Reason = string;
export type Lib_Notifier_NotifyBotSignInFailed_Returns = Promise<void>;
export type Lib_Notifier_NotifyBotSignInFailed_Cause = string;

export type Lib_Notifier_NotifyJobFailed_Pool = Pool;
export type Lib_Notifier_NotifyJobFailed_Job = Shared_Job;
export type Lib_Notifier_NotifyJobFailed_ErrorMessage = string;
export type Lib_Notifier_NotifyJobFailed_Returns = Promise<void>;
export type Lib_Notifier_NotifyJobFailed_Label = string;
export type Lib_Notifier_NotifyJobFailed_RuleName = unknown;
export type Lib_Notifier_NotifyJobFailed_Subject = string;

export type Lib_Notifier_NotifySecretsRemoved_Pool = Pool;
export type Lib_Notifier_NotifySecretsRemoved_Items = string[];
export type Lib_Notifier_NotifySecretsRemoved_Returns = Promise<void>;

export type Lib_Notifier_NotifySignInLocked_Pool = Pool;
export type Lib_Notifier_NotifySignInLocked_Key = string;
export type Lib_Notifier_NotifySignInLocked_Now = number;
export type Lib_Notifier_NotifySignInLocked_Returns = Promise<void>;
export type Lib_Notifier_NotifySignInLocked_Address = string;
export type Lib_Notifier_NotifySignInLocked_Window = number;

export type Lib_Notifier_QueueNotification_Pool = Pool;
export type Lib_Notifier_QueueNotification_Notification = Lib_Notifications_Notification;
export type Lib_Notifier_QueueNotification_Occurrence = string;
export type Lib_Notifier_QueueNotification_Returns = Promise<void>;
export type Lib_Notifier_QueueNotification_TargetIds = string[];

export type Lib_Notifier_SendTestNotification_Pool = Pool;
export type Lib_Notifier_SendTestNotification_CredentialKey = Buffer;
export type Lib_Notifier_SendTestNotification_TargetId = string;
export type Lib_Notifier_SendTestNotification_Send = Lib_Notifier_Send;
export type Lib_Notifier_SendTestNotification_Returns = Promise<Lib_Notifications_Result | 'not-found' | 'secrets-missing'>;
export type Lib_Notifier_SendTestNotification_Delivery = Awaited<Lib_NotificationTargets_OpenNotificationTarget_Returns>;
export type Lib_Notifier_SendTestNotification_Result = Lib_Notifications_Result;

export type Lib_Notifier_StopGatewayWatch_Client = Client;
export type Lib_Notifier_StopGatewayWatch_Returns = void;
export type Lib_Notifier_StopGatewayWatch_Stop = (() => void) | undefined;

export type Lib_Notifier_WatchGatewayConnection_Client = Client;
export type Lib_Notifier_WatchGatewayConnection_Pool = Pool;
export type Lib_Notifier_WatchGatewayConnection_GraceMilliseconds = number;
export type Lib_Notifier_WatchGatewayConnection_Returns = void;
export type Lib_Notifier_WatchGatewayConnection_DownSince = Date | undefined;
export type Lib_Notifier_WatchGatewayConnection_Announced = boolean;
export type Lib_Notifier_WatchGatewayConnection_Stopped = boolean;
export type Lib_Notifier_WatchGatewayConnection_Timer = ReturnType<typeof setTimeout> | undefined;
export type Lib_Notifier_WatchGatewayConnection_Report = (error: unknown) => void;
export type Lib_Notifier_WatchGatewayConnection_MarkDown = () => void;
export type Lib_Notifier_WatchGatewayConnection_MarkUp = () => void;
export type Lib_Notifier_WatchGatewayConnection_Stop = () => void;

export type Lib_Notifier_Test_Client = Client;
export type Lib_Notifier_Test_Created = Awaited<Lib_NotificationTargets_CreateNotificationTarget_Returns>;
export type Lib_Notifier_Test_GetTestDatabase_Returns = Tests_Support_Database_TestDatabase;
export type Lib_Notifier_Test_Key = Buffer;
export type Lib_Notifier_Test_ListJobs_Pool = Pool;
export type Lib_Notifier_Test_ListJobs_Returns = Promise<Lib_Notifier_JobPayload[]>;
export type Lib_Notifier_Test_Notification = Lib_Notifications_Notification;
export type Lib_Notifier_Test_Pool = Pool;
export type Lib_Notifier_Test_Send = Mock<Lib_Notifier_Send>;
export type Lib_Notifier_Test_TestDatabase = Tests_Support_Database_TestDatabase | undefined;
export type Lib_Notifier_Test_Jobs = Lib_Notifier_JobPayload[];
export type Lib_Notifier_Test_Wait_Milliseconds = number;
export type Lib_Notifier_Test_Wait_Returns = Promise<void>;
