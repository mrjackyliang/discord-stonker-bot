import z from 'zod';

import { getPrincipal } from '../lib/access.js';
import { changeDebugLogging, readDebugLogging } from '../lib/debug-logging.js';
import {
  handleAsync,
  sendValidationError,
} from '../lib/http.js';
import {
  getErrorMessage,
  writeLog,
} from '../lib/logger.js';
import { LIB_REGEX_PATTERN_UNSIGNED_INTEGER } from '../lib/regex.js';
import { listRuntimeLogs } from '../lib/runtime-log-store.js';

import type {
  Routes_Logs_ReadFilters_Filters,
  Routes_Logs_ReadFilters_Query,
  Routes_Logs_ReadFilters_Response,
  Routes_Logs_ReadFilters_Returns,
  Routes_Logs_Runner_Access,
  Routes_Logs_Runner_Constructor_Access,
  Routes_Logs_Runner_Constructor_Context,
  Routes_Logs_Runner_Context,
  Routes_Logs_Runner_Register_App,
  Routes_Logs_Runner_Register_Returns,
  Routes_Logs_Runner_RouteDiagnostics_Request,
  Routes_Logs_Runner_RouteDiagnostics_Response,
  Routes_Logs_Runner_RouteDiagnostics_Returns,
  Routes_Logs_Runner_RouteList_Filters,
  Routes_Logs_Runner_RouteList_Items,
  Routes_Logs_Runner_RouteList_LastItem,
  Routes_Logs_Runner_RouteList_Request,
  Routes_Logs_Runner_RouteList_Response,
  Routes_Logs_Runner_RouteList_Returns,
  Routes_Logs_Runner_RouteStream_Closed,
  Routes_Logs_Runner_RouteStream_Cursor,
  Routes_Logs_Runner_RouteStream_Filters,
  Routes_Logs_Runner_RouteStream_KeepAliveTimer,
  Routes_Logs_Runner_RouteStream_LastEventId,
  Routes_Logs_Runner_RouteStream_Polling,
  Routes_Logs_Runner_RouteStream_PollTimer,
  Routes_Logs_Runner_RouteStream_Request,
  Routes_Logs_Runner_RouteStream_Response,
  Routes_Logs_Runner_RouteStream_Returns,
  Routes_Logs_Runner_RouteUpdateDiagnostics_Body,
  Routes_Logs_Runner_RouteUpdateDiagnostics_Principal,
  Routes_Logs_Runner_RouteUpdateDiagnostics_Request,
  Routes_Logs_Runner_RouteUpdateDiagnostics_Response,
  Routes_Logs_Runner_RouteUpdateDiagnostics_Returns,
  Routes_Logs_StreamKeepAliveMilliseconds,
  Routes_Logs_StreamPollMilliseconds,
} from '../types/routes/logs.d.ts';

/**
 * Logs - Stream Poll Milliseconds.
 *
 * Checks for new entries once a second while a browser follows the live log.
 * The three processes write their logs to the database, so the stream reads it from there.
 *
 * @since 4.0.0
 */
const STREAM_POLL_MILLISECONDS: Routes_Logs_StreamPollMilliseconds = 1_000;

/**
 * Logs - Stream Keep Alive Milliseconds.
 *
 * Sends a comment every fifteen seconds so proxies keep an idle stream open.
 * Browsers ignore the comment.
 *
 * @since 4.0.0
 */
const STREAM_KEEP_ALIVE_MILLISECONDS: Routes_Logs_StreamKeepAliveMilliseconds = 15_000;

/**
 * Logs - Diagnostics Schema.
 *
 * Reads the Debug logging switch from a change request.
 * Nothing else may be sent with it.
 *
 * @since UNRELEASED
 */
const diagnosticsSchema = z.object({
  debugLogging: z.boolean({ error: 'Choose on or off.' }),
}).strict();

/**
 * Logs - Query Schema.
 *
 * Reads the process, cursor, minimum level, and search text from the query string.
 * Missing filters fall back to the bot's newest entries at every level.
 *
 * @since 4.0.0
 */
const querySchema = z.object({
  after: z.string().regex(LIB_REGEX_PATTERN_UNSIGNED_INTEGER, 'Use a log entry number.').max(19, 'Use a log entry number.').optional(),
  component: z.enum([
    'bot',
    'web',
    'worker',
  ], { error: 'Choose bot, web, or worker.' }).default('bot'),
  level: z.enum([
    'debug',
    'error',
    'info',
    'warn',
  ], { error: 'Choose debug, info, warn, or error.' }).default('debug'),
  limit: z.coerce.number({ error: 'Use a number from 1 to 500.' }).int('Use a number from 1 to 500.').min(1, 'Use a number from 1 to 500.').max(500, 'Use a number from 1 to 500.').default(200),
  q: z.string().trim().max(200, 'Use 200 characters or fewer.').default(''),
}).strict();

/**
 * Logs - Read Filters.
 *
 * Validates the query string into log store filters.
 * An invalid filter returns undefined after the error is sent.
 *
 * @param {Routes_Logs_ReadFilters_Query}    query    - Query.
 * @param {Routes_Logs_ReadFilters_Response} response - Response.
 *
 * @returns {Routes_Logs_ReadFilters_Returns}
 *
 * @since 4.0.0
 */
function readFilters(query: Routes_Logs_ReadFilters_Query, response: Routes_Logs_ReadFilters_Response): Routes_Logs_ReadFilters_Returns {
  const filters: Routes_Logs_ReadFilters_Filters = querySchema.safeParse(query);

  if (filters.success === false) {
    sendValidationError(response, 422, filters.error, 'Check the log filters.');

    return undefined;
  }

  return {
    after: filters.data['after'],
    component: filters.data['component'],
    limit: filters.data['limit'],
    minimumLevel: filters.data['level'],
    search: filters.data['q'],
  };
}

/**
 * Logs.
 *
 * Lists and streams the runtime logs of the bot, web, and worker processes.
 * Any signed-in role can read them; tokens need the logs:read scope.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Logs - Access.
   *
   * Accepts a browser session or a token with the logs:read scope.
   * Reading logs never changes anything, so no CSRF header is needed.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Logs_Runner_Access;

  /**
   * Logs - Context.
   *
   * Supplies the database pool the processes write their logs to.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Logs_Runner_Context;

  /**
   * Logs - Constructor.
   *
   * Binds the log routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Logs_Runner_Constructor_Context} context - Context.
   * @param {Routes_Logs_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Logs_Runner_Constructor_Context, access: Routes_Logs_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Logs - Register.
   *
   * Installs the list and the live stream.
   * Both take the same filters.
   *
   * @param {Routes_Logs_Runner_Register_App} app - App.
   *
   * @returns {Routes_Logs_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Logs_Runner_Register_App): Routes_Logs_Runner_Register_Returns {
    app.get('/api/v1/logs', this.#access.requireAccess({
      mutation: false,
      scope: 'logs:read',
    }), handleAsync(this['routeList'].bind(this)));

    app.get('/api/v1/logs/stream', this.#access.requireAccess({
      mutation: false,
      scope: 'logs:read',
    }), handleAsync(this['routeStream'].bind(this)));

    app.get('/api/v1/diagnostics', this.#access.requireAccess({
      mutation: false,
      scope: 'logs:read',
    }), handleAsync(this['routeDiagnostics'].bind(this)));

    app.put('/api/v1/diagnostics', this.#access.requireSession(true), this.#access.requirePermission('bot:control'), handleAsync(this['routeUpdateDiagnostics'].bind(this)));

    return;
  }

  /**
   * Logs - Route Diagnostics.
   *
   * Answers whether Debug logging is on.
   * Anyone who can read the logs can see it.
   *
   * @param {Routes_Logs_Runner_RouteDiagnostics_Request}  _request - Request.
   * @param {Routes_Logs_Runner_RouteDiagnostics_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Logs_Runner_RouteDiagnostics_Returns}
   *
   * @since UNRELEASED
   */
  private async routeDiagnostics(_request: Routes_Logs_Runner_RouteDiagnostics_Request, response: Routes_Logs_Runner_RouteDiagnostics_Response): Routes_Logs_Runner_RouteDiagnostics_Returns {
    response.json({
      debugLogging: await readDebugLogging(this.#context['pool']),
    });

    return;
  }

  /**
   * Logs - Route List.
   *
   * Answers one page of log entries with a cursor for the next request.
   * Without a cursor it returns the newest entries, oldest first.
   *
   * @param {Routes_Logs_Runner_RouteList_Request}  request  - Request.
   * @param {Routes_Logs_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Logs_Runner_RouteList_Returns}
   *
   * @since 4.0.0
   */
  private async routeList(request: Routes_Logs_Runner_RouteList_Request, response: Routes_Logs_Runner_RouteList_Response): Routes_Logs_Runner_RouteList_Returns {
    const filters: Routes_Logs_Runner_RouteList_Filters = readFilters(request.query, response);

    if (filters === undefined) {
      return;
    }

    const items: Routes_Logs_Runner_RouteList_Items = await listRuntimeLogs(this.#context['pool'], filters);
    const lastItem: Routes_Logs_Runner_RouteList_LastItem = items.at(-1);

    response.json({
      cursor: (lastItem === undefined) ? (filters['after'] ?? null) : lastItem['id'],
      items,
    });

    return;
  }

  /**
   * Logs - Route Stream.
   *
   * Sends new log entries as server-sent events while the browser stays connected.
   * Each entry is one log event; a failed read ends the stream so the browser reconnects.
   *
   * @param {Routes_Logs_Runner_RouteStream_Request}  request  - Request.
   * @param {Routes_Logs_Runner_RouteStream_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Logs_Runner_RouteStream_Returns}
   *
   * @since 4.0.0
   */
  private async routeStream(request: Routes_Logs_Runner_RouteStream_Request, response: Routes_Logs_Runner_RouteStream_Response): Routes_Logs_Runner_RouteStream_Returns {
    const filters: Routes_Logs_Runner_RouteStream_Filters = readFilters(request.query, response);

    if (filters === undefined) {
      return;
    }

    const lastEventId: Routes_Logs_Runner_RouteStream_LastEventId = request.get('Last-Event-ID');
    let cursor: Routes_Logs_Runner_RouteStream_Cursor = (lastEventId !== undefined && LIB_REGEX_PATTERN_UNSIGNED_INTEGER.test(lastEventId) === true) ? lastEventId : filters['after'];
    let closed: Routes_Logs_Runner_RouteStream_Closed = false;
    let polling: Routes_Logs_Runner_RouteStream_Polling = false;

    if (cursor === undefined) {
      const latest: Routes_Logs_Runner_RouteList_Items = await listRuntimeLogs(this.#context['pool'], {
        ...filters,
        limit: 1,
      });
      const lastItem: Routes_Logs_Runner_RouteList_LastItem = latest.at(-1);

      cursor = (lastItem === undefined) ? '0' : lastItem['id'];
    }

    response.status(200).set({
      'Cache-Control': 'no-store',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
      'X-Accel-Buffering': 'no',
    });

    response.flushHeaders();

    response.write('retry: 3000\n\n');

    const pollTimer: Routes_Logs_Runner_RouteStream_PollTimer = setInterval(() => {
      if (closed === true || polling === true) {
        return;
      }

      polling = true;

      void listRuntimeLogs(this.#context['pool'], {
        ...filters,
        after: cursor,
      }).then((items) => {
        for (const item of items) {
          response.write([
            `id: ${item['id']}`,
            'event: log',
            `data: ${JSON.stringify(item)}`,
            '',
            '',
          ].join('\n'));

          cursor = item['id'];
        }

        polling = false;

        return;
      }).catch((error) => {
        writeLog('warn', 'web', 'log_stream_failed', {
          error: getErrorMessage(error),
        });

        response.end();

        return;
      });

      return;
    }, STREAM_POLL_MILLISECONDS);
    const keepAliveTimer: Routes_Logs_Runner_RouteStream_KeepAliveTimer = setInterval(() => {
      response.write(': keep-alive\n\n');

      return;
    }, STREAM_KEEP_ALIVE_MILLISECONDS);

    request.on('close', () => {
      closed = true;

      clearInterval(pollTimer);

      clearInterval(keepAliveTimer);

      return;
    });

    return;
  }

  /**
   * Logs - Route Update Diagnostics.
   *
   * Turns Debug logging on or off for the bot, the control panel, and the worker. The
   * control panel changes at once, and the other two within a few seconds.
   *
   * @param {Routes_Logs_Runner_RouteUpdateDiagnostics_Request}  request  - Request.
   * @param {Routes_Logs_Runner_RouteUpdateDiagnostics_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Logs_Runner_RouteUpdateDiagnostics_Returns}
   *
   * @since UNRELEASED
   */
  private async routeUpdateDiagnostics(request: Routes_Logs_Runner_RouteUpdateDiagnostics_Request, response: Routes_Logs_Runner_RouteUpdateDiagnostics_Response): Routes_Logs_Runner_RouteUpdateDiagnostics_Returns {
    const body: Routes_Logs_Runner_RouteUpdateDiagnostics_Body = diagnosticsSchema.safeParse(request.body);

    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose on or off.');

      return;
    }

    const principal: Routes_Logs_Runner_RouteUpdateDiagnostics_Principal = getPrincipal(response);

    await changeDebugLogging(this.#context['pool'], 'web', body.data['debugLogging'], {
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json({
      debugLogging: body.data['debugLogging'],
    });

    return;
  }
}
