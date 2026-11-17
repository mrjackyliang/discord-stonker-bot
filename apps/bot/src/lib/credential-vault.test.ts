import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  decryptDiscordToken,
  decryptSecret,
  encryptDiscordToken,
  encryptSecret,
  readCredentialKey,
} from './credential-vault.js';

import type {
  Lib_CredentialVault_EncryptSecret_CredentialKey,
  Lib_CredentialVault_EncryptSecret_Returns,
  Lib_CredentialVault_ReadCredentialKey_CredentialKey,
  Lib_CredentialVault_ReadCredentialKey_FilePath,
} from '../types/lib/credential-vault.d.ts';

/**
 * Credential Vault - Credential Vault Boundaries.
 *
 * Exercises authenticated token storage without touching a live Discord or
 * PostgreSQL service, including rejection of malformed encrypted values.
 *
 * @since 4.0.0
 */
describe('credential vault boundaries', () => {
  it('round-trips an encrypted Discord token', () => {
    expect(
      decryptDiscordToken(
        encryptDiscordToken('discord-token-value', Buffer.alloc(32, 1)),
        Buffer.alloc(32, 1),
      ),
    ).toBe('discord-token-value');

    return;
  });

  it('rejects malformed ciphertext and keys', () => {
    expect(() => decryptDiscordToken('v1:bad:bad:bad', Buffer.alloc(32, 1))).toThrow();

    expect(() => encryptDiscordToken('discord-token-value', Buffer.alloc(16, 1))).toThrow();

    return;
  });

  it('binds imported secrets to their integration purpose', () => {
    const credentialKey: Lib_CredentialVault_EncryptSecret_CredentialKey = Buffer.alloc(32, 2);
    const ciphertext: Lib_CredentialVault_EncryptSecret_Returns = encryptSecret(
      'provider-secret',
      'legacy:api-key',
      credentialKey,
    );

    expect(decryptSecret(ciphertext, 'legacy:api-key', credentialKey)).toBe('provider-secret');

    expect(() => decryptSecret(ciphertext, 'legacy:webhook', credentialKey)).toThrow();

    return;
  });

  it('reads the hexadecimal key file and the version 4 raw key as the same bytes', async () => {
    const keyDirectory: Lib_CredentialVault_ReadCredentialKey_FilePath = await mkdtemp(join(tmpdir(), 'dsb-key-'));
    const hexadecimalPath: Lib_CredentialVault_ReadCredentialKey_FilePath = join(keyDirectory, 'hexadecimal.key');
    const rawPath: Lib_CredentialVault_ReadCredentialKey_FilePath = join(keyDirectory, 'raw.key');
    const expectedKey: Lib_CredentialVault_ReadCredentialKey_CredentialKey = Buffer.alloc(32, 7);

    try {
      await writeFile(hexadecimalPath, `${expectedKey.toString('hex')}\n`);

      await writeFile(rawPath, expectedKey);

      expect((await readCredentialKey(hexadecimalPath)).equals(expectedKey)).toBe(true);

      expect((await readCredentialKey(rawPath)).equals(expectedKey)).toBe(true);
    } finally {
      await rm(keyDirectory, {
        force: true,
        recursive: true,
      });
    }

    return;
  });

  return;
});
