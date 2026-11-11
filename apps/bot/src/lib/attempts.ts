import type {
  Lib_Attempts_Runner_Constructor_OnLimitReached,
  Lib_Attempts_Runner_Failures,
  Lib_Attempts_Runner_GetRecentFailures_Failures,
  Lib_Attempts_Runner_GetRecentFailures_Key,
  Lib_Attempts_Runner_GetRecentFailures_Now,
  Lib_Attempts_Runner_GetRecentFailures_Returns,
  Lib_Attempts_Runner_GetRetryAfterSeconds_Failures,
  Lib_Attempts_Runner_GetRetryAfterSeconds_Key,
  Lib_Attempts_Runner_GetRetryAfterSeconds_Now,
  Lib_Attempts_Runner_GetRetryAfterSeconds_OldestFailure,
  Lib_Attempts_Runner_GetRetryAfterSeconds_Returns,
  Lib_Attempts_Runner_IsAllowed_Key,
  Lib_Attempts_Runner_IsAllowed_Now,
  Lib_Attempts_Runner_IsAllowed_Returns,
  Lib_Attempts_Runner_Limit,
  Lib_Attempts_Runner_MaximumKeys,
  Lib_Attempts_Runner_OnLimitReached,
  Lib_Attempts_Runner_Prune_Now,
  Lib_Attempts_Runner_Prune_Returns,
  Lib_Attempts_Runner_RecordFailure_Failures,
  Lib_Attempts_Runner_RecordFailure_Key,
  Lib_Attempts_Runner_RecordFailure_Now,
  Lib_Attempts_Runner_RecordFailure_Returns,
  Lib_Attempts_Runner_Reset_Key,
  Lib_Attempts_Runner_Reset_Returns,
  Lib_Attempts_Runner_WindowMilliseconds,
} from '../types/lib/attempts.d.ts';

/**
 * Attempts.
 *
 * Counts failed sign-in attempts per client address inside a sliding window.
 * Password, authenticator, recovery-code, and passkey failures share one count.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Attempts - Limit.
   *
   * Allows ten failures before further attempts from the same address are refused.
   * A successful sign-in clears the count for that address.
   *
   * @private
   *
   * @since 4.0.0
   */
  static readonly #limit: Lib_Attempts_Runner_Limit = 10;

  /**
   * Attempts - Maximum Keys.
   *
   * Caps the number of tracked addresses so a flood of sources cannot exhaust memory.
   * The oldest tracked address is dropped first when the cap is reached.
   *
   * @private
   *
   * @since 4.0.0
   */
  static readonly #maximumKeys: Lib_Attempts_Runner_MaximumKeys = 10_000;

  /**
   * Attempts - Window Milliseconds.
   *
   * Remembers each failure for fifteen minutes.
   * Failures older than the window no longer count toward the limit.
   *
   * @private
   *
   * @since 4.0.0
   */
  static readonly #windowMilliseconds: Lib_Attempts_Runner_WindowMilliseconds = 15 * 60 * 1000;

  /**
   * Attempts - Failures.
   *
   * Maps each attempt key to the times of its recent failures.
   * Counts live in memory, so a restart clears them.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #failures: Lib_Attempts_Runner_Failures;

  /**
   * Attempts - On Limit Reached.
   *
   * Hears about an attempt key the moment it reaches the limit.
   * The notifier uses it for the Sign-in locked alert.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #onLimitReached: Lib_Attempts_Runner_OnLimitReached;

  /**
   * Attempts - Constructor.
   *
   * Starts with no recorded failures.
   * One instance is shared by every sign-in route.
   *
   * @param {Lib_Attempts_Runner_Constructor_OnLimitReached} [onLimitReached] - On limit reached.
   *
   * @since 4.0.0
   */
  public constructor(onLimitReached?: Lib_Attempts_Runner_Constructor_OnLimitReached) {
    this.#failures = new Map();
    this.#onLimitReached = onLimitReached;

    return;
  }

  /**
   * Attempts - Get Retry After Seconds.
   *
   * Reports how long a limited address must wait until its oldest failure expires.
   * The value feeds the Retry-After header on refused attempts.
   *
   * @param {Lib_Attempts_Runner_GetRetryAfterSeconds_Key} key   - Key.
   * @param {Lib_Attempts_Runner_GetRetryAfterSeconds_Now} [now] - Now.
   *
   * @returns {Lib_Attempts_Runner_GetRetryAfterSeconds_Returns}
   *
   * @since 4.0.0
   */
  public getRetryAfterSeconds(key: Lib_Attempts_Runner_GetRetryAfterSeconds_Key, now: Lib_Attempts_Runner_GetRetryAfterSeconds_Now = Date.now()): Lib_Attempts_Runner_GetRetryAfterSeconds_Returns {
    const failures: Lib_Attempts_Runner_GetRetryAfterSeconds_Failures = this.getRecentFailures(key, now);
    const oldestFailure: Lib_Attempts_Runner_GetRetryAfterSeconds_OldestFailure = failures[0];

    if (oldestFailure === undefined) {
      return 0;
    }

    return Math.max(1, Math.ceil((oldestFailure + Runner.#windowMilliseconds - now) / 1000));
  }

  /**
   * Attempts - Is Allowed.
   *
   * Checks whether an address may make another attempt.
   * Addresses with fewer than ten recent failures are allowed.
   *
   * @param {Lib_Attempts_Runner_IsAllowed_Key} key   - Key.
   * @param {Lib_Attempts_Runner_IsAllowed_Now} [now] - Now.
   *
   * @returns {Lib_Attempts_Runner_IsAllowed_Returns}
   *
   * @since 4.0.0
   */
  public isAllowed(key: Lib_Attempts_Runner_IsAllowed_Key, now: Lib_Attempts_Runner_IsAllowed_Now = Date.now()): Lib_Attempts_Runner_IsAllowed_Returns {
    return this.getRecentFailures(key, now).length < Runner.#limit;
  }

  /**
   * Attempts - Record Failure.
   *
   * Adds one failure for an address and drops failures that left the window.
   * The tracked address count stays bounded on every write.
   *
   * @param {Lib_Attempts_Runner_RecordFailure_Key} key   - Key.
   * @param {Lib_Attempts_Runner_RecordFailure_Now} [now] - Now.
   *
   * @returns {Lib_Attempts_Runner_RecordFailure_Returns}
   *
   * @since 4.0.0
   */
  public recordFailure(key: Lib_Attempts_Runner_RecordFailure_Key, now: Lib_Attempts_Runner_RecordFailure_Now = Date.now()): Lib_Attempts_Runner_RecordFailure_Returns {
    const failures: Lib_Attempts_Runner_RecordFailure_Failures = this.getRecentFailures(key, now);

    failures.push(now);

    this.#failures.delete(key);

    this.#failures.set(key, failures);

    this.prune(now);

    if (failures.length === Runner.#limit && this.#onLimitReached !== undefined) {
      this.#onLimitReached(key);
    }

    return;
  }

  /**
   * Attempts - Reset.
   *
   * Clears the failures of an address after it signs in successfully.
   * Later failures start a fresh count.
   *
   * @param {Lib_Attempts_Runner_Reset_Key} key - Key.
   *
   * @returns {Lib_Attempts_Runner_Reset_Returns}
   *
   * @since 4.0.0
   */
  public reset(key: Lib_Attempts_Runner_Reset_Key): Lib_Attempts_Runner_Reset_Returns {
    this.#failures.delete(key);

    return;
  }

  /**
   * Attempts - Get Recent Failures.
   *
   * Returns the failures of an address that are still inside the window.
   * The returned array is a copy that callers may change.
   *
   * @param {Lib_Attempts_Runner_GetRecentFailures_Key} key - Key.
   * @param {Lib_Attempts_Runner_GetRecentFailures_Now} now - Now.
   *
   * @private
   *
   * @returns {Lib_Attempts_Runner_GetRecentFailures_Returns}
   *
   * @since 4.0.0
   */
  private getRecentFailures(key: Lib_Attempts_Runner_GetRecentFailures_Key, now: Lib_Attempts_Runner_GetRecentFailures_Now): Lib_Attempts_Runner_GetRecentFailures_Returns {
    const failures: Lib_Attempts_Runner_GetRecentFailures_Failures = this.#failures.get(key) ?? [];

    return failures.filter((failure) => failure > now - Runner.#windowMilliseconds);
  }

  /**
   * Attempts - Prune.
   *
   * Removes addresses whose failures all expired, then the oldest ones above the cap.
   * Map order follows the last write, so the first keys are the least recent.
   *
   * @param {Lib_Attempts_Runner_Prune_Now} now - Now.
   *
   * @private
   *
   * @returns {Lib_Attempts_Runner_Prune_Returns}
   *
   * @since 4.0.0
   */
  private prune(now: Lib_Attempts_Runner_Prune_Now): Lib_Attempts_Runner_Prune_Returns {
    if (this.#failures.size <= Runner.#maximumKeys) {
      return;
    }

    for (const failureEntry of this.#failures) {
      if (this.getRecentFailures(failureEntry[0], now).length === 0) {
        this.#failures.delete(failureEntry[0]);
      }
    }

    for (const failureEntry of this.#failures) {
      if (this.#failures.size <= Runner.#maximumKeys) {
        break;
      }

      this.#failures.delete(failureEntry[0]);
    }

    return;
  }
}
