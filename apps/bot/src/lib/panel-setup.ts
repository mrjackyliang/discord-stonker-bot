import { randomInt } from 'node:crypto';

import { hashPanelPassword } from './panel-auth.js';
import { digestValue } from './panel-sessions.js';
import { LIB_REGEX_PATTERN_WHITESPACE } from './regex.js';

import type {
  Lib_PanelSetup_ClaimPanelSetup_Account,
  Lib_PanelSetup_ClaimPanelSetup_Client,
  Lib_PanelSetup_ClaimPanelSetup_Code,
  Lib_PanelSetup_ClaimPanelSetup_CodeHash,
  Lib_PanelSetup_ClaimPanelSetup_ExistingClaim,
  Lib_PanelSetup_ClaimPanelSetup_FirstUserCountRow,
  Lib_PanelSetup_ClaimPanelSetup_Inserted,
  Lib_PanelSetup_ClaimPanelSetup_InsertedRow,
  Lib_PanelSetup_ClaimPanelSetup_NormalizedCode,
  Lib_PanelSetup_ClaimPanelSetup_Password,
  Lib_PanelSetup_ClaimPanelSetup_PasswordHash,
  Lib_PanelSetup_ClaimPanelSetup_Pool,
  Lib_PanelSetup_ClaimPanelSetup_Returns,
  Lib_PanelSetup_ClaimPanelSetup_StoredClaim,
  Lib_PanelSetup_ClaimPanelSetup_UserCount,
  Lib_PanelSetup_ClaimPanelSetup_UserCountRow,
  Lib_PanelSetup_ClaimPanelSetup_Username,
  Lib_PanelSetup_GenerateSetupCode_Characters,
  Lib_PanelSetup_GenerateSetupCode_Returns,
  Lib_PanelSetup_GetPanelSetupStatus_ClaimRow,
  Lib_PanelSetup_GetPanelSetupStatus_ClaimRowResult,
  Lib_PanelSetup_GetPanelSetupStatus_FirstClaimRow,
  Lib_PanelSetup_GetPanelSetupStatus_FirstUserCountRow,
  Lib_PanelSetup_GetPanelSetupStatus_Pool,
  Lib_PanelSetup_GetPanelSetupStatus_Returns,
  Lib_PanelSetup_GetPanelSetupStatus_UserCount,
  Lib_PanelSetup_GetPanelSetupStatus_UserCountRow,
  Lib_PanelSetup_NormalizePanelSetupCode_Characters,
  Lib_PanelSetup_NormalizePanelSetupCode_Returns,
  Lib_PanelSetup_NormalizePanelSetupCode_Value,
  Lib_PanelSetup_PreparePanelSetupClaim_Code,
  Lib_PanelSetup_PreparePanelSetupClaim_FirstRow,
  Lib_PanelSetup_PreparePanelSetupClaim_FirstUserCountRow,
  Lib_PanelSetup_PreparePanelSetupClaim_Pool,
  Lib_PanelSetup_PreparePanelSetupClaim_Result,
  Lib_PanelSetup_PreparePanelSetupClaim_Returns,
  Lib_PanelSetup_PreparePanelSetupClaim_Row,
  Lib_PanelSetup_PreparePanelSetupClaim_UserCount,
  Lib_PanelSetup_PreparePanelSetupClaim_UserCountRow,
  Lib_PanelSetup_SetupClaimMinutes,
  Lib_PanelSetup_SetupCodeAlphabet,
} from '../types/lib/panel-setup.d.ts';

/**
 * Panel Setup - Setup Claim Minutes.
 *
 * Keeps each printed setup code valid for thirty minutes.
 * Restarting the container prints a new code until the owner account exists.
 *
 * @since 4.0.0
 */
const SETUP_CLAIM_MINUTES: Lib_PanelSetup_SetupClaimMinutes = 30;

/**
 * Panel Setup - Setup Code Alphabet.
 *
 * Skips look-alike characters so a code copied from the log is typed correctly.
 * The other appliances use the same alphabet.
 *
 * @since 4.0.0
 */
const SETUP_CODE_ALPHABET: Lib_PanelSetup_SetupCodeAlphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Panel Setup - Claim Panel Setup.
 *
 * Creates the owner account with the setup code from the log, then retires the code.
 * The check and the insert run under a table lock so only one owner can ever be made.
 *
 * @param {Lib_PanelSetup_ClaimPanelSetup_Pool}     pool     - Pool.
 * @param {Lib_PanelSetup_ClaimPanelSetup_Code}     code     - Code.
 * @param {Lib_PanelSetup_ClaimPanelSetup_Username} username - Username.
 * @param {Lib_PanelSetup_ClaimPanelSetup_Password} password - Password.
 *
 * @returns {Lib_PanelSetup_ClaimPanelSetup_Returns}
 *
 * @since 4.0.0
 */
export async function claimPanelSetup(
  pool: Lib_PanelSetup_ClaimPanelSetup_Pool,
  code: Lib_PanelSetup_ClaimPanelSetup_Code,
  username: Lib_PanelSetup_ClaimPanelSetup_Username,
  password: Lib_PanelSetup_ClaimPanelSetup_Password,
): Lib_PanelSetup_ClaimPanelSetup_Returns {
  const normalizedCode: Lib_PanelSetup_ClaimPanelSetup_NormalizedCode = normalizePanelSetupCode(code);

  if (normalizedCode === undefined) {
    return 'invalid';
  }

  const codeHash: Lib_PanelSetup_ClaimPanelSetup_CodeHash = digestValue(normalizedCode);
  const storedClaim: Lib_PanelSetup_ClaimPanelSetup_StoredClaim = await pool.query('SELECT singleton FROM panel_setup_claims WHERE code_hash = $1 AND expires_at > NOW()', [codeHash]);

  if ((storedClaim.rowCount ?? 0) === 0) {
    return 'invalid';
  }

  const passwordHash: Lib_PanelSetup_ClaimPanelSetup_PasswordHash = await hashPanelPassword(password);
  const client: Lib_PanelSetup_ClaimPanelSetup_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('LOCK TABLE panel_users IN EXCLUSIVE MODE');

    const userCount: Lib_PanelSetup_ClaimPanelSetup_UserCount = await client.query<Lib_PanelSetup_ClaimPanelSetup_UserCountRow>('SELECT COUNT(*)::text AS count FROM panel_users');
    const userCountRow: Lib_PanelSetup_ClaimPanelSetup_FirstUserCountRow = userCount.rows[0];

    if (userCountRow !== undefined && Number(userCountRow['count']) > 0) {
      await client.query('ROLLBACK');

      return 'unavailable';
    }

    const existingClaim: Lib_PanelSetup_ClaimPanelSetup_ExistingClaim = await client.query('SELECT singleton FROM panel_setup_claims WHERE code_hash = $1 AND expires_at > NOW()', [codeHash]);

    if ((existingClaim.rowCount ?? 0) === 0) {
      await client.query('ROLLBACK');

      return 'invalid';
    }

    const inserted: Lib_PanelSetup_ClaimPanelSetup_Inserted = await client.query<Lib_PanelSetup_ClaimPanelSetup_InsertedRow>(
      'INSERT INTO panel_users (username, password_hash, role, all_guilds) VALUES ($1, $2, \'owner\', TRUE) RETURNING id::text AS id, username, role',
      [
        username,
        passwordHash,
      ],
    );
    const account: Lib_PanelSetup_ClaimPanelSetup_Account = inserted.rows[0];

    if (account === undefined) {
      throw new Error('The owner account could not be stored.');
    }

    await client.query('DELETE FROM panel_setup_claims');

    await client.query('COMMIT');

    return account;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Panel Setup - Get Panel Setup Status.
 *
 * Tells the control panel whether to show setup or sign-in, and when the code expires.
 * The answer never includes the code itself.
 *
 * @param {Lib_PanelSetup_GetPanelSetupStatus_Pool} pool - Pool.
 *
 * @returns {Lib_PanelSetup_GetPanelSetupStatus_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelSetupStatus(pool: Lib_PanelSetup_GetPanelSetupStatus_Pool): Lib_PanelSetup_GetPanelSetupStatus_Returns {
  const userCount: Lib_PanelSetup_GetPanelSetupStatus_UserCount = await pool.query<Lib_PanelSetup_GetPanelSetupStatus_UserCountRow>('SELECT COUNT(*)::text AS count FROM panel_users');
  const userCountRow: Lib_PanelSetup_GetPanelSetupStatus_FirstUserCountRow = userCount.rows[0];

  if (userCountRow !== undefined && Number(userCountRow['count']) > 0) {
    return {
      claimRequired: false,
    };
  }

  const claimRowResult: Lib_PanelSetup_GetPanelSetupStatus_ClaimRowResult = await pool.query<Lib_PanelSetup_GetPanelSetupStatus_ClaimRow>('SELECT expires_at FROM panel_setup_claims WHERE singleton = TRUE');
  const claimRow: Lib_PanelSetup_GetPanelSetupStatus_FirstClaimRow = claimRowResult.rows[0];

  return {
    claimRequired: true,
    ...((claimRow === undefined) ? {} : { claimExpiresAt: new Date(claimRow['expires_at']).toISOString() }),
  };
}

/**
 * Panel Setup - Normalize Panel Setup Code.
 *
 * Accepts a typed setup code in any letter case, with or without spaces and dashes.
 * Values that could never be a setup code return undefined.
 *
 * @param {Lib_PanelSetup_NormalizePanelSetupCode_Value} value - Value.
 *
 * @returns {Lib_PanelSetup_NormalizePanelSetupCode_Returns}
 *
 * @since 4.0.0
 */
export function normalizePanelSetupCode(value: Lib_PanelSetup_NormalizePanelSetupCode_Value): Lib_PanelSetup_NormalizePanelSetupCode_Returns {
  const characters: Lib_PanelSetup_NormalizePanelSetupCode_Characters = value.toUpperCase().split(LIB_REGEX_PATTERN_WHITESPACE).join('').replaceAll('-', '');

  if (
    characters.length !== 15
    || [...characters].every((character) => SETUP_CODE_ALPHABET.includes(character)) === false
  ) {
    return undefined;
  }

  return `${characters.slice(0, 5)}-${characters.slice(5, 10)}-${characters.slice(10)}`;
}

/**
 * Panel Setup - Prepare Panel Setup Claim.
 *
 * Stores a fresh one-time setup code while no account exists and returns it for the log.
 * Once an account exists, any stored code is removed and nothing is returned.
 *
 * @param {Lib_PanelSetup_PreparePanelSetupClaim_Pool} pool - Pool.
 *
 * @returns {Lib_PanelSetup_PreparePanelSetupClaim_Returns}
 *
 * @since 4.0.0
 */
export async function preparePanelSetupClaim(pool: Lib_PanelSetup_PreparePanelSetupClaim_Pool): Lib_PanelSetup_PreparePanelSetupClaim_Returns {
  const userCount: Lib_PanelSetup_PreparePanelSetupClaim_UserCount = await pool.query<Lib_PanelSetup_PreparePanelSetupClaim_UserCountRow>('SELECT COUNT(*)::text AS count FROM panel_users');
  const userCountRow: Lib_PanelSetup_PreparePanelSetupClaim_FirstUserCountRow = userCount.rows[0];

  if (userCountRow !== undefined && Number(userCountRow['count']) > 0) {
    await pool.query('DELETE FROM panel_setup_claims');

    return undefined;
  }

  const code: Lib_PanelSetup_PreparePanelSetupClaim_Code = generateSetupCode();
  const result: Lib_PanelSetup_PreparePanelSetupClaim_Result = await pool.query<Lib_PanelSetup_PreparePanelSetupClaim_Row>(
    `INSERT INTO panel_setup_claims (singleton, code_hash, expires_at) VALUES (TRUE, $1, NOW() + INTERVAL '${SETUP_CLAIM_MINUTES} minutes') ON CONFLICT (singleton) DO UPDATE SET code_hash = EXCLUDED.code_hash, expires_at = EXCLUDED.expires_at RETURNING expires_at`,
    [digestValue(code)],
  );

  const row: Lib_PanelSetup_PreparePanelSetupClaim_FirstRow = result.rows[0];

  if (row === undefined) {
    throw new Error('The setup code could not be stored.');
  }

  return {
    code,
    expiresAt: new Date(row['expires_at']).toISOString(),
  };
}

/**
 * Panel Setup - Generate Setup Code.
 *
 * Builds a code such as K7Q2M-XR9TD-P4W8N from fifteen unbiased random characters.
 * The dashes only make it easier to read and are ignored when it is typed.
 *
 * @private
 *
 * @returns {Lib_PanelSetup_GenerateSetupCode_Returns}
 *
 * @since 4.0.0
 */
function generateSetupCode(): Lib_PanelSetup_GenerateSetupCode_Returns {
  const characters: Lib_PanelSetup_GenerateSetupCode_Characters = Array.from(
    { length: 15 },
    () => SETUP_CODE_ALPHABET.charAt(randomInt(SETUP_CODE_ALPHABET.length)),
  ).join('');

  return `${characters.slice(0, 5)}-${characters.slice(5, 10)}-${characters.slice(10)}`;
}
