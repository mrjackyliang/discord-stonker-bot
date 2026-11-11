import { randomBytes } from 'node:crypto';
import {
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createTestDatabase } from '../tests/support/database.js';
import { seedServer } from '../tests/support/harness.js';
import { createTestUser } from '../tests/support/sessions.js';
import { prepareCredentialKey } from './credential-key.js';
import {
  encryptDiscordToken,
  encryptSecret,
} from './credential-vault.js';
import { createNotificationTarget } from './notification-targets.js';
import {
  dismissRemovedSecrets,
  listRemovedSecrets,
} from './removed-secrets.js';

import type {
  Lib_CredentialKey_Test_Count,
  Lib_CredentialKey_Test_Directory,
  Lib_CredentialKey_Test_GetTestDatabase_Returns,
  Lib_CredentialKey_Test_Key,
  Lib_CredentialKey_Test_KeyPath,
  Lib_CredentialKey_Test_Mode,
  Lib_CredentialKey_Test_Notification,
  Lib_CredentialKey_Test_Owner,
  Lib_CredentialKey_Test_OwnerId,
  Lib_CredentialKey_Test_Pool,
  Lib_CredentialKey_Test_RemovedSecretKinds,
  Lib_CredentialKey_Test_RemovedSecretNotices,
  Lib_CredentialKey_Test_RemovedSecrets,
  Lib_CredentialKey_Test_TestDatabase,
} from '../types/lib/credential-key.d.ts';

/**
 * Credential Key - Directory.
 *
 * Holds the key file for the current test, in the system's temporary folder.
 * Each test gets a new, empty folder.
 *
 * @since 4.0.0
 */
let directory: Lib_CredentialKey_Test_Directory = '';

/**
 * Credential Key - Test Database.
 *
 * Holds the migrated in-memory database for the current test.
 * Each test starts from a fresh copy.
 *
 * @since 4.0.0
 */
let testDatabase: Lib_CredentialKey_Test_TestDatabase = undefined;

/**
 * Credential Key - Get Test Database.
 *
 * Returns the current test's database.
 * It fails loudly when no setup hook ran.
 *
 * @returns {Lib_CredentialKey_Test_GetTestDatabase_Returns}
 *
 * @since 4.0.0
 */
function getTestDatabase(): Lib_CredentialKey_Test_GetTestDatabase_Returns {
  if (testDatabase === undefined) {
    throw new Error('The test database is not ready.');
  }

  return testDatabase;
}

/**
 * Credential Key - Credential Key.
 *
 * Checks that a missing key gets a new one and costs only what the old key sealed,
 * and that a key file from another database stops startup instead.
 *
 * @since 4.0.0
 */
describe('credential key', () => {
  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'dsb-credential-key-'));
    testDatabase = await createTestDatabase();

    return;
  });

  afterEach(async () => {
    await getTestDatabase()['pool'].end();

    testDatabase = undefined;

    await rm(directory, {
      force: true,
      recursive: true,
    });

    return;
  });

  it('makes a key on the first start and keeps it', async () => {
    const keyPath: Lib_CredentialKey_Test_KeyPath = join(directory, 'secrets', 'credential.key');

    expect(await prepareCredentialKey(getTestDatabase()['pool'], keyPath)).toEqual([]);

    const key: Lib_CredentialKey_Test_Key = await readFile(keyPath);
    const mode: Lib_CredentialKey_Test_Mode = ((await stat(keyPath)).mode % 512).toString(8);

    expect(key).toHaveLength(32);

    expect(mode).toBe('600');

    expect(await prepareCredentialKey(getTestDatabase()['pool'], keyPath)).toEqual([]);

    expect(await readFile(keyPath)).toEqual(key);

    return;
  });

  it('removes what a lost key sealed and lists it until it is dismissed', async () => {
    const pool: Lib_CredentialKey_Test_Pool = getTestDatabase()['pool'];
    const keyPath: Lib_CredentialKey_Test_KeyPath = join(directory, 'secrets', 'credential.key');

    await prepareCredentialKey(pool, keyPath);

    const key: Lib_CredentialKey_Test_Key = await readFile(keyPath);

    await seedServer(pool, '1197999049190674442', 'Stonker Lounge');

    const ownerId: Lib_CredentialKey_Test_OwnerId = await createTestUser(pool, {
      allServers: true,
      role: 'owner',
      serverIds: [],
      username: 'owner',
    });
    const owner: Lib_CredentialKey_Test_Owner = {
      allServers: true,
      id: ownerId,
      role: 'owner',
      serverIds: [],
      username: 'owner',
    };
    const secondOwnerId: Lib_CredentialKey_Test_OwnerId = await createTestUser(pool, {
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'owner2',
    });
    const secondOwner: Lib_CredentialKey_Test_Owner = {
      allServers: true,
      id: secondOwnerId,
      role: 'operator',
      serverIds: [],
      username: 'owner2',
    };

    await pool.query('UPDATE bot_runtime_control SET discord_token_ciphertext = $1 WHERE singleton = TRUE', [encryptDiscordToken('fixture-bot-token', key)]);

    await pool.query('INSERT INTO guild_features (guild_id, feature_key, enabled) VALUES ($1, $2, TRUE)', [
      '1197999049190674442',
      'message-copiers',
    ]);

    await pool.query('INSERT INTO guild_feature_values (guild_id, feature_key, value_path, value_type, value_text) VALUES ($1, $2, $3, \'string\', $4)', [
      '1197999049190674442',
      'message-copiers',
      '$/webhook/$secret',
      'fixture-secret-key',
    ]);

    await pool.query('INSERT INTO guild_secrets (guild_id, secret_key, ciphertext) VALUES ($1, $2, $3)', [
      '1197999049190674442',
      'fixture-secret-key',
      encryptSecret('https://discord.com/api/webhooks/1/fixture', 'guild-secret:1197999049190674442:fixture-secret-key', key),
    ]);

    await pool.query('INSERT INTO panel_totp_credentials (user_id, secret_ciphertext, verified_at) VALUES ($1, $2, NOW())', [
      ownerId,
      encryptSecret('JBSWY3DPEHPK3PXP', `panel-totp:${ownerId}`, key),
    ]);

    await pool.query('INSERT INTO panel_recovery_codes (user_id, code_hash) VALUES ($1, $2)', [
      ownerId,
      'a'.repeat(64),
    ]);

    const modAlerts: Lib_CredentialKey_Test_Notification = await createNotificationTarget(pool, key, {
      events: ['bot-disconnected'],
      name: 'Mod alerts',
      secrets: { webhookUrl: 'https://discord.com/api/webhooks/1/fixture' },
      service: 'discord',
      settings: {},
    });

    await createNotificationTarget(pool, key, {
      events: ['secrets-removed'],
      name: 'Phone',
      secrets: {},
      service: 'ntfy',
      settings: { url: 'https://ntfy.sh/stonker-alerts' },
    });

    if (modAlerts === 'name-taken') {
      throw new Error('The fixture notification could not be stored.');
    }

    await rm(keyPath);

    const removedSecrets: Lib_CredentialKey_Test_RemovedSecrets = await prepareCredentialKey(pool, keyPath);

    expect(removedSecrets).toEqual([
      'the Bot Token',
      'the Message copiers secrets for Stonker Lounge',
      'the authenticator app for owner',
      'the Mod alerts notification',
    ]);

    expect((await pool.query('SELECT name, secrets_ciphertext, secret_fields, missing_secrets FROM notification_targets ORDER BY name')).rows).toEqual([
      {
        missing_secrets: ['webhookUrl'],
        name: 'Mod alerts',
        secret_fields: [],
        secrets_ciphertext: null,
      },
      {
        missing_secrets: [],
        name: 'Phone',
        secret_fields: [],
        secrets_ciphertext: null,
      },
    ]);

    expect(await readFile(keyPath)).not.toEqual(key);

    expect((await pool.query('SELECT discord_token_ciphertext FROM bot_runtime_control')).rows).toEqual([{
      discord_token_ciphertext: null,
    }]);

    const secretCount: Lib_CredentialKey_Test_Count = (await pool.query('SELECT COUNT(*)::text AS count FROM guild_secrets')).rows;
    const valueCount: Lib_CredentialKey_Test_Count = (await pool.query('SELECT COUNT(*)::text AS count FROM guild_feature_values')).rows;
    const totpCount: Lib_CredentialKey_Test_Count = (await pool.query('SELECT COUNT(*)::text AS count FROM panel_totp_credentials UNION ALL SELECT COUNT(*)::text FROM panel_recovery_codes')).rows;

    expect(secretCount).toEqual([{ count: '0' }]);

    expect(valueCount).toEqual([{ count: '1' }]);

    expect(totpCount).toEqual([
      { count: '0' },
      { count: '0' },
    ]);

    expect(await listRemovedSecrets(pool, owner)).toEqual([
      {
        kind: 'authenticator',
        removedAt: expect.any(String),
      },
      {
        kind: 'bot-token',
        removedAt: expect.any(String),
      },
      {
        featureKey: 'message-copiers',
        featureName: 'Message copiers',
        kind: 'feature-secrets',
        removedAt: expect.any(String),
        serverId: '1197999049190674442',
        serverName: 'Stonker Lounge',
      },
      {
        kind: 'notification',
        name: 'Mod alerts',
        notificationId: modAlerts['id'],
        removedAt: expect.any(String),
      },
    ]);

    expect(await listRemovedSecrets(pool, {
      allServers: true,
      id: '999999',
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    })).toEqual([]);

    const secondOwnerNotices: Lib_CredentialKey_Test_RemovedSecretNotices = await listRemovedSecrets(pool, secondOwner);
    const secondOwnerKinds: Lib_CredentialKey_Test_RemovedSecretKinds = secondOwnerNotices.map((notice) => notice['kind']);

    expect(secondOwnerKinds).toEqual([
      'bot-token',
      'feature-secrets',
      'notification',
    ]);

    await dismissRemovedSecrets(pool, owner);

    expect(await listRemovedSecrets(pool, owner)).toEqual([]);

    expect(await listRemovedSecrets(pool, secondOwner)).toEqual(secondOwnerNotices);

    expect(await prepareCredentialKey(pool, keyPath)).toEqual([]);

    return;
  });

  it('stops on a key file from another database or a damaged one', async () => {
    const keyPath: Lib_CredentialKey_Test_KeyPath = join(directory, 'secrets', 'credential.key');

    await prepareCredentialKey(getTestDatabase()['pool'], keyPath);

    await writeFile(keyPath, randomBytes(32));

    await expect(prepareCredentialKey(getTestDatabase()['pool'], keyPath)).rejects.toThrow('doesn\'t belong to this database');

    await writeFile(keyPath, 'short');

    await expect(prepareCredentialKey(getTestDatabase()['pool'], keyPath)).rejects.toThrow('exactly 32 bytes');

    return;
  });

  return;
});
