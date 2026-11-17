import { z } from 'zod';

import { LIB_REGEX_PATTERN_DATABASE_IDENTIFIER } from './regex.js';

import type {
  Lib_Runtime_ControlPanelPort,
  Lib_Runtime_ReadRuntimeConfiguration_BotConfiguration,
  Lib_Runtime_ReadRuntimeConfiguration_DatabaseConfiguration,
  Lib_Runtime_ReadRuntimeConfiguration_DatabaseUrl,
  Lib_Runtime_ReadRuntimeConfiguration_Environment,
  Lib_Runtime_ReadRuntimeConfiguration_Returns,
  Lib_Runtime_ReadRuntimeConfiguration_WebConfiguration,
  Lib_Runtime_ReadRuntimeConfiguration_WorkerConfiguration,
  Lib_Runtime_Sleep_DurationMilliseconds,
  Lib_Runtime_Sleep_Returns,
  Lib_Runtime_WaitForShutdown_KeepAliveTimer,
  Lib_Runtime_WaitForShutdown_Returns,
  Lib_Runtime_WaitForShutdown_Settle,
} from '../types/lib/runtime.d.ts';

/**
 * Runtime - Control Panel Port.
 *
 * Fixes the port the control panel listens on inside the container.
 * A different host port comes from the port mapping, not a setting.
 *
 * @since 4.1.0
 */
export const CONTROL_PANEL_PORT: Lib_Runtime_ControlPanelPort = 22604;

/**
 * Runtime - Environment Schema.
 *
 * Validates every secret and setting before any runtime service starts.
 * Defaults cover internal single-container networking, never credentials.
 *
 * @since 4.2.0
 */
const environmentSchema = z.object({
  BOT_CONTROL_POLL_INTERVAL_MS: z.coerce.number().int().min(250).max(60_000).default(1000),
  DATABASE_MAX_CONNECTIONS: z.coerce.number().int().min(1).max(30).default(10),
  JOB_ATTEMPT_LIMIT: z.coerce.number().int().min(1).max(20).default(5),
  NOVA_INSTALLATION_KEY_FILE: z.string().min(1).default('/config/keys/installation.key'),
  POSTGRES_DB: z.string().regex(LIB_REGEX_PATTERN_DATABASE_IDENTIFIER).default('stonker'),
  POSTGRES_RUNTIME_DIRECTORY: z.string().min(1).default('/tmp/postgresql'),
  POSTGRES_USER: z.string().regex(LIB_REGEX_PATTERN_DATABASE_IDENTIFIER).default('stonker'),
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
  // A blank setting, such as a key left empty in a local .env, falls back to its default like an unset one.
  const environment: Lib_Runtime_ReadRuntimeConfiguration_Environment = environmentSchema.parse(Object.fromEntries(Object.entries(process.env).filter((entry) => entry[1] !== '')));

  const databaseUrl: Lib_Runtime_ReadRuntimeConfiguration_DatabaseUrl = new URL('postgresql://localhost');

  databaseUrl.username = environment['POSTGRES_USER'];
  databaseUrl.pathname = environment['POSTGRES_DB'];

  // PostgreSQL listens only on its Unix socket, which trusts local clients, and the fixed port names the socket file.
  databaseUrl.port = '5432';
  databaseUrl.searchParams.set('host', environment['POSTGRES_RUNTIME_DIRECTORY']);

  const databaseConfiguration: Lib_Runtime_ReadRuntimeConfiguration_DatabaseConfiguration = {
    connectionString: databaseUrl.toString(),
    maxConnections: environment['DATABASE_MAX_CONNECTIONS'],
  };

  const botConfiguration: Lib_Runtime_ReadRuntimeConfiguration_BotConfiguration = {
    controlPollIntervalMilliseconds: environment['BOT_CONTROL_POLL_INTERVAL_MS'],
    credentialKeyFile: environment['NOVA_INSTALLATION_KEY_FILE'],
  };

  // Without a host, Node listens on every IPv6 and IPv4 address, or on IPv4 when IPv6 is off. The port mapping or a reverse proxy decides who can reach it.
  const webConfiguration: Lib_Runtime_ReadRuntimeConfiguration_WebConfiguration = {
    host: undefined,
    port: CONTROL_PANEL_PORT,
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
