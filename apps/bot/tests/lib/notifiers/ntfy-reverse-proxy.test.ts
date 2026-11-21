import { describe, expect, it } from 'vitest';

import { Runner as NtfyReverseProxyNotifier } from '../../../src/lib/notifiers/ntfy-reverse-proxy.js';
import { createPayload } from './fixtures.js';

/**
 * Ntfy Reverse Proxy - Ntfy Reverse Proxy Adapter.
 *
 * Locks context validation, authentication, and versioned payload delivery.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Ntfy reverse proxy adapter', () => {
  it('builds the exact request', () => {
    expect(new NtfyReverseProxyNotifier({
      secrets: { token: 'proxy-token' },
      service: 'ntfy-reverse-proxy',
      settings: { url: 'https://alerts.example.com/context' },
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify(createPayload()['webhook']),
      headers: {
        'Authorization': 'Bearer proxy-token',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: 'https://alerts.example.com/context',
    });

    return;
  });

  it('requires an HTTPS context URL', () => {
    expect(NtfyReverseProxyNotifier.validate('url', 'https://alerts.example.com/context')).toBe(true);

    expect(NtfyReverseProxyNotifier.validate('url', 'http://alerts.example.com/context')).toBe(false);

    return;
  });

  return;
});
