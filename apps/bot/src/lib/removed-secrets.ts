import { roleCan } from './access.js';
import { getFeatureCatalog } from './feature-catalog.js';

import type {
  Lib_RemovedSecrets_DismissRemovedSecrets_CanWrite,
  Lib_RemovedSecrets_DismissRemovedSecrets_Pool,
  Lib_RemovedSecrets_DismissRemovedSecrets_Returns,
  Lib_RemovedSecrets_DismissRemovedSecrets_User,
  Lib_RemovedSecrets_ListRemovedSecrets_CanWrite,
  Lib_RemovedSecrets_ListRemovedSecrets_FeatureDefinition,
  Lib_RemovedSecrets_ListRemovedSecrets_FeatureKey,
  Lib_RemovedSecrets_ListRemovedSecrets_FeatureName,
  Lib_RemovedSecrets_ListRemovedSecrets_Pool,
  Lib_RemovedSecrets_ListRemovedSecrets_Result,
  Lib_RemovedSecrets_ListRemovedSecrets_Returns,
  Lib_RemovedSecrets_ListRemovedSecrets_User,
} from '../types/lib/removed-secrets.d.ts';

/**
 * Removed Secrets - Visible Condition.
 *
 * Picks the records one user may act on: their own authenticator app, and for people who
 * can change settings, the Bot Token, notifications, and feature secrets of their servers.
 *
 * @since 4.0.0
 */
const VISIBLE_CONDITION = '(removed_secrets.kind = \'authenticator\' AND removed_secrets.user_id = $1) OR ($2 AND removed_secrets.kind = \'bot-token\') OR ($2 AND removed_secrets.kind = \'notification\') OR ($2 AND removed_secrets.kind = \'feature-secrets\' AND ($3 OR removed_secrets.guild_id = ANY($4::text[])))';

/**
 * Removed Secrets - Dismiss Removed Secrets.
 *
 * Clears the control panel notice for one user. Anything not entered again stays removed,
 * and records the user can't see are left for the people who can.
 *
 * @param {Lib_RemovedSecrets_DismissRemovedSecrets_Pool} pool - Pool.
 * @param {Lib_RemovedSecrets_DismissRemovedSecrets_User} user - User.
 *
 * @returns {Lib_RemovedSecrets_DismissRemovedSecrets_Returns}
 *
 * @since 4.0.0
 */
export async function dismissRemovedSecrets(
  pool: Lib_RemovedSecrets_DismissRemovedSecrets_Pool,
  user: Lib_RemovedSecrets_DismissRemovedSecrets_User,
): Lib_RemovedSecrets_DismissRemovedSecrets_Returns {
  const canWrite: Lib_RemovedSecrets_DismissRemovedSecrets_CanWrite = roleCan(user['role'], 'configuration:write');

  await pool.query(
    `INSERT INTO removed_secret_dismissals (removed_secret_id, user_id) SELECT removed_secrets.id, $1 FROM removed_secrets WHERE ${VISIBLE_CONDITION} ON CONFLICT (removed_secret_id, user_id) DO NOTHING`,
    [
      user['id'],
      canWrite,
      user['allServers'],
      user['serverIds'],
    ],
  );

  return;
}

/**
 * Removed Secrets - List Removed Secrets.
 *
 * Lists what a lost credential key took that one user can enter again, oldest first.
 * Feature secrets carry their server and feature so the notice can open them.
 *
 * @param {Lib_RemovedSecrets_ListRemovedSecrets_Pool} pool - Pool.
 * @param {Lib_RemovedSecrets_ListRemovedSecrets_User} user - User.
 *
 * @returns {Lib_RemovedSecrets_ListRemovedSecrets_Returns}
 *
 * @since 4.0.0
 */
export async function listRemovedSecrets(
  pool: Lib_RemovedSecrets_ListRemovedSecrets_Pool,
  user: Lib_RemovedSecrets_ListRemovedSecrets_User,
): Lib_RemovedSecrets_ListRemovedSecrets_Returns {
  const canWrite: Lib_RemovedSecrets_ListRemovedSecrets_CanWrite = roleCan(user['role'], 'configuration:write');
  const result: Lib_RemovedSecrets_ListRemovedSecrets_Result = await pool.query(
    `SELECT removed_secrets.kind, removed_secrets.guild_id, removed_secrets.feature_key, removed_secrets.notification_id, removed_secrets.removed_at, COALESCE(discord_servers.name, removed_secrets.guild_id) AS server_name, notification_targets.name AS notification_name FROM removed_secrets LEFT JOIN discord_servers ON discord_servers.guild_id = removed_secrets.guild_id LEFT JOIN notification_targets ON notification_targets.id = removed_secrets.notification_id WHERE (${VISIBLE_CONDITION}) AND NOT EXISTS (SELECT 1 FROM removed_secret_dismissals WHERE removed_secret_dismissals.removed_secret_id = removed_secrets.id AND removed_secret_dismissals.user_id = $1) ORDER BY removed_secrets.removed_at, removed_secrets.kind, server_name, removed_secrets.feature_key, notification_name`,
    [
      user['id'],
      canWrite,
      user['allServers'],
      user['serverIds'],
    ],
  );

  return result.rows.map((row) => {
    if (row['kind'] === 'notification' && row['notification_id'] !== null) {
      return {
        kind: row['kind'],
        name: row['notification_name'] ?? row['notification_id'],
        notificationId: row['notification_id'],
        removedAt: new Date(row['removed_at']).toISOString(),
      };
    }

    if (
      row['kind'] !== 'feature-secrets'
      || row['guild_id'] === null
      || row['feature_key'] === null
    ) {
      return {
        kind: row['kind'],
        removedAt: new Date(row['removed_at']).toISOString(),
      };
    }

    const featureKey: Lib_RemovedSecrets_ListRemovedSecrets_FeatureKey = row['feature_key'];
    const featureDefinition: Lib_RemovedSecrets_ListRemovedSecrets_FeatureDefinition = getFeatureCatalog().find((definition) => definition['key'] === featureKey);
    const featureName: Lib_RemovedSecrets_ListRemovedSecrets_FeatureName = (featureDefinition === undefined) ? featureKey : featureDefinition['name'];

    return {
      featureKey,
      featureName,
      kind: row['kind'],
      removedAt: new Date(row['removed_at']).toISOString(),
      serverId: row['guild_id'],
      serverName: row['server_name'] ?? row['guild_id'],
    };
  });
}
