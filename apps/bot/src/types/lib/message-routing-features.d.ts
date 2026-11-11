import type {
  APIEmbed,
  Client,
  GatewayIntentBits,
  GuildBasedChannel,
  Message,
  WebhookClient,
} from 'discord.js';

import type {
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_MessageRoutingFeatures_SecretReference_Key = string;
export type Lib_MessageRoutingFeatures_SecretReference = {
  $secret: Lib_MessageRoutingFeatures_SecretReference_Key;
};
export type Lib_MessageRoutingFeatures_SecretResolver_Key = string;
export type Lib_MessageRoutingFeatures_SecretResolver_Returns = string | undefined;
export type Lib_MessageRoutingFeatures_SecretResolver = (
  key: Lib_MessageRoutingFeatures_SecretResolver_Key,
) => Lib_MessageRoutingFeatures_SecretResolver_Returns;
export type Lib_MessageRoutingFeatures_Secrets = Lib_MessageRoutingFeatures_SecretResolver;

export type Lib_MessageRoutingFeatures_Reference_Identifier = string;
export type Lib_MessageRoutingFeatures_ChannelReference = {
  'channel-id': Lib_MessageRoutingFeatures_Reference_Identifier;
};
export type Lib_MessageRoutingFeatures_UserReference = {
  'user-id': Lib_MessageRoutingFeatures_Reference_Identifier;
};

export type Lib_MessageRoutingFeatures_RegularExpressionConfiguration_Flags = string | undefined;
export type Lib_MessageRoutingFeatures_RegularExpressionConfiguration_Pattern = string;
export type Lib_MessageRoutingFeatures_RegularExpressionConfiguration = {
  flags?: Lib_MessageRoutingFeatures_RegularExpressionConfiguration_Flags;
  pattern: Lib_MessageRoutingFeatures_RegularExpressionConfiguration_Pattern;
};

export type Lib_MessageRoutingFeatures_Replacement_RegularExpression = RegExp;
export type Lib_MessageRoutingFeatures_Replacement_ReplaceWith = string;
export type Lib_MessageRoutingFeatures_Replacement = {
  regularExpression: Lib_MessageRoutingFeatures_Replacement_RegularExpression;
  replaceWith: Lib_MessageRoutingFeatures_Replacement_ReplaceWith;
};

export type Lib_MessageRoutingFeatures_ReplacementConfiguration = {
  'flags'?: string | undefined;
  'pattern': string;
  'replace-with': string;
};

export type Lib_MessageRoutingFeatures_CopierChannelDestinationConfiguration = {
  channel: Lib_MessageRoutingFeatures_ChannelReference;
  method: 'discord-channel';
};
export type Lib_MessageRoutingFeatures_CopierWebhookDestinationConfiguration = {
  method: 'discord-webhook';
  webhook: {
    'avatar-url'?: string | undefined;
    'url': Lib_MessageRoutingFeatures_SecretReference;
    'username'?: string | undefined;
  };
};
export type Lib_MessageRoutingFeatures_CopierDestinationConfiguration =
  | Lib_MessageRoutingFeatures_CopierChannelDestinationConfiguration
  | Lib_MessageRoutingFeatures_CopierWebhookDestinationConfiguration;
export type Lib_MessageRoutingFeatures_CopierRuleConfiguration = {
  'allowed-channels'?: Lib_MessageRoutingFeatures_ChannelReference[] | undefined;
  'allowed-users'?: Lib_MessageRoutingFeatures_UserReference[] | undefined;
  'destinations': Lib_MessageRoutingFeatures_CopierDestinationConfiguration[];
  'disallowed-channels'?: Lib_MessageRoutingFeatures_ChannelReference[] | undefined;
  'disallowed-users'?: Lib_MessageRoutingFeatures_UserReference[] | undefined;
  'include-attachments': boolean;
  'message': string;
  'name': string;
  'regex': Lib_MessageRoutingFeatures_RegularExpressionConfiguration;
  'replacements'?: Lib_MessageRoutingFeatures_ReplacementConfiguration[] | undefined;
};
export type Lib_MessageRoutingFeatures_CopierConfiguration = Lib_MessageRoutingFeatures_CopierRuleConfiguration[];

export type Lib_MessageRoutingFeatures_ProxyRuleConfiguration = {
  'channel': Lib_MessageRoutingFeatures_ChannelReference;
  'name': string;
  'print-payload'?: boolean | undefined;
  'replacements'?: Lib_MessageRoutingFeatures_ReplacementConfiguration[] | undefined;
  'webhook': {
    'webhook-url': Lib_MessageRoutingFeatures_SecretReference;
  };
};
export type Lib_MessageRoutingFeatures_ProxyConfiguration = Lib_MessageRoutingFeatures_ProxyRuleConfiguration[];

export type Lib_MessageRoutingFeatures_CopierChannelDestination_ChannelIdentifier = string;
export type Lib_MessageRoutingFeatures_CopierChannelDestination = {
  channelIdentifier: Lib_MessageRoutingFeatures_CopierChannelDestination_ChannelIdentifier;
  kind: 'channel';
};
export type Lib_MessageRoutingFeatures_CopierWebhookDestination_AvatarUrl = string | undefined;
export type Lib_MessageRoutingFeatures_CopierWebhookDestination_Url = string;
export type Lib_MessageRoutingFeatures_CopierWebhookDestination_Username = string | undefined;
export type Lib_MessageRoutingFeatures_CopierWebhookDestination = {
  avatarUrl: Lib_MessageRoutingFeatures_CopierWebhookDestination_AvatarUrl;
  kind: 'webhook';
  url: Lib_MessageRoutingFeatures_CopierWebhookDestination_Url;
  username: Lib_MessageRoutingFeatures_CopierWebhookDestination_Username;
};
export type Lib_MessageRoutingFeatures_CopierDestination =
  | Lib_MessageRoutingFeatures_CopierChannelDestination
  | Lib_MessageRoutingFeatures_CopierWebhookDestination;

export type Lib_MessageRoutingFeatures_CopierRule_AllowedChannelIdentifiers = string[];
export type Lib_MessageRoutingFeatures_CopierRule_AllowedUserIdentifiers = string[];
export type Lib_MessageRoutingFeatures_CopierRule_Destinations = Lib_MessageRoutingFeatures_CopierDestination[];
export type Lib_MessageRoutingFeatures_CopierRule_DisallowedChannelIdentifiers = string[];
export type Lib_MessageRoutingFeatures_CopierRule_DisallowedUserIdentifiers = string[];
export type Lib_MessageRoutingFeatures_CopierRule_IncludeAttachments = boolean;
export type Lib_MessageRoutingFeatures_CopierRule_MessageTemplate = string;
export type Lib_MessageRoutingFeatures_CopierRule_Name = string;
export type Lib_MessageRoutingFeatures_CopierRule_RegularExpression = RegExp;
export type Lib_MessageRoutingFeatures_CopierRule_Replacements = Lib_MessageRoutingFeatures_Replacement[];
export type Lib_MessageRoutingFeatures_CopierRule = {
  allowedChannelIdentifiers: Lib_MessageRoutingFeatures_CopierRule_AllowedChannelIdentifiers;
  allowedUserIdentifiers: Lib_MessageRoutingFeatures_CopierRule_AllowedUserIdentifiers;
  destinations: Lib_MessageRoutingFeatures_CopierRule_Destinations;
  disallowedChannelIdentifiers: Lib_MessageRoutingFeatures_CopierRule_DisallowedChannelIdentifiers;
  disallowedUserIdentifiers: Lib_MessageRoutingFeatures_CopierRule_DisallowedUserIdentifiers;
  includeAttachments: Lib_MessageRoutingFeatures_CopierRule_IncludeAttachments;
  messageTemplate: Lib_MessageRoutingFeatures_CopierRule_MessageTemplate;
  name: Lib_MessageRoutingFeatures_CopierRule_Name;
  regularExpression: Lib_MessageRoutingFeatures_CopierRule_RegularExpression;
  replacements: Lib_MessageRoutingFeatures_CopierRule_Replacements;
};

export type Lib_MessageRoutingFeatures_ProxyRule_ChannelIdentifier = string;
export type Lib_MessageRoutingFeatures_ProxyRule_Name = string;
export type Lib_MessageRoutingFeatures_ProxyRule_Replacements = Lib_MessageRoutingFeatures_Replacement[];
export type Lib_MessageRoutingFeatures_ProxyRule_WebhookUrl = string;
export type Lib_MessageRoutingFeatures_ProxyRule = {
  channelIdentifier: Lib_MessageRoutingFeatures_ProxyRule_ChannelIdentifier;
  name: Lib_MessageRoutingFeatures_ProxyRule_Name;
  replacements: Lib_MessageRoutingFeatures_ProxyRule_Replacements;
  webhookUrl: Lib_MessageRoutingFeatures_ProxyRule_WebhookUrl;
};

export type Lib_MessageRoutingFeatures_Runtime_CopierRules = Lib_MessageRoutingFeatures_CopierRule[];
export type Lib_MessageRoutingFeatures_Runtime_ProxyRules = Lib_MessageRoutingFeatures_ProxyRule[];
export type Lib_MessageRoutingFeatures_Runtime = {
  copierRules: Lib_MessageRoutingFeatures_Runtime_CopierRules;
  proxyRules: Lib_MessageRoutingFeatures_Runtime_ProxyRules;
};

export type Lib_MessageRoutingFeatures_Registration_Client = Client;
export type Lib_MessageRoutingFeatures_Registration_GuildIdentifier = string;
export type Lib_MessageRoutingFeatures_Registration = (
  client: Lib_MessageRoutingFeatures_Registration_Client,
  guildIdentifier: Lib_MessageRoutingFeatures_Registration_GuildIdentifier,
) => void;

export type Lib_MessageRoutingFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_MessageRoutingFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_MessageRoutingFeatures_Prepared_Intents = GatewayIntentBits[];
export type Lib_MessageRoutingFeatures_Prepared_Register = Lib_MessageRoutingFeatures_Registration;
export type Lib_MessageRoutingFeatures_Prepared = {
  activeFeatureKeys: Lib_MessageRoutingFeatures_Prepared_ActiveFeatureKeys;
  configurationErrors: Lib_MessageRoutingFeatures_Prepared_ConfigurationErrors;
  intents: Lib_MessageRoutingFeatures_Prepared_Intents;
  register: Lib_MessageRoutingFeatures_Prepared_Register;
};

export type Lib_MessageRoutingFeatures_ApplyReplacements_Content = string;
export type Lib_MessageRoutingFeatures_ApplyReplacements_EditedContent = string;
export type Lib_MessageRoutingFeatures_ApplyReplacements_Replacements = Lib_MessageRoutingFeatures_Replacement[];
export type Lib_MessageRoutingFeatures_ApplyReplacements_Returns = string;

export type Lib_MessageRoutingFeatures_AppendAttachmentLinks_AttachmentUrls = string[];
export type Lib_MessageRoutingFeatures_AppendAttachmentLinks_Content = string;
export type Lib_MessageRoutingFeatures_AppendAttachmentLinks_IncludeAttachments = boolean;
export type Lib_MessageRoutingFeatures_AppendAttachmentLinks_Message = Message<true>;
export type Lib_MessageRoutingFeatures_AppendAttachmentLinks_Returns = string;

export type Lib_MessageRoutingFeatures_CompileCopierRules_Configuration = unknown;
export type Lib_MessageRoutingFeatures_CompileCopierRules_Parsed = Lib_MessageRoutingFeatures_CopierConfiguration;
export type Lib_MessageRoutingFeatures_CompileCopierRules_Destinations = Lib_MessageRoutingFeatures_CopierDestination[];
export type Lib_MessageRoutingFeatures_CompileCopierRules_Returns = Lib_MessageRoutingFeatures_CopierRule[];
export type Lib_MessageRoutingFeatures_CompileCopierRules_Secrets = Lib_MessageRoutingFeatures_Secrets;

export type Lib_MessageRoutingFeatures_CompileProxyRules_Configuration = unknown;
export type Lib_MessageRoutingFeatures_CompileProxyRules_Parsed = Lib_MessageRoutingFeatures_ProxyConfiguration;
export type Lib_MessageRoutingFeatures_CompileProxyRules_Returns = Lib_MessageRoutingFeatures_ProxyRule[];
export type Lib_MessageRoutingFeatures_CompileProxyRules_Secrets = Lib_MessageRoutingFeatures_Secrets;

export type Lib_MessageRoutingFeatures_CompileReplacements_Configuration = Lib_MessageRoutingFeatures_ReplacementConfiguration[] | undefined;
export type Lib_MessageRoutingFeatures_CompileReplacements_Returns = Lib_MessageRoutingFeatures_Replacement[];

export type Lib_MessageRoutingFeatures_CreateRegistration_Returns = Lib_MessageRoutingFeatures_Registration;
export type Lib_MessageRoutingFeatures_CreateRegistration_Runtime = Lib_MessageRoutingFeatures_Runtime;

export type Lib_MessageRoutingFeatures_FindMatchingCopierRule_Message = Message<true>;
export type Lib_MessageRoutingFeatures_FindMatchingCopierRule_Returns = Lib_MessageRoutingFeatures_CopierRule | undefined;
export type Lib_MessageRoutingFeatures_FindMatchingCopierRule_Rules = Lib_MessageRoutingFeatures_CopierRule[];

export type Lib_MessageRoutingFeatures_FindMatchingProxyRule_ChannelIdentifier = string;
export type Lib_MessageRoutingFeatures_FindMatchingProxyRule_Returns = Lib_MessageRoutingFeatures_ProxyRule | undefined;
export type Lib_MessageRoutingFeatures_FindMatchingProxyRule_Rules = Lib_MessageRoutingFeatures_ProxyRule[];

export type Lib_MessageRoutingFeatures_FormatConfigurationError_Error = unknown;
export type Lib_MessageRoutingFeatures_FormatConfigurationError_Messages = string[];
export type Lib_MessageRoutingFeatures_FormatConfigurationError_Returns = string;

export type Lib_MessageRoutingFeatures_FormatCopierContent_Content = string;
export type Lib_MessageRoutingFeatures_FormatCopierContent_Message = Message<true>;
export type Lib_MessageRoutingFeatures_FormatCopierContent_Returns = string;
export type Lib_MessageRoutingFeatures_FormatCopierContent_Rule = Lib_MessageRoutingFeatures_CopierRule;
export type Lib_MessageRoutingFeatures_FormatCopierContent_TransformedContent = string;

export type Lib_MessageRoutingFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: unknown;
};
export type Lib_MessageRoutingFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_MessageRoutingFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_MessageRoutingFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_MessageRoutingFeatures_GetEnabledFeature_Returns = Lib_MessageRoutingFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_MessageRoutingFeatures_GetEnabledFeature_Settings = Shared_JsonObject;

export type Lib_MessageRoutingFeatures_HandleMessage_CopierRule = Lib_MessageRoutingFeatures_CopierRule | undefined;
export type Lib_MessageRoutingFeatures_HandleMessage_GuildIdentifier = string;
export type Lib_MessageRoutingFeatures_HandleMessage_Message = Message;
export type Lib_MessageRoutingFeatures_HandleMessage_ProxyRule = Lib_MessageRoutingFeatures_ProxyRule | undefined;
export type Lib_MessageRoutingFeatures_HandleMessage_Returns = Promise<void>;
export type Lib_MessageRoutingFeatures_HandleMessage_Runtime = Lib_MessageRoutingFeatures_Runtime;

export type Lib_MessageRoutingFeatures_IsRecord_TypeGuard = Record<string, unknown>;
export type Lib_MessageRoutingFeatures_IsRecord_Value = unknown;

export type Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_ParsedUrl = URL;
export type Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_PathPattern = RegExp;
export type Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Returns = boolean;
export type Lib_MessageRoutingFeatures_IsValidDiscordWebhookUrl_Value = string;

export type Lib_MessageRoutingFeatures_MatchesRegularExpression_Content = string;
export type Lib_MessageRoutingFeatures_MatchesRegularExpression_RegularExpression = RegExp;
export type Lib_MessageRoutingFeatures_MatchesRegularExpression_Returns = boolean;

export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ConfigurationErrors = string[];
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_CopierFeature = Lib_MessageRoutingFeatures_GetEnabledFeature_Returns;
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_CopierRules = Lib_MessageRoutingFeatures_CopierRule[];
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Intents = GatewayIntentBits[];
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ProxyFeature = Lib_MessageRoutingFeatures_GetEnabledFeature_Returns;
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_ProxyRules = Lib_MessageRoutingFeatures_ProxyRule[];
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Returns = Lib_MessageRoutingFeatures_Prepared;
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Secrets = Lib_MessageRoutingFeatures_Secrets;
export type Lib_MessageRoutingFeatures_PrepareMessageRoutingFeatures_Settings = Shared_JsonObject;

export type Lib_MessageRoutingFeatures_RecordConfigurationError_ConfigurationErrors = string[];
export type Lib_MessageRoutingFeatures_RecordConfigurationError_Error = unknown;
export type Lib_MessageRoutingFeatures_RecordConfigurationError_FeatureKey = Shared_FeatureKey;
export type Lib_MessageRoutingFeatures_RecordConfigurationError_Message = string;
export type Lib_MessageRoutingFeatures_RecordConfigurationError_Returns = void;

export type Lib_MessageRoutingFeatures_ResolveSecretReference_Reference = Lib_MessageRoutingFeatures_SecretReference;
export type Lib_MessageRoutingFeatures_ResolveSecretReference_Returns = string;
export type Lib_MessageRoutingFeatures_ResolveSecretReference_Secret = string | undefined;
export type Lib_MessageRoutingFeatures_ResolveSecretReference_Secrets = Lib_MessageRoutingFeatures_SecretResolver;

export type Lib_MessageRoutingFeatures_SendCopierMessage_Channel = GuildBasedChannel | null;
export type Lib_MessageRoutingFeatures_SendCopierMessage_Content = string;
export type Lib_MessageRoutingFeatures_SendCopierMessage_Message = Message<true>;
export type Lib_MessageRoutingFeatures_SendCopierMessage_Returns = Promise<void>;
export type Lib_MessageRoutingFeatures_SendCopierMessage_Rule = Lib_MessageRoutingFeatures_CopierRule;
export type Lib_MessageRoutingFeatures_SendCopierMessage_WebhookClient = WebhookClient;

export type Lib_MessageRoutingFeatures_SendProxyMessage_AttachmentContent = string;
export type Lib_MessageRoutingFeatures_SendProxyMessage_Content = string;
export type Lib_MessageRoutingFeatures_SendProxyMessage_Embeds = APIEmbed[];
export type Lib_MessageRoutingFeatures_SendProxyMessage_Message = Message<true>;
export type Lib_MessageRoutingFeatures_SendProxyMessage_Returns = Promise<void>;
export type Lib_MessageRoutingFeatures_SendProxyMessage_Rule = Lib_MessageRoutingFeatures_ProxyRule;
export type Lib_MessageRoutingFeatures_SendProxyMessage_WebhookClient = WebhookClient;

export type Lib_MessageRoutingFeatures_Test_CopierRules = Lib_MessageRoutingFeatures_CopierRule[];
export type Lib_MessageRoutingFeatures_Test_CreateSecretResolver_Returns = Lib_MessageRoutingFeatures_SecretResolver;
export type Lib_MessageRoutingFeatures_Test_CreateSecretResolver_SecretValues = Record<string, string>;
export type Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Key = string;
export type Lib_MessageRoutingFeatures_Test_ResolveNoSecret_Returns = undefined;
export type Lib_MessageRoutingFeatures_Test_SecretResolver = Lib_MessageRoutingFeatures_SecretResolver;
export type Lib_MessageRoutingFeatures_Test_SecretValues = Record<string, string>;
