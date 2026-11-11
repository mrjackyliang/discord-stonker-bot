import type {
  AnyThreadChannel,
  Client,
  GatewayIntentBits,
  Guild,
  GuildBasedChannel,
  GuildMember,
  GuildScheduledEvent,
  PartialGuildMember,
  PartialGuildScheduledEvent,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_GatewayFeatures_LegacyEventEntityType = 'EXTERNAL' | 'STAGE_INSTANCE' | 'VOICE';
export type Lib_GatewayFeatures_LegacyEventStatus = 'ACTIVE' | 'CANCELED' | 'COMPLETED' | 'SCHEDULED' | 'UPDATED';
export type Lib_GatewayFeatures_RoleDirection = 'add' | 'remove';

export type Lib_GatewayFeatures_ChannelReference_ChannelIdentifier = string;
export type Lib_GatewayFeatures_ChannelReference = {
  'channel-id': Lib_GatewayFeatures_ChannelReference_ChannelIdentifier;
};

export type Lib_GatewayFeatures_UserReference_UserIdentifier = string;
export type Lib_GatewayFeatures_UserReference = {
  'user-id': Lib_GatewayFeatures_UserReference_UserIdentifier;
};

export type Lib_GatewayFeatures_RoleReference_RoleIdentifier = string;
export type Lib_GatewayFeatures_RoleReference = {
  'role-id': Lib_GatewayFeatures_RoleReference_RoleIdentifier;
};

export type Lib_GatewayFeatures_ThreadReference_ThreadIdentifier = string;
export type Lib_GatewayFeatures_ThreadReference = {
  'thread-id': Lib_GatewayFeatures_ThreadReference_ThreadIdentifier;
};

export type Lib_GatewayFeatures_BroadcastAlertConfiguration_Channel = Lib_GatewayFeatures_ChannelReference;
export type Lib_GatewayFeatures_BroadcastAlertConfiguration_Creator = Lib_GatewayFeatures_UserReference | undefined;
export type Lib_GatewayFeatures_BroadcastAlertConfiguration_EntityTypes = Lib_GatewayFeatures_LegacyEventEntityType[];
export type Lib_GatewayFeatures_BroadcastAlertConfiguration_Message = string;
export type Lib_GatewayFeatures_BroadcastAlertConfiguration_Name = string;
export type Lib_GatewayFeatures_BroadcastAlertConfiguration_Status = Lib_GatewayFeatures_LegacyEventStatus;
export type Lib_GatewayFeatures_BroadcastAlertConfiguration = {
  'channel': Lib_GatewayFeatures_BroadcastAlertConfiguration_Channel;
  'creator'?: Lib_GatewayFeatures_BroadcastAlertConfiguration_Creator;
  'entity-types': Lib_GatewayFeatures_BroadcastAlertConfiguration_EntityTypes;
  'message': Lib_GatewayFeatures_BroadcastAlertConfiguration_Message;
  'name': Lib_GatewayFeatures_BroadcastAlertConfiguration_Name;
  'status': Lib_GatewayFeatures_BroadcastAlertConfiguration_Status;
};

export type Lib_GatewayFeatures_BroadcastRule_ChannelIdentifier = string;
export type Lib_GatewayFeatures_BroadcastRule_CreatorIdentifier = string | undefined;
export type Lib_GatewayFeatures_BroadcastRule_EntityTypes = Lib_GatewayFeatures_LegacyEventEntityType[];
export type Lib_GatewayFeatures_BroadcastRule_Message = string;
export type Lib_GatewayFeatures_BroadcastRule_Name = string;
export type Lib_GatewayFeatures_BroadcastRule_Status = Lib_GatewayFeatures_LegacyEventStatus;
export type Lib_GatewayFeatures_BroadcastRule = {
  channelIdentifier: Lib_GatewayFeatures_BroadcastRule_ChannelIdentifier;
  creatorIdentifier: Lib_GatewayFeatures_BroadcastRule_CreatorIdentifier;
  entityTypes: Lib_GatewayFeatures_BroadcastRule_EntityTypes;
  message: Lib_GatewayFeatures_BroadcastRule_Message;
  name: Lib_GatewayFeatures_BroadcastRule_Name;
  status: Lib_GatewayFeatures_BroadcastRule_Status;
};

export type Lib_GatewayFeatures_BumpThreadConfiguration_Channel = Lib_GatewayFeatures_ChannelReference;
export type Lib_GatewayFeatures_BumpThreadConfiguration_Name = string;
export type Lib_GatewayFeatures_BumpThreadConfiguration_Thread = Lib_GatewayFeatures_ThreadReference;
export type Lib_GatewayFeatures_BumpThreadConfiguration = {
  channel: Lib_GatewayFeatures_BumpThreadConfiguration_Channel;
  name: Lib_GatewayFeatures_BumpThreadConfiguration_Name;
  thread: Lib_GatewayFeatures_BumpThreadConfiguration_Thread;
};

export type Lib_GatewayFeatures_ThreadRule_ChannelIdentifier = string;
export type Lib_GatewayFeatures_ThreadRule_Name = string;
export type Lib_GatewayFeatures_ThreadRule_ThreadIdentifier = string;
export type Lib_GatewayFeatures_ThreadRule = {
  channelIdentifier: Lib_GatewayFeatures_ThreadRule_ChannelIdentifier;
  name: Lib_GatewayFeatures_ThreadRule_Name;
  threadIdentifier: Lib_GatewayFeatures_ThreadRule_ThreadIdentifier;
};

export type Lib_GatewayFeatures_RoleMessageConfiguration_Channel = Lib_GatewayFeatures_ChannelReference;
export type Lib_GatewayFeatures_RoleMessageConfiguration_Direction = Lib_GatewayFeatures_RoleDirection;
export type Lib_GatewayFeatures_RoleMessageConfiguration_Name = string;
export type Lib_GatewayFeatures_RoleMessageConfiguration_Payload_Content = string | undefined;
export type Lib_GatewayFeatures_RoleMessageConfiguration_Payload_Footer_Text = string;
export type Lib_GatewayFeatures_RoleMessageConfiguration_Payload_Footer = {
  text: Lib_GatewayFeatures_RoleMessageConfiguration_Payload_Footer_Text;
} | undefined;
export type Lib_GatewayFeatures_RoleMessageConfiguration_Payload = {
  content?: Lib_GatewayFeatures_RoleMessageConfiguration_Payload_Content;
  footer?: Lib_GatewayFeatures_RoleMessageConfiguration_Payload_Footer;
};
export type Lib_GatewayFeatures_RoleMessageConfiguration_Role = Lib_GatewayFeatures_RoleReference;
export type Lib_GatewayFeatures_RoleMessageConfiguration = {
  channel: Lib_GatewayFeatures_RoleMessageConfiguration_Channel;
  direction: Lib_GatewayFeatures_RoleMessageConfiguration_Direction;
  name: Lib_GatewayFeatures_RoleMessageConfiguration_Name;
  payload: Lib_GatewayFeatures_RoleMessageConfiguration_Payload;
  role: Lib_GatewayFeatures_RoleMessageConfiguration_Role;
};

export type Lib_GatewayFeatures_RoleMessageRule_ChannelIdentifier = string;
export type Lib_GatewayFeatures_RoleMessageRule_Content = string | undefined;
export type Lib_GatewayFeatures_RoleMessageRule_Direction = Lib_GatewayFeatures_RoleDirection;
export type Lib_GatewayFeatures_RoleMessageRule_FooterText = string | undefined;
export type Lib_GatewayFeatures_RoleMessageRule_Name = string;
export type Lib_GatewayFeatures_RoleMessageRule_RoleIdentifier = string;
export type Lib_GatewayFeatures_RoleMessageRule = {
  channelIdentifier: Lib_GatewayFeatures_RoleMessageRule_ChannelIdentifier;
  content: Lib_GatewayFeatures_RoleMessageRule_Content;
  direction: Lib_GatewayFeatures_RoleMessageRule_Direction;
  footerText: Lib_GatewayFeatures_RoleMessageRule_FooterText;
  name: Lib_GatewayFeatures_RoleMessageRule_Name;
  roleIdentifier: Lib_GatewayFeatures_RoleMessageRule_RoleIdentifier;
};

export type Lib_GatewayFeatures_Runtime_BroadcastAlerts = Lib_GatewayFeatures_BroadcastRule[];
export type Lib_GatewayFeatures_Runtime_BumpThreads = Lib_GatewayFeatures_ThreadRule[];
export type Lib_GatewayFeatures_Runtime_RoleMessages = Lib_GatewayFeatures_RoleMessageRule[];
export type Lib_GatewayFeatures_Runtime = {
  broadcastAlerts: Lib_GatewayFeatures_Runtime_BroadcastAlerts;
  bumpThreads: Lib_GatewayFeatures_Runtime_BumpThreads;
  roleMessages: Lib_GatewayFeatures_Runtime_RoleMessages;
};

export type Lib_GatewayFeatures_Registration_Client = Client;
export type Lib_GatewayFeatures_Registration_GuildIdentifier = string;
export type Lib_GatewayFeatures_Registration = (
  client: Lib_GatewayFeatures_Registration_Client,
  guildIdentifier: Lib_GatewayFeatures_Registration_GuildIdentifier,
) => void;

export type Lib_GatewayFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_GatewayFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_GatewayFeatures_Prepared_Intents = GatewayIntentBits[];
export type Lib_GatewayFeatures_Prepared_Register = Lib_GatewayFeatures_Registration;
export type Lib_GatewayFeatures_Prepared = {
  activeFeatureKeys: Lib_GatewayFeatures_Prepared_ActiveFeatureKeys;
  configurationErrors: Lib_GatewayFeatures_Prepared_ConfigurationErrors;
  intents: Lib_GatewayFeatures_Prepared_Intents;
  register: Lib_GatewayFeatures_Prepared_Register;
};

export type Lib_GatewayFeatures_CompileBroadcastAlerts_Configuration = unknown;
export type Lib_GatewayFeatures_CompileBroadcastAlerts_Returns = Lib_GatewayFeatures_BroadcastRule[];
export type Lib_GatewayFeatures_CompileBroadcastAlerts_Parsed = Lib_GatewayFeatures_BroadcastAlertConfiguration[];

export type Lib_GatewayFeatures_CompileBumpThreads_Configuration = unknown;
export type Lib_GatewayFeatures_CompileBumpThreads_Returns = Lib_GatewayFeatures_ThreadRule[];
export type Lib_GatewayFeatures_CompileBumpThreads_Parsed = Lib_GatewayFeatures_BumpThreadConfiguration[];

export type Lib_GatewayFeatures_CompileRoleMessages_Configuration = unknown;
export type Lib_GatewayFeatures_CompileRoleMessages_Returns = Lib_GatewayFeatures_RoleMessageRule[];
export type Lib_GatewayFeatures_CompileRoleMessages_Parsed = Lib_GatewayFeatures_RoleMessageConfiguration[];

export type Lib_GatewayFeatures_CreateRegistration_Runtime = Lib_GatewayFeatures_Runtime;
export type Lib_GatewayFeatures_CreateRegistration_Returns = Lib_GatewayFeatures_Registration;

export type Lib_GatewayFeatures_DoesRoleMessageMatch_OldMember = GuildMember | PartialGuildMember;
export type Lib_GatewayFeatures_DoesRoleMessageMatch_NewMember = GuildMember;
export type Lib_GatewayFeatures_DoesRoleMessageMatch_Rule = Lib_GatewayFeatures_RoleMessageRule;
export type Lib_GatewayFeatures_DoesRoleMessageMatch_Returns = boolean;

export type Lib_GatewayFeatures_FormatConfigurationError_Error = unknown;
export type Lib_GatewayFeatures_FormatConfigurationError_Returns = string;
export type Lib_GatewayFeatures_FormatConfigurationError_Messages = string[];

export type Lib_GatewayFeatures_FormatRoleMessage_Member = GuildMember;
export type Lib_GatewayFeatures_FormatRoleMessage_Rule = Lib_GatewayFeatures_RoleMessageRule;
export type Lib_GatewayFeatures_FormatRoleMessage_Returns = string;
export type Lib_GatewayFeatures_FormatRoleMessage_CurrentYear = string;
export type Lib_GatewayFeatures_FormatRoleMessage_Parts = string[];

export type Lib_GatewayFeatures_FormatScheduledEventMessage_Event = GuildScheduledEvent | PartialGuildScheduledEvent;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_Rule = Lib_GatewayFeatures_BroadcastRule;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_Returns = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_ChannelTag = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_CreatorTag = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_Description = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_EventName = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_Location = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_ScheduledTime = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_UserCount = string;
export type Lib_GatewayFeatures_FormatScheduledEventMessage_Content = string;

export type Lib_GatewayFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_GatewayFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_GatewayFeatures_GetEnabledFeature_Returns = Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_GatewayFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_GatewayFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature_Configuration = unknown;
export type Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature_Configuration;
};

export type Lib_GatewayFeatures_GetEventEntityType_Event = GuildScheduledEvent | PartialGuildScheduledEvent;
export type Lib_GatewayFeatures_GetEventEntityType_Returns = Lib_GatewayFeatures_LegacyEventEntityType;

export type Lib_GatewayFeatures_GetEventStatus_Event = GuildScheduledEvent | PartialGuildScheduledEvent;
export type Lib_GatewayFeatures_GetEventStatus_Returns = Exclude<Lib_GatewayFeatures_LegacyEventStatus, 'UPDATED'>;

export type Lib_GatewayFeatures_HandleBroadcastEvent_Client = Client;
export type Lib_GatewayFeatures_HandleBroadcastEvent_Event = GuildScheduledEvent | PartialGuildScheduledEvent;
export type Lib_GatewayFeatures_HandleBroadcastEvent_GuildIdentifier = string;
export type Lib_GatewayFeatures_HandleBroadcastEvent_Rules = Lib_GatewayFeatures_BroadcastRule[];
export type Lib_GatewayFeatures_HandleBroadcastEvent_Status = Lib_GatewayFeatures_LegacyEventStatus;
export type Lib_GatewayFeatures_HandleBroadcastEvent_Returns = Promise<void>;
export type Lib_GatewayFeatures_HandleBroadcastEvent_EntityType = Lib_GatewayFeatures_LegacyEventEntityType;
export type Lib_GatewayFeatures_HandleBroadcastEvent_MatchingRules = Lib_GatewayFeatures_BroadcastRule[];
export type Lib_GatewayFeatures_HandleBroadcastEvent_Guild = Guild;
export type Lib_GatewayFeatures_HandleBroadcastEvent_Tasks = Promise<void>[];

export type Lib_GatewayFeatures_HandleRoleMessages_OldMember = GuildMember | PartialGuildMember;
export type Lib_GatewayFeatures_HandleRoleMessages_NewMember = GuildMember;
export type Lib_GatewayFeatures_HandleRoleMessages_GuildIdentifier = string;
export type Lib_GatewayFeatures_HandleRoleMessages_Rules = Lib_GatewayFeatures_RoleMessageRule[];
export type Lib_GatewayFeatures_HandleRoleMessages_Returns = Promise<void>;
export type Lib_GatewayFeatures_HandleRoleMessages_MatchingRules = Lib_GatewayFeatures_RoleMessageRule[];
export type Lib_GatewayFeatures_HandleRoleMessages_Tasks = Promise<void>[];

export type Lib_GatewayFeatures_HandleThreadUpdate_Thread = AnyThreadChannel;
export type Lib_GatewayFeatures_HandleThreadUpdate_GuildIdentifier = string;
export type Lib_GatewayFeatures_HandleThreadUpdate_Rules = Lib_GatewayFeatures_ThreadRule[];
export type Lib_GatewayFeatures_HandleThreadUpdate_Returns = Promise<void>;
export type Lib_GatewayFeatures_HandleThreadUpdate_Rule = Lib_GatewayFeatures_ThreadRule | undefined;

export type Lib_GatewayFeatures_IsRecord_Value = unknown;
export type Lib_GatewayFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_GatewayFeatures_PrepareGatewayFeatures_Settings = Shared_JsonObject;
export type Lib_GatewayFeatures_PrepareGatewayFeatures_Returns = Lib_GatewayFeatures_Prepared;
export type Lib_GatewayFeatures_PrepareGatewayFeatures_Runtime = Lib_GatewayFeatures_Runtime;
export type Lib_GatewayFeatures_PrepareGatewayFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_GatewayFeatures_PrepareGatewayFeatures_ConfigurationErrors = string[];
export type Lib_GatewayFeatures_PrepareGatewayFeatures_BroadcastFeature = Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_GatewayFeatures_PrepareGatewayFeatures_BumpThreadFeature = Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_GatewayFeatures_PrepareGatewayFeatures_RoleMessageFeature = Lib_GatewayFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_GatewayFeatures_PrepareGatewayFeatures_Intents = GatewayIntentBits[];

export type Lib_GatewayFeatures_ReconcileConfiguredThreads_Client = Client;
export type Lib_GatewayFeatures_ReconcileConfiguredThreads_GuildIdentifier = string;
export type Lib_GatewayFeatures_ReconcileConfiguredThreads_Rules = Lib_GatewayFeatures_ThreadRule[];
export type Lib_GatewayFeatures_ReconcileConfiguredThreads_Returns = Promise<void>;
export type Lib_GatewayFeatures_ReconcileConfiguredThreads_Guild = Guild;
export type Lib_GatewayFeatures_ReconcileConfiguredThreads_Tasks = Promise<void>[];

export type Lib_GatewayFeatures_ReconcileThread_Guild = Guild;
export type Lib_GatewayFeatures_ReconcileThread_Rule = Lib_GatewayFeatures_ThreadRule;
export type Lib_GatewayFeatures_ReconcileThread_Returns = Promise<void>;
export type Lib_GatewayFeatures_ReconcileThread_Channel = GuildBasedChannel | null;

export type Lib_GatewayFeatures_RecordConfigurationError_FeatureKey = Shared_FeatureKey;
export type Lib_GatewayFeatures_RecordConfigurationError_Error = unknown;
export type Lib_GatewayFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_GatewayFeatures_RecordConfigurationError_Returns = void;
export type Lib_GatewayFeatures_RecordConfigurationError_Message = string;

export type Lib_GatewayFeatures_SendGuildMessage_Guild = Guild;
export type Lib_GatewayFeatures_SendGuildMessage_ChannelIdentifier = string;
export type Lib_GatewayFeatures_SendGuildMessage_Content = string;
export type Lib_GatewayFeatures_SendGuildMessage_ContextName = string;
export type Lib_GatewayFeatures_SendGuildMessage_Returns = Promise<void>;
export type Lib_GatewayFeatures_SendGuildMessage_Channel = GuildBasedChannel | null;
