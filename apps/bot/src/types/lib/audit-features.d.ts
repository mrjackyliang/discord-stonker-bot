import type {
  Client,
  GatewayIntentBits,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Message,
  PartialGuildMember,
  PartialMessage,
  PartialUser,
  User,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_AuditFeatures_EventKey =
  | 'change-nickname'
  | 'change-username'
  | 'delete-message'
  | 'guild-join'
  | 'guild-leave'
  | 'includes-link'
  | 'role-change'
  | 'update-message'
  | 'upload-attachment';
export type Lib_AuditFeatures_ChannelConfiguration = {
  channel: {
    'channel-id': string;
  };
};
export type Lib_AuditFeatures_ExcludedLinkConfiguration = {
  name: string;
  regex: {
    flags?: string | undefined;
    pattern: string;
  };
};
export type Lib_AuditFeatures_IncludesLinkConfiguration = Lib_AuditFeatures_ChannelConfiguration & {
  'excluded-links'?: Lib_AuditFeatures_ExcludedLinkConfiguration[] | undefined;
};
export type Lib_AuditFeatures_Configuration = {
  'change-nickname'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'change-username'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'delete-message'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'guild-join'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'guild-leave'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'includes-link'?: Lib_AuditFeatures_IncludesLinkConfiguration | undefined;
  'role-change'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'update-message'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
  'upload-attachment'?: Lib_AuditFeatures_ChannelConfiguration | undefined;
};
export type Lib_AuditFeatures_Runtime_Channels = Partial<Record<Lib_AuditFeatures_EventKey, string>>;
export type Lib_AuditFeatures_Runtime_ExcludedLinkPatterns = RegExp[];
export type Lib_AuditFeatures_Runtime = {
  channels: Lib_AuditFeatures_Runtime_Channels;
  excludedLinkPatterns: Lib_AuditFeatures_Runtime_ExcludedLinkPatterns;
};
export type Lib_AuditFeatures_Registration = (client: Client, guildIdentifier: string) => void;
export type Lib_AuditFeatures_Prepared = {
  activeFeatureKeys: Shared_FeatureKey[];
  configurationErrors: string[];
  intents: GatewayIntentBits[];
  register: Lib_AuditFeatures_Registration;
};

export type Lib_AuditFeatures_CompileAuditFeatures_Configuration = unknown;
export type Lib_AuditFeatures_CompileAuditFeatures_Returns = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_CompileAuditFeatures_Parsed = Lib_AuditFeatures_Configuration;
export type Lib_AuditFeatures_CompileAuditFeatures_Channels = Lib_AuditFeatures_Runtime_Channels;
export type Lib_AuditFeatures_CompileAuditFeatures_EventKeys = Lib_AuditFeatures_EventKey[];
export type Lib_AuditFeatures_CompileAuditFeatures_EventConfiguration = Lib_AuditFeatures_ChannelConfiguration | undefined;
export type Lib_AuditFeatures_CompileAuditFeatures_ExcludedLinkPatterns = RegExp[];
export type Lib_AuditFeatures_CompileAuditFeatures_IncludesLink = Lib_AuditFeatures_IncludesLinkConfiguration | undefined;

export type Lib_AuditFeatures_CreateRegistration_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_CreateRegistration_Returns = Lib_AuditFeatures_Registration;

export type Lib_AuditFeatures_FindExternalLinkHosts_Content = string;
export type Lib_AuditFeatures_FindExternalLinkHosts_ExcludedLinkPatterns = RegExp[];
export type Lib_AuditFeatures_FindExternalLinkHosts_Returns = string[];
export type Lib_AuditFeatures_FindExternalLinkHosts_UrlPattern = RegExp;
export type Lib_AuditFeatures_FindExternalLinkHosts_Candidates = string[];
export type Lib_AuditFeatures_FindExternalLinkHosts_Hosts = Set<string>;
export type Lib_AuditFeatures_FindExternalLinkHosts_Excluded = boolean;
export type Lib_AuditFeatures_FindExternalLinkHosts_ParsedUrl = URL;

export type Lib_AuditFeatures_FormatConfigurationError_Error = unknown;
export type Lib_AuditFeatures_FormatConfigurationError_Returns = string;
export type Lib_AuditFeatures_FormatConfigurationError_Messages = string[];

export type Lib_AuditFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_AuditFeatures_GetEnabledFeature_Returns = Lib_AuditFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_AuditFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_AuditFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_AuditFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: unknown;
};

export type Lib_AuditFeatures_HandleGuildMemberAdd_Member = GuildMember;
export type Lib_AuditFeatures_HandleGuildMemberAdd_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleGuildMemberAdd_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleGuildMemberAdd_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleGuildMemberAdd_ChannelIdentifier = string | undefined;

export type Lib_AuditFeatures_HandleGuildMemberRemove_Member = GuildMember | PartialGuildMember;
export type Lib_AuditFeatures_HandleGuildMemberRemove_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleGuildMemberRemove_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleGuildMemberRemove_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleGuildMemberRemove_ChannelIdentifier = string | undefined;

export type Lib_AuditFeatures_HandleGuildMemberUpdate_OldMember = GuildMember | PartialGuildMember;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_NewMember = GuildMember;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_NicknameChannelIdentifier = string | undefined;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_RoleChannelIdentifier = string | undefined;
export type Lib_AuditFeatures_HandleGuildMemberUpdate_RoleChanges = Lib_AuditFeatures_SummarizeRoleChanges_Returns;

export type Lib_AuditFeatures_HandleMessageCreate_Message = Message;
export type Lib_AuditFeatures_HandleMessageCreate_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleMessageCreate_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleMessageCreate_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleMessageCreate_LinkChannelIdentifier = string | undefined;
export type Lib_AuditFeatures_HandleMessageCreate_Hosts = string[];
export type Lib_AuditFeatures_HandleMessageCreate_AttachmentChannelIdentifier = string | undefined;
export type Lib_AuditFeatures_HandleMessageCreate_AttachmentNames = string[];

export type Lib_AuditFeatures_HandleMessageDelete_Message = Message | PartialMessage;
export type Lib_AuditFeatures_HandleMessageDelete_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleMessageDelete_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleMessageDelete_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleMessageDelete_ChannelIdentifier = string | undefined;
export type Lib_AuditFeatures_HandleMessageDelete_AuthorIdentifier = string;

export type Lib_AuditFeatures_HandleMessageUpdate_OldMessage = Message | PartialMessage;
export type Lib_AuditFeatures_HandleMessageUpdate_NewMessage = Message;
export type Lib_AuditFeatures_HandleMessageUpdate_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleMessageUpdate_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleMessageUpdate_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleMessageUpdate_ChannelIdentifier = string | undefined;

export type Lib_AuditFeatures_HandleUserUpdate_Client = Client;
export type Lib_AuditFeatures_HandleUserUpdate_OldUser = User | PartialUser;
export type Lib_AuditFeatures_HandleUserUpdate_NewUser = User;
export type Lib_AuditFeatures_HandleUserUpdate_GuildIdentifier = string;
export type Lib_AuditFeatures_HandleUserUpdate_Runtime = Lib_AuditFeatures_Runtime;
export type Lib_AuditFeatures_HandleUserUpdate_Returns = Promise<void>;
export type Lib_AuditFeatures_HandleUserUpdate_ChannelIdentifier = string | undefined;
export type Lib_AuditFeatures_HandleUserUpdate_Guild = Guild | undefined;
export type Lib_AuditFeatures_HandleUserUpdate_Member = GuildMember | undefined;

export type Lib_AuditFeatures_IsRecord_Value = unknown;
export type Lib_AuditFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_AuditFeatures_PrepareAuditFeatures_Settings = Shared_JsonObject;
export type Lib_AuditFeatures_PrepareAuditFeatures_Returns = Lib_AuditFeatures_Prepared;
export type Lib_AuditFeatures_PrepareAuditFeatures_Runtime = Lib_AuditFeatures_Runtime | undefined;
export type Lib_AuditFeatures_PrepareAuditFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_AuditFeatures_PrepareAuditFeatures_ConfigurationErrors = string[];
export type Lib_AuditFeatures_PrepareAuditFeatures_Feature = Lib_AuditFeatures_GetEnabledFeature_Returns;
export type Lib_AuditFeatures_PrepareAuditFeatures_Intents = GatewayIntentBits[];
export type Lib_AuditFeatures_PrepareAuditFeatures_MemberEventsEnabled = boolean;
export type Lib_AuditFeatures_PrepareAuditFeatures_MessageEventsEnabled = boolean;
export type Lib_AuditFeatures_PrepareAuditFeatures_MessageContentEnabled = boolean;

export type Lib_AuditFeatures_RecordConfigurationError_Error = unknown;
export type Lib_AuditFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_AuditFeatures_RecordConfigurationError_Returns = void;
export type Lib_AuditFeatures_RecordConfigurationError_Message = string;

export type Lib_AuditFeatures_SendAudit_Guild = Guild;
export type Lib_AuditFeatures_SendAudit_ChannelIdentifier = string;
export type Lib_AuditFeatures_SendAudit_Lines = string[];
export type Lib_AuditFeatures_SendAudit_Returns = Promise<void>;
export type Lib_AuditFeatures_SendAudit_Channel = GuildBasedChannel | null;

export type Lib_AuditFeatures_SummarizeRoleChanges_OldRoleIdentifiers = Iterable<string>;
export type Lib_AuditFeatures_SummarizeRoleChanges_NewRoleIdentifiers = Iterable<string>;
export type Lib_AuditFeatures_SummarizeRoleChanges_Returns = Lib_AuditFeatures_SummarizeRoleChanges_Changes;
export type Lib_AuditFeatures_SummarizeRoleChanges_OldRoles = Set<string>;
export type Lib_AuditFeatures_SummarizeRoleChanges_NewRoles = Set<string>;
export type Lib_AuditFeatures_SummarizeRoleChanges_Changes = {
  added: string[];
  removed: string[];
};
