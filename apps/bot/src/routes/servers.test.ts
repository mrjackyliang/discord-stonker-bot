import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  createClient,
  seedServer,
  startHarness,
} from '../tests/support/harness.js';
import {
  createTestToken,
  createTestUser,
  signInTestUser,
} from '../tests/support/sessions.js';

import type {
  Tests_Routes_Servers_Client,
  Tests_Routes_Servers_GetHarness_Returns,
  Tests_Routes_Servers_Harness,
  Tests_Routes_Servers_ServerId,
  Tests_Routes_Servers_Token,
  Tests_Routes_Servers_UserId,
} from '../types/tests/routes/servers.test.d.ts';

/**
 * Servers - Server ID.
 *
 * Names the Discord server that has an icon, channels, roles, and features.
 * Scoped users can see it.
 *
 * @since 4.0.0
 */
const SERVER_ID: Tests_Routes_Servers_ServerId = '1197999049190674442';

/**
 * Servers - Other Server ID.
 *
 * Names a second Discord server without an icon, which the bot has left.
 * Scoped users can't see it.
 *
 * @since 4.0.0
 */
const OTHER_SERVER_ID: Tests_Routes_Servers_ServerId = '1209383231867326487';

/**
 * Servers - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database with both servers, their channels, and their roles.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Servers_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  await seedServer(harness['pool'], SERVER_ID, 'Stonker HQ');

  await seedServer(harness['pool'], OTHER_SERVER_ID, 'Archive');

  await harness['pool'].query('UPDATE discord_servers SET icon_hash = $2 WHERE guild_id = $1', [
    SERVER_ID,
    'a_1f2e3d',
  ]);

  await harness['pool'].query('UPDATE discord_servers SET available = FALSE WHERE guild_id = $1', [OTHER_SERVER_ID]);

  await harness['pool'].query('INSERT INTO discord_channels (guild_id, channel_id, name, channel_type, available) VALUES ($1, $2, $3, 0, TRUE), ($1, $4, $5, 2, FALSE)', [
    SERVER_ID,
    '1300000000000000001',
    'general',
    '1300000000000000002',
    'Voice',
  ]);

  await harness['pool'].query('INSERT INTO discord_roles (guild_id, role_id, name, role_position, available) VALUES ($1, $2, $3, 1, TRUE), ($1, $4, $5, 5, TRUE)', [
    SERVER_ID,
    '1300000000000000003',
    'Members',
    '1300000000000000004',
    'Moderators',
  ]);

  await harness['pool'].query('INSERT INTO guild_features (guild_id, feature_key, enabled) VALUES ($1, $2, TRUE), ($1, $3, FALSE)', [
    SERVER_ID,
    'anti-raid',
    'snitch',
  ]);

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
 * Servers - Get Harness.
 *
 * Returns the running app of the current test.
 * Tests use it so each one doesn't check for a missing app.
 *
 * @returns {Tests_Routes_Servers_GetHarness_Returns}
 *
 * @since 4.0.0
 */
function getHarness(): Tests_Routes_Servers_GetHarness_Returns {
  if (harness === undefined) {
    throw new Error('The test server is not running.');
  }

  return harness;
}

/**
 * Servers - Server Routes.
 *
 * Covers the server list and each server's channels and roles, access, and token scopes.
 * Both routes only read.
 *
 * @since 4.0.0
 */
describe('server routes', () => {
  it('lists the servers each user can see, with icons and how many features are on', async () => {
    const owner: Tests_Routes_Servers_Client = createClient(getHarness()['baseUrl']);
    const scoped: Tests_Routes_Servers_Client = createClient(getHarness()['baseUrl']);

    await signInTestUser(getHarness()['pool'], owner, {
      allServers: true,
      role: 'owner',
      serverIds: [],
      username: 'owner',
    });

    await signInTestUser(getHarness()['pool'], scoped, {
      allServers: false,
      role: 'viewer',
      serverIds: [SERVER_ID],
      username: 'viewer',
    });

    expect(await owner.request('GET', '/api/v1/servers')).toEqual(expect.objectContaining({
      body: {
        items: [
          {
            available: true,
            enabledFeatures: 1,
            iconUrl: `https://cdn.discordapp.com/icons/${SERVER_ID}/a_1f2e3d.png?size=128`,
            id: SERVER_ID,
            name: 'Stonker HQ',
          },
          {
            available: false,
            enabledFeatures: 0,
            iconUrl: null,
            id: OTHER_SERVER_ID,
            name: 'Archive',
          },
        ],
      },
      status: 200,
    }));

    expect(await scoped.request('GET', '/api/v1/servers')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({
          id: SERVER_ID,
        })],
      },
      status: 200,
    }));

    return;
  });

  it('lists channels and roles with their type, position, and availability', async () => {
    const scoped: Tests_Routes_Servers_Client = createClient(getHarness()['baseUrl']);

    await signInTestUser(getHarness()['pool'], scoped, {
      allServers: false,
      role: 'viewer',
      serverIds: [SERVER_ID],
      username: 'viewer',
    });

    expect(await scoped.request('GET', `/api/v1/servers/${SERVER_ID}/resources`)).toEqual(expect.objectContaining({
      body: {
        channels: [
          {
            available: true,
            id: '1300000000000000001',
            name: 'general',
            type: 0,
          },
          {
            available: false,
            id: '1300000000000000002',
            name: 'Voice',
            type: 2,
          },
        ],
        roles: [
          {
            available: true,
            id: '1300000000000000004',
            name: 'Moderators',
            position: 5,
          },
          {
            available: true,
            id: '1300000000000000003',
            name: 'Members',
            position: 1,
          },
        ],
      },
      status: 200,
    }));

    expect(await scoped.request('GET', `/api/v1/servers/${OTHER_SERVER_ID}/resources`)).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'server_not_found',
          message: 'That Discord server isn\'t available.',
        },
      },
      status: 404,
    }));

    expect((await scoped.request('GET', '/api/v1/servers/not-a-server/resources'))['status']).toBe(404);

    return;
  });

  it('accepts tokens with features:read only', async () => {
    const userId: Tests_Routes_Servers_UserId = await createTestUser(getHarness()['pool'], {
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });
    const featuresToken: Tests_Routes_Servers_Token = await createTestToken(getHarness()['pool'], userId, ['features:read']);
    const logsToken: Tests_Routes_Servers_Token = await createTestToken(getHarness()['pool'], userId, ['logs:read']);

    expect((await createClient(getHarness()['baseUrl'], {
      Authorization: `Bearer ${featuresToken}`,
    }).request('GET', `/api/v1/servers/${SERVER_ID}/resources`))['status']).toBe(200);

    expect(await createClient(getHarness()['baseUrl'], {
      Authorization: `Bearer ${logsToken}`,
    }).request('GET', '/api/v1/servers')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'scope_required',
          message: 'This token doesn\'t have the features:read scope.',
        },
      },
      status: 403,
    }));

    expect((await createClient(getHarness()['baseUrl']).request('GET', '/api/v1/servers'))['status']).toBe(401);

    return;
  });

  return;
});
