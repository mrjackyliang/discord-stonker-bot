import {
  randomBytes,
  randomInt,
} from 'node:crypto';

import {
  hash,
  verify,
} from '@node-rs/argon2';
import {
  Secret,
  TOTP,
} from 'otpauth';

import {
  decryptSecret,
  encryptSecret,
} from './credential-vault.js';
import { digestValue } from './panel-sessions.js';
import { LIB_REGEX_PATTERN_WHITESPACE } from './regex.js';

import type {
  Lib_PanelAuth_AuthenticatePanelUser_IsValid,
  Lib_PanelAuth_AuthenticatePanelUser_Password,
  Lib_PanelAuth_AuthenticatePanelUser_Pool,
  Lib_PanelAuth_AuthenticatePanelUser_QueryRow,
  Lib_PanelAuth_AuthenticatePanelUser_Result,
  Lib_PanelAuth_AuthenticatePanelUser_Returns,
  Lib_PanelAuth_AuthenticatePanelUser_Row,
  Lib_PanelAuth_AuthenticatePanelUser_Username,
  Lib_PanelAuth_ChangePanelPassword_Client,
  Lib_PanelAuth_ChangePanelPassword_KeepSessionToken,
  Lib_PanelAuth_ChangePanelPassword_NewPassword,
  Lib_PanelAuth_ChangePanelPassword_PasswordHash,
  Lib_PanelAuth_ChangePanelPassword_Pool,
  Lib_PanelAuth_ChangePanelPassword_Returns,
  Lib_PanelAuth_ChangePanelPassword_UserId,
  Lib_PanelAuth_ChangePanelUsername_Conflict,
  Lib_PanelAuth_ChangePanelUsername_Pool,
  Lib_PanelAuth_ChangePanelUsername_QueryRow,
  Lib_PanelAuth_ChangePanelUsername_Result,
  Lib_PanelAuth_ChangePanelUsername_Returns,
  Lib_PanelAuth_ChangePanelUsername_Row,
  Lib_PanelAuth_ChangePanelUsername_UserId,
  Lib_PanelAuth_ChangePanelUsername_Username,
  Lib_PanelAuth_CodeAlphabet,
  Lib_PanelAuth_ConfirmPanelPassword_Password,
  Lib_PanelAuth_ConfirmPanelPassword_Pool,
  Lib_PanelAuth_ConfirmPanelPassword_QueryRow,
  Lib_PanelAuth_ConfirmPanelPassword_Result,
  Lib_PanelAuth_ConfirmPanelPassword_Returns,
  Lib_PanelAuth_ConfirmPanelPassword_Row,
  Lib_PanelAuth_ConfirmPanelPassword_UserId,
  Lib_PanelAuth_ConsumePanelRecoveryCode_Code,
  Lib_PanelAuth_ConsumePanelRecoveryCode_NormalizedCode,
  Lib_PanelAuth_ConsumePanelRecoveryCode_Pool,
  Lib_PanelAuth_ConsumePanelRecoveryCode_Result,
  Lib_PanelAuth_ConsumePanelRecoveryCode_Returns,
  Lib_PanelAuth_ConsumePanelRecoveryCode_UserId,
  Lib_PanelAuth_CreatePanelSignInChallenge_Challenge,
  Lib_PanelAuth_CreatePanelSignInChallenge_Pool,
  Lib_PanelAuth_CreatePanelSignInChallenge_QueryRow,
  Lib_PanelAuth_CreatePanelSignInChallenge_Result,
  Lib_PanelAuth_CreatePanelSignInChallenge_Returns,
  Lib_PanelAuth_CreatePanelSignInChallenge_Row,
  Lib_PanelAuth_CreatePanelSignInChallenge_UserId,
  Lib_PanelAuth_CreatePanelTotpSecret_Returns,
  Lib_PanelAuth_CreatePanelTotpSecret_Totp,
  Lib_PanelAuth_CreatePanelTotpSecret_Username,
  Lib_PanelAuth_DeletePanelSignInChallenge_Challenge,
  Lib_PanelAuth_DeletePanelSignInChallenge_Pool,
  Lib_PanelAuth_DeletePanelSignInChallenge_Returns,
  Lib_PanelAuth_DisablePanelTotp_Client,
  Lib_PanelAuth_DisablePanelTotp_Pool,
  Lib_PanelAuth_DisablePanelTotp_Result,
  Lib_PanelAuth_DisablePanelTotp_Returns,
  Lib_PanelAuth_DisablePanelTotp_UserId,
  Lib_PanelAuth_DummyPasswordHash,
  Lib_PanelAuth_EnablePanelTotp_Client,
  Lib_PanelAuth_EnablePanelTotp_CredentialKey,
  Lib_PanelAuth_EnablePanelTotp_Pool,
  Lib_PanelAuth_EnablePanelTotp_RecoveryCodes,
  Lib_PanelAuth_EnablePanelTotp_Returns,
  Lib_PanelAuth_EnablePanelTotp_Secret,
  Lib_PanelAuth_EnablePanelTotp_SecretCiphertext,
  Lib_PanelAuth_EnablePanelTotp_Step,
  Lib_PanelAuth_EnablePanelTotp_UserId,
  Lib_PanelAuth_GeneratePanelRecoveryCodes_Characters,
  Lib_PanelAuth_GeneratePanelRecoveryCodes_Codes,
  Lib_PanelAuth_GeneratePanelRecoveryCodes_Returns,
  Lib_PanelAuth_GetDummyPasswordHash_Returns,
  Lib_PanelAuth_GetPanelAccount_Pool,
  Lib_PanelAuth_GetPanelAccount_QueryRow,
  Lib_PanelAuth_GetPanelAccount_Result,
  Lib_PanelAuth_GetPanelAccount_Returns,
  Lib_PanelAuth_GetPanelAccount_Row,
  Lib_PanelAuth_GetPanelAccount_UserId,
  Lib_PanelAuth_GetPanelSecurity_PasskeyResult,
  Lib_PanelAuth_GetPanelSecurity_Pool,
  Lib_PanelAuth_GetPanelSecurity_QueryRow,
  Lib_PanelAuth_GetPanelSecurity_Result,
  Lib_PanelAuth_GetPanelSecurity_Returns,
  Lib_PanelAuth_GetPanelSecurity_Row,
  Lib_PanelAuth_GetPanelSecurity_UserId,
  Lib_PanelAuth_GetPanelSignInChallenge_Challenge,
  Lib_PanelAuth_GetPanelSignInChallenge_Pool,
  Lib_PanelAuth_GetPanelSignInChallenge_QueryRow,
  Lib_PanelAuth_GetPanelSignInChallenge_Result,
  Lib_PanelAuth_GetPanelSignInChallenge_Returns,
  Lib_PanelAuth_GetPanelSignInChallenge_Row,
  Lib_PanelAuth_GetPanelTotpEnrollment_CredentialKey,
  Lib_PanelAuth_GetPanelTotpEnrollment_Pool,
  Lib_PanelAuth_GetPanelTotpEnrollment_QueryRow,
  Lib_PanelAuth_GetPanelTotpEnrollment_Result,
  Lib_PanelAuth_GetPanelTotpEnrollment_Returns,
  Lib_PanelAuth_GetPanelTotpEnrollment_Row,
  Lib_PanelAuth_GetPanelTotpEnrollment_UserId,
  Lib_PanelAuth_HashPanelPassword_Password,
  Lib_PanelAuth_HashPanelPassword_Returns,
  Lib_PanelAuth_HashPanelRecoveryCode_NormalizedCode,
  Lib_PanelAuth_HashPanelRecoveryCode_Returns,
  Lib_PanelAuth_HashPanelRecoveryCode_UserId,
  Lib_PanelAuth_HasPanelTotp_Pool,
  Lib_PanelAuth_HasPanelTotp_Result,
  Lib_PanelAuth_HasPanelTotp_Returns,
  Lib_PanelAuth_HasPanelTotp_UserId,
  Lib_PanelAuth_InsertRecoveryCodes_Client,
  Lib_PanelAuth_InsertRecoveryCodes_Codes,
  Lib_PanelAuth_InsertRecoveryCodes_Returns,
  Lib_PanelAuth_InsertRecoveryCodes_UserId,
  Lib_PanelAuth_NormalizePanelRecoveryCode_Characters,
  Lib_PanelAuth_NormalizePanelRecoveryCode_Returns,
  Lib_PanelAuth_NormalizePanelRecoveryCode_Value,
  Lib_PanelAuth_PasswordHashOptions,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_Challenge,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_ChallengeHash,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_FailureLimit,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_Pool,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_QueryRow,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_Result,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_Returns,
  Lib_PanelAuth_RecordPanelSignInChallengeFailure_Row,
  Lib_PanelAuth_RecoveryCodeCharacters,
  Lib_PanelAuth_ReplacePanelRecoveryCodes_Client,
  Lib_PanelAuth_ReplacePanelRecoveryCodes_Pool,
  Lib_PanelAuth_ReplacePanelRecoveryCodes_RecoveryCodes,
  Lib_PanelAuth_ReplacePanelRecoveryCodes_Returns,
  Lib_PanelAuth_ReplacePanelRecoveryCodes_UserId,
  Lib_PanelAuth_RunTransaction_Callback,
  Lib_PanelAuth_RunTransaction_Client,
  Lib_PanelAuth_RunTransaction_Pool,
  Lib_PanelAuth_RunTransaction_Result,
  Lib_PanelAuth_RunTransaction_Returns,
  Lib_PanelAuth_StartPanelTotpEnrollment_CredentialKey,
  Lib_PanelAuth_StartPanelTotpEnrollment_Pool,
  Lib_PanelAuth_StartPanelTotpEnrollment_QueryRow,
  Lib_PanelAuth_StartPanelTotpEnrollment_Result,
  Lib_PanelAuth_StartPanelTotpEnrollment_Returns,
  Lib_PanelAuth_StartPanelTotpEnrollment_Row,
  Lib_PanelAuth_StartPanelTotpEnrollment_Secret,
  Lib_PanelAuth_StartPanelTotpEnrollment_UserId,
  Lib_PanelAuth_TotpIssuer,
  Lib_PanelAuth_VerifyPanelPassword_Password,
  Lib_PanelAuth_VerifyPanelPassword_PasswordHash,
  Lib_PanelAuth_VerifyPanelPassword_Returns,
  Lib_PanelAuth_VerifyPanelTotp_Code,
  Lib_PanelAuth_VerifyPanelTotp_CredentialKey,
  Lib_PanelAuth_VerifyPanelTotp_MatchedStep,
  Lib_PanelAuth_VerifyPanelTotp_Now,
  Lib_PanelAuth_VerifyPanelTotp_Pool,
  Lib_PanelAuth_VerifyPanelTotp_QueryRow,
  Lib_PanelAuth_VerifyPanelTotp_Result,
  Lib_PanelAuth_VerifyPanelTotp_Returns,
  Lib_PanelAuth_VerifyPanelTotp_Row,
  Lib_PanelAuth_VerifyPanelTotp_Secret,
  Lib_PanelAuth_VerifyPanelTotp_Update,
  Lib_PanelAuth_VerifyPanelTotp_UserId,
  Lib_PanelAuth_VerifyPanelTotpCode_Code,
  Lib_PanelAuth_VerifyPanelTotpCode_Delta,
  Lib_PanelAuth_VerifyPanelTotpCode_Now,
  Lib_PanelAuth_VerifyPanelTotpCode_Returns,
  Lib_PanelAuth_VerifyPanelTotpCode_Secret,
  Lib_PanelAuth_VerifyPanelTotpCode_Totp,
} from '../types/lib/panel-auth.d.ts';

/**
 * Panel Auth - Code Alphabet.
 *
 * Skips look-alike characters so recovery codes copied from paper still work.
 * The other appliances use the same alphabet.
 *
 * @since 4.0.0
 */
const CODE_ALPHABET: Lib_PanelAuth_CodeAlphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Panel Auth - Recovery Code Characters.
 *
 * Lists every character a typed recovery code may contain after normalizing.
 * Older codes used hexadecimal digits, which this set also covers.
 *
 * @since 4.0.0
 */
const RECOVERY_CODE_CHARACTERS: Lib_PanelAuth_RecoveryCodeCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Panel Auth - Totp Issuer.
 *
 * Names the account in authenticator apps.
 * Existing secrets keep working because the issuer is only a label.
 *
 * @since 4.0.0
 */
const TOTP_ISSUER: Lib_PanelAuth_TotpIssuer = 'Stonker Bot for Discord';

/**
 * Panel Auth - Password Hash Options.
 *
 * Applies OWASP's minimum Argon2id memory and iteration settings.
 * They match the hashes already stored, so existing passwords keep working.
 *
 * @since 4.0.0
 */
const passwordHashOptions: Lib_PanelAuth_PasswordHashOptions = {
  algorithm: 2,
  memoryCost: 19_456,
  outputLen: 32,
  parallelism: 1,
  timeCost: 2,
};

/**
 * Panel Auth - Dummy Password Hash.
 *
 * Holds a hash made once for checks against usernames that don't exist.
 * Unknown and known usernames then take the same time to reject.
 *
 * @since 4.0.0
 */
let dummyPasswordHash: Lib_PanelAuth_DummyPasswordHash = undefined;

/**
 * Panel Auth - Authenticate Panel User.
 *
 * Checks a username and password against an enabled account.
 * Unknown and suspended accounts still run a full hash check, so timing reveals nothing.
 *
 * @param {Lib_PanelAuth_AuthenticatePanelUser_Pool}     pool     - Pool.
 * @param {Lib_PanelAuth_AuthenticatePanelUser_Username} username - Username.
 * @param {Lib_PanelAuth_AuthenticatePanelUser_Password} password - Password.
 *
 * @returns {Lib_PanelAuth_AuthenticatePanelUser_Returns}
 *
 * @since 4.0.0
 */
export async function authenticatePanelUser(
  pool: Lib_PanelAuth_AuthenticatePanelUser_Pool,
  username: Lib_PanelAuth_AuthenticatePanelUser_Username,
  password: Lib_PanelAuth_AuthenticatePanelUser_Password,
): Lib_PanelAuth_AuthenticatePanelUser_Returns {
  const result: Lib_PanelAuth_AuthenticatePanelUser_Result = await pool.query<Lib_PanelAuth_AuthenticatePanelUser_QueryRow>(
    'SELECT panel_users.id::text AS id, panel_users.username, panel_users.role, panel_users.all_guilds, panel_users.enabled, panel_users.password_hash, ARRAY(SELECT guild_id FROM panel_user_guild_access WHERE panel_user_guild_access.user_id = panel_users.id ORDER BY guild_id) AS guild_ids, EXISTS(SELECT 1 FROM panel_totp_credentials WHERE panel_totp_credentials.user_id = panel_users.id) AS totp_enabled FROM panel_users WHERE LOWER(panel_users.username) = LOWER($1)',
    [username.trim()],
  );
  const row: Lib_PanelAuth_AuthenticatePanelUser_Row = result.rows[0];

  if (row === undefined || row['enabled'] === false) {
    await verifyPanelPassword(await getDummyPasswordHash(), password);

    return undefined;
  }

  const isValid: Lib_PanelAuth_AuthenticatePanelUser_IsValid = await verifyPanelPassword(row['password_hash'], password);

  if (isValid === false) {
    return undefined;
  }

  return {
    allServers: row['all_guilds'],
    id: row['id'],
    role: row['role'],
    serverIds: (row['all_guilds'] === true) ? [] : [...row['guild_ids']],
    totpEnabled: row['totp_enabled'],
    username: row['username'],
  };
}

/**
 * Panel Auth - Change Panel Password.
 *
 * Replaces a user's password and signs out every other browser of that user.
 * The browser that made the change stays signed in.
 *
 * @param {Lib_PanelAuth_ChangePanelPassword_Pool}             pool             - Pool.
 * @param {Lib_PanelAuth_ChangePanelPassword_UserId}           userId           - User id.
 * @param {Lib_PanelAuth_ChangePanelPassword_NewPassword}      newPassword      - New password.
 * @param {Lib_PanelAuth_ChangePanelPassword_KeepSessionToken} keepSessionToken - Keep session token.
 *
 * @returns {Lib_PanelAuth_ChangePanelPassword_Returns}
 *
 * @since 4.0.0
 */
export async function changePanelPassword(
  pool: Lib_PanelAuth_ChangePanelPassword_Pool,
  userId: Lib_PanelAuth_ChangePanelPassword_UserId,
  newPassword: Lib_PanelAuth_ChangePanelPassword_NewPassword,
  keepSessionToken: Lib_PanelAuth_ChangePanelPassword_KeepSessionToken,
): Lib_PanelAuth_ChangePanelPassword_Returns {
  const passwordHash: Lib_PanelAuth_ChangePanelPassword_PasswordHash = await hashPanelPassword(newPassword);

  await runTransaction(pool, async (client: Lib_PanelAuth_ChangePanelPassword_Client) => {
    await client.query('UPDATE panel_users SET password_hash = $2, updated_at = NOW() WHERE id = $1', [
      userId,
      passwordHash,
    ]);

    await client.query('DELETE FROM panel_sessions WHERE user_id = $1 AND token_hash <> $2', [
      userId,
      digestValue(keepSessionToken),
    ]);

    return true;
  });

  return;
}

/**
 * Panel Auth - Change Panel Username.
 *
 * Renames a user unless another user already has that name in any letter case.
 * Sessions and tokens keep working and show the new name.
 *
 * @param {Lib_PanelAuth_ChangePanelUsername_Pool}     pool     - Pool.
 * @param {Lib_PanelAuth_ChangePanelUsername_UserId}   userId   - User id.
 * @param {Lib_PanelAuth_ChangePanelUsername_Username} username - Username.
 *
 * @returns {Lib_PanelAuth_ChangePanelUsername_Returns}
 *
 * @since 4.0.0
 */
export async function changePanelUsername(
  pool: Lib_PanelAuth_ChangePanelUsername_Pool,
  userId: Lib_PanelAuth_ChangePanelUsername_UserId,
  username: Lib_PanelAuth_ChangePanelUsername_Username,
): Lib_PanelAuth_ChangePanelUsername_Returns {
  const conflict: Lib_PanelAuth_ChangePanelUsername_Conflict = await pool.query('SELECT id FROM panel_users WHERE LOWER(username) = LOWER($1) AND id <> $2', [
    username,
    userId,
  ]);

  if ((conflict.rowCount ?? 0) > 0) {
    return 'conflict';
  }

  try {
    const result: Lib_PanelAuth_ChangePanelUsername_Result = await pool.query<Lib_PanelAuth_ChangePanelUsername_QueryRow>(
      'UPDATE panel_users SET username = $2, updated_at = NOW() WHERE id = $1 RETURNING id::text AS id, username, role',
      [
        userId,
        username,
      ],
    );
    const row: Lib_PanelAuth_ChangePanelUsername_Row = result.rows[0];

    if (row === undefined) {
      return 'not-found';
    }

    return {
      id: row['id'],
      role: row['role'],
      username: row['username'],
    };
  } catch (error) {
    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'conflict';
    }

    throw error;
  }
}

/**
 * Panel Auth - Confirm Panel Password.
 *
 * Rechecks a signed-in user's password before a sensitive change.
 * Suspended users never pass because their sessions no longer resolve.
 *
 * @param {Lib_PanelAuth_ConfirmPanelPassword_Pool}     pool     - Pool.
 * @param {Lib_PanelAuth_ConfirmPanelPassword_UserId}   userId   - User id.
 * @param {Lib_PanelAuth_ConfirmPanelPassword_Password} password - Password.
 *
 * @returns {Lib_PanelAuth_ConfirmPanelPassword_Returns}
 *
 * @since 4.0.0
 */
export async function confirmPanelPassword(
  pool: Lib_PanelAuth_ConfirmPanelPassword_Pool,
  userId: Lib_PanelAuth_ConfirmPanelPassword_UserId,
  password: Lib_PanelAuth_ConfirmPanelPassword_Password,
): Lib_PanelAuth_ConfirmPanelPassword_Returns {
  const result: Lib_PanelAuth_ConfirmPanelPassword_Result = await pool.query<Lib_PanelAuth_ConfirmPanelPassword_QueryRow>('SELECT password_hash FROM panel_users WHERE id = $1 AND enabled = TRUE', [userId]);
  const row: Lib_PanelAuth_ConfirmPanelPassword_Row = result.rows[0];

  if (row === undefined) {
    await verifyPanelPassword(await getDummyPasswordHash(), password);

    return false;
  }

  return verifyPanelPassword(row['password_hash'], password);
}

/**
 * Panel Auth - Consume Panel Recovery Code.
 *
 * Accepts an unused recovery code once and marks it used.
 * Letter case, spaces, and dashes in the typed code don't matter.
 *
 * @param {Lib_PanelAuth_ConsumePanelRecoveryCode_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_ConsumePanelRecoveryCode_UserId} userId - User id.
 * @param {Lib_PanelAuth_ConsumePanelRecoveryCode_Code}   code   - Code.
 *
 * @returns {Lib_PanelAuth_ConsumePanelRecoveryCode_Returns}
 *
 * @since 4.0.0
 */
export async function consumePanelRecoveryCode(
  pool: Lib_PanelAuth_ConsumePanelRecoveryCode_Pool,
  userId: Lib_PanelAuth_ConsumePanelRecoveryCode_UserId,
  code: Lib_PanelAuth_ConsumePanelRecoveryCode_Code,
): Lib_PanelAuth_ConsumePanelRecoveryCode_Returns {
  const normalizedCode: Lib_PanelAuth_ConsumePanelRecoveryCode_NormalizedCode = normalizePanelRecoveryCode(code);

  if (normalizedCode === undefined) {
    return false;
  }

  const result: Lib_PanelAuth_ConsumePanelRecoveryCode_Result = await pool.query(
    'UPDATE panel_recovery_codes SET used_at = NOW() WHERE user_id = $1 AND code_hash = $2 AND used_at IS NULL',
    [
      userId,
      hashPanelRecoveryCode(userId, normalizedCode),
    ],
  );

  return result.rowCount === 1;
}

/**
 * Panel Auth - Create Panel Sign In Challenge.
 *
 * Starts the second step of a password sign-in for a user with an authenticator app.
 * The step expires after five minutes or five wrong codes.
 *
 * @param {Lib_PanelAuth_CreatePanelSignInChallenge_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_CreatePanelSignInChallenge_UserId} userId - User id.
 *
 * @returns {Lib_PanelAuth_CreatePanelSignInChallenge_Returns}
 *
 * @since 4.0.0
 */
export async function createPanelSignInChallenge(
  pool: Lib_PanelAuth_CreatePanelSignInChallenge_Pool,
  userId: Lib_PanelAuth_CreatePanelSignInChallenge_UserId,
): Lib_PanelAuth_CreatePanelSignInChallenge_Returns {
  const challenge: Lib_PanelAuth_CreatePanelSignInChallenge_Challenge = randomBytes(32).toString('base64url');

  await pool.query('DELETE FROM panel_sign_in_challenges WHERE expires_at <= NOW()');

  const result: Lib_PanelAuth_CreatePanelSignInChallenge_Result = await pool.query<Lib_PanelAuth_CreatePanelSignInChallenge_QueryRow>(
    'INSERT INTO panel_sign_in_challenges (challenge_hash, user_id, failures, expires_at) VALUES ($1, $2, 0, NOW() + INTERVAL \'5 minutes\') RETURNING expires_at',
    [
      digestValue(challenge),
      userId,
    ],
  );
  const row: Lib_PanelAuth_CreatePanelSignInChallenge_Row = result.rows[0];

  if (row === undefined) {
    throw new Error('The sign-in step could not be stored.');
  }

  return {
    challenge,
    expiresAt: new Date(row['expires_at']).toISOString(),
  };
}

/**
 * Panel Auth - Create Panel Totp Secret.
 *
 * Makes a new authenticator secret and the link an app scans to add it.
 * Nothing is stored until the first code confirms the app.
 *
 * @param {Lib_PanelAuth_CreatePanelTotpSecret_Username} username - Username.
 *
 * @returns {Lib_PanelAuth_CreatePanelTotpSecret_Returns}
 *
 * @since 4.0.0
 */
export function createPanelTotpSecret(username: Lib_PanelAuth_CreatePanelTotpSecret_Username): Lib_PanelAuth_CreatePanelTotpSecret_Returns {
  const totp: Lib_PanelAuth_CreatePanelTotpSecret_Totp = new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    issuer: TOTP_ISSUER,
    label: username,
    period: 30,
    secret: new Secret({
      size: 20,
    }),
  });

  return {
    secret: totp.secret.base32,
    uri: totp.toString(),
  };
}

/**
 * Panel Auth - Delete Panel Sign In Challenge.
 *
 * Ends the second step of a sign-in once it succeeds.
 * Deleting an unknown step does nothing.
 *
 * @param {Lib_PanelAuth_DeletePanelSignInChallenge_Pool}      pool      - Pool.
 * @param {Lib_PanelAuth_DeletePanelSignInChallenge_Challenge} challenge - Challenge.
 *
 * @returns {Lib_PanelAuth_DeletePanelSignInChallenge_Returns}
 *
 * @since 4.0.0
 */
export async function deletePanelSignInChallenge(
  pool: Lib_PanelAuth_DeletePanelSignInChallenge_Pool,
  challenge: Lib_PanelAuth_DeletePanelSignInChallenge_Challenge,
): Lib_PanelAuth_DeletePanelSignInChallenge_Returns {
  await pool.query('DELETE FROM panel_sign_in_challenges WHERE challenge_hash = $1', [digestValue(challenge)]);

  return;
}

/**
 * Panel Auth - Disable Panel Totp.
 *
 * Turns off a user's authenticator app and removes its recovery codes in one step.
 * It reports whether the app was on.
 *
 * @param {Lib_PanelAuth_DisablePanelTotp_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_DisablePanelTotp_UserId} userId - User id.
 *
 * @returns {Lib_PanelAuth_DisablePanelTotp_Returns}
 *
 * @since 4.0.0
 */
export async function disablePanelTotp(
  pool: Lib_PanelAuth_DisablePanelTotp_Pool,
  userId: Lib_PanelAuth_DisablePanelTotp_UserId,
): Lib_PanelAuth_DisablePanelTotp_Returns {
  return runTransaction(pool, async (client: Lib_PanelAuth_DisablePanelTotp_Client) => {
    const result: Lib_PanelAuth_DisablePanelTotp_Result = await client.query('DELETE FROM panel_totp_credentials WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM panel_recovery_codes WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM panel_totp_enrollments WHERE user_id = $1', [userId]);

    return result.rowCount === 1;
  });
}

/**
 * Panel Auth - Enable Panel Totp.
 *
 * Saves a confirmed authenticator secret and returns ten new recovery codes once.
 * The confirming code's time step is recorded so it can't be used again, and any notice
 * about an authenticator removed with a lost credential key clears.
 *
 * @param {Lib_PanelAuth_EnablePanelTotp_Pool}          pool          - Pool.
 * @param {Lib_PanelAuth_EnablePanelTotp_UserId}        userId        - User id.
 * @param {Lib_PanelAuth_EnablePanelTotp_Secret}        secret        - Secret.
 * @param {Lib_PanelAuth_EnablePanelTotp_Step}          step          - Step.
 * @param {Lib_PanelAuth_EnablePanelTotp_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_PanelAuth_EnablePanelTotp_Returns}
 *
 * @since 4.0.0
 */
export async function enablePanelTotp(
  pool: Lib_PanelAuth_EnablePanelTotp_Pool,
  userId: Lib_PanelAuth_EnablePanelTotp_UserId,
  secret: Lib_PanelAuth_EnablePanelTotp_Secret,
  step: Lib_PanelAuth_EnablePanelTotp_Step,
  credentialKey: Lib_PanelAuth_EnablePanelTotp_CredentialKey,
): Lib_PanelAuth_EnablePanelTotp_Returns {
  const secretCiphertext: Lib_PanelAuth_EnablePanelTotp_SecretCiphertext = encryptSecret(secret, `panel-totp:${userId}`, credentialKey);
  const recoveryCodes: Lib_PanelAuth_EnablePanelTotp_RecoveryCodes = generatePanelRecoveryCodes();

  await runTransaction(pool, async (client: Lib_PanelAuth_EnablePanelTotp_Client) => {
    await client.query(
      'INSERT INTO panel_totp_credentials (user_id, secret_ciphertext, verified_at, updated_at, last_used_step) VALUES ($1, $2, NOW(), NOW(), $3) ON CONFLICT (user_id) DO UPDATE SET secret_ciphertext = EXCLUDED.secret_ciphertext, verified_at = NOW(), updated_at = NOW(), last_used_step = EXCLUDED.last_used_step',
      [
        userId,
        secretCiphertext,
        step,
      ],
    );

    await client.query('DELETE FROM panel_totp_enrollments WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM removed_secrets WHERE kind = \'authenticator\' AND user_id = $1', [userId]);

    await insertRecoveryCodes(client, userId, recoveryCodes);

    return true;
  });

  return recoveryCodes;
}

/**
 * Panel Auth - Generate Panel Recovery Codes.
 *
 * Makes ten single-use recovery codes such as K7Q2M-XR9TD.
 * Every character is drawn without bias from the shared alphabet.
 *
 * @returns {Lib_PanelAuth_GeneratePanelRecoveryCodes_Returns}
 *
 * @since 4.0.0
 */
export function generatePanelRecoveryCodes(): Lib_PanelAuth_GeneratePanelRecoveryCodes_Returns {
  const codes: Lib_PanelAuth_GeneratePanelRecoveryCodes_Codes = [];

  while (codes.length < 10) {
    const characters: Lib_PanelAuth_GeneratePanelRecoveryCodes_Characters = Array.from({ length: 10 }, () => CODE_ALPHABET.charAt(randomInt(CODE_ALPHABET.length))).join('');

    codes.push(`${characters.slice(0, 5)}-${characters.slice(5)}`);
  }

  return codes;
}

/**
 * Panel Auth - Get Panel Account.
 *
 * Loads an enabled user's identity for finishing a sign-in.
 * Suspended and deleted users return undefined.
 *
 * @param {Lib_PanelAuth_GetPanelAccount_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_GetPanelAccount_UserId} userId - User id.
 *
 * @returns {Lib_PanelAuth_GetPanelAccount_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelAccount(
  pool: Lib_PanelAuth_GetPanelAccount_Pool,
  userId: Lib_PanelAuth_GetPanelAccount_UserId,
): Lib_PanelAuth_GetPanelAccount_Returns {
  const result: Lib_PanelAuth_GetPanelAccount_Result = await pool.query<Lib_PanelAuth_GetPanelAccount_QueryRow>('SELECT id::text AS id, username, role FROM panel_users WHERE id = $1 AND enabled = TRUE', [userId]);
  const row: Lib_PanelAuth_GetPanelAccount_Row = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return {
    id: row['id'],
    role: row['role'],
    username: row['username'],
  };
}

/**
 * Panel Auth - Get Panel Security.
 *
 * Describes a user's sign-in methods for the Security page.
 * Secrets, hashes, and unused recovery codes never leave the database.
 *
 * @param {Lib_PanelAuth_GetPanelSecurity_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_GetPanelSecurity_UserId} userId - User id.
 *
 * @returns {Lib_PanelAuth_GetPanelSecurity_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelSecurity(
  pool: Lib_PanelAuth_GetPanelSecurity_Pool,
  userId: Lib_PanelAuth_GetPanelSecurity_UserId,
): Lib_PanelAuth_GetPanelSecurity_Returns {
  const result: Lib_PanelAuth_GetPanelSecurity_Result = await pool.query<Lib_PanelAuth_GetPanelSecurity_QueryRow>(
    'SELECT panel_users.username, panel_users.role, EXISTS(SELECT 1 FROM panel_totp_credentials WHERE panel_totp_credentials.user_id = panel_users.id) AS totp_enabled, (SELECT COUNT(*)::text FROM panel_recovery_codes WHERE panel_recovery_codes.user_id = panel_users.id AND panel_recovery_codes.used_at IS NULL) AS recovery_codes_remaining FROM panel_users WHERE panel_users.id = $1',
    [userId],
  );
  const row: Lib_PanelAuth_GetPanelSecurity_Row = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  const passkeyResult: Lib_PanelAuth_GetPanelSecurity_PasskeyResult = await pool.query(
    'SELECT credential_id, name, rp_id, created_at, last_used_at FROM panel_passkeys WHERE user_id = $1 ORDER BY created_at, credential_id',
    [userId],
  );

  return {
    passkeys: passkeyResult.rows.map((passkey) => ({
      createdAt: new Date(passkey['created_at']).toISOString(),
      hostname: passkey['rp_id'],
      id: passkey['credential_id'],
      lastUsedAt: (passkey['last_used_at'] === null) ? null : new Date(passkey['last_used_at']).toISOString(),
      name: passkey['name'],
    })),
    recoveryCodesRemaining: Number(row['recovery_codes_remaining']),
    role: row['role'],
    totpEnabled: row['totp_enabled'],
    username: row['username'],
  };
}

/**
 * Panel Auth - Get Panel Sign In Challenge.
 *
 * Resolves the second step of a sign-in to its user while it is still valid.
 * Unknown and expired steps both return undefined.
 *
 * @param {Lib_PanelAuth_GetPanelSignInChallenge_Pool}      pool      - Pool.
 * @param {Lib_PanelAuth_GetPanelSignInChallenge_Challenge} challenge - Challenge.
 *
 * @returns {Lib_PanelAuth_GetPanelSignInChallenge_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelSignInChallenge(
  pool: Lib_PanelAuth_GetPanelSignInChallenge_Pool,
  challenge: Lib_PanelAuth_GetPanelSignInChallenge_Challenge,
): Lib_PanelAuth_GetPanelSignInChallenge_Returns {
  const result: Lib_PanelAuth_GetPanelSignInChallenge_Result = await pool.query<Lib_PanelAuth_GetPanelSignInChallenge_QueryRow>('SELECT user_id::text AS user_id FROM panel_sign_in_challenges WHERE challenge_hash = $1 AND expires_at > NOW()', [digestValue(challenge)]);
  const row: Lib_PanelAuth_GetPanelSignInChallenge_Row = result.rows[0];

  return (row === undefined) ? undefined : row['user_id'];
}

/**
 * Panel Auth - Get Panel Totp Enrollment.
 *
 * Returns the pending authenticator secret while its setup hasn't expired.
 * Setups expire ten minutes after they start.
 *
 * @param {Lib_PanelAuth_GetPanelTotpEnrollment_Pool}          pool          - Pool.
 * @param {Lib_PanelAuth_GetPanelTotpEnrollment_UserId}        userId        - User id.
 * @param {Lib_PanelAuth_GetPanelTotpEnrollment_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_PanelAuth_GetPanelTotpEnrollment_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelTotpEnrollment(
  pool: Lib_PanelAuth_GetPanelTotpEnrollment_Pool,
  userId: Lib_PanelAuth_GetPanelTotpEnrollment_UserId,
  credentialKey: Lib_PanelAuth_GetPanelTotpEnrollment_CredentialKey,
): Lib_PanelAuth_GetPanelTotpEnrollment_Returns {
  const result: Lib_PanelAuth_GetPanelTotpEnrollment_Result = await pool.query<Lib_PanelAuth_GetPanelTotpEnrollment_QueryRow>('SELECT secret_ciphertext FROM panel_totp_enrollments WHERE user_id = $1 AND expires_at > NOW()', [userId]);
  const row: Lib_PanelAuth_GetPanelTotpEnrollment_Row = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return decryptSecret(row['secret_ciphertext'], `panel-totp-enrollment:${userId}`, credentialKey);
}

/**
 * Panel Auth - Has Panel Totp.
 *
 * Reports whether a user's authenticator app is on.
 * Sign-in asks for a second step only when it is.
 *
 * @param {Lib_PanelAuth_HasPanelTotp_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_HasPanelTotp_UserId} userId - User id.
 *
 * @returns {Lib_PanelAuth_HasPanelTotp_Returns}
 *
 * @since 4.0.0
 */
export async function hasPanelTotp(
  pool: Lib_PanelAuth_HasPanelTotp_Pool,
  userId: Lib_PanelAuth_HasPanelTotp_UserId,
): Lib_PanelAuth_HasPanelTotp_Returns {
  const result: Lib_PanelAuth_HasPanelTotp_Result = await pool.query('SELECT user_id FROM panel_totp_credentials WHERE user_id = $1', [userId]);

  return (result.rowCount ?? 0) > 0;
}

/**
 * Panel Auth - Hash Panel Password.
 *
 * Derives an Argon2id hash with a fresh salt for a new or changed password.
 * The settings match the hashes already stored.
 *
 * @param {Lib_PanelAuth_HashPanelPassword_Password} password - Password.
 *
 * @returns {Lib_PanelAuth_HashPanelPassword_Returns}
 *
 * @since 4.0.0
 */
export async function hashPanelPassword(password: Lib_PanelAuth_HashPanelPassword_Password): Lib_PanelAuth_HashPanelPassword_Returns {
  return hash(password, passwordHashOptions);
}

/**
 * Panel Auth - Hash Panel Recovery Code.
 *
 * Digests a normalized recovery code together with its user.
 * The format matches the codes already stored.
 *
 * @param {Lib_PanelAuth_HashPanelRecoveryCode_UserId}         userId         - User id.
 * @param {Lib_PanelAuth_HashPanelRecoveryCode_NormalizedCode} normalizedCode - Normalized code.
 *
 * @returns {Lib_PanelAuth_HashPanelRecoveryCode_Returns}
 *
 * @since 4.0.0
 */
export function hashPanelRecoveryCode(userId: Lib_PanelAuth_HashPanelRecoveryCode_UserId, normalizedCode: Lib_PanelAuth_HashPanelRecoveryCode_NormalizedCode): Lib_PanelAuth_HashPanelRecoveryCode_Returns {
  return digestValue(`panel-recovery:${userId}:${normalizedCode}`);
}

/**
 * Panel Auth - Normalize Panel Recovery Code.
 *
 * Uppercases a typed recovery code and drops spaces and dashes before it is checked.
 * Values that could never be a recovery code return undefined.
 *
 * @param {Lib_PanelAuth_NormalizePanelRecoveryCode_Value} value - Value.
 *
 * @returns {Lib_PanelAuth_NormalizePanelRecoveryCode_Returns}
 *
 * @since 4.0.0
 */
export function normalizePanelRecoveryCode(value: Lib_PanelAuth_NormalizePanelRecoveryCode_Value): Lib_PanelAuth_NormalizePanelRecoveryCode_Returns {
  const characters: Lib_PanelAuth_NormalizePanelRecoveryCode_Characters = value.toUpperCase().split(LIB_REGEX_PATTERN_WHITESPACE).join('').replaceAll('-', '');

  if (
    characters.length < 8
    || characters.length > 32
    || [...characters].every((character) => RECOVERY_CODE_CHARACTERS.includes(character)) === false
  ) {
    return undefined;
  }

  return characters;
}

/**
 * Panel Auth - Record Panel Sign In Challenge Failure.
 *
 * Counts a wrong code on the second step of a sign-in.
 * The fifth wrong code ends the step, and it reports whether that happened.
 *
 * @param {Lib_PanelAuth_RecordPanelSignInChallengeFailure_Pool}      pool      - Pool.
 * @param {Lib_PanelAuth_RecordPanelSignInChallengeFailure_Challenge} challenge - Challenge.
 *
 * @returns {Lib_PanelAuth_RecordPanelSignInChallengeFailure_Returns}
 *
 * @since 4.0.0
 */
export async function recordPanelSignInChallengeFailure(
  pool: Lib_PanelAuth_RecordPanelSignInChallengeFailure_Pool,
  challenge: Lib_PanelAuth_RecordPanelSignInChallengeFailure_Challenge,
): Lib_PanelAuth_RecordPanelSignInChallengeFailure_Returns {
  const challengeHash: Lib_PanelAuth_RecordPanelSignInChallengeFailure_ChallengeHash = digestValue(challenge);
  const failureLimit: Lib_PanelAuth_RecordPanelSignInChallengeFailure_FailureLimit = 5;
  const result: Lib_PanelAuth_RecordPanelSignInChallengeFailure_Result = await pool.query<Lib_PanelAuth_RecordPanelSignInChallengeFailure_QueryRow>('UPDATE panel_sign_in_challenges SET failures = failures + 1 WHERE challenge_hash = $1 RETURNING failures', [challengeHash]);
  const row: Lib_PanelAuth_RecordPanelSignInChallengeFailure_Row = result.rows[0];

  if (row === undefined || row['failures'] < failureLimit) {
    return false;
  }

  await pool.query('DELETE FROM panel_sign_in_challenges WHERE challenge_hash = $1', [challengeHash]);

  return true;
}

/**
 * Panel Auth - Replace Panel Recovery Codes.
 *
 * Issues ten new recovery codes and makes every older code stop working.
 * Users without an authenticator app get undefined instead.
 *
 * @param {Lib_PanelAuth_ReplacePanelRecoveryCodes_Pool}   pool   - Pool.
 * @param {Lib_PanelAuth_ReplacePanelRecoveryCodes_UserId} userId - User id.
 *
 * @returns {Lib_PanelAuth_ReplacePanelRecoveryCodes_Returns}
 *
 * @since 4.0.0
 */
export async function replacePanelRecoveryCodes(
  pool: Lib_PanelAuth_ReplacePanelRecoveryCodes_Pool,
  userId: Lib_PanelAuth_ReplacePanelRecoveryCodes_UserId,
): Lib_PanelAuth_ReplacePanelRecoveryCodes_Returns {
  if (await hasPanelTotp(pool, userId) === false) {
    return undefined;
  }

  const recoveryCodes: Lib_PanelAuth_ReplacePanelRecoveryCodes_RecoveryCodes = generatePanelRecoveryCodes();

  await runTransaction(pool, async (client: Lib_PanelAuth_ReplacePanelRecoveryCodes_Client) => {
    await insertRecoveryCodes(client, userId, recoveryCodes);

    return true;
  });

  return recoveryCodes;
}

/**
 * Panel Auth - Run Transaction.
 *
 * Runs a callback inside one database transaction and returns its result.
 * Any failure rolls every write back.
 *
 * @param {Lib_PanelAuth_RunTransaction_Pool}     pool     - Pool.
 * @param {Lib_PanelAuth_RunTransaction_Callback} callback - Callback.
 *
 * @returns {Lib_PanelAuth_RunTransaction_Returns}
 *
 * @since 4.0.0
 */
export async function runTransaction(
  pool: Lib_PanelAuth_RunTransaction_Pool,
  callback: Lib_PanelAuth_RunTransaction_Callback,
): Lib_PanelAuth_RunTransaction_Returns {
  const client: Lib_PanelAuth_RunTransaction_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result: Lib_PanelAuth_RunTransaction_Result = await callback(client);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Panel Auth - Start Panel Totp Enrollment.
 *
 * Stores a new authenticator secret, encrypted, until the user confirms it.
 * Starting again replaces the pending secret and its expiry.
 *
 * @param {Lib_PanelAuth_StartPanelTotpEnrollment_Pool}          pool          - Pool.
 * @param {Lib_PanelAuth_StartPanelTotpEnrollment_UserId}        userId        - User id.
 * @param {Lib_PanelAuth_StartPanelTotpEnrollment_Secret}        secret        - Secret.
 * @param {Lib_PanelAuth_StartPanelTotpEnrollment_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_PanelAuth_StartPanelTotpEnrollment_Returns}
 *
 * @since 4.0.0
 */
export async function startPanelTotpEnrollment(
  pool: Lib_PanelAuth_StartPanelTotpEnrollment_Pool,
  userId: Lib_PanelAuth_StartPanelTotpEnrollment_UserId,
  secret: Lib_PanelAuth_StartPanelTotpEnrollment_Secret,
  credentialKey: Lib_PanelAuth_StartPanelTotpEnrollment_CredentialKey,
): Lib_PanelAuth_StartPanelTotpEnrollment_Returns {
  await pool.query('DELETE FROM panel_totp_enrollments WHERE expires_at <= NOW()');

  const result: Lib_PanelAuth_StartPanelTotpEnrollment_Result = await pool.query<Lib_PanelAuth_StartPanelTotpEnrollment_QueryRow>(
    'INSERT INTO panel_totp_enrollments (user_id, secret_ciphertext, created_at, expires_at) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'10 minutes\') ON CONFLICT (user_id) DO UPDATE SET secret_ciphertext = EXCLUDED.secret_ciphertext, created_at = EXCLUDED.created_at, expires_at = EXCLUDED.expires_at RETURNING expires_at',
    [
      userId,
      encryptSecret(secret, `panel-totp-enrollment:${userId}`, credentialKey),
    ],
  );
  const row: Lib_PanelAuth_StartPanelTotpEnrollment_Row = result.rows[0];

  if (row === undefined) {
    throw new Error('The authenticator setup could not be stored.');
  }

  return new Date(row['expires_at']).toISOString();
}

/**
 * Panel Auth - Verify Panel Password.
 *
 * Checks a password against a stored Argon2 hash.
 * A malformed hash fails like a wrong password.
 *
 * @param {Lib_PanelAuth_VerifyPanelPassword_PasswordHash} passwordHash - Password hash.
 * @param {Lib_PanelAuth_VerifyPanelPassword_Password}     password     - Password.
 *
 * @returns {Lib_PanelAuth_VerifyPanelPassword_Returns}
 *
 * @since 4.0.0
 */
export async function verifyPanelPassword(passwordHash: Lib_PanelAuth_VerifyPanelPassword_PasswordHash, password: Lib_PanelAuth_VerifyPanelPassword_Password): Lib_PanelAuth_VerifyPanelPassword_Returns {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}

/**
 * Panel Auth - Verify Panel Totp.
 *
 * Checks a user's authenticator code and refuses one whose time step was already used.
 * The used step is recorded only when it is newer than the last one.
 *
 * @param {Lib_PanelAuth_VerifyPanelTotp_Pool}          pool          - Pool.
 * @param {Lib_PanelAuth_VerifyPanelTotp_UserId}        userId        - User id.
 * @param {Lib_PanelAuth_VerifyPanelTotp_Code}          code          - Code.
 * @param {Lib_PanelAuth_VerifyPanelTotp_CredentialKey} credentialKey - Credential key.
 * @param {Lib_PanelAuth_VerifyPanelTotp_Now}           [now]         - Now.
 *
 * @returns {Lib_PanelAuth_VerifyPanelTotp_Returns}
 *
 * @since 4.0.0
 */
export async function verifyPanelTotp(
  pool: Lib_PanelAuth_VerifyPanelTotp_Pool,
  userId: Lib_PanelAuth_VerifyPanelTotp_UserId,
  code: Lib_PanelAuth_VerifyPanelTotp_Code,
  credentialKey: Lib_PanelAuth_VerifyPanelTotp_CredentialKey,
  now: Lib_PanelAuth_VerifyPanelTotp_Now = Date.now(),
): Lib_PanelAuth_VerifyPanelTotp_Returns {
  const result: Lib_PanelAuth_VerifyPanelTotp_Result = await pool.query<Lib_PanelAuth_VerifyPanelTotp_QueryRow>('SELECT secret_ciphertext, last_used_step::text AS last_used_step FROM panel_totp_credentials WHERE user_id = $1', [userId]);
  const row: Lib_PanelAuth_VerifyPanelTotp_Row = result.rows[0];

  if (row === undefined) {
    return false;
  }

  const secret: Lib_PanelAuth_VerifyPanelTotp_Secret = decryptSecret(row['secret_ciphertext'], `panel-totp:${userId}`, credentialKey);
  const matchedStep: Lib_PanelAuth_VerifyPanelTotp_MatchedStep = verifyPanelTotpCode(secret, code, now);

  if (matchedStep === undefined) {
    return false;
  }

  if (row['last_used_step'] !== null && matchedStep <= Number(row['last_used_step'])) {
    return false;
  }

  const update: Lib_PanelAuth_VerifyPanelTotp_Update = await pool.query(
    'UPDATE panel_totp_credentials SET last_used_step = $2 WHERE user_id = $1 AND (last_used_step IS NULL OR last_used_step < $2)',
    [
      userId,
      matchedStep,
    ],
  );

  return update.rowCount === 1;
}

/**
 * Panel Auth - Verify Panel Totp Code.
 *
 * Checks a six-digit code against a secret with one step of clock drift either way.
 * It returns the code's time step, or undefined when the code doesn't match.
 *
 * @param {Lib_PanelAuth_VerifyPanelTotpCode_Secret} secret - Secret.
 * @param {Lib_PanelAuth_VerifyPanelTotpCode_Code}   code   - Code.
 * @param {Lib_PanelAuth_VerifyPanelTotpCode_Now}    [now]  - Now.
 *
 * @returns {Lib_PanelAuth_VerifyPanelTotpCode_Returns}
 *
 * @since 4.0.0
 */
export function verifyPanelTotpCode(
  secret: Lib_PanelAuth_VerifyPanelTotpCode_Secret,
  code: Lib_PanelAuth_VerifyPanelTotpCode_Code,
  now: Lib_PanelAuth_VerifyPanelTotpCode_Now = Date.now(),
): Lib_PanelAuth_VerifyPanelTotpCode_Returns {
  if (code.length !== 6) {
    return undefined;
  }

  const totp: Lib_PanelAuth_VerifyPanelTotpCode_Totp = new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    issuer: TOTP_ISSUER,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
  const delta: Lib_PanelAuth_VerifyPanelTotpCode_Delta = totp.validate({
    timestamp: now,
    token: code,
    window: 1,
  });

  if (delta === null) {
    return undefined;
  }

  return Math.floor(now / 30_000) + delta;
}

/**
 * Panel Auth - Get Dummy Password Hash.
 *
 * Makes the timing-equalizer hash on first use and reuses it afterward.
 * Its password is random, so it never matches anything typed.
 *
 * @private
 *
 * @returns {Lib_PanelAuth_GetDummyPasswordHash_Returns}
 *
 * @since 4.0.0
 */
async function getDummyPasswordHash(): Lib_PanelAuth_GetDummyPasswordHash_Returns {
  if (dummyPasswordHash === undefined) {
    dummyPasswordHash = hashPanelPassword(randomBytes(32).toString('base64url'));
  }

  return dummyPasswordHash;
}

/**
 * Panel Auth - Insert Recovery Codes.
 *
 * Replaces a user's recovery codes with new digests inside the caller's transaction.
 * Only digests reach the database.
 *
 * @param {Lib_PanelAuth_InsertRecoveryCodes_Client} client - Client.
 * @param {Lib_PanelAuth_InsertRecoveryCodes_UserId} userId - User id.
 * @param {Lib_PanelAuth_InsertRecoveryCodes_Codes}  codes  - Codes.
 *
 * @private
 *
 * @returns {Lib_PanelAuth_InsertRecoveryCodes_Returns}
 *
 * @since 4.0.0
 */
async function insertRecoveryCodes(
  client: Lib_PanelAuth_InsertRecoveryCodes_Client,
  userId: Lib_PanelAuth_InsertRecoveryCodes_UserId,
  codes: Lib_PanelAuth_InsertRecoveryCodes_Codes,
): Lib_PanelAuth_InsertRecoveryCodes_Returns {
  await client.query('DELETE FROM panel_recovery_codes WHERE user_id = $1', [userId]);

  for (const code of codes) {
    await client.query('INSERT INTO panel_recovery_codes (user_id, code_hash) VALUES ($1, $2)', [
      userId,
      hashPanelRecoveryCode(userId, normalizePanelRecoveryCode(code) ?? code),
    ]);
  }

  return;
}
