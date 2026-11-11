import type express from 'express';

import type { Server_Context } from '../server.d.ts';

export type Routes_Web_Runner_Root = string;
export type Routes_Web_Runner_Constructor_Context = Server_Context;
export type Routes_Web_Runner_Register_App = express.Express;
export type Routes_Web_Runner_Register_Returns = void;

export type Routes_Web_Runner_AllowCaching_Request = express.Request;
export type Routes_Web_Runner_AllowCaching_Response = express.Response;
export type Routes_Web_Runner_AllowCaching_Next = express.NextFunction;
export type Routes_Web_Runner_AllowCaching_Returns = void;

export type Routes_Web_Runner_ConsoleHeaders_Request = express.Request;
export type Routes_Web_Runner_ConsoleHeaders_Response = express.Response;
export type Routes_Web_Runner_ConsoleHeaders_Next = express.NextFunction;
export type Routes_Web_Runner_ConsoleHeaders_Returns = void;

export type Routes_Web_Runner_SendApplication_Request = express.Request;
export type Routes_Web_Runner_SendApplication_Response = express.Response;
export type Routes_Web_Runner_SendApplication_Next = express.NextFunction;
export type Routes_Web_Runner_SendApplication_Returns = void;
export type Routes_Web_Runner_SendApplication_IndexPath = string;
