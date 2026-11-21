import { describe, expect, it } from 'vitest';

import { Runner as DiscordNotifier } from '../../../src/lib/notifiers/discord.js';
import { createPayload } from './fixtures.js';

/**
 * Discord - Discord Adapter.
 *
 * Locks Discord validation and embed construction behind its adapter.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Discord adapter', () => {
  it('builds the exact request', () => {
    expect(new DiscordNotifier({
      secrets: { webhookUrl: 'https://discord.com/api/webhooks/123/token' },
      service: 'discord',
      settings: {},
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify({
        embeds: [{
          color: parseInt('d04437', 16),
          description: 'Message <&>.',
          timestamp: '2026-11-20T12:00:00.000Z',
          title: 'Stonker Bot for Discord: Alert',
        }],
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      url: 'https://discord.com/api/webhooks/123/token',
    });

    return;
  });

  it('validates full Discord webhook URLs on the current and legacy hosts', () => {
    expect(DiscordNotifier.validate('webhookUrl', 'https://discord.com/api/webhooks/1197999215838773279/token')).toBe(true);

    expect(DiscordNotifier.validate('webhookUrl', 'https://discordapp.com/api/webhooks/1197999215838773279/token')).toBe(true);

    expect(DiscordNotifier.validate('webhookUrl', 'https://example.com/api/webhooks/1197999215838773279/token')).toBe(false);

    return;
  });

  it('rejects webhook URLs that only share the Discord prefix', () => {
    expect(DiscordNotifier.validate('webhookUrl', 'https://discord.com/api/webhooks/1197999215838773279/token/extra')).toBe(false);

    expect(DiscordNotifier.validate('webhookUrl', 'https://discord.com/api/webhooks/1197999215838773279/token?wait=true')).toBe(false);

    expect(DiscordNotifier.validate('webhookUrl', 'https://discord.com/api/webhooks/1197999215838773279')).toBe(false);

    expect(DiscordNotifier.validate('webhookUrl', 'https://discord.com/api/webhooks/123/token')).toBe(false);

    return;
  });

  return;
});
