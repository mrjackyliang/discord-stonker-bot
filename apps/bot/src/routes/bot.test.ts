import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { recordHeartbeat } from '../lib/database.js';
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
  Tests_Routes_Bot_Client,
  Tests_Routes_Bot_Harness,
  Tests_Routes_Bot_Response,
  Tests_Routes_Bot_Token,
  Tests_Routes_Bot_UserId,
} from '../types/tests/routes/bot.test.d.ts';

/**
 * Bot - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Bot_Harness = undefined;

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
 * Bot - Bot Routes.
 *
 * Covers the status, actions, and token routes for each role and for tokens.
 * Heartbeats are written the way the bot process writes them.
 *
 * @since 4.0.0
 */
describe('bot routes', () => {
  it('reports status to every role and limits changes to roles that may make them', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const viewer: Tests_Routes_Bot_Client = createClient(harness['baseUrl']);
    const operator: Tests_Routes_Bot_Client = createClient(harness['baseUrl']);

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

    expect(await viewer.request('GET', '/api/v1/bot')).toEqual(expect.objectContaining({
      body: {
        activeFeatures: [],
        addServerUrl: null,
        applicationId: null,
        configurationErrors: [],
        desiredState: 'stopped',
        guildCount: null,
        resolution: null,
        services: [
          {
            component: 'bot',
            status: null,
            updatedAt: null,
          },
          {
            component: 'web',
            status: null,
            updatedAt: null,
          },
          {
            component: 'worker',
            status: null,
            updatedAt: null,
          },
        ],
        status: 'stopped',
        tokenConfigured: false,
        userTag: null,
      },
      status: 200,
    }));

    expect(await viewer.request('POST', '/api/v1/bot/actions', {
      action: 'start',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'permission_required',
          message: 'Your role can\'t start or stop the bot.',
        },
      },
      status: 403,
    }));

    expect(await viewer.request('PUT', '/api/v1/bot/token', {
      token: 'fixture-token',
    })).toEqual(expect.objectContaining({
      status: 403,
    }));

    expect(await operator.request('POST', '/api/v1/bot/actions', {
      action: 'start',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'bot_token_required',
          message: 'Add the Discord bot token before starting the bot.',
        },
      },
      status: 409,
    }));

    expect(await operator.request('POST', '/api/v1/bot/actions', {
      action: 'explode',
      extra: true,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'action',
              message: 'Choose start, stop, or restart.',
              path: ['action'],
            },
            {
              field: 'extra',
              message: 'This field isn\'t accepted.',
              path: ['extra'],
            },
          ],
          message: 'Choose start, stop, or restart.',
        },
      },
      status: 422,
    }));

    expect(await operator.request('PUT', '/api/v1/bot/token', {
      token: '   ',
    })).toEqual(expect.objectContaining({
      status: 422,
    }));

    expect(await operator.request('PUT', '/api/v1/bot/token', {
      token: 'fixture-token',
    })).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(await operator.request('POST', '/api/v1/bot/actions', {
      action: 'start',
    })).toEqual(expect.objectContaining({
      body: {
        desiredState: 'running',
      },
      status: 202,
    }));

    expect(await viewer.request('GET', '/api/v1/bot')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        desiredState: 'running',
        status: 'starting',
        tokenConfigured: true,
      }),
      status: 200,
    }));

    await harness['pool'].query('UPDATE bot_runtime_control SET discord_application_id = $1', ['123456789012345678']);

    await recordHeartbeat(harness['pool'], 'bot', 'ready', {
      activeFeatures: ['anti-raid'],
      configurationErrors: [],
      guildCount: 2,
      userTag: 'Stonker#0001',
    });

    expect(await viewer.request('GET', '/api/v1/bot')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        activeFeatures: ['anti-raid'],
        addServerUrl: 'https://discord.com/oauth2/authorize?client_id=123456789012345678&integration_type=0&scope=bot%20applications.commands',
        guildCount: 2,
        status: 'ready',
        userTag: 'Stonker#0001',
      }),
      status: 200,
    }));

    await harness['pool'].query('UPDATE runtime_heartbeats SET observed_at = NOW() - INTERVAL \'5 minutes\' WHERE component = \'bot\'');

    const stale: Tests_Routes_Bot_Response = await viewer.request('GET', '/api/v1/bot');

    expect(stale['body']).toEqual(expect.objectContaining({
      status: 'unresponsive',
    }));

    return;
  });

  it('lets tokens with bot:control read and change the bot, without CSRF, and never save the token', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const ownerId: Tests_Routes_Bot_UserId = await createTestUser(harness['pool'], {
      allServers: true,
      role: 'owner',
      serverIds: [],
      username: 'owner',
    });
    const controlToken: Tests_Routes_Bot_Token = await createTestToken(harness['pool'], ownerId, ['bot:control']);
    const logsToken: Tests_Routes_Bot_Token = await createTestToken(harness['pool'], ownerId, ['logs:read']);
    const controller: Tests_Routes_Bot_Client = createClient(harness['baseUrl'], {
      Authorization: `Bearer ${controlToken}`,
    });
    const reader: Tests_Routes_Bot_Client = createClient(harness['baseUrl'], {
      Authorization: `Bearer ${logsToken}`,
    });

    expect(await controller.request('GET', '/api/v1/bot')).toEqual(expect.objectContaining({
      status: 200,
    }));

    expect(await controller.request('POST', '/api/v1/bot/actions', {
      action: 'stop',
    })).toEqual(expect.objectContaining({
      body: {
        desiredState: 'stopped',
      },
      status: 202,
    }));

    expect(await controller.request('PUT', '/api/v1/bot/token', {
      token: 'fixture-token',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'A signed-in browser session is required.',
        },
      },
      status: 403,
    }));

    expect(await reader.request('GET', '/api/v1/bot')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'scope_required',
          message: 'This token doesn\'t have the bot:control scope.',
        },
      },
      status: 403,
    }));

    expect(await createClient(harness['baseUrl']).request('GET', '/api/v1/bot')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'Sign in, or send a valid API token.',
        },
      },
      status: 401,
    }));

    return;
  });

  return;
});
