import { join } from 'node:path';

import express from 'express';

import { sendError } from '../lib/http.js';

import type {
  Routes_Web_Runner_AllowCaching_Next,
  Routes_Web_Runner_AllowCaching_Request,
  Routes_Web_Runner_AllowCaching_Response,
  Routes_Web_Runner_AllowCaching_Returns,
  Routes_Web_Runner_ConsoleHeaders_Next,
  Routes_Web_Runner_ConsoleHeaders_Request,
  Routes_Web_Runner_ConsoleHeaders_Response,
  Routes_Web_Runner_ConsoleHeaders_Returns,
  Routes_Web_Runner_Constructor_Context,
  Routes_Web_Runner_Register_App,
  Routes_Web_Runner_Register_Returns,
  Routes_Web_Runner_Root,
  Routes_Web_Runner_SendApplication_IndexPath,
  Routes_Web_Runner_SendApplication_Next,
  Routes_Web_Runner_SendApplication_Request,
  Routes_Web_Runner_SendApplication_Response,
  Routes_Web_Runner_SendApplication_Returns,
} from '../types/routes/web.d.ts';

/**
 * Web.
 *
 * Serves the built control panel at the site root and answers every page path with it.
 * API, health, webhook, and media paths are left to their own routes.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Web - Root.
   *
   * Points at the folder Vite builds the control panel into.
   * Tests pass a temporary folder instead.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #root: Routes_Web_Runner_Root;

  /**
   * Web - Constructor.
   *
   * Reads the built control panel folder from the shared context.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Web_Runner_Constructor_Context} context - Context.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Web_Runner_Constructor_Context) {
    this.#root = context['webRoot'];

    return;
  }

  /**
   * Web - Register.
   *
   * Serves hashed assets with a long cache, other files with a short one, and pages last.
   * Every page gets the same strict content security policy.
   *
   * @param {Routes_Web_Runner_Register_App} app - App.
   *
   * @returns {Routes_Web_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Web_Runner_Register_App): Routes_Web_Runner_Register_Returns {
    app.use('/assets', this['allowCaching'].bind(this), express.static(join(this.#root, 'assets'), {
      fallthrough: false,
      immutable: true,
      index: false,
      maxAge: '1y',
    }));

    app.get('/favicon.svg', this['allowCaching'].bind(this), express.static(this.#root, {
      index: false,
      maxAge: '1h',
    }));

    app.get('*', this['consoleHeaders'].bind(this), this['sendApplication'].bind(this));

    return;
  }

  /**
   * Web - Allow Caching.
   *
   * Removes the default no-store header so static files can set their own lifetime.
   * Only built assets pass through it.
   *
   * @param {Routes_Web_Runner_AllowCaching_Request}  _request - Request.
   * @param {Routes_Web_Runner_AllowCaching_Response} response - Response.
   * @param {Routes_Web_Runner_AllowCaching_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_AllowCaching_Returns}
   *
   * @since 4.0.0
   */
  private allowCaching(_request: Routes_Web_Runner_AllowCaching_Request, response: Routes_Web_Runner_AllowCaching_Response, next: Routes_Web_Runner_AllowCaching_Next): Routes_Web_Runner_AllowCaching_Returns {
    response.removeHeader('Cache-Control');

    next();

    return;
  }

  /**
   * Web - Console Headers.
   *
   * Applies the control panel's content security policy and framing rules.
   * Server icons load from Discord's CDN; everything else comes from this site.
   *
   * @param {Routes_Web_Runner_ConsoleHeaders_Request}  _request - Request.
   * @param {Routes_Web_Runner_ConsoleHeaders_Response} response - Response.
   * @param {Routes_Web_Runner_ConsoleHeaders_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_ConsoleHeaders_Returns}
   *
   * @since 4.0.0
   */
  private consoleHeaders(_request: Routes_Web_Runner_ConsoleHeaders_Request, response: Routes_Web_Runner_ConsoleHeaders_Response, next: Routes_Web_Runner_ConsoleHeaders_Next): Routes_Web_Runner_ConsoleHeaders_Returns {
    response.set({
      'Content-Security-Policy': 'default-src \'self\'; base-uri \'none\'; connect-src \'self\'; font-src \'self\'; form-action \'self\'; frame-ancestors \'none\'; img-src \'self\' data: https://cdn.discordapp.com; object-src \'none\'; script-src \'self\'; style-src \'self\'',
      'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
      'X-Frame-Options': 'DENY',
    });

    next();

    return;
  }

  /**
   * Web - Send Application.
   *
   * Answers a page path with the control panel's index.html, which routes in the browser.
   * API paths are passed on so unknown ones still get the JSON not-found answer.
   *
   * @param {Routes_Web_Runner_SendApplication_Request}  request  - Request.
   * @param {Routes_Web_Runner_SendApplication_Response} response - Response.
   * @param {Routes_Web_Runner_SendApplication_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_SendApplication_Returns}
   *
   * @since 4.0.0
   */
  private sendApplication(request: Routes_Web_Runner_SendApplication_Request, response: Routes_Web_Runner_SendApplication_Response, next: Routes_Web_Runner_SendApplication_Next): Routes_Web_Runner_SendApplication_Returns {
    if (request.path === '/api' || request.path.startsWith('/api/') === true) {
      next();

      return;
    }

    const indexPath: Routes_Web_Runner_SendApplication_IndexPath = join(this.#root, 'index.html');

    response.set('Cache-Control', 'no-store');

    response.sendFile(indexPath, (error) => {
      if (error !== undefined && response.headersSent === false) {
        sendError(response, 404, 'console_not_built', 'The control panel isn\'t built. Run npm run build:web in apps/bot.');
      }

      return;
    });

    return;
  }
}
