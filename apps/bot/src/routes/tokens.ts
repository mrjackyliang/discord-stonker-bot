import { getPrincipal } from '../lib/access.js';
import {
  tokenCreate,
  tokenUpdate,
} from '../lib/account-schemas.js';
import {
  handleAsync,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import { writeLog } from '../lib/logger.js';
import {
  createPanelToken,
  deletePanelToken,
  isPanelTokenId,
  listPanelTokens,
  updatePanelToken,
} from '../lib/panel-tokens.js';

import type {
  Routes_Tokens_Runner_Access,
  Routes_Tokens_Runner_Constructor_Access,
  Routes_Tokens_Runner_Constructor_Context,
  Routes_Tokens_Runner_Context,
  Routes_Tokens_Runner_GetTokenId_Request,
  Routes_Tokens_Runner_GetTokenId_Returns,
  Routes_Tokens_Runner_GetTokenId_TokenId,
  Routes_Tokens_Runner_IsScopeRefused_Principal,
  Routes_Tokens_Runner_IsScopeRefused_RefusedScope,
  Routes_Tokens_Runner_IsScopeRefused_Response,
  Routes_Tokens_Runner_IsScopeRefused_Returns,
  Routes_Tokens_Runner_IsScopeRefused_Scopes,
  Routes_Tokens_Runner_Register_App,
  Routes_Tokens_Runner_Register_Returns,
  Routes_Tokens_Runner_RouteCreate_Principal,
  Routes_Tokens_Runner_RouteCreate_Request,
  Routes_Tokens_Runner_RouteCreate_RequestBody,
  Routes_Tokens_Runner_RouteCreate_Response,
  Routes_Tokens_Runner_RouteCreate_Result,
  Routes_Tokens_Runner_RouteCreate_Returns,
  Routes_Tokens_Runner_RouteDelete_Name,
  Routes_Tokens_Runner_RouteDelete_Principal,
  Routes_Tokens_Runner_RouteDelete_Request,
  Routes_Tokens_Runner_RouteDelete_Response,
  Routes_Tokens_Runner_RouteDelete_Returns,
  Routes_Tokens_Runner_RouteDelete_TokenId,
  Routes_Tokens_Runner_RouteList_Principal,
  Routes_Tokens_Runner_RouteList_Request,
  Routes_Tokens_Runner_RouteList_Response,
  Routes_Tokens_Runner_RouteList_Returns,
  Routes_Tokens_Runner_RouteUpdate_Principal,
  Routes_Tokens_Runner_RouteUpdate_Request,
  Routes_Tokens_Runner_RouteUpdate_RequestBody,
  Routes_Tokens_Runner_RouteUpdate_Response,
  Routes_Tokens_Runner_RouteUpdate_Result,
  Routes_Tokens_Runner_RouteUpdate_Returns,
  Routes_Tokens_Runner_RouteUpdate_TokenId,
  Routes_Tokens_ViewerScopes,
} from '../types/routes/tokens.d.ts';

/**
 * Tokens - Viewer Scopes.
 *
 * Lists the only scopes a viewer may put on a token, because viewers can only read.
 * Operators and above may grant every scope.
 *
 * @since 4.0.0
 */
const viewerScopes: Routes_Tokens_ViewerScopes = [
  'features:read',
  'logs:read',
];

/**
 * Tokens.
 *
 * Lets the signed-in user list, create, edit, and revoke their own personal access tokens.
 * A token acts as its owner, limited to its scopes, so tokens never manage tokens.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Tokens - Access.
   *
   * Restricts every route here to a signed-in browser session.
   * Mutations also need the session's CSRF header.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Tokens_Runner_Access;

  /**
   * Tokens - Context.
   *
   * Supplies the database pool that stores token digests and metadata.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Tokens_Runner_Context;

  /**
   * Tokens - Constructor.
   *
   * Binds the token routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Tokens_Runner_Constructor_Context} context - Context.
   * @param {Routes_Tokens_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Tokens_Runner_Constructor_Context, access: Routes_Tokens_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Tokens - Register.
   *
   * Installs the list, create, update, and revoke routes.
   * Paths and bodies match the other appliances.
   *
   * @param {Routes_Tokens_Runner_Register_App} app - App.
   *
   * @returns {Routes_Tokens_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Tokens_Runner_Register_App): Routes_Tokens_Runner_Register_Returns {
    app.get('/api/v1/auth/tokens', this.#access.requireSession(false), handleAsync(this['routeList'].bind(this)));

    app.post('/api/v1/auth/tokens', this.#access.requireSession(true), handleAsync(this['routeCreate'].bind(this)));

    app.put('/api/v1/auth/tokens/:tokenId', this.#access.requireSession(true), handleAsync(this['routeUpdate'].bind(this)));

    app.delete('/api/v1/auth/tokens/:tokenId', this.#access.requireSession(true), handleAsync(this['routeDelete'].bind(this)));

    return;
  }

  /**
   * Tokens - Get Token ID.
   *
   * Reads the :tokenId route parameter when it has the shape of a token id.
   * Malformed ids are treated like unknown ones.
   *
   * @param {Routes_Tokens_Runner_GetTokenId_Request} request - Request.
   *
   * @private
   *
   * @returns {Routes_Tokens_Runner_GetTokenId_Returns}
   *
   * @since 4.0.0
   */
  private getTokenId(request: Routes_Tokens_Runner_GetTokenId_Request): Routes_Tokens_Runner_GetTokenId_Returns {
    const tokenId: Routes_Tokens_Runner_GetTokenId_TokenId = request.params['tokenId'];

    if (typeof tokenId !== 'string' || isPanelTokenId(tokenId) === false) {
      return undefined;
    }

    return tokenId;
  }

  /**
   * Tokens - Is Scope Refused.
   *
   * Refuses scopes the caller's role can't grant, naming the first one in the request.
   * Viewers may only grant read scopes.
   *
   * @param {Routes_Tokens_Runner_IsScopeRefused_Response} response - Response.
   * @param {Routes_Tokens_Runner_IsScopeRefused_Scopes}   scopes   - Scopes.
   *
   * @private
   *
   * @returns {Routes_Tokens_Runner_IsScopeRefused_Returns}
   *
   * @since 4.0.0
   */
  private isScopeRefused(response: Routes_Tokens_Runner_IsScopeRefused_Response, scopes: Routes_Tokens_Runner_IsScopeRefused_Scopes): Routes_Tokens_Runner_IsScopeRefused_Returns {
    const principal: Routes_Tokens_Runner_IsScopeRefused_Principal = getPrincipal(response);

    if (principal['user']['role'] !== 'viewer') {
      return false;
    }

    const refusedScope: Routes_Tokens_Runner_IsScopeRefused_RefusedScope = scopes.find((scope) => viewerScopes.includes(scope) === false);

    if (refusedScope === undefined) {
      return false;
    }

    sendError(response, 422, 'invalid_request', `Your role can't grant ${refusedScope}.`, [{
      field: 'scopes',
      message: `Your role can't grant ${refusedScope}.`,
      path: ['scopes'],
    }]);

    return true;
  }

  /**
   * Tokens - Route Create.
   *
   * Creates a token for the signed-in user and returns its value once.
   * Only the digest is stored, so the value can't be shown again.
   *
   * @param {Routes_Tokens_Runner_RouteCreate_Request}  request  - Request.
   * @param {Routes_Tokens_Runner_RouteCreate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Tokens_Runner_RouteCreate_Returns}
   *
   * @since 4.0.0
   */
  private async routeCreate(request: Routes_Tokens_Runner_RouteCreate_Request, response: Routes_Tokens_Runner_RouteCreate_Response): Routes_Tokens_Runner_RouteCreate_Returns {
    const requestBody: Routes_Tokens_Runner_RouteCreate_RequestBody = tokenCreate.safeParse(request.body);
    const principal: Routes_Tokens_Runner_RouteCreate_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (this.isScopeRefused(response, requestBody.data['scopes']) === true) {
      return;
    }

    const result: Routes_Tokens_Runner_RouteCreate_Result = await createPanelToken(this.#context['pool'], principal['user']['id'], requestBody.data);

    if (result === 'name-taken') {
      sendError(response, 409, 'token_exists', 'A token with this name already exists.', [{
        field: 'name',
        message: 'A token with this name already exists.',
        path: ['name'],
      }]);

      return;
    }

    writeLog('info', 'web', 'token_created', {
      scopes: result['token']['scopes'],
      tokenId: result['token']['id'],
      tokenName: result['token']['name'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.status(201).json({
      plaintext: result['plaintext'],
      token: result['token'],
    });

    return;
  }

  /**
   * Tokens - Route Delete.
   *
   * Revokes one of the signed-in user's tokens.
   * Requests that use it fail from the next request on.
   *
   * @param {Routes_Tokens_Runner_RouteDelete_Request}  request  - Request.
   * @param {Routes_Tokens_Runner_RouteDelete_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Tokens_Runner_RouteDelete_Returns}
   *
   * @since 4.0.0
   */
  private async routeDelete(request: Routes_Tokens_Runner_RouteDelete_Request, response: Routes_Tokens_Runner_RouteDelete_Response): Routes_Tokens_Runner_RouteDelete_Returns {
    const tokenId: Routes_Tokens_Runner_RouteDelete_TokenId = this.getTokenId(request);
    const principal: Routes_Tokens_Runner_RouteDelete_Principal = getPrincipal(response);

    if (tokenId === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return;
    }

    const name: Routes_Tokens_Runner_RouteDelete_Name = await deletePanelToken(this.#context['pool'], principal['user']['id'], tokenId);

    if (name === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return;
    }

    writeLog('info', 'web', 'token_revoked', {
      tokenId,
      tokenName: name,
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Tokens - Route List.
   *
   * Lists the signed-in user's tokens, newest first.
   * Token values are never included.
   *
   * @param {Routes_Tokens_Runner_RouteList_Request}  _request - Request.
   * @param {Routes_Tokens_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Tokens_Runner_RouteList_Returns}
   *
   * @since 4.0.0
   */
  private async routeList(_request: Routes_Tokens_Runner_RouteList_Request, response: Routes_Tokens_Runner_RouteList_Response): Routes_Tokens_Runner_RouteList_Returns {
    const principal: Routes_Tokens_Runner_RouteList_Principal = getPrincipal(response);

    response.json({
      items: await listPanelTokens(this.#context['pool'], principal['user']['id']),
    });

    return;
  }

  /**
   * Tokens - Route Update.
   *
   * Changes a token's name, scopes, and expiry while its value stays the same.
   * Leaving out the expiry keeps the current one; null removes it.
   *
   * @param {Routes_Tokens_Runner_RouteUpdate_Request}  request  - Request.
   * @param {Routes_Tokens_Runner_RouteUpdate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Tokens_Runner_RouteUpdate_Returns}
   *
   * @since 4.0.0
   */
  private async routeUpdate(request: Routes_Tokens_Runner_RouteUpdate_Request, response: Routes_Tokens_Runner_RouteUpdate_Response): Routes_Tokens_Runner_RouteUpdate_Returns {
    const tokenId: Routes_Tokens_Runner_RouteUpdate_TokenId = this.getTokenId(request);
    const principal: Routes_Tokens_Runner_RouteUpdate_Principal = getPrincipal(response);

    if (tokenId === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return;
    }

    const requestBody: Routes_Tokens_Runner_RouteUpdate_RequestBody = tokenUpdate.safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (this.isScopeRefused(response, requestBody.data['scopes']) === true) {
      return;
    }

    const result: Routes_Tokens_Runner_RouteUpdate_Result = await updatePanelToken(this.#context['pool'], principal['user']['id'], tokenId, requestBody.data);

    if (result === 'not-found') {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return;
    }

    if (result === 'name-taken') {
      sendError(response, 409, 'token_exists', 'A token with this name already exists.', [{
        field: 'name',
        message: 'A token with this name already exists.',
        path: ['name'],
      }]);

      return;
    }

    writeLog('info', 'web', 'token_updated', {
      scopes: result['scopes'],
      tokenId: result['id'],
      tokenName: result['name'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json(result);

    return;
  }
}
