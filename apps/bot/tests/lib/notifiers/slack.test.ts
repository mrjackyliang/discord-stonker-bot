import { describe, expect, it } from 'vitest';

import { Runner as SlackNotifier } from '../../../src/lib/notifiers/slack.js';
import { createPayload } from './fixtures.js';

/**
 * Slack - Slack Adapter.
 *
 * Locks Slack webhook validation, escaping, and request construction.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Slack adapter', () => {
  it('builds the exact request', () => {
    expect(new SlackNotifier({
      secrets: { webhookUrl: 'https://hooks.slack.com/services/T/B/token' },
      service: 'slack',
      settings: {},
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify({
        text: [
          '*Stonker Bot for Discord: Alert*',
          'Message &lt;&amp;&gt;.',
        ].join('\n'),
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: 'https://hooks.slack.com/services/T/B/token',
    });

    return;
  });

  it('validates Slack webhook hosts', () => {
    expect(SlackNotifier.validate('webhookUrl', 'https://hooks.slack.com/services/T/B/token')).toBe(true);

    expect(SlackNotifier.validate('webhookUrl', 'https://example.com/services/T/B/token')).toBe(false);

    return;
  });

  return;
});
