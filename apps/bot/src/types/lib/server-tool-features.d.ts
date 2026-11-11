import type {
  ApplicationCommandDataResolvable,
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Role,
  User,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_ServerToolFeatures_ToolKey =
  | 'bulk-ban'
  | 'fetch-duplicates'
  | 'fetch-emojis'
  | 'fetch-members'
  | 'role-manager'
  | 'voice-tools';
export type Lib_ServerToolFeatures_ToolConfiguration = {
  'allowed-roles': Array<{
    'role-id': string;
  }>;
  'base-commands'?: string[] | undefined;
  'delete-message'?: boolean | undefined;
};
export type Lib_ServerToolFeatures_Configuration = {
  'bulk-ban'?: Lib_ServerToolFeatures_ToolConfiguration | undefined;
  'fetch-duplicates'?: Lib_ServerToolFeatures_ToolConfiguration | undefined;
  'fetch-emojis'?: Lib_ServerToolFeatures_ToolConfiguration | undefined;
  'fetch-members'?: Lib_ServerToolFeatures_ToolConfiguration | undefined;
  'role-manager'?: Lib_ServerToolFeatures_ToolConfiguration | undefined;
  'voice-tools'?: Lib_ServerToolFeatures_ToolConfiguration | undefined;
};
export type Lib_ServerToolFeatures_Runtime_Tools = Partial<Record<Lib_ServerToolFeatures_ToolKey, Set<string>>>;
export type Lib_ServerToolFeatures_Runtime = {
  tools: Lib_ServerToolFeatures_Runtime_Tools;
};
export type Lib_ServerToolFeatures_Registration = (client: Client, guildIdentifier: string) => void;
export type Lib_ServerToolFeatures_Prepared = {
  activeFeatureKeys: Shared_FeatureKey[];
  configurationErrors: string[];
  intents: GatewayIntentBits[];
  register: Lib_ServerToolFeatures_Registration;
};
export type Lib_ServerToolFeatures_DuplicateEntry = {
  displayName: string;
  identifier: string;
};
export type Lib_ServerToolFeatures_DuplicateGroup = {
  displayName: string;
  identifiers: string[];
};

export type Lib_ServerToolFeatures_CompileServerTools_Configuration = unknown;
export type Lib_ServerToolFeatures_CompileServerTools_Returns = Lib_ServerToolFeatures_Runtime;
export type Lib_ServerToolFeatures_CompileServerTools_Parsed = Lib_ServerToolFeatures_Configuration;
export type Lib_ServerToolFeatures_CompileServerTools_Tools = Lib_ServerToolFeatures_Runtime_Tools;
export type Lib_ServerToolFeatures_CompileServerTools_ToolKeys = Lib_ServerToolFeatures_ToolKey[];
export type Lib_ServerToolFeatures_CompileServerTools_ToolConfiguration = Lib_ServerToolFeatures_ToolConfiguration | undefined;

export type Lib_ServerToolFeatures_CreateCommandData_Runtime = Lib_ServerToolFeatures_Runtime;
export type Lib_ServerToolFeatures_CreateCommandData_Returns = ApplicationCommandDataResolvable[];
export type Lib_ServerToolFeatures_CreateCommandData_Commands = ApplicationCommandDataResolvable[];

export type Lib_ServerToolFeatures_CreateRegistration_Runtime = Lib_ServerToolFeatures_Runtime;
export type Lib_ServerToolFeatures_CreateRegistration_Returns = Lib_ServerToolFeatures_Registration;

export type Lib_ServerToolFeatures_FindDuplicateMemberNames_Entries = Lib_ServerToolFeatures_DuplicateEntry[];
export type Lib_ServerToolFeatures_FindDuplicateMemberNames_Returns = Lib_ServerToolFeatures_DuplicateGroup[];
export type Lib_ServerToolFeatures_FindDuplicateMemberNames_Groups = Map<string, Lib_ServerToolFeatures_DuplicateGroup>;
export type Lib_ServerToolFeatures_FindDuplicateMemberNames_NormalizedName = string;
export type Lib_ServerToolFeatures_FindDuplicateMemberNames_Group = Lib_ServerToolFeatures_DuplicateGroup | undefined;

export type Lib_ServerToolFeatures_FormatConfigurationError_Error = unknown;
export type Lib_ServerToolFeatures_FormatConfigurationError_Returns = string;
export type Lib_ServerToolFeatures_FormatConfigurationError_Messages = string[];

export type Lib_ServerToolFeatures_GetCommandToolKey_CommandName = string;
export type Lib_ServerToolFeatures_GetCommandToolKey_Returns = Lib_ServerToolFeatures_ToolKey | undefined;

export type Lib_ServerToolFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_ServerToolFeatures_GetEnabledFeature_Returns = Lib_ServerToolFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_ServerToolFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_ServerToolFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_ServerToolFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: unknown;
};

export type Lib_ServerToolFeatures_HandleBulkBan_Interaction = ChatInputCommandInteraction<'cached'>;
export type Lib_ServerToolFeatures_HandleBulkBan_Invoker = GuildMember;
export type Lib_ServerToolFeatures_HandleBulkBan_Returns = Promise<string>;
export type Lib_ServerToolFeatures_HandleBulkBan_Confirmed = boolean;
export type Lib_ServerToolFeatures_HandleBulkBan_RawIdentifiers = string;
export type Lib_ServerToolFeatures_HandleBulkBan_Separator = RegExp;
export type Lib_ServerToolFeatures_HandleBulkBan_Identifiers = string[];
export type Lib_ServerToolFeatures_HandleBulkBan_DeleteMessageSeconds = number;
export type Lib_ServerToolFeatures_HandleBulkBan_BotMember = GuildMember | null;
export type Lib_ServerToolFeatures_HandleBulkBan_TargetMembers = GuildMember[];
export type Lib_ServerToolFeatures_HandleBulkBan_TargetMember = GuildMember | undefined;
export type Lib_ServerToolFeatures_HandleBulkBan_Tasks = Array<Promise<GuildMember | User | string>>;
export type Lib_ServerToolFeatures_HandleBulkBan_Results = Array<PromiseSettledResult<GuildMember | User | string>>;
export type Lib_ServerToolFeatures_HandleBulkBan_SucceededCount = number;

export type Lib_ServerToolFeatures_HandleCommand_Interaction = ChatInputCommandInteraction<'cached'>;
export type Lib_ServerToolFeatures_HandleCommand_GuildIdentifier = string;
export type Lib_ServerToolFeatures_HandleCommand_Runtime = Lib_ServerToolFeatures_Runtime;
export type Lib_ServerToolFeatures_HandleCommand_Returns = Promise<void>;
export type Lib_ServerToolFeatures_HandleCommand_ToolKey = Lib_ServerToolFeatures_ToolKey | undefined;
export type Lib_ServerToolFeatures_HandleCommand_Invoker = GuildMember;
export type Lib_ServerToolFeatures_HandleCommand_Response = string;

export type Lib_ServerToolFeatures_HandleDuplicates_Guild = Guild;
export type Lib_ServerToolFeatures_HandleDuplicates_Returns = string;
export type Lib_ServerToolFeatures_HandleDuplicates_Entries = Lib_ServerToolFeatures_DuplicateEntry[];
export type Lib_ServerToolFeatures_HandleDuplicates_Groups = Lib_ServerToolFeatures_DuplicateGroup[];
export type Lib_ServerToolFeatures_HandleDuplicates_Lines = string[];

export type Lib_ServerToolFeatures_HandleEmojis_Guild = Guild;
export type Lib_ServerToolFeatures_HandleEmojis_Returns = Promise<string>;
export type Lib_ServerToolFeatures_HandleEmojis_Names = string[];

export type Lib_ServerToolFeatures_HandleMembers_Guild = Guild;
export type Lib_ServerToolFeatures_HandleMembers_Returns = string;

export type Lib_ServerToolFeatures_HandleRole_Interaction = ChatInputCommandInteraction<'cached'>;
export type Lib_ServerToolFeatures_HandleRole_Invoker = GuildMember;
export type Lib_ServerToolFeatures_HandleRole_Returns = Promise<string>;
export type Lib_ServerToolFeatures_HandleRole_Confirmed = boolean;
export type Lib_ServerToolFeatures_HandleRole_TargetUser = User;
export type Lib_ServerToolFeatures_HandleRole_TargetMember = GuildMember;
export type Lib_ServerToolFeatures_HandleRole_Role = Role;
export type Lib_ServerToolFeatures_HandleRole_Action = string;
export type Lib_ServerToolFeatures_HandleRole_BotMember = GuildMember | null;

export type Lib_ServerToolFeatures_HandleVoice_Interaction = ChatInputCommandInteraction<'cached'>;
export type Lib_ServerToolFeatures_HandleVoice_Returns = Promise<string>;
export type Lib_ServerToolFeatures_HandleVoice_Confirmed = boolean;
export type Lib_ServerToolFeatures_HandleVoice_TargetUser = User;
export type Lib_ServerToolFeatures_HandleVoice_TargetMember = GuildMember;
export type Lib_ServerToolFeatures_HandleVoice_Action = string;
export type Lib_ServerToolFeatures_HandleVoice_ChannelOption = GuildBasedChannel | null;
export type Lib_ServerToolFeatures_HandleVoice_TargetChannel = GuildBasedChannel | null;

export type Lib_ServerToolFeatures_HasConfiguredRole_Invoker = GuildMember;
export type Lib_ServerToolFeatures_HasConfiguredRole_AllowedRoleIdentifiers = Set<string>;
export type Lib_ServerToolFeatures_HasConfiguredRole_Returns = boolean;

export type Lib_ServerToolFeatures_HasRequiredDiscordPermission_Invoker = GuildMember;
export type Lib_ServerToolFeatures_HasRequiredDiscordPermission_ToolKey = Lib_ServerToolFeatures_ToolKey;
export type Lib_ServerToolFeatures_HasRequiredDiscordPermission_Returns = boolean;

export type Lib_ServerToolFeatures_IsRecord_Value = unknown;
export type Lib_ServerToolFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_ServerToolFeatures_PrepareServerToolFeatures_Settings = Shared_JsonObject;
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_Returns = Lib_ServerToolFeatures_Prepared;
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_Runtime = Lib_ServerToolFeatures_Runtime | undefined;
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_ConfigurationErrors = string[];
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_Feature = Lib_ServerToolFeatures_GetEnabledFeature_Returns;
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_Intents = GatewayIntentBits[];
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_MemberIntentRequired = boolean;
export type Lib_ServerToolFeatures_PrepareServerToolFeatures_VoiceIntentRequired = boolean;

export type Lib_ServerToolFeatures_RecordConfigurationError_Error = unknown;
export type Lib_ServerToolFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_ServerToolFeatures_RecordConfigurationError_Returns = void;
export type Lib_ServerToolFeatures_RecordConfigurationError_Message = string;

export type Lib_ServerToolFeatures_RegisterCommands_Client = Client<true>;
export type Lib_ServerToolFeatures_RegisterCommands_GuildIdentifier = string;
export type Lib_ServerToolFeatures_RegisterCommands_Runtime = Lib_ServerToolFeatures_Runtime;
export type Lib_ServerToolFeatures_RegisterCommands_Returns = Promise<void>;
export type Lib_ServerToolFeatures_RegisterCommands_Guild = Guild;
export type Lib_ServerToolFeatures_RegisterCommands_Commands = ApplicationCommandDataResolvable[];
