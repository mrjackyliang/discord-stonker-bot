import { randomBytes } from 'node:crypto';
import {
  mkdir,
  open,
  readFile,
} from 'node:fs/promises';
import { dirname } from 'node:path';

import {
  decryptSecret,
  encryptSecret,
} from './credential-vault.js';
import { getFeatureCatalog } from './feature-catalog.js';

import type {
  Lib_CredentialKey_FindSealedSample_Pool,
  Lib_CredentialKey_FindSealedSample_Returns,
  Lib_CredentialKey_FindSealedSample_SecretResult,
  Lib_CredentialKey_FindSealedSample_SecretRowResult,
  Lib_CredentialKey_FindSealedSample_TokenResult,
  Lib_CredentialKey_FindSealedSample_TokenRowResult,
  Lib_CredentialKey_FindSealedSample_TotpResult,
  Lib_CredentialKey_FindSealedSample_TotpRowResult,
  Lib_CredentialKey_IsMissingFile_Error,
  Lib_CredentialKey_IsMissingFile_Returns,
  Lib_CredentialKey_PrepareCredentialKey_Client,
  Lib_CredentialKey_PrepareCredentialKey_CredentialKey,
  Lib_CredentialKey_PrepareCredentialKey_FilePath,
  Lib_CredentialKey_PrepareCredentialKey_KeyFile,
  Lib_CredentialKey_PrepareCredentialKey_NewKey,
  Lib_CredentialKey_PrepareCredentialKey_Pool,
  Lib_CredentialKey_PrepareCredentialKey_RemovedSecrets,
  Lib_CredentialKey_PrepareCredentialKey_Returns,
  Lib_CredentialKey_RemoveLockedSecrets_Client,
  Lib_CredentialKey_RemoveLockedSecrets_FeatureDefinition,
  Lib_CredentialKey_RemoveLockedSecrets_FeatureName,
  Lib_CredentialKey_RemoveLockedSecrets_FeatureResult,
  Lib_CredentialKey_RemoveLockedSecrets_HadSecrets,
  Lib_CredentialKey_RemoveLockedSecrets_MissingSecrets,
  Lib_CredentialKey_RemoveLockedSecrets_NotificationResult,
  Lib_CredentialKey_RemoveLockedSecrets_RemovedSecrets,
  Lib_CredentialKey_RemoveLockedSecrets_Returns,
  Lib_CredentialKey_RemoveLockedSecrets_SecretCountResult,
  Lib_CredentialKey_RemoveLockedSecrets_SecretCountRowResult,
  Lib_CredentialKey_RemoveLockedSecrets_TokenResult,
  Lib_CredentialKey_RemoveLockedSecrets_TokenRowResult,
  Lib_CredentialKey_RemoveLockedSecrets_UserResult,
  Lib_CredentialKey_VerifyCredentialKey_CheckResult,
  Lib_CredentialKey_VerifyCredentialKey_CheckRowResult,
  Lib_CredentialKey_VerifyCredentialKey_CredentialKey,
  Lib_CredentialKey_VerifyCredentialKey_FilePath,
  Lib_CredentialKey_VerifyCredentialKey_Mismatch,
  Lib_CredentialKey_VerifyCredentialKey_Pool,
  Lib_CredentialKey_VerifyCredentialKey_Returns,
  Lib_CredentialKey_VerifyCredentialKey_Sample,
} from '../types/lib/credential-key.d.ts';

/**
 * Credential Key - Check Purpose.
 *
 * Associated data for the value that proves the key file belongs to this database.
 * It keeps the check value from being mistaken for any stored secret.
 *
 * @since 4.0.0
 */
const CHECK_PURPOSE = 'credential-key-check';

/**
 * Credential Key - Check Value.
 *
 * Known text sealed with the key and stored in the database.
 * Opening it proves the key file belongs to this database.
 *
 * @since 4.0.0
 */
const CHECK_VALUE = 'discord-stonker-bot-credential-key-check';

/**
 * Credential Key - Find Sealed Sample.
 *
 * Returns one stored secret with its purpose, for testing a key before a check value exists.
 * The Bot Token comes first, then a feature secret, then an authenticator secret.
 *
 * @param {Lib_CredentialKey_FindSealedSample_Pool} pool - Pool.
 *
 * @returns {Lib_CredentialKey_FindSealedSample_Returns}
 *
 * @since 4.0.0
 */
async function findSealedSample(
  pool: Lib_CredentialKey_FindSealedSample_Pool,
): Lib_CredentialKey_FindSealedSample_Returns {
  const tokenResult: Lib_CredentialKey_FindSealedSample_TokenResult = await pool.query(
    'SELECT discord_token_ciphertext FROM bot_runtime_control WHERE singleton = TRUE AND discord_token_ciphertext IS NOT NULL',
  );
  const tokenRow: Lib_CredentialKey_FindSealedSample_TokenRowResult = tokenResult.rows[0];

  if (tokenRow !== undefined) {
    return {
      ciphertext: tokenRow['discord_token_ciphertext'],
      purpose: 'discord-token',
    };
  }

  const secretResult: Lib_CredentialKey_FindSealedSample_SecretResult = await pool.query(
    'SELECT guild_id, secret_key, ciphertext FROM guild_secrets ORDER BY guild_id, secret_key LIMIT 1',
  );
  const secretRow: Lib_CredentialKey_FindSealedSample_SecretRowResult = secretResult.rows[0];

  if (secretRow !== undefined) {
    return {
      ciphertext: secretRow['ciphertext'],
      purpose: `guild-secret:${secretRow['guild_id']}:${secretRow['secret_key']}`,
    };
  }

  const totpResult: Lib_CredentialKey_FindSealedSample_TotpResult = await pool.query(
    'SELECT user_id::text AS user_id, secret_ciphertext FROM panel_totp_credentials ORDER BY user_id LIMIT 1',
  );
  const totpRow: Lib_CredentialKey_FindSealedSample_TotpRowResult = totpResult.rows[0];

  if (totpRow !== undefined) {
    return {
      ciphertext: totpRow['secret_ciphertext'],
      purpose: `panel-totp:${totpRow['user_id']}`,
    };
  }

  return undefined;
}

/**
 * Credential Key - Is Missing File.
 *
 * Tells a missing key file apart from one that can't be read for another reason.
 * Only a missing file gets a new key.
 *
 * @param {Lib_CredentialKey_IsMissingFile_Error} error - Error.
 *
 * @returns {Lib_CredentialKey_IsMissingFile_Returns}
 *
 * @since 4.0.0
 */
function isMissingFile(error: Lib_CredentialKey_IsMissingFile_Error): Lib_CredentialKey_IsMissingFile_Returns {
  return (
    error instanceof Error
    && 'code' in error
    && error['code'] === 'ENOENT'
  );
}

/**
 * Credential Key - Prepare Credential Key.
 *
 * Reads the credential key, or makes a new one and removes what the old one sealed.
 * The new key is saved last, so an interrupted start can run again.
 * A key file that belongs to another database stops startup.
 *
 * @param {Lib_CredentialKey_PrepareCredentialKey_Pool}     pool     - Pool.
 * @param {Lib_CredentialKey_PrepareCredentialKey_FilePath} filePath - File path.
 *
 * @returns {Lib_CredentialKey_PrepareCredentialKey_Returns}
 *
 * @since 4.0.0
 */
export async function prepareCredentialKey(
  pool: Lib_CredentialKey_PrepareCredentialKey_Pool,
  filePath: Lib_CredentialKey_PrepareCredentialKey_FilePath,
): Lib_CredentialKey_PrepareCredentialKey_Returns {
  let credentialKey: Lib_CredentialKey_PrepareCredentialKey_CredentialKey = undefined;

  try {
    credentialKey = await readFile(filePath);
  } catch (error) {
    if (isMissingFile(error) === false) {
      throw error;
    }
  }

  if (credentialKey !== undefined) {
    if (credentialKey.length !== 32) {
      throw new Error('The credential encryption key must contain exactly 32 bytes.');
    }

    await verifyCredentialKey(pool, credentialKey, filePath);

    return [];
  }

  const newKey: Lib_CredentialKey_PrepareCredentialKey_NewKey = randomBytes(32);
  const client: Lib_CredentialKey_PrepareCredentialKey_Client = await pool.connect();
  let removedSecrets: Lib_CredentialKey_PrepareCredentialKey_RemovedSecrets = [];

  try {
    await client.query('BEGIN');

    removedSecrets = await removeLockedSecrets(client);

    await client.query(
      'INSERT INTO credential_key_check (singleton, ciphertext, updated_at) VALUES (TRUE, $1, NOW()) ON CONFLICT (singleton) DO UPDATE SET ciphertext = EXCLUDED.ciphertext, updated_at = NOW()',
      [encryptSecret(CHECK_VALUE, CHECK_PURPOSE, newKey)],
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }

  await mkdir(dirname(filePath), {
    mode: parseInt('700', 8),
    recursive: true,
  });

  const keyFile: Lib_CredentialKey_PrepareCredentialKey_KeyFile = await open(filePath, 'wx', parseInt('600', 8));

  try {
    await keyFile.writeFile(newKey);

    await keyFile.sync();
  } finally {
    await keyFile.close();
  }

  return removedSecrets;
}

/**
 * Credential Key - Remove Locked Secrets.
 *
 * Removes the Bot Token, feature secrets, and authenticator apps sealed with a lost key.
 * Each is recorded so the control panel can ask for it again.
 * Feature settings, users, passkeys, sessions, and tokens don't use the key, so they stay.
 *
 * @param {Lib_CredentialKey_RemoveLockedSecrets_Client} client - Client.
 *
 * @returns {Lib_CredentialKey_RemoveLockedSecrets_Returns}
 *
 * @since 4.0.0
 */
async function removeLockedSecrets(
  client: Lib_CredentialKey_RemoveLockedSecrets_Client,
): Lib_CredentialKey_RemoveLockedSecrets_Returns {
  const removedSecrets: Lib_CredentialKey_RemoveLockedSecrets_RemovedSecrets = [];
  const tokenResult: Lib_CredentialKey_RemoveLockedSecrets_TokenResult = await client.query(
    'SELECT discord_token_ciphertext IS NOT NULL AS has_token FROM bot_runtime_control WHERE singleton = TRUE',
  );
  const featureResult: Lib_CredentialKey_RemoveLockedSecrets_FeatureResult = await client.query(
    'SELECT DISTINCT guild_feature_values.guild_id, guild_feature_values.feature_key, COALESCE(discord_servers.name, guild_feature_values.guild_id) AS server_name FROM guild_secrets JOIN guild_feature_values ON guild_feature_values.guild_id = guild_secrets.guild_id AND guild_feature_values.value_type = \'string\' AND guild_feature_values.value_text = guild_secrets.secret_key AND guild_feature_values.value_path LIKE \'%/$secret\' LEFT JOIN discord_servers ON discord_servers.guild_id = guild_feature_values.guild_id ORDER BY server_name, guild_feature_values.guild_id, guild_feature_values.feature_key',
  );
  const secretCountResult: Lib_CredentialKey_RemoveLockedSecrets_SecretCountResult = await client.query(
    'SELECT COUNT(*)::text AS count FROM guild_secrets',
  );
  const userResult: Lib_CredentialKey_RemoveLockedSecrets_UserResult = await client.query(
    'SELECT panel_users.id::text AS id, panel_users.username FROM panel_totp_credentials JOIN panel_users ON panel_users.id = panel_totp_credentials.user_id ORDER BY panel_users.username',
  );
  const notificationResult: Lib_CredentialKey_RemoveLockedSecrets_NotificationResult = await client.query(
    'SELECT id, name, secret_fields, missing_secrets FROM notification_targets WHERE secrets_ciphertext IS NOT NULL ORDER BY name',
  );

  const tokenRow: Lib_CredentialKey_RemoveLockedSecrets_TokenRowResult = tokenResult.rows[0];
  const secretCountRow: Lib_CredentialKey_RemoveLockedSecrets_SecretCountRowResult = secretCountResult.rows[0];

  if (tokenRow !== undefined && tokenRow['has_token'] === true) {
    await client.query('UPDATE bot_runtime_control SET discord_token_ciphertext = NULL, updated_at = NOW() WHERE singleton = TRUE');

    await client.query('DELETE FROM removed_secrets WHERE kind = \'bot-token\'');

    await client.query('INSERT INTO removed_secrets (kind) VALUES (\'bot-token\')');

    removedSecrets.push('the Bot Token');
  }

  for (const featureRow of featureResult.rows) {
    const featureDefinition: Lib_CredentialKey_RemoveLockedSecrets_FeatureDefinition = getFeatureCatalog().find((definition) => definition['key'] === featureRow['feature_key']);
    const featureName: Lib_CredentialKey_RemoveLockedSecrets_FeatureName = (featureDefinition === undefined) ? featureRow['feature_key'] : featureDefinition['name'];

    await client.query(
      'DELETE FROM removed_secrets WHERE kind = \'feature-secrets\' AND guild_id = $1 AND feature_key = $2',
      [
        featureRow['guild_id'],
        featureRow['feature_key'],
      ],
    );

    await client.query(
      'INSERT INTO removed_secrets (kind, guild_id, feature_key) VALUES (\'feature-secrets\', $1, $2)',
      [
        featureRow['guild_id'],
        featureRow['feature_key'],
      ],
    );

    removedSecrets.push(`the ${featureName} secrets for ${featureRow['server_name']}`);
  }

  await client.query('DELETE FROM guild_secrets');

  for (const userRow of userResult.rows) {
    await client.query('DELETE FROM panel_totp_credentials WHERE user_id = $1', [userRow['id']]);

    await client.query('DELETE FROM panel_recovery_codes WHERE user_id = $1', [userRow['id']]);

    await client.query('DELETE FROM removed_secrets WHERE kind = \'authenticator\' AND user_id = $1', [userRow['id']]);

    await client.query('INSERT INTO removed_secrets (kind, user_id) VALUES (\'authenticator\', $1)', [userRow['id']]);

    removedSecrets.push(`the authenticator app for ${userRow['username']}`);
  }

  await client.query('DELETE FROM panel_totp_enrollments');

  for (const notificationRow of notificationResult.rows) {
    const missingSecrets: Lib_CredentialKey_RemoveLockedSecrets_MissingSecrets = [...new Set([
      ...notificationRow['missing_secrets'],
      ...notificationRow['secret_fields'],
    ])].sort();

    await client.query(
      'UPDATE notification_targets SET secrets_ciphertext = NULL, secret_fields = \'[]\'::jsonb, missing_secrets = $2::jsonb, updated_at = NOW() WHERE id = $1',
      [
        notificationRow['id'],
        JSON.stringify(missingSecrets),
      ],
    );

    await client.query('DELETE FROM removed_secrets WHERE kind = \'notification\' AND notification_id = $1', [notificationRow['id']]);

    await client.query('INSERT INTO removed_secrets (kind, notification_id) VALUES (\'notification\', $1)', [notificationRow['id']]);

    removedSecrets.push(`the ${notificationRow['name']} notification`);
  }

  const hadSecrets: Lib_CredentialKey_RemoveLockedSecrets_HadSecrets = secretCountRow !== undefined && secretCountRow['count'] !== '0';

  if (removedSecrets.length > 0 || hadSecrets === true) {
    await client.query('UPDATE bot_runtime_control SET generation = generation + 1, updated_at = NOW() WHERE singleton = TRUE');
  }

  return removedSecrets;
}

/**
 * Credential Key - Verify Credential Key.
 *
 * Confirms that an existing key opens what the database holds.
 * A database without a check value is tested with one stored secret, then gets one.
 *
 * @param {Lib_CredentialKey_VerifyCredentialKey_Pool}          pool          - Pool.
 * @param {Lib_CredentialKey_VerifyCredentialKey_CredentialKey} credentialKey - Credential key.
 * @param {Lib_CredentialKey_VerifyCredentialKey_FilePath}      filePath      - File path.
 *
 * @returns {Lib_CredentialKey_VerifyCredentialKey_Returns}
 *
 * @since 4.0.0
 */
async function verifyCredentialKey(
  pool: Lib_CredentialKey_VerifyCredentialKey_Pool,
  credentialKey: Lib_CredentialKey_VerifyCredentialKey_CredentialKey,
  filePath: Lib_CredentialKey_VerifyCredentialKey_FilePath,
): Lib_CredentialKey_VerifyCredentialKey_Returns {
  const mismatch: Lib_CredentialKey_VerifyCredentialKey_Mismatch = new Error(`The credential key at ${filePath} doesn't belong to this database. Put back the key file this database was created with, or delete ${filePath} and restart to make a new key, then enter the saved secrets again.`);
  const checkResult: Lib_CredentialKey_VerifyCredentialKey_CheckResult = await pool.query(
    'SELECT ciphertext FROM credential_key_check WHERE singleton = TRUE',
  );
  const checkRow: Lib_CredentialKey_VerifyCredentialKey_CheckRowResult = checkResult.rows[0];

  if (checkRow !== undefined) {
    try {
      if (decryptSecret(checkRow['ciphertext'], CHECK_PURPOSE, credentialKey) === CHECK_VALUE) {
        return;
      }
    } catch {
      throw mismatch;
    }

    throw mismatch;
  }

  const sample: Lib_CredentialKey_VerifyCredentialKey_Sample = await findSealedSample(pool);

  if (sample !== undefined) {
    try {
      decryptSecret(sample['ciphertext'], sample['purpose'], credentialKey);
    } catch {
      throw mismatch;
    }
  }

  await pool.query(
    'INSERT INTO credential_key_check (singleton, ciphertext, updated_at) VALUES (TRUE, $1, NOW()) ON CONFLICT (singleton) DO NOTHING',
    [encryptSecret(CHECK_VALUE, CHECK_PURPOSE, credentialKey)],
  );

  return;
}
