import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readCredentialKey } from './lib/credential-vault.js';
import {
  createDatabasePool,
  recordHeartbeat,
} from './lib/database.js';
import { followDebugLogging } from './lib/debug-logging.js';
import { timedPool } from './lib/debug-timing.js';
import { importLegacyConfiguration } from './lib/legacy-import.js';
import {
  configureLogPersistence,
  getErrorMessage,
  writeLog,
} from './lib/logger.js';
import { preparePanelSetupClaim } from './lib/panel-setup.js';
import {
  readRuntimeConfiguration,
  waitForShutdown,
} from './lib/runtime.js';
import { Runner as Server } from './server.js';

import type {
  Web_CloseServer_Returns,
  Web_CloseServer_Server,
  Web_Listen_Host,
  Web_Listen_Port,
  Web_Listen_Returns,
  Web_Listen_Server,
  Web_Main_BoundAddress,
  Web_Main_Configuration,
  Web_Main_CredentialKey,
  Web_Main_HeartbeatTimer,
  Web_Main_HttpServer,
  Web_Main_Pool,
  Web_Main_Returns,
  Web_Main_Server,
  Web_Main_SetupClaim,
  Web_Main_StarterConfiguration,
  Web_Main_StarterConfigurationPath,
  Web_Main_StarterSettings,
  Web_Main_StopDebugLogging,
  Web_Main_WebRoot,
  Web_Run_Returns,
} from './types/web.d.ts';

/**
 * Web - Close Server.
 *
 * Stops accepting connections and waits for open requests to finish.
 * A close error is treated as already closed.
 *
 * @param {Web_CloseServer_Server} server - Server.
 *
 * @returns {Web_CloseServer_Returns}
 *
 * @since 4.0.0
 */
async function closeServer(server: Web_CloseServer_Server): Web_CloseServer_Returns {
  await new Promise<void>((resolvePromise) => {
    server.close(() => {
      resolvePromise();

      return;
    });

    server.closeAllConnections();

    return;
  });

  return;
}

/**
 * Web - Listen.
 *
 * Converts the server's event-based startup into an awaitable operation.
 * Startup failures therefore propagate through the normal service error path.
 *
 * @param {Web_Listen_Server} server - Server.
 * @param {Web_Listen_Host}   host   - Host.
 * @param {Web_Listen_Port}   port   - Port.
 *
 * @returns {Web_Listen_Returns}
 *
 * @since 4.0.0
 */
async function listen(server: Web_Listen_Server, host: Web_Listen_Host, port: Web_Listen_Port): Web_Listen_Returns {
  await new Promise<void>((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);

    server.listen(port, host, () => {
      server.off('error', rejectPromise);

      resolvePromise();

      return;
    });

    return;
  });

  return;
}

/**
 * Web - Main.
 *
 * Starts the control panel, its API, and the public pages on top of the database.
 * While no account exists, the one-time setup code goes to the container log only.
 *
 * @returns {Web_Main_Returns}
 *
 * @since 4.0.0
 */
async function main(): Web_Main_Returns {
  const configuration: Web_Main_Configuration = readRuntimeConfiguration();
  const pool: Web_Main_Pool = timedPool(createDatabasePool(configuration['database'], 'web'), 'web');
  const credentialKey: Web_Main_CredentialKey = await readCredentialKey(configuration['bot']['credentialKeyFile']);
  const starterConfigurationPath: Web_Main_StarterConfigurationPath = process.env['STARTER_CONFIGURATION'] ?? resolve(process.cwd(), 'examples/legacy-config.e2e.json');
  const starterConfiguration: Web_Main_StarterConfiguration = await readFile(starterConfigurationPath, 'utf8');
  const starterSettings: Web_Main_StarterSettings = importLegacyConfiguration(starterConfiguration, false)['settings'];
  const webRoot: Web_Main_WebRoot = fileURLToPath(new URL('./console/', import.meta.url));
  const server: Web_Main_Server = new Server({
    configuration,
    credentialKey,
    pool,
    starterSettings,
    webRoot,
  });
  const httpServer: Web_Main_HttpServer = createServer(server.getApplication());
  const setupClaim: Web_Main_SetupClaim = await preparePanelSetupClaim(pool);

  if (setupClaim !== undefined) {
    writeLog('warn', 'web', 'setup_code_issued', {
      expiresAt: setupClaim['expiresAt'],
      message: 'No account exists yet. Open the control panel to create the owner account with the setup code.',
      setupCode: setupClaim['code'],
    });
  }

  configureLogPersistence(pool);

  const stopDebugLogging: Web_Main_StopDebugLogging = followDebugLogging(pool, 'web');

  await recordHeartbeat(pool, 'web', 'ready', {
    port: configuration['web']['port'],
  });

  const heartbeatTimer: Web_Main_HeartbeatTimer = setInterval(() => {
    void recordHeartbeat(pool, 'web', 'ready', {
      port: configuration['web']['port'],
    }).catch((error) => {
      writeLog('warn', 'web', 'heartbeat_failed', {
        error: getErrorMessage(error),
      });

      return;
    });

    return;
  }, 15_000);

  await listen(httpServer, configuration['web']['host'], configuration['web']['port']);

  const boundAddress: Web_Main_BoundAddress = httpServer.address();

  writeLog('info', 'web', 'web_ready', {
    host: (boundAddress !== null && typeof boundAddress === 'object') ? boundAddress['address'] : configuration['web']['host'],
    port: configuration['web']['port'],
  });

  await waitForShutdown();

  clearInterval(heartbeatTimer);

  stopDebugLogging();

  await closeServer(httpServer);

  await pool.end();

  return;
}

/**
 * Web - Run.
 *
 * Runs the web process and records a startup or shutdown failure as a structured log.
 * A failure sets the exit code so s6 can halt the appliance.
 *
 * @returns {Web_Run_Returns}
 *
 * @since 4.0.0
 */
async function run(): Web_Run_Returns {
  try {
    await main();
  } catch (error) {
    writeLog('error', 'web', 'web_failed', {
      error: getErrorMessage(error),
    });

    process.exitCode = 1;
  }

  return;
}

await run();
