import {
  isDebugLogging,
  setDebugLogging,
  writeLog,
} from './logger.js';

import type {
  Lib_DebugLogging_ApplyDebugLogging_Component,
  Lib_DebugLogging_ApplyDebugLogging_Context,
  Lib_DebugLogging_ApplyDebugLogging_Enabled,
  Lib_DebugLogging_ApplyDebugLogging_Returns,
  Lib_DebugLogging_ChangeDebugLogging_Component,
  Lib_DebugLogging_ChangeDebugLogging_Context,
  Lib_DebugLogging_ChangeDebugLogging_Enabled,
  Lib_DebugLogging_ChangeDebugLogging_Pool,
  Lib_DebugLogging_ChangeDebugLogging_Returns,
  Lib_DebugLogging_FollowDebugLogging_Check,
  Lib_DebugLogging_FollowDebugLogging_Component,
  Lib_DebugLogging_FollowDebugLogging_Pool,
  Lib_DebugLogging_FollowDebugLogging_Returns,
  Lib_DebugLogging_FollowDebugLogging_Seen,
  Lib_DebugLogging_FollowDebugLogging_Timer,
  Lib_DebugLogging_FollowIntervalMilliseconds,
  Lib_DebugLogging_LocalChanges,
  Lib_DebugLogging_ReadDebugLogging_Pool,
  Lib_DebugLogging_ReadDebugLogging_Result,
  Lib_DebugLogging_ReadDebugLogging_Returns,
  Lib_DebugLogging_ReadDebugLogging_Row,
  Lib_DebugLogging_ReadDebugLogging_SavedRow,
} from '../types/lib/debug-logging.d.ts';

/**
 * Debug Logging - Follow Interval Milliseconds.
 *
 * How often each process reads the saved switch.
 * A change made in the control panel reaches the bot and the worker within this time.
 *
 * @since UNRELEASED
 */
const FOLLOW_INTERVAL_MILLISECONDS: Lib_DebugLogging_FollowIntervalMilliseconds = 5_000;

/**
 * Debug Logging - Local Changes.
 *
 * Counts the changes this process saved itself.
 * A check that started before one of them is out of date, so its answer is dropped.
 *
 * @since UNRELEASED
 */
let localChanges: Lib_DebugLogging_LocalChanges = 0;

/**
 * Debug Logging - Apply Debug Logging.
 *
 * Turns debug entries on or off in this process and marks the change in its log, so
 * the log shows where debug entries start and stop. An unchanged switch writes nothing.
 *
 * @param {Lib_DebugLogging_ApplyDebugLogging_Component} component - Component.
 * @param {Lib_DebugLogging_ApplyDebugLogging_Enabled}   enabled   - Enabled.
 * @param {Lib_DebugLogging_ApplyDebugLogging_Context}   context   - Context.
 *
 * @returns {Lib_DebugLogging_ApplyDebugLogging_Returns}
 *
 * @since UNRELEASED
 */
export function applyDebugLogging(
  component: Lib_DebugLogging_ApplyDebugLogging_Component,
  enabled: Lib_DebugLogging_ApplyDebugLogging_Enabled,
  context: Lib_DebugLogging_ApplyDebugLogging_Context = {},
): Lib_DebugLogging_ApplyDebugLogging_Returns {
  if (isDebugLogging() === enabled) {
    return;
  }

  setDebugLogging(enabled);

  writeLog('info', component, (enabled === true) ? 'debug_logging_on' : 'debug_logging_off', context);

  return;
}

/**
 * Debug Logging - Change Debug Logging.
 *
 * Saves the switch for every process and applies it here at once.
 * The bot and the worker follow within a few seconds.
 *
 * @param {Lib_DebugLogging_ChangeDebugLogging_Pool}      pool      - Pool.
 * @param {Lib_DebugLogging_ChangeDebugLogging_Component} component - Component.
 * @param {Lib_DebugLogging_ChangeDebugLogging_Enabled}   enabled   - Enabled.
 * @param {Lib_DebugLogging_ChangeDebugLogging_Context}   context   - Context.
 *
 * @returns {Lib_DebugLogging_ChangeDebugLogging_Returns}
 *
 * @since UNRELEASED
 */
export async function changeDebugLogging(
  pool: Lib_DebugLogging_ChangeDebugLogging_Pool,
  component: Lib_DebugLogging_ChangeDebugLogging_Component,
  enabled: Lib_DebugLogging_ChangeDebugLogging_Enabled,
  context: Lib_DebugLogging_ChangeDebugLogging_Context,
): Lib_DebugLogging_ChangeDebugLogging_Returns {
  await pool.query(
    'INSERT INTO runtime_settings (singleton, debug_logging, updated_at) VALUES (TRUE, $1, NOW()) ON CONFLICT (singleton) DO UPDATE SET debug_logging = EXCLUDED.debug_logging, updated_at = NOW()',
    [enabled],
  );

  localChanges += 1;

  applyDebugLogging(component, enabled, context);

  return;
}

/**
 * Debug Logging - Follow Debug Logging.
 *
 * Applies the saved switch now and checks it every few seconds, so each process follows
 * a change made in the control panel. A failed check keeps the current setting.
 *
 * @param {Lib_DebugLogging_FollowDebugLogging_Pool}      pool      - Pool.
 * @param {Lib_DebugLogging_FollowDebugLogging_Component} component - Component.
 *
 * @returns {Lib_DebugLogging_FollowDebugLogging_Returns}
 *
 * @since UNRELEASED
 */
export function followDebugLogging(
  pool: Lib_DebugLogging_FollowDebugLogging_Pool,
  component: Lib_DebugLogging_FollowDebugLogging_Component,
): Lib_DebugLogging_FollowDebugLogging_Returns {
  /**
   * Debug Logging - Follow Debug Logging - Check.
   *
   * Reads the saved switch once and applies it, unless this process changed it
   * while the read was in flight.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const check: Lib_DebugLogging_FollowDebugLogging_Check = () => {
    const seen: Lib_DebugLogging_FollowDebugLogging_Seen = localChanges;

    void readDebugLogging(pool).then((enabled) => {
      if (seen === localChanges) {
        applyDebugLogging(component, enabled);
      }

      return;
    }).catch(() => {
      return;
    });

    return;
  };

  check();

  const timer: Lib_DebugLogging_FollowDebugLogging_Timer = setInterval(check, FOLLOW_INTERVAL_MILLISECONDS);

  timer.unref();

  return () => {
    clearInterval(timer);

    return;
  };
}

/**
 * Debug Logging - Read Debug Logging.
 *
 * Reads the saved Debug logging switch.
 * A missing row reads as off.
 *
 * @param {Lib_DebugLogging_ReadDebugLogging_Pool} pool - Pool.
 *
 * @returns {Lib_DebugLogging_ReadDebugLogging_Returns}
 *
 * @since UNRELEASED
 */
export async function readDebugLogging(pool: Lib_DebugLogging_ReadDebugLogging_Pool): Lib_DebugLogging_ReadDebugLogging_Returns {
  const result: Lib_DebugLogging_ReadDebugLogging_Result = await pool.query<Lib_DebugLogging_ReadDebugLogging_Row>('SELECT debug_logging FROM runtime_settings WHERE singleton = TRUE');
  const row: Lib_DebugLogging_ReadDebugLogging_SavedRow = result.rows[0];

  return row !== undefined && row['debug_logging'] === true;
}
