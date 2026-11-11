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
  LIB_REGEX_PATTERN_MODERATION_COMBINING_MARKS,
} from './regex.js';

import type {
  Lib_ImpersonatorFeatures_ChangedUserIdentities_NewUser,
  Lib_ImpersonatorFeatures_ChangedUserIdentities_OldUser,
  Lib_ImpersonatorFeatures_ChangedUserIdentities_Returns,
  Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Configuration,
  Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Content,
  Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Parsed,
  Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Returns,
  Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_TrustedUserIdentifier,
  Lib_ImpersonatorFeatures_CreateRegistration_Returns,
  Lib_ImpersonatorFeatures_CreateRegistration_Runtime,
  Lib_ImpersonatorFeatures_FindIdentityMatch_Candidate,
  Lib_ImpersonatorFeatures_FindIdentityMatch_Candidates,
  Lib_ImpersonatorFeatures_FindIdentityMatch_Identities,
  Lib_ImpersonatorFeatures_FindIdentityMatch_Returns,
  Lib_ImpersonatorFeatures_FindIdentityMatch_Rules,
  Lib_ImpersonatorFeatures_FindIdentityMatch_UserIdentifier,
  Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Identity,
  Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_NormalizedIdentity,
  Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns,
  Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Rules,
  Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_UserIdentifier,
  Lib_ImpersonatorFeatures_FormatConfigurationError_Error,
  Lib_ImpersonatorFeatures_FormatConfigurationError_Messages,
  Lib_ImpersonatorFeatures_FormatConfigurationError_Returns,
  Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Content,
  Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Match,
  Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Member,
  Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Returns,
  Lib_ImpersonatorFeatures_GetEnabledFeature_FeatureKey,
  Lib_ImpersonatorFeatures_GetEnabledFeature_Features,
  Lib_ImpersonatorFeatures_GetEnabledFeature_RawFeature,
  Lib_ImpersonatorFeatures_GetEnabledFeature_Returns,
  Lib_ImpersonatorFeatures_GetEnabledFeature_Settings,
  Lib_ImpersonatorFeatures_HandleGuildMemberAdd_GuildIdentifier,
  Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Identities,
  Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Member,
  Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Returns,
  Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Runtime,
  Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_GuildIdentifier,
  Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_NewMember,
  Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_OldMember,
  Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Returns,
  Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Runtime,
  Lib_ImpersonatorFeatures_HandleMemberIdentity_Identities,
  Lib_ImpersonatorFeatures_HandleMemberIdentity_Match,
  Lib_ImpersonatorFeatures_HandleMemberIdentity_Member,
  Lib_ImpersonatorFeatures_HandleMemberIdentity_Returns,
  Lib_ImpersonatorFeatures_HandleMemberIdentity_Runtime,
  Lib_ImpersonatorFeatures_HandleUserUpdate_Client,
  Lib_ImpersonatorFeatures_HandleUserUpdate_GuildIdentifier,
  Lib_ImpersonatorFeatures_HandleUserUpdate_Member,
  Lib_ImpersonatorFeatures_HandleUserUpdate_NewUser,
  Lib_ImpersonatorFeatures_HandleUserUpdate_OldUser,
  Lib_ImpersonatorFeatures_HandleUserUpdate_Returns,
  Lib_ImpersonatorFeatures_HandleUserUpdate_Runtime,
  Lib_ImpersonatorFeatures_HandleUserUpdate_TargetGuild,
  Lib_ImpersonatorFeatures_IsRecord_TypeGuard,
  Lib_ImpersonatorFeatures_IsRecord_Value,
  Lib_ImpersonatorFeatures_MatchesRegularExpression_Identity,
  Lib_ImpersonatorFeatures_MatchesRegularExpression_RegularExpression,
  Lib_ImpersonatorFeatures_MatchesRegularExpression_Returns,
  Lib_ImpersonatorFeatures_NormalizeIdentity_CombiningMarks,
  Lib_ImpersonatorFeatures_NormalizeIdentity_Identity,
  Lib_ImpersonatorFeatures_NormalizeIdentity_Returns,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_ActiveFeatureKeys,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_ConfigurationErrors,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Feature,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Intents,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Runtime,
  Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Settings,
  Lib_ImpersonatorFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_ImpersonatorFeatures_RecordConfigurationError_Error,
  Lib_ImpersonatorFeatures_RecordConfigurationError_FeatureKey,
  Lib_ImpersonatorFeatures_RecordConfigurationError_Message,
  Lib_ImpersonatorFeatures_RecordConfigurationError_Returns,
  Lib_ImpersonatorFeatures_SendImpersonatorAlert_Channel,
  Lib_ImpersonatorFeatures_SendImpersonatorAlert_Match,
  Lib_ImpersonatorFeatures_SendImpersonatorAlert_Member,
  Lib_ImpersonatorFeatures_SendImpersonatorAlert_Returns,
  Lib_ImpersonatorFeatures_SendImpersonatorAlert_Runtime,
} from '../types/lib/impersonator-features.d.ts';

/**
 * Impersonator Features - Impersonator Alerts Schema.
 *
 * Validates archived identity expressions and optional trusted-account IDs.
 * Every enabled rule shares one explicit moderator destination.
 *
 * @since 4.0.0
 */
export const impersonatorAlertsSchema = z.object({
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
    user: z.object({
      'user-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    }).optional(),
  })).min(1).max(100),
});

/**
 * Impersonator Features - Compile Impersonator Alerts.
 *
 * Precompiles bounded identity matchers once for each Gateway generation.
 * Invalid expressions disable this feature without affecting other modules.
 *
 * @param {Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Returns}
 *
 * @since 4.0.0
 */
function compileImpersonatorAlerts(
  configuration: Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Configuration,
): Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Returns {
  const parsed: Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Parsed = impersonatorAlertsSchema.parse(
    configuration,
  );

  return {
    channelIdentifier: parsed['channel']['channel-id'],
    rules: parsed['entities'].map((entity) => {
      const content: Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Content = (
        entity['payload'] === undefined
      ) ? 'A potential impersonator was detected: %MEMBER_USER_MENTION%.' : entity['payload']['content'];
      const trustedUserIdentifier: Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_TrustedUserIdentifier = (
        entity['user'] === undefined
      ) ? undefined : entity['user']['user-id'];

      return {
        content,
        name: entity['name'],
        regularExpression: new RegExp(entity['regex']['pattern'], entity['regex']['flags']),
        trustedUserIdentifier,
      };
    }),
  };
}

/**
 * Impersonator Features - Create Registration.
 *
 * Registers join, nickname, and username checks for one validated generation.
 * Handler failures are isolated and logged without stopping the Gateway.
 *
 * @param {Lib_ImpersonatorFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_ImpersonatorFeatures_CreateRegistration_Runtime,
): Lib_ImpersonatorFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    client.on(Events.GuildMemberAdd, (member) => {
      void timeFeatureHandler('impersonator', Events.GuildMemberAdd, guildIdentifier, () => handleGuildMemberAdd(member, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'impersonator_join_dispatch_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
      void timeFeatureHandler('impersonator', Events.GuildMemberUpdate, guildIdentifier, () => handleGuildMemberUpdate(oldMember, newMember, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'impersonator_member_update_dispatch_failed', {
          error: getErrorMessage(error),
          guildIdentifier,
        });

        return;
      });

      return;
    });

    client.on(Events.UserUpdate, (oldUser, newUser) => {
      void timeFeatureHandler('impersonator', Events.UserUpdate, guildIdentifier, () => handleUserUpdate(client, oldUser, newUser, guildIdentifier, runtime)).catch((error) => {
        writeLog('error', 'bot', 'impersonator_user_update_dispatch_failed', {
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
 * Impersonator Features - Find Identity Match.
 *
 * Evaluates ordered identity candidates and retains the first matching rule.
 * Join events therefore emit no more than one alert for one member.
 *
 * @param {Lib_ImpersonatorFeatures_FindIdentityMatch_Rules}          rules          - Rules.
 * @param {Lib_ImpersonatorFeatures_FindIdentityMatch_Identities}     identities     - Identities.
 * @param {Lib_ImpersonatorFeatures_FindIdentityMatch_UserIdentifier} userIdentifier - User identifier.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_FindIdentityMatch_Returns}
 *
 * @since 4.0.0
 */
function findIdentityMatch(
  rules: Lib_ImpersonatorFeatures_FindIdentityMatch_Rules,
  identities: Lib_ImpersonatorFeatures_FindIdentityMatch_Identities,
  userIdentifier: Lib_ImpersonatorFeatures_FindIdentityMatch_UserIdentifier,
): Lib_ImpersonatorFeatures_FindIdentityMatch_Returns {
  const candidates: Lib_ImpersonatorFeatures_FindIdentityMatch_Candidates = identities.map((identity) => ({
    identity,
    rule: findMatchingImpersonatorRule(rules, identity, userIdentifier),
  }));
  const candidate: Lib_ImpersonatorFeatures_FindIdentityMatch_Candidate = candidates.find(
    (candidateValue) => candidateValue['rule'] !== undefined,
  );

  if (candidate === undefined || candidate['rule'] === undefined) {
    return undefined;
  }

  return {
    identity: candidate['identity'],
    rule: candidate['rule'],
  };
}

/**
 * Impersonator Features - Find Matching Impersonator Rule.
 *
 * Skips the configured trusted account and tests a normalized display value.
 * Reconstructed expressions make global and sticky flags deterministic.
 *
 * @param {Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Rules}          rules          - Rules.
 * @param {Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Identity}       identity       - Identity.
 * @param {Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_UserIdentifier} userIdentifier - User identifier.
 *
 * @returns {Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns}
 *
 * @since 4.0.0
 */
export function findMatchingImpersonatorRule(
  rules: Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Rules,
  identity: Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Identity,
  userIdentifier: Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_UserIdentifier,
): Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns {
  const normalizedIdentity: Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_NormalizedIdentity = normalizeIdentity(
    identity,
  );

  return rules.find((rule) => (
    rule['trustedUserIdentifier'] !== userIdentifier
    && matchesRegularExpression(rule['regularExpression'], normalizedIdentity) === true
  ));
}

/**
 * Impersonator Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without exposing submitted values.
 * Unexpected errors use the shared bounded message conversion.
 *
 * @param {Lib_ImpersonatorFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_ImpersonatorFeatures_FormatConfigurationError_Error,
): Lib_ImpersonatorFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_ImpersonatorFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Impersonator Features - Format Impersonator Message.
 *
 * Applies the archived member placeholder and includes bounded review evidence.
 * Automatic mention parsing remains disabled by the sending adapter.
 *
 * @param {Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Member} member - Member.
 * @param {Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Match}  match  - Match.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Returns}
 *
 * @since 4.0.0
 */
function formatImpersonatorMessage(
  member: Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Member,
  match: Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Match,
): Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Returns {
  const content: Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Content = match['rule']['content']
    .replaceAll('%MEMBER_USER_MENTION%', `<@${member['id']}>`);

  return [
    content,
    `Rule: ${match['rule']['name']}`,
    `Member: <@${member['id']}>`,
    `Observed name: ${match['identity']}`,
  ].join('\n').slice(0, 2_000);
}

/**
 * Impersonator Features - Get Enabled Feature.
 *
 * Reads one database-backed switch without trusting the surrounding JSON.
 * Disabled or absent settings never request privileged member access.
 *
 * @param {Lib_ImpersonatorFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_ImpersonatorFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_ImpersonatorFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_ImpersonatorFeatures_GetEnabledFeature_FeatureKey,
): Lib_ImpersonatorFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_ImpersonatorFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_ImpersonatorFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_ImpersonatorFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Impersonator Features - Handle Guild Member Add.
 *
 * Checks both the account username and current server display name on join.
 * One matching member produces at most one moderator notification.
 *
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Member}          member          - Member.
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberAdd_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberAdd(
  member: Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Member,
  guildIdentifier: Lib_ImpersonatorFeatures_HandleGuildMemberAdd_GuildIdentifier,
  runtime: Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Runtime,
): Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Returns {
  if (member['guild']['id'] !== guildIdentifier) {
    return;
  }

  const identities: Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Identities = [
    member['user']['username'],
    member['displayName'],
  ];

  await handleMemberIdentity(member, identities, runtime);

  return;
}

/**
 * Impersonator Features - Handle Guild Member Update.
 *
 * Rechecks only changed server display names and ignores role-only updates.
 * Username changes are handled separately by Discord's user update event.
 *
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_OldMember}       oldMember       - Old member.
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_NewMember}       newMember       - New member.
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleGuildMemberUpdate(
  oldMember: Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_OldMember,
  newMember: Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_NewMember,
  guildIdentifier: Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_GuildIdentifier,
  runtime: Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Runtime,
): Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Returns {
  if (
    newMember['guild']['id'] !== guildIdentifier
    || oldMember['displayName'] === newMember['displayName']
  ) {
    return;
  }

  await handleMemberIdentity(newMember, [newMember['displayName']], runtime);

  return;
}

/**
 * Impersonator Features - Handle Member Identity.
 *
 * Applies trusted-account exclusions before sending one observation-only alert.
 * Bot and Discord system accounts are never evaluated by imported patterns.
 *
 * @param {Lib_ImpersonatorFeatures_HandleMemberIdentity_Member}     member     - Member.
 * @param {Lib_ImpersonatorFeatures_HandleMemberIdentity_Identities} identities - Identities.
 * @param {Lib_ImpersonatorFeatures_HandleMemberIdentity_Runtime}    runtime    - Runtime.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_HandleMemberIdentity_Returns}
 *
 * @since 4.0.0
 */
async function handleMemberIdentity(
  member: Lib_ImpersonatorFeatures_HandleMemberIdentity_Member,
  identities: Lib_ImpersonatorFeatures_HandleMemberIdentity_Identities,
  runtime: Lib_ImpersonatorFeatures_HandleMemberIdentity_Runtime,
): Lib_ImpersonatorFeatures_HandleMemberIdentity_Returns {
  if (member['user']['bot'] === true || member['user']['system'] === true) {
    return;
  }

  const match: Lib_ImpersonatorFeatures_HandleMemberIdentity_Match = findIdentityMatch(
    runtime['rules'],
    identities,
    member['id'],
  );

  if (match === undefined) {
    return;
  }

  await sendImpersonatorAlert(member, runtime, match);

  writeLog('info', 'bot', 'impersonator_alert_sent', {
    ruleName: match['rule']['name'],
    userIdentifier: member['id'],
  });

  return;
}

/**
 * Impersonator Features - Handle User Update.
 *
 * Rechecks username changes only when the account belongs to the configured guild.
 * Cache misses safely skip the event instead of querying unrelated users globally.
 *
 * @param {Lib_ImpersonatorFeatures_HandleUserUpdate_Client}          client          - Client.
 * @param {Lib_ImpersonatorFeatures_HandleUserUpdate_OldUser}         oldUser         - Old user.
 * @param {Lib_ImpersonatorFeatures_HandleUserUpdate_NewUser}         newUser         - New user.
 * @param {Lib_ImpersonatorFeatures_HandleUserUpdate_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_ImpersonatorFeatures_HandleUserUpdate_Runtime}         runtime         - Runtime.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_HandleUserUpdate_Returns}
 *
 * @since 4.0.0
 */
async function handleUserUpdate(
  client: Lib_ImpersonatorFeatures_HandleUserUpdate_Client,
  oldUser: Lib_ImpersonatorFeatures_HandleUserUpdate_OldUser,
  newUser: Lib_ImpersonatorFeatures_HandleUserUpdate_NewUser,
  guildIdentifier: Lib_ImpersonatorFeatures_HandleUserUpdate_GuildIdentifier,
  runtime: Lib_ImpersonatorFeatures_HandleUserUpdate_Runtime,
): Lib_ImpersonatorFeatures_HandleUserUpdate_Returns {
  const identities: Lib_ImpersonatorFeatures_ChangedUserIdentities_Returns = changedUserIdentities(oldUser, newUser);

  if (identities.length === 0) {
    return;
  }

  const targetGuild: Lib_ImpersonatorFeatures_HandleUserUpdate_TargetGuild = client['guilds']['cache'].get(
    guildIdentifier,
  );

  if (targetGuild === undefined) {
    return;
  }

  const member: Lib_ImpersonatorFeatures_HandleUserUpdate_Member = targetGuild['members']['cache'].get(newUser['id']);

  if (member === undefined) {
    return;
  }

  await handleMemberIdentity(member, identities, runtime);

  return;
}

/**
 * Impersonator Features - Changed User Identities.
 *
 * Returns the new account username and global display name only when each changed.
 * Duplicate values are checked once, and a removed global name adds no identity.
 *
 * @param {Lib_ImpersonatorFeatures_ChangedUserIdentities_OldUser} oldUser - Old user.
 * @param {Lib_ImpersonatorFeatures_ChangedUserIdentities_NewUser} newUser - New user.
 *
 * @returns {Lib_ImpersonatorFeatures_ChangedUserIdentities_Returns}
 *
 * @since 4.0.0
 */
export function changedUserIdentities(
  oldUser: Lib_ImpersonatorFeatures_ChangedUserIdentities_OldUser,
  newUser: Lib_ImpersonatorFeatures_ChangedUserIdentities_NewUser,
): Lib_ImpersonatorFeatures_ChangedUserIdentities_Returns {
  const identities: Lib_ImpersonatorFeatures_ChangedUserIdentities_Returns = [];

  if (oldUser['username'] !== newUser['username']) {
    identities.push(newUser['username']);
  }

  if (oldUser['globalName'] !== newUser['globalName'] && newUser['globalName'] !== null) {
    identities.push(newUser['globalName']);
  }

  return [...new Set(identities)];
}

/**
 * Impersonator Features - Is Record.
 *
 * Narrows untrusted settings before reading feature state properties.
 * Arrays and null are not accepted as configuration maps.
 *
 * @param {Lib_ImpersonatorFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_ImpersonatorFeatures_IsRecord_Value,
): value is Lib_ImpersonatorFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Impersonator Features - Matches Regular Expression.
 *
 * Reconstructs configured expressions so global and sticky state cannot leak.
 * Every identity therefore receives the same deterministic comparison.
 *
 * @param {Lib_ImpersonatorFeatures_MatchesRegularExpression_RegularExpression} regularExpression - Regular expression.
 * @param {Lib_ImpersonatorFeatures_MatchesRegularExpression_Identity}          identity          - Identity.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_MatchesRegularExpression_Returns}
 *
 * @since 4.0.0
 */
function matchesRegularExpression(
  regularExpression: Lib_ImpersonatorFeatures_MatchesRegularExpression_RegularExpression,
  identity: Lib_ImpersonatorFeatures_MatchesRegularExpression_Identity,
): Lib_ImpersonatorFeatures_MatchesRegularExpression_Returns {
  return new RegExp(regularExpression.source, regularExpression.flags).test(identity);
}

/**
 * Impersonator Features - Normalize Identity.
 *
 * Applies compatibility decomposition and removes Unicode combining marks.
 * Locale-stable casing makes visually equivalent member names comparable.
 *
 * @param {Lib_ImpersonatorFeatures_NormalizeIdentity_Identity} identity - Identity.
 *
 * @returns {Lib_ImpersonatorFeatures_NormalizeIdentity_Returns}
 *
 * @since 4.0.0
 */
export function normalizeIdentity(
  identity: Lib_ImpersonatorFeatures_NormalizeIdentity_Identity,
): Lib_ImpersonatorFeatures_NormalizeIdentity_Returns {
  const combiningMarks: Lib_ImpersonatorFeatures_NormalizeIdentity_CombiningMarks = new RegExp(
    LIB_REGEX_PATTERN_MODERATION_COMBINING_MARKS,
    'gu',
  );

  return identity
    .normalize('NFKD')
    .replace(combiningMarks, '')
    .normalize('NFKC')
    .toLocaleLowerCase('en-US');
}

/**
 * Impersonator Features - Prepare Impersonator Features.
 *
 * Compiles the optional module before login and reports actionable diagnostics.
 * Valid configuration requests only the member intent it consumes.
 *
 * @param {Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareImpersonatorFeatures(
  settings: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Settings,
): Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns {
  let runtime: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Runtime = undefined;
  const activeFeatureKeys: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_ConfigurationErrors = [];
  const feature: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Feature = getEnabledFeature(
    settings,
    'impersonator-alerts',
  );

  if (feature !== undefined) {
    try {
      runtime = compileImpersonatorAlerts(feature['configuration']);

      activeFeatureKeys.push('impersonator-alerts');
    } catch (error) {
      recordConfigurationError('impersonator-alerts', error, configurationErrors);
    }
  }

  const intents: Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Intents = [];

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
 * Impersonator Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one structured startup warning.
 * A rejected identity module remains isolated from the Discord connection.
 *
 * @param {Lib_ImpersonatorFeatures_RecordConfigurationError_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_ImpersonatorFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_ImpersonatorFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  featureKey: Lib_ImpersonatorFeatures_RecordConfigurationError_FeatureKey,
  error: Lib_ImpersonatorFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_ImpersonatorFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_ImpersonatorFeatures_RecordConfigurationError_Returns {
  const message: Lib_ImpersonatorFeatures_RecordConfigurationError_Message = `${featureKey}: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'impersonator_feature_configuration_rejected', {
    featureKey,
    message,
  });

  return;
}

/**
 * Impersonator Features - Send Impersonator Alert.
 *
 * Resolves only the configured guild channel and sends bounded text safely.
 * Discord cannot expand user, role, or everyone mentions from imported text.
 *
 * @param {Lib_ImpersonatorFeatures_SendImpersonatorAlert_Member}  member  - Member.
 * @param {Lib_ImpersonatorFeatures_SendImpersonatorAlert_Runtime} runtime - Runtime.
 * @param {Lib_ImpersonatorFeatures_SendImpersonatorAlert_Match}   match   - Match.
 *
 * @private
 *
 * @returns {Lib_ImpersonatorFeatures_SendImpersonatorAlert_Returns}
 *
 * @since 4.0.0
 */
async function sendImpersonatorAlert(
  member: Lib_ImpersonatorFeatures_SendImpersonatorAlert_Member,
  runtime: Lib_ImpersonatorFeatures_SendImpersonatorAlert_Runtime,
  match: Lib_ImpersonatorFeatures_SendImpersonatorAlert_Match,
): Lib_ImpersonatorFeatures_SendImpersonatorAlert_Returns {
  const channel: Lib_ImpersonatorFeatures_SendImpersonatorAlert_Channel = await member['guild']['channels'].fetch(
    runtime['channelIdentifier'],
  );

  if (channel === null || channel.isSendable() === false) {
    throw new Error('Configured impersonator-alert channel is unavailable.');
  }

  await channel.send({
    allowedMentions: {
      parse: [],
    },
    content: formatImpersonatorMessage(member, match),
  });

  return;
}
