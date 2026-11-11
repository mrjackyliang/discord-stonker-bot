import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import {
  defineConfig,
  devices,
} from '@playwright/test';

/**
 * Playwright Configuration.
 *
 * Exercises the production s6 image through branded Chrome while keeping test
 * artifacts outside the repository and every run isolated to one worker.
 *
 * @since 4.0.0
 */
export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  globalSetup: './tests/e2e/global-setup.mjs',
  globalTeardown: './tests/e2e/global-teardown.mjs',
  outputDir: resolve(tmpdir(), 'discord-stonker-bot-playwright'),
  projects: [{
    name: 'Google Chrome',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chrome',
    },
  }],
  reporter: 'list',
  retries: 0,
  testDir: './tests/e2e',
  testMatch: '**/*-test.mjs',
  timeout: 60_000,
  use: {
    baseURL: process.env['STONKER_E2E_BASE_URL'] ?? 'http://localhost:3110',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  workers: 1,
});
