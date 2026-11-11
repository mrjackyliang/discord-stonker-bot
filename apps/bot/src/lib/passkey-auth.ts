import { randomBytes } from 'node:crypto';

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

import { digestValue } from './panel-sessions.js';

import type {
  Lib_PasskeyAuth_CreatePanelPasskey_Credential,
  Lib_PasskeyAuth_CreatePanelPasskey_Name,
  Lib_PasskeyAuth_CreatePanelPasskey_Pool,
  Lib_PasskeyAuth_CreatePanelPasskey_Returns,
  Lib_PasskeyAuth_CreatePanelPasskey_RpId,
  Lib_PasskeyAuth_CreatePanelPasskey_UserId,
  Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Ceremony,
  Lib_PasskeyAuth_CreatePanelWebauthnCeremony_CeremonyId,
  Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Pool,
  Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Returns,
  Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Configuration,
  Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Returns,
  Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Account,
  Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Configuration,
  Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_ExistingPasskeys,
  Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Returns,
  Lib_PasskeyAuth_GetPanelPasskey_CredentialId,
  Lib_PasskeyAuth_GetPanelPasskey_Pool,
  Lib_PasskeyAuth_GetPanelPasskey_QueryRow,
  Lib_PasskeyAuth_GetPanelPasskey_Result,
  Lib_PasskeyAuth_GetPanelPasskey_Returns,
  Lib_PasskeyAuth_GetPanelPasskey_Row,
  Lib_PasskeyAuth_GetPasskeyUserHandle_Returns,
  Lib_PasskeyAuth_GetPasskeyUserHandle_UserId,
  Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Pool,
  Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Result,
  Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Returns,
  Lib_PasskeyAuth_ListPanelPasskeyDescriptors_UserId,
  Lib_PasskeyAuth_RemovePanelPasskey_CredentialId,
  Lib_PasskeyAuth_RemovePanelPasskey_Pool,
  Lib_PasskeyAuth_RemovePanelPasskey_QueryRow,
  Lib_PasskeyAuth_RemovePanelPasskey_Result,
  Lib_PasskeyAuth_RemovePanelPasskey_Returns,
  Lib_PasskeyAuth_RemovePanelPasskey_Row,
  Lib_PasskeyAuth_RemovePanelPasskey_UserId,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_CeremonyId,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_Kind,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_Pool,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_QueryRow,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_Result,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_Returns,
  Lib_PasskeyAuth_TakePanelWebauthnCeremony_Row,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_CredentialId,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Pool,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_PreviousCounter,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Result,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Returns,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_RpId,
  Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Usage,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Challenge,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Configuration,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Passkey,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Response,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Returns,
  Lib_PasskeyAuth_VerifyPasskeyAuthentication_Verification,
  Lib_PasskeyAuth_VerifyPasskeyRegistration_Challenge,
  Lib_PasskeyAuth_VerifyPasskeyRegistration_Configuration,
  Lib_PasskeyAuth_VerifyPasskeyRegistration_Response,
  Lib_PasskeyAuth_VerifyPasskeyRegistration_Returns,
  Lib_PasskeyAuth_VerifyPasskeyRegistration_Transports,
  Lib_PasskeyAuth_VerifyPasskeyRegistration_Verification,
} from '../types/lib/passkey-auth.d.ts';

/**
 * Passkey Auth - Create Panel Passkey.
 *
 * Saves a verified passkey for a user together with the hostname it was made on.
 * A passkey that is already saved is reported as a conflict.
 *
 * @param {Lib_PasskeyAuth_CreatePanelPasskey_Pool}       pool       - Pool.
 * @param {Lib_PasskeyAuth_CreatePanelPasskey_UserId}     userId     - User id.
 * @param {Lib_PasskeyAuth_CreatePanelPasskey_Name}       name       - Name.
 * @param {Lib_PasskeyAuth_CreatePanelPasskey_RpId}       rpId       - Rp id.
 * @param {Lib_PasskeyAuth_CreatePanelPasskey_Credential} credential - Credential.
 *
 * @returns {Lib_PasskeyAuth_CreatePanelPasskey_Returns}
 *
 * @since 4.0.0
 */
export async function createPanelPasskey(
  pool: Lib_PasskeyAuth_CreatePanelPasskey_Pool,
  userId: Lib_PasskeyAuth_CreatePanelPasskey_UserId,
  name: Lib_PasskeyAuth_CreatePanelPasskey_Name,
  rpId: Lib_PasskeyAuth_CreatePanelPasskey_RpId,
  credential: Lib_PasskeyAuth_CreatePanelPasskey_Credential,
): Lib_PasskeyAuth_CreatePanelPasskey_Returns {
  try {
    await pool.query(
      'INSERT INTO panel_passkeys (credential_id, user_id, name, public_key, counter, transports, device_type, backed_up, rp_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        credential['id'],
        userId,
        name,
        Buffer.from(credential['publicKey']),
        credential['counter'],
        credential['transports'],
        credential['deviceType'],
        credential['backedUp'],
        rpId,
      ],
    );
  } catch (error) {
    if (Reflect.get(Object(error), 'code') === '23505') {
      return 'conflict';
    }

    throw error;
  }

  return 'created';
}

/**
 * Passkey Auth - Create Panel Webauthn Ceremony.
 *
 * Stores one passkey challenge with the hostname and origin it was started on.
 * The returned id lets the browser finish the ceremony exactly once, within five minutes.
 *
 * @param {Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Pool}     pool     - Pool.
 * @param {Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Ceremony} ceremony - Ceremony.
 *
 * @returns {Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Returns}
 *
 * @since 4.0.0
 */
export async function createPanelWebauthnCeremony(
  pool: Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Pool,
  ceremony: Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Ceremony,
): Lib_PasskeyAuth_CreatePanelWebauthnCeremony_Returns {
  const ceremonyId: Lib_PasskeyAuth_CreatePanelWebauthnCeremony_CeremonyId = randomBytes(32).toString('base64url');

  await pool.query('DELETE FROM panel_webauthn_ceremonies WHERE expires_at <= NOW()');

  await pool.query(
    'INSERT INTO panel_webauthn_ceremonies (id_hash, kind, user_id, challenge, name, rp_id, origin, expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL \'5 minutes\')',
    [
      digestValue(ceremonyId),
      ceremony['kind'],
      ceremony['userId'],
      ceremony['challenge'],
      ceremony['name'],
      ceremony['rpId'],
      ceremony['origin'],
    ],
  );

  return ceremonyId;
}

/**
 * Passkey Auth - Create Passkey Authentication Options.
 *
 * Starts a sign-in that lets the browser offer any passkey saved for this hostname.
 * No username is needed because passkeys are discoverable.
 *
 * @param {Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Configuration} configuration - Configuration.
 *
 * @returns {Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Returns}
 *
 * @since 4.0.0
 */
export async function createPasskeyAuthenticationOptions(configuration: Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Configuration): Lib_PasskeyAuth_CreatePasskeyAuthenticationOptions_Returns {
  return generateAuthenticationOptions({
    rpID: configuration['rpId'],
    timeout: 60_000,
    userVerification: 'required',
  });
}

/**
 * Passkey Auth - Create Passkey Registration Options.
 *
 * Starts adding a discoverable passkey for a user on this hostname.
 * Passkeys the user already has are excluded so the same one isn't added twice.
 *
 * @param {Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Configuration}    configuration    - Configuration.
 * @param {Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Account}          account          - Account.
 * @param {Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_ExistingPasskeys} existingPasskeys - Existing passkeys.
 *
 * @returns {Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Returns}
 *
 * @since 4.0.0
 */
export async function createPasskeyRegistrationOptions(
  configuration: Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Configuration,
  account: Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Account,
  existingPasskeys: Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_ExistingPasskeys,
): Lib_PasskeyAuth_CreatePasskeyRegistrationOptions_Returns {
  return generateRegistrationOptions({
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'required',
    },
    excludeCredentials: existingPasskeys.map((passkey) => ({
      id: passkey['id'],
      transports: passkey['transports'],
    })),
    rpID: configuration['rpId'],
    rpName: configuration['rpName'],
    timeout: 60_000,
    userDisplayName: account['username'],
    userID: new Uint8Array(Buffer.from(account['id'], 'utf8')),
    userName: account['username'],
  });
}

/**
 * Passkey Auth - Get Panel Passkey.
 *
 * Loads one saved passkey and its owner for verifying a sign-in.
 * Passkeys of suspended users are not returned.
 *
 * @param {Lib_PasskeyAuth_GetPanelPasskey_Pool}         pool         - Pool.
 * @param {Lib_PasskeyAuth_GetPanelPasskey_CredentialId} credentialId - Credential id.
 *
 * @returns {Lib_PasskeyAuth_GetPanelPasskey_Returns}
 *
 * @since 4.0.0
 */
export async function getPanelPasskey(
  pool: Lib_PasskeyAuth_GetPanelPasskey_Pool,
  credentialId: Lib_PasskeyAuth_GetPanelPasskey_CredentialId,
): Lib_PasskeyAuth_GetPanelPasskey_Returns {
  const result: Lib_PasskeyAuth_GetPanelPasskey_Result = await pool.query<Lib_PasskeyAuth_GetPanelPasskey_QueryRow>(
    'SELECT panel_passkeys.credential_id, panel_passkeys.user_id::text AS user_id, panel_passkeys.name, panel_passkeys.public_key, panel_passkeys.counter::text AS counter, panel_passkeys.transports, panel_passkeys.rp_id FROM panel_passkeys INNER JOIN panel_users ON panel_users.id = panel_passkeys.user_id WHERE panel_passkeys.credential_id = $1 AND panel_users.enabled = TRUE',
    [credentialId],
  );
  const row: Lib_PasskeyAuth_GetPanelPasskey_Row = result.rows[0];

  if (row === undefined) {
    return undefined;
  }

  return {
    counter: Number(row['counter']),
    id: row['credential_id'],
    name: row['name'],
    publicKey: new Uint8Array(row['public_key']),
    rpId: row['rp_id'],
    transports: row['transports'],
    userId: row['user_id'],
  };
}

/**
 * Passkey Auth - Get Passkey User Handle.
 *
 * Encodes a user id the way it was given to the authenticator when the passkey was made.
 * A sign-in must return the same handle as the passkey's owner.
 *
 * @param {Lib_PasskeyAuth_GetPasskeyUserHandle_UserId} userId - User id.
 *
 * @returns {Lib_PasskeyAuth_GetPasskeyUserHandle_Returns}
 *
 * @since 4.0.0
 */
export function getPasskeyUserHandle(userId: Lib_PasskeyAuth_GetPasskeyUserHandle_UserId): Lib_PasskeyAuth_GetPasskeyUserHandle_Returns {
  return Buffer.from(userId, 'utf8').toString('base64url');
}

/**
 * Passkey Auth - List Panel Passkey Descriptors.
 *
 * Lists a user's passkey ids and transports so the browser won't add one twice.
 * Nothing secret is returned.
 *
 * @param {Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Pool}   pool   - Pool.
 * @param {Lib_PasskeyAuth_ListPanelPasskeyDescriptors_UserId} userId - User id.
 *
 * @returns {Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Returns}
 *
 * @since 4.0.0
 */
export async function listPanelPasskeyDescriptors(
  pool: Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Pool,
  userId: Lib_PasskeyAuth_ListPanelPasskeyDescriptors_UserId,
): Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Returns {
  const result: Lib_PasskeyAuth_ListPanelPasskeyDescriptors_Result = await pool.query('SELECT credential_id, transports FROM panel_passkeys WHERE user_id = $1 ORDER BY created_at, credential_id', [userId]);

  return result.rows.map((row) => ({
    id: row['credential_id'],
    transports: row['transports'],
  }));
}

/**
 * Passkey Auth - Remove Panel Passkey.
 *
 * Deletes one of a user's own passkeys and returns its name.
 * Other users' passkeys can't be removed this way.
 *
 * @param {Lib_PasskeyAuth_RemovePanelPasskey_Pool}         pool         - Pool.
 * @param {Lib_PasskeyAuth_RemovePanelPasskey_UserId}       userId       - User id.
 * @param {Lib_PasskeyAuth_RemovePanelPasskey_CredentialId} credentialId - Credential id.
 *
 * @returns {Lib_PasskeyAuth_RemovePanelPasskey_Returns}
 *
 * @since 4.0.0
 */
export async function removePanelPasskey(
  pool: Lib_PasskeyAuth_RemovePanelPasskey_Pool,
  userId: Lib_PasskeyAuth_RemovePanelPasskey_UserId,
  credentialId: Lib_PasskeyAuth_RemovePanelPasskey_CredentialId,
): Lib_PasskeyAuth_RemovePanelPasskey_Returns {
  const result: Lib_PasskeyAuth_RemovePanelPasskey_Result = await pool.query<Lib_PasskeyAuth_RemovePanelPasskey_QueryRow>('DELETE FROM panel_passkeys WHERE user_id = $1 AND credential_id = $2 RETURNING name', [
    userId,
    credentialId,
  ]);
  const row: Lib_PasskeyAuth_RemovePanelPasskey_Row = result.rows[0];

  return (row === undefined) ? undefined : row['name'];
}

/**
 * Passkey Auth - Take Panel Webauthn Ceremony.
 *
 * Removes and returns a stored passkey challenge so it can be used only once.
 * Expired ceremonies and ceremonies of another kind return undefined.
 *
 * @param {Lib_PasskeyAuth_TakePanelWebauthnCeremony_Pool}       pool       - Pool.
 * @param {Lib_PasskeyAuth_TakePanelWebauthnCeremony_CeremonyId} ceremonyId - Ceremony id.
 * @param {Lib_PasskeyAuth_TakePanelWebauthnCeremony_Kind}       kind       - Kind.
 *
 * @returns {Lib_PasskeyAuth_TakePanelWebauthnCeremony_Returns}
 *
 * @since 4.0.0
 */
export async function takePanelWebauthnCeremony(
  pool: Lib_PasskeyAuth_TakePanelWebauthnCeremony_Pool,
  ceremonyId: Lib_PasskeyAuth_TakePanelWebauthnCeremony_CeremonyId,
  kind: Lib_PasskeyAuth_TakePanelWebauthnCeremony_Kind,
): Lib_PasskeyAuth_TakePanelWebauthnCeremony_Returns {
  const result: Lib_PasskeyAuth_TakePanelWebauthnCeremony_Result = await pool.query<Lib_PasskeyAuth_TakePanelWebauthnCeremony_QueryRow>(
    'DELETE FROM panel_webauthn_ceremonies WHERE id_hash = $1 AND kind = $2 RETURNING user_id::text AS user_id, challenge, name, rp_id, origin, (expires_at > NOW()) AS active',
    [
      digestValue(ceremonyId),
      kind,
    ],
  );
  const row: Lib_PasskeyAuth_TakePanelWebauthnCeremony_Row = result.rows[0];

  if (row === undefined || row['active'] === false) {
    return undefined;
  }

  return {
    challenge: row['challenge'],
    name: row['name'],
    origin: row['origin'],
    rpId: row['rp_id'],
    userId: row['user_id'],
  };
}

/**
 * Passkey Auth - Update Panel Passkey Usage.
 *
 * Records a successful sign-in's counter, backup state, and time on the passkey.
 * The write only applies if no other sign-in moved the counter in the meantime.
 *
 * @param {Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Pool}            pool            - Pool.
 * @param {Lib_PasskeyAuth_UpdatePanelPasskeyUsage_CredentialId}    credentialId    - Credential id.
 * @param {Lib_PasskeyAuth_UpdatePanelPasskeyUsage_PreviousCounter} previousCounter - Previous counter.
 * @param {Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Usage}           usage           - Usage.
 * @param {Lib_PasskeyAuth_UpdatePanelPasskeyUsage_RpId}            rpId            - Rp id.
 *
 * @returns {Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Returns}
 *
 * @since 4.0.0
 */
export async function updatePanelPasskeyUsage(
  pool: Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Pool,
  credentialId: Lib_PasskeyAuth_UpdatePanelPasskeyUsage_CredentialId,
  previousCounter: Lib_PasskeyAuth_UpdatePanelPasskeyUsage_PreviousCounter,
  usage: Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Usage,
  rpId: Lib_PasskeyAuth_UpdatePanelPasskeyUsage_RpId,
): Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Returns {
  const result: Lib_PasskeyAuth_UpdatePanelPasskeyUsage_Result = await pool.query(
    'UPDATE panel_passkeys SET counter = $3, device_type = $4, backed_up = $5, last_used_at = NOW(), rp_id = COALESCE(rp_id, $6) WHERE credential_id = $1 AND counter = $2',
    [
      credentialId,
      previousCounter,
      usage['counter'],
      usage['deviceType'],
      usage['backedUp'],
      rpId,
    ],
  );

  return result.rowCount === 1;
}

/**
 * Passkey Auth - Verify Passkey Authentication.
 *
 * Verifies a sign-in assertion against the saved passkey, its owner, and this hostname.
 * Any failed check, including a thrown verification error, returns undefined.
 *
 * @param {Lib_PasskeyAuth_VerifyPasskeyAuthentication_Configuration} configuration - Configuration.
 * @param {Lib_PasskeyAuth_VerifyPasskeyAuthentication_Response}      response      - Response.
 * @param {Lib_PasskeyAuth_VerifyPasskeyAuthentication_Challenge}     challenge     - Challenge.
 * @param {Lib_PasskeyAuth_VerifyPasskeyAuthentication_Passkey}       passkey       - Passkey.
 *
 * @returns {Lib_PasskeyAuth_VerifyPasskeyAuthentication_Returns}
 *
 * @since 4.0.0
 */
export async function verifyPasskeyAuthentication(
  configuration: Lib_PasskeyAuth_VerifyPasskeyAuthentication_Configuration,
  response: Lib_PasskeyAuth_VerifyPasskeyAuthentication_Response,
  challenge: Lib_PasskeyAuth_VerifyPasskeyAuthentication_Challenge,
  passkey: Lib_PasskeyAuth_VerifyPasskeyAuthentication_Passkey,
): Lib_PasskeyAuth_VerifyPasskeyAuthentication_Returns {
  if (response['response']['userHandle'] !== getPasskeyUserHandle(passkey['userId'])) {
    return undefined;
  }

  let verification: Lib_PasskeyAuth_VerifyPasskeyAuthentication_Verification = undefined;

  try {
    verification = await verifyAuthenticationResponse({
      credential: {
        counter: passkey['counter'],
        id: passkey['id'],
        publicKey: passkey['publicKey'],
        transports: passkey['transports'],
      },
      expectedChallenge: challenge,
      expectedOrigin: configuration['origin'],
      expectedRPID: configuration['rpId'],
      requireUserVerification: true,
      response,
    });
  } catch {
    return undefined;
  }

  if (verification['verified'] === false || verification['authenticationInfo']['userVerified'] === false) {
    return undefined;
  }

  return {
    backedUp: verification['authenticationInfo']['credentialBackedUp'],
    counter: verification['authenticationInfo']['newCounter'],
    deviceType: verification['authenticationInfo']['credentialDeviceType'],
  };
}

/**
 * Passkey Auth - Verify Passkey Registration.
 *
 * Verifies a new passkey against its ceremony challenge and this hostname.
 * Any failed check, including a thrown verification error, returns undefined.
 *
 * @param {Lib_PasskeyAuth_VerifyPasskeyRegistration_Configuration} configuration - Configuration.
 * @param {Lib_PasskeyAuth_VerifyPasskeyRegistration_Response}      response      - Response.
 * @param {Lib_PasskeyAuth_VerifyPasskeyRegistration_Challenge}     challenge     - Challenge.
 *
 * @returns {Lib_PasskeyAuth_VerifyPasskeyRegistration_Returns}
 *
 * @since 4.0.0
 */
export async function verifyPasskeyRegistration(
  configuration: Lib_PasskeyAuth_VerifyPasskeyRegistration_Configuration,
  response: Lib_PasskeyAuth_VerifyPasskeyRegistration_Response,
  challenge: Lib_PasskeyAuth_VerifyPasskeyRegistration_Challenge,
): Lib_PasskeyAuth_VerifyPasskeyRegistration_Returns {
  let verification: Lib_PasskeyAuth_VerifyPasskeyRegistration_Verification = undefined;

  try {
    verification = await verifyRegistrationResponse({
      expectedChallenge: challenge,
      expectedOrigin: configuration['origin'],
      expectedRPID: configuration['rpId'],
      requireUserVerification: true,
      response,
    });
  } catch {
    return undefined;
  }

  if (verification['verified'] === false) {
    return undefined;
  }

  const transports: Lib_PasskeyAuth_VerifyPasskeyRegistration_Transports = (
    verification['registrationInfo']['credential']['transports']
    ?? response['response']['transports']
    ?? []
  );

  return {
    backedUp: verification['registrationInfo']['credentialBackedUp'],
    counter: verification['registrationInfo']['credential']['counter'],
    deviceType: verification['registrationInfo']['credentialDeviceType'],
    id: verification['registrationInfo']['credential']['id'],
    publicKey: new Uint8Array(verification['registrationInfo']['credential']['publicKey']),
    transports,
  };
}
