import { randomBytes } from 'node:crypto';
import {
  mkdir,
  mkdtemp,
  rm,
  writeFile,
} from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { Runner as Server } from '../../server.js';
import { createTestDatabase } from './database.js';

import type {
  Tests_Support_Harness_CreateClient_BaseUrl,
  Tests_Support_Harness_CreateClient_Cookies,
  Tests_Support_Harness_CreateClient_DefaultHeaders,
  Tests_Support_Harness_CreateClient_Returns,
  Tests_Support_Harness_Request_Body,
  Tests_Support_Harness_Request_Headers,
  Tests_Support_Harness_Request_Method,
  Tests_Support_Harness_Request_Name,
  Tests_Support_Harness_Request_Pair,
  Tests_Support_Harness_Request_Path,
  Tests_Support_Harness_Request_RequestHeaders,
  Tests_Support_Harness_Request_Response,
  Tests_Support_Harness_Request_Returns,
  Tests_Support_Harness_Request_Text,
  Tests_Support_Harness_Request_Value,
  Tests_Support_Harness_SeedServer_Name,
  Tests_Support_Harness_SeedServer_Pool,
  Tests_Support_Harness_SeedServer_Returns,
  Tests_Support_Harness_SeedServer_ServerId,
  Tests_Support_Harness_StartHarness_Address,
  Tests_Support_Harness_StartHarness_HttpServer,
  Tests_Support_Harness_StartHarness_Returns,
  Tests_Support_Harness_StartHarness_Server,
  Tests_Support_Harness_StartHarness_TestDatabase,
  Tests_Support_Harness_StartHarness_WebRoot,
} from '../../types/tests/support/harness.d.ts';

/**
 * Harness - Create Client.
 *
 * Builds a small HTTP client that keeps cookies and sends the CSRF header like the control panel.
 * JSON bodies are encoded, and JSON answers are decoded.
 *
 * @param {Tests_Support_Harness_CreateClient_BaseUrl}        baseUrl          - Base url.
 * @param {Tests_Support_Harness_CreateClient_DefaultHeaders} [defaultHeaders] - Default headers.
 *
 * @returns {Tests_Support_Harness_CreateClient_Returns}
 *
 * @since 4.0.0
 */
export function createClient(baseUrl: Tests_Support_Harness_CreateClient_BaseUrl, defaultHeaders: Tests_Support_Harness_CreateClient_DefaultHeaders = {}): Tests_Support_Harness_CreateClient_Returns {
  const cookies: Tests_Support_Harness_CreateClient_Cookies = new Map();

  return {
    cookies,
    request: async (method: Tests_Support_Harness_Request_Method, path: Tests_Support_Harness_Request_Path, body?: Tests_Support_Harness_Request_Body, headers: Tests_Support_Harness_Request_Headers = {}): Tests_Support_Harness_Request_Returns => {
      const requestHeaders: Tests_Support_Harness_Request_RequestHeaders = new Headers({
        ...defaultHeaders,
        ...headers,
      });

      if (cookies.size > 0) {
        requestHeaders.set('Cookie', [...cookies.entries()].map((cookie) => `${cookie[0]}=${cookie[1]}`).join('; '));
      }

      if (
        method !== 'GET'
        && cookies.has('dsb_csrf') === true
        && requestHeaders.has('X-CSRF-Token') === false
      ) {
        requestHeaders.set('X-CSRF-Token', cookies.get('dsb_csrf') ?? '');
      }

      if (body !== undefined && requestHeaders.has('Content-Type') === false) {
        requestHeaders.set('Content-Type', 'application/json');
      }

      const response: Tests_Support_Harness_Request_Response = await fetch(`${baseUrl}${path}`, {
        ...((body === undefined) ? {} : { body: (typeof body === 'string' || body instanceof Uint8Array) ? body : JSON.stringify(body) }),
        headers: requestHeaders,
        method,
        redirect: 'manual',
      });

      for (const setCookie of response.headers.getSetCookie()) {
        const pair: Tests_Support_Harness_Request_Pair = setCookie.split(';')[0] ?? '';
        const name: Tests_Support_Harness_Request_Name = pair.slice(0, pair.indexOf('='));
        const value: Tests_Support_Harness_Request_Value = pair.slice(pair.indexOf('=') + 1);

        if (value === '') {
          cookies.delete(name);
        } else {
          cookies.set(name, value);
        }
      }

      const text: Tests_Support_Harness_Request_Text = await response.text();

      return {
        body: (text === '' || (response.headers.get('Content-Type') ?? '').includes('application/json') === false) ? text : JSON.parse(text),
        headers: response.headers,
        status: response.status,
      };
    },
  };
}

/**
 * Harness - Seed Server.
 *
 * Adds a Discord server the way the bot records one when it joins.
 * Profiles and features are left for each test to set up.
 *
 * @param {Tests_Support_Harness_SeedServer_Pool}     pool     - Pool.
 * @param {Tests_Support_Harness_SeedServer_ServerId} serverId - Server id.
 * @param {Tests_Support_Harness_SeedServer_Name}     name     - Name.
 *
 * @returns {Tests_Support_Harness_SeedServer_Returns}
 *
 * @since 4.0.0
 */
export async function seedServer(pool: Tests_Support_Harness_SeedServer_Pool, serverId: Tests_Support_Harness_SeedServer_ServerId, name: Tests_Support_Harness_SeedServer_Name): Tests_Support_Harness_SeedServer_Returns {
  await pool.query('INSERT INTO discord_servers (guild_id, name, last_seen_at) VALUES ($1, $2, NOW()) ON CONFLICT (guild_id) DO NOTHING', [
    serverId,
    name,
  ]);

  await pool.query('INSERT INTO guild_profiles (guild_id) VALUES ($1) ON CONFLICT (guild_id) DO NOTHING', [serverId]);

  return;
}

/**
 * Harness - Start Harness.
 *
 * Runs the whole Express app on a free local port over a fresh in-memory database.
 * The control panel folder is a stand-in page, so page routes can be checked too.
 *
 * @returns {Tests_Support_Harness_StartHarness_Returns}
 *
 * @since 4.0.0
 */
export async function startHarness(): Tests_Support_Harness_StartHarness_Returns {
  const testDatabase: Tests_Support_Harness_StartHarness_TestDatabase = await createTestDatabase();
  const webRoot: Tests_Support_Harness_StartHarness_WebRoot = await mkdtemp(join(tmpdir(), 'dsb-console-'));

  await mkdir(join(webRoot, 'assets'));

  await writeFile(join(webRoot, 'index.html'), '<!doctype html><title>Stonker Bot for Discord</title><div id="root"></div>');

  await writeFile(join(webRoot, 'invite.html'), '<!doctype html><html><head><!-- invite-head --></head><body><div id="root"></div><!-- invite-data --></body></html>');

  const server: Tests_Support_Harness_StartHarness_Server = new Server({
    configuration: {
      bot: {
        controlPollIntervalMilliseconds: 1000,
        credentialKeyFile: '',
      },
      database: {
        connectionString: '',
        maxConnections: 1,
      },
      web: {
        host: '127.0.0.1',
        port: 0,
      },
      worker: {
        attemptLimit: 5,
        pollIntervalMilliseconds: 1000,
      },
    },
    credentialKey: randomBytes(32),
    pool: testDatabase['pool'],
    starterSettings: {},
    webRoot,
  });
  const httpServer: Tests_Support_Harness_StartHarness_HttpServer = createServer(server.getApplication());

  await new Promise<void>((resolvePromise) => {
    httpServer.listen(0, '127.0.0.1', () => {
      resolvePromise();

      return;
    });

    return;
  });

  const address: Tests_Support_Harness_StartHarness_Address = httpServer.address();

  if (address === null || typeof address === 'string') {
    throw new Error('The test server has no port.');
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: async () => {
      await new Promise<void>((resolvePromise) => {
        httpServer.close(() => {
          resolvePromise();

          return;
        });

        httpServer.closeAllConnections();

        return;
      });

      await testDatabase['database'].close();

      await rm(webRoot, {
        force: true,
        recursive: true,
      });

      return;
    },
    database: testDatabase['database'],
    pool: testDatabase['pool'],
  };
}
