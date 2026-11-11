import type {
  Client,
  GatewayIntentBits,
  GuildMember,
  PartialGuildMember,
  Role,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_RoleSyncFeatures_RoleReference_RoleIdentifier = string;
export type Lib_RoleSyncFeatures_RoleReference = {
  'role-id': Lib_RoleSyncFeatures_RoleReference_RoleIdentifier;
};

export type Lib_RoleSyncFeatures_EventConfiguration_HasSomeRoles = boolean;
export type Lib_RoleSyncFeatures_EventConfiguration_Name = string;
export type Lib_RoleSyncFeatures_EventConfiguration_SomeRoles = Lib_RoleSyncFeatures_RoleReference[];
export type Lib_RoleSyncFeatures_EventConfiguration_ToAddRoles = Lib_RoleSyncFeatures_RoleReference[] | undefined;
export type Lib_RoleSyncFeatures_EventConfiguration_ToRemoveRoles = Lib_RoleSyncFeatures_RoleReference[] | undefined;
export type Lib_RoleSyncFeatures_EventConfiguration = {
  'has-some-roles': Lib_RoleSyncFeatures_EventConfiguration_HasSomeRoles;
  'name': Lib_RoleSyncFeatures_EventConfiguration_Name;
  'some-roles': Lib_RoleSyncFeatures_EventConfiguration_SomeRoles;
  'to-add-roles'?: Lib_RoleSyncFeatures_EventConfiguration_ToAddRoles;
  'to-remove-roles'?: Lib_RoleSyncFeatures_EventConfiguration_ToRemoveRoles;
};

export type Lib_RoleSyncFeatures_Configuration_Events = Lib_RoleSyncFeatures_EventConfiguration[];
export type Lib_RoleSyncFeatures_Configuration_Timeout = number;
export type Lib_RoleSyncFeatures_Configuration = {
  events: Lib_RoleSyncFeatures_Configuration_Events;
  timeout: Lib_RoleSyncFeatures_Configuration_Timeout;
};

export type Lib_RoleSyncFeatures_Rule_AddRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_Rule_HasSomeRoles = boolean;
export type Lib_RoleSyncFeatures_Rule_Name = string;
export type Lib_RoleSyncFeatures_Rule_RemoveRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_Rule_TriggerRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_Rule = {
  addRoleIdentifiers: Lib_RoleSyncFeatures_Rule_AddRoleIdentifiers;
  hasSomeRoles: Lib_RoleSyncFeatures_Rule_HasSomeRoles;
  name: Lib_RoleSyncFeatures_Rule_Name;
  removeRoleIdentifiers: Lib_RoleSyncFeatures_Rule_RemoveRoleIdentifiers;
  triggerRoleIdentifiers: Lib_RoleSyncFeatures_Rule_TriggerRoleIdentifiers;
};

export type Lib_RoleSyncFeatures_Runtime_Rules = Lib_RoleSyncFeatures_Rule[];
export type Lib_RoleSyncFeatures_Runtime_TimeoutMilliseconds = number;
export type Lib_RoleSyncFeatures_Runtime = {
  rules: Lib_RoleSyncFeatures_Runtime_Rules;
  timeoutMilliseconds: Lib_RoleSyncFeatures_Runtime_TimeoutMilliseconds;
};

export type Lib_RoleSyncFeatures_RoleChangePlan_AddRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_RoleChangePlan_ConflictingRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_RoleChangePlan_RemoveRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_RoleChangePlan_RuleNames = string[];
export type Lib_RoleSyncFeatures_RoleChangePlan = {
  addRoleIdentifiers: Lib_RoleSyncFeatures_RoleChangePlan_AddRoleIdentifiers;
  conflictingRoleIdentifiers: Lib_RoleSyncFeatures_RoleChangePlan_ConflictingRoleIdentifiers;
  removeRoleIdentifiers: Lib_RoleSyncFeatures_RoleChangePlan_RemoveRoleIdentifiers;
  ruleNames: Lib_RoleSyncFeatures_RoleChangePlan_RuleNames;
};

export type Lib_RoleSyncFeatures_Registration_Client = Client;
export type Lib_RoleSyncFeatures_Registration_GuildIdentifier = string;
export type Lib_RoleSyncFeatures_Registration = (
  client: Lib_RoleSyncFeatures_Registration_Client,
  guildIdentifier: Lib_RoleSyncFeatures_Registration_GuildIdentifier,
) => void;

export type Lib_RoleSyncFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_RoleSyncFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_RoleSyncFeatures_Prepared_Intents = GatewayIntentBits[];
export type Lib_RoleSyncFeatures_Prepared_Register = Lib_RoleSyncFeatures_Registration;
export type Lib_RoleSyncFeatures_Prepared = {
  activeFeatureKeys: Lib_RoleSyncFeatures_Prepared_ActiveFeatureKeys;
  configurationErrors: Lib_RoleSyncFeatures_Prepared_ConfigurationErrors;
  intents: Lib_RoleSyncFeatures_Prepared_Intents;
  register: Lib_RoleSyncFeatures_Prepared_Register;
};

export type Lib_RoleSyncFeatures_ClearDebounceTimers_Returns = void;
export type Lib_RoleSyncFeatures_ClearDebounceTimers_Timers = Map<string, NodeJS.Timeout>;

export type Lib_RoleSyncFeatures_CompileRoleSync_Configuration = unknown;
export type Lib_RoleSyncFeatures_CompileRoleSync_Parsed = Lib_RoleSyncFeatures_Configuration;
export type Lib_RoleSyncFeatures_CompileRoleSync_Returns = Lib_RoleSyncFeatures_Runtime;
export type Lib_RoleSyncFeatures_CompileRoleSync_Rules = Lib_RoleSyncFeatures_Rule[];

export type Lib_RoleSyncFeatures_CreateRegistration_DebounceTimer = NodeJS.Timeout;
export type Lib_RoleSyncFeatures_CreateRegistration_DebounceTimers = Map<string, NodeJS.Timeout>;
export type Lib_RoleSyncFeatures_CreateRegistration_ExistingTimer = NodeJS.Timeout | undefined;
export type Lib_RoleSyncFeatures_CreateRegistration_Returns = Lib_RoleSyncFeatures_Registration;
export type Lib_RoleSyncFeatures_CreateRegistration_Runtime = Lib_RoleSyncFeatures_Runtime;

export type Lib_RoleSyncFeatures_DidMemberRolesChange_NewMember = GuildMember;
export type Lib_RoleSyncFeatures_DidMemberRolesChange_OldMember = GuildMember | PartialGuildMember;
export type Lib_RoleSyncFeatures_DidMemberRolesChange_Returns = boolean;

export type Lib_RoleSyncFeatures_FormatConfigurationError_Error = unknown;
export type Lib_RoleSyncFeatures_FormatConfigurationError_Messages = string[];
export type Lib_RoleSyncFeatures_FormatConfigurationError_Returns = string;

export type Lib_RoleSyncFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: unknown;
};
export type Lib_RoleSyncFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_RoleSyncFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_RoleSyncFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_RoleSyncFeatures_GetEnabledFeature_Returns = Lib_RoleSyncFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_RoleSyncFeatures_GetEnabledFeature_Settings = Shared_JsonObject;

export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_Adjacency = Map<string, Set<string>>;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_Rules = Lib_RoleSyncFeatures_Rule[];
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_Returns = boolean;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_RoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_TargetRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_Targets = Set<string>;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_Visited = Set<string>;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycle_Visiting = Set<string>;

export type Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Adjacency = Map<string, Set<string>>;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Returns = boolean;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_RoleIdentifier = string;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Targets = Set<string> | undefined;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visited = Set<string>;
export type Lib_RoleSyncFeatures_HasRoleDependencyCycleFrom_Visiting = Set<string>;

export type Lib_RoleSyncFeatures_IsRecord_TypeGuard = Record<string, unknown>;
export type Lib_RoleSyncFeatures_IsRecord_Value = unknown;

export type Lib_RoleSyncFeatures_PlanRoleChanges_ActiveRules = Lib_RoleSyncFeatures_Rule[];
export type Lib_RoleSyncFeatures_PlanRoleChanges_RequestedAddRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_PlanRoleChanges_RequestedRemoveRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_PlanRoleChanges_AddRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_PlanRoleChanges_ConflictingRoleIdentifiers = string[];
export type Lib_RoleSyncFeatures_PlanRoleChanges_CurrentRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_PlanRoleChanges_RemoveRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_PlanRoleChanges_Returns = Lib_RoleSyncFeatures_RoleChangePlan;
export type Lib_RoleSyncFeatures_PlanRoleChanges_Rules = Lib_RoleSyncFeatures_Rule[];

export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_ConfigurationErrors = string[];
export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Feature = Lib_RoleSyncFeatures_GetEnabledFeature_Returns;
export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Intents = GatewayIntentBits[];
export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Returns = Lib_RoleSyncFeatures_Prepared;
export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Runtime = Lib_RoleSyncFeatures_Runtime | undefined;
export type Lib_RoleSyncFeatures_PrepareRoleSyncFeatures_Settings = Shared_JsonObject;

export type Lib_RoleSyncFeatures_ReconcileMemberRoles_CurrentRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_ManagedRoles = Role[];
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_Member = GuildMember;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_Plan = Lib_RoleSyncFeatures_RoleChangePlan;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_Reason = string;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_Returns = Promise<void>;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_Role = Role | undefined;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_Runtime = Lib_RoleSyncFeatures_Runtime;
export type Lib_RoleSyncFeatures_ReconcileMemberRoles_TargetRoleIdentifiers = string[];

export type Lib_RoleSyncFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_RoleSyncFeatures_RecordConfigurationError_Error = unknown;
export type Lib_RoleSyncFeatures_RecordConfigurationError_FeatureKey = Shared_FeatureKey;
export type Lib_RoleSyncFeatures_RecordConfigurationError_Message = string;
export type Lib_RoleSyncFeatures_RecordConfigurationError_Returns = void;

export type Lib_RoleSyncFeatures_Test_CurrentRoleIdentifiers = Set<string>;
export type Lib_RoleSyncFeatures_Test_Rules = Lib_RoleSyncFeatures_Rule[];
