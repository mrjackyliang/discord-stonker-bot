import { listNormalizedGuildSettings } from './configuration-database.js';
import {
  enqueueScheduledJobs,
  getBotRuntimeControl,
  readSchedulerCursor,
} from './database.js';
import { prepareWorkerFeatures } from './worker-features.js';

import type {
  Lib_WorkerScheduler_GetScanInstants_CurrentInstant,
  Lib_WorkerScheduler_GetScanInstants_CurrentTimestamp,
  Lib_WorkerScheduler_GetScanInstants_EarliestTimestamp,
  Lib_WorkerScheduler_GetScanInstants_Instants,
  Lib_WorkerScheduler_GetScanInstants_PreviousInstant,
  Lib_WorkerScheduler_GetScanInstants_PreviousTimestamp,
  Lib_WorkerScheduler_GetScanInstants_Returns,
  Lib_WorkerScheduler_GetScanInstants_StartTimestamp,
  Lib_WorkerScheduler_ScheduleFeatureJobs_ActiveFeatureKeys,
  Lib_WorkerScheduler_ScheduleFeatureJobs_ConfigurationErrors,
  Lib_WorkerScheduler_ScheduleFeatureJobs_CurrentDate,
  Lib_WorkerScheduler_ScheduleFeatureJobs_EnqueuedCount,
  Lib_WorkerScheduler_ScheduleFeatureJobs_Instants,
  Lib_WorkerScheduler_ScheduleFeatureJobs_Jobs,
  Lib_WorkerScheduler_ScheduleFeatureJobs_Pool,
  Lib_WorkerScheduler_ScheduleFeatureJobs_Prepared,
  Lib_WorkerScheduler_ScheduleFeatureJobs_PreviousInstant,
  Lib_WorkerScheduler_ScheduleFeatureJobs_Returns,
  Lib_WorkerScheduler_ScheduleFeatureJobs_RuntimeControl,
  Lib_WorkerScheduler_ScheduleFeatureJobs_ScannedThrough,
  Lib_WorkerScheduler_ScheduleFeatureJobs_SettingsEntries,
} from '../types/lib/worker-scheduler.d.ts';

/**
 * Worker Scheduler - Maximum Replay Milliseconds.
 *
 * Replays at most one day after worker downtime to bound startup work. Durable
 * cursor progress still prevents duplicate queue entries within that window.
 *
 * @since 4.0.0
 */
const MAXIMUM_REPLAY_MILLISECONDS = 86_400_000;

/**
 * Worker Scheduler - Scheduler Key.
 *
 * Identifies the single-appliance feature scan cursor in PostgreSQL.
 * One installation currently owns one configured Discord server.
 *
 * @since 4.0.0
 */
const SCHEDULER_KEY = 'worker-features';

/**
 * Worker Scheduler - Get Scan Instants.
 *
 * Returns each whole second after the durable cursor through the current second.
 * A one-day replay bound avoids unbounded work after prolonged downtime.
 *
 * @param {Lib_WorkerScheduler_GetScanInstants_PreviousInstant} previousInstant - Previous instant.
 * @param {Lib_WorkerScheduler_GetScanInstants_CurrentInstant}  currentInstant  - Current instant.
 *
 * @returns {Lib_WorkerScheduler_GetScanInstants_Returns}
 *
 * @since 4.0.0
 */
export function getScanInstants(
  previousInstant: Lib_WorkerScheduler_GetScanInstants_PreviousInstant,
  currentInstant: Lib_WorkerScheduler_GetScanInstants_CurrentInstant,
): Lib_WorkerScheduler_GetScanInstants_Returns {
  const currentTimestamp: Lib_WorkerScheduler_GetScanInstants_CurrentTimestamp = currentInstant.getTime();
  const earliestTimestamp: Lib_WorkerScheduler_GetScanInstants_EarliestTimestamp = currentTimestamp
    - MAXIMUM_REPLAY_MILLISECONDS
    + 1_000;
  const previousTimestamp: Lib_WorkerScheduler_GetScanInstants_PreviousTimestamp = (previousInstant === undefined) ? currentTimestamp - 1_000 : previousInstant.getTime();
  const startTimestamp: Lib_WorkerScheduler_GetScanInstants_StartTimestamp = Math.max(
    previousTimestamp + 1_000,
    earliestTimestamp,
  );
  const instants: Lib_WorkerScheduler_GetScanInstants_Instants = [];

  for (let timestamp = startTimestamp; timestamp <= currentTimestamp; timestamp += 1_000) {
    instants.push(new Date(timestamp));
  }

  return instants;
}

/**
 * Worker Scheduler - Schedule Feature Jobs.
 *
 * Reads every current server, compiles enabled worker modules, and commits
 * deduplicated due jobs with the advanced cursor in one database transaction.
 *
 * @param {Lib_WorkerScheduler_ScheduleFeatureJobs_Pool}        pool        - Pool.
 * @param {Lib_WorkerScheduler_ScheduleFeatureJobs_CurrentDate} currentDate - Current date.
 *
 * @returns {Lib_WorkerScheduler_ScheduleFeatureJobs_Returns}
 *
 * @since 4.0.0
 */
export async function scheduleFeatureJobs(
  pool: Lib_WorkerScheduler_ScheduleFeatureJobs_Pool,
  currentDate: Lib_WorkerScheduler_ScheduleFeatureJobs_CurrentDate = new Date(),
): Lib_WorkerScheduler_ScheduleFeatureJobs_Returns {
  const scannedThrough: Lib_WorkerScheduler_ScheduleFeatureJobs_ScannedThrough = new Date(
    Math.floor(currentDate.getTime() / 1_000) * 1_000,
  );
  const previousInstant: Lib_WorkerScheduler_ScheduleFeatureJobs_PreviousInstant = await readSchedulerCursor(
    pool,
    SCHEDULER_KEY,
  );
  const instants: Lib_WorkerScheduler_ScheduleFeatureJobs_Instants = getScanInstants(
    previousInstant,
    scannedThrough,
  );
  const runtimeControl: Lib_WorkerScheduler_ScheduleFeatureJobs_RuntimeControl = await getBotRuntimeControl(pool);
  let activeFeatureKeys: Lib_WorkerScheduler_ScheduleFeatureJobs_ActiveFeatureKeys = [];
  const configurationErrors: Lib_WorkerScheduler_ScheduleFeatureJobs_ConfigurationErrors = [];
  const jobs: Lib_WorkerScheduler_ScheduleFeatureJobs_Jobs = [];

  if (
    runtimeControl['desiredState'] === 'running'
    && runtimeControl['discordTokenCiphertext'] !== undefined
  ) {
    const settingsEntries: Lib_WorkerScheduler_ScheduleFeatureJobs_SettingsEntries = await listNormalizedGuildSettings(
      pool,
    );

    for (const settingsEntry of settingsEntries) {
      const prepared: Lib_WorkerScheduler_ScheduleFeatureJobs_Prepared = prepareWorkerFeatures(
        settingsEntry['settings'],
      );

      activeFeatureKeys.push(...prepared['activeFeatureKeys']);

      configurationErrors.push(
        ...prepared['configurationErrors'].map(
          (error) => `${settingsEntry['guildIdentifier']}: ${error}`,
        ),
      );

      jobs.push(...prepared.collectJobs(settingsEntry['guildIdentifier'], instants));
    }

    activeFeatureKeys = [...new Set(activeFeatureKeys)];
  }

  const enqueuedCount: Lib_WorkerScheduler_ScheduleFeatureJobs_EnqueuedCount = await enqueueScheduledJobs(
    pool,
    SCHEDULER_KEY,
    scannedThrough,
    jobs,
  );

  return {
    activeFeatureKeys,
    configurationErrors,
    enqueuedCount,
    scannedThrough: scannedThrough.toISOString(),
  };
}
