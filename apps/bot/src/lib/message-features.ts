import { randomInt } from 'node:crypto';

import {
  EmbedBuilder,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { z } from 'zod';

import { timeFeatureHandler } from './debug-timing.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_MODERATION_COMBINING_MARKS,
  LIB_REGEX_PATTERN_MODERATION_SEPARATORS,
  LIB_REGEX_PATTERN_WHITESPACE,
} from './regex.js';

import type {
  Lib_MessageFeatures_CompileAffiliateCleanup_Configuration,
  Lib_MessageFeatures_CompileAffiliateCleanup_Parsed,
  Lib_MessageFeatures_CompileAffiliateCleanup_Platforms,
  Lib_MessageFeatures_CompileAffiliateCleanup_Returns,
  Lib_MessageFeatures_CompileAutoReplies_Configuration,
  Lib_MessageFeatures_CompileAutoReplies_Parsed,
  Lib_MessageFeatures_CompileAutoReplies_Returns,
  Lib_MessageFeatures_CompileRegexRules_Configuration,
  Lib_MessageFeatures_CompileRegexRules_Parsed,
  Lib_MessageFeatures_CompileRegexRules_Returns,
  Lib_MessageFeatures_CompileSuspiciousWords_Categories,
  Lib_MessageFeatures_CompileSuspiciousWords_Configuration,
  Lib_MessageFeatures_CompileSuspiciousWords_Parsed,
  Lib_MessageFeatures_CompileSuspiciousWords_Returns,
  Lib_MessageFeatures_CreateMessageOptions_Payload,
  Lib_MessageFeatures_CreateMessageOptions_Returns,
  Lib_MessageFeatures_CreateRegistration_Returns,
  Lib_MessageFeatures_CreateRegistration_Runtime,
  Lib_MessageFeatures_FormatConfigurationError_Error,
  Lib_MessageFeatures_FormatConfigurationError_Messages,
  Lib_MessageFeatures_FormatConfigurationError_Returns,
  Lib_MessageFeatures_GetChannelIdentifier_Reference,
  Lib_MessageFeatures_GetChannelIdentifier_Returns,
  Lib_MessageFeatures_GetChannelIdentifiers_References,
  Lib_MessageFeatures_GetChannelIdentifiers_Returns,
  Lib_MessageFeatures_GetEnabledFeature_FeatureKey,
  Lib_MessageFeatures_GetEnabledFeature_Features,
  Lib_MessageFeatures_GetEnabledFeature_RawFeature,
  Lib_MessageFeatures_GetEnabledFeature_Returns,
  Lib_MessageFeatures_GetEnabledFeature_Settings,
  Lib_MessageFeatures_GetRoleIdentifiers_References,
  Lib_MessageFeatures_GetRoleIdentifiers_Returns,
  Lib_MessageFeatures_HandleAffiliateCleanup_Deleted,
  Lib_MessageFeatures_HandleAffiliateCleanup_DetectedPlatforms,
  Lib_MessageFeatures_HandleAffiliateCleanup_Message,
  Lib_MessageFeatures_HandleAffiliateCleanup_Returns,
  Lib_MessageFeatures_HandleAffiliateCleanup_Settings,
  Lib_MessageFeatures_HandleAutoReplies_ChannelMatches,
  Lib_MessageFeatures_HandleAutoReplies_Matches,
  Lib_MessageFeatures_HandleAutoReplies_Message,
  Lib_MessageFeatures_HandleAutoReplies_Payload,
  Lib_MessageFeatures_HandleAutoReplies_PayloadIndex,
  Lib_MessageFeatures_HandleAutoReplies_Returns,
  Lib_MessageFeatures_HandleAutoReplies_Rules,
  Lib_MessageFeatures_HandleAutoReplies_SendOptions,
  Lib_MessageFeatures_HandleMessage_Deleted,
  Lib_MessageFeatures_HandleMessage_GuildIdentifier,
  Lib_MessageFeatures_HandleMessage_Message,
  Lib_MessageFeatures_HandleMessage_Returns,
  Lib_MessageFeatures_HandleMessage_RunAutoReplies,
  Lib_MessageFeatures_HandleMessage_Runtime,
  Lib_MessageFeatures_HandleMessageUpdate_GuildIdentifier,
  Lib_MessageFeatures_HandleMessageUpdate_NewMessage,
  Lib_MessageFeatures_HandleMessageUpdate_OldMessage,
  Lib_MessageFeatures_HandleMessageUpdate_Returns,
  Lib_MessageFeatures_HandleMessageUpdate_Runtime,
  Lib_MessageFeatures_HandleRegexRules_Deleted,
  Lib_MessageFeatures_HandleRegexRules_Matches,
  Lib_MessageFeatures_HandleRegexRules_Message,
  Lib_MessageFeatures_HandleRegexRules_Returns,
  Lib_MessageFeatures_HandleRegexRules_Rules,
  Lib_MessageFeatures_HandleSuspiciousWords_CleanedContent,
  Lib_MessageFeatures_HandleSuspiciousWords_DetectedCategories,
  Lib_MessageFeatures_HandleSuspiciousWords_Message,
  Lib_MessageFeatures_HandleSuspiciousWords_PaddedContent,
  Lib_MessageFeatures_HandleSuspiciousWords_Returns,
  Lib_MessageFeatures_HandleSuspiciousWords_Settings,
  Lib_MessageFeatures_HasExcludedRole_Member,
  Lib_MessageFeatures_HasExcludedRole_Message,
  Lib_MessageFeatures_HasExcludedRole_Returns,
  Lib_MessageFeatures_HasExcludedRole_RoleIdentifiers,
  Lib_MessageFeatures_IsRecord_TypeGuard,
  Lib_MessageFeatures_IsRecord_Value,
  Lib_MessageFeatures_MatchesRegularExpression_Content,
  Lib_MessageFeatures_MatchesRegularExpression_RegularExpression,
  Lib_MessageFeatures_MatchesRegularExpression_Returns,
  Lib_MessageFeatures_NormalizeModerationContent_CombiningMarkPattern,
  Lib_MessageFeatures_NormalizeModerationContent_Content,
  Lib_MessageFeatures_NormalizeModerationContent_Returns,
  Lib_MessageFeatures_NormalizeModerationContent_SeparatorPattern,
  Lib_MessageFeatures_NormalizeModerationContent_WhitespacePattern,
  Lib_MessageFeatures_PrepareMessageFeatures_ActiveFeatureKeys,
  Lib_MessageFeatures_PrepareMessageFeatures_AffiliateFeature,
  Lib_MessageFeatures_PrepareMessageFeatures_AutoReplyFeature,
  Lib_MessageFeatures_PrepareMessageFeatures_ConfigurationErrors,
  Lib_MessageFeatures_PrepareMessageFeatures_Intents,
  Lib_MessageFeatures_PrepareMessageFeatures_RegexFeature,
  Lib_MessageFeatures_PrepareMessageFeatures_Returns,
  Lib_MessageFeatures_PrepareMessageFeatures_Runtime,
  Lib_MessageFeatures_PrepareMessageFeatures_Settings,
  Lib_MessageFeatures_PrepareMessageFeatures_SuspiciousWordsFeature,
  Lib_MessageFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_MessageFeatures_RecordConfigurationError_Error,
  Lib_MessageFeatures_RecordConfigurationError_FeatureKey,
  Lib_MessageFeatures_RecordConfigurationError_Message,
  Lib_MessageFeatures_RecordConfigurationError_Returns,
  Lib_MessageFeatures_SendModerationAlert_Channel,
  Lib_MessageFeatures_SendModerationAlert_ChannelIdentifier,
  Lib_MessageFeatures_SendModerationAlert_Description,
  Lib_MessageFeatures_SendModerationAlert_Details,
  Lib_MessageFeatures_SendModerationAlert_Message,
  Lib_MessageFeatures_SendModerationAlert_Returns,
  Lib_MessageFeatures_SendModerationAlert_Title,
  Lib_MessageFeatures_TruncateContent_Content,
  Lib_MessageFeatures_TruncateContent_MaximumCharacters,
  Lib_MessageFeatures_TruncateContent_Returns,
} from '../types/lib/message-features.d.ts';

/**
 * Message Features - Affiliate Cleanup Schema.
 *
 * Accepts the archived affiliate format while bounding every operator value.
 * Unknown legacy metadata is stripped before the runtime receives settings.
 *
 * @since 4.0.0
 */
export const affiliateCleanupSchema = z.object({
  'channel': z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }).optional(),
  'direct-message-payload': z.object({
    content: z.string().trim().min(1).max(2_000),
  }).optional(),
  'excluded-roles': z.array(z.object({
    'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).min(1).max(100).optional(),
  'platforms': z.array(z.object({
    platform: z.string().trim().min(1).max(100),
    regex: z.object({
      flags: z.string().max(16).optional(),
      pattern: z.string().min(1).max(512),
    }).superRefine((value, context) => {
      try {
        RegExp(value['pattern'], value['flags']);
      } catch {
        context.addIssue({
          code: 'custom',
          message: 'Regular expression pattern or flags are invalid.',
        });
      }

      return;
    }),
  })).min(1).max(100),
});

/**
 * Message Features - Auto Replies Schema.
 *
 * Preserves channel filters, regular expressions, and randomized text replies.
 * Payloads are narrowed to content so imports cannot inject unsafe mentions.
 *
 * @since 4.0.0
 */
export const autoRepliesSchema = z.array(z.object({
  channels: z.array(z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).min(1).max(100).optional(),
  name: z.string().trim().min(1).max(100),
  payloads: z.array(z.object({
    content: z.string().trim().min(1).max(2_000),
  })).min(1).max(25),
  regex: z.object({
    flags: z.string().max(16).optional(),
    pattern: z.string().min(1).max(512),
  }).superRefine((value, context) => {
    try {
      RegExp(value['pattern'], value['flags']);
    } catch {
      context.addIssue({
        code: 'custom',
        message: 'Regular expression pattern or flags are invalid.',
      });
    }

    return;
  }),
  reply: z.boolean().optional(),
})).min(1).max(100);

/**
 * Message Features - Regex Rules Schema.
 *
 * Validates destructive message rules before event handlers are registered.
 * Bounded text-only notices replace unrestricted legacy message payloads.
 *
 * @since 4.0.0
 */
export const regexRulesSchema = z.array(z.object({
  'channel': z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }).optional(),
  'direct-message-payload': z.object({
    content: z.string().trim().min(1).max(2_000),
  }).optional(),
  'excluded-roles': z.array(z.object({
    'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).min(1).max(100).optional(),
  'match': z.boolean(),
  'name': z.string().trim().min(1).max(100),
  'regex': z.object({
    flags: z.string().max(16).optional(),
    pattern: z.string().min(1).max(512),
  }).superRefine((value, context) => {
    try {
      RegExp(value['pattern'], value['flags']);
    } catch {
      context.addIssue({
        code: 'custom',
        message: 'Regular expression pattern or flags are invalid.',
      });
    }

    return;
  }),
})).min(1).max(100);

/**
 * Message Features - Suspicious Words Schema.
 *
 * Validates normalized phrase groups and their moderator destination.
 * Bounded collections prevent an imported file from exhausting the process.
 *
 * @since 4.0.0
 */
export const suspiciousWordsSchema = z.object({
  categories: z.array(z.object({
    category: z.string().trim().min(1).max(100),
    words: z.array(z.string().trim().min(1).max(200)).min(1).max(250),
  })).min(1).max(100),
  channel: z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
});

/**
 * Message Features - Compile Affiliate Cleanup.
 *
 * Converts validated legacy settings into immutable runtime matchers.
 * Regular expressions are constructed once instead of for every message.
 *
 * @param {Lib_MessageFeatures_CompileAffiliateCleanup_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_CompileAffiliateCleanup_Returns}
 *
 * @since 4.0.0
 */
function compileAffiliateCleanup(
  configuration: Lib_MessageFeatures_CompileAffiliateCleanup_Configuration,
): Lib_MessageFeatures_CompileAffiliateCleanup_Returns {
  const parsed: Lib_MessageFeatures_CompileAffiliateCleanup_Parsed = affiliateCleanupSchema.parse(configuration);
  const platforms: Lib_MessageFeatures_CompileAffiliateCleanup_Platforms = parsed['platforms'].map((platform) => ({
    platform: platform['platform'],
    regularExpression: new RegExp(platform['regex']['pattern'], platform['regex']['flags']),
  }));

  return {
    channelIdentifier: getChannelIdentifier(parsed['channel']),
    directMessagePayload: parsed['direct-message-payload'],
    excludedRoleIdentifiers: getRoleIdentifiers(parsed['excluded-roles']),
    platforms,
  };
}

/**
 * Message Features - Compile Auto Replies.
 *
 * Converts legacy reply entries into precompiled, bounded runtime rules.
 * Channel and mention safety is enforced independently at send time.
 *
 * @param {Lib_MessageFeatures_CompileAutoReplies_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_CompileAutoReplies_Returns}
 *
 * @since 4.0.0
 */
function compileAutoReplies(
  configuration: Lib_MessageFeatures_CompileAutoReplies_Configuration,
): Lib_MessageFeatures_CompileAutoReplies_Returns {
  const parsed: Lib_MessageFeatures_CompileAutoReplies_Parsed = autoRepliesSchema.parse(configuration);

  return parsed.map((rule) => ({
    channelIdentifiers: getChannelIdentifiers(rule['channels']),
    name: rule['name'],
    payloads: rule['payloads'],
    regularExpression: new RegExp(rule['regex']['pattern'], rule['regex']['flags']),
    reply: rule['reply'] === true,
  }));
}

/**
 * Message Features - Compile Regex Rules.
 *
 * Converts imported moderation rules into validated runtime matchers.
 * Invalid patterns disable only their owning feature during preparation.
 *
 * @param {Lib_MessageFeatures_CompileRegexRules_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_CompileRegexRules_Returns}
 *
 * @since 4.0.0
 */
function compileRegexRules(
  configuration: Lib_MessageFeatures_CompileRegexRules_Configuration,
): Lib_MessageFeatures_CompileRegexRules_Returns {
  const parsed: Lib_MessageFeatures_CompileRegexRules_Parsed = regexRulesSchema.parse(configuration);

  return parsed.map((rule) => ({
    channelIdentifier: getChannelIdentifier(rule['channel']),
    directMessagePayload: rule['direct-message-payload'],
    excludedRoleIdentifiers: getRoleIdentifiers(rule['excluded-roles']),
    match: rule['match'],
    name: rule['name'],
    regularExpression: new RegExp(rule['regex']['pattern'], rule['regex']['flags']),
  }));
}

/**
 * Message Features - Compile Suspicious Words.
 *
 * Normalizes configured phrases once so each message performs cheap lookups.
 * Categories that normalize to empty values fail closed during preparation.
 *
 * @param {Lib_MessageFeatures_CompileSuspiciousWords_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_CompileSuspiciousWords_Returns}
 *
 * @since 4.0.0
 */
function compileSuspiciousWords(
  configuration: Lib_MessageFeatures_CompileSuspiciousWords_Configuration,
): Lib_MessageFeatures_CompileSuspiciousWords_Returns {
  const parsed: Lib_MessageFeatures_CompileSuspiciousWords_Parsed = suspiciousWordsSchema.parse(configuration);
  const categories: Lib_MessageFeatures_CompileSuspiciousWords_Categories = parsed['categories'].map((category) => {
    return {
      category: category['category'],
      words: category['words']
        .map((word) => normalizeModerationContent(word))
        .filter((word) => word.length > 0),
    };
  });

  if (categories.some((category) => category['words'].length === 0) === true) {
    throw new Error('Suspicious-word categories must contain searchable letters or numbers.');
  }

  return {
    categories,
    channelIdentifier: parsed['channel']['channel-id'],
  };
}

/**
 * Message Features - Create Message Options.
 *
 * Builds outbound payloads from the intentionally narrow imported shape.
 * All Discord mention parsing is disabled for automatic bot responses.
 *
 * @param {Lib_MessageFeatures_CreateMessageOptions_Payload} payload - Payload.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_CreateMessageOptions_Returns}
 *
 * @since 4.0.0
 */
function createMessageOptions(
  payload: Lib_MessageFeatures_CreateMessageOptions_Payload,
): Lib_MessageFeatures_CreateMessageOptions_Returns {
  return {
    allowedMentions: {
      parse: [],
      repliedUser: false,
    },
    content: payload['content'],
  };
}

/**
 * Message Features - Create Registration.
 *
 * Captures one immutable runtime configuration for a Gateway generation.
 * Destroying the Discord client removes both listeners during reconciliation.
 *
 * @param {Lib_MessageFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_MessageFeatures_CreateRegistration_Runtime,
): Lib_MessageFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    client.on(Events.MessageCreate, (message) => {
      void timeFeatureHandler('message', Events.MessageCreate, guildIdentifier, () => handleMessage(message, guildIdentifier, runtime, true)).catch((error) => {
        writeLog('error', 'bot', 'message_feature_dispatch_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
      void timeFeatureHandler('message', Events.MessageUpdate, guildIdentifier, () => handleMessageUpdate(oldMessage, newMessage, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'message_feature_update_dispatch_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    return;
  };
}

/**
 * Message Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without echoing submitted values.
 * Unexpected failures use the shared bounded error-message conversion.
 *
 * @param {Lib_MessageFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_MessageFeatures_FormatConfigurationError_Error,
): Lib_MessageFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_MessageFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
      if (issue['path'].length === 0) {
        return issue['message'];
      }

      return `${issue['path'].join('.')}: ${issue['message']}`;
    });

    return messages.join('; ').slice(0, 1_000);
  }

  return getErrorMessage(error).slice(0, 1_000);
}

/**
 * Message Features - Get Channel Identifier.
 *
 * Reads an optional legacy channel reference after schema validation.
 * Centralizing the lookup keeps hyphenated archive keys out of handlers.
 *
 * @param {Lib_MessageFeatures_GetChannelIdentifier_Reference} reference - Reference.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_GetChannelIdentifier_Returns}
 *
 * @since 4.0.0
 */
function getChannelIdentifier(
  reference: Lib_MessageFeatures_GetChannelIdentifier_Reference,
): Lib_MessageFeatures_GetChannelIdentifier_Returns {
  if (reference === undefined) {
    return undefined;
  }

  return reference['channel-id'];
}

/**
 * Message Features - Get Channel Identifiers.
 *
 * Flattens optional legacy channel references into runtime identifiers.
 * An empty result intentionally means that every guild channel is eligible.
 *
 * @param {Lib_MessageFeatures_GetChannelIdentifiers_References} references - References.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_GetChannelIdentifiers_Returns}
 *
 * @since 4.0.0
 */
function getChannelIdentifiers(
  references: Lib_MessageFeatures_GetChannelIdentifiers_References,
): Lib_MessageFeatures_GetChannelIdentifiers_Returns {
  if (references === undefined) {
    return [];
  }

  return references.map((reference) => reference['channel-id']);
}

/**
 * Message Features - Get Enabled Feature.
 *
 * Reads one imported switch without trusting the surrounding JSON structure.
 * Disabled or absent features never request intents or register handlers.
 *
 * @param {Lib_MessageFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_MessageFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_MessageFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_MessageFeatures_GetEnabledFeature_FeatureKey,
): Lib_MessageFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_MessageFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_MessageFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_MessageFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Message Features - Get Role Identifiers.
 *
 * Flattens optional archived role references for fast member exclusion checks.
 * Empty collections mean that no member roles bypass the configured action.
 *
 * @param {Lib_MessageFeatures_GetRoleIdentifiers_References} references - References.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_GetRoleIdentifiers_Returns}
 *
 * @since 4.0.0
 */
function getRoleIdentifiers(
  references: Lib_MessageFeatures_GetRoleIdentifiers_References,
): Lib_MessageFeatures_GetRoleIdentifiers_Returns {
  if (references === undefined) {
    return [];
  }

  return references.map((reference) => reference['role-id']);
}

/**
 * Message Features - Handle Affiliate Cleanup.
 *
 * Reports and removes messages matching one or more configured affiliate rules.
 * Alert or direct-message failures do not prevent the deletion attempt.
 *
 * @param {Lib_MessageFeatures_HandleAffiliateCleanup_Message}  message  - Message.
 * @param {Lib_MessageFeatures_HandleAffiliateCleanup_Settings} settings - Settings.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HandleAffiliateCleanup_Returns}
 *
 * @since 4.0.0
 */
async function handleAffiliateCleanup(
  message: Lib_MessageFeatures_HandleAffiliateCleanup_Message,
  settings: Lib_MessageFeatures_HandleAffiliateCleanup_Settings,
): Lib_MessageFeatures_HandleAffiliateCleanup_Returns {
  if (hasExcludedRole(message, settings['excludedRoleIdentifiers']) === true) {
    return false;
  }

  const detectedPlatforms: Lib_MessageFeatures_HandleAffiliateCleanup_DetectedPlatforms = settings['platforms']
    .filter((platform) => matchesRegularExpression(platform['regularExpression'], message['content']) === true)
    .map((platform) => platform['platform']);

  if (detectedPlatforms.length === 0) {
    return false;
  }

  if (settings['channelIdentifier'] !== undefined) {
    try {
      await sendModerationAlert(
        message,
        settings['channelIdentifier'],
        'Affiliate content removed',
        [
          `Matched: ${detectedPlatforms.join(', ')}`,
          `Excerpt: ${truncateContent(message['content'], 700)}`,
        ].join('\n'),
      );
    } catch (error) {
      writeLog('error', 'bot', 'affiliate_cleanup_alert_failed', {
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
      });
    }
  }

  if (settings['directMessagePayload'] !== undefined) {
    try {
      await message['author'].send(createMessageOptions(settings['directMessagePayload']));
    } catch (error) {
      writeLog('warn', 'bot', 'affiliate_cleanup_direct_message_failed', {
        error: getErrorMessage(error),
        userIdentifier: message['author']['id'],
      });
    }
  }

  let deleted: Lib_MessageFeatures_HandleAffiliateCleanup_Deleted = false;

  try {
    await message.delete();

    deleted = true;
  } catch (error) {
    writeLog('error', 'bot', 'affiliate_cleanup_delete_failed', {
      error: getErrorMessage(error),
      messageIdentifier: message['id'],
    });
  }

  return deleted;
}

/**
 * Message Features - Handle Auto Replies.
 *
 * Sends the first configured reply whose channel and expression both match.
 * Selection stays random while automatic mentions remain disabled.
 *
 * @param {Lib_MessageFeatures_HandleAutoReplies_Message} message - Message.
 * @param {Lib_MessageFeatures_HandleAutoReplies_Rules}   rules   - Rules.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HandleAutoReplies_Returns}
 *
 * @since 4.0.0
 */
async function handleAutoReplies(
  message: Lib_MessageFeatures_HandleAutoReplies_Message,
  rules: Lib_MessageFeatures_HandleAutoReplies_Rules,
): Lib_MessageFeatures_HandleAutoReplies_Returns {
  for (const rule of rules) {
    const channelMatches: Lib_MessageFeatures_HandleAutoReplies_ChannelMatches = (
      rule['channelIdentifiers'].length === 0
      || rule['channelIdentifiers'].includes(message['channelId']) === true
    );

    if (channelMatches === false) {
      continue;
    }

    const matches: Lib_MessageFeatures_HandleAutoReplies_Matches = matchesRegularExpression(
      rule['regularExpression'],
      message['content'],
    );

    if (matches === false) {
      continue;
    }

    const payloadIndex: Lib_MessageFeatures_HandleAutoReplies_PayloadIndex = randomInt(rule['payloads'].length);
    const payload: Lib_MessageFeatures_HandleAutoReplies_Payload = rule['payloads'][payloadIndex];

    if (payload === undefined) {
      throw new Error(`Auto reply has no usable payload for rule: ${rule['name']}`);
    }

    const sendOptions: Lib_MessageFeatures_HandleAutoReplies_SendOptions = createMessageOptions(payload);

    if (rule['reply'] === true) {
      await message.reply(sendOptions);
    } else if (message['channel'].isSendable() === true) {
      await message['channel'].send(sendOptions);
    } else {
      throw new Error(`Auto reply channel is not sendable for rule: ${rule['name']}`);
    }

    writeLog('info', 'bot', 'auto_reply_sent', {
      messageIdentifier: message['id'],
      ruleName: rule['name'],
    });

    return;
  }

  return;
}

/**
 * Message Features - Handle Message.
 *
 * Runs enabled features for a human message from the configured Discord server.
 * Each feature fails independently so one integration cannot halt dispatch.
 *
 * @param {Lib_MessageFeatures_HandleMessage_Message}         message         - Message.
 * @param {Lib_MessageFeatures_HandleMessage_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_MessageFeatures_HandleMessage_Runtime}         runtime         - Runtime.
 * @param {Lib_MessageFeatures_HandleMessage_RunAutoReplies}  runAutoReplies  - Run auto replies.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HandleMessage_Returns}
 *
 * @since 4.0.0
 */
async function handleMessage(
  message: Lib_MessageFeatures_HandleMessage_Message,
  guildIdentifier: Lib_MessageFeatures_HandleMessage_GuildIdentifier,
  runtime: Lib_MessageFeatures_HandleMessage_Runtime,
  runAutoReplies: Lib_MessageFeatures_HandleMessage_RunAutoReplies,
): Lib_MessageFeatures_HandleMessage_Returns {
  if (
    message.inGuild() === false
    || message['guildId'] !== guildIdentifier
    || message['author']['bot'] === true
    || message['system'] === true
  ) {
    return;
  }

  if (message['content'].length === 0) {
    return;
  }

  if (runtime['suspiciousWords'] !== undefined) {
    try {
      await handleSuspiciousWords(message, runtime['suspiciousWords']);
    } catch (error) {
      writeLog('error', 'bot', 'suspicious_words_failed', {
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
      });
    }
  }

  let deleted: Lib_MessageFeatures_HandleMessage_Deleted = false;

  if (runtime['regexRules'].length > 0) {
    try {
      deleted = await handleRegexRules(message, runtime['regexRules']);
    } catch (error) {
      writeLog('error', 'bot', 'regex_rules_failed', {
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
      });
    }
  }

  if (deleted === false && runtime['affiliateCleanup'] !== undefined) {
    try {
      deleted = await handleAffiliateCleanup(message, runtime['affiliateCleanup']);
    } catch (error) {
      writeLog('error', 'bot', 'affiliate_cleanup_failed', {
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
      });
    }
  }

  if (
    deleted === false
    && runAutoReplies === true
    && runtime['autoReplies'].length > 0
  ) {
    try {
      await handleAutoReplies(message, runtime['autoReplies']);
    } catch (error) {
      writeLog('error', 'bot', 'auto_replies_failed', {
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
      });
    }
  }

  return;
}

/**
 * Message Features - Handle Message Update.
 *
 * Rechecks edited content for moderation features without repeating replies.
 * Discord embed-only updates are skipped when message content is unchanged.
 *
 * @param {Lib_MessageFeatures_HandleMessageUpdate_OldMessage}      oldMessage      - Old message.
 * @param {Lib_MessageFeatures_HandleMessageUpdate_NewMessage}      newMessage      - New message.
 * @param {Lib_MessageFeatures_HandleMessageUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_MessageFeatures_HandleMessageUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HandleMessageUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleMessageUpdate(
  oldMessage: Lib_MessageFeatures_HandleMessageUpdate_OldMessage,
  newMessage: Lib_MessageFeatures_HandleMessageUpdate_NewMessage,
  guildIdentifier: Lib_MessageFeatures_HandleMessageUpdate_GuildIdentifier,
  runtime: Lib_MessageFeatures_HandleMessageUpdate_Runtime,
): Lib_MessageFeatures_HandleMessageUpdate_Returns {
  if (oldMessage['content'] === newMessage['content']) {
    return;
  }

  await handleMessage(newMessage, guildIdentifier, runtime, false);

  return;
}

/**
 * Message Features - Handle Regex Rules.
 *
 * Applies the first matching destructive rule after channel and role checks.
 * A failed member notice never prevents the configured deletion attempt.
 *
 * @param {Lib_MessageFeatures_HandleRegexRules_Message} message - Message.
 * @param {Lib_MessageFeatures_HandleRegexRules_Rules}   rules   - Rules.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HandleRegexRules_Returns}
 *
 * @since 4.0.0
 */
async function handleRegexRules(
  message: Lib_MessageFeatures_HandleRegexRules_Message,
  rules: Lib_MessageFeatures_HandleRegexRules_Rules,
): Lib_MessageFeatures_HandleRegexRules_Returns {
  for (const rule of rules) {
    if (
      rule['channelIdentifier'] !== undefined
      && rule['channelIdentifier'] !== message['channelId']
    ) {
      continue;
    }

    if (hasExcludedRole(message, rule['excludedRoleIdentifiers']) === true) {
      continue;
    }

    const matches: Lib_MessageFeatures_HandleRegexRules_Matches = matchesRegularExpression(
      rule['regularExpression'],
      message['content'],
    );

    if (matches !== rule['match']) {
      continue;
    }

    if (rule['directMessagePayload'] !== undefined) {
      try {
        await message['author'].send(createMessageOptions(rule['directMessagePayload']));
      } catch (error) {
        writeLog('warn', 'bot', 'regex_rule_direct_message_failed', {
          error: getErrorMessage(error),
          ruleName: rule['name'],
          userIdentifier: message['author']['id'],
        });
      }
    }

    let deleted: Lib_MessageFeatures_HandleRegexRules_Deleted = false;

    try {
      await message.delete();

      deleted = true;
    } catch (error) {
      writeLog('error', 'bot', 'regex_rule_delete_failed', {
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
        ruleName: rule['name'],
      });
    }

    return deleted;
  }

  return false;
}

/**
 * Message Features - Handle Suspicious Words.
 *
 * Finds configured normalized phrases and sends one consolidated mod alert.
 * This observation-only feature never removes or modifies member messages.
 *
 * @param {Lib_MessageFeatures_HandleSuspiciousWords_Message}  message  - Message.
 * @param {Lib_MessageFeatures_HandleSuspiciousWords_Settings} settings - Settings.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HandleSuspiciousWords_Returns}
 *
 * @since 4.0.0
 */
async function handleSuspiciousWords(
  message: Lib_MessageFeatures_HandleSuspiciousWords_Message,
  settings: Lib_MessageFeatures_HandleSuspiciousWords_Settings,
): Lib_MessageFeatures_HandleSuspiciousWords_Returns {
  const cleanedContent: Lib_MessageFeatures_HandleSuspiciousWords_CleanedContent = normalizeModerationContent(
    message['content'],
  );
  const paddedContent: Lib_MessageFeatures_HandleSuspiciousWords_PaddedContent = ` ${cleanedContent} `;
  const detectedCategories: Lib_MessageFeatures_HandleSuspiciousWords_DetectedCategories = settings['categories']
    .filter((category) => category['words'].some((word) => paddedContent.includes(` ${word} `) === true))
    .map((category) => category['category']);

  if (detectedCategories.length === 0) {
    return;
  }

  await sendModerationAlert(
    message,
    settings['channelIdentifier'],
    'Suspicious phrase detected',
    [
      `Categories: ${detectedCategories.join(', ')}`,
      `Excerpt: ${truncateContent(message['content'], 700)}`,
    ].join('\n'),
  );

  return;
}

/**
 * Message Features - Has Excluded Role.
 *
 * Checks the message member against one feature's configured bypass roles.
 * Missing member data fails closed by granting no moderation exemption.
 *
 * @param {Lib_MessageFeatures_HasExcludedRole_Message}         message         - Message.
 * @param {Lib_MessageFeatures_HasExcludedRole_RoleIdentifiers} roleIdentifiers - Role identifiers.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_HasExcludedRole_Returns}
 *
 * @since 4.0.0
 */
function hasExcludedRole(
  message: Lib_MessageFeatures_HasExcludedRole_Message,
  roleIdentifiers: Lib_MessageFeatures_HasExcludedRole_RoleIdentifiers,
): Lib_MessageFeatures_HasExcludedRole_Returns {
  const member: Lib_MessageFeatures_HasExcludedRole_Member = message['member'];

  if (member === null) {
    return false;
  }

  return roleIdentifiers.some((roleIdentifier) => member.roles.cache.has(roleIdentifier) === true);
}

/**
 * Message Features - Is Record.
 *
 * Narrows imported JSON objects before reading feature switch properties.
 * Arrays and null are never valid configuration maps.
 *
 * @param {Lib_MessageFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_MessageFeatures_IsRecord_Value,
): value is Lib_MessageFeatures_IsRecord_TypeGuard {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}

/**
 * Message Features - Matches Regular Expression.
 *
 * Resets stateful expression indices around every message comparison.
 * Global and sticky legacy flags therefore behave consistently over time.
 *
 * @param {Lib_MessageFeatures_MatchesRegularExpression_RegularExpression} regularExpression - Regular expression.
 * @param {Lib_MessageFeatures_MatchesRegularExpression_Content}           content           - Content.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_MatchesRegularExpression_Returns}
 *
 * @since 4.0.0
 */
function matchesRegularExpression(
  regularExpression: Lib_MessageFeatures_MatchesRegularExpression_RegularExpression,
  content: Lib_MessageFeatures_MatchesRegularExpression_Content,
): Lib_MessageFeatures_MatchesRegularExpression_Returns {
  return new RegExp(regularExpression.source, regularExpression.flags).test(content);
}

/**
 * Message Features - Normalize Moderation Content.
 *
 * Canonicalizes accents, punctuation, spacing, case, and common digit swaps.
 * Both stored phrases and incoming messages pass through the same function.
 *
 * @param {Lib_MessageFeatures_NormalizeModerationContent_Content} content - Content.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_NormalizeModerationContent_Returns}
 *
 * @since 4.0.0
 */
function normalizeModerationContent(
  content: Lib_MessageFeatures_NormalizeModerationContent_Content,
): Lib_MessageFeatures_NormalizeModerationContent_Returns {
  const combiningMarkPattern: Lib_MessageFeatures_NormalizeModerationContent_CombiningMarkPattern = new RegExp(
    LIB_REGEX_PATTERN_MODERATION_COMBINING_MARKS,
    'gu',
  );
  const separatorPattern: Lib_MessageFeatures_NormalizeModerationContent_SeparatorPattern = new RegExp(
    LIB_REGEX_PATTERN_MODERATION_SEPARATORS,
    'gu',
  );
  const whitespacePattern: Lib_MessageFeatures_NormalizeModerationContent_WhitespacePattern = new RegExp(
    LIB_REGEX_PATTERN_WHITESPACE.source,
    'gu',
  );

  return content
    .normalize('NFKD')
    .replace(combiningMarkPattern, '')
    .replace(separatorPattern, ' ')
    .replaceAll('0', 'o')
    .replaceAll('1', 'l')
    .replaceAll('2', 'z')
    .replaceAll('3', 'e')
    .replaceAll('4', 'a')
    .replaceAll('5', 's')
    .replaceAll('6', 'g')
    .replaceAll('7', 't')
    .replaceAll('8', 'b')
    .replaceAll('9', 'q')
    .replace(whitespacePattern, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Message Features - Prepare Message Features.
 *
 * Compiles enabled imported modules before the Discord client is created.
 * Invalid modules stay isolated and are reported without blocking the Gateway.
 *
 * @param {Lib_MessageFeatures_PrepareMessageFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_MessageFeatures_PrepareMessageFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareMessageFeatures(
  settings: Lib_MessageFeatures_PrepareMessageFeatures_Settings,
): Lib_MessageFeatures_PrepareMessageFeatures_Returns {
  const runtime: Lib_MessageFeatures_PrepareMessageFeatures_Runtime = {
    affiliateCleanup: undefined,
    autoReplies: [],
    regexRules: [],
    suspiciousWords: undefined,
  };
  const activeFeatureKeys: Lib_MessageFeatures_PrepareMessageFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_MessageFeatures_PrepareMessageFeatures_ConfigurationErrors = [];
  const affiliateFeature: Lib_MessageFeatures_PrepareMessageFeatures_AffiliateFeature = getEnabledFeature(
    settings,
    'remove-affiliates',
  );

  if (affiliateFeature !== undefined) {
    try {
      Reflect.set(runtime, 'affiliateCleanup', compileAffiliateCleanup(affiliateFeature['configuration']));

      activeFeatureKeys.push('remove-affiliates');
    } catch (error) {
      recordConfigurationError('remove-affiliates', error, configurationErrors);
    }
  }

  const autoReplyFeature: Lib_MessageFeatures_PrepareMessageFeatures_AutoReplyFeature = getEnabledFeature(
    settings,
    'auto-replies',
  );

  if (autoReplyFeature !== undefined) {
    try {
      Reflect.set(runtime, 'autoReplies', compileAutoReplies(autoReplyFeature['configuration']));

      activeFeatureKeys.push('auto-replies');
    } catch (error) {
      recordConfigurationError('auto-replies', error, configurationErrors);
    }
  }

  const regexFeature: Lib_MessageFeatures_PrepareMessageFeatures_RegexFeature = getEnabledFeature(
    settings,
    'regex-rules',
  );

  if (regexFeature !== undefined) {
    try {
      Reflect.set(runtime, 'regexRules', compileRegexRules(regexFeature['configuration']));

      activeFeatureKeys.push('regex-rules');
    } catch (error) {
      recordConfigurationError('regex-rules', error, configurationErrors);
    }
  }

  const suspiciousWordsFeature: Lib_MessageFeatures_PrepareMessageFeatures_SuspiciousWordsFeature = getEnabledFeature(
    settings,
    'detect-suspicious-words',
  );

  if (suspiciousWordsFeature !== undefined) {
    try {
      Reflect.set(runtime, 'suspiciousWords', compileSuspiciousWords(suspiciousWordsFeature['configuration']));

      activeFeatureKeys.push('detect-suspicious-words');
    } catch (error) {
      recordConfigurationError('detect-suspicious-words', error, configurationErrors);
    }
  }

  const intents: Lib_MessageFeatures_PrepareMessageFeatures_Intents = [];

  if (activeFeatureKeys.length > 0) {
    intents.push(
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    );
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: createRegistration(runtime),
  };
}

/**
 * Message Features - Record Configuration Error.
 *
 * Adds safe panel-visible diagnostics and emits a structured startup warning.
 * The rejected module remains inactive while other valid modules continue.
 *
 * @param {Lib_MessageFeatures_RecordConfigurationError_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_MessageFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_MessageFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  featureKey: Lib_MessageFeatures_RecordConfigurationError_FeatureKey,
  error: Lib_MessageFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_MessageFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_MessageFeatures_RecordConfigurationError_Returns {
  const message: Lib_MessageFeatures_RecordConfigurationError_Message = `${featureKey}: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'message_feature_configuration_rejected', {
    featureKey,
    message,
  });

  return;
}

/**
 * Message Features - Send Moderation Alert.
 *
 * Publishes one bounded embed to a configured sendable guild channel.
 * Mentions are disabled and missing channel access produces a clear failure.
 *
 * @param {Lib_MessageFeatures_SendModerationAlert_Message}           message           - Message.
 * @param {Lib_MessageFeatures_SendModerationAlert_ChannelIdentifier} channelIdentifier - Channel identifier.
 * @param {Lib_MessageFeatures_SendModerationAlert_Title}             title             - Title.
 * @param {Lib_MessageFeatures_SendModerationAlert_Details}           details           - Details.
 *
 * @private
 *
 * @returns {Lib_MessageFeatures_SendModerationAlert_Returns}
 *
 * @since 4.0.0
 */
async function sendModerationAlert(
  message: Lib_MessageFeatures_SendModerationAlert_Message,
  channelIdentifier: Lib_MessageFeatures_SendModerationAlert_ChannelIdentifier,
  title: Lib_MessageFeatures_SendModerationAlert_Title,
  details: Lib_MessageFeatures_SendModerationAlert_Details,
): Lib_MessageFeatures_SendModerationAlert_Returns {
  const channel: Lib_MessageFeatures_SendModerationAlert_Channel = await message['guild']['channels'].fetch(
    channelIdentifier,
  );

  if (channel === null || channel.isSendable() === false) {
    throw new Error(`Moderation alert channel is unavailable: ${channelIdentifier}`);
  }

  const description: Lib_MessageFeatures_SendModerationAlert_Description = [
    `Author: ${message['author']['tag']} (${message['author']['id']})`,
    `Channel: ${message['channelId']}`,
    details,
    `[Open message](${message['url']})`,
  ].join('\n');

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    embeds: [new EmbedBuilder()
      .setColor(parseInt('F0B232', 16))
      .setDescription(truncateContent(description, 4_096))
      .setTimestamp(message['createdAt'])
      .setTitle(title)],
  });

  return;
}

/**
 * Message Features - Truncate Content.
 *
 * Bounds member-controlled excerpts before inserting them into alert embeds.
 * Short content remains unchanged while long content receives an ellipsis.
 *
 * @param {Lib_MessageFeatures_TruncateContent_Content}           content           - Content.
 * @param {Lib_MessageFeatures_TruncateContent_MaximumCharacters} maximumCharacters - Maximum characters.
 *
 * @returns {Lib_MessageFeatures_TruncateContent_Returns}
 *
 * @since 4.0.0
 */
export function truncateContent(
  content: Lib_MessageFeatures_TruncateContent_Content,
  maximumCharacters: Lib_MessageFeatures_TruncateContent_MaximumCharacters,
): Lib_MessageFeatures_TruncateContent_Returns {
  if (content.length <= maximumCharacters) {
    return content;
  }

  return `${content.slice(0, maximumCharacters - 1)}…`;
}
