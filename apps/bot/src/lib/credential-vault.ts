import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';
import { readFile } from 'node:fs/promises';

import type {
  Lib_CredentialVault_CreateAssociatedData_Purpose,
  Lib_CredentialVault_CreateAssociatedData_Returns,
  Lib_CredentialVault_DecryptDiscordToken_Ciphertext,
  Lib_CredentialVault_DecryptDiscordToken_CredentialKey,
  Lib_CredentialVault_DecryptDiscordToken_Returns,
  Lib_CredentialVault_DecryptSecret_AssociatedData,
  Lib_CredentialVault_DecryptSecret_Ciphertext,
  Lib_CredentialVault_DecryptSecret_CiphertextBuffer,
  Lib_CredentialVault_DecryptSecret_CredentialKey,
  Lib_CredentialVault_DecryptSecret_Decipher,
  Lib_CredentialVault_DecryptSecret_InitializationVector,
  Lib_CredentialVault_DecryptSecret_Parts,
  Lib_CredentialVault_DecryptSecret_Purpose,
  Lib_CredentialVault_DecryptSecret_Returns,
  Lib_CredentialVault_DecryptSecret_Tag,
  Lib_CredentialVault_EncryptDiscordToken_CredentialKey,
  Lib_CredentialVault_EncryptDiscordToken_Returns,
  Lib_CredentialVault_EncryptDiscordToken_Token,
  Lib_CredentialVault_EncryptSecret_AssociatedData,
  Lib_CredentialVault_EncryptSecret_Cipher,
  Lib_CredentialVault_EncryptSecret_CredentialKey,
  Lib_CredentialVault_EncryptSecret_EncryptedSecret,
  Lib_CredentialVault_EncryptSecret_InitializationVector,
  Lib_CredentialVault_EncryptSecret_Purpose,
  Lib_CredentialVault_EncryptSecret_Returns,
  Lib_CredentialVault_EncryptSecret_Secret,
  Lib_CredentialVault_EncryptSecret_Tag,
  Lib_CredentialVault_ReadCredentialKey_CredentialKey,
  Lib_CredentialVault_ReadCredentialKey_FilePath,
  Lib_CredentialVault_ReadCredentialKey_Returns,
  Lib_CredentialVault_ValidateCredentialKey_CredentialKey,
  Lib_CredentialVault_ValidateCredentialKey_Returns,
} from '../types/lib/credential-vault.d.ts';

/**
 * Credential Vault - Algorithm.
 *
 * Authenticated encryption prevents stored credentials from being read or
 * modified without the key held outside PostgreSQL.
 *
 * @since 4.0.0
 */
const ALGORITHM = 'aes-256-gcm';

/**
 * Credential Vault - Credential Key Bytes.
 *
 * AES-256 requires a 32-byte key generated from the operating system random
 * source during first-boot data-volume initialization.
 *
 * @since 4.0.0
 */
const CREDENTIAL_KEY_BYTES = 32;

/**
 * Credential Vault - Initialization Vector Bytes.
 *
 * A fresh 96-bit initialization vector is generated for every token update,
 * which is the recommended size for Galois/Counter Mode.
 *
 * @since 4.0.0
 */
const INITIALIZATION_VECTOR_BYTES = 12;

/**
 * Credential Vault - Tag Bytes.
 *
 * The full 128-bit authentication tag detects ciphertext or metadata changes
 * before any decrypted token is returned to the Discord process.
 *
 * @since 4.0.0
 */
const TAG_BYTES = 16;

/**
 * Credential Vault - Version.
 *
 * Versioning keeps future key or algorithm migrations explicit instead of
 * silently reinterpreting credentials already stored in PostgreSQL.
 *
 * @since 4.0.0
 */
const VERSION = 'v1';

/**
 * Credential Vault - Create Associated Data.
 *
 * Binds ciphertext to this application and one credential purpose so database
 * values cannot be replayed as a different integration secret.
 *
 * @param {Lib_CredentialVault_CreateAssociatedData_Purpose} purpose - Purpose.
 *
 * @private
 *
 * @returns {Lib_CredentialVault_CreateAssociatedData_Returns}
 *
 * @since 4.0.0
 */
function createAssociatedData(
  purpose: Lib_CredentialVault_CreateAssociatedData_Purpose,
): Lib_CredentialVault_CreateAssociatedData_Returns {
  if (purpose.trim() === '') {
    throw new Error('A credential purpose is required.');
  }

  return Buffer.from(`discord-stonker-bot:${purpose}:v1`, 'utf8');
}

/**
 * Credential Vault - Decrypt Discord Token.
 *
 * Authenticates and decrypts one database value immediately before login.
 * Invalid formats, keys, or tags fail without returning partial plaintext.
 *
 * @param {Lib_CredentialVault_DecryptDiscordToken_Ciphertext}    ciphertext    - Ciphertext.
 * @param {Lib_CredentialVault_DecryptDiscordToken_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_CredentialVault_DecryptDiscordToken_Returns}
 *
 * @since 4.0.0
 */
export function decryptDiscordToken(
  ciphertext: Lib_CredentialVault_DecryptDiscordToken_Ciphertext,
  credentialKey: Lib_CredentialVault_DecryptDiscordToken_CredentialKey,
): Lib_CredentialVault_DecryptDiscordToken_Returns {
  return decryptSecret(ciphertext, 'discord-token', credentialKey);
}

/**
 * Credential Vault - Decrypt Secret.
 *
 * Authenticates one purpose-bound encrypted database value before returning it
 * to the owning integration in process memory.
 *
 * @param {Lib_CredentialVault_DecryptSecret_Ciphertext}    ciphertext    - Ciphertext.
 * @param {Lib_CredentialVault_DecryptSecret_Purpose}       purpose       - Purpose.
 * @param {Lib_CredentialVault_DecryptSecret_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_CredentialVault_DecryptSecret_Returns}
 *
 * @since 4.0.0
 */
export function decryptSecret(
  ciphertext: Lib_CredentialVault_DecryptSecret_Ciphertext,
  purpose: Lib_CredentialVault_DecryptSecret_Purpose,
  credentialKey: Lib_CredentialVault_DecryptSecret_CredentialKey,
): Lib_CredentialVault_DecryptSecret_Returns {
  validateCredentialKey(credentialKey);

  const parts: Lib_CredentialVault_DecryptSecret_Parts = ciphertext.split(':');

  if (
    parts.length !== 4
    || parts[0] !== VERSION
    || parts[1] === undefined
    || parts[2] === undefined
    || parts[3] === undefined
  ) {
    throw new Error('The stored secret has an unsupported format.');
  }

  const initializationVector: Lib_CredentialVault_DecryptSecret_InitializationVector = Buffer.from(
    parts[1],
    'base64url',
  );
  const tag: Lib_CredentialVault_DecryptSecret_Tag = Buffer.from(parts[2], 'base64url');
  const ciphertextBuffer: Lib_CredentialVault_DecryptSecret_CiphertextBuffer = Buffer.from(
    parts[3],
    'base64url',
  );

  if (
    initializationVector.length !== INITIALIZATION_VECTOR_BYTES
    || tag.length !== TAG_BYTES
    || ciphertextBuffer.length === 0
  ) {
    throw new Error('The stored secret has invalid encrypted data.');
  }

  const associatedData: Lib_CredentialVault_DecryptSecret_AssociatedData = createAssociatedData(purpose);
  const decipher: Lib_CredentialVault_DecryptSecret_Decipher = createDecipheriv(
    ALGORITHM,
    credentialKey,
    initializationVector,
    {
      authTagLength: TAG_BYTES,
    },
  );

  decipher.setAAD(associatedData);

  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(ciphertextBuffer),
    decipher.final(),
  ]).toString('utf8');
}

/**
 * Credential Vault - Encrypt Discord Token.
 *
 * Encrypts a panel-submitted token with a new initialization vector before the
 * value reaches PostgreSQL, so database dumps contain no reusable credential.
 *
 * @param {Lib_CredentialVault_EncryptDiscordToken_Token}         token         - Token.
 * @param {Lib_CredentialVault_EncryptDiscordToken_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_CredentialVault_EncryptDiscordToken_Returns}
 *
 * @since 4.0.0
 */
export function encryptDiscordToken(
  token: Lib_CredentialVault_EncryptDiscordToken_Token,
  credentialKey: Lib_CredentialVault_EncryptDiscordToken_CredentialKey,
): Lib_CredentialVault_EncryptDiscordToken_Returns {
  return encryptSecret(token, 'discord-token', credentialKey);
}

/**
 * Credential Vault - Encrypt Secret.
 *
 * Encrypts one operator-managed integration secret with purpose-bound
 * authenticated encryption before it reaches PostgreSQL.
 *
 * @param {Lib_CredentialVault_EncryptSecret_Secret}        secret        - Secret.
 * @param {Lib_CredentialVault_EncryptSecret_Purpose}       purpose       - Purpose.
 * @param {Lib_CredentialVault_EncryptSecret_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Lib_CredentialVault_EncryptSecret_Returns}
 *
 * @since 4.0.0
 */
export function encryptSecret(
  secret: Lib_CredentialVault_EncryptSecret_Secret,
  purpose: Lib_CredentialVault_EncryptSecret_Purpose,
  credentialKey: Lib_CredentialVault_EncryptSecret_CredentialKey,
): Lib_CredentialVault_EncryptSecret_Returns {
  validateCredentialKey(credentialKey);

  if (secret.length === 0) {
    throw new Error('A secret is required for encryption.');
  }

  const initializationVector: Lib_CredentialVault_EncryptSecret_InitializationVector = randomBytes(
    INITIALIZATION_VECTOR_BYTES,
  );
  const associatedData: Lib_CredentialVault_EncryptSecret_AssociatedData = createAssociatedData(purpose);
  const cipher: Lib_CredentialVault_EncryptSecret_Cipher = createCipheriv(
    ALGORITHM,
    credentialKey,
    initializationVector,
    {
      authTagLength: TAG_BYTES,
    },
  );

  cipher.setAAD(associatedData);

  const encryptedSecret: Lib_CredentialVault_EncryptSecret_EncryptedSecret = Buffer.concat([
    cipher.update(secret, 'utf8'),
    cipher.final(),
  ]);
  const tag: Lib_CredentialVault_EncryptSecret_Tag = cipher.getAuthTag();

  return [
    VERSION,
    initializationVector.toString('base64url'),
    tag.toString('base64url'),
    encryptedSecret.toString('base64url'),
  ].join(':');
}

/**
 * Credential Vault - Read Credential Key.
 *
 * Loads the automatically generated key from the persistent data volume.
 * A missing or malformed key fails closed before credential processing begins.
 *
 * @param {Lib_CredentialVault_ReadCredentialKey_FilePath} filePath - File path.
 *
 * @returns {Lib_CredentialVault_ReadCredentialKey_Returns}
 *
 * @since 4.0.0
 */
export async function readCredentialKey(
  filePath: Lib_CredentialVault_ReadCredentialKey_FilePath,
): Lib_CredentialVault_ReadCredentialKey_Returns {
  const credentialKey: Lib_CredentialVault_ReadCredentialKey_CredentialKey = await readFile(filePath);

  validateCredentialKey(credentialKey);

  return credentialKey;
}

/**
 * Credential Vault - Validate Credential Key.
 *
 * Enforces the exact AES-256 key size at both encryption and decryption entry
 * points so truncated volume data cannot weaken or corrupt credential handling.
 *
 * @param {Buffer} credentialKey - Credential key.
 *
 * @returns {void}
 *
 * @since 4.0.0
 */
function validateCredentialKey(
  credentialKey: Lib_CredentialVault_ValidateCredentialKey_CredentialKey,
): Lib_CredentialVault_ValidateCredentialKey_Returns {
  if (credentialKey.length !== CREDENTIAL_KEY_BYTES) {
    throw new Error('The credential encryption key must contain exactly 32 bytes.');
  }

  return;
}
