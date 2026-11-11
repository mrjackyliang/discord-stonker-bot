import {
  createHmac,
  timingSafeEqual,
} from 'node:crypto';
import { isIP } from 'node:net';

import { Routes } from 'discord.js';
import { z } from 'zod';

import {
  getNormalizedGuildSettings,
  listNormalizedGuildSettings,
} from './configuration-database.js';
import { decryptSecret } from './credential-vault.js';
import { getGuildSecrets } from './database.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_DISCORD_MARKDOWN_CHARACTER,
  LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH,
  LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH,
  LIB_REGEX_PATTERN_WEBHOOK_PROPERTY_PATH,
  LIB_REGEX_PATTERN_WEBHOOK_SIGNATURE,
  LIB_REGEX_PATTERN_WEBHOOK_TIMESTAMP,
  LIB_REGEX_PATTERN_WEBHOOK_VARIABLE_IDENTIFIER,
} from './regex.js';

import type {
  Lib_WebApplicationFeatures_CompileGuildWebApplication_Ciphertext,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_CredentialKey,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_GuildIdentifier,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_Pool,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_Prepared,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_Returns,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_SecretMap,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_SecretRows,
  Lib_WebApplicationFeatures_CompileGuildWebApplication_Settings,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Configuration,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Invite,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_InviteConfiguration,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_InviteSecret,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Parsed,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_PathSet,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Returns,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Route,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_RouteIndex,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Routes,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_RouteSecret,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Secrets,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_TemplateParts,
  Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Variables,
  Lib_WebApplicationFeatures_CreateDiscordInvite_ChannelIdentifier,
  Lib_WebApplicationFeatures_CreateDiscordInvite_Configuration,
  Lib_WebApplicationFeatures_CreateDiscordInvite_Parsed,
  Lib_WebApplicationFeatures_CreateDiscordInvite_Response,
  Lib_WebApplicationFeatures_CreateDiscordInvite_Rest,
  Lib_WebApplicationFeatures_CreateDiscordInvite_Returns,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Body,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Returns,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Secret,
  Lib_WebApplicationFeatures_CreateWebhookSignature_Timestamp,
  Lib_WebApplicationFeatures_EscapeDiscordText_Pattern,
  Lib_WebApplicationFeatures_EscapeDiscordText_Returns,
  Lib_WebApplicationFeatures_EscapeDiscordText_Value,
  Lib_WebApplicationFeatures_FetchGuildMetadata_GuildIdentifier,
  Lib_WebApplicationFeatures_FetchGuildMetadata_Parsed,
  Lib_WebApplicationFeatures_FetchGuildMetadata_ReportedMemberCount,
  Lib_WebApplicationFeatures_FetchGuildMetadata_Response,
  Lib_WebApplicationFeatures_FetchGuildMetadata_Rest,
  Lib_WebApplicationFeatures_FetchGuildMetadata_Returns,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_CandidatePaths,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Conflicts,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_ExistingFeature,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Feature,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_GuildIdentifier,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Pool,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Returns,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Settings,
  Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_SettingsEntries,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Cached,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_ConflictingPaths,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Feature,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_InvitePath,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Now,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Path,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Pool,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Returns,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntries,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntry,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_RoutePath,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_Routes,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_SettingsEntries,
  Lib_WebApplicationFeatures_FindWebApplicationRoute_WebhookRoutes,
  Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Pool,
  Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Returns,
  Lib_WebApplicationFeatures_FormatConfigurationError_Error,
  Lib_WebApplicationFeatures_FormatConfigurationError_Messages,
  Lib_WebApplicationFeatures_FormatConfigurationError_Returns,
  Lib_WebApplicationFeatures_FormatWebhookVariable_NumberValue,
  Lib_WebApplicationFeatures_FormatWebhookVariable_Returns,
  Lib_WebApplicationFeatures_FormatWebhookVariable_TimestampSeconds,
  Lib_WebApplicationFeatures_FormatWebhookVariable_Type,
  Lib_WebApplicationFeatures_FormatWebhookVariable_Value,
  Lib_WebApplicationFeatures_GetEnabledFeature_Features,
  Lib_WebApplicationFeatures_GetEnabledFeature_RawFeature,
  Lib_WebApplicationFeatures_GetEnabledFeature_Returns,
  Lib_WebApplicationFeatures_GetEnabledFeature_Settings,
  Lib_WebApplicationFeatures_GetPublicPaths_Configuration,
  Lib_WebApplicationFeatures_GetPublicPaths_InvitePath,
  Lib_WebApplicationFeatures_GetPublicPaths_Paths,
  Lib_WebApplicationFeatures_GetPublicPaths_Returns,
  Lib_WebApplicationFeatures_GetPublicPaths_WebhookPath,
  Lib_WebApplicationFeatures_GetPublicPaths_WebhookRoutes,
  Lib_WebApplicationFeatures_GetValueAtPath_Current,
  Lib_WebApplicationFeatures_GetValueAtPath_Path,
  Lib_WebApplicationFeatures_GetValueAtPath_Returns,
  Lib_WebApplicationFeatures_GetValueAtPath_Segments,
  Lib_WebApplicationFeatures_GetValueAtPath_Value,
  Lib_WebApplicationFeatures_IsRecord_TypeGuard,
  Lib_WebApplicationFeatures_IsRecord_Value,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_ActiveFeatureKeys,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_ConfigurationErrors,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Feature,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Runtime,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Secrets,
  Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Settings,
  Lib_WebApplicationFeatures_ReadInviteSettings_Features,
  Lib_WebApplicationFeatures_ReadInviteSettings_GuildIdentifier,
  Lib_WebApplicationFeatures_ReadInviteSettings_Path,
  Lib_WebApplicationFeatures_ReadInviteSettings_Pool,
  Lib_WebApplicationFeatures_ReadInviteSettings_RawFeature,
  Lib_WebApplicationFeatures_ReadInviteSettings_Returns,
  Lib_WebApplicationFeatures_ReadInviteSettings_Settings,
  Lib_WebApplicationFeatures_RenderWebhookContent_Body,
  Lib_WebApplicationFeatures_RenderWebhookContent_Content,
  Lib_WebApplicationFeatures_RenderWebhookContent_FormattedValue,
  Lib_WebApplicationFeatures_RenderWebhookContent_RawValue,
  Lib_WebApplicationFeatures_RenderWebhookContent_Returns,
  Lib_WebApplicationFeatures_RenderWebhookContent_Route,
  Lib_WebApplicationFeatures_RouteCache,
  Lib_WebApplicationFeatures_VerifyRecaptcha_ExpectedHostname,
  Lib_WebApplicationFeatures_VerifyRecaptcha_Form,
  Lib_WebApplicationFeatures_VerifyRecaptcha_Parsed,
  Lib_WebApplicationFeatures_VerifyRecaptcha_ParsedJson,
  Lib_WebApplicationFeatures_VerifyRecaptcha_RemoteAddress,
  Lib_WebApplicationFeatures_VerifyRecaptcha_Response,
  Lib_WebApplicationFeatures_VerifyRecaptcha_ResponseText,
  Lib_WebApplicationFeatures_VerifyRecaptcha_Returns,
  Lib_WebApplicationFeatures_VerifyRecaptcha_Secret,
  Lib_WebApplicationFeatures_VerifyRecaptcha_SolvedHostname,
  Lib_WebApplicationFeatures_VerifyRecaptcha_Token,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_Body,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_CurrentTime,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_ExpectedBuffer,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_ExpectedSignature,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_NormalizedSignature,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_Pattern,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_ProvidedBuffer,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_Returns,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_Secret,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_Signature,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_Timestamp,
  Lib_WebApplicationFeatures_VerifyWebhookSignature_TimestampSeconds,
} from '../types/lib/web-application-features.d.ts';

/**
 * Web Application Features - Maximum Provider Response Characters.
 *
 * Bounds the fixed reCAPTCHA response before JSON parsing.
 * Provider error bodies are never forwarded to visitors or logs.
 *
 * @since 4.0.0
 */
const MAXIMUM_PROVIDER_RESPONSE_CHARACTERS = 65_536;

/**
 * Web Application Features - Provider Timeout Milliseconds.
 *
 * Stops stalled reCAPTCHA verification without tying up the public listener.
 * Discord REST uses its centralized rate-limit and timeout behavior separately.
 *
 * @since 4.0.0
 */
const PROVIDER_TIMEOUT_MILLISECONDS = 8_000;

/**
 * Web Application Features - Webhook Freshness Milliseconds.
 *
 * Restricts signed requests to a five-minute clock window.
 * Durable dedupe keys provide the second replay barrier after admission.
 *
 * @since 4.0.0
 */
const WEBHOOK_FRESHNESS_MILLISECONDS = 300_000;

/**
 * Web Application Features - Route Cache Milliseconds.
 *
 * Keeps the public path lookup for thirty seconds before reading settings again.
 * Feature changes therefore reach the public pages within half a minute.
 *
 * @since 4.0.0
 */
const ROUTE_CACHE_MILLISECONDS = 30_000;

/**
 * Web Application Features - Route Cache.
 *
 * Remembers which server owns each public path, separately for every database pool.
 * Entries hold no secrets; runtimes are compiled again for each request.
 *
 * @since 4.0.0
 */
const routeCache: Lib_WebApplicationFeatures_RouteCache = new WeakMap();

/**
 * Web Application Features - Currency Formatter.
 *
 * Formats legacy dollar and cent webhook variables without an extra dependency.
 * A deterministic locale keeps tests and delivered messages stable.
 *
 * @since 4.0.0
 */
const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
});

/**
 * Web Application Features - Secret Reference Schema.
 *
 * Requires all public-route secrets to reference encrypted database entries.
 * Plaintext provider or signing credentials are rejected at runtime startup.
 *
 * @since 4.0.0
 */
const secretReferenceSchema = z.object({
  $secret: z.string().trim().min(1).max(512),
});

/**
 * Web Application Features - Web Application Schema.
 *
 * Validates the retained invite and webhook behavior while ignoring retired
 * standalone HTTP and TLS listener fields from the archived configuration.
 *
 * @since 4.0.0
 */
export const webApplicationSchema = z.object({
  'http-server': z.unknown().optional(),
  'https-server': z.unknown().optional(),
  'invite-generator': z.object({
    options: z.object({
      'max-age': z.number().int().min(60).max(3_600).default(300),
      'max-uses': z.number().int().min(1).max(5).default(1),
      'path': z.string().trim().regex(LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH),
    }),
    recaptcha: z.object({
      'secret-key': secretReferenceSchema,
      'site-key': z.string().trim().min(1).max(256),
    }),
  }).optional(),
  'map-webhooks': z.array(z.object({
    'channel': z.object({
      'channel-id': z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER),
    }),
    'name': z.string().trim().min(1).max(100),
    'path': z.string().trim().regex(LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH),
    'payload': z.object({
      content: z.string().trim().min(1).max(1_800),
      footer: z.object({
        text: z.string().trim().min(1).max(150),
      }).optional(),
    }),
    'signing-secret': secretReferenceSchema,
    'variables': z.array(z.object({
      id: z.string().regex(LIB_REGEX_PATTERN_WEBHOOK_VARIABLE_IDENTIFIER),
      path: z.string().regex(LIB_REGEX_PATTERN_WEBHOOK_PROPERTY_PATH),
      type: z.enum([
        'boolean',
        'string',
        'ts-millis',
        'ts-seconds',
        'usd-cents',
        'usd-dollars',
      ]),
    })).max(50).default([]),
  })).max(25).optional(),
}).refine(
  (configuration) => (
    configuration['invite-generator'] !== undefined
    || (
      configuration['map-webhooks'] !== undefined
      && configuration['map-webhooks'].length > 0
    )
  ),
  'At least one invite or signed webhook route is required.',
);

/**
 * Web Application Features - Captcha Response Schema.
 *
 * Narrows the fixed Google verification response to its admission decision.
 * Error details are intentionally retained only as bounded validation data.
 *
 * @since 4.0.0
 */
const captchaResponseSchema = z.object({
  'error-codes': z.array(z.string().max(100)).max(20).optional(),
  'hostname': z.string().max(253).optional(),
  'success': z.boolean(),
});

/**
 * Web Application Features - Discord Guild Response Schema.
 *
 * Accepts only public server metadata and the configured rules channel needed
 * to render and create a short-lived invite.
 *
 * @since 4.0.0
 */
const discordGuildResponseSchema = z.object({
  approximate_member_count: z.number().int().nonnegative().optional(),
  member_count: z.number().int().nonnegative().optional(),
  name: z.string().min(1).max(100),
  premium_tier: z.number().int().min(0).max(3),
  rules_channel_id: z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER).nullable(),
});

/**
 * Web Application Features - Discord Invite Response Schema.
 *
 * Accepts only the opaque invite code returned by Discord.
 * No provider payload is forwarded directly into a response header.
 *
 * @since 4.0.0
 */
const discordInviteResponseSchema = z.object({
  code: z.string().trim().min(1).max(100),
});

/**
 * Web Application Features - Compile Guild Web Application.
 *
 * Compiles one server's enabled web-applications feature with its decrypted secrets.
 * A disabled or invalid feature returns undefined, and an invalid one is logged.
 *
 * @param {Lib_WebApplicationFeatures_CompileGuildWebApplication_Pool}            pool            - Pool.
 * @param {Lib_WebApplicationFeatures_CompileGuildWebApplication_CredentialKey}   credentialKey   - Credential key.
 * @param {Lib_WebApplicationFeatures_CompileGuildWebApplication_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_WebApplicationFeatures_CompileGuildWebApplication_Returns}
 *
 * @since 4.0.0
 */
export async function compileGuildWebApplication(
  pool: Lib_WebApplicationFeatures_CompileGuildWebApplication_Pool,
  credentialKey: Lib_WebApplicationFeatures_CompileGuildWebApplication_CredentialKey,
  guildIdentifier: Lib_WebApplicationFeatures_CompileGuildWebApplication_GuildIdentifier,
): Lib_WebApplicationFeatures_CompileGuildWebApplication_Returns {
  const settings: Lib_WebApplicationFeatures_CompileGuildWebApplication_Settings = await getNormalizedGuildSettings(
    pool,
    guildIdentifier,
  );

  if (settings === undefined) {
    return undefined;
  }

  const secretRows: Lib_WebApplicationFeatures_CompileGuildWebApplication_SecretRows = await getGuildSecrets(
    pool,
    guildIdentifier,
  );
  const secretMap: Lib_WebApplicationFeatures_CompileGuildWebApplication_SecretMap = new Map(
    secretRows.map((secret) => [
      secret['key'],
      secret['ciphertext'],
    ]),
  );
  const prepared: Lib_WebApplicationFeatures_CompileGuildWebApplication_Prepared = prepareWebApplicationFeatures(
    settings,
    (key) => {
      const ciphertext: Lib_WebApplicationFeatures_CompileGuildWebApplication_Ciphertext = secretMap.get(key);

      if (ciphertext === undefined) {
        return undefined;
      }

      return decryptSecret(ciphertext, `guild-secret:${guildIdentifier}:${key}`, credentialKey);
    },
  );

  if (prepared['runtime'] === undefined && prepared['configurationErrors'].length > 0) {
    writeLog('error', 'web', 'web_application_configuration_invalid', {
      errors: prepared['configurationErrors'],
      guildIdentifier,
    });
  }

  return prepared['runtime'];
}

/**
 * Web Application Features - Compile Web Application Runtime.
 *
 * Resolves encrypted-secret references and produces exact public route entries.
 * Duplicate paths and missing credentials fail the complete feature closed.
 *
 * @param {Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Configuration} configuration - Configuration.
 * @param {Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Secrets}       secrets       - Secrets.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Returns}
 *
 * @since 4.0.0
 */
function compileWebApplicationRuntime(
  configuration: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Configuration,
  secrets: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Secrets,
): Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Returns {
  const parsed: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Parsed = webApplicationSchema.parse(
    configuration,
  );
  const inviteConfiguration: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_InviteConfiguration = parsed[
    'invite-generator'
  ];
  let invite: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Invite = undefined;
  const pathSet: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_PathSet = new Set<string>();

  if (inviteConfiguration !== undefined) {
    const inviteSecret: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_InviteSecret = secrets(
      inviteConfiguration['recaptcha']['secret-key']['$secret'],
    );

    if (inviteSecret === undefined || inviteSecret.trim() === '') {
      throw new Error('invite-generator.recaptcha.secret-key: Enter the reCAPTCHA secret key.');
    }

    invite = {
      maxAgeSeconds: inviteConfiguration['options']['max-age'],
      maxUses: inviteConfiguration['options']['max-uses'],
      path: inviteConfiguration['options']['path'],
      recaptchaSecret: inviteSecret,
      recaptchaSiteKey: inviteConfiguration['recaptcha']['site-key'],
    };

    pathSet.add(invite['path']);
  }

  const routes: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Routes = new Map();

  for (const routeEntry of (parsed['map-webhooks'] ?? []).entries()) {
    const routeIndex: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_RouteIndex = routeEntry[0];
    const route: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Route = routeEntry[1];

    if (pathSet.has(route['path']) === true) {
      throw new Error(`map-webhooks.${routeIndex}.path: Another page already uses ${route['path']}.`);
    }

    const routeSecret: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_RouteSecret = secrets(
      route['signing-secret']['$secret'],
    );

    if (routeSecret === undefined || routeSecret.length < 32) {
      throw new Error(`map-webhooks.${routeIndex}.signing-secret: Use a signing secret of at least 32 characters.`);
    }

    const templateParts: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_TemplateParts = [route['payload']['content']];

    if (route['payload']['footer'] !== undefined) {
      templateParts.push(route['payload']['footer']['text']);
    }

    const variables: Lib_WebApplicationFeatures_CompileWebApplicationRuntime_Variables = route['variables'].map(
      (variable) => ({
        identifier: variable['id'],
        path: variable['path'],
        type: variable['type'],
      }),
    );

    routes.set(route['path'], {
      channelIdentifier: route['channel']['channel-id'],
      name: route['name'],
      path: route['path'],
      signingSecret: routeSecret,
      template: templateParts.join('\n'),
      variables,
    });

    pathSet.add(route['path']);
  }

  return {
    invite,
    webhookRoutes: routes,
  };
}

/**
 * Web Application Features - Create Discord Invite.
 *
 * Creates one unique short-lived invite for the server's rules channel.
 * Discord's shared REST client provides centralized rate-limit handling.
 *
 * @param {Lib_WebApplicationFeatures_CreateDiscordInvite_Rest}              rest              - Rest.
 * @param {Lib_WebApplicationFeatures_CreateDiscordInvite_ChannelIdentifier} channelIdentifier - Channel identifier.
 * @param {Lib_WebApplicationFeatures_CreateDiscordInvite_Configuration}     configuration     - Configuration.
 *
 * @returns {Lib_WebApplicationFeatures_CreateDiscordInvite_Returns}
 *
 * @since 4.0.0
 */
export async function createDiscordInvite(
  rest: Lib_WebApplicationFeatures_CreateDiscordInvite_Rest,
  channelIdentifier: Lib_WebApplicationFeatures_CreateDiscordInvite_ChannelIdentifier,
  configuration: Lib_WebApplicationFeatures_CreateDiscordInvite_Configuration,
): Lib_WebApplicationFeatures_CreateDiscordInvite_Returns {
  const response: Lib_WebApplicationFeatures_CreateDiscordInvite_Response = await rest.post(
    Routes.channelInvites(channelIdentifier),
    {
      body: {
        max_age: configuration['maxAgeSeconds'],
        max_uses: configuration['maxUses'],
        temporary: false,
        unique: true,
      },
      reason: 'Visitor completed Stonker invite verification',
    },
  );
  const parsed: Lib_WebApplicationFeatures_CreateDiscordInvite_Parsed = discordInviteResponseSchema.parse(response);

  return `https://discord.gg/${encodeURIComponent(parsed['code'])}`;
}

/**
 * Web Application Features - Create Webhook Signature.
 *
 * Produces the documented timestamp-bound SHA-256 request signature.
 * Integrators can use the same helper contract in local non-live tests.
 *
 * @param {Lib_WebApplicationFeatures_CreateWebhookSignature_Body}      body      - Body.
 * @param {Lib_WebApplicationFeatures_CreateWebhookSignature_Timestamp} timestamp - Timestamp.
 * @param {Lib_WebApplicationFeatures_CreateWebhookSignature_Secret}    secret    - Secret.
 *
 * @returns {Lib_WebApplicationFeatures_CreateWebhookSignature_Returns}
 *
 * @since 4.0.0
 */
export function createWebhookSignature(
  body: Lib_WebApplicationFeatures_CreateWebhookSignature_Body,
  timestamp: Lib_WebApplicationFeatures_CreateWebhookSignature_Timestamp,
  secret: Lib_WebApplicationFeatures_CreateWebhookSignature_Secret,
): Lib_WebApplicationFeatures_CreateWebhookSignature_Returns {
  return createHmac('sha256', secret).update(`${timestamp}.${body}`, 'utf8').digest('hex');
}

/**
 * Web Application Features - Escape Discord Text.
 *
 * Neutralizes formatting characters in untrusted webhook variable values.
 * Automatic mentions are also disabled again at worker delivery time.
 *
 * @param {Lib_WebApplicationFeatures_EscapeDiscordText_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_EscapeDiscordText_Returns}
 *
 * @since 4.0.0
 */
function escapeDiscordText(
  value: Lib_WebApplicationFeatures_EscapeDiscordText_Value,
): Lib_WebApplicationFeatures_EscapeDiscordText_Returns {
  const pattern: Lib_WebApplicationFeatures_EscapeDiscordText_Pattern = new RegExp(
    LIB_REGEX_PATTERN_DISCORD_MARKDOWN_CHARACTER,
    'g',
  );

  return value.replace(pattern, '\\$&').slice(0, 500);
}

/**
 * Web Application Features - Fetch Guild Metadata.
 *
 * Reads current server counts and the rules channel through Discord REST.
 * The response is narrowed before any value reaches visitor markup.
 *
 * @param {Lib_WebApplicationFeatures_FetchGuildMetadata_Rest}            rest            - Rest.
 * @param {Lib_WebApplicationFeatures_FetchGuildMetadata_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_WebApplicationFeatures_FetchGuildMetadata_Returns}
 *
 * @since 4.0.0
 */
export async function fetchGuildMetadata(
  rest: Lib_WebApplicationFeatures_FetchGuildMetadata_Rest,
  guildIdentifier: Lib_WebApplicationFeatures_FetchGuildMetadata_GuildIdentifier,
): Lib_WebApplicationFeatures_FetchGuildMetadata_Returns {
  const response: Lib_WebApplicationFeatures_FetchGuildMetadata_Response = await rest.get(
    Routes.guild(guildIdentifier),
    {
      query: new URLSearchParams({
        with_counts: 'true',
      }),
    },
  );
  const parsed: Lib_WebApplicationFeatures_FetchGuildMetadata_Parsed = discordGuildResponseSchema.parse(response);
  const reportedMemberCount: Lib_WebApplicationFeatures_FetchGuildMetadata_ReportedMemberCount = parsed[
    'approximate_member_count'
  ] ?? parsed['member_count'];

  return {
    memberCount: reportedMemberCount,
    name: parsed['name'],
    premiumTier: parsed['premium_tier'],
    rulesChannelIdentifier: parsed['rules_channel_id'] ?? undefined,
  };
}

/**
 * Web Application Features - Find Web Application Route.
 *
 * Maps a public invite or webhook path to the server whose enabled feature uses it.
 * Paths are read without secrets and cached for thirty seconds per database pool.
 *
 * @param {Lib_WebApplicationFeatures_FindWebApplicationRoute_Pool} pool - Pool.
 * @param {Lib_WebApplicationFeatures_FindWebApplicationRoute_Path} path - Path.
 *
 * @returns {Lib_WebApplicationFeatures_FindWebApplicationRoute_Returns}
 *
 * @since 4.0.0
 */
export async function findWebApplicationRoute(
  pool: Lib_WebApplicationFeatures_FindWebApplicationRoute_Pool,
  path: Lib_WebApplicationFeatures_FindWebApplicationRoute_Path,
): Lib_WebApplicationFeatures_FindWebApplicationRoute_Returns {
  const cached: Lib_WebApplicationFeatures_FindWebApplicationRoute_Cached = routeCache.get(pool);
  const now: Lib_WebApplicationFeatures_FindWebApplicationRoute_Now = Date.now();

  if (cached !== undefined && cached['expiresAt'] > now) {
    return cached['routes'].get(path);
  }

  const routes: Lib_WebApplicationFeatures_FindWebApplicationRoute_Routes = new Map();
  const conflictingPaths: Lib_WebApplicationFeatures_FindWebApplicationRoute_ConflictingPaths = new Set();
  const settingsEntries: Lib_WebApplicationFeatures_FindWebApplicationRoute_SettingsEntries = await listNormalizedGuildSettings(
    pool,
  );

  for (const settingsEntry of settingsEntries) {
    const feature: Lib_WebApplicationFeatures_FindWebApplicationRoute_Feature = getEnabledFeature(settingsEntry['settings']);

    if (feature === undefined || isRecord(feature['configuration']) === false) {
      continue;
    }

    const invitePath: Lib_WebApplicationFeatures_FindWebApplicationRoute_InvitePath = getValueAtPath(feature['configuration'], 'invite-generator.options.path');
    const webhookRoutes: Lib_WebApplicationFeatures_FindWebApplicationRoute_WebhookRoutes = feature['configuration']['map-webhooks'];
    const routeEntries: Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntries = [[
      invitePath,
      'invite',
    ]];

    if (Array.isArray(webhookRoutes) === true) {
      for (const webhookRoute of webhookRoutes) {
        routeEntries.push([
          getValueAtPath(webhookRoute, 'path'),
          'webhook',
        ]);
      }
    }

    for (const routeEntry of routeEntries) {
      const typedRouteEntry: Lib_WebApplicationFeatures_FindWebApplicationRoute_RouteEntry = routeEntry;
      const routePath: Lib_WebApplicationFeatures_FindWebApplicationRoute_RoutePath = typedRouteEntry[0];

      if (
        typeof routePath !== 'string'
        || conflictingPaths.has(routePath) === true
      ) {
        continue;
      }

      if (routes.has(routePath) === true) {
        routes.delete(routePath);

        conflictingPaths.add(routePath);

        writeLog('error', 'web', 'web_application_route_conflict', { path: routePath });

        continue;
      }

      routes.set(routePath, {
        guildIdentifier: settingsEntry['guildIdentifier'],
        kind: typedRouteEntry[1],
      });
    }
  }

  routeCache.set(pool, {
    expiresAt: now + ROUTE_CACHE_MILLISECONDS,
    routes,
  });

  return routes.get(path);
}

/**
 * Web Application Features - Find Web Application Path Conflicts.
 *
 * Compares one server's enabled public routes with every other enabled server.
 * Public paths belong to the whole process, so a duplicate must never be saved.
 *
 * @param {Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Pool}            pool            - Pool.
 * @param {Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Settings}        settings        - Settings.
 *
 * @returns {Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Returns}
 *
 * @since 4.0.0
 */
export async function findWebApplicationPathConflicts(
  pool: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Pool,
  guildIdentifier: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_GuildIdentifier,
  settings: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Settings,
): Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Returns {
  const feature: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Feature = getEnabledFeature(settings);

  if (feature === undefined) {
    return [];
  }

  const candidatePaths: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_CandidatePaths = new Set(
    getPublicPaths(feature['configuration']),
  );
  const conflicts: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_Conflicts = new Set();
  const settingsEntries: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_SettingsEntries = await listNormalizedGuildSettings(pool);

  for (const settingsEntry of settingsEntries) {
    if (settingsEntry['guildIdentifier'] === guildIdentifier) {
      continue;
    }

    const existingFeature: Lib_WebApplicationFeatures_FindWebApplicationPathConflicts_ExistingFeature = getEnabledFeature(settingsEntry['settings']);

    if (existingFeature === undefined) {
      continue;
    }

    for (const publicPath of getPublicPaths(existingFeature['configuration'])) {
      if (candidatePaths.has(publicPath) === true) {
        conflicts.add(publicPath);
      }
    }
  }

  return [...conflicts].sort();
}

/**
 * Web Application Features - Get Public Paths.
 *
 * Reads invite and signed-webhook paths without resolving any secret values.
 * Invalid shapes contribute no path and remain the configuration validator's job.
 *
 * @param {Lib_WebApplicationFeatures_GetPublicPaths_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_GetPublicPaths_Returns}
 *
 * @since 4.0.0
 */
function getPublicPaths(
  configuration: Lib_WebApplicationFeatures_GetPublicPaths_Configuration,
): Lib_WebApplicationFeatures_GetPublicPaths_Returns {
  const paths: Lib_WebApplicationFeatures_GetPublicPaths_Paths = new Set();

  if (isRecord(configuration) === false) {
    return [];
  }

  const invitePath: Lib_WebApplicationFeatures_GetPublicPaths_InvitePath = getValueAtPath(configuration, 'invite-generator.options.path');

  if (typeof invitePath === 'string') {
    paths.add(invitePath);
  }

  const webhookRoutes: Lib_WebApplicationFeatures_GetPublicPaths_WebhookRoutes = configuration['map-webhooks'];

  if (Array.isArray(webhookRoutes) === true) {
    for (const webhookRoute of webhookRoutes) {
      const webhookPath: Lib_WebApplicationFeatures_GetPublicPaths_WebhookPath = getValueAtPath(webhookRoute, 'path');

      if (typeof webhookPath === 'string') {
        paths.add(webhookPath);
      }
    }
  }

  return [...paths];
}

/**
 * Web Application Features - Forget Web Application Routes.
 *
 * Drops the cached public paths of one database pool.
 * The next public request reads the current feature settings again.
 *
 * @param {Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Pool} pool - Pool.
 *
 * @returns {Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Returns}
 *
 * @since 4.0.0
 */
export function forgetWebApplicationRoutes(
  pool: Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Pool,
): Lib_WebApplicationFeatures_ForgetWebApplicationRoutes_Returns {
  routeCache.delete(pool);

  return;
}

/**
 * Web Application Features - Format Configuration Error.
 *
 * Produces path-focused feedback without echoing credentials or submitted values.
 * Unexpected failures are bounded before reaching structured diagnostics.
 *
 * @param {Lib_WebApplicationFeatures_FormatConfigurationError_Error} error - Error.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_FormatConfigurationError_Returns}
 *
 * @since 4.0.0
 */
function formatConfigurationError(
  error: Lib_WebApplicationFeatures_FormatConfigurationError_Error,
): Lib_WebApplicationFeatures_FormatConfigurationError_Returns {
  if (error instanceof z.ZodError) {
    const messages: Lib_WebApplicationFeatures_FormatConfigurationError_Messages = error['issues'].map((issue) => {
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
 * Web Application Features - Format Webhook Variable.
 *
 * Converts the six archived value types into bounded Discord-safe text.
 * Invalid source types receive an explicit unavailable marker.
 *
 * @param {Lib_WebApplicationFeatures_FormatWebhookVariable_Type}  type  - Type.
 * @param {Lib_WebApplicationFeatures_FormatWebhookVariable_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_FormatWebhookVariable_Returns}
 *
 * @since 4.0.0
 */
function formatWebhookVariable(
  type: Lib_WebApplicationFeatures_FormatWebhookVariable_Type,
  value: Lib_WebApplicationFeatures_FormatWebhookVariable_Value,
): Lib_WebApplicationFeatures_FormatWebhookVariable_Returns {
  switch (type) {
    case 'boolean': {
      if (typeof value !== 'boolean') {
        return 'Unavailable';
      }

      return (value === true) ? 'Yes' : 'No';
    }

    case 'string': {
      if (
        typeof value !== 'string'
        && typeof value !== 'number'
        && typeof value !== 'boolean'
      ) {
        return 'Unavailable';
      }

      return escapeDiscordText(String(value));
    }

    case 'ts-millis':
    case 'ts-seconds': {
      if (typeof value !== 'number' || Number.isFinite(value) === false) {
        return 'Unavailable';
      }

      const timestampSeconds: Lib_WebApplicationFeatures_FormatWebhookVariable_TimestampSeconds = Math.trunc(
        (type === 'ts-millis') ? value / 1_000 : value,
      );

      if (timestampSeconds < 0 || timestampSeconds > 253_402_300_799) {
        return 'Unavailable';
      }

      return `<t:${timestampSeconds}:F>`;
    }

    case 'usd-cents':
    case 'usd-dollars': {
      if (typeof value !== 'number' || Number.isFinite(value) === false) {
        return 'Unavailable';
      }

      const numberValue: Lib_WebApplicationFeatures_FormatWebhookVariable_NumberValue = (
        type === 'usd-cents'
      ) ? value / 100 : value;

      return currencyFormatter.format(numberValue);
    }

    default: {
      return 'Unavailable';
    }
  }
}

/**
 * Web Application Features - Get Enabled Feature.
 *
 * Reads only an explicitly enabled web-applications entry from settings.
 * Missing or malformed feature containers remain disabled.
 *
 * @param {Lib_WebApplicationFeatures_GetEnabledFeature_Settings} settings - Settings.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_GetEnabledFeature_Returns}
 *
 * @since 4.0.0
 */
function getEnabledFeature(
  settings: Lib_WebApplicationFeatures_GetEnabledFeature_Settings,
): Lib_WebApplicationFeatures_GetEnabledFeature_Returns {
  if (isRecord(settings['features']) === false) {
    return undefined;
  }

  const features: Lib_WebApplicationFeatures_GetEnabledFeature_Features = settings['features'];
  const rawFeature: Lib_WebApplicationFeatures_GetEnabledFeature_RawFeature = features['web-applications'];

  if (
    isRecord(rawFeature) === false
    || rawFeature['enabled'] !== true
  ) {
    return undefined;
  }

  return {
    configuration: rawFeature['configuration'],
  };
}

/**
 * Web Application Features - Get Value At Path.
 *
 * Traverses own properties only for a validated bounded dot path.
 * Prototype-sensitive segments are rejected even when present in parsed JSON.
 *
 * @param {Lib_WebApplicationFeatures_GetValueAtPath_Value} value - Value.
 * @param {Lib_WebApplicationFeatures_GetValueAtPath_Path}  path  - Path.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_GetValueAtPath_Returns}
 *
 * @since 4.0.0
 */
function getValueAtPath(
  value: Lib_WebApplicationFeatures_GetValueAtPath_Value,
  path: Lib_WebApplicationFeatures_GetValueAtPath_Path,
): Lib_WebApplicationFeatures_GetValueAtPath_Returns {
  const segments: Lib_WebApplicationFeatures_GetValueAtPath_Segments = path.split('.');
  let current: Lib_WebApplicationFeatures_GetValueAtPath_Current = value;

  for (const segment of segments) {
    if (
      segment === '__proto__'
      || segment === 'constructor'
      || segment === 'prototype'
      || isRecord(current) === false
      || Object.hasOwn(current, segment) === false
    ) {
      return undefined;
    }

    current = current[segment];
  }

  return current;
}

/**
 * Web Application Features - Is Record.
 *
 * Distinguishes keyed JSON objects from arrays and null.
 * Successful checks allow safe own-property traversal.
 *
 * @param {Lib_WebApplicationFeatures_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_WebApplicationFeatures_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_WebApplicationFeatures_IsRecord_Value,
): value is Lib_WebApplicationFeatures_IsRecord_TypeGuard {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}

/**
 * Web Application Features - Prepare Web Application Features.
 *
 * Validates one enabled feature and isolates configuration failure from the
 * authenticated control panel and unrelated bot capabilities.
 *
 * @param {Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Settings} settings - Settings.
 * @param {Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Secrets}  secrets  - Secrets.
 *
 * @returns {Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns}
 *
 * @since 4.0.0
 */
export function prepareWebApplicationFeatures(
  settings: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Settings,
  secrets: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Secrets,
): Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Returns {
  const activeFeatureKeys: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_ActiveFeatureKeys = [];
  const configurationErrors: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_ConfigurationErrors = [];
  const feature: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Feature = getEnabledFeature(settings);
  let runtime: Lib_WebApplicationFeatures_PrepareWebApplicationFeatures_Runtime = undefined;

  if (feature !== undefined) {
    try {
      runtime = compileWebApplicationRuntime(feature['configuration'], secrets);
      activeFeatureKeys.push('web-applications');
    } catch (error) {
      configurationErrors.push(`web-applications: ${formatConfigurationError(error)}`);
    }
  }

  return {
    activeFeatureKeys,
    configurationErrors,
    runtime,
  };
}

/**
 * Web Application Features - Read Invite Settings.
 *
 * Reports the public invite path a server's web-applications feature uses, without secrets.
 * The path counts as live only while the feature is turned on.
 *
 * @param {Lib_WebApplicationFeatures_ReadInviteSettings_Pool}            pool            - Pool.
 * @param {Lib_WebApplicationFeatures_ReadInviteSettings_GuildIdentifier} guildIdentifier - Guild identifier.
 *
 * @returns {Lib_WebApplicationFeatures_ReadInviteSettings_Returns}
 *
 * @since 4.0.0
 */
export async function readInviteSettings(
  pool: Lib_WebApplicationFeatures_ReadInviteSettings_Pool,
  guildIdentifier: Lib_WebApplicationFeatures_ReadInviteSettings_GuildIdentifier,
): Lib_WebApplicationFeatures_ReadInviteSettings_Returns {
  const settings: Lib_WebApplicationFeatures_ReadInviteSettings_Settings = await getNormalizedGuildSettings(
    pool,
    guildIdentifier,
  );
  const features: Lib_WebApplicationFeatures_ReadInviteSettings_Features = (settings === undefined) ? undefined : settings['features'];
  const rawFeature: Lib_WebApplicationFeatures_ReadInviteSettings_RawFeature = (isRecord(features) === true) ? features['web-applications'] : undefined;

  if (isRecord(rawFeature) === false) {
    return {
      enabled: false,
      path: null,
    };
  }

  const path: Lib_WebApplicationFeatures_ReadInviteSettings_Path = getValueAtPath(
    rawFeature['configuration'],
    'invite-generator.options.path',
  );

  if (typeof path !== 'string' || LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH.test(path) === false) {
    return {
      enabled: false,
      path: null,
    };
  }

  return {
    enabled: rawFeature['enabled'] === true,
    path,
  };
}

/**
 * Web Application Features - Render Webhook Content.
 *
 * Applies bounded own-property mappings to an operator-owned text template.
 * Missing or mistyped variables remain visible as unavailable values.
 *
 * @param {Lib_WebApplicationFeatures_RenderWebhookContent_Route} route - Route.
 * @param {Lib_WebApplicationFeatures_RenderWebhookContent_Body}  body  - Body.
 *
 * @returns {Lib_WebApplicationFeatures_RenderWebhookContent_Returns}
 *
 * @since 4.0.0
 */
export function renderWebhookContent(
  route: Lib_WebApplicationFeatures_RenderWebhookContent_Route,
  body: Lib_WebApplicationFeatures_RenderWebhookContent_Body,
): Lib_WebApplicationFeatures_RenderWebhookContent_Returns {
  let content: Lib_WebApplicationFeatures_RenderWebhookContent_Content = route['template'].replaceAll(
    '%YEAR%',
    String(new Date().getUTCFullYear()),
  );

  for (const variable of route['variables']) {
    const rawValue: Lib_WebApplicationFeatures_RenderWebhookContent_RawValue = getValueAtPath(
      body,
      variable['path'],
    );
    const formattedValue: Lib_WebApplicationFeatures_RenderWebhookContent_FormattedValue = formatWebhookVariable(
      variable['type'],
      rawValue,
    );

    content = content.replaceAll(`@${variable['identifier']}@`, formattedValue);
  }

  if (content.trim() === '' || content.length > 2_000) {
    throw new Error('Rendered webhook content must contain between 1 and 2000 characters.');
  }

  return content;
}

/**
 * Web Application Features - Verify Recaptcha.
 *
 * Exchanges a browser challenge with Google's fixed endpoint and checks the solving host.
 * Missing, oversized, malformed, unsuccessful, or foreign-host responses fail closed.
 *
 * @param {Lib_WebApplicationFeatures_VerifyRecaptcha_Token}            token            - Token.
 * @param {Lib_WebApplicationFeatures_VerifyRecaptcha_Secret}           secret           - Secret.
 * @param {Lib_WebApplicationFeatures_VerifyRecaptcha_ExpectedHostname} expectedHostname - Expected hostname.
 * @param {Lib_WebApplicationFeatures_VerifyRecaptcha_RemoteAddress}    [remoteAddress]  - Remote address.
 *
 * @returns {Lib_WebApplicationFeatures_VerifyRecaptcha_Returns}
 *
 * @since 4.0.0
 */
export async function verifyRecaptcha(
  token: Lib_WebApplicationFeatures_VerifyRecaptcha_Token,
  secret: Lib_WebApplicationFeatures_VerifyRecaptcha_Secret,
  expectedHostname: Lib_WebApplicationFeatures_VerifyRecaptcha_ExpectedHostname,
  remoteAddress?: Lib_WebApplicationFeatures_VerifyRecaptcha_RemoteAddress,
): Lib_WebApplicationFeatures_VerifyRecaptcha_Returns {
  if (token.trim() === '' || token.length > 4_096) {
    return false;
  }

  const form: Lib_WebApplicationFeatures_VerifyRecaptcha_Form = new URLSearchParams({
    response: token,
    secret,
  });

  if (remoteAddress !== undefined && isIP(remoteAddress) !== 0) {
    form.set('remoteip', remoteAddress);
  }

  const response: Lib_WebApplicationFeatures_VerifyRecaptcha_Response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      body: form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MILLISECONDS),
    },
  );
  const responseText: Lib_WebApplicationFeatures_VerifyRecaptcha_ResponseText = await response.text();

  if (
    response.ok === false
    || responseText.length > MAXIMUM_PROVIDER_RESPONSE_CHARACTERS
  ) {
    return false;
  }

  let parsedJson: Lib_WebApplicationFeatures_VerifyRecaptcha_ParsedJson = undefined;

  try {
    parsedJson = JSON.parse(responseText);
  } catch {
    return false;
  }

  const parsed: Lib_WebApplicationFeatures_VerifyRecaptcha_Parsed = captchaResponseSchema.safeParse(parsedJson);

  if (parsed['success'] === false || parsed['data']['success'] === false) {
    return false;
  }

  const solvedHostname: Lib_WebApplicationFeatures_VerifyRecaptcha_SolvedHostname = parsed['data']['hostname'];

  return (
    solvedHostname === undefined
    || solvedHostname.toLowerCase() === expectedHostname.toLowerCase()
  );
}

/**
 * Web Application Features - Verify Webhook Signature.
 *
 * Checks timestamp freshness and compares the HMAC digest in constant time.
 * An optional sha256 prefix remains compatible with conventional senders.
 *
 * @param {Lib_WebApplicationFeatures_VerifyWebhookSignature_Body}        body        - Body.
 * @param {Lib_WebApplicationFeatures_VerifyWebhookSignature_Timestamp}   timestamp   - Timestamp.
 * @param {Lib_WebApplicationFeatures_VerifyWebhookSignature_Signature}   signature   - Signature.
 * @param {Lib_WebApplicationFeatures_VerifyWebhookSignature_Secret}      secret      - Secret.
 * @param {Lib_WebApplicationFeatures_VerifyWebhookSignature_CurrentTime} currentTime - Current time.
 *
 * @returns {Lib_WebApplicationFeatures_VerifyWebhookSignature_Returns}
 *
 * @since 4.0.0
 */
export function verifyWebhookSignature(
  body: Lib_WebApplicationFeatures_VerifyWebhookSignature_Body,
  timestamp: Lib_WebApplicationFeatures_VerifyWebhookSignature_Timestamp,
  signature: Lib_WebApplicationFeatures_VerifyWebhookSignature_Signature,
  secret: Lib_WebApplicationFeatures_VerifyWebhookSignature_Secret,
  currentTime: Lib_WebApplicationFeatures_VerifyWebhookSignature_CurrentTime = Date.now(),
): Lib_WebApplicationFeatures_VerifyWebhookSignature_Returns {
  const signaturePattern: Lib_WebApplicationFeatures_VerifyWebhookSignature_Pattern = new RegExp(
    LIB_REGEX_PATTERN_WEBHOOK_SIGNATURE,
    'i',
  );

  if (
    LIB_REGEX_PATTERN_WEBHOOK_TIMESTAMP.test(timestamp) === false
    || signaturePattern.test(signature) === false
  ) {
    return false;
  }

  const timestampSeconds: Lib_WebApplicationFeatures_VerifyWebhookSignature_TimestampSeconds = Number.parseInt(
    timestamp,
    10,
  );

  if (Math.abs(currentTime - (timestampSeconds * 1_000)) > WEBHOOK_FRESHNESS_MILLISECONDS) {
    return false;
  }

  const normalizedSignature: Lib_WebApplicationFeatures_VerifyWebhookSignature_NormalizedSignature = (
    signature.toLowerCase().startsWith('sha256=') === true
  ) ? signature.slice(7).toLowerCase() : signature.toLowerCase();
  const expectedSignature: Lib_WebApplicationFeatures_VerifyWebhookSignature_ExpectedSignature = createWebhookSignature(
    body,
    timestamp,
    secret,
  );
  const providedBuffer: Lib_WebApplicationFeatures_VerifyWebhookSignature_ProvidedBuffer = Buffer.from(
    normalizedSignature,
    'hex',
  );
  const expectedBuffer: Lib_WebApplicationFeatures_VerifyWebhookSignature_ExpectedBuffer = Buffer.from(
    expectedSignature,
    'hex',
  );

  return (
    providedBuffer.length === expectedBuffer.length
    && timingSafeEqual(providedBuffer, expectedBuffer) === true
  );
}
