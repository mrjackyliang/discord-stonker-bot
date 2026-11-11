import { randomBytes } from 'node:crypto';

import { digestValue } from './panel-sessions.js';

import type {
  Lib_PanelTokens_CreatePanelToken_Id,
  Lib_PanelTokens_CreatePanelToken_Input,
  Lib_PanelTokens_CreatePanelToken_Plaintext,
  Lib_PanelTokens_CreatePanelToken_Pool,
  Lib_PanelTokens_CreatePanelToken_Result,
  Lib_PanelTokens_CreatePanelToken_Returns,
  Lib_PanelTokens_CreatePanelToken_Row,
  Lib_PanelTokens_CreatePanelToken_Taken,
  Lib_PanelTokens_CreatePanelToken_UserId,
  Lib_PanelTokens_DeletePanelToken_Pool,
  Lib_PanelTokens_DeletePanelToken_QueryRow,
  Lib_PanelTokens_DeletePanelToken_Result,
  Lib_PanelTokens_DeletePanelToken_Returns,
  Lib_PanelTokens_DeletePanelToken_Row,
  Lib_PanelTokens_DeletePanelToken_TokenId,
  Lib_PanelTokens_DeletePanelToken_UserId,
  Lib_PanelTokens_IsPanelTokenId_Returns,
  Lib_PanelTokens_IsPanelTokenId_Value,
  Lib_PanelTokens_ListPanelTokens_Pool,
  Lib_PanelTokens_ListPanelTokens_Result,
  Lib_PanelTokens_ListPanelTokens_Returns,
  Lib_PanelTokens_ListPanelTokens_UserId,
  Lib_PanelTokens_TokenColumns,
  Lib_PanelTokens_TokenFromRow_Returns,
  Lib_PanelTokens_TokenFromRow_Row,
  Lib_PanelTokens_TokenIdCharacters,
  Lib_PanelTokens_TokenQueryRow,
  Lib_PanelTokens_UpdatePanelToken_Existing,
  Lib_PanelTokens_UpdatePanelToken_Input,
  Lib_PanelTokens_UpdatePanelToken_Pool,
  Lib_PanelTokens_UpdatePanelToken_Result,
  Lib_PanelTokens_UpdatePanelToken_Returns,
  Lib_PanelTokens_UpdatePanelToken_Row,
  Lib_PanelTokens_UpdatePanelToken_Taken,
  Lib_PanelTokens_UpdatePanelToken_TokenId,
  Lib_PanelTokens_UpdatePanelToken_UserId,
} from '../types/lib/panel-tokens.d.ts';

/**
 * Panel Tokens - Token Columns.
 *
 * Selects the safe columns every token answer uses.
 * Hashes never leave the database.
 *
 * @since 4.0.0
 */
const TOKEN_COLUMNS: Lib_PanelTokens_TokenColumns = 'id, name, scopes, created_at, expires_at, last_used_at';

/**
 * Panel Tokens - Token ID Characters.
 *
 * Lists the lowercase hexadecimal digits that follow tok- in a token id.
 * Any other id is answered like a token that no longer exists.
 *
 * @since 4.0.0
 */
const TOKEN_ID_CHARACTERS: Lib_PanelTokens_TokenIdCharacters = '0123456789abcdef';

/**
 * Panel Tokens - Create Panel Token.
 *
 * Makes a personal access token for a user and returns its value once.
 * Only the value's SHA-256 digest is stored, and a name the user already has is refused.
 *
 * @param {Lib_PanelTokens_CreatePanelToken_Pool}   pool   - Pool.
 * @param {Lib_PanelTokens_CreatePanelToken_UserId} userId - User id.
 * @param {Lib_PanelTokens_CreatePanelToken_Input}  input  - Input.
 *
 * @returns {Lib_PanelTokens_CreatePanelToken_Returns}
 *
 * @since 4.0.0
 */
export async function createPanelToken(
  pool: Lib_PanelTokens_CreatePanelToken_Pool,
  userId: Lib_PanelTokens_CreatePanelToken_UserId,
  input: Lib_PanelTokens_CreatePanelToken_Input,
): Lib_PanelTokens_CreatePanelToken_Returns {
  const taken: Lib_PanelTokens_CreatePanelToken_Taken = await pool.query('SELECT id FROM panel_api_tokens WHERE user_id = $1 AND LOWER(name) = LOWER($2)', [
    userId,
    input['name'],
  ]);

  if ((taken.rowCount ?? 0) > 0) {
    return 'name-taken';
  }

  const id: Lib_PanelTokens_CreatePanelToken_Id = `tok-${randomBytes(8).toString('hex')}`;
  const plaintext: Lib_PanelTokens_CreatePanelToken_Plaintext = `dsb_${randomBytes(32).toString('base64url')}`;

  try {
    const result: Lib_PanelTokens_CreatePanelToken_Result = await pool.query<Lib_PanelTokens_TokenQueryRow>(
      `INSERT INTO panel_api_tokens (id, user_id, name, token_hash, scopes, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${TOKEN_COLUMNS}`,
      [
        id,
        userId,
        input['name'],
        digestValue(plaintext),
        [...input['scopes']].sort(),
        input['expiresAt'] ?? null,
      ],
    );
    const row: Lib_PanelTokens_CreatePanelToken_Row = result.rows[0];

    if (row === undefined) {
      throw new Error('The token could not be stored.');
    }

    return {
      plaintext,
      token: tokenFromRow(row),
    };
  } catch (error) {
    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'name-taken';
    }

    throw error;
  }
}

/**
 * Panel Tokens - Delete Panel Token.
 *
 * Deletes one of a user's tokens and returns its name.
 * Requests that use it fail from the next one on.
 *
 * @param {Lib_PanelTokens_DeletePanelToken_Pool}    pool    - Pool.
 * @param {Lib_PanelTokens_DeletePanelToken_UserId}  userId  - User id.
 * @param {Lib_PanelTokens_DeletePanelToken_TokenId} tokenId - Token id.
 *
 * @returns {Lib_PanelTokens_DeletePanelToken_Returns}
 *
 * @since 4.0.0
 */
export async function deletePanelToken(
  pool: Lib_PanelTokens_DeletePanelToken_Pool,
  userId: Lib_PanelTokens_DeletePanelToken_UserId,
  tokenId: Lib_PanelTokens_DeletePanelToken_TokenId,
): Lib_PanelTokens_DeletePanelToken_Returns {
  const result: Lib_PanelTokens_DeletePanelToken_Result = await pool.query<Lib_PanelTokens_DeletePanelToken_QueryRow>('DELETE FROM panel_api_tokens WHERE id = $1 AND user_id = $2 RETURNING name', [
    tokenId,
    userId,
  ]);
  const row: Lib_PanelTokens_DeletePanelToken_Row = result.rows[0];

  return (row === undefined) ? undefined : row['name'];
}

/**
 * Panel Tokens - Is Panel Token ID.
 *
 * Checks that a route value has the shape of a token id: tok- and 16 hexadecimal digits.
 * Other values never reach the database.
 *
 * @param {Lib_PanelTokens_IsPanelTokenId_Value} value - Value.
 *
 * @returns {Lib_PanelTokens_IsPanelTokenId_Returns}
 *
 * @since 4.0.0
 */
export function isPanelTokenId(value: Lib_PanelTokens_IsPanelTokenId_Value): Lib_PanelTokens_IsPanelTokenId_Returns {
  return (
    typeof value === 'string'
    && value.length === 20
    && value.startsWith('tok-') === true
    && [...value.slice(4)].every((character) => TOKEN_ID_CHARACTERS.includes(character)) === true
  );
}

/**
 * Panel Tokens - List Panel Tokens.
 *
 * Lists a user's personal access tokens, newest first.
 * Values and hashes are never part of the list.
 *
 * @param {Lib_PanelTokens_ListPanelTokens_Pool}   pool   - Pool.
 * @param {Lib_PanelTokens_ListPanelTokens_UserId} userId - User id.
 *
 * @returns {Lib_PanelTokens_ListPanelTokens_Returns}
 *
 * @since 4.0.0
 */
export async function listPanelTokens(
  pool: Lib_PanelTokens_ListPanelTokens_Pool,
  userId: Lib_PanelTokens_ListPanelTokens_UserId,
): Lib_PanelTokens_ListPanelTokens_Returns {
  const result: Lib_PanelTokens_ListPanelTokens_Result = await pool.query<Lib_PanelTokens_TokenQueryRow>(`SELECT ${TOKEN_COLUMNS} FROM panel_api_tokens WHERE user_id = $1 ORDER BY created_at DESC, id`, [userId]);

  return result.rows.map((row) => tokenFromRow(row));
}

/**
 * Panel Tokens - Update Panel Token.
 *
 * Changes a token's name, scopes, and expiration without changing its value.
 * Leaving the expiration out keeps it, and null removes it.
 *
 * @param {Lib_PanelTokens_UpdatePanelToken_Pool}    pool    - Pool.
 * @param {Lib_PanelTokens_UpdatePanelToken_UserId}  userId  - User id.
 * @param {Lib_PanelTokens_UpdatePanelToken_TokenId} tokenId - Token id.
 * @param {Lib_PanelTokens_UpdatePanelToken_Input}   input   - Input.
 *
 * @returns {Lib_PanelTokens_UpdatePanelToken_Returns}
 *
 * @since 4.0.0
 */
export async function updatePanelToken(
  pool: Lib_PanelTokens_UpdatePanelToken_Pool,
  userId: Lib_PanelTokens_UpdatePanelToken_UserId,
  tokenId: Lib_PanelTokens_UpdatePanelToken_TokenId,
  input: Lib_PanelTokens_UpdatePanelToken_Input,
): Lib_PanelTokens_UpdatePanelToken_Returns {
  const existing: Lib_PanelTokens_UpdatePanelToken_Existing = await pool.query('SELECT id FROM panel_api_tokens WHERE id = $1 AND user_id = $2', [
    tokenId,
    userId,
  ]);

  if ((existing.rowCount ?? 0) === 0) {
    return 'not-found';
  }

  const taken: Lib_PanelTokens_UpdatePanelToken_Taken = await pool.query('SELECT id FROM panel_api_tokens WHERE user_id = $1 AND LOWER(name) = LOWER($2) AND id <> $3', [
    userId,
    input['name'],
    tokenId,
  ]);

  if ((taken.rowCount ?? 0) > 0) {
    return 'name-taken';
  }

  try {
    const result: Lib_PanelTokens_UpdatePanelToken_Result = await pool.query<Lib_PanelTokens_TokenQueryRow>(
      `UPDATE panel_api_tokens SET name = $3, scopes = $4, expires_at = CASE WHEN $5::BOOLEAN THEN expires_at ELSE $6::TIMESTAMPTZ END WHERE id = $1 AND user_id = $2 RETURNING ${TOKEN_COLUMNS}`,
      [
        tokenId,
        userId,
        input['name'],
        [...input['scopes']].sort(),
        input['expiresAt'] === undefined,
        input['expiresAt'] ?? null,
      ],
    );
    const row: Lib_PanelTokens_UpdatePanelToken_Row = result.rows[0];

    return (row === undefined) ? 'not-found' : tokenFromRow(row);
  } catch (error) {
    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'name-taken';
    }

    throw error;
  }
}

/**
 * Panel Tokens - Token From Row.
 *
 * Maps a token row to the shape every appliance's API returns.
 * Scopes come back sorted and times as ISO 8601 strings.
 *
 * @param {Lib_PanelTokens_TokenFromRow_Row} row - Row.
 *
 * @private
 *
 * @returns {Lib_PanelTokens_TokenFromRow_Returns}
 *
 * @since 4.0.0
 */
function tokenFromRow(row: Lib_PanelTokens_TokenFromRow_Row): Lib_PanelTokens_TokenFromRow_Returns {
  return {
    createdAt: new Date(row['created_at']).toISOString(),
    expiresAt: (row['expires_at'] === null) ? null : new Date(row['expires_at']).toISOString(),
    id: row['id'],
    lastUsedAt: (row['last_used_at'] === null) ? null : new Date(row['last_used_at']).toISOString(),
    name: row['name'],
    scopes: [...row['scopes']].sort(),
  };
}
