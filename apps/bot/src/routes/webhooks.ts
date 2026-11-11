import { createHash } from 'node:crypto';

import {
  enqueueDurableJob,
  getBotRuntimeControl,
} from '../lib/database.js';
import { handleAsync } from '../lib/http.js';
import { writeLog } from '../lib/logger.js';
import {
  LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH,
  LIB_REGEX_PATTERN_WEBHOOK_SIGNATURE_PREFIX,
} from '../lib/regex.js';
import {
  compileGuildWebApplication,
  findWebApplicationRoute,
  renderWebhookContent,
  verifyWebhookSignature,
} from '../lib/web-application-features.js';

import type {
  Routes_Webhooks_Runner_Constructor_Context,
  Routes_Webhooks_Runner_Context,
  Routes_Webhooks_Runner_Register_App,
  Routes_Webhooks_Runner_Register_Returns,
  Routes_Webhooks_Runner_RouteWebhook_Body,
  Routes_Webhooks_Runner_RouteWebhook_Content,
  Routes_Webhooks_Runner_RouteWebhook_Control,
  Routes_Webhooks_Runner_RouteWebhook_DedupeDigest,
  Routes_Webhooks_Runner_RouteWebhook_DedupeKey,
  Routes_Webhooks_Runner_RouteWebhook_Enqueued,
  Routes_Webhooks_Runner_RouteWebhook_ParsedBody,
  Routes_Webhooks_Runner_RouteWebhook_PublicRoute,
  Routes_Webhooks_Runner_RouteWebhook_Request,
  Routes_Webhooks_Runner_RouteWebhook_Response,
  Routes_Webhooks_Runner_RouteWebhook_Returns,
  Routes_Webhooks_Runner_RouteWebhook_Route,
  Routes_Webhooks_Runner_RouteWebhook_Runtime,
  Routes_Webhooks_Runner_RouteWebhook_Signature,
  Routes_Webhooks_Runner_RouteWebhook_Timestamp,
  Routes_Webhooks_Runner_SendText_Message,
  Routes_Webhooks_Runner_SendText_Response,
  Routes_Webhooks_Runner_SendText_Returns,
  Routes_Webhooks_Runner_SendText_Status,
  Routes_Webhooks_Runner_SetPublicHeaders_Response,
  Routes_Webhooks_Runner_SetPublicHeaders_Returns,
} from '../types/routes/webhooks.d.ts';

/**
 * Webhooks.
 *
 * Receives the signed webhooks the web-applications feature maps to Discord channels.
 * Each admitted webhook becomes one deduplicated Discord message job.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Webhooks - Context.
   *
   * Supplies the database pool and the key that opens each route's signing secret.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Webhooks_Runner_Context;

  /**
   * Webhooks - Constructor.
   *
   * Binds the receiver to the shared context.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Webhooks_Runner_Constructor_Context} context - Context.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Webhooks_Runner_Constructor_Context) {
    this.#context = context;

    return;
  }

  /**
   * Webhooks - Register.
   *
   * Answers every path shaped like a webhook path, whatever the method.
   * The server reads these bodies as raw bytes so signatures check the exact payload.
   *
   * @param {Routes_Webhooks_Runner_Register_App} app - App.
   *
   * @returns {Routes_Webhooks_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Webhooks_Runner_Register_App): Routes_Webhooks_Runner_Register_Returns {
    app.all(LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH, handleAsync(this['routeWebhook'].bind(this)));

    return;
  }

  /**
   * Webhooks - Route Webhook.
   *
   * Checks the signature, renders the route's message, and queues one Discord delivery.
   * A repeated signed request is acknowledged without queuing the message again.
   *
   * @param {Routes_Webhooks_Runner_RouteWebhook_Request}  request  - Request.
   * @param {Routes_Webhooks_Runner_RouteWebhook_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Webhooks_Runner_RouteWebhook_Returns}
   *
   * @since 4.0.0
   */
  private async routeWebhook(request: Routes_Webhooks_Runner_RouteWebhook_Request, response: Routes_Webhooks_Runner_RouteWebhook_Response): Routes_Webhooks_Runner_RouteWebhook_Returns {
    const publicRoute: Routes_Webhooks_Runner_RouteWebhook_PublicRoute = await findWebApplicationRoute(this.#context['pool'], request.path);

    if (publicRoute === undefined || publicRoute['kind'] !== 'webhook') {
      this.sendText(response, 404, 'Not found.');

      return;
    }

    const runtime: Routes_Webhooks_Runner_RouteWebhook_Runtime = await compileGuildWebApplication(this.#context['pool'], this.#context['credentialKey'], publicRoute['guildIdentifier']);
    const route: Routes_Webhooks_Runner_RouteWebhook_Route = (runtime === undefined) ? undefined : runtime['webhookRoutes'].get(request.path);

    if (route === undefined) {
      this.sendText(response, 404, 'Not found.');

      return;
    }

    if (request.method !== 'POST') {
      response.set('Allow', 'POST');

      this.sendText(response, 405, 'Method not allowed.');

      return;
    }

    const control: Routes_Webhooks_Runner_RouteWebhook_Control = await getBotRuntimeControl(this.#context['pool']);

    if (control['desiredState'] !== 'running' || control['discordTokenCiphertext'] === undefined) {
      this.sendText(response, 503, 'Discord delivery is not available while the bot is stopped or unconfigured.');

      return;
    }

    const body: Routes_Webhooks_Runner_RouteWebhook_Body = (Buffer.isBuffer(request.body) === true) ? request.body.toString('utf8') : '';
    const signature: Routes_Webhooks_Runner_RouteWebhook_Signature = request.get('x-stonker-signature') ?? '';
    const timestamp: Routes_Webhooks_Runner_RouteWebhook_Timestamp = request.get('x-stonker-timestamp') ?? '';

    if (verifyWebhookSignature(body, timestamp, signature, route['signingSecret']) === false) {
      this.sendText(response, 401, 'Invalid or expired webhook signature.');

      return;
    }

    let parsedBody: Routes_Webhooks_Runner_RouteWebhook_ParsedBody = undefined;

    try {
      parsedBody = JSON.parse(body);
    } catch {
      this.sendText(response, 400, 'Webhook body must be valid JSON.');

      return;
    }

    if (
      typeof parsedBody !== 'object'
      || parsedBody === null
      || Array.isArray(parsedBody) === true
    ) {
      this.sendText(response, 400, 'Webhook body must be a JSON object.');

      return;
    }

    let content: Routes_Webhooks_Runner_RouteWebhook_Content = '';

    try {
      content = renderWebhookContent(route, parsedBody);
    } catch {
      this.sendText(response, 422, 'Rendered webhook content must contain between 1 and 2000 characters.');

      return;
    }

    const canonicalSignature: Routes_Webhooks_Runner_RouteWebhook_Signature = signature.toLowerCase().replace(new RegExp(LIB_REGEX_PATTERN_WEBHOOK_SIGNATURE_PREFIX, 'u'), '');
    const dedupeDigest: Routes_Webhooks_Runner_RouteWebhook_DedupeDigest = createHash('sha256')
      .update(`${route['path']}.${timestamp}.${canonicalSignature}`, 'utf8')
      .digest('hex');
    const dedupeKey: Routes_Webhooks_Runner_RouteWebhook_DedupeKey = [
      'signed-webhook',
      publicRoute['guildIdentifier'],
      dedupeDigest,
    ].join(':');
    const enqueued: Routes_Webhooks_Runner_RouteWebhook_Enqueued = await enqueueDurableJob(this.#context['pool'], 'discord.message.send', {
      channelIdentifier: route['channelIdentifier'],
      content,
      guildIdentifier: publicRoute['guildIdentifier'],
      reactions: [],
      ruleName: route['name'],
    }, dedupeKey);

    writeLog('info', 'web', 'signed_webhook_admitted', {
      enqueued,
      guildIdentifier: publicRoute['guildIdentifier'],
      path: route['path'],
      ruleName: route['name'],
    });

    this.setPublicHeaders(response);

    response.status((enqueued === true) ? 202 : 200).json({
      accepted: true,
      duplicate: enqueued === false,
    });

    return;
  }

  /**
   * Webhooks - Send Text.
   *
   * Answers a refused webhook with a short plain-text reason.
   * The answer can't be framed or run anything.
   *
   * @param {Routes_Webhooks_Runner_SendText_Response} response - Response.
   * @param {Routes_Webhooks_Runner_SendText_Status}   status   - Status.
   * @param {Routes_Webhooks_Runner_SendText_Message}  message  - Message.
   *
   * @private
   *
   * @returns {Routes_Webhooks_Runner_SendText_Returns}
   *
   * @since 4.0.0
   */
  private sendText(response: Routes_Webhooks_Runner_SendText_Response, status: Routes_Webhooks_Runner_SendText_Status, message: Routes_Webhooks_Runner_SendText_Message): Routes_Webhooks_Runner_SendText_Returns {
    this.setPublicHeaders(response);

    response.status(status).type('text/plain').send(message);

    return;
  }

  /**
   * Webhooks - Set Public Headers.
   *
   * Applies the strict policy every webhook answer carries.
   * Nothing in them may load, run, or be framed.
   *
   * @param {Routes_Webhooks_Runner_SetPublicHeaders_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Webhooks_Runner_SetPublicHeaders_Returns}
   *
   * @since 4.0.0
   */
  private setPublicHeaders(response: Routes_Webhooks_Runner_SetPublicHeaders_Response): Routes_Webhooks_Runner_SetPublicHeaders_Returns {
    response.set({
      'Cache-Control': 'no-store',
      'Content-Security-Policy': 'default-src \'none\'; frame-ancestors \'none\'',
      'X-Frame-Options': 'DENY',
    });

    return;
  }
}
