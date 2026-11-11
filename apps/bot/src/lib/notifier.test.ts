import { randomBytes } from 'node:crypto';

import {
  Client,
  Events,
} from 'discord.js';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createTestDatabase } from '../tests/support/database.js';
import {
  createNotificationTarget,
  getNotificationTarget,
} from './notification-targets.js';
import {
  deliverNotificationJob,
  NOTIFICATION_JOB_TYPE,
  notifyJobFailed,
  notifySignInLocked,
  stopGatewayWatch,
  watchGatewayConnection,
} from './notifier.js';

import type {
  Lib_Notifier_Test_Client,
  Lib_Notifier_Test_Created,
  Lib_Notifier_Test_GetTestDatabase_Returns,
  Lib_Notifier_Test_Jobs,
  Lib_Notifier_Test_Key,
  Lib_Notifier_Test_ListJobs_Pool,
  Lib_Notifier_Test_ListJobs_Returns,
  Lib_Notifier_Test_Notification,
  Lib_Notifier_Test_Pool,
  Lib_Notifier_Test_Send,
  Lib_Notifier_Test_TestDatabase,
  Lib_Notifier_Test_Wait_Milliseconds,
  Lib_Notifier_Test_Wait_Returns,
} from '../types/lib/notifier.d.ts';

/**
 * Notifier - Key.
 *
 * Seals destination secrets for every test.
 * The real key comes from the credential key file.
 *
 * @since 4.0.0
 */
const key: Lib_Notifier_Test_Key = randomBytes(32);

/**
 * Notifier - Test Database.
 *
 * Holds the migrated in-memory database for the current test.
 * Each test starts from a fresh copy.
 *
 * @since 4.0.0
 */
let testDatabase: Lib_Notifier_Test_TestDatabase = undefined;

/**
 * Notifier - Get Test Database.
 *
 * Returns the current test's database.
 * It fails loudly when no setup hook ran.
 *
 * @returns {Lib_Notifier_Test_GetTestDatabase_Returns}
 *
 * @since 4.0.0
 */
function getTestDatabase(): Lib_Notifier_Test_GetTestDatabase_Returns {
  if (testDatabase === undefined) {
    throw new Error('The test database is not ready.');
  }

  return testDatabase;
}

/**
 * Notifier - List Jobs.
 *
 * Reads the queued notification jobs, oldest first.
 * Other worker jobs are left out.
 *
 * @param {Lib_Notifier_Test_ListJobs_Pool} pool - Pool.
 *
 * @returns {Lib_Notifier_Test_ListJobs_Returns}
 *
 * @since 4.0.0
 */
async function listJobs(pool: Lib_Notifier_Test_ListJobs_Pool): Lib_Notifier_Test_ListJobs_Returns {
  return (await pool.query('SELECT payload FROM jobs WHERE type = $1 ORDER BY id', [NOTIFICATION_JOB_TYPE])).rows.map((row) => Reflect.get(Object(row), 'payload'));
}

/**
 * Notifier - Wait.
 *
 * Lets real time pass for the short grace periods these tests use.
 * Timers stay real so the database keeps answering meanwhile.
 *
 * @param {Lib_Notifier_Test_Wait_Milliseconds} milliseconds - Milliseconds.
 *
 * @returns {Lib_Notifier_Test_Wait_Returns}
 *
 * @since 4.0.0
 */
async function wait(milliseconds: Lib_Notifier_Test_Wait_Milliseconds): Lib_Notifier_Test_Wait_Returns {
  await new Promise((resolvePromise) => {
    setTimeout(resolvePromise, milliseconds);

    return;
  });

  return;
}

/**
 * Notifier - Notifier.
 *
 * Checks which events become worker jobs and for whom, how a job is sent and retried,
 * and that only a Gateway drop outlasting the grace period is reported.
 *
 * @since 4.0.0
 */
describe('notifier', () => {
  beforeEach(async () => {
    testDatabase = await createTestDatabase();

    return;
  });

  afterEach(async () => {
    await getTestDatabase()['pool'].end();

    testDatabase = undefined;

    return;
  });

  it('queues one job per destination that chose the event, once per occurrence', async () => {
    const pool: Lib_Notifier_Test_Pool = getTestDatabase()['pool'];
    const phone: Lib_Notifier_Test_Created = await createNotificationTarget(pool, key, {
      events: ['sign-in-locked'],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    });
    const modAlerts: Lib_Notifier_Test_Created = await createNotificationTarget(pool, key, {
      events: ['job-failed'],
      name: 'Mod alerts',
      secrets: { webhookUrl: 'https://discord.com/api/webhooks/1/fixture' },
      service: 'discord',
      settings: {},
    });

    if (phone === 'name-taken' || modAlerts === 'name-taken') {
      throw new Error('The destinations could not be stored.');
    }

    await notifySignInLocked(pool, 'setup:203.0.113.5', 0);

    await notifySignInLocked(pool, 'sign-in:203.0.113.5', 0);

    await notifySignInLocked(pool, 'sign-in:203.0.113.5', 60_000);

    expect(await listJobs(pool)).toEqual([{
      notification: expect.objectContaining({
        event: 'sign-in-locked',
        message: 'Ten failed sign-ins from 203.0.113.5. Sign-in from it is paused for 15 minutes.',
      }),
      targetId: phone['id'],
    }]);

    await notifySignInLocked(pool, 'sign-in:203.0.113.5', 16 * 60_000);

    expect(await listJobs(pool)).toHaveLength(2);

    await notifyJobFailed(pool, {
      attempts: 5,
      id: '41',
      payload: {},
      type: NOTIFICATION_JOB_TYPE,
    }, 'HTTP 500');

    await notifyJobFailed(pool, {
      attempts: 5,
      id: '42',
      payload: { ruleName: 'Weekly digest' },
      type: 'discord.message.send',
    }, 'Missing Access');

    await notifyJobFailed(pool, {
      attempts: 5,
      id: '42',
      payload: { ruleName: 'Weekly digest' },
      type: 'discord.message.send',
    }, 'Missing Access');

    expect((await listJobs(pool)).slice(2)).toEqual([{
      notification: expect.objectContaining({
        event: 'job-failed',
        message: 'A Discord message for Weekly digest failed on all 5 tries and won\'t run again: Missing Access',
        priority: 'high',
        title: 'Job gave up',
      }),
      targetId: modAlerts['id'],
    }]);

    return;
  });

  it('sends a queued notification and records the attempt, failing so the worker retries', async () => {
    const pool: Lib_Notifier_Test_Pool = getTestDatabase()['pool'];
    const send: Lib_Notifier_Test_Send = vi.fn();
    const phone: Lib_Notifier_Test_Created = await createNotificationTarget(pool, key, {
      events: ['job-failed'],
      name: 'Phone',
      secrets: { token: 'tk_fixture' },
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    });
    const notification: Lib_Notifier_Test_Notification = {
      details: {},
      event: 'job-failed',
      message: 'An RSS feed check failed on all 5 tries and won\'t run again: HTTP 503',
      occurredAt: '2026-10-26T12:00:00.000Z',
      priority: 'high',
      tags: ['x'],
      title: 'Job gave up',
    };

    if (phone === 'name-taken') {
      throw new Error('The destination could not be stored.');
    }

    send.mockResolvedValueOnce({ delivered: true }).mockResolvedValueOnce({
      delivered: false,
      message: 'HTTP 502',
    });

    await deliverNotificationJob(pool, key, {
      notification,
      targetId: phone['id'],
    }, send);

    expect(send).toHaveBeenLastCalledWith({
      key: 'discord-stonker-bot',
      name: 'Stonker Bot for Discord',
    }, {
      secrets: { token: 'tk_fixture' },
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    }, notification);

    expect(await getNotificationTarget(pool, phone['id'])).toEqual(expect.objectContaining({
      lastAttemptAt: expect.any(String),
      lastError: null,
    }));

    await expect(deliverNotificationJob(pool, key, {
      notification,
      targetId: phone['id'],
    }, send)).rejects.toThrow('The Phone notification couldn\'t be sent: HTTP 502');

    expect(await getNotificationTarget(pool, phone['id'])).toEqual(expect.objectContaining({ lastError: 'HTTP 502' }));

    await deliverNotificationJob(pool, key, {
      notification,
      targetId: 'ntf-0000000000000000',
    }, send);

    expect(send).toHaveBeenCalledTimes(2);

    await expect(deliverNotificationJob(pool, key, { targetId: 5 }, send)).rejects.toThrow();

    return;
  });

  it('reports a Gateway drop only when it outlasts the grace period', async () => {
    const pool: Lib_Notifier_Test_Pool = getTestDatabase()['pool'];
    const client: Lib_Notifier_Test_Client = new Client({ intents: [] });

    await createNotificationTarget(pool, key, {
      events: [
        'bot-disconnected',
        'bot-reconnected',
      ],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    });

    watchGatewayConnection(client, pool, 50);

    client.emit(Events.ShardReconnecting, 0);

    await wait(10);

    client.emit(Events.ShardResume, 0, 0);

    await wait(100);

    expect(await listJobs(pool)).toEqual([]);

    client.emit(Events.ShardReconnecting, 0);

    await vi.waitFor(async () => {
      expect(await listJobs(pool)).toHaveLength(1);

      return;
    });

    client.emit(Events.ShardReady, 0, undefined);

    await vi.waitFor(async () => {
      expect(await listJobs(pool)).toHaveLength(2);

      return;
    });

    const jobs: Lib_Notifier_Test_Jobs = await listJobs(pool);

    expect(jobs.map((job) => job['notification']['event'])).toEqual([
      'bot-disconnected',
      'bot-reconnected',
    ]);

    expect(jobs[1]).toEqual(expect.objectContaining({
      notification: expect.objectContaining({ message: 'The bot is back on Discord after 1 minute away.' }),
    }));

    stopGatewayWatch(client);

    client.emit(Events.ShardReconnecting, 0);

    await wait(100);

    expect(await listJobs(pool)).toHaveLength(2);

    await client.destroy();

    return;
  });

  return;
});
