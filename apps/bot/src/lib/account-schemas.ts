import { z } from 'zod';

import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_PANEL_USERNAME,
  LIB_REGEX_PATTERN_TOTP_TOKEN,
} from './regex.js';

import type {
  Lib_AccountSchemas_ExpiresAt_Context,
  Lib_AccountSchemas_ExpiresAt_Returns,
  Lib_AccountSchemas_ExpiresAt_Value,
  Lib_AccountSchemas_IsUnique_Returns,
  Lib_AccountSchemas_IsUnique_Values,
  Lib_AccountSchemas_ServerAccess_Context,
  Lib_AccountSchemas_ServerAccess_Returns,
  Lib_AccountSchemas_ServerAccess_Value,
} from '../types/lib/account-schemas.d.ts';

/**
 * Account Schemas - Expiration Format Message.
 *
 * Explains the accepted expiration format, the same words the other appliances use.
 * Only API clients see it, because the control panel always sends a valid date.
 *
 * @since 4.0.0
 */
const EXPIRATION_FORMAT_MESSAGE = 'Use an ISO 8601 date and time with a time zone, like 2030-01-01T00:00:00Z.';

/**
 * Account Schemas - Username Rule Message.
 *
 * Describes the username rule shared by setup, username changes, and new users.
 * The same words appear in the other appliances.
 *
 * @since 4.0.0
 */
const USERNAME_RULE_MESSAGE = 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.';

/**
 * Account Schemas - Is Unique.
 *
 * Reports whether a list repeats none of its values.
 * Scope and server lists use it to refuse duplicates.
 *
 * @param {Lib_AccountSchemas_IsUnique_Values} values - Values.
 *
 * @returns {Lib_AccountSchemas_IsUnique_Returns}
 *
 * @since 4.0.0
 */
function isUnique(values: Lib_AccountSchemas_IsUnique_Values): Lib_AccountSchemas_IsUnique_Returns {
  return new Set(values).size === values.length;
}

/**
 * Account Schemas - Check Expires At.
 *
 * Accepts an ISO 8601 date and time with a time zone that lies in the future.
 * An unreadable value gets only the format message, never the future one too.
 *
 * @param {Lib_AccountSchemas_ExpiresAt_Value}   value   - Value.
 * @param {Lib_AccountSchemas_ExpiresAt_Context} context - Context.
 *
 * @returns {Lib_AccountSchemas_ExpiresAt_Returns}
 *
 * @since 4.0.0
 */
function checkExpiresAt(value: Lib_AccountSchemas_ExpiresAt_Value, context: Lib_AccountSchemas_ExpiresAt_Context): Lib_AccountSchemas_ExpiresAt_Returns {
  if (z.iso.datetime({ offset: true }).safeParse(value).success === false) {
    context.addIssue({
      code: 'custom',
      message: EXPIRATION_FORMAT_MESSAGE,
    });

    return;
  }

  if (Date.parse(value) <= Date.now()) {
    context.addIssue({
      code: 'custom',
      message: 'Choose an expiration date in the future.',
    });
  }

  return;
}

/**
 * Account Schemas - Check Server Access.
 *
 * Requires at least one server unless the user may see every server.
 * The issue sits on the server list so the form can show it there.
 *
 * @param {Lib_AccountSchemas_ServerAccess_Value}   value   - Value.
 * @param {Lib_AccountSchemas_ServerAccess_Context} context - Context.
 *
 * @returns {Lib_AccountSchemas_ServerAccess_Returns}
 *
 * @since 4.0.0
 */
function checkServerAccess(value: Lib_AccountSchemas_ServerAccess_Value, context: Lib_AccountSchemas_ServerAccess_Context): Lib_AccountSchemas_ServerAccess_Returns {
  if (value['allServers'] === false && value['serverIds'].length === 0) {
    context.addIssue({
      code: 'custom',
      message: 'Choose at least one server, or give access to every server.',
      path: ['serverIds'],
    });
  }

  return;
}

/**
 * Account Schemas - Account Username.
 *
 * Applies the shared username rule to setup, username changes, and new users.
 * A missing name gets its own message instead of the rule.
 *
 * @since 4.0.0
 */
const accountUsername = z.string({ error: 'Enter a username.' })
  .trim()
  .min(1, {
    abort: true,
    error: 'Enter a username.',
  })
  .regex(LIB_REGEX_PATTERN_PANEL_USERNAME, USERNAME_RULE_MESSAGE);

/**
 * Account Schemas - New Password.
 *
 * Applies the shared password policy to setup, password changes, and new users.
 * Length is the only rule, so long passphrases are always accepted.
 *
 * @since 4.0.0
 */
const newPassword = z.string({ error: 'Use at least 12 characters.' })
  .min(12, 'Use at least 12 characters.')
  .max(1024, 'Use 1024 characters or fewer.');

/**
 * Account Schemas - Confirmation Password.
 *
 * Accepts the current password typed to confirm a sensitive change.
 * The value is only compared with the stored hash, so no policy applies.
 *
 * @since 4.0.0
 */
const confirmationPassword = z.string({ error: 'Enter your password.' })
  .min(1, 'Enter your password.')
  .max(1024, 'Use 1024 characters or fewer.');

/**
 * Account Schemas - Ceremony Identifier.
 *
 * Bounds the opaque value that links a second step or passkey prompt to its stored record.
 * The value is random and carries no account information.
 *
 * @since 4.0.0
 */
const ceremonyIdentifier = z.base64url().min(32).max(128);

/**
 * Account Schemas - Expires At.
 *
 * Reads an optional token expiration, where null means the token never expires.
 * Validation happens in one step so a bad value gets exactly one message.
 *
 * @since 4.0.0
 */
const expiresAt = z.string({ error: EXPIRATION_FORMAT_MESSAGE }).superRefine(checkExpiresAt).nullable().optional();

/**
 * Account Schemas - Panel Role.
 *
 * Lists the roles that can be given to another user.
 * The owner role belongs to the account made at setup and is never assigned.
 *
 * @since 4.0.0
 */
const panelRole = z.enum([
  'administrator',
  'operator',
  'viewer',
], { error: 'Choose administrator, operator, or viewer.' });

/**
 * Account Schemas - Server Identifiers.
 *
 * Validates the Discord servers a user may see, kept as strings to keep every digit.
 * Each server can be listed once.
 *
 * @since 4.0.0
 */
const serverIdentifiers = z.array(
  z.string().regex(LIB_REGEX_PATTERN_DISCORD_IDENTIFIER, 'Choose servers from the list.'),
  { error: 'Choose servers from the list.' },
)
  .max(500, 'Choose 500 servers or fewer.')
  .refine(isUnique, 'Choose each server only once.')
  .default([]);

/**
 * Account Schemas - Token Name.
 *
 * Applies the passkey name rule to the friendly name of a personal access token.
 * Names are unique per user, which the database checks.
 *
 * @since 4.0.0
 */
const tokenName = z.string({ error: 'Name this token.' })
  .trim()
  .min(1, 'Name this token.')
  .max(80, 'Use 80 characters or fewer.');

/**
 * Account Schemas - Token Scopes.
 *
 * Lists what a personal access token may do, each scope at most once.
 * Which scopes a user may grant depends on their role and is checked by the route.
 *
 * @since 4.0.0
 */
const tokenScopes = z.array(
  z.enum([
    'bot:control',
    'features:read',
    'features:write',
    'logs:read',
  ], { error: 'Choose from: bot:control, features:read, features:write, logs:read.' }),
  { error: 'Choose at least one scope.' },
)
  .min(1, 'Choose at least one scope.')
  .refine(isUnique, 'Choose each scope only once.');

/**
 * Account Schemas - Webauthn Registration Response.
 *
 * Bounds the browser's public-key credential before it is verified.
 * Fields that newer browsers add are dropped, and a null attachment means none.
 *
 * @since 4.0.0
 */
const webauthnRegistrationResponse = z.object({
  authenticatorAttachment: z.enum([
    'cross-platform',
    'platform',
  ]).nullable().optional().transform((value) => value ?? undefined),
  clientExtensionResults: z.record(z.string(), z.unknown()),
  id: z.base64url().min(1).max(2048),
  rawId: z.base64url().min(1).max(2048),
  response: z.object({
    attestationObject: z.base64url().min(1).max(65_536),
    authenticatorData: z.base64url().min(1).max(65_536).optional(),
    clientDataJSON: z.base64url().min(1).max(65_536),
    publicKey: z.base64url().min(1).max(65_536).optional(),
    publicKeyAlgorithm: z.number().int().optional(),
    transports: z.array(z.string().min(1).max(32)).max(16).optional(),
  }),
  type: z.literal('public-key'),
});

/**
 * Account Schemas - Webauthn Authentication Response.
 *
 * Bounds a passkey assertion before its signature, origin, and counter are checked.
 * A missing user handle fails the later check against the passkey's owner.
 *
 * @since 4.0.0
 */
const webauthnAuthenticationResponse = z.object({
  authenticatorAttachment: z.enum([
    'cross-platform',
    'platform',
  ]).nullable().optional().transform((value) => value ?? undefined),
  clientExtensionResults: z.record(z.string(), z.unknown()),
  id: z.base64url().min(1).max(2048),
  rawId: z.base64url().min(1).max(2048),
  response: z.object({
    authenticatorData: z.base64url().min(1).max(65_536),
    clientDataJSON: z.base64url().min(1).max(65_536),
    signature: z.base64url().min(1).max(65_536),
    userHandle: z.base64url().min(1).max(128).nullable().optional().transform((value) => value ?? undefined),
  }),
  type: z.literal('public-key'),
});

/**
 * Account Schemas - Passkey Credential Identifier.
 *
 * Validates the passkey id taken from a route path before it reaches the database.
 * Malformed ids are answered like passkeys that no longer exist.
 *
 * @since 4.0.0
 */
export const passkeyCredentialIdentifier = z.base64url().min(1).max(2048);

/**
 * Account Schemas - Passkey Registration Start.
 *
 * Names a new passkey and confirms the current password before it is added.
 * Names follow the shared rule of at most 80 characters.
 *
 * @since 4.0.0
 */
export const passkeyRegistrationStart = z.object({
  name: z.string({ error: 'Name this passkey.' }).trim().min(1, 'Name this passkey.').max(80, 'Use 80 characters or fewer.'),
  password: confirmationPassword,
}).strict();

/**
 * Account Schemas - Passkey Registration Verify.
 *
 * Couples one browser attestation with its stored, short-lived ceremony.
 * Cryptographic checks run only after this shape check.
 *
 * @since 4.0.0
 */
export const passkeyRegistrationVerify = z.object({
  ceremonyId: ceremonyIdentifier,
  credential: webauthnRegistrationResponse,
}).strict();

/**
 * Account Schemas - Passkey Sign In Verify.
 *
 * Couples one browser assertion with its stored, anonymous sign-in ceremony.
 * The account comes only from the stored passkey, never from the request.
 *
 * @since 4.0.0
 */
export const passkeySignInVerify = z.object({
  ceremonyId: ceremonyIdentifier,
  credential: webauthnAuthenticationResponse,
}).strict();

/**
 * Account Schemas - Password Change.
 *
 * Requires the current password next to the new one.
 * The new password follows the same policy as first-run setup.
 *
 * @since 4.0.0
 */
export const passwordChange = z.object({
  currentPassword: z.string({ error: 'Enter your current password.' }).min(1, 'Enter your current password.').max(1024, 'Use 1024 characters or fewer.'),
  newPassword,
}).strict();

/**
 * Account Schemas - Password Confirmation.
 *
 * Carries the current password for changes to sign-in methods.
 * A stolen browser session alone cannot weaken or take over the account.
 *
 * @since 4.0.0
 */
export const passwordConfirmation = z.object({
  password: confirmationPassword,
}).strict();

/**
 * Account Schemas - Setup Claim.
 *
 * Validates the one-time code and the owner account made on a new container.
 * The code is normalized and compared with its stored digest afterward.
 *
 * @since 4.0.0
 */
export const setupClaim = z.object({
  claimCode: z.string({ error: 'Enter the setup code from the container log.' }).trim().min(1, 'Enter the setup code from the container log.'),
  password: newPassword,
  username: accountUsername,
}).strict();

/**
 * Account Schemas - Sign In.
 *
 * Validates the username and password that start a browser session.
 * The password is only compared with a slow stored hash.
 *
 * @since 4.0.0
 */
export const signIn = z.object({
  password: z.string({ error: 'Enter your password.' }).min(1, 'Enter your password.'),
  username: z.string({ error: 'Enter your username.' }).trim().min(1, 'Enter your username.'),
}).strict();

/**
 * Account Schemas - Sign In Second Factor.
 *
 * Validates the second step of a password sign-in.
 * The code is an authenticator code or a recovery code.
 *
 * @since 4.0.0
 */
export const signInSecondFactor = z.object({
  challenge: ceremonyIdentifier,
  code: z.string({ error: 'Enter the code from your authenticator app, or a recovery code.' }).trim().min(1, 'Enter the code from your authenticator app, or a recovery code.'),
}).strict();

/**
 * Account Schemas - Token Create.
 *
 * Validates the friendly name, scopes, and optional expiration of a new token.
 * The token's value is always made on the server.
 *
 * @since 4.0.0
 */
export const tokenCreate = z.object({
  expiresAt,
  name: tokenName,
  scopes: tokenScopes,
}).strict();

/**
 * Account Schemas - Token Update.
 *
 * Validates a token edit; leaving out the expiration keeps it and null removes it.
 * The token's value never changes.
 *
 * @since 4.0.0
 */
export const tokenUpdate = z.object({
  expiresAt,
  name: tokenName,
  scopes: tokenScopes,
}).strict();

/**
 * Account Schemas - Totp Enable.
 *
 * Accepts the first code from the authenticator app to finish its setup.
 * A matching code proves the app holds the secret shown on screen.
 *
 * @since 4.0.0
 */
export const totpEnable = z.object({
  code: z.string({ error: 'Enter the 6-digit code from your app.' })
    .trim()
    .length(6, {
      abort: true,
      error: 'Enter the 6-digit code from your app.',
    })
    .regex(LIB_REGEX_PATTERN_TOTP_TOKEN, 'Enter the 6-digit code from your app.'),
}).strict();

/**
 * Account Schemas - User Create.
 *
 * Validates a new panel user, their temporary password, role, and server access.
 * Whether the creator may grant that access is checked by the route.
 *
 * @since 4.0.0
 */
export const userCreate = z.object({
  allServers: z.boolean({ error: 'Choose whether this user can see every server.' }),
  password: newPassword,
  role: panelRole,
  serverIds: serverIdentifiers,
  username: accountUsername,
}).strict().superRefine(checkServerAccess);

/**
 * Account Schemas - User Password Reset.
 *
 * Sets a new temporary password for another user.
 * It follows the same policy as every other new password.
 *
 * @since 4.0.0
 */
export const userPasswordReset = z.object({
  password: newPassword,
}).strict();

/**
 * Account Schemas - User Update.
 *
 * Validates a change to another user's role, server access, or sign-in permission.
 * Usernames and passwords change through their own routes.
 *
 * @since 4.0.0
 */
export const userUpdate = z.object({
  allServers: z.boolean({ error: 'Choose whether this user can see every server.' }),
  enabled: z.boolean({ error: 'Choose whether this user can sign in.' }),
  role: panelRole,
  serverIds: serverIdentifiers,
}).strict().superRefine(checkServerAccess);

/**
 * Account Schemas - Username Change.
 *
 * Requires the current password before the account is renamed.
 * The new username follows the same rule as first-run setup.
 *
 * @since 4.0.0
 */
export const usernameChange = z.object({
  password: confirmationPassword,
  username: accountUsername,
}).strict();
