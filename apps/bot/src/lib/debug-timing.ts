import { Events, RESTEvents } from 'discord.js';

import {
  getErrorMessage,
  isDebugLogging,
  writeLog,
} from './logger.js';

import type {
  Lib_DebugTiming_DescribeStatement_ConfigText,
  Lib_DebugTiming_DescribeStatement_Input,
  Lib_DebugTiming_DescribeStatement_Returns,
  Lib_DebugTiming_DescribeStatement_Text,
  Lib_DebugTiming_SlowHandlerMilliseconds,
  Lib_DebugTiming_SlowQueryMilliseconds,
  Lib_DebugTiming_TimedPool_Component,
  Lib_DebugTiming_TimedPool_Connected,
  Lib_DebugTiming_TimedPool_Method,
  Lib_DebugTiming_TimedPool_PendingClient,
  Lib_DebugTiming_TimedPool_Returns,
  Lib_DebugTiming_TimedPool_StartedAt,
  Lib_DebugTiming_TimedPool_Statement,
  Lib_DebugTiming_TimedPool_Target,
  Lib_DebugTiming_TimedPool_Value,
  Lib_DebugTiming_TimeFeatureHandler_Elapsed,
  Lib_DebugTiming_TimeFeatureHandler_Event,
  Lib_DebugTiming_TimeFeatureHandler_GuildIdentifier,
  Lib_DebugTiming_TimeFeatureHandler_Module,
  Lib_DebugTiming_TimeFeatureHandler_Returns,
  Lib_DebugTiming_TimeFeatureHandler_Run,
  Lib_DebugTiming_TimeFeatureHandler_StartedAt,
  Lib_DebugTiming_TimeQuery_Component,
  Lib_DebugTiming_TimeQuery_Elapsed,
  Lib_DebugTiming_TimeQuery_Pending,
  Lib_DebugTiming_TimeQuery_Result,
  Lib_DebugTiming_TimeQuery_Returns,
  Lib_DebugTiming_TimeQuery_StartedAt,
  Lib_DebugTiming_TimeQuery_Statement,
  Lib_DebugTiming_WatchDiscordDebug_AttachedAt,
  Lib_DebugTiming_WatchDiscordDebug_Client,
  Lib_DebugTiming_WatchDiscordDebug_Context,
  Lib_DebugTiming_WatchDiscordDebug_DownSince,
  Lib_DebugTiming_WatchDiscordDebug_DroppedAt,
  Lib_DebugTiming_WatchDiscordDebug_MarkDown,
  Lib_DebugTiming_WatchDiscordDebug_Recovered,
  Lib_DebugTiming_WatchDiscordDebug_Returns,
  Lib_DebugTiming_WatchRestRateLimits_Component,
  Lib_DebugTiming_WatchRestRateLimits_Rest,
  Lib_DebugTiming_WatchRestRateLimits_Returns,
} from '../types/lib/debug-timing.d.ts';

/**
 * Debug Timing - Slow Query Milliseconds.
 *
 * How long a database query has to take before Debug logging notes it.
 * Quick queries stay out of the log so the slow ones stand out.
 *
 * @since UNRELEASED
 */
const SLOW_QUERY_MILLISECONDS: Lib_DebugTiming_SlowQueryMilliseconds = 250;

/**
 * Debug Timing - Slow Handler Milliseconds.
 *
 * How long a feature handler has to take before Debug logging notes it.
 * Most handlers finish well inside a second.
 *
 * @since UNRELEASED
 */
const SLOW_HANDLER_MILLISECONDS: Lib_DebugTiming_SlowHandlerMilliseconds = 1_000;

/**
 * Debug Timing - Describe Statement.
 *
 * Names a query by the start of its SQL text. Values travel separately and are never
 * logged, so a secret in a query parameter stays out of the log.
 *
 * @param {Lib_DebugTiming_DescribeStatement_Input} input - Input.
 *
 * @returns {Lib_DebugTiming_DescribeStatement_Returns}
 *
 * @since UNRELEASED
 */
function describeStatement(input: Lib_DebugTiming_DescribeStatement_Input): Lib_DebugTiming_DescribeStatement_Returns {
  let text: Lib_DebugTiming_DescribeStatement_Text = '';

  if (typeof input === 'string') {
    text = input;
  } else if (typeof input === 'object' && input !== null) {
    const configText: Lib_DebugTiming_DescribeStatement_ConfigText = Reflect.get(input, 'text');

    if (typeof configText === 'string') {
      text = configText;
    }
  }

  return text.trim().slice(0, 120);
}

/**
 * Debug Timing - Time Query.
 *
 * Waits for one query, then notes it when it took a quarter second or more, whether
 * it worked or failed. The query's own answer or error is passed on unchanged.
 *
 * @param {Lib_DebugTiming_TimeQuery_Component} component - Component.
 * @param {Lib_DebugTiming_TimeQuery_Statement} statement - Statement.
 * @param {Lib_DebugTiming_TimeQuery_StartedAt} startedAt - Started at.
 * @param {Lib_DebugTiming_TimeQuery_Result}    result    - Result.
 *
 * @returns {Lib_DebugTiming_TimeQuery_Returns}
 *
 * @since UNRELEASED
 */
function timeQuery(component: Lib_DebugTiming_TimeQuery_Component, statement: Lib_DebugTiming_TimeQuery_Statement, startedAt: Lib_DebugTiming_TimeQuery_StartedAt, result: Lib_DebugTiming_TimeQuery_Result): Lib_DebugTiming_TimeQuery_Returns {
  if ((result instanceof Promise) === false) {
    return result;
  }

  return (result as Lib_DebugTiming_TimeQuery_Pending).finally(() => {
    const elapsed: Lib_DebugTiming_TimeQuery_Elapsed = Date.now() - startedAt;

    if (elapsed >= SLOW_QUERY_MILLISECONDS) {
      writeLog('debug', component, 'database_query_slow', {
        elapsedMs: elapsed,
        statement,
      });
    }

    return;
  });
}

/**
 * Debug Timing - Time Feature Handler.
 *
 * Runs one feature's handler for a Discord event, and while Debug logging is on, notes
 * it when it takes a second or more or fails. Its answer or error is passed on unchanged.
 *
 * @param {Lib_DebugTiming_TimeFeatureHandler_Module}          featureModule   - Feature module.
 * @param {Lib_DebugTiming_TimeFeatureHandler_Event}           event           - Event.
 * @param {Lib_DebugTiming_TimeFeatureHandler_GuildIdentifier} guildIdentifier - Guild identifier.
 * @param {Lib_DebugTiming_TimeFeatureHandler_Run}             run             - Run.
 *
 * @returns {Lib_DebugTiming_TimeFeatureHandler_Returns}
 *
 * @since UNRELEASED
 */
export async function timeFeatureHandler<Result>(
  featureModule: Lib_DebugTiming_TimeFeatureHandler_Module,
  event: Lib_DebugTiming_TimeFeatureHandler_Event,
  guildIdentifier: Lib_DebugTiming_TimeFeatureHandler_GuildIdentifier,
  run: Lib_DebugTiming_TimeFeatureHandler_Run<Result>,
): Lib_DebugTiming_TimeFeatureHandler_Returns<Result> {
  if (isDebugLogging() === false) {
    return run();
  }

  const startedAt: Lib_DebugTiming_TimeFeatureHandler_StartedAt = Date.now();

  try {
    const result: Result = await run();
    const elapsed: Lib_DebugTiming_TimeFeatureHandler_Elapsed = Date.now() - startedAt;

    if (elapsed >= SLOW_HANDLER_MILLISECONDS) {
      writeLog('debug', 'bot', 'feature_handler_slow', {
        elapsedMs: elapsed,
        event,
        guildIdentifier,
        module: featureModule,
      });
    }

    return result;
  } catch (error) {
    writeLog('debug', 'bot', 'feature_handler_failed', {
      elapsedMs: Date.now() - startedAt,
      error: getErrorMessage(error),
      event,
      guildIdentifier,
      module: featureModule,
    });

    throw error;
  }
}

/**
 * Debug Timing - Timed Pool.
 *
 * Wraps a database pool, and each client it hands out, so queries that take a quarter
 * second or more are noted while Debug logging is on. Every call runs on the pool itself.
 *
 * @param {Lib_DebugTiming_TimedPool_Target}    pool      - Pool.
 * @param {Lib_DebugTiming_TimedPool_Component} component - Component.
 *
 * @returns {Lib_DebugTiming_TimedPool_Returns}
 *
 * @since UNRELEASED
 */
export function timedPool<Target extends object>(pool: Lib_DebugTiming_TimedPool_Target<Target>, component: Lib_DebugTiming_TimedPool_Component): Lib_DebugTiming_TimedPool_Returns<Target> {
  return new Proxy(pool, {
    get: (target, property) => {
      const value: Lib_DebugTiming_TimedPool_Value = Reflect.get(target, property);

      if (typeof value !== 'function') {
        return value;
      }

      if (property === 'query') {
        return new Proxy(value as Lib_DebugTiming_TimedPool_Method, {
          apply: (method, _thisArgument, methodArguments) => {
            if (isDebugLogging() === false) {
              return Reflect.apply(method, target, methodArguments);
            }

            const statement: Lib_DebugTiming_TimedPool_Statement = describeStatement(methodArguments[0]);

            // The log's own inserts stay out, so a slow database can't feed itself entries.
            if (statement.startsWith('INSERT INTO runtime_logs') === true) {
              return Reflect.apply(method, target, methodArguments);
            }

            const startedAt: Lib_DebugTiming_TimedPool_StartedAt = Date.now();

            return timeQuery(component, statement, startedAt, Reflect.apply(method, target, methodArguments));
          },
        });
      }

      if (property === 'connect') {
        return new Proxy(value as Lib_DebugTiming_TimedPool_Method, {
          apply: (method, _thisArgument, methodArguments) => {
            const connected: Lib_DebugTiming_TimedPool_Connected = Reflect.apply(method, target, methodArguments);

            if ((connected instanceof Promise) === false) {
              return connected;
            }

            return (connected as Lib_DebugTiming_TimedPool_PendingClient).then((client) => timedPool(client, component));
          },
        });
      }

      return value;
    },
  });
}

/**
 * Debug Timing - Watch Discord Debug.
 *
 * While Debug logging is on, notes each Gateway connect, drop, reconnect, and resume
 * with its close code and timing, plus every REST call that hits a rate limit.
 *
 * @param {Lib_DebugTiming_WatchDiscordDebug_Client} client - Client.
 *
 * @returns {Lib_DebugTiming_WatchDiscordDebug_Returns}
 *
 * @since UNRELEASED
 */
export function watchDiscordDebug(client: Lib_DebugTiming_WatchDiscordDebug_Client): Lib_DebugTiming_WatchDiscordDebug_Returns {
  const attachedAt: Lib_DebugTiming_WatchDiscordDebug_AttachedAt = Date.now();
  const downSince: Lib_DebugTiming_WatchDiscordDebug_DownSince = new Map();

  /**
   * Debug Timing - Watch Discord Debug - Mark Down.
   *
   * Remembers when a shard dropped, so its recovery can say how long it was down.
   * A drop that is already being timed keeps its start.
   *
   * @param {number} shardId - Shard id.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const markDown: Lib_DebugTiming_WatchDiscordDebug_MarkDown = (shardId) => {
    if (downSince.has(shardId) === false) {
      downSince.set(shardId, Date.now());
    }

    return;
  };

  /**
   * Debug Timing - Watch Discord Debug - Recovered.
   *
   * Builds the timing for a shard that is up again: how long the first connect took,
   * or how long the shard was down.
   *
   * @param {number} shardId - Shard id.
   *
   * @returns {Shared_LogContext}
   *
   * @since UNRELEASED
   */
  const recovered: Lib_DebugTiming_WatchDiscordDebug_Recovered = (shardId) => {
    const droppedAt: Lib_DebugTiming_WatchDiscordDebug_DroppedAt = downSince.get(shardId);
    const context: Lib_DebugTiming_WatchDiscordDebug_Context = { shardId };

    downSince.delete(shardId);

    if (droppedAt === undefined) {
      Reflect.set(context, 'connectMs', Date.now() - attachedAt);
    } else {
      Reflect.set(context, 'downMs', Date.now() - droppedAt);
    }

    return context;
  };

  client.on(Events.ShardDisconnect, (closeEvent, shardId) => {
    markDown(shardId);

    writeLog('debug', 'bot', 'gateway_shard_disconnected', {
      code: closeEvent['code'],
      shardId,
    });

    return;
  });

  client.on(Events.ShardReconnecting, (shardId) => {
    markDown(shardId);

    writeLog('debug', 'bot', 'gateway_shard_reconnecting', {
      shardId,
    });

    return;
  });

  client.on(Events.ShardReady, (shardId, unavailableGuilds) => {
    writeLog('debug', 'bot', 'gateway_shard_ready', {
      ...recovered(shardId),
      unavailableGuilds: (unavailableGuilds === undefined) ? 0 : unavailableGuilds.size,
    });

    return;
  });

  client.on(Events.ShardResume, (shardId, replayedEvents) => {
    writeLog('debug', 'bot', 'gateway_shard_resumed', {
      ...recovered(shardId),
      replayedEvents,
    });

    return;
  });

  client.on(Events.ShardError, (error, shardId) => {
    writeLog('debug', 'bot', 'gateway_shard_error', {
      error: getErrorMessage(error),
      shardId,
    });

    return;
  });

  watchRestRateLimits(client.rest, 'bot');

  return;
}

/**
 * Debug Timing - Watch Rest Rate Limits.
 *
 * While Debug logging is on, notes each Discord REST call that hits a rate limit, with
 * its route and wait. Routes hide IDs and webhook tokens, and URLs are never logged.
 *
 * @param {Lib_DebugTiming_WatchRestRateLimits_Rest}      rest      - Rest.
 * @param {Lib_DebugTiming_WatchRestRateLimits_Component} component - Component.
 *
 * @returns {Lib_DebugTiming_WatchRestRateLimits_Returns}
 *
 * @since UNRELEASED
 */
export function watchRestRateLimits(rest: Lib_DebugTiming_WatchRestRateLimits_Rest, component: Lib_DebugTiming_WatchRestRateLimits_Component): Lib_DebugTiming_WatchRestRateLimits_Returns {
  rest.on(RESTEvents.RateLimited, (rateLimit) => {
    writeLog('debug', component, 'rest_rate_limited', {
      global: rateLimit['global'],
      limit: rateLimit['limit'],
      method: rateLimit['method'],
      route: rateLimit['route'],
      scope: rateLimit['scope'],
      waitMs: rateLimit['retryAfter'],
    });

    return;
  });

  return;
}
