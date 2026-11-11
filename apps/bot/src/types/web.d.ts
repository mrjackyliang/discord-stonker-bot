import type { Server as HttpServer } from 'node:http';

import type { Pool } from 'pg';

import type { Runner as Server } from '../server.js';
import type {
  Shared_JsonObject,
  Shared_RuntimeConfiguration,
} from './shared.d.ts';

export type Web_CloseServer_Server = HttpServer;
export type Web_CloseServer_Returns = Promise<void>;

export type Web_Listen_Server = HttpServer;
export type Web_Listen_Host = string | undefined;
export type Web_Listen_Port = number;
export type Web_Listen_Returns = Promise<void>;

export type Web_Main_Returns = Promise<void>;
export type Web_Main_Configuration = Shared_RuntimeConfiguration;
export type Web_Main_Pool = Pool;
export type Web_Main_CredentialKey = Buffer;
export type Web_Main_StarterConfigurationPath = string;
export type Web_Main_StarterConfiguration = string;
export type Web_Main_StarterSettings = Shared_JsonObject;
export type Web_Main_WebRoot = string;
export type Web_Main_Server = Server;
export type Web_Main_HttpServer = HttpServer;
export type Web_Main_BoundAddress = ReturnType<HttpServer['address']>;
export type Web_Main_SetupClaim = {
  code: string;
  expiresAt: string;
} | undefined;
export type Web_Main_HeartbeatTimer = ReturnType<typeof setInterval>;
export type Web_Main_StopDebugLogging = () => void;

export type Web_Run_Returns = Promise<void>;
