import { execFileSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

const containerName = process.env['STONKER_E2E_CONTAINER_NAME'] ?? 'discord-stonker-bot-e2e';
const controlPanelUrlValue = process.env['STONKER_E2E_BASE_URL'] ?? 'http://localhost:3110';
const imageName = process.env['STONKER_E2E_IMAGE'] ?? 'discord-stonker-bot:e2e';
const volumeName = `${containerName}-data`;

/**
 * Global Setup - Check Key Migration.
 *
 * Confirms the start moved the version 4.0 key to "/data/keys/installation.key"
 * unchanged, with mode 0600, and removed the emptied "/data/secrets" folder.
 *
 * @param {string} legacyKeyDigest - Legacy key digest.
 *
 * @returns {void}
 *
 * @since 4.1.0
 */
function checkKeyMigration(legacyKeyDigest) {
  const keyReport = execFileSync('docker', [
    'exec',
    containerName,
    'sh',
    '-c',
    'sha256sum /data/keys/installation.key | cut -d " " -f 1; stat -c "%a" /data/keys/installation.key; if [ -e /data/secrets ]; then echo kept; else echo removed; fi',
  ], {
    encoding: 'utf8',
  }).trim().split('\n');

  if (keyReport[0] !== legacyKeyDigest) {
    throw new Error('The installation key does not match the version 4.0 credential key it was moved from.');
  }

  if (keyReport[1] !== '600') {
    throw new Error(`The installation key has mode ${keyReport[1]} instead of 600.`);
  }

  if (keyReport[2] !== 'removed') {
    throw new Error('The emptied "/data/secrets" folder was not removed after the key moved.');
  }

  return;
}

/**
 * Global Setup - Check Listening Ports.
 *
 * Reads the container's TCP tables so the run fails if anything other than the
 * web port listens, which keeps PostgreSQL on its Unix socket under --net=host.
 *
 * @returns {void}
 *
 * @since 4.1.0
 */
function checkListeningPorts() {
  const tcpTables = execFileSync('docker', [
    'exec',
    containerName,
    'cat',
    '/proc/net/tcp',
    '/proc/net/tcp6',
  ], {
    encoding: 'utf8',
  });
  const listeningPorts = new Set();

  for (const tcpLine of tcpTables.split('\n')) {
    const tcpFields = tcpLine.trim().split(' ').filter((tcpField) => tcpField !== '');

    // The fourth field is the socket state, and "0A" means it is listening.
    if (tcpFields.length > 3 && tcpFields[3] === '0A') {
      const localAddress = tcpFields[1] ?? '';
      const localPort = Number.parseInt(localAddress.split(':').at(-1) ?? '', 16);

      listeningPorts.add(localPort);
    }
  }

  const unexpectedPorts = [...listeningPorts].filter((listeningPort) => listeningPort !== 22604);

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
 * @returns {void}
 *
 * @since 4.0.0
 */
function seedDiscordServer() {
  const seedSql = [
    'INSERT INTO discord_servers (guild_id, name, last_seen_at) VALUES (\'1197999049190674442\', \'Stonker Bot\', NOW());',
    'INSERT INTO guild_profiles (guild_id) VALUES (\'1197999049190674442\');',
  ].join('\n');

  execFileSync('docker', [
    'exec',
    containerName,
    'psql',
    '--host=/run/postgresql',
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
 * start must move it to the keys folder instead of making a new one.
 *
 * @returns {string}
 *
 * @since 4.1.0
 */
function seedLegacyCredentialKey() {
  return execFileSync('docker', [
    'run',
    '--rm',
    '--entrypoint',
    '/bin/sh',
    '--volume',
    `${volumeName}:/data`,
    imageName,
    '-c',
    'mkdir -p /data/secrets && head -c 32 /dev/urandom > /data/secrets/credential.key && sha256sum /data/secrets/credential.key | cut -d " " -f 1',
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
 * @returns {void}
 *
 * @since 4.0.0
 */
function removeContainer() {
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
 * Starts the built image with no database password, a version 4.0 key to move,
 * and the same hardening as compose.yml, then checks it and waits for it.
 *
 * @returns {Promise<void>}
 *
 * @since 4.0.0
 */
async function setupControlPanelE2e() {
  const controlPanelUrl = new URL(controlPanelUrlValue);
  const publishedHost = (controlPanelUrl.hostname === 'localhost') ? '127.0.0.1' : controlPanelUrl.hostname;
  const publishedPort = `${publishedHost}:${controlPanelUrl.port}:22604`;

  removeContainer();

  const legacyKeyDigest = seedLegacyCredentialKey();

  execFileSync('docker', [
    'run',
    '--detach',
    '--name',
    containerName,
    '--read-only',
    '--volume',
    `${volumeName}:/data`,
    '--tmpfs',
    '/run:rw,exec,nosuid,size=64m,mode=0755',
    '--tmpfs',
    '/tmp:rw,noexec,nosuid,size=64m,mode=1777',
    '--cap-drop',
    'ALL',
    '--cap-add',
    'CHOWN',
    '--cap-add',
    'DAC_OVERRIDE',
    '--cap-add',
    'FOWNER',
    '--cap-add',
    'KILL',
    '--cap-add',
    'SETGID',
    '--cap-add',
    'SETUID',
    '--security-opt',
    'no-new-privileges:true',
    '--shm-size',
    '256m',
    '--publish',
    publishedPort,
    imageName,
  ], {
    stdio: 'ignore',
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    let ready = false;

    try {
      const response = await fetch(`${controlPanelUrlValue}/ready`);

      ready = response.ok;
    } catch {
      // The web service is expected to refuse connections while PostgreSQL starts.
    }

    if (ready === true) {
      checkListeningPorts();

      checkKeyMigration(legacyKeyDigest);

      seedDiscordServer();

      return;
    }

    await wait(1_000);
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

  throw new Error('The disposable control-panel appliance did not become ready.');
}

export default setupControlPanelE2e;
