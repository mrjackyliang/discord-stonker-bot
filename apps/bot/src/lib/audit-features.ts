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
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_HTTP_URL,
} from './regex.js';

import type {
  Lib_AuditFeatures_CompileAuditFeatures_Channels,
  Lib_AuditFeatures_CompileAuditFeatures_Configuration,
  Lib_AuditFeatures_CompileAuditFeatures_EventConfiguration,
  Lib_AuditFeatures_CompileAuditFeatures_EventKeys,
  Lib_AuditFeatures_CompileAuditFeatures_ExcludedLinkPatterns,
  Lib_AuditFeatures_CompileAuditFeatures_IncludesLink,
  Lib_AuditFeatures_CompileAuditFeatures_Parsed,
  Lib_AuditFeatures_CompileAuditFeatures_Returns,
  Lib_AuditFeatures_CreateRegistration_Returns,
  Lib_AuditFeatures_CreateRegistration_Runtime,
  Lib_AuditFeatures_FindExternalLinkHosts_Candidates,
  Lib_AuditFeatures_FindExternalLinkHosts_Content,
  Lib_AuditFeatures_FindExternalLinkHosts_Excluded,
  Lib_AuditFeatures_FindExternalLinkHosts_ExcludedLinkPatterns,
  Lib_AuditFeatures_FindExternalLinkHosts_Hosts,
  Lib_AuditFeatures_FindExternalLinkHosts_ParsedUrl,
  Lib_AuditFeatures_FindExternalLinkHosts_Returns,
  Lib_AuditFeatures_FindExternalLinkHosts_UrlPattern,
  Lib_AuditFeatures_FormatConfigurationError_Error,
  Lib_AuditFeatures_FormatConfigurationError_Messages,
  Lib_AuditFeatures_FormatConfigurationError_Returns,
  Lib_AuditFeatures_GetEnabledFeature_Features,
  Lib_AuditFeatures_GetEnabledFeature_RawFeature,
  Lib_AuditFeatures_GetEnabledFeature_Returns,
  Lib_AuditFeatures_GetEnabledFeature_Settings,
  Lib_AuditFeatures_HandleGuildMemberAdd_ChannelIdentifier,
  Lib_AuditFeatures_HandleGuildMemberAdd_GuildIdentifier,
  Lib_AuditFeatures_HandleGuildMemberAdd_Member,
  Lib_AuditFeatures_HandleGuildMemberAdd_Returns,
  Lib_AuditFeatures_HandleGuildMemberAdd_Runtime,
  Lib_AuditFeatures_HandleGuildMemberRemove_ChannelIdentifier,
  Lib_AuditFeatures_HandleGuildMemberRemove_GuildIdentifier,
  Lib_AuditFeatures_HandleGuildMemberRemove_Member,
  Lib_AuditFeatures_HandleGuildMemberRemove_Returns,
  Lib_AuditFeatures_HandleGuildMemberRemove_Runtime,
  Lib_AuditFeatures_HandleGuildMemberUpdate_GuildIdentifier,
  Lib_AuditFeatures_HandleGuildMemberUpdate_NewMember,
  Lib_AuditFeatures_HandleGuildMemberUpdate_NicknameChannelIdentifier,
  Lib_AuditFeatures_HandleGuildMemberUpdate_OldMember,
  Lib_AuditFeatures_HandleGuildMemberUpdate_Returns,
  Lib_AuditFeatures_HandleGuildMemberUpdate_RoleChanges,
  Lib_AuditFeatures_HandleGuildMemberUpdate_RoleChannelIdentifier,
  Lib_AuditFeatures_HandleGuildMemberUpdate_Runtime,
  Lib_AuditFeatures_HandleMessageCreate_AttachmentChannelIdentifier,
  Lib_AuditFeatures_HandleMessageCreate_AttachmentNames,
  Lib_AuditFeatures_HandleMessageCreate_GuildIdentifier,
  Lib_AuditFeatures_HandleMessageCreate_Hosts,
  Lib_AuditFeatures_HandleMessageCreate_LinkChannelIdentifier,
  Lib_AuditFeatures_HandleMessageCreate_Message,
  Lib_AuditFeatures_HandleMessageCreate_Returns,
  Lib_AuditFeatures_HandleMessageCreate_Runtime,
  Lib_AuditFeatures_HandleMessageDelete_AuthorIdentifier,
  Lib_AuditFeatures_HandleMessageDelete_ChannelIdentifier,
  Lib_AuditFeatures_HandleMessageDelete_GuildIdentifier,
  Lib_AuditFeatures_HandleMessageDelete_Message,
  Lib_AuditFeatures_HandleMessageDelete_Returns,
  Lib_AuditFeatures_HandleMessageDelete_Runtime,
  Lib_AuditFeatures_HandleMessageUpdate_ChannelIdentifier,
  Lib_AuditFeatures_HandleMessageUpdate_GuildIdentifier,
  Lib_AuditFeatures_HandleMessageUpdate_NewMessage,
  Lib_AuditFeatures_HandleMessageUpdate_OldMessage,
  Lib_AuditFeatures_HandleMessageUpdate_Returns,
  Lib_AuditFeatures_HandleMessageUpdate_Runtime,
  Lib_AuditFeatures_HandleUserUpdate_ChannelIdentifier,
  Lib_AuditFeatures_HandleUserUpdate_Client,
  Lib_AuditFeatures_HandleUserUpdate_Guild,
  Lib_AuditFeatures_HandleUserUpdate_GuildIdentifier,
  Lib_AuditFeatures_HandleUserUpdate_Member,
  Lib_AuditFeatures_HandleUserUpdate_NewUser,
  Lib_AuditFeatures_HandleUserUpdate_OldUser,
  Lib_AuditFeatures_HandleUserUpdate_Returns,
  Lib_AuditFeatures_HandleUserUpdate_Runtime,
  Lib_AuditFeatures_IsRecord_TypeGuard,
  Lib_AuditFeatures_IsRecord_Value,
  Lib_AuditFeatures_PrepareAuditFeatures_ActiveFeatureKeys,
  Lib_AuditFeatures_PrepareAuditFeatures_ConfigurationErrors,
  Lib_AuditFeatures_PrepareAuditFeatures_Feature,
  Lib_AuditFeatures_PrepareAuditFeatures_Intents,
  Lib_AuditFeatures_PrepareAuditFeatures_MemberEventsEnabled,
  Lib_AuditFeatures_PrepareAuditFeatures_MessageContentEnabled,
  Lib_AuditFeatures_PrepareAuditFeatures_MessageEventsEnabled,
  Lib_AuditFeatures_PrepareAuditFeatures_Returns,
  Lib_AuditFeatures_PrepareAuditFeatures_Runtime,
  Lib_AuditFeatures_PrepareAuditFeatures_Settings,
  Lib_AuditFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_AuditFeatures_RecordConfigurationError_Error,
  Lib_AuditFeatures_RecordConfigurationError_Message,
  Lib_AuditFeatures_RecordConfigurationError_Returns,
  Lib_AuditFeatures_SendAudit_Channel,
  Lib_AuditFeatures_SendAudit_ChannelIdentifier,
  Lib_AuditFeatures_SendAudit_Guild,
  Lib_AuditFeatures_SendAudit_Lines,
  Lib_AuditFeatures_SendAudit_Returns,
  Lib_AuditFeatures_SummarizeRoleChanges_NewRoleIdentifiers,
  Lib_AuditFeatures_SummarizeRoleChanges_NewRoles,
  Lib_AuditFeatures_SummarizeRoleChanges_OldRoleIdentifiers,
  Lib_AuditFeatures_SummarizeRoleChanges_OldRoles,
  Lib_AuditFeatures_SummarizeRoleChanges_Returns,
} from '../types/lib/audit-features.d.ts';

/**
 * Audit Features - Channel Schema.
 *
 * Requires one Discord destination for every independently selected audit event.
 * Descriptions from legacy JSON are discarded at this runtime boundary.
 *
 * @since 4.0.0
 */
const channelSchema = z.object({
  channel: z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
});

/**
 * Audit Features - Excluded Link Schema.
 *
 * Pre-validates bounded legacy exclusions before message handlers are registered.
 * Invalid expressions disable only this feature for the current generation.
 *
 * @since 4.0.0
 */
const excludedLinkSchema = z.object({
  name: z.string().trim().min(1).max(100),
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
});

/**
 * Audit Features - Audit Schema.
 *
 * Treats each archived snitch route as an optional privacy-aware observation.
 * At least one route is required for an enabled runtime module.
 *
 * @since 4.0.0
 */
export const auditSchema = z.object({
  'change-nickname': channelSchema.optional(),
  'change-username': channelSchema.optional(),
  'delete-message': channelSchema.optional(),
  'guild-join': channelSchema.optional(),
  'guild-leave': channelSchema.optional(),
  'includes-link': channelSchema.extend({
    'excluded-links': z.array(excludedLinkSchema).max(100).optional(),
  }).optional(),
  'role-change': channelSchema.optional(),
  'update-message': channelSchema.optional(),
  'upload-attachment': channelSchema.optional(),
}).refine(
  (configuration) => Object.values(configuration).some((value) => value !== undefined),
  'At least one audit route is required.',
);

/**
 * Audit Features - Compile Audit Features.
 *
 * Converts event routes and excluded-link expressions into immutable runtime state.
 * Regular expressions are compiled only once per Gateway generation.
 *
 * @param {Lib_AuditFeatures_CompileAuditFeatures_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_CompileAuditFeatures_Returns}
 *
 * @since 4.0.0
 */
function compileAuditFeatures(
  configuration: Lib_AuditFeatures_CompileAuditFeatures_Configuration,
): Lib_AuditFeatures_CompileAuditFeatures_Returns {
  const parsed: Lib_AuditFeatures_CompileAuditFeatures_Parsed = auditSchema.parse(configuration);
  const channels: Lib_AuditFeatures_CompileAuditFeatures_Channels = {};
  const eventKeys: Lib_AuditFeatures_CompileAuditFeatures_EventKeys = [
    'change-nickname',
    'change-username',
    'delete-message',
    'guild-join',
    'guild-leave',
    'includes-link',
    'role-change',
    'update-message',
    'upload-attachment',
  ];

  for (const eventKey of eventKeys) {
    const eventConfiguration: Lib_AuditFeatures_CompileAuditFeatures_EventConfiguration = parsed[eventKey];

    if (eventConfiguration !== undefined) {
      Reflect.set(channels, eventKey, eventConfiguration['channel']['channel-id']);
    }
  }

  const includesLink: Lib_AuditFeatures_CompileAuditFeatures_IncludesLink = parsed['includes-link'];
  const excludedLinkPatterns: Lib_AuditFeatures_CompileAuditFeatures_ExcludedLinkPatterns = (
    (includesLink === undefined) ? [] : (includesLink['excluded-links'] ?? [])
  ).map((excludedLink) => new RegExp(excludedLink['regex']['pattern'], excludedLink['regex']['flags']));

  return {
    channels,
    excludedLinkPatterns,
  };
}

/**
 * Audit Features - Create Registration.
 *
 * Registers one bounded listener per Discord event family for valid configuration.
 * Every asynchronous failure is logged without leaking audited message contents.
 *
 * @param {Lib_AuditFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_AuditFeatures_CreateRegistration_Runtime,
): Lib_AuditFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    client.on(Events.GuildMemberAdd, (member) => {
      void timeFeatureHandler('audit', Events.GuildMemberAdd, guildIdentifier, () => handleGuildMemberAdd(member, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_member_join_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.GuildMemberRemove, (member) => {
      void timeFeatureHandler('audit', Events.GuildMemberRemove, guildIdentifier, () => handleGuildMemberRemove(member, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_member_leave_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
      void timeFeatureHandler('audit', Events.GuildMemberUpdate, guildIdentifier, () => handleGuildMemberUpdate(oldMember, newMember, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_member_update_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.MessageCreate, (message) => {
      void timeFeatureHandler('audit', Events.MessageCreate, guildIdentifier, () => handleMessageCreate(message, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_message_create_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.MessageDelete, (message) => {
      void timeFeatureHandler('audit', Events.MessageDelete, guildIdentifier, () => handleMessageDelete(message, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_message_delete_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
      void timeFeatureHandler('audit', Events.MessageUpdate, guildIdentifier, () => handleMessageUpdate(oldMessage, newMessage, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_message_update_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.UserUpdate, (oldUser, newUser) => {
      void timeFeatureHandler('audit', Events.UserUpdate, guildIdentifier, () => handleUserUpdate(client, oldUser, newUser, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'audit_username_update_failed', {
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
 * Audit Features - Find External Link Hosts.
 *
 * Extracts unique hostnames after applying every configured legacy exclusion.
 * Full URLs and query values are never returned for notification or logging.
 *
 * @param {Lib_AuditFeatures_FindExternalLinkHosts_Content}              content              - Content.
 * @param {Lib_AuditFeatures_FindExternalLinkHosts_ExcludedLinkPatterns} excludedLinkPatterns - Excluded link patterns.
 *
 * @returns {Lib_AuditFeatures_FindExternalLinkHosts_Returns}
 *
 * @since 4.0.0
 */
export function findExternalLinkHosts(
  content: Lib_AuditFeatures_FindExternalLinkHosts_Content,
  excludedLinkPatterns: Lib_AuditFeatures_FindExternalLinkHosts_ExcludedLinkPatterns,
): Lib_AuditFeatures_FindExternalLinkHosts_Returns {
  const urlPattern: Lib_AuditFeatures_FindExternalLinkHosts_UrlPattern = new RegExp(
    LIB_REGEX_PATTERN_HTTP_URL,
    'giu',
  );
  const candidates: Lib_AuditFeatures_FindExternalLinkHosts_Candidates = content.match(urlPattern) ?? [];
  const hosts: Lib_AuditFeatures_FindExternalLinkHosts_Hosts = new Set();

  for (const candidate of candidates.slice(0, 25)) {
    let excluded: Lib_AuditFeatures_FindExternalLinkHosts_Excluded = false;

    for (const excludedLinkPattern of excludedLinkPatterns) {
      if (new RegExp(excludedLinkPattern.source, excludedLinkPattern.flags).test(candidate) === true) {
        excluded = true;
        break;
      }
    }

    if (excluded === true) {
      continue;
    }

    try {
      const parsedUrl: Lib_AuditFeatures_FindExternalLinkHosts_ParsedUrl = new URL(candidate);

      hosts.add(parsedUrl.hostname.toLocaleLowerCase('en-US'));
    } catch {
      continue;
    }
  }

  return [...hosts].slice(0, 10);
}

/**
 * Audit Features - Format Configuration Error.
 *
 * Produces path-focused startup feedback without exposing audited content.
 * Unexpected failures use the shared bounded error conversion.
 *
 * @param {Lib_AuditFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_AuditFeatures_FormatConfigurationError_Error,
): Lib_AuditFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_AuditFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Audit Features - Get Enabled Feature.
 *
 * Reads the snitch replacement switch without trusting surrounding JSON values.
 * Missing or disabled state registers no audit listeners or privileged intents.
 *
 * @param {Lib_AuditFeatures_GetEnabledFeature_Settings} settings - Settings.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_AuditFeatures_GetEnabledFeature_Settings,
): Lib_AuditFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_AuditFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_AuditFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_AuditFeatures_GetEnabledFeature_RawFeature = features['snitch'];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Audit Features - Handle Guild Member Add.
 *
 * Announces a member join with opaque identity and account creation time.
 * No profile, IP, or message-content data is retained by the feature.
 *
 * @param {Lib_AuditFeatures_HandleGuildMemberAdd_Member}          member          - Member.
 * @param {Lib_AuditFeatures_HandleGuildMemberAdd_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleGuildMemberAdd_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleGuildMemberAdd_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberAdd(
  member: Lib_AuditFeatures_HandleGuildMemberAdd_Member,
  guildIdentifier: Lib_AuditFeatures_HandleGuildMemberAdd_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleGuildMemberAdd_Runtime,
): Lib_AuditFeatures_HandleGuildMemberAdd_Returns {
  const channelIdentifier: Lib_AuditFeatures_HandleGuildMemberAdd_ChannelIdentifier = runtime['channels']['guild-join'];

  if (member['guild']['id'] !== guildIdentifier || channelIdentifier === undefined) {
    return;
  }

  await sendAudit(member['guild'], channelIdentifier, [
    'Member joined the server.',
    `Member: <@${member['id']}> (${member['id']})`,
    `Account created: <t:${Math.floor(member['user']['createdTimestamp'] / 1_000)}:F>`,
  ]);

  return;
}

/**
 * Audit Features - Handle Guild Member Remove.
 *
 * Announces a member departure using only identity and event metadata.
 * Discord audit-log inference is intentionally excluded from this listener.
 *
 * @param {Lib_AuditFeatures_HandleGuildMemberRemove_Member}          member          - Member.
 * @param {Lib_AuditFeatures_HandleGuildMemberRemove_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleGuildMemberRemove_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleGuildMemberRemove_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberRemove(
  member: Lib_AuditFeatures_HandleGuildMemberRemove_Member,
  guildIdentifier: Lib_AuditFeatures_HandleGuildMemberRemove_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleGuildMemberRemove_Runtime,
): Lib_AuditFeatures_HandleGuildMemberRemove_Returns {
  const channelIdentifier: Lib_AuditFeatures_HandleGuildMemberRemove_ChannelIdentifier = runtime['channels']['guild-leave'];

  if (member['guild']['id'] !== guildIdentifier || channelIdentifier === undefined) {
    return;
  }

  await sendAudit(member['guild'], channelIdentifier, [
    'Member left the server.',
    `Member: <@${member['id']}> (${member['id']})`,
  ]);

  return;
}

/**
 * Audit Features - Handle Guild Member Update.
 *
 * Separately reports nickname and role-set changes from one member event.
 * Role identifiers are bounded and message mentions remain disabled.
 *
 * @param {Lib_AuditFeatures_HandleGuildMemberUpdate_OldMember}       oldMember       - Old member.
 * @param {Lib_AuditFeatures_HandleGuildMemberUpdate_NewMember}       newMember       - New member.
 * @param {Lib_AuditFeatures_HandleGuildMemberUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleGuildMemberUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleGuildMemberUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberUpdate(
  oldMember: Lib_AuditFeatures_HandleGuildMemberUpdate_OldMember,
  newMember: Lib_AuditFeatures_HandleGuildMemberUpdate_NewMember,
  guildIdentifier: Lib_AuditFeatures_HandleGuildMemberUpdate_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleGuildMemberUpdate_Runtime,
): Lib_AuditFeatures_HandleGuildMemberUpdate_Returns {
  if (newMember['guild']['id'] !== guildIdentifier) {
    return;
  }

  const nicknameChannelIdentifier: Lib_AuditFeatures_HandleGuildMemberUpdate_NicknameChannelIdentifier = runtime[
    'channels'
  ]['change-nickname'];

  if (
    nicknameChannelIdentifier !== undefined
    && oldMember['nickname'] !== newMember['nickname']
  ) {
    await sendAudit(newMember['guild'], nicknameChannelIdentifier, [
      'Member nickname changed.',
      `Member: <@${newMember['id']}> (${newMember['id']})`,
      `Previous: ${(oldMember['nickname'] ?? 'none').slice(0, 100)}`,
      `Current: ${(newMember['nickname'] ?? 'none').slice(0, 100)}`,
    ]);
  }

  const roleChannelIdentifier: Lib_AuditFeatures_HandleGuildMemberUpdate_RoleChannelIdentifier = runtime['channels'][
    'role-change'
  ];
  const roleChanges: Lib_AuditFeatures_HandleGuildMemberUpdate_RoleChanges = summarizeRoleChanges(
    oldMember['roles']['cache'].keys(),
    newMember['roles']['cache'].keys(),
  );

  if (
    roleChannelIdentifier !== undefined
    && (
      roleChanges['added'].length > 0
      || roleChanges['removed'].length > 0
    )
  ) {
    await sendAudit(newMember['guild'], roleChannelIdentifier, [
      'Member roles changed.',
      `Member: <@${newMember['id']}> (${newMember['id']})`,
      `Added: ${roleChanges['added'].map((roleIdentifier) => `<@&${roleIdentifier}>`).join(', ') || 'none'}`,
      `Removed: ${roleChanges['removed'].map((roleIdentifier) => `<@&${roleIdentifier}>`).join(', ') || 'none'}`,
    ]);
  }

  return;
}

/**
 * Audit Features - Handle Message Create.
 *
 * Reports external link hosts and attachment filenames without copying payloads.
 * Bot, system, direct, and cross-server messages are ignored.
 *
 * @param {Lib_AuditFeatures_HandleMessageCreate_Message}         message         - Message.
 * @param {Lib_AuditFeatures_HandleMessageCreate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleMessageCreate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleMessageCreate_Returns}
 *
 * @since 4.0.0
 */
async function handleMessageCreate(
  message: Lib_AuditFeatures_HandleMessageCreate_Message,
  guildIdentifier: Lib_AuditFeatures_HandleMessageCreate_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleMessageCreate_Runtime,
): Lib_AuditFeatures_HandleMessageCreate_Returns {
  if (
    message.inGuild() === false
    || message['guildId'] !== guildIdentifier
    || message['author']['bot'] === true
    || message['system'] === true
  ) {
    return;
  }

  const linkChannelIdentifier: Lib_AuditFeatures_HandleMessageCreate_LinkChannelIdentifier = runtime['channels'][
    'includes-link'
  ];

  if (linkChannelIdentifier !== undefined) {
    const hosts: Lib_AuditFeatures_HandleMessageCreate_Hosts = findExternalLinkHosts(
      message['content'],
      runtime['excludedLinkPatterns'],
    );

    if (hosts.length > 0) {
      await sendAudit(message['guild'], linkChannelIdentifier, [
        'Message contains an external link.',
        `Member: <@${message['author']['id']}> (${message['author']['id']})`,
        `Channel: <#${message['channelId']}>`,
        `Hosts: ${hosts.join(', ')}`,
        `Message: ${message['url']}`,
      ]);
    }
  }

  const attachmentChannelIdentifier: Lib_AuditFeatures_HandleMessageCreate_AttachmentChannelIdentifier = runtime[
    'channels'
  ]['upload-attachment'];

  if (attachmentChannelIdentifier !== undefined && message['attachments']['size'] > 0) {
    const attachmentNames: Lib_AuditFeatures_HandleMessageCreate_AttachmentNames = message['attachments']
      .map((attachment) => attachment['name'].slice(0, 100))
      .slice(0, 10);

    await sendAudit(message['guild'], attachmentChannelIdentifier, [
      'Message contains attachments.',
      `Member: <@${message['author']['id']}> (${message['author']['id']})`,
      `Channel: <#${message['channelId']}>`,
      `Files: ${attachmentNames.join(', ')}`,
      `Message: ${message['url']}`,
    ]);
  }

  return;
}

/**
 * Audit Features - Handle Message Delete.
 *
 * Reports deletion metadata without retaining the removed message body.
 * Partial cache events remain useful through opaque message and channel IDs.
 *
 * @param {Lib_AuditFeatures_HandleMessageDelete_Message}         message         - Message.
 * @param {Lib_AuditFeatures_HandleMessageDelete_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleMessageDelete_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleMessageDelete_Returns}
 *
 * @since 4.0.0
 */
async function handleMessageDelete(
  message: Lib_AuditFeatures_HandleMessageDelete_Message,
  guildIdentifier: Lib_AuditFeatures_HandleMessageDelete_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleMessageDelete_Runtime,
): Lib_AuditFeatures_HandleMessageDelete_Returns {
  const channelIdentifier: Lib_AuditFeatures_HandleMessageDelete_ChannelIdentifier = runtime['channels'][
    'delete-message'
  ];

  if (
    message['guildId'] !== guildIdentifier
    || message['guild'] === null
    || channelIdentifier === undefined
  ) {
    return;
  }

  const authorIdentifier: Lib_AuditFeatures_HandleMessageDelete_AuthorIdentifier = (
    message['partial'] === true
  ) ? 'unknown' : message['author']['id'];

  await sendAudit(message['guild'], channelIdentifier, [
    'Message deleted.',
    `Message ID: ${message['id']}`,
    `Author ID: ${authorIdentifier}`,
    `Channel: <#${message['channelId']}>`,
    'Content was not retained by the audit feature.',
  ]);

  return;
}

/**
 * Audit Features - Handle Message Update.
 *
 * Reports content-changing edits without copying old or new message text.
 * Embed-only updates and cross-server messages are ignored.
 *
 * @param {Lib_AuditFeatures_HandleMessageUpdate_OldMessage}      oldMessage      - Old message.
 * @param {Lib_AuditFeatures_HandleMessageUpdate_NewMessage}      newMessage      - New message.
 * @param {Lib_AuditFeatures_HandleMessageUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleMessageUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleMessageUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleMessageUpdate(
  oldMessage: Lib_AuditFeatures_HandleMessageUpdate_OldMessage,
  newMessage: Lib_AuditFeatures_HandleMessageUpdate_NewMessage,
  guildIdentifier: Lib_AuditFeatures_HandleMessageUpdate_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleMessageUpdate_Runtime,
): Lib_AuditFeatures_HandleMessageUpdate_Returns {
  const channelIdentifier: Lib_AuditFeatures_HandleMessageUpdate_ChannelIdentifier = runtime['channels'][
    'update-message'
  ];

  if (
    newMessage['guildId'] !== guildIdentifier
    || newMessage['guild'] === null
    || newMessage['author']['bot'] === true
    || channelIdentifier === undefined
    || oldMessage['content'] === newMessage['content']
  ) {
    return;
  }

  await sendAudit(newMessage['guild'], channelIdentifier, [
    'Message content changed.',
    `Member: <@${newMessage['author']['id']}> (${newMessage['author']['id']})`,
    `Channel: <#${newMessage['channelId']}>`,
    `Message: ${newMessage['url']}`,
    'Content was not copied into the audit notification.',
  ]);

  return;
}

/**
 * Audit Features - Handle User Update.
 *
 * Confirms server membership before reporting a Discord username change.
 * The listener does not report unrelated global users observed by the client.
 *
 * @param {Lib_AuditFeatures_HandleUserUpdate_Client}          client          - Client.
 * @param {Lib_AuditFeatures_HandleUserUpdate_OldUser}         oldUser         - Old user.
 * @param {Lib_AuditFeatures_HandleUserUpdate_NewUser}         newUser         - New user.
 * @param {Lib_AuditFeatures_HandleUserUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AuditFeatures_HandleUserUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_HandleUserUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleUserUpdate(
  client: Lib_AuditFeatures_HandleUserUpdate_Client,
  oldUser: Lib_AuditFeatures_HandleUserUpdate_OldUser,
  newUser: Lib_AuditFeatures_HandleUserUpdate_NewUser,
  guildIdentifier: Lib_AuditFeatures_HandleUserUpdate_GuildIdentifier,
  runtime: Lib_AuditFeatures_HandleUserUpdate_Runtime,
): Lib_AuditFeatures_HandleUserUpdate_Returns {
  const channelIdentifier: Lib_AuditFeatures_HandleUserUpdate_ChannelIdentifier = runtime['channels'][
    'change-username'
  ];

  if (channelIdentifier === undefined || oldUser['username'] === newUser['username']) {
    return;
  }

  const guild: Lib_AuditFeatures_HandleUserUpdate_Guild = client['guilds']['cache'].get(guildIdentifier);

  if (guild === undefined) {
    return;
  }

  const member: Lib_AuditFeatures_HandleUserUpdate_Member = await guild['members'].fetch(newUser['id'])
    .catch(() => undefined);

  if (member === undefined) {
    return;
  }

  await sendAudit(guild, channelIdentifier, [
    'Member username changed.',
    `Member: <@${newUser['id']}> (${newUser['id']})`,
    `Previous: ${(oldUser['username'] ?? 'unknown').slice(0, 100)}`,
    `Current: ${newUser['username'].slice(0, 100)}`,
  ]);

  return;
}

/**
 * Audit Features - Is Record.
 *
 * Narrows untrusted settings before feature state properties are read.
 * Arrays and null do not qualify as configuration maps.
 *
 * @param {Lib_AuditFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_AuditFeatures_IsRecord_Value,
): value is Lib_AuditFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Audit Features - Prepare Audit Features.
 *
 * Compiles the optional module and derives only the Gateway intents it needs.
 * Invalid audit settings remain isolated from every other feature module.
 *
 * @param {Lib_AuditFeatures_PrepareAuditFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_AuditFeatures_PrepareAuditFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareAuditFeatures(
  settings: Lib_AuditFeatures_PrepareAuditFeatures_Settings,
): Lib_AuditFeatures_PrepareAuditFeatures_Returns {
  let runtime: Lib_AuditFeatures_PrepareAuditFeatures_Runtime = undefined;
  const activeFeatureKeys: Lib_AuditFeatures_PrepareAuditFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_AuditFeatures_PrepareAuditFeatures_ConfigurationErrors = [];
  const feature: Lib_AuditFeatures_PrepareAuditFeatures_Feature = getEnabledFeature(settings);

  if (feature !== undefined) {
    try {
      runtime = compileAuditFeatures(feature['configuration']);

      activeFeatureKeys.push('snitch');
    } catch (error) {
      recordConfigurationError(error, configurationErrors);
    }
  }

  const intents: Lib_AuditFeatures_PrepareAuditFeatures_Intents = [];

  if (runtime !== undefined) {
    const memberEventsEnabled: Lib_AuditFeatures_PrepareAuditFeatures_MemberEventsEnabled = [
      'change-nickname',
      'change-username',
      'guild-join',
      'guild-leave',
      'role-change',
    ].some((eventKey) => Reflect.has(runtime['channels'], eventKey));
    const messageEventsEnabled: Lib_AuditFeatures_PrepareAuditFeatures_MessageEventsEnabled = [
      'delete-message',
      'includes-link',
      'update-message',
      'upload-attachment',
    ].some((eventKey) => Reflect.has(runtime['channels'], eventKey));
    const messageContentEnabled: Lib_AuditFeatures_PrepareAuditFeatures_MessageContentEnabled = (
      runtime['channels']['includes-link'] !== undefined
      || runtime['channels']['update-message'] !== undefined
    );

    if (memberEventsEnabled === true) {
      intents.push(GatewayIntentBits.GuildMembers);
    }

    if (messageEventsEnabled === true) {
      intents.push(GatewayIntentBits.GuildMessages);
    }

    if (messageContentEnabled === true) {
      intents.push(GatewayIntentBits.MessageContent);
    }
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: (runtime === undefined) ? () => undefined : createRegistration(runtime),
  };
}

/**
 * Audit Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one bounded startup warning.
 * A rejected audit module cannot affect Gateway connection admission.
 *
 * @param {Lib_AuditFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_AuditFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  error: Lib_AuditFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_AuditFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_AuditFeatures_RecordConfigurationError_Returns {
  const message: Lib_AuditFeatures_RecordConfigurationError_Message = `snitch: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'audit_feature_configuration_rejected', {
    featureKey: 'snitch',
    message,
  });

  return;
}

/**
 * Audit Features - Send Audit.
 *
 * Sends bounded text to one configured guild channel with mentions disabled.
 * Notification delivery never logs message bodies or provider errors.
 *
 * @param {Lib_AuditFeatures_SendAudit_Guild}             guild             - Guild.
 * @param {Lib_AuditFeatures_SendAudit_ChannelIdentifier} channelIdentifier - Channel identifier.
 * @param {Lib_AuditFeatures_SendAudit_Lines}             lines             - Lines.
 *
 * @private
 *
 * @returns {Lib_AuditFeatures_SendAudit_Returns}
 *
 * @since 4.0.0
 */
async function sendAudit(
  guild: Lib_AuditFeatures_SendAudit_Guild,
  channelIdentifier: Lib_AuditFeatures_SendAudit_ChannelIdentifier,
  lines: Lib_AuditFeatures_SendAudit_Lines,
): Lib_AuditFeatures_SendAudit_Returns {
  const channel: Lib_AuditFeatures_SendAudit_Channel = await guild['channels'].fetch(channelIdentifier);

  if (channel === null || channel.isSendable() === false) {
    throw new Error('Configured audit channel is unavailable.');
  }

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    content: lines.join('\n').slice(0, 2_000),
  });

  return;
}

/**
 * Audit Features - Summarize Role Changes.
 *
 * Computes deterministic additions and removals from two role identifier sets.
 * The guild default role is naturally ignored when present in both collections.
 *
 * @param {Lib_AuditFeatures_SummarizeRoleChanges_OldRoleIdentifiers} oldRoleIdentifiers - Old role identifiers.
 * @param {Lib_AuditFeatures_SummarizeRoleChanges_NewRoleIdentifiers} newRoleIdentifiers - New role identifiers.
 *
 * @returns {Lib_AuditFeatures_SummarizeRoleChanges_Returns}
 *
 * @since 4.0.0
 */
export function summarizeRoleChanges(
  oldRoleIdentifiers: Lib_AuditFeatures_SummarizeRoleChanges_OldRoleIdentifiers,
  newRoleIdentifiers: Lib_AuditFeatures_SummarizeRoleChanges_NewRoleIdentifiers,
): Lib_AuditFeatures_SummarizeRoleChanges_Returns {
  const oldRoles: Lib_AuditFeatures_SummarizeRoleChanges_OldRoles = new Set(oldRoleIdentifiers);
  const newRoles: Lib_AuditFeatures_SummarizeRoleChanges_NewRoles = new Set(newRoleIdentifiers);

  return {
    added: [...newRoles].filter((roleIdentifier) => oldRoles.has(roleIdentifier) === false).sort(),
    removed: [...oldRoles].filter((roleIdentifier) => newRoles.has(roleIdentifier) === false).sort(),
  };
}
