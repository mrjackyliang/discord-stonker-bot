import { describe, expect, it } from 'vitest';

import { Runner as GotifyNotifier } from '../../../src/lib/notifiers/gotify.js';
import { createPayload } from './fixtures.js';

/**
 * Gotify - Gotify Adapter.
 *
 * Locks Gotify validation, authentication, and request construction.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Gotify adapter', () => {
  it('builds the exact request', () => {
    expect(new GotifyNotifier({
      secrets: { token: 'gotify-token' },
      service: 'gotify',
      settings: { url: 'https://gotify.example.com/' },
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify({
        message: 'Message <&>.',
        priority: 8,
        title: 'Stonker Bot for Discord: Alert',
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Gotify-Key': 'gotify-token',
      },
      method: 'POST',
      url: 'https://gotify.example.com/message',
    });

    return;
  });

  it('validates the server URL', () => {
    expect(GotifyNotifier.validate('url', 'http://gotify.example.com')).toBe(true);

    expect(GotifyNotifier.validate('url', 'gotify.example.com')).toBe(false);

    return;
  });

  return;
});
