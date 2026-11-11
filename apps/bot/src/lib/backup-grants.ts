import { randomBytes } from 'node:crypto';

import { digestValue } from './panel-sessions.js';

import type {
  Lib_Backup_Grant,
  Lib_Backup_GrantStore_Clock,
  Lib_Backup_GrantStore_Consume_Returns,
  Lib_Backup_GrantStore_Digest,
  Lib_Backup_GrantStore_DurationMilliseconds,
  Lib_Backup_GrantStore_Entry,
  Lib_Backup_GrantStore_ExpiresAt,
  Lib_Backup_GrantStore_Grant,
  Lib_Backup_GrantStore_Grants,
  Lib_Backup_GrantStore_Issue_Returns,
  Lib_Backup_GrantStore_Now,
  Lib_Backup_GrantStore_Prune_Returns,
  Lib_Backup_GrantStore_Record,
  Lib_Backup_GrantStore_SessionId,
  Lib_Backup_Purpose,
} from '../types/lib/backup.d.ts';

/**
 * Backup Grants.
 *
 * Keeps only grant digests in memory and binds each credential to one session,
 * purpose, expiry, and successful single use.
 *
 * @since UNRELEASED
 */
export class GrantStore {
  /**
   * Backup Grants - Duration Milliseconds.
   *
   * Limits fresh identity proof to a short five-minute window.
   * Expired records are pruned as new credentials are issued.
   *
   * @private
   *
   * @since UNRELEASED
   */
  static readonly #durationMilliseconds: Lib_Backup_GrantStore_DurationMilliseconds = 5 * 60 * 1000;

  /**
   * Backup Grants - Clock.
   *
   * Supplies current time and allows deterministic expiry tests.
   * Production uses the normal process clock.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #clock: Lib_Backup_GrantStore_Clock;

  /**
   * Backup Grants - Grants.
   *
   * Retains only SHA-256 grant digests and their bindings.
   * Raw credentials are never stored by the process.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #grants: Lib_Backup_GrantStore_Grants = new Map();

  /**
   * Backup Grants - Constructor.
   *
   * Starts an empty process-local grant store.
   * An injected clock keeps expiry behavior directly testable.
   *
   * @param {Lib_Backup_GrantStore_Clock} [clock] - Clock.
   *
   * @since UNRELEASED
   */
  public constructor(clock: Lib_Backup_GrantStore_Clock = Date.now) {
    this.#clock = clock;
    return;
  }

  /**
   * Backup Grants - Issue.
   *
   * Returns a raw grant once while retaining only its digest.
   * Session and purpose bindings accompany the expiry record.
   *
   * @param {Lib_Backup_GrantStore_SessionId} sessionId - Session id.
   * @param {Lib_Backup_Purpose}              purpose   - Purpose.
   *
   * @returns {Lib_Backup_GrantStore_Issue_Returns}
   *
   * @since UNRELEASED
   */
  public issue(sessionId: Lib_Backup_GrantStore_SessionId, purpose: Lib_Backup_Purpose): Lib_Backup_GrantStore_Issue_Returns {
    const now: Lib_Backup_GrantStore_Now = this.#clock();
    const grant: Lib_Backup_GrantStore_Grant = `bkg_${randomBytes(32).toString('base64url')}`;
    const expiresAt: Lib_Backup_GrantStore_ExpiresAt = now + GrantStore.#durationMilliseconds;

    this.prune(now);

    this.#grants.set(digestValue(grant), {
      expiresAt,
      purpose,
      sessionId,
    });

    return {
      expiresAt: new Date(expiresAt).toISOString(),
      grant,
    } satisfies Lib_Backup_Grant;
  }

  /**
   * Backup Grants - Consume.
   *
   * Consumes a matching, unexpired grant exactly once.
   * Wrong-session and wrong-purpose attempts leave the valid binding intact.
   *
   * @param {Lib_Backup_GrantStore_Grant}     grant     - Grant.
   * @param {Lib_Backup_GrantStore_SessionId} sessionId - Session id.
   * @param {Lib_Backup_Purpose}              purpose   - Purpose.
   *
   * @returns {Lib_Backup_GrantStore_Consume_Returns}
   *
   * @since UNRELEASED
   */
  public consume(grant: Lib_Backup_GrantStore_Grant, sessionId: Lib_Backup_GrantStore_SessionId, purpose: Lib_Backup_Purpose): Lib_Backup_GrantStore_Consume_Returns {
    const now: Lib_Backup_GrantStore_Now = this.#clock();
    const digest: Lib_Backup_GrantStore_Digest = digestValue(grant);
    const record: Lib_Backup_GrantStore_Record = this.#grants.get(digest);

    if (record === undefined || record['expiresAt'] <= now) {
      this.#grants.delete(digest);
      return false;
    }

    if (record['sessionId'] !== sessionId || record['purpose'] !== purpose) {
      return false;
    }

    this.#grants.delete(digest);
    return true;
  }

  /**
   * Backup Grants - Prune.
   *
   * Removes expired digest records whenever a grant is issued.
   * The store cannot retain stale confirmation metadata indefinitely.
   *
   * @param {Lib_Backup_GrantStore_Now} now - Now.
   *
   * @private
   *
   * @returns {Lib_Backup_GrantStore_Prune_Returns}
   *
   * @since UNRELEASED
   */
  private prune(now: Lib_Backup_GrantStore_Now): Lib_Backup_GrantStore_Prune_Returns {
    for (const entry of this.#grants) {
      const grantEntry: Lib_Backup_GrantStore_Entry = entry;

      if (grantEntry[1]['expiresAt'] <= now) {
        this.#grants.delete(grantEntry[0]);
      }
    }

    return;
  }
}
