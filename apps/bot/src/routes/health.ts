import { pingDatabase } from '../lib/database.js';
import { handleAsync } from '../lib/http.js';

import type {
  Routes_Health_Runner_Constructor_Context,
  Routes_Health_Runner_Context,
  Routes_Health_Runner_Register_App,
  Routes_Health_Runner_Register_Returns,
  Routes_Health_Runner_RouteHealth_Request,
  Routes_Health_Runner_RouteHealth_Response,
  Routes_Health_Runner_RouteHealth_Returns,
  Routes_Health_Runner_RouteReady_Ready,
  Routes_Health_Runner_RouteReady_Request,
  Routes_Health_Runner_RouteReady_Response,
  Routes_Health_Runner_RouteReady_Returns,
} from '../types/routes/health.d.ts';

/**
 * Health.
 *
 * Answers the container's liveness and readiness probes without signing in.
 * Readiness follows the database, so a stopped bot never marks the web process unready.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Health - Context.
   *
   * Supplies the database pool that readiness pings.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Health_Runner_Context;

  /**
   * Health - Constructor.
   *
   * Binds the probes to the shared context.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Health_Runner_Constructor_Context} context - Context.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Health_Runner_Constructor_Context) {
    this.#context = context;

    return;
  }

  /**
   * Health - Register.
   *
   * Installs /health and /ready before every other route.
   * Both answer in plain text for the healthcheck script.
   *
   * @param {Routes_Health_Runner_Register_App} app - App.
   *
   * @returns {Routes_Health_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Health_Runner_Register_App): Routes_Health_Runner_Register_Returns {
    app.get('/health', this['routeHealth'].bind(this));

    app.get('/ready', handleAsync(this['routeReady'].bind(this)));

    return;
  }

  /**
   * Health - Route Health.
   *
   * Reports that the web process is running.
   * It never touches the database.
   *
   * @param {Routes_Health_Runner_RouteHealth_Request}  _request - Request.
   * @param {Routes_Health_Runner_RouteHealth_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Health_Runner_RouteHealth_Returns}
   *
   * @since 4.0.0
   */
  private routeHealth(_request: Routes_Health_Runner_RouteHealth_Request, response: Routes_Health_Runner_RouteHealth_Response): Routes_Health_Runner_RouteHealth_Returns {
    response.type('text/plain').send('ok');

    return;
  }

  /**
   * Health - Route Ready.
   *
   * Reports whether the database answers, with 503 while it doesn't.
   * The body stays the same so the healthcheck only reads the status.
   *
   * @param {Routes_Health_Runner_RouteReady_Request}  _request - Request.
   * @param {Routes_Health_Runner_RouteReady_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Health_Runner_RouteReady_Returns}
   *
   * @since 4.0.0
   */
  private async routeReady(_request: Routes_Health_Runner_RouteReady_Request, response: Routes_Health_Runner_RouteReady_Response): Routes_Health_Runner_RouteReady_Returns {
    const ready: Routes_Health_Runner_RouteReady_Ready = await pingDatabase(this.#context['pool']);

    response.status((ready === true) ? 200 : 503).type('text/plain').send('ready');

    return;
  }
}
