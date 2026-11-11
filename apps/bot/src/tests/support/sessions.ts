import { randomBytes } from 'node:crypto';

import {
  createPanelSession,
  digestValue,
} from '../../lib/panel-sessions.js';

import type {
  Tests_Support_Sessions_CreateTestToken_Pool,
  Tests_Support_Sessions_CreateTestToken_RawToken,
  Tests_Support_Sessions_CreateTestToken_Returns,
  Tests_Support_Sessions_CreateTestToken_Scopes,
  Tests_Support_Sessions_CreateTestToken_TokenId,
  Tests_Support_Sessions_CreateTestToken_UserId,
  Tests_Support_Sessions_CreateTestUser_FirstRow,
  Tests_Support_Sessions_CreateTestUser_Options,
  Tests_Support_Sessions_CreateTestUser_Pool,
  Tests_Support_Sessions_CreateTestUser_Result,
  Tests_Support_Sessions_CreateTestUser_Returns,
  Tests_Support_Sessions_CreateTestUser_Row,
  Tests_Support_Sessions_SignInTestUser_Client,
  Tests_Support_Sessions_SignInTestUser_Options,
  Tests_Support_Sessions_SignInTestUser_Pool,
  Tests_Support_Sessions_SignInTestUser_Returns,
  Tests_Support_Sessions_SignInTestUser_Session,
  Tests_Support_Sessions_SignInTestUser_UserId,
} from '../../types/tests/support/sessions.d.ts';

/**
 * Sessions - Create Test Token.
 *
 * Stores a personal access token for a user and returns its raw value.
 * Use it to call routes with a Bearer token without the token API.
 *
 * @param {Tests_Support_Sessions_CreateTestToken_Pool}   pool   - Pool.
 * @param {Tests_Support_Sessions_CreateTestToken_UserId} userId - User id.
 * @param {Tests_Support_Sessions_CreateTestToken_Scopes} scopes - Scopes.
 *
 * @returns {Tests_Support_Sessions_CreateTestToken_Returns}
 *
 * @since 4.0.0
 */
export async function createTestToken(pool: Tests_Support_Sessions_CreateTestToken_Pool, userId: Tests_Support_Sessions_CreateTestToken_UserId, scopes: Tests_Support_Sessions_CreateTestToken_Scopes): Tests_Support_Sessions_CreateTestToken_Returns {
  const rawToken: Tests_Support_Sessions_CreateTestToken_RawToken = `dsb_${randomBytes(32).toString('base64url')}`;
  const tokenId: Tests_Support_Sessions_CreateTestToken_TokenId = `tok-${randomBytes(8).toString('hex')}`;

  await pool.query('INSERT INTO panel_api_tokens (id, user_id, name, token_hash, scopes) VALUES ($1, $2, $3, $4, $5)', [
    tokenId,
    userId,
    `Test token ${tokenId}`,
    digestValue(rawToken),
    scopes,
  ]);

  return rawToken;
}

/**
 * Sessions - Create Test User.
 *
 * Adds a panel user with a role and server access, without a usable password.
 * Tests that need a real password use the sign-in routes instead.
 *
 * @param {Tests_Support_Sessions_CreateTestUser_Pool}    pool    - Pool.
 * @param {Tests_Support_Sessions_CreateTestUser_Options} options - Options.
 *
 * @returns {Tests_Support_Sessions_CreateTestUser_Returns}
 *
 * @since 4.0.0
 */
export async function createTestUser(pool: Tests_Support_Sessions_CreateTestUser_Pool, options: Tests_Support_Sessions_CreateTestUser_Options): Tests_Support_Sessions_CreateTestUser_Returns {
  const result: Tests_Support_Sessions_CreateTestUser_Result = await pool.query<Tests_Support_Sessions_CreateTestUser_Row>('INSERT INTO panel_users (username, password_hash, role, all_guilds) VALUES ($1, $2, $3, $4) RETURNING id::text AS id', [
    options['username'],
    `$test$${'x'.repeat(40)}`,
    options['role'],
    options['allServers'],
  ]);
  const row: Tests_Support_Sessions_CreateTestUser_FirstRow = result.rows[0];

  if (row === undefined) {
    throw new Error('The test user was not created.');
  }

  const userId: Tests_Support_Sessions_SignInTestUser_UserId = row['id'];

  for (const serverId of options['serverIds']) {
    await pool.query('INSERT INTO panel_user_guild_access (user_id, guild_id) VALUES ($1, $2)', [
      userId,
      serverId,
    ]);
  }

  return userId;
}

/**
 * Sessions - Sign In Test User.
 *
 * Creates a user and a browser session for it, then puts both cookies on the client.
 * The client then sends the CSRF header on every change by itself.
 *
 * @param {Tests_Support_Sessions_SignInTestUser_Pool}    pool    - Pool.
 * @param {Tests_Support_Sessions_SignInTestUser_Client}  client  - Client.
 * @param {Tests_Support_Sessions_SignInTestUser_Options} options - Options.
 *
 * @returns {Tests_Support_Sessions_SignInTestUser_Returns}
 *
 * @since 4.0.0
 */
export async function signInTestUser(pool: Tests_Support_Sessions_SignInTestUser_Pool, client: Tests_Support_Sessions_SignInTestUser_Client, options: Tests_Support_Sessions_SignInTestUser_Options): Tests_Support_Sessions_SignInTestUser_Returns {
  const userId: Tests_Support_Sessions_SignInTestUser_UserId = await createTestUser(pool, options);
  const session: Tests_Support_Sessions_SignInTestUser_Session = await createPanelSession(pool, userId, {
    ipAddress: '127.0.0.1',
    userAgent: 'vitest',
  });

  client['cookies'].set('dsb_session', session['sessionToken']);

  client['cookies'].set('dsb_csrf', session['csrfToken']);

  return userId;
}
