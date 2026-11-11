import {
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { z } from 'zod';

import { timeFeatureHandler } from './debug-timing.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import { LIB_REGEX_PATTERN_DISCORD_IDENTIFIER } from './regex.js';

import type {
  Lib_ScammerFeatures_CompileScammerAlerts_Configuration,
  Lib_ScammerFeatures_CompileScammerAlerts_Content,
  Lib_ScammerFeatures_CompileScammerAlerts_Parsed,
  Lib_ScammerFeatures_CompileScammerAlerts_Returns,
  Lib_ScammerFeatures_CreateRegistration_Returns,
  Lib_ScammerFeatures_CreateRegistration_Runtime,
  Lib_ScammerFeatures_FindMatchingScammerRule_Content,
  Lib_ScammerFeatures_FindMatchingScammerRule_Returns,
  Lib_ScammerFeatures_FindMatchingScammerRule_Rules,
  Lib_ScammerFeatures_FormatConfigurationError_Error,
  Lib_ScammerFeatures_FormatConfigurationError_Messages,
  Lib_ScammerFeatures_FormatConfigurationError_Returns,
  Lib_ScammerFeatures_FormatScammerMessage_Content,
  Lib_ScammerFeatures_FormatScammerMessage_Message,
  Lib_ScammerFeatures_FormatScammerMessage_Returns,
  Lib_ScammerFeatures_FormatScammerMessage_Rule,
  Lib_ScammerFeatures_GetEnabledFeature_FeatureKey,
  Lib_ScammerFeatures_GetEnabledFeature_Features,
  Lib_ScammerFeatures_GetEnabledFeature_RawFeature,
  Lib_ScammerFeatures_GetEnabledFeature_Returns,
  Lib_ScammerFeatures_GetEnabledFeature_Settings,
  Lib_ScammerFeatures_HandleMessage_GuildIdentifier,
  Lib_ScammerFeatures_HandleMessage_Message,
  Lib_ScammerFeatures_HandleMessage_Returns,
  Lib_ScammerFeatures_HandleMessage_Rule,
  Lib_ScammerFeatures_HandleMessage_Runtime,
  Lib_ScammerFeatures_HandleMessageUpdate_GuildIdentifier,
  Lib_ScammerFeatures_HandleMessageUpdate_NewMessage,
  Lib_ScammerFeatures_HandleMessageUpdate_OldMessage,
  Lib_ScammerFeatures_HandleMessageUpdate_Returns,
  Lib_ScammerFeatures_HandleMessageUpdate_Runtime,
  Lib_ScammerFeatures_IsRecord_TypeGuard,
  Lib_ScammerFeatures_IsRecord_Value,
  Lib_ScammerFeatures_MatchesRegularExpression_Content,
  Lib_ScammerFeatures_MatchesRegularExpression_RegularExpression,
  Lib_ScammerFeatures_MatchesRegularExpression_Returns,
  Lib_ScammerFeatures_PrepareScammerFeatures_ActiveFeatureKeys,
  Lib_ScammerFeatures_PrepareScammerFeatures_ConfigurationErrors,
  Lib_ScammerFeatures_PrepareScammerFeatures_Feature,
  Lib_ScammerFeatures_PrepareScammerFeatures_Intents,
  Lib_ScammerFeatures_PrepareScammerFeatures_Returns,
  Lib_ScammerFeatures_PrepareScammerFeatures_Runtime,
  Lib_ScammerFeatures_PrepareScammerFeatures_Settings,
  Lib_ScammerFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_ScammerFeatures_RecordConfigurationError_Error,
  Lib_ScammerFeatures_RecordConfigurationError_FeatureKey,
  Lib_ScammerFeatures_RecordConfigurationError_Message,
  Lib_ScammerFeatures_RecordConfigurationError_Returns,
  Lib_ScammerFeatures_SendScammerAlert_Channel,
  Lib_ScammerFeatures_SendScammerAlert_Message,
  Lib_ScammerFeatures_SendScammerAlert_Returns,
  Lib_ScammerFeatures_SendScammerAlert_Rule,
  Lib_ScammerFeatures_SendScammerAlert_Runtime,
} from '../types/lib/scammer-features.d.ts';

/**
 * Scammer Features - Scammer Alerts Schema.
 *
 * Validates archived detection expressions and narrows alert payloads to text.
 * Every enabled rule shares one explicit moderator destination.
 *
 * @since 4.0.0
 */
export const scammerAlertsSchema = z.object({
  channel: z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  entities: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    payload: z.object({
      content: z.string().trim().min(1).max(2_000),
    }).optional(),
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
 * Scammer Features - Compile Scammer Alerts.
 *
 * Precompiles bounded message matchers once for each Gateway generation.
 * Invalid expressions disable this feature without affecting other modules.
 *
 * @param {Lib_ScammerFeatures_CompileScammerAlerts_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_CompileScammerAlerts_Returns}
 *
 * @since 4.0.0
 */
function compileScammerAlerts(
  configuration: Lib_ScammerFeatures_CompileScammerAlerts_Configuration,
): Lib_ScammerFeatures_CompileScammerAlerts_Returns {
  const parsed: Lib_ScammerFeatures_CompileScammerAlerts_Parsed = scammerAlertsSchema.parse(configuration);

  return {
    channelIdentifier: parsed['channel']['channel-id'],
    rules: parsed['entities'].map((entity) => {
      const content: Lib_ScammerFeatures_CompileScammerAlerts_Content = (
        entity['payload'] === undefined
      ) ? 'A potential scam message was detected from %MEMBER_USER_MENTION%.' : entity['payload']['content'];

      return {
        content,
        name: entity['name'],
        regularExpression: new RegExp(entity['regex']['pattern'], entity['regex']['flags']),
      };
    }),
  };
}

/**
 * Scammer Features - Create Registration.
 *
 * Registers content checks only for a validated enabled runtime generation.
 * Edited messages are rechecked without creating unrelated Gateway listeners.
 *
 * @param {Lib_ScammerFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_ScammerFeatures_CreateRegistration_Runtime,
): Lib_ScammerFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    client.on(Events.MessageCreate, (message) => {
      void timeFeatureHandler('scammer', Events.MessageCreate, guildIdentifier, () => handleMessage(message, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'scammer_alert_dispatch_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
      void timeFeatureHandler('scammer', Events.MessageUpdate, guildIdentifier, () => handleMessageUpdate(oldMessage, newMessage, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'scammer_alert_update_dispatch_failed', {
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
 * Scammer Features - Find Matching Scammer Rule.
 *
 * Selects the first configured expression that matches the current content.
 * One consolidated alert prevents overlapping rules from flooding moderators.
 *
 * @param {Lib_ScammerFeatures_FindMatchingScammerRule_Rules}   rules   - Rules.
 * @param {Lib_ScammerFeatures_FindMatchingScammerRule_Content} content - Content.
 *
 * @returns {Lib_ScammerFeatures_FindMatchingScammerRule_Returns}
 *
 * @since 4.0.0
 */
export function findMatchingScammerRule(
  rules: Lib_ScammerFeatures_FindMatchingScammerRule_Rules,
  content: Lib_ScammerFeatures_FindMatchingScammerRule_Content,
): Lib_ScammerFeatures_FindMatchingScammerRule_Returns {
  return rules.find((rule) => matchesRegularExpression(rule['regularExpression'], content) === true);
}

/**
 * Scammer Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without exposing submitted values.
 * Unexpected errors use the shared bounded message conversion.
 *
 * @param {Lib_ScammerFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_ScammerFeatures_FormatConfigurationError_Error,
): Lib_ScammerFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_ScammerFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Scammer Features - Format Scammer Message.
 *
 * Applies the one archived member placeholder and appends safe review context.
 * Automatic mention parsing remains disabled by the sending adapter.
 *
 * @param {Lib_ScammerFeatures_FormatScammerMessage_Message} message - Message.
 * @param {Lib_ScammerFeatures_FormatScammerMessage_Rule}    rule    - Rule.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_FormatScammerMessage_Returns}
 *
 * @since 4.0.0
 */
function formatScammerMessage(
  message: Lib_ScammerFeatures_FormatScammerMessage_Message,
  rule: Lib_ScammerFeatures_FormatScammerMessage_Rule,
): Lib_ScammerFeatures_FormatScammerMessage_Returns {
  const content: Lib_ScammerFeatures_FormatScammerMessage_Content = rule['content']
    .replaceAll('%MEMBER_USER_MENTION%', `<@${message['author']['id']}>`);

  return [
    content,
    `Rule: ${rule['name']}`,
    `Channel: <#${message['channelId']}>`,
    `Message: ${message['url']}`,
  ].join('\n').slice(0, 2_000);
}

/**
 * Scammer Features - Get Enabled Feature.
 *
 * Reads one database-backed switch without trusting the surrounding JSON.
 * Disabled or absent settings never request Message Content access.
 *
 * @param {Lib_ScammerFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_ScammerFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_ScammerFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_ScammerFeatures_GetEnabledFeature_FeatureKey,
): Lib_ScammerFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_ScammerFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_ScammerFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_ScammerFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Scammer Features - Handle Message.
 *
 * Observes human content in the configured server and reports one matching rule.
 * The feature never deletes, edits, or otherwise enforces against the message.
 *
 * @param {Lib_ScammerFeatures_HandleMessage_Message}         message         - Message.
 * @param {Lib_ScammerFeatures_HandleMessage_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ScammerFeatures_HandleMessage_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_HandleMessage_Returns}
 *
 * @since 4.0.0
 */
async function handleMessage(
  message: Lib_ScammerFeatures_HandleMessage_Message,
  guildIdentifier: Lib_ScammerFeatures_HandleMessage_GuildIdentifier,
  runtime: Lib_ScammerFeatures_HandleMessage_Runtime,
): Lib_ScammerFeatures_HandleMessage_Returns {
  if (
    message.inGuild() === false
    || message['guildId'] !== guildIdentifier
    || message['author']['bot'] === true
    || message['system'] === true
    || message['content'].length === 0
  ) {
    return;
  }

  const rule: Lib_ScammerFeatures_HandleMessage_Rule = findMatchingScammerRule(
    runtime['rules'],
    message['content'],
  );

  if (rule === undefined) {
    return;
  }

  await sendScammerAlert(message, runtime, rule);

  writeLog('info', 'bot', 'scammer_alert_sent', {
    messageIdentifier: message['id'],
    ruleName: rule['name'],
    userIdentifier: message['author']['id'],
  });

  return;
}

/**
 * Scammer Features - Handle Message Update.
 *
 * Rechecks only content-changing edits and skips embed-only Discord updates.
 * Existing delivery failures remain isolated by the registration boundary.
 *
 * @param {Lib_ScammerFeatures_HandleMessageUpdate_OldMessage}      oldMessage      - Old message.
 * @param {Lib_ScammerFeatures_HandleMessageUpdate_NewMessage}      newMessage      - New message.
 * @param {Lib_ScammerFeatures_HandleMessageUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ScammerFeatures_HandleMessageUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_HandleMessageUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleMessageUpdate(
  oldMessage: Lib_ScammerFeatures_HandleMessageUpdate_OldMessage,
  newMessage: Lib_ScammerFeatures_HandleMessageUpdate_NewMessage,
  guildIdentifier: Lib_ScammerFeatures_HandleMessageUpdate_GuildIdentifier,
  runtime: Lib_ScammerFeatures_HandleMessageUpdate_Runtime,
): Lib_ScammerFeatures_HandleMessageUpdate_Returns {
  if (oldMessage['content'] === newMessage['content']) {
    return;
  }

  await handleMessage(newMessage, guildIdentifier, runtime);

  return;
}

/**
 * Scammer Features - Is Record.
 *
 * Narrows untrusted settings before reading feature state properties.
 * Arrays and null are not accepted as configuration maps.
 *
 * @param {Lib_ScammerFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_ScammerFeatures_IsRecord_Value,
): value is Lib_ScammerFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Scammer Features - Matches Regular Expression.
 *
 * Reconstructs configured expressions so global and sticky state cannot leak.
 * Every message therefore receives the same deterministic comparison.
 *
 * @param {Lib_ScammerFeatures_MatchesRegularExpression_RegularExpression} regularExpression - Regular expression.
 * @param {Lib_ScammerFeatures_MatchesRegularExpression_Content}           content           - Content.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_MatchesRegularExpression_Returns}
 *
 * @since 4.0.0
 */
function matchesRegularExpression(
  regularExpression: Lib_ScammerFeatures_MatchesRegularExpression_RegularExpression,
  content: Lib_ScammerFeatures_MatchesRegularExpression_Content,
): Lib_ScammerFeatures_MatchesRegularExpression_Returns {
  return new RegExp(regularExpression.source, regularExpression.flags).test(content);
}

/**
 * Scammer Features - Prepare Scammer Features.
 *
 * Compiles the optional module before login and reports actionable diagnostics.
 * Valid configuration requests only the two message intents it consumes.
 *
 * @param {Lib_ScammerFeatures_PrepareScammerFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_ScammerFeatures_PrepareScammerFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareScammerFeatures(
  settings: Lib_ScammerFeatures_PrepareScammerFeatures_Settings,
): Lib_ScammerFeatures_PrepareScammerFeatures_Returns {
  let runtime: Lib_ScammerFeatures_PrepareScammerFeatures_Runtime = undefined;
  const activeFeatureKeys: Lib_ScammerFeatures_PrepareScammerFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_ScammerFeatures_PrepareScammerFeatures_ConfigurationErrors = [];
  const feature: Lib_ScammerFeatures_PrepareScammerFeatures_Feature = getEnabledFeature(
    settings,
    'scammer-alerts',
  );

  if (feature !== undefined) {
    try {
      runtime = compileScammerAlerts(feature['configuration']);

      activeFeatureKeys.push('scammer-alerts');
    } catch (error) {
      recordConfigurationError('scammer-alerts', error, configurationErrors);
    }
  }

  const intents: Lib_ScammerFeatures_PrepareScammerFeatures_Intents = [];

  if (runtime !== undefined) {
    intents.push(
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    );
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: (runtime === undefined) ? () => undefined : createRegistration(runtime),
  };
}

/**
 * Scammer Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one structured startup warning.
 * A rejected scammer module remains isolated from the Discord connection.
 *
 * @param {Lib_ScammerFeatures_RecordConfigurationError_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_ScammerFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_ScammerFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  featureKey: Lib_ScammerFeatures_RecordConfigurationError_FeatureKey,
  error: Lib_ScammerFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_ScammerFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_ScammerFeatures_RecordConfigurationError_Returns {
  const message: Lib_ScammerFeatures_RecordConfigurationError_Message = `${featureKey}: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'scammer_feature_configuration_rejected', {
    featureKey,
    message,
  });

  return;
}

/**
 * Scammer Features - Send Scammer Alert.
 *
 * Resolves only the configured guild channel and sends bounded text safely.
 * Discord cannot expand user, role, or everyone mentions from imported text.
 *
 * @param {Lib_ScammerFeatures_SendScammerAlert_Message} message - Message.
 * @param {Lib_ScammerFeatures_SendScammerAlert_Runtime} runtime - Runtime.
 * @param {Lib_ScammerFeatures_SendScammerAlert_Rule}    rule    - Rule.
 *
 * @private
 *
 * @returns {Lib_ScammerFeatures_SendScammerAlert_Returns}
 *
 * @since 4.0.0
 */
async function sendScammerAlert(
  message: Lib_ScammerFeatures_SendScammerAlert_Message,
  runtime: Lib_ScammerFeatures_SendScammerAlert_Runtime,
  rule: Lib_ScammerFeatures_SendScammerAlert_Rule,
): Lib_ScammerFeatures_SendScammerAlert_Returns {
  const channel: Lib_ScammerFeatures_SendScammerAlert_Channel = await message['guild']['channels'].fetch(
    runtime['channelIdentifier'],
  );

  if (channel === null || channel.isSendable() === false) {
    throw new Error('Configured scammer-alert channel is unavailable.');
  }

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    content: formatScammerMessage(message, rule),
  });

  return;
}
