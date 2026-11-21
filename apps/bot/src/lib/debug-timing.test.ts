import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Runner as TestChatPlatformClient } from '../tests/support/chat-platform.js';
import { chatPlatformEvents } from './chat-platform/index.js';
import {
  timedPool,
  timeFeatureHandler,
  watchDiscordDebug,
} from './debug-timing.js';
import { setDebugLogging } from './logger.js';

import type {
  Lib_DebugTiming_Test_Client,
  Lib_DebugTiming_Test_FakeClient,
  Lib_DebugTiming_Test_FakePool,
  Lib_DebugTiming_Test_Output,
  Lib_DebugTiming_Test_Query,
  Lib_DebugTiming_Test_QueryFunction,
  Lib_DebugTiming_Test_ReadEntries_Returns,
  Lib_DebugTiming_Test_ReadEntries_Write,
  Lib_DebugTiming_Test_Release,
  Lib_DebugTiming_Test_Write,
} from '../types/lib/debug-timing.d.ts';

/**
 * Debug Timing - Read Entries.
 *
 * Reads back the plain Debug lines written so far without their changing time.
 * The level, process, event, and details remain exact for each assertion.
 *
 * @param {Lib_DebugTiming_Test_ReadEntries_Write} write - Write.
 *
 * @returns {Lib_DebugTiming_Test_ReadEntries_Returns}
 *
 * @since 4.0.0
 */
function readEntries(write: Lib_DebugTiming_Test_ReadEntries_Write): Lib_DebugTiming_Test_ReadEntries_Returns {
  return write.mock.calls
    .map((call) => String(call[0]))
    .filter((line) => line.includes(' DEBUG '))
    .map((line) => line.slice(line.indexOf(' ') + 1).trimEnd());
}

/**
 * Debug Timing - Debug Timing.
 *
 * Covers slow queries, slow and failing feature handlers, Gateway connection
 * changes, and REST rate limits, with nothing written while Debug logging is off.
 *
 * @since 4.0.0
 */
describe('debug timing', () => {
  afterEach(() => {
    setDebugLogging(false);

    vi.restoreAllMocks();

    return;
  });

  it('notes database queries that take a quarter second or more, never their values', async () => {
    const write: Lib_DebugTiming_Test_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const clientQuery: Lib_DebugTiming_Test_Query = vi.fn<Lib_DebugTiming_Test_QueryFunction>(async () => ({ rows: [] }));
    const release: Lib_DebugTiming_Test_Release = vi.fn(() => {
      return;
    });
    const query: Lib_DebugTiming_Test_Query = vi.fn<Lib_DebugTiming_Test_QueryFunction>(async () => ({ rows: [{ id: 1 }] }));
    const pool: Lib_DebugTiming_Test_FakePool = timedPool({
      connect: async () => ({
        query: clientQuery,
        release,
      }),
      query,
    }, 'worker');

    await pool.query('SELECT id FROM jobs WHERE id = $1', ['1']);

    setDebugLogging(true);

    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_100)
      .mockReturnValueOnce(2_000)
      .mockReturnValueOnce(2_400)
      .mockReturnValueOnce(3_000)
      .mockReturnValueOnce(3_300);

    expect(await pool.query('SELECT id FROM jobs WHERE id = $1', ['1'])).toEqual({ rows: [{ id: 1 }] });

    await pool.query('UPDATE panel_users SET password_hash = $1 WHERE id = $2', [
      'fixture-password-hash',
      '7',
    ]);

    await pool.query('INSERT INTO runtime_logs (component, level, event, context, occurred_at) VALUES ($1, $2, $3, $4::jsonb, $5)', [
      'worker',
      'info',
      'job_completed',
      '{}',
      '2026-01-01T00:00:00.000Z',
    ]);

    const client: Lib_DebugTiming_Test_FakeClient = await pool.connect();

    await client.query('BEGIN');

    client.release();

    const output: Lib_DebugTiming_Test_Output = write.mock.calls.map((call) => String(call[0])).join('');

    expect(query).toHaveBeenCalledTimes(4);

    expect(release).toHaveBeenCalledOnce();

    expect(readEntries(write)).toEqual([
      'DEBUG worker: database_query_slow elapsedMs=400 statement=UPDATE panel_users SET password_hash = $1 WHERE id = $2',
      'DEBUG worker: database_query_slow elapsedMs=300 statement=BEGIN',
    ]);

    expect(output).not.toContain('fixture-password-hash');

    return;
  });

  it('notes feature handlers that run slow or fail, and passes their results on', async () => {
    const write: Lib_DebugTiming_Test_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);

    expect(await timeFeatureHandler('message', chatPlatformEvents['MessageCreate'], '111111111111111111', async () => 'quiet while off')).toBe('quiet while off');

    setDebugLogging(true);

    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(10_000)
      .mockReturnValueOnce(11_500)
      .mockReturnValueOnce(20_000)
      .mockReturnValueOnce(20_040)
      .mockReturnValueOnce(30_000)
      .mockReturnValueOnce(30_020);

    expect(await timeFeatureHandler('message', chatPlatformEvents['MessageCreate'], '111111111111111111', async () => 'sent')).toBe('sent');

    expect(await timeFeatureHandler('audit', chatPlatformEvents['GuildMemberAdd'], '111111111111111111', async () => 'quick')).toBe('quick');

    await expect(timeFeatureHandler('scammer', chatPlatformEvents['MessageUpdate'], '111111111111111111', async () => Promise.reject(new Error('Missing Permissions')))).rejects.toThrow('Missing Permissions');

    expect(readEntries(write)).toEqual([
      'DEBUG bot: feature_handler_slow elapsedMs=1500 event=messageCreate guildIdentifier=111111111111111111 module=message',
      'DEBUG bot: feature_handler_failed elapsedMs=20 error=Missing Permissions event=messageUpdate guildIdentifier=111111111111111111 module=scammer',
    ]);

    return;
  });

  it('notes Gateway connects, drops, and resumes, and REST rate limits without tokens', async () => {
    const write: Lib_DebugTiming_Test_Write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
    const client: Lib_DebugTiming_Test_Client = new TestChatPlatformClient();

    setDebugLogging(true);

    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_800)
      .mockReturnValueOnce(5_000)
      .mockReturnValueOnce(5_600);

    watchDiscordDebug(client);

    client.emit(chatPlatformEvents['ShardReady'], 0, undefined);

    client.emit(chatPlatformEvents['ShardDisconnect'], {
      code: 1006,
      reason: '',
      wasClean: false,
    }, 0);

    client.emit(chatPlatformEvents['ShardReconnecting'], 0);

    client.emit(chatPlatformEvents['ShardResume'], 0, 12);

    client.emitRateLimited({
      global: false,
      limit: 5,
      method: 'POST',
      retryAfter: 1250,
      route: '/webhooks/:id/:token',
      scope: 'shared',
    });

    const output: Lib_DebugTiming_Test_Output = write.mock.calls.map((call) => String(call[0])).join('');

    expect(readEntries(write)).toEqual([
      'DEBUG bot: gateway_shard_ready connectMs=800 shardId=0 unavailableGuilds=0',
      'DEBUG bot: gateway_shard_disconnected code=1006 shardId=0',
      'DEBUG bot: gateway_shard_reconnecting shardId=0',
      'DEBUG bot: gateway_shard_resumed downMs=600 replayedEvents=12 shardId=0',
      'DEBUG bot: rest_rate_limited global=false limit=5 method=POST route=/webhooks/:id/:token scope=shared waitMs=1250',
    ]);

    expect(output).not.toContain('fixture-webhook-token');

    await client.destroy();

    return;
  });

  return;
});
