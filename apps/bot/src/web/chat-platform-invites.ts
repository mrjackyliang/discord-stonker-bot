import type {
  Web_ChatPlatformInvites_InviteHostnames,
  Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Returns,
  Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Url,
  Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Value,
} from '@/types/web/chat-platform-invites.d.ts';

// The chat platform's invite link hosts, kept here so the invite page never spells
// out the provider's addresses itself.

/**
 * Chat Platform Invites - Invite Hostnames.
 *
 * Lists the Discord hosts that serve invite links the invite page may open.
 * The invite URL check reads it instead of naming the provider hosts inline.
 *
 * @since 4.2.1
 */
const inviteHostnames: Web_ChatPlatformInvites_InviteHostnames = [
  'discord.gg',
  'discord.com',
];

// isChatPlatformInviteUrl accepts only the chat platform's own invite links before
// the page navigates.

/**
 * Chat Platform Invites - Is Chat Platform Invite URL.
 *
 * Checks that a join response points at a secure chat platform invite link.
 * The invite page calls it before it sends the visitor to the provider.
 *
 * @param {Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Value} value - Value.
 *
 * @returns {Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Returns}
 *
 * @since 4.2.1
 */
export const isChatPlatformInviteUrl = (value: Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Value): Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Returns => {
  try {
    const url: Web_ChatPlatformInvites_IsChatPlatformInviteUrl_Url = new URL(value);

    return url.protocol === 'https:' && inviteHostnames.includes(url.hostname) === true;
  } catch {
    return false;
  }
};
