import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  buildChatPlatformAddBotUrl,
  buildChatPlatformInviteUrl,
  chatPlatformWebhookUrlPrefix,
  isChatPlatformWebhookUrl,
} from '../../../lib/chat-platform/index.js';
import { Runner as DiscordNotifier } from '../../../lib/notifiers/discord.js';

import type {
  Tests_Lib_ChatPlatform_Urls_RejectedUrls,
  Tests_Lib_ChatPlatform_Urls_WebhookUrl,
} from '../../../types/tests/lib/chat-platform/urls.test.d.ts';

/**
 * URLs - Chat Platform URL Boundary.
 *
 * Verifies invite, authorization, and webhook URL conventions stay unchanged.
 * Every value is local and no provider endpoint is contacted.
 *
 * @since 4.2.1
 */
describe('chat platform URL boundary', () => {
  it('builds encoded invite URLs', () => {
    expect(buildChatPlatformInviteUrl('abc123')).toBe('https://discord.gg/abc123');

    expect(buildChatPlatformInviteUrl('a/b c')).toBe('https://discord.gg/a%2Fb%20c');

    return;
  });

  it('builds the add-bot authorization URL', () => {
    expect(buildChatPlatformAddBotUrl('1197999215838773279')).toBe('https://discord.com/oauth2/authorize?client_id=1197999215838773279&integration_type=0&scope=bot%20applications.commands');

    expect(buildChatPlatformAddBotUrl('id&scope=x')).toBe('https://discord.com/oauth2/authorize?client_id=id%26scope%3Dx&integration_type=0&scope=bot%20applications.commands');

    return;
  });

  it('accepts only full-shape webhook URLs on the current and legacy hosts', () => {
    const webhookUrl: Tests_Lib_ChatPlatform_Urls_WebhookUrl = 'https://discord.com/api/webhooks/1197999215838773279/example-token';
    const legacyWebhookUrl: Tests_Lib_ChatPlatform_Urls_WebhookUrl = 'https://discordapp.com/api/webhooks/1197999215838773279/example-token';
    const rejectedUrls: Tests_Lib_ChatPlatform_Urls_RejectedUrls = [
      'https://discord.com.evil.example/api/webhooks/1197999215838773279/example-token',
      'https://discordapp.com.evil.example/api/webhooks/1197999215838773279/example-token',
      'https://example.com/api/webhooks/1197999215838773279/example-token',
      'https://discord.com/api/webhooks/1197999215838773279/example-token?wait=true',
      'https://discord.com/api/webhooks/1197999215838773279/example-token#fragment',
      'https://discord.com:8443/api/webhooks/1197999215838773279/example-token',
      'https://user:pass@discord.com/api/webhooks/1197999215838773279/example-token',
      'http://discord.com/api/webhooks/1197999215838773279/example-token',
      'http://discordapp.com/api/webhooks/1197999215838773279/example-token',
      'https://discord.com/api/webhooks/123/example-token',
      'https://discord.com/api/webhooks/1197999215838773279/example-token/extra',
      'https://discord.com/api/webhooks/1197999215838773279',
      'not a url',
    ];

    expect(chatPlatformWebhookUrlPrefix).toBe('https://discord.com/api/webhooks/');

    expect(isChatPlatformWebhookUrl(webhookUrl)).toBe(true);

    expect(isChatPlatformWebhookUrl(`${webhookUrl}/`)).toBe(true);

    expect(isChatPlatformWebhookUrl(legacyWebhookUrl)).toBe(true);

    for (const rejectedUrl of rejectedUrls) {
      expect(isChatPlatformWebhookUrl(rejectedUrl)).toBe(false);
    }

    return;
  });

  it('keeps the Discord notifier wording and applies the full-shape rule', () => {
    const rejectedUrls: Tests_Lib_ChatPlatform_Urls_RejectedUrls = [
      'https://example.com/api/webhooks/1197999215838773279/example-token',
      'https://discord.com/api/webhooks/1197999215838773279/example-token/extra',
      'https://discord.com/api/webhooks/1197999215838773279/example-token?wait=true',
      'https://discord.com/api/webhooks/1197999215838773279',
      'https://discord.com/api/webhooks/1/token',
    ];

    expect(DiscordNotifier['definition']['fields']).toMatchObject([{
      invalid: 'Use a Discord webhook URL. It starts with https://discord.com/api/webhooks/.',
    }]);

    expect(DiscordNotifier.validate('webhookUrl', 'https://discord.com/api/webhooks/1197999215838773279/example-token')).toBe(true);

    expect(DiscordNotifier.validate('webhookUrl', 'https://discordapp.com/api/webhooks/1197999215838773279/example-token')).toBe(true);

    for (const rejectedUrl of rejectedUrls) {
      expect(DiscordNotifier.validate('webhookUrl', rejectedUrl)).toBe(false);
    }

    expect(DiscordNotifier.validate('other', 'anything')).toBe(true);

    return;
  });

  return;
});
