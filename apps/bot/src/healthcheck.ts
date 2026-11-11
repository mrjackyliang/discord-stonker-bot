import {
  getErrorMessage,
  writeLog,
} from './lib/logger.js';

import type {
  Healthcheck_Main_Host,
  Healthcheck_Main_Port,
  Healthcheck_Main_Response,
  Healthcheck_Main_Returns,
  Healthcheck_Main_Url,
  Healthcheck_Run_Returns,
} from './types/healthcheck.d.ts';

/**
 * Healthcheck - Main.
 *
 * Verifies that the web process and PostgreSQL-backed readiness route respond.
 * Docker uses the process exit code without needing another listening service.
 *
 * @returns {Healthcheck_Main_Returns}
 *
 * @since 4.0.0
 */
async function main(): Healthcheck_Main_Returns {
  const port: Healthcheck_Main_Port = Number.parseInt(process.env['WEB_PORT'] ?? '22604', 10);
  const configuredHost: Healthcheck_Main_Host = process.env['WEB_HOST'] ?? '';
  let host: Healthcheck_Main_Host = configuredHost;

  if (configuredHost === '' || configuredHost === '0.0.0.0') {
    host = '127.0.0.1';
  } else if (configuredHost === '::' || configuredHost === '[::]') {
    host = '[::1]';
  } else if (configuredHost.includes(':') === true && configuredHost.startsWith('[') === false) {
    host = `[${configuredHost}]`;
  }

  const url: Healthcheck_Main_Url = new URL(`http://${host}:${String(port)}/ready`);
  const response: Healthcheck_Main_Response = await fetch(url, {
    signal: AbortSignal.timeout(4_000),
  });

  if (response.ok === false) {
    throw new Error(`Readiness endpoint returned HTTP ${response.status}.`);
  }

  return;
}

/**
 * Healthcheck - Run.
 *
 * Reports a concise structured failure and exposes it through the exit code.
 * The check never prints configuration values or response bodies.
 *
 * @returns {Healthcheck_Run_Returns}
 *
 * @since 4.0.0
 */
async function run(): Healthcheck_Run_Returns {
  try {
    await main();
  } catch (error) {
    writeLog('error', 'health', 'readiness_failed', {
      error: getErrorMessage(error),
    });

    process.exitCode = 1;
  }

  return;
}

await run();
