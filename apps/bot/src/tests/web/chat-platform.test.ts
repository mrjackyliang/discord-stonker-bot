import {
  describe,
  expect,
  it,
} from 'vitest';

import { chatPlatformWebhookPlaceholderUrl } from '../../web/chat-platform.js';
import { findNotificationService } from '../../web/notification-services.js';

describe('chat platform console helper', () => {
  it('keeps the Discord webhook placeholder text', () => {
    expect(chatPlatformWebhookPlaceholderUrl).toBe('https://discord.com/api/webhooks/…');

    expect(findNotificationService('discord')['fields']).toMatchObject([{
      key: 'webhookUrl',
      placeholder: 'e.g. https://discord.com/api/webhooks/…',
    }]);

    return;
  });

  return;
});
