import {
  describe,
  expect,
  it,
} from 'vitest';

import { createTestDatabase } from '../tests/support/database.js';
import { seedServer } from '../tests/support/harness.js';
import {
  saveGuildFeatureConfiguration,
  setNormalizedGuildFeatureEnabled,
} from './configuration-database.js';
import {
  createWebhookSignature,
  findWebApplicationPathConflicts,
  prepareWebApplicationFeatures,
  renderWebhookContent,
  verifyWebhookSignature,
} from './web-application-features.js';

import type {
  Lib_WebApplicationFeatures_CreateWebhookSignature_Body,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Returns,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Secret,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Timestamp,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns,
  Lib_WebApplicationFeatures_Test_Configuration,
  Lib_WebApplicationFeatures_Test_Database,
  Lib_WebApplicationFeatures_Test_Pool,
  Lib_WebApplicationFeatures_Test_Settings,
} from '../types/lib/web-application-features.d.ts';

/**
 * Web Application Features - Public Application Runtime.
 *
 * Verifies encrypted-secret admission, signed mapping, and webhook message rendering.
 * The tests use no live Discord, Google, or inbound-provider requests.
 *
 * @since 4.0.0
 */
describe('public application runtime', () => {
  it('admits an invite page and signed webhook routes with resolved secrets', () => {
    const prepared: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns = prepareWebApplicationFeatures({
      features: {
        'web-applications': {
          configuration: {
            'invite-generator': {
              options: {
                'max-age': 300,
                'max-uses': 1,
                'path': '/invite',
              },
              recaptcha: {
                'secret-key': {
                  $secret: 'captcha-key',
                },
                'site-key': 'site-key',
              },
            },
            'map-webhooks': [{
              'channel': {
                'channel-id': '1209383231867326487',
              },
              'name': 'Donation alert',
              'path': '/webhooks/donation-alert',
              'payload': {
                content: '@DONOR@ donated @AMOUNT@.',
              },
              'signing-secret': {
                $secret: 'webhook-key',
              },
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
          enabled: true,
        },
      },
    }, (key) => ({
      'captcha-key': 'captcha-secret',
      'webhook-key': 'a-webhook-signing-secret-with-at-least-32-characters',
    })[key]);

    expect(prepared['activeFeatureKeys']).toEqual(['web-applications']);

    expect(prepared['configurationErrors']).toEqual([]);

    if (prepared['runtime'] === undefined) {
      throw new Error('Expected the web application runtime to compile.');
    }

    expect(prepared['runtime']['webhookRoutes'].size).toBe(1);

    return;
  });

  it('verifies timestamped signatures and rejects stale or changed requests', () => {
    const body: Lib_WebApplicationFeatures_CreateWebhookSignature_Body = '{"donation":{"donor":"TEST"}}';
    const timestamp: Lib_WebApplicationFeatures_CreateWebhookSignature_Timestamp = '1792684800';
    const secret: Lib_WebApplicationFeatures_CreateWebhookSignature_Secret = 'a-webhook-signing-secret-with-at-least-32-characters';
    const signature: Lib_WebApplicationFeatures_CreateWebhookSignature_Returns = createWebhookSignature(
      body,
      timestamp,
      secret,
    );

    expect(verifyWebhookSignature(body, timestamp, signature, secret, 1_792_684_800_000)).toBe(true);

    expect(verifyWebhookSignature(body, timestamp, `sha256=${signature}`, secret, 1_792_684_800_000)).toBe(true);

    expect(verifyWebhookSignature(`${body} `, timestamp, signature, secret, 1_792_684_800_000)).toBe(false);

    expect(verifyWebhookSignature(body, timestamp, signature, secret, 1_792_984_800_001)).toBe(false);

    return;
  });

  it('formats legacy mapping types without allowing Discord formatting input', () => {
    expect(renderWebhookContent({
      channelIdentifier: '1209383231867326487',
      name: 'Donation alert',
      path: '/webhooks/donation-alert',
      signingSecret: 'a-webhook-signing-secret-with-at-least-32-characters',
      template: '**@DONOR@** gave @AMOUNT@ · @RECURRING@ · @WHEN@',
      variables: [
        {
          identifier: 'DONOR',
          path: 'donation.donor',
          type: 'string',
        },
        {
          identifier: 'AMOUNT',
          path: 'donation.amount',
          type: 'usd-cents',
        },
        {
          identifier: 'RECURRING',
          path: 'donation.recurring',
          type: 'boolean',
        },
        {
          identifier: 'WHEN',
          path: 'donation.timestamp',
          type: 'ts-millis',
        },
      ],
    }, {
      donation: {
        amount: 123_45,
        donor: '*TEST*',
        recurring: true,
        timestamp: 1_792_684_800_000,
      },
    })).toBe('**\\*TEST\\*** gave $123.45 · Yes · <t:1792684800:F>');

    return;
  });

  it('rejects a public path already enabled by another server', async () => {
    const database: Lib_WebApplicationFeatures_Test_Database = await createTestDatabase();
    const pool: Lib_WebApplicationFeatures_Test_Pool = database['pool'];
    const configuration: Lib_WebApplicationFeatures_Test_Configuration = {
      'invite-generator': {
        options: { path: '/invite' },
      },
    };
    const settings: Lib_WebApplicationFeatures_Test_Settings = {
      features: {
        'web-applications': {
          configuration,
          enabled: true,
        },
      },
    };

    try {
      await seedServer(pool, '1197999049190674442', 'First server');

      await seedServer(pool, '1197999049190674443', 'Second server');

      await saveGuildFeatureConfiguration(pool, {
        configuration,
        expectedRevision: 0,
        featureKey: 'web-applications',
        guildIdentifier: '1197999049190674442',
        secrets: [],
      });

      await setNormalizedGuildFeatureEnabled(pool, '1197999049190674442', 'web-applications', true);

      expect(await findWebApplicationPathConflicts(pool, '1197999049190674443', settings)).toEqual(['/invite']);

      expect(await findWebApplicationPathConflicts(pool, '1197999049190674442', settings)).toEqual([]);
    } finally {
      await pool.end();
    }

    return;
  });

  return;
});
