import type express from 'express';
import type { RateLimitRequestHandler } from 'express-rate-limit';
import type { Pool } from 'pg';

import type { Runner as Access } from '../lib/access.js';
import type { Runner as Attempts } from '../lib/attempts.js';
import type {
  Shared_JsonObject,
  Shared_RuntimeConfiguration,
} from './shared.d.ts';

export type Server_Context_Configuration = Shared_RuntimeConfiguration;
export type Server_Context_CredentialKey = Buffer;
export type Server_Context_Pool = Pool;
export type Server_Context_StarterSettings = Shared_JsonObject;
export type Server_Context_WebRoot = string;
export type Server_Context = {
  configuration: Server_Context_Configuration;
  credentialKey: Server_Context_CredentialKey;
  pool: Server_Context_Pool;
  starterSettings: Server_Context_StarterSettings;
  webRoot: Server_Context_WebRoot;
};

export type Server_Access = Access;
export type Server_Attempts = Attempts;

export type Server_Runner_App = express.Express;
export type Server_Runner_Context = Server_Context;
export type Server_Runner_LargeBodyPaths = string[];
export type Server_Runner_Constructor_Context = Server_Context;
export type Server_Runner_GetApplication_Returns = express.Express;

export type Server_Runner_AddMiddleware_Returns = void;
export type Server_Runner_AddMiddleware_ApiLimiter = RateLimitRequestHandler;
export type Server_Runner_AddMiddleware_LargeJsonParser = express.RequestHandler;
export type Server_Runner_AddMiddleware_SmallJsonParser = express.RequestHandler;
export type Server_Runner_AddMiddleware_WebhookBodyParser = express.RequestHandler;

export type Server_Runner_BaseHeaders_Request = express.Request;
export type Server_Runner_BaseHeaders_Response = express.Response;
export type Server_Runner_BaseHeaders_Next = express.NextFunction;
export type Server_Runner_BaseHeaders_Returns = void;

export type Server_Runner_HandleError_Error = unknown;
export type Server_Runner_HandleError_Request = express.Request;
export type Server_Runner_HandleError_Response = express.Response;
export type Server_Runner_HandleError_Next = express.NextFunction;
export type Server_Runner_HandleError_Returns = void;
export type Server_Runner_HandleError_Type = unknown;

export type Server_Runner_HandleNotFound_Request = express.Request;
export type Server_Runner_HandleNotFound_Response = express.Response;
export type Server_Runner_HandleNotFound_Returns = void;

export type Server_Runner_RegisterRoutes_Returns = void;
export type Server_Runner_RegisterRoutes_Access = Access;
export type Server_Runner_RegisterRoutes_Attempts = Attempts;
