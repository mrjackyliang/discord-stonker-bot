import { describe, expect, it } from 'vitest';

import { Runner as PushoverNotifier } from '../../../src/lib/notifiers/pushover.js';
import { createPayload } from './fixtures.js';

/**
 * Pushover - Pushover Adapter.
 *
 * Locks the Pushover endpoint, credentials, and priority mapping.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Pushover adapter', () => {
  it('builds the exact request', () => {
    expect(new PushoverNotifier({
      secrets: {
        appToken: 'app-token',
        userKey: 'user-key',
      },
      service: 'pushover',
      settings: {},
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify({
        message: 'Message <&>.',
        priority: 1,
        title: 'Stonker Bot for Discord: Alert',
        token: 'app-token',
        user: 'user-key',
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: 'https://api.pushover.net/1/messages.json',
    });

    return;
  });

  it('keeps credential validation as free-form text', () => {
    expect(PushoverNotifier.validate('userKey', 'user-key')).toBe(true);

    return;
  });

  return;
});
