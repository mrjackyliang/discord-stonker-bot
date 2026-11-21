import { LIB_REGEX_PATTERN_DISCORD_WEBHOOK_PATH } from '../regex.js';

import type {
  Lib_ChatPlatform_Urls_BuildAddBotUrl_ApplicationIdentifier,
  Lib_ChatPlatform_Urls_BuildAddBotUrl_Returns,
  Lib_ChatPlatform_Urls_BuildInviteUrl_Code,
  Lib_ChatPlatform_Urls_BuildInviteUrl_Returns,
  Lib_ChatPlatform_Urls_IsWebhookUrl_ParsedUrl,
  Lib_ChatPlatform_Urls_IsWebhookUrl_PathPattern,
  Lib_ChatPlatform_Urls_IsWebhookUrl_Returns,
  Lib_ChatPlatform_Urls_IsWebhookUrl_Value,
  Lib_ChatPlatform_Urls_WebhookHostnames,
  Lib_ChatPlatform_Urls_WebhookUrlPrefix,
} from '../../types/lib/chat-platform/urls.d.ts';

/**
 * URLs - Chat Platform Webhook URL Prefix.
 *
 * Names the canonical provider webhook URL prefix shown in validation wording.
 * Features and notifiers quote it without knowing which platform hosts webhooks.
 *
 * @since 4.2.1
 */
export const chatPlatformWebhookUrlPrefix: Lib_ChatPlatform_Urls_WebhookUrlPrefix = 'https://discord.com/api/webhooks/';

/**
 * URLs - Webhook Hostnames.
 *
 * Lists the current and retired provider hosts that serve webhook URLs.
 * Saved webhook URLs on the retired host keep passing the one webhook rule.
 *
 * @since 4.2.1
 */
const webhookHostnames: Lib_ChatPlatform_Urls_WebhookHostnames = [
  'discord.com',
  'discordapp.com',
];

/**
 * URLs - Build Chat Platform Add Bot URL.
 *
 * Builds the provider authorization link that adds the bot to a server with
 * its application commands. Scope and integration conventions stay here.
 *
 * @param {Lib_ChatPlatform_Urls_BuildAddBotUrl_ApplicationIdentifier} applicationIdentifier - Application identifier.
 *
 * @returns {Lib_ChatPlatform_Urls_BuildAddBotUrl_Returns}
 *
 * @since 4.2.1
 */
export function buildChatPlatformAddBotUrl(
  applicationIdentifier: Lib_ChatPlatform_Urls_BuildAddBotUrl_ApplicationIdentifier,
): Lib_ChatPlatform_Urls_BuildAddBotUrl_Returns {
  return `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(applicationIdentifier)}&integration_type=0&scope=bot%20applications.commands`;
}

/**
 * URLs - Build Chat Platform Invite URL.
 *
 * Builds the public provider link for one created invite code.
 * Invite pages redirect visitors without knowing the provider host.
 *
 * @param {Lib_ChatPlatform_Urls_BuildInviteUrl_Code} code - Code.
 *
 * @returns {Lib_ChatPlatform_Urls_BuildInviteUrl_Returns}
 *
 * @since 4.2.1
 */
export function buildChatPlatformInviteUrl(
  code: Lib_ChatPlatform_Urls_BuildInviteUrl_Code,
): Lib_ChatPlatform_Urls_BuildInviteUrl_Returns {
  return `https://discord.gg/${encodeURIComponent(code)}`;
}

/**
 * URLs - Is Chat Platform Webhook URL.
 *
 * Validates provider webhook URLs for message routing and notifiers alike.
 * Accepts the current and retired hosts, and rejects userinfo, ports,
 * queries, fragments, and any path beyond the webhook identifier and token.
 *
 * @param {Lib_ChatPlatform_Urls_IsWebhookUrl_Value} value - Value.
 *
 * @returns {Lib_ChatPlatform_Urls_IsWebhookUrl_Returns}
 *
 * @since 4.2.1
 */
export function isChatPlatformWebhookUrl(value: Lib_ChatPlatform_Urls_IsWebhookUrl_Value): Lib_ChatPlatform_Urls_IsWebhookUrl_Returns {
  try {
    const parsedUrl: Lib_ChatPlatform_Urls_IsWebhookUrl_ParsedUrl = new URL(value);
    const pathPattern: Lib_ChatPlatform_Urls_IsWebhookUrl_PathPattern = new RegExp(
      LIB_REGEX_PATTERN_DISCORD_WEBHOOK_PATH,
      'u',
    );

    return parsedUrl['protocol'] === 'https:'
      && webhookHostnames.includes(parsedUrl['hostname']) === true
      && parsedUrl['port'] === ''
      && parsedUrl['username'] === ''
      && parsedUrl['password'] === ''
      && parsedUrl['search'] === ''
      && parsedUrl['hash'] === ''
      && pathPattern.test(parsedUrl['pathname']) === true;
  } catch {
    return false;
  }
}
