import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  addUser,
  claimOwner,
  enableAuthenticator,
  OWNER_PASSWORD,
  signIn,
} from '../tests/support/accounts.js';
import {
  createClient,
  seedServer,
  startHarness,
} from '../tests/support/harness.js';

import type {
  Tests_Routes_Users_BaseUrl,
  Tests_Routes_Users_Client,
  Tests_Routes_Users_Harness,
  Tests_Routes_Users_Items,
  Tests_Routes_Users_Output,
  Tests_Routes_Users_OutputSpy,
  Tests_Routes_Users_Plaintext,
  Tests_Routes_Users_Response,
  Tests_Routes_Users_Responses,
  Tests_Routes_Users_ServerId,
  Tests_Routes_Users_UserId,
} from '../types/tests/routes/users.test.d.ts';

/**
 * Users - Alpha Server ID.
 *
 * Names the first Discord server the tests add.
 * Scoped users get access to it.
 *
 * @since 4.0.0
 */
const ALPHA_SERVER_ID: Tests_Routes_Users_ServerId = '100000000000000001';

/**
 * Users - Beta Server ID.
 *
 * Names the second Discord server the tests add.
 * Scoped administrators without it can't grant it.
 *
 * @since 4.0.0
 */
const BETA_SERVER_ID: Tests_Routes_Users_ServerId = '100000000000000002';

/**
 * Users - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database with two Discord servers.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Users_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  await seedServer(harness['pool'], ALPHA_SERVER_ID, 'Alpha');

  await seedServer(harness['pool'], BETA_SERVER_ID, 'Beta');

  return;
});

afterEach(async () => {
  vi.restoreAllMocks();

  if (harness !== undefined) {
    await harness.close();
  }

  harness = undefined;

  return;
});

/**
 * Users - User Routes.
 *
 * Covers listing, adding, changing, resetting, and removing panel users.
 * Only the owner and administrators manage users, and never the owner or themselves.
 *
 * @since 4.0.0
 */
describe('user routes', () => {
  it('lists, adds, and changes users, and signs suspended users out', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Users_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Users_Client = createClient(baseUrl);
    const operator: Tests_Routes_Users_Client = createClient(baseUrl);
    const output: Tests_Routes_Users_OutputSpy = vi.spyOn(process.stdout, 'write');

    await claimOwner(harness['pool'], owner);

    expect(await owner.request('POST', '/api/v1/users', {
      allServers: true,
      password: 'administrator password',
      role: 'administrator',
      serverIds: [],
      username: 'admin1',
    })).toEqual(expect.objectContaining({
      body: {
        allServers: true,
        createdAt: expect.any(String),
        editable: true,
        enabled: true,
        id: expect.any(String),
        lastSignInAt: null,
        passkeys: 0,
        role: 'administrator',
        serverIds: [],
        twoFactor: false,
        username: 'admin1',
      },
      status: 201,
    }));

    const operatorId: Tests_Routes_Users_UserId = await addUser(owner, {
      allServers: false,
      password: 'operator password for tests',
      role: 'operator',
      serverIds: [ALPHA_SERVER_ID],
      username: 'operator1',
    });

    await addUser(owner, {
      allServers: false,
      password: 'viewer password for tests',
      role: 'viewer',
      serverIds: [
        BETA_SERVER_ID,
        ALPHA_SERVER_ID,
      ],
      username: 'viewer1',
    });

    const listed: Tests_Routes_Users_Response = await owner.request('GET', '/api/v1/users');
    const items: Tests_Routes_Users_Items = Reflect.get(Object(listed['body']), 'items');

    expect(listed['status']).toBe(200);

    expect(items.map((item) => [
      item['username'],
      item['role'],
      item['editable'],
      item['serverIds'],
    ])).toEqual([
      [
        'owner',
        'owner',
        false,
        [],
      ],
      [
        'admin1',
        'administrator',
        true,
        [],
      ],
      [
        'operator1',
        'operator',
        true,
        [ALPHA_SERVER_ID],
      ],
      [
        'viewer1',
        'viewer',
        true,
        [
          ALPHA_SERVER_ID,
          BETA_SERVER_ID,
        ],
      ],
    ]);

    expect(await owner.request('POST', '/api/v1/users', {
      allServers: true,
      password: 'administrator password',
      role: 'operator',
      serverIds: [],
      username: 'ADMIN1',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'username_taken',
          issues: [{
            field: 'username',
            message: 'That username is already in use.',
            path: ['username'],
          }],
          message: 'That username is already in use.',
        },
      },
      status: 409,
    }));

    const refusedUsers: Tests_Routes_Users_Responses = await Promise.all([
      {
        allServers: true,
        password: 'a long enough password',
        role: 'owner',
        serverIds: [],
        username: 'second-owner',
      },
      {
        allServers: false,
        password: 'a long enough password',
        role: 'viewer',
        serverIds: [],
        username: 'no-servers',
      },
      {
        allServers: false,
        password: 'a long enough password',
        role: 'viewer',
        serverIds: [
          ALPHA_SERVER_ID,
          ALPHA_SERVER_ID,
        ],
        username: 'twice',
      },
      {
        allServers: false,
        password: 'a long enough password',
        role: 'viewer',
        serverIds: ['not-a-server'],
        username: 'malformed',
      },
      {
        password: 'a long enough password',
        role: 'viewer',
        serverIds: [ALPHA_SERVER_ID],
        username: 'undecided',
      },
    ].map(async (body) => owner.request('POST', '/api/v1/users', body)));

    expect(refusedUsers.map((refusedUser) => [
      refusedUser['status'],
      Reflect.get(Object(Reflect.get(Object(refusedUser['body']), 'error')), 'issues'),
    ])).toEqual([
      [
        422,
        [{
          field: 'role',
          message: 'Choose administrator, operator, or viewer.',
          path: ['role'],
        }],
      ],
      [
        422,
        [{
          field: 'serverIds',
          message: 'Choose at least one server, or give access to every server.',
          path: ['serverIds'],
        }],
      ],
      [
        422,
        [{
          field: 'serverIds',
          message: 'Choose each server only once.',
          path: ['serverIds'],
        }],
      ],
      [
        422,
        [{
          field: 'serverIds.0',
          message: 'Choose servers from the list.',
          path: [
            'serverIds',
            '0',
          ],
        }],
      ],
      [
        422,
        [{
          field: 'allServers',
          message: 'Choose whether this user can see every server.',
          path: ['allServers'],
        }],
      ],
    ]);

    expect(await owner.request('POST', '/api/v1/users', {
      allServers: false,
      password: 'a long enough password',
      role: 'viewer',
      serverIds: ['999999999999999999'],
      username: 'unknown-server',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'serverIds',
            message: 'Choose servers from the list.',
            path: ['serverIds'],
          }],
          message: 'Choose servers from the list.',
        },
      },
      status: 422,
    }));

    expect(await signIn(operator, 'operator1', 'operator password for tests')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'authenticated',
        user: {
          id: operatorId,
          role: 'operator',
          username: 'operator1',
        },
      }),
      status: 200,
    }));

    expect((await operator.request('GET', '/api/v1/auth/me'))['body']).toEqual({
      allServers: false,
      authenticationType: 'session',
      id: operatorId,
      permissions: [
        'bot:control',
        'configuration:write',
      ],
      removedSecrets: [],
      role: 'operator',
      serverIds: [ALPHA_SERVER_ID],
      username: 'operator1',
    });

    const created: Tests_Routes_Users_Response = await operator.request('POST', '/api/v1/auth/tokens', {
      name: 'Ops script',
      scopes: ['logs:read'],
    });
    const plaintext: Tests_Routes_Users_Plaintext = String(Reflect.get(Object(created['body']), 'plaintext'));
    const operatorToken: Tests_Routes_Users_Client = createClient(baseUrl, {
      Authorization: `Bearer ${plaintext}`,
    });

    expect(await owner.request('PUT', `/api/v1/users/${operatorId}`, {
      allServers: false,
      enabled: true,
      role: 'viewer',
      serverIds: [BETA_SERVER_ID],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        enabled: true,
        id: operatorId,
        lastSignInAt: expect.any(String),
        role: 'viewer',
        serverIds: [BETA_SERVER_ID],
      }),
      status: 200,
    }));

    expect((await operator.request('GET', '/api/v1/auth/me'))['body']).toEqual(expect.objectContaining({
      permissions: [],
      role: 'viewer',
      serverIds: [BETA_SERVER_ID],
    }));

    expect((await owner.request('PUT', `/api/v1/users/${operatorId}`, {
      allServers: true,
      role: 'viewer',
      serverIds: [],
    }))['body']).toEqual({
      error: {
        code: 'invalid_request',
        issues: [{
          field: 'enabled',
          message: 'Choose whether this user can sign in.',
          path: ['enabled'],
        }],
        message: 'Choose whether this user can sign in.',
      },
    });

    expect(await owner.request('PUT', `/api/v1/users/${operatorId}`, {
      allServers: true,
      enabled: false,
      role: 'viewer',
      serverIds: [],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        allServers: true,
        enabled: false,
        serverIds: [],
      }),
      status: 200,
    }));

    expect((await operator.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect((await operatorToken.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect((await signIn(createClient(baseUrl), 'operator1', 'operator password for tests'))['body']).toEqual({
      error: {
        code: 'credentials_invalid',
        message: 'The username or password is incorrect.',
      },
    });

    await owner.request('PUT', `/api/v1/users/${operatorId}`, {
      allServers: true,
      enabled: true,
      role: 'viewer',
      serverIds: [],
    });

    expect((await signIn(createClient(baseUrl), 'operator1', 'operator password for tests'))['status']).toBe(200);

    expect((await operatorToken.request('GET', '/api/v1/auth/me'))['status']).toBe(200);

    const written: Tests_Routes_Users_Output = output.mock.calls.map((call) => String(call[0])).join('');

    expect(written).toContain('"event":"user_created"');

    expect(written).toContain('"event":"user_updated"');

    expect(written).not.toContain('operator password for tests');

    expect(written).not.toContain(plaintext);

    return;
  });

  it('resets passwords and sign-in methods, and deletes users', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Users_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Users_Client = createClient(baseUrl);
    const viewer: Tests_Routes_Users_Client = createClient(baseUrl);
    const newPassword: Tests_Routes_Users_Plaintext = 'a reset viewer password';

    await claimOwner(harness['pool'], owner);

    const viewerId: Tests_Routes_Users_UserId = await addUser(owner, {
      allServers: true,
      password: 'viewer password for tests',
      role: 'viewer',
      serverIds: [],
      username: 'viewer1',
    });

    await signIn(viewer, 'viewer1', 'viewer password for tests');

    await enableAuthenticator(viewer, 'viewer password for tests');

    const created: Tests_Routes_Users_Response = await viewer.request('POST', '/api/v1/auth/tokens', {
      name: 'Reader',
      scopes: ['features:read'],
    });
    const viewerToken: Tests_Routes_Users_Client = createClient(baseUrl, {
      Authorization: `Bearer ${String(Reflect.get(Object(created['body']), 'plaintext'))}`,
    });

    expect((await owner.request('POST', `/api/v1/users/${viewerId}/password`, {
      password: 'short',
    }))['body']).toEqual({
      error: {
        code: 'invalid_request',
        issues: [{
          field: 'password',
          message: 'Use at least 12 characters.',
          path: ['password'],
        }],
        message: 'Use at least 12 characters.',
      },
    });

    expect(await owner.request('POST', `/api/v1/users/${viewerId}/password`, {
      password: newPassword,
    })).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect((await viewer.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect((await viewerToken.request('GET', '/api/v1/auth/me'))['status']).toBe(200);

    expect((await signIn(createClient(baseUrl), 'viewer1', 'viewer password for tests'))['status']).toBe(401);

    expect((await signIn(createClient(baseUrl), 'viewer1', newPassword))['body']).toEqual(expect.objectContaining({
      status: 'second_factor_required',
    }));

    expect(await owner.request('GET', '/api/v1/users')).toEqual(expect.objectContaining({
      body: {
        items: [
          expect.objectContaining({
            username: 'owner',
          }),
          expect.objectContaining({
            twoFactor: true,
            username: 'viewer1',
          }),
        ],
      },
    }));

    expect(await owner.request('POST', `/api/v1/users/${viewerId}/two-factor/reset`)).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect((await signIn(viewer, 'viewer1', newPassword))['body']).toEqual(expect.objectContaining({
      status: 'authenticated',
    }));

    expect(await viewer.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        passkeys: [],
        recoveryCodesRemaining: 0,
        totpEnabled: false,
      }),
      status: 200,
    }));

    expect(await owner.request('DELETE', `/api/v1/users/${viewerId}`)).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect((await viewer.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect((await viewerToken.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect(await owner.request('GET', '/api/v1/users')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({
          username: 'owner',
        })],
      },
    }));

    const missing: Tests_Routes_Users_Responses = await Promise.all([
      owner.request('DELETE', `/api/v1/users/${viewerId}`),
      owner.request('POST', `/api/v1/users/${viewerId}/two-factor/reset`),
      owner.request('PUT', '/api/v1/users/abc', {
        allServers: true,
        enabled: true,
        role: 'viewer',
        serverIds: [],
      }),
      owner.request('POST', '/api/v1/users/1234567890123456789/password', {
        password: newPassword,
      }),
      owner.request('POST', '/api/v1/users/0/password', {
        password: newPassword,
      }),
    ]);

    for (const missingUser of missing) {
      expect(missingUser).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'user_not_found',
            message: 'That user no longer exists.',
          },
        },
        status: 404,
      }));
    }

    return;
  });

  it('protects the owner, your own account, and users outside a scoped administrator\'s servers', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Users_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Users_Client = createClient(baseUrl);
    const scoped: Tests_Routes_Users_Client = createClient(baseUrl);
    const viewer: Tests_Routes_Users_Client = createClient(baseUrl);

    await claimOwner(harness['pool'], owner);

    const ownerId: Tests_Routes_Users_UserId = String(Reflect.get(Object((await owner.request('GET', '/api/v1/auth/me'))['body']), 'id'));
    const scopedId: Tests_Routes_Users_UserId = await addUser(owner, {
      allServers: false,
      password: 'scoped administrator password',
      role: 'administrator',
      serverIds: [ALPHA_SERVER_ID],
      username: 'scoped',
    });
    const alphaId: Tests_Routes_Users_UserId = await addUser(owner, {
      allServers: false,
      password: 'alpha operator password',
      role: 'operator',
      serverIds: [ALPHA_SERVER_ID],
      username: 'alpha-op',
    });
    const bothId: Tests_Routes_Users_UserId = await addUser(owner, {
      allServers: false,
      password: 'both viewer password',
      role: 'viewer',
      serverIds: [
        ALPHA_SERVER_ID,
        BETA_SERVER_ID,
      ],
      username: 'both',
    });
    const globalId: Tests_Routes_Users_UserId = await addUser(owner, {
      allServers: true,
      password: 'global administrator password',
      role: 'administrator',
      serverIds: [],
      username: 'global',
    });

    await signIn(scoped, 'scoped', 'scoped administrator password');

    const listed: Tests_Routes_Users_Response = await scoped.request('GET', '/api/v1/users');

    expect((Reflect.get(Object(listed['body']), 'items') as Tests_Routes_Users_Items).map((item) => [
      item['username'],
      item['editable'],
      item['allServers'],
      item['serverIds'],
    ])).toEqual([
      [
        'owner',
        false,
        true,
        [],
      ],
      [
        'global',
        false,
        true,
        [],
      ],
      [
        'scoped',
        false,
        false,
        [ALPHA_SERVER_ID],
      ],
      [
        'alpha-op',
        true,
        false,
        [ALPHA_SERVER_ID],
      ],
      [
        'both',
        false,
        false,
        [ALPHA_SERVER_ID],
      ],
    ]);

    const protectedUsers: Tests_Routes_Users_Responses = await Promise.all([
      scoped.request('PUT', `/api/v1/users/${ownerId}`, {
        allServers: false,
        enabled: false,
        role: 'viewer',
        serverIds: [ALPHA_SERVER_ID],
      }),
      scoped.request('PUT', `/api/v1/users/${scopedId}`, {
        allServers: false,
        enabled: true,
        role: 'administrator',
        serverIds: [ALPHA_SERVER_ID],
      }),
      scoped.request('PUT', `/api/v1/users/${bothId}`, {
        allServers: false,
        enabled: true,
        role: 'viewer',
        serverIds: [ALPHA_SERVER_ID],
      }),
      scoped.request('DELETE', `/api/v1/users/${globalId}`),
      scoped.request('DELETE', `/api/v1/users/${ownerId}`),
      scoped.request('POST', `/api/v1/users/${ownerId}/password`, {
        password: 'taking over the owner',
      }),
      scoped.request('POST', `/api/v1/users/${ownerId}/two-factor/reset`),
      owner.request('DELETE', `/api/v1/users/${ownerId}`),
    ]);

    for (const protectedUser of protectedUsers) {
      expect(protectedUser).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'user_protected',
            message: 'You can\'t change this account here.',
          },
        },
        status: 403,
      }));
    }

    expect((await scoped.request('PUT', `/api/v1/users/${alphaId}`, {
      allServers: false,
      enabled: true,
      role: 'viewer',
      serverIds: [ALPHA_SERVER_ID],
    }))['status']).toBe(200);

    const refusedGrants: Tests_Routes_Users_Responses = await Promise.all([
      scoped.request('PUT', `/api/v1/users/${alphaId}`, {
        allServers: false,
        enabled: true,
        role: 'viewer',
        serverIds: [
          ALPHA_SERVER_ID,
          BETA_SERVER_ID,
        ],
      }),
      scoped.request('PUT', `/api/v1/users/${alphaId}`, {
        allServers: true,
        enabled: true,
        role: 'viewer',
        serverIds: [],
      }),
      scoped.request('POST', '/api/v1/users', {
        allServers: false,
        password: 'a long enough password',
        role: 'viewer',
        serverIds: [BETA_SERVER_ID],
        username: 'beta-viewer',
      }),
      scoped.request('POST', '/api/v1/users', {
        allServers: true,
        password: 'a long enough password',
        role: 'viewer',
        serverIds: [],
        username: 'every-viewer',
      }),
    ]);

    expect(refusedGrants.map((refusedGrant) => [
      refusedGrant['status'],
      refusedGrant['body'],
    ])).toEqual([
      [
        422,
        {
          error: {
            code: 'invalid_request',
            issues: [{
              field: 'serverIds',
              message: 'You can only give access to servers you can see.',
              path: ['serverIds'],
            }],
            message: 'You can only give access to servers you can see.',
          },
        },
      ],
      [
        422,
        {
          error: {
            code: 'invalid_request',
            issues: [{
              field: 'allServers',
              message: 'You can only give access to servers you can see.',
              path: ['allServers'],
            }],
            message: 'You can only give access to servers you can see.',
          },
        },
      ],
      [
        422,
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'You can only give access to servers you can see.',
          }),
        }),
      ],
      [
        422,
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'You can only give access to servers you can see.',
          }),
        }),
      ],
    ]);

    expect(await scoped.request('POST', '/api/v1/users', {
      allServers: false,
      password: 'a long enough password',
      role: 'viewer',
      serverIds: [ALPHA_SERVER_ID],
      username: 'alpha-viewer',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        editable: true,
        serverIds: [ALPHA_SERVER_ID],
        username: 'alpha-viewer',
      }),
      status: 201,
    }));

    expect((await owner.request('PUT', `/api/v1/users/${globalId}`, {
      allServers: false,
      enabled: true,
      role: 'operator',
      serverIds: [BETA_SERVER_ID],
    }))['body']).toEqual(expect.objectContaining({
      role: 'operator',
      serverIds: [BETA_SERVER_ID],
    }));

    await signIn(viewer, 'both', 'both viewer password');

    expect(await viewer.request('GET', '/api/v1/users')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'permission_required',
          message: 'Your role can\'t manage users.',
        },
      },
      status: 403,
    }));

    const created: Tests_Routes_Users_Response = await owner.request('POST', '/api/v1/auth/tokens', {
      name: 'Everything',
      scopes: [
        'bot:control',
        'features:read',
        'features:write',
        'logs:read',
      ],
    });

    expect(await createClient(baseUrl, {
      Authorization: `Bearer ${String(Reflect.get(Object(created['body']), 'plaintext'))}`,
    }).request('GET', '/api/v1/users')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'A signed-in browser session is required.',
        },
      },
      status: 403,
    }));

    expect((await owner.request('POST', '/api/v1/users', {
      allServers: true,
      password: OWNER_PASSWORD,
      role: 'viewer',
      serverIds: [],
      username: 'csrf-viewer',
    }, {
      'X-CSRF-Token': 'not-the-csrf-token',
    }))['body']).toEqual({
      error: {
        code: 'csrf_invalid',
        message: 'The request CSRF token is missing or invalid.',
      },
    });

    return;
  });

  return;
});
