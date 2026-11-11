import type { Mock } from 'vitest';

import type {
  Lib_Notifications_App,
  Lib_Notifications_Notification,
  Lib_Notifications_Result,
  Lib_Notifications_Target,
} from '../../lib/notifications.d.ts';
import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';

export type Tests_Routes_Notifications_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Notifications_BaseUrl = string;
export type Tests_Routes_Notifications_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Notifications_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Notifications_NotificationId = string;
export type Tests_Routes_Notifications_Plaintext = string;
export type Tests_Routes_Notifications_Mocks = {
  send: Mock<(app: Lib_Notifications_App, target: Lib_Notifications_Target, notification: Lib_Notifications_Notification) => Promise<Lib_Notifications_Result>>;
};
export type Tests_Routes_Notifications_Module = typeof import('../../../lib/notifications.js');
