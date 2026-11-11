import type express from 'express';

import type { Server_Context } from '../server.d.ts';

export type Routes_Health_Runner_Context = Server_Context;
export type Routes_Health_Runner_Constructor_Context = Server_Context;
export type Routes_Health_Runner_Register_App = express.Express;
export type Routes_Health_Runner_Register_Returns = void;

export type Routes_Health_Runner_RouteHealth_Request = express.Request;
export type Routes_Health_Runner_RouteHealth_Response = express.Response;
export type Routes_Health_Runner_RouteHealth_Returns = void;

export type Routes_Health_Runner_RouteReady_Request = express.Request;
export type Routes_Health_Runner_RouteReady_Response = express.Response;
export type Routes_Health_Runner_RouteReady_Returns = Promise<void>;
export type Routes_Health_Runner_RouteReady_Ready = boolean;
