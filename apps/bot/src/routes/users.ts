import { getPrincipal } from '../lib/access.js';
import {
  userCreate,
  userPasswordReset,
  userUpdate,
} from '../lib/account-schemas.js';
import {
  handleAsync,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import { writeLog } from '../lib/logger.js';
import {
  createPanelUser,
  deletePanelUser,
  getPanelUser,
  listPanelUsers,
  resetPanelUserPassword,
  resetPanelUserTwoFactor,
  updatePanelUser,
} from '../lib/panel-users.js';
import { LIB_REGEX_PATTERN_POSITIVE_INTEGER } from '../lib/regex.js';

import type {
  Routes_Users_CanManage_Caller,
  Routes_Users_CanManage_Returns,
  Routes_Users_CanManage_Target,
  Routes_Users_DescribeUser_Caller,
  Routes_Users_DescribeUser_Returns,
  Routes_Users_DescribeUser_User,
  Routes_Users_Runner_Access,
  Routes_Users_Runner_Constructor_Access,
  Routes_Users_Runner_Constructor_Context,
  Routes_Users_Runner_Context,
  Routes_Users_Runner_FindTarget_Principal,
  Routes_Users_Runner_FindTarget_Request,
  Routes_Users_Runner_FindTarget_Response,
  Routes_Users_Runner_FindTarget_Returns,
  Routes_Users_Runner_FindTarget_Target,
  Routes_Users_Runner_FindTarget_UserId,
  Routes_Users_Runner_IsGrantRefused_AllServers,
  Routes_Users_Runner_IsGrantRefused_Principal,
  Routes_Users_Runner_IsGrantRefused_Response,
  Routes_Users_Runner_IsGrantRefused_Returns,
  Routes_Users_Runner_IsGrantRefused_ServerIds,
  Routes_Users_Runner_Register_App,
  Routes_Users_Runner_Register_Returns,
  Routes_Users_Runner_RouteCreate_Principal,
  Routes_Users_Runner_RouteCreate_Request,
  Routes_Users_Runner_RouteCreate_RequestBody,
  Routes_Users_Runner_RouteCreate_Response,
  Routes_Users_Runner_RouteCreate_Result,
  Routes_Users_Runner_RouteCreate_Returns,
  Routes_Users_Runner_RouteDelete_Principal,
  Routes_Users_Runner_RouteDelete_Request,
  Routes_Users_Runner_RouteDelete_Response,
  Routes_Users_Runner_RouteDelete_Returns,
  Routes_Users_Runner_RouteDelete_Target,
  Routes_Users_Runner_RouteDelete_Username,
  Routes_Users_Runner_RouteList_Principal,
  Routes_Users_Runner_RouteList_Request,
  Routes_Users_Runner_RouteList_Response,
  Routes_Users_Runner_RouteList_Returns,
  Routes_Users_Runner_RouteList_Users,
  Routes_Users_Runner_RouteResetPassword_Principal,
  Routes_Users_Runner_RouteResetPassword_Request,
  Routes_Users_Runner_RouteResetPassword_RequestBody,
  Routes_Users_Runner_RouteResetPassword_Reset,
  Routes_Users_Runner_RouteResetPassword_Response,
  Routes_Users_Runner_RouteResetPassword_Returns,
  Routes_Users_Runner_RouteResetPassword_Target,
  Routes_Users_Runner_RouteResetTwoFactor_Principal,
  Routes_Users_Runner_RouteResetTwoFactor_Request,
  Routes_Users_Runner_RouteResetTwoFactor_Reset,
  Routes_Users_Runner_RouteResetTwoFactor_Response,
  Routes_Users_Runner_RouteResetTwoFactor_Returns,
  Routes_Users_Runner_RouteResetTwoFactor_Target,
  Routes_Users_Runner_RouteUpdate_Principal,
  Routes_Users_Runner_RouteUpdate_Request,
  Routes_Users_Runner_RouteUpdate_RequestBody,
  Routes_Users_Runner_RouteUpdate_Response,
  Routes_Users_Runner_RouteUpdate_Result,
  Routes_Users_Runner_RouteUpdate_Returns,
  Routes_Users_Runner_RouteUpdate_Target,
  Routes_Users_UserIdMaximumLength,
} from '../types/routes/users.d.ts';

/**
 * Users - User ID Maximum Length.
 *
 * Caps user ids at 18 digits so a malformed id never reaches the BIGINT column.
 * Longer ids are answered like unknown ones.
 *
 * @since 4.0.0
 */
const USER_ID_MAXIMUM_LENGTH: Routes_Users_UserIdMaximumLength = 18;

/**
 * Users - Can Manage.
 *
 * Decides whether the caller may change a user: never the owner or their own account.
 * Scoped callers may only change users whose server access sits inside their own.
 *
 * @param {Routes_Users_CanManage_Caller} caller - Caller.
 * @param {Routes_Users_CanManage_Target} target - Target.
 *
 * @returns {Routes_Users_CanManage_Returns}
 *
 * @since 4.0.0
 */
function canManage(caller: Routes_Users_CanManage_Caller, target: Routes_Users_CanManage_Target): Routes_Users_CanManage_Returns {
  if (target['role'] === 'owner' || target['id'] === caller['id']) {
    return false;
  }

  if (caller['allServers'] === true) {
    return true;
  }

  return target['allServers'] === false && target['serverIds'].every((serverId) => caller['serverIds'].includes(serverId));
}

/**
 * Users - Describe User.
 *
 * Shapes a user for the caller and says whether the caller may change them.
 * Scoped callers only see the servers they can see themselves.
 *
 * @param {Routes_Users_DescribeUser_Caller} caller - Caller.
 * @param {Routes_Users_DescribeUser_User}   user   - User.
 *
 * @returns {Routes_Users_DescribeUser_Returns}
 *
 * @since 4.0.0
 */
function describeUser(caller: Routes_Users_DescribeUser_Caller, user: Routes_Users_DescribeUser_User): Routes_Users_DescribeUser_Returns {
  return {
    allServers: user['allServers'],
    createdAt: user['createdAt'],
    editable: canManage(caller, user),
    enabled: user['enabled'],
    id: user['id'],
    lastSignInAt: user['lastSignInAt'],
    passkeys: user['passkeys'],
    role: user['role'],
    serverIds: (caller['allServers'] === true) ? user['serverIds'] : user['serverIds'].filter((serverId) => caller['serverIds'].includes(serverId)),
    twoFactor: user['twoFactor'],
    username: user['username'],
  };
}

/**
 * Users.
 *
 * Lets the owner and administrators list, add, change, and remove panel users.
 * Every route needs a browser session with the users:manage permission.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Users - Access.
   *
   * Restricts every route here to a signed-in browser session whose role manages users.
   * Mutations also need the session's CSRF header.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Users_Runner_Access;

  /**
   * Users - Context.
   *
   * Supplies the database pool that stores users and their server access.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Users_Runner_Context;

  /**
   * Users - Constructor.
   *
   * Binds the user routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Users_Runner_Constructor_Context} context - Context.
   * @param {Routes_Users_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Users_Runner_Constructor_Context, access: Routes_Users_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Users - Register.
   *
   * Installs the list, create, update, password reset, two-step reset, and delete routes.
   * Each one checks the session before the users:manage permission.
   *
   * @param {Routes_Users_Runner_Register_App} app - App.
   *
   * @returns {Routes_Users_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Users_Runner_Register_App): Routes_Users_Runner_Register_Returns {
    app.get('/api/v1/users', this.#access.requireSession(false), this.#access.requirePermission('users:manage'), handleAsync(this['routeList'].bind(this)));

    app.post('/api/v1/users', this.#access.requireSession(true), this.#access.requirePermission('users:manage'), handleAsync(this['routeCreate'].bind(this)));

    app.put('/api/v1/users/:userId', this.#access.requireSession(true), this.#access.requirePermission('users:manage'), handleAsync(this['routeUpdate'].bind(this)));

    app.post('/api/v1/users/:userId/password', this.#access.requireSession(true), this.#access.requirePermission('users:manage'), handleAsync(this['routeResetPassword'].bind(this)));

    app.post('/api/v1/users/:userId/two-factor/reset', this.#access.requireSession(true), this.#access.requirePermission('users:manage'), handleAsync(this['routeResetTwoFactor'].bind(this)));

    app.delete('/api/v1/users/:userId', this.#access.requireSession(true), this.#access.requirePermission('users:manage'), handleAsync(this['routeDelete'].bind(this)));

    return;
  }

  /**
   * Users - Find Target.
   *
   * Loads the user named by the :userId route parameter and checks the caller may change them.
   * It answers the request itself when the user is unknown or protected.
   *
   * @param {Routes_Users_Runner_FindTarget_Request}  request  - Request.
   * @param {Routes_Users_Runner_FindTarget_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_FindTarget_Returns}
   *
   * @since 4.0.0
   */
  private async findTarget(request: Routes_Users_Runner_FindTarget_Request, response: Routes_Users_Runner_FindTarget_Response): Routes_Users_Runner_FindTarget_Returns {
    const userId: Routes_Users_Runner_FindTarget_UserId = request.params['userId'];
    const principal: Routes_Users_Runner_FindTarget_Principal = getPrincipal(response);

    if (
      typeof userId !== 'string'
      || userId.length > USER_ID_MAXIMUM_LENGTH
      || LIB_REGEX_PATTERN_POSITIVE_INTEGER.test(userId) === false
    ) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return undefined;
    }

    const target: Routes_Users_Runner_FindTarget_Target = await getPanelUser(this.#context['pool'], userId);

    if (target === undefined) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return undefined;
    }

    if (canManage(principal['user'], target) === false) {
      sendError(response, 403, 'user_protected', 'You can\'t change this account here.');

      return undefined;
    }

    return target;
  }

  /**
   * Users - Is Grant Refused.
   *
   * Refuses server access that a scoped caller doesn't have themselves.
   * Callers with access to every server may grant any server.
   *
   * @param {Routes_Users_Runner_IsGrantRefused_Response}   response   - Response.
   * @param {Routes_Users_Runner_IsGrantRefused_AllServers} allServers - All servers.
   * @param {Routes_Users_Runner_IsGrantRefused_ServerIds}  serverIds  - Server ids.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_IsGrantRefused_Returns}
   *
   * @since 4.0.0
   */
  private isGrantRefused(response: Routes_Users_Runner_IsGrantRefused_Response, allServers: Routes_Users_Runner_IsGrantRefused_AllServers, serverIds: Routes_Users_Runner_IsGrantRefused_ServerIds): Routes_Users_Runner_IsGrantRefused_Returns {
    const principal: Routes_Users_Runner_IsGrantRefused_Principal = getPrincipal(response);

    if (principal['user']['allServers'] === true) {
      return false;
    }

    if (allServers === true) {
      sendError(response, 422, 'invalid_request', 'You can only give access to servers you can see.', [{
        field: 'allServers',
        message: 'You can only give access to servers you can see.',
        path: ['allServers'],
      }]);

      return true;
    }

    if (serverIds.every((serverId) => principal['user']['serverIds'].includes(serverId)) === false) {
      sendError(response, 422, 'invalid_request', 'You can only give access to servers you can see.', [{
        field: 'serverIds',
        message: 'You can only give access to servers you can see.',
        path: ['serverIds'],
      }]);

      return true;
    }

    return false;
  }

  /**
   * Users - Route Create.
   *
   * Adds a panel user with a role, a password, and server access.
   * Usernames are unique ignoring letter case.
   *
   * @param {Routes_Users_Runner_RouteCreate_Request}  request  - Request.
   * @param {Routes_Users_Runner_RouteCreate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_RouteCreate_Returns}
   *
   * @since 4.0.0
   */
  private async routeCreate(request: Routes_Users_Runner_RouteCreate_Request, response: Routes_Users_Runner_RouteCreate_Response): Routes_Users_Runner_RouteCreate_Returns {
    const requestBody: Routes_Users_Runner_RouteCreate_RequestBody = userCreate.safeParse(request.body);
    const principal: Routes_Users_Runner_RouteCreate_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (this.isGrantRefused(response, requestBody.data['allServers'], requestBody.data['serverIds']) === true) {
      return;
    }

    const result: Routes_Users_Runner_RouteCreate_Result = await createPanelUser(this.#context['pool'], {
      allServers: requestBody.data['allServers'],
      password: requestBody.data['password'],
      role: requestBody.data['role'],
      serverIds: (requestBody.data['allServers'] === true) ? [] : requestBody.data['serverIds'],
      username: requestBody.data['username'],
    });

    if (result === 'username-taken') {
      sendError(response, 409, 'username_taken', 'That username is already in use.', [{
        field: 'username',
        message: 'That username is already in use.',
        path: ['username'],
      }]);

      return;
    }

    if (result === 'server-unknown') {
      sendError(response, 422, 'invalid_request', 'Choose servers from the list.', [{
        field: 'serverIds',
        message: 'Choose servers from the list.',
        path: ['serverIds'],
      }]);

      return;
    }

    writeLog('info', 'web', 'user_created', {
      role: result['role'],
      targetUserId: result['id'],
      targetUsername: result['username'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.status(201).json(describeUser(principal['user'], result));

    return;
  }

  /**
   * Users - Route Delete.
   *
   * Removes a panel user with their sessions, tokens, and sign-in methods.
   * The owner and the caller's own account can't be removed here.
   *
   * @param {Routes_Users_Runner_RouteDelete_Request}  request  - Request.
   * @param {Routes_Users_Runner_RouteDelete_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_RouteDelete_Returns}
   *
   * @since 4.0.0
   */
  private async routeDelete(request: Routes_Users_Runner_RouteDelete_Request, response: Routes_Users_Runner_RouteDelete_Response): Routes_Users_Runner_RouteDelete_Returns {
    const target: Routes_Users_Runner_RouteDelete_Target = await this.findTarget(request, response);
    const principal: Routes_Users_Runner_RouteDelete_Principal = getPrincipal(response);

    if (target === undefined) {
      return;
    }

    const username: Routes_Users_Runner_RouteDelete_Username = await deletePanelUser(this.#context['pool'], target['id']);

    if (username === undefined) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return;
    }

    writeLog('info', 'web', 'user_deleted', {
      targetUserId: target['id'],
      targetUsername: username,
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Users - Route List.
   *
   * Lists every panel user, the owner first, then administrators, operators, and viewers.
   * Each user says whether the caller may change them.
   *
   * @param {Routes_Users_Runner_RouteList_Request}  _request - Request.
   * @param {Routes_Users_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_RouteList_Returns}
   *
   * @since 4.0.0
   */
  private async routeList(_request: Routes_Users_Runner_RouteList_Request, response: Routes_Users_Runner_RouteList_Response): Routes_Users_Runner_RouteList_Returns {
    const principal: Routes_Users_Runner_RouteList_Principal = getPrincipal(response);
    const users: Routes_Users_Runner_RouteList_Users = await listPanelUsers(this.#context['pool']);

    response.json({
      items: users.map((user) => describeUser(principal['user'], user)),
    });

    return;
  }

  /**
   * Users - Route Reset Password.
   *
   * Sets a new password for a user and signs them out everywhere.
   * Their tokens keep working, because tokens don't depend on the password.
   *
   * @param {Routes_Users_Runner_RouteResetPassword_Request}  request  - Request.
   * @param {Routes_Users_Runner_RouteResetPassword_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_RouteResetPassword_Returns}
   *
   * @since 4.0.0
   */
  private async routeResetPassword(request: Routes_Users_Runner_RouteResetPassword_Request, response: Routes_Users_Runner_RouteResetPassword_Response): Routes_Users_Runner_RouteResetPassword_Returns {
    const target: Routes_Users_Runner_RouteResetPassword_Target = await this.findTarget(request, response);
    const principal: Routes_Users_Runner_RouteResetPassword_Principal = getPrincipal(response);

    if (target === undefined) {
      return;
    }

    const requestBody: Routes_Users_Runner_RouteResetPassword_RequestBody = userPasswordReset.safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    const reset: Routes_Users_Runner_RouteResetPassword_Reset = await resetPanelUserPassword(this.#context['pool'], target['id'], requestBody.data['password']);

    if (reset === false) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return;
    }

    writeLog('info', 'web', 'user_password_reset', {
      targetUserId: target['id'],
      targetUsername: target['username'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Users - Route Reset Two Factor.
   *
   * Removes a user's authenticator app, recovery codes, and passkeys.
   * They sign in with their password alone until they set them up again.
   *
   * @param {Routes_Users_Runner_RouteResetTwoFactor_Request}  request  - Request.
   * @param {Routes_Users_Runner_RouteResetTwoFactor_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_RouteResetTwoFactor_Returns}
   *
   * @since 4.0.0
   */
  private async routeResetTwoFactor(request: Routes_Users_Runner_RouteResetTwoFactor_Request, response: Routes_Users_Runner_RouteResetTwoFactor_Response): Routes_Users_Runner_RouteResetTwoFactor_Returns {
    const target: Routes_Users_Runner_RouteResetTwoFactor_Target = await this.findTarget(request, response);
    const principal: Routes_Users_Runner_RouteResetTwoFactor_Principal = getPrincipal(response);

    if (target === undefined) {
      return;
    }

    const reset: Routes_Users_Runner_RouteResetTwoFactor_Reset = await resetPanelUserTwoFactor(this.#context['pool'], target['id']);

    if (reset === false) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return;
    }

    writeLog('info', 'web', 'user_two_factor_reset', {
      targetUserId: target['id'],
      targetUsername: target['username'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Users - Route Update.
   *
   * Changes a user's role, server access, and whether they can sign in.
   * Suspending a user signs them out and stops their tokens.
   *
   * @param {Routes_Users_Runner_RouteUpdate_Request}  request  - Request.
   * @param {Routes_Users_Runner_RouteUpdate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Users_Runner_RouteUpdate_Returns}
   *
   * @since 4.0.0
   */
  private async routeUpdate(request: Routes_Users_Runner_RouteUpdate_Request, response: Routes_Users_Runner_RouteUpdate_Response): Routes_Users_Runner_RouteUpdate_Returns {
    const target: Routes_Users_Runner_RouteUpdate_Target = await this.findTarget(request, response);
    const principal: Routes_Users_Runner_RouteUpdate_Principal = getPrincipal(response);

    if (target === undefined) {
      return;
    }

    const requestBody: Routes_Users_Runner_RouteUpdate_RequestBody = userUpdate.safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (this.isGrantRefused(response, requestBody.data['allServers'], requestBody.data['serverIds']) === true) {
      return;
    }

    const result: Routes_Users_Runner_RouteUpdate_Result = await updatePanelUser(this.#context['pool'], target['id'], {
      allServers: requestBody.data['allServers'],
      enabled: requestBody.data['enabled'],
      role: requestBody.data['role'],
      serverIds: (requestBody.data['allServers'] === true) ? [] : requestBody.data['serverIds'],
    });

    if (result === 'not-found') {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return;
    }

    if (result === 'server-unknown') {
      sendError(response, 422, 'invalid_request', 'Choose servers from the list.', [{
        field: 'serverIds',
        message: 'Choose servers from the list.',
        path: ['serverIds'],
      }]);

      return;
    }

    writeLog('info', 'web', 'user_updated', {
      allServers: result['allServers'],
      enabled: result['enabled'],
      role: result['role'],
      serverIds: result['serverIds'],
      targetUserId: result['id'],
      targetUsername: result['username'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json(describeUser(principal['user'], result));

    return;
  }
}
