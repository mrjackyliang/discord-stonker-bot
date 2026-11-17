import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { writeLog } from './logger.js';

/**
 * Logger - Plain Container Output.
 *
 * Keeps application output aligned with Nova's timestamp, level, component,
 * and message contract without exposing JSON records or multiline entries.
 *
 * @since 4.2.0
 */
describe('plain container output', () => {
  afterEach(() => {
    vi.restoreAllMocks();

    vi.useRealTimers();

    return;
  });

  it('writes informational facts to standard output', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2026-01-15T18:42:07.000Z'));

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    writeLog('info', 'bot', 'gateway_ready', {
      generation: 3,
      message: 'Connected',
    });

    expect(process.stdout.write).toHaveBeenCalledWith('2026-01-15T18:42:07.000Z INFO bot: gateway_ready generation=3 message=Connected\n');

    return;
  });

  it('writes warnings to standard error as one plain line', () => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2026-01-15T18:42:07.000Z'));

    vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    writeLog('warn', 'migration', 'credential_key_replaced', {
      message: [
        'First line',
        'second line',
      ].join('\n'),
    });

    expect(process.stderr.write).toHaveBeenCalledWith('2026-01-15T18:42:07.000Z WARN migration: credential_key_replaced message=First line second line\n');

    return;
  });

  return;
});
