import type {
  Client,
  GatewayIntentBits,
  GuildBasedChannel,
  GuildMember,
  PartialGuildMember,
  Role,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_AntiRaidFeatures_Configuration_AutoBan_Avatar_Avatar = string;
export type Lib_AntiRaidFeatures_Configuration_AutoBan_Avatar = {
  avatar: Lib_AntiRaidFeatures_Configuration_AutoBan_Avatar_Avatar;
};
export type Lib_AntiRaidFeatures_Configuration_AutoBan_Username_Username = string;
export type Lib_AntiRaidFeatures_Configuration_AutoBan_Username = {
  username: Lib_AntiRaidFeatures_Configuration_AutoBan_Username_Username;
};
export type Lib_AntiRaidFeatures_Configuration_AutoBan = {
  avatars?: Lib_AntiRaidFeatures_Configuration_AutoBan_Avatar[] | undefined;
  channel: {
    'channel-id': string;
  };
  usernames?: Lib_AntiRaidFeatures_Configuration_AutoBan_Username[] | undefined;
};
export type Lib_AntiRaidFeatures_Configuration_MembershipGate = {
  channel: {
    'channel-id': string;
  };
  payload?: {
    content?: string | undefined;
    footer?: {
      text: string;
    } | undefined;
  } | undefined;
  roles: Array<{
    'role-id': string;
  }>;
};
export type Lib_AntiRaidFeatures_Configuration = {
  'auto-ban'?: Lib_AntiRaidFeatures_Configuration_AutoBan | undefined;
  'membership-gate'?: Lib_AntiRaidFeatures_Configuration_MembershipGate | undefined;
};

export type Lib_AntiRaidFeatures_MembershipGate_ChannelIdentifier = string;
export type Lib_AntiRaidFeatures_MembershipGate_Content = string;
export type Lib_AntiRaidFeatures_MembershipGate_RoleIdentifiers = string[];
export type Lib_AntiRaidFeatures_MembershipGate = {
  channelIdentifier: Lib_AntiRaidFeatures_MembershipGate_ChannelIdentifier;
  content: Lib_AntiRaidFeatures_MembershipGate_Content;
  roleIdentifiers: Lib_AntiRaidFeatures_MembershipGate_RoleIdentifiers;
};
export type Lib_AntiRaidFeatures_Runtime_AlertChannelIdentifier = string | undefined;
export type Lib_AntiRaidFeatures_Runtime_AvatarHashes = Set<string>;
export type Lib_AntiRaidFeatures_Runtime_MembershipGate = Lib_AntiRaidFeatures_MembershipGate | undefined;
export type Lib_AntiRaidFeatures_Runtime_Usernames = Set<string>;
export type Lib_AntiRaidFeatures_Runtime = {
  alertChannelIdentifier: Lib_AntiRaidFeatures_Runtime_AlertChannelIdentifier;
  avatarHashes: Lib_AntiRaidFeatures_Runtime_AvatarHashes;
  membershipGate: Lib_AntiRaidFeatures_Runtime_MembershipGate;
  usernames: Lib_AntiRaidFeatures_Runtime_Usernames;
};

export type Lib_AntiRaidFeatures_Registration = (client: Client, guildIdentifier: string) => void;
export type Lib_AntiRaidFeatures_Prepared = {
  activeFeatureKeys: Shared_FeatureKey[];
  configurationErrors: string[];
  intents: GatewayIntentBits[];
  register: Lib_AntiRaidFeatures_Registration;
};

export type Lib_AntiRaidFeatures_CompileAntiRaid_Configuration = unknown;
export type Lib_AntiRaidFeatures_CompileAntiRaid_Returns = Lib_AntiRaidFeatures_Runtime;
export type Lib_AntiRaidFeatures_CompileAntiRaid_Parsed = Lib_AntiRaidFeatures_Configuration;
export type Lib_AntiRaidFeatures_CompileAntiRaid_AutoBan = Lib_AntiRaidFeatures_Configuration_AutoBan | undefined;
export type Lib_AntiRaidFeatures_CompileAntiRaid_AvatarHashes = Set<string>;
export type Lib_AntiRaidFeatures_CompileAntiRaid_Usernames = Set<string>;
export type Lib_AntiRaidFeatures_CompileAntiRaid_MembershipGate = Lib_AntiRaidFeatures_MembershipGate | undefined;
export type Lib_AntiRaidFeatures_CompileAntiRaid_MembershipGateConfiguration = Lib_AntiRaidFeatures_Configuration_MembershipGate | undefined;
export type Lib_AntiRaidFeatures_CompileAntiRaid_ContentParts = string[];
export type Lib_AntiRaidFeatures_CompileAntiRaid_Content = string;

export type Lib_AntiRaidFeatures_CreateRegistration_Runtime = Lib_AntiRaidFeatures_Runtime;
export type Lib_AntiRaidFeatures_CreateRegistration_Returns = Lib_AntiRaidFeatures_Registration;

export type Lib_AntiRaidFeatures_FindRaidSignals_AvatarHash = string | null;
export type Lib_AntiRaidFeatures_FindRaidSignals_Username = string;
export type Lib_AntiRaidFeatures_FindRaidSignals_DisplayName = string;
export type Lib_AntiRaidFeatures_FindRaidSignals_Runtime = Lib_AntiRaidFeatures_Runtime;
export type Lib_AntiRaidFeatures_FindRaidSignals_Returns = string[];
export type Lib_AntiRaidFeatures_FindRaidSignals_Signals = string[];
export type Lib_AntiRaidFeatures_FindRaidSignals_NormalizedNames = string[];

export type Lib_AntiRaidFeatures_FormatConfigurationError_Error = unknown;
export type Lib_AntiRaidFeatures_FormatConfigurationError_Returns = string;
export type Lib_AntiRaidFeatures_FormatConfigurationError_Messages = string[];

export type Lib_AntiRaidFeatures_FormatMembershipGateMessage_Member = GuildMember;
export type Lib_AntiRaidFeatures_FormatMembershipGateMessage_Content = string;
export type Lib_AntiRaidFeatures_FormatMembershipGateMessage_Returns = string;
export type Lib_AntiRaidFeatures_FormatMembershipGateMessage_CurrentYear = string;

export type Lib_AntiRaidFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_AntiRaidFeatures_GetEnabledFeature_Returns = Lib_AntiRaidFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_AntiRaidFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_AntiRaidFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_AntiRaidFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: unknown;
};

export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_Member = GuildMember;
export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_GuildIdentifier = string;
export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_Runtime = Lib_AntiRaidFeatures_Runtime;
export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_Returns = Promise<void>;
export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_Signals = string[];
export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_Channel = GuildBasedChannel | null;
export type Lib_AntiRaidFeatures_HandleGuildMemberAdd_BanError = string | undefined;

export type Lib_AntiRaidFeatures_HandleGuildMemberUpdate_OldMember = GuildMember | PartialGuildMember;
export type Lib_AntiRaidFeatures_HandleGuildMemberUpdate_NewMember = GuildMember;
export type Lib_AntiRaidFeatures_HandleGuildMemberUpdate_GuildIdentifier = string;
export type Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Runtime = Lib_AntiRaidFeatures_Runtime;
export type Lib_AntiRaidFeatures_HandleGuildMemberUpdate_Returns = Promise<void>;

export type Lib_AntiRaidFeatures_IsRecord_Value = unknown;
export type Lib_AntiRaidFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_AntiRaidFeatures_NormalizeIdentity_Value = string;
export type Lib_AntiRaidFeatures_NormalizeIdentity_Returns = string;

export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Settings = Shared_JsonObject;
export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Returns = Lib_AntiRaidFeatures_Prepared;
export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Runtime = Lib_AntiRaidFeatures_Runtime | undefined;
export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_ConfigurationErrors = string[];
export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Feature = Lib_AntiRaidFeatures_GetEnabledFeature_Returns;
export type Lib_AntiRaidFeatures_PrepareAntiRaidFeatures_Intents = GatewayIntentBits[];

export type Lib_AntiRaidFeatures_ReconcileMembershipGate_Member = GuildMember;
export type Lib_AntiRaidFeatures_ReconcileMembershipGate_MembershipGate = Lib_AntiRaidFeatures_MembershipGate;
export type Lib_AntiRaidFeatures_ReconcileMembershipGate_Returns = Promise<void>;
export type Lib_AntiRaidFeatures_ReconcileMembershipGate_BotMember = GuildMember | null;
export type Lib_AntiRaidFeatures_ReconcileMembershipGate_RolesToAdd = Role[];
export type Lib_AntiRaidFeatures_ReconcileMembershipGate_Role = Role | null;
export type Lib_AntiRaidFeatures_ReconcileMembershipGate_Channel = GuildBasedChannel | null;

export type Lib_AntiRaidFeatures_RecordConfigurationError_Error = unknown;
export type Lib_AntiRaidFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_AntiRaidFeatures_RecordConfigurationError_Returns = void;
export type Lib_AntiRaidFeatures_RecordConfigurationError_Message = string;

export type Lib_AntiRaidFeatures_Test_Client = Client;
