import {
  REST,
  Routes,
} from 'discord.js';

import {
  decryptDiscordToken,
  readCredentialKey,
} from './lib/credential-vault.js';
import {
  claimNextJob,
  completeJob,
  createDatabasePool,
  failJob,
  getBotRuntimeControl,
  getGuildSettings,
  recordHeartbeat,
  updateRunningJobPayload,
} from './lib/database.js';
import { followDebugLogging } from './lib/debug-logging.js';
import { timedPool, watchRestRateLimits } from './lib/debug-timing.js';
import {
  configureLogPersistence,
  getErrorMessage,
  writeLog,
} from './lib/logger.js';
import {
  deliverNotificationJob,
  NOTIFICATION_JOB_TYPE,
  notifyJobFailed,
} from './lib/notifier.js';
import { processRssFetchJob } from './lib/rss-worker.js';
import {
  readRuntimeConfiguration,
  sleep,
} from './lib/runtime.js';
import {
  parseDiscordMessageJob,
  parseDiscordMessageResponse,
  parseDiscordPermissionJob,
} from './lib/worker-features.js';
import { scheduleFeatureJobs } from './lib/worker-scheduler.js';

import type {
  Worker_Main_Configuration,
  Worker_Main_CredentialKey,
  Worker_Main_ErrorMessage,
  Worker_Main_HeartbeatTimer,
  Worker_Main_Job,
  Worker_Main_JobElapsed,
  Worker_Main_JobStartedAt,
  Worker_Main_NextSchedulerAt,
  Worker_Main_Pool,
  Worker_Main_Returns,
  Worker_Main_SchedulerSummary,
  Worker_Main_Stop,
  Worker_Main_StopDebugLogging,
  Worker_Main_Stopping,
  Worker_Main_WorkerIdentifier,
  Worker_ProcessDiscordMessageJob_CredentialKey,
  Worker_ProcessDiscordMessageJob_DiscordToken,
  Worker_ProcessDiscordMessageJob_Job,
  Worker_ProcessDiscordMessageJob_MessageIdentifier,
  Worker_ProcessDiscordMessageJob_Payload,
  Worker_ProcessDiscordMessageJob_Pool,
  Worker_ProcessDiscordMessageJob_ReactionTasks,
  Worker_ProcessDiscordMessageJob_Response,
  Worker_ProcessDiscordMessageJob_Rest,
  Worker_ProcessDiscordMessageJob_Returns,
  Worker_ProcessDiscordMessageJob_RuntimeControl,
  Worker_ProcessDiscordPermissionJob_CredentialKey,
  Worker_ProcessDiscordPermissionJob_DiscordToken,
  Worker_ProcessDiscordPermissionJob_Job,
  Worker_ProcessDiscordPermissionJob_Payload,
  Worker_ProcessDiscordPermissionJob_Pool,
  Worker_ProcessDiscordPermissionJob_Rest,
  Worker_ProcessDiscordPermissionJob_Returns,
  Worker_ProcessDiscordPermissionJob_RuntimeControl,
  Worker_ProcessDiscordPermissionJob_Tasks,
  Worker_ProcessJob_CredentialKey,
  Worker_ProcessJob_Job,
  Worker_ProcessJob_Pool,
  Worker_ProcessJob_Returns,
  Worker_Run_Returns,
  Worker_SlowJobMilliseconds,
} from './types/worker.d.ts';

/**
 * Worker - Slow Job Milliseconds.
 *
 * How long a job has to take before Debug logging notes it.
 * Most jobs finish well inside a second.
 *
 * @since UNRELEASED
 */
const SLOW_JOB_MILLISECONDS: Worker_SlowJobMilliseconds = 1_000;

/**
 * Worker - Main.
 *
 * Claims durable jobs without blocking the Discord Gateway process.
 * SIGTERM stops new claims before the PostgreSQL pool is drained.
 *
 * @returns {Worker_Main_Returns}
 *
 * @since 4.0.0
 */
async function main(): Worker_Main_Returns {
  const configuration: Worker_Main_Configuration = readRuntimeConfiguration();
  const pool: Worker_Main_Pool = timedPool(createDatabasePool(configuration['database'], 'stonker-worker'), 'worker');

  configureLogPersistence(pool);

  const stopDebugLogging: Worker_Main_StopDebugLogging = followDebugLogging(pool, 'worker');
  const credentialKey: Worker_Main_CredentialKey = await readCredentialKey(
    configuration['bot']['credentialKeyFile'],
  );
  const workerIdentifier: Worker_Main_WorkerIdentifier = process.env['HOSTNAME'] ?? 'single-container-worker';
  let stopping: Worker_Main_Stopping = false;
  let nextSchedulerAt: Worker_Main_NextSchedulerAt = 0;
  let schedulerSummary: Worker_Main_SchedulerSummary = {
    activeFeatureKeys: [],
    configurationErrors: [],
    enqueuedCount: 0,
    scannedThrough: undefined,
  };

  /**
   * Worker - Main - Stop.
   *
   * Prevents additional durable jobs from being claimed during shutdown.
   * The active job is allowed to reach its durable terminal state.
   *
   * @returns {void}
   *
   * @since 4.0.0
   */
  const stop: Worker_Main_Stop = () => {
    stopping = true;

    return;
  };

  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);

  await recordHeartbeat(pool, 'worker', 'ready', {
    activeFeatureKeys: schedulerSummary['activeFeatureKeys'],
    configurationErrors: schedulerSummary['configurationErrors'],
    scannedThrough: schedulerSummary['scannedThrough'],
    workerIdentifier,
  });

  const heartbeatTimer: Worker_Main_HeartbeatTimer = setInterval(() => {
    void recordHeartbeat(pool, 'worker', 'ready', {
      activeFeatureKeys: schedulerSummary['activeFeatureKeys'],
      configurationErrors: schedulerSummary['configurationErrors'],
      scannedThrough: schedulerSummary['scannedThrough'],
      workerIdentifier,
    }).catch((error) => {
      writeLog('error', 'worker', 'heartbeat_failed', {
        error: getErrorMessage(error),
      });

      return;
    });

    return;
  }, 30_000);

  writeLog('info', 'worker', 'worker_ready', {
    workerIdentifier,
  });

  try {
    while (stopping === false) {
      if (Date.now() >= nextSchedulerAt) {
        nextSchedulerAt = Date.now() + 1_000;

        try {
          schedulerSummary = await scheduleFeatureJobs(pool);
        } catch (error) {
          nextSchedulerAt = Date.now() + 5_000;

          writeLog('error', 'worker', 'scheduler_scan_failed', {
            error: getErrorMessage(error),
          });
        }
      }

      const job: Worker_Main_Job = await claimNextJob(pool, workerIdentifier, configuration['worker']['attemptLimit']);

      if (job === undefined) {
        await sleep(configuration['worker']['pollIntervalMilliseconds']);

        continue;
      }

      const jobStartedAt: Worker_Main_JobStartedAt = Date.now();

      try {
        await processJob(job, pool, credentialKey);

        await completeJob(pool, job['id']);

        writeLog('info', 'worker', 'job_completed', {
          jobId: job['id'],
          jobType: job['type'],
        });
      } catch (error) {
        const errorMessage: Worker_Main_ErrorMessage = getErrorMessage(error);

        await failJob(
          pool,
          job['id'],
          errorMessage,
          configuration['worker']['attemptLimit'],
        );

        writeLog('error', 'worker', 'job_failed', {
          attempt: job['attempts'],
          error: errorMessage,
          jobId: job['id'],
          jobType: job['type'],
        });

        if (job['attempts'] >= configuration['worker']['attemptLimit']) {
          await notifyJobFailed(pool, job, errorMessage).catch((notifyError) => {
            writeLog('error', 'worker', 'notification_queue_failed', {
              error: getErrorMessage(notifyError),
            });

            return;
          });
        }
      }

      const jobElapsed: Worker_Main_JobElapsed = Date.now() - jobStartedAt;

      if (jobElapsed >= SLOW_JOB_MILLISECONDS) {
        writeLog('debug', 'worker', 'job_slow', {
          elapsedMs: jobElapsed,
          jobId: job['id'],
          jobType: job['type'],
        });
      }
    }
  } finally {
    clearInterval(heartbeatTimer);

    stopDebugLogging();

    process.off('SIGINT', stop);

    process.off('SIGTERM', stop);

    await pool.end();
  }

  writeLog('info', 'worker', 'worker_stopped');

  return;
}

/**
 * Worker - Process Discord Message Job.
 *
 * Revalidates the durable payload, checks the active server boundary, decrypts
 * the Bot Token only in memory, and delivers text plus optional reactions.
 *
 * @param {Worker_ProcessDiscordMessageJob_Job}           job           - Job.
 * @param {Worker_ProcessDiscordMessageJob_Pool}          pool          - Pool.
 * @param {Worker_ProcessDiscordMessageJob_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Worker_ProcessDiscordMessageJob_Returns}
 *
 * @since 4.0.0
 */
async function processDiscordMessageJob(
  job: Worker_ProcessDiscordMessageJob_Job,
  pool: Worker_ProcessDiscordMessageJob_Pool,
  credentialKey: Worker_ProcessDiscordMessageJob_CredentialKey,
): Worker_ProcessDiscordMessageJob_Returns {
  const payload: Worker_ProcessDiscordMessageJob_Payload = parseDiscordMessageJob(job['payload']);
  const runtimeControl: Worker_ProcessDiscordMessageJob_RuntimeControl = await getBotRuntimeControl(pool);

  if (runtimeControl['desiredState'] !== 'running') {
    throw new Error('Discord delivery is paused while the bot is stopped.');
  }

  if (await getGuildSettings(pool, payload['guildIdentifier']) === undefined) {
    throw new Error('Discord delivery job references an unknown server.');
  }

  if (runtimeControl['discordTokenCiphertext'] === undefined) {
    throw new Error('Discord delivery requires a configured Bot Token.');
  }

  const discordToken: Worker_ProcessDiscordMessageJob_DiscordToken = decryptDiscordToken(
    runtimeControl['discordTokenCiphertext'],
    credentialKey,
  );
  const rest: Worker_ProcessDiscordMessageJob_Rest = new REST({
    version: '10',
  }).setToken(discordToken);

  watchRestRateLimits(rest, 'worker');

  let messageIdentifier: Worker_ProcessDiscordMessageJob_MessageIdentifier = payload['messageIdentifier'] ?? '';

  if (messageIdentifier === '') {
    const response: Worker_ProcessDiscordMessageJob_Response = parseDiscordMessageResponse(await rest.post(
      Routes.channelMessages(payload['channelIdentifier']),
      {
        body: {
          allowed_mentions: {
            parse: [],
          },
          content: payload['content'],
        },
      },
    ));

    messageIdentifier = response['id'];

    await updateRunningJobPayload(pool, job['id'], {
      ...payload,
      messageIdentifier,
    });
  }

  const reactionTasks: Worker_ProcessDiscordMessageJob_ReactionTasks = payload['reactions'].map(async (reaction) => {
    await rest.put(Routes.channelMessageOwnReaction(
      payload['channelIdentifier'],
      messageIdentifier,
      encodeURIComponent(reaction),
    ));

    return;
  });

  await Promise.all(reactionTasks);

  writeLog('info', 'worker', 'discord_message_delivered', {
    channelIdentifier: payload['channelIdentifier'],
    messageIdentifier,
    ruleName: payload['ruleName'],
  });

  return;
}

/**
 * Worker - Process Discord Permission Job.
 *
 * Revalidates an idempotent permission set and applies it through rate-limited REST.
 * The Bot Token exists only in worker memory for the bounded delivery attempt.
 *
 * @param {Worker_ProcessDiscordPermissionJob_Job}           job           - Job.
 * @param {Worker_ProcessDiscordPermissionJob_Pool}          pool          - Pool.
 * @param {Worker_ProcessDiscordPermissionJob_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Worker_ProcessDiscordPermissionJob_Returns}
 *
 * @since 4.0.0
 */
async function processDiscordPermissionJob(
  job: Worker_ProcessDiscordPermissionJob_Job,
  pool: Worker_ProcessDiscordPermissionJob_Pool,
  credentialKey: Worker_ProcessDiscordPermissionJob_CredentialKey,
): Worker_ProcessDiscordPermissionJob_Returns {
  const payload: Worker_ProcessDiscordPermissionJob_Payload = parseDiscordPermissionJob(job['payload']);
  const runtimeControl: Worker_ProcessDiscordPermissionJob_RuntimeControl = await getBotRuntimeControl(pool);

  if (runtimeControl['desiredState'] !== 'running') {
    throw new Error('Discord permission changes are paused while the bot is stopped.');
  }

  if (await getGuildSettings(pool, payload['guildIdentifier']) === undefined) {
    throw new Error('Discord permission job references an unknown server.');
  }

  if (runtimeControl['discordTokenCiphertext'] === undefined) {
    throw new Error('Discord permission changes require a configured Bot Token.');
  }

  const discordToken: Worker_ProcessDiscordPermissionJob_DiscordToken = decryptDiscordToken(
    runtimeControl['discordTokenCiphertext'],
    credentialKey,
  );
  const rest: Worker_ProcessDiscordPermissionJob_Rest = new REST({
    version: '10',
  }).setToken(discordToken);

  watchRestRateLimits(rest, 'worker');

  const tasks: Worker_ProcessDiscordPermissionJob_Tasks = payload['overwrites'].map(async (overwrite) => {
    await rest.put(
      Routes.channelPermission(overwrite['channelIdentifier'], overwrite['targetIdentifier']),
      {
        body: {
          allow: overwrite['allow'],
          deny: overwrite['deny'],
          type: (overwrite['targetType'] === 'role') ? 0 : 1,
        },
        reason: `Stonker scheduled permission set: ${payload['name']}`,
      },
    );

    return;
  });

  await Promise.all(tasks);

  writeLog('info', 'worker', 'discord_permissions_applied', {
    overwriteCount: payload['overwrites'].length,
    ruleName: payload['name'],
  });

  return;
}

/**
 * Worker - Process Job.
 *
 * Dispatches only explicitly admitted job types from the durable queue.
 * Feature modules will add handlers without expanding the Gateway kernel.
 *
 * @param {Worker_ProcessJob_Job}           job           - Job.
 * @param {Worker_ProcessJob_Pool}          pool          - Pool.
 * @param {Worker_ProcessJob_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Worker_ProcessJob_Returns}
 *
 * @since 4.0.0
 */
async function processJob(
  job: Worker_ProcessJob_Job,
  pool: Worker_ProcessJob_Pool,
  credentialKey: Worker_ProcessJob_CredentialKey,
): Worker_ProcessJob_Returns {
  if (job['type'] === 'discord.message.send') {
    return processDiscordMessageJob(job, pool, credentialKey);
  }

  if (job['type'] === 'discord.permissions.apply') {
    return processDiscordPermissionJob(job, pool, credentialKey);
  }

  if (job['type'] === 'rss.feed.fetch') {
    return processRssFetchJob(job, pool);
  }

  if (job['type'] === NOTIFICATION_JOB_TYPE) {
    return deliverNotificationJob(pool, credentialKey, job['payload']);
  }

  if (job['type'] === 'system.noop') {
    return;
  }

  return Promise.reject(new Error(`No worker handler is registered for job type "${job['type']}".`));
}

/**
 * Worker - Run.
 *
 * Converts fatal worker failures into an s6-visible process exit.
 * Individual job failures remain bounded and retry through PostgreSQL.
 *
 * @returns {Worker_Run_Returns}
 *
 * @since 4.0.0
 */
async function run(): Worker_Run_Returns {
  try {
    await main();
  } catch (error) {
    writeLog('error', 'worker', 'worker_failed', {
      error: getErrorMessage(error),
    });

    process.exitCode = 1;
  }

  return;
}

await run();
