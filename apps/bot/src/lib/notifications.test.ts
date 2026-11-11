import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  notificationInputSchema,
  notificationServiceBody,
  sendNotification,
} from './notifications.js';

import type {
  Lib_Notifications_Test_App,
  Lib_Notifications_Test_Dependencies,
  Lib_Notifications_Test_Notification,
  Lib_Notifications_Test_Reason,
  Lib_Notifications_Test_Result,
  Lib_Notifications_Test_ServiceResult,
} from '../types/lib/notifications.d.ts';

/**
 * Notifications - App.
 *
 * Names the appliance in payloads produced by these tests.
 * This stays independent from the production notifier catalog.
 *
 * @since 4.0.0
 */
const app: Lib_Notifications_Test_App = {
  key: 'discord-stonker-bot',
  name: 'Stonker Bot for Discord',
};

/**
 * Notifications - Notification.
 *
 * Provides one complete event for delivery tests.
 * Both transport tests use the same stable event body.
 *
 * @since 4.0.0
 */
const notification: Lib_Notifications_Test_Notification = {
  details: {},
  event: 'job-failed',
  message: 'A fixture job failed.',
  occurredAt: '2026-10-27T00:00:00.000Z',
  priority: 'high',
  tags: ['x'],
  title: 'Job gave up',
};

/**
 * Notifications - Notifications.
 *
 * Checks the shared destination validation and bounded failure reasons.
 * These cases do not need a database or a live notification service.
 *
 * @since 4.0.0
 */
describe('notifications', () => {
  it('requires a notification service', () => {
    const result: Lib_Notifications_Test_ServiceResult = notificationServiceBody.safeParse({ service: '' });

    expect(result.success).toBe(false);

    if (result.success === false) {
      expect(result.error.issues).toContainEqual(expect.objectContaining({
        message: 'Choose a service.',
        path: ['service'],
      }));
    }

    return;
  });

  it('rejects a Matrix alias with the room ID guidance', () => {
    const result: Lib_Notifications_Test_Result = notificationInputSchema('matrix', ['job-failed'], [], []).safeParse({
      clearSecrets: [],
      events: ['job-failed'],
      name: 'Matrix room',
      service: 'matrix',
      settings: {
        accessToken: 'matrix-token',
        homeserverUrl: 'https://matrix.example.com',
        roomId: '#alerts:example.com',
      },
    });

    expect(result.success).toBe(false);

    if (result.success === false) {
      expect(result.error.issues).toContainEqual(expect.objectContaining({
        message: 'Use a room ID like !room:example.com.',
        path: [
          'settings',
          'roomId',
        ],
      }));
    }

    return;
  });

  it('refuses to clear a secret and replace it at once', () => {
    const result: Lib_Notifications_Test_Result = notificationInputSchema('ntfy', ['job-failed'], ['token'], []).safeParse({
      clearSecrets: ['token'],
      events: ['job-failed'],
      name: 'Phone',
      settings: {
        token: 'new-token',
        url: 'https://ntfy.sh/alerts',
      },
    });

    expect(result.success).toBe(false);

    if (result.success === false) {
      expect(result.error.issues).toEqual([expect.objectContaining({
        message: 'Enter a new value or clear this field, not both.',
        path: [
          'settings',
          'token',
        ],
      })]);
    }

    return;
  });

  it('only clears optional secrets that are saved', () => {
    const result: Lib_Notifications_Test_Result = notificationInputSchema('ntfy', ['job-failed'], [], []).safeParse({
      clearSecrets: [
        'token',
        'url',
      ],
      events: ['job-failed'],
      name: 'Phone',
      settings: { url: 'https://ntfy.sh/alerts' },
    });

    expect(result.success).toBe(false);

    // A plain field gets the clear-list answer only, not the replace-or-clear one.
    if (result.success === false) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        'Choose an optional saved secret.',
        'Choose an optional saved secret.',
      ]);
    }

    return;
  });

  it('asks again for a required secret a lost key removed', () => {
    const result: Lib_Notifications_Test_Result = notificationInputSchema('telegram', ['job-failed'], [], ['botToken']).safeParse({
      clearSecrets: [],
      events: ['job-failed'],
      name: 'Mod chat',
      settings: {
        botToken: '',
        chatId: '-100',
      },
    });

    expect(result.success).toBe(false);

    if (result.success === false) {
      expect(result.error.issues).toEqual([expect.objectContaining({
        path: [
          'settings',
          'botToken',
        ],
      })]);
    }

    return;
  });

  it('continues without an optional secret a lost key removed', () => {
    const result: Lib_Notifications_Test_Result = notificationInputSchema('ntfy', ['job-failed'], [], ['token']).safeParse({
      clearSecrets: ['token'],
      events: ['job-failed'],
      name: 'Phone',
      settings: { url: 'https://ntfy.sh/alerts' },
    });

    expect(result.success).toBe(true);

    return;
  });

  it('keeps up to 200 characters of a refused service response', async () => {
    const reason: Lib_Notifications_Test_Reason = 'x'.repeat(240);
    const dependencies: Lib_Notifications_Test_Dependencies = {
      fetch: () => Promise.resolve(new Response(JSON.stringify({ message: reason }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })),
      sendMail: () => Promise.resolve(),
    };

    expect(await sendNotification(app, {
      secrets: { url: 'https://hooks.example.com/fixture' },
      service: 'webhook',
      settings: {},
    }, notification, dependencies)).toEqual({
      delivered: false,
      message: `HTTP 400: ${'x'.repeat(200)}`,
    });

    return;
  });

  return;
});
