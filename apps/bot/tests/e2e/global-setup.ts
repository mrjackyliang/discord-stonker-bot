import { execFileSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

import type {
  Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport,
  Tests_E2e_GlobalSetup_CheckKeyMigration_LegacyKeyDigest,
  Tests_E2e_GlobalSetup_CheckKeyMigration_Returns,
  Tests_E2e_GlobalSetup_CheckListeningPorts_ListeningPorts,
  Tests_E2e_GlobalSetup_CheckListeningPorts_LocalAddress,
  Tests_E2e_GlobalSetup_CheckListeningPorts_LocalPort,
  Tests_E2e_GlobalSetup_CheckListeningPorts_Returns,
  Tests_E2e_GlobalSetup_CheckListeningPorts_TcpFields,
  Tests_E2e_GlobalSetup_CheckListeningPorts_TcpTables,
  Tests_E2e_GlobalSetup_CheckListeningPorts_UnexpectedPorts,
  Tests_E2e_GlobalSetup_ContainerName,
  Tests_E2e_GlobalSetup_ControlPanelUrlValue,
  Tests_E2e_GlobalSetup_ImageName,
  Tests_E2e_GlobalSetup_RemoveContainer_Returns,
  Tests_E2e_GlobalSetup_SeedDiscordServer_Returns,
  Tests_E2e_GlobalSetup_SeedDiscordServer_SeedSql,
  Tests_E2e_GlobalSetup_SeedLegacyCredentialKey_Returns,
  Tests_E2e_GlobalSetup_SetupControlPanelE2e_ControlPanelUrl,
  Tests_E2e_GlobalSetup_SetupControlPanelE2e_LegacyKeyDigest,
  Tests_E2e_GlobalSetup_SetupControlPanelE2e_PublishedHost,
  Tests_E2e_GlobalSetup_SetupControlPanelE2e_PublishedPort,
  Tests_E2e_GlobalSetup_SetupControlPanelE2e_Ready,
  Tests_E2e_GlobalSetup_SetupControlPanelE2e_Returns,
  Tests_E2e_GlobalSetup_VolumeName,
  Tests_E2e_GlobalSetup_WaitUntilReady_Attempt,
  Tests_E2e_GlobalSetup_WaitUntilReady_Ready,
  Tests_E2e_GlobalSetup_WaitUntilReady_Response,
  Tests_E2e_GlobalSetup_WaitUntilReady_Returns,
} from '../../src/types/tests/e2e/global-setup.d.ts';

const containerName: Tests_E2e_GlobalSetup_ContainerName = process.env['STONKER_E2E_CONTAINER_NAME'] ?? 'discord-stonker-bot-e2e';
const controlPanelUrlValue: Tests_E2e_GlobalSetup_ControlPanelUrlValue = process.env['STONKER_E2E_BASE_URL'] ?? 'http://localhost:3110';
const imageName: Tests_E2e_GlobalSetup_ImageName = process.env['STONKER_E2E_IMAGE'] ?? 'discord-stonker-bot:e2e';
const volumeName: Tests_E2e_GlobalSetup_VolumeName = `${containerName}-data`;

/**
 * Global Setup - Check Key Migration.
 *
 * Confirms the start moved the version 4.0 key to "/config/keys/installation.key",
 * encoded the same bytes as canonical hexadecimal, and applied the contract modes.
 *
 * @param {Tests_E2e_GlobalSetup_CheckKeyMigration_LegacyKeyDigest} legacyKeyDigest - Legacy key digest.
 *
 * @returns {Tests_E2e_GlobalSetup_CheckKeyMigration_Returns}
 *
 * @since 4.1.0
 */
function checkKeyMigration(legacyKeyDigest: Tests_E2e_GlobalSetup_CheckKeyMigration_LegacyKeyDigest): Tests_E2e_GlobalSetup_CheckKeyMigration_Returns {
  const keyReport: Tests_E2e_GlobalSetup_CheckKeyMigration_KeyReport = JSON.parse(execFileSync('docker', [
    'exec',
    containerName,
    'node',
    '--eval',
    [
      'const { createHash } = require(\'node:crypto\');',
      'const { existsSync, readFileSync, statSync } = require(\'node:fs\');',
      'const keyFile = \'/config/keys/installation.key\';',
      'const keyContents = readFileSync(keyFile, \'utf8\');',
      'const keyBytes = Buffer.from(keyContents.trim(), \'hex\');',
      'process.stdout.write(JSON.stringify({',
      '  canonical: keyContents.endsWith(String.fromCharCode(10)) && /^[0-9a-f]{64}$/.test(keyContents.slice(0, -1)),',
      '  digest: createHash(\'sha256\').update(keyBytes).digest(\'hex\'),',
      '  directoryMode: (statSync(\'/config/keys\').mode & 0o777).toString(8),',
      '  fileMode: (statSync(keyFile).mode & 0o777).toString(8),',
      '  length: Buffer.byteLength(keyContents),',
      '  secretsExists: existsSync(\'/config/secrets\'),',
      '}));',
    ].join('\n'),
  ], {
    encoding: 'utf8',
  }));

  if (keyReport['digest'] !== legacyKeyDigest) {
    throw new Error('The installation key bytes do not match the version 4.0 credential key they replaced.');
  }

  if (keyReport['canonical'] !== true || keyReport['length'] !== 65) {
    throw new Error('The installation key is not 64 lowercase hexadecimal characters followed by a newline.');
  }

  if (keyReport['fileMode'] !== '600') {
    throw new Error(`The installation key has mode ${keyReport['fileMode']} instead of 600.`);
  }

  if (keyReport['directoryMode'] !== '700') {
    throw new Error(`The keys folder has mode ${keyReport['directoryMode']} instead of 700.`);
  }

  if (keyReport['secretsExists'] !== false) {
    throw new Error('The emptied "/config/secrets" folder was not removed after the key moved.');
  }

  return;
}

/**
 * Global Setup - Check Listening Ports.
 *
 * Reads the container's TCP tables so the run fails if anything other than the
 * web port listens, which keeps PostgreSQL on its Unix socket under --net=host.
 *
 * @returns {Tests_E2e_GlobalSetup_CheckListeningPorts_Returns}
 *
 * @since 4.1.0
 */
function checkListeningPorts(): Tests_E2e_GlobalSetup_CheckListeningPorts_Returns {
  const tcpTables: Tests_E2e_GlobalSetup_CheckListeningPorts_TcpTables = execFileSync('docker', [
    'exec',
    containerName,
    'cat',
    '/proc/net/tcp',
    '/proc/net/tcp6',
  ], {
    encoding: 'utf8',
  });
  const listeningPorts: Tests_E2e_GlobalSetup_CheckListeningPorts_ListeningPorts = new Set();

  for (const tcpLine of tcpTables.split('\n')) {
    const tcpFields: Tests_E2e_GlobalSetup_CheckListeningPorts_TcpFields = tcpLine.trim().split(' ').filter((tcpField) => tcpField !== '');

    // The fourth field is the socket state, and "0A" means it is listening.
    if (tcpFields.length > 3 && tcpFields[3] === '0A') {
      const localAddress: Tests_E2e_GlobalSetup_CheckListeningPorts_LocalAddress = tcpFields[1] ?? '';
      const localPort: Tests_E2e_GlobalSetup_CheckListeningPorts_LocalPort = Number.parseInt(localAddress.split(':').at(-1) ?? '', 16);

      listeningPorts.add(localPort);
    }
  }

  const unexpectedPorts: Tests_E2e_GlobalSetup_CheckListeningPorts_UnexpectedPorts = [...listeningPorts].filter((listeningPort) => listeningPort !== 22604);

  if (unexpectedPorts.length > 0) {
    throw new Error(`The appliance listens on TCP ports other than 22604: ${unexpectedPorts.join(', ')}.`);
  }

  if (listeningPorts.has(22604) === false) {
    throw new Error('The appliance does not listen on TCP port 22604.');
  }

  return;
}

/**
 * Global Setup - Seed Discord Server.
 *
 * Stores one server the way the bot records a server it joined, so the server
 * pages open with real content without sending the fixture token to Discord.
 *
 * @returns {Tests_E2e_GlobalSetup_SeedDiscordServer_Returns}
 *
 * @since 4.0.0
 */
function seedDiscordServer(): Tests_E2e_GlobalSetup_SeedDiscordServer_Returns {
  const seedSql: Tests_E2e_GlobalSetup_SeedDiscordServer_SeedSql = [
    'INSERT INTO discord_servers (guild_id, name, last_seen_at) VALUES (\'1197999049190674442\', \'Stonker Bot\', NOW());',
    'INSERT INTO guild_profiles (guild_id) VALUES (\'1197999049190674442\');',
  ].join('\n');

  execFileSync('docker', [
    'exec',
    containerName,
    'psql',
    '--host=/tmp/postgresql',
    '--username=stonker',
    '--dbname=stonker',
    '--no-psqlrc',
    '--set=ON_ERROR_STOP=1',
    '--command',
    seedSql,
  ], {
    stdio: 'ignore',
  });

  return;
}

/**
 * Global Setup - Seed Legacy Credential Key.
 *
 * Writes a key where version 4.0 kept it, in the disposable data volume, so the
 * start must move and convert it instead of making a new one.
 *
 * @returns {Tests_E2e_GlobalSetup_SeedLegacyCredentialKey_Returns}
 *
 * @since 4.1.0
 */
function seedLegacyCredentialKey(): Tests_E2e_GlobalSetup_SeedLegacyCredentialKey_Returns {
  return execFileSync('docker', [
    'run',
    '--rm',
    '--entrypoint',
    '/bin/sh',
    '--volume',
    `${volumeName}:/config`,
    imageName,
    '-c',
    'mkdir -p /config/secrets && head -c 32 /dev/urandom > /config/secrets/credential.key && sha256sum /config/secrets/credential.key | cut -d " " -f 1',
  ], {
    encoding: 'utf8',
  }).trim();
}

/**
 * Global Setup - Remove Container.
 *
 * Clears only the fixed disposable E2E container and its data volume so
 * interrupted runs do not retain PostgreSQL state or occupy the test port.
 *
 * @returns {Tests_E2e_GlobalSetup_RemoveContainer_Returns}
 *
 * @since 4.0.0
 */
function removeContainer(): Tests_E2e_GlobalSetup_RemoveContainer_Returns {
  try {
    execFileSync('docker', [
      'rm',
      '--force',
      containerName,
    ], {
      stdio: 'ignore',
    });

    execFileSync('docker', [
      'volume',
      'rm',
      '--force',
      volumeName,
    ], {
      stdio: 'ignore',
    });
  } catch {
    return;
  }

  return;
}

/**
 * Global Setup - Setup Control Panel E2e.
 *
 * Starts the built image with no database password and a version 4.0 key to
 * migrate, then checks the shared appliance contract and waits for it.
 *
 * @returns {Tests_E2e_GlobalSetup_SetupControlPanelE2e_Returns}
 *
 * @since 4.0.0
 */
async function setupControlPanelE2e(): Tests_E2e_GlobalSetup_SetupControlPanelE2e_Returns {
  const controlPanelUrl: Tests_E2e_GlobalSetup_SetupControlPanelE2e_ControlPanelUrl = new URL(controlPanelUrlValue);
  const publishedHost: Tests_E2e_GlobalSetup_SetupControlPanelE2e_PublishedHost = (controlPanelUrl.hostname === 'localhost') ? '127.0.0.1' : controlPanelUrl.hostname;
  const publishedPort: Tests_E2e_GlobalSetup_SetupControlPanelE2e_PublishedPort = `${publishedHost}:${controlPanelUrl.port}:22604`;

  removeContainer();

  const legacyKeyDigest: Tests_E2e_GlobalSetup_SetupControlPanelE2e_LegacyKeyDigest = seedLegacyCredentialKey();

  execFileSync('docker', [
    'run',
    '--detach',
    '--name',
    containerName,
    '--user',
    '0:0',
    '--net',
    'bridge',
    '--volume',
    `${volumeName}:/config`,
    '--publish',
    publishedPort,
    imageName,
  ], {
    stdio: 'ignore',
  });

  const ready: Tests_E2e_GlobalSetup_SetupControlPanelE2e_Ready = await waitUntilReady(1);

  if (ready === true) {
    checkListeningPorts();

    checkKeyMigration(legacyKeyDigest);

    seedDiscordServer();

    return;
  }

  try {
    execFileSync('docker', [
      'logs',
      containerName,
    ], {
      stdio: 'inherit',
    });
  } finally {
    removeContainer();
  }

  return Promise.reject(new Error('The disposable control-panel appliance did not become ready.'));
}

/**
 * Global Setup - Wait Until Ready.
 *
 * Checks the health endpoint once a second, one check at a time, for up to
 * 60 attempts, and reports whether the appliance answered.
 *
 * @param {Tests_E2e_GlobalSetup_WaitUntilReady_Attempt} attempt - Attempt.
 *
 * @returns {Tests_E2e_GlobalSetup_WaitUntilReady_Returns}
 *
 * @since 4.2.1
 */
async function waitUntilReady(attempt: Tests_E2e_GlobalSetup_WaitUntilReady_Attempt): Tests_E2e_GlobalSetup_WaitUntilReady_Returns {
  let ready: Tests_E2e_GlobalSetup_WaitUntilReady_Ready = false;

  try {
    const response: Tests_E2e_GlobalSetup_WaitUntilReady_Response = await fetch(`${controlPanelUrlValue}/health`);

    ready = response.ok;
  } catch {
    // The web service is expected to refuse connections while PostgreSQL starts.
  }

  if (ready === true) {
    return true;
  }

  if (attempt >= 60) {
    return false;
  }

  await wait(1_000);

  return waitUntilReady(attempt + 1);
}

export default setupControlPanelE2e;
