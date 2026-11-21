import type {
  Lib_ChatPlatform_Assets_AssetContentSecurityPolicySource,
  Lib_ChatPlatform_Assets_AssetUrlPattern,
  Lib_ChatPlatform_Assets_BuildGuildIconUrl_GuildIdentifier,
  Lib_ChatPlatform_Assets_BuildGuildIconUrl_IconHash,
  Lib_ChatPlatform_Assets_BuildGuildIconUrl_Returns,
  Lib_ChatPlatform_Assets_BuildGuildIconUrl_Size,
} from '../../types/lib/chat-platform/assets.d.ts';

/**
 * Assets - Chat Platform Asset Content Security Policy Source.
 *
 * Names the provider host from which project pages display chat assets.
 * Routes can admit it without knowing which chat platform supplies assets.
 *
 * @since 4.2.1
 */
export const chatPlatformAssetContentSecurityPolicySource: Lib_ChatPlatform_Assets_AssetContentSecurityPolicySource = 'https://cdn.discordapp.com';

/**
 * Assets - Chat Platform Asset URL Pattern.
 *
 * Supplies the provider-owned asset pattern used by configured URL exclusions.
 * Audit features consume the text without importing provider details.
 *
 * @since 4.2.1
 */
export const chatPlatformAssetUrlPattern: Lib_ChatPlatform_Assets_AssetUrlPattern = '^https://cdn\\.discordapp\\.com/';

/**
 * Assets - Build Chat Platform Guild Icon URL.
 *
 * Builds a static first-frame guild icon URL, or null when no icon exists.
 * Provider path and query conventions remain inside the adapter boundary.
 *
 * @param {Lib_ChatPlatform_Assets_BuildGuildIconUrl_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ChatPlatform_Assets_BuildGuildIconUrl_IconHash}        iconHash        - Icon hash.
 * @param {Lib_ChatPlatform_Assets_BuildGuildIconUrl_Size}            size            - Size.
 *
 * @returns {Lib_ChatPlatform_Assets_BuildGuildIconUrl_Returns}
 *
 * @since 4.2.1
 */
export function buildChatPlatformGuildIconUrl(
  guildIdentifier: Lib_ChatPlatform_Assets_BuildGuildIconUrl_GuildIdentifier,
  iconHash: Lib_ChatPlatform_Assets_BuildGuildIconUrl_IconHash,
  size: Lib_ChatPlatform_Assets_BuildGuildIconUrl_Size,
): Lib_ChatPlatform_Assets_BuildGuildIconUrl_Returns {
  if (
    iconHash === undefined
    || iconHash === null
    || iconHash === ''
  ) {
    return null;
  }

  return `${chatPlatformAssetContentSecurityPolicySource}/icons/${encodeURIComponent(guildIdentifier)}/${encodeURIComponent(iconHash)}.png?size=${size}`;
}
