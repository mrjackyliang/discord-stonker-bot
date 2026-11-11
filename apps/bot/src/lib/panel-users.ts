import {
  hashPanelPassword,
  runTransaction,
} from './panel-auth.js';

import type {
  Lib_PanelUsers_CreatePanelUser_Client,
  Lib_PanelUsers_CreatePanelUser_FirstInsertedRow,
  Lib_PanelUsers_CreatePanelUser_Input,
  Lib_PanelUsers_CreatePanelUser_Inserted,
  Lib_PanelUsers_CreatePanelUser_InsertedRow,
  Lib_PanelUsers_CreatePanelUser_PasswordHash,
  Lib_PanelUsers_CreatePanelUser_Pool,
  Lib_PanelUsers_CreatePanelUser_Returns,
  Lib_PanelUsers_CreatePanelUser_Taken,
  Lib_PanelUsers_CreatePanelUser_User,
  Lib_PanelUsers_CreatePanelUser_UserId,
  Lib_PanelUsers_DeletePanelUser_Pool,
  Lib_PanelUsers_DeletePanelUser_QueryRow,
  Lib_PanelUsers_DeletePanelUser_Result,
  Lib_PanelUsers_DeletePanelUser_Returns,
  Lib_PanelUsers_DeletePanelUser_Row,
  Lib_PanelUsers_DeletePanelUser_UserId,
  Lib_PanelUsers_GetPanelUser_Pool,
  Lib_PanelUsers_GetPanelUser_Result,
  Lib_PanelUsers_GetPanelUser_Returns,
  Lib_PanelUsers_GetPanelUser_Row,
  Lib_PanelUsers_GetPanelUser_UserId,
  Lib_PanelUsers_InsertServerAccess_AllServers,
  Lib_PanelUsers_InsertServerAccess_Client,
  Lib_PanelUsers_InsertServerAccess_Returns,
  Lib_PanelUsers_InsertServerAccess_ServerIds,
  Lib_PanelUsers_InsertServerAccess_UserId,
  Lib_PanelUsers_ListPanelUsers_Pool,
  Lib_PanelUsers_ListPanelUsers_Result,
  Lib_PanelUsers_ListPanelUsers_Returns,
  Lib_PanelUsers_ResetPanelUserPassword_Client,
  Lib_PanelUsers_ResetPanelUserPassword_Password,
  Lib_PanelUsers_ResetPanelUserPassword_PasswordHash,
  Lib_PanelUsers_ResetPanelUserPassword_Pool,
  Lib_PanelUsers_ResetPanelUserPassword_Result,
  Lib_PanelUsers_ResetPanelUserPassword_Returns,
  Lib_PanelUsers_ResetPanelUserPassword_UserId,
  Lib_PanelUsers_ResetPanelUserTwoFactor_Client,
  Lib_PanelUsers_ResetPanelUserTwoFactor_Existing,
  Lib_PanelUsers_ResetPanelUserTwoFactor_Pool,
  Lib_PanelUsers_ResetPanelUserTwoFactor_Returns,
  Lib_PanelUsers_ResetPanelUserTwoFactor_UserId,
  Lib_PanelUsers_ServersExist_Count,
  Lib_PanelUsers_ServersExist_CountRow,
  Lib_PanelUsers_ServersExist_FirstCountRow,
  Lib_PanelUsers_ServersExist_Queryable,
  Lib_PanelUsers_ServersExist_Returns,
  Lib_PanelUsers_ServersExist_ServerIds,
  Lib_PanelUsers_UpdatePanelUser_Client,
  Lib_PanelUsers_UpdatePanelUser_Input,
  Lib_PanelUsers_UpdatePanelUser_Pool,
  Lib_PanelUsers_UpdatePanelUser_Returns,
  Lib_PanelUsers_UpdatePanelUser_Updated,
  Lib_PanelUsers_UpdatePanelUser_UpdateResult,
  Lib_PanelUsers_UpdatePanelUser_UserId,
  Lib_PanelUsers_UserColumns,
  Lib_PanelUsers_UserFromRow_Returns,
  Lib_PanelUsers_UserFromRow_Row,
  Lib_PanelUsers_UserQueryRow,
} from '../types/lib/panel-users.d.ts';

/**
 * Panel Users - User Columns.
 *
 * Selects the safe columns every user answer uses, with server access and sign-in methods.
 * Password hashes and secrets never leave the database.
 *
 * @since 4.0.0
 */
const USER_COLUMNS: Lib_PanelUsers_UserColumns = 'panel_users.id::text AS id, panel_users.username, panel_users.role, panel_users.all_guilds, panel_users.enabled, panel_users.created_at, panel_users.last_login_at, ARRAY(SELECT guild_id FROM panel_user_guild_access WHERE panel_user_guild_access.user_id = panel_users.id ORDER BY guild_id) AS guild_ids, EXISTS(SELECT 1 FROM panel_totp_credentials WHERE panel_totp_credentials.user_id = panel_users.id) AS totp_enabled, (SELECT COUNT(*)::text FROM panel_passkeys WHERE panel_passkeys.user_id = panel_users.id) AS passkey_count';

/**
 * Panel Users - Create Panel User.
 *
 * Adds a panel user with a temporary password, a role, and their server access.
 * Taken usernames and servers the bot doesn't know are refused without changes.
 *
 * @param {Lib_PanelUsers_CreatePanelUser_Pool}  pool  - Pool.
 * @param {Lib_PanelUsers_CreatePanelUser_Input} input - Input.
 *
 * @returns {Lib_PanelUsers_CreatePanelUser_Returns}
 *
 * @since 4.0.0
 */
export async function createPanelUser(
  pool: Lib_PanelUsers_CreatePanelUser_Pool,
  input: Lib_PanelUsers_CreatePanelUser_Input,
): Lib_PanelUsers_CreatePanelUser_Returns {
  const taken: Lib_PanelUsers_CreatePanelUser_Taken = await pool.query('SELECT id FROM panel_users WHERE LOWER(username) = LOWER($1)', [input['username']]);

  if ((taken.rowCount ?? 0) > 0) {
    return 'username-taken';
  }

  if (input['allServers'] === false && await serversExist(pool, input['serverIds']) === false) {
    return 'server-unknown';
  }

  const passwordHash: Lib_PanelUsers_CreatePanelUser_PasswordHash = await hashPanelPassword(input['password']);
  let userId: Lib_PanelUsers_CreatePanelUser_UserId = '';

  try {
    await runTransaction(pool, async (client: Lib_PanelUsers_CreatePanelUser_Client) => {
      const inserted: Lib_PanelUsers_CreatePanelUser_Inserted = await client.query<Lib_PanelUsers_CreatePanelUser_InsertedRow>(
        'INSERT INTO panel_users (username, password_hash, role, all_guilds) VALUES ($1, $2, $3, $4) RETURNING id::text AS id',
        [
          input['username'],
          passwordHash,
          input['role'],
          input['allServers'],
        ],
      );

      const insertedRow: Lib_PanelUsers_CreatePanelUser_FirstInsertedRow = inserted.rows[0];

      if (insertedRow === undefined) {
        throw new Error('The user could not be stored.');
      }

      userId = insertedRow['id'];

      await insertServerAccess(client, userId, input['allServers'], input['serverIds']);

      return true;
    });
  } catch (error) {
    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'username-taken';
    }

    throw error;
  }

  const user: Lib_PanelUsers_CreatePanelUser_User = await getPanelUser(pool, userId);

  if (user === undefined) {
    throw new Error('The new user could not be loaded.');
  }

  return user;
}

/**
 * Panel Users - Delete Panel User.
 *
 * Deletes a panel user with their sessions, tokens, and sign-in methods, returning the name.
 * The owner account can never be deleted.
 *
 * @param {Lib_PanelUsers_DeletePanelUser_Pool}   pool   - Pool.
 * @param {Lib_PanelUsers_DeletePanelUser_UserId} userId - User id.
 *
 * @returns {Lib_PanelUsers_DeletePanelUser_Returns}
 *
 * @since 4.0.0
 */
export async function deletePanelUser(
  pool: Lib_PanelUsers_DeletePanelUser_Pool,
  userId: Lib_PanelUsers_DeletePanelUser_UserId,
): Lib_PanelUsers_DeletePanelUser_Returns {
  const result: Lib_PanelUsers_DeletePanelUser_Result = await pool.query<Lib_PanelUsers_DeletePanelUser_QueryRow>('DELETE FROM panel_users WHERE id = $1 AND role <> \'owner\' RETURNING username', [userId]);
  const row: Lib_PanelUsers_DeletePanelUser_Row = result.rows[0];

  return (row === undefined) ? undefined : row['username'];
}

/**
 * Panel Users - Get Panel User.
 *
 * Loads one panel user with their server access and sign-in methods.
 * Unknown ids return undefined.
 *
 * @param {Lib_PanelUsers_GetPanelUser_Pool}   pool   - Pool.
 * @param {Lib_PanelUsers_GetPanelUser_UserId} userId - User id.
 *
 * @returns {Lib_PanelUsers_GetPanelUser_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelUser(
  pool: Lib_PanelUsers_GetPanelUser_Pool,
  userId: Lib_PanelUsers_GetPanelUser_UserId,
): Lib_PanelUsers_GetPanelUser_Returns {
  const result: Lib_PanelUsers_GetPanelUser_Result = await pool.query<Lib_PanelUsers_UserQueryRow>(`SELECT ${USER_COLUMNS} FROM panel_users WHERE panel_users.id = $1`, [userId]);
  const row: Lib_PanelUsers_GetPanelUser_Row = result.rows[0];

  return (row === undefined) ? undefined : userFromRow(row);
}

/**
 * Panel Users - List Panel Users.
 *
 * Lists every panel user: the owner first, then administrators, operators, and viewers.
 * Users of the same role are sorted by name.
 *
 * @param {Lib_PanelUsers_ListPanelUsers_Pool} pool - Pool.
 *
 * @returns {Lib_PanelUsers_ListPanelUsers_Returns}
 *
 * @since 4.0.0
 */
export async function listPanelUsers(pool: Lib_PanelUsers_ListPanelUsers_Pool): Lib_PanelUsers_ListPanelUsers_Returns {
  const result: Lib_PanelUsers_ListPanelUsers_Result = await pool.query<Lib_PanelUsers_UserQueryRow>(`SELECT ${USER_COLUMNS} FROM panel_users ORDER BY CASE panel_users.role WHEN 'owner' THEN 0 WHEN 'administrator' THEN 1 WHEN 'operator' THEN 2 ELSE 3 END, LOWER(panel_users.username), panel_users.id`);

  return result.rows.map((row) => userFromRow(row));
}

/**
 * Panel Users - Reset Panel User Password.
 *
 * Gives another user a new temporary password and signs them out everywhere.
 * It reports whether the user exists.
 *
 * @param {Lib_PanelUsers_ResetPanelUserPassword_Pool}     pool     - Pool.
 * @param {Lib_PanelUsers_ResetPanelUserPassword_UserId}   userId   - User id.
 * @param {Lib_PanelUsers_ResetPanelUserPassword_Password} password - Password.
 *
 * @returns {Lib_PanelUsers_ResetPanelUserPassword_Returns}
 *
 * @since 4.0.0
 */
export async function resetPanelUserPassword(
  pool: Lib_PanelUsers_ResetPanelUserPassword_Pool,
  userId: Lib_PanelUsers_ResetPanelUserPassword_UserId,
  password: Lib_PanelUsers_ResetPanelUserPassword_Password,
): Lib_PanelUsers_ResetPanelUserPassword_Returns {
  const passwordHash: Lib_PanelUsers_ResetPanelUserPassword_PasswordHash = await hashPanelPassword(password);

  return runTransaction(pool, async (client: Lib_PanelUsers_ResetPanelUserPassword_Client) => {
    const result: Lib_PanelUsers_ResetPanelUserPassword_Result = await client.query('UPDATE panel_users SET password_hash = $2, updated_at = NOW() WHERE id = $1', [
      userId,
      passwordHash,
    ]);

    await client.query('DELETE FROM panel_sessions WHERE user_id = $1', [userId]);

    return result.rowCount === 1;
  });
}

/**
 * Panel Users - Reset Panel User Two Factor.
 *
 * Removes another user's authenticator app, recovery codes, and passkeys.
 * They can then sign in with their password and set them up again.
 *
 * @param {Lib_PanelUsers_ResetPanelUserTwoFactor_Pool}   pool   - Pool.
 * @param {Lib_PanelUsers_ResetPanelUserTwoFactor_UserId} userId - User id.
 *
 * @returns {Lib_PanelUsers_ResetPanelUserTwoFactor_Returns}
 *
 * @since 4.0.0
 */
export async function resetPanelUserTwoFactor(
  pool: Lib_PanelUsers_ResetPanelUserTwoFactor_Pool,
  userId: Lib_PanelUsers_ResetPanelUserTwoFactor_UserId,
): Lib_PanelUsers_ResetPanelUserTwoFactor_Returns {
  return runTransaction(pool, async (client: Lib_PanelUsers_ResetPanelUserTwoFactor_Client) => {
    const existing: Lib_PanelUsers_ResetPanelUserTwoFactor_Existing = await client.query('SELECT id FROM panel_users WHERE id = $1', [userId]);

    if ((existing.rowCount ?? 0) === 0) {
      return false;
    }

    await client.query('DELETE FROM panel_totp_credentials WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM panel_totp_enrollments WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM panel_recovery_codes WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM panel_passkeys WHERE user_id = $1', [userId]);

    await client.query('DELETE FROM panel_webauthn_ceremonies WHERE user_id = $1', [userId]);

    return true;
  });
}

/**
 * Panel Users - Update Panel User.
 *
 * Changes another user's role, server access, and whether they can sign in.
 * Suspending a user signs them out, and their tokens stop working at once.
 *
 * @param {Lib_PanelUsers_UpdatePanelUser_Pool}   pool   - Pool.
 * @param {Lib_PanelUsers_UpdatePanelUser_UserId} userId - User id.
 * @param {Lib_PanelUsers_UpdatePanelUser_Input}  input  - Input.
 *
 * @returns {Lib_PanelUsers_UpdatePanelUser_Returns}
 *
 * @since 4.0.0
 */
export async function updatePanelUser(
  pool: Lib_PanelUsers_UpdatePanelUser_Pool,
  userId: Lib_PanelUsers_UpdatePanelUser_UserId,
  input: Lib_PanelUsers_UpdatePanelUser_Input,
): Lib_PanelUsers_UpdatePanelUser_Returns {
  if (input['allServers'] === false && await serversExist(pool, input['serverIds']) === false) {
    return 'server-unknown';
  }

  const updated: Lib_PanelUsers_UpdatePanelUser_Updated = await runTransaction(pool, async (client: Lib_PanelUsers_UpdatePanelUser_Client) => {
    const updateResult: Lib_PanelUsers_UpdatePanelUser_UpdateResult = await client.query(
      'UPDATE panel_users SET role = $2, all_guilds = $3, enabled = $4, updated_at = NOW() WHERE id = $1 AND role <> \'owner\'',
      [
        userId,
        input['role'],
        input['allServers'],
        input['enabled'],
      ],
    );

    if (updateResult.rowCount !== 1) {
      return false;
    }

    await client.query('DELETE FROM panel_user_guild_access WHERE user_id = $1', [userId]);

    await insertServerAccess(client, userId, input['allServers'], input['serverIds']);

    if (input['enabled'] === false) {
      await client.query('DELETE FROM panel_sessions WHERE user_id = $1', [userId]);
    }

    return true;
  });

  if (updated === false) {
    return 'not-found';
  }

  return await getPanelUser(pool, userId) ?? 'not-found';
}

/**
 * Panel Users - Insert Server Access.
 *
 * Writes a user's server list inside the caller's transaction.
 * Users with access to every server get no rows.
 *
 * @param {Lib_PanelUsers_InsertServerAccess_Client}     client     - Client.
 * @param {Lib_PanelUsers_InsertServerAccess_UserId}     userId     - User id.
 * @param {Lib_PanelUsers_InsertServerAccess_AllServers} allServers - All servers.
 * @param {Lib_PanelUsers_InsertServerAccess_ServerIds}  serverIds  - Server ids.
 *
 * @private
 *
 * @returns {Lib_PanelUsers_InsertServerAccess_Returns}
 *
 * @since 4.0.0
 */
async function insertServerAccess(
  client: Lib_PanelUsers_InsertServerAccess_Client,
  userId: Lib_PanelUsers_InsertServerAccess_UserId,
  allServers: Lib_PanelUsers_InsertServerAccess_AllServers,
  serverIds: Lib_PanelUsers_InsertServerAccess_ServerIds,
): Lib_PanelUsers_InsertServerAccess_Returns {
  if (allServers === true) {
    return;
  }

  for (const serverId of serverIds) {
    await client.query('INSERT INTO panel_user_guild_access (user_id, guild_id) VALUES ($1, $2)', [
      userId,
      serverId,
    ]);
  }

  return;
}

/**
 * Panel Users - Servers Exist.
 *
 * Checks that every listed server is one the bot has seen.
 * An empty list passes.
 *
 * @param {Lib_PanelUsers_ServersExist_Queryable} queryable - Queryable.
 * @param {Lib_PanelUsers_ServersExist_ServerIds} serverIds - Server ids.
 *
 * @private
 *
 * @returns {Lib_PanelUsers_ServersExist_Returns}
 *
 * @since 4.0.0
 */
async function serversExist(
  queryable: Lib_PanelUsers_ServersExist_Queryable,
  serverIds: Lib_PanelUsers_ServersExist_ServerIds,
): Lib_PanelUsers_ServersExist_Returns {
  if (serverIds.length === 0) {
    return true;
  }

  const count: Lib_PanelUsers_ServersExist_Count = await queryable.query<Lib_PanelUsers_ServersExist_CountRow>('SELECT COUNT(*)::text AS count FROM discord_servers WHERE guild_id = ANY($1::text[])', [serverIds]);
  const countRow: Lib_PanelUsers_ServersExist_FirstCountRow = count.rows[0];

  return countRow !== undefined && Number(countRow['count']) === serverIds.length;
}

/**
 * Panel Users - User From Row.
 *
 * Maps a user row to the shape the Users page shows.
 * Users with access to every server list no individual servers.
 *
 * @param {Lib_PanelUsers_UserFromRow_Row} row - Row.
 *
 * @private
 *
 * @returns {Lib_PanelUsers_UserFromRow_Returns}
 *
 * @since 4.0.0
 */
function userFromRow(row: Lib_PanelUsers_UserFromRow_Row): Lib_PanelUsers_UserFromRow_Returns {
  return {
    allServers: row['all_guilds'],
    createdAt: new Date(row['created_at']).toISOString(),
    enabled: row['enabled'],
    id: row['id'],
    lastSignInAt: (row['last_login_at'] === null) ? null : new Date(row['last_login_at']).toISOString(),
    passkeys: Number(row['passkey_count']),
    role: row['role'],
    serverIds: (row['all_guilds'] === true) ? [] : [...row['guild_ids']],
    twoFactor: row['totp_enabled'],
    username: row['username'],
  };
}
