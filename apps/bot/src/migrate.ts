import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { prepareCredentialKey } from './lib/credential-key.js';
import { createDatabasePool } from './lib/database.js';
import {
  getErrorMessage,
  writeLog,
} from './lib/logger.js';
import { notifySecretsRemoved } from './lib/notifier.js';
import { readRuntimeConfiguration } from './lib/runtime.js';

import type {
  Migrate_ApplyMigration_Checksum,
  Migrate_ApplyMigration_Client,
  Migrate_ApplyMigration_Contents,
  Migrate_ApplyMigration_ExistingResult,
  Migrate_ApplyMigration_ExistingRowResult,
  Migrate_ApplyMigration_Name,
  Migrate_ApplyMigration_Returns,
  Migrate_Main_Returns,
  Migrate_RunMigrations_Client,
  Migrate_RunMigrations_Configuration,
  Migrate_RunMigrations_Contents,
  Migrate_RunMigrations_FileNames,
  Migrate_RunMigrations_MigrationFileNames,
  Migrate_RunMigrations_MigrationPath,
  Migrate_RunMigrations_MigrationsDirectory,
  Migrate_RunMigrations_Pool,
  Migrate_RunMigrations_RemovedSecrets,
  Migrate_RunMigrations_Returns,
} from './types/migrate.d.ts';

/**
 * Migrate - Bootstrap Statement.
 *
 * Creates the migration ledger before versioned SQL files are inspected.
 * The ledger checksum prevents an applied migration from changing silently.
 *
 * @since 4.0.0
 */
const BOOTSTRAP_STATEMENT = 'CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())';

/**
 * Migrate - Apply Migration.
 *
 * Applies one immutable SQL migration inside an explicit transaction.
 * Repeated starts skip matching entries and reject checksum drift.
 *
 * @param {Migrate_ApplyMigration_Client}   client   - Client.
 * @param {Migrate_ApplyMigration_Name}     name     - Name.
 * @param {Migrate_ApplyMigration_Contents} contents - Contents.
 *
 * @returns {Migrate_ApplyMigration_Returns}
 *
 * @since 4.0.0
 */
async function applyMigration(
  client: Migrate_ApplyMigration_Client,
  name: Migrate_ApplyMigration_Name,
  contents: Migrate_ApplyMigration_Contents,
): Migrate_ApplyMigration_Returns {
  const checksum: Migrate_ApplyMigration_Checksum = createHash('sha256').update(contents).digest('hex');
  const existingResult: Migrate_ApplyMigration_ExistingResult = await client.query(
    'SELECT checksum FROM schema_migrations WHERE name = $1',
    [name],
  );
  const existingRow: Migrate_ApplyMigration_ExistingRowResult = existingResult.rows[0];

  if (existingRow !== undefined) {
    if (existingRow['checksum'] !== checksum) {
      throw new Error(`Migration "${name}" changed after it was applied.`);
    }

    return;
  }

  try {
    await client.query('BEGIN');

    await client.query(contents);

    await client.query(
      'INSERT INTO schema_migrations (name, checksum) VALUES ($1, $2)',
      [
        name,
        checksum,
      ],
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  }

  writeLog('info', 'migration', 'migration_applied', {
    name,
  });

  return;
}

/**
 * Migrate - Main.
 *
 * Converts migration failures into a non-zero process result for s6.
 * Structured logs retain the affected service without exposing SQL contents.
 *
 * @returns {Migrate_Main_Returns}
 *
 * @since 4.0.0
 */
async function main(): Migrate_Main_Returns {
  try {
    await runMigrations();
  } catch (error) {
    writeLog('error', 'migration', 'migration_failed', {
      error: getErrorMessage(error),
    });

    process.exitCode = 1;
  }

  return;
}

/**
 * Migrate - Run Migrations.
 *
 * Loads ordered SQL files from the image, applies each once, and checks the credential key.
 * Sequential execution is intentional because schema order is significant.
 *
 * @returns {Migrate_RunMigrations_Returns}
 *
 * @since 4.0.0
 */
async function runMigrations(): Migrate_RunMigrations_Returns {
  const configuration: Migrate_RunMigrations_Configuration = readRuntimeConfiguration();
  const migrationsDirectory: Migrate_RunMigrations_MigrationsDirectory = process.env['MIGRATIONS_DIRECTORY']
    ?? resolve(process.cwd(), 'migrations');
  const pool: Migrate_RunMigrations_Pool = createDatabasePool(configuration['database'], 'stonker-migration');

  try {
    await pool.query(BOOTSTRAP_STATEMENT);

    const fileNames: Migrate_RunMigrations_FileNames = await readdir(migrationsDirectory);
    const migrationFileNames: Migrate_RunMigrations_MigrationFileNames = fileNames
      .filter((fileName) => fileName.endsWith('.sql'))
      .sort();
    const client: Migrate_RunMigrations_Client = await pool.connect();

    try {
      for (const migrationFileName of migrationFileNames) {
        const migrationPath: Migrate_RunMigrations_MigrationPath = resolve(
          migrationsDirectory,
          migrationFileName,
        );
        const contents: Migrate_RunMigrations_Contents = await readFile(migrationPath, 'utf8');

        await applyMigration(client, migrationFileName, contents);
      }
    } finally {
      client.release();
    }

    const removedSecrets: Migrate_RunMigrations_RemovedSecrets = await prepareCredentialKey(pool, configuration['bot']['credentialKeyFile']);

    if (removedSecrets.length > 0) {
      writeLog('warn', 'migration', 'credential_key_replaced', {
        message: `No credential key was found at ${configuration['bot']['credentialKeyFile']}, so Stonker Bot for Discord made a new one. These saved secrets were locked with the old key and were removed: ${removedSecrets.join(', ')}. Enter them again in the control panel.`,
      });

      await notifySecretsRemoved(pool, removedSecrets).catch((error) => {
        writeLog('error', 'migration', 'notification_queue_failed', {
          error: getErrorMessage(error),
        });

        return;
      });
    }
  } finally {
    await pool.end();
  }

  writeLog('info', 'migration', 'migrations_ready');

  return;
}

await main();
