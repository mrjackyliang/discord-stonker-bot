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
  Lib_RoleSyncFeatures_ClearDebounceTimers_Returns,
  Lib_RoleSyncFeatures_ClearDebounceTimers_Timers,
  Lib_RoleSyncFeatures_CompileRoleSync_Configuration,
  Lib_RoleSyncFeatures_CompileRoleSync_Parsed,
  Lib_RoleSyncFeatures_CompileRoleSync_Returns,
  Lib_RoleSyncFeatures_CompileRoleSync_Rules,
  Lib_RoleSyncFeatures_CreateRegistration_DebounceTimer,
  Lib_RoleSyncFeatures_CreateRegistration_DebounceTimers,
  Lib_RoleSyncFeatures_CreateRegistration_ExistingTimer,
  Lib_RoleSyncFeatures_CreateRegistration_Returns,
  Lib_RoleSyncFeatures_CreateRegistration_Runtime,
  Lib_RoleSyncFeatures_DidMemberRolesChange_NewMember,
  Lib_RoleSyncFeatures_DidMemberRolesChange_OldMember,
  Lib_RoleSyncFeatures_DidMemberRolesChange_Returns,
  Lib_RoleSyncFeatures_FormatConfigurationError_Error,
  Lib_RoleSyncFeatures_FormatConfigurationError_Messages,
  Lib_RoleSyncFeatures_FormatConfigurationError_Returns,
  Lib_RoleSyncFeatures_GetEnabledFeature_FeatureKey,
  Lib_RoleSyncFeatures_GetEnabledFeature_Features,
  Lib_RoleSyncFeatures_GetEnabledFeature_RawFeature,
  Lib_RoleSyncFeatures_GetEnabledFeature_Returns,
  Lib_RoleSyncFeatures_GetEnabledFeature_Settings,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_Adjacency,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_Returns,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_RoleIdentifiers,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_Rules,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_TargetRoleIdentifiers,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_Targets,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_Visited,
  Lib_RoleSyncFeatures_HasRoleDependencyCycle_Visiting,
  Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Adjacency,
  Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Returns,
  Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_RoleIdentifier,
  Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Targets,
  Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visited,
  Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visiting,
  Lib_RoleSyncFeatures_IsRecord_TypeGuard,
  Lib_RoleSyncFeatures_IsRecord_Value,
  Lib_RoleSyncFeatures_PlanRoleChanges_ActiveRules,
  Lib_RoleSyncFeatures_PlanRoleChanges_AddRoleIdentifiers,
  Lib_RoleSyncFeatures_PlanRoleChanges_ConflictingRoleIdentifiers,
  Lib_RoleSyncFeatures_PlanRoleChanges_CurrentRoleIdentifiers,
  Lib_RoleSyncFeatures_PlanRoleChanges_RemoveRoleIdentifiers,
  Lib_RoleSyncFeatures_PlanRoleChanges_RequestedAddRoleIdentifiers,
  Lib_RoleSyncFeatures_PlanRoleChanges_RequestedRemoveRoleIdentifiers,
  Lib_RoleSyncFeatures_PlanRoleChanges_Returns,
  Lib_RoleSyncFeatures_PlanRoleChanges_Rules,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_ActiveFeatureKeys,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_ConfigurationErrors,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Feature,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Intents,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Runtime,
  Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Settings,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_CurrentRoleIdentifiers,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_Member,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_Plan,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_Reason,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_Returns,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_Role,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_Runtime,
  Lib_RoleSyncFeatures_ReconcileMemberRoles_TargetRoleIdentifiers,
  Lib_RoleSyncFeatures_RecordConfigurationError_ConfigurationErrors,
  Lib_RoleSyncFeatures_RecordConfigurationError_Error,
  Lib_RoleSyncFeatures_RecordConfigurationError_FeatureKey,
  Lib_RoleSyncFeatures_RecordConfigurationError_Message,
  Lib_RoleSyncFeatures_RecordConfigurationError_Returns,
} from '../types/lib/role-sync-features.d.ts';

/**
 * Role Sync Features - Role Sync Schema.
 *
 * Bounds debounce delays, dependency roles, and every potential mutation.
 * Each rule must choose exactly one idempotent add or remove operation.
 *
 * @since 4.0.0
 */
export const roleSyncSchema = z.object({
  events: z.array(z.object({
    'has-some-roles': z.boolean(),
    'name': z.string().trim().min(1).max(100),
    'some-roles': z.array(z.object({
      'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    })).min(1).max(25),
    'to-add-roles': z.array(z.object({
      'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    })).min(1).max(25).optional(),
    'to-remove-roles': z.array(z.object({
      'role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    })).min(1).max(25).optional(),
  }).superRefine((value, context) => {
    if ((value['to-add-roles'] === undefined) === (value['to-remove-roles'] === undefined)) {
      context.addIssue({
        code: 'custom',
        message: 'Exactly one of to-add-roles or to-remove-roles is required.',
      });
    }

    return;
  })).min(1).max(100),
  timeout: z.number().finite().min(0).max(30),
});

/**
 * Role Sync Features - Clear Debounce Timers.
 *
 * Cancels pending reconciliation when the only Gateway shard disconnects.
 * No delayed role change survives a stopped or replaced bot generation.
 *
 * @param {Lib_RoleSyncFeatures_ClearDebounceTimers_Timers} timers - Timers.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_ClearDebounceTimers_Returns}
 *
 * @since 4.0.0
 */
function clearDebounceTimers(
  timers: Lib_RoleSyncFeatures_ClearDebounceTimers_Timers,
): Lib_RoleSyncFeatures_ClearDebounceTimers_Returns {
  for (const timer of timers.values()) {
    clearTimeout(timer);
  }

  timers.clear();

  return;
}

/**
 * Role Sync Features - Compile Role Sync.
 *
 * Converts archived role references into immutable reconciliation rules.
 * Cyclic role dependencies are rejected before Discord login.
 *
 * @param {Lib_RoleSyncFeatures_CompileRoleSync_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_CompileRoleSync_Returns}
 *
 * @since 4.0.0
 */
function compileRoleSync(
  configuration: Lib_RoleSyncFeatures_CompileRoleSync_Configuration,
): Lib_RoleSyncFeatures_CompileRoleSync_Returns {
  const parsed: Lib_RoleSyncFeatures_CompileRoleSync_Parsed = roleSyncSchema.parse(configuration);
  const rules: Lib_RoleSyncFeatures_CompileRoleSync_Rules = parsed['events'].map((event) => {
    return {
      addRoleIdentifiers: (event['to-add-roles'] ?? []).map((role) => role['role-id']),
      hasSomeRoles: event['has-some-roles'],
      name: event['name'],
      removeRoleIdentifiers: (event['to-remove-roles'] ?? []).map((role) => role['role-id']),
      triggerRoleIdentifiers: event['some-roles'].map((role) => role['role-id']),
    };
  });

  if (hasRoleDependencyCycle(rules) === true) {
    throw new Error('Role synchronization dependencies contain a cycle.');
  }

  return {
    rules,
    timeoutMilliseconds: parsed['timeout'] * 1_000,
  };
}

/**
 * Role Sync Features - Create Registration.
 *
 * Coalesces member role events before running one bounded reconciliation.
 * Per-member timers prevent event storms and are cleared on disconnect.
 *
 * @param {Lib_RoleSyncFeatures_CreateRegistration_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_CreateRegistration_Returns}
 *
 * @since 4.0.0
 */
function createRegistration(
  runtime: Lib_RoleSyncFeatures_CreateRegistration_Runtime,
): Lib_RoleSyncFeatures_CreateRegistration_Returns {
  return (client, guildIdentifier) => {
    const debounceTimers: Lib_RoleSyncFeatures_CreateRegistration_DebounceTimers = new Map();

    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
      if (
        newMember['guild']['id'] !== guildIdentifier
        || didMemberRolesChange(oldMember, newMember) === false
      ) {
        return;
      }

      const existingTimer: Lib_RoleSyncFeatures_CreateRegistration_ExistingTimer = debounceTimers.get(newMember['id']);

      if (existingTimer !== undefined) {
        clearTimeout(existingTimer);
      }

      const debounceTimer: Lib_RoleSyncFeatures_CreateRegistration_DebounceTimer = setTimeout(() => {
        debounceTimers.delete(newMember['id']);

        void timeFeatureHandler('role-sync', Events.GuildMemberUpdate, guildIdentifier, () => reconcileMemberRoles(newMember, runtime)).catch((error) => {
          writeLog('error', 'bot', 'role_sync_reconciliation_failed', {
            error: getErrorMessage(error),
            guildIdentifier,
            userIdentifier: newMember['id'],
          });

          return;
        });

        return;
      }, runtime['timeoutMilliseconds']);

      debounceTimers.set(newMember['id'], debounceTimer);

      return;
    });

    client.on(Events.ShardDisconnect, () => {
      clearDebounceTimers(debounceTimers);

      return;
    });

    return;
  };
}

/**
 * Role Sync Features - Did Member Roles Change.
 *
 * Ignores nickname, timeout, and profile-only member update events.
 * Role reconciliation starts only when the member role set differs.
 *
 * @param {Lib_RoleSyncFeatures_DidMemberRolesChange_OldMember} oldMember - Old member.
 * @param {Lib_RoleSyncFeatures_DidMemberRolesChange_NewMember} newMember - New member.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_DidMemberRolesChange_Returns}
 *
 * @since 4.0.0
 */
function didMemberRolesChange(
  oldMember: Lib_RoleSyncFeatures_DidMemberRolesChange_OldMember,
  newMember: Lib_RoleSyncFeatures_DidMemberRolesChange_NewMember,
): Lib_RoleSyncFeatures_DidMemberRolesChange_Returns {
  return oldMember['roles']['cache']['size'] !== newMember['roles']['cache']['size']
    || oldMember['roles']['cache'].some((role) => newMember['roles']['cache'].has(role['id']) === false);
}

/**
 * Role Sync Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without exposing submitted values.
 * Unexpected errors use the shared bounded message conversion.
 *
 * @param {Lib_RoleSyncFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_RoleSyncFeatures_FormatConfigurationError_Error,
): Lib_RoleSyncFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_RoleSyncFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Role Sync Features - Get Enabled Feature.
 *
 * Reads one database-backed switch without trusting the surrounding JSON.
 * Disabled or absent settings never request privileged member access.
 *
 * @param {Lib_RoleSyncFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_RoleSyncFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_RoleSyncFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_RoleSyncFeatures_GetEnabledFeature_FeatureKey,
): Lib_RoleSyncFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_RoleSyncFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_RoleSyncFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_RoleSyncFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Role Sync Features - Has Role Dependency Cycle.
 *
 * Builds a conservative trigger-to-target graph across every configured rule.
 * Any cycle is rejected to prevent self-sustaining role update loops.
 *
 * @param {Lib_RoleSyncFeatures_HasRoleDependencyCycle_Rules} rules - Rules.
 *
 * @returns {Lib_RoleSyncFeatures_HasRoleDependencyCycle_Returns}
 *
 * @since 4.0.0
 */
export function hasRoleDependencyCycle(
  rules: Lib_RoleSyncFeatures_HasRoleDependencyCycle_Rules,
): Lib_RoleSyncFeatures_HasRoleDependencyCycle_Returns {
  const adjacency: Lib_RoleSyncFeatures_HasRoleDependencyCycle_Adjacency = new Map();

  for (const rule of rules) {
    const targetRoleIdentifiers: Lib_RoleSyncFeatures_HasRoleDependencyCycle_TargetRoleIdentifiers = [
      ...rule['addRoleIdentifiers'],
      ...rule['removeRoleIdentifiers'],
    ];

    for (const triggerRoleIdentifier of rule['triggerRoleIdentifiers']) {
      if (adjacency.has(triggerRoleIdentifier) === false) {
        adjacency.set(triggerRoleIdentifier, new Set());
      }

      const targets: Lib_RoleSyncFeatures_HasRoleDependencyCycle_Targets = adjacency.get(
        triggerRoleIdentifier,
      ) ?? new Set();

      for (const targetRoleIdentifier of targetRoleIdentifiers) {
        targets.add(targetRoleIdentifier);

        if (adjacency.has(targetRoleIdentifier) === false) {
          adjacency.set(targetRoleIdentifier, new Set());
        }
      }
    }
  }

  const roleIdentifiers: Lib_RoleSyncFeatures_HasRoleDependencyCycle_RoleIdentifiers = [...adjacency.keys()];
  const visited: Lib_RoleSyncFeatures_HasRoleDependencyCycle_Visited = new Set();
  const visiting: Lib_RoleSyncFeatures_HasRoleDependencyCycle_Visiting = new Set();

  return roleIdentifiers.some((roleIdentifier) => hasRoleDependencyCycleFrom(
    roleIdentifier,
    adjacency,
    visiting,
    visited,
  ) === true);
}

/**
 * Role Sync Features - Has Role Dependency Cycle From.
 *
 * Traverses one role dependency path with separate active and completed sets.
 * Encountering an active node proves a directed cycle exists.
 *
 * @param {Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_RoleIdentifier} roleIdentifier - Role identifier.
 * @param {Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Adjacency}      adjacency      - Adjacency.
 * @param {Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visiting}       visiting       - Visiting.
 * @param {Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visited}        visited        - Visited.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Returns}
 *
 * @since 4.0.0
 */
function hasRoleDependencyCycleFrom(
  roleIdentifier: Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_RoleIdentifier,
  adjacency: Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Adjacency,
  visiting: Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visiting,
  visited: Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visited,
): Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Returns {
  if (visiting.has(roleIdentifier) === true) {
    return true;
  }

  if (visited.has(roleIdentifier) === true) {
    return false;
  }

  visiting.add(roleIdentifier);

  const targets: Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Targets = adjacency.get(roleIdentifier);

  if (
    targets !== undefined
    && [...targets].some((target) => hasRoleDependencyCycleFrom(
      target,
      adjacency,
      visiting,
      visited,
    ) === true) === true
  ) {
    return true;
  }

  visiting.delete(roleIdentifier);

  visited.add(roleIdentifier);

  return false;
}

/**
 * Role Sync Features - Is Record.
 *
 * Narrows untrusted settings before reading feature state properties.
 * Arrays and null are not accepted as configuration maps.
 *
 * @param {Lib_RoleSyncFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_RoleSyncFeatures_IsRecord_Value,
): value is Lib_RoleSyncFeatures_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Role Sync Features - Plan Role Changes.
 *
 * Selects applicable rules and computes only missing additions or present removals.
 * Contradictory actions are surfaced and excluded from both mutation sets.
 *
 * @param {Lib_RoleSyncFeatures_PlanRoleChanges_Rules}                  rules                  - Rules.
 * @param {Lib_RoleSyncFeatures_PlanRoleChanges_CurrentRoleIdentifiers} currentRoleIdentifiers - Current role identifiers.
 *
 * @returns {Lib_RoleSyncFeatures_PlanRoleChanges_Returns}
 *
 * @since 4.0.0
 */
export function planRoleChanges(
  rules: Lib_RoleSyncFeatures_PlanRoleChanges_Rules,
  currentRoleIdentifiers: Lib_RoleSyncFeatures_PlanRoleChanges_CurrentRoleIdentifiers,
): Lib_RoleSyncFeatures_PlanRoleChanges_Returns {
  const activeRules: Lib_RoleSyncFeatures_PlanRoleChanges_ActiveRules = rules.filter((rule) => (
    rule['triggerRoleIdentifiers'].some((roleIdentifier) => currentRoleIdentifiers.has(roleIdentifier) === true)
    === rule['hasSomeRoles']
  ));
  const requestedAddRoleIdentifiers: Lib_RoleSyncFeatures_PlanRoleChanges_RequestedAddRoleIdentifiers = new Set(activeRules.flatMap((rule) => rule['addRoleIdentifiers']));
  const requestedRemoveRoleIdentifiers: Lib_RoleSyncFeatures_PlanRoleChanges_RequestedRemoveRoleIdentifiers = new Set(activeRules.flatMap((rule) => rule['removeRoleIdentifiers']));
  const conflictingRoleIdentifiers: Lib_RoleSyncFeatures_PlanRoleChanges_ConflictingRoleIdentifiers = Array.from(
    requestedAddRoleIdentifiers,
  ).filter((roleIdentifier) => requestedRemoveRoleIdentifiers.has(roleIdentifier) === true);
  const addRoleIdentifiers: Lib_RoleSyncFeatures_PlanRoleChanges_AddRoleIdentifiers = new Set(
    [...requestedAddRoleIdentifiers].filter((roleIdentifier) => (
      currentRoleIdentifiers.has(roleIdentifier) === false
      && conflictingRoleIdentifiers.includes(roleIdentifier) === false
    )),
  );
  const removeRoleIdentifiers: Lib_RoleSyncFeatures_PlanRoleChanges_RemoveRoleIdentifiers = new Set(
    [...requestedRemoveRoleIdentifiers].filter((roleIdentifier) => (
      currentRoleIdentifiers.has(roleIdentifier) === true
      && conflictingRoleIdentifiers.includes(roleIdentifier) === false
    )),
  );

  return {
    addRoleIdentifiers: [...addRoleIdentifiers],
    conflictingRoleIdentifiers,
    removeRoleIdentifiers: [...removeRoleIdentifiers],
    ruleNames: activeRules.map((rule) => rule['name']),
  };
}

/**
 * Role Sync Features - Prepare Role Sync Features.
 *
 * Compiles the optional module before login and reports actionable diagnostics.
 * Valid configuration requests only the member intent it consumes.
 *
 * @param {Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareRoleSyncFeatures(
  settings: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Settings,
): Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns {
  let runtime: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Runtime = undefined;
  const activeFeatureKeys: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_ConfigurationErrors = [];
  const feature: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Feature = getEnabledFeature(
    settings,
    'sync-roles',
  );

  if (feature !== undefined) {
    try {
      runtime = compileRoleSync(feature['configuration']);

      activeFeatureKeys.push('sync-roles');
    } catch (error) {
      recordConfigurationError('sync-roles', error, configurationErrors);
    }
  }

  const intents: Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Intents = [];

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
 * Role Sync Features - Reconcile Member Roles.
 *
 * Validates member and bot hierarchy before applying one idempotent change set.
 * Discord audit-log reasons identify every rule involved in the decision.
 *
 * @param {Lib_RoleSyncFeatures_ReconcileMemberRoles_Member}  member  - Member.
 * @param {Lib_RoleSyncFeatures_ReconcileMemberRoles_Runtime} runtime - Runtime.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_ReconcileMemberRoles_Returns}
 *
 * @since 4.0.0
 */
async function reconcileMemberRoles(
  member: Lib_RoleSyncFeatures_ReconcileMemberRoles_Member,
  runtime: Lib_RoleSyncFeatures_ReconcileMemberRoles_Runtime,
): Lib_RoleSyncFeatures_ReconcileMemberRoles_Returns {
  if (member['user']['bot'] === true || member['user']['system'] === true) {
    return;
  }

  const currentRoleIdentifiers: Lib_RoleSyncFeatures_ReconcileMemberRoles_CurrentRoleIdentifiers = new Set(
    member['roles']['cache'].keys(),
  );
  const plan: Lib_RoleSyncFeatures_ReconcileMemberRoles_Plan = planRoleChanges(
    runtime['rules'],
    currentRoleIdentifiers,
  );

  if (plan['conflictingRoleIdentifiers'].length > 0) {
    throw new Error('Role synchronization produced contradictory add and remove operations.');
  }

  if (plan['addRoleIdentifiers'].length === 0 && plan['removeRoleIdentifiers'].length === 0) {
    return;
  }

  if (member['manageable'] === false) {
    throw new Error('The bot role cannot manage this member.');
  }

  const targetRoleIdentifiers: Lib_RoleSyncFeatures_ReconcileMemberRoles_TargetRoleIdentifiers = [
    ...plan['addRoleIdentifiers'],
    ...plan['removeRoleIdentifiers'],
  ];

  for (const roleIdentifier of targetRoleIdentifiers) {
    const role: Lib_RoleSyncFeatures_ReconcileMemberRoles_Role = member['guild']['roles']['cache'].get(roleIdentifier);

    if (
      role === undefined
      || role['id'] === member['guild']['id']
      || role['managed'] === true
      || role['editable'] === false
    ) {
      throw new Error(`The bot role cannot manage configured role ${roleIdentifier}.`);
    }
  }

  const reason: Lib_RoleSyncFeatures_ReconcileMemberRoles_Reason = `Role synchronization: ${plan['ruleNames'].join(', ')}`
    .slice(0, 512);

  if (plan['addRoleIdentifiers'].length > 0) {
    await member['roles'].add(plan['addRoleIdentifiers'], reason);
  }

  if (plan['removeRoleIdentifiers'].length > 0) {
    await member['roles'].remove(plan['removeRoleIdentifiers'], reason);
  }

  writeLog('info', 'bot', 'role_sync_reconciled', {
    addedRoleIdentifiers: plan['addRoleIdentifiers'],
    removedRoleIdentifiers: plan['removeRoleIdentifiers'],
    userIdentifier: member['id'],
  });

  return;
}

/**
 * Role Sync Features - Record Configuration Error.
 *
 * Adds safe panel diagnostics and emits one structured startup warning.
 * A rejected role module remains isolated from the Discord connection.
 *
 * @param {Lib_RoleSyncFeatures_RecordConfigurationError_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_RoleSyncFeatures_RecordConfigurationError_Error}               error               - Error.
 * @param {Lib_RoleSyncFeatures_RecordConfigurationError_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_RoleSyncFeatures_RecordConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function recordConfigurationError(
  featureKey: Lib_RoleSyncFeatures_RecordConfigurationError_FeatureKey,
  error: Lib_RoleSyncFeatures_RecordConfigurationError_Error,
  configurationErrors: Lib_RoleSyncFeatures_RecordConfigurationError_ConfigurationErrors,
): Lib_RoleSyncFeatures_RecordConfigurationError_Returns {
  const message: Lib_RoleSyncFeatures_RecordConfigurationError_Message = `${featureKey}: ${formatConfigurationError(error)}`;

  configurationErrors.push(message);

  writeLog('warn', 'bot', 'role_sync_feature_configuration_rejected', {
    featureKey,
    message,
  });

  return;
}
