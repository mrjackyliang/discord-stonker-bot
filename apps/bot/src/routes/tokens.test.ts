import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { isPanelTokenId } from '../lib/panel-tokens.js';
import { LIB_REGEX_PATTERN_API_TOKEN } from '../lib/regex.js';
import {
  addUser,
  claimOwner,
  signIn,
} from '../tests/support/accounts.js';
import {
  createClient,
  startHarness,
} from '../tests/support/harness.js';

import type {
  Tests_Routes_Tokens_BaseUrl,
  Tests_Routes_Tokens_Client,
  Tests_Routes_Tokens_Harness,
  Tests_Routes_Tokens_Plaintext,
  Tests_Routes_Tokens_Response,
  Tests_Routes_Tokens_Responses,
  Tests_Routes_Tokens_TokenId,
} from '../types/tests/routes/tokens.test.d.ts';

/**
 * Tokens - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Tokens_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

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
 * Tokens - Token Routes.
 *
 * Covers creating, editing, and revoking personal access tokens, and what roles may grant.
 * Tokens belong to the user who made them and act as that user.
 *
 * @since 4.0.0
 */
describe('token routes', () => {
  it('creates, edits, and revokes named tokens', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Tokens_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Tokens_Client = createClient(baseUrl);

    await claimOwner(harness['pool'], owner);

    const created: Tests_Routes_Tokens_Response = await owner.request('POST', '/api/v1/auth/tokens', {
      name: '  Home Assistant  ',
      scopes: [
        'logs:read',
        'bot:control',
      ],
    });
    const tokenId: Tests_Routes_Tokens_TokenId = String(Reflect.get(Object(Reflect.get(Object(created['body']), 'token')), 'id'));
    const plaintext: Tests_Routes_Tokens_Plaintext = String(Reflect.get(Object(created['body']), 'plaintext'));

    expect(created).toEqual(expect.objectContaining({
      body: {
        plaintext: expect.stringMatching(LIB_REGEX_PATTERN_API_TOKEN),
        token: {
          createdAt: expect.any(String),
          expiresAt: null,
          id: tokenId,
          lastUsedAt: null,
          name: 'Home Assistant',
          scopes: [
            'bot:control',
            'logs:read',
          ],
        },
      },
      status: 201,
    }));

    expect(isPanelTokenId(tokenId)).toBe(true);

    expect(await owner.request('POST', '/api/v1/auth/tokens', {
      expiresAt: null,
      name: 'Backup script',
      scopes: ['features:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        token: expect.objectContaining({
          expiresAt: null,
        }),
      }),
      status: 201,
    }));

    expect(await owner.request('POST', '/api/v1/auth/tokens', {
      name: 'HOME ASSISTANT',
      scopes: ['logs:read'],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'token_exists',
          issues: [{
            field: 'name',
            message: 'A token with this name already exists.',
            path: ['name'],
          }],
          message: 'A token with this name already exists.',
        },
      },
      status: 409,
    }));

    expect(await owner.request('POST', '/api/v1/auth/tokens', {
      expiresAt: '2099-01-31',
      id: 'home-assistant',
      name: 'x'.repeat(81),
      scopes: [
        'features:delete',
        'features:delete',
      ],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'expiresAt',
              message: 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.',
              path: ['expiresAt'],
            },
            {
              field: 'name',
              message: 'Use 80 characters or fewer.',
              path: ['name'],
            },
            {
              field: 'scopes.0',
              message: 'Choose from: bot:control, features:read, features:write, logs:read.',
              path: [
                'scopes',
                '0',
              ],
            },
            {
              field: 'scopes.1',
              message: 'Choose from: bot:control, features:read, features:write, logs:read.',
              path: [
                'scopes',
                '1',
              ],
            },
            {
              field: 'id',
              message: 'This field isn\'t accepted.',
              path: ['id'],
            },
          ],
          message: 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/tokens', {
      expiresAt: '2020-01-01T00:00:00Z',
      name: 'Old script',
      scopes: [
        'logs:read',
        'logs:read',
      ],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'expiresAt',
              message: 'Choose an expiration date in the future.',
              path: ['expiresAt'],
            },
            {
              field: 'scopes',
              message: 'Choose each scope only once.',
              path: ['scopes'],
            },
          ],
          message: 'Choose an expiration date in the future.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/tokens', {
      name: ' ',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'name',
              message: 'Name this token.',
              path: ['name'],
            },
            {
              field: 'scopes',
              message: 'Choose at least one scope.',
              path: ['scopes'],
            },
          ],
          message: 'Name this token.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      name: 'backup SCRIPT',
      scopes: ['logs:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          code: 'token_exists',
        }),
      }),
      status: 409,
    }));

    expect(await owner.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      expiresAt: '2099-01-01T00:00:00.000Z',
      name: 'home assistant',
      scopes: ['features:read'],
    })).toEqual(expect.objectContaining({
      body: {
        createdAt: expect.any(String),
        expiresAt: '2099-01-01T00:00:00.000Z',
        id: tokenId,
        lastUsedAt: null,
        name: 'home assistant',
        scopes: ['features:read'],
      },
      status: 200,
    }));

    expect(await owner.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      name: 'Home Assistant',
      scopes: ['features:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        expiresAt: '2099-01-01T00:00:00.000Z',
        name: 'Home Assistant',
      }),
      status: 200,
    }));

    expect(await owner.request('PUT', `/api/v1/auth/tokens/${tokenId}`, {
      expiresAt: null,
      name: 'Home Assistant',
      scopes: ['features:read'],
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        expiresAt: null,
      }),
      status: 200,
    }));

    const tokenClient: Tests_Routes_Tokens_Client = createClient(baseUrl, {
      Authorization: `Bearer ${plaintext}`,
    });

    expect(await tokenClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        name: 'Home Assistant',
        scopes: ['features:read'],
      }),
      status: 200,
    }));

    expect(await owner.request('GET', '/api/v1/auth/tokens')).toEqual(expect.objectContaining({
      body: {
        items: [
          expect.objectContaining({
            lastUsedAt: null,
            name: 'Backup script',
          }),
          expect.objectContaining({
            id: tokenId,
            lastUsedAt: expect.any(String),
            name: 'Home Assistant',
          }),
        ],
      },
      status: 200,
    }));

    expect(await tokenClient.request('GET', '/api/v1/auth/tokens')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'A signed-in browser session is required.',
        },
      },
      status: 403,
    }));

    expect(await owner.request('DELETE', `/api/v1/auth/tokens/${tokenId}`)).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect((await tokenClient.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    const missing: Tests_Routes_Tokens_Responses = await Promise.all([
      tokenId,
      'Not A Token',
      'tok-ABCDEF0123456789',
    ].flatMap((missingTokenId) => [
      owner.request('PUT', `/api/v1/auth/tokens/${encodeURIComponent(missingTokenId)}`, {
        name: 'Home Assistant',
        scopes: ['logs:read'],
      }),
      owner.request('DELETE', `/api/v1/auth/tokens/${encodeURIComponent(missingTokenId)}`),
    ]));

    for (const missingToken of missing) {
      expect(missingToken).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'token_not_found',
            message: 'That token no longer exists.',
          },
        },
        status: 404,
      }));
    }

    return;
  });

  it('limits scopes by role, keeps tokens to their owner, and stops expired ones', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Tokens_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Tokens_Client = createClient(baseUrl);
    const viewer: Tests_Routes_Tokens_Client = createClient(baseUrl);
    const operator: Tests_Routes_Tokens_Client = createClient(baseUrl);

    await claimOwner(harness['pool'], owner);

    await addUser(owner, {
      allServers: true,
      password: 'viewer password for tests',
      role: 'viewer',
      serverIds: [],
      username: 'viewer1',
    });

    await addUser(owner, {
      allServers: true,
      password: 'operator password for tests',
      role: 'operator',
      serverIds: [],
      username: 'operator1',
    });

    await signIn(viewer, 'viewer1', 'viewer password for tests');

    await signIn(operator, 'operator1', 'operator password for tests');

    const reader: Tests_Routes_Tokens_Response = await viewer.request('POST', '/api/v1/auth/tokens', {
      name: 'Reader',
      scopes: [
        'features:read',
        'logs:read',
      ],
    });
    const readerId: Tests_Routes_Tokens_TokenId = String(Reflect.get(Object(Reflect.get(Object(reader['body']), 'token')), 'id'));

    expect(reader['status']).toBe(201);

    expect(await viewer.request('POST', '/api/v1/auth/tokens', {
      name: 'Writer',
      scopes: [
        'logs:read',
        'features:write',
      ],
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'scopes',
            message: 'Your role can\'t grant features:write.',
            path: ['scopes'],
          }],
          message: 'Your role can\'t grant features:write.',
        },
      },
      status: 422,
    }));

    expect((await viewer.request('PUT', `/api/v1/auth/tokens/${readerId}`, {
      name: 'Reader',
      scopes: ['bot:control'],
    }))['body']).toEqual({
      error: {
        code: 'invalid_request',
        issues: [{
          field: 'scopes',
          message: 'Your role can\'t grant bot:control.',
          path: ['scopes'],
        }],
        message: 'Your role can\'t grant bot:control.',
      },
    });

    const operatorToken: Tests_Routes_Tokens_Response = await operator.request('POST', '/api/v1/auth/tokens', {
      expiresAt: '2099-06-01T12:00:00+02:00',
      name: 'Reader',
      scopes: [
        'bot:control',
        'features:read',
        'features:write',
        'logs:read',
      ],
    });
    const operatorTokenId: Tests_Routes_Tokens_TokenId = String(Reflect.get(Object(Reflect.get(Object(operatorToken['body']), 'token')), 'id'));
    const operatorPlaintext: Tests_Routes_Tokens_Plaintext = String(Reflect.get(Object(operatorToken['body']), 'plaintext'));

    expect(operatorToken).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        token: expect.objectContaining({
          expiresAt: '2099-06-01T10:00:00.000Z',
          name: 'Reader',
        }),
      }),
      status: 201,
    }));

    expect(await viewer.request('GET', '/api/v1/auth/tokens')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({
          id: readerId,
          name: 'Reader',
        })],
      },
      status: 200,
    }));

    expect((await operator.request('DELETE', `/api/v1/auth/tokens/${readerId}`))['status']).toBe(404);

    expect((await operator.request('PUT', `/api/v1/auth/tokens/${readerId}`, {
      name: 'Taken over',
      scopes: ['logs:read'],
    }))['status']).toBe(404);

    expect(await createClient(baseUrl, {
      Authorization: `Bearer ${operatorPlaintext}`,
    }).request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        authenticationType: 'token',
        id: operatorTokenId,
        name: 'Reader',
        scopes: [
          'bot:control',
          'features:read',
          'features:write',
          'logs:read',
        ],
        username: 'operator1',
      },
      status: 200,
    }));

    await harness['pool'].query('UPDATE panel_api_tokens SET expires_at = NOW() - INTERVAL \'1 minute\' WHERE id = $1', [operatorTokenId]);

    expect(await createClient(baseUrl, {
      Authorization: `Bearer ${operatorPlaintext}`,
    }).request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'A valid personal access token is required.',
        },
      },
      status: 401,
    }));

    expect(await operator.request('GET', '/api/v1/auth/tokens')).toEqual(expect.objectContaining({
      body: {
        items: [expect.objectContaining({
          expiresAt: expect.any(String),
          id: operatorTokenId,
        })],
      },
      status: 200,
    }));

    return;
  });

  return;
});
