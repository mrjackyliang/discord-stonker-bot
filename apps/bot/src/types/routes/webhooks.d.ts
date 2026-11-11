import type express from 'express';

import type {
  Lib_WebApplicationFeatures_PublicRoute,
  Lib_WebApplicationFeatures_Runtime,
  Lib_WebApplicationFeatures_WebhookRoute,
} from '../lib/web-application-features.d.ts';
import type { Server_Context } from '../server.d.ts';
import type { Shared_BotRuntimeControl } from '../shared.d.ts';

export type Routes_Webhooks_Runner_Context = Server_Context;
export type Routes_Webhooks_Runner_Constructor_Context = Server_Context;
export type Routes_Webhooks_Runner_Register_App = express.Express;
export type Routes_Webhooks_Runner_Register_Returns = void;

export type Routes_Webhooks_Runner_RouteWebhook_Request = express.Request;
export type Routes_Webhooks_Runner_RouteWebhook_Response = express.Response;
export type Routes_Webhooks_Runner_RouteWebhook_Returns = Promise<void>;
export type Routes_Webhooks_Runner_RouteWebhook_PublicRoute = Lib_WebApplicationFeatures_PublicRoute | undefined;
export type Routes_Webhooks_Runner_RouteWebhook_Runtime = Lib_WebApplicationFeatures_Runtime | undefined;
export type Routes_Webhooks_Runner_RouteWebhook_Route = Lib_WebApplicationFeatures_WebhookRoute | undefined;
export type Routes_Webhooks_Runner_RouteWebhook_Control = Shared_BotRuntimeControl;
export type Routes_Webhooks_Runner_RouteWebhook_Body = string;
export type Routes_Webhooks_Runner_RouteWebhook_Signature = string;
export type Routes_Webhooks_Runner_RouteWebhook_Timestamp = string;
export type Routes_Webhooks_Runner_RouteWebhook_ParsedBody = unknown;
export type Routes_Webhooks_Runner_RouteWebhook_Content = string;
export type Routes_Webhooks_Runner_RouteWebhook_DedupeDigest = string;
export type Routes_Webhooks_Runner_RouteWebhook_DedupeKey = string;
export type Routes_Webhooks_Runner_RouteWebhook_Enqueued = boolean;

export type Routes_Webhooks_Runner_SendText_Response = express.Response;
export type Routes_Webhooks_Runner_SendText_Status = number;
export type Routes_Webhooks_Runner_SendText_Message = string;
export type Routes_Webhooks_Runner_SendText_Returns = void;

export type Routes_Webhooks_Runner_SetPublicHeaders_Response = express.Response;
export type Routes_Webhooks_Runner_SetPublicHeaders_Returns = void;
