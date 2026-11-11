import {
  describe,
  expect,
  it,
} from 'vitest';

import { GrantStore } from './backup-grants.js';

import type {
  Lib_BackupGrants_Test_Grant,
  Lib_BackupGrants_Test_Now,
  Lib_BackupGrants_Test_Store,
} from '../types/lib/backup-grants.test.d.ts';

/**
 * Backup Grants - Backup Grant Bindings And Expiry.
 *
 * Verifies purpose, browser session, single-use, and five-minute expiry rules.
 * Wrong bindings do not consume an otherwise valid credential.
 *
 * @since UNRELEASED
 */
describe('backup grant bindings and expiry', () => {
  it('allows exactly one matching use', () => {
    const store: Lib_BackupGrants_Test_Store = new GrantStore();
    const grant: Lib_BackupGrants_Test_Grant = store.issue('session-one', 'export');

    expect(store.consume(grant['grant'], 'session-one', 'export')).toBe(true);

    expect(store.consume(grant['grant'], 'session-one', 'export')).toBe(false);

    return;
  });

  it('keeps a grant bound to its session and purpose', () => {
    const store: Lib_BackupGrants_Test_Store = new GrantStore();
    const grant: Lib_BackupGrants_Test_Grant = store.issue('session-one', 'import');

    expect(store.consume(grant['grant'], 'session-two', 'import')).toBe(false);

    expect(store.consume(grant['grant'], 'session-one', 'export')).toBe(false);

    expect(store.consume(grant['grant'], 'session-one', 'import')).toBe(true);

    return;
  });

  it('expires after five minutes', () => {
    let now: Lib_BackupGrants_Test_Now = Date.parse('2026-11-09T12:00:00.000Z');
    const store: Lib_BackupGrants_Test_Store = new GrantStore(() => now);
    const grant: Lib_BackupGrants_Test_Grant = store.issue('session-one', 'export');

    now += 5 * 60 * 1000;

    expect(store.consume(grant['grant'], 'session-one', 'export')).toBe(false);

    return;
  });

  return;
});
