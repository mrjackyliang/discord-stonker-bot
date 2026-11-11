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
} from './credential-vault.js';

import type {
  Lib_CredentialVault_EncryptSecret_CredentialKey,
  Lib_CredentialVault_EncryptSecret_Returns,
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

  return;
});
