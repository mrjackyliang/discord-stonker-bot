import { execFileSync } from 'node:child_process';

import {
  expect,
  test,
} from '@playwright/test';

const BOT_TOKEN = 'not-a-real-discord-token-for-e2e';
const containerName = process.env['STONKER_E2E_CONTAINER_NAME'] ?? 'discord-stonker-bot-e2e';
const OWNER_PASSWORD = 'Stonker E2E owner password 2026!';
const OWNER_USERNAME = 'e2e-owner';
const panelPages = [
  {
    heading: 'Overview',
    navigationLabel: 'Overview',
  },
  {
    heading: 'Features',
    navigationLabel: 'Features',
  },
  {
    heading: 'Logs',
    navigationLabel: 'Logs',
  },
  {
    heading: 'Connection',
    navigationLabel: 'Connection',
  },
  {
    heading: 'Backup',
    navigationLabel: 'Backup',
  },
  {
    heading: 'Users',
    navigationLabel: 'Users',
  },
  {
    heading: 'Access tokens',
    navigationLabel: 'Access tokens',
  },
  {
    heading: 'Notifications',
    navigationLabel: 'Notifications',
  },
];

/**
 * Control Panel Test - Read Setup Code.
 *
 * Reads the one-time setup code the way an operator would, from the newest
 * setup_code_issued line in the container log.
 *
 * @returns {string}
 *
 * @since 4.0.0
 */
function readSetupCode() {
  const containerLog = execFileSync('docker', [
    'logs',
    containerName,
  ], {
    encoding: 'utf8',
    stdio: [
      'ignore',
      'pipe',
      'ignore',
    ],
  });
  const setupCodeLine = containerLog.split('\n').findLast((containerLogLine) => containerLogLine.includes('"setup_code_issued"'));

  if (setupCodeLine === undefined) {
    throw new Error('The container log has no setup_code_issued line.');
  }

  return JSON.parse(setupCodeLine)['context']['setupCode'];
}

/**
 * Control Panel Test - Sign Out.
 *
 * Signs out through the account menu at the bottom of the sidebar and waits
 * for the sign-in screen.
 *
 * @param {import('@playwright/test').Page} page - Page.
 *
 * @returns {Promise<void>}
 *
 * @since 4.0.0
 */
async function signOut(page) {
  await page.getByRole('complementary').getByRole('button', {
    name: OWNER_USERNAME,
  }).click();
  await page.getByRole('menuitem', {
    name: 'Sign out',
  }).click();

  await expect(page.getByRole('heading', {
    level: 1,
    name: 'Sign in',
  })).toBeVisible();
}

test.describe('control panel appliance', () => {
  test('sets up the owner, opens every page, and saves a bot token', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    const sidebar = page.getByRole('complementary');

    page.on('console', (consoleMessage) => {
      if (consoleMessage.type() === 'error') {
        consoleErrors.push(consoleMessage.text());
      }
    });

    page.on('pageerror', (pageError) => {
      pageErrors.push(pageError.message);
    });

    await test.step('create the owner account with the setup code from the log', async () => {
      await page.goto('/');

      await expect(page.getByRole('heading', {
        level: 1,
        name: 'Set up your account',
      })).toBeVisible();

      await page.getByLabel('One-time code').fill(readSetupCode());
      await page.getByLabel('Username').fill(OWNER_USERNAME);
      await page.getByLabel('Password', {
        exact: true,
      }).fill(OWNER_PASSWORD);
      await page.getByLabel('Confirm password').fill(OWNER_PASSWORD);
      await page.getByRole('button', {
        name: 'Create account',
      }).click();

      await expect(page.getByRole('heading', {
        level: 1,
        name: 'Overview',
      })).toBeVisible();
    });

    await test.step('sign out, then sign in with the password', async () => {
      await signOut(page);

      await page.getByLabel('Username').fill(OWNER_USERNAME);
      await page.getByLabel('Password', {
        exact: true,
      }).fill(OWNER_PASSWORD);
      await page.getByRole('button', {
        exact: true,
        name: 'Sign in',
      }).click();

      await expect(page.getByRole('heading', {
        level: 1,
        name: 'Overview',
      })).toBeVisible();
    });

    await test.step('open every page of the panel', async () => {
      for (const panelPage of panelPages) {
        await sidebar.getByRole('button', {
          exact: true,
          name: panelPage['navigationLabel'],
        }).click();

        await expect(page.getByRole('heading', {
          level: 1,
          name: panelPage['heading'],
        })).toBeVisible();
        await expect(page.locator('.detail-loading')).toHaveCount(0);
        await expect(page.getByRole('alert')).toHaveCount(0);
      }

      await expect(sidebar.getByRole('button', {
        exact: true,
        name: 'Invite page',
      })).toHaveCount(0);
      await expect(sidebar.getByRole('button', {
        exact: true,
        name: 'Security',
      })).toHaveCount(0);

      await sidebar.getByRole('button', {
        exact: true,
        name: 'Features',
      }).click();
      await page.locator('.feature-card-open').filter({
        hasText: 'Web applications',
      }).click();

      await expect(page.getByRole('heading', {
        level: 1,
        name: 'Invite page',
      })).toBeVisible();
      await expect(sidebar.getByRole('button', {
        exact: true,
        name: 'Features',
      })).toHaveAttribute('aria-current', 'page');

      await sidebar.getByRole('button', {
        name: OWNER_USERNAME,
      }).click();
      await page.getByRole('menuitem', {
        name: 'Sign-in and security',
      }).click();

      await expect(page.getByRole('heading', {
        level: 1,
        name: 'Sign-in and security',
      })).toBeVisible();
    });

    await test.step('save a fixture bot token on the Connection page', async () => {
      await sidebar.getByRole('button', {
        exact: true,
        name: 'Connection',
      }).click();
      await page.getByLabel('Bot token').fill(BOT_TOKEN);
      await page.getByRole('button', {
        name: 'Save token',
      }).click();

      // The confirmation is a toast, which Notyf announces through an aria-live region rather than a status role.
      await expect(page.locator('.notyf__message').filter({
        hasText: 'Token saved. Start the bot to bring it online.',
      })).toBeVisible();
      await expect(page.getByText('Saved', {
        exact: true,
      })).toBeVisible();
    });

    await test.step('sign out', async () => {
      await signOut(page);

      const sessionResponse = await page.request.get('/api/v1/auth/me');

      expect(sessionResponse.status()).toBe(401);
    });

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
