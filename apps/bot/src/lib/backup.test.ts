import {
  describe,
  expect,
  it,
} from 'vitest';

import { backupDocumentSchema } from './backup.js';

import type {
  Lib_Backup_Test_Document,
  Lib_Backup_Test_UnknownDocument,
} from '../types/lib/backup.test.d.ts';

/**
 * Backup - Valid Document.
 *
 * Supplies a minimal strict server-side version-one document.
 * Invalid cases derive independent values without mutating this fixture.
 *
 * @since UNRELEASED
 */
const validDocument: Lib_Backup_Test_Document = {
  appVersion: '4.0.0',
  connection: {
    botToken: null,
    desiredState: 'stopped',
  },
  exportedAt: '2026-11-09T12:00:00.000Z',
  format: 'discord-stonker-bot-export',
  version: 1,
};

/**
 * Backup - Server Backup Format Boundaries.
 *
 * Rejects unknown fields, empty files, duplicate identities, and unrelated secrets.
 * These checks all run before import opens a transaction.
 *
 * @since UNRELEASED
 */
describe('server backup format boundaries', () => {
  it('strictly rejects unknown and empty documents', () => {
    const unknownDocument: Lib_Backup_Test_UnknownDocument = {
      ...validDocument,
      users: [{ password: 'must-not-import' }],
    };
    const emptyDocument: Lib_Backup_Test_UnknownDocument = {
      appVersion: validDocument['appVersion'],
      exportedAt: validDocument['exportedAt'],
      format: validDocument['format'],
      version: validDocument['version'],
    };

    expect(backupDocumentSchema.safeParse(unknownDocument).success).toBe(false);

    expect(backupDocumentSchema.safeParse(emptyDocument).success).toBe(false);

    return;
  });

  it('rejects duplicate identities and secrets unrelated to feature settings', () => {
    const duplicateDocument: Lib_Backup_Test_UnknownDocument = {
      ...validDocument,
      accessTokens: [
        {
          expiresAt: null,
          id: 'tok-1111111111111111',
          name: 'Northwind one',
          scopes: ['logs:read'],
          tokenHash: 'a'.repeat(64),
        },
        {
          expiresAt: null,
          id: 'tok-2222222222222222',
          name: 'Northwind two',
          scopes: ['features:read'],
          tokenHash: 'a'.repeat(64),
        },
      ],
    };
    const unrelatedSecretDocument: Lib_Backup_Test_UnknownDocument = {
      ...validDocument,
      features: [{
        features: [{
          configuration: { channelId: '1209383231867326487' },
          enabled: true,
          key: 'northwind-alerts',
          secrets: { token: 'must-not-be-unrelated' },
        }],
        serverId: '1197999049190674442',
        timeZone: 'UTC',
      }],
    };

    expect(backupDocumentSchema.safeParse(duplicateDocument).success).toBe(false);

    expect(backupDocumentSchema.safeParse(unrelatedSecretDocument).success).toBe(false);

    return;
  });

  return;
});
