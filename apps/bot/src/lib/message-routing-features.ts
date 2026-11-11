import {
  Events,
  GatewayIntentBits,
  WebhookClient,
} from 'discord.js';
import { z } from 'zod';

import { timeFeatureHandler } from './debug-timing.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_DISCORD_WEBHOOK_PATH,
} from './regex.js';

import type {
  Lib_MessageRoutingFeatures_AppendAttachmentLinks_AttachmentUrls,
  Lib_MessageRoutingFeatures_AppendAttachmentLinks_Content,
  Lib_MessageRoutingFeatures_AppendAttachmentLinks_IncludeAttachments,
  Lib_MessageRoutingFeatures_AppendAttachmentLinks_Message,
  Lib_MessageRoutingFeatures_AppendAttachmentLinks_Returns,
  Lib_MessageRoutingFeatures_ApplyReplacements_Content,
  Lib_MessageRoutingFeatures_ApplyReplacements_EditedContent,
  Lib_MessageRoutingFeatures_ApplyReplacements_Replacements,
  Lib_MessageRoutingFeatures_ApplyReplacements_Returns,
  Lib_MessageRoutingFeatures_CompileCopierRules_Configuration,
  Lib_MessageRoutingFeatures_CompileCopierRules_Destinations,
  Lib_MessageRoutingFeatures_CompileCopierRules_Parsed,
  Lib_MessageRoutingFeatures_CompileCopierRules_Returns,
  Lib_MessageRoutingFeatures_CompileCopierRules_Secrets,
  Lib_MessageRoutingFeatures_CompileProxyRules_Configuration,
  Lib_MessageRoutingFeatures_CompileProxyRules_Parsed,
  Lib_MessageRoutingFeatures_CompileProxyRules_Returns,
  Lib_MessageRoutingFeatures_CompileProxyRules_Secrets,
  Lib_MessageRoutingFeatures_CompileReplacements_Configuration,
  Lib_MessageRoutingFeatures_CompileReplacements_Returns,
  Lib_MessageRoutingFeatures_CopierWebhookDestination_Url,
  Lib_MessageRoutingFeatures_CreateRegistration_Returns,
  Lib_MessageRoutingFeatures_CreateRegistration_Runtime,
  Lib_MessageRoutingFeatures_FindMatchingCopierRule_Message,
  Lib_MessageRoutingFeatures_FindMatchingCopierRule_Returns,
  Lib_MessageRoutingFeatures_FindMatchingCopierRule_Rules,
  Lib_MessageRoutingFeatures_FindMatchingProxyRule_ChannelIdentifier,
  Lib_MessageRoutingFeatures_FindMatchingProxyRule_Returns,
  Lib_MessageRoutingFeatures_FindMatchingProxyRule_Rules,
  Lib_MessageRoutingFeatures_FormatConfigurationError_Error,
  Lib_MessageRoutingFeatures_FormatConfigurationError_Messages,
  Lib_MessageRoutingFeatures_FormatConfigurationError_Returns,
  Lib_MessageRoutingFeatures_FormatCopierContent_Content,
  Lib_MessageRoutingFeatures_FormatCopierContent_Message,
  Lib_MessageRoutingFeatures_FormatCopierContent_Returns,
  Lib_MessageRoutingFeatures_FormatCopierContent_Rule,
  Lib_MessageRoutingFeatures_FormatCopierContent_TransformedContent,
  Lib_MessageRoutingFeatures_GetEnabledFeature_FeatureKey,
  Lib_MessageRoutingFeatures_GetEnabledFeature_Features,
  Lib_MessageRoutingFeatures_GetEnabledFeature_RawFeature,
  Lib_MessageRoutingFeatures_GetEnabledFeature_Returns,
  Lib_MessageRoutingFeatures_GetEnabledFeature_Settings,
  Lib_MessageRoutingFeatures_HandleMessage_CopierRule,
  Lib_MessageRoutingFeatures_HandleMessage_GuildIdentifier,
  Lib_MessageRoutingFeatures_HandleMessage_Message,
  Lib_MessageRoutingFeatures_HandleMessage_ProxyRule,
  Lib_MessageRoutingFeatures_HandleMessage_Returns,
  Lib_MessageRoutingFeatures_HandleMessage_Runtime,
  Lib_MessageRoutingFeatures_IsRecord_TypeGuard,
  Lib_MessageRoutingFeatures_IsRecord_Value,
  Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_ParsedUrl,
  Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_PathPattern,
  Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Returns,
  Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Value,
  Lib_MessageRoutingFeatures_MatchesRegularExpression_Content,
  Lib_MessageRoutingFeatures_MatchesRegularExpression_RegularExpression,
  Lib_MessageRoutingFeatures_MatchesRegularExpression_Returns,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ActiveFeatureKeys,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ConfigurationErrors,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_CopierFeature,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_CopierRules,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Intents,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ProxyFeature,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ProxyRules,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Secrets,
  Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Settings,
  Lib_MessageRoutingFeatures_ProxyRule_WebhookUrl,
  Lib_MessageRoutingFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_MessageRoutingFeatures_RecordConfigurationError_Error,
  Lib_MessageRoutingFeatures_RecordConfigurationError_FeatureKey,
  Lib_MessageRoutingFeatures_RecordConfigurationError_Message,
  Lib_MessageRoutingFeatures_RecordConfigurationError_Returns,
  Lib_MessageRoutingFeatures_ResolveSecretReference_Reference,
  Lib_MessageRoutingFeatures_ResolveSecretReference_Returns,
  Lib_MessageRoutingFeatures_ResolveSecretReference_Secret,
  Lib_MessageRoutingFeatures_ResolveSecretReference_Secrets,
  Lib_MessageRoutingFeatures_SendCopierMessage_Channel,
  Lib_MessageRoutingFeatures_SendCopierMessage_Content,
  Lib_MessageRoutingFeatures_SendCopierMessage_Message,
  Lib_MessageRoutingFeatures_SendCopierMessage_Returns,
  Lib_MessageRoutingFeatures_SendCopierMessage_Rule,
  Lib_MessageRoutingFeatures_SendCopierMessage_WebhookClient,
  Lib_MessageRoutingFeatures_SendProxyMessage_AttachmentContent,
  Lib_MessageRoutingFeatures_SendProxyMessage_Content,
  Lib_MessageRoutingFeatures_SendProxyMessage_Embeds,
  Lib_MessageRoutingFeatures_SendProxyMessage_Message,
  Lib_MessageRoutingFeatures_SendProxyMessage_Returns,
  Lib_MessageRoutingFeatures_SendProxyMessage_Rule,
  Lib_MessageRoutingFeatures_SendProxyMessage_WebhookClient,
} from '../types/lib/message-routing-features.d.ts';

/**
 * Message Routing Features - Webhook URL Message.
 *
 * Explains a webhook secret that is not a Discord webhook URL, next to the field it names.
 * Copiers and proxies share the wording.
 *
 * @since 4.0.0
 */
const WEBHOOK_URL_MESSAGE = 'Enter a Discord webhook URL, starting with https://discord.com/api/webhooks/.';

/**
 * Message Routing Features - Secret Reference Schema.
 *
 * Requires integration credentials to remain indirect database references.
 * Plain webhook URLs are never accepted inside operator-visible feature JSON.
 *
 * @since 4.0.0
 */
const secretReferenceSchema = z.object({
  $secret: z.string().trim().min(1).max(512),
});

/**
 * Message Routing Features - Regular Expression Schema.
 *
 * Validates bounded match and replacement expressions before registration.
 * Malformed flags or patterns disable only the owning routing feature.
 *
 * @since 4.0.0
 */
const regularExpressionSchema = z.object({
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
});

/**
 * Message Routing Features - Replacement Schema.
 *
 * Restricts each configured text rewrite to a bounded expression and value.
 * Replacements apply only to message text, never serialized webhook payloads.
 *
 * @since 4.0.0
 */
const replacementSchema = regularExpressionSchema.extend({
  'replace-with': z.string().max(2_000),
});

/**
 * Message Routing Features - Copier Destination Schema.
 *
 * Allows same-guild channels or encrypted Discord webhook destinations only.
 * Retired Twitter destinations are removed by the legacy migration boundary.
 *
 * @since 4.0.0
 */
const copierDestinationSchema = z.discriminatedUnion('method', [
  z.object({
    channel: z.object({
      'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    }),
    method: z.literal('discord-channel'),
  }),
  z.object({
    method: z.literal('discord-webhook'),
    webhook: z.object({
      'avatar-url': z.string().url().max(2_048).optional(),
      'url': secretReferenceSchema,
      'username': z.string().trim().min(1).max(80).optional(),
    }),
  }),
]);

/**
 * Message Routing Features - Copier Rule Schema.
 *
 * Bounds source filters, transformations, destinations, and attachment links.
 * Allow lists narrow eligibility before deny lists exclude explicit exceptions.
 *
 * @since 4.0.0
 */
const copierRuleSchema = z.object({
  'allowed-channels': z.array(z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).max(100).optional(),
  'allowed-users': z.array(z.object({
    'user-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).max(100).optional(),
  'destinations': z.array(copierDestinationSchema).min(1).max(10),
  'disallowed-channels': z.array(z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).max(100).optional(),
  'disallowed-users': z.array(z.object({
    'user-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  })).max(100).optional(),
  'include-attachments': z.boolean().default(false),
  'message': z.string().min(1).max(4_000).default('%MESSAGE_CONTENT%'),
  'name': z.string().trim().min(1).max(100),
  'regex': regularExpressionSchema,
  'replacements': z.array(replacementSchema).max(50).optional(),
});

/**
 * Message Routing Features - Copier Schema.
 *
 * Requires at least one approved human-message route and caps the rule count.
 * A single event can select only the first applicable rule.
 *
 * @since 4.0.0
 */
export const copierSchema = z.array(copierRuleSchema).min(1).max(100);

/**
 * Message Routing Features - Proxy Schema.
 *
 * Validates bot-message sources, encrypted webhooks, and text-only rewrites.
 * Legacy payload printing is accepted but intentionally never emitted to logs.
 *
 * @since 4.0.0
 */
export const proxySchema = z.array(z.object({
  'channel': z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  'name': z.string().trim().min(1).max(100),
  'print-payload': z.boolean().optional(),
  'replacements': z.array(replacementSchema).max(50).optional(),
  'webhook': z.object({
    'webhook-url': secretReferenceSchema,
  }),
})).min(1).max(100);

/**
 * Message Routing Features - Apply Replacements.
 *
 * Applies ordered text rewrites with fresh regular-expression state each time.
 * Global and sticky flags therefore behave consistently across messages.
 *
 * @param {Lib_MessageRoutingFeatures_ApplyReplacements_Content}      content      - Content.
 * @param {Lib_MessageRoutingFeatures_ApplyReplacements_Replacements} replacements - Replacements.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_ApplyReplacements_Returns}
 *
 * @since 4.0.0
 */
function applyReplacements(
  content: Lib_MessageRoutingFeatures_ApplyReplacements_Content,
  replacements: Lib_MessageRoutingFeatures_ApplyReplacements_Replacements,
): Lib_MessageRoutingFeatures_ApplyReplacements_Returns {
  let editedContent: Lib_MessageRoutingFeatures_ApplyReplacements_EditedContent = content;

  for (const replacement of replacements) {
    editedContent = editedContent.replace(
      new RegExp(replacement['regularExpression'].source, replacement['regularExpression'].flags),
      replacement['replaceWith'],
    );
  }

  return editedContent;
}

/**
 * Message Routing Features - Append Attachment Links.
 *
 * Relays bounded Discord CDN links instead of downloading untrusted bytes.
 * This preserves access without introducing an attachment-fetch SSRF surface.
 *
 * @param {Lib_MessageRoutingFeatures_AppendAttachmentLinks_Message}            message            - Message.
 * @param {Lib_MessageRoutingFeatures_AppendAttachmentLinks_Content}            content            - Content.
 * @param {Lib_MessageRoutingFeatures_AppendAttachmentLinks_IncludeAttachments} includeAttachments - Include attachments.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_AppendAttachmentLinks_Returns}
 *
 * @since 4.0.0
 */
function appendAttachmentLinks(
  message: Lib_MessageRoutingFeatures_AppendAttachmentLinks_Message,
  content: Lib_MessageRoutingFeatures_AppendAttachmentLinks_Content,
  includeAttachments: Lib_MessageRoutingFeatures_AppendAttachmentLinks_IncludeAttachments,
): Lib_MessageRoutingFeatures_AppendAttachmentLinks_Returns {
  if (includeAttachments === false || message['attachments']['size'] === 0) {
    return content.slice(0, 2_000);
  }

  const attachmentUrls: Lib_MessageRoutingFeatures_AppendAttachmentLinks_AttachmentUrls = message['attachments']
    .first(5)
    .map((attachment) => attachment['url']);

  return [
    content,
    [
      'Attachments:',
      attachmentUrls.join('\n'),
    ].join('\n'),
  ].filter((section) => section.length > 0).join('\n\n').slice(0, 2_000);
}

/**
 * Message Routing Features - Compile Copier Rules.
 *
 * Resolves encrypted webhook references and compiles bounded source matchers.
 * Invalid or missing credentials reject only the copier feature.
 *
 * @param {Lib_MessageRoutingFeatures_CompileCopierRules_Configuration} configuration - Configuration.
 * @param {Lib_MessageRoutingFeatures_CompileCopierRules_Secrets}       secrets       - Secrets.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_CompileCopierRules_Returns}
 *
 * @since 4.0.0
 */
function compileCopierRules(
  configuration: Lib_MessageRoutingFeatures_CompileCopierRules_Configuration,
  secrets: Lib_MessageRoutingFeatures_CompileCopierRules_Secrets,
): Lib_MessageRoutingFeatures_CompileCopierRules_Returns {
  const parsed: Lib_MessageRoutingFeatures_CompileCopierRules_Parsed = copierSchema.parse(configuration);

  return parsed.map((rule, ruleIndex) => {
    const destinations: Lib_MessageRoutingFeatures_CompileCopierRules_Destinations = rule['destinations'].map(
      (destination, destinationIndex) => {
        if (destination['method'] === 'discord-channel') {
          return {
            channelIdentifier: destination['channel']['channel-id'],
            kind: 'channel',
          };
        }

        const webhookUrl: Lib_MessageRoutingFeatures_CopierWebhookDestination_Url = resolveSecretReference(
          destination['webhook']['url'],
          secrets,
        );

        if (isValidDiscordWebhookUrl(webhookUrl) === false) {
          throw new Error(`${ruleIndex}.destinations.${destinationIndex}.webhook.url: ${WEBHOOK_URL_MESSAGE}`);
        }

        return {
          avatarUrl: destination['webhook']['avatar-url'],
          kind: 'webhook',
          url: webhookUrl,
          username: destination['webhook']['username'],
        };
      },
    );

    return {
      allowedChannelIdentifiers: (rule['allowed-channels'] ?? []).map((channel) => channel['channel-id']),
      allowedUserIdentifiers: (rule['allowed-users'] ?? []).map((user) => user['user-id']),
      destinations,
      disallowedChannelIdentifiers: (rule['disallowed-channels'] ?? []).map((channel) => channel['channel-id']),
      disallowedUserIdentifiers: (rule['disallowed-users'] ?? []).map((user) => user['user-id']),
      includeAttachments: rule['include-attachments'],
      messageTemplate: rule['message'],
      name: rule['name'],
      regularExpression: new RegExp(rule['regex']['pattern'], rule['regex']['flags']),
      replacements: compileReplacements(rule['replacements']),
    };
  });
}

/**
 * Message Routing Features - Compile Proxy Rules.
 *
 * Resolves purpose-bound webhook secrets and compiles safe text replacements.
 * Proxy rules retain bot identity and embeds while disabling all mentions.
 *
 * @param {Lib_MessageRoutingFeatures_CompileProxyRules_Configuration} configuration - Configuration.
 * @param {Lib_MessageRoutingFeatures_CompileProxyRules_Secrets}       secrets       - Secrets.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_CompileProxyRules_Returns}
 *
 * @since 4.0.0
 */
function compileProxyRules(
  configuration: Lib_MessageRoutingFeatures_CompileProxyRules_Configuration,
  secrets: Lib_MessageRoutingFeatures_CompileProxyRules_Secrets,
): Lib_MessageRoutingFeatures_CompileProxyRules_Returns {
  const parsed: Lib_MessageRoutingFeatures_CompileProxyRules_Parsed = proxySchema.parse(configuration);

  return parsed.map((rule, ruleIndex) => {
    const webhookUrl: Lib_MessageRoutingFeatures_ProxyRule_WebhookUrl = resolveSecretReference(
      rule['webhook']['webhook-url'],
      secrets,
    );

    if (isValidDiscordWebhookUrl(webhookUrl) === false) {
      throw new Error(`${ruleIndex}.webhook.webhook-url: ${WEBHOOK_URL_MESSAGE}`);
    }

    return {
      channelIdentifier: rule['channel']['channel-id'],
      name: rule['name'],
      replacements: compileReplacements(rule['replacements']),
      webhookUrl,
    };
  });
}

/**
 * Message Routing Features - Compile Replacements.
 *
 * Converts already validated legacy rewrite entries to immutable matchers.
 * Empty replacement lists remain a valid no-op transformation.
 *
 * @param {Lib_MessageRoutingFeatures_CompileReplacements_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_CompileReplacements_Returns}
 *
 * @since 4.0.0
 */
function compileReplacements(
  configuration: Lib_MessageRoutingFeatures_CompileReplacements_Configuration,
): Lib_MessageRoutingFeatures_CompileReplacements_Returns {
  return (configuration ?? []).map((replacement) => {
    return {
      regularExpression: new RegExp(replacement['pattern'], replacement['flags']),
      replaceWith: replacement['replace-with'],
    };
  });
}

/**
 * Message Routing Features - Create Registration.
 *
 * Registers one message listener for both human copiers and bot proxies.
 * Runtime handler failures remain isolated from the Discord connection.
 *
 * @param {Lib_MessageRoutingFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_MessageRoutingFeatures_CreateRegistration_Runtime,
): Lib_MessageRoutingFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    client.on(Events.MessageCreate, (message) => {
      void timeFeatureHandler('message-routing', Events.MessageCreate, guildIdentifier, () => handleMessage(message, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'message_routing_dispatch_failed', {
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
 * Message Routing Features - Find Matching Copier Rule.
 *
 * Applies allow and deny filters before selecting the first content matcher.
 * One source message cannot fan out through multiple overlapping rules.
 *
 * @param {Lib_MessageRoutingFeatures_FindMatchingCopierRule_Rules}   rules   - Rules.
 * @param {Lib_MessageRoutingFeatures_FindMatchingCopierRule_Message} message - Message.
 *
 * @returns {Lib_MessageRoutingFeatures_FindMatchingCopierRule_Returns}
 *
 * @since 4.0.0
 */
export function findMatchingCopierRule(
  rules: Lib_MessageRoutingFeatures_FindMatchingCopierRule_Rules,
  message: Lib_MessageRoutingFeatures_FindMatchingCopierRule_Message,
): Lib_MessageRoutingFeatures_FindMatchingCopierRule_Returns {
  return rules.find((rule) => (
    (
      rule['allowedUserIdentifiers'].length === 0
      || rule['allowedUserIdentifiers'].includes(message['author']['id']) === true
    )
    && rule['disallowedUserIdentifiers'].includes(message['author']['id']) === false
    && (
      rule['allowedChannelIdentifiers'].length === 0
      || rule['allowedChannelIdentifiers'].includes(message['channelId']) === true
    )
    && rule['disallowedChannelIdentifiers'].includes(message['channelId']) === false
    && matchesRegularExpression(rule['regularExpression'], message['content']) === true
  ));
}

/**
 * Message Routing Features - Find Matching Proxy Rule.
 *
 * Selects one configured source channel for a bot-authored message.
 * First-match behavior prevents duplicate webhook deliveries.
 *
 * @param {Lib_MessageRoutingFeatures_FindMatchingProxyRule_Rules}             rules             - Rules.
 * @param {Lib_MessageRoutingFeatures_FindMatchingProxyRule_ChannelIdentifier} channelIdentifier - Channel identifier.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_FindMatchingProxyRule_Returns}
 *
 * @since 4.0.0
 */
function findMatchingProxyRule(
  rules: Lib_MessageRoutingFeatures_FindMatchingProxyRule_Rules,
  channelIdentifier: Lib_MessageRoutingFeatures_FindMatchingProxyRule_ChannelIdentifier,
): Lib_MessageRoutingFeatures_FindMatchingProxyRule_Returns {
  return rules.find((rule) => rule['channelIdentifier'] === channelIdentifier);
}

/**
 * Message Routing Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without exposing submitted values.
 * Unexpected errors use the shared bounded message conversion.
 *
 * @param {Lib_MessageRoutingFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_MessageRoutingFeatures_FormatConfigurationError_Error,
): Lib_MessageRoutingFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_MessageRoutingFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Message Routing Features - Format Copier Content.
 *
 * Applies safe text replacements before expanding archived message variables.
 * Attachment URLs are appended after template rendering and globally bounded.
 *
 * @param {Lib_MessageRoutingFeatures_FormatCopierContent_Message} message - Message.
 * @param {Lib_MessageRoutingFeatures_FormatCopierContent_Rule}    rule    - Rule.
 *
 * @returns {Lib_MessageRoutingFeatures_FormatCopierContent_Returns}
 *
 * @since 4.0.0
 */
export function formatCopierContent(
  message: Lib_MessageRoutingFeatures_FormatCopierContent_Message,
  rule: Lib_MessageRoutingFeatures_FormatCopierContent_Rule,
): Lib_MessageRoutingFeatures_FormatCopierContent_Returns {
  const transformedContent: Lib_MessageRoutingFeatures_FormatCopierContent_TransformedContent = applyReplacements(
    message['content'],
    rule['replacements'],
  );
  const content: Lib_MessageRoutingFeatures_FormatCopierContent_Content = rule['messageTemplate']
    .replaceAll('%CHANNEL_MENTION%', `<#${message['channelId']}>`)
    .replaceAll('%MEMBER_MENTION%', `<@${message['author']['id']}>`)
    .replaceAll('%MEMBER_TAG%', message['author']['tag'])
    .replaceAll('%MESSAGE_CONTENT%', transformedContent)
    .replaceAll('%MESSAGE_EXCERPT%', transformedContent.slice(0, 500))
    .replaceAll('%MESSAGE_URL%', message['url']);

  return appendAttachmentLinks(message, content, rule['includeAttachments']);
}

/**
 * Message Routing Features - Get Enabled Feature.
 *
 * Reads one database-backed switch without trusting the surrounding JSON.
 * Disabled or absent settings never request Message Content access.
 *
 * @param {Lib_MessageRoutingFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_MessageRoutingFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_MessageRoutingFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_MessageRoutingFeatures_GetEnabledFeature_FeatureKey,
): Lib_MessageRoutingFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_MessageRoutingFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_MessageRoutingFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_MessageRoutingFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Message Routing Features - Handle Message.
 *
 * Routes human messages through copiers and bot messages through proxies.
 * Webhook-authored messages are excluded to prevent relay loops.
 *
 * @param {Lib_MessageRoutingFeatures_HandleMessage_Message}         message         - Message.
 * @param {Lib_MessageRoutingFeatures_HandleMessage_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_MessageRoutingFeatures_HandleMessage_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_HandleMessage_Returns}
 *
 * @since 4.0.0
 */
async function handleMessage(
  message: Lib_MessageRoutingFeatures_HandleMessage_Message,
  guildIdentifier: Lib_MessageRoutingFeatures_HandleMessage_GuildIdentifier,
  runtime: Lib_MessageRoutingFeatures_HandleMessage_Runtime,
): Lib_MessageRoutingFeatures_HandleMessage_Returns {
  if (
    message.inGuild() === false
    || message['guildId'] !== guildIdentifier
    || message['system'] === true
  ) {
    return;
  }

  if (message['author']['bot'] === true) {
    if (message['webhookId'] !== null) {
      return;
    }

    const proxyRule: Lib_MessageRoutingFeatures_HandleMessage_ProxyRule = findMatchingProxyRule(
      runtime['proxyRules'],
      message['channelId'],
    );

    if (proxyRule !== undefined) {
      await sendProxyMessage(message, proxyRule);
    }

    return;
  }

  const copierRule: Lib_MessageRoutingFeatures_HandleMessage_CopierRule = findMatchingCopierRule(
    runtime['copierRules'],
    message,
  );

  if (copierRule !== undefined) {
    await sendCopierMessage(message, copierRule);
  }

  return;
}

/**
 * Message Routing Features - Is Record.
 *
 * Narrows untrusted settings before reading feature state properties.
 * Arrays and null are not accepted as configuration maps.
 *
 * @param {Lib_MessageRoutingFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_MessageRoutingFeatures_IsRecord_Value,
): value is Lib_MessageRoutingFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Message Routing Features - Is Valid Discord Webhook URL.
 *
 * Restricts decrypted credentials to Discord's canonical HTTPS webhook host.
 * Userinfo, ports, query strings, fragments, and alternate paths are rejected.
 *
 * @param {Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Value} value - Value.
 *
 * @returns {Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Returns}
 *
 * @since 4.0.0
 */
export function isValidDiscordWebhookUrl(
  value: Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Value,
): Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Returns {
  try {
    const parsedUrl: Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_ParsedUrl = new URL(value);
    const pathPattern: Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_PathPattern = new RegExp(
      LIB_REGEX_PATTERN_DISCORD_WEBHOOK_PATH,
      'u',
    );

    return parsedUrl['protocol'] === 'https:'
      && parsedUrl['hostname'] === 'discord.com'
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

/**
 * Message Routing Features - Matches Regular Expression.
 *
 * Reconstructs configured expressions so global and sticky state cannot leak.
 * Every source message therefore receives the same deterministic comparison.
 *
 * @param {Lib_MessageRoutingFeatures_MatchesRegularExpression_RegularExpression} regularExpression - Regular expression.
 * @param {Lib_MessageRoutingFeatures_MatchesRegularExpression_Content}           content           - Content.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_MatchesRegularExpression_Returns}
 *
 * @since 4.0.0
 */
function matchesRegularExpression(
  regularExpression: Lib_MessageRoutingFeatures_MatchesRegularExpression_RegularExpression,
  content: Lib_MessageRoutingFeatures_MatchesRegularExpression_Content,
): Lib_MessageRoutingFeatures_MatchesRegularExpression_Returns {
  return new RegExp(regularExpression.source, regularExpression.flags).test(content);
}

/**
 * Message Routing Features - Prepare Message Routing Features.
 *
 * Compiles optional copier and proxy modules with isolated configuration errors.
 * Valid routes request message intents only while at least one is enabled.
 *
 * @param {Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Settings} settings - Settings.
 * @param {Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Secrets}  secrets  - Secrets.
 *
 * @returns {Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareMessageRoutingFeatures(
  settings: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Settings,
  secrets: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Secrets,
): Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns {
  const activeFeatureKeys: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ConfigurationErrors = [];
  let copierRules: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_CopierRules = [];
  let proxyRules: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ProxyRules = [];
  const copierFeature: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_CopierFeature = getEnabledFeature(
    settings,
    'message-copiers',
  );
  const proxyFeature: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ProxyFeature = getEnabledFeature(
    settings,
    'message-proxies',
  );

  if (copierFeature !== undefined) {
    try {
      copierRules = compileCopierRules(copierFeature['configuration'], secrets);

      activeFeatureKeys.push('message-copiers');
    } catch (error) {
      recordConfigurationError('message-copiers', error, configurationErrors);
    }
  }

  if (proxyFeature !== undefined) {
    try {
      proxyRules = compileProxyRules(proxyFeature['configuration'], secrets);

      activeFeatureKeys.push('message-proxies');
    } catch (error) {
      recordConfigurationError('message-proxies', error, configurationErrors);
    }
  }

  const intents: Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Intents = [];

  if (copierRules.length > 0 || proxyRules.length > 0) {
    intents.push(
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    );
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: (
      copierRules.length === 0
      && proxyRules.length === 0
    ) ? () => undefined : createRegistration({
          copierRules,
          proxyRules,
        }),
  };
}

/**
 * Message Routing Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one structured startup warning.
 * Rejected routes remain isolated from every other Discord feature.
 *
 * @param {Lib_MessageRoutingFeatures_RecordConfigurationError_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_MessageRoutingFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_MessageRoutingFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  featureKey: Lib_MessageRoutingFeatures_RecordConfigurationError_FeatureKey,
  error: Lib_MessageRoutingFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_MessageRoutingFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_MessageRoutingFeatures_RecordConfigurationError_Returns {
  const message: Lib_MessageRoutingFeatures_RecordConfigurationError_Message = `${featureKey}: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'message_routing_feature_configuration_rejected', {
    featureKey,
    message,
  });

  return;
}

/**
 * Message Routing Features - Resolve Secret Reference.
 *
 * Resolves only the exact purpose-bound key embedded by legacy migration.
 * Missing secrets fail closed without including plaintext in diagnostics.
 *
 * @param {Lib_MessageRoutingFeatures_ResolveSecretReference_Reference} reference - Reference.
 * @param {Lib_MessageRoutingFeatures_ResolveSecretReference_Secrets}   secrets   - Secrets.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_ResolveSecretReference_Returns}
 *
 * @since 4.0.0
 */
function resolveSecretReference(
  reference: Lib_MessageRoutingFeatures_ResolveSecretReference_Reference,
  secrets: Lib_MessageRoutingFeatures_ResolveSecretReference_Secrets,
): Lib_MessageRoutingFeatures_ResolveSecretReference_Returns {
  const secret: Lib_MessageRoutingFeatures_ResolveSecretReference_Secret = secrets(reference['$secret']);

  if (secret === undefined || secret.length === 0) {
    throw new Error(`Required encrypted secret is unavailable: ${reference['$secret']}`);
  }

  return secret;
}

/**
 * Message Routing Features - Send Copier Message.
 *
 * Sends bounded text to approved same-guild channels or encrypted webhooks.
 * Each destination failure is logged without exposing webhook credentials.
 *
 * @param {Lib_MessageRoutingFeatures_SendCopierMessage_Message} message - Message.
 * @param {Lib_MessageRoutingFeatures_SendCopierMessage_Rule}    rule    - Rule.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_SendCopierMessage_Returns}
 *
 * @since 4.0.0
 */
async function sendCopierMessage(
  message: Lib_MessageRoutingFeatures_SendCopierMessage_Message,
  rule: Lib_MessageRoutingFeatures_SendCopierMessage_Rule,
): Lib_MessageRoutingFeatures_SendCopierMessage_Returns {
  const content: Lib_MessageRoutingFeatures_SendCopierMessage_Content = formatCopierContent(message, rule);

  for (const destination of rule['destinations']) {
    try {
      if (destination['kind'] === 'channel') {
        const channel: Lib_MessageRoutingFeatures_SendCopierMessage_Channel = await message['guild']['channels'].fetch(
          destination['channelIdentifier'],
        );

        if (channel === null || channel.isSendable() === false) {
          throw new Error('Configured message-copier channel is unavailable.');
        }

        await channel.send({
          allowedMentions: {
            parse: [],
          },
          content,
        });
      } else {
        const webhookClient: Lib_MessageRoutingFeatures_SendCopierMessage_WebhookClient = new WebhookClient({
          url: destination['url'],
        });

        try {
          await webhookClient.send({
            allowedMentions: {
              parse: [],
            },
            content,
            ...(destination['avatarUrl'] === undefined) ? {} : {
              avatarURL: destination['avatarUrl'],
            },
            ...(destination['username'] === undefined) ? {} : {
              username: destination['username'],
            },
          });
        } finally {
          webhookClient.destroy();
        }
      }

      writeLog('info', 'bot', 'message_copier_delivered', {
        destinationKind: destination['kind'],
        messageIdentifier: message['id'],
        ruleName: rule['name'],
      });
    } catch (error) {
      writeLog('error', 'bot', 'message_copier_delivery_failed', {
        destinationKind: destination['kind'],
        error: getErrorMessage(error),
        messageIdentifier: message['id'],
        ruleName: rule['name'],
      });
    }
  }

  return;
}

/**
 * Message Routing Features - Send Proxy Message.
 *
 * Relays bounded bot content and embeds through one encrypted Discord webhook.
 * Automatic mentions, TTS, raw payload logging, and attachment downloads stay disabled.
 *
 * @param {Lib_MessageRoutingFeatures_SendProxyMessage_Message} message - Message.
 * @param {Lib_MessageRoutingFeatures_SendProxyMessage_Rule}    rule    - Rule.
 *
 * @private
 *
 * @returns {Lib_MessageRoutingFeatures_SendProxyMessage_Returns}
 *
 * @since 4.0.0
 */
async function sendProxyMessage(
  message: Lib_MessageRoutingFeatures_SendProxyMessage_Message,
  rule: Lib_MessageRoutingFeatures_SendProxyMessage_Rule,
): Lib_MessageRoutingFeatures_SendProxyMessage_Returns {
  const attachmentContent: Lib_MessageRoutingFeatures_SendProxyMessage_AttachmentContent = appendAttachmentLinks(
    message,
    '',
    true,
  );
  const content: Lib_MessageRoutingFeatures_SendProxyMessage_Content = applyReplacements(
    [
      message['content'],
      attachmentContent,
    ].filter((section) => section.length > 0).join('\n\n'),
    rule['replacements'],
  ).replaceAll('%YEAR%', new Date().getUTCFullYear().toString()).slice(0, 2_000);
  const embeds: Lib_MessageRoutingFeatures_SendProxyMessage_Embeds = message['embeds']
    .slice(0, 10)
    .map((embed) => embed.toJSON());

  if (content.length === 0 && embeds.length === 0) {
    return;
  }

  const webhookClient: Lib_MessageRoutingFeatures_SendProxyMessage_WebhookClient = new WebhookClient({
    url: rule['webhookUrl'],
  });

  try {
    await webhookClient.send({
      allowedMentions: {
        parse: [],
      },
      avatarURL: message['author'].displayAvatarURL(),
      ...(content.length === 0) ? {} : {
        content,
      },
      embeds,
      username: message['author']['username'],
    });

    writeLog('info', 'bot', 'message_proxy_delivered', {
      messageIdentifier: message['id'],
      ruleName: rule['name'],
    });
  } catch (error) {
    writeLog('error', 'bot', 'message_proxy_delivery_failed', {
      error: getErrorMessage(error),
      messageIdentifier: message['id'],
      ruleName: rule['name'],
    });
  } finally {
    webhookClient.destroy();
  }

  return;
}
