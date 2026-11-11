import {
  describe,
  expect,
  it,
} from 'vitest';

import { backupDocumentSchema } from '@/web/backup-format.js';

import type {
  Web_BackupFormatTest_Document,
  Web_BackupFormatTest_UnknownDocument,
} from '@/types/web/backup-format.test.d.ts';

/**
 * Backup Format - Valid Document.
 *
 * Supplies a minimal version-one export to the browser-side validator.
 * Each invalid case derives an independent untrusted file value.
 *
 * @since UNRELEASED
 */
const validDocument: Web_BackupFormatTest_Document = {
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
 * Backup Format - Browser Boundaries.
 *
 * Mirrors strict server rejection for unknown keys and duplicate identities.
 * Unsafe files stop before the wizard asks the server for a preview.
 *
 * @since UNRELEASED
 */
describe('browser backup format boundaries', () => {
  it('rejects unknown fields, empty files, and duplicate identities', () => {
    const unknownDocument: Web_BackupFormatTest_UnknownDocument = {
      ...validDocument,
      sessions: [{ token: 'must-not-import' }],
    };
    const emptyDocument: Web_BackupFormatTest_UnknownDocument = {
      appVersion: validDocument['appVersion'],
      exportedAt: validDocument['exportedAt'],
      format: validDocument['format'],
      version: validDocument['version'],
    };
    const duplicateDocument: Web_BackupFormatTest_UnknownDocument = {
      ...validDocument,
      features: [
        {
          features: [],
          serverId: '1197999049190674442',
          timeZone: 'UTC',
        },
        {
          features: [],
          serverId: '1197999049190674442',
          timeZone: 'America/New_York',
        },
      ],
    };

    expect(backupDocumentSchema.safeParse(unknownDocument).success).toBe(false);

    expect(backupDocumentSchema.safeParse(emptyDocument).success).toBe(false);

    expect(backupDocumentSchema.safeParse(duplicateDocument).success).toBe(false);

    return;
  });

  return;
});
