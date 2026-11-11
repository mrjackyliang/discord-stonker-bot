import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { getFeatureCatalog } from '../lib/feature-catalog.js';
import { collectSecretReferences } from '../lib/feature-secrets.js';
import { flattenFeatureConfiguration } from '../lib/feature-storage.js';
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
  Tests_Routes_Features_AntiRaidConfiguration,
  Tests_Routes_Features_Client,
  Tests_Routes_Features_CreateProxyConfiguration_Returns,
  Tests_Routes_Features_CreateProxyConfiguration_SecretKeys,
  Tests_Routes_Features_Detail,
  Tests_Routes_Features_Generation,
  Tests_Routes_Features_GetHarness_Returns,
  Tests_Routes_Features_Harness,
  Tests_Routes_Features_List,
  Tests_Routes_Features_ListSecretKeys_Result,
  Tests_Routes_Features_ListSecretKeys_Returns,
  Tests_Routes_Features_ReadGeneration_FirstRow,
  Tests_Routes_Features_ReadGeneration_Result,
  Tests_Routes_Features_ReadGeneration_Returns,
  Tests_Routes_Features_ReadSecretKey_Body,
  Tests_Routes_Features_ReadSecretKey_Index,
  Tests_Routes_Features_ReadSecretKey_Reference,
  Tests_Routes_Features_ReadSecretKey_Returns,
  Tests_Routes_Features_Response,
  Tests_Routes_Features_SecretKey,
  Tests_Routes_Features_SecretKeys,
  Tests_Routes_Features_ServerId,
  Tests_Routes_Features_SignIn_Options,
  Tests_Routes_Features_SignIn_Returns,
  Tests_Routes_Features_StoreFeature_Configuration,
  Tests_Routes_Features_StoreFeature_FeatureKey,
  Tests_Routes_Features_StoreFeature_Returns,
  Tests_Routes_Features_Token,
  Tests_Routes_Features_UserId,
  Tests_Routes_Features_WebApplicationsConfiguration,
  Tests_Routes_Features_WebhookUrl,
} from '../types/tests/routes/features.test.d.ts';

/**
 * Features - Server ID.
 *
 * Names the Discord server whose features most tests change.
 * Its ID doubles as a channel ID in the sample settings.
 *
 * @since 4.0.0
 */
const SERVER_ID: Tests_Routes_Features_ServerId = '1197999049190674442';

/**
 * Features - Other Server ID.
 *
 * Names a second Discord server, used to check that server access is enforced.
 * Nothing in it is ever changed.
 *
 * @since 4.0.0
 */
const OTHER_SERVER_ID: Tests_Routes_Features_ServerId = '1209383231867326487';

/**
 * Features - Proxy Webhook URL.
 *
 * A well-formed Discord webhook URL that the message proxy compiler accepts.
 * No request is ever sent to it.
 *
 * @since 4.0.0
 */
const PROXY_WEBHOOK_URL: Tests_Routes_Features_WebhookUrl = 'https://discord.com/api/webhooks/1209383231867326487/proxy-token';

/**
 * Features - Other Proxy Webhook URL.
 *
 * A second webhook URL, used when one proxy's secret is replaced.
 * No request is ever sent to it.
 *
 * @since 4.0.0
 */
const OTHER_PROXY_WEBHOOK_URL: Tests_Routes_Features_WebhookUrl = 'https://discord.com/api/webhooks/1197999215838773279/other-token';

/**
 * Features - Anti Raid Configuration.
 *
 * Valid anti-raid settings with one username signal and an alert channel.
 * They hold no secrets.
 *
 * @since 4.0.0
 */
const antiRaidConfiguration: Tests_Routes_Features_AntiRaidConfiguration = {
  'auto-ban': {
    channel: {
      'channel-id': SERVER_ID,
    },
    usernames: [{
      username: 'Discord Support',
    }],
  },
};

/**
 * Features - Web Applications Configuration.
 *
 * Valid web application settings with an invite page and one signed webhook.
 * Both secrets start empty and are sent next to the settings.
 *
 * @since 4.0.0
 */
const webApplicationsConfiguration: Tests_Routes_Features_WebApplicationsConfiguration = {
  'invite-generator': {
    options: {
      'max-age': 300,
      'max-uses': 1,
      'path': '/invite',
    },
    recaptcha: {
      'secret-key': {
        $secret: '',
      },
      'site-key': 'site-key',
    },
  },
  'map-webhooks': [{
    'channel': {
      'channel-id': SERVER_ID,
    },
    'name': 'Donation alert',
    'path': '/webhooks/donation-alert',
    'payload': {
      content: '@DONOR@ donated.',
    },
    'signing-secret': {
      $secret: '',
    },
    'variables': [{
      id: 'DONOR',
      path: 'donation.donor',
      type: 'string',
    }],
  }],
};

/**
 * Features - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database with two Discord servers.
 *
 * @since 4.0.0
 */
let harness: Tests_Routes_Features_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  await seedServer(harness['pool'], SERVER_ID, 'Stonker HQ');

  await seedServer(harness['pool'], OTHER_SERVER_ID, 'Other server');

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
 * Features - Get Harness.
 *
 * Returns the running app of the current test.
 * Helpers use it so each one doesn't check for a missing app.
 *
 * @returns {Tests_Routes_Features_GetHarness_Returns}
 *
 * @since 4.0.0
 */
function getHarness(): Tests_Routes_Features_GetHarness_Returns {
  if (harness === undefined) {
    throw new Error('The test server is not running.');
  }

  return harness;
}

/**
 * Features - Create Proxy Configuration.
 *
 * Builds one message proxy per secret key, each posting through its own webhook.
 * An empty key stands for a secret sent next to the settings.
 *
 * @param {Tests_Routes_Features_CreateProxyConfiguration_SecretKeys} secretKeys - Secret keys.
 *
 * @returns {Tests_Routes_Features_CreateProxyConfiguration_Returns}
 *
 * @since 4.0.0
 */
function createProxyConfiguration(secretKeys: Tests_Routes_Features_CreateProxyConfiguration_SecretKeys): Tests_Routes_Features_CreateProxyConfiguration_Returns {
  return secretKeys.map((secretKey, index) => ({
    channel: {
      'channel-id': SERVER_ID,
    },
    name: `Proxy ${index + 1}`,
    webhook: {
      'webhook-url': {
        $secret: secretKey,
      },
    },
  }));
}

/**
 * Features - List Secret Keys.
 *
 * Lists the secrets stored for the main server, without their values.
 * Tests use it to check secrets are kept, replaced, and deleted.
 *
 * @returns {Tests_Routes_Features_ListSecretKeys_Returns}
 *
 * @since 4.0.0
 */
async function listSecretKeys(): Tests_Routes_Features_ListSecretKeys_Returns {
  const result: Tests_Routes_Features_ListSecretKeys_Result = await getHarness()['pool'].query('SELECT secret_key FROM guild_secrets WHERE guild_id = $1', [SERVER_ID]);

  return result.rows.map((row) => row['secret_key']);
}

/**
 * Features - Read Generation.
 *
 * Reads how many times the bot has been asked to reload its settings.
 * Tests compare it before and after each change.
 *
 * @returns {Tests_Routes_Features_ReadGeneration_Returns}
 *
 * @since 4.0.0
 */
async function readGeneration(): Tests_Routes_Features_ReadGeneration_Returns {
  const result: Tests_Routes_Features_ReadGeneration_Result = await getHarness()['pool'].query('SELECT generation::text AS generation FROM bot_runtime_control WHERE singleton = TRUE');
  const row: Tests_Routes_Features_ReadGeneration_FirstRow = result.rows[0];

  if (row === undefined) {
    throw new Error('The bot control row is missing.');
  }

  return Number.parseInt(row['generation'], 10);
}

/**
 * Features - Read Secret Key.
 *
 * Reads the key of one secret reference in a saved feature, in document order.
 * The test fails when the reference is missing.
 *
 * @param {Tests_Routes_Features_ReadSecretKey_Body}  body  - Body.
 * @param {Tests_Routes_Features_ReadSecretKey_Index} index - Index.
 *
 * @returns {Tests_Routes_Features_ReadSecretKey_Returns}
 *
 * @since 4.0.0
 */
function readSecretKey(body: Tests_Routes_Features_ReadSecretKey_Body, index: Tests_Routes_Features_ReadSecretKey_Index): Tests_Routes_Features_ReadSecretKey_Returns {
  const reference: Tests_Routes_Features_ReadSecretKey_Reference = collectSecretReferences((body as Tests_Routes_Features_Detail)['configuration'])[index];

  if (reference === undefined) {
    throw new Error('The saved feature is missing a secret reference.');
  }

  return reference['key'];
}

/**
 * Features - Sign In.
 *
 * Creates a panel user with a browser session and returns a client that uses it.
 * The client sends the CSRF header on every change.
 *
 * @param {Tests_Routes_Features_SignIn_Options} options - Options.
 *
 * @returns {Tests_Routes_Features_SignIn_Returns}
 *
 * @since 4.0.0
 */
async function signIn(options: Tests_Routes_Features_SignIn_Options): Tests_Routes_Features_SignIn_Returns {
  const client: Tests_Routes_Features_Client = createClient(getHarness()['baseUrl']);

  await signInTestUser(getHarness()['pool'], client, options);

  return client;
}

/**
 * Features - Store Feature.
 *
 * Writes a feature configuration straight into the database, skipping every check.
 * Tests use it for settings that the save route would refuse.
 *
 * @param {Tests_Routes_Features_StoreFeature_FeatureKey}    featureKey    - Feature key.
 * @param {Tests_Routes_Features_StoreFeature_Configuration} configuration - Configuration.
 *
 * @returns {Tests_Routes_Features_StoreFeature_Returns}
 *
 * @since 4.0.0
 */
async function storeFeature(featureKey: Tests_Routes_Features_StoreFeature_FeatureKey, configuration: Tests_Routes_Features_StoreFeature_Configuration): Tests_Routes_Features_StoreFeature_Returns {
  await getHarness()['pool'].query('INSERT INTO guild_features (guild_id, feature_key, enabled) VALUES ($1, $2, FALSE)', [
    SERVER_ID,
    featureKey,
  ]);

  await Promise.all(flattenFeatureConfiguration(configuration).map((row) => {
    return getHarness()['pool'].query('INSERT INTO guild_feature_values (guild_id, feature_key, value_path, value_type, value_text) VALUES ($1, $2, $3, $4, $5)', [
      SERVER_ID,
      featureKey,
      row['path'],
      row['type'],
      row['value'] ?? null,
    ]);
  }));

  return;
}

/**
 * Features - Feature Routes.
 *
 * Covers listing, reading, saving, and switching features, with their secrets and access.
 * Every change is checked against the bot reload counter.
 *
 * @since 4.0.0
 */
describe('feature routes', () => {
  it('lists every catalog feature with its state in the server', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });
    const list: Tests_Routes_Features_Response = await operator.request('GET', `/api/v1/servers/${SERVER_ID}/features`);
    const body: Tests_Routes_Features_List = list['body'] as Tests_Routes_Features_List;

    expect(list['status']).toBe(200);

    expect(body['items'].map((item) => item['key'])).toEqual(getFeatureCatalog().map((definition) => definition['key']));

    expect(body['items'][0]).toEqual({
      category: 'safety',
      configured: false,
      description: 'Ban known raid accounts on join and give screened members their roles.',
      enabled: false,
      key: 'anti-raid',
      name: 'Anti-raid',
      revision: 0,
      updatedAt: null,
    });

    return;
  });

  it('saves and switches a feature, reloading the bot only when something changed', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });
    const generation: Tests_Routes_Features_Generation = await readGeneration();

    expect(await operator.request('GET', `/api/v1/servers/${SERVER_ID}/features/anti-raid`)).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        configuration: null,
        configured: false,
        editor: expect.objectContaining({
          'title': 'Anti-raid',
          'x-sections': expect.any(Array),
        }),
        enabled: false,
        example: null,
        key: 'anti-raid',
        revision: 0,
        secrets: {},
        updatedAt: null,
      }),
      status: 200,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid/enabled`, {
      enabled: true,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'feature_not_configured',
          message: 'Set up this feature before turning it on.',
        },
      },
      status: 409,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        configuration: antiRaidConfiguration,
        configured: true,
        enabled: false,
        revision: 1,
        secrets: {},
        updatedAt: expect.any(String),
      }),
      status: 200,
    }));

    expect(await readGeneration()).toBe(generation + 1);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'revision_conflict',
          message: 'This feature changed since you opened it. Reload to see the latest version.',
        },
      },
      status: 409,
    }));

    expect(await readGeneration()).toBe(generation + 1);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid/enabled`, {
      enabled: true,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        configured: true,
        enabled: true,
        key: 'anti-raid',
        revision: 1,
      }),
      status: 200,
    }));

    expect(await readGeneration()).toBe(generation + 2);

    expect((await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid/enabled`, {
      enabled: true,
    }))['status']).toBe(200);

    expect(await readGeneration()).toBe(generation + 2);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 1,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        enabled: true,
        revision: 2,
      }),
      status: 200,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid/enabled`, {
      enabled: false,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        enabled: false,
        revision: 2,
      }),
      status: 200,
    }));

    expect(await readGeneration()).toBe(generation + 4);

    expect((await operator.request('GET', `/api/v1/servers/${SERVER_ID}/features`))['body']).toEqual({
      items: expect.arrayContaining([expect.objectContaining({
        configured: true,
        enabled: false,
        key: 'anti-raid',
        revision: 2,
      })]),
    });

    return;
  });

  it('reports invalid requests and settings with paths under their fields', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: 'everything',
      expectedRevision: -1,
      extra: true,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'configuration',
              message: 'Send the settings as an object or a list.',
              path: ['configuration'],
            },
            {
              field: 'expectedRevision',
              message: 'Send the revision you opened.',
              path: ['expectedRevision'],
            },
            {
              field: 'extra',
              message: 'This field isn\'t accepted.',
              path: ['extra'],
            },
          ],
          message: 'Send the settings as an object or a list.',
        },
      },
      status: 422,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: [{
        channel: {
          'channel-id': 'general',
        },
        name: 'Proxy',
        webhook: {
          'webhook-url': {
            $secret: '',
          },
        },
      }],
      expectedRevision: 0,
      secrets: {
        '/0/name': 'Not a secret',
        '/0/webhook/webhook-url': PROXY_WEBHOOK_URL,
      },
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [
            {
              field: 'secrets./0/name',
              message: 'This isn\'t a secret field.',
              path: [
                'secrets',
                '/0/name',
              ],
            },
            {
              field: 'configuration.0.channel.channel-id',
              message: 'Enter a Discord ID (17 to 20 digits).',
              path: [
                'configuration',
                '0',
                'channel',
                'channel-id',
              ],
            },
          ],
          message: 'This isn\'t a secret field.',
        },
      },
      status: 422,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid/enabled`, {
      enabled: 'yes',
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'enabled',
            message: 'Choose on or off.',
            path: ['enabled'],
          }],
          message: 'Choose on or off.',
        },
      },
      status: 422,
    }));

    expect(await listSecretKeys()).toEqual([]);

    return;
  });

  it('stores secrets encrypted, keeps them, gives replacements fresh keys, and deletes unused ones', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });
    const created: Tests_Routes_Features_Response = await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration(['']),
      expectedRevision: 0,
      secrets: {
        '/0/webhook/webhook-url': ` ${PROXY_WEBHOOK_URL}\n`,
      },
    });

    expect(created['status']).toBe(200);

    const firstKey: Tests_Routes_Features_SecretKey = readSecretKey(created['body'], 0);

    expect(firstKey.startsWith('message-proxies:')).toBe(true);

    expect((created['body'] as Tests_Routes_Features_Detail)['secrets']).toEqual({
      [firstKey]: true,
    });

    expect(JSON.stringify(created['body'])).not.toContain('proxy-token');

    expect(JSON.stringify((await getHarness()['pool'].query('SELECT ciphertext FROM guild_secrets')).rows)).not.toContain('proxy-token');

    expect(await listSecretKeys()).toEqual([firstKey]);

    const kept: Tests_Routes_Features_Response = await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration([firstKey]),
      expectedRevision: 1,
      secrets: {
        '/0/webhook/webhook-url': '',
      },
    });

    expect(kept['status']).toBe(200);

    expect(readSecretKey(kept['body'], 0)).toBe(firstKey);

    expect(await listSecretKeys()).toEqual([firstKey]);

    expect((await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration([
        firstKey,
        firstKey,
      ]),
      expectedRevision: 2,
    }))['status']).toBe(200);

    expect(await listSecretKeys()).toEqual([firstKey]);

    const replaced: Tests_Routes_Features_Response = await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration([
        firstKey,
        firstKey,
      ]),
      expectedRevision: 3,
      secrets: {
        '/1/webhook/webhook-url': OTHER_PROXY_WEBHOOK_URL,
      },
    });

    expect(replaced['status']).toBe(200);

    const secondKey: Tests_Routes_Features_SecretKey = readSecretKey(replaced['body'], 1);
    const secretKeys: Tests_Routes_Features_SecretKeys = await listSecretKeys();

    expect(readSecretKey(replaced['body'], 0)).toBe(firstKey);

    expect(secondKey).not.toBe(firstKey);

    expect(secretKeys).toHaveLength(2);

    expect(secretKeys).toEqual(expect.arrayContaining([
      firstKey,
      secondKey,
    ]));

    expect((await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration([secondKey]),
      expectedRevision: 4,
    }))['status']).toBe(200);

    expect(await listSecretKeys()).toEqual([secondKey]);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies/enabled`, {
      enabled: true,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        enabled: true,
        key: 'message-proxies',
      }),
      status: 200,
    }));

    return;
  });

  it('asks for missing secrets, checks them with the compiler, and never borrows another feature\'s', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration(['']),
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'configuration.0.webhook.webhook-url',
            message: 'Enter this secret.',
            path: [
              'configuration',
              '0',
              'webhook',
              'webhook-url',
            ],
          }],
          message: 'Enter this secret.',
        },
      },
      status: 422,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration(['']),
      expectedRevision: 0,
      secrets: {
        '/0/webhook/webhook-url': 'not-a-webhook',
      },
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'configuration.0.webhook.webhook-url',
            message: 'Enter a Discord webhook URL, starting with https://discord.com/api/webhooks/.',
            path: [
              'configuration',
              '0',
              'webhook',
              'webhook-url',
            ],
          }],
          message: 'Enter a Discord webhook URL, starting with https://discord.com/api/webhooks/.',
        },
      },
      status: 422,
    }));

    expect(await listSecretKeys()).toEqual([]);

    const web: Tests_Routes_Features_Response = await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/web-applications`, {
      configuration: webApplicationsConfiguration,
      expectedRevision: 0,
      secrets: {
        '/invite-generator/recaptcha/secret-key': 'captcha-secret',
        '/map-webhooks/0/signing-secret': 'a-webhook-signing-secret-with-at-least-32-characters',
      },
    });

    expect(web['status']).toBe(200);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies`, {
      configuration: createProxyConfiguration([readSecretKey(web['body'], 0)]),
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({
          code: 'invalid_request',
          message: 'Enter this secret.',
        }),
      },
      status: 422,
    }));

    expect(await listSecretKeys()).toHaveLength(2);

    return;
  });

  it('saves and turns on web applications with both of their secrets', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });
    const visitor: Tests_Routes_Features_Client = createClient(getHarness()['baseUrl']);

    expect((await visitor.request('GET', '/invite'))['status']).toBe(404);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/web-applications`, {
      configuration: webApplicationsConfiguration,
      expectedRevision: 0,
      secrets: {
        '/invite-generator/recaptcha/secret-key': 'captcha-secret',
        '/map-webhooks/0/signing-secret': 'too-short',
      },
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'configuration.map-webhooks.0.signing-secret',
            message: 'Use a signing secret of at least 32 characters.',
            path: [
              'configuration',
              'map-webhooks',
              '0',
              'signing-secret',
            ],
          }],
          message: 'Use a signing secret of at least 32 characters.',
        },
      },
      status: 422,
    }));

    const saved: Tests_Routes_Features_Response = await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/web-applications`, {
      configuration: webApplicationsConfiguration,
      expectedRevision: 0,
      secrets: {
        '/invite-generator/recaptcha/secret-key': 'captcha-secret',
        '/map-webhooks/0/signing-secret': 'a-webhook-signing-secret-with-at-least-32-characters',
      },
    });

    expect(saved['status']).toBe(200);

    expect((saved['body'] as Tests_Routes_Features_Detail)['secrets']).toEqual({
      [readSecretKey(saved['body'], 0)]: true,
      [readSecretKey(saved['body'], 1)]: true,
    });

    expect((await visitor.request('GET', '/invite'))['status']).toBe(404);

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/web-applications/enabled`, {
      enabled: true,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        enabled: true,
        key: 'web-applications',
      }),
      status: 200,
    }));

    expect((await visitor.request('GET', '/invite'))['status']).toBe(200);

    expect((await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/web-applications/enabled`, {
      enabled: false,
    }))['status']).toBe(200);

    expect((await visitor.request('GET', '/invite'))['status']).toBe(404);

    return;
  });

  it('checks saved settings and their secrets before turning a feature on', async () => {
    const operator: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });

    await storeFeature('regex-rules', [{
      match: true,
      name: 'Broken',
      regex: {
        flags: 'i',
        pattern: '[',
      },
    }]);

    await storeFeature('message-proxies', createProxyConfiguration(['message-proxies:0000000000000000']));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/regex-rules/enabled`, {
      enabled: true,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'configuration.0.regex',
            message: 'Regular expression pattern or flags are invalid.',
            path: [
              'configuration',
              '0',
              'regex',
            ],
          }],
          message: 'Fix this feature\'s settings before turning it on.',
        },
      },
      status: 422,
    }));

    expect(await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/message-proxies/enabled`, {
      enabled: true,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_request',
          issues: [{
            field: 'configuration.0.webhook.webhook-url',
            message: 'Enter this secret.',
            path: [
              'configuration',
              '0',
              'webhook',
              'webhook-url',
            ],
          }],
          message: 'Fix this feature\'s settings before turning it on.',
        },
      },
      status: 422,
    }));

    expect((await operator.request('PUT', `/api/v1/servers/${SERVER_ID}/features/regex-rules/enabled`, {
      enabled: false,
    }))['status']).toBe(200);

    return;
  });

  it('lets viewers read features but not change them', async () => {
    const viewer: Tests_Routes_Features_Client = await signIn({
      allServers: true,
      role: 'viewer',
      serverIds: [],
      username: 'viewer',
    });

    expect((await viewer.request('GET', `/api/v1/servers/${SERVER_ID}/features`))['status']).toBe(200);

    expect((await viewer.request('GET', `/api/v1/servers/${SERVER_ID}/features/anti-raid`))['status']).toBe(200);

    expect(await viewer.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'permission_required',
          message: 'Your role can\'t change settings.',
        },
      },
      status: 403,
    }));

    expect(await viewer.request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid/enabled`, {
      enabled: false,
    })).toEqual(expect.objectContaining({
      status: 403,
    }));

    return;
  });

  it('accepts tokens only with the scope each route needs', async () => {
    const userId: Tests_Routes_Features_UserId = await createTestUser(getHarness()['pool'], {
      allServers: true,
      role: 'operator',
      serverIds: [],
      username: 'operator',
    });
    const readToken: Tests_Routes_Features_Token = await createTestToken(getHarness()['pool'], userId, ['features:read']);
    const writeToken: Tests_Routes_Features_Token = await createTestToken(getHarness()['pool'], userId, [
      'features:read',
      'features:write',
    ]);
    const logsToken: Tests_Routes_Features_Token = await createTestToken(getHarness()['pool'], userId, ['logs:read']);

    expect((await createClient(getHarness()['baseUrl'], {
      Authorization: `Bearer ${readToken}`,
    }).request('GET', `/api/v1/servers/${SERVER_ID}/features/anti-raid`))['status']).toBe(200);

    expect(await createClient(getHarness()['baseUrl'], {
      Authorization: `Bearer ${readToken}`,
    }).request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'scope_required',
          message: 'This token doesn\'t have the features:write scope.',
        },
      },
      status: 403,
    }));

    expect(await createClient(getHarness()['baseUrl'], {
      Authorization: `Bearer ${logsToken}`,
    }).request('GET', `/api/v1/servers/${SERVER_ID}/features`)).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'scope_required',
          message: 'This token doesn\'t have the features:read scope.',
        },
      },
      status: 403,
    }));

    expect(await createClient(getHarness()['baseUrl'], {
      Authorization: `Bearer ${writeToken}`,
    }).request('PUT', `/api/v1/servers/${SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: expect.objectContaining({
        revision: 1,
      }),
      status: 200,
    }));

    return;
  });

  it('hides servers the caller can\'t see and answers unknown features', async () => {
    const scoped: Tests_Routes_Features_Client = await signIn({
      allServers: false,
      role: 'operator',
      serverIds: [SERVER_ID],
      username: 'scoped-operator',
    });
    const serverNotFound: Tests_Routes_Features_Response = {
      body: {
        error: {
          code: 'server_not_found',
          message: 'That Discord server isn\'t available.',
        },
      },
      headers: expect.anything(),
      status: 404,
    };

    expect(await scoped.request('GET', `/api/v1/servers/${OTHER_SERVER_ID}/features`)).toEqual(serverNotFound);

    expect(await scoped.request('GET', `/api/v1/servers/${OTHER_SERVER_ID}/features/anti-raid`)).toEqual(serverNotFound);

    expect(await scoped.request('PUT', `/api/v1/servers/${OTHER_SERVER_ID}/features/anti-raid`, {
      configuration: antiRaidConfiguration,
      expectedRevision: 0,
    })).toEqual(serverNotFound);

    expect(await scoped.request('PUT', `/api/v1/servers/${OTHER_SERVER_ID}/features/anti-raid/enabled`, {
      enabled: true,
    })).toEqual(serverNotFound);

    expect(await scoped.request('GET', '/api/v1/servers/1300000000000000000/features')).toEqual(serverNotFound);

    expect(await scoped.request('GET', `/api/v1/servers/${SERVER_ID}/features/not-a-feature`)).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'feature_not_found',
          message: 'That feature doesn\'t exist.',
        },
      },
      status: 404,
    }));

    expect(await scoped.request('PUT', `/api/v1/servers/${SERVER_ID}/features/not-a-feature`, {
      configuration: {},
      expectedRevision: 0,
    })).toEqual(expect.objectContaining({
      body: {
        error: expect.objectContaining({
          code: 'feature_not_found',
        }),
      },
      status: 404,
    }));

    return;
  });

  return;
});
