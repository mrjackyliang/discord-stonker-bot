import type { Server as HttpServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import type { PGlite } from '@electric-sql/pglite';
import type { Pool } from 'pg';

import type { Runner as Server } from '../../../server.js';
import type { Tests_Support_Database_TestDatabase } from './database.d.ts';

export type Tests_Support_Harness_Response = {
  body: unknown;
  headers: Headers;
  status: number;
};

export type Tests_Support_Harness_Client = {
  cookies: Map<string, string>;
  request: (method: Tests_Support_Harness_Request_Method, path: Tests_Support_Harness_Request_Path, body?: Tests_Support_Harness_Request_Body, headers?: Tests_Support_Harness_Request_Headers) => Tests_Support_Harness_Request_Returns;
};

export type Tests_Support_Harness_Harness = {
  baseUrl: string;
  close: () => Promise<void>;
  database: PGlite;
  pool: Pool;
};

export type Tests_Support_Harness_CreateClient_BaseUrl = string;
export type Tests_Support_Harness_CreateClient_DefaultHeaders = Record<string, string>;
export type Tests_Support_Harness_CreateClient_Returns = Tests_Support_Harness_Client;
export type Tests_Support_Harness_CreateClient_Cookies = Map<string, string>;

export type Tests_Support_Harness_Request_Method = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
export type Tests_Support_Harness_Request_Path = string;
export type Tests_Support_Harness_Request_Body = string | Uint8Array | Record<string, unknown> | unknown[];
export type Tests_Support_Harness_Request_Headers = Record<string, string>;
export type Tests_Support_Harness_Request_Returns = Promise<Tests_Support_Harness_Response>;
export type Tests_Support_Harness_Request_RequestHeaders = Headers;
export type Tests_Support_Harness_Request_Response = Response;
export type Tests_Support_Harness_Request_Pair = string;
export type Tests_Support_Harness_Request_Name = string;
export type Tests_Support_Harness_Request_Value = string;
export type Tests_Support_Harness_Request_Text = string;

export type Tests_Support_Harness_SeedServer_Pool = Pool;
export type Tests_Support_Harness_SeedServer_ServerId = string;
export type Tests_Support_Harness_SeedServer_Name = string;
export type Tests_Support_Harness_SeedServer_Returns = Promise<void>;

export type Tests_Support_Harness_StartHarness_Returns = Promise<Tests_Support_Harness_Harness>;
export type Tests_Support_Harness_StartHarness_TestDatabase = Tests_Support_Database_TestDatabase;
export type Tests_Support_Harness_StartHarness_WebRoot = string;
export type Tests_Support_Harness_StartHarness_Server = Server;
export type Tests_Support_Harness_StartHarness_HttpServer = HttpServer;
export type Tests_Support_Harness_StartHarness_Address = AddressInfo | string | null;
