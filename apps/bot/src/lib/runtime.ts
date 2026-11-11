import { z } from 'zod';

import { LIB_REGEX_PATTERN_DATABASE_IDENTIFIER } from './regex.js';

import type {
  Lib_Runtime_ReadRuntimeConfiguration_BotConfiguration,
  Lib_Runtime_ReadRuntimeConfiguration_DatabaseConfiguration,
  Lib_Runtime_ReadRuntimeConfiguration_DatabaseUrl,
  Lib_Runtime_ReadRuntimeConfiguration_Environment,
  Lib_Runtime_ReadRuntimeConfiguration_Returns,
  Lib_Runtime_ReadRuntimeConfiguration_WebConfiguration,
  Lib_Runtime_ReadRuntimeConfiguration_WebHost,
  Lib_Runtime_ReadRuntimeConfiguration_WorkerConfiguration,
  Lib_Runtime_Sleep_DurationMilliseconds,
  Lib_Runtime_Sleep_Returns,
  Lib_Runtime_WaitForShutdown_KeepAliveTimer,
  Lib_Runtime_WaitForShutdown_Returns,
  Lib_Runtime_WaitForShutdown_Settle,
} from '../types/lib/runtime.d.ts';

/**
 * Runtime - Environment Schema.
 *
 * Validates every secret and setting before any runtime service starts.
 * Defaults cover internal single-container networking, never credentials.
 *
 * @since 4.0.0
 */
const environmentSchema = z.object({
  BOT_CONTROL_POLL_INTERVAL_MS: z.coerce.number().int().min(250).max(60_000).default(1000),
  CREDENTIAL_KEY_FILE: z.string().min(1).default('/data/secrets/credential.key'),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().int().min(1).max(30).default(10),
  JOB_ATTEMPT_LIMIT: z.coerce.number().int().min(1).max(20).default(5),
  POSTGRES_DB: z.string().regex(LIB_REGEX_PATTERN_DATABASE_IDENTIFIER).default('stonker'),
  POSTGRES_PASSWORD: z.string().min(16),
  POSTGRES_PORT: z.coerce.number().int().min(1).max(65_535).default(5432),
  POSTGRES_USER: z.string().regex(LIB_REGEX_PATTERN_DATABASE_IDENTIFIER).default('stonker'),
  WEB_HOST: z.string().default(''),
  WEB_PORT: z.coerce.number().int().min(1).max(65_535).default(22604),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().int().min(100).max(60_000).default(1000),
});

/**
 * Runtime - Read Runtime Configuration.
 *
 * Produces one typed configuration shared by every supervised process.
 * Invalid input fails before Discord, HTTP, or worker activity begins.
 *
 * @returns {Lib_Runtime_ReadRuntimeConfiguration_Returns}
 *
 * @since 4.0.0
 */
export function readRuntimeConfiguration(): Lib_Runtime_ReadRuntimeConfiguration_Returns {
  const environment: Lib_Runtime_ReadRuntimeConfiguration_Environment = environmentSchema.parse(process.env);

  const databaseUrl: Lib_Runtime_ReadRuntimeConfiguration_DatabaseUrl = new URL('postgresql://127.0.0.1');

  databaseUrl.username = environment['POSTGRES_USER'];
  databaseUrl.password = environment['POSTGRES_PASSWORD'];
  databaseUrl.port = environment['POSTGRES_PORT'].toString();
  databaseUrl.pathname = environment['POSTGRES_DB'];

  const databaseConfiguration: Lib_Runtime_ReadRuntimeConfiguration_DatabaseConfiguration = {
    connectionString: databaseUrl.toString(),
    maxConnections: environment['DATABASE_MAX_CONNECTIONS'],
  };

  const botConfiguration: Lib_Runtime_ReadRuntimeConfiguration_BotConfiguration = {
    controlPollIntervalMilliseconds: environment['BOT_CONTROL_POLL_INTERVAL_MS'],
    credentialKeyFile: environment['CREDENTIAL_KEY_FILE'],
  };

  // Without a host, Node listens on IPv6 and IPv4, or on IPv4 when IPv6 is off.
  const webHost: Lib_Runtime_ReadRuntimeConfiguration_WebHost = (environment['WEB_HOST'] === '') ? undefined : environment['WEB_HOST'];

  const webConfiguration: Lib_Runtime_ReadRuntimeConfiguration_WebConfiguration = {
    host: webHost,
    port: environment['WEB_PORT'],
  };

  const workerConfiguration: Lib_Runtime_ReadRuntimeConfiguration_WorkerConfiguration = {
    attemptLimit: environment['JOB_ATTEMPT_LIMIT'],
    pollIntervalMilliseconds: environment['WORKER_POLL_INTERVAL_MS'],
  };

  return {
    bot: botConfiguration,
    database: databaseConfiguration,
    web: webConfiguration,
    worker: workerConfiguration,
  };
}

/**
 * Runtime - Sleep.
 *
 * Pauses bounded worker polling without blocking the Node.js event loop.
 * The caller retains control over retry and shutdown behavior.
 *
 * @param {Lib_Runtime_Sleep_DurationMilliseconds} durationMilliseconds - Duration milliseconds.
 *
 * @returns {Lib_Runtime_Sleep_Returns}
 *
 * @since 4.0.0
 */
export async function sleep(durationMilliseconds: Lib_Runtime_Sleep_DurationMilliseconds): Lib_Runtime_Sleep_Returns {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, durationMilliseconds);

    return;
  });

  return;
}

/**
 * Runtime - Wait For Shutdown.
 *
 * Resolves on the first container termination signal and removes both listeners.
 * Long-running services use it to perform one orderly cleanup sequence.
 *
 * @returns {Lib_Runtime_WaitForShutdown_Returns}
 *
 * @since 4.0.0
 */
export async function waitForShutdown(): Lib_Runtime_WaitForShutdown_Returns {
  await new Promise<void>((resolve) => {
    const keepAliveTimer: Lib_Runtime_WaitForShutdown_KeepAliveTimer = setInterval(() => {
      return;
    }, 60_000);

    /**
     * Runtime - Wait For Shutdown - Settle.
     *
     * Removes both signal listeners after the first termination signal.
     * Resolves the shared shutdown promise exactly once.
     *
     * @returns {void}
     *
     * @since 4.0.0
     */
    const settle: Lib_Runtime_WaitForShutdown_Settle = () => {
      clearInterval(keepAliveTimer);

      process.off('SIGINT', settle);

      process.off('SIGTERM', settle);

      resolve();

      return;
    };

    process.once('SIGINT', settle);
    process.once('SIGTERM', settle);

    return;
  });

  return;
}
