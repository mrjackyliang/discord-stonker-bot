import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { parseBackupDocument } from '../lib/backup.js';
import { hashPanelPassword } from '../lib/panel-auth.js';
import {
  claimOwner,
  createTotpCode,
  enableAuthenticator,
  getTotpStep,
  OWNER_PASSWORD,
} from '../tests/support/accounts.js';
import {
  createClient,
  seedServer,
  startHarness,
} from '../tests/support/harness.js';
import {
  createAssertion,
  createAuthenticator,
  createRegistration,
} from '../tests/support/passkeys.js';
import {
  createTestToken,
  signInTestUser,
} from '../tests/support/sessions.js';

import type {
  Tests_Routes_Backup_Authenticator,
  Tests_Routes_Backup_BaseUrl,
  Tests_Routes_Backup_Client,
  Tests_Routes_Backup_Confirm_Client,
  Tests_Routes_Backup_Confirm_Code,
  Tests_Routes_Backup_Confirm_Password,
  Tests_Routes_Backup_Confirm_Purpose,
  Tests_Routes_Backup_Confirm_Returns,
  Tests_Routes_Backup_ContentDisposition,
  Tests_Routes_Backup_DeepConfiguration,
  Tests_Routes_Backup_DeepKey,
  Tests_Routes_Backup_Document,
  Tests_Routes_Backup_GetHarness_Returns,
  Tests_Routes_Backup_Grant,
  Tests_Routes_Backup_GrantFrom_Response,
  Tests_Routes_Backup_GrantFrom_Returns,
  Tests_Routes_Backup_Harness,
  Tests_Routes_Backup_LegacyConfiguration,
  Tests_Routes_Backup_LegacySource,
  Tests_Routes_Backup_Options,
  Tests_Routes_Backup_Passkey,
  Tests_Routes_Backup_Password,
  Tests_Routes_Backup_PlaintextToken,
  Tests_Routes_Backup_Preview,
  Tests_Routes_Backup_Response,
  Tests_Routes_Backup_RuntimeResult,
  Tests_Routes_Backup_SerializedDocument,
  Tests_Routes_Backup_ServerCountResult,
  Tests_Routes_Backup_ServerCountRowResult,
  Tests_Routes_Backup_TokenHash,
  Tests_Routes_Backup_TokenHashResult,
  Tests_Routes_Backup_TokenHashRowResult,
  Tests_Routes_Backup_UnknownValue,
  Tests_Routes_Backup_UserId,
} from '../types/tests/routes/backup.test.d.ts';

/**
 * Backup - Server ID.
 *
 * Identifies the invented Northwind Outfitters Discord server.
 * Legacy and export sources use the same stable test identity.
 *
 * @since UNRELEASED
 */
const SERVER_ID = '1197999049190674442';

/**
 * Backup - Bot Token.
 *
 * Represents the connection credential expected in a complete export.
 * The isolated fixture never reaches Discord.
 *
 * @since UNRELEASED
 */
const BOT_TOKEN = 'northwind-fixture-bot-token';

/**
 * Backup - Feature Secret.
 *
 * Represents the signature key for an invented receiving route.
 * The export must open it only after fresh confirmation.
 *
 * @since UNRELEASED
 */
const FEATURE_SECRET = 'northwind-signing-secret-with-at-least-32-characters';

/**
 * Backup - Notification Secret.
 *
 * Represents the Telegram token for an invented notification target.
 * It verifies that notification credentials remain portable.
 *
 * @since UNRELEASED
 */
const NOTIFICATION_SECRET = '123456:northwind-notification-secret';

/**
 * Backup - Admin Password.
 *
 * Gives one isolated administrator a real credential for fresh confirmation.
 * It is never expected in an exported document.
 *
 * @since UNRELEASED
 */
const ADMIN_PASSWORD: Tests_Routes_Backup_Password = 'northwind administrator password';

/**
 * Backup - Legacy Configuration.
 *
 * Exercises the former config.json mapping through the shared wizard source.
 * One unsupported section also verifies the not-brought-over report.
 *
 * @since UNRELEASED
 */
const legacyConfiguration: Tests_Routes_Backup_LegacyConfiguration = {
  'anti-raid': {},
  'message-copiers': [{
    destinations: [
      {
        channel: {
          'channel-id': '1197999049811439729',
        },
        method: 'discord-channel',
      },
      {
        method: 'twitter-account',
      },
    ],
    name: 'Northwind notices',
    regex: {
      flags: 'i',
      pattern: '^northwind$',
    },
  }],
  'retired-northwind-widget': {
    enabled: true,
  },
  'settings': {
    discord: {
      guild: {
        'guild-id': SERVER_ID,
      },
      token: BOT_TOKEN,
    },
    twitter: {
      'api-key': 'retired-twitter-key',
    },
  },
  'twitter-feeds': [],
  'web-applications': {
    'map-webhooks': [{
      'channel': {
        'channel-id': '1209383231867326487',
      },
      'name': 'Northwind order alerts',
      'path': '/webhooks/northwind-orders',
      'payload': {
        content: 'A Northwind order changed.',
      },
      'signing-secret': FEATURE_SECRET,
      'variables': [],
    }],
  },
};

/**
 * Backup - Harness.
 *
 * Holds one running app with a fresh database per test.
 * Route assertions use the same production middleware stack.
 *
 * @since UNRELEASED
 */
let harness: Tests_Routes_Backup_Harness = undefined;

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
 * Backup - Get Harness.
 *
 * Narrows the per-test harness after setup.
 * A missing server is an immediate fixture failure.
 *
 * @returns {Tests_Routes_Backup_GetHarness_Returns}
 *
 * @since UNRELEASED
 */
function getHarness(): Tests_Routes_Backup_GetHarness_Returns {
  if (harness === undefined) {
    throw new Error('The test server is not running.');
  }

  return harness;
}

/**
 * Backup - Confirm.
 *
 * Requests a fresh, purpose-bound credential through the password flow.
 * Authenticator codes are included only when the account requires one.
 *
 * @param {Tests_Routes_Backup_Confirm_Client}   client   - Client.
 * @param {Tests_Routes_Backup_Confirm_Purpose}  purpose  - Purpose.
 * @param {Tests_Routes_Backup_Confirm_Password} password - Password.
 * @param {Tests_Routes_Backup_Confirm_Code}     [code]   - Code.
 *
 * @returns {Tests_Routes_Backup_Confirm_Returns}
 *
 * @since UNRELEASED
 */
async function confirm(
  client: Tests_Routes_Backup_Confirm_Client,
  purpose: Tests_Routes_Backup_Confirm_Purpose,
  password: Tests_Routes_Backup_Confirm_Password,
  code?: Tests_Routes_Backup_Confirm_Code,
): Tests_Routes_Backup_Confirm_Returns {
  return client.request('POST', '/api/v1/backup/confirmation', {
    ...((code === undefined) ? {} : { code }),
    password,
    purpose,
  });
}

/**
 * Backup - Grant From.
 *
 * Validates the shape needed by a following export or import request.
 * A malformed confirmation response fails the fixture clearly.
 *
 * @param {Tests_Routes_Backup_GrantFrom_Response} response - Response.
 *
 * @returns {Tests_Routes_Backup_GrantFrom_Returns}
 *
 * @since UNRELEASED
 */
function grantFrom(response: Tests_Routes_Backup_GrantFrom_Response): Tests_Routes_Backup_GrantFrom_Returns {
  const body: Tests_Routes_Backup_LegacyConfiguration = Object(response['body']);
  const grant: Tests_Routes_Backup_UnknownValue = body['grant'];
  const expiresAt: Tests_Routes_Backup_UnknownValue = body['expiresAt'];

  if (
    response['status'] !== 200
    || typeof grant !== 'string'
    || typeof expiresAt !== 'string'
  ) {
    throw new Error(`Fresh confirmation failed: ${JSON.stringify(response['body'])}`);
  }

  return {
    expiresAt,
    grant,
  };
}

describe('backup routes', () => {
  it('requires a privileged browser session and a correct password', async () => {
    const currentHarness: Tests_Routes_Backup_GetHarness_Returns = getHarness();
    const baseUrl: Tests_Routes_Backup_BaseUrl = currentHarness['baseUrl'];
    const owner: Tests_Routes_Backup_Client = createClient(baseUrl);
    const operator: Tests_Routes_Backup_Client = createClient(baseUrl);

    await claimOwner(currentHarness['pool'], owner);

    expect((await confirm(owner, 'export', OWNER_PASSWORD))['status']).toBe(200);

    expect(await confirm(owner, 'export', 'incorrect owner password')).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({ code: 'identity_not_confirmed' }),
      }),
      status: 422,
    }));

    const operatorId: Tests_Routes_Backup_UserId = await signInTestUser(currentHarness['pool'], operator, {
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'northwind-operator',
    });

    await currentHarness['pool'].query('UPDATE panel_users SET password_hash = $2 WHERE id = $1', [
      operatorId,
      await hashPanelPassword(ADMIN_PASSWORD),
    ]);

    expect(await confirm(operator, 'export', ADMIN_PASSWORD)).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({ code: 'permission_required' }),
      }),
      status: 403,
    }));

    const ownerRow: Tests_Routes_Backup_LegacyConfiguration = (await currentHarness['pool'].query('SELECT id::text AS id FROM panel_users WHERE role = \'owner\''))['rows'][0] ?? {};
    const ownerId: Tests_Routes_Backup_UserId = String(ownerRow['id']);
    const rawToken: Tests_Routes_Backup_PlaintextToken = await createTestToken(currentHarness['pool'], ownerId, [
      'bot:control',
      'features:read',
      'features:write',
      'logs:read',
    ]);
    const apiClient: Tests_Routes_Backup_Client = createClient(baseUrl, {
      Authorization: `Bearer ${rawToken}`,
    });

    expect(await apiClient.request('POST', '/api/v1/backup/confirmation', {
      password: OWNER_PASSWORD,
      purpose: 'export',
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({ code: 'session_required' }),
      }),
      status: 403,
    }));

    return;
  });

  it('requires the authenticator code when TOTP is enabled', async () => {
    const currentHarness: Tests_Routes_Backup_GetHarness_Returns = getHarness();
    const owner: Tests_Routes_Backup_Client = createClient(currentHarness['baseUrl']);

    await claimOwner(currentHarness['pool'], owner);

    const authenticator: Tests_Routes_Backup_Authenticator = await enableAuthenticator(owner, OWNER_PASSWORD);

    expect((await confirm(owner, 'import', OWNER_PASSWORD))['status']).toBe(422);

    expect((await confirm(owner, 'import', OWNER_PASSWORD, '000000'))['status']).toBe(422);

    const code: Tests_Routes_Backup_Confirm_Code = createTotpCode(authenticator['secret'], await getTotpStep());

    expect((await confirm(owner, 'import', OWNER_PASSWORD, code))['status']).toBe(200);

    return;
  });

  it('confirms an export with a passkey', async () => {
    const currentHarness: Tests_Routes_Backup_GetHarness_Returns = getHarness();
    const owner: Tests_Routes_Backup_Client = createClient(currentHarness['baseUrl'], {
      'X-Forwarded-Host': 'northwind.example.net',
      'X-Forwarded-Proto': 'https',
    });
    const passkey: Tests_Routes_Backup_Passkey = createAuthenticator();

    await claimOwner(currentHarness['pool'], owner);

    const registration: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/auth/passkeys/register/options', {
      name: 'Northwind security key',
      password: OWNER_PASSWORD,
    });
    const creationOptions: Tests_Routes_Backup_Options = Reflect.get(Object(registration['body']), 'options');

    expect((await owner.request('POST', '/api/v1/auth/passkeys/register/verify', {
      ceremonyId: Reflect.get(Object(registration['body']), 'ceremonyId'),
      credential: createRegistration(passkey, creationOptions, 'https://northwind.example.net'),
    }))['status']).toBe(201);

    const optionsResponse: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/backup/confirmation/passkey/options', {
      purpose: 'export',
    });
    const requestOptions: Tests_Routes_Backup_Options = Reflect.get(Object(optionsResponse['body']), 'options');

    expect(requestOptions).toEqual(expect.objectContaining({
      rpId: 'northwind.example.net',
      userVerification: 'required',
    }));

    const grant: Tests_Routes_Backup_Grant = grantFrom(await owner.request('POST', '/api/v1/backup/confirmation/passkey/verify', {
      ceremonyId: Reflect.get(Object(optionsResponse['body']), 'ceremonyId'),
      credential: createAssertion(passkey, requestOptions, 'https://northwind.example.net', 'northwind.example.net'),
      purpose: 'export',
    }));

    expect((await owner.request('POST', '/api/v1/backup/export', {
      grant: grant['grant'],
      sections: {
        accessTokens: false,
        connection: true,
        features: false,
        notifications: false,
      },
    }))['status']).toBe(200);

    return;
  });

  it('moves config.json through the wizard and exports every selected secret-bearing section', async () => {
    const currentHarness: Tests_Routes_Backup_GetHarness_Returns = getHarness();
    const owner: Tests_Routes_Backup_Client = createClient(currentHarness['baseUrl']);

    await seedServer(currentHarness['pool'], SERVER_ID, 'Northwind Outfitters');
    await claimOwner(currentHarness['pool'], owner);

    const legacySource: Tests_Routes_Backup_LegacySource = {
      configuration: JSON.stringify(legacyConfiguration),
      enableFeatures: true,
      serverId: SERVER_ID,
      type: 'legacy',
    };
    const previewResponse: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/backup/imports/preview', {
      source: legacySource,
    });
    const preview: Tests_Routes_Backup_Preview = previewResponse['body'] as Tests_Routes_Backup_Preview;

    expect(previewResponse['status']).toBe(200);

    expect(preview['source']).toBe('legacy');

    expect(preview['excluded']).toEqual(expect.arrayContaining([expect.objectContaining({ label: 'retired-northwind-widget' })]));

    expect(preview['excluded']).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Message copier destination on Twitter/X' }),
      expect.objectContaining({ label: 'Twitter/X feeds' }),
      expect.objectContaining({ label: 'Twitter/X keys' }),
      expect.objectContaining({ label: 'Unsupported legacy sections' }),
    ]));

    expect(preview['excluded']).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Legacy note' }),
      expect.objectContaining({ label: 'anti-raid' }),
    ]));

    expect(preview['legacy']).toMatchObject({
      featuresRequiringFixes: expect.arrayContaining([expect.objectContaining({ label: 'Anti-raid' })]),
      featuresThatTurnOn: 2,
    });

    const disabledPreviewResponse: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/backup/imports/preview', {
      source: {
        ...legacySource,
        enableFeatures: false,
      },
    });
    const disabledPreview: Tests_Routes_Backup_Preview = disabledPreviewResponse['body'] as Tests_Routes_Backup_Preview;

    expect(disabledPreview['legacy']).toMatchObject({
      featuresThatTurnOn: 0,
    });

    expect(disabledPreview['excluded']).not.toEqual(expect.arrayContaining([expect.objectContaining({ reason: 'Imported features stay off until you turn them on.' })]));

    const importGrant: Tests_Routes_Backup_Grant = grantFrom(await confirm(owner, 'import', OWNER_PASSWORD));

    expect((await owner.request('POST', '/api/v1/backup/imports', {
      grant: importGrant['grant'],
      source: legacySource,
    }))['status']).toBe(200);

    expect((await owner.request('POST', '/api/v1/notifications', {
      events: ['bot-disconnected'],
      name: 'Northwind operations alerts',
      service: 'telegram',
      settings: {
        botToken: NOTIFICATION_SECRET,
        chatId: '-1001234567890',
      },
    }))['status']).toBe(201);

    const tokenResponse: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/auth/tokens', {
      name: 'Northwind reporting bridge',
      scopes: ['logs:read'],
    });
    const plaintextToken: Tests_Routes_Backup_PlaintextToken = String(Reflect.get(Object(tokenResponse['body']), 'plaintext'));
    const tokenHashes: Tests_Routes_Backup_TokenHashResult = await currentHarness['pool'].query('SELECT token_hash FROM panel_api_tokens WHERE name = $1', ['Northwind reporting bridge']);
    const tokenHashRow: Tests_Routes_Backup_TokenHashRowResult = tokenHashes.rows[0];
    const tokenHash: Tests_Routes_Backup_TokenHash = (tokenHashRow === undefined) ? '' : tokenHashRow['token_hash'];
    const exportGrant: Tests_Routes_Backup_Grant = grantFrom(await confirm(owner, 'export', OWNER_PASSWORD));
    const exported: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/backup/export', {
      grant: exportGrant['grant'],
      sections: {
        accessTokens: true,
        connection: true,
        features: true,
        notifications: true,
      },
    });
    const document: Tests_Routes_Backup_Document = parseBackupDocument(exported['body']);
    const serialized: Tests_Routes_Backup_SerializedDocument = JSON.stringify(document);
    const contentDisposition: Tests_Routes_Backup_ContentDisposition = exported['headers'].get('Content-Disposition');

    expect(exported['status']).toBe(200);

    expect(String(contentDisposition).startsWith('attachment; filename="discord-stonker-bot-export-')).toBe(true);

    expect(String(contentDisposition).endsWith('.json"')).toBe(true);

    expect(document['connection']).toEqual({
      botToken: BOT_TOKEN,
      desiredState: 'stopped',
    });

    expect(JSON.stringify(document['features'])).toContain(FEATURE_SECRET);

    expect(JSON.stringify(document['notifications'])).toContain(NOTIFICATION_SECRET);

    expect(document['accessTokens']).toEqual(expect.arrayContaining([expect.objectContaining({
      name: 'Northwind reporting bridge',
      tokenHash,
    })]));

    expect(serialized).not.toContain(OWNER_PASSWORD);

    expect(serialized).not.toContain(plaintextToken);

    expect(serialized).not.toContain('panel_users');

    expect(serialized).not.toContain('recoveryCodes');

    expect(serialized).not.toContain('sessions');

    expect(serialized).not.toContain('totp');

    expect(serialized).not.toContain('passkeys');

    expect(serialized).not.toContain('runtime_logs');

    const duplicatePreviewResponse: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/backup/imports/preview', {
      source: {
        document,
        type: 'export',
      },
    });
    const duplicatePreview: Tests_Routes_Backup_Preview = duplicatePreviewResponse['body'] as Tests_Routes_Backup_Preview;

    expect(duplicatePreview['summary']['notifications']['replaced']).toBe(1);

    expect(duplicatePreview['summary']['accessTokens']['skipped']).toBeGreaterThanOrEqual(1);

    const duplicateGrant: Tests_Routes_Backup_Grant = grantFrom(await confirm(owner, 'import', OWNER_PASSWORD));

    expect((await owner.request('POST', '/api/v1/backup/imports', {
      grant: duplicateGrant['grant'],
      source: {
        document,
        type: 'export',
      },
    }))['status']).toBe(200);

    return;
  });

  it('strictly rejects unknown export fields and rolls back a failed transaction', async () => {
    const currentHarness: Tests_Routes_Backup_GetHarness_Returns = getHarness();
    const owner: Tests_Routes_Backup_Client = createClient(currentHarness['baseUrl']);

    await claimOwner(currentHarness['pool'], owner);

    expect(await owner.request('POST', '/api/v1/backup/imports/preview', {
      source: {
        configuration: '{',
        enableFeatures: true,
        serverId: SERVER_ID,
        type: 'legacy',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({ code: 'backup_source_invalid' }),
      }),
      status: 422,
    }));

    expect(await owner.request('POST', '/api/v1/backup/imports/preview', {
      source: {
        configuration: JSON.stringify({
          settings: {
            discord: {
              guild: {
                'guild-id': '1197999049190674999',
              },
            },
          },
        }),
        enableFeatures: true,
        serverId: SERVER_ID,
        type: 'legacy',
      },
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        error: expect.objectContaining({ code: 'backup_source_invalid' }),
      }),
      status: 409,
    }));

    expect((await owner.request('POST', '/api/v1/backup/imports/preview', {
      source: {
        document: {
          appVersion: '4.0.0',
          connection: {
            botToken: null,
            desiredState: 'stopped',
          },
          exportedAt: '2026-11-09T12:00:00.000Z',
          format: 'discord-stonker-bot-export',
          users: [{ password: 'must-not-import' }],
          version: 1,
        },
        type: 'export',
      },
    }))['status']).toBe(422);

    let deepConfiguration: Tests_Routes_Backup_DeepConfiguration = { value: 'northwind' };

    for (const index of [
      1,
      2,
      3,
      4,
      5,
    ]) {
      const key: Tests_Routes_Backup_DeepKey = `${String(index)}-${'x'.repeat(500)}`;

      deepConfiguration = { [key]: deepConfiguration };
    }

    const rollbackDocument: Tests_Routes_Backup_Document = parseBackupDocument({
      appVersion: '4.0.0',
      connection: {
        botToken: 'northwind-rollback-token',
        desiredState: 'running',
      },
      exportedAt: '2026-11-09T12:00:00.000Z',
      features: [{
        features: [{
          configuration: deepConfiguration,
          enabled: true,
          key: 'auto-replies',
          secrets: {},
        }],
        serverId: '1197999049190674555',
        timeZone: 'UTC',
      }],
      format: 'discord-stonker-bot-export',
      version: 1,
    });
    const grant: Tests_Routes_Backup_Grant = grantFrom(await confirm(owner, 'import', OWNER_PASSWORD));
    const failed: Tests_Routes_Backup_Response = await owner.request('POST', '/api/v1/backup/imports', {
      grant: grant['grant'],
      source: {
        document: rollbackDocument,
        type: 'export',
      },
    });

    expect(failed['status']).toBe(500);

    const runtime: Tests_Routes_Backup_RuntimeResult = await currentHarness['pool'].query('SELECT desired_state, discord_token_ciphertext FROM bot_runtime_control WHERE singleton = TRUE');
    const servers: Tests_Routes_Backup_ServerCountResult = await currentHarness['pool'].query('SELECT COUNT(*)::text AS count FROM discord_servers WHERE guild_id = $1', ['1197999049190674555']);
    const serverCountRow: Tests_Routes_Backup_ServerCountRowResult = servers.rows[0];

    expect(runtime.rows[0]).toEqual({
      desired_state: 'stopped',
      discord_token_ciphertext: null,
    });

    expect((serverCountRow === undefined) ? '' : serverCountRow['count']).toBe('0');

    return;
  });

  return;
});
