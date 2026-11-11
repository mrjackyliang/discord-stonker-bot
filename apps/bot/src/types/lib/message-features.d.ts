import type {
  Client,
  GatewayIntentBits,
  GuildBasedChannel,
  GuildMember,
  Message,
  MessageReplyOptions,
  PartialMessage,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_MessageFeatures_ChannelReference_ChannelIdentifier = string;
export type Lib_MessageFeatures_ChannelReference = {
  'channel-id': Lib_MessageFeatures_ChannelReference_ChannelIdentifier;
};

export type Lib_MessageFeatures_RoleReference_RoleIdentifier = string;
export type Lib_MessageFeatures_RoleReference = {
  'role-id': Lib_MessageFeatures_RoleReference_RoleIdentifier;
};

export type Lib_MessageFeatures_SafeMessagePayload_Content = string;
export type Lib_MessageFeatures_SafeMessagePayload = {
  content: Lib_MessageFeatures_SafeMessagePayload_Content;
};

export type Lib_MessageFeatures_RegularExpressionConfiguration_Flags = string | undefined;
export type Lib_MessageFeatures_RegularExpressionConfiguration_Pattern = string;
export type Lib_MessageFeatures_RegularExpressionConfiguration = {
  flags?: Lib_MessageFeatures_RegularExpressionConfiguration_Flags;
  pattern: Lib_MessageFeatures_RegularExpressionConfiguration_Pattern;
};

export type Lib_MessageFeatures_AffiliatePlatform_Platform = string;
export type Lib_MessageFeatures_AffiliatePlatform_RegularExpression = RegExp;
export type Lib_MessageFeatures_AffiliatePlatform = {
  platform: Lib_MessageFeatures_AffiliatePlatform_Platform;
  regularExpression: Lib_MessageFeatures_AffiliatePlatform_RegularExpression;
};

export type Lib_MessageFeatures_AffiliateCleanup_ChannelIdentifier = string | undefined;
export type Lib_MessageFeatures_AffiliateCleanup_DirectMessagePayload = Lib_MessageFeatures_SafeMessagePayload | undefined;
export type Lib_MessageFeatures_AffiliateCleanup_ExcludedRoleIdentifiers = string[];
export type Lib_MessageFeatures_AffiliateCleanup_Platforms = Lib_MessageFeatures_AffiliatePlatform[];
export type Lib_MessageFeatures_AffiliateCleanup = {
  channelIdentifier: Lib_MessageFeatures_AffiliateCleanup_ChannelIdentifier;
  directMessagePayload: Lib_MessageFeatures_AffiliateCleanup_DirectMessagePayload;
  excludedRoleIdentifiers: Lib_MessageFeatures_AffiliateCleanup_ExcludedRoleIdentifiers;
  platforms: Lib_MessageFeatures_AffiliateCleanup_Platforms;
};

export type Lib_MessageFeatures_AffiliateCleanupConfiguration_Channel = Lib_MessageFeatures_ChannelReference | undefined;
export type Lib_MessageFeatures_AffiliateCleanupConfiguration_DirectMessagePayload = Lib_MessageFeatures_SafeMessagePayload | undefined;
export type Lib_MessageFeatures_AffiliateCleanupConfiguration_ExcludedRoles = Lib_MessageFeatures_RoleReference[] | undefined;
export type Lib_MessageFeatures_AffiliateCleanupConfiguration_Platforms = Lib_MessageFeatures_AffiliatePlatformConfiguration[];
export type Lib_MessageFeatures_AffiliateCleanupConfiguration = {
  'channel'?: Lib_MessageFeatures_AffiliateCleanupConfiguration_Channel;
  'direct-message-payload'?: Lib_MessageFeatures_AffiliateCleanupConfiguration_DirectMessagePayload;
  'excluded-roles'?: Lib_MessageFeatures_AffiliateCleanupConfiguration_ExcludedRoles;
  'platforms': Lib_MessageFeatures_AffiliateCleanupConfiguration_Platforms;
};

export type Lib_MessageFeatures_AffiliatePlatformConfiguration_Platform = string;
export type Lib_MessageFeatures_AffiliatePlatformConfiguration_Regex = Lib_MessageFeatures_RegularExpressionConfiguration;
export type Lib_MessageFeatures_AffiliatePlatformConfiguration = {
  platform: Lib_MessageFeatures_AffiliatePlatformConfiguration_Platform;
  regex: Lib_MessageFeatures_AffiliatePlatformConfiguration_Regex;
};

export type Lib_MessageFeatures_AutoReplyRule_ChannelIdentifiers = string[];
export type Lib_MessageFeatures_AutoReplyRule_Name = string;
export type Lib_MessageFeatures_AutoReplyRule_Payloads = Lib_MessageFeatures_SafeMessagePayload[];
export type Lib_MessageFeatures_AutoReplyRule_RegularExpression = RegExp;
export type Lib_MessageFeatures_AutoReplyRule_Reply = boolean;
export type Lib_MessageFeatures_AutoReplyRule = {
  channelIdentifiers: Lib_MessageFeatures_AutoReplyRule_ChannelIdentifiers;
  name: Lib_MessageFeatures_AutoReplyRule_Name;
  payloads: Lib_MessageFeatures_AutoReplyRule_Payloads;
  regularExpression: Lib_MessageFeatures_AutoReplyRule_RegularExpression;
  reply: Lib_MessageFeatures_AutoReplyRule_Reply;
};

export type Lib_MessageFeatures_AutoReplyConfiguration_Channels = Lib_MessageFeatures_ChannelReference[] | undefined;
export type Lib_MessageFeatures_AutoReplyConfiguration_Name = string;
export type Lib_MessageFeatures_AutoReplyConfiguration_Payloads = Lib_MessageFeatures_SafeMessagePayload[];
export type Lib_MessageFeatures_AutoReplyConfiguration_Regex = Lib_MessageFeatures_RegularExpressionConfiguration;
export type Lib_MessageFeatures_AutoReplyConfiguration_Reply = boolean | undefined;
export type Lib_MessageFeatures_AutoReplyConfiguration = {
  channels?: Lib_MessageFeatures_AutoReplyConfiguration_Channels;
  name: Lib_MessageFeatures_AutoReplyConfiguration_Name;
  payloads: Lib_MessageFeatures_AutoReplyConfiguration_Payloads;
  regex: Lib_MessageFeatures_AutoReplyConfiguration_Regex;
  reply?: Lib_MessageFeatures_AutoReplyConfiguration_Reply;
};

export type Lib_MessageFeatures_RegexRule_ChannelIdentifier = string | undefined;
export type Lib_MessageFeatures_RegexRule_DirectMessagePayload = Lib_MessageFeatures_SafeMessagePayload | undefined;
export type Lib_MessageFeatures_RegexRule_ExcludedRoleIdentifiers = string[];
export type Lib_MessageFeatures_RegexRule_Match = boolean;
export type Lib_MessageFeatures_RegexRule_Name = string;
export type Lib_MessageFeatures_RegexRule_RegularExpression = RegExp;
export type Lib_MessageFeatures_RegexRule = {
  channelIdentifier: Lib_MessageFeatures_RegexRule_ChannelIdentifier;
  directMessagePayload: Lib_MessageFeatures_RegexRule_DirectMessagePayload;
  excludedRoleIdentifiers: Lib_MessageFeatures_RegexRule_ExcludedRoleIdentifiers;
  match: Lib_MessageFeatures_RegexRule_Match;
  name: Lib_MessageFeatures_RegexRule_Name;
  regularExpression: Lib_MessageFeatures_RegexRule_RegularExpression;
};

export type Lib_MessageFeatures_RegexRuleConfiguration_Channel = Lib_MessageFeatures_ChannelReference | undefined;
export type Lib_MessageFeatures_RegexRuleConfiguration_DirectMessagePayload = Lib_MessageFeatures_SafeMessagePayload | undefined;
export type Lib_MessageFeatures_RegexRuleConfiguration_ExcludedRoles = Lib_MessageFeatures_RoleReference[] | undefined;
export type Lib_MessageFeatures_RegexRuleConfiguration_Match = boolean;
export type Lib_MessageFeatures_RegexRuleConfiguration_Name = string;
export type Lib_MessageFeatures_RegexRuleConfiguration_Regex = Lib_MessageFeatures_RegularExpressionConfiguration;
export type Lib_MessageFeatures_RegexRuleConfiguration = {
  'channel'?: Lib_MessageFeatures_RegexRuleConfiguration_Channel;
  'direct-message-payload'?: Lib_MessageFeatures_RegexRuleConfiguration_DirectMessagePayload;
  'excluded-roles'?: Lib_MessageFeatures_RegexRuleConfiguration_ExcludedRoles;
  'match': Lib_MessageFeatures_RegexRuleConfiguration_Match;
  'name': Lib_MessageFeatures_RegexRuleConfiguration_Name;
  'regex': Lib_MessageFeatures_RegexRuleConfiguration_Regex;
};

export type Lib_MessageFeatures_SuspiciousCategory_Category = string;
export type Lib_MessageFeatures_SuspiciousCategory_Words = string[];
export type Lib_MessageFeatures_SuspiciousCategory = {
  category: Lib_MessageFeatures_SuspiciousCategory_Category;
  words: Lib_MessageFeatures_SuspiciousCategory_Words;
};

export type Lib_MessageFeatures_SuspiciousWords_ChannelIdentifier = string;
export type Lib_MessageFeatures_SuspiciousWords_Categories = Lib_MessageFeatures_SuspiciousCategory[];
export type Lib_MessageFeatures_SuspiciousWords = {
  categories: Lib_MessageFeatures_SuspiciousWords_Categories;
  channelIdentifier: Lib_MessageFeatures_SuspiciousWords_ChannelIdentifier;
};

export type Lib_MessageFeatures_SuspiciousCategoryConfiguration_Category = string;
export type Lib_MessageFeatures_SuspiciousCategoryConfiguration_Words = string[];
export type Lib_MessageFeatures_SuspiciousCategoryConfiguration = {
  category: Lib_MessageFeatures_SuspiciousCategoryConfiguration_Category;
  words: Lib_MessageFeatures_SuspiciousCategoryConfiguration_Words;
};

export type Lib_MessageFeatures_SuspiciousWordsConfiguration_Categories = Lib_MessageFeatures_SuspiciousCategoryConfiguration[];
export type Lib_MessageFeatures_SuspiciousWordsConfiguration_Channel = Lib_MessageFeatures_ChannelReference;
export type Lib_MessageFeatures_SuspiciousWordsConfiguration = {
  categories: Lib_MessageFeatures_SuspiciousWordsConfiguration_Categories;
  channel: Lib_MessageFeatures_SuspiciousWordsConfiguration_Channel;
};

export type Lib_MessageFeatures_Runtime_AffiliateCleanup = Lib_MessageFeatures_AffiliateCleanup | undefined;
export type Lib_MessageFeatures_Runtime_AutoReplies = Lib_MessageFeatures_AutoReplyRule[];
export type Lib_MessageFeatures_Runtime_RegexRules = Lib_MessageFeatures_RegexRule[];
export type Lib_MessageFeatures_Runtime_SuspiciousWords = Lib_MessageFeatures_SuspiciousWords | undefined;
export type Lib_MessageFeatures_Runtime = {
  affiliateCleanup: Lib_MessageFeatures_Runtime_AffiliateCleanup;
  autoReplies: Lib_MessageFeatures_Runtime_AutoReplies;
  regexRules: Lib_MessageFeatures_Runtime_RegexRules;
  suspiciousWords: Lib_MessageFeatures_Runtime_SuspiciousWords;
};

export type Lib_MessageFeatures_Registration_Client = Client;
export type Lib_MessageFeatures_Registration_GuildIdentifier = string;
export type Lib_MessageFeatures_Registration = (
  client: Lib_MessageFeatures_Registration_Client,
  guildIdentifier: Lib_MessageFeatures_Registration_GuildIdentifier,
) => void;

export type Lib_MessageFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_MessageFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_MessageFeatures_Prepared_Intents = GatewayIntentBits[];
export type Lib_MessageFeatures_Prepared_Register = Lib_MessageFeatures_Registration;
export type Lib_MessageFeatures_Prepared = {
  activeFeatureKeys: Lib_MessageFeatures_Prepared_ActiveFeatureKeys;
  configurationErrors: Lib_MessageFeatures_Prepared_ConfigurationErrors;
  intents: Lib_MessageFeatures_Prepared_Intents;
  register: Lib_MessageFeatures_Prepared_Register;
};

export type Lib_MessageFeatures_CompileAffiliateCleanup_Configuration = unknown;
export type Lib_MessageFeatures_CompileAffiliateCleanup_Returns = Lib_MessageFeatures_AffiliateCleanup;
export type Lib_MessageFeatures_CompileAffiliateCleanup_Parsed = Lib_MessageFeatures_AffiliateCleanupConfiguration;
export type Lib_MessageFeatures_CompileAffiliateCleanup_Platforms = Lib_MessageFeatures_AffiliatePlatform[];

export type Lib_MessageFeatures_CompileAutoReplies_Configuration = unknown;
export type Lib_MessageFeatures_CompileAutoReplies_Returns = Lib_MessageFeatures_AutoReplyRule[];
export type Lib_MessageFeatures_CompileAutoReplies_Parsed = Lib_MessageFeatures_AutoReplyConfiguration[];
export type Lib_MessageFeatures_CompileAutoReplies_Rules = Lib_MessageFeatures_AutoReplyRule[];

export type Lib_MessageFeatures_CompileRegexRules_Configuration = unknown;
export type Lib_MessageFeatures_CompileRegexRules_Returns = Lib_MessageFeatures_RegexRule[];
export type Lib_MessageFeatures_CompileRegexRules_Parsed = Lib_MessageFeatures_RegexRuleConfiguration[];
export type Lib_MessageFeatures_CompileRegexRules_Rules = Lib_MessageFeatures_RegexRule[];

export type Lib_MessageFeatures_CompileSuspiciousWords_Configuration = unknown;
export type Lib_MessageFeatures_CompileSuspiciousWords_Returns = Lib_MessageFeatures_SuspiciousWords;
export type Lib_MessageFeatures_CompileSuspiciousWords_Categories = Lib_MessageFeatures_SuspiciousCategory[];
export type Lib_MessageFeatures_CompileSuspiciousWords_Parsed = Lib_MessageFeatures_SuspiciousWordsConfiguration;

export type Lib_MessageFeatures_CreateMessageOptions_Payload = Lib_MessageFeatures_SafeMessagePayload;
export type Lib_MessageFeatures_CreateMessageOptions_Returns = MessageReplyOptions;

export type Lib_MessageFeatures_CreateRegistration_Runtime = Lib_MessageFeatures_Runtime;
export type Lib_MessageFeatures_CreateRegistration_Returns = Lib_MessageFeatures_Registration;

export type Lib_MessageFeatures_FormatConfigurationError_Error = unknown;
export type Lib_MessageFeatures_FormatConfigurationError_Returns = string;
export type Lib_MessageFeatures_FormatConfigurationError_Messages = string[];

export type Lib_MessageFeatures_GetChannelIdentifier_Reference = Lib_MessageFeatures_ChannelReference | undefined;
export type Lib_MessageFeatures_GetChannelIdentifier_Returns = string | undefined;

export type Lib_MessageFeatures_GetChannelIdentifiers_References = Lib_MessageFeatures_ChannelReference[] | undefined;
export type Lib_MessageFeatures_GetChannelIdentifiers_Returns = string[];

export type Lib_MessageFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_MessageFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_MessageFeatures_GetEnabledFeature_Returns = Lib_MessageFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_MessageFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_MessageFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_MessageFeatures_GetEnabledFeature_EnabledFeature_Configuration = unknown;
export type Lib_MessageFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: Lib_MessageFeatures_GetEnabledFeature_EnabledFeature_Configuration;
};

export type Lib_MessageFeatures_GetRoleIdentifiers_References = Lib_MessageFeatures_RoleReference[] | undefined;
export type Lib_MessageFeatures_GetRoleIdentifiers_Returns = string[];

export type Lib_MessageFeatures_HandleAffiliateCleanup_Message = Message<true>;
export type Lib_MessageFeatures_HandleAffiliateCleanup_Settings = Lib_MessageFeatures_AffiliateCleanup;
export type Lib_MessageFeatures_HandleAffiliateCleanup_Returns = Promise<boolean>;
export type Lib_MessageFeatures_HandleAffiliateCleanup_DetectedPlatforms = string[];
export type Lib_MessageFeatures_HandleAffiliateCleanup_Deleted = boolean;

export type Lib_MessageFeatures_HandleAutoReplies_Message = Message<true>;
export type Lib_MessageFeatures_HandleAutoReplies_Rules = Lib_MessageFeatures_AutoReplyRule[];
export type Lib_MessageFeatures_HandleAutoReplies_Returns = Promise<void>;
export type Lib_MessageFeatures_HandleAutoReplies_ChannelMatches = boolean;
export type Lib_MessageFeatures_HandleAutoReplies_Matches = boolean;
export type Lib_MessageFeatures_HandleAutoReplies_Payload = Lib_MessageFeatures_SafeMessagePayload | undefined;
export type Lib_MessageFeatures_HandleAutoReplies_PayloadIndex = number;
export type Lib_MessageFeatures_HandleAutoReplies_SendOptions = MessageReplyOptions;

export type Lib_MessageFeatures_HandleMessage_Message = Message;
export type Lib_MessageFeatures_HandleMessage_GuildIdentifier = string;
export type Lib_MessageFeatures_HandleMessage_Runtime = Lib_MessageFeatures_Runtime;
export type Lib_MessageFeatures_HandleMessage_RunAutoReplies = boolean;
export type Lib_MessageFeatures_HandleMessage_Returns = Promise<void>;
export type Lib_MessageFeatures_HandleMessage_Deleted = boolean;

export type Lib_MessageFeatures_HandleMessageUpdate_OldMessage = Message | PartialMessage;
export type Lib_MessageFeatures_HandleMessageUpdate_NewMessage = Message;
export type Lib_MessageFeatures_HandleMessageUpdate_GuildIdentifier = string;
export type Lib_MessageFeatures_HandleMessageUpdate_Runtime = Lib_MessageFeatures_Runtime;
export type Lib_MessageFeatures_HandleMessageUpdate_Returns = Promise<void>;

export type Lib_MessageFeatures_HandleRegexRules_Message = Message<true>;
export type Lib_MessageFeatures_HandleRegexRules_Rules = Lib_MessageFeatures_RegexRule[];
export type Lib_MessageFeatures_HandleRegexRules_Returns = Promise<boolean>;
export type Lib_MessageFeatures_HandleRegexRules_Matches = boolean;
export type Lib_MessageFeatures_HandleRegexRules_Deleted = boolean;

export type Lib_MessageFeatures_HandleSuspiciousWords_Message = Message<true>;
export type Lib_MessageFeatures_HandleSuspiciousWords_Settings = Lib_MessageFeatures_SuspiciousWords;
export type Lib_MessageFeatures_HandleSuspiciousWords_Returns = Promise<void>;
export type Lib_MessageFeatures_HandleSuspiciousWords_CleanedContent = string;
export type Lib_MessageFeatures_HandleSuspiciousWords_DetectedCategories = string[];
export type Lib_MessageFeatures_HandleSuspiciousWords_PaddedContent = string;

export type Lib_MessageFeatures_HasExcludedRole_Message = Message<true>;
export type Lib_MessageFeatures_HasExcludedRole_RoleIdentifiers = string[];
export type Lib_MessageFeatures_HasExcludedRole_Returns = boolean;
export type Lib_MessageFeatures_HasExcludedRole_Member = GuildMember | null;

export type Lib_MessageFeatures_IsRecord_Value = unknown;
export type Lib_MessageFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_MessageFeatures_MatchesRegularExpression_RegularExpression = RegExp;
export type Lib_MessageFeatures_MatchesRegularExpression_Content = string;
export type Lib_MessageFeatures_MatchesRegularExpression_Returns = boolean;
export type Lib_MessageFeatures_MatchesRegularExpression_Matches = boolean;

export type Lib_MessageFeatures_NormalizeModerationContent_Content = string;
export type Lib_MessageFeatures_NormalizeModerationContent_Returns = string;
export type Lib_MessageFeatures_NormalizeModerationContent_CombiningMarkPattern = RegExp;
export type Lib_MessageFeatures_NormalizeModerationContent_SeparatorPattern = RegExp;
export type Lib_MessageFeatures_NormalizeModerationContent_WhitespacePattern = RegExp;

export type Lib_MessageFeatures_PrepareMessageFeatures_Settings = Shared_JsonObject;
export type Lib_MessageFeatures_PrepareMessageFeatures_Returns = Lib_MessageFeatures_Prepared;
export type Lib_MessageFeatures_Test_TruncatedContent = string;
export type Lib_MessageFeatures_PrepareMessageFeatures_Runtime = Lib_MessageFeatures_Runtime;
export type Lib_MessageFeatures_PrepareMessageFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_MessageFeatures_PrepareMessageFeatures_ConfigurationErrors = string[];
export type Lib_MessageFeatures_PrepareMessageFeatures_AffiliateFeature = Lib_MessageFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_MessageFeatures_PrepareMessageFeatures_AutoReplyFeature = Lib_MessageFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_MessageFeatures_PrepareMessageFeatures_RegexFeature = Lib_MessageFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_MessageFeatures_PrepareMessageFeatures_SuspiciousWordsFeature = Lib_MessageFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_MessageFeatures_PrepareMessageFeatures_Intents = GatewayIntentBits[];

export type Lib_MessageFeatures_RecordConfigurationError_FeatureKey = Shared_FeatureKey;
export type Lib_MessageFeatures_RecordConfigurationError_Error = unknown;
export type Lib_MessageFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_MessageFeatures_RecordConfigurationError_Returns = void;
export type Lib_MessageFeatures_RecordConfigurationError_Message = string;

export type Lib_MessageFeatures_SendModerationAlert_Message = Message<true>;
export type Lib_MessageFeatures_SendModerationAlert_ChannelIdentifier = string;
export type Lib_MessageFeatures_SendModerationAlert_Title = string;
export type Lib_MessageFeatures_SendModerationAlert_Details = string;
export type Lib_MessageFeatures_SendModerationAlert_Returns = Promise<void>;
export type Lib_MessageFeatures_SendModerationAlert_Channel = GuildBasedChannel | null;
export type Lib_MessageFeatures_SendModerationAlert_Description = string;

export type Lib_MessageFeatures_TruncateContent_Content = string;
export type Lib_MessageFeatures_TruncateContent_MaximumCharacters = number;
export type Lib_MessageFeatures_TruncateContent_Returns = string;
