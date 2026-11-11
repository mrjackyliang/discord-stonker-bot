import z from 'zod';

import { getPrincipal } from '../lib/access.js';
import { encryptDiscordToken } from '../lib/credential-vault.js';
import {
  getBotRuntimeControl,
  listRuntimeHeartbeats,
  requestBotAction,
  saveBotConfiguration,
} from '../lib/database.js';
import {
  handleAsync,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import { writeLog } from '../lib/logger.js';

import type {
  Routes_Bot_DescribeBot_ActiveFeatures,
  Routes_Bot_DescribeBot_Age,
  Routes_Bot_DescribeBot_ApplicationId,
  Routes_Bot_DescribeBot_BotHeartbeat,
  Routes_Bot_DescribeBot_ConfigurationErrors,
  Routes_Bot_DescribeBot_Details,
  Routes_Bot_DescribeBot_GuildCount,
  Routes_Bot_DescribeBot_Heartbeats,
  Routes_Bot_DescribeBot_ObservedAt,
  Routes_Bot_DescribeBot_Resolution,
  Routes_Bot_DescribeBot_Returns,
  Routes_Bot_DescribeBot_RuntimeControl,
  Routes_Bot_DescribeBot_Status,
  Routes_Bot_DescribeBot_UserTag,
  Routes_Bot_IsText_Text,
  Routes_Bot_IsText_Value,
  Routes_Bot_ReadStringList_Returns,
  Routes_Bot_ReadStringList_Value,
  Routes_Bot_Runner_Access,
  Routes_Bot_Runner_Constructor_Access,
  Routes_Bot_Runner_Constructor_Context,
  Routes_Bot_Runner_Context,
  Routes_Bot_Runner_Register_App,
  Routes_Bot_Runner_Register_Returns,
  Routes_Bot_Runner_RouteAction_Accepted,
  Routes_Bot_Runner_RouteAction_Body,
  Routes_Bot_Runner_RouteAction_Principal,
  Routes_Bot_Runner_RouteAction_Request,
  Routes_Bot_Runner_RouteAction_Response,
  Routes_Bot_Runner_RouteAction_Returns,
  Routes_Bot_Runner_RouteAction_RuntimeControl,
  Routes_Bot_Runner_RouteStatus_Heartbeats,
  Routes_Bot_Runner_RouteStatus_Request,
  Routes_Bot_Runner_RouteStatus_Response,
  Routes_Bot_Runner_RouteStatus_Returns,
  Routes_Bot_Runner_RouteStatus_RuntimeControl,
  Routes_Bot_Runner_RouteToken_Body,
  Routes_Bot_Runner_RouteToken_Principal,
  Routes_Bot_Runner_RouteToken_Request,
  Routes_Bot_Runner_RouteToken_Response,
  Routes_Bot_Runner_RouteToken_Returns,
  Routes_Bot_StaleHeartbeatMilliseconds,
} from '../types/routes/bot.d.ts';

/**
 * Bot - Stale Heartbeat Milliseconds.
 *
 * Treats a bot heartbeat older than two missed beats as a process that stopped answering.
 * The bot writes one every 30 seconds while it runs.
 *
 * @since 4.0.0
 */
const STALE_HEARTBEAT_MILLISECONDS: Routes_Bot_StaleHeartbeatMilliseconds = 90_000;

/**
 * Bot - Action Schema.
 *
 * Accepts the three bot actions the control panel offers.
 * Any other field in the body is reported back as not accepted.
 *
 * @since 4.0.0
 */
const actionSchema = z.object({
  action: z.enum([
    'restart',
    'start',
    'stop',
  ], { error: 'Choose start, stop, or restart.' }),
}).strict();

/**
 * Bot - Token Schema.
 *
 * Accepts the Discord bot token exactly as it was pasted, apart from surrounding spaces.
 * The value is encrypted before it is stored and never sent back.
 *
 * @since 4.0.0
 */
const tokenSchema = z.object({
  token: z.string({ error: 'Enter the bot token.' })
    .trim()
    .min(1, 'Enter the bot token.')
    .max(512, 'Use 512 characters or fewer.'),
}).strict();

/**
 * Bot - Describe Bot.
 *
 * Combines the requested state, the saved token, and the latest heartbeats into one status.
 * A heartbeat that stopped arriving while the bot should run is reported as unresponsive.
 *
 * @param {Routes_Bot_DescribeBot_RuntimeControl} runtimeControl - Runtime control.
 * @param {Routes_Bot_DescribeBot_Heartbeats}     heartbeats     - Heartbeats.
 *
 * @returns {Routes_Bot_DescribeBot_Returns}
 *
 * @since 4.0.0
 */
function describeBot(runtimeControl: Routes_Bot_DescribeBot_RuntimeControl, heartbeats: Routes_Bot_DescribeBot_Heartbeats): Routes_Bot_DescribeBot_Returns {
  const botHeartbeat: Routes_Bot_DescribeBot_BotHeartbeat = heartbeats.find((heartbeat) => heartbeat['component'] === 'bot');
  const workerHeartbeat: Routes_Bot_DescribeBot_BotHeartbeat = heartbeats.find((heartbeat) => heartbeat['component'] === 'worker');
  const details: Routes_Bot_DescribeBot_Details = (botHeartbeat === undefined) ? {} : botHeartbeat['details'];
  const workerDetails: Routes_Bot_DescribeBot_Details = (workerHeartbeat === undefined) ? {} : workerHeartbeat['details'];
  const observedAt: Routes_Bot_DescribeBot_ObservedAt = (botHeartbeat === undefined) ? runtimeControl['updatedAt'] : botHeartbeat['observedAt'];
  const age: Routes_Bot_DescribeBot_Age = Date.now() - Date.parse(observedAt);
  let status: Routes_Bot_DescribeBot_Status = (runtimeControl['desiredState'] === 'running') ? 'starting' : 'stopped';

  if (botHeartbeat !== undefined) {
    status = botHeartbeat['status'];
  }

  if (
    runtimeControl['desiredState'] === 'running'
    && age > STALE_HEARTBEAT_MILLISECONDS
  ) {
    status = 'unresponsive';
  }

  const userTag: Routes_Bot_DescribeBot_UserTag = (typeof details['userTag'] === 'string') ? details['userTag'] : null;
  const guildCount: Routes_Bot_DescribeBot_GuildCount = (typeof details['guildCount'] === 'number') ? details['guildCount'] : null;
  const resolution: Routes_Bot_DescribeBot_Resolution = (typeof details['resolution'] === 'string') ? details['resolution'] : null;
  const activeFeatures: Routes_Bot_DescribeBot_ActiveFeatures = readStringList(details['activeFeatures']);
  const configurationErrors: Routes_Bot_DescribeBot_ConfigurationErrors = [...new Set([
    ...readStringList(details['configurationErrors']),
    ...readStringList(workerDetails['configurationErrors']),
  ])];
  const applicationId: Routes_Bot_DescribeBot_ApplicationId = runtimeControl['discordApplicationId'] ?? null;

  return {
    activeFeatures,
    addServerUrl: (applicationId === null) ? null : `https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(applicationId)}&integration_type=0&scope=bot%20applications.commands`,
    applicationId,
    configurationErrors,
    desiredState: runtimeControl['desiredState'],
    guildCount,
    resolution,
    services: [
      'bot',
      'web',
      'worker',
    ].map((component) => {
      const heartbeat: Routes_Bot_DescribeBot_BotHeartbeat = heartbeats.find((candidate) => candidate['component'] === component);

      return {
        component,
        status: (heartbeat === undefined) ? null : heartbeat['status'],
        updatedAt: (heartbeat === undefined) ? null : heartbeat['observedAt'],
      };
    }),
    status,
    tokenConfigured: runtimeControl['discordTokenCiphertext'] !== undefined,
    userTag,
  };
}

/**
 * Bot - Read String List.
 *
 * Keeps only the text entries of a heartbeat detail that should be a list of strings.
 * Anything else becomes an empty list.
 *
 * @param {Routes_Bot_ReadStringList_Value} value - Value.
 *
 * @returns {Routes_Bot_ReadStringList_Returns}
 *
 * @since 4.0.0
 */
function readStringList(value: Routes_Bot_ReadStringList_Value): Routes_Bot_ReadStringList_Returns {
  if (Array.isArray(value) === false) {
    return [];
  }

  return value.filter((entry) => isText(entry));
}

/**
 * Bot - Is Text.
 *
 * Narrows one unknown heartbeat detail entry to a string.
 * Numbers, objects, and null are left out.
 *
 * @param {Routes_Bot_IsText_Value} value - Value.
 *
 * @returns {Routes_Bot_IsText_Returns}
 *
 * @since 4.0.0
 */
function isText(value: Routes_Bot_IsText_Value): value is Routes_Bot_IsText_Text {
  return typeof value === 'string';
}

/**
 * Bot.
 *
 * Reports the bot's status and starts, stops, or restarts it, and saves its token.
 * The bot process picks up each request on its next control poll.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Bot - Access.
   *
   * Checks the session or token, the bot:control scope, and the role of every caller.
   * Saving the token needs a browser session.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Bot_Runner_Access;

  /**
   * Bot - Context.
   *
   * Supplies the database pool and the key the bot token is encrypted with.
   * The token itself is never kept in memory.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Bot_Runner_Context;

  /**
   * Bot - Constructor.
   *
   * Binds the bot routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Bot_Runner_Constructor_Context} context - Context.
   * @param {Routes_Bot_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Bot_Runner_Constructor_Context, access: Routes_Bot_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Bot - Register.
   *
   * Installs the status, action, and token routes.
   * Every signed-in role can read the status; changes follow the role's permissions.
   *
   * @param {Routes_Bot_Runner_Register_App} app - App.
   *
   * @returns {Routes_Bot_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Bot_Runner_Register_App): Routes_Bot_Runner_Register_Returns {
    app.get('/api/v1/bot', this.#access.requireAccess({
      mutation: false,
      scope: 'bot:control',
    }), handleAsync(this['routeStatus'].bind(this)));

    app.post('/api/v1/bot/actions', this.#access.requireAccess({
      mutation: true,
      scope: 'bot:control',
    }), this.#access.requirePermission('bot:control'), handleAsync(this['routeAction'].bind(this)));

    app.put('/api/v1/bot/token', this.#access.requireSession(true), this.#access.requirePermission('configuration:write'), handleAsync(this['routeToken'].bind(this)));

    return;
  }

  /**
   * Bot - Route Action.
   *
   * Asks the bot process to start, stop, or restart.
   * Starting needs a saved token, so a missing one is refused with 409.
   *
   * @param {Routes_Bot_Runner_RouteAction_Request}  request  - Request.
   * @param {Routes_Bot_Runner_RouteAction_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Bot_Runner_RouteAction_Returns}
   *
   * @since 4.0.0
   */
  private async routeAction(request: Routes_Bot_Runner_RouteAction_Request, response: Routes_Bot_Runner_RouteAction_Response): Routes_Bot_Runner_RouteAction_Returns {
    const body: Routes_Bot_Runner_RouteAction_Body = actionSchema.safeParse(request.body);

    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose start, stop, or restart.');

      return;
    }

    const accepted: Routes_Bot_Runner_RouteAction_Accepted = await requestBotAction(this.#context['pool'], body.data['action']);

    if (accepted === false) {
      sendError(response, 409, 'bot_token_required', 'Add the Discord bot token before starting the bot.');

      return;
    }

    const principal: Routes_Bot_Runner_RouteAction_Principal = getPrincipal(response);
    const runtimeControl: Routes_Bot_Runner_RouteAction_RuntimeControl = await getBotRuntimeControl(this.#context['pool']);

    writeLog('info', 'web', 'bot_action_requested', {
      action: body.data['action'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.status(202).json({
      desiredState: runtimeControl['desiredState'],
    });

    return;
  }

  /**
   * Bot - Route Status.
   *
   * Answers the bot's status for the overview and the sidebar.
   * The token is reported only as saved or not.
   *
   * @param {Routes_Bot_Runner_RouteStatus_Request}  _request - Request.
   * @param {Routes_Bot_Runner_RouteStatus_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Bot_Runner_RouteStatus_Returns}
   *
   * @since 4.0.0
   */
  private async routeStatus(_request: Routes_Bot_Runner_RouteStatus_Request, response: Routes_Bot_Runner_RouteStatus_Response): Routes_Bot_Runner_RouteStatus_Returns {
    const runtimeControl: Routes_Bot_Runner_RouteStatus_RuntimeControl = await getBotRuntimeControl(this.#context['pool']);
    const heartbeats: Routes_Bot_Runner_RouteStatus_Heartbeats = await listRuntimeHeartbeats(this.#context['pool']);

    response.json(describeBot(runtimeControl, heartbeats));

    return;
  }

  /**
   * Bot - Route Token.
   *
   * Encrypts and saves a new Discord bot token, which makes the bot reconnect with it.
   * The token is write-only: no route ever returns it.
   *
   * @param {Routes_Bot_Runner_RouteToken_Request}  request  - Request.
   * @param {Routes_Bot_Runner_RouteToken_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Bot_Runner_RouteToken_Returns}
   *
   * @since 4.0.0
   */
  private async routeToken(request: Routes_Bot_Runner_RouteToken_Request, response: Routes_Bot_Runner_RouteToken_Response): Routes_Bot_Runner_RouteToken_Returns {
    const body: Routes_Bot_Runner_RouteToken_Body = tokenSchema.safeParse(request.body);

    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Enter the bot token.');

      return;
    }

    await saveBotConfiguration(this.#context['pool'], encryptDiscordToken(body.data['token'], this.#context['credentialKey']));

    const principal: Routes_Bot_Runner_RouteToken_Principal = getPrincipal(response);

    writeLog('info', 'web', 'bot_token_saved', {
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }
}
