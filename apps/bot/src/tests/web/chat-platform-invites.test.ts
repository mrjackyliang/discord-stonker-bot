import {
  describe,
  expect,
  it,
} from 'vitest';

import { isChatPlatformInviteUrl } from '../../web/chat-platform-invites.js';

describe('chat platform invite links', () => {
  it('accepts secure links on the Discord invite hosts', () => {
    expect(isChatPlatformInviteUrl('https://discord.gg/lounge')).toBe(true);

    expect(isChatPlatformInviteUrl('https://discord.com/invite/lounge')).toBe(true);

    return;
  });

  it('rejects other hosts, insecure links, and values that are not URLs', () => {
    expect(isChatPlatformInviteUrl('http://discord.gg/lounge')).toBe(false);

    expect(isChatPlatformInviteUrl('https://discord.gg.example.com/lounge')).toBe(false);

    expect(isChatPlatformInviteUrl('https://example.com/lounge')).toBe(false);

    expect(isChatPlatformInviteUrl('not a url')).toBe(false);

    return;
  });

  return;
});
