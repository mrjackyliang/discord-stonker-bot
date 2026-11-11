import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

import type {
  Lib_PanelSessions_AccessUserFromRow_Returns,
  Lib_PanelSessions_AccessUserFromRow_Row,
  Lib_PanelSessions_AuthenticatePanelToken_FirstRow,
  Lib_PanelSessions_AuthenticatePanelToken_Pool,
  Lib_PanelSessions_AuthenticatePanelToken_RawToken,
  Lib_PanelSessions_AuthenticatePanelToken_Result,
  Lib_PanelSessions_AuthenticatePanelToken_Returns,
  Lib_PanelSessions_AuthenticatePanelToken_Row,
  Lib_PanelSessions_CreatePanelSession_CsrfToken,
  Lib_PanelSessions_CreatePanelSession_FirstRow,
  Lib_PanelSessions_CreatePanelSession_Metadata,
  Lib_PanelSessions_CreatePanelSession_Pool,
  Lib_PanelSessions_CreatePanelSession_Result,
  Lib_PanelSessions_CreatePanelSession_Returns,
  Lib_PanelSessions_CreatePanelSession_Row,
  Lib_PanelSessions_CreatePanelSession_SessionToken,
  Lib_PanelSessions_CreatePanelSession_UserId,
  Lib_PanelSessions_DeletePanelSession_Pool,
  Lib_PanelSessions_DeletePanelSession_Returns,
  Lib_PanelSessions_DeletePanelSession_SessionToken,
  Lib_PanelSessions_DeletePanelUserSessions_ExceptSessionToken,
  Lib_PanelSessions_DeletePanelUserSessions_Pool,
  Lib_PanelSessions_DeletePanelUserSessions_Returns,
  Lib_PanelSessions_DeletePanelUserSessions_UserId,
  Lib_PanelSessions_DigestsEqual_Left,
  Lib_PanelSessions_DigestsEqual_LeftBuffer,
  Lib_PanelSessions_DigestsEqual_Returns,
  Lib_PanelSessions_DigestsEqual_Right,
  Lib_PanelSessions_DigestsEqual_RightBuffer,
  Lib_PanelSessions_DigestValue_Returns,
  Lib_PanelSessions_DigestValue_Value,
  Lib_PanelSessions_GetPanelSession_FirstRow,
  Lib_PanelSessions_GetPanelSession_Pool,
  Lib_PanelSessions_GetPanelSession_Result,
  Lib_PanelSessions_GetPanelSession_Returns,
  Lib_PanelSessions_GetPanelSession_Row,
  Lib_PanelSessions_GetPanelSession_SessionToken,
  Lib_PanelSessions_SessionDurationHours,
  Lib_PanelSessions_UserAgentLimit,
} from '../types/lib/panel-sessions.d.ts';

/**
 * Panel Sessions - Session Duration Hours.
 *
 * Keeps a browser signed in for one day, the same as the other appliances.
 * Signing in again starts a new session instead of extending the old one.
 *
 * @since 4.0.0
 */
const SESSION_DURATION_HOURS: Lib_PanelSessions_SessionDurationHours = 24;

/**
 * Panel Sessions - User Agent Limit.
 *
 * Bounds the browser description stored with each session.
 * Longer values are cut instead of rejected.
 *
 * @since 4.0.0
 */
const USER_AGENT_LIMIT: Lib_PanelSessions_UserAgentLimit = 500;

/**
 * Panel Sessions - Authenticate Panel Token.
 *
 * Resolves a personal access token to its owner while it is unexpired and the owner enabled.
 * A match records the time it was last used.
 *
 * @param {Lib_PanelSessions_AuthenticatePanelToken_Pool}     pool     - Pool.
 * @param {Lib_PanelSessions_AuthenticatePanelToken_RawToken} rawToken - Raw token.
 *
 * @returns {Lib_PanelSessions_AuthenticatePanelToken_Returns}
 *
 * @since 4.0.0
 */
export async function authenticatePanelToken(
  pool: Lib_PanelSessions_AuthenticatePanelToken_Pool,
  rawToken: Lib_PanelSessions_AuthenticatePanelToken_RawToken,
): Lib_PanelSessions_AuthenticatePanelToken_Returns {
  const result: Lib_PanelSessions_AuthenticatePanelToken_Result = await pool.query<Lib_PanelSessions_AuthenticatePanelToken_Row>(
    'UPDATE panel_api_tokens SET last_used_at = NOW() FROM panel_users WHERE panel_api_tokens.token_hash = $1 AND panel_users.id = panel_api_tokens.user_id AND panel_users.enabled = TRUE AND (panel_api_tokens.expires_at IS NULL OR panel_api_tokens.expires_at > NOW()) RETURNING panel_api_tokens.id AS token_id, panel_api_tokens.name AS token_name, panel_api_tokens.scopes, panel_users.id::text AS user_id, panel_users.username, panel_users.role, panel_users.all_guilds, ARRAY(SELECT guild_id FROM panel_user_guild_access WHERE panel_user_guild_access.user_id = panel_users.id ORDER BY guild_id) AS guild_ids',
    [digestValue(rawToken)],
  );
  const row: Lib_PanelSessions_AuthenticatePanelToken_FirstRow = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return {
    id: row['token_id'],
    name: row['token_name'],
    scopes: [...row['scopes']].sort(),
    user: accessUserFromRow(row),
  };
}

/**
 * Panel Sessions - Create Panel Session.
 *
 * Stores a new browser session for a verified user and records the sign-in time.
 * Only digests of the session and CSRF tokens are kept in the database.
 *
 * @param {Lib_PanelSessions_CreatePanelSession_Pool}     pool     - Pool.
 * @param {Lib_PanelSessions_CreatePanelSession_UserId}   userId   - User id.
 * @param {Lib_PanelSessions_CreatePanelSession_Metadata} metadata - Metadata.
 *
 * @returns {Lib_PanelSessions_CreatePanelSession_Returns}
 *
 * @since 4.0.0
 */
export async function createPanelSession(
  pool: Lib_PanelSessions_CreatePanelSession_Pool,
  userId: Lib_PanelSessions_CreatePanelSession_UserId,
  metadata: Lib_PanelSessions_CreatePanelSession_Metadata,
): Lib_PanelSessions_CreatePanelSession_Returns {
  const sessionToken: Lib_PanelSessions_CreatePanelSession_SessionToken = `dss_${randomBytes(32).toString('base64url')}`;
  const csrfToken: Lib_PanelSessions_CreatePanelSession_CsrfToken = `dsc_${randomBytes(24).toString('base64url')}`;
  const result: Lib_PanelSessions_CreatePanelSession_Result = await pool.query<Lib_PanelSessions_CreatePanelSession_Row>(
    `INSERT INTO panel_sessions (token_hash, user_id, csrf_token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, NOW() + INTERVAL '${SESSION_DURATION_HOURS} hours', $4, $5) RETURNING expires_at`,
    [
      digestValue(sessionToken),
      userId,
      digestValue(csrfToken),
      metadata['ipAddress'],
      metadata['userAgent'].slice(0, USER_AGENT_LIMIT),
    ],
  );

  const row: Lib_PanelSessions_CreatePanelSession_FirstRow = result.rows[0];

  if (row === undefined) {
    throw new Error('The session could not be stored.');
  }

  await pool.query('UPDATE panel_users SET last_login_at = NOW() WHERE id = $1', [userId]);

  return {
    csrfToken,
    expiresAt: new Date(row['expires_at']).toISOString(),
    sessionToken,
  };
}

/**
 * Panel Sessions - Delete Panel Session.
 *
 * Signs out one browser by deleting its stored session.
 * Other sessions of the same user keep working.
 *
 * @param {Lib_PanelSessions_DeletePanelSession_Pool}         pool         - Pool.
 * @param {Lib_PanelSessions_DeletePanelSession_SessionToken} sessionToken - Session token.
 *
 * @returns {Lib_PanelSessions_DeletePanelSession_Returns}
 *
 * @since 4.0.0
 */
export async function deletePanelSession(
  pool: Lib_PanelSessions_DeletePanelSession_Pool,
  sessionToken: Lib_PanelSessions_DeletePanelSession_SessionToken,
): Lib_PanelSessions_DeletePanelSession_Returns {
  await pool.query('DELETE FROM panel_sessions WHERE token_hash = $1', [digestValue(sessionToken)]);

  return;
}

/**
 * Panel Sessions - Delete Panel User Sessions.
 *
 * Signs a user out everywhere, optionally keeping the browser that made the change.
 * Password changes, resets, and suspensions use it.
 *
 * @param {Lib_PanelSessions_DeletePanelUserSessions_Pool}               pool                 - Pool.
 * @param {Lib_PanelSessions_DeletePanelUserSessions_UserId}             userId               - User id.
 * @param {Lib_PanelSessions_DeletePanelUserSessions_ExceptSessionToken} [exceptSessionToken] - Except session token.
 *
 * @returns {Lib_PanelSessions_DeletePanelUserSessions_Returns}
 *
 * @since 4.0.0
 */
export async function deletePanelUserSessions(
  pool: Lib_PanelSessions_DeletePanelUserSessions_Pool,
  userId: Lib_PanelSessions_DeletePanelUserSessions_UserId,
  exceptSessionToken?: Lib_PanelSessions_DeletePanelUserSessions_ExceptSessionToken,
): Lib_PanelSessions_DeletePanelUserSessions_Returns {
  if (exceptSessionToken === undefined) {
    await pool.query('DELETE FROM panel_sessions WHERE user_id = $1', [userId]);

    return;
  }

  await pool.query('DELETE FROM panel_sessions WHERE user_id = $1 AND token_hash <> $2', [
    userId,
    digestValue(exceptSessionToken),
  ]);

  return;
}

/**
 * Panel Sessions - Digests Equal.
 *
 * Compares two hex digests in constant time.
 * Digests of different lengths never match.
 *
 * @param {Lib_PanelSessions_DigestsEqual_Left}  left  - Left.
 * @param {Lib_PanelSessions_DigestsEqual_Right} right - Right.
 *
 * @returns {Lib_PanelSessions_DigestsEqual_Returns}
 *
 * @since 4.0.0
 */
export function digestsEqual(
  left: Lib_PanelSessions_DigestsEqual_Left,
  right: Lib_PanelSessions_DigestsEqual_Right,
): Lib_PanelSessions_DigestsEqual_Returns {
  const leftBuffer: Lib_PanelSessions_DigestsEqual_LeftBuffer = Buffer.from(left, 'hex');
  const rightBuffer: Lib_PanelSessions_DigestsEqual_RightBuffer = Buffer.from(right, 'hex');

  if (leftBuffer.length !== rightBuffer.length || leftBuffer.length === 0) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

/**
 * Panel Sessions - Digest Value.
 *
 * Hashes a session, CSRF, or API token with SHA-256 before it is stored or compared.
 * Raw token values never reach the database.
 *
 * @param {Lib_PanelSessions_DigestValue_Value} value - Value.
 *
 * @returns {Lib_PanelSessions_DigestValue_Returns}
 *
 * @since 4.0.0
 */
export function digestValue(value: Lib_PanelSessions_DigestValue_Value): Lib_PanelSessions_DigestValue_Returns {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Panel Sessions - Get Panel Session.
 *
 * Returns the live session and its enabled user, refreshing the last-seen time.
 * Expired sessions are removed first, so they never match.
 *
 * @param {Lib_PanelSessions_GetPanelSession_Pool}         pool         - Pool.
 * @param {Lib_PanelSessions_GetPanelSession_SessionToken} sessionToken - Session token.
 *
 * @returns {Lib_PanelSessions_GetPanelSession_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelSession(
  pool: Lib_PanelSessions_GetPanelSession_Pool,
  sessionToken: Lib_PanelSessions_GetPanelSession_SessionToken,
): Lib_PanelSessions_GetPanelSession_Returns {
  await pool.query('DELETE FROM panel_sessions WHERE expires_at <= NOW()');

  const result: Lib_PanelSessions_GetPanelSession_Result = await pool.query<Lib_PanelSessions_GetPanelSession_Row>(
    'UPDATE panel_sessions SET last_seen_at = NOW() FROM panel_users WHERE panel_sessions.token_hash = $1 AND panel_users.id = panel_sessions.user_id AND panel_users.enabled = TRUE RETURNING panel_sessions.csrf_token_hash, panel_sessions.expires_at, panel_users.id::text AS user_id, panel_users.username, panel_users.role, panel_users.all_guilds, ARRAY(SELECT guild_id FROM panel_user_guild_access WHERE panel_user_guild_access.user_id = panel_users.id ORDER BY guild_id) AS guild_ids',
    [digestValue(sessionToken)],
  );
  const row: Lib_PanelSessions_GetPanelSession_FirstRow = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return {
    csrfHash: row['csrf_token_hash'],
    expiresAt: new Date(row['expires_at']).toISOString(),
    user: accessUserFromRow(row),
  };
}

/**
 * Panel Sessions - Access User From Row.
 *
 * Maps a joined user row into the identity that access checks and routes rely on.
 * Server access is either every server or the listed ones.
 *
 * @param {Lib_PanelSessions_AccessUserFromRow_Row} row - Row.
 *
 * @private
 *
 * @returns {Lib_PanelSessions_AccessUserFromRow_Returns}
 *
 * @since 4.0.0
 */
function accessUserFromRow(row: Lib_PanelSessions_AccessUserFromRow_Row): Lib_PanelSessions_AccessUserFromRow_Returns {
  return {
    allServers: row['all_guilds'],
    id: row['user_id'],
    role: row['role'],
    serverIds: (row['all_guilds'] === true) ? [] : [...row['guild_ids']],
    username: row['username'],
  };
}
