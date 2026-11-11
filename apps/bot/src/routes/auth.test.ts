import {
  mkdtemp,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { prepareCredentialKey } from '../lib/credential-key.js';
import { preparePanelSetupClaim } from '../lib/panel-setup.js';
import {
  claimOwner,
  createTotpCode,
  enableAuthenticator,
  OWNER_PASSWORD,
  requestInOrder,
  signIn,
} from '../tests/support/accounts.js';
import {
  createClient,
  startHarness,
} from '../tests/support/harness.js';
import {
  createAssertion,
  createAuthenticator,
  createRegistration,
} from '../tests/support/passkeys.js';
import { signInTestUser } from '../tests/support/sessions.js';

import type {
  Tests_Routes_Auth_Authenticator,
  Tests_Routes_Auth_BaseUrl,
  Tests_Routes_Auth_Challenge,
  Tests_Routes_Auth_Client,
  Tests_Routes_Auth_Code,
  Tests_Routes_Auth_Count,
  Tests_Routes_Auth_Harness,
  Tests_Routes_Auth_KeyDirectory,
  Tests_Routes_Auth_Options,
  Tests_Routes_Auth_Output,
  Tests_Routes_Auth_OutputSpy,
  Tests_Routes_Auth_Passkey,
  Tests_Routes_Auth_RecoveryCode,
  Tests_Routes_Auth_RemovedSecrets,
  Tests_Routes_Auth_Response,
  Tests_Routes_Auth_Responses,
  Tests_Routes_Auth_SetupClaim,
  Tests_Routes_Auth_Token,
} from '../types/tests/routes/auth.test.d.ts';

/**
 * Auth - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database and a fresh attempt counter.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Auth_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

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
 * Auth - Auth Routes.
 *
 * Covers first-run setup, password and second-step sign-in, passkeys, and sign-out.
 * Messages are checked word for word because the control panel shows them as they are.
 *
 * @since 4.0.0
 */
describe('auth routes', () => {
  it('creates the owner once with the setup code from the container log', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const client: Tests_Routes_Auth_Client = createClient(harness['baseUrl']);

    expect(await client.request('GET', '/api/v1/setup/status')).toEqual(expect.objectContaining({
      body: {
        claimRequired: true,
      },
      status: 200,
    }));

    const setupClaim: Tests_Routes_Auth_SetupClaim = await preparePanelSetupClaim(harness['pool']);

    if (setupClaim === undefined) {
      throw new Error('The setup code was not prepared.');
    }

    expect(await client.request('GET', '/api/v1/setup/status')).toEqual(expect.objectContaining({
      body: {
        claimExpiresAt: setupClaim['expiresAt'],
        claimRequired: true,
      },
      status: 200,
    }));

    expect(await client.request('POST', '/api/v1/setup/claim', {
      password: OWNER_PASSWORD,
      username: 'owner',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'claimCode',
            message: 'Enter the setup code from the container log.',
            path: ['claimCode'],
          }],
          message: 'Enter the setup code from the container log.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode: setupClaim['code'],
      password: 'too short',
      username: 'ab',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'password',
              message: 'Use at least 12 characters.',
              path: ['password'],
            },
            {
              field: 'username',
              message: 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.',
              path: ['username'],
            },
          ],
          message: 'Use at least 12 characters.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode: 'AAAAA-BBBBB-CCCCC',
      password: OWNER_PASSWORD,
      username: 'owner',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'claim_invalid',
          issues: [{
            field: 'claimCode',
            message: 'That setup code is wrong or expired. Restart the container to print a new one.',
            path: ['claimCode'],
          }],
          message: 'That setup code is wrong or expired. Restart the container to print a new one.',
        },
      },
      status: 401,
    }));

    const claimCode: Tests_Routes_Auth_Code = ` ${setupClaim['code'].replaceAll('-', ' ').toLowerCase()} `;

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode,
      password: OWNER_PASSWORD,
      username: 'Owner',
    })).toEqual(expect.objectContaining({
      body: {
        csrfToken: client['cookies'].get('dsb_csrf'),
        expiresAt: expect.any(String),
        status: 'authenticated',
        user: {
          id: expect.any(String),
          role: 'owner',
          username: 'Owner',
        },
      },
      status: 201,
    }));

    expect(client['cookies'].has('dsb_session')).toBe(true);

    expect(await client.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        allServers: true,
        authenticationType: 'session',
        id: expect.any(String),
        permissions: [
          'bot:control',
          'configuration:write',
          'users:manage',
        ],
        removedSecrets: [],
        role: 'owner',
        serverIds: [],
        username: 'Owner',
      },
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/setup/status')).toEqual(expect.objectContaining({
      body: {
        claimRequired: false,
      },
      status: 200,
    }));

    expect(await createClient(harness['baseUrl']).request('POST', '/api/v1/setup/claim', {
      claimCode: setupClaim['code'],
      password: OWNER_PASSWORD,
      username: 'intruder',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'claim_unavailable',
          message: 'Setup is already complete. Sign in instead.',
        },
      },
      status: 409,
    }));

    expect((await harness['pool'].query<Tests_Routes_Auth_Count>('SELECT COUNT(*)::text AS count FROM panel_setup_claims')).rows).toEqual([{
      count: '0',
    }]);

    return;
  });

  it('refuses expired setup codes and limits wrong ones per address', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const client: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.30',
    });
    const expiredClaim: Tests_Routes_Auth_SetupClaim = await preparePanelSetupClaim(harness['pool']);

    if (expiredClaim === undefined) {
      throw new Error('The setup code was not prepared.');
    }

    await harness['pool'].query('UPDATE panel_setup_claims SET expires_at = NOW() - INTERVAL \'1 minute\'');

    expect(await client.request('POST', '/api/v1/setup/claim', {
      claimCode: expiredClaim['code'],
      password: OWNER_PASSWORD,
      username: 'owner',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          code: 'claim_invalid',
        }),
      }),
      status: 401,
    }));

    const setupClaim: Tests_Routes_Auth_SetupClaim = await preparePanelSetupClaim(harness['pool']);

    if (setupClaim === undefined) {
      throw new Error('The setup code was not prepared.');
    }

    const wrongCodes: Tests_Routes_Auth_Responses = await Promise.all(Array.from({ length: 9 }, async () => client.request('POST', '/api/v1/setup/claim', {
      claimCode: 'AAAAA-BBBBB-CCCCC',
      password: OWNER_PASSWORD,
      username: 'owner',
    })));

    expect(wrongCodes.map((wrongCode) => wrongCode['status'])).toEqual(Array.from({ length: 9 }, () => 401));

    const limited: Tests_Routes_Auth_Response = await client.request('POST', '/api/v1/setup/claim', {
      claimCode: setupClaim['code'],
      password: OWNER_PASSWORD,
      username: 'owner',
    });

    expect(limited).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many setup attempts. Try again in 15 minutes.',
        },
      },
      status: 429,
    }));

    expect(Number(limited['headers'].get('Retry-After'))).toBeGreaterThan(0);

    expect((await createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.31',
    }).request('POST', '/api/v1/setup/claim', {
      claimCode: setupClaim['code'],
      password: OWNER_PASSWORD,
      username: 'owner',
    }))['status']).toBe(201);

    expect((await signIn(client, 'owner', OWNER_PASSWORD))['status']).toBe(200);

    return;
  });

  it('signs in with a password, then asks for a second step once the authenticator app is on', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const client: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.10',
    });
    const output: Tests_Routes_Auth_OutputSpy = vi.spyOn(process.stdout, 'write');

    await claimOwner(harness['pool'], client);

    await client.request('POST', '/api/v1/auth/logout');

    expect(await signIn(client, 'owner', 'not the owner password')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'credentials_invalid',
          message: 'The username or password is incorrect.',
        },
      },
      status: 401,
    }));

    expect((await signIn(client, 'nobody', OWNER_PASSWORD))['body']).toEqual({
      error: {
        code: 'credentials_invalid',
        message: 'The username or password is incorrect.',
      },
    });

    expect((await signIn(client, 'owner', 'x'.repeat(1025)))['status']).toBe(401);

    expect(await client.request('POST', '/api/v1/auth/login', {})).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'password',
              message: 'Enter your password.',
              path: ['password'],
            },
            {
              field: 'username',
              message: 'Enter your username.',
              path: ['username'],
            },
          ],
          message: 'Enter your password.',
        },
      },
      status: 422,
    }));

    expect(await signIn(client, 'OWNER', OWNER_PASSWORD)).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'authenticated',
        user: expect.objectContaining({
          role: 'owner',
          username: 'owner',
        }),
      }),
      status: 200,
    }));

    const authenticator: Tests_Routes_Auth_Authenticator = await enableAuthenticator(client, OWNER_PASSWORD);

    expect(authenticator['recoveryCodes']).toHaveLength(10);

    await client.request('POST', '/api/v1/auth/logout');

    const passwordStep: Tests_Routes_Auth_Response = await signIn(client, 'owner', OWNER_PASSWORD);
    const challenge: Tests_Routes_Auth_Challenge = String(Reflect.get(Object(passwordStep['body']), 'challenge'));

    expect(passwordStep).toEqual(expect.objectContaining({
      body: {
        challenge: expect.any(String),
        expiresAt: expect.any(String),
        status: 'second_factor_required',
      },
      status: 200,
    }));

    expect(client['cookies'].has('dsb_session')).toBe(false);

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge,
      code: ' ',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'code',
            message: 'Enter the code from your authenticator app, or a recovery code.',
            path: ['code'],
          }],
          message: 'Enter the code from your authenticator app, or a recovery code.',
        },
      },
      status: 422,
    }));

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge,
      code: createTotpCode(authenticator['secret'], authenticator['step'] - 1),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'code_invalid',
          issues: [{
            field: 'code',
            message: 'That code doesn\'t match. Try the current code, or a recovery code.',
            path: ['code'],
          }],
          message: 'That code doesn\'t match. Try the current code, or a recovery code.',
        },
      },
      status: 401,
    }));

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge,
      code: createTotpCode(authenticator['secret'], authenticator['step']),
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'authenticated',
      }),
      status: 200,
    }));

    expect(await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge,
      code: createTotpCode(authenticator['secret'], authenticator['step'] + 1),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'challenge_expired',
          message: 'Your sign-in timed out. Enter your password again.',
        },
      },
      status: 401,
    }));

    await client.request('POST', '/api/v1/auth/logout');

    const replayStep: Tests_Routes_Auth_Response = await signIn(client, 'owner', OWNER_PASSWORD);

    expect((await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(replayStep['body']), 'challenge'),
      code: createTotpCode(authenticator['secret'], authenticator['step']),
    }))['status']).toBe(401);

    const recoveryCode: Tests_Routes_Auth_RecoveryCode = authenticator['recoveryCodes'][0] ?? '';

    expect((await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(replayStep['body']), 'challenge'),
      code: recoveryCode.replace('-', '').toLowerCase(),
    }))['status']).toBe(200);

    expect(await client.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        recoveryCodesRemaining: 9,
        totpEnabled: true,
      }),
      status: 200,
    }));

    await client.request('POST', '/api/v1/auth/logout');

    const reuseStep: Tests_Routes_Auth_Response = await signIn(client, 'owner', OWNER_PASSWORD);

    expect((await client.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(reuseStep['body']), 'challenge'),
      code: recoveryCode,
    }))['status']).toBe(401);

    const written: Tests_Routes_Auth_Output = output.mock.calls.map((call) => String(call[0])).join('');

    expect(written).toContain('"event":"sign_in_succeeded"');

    expect(written).toContain('"event":"sign_in_failed"');

    expect(written).toContain('"event":"setup_completed"');

    expect(written).not.toContain(OWNER_PASSWORD);

    expect(written).not.toContain(authenticator['secret']);

    expect(written).not.toContain(recoveryCode);

    expect(written).not.toContain(challenge);

    return;
  });

  it('ends the second step after five wrong codes and limits failures per address', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const owner: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.20',
    });

    await claimOwner(harness['pool'], owner);

    const authenticator: Tests_Routes_Auth_Authenticator = await enableAuthenticator(owner, OWNER_PASSWORD);
    const guesser: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.21',
    });
    const guessedStep: Tests_Routes_Auth_Response = await signIn(guesser, 'owner', OWNER_PASSWORD);
    const guesses: Tests_Routes_Auth_Responses = await requestInOrder([
      '111111',
      '222222',
      'NOT-A-CODE',
      '444444',
      '555555',
    ].map((guess) => async () => guesser.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(guessedStep['body']), 'challenge'),
      code: guess,
    })));

    expect(guesses.map((guess) => Reflect.get(Object(Reflect.get(Object(guess['body']), 'error')), 'code'))).toEqual([
      'code_invalid',
      'code_invalid',
      'code_invalid',
      'code_invalid',
      'challenge_expired',
    ]);

    expect(Reflect.get(Object(guesses[4]), 'body')).toEqual({
      error: {
        code: 'challenge_expired',
        message: 'Too many wrong codes. Enter your password again.',
      },
    });

    expect(await guesser.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(guessedStep['body']), 'challenge'),
      code: createTotpCode(authenticator['secret'], authenticator['step']),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'challenge_expired',
          message: 'Your sign-in timed out. Enter your password again.',
        },
      },
      status: 401,
    }));

    const expiringStep: Tests_Routes_Auth_Response = await signIn(guesser, 'owner', OWNER_PASSWORD);

    await harness['pool'].query('UPDATE panel_sign_in_challenges SET expires_at = NOW() - INTERVAL \'1 second\'');

    expect((await guesser.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(expiringStep['body']), 'challenge'),
      code: createTotpCode(authenticator['secret'], authenticator['step']),
    }))['body']).toEqual({
      error: {
        code: 'challenge_expired',
        message: 'Your sign-in timed out. Enter your password again.',
      },
    });

    const attacker: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.66',
    });
    const failedAttempts: Tests_Routes_Auth_Responses = await Promise.all(Array.from({ length: 10 }, async () => signIn(attacker, 'owner', 'wrong password guess')));

    expect(failedAttempts.map((failedAttempt) => failedAttempt['status'])).toEqual(Array.from({ length: 10 }, () => 401));

    const limited: Tests_Routes_Auth_Response = await signIn(attacker, 'owner', OWNER_PASSWORD);

    expect(limited).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many sign-in attempts. Try again in 15 minutes.',
        },
      },
      status: 429,
    }));

    expect(Number(limited['headers'].get('Retry-After'))).toBeGreaterThan(0);

    expect((await attacker.request('POST', '/api/v1/auth/passkeys/login/verify', {}))['status']).toBe(429);

    expect((await signIn(createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.67',
    }), 'owner', OWNER_PASSWORD))['status']).toBe(200);

    // IPv6 visitors share one limit per /56 network, whichever address in it they use.
    const baseUrl: Tests_Routes_Auth_BaseUrl = harness['baseUrl'];
    const ipv6Failures: Tests_Routes_Auth_Responses = await Promise.all(Array.from({ length: 10 }, async (_value, index) => signIn(createClient(baseUrl, {
      'X-Forwarded-For': `2001:db8:1234:56${index.toString(16).padStart(2, '0')}::1`,
    }), 'owner', 'wrong password guess')));

    expect(ipv6Failures.map((failedAttempt) => failedAttempt['status'])).toEqual(Array.from({ length: 10 }, () => 401));

    expect((await signIn(createClient(baseUrl, {
      'X-Forwarded-For': '2001:db8:1234:56ff::1',
    }), 'owner', OWNER_PASSWORD))['status']).toBe(429);

    expect((await signIn(createClient(baseUrl, {
      'X-Forwarded-For': '2001:db8:1234:5700::1',
    }), 'owner', OWNER_PASSWORD))['status']).toBe(200);

    return;
  });

  it('describes the caller, accepts tokens on identity routes, and signs out', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const baseUrl: Tests_Routes_Auth_BaseUrl = harness['baseUrl'];
    const owner: Tests_Routes_Auth_Client = createClient(baseUrl);

    await claimOwner(harness['pool'], owner);

    const created: Tests_Routes_Auth_Response = await owner.request('POST', '/api/v1/auth/tokens', {
      name: 'Status script',
      scopes: ['logs:read'],
    });
    const plaintext: Tests_Routes_Auth_Token = String(Reflect.get(Object(created['body']), 'plaintext'));
    const tokenClient: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      Authorization: `Bearer ${plaintext}`,
    });

    expect(await tokenClient.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        authenticationType: 'token',
        id: Reflect.get(Object(Reflect.get(Object(created['body']), 'token')), 'id'),
        name: 'Status script',
        scopes: ['logs:read'],
        username: 'owner',
      },
      status: 200,
    }));

    expect(await tokenClient.request('POST', '/api/v1/auth/logout')).toEqual(expect.objectContaining({
      status: 204,
    }));

    const refusedTokens: Tests_Routes_Auth_Responses = await Promise.all([
      `Bearer dsb_${'A'.repeat(43)}`,
      'Bearer nonsense',
      'Basic b3duZXI6cGFzc3dvcmQ=',
    ].map(async (authorization) => createClient(baseUrl, {
      Authorization: authorization,
    }).request('GET', '/api/v1/auth/me')));

    for (const refusedToken of refusedTokens) {
      expect(refusedToken).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'authentication_required',
            message: 'A valid personal access token is required.',
          },
        },
        status: 401,
      }));
    }

    expect(await createClient(harness['baseUrl']).request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'authentication_required',
          message: 'Sign in to continue.',
        },
      },
      status: 401,
    }));

    expect(await owner.request('POST', '/api/v1/auth/logout', undefined, {
      'X-CSRF-Token': 'not-the-csrf-token',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'csrf_invalid',
          message: 'The request CSRF token is missing or invalid.',
        },
      },
      status: 403,
    }));

    expect(await owner.request('POST', '/api/v1/auth/logout')).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(owner['cookies'].size).toBe(0);

    expect((await harness['pool'].query<Tests_Routes_Auth_Count>('SELECT COUNT(*)::text AS count FROM panel_sessions')).rows).toEqual([{
      count: '0',
    }]);

    expect((await owner.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect((await tokenClient.request('GET', '/api/v1/auth/me'))['status']).toBe(200);

    return;
  });

  it('lists what a lost key removed until it is dismissed', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const owner: Tests_Routes_Auth_Client = createClient(harness['baseUrl']);
    const viewer: Tests_Routes_Auth_Client = createClient(harness['baseUrl']);
    const keyDirectory: Tests_Routes_Auth_KeyDirectory = await mkdtemp(join(tmpdir(), 'dsb-auth-key-'));

    await claimOwner(harness['pool'], owner);

    await enableAuthenticator(owner, OWNER_PASSWORD);

    await signInTestUser(harness['pool'], viewer, {
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer1',
    });

    const removedSecrets: Tests_Routes_Auth_RemovedSecrets = await prepareCredentialKey(harness['pool'], join(keyDirectory, 'credential.key'));

    await rm(keyDirectory, {
      force: true,
      recursive: true,
    });

    expect(removedSecrets).toEqual(['the authenticator app for owner']);

    expect(await owner.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [{
          kind: 'authenticator',
          removedAt: expect.any(String),
        }],
      }),
      status: 200,
    }));

    expect(await viewer.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [],
      }),
      status: 200,
    }));

    expect(await owner.request('DELETE', '/api/v1/auth/removed-secrets', undefined, {
      'X-CSRF-Token': 'wrong-token',
    })).toEqual(expect.objectContaining({
      status: 403,
    }));

    expect(await owner.request('DELETE', '/api/v1/auth/removed-secrets')).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(await owner.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        removedSecrets: [],
      }),
      status: 200,
    }));

    return;
  });

  it('signs in with a passkey only at the address it was added on', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const client: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-Host': 'stonker.example.net',
      'X-Forwarded-Proto': 'https',
    });
    const passkey: Tests_Routes_Auth_Passkey = createAuthenticator();

    await claimOwner(harness['pool'], client);

    expect(await createClient(harness['baseUrl']).request('POST', '/api/v1/auth/passkeys/login/options')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkeys_unavailable',
          message: 'Passkeys need https and a domain name. Open this page at its domain, or use your password.',
        },
      },
      status: 409,
    }));

    expect(await createClient(harness['baseUrl'], {
      'X-Forwarded-Host': 'localhost:8080',
    }).request('POST', '/api/v1/auth/passkeys/login/options')).toEqual(expect.objectContaining({
      body: {
        ceremonyId: expect.any(String),
        options: expect.objectContaining({
          rpId: 'localhost',
          userVerification: 'required',
        }),
      },
      status: 200,
    }));

    const registration: Tests_Routes_Auth_Response = await client.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'MacBook',
      password: OWNER_PASSWORD,
    });
    const creationOptions: Tests_Routes_Auth_Options = Reflect.get(Object(registration['body']), 'options');

    expect(creationOptions).toEqual(expect.objectContaining({
      authenticatorSelection: expect.objectContaining({
        residentKey: 'required',
        userVerification: 'required',
      }),
      rp: {
        id: 'stonker.example.net',
        name: 'Stonker Bot for Discord',
      },
    }));

    expect(await client.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(registration['body']), 'ceremonyId'),
      credential: createRegistration(passkey, creationOptions, 'https://stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        createdAt: expect.any(String),
        hostname: 'stonker.example.net',
        id: passkey['credentialId'].toString('base64url'),
        lastUsedAt: null,
        name: 'MacBook',
      },
      status: 201,
    }));

    await client.request('POST', '/api/v1/auth/logout');

    const signInOptions: Tests_Routes_Auth_Response = await client.request('POST', '/api/v1/auth/passkeys/login/options');
    const requestOptions: Tests_Routes_Auth_Options = Reflect.get(Object(signInOptions['body']), 'options');

    expect(requestOptions).toEqual(expect.objectContaining({
      rpId: 'stonker.example.net',
    }));

    expect(requestOptions['allowCredentials']).toBeUndefined();

    expect(await client.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: Reflect.get(Object(signInOptions['body']), 'ceremonyId'),
      credential: createAssertion(passkey, requestOptions, 'https://stonker.example.net', 'stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        status: 'authenticated',
        user: expect.objectContaining({
          role: 'owner',
          username: 'owner',
        }),
      }),
      status: 200,
    }));

    expect(await client.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: Reflect.get(Object(signInOptions['body']), 'ceremonyId'),
      credential: createAssertion(passkey, requestOptions, 'https://stonker.example.net', 'stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_ceremony_invalid',
          message: 'That passkey request expired. Try again.',
        },
      },
      status: 409,
    }));

    expect(await client.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        passkeys: [expect.objectContaining({
          lastUsedAt: expect.any(String),
        })],
      }),
      status: 200,
    }));

    const otherHost: Tests_Routes_Auth_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-Host': 'other.example.net',
      'X-Forwarded-Proto': 'https',
    });
    const otherOptions: Tests_Routes_Auth_Response = await otherHost.request('POST', '/api/v1/auth/passkeys/login/options');

    expect(await otherHost.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: Reflect.get(Object(otherOptions['body']), 'ceremonyId'),
      credential: createAssertion(passkey, Reflect.get(Object(otherOptions['body']), 'options'), 'https://other.example.net', 'stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_rejected',
          message: 'That passkey wasn\'t accepted. It may belong to a different address for this app.',
        },
      },
      status: 401,
    }));

    const movedOptions: Tests_Routes_Auth_Response = await client.request('POST', '/api/v1/auth/passkeys/login/options');

    expect((await otherHost.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: Reflect.get(Object(movedOptions['body']), 'ceremonyId'),
      credential: createAssertion(passkey, Reflect.get(Object(movedOptions['body']), 'options'), 'https://stonker.example.net', 'stonker.example.net'),
    }))['body']).toEqual({
      error: {
        code: 'passkey_rejected',
        message: 'That passkey wasn\'t accepted. It may belong to a different address for this app.',
      },
    });

    expect((await client.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: 'A'.repeat(43),
      credential: createAssertion(passkey, requestOptions, 'https://stonker.example.net', 'stonker.example.net'),
    }))['body']).toEqual({
      error: {
        code: 'passkey_ceremony_invalid',
        message: 'That passkey request expired. Try again.',
      },
    });

    expect((await client.request('POST', '/api/v1/auth/passkeys/login/verify', {
      ceremonyId: 'A'.repeat(43),
    }))['body']).toEqual({
      error: {
        code: 'passkey_rejected',
        message: 'That passkey wasn\'t accepted.',
      },
    });

    return;
  });

  return;
});
