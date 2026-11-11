import { execFileSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';

const containerName = process.env['STONKER_E2E_CONTAINER_NAME'] ?? 'discord-stonker-bot-e2e';
const controlPanelUrlValue = process.env['STONKER_E2E_BASE_URL'] ?? 'http://localhost:3110';
const imageName = process.env['STONKER_E2E_IMAGE'] ?? 'discord-stonker-bot:e2e';

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
 * Global Setup - Remove Container.
 *
 * Clears only the fixed disposable E2E container so interrupted test runs do
 * not retain PostgreSQL state or occupy the isolated browser-test port.
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
  } catch {
    return;
  }

  return;
}

/**
 * Global Setup - Setup Control Panel E2e.
 *
 * Starts the built image with only the required database password, the same
 * hardening as compose.yml, and an in-memory data directory, then waits for it.
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

  execFileSync('docker', [
    'run',
    '--detach',
    '--name',
    containerName,
    '--read-only',
    '--tmpfs',
    '/data:rw,exec,nosuid,size=512m,mode=0755',
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
    '--env',
    'POSTGRES_PASSWORD=stonker-e2e-postgres-password',
    imageName,
  ], {
    stdio: 'ignore',
  });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${controlPanelUrlValue}/ready`);

      if (response.ok === true) {
        seedDiscordServer();

        return;
      }
    } catch {
      // The web service is expected to refuse connections while PostgreSQL starts.
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
