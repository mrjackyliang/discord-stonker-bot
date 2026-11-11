import {
  Events,
  GatewayIntentBits,
  GuildScheduledEventEntityType,
  GuildScheduledEventStatus,
} from 'discord.js';
import { z } from 'zod';

import { timeFeatureHandler } from './debug-timing.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import { LIB_REGEX_PATTERN_DISCORD_IDENTIFIER } from './regex.js';

import type {
  Lib_GatewayFeatures_CompileBroadcastAlerts_Configuration,
  Lib_GatewayFeatures_CompileBroadcastAlerts_Parsed,
  Lib_GatewayFeatures_CompileBroadcastAlerts_Returns,
  Lib_GatewayFeatures_CompileBumpThreads_Configuration,
  Lib_GatewayFeatures_CompileBumpThreads_Parsed,
  Lib_GatewayFeatures_CompileBumpThreads_Returns,
  Lib_GatewayFeatures_CompileRoleMessages_Configuration,
  Lib_GatewayFeatures_CompileRoleMessages_Parsed,
  Lib_GatewayFeatures_CompileRoleMessages_Returns,
  Lib_GatewayFeatures_CreateRegistration_Returns,
  Lib_GatewayFeatures_CreateRegistration_Runtime,
  Lib_GatewayFeatures_DoesRoleMessageMatch_NewMember,
  Lib_GatewayFeatures_DoesRoleMessageMatch_OldMember,
  Lib_GatewayFeatures_DoesRoleMessageMatch_Returns,
  Lib_GatewayFeatures_DoesRoleMessageMatch_Rule,
  Lib_GatewayFeatures_FormatConfigurationError_Error,
  Lib_GatewayFeatures_FormatConfigurationError_Messages,
  Lib_GatewayFeatures_FormatConfigurationError_Returns,
  Lib_GatewayFeatures_FormatRoleMessage_CurrentYear,
  Lib_GatewayFeatures_FormatRoleMessage_Member,
  Lib_GatewayFeatures_FormatRoleMessage_Parts,
  Lib_GatewayFeatures_FormatRoleMessage_Returns,
  Lib_GatewayFeatures_FormatRoleMessage_Rule,
  Lib_GatewayFeatures_FormatScheduledEventMessage_ChannelTag,
  Lib_GatewayFeatures_FormatScheduledEventMessage_Content,
  Lib_GatewayFeatures_FormatScheduledEventMessage_CreatorTag,
  Lib_GatewayFeatures_FormatScheduledEventMessage_Description,
  Lib_GatewayFeatures_FormatScheduledEventMessage_Event,
  Lib_GatewayFeatures_FormatScheduledEventMessage_EventName,
  Lib_GatewayFeatures_FormatScheduledEventMessage_Location,
  Lib_GatewayFeatures_FormatScheduledEventMessage_Returns,
  Lib_GatewayFeatures_FormatScheduledEventMessage_Rule,
  Lib_GatewayFeatures_FormatScheduledEventMessage_ScheduledTime,
  Lib_GatewayFeatures_FormatScheduledEventMessage_UserCount,
  Lib_GatewayFeatures_GetEnabledFeature_FeatureKey,
  Lib_GatewayFeatures_GetEnabledFeature_Features,
  Lib_GatewayFeatures_GetEnabledFeature_RawFeature,
  Lib_GatewayFeatures_GetEnabledFeature_Returns,
  Lib_GatewayFeatures_GetEnabledFeature_Settings,
  Lib_GatewayFeatures_GetEventEntityType_Event,
  Lib_GatewayFeatures_GetEventEntityType_Returns,
  Lib_GatewayFeatures_GetEventStatus_Event,
  Lib_GatewayFeatures_GetEventStatus_Returns,
  Lib_GatewayFeatures_HandleBroadcastEvent_Client,
  Lib_GatewayFeatures_HandleBroadcastEvent_EntityType,
  Lib_GatewayFeatures_HandleBroadcastEvent_Event,
  Lib_GatewayFeatures_HandleBroadcastEvent_Guild,
  Lib_GatewayFeatures_HandleBroadcastEvent_GuildIdentifier,
  Lib_GatewayFeatures_HandleBroadcastEvent_MatchingRules,
  Lib_GatewayFeatures_HandleBroadcastEvent_Returns,
  Lib_GatewayFeatures_HandleBroadcastEvent_Rules,
  Lib_GatewayFeatures_HandleBroadcastEvent_Status,
  Lib_GatewayFeatures_HandleBroadcastEvent_Tasks,
  Lib_GatewayFeatures_HandleRoleMessages_GuildIdentifier,
  Lib_GatewayFeatures_HandleRoleMessages_MatchingRules,
  Lib_GatewayFeatures_HandleRoleMessages_NewMember,
  Lib_GatewayFeatures_HandleRoleMessages_OldMember,
  Lib_GatewayFeatures_HandleRoleMessages_Returns,
  Lib_GatewayFeatures_HandleRoleMessages_Rules,
  Lib_GatewayFeatures_HandleRoleMessages_Tasks,
  Lib_GatewayFeatures_HandleThreadUpdate_GuildIdentifier,
  Lib_GatewayFeatures_HandleThreadUpdate_Returns,
  Lib_GatewayFeatures_HandleThreadUpdate_Rule,
  Lib_GatewayFeatures_HandleThreadUpdate_Rules,
  Lib_GatewayFeatures_HandleThreadUpdate_Thread,
  Lib_GatewayFeatures_IsRecord_TypeGuard,
  Lib_GatewayFeatures_IsRecord_Value,
  Lib_GatewayFeatures_PrepareGatewayFeatures_ActiveFeatureKeys,
  Lib_GatewayFeatures_PrepareGatewayFeatures_BroadcastFeature,
  Lib_GatewayFeatures_PrepareGatewayFeatures_BumpThreadFeature,
  Lib_GatewayFeatures_PrepareGatewayFeatures_ConfigurationErrors,
  Lib_GatewayFeatures_PrepareGatewayFeatures_Intents,
  Lib_GatewayFeatures_PrepareGatewayFeatures_Returns,
  Lib_GatewayFeatures_PrepareGatewayFeatures_RoleMessageFeature,
  Lib_GatewayFeatures_PrepareGatewayFeatures_Runtime,
  Lib_GatewayFeatures_PrepareGatewayFeatures_Settings,
  Lib_GatewayFeatures_ReconcileConfiguredThreads_Client,
  Lib_GatewayFeatures_ReconcileConfiguredThreads_Guild,
  Lib_GatewayFeatures_ReconcileConfiguredThreads_GuildIdentifier,
  Lib_GatewayFeatures_ReconcileConfiguredThreads_Returns,
  Lib_GatewayFeatures_ReconcileConfiguredThreads_Rules,
  Lib_GatewayFeatures_ReconcileConfiguredThreads_Tasks,
  Lib_GatewayFeatures_ReconcileThread_Channel,
  Lib_GatewayFeatures_ReconcileThread_Guild,
  Lib_GatewayFeatures_ReconcileThread_Returns,
  Lib_GatewayFeatures_ReconcileThread_Rule,
  Lib_GatewayFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_GatewayFeatures_RecordConfigurationError_Error,
  Lib_GatewayFeatures_RecordConfigurationError_FeatureKey,
  Lib_GatewayFeatures_RecordConfigurationError_Message,
  Lib_GatewayFeatures_RecordConfigurationError_Returns,
  Lib_GatewayFeatures_SendGuildMessage_Channel,
  Lib_GatewayFeatures_SendGuildMessage_ChannelIdentifier,
  Lib_GatewayFeatures_SendGuildMessage_Content,
  Lib_GatewayFeatures_SendGuildMessage_ContextName,
  Lib_GatewayFeatures_SendGuildMessage_Guild,
  Lib_GatewayFeatures_SendGuildMessage_Returns,
} from '../types/lib/gateway-features.d.ts';

/**
 * Gateway Features - Broadcast Alerts Schema.
 *
 * Adds an explicit Discord destination to the archived event matcher so the
 * replacement never inherits the removed Twitter publishing side effect.
 *
 * @since 4.0.0
 */
export const broadcastAlertsSchema = z.array(z.object({
  'channel': z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  'creator': z.object({
    'user-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }).optional(),
  'entity-types': z.array(z.enum([
    'EXTERNAL',
    'STAGE_INSTANCE',
    'VOICE',
  ])).min(1).max(3),
  'message': z.string().trim().min(1).max(2_000),
  'name': z.string().trim().min(1).max(100),
  'status': z.enum([
    'ACTIVE',
    'CANCELED',
    'COMPLETED',
    'SCHEDULED',
    'UPDATED',
  ]),
})).min(1).max(100);

/**
 * Gateway Features - Bump Threads Schema.
 *
 * Bounds archived thread references and preserves their expected parent
 * channels so a stale identifier cannot silently target another location.
 *
 * @since 4.0.0
 */
export const bumpThreadsSchema = z.array(z.object({
  channel: z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  name: z.string().trim().min(1).max(100),
  thread: z.object({
    'thread-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
})).min(1).max(100);

/**
 * Gateway Features - Role Messages Schema.
 *
 * Narrows legacy message payloads to bounded text while retaining role-change
 * direction, channel routing, member mention, and year placeholders.
 *
 * @since 4.0.0
 */
export const roleMessagesSchema = z.array(z.object({
  channel: z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  direction: z.enum([
    'add',
    'remove',
  ]),
  name: z.string().trim().min(1).max(100),
  payload: z.object({
    content: z.string().trim().min(1).max(2_000).optional(),
    footer: z.object({
      text: z.string().trim().min(1).max(1_000),
    }).optional(),
  }).refine(
    (payload) => payload['content'] !== undefined || payload['footer'] !== undefined,
    'A role message needs content or footer text.',
  ),
  role: z.object({
    'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
})).min(1).max(100);

/**
 * Gateway Features - Compile Broadcast Alerts.
 *
 * Converts validated scheduled-event matchers into the compact runtime shape.
 * A destination channel is mandatory because the old X sender was removed.
 *
 * @param {Lib_GatewayFeatures_CompileBroadcastAlerts_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_CompileBroadcastAlerts_Returns}
 *
 * @since 4.0.0
 */
function compileBroadcastAlerts(
  configuration: Lib_GatewayFeatures_CompileBroadcastAlerts_Configuration,
): Lib_GatewayFeatures_CompileBroadcastAlerts_Returns {
  const parsed: Lib_GatewayFeatures_CompileBroadcastAlerts_Parsed = broadcastAlertsSchema.parse(configuration);

  return parsed.map((rule) => ({
    channelIdentifier: rule['channel']['channel-id'],
    creatorIdentifier: (rule['creator'] === undefined) ? undefined : rule['creator']['user-id'],
    entityTypes: rule['entity-types'],
    message: rule['message'],
    name: rule['name'],
    status: rule['status'],
  }));
}

/**
 * Gateway Features - Compile Bump Threads.
 *
 * Converts validated parent and thread references into reconciliation rules.
 * The expected parent remains attached for runtime identity verification.
 *
 * @param {Lib_GatewayFeatures_CompileBumpThreads_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_CompileBumpThreads_Returns}
 *
 * @since 4.0.0
 */
function compileBumpThreads(
  configuration: Lib_GatewayFeatures_CompileBumpThreads_Configuration,
): Lib_GatewayFeatures_CompileBumpThreads_Returns {
  const parsed: Lib_GatewayFeatures_CompileBumpThreads_Parsed = bumpThreadsSchema.parse(configuration);

  return parsed.map((rule) => ({
    channelIdentifier: rule['channel']['channel-id'],
    name: rule['name'],
    threadIdentifier: rule['thread']['thread-id'],
  }));
}

/**
 * Gateway Features - Compile Role Messages.
 *
 * Converts validated legacy role routes into bounded text-only runtime rules.
 * Unsupported embed properties are discarded at this validation boundary.
 *
 * @param {Lib_GatewayFeatures_CompileRoleMessages_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_CompileRoleMessages_Returns}
 *
 * @since 4.0.0
 */
function compileRoleMessages(
  configuration: Lib_GatewayFeatures_CompileRoleMessages_Configuration,
): Lib_GatewayFeatures_CompileRoleMessages_Returns {
  const parsed: Lib_GatewayFeatures_CompileRoleMessages_Parsed = roleMessagesSchema.parse(configuration);

  return parsed.map((rule) => ({
    channelIdentifier: rule['channel']['channel-id'],
    content: rule['payload']['content'],
    direction: rule['direction'],
    footerText: (rule['payload']['footer'] === undefined) ? undefined : rule['payload']['footer']['text'],
    name: rule['name'],
    roleIdentifier: rule['role']['role-id'],
  }));
}

/**
 * Gateway Features - Create Registration.
 *
 * Registers only the listeners needed by successfully compiled modules.
 * Listener failures are isolated and logged without stopping the Gateway.
 *
 * @param {Lib_GatewayFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_GatewayFeatures_CreateRegistration_Runtime,
): Lib_GatewayFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    if (runtime['bumpThreads'].length > 0) {
      client.on(Events.ClientReady, () => {
        void timeFeatureHandler('gateway', Events.ClientReady, guildIdentifier, () => reconcileConfiguredThreads(client, guildIdentifier, runtime['bumpThreads'])).catch((error) => {
          writeLog('error', 'bot', 'thread_startup_reconciliation_failed', {
            error: getErrorMessage(error),
            guildIdentifier,
          });

          return;
        });

        return;
      });

      client.on(Events.ThreadUpdate, (_oldThread, newThread) => {
        void timeFeatureHandler('gateway', Events.ThreadUpdate, guildIdentifier, () => handleThreadUpdate(newThread, guildIdentifier, runtime['bumpThreads'])).catch((error) => {
          writeLog('error', 'bot', 'thread_update_reconciliation_failed', {
            error: getErrorMessage(error),
            guildIdentifier,
            threadIdentifier: newThread['id'],
          });

          return;
        });

        return;
      });
    }

    if (runtime['broadcastAlerts'].length > 0) {
      client.on(Events.GuildScheduledEventCreate, (event) => {
        void timeFeatureHandler('gateway', Events.GuildScheduledEventCreate, guildIdentifier, () => handleBroadcastEvent(
          client,
          event,
          guildIdentifier,
          runtime['broadcastAlerts'],
          getEventStatus(event),
        )).catch((error) => {
          writeLog('error', 'bot', 'broadcast_event_create_failed', {
            error: getErrorMessage(error),
            eventIdentifier: event['id'],
          });

          return;
        });

        return;
      });

      client.on(Events.GuildScheduledEventUpdate, (oldEvent, newEvent) => {
        void timeFeatureHandler('gateway', Events.GuildScheduledEventUpdate, guildIdentifier, () => handleBroadcastEvent(
          client,
          newEvent,
          guildIdentifier,
          runtime['broadcastAlerts'],
          (oldEvent !== null && oldEvent['status'] === newEvent['status']) ? 'UPDATED' : getEventStatus(newEvent),
        )).catch((error) => {
          writeLog('error', 'bot', 'broadcast_event_update_failed', {
            error: getErrorMessage(error),
            eventIdentifier: newEvent['id'],
          });

          return;
        });

        return;
      });

      client.on(Events.GuildScheduledEventDelete, (event) => {
        void timeFeatureHandler('gateway', Events.GuildScheduledEventDelete, guildIdentifier, () => handleBroadcastEvent(
          client,
          event,
          guildIdentifier,
          runtime['broadcastAlerts'],
          'CANCELED',
        )).catch((error) => {
          writeLog('error', 'bot', 'broadcast_event_delete_failed', {
            error: getErrorMessage(error),
            eventIdentifier: event['id'],
          });

          return;
        });

        return;
      });
    }

    if (runtime['roleMessages'].length > 0) {
      client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
        void timeFeatureHandler('gateway', Events.GuildMemberUpdate, guildIdentifier, () => handleRoleMessages(
          oldMember,
          newMember,
          guildIdentifier,
          runtime['roleMessages'],
        )).catch((error) => {
          writeLog('error', 'bot', 'role_message_dispatch_failed', {
            error: getErrorMessage(error),
            guildIdentifier,
            userIdentifier: newMember['id'],
          });

          return;
        });

        return;
      });
    }

    return;
  };
}

/**
 * Gateway Features - Does Role Message Match.
 *
 * Compares old and new role caches for the exact configured transition.
 * Add and remove rules remain mutually exclusive for one member update.
 *
 * @param {Lib_GatewayFeatures_DoesRoleMessageMatch_OldMember} oldMember - Old member.
 * @param {Lib_GatewayFeatures_DoesRoleMessageMatch_NewMember} newMember - New member.
 * @param {Lib_GatewayFeatures_DoesRoleMessageMatch_Rule}      rule      - Rule.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_DoesRoleMessageMatch_Returns}
 *
 * @since 4.0.0
 */
function doesRoleMessageMatch(
  oldMember: Lib_GatewayFeatures_DoesRoleMessageMatch_OldMember,
  newMember: Lib_GatewayFeatures_DoesRoleMessageMatch_NewMember,
  rule: Lib_GatewayFeatures_DoesRoleMessageMatch_Rule,
): Lib_GatewayFeatures_DoesRoleMessageMatch_Returns {
  if (rule['direction'] === 'add') {
    return (
      oldMember['roles']['cache'].has(rule['roleIdentifier']) === false
      && newMember['roles']['cache'].has(rule['roleIdentifier']) === true
    );
  }

  return (
    oldMember['roles']['cache'].has(rule['roleIdentifier']) === true
    && newMember['roles']['cache'].has(rule['roleIdentifier']) === false
  );
}

/**
 * Gateway Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without echoing submitted values.
 * Unexpected failures use the shared bounded error-message conversion.
 *
 * @param {Lib_GatewayFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_GatewayFeatures_FormatConfigurationError_Error,
): Lib_GatewayFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_GatewayFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Gateway Features - Format Role Message.
 *
 * Applies supported legacy placeholders and combines the old embed footer into
 * plain text so imported payloads cannot inject arbitrary Discord structures.
 *
 * @param {Lib_GatewayFeatures_FormatRoleMessage_Member} member - Member.
 * @param {Lib_GatewayFeatures_FormatRoleMessage_Rule}   rule   - Rule.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_FormatRoleMessage_Returns}
 *
 * @since 4.0.0
 */
function formatRoleMessage(
  member: Lib_GatewayFeatures_FormatRoleMessage_Member,
  rule: Lib_GatewayFeatures_FormatRoleMessage_Rule,
): Lib_GatewayFeatures_FormatRoleMessage_Returns {
  const currentYear: Lib_GatewayFeatures_FormatRoleMessage_CurrentYear = String(new Date().getUTCFullYear());
  const parts: Lib_GatewayFeatures_FormatRoleMessage_Parts = [
    rule['content'],
    rule['footerText'],
  ].filter((part) => part !== undefined).map((part) => part
    .replaceAll('%MEMBER_MENTION%', `<@${member['id']}>`)
    .replaceAll('%YEAR%', currentYear));

  return parts.join('\n').slice(0, 2_000);
}

/**
 * Gateway Features - Format Scheduled Event Message.
 *
 * Applies the archived event placeholders using current Discord timestamps and
 * safe fallbacks for optional scheduled-event properties.
 *
 * @param {Lib_GatewayFeatures_FormatScheduledEventMessage_Event} event - Event.
 * @param {Lib_GatewayFeatures_FormatScheduledEventMessage_Rule}  rule  - Rule.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_FormatScheduledEventMessage_Returns}
 *
 * @since 4.0.0
 */
function formatScheduledEventMessage(
  event: Lib_GatewayFeatures_FormatScheduledEventMessage_Event,
  rule: Lib_GatewayFeatures_FormatScheduledEventMessage_Rule,
): Lib_GatewayFeatures_FormatScheduledEventMessage_Returns {
  const channelTag: Lib_GatewayFeatures_FormatScheduledEventMessage_ChannelTag = (event['channelId'] === null) ? '' : `<#${event['channelId']}>`;
  const creatorTag: Lib_GatewayFeatures_FormatScheduledEventMessage_CreatorTag = (event['creatorId'] === null) ? 'Unknown creator' : `<@${event['creatorId']}>`;
  const description: Lib_GatewayFeatures_FormatScheduledEventMessage_Description = event['description'] ?? 'No description';
  const eventName: Lib_GatewayFeatures_FormatScheduledEventMessage_EventName = event['name'] ?? 'Unnamed event';
  const location: Lib_GatewayFeatures_FormatScheduledEventMessage_Location = (event['entityMetadata'] === null) ? '' : event['entityMetadata']['location'] ?? '';
  const scheduledTime: Lib_GatewayFeatures_FormatScheduledEventMessage_ScheduledTime = (event['scheduledStartTimestamp'] === null) ? 'Not scheduled' : `<t:${Math.floor(event['scheduledStartTimestamp'] / 1_000)}:F>`;
  const userCount: Lib_GatewayFeatures_FormatScheduledEventMessage_UserCount = String(event['userCount'] ?? 0);
  const content: Lib_GatewayFeatures_FormatScheduledEventMessage_Content = rule['message']
    .replaceAll('%CHANNEL_TAG%', channelTag)
    .replaceAll('%CREATOR_TAG%', creatorTag)
    .replaceAll('%EVENT_DESCRIPTION%', description)
    .replaceAll('%EVENT_NAME%', eventName)
    .replaceAll('%LOCATION%', location)
    .replaceAll('%SCHEDULED_TIME%', scheduledTime)
    .replaceAll('%USER_COUNT%', userCount);

  return content.slice(0, 2_000);
}

/**
 * Gateway Features - Get Enabled Feature.
 *
 * Reads one feature switch without trusting the surrounding JSON structure.
 * Disabled or absent modules never register listeners or request intents.
 *
 * @param {Lib_GatewayFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_GatewayFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_GatewayFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_GatewayFeatures_GetEnabledFeature_FeatureKey,
): Lib_GatewayFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_GatewayFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_GatewayFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_GatewayFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Gateway Features - Get Event Entity Type.
 *
 * Maps discord.js numeric scheduled-event kinds to archived matcher labels.
 * Validation already limits rules to the three Discord event entity kinds.
 *
 * @param {Lib_GatewayFeatures_GetEventEntityType_Event} event - Event.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_GetEventEntityType_Returns}
 *
 * @since 4.0.0
 */
function getEventEntityType(
  event: Lib_GatewayFeatures_GetEventEntityType_Event,
): Lib_GatewayFeatures_GetEventEntityType_Returns {
  if (event['entityType'] === GuildScheduledEventEntityType.StageInstance) {
    return 'STAGE_INSTANCE';
  }

  if (event['entityType'] === GuildScheduledEventEntityType.Voice) {
    return 'VOICE';
  }

  return 'EXTERNAL';
}

/**
 * Gateway Features - Get Event Status.
 *
 * Maps discord.js numeric lifecycle values to archived matcher labels.
 * Same-status edits are classified separately by the update listener.
 *
 * @param {Lib_GatewayFeatures_GetEventStatus_Event} event - Event.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_GetEventStatus_Returns}
 *
 * @since 4.0.0
 */
function getEventStatus(
  event: Lib_GatewayFeatures_GetEventStatus_Event,
): Lib_GatewayFeatures_GetEventStatus_Returns {
  if (event['status'] === GuildScheduledEventStatus.Active) {
    return 'ACTIVE';
  }

  if (event['status'] === GuildScheduledEventStatus.Completed) {
    return 'COMPLETED';
  }

  if (event['status'] === GuildScheduledEventStatus.Canceled) {
    return 'CANCELED';
  }

  return 'SCHEDULED';
}

/**
 * Gateway Features - Handle Broadcast Event.
 *
 * Sends every matching event rule to its configured guild channel with
 * automatic mentions disabled.
 *
 * @param {Lib_GatewayFeatures_HandleBroadcastEvent_Client}          client          - Client.
 * @param {Lib_GatewayFeatures_HandleBroadcastEvent_Event}           event           - Event.
 * @param {Lib_GatewayFeatures_HandleBroadcastEvent_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_GatewayFeatures_HandleBroadcastEvent_Rules}           rules           - Rules.
 * @param {Lib_GatewayFeatures_HandleBroadcastEvent_Status}          status          - Status.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_HandleBroadcastEvent_Returns}
 *
 * @since 4.0.0
 */
async function handleBroadcastEvent(
  client: Lib_GatewayFeatures_HandleBroadcastEvent_Client,
  event: Lib_GatewayFeatures_HandleBroadcastEvent_Event,
  guildIdentifier: Lib_GatewayFeatures_HandleBroadcastEvent_GuildIdentifier,
  rules: Lib_GatewayFeatures_HandleBroadcastEvent_Rules,
  status: Lib_GatewayFeatures_HandleBroadcastEvent_Status,
): Lib_GatewayFeatures_HandleBroadcastEvent_Returns {
  if (event['guildId'] !== guildIdentifier) {
    return;
  }

  const entityType: Lib_GatewayFeatures_HandleBroadcastEvent_EntityType = getEventEntityType(event);
  const matchingRules: Lib_GatewayFeatures_HandleBroadcastEvent_MatchingRules = rules.filter((rule) => (
    rule['status'] === status
    && rule['entityTypes'].includes(entityType) === true
    && (
      rule['creatorIdentifier'] === undefined
      || rule['creatorIdentifier'] === event['creatorId']
    )
  ));

  if (matchingRules.length === 0) {
    return;
  }

  const guild: Lib_GatewayFeatures_HandleBroadcastEvent_Guild = await client['guilds'].fetch(guildIdentifier);
  const tasks: Lib_GatewayFeatures_HandleBroadcastEvent_Tasks = matchingRules.map((rule) => sendGuildMessage(
    guild,
    rule['channelIdentifier'],
    formatScheduledEventMessage(event, rule),
    rule['name'],
  ));

  await Promise.all(tasks);

  return;
}

/**
 * Gateway Features - Handle Role Messages.
 *
 * Detects configured role additions and removals from Discord's old/new member
 * snapshots, then sends bounded notifications to approved channels.
 *
 * @param {Lib_GatewayFeatures_HandleRoleMessages_OldMember}       oldMember       - Old member.
 * @param {Lib_GatewayFeatures_HandleRoleMessages_NewMember}       newMember       - New member.
 * @param {Lib_GatewayFeatures_HandleRoleMessages_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_GatewayFeatures_HandleRoleMessages_Rules}           rules           - Rules.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_HandleRoleMessages_Returns}
 *
 * @since 4.0.0
 */
async function handleRoleMessages(
  oldMember: Lib_GatewayFeatures_HandleRoleMessages_OldMember,
  newMember: Lib_GatewayFeatures_HandleRoleMessages_NewMember,
  guildIdentifier: Lib_GatewayFeatures_HandleRoleMessages_GuildIdentifier,
  rules: Lib_GatewayFeatures_HandleRoleMessages_Rules,
): Lib_GatewayFeatures_HandleRoleMessages_Returns {
  if (newMember['guild']['id'] !== guildIdentifier || newMember['user']['bot'] === true) {
    return;
  }

  const matchingRules: Lib_GatewayFeatures_HandleRoleMessages_MatchingRules = rules.filter(
    (rule) => doesRoleMessageMatch(oldMember, newMember, rule) === true,
  );
  const tasks: Lib_GatewayFeatures_HandleRoleMessages_Tasks = matchingRules.map((rule) => sendGuildMessage(
    newMember['guild'],
    rule['channelIdentifier'],
    formatRoleMessage(newMember, rule),
    rule['name'],
  ));

  await Promise.all(tasks);

  return;
}

/**
 * Gateway Features - Handle Thread Update.
 *
 * Reopens a configured thread as soon as Discord reports it archived.
 * Updates from other servers and unrelated threads are ignored.
 *
 * @param {Lib_GatewayFeatures_HandleThreadUpdate_Thread}          thread          - Thread.
 * @param {Lib_GatewayFeatures_HandleThreadUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_GatewayFeatures_HandleThreadUpdate_Rules}           rules           - Rules.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_HandleThreadUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleThreadUpdate(
  thread: Lib_GatewayFeatures_HandleThreadUpdate_Thread,
  guildIdentifier: Lib_GatewayFeatures_HandleThreadUpdate_GuildIdentifier,
  rules: Lib_GatewayFeatures_HandleThreadUpdate_Rules,
): Lib_GatewayFeatures_HandleThreadUpdate_Returns {
  if (thread['guildId'] !== guildIdentifier || thread['archived'] !== true) {
    return;
  }

  const rule: Lib_GatewayFeatures_HandleThreadUpdate_Rule = rules.find(
    (candidate) => candidate['threadIdentifier'] === thread['id'],
  );

  if (rule === undefined) {
    return;
  }

  await reconcileThread(thread['guild'], rule);

  return;
}

/**
 * Gateway Features - Is Record.
 *
 * Narrows imported JSON objects before reading feature switch properties.
 * Arrays and null are intentionally excluded from feature state objects.
 *
 * @param {Lib_GatewayFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_GatewayFeatures_IsRecord_Value,
): value is Lib_GatewayFeatures_IsRecord_TypeGuard {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}

/**
 * Gateway Features - Prepare Gateway Features.
 *
 * Compiles enabled event modules before the Discord client is created. Invalid
 * modules remain inactive and cannot request intents or register listeners.
 *
 * @param {Lib_GatewayFeatures_PrepareGatewayFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_GatewayFeatures_PrepareGatewayFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareGatewayFeatures(
  settings: Lib_GatewayFeatures_PrepareGatewayFeatures_Settings,
): Lib_GatewayFeatures_PrepareGatewayFeatures_Returns {
  const runtime: Lib_GatewayFeatures_PrepareGatewayFeatures_Runtime = {
    broadcastAlerts: [],
    bumpThreads: [],
    roleMessages: [],
  };
  const activeFeatureKeys: Lib_GatewayFeatures_PrepareGatewayFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_GatewayFeatures_PrepareGatewayFeatures_ConfigurationErrors = [];
  const broadcastFeature: Lib_GatewayFeatures_PrepareGatewayFeatures_BroadcastFeature = getEnabledFeature(
    settings,
    'broadcast-alerts',
  );

  if (broadcastFeature !== undefined) {
    try {
      Reflect.set(runtime, 'broadcastAlerts', compileBroadcastAlerts(broadcastFeature['configuration']));

      activeFeatureKeys.push('broadcast-alerts');
    } catch (error) {
      recordConfigurationError('broadcast-alerts', error, configurationErrors);
    }
  }

  const bumpThreadFeature: Lib_GatewayFeatures_PrepareGatewayFeatures_BumpThreadFeature = getEnabledFeature(
    settings,
    'bump-threads',
  );

  if (bumpThreadFeature !== undefined) {
    try {
      Reflect.set(runtime, 'bumpThreads', compileBumpThreads(bumpThreadFeature['configuration']));

      activeFeatureKeys.push('bump-threads');
    } catch (error) {
      recordConfigurationError('bump-threads', error, configurationErrors);
    }
  }

  const roleMessageFeature: Lib_GatewayFeatures_PrepareGatewayFeatures_RoleMessageFeature = getEnabledFeature(
    settings,
    'role-messages',
  );

  if (roleMessageFeature !== undefined) {
    try {
      Reflect.set(runtime, 'roleMessages', compileRoleMessages(roleMessageFeature['configuration']));

      activeFeatureKeys.push('role-messages');
    } catch (error) {
      recordConfigurationError('role-messages', error, configurationErrors);
    }
  }

  const intents: Lib_GatewayFeatures_PrepareGatewayFeatures_Intents = [];

  if (activeFeatureKeys.includes('broadcast-alerts') === true) {
    intents.push(GatewayIntentBits.GuildScheduledEvents);
  }

  if (activeFeatureKeys.includes('role-messages') === true) {
    intents.push(GatewayIntentBits.GuildMembers);
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: createRegistration(runtime),
  };
}

/**
 * Gateway Features - Reconcile Configured Threads.
 *
 * Fetches the configured guild after login and reopens every archived thread in
 * parallel. Individual failures are logged without blocking other rules.
 *
 * @param {Lib_GatewayFeatures_ReconcileConfiguredThreads_Client}          client          - Client.
 * @param {Lib_GatewayFeatures_ReconcileConfiguredThreads_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_GatewayFeatures_ReconcileConfiguredThreads_Rules}           rules           - Rules.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_ReconcileConfiguredThreads_Returns}
 *
 * @since 4.0.0
 */
async function reconcileConfiguredThreads(
  client: Lib_GatewayFeatures_ReconcileConfiguredThreads_Client,
  guildIdentifier: Lib_GatewayFeatures_ReconcileConfiguredThreads_GuildIdentifier,
  rules: Lib_GatewayFeatures_ReconcileConfiguredThreads_Rules,
): Lib_GatewayFeatures_ReconcileConfiguredThreads_Returns {
  const guild: Lib_GatewayFeatures_ReconcileConfiguredThreads_Guild = await client['guilds'].fetch(guildIdentifier);
  const tasks: Lib_GatewayFeatures_ReconcileConfiguredThreads_Tasks = rules.map(async (rule) => {
    try {
      await reconcileThread(guild, rule);
    } catch (error) {
      writeLog('error', 'bot', 'configured_thread_reconciliation_failed', {
        error: getErrorMessage(error),
        ruleName: rule['name'],
        threadIdentifier: rule['threadIdentifier'],
      });
    }

    return;
  });

  await Promise.all(tasks);

  return;
}

/**
 * Gateway Features - Reconcile Thread.
 *
 * Verifies the fetched channel is the configured thread under the expected
 * parent, then unarchives it only when necessary.
 *
 * @param {Lib_GatewayFeatures_ReconcileThread_Guild} guild - Guild.
 * @param {Lib_GatewayFeatures_ReconcileThread_Rule}  rule  - Rule.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_ReconcileThread_Returns}
 *
 * @since 4.0.0
 */
async function reconcileThread(
  guild: Lib_GatewayFeatures_ReconcileThread_Guild,
  rule: Lib_GatewayFeatures_ReconcileThread_Rule,
): Lib_GatewayFeatures_ReconcileThread_Returns {
  const channel: Lib_GatewayFeatures_ReconcileThread_Channel = await guild['channels'].fetch(rule['threadIdentifier']);

  if (channel === null || channel.isThread() === false) {
    throw new Error(`Configured thread is unavailable for rule: ${rule['name']}`);
  }

  if (channel['parentId'] !== rule['channelIdentifier']) {
    throw new Error(`Configured thread parent does not match for rule: ${rule['name']}`);
  }

  if (channel['archived'] === true) {
    await channel.setArchived(false, 'Configured thread visibility');

    writeLog('info', 'bot', 'configured_thread_unarchived', {
      ruleName: rule['name'],
      threadIdentifier: channel['id'],
    });
  }

  return;
}

/**
 * Gateway Features - Record Configuration Error.
 *
 * Adds safe panel-visible diagnostics and emits a structured startup warning.
 * The rejected module remains inactive while other valid modules continue.
 *
 * @param {Lib_GatewayFeatures_RecordConfigurationError_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_GatewayFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_GatewayFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  featureKey: Lib_GatewayFeatures_RecordConfigurationError_FeatureKey,
  error: Lib_GatewayFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_GatewayFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_GatewayFeatures_RecordConfigurationError_Returns {
  const message: Lib_GatewayFeatures_RecordConfigurationError_Message = `${featureKey}: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'gateway_feature_configuration_rejected', {
    featureKey,
    message,
  });

  return;
}

/**
 * Gateway Features - Send Guild Message.
 *
 * Fetches one approved destination and sends bounded text with all automatic
 * mentions disabled.
 *
 * @param {Lib_GatewayFeatures_SendGuildMessage_Guild}             guild             - Guild.
 * @param {Lib_GatewayFeatures_SendGuildMessage_ChannelIdentifier} channelIdentifier - Channel identifier.
 * @param {Lib_GatewayFeatures_SendGuildMessage_Content}           content           - Content.
 * @param {Lib_GatewayFeatures_SendGuildMessage_ContextName}       contextName       - Context name.
 *
 * @private
 *
 * @returns {Lib_GatewayFeatures_SendGuildMessage_Returns}
 *
 * @since 4.0.0
 */
async function sendGuildMessage(
  guild: Lib_GatewayFeatures_SendGuildMessage_Guild,
  channelIdentifier: Lib_GatewayFeatures_SendGuildMessage_ChannelIdentifier,
  content: Lib_GatewayFeatures_SendGuildMessage_Content,
  contextName: Lib_GatewayFeatures_SendGuildMessage_ContextName,
): Lib_GatewayFeatures_SendGuildMessage_Returns {
  const channel: Lib_GatewayFeatures_SendGuildMessage_Channel = await guild['channels'].fetch(channelIdentifier);

  if (channel === null || channel.isSendable() === false) {
    throw new Error(`Configured channel is not sendable for rule: ${contextName}`);
  }

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    content: content.slice(0, 2_000),
  });

  return;
}
