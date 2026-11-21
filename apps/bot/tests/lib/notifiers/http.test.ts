import { describe, expect, it } from 'vitest';

import { Runner as HttpDelivery } from '../../../src/lib/notifiers/http.js';

/**
 * HTTP - HTTP Delivery.
 *
 * Locks the shared deadline and the response wording used by every HTTP adapter.
 * Individual service tests cover their exact requests.
 *
 * @since 4.2.1
 */
describe('HTTP delivery', () => {
  it('sends the exact request with a deadline', async () => {
    await expect(HttpDelivery.send({
      body: '{"test":true}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: 'https://hooks.example.com/operations',
    }, async (url, init) => {
      expect(url).toBe('https://hooks.example.com/operations');

      expect(init).toMatchObject({
        body: '{"test":true}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      expect(init['signal']).toBeInstanceOf(AbortSignal);

      return new Response(null, { status: 204 });
    })).resolves.toEqual({ delivered: true });

    return;
  });

  it('keeps bounded service response wording', async () => {
    await expect(HttpDelivery.send({
      body: '{}',
      headers: {},
      method: 'POST',
      url: 'https://hooks.example.com/operations',
    }, async () => new Response(JSON.stringify({ error: 'Service reason.' }), { status: 422 }))).resolves.toEqual({
      delivered: false,
      message: 'HTTP 422: Service reason.',
    });

    return;
  });

  return;
});
