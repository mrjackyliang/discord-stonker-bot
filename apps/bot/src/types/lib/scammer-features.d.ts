import type {
  Client,
  GatewayIntentBits,
  GuildBasedChannel,
  Message,
  PartialMessage,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_ScammerFeatures_ChannelReference_ChannelIdentifier = string;
export type Lib_ScammerFeatures_ChannelReference = {
  'channel-id': Lib_ScammerFeatures_ChannelReference_ChannelIdentifier;
};

export type Lib_ScammerFeatures_RegularExpressionConfiguration_Flags = string | undefined;
export type Lib_ScammerFeatures_RegularExpressionConfiguration_Pattern = string;
export type Lib_ScammerFeatures_RegularExpressionConfiguration = {
  flags?: Lib_ScammerFeatures_RegularExpressionConfiguration_Flags;
  pattern: Lib_ScammerFeatures_RegularExpressionConfiguration_Pattern;
};

export type Lib_ScammerFeatures_PayloadConfiguration_Content = string;
export type Lib_ScammerFeatures_PayloadConfiguration = {
  content: Lib_ScammerFeatures_PayloadConfiguration_Content;
};

export type Lib_ScammerFeatures_EntityConfiguration_Name = string;
export type Lib_ScammerFeatures_EntityConfiguration_Payload = Lib_ScammerFeatures_PayloadConfiguration | undefined;
export type Lib_ScammerFeatures_EntityConfiguration_Regex = Lib_ScammerFeatures_RegularExpressionConfiguration;
export type Lib_ScammerFeatures_EntityConfiguration = {
  name: Lib_ScammerFeatures_EntityConfiguration_Name;
  payload?: Lib_ScammerFeatures_EntityConfiguration_Payload;
  regex: Lib_ScammerFeatures_EntityConfiguration_Regex;
};

export type Lib_ScammerFeatures_Configuration_Channel = Lib_ScammerFeatures_ChannelReference;
export type Lib_ScammerFeatures_Configuration_Entities = Lib_ScammerFeatures_EntityConfiguration[];
export type Lib_ScammerFeatures_Configuration = {
  channel: Lib_ScammerFeatures_Configuration_Channel;
  entities: Lib_ScammerFeatures_Configuration_Entities;
};

export type Lib_ScammerFeatures_Rule_Content = string;
export type Lib_ScammerFeatures_Rule_Name = string;
export type Lib_ScammerFeatures_Rule_RegularExpression = RegExp;
export type Lib_ScammerFeatures_Rule = {
  content: Lib_ScammerFeatures_Rule_Content;
  name: Lib_ScammerFeatures_Rule_Name;
  regularExpression: Lib_ScammerFeatures_Rule_RegularExpression;
};

export type Lib_ScammerFeatures_Runtime_ChannelIdentifier = string;
export type Lib_ScammerFeatures_Runtime_Rules = Lib_ScammerFeatures_Rule[];
export type Lib_ScammerFeatures_Runtime = {
  channelIdentifier: Lib_ScammerFeatures_Runtime_ChannelIdentifier;
  rules: Lib_ScammerFeatures_Runtime_Rules;
};

export type Lib_ScammerFeatures_Registration_Client = Client;
export type Lib_ScammerFeatures_Registration_GuildIdentifier = string;
export type Lib_ScammerFeatures_Registration = (
  client: Lib_ScammerFeatures_Registration_Client,
  guildIdentifier: Lib_ScammerFeatures_Registration_GuildIdentifier,
) => void;

export type Lib_ScammerFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_ScammerFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_ScammerFeatures_Prepared_Intents = GatewayIntentBits[];
export type Lib_ScammerFeatures_Prepared_Register = Lib_ScammerFeatures_Registration;
export type Lib_ScammerFeatures_Prepared = {
  activeFeatureKeys: Lib_ScammerFeatures_Prepared_ActiveFeatureKeys;
  configurationErrors: Lib_ScammerFeatures_Prepared_ConfigurationErrors;
  intents: Lib_ScammerFeatures_Prepared_Intents;
  register: Lib_ScammerFeatures_Prepared_Register;
};

export type Lib_ScammerFeatures_CompileScammerAlerts_Configuration = unknown;
export type Lib_ScammerFeatures_CompileScammerAlerts_Returns = Lib_ScammerFeatures_Runtime;
export type Lib_ScammerFeatures_CompileScammerAlerts_Parsed = Lib_ScammerFeatures_Configuration;
export type Lib_ScammerFeatures_CompileScammerAlerts_Content = string;

export type Lib_ScammerFeatures_CreateRegistration_Runtime = Lib_ScammerFeatures_Runtime;
export type Lib_ScammerFeatures_CreateRegistration_Returns = Lib_ScammerFeatures_Registration;

export type Lib_ScammerFeatures_FindMatchingScammerRule_Rules = Lib_ScammerFeatures_Rule[];
export type Lib_ScammerFeatures_FindMatchingScammerRule_Content = string;
export type Lib_ScammerFeatures_FindMatchingScammerRule_Returns = Lib_ScammerFeatures_Rule | undefined;

export type Lib_ScammerFeatures_FormatConfigurationError_Error = unknown;
export type Lib_ScammerFeatures_FormatConfigurationError_Returns = string;
export type Lib_ScammerFeatures_FormatConfigurationError_Messages = string[];

export type Lib_ScammerFeatures_FormatScammerMessage_Message = Message<true>;
export type Lib_ScammerFeatures_FormatScammerMessage_Rule = Lib_ScammerFeatures_Rule;
export type Lib_ScammerFeatures_FormatScammerMessage_Returns = string;
export type Lib_ScammerFeatures_FormatScammerMessage_Content = string;

export type Lib_ScammerFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_ScammerFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_ScammerFeatures_GetEnabledFeature_Returns = Lib_ScammerFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_ScammerFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_ScammerFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_ScammerFeatures_GetEnabledFeature_EnabledFeature_Configuration = unknown;
export type Lib_ScammerFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: Lib_ScammerFeatures_GetEnabledFeature_EnabledFeature_Configuration;
};

export type Lib_ScammerFeatures_HandleMessage_Message = Message;
export type Lib_ScammerFeatures_HandleMessage_GuildIdentifier = string;
export type Lib_ScammerFeatures_HandleMessage_Runtime = Lib_ScammerFeatures_Runtime;
export type Lib_ScammerFeatures_HandleMessage_Returns = Promise<void>;
export type Lib_ScammerFeatures_HandleMessage_Rule = Lib_ScammerFeatures_Rule | undefined;

export type Lib_ScammerFeatures_HandleMessageUpdate_OldMessage = Message | PartialMessage;
export type Lib_ScammerFeatures_HandleMessageUpdate_NewMessage = Message;
export type Lib_ScammerFeatures_HandleMessageUpdate_GuildIdentifier = string;
export type Lib_ScammerFeatures_HandleMessageUpdate_Runtime = Lib_ScammerFeatures_Runtime;
export type Lib_ScammerFeatures_HandleMessageUpdate_Returns = Promise<void>;

export type Lib_ScammerFeatures_IsRecord_Value = unknown;
export type Lib_ScammerFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_ScammerFeatures_MatchesRegularExpression_RegularExpression = RegExp;
export type Lib_ScammerFeatures_MatchesRegularExpression_Content = string;
export type Lib_ScammerFeatures_MatchesRegularExpression_Returns = boolean;

export type Lib_ScammerFeatures_PrepareScammerFeatures_Settings = Shared_JsonObject;
export type Lib_ScammerFeatures_PrepareScammerFeatures_Returns = Lib_ScammerFeatures_Prepared;
export type Lib_ScammerFeatures_PrepareScammerFeatures_Runtime = Lib_ScammerFeatures_Runtime | undefined;
export type Lib_ScammerFeatures_PrepareScammerFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_ScammerFeatures_PrepareScammerFeatures_ConfigurationErrors = string[];
export type Lib_ScammerFeatures_PrepareScammerFeatures_Feature = Lib_ScammerFeatures_GetEnabledFeature_Returns;
export type Lib_ScammerFeatures_PrepareScammerFeatures_Intents = GatewayIntentBits[];

export type Lib_ScammerFeatures_RecordConfigurationError_FeatureKey = Shared_FeatureKey;
export type Lib_ScammerFeatures_RecordConfigurationError_Error = unknown;
export type Lib_ScammerFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_ScammerFeatures_RecordConfigurationError_Returns = void;
export type Lib_ScammerFeatures_RecordConfigurationError_Message = string;

export type Lib_ScammerFeatures_SendScammerAlert_Message = Message<true>;
export type Lib_ScammerFeatures_SendScammerAlert_Runtime = Lib_ScammerFeatures_Runtime;
export type Lib_ScammerFeatures_SendScammerAlert_Rule = Lib_ScammerFeatures_Rule;
export type Lib_ScammerFeatures_SendScammerAlert_Returns = Promise<void>;
export type Lib_ScammerFeatures_SendScammerAlert_Channel = GuildBasedChannel | null;

export type Lib_ScammerFeatures_Test_Rules = Lib_ScammerFeatures_Rule[];
