import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { hashPanelPassword } from '../lib/panel-auth.js';
import { createWebhookSignature } from '../lib/web-application-features.js';
import {
  createClient,
  seedServer,
  startHarness,
} from '../tests/support/harness.js';
import { signInTestUser } from '../tests/support/sessions.js';

import type {
  Tests_Routes_Webhooks_Body,
  Tests_Routes_Webhooks_Client,
  Tests_Routes_Webhooks_Harness,
  Tests_Routes_Webhooks_JobRows,
  Tests_Routes_Webhooks_LegacyConfiguration,
  Tests_Routes_Webhooks_ReadJobs_Harness,
  Tests_Routes_Webhooks_ReadJobs_Returns,
  Tests_Routes_Webhooks_Response,
  Tests_Routes_Webhooks_SignedHeaders_Body,
  Tests_Routes_Webhooks_SignedHeaders_Returns,
  Tests_Routes_Webhooks_SignedHeaders_Timestamp,
  Tests_Routes_Webhooks_Timestamp,
  Tests_Routes_Webhooks_TurnOnWebhooks_Client,
  Tests_Routes_Webhooks_TurnOnWebhooks_Confirmation,
  Tests_Routes_Webhooks_TurnOnWebhooks_Grant,
  Tests_Routes_Webhooks_TurnOnWebhooks_Harness,
  Tests_Routes_Webhooks_TurnOnWebhooks_Imported,
  Tests_Routes_Webhooks_TurnOnWebhooks_Returns,
  Tests_Routes_Webhooks_TurnOnWebhooks_Running,
  Tests_Routes_Webhooks_TurnOnWebhooks_UserId,
} from '../types/tests/routes/webhooks.test.d.ts';

/**
 * Webhooks - Server ID.
 *
 * Names the Discord server that owns the signed webhook route.
 * Queued messages carry it.
 *
 * @since 4.0.0
 */
const SERVER_ID = '1197999049190674442';

/**
 * Webhooks - Channel ID.
 *
 * Names the Discord channel the webhook route posts to.
 * Queued messages carry it.
 *
 * @since 4.0.0
 */
const CHANNEL_ID = '1209383231867326487';

/**
 * Webhooks - Signing Secret.
 *
 * Holds the secret the sender and the bot share for signatures.
 * The import stores it encrypted.
 *
 * @since 4.0.0
 */
const SIGNING_SECRET = 'a-webhook-signing-secret-with-at-least-32-characters';

/**
 * Webhooks - Admin Password.
 *
 * Allows the backup import route to freshly confirm the test administrator.
 * The value exists only in the isolated in-memory test database.
 *
 * @since UNRELEASED
 */
const ADMIN_PASSWORD = 'webhook fixture admin password';

/**
 * Webhooks - Legacy Configuration.
 *
 * Describes a config.json with one signed webhook route and a bot token.
 * Importing it is how the tests turn the route on.
 *
 * @since 4.0.0
 */
const legacyConfiguration: Tests_Routes_Webhooks_LegacyConfiguration = {
  'settings': {
    discord: {
      guild: {
        'guild-id': SERVER_ID,
      },
      token: 'fixture-discord-token',
    },
  },
  'web-applications': {
    'map-webhooks': [{
      'channel': {
        'channel-id': CHANNEL_ID,
      },
      'name': 'Donation alert intake',
      'path': '/webhooks/donation-alert',
      'payload': {
        content: 'New donation: **@DONOR@** gave @AMOUNT@',
      },
      'signing-secret': SIGNING_SECRET,
      'variables': [
        {
          id: 'DONOR',
          path: 'donation.donor',
          type: 'string',
        },
        {
          id: 'AMOUNT',
          path: 'donation.amount',
          type: 'usd-dollars',
        },
      ],
    }],
  },
};

/**
 * Webhooks - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database with the test server in it.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Webhooks_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  await seedServer(harness['pool'], SERVER_ID, 'Stonk Club');

  return;
});

afterEach(async () => {
  if (harness !== undefined) {
    await harness.close();
  }

  harness = undefined;

  return;
});

/**
 * Webhooks - Turn On Webhooks.
 *
 * Imports the webhook config.json as an administrator and can mark the bot as running.
 * The import gives the web-applications feature its route and signing secret.
 *
 * @param {Tests_Routes_Webhooks_TurnOnWebhooks_Harness} currentHarness - Current harness.
 * @param {Tests_Routes_Webhooks_TurnOnWebhooks_Running} running        - Running.
 *
 * @returns {Tests_Routes_Webhooks_TurnOnWebhooks_Returns}
 *
 * @since 4.0.0
 */
async function turnOnWebhooks(currentHarness: Tests_Routes_Webhooks_TurnOnWebhooks_Harness, running: Tests_Routes_Webhooks_TurnOnWebhooks_Running): Tests_Routes_Webhooks_TurnOnWebhooks_Returns {
  const admin: Tests_Routes_Webhooks_TurnOnWebhooks_Client = createClient(currentHarness['baseUrl']);

  const userId: Tests_Routes_Webhooks_TurnOnWebhooks_UserId = await signInTestUser(currentHarness['pool'], admin, {
    allServers: true,
    role: 'administrator',
    serverIds: [],
    username: 'admin',
  });

  await currentHarness['pool'].query('UPDATE panel_users SET password_hash = $2 WHERE id = $1', [
    userId,
    await hashPanelPassword(ADMIN_PASSWORD),
  ]);

  const confirmation: Tests_Routes_Webhooks_TurnOnWebhooks_Confirmation = await admin.request('POST', '/api/v1/backup/confirmation', {
    password: ADMIN_PASSWORD,
    purpose: 'import',
  });

  const grant: Tests_Routes_Webhooks_TurnOnWebhooks_Grant = confirmation['body'] as Tests_Routes_Webhooks_TurnOnWebhooks_Grant;

  const imported: Tests_Routes_Webhooks_TurnOnWebhooks_Imported = await admin.request('POST', '/api/v1/backup/imports', {
    grant: grant['grant'],
    source: {
      configuration: JSON.stringify(legacyConfiguration),
      enableFeatures: true,
      serverId: SERVER_ID,
      type: 'legacy',
    },
  });

  if (imported['status'] !== 200) {
    throw new Error(`The webhook config.json was not imported: ${JSON.stringify(imported['body'])}`);
  }

  if (running === true) {
    await currentHarness['pool'].query('UPDATE bot_runtime_control SET desired_state = $1 WHERE singleton = TRUE', ['running']);
  }

  return;
}

/**
 * Webhooks - Signed Headers.
 *
 * Builds the timestamp and signature headers a sender adds to a webhook body.
 * The signature covers the timestamp and the exact body text.
 *
 * @param {Tests_Routes_Webhooks_SignedHeaders_Body}      body      - Body.
 * @param {Tests_Routes_Webhooks_SignedHeaders_Timestamp} timestamp - Timestamp.
 *
 * @returns {Tests_Routes_Webhooks_SignedHeaders_Returns}
 *
 * @since 4.0.0
 */
function signedHeaders(body: Tests_Routes_Webhooks_SignedHeaders_Body, timestamp: Tests_Routes_Webhooks_SignedHeaders_Timestamp): Tests_Routes_Webhooks_SignedHeaders_Returns {
  return {
    'X-Stonker-Signature': `sha256=${createWebhookSignature(body, timestamp, SIGNING_SECRET)}`,
    'X-Stonker-Timestamp': timestamp,
  };
}

/**
 * Webhooks - Read Jobs.
 *
 * Lists the background jobs the webhook route queued, oldest first.
 * The worker would send each one to Discord.
 *
 * @param {Tests_Routes_Webhooks_ReadJobs_Harness} currentHarness - Current harness.
 *
 * @returns {Tests_Routes_Webhooks_ReadJobs_Returns}
 *
 * @since 4.0.0
 */
async function readJobs(currentHarness: Tests_Routes_Webhooks_ReadJobs_Harness): Tests_Routes_Webhooks_ReadJobs_Returns {
  return (await currentHarness['pool'].query('SELECT dedupe_key, payload, type FROM jobs ORDER BY id')).rows;
}

/**
 * Webhooks - Signed Webhooks.
 *
 * Covers queuing a Discord message for a signed request, repeats, and every refusal.
 * Bodies reach the route as raw bytes, so signatures check the exact payload.
 *
 * @since 4.0.0
 */
describe('signed webhooks', () => {
  it('queues one Discord message for each signed request', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    await turnOnWebhooks(harness, true);

    const sender: Tests_Routes_Webhooks_Client = createClient(harness['baseUrl']);
    const body: Tests_Routes_Webhooks_Body = JSON.stringify({
      donation: {
        amount: 25,
        donor: 'Pat',
      },
    });
    const timestamp: Tests_Routes_Webhooks_Timestamp = String(Math.floor(Date.now() / 1000));
    const admitted: Tests_Routes_Webhooks_Response = await sender.request('POST', '/webhooks/donation-alert', body, signedHeaders(body, timestamp));

    expect(admitted).toEqual(expect.objectContaining({
      body: {
        accepted: true,
        duplicate: false,
      },
      status: 202,
    }));

    expect(admitted['headers'].get('Content-Security-Policy')).toBe('default-src \'none\'; frame-ancestors \'none\'');

    expect(admitted['headers'].get('Cache-Control')).toBe('no-store');

    expect(await readJobs(harness)).toEqual([{
      dedupe_key: expect.stringContaining(`signed-webhook:${SERVER_ID}:`),
      payload: {
        channelIdentifier: CHANNEL_ID,
        content: 'New donation: **Pat** gave $25.00',
        guildIdentifier: SERVER_ID,
        reactions: [],
        ruleName: 'Donation alert intake',
      },
      type: 'discord.message.send',
    }]);

    expect(await sender.request('POST', '/webhooks/donation-alert', body, signedHeaders(body, timestamp))).toEqual(expect.objectContaining({
      body: {
        accepted: true,
        duplicate: true,
      },
      status: 200,
    }));

    expect(await readJobs(harness)).toHaveLength(1);

    return;
  });

  it('refuses unsigned, stale, or malformed requests', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    await turnOnWebhooks(harness, true);

    const sender: Tests_Routes_Webhooks_Client = createClient(harness['baseUrl']);
    const body: Tests_Routes_Webhooks_Body = '{"donation":{"donor":"Pat"}}';
    const timestamp: Tests_Routes_Webhooks_Timestamp = String(Math.floor(Date.now() / 1000));
    const staleTimestamp: Tests_Routes_Webhooks_Timestamp = String(Math.floor(Date.now() / 1000) - 3600);

    expect(await sender.request('POST', '/webhooks/donation-alert', body, {
      'X-Stonker-Signature': 'sha256=0000',
      'X-Stonker-Timestamp': timestamp,
    })).toEqual(expect.objectContaining({
      body: 'Invalid or expired webhook signature.',
      status: 401,
    }));

    expect(await sender.request('POST', '/webhooks/donation-alert', body, signedHeaders(body, staleTimestamp))).toEqual(expect.objectContaining({
      body: 'Invalid or expired webhook signature.',
      status: 401,
    }));

    expect(await sender.request('POST', '/webhooks/donation-alert', `${body} `, signedHeaders(body, timestamp))).toEqual(expect.objectContaining({
      body: 'Invalid or expired webhook signature.',
      status: 401,
    }));

    expect(await sender.request('POST', '/webhooks/donation-alert', 'not json', signedHeaders('not json', timestamp))).toEqual(expect.objectContaining({
      body: 'Webhook body must be valid JSON.',
      status: 400,
    }));

    expect(await sender.request('POST', '/webhooks/donation-alert', '["Pat"]', signedHeaders('["Pat"]', timestamp))).toEqual(expect.objectContaining({
      body: 'Webhook body must be a JSON object.',
      status: 400,
    }));

    const wrongMethod: Tests_Routes_Webhooks_Response = await sender.request('GET', '/webhooks/donation-alert');

    expect(wrongMethod).toEqual(expect.objectContaining({
      body: 'Method not allowed.',
      status: 405,
    }));

    expect(wrongMethod['headers'].get('Allow')).toBe('POST');

    expect(await sender.request('POST', '/webhooks/somewhere-else', body, signedHeaders(body, timestamp))).toEqual(expect.objectContaining({
      body: 'Not found.',
      status: 404,
    }));

    const jobs: Tests_Routes_Webhooks_JobRows = await readJobs(harness);

    expect(jobs).toEqual([]);

    return;
  });

  it('waits while the bot is stopped', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    await turnOnWebhooks(harness, false);

    const body: Tests_Routes_Webhooks_Body = '{"donation":{"donor":"Pat"}}';
    const timestamp: Tests_Routes_Webhooks_Timestamp = String(Math.floor(Date.now() / 1000));

    expect(await createClient(harness['baseUrl']).request('POST', '/webhooks/donation-alert', body, signedHeaders(body, timestamp))).toEqual(expect.objectContaining({
      body: 'Discord delivery is not available while the bot is stopped or unconfigured.',
      status: 503,
    }));

    expect(await readJobs(harness)).toEqual([]);

    return;
  });

  return;
});
