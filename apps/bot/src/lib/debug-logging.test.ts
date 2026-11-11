import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { createTestDatabase } from '../tests/support/database.js';
import {
  changeDebugLogging,
  followDebugLogging,
  readDebugLogging,
} from './debug-logging.js';
import { isDebugLogging, setDebugLogging } from './logger.js';

import type {
  Lib_DebugLogging_Test_Lines,
  Lib_DebugLogging_Test_Pool,
  Lib_DebugLogging_Test_Stop,
  Lib_DebugLogging_Test_TestDatabase,
  Lib_DebugLogging_Test_Write,
} from '../types/lib/debug-logging.d.ts';

/**
 * Debug Logging - Debug Logging Switch.
 *
 * Covers the saved switch, the log line that marks each change, and how another
 * process follows a change within a few seconds.
 *
 * @since UNRELEASED
 */
describe('debug logging switch', () => {
  it('starts off, saves each change, and marks each change in the log once', async () => {
    const database: Lib_DebugLogging_Test_TestDatabase = await createTestDatabase();
    const pool: Lib_DebugLogging_Test_Pool = database['pool'];
    const write: Lib_DebugLogging_Test_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    try {
      expect(await readDebugLogging(pool)).toBe(false);

      await changeDebugLogging(pool, 'web', true, {
        userId: '1',
        username: 'owner',
      });

      expect(await readDebugLogging(pool)).toBe(true);

      expect(isDebugLogging()).toBe(true);

      await changeDebugLogging(pool, 'web', true, {
        userId: '1',
        username: 'owner',
      });

      await changeDebugLogging(pool, 'web', false, {
        userId: '1',
        username: 'owner',
      });

      expect(await readDebugLogging(pool)).toBe(false);

      expect(isDebugLogging()).toBe(false);

      const lines: Lib_DebugLogging_Test_Lines = write.mock.calls.map((call) => String(call[0])).filter((line) => line.includes('"event":"debug_logging_'));

      expect(lines).toHaveLength(2);

      expect(lines[0]).toContain('"event":"debug_logging_on"');

      expect(lines[0]).toContain('"username":"owner"');

      expect(lines[1]).toContain('"event":"debug_logging_off"');
    } finally {
      setDebugLogging(false);

      write.mockRestore();

      await pool.end();
    }

    return;
  });

  it('follows a change that another process saved', async () => {
    const database: Lib_DebugLogging_Test_TestDatabase = await createTestDatabase();
    const pool: Lib_DebugLogging_Test_Pool = database['pool'];
    const write: Lib_DebugLogging_Test_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    vi.useFakeTimers({
      toFake: [
        'clearInterval',
        'setInterval',
      ],
    });

    await pool.query('UPDATE runtime_settings SET debug_logging = TRUE WHERE singleton = TRUE');

    const stop: Lib_DebugLogging_Test_Stop = followDebugLogging(pool, 'worker');

    try {
      await vi.waitFor(() => {
        expect(isDebugLogging()).toBe(true);

        return;
      });

      await pool.query('UPDATE runtime_settings SET debug_logging = FALSE WHERE singleton = TRUE');

      vi.advanceTimersByTime(5_000);

      await vi.waitFor(() => {
        expect(isDebugLogging()).toBe(false);

        return;
      });

      const lines: Lib_DebugLogging_Test_Lines = write.mock.calls.map((call) => String(call[0])).filter((line) => line.includes('"event":"debug_logging_'));

      expect(lines).toHaveLength(2);

      expect(lines[0]).toContain('"component":"worker"');

      expect(lines[0]).toContain('"event":"debug_logging_on"');

      expect(lines[1]).toContain('"event":"debug_logging_off"');
    } finally {
      stop();

      vi.useRealTimers();

      setDebugLogging(false);

      write.mockRestore();

      await pool.end();
    }

    return;
  });

  return;
});
