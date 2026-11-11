import { randomBytes } from 'node:crypto';

import { z } from 'zod';

import {
  decryptSecret,
  encryptSecret,
} from './credential-vault.js';
import { notificationServiceSchema } from './notifications.js';

import type {
  Lib_NotificationTargets_CreateNotificationTarget_CredentialKey,
  Lib_NotificationTargets_CreateNotificationTarget_Id,
  Lib_NotificationTargets_CreateNotificationTarget_Input,
  Lib_NotificationTargets_CreateNotificationTarget_Pool,
  Lib_NotificationTargets_CreateNotificationTarget_Result,
  Lib_NotificationTargets_CreateNotificationTarget_Returns,
  Lib_NotificationTargets_CreateNotificationTarget_Row,
  Lib_NotificationTargets_CreateNotificationTarget_Taken,
  Lib_NotificationTargets_GetNotificationTarget_Pool,
  Lib_NotificationTargets_GetNotificationTarget_Result,
  Lib_NotificationTargets_GetNotificationTarget_Returns,
  Lib_NotificationTargets_GetNotificationTarget_Row,
  Lib_NotificationTargets_GetNotificationTarget_TargetId,
  Lib_NotificationTargets_IsNotificationTargetId_Returns,
  Lib_NotificationTargets_IsNotificationTargetId_Value,
  Lib_NotificationTargets_ListNotificationTargetIds_Event,
  Lib_NotificationTargets_ListNotificationTargetIds_Pool,
  Lib_NotificationTargets_ListNotificationTargetIds_Result,
  Lib_NotificationTargets_ListNotificationTargetIds_Returns,
  Lib_NotificationTargets_ListNotificationTargets_Pool,
  Lib_NotificationTargets_ListNotificationTargets_Result,
  Lib_NotificationTargets_ListNotificationTargets_Returns,
  Lib_NotificationTargets_OpenNotificationTarget_CredentialKey,
  Lib_NotificationTargets_OpenNotificationTarget_Pool,
  Lib_NotificationTargets_OpenNotificationTarget_Result,
  Lib_NotificationTargets_OpenNotificationTarget_Returns,
  Lib_NotificationTargets_OpenNotificationTarget_Row,
  Lib_NotificationTargets_OpenNotificationTarget_TargetId,
  Lib_NotificationTargets_OpenSecrets_CredentialKey,
  Lib_NotificationTargets_OpenSecrets_Returns,
  Lib_NotificationTargets_OpenSecrets_Row,
  Lib_NotificationTargets_RecordNotificationAttempt_ErrorMessage,
  Lib_NotificationTargets_RecordNotificationAttempt_Pool,
  Lib_NotificationTargets_RecordNotificationAttempt_Returns,
  Lib_NotificationTargets_RecordNotificationAttempt_TargetId,
  Lib_NotificationTargets_RemoveNotificationTarget_Pool,
  Lib_NotificationTargets_RemoveNotificationTarget_Result,
  Lib_NotificationTargets_RemoveNotificationTarget_Returns,
  Lib_NotificationTargets_RemoveNotificationTarget_Row,
  Lib_NotificationTargets_RemoveNotificationTarget_TargetId,
  Lib_NotificationTargets_SealSecrets_CredentialKey,
  Lib_NotificationTargets_SealSecrets_Returns,
  Lib_NotificationTargets_SealSecrets_Secrets,
  Lib_NotificationTargets_SealSecrets_TargetId,
  Lib_NotificationTargets_StoredKeys,
  Lib_NotificationTargets_StoredValues,
  Lib_NotificationTargets_TargetColumns,
  Lib_NotificationTargets_TargetFromRow_Returns,
  Lib_NotificationTargets_TargetFromRow_Row,
  Lib_NotificationTargets_TargetFromRow_SecretFields,
  Lib_NotificationTargets_TargetIdCharacters,
  Lib_NotificationTargets_TargetIdQueryRow,
  Lib_NotificationTargets_TargetNameQueryRow,
  Lib_NotificationTargets_TargetQueryRow,
  Lib_NotificationTargets_UpdateNotificationTarget_Client,
  Lib_NotificationTargets_UpdateNotificationTarget_CredentialKey,
  Lib_NotificationTargets_UpdateNotificationTarget_Existing,
  Lib_NotificationTargets_UpdateNotificationTarget_ExistingRow,
  Lib_NotificationTargets_UpdateNotificationTarget_Input,
  Lib_NotificationTargets_UpdateNotificationTarget_MissingSecrets,
  Lib_NotificationTargets_UpdateNotificationTarget_Pool,
  Lib_NotificationTargets_UpdateNotificationTarget_Result,
  Lib_NotificationTargets_UpdateNotificationTarget_Returns,
  Lib_NotificationTargets_UpdateNotificationTarget_Row,
  Lib_NotificationTargets_UpdateNotificationTarget_Secrets,
  Lib_NotificationTargets_UpdateNotificationTarget_Taken,
  Lib_NotificationTargets_UpdateNotificationTarget_TargetId,
} from '../types/lib/notification-targets.d.ts';

/**
 * Notification Targets - Target Columns.
 *
 * Selects every column a destination answer or a delivery needs.
 * The sealed secrets are only opened when a notification is sent or a destination is edited.
 *
 * @since 4.0.0
 */
const TARGET_COLUMNS: Lib_NotificationTargets_TargetColumns = 'id, name, service, events, settings, secret_fields, missing_secrets, secrets_ciphertext, last_attempt_at, last_error, created_at, updated_at';

/**
 * Notification Targets - Target ID Characters.
 *
 * Lists the lowercase hexadecimal digits that follow ntf- in a destination id.
 * Any other id is answered like a destination that no longer exists.
 *
 * @since 4.0.0
 */
const TARGET_ID_CHARACTERS: Lib_NotificationTargets_TargetIdCharacters = '0123456789abcdef';

/**
 * Notification Targets - Stored Keys.
 *
 * Reads a stored list of event keys or field names.
 * Anything else in the column is a storage error.
 *
 * @since 4.0.0
 */
const storedKeys: Lib_NotificationTargets_StoredKeys = z.array(z.string());

/**
 * Notification Targets - Stored Values.
 *
 * Reads stored plain settings, or opened secrets, as field names with text values.
 * Anything else in the column is a storage error.
 *
 * @since 4.0.0
 */
const storedValues: Lib_NotificationTargets_StoredValues = z.record(z.string(), z.string());

/**
 * Notification Targets - Create Notification Target.
 *
 * Saves a new destination with its secret fields sealed by the credential key.
 * A name another destination already uses, ignoring letter case, is refused.
 *
 * @param {Lib_NotificationTargets_CreateNotificationTarget_Pool}          pool          - Pool.
 * @param {Lib_NotificationTargets_CreateNotificationTarget_CredentialKey} credentialKey - Credential key.
 * @param {Lib_NotificationTargets_CreateNotificationTarget_Input}         input         - Input.
 *
 * @returns {Lib_NotificationTargets_CreateNotificationTarget_Returns}
 *
 * @since 4.0.0
 */
export async function createNotificationTarget(
  pool: Lib_NotificationTargets_CreateNotificationTarget_Pool,
  credentialKey: Lib_NotificationTargets_CreateNotificationTarget_CredentialKey,
  input: Lib_NotificationTargets_CreateNotificationTarget_Input,
): Lib_NotificationTargets_CreateNotificationTarget_Returns {
  const taken: Lib_NotificationTargets_CreateNotificationTarget_Taken = await pool.query('SELECT id FROM notification_targets WHERE LOWER(name) = LOWER($1)', [input['name']]);

  if ((taken.rowCount ?? 0) > 0) {
    return 'name-taken';
  }

  const id: Lib_NotificationTargets_CreateNotificationTarget_Id = `ntf-${randomBytes(8).toString('hex')}`;

  try {
    const result: Lib_NotificationTargets_CreateNotificationTarget_Result = await pool.query<Lib_NotificationTargets_TargetQueryRow>(
      `INSERT INTO notification_targets (id, name, service, events, settings, secret_fields, secrets_ciphertext) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7) RETURNING ${TARGET_COLUMNS}`,
      [
        id,
        input['name'],
        input['service'],
        JSON.stringify(input['events']),
        JSON.stringify(input['settings']),
        JSON.stringify(Object.keys(input['secrets']).sort()),
        sealSecrets(id, input['secrets'], credentialKey),
      ],
    );
    const row: Lib_NotificationTargets_CreateNotificationTarget_Row = result.rows[0];

    if (row === undefined) {
      throw new Error('The notification could not be stored.');
    }

    return targetFromRow(row);
  } catch (error) {
    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'name-taken';
    }

    throw error;
  }
}

/**
 * Notification Targets - Get Notification Target.
 *
 * Finds one destination as the API shows it.
 * Saved secrets are only listed by field name.
 *
 * @param {Lib_NotificationTargets_GetNotificationTarget_Pool}     pool     - Pool.
 * @param {Lib_NotificationTargets_GetNotificationTarget_TargetId} targetId - Target id.
 *
 * @returns {Lib_NotificationTargets_GetNotificationTarget_Returns}
 *
 * @since 4.0.0
 */
export async function getNotificationTarget(
  pool: Lib_NotificationTargets_GetNotificationTarget_Pool,
  targetId: Lib_NotificationTargets_GetNotificationTarget_TargetId,
): Lib_NotificationTargets_GetNotificationTarget_Returns {
  const result: Lib_NotificationTargets_GetNotificationTarget_Result = await pool.query<Lib_NotificationTargets_TargetQueryRow>(`SELECT ${TARGET_COLUMNS} FROM notification_targets WHERE id = $1`, [targetId]);
  const row: Lib_NotificationTargets_GetNotificationTarget_Row = result.rows[0];

  return (row === undefined) ? undefined : targetFromRow(row);
}

/**
 * Notification Targets - Is Notification Target ID.
 *
 * Checks that a route value is a destination id: ntf- and 16 hexadecimal digits.
 * Other values never reach the database.
 *
 * @param {Lib_NotificationTargets_IsNotificationTargetId_Value} value - Value.
 *
 * @returns {Lib_NotificationTargets_IsNotificationTargetId_Returns}
 *
 * @since 4.0.0
 */
export function isNotificationTargetId(value: Lib_NotificationTargets_IsNotificationTargetId_Value): Lib_NotificationTargets_IsNotificationTargetId_Returns {
  return (
    typeof value === 'string'
    && value.length === 20
    && value.startsWith('ntf-') === true
    && [...value.slice(4)].every((character) => TARGET_ID_CHARACTERS.includes(character)) === true
  );
}

/**
 * Notification Targets - List Notification Target Ids.
 *
 * Lists the destinations that chose an event and can still send, oldest first.
 * A destination waiting for removed secrets is skipped until they are entered again.
 *
 * @param {Lib_NotificationTargets_ListNotificationTargetIds_Pool}  pool  - Pool.
 * @param {Lib_NotificationTargets_ListNotificationTargetIds_Event} event - Event.
 *
 * @returns {Lib_NotificationTargets_ListNotificationTargetIds_Returns}
 *
 * @since 4.0.0
 */
export async function listNotificationTargetIds(
  pool: Lib_NotificationTargets_ListNotificationTargetIds_Pool,
  event: Lib_NotificationTargets_ListNotificationTargetIds_Event,
): Lib_NotificationTargets_ListNotificationTargetIds_Returns {
  const result: Lib_NotificationTargets_ListNotificationTargetIds_Result = await pool.query<Lib_NotificationTargets_TargetIdQueryRow>('SELECT id FROM notification_targets WHERE events @> jsonb_build_array($1::text) AND missing_secrets = \'[]\'::jsonb ORDER BY created_at, id', [event]);

  return result.rows.map((row) => row['id']);
}

/**
 * Notification Targets - List Notification Targets.
 *
 * Lists every destination as the API shows it, newest first.
 * Saved secrets are only listed by field name.
 *
 * @param {Lib_NotificationTargets_ListNotificationTargets_Pool} pool - Pool.
 *
 * @returns {Lib_NotificationTargets_ListNotificationTargets_Returns}
 *
 * @since 4.0.0
 */
export async function listNotificationTargets(pool: Lib_NotificationTargets_ListNotificationTargets_Pool): Lib_NotificationTargets_ListNotificationTargets_Returns {
  const result: Lib_NotificationTargets_ListNotificationTargets_Result = await pool.query<Lib_NotificationTargets_TargetQueryRow>(`SELECT ${TARGET_COLUMNS} FROM notification_targets ORDER BY created_at DESC, name`);

  return result.rows.map((row) => targetFromRow(row));
}

/**
 * Notification Targets - Open Notification Target.
 *
 * Loads one destination with its secrets opened, ready to send to.
 * A destination waiting for removed secrets can't send yet.
 *
 * @param {Lib_NotificationTargets_OpenNotificationTarget_Pool}          pool          - Pool.
 * @param {Lib_NotificationTargets_OpenNotificationTarget_CredentialKey} credentialKey - Credential key.
 * @param {Lib_NotificationTargets_OpenNotificationTarget_TargetId}      targetId      - Target id.
 *
 * @returns {Lib_NotificationTargets_OpenNotificationTarget_Returns}
 *
 * @since 4.0.0
 */
export async function openNotificationTarget(
  pool: Lib_NotificationTargets_OpenNotificationTarget_Pool,
  credentialKey: Lib_NotificationTargets_OpenNotificationTarget_CredentialKey,
  targetId: Lib_NotificationTargets_OpenNotificationTarget_TargetId,
): Lib_NotificationTargets_OpenNotificationTarget_Returns {
  const result: Lib_NotificationTargets_OpenNotificationTarget_Result = await pool.query<Lib_NotificationTargets_TargetQueryRow>(`SELECT ${TARGET_COLUMNS} FROM notification_targets WHERE id = $1`, [targetId]);
  const row: Lib_NotificationTargets_OpenNotificationTarget_Row = result.rows[0];

  if (row === undefined) {
    return 'not-found';
  }

  if (storedKeys.parse(row['missing_secrets']).length > 0) {
    return 'secrets-missing';
  }

  return {
    name: row['name'],
    target: {
      secrets: openSecrets(row, credentialKey),
      service: notificationServiceSchema.parse(row['service']),
      settings: storedValues.parse(row['settings']),
    },
  };
}

/**
 * Notification Targets - Record Notification Attempt.
 *
 * Saves when a destination was last sent to and why it failed, if it did.
 * The list shows both under the destination's name.
 *
 * @param {Lib_NotificationTargets_RecordNotificationAttempt_Pool}         pool         - Pool.
 * @param {Lib_NotificationTargets_RecordNotificationAttempt_TargetId}     targetId     - Target id.
 * @param {Lib_NotificationTargets_RecordNotificationAttempt_ErrorMessage} errorMessage - Error message.
 *
 * @returns {Lib_NotificationTargets_RecordNotificationAttempt_Returns}
 *
 * @since 4.0.0
 */
export async function recordNotificationAttempt(
  pool: Lib_NotificationTargets_RecordNotificationAttempt_Pool,
  targetId: Lib_NotificationTargets_RecordNotificationAttempt_TargetId,
  errorMessage: Lib_NotificationTargets_RecordNotificationAttempt_ErrorMessage,
): Lib_NotificationTargets_RecordNotificationAttempt_Returns {
  await pool.query('UPDATE notification_targets SET last_attempt_at = NOW(), last_error = LEFT($2, 500) WHERE id = $1', [
    targetId,
    errorMessage,
  ]);

  return;
}

/**
 * Notification Targets - Remove Notification Target.
 *
 * Deletes a destination and returns its name.
 * Its lost-key notice item goes with it.
 *
 * @param {Lib_NotificationTargets_RemoveNotificationTarget_Pool}     pool     - Pool.
 * @param {Lib_NotificationTargets_RemoveNotificationTarget_TargetId} targetId - Target id.
 *
 * @returns {Lib_NotificationTargets_RemoveNotificationTarget_Returns}
 *
 * @since 4.0.0
 */
export async function removeNotificationTarget(
  pool: Lib_NotificationTargets_RemoveNotificationTarget_Pool,
  targetId: Lib_NotificationTargets_RemoveNotificationTarget_TargetId,
): Lib_NotificationTargets_RemoveNotificationTarget_Returns {
  const result: Lib_NotificationTargets_RemoveNotificationTarget_Result = await pool.query<Lib_NotificationTargets_TargetNameQueryRow>('DELETE FROM notification_targets WHERE id = $1 RETURNING name', [targetId]);
  const row: Lib_NotificationTargets_RemoveNotificationTarget_Row = result.rows[0];

  return (row === undefined) ? undefined : row['name'];
}

/**
 * Notification Targets - Update Notification Target.
 *
 * Changes a destination's name, events, and settings. Its service never changes.
 * A secret left blank keeps its saved value.
 * Entering every removed secret clears the lost-key notice item.
 *
 * @param {Lib_NotificationTargets_UpdateNotificationTarget_Pool}          pool          - Pool.
 * @param {Lib_NotificationTargets_UpdateNotificationTarget_CredentialKey} credentialKey - Credential key.
 * @param {Lib_NotificationTargets_UpdateNotificationTarget_TargetId}      targetId      - Target id.
 * @param {Lib_NotificationTargets_UpdateNotificationTarget_Input}         input         - Input.
 *
 * @returns {Lib_NotificationTargets_UpdateNotificationTarget_Returns}
 *
 * @since 4.0.0
 */
export async function updateNotificationTarget(
  pool: Lib_NotificationTargets_UpdateNotificationTarget_Pool,
  credentialKey: Lib_NotificationTargets_UpdateNotificationTarget_CredentialKey,
  targetId: Lib_NotificationTargets_UpdateNotificationTarget_TargetId,
  input: Lib_NotificationTargets_UpdateNotificationTarget_Input,
): Lib_NotificationTargets_UpdateNotificationTarget_Returns {
  const existing: Lib_NotificationTargets_UpdateNotificationTarget_Existing = await pool.query<Lib_NotificationTargets_TargetQueryRow>(`SELECT ${TARGET_COLUMNS} FROM notification_targets WHERE id = $1`, [targetId]);
  const existingRow: Lib_NotificationTargets_UpdateNotificationTarget_ExistingRow = existing.rows[0];

  if (existingRow === undefined) {
    return 'not-found';
  }

  const taken: Lib_NotificationTargets_UpdateNotificationTarget_Taken = await pool.query('SELECT id FROM notification_targets WHERE LOWER(name) = LOWER($1) AND id <> $2', [
    input['name'],
    targetId,
  ]);

  if ((taken.rowCount ?? 0) > 0) {
    return 'name-taken';
  }

  const secrets: Lib_NotificationTargets_UpdateNotificationTarget_Secrets = {
    ...openSecrets(existingRow, credentialKey),
    ...input['secrets'],
  };

  for (const field of input['clearSecrets']) {
    delete secrets[field];
  }

  const missingSecrets: Lib_NotificationTargets_UpdateNotificationTarget_MissingSecrets = storedKeys.parse(existingRow['missing_secrets']).filter((field) => (
    input['secrets'][field] === undefined
    && input['clearSecrets'].includes(field) === false
  ));
  const client: Lib_NotificationTargets_UpdateNotificationTarget_Client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result: Lib_NotificationTargets_UpdateNotificationTarget_Result = await client.query<Lib_NotificationTargets_TargetQueryRow>(
      `UPDATE notification_targets SET name = $2, events = $3::jsonb, settings = $4::jsonb, secret_fields = $5::jsonb, missing_secrets = $6::jsonb, secrets_ciphertext = $7, updated_at = NOW() WHERE id = $1 RETURNING ${TARGET_COLUMNS}`,
      [
        targetId,
        input['name'],
        JSON.stringify(input['events']),
        JSON.stringify(input['settings']),
        JSON.stringify(Object.keys(secrets).sort()),
        JSON.stringify(missingSecrets),
        sealSecrets(targetId, secrets, credentialKey),
      ],
    );

    if (missingSecrets.length === 0) {
      await client.query('DELETE FROM removed_secrets WHERE kind = \'notification\' AND notification_id = $1', [targetId]);
    }

    await client.query('COMMIT');

    const row: Lib_NotificationTargets_UpdateNotificationTarget_Row = result.rows[0];

    return (row === undefined) ? 'not-found' : targetFromRow(row);
  } catch (error) {
    await client.query('ROLLBACK');

    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'name-taken';
    }

    throw error;
  } finally {
    client.release();
  }
}

/**
 * Notification Targets - Open Secrets.
 *
 * Opens a destination's sealed secret fields with the credential key.
 * A destination without saved secrets has none to open.
 *
 * @param {Lib_NotificationTargets_OpenSecrets_Row}           row           - Row.
 * @param {Lib_NotificationTargets_OpenSecrets_CredentialKey} credentialKey - Credential key.
 *
 * @private
 *
 * @returns {Lib_NotificationTargets_OpenSecrets_Returns}
 *
 * @since 4.0.0
 */
function openSecrets(row: Lib_NotificationTargets_OpenSecrets_Row, credentialKey: Lib_NotificationTargets_OpenSecrets_CredentialKey): Lib_NotificationTargets_OpenSecrets_Returns {
  if (row['secrets_ciphertext'] === null) {
    return {};
  }

  return storedValues.parse(JSON.parse(decryptSecret(row['secrets_ciphertext'], `notification:${row['id']}`, credentialKey)));
}

/**
 * Notification Targets - Seal Secrets.
 *
 * Seals a destination's secret fields into one value bound to its id.
 * A destination without secrets stores nothing.
 *
 * @param {Lib_NotificationTargets_SealSecrets_TargetId}      targetId      - Target id.
 * @param {Lib_NotificationTargets_SealSecrets_Secrets}       secrets       - Secrets.
 * @param {Lib_NotificationTargets_SealSecrets_CredentialKey} credentialKey - Credential key.
 *
 * @private
 *
 * @returns {Lib_NotificationTargets_SealSecrets_Returns}
 *
 * @since 4.0.0
 */
function sealSecrets(targetId: Lib_NotificationTargets_SealSecrets_TargetId, secrets: Lib_NotificationTargets_SealSecrets_Secrets, credentialKey: Lib_NotificationTargets_SealSecrets_CredentialKey): Lib_NotificationTargets_SealSecrets_Returns {
  if (Object.keys(secrets).length === 0) {
    return null;
  }

  return encryptSecret(JSON.stringify(secrets), `notification:${targetId}`, credentialKey);
}

/**
 * Notification Targets - Target From Row.
 *
 * Maps a destination row to the shape every appliance's API returns.
 * Times come back as ISO 8601 strings, and secrets only by field name.
 *
 * @param {Lib_NotificationTargets_TargetFromRow_Row} row - Row.
 *
 * @private
 *
 * @returns {Lib_NotificationTargets_TargetFromRow_Returns}
 *
 * @since 4.0.0
 */
function targetFromRow(row: Lib_NotificationTargets_TargetFromRow_Row): Lib_NotificationTargets_TargetFromRow_Returns {
  const secretFields: Lib_NotificationTargets_TargetFromRow_SecretFields = storedKeys.parse(row['secret_fields']);

  return {
    createdAt: new Date(row['created_at']).toISOString(),
    events: storedKeys.parse(row['events']),
    id: row['id'],
    lastAttemptAt: (row['last_attempt_at'] === null) ? null : new Date(row['last_attempt_at']).toISOString(),
    lastError: row['last_error'],
    name: row['name'],
    secrets: Object.fromEntries(secretFields.map((field) => [
      field,
      true as const,
    ])),
    secretsMissing: storedKeys.parse(row['missing_secrets']),
    service: notificationServiceSchema.parse(row['service']),
    settings: storedValues.parse(row['settings']),
    updatedAt: new Date(row['updated_at']).toISOString(),
  };
}
