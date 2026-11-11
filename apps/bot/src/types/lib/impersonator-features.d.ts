import type {
  Client,
  GatewayIntentBits,
  Guild,
  GuildBasedChannel,
  GuildMember,
  PartialGuildMember,
  PartialUser,
  User,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_ImpersonatorFeatures_ChannelReference_ChannelIdentifier = string;
export type Lib_ImpersonatorFeatures_ChannelReference = {
  'channel-id': Lib_ImpersonatorFeatures_ChannelReference_ChannelIdentifier;
};

export type Lib_ImpersonatorFeatures_RegularExpressionConfiguration_Flags = string | undefined;
export type Lib_ImpersonatorFeatures_RegularExpressionConfiguration_Pattern = string;
export type Lib_ImpersonatorFeatures_RegularExpressionConfiguration = {
  flags?: Lib_ImpersonatorFeatures_RegularExpressionConfiguration_Flags;
  pattern: Lib_ImpersonatorFeatures_RegularExpressionConfiguration_Pattern;
};

export type Lib_ImpersonatorFeatures_PayloadConfiguration_Content = string;
export type Lib_ImpersonatorFeatures_PayloadConfiguration = {
  content: Lib_ImpersonatorFeatures_PayloadConfiguration_Content;
};

export type Lib_ImpersonatorFeatures_UserReference_UserIdentifier = string;
export type Lib_ImpersonatorFeatures_UserReference = {
  'user-id': Lib_ImpersonatorFeatures_UserReference_UserIdentifier;
};

export type Lib_ImpersonatorFeatures_EntityConfiguration_Name = string;
export type Lib_ImpersonatorFeatures_EntityConfiguration_Payload = Lib_ImpersonatorFeatures_PayloadConfiguration | undefined;
export type Lib_ImpersonatorFeatures_EntityConfiguration_Regex = Lib_ImpersonatorFeatures_RegularExpressionConfiguration;
export type Lib_ImpersonatorFeatures_EntityConfiguration_User = Lib_ImpersonatorFeatures_UserReference | undefined;
export type Lib_ImpersonatorFeatures_EntityConfiguration = {
  name: Lib_ImpersonatorFeatures_EntityConfiguration_Name;
  payload?: Lib_ImpersonatorFeatures_EntityConfiguration_Payload;
  regex: Lib_ImpersonatorFeatures_EntityConfiguration_Regex;
  user?: Lib_ImpersonatorFeatures_EntityConfiguration_User;
};

export type Lib_ImpersonatorFeatures_Configuration_Channel = Lib_ImpersonatorFeatures_ChannelReference;
export type Lib_ImpersonatorFeatures_Configuration_Entities = Lib_ImpersonatorFeatures_EntityConfiguration[];
export type Lib_ImpersonatorFeatures_Configuration = {
  channel: Lib_ImpersonatorFeatures_Configuration_Channel;
  entities: Lib_ImpersonatorFeatures_Configuration_Entities;
};

export type Lib_ImpersonatorFeatures_Rule_Content = string;
export type Lib_ImpersonatorFeatures_Rule_Name = string;
export type Lib_ImpersonatorFeatures_Rule_RegularExpression = RegExp;
export type Lib_ImpersonatorFeatures_Rule_TrustedUserIdentifier = string | undefined;
export type Lib_ImpersonatorFeatures_Rule = {
  content: Lib_ImpersonatorFeatures_Rule_Content;
  name: Lib_ImpersonatorFeatures_Rule_Name;
  regularExpression: Lib_ImpersonatorFeatures_Rule_RegularExpression;
  trustedUserIdentifier: Lib_ImpersonatorFeatures_Rule_TrustedUserIdentifier;
};

export type Lib_ImpersonatorFeatures_Runtime_ChannelIdentifier = string;
export type Lib_ImpersonatorFeatures_Runtime_Rules = Lib_ImpersonatorFeatures_Rule[];
export type Lib_ImpersonatorFeatures_Runtime = {
  channelIdentifier: Lib_ImpersonatorFeatures_Runtime_ChannelIdentifier;
  rules: Lib_ImpersonatorFeatures_Runtime_Rules;
};

export type Lib_ImpersonatorFeatures_IdentityMatch_Identity = string;
export type Lib_ImpersonatorFeatures_IdentityMatch_Rule = Lib_ImpersonatorFeatures_Rule;
export type Lib_ImpersonatorFeatures_IdentityMatch = {
  identity: Lib_ImpersonatorFeatures_IdentityMatch_Identity;
  rule: Lib_ImpersonatorFeatures_IdentityMatch_Rule;
};

export type Lib_ImpersonatorFeatures_Registration_Client = Client;
export type Lib_ImpersonatorFeatures_Registration_GuildIdentifier = string;
export type Lib_ImpersonatorFeatures_Registration = (
  client: Lib_ImpersonatorFeatures_Registration_Client,
  guildIdentifier: Lib_ImpersonatorFeatures_Registration_GuildIdentifier,
) => void;

export type Lib_ImpersonatorFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_ImpersonatorFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_ImpersonatorFeatures_Prepared_Intents = GatewayIntentBits[];
export type Lib_ImpersonatorFeatures_Prepared_Register = Lib_ImpersonatorFeatures_Registration;
export type Lib_ImpersonatorFeatures_Prepared = {
  activeFeatureKeys: Lib_ImpersonatorFeatures_Prepared_ActiveFeatureKeys;
  configurationErrors: Lib_ImpersonatorFeatures_Prepared_ConfigurationErrors;
  intents: Lib_ImpersonatorFeatures_Prepared_Intents;
  register: Lib_ImpersonatorFeatures_Prepared_Register;
};

export type Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Configuration = unknown;
export type Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Content = string;
export type Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Parsed = Lib_ImpersonatorFeatures_Configuration;
export type Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_Returns = Lib_ImpersonatorFeatures_Runtime;
export type Lib_ImpersonatorFeatures_CompileImpersonatorAlerts_TrustedUserIdentifier = string | undefined;

export type Lib_ImpersonatorFeatures_CreateRegistration_Returns = Lib_ImpersonatorFeatures_Registration;
export type Lib_ImpersonatorFeatures_CreateRegistration_Runtime = Lib_ImpersonatorFeatures_Runtime;

export type Lib_ImpersonatorFeatures_FindIdentityMatch_Candidates = Array<{
  identity: string;
  rule: Lib_ImpersonatorFeatures_Rule | undefined;
}>;
export type Lib_ImpersonatorFeatures_FindIdentityMatch_Candidate = Lib_ImpersonatorFeatures_FindIdentityMatch_Candidates[number] | undefined;
export type Lib_ImpersonatorFeatures_FindIdentityMatch_Identities = string[];
export type Lib_ImpersonatorFeatures_FindIdentityMatch_Returns = Lib_ImpersonatorFeatures_IdentityMatch | undefined;
export type Lib_ImpersonatorFeatures_FindIdentityMatch_Rules = Lib_ImpersonatorFeatures_Rule[];
export type Lib_ImpersonatorFeatures_FindIdentityMatch_UserIdentifier = string;

export type Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Identity = string;
export type Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_NormalizedIdentity = string;
export type Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Returns = Lib_ImpersonatorFeatures_Rule | undefined;
export type Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_Rules = Lib_ImpersonatorFeatures_Rule[];
export type Lib_ImpersonatorFeatures_FindMatchingImpersonatorRule_UserIdentifier = string;

export type Lib_ImpersonatorFeatures_FormatConfigurationError_Error = unknown;
export type Lib_ImpersonatorFeatures_FormatConfigurationError_Messages = string[];
export type Lib_ImpersonatorFeatures_FormatConfigurationError_Returns = string;

export type Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Content = string;
export type Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Match = Lib_ImpersonatorFeatures_IdentityMatch;
export type Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Member = GuildMember;
export type Lib_ImpersonatorFeatures_FormatImpersonatorMessage_Returns = string;

export type Lib_ImpersonatorFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: unknown;
};
export type Lib_ImpersonatorFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_ImpersonatorFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_ImpersonatorFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_ImpersonatorFeatures_GetEnabledFeature_Returns = Lib_ImpersonatorFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_ImpersonatorFeatures_GetEnabledFeature_Settings = Shared_JsonObject;

export type Lib_ImpersonatorFeatures_HandleGuildMemberAdd_GuildIdentifier = string;
export type Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Identities = string[];
export type Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Member = GuildMember;
export type Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Returns = Promise<void>;
export type Lib_ImpersonatorFeatures_HandleGuildMemberAdd_Runtime = Lib_ImpersonatorFeatures_Runtime;

export type Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_GuildIdentifier = string;
export type Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_NewMember = GuildMember;
export type Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_OldMember = GuildMember | PartialGuildMember;
export type Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Returns = Promise<void>;
export type Lib_ImpersonatorFeatures_HandleGuildMemberUpdate_Runtime = Lib_ImpersonatorFeatures_Runtime;

export type Lib_ImpersonatorFeatures_HandleMemberIdentity_Identities = string[];
export type Lib_ImpersonatorFeatures_HandleMemberIdentity_Match = Lib_ImpersonatorFeatures_IdentityMatch | undefined;
export type Lib_ImpersonatorFeatures_HandleMemberIdentity_Member = GuildMember;
export type Lib_ImpersonatorFeatures_HandleMemberIdentity_Returns = Promise<void>;
export type Lib_ImpersonatorFeatures_HandleMemberIdentity_Runtime = Lib_ImpersonatorFeatures_Runtime;

export type Lib_ImpersonatorFeatures_HandleUserUpdate_Client = Client;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_GuildIdentifier = string;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_Member = GuildMember | undefined;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_NewUser = User;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_OldUser = User | PartialUser;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_Returns = Promise<void>;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_Runtime = Lib_ImpersonatorFeatures_Runtime;
export type Lib_ImpersonatorFeatures_HandleUserUpdate_TargetGuild = Guild | undefined;

export type Lib_ImpersonatorFeatures_ChangedUserIdentities_OldUser = {
  globalName: string | null;
  username: string | null;
};
export type Lib_ImpersonatorFeatures_ChangedUserIdentities_NewUser = {
  globalName: string | null;
  username: string;
};
export type Lib_ImpersonatorFeatures_ChangedUserIdentities_Returns = string[];

export type Lib_ImpersonatorFeatures_IsRecord_TypeGuard = Record<string, unknown>;
export type Lib_ImpersonatorFeatures_IsRecord_Value = unknown;

export type Lib_ImpersonatorFeatures_MatchesRegularExpression_Identity = string;
export type Lib_ImpersonatorFeatures_MatchesRegularExpression_RegularExpression = RegExp;
export type Lib_ImpersonatorFeatures_MatchesRegularExpression_Returns = boolean;

export type Lib_ImpersonatorFeatures_NormalizeIdentity_CombiningMarks = RegExp;
export type Lib_ImpersonatorFeatures_NormalizeIdentity_Identity = string;
export type Lib_ImpersonatorFeatures_NormalizeIdentity_Returns = string;

export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_ConfigurationErrors = string[];
export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Feature = Lib_ImpersonatorFeatures_GetEnabledFeature_Returns;
export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Intents = GatewayIntentBits[];
export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Returns = Lib_ImpersonatorFeatures_Prepared;
export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Runtime = Lib_ImpersonatorFeatures_Runtime | undefined;
export type Lib_ImpersonatorFeatures_PrepareImpersonatorFeatures_Settings = Shared_JsonObject;

export type Lib_ImpersonatorFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_ImpersonatorFeatures_RecordConfigurationError_Error = unknown;
export type Lib_ImpersonatorFeatures_RecordConfigurationError_FeatureKey = Shared_FeatureKey;
export type Lib_ImpersonatorFeatures_RecordConfigurationError_Message = string;
export type Lib_ImpersonatorFeatures_RecordConfigurationError_Returns = void;

export type Lib_ImpersonatorFeatures_SendImpersonatorAlert_Channel = GuildBasedChannel | null;
export type Lib_ImpersonatorFeatures_SendImpersonatorAlert_Match = Lib_ImpersonatorFeatures_IdentityMatch;
export type Lib_ImpersonatorFeatures_SendImpersonatorAlert_Member = GuildMember;
export type Lib_ImpersonatorFeatures_SendImpersonatorAlert_Returns = Promise<void>;
export type Lib_ImpersonatorFeatures_SendImpersonatorAlert_Runtime = Lib_ImpersonatorFeatures_Runtime;

export type Lib_ImpersonatorFeatures_Test_Rules = Lib_ImpersonatorFeatures_Rule[];
