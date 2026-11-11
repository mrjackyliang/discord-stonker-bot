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
  Lib_AntiRaidFeatures_CompileAntiRaid_AutoBan,
  Lib_AntiRaidFeatures_CompileAntiRaid_AvatarHashes,
  Lib_AntiRaidFeatures_CompileAntiRaid_Configuration,
  Lib_AntiRaidFeatures_CompileAntiRaid_Content,
  Lib_AntiRaidFeatures_CompileAntiRaid_ContentParts,
  Lib_AntiRaidFeatures_CompileAntiRaid_MembershipGate,
  Lib_AntiRaidFeatures_CompileAntiRaid_MembershipGateConfiguration,
  Lib_AntiRaidFeatures_CompileAntiRaid_Parsed,
  Lib_AntiRaidFeatures_CompileAntiRaid_Returns,
  Lib_AntiRaidFeatures_CompileAntiRaid_Usernames,
  Lib_AntiRaidFeatures_CreateRegistration_Returns,
  Lib_AntiRaidFeatures_CreateRegistration_Runtime,
  Lib_AntiRaidFeatures_FindRaidSignals_AvatarHash,
  Lib_AntiRaidFeatures_FindRaidSignals_DisplayName,
  Lib_AntiRaidFeatures_FindRaidSignals_NormalizedNames,
  Lib_AntiRaidFeatures_FindRaidSignals_Returns,
  Lib_AntiRaidFeatures_FindRaidSignals_Runtime,
  Lib_AntiRaidFeatures_FindRaidSignals_Signals,
  Lib_AntiRaidFeatures_FindRaidSignals_Username,
  Lib_AntiRaidFeatures_FormatConfigurationError_Error,
  Lib_AntiRaidFeatures_FormatConfigurationError_Messages,
  Lib_AntiRaidFeatures_FormatConfigurationError_Returns,
  Lib_AntiRaidFeatures_FormatMembershipGateMessage_Content,
  Lib_AntiRaidFeatures_FormatMembershipGateMessage_CurrentYear,
  Lib_AntiRaidFeatures_FormatMembershipGateMessage_Member,
  Lib_AntiRaidFeatures_FormatMembershipGateMessage_Returns,
  Lib_AntiRaidFeatures_GetEnabledFeature_Features,
  Lib_AntiRaidFeatures_GetEnabledFeature_RawFeature,
  Lib_AntiRaidFeatures_GetEnabledFeature_Returns,
  Lib_AntiRaidFeatures_GetEnabledFeature_Settings,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_BanError,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_Channel,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_GuildIdentifier,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_Member,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_Returns,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_Runtime,
  Lib_AntiRaidFeatures_HandleGuildMemberAdd_Signals,
  Lib_AntiRaidFeatures_HandleGuildMemberUpdate_GuildIdentifier,
  Lib_AntiRaidFeatures_HandleGuildMemberUpdate_NewMember,
  Lib_AntiRaidFeatures_HandleGuildMemberUpdate_OldMember,
  Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Returns,
  Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Runtime,
  Lib_AntiRaidFeatures_IsRecord_TypeGuard,
  Lib_AntiRaidFeatures_IsRecord_Value,
  Lib_AntiRaidFeatures_NormalizeIdentity_Returns,
  Lib_AntiRaidFeatures_NormalizeIdentity_Value,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_ActiveFeatureKeys,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_ConfigurationErrors,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Feature,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Intents,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Runtime,
  Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Settings,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_BotMember,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_Channel,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_Member,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_MembershipGate,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_Returns,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_Role,
  Lib_AntiRaidFeatures_ReconcileMembershipGate_RolesToAdd,
  Lib_AntiRaidFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_AntiRaidFeatures_RecordConfigurationError_Error,
  Lib_AntiRaidFeatures_RecordConfigurationError_Message,
  Lib_AntiRaidFeatures_RecordConfigurationError_Returns,
} from '../types/lib/anti-raid-features.d.ts';

/**
 * Anti Raid Features - Anti Raid Schema.
 *
 * Preserves legacy fingerprints and membership-gate roles with bounded payloads.
 * Automatic bans need an alert channel, where each ban or refused ban is reported.
 *
 * @since 4.0.0
 */
export const antiRaidSchema = z.object({
  'auto-ban': z.object({
    avatars: z.array(z.object({
      avatar: z.string().trim().min(1).max(256),
    })).min(1).max(100).optional(),
    channel: z.object({
      'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    }),
    usernames: z.array(z.object({
      username: z.string().trim().min(1).max(100),
    })).min(1).max(100).optional(),
  }).refine(
    (configuration) => configuration['avatars'] !== undefined || configuration['usernames'] !== undefined,
    'At least one avatar or username fingerprint is required.',
  ).optional(),
  'membership-gate': z.object({
    channel: z.object({
      'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    }),
    payload: z.object({
      content: z.string().trim().min(1).max(2_000).optional(),
      footer: z.object({
        text: z.string().trim().min(1).max(1_000),
      }).optional(),
    }).optional(),
    roles: z.array(z.object({
      'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    })).min(1).max(25),
  }).optional(),
}).refine(
  (configuration) => configuration['auto-ban'] !== undefined || configuration['membership-gate'] !== undefined,
  'At least one anti-raid capability is required.',
);

/**
 * Anti Raid Features - Compile Anti Raid.
 *
 * Converts validated legacy settings into immutable lookup sets and gate state.
 * The alert channel receives a report for every joining member the bot bans.
 *
 * @param {Lib_AntiRaidFeatures_CompileAntiRaid_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_CompileAntiRaid_Returns}
 *
 * @since 4.0.0
 */
function compileAntiRaid(
  configuration: Lib_AntiRaidFeatures_CompileAntiRaid_Configuration,
): Lib_AntiRaidFeatures_CompileAntiRaid_Returns {
  const parsed: Lib_AntiRaidFeatures_CompileAntiRaid_Parsed = antiRaidSchema.parse(configuration);
  const autoBan: Lib_AntiRaidFeatures_CompileAntiRaid_AutoBan = parsed['auto-ban'];
  const avatarHashes: Lib_AntiRaidFeatures_CompileAntiRaid_AvatarHashes = new Set(
    ((autoBan === undefined) ? [] : (autoBan['avatars'] ?? [])).map((avatar) => avatar['avatar']),
  );
  const usernames: Lib_AntiRaidFeatures_CompileAntiRaid_Usernames = new Set(
    ((autoBan === undefined) ? [] : (autoBan['usernames'] ?? []))
      .map((username) => normalizeIdentity(username['username'])),
  );
  let membershipGate: Lib_AntiRaidFeatures_CompileAntiRaid_MembershipGate = undefined;
  const membershipGateConfiguration: Lib_AntiRaidFeatures_CompileAntiRaid_MembershipGateConfiguration = parsed[
    'membership-gate'
  ];

  if (membershipGateConfiguration !== undefined) {
    const contentParts: Lib_AntiRaidFeatures_CompileAntiRaid_ContentParts = [];

    if (membershipGateConfiguration['payload'] !== undefined) {
      if (membershipGateConfiguration['payload']['content'] !== undefined) {
        contentParts.push(membershipGateConfiguration['payload']['content']);
      }

      if (membershipGateConfiguration['payload']['footer'] !== undefined) {
        contentParts.push(membershipGateConfiguration['payload']['footer']['text']);
      }
    }

    let content: Lib_AntiRaidFeatures_CompileAntiRaid_Content = contentParts.join('\n');

    if (contentParts.length === 0) {
      content = 'You have successfully passed the membership gate.';
    }

    membershipGate = {
      channelIdentifier: membershipGateConfiguration['channel']['channel-id'],
      content,
      roleIdentifiers: membershipGateConfiguration['roles'].map((role) => role['role-id']),
    };
  }

  return {
    alertChannelIdentifier: (autoBan === undefined) ? undefined : autoBan['channel']['channel-id'],
    avatarHashes,
    membershipGate,
    usernames,
  };
}

/**
 * Anti Raid Features - Create Registration.
 *
 * Registers join checks and membership-screening transitions together.
 * Handler failures remain isolated from the Gateway and other feature modules.
 *
 * @param {Lib_AntiRaidFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_AntiRaidFeatures_CreateRegistration_Runtime,
): Lib_AntiRaidFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    client.on(Events.GuildMemberAdd, (member) => {
      void timeFeatureHandler('anti-raid', Events.GuildMemberAdd, guildIdentifier, () => handleGuildMemberAdd(member, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'anti_raid_join_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
          userIdentifier: member['id'],
        });

        return;
      });

      return;
    });

    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
      void timeFeatureHandler('anti-raid', Events.GuildMemberUpdate, guildIdentifier, () => handleGuildMemberUpdate(oldMember, newMember, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'membership_gate_reconciliation_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
          userIdentifier: newMember['id'],
        });

        return;
      });

      return;
    });

    return;
  };
}

/**
 * Anti Raid Features - Find Raid Signals.
 *
 * Compares immutable avatar hashes and normalized names without taking action.
 * Returned labels are safe summaries for the configured moderator channel.
 *
 * @param {Lib_AntiRaidFeatures_FindRaidSignals_AvatarHash}  avatarHash  - Avatar hash.
 * @param {Lib_AntiRaidFeatures_FindRaidSignals_Username}    username    - Username.
 * @param {Lib_AntiRaidFeatures_FindRaidSignals_DisplayName} displayName - Display name.
 * @param {Lib_AntiRaidFeatures_FindRaidSignals_Runtime}     runtime     - Runtime.
 *
 * @returns {Lib_AntiRaidFeatures_FindRaidSignals_Returns}
 *
 * @since 4.0.0
 */
export function findRaidSignals(
  avatarHash: Lib_AntiRaidFeatures_FindRaidSignals_AvatarHash,
  username: Lib_AntiRaidFeatures_FindRaidSignals_Username,
  displayName: Lib_AntiRaidFeatures_FindRaidSignals_DisplayName,
  runtime: Lib_AntiRaidFeatures_FindRaidSignals_Runtime,
): Lib_AntiRaidFeatures_FindRaidSignals_Returns {
  const signals: Lib_AntiRaidFeatures_FindRaidSignals_Signals = [];

  if (avatarHash !== null && runtime['avatarHashes'].has(avatarHash) === true) {
    signals.push('known avatar fingerprint');
  }

  const normalizedNames: Lib_AntiRaidFeatures_FindRaidSignals_NormalizedNames = [
    normalizeIdentity(username),
    normalizeIdentity(displayName),
  ];

  if (normalizedNames.some((name) => runtime['usernames'].has(name) === true) === true) {
    signals.push('configured username');
  }

  return signals;
}

/**
 * Anti Raid Features - Format Configuration Error.
 *
 * Produces path-focused startup diagnostics without reflecting secret values.
 * Unexpected failures use the shared bounded error conversion.
 *
 * @param {Lib_AntiRaidFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_AntiRaidFeatures_FormatConfigurationError_Error,
): Lib_AntiRaidFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_AntiRaidFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Anti Raid Features - Format Membership Gate Message.
 *
 * Replaces the archived safe placeholders and bounds the Discord text payload.
 * Automatic mention parsing stays disabled by the sending adapter.
 *
 * @param {Lib_AntiRaidFeatures_FormatMembershipGateMessage_Content} content - Content.
 * @param {Lib_AntiRaidFeatures_FormatMembershipGateMessage_Member}  member  - Member.
 *
 * @returns {Lib_AntiRaidFeatures_FormatMembershipGateMessage_Returns}
 *
 * @since 4.0.0
 */
export function formatMembershipGateMessage(
  content: Lib_AntiRaidFeatures_FormatMembershipGateMessage_Content,
  member: Lib_AntiRaidFeatures_FormatMembershipGateMessage_Member,
): Lib_AntiRaidFeatures_FormatMembershipGateMessage_Returns {
  const currentYear: Lib_AntiRaidFeatures_FormatMembershipGateMessage_CurrentYear = new Date().getUTCFullYear()
    .toString();

  return content
    .replaceAll('%GUILD_NAME%', member['guild']['name'])
    .replaceAll('%MEMBER_MENTION%', `<@${member['id']}>`)
    .replaceAll('%YEAR%', currentYear)
    .slice(0, 2_000);
}

/**
 * Anti Raid Features - Get Enabled Feature.
 *
 * Reads the database-backed switch without trusting surrounding JSON values.
 * Missing and disabled settings request no privileged member events.
 *
 * @param {Lib_AntiRaidFeatures_GetEnabledFeature_Settings} settings - Settings.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_AntiRaidFeatures_GetEnabledFeature_Settings,
): Lib_AntiRaidFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_AntiRaidFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_AntiRaidFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_AntiRaidFeatures_GetEnabledFeature_RawFeature = features['anti-raid'];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Anti Raid Features - Handle Guild Member Add.
 *
 * Bans a joining member who matches a signal, then reports the ban in the alert channel.
 * A ban Discord refuses is reported with its error, and bots and other servers are ignored.
 *
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberAdd_Member}          member          - Member.
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberAdd_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberAdd_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_HandleGuildMemberAdd_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberAdd(
  member: Lib_AntiRaidFeatures_HandleGuildMemberAdd_Member,
  guildIdentifier: Lib_AntiRaidFeatures_HandleGuildMemberAdd_GuildIdentifier,
  runtime: Lib_AntiRaidFeatures_HandleGuildMemberAdd_Runtime,
): Lib_AntiRaidFeatures_HandleGuildMemberAdd_Returns {
  if (
    member['guild']['id'] !== guildIdentifier
    || member['user']['bot'] === true
    || runtime['alertChannelIdentifier'] === undefined
  ) {
    return;
  }

  const signals: Lib_AntiRaidFeatures_HandleGuildMemberAdd_Signals = findRaidSignals(
    member['user']['avatar'],
    member['user']['username'],
    member['displayName'],
    runtime,
  );

  if (signals.length === 0) {
    return;
  }

  let banError: Lib_AntiRaidFeatures_HandleGuildMemberAdd_BanError = undefined;

  // The ban goes first, so a missing alert channel never lets a matching member stay.
  try {
    await member.ban({
      reason: `Anti-raid: ${signals.join(', ')}`.slice(0, 512),
    });

    writeLog('info', 'bot', 'anti_raid_member_banned', {
      signalCount: signals.length,
      userIdentifier: member['id'],
    });
  } catch (error) {
    banError = getErrorMessage(error);

    writeLog('warn', 'bot', 'anti_raid_ban_failed', {
      error: banError,
      userIdentifier: member['id'],
    });
  }

  const channel: Lib_AntiRaidFeatures_HandleGuildMemberAdd_Channel = await member['guild']['channels'].fetch(
    runtime['alertChannelIdentifier'],
  );

  if (channel === null || channel.isSendable() === false) {
    throw new Error('Configured anti-raid alert channel is unavailable.');
  }

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    content: [
      (banError === undefined) ? 'Banned a joining member who matched anti-raid signals.' : 'Couldn\'t ban a joining member who matched anti-raid signals.',
      `Member: <@${member['id']}> (${member['id']})`,
      `Signals: ${signals.join(', ')}`,
      ...((banError === undefined) ? [] : [`Error: ${banError}`]),
    ].join('\n').slice(0, 2_000),
  });

  writeLog('info', 'bot', 'anti_raid_join_alert_sent', {
    banned: banError === undefined,
    signalCount: signals.length,
    userIdentifier: member['id'],
  });

  return;
}

/**
 * Anti Raid Features - Handle Guild Member Update.
 *
 * Reacts only when Discord membership screening changes from pending to complete.
 * Other profile and role changes do not invoke membership-gate reconciliation.
 *
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberUpdate_OldMember}       oldMember       - Old member.
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberUpdate_NewMember}       newMember       - New member.
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberUpdate(
  oldMember: Lib_AntiRaidFeatures_HandleGuildMemberUpdate_OldMember,
  newMember: Lib_AntiRaidFeatures_HandleGuildMemberUpdate_NewMember,
  guildIdentifier: Lib_AntiRaidFeatures_HandleGuildMemberUpdate_GuildIdentifier,
  runtime: Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Runtime,
): Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Returns {
  if (
    newMember['guild']['id'] !== guildIdentifier
    || oldMember['pending'] !== true
    || newMember['pending'] !== false
    || runtime['membershipGate'] === undefined
  ) {
    return;
  }

  await reconcileMembershipGate(newMember, runtime['membershipGate']);

  return;
}

/**
 * Anti Raid Features - Is Record.
 *
 * Narrows untrusted settings before feature state properties are read.
 * Arrays and null do not qualify as configuration maps.
 *
 * @param {Lib_AntiRaidFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_AntiRaidFeatures_IsRecord_Value,
): value is Lib_AntiRaidFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Anti Raid Features - Normalize Identity.
 *
 * Applies compatibility normalization and case folding for stable name matching.
 * Whitespace around operator and Discord values is ignored.
 *
 * @param {Lib_AntiRaidFeatures_NormalizeIdentity_Value} value - Value.
 *
 * @returns {Lib_AntiRaidFeatures_NormalizeIdentity_Returns}
 *
 * @since 4.0.0
 */
function normalizeIdentity(
  value: Lib_AntiRaidFeatures_NormalizeIdentity_Value,
): Lib_AntiRaidFeatures_NormalizeIdentity_Returns {
  return value.normalize('NFKC').trim().toLocaleLowerCase('en-US');
}

/**
 * Anti Raid Features - Prepare Anti Raid Features.
 *
 * Compiles the optional module before login and isolates invalid configuration.
 * A valid runtime requests only the privileged member intent it consumes.
 *
 * @param {Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareAntiRaidFeatures(
  settings: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Settings,
): Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns {
  let runtime: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Runtime = undefined;
  const activeFeatureKeys: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_ConfigurationErrors = [];
  const feature: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Feature = getEnabledFeature(settings);

  if (feature !== undefined) {
    try {
      runtime = compileAntiRaid(feature['configuration']);

      activeFeatureKeys.push('anti-raid');
    } catch (error) {
      recordConfigurationError(error, configurationErrors);
    }
  }

  const intents: Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Intents = [];

  if (runtime !== undefined) {
    intents.push(GatewayIntentBits.GuildMembers);
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    intents,
    register: (runtime === undefined) ? () => undefined : createRegistration(runtime),
  };
}

/**
 * Anti Raid Features - Reconcile Membership Gate.
 *
 * Validates every target role before making one idempotent bulk role update.
 * Managed and hierarchy-blocked roles fail before any mutation is attempted.
 *
 * @param {Lib_AntiRaidFeatures_ReconcileMembershipGate_Member}         member         - Member.
 * @param {Lib_AntiRaidFeatures_ReconcileMembershipGate_MembershipGate} membershipGate - Membership gate.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_ReconcileMembershipGate_Returns}
 *
 * @since 4.0.0
 */
async function reconcileMembershipGate(
  member: Lib_AntiRaidFeatures_ReconcileMembershipGate_Member,
  membershipGate: Lib_AntiRaidFeatures_ReconcileMembershipGate_MembershipGate,
): Lib_AntiRaidFeatures_ReconcileMembershipGate_Returns {
  const botMember: Lib_AntiRaidFeatures_ReconcileMembershipGate_BotMember = member['guild']['members']['me'];

  if (botMember === null) {
    throw new Error('The bot member is unavailable for membership-gate role validation.');
  }

  const rolesToAdd: Lib_AntiRaidFeatures_ReconcileMembershipGate_RolesToAdd = [];

  for (const roleIdentifier of membershipGate['roleIdentifiers']) {
    if (member['roles']['cache'].has(roleIdentifier) === true) {
      continue;
    }

    const role: Lib_AntiRaidFeatures_ReconcileMembershipGate_Role = await member['guild']['roles'].fetch(
      roleIdentifier,
    );

    if (
      role === null
      || role['managed'] === true
      || role['position'] >= botMember['roles']['highest']['position']
    ) {
      throw new Error(`Membership-gate role ${roleIdentifier} is unavailable or not manageable.`);
    }

    rolesToAdd.push(role);
  }

  if (rolesToAdd.length > 0) {
    await member['roles'].add(rolesToAdd, 'Discord membership screening completed');
  }

  const channel: Lib_AntiRaidFeatures_ReconcileMembershipGate_Channel = await member['guild']['channels'].fetch(
    membershipGate['channelIdentifier'],
  );

  if (channel === null || channel.isSendable() === false) {
    throw new Error('Configured membership-gate channel is unavailable.');
  }

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    content: formatMembershipGateMessage(membershipGate['content'], member),
  });

  writeLog('info', 'bot', 'membership_gate_reconciled', {
    addedRoleCount: rolesToAdd.length,
    userIdentifier: member['id'],
  });

  return;
}

/**
 * Anti Raid Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one structured startup warning.
 * A rejected anti-raid module cannot affect the Discord connection.
 *
 * @param {Lib_AntiRaidFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_AntiRaidFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_AntiRaidFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  error: Lib_AntiRaidFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_AntiRaidFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_AntiRaidFeatures_RecordConfigurationError_Returns {
  const message: Lib_AntiRaidFeatures_RecordConfigurationError_Message = `anti-raid: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'anti_raid_feature_configuration_rejected', {
    featureKey: 'anti-raid',
    message,
  });

  return;
}
