/**
 * Regex - Lib Regex Pattern Database Identifier.
 *
 * Restricts PostgreSQL role and database names used by container scripts.
 * The same boundary prevents option-like or shell-sensitive identifiers.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_DATABASE_IDENTIFIER = /^[a-z][a-z0-9_]*$/;

/**
 * Regex - Lib Regex Pattern Backup Grant.
 *
 * Accepts the opaque prefix and 32-byte base64url payload issued after fresh
 * identity confirmation. Digest lookup remains the authoritative check.
 *
 * @since UNRELEASED
 */
export const LIB_REGEX_PATTERN_BACKUP_GRANT = /^bkg_[A-Za-z0-9_-]{43}$/;

/**
 * Regex - Lib Regex Pattern Backup Totp Code.
 *
 * Restricts fresh backup confirmation to the six-digit authenticator value
 * accepted by the panel's current TOTP implementation.
 *
 * @since UNRELEASED
 */
export const LIB_REGEX_PATTERN_BACKUP_TOTP_CODE = /^\d{6}$/;

/**
 * Regex - Lib Regex Pattern Backup Feature Key.
 *
 * Restricts portable feature identifiers to the established kebab-case key
 * space used by the feature catalog and configuration database.
 *
 * @since UNRELEASED
 */
export const LIB_REGEX_PATTERN_BACKUP_FEATURE_KEY = /^[a-z][a-z0-9-]{0,99}$/;

/**
 * Regex - Lib Regex Pattern Notification Target ID.
 *
 * Accepts the stable hexadecimal identifiers stored for notification targets.
 * Collision handling still runs transactionally during import.
 *
 * @since UNRELEASED
 */
export const LIB_REGEX_PATTERN_NOTIFICATION_TARGET_ID = /^ntf-[0-9a-f]{16}$/;

/**
 * Regex - Lib Regex Pattern Panel Token ID.
 *
 * Accepts stable hexadecimal identifiers used by panel access tokens.
 * Import assigns a fresh identifier whenever the supplied one is occupied.
 *
 * @since UNRELEASED
 */
export const LIB_REGEX_PATTERN_PANEL_TOKEN_ID = /^tok-[0-9a-f]{16}$/;

/**
 * Regex - Lib Regex Pattern Sha256 Hash.
 *
 * Restricts portable stored token hashes to lowercase SHA-256 hexadecimal text.
 * The raw personal access token is never part of an export.
 *
 * @since UNRELEASED
 */
export const LIB_REGEX_PATTERN_SHA256_HASH = /^[0-9a-f]{64}$/;

/**
 * Regex - Lib Regex Pattern Discord Identifier.
 *
 * Accepts opaque Discord snowflakes without converting them to numbers.
 * String storage preserves the full identifier without precision loss.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_DISCORD_IDENTIFIER = /^\d{17,20}$/;

/**
 * Regex - Lib Regex Pattern Discord Markdown Character.
 *
 * Finds formatting metacharacters in untrusted webhook values before those
 * values enter operator-authored Discord message templates.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_DISCORD_MARKDOWN_CHARACTER = '[\\\\_*~`>|]';

/**
 * Regex - Lib Regex Pattern Discord Cdn URL.
 *
 * Provides a representative excluded attachment host for audit feature tests.
 * Runtime exclusions remain operator-configured and precompiled at startup.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_DISCORD_CDN_URL = '^https://cdn\\.discordapp\\.com/';

/**
 * Regex - Lib Regex Pattern Discord Webhook Path.
 *
 * Restricts encrypted webhook destinations to Discord's current HTTPS route.
 * Tokens remain outside configuration JSON and are never matched or logged.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_DISCORD_WEBHOOK_PATH = '^/api/webhooks/\\d{17,20}/[^/]+/?$';

/**
 * Regex - Lib Regex Pattern Impersonator Moderator.
 *
 * Provides a representative normalized identity expression for detector tests.
 * Central storage keeps regular-expression construction auditable.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_IMPERSONATOR_MODERATOR = '^moderator$';

/**
 * Regex - Lib Regex Pattern HTTP URL.
 *
 * Finds bounded HTTP and HTTPS candidates in message text for host auditing.
 * The URL parser performs structural validation before a host is reported.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_HTTP_URL = 'https?://[^\\s<>()]+';

/**
 * Regex - Lib Regex Pattern Identifier List Separator.
 *
 * Splits confirmed bulk-operation input on commas and whitespace characters.
 * Individual Discord identifiers are validated after tokenization.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_IDENTIFIER_LIST_SEPARATOR = '[,\\s]+';

/**
 * Regex - Lib Regex Pattern Positive Integer.
 *
 * Accepts unsigned decimal integers greater than zero for provider identifiers.
 * Leading signs and non-decimal representations are rejected.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_POSITIVE_INTEGER = /^[1-9]\d*$/;

/**
 * Regex - Lib Regex Pattern Panel Username.
 *
 * Keeps local account names URL-safe and easy to enter across devices.
 * Case-insensitive uniqueness remains enforced by PostgreSQL.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_PANEL_USERNAME = /^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/;

/**
 * Regex - Lib Regex Pattern Public Invite Path.
 *
 * Restricts visitor routes to an explicit invite or join namespace.
 * Control-panel and health-check paths cannot be shadowed by configuration.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH = /^\/(?:invite|join)(?:\/[A-Za-z0-9_-]+)*\/?$/;

/**
 * Regex - Lib Regex Pattern Public Webhook Path.
 *
 * Restricts signed inbound routes to the dedicated webhook namespace.
 * Bounded path segments avoid control-plane route collisions.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH = /^\/webhooks\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*\/?$/;

/**
 * Regex - Lib Regex Pattern Moderation Combining Marks.
 *
 * Removes Unicode combining marks after compatibility decomposition.
 * Message moderation uses this to compare visually equivalent phrases.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_MODERATION_COMBINING_MARKS = '\\p{M}+';

/**
 * Regex - Lib Regex Pattern Moderation Separators.
 *
 * Converts punctuation and symbols into spaces before phrase comparison.
 * Letters and numbers from every Unicode script remain searchable.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_MODERATION_SEPARATORS = '[^\\p{L}\\p{N}\\s]+';

/**
 * Regex - Lib Regex Pattern Scammer Account.
 *
 * Provides the minimal account keyword expression used by detector tests.
 * Central storage keeps regular-expression construction auditable.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_SCAMMER_ACCOUNT = 'account';

/**
 * Regex - Lib Regex Pattern Secret Key.
 *
 * Restricts operator-managed credential names to stable path-safe characters.
 * Legacy dotted paths and feature-owned hyphenated names remain compatible.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_SECRET_KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,511}$/;

/**
 * Regex - Lib Regex Pattern Totp Token.
 *
 * Accepts the bounded numeric codes produced by supported authenticator apps.
 * Cryptographic verification still determines whether a submitted code is valid.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_TOTP_TOKEN = /^\d{6,8}$/;

/**
 * Regex - Lib Regex Pattern Webhook Property Path.
 *
 * Accepts a bounded dot path without prototype-sensitive punctuation.
 * Each path is resolved by own-property traversal only.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_WEBHOOK_PROPERTY_PATH = /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+){0,9}$/;

/**
 * Regex - Lib Regex Pattern Webhook Signature.
 *
 * Accepts a SHA-256 hexadecimal digest with an optional conventional prefix.
 * Verification still uses constant-time byte comparison.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_WEBHOOK_SIGNATURE = '^(?:sha256=)?[a-f0-9]{64}$';

/**
 * Regex - Lib Regex Pattern Webhook Signature Prefix.
 *
 * Removes the optional conventional prefix after signature validation.
 * Dedupe keys then use one canonical representation for the same digest.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_WEBHOOK_SIGNATURE_PREFIX = '^sha256=';

/**
 * Regex - Lib Regex Pattern Webhook Timestamp.
 *
 * Accepts the current ten-digit Unix-seconds range used by signed requests.
 * A narrow freshness window provides the actual replay boundary.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_WEBHOOK_TIMESTAMP = /^[1-9]\d{9}$/;

/**
 * Regex - Lib Regex Pattern Webhook Variable Identifier.
 *
 * Preserves legacy upper-case placeholders while bounding their syntax.
 * Identifiers can be replaced without constructing dynamic regular expressions.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_WEBHOOK_VARIABLE_IDENTIFIER = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;

/**
 * Regex - Lib Regex Pattern Unsigned Integer.
 *
 * Validates precision-safe decimal bit fields stored in durable JSON jobs.
 * Discord REST adapters convert the bounded strings back to API values.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_UNSIGNED_INTEGER = /^\d+$/;

/**
 * Regex - Lib Regex Pattern Whitespace.
 *
 * Normalizes legacy template statements before allow-list comparison.
 * Callers choose global handling when the operation requires it.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_WHITESPACE = /\s+/;

/**
 * Regex - Lib Regex Pattern API Token.
 *
 * Matches a personal access token: dsb_ and 32 random bytes in base64url.
 * Other bearer values are rejected before any database lookup.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_API_TOKEN = /^dsb_[A-Za-z0-9_-]{43}$/;

/**
 * Regex - Lib Regex Pattern Bearer Authorization.
 *
 * Captures the credential from an Authorization header that uses the Bearer scheme.
 * Other schemes are ignored so they never reach token lookup. Callers ignore letter case.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_BEARER_AUTHORIZATION = /^Bearer +(.+)$/;

/**
 * Regex - Lib Regex Pattern Csrf Token.
 *
 * Matches the per-session token the control panel sends in the X-CSRF-Token header.
 * Malformed values fail before the stored digest is compared.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_CSRF_TOKEN = /^dsc_[A-Za-z0-9_-]{32}$/;

/**
 * Regex - Lib Regex Pattern Host Header.
 *
 * Accepts a hostname or IP address, with IPv6 in brackets and an optional port.
 * Anything else is ignored when building passkey origins and public links.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_HOST_HEADER = /^(\[[0-9A-Fa-f:.]+\]|[A-Za-z0-9.-]+)(:[0-9]{1,5})?$/;

/**
 * Regex - Lib Regex Pattern Session Token.
 *
 * Matches the opaque browser session cookie: dss_ and 32 random bytes in base64url.
 * Cookies with any other shape are ignored without a database lookup.
 *
 * @since 4.0.0
 */
export const LIB_REGEX_PATTERN_SESSION_TOKEN = /^dss_[A-Za-z0-9_-]{43}$/;
