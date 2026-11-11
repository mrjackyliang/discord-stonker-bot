import type express from 'express';
import type { ZodSafeParseResult } from 'zod';

import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_BotRuntimeControl,
  Shared_Principal,
  Shared_RuntimeHeartbeat,
} from '../shared.d.ts';

export type Routes_Bot_StaleHeartbeatMilliseconds = number;
export type Routes_Bot_Action = 'restart' | 'start' | 'stop';

export type Routes_Bot_Service_Component = string;
export type Routes_Bot_Service_Status = string | null;
export type Routes_Bot_Service_UpdatedAt = string | null;
export type Routes_Bot_Service = {
  component: Routes_Bot_Service_Component;
  status: Routes_Bot_Service_Status;
  updatedAt: Routes_Bot_Service_UpdatedAt;
};

export type Routes_Bot_Description = {
  activeFeatures: string[];
  addServerUrl: string | null;
  applicationId: string | null;
  configurationErrors: string[];
  desiredState: Shared_BotRuntimeControl['desiredState'];
  guildCount: number | null;
  resolution: string | null;
  services: Routes_Bot_Service[];
  status: string;
  tokenConfigured: boolean;
  userTag: string | null;
};

export type Routes_Bot_DescribeBot_RuntimeControl = Shared_BotRuntimeControl;
export type Routes_Bot_DescribeBot_Heartbeats = Shared_RuntimeHeartbeat[];
export type Routes_Bot_DescribeBot_Returns = Routes_Bot_Description;
export type Routes_Bot_DescribeBot_BotHeartbeat = Shared_RuntimeHeartbeat | undefined;
export type Routes_Bot_DescribeBot_Details = Record<string, unknown>;
export type Routes_Bot_DescribeBot_Age = number;
export type Routes_Bot_DescribeBot_ObservedAt = string;
export type Routes_Bot_DescribeBot_Status = string;
export type Routes_Bot_DescribeBot_UserTag = string | null;
export type Routes_Bot_DescribeBot_GuildCount = number | null;
export type Routes_Bot_DescribeBot_Resolution = string | null;
export type Routes_Bot_DescribeBot_ActiveFeatures = string[];
export type Routes_Bot_DescribeBot_ConfigurationErrors = string[];
export type Routes_Bot_DescribeBot_ApplicationId = string | null;

export type Routes_Bot_ReadStringList_Value = unknown;
export type Routes_Bot_ReadStringList_Returns = string[];

export type Routes_Bot_IsText_Value = unknown;
export type Routes_Bot_IsText_Text = string;
export type Routes_Bot_IsText_Returns = boolean;

export type Routes_Bot_Runner_Access = Server_Access;
export type Routes_Bot_Runner_Context = Server_Context;
export type Routes_Bot_Runner_Constructor_Context = Server_Context;
export type Routes_Bot_Runner_Constructor_Access = Server_Access;
export type Routes_Bot_Runner_Register_App = express.Express;
export type Routes_Bot_Runner_Register_Returns = void;

export type Routes_Bot_Runner_RouteAction_Request = express.Request;
export type Routes_Bot_Runner_RouteAction_Response = express.Response;
export type Routes_Bot_Runner_RouteAction_Returns = Promise<void>;
export type Routes_Bot_Runner_RouteAction_Body = ZodSafeParseResult<{
  action: Routes_Bot_Action;
}>;
export type Routes_Bot_Runner_RouteAction_Accepted = boolean;
export type Routes_Bot_Runner_RouteAction_Principal = Shared_Principal;
export type Routes_Bot_Runner_RouteAction_RuntimeControl = Shared_BotRuntimeControl;

export type Routes_Bot_Runner_RouteStatus_Request = express.Request;
export type Routes_Bot_Runner_RouteStatus_Response = express.Response;
export type Routes_Bot_Runner_RouteStatus_Returns = Promise<void>;
export type Routes_Bot_Runner_RouteStatus_RuntimeControl = Shared_BotRuntimeControl;
export type Routes_Bot_Runner_RouteStatus_Heartbeats = Shared_RuntimeHeartbeat[];

export type Routes_Bot_Runner_RouteToken_Request = express.Request;
export type Routes_Bot_Runner_RouteToken_Response = express.Response;
export type Routes_Bot_Runner_RouteToken_Returns = Promise<void>;
export type Routes_Bot_Runner_RouteToken_Body = ZodSafeParseResult<{
  token: string;
}>;
export type Routes_Bot_Runner_RouteToken_Principal = Shared_Principal;
