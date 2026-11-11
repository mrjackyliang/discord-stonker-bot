import {
  Client,
  Pool,
} from 'pg';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createTestDatabase } from '../tests/support/database.js';
import {
  claimNextJob,
  saveLegacyImport,
} from './database.js';

import type { PoolClient } from 'pg';
import type { Mock } from 'vitest';

import type {
  Lib_Database_Test_ConnectReturns,
  Lib_Database_Test_Job,
  Lib_Database_Test_Pool,
  Lib_Database_Test_QueryReturns,
  Lib_Database_Test_QueryRows,
  Lib_Database_Test_QueryText,
  Lib_Database_Test_QueryTexts,
  Lib_Database_Test_TestDatabase,
} from '../types/lib/database.d.ts';

/**
 * Database - Legacy Import Transaction.
 *
 * Verifies every destructive legacy-import write shares one database client
 * and one transaction so a later failure cannot leave a partial migration.
 *
 * @since 4.0.0
 */
describe('legacy import transaction', () => {
  it('uses one transaction for configuration, secrets, and report writes', async () => {
    const queryTexts: Lib_Database_Test_QueryTexts = [];
    const query: Mock = vi.fn(async (
      queryText: Lib_Database_Test_QueryText,
    ): Lib_Database_Test_QueryReturns => {
      queryTexts.push(queryText);
      const rows: Lib_Database_Test_QueryRows = [];

      if (queryText.includes('RETURNING revision::text') === true) {
        rows.push({
          revision: '2',
        });
      }

      return {
        command: '',
        fields: [],
        oid: 0,
        rowCount: 1,
        rows,
      };
    });
    const release: Mock = vi.fn();
    const client: PoolClient = Object.assign(new Client(), {
      query,
      release,
    });
    const pool: Pool = new Pool();
    const connect: Mock = vi.fn(async (): Lib_Database_Test_ConnectReturns => client);

    pool.connect = connect;

    await saveLegacyImport(
      pool,
      '1197999049190674442',
      {
        core: {},
        features: {},
      },
      [],
      {
        botTokenImported: true,
        enabled: [],
        imported: [],
        importedAt: '2026-10-22T12:00:00.000Z',
        needsAttention: [],
        secretsImported: 0,
        skipped: [],
        warnings: [],
      },
      'encrypted-discord-token',
    );

    expect(connect).toHaveBeenCalledTimes(1);

    expect(queryTexts.filter((queryText) => queryText === 'BEGIN')).toHaveLength(1);

    expect(queryTexts.filter((queryText) => queryText === 'COMMIT')).toHaveLength(1);

    expect(queryTexts.some((queryText) => queryText.includes(
      'SET discord_token_ciphertext = $1',
    ))).toBe(true);

    expect(release).toHaveBeenCalledTimes(1);

    await pool.end();

    return;
  });

  return;
});

/**
 * Database - Job Claiming.
 *
 * Verifies Discord work waits while the bot is stopped and a stale job already
 * at its attempt limit becomes failed instead of receiving another try.
 *
 * @since 4.0.0
 */
describe('job claiming', () => {
  it('does not spend Discord delivery attempts while the bot is stopped', async () => {
    const database: Lib_Database_Test_TestDatabase = await createTestDatabase();
    const pool: Lib_Database_Test_Pool = database['pool'];

    try {
      await pool.query('INSERT INTO jobs (type, payload) VALUES (\'discord.message.send\', \'{}\'::jsonb)');

      expect(await claimNextJob(pool, 'worker-one', 3)).toBeUndefined();

      expect((await pool.query('SELECT attempts, status FROM jobs')).rows).toEqual([{
        attempts: 0,
        status: 'pending',
      }]);

      await pool.query('UPDATE bot_runtime_control SET desired_state = \'running\', discord_token_ciphertext = \'fixture-token\' WHERE singleton = TRUE');

      expect(await claimNextJob(pool, 'worker-one', 3)).toEqual(expect.objectContaining({
        attempts: 1,
        type: 'discord.message.send',
      }));
    } finally {
      await pool.end();
    }

    return;
  });

  it('fails a stale job that has already reached its attempt limit', async () => {
    const database: Lib_Database_Test_TestDatabase = await createTestDatabase();
    const pool: Lib_Database_Test_Pool = database['pool'];

    try {
      await pool.query('INSERT INTO jobs (type, payload, status, attempts, locked_at, locked_by) VALUES (\'rss.feed.fetch\', \'{}\'::jsonb, \'running\', 3, NOW() - INTERVAL \'10 minutes\', \'gone-worker\')');

      expect(await claimNextJob(pool, 'worker-two', 3)).toBeUndefined();

      const job: Lib_Database_Test_Job = (await pool.query('SELECT attempts, last_error, locked_at, locked_by, status FROM jobs')).rows[0];

      expect(job).toEqual({
        attempts: 3,
        last_error: 'The worker stopped during the final attempt.',
        locked_at: null,
        locked_by: null,
        status: 'failed',
      });
    } finally {
      await pool.end();
    }

    return;
  });

  return;
});
