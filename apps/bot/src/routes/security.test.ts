import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  addUser,
  claimOwner,
  createTotpCode,
  getTotpStep,
  OWNER_PASSWORD,
  signIn,
} from '../tests/support/accounts.js';
import {
  createClient,
  startHarness,
} from '../tests/support/harness.js';
import {
  createAuthenticator,
  createRegistration,
} from '../tests/support/passkeys.js';

import type {
  Tests_Routes_Security_Client,
  Tests_Routes_Security_Harness,
  Tests_Routes_Security_Options,
  Tests_Routes_Security_Passkey,
  Tests_Routes_Security_PasskeyId,
  Tests_Routes_Security_Password,
  Tests_Routes_Security_RecoveryCodes,
  Tests_Routes_Security_Response,
  Tests_Routes_Security_Responses,
  Tests_Routes_Security_Secret,
  Tests_Routes_Security_Step,
  Tests_Routes_Security_Token,
} from '../types/tests/routes/security.test.d.ts';

/**
 * Security - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database and a fresh attempt counter.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Security_Harness = undefined;

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
 * Security - Security Routes.
 *
 * Covers the summary, password and username changes, the authenticator app, and passkeys.
 * Every change checks the current password first, counted like a sign-in.
 *
 * @since 4.0.0
 */
describe('security routes', () => {
  it('summarizes the account and changes the password and username after checking the password', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const owner: Tests_Routes_Security_Client = createClient(harness['baseUrl']);
    const otherBrowser: Tests_Routes_Security_Client = createClient(harness['baseUrl']);
    const newPassword: Tests_Routes_Security_Password = 'a brand new owner password';

    await claimOwner(harness['pool'], owner);

    await signIn(otherBrowser, 'owner', OWNER_PASSWORD);

    expect(await owner.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: {
        hostname: '127.0.0.1',
        passkeys: [],
        passkeysAvailable: false,
        recoveryCodesRemaining: 0,
        role: 'owner',
        totpEnabled: false,
        username: 'owner',
      },
      status: 200,
    }));

    const created: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/tokens', {
      name: 'Script',
      scopes: ['features:read'],
    });
    const plaintext: Tests_Routes_Security_Token = String(Reflect.get(Object(created['body']), 'plaintext'));

    expect(await createClient(harness['baseUrl'], {
      Authorization: `Bearer ${plaintext}`,
    }).request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'session_required',
          message: 'A signed-in browser session is required.',
        },
      },
      status: 403,
    }));

    expect(await owner.request('POST', '/api/v1/auth/password', {
      currentPassword: '',
      newPassword: 'short',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'currentPassword',
              message: 'Enter your current password.',
              path: ['currentPassword'],
            },
            {
              field: 'newPassword',
              message: 'Use at least 12 characters.',
              path: ['newPassword'],
            },
          ],
          message: 'Enter your current password.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/password', {
      currentPassword: 'not the current password',
      newPassword,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'password_incorrect',
          issues: [{
            field: 'currentPassword',
            message: 'That password is incorrect.',
            path: ['currentPassword'],
          }],
          message: 'That password is incorrect.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/password', {
      currentPassword: OWNER_PASSWORD,
      newPassword,
    })).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect((await owner.request('GET', '/api/v1/auth/me'))['status']).toBe(200);

    expect((await otherBrowser.request('GET', '/api/v1/auth/me'))['status']).toBe(401);

    expect((await signIn(createClient(harness['baseUrl']), 'owner', OWNER_PASSWORD))['status']).toBe(401);

    expect((await signIn(createClient(harness['baseUrl']), 'owner', newPassword))['status']).toBe(200);

    await addUser(owner, {
      allServers: true,
      password: 'operator password for tests',
      role: 'operator',
      serverIds: [],
      username: 'operator1',
    });

    expect(await owner.request('POST', '/api/v1/auth/username', {
      password: newPassword,
      username: '-chief',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'username',
            message: 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.',
            path: ['username'],
          }],
          message: 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/username', {
      password: newPassword,
      username: ' ',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({
          message: 'Enter a username.',
        }),
      }),
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/username', {
      password: 'not the current password',
      username: 'chief',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'password_incorrect',
          issues: [{
            field: 'password',
            message: 'That password is incorrect.',
            path: ['password'],
          }],
          message: 'That password is incorrect.',
        },
      },
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/auth/username', {
      password: newPassword,
      username: 'OPERATOR1',
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

    expect(await owner.request('POST', '/api/v1/auth/username', {
      password: newPassword,
      username: 'Chief',
    })).toEqual(expect.objectContaining({
      body: {
        user: {
          id: expect.any(String),
          role: 'owner',
          username: 'Chief',
        },
      },
      status: 200,
    }));

    expect(await owner.request('GET', '/api/v1/auth/me')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        username: 'Chief',
      }),
      status: 200,
    }));

    expect((await signIn(createClient(harness['baseUrl']), 'chief', newPassword))['status']).toBe(200);

    return;
  });

  it('turns the authenticator app on and off and replaces recovery codes', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const owner: Tests_Routes_Security_Client = createClient(harness['baseUrl']);

    await claimOwner(harness['pool'], owner);

    expect(await owner.request('POST', '/api/v1/auth/totp/enable', {
      code: '123456',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_setup_expired',
          message: 'Authenticator setup expired. Start again.',
        },
      },
      status: 409,
    }));

    expect(await owner.request('POST', '/api/v1/auth/totp/setup', {})).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'password',
            message: 'Enter your password.',
            path: ['password'],
          }],
          message: 'Enter your password.',
        },
      },
      status: 422,
    }));

    expect((await owner.request('POST', '/api/v1/auth/totp/setup', {
      password: 'not the current password',
    }))['body']).toEqual(expect.objectContaining({
      error: expect.objectContaining({
        code: 'password_incorrect',
      }),
    }));

    const setup: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/totp/setup', {
      password: OWNER_PASSWORD,
    });
    const secret: Tests_Routes_Security_Secret = String(Reflect.get(Object(setup['body']), 'secret'));

    expect(setup).toEqual(expect.objectContaining({
      body: {
        expiresAt: expect.any(String),
        qrCode: expect.stringContaining('data:image/png;base64,'),
        secret,
        uri: expect.stringContaining('otpauth://totp/Stonker%20Bot%20for%20Discord:owner?issuer=Stonker%20Bot%20for%20Discord&secret='),
      },
      status: 200,
    }));

    expect(secret).toHaveLength(32);

    const malformedCodes: Tests_Routes_Security_Responses = await Promise.all([
      '12345',
      '12345a',
    ].map(async (code) => owner.request('POST', '/api/v1/auth/totp/enable', {
      code,
    })));

    for (const malformedCode of malformedCodes) {
      expect(malformedCode).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'invalid_request',
            issues: [{
              field: 'code',
              message: 'Enter the 6-digit code from your app.',
              path: ['code'],
            }],
            message: 'Enter the 6-digit code from your app.',
          },
        },
        status: 422,
      }));
    }

    const step: Tests_Routes_Security_Step = await getTotpStep();

    expect(await owner.request('POST', '/api/v1/auth/totp/enable', {
      code: createTotpCode(secret, step + 10),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'code_invalid',
          issues: [{
            field: 'code',
            message: 'That code doesn\'t match. Check the time on your device and try again.',
            path: ['code'],
          }],
          message: 'That code doesn\'t match. Check the time on your device and try again.',
        },
      },
      status: 422,
    }));

    const enabled: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/totp/enable', {
      code: createTotpCode(secret, step - 1),
    });
    const firstCodes: Tests_Routes_Security_RecoveryCodes = Reflect.get(Object(enabled['body']), 'recoveryCodes');

    expect(enabled['status']).toBe(200);

    expect(firstCodes).toHaveLength(10);

    for (const recoveryCode of firstCodes) {
      expect(recoveryCode).toHaveLength(11);

      expect(recoveryCode.charAt(5)).toBe('-');

      expect([...recoveryCode.replace('-', '')].every((character) => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.includes(character))).toBe(true);
    }

    expect(await owner.request('POST', '/api/v1/auth/totp/setup', {
      password: OWNER_PASSWORD,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_enabled',
          message: 'The authenticator app is already on.',
        },
      },
      status: 409,
    }));

    expect(await owner.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        recoveryCodesRemaining: 10,
        totpEnabled: true,
      }),
      status: 200,
    }));

    const replaced: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/recovery-codes', {
      password: OWNER_PASSWORD,
    });
    const secondCodes: Tests_Routes_Security_RecoveryCodes = Reflect.get(Object(replaced['body']), 'recoveryCodes');

    expect(replaced['status']).toBe(200);

    expect(secondCodes).toHaveLength(10);

    expect(secondCodes.some((recoveryCode) => firstCodes.includes(recoveryCode))).toBe(false);

    const signInClient: Tests_Routes_Security_Client = createClient(harness['baseUrl']);
    const passwordStep: Tests_Routes_Security_Response = await signIn(signInClient, 'owner', OWNER_PASSWORD);

    expect((await signInClient.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(passwordStep['body']), 'challenge'),
      code: firstCodes[0] ?? '',
    }))['status']).toBe(401);

    expect((await signInClient.request('POST', '/api/v1/auth/login/second-factor', {
      challenge: Reflect.get(Object(passwordStep['body']), 'challenge'),
      code: secondCodes[0] ?? '',
    }))['status']).toBe(200);

    expect((await owner.request('POST', '/api/v1/auth/totp/disable', {
      password: 'not the current password',
    }))['status']).toBe(422);

    expect(await owner.request('POST', '/api/v1/auth/totp/disable', {
      password: OWNER_PASSWORD,
    })).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(await owner.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        recoveryCodesRemaining: 0,
        totpEnabled: false,
      }),
      status: 200,
    }));

    expect(await owner.request('POST', '/api/v1/auth/totp/disable', {
      password: OWNER_PASSWORD,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_disabled',
          message: 'The authenticator app is already off.',
        },
      },
      status: 409,
    }));

    expect(await owner.request('POST', '/api/v1/auth/recovery-codes', {
      password: OWNER_PASSWORD,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'totp_disabled',
          message: 'Turn on the authenticator app first.',
        },
      },
      status: 409,
    }));

    expect((await signIn(createClient(harness['baseUrl']), 'owner', OWNER_PASSWORD))['body']).toEqual(expect.objectContaining({
      status: 'authenticated',
    }));

    const expiringSetup: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/totp/setup', {
      password: OWNER_PASSWORD,
    });

    await harness['pool'].query('UPDATE panel_totp_enrollments SET expires_at = NOW() - INTERVAL \'1 second\'');

    expect((await owner.request('POST', '/api/v1/auth/totp/enable', {
      code: createTotpCode(String(Reflect.get(Object(expiringSetup['body']), 'secret')), await getTotpStep()),
    }))['body']).toEqual({
      error: {
        code: 'totp_setup_expired',
        message: 'Authenticator setup expired. Start again.',
      },
    });

    return;
  });

  it('adds and removes passkeys after checking the password', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const owner: Tests_Routes_Security_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-Host': 'stonker.example.net',
      'X-Forwarded-Proto': 'https',
    });
    const byAddress: Tests_Routes_Security_Client = createClient(harness['baseUrl']);
    const passkey: Tests_Routes_Security_Passkey = createAuthenticator();

    await claimOwner(harness['pool'], owner);

    await signIn(byAddress, 'owner', OWNER_PASSWORD);

    expect(await byAddress.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'YubiKey',
      password: OWNER_PASSWORD,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkeys_unavailable',
          message: 'Passkeys need https and a domain name. Open this page at its domain, or use your password.',
        },
      },
      status: 409,
    }));

    expect(await owner.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        hostname: 'stonker.example.net',
        passkeysAvailable: true,
      }),
      status: 200,
    }));

    expect((await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: ' ',
      password: OWNER_PASSWORD,
    }))['body']).toEqual({
      error: {
        code: 'invalid_request',
        issues: [{
          field: 'name',
          message: 'Name this passkey.',
          path: ['name'],
        }],
        message: 'Name this passkey.',
      },
    });

    expect((await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'x'.repeat(81),
      password: OWNER_PASSWORD,
    }))['body']).toEqual(expect.objectContaining({
      error: expect.objectContaining({
        message: 'Use 80 characters or fewer.',
      }),
    }));

    expect((await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'YubiKey',
      password: 'not the current password',
    }))['body']).toEqual(expect.objectContaining({
      error: expect.objectContaining({
        code: 'password_incorrect',
      }),
    }));

    const registration: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: '  YubiKey  ',
      password: OWNER_PASSWORD,
    });
    const creationOptions: Tests_Routes_Security_Options = Reflect.get(Object(registration['body']), 'options');

    expect(await owner.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(registration['body']), 'ceremonyId'),
      credential: createRegistration(passkey, {
        ...creationOptions,
        challenge: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      }, 'https://stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_invalid',
          message: 'The passkey couldn\'t be verified. Try again.',
        },
      },
      status: 422,
    }));

    const retried: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: '  YubiKey  ',
      password: OWNER_PASSWORD,
    });

    expect(await owner.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(retried['body']), 'ceremonyId'),
      credential: createRegistration(passkey, Reflect.get(Object(retried['body']), 'options'), 'https://stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        hostname: 'stonker.example.net',
        name: 'YubiKey',
      }),
      status: 201,
    }));

    expect(await owner.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(retried['body']), 'ceremonyId'),
      credential: createRegistration(passkey, Reflect.get(Object(retried['body']), 'options'), 'https://stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_ceremony_invalid',
          message: 'That passkey request expired. Try again.',
        },
      },
      status: 409,
    }));

    const again: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'Same key',
      password: OWNER_PASSWORD,
    });
    const againOptions: Tests_Routes_Security_Options = Reflect.get(Object(again['body']), 'options');

    expect(againOptions['excludeCredentials']).toEqual([expect.objectContaining({
      id: passkey['credentialId'].toString('base64url'),
    })]);

    expect(await owner.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(again['body']), 'ceremonyId'),
      credential: createRegistration(passkey, againOptions, 'https://stonker.example.net'),
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'passkey_exists',
          message: 'This passkey is already added.',
        },
      },
      status: 409,
    }));

    expect((await owner.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: 'A'.repeat(43),
      credential: {},
    }))['body']).toEqual({
      error: {
        code: 'passkey_invalid',
        message: 'The passkey couldn\'t be verified. Try again.',
      },
    });

    const passkeyId: Tests_Routes_Security_PasskeyId = passkey['credentialId'].toString('base64url');

    expect((await owner.request('DELETE', `/api/v1/auth/passkeys/${passkeyId}`, {
      password: 'not the current password',
    }))['status']).toBe(422);

    const missingPasskeys: Tests_Routes_Security_Responses = await Promise.all([
      'A'.repeat(22),
      'not%20a%20passkey!',
    ].map(async (missingPasskeyId) => owner.request('DELETE', `/api/v1/auth/passkeys/${missingPasskeyId}`, {
      password: OWNER_PASSWORD,
    })));

    for (const missingPasskey of missingPasskeys) {
      expect(missingPasskey).toEqual(expect.objectContaining({
        body: {
          error: {
            code: 'passkey_not_found',
            message: 'That passkey no longer exists.',
          },
        },
        status: 404,
      }));
    }

    expect(await owner.request('DELETE', `/api/v1/auth/passkeys/${passkeyId}`, {
      password: OWNER_PASSWORD,
    })).toEqual(expect.objectContaining({
      status: 204,
    }));

    expect(await owner.request('GET', '/api/v1/auth/security')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        passkeys: [],
      }),
      status: 200,
    }));

    expect((await owner.request('DELETE', `/api/v1/auth/passkeys/${passkeyId}`, {
      password: OWNER_PASSWORD,
    }))['status']).toBe(404);

    return;
  });

  it('counts wrong password confirmations with sign-in failures', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const owner: Tests_Routes_Security_Client = createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.40',
    });

    await claimOwner(harness['pool'], owner);

    const wrongPasswords: Tests_Routes_Security_Responses = await Promise.all(Array.from({ length: 10 }, async () => owner.request('POST', '/api/v1/auth/recovery-codes', {
      password: 'not the current password',
    })));

    expect(wrongPasswords.map((wrongPassword) => wrongPassword['status'])).toEqual(Array.from({ length: 10 }, () => 422));

    const limited: Tests_Routes_Security_Response = await owner.request('POST', '/api/v1/auth/totp/setup', {
      password: OWNER_PASSWORD,
    });

    expect(limited).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'rate_limited',
          message: 'Too many attempts. Try again in 15 minutes.',
        },
      },
      status: 429,
    }));

    expect(Number(limited['headers'].get('Retry-After'))).toBeGreaterThan(0);

    expect((await signIn(owner, 'owner', OWNER_PASSWORD))['body']).toEqual({
      error: {
        code: 'rate_limited',
        message: 'Too many sign-in attempts. Try again in 15 minutes.',
      },
    });

    expect((await createClient(harness['baseUrl'], {
      'X-Forwarded-For': '198.51.100.41',
    }).request('POST', '/api/v1/auth/login', {
      password: OWNER_PASSWORD,
      username: 'owner',
    }))['status']).toBe(200);

    return;
  });

  return;
});
