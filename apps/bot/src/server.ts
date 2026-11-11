import express from 'express';
import rateLimit from 'express-rate-limit';

import { Runner as Access } from './lib/access.js';
import { Runner as Attempts } from './lib/attempts.js';
import {
  getClientLimitKey,
  isTrustedProxyAddress,
  sendError,
} from './lib/http.js';
import {
  getErrorMessage,
  writeLog,
} from './lib/logger.js';
import { notifySignInLocked } from './lib/notifier.js';
import { Runner as Auth } from './routes/auth.js';
import { Runner as Backup } from './routes/backup.js';
import { Runner as Bot } from './routes/bot.js';
import { Runner as Features } from './routes/features.js';
import { Runner as Health } from './routes/health.js';
import { Runner as Invite } from './routes/invite.js';
import { Runner as Logs } from './routes/logs.js';
import { Runner as Notifications } from './routes/notifications.js';
import { Runner as Security } from './routes/security.js';
import { Runner as Servers } from './routes/servers.js';
import { Runner as Tokens } from './routes/tokens.js';
import { Runner as Users } from './routes/users.js';
import { Runner as Web } from './routes/web.js';
import { Runner as Webhooks } from './routes/webhooks.js';

import type {
  Server_Runner_AddMiddleware_ApiLimiter,
  Server_Runner_AddMiddleware_LargeJsonParser,
  Server_Runner_AddMiddleware_Returns,
  Server_Runner_AddMiddleware_SmallJsonParser,
  Server_Runner_AddMiddleware_WebhookBodyParser,
  Server_Runner_App,
  Server_Runner_BaseHeaders_Next,
  Server_Runner_BaseHeaders_Request,
  Server_Runner_BaseHeaders_Response,
  Server_Runner_BaseHeaders_Returns,
  Server_Runner_Constructor_Context,
  Server_Runner_Context,
  Server_Runner_GetApplication_Returns,
  Server_Runner_HandleError_Error,
  Server_Runner_HandleError_Next,
  Server_Runner_HandleError_Request,
  Server_Runner_HandleError_Response,
  Server_Runner_HandleError_Returns,
  Server_Runner_HandleError_Type,
  Server_Runner_HandleNotFound_Request,
  Server_Runner_HandleNotFound_Response,
  Server_Runner_HandleNotFound_Returns,
  Server_Runner_LargeBodyPaths,
  Server_Runner_RegisterRoutes_Access,
  Server_Runner_RegisterRoutes_Attempts,
  Server_Runner_RegisterRoutes_Returns,
} from './types/server.d.ts';

/**
 * Server - Large Body Paths.
 *
 * Lists the API routes whose JSON bodies may reach 2 MB: feature saves and imports.
 * Every other JSON body stays under 64 KB.
 *
 * @since 4.0.0
 */
const largeBodyPaths: Server_Runner_LargeBodyPaths = [
  '/api/v1/servers/:serverId/features/:featureKey',
  '/api/v1/backup/imports/preview',
  '/api/v1/backup/imports',
];

/**
 * Server.
 *
 * Assembles the Express app for the control panel, its API, and the public pages.
 * Process startup stays in web.ts so tests can drive the whole pipeline on their own port.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Server - App.
   *
   * Holds the Express app that serves the control panel, the API, and the public pages.
   * Middleware is attached before any route module registers.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #app: Server_Runner_App;

  /**
   * Server - Context.
   *
   * Carries the runtime configuration, database pool, and credential key to route modules.
   * One context lives for the whole process.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Server_Runner_Context;

  /**
   * Server - Constructor.
   *
   * Assembles middleware and routes without listening.
   * Tests pass their own pool and web root.
   *
   * @param {Server_Runner_Constructor_Context} context - Context.
   *
   * @since 4.0.0
   */
  public constructor(context: Server_Runner_Constructor_Context) {
    this.#app = express();
    this.#context = context;

    this.addMiddleware();

    this.registerRoutes();

    return;
  }

  /**
   * Server - Get Application.
   *
   * Exposes the assembled Express app to the process entry point and to tests.
   * The app is fully wired when the constructor returns.
   *
   * @returns {Server_Runner_GetApplication_Returns}
   *
   * @since 4.0.0
   */
  public getApplication(): Server_Runner_GetApplication_Returns {
    return this.#app;
  }

  /**
   * Server - Add Middleware.
   *
   * Trusts forwarded headers only from private proxies, parses JSON, and limits the API.
   * Base response headers keep answers out of caches and content sniffing.
   *
   * @private
   *
   * @returns {Server_Runner_AddMiddleware_Returns}
   *
   * @since 4.0.0
   */
  private addMiddleware(): Server_Runner_AddMiddleware_Returns {
    const apiLimiter: Server_Runner_AddMiddleware_ApiLimiter = rateLimit({
      handler: (_request, response) => {
        sendError(response, 429, 'rate_limited', 'Too many requests. Wait a minute and try again.');

        return;
      },
      keyGenerator: (request) => getClientLimitKey(request),
      legacyHeaders: false,
      limit: 300,
      standardHeaders: true,
      windowMs: 60 * 1000,
    });
    const largeJsonParser: Server_Runner_AddMiddleware_LargeJsonParser = express.json({
      limit: '2mb',
    });
    const smallJsonParser: Server_Runner_AddMiddleware_SmallJsonParser = express.json({
      limit: '64kb',
    });
    const webhookBodyParser: Server_Runner_AddMiddleware_WebhookBodyParser = express.raw({
      limit: '128kb',
      type: () => true,
    });

    this.#app.disable('x-powered-by');

    this.#app.set('trust proxy', isTrustedProxyAddress);

    this.#app.use(this['baseHeaders'].bind(this));

    this.#app.use('/webhooks', webhookBodyParser);

    this.#app.use(largeBodyPaths, largeJsonParser);

    this.#app.use(smallJsonParser);

    this.#app.use('/api/v1', apiLimiter);

    return;
  }

  /**
   * Server - Base Headers.
   *
   * Marks every response as uncacheable, unsniffable, and without a referrer.
   * Built control panel assets later replace the cache header with their own lifetime.
   *
   * @param {Server_Runner_BaseHeaders_Request}  _request - Request.
   * @param {Server_Runner_BaseHeaders_Response} response - Response.
   * @param {Server_Runner_BaseHeaders_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Server_Runner_BaseHeaders_Returns}
   *
   * @since 4.0.0
   */
  private baseHeaders(_request: Server_Runner_BaseHeaders_Request, response: Server_Runner_BaseHeaders_Response, next: Server_Runner_BaseHeaders_Next): Server_Runner_BaseHeaders_Returns {
    response.set({
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
    });

    next();

    return;
  }

  /**
   * Server - Handle Error.
   *
   * Turns body-parser and unexpected failures into the shared error envelope.
   * Unexpected causes are logged and never returned to the client.
   *
   * @param {Server_Runner_HandleError_Error}    error    - Error.
   * @param {Server_Runner_HandleError_Request}  request  - Request.
   * @param {Server_Runner_HandleError_Response} response - Response.
   * @param {Server_Runner_HandleError_Next}     _next    - Next.
   *
   * @private
   *
   * @returns {Server_Runner_HandleError_Returns}
   *
   * @since 4.0.0
   */
  private handleError(error: Server_Runner_HandleError_Error, request: Server_Runner_HandleError_Request, response: Server_Runner_HandleError_Response, _next: Server_Runner_HandleError_Next): Server_Runner_HandleError_Returns {
    const type: Server_Runner_HandleError_Type = (typeof error === 'object' && error !== null) ? Reflect.get(error, 'type') : undefined;

    if (response.headersSent === true) {
      return;
    }

    if (type === 'entity.parse.failed') {
      sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

      return;
    }

    if (type === 'entity.too.large') {
      sendError(response, 413, 'payload_too_large', 'The request body is too large.');

      return;
    }

    if (type === 'charset.unsupported' || type === 'encoding.unsupported') {
      sendError(response, 415, 'unsupported_encoding', 'Send the request body as UTF-8 JSON.');

      return;
    }

    writeLog('error', 'web', 'request_failed', {
      error: getErrorMessage(error),
      method: request.method,
      path: request.path,
    });

    sendError(response, 500, 'internal_error', 'Something went wrong. Try again.');

    return;
  }

  /**
   * Server - Handle Not Found.
   *
   * Answers every unmatched path with the shared error envelope.
   * Control panel pages never reach it because the web routes answer them first.
   *
   * @param {Server_Runner_HandleNotFound_Request}  _request - Request.
   * @param {Server_Runner_HandleNotFound_Response} response - Response.
   *
   * @private
   *
   * @returns {Server_Runner_HandleNotFound_Returns}
   *
   * @since 4.0.0
   */
  private handleNotFound(_request: Server_Runner_HandleNotFound_Request, response: Server_Runner_HandleNotFound_Response): Server_Runner_HandleNotFound_Returns {
    sendError(response, 404, 'not_found', 'No route matches this request.');

    return;
  }

  /**
   * Server - Register Routes.
   *
   * Registers health checks and public pages first, then the API, then the control panel.
   * The control panel goes last because it answers every remaining page path.
   *
   * @private
   *
   * @returns {Server_Runner_RegisterRoutes_Returns}
   *
   * @since 4.0.0
   */
  private registerRoutes(): Server_Runner_RegisterRoutes_Returns {
    const access: Server_Runner_RegisterRoutes_Access = new Access(this.#context['pool']);
    const attempts: Server_Runner_RegisterRoutes_Attempts = new Attempts((key) => {
      void notifySignInLocked(this.#context['pool'], key).catch((error) => {
        writeLog('error', 'web', 'notification_queue_failed', {
          error: getErrorMessage(error),
        });

        return;
      });

      return;
    });

    new Health(this.#context).register(this.#app);

    new Webhooks(this.#context).register(this.#app);

    new Invite(this.#context, access).register(this.#app);

    new Auth(this.#context, access, attempts).register(this.#app);

    new Backup(this.#context, access, attempts).register(this.#app);

    new Security(this.#context, access, attempts).register(this.#app);

    new Tokens(this.#context, access).register(this.#app);

    new Notifications(this.#context, access).register(this.#app);

    new Users(this.#context, access).register(this.#app);

    new Servers(this.#context, access).register(this.#app);

    new Features(this.#context, access).register(this.#app);

    new Bot(this.#context, access).register(this.#app);

    new Logs(this.#context, access).register(this.#app);

    new Web(this.#context).register(this.#app);

    this.#app.use(this['handleNotFound'].bind(this));

    this.#app.use(this['handleError'].bind(this));

    return;
  }
}
