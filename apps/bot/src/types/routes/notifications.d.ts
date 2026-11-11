import type express from 'express';

import type {
  notificationInputSchema,
  notificationServiceBody,
} from '../../lib/notifications.js';
import type {
  Lib_NotificationTargets_CreateNotificationTarget_Returns,
  Lib_NotificationTargets_GetNotificationTarget_Returns,
  Lib_NotificationTargets_RemoveNotificationTarget_Returns,
  Lib_NotificationTargets_UpdateNotificationTarget_Returns,
} from '../lib/notification-targets.d.ts';
import type { Lib_Notifications_SplitNotificationSettings_Returns } from '../lib/notifications.d.ts';
import type { Lib_Notifier_SendTestNotification_Returns } from '../lib/notifier.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type { Shared_Principal } from '../shared.d.ts';

export type Routes_Notifications_Runner_Access = Server_Access;
export type Routes_Notifications_Runner_Context = Server_Context;

export type Routes_Notifications_Runner_Constructor_Context = Server_Context;
export type Routes_Notifications_Runner_Constructor_Access = Server_Access;

export type Routes_Notifications_Runner_Register_App = express.Express;
export type Routes_Notifications_Runner_Register_Returns = void;

export type Routes_Notifications_Runner_EventKeys_Returns = string[];

export type Routes_Notifications_Runner_GetNotificationId_Request = express.Request;
export type Routes_Notifications_Runner_GetNotificationId_Returns = string | undefined;
export type Routes_Notifications_Runner_GetNotificationId_NotificationId = unknown;

export type Routes_Notifications_Runner_RouteCreate_Request = express.Request;
export type Routes_Notifications_Runner_RouteCreate_Response = express.Response;
export type Routes_Notifications_Runner_RouteCreate_Returns = Promise<void>;
export type Routes_Notifications_Runner_RouteCreate_ServiceBody = ReturnType<typeof notificationServiceBody.safeParse>;
export type Routes_Notifications_Runner_RouteCreate_RequestBody = ReturnType<ReturnType<typeof notificationInputSchema>['safeParse']>;
export type Routes_Notifications_Runner_RouteCreate_Split = Lib_Notifications_SplitNotificationSettings_Returns;
export type Routes_Notifications_Runner_RouteCreate_Result = Awaited<Lib_NotificationTargets_CreateNotificationTarget_Returns>;
export type Routes_Notifications_Runner_RouteCreate_Principal = Shared_Principal;

export type Routes_Notifications_Runner_RouteDelete_Request = express.Request;
export type Routes_Notifications_Runner_RouteDelete_Response = express.Response;
export type Routes_Notifications_Runner_RouteDelete_Returns = Promise<void>;
export type Routes_Notifications_Runner_RouteDelete_NotificationId = string | undefined;
export type Routes_Notifications_Runner_RouteDelete_Name = Awaited<Lib_NotificationTargets_RemoveNotificationTarget_Returns>;
export type Routes_Notifications_Runner_RouteDelete_Principal = Shared_Principal;

export type Routes_Notifications_Runner_RouteEvents_Request = express.Request;
export type Routes_Notifications_Runner_RouteEvents_Response = express.Response;
export type Routes_Notifications_Runner_RouteEvents_Returns = void;

export type Routes_Notifications_Runner_RouteList_Request = express.Request;
export type Routes_Notifications_Runner_RouteList_Response = express.Response;
export type Routes_Notifications_Runner_RouteList_Returns = Promise<void>;

export type Routes_Notifications_Runner_RouteTest_Request = express.Request;
export type Routes_Notifications_Runner_RouteTest_Response = express.Response;
export type Routes_Notifications_Runner_RouteTest_Returns = Promise<void>;
export type Routes_Notifications_Runner_RouteTest_NotificationId = string | undefined;
export type Routes_Notifications_Runner_RouteTest_Result = Awaited<Lib_Notifier_SendTestNotification_Returns>;

export type Routes_Notifications_Runner_RouteUpdate_Request = express.Request;
export type Routes_Notifications_Runner_RouteUpdate_Response = express.Response;
export type Routes_Notifications_Runner_RouteUpdate_Returns = Promise<void>;
export type Routes_Notifications_Runner_RouteUpdate_NotificationId = string | undefined;
export type Routes_Notifications_Runner_RouteUpdate_ExistingTarget = Awaited<Lib_NotificationTargets_GetNotificationTarget_Returns>;
export type Routes_Notifications_Runner_RouteUpdate_RequestBody = ReturnType<ReturnType<typeof notificationInputSchema>['safeParse']>;
export type Routes_Notifications_Runner_RouteUpdate_Split = Lib_Notifications_SplitNotificationSettings_Returns;
export type Routes_Notifications_Runner_RouteUpdate_Result = Awaited<Lib_NotificationTargets_UpdateNotificationTarget_Returns>;
export type Routes_Notifications_Runner_RouteUpdate_Principal = Shared_Principal;

export type Routes_Notifications_Runner_SendNameTaken_Response = express.Response;
export type Routes_Notifications_Runner_SendNameTaken_Returns = void;

export type Routes_Notifications_Runner_SendNotFound_Response = express.Response;
export type Routes_Notifications_Runner_SendNotFound_Returns = void;
