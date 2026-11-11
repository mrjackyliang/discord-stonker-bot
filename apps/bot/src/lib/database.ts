import { Pool } from 'pg';
import { z } from 'zod';

import {
  getNormalizedGuildSettings,
  replaceGuildConfiguration,
  writeGuildConfiguration,
} from './configuration-database.js';

import type {
  Lib_Database_ClaimNextJob_AttemptLimit,
  Lib_Database_ClaimNextJob_Client,
  Lib_Database_ClaimNextJob_Payload,
  Lib_Database_ClaimNextJob_Pool,
  Lib_Database_ClaimNextJob_Result,
  Lib_Database_ClaimNextJob_Returns,
  Lib_Database_ClaimNextJob_RowResult,
  Lib_Database_ClaimNextJob_WorkerIdentifier,
  Lib_Database_CompleteJob_JobIdentifier,
  Lib_Database_CompleteJob_Pool,
  Lib_Database_CompleteJob_Returns,
  Lib_Database_CreateDatabasePool_ApplicationName,
  Lib_Database_CreateDatabasePool_Configuration,
  Lib_Database_CreateDatabasePool_Returns,
  Lib_Database_EnqueueDurableJob_DedupeKey,
  Lib_Database_EnqueueDurableJob_Payload,
  Lib_Database_EnqueueDurableJob_Pool,
  Lib_Database_EnqueueDurableJob_Result,
  Lib_Database_EnqueueDurableJob_Returns,
  Lib_Database_EnqueueDurableJob_SerializedPayload,
  Lib_Database_EnqueueDurableJob_Type,
  Lib_Database_EnqueueRssItems_Client,
  Lib_Database_EnqueueRssItems_Etag,
  Lib_Database_EnqueueRssItems_FeedKey,
  Lib_Database_EnqueueRssItems_GuildIdentifier,
  Lib_Database_EnqueueRssItems_Initialized,
  Lib_Database_EnqueueRssItems_Jobs,
  Lib_Database_EnqueueRssItems_LastModified,
  Lib_Database_EnqueueRssItems_Pool,
  Lib_Database_EnqueueRssItems_Result,
  Lib_Database_EnqueueRssItems_Returns,
  Lib_Database_EnqueueRssItems_SeenItems,
  Lib_Database_EnqueueRssItems_SerializedJobs,
  Lib_Database_EnqueueRssItems_SerializedSeenItems,
  Lib_Database_EnqueueScheduledJobs_Client,
  Lib_Database_EnqueueScheduledJobs_Jobs,
  Lib_Database_EnqueueScheduledJobs_Pool,
  Lib_Database_EnqueueScheduledJobs_Result,
  Lib_Database_EnqueueScheduledJobs_Returns,
  Lib_Database_EnqueueScheduledJobs_ScannedThrough,
  Lib_Database_EnqueueScheduledJobs_SchedulerKey,
  Lib_Database_EnqueueScheduledJobs_SerializedJobs,
  Lib_Database_FailJob_AttemptLimit,
  Lib_Database_FailJob_ErrorMessage,
  Lib_Database_FailJob_JobIdentifier,
  Lib_Database_FailJob_Pool,
  Lib_Database_FailJob_Returns,
  Lib_Database_GetBotRuntimeControl_Pool,
  Lib_Database_GetBotRuntimeControl_Result,
  Lib_Database_GetBotRuntimeControl_Returns,
  Lib_Database_GetBotRuntimeControl_RowResult,
  Lib_Database_GetGuildSecrets_GuildIdentifier,
  Lib_Database_GetGuildSecrets_Pool,
  Lib_Database_GetGuildSecrets_Result,
  Lib_Database_GetGuildSecrets_Returns,
  Lib_Database_GetGuildSettings_GuildIdentifier,
  Lib_Database_GetGuildSettings_Pool,
  Lib_Database_GetGuildSettings_Returns,
  Lib_Database_GetRssFeedCursor_FeedKey,
  Lib_Database_GetRssFeedCursor_GuildIdentifier,
  Lib_Database_GetRssFeedCursor_Pool,
  Lib_Database_GetRssFeedCursor_Result,
  Lib_Database_GetRssFeedCursor_Returns,
  Lib_Database_GetRssFeedCursor_RowResult,
  Lib_Database_GetRssFeedCursor_SeenItems,
  Lib_Database_ListRuntimeHeartbeats_Pool,
  Lib_Database_ListRuntimeHeartbeats_Result,
  Lib_Database_ListRuntimeHeartbeats_Returns,
  Lib_Database_PingDatabase_Pool,
  Lib_Database_PingDatabase_Returns,
  Lib_Database_ReadSchedulerCursor_Pool,
  Lib_Database_ReadSchedulerCursor_Result,
  Lib_Database_ReadSchedulerCursor_Returns,
  Lib_Database_ReadSchedulerCursor_RowResult,
  Lib_Database_ReadSchedulerCursor_SchedulerKey,
  Lib_Database_RecordHeartbeat_Component,
  Lib_Database_RecordHeartbeat_Details,
  Lib_Database_RecordHeartbeat_Pool,
  Lib_Database_RecordHeartbeat_Returns,
  Lib_Database_RecordHeartbeat_Status,
  Lib_Database_RequestBotAction_Action,
  Lib_Database_RequestBotAction_Pool,
  Lib_Database_RequestBotAction_Result,
  Lib_Database_RequestBotAction_Returns,
  Lib_Database_SaveBotConfiguration_DatabaseTokenCiphertext,
  Lib_Database_SaveBotConfiguration_Pool,
  Lib_Database_SaveBotConfiguration_Result,
  Lib_Database_SaveBotConfiguration_Returns,
  Lib_Database_SaveBotConfiguration_RowResult,
  Lib_Database_SaveBotConfiguration_TokenCiphertext,
  Lib_Database_SaveDiscordApplicationIdentifier_ApplicationIdentifier,
  Lib_Database_SaveDiscordApplicationIdentifier_Pool,
  Lib_Database_SaveDiscordApplicationIdentifier_Returns,
  Lib_Database_SaveGuildSettings_GuildIdentifier,
  Lib_Database_SaveGuildSettings_Pool,
  Lib_Database_SaveGuildSettings_Returns,
  Lib_Database_SaveGuildSettings_Settings,
  Lib_Database_SaveLegacyImport_Client,
  Lib_Database_SaveLegacyImport_EncryptedSecrets,
  Lib_Database_SaveLegacyImport_GuildIdentifier,
  Lib_Database_SaveLegacyImport_Pool,
  Lib_Database_SaveLegacyImport_Report,
  Lib_Database_SaveLegacyImport_Returns,
  Lib_Database_SaveLegacyImport_Revision,
  Lib_Database_SaveLegacyImport_SerializedReport,
  Lib_Database_SaveLegacyImport_Settings,
  Lib_Database_SaveLegacyImport_TokenCiphertext,
  Lib_Database_UpdateRunningJobPayload_JobIdentifier,
  Lib_Database_UpdateRunningJobPayload_Payload,
  Lib_Database_UpdateRunningJobPayload_Pool,
  Lib_Database_UpdateRunningJobPayload_Result,
  Lib_Database_UpdateRunningJobPayload_Returns,
} from '../types/lib/database.d.ts';

/**
 * Database - JSON Object Schema.
 *
 * Verifies JSONB objects read from PostgreSQL before returning them to services.
 * Database state therefore receives the same boundary checks as HTTP input.
 *
 * @since 4.0.0
 */
const jsonObjectSchema = z.record(z.string(), z.unknown());

/**
 * Database - Rss Seen Items Schema.
 *
 * Bounds durable feed identifiers before worker code uses database state.
 * The cursor retains enough history for restart-safe duplicate suppression.
 *
 * @since 4.0.0
 */
const rssSeenItemsSchema = z.array(z.string().min(1).max(512)).max(500);

/**
 * Database - Claim Next Job.
 *
 * Claims one available job with a row lock that skips competing workers.
 * The transaction makes assignment durable before processing begins.
 *
 * @param {Lib_Database_ClaimNextJob_Pool}             pool             - Pool.
 * @param {Lib_Database_ClaimNextJob_WorkerIdentifier} workerIdentifier - Worker identifier.
 * @param {Lib_Database_ClaimNextJob_AttemptLimit}     attemptLimit     - Attempt limit.
 *
 * @returns {Lib_Database_ClaimNextJob_Returns}
 *
 * @since 4.0.0
 */
export async function claimNextJob(
  pool: Lib_Database_ClaimNextJob_Pool,
  workerIdentifier: Lib_Database_ClaimNextJob_WorkerIdentifier,
  attemptLimit: Lib_Database_ClaimNextJob_AttemptLimit,
): Lib_Database_ClaimNextJob_Returns {
  const client: Lib_Database_ClaimNextJob_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE jobs SET last_error = COALESCE(last_error, \'The worker stopped during the final attempt.\'), locked_at = NULL, locked_by = NULL, status = \'failed\', updated_at = NOW() WHERE status = \'running\' AND locked_at <= NOW() - INTERVAL \'5 minutes\' AND attempts >= $1',
      [attemptLimit],
    );

    const result: Lib_Database_ClaimNextJob_Result = await client.query(
      'WITH candidate AS (SELECT id FROM jobs WHERE ((status = \'pending\' AND available_at <= NOW()) OR (status = \'running\' AND locked_at <= NOW() - INTERVAL \'5 minutes\')) AND attempts < $2 AND (type NOT IN (\'discord.message.send\', \'discord.permissions.apply\') OR EXISTS (SELECT 1 FROM bot_runtime_control WHERE singleton = TRUE AND desired_state = \'running\' AND discord_token_ciphertext IS NOT NULL)) ORDER BY available_at, id FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE jobs SET attempts = attempts + 1, locked_at = NOW(), locked_by = $1, status = \'running\', updated_at = NOW() FROM candidate WHERE jobs.id = candidate.id RETURNING jobs.id::text, jobs.type, jobs.payload, jobs.attempts',
      [
        workerIdentifier,
        attemptLimit,
      ],
    );

    await client.query('COMMIT');

    const row: Lib_Database_ClaimNextJob_RowResult = result.rows[0];

    if (row === undefined) {
      return undefined;
    }

    const payload: Lib_Database_ClaimNextJob_Payload = jsonObjectSchema.parse(row['payload']);

    return {
      attempts: row['attempts'],
      id: row['id'],
      payload,
      type: row['type'],
    };
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Database - Update Running Job Payload.
 *
 * Persists progress inside a claimed job before a fallible follow-up step runs.
 * Losing ownership fails loudly rather than allowing an external action to repeat.
 *
 * @param {Lib_Database_UpdateRunningJobPayload_Pool}          pool          - Pool.
 * @param {Lib_Database_UpdateRunningJobPayload_JobIdentifier} jobIdentifier - Job identifier.
 * @param {Lib_Database_UpdateRunningJobPayload_Payload}       payload       - Payload.
 *
 * @returns {Lib_Database_UpdateRunningJobPayload_Returns}
 *
 * @since 4.0.0
 */
export async function updateRunningJobPayload(
  pool: Lib_Database_UpdateRunningJobPayload_Pool,
  jobIdentifier: Lib_Database_UpdateRunningJobPayload_JobIdentifier,
  payload: Lib_Database_UpdateRunningJobPayload_Payload,
): Lib_Database_UpdateRunningJobPayload_Returns {
  const result: Lib_Database_UpdateRunningJobPayload_Result = await pool.query(
    'UPDATE jobs SET payload = $2::jsonb, updated_at = NOW() WHERE id = $1 AND status = \'running\'',
    [
      jobIdentifier,
      JSON.stringify(payload),
    ],
  );

  if ((result.rowCount ?? 0) !== 1) {
    throw new Error('The running job no longer owns its durable payload.');
  }

  return;
}

/**
 * Database - Complete Job.
 *
 * Marks a claimed job complete and clears its transient ownership fields.
 * Durable completion makes worker restarts safe to retry.
 *
 * @param {Lib_Database_CompleteJob_Pool}          pool          - Pool.
 * @param {Lib_Database_CompleteJob_JobIdentifier} jobIdentifier - Job identifier.
 *
 * @returns {Lib_Database_CompleteJob_Returns}
 *
 * @since 4.0.0
 */
export async function completeJob(
  pool: Lib_Database_CompleteJob_Pool,
  jobIdentifier: Lib_Database_CompleteJob_JobIdentifier,
): Lib_Database_CompleteJob_Returns {
  await pool.query(
    'UPDATE jobs SET completed_at = NOW(), locked_at = NULL, locked_by = NULL, status = \'completed\', updated_at = NOW() WHERE id = $1 AND status = \'running\'',
    [jobIdentifier],
  );

  return;
}

/**
 * Database - Create Database Pool.
 *
 * Creates a bounded PostgreSQL pool with a distinct service identity.
 * Per-process pools keep failures and connection budgets isolated.
 *
 * @param {Lib_Database_CreateDatabasePool_Configuration}   configuration   - Configuration.
 * @param {Lib_Database_CreateDatabasePool_ApplicationName} applicationName - Application name.
 *
 * @returns {Lib_Database_CreateDatabasePool_Returns}
 *
 * @since 4.0.0
 */
export function createDatabasePool(
  configuration: Lib_Database_CreateDatabasePool_Configuration,
  applicationName: Lib_Database_CreateDatabasePool_ApplicationName,
): Lib_Database_CreateDatabasePool_Returns {
  return new Pool({
    application_name: applicationName,
    connectionString: configuration['connectionString'],
    max: configuration['maxConnections'],
  });
}

/**
 * Database - Enqueue Durable Job.
 *
 * Inserts one idempotent background job through the shared worker queue.
 * A repeated dedupe key is acknowledged without creating duplicate work.
 *
 * @param {Lib_Database_EnqueueDurableJob_Pool}      pool      - Pool.
 * @param {Lib_Database_EnqueueDurableJob_Type}      type      - Type.
 * @param {Lib_Database_EnqueueDurableJob_Payload}   payload   - Payload.
 * @param {Lib_Database_EnqueueDurableJob_DedupeKey} dedupeKey - Dedupe key.
 *
 * @returns {Lib_Database_EnqueueDurableJob_Returns}
 *
 * @since 4.0.0
 */
export async function enqueueDurableJob(
  pool: Lib_Database_EnqueueDurableJob_Pool,
  type: Lib_Database_EnqueueDurableJob_Type,
  payload: Lib_Database_EnqueueDurableJob_Payload,
  dedupeKey: Lib_Database_EnqueueDurableJob_DedupeKey,
): Lib_Database_EnqueueDurableJob_Returns {
  const serializedPayload: Lib_Database_EnqueueDurableJob_SerializedPayload = JSON.stringify(payload);
  const result: Lib_Database_EnqueueDurableJob_Result = await pool.query(
    'INSERT INTO jobs (dedupe_key, payload, type) VALUES ($1, $2::jsonb, $3) ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING',
    [
      dedupeKey,
      serializedPayload,
      type,
    ],
  );

  return result.rowCount === 1;
}

/**
 * Database - Enqueue Rss Items.
 *
 * Inserts deduplicated Discord delivery jobs and advances the feed cursor in one
 * transaction so a worker crash cannot acknowledge items without their jobs.
 *
 * @param {Lib_Database_EnqueueRssItems_Pool}            pool            - Pool.
 * @param {Lib_Database_EnqueueRssItems_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_Database_EnqueueRssItems_FeedKey}         feedKey         - Feed key.
 * @param {Lib_Database_EnqueueRssItems_Etag}            etag            - Etag.
 * @param {Lib_Database_EnqueueRssItems_LastModified}    lastModified    - Last modified.
 * @param {Lib_Database_EnqueueRssItems_SeenItems}       seenItems       - Seen items.
 * @param {Lib_Database_EnqueueRssItems_Initialized}     initialized     - Initialized.
 * @param {Lib_Database_EnqueueRssItems_Jobs}            jobs            - Jobs.
 *
 * @returns {Lib_Database_EnqueueRssItems_Returns}
 *
 * @since 4.0.0
 */
export async function enqueueRssItems(
  pool: Lib_Database_EnqueueRssItems_Pool,
  guildIdentifier: Lib_Database_EnqueueRssItems_GuildIdentifier,
  feedKey: Lib_Database_EnqueueRssItems_FeedKey,
  etag: Lib_Database_EnqueueRssItems_Etag,
  lastModified: Lib_Database_EnqueueRssItems_LastModified,
  seenItems: Lib_Database_EnqueueRssItems_SeenItems,
  initialized: Lib_Database_EnqueueRssItems_Initialized,
  jobs: Lib_Database_EnqueueRssItems_Jobs,
): Lib_Database_EnqueueRssItems_Returns {
  const client: Lib_Database_EnqueueRssItems_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const serializedJobs: Lib_Database_EnqueueRssItems_SerializedJobs = JSON.stringify(jobs);
    const result: Lib_Database_EnqueueRssItems_Result = await client.query(
      'INSERT INTO jobs (dedupe_key, payload, type) SELECT input.dedupe_key, input.payload, input.type FROM jsonb_to_recordset($1::jsonb) AS input(dedupe_key text, payload jsonb, type text) ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING',
      [serializedJobs],
    );
    const serializedSeenItems: Lib_Database_EnqueueRssItems_SerializedSeenItems = JSON.stringify(seenItems);

    await client.query(
      'INSERT INTO rss_feed_cursors (guild_id, feed_key, etag, last_modified, seen_items, initialized, updated_at) VALUES ($1, $2, $3, $4, $5::jsonb, $6, NOW()) ON CONFLICT (guild_id, feed_key) DO UPDATE SET etag = EXCLUDED.etag, last_modified = EXCLUDED.last_modified, seen_items = EXCLUDED.seen_items, initialized = EXCLUDED.initialized, updated_at = NOW()',
      [
        guildIdentifier,
        feedKey,
        etag ?? null,
        lastModified ?? null,
        serializedSeenItems,
        initialized,
      ],
    );

    await client.query('COMMIT');

    return result.rowCount ?? 0;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Database - Enqueue Scheduled Jobs.
 *
 * Inserts deduplicated jobs and advances their scheduler cursor in one
 * transaction. A crash therefore cannot persist a cursor without its jobs.
 *
 * @param {Lib_Database_EnqueueScheduledJobs_Pool}           pool           - Pool.
 * @param {Lib_Database_EnqueueScheduledJobs_SchedulerKey}   schedulerKey   - Scheduler key.
 * @param {Lib_Database_EnqueueScheduledJobs_ScannedThrough} scannedThrough - Scanned through.
 * @param {Lib_Database_EnqueueScheduledJobs_Jobs}           jobs           - Jobs.
 *
 * @returns {Lib_Database_EnqueueScheduledJobs_Returns}
 *
 * @since 4.0.0
 */
export async function enqueueScheduledJobs(
  pool: Lib_Database_EnqueueScheduledJobs_Pool,
  schedulerKey: Lib_Database_EnqueueScheduledJobs_SchedulerKey,
  scannedThrough: Lib_Database_EnqueueScheduledJobs_ScannedThrough,
  jobs: Lib_Database_EnqueueScheduledJobs_Jobs,
): Lib_Database_EnqueueScheduledJobs_Returns {
  const client: Lib_Database_EnqueueScheduledJobs_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const serializedJobs: Lib_Database_EnqueueScheduledJobs_SerializedJobs = JSON.stringify(jobs);
    const result: Lib_Database_EnqueueScheduledJobs_Result = await client.query(
      'INSERT INTO jobs (dedupe_key, payload, type) SELECT input.dedupe_key, input.payload, input.type FROM jsonb_to_recordset($1::jsonb) AS input(dedupe_key text, payload jsonb, type text) ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING',
      [serializedJobs],
    );

    await client.query(
      'INSERT INTO scheduler_cursors (scheduler_key, scanned_through, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (scheduler_key) DO UPDATE SET scanned_through = GREATEST(scheduler_cursors.scanned_through, EXCLUDED.scanned_through), updated_at = NOW()',
      [
        schedulerKey,
        scannedThrough,
      ],
    );

    await client.query('COMMIT');

    return result.rowCount ?? 0;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Database - Fail Job.
 *
 * Returns retryable jobs to the queue and permanently fails exhausted jobs.
 * A bounded error message preserves operator context without raw payloads.
 *
 * @param {Lib_Database_FailJob_Pool}          pool          - Pool.
 * @param {Lib_Database_FailJob_JobIdentifier} jobIdentifier - Job identifier.
 * @param {Lib_Database_FailJob_ErrorMessage}  errorMessage  - Error message.
 * @param {Lib_Database_FailJob_AttemptLimit}  attemptLimit  - Attempt limit.
 *
 * @returns {Lib_Database_FailJob_Returns}
 *
 * @since 4.0.0
 */
export async function failJob(
  pool: Lib_Database_FailJob_Pool,
  jobIdentifier: Lib_Database_FailJob_JobIdentifier,
  errorMessage: Lib_Database_FailJob_ErrorMessage,
  attemptLimit: Lib_Database_FailJob_AttemptLimit,
): Lib_Database_FailJob_Returns {
  await pool.query(
    'UPDATE jobs SET available_at = CASE WHEN attempts >= $3 THEN available_at ELSE NOW() + INTERVAL \'30 seconds\' END, last_error = LEFT($2, 500), locked_at = NULL, locked_by = NULL, status = CASE WHEN attempts >= $3 THEN \'failed\' ELSE \'pending\' END, updated_at = NOW() WHERE id = $1 AND status = \'running\'',
    [
      jobIdentifier,
      errorMessage,
      attemptLimit,
    ],
  );

  return;
}

/**
 * Database - Get Bot Runtime Control.
 *
 * Reads the singleton desired state and encrypted Discord configuration.
 * The bot reconciler and control panel share this durable source of truth.
 *
 * @param {Lib_Database_GetBotRuntimeControl_Pool} pool - Pool.
 *
 * @returns {Lib_Database_GetBotRuntimeControl_Returns}
 *
 * @since 4.0.0
 */
export async function getBotRuntimeControl(
  pool: Lib_Database_GetBotRuntimeControl_Pool,
): Lib_Database_GetBotRuntimeControl_Returns {
  const result: Lib_Database_GetBotRuntimeControl_Result = await pool.query(
    'SELECT desired_state, discord_application_id, discord_token_ciphertext, generation::text, updated_at FROM bot_runtime_control WHERE singleton = TRUE',
  );
  const row: Lib_Database_GetBotRuntimeControl_RowResult = result.rows[0];

  if (row === undefined) {
    throw new Error('PostgreSQL did not return the bot runtime control row.');
  }

  return {
    desiredState: row['desired_state'],
    discordApplicationId: row['discord_application_id'] ?? undefined,
    discordTokenCiphertext: row['discord_token_ciphertext'] ?? undefined,
    generation: Number.parseInt(row['generation'], 10),
    updatedAt: row['updated_at'].toISOString(),
  };
}

/**
 * Database - Get Guild Settings.
 *
 * Reads the current database-backed configuration for one Discord guild.
 * Missing rows remain distinct from an explicitly empty settings object.
 *
 * @param {Lib_Database_GetGuildSettings_Pool}            pool            - Pool.
 * @param {Lib_Database_GetGuildSettings_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_Database_GetGuildSettings_Returns}
 *
 * @since 4.0.0
 */
export async function getGuildSettings(
  pool: Lib_Database_GetGuildSettings_Pool,
  guildIdentifier: Lib_Database_GetGuildSettings_GuildIdentifier,
): Lib_Database_GetGuildSettings_Returns {
  return getNormalizedGuildSettings(pool, guildIdentifier);
}

/**
 * Database - Get Guild Secrets.
 *
 * Loads purpose-bound ciphertext for one guild without decrypting database state.
 * Callers decide which enabled integration may receive each plaintext value.
 *
 * @param {Lib_Database_GetGuildSecrets_Pool}            pool            - Pool.
 * @param {Lib_Database_GetGuildSecrets_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_Database_GetGuildSecrets_Returns}
 *
 * @since 4.0.0
 */
export async function getGuildSecrets(
  pool: Lib_Database_GetGuildSecrets_Pool,
  guildIdentifier: Lib_Database_GetGuildSecrets_GuildIdentifier,
): Lib_Database_GetGuildSecrets_Returns {
  const result: Lib_Database_GetGuildSecrets_Result = await pool.query(
    'SELECT secret_key, ciphertext FROM guild_secrets WHERE guild_id = $1 ORDER BY secret_key',
    [guildIdentifier],
  );
  return result.rows.map((row) => {
    return {
      ciphertext: row['ciphertext'],
      key: row['secret_key'],
    };
  });
}

/**
 * Database - Get Rss Feed Cursor.
 *
 * Reads conditional HTTP validators and bounded seen-item identifiers for one
 * server feed. Missing rows distinguish the initial no-backlog baseline fetch.
 *
 * @param {Lib_Database_GetRssFeedCursor_Pool}            pool            - Pool.
 * @param {Lib_Database_GetRssFeedCursor_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_Database_GetRssFeedCursor_FeedKey}         feedKey         - Feed key.
 *
 * @returns {Lib_Database_GetRssFeedCursor_Returns}
 *
 * @since 4.0.0
 */
export async function getRssFeedCursor(
  pool: Lib_Database_GetRssFeedCursor_Pool,
  guildIdentifier: Lib_Database_GetRssFeedCursor_GuildIdentifier,
  feedKey: Lib_Database_GetRssFeedCursor_FeedKey,
): Lib_Database_GetRssFeedCursor_Returns {
  const result: Lib_Database_GetRssFeedCursor_Result = await pool.query(
    'SELECT etag, initialized, last_modified, seen_items FROM rss_feed_cursors WHERE guild_id = $1 AND feed_key = $2',
    [
      guildIdentifier,
      feedKey,
    ],
  );
  const row: Lib_Database_GetRssFeedCursor_RowResult = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  const seenItems: Lib_Database_GetRssFeedCursor_SeenItems = rssSeenItemsSchema.parse(row['seen_items']);

  return {
    etag: row['etag'] ?? undefined,
    initialized: row['initialized'],
    lastModified: row['last_modified'] ?? undefined,
    seenItems,
  };
}

/**
 * Database - List Runtime Heartbeats.
 *
 * Returns the most recent health report from each supervised application process.
 * The control panel uses these rows without inspecting process internals.
 *
 * @param {Lib_Database_ListRuntimeHeartbeats_Pool} pool - Pool.
 *
 * @returns {Lib_Database_ListRuntimeHeartbeats_Returns}
 *
 * @since 4.0.0
 */
export async function listRuntimeHeartbeats(
  pool: Lib_Database_ListRuntimeHeartbeats_Pool,
): Lib_Database_ListRuntimeHeartbeats_Returns {
  const result: Lib_Database_ListRuntimeHeartbeats_Result = await pool.query(
    'SELECT component, details, observed_at, status FROM runtime_heartbeats ORDER BY component',
  );

  return result.rows.map((row) => ({
    component: row['component'],
    details: jsonObjectSchema.parse(row['details']),
    observedAt: row['observed_at'].toISOString(),
    status: row['status'],
  }));
}

/**
 * Database - Ping Database.
 *
 * Reports whether PostgreSQL can answer a minimal readiness query.
 * Health routes use a boolean instead of leaking connection errors.
 *
 * @param {Lib_Database_PingDatabase_Pool} pool - Pool.
 *
 * @returns {Lib_Database_PingDatabase_Returns}
 *
 * @since 4.0.0
 */
export async function pingDatabase(pool: Lib_Database_PingDatabase_Pool): Lib_Database_PingDatabase_Returns {
  try {
    await pool.query('SELECT 1');

    return true;
  } catch {
    return false;
  }
}

/**
 * Database - Record Heartbeat.
 *
 * Upserts one component's current state for readiness and operator visibility.
 * Each component owns only its row and refreshes it on a fixed interval.
 *
 * @param {Lib_Database_RecordHeartbeat_Pool}      pool      - Pool.
 * @param {Lib_Database_RecordHeartbeat_Component} component - Component.
 * @param {Lib_Database_RecordHeartbeat_Status}    status    - Status.
 * @param {Lib_Database_RecordHeartbeat_Details}   details   - Details.
 *
 * @returns {Lib_Database_RecordHeartbeat_Returns}
 *
 * @since 4.0.0
 */
export async function recordHeartbeat(
  pool: Lib_Database_RecordHeartbeat_Pool,
  component: Lib_Database_RecordHeartbeat_Component,
  status: Lib_Database_RecordHeartbeat_Status,
  details: Lib_Database_RecordHeartbeat_Details = {},
): Lib_Database_RecordHeartbeat_Returns {
  await pool.query(
    'INSERT INTO runtime_heartbeats (component, details, observed_at, status) VALUES ($1, $2::jsonb, NOW(), $3) ON CONFLICT (component) DO UPDATE SET details = EXCLUDED.details, observed_at = EXCLUDED.observed_at, status = EXCLUDED.status',
    [
      component,
      JSON.stringify(details),
      status,
    ],
  );

  return;
}

/**
 * Database - Read Scheduler Cursor.
 *
 * Returns the last instant durably scanned by one scheduler. Missing cursors
 * are distinct so the caller can initialize without replaying old history.
 *
 * @param {Lib_Database_ReadSchedulerCursor_Pool}         pool         - Pool.
 * @param {Lib_Database_ReadSchedulerCursor_SchedulerKey} schedulerKey - Scheduler key.
 *
 * @returns {Lib_Database_ReadSchedulerCursor_Returns}
 *
 * @since 4.0.0
 */
export async function readSchedulerCursor(
  pool: Lib_Database_ReadSchedulerCursor_Pool,
  schedulerKey: Lib_Database_ReadSchedulerCursor_SchedulerKey,
): Lib_Database_ReadSchedulerCursor_Returns {
  const result: Lib_Database_ReadSchedulerCursor_Result = await pool.query(
    'SELECT scanned_through FROM scheduler_cursors WHERE scheduler_key = $1',
    [schedulerKey],
  );
  const row: Lib_Database_ReadSchedulerCursor_RowResult = result.rows[0];

  return (row === undefined) ? undefined : row['scanned_through'];
}

/**
 * Database - Request Bot Action.
 *
 * Advances the control generation so the bot service observes every operator
 * action, while start and restart fail closed until credentials are configured.
 *
 * @param {Lib_Database_RequestBotAction_Pool}   pool   - Pool.
 * @param {Lib_Database_RequestBotAction_Action} action - Action.
 *
 * @returns {Lib_Database_RequestBotAction_Returns}
 *
 * @since 4.0.0
 */
export async function requestBotAction(
  pool: Lib_Database_RequestBotAction_Pool,
  action: Lib_Database_RequestBotAction_Action,
): Lib_Database_RequestBotAction_Returns {
  if (action === 'stop') {
    const result: Lib_Database_RequestBotAction_Result = await pool.query(
      'UPDATE bot_runtime_control SET desired_state = \'stopped\', generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE RETURNING singleton',
    );

    return result.rowCount === 1;
  }

  const result: Lib_Database_RequestBotAction_Result = await pool.query(
    'UPDATE bot_runtime_control SET desired_state = \'running\', generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE AND discord_token_ciphertext IS NOT NULL RETURNING singleton',
  );

  return result.rowCount === 1;
}

/**
 * Database - Save Bot Configuration.
 *
 * Stores optional replacement ciphertext, then advances the generation so a
 * running Gateway reloads corrected credentials immediately.
 *
 * @param {Lib_Database_SaveBotConfiguration_Pool}            pool              - Pool.
 * @param {Lib_Database_SaveBotConfiguration_TokenCiphertext} [tokenCiphertext] - Token ciphertext.
 *
 * @returns {Lib_Database_SaveBotConfiguration_Returns}
 *
 * @since 4.0.0
 */
export async function saveBotConfiguration(
  pool: Lib_Database_SaveBotConfiguration_Pool,
  tokenCiphertext: Lib_Database_SaveBotConfiguration_TokenCiphertext,
): Lib_Database_SaveBotConfiguration_Returns {
  const databaseTokenCiphertext: Lib_Database_SaveBotConfiguration_DatabaseTokenCiphertext = tokenCiphertext
    ?? null;
  const result: Lib_Database_SaveBotConfiguration_Result = await pool.query(
    'UPDATE bot_runtime_control SET discord_token_ciphertext = COALESCE($1::text, discord_token_ciphertext), generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE RETURNING generation::text',
    [databaseTokenCiphertext],
  );
  const row: Lib_Database_SaveBotConfiguration_RowResult = result.rows[0];

  if (row === undefined) {
    throw new Error('PostgreSQL did not return a bot configuration generation.');
  }

  if (tokenCiphertext !== undefined) {
    await pool.query('DELETE FROM removed_secrets WHERE kind = \'bot-token\'');
  }

  return Number.parseInt(row['generation'], 10);
}

/**
 * Database - Save Discord Application Identifier.
 *
 * Records non-secret OAuth metadata learned from a successful Gateway login.
 * The panel can then build Discord's server-install URL without asking an
 * operator to copy application or server identifiers.
 *
 * @param {Lib_Database_SaveDiscordApplicationIdentifier_Pool}                  pool                  - Pool.
 * @param {Lib_Database_SaveDiscordApplicationIdentifier_ApplicationIdentifier} applicationIdentifier - Application identifier.
 *
 * @returns {Lib_Database_SaveDiscordApplicationIdentifier_Returns}
 *
 * @since 4.0.0
 */
export async function saveDiscordApplicationIdentifier(
  pool: Lib_Database_SaveDiscordApplicationIdentifier_Pool,
  applicationIdentifier: Lib_Database_SaveDiscordApplicationIdentifier_ApplicationIdentifier,
): Lib_Database_SaveDiscordApplicationIdentifier_Returns {
  await pool.query(
    'UPDATE bot_runtime_control SET discord_application_id = $1, updated_at = NOW() WHERE singleton = TRUE',
    [applicationIdentifier],
  );

  return;
}

/**
 * Database - Save Guild Settings.
 *
 * Upserts validated JSON configuration and advances a monotonic revision.
 * Bot modules can compare revisions without relying on notifications alone.
 *
 * @param {Lib_Database_SaveGuildSettings_Pool}            pool            - Pool.
 * @param {Lib_Database_SaveGuildSettings_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_Database_SaveGuildSettings_Settings}        settings        - Settings.
 *
 * @returns {Lib_Database_SaveGuildSettings_Returns}
 *
 * @since 4.0.0
 */
export async function saveGuildSettings(
  pool: Lib_Database_SaveGuildSettings_Pool,
  guildIdentifier: Lib_Database_SaveGuildSettings_GuildIdentifier,
  settings: Lib_Database_SaveGuildSettings_Settings,
): Lib_Database_SaveGuildSettings_Returns {
  return replaceGuildConfiguration(pool, guildIdentifier, settings);
}

/**
 * Database - Save Legacy Import.
 *
 * Commits migrated settings, purpose-bound ciphertext, an optional bot token,
 * and an operator-visible report as one PostgreSQL transaction.
 *
 * @param {Lib_Database_SaveLegacyImport_Pool}              pool              - Pool.
 * @param {Lib_Database_SaveLegacyImport_GuildIdentifier}   guildIdentifier   - Guild identifier.
 * @param {Lib_Database_SaveLegacyImport_Settings}          settings          - Settings.
 * @param {Lib_Database_SaveLegacyImport_EncryptedSecrets}  encryptedSecrets  - Encrypted secrets.
 * @param {Lib_Database_SaveLegacyImport_Report}            report            - Report.
 * @param {Lib_Database_SaveLegacyImport_TokenCiphertext}   [tokenCiphertext] - Token ciphertext.
 *
 * @returns {Lib_Database_SaveLegacyImport_Returns}
 *
 * @since 4.0.0
 */
export async function saveLegacyImport(
  pool: Lib_Database_SaveLegacyImport_Pool,
  guildIdentifier: Lib_Database_SaveLegacyImport_GuildIdentifier,
  settings: Lib_Database_SaveLegacyImport_Settings,
  encryptedSecrets: Lib_Database_SaveLegacyImport_EncryptedSecrets,
  report: Lib_Database_SaveLegacyImport_Report,
  tokenCiphertext?: Lib_Database_SaveLegacyImport_TokenCiphertext,
): Lib_Database_SaveLegacyImport_Returns {
  const client: Lib_Database_SaveLegacyImport_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const revision: Lib_Database_SaveLegacyImport_Revision = await writeGuildConfiguration(
      client,
      guildIdentifier,
      settings,
    );

    await client.query(
      'DELETE FROM guild_secrets WHERE guild_id = $1',
      [guildIdentifier],
    );

    await client.query(
      'DELETE FROM removed_secrets WHERE kind = \'feature-secrets\' AND guild_id = $1',
      [guildIdentifier],
    );

    for (const encryptedSecret of encryptedSecrets) {
      await client.query(
        'INSERT INTO guild_secrets (guild_id, secret_key, ciphertext, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (guild_id, secret_key) DO UPDATE SET ciphertext = EXCLUDED.ciphertext, updated_at = NOW()',
        [
          guildIdentifier,
          encryptedSecret['key'],
          encryptedSecret['ciphertext'],
        ],
      );
    }

    const serializedReport: Lib_Database_SaveLegacyImport_SerializedReport = JSON.stringify(report);

    await client.query(
      'INSERT INTO legacy_imports (guild_id, report) VALUES ($1, $2::jsonb)',
      [
        guildIdentifier,
        serializedReport,
      ],
    );

    if (tokenCiphertext !== undefined) {
      await client.query(
        'UPDATE bot_runtime_control SET discord_token_ciphertext = $1, updated_at = NOW() WHERE singleton = TRUE',
        [tokenCiphertext],
      );

      await client.query('DELETE FROM removed_secrets WHERE kind = \'bot-token\'');
    }

    await client.query('COMMIT');

    return revision;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}
