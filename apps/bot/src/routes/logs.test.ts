import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { isDebugLogging, setDebugLogging } from '../lib/logger.js';
import {
  createClient,
  startHarness,
} from '../tests/support/harness.js';
import {
  createTestToken,
  createTestUser,
  signInTestUser,
} from '../tests/support/sessions.js';

import type {
  Tests_Routes_Logs_AddLog_Component,
  Tests_Routes_Logs_AddLog_Context,
  Tests_Routes_Logs_AddLog_Event,
  Tests_Routes_Logs_AddLog_Level,
  Tests_Routes_Logs_AddLog_Returns,
  Tests_Routes_Logs_Body,
  Tests_Routes_Logs_Chunk,
  Tests_Routes_Logs_Client,
  Tests_Routes_Logs_Controller,
  Tests_Routes_Logs_Decoder,
  Tests_Routes_Logs_Harness,
  Tests_Routes_Logs_Item,
  Tests_Routes_Logs_Lines,
  Tests_Routes_Logs_Reader,
  Tests_Routes_Logs_Response,
  Tests_Routes_Logs_StreamResponse,
  Tests_Routes_Logs_Text,
  Tests_Routes_Logs_Token,
  Tests_Routes_Logs_UserId,
  Tests_Routes_Logs_Write,
} from '../types/tests/routes/logs.test.d.ts';

/**
 * Logs - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Logs_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  return;
});

afterEach(async () => {
  if (harness !== undefined) {
    await harness.close();
  }

  harness = undefined;

  return;
});

/**
 * Logs - Add Log.
 *
 * Writes one log entry the way a process persists it.
 * Entries get increasing ids in the order they are added.
 *
 * @param {Tests_Routes_Logs_AddLog_Component} component - Component.
 * @param {Tests_Routes_Logs_AddLog_Level}     level     - Level.
 * @param {Tests_Routes_Logs_AddLog_Event}     event     - Event.
 * @param {Tests_Routes_Logs_AddLog_Context}   context   - Context.
 *
 * @returns {Tests_Routes_Logs_AddLog_Returns}
 *
 * @since 4.0.0
 */
async function addLog(component: Tests_Routes_Logs_AddLog_Component, level: Tests_Routes_Logs_AddLog_Level, event: Tests_Routes_Logs_AddLog_Event, context: Tests_Routes_Logs_AddLog_Context): Tests_Routes_Logs_AddLog_Returns {
  if (harness === undefined) {
    throw new Error('The test server is not running.');
  }

  await harness['pool'].query('INSERT INTO runtime_logs (component, level, event, context) VALUES ($1, $2, $3, $4::jsonb)', [
    component,
    level,
    event,
    JSON.stringify(context),
  ]);

  return;
}

/**
 * Logs - Log Routes.
 *
 * Covers filters, cursors, token scopes, and the live stream.
 * Every signed-in role may read logs.
 *
 * @since 4.0.0
 */
describe('log routes', () => {
  it('filters by process, level, and text, and pages with a cursor', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const viewer: Tests_Routes_Logs_Client = createClient(harness['baseUrl']);

    await signInTestUser(harness['pool'], viewer, {
      allServers: false,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });

    await addLog('bot', 'info', 'gateway_ready', {
      guildCount: 2,
    });

    await addLog('web', 'info', 'web_ready', {
      port: 22604,
    });

    await addLog('bot', 'warn', 'feature_disabled', {
      featureKey: 'anti-raid',
    });

    await addLog('bot', 'error', 'gateway_failed', {
      error: '100% broken_thing',
    });

    const all: Tests_Routes_Logs_Response = await viewer.request('GET', '/api/v1/logs');
    const allBody: Tests_Routes_Logs_Body = all['body'] as Tests_Routes_Logs_Body;

    expect(all['status']).toBe(200);

    expect(allBody['items'].map((item) => item['event'])).toEqual([
      'gateway_ready',
      'feature_disabled',
      'gateway_failed',
    ]);

    const firstItem: Tests_Routes_Logs_Item = allBody['items'][0];
    const secondItem: Tests_Routes_Logs_Item = allBody['items'][1];
    const lastItem: Tests_Routes_Logs_Item = allBody['items'][2];

    if (
      firstItem === undefined
      || secondItem === undefined
      || lastItem === undefined
    ) {
      throw new Error('The log list is missing entries.');
    }

    expect(allBody['cursor']).toBe(lastItem['id']);

    const warnings: Tests_Routes_Logs_Response = await viewer.request('GET', '/api/v1/logs?level=warn');

    expect((warnings['body'] as Tests_Routes_Logs_Body)['items'].map((item) => item['event'])).toEqual([
      'feature_disabled',
      'gateway_failed',
    ]);

    const search: Tests_Routes_Logs_Response = await viewer.request('GET', '/api/v1/logs?q=100%25%20broken_');

    expect((search['body'] as Tests_Routes_Logs_Body)['items'].map((item) => item['event'])).toEqual(['gateway_failed']);

    const web: Tests_Routes_Logs_Response = await viewer.request('GET', '/api/v1/logs?component=web');

    expect((web['body'] as Tests_Routes_Logs_Body)['items'].map((item) => item['event'])).toEqual(['web_ready']);

    const after: Tests_Routes_Logs_Response = await viewer.request('GET', `/api/v1/logs?after=${firstItem['id']}&limit=1`);

    expect(after['body']).toEqual({
      cursor: secondItem['id'],
      items: [expect.objectContaining({
        event: 'feature_disabled',
        level: 'warn',
      })],
    });

    expect(await viewer.request('GET', '/api/v1/logs?component=database&extra=1')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'component',
              message: 'Choose bot, web, or worker.',
              path: ['component'],
            },
            {
              field: 'extra',
              message: 'This field isn\'t accepted.',
              path: ['extra'],
            },
          ],
          message: 'Choose bot, web, or worker.',
        },
      },
      status: 422,
    }));

    return;
  });

  it('accepts tokens with logs:read only', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const userId: Tests_Routes_Logs_UserId = await createTestUser(harness['pool'], {
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });
    const logsToken: Tests_Routes_Logs_Token = await createTestToken(harness['pool'], userId, ['logs:read']);
    const featuresToken: Tests_Routes_Logs_Token = await createTestToken(harness['pool'], userId, ['features:read']);

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${logsToken}`,
    }).request('GET', '/api/v1/logs')).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `bearer ${logsToken}`,
    }).request('GET', '/api/v1/logs')).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${featuresToken}`,
    }).request('GET', '/api/v1/logs')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'scope_required',
          message: 'This token doesn\'t have the logs:read scope.',
        },
      },
      status: 403,
    }));

    expect(await createClient(harness['baseUrl'], {
      Authorization: 'Bearer dsb_not-a-real-token',
    }).request('GET', '/api/v1/logs')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'A valid personal access token is required.',
        },
      },
      status: 401,
    }));

    return;
  });

  it('streams entries written after it opens', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const viewer: Tests_Routes_Logs_Client = createClient(harness['baseUrl']);

    await signInTestUser(harness['pool'], viewer, {
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });

    await addLog('bot', 'info', 'before_stream', {});

    const controller: Tests_Routes_Logs_Controller = new AbortController();
    const response: Tests_Routes_Logs_StreamResponse = await fetch(`${harness['baseUrl']}/api/v1/logs/stream?component=bot`, {
      headers: {
        Cookie: `dsb_session=${viewer['cookies'].get('dsb_session') ?? ''}`,
      },
      signal: controller.signal,
    });

    expect(response.status).toBe(200);

    expect(response.headers.get('Content-Type')).toContain('text/event-stream');

    await addLog('bot', 'info', 'after_stream', {
      step: 1,
    });

    const reader: Tests_Routes_Logs_Reader = (response.body === null) ? undefined : response.body.getReader();
    const decoder: Tests_Routes_Logs_Decoder = new TextDecoder();
    let text: Tests_Routes_Logs_Text = '';

    while (reader !== undefined && text.includes('after_stream') === false) {
      const chunk: Tests_Routes_Logs_Chunk = await reader.read();

      if (chunk.done === true) {
        break;
      }

      text += decoder.decode(chunk.value);
    }

    controller.abort();

    expect(text).toContain('event: log');

    expect(text).toContain('"event":"after_stream"');

    expect(text).not.toContain('before_stream');

    return;
  });

  it('shows debug logging to every reader and lets bot controllers change it', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const write: Tests_Routes_Logs_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const viewer: Tests_Routes_Logs_Client = createClient(harness['baseUrl']);
    const operator: Tests_Routes_Logs_Client = createClient(harness['baseUrl']);

    await signInTestUser(harness['pool'], viewer, {
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });

    await signInTestUser(harness['pool'], operator, {
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });

    const userId: Tests_Routes_Logs_UserId = await createTestUser(harness['pool'], {
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'scripts',
    });
    const logsToken: Tests_Routes_Logs_Token = await createTestToken(harness['pool'], userId, ['logs:read']);
    const tokenClient: Tests_Routes_Logs_Client = createClient(harness['baseUrl'], {
      Authorization: `Bearer ${logsToken}`,
    });

    try {
      expect(await viewer.request('GET', '/api/v1/diagnostics')).toEqual(expect.objectContaining({
        body: {
          debugLogging: false,
        },
        status: 200,
      }));

      expect(await tokenClient.request('GET', '/api/v1/diagnostics')).toEqual(expect.objectContaining({
        body: {
          debugLogging: false,
        },
        status: 200,
      }));

      expect(await viewer.request('PUT', '/api/v1/diagnostics', {
        debugLogging: true,
      })).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'permission_required',
            message: 'Your role can\'t start or stop the bot.',
          },
        },
        status: 403,
      }));

      expect((await tokenClient.request('PUT', '/api/v1/diagnostics', {
        debugLogging: true,
      }))['status']).toBe(403);

      expect((await operator.request('PUT', '/api/v1/diagnostics', {
        debugLogging: 'yes',
      }))['status']).toBe(422);

      expect(isDebugLogging()).toBe(false);

      expect(await operator.request('PUT', '/api/v1/diagnostics', {
        debugLogging: true,
      })).toEqual(expect.objectContaining({
        body: {
          debugLogging: true,
        },
        status: 200,
      }));

      expect(isDebugLogging()).toBe(true);

      expect(await viewer.request('GET', '/api/v1/diagnostics')).toEqual(expect.objectContaining({
        body: {
          debugLogging: true,
        },
        status: 200,
      }));

      expect(await operator.request('PUT', '/api/v1/diagnostics', {
        debugLogging: false,
      })).toEqual(expect.objectContaining({
        body: {
          debugLogging: false,
        },
        status: 200,
      }));

      expect(isDebugLogging()).toBe(false);

      const lines: Tests_Routes_Logs_Lines = write.mock.calls.map((call) => String(call[0])).filter((line) => line.includes('"event":"debug_logging_'));

      expect(lines).toHaveLength(2);

      expect(lines[0]).toContain('"component":"web"');

      expect(lines[0]).toContain('"event":"debug_logging_on"');

      expect(lines[0]).toContain('"username":"operator"');

      expect(lines[1]).toContain('"event":"debug_logging_off"');
    } finally {
      setDebugLogging(false);

      write.mockRestore();
    }

    return;
  });

  return;
});
