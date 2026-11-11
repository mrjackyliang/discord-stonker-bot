import type { Shared_FeatureKey, Shared_JsonObject } from '../shared.d.ts';

export type Lib_WorkerFeatures_DefaultDates = number[];
export type Lib_WorkerFeatures_DefaultDaysOfWeek = number[];
export type Lib_WorkerFeatures_DefaultHours = number[];
export type Lib_WorkerFeatures_DefaultMinutes = number[];
export type Lib_WorkerFeatures_DefaultMonths = number[];
export type Lib_WorkerFeatures_WeekdayNumbers = Readonly<Record<string, number>>;

export type Lib_WorkerFeatures_ChannelReference_ChannelIdentifier = string;
export type Lib_WorkerFeatures_ChannelReference = {
  'channel-id': Lib_WorkerFeatures_ChannelReference_ChannelIdentifier;
};

export type Lib_WorkerFeatures_ScheduleConfiguration_Dates = number[] | undefined;
export type Lib_WorkerFeatures_ScheduleConfiguration_DaysOfWeek = number[] | undefined;
export type Lib_WorkerFeatures_ScheduleConfiguration_Hours = number[] | undefined;
export type Lib_WorkerFeatures_ScheduleConfiguration_Minutes = number[] | undefined;
export type Lib_WorkerFeatures_ScheduleConfiguration_Months = number[] | undefined;
export type Lib_WorkerFeatures_ScheduleConfiguration_Seconds = number[];
export type Lib_WorkerFeatures_ScheduleConfiguration_TimeZone = string;
export type Lib_WorkerFeatures_ScheduleConfiguration = {
  'dates'?: Lib_WorkerFeatures_ScheduleConfiguration_Dates;
  'days-of-week'?: Lib_WorkerFeatures_ScheduleConfiguration_DaysOfWeek;
  'hours'?: Lib_WorkerFeatures_ScheduleConfiguration_Hours;
  'minutes'?: Lib_WorkerFeatures_ScheduleConfiguration_Minutes;
  'months'?: Lib_WorkerFeatures_ScheduleConfiguration_Months;
  'seconds': Lib_WorkerFeatures_ScheduleConfiguration_Seconds;
  'time-zone': Lib_WorkerFeatures_ScheduleConfiguration_TimeZone;
};

export type Lib_WorkerFeatures_PermissionTargetType = 'member' | 'role';
export type Lib_WorkerFeatures_PermissionConfiguration_TargetIdentifier = string;
export type Lib_WorkerFeatures_PermissionConfiguration_TargetType = Lib_WorkerFeatures_PermissionTargetType;
export type Lib_WorkerFeatures_PermissionConfiguration_UserOrRolePerms = Record<string, boolean>;
export type Lib_WorkerFeatures_PermissionConfiguration = {
  'target-type': Lib_WorkerFeatures_PermissionConfiguration_TargetType;
  'user-or-role-id': Lib_WorkerFeatures_PermissionConfiguration_TargetIdentifier;
  'user-or-role-perms': Lib_WorkerFeatures_PermissionConfiguration_UserOrRolePerms;
};
export type Lib_WorkerFeatures_PermissionToggleConfiguration_Channel = Lib_WorkerFeatures_ChannelReference;
export type Lib_WorkerFeatures_PermissionToggleConfiguration_Permissions = Lib_WorkerFeatures_PermissionConfiguration[];
export type Lib_WorkerFeatures_PermissionToggleConfiguration = {
  channel: Lib_WorkerFeatures_PermissionToggleConfiguration_Channel;
  permissions: Lib_WorkerFeatures_PermissionToggleConfiguration_Permissions;
};
export type Lib_WorkerFeatures_PermissionRuleConfiguration_Name = string;
export type Lib_WorkerFeatures_PermissionRuleConfiguration_SkipDates = string[] | undefined;
export type Lib_WorkerFeatures_PermissionRuleConfiguration_ToggleOn = Lib_WorkerFeatures_ScheduleConfiguration;
export type Lib_WorkerFeatures_PermissionRuleConfiguration_Toggles = Lib_WorkerFeatures_PermissionToggleConfiguration[];
export type Lib_WorkerFeatures_PermissionRuleConfiguration = {
  'name': Lib_WorkerFeatures_PermissionRuleConfiguration_Name;
  'skip-dates'?: Lib_WorkerFeatures_PermissionRuleConfiguration_SkipDates;
  'toggle-on': Lib_WorkerFeatures_PermissionRuleConfiguration_ToggleOn;
  'toggles': Lib_WorkerFeatures_PermissionRuleConfiguration_Toggles;
};

export type Lib_WorkerFeatures_SchedulePostConfiguration_Channel = Lib_WorkerFeatures_ChannelReference;
export type Lib_WorkerFeatures_SchedulePostConfiguration_Name = string;
export type Lib_WorkerFeatures_SchedulePostConfiguration_Payload_Content = string | undefined;
export type Lib_WorkerFeatures_SchedulePostConfiguration_Payload_Footer_Text = string;
export type Lib_WorkerFeatures_SchedulePostConfiguration_Payload_Footer = {
  text: Lib_WorkerFeatures_SchedulePostConfiguration_Payload_Footer_Text;
} | undefined;
export type Lib_WorkerFeatures_SchedulePostConfiguration_Payload = {
  content?: Lib_WorkerFeatures_SchedulePostConfiguration_Payload_Content;
  footer?: Lib_WorkerFeatures_SchedulePostConfiguration_Payload_Footer;
};
export type Lib_WorkerFeatures_SchedulePostConfiguration_Reactions = string[] | undefined;
export type Lib_WorkerFeatures_SchedulePostConfiguration_SendOn = Lib_WorkerFeatures_ScheduleConfiguration;
export type Lib_WorkerFeatures_SchedulePostConfiguration_SkipDates = string[] | undefined;
export type Lib_WorkerFeatures_SchedulePostConfiguration = {
  'channel': Lib_WorkerFeatures_SchedulePostConfiguration_Channel;
  'name': Lib_WorkerFeatures_SchedulePostConfiguration_Name;
  'payload': Lib_WorkerFeatures_SchedulePostConfiguration_Payload;
  'reactions'?: Lib_WorkerFeatures_SchedulePostConfiguration_Reactions;
  'send-on': Lib_WorkerFeatures_SchedulePostConfiguration_SendOn;
  'skip-dates'?: Lib_WorkerFeatures_SchedulePostConfiguration_SkipDates;
};

export type Lib_WorkerFeatures_Schedule_Dates = number[];
export type Lib_WorkerFeatures_Schedule_DaysOfWeek = number[];
export type Lib_WorkerFeatures_Schedule_Formatter = Intl.DateTimeFormat;
export type Lib_WorkerFeatures_Schedule_Hours = number[];
export type Lib_WorkerFeatures_Schedule_Minutes = number[];
export type Lib_WorkerFeatures_Schedule_Months = number[];
export type Lib_WorkerFeatures_Schedule_Seconds = number[];
export type Lib_WorkerFeatures_Schedule_TimeZone = string;
export type Lib_WorkerFeatures_Schedule = {
  dates: Lib_WorkerFeatures_Schedule_Dates;
  daysOfWeek: Lib_WorkerFeatures_Schedule_DaysOfWeek;
  formatter: Lib_WorkerFeatures_Schedule_Formatter;
  hours: Lib_WorkerFeatures_Schedule_Hours;
  minutes: Lib_WorkerFeatures_Schedule_Minutes;
  months: Lib_WorkerFeatures_Schedule_Months;
  seconds: Lib_WorkerFeatures_Schedule_Seconds;
  timeZone: Lib_WorkerFeatures_Schedule_TimeZone;
};

export type Lib_WorkerFeatures_SchedulePostRule_ChannelIdentifier = string;
export type Lib_WorkerFeatures_SchedulePostRule_Content = string | undefined;
export type Lib_WorkerFeatures_SchedulePostRule_FooterText = string | undefined;
export type Lib_WorkerFeatures_SchedulePostRule_Name = string;
export type Lib_WorkerFeatures_SchedulePostRule_Reactions = string[];
export type Lib_WorkerFeatures_SchedulePostRule_RuleIndex = number;
export type Lib_WorkerFeatures_SchedulePostRule_Schedule = Lib_WorkerFeatures_Schedule;
export type Lib_WorkerFeatures_SchedulePostRule_SkipDates = Set<string>;
export type Lib_WorkerFeatures_SchedulePostRule = {
  channelIdentifier: Lib_WorkerFeatures_SchedulePostRule_ChannelIdentifier;
  content: Lib_WorkerFeatures_SchedulePostRule_Content;
  footerText: Lib_WorkerFeatures_SchedulePostRule_FooterText;
  name: Lib_WorkerFeatures_SchedulePostRule_Name;
  reactions: Lib_WorkerFeatures_SchedulePostRule_Reactions;
  ruleIndex: Lib_WorkerFeatures_SchedulePostRule_RuleIndex;
  schedule: Lib_WorkerFeatures_SchedulePostRule_Schedule;
  skipDates: Lib_WorkerFeatures_SchedulePostRule_SkipDates;
};

export type Lib_WorkerFeatures_RssFeedConfiguration_AllowedUrls = string[] | undefined;
export type Lib_WorkerFeatures_RssFeedConfiguration_Channel = Lib_WorkerFeatures_ChannelReference;
export type Lib_WorkerFeatures_RssFeedConfiguration_FetchOn = Lib_WorkerFeatures_ScheduleConfiguration;
export type Lib_WorkerFeatures_RssFeedConfiguration_FollowRedirects = boolean;
export type Lib_WorkerFeatures_RssFeedConfiguration_Name = string;
export type Lib_WorkerFeatures_RssFeedConfiguration_Payload_Content = string;
export type Lib_WorkerFeatures_RssFeedConfiguration_Payload = {
  content: Lib_WorkerFeatures_RssFeedConfiguration_Payload_Content;
};
export type Lib_WorkerFeatures_RssFeedConfiguration_RemoveParameters = boolean;
export type Lib_WorkerFeatures_RssFeedConfiguration_Url = string;
export type Lib_WorkerFeatures_RssFeedConfiguration_UserAgent = string;
export type Lib_WorkerFeatures_RssFeedConfiguration = {
  'allowed-urls'?: Lib_WorkerFeatures_RssFeedConfiguration_AllowedUrls;
  'channel': Lib_WorkerFeatures_RssFeedConfiguration_Channel;
  'fetch-on': Lib_WorkerFeatures_RssFeedConfiguration_FetchOn;
  'follow-redirects': Lib_WorkerFeatures_RssFeedConfiguration_FollowRedirects;
  'name': Lib_WorkerFeatures_RssFeedConfiguration_Name;
  'payload': Lib_WorkerFeatures_RssFeedConfiguration_Payload;
  'remove-parameters': Lib_WorkerFeatures_RssFeedConfiguration_RemoveParameters;
  'url': Lib_WorkerFeatures_RssFeedConfiguration_Url;
  'user-agent': Lib_WorkerFeatures_RssFeedConfiguration_UserAgent;
};

export type Lib_WorkerFeatures_RssFeedRule_AllowedUrls = string[];
export type Lib_WorkerFeatures_RssFeedRule_ChannelIdentifier = string;
export type Lib_WorkerFeatures_RssFeedRule_FeedKey = string;
export type Lib_WorkerFeatures_RssFeedRule_FollowRedirects = boolean;
export type Lib_WorkerFeatures_RssFeedRule_MessageTemplate = string;
export type Lib_WorkerFeatures_RssFeedRule_Name = string;
export type Lib_WorkerFeatures_RssFeedRule_RemoveParameters = boolean;
export type Lib_WorkerFeatures_RssFeedRule_RuleIndex = number;
export type Lib_WorkerFeatures_RssFeedRule_Schedule = Lib_WorkerFeatures_Schedule;
export type Lib_WorkerFeatures_RssFeedRule_SkipDates = Set<string>;
export type Lib_WorkerFeatures_RssFeedRule_Url = string;
export type Lib_WorkerFeatures_RssFeedRule_UserAgent = string;
export type Lib_WorkerFeatures_RssFeedRule = {
  allowedUrls: Lib_WorkerFeatures_RssFeedRule_AllowedUrls;
  channelIdentifier: Lib_WorkerFeatures_RssFeedRule_ChannelIdentifier;
  feedKey: Lib_WorkerFeatures_RssFeedRule_FeedKey;
  followRedirects: Lib_WorkerFeatures_RssFeedRule_FollowRedirects;
  messageTemplate: Lib_WorkerFeatures_RssFeedRule_MessageTemplate;
  name: Lib_WorkerFeatures_RssFeedRule_Name;
  removeParameters: Lib_WorkerFeatures_RssFeedRule_RemoveParameters;
  ruleIndex: Lib_WorkerFeatures_RssFeedRule_RuleIndex;
  schedule: Lib_WorkerFeatures_RssFeedRule_Schedule;
  skipDates: Lib_WorkerFeatures_RssFeedRule_SkipDates;
  url: Lib_WorkerFeatures_RssFeedRule_Url;
  userAgent: Lib_WorkerFeatures_RssFeedRule_UserAgent;
};

export type Lib_WorkerFeatures_PermissionOverwrite_Allow = string;
export type Lib_WorkerFeatures_PermissionOverwrite_ChannelIdentifier = string;
export type Lib_WorkerFeatures_PermissionOverwrite_Deny = string;
export type Lib_WorkerFeatures_PermissionOverwrite_TargetIdentifier = string;
export type Lib_WorkerFeatures_PermissionOverwrite_TargetType = Lib_WorkerFeatures_PermissionTargetType;
export type Lib_WorkerFeatures_PermissionOverwrite = {
  allow: Lib_WorkerFeatures_PermissionOverwrite_Allow;
  channelIdentifier: Lib_WorkerFeatures_PermissionOverwrite_ChannelIdentifier;
  deny: Lib_WorkerFeatures_PermissionOverwrite_Deny;
  targetIdentifier: Lib_WorkerFeatures_PermissionOverwrite_TargetIdentifier;
  targetType: Lib_WorkerFeatures_PermissionOverwrite_TargetType;
};
export type Lib_WorkerFeatures_PermissionRule_Name = string;
export type Lib_WorkerFeatures_PermissionRule_Overwrites = Lib_WorkerFeatures_PermissionOverwrite[];
export type Lib_WorkerFeatures_PermissionRule_RuleIndex = number;
export type Lib_WorkerFeatures_PermissionRule_Schedule = Lib_WorkerFeatures_Schedule;
export type Lib_WorkerFeatures_PermissionRule_SkipDates = Set<string>;
export type Lib_WorkerFeatures_PermissionRule = {
  name: Lib_WorkerFeatures_PermissionRule_Name;
  overwrites: Lib_WorkerFeatures_PermissionRule_Overwrites;
  ruleIndex: Lib_WorkerFeatures_PermissionRule_RuleIndex;
  schedule: Lib_WorkerFeatures_PermissionRule_Schedule;
  skipDates: Lib_WorkerFeatures_PermissionRule_SkipDates;
};

export type Lib_WorkerFeatures_ScheduledRule =
  | Lib_WorkerFeatures_PermissionRule
  | Lib_WorkerFeatures_RssFeedRule
  | Lib_WorkerFeatures_SchedulePostRule;

export type Lib_WorkerFeatures_LocalDateParts_Date = string;
export type Lib_WorkerFeatures_LocalDateParts_Day = number;
export type Lib_WorkerFeatures_LocalDateParts_DayOfWeek = number;
export type Lib_WorkerFeatures_LocalDateParts_Hour = number;
export type Lib_WorkerFeatures_LocalDateParts_Minute = number;
export type Lib_WorkerFeatures_LocalDateParts_Month = number;
export type Lib_WorkerFeatures_LocalDateParts_Second = number;
export type Lib_WorkerFeatures_LocalDateParts_Year = string;
export type Lib_WorkerFeatures_LocalDateParts = {
  date: Lib_WorkerFeatures_LocalDateParts_Date;
  day: Lib_WorkerFeatures_LocalDateParts_Day;
  dayOfWeek: Lib_WorkerFeatures_LocalDateParts_DayOfWeek;
  hour: Lib_WorkerFeatures_LocalDateParts_Hour;
  minute: Lib_WorkerFeatures_LocalDateParts_Minute;
  month: Lib_WorkerFeatures_LocalDateParts_Month;
  second: Lib_WorkerFeatures_LocalDateParts_Second;
  year: Lib_WorkerFeatures_LocalDateParts_Year;
};

export type Lib_WorkerFeatures_ScheduledJob_DedupeKey = string;
export type Lib_WorkerFeatures_ScheduledJob_Payload = Shared_JsonObject;
export type Lib_WorkerFeatures_ScheduledJob_Type = string;
export type Lib_WorkerFeatures_ScheduledJob = {
  dedupeKey: Lib_WorkerFeatures_ScheduledJob_DedupeKey;
  payload: Lib_WorkerFeatures_ScheduledJob_Payload;
  type: Lib_WorkerFeatures_ScheduledJob_Type;
};

export type Lib_WorkerFeatures_JobCollector_GuildIdentifier = string;
export type Lib_WorkerFeatures_JobCollector_Instants = Date[];
export type Lib_WorkerFeatures_JobCollector_Returns = Lib_WorkerFeatures_ScheduledJob[];
export type Lib_WorkerFeatures_JobCollector = (
  guildIdentifier: Lib_WorkerFeatures_JobCollector_GuildIdentifier,
  instants: Lib_WorkerFeatures_JobCollector_Instants,
) => Lib_WorkerFeatures_JobCollector_Returns;

export type Lib_WorkerFeatures_Prepared_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_WorkerFeatures_Prepared_CollectJobs = Lib_WorkerFeatures_JobCollector;
export type Lib_WorkerFeatures_Prepared_ConfigurationErrors = string[];
export type Lib_WorkerFeatures_Prepared = {
  activeFeatureKeys: Lib_WorkerFeatures_Prepared_ActiveFeatureKeys;
  collectJobs: Lib_WorkerFeatures_Prepared_CollectJobs;
  configurationErrors: Lib_WorkerFeatures_Prepared_ConfigurationErrors;
};

export type Lib_WorkerFeatures_DiscordMessageJobPayload_ChannelIdentifier = string;
export type Lib_WorkerFeatures_DiscordMessageJobPayload_Content = string;
export type Lib_WorkerFeatures_DiscordMessageJobPayload_GuildIdentifier = string;
export type Lib_WorkerFeatures_DiscordMessageJobPayload_MessageIdentifier = string | undefined;
export type Lib_WorkerFeatures_DiscordMessageJobPayload_Reactions = string[];
export type Lib_WorkerFeatures_DiscordMessageJobPayload_RuleName = string;
export type Lib_WorkerFeatures_DiscordMessageJobPayload = {
  channelIdentifier: Lib_WorkerFeatures_DiscordMessageJobPayload_ChannelIdentifier;
  content: Lib_WorkerFeatures_DiscordMessageJobPayload_Content;
  guildIdentifier: Lib_WorkerFeatures_DiscordMessageJobPayload_GuildIdentifier;
  messageIdentifier?: Lib_WorkerFeatures_DiscordMessageJobPayload_MessageIdentifier;
  reactions: Lib_WorkerFeatures_DiscordMessageJobPayload_Reactions;
  ruleName: Lib_WorkerFeatures_DiscordMessageJobPayload_RuleName;
};

export type Lib_WorkerFeatures_DiscordMessageResponse_Identifier = string;
export type Lib_WorkerFeatures_DiscordMessageResponse = {
  id: Lib_WorkerFeatures_DiscordMessageResponse_Identifier;
};

export type Lib_WorkerFeatures_DiscordPermissionJobPayload_GuildIdentifier = string;
export type Lib_WorkerFeatures_DiscordPermissionJobPayload_Name = string;
export type Lib_WorkerFeatures_DiscordPermissionJobPayload_Overwrites = Lib_WorkerFeatures_PermissionOverwrite[];
export type Lib_WorkerFeatures_DiscordPermissionJobPayload = {
  guildIdentifier: Lib_WorkerFeatures_DiscordPermissionJobPayload_GuildIdentifier;
  name: Lib_WorkerFeatures_DiscordPermissionJobPayload_Name;
  overwrites: Lib_WorkerFeatures_DiscordPermissionJobPayload_Overwrites;
};

export type Lib_WorkerFeatures_RssFetchJobPayload_AllowedUrls = string[];
export type Lib_WorkerFeatures_RssFetchJobPayload_ChannelIdentifier = string;
export type Lib_WorkerFeatures_RssFetchJobPayload_FeedKey = string;
export type Lib_WorkerFeatures_RssFetchJobPayload_FollowRedirects = boolean;
export type Lib_WorkerFeatures_RssFetchJobPayload_GuildIdentifier = string;
export type Lib_WorkerFeatures_RssFetchJobPayload_MessageTemplate = string;
export type Lib_WorkerFeatures_RssFetchJobPayload_Name = string;
export type Lib_WorkerFeatures_RssFetchJobPayload_RemoveParameters = boolean;
export type Lib_WorkerFeatures_RssFetchJobPayload_Url = string;
export type Lib_WorkerFeatures_RssFetchJobPayload_UserAgent = string;
export type Lib_WorkerFeatures_RssFetchJobPayload = {
  allowedUrls: Lib_WorkerFeatures_RssFetchJobPayload_AllowedUrls;
  channelIdentifier: Lib_WorkerFeatures_RssFetchJobPayload_ChannelIdentifier;
  feedKey: Lib_WorkerFeatures_RssFetchJobPayload_FeedKey;
  followRedirects: Lib_WorkerFeatures_RssFetchJobPayload_FollowRedirects;
  guildIdentifier: Lib_WorkerFeatures_RssFetchJobPayload_GuildIdentifier;
  messageTemplate: Lib_WorkerFeatures_RssFetchJobPayload_MessageTemplate;
  name: Lib_WorkerFeatures_RssFetchJobPayload_Name;
  removeParameters: Lib_WorkerFeatures_RssFetchJobPayload_RemoveParameters;
  url: Lib_WorkerFeatures_RssFetchJobPayload_Url;
  userAgent: Lib_WorkerFeatures_RssFetchJobPayload_UserAgent;
};

export type Lib_WorkerFeatures_CompileRssFeedRule_Configuration = Lib_WorkerFeatures_RssFeedConfiguration;
export type Lib_WorkerFeatures_CompileRssFeedRule_RuleIndex = number;
export type Lib_WorkerFeatures_CompileRssFeedRule_Returns = Lib_WorkerFeatures_RssFeedRule;
export type Lib_WorkerFeatures_CompileRssFeedRule_Formatter = Intl.DateTimeFormat;
export type Lib_WorkerFeatures_CompileRssFeedRule_FeedKey = string;

export type Lib_WorkerFeatures_CompileRssFeeds_Configuration = unknown;
export type Lib_WorkerFeatures_CompileRssFeeds_Returns = Lib_WorkerFeatures_RssFeedRule[];
export type Lib_WorkerFeatures_CompileRssFeeds_Parsed = Lib_WorkerFeatures_RssFeedConfiguration[];

export type Lib_WorkerFeatures_CompilePermissionOverwrite_ChannelIdentifier = string;
export type Lib_WorkerFeatures_CompilePermissionOverwrite_Permission = Lib_WorkerFeatures_PermissionConfiguration;
export type Lib_WorkerFeatures_CompilePermissionOverwrite_Returns = Lib_WorkerFeatures_PermissionOverwrite;
export type Lib_WorkerFeatures_CompilePermissionOverwrite_Allow = bigint;
export type Lib_WorkerFeatures_CompilePermissionOverwrite_Deny = bigint;
export type Lib_WorkerFeatures_CompilePermissionOverwrite_Entries = Array<[string, boolean]>;
export type Lib_WorkerFeatures_CompilePermissionOverwrite_FlagValue = unknown;

export type Lib_WorkerFeatures_CompilePermissionRule_Configuration = Lib_WorkerFeatures_PermissionRuleConfiguration;
export type Lib_WorkerFeatures_CompilePermissionRule_RuleIndex = number;
export type Lib_WorkerFeatures_CompilePermissionRule_Returns = Lib_WorkerFeatures_PermissionRule;
export type Lib_WorkerFeatures_CompilePermissionRule_Formatter = Intl.DateTimeFormat;
export type Lib_WorkerFeatures_CompilePermissionRule_Overwrites = Lib_WorkerFeatures_PermissionOverwrite[];

export type Lib_WorkerFeatures_CompilePermissionRules_Configuration = unknown;
export type Lib_WorkerFeatures_CompilePermissionRules_Returns = Lib_WorkerFeatures_PermissionRule[];
export type Lib_WorkerFeatures_CompilePermissionRules_Parsed = Lib_WorkerFeatures_PermissionRuleConfiguration[];

export type Lib_WorkerFeatures_CompileSchedulePostRule_Configuration = Lib_WorkerFeatures_SchedulePostConfiguration;
export type Lib_WorkerFeatures_CompileSchedulePostRule_RuleIndex = number;
export type Lib_WorkerFeatures_CompileSchedulePostRule_Returns = Lib_WorkerFeatures_SchedulePostRule;
export type Lib_WorkerFeatures_CompileSchedulePostRule_Formatter = Intl.DateTimeFormat;

export type Lib_WorkerFeatures_CompileSchedulePosts_Configuration = unknown;
export type Lib_WorkerFeatures_CompileSchedulePosts_Returns = Lib_WorkerFeatures_SchedulePostRule[];
export type Lib_WorkerFeatures_CompileSchedulePosts_Parsed = Lib_WorkerFeatures_SchedulePostConfiguration[];

export type Lib_WorkerFeatures_CreateJobCollector_RssRules = Lib_WorkerFeatures_RssFeedRule[];
export type Lib_WorkerFeatures_CreateJobCollector_ScheduleRules = Lib_WorkerFeatures_SchedulePostRule[];
export type Lib_WorkerFeatures_CreateJobCollector_PermissionRules = Lib_WorkerFeatures_PermissionRule[];
export type Lib_WorkerFeatures_CreateJobCollector_Returns = Lib_WorkerFeatures_JobCollector;

export type Lib_WorkerFeatures_CreatePermissionJob_Rule = Lib_WorkerFeatures_PermissionRule;
export type Lib_WorkerFeatures_CreatePermissionJob_GuildIdentifier = string;
export type Lib_WorkerFeatures_CreatePermissionJob_Instant = Date;
export type Lib_WorkerFeatures_CreatePermissionJob_Returns = Lib_WorkerFeatures_ScheduledJob;
export type Lib_WorkerFeatures_CreatePermissionJob_Payload = Shared_JsonObject;

export type Lib_WorkerFeatures_CreateRssFetchJob_Rule = Lib_WorkerFeatures_RssFeedRule;
export type Lib_WorkerFeatures_CreateRssFetchJob_GuildIdentifier = string;
export type Lib_WorkerFeatures_CreateRssFetchJob_Instant = Date;
export type Lib_WorkerFeatures_CreateRssFetchJob_Returns = Lib_WorkerFeatures_ScheduledJob;
export type Lib_WorkerFeatures_CreateRssFetchJob_Payload = Shared_JsonObject;

export type Lib_WorkerFeatures_CreateScheduledJob_Rule = Lib_WorkerFeatures_SchedulePostRule;
export type Lib_WorkerFeatures_CreateScheduledJob_GuildIdentifier = string;
export type Lib_WorkerFeatures_CreateScheduledJob_Instant = Date;
export type Lib_WorkerFeatures_CreateScheduledJob_Returns = Lib_WorkerFeatures_ScheduledJob;
export type Lib_WorkerFeatures_CreateScheduledJob_LocalParts = Lib_WorkerFeatures_LocalDateParts;
export type Lib_WorkerFeatures_CreateScheduledJob_Content = string;
export type Lib_WorkerFeatures_CreateScheduledJob_Payload = Shared_JsonObject;

export type Lib_WorkerFeatures_FormatConfigurationError_Error = unknown;
export type Lib_WorkerFeatures_FormatConfigurationError_Returns = string;
export type Lib_WorkerFeatures_FormatConfigurationError_Messages = string[];

export type Lib_WorkerFeatures_FormatScheduledContent_Rule = Lib_WorkerFeatures_SchedulePostRule;
export type Lib_WorkerFeatures_FormatScheduledContent_LocalParts = Lib_WorkerFeatures_LocalDateParts;
export type Lib_WorkerFeatures_FormatScheduledContent_Returns = string;
export type Lib_WorkerFeatures_FormatScheduledContent_Parts = string[];

export type Lib_WorkerFeatures_GetEnabledFeature_Settings = Shared_JsonObject;
export type Lib_WorkerFeatures_GetEnabledFeature_FeatureKey = Shared_FeatureKey;
export type Lib_WorkerFeatures_GetEnabledFeature_Returns = Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_WorkerFeatures_GetEnabledFeature_Features = Record<string, unknown>;
export type Lib_WorkerFeatures_GetEnabledFeature_RawFeature = unknown;
export type Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature_Configuration = unknown;
export type Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature = {
  configuration: Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature_Configuration;
};

export type Lib_WorkerFeatures_GetLocalDateParts_Rule = Lib_WorkerFeatures_ScheduledRule;
export type Lib_WorkerFeatures_GetLocalDateParts_Instant = Date;
export type Lib_WorkerFeatures_GetLocalDateParts_Returns = Lib_WorkerFeatures_LocalDateParts;
export type Lib_WorkerFeatures_GetLocalDateParts_FormattedParts = Intl.DateTimeFormatPart[];
export type Lib_WorkerFeatures_GetLocalDateParts_Parts = Record<string, string>;
export type Lib_WorkerFeatures_GetLocalDateParts_Weekday = string | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_DayOfWeek = number | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_Year = string | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_Month = string | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_Day = string | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_Hour = string | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_Minute = string | undefined;
export type Lib_WorkerFeatures_GetLocalDateParts_Second = string | undefined;

export type Lib_WorkerFeatures_IsRecord_Value = unknown;
export type Lib_WorkerFeatures_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_WorkerFeatures_IsTimeZoneValid_TimeZone = string;
export type Lib_WorkerFeatures_IsTimeZoneValid_Returns = boolean;

export type Lib_WorkerFeatures_MatchesSchedule_Rule = Lib_WorkerFeatures_ScheduledRule;
export type Lib_WorkerFeatures_MatchesSchedule_Instant = Date;
export type Lib_WorkerFeatures_MatchesSchedule_Returns = boolean;
export type Lib_WorkerFeatures_MatchesSchedule_LocalParts = Lib_WorkerFeatures_LocalDateParts;

export type Lib_WorkerFeatures_ParseDiscordMessageJob_Payload = Shared_JsonObject;
export type Lib_WorkerFeatures_ParseDiscordMessageJob_Returns = Lib_WorkerFeatures_DiscordMessageJobPayload;

export type Lib_WorkerFeatures_ParseDiscordMessageResponse_Response = unknown;
export type Lib_WorkerFeatures_ParseDiscordMessageResponse_Returns = Lib_WorkerFeatures_DiscordMessageResponse;

export type Lib_WorkerFeatures_ParseDiscordPermissionJob_Payload = Shared_JsonObject;
export type Lib_WorkerFeatures_ParseDiscordPermissionJob_Returns = Lib_WorkerFeatures_DiscordPermissionJobPayload;

export type Lib_WorkerFeatures_ParseRssFetchJob_Payload = Shared_JsonObject;
export type Lib_WorkerFeatures_ParseRssFetchJob_Returns = Lib_WorkerFeatures_RssFetchJobPayload;

export type Lib_WorkerFeatures_PrepareWorkerFeatures_Settings = Shared_JsonObject;
export type Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = Lib_WorkerFeatures_Prepared;
export type Lib_WorkerFeatures_PrepareWorkerFeatures_ActiveFeatureKeys = Shared_FeatureKey[];
export type Lib_WorkerFeatures_PrepareWorkerFeatures_ConfigurationErrors = string[];
export type Lib_WorkerFeatures_PrepareWorkerFeatures_PermissionFeature = Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_WorkerFeatures_PrepareWorkerFeatures_PermissionRules = Lib_WorkerFeatures_PermissionRule[];
export type Lib_WorkerFeatures_PrepareWorkerFeatures_RssFeature = Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_WorkerFeatures_PrepareWorkerFeatures_RssRules = Lib_WorkerFeatures_RssFeedRule[];
export type Lib_WorkerFeatures_PrepareWorkerFeatures_ScheduleFeature = Lib_WorkerFeatures_GetEnabledFeature_EnabledFeature | undefined;
export type Lib_WorkerFeatures_PrepareWorkerFeatures_ScheduleRules = Lib_WorkerFeatures_SchedulePostRule[];

export type Lib_WorkerFeatures_IsSafeHttpsUrl_Value = string;
export type Lib_WorkerFeatures_IsSafeHttpsUrl_Returns = boolean;
export type Lib_WorkerFeatures_IsSafeHttpsUrl_Url = URL;
