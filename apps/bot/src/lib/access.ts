import {
  buildCookie,
  getClientAddress,
  getRequestScheme,
  handleAsync,
  readCookie,
  sendError,
} from './http.js';
import {
  authenticatePanelToken,
  createPanelSession,
  digestsEqual,
  digestValue,
  getPanelSession,
} from './panel-sessions.js';
import {
  LIB_REGEX_PATTERN_API_TOKEN,
  LIB_REGEX_PATTERN_BEARER_AUTHORIZATION,
  LIB_REGEX_PATTERN_CSRF_TOKEN,
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_SESSION_TOKEN,
} from './regex.js';

import type {
  Lib_Access_CsrfCookieName,
  Lib_Access_GetBearerToken_Header,
  Lib_Access_GetBearerToken_Match,
  Lib_Access_GetBearerToken_Request,
  Lib_Access_GetBearerToken_Returns,
  Lib_Access_GetPrincipal_Principal,
  Lib_Access_GetPrincipal_Response,
  Lib_Access_GetPrincipal_Returns,
  Lib_Access_GetServerId_Response,
  Lib_Access_GetServerId_Returns,
  Lib_Access_GetServerId_ServerId,
  Lib_Access_PermissionMessages,
  Lib_Access_RoleCan_Permission,
  Lib_Access_RoleCan_Returns,
  Lib_Access_RoleCan_Role,
  Lib_Access_RolePermissions,
  Lib_Access_Runner_ClearSession_Request,
  Lib_Access_Runner_ClearSession_Response,
  Lib_Access_Runner_ClearSession_Returns,
  Lib_Access_Runner_ClearSession_Secure,
  Lib_Access_Runner_Constructor_Pool,
  Lib_Access_Runner_HasValidCsrf_CookieToken,
  Lib_Access_Runner_HasValidCsrf_CsrfHash,
  Lib_Access_Runner_HasValidCsrf_HeaderToken,
  Lib_Access_Runner_HasValidCsrf_Request,
  Lib_Access_Runner_HasValidCsrf_Returns,
  Lib_Access_Runner_IssueSession_CreatedSession,
  Lib_Access_Runner_IssueSession_MaxAge,
  Lib_Access_Runner_IssueSession_Request,
  Lib_Access_Runner_IssueSession_Response,
  Lib_Access_Runner_IssueSession_Returns,
  Lib_Access_Runner_IssueSession_Secure,
  Lib_Access_Runner_IssueSession_Status,
  Lib_Access_Runner_IssueSession_User,
  Lib_Access_Runner_Pool,
  Lib_Access_Runner_RequireAccess_CallbackReturns,
  Lib_Access_Runner_RequireAccess_Next,
  Lib_Access_Runner_RequireAccess_Options,
  Lib_Access_Runner_RequireAccess_Request,
  Lib_Access_Runner_RequireAccess_Response,
  Lib_Access_Runner_RequireAccess_Returns,
  Lib_Access_Runner_RequireAuthentication_CallbackReturns,
  Lib_Access_Runner_RequireAuthentication_Mutation,
  Lib_Access_Runner_RequireAuthentication_Next,
  Lib_Access_Runner_RequireAuthentication_Request,
  Lib_Access_Runner_RequireAuthentication_Response,
  Lib_Access_Runner_RequireAuthentication_Returns,
  Lib_Access_Runner_RequirePermission_CallbackReturns,
  Lib_Access_Runner_RequirePermission_Next,
  Lib_Access_Runner_RequirePermission_Permission,
  Lib_Access_Runner_RequirePermission_Principal,
  Lib_Access_Runner_RequirePermission_Request,
  Lib_Access_Runner_RequirePermission_Response,
  Lib_Access_Runner_RequirePermission_Returns,
  Lib_Access_Runner_RequireServer_CallbackReturns,
  Lib_Access_Runner_RequireServer_ExistingServer,
  Lib_Access_Runner_RequireServer_Next,
  Lib_Access_Runner_RequireServer_Principal,
  Lib_Access_Runner_RequireServer_RawServerId,
  Lib_Access_Runner_RequireServer_Request,
  Lib_Access_Runner_RequireServer_Response,
  Lib_Access_Runner_RequireServer_Returns,
  Lib_Access_Runner_RequireServer_ServerId,
  Lib_Access_Runner_RequireSession_CallbackReturns,
  Lib_Access_Runner_RequireSession_Mutation,
  Lib_Access_Runner_RequireSession_Next,
  Lib_Access_Runner_RequireSession_Request,
  Lib_Access_Runner_RequireSession_Response,
  Lib_Access_Runner_RequireSession_Returns,
  Lib_Access_Runner_ResolveSession_Message,
  Lib_Access_Runner_ResolveSession_Mutation,
  Lib_Access_Runner_ResolveSession_Request,
  Lib_Access_Runner_ResolveSession_Response,
  Lib_Access_Runner_ResolveSession_Returns,
  Lib_Access_Runner_ResolveSession_Session,
  Lib_Access_Runner_ResolveSession_SessionToken,
  Lib_Access_Runner_ResolveToken_AccessToken,
  Lib_Access_Runner_ResolveToken_RawToken,
  Lib_Access_Runner_ResolveToken_Request,
  Lib_Access_Runner_ResolveToken_Response,
  Lib_Access_Runner_ResolveToken_Returns,
  Lib_Access_Runner_ResolveToken_Scope,
  Lib_Access_ServerAccessible_Returns,
  Lib_Access_ServerAccessible_ServerId,
  Lib_Access_ServerAccessible_User,
  Lib_Access_SessionCookieName,
} from '../types/lib/access.d.ts';

/**
 * Access - Csrf Cookie Name.
 *
 * Names the readable cookie the control panel copies into the X-CSRF-Token header.
 * Other sites cannot read it, so they cannot forge that header.
 *
 * @since 4.0.0
 */
const CSRF_COOKIE_NAME: Lib_Access_CsrfCookieName = 'dsb_csrf';

/**
 * Access - Session Cookie Name.
 *
 * Names the HttpOnly cookie that carries the opaque browser session.
 * Scripts on the page can never read its value.
 *
 * @since 4.0.0
 */
const SESSION_COOKIE_NAME: Lib_Access_SessionCookieName = 'dsb_session';

/**
 * Access - Role Permissions.
 *
 * Lists what each panel role may change. Viewers can read but never change anything.
 * The owner and administrators also manage other panel users.
 *
 * @since 4.0.0
 */
const rolePermissions: Lib_Access_RolePermissions = {
  administrator: [
    'bot:control',
    'configuration:write',
    'users:manage',
  ],
  operator: [
    'bot:control',
    'configuration:write',
  ],
  owner: [
    'bot:control',
    'configuration:write',
    'users:manage',
  ],
  viewer: [],
};

/**
 * Access - Permission Messages.
 *
 * Explains each refused permission in the words the control panel shows.
 * The role name is left out because the same message fits every role that lacks it.
 *
 * @since 4.0.0
 */
const permissionMessages: Lib_Access_PermissionMessages = {
  'bot:control': 'Your role can\'t start or stop the bot.',
  'configuration:write': 'Your role can\'t change settings.',
  'users:manage': 'Your role can\'t manage users.',
};

/**
 * Access - Get Principal.
 *
 * Returns the caller that an access check stored on the response.
 * Routes call it only behind requireSession or requireAccess.
 *
 * @param {Lib_Access_GetPrincipal_Response} response - Response.
 *
 * @returns {Lib_Access_GetPrincipal_Returns}
 *
 * @since 4.0.0
 */
export function getPrincipal(response: Lib_Access_GetPrincipal_Response): Lib_Access_GetPrincipal_Returns {
  const principal: Lib_Access_GetPrincipal_Principal = response.locals['principal'];

  if (principal === undefined) {
    throw new Error('The route ran without an access check.');
  }

  return principal;
}

/**
 * Access - Get Server ID.
 *
 * Returns the Discord server that requireServer checked for this request.
 * Routes call it only behind requireServer.
 *
 * @param {Lib_Access_GetServerId_Response} response - Response.
 *
 * @returns {Lib_Access_GetServerId_Returns}
 *
 * @since 4.0.0
 */
export function getServerId(response: Lib_Access_GetServerId_Response): Lib_Access_GetServerId_Returns {
  const serverId: Lib_Access_GetServerId_ServerId = response.locals['serverId'];

  if (typeof serverId !== 'string') {
    throw new Error('The route ran without a server check.');
  }

  return serverId;
}

/**
 * Access - Role Can.
 *
 * Reports whether a panel role carries one permission.
 * Token scopes are checked separately by requireAccess.
 *
 * @param {Lib_Access_RoleCan_Role}       role       - Role.
 * @param {Lib_Access_RoleCan_Permission} permission - Permission.
 *
 * @returns {Lib_Access_RoleCan_Returns}
 *
 * @since 4.0.0
 */
export function roleCan(role: Lib_Access_RoleCan_Role, permission: Lib_Access_RoleCan_Permission): Lib_Access_RoleCan_Returns {
  return rolePermissions[role].includes(permission);
}

/**
 * Access - Server Accessible.
 *
 * Reports whether a user may see one Discord server.
 * Users with access to every server see servers added later too.
 *
 * @param {Lib_Access_ServerAccessible_User}     user     - User.
 * @param {Lib_Access_ServerAccessible_ServerId} serverId - Server id.
 *
 * @returns {Lib_Access_ServerAccessible_Returns}
 *
 * @since 4.0.0
 */
export function serverAccessible(user: Lib_Access_ServerAccessible_User, serverId: Lib_Access_ServerAccessible_ServerId): Lib_Access_ServerAccessible_Returns {
  return user['allServers'] === true || user['serverIds'].includes(serverId);
}

/**
 * Access - Get Bearer Token.
 *
 * Reads the credential from a Bearer Authorization header.
 * Other schemes and values that aren't a dsb_ token are treated as missing.
 *
 * @param {Lib_Access_GetBearerToken_Request} request - Request.
 *
 * @returns {Lib_Access_GetBearerToken_Returns}
 *
 * @since 4.0.0
 */
function getBearerToken(request: Lib_Access_GetBearerToken_Request): Lib_Access_GetBearerToken_Returns {
  const header: Lib_Access_GetBearerToken_Header = request.get('Authorization');

  if (header === undefined) {
    return undefined;
  }

  const match: Lib_Access_GetBearerToken_Match = new RegExp(LIB_REGEX_PATTERN_BEARER_AUTHORIZATION, 'i').exec(header.trim());

  if (
    match === null
    || match[1] === undefined
    || LIB_REGEX_PATTERN_API_TOKEN.test(match[1]) === false
  ) {
    return undefined;
  }

  return match[1];
}

/**
 * Access.
 *
 * Decides who is calling: a signed-in browser session or a personal access token.
 * A bearer token always wins over a session cookie on the same request.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Access - Pool.
   *
   * Resolves sessions, tokens, and servers against current database rows.
   * Revoked tokens and signed-out sessions stop working on the next request.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #pool: Lib_Access_Runner_Pool;

  /**
   * Access - Constructor.
   *
   * Binds access checks to the shared database pool.
   * One instance serves every route module.
   *
   * @param {Lib_Access_Runner_Constructor_Pool} pool - Pool.
   *
   * @since 4.0.0
   */
  public constructor(pool: Lib_Access_Runner_Constructor_Pool) {
    this.#pool = pool;

    return;
  }

  /**
   * Access - Clear Session.
   *
   * Expires both session cookies in the browser.
   * The stored session itself is deleted by the caller.
   *
   * @param {Lib_Access_Runner_ClearSession_Request}  request  - Request.
   * @param {Lib_Access_Runner_ClearSession_Response} response - Response.
   *
   * @returns {Lib_Access_Runner_ClearSession_Returns}
   *
   * @since 4.0.0
   */
  public clearSession(request: Lib_Access_Runner_ClearSession_Request, response: Lib_Access_Runner_ClearSession_Response): Lib_Access_Runner_ClearSession_Returns {
    const secure: Lib_Access_Runner_ClearSession_Secure = getRequestScheme(request) === 'https';

    response.append('Set-Cookie', buildCookie(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      maxAge: 0,
      secure,
    }));

    response.append('Set-Cookie', buildCookie(CSRF_COOKIE_NAME, '', {
      httpOnly: false,
      maxAge: 0,
      secure,
    }));

    return;
  }

  /**
   * Access - Issue Session.
   *
   * Creates a stored session for a verified user, sets both cookies, and answers the request.
   * Every sign-in method ends here, so each gets the same CSRF protection.
   *
   * @param {Lib_Access_Runner_IssueSession_Request}  request  - Request.
   * @param {Lib_Access_Runner_IssueSession_Response} response - Response.
   * @param {Lib_Access_Runner_IssueSession_User}     user     - User.
   * @param {Lib_Access_Runner_IssueSession_Status}   status   - Status.
   *
   * @returns {Lib_Access_Runner_IssueSession_Returns}
   *
   * @since 4.0.0
   */
  public async issueSession(request: Lib_Access_Runner_IssueSession_Request, response: Lib_Access_Runner_IssueSession_Response, user: Lib_Access_Runner_IssueSession_User, status: Lib_Access_Runner_IssueSession_Status): Lib_Access_Runner_IssueSession_Returns {
    const createdSession: Lib_Access_Runner_IssueSession_CreatedSession = await createPanelSession(this.#pool, user['id'], {
      ipAddress: getClientAddress(request),
      userAgent: request.get('User-Agent') ?? '',
    });
    const maxAge: Lib_Access_Runner_IssueSession_MaxAge = Math.floor((Date.parse(createdSession['expiresAt']) - Date.now()) / 1000);
    const secure: Lib_Access_Runner_IssueSession_Secure = getRequestScheme(request) === 'https';

    response.append('Set-Cookie', buildCookie(SESSION_COOKIE_NAME, createdSession['sessionToken'], {
      httpOnly: true,
      maxAge,
      secure,
    }));

    response.append('Set-Cookie', buildCookie(CSRF_COOKIE_NAME, createdSession['csrfToken'], {
      httpOnly: false,
      maxAge,
      secure,
    }));

    response.status(status).json({
      csrfToken: createdSession['csrfToken'],
      expiresAt: createdSession['expiresAt'],
      status: 'authenticated',
      user: {
        id: user['id'],
        role: user['role'],
        username: user['username'],
      },
    });

    return;
  }

  /**
   * Access - Require Access.
   *
   * Accepts a personal access token with the given scope or a signed-in browser session.
   * Session mutations still need the CSRF header; tokens never do.
   *
   * @param {Lib_Access_Runner_RequireAccess_Options} options - Options.
   *
   * @returns {Lib_Access_Runner_RequireAccess_Returns}
   *
   * @since 4.0.0
   */
  public requireAccess(options: Lib_Access_Runner_RequireAccess_Options): Lib_Access_Runner_RequireAccess_Returns {
    return handleAsync(async (request: Lib_Access_Runner_RequireAccess_Request, response: Lib_Access_Runner_RequireAccess_Response, next: Lib_Access_Runner_RequireAccess_Next): Lib_Access_Runner_RequireAccess_CallbackReturns => {
      if (request.get('Authorization') !== undefined) {
        if (await this.resolveToken(request, response, options['scope']) === true) {
          next();
        }

        return;
      }

      if (await this.resolveSession(request, response, options['mutation'], 'Sign in, or send a valid API token.') === true) {
        next();
      }

      return;
    });
  }

  /**
   * Access - Require Authentication.
   *
   * Accepts any valid personal access token, whatever its scopes, or a signed-in session.
   * Only identity and sign-out use it; every other route asks for a scope or a session.
   *
   * @param {Lib_Access_Runner_RequireAuthentication_Mutation} mutation - Mutation.
   *
   * @returns {Lib_Access_Runner_RequireAuthentication_Returns}
   *
   * @since 4.0.0
   */
  public requireAuthentication(mutation: Lib_Access_Runner_RequireAuthentication_Mutation): Lib_Access_Runner_RequireAuthentication_Returns {
    return handleAsync(async (request: Lib_Access_Runner_RequireAuthentication_Request, response: Lib_Access_Runner_RequireAuthentication_Response, next: Lib_Access_Runner_RequireAuthentication_Next): Lib_Access_Runner_RequireAuthentication_CallbackReturns => {
      if (request.get('Authorization') !== undefined) {
        if (await this.resolveToken(request, response, undefined) === true) {
          next();
        }

        return;
      }

      if (await this.resolveSession(request, response, mutation, 'Sign in to continue.') === true) {
        next();
      }

      return;
    });
  }

  /**
   * Access - Require Permission.
   *
   * Refuses callers whose role lacks a permission, whether they use a session or a token.
   * It runs after requireSession or requireAccess.
   *
   * @param {Lib_Access_Runner_RequirePermission_Permission} permission - Permission.
   *
   * @returns {Lib_Access_Runner_RequirePermission_Returns}
   *
   * @since 4.0.0
   */
  public requirePermission(permission: Lib_Access_Runner_RequirePermission_Permission): Lib_Access_Runner_RequirePermission_Returns {
    return (_request: Lib_Access_Runner_RequirePermission_Request, response: Lib_Access_Runner_RequirePermission_Response, next: Lib_Access_Runner_RequirePermission_Next): Lib_Access_Runner_RequirePermission_CallbackReturns => {
      const principal: Lib_Access_Runner_RequirePermission_Principal = getPrincipal(response);

      if (roleCan(principal['user']['role'], permission) === false) {
        sendError(response, 403, 'permission_required', permissionMessages[permission]);

        return;
      }

      next();

      return;
    };
  }

  /**
   * Access - Require Server.
   *
   * Checks the :serverId route parameter against the caller's server access and the database.
   * Unknown and inaccessible servers share one answer, so neither is revealed.
   *
   * @returns {Lib_Access_Runner_RequireServer_Returns}
   *
   * @since 4.0.0
   */
  public requireServer(): Lib_Access_Runner_RequireServer_Returns {
    return handleAsync(async (request: Lib_Access_Runner_RequireServer_Request, response: Lib_Access_Runner_RequireServer_Response, next: Lib_Access_Runner_RequireServer_Next): Lib_Access_Runner_RequireServer_CallbackReturns => {
      const principal: Lib_Access_Runner_RequireServer_Principal = getPrincipal(response);
      const rawServerId: Lib_Access_Runner_RequireServer_RawServerId = request.params['serverId'];
      const serverId: Lib_Access_Runner_RequireServer_ServerId = (typeof rawServerId === 'string') ? rawServerId : '';

      if (
        LIB_REGEX_PATTERN_DISCORD_IDENTIFIER.test(serverId) === false
        || serverAccessible(principal['user'], serverId) === false
      ) {
        sendError(response, 404, 'server_not_found', 'That Discord server isn\'t available.');

        return;
      }

      const existingServer: Lib_Access_Runner_RequireServer_ExistingServer = await this.#pool.query('SELECT guild_id FROM discord_servers WHERE guild_id = $1', [serverId]);

      if ((existingServer.rowCount ?? 0) === 0) {
        sendError(response, 404, 'server_not_found', 'That Discord server isn\'t available.');

        return;
      }

      Reflect.set(response.locals, 'serverId', serverId);

      next();

      return;
    });
  }

  /**
   * Access - Require Session.
   *
   * Allows only a signed-in browser session, never a personal access token.
   * Tokens therefore cannot manage tokens, passwords, users, or sign-in methods.
   *
   * @param {Lib_Access_Runner_RequireSession_Mutation} mutation - Mutation.
   *
   * @returns {Lib_Access_Runner_RequireSession_Returns}
   *
   * @since 4.0.0
   */
  public requireSession(mutation: Lib_Access_Runner_RequireSession_Mutation): Lib_Access_Runner_RequireSession_Returns {
    return handleAsync(async (request: Lib_Access_Runner_RequireSession_Request, response: Lib_Access_Runner_RequireSession_Response, next: Lib_Access_Runner_RequireSession_Next): Lib_Access_Runner_RequireSession_CallbackReturns => {
      if (request.get('Authorization') !== undefined) {
        sendError(response, 403, 'session_required', 'A signed-in browser session is required.');

        return;
      }

      if (await this.resolveSession(request, response, mutation, 'Sign in to continue.') === true) {
        next();
      }

      return;
    });
  }

  /**
   * Access - Has Valid Csrf.
   *
   * Requires the header to equal the readable cookie and to match the stored digest.
   * Digests are compared in constant time.
   *
   * @param {Lib_Access_Runner_HasValidCsrf_Request}  request  - Request.
   * @param {Lib_Access_Runner_HasValidCsrf_CsrfHash} csrfHash - Csrf hash.
   *
   * @private
   *
   * @returns {Lib_Access_Runner_HasValidCsrf_Returns}
   *
   * @since 4.0.0
   */
  private hasValidCsrf(request: Lib_Access_Runner_HasValidCsrf_Request, csrfHash: Lib_Access_Runner_HasValidCsrf_CsrfHash): Lib_Access_Runner_HasValidCsrf_Returns {
    const headerToken: Lib_Access_Runner_HasValidCsrf_HeaderToken = request.get('X-CSRF-Token');
    const cookieToken: Lib_Access_Runner_HasValidCsrf_CookieToken = readCookie(request, CSRF_COOKIE_NAME);

    if (
      headerToken === undefined
      || cookieToken === undefined
      || headerToken !== cookieToken
      || LIB_REGEX_PATTERN_CSRF_TOKEN.test(headerToken) === false
    ) {
      return false;
    }

    return digestsEqual(digestValue(headerToken), csrfHash);
  }

  /**
   * Access - Resolve Session.
   *
   * Loads the browser session from its cookie and stores the caller on the response.
   * It answers the request itself when the session is missing or the CSRF check fails.
   *
   * @param {Lib_Access_Runner_ResolveSession_Request}  request  - Request.
   * @param {Lib_Access_Runner_ResolveSession_Response} response - Response.
   * @param {Lib_Access_Runner_ResolveSession_Mutation} mutation - Mutation.
   * @param {Lib_Access_Runner_ResolveSession_Message}  message  - Message.
   *
   * @private
   *
   * @returns {Lib_Access_Runner_ResolveSession_Returns}
   *
   * @since 4.0.0
   */
  private async resolveSession(request: Lib_Access_Runner_ResolveSession_Request, response: Lib_Access_Runner_ResolveSession_Response, mutation: Lib_Access_Runner_ResolveSession_Mutation, message: Lib_Access_Runner_ResolveSession_Message): Lib_Access_Runner_ResolveSession_Returns {
    const sessionToken: Lib_Access_Runner_ResolveSession_SessionToken = readCookie(request, SESSION_COOKIE_NAME);
    const session: Lib_Access_Runner_ResolveSession_Session = (
      sessionToken === undefined
      || LIB_REGEX_PATTERN_SESSION_TOKEN.test(sessionToken) === false
    ) ? undefined : await getPanelSession(this.#pool, sessionToken);

    if (sessionToken === undefined || session === undefined) {
      sendError(response, 401, 'authentication_required', message);

      return false;
    }

    if (mutation === true && this.hasValidCsrf(request, session['csrfHash']) === false) {
      sendError(response, 403, 'csrf_invalid', 'The request CSRF token is missing or invalid.');

      return false;
    }

    Reflect.set(response.locals, 'principal', {
      kind: 'session',
      sessionToken,
      token: undefined,
      user: session['user'],
    });

    return true;
  }

  /**
   * Access - Resolve Token.
   *
   * Authenticates a bearer token, checks its scope when one is given, and stores the caller.
   * It answers the request itself when the token is invalid or lacks the scope.
   *
   * @param {Lib_Access_Runner_ResolveToken_Request}  request  - Request.
   * @param {Lib_Access_Runner_ResolveToken_Response} response - Response.
   * @param {Lib_Access_Runner_ResolveToken_Scope}    scope    - Scope.
   *
   * @private
   *
   * @returns {Lib_Access_Runner_ResolveToken_Returns}
   *
   * @since 4.0.0
   */
  private async resolveToken(request: Lib_Access_Runner_ResolveToken_Request, response: Lib_Access_Runner_ResolveToken_Response, scope: Lib_Access_Runner_ResolveToken_Scope): Lib_Access_Runner_ResolveToken_Returns {
    const rawToken: Lib_Access_Runner_ResolveToken_RawToken = getBearerToken(request);
    const accessToken: Lib_Access_Runner_ResolveToken_AccessToken = (rawToken === undefined) ? undefined : await authenticatePanelToken(this.#pool, rawToken);

    if (accessToken === undefined) {
      sendError(response, 401, 'authentication_required', 'A valid personal access token is required.');

      return false;
    }

    if (scope !== undefined && accessToken['scopes'].includes(scope) === false) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${scope} scope.`);

      return false;
    }

    Reflect.set(response.locals, 'principal', {
      kind: 'token',
      sessionToken: undefined,
      token: {
        id: accessToken['id'],
        name: accessToken['name'],
        scopes: accessToken['scopes'],
      },
      user: accessToken['user'],
    });

    return true;
  }
}
