import { randomBytes } from 'node:crypto';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createTestDatabase } from '../tests/support/database.js';
import {
  createNotificationTarget,
  getNotificationTarget,
  isNotificationTargetId,
  listNotificationTargetIds,
  listNotificationTargets,
  openNotificationTarget,
  recordNotificationAttempt,
  removeNotificationTarget,
  updateNotificationTarget,
} from './notification-targets.js';

import type {
  Lib_NotificationTargets_Test_Created,
  Lib_NotificationTargets_Test_GetTestDatabase_Returns,
  Lib_NotificationTargets_Test_Ids,
  Lib_NotificationTargets_Test_Key,
  Lib_NotificationTargets_Test_Pool,
  Lib_NotificationTargets_Test_Rows,
  Lib_NotificationTargets_Test_TestDatabase,
} from '../types/lib/notification-targets.d.ts';

/**
 * Notification Targets - Key.
 *
 * Seals destination secrets for every test.
 * The real key comes from the credential key file.
 *
 * @since 4.0.0
 */
const key: Lib_NotificationTargets_Test_Key = randomBytes(32);

/**
 * Notification Targets - Test Database.
 *
 * Holds the migrated in-memory database for the current test.
 * Each test starts from a fresh copy.
 *
 * @since 4.0.0
 */
let testDatabase: Lib_NotificationTargets_Test_TestDatabase = undefined;

/**
 * Notification Targets - Get Test Database.
 *
 * Returns the current test's database.
 * It fails loudly when no setup hook ran.
 *
 * @returns {Lib_NotificationTargets_Test_GetTestDatabase_Returns}
 *
 * @since 4.0.0
 */
function getTestDatabase(): Lib_NotificationTargets_Test_GetTestDatabase_Returns {
  if (testDatabase === undefined) {
    throw new Error('The test database is not ready.');
  }

  return testDatabase;
}

/**
 * Notification Targets - Notification Targets.
 *
 * Checks that secrets are sealed and kept through edits, and that a destination
 * waiting for removed secrets is skipped until they are entered again.
 *
 * @since 4.0.0
 */
describe('notification targets', () => {
  beforeEach(async () => {
    testDatabase = await createTestDatabase();

    return;
  });

  afterEach(async () => {
    await getTestDatabase()['pool'].end();

    testDatabase = undefined;

    return;
  });

  it('seals secrets and keeps them through an edit that leaves them blank', async () => {
    const pool: Lib_NotificationTargets_Test_Pool = getTestDatabase()['pool'];
    const created: Lib_NotificationTargets_Test_Created = await createNotificationTarget(pool, key, {
      events: [
        'job-failed',
        'bot-disconnected',
      ],
      name: 'Phone',
      secrets: { botToken: '123456:telegram-secret' },
      service: 'telegram',
      settings: { chatId: '-1001234567890' },
    });

    if (created === 'name-taken') {
      throw new Error('The destination could not be stored.');
    }

    const stored: Lib_NotificationTargets_Test_Rows = (await pool.query('SELECT secrets_ciphertext, secret_fields FROM notification_targets')).rows;

    expect(isNotificationTargetId(created['id'])).toBe(true);

    expect(isNotificationTargetId('ntf-NOT-AN-ID-0000')).toBe(false);

    expect(created['secrets']).toEqual({ botToken: true });

    expect(stored).toEqual([{
      secret_fields: ['botToken'],
      secrets_ciphertext: expect.any(String),
    }]);

    expect(JSON.stringify(stored).includes('telegram-secret')).toBe(false);

    expect(await createNotificationTarget(pool, key, {
      events: ['job-failed'],
      name: 'PHONE',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    })).toBe('name-taken');

    expect(await updateNotificationTarget(pool, key, created['id'], {
      clearSecrets: [],
      events: ['job-failed'],
      name: 'Family phone',
      secrets: {},
      settings: { chatId: '-1009876543210' },
    })).toEqual(expect.objectContaining({
      events: ['job-failed'],
      name: 'Family phone',
      secrets: { botToken: true },
      settings: { chatId: '-1009876543210' },
    }));

    expect(await openNotificationTarget(pool, key, created['id'])).toEqual({
      name: 'Family phone',
      target: {
        secrets: { botToken: '123456:telegram-secret' },
        service: 'telegram',
        settings: { chatId: '-1009876543210' },
      },
    });

    expect(await updateNotificationTarget(pool, key, 'ntf-0000000000000000', {
      clearSecrets: [],
      events: ['job-failed'],
      name: 'Gone',
      secrets: {},
      settings: {},
    })).toBe('not-found');

    await recordNotificationAttempt(pool, created['id'], 'HTTP 401');

    expect(await getNotificationTarget(pool, created['id'])).toEqual(expect.objectContaining({
      lastAttemptAt: expect.any(String),
      lastError: 'HTTP 401',
    }));

    expect(await removeNotificationTarget(pool, created['id'])).toBe('Family phone');

    expect(await removeNotificationTarget(pool, created['id'])).toBeUndefined();

    expect(await listNotificationTargets(pool)).toEqual([]);

    return;
  });

  it('skips a destination waiting for removed secrets until they are entered again', async () => {
    const pool: Lib_NotificationTargets_Test_Pool = getTestDatabase()['pool'];
    const phone: Lib_NotificationTargets_Test_Created = await createNotificationTarget(pool, key, {
      events: ['bot-disconnected'],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    });
    const modAlerts: Lib_NotificationTargets_Test_Created = await createNotificationTarget(pool, key, {
      events: [
        'bot-disconnected',
        'job-failed',
      ],
      name: 'Mod alerts',
      secrets: { webhookUrl: 'https://discord.com/api/webhooks/1/fixture' },
      service: 'discord',
      settings: {},
    });

    if (phone === 'name-taken' || modAlerts === 'name-taken') {
      throw new Error('The destinations could not be stored.');
    }

    const everyone: Lib_NotificationTargets_Test_Ids = [
      phone['id'],
      modAlerts['id'],
    ].sort();

    expect((await listNotificationTargetIds(pool, 'bot-disconnected')).sort()).toEqual(everyone);

    expect(await listNotificationTargetIds(pool, 'job-failed')).toEqual([modAlerts['id']]);

    await pool.query('UPDATE notification_targets SET secrets_ciphertext = NULL, secret_fields = \'[]\'::jsonb, missing_secrets = \'["webhookUrl"]\'::jsonb WHERE id = $1', [modAlerts['id']]);

    await pool.query('INSERT INTO removed_secrets (kind, notification_id) VALUES (\'notification\', $1)', [modAlerts['id']]);

    expect(await openNotificationTarget(pool, key, modAlerts['id'])).toBe('secrets-missing');

    expect(await listNotificationTargetIds(pool, 'bot-disconnected')).toEqual([phone['id']]);

    expect(await getNotificationTarget(pool, modAlerts['id'])).toEqual(expect.objectContaining({
      secrets: {},
      secretsMissing: ['webhookUrl'],
    }));

    expect(await updateNotificationTarget(pool, key, modAlerts['id'], {
      clearSecrets: [],
      events: [
        'bot-disconnected',
        'job-failed',
      ],
      name: 'Mod alerts',
      secrets: { webhookUrl: 'https://discord.com/api/webhooks/2/fixture' },
      settings: {},
    })).toEqual(expect.objectContaining({
      secrets: { webhookUrl: true },
      secretsMissing: [],
    }));

    expect((await pool.query('SELECT COUNT(*)::text AS count FROM removed_secrets')).rows).toEqual([{ count: '0' }]);

    expect((await listNotificationTargetIds(pool, 'bot-disconnected')).sort()).toEqual(everyone);

    return;
  });

  it('removes an optional saved secret and lets a lost optional secret stay empty', async () => {
    const pool: Lib_NotificationTargets_Test_Pool = getTestDatabase()['pool'];
    const created: Lib_NotificationTargets_Test_Created = await createNotificationTarget(pool, key, {
      events: ['job-failed'],
      name: 'Optional token',
      secrets: { token: 'saved-token' },
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    });

    if (created === 'name-taken') {
      throw new Error('The destination could not be stored.');
    }

    expect(await updateNotificationTarget(pool, key, created['id'], {
      clearSecrets: ['token'],
      events: ['job-failed'],
      name: 'Optional token',
      secrets: {},
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    })).toEqual(expect.objectContaining({
      secrets: {},
      secretsMissing: [],
    }));

    expect(await openNotificationTarget(pool, key, created['id'])).toEqual(expect.objectContaining({
      target: expect.objectContaining({ secrets: {} }),
    }));

    await pool.query('UPDATE notification_targets SET missing_secrets = \'["token"]\'::jsonb WHERE id = $1', [created['id']]);

    await pool.query('INSERT INTO removed_secrets (kind, notification_id) VALUES (\'notification\', $1)', [created['id']]);

    expect(await updateNotificationTarget(pool, key, created['id'], {
      clearSecrets: ['token'],
      events: ['job-failed'],
      name: 'Optional token',
      secrets: {},
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    })).toEqual(expect.objectContaining({
      secrets: {},
      secretsMissing: [],
    }));

    expect((await pool.query('SELECT COUNT(*)::text AS count FROM removed_secrets')).rows).toEqual([{ count: '0' }]);

    return;
  });

  return;
});
