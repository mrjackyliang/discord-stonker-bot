/**
 * Regex - Administrator Username Pattern.
 *
 * Matches the 3 to 64 character username the mock control panel accepts for a
 * new administrator, starting with a letter or number.
 *
 * @since 4.2.1
 */
export const administratorUsernamePattern = /^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/;

/**
 * Regex - Base64 Padding Pattern.
 *
 * Matches the trailing padding that Base64URL encoding drops from WebAuthn
 * credential fields.
 *
 * @since 4.2.1
 */
export const base64PaddingPattern = /=+$/;

/**
 * Regex - Camel Case Boundary Pattern.
 *
 * Captures a lowercase letter followed by an uppercase letter, so a camelCase
 * schema key can be split into words for its label.
 *
 * @since 4.2.1
 */
export const camelCaseBoundaryPattern = /([a-z])([A-Z])/;

/**
 * Regex - Configuration Prefix Pattern.
 *
 * Matches the leading "configuration." on a feature issue path, which is
 * dropped before the path is shown next to its message.
 *
 * @since 4.2.1
 */
export const configurationPrefixPattern = /^configuration\./;

/**
 * Regex - Content Disposition Filename Pattern.
 *
 * Captures the quoted filename from a download response header, so a saved
 * export keeps the name the server chose.
 *
 * @since 4.2.1
 */
export const contentDispositionFilenamePattern = /filename="([^"]+)"/;

/**
 * Regex - Digit Pattern.
 *
 * Matches one digit when the password meter checks which character groups a
 * password uses.
 *
 * @since 4.2.1
 */
export const digitPattern = /\d/;

/**
 * Regex - Discord Snowflake Pattern.
 *
 * Matches a 17 to 20 digit Discord ID inside a backup file.
 * Anything else is rejected before import.
 *
 * @since 4.2.1
 */
export const discordSnowflakePattern = /^[0-9]{17,20}$/;

/**
 * Regex - Dotted Hostname Pattern.
 *
 * Matches a hostname made only of digits and dots, which marks an IPv4
 * address that passkeys cannot use as a relying party.
 *
 * @since 4.2.1
 */
export const dottedHostnamePattern = /^[\d.]+$/;

/**
 * Regex - Feature Key Pattern.
 *
 * Matches a feature key that starts with a lowercase letter and continues with
 * up to 99 lowercase letters, digits, or hyphens.
 *
 * @since 4.2.1
 */
export const featureKeyPattern = /^[a-z][a-z0-9-]{0,99}$/;

/**
 * Regex - Feature Path Pattern.
 *
 * Captures the feature key and the optional enabled suffix from the part of
 * a mock server route that follows the server ID.
 *
 * @since 4.2.1
 */
export const featurePathPattern = /^\/features\/([^/]+)(\/enabled)?$/;

/**
 * Regex - First Character Pattern.
 *
 * Matches the first character of a hint, so it can be capitalized before the
 * hint is shown.
 *
 * @since 4.2.1
 */
export const firstCharacterPattern = /^./;

/**
 * Regex - Hex Color Channels Pattern.
 *
 * Captures the red, green, and blue pairs of a six digit hex color, so the
 * invite page can work out a readable text color.
 *
 * @since 4.2.1
 */
export const hexColorChannelsPattern = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/;

/**
 * Regex - Hex Color Pattern.
 *
 * Matches a six digit hex color written with a leading number sign.
 * The mock control panel checks invite page accent colors against it.
 *
 * @since 4.2.1
 */
export const hexColorPattern = /^#[0-9a-f]{6}$/;

/**
 * Regex - Invite Footer Link Pattern.
 *
 * Captures either a Markdown-style link with an HTTPS address or a bare HTTPS
 * address from the invite page footer text.
 *
 * @since 4.2.1
 */
export const inviteFooterLinkPattern = /\[([^\]\n]{1,200})\]\((https:\/\/[^\s)]{1,2000})\)|(https:\/\/[^\s<>()[\]]{1,2000})/;

/**
 * Regex - Invite Images Path Pattern.
 *
 * Matches the mock route that receives invite page image uploads for one
 * server.
 *
 * @since 4.2.1
 */
export const inviteImagesPathPattern = /^\/api\/v1\/servers\/[^/]+\/invite-page\/images$/;

/**
 * Regex - Lowercase Letter Pattern.
 *
 * Matches one lowercase letter when the password meter checks which character
 * groups a password uses.
 *
 * @since 4.2.1
 */
export const lowercaseLetterPattern = /[a-z]/;

/**
 * Regex - Media Path Pattern.
 *
 * Captures the media ID from a mock media route.
 * Media IDs are hexadecimal UUIDs.
 *
 * @since 4.2.1
 */
export const mediaPathPattern = /^\/media\/([0-9a-f-]{36})$/;

/**
 * Regex - Non Digit Pattern.
 *
 * Matches one character that is not a digit, so code fields can strip
 * everything except the numbers a person typed or pasted.
 *
 * @since 4.2.1
 */
export const nonDigitPattern = /\D/;

/**
 * Regex - Notification Path Pattern.
 *
 * Captures the notification ID and the optional test suffix from a mock
 * notification route.
 *
 * @since 4.2.1
 */
export const notificationPathPattern = /^\/api\/v1\/notifications\/(ntf-[0-9a-f]{16})(\/test)?$/;

/**
 * Regex - Notification Target ID Pattern.
 *
 * Matches the fixed prefix and hexadecimal body of a notification target ID
 * inside a backup file.
 *
 * @since 4.2.1
 */
export const notificationTargetIdPattern = /^ntf-[0-9a-f]{16}$/;

/**
 * Regex - Schema Reference Pattern.
 *
 * Captures the definitions section and name from a local JSON Schema
 * reference.
 *
 * @since 4.2.1
 */
export const schemaReferencePattern = /^#\/(\$defs|definitions)\/(.+)$/;

/**
 * Regex - Separators Pattern.
 *
 * Matches one whitespace character or hyphen, so a typed recovery code can be
 * compared without its grouping.
 *
 * @since 4.2.1
 */
export const separatorsPattern = /[\s-]/;

/**
 * Regex - Server Path Pattern.
 *
 * Captures the server ID and the rest of the path from a mock server route.
 * The rest is matched again against the server's sub-routes.
 *
 * @since 4.2.1
 */
export const serverPathPattern = /^\/api\/v1\/servers\/([^/]+)(\/.*)?$/;

/**
 * Regex - Sha256 Hash Pattern.
 *
 * Matches a lowercase hexadecimal SHA-256 digest inside a backup file.
 * Anything else is rejected before import.
 *
 * @since 4.2.1
 */
export const sha256HashPattern = /^[0-9a-f]{64}$/;

/**
 * Regex - Symbol Pattern.
 *
 * Matches one character that is neither a letter nor a digit when the password
 * meter checks which character groups a password uses.
 *
 * @since 4.2.1
 */
export const symbolPattern = /[^a-zA-Z\d]/;

/**
 * Regex - Token ID Pattern.
 *
 * Matches the fixed prefix and hexadecimal body of an access token ID inside
 * a backup file.
 *
 * @since 4.2.1
 */
export const tokenIdPattern = /^tok-[0-9a-f]{16}$/;

/**
 * Regex - Token Path Pattern.
 *
 * Captures the token ID from a mock access token route.
 * Only lowercase letters, digits, and hyphens are accepted.
 *
 * @since 4.2.1
 */
export const tokenPathPattern = /^\/api\/v1\/auth\/tokens\/([a-z0-9-]+)$/;

/**
 * Regex - Totp Code Pattern.
 *
 * Matches the six digit code an authenticator app shows.
 * The mock control panel checks typed codes against it.
 *
 * @since 4.2.1
 */
export const totpCodePattern = /^[0-9]{6}$/;

/**
 * Regex - Trailing Carriage Return Pattern.
 *
 * Matches a carriage return at the end of a line, so pasted Windows line
 * endings are removed from list fields.
 *
 * @since 4.2.1
 */
export const trailingCarriageReturnPattern = /\r$/;

/**
 * Regex - Trailing Punctuation Pattern.
 *
 * Matches sentence punctuation at the end of a bare link, which stays outside
 * the link when the invite page footer is rendered.
 *
 * @since 4.2.1
 */
export const trailingPunctuationPattern = /[.,;:!?]+$/;

/**
 * Regex - Unsafe ID Character Pattern.
 *
 * Matches one character that is not allowed in an element ID, so schema paths
 * can be turned into field IDs.
 *
 * @since 4.2.1
 */
export const unsafeIdCharacterPattern = /[^A-Za-z0-9_-]/;

/**
 * Regex - Uppercase Letter Pattern.
 *
 * Matches one uppercase letter when the password meter checks which character
 * groups a password uses.
 *
 * @since 4.2.1
 */
export const uppercaseLetterPattern = /[A-Z]/;

/**
 * Regex - User Path Pattern.
 *
 * Captures the user ID and the optional password or two-factor reset suffix
 * from a mock user route.
 *
 * @since 4.2.1
 */
export const userPathPattern = /^\/api\/v1\/users\/([^/]+)(\/password|\/two-factor\/reset)?$/;

/**
 * Regex - Whitespace Pattern.
 *
 * Matches a run of whitespace, so copied keys can be compared without spaces
 * and names can be split into words.
 *
 * @since 4.2.1
 */
export const whitespacePattern = /\s+/;

/**
 * Regex - Word Separators Pattern.
 *
 * Matches a run of hyphens, underscores, or whitespace, so a schema key can be
 * split into words for its label.
 *
 * @since 4.2.1
 */
export const wordSeparatorsPattern = /[-_\s]+/;

/**
 * Regex - Year Pattern.
 *
 * Matches a four digit year from 1900 to 2099, which the password meter treats
 * as a guessable pattern.
 *
 * @since 4.2.1
 */
export const yearPattern = /(?:19|20)\d\d/;
