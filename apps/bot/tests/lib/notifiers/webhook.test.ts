import { describe, expect, it } from 'vitest';

import { Runner as WebhookNotifier } from '../../../src/lib/notifiers/webhook.js';
import { createPayload } from './fixtures.js';

/**
 * Webhook - Webhook Adapter.
 *
 * Locks webhook validation, authentication, and versioned payload delivery.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Webhook adapter', () => {
  it('builds the exact request', () => {
    expect(new WebhookNotifier({
      secrets: {
        token: 'webhook-token',
        url: 'https://hooks.example.com/operations',
      },
      service: 'webhook',
      settings: {},
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify(createPayload()['webhook']),
      headers: {
        'Authorization': 'Bearer webhook-token',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: 'https://hooks.example.com/operations',
    });

    return;
  });

  it('validates HTTP and HTTPS URLs', () => {
    expect(WebhookNotifier.validate('url', 'http://hooks.example.com/operations')).toBe(true);

    expect(WebhookNotifier.validate('url', 'ftp://hooks.example.com/operations')).toBe(false);

    return;
  });

  return;
});
