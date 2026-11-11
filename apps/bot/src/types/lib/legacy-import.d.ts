import type {
  Shared_FeatureConfigurations,
  Shared_FeatureKey,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_LegacyImport_ImportedSecret_Key = string;
export type Lib_LegacyImport_ImportedSecret_Value = string;
export type Lib_LegacyImport_ImportedSecret = {
  key: Lib_LegacyImport_ImportedSecret_Key;
  value: Lib_LegacyImport_ImportedSecret_Value;
};

export type Lib_LegacyImport_ImportLegacyConfiguration_CurrentDate = Date;
export type Lib_LegacyImport_ImportLegacyConfiguration_EnableImportedFeatures = boolean;
export type Lib_LegacyImport_ImportLegacyConfiguration_EnabledFeatureKeys = Shared_FeatureKey[];
export type Lib_LegacyImport_ImportLegacyConfiguration_FeatureConfiguration = unknown;
export type Lib_LegacyImport_ImportLegacyConfiguration_FeatureConfigurationValid = boolean;
export type Lib_LegacyImport_ImportLegacyConfiguration_FeatureEnabled = boolean;
export type Lib_LegacyImport_ImportLegacyConfiguration_Features = Shared_FeatureConfigurations;
export type Lib_LegacyImport_ImportLegacyConfiguration_GuildIdentifier = string | undefined;
export type Lib_LegacyImport_ImportLegacyConfiguration_ImportedAt = string;
export type Lib_LegacyImport_ImportLegacyConfiguration_InvalidFeatureKeys = Shared_FeatureKey[];
export type Lib_LegacyImport_ImportLegacyConfiguration_Parsed = unknown;
export type Lib_LegacyImport_ImportLegacyConfiguration_ParsedConfiguration = Shared_JsonObject;
export type Lib_LegacyImport_ImportLegacyConfiguration_PreparedConfiguration = Shared_JsonObject;
export type Lib_LegacyImport_ImportLegacyConfiguration_RawConfiguration = string;
export type Lib_LegacyImport_ImportLegacyConfiguration_RecognizedFeatureKeys = Shared_FeatureKey[];
export type Lib_LegacyImport_ImportLegacyConfiguration_Recognized = boolean;
export type Lib_LegacyImport_ImportLegacyConfiguration_Returns = Lib_LegacyImport_Result;
export type Lib_LegacyImport_ImportLegacyConfiguration_SanitizedConfiguration = Shared_JsonObject;
export type Lib_LegacyImport_ImportLegacyConfiguration_SanitizedValue = unknown;
export type Lib_LegacyImport_ImportLegacyConfiguration_Secrets = Lib_LegacyImport_ImportedSecret[];
export type Lib_LegacyImport_ImportLegacyConfiguration_SecretValues = Record<string, string>;
export type Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver = (key: string) => string;
export type Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Key = string;
export type Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Returns = string;
export type Lib_LegacyImport_ImportLegacyConfiguration_Settings = Shared_JsonObject;
export type Lib_LegacyImport_ImportLegacyConfiguration_UnknownSections = string[];
export type Lib_LegacyImport_ImportLegacyConfiguration_Warnings = string[];

export type Lib_LegacyImport_Report_EnabledFeatureKeys = Shared_FeatureKey[];
export type Lib_LegacyImport_Report_InvalidFeatureKeys = Shared_FeatureKey[];
export type Lib_LegacyImport_Report_RecognizedFeatureKeys = Shared_FeatureKey[];
export type Lib_LegacyImport_Report_SecretCount = number;
export type Lib_LegacyImport_Report_UnknownSections = string[];
export type Lib_LegacyImport_Report_Warnings = string[];
export type Lib_LegacyImport_Report = {
  enabledFeatureKeys: Lib_LegacyImport_Report_EnabledFeatureKeys;
  invalidFeatureKeys: Lib_LegacyImport_Report_InvalidFeatureKeys;
  recognizedFeatureKeys: Lib_LegacyImport_Report_RecognizedFeatureKeys;
  secretCount: Lib_LegacyImport_Report_SecretCount;
  unknownSections: Lib_LegacyImport_Report_UnknownSections;
  warnings: Lib_LegacyImport_Report_Warnings;
};

export type Lib_LegacyImport_Result_DiscordToken = string | undefined;
export type Lib_LegacyImport_Result_GuildIdentifier = string | undefined;
export type Lib_LegacyImport_Result_Report = Lib_LegacyImport_Report;
export type Lib_LegacyImport_Result_Secrets = Lib_LegacyImport_ImportedSecret[];
export type Lib_LegacyImport_Result_Settings = Shared_JsonObject;
export type Lib_LegacyImport_Result = {
  discordToken: Lib_LegacyImport_Result_DiscordToken;
  guildIdentifier: Lib_LegacyImport_Result_GuildIdentifier;
  report: Lib_LegacyImport_Result_Report;
  secrets: Lib_LegacyImport_Result_Secrets;
  settings: Lib_LegacyImport_Result_Settings;
};

export type Lib_LegacyImport_GetBooleanAtPath_Value = Shared_JsonObject;
export type Lib_LegacyImport_GetBooleanAtPath_Path = readonly string[];
export type Lib_LegacyImport_GetBooleanAtPath_Returns = boolean | undefined;
export type Lib_LegacyImport_GetBooleanAtPath_Current = unknown;

export type Lib_LegacyImport_GetStringAtPath_Current = unknown;
export type Lib_LegacyImport_GetStringAtPath_Path = readonly string[];
export type Lib_LegacyImport_GetStringAtPath_Returns = string | undefined;
export type Lib_LegacyImport_GetStringAtPath_Value = Shared_JsonObject;

export type Lib_LegacyImport_IsJsonObject_Returns = boolean;
export type Lib_LegacyImport_IsJsonObject_Value = unknown;

export type Lib_LegacyImport_IsSecretPath_JoinedPath = string;
export type Lib_LegacyImport_IsSecretPath_LastSegment = string;
export type Lib_LegacyImport_IsSecretPath_Path = readonly string[];
export type Lib_LegacyImport_IsSecretPath_Returns = boolean;
export type Lib_LegacyImport_IsSecretPath_MessageFeaturePath = boolean;
export type Lib_LegacyImport_IsSecretPath_WebhookKey = boolean;
export type Lib_LegacyImport_IsSecretPath_WebhookPath = boolean;

export type Lib_LegacyImport_PrepareLegacyConfiguration_ParsedConfiguration = Shared_JsonObject;
export type Lib_LegacyImport_PrepareLegacyConfiguration_Warnings = string[];
export type Lib_LegacyImport_PrepareLegacyConfiguration_Returns = Shared_JsonObject;
export type Lib_LegacyImport_PrepareLegacyConfiguration_PreparedConfiguration = Shared_JsonObject;
export type Lib_LegacyImport_PrepareLegacyConfiguration_Entry = [string, unknown];
export type Lib_LegacyImport_PrepareLegacyConfiguration_Entries = Lib_LegacyImport_PrepareLegacyConfiguration_Entry[];
export type Lib_LegacyImport_PrepareLegacyConfiguration_SectionName = string;
export type Lib_LegacyImport_PrepareLegacyConfiguration_SectionValue = unknown;
export type Lib_LegacyImport_PrepareLegacyConfiguration_TranslatedXFeeds =
  Lib_LegacyImport_TranslateLegacyXFeeds_Configuration | undefined;

export type Lib_LegacyImport_PrepareLegacyMessageCopiers_Value = unknown;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_Warnings = string[];
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_Returns = unknown;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedMessageCopiers = unknown[];
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_IgnoredDestinationCount = number;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_IgnoredMessageCopierCount = number;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_Destinations = unknown;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedDestinations = unknown[];
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_Method = unknown;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedMessageCopier = Shared_JsonObject;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_DestinationNoun = string;
export type Lib_LegacyImport_PrepareLegacyMessageCopiers_RuleNoun = string;

export type Lib_LegacyImport_PrepareLegacySettings_Value = unknown;
export type Lib_LegacyImport_PrepareLegacySettings_Warnings = string[];
export type Lib_LegacyImport_PrepareLegacySettings_Returns = unknown;
export type Lib_LegacyImport_PrepareLegacySettings_PreparedSettings = Shared_JsonObject;
export type Lib_LegacyImport_PrepareLegacySettings_Entry = [string, unknown];
export type Lib_LegacyImport_PrepareLegacySettings_Entries = Lib_LegacyImport_PrepareLegacySettings_Entry[];
export type Lib_LegacyImport_PrepareLegacySettings_SettingName = string;
export type Lib_LegacyImport_PrepareLegacySettings_SettingValue = unknown;

export type Lib_LegacyImport_SanitizeValue_ChildPath = string[];
export type Lib_LegacyImport_SanitizeValue_Entry = [string, unknown];
export type Lib_LegacyImport_SanitizeValue_EntryKey = string;
export type Lib_LegacyImport_SanitizeValue_EntryValue = unknown;
export type Lib_LegacyImport_SanitizeValue_Entries = Lib_LegacyImport_SanitizeValue_Entry[];
export type Lib_LegacyImport_SanitizeValue_Index = number;
export type Lib_LegacyImport_SanitizeValue_Path = readonly string[];
export type Lib_LegacyImport_SanitizeValue_Returns = unknown;
export type Lib_LegacyImport_SanitizeValue_SanitizedArray = unknown[];
export type Lib_LegacyImport_SanitizeValue_SanitizedObject = Shared_JsonObject;
export type Lib_LegacyImport_SanitizeValue_SecretKey = string;
export type Lib_LegacyImport_SanitizeValue_Secrets = Lib_LegacyImport_ImportedSecret[];
export type Lib_LegacyImport_SanitizeValue_Value = unknown;

export type Lib_LegacyImport_TranslateLegacyXFeeds_Value = unknown;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Warnings = string[];
export type Lib_LegacyImport_TranslateLegacyXFeeds_Returns = Lib_LegacyImport_TranslateLegacyXFeeds_Configuration | undefined;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed_AccountId = string;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed_DestinationChannelId = string;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed_ExcludeReplies = boolean;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed_ExcludeReposts = boolean;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed_MessageTemplate = string;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed_Name = string;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feed = {
  accountId: Lib_LegacyImport_TranslateLegacyXFeeds_Feed_AccountId;
  destinationChannelId: Lib_LegacyImport_TranslateLegacyXFeeds_Feed_DestinationChannelId;
  excludeReplies: Lib_LegacyImport_TranslateLegacyXFeeds_Feed_ExcludeReplies;
  excludeReposts: Lib_LegacyImport_TranslateLegacyXFeeds_Feed_ExcludeReposts;
  messageTemplate: Lib_LegacyImport_TranslateLegacyXFeeds_Feed_MessageTemplate;
  name: Lib_LegacyImport_TranslateLegacyXFeeds_Feed_Name;
};
export type Lib_LegacyImport_TranslateLegacyXFeeds_Feeds = Lib_LegacyImport_TranslateLegacyXFeeds_Feed[];
export type Lib_LegacyImport_TranslateLegacyXFeeds_Configuration_Feeds = Lib_LegacyImport_TranslateLegacyXFeeds_Feeds;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Configuration_Provider = 'x';
export type Lib_LegacyImport_TranslateLegacyXFeeds_Configuration_SchemaVersion = 1;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Configuration = {
  feeds: Lib_LegacyImport_TranslateLegacyXFeeds_Configuration_Feeds;
  provider: Lib_LegacyImport_TranslateLegacyXFeeds_Configuration_Provider;
  schemaVersion: Lib_LegacyImport_TranslateLegacyXFeeds_Configuration_SchemaVersion;
};
export type Lib_LegacyImport_TranslateLegacyXFeeds_IgnoredEntryCount = number;
export type Lib_LegacyImport_TranslateLegacyXFeeds_AccountId = string | undefined;
export type Lib_LegacyImport_TranslateLegacyXFeeds_DestinationChannelId = string | undefined;
export type Lib_LegacyImport_TranslateLegacyXFeeds_ExcludeReplies = boolean;
export type Lib_LegacyImport_TranslateLegacyXFeeds_ExcludeReposts = boolean;
export type Lib_LegacyImport_TranslateLegacyXFeeds_Name = string;
export type Lib_LegacyImport_TranslateLegacyXFeeds_MessageTemplate = string;

export type Lib_LegacyImport_Test_StagedFeatureKeys = Shared_FeatureKey[];
