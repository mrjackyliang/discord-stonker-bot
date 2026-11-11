import { createHash } from 'node:crypto';

import { PermissionFlagsBits } from 'discord.js';
import { z } from 'zod';

import { applicationUserAgent } from './application-metadata.js';
import { getErrorMessage } from './logger.js';
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_UNSIGNED_INTEGER,
} from './regex.js';

import type {
  Lib_WorkerFeatures_CompilePermissionOverwrite_Allow,
  Lib_WorkerFeatures_CompilePermissionOverwrite_ChannelIdentifier,
  Lib_WorkerFeatures_CompilePermissionOverwrite_Deny,
  Lib_WorkerFeatures_CompilePermissionOverwrite_Entries,
  Lib_WorkerFeatures_CompilePermissionOverwrite_FlagValue,
  Lib_WorkerFeatures_CompilePermissionOverwrite_Permission,
  Lib_WorkerFeatures_CompilePermissionOverwrite_Returns,
  Lib_WorkerFeatures_CompilePermissionRule_Configuration,
  Lib_WorkerFeatures_CompilePermissionRule_Formatter,
  Lib_WorkerFeatures_CompilePermissionRule_Overwrites,
  Lib_WorkerFeatures_CompilePermissionRule_Returns,
  Lib_WorkerFeatures_CompilePermissionRule_RuleIndex,
  Lib_WorkerFeatures_CompilePermissionRules_Configuration,
  Lib_WorkerFeatures_CompilePermissionRules_Parsed,
  Lib_WorkerFeatures_CompilePermissionRules_Returns,
  Lib_WorkerFeatures_CompileRssFeedRule_Configuration,
  Lib_WorkerFeatures_CompileRssFeedRule_FeedKey,
  Lib_WorkerFeatures_CompileRssFeedRule_Formatter,
  Lib_WorkerFeatures_CompileRssFeedRule_Returns,
  Lib_WorkerFeatures_CompileRssFeedRule_RuleIndex,
  Lib_WorkerFeatures_CompileRssFeeds_Configuration,
  Lib_WorkerFeatures_CompileRssFeeds_Parsed,
  Lib_WorkerFeatures_CompileRssFeeds_Returns,
  Lib_WorkerFeatures_CompileSchedulePostRule_Configuration,
  Lib_WorkerFeatures_CompileSchedulePostRule_Formatter,
  Lib_WorkerFeatures_CompileSchedulePostRule_Returns,
  Lib_WorkerFeatures_CompileSchedulePostRule_RuleIndex,
  Lib_WorkerFeatures_CompileSchedulePosts_Configuration,
  Lib_WorkerFeatures_CompileSchedulePosts_Parsed,
  Lib_WorkerFeatures_CompileSchedulePosts_Returns,
  Lib_WorkerFeatures_CreateJobCollector_PermissionRules,
  Lib_WorkerFeatures_CreateJobCollector_Returns,
  Lib_WorkerFeatures_CreateJobCollector_RssRules,
  Lib_WorkerFeatures_CreateJobCollector_ScheduleRules,
  Lib_WorkerFeatures_CreatePermissionJob_GuildIdentifier,
  Lib_WorkerFeatures_CreatePermissionJob_Instant,
  Lib_WorkerFeatures_CreatePermissionJob_Payload,
  Lib_WorkerFeatures_CreatePermissionJob_Returns,
  Lib_WorkerFeatures_CreatePermissionJob_Rule,
  Lib_WorkerFeatures_CreateRssFetchJob_GuildIdentifier,
  Lib_WorkerFeatures_CreateRssFetchJob_Instant,
  Lib_WorkerFeatures_CreateRssFetchJob_Payload,
  Lib_WorkerFeatures_CreateRssFetchJob_Returns,
  Lib_WorkerFeatures_CreateRssFetchJob_Rule,
  Lib_WorkerFeatures_CreateScheduledJob_Content,
  Lib_WorkerFeatures_CreateScheduledJob_GuildIdentifier,
  Lib_WorkerFeatures_CreateScheduledJob_Instant,
  Lib_WorkerFeatures_CreateScheduledJob_LocalParts,
  Lib_WorkerFeatures_CreateScheduledJob_Payload,
  Lib_WorkerFeatures_CreateScheduledJob_Returns,
  Lib_WorkerFeatures_CreateScheduledJob_Rule,
  Lib_WorkerFeatures_DefaultDates,
  Lib_WorkerFeatures_DefaultDaysOfWeek,
  Lib_WorkerFeatures_DefaultHours,
  Lib_WorkerFeatures_DefaultMinutes,
  Lib_WorkerFeatures_DefaultMonths,
  Lib_WorkerFeatures_FormatConfigurationError_Error,
  Lib_WorkerFeatures_FormatConfigurationError_Messages,
  Lib_WorkerFeatures_FormatConfigurationError_Returns,
  Lib_WorkerFeatures_FormatScheduledContent_LocalParts,
  Lib_WorkerFeatures_FormatScheduledContent_Parts,
  Lib_WorkerFeatures_FormatScheduledContent_Returns,
  Lib_WorkerFeatures_FormatScheduledContent_Rule,
  Lib_WorkerFeatures_GetEnabledFeature_FeatureKey,
  Lib_WorkerFeatures_GetEnabledFeature_Features,
  Lib_WorkerFeatures_GetEnabledFeature_RawFeature,
  Lib_WorkerFeatures_GetEnabledFeature_Returns,
  Lib_WorkerFeatures_GetEnabledFeature_Settings,
  Lib_WorkerFeatures_GetLocalDateParts_Day,
  Lib_WorkerFeatures_GetLocalDateParts_DayOfWeek,
  Lib_WorkerFeatures_GetLocalDateParts_FormattedParts,
  Lib_WorkerFeatures_GetLocalDateParts_Hour,
  Lib_WorkerFeatures_GetLocalDateParts_Instant,
  Lib_WorkerFeatures_GetLocalDateParts_Minute,
  Lib_WorkerFeatures_GetLocalDateParts_Month,
  Lib_WorkerFeatures_GetLocalDateParts_Parts,
  Lib_WorkerFeatures_GetLocalDateParts_Returns,
  Lib_WorkerFeatures_GetLocalDateParts_Rule,
  Lib_WorkerFeatures_GetLocalDateParts_Second,
  Lib_WorkerFeatures_GetLocalDateParts_Weekday,
  Lib_WorkerFeatures_GetLocalDateParts_Year,
  Lib_WorkerFeatures_IsRecord_TypeGuard,
  Lib_WorkerFeatures_IsRecord_Value,
  Lib_WorkerFeatures_IsSafeHttpsUrl_Returns,
  Lib_WorkerFeatures_IsSafeHttpsUrl_Url,
  Lib_WorkerFeatures_IsSafeHttpsUrl_Value,
  Lib_WorkerFeatures_IsTimeZoneValid_Returns,
  Lib_WorkerFeatures_IsTimeZoneValid_TimeZone,
  Lib_WorkerFeatures_MatchesSchedule_Instant,
  Lib_WorkerFeatures_MatchesSchedule_LocalParts,
  Lib_WorkerFeatures_MatchesSchedule_Returns,
  Lib_WorkerFeatures_MatchesSchedule_Rule,
  Lib_WorkerFeatures_ParseDiscordMessageJob_Payload,
  Lib_WorkerFeatures_ParseDiscordMessageJob_Returns,
  Lib_WorkerFeatures_ParseDiscordMessageResponse_Response,
  Lib_WorkerFeatures_ParseDiscordMessageResponse_Returns,
  Lib_WorkerFeatures_ParseDiscordPermissionJob_Payload,
  Lib_WorkerFeatures_ParseDiscordPermissionJob_Returns,
  Lib_WorkerFeatures_ParseRssFetchJob_Payload,
  Lib_WorkerFeatures_ParseRssFetchJob_Returns,
  Lib_WorkerFeatures_PrepareWorkerFeatures_ActiveFeatureKeys,
  Lib_WorkerFeatures_PrepareWorkerFeatures_ConfigurationErrors,
  Lib_WorkerFeatures_PrepareWorkerFeatures_PermissionFeature,
  Lib_WorkerFeatures_PrepareWorkerFeatures_PermissionRules,
  Lib_WorkerFeatures_PrepareWorkerFeatures_Returns,
  Lib_WorkerFeatures_PrepareWorkerFeatures_RssFeature,
  Lib_WorkerFeatures_PrepareWorkerFeatures_RssRules,
  Lib_WorkerFeatures_PrepareWorkerFeatures_ScheduleFeature,
  Lib_WorkerFeatures_PrepareWorkerFeatures_ScheduleRules,
  Lib_WorkerFeatures_PrepareWorkerFeatures_Settings,
  Lib_WorkerFeatures_WeekdayNumbers,
} from '../types/lib/worker-features.d.ts';

/**
 * Worker Features - Default Dates.
 *
 * Supplies every valid calendar date when the archived cron field is absent.
 * Invalid dates naturally never appear in Intl output for shorter months.
 *
 * @since 4.0.0
 */
const defaultDates: Lib_WorkerFeatures_DefaultDates = Array.from({ length: 31 }, (_value, index) => index + 1);

/**
 * Worker Features - Default Days Of Week.
 *
 * Supplies every cron-compatible weekday when the archived field is absent.
 * Sunday remains zero for backward compatibility.
 *
 * @since 4.0.0
 */
const defaultDaysOfWeek: Lib_WorkerFeatures_DefaultDaysOfWeek = Array.from({ length: 7 }, (_value, index) => index);

/**
 * Worker Features - Default Hours.
 *
 * Supplies all hours in the configured local time zone when omitted.
 * Values use the 24-hour range consumed by the matcher.
 *
 * @since 4.0.0
 */
const defaultHours: Lib_WorkerFeatures_DefaultHours = Array.from({ length: 24 }, (_value, index) => index);

/**
 * Worker Features - Default Minutes.
 *
 * Supplies every minute when the archived cron field is absent.
 * Omitted seconds still default separately to zero.
 *
 * @since 4.0.0
 */
const defaultMinutes: Lib_WorkerFeatures_DefaultMinutes = Array.from({ length: 60 }, (_value, index) => index);

/**
 * Worker Features - Default Months.
 *
 * Supplies all Gregorian months when the archived cron field is absent.
 * Month values remain one-based like the legacy configuration.
 *
 * @since 4.0.0
 */
const defaultMonths: Lib_WorkerFeatures_DefaultMonths = Array.from({ length: 12 }, (_value, index) => index + 1);

/**
 * Worker Features - Weekday Numbers.
 *
 * Maps stable English short weekday labels from Intl to cron-compatible values.
 * Sunday remains zero to preserve the archived configuration contract.
 *
 * @since 4.0.0
 */
const weekdayNumbers: Lib_WorkerFeatures_WeekdayNumbers = {
  Fri: 5,
  Mon: 1,
  Sat: 6,
  Sun: 0,
  Thu: 4,
  Tue: 2,
  Wed: 3,
};

/**
 * Worker Features - Calendar Schedule Schema.
 *
 * Preserves the archived cron-style calendar fields while validating bounded
 * ranges and supported IANA time-zone identifiers once during compilation.
 *
 * @since 4.0.0
 */
const calendarScheduleSchema = z.object({
  'dates': z.array(z.number().int().min(1).max(31)).min(1).max(31).optional(),
  'days-of-week': z.array(z.number().int().min(0).max(6)).min(1).max(7).optional(),
  'hours': z.array(z.number().int().min(0).max(23)).min(1).max(24).optional(),
  'minutes': z.array(z.number().int().min(0).max(59)).min(1).max(60).optional(),
  'months': z.array(z.number().int().min(1).max(12)).min(1).max(12).optional(),
  'seconds': z.array(z.number().int().min(0).max(59)).min(1).max(60).default([0]),
  'time-zone': z.string().trim().min(1).max(100).default('UTC').refine(
    (timeZone) => isTimeZoneValid(timeZone),
    'Time zone must be a supported IANA identifier.',
  ),
});

/**
 * Worker Features - Permission Map Schema.
 *
 * Accepts only Discord permission names that resolve to current bit flags.
 * Each overwrite stays non-empty and bounded before any job is queued.
 *
 * @since 4.0.0
 */
const permissionMapSchema = z.record(z.string().min(1).max(100), z.boolean())
  .refine(
    (permissions) => Object.keys(permissions).length >= 1 && Object.keys(permissions).length <= 50,
    'One to fifty permission values are required.',
  )
  .refine(
    (permissions) => Object.keys(permissions).every(
      (permissionName) => typeof Reflect.get(PermissionFlagsBits, permissionName) === 'bigint',
    ),
    'Every permission name must be supported by the current Discord API.',
  );

/**
 * Worker Features - Permission Rules Schema.
 *
 * Requires explicit role or member target types for every scheduled overwrite.
 * Legacy ambiguous targets fail closed until an operator classifies them.
 *
 * @since 4.0.0
 */
export const permissionRulesSchema = z.array(z.object({
  'name': z.string().trim().min(1).max(100),
  'skip-dates': z.array(z.iso.date()).max(366).optional(),
  'toggle-on': calendarScheduleSchema,
  'toggles': z.array(z.object({
    channel: z.object({
      'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    }),
    permissions: z.array(z.object({
      'target-type': z.enum([
        'member',
        'role',
      ]),
      'user-or-role-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
      'user-or-role-perms': permissionMapSchema,
    })).min(1).max(25),
  })).min(1).max(25),
})).min(1).max(100);

/**
 * Worker Features - Schedule Posts Schema.
 *
 * Bounds message payloads, reactions, calendar selectors, and IANA time zones
 * before any work can enter the durable queue.
 *
 * @since 4.0.0
 */
export const schedulePostsSchema = z.array(z.object({
  'channel': z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  'name': z.string().trim().min(1).max(100),
  'payload': z.object({
    content: z.string().trim().min(1).max(2_000).optional(),
    footer: z.object({
      text: z.string().trim().min(1).max(1_000),
    }).optional(),
  }).refine(
    (payload) => payload['content'] !== undefined || payload['footer'] !== undefined,
    'A scheduled post needs content or footer text.',
  ),
  'reactions': z.array(z.string().trim().min(1).max(100)).max(20).optional(),
  'send-on': calendarScheduleSchema,
  'skip-dates': z.array(z.iso.date()).max(366).optional(),
})).min(1).max(100);

/**
 * Worker Features - Rss Feeds Schema.
 *
 * Bounds HTTPS feed sources, allowlisted item routes, polling schedules, and
 * text-only Discord templates before durable fetch jobs are created.
 *
 * @since 4.0.0
 */
export const rssFeedsSchema = z.array(z.object({
  'allowed-urls': z.array(z.url().refine(
    (value) => isSafeHttpsUrl(value),
    'Allowed item URL must use HTTPS without embedded credentials.',
  )).min(1).max(100).optional(),
  'channel': z.object({
    'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  }),
  'fetch-on': calendarScheduleSchema,
  'follow-redirects': z.boolean().default(false),
  'name': z.string().trim().min(1).max(100),
  'payload': z.object({
    content: z.string().trim().min(1).max(2_000),
  }),
  'remove-parameters': z.boolean().default(true),
  'url': z.url().refine(
    (value) => isSafeHttpsUrl(value),
    'Feed URL must use HTTPS without embedded credentials.',
  ),
  'user-agent': z.string().trim().min(1).max(200).default(applicationUserAgent),
})).min(1).max(100);

/**
 * Worker Features - Discord Message Job Schema.
 *
 * Revalidates durable queue payloads before a worker can call Discord. Jobs are
 * untrusted database input even when the scheduler originally created them.
 *
 * @since 4.0.0
 */
const discordMessageJobSchema = z.object({
  channelIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  content: z.string().trim().min(1).max(2_000),
  guildIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  messageIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER).optional(),
  reactions: z.array(z.string().trim().min(1).max(100)).max(20),
  ruleName: z.string().trim().min(1).max(100),
});

/**
 * Worker Features - Discord Message Response Schema.
 *
 * Narrows Discord's unknown REST response to the message identifier required by
 * follow-up reaction routes.
 *
 * @since 4.0.0
 */
const discordMessageResponseSchema = z.object({
  id: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
});

/**
 * Worker Features - Discord Permission Job Schema.
 *
 * Revalidates bounded overwrite payloads immediately before Discord REST calls.
 * Bit fields remain decimal strings so PostgreSQL JSON never loses precision.
 *
 * @since 4.0.0
 */
const discordPermissionJobSchema = z.object({
  guildIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  name: z.string().trim().min(1).max(100),
  overwrites: z.array(z.object({
    allow: z.string().regex(LIB_REGEX_PATTERN_UNSIGNED_INTEGER),
    channelIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    deny: z.string().regex(LIB_REGEX_PATTERN_UNSIGNED_INTEGER),
    targetIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    targetType: z.enum([
      'member',
      'role',
    ]),
  })).min(1).max(625),
});

/**
 * Worker Features - Rss Fetch Job Schema.
 *
 * Revalidates durable feed jobs before outbound network requests and strips any
 * unknown database properties from the worker's runtime shape.
 *
 * @since 4.0.0
 */
const rssFetchJobSchema = z.object({
  allowedUrls: z.array(z.url().refine((value) => isSafeHttpsUrl(value))).max(100),
  channelIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  feedKey: z.string().length(64),
  followRedirects: z.boolean(),
  guildIdentifier: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
  messageTemplate: z.string().trim().min(1).max(2_000),
  name: z.string().trim().min(1).max(100),
  removeParameters: z.boolean(),
  url: z.url().refine((value) => isSafeHttpsUrl(value)),
  userAgent: z.string().trim().min(1).max(200),
});

/**
 * Worker Features - Compile Permission Overwrite.
 *
 * Converts named permission decisions into precision-safe allow and deny fields.
 * Explicit target types prevent role and member identifiers from being confused.
 *
 * @param {Lib_WorkerFeatures_CompilePermissionOverwrite_ChannelIdentifier} channelIdentifier - Channel identifier.
 * @param {Lib_WorkerFeatures_CompilePermissionOverwrite_Permission}        permission        - Permission.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompilePermissionOverwrite_Returns}
 *
 * @since 4.0.0
 */
function compilePermissionOverwrite(
  channelIdentifier: Lib_WorkerFeatures_CompilePermissionOverwrite_ChannelIdentifier,
  permission: Lib_WorkerFeatures_CompilePermissionOverwrite_Permission,
): Lib_WorkerFeatures_CompilePermissionOverwrite_Returns {
  let allow: Lib_WorkerFeatures_CompilePermissionOverwrite_Allow = 0n;
  let deny: Lib_WorkerFeatures_CompilePermissionOverwrite_Deny = 0n;
  const entries: Lib_WorkerFeatures_CompilePermissionOverwrite_Entries = Object.entries(
    permission['user-or-role-perms'],
  );

  for (const entry of entries) {
    const flagValue: Lib_WorkerFeatures_CompilePermissionOverwrite_FlagValue = Reflect.get(
      PermissionFlagsBits,
      entry[0],
    );

    if (typeof flagValue !== 'bigint') {
      throw new Error(`Unsupported Discord permission name: ${entry[0]}`);
    }

    if (entry[1] === true) {
      allow += flagValue;
    } else {
      deny += flagValue;
    }
  }

  return {
    allow: allow.toString(),
    channelIdentifier,
    deny: deny.toString(),
    targetIdentifier: permission['user-or-role-id'],
    targetType: permission['target-type'],
  };
}

/**
 * Worker Features - Compile Permission Rule.
 *
 * Normalizes a scheduled permission set into immutable overwrites and calendar state.
 * A reusable formatter keeps time-zone matching deterministic across scans.
 *
 * @param {Lib_WorkerFeatures_CompilePermissionRule_Configuration} configuration - Configuration.
 * @param {Lib_WorkerFeatures_CompilePermissionRule_RuleIndex}     ruleIndex     - Rule index.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompilePermissionRule_Returns}
 *
 * @since 4.0.0
 */
function compilePermissionRule(
  configuration: Lib_WorkerFeatures_CompilePermissionRule_Configuration,
  ruleIndex: Lib_WorkerFeatures_CompilePermissionRule_RuleIndex,
): Lib_WorkerFeatures_CompilePermissionRule_Returns {
  const formatter: Lib_WorkerFeatures_CompilePermissionRule_Formatter = new Intl.DateTimeFormat(
    'en-US-u-ca-gregory-nu-latn',
    {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      timeZone: configuration['toggle-on']['time-zone'],
      weekday: 'short',
      year: 'numeric',
    },
  );
  const overwrites: Lib_WorkerFeatures_CompilePermissionRule_Overwrites = configuration['toggles']
    .flatMap((toggle) => toggle['permissions'].map((permission) => compilePermissionOverwrite(
      toggle['channel']['channel-id'],
      permission,
    )));

  return {
    name: configuration['name'],
    overwrites,
    ruleIndex,
    schedule: {
      dates: configuration['toggle-on']['dates'] ?? defaultDates,
      daysOfWeek: configuration['toggle-on']['days-of-week'] ?? defaultDaysOfWeek,
      formatter,
      hours: configuration['toggle-on']['hours'] ?? defaultHours,
      minutes: configuration['toggle-on']['minutes'] ?? defaultMinutes,
      months: configuration['toggle-on']['months'] ?? defaultMonths,
      seconds: configuration['toggle-on']['seconds'],
      timeZone: configuration['toggle-on']['time-zone'],
    },
    skipDates: new Set(configuration['skip-dates'] ?? []),
  };
}

/**
 * Worker Features - Compile Permission Rules.
 *
 * Validates every scheduled overwrite together before any job can be created.
 * One malformed target therefore disables the entire permission feature.
 *
 * @param {Lib_WorkerFeatures_CompilePermissionRules_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompilePermissionRules_Returns}
 *
 * @since 4.0.0
 */
function compilePermissionRules(
  configuration: Lib_WorkerFeatures_CompilePermissionRules_Configuration,
): Lib_WorkerFeatures_CompilePermissionRules_Returns {
  const parsed: Lib_WorkerFeatures_CompilePermissionRules_Parsed = permissionRulesSchema.parse(configuration);

  return parsed.map((rule, ruleIndex) => compilePermissionRule(rule, ruleIndex));
}

/**
 * Worker Features - Compile Rss Feed Rule.
 *
 * Builds one reusable time-zone formatter and hashes the feed URL into a stable
 * cursor identity that never exposes an operator URL in queue dedupe keys.
 *
 * @param {Lib_WorkerFeatures_CompileRssFeedRule_Configuration} configuration - Configuration.
 * @param {Lib_WorkerFeatures_CompileRssFeedRule_RuleIndex}     ruleIndex     - Rule index.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompileRssFeedRule_Returns}
 *
 * @since 4.0.0
 */
function compileRssFeedRule(
  configuration: Lib_WorkerFeatures_CompileRssFeedRule_Configuration,
  ruleIndex: Lib_WorkerFeatures_CompileRssFeedRule_RuleIndex,
): Lib_WorkerFeatures_CompileRssFeedRule_Returns {
  const formatter: Lib_WorkerFeatures_CompileRssFeedRule_Formatter = new Intl.DateTimeFormat(
    'en-US-u-ca-gregory-nu-latn',
    {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      timeZone: configuration['fetch-on']['time-zone'],
      weekday: 'short',
      year: 'numeric',
    },
  );
  const feedKey: Lib_WorkerFeatures_CompileRssFeedRule_FeedKey = createHash('sha256')
    .update(configuration['url'])
    .digest('hex');

  return {
    allowedUrls: configuration['allowed-urls'] ?? [],
    channelIdentifier: configuration['channel']['channel-id'],
    feedKey,
    followRedirects: configuration['follow-redirects'],
    messageTemplate: configuration['payload']['content'],
    name: configuration['name'],
    removeParameters: configuration['remove-parameters'],
    ruleIndex,
    schedule: {
      dates: configuration['fetch-on']['dates'] ?? defaultDates,
      daysOfWeek: configuration['fetch-on']['days-of-week'] ?? defaultDaysOfWeek,
      formatter,
      hours: configuration['fetch-on']['hours'] ?? defaultHours,
      minutes: configuration['fetch-on']['minutes'] ?? defaultMinutes,
      months: configuration['fetch-on']['months'] ?? defaultMonths,
      seconds: configuration['fetch-on']['seconds'],
      timeZone: configuration['fetch-on']['time-zone'],
    },
    skipDates: new Set(),
    url: configuration['url'],
    userAgent: configuration['user-agent'],
  };
}

/**
 * Worker Features - Compile Rss Feeds.
 *
 * Validates all feeds together so a partial malformed module cannot create an
 * unexpected subset of outbound network requests.
 *
 * @param {Lib_WorkerFeatures_CompileRssFeeds_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompileRssFeeds_Returns}
 *
 * @since 4.0.0
 */
function compileRssFeeds(
  configuration: Lib_WorkerFeatures_CompileRssFeeds_Configuration,
): Lib_WorkerFeatures_CompileRssFeeds_Returns {
  const parsed: Lib_WorkerFeatures_CompileRssFeeds_Parsed = rssFeedsSchema.parse(configuration);

  return parsed.map((rule, ruleIndex) => compileRssFeedRule(rule, ruleIndex));
}

/**
 * Worker Features - Compile Schedule Post Rule.
 *
 * Builds one reusable time-zone formatter and normalizes wildcard calendar
 * fields so repeated scheduler scans perform only bounded comparisons.
 *
 * @param {Lib_WorkerFeatures_CompileSchedulePostRule_Configuration} configuration - Configuration.
 * @param {Lib_WorkerFeatures_CompileSchedulePostRule_RuleIndex}     ruleIndex     - Rule index.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompileSchedulePostRule_Returns}
 *
 * @since 4.0.0
 */
function compileSchedulePostRule(
  configuration: Lib_WorkerFeatures_CompileSchedulePostRule_Configuration,
  ruleIndex: Lib_WorkerFeatures_CompileSchedulePostRule_RuleIndex,
): Lib_WorkerFeatures_CompileSchedulePostRule_Returns {
  const formatter: Lib_WorkerFeatures_CompileSchedulePostRule_Formatter = new Intl.DateTimeFormat(
    'en-US-u-ca-gregory-nu-latn',
    {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      timeZone: configuration['send-on']['time-zone'],
      weekday: 'short',
      year: 'numeric',
    },
  );

  return {
    channelIdentifier: configuration['channel']['channel-id'],
    content: configuration['payload']['content'],
    footerText: (configuration['payload']['footer'] === undefined) ? undefined : configuration['payload']['footer']['text'],
    name: configuration['name'],
    reactions: configuration['reactions'] ?? [],
    ruleIndex,
    schedule: {
      dates: configuration['send-on']['dates'] ?? defaultDates,
      daysOfWeek: configuration['send-on']['days-of-week'] ?? defaultDaysOfWeek,
      formatter,
      hours: configuration['send-on']['hours'] ?? defaultHours,
      minutes: configuration['send-on']['minutes'] ?? defaultMinutes,
      months: configuration['send-on']['months'] ?? defaultMonths,
      seconds: configuration['send-on']['seconds'],
      timeZone: configuration['send-on']['time-zone'],
    },
    skipDates: new Set(configuration['skip-dates'] ?? []),
  };
}

/**
 * Worker Features - Compile Schedule Posts.
 *
 * Validates all scheduled posts together so a partial malformed module cannot
 * enqueue an unexpected subset of announcements.
 *
 * @param {Lib_WorkerFeatures_CompileSchedulePosts_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CompileSchedulePosts_Returns}
 *
 * @since 4.0.0
 */
function compileSchedulePosts(
  configuration: Lib_WorkerFeatures_CompileSchedulePosts_Configuration,
): Lib_WorkerFeatures_CompileSchedulePosts_Returns {
  const parsed: Lib_WorkerFeatures_CompileSchedulePosts_Parsed = schedulePostsSchema.parse(configuration);

  return parsed.map((rule, ruleIndex) => compileSchedulePostRule(rule, ruleIndex));
}

/**
 * Worker Features - Create Job Collector.
 *
 * Returns a pure collector over immutable compiled rules. Every matching instant
 * produces a deterministic dedupe key for transactional queue insertion.
 *
 * @param {Lib_WorkerFeatures_CreateJobCollector_PermissionRules} permissionRules - Permission rules.
 * @param {Lib_WorkerFeatures_CreateJobCollector_RssRules}        rssRules        - Rss rules.
 * @param {Lib_WorkerFeatures_CreateJobCollector_ScheduleRules}   scheduleRules   - Schedule rules.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CreateJobCollector_Returns}
 *
 * @since 4.0.0
 */
function createJobCollector(
  permissionRules: Lib_WorkerFeatures_CreateJobCollector_PermissionRules,
  rssRules: Lib_WorkerFeatures_CreateJobCollector_RssRules,
  scheduleRules: Lib_WorkerFeatures_CreateJobCollector_ScheduleRules,
): Lib_WorkerFeatures_CreateJobCollector_Returns {
  return (guildIdentifier, instants) => {
    return [
      ...instants.flatMap((instant) => {
        return permissionRules
          .filter((rule) => matchesSchedule(rule, instant) === true)
          .map((rule) => createPermissionJob(rule, guildIdentifier, instant));
      }),
      ...instants.flatMap((instant) => {
        return rssRules
          .filter((rule) => matchesSchedule(rule, instant) === true)
          .map((rule) => createRssFetchJob(rule, guildIdentifier, instant));
      }),
      ...instants.flatMap((instant) => {
        return scheduleRules
          .filter((rule) => matchesSchedule(rule, instant) === true)
          .map((rule) => createScheduledJob(rule, guildIdentifier, instant));
      }),
    ];
  };
}

/**
 * Worker Features - Create Permission Job.
 *
 * Freezes validated permission overwrites into an idempotent durable job.
 * The deterministic instant key prevents duplicate changes after worker restarts.
 *
 * @param {Lib_WorkerFeatures_CreatePermissionJob_Rule}            rule            - Rule.
 * @param {Lib_WorkerFeatures_CreatePermissionJob_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_WorkerFeatures_CreatePermissionJob_Instant}         instant         - Instant.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CreatePermissionJob_Returns}
 *
 * @since 4.0.0
 */
function createPermissionJob(
  rule: Lib_WorkerFeatures_CreatePermissionJob_Rule,
  guildIdentifier: Lib_WorkerFeatures_CreatePermissionJob_GuildIdentifier,
  instant: Lib_WorkerFeatures_CreatePermissionJob_Instant,
): Lib_WorkerFeatures_CreatePermissionJob_Returns {
  const payload: Lib_WorkerFeatures_CreatePermissionJob_Payload = {
    guildIdentifier,
    name: rule['name'],
    overwrites: rule['overwrites'],
  };

  return {
    dedupeKey: `permission-set:${guildIdentifier}:${rule['ruleIndex']}:${instant.toISOString()}`,
    payload,
    type: 'discord.permissions.apply',
  };
}

/**
 * Worker Features - Create Rss Fetch Job.
 *
 * Freezes validated feed settings into a durable conditional-fetch job. A
 * deterministic instant key prevents duplicate polling work after restarts.
 *
 * @param {Lib_WorkerFeatures_CreateRssFetchJob_Rule}            rule            - Rule.
 * @param {Lib_WorkerFeatures_CreateRssFetchJob_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_WorkerFeatures_CreateRssFetchJob_Instant}         instant         - Instant.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CreateRssFetchJob_Returns}
 *
 * @since 4.0.0
 */
function createRssFetchJob(
  rule: Lib_WorkerFeatures_CreateRssFetchJob_Rule,
  guildIdentifier: Lib_WorkerFeatures_CreateRssFetchJob_GuildIdentifier,
  instant: Lib_WorkerFeatures_CreateRssFetchJob_Instant,
): Lib_WorkerFeatures_CreateRssFetchJob_Returns {
  const payload: Lib_WorkerFeatures_CreateRssFetchJob_Payload = {
    allowedUrls: rule['allowedUrls'],
    channelIdentifier: rule['channelIdentifier'],
    feedKey: rule['feedKey'],
    followRedirects: rule['followRedirects'],
    guildIdentifier,
    messageTemplate: rule['messageTemplate'],
    name: rule['name'],
    removeParameters: rule['removeParameters'],
    url: rule['url'],
    userAgent: rule['userAgent'],
  };

  return {
    dedupeKey: `rss-fetch:${guildIdentifier}:${rule['feedKey']}:${instant.toISOString()}`,
    payload,
    type: 'rss.feed.fetch',
  };
}

/**
 * Worker Features - Create Scheduled Job.
 *
 * Freezes the rendered payload and reactions into a durable job. Later settings
 * edits cannot mutate work that was already due and transactionally enqueued.
 *
 * @param {Lib_WorkerFeatures_CreateScheduledJob_Rule}            rule            - Rule.
 * @param {Lib_WorkerFeatures_CreateScheduledJob_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_WorkerFeatures_CreateScheduledJob_Instant}         instant         - Instant.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_CreateScheduledJob_Returns}
 *
 * @since 4.0.0
 */
function createScheduledJob(
  rule: Lib_WorkerFeatures_CreateScheduledJob_Rule,
  guildIdentifier: Lib_WorkerFeatures_CreateScheduledJob_GuildIdentifier,
  instant: Lib_WorkerFeatures_CreateScheduledJob_Instant,
): Lib_WorkerFeatures_CreateScheduledJob_Returns {
  const localParts: Lib_WorkerFeatures_CreateScheduledJob_LocalParts = getLocalDateParts(rule, instant);
  const content: Lib_WorkerFeatures_CreateScheduledJob_Content = formatScheduledContent(rule, localParts);
  const payload: Lib_WorkerFeatures_CreateScheduledJob_Payload = {
    channelIdentifier: rule['channelIdentifier'],
    content,
    guildIdentifier,
    reactions: rule['reactions'],
    ruleName: rule['name'],
  };

  return {
    dedupeKey: `schedule-post:${guildIdentifier}:${rule['ruleIndex']}:${instant.toISOString()}`,
    payload,
    type: 'discord.message.send',
  };
}

/**
 * Worker Features - Format Configuration Error.
 *
 * Produces path-focused validation feedback without echoing submitted values.
 * Unexpected failures use the shared bounded error-message conversion.
 *
 * @param {Lib_WorkerFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_WorkerFeatures_FormatConfigurationError_Error,
): Lib_WorkerFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_WorkerFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
      if (issue['path'].length === 0) {
        return issue['message'];
      }

      return `${issue['path'].join('.')}: ${issue['message']}`;
    });

    return messages.join('; ').slice(0, 1_000);
  }

  return getErrorMessage(error).slice(0, 1_000);
}

/**
 * Worker Features - Format Scheduled Content.
 *
 * Combines the archived content and footer fields as bounded plain text and
 * resolves the supported year placeholder in the rule's configured time zone.
 *
 * @param {Lib_WorkerFeatures_FormatScheduledContent_Rule}       rule       - Rule.
 * @param {Lib_WorkerFeatures_FormatScheduledContent_LocalParts} localParts - Local parts.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_FormatScheduledContent_Returns}
 *
 * @since 4.0.0
 */
function formatScheduledContent(
  rule: Lib_WorkerFeatures_FormatScheduledContent_Rule,
  localParts: Lib_WorkerFeatures_FormatScheduledContent_LocalParts,
): Lib_WorkerFeatures_FormatScheduledContent_Returns {
  const parts: Lib_WorkerFeatures_FormatScheduledContent_Parts = [
    rule['content'],
    rule['footerText'],
  ].filter((part) => part !== undefined).map((part) => part.replaceAll('%YEAR%', localParts['year']));

  return parts.join('\n').slice(0, 2_000);
}

/**
 * Worker Features - Get Enabled Feature.
 *
 * Reads one feature switch without trusting the surrounding JSON structure.
 * Disabled or absent worker modules cannot create durable queue entries.
 *
 * @param {Lib_WorkerFeatures_GetEnabledFeature_Settings}   settings   - Settings.
 * @param {Lib_WorkerFeatures_GetEnabledFeature_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_WorkerFeatures_GetEnabledFeature_Settings,
  featureKey: Lib_WorkerFeatures_GetEnabledFeature_FeatureKey,
): Lib_WorkerFeatures_GetEnabledFeature_Returns {
  const featuresValue: Lib_WorkerFeatures_GetEnabledFeature_RawFeature = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const features: Lib_WorkerFeatures_GetEnabledFeature_Features = featuresValue;
  const rawFeature: Lib_WorkerFeatures_GetEnabledFeature_RawFeature = features[featureKey];

  if (isRecord(rawFeature) === false || rawFeature['enabled'] !== true) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Worker Features - Get Local Date Parts.
 *
 * Converts an absolute instant into numeric calendar parts using the rule's
 * prebuilt IANA time-zone formatter and Gregorian calendar.
 *
 * @param {Lib_WorkerFeatures_GetLocalDateParts_Rule}    rule    - Rule.
 * @param {Lib_WorkerFeatures_GetLocalDateParts_Instant} instant - Instant.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_GetLocalDateParts_Returns}
 *
 * @since 4.0.0
 */
function getLocalDateParts(
  rule: Lib_WorkerFeatures_GetLocalDateParts_Rule,
  instant: Lib_WorkerFeatures_GetLocalDateParts_Instant,
): Lib_WorkerFeatures_GetLocalDateParts_Returns {
  const formattedParts: Lib_WorkerFeatures_GetLocalDateParts_FormattedParts = rule['schedule']['formatter']
    .formatToParts(instant);
  const parts: Lib_WorkerFeatures_GetLocalDateParts_Parts = Object.fromEntries(
    formattedParts.map((part) => [
      part['type'],
      part['value'],
    ]),
  );
  const weekday: Lib_WorkerFeatures_GetLocalDateParts_Weekday = parts['weekday'];
  const dayOfWeek: Lib_WorkerFeatures_GetLocalDateParts_DayOfWeek = (weekday === undefined) ? undefined : weekdayNumbers[weekday];
  const year: Lib_WorkerFeatures_GetLocalDateParts_Year = parts['year'];
  const month: Lib_WorkerFeatures_GetLocalDateParts_Month = parts['month'];
  const day: Lib_WorkerFeatures_GetLocalDateParts_Day = parts['day'];
  const hour: Lib_WorkerFeatures_GetLocalDateParts_Hour = parts['hour'];
  const minute: Lib_WorkerFeatures_GetLocalDateParts_Minute = parts['minute'];
  const second: Lib_WorkerFeatures_GetLocalDateParts_Second = parts['second'];

  if (dayOfWeek === undefined) {
    throw new Error(`Intl did not return a weekday for time zone: ${rule['schedule']['timeZone']}`);
  }

  if (year === undefined || month === undefined) {
    throw new Error(`Intl did not return a year or month for time zone: ${rule['schedule']['timeZone']}`);
  }

  if (day === undefined || hour === undefined) {
    throw new Error(`Intl did not return a day or hour for time zone: ${rule['schedule']['timeZone']}`);
  }

  if (minute === undefined || second === undefined) {
    throw new Error(`Intl did not return a minute or second for time zone: ${rule['schedule']['timeZone']}`);
  }

  return {
    date: `${year}-${month}-${day}`,
    day: Number.parseInt(day, 10),
    dayOfWeek,
    hour: Number.parseInt(hour, 10),
    minute: Number.parseInt(minute, 10),
    month: Number.parseInt(month, 10),
    second: Number.parseInt(second, 10),
    year,
  };
}

/**
 * Worker Features - Is Record.
 *
 * Narrows imported JSON objects before reading feature switch properties.
 * Arrays and null are intentionally excluded from feature state objects.
 *
 * @param {Lib_WorkerFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_WorkerFeatures_IsRecord_Value,
): value is Lib_WorkerFeatures_IsRecord_TypeGuard {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}

/**
 * Worker Features - Is Safe HTTPS URL.
 *
 * Restricts configured feed and allowlist URLs to HTTPS without embedded
 * credentials. Runtime DNS and redirect checks add the network boundary.
 *
 * @param {Lib_WorkerFeatures_IsSafeHttpsUrl_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_IsSafeHttpsUrl_Returns}
 *
 * @since 4.0.0
 */
function isSafeHttpsUrl(
  value: Lib_WorkerFeatures_IsSafeHttpsUrl_Value,
): Lib_WorkerFeatures_IsSafeHttpsUrl_Returns {
  try {
    const url: Lib_WorkerFeatures_IsSafeHttpsUrl_Url = new URL(value);

    return (
      url['protocol'] === 'https:'
      && url['username'] === ''
      && url['password'] === ''
    );
  } catch {
    return false;
  }
}

/**
 * Worker Features - Is Time Zone Valid.
 *
 * Asks the platform Intl implementation to validate an IANA time-zone name.
 * Invalid identifiers are rejected during feature compilation.
 *
 * @param {Lib_WorkerFeatures_IsTimeZoneValid_TimeZone} timeZone - Time zone.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_IsTimeZoneValid_Returns}
 *
 * @since 4.0.0
 */
function isTimeZoneValid(
  timeZone: Lib_WorkerFeatures_IsTimeZoneValid_TimeZone,
): Lib_WorkerFeatures_IsTimeZoneValid_Returns {
  try {
    Intl.DateTimeFormat('en-US', {
      timeZone,
    });

    return true;
  } catch {
    return false;
  }
}

/**
 * Worker Features - Matches Schedule.
 *
 * Tests one absolute instant against every normalized local calendar selector.
 * Configured local skip dates take precedence over a cron-style match.
 *
 * @param {Lib_WorkerFeatures_MatchesSchedule_Rule}    rule    - Rule.
 * @param {Lib_WorkerFeatures_MatchesSchedule_Instant} instant - Instant.
 *
 * @private
 *
 * @returns {Lib_WorkerFeatures_MatchesSchedule_Returns}
 *
 * @since 4.0.0
 */
function matchesSchedule(
  rule: Lib_WorkerFeatures_MatchesSchedule_Rule,
  instant: Lib_WorkerFeatures_MatchesSchedule_Instant,
): Lib_WorkerFeatures_MatchesSchedule_Returns {
  const localParts: Lib_WorkerFeatures_MatchesSchedule_LocalParts = getLocalDateParts(rule, instant);

  if (rule['skipDates'].has(localParts['date']) === true) {
    return false;
  }

  if (rule['schedule']['daysOfWeek'].includes(localParts['dayOfWeek']) === false) {
    return false;
  }

  if (rule['schedule']['months'].includes(localParts['month']) === false) {
    return false;
  }

  if (rule['schedule']['dates'].includes(localParts['day']) === false) {
    return false;
  }

  if (rule['schedule']['hours'].includes(localParts['hour']) === false) {
    return false;
  }

  if (rule['schedule']['minutes'].includes(localParts['minute']) === false) {
    return false;
  }

  return rule['schedule']['seconds'].includes(localParts['second']);
}

/**
 * Worker Features - Parse Discord Message Job.
 *
 * Validates one durable message job immediately before Discord delivery.
 * Unknown properties are stripped and bounded text-only fields are returned.
 *
 * @param {Lib_WorkerFeatures_ParseDiscordMessageJob_Payload} payload - Payload.
 *
 * @returns {Lib_WorkerFeatures_ParseDiscordMessageJob_Returns}
 *
 * @since 4.0.0
 */
export function parseDiscordMessageJob(
  payload: Lib_WorkerFeatures_ParseDiscordMessageJob_Payload,
): Lib_WorkerFeatures_ParseDiscordMessageJob_Returns {
  return discordMessageJobSchema.parse(payload);
}

/**
 * Worker Features - Parse Discord Message Response.
 *
 * Validates the message identifier returned by Discord before reaction routes
 * are constructed from it.
 *
 * @param {Lib_WorkerFeatures_ParseDiscordMessageResponse_Response} response - Response.
 *
 * @returns {Lib_WorkerFeatures_ParseDiscordMessageResponse_Returns}
 *
 * @since 4.0.0
 */
export function parseDiscordMessageResponse(
  response: Lib_WorkerFeatures_ParseDiscordMessageResponse_Response,
): Lib_WorkerFeatures_ParseDiscordMessageResponse_Returns {
  return discordMessageResponseSchema.parse(response);
}

/**
 * Worker Features - Parse Discord Permission Job.
 *
 * Validates one durable permission job immediately before Discord mutation.
 * Unknown properties and malformed precision-safe bit fields are rejected.
 *
 * @param {Lib_WorkerFeatures_ParseDiscordPermissionJob_Payload} payload - Payload.
 *
 * @returns {Lib_WorkerFeatures_ParseDiscordPermissionJob_Returns}
 *
 * @since 4.0.0
 */
export function parseDiscordPermissionJob(
  payload: Lib_WorkerFeatures_ParseDiscordPermissionJob_Payload,
): Lib_WorkerFeatures_ParseDiscordPermissionJob_Returns {
  return discordPermissionJobSchema.parse(payload);
}

/**
 * Worker Features - Parse Rss Fetch Job.
 *
 * Validates one durable feed job immediately before outbound HTTP processing.
 * HTTPS and bounded template rules are applied again at this trust boundary.
 *
 * @param {Lib_WorkerFeatures_ParseRssFetchJob_Payload} payload - Payload.
 *
 * @returns {Lib_WorkerFeatures_ParseRssFetchJob_Returns}
 *
 * @since 4.0.0
 */
export function parseRssFetchJob(
  payload: Lib_WorkerFeatures_ParseRssFetchJob_Payload,
): Lib_WorkerFeatures_ParseRssFetchJob_Returns {
  return rssFetchJobSchema.parse(payload);
}

/**
 * Worker Features - Prepare Worker Features.
 *
 * Compiles enabled durable modules independently. Invalid configuration remains
 * inactive and returns panel-compatible diagnostics without stopping the worker.
 *
 * @param {Lib_WorkerFeatures_PrepareWorkerFeatures_Settings} settings - Settings.
 *
 * @returns {Lib_WorkerFeatures_PrepareWorkerFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareWorkerFeatures(
  settings: Lib_WorkerFeatures_PrepareWorkerFeatures_Settings,
): Lib_WorkerFeatures_PrepareWorkerFeatures_Returns {
  const activeFeatureKeys: Lib_WorkerFeatures_PrepareWorkerFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_WorkerFeatures_PrepareWorkerFeatures_ConfigurationErrors = [];
  const permissionFeature: Lib_WorkerFeatures_PrepareWorkerFeatures_PermissionFeature = getEnabledFeature(
    settings,
    'toggle-perms',
  );
  let permissionRules: Lib_WorkerFeatures_PrepareWorkerFeatures_PermissionRules = [];

  if (permissionFeature !== undefined) {
    try {
      permissionRules = compilePermissionRules(permissionFeature['configuration']);

      activeFeatureKeys.push('toggle-perms');
    } catch (error) {
      configurationErrors.push(`toggle-perms: ${formatConfigurationError(error)}`);
    }
  }

  const rssFeature: Lib_WorkerFeatures_PrepareWorkerFeatures_RssFeature = getEnabledFeature(
    settings,
    'rss-feeds',
  );
  let rssRules: Lib_WorkerFeatures_PrepareWorkerFeatures_RssRules = [];

  if (rssFeature !== undefined) {
    try {
      rssRules = compileRssFeeds(rssFeature['configuration']);

      activeFeatureKeys.push('rss-feeds');
    } catch (error) {
      configurationErrors.push(`rss-feeds: ${formatConfigurationError(error)}`);
    }
  }

  const scheduleFeature: Lib_WorkerFeatures_PrepareWorkerFeatures_ScheduleFeature = getEnabledFeature(
    settings,
    'schedule-posts',
  );
  let scheduleRules: Lib_WorkerFeatures_PrepareWorkerFeatures_ScheduleRules = [];

  if (scheduleFeature !== undefined) {
    try {
      scheduleRules = compileSchedulePosts(scheduleFeature['configuration']);

      activeFeatureKeys.push('schedule-posts');
    } catch (error) {
      configurationErrors.push(`schedule-posts: ${formatConfigurationError(error)}`);
    }
  }

  return {
    activeFeatureKeys,
    collectJobs: createJobCollector(permissionRules, rssRules, scheduleRules),
    configurationErrors,
  };
}
