import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  addUser,
  claimOwner,
  signIn,
} from '../tests/support/accounts.js';
import {
  createClient,
  startHarness,
} from '../tests/support/harness.js';

import type {
  Tests_Routes_Notifications_BaseUrl,
  Tests_Routes_Notifications_Client,
  Tests_Routes_Notifications_Harness,
  Tests_Routes_Notifications_Mocks,
  Tests_Routes_Notifications_Module,
  Tests_Routes_Notifications_NotificationId,
  Tests_Routes_Notifications_Plaintext,
  Tests_Routes_Notifications_Response,
} from '../types/tests/routes/notifications.test.d.ts';

/**
 * Notifications - Mocks.
 *
 * Stands in for the network send, so a test notification never leaves the test.
 * Each test sets what it answers.
 *
 * @since 4.0.0
 */
const mocks: Tests_Routes_Notifications_Mocks = vi.hoisted(() => ({
  send: vi.fn(),
}));

vi.mock('../lib/notifications.js', async (importOriginal) => ({
  ...(await importOriginal<Tests_Routes_Notifications_Module>()),
  sendNotification: mocks['send'],
}));

/**
 * Notifications - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Notifications_Harness = undefined;

beforeEach(async () => {
  mocks['send'].mockReset().mockResolvedValue({ delivered: true });

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
 * Notifications - Notification Routes.
 *
 * Covers adding, editing, testing, and removing destinations, and who may do it.
 * Secrets never come back from the API.
 *
 * @since 4.0.0
 */
describe('notification routes', () => {
  it('adds, edits, tests, and removes notification destinations', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Notifications_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Notifications_Client = createClient(baseUrl);

    await claimOwner(harness['pool'], owner);

    const events: Tests_Routes_Notifications_Response = await owner.request('GET', '/api/v1/notifications/events');

    expect(events['status']).toBe(200);

    expect(Reflect.get(Object(events['body']), 'items')).toEqual([
      expect.objectContaining({
        defaultEnabled: true,
        key: 'secrets-removed',
      }),
      expect.objectContaining({ key: 'sign-in-locked' }),
      expect.objectContaining({
        key: 'bot-sign-in-failed',
        label: 'Bot can\'t sign in',
      }),
      expect.objectContaining({ key: 'bot-disconnected' }),
      expect.objectContaining({ key: 'bot-reconnected' }),
      expect.objectContaining({
        description: 'A message, permission change, or RSS feed check failed on every try.',
        key: 'job-failed',
      }),
    ]);

    expect(await owner.request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: { items: [] },
      status: 200,
    }));

    expect(await owner.request('POST', '/api/v1/notifications', {
      events: ['bot-disconnected'],
      name: 'Phone',
      service: 'telegram',
      settings: { chatId: '-1001234567890' },
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'settings.botToken',
            message: 'Enter the bot token.',
            path: [
              'settings',
              'botToken',
            ],
          }],
          message: 'Enter the bot token.',
        },
      },
      status: 422,
    }));

    const created: Tests_Routes_Notifications_Response = await owner.request('POST', '/api/v1/notifications', {
      events: [
        'bot-disconnected',
        'bot-reconnected',
      ],
      name: '  Phone  ',
      service: 'telegram',
      settings: {
        botToken: '123456:telegram-secret',
        chatId: '-1001234567890',
      },
    });
    const notificationId: Tests_Routes_Notifications_NotificationId = String(Reflect.get(Object(created['body']), 'id'));

    expect(created).toEqual(expect.objectContaining({
      body: {
        createdAt: expect.any(String),
        events: [
          'bot-disconnected',
          'bot-reconnected',
        ],
        id: notificationId,
        lastAttemptAt: null,
        lastError: null,
        name: 'Phone',
        secrets: { botToken: true },
        secretsMissing: [],
        service: 'telegram',
        settings: { chatId: '-1001234567890' },
        updatedAt: expect.any(String),
      },
      status: 201,
    }));

    expect(JSON.stringify(created['body']).includes('telegram-secret')).toBe(false);

    expect(await owner.request('POST', '/api/v1/notifications', {
      events: ['job-failed'],
      name: 'PHONE',
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({ code: 'notification_exists' }),
      },
      status: 409,
    }));

    expect(await owner.request('PUT', `/api/v1/notifications/${notificationId}`, {
      events: ['job-failed'],
      name: 'Family phone',
      settings: {
        botToken: '',
        chatId: '-1009876543210',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        events: ['job-failed'],
        name: 'Family phone',
        secrets: { botToken: true },
        settings: { chatId: '-1009876543210' },
      }),
      status: 200,
    }));

    expect(await owner.request('PUT', '/api/v1/notifications/ntf-0000000000000000', {
      events: ['job-failed'],
      name: 'Gone',
      settings: {},
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'notification_not_found',
          message: 'That notification no longer exists.',
        },
      },
      status: 404,
    }));

    expect((await owner.request('DELETE', '/api/v1/notifications/not-an-id'))['status']).toBe(404);

    mocks['send'].mockResolvedValueOnce({
      delivered: false,
      message: 'HTTP 401',
    });

    expect(await owner.request('POST', `/api/v1/notifications/${notificationId}/test`)).toEqual(expect.objectContaining({
      body: {
        delivered: false,
        message: 'HTTP 401',
      },
      status: 200,
    }));

    expect(mocks['send']).toHaveBeenLastCalledWith(expect.objectContaining({ key: 'discord-stonker-bot' }), {
      secrets: { botToken: '123456:telegram-secret' },
      service: 'telegram',
      settings: { chatId: '-1009876543210' },
    }, expect.objectContaining({ event: 'test' }));

    expect(await owner.request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({
          id: notificationId,
          lastAttemptAt: expect.any(String),
          lastError: 'HTTP 401',
        })],
      },
      status: 200,
    }));

    expect((await owner.request('DELETE', `/api/v1/notifications/${notificationId}`))['status']).toBe(204);

    expect(await owner.request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: { items: [] },
      status: 200,
    }));

    return;
  });

  it('keeps notifications to signed-in people who can change settings', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Notifications_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Notifications_Client = createClient(baseUrl);
    const viewer: Tests_Routes_Notifications_Client = createClient(baseUrl);
    const operator: Tests_Routes_Notifications_Client = createClient(baseUrl);

    await claimOwner(harness['pool'], owner);

    await addUser(owner, {
      allServers: true,
      password: 'viewer password for tests',
      role: 'viewer',
      serverIds: [],
      username: 'viewer1',
    });

    await addUser(owner, {
      allServers: true,
      password: 'operator password for tests',
      role: 'operator',
      serverIds: [],
      username: 'operator1',
    });

    await signIn(viewer, 'viewer1', 'viewer password for tests');

    await signIn(operator, 'operator1', 'operator password for tests');

    expect(await viewer.request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'permission_required',
          message: 'Your role can\'t change settings.',
        },
      },
      status: 403,
    }));

    expect((await operator.request('GET', '/api/v1/notifications'))['status']).toBe(200);

    const token: Tests_Routes_Notifications_Response = await owner.request('POST', '/api/v1/auth/tokens', {
      name: 'Automation',
      scopes: ['logs:read'],
    });
    const plaintext: Tests_Routes_Notifications_Plaintext = String(Reflect.get(Object(token['body']), 'plaintext'));

    expect(await createClient(baseUrl, {
      Authorization: `Bearer ${plaintext}`,
    }).request('GET', '/api/v1/notifications')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'A signed-in browser session is required.',
        },
      },
      status: 403,
    }));

    return;
  });

  return;
});
