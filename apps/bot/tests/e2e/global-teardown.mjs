import { execFileSync } from 'node:child_process';

const containerName = process.env['STONKER_E2E_CONTAINER_NAME'] ?? 'discord-stonker-bot-e2e';
const volumeName = `${containerName}-data`;

/**
 * Global Teardown - Teardown Control Panel E2e.
 *
 * Removes the disposable s6 appliance and its PostgreSQL data volume after
 * every successful, failed, or interrupted Playwright test completion.
 *
 * @returns {Promise<void>}
 *
 * @since 4.0.0
 */
function teardownControlPanelE2e() {
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

export default teardownControlPanelE2e;
