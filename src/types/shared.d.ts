import { Snowflake } from 'discord.js';

/**
 * Config channel.
 *
 * @since 1.0.0
 */
export type ConfigChannelDescription = string | undefined;

export type ConfigChannelChannelId = Snowflake | undefined;

export type ConfigChannel = {
  description: ConfigChannelDescription;
  'channel-id': ConfigChannelChannelId;
};

/**
 * Config guild.
 *
 * @since 1.0.0
 */
export type ConfigGuildDescription = string | undefined;

export type ConfigGuildGuildId = Snowflake | undefined;

export type ConfigGuild = {
  description: ConfigGuildDescription;
  'guild-id': ConfigGuildGuildId;
};

/**
 * Config regex.
 *
 * @since 1.0.0
 */
export type ConfigRegexDescription = string | undefined;

export type ConfigRegexPattern = string | undefined;

export type ConfigRegexFlags = string | undefined;

export type ConfigRegex = {
  description: ConfigRegexDescription;
  pattern: ConfigRegexPattern;
  flags: ConfigRegexFlags;
};

/**
 * Config replacement.
 *
 * @since 1.0.0
 */
export type ConfigReplacementDescription = string | undefined;

export type ConfigReplacementPattern = string | undefined;

export type ConfigReplacementFlags = string | undefined;

export type ConfigReplacementReplaceWith = string | undefined;

export type ConfigReplacement = {
  description: ConfigReplacementDescription;
  pattern: ConfigReplacementPattern;
  flags: ConfigReplacementFlags;
  'replace-with': ConfigReplacementReplaceWith;
};

/**
 * Config role.
 *
 * @since 1.0.0
 */
export type ConfigRoleDescription = string | undefined;

export type ConfigRoleRoleId = Snowflake | undefined;

export type ConfigRole = {
  description: ConfigRoleDescription;
  'role-id': ConfigRoleRoleId;
};

/**
 * Config thread.
 *
 * @since 1.0.0
 */
export type ConfigThreadDescription = string | undefined;

export type ConfigThreadThreadId = Snowflake | undefined;

export type ConfigThread = {
  description: ConfigThreadDescription;
  'thread-id': ConfigThreadThreadId;
};

/**
 * Config user.
 *
 * @since 1.0.0
 */
export type ConfigUserDescription = string | undefined;

export type ConfigUserUserId = Snowflake | undefined;

export type ConfigUser = {
  description: ConfigUserDescription;
  'user-id': ConfigUserUserId;
};

/**
 * Config webhook.
 *
 * @since 1.0.0
 */
export type ConfigWebhookDescription = string | undefined;

export type ConfigWebhookWebhookUrl = `https://discord.com/api/webhooks/${string}/${string}` | undefined;

export type ConfigWebhook = {
  description: ConfigWebhookDescription;
  'webhook-url': ConfigWebhookWebhookUrl;
};

/**
 * Credential-like.
 *
 * @since 1.0.0
 */
export type CredentialLike = string;

/**
 * Embed status.
 *
 * @since 1.0.0
 */
export type EmbedStatus = 'complete' | 'fail' | 'in-progress';

/**
 * Log level.
 *
 * @since 1.0.0
 */
export type LogLevel = 10 | 20 | 30 | 40;

/**
 * Time zone.
 *
 * @since 1.0.0
 */
export type TimeZone = string;

/**
 * Track messages.
 *
 * @since 1.0.0
 */
export type TrackedMessageUrl = string;

export type TrackedMessageContent = string;

export type TrackedMessageTimestamp = number;

export type TrackedMessage = {
  url: TrackedMessageUrl;
  content: TrackedMessageContent;
  timestamp: TrackedMessageTimestamp;
};

export type TrackedMessages = TrackedMessage[];

/**
 * Track routes.
 *
 * @since 1.0.0
 */
export type TrackedRoutePath = string;

export type TrackedRouteMethod = string;

export type TrackedRoute = {
  path: TrackedRoutePath;
  method: TrackedRouteMethod;
};

export type TrackedRoutes = TrackedRoute[];
