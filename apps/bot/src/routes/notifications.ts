import { getPrincipal } from '../lib/access.js';
import {
  handleAsync,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import { writeLog } from '../lib/logger.js';
import {
  createNotificationTarget,
  getNotificationTarget,
  isNotificationTargetId,
  listNotificationTargets,
  removeNotificationTarget,
  updateNotificationTarget,
} from '../lib/notification-targets.js';
import {
  notificationInputSchema,
  notificationServiceBody,
  splitNotificationSettings,
} from '../lib/notifications.js';
import {
  notificationEvents,
  sendTestNotification,
} from '../lib/notifier.js';

import type {
  Routes_Notifications_Runner_Access,
  Routes_Notifications_Runner_Constructor_Access,
  Routes_Notifications_Runner_Constructor_Context,
  Routes_Notifications_Runner_Context,
  Routes_Notifications_Runner_EventKeys_Returns,
  Routes_Notifications_Runner_GetNotificationId_NotificationId,
  Routes_Notifications_Runner_GetNotificationId_Request,
  Routes_Notifications_Runner_GetNotificationId_Returns,
  Routes_Notifications_Runner_Register_App,
  Routes_Notifications_Runner_Register_Returns,
  Routes_Notifications_Runner_RouteCreate_Principal,
  Routes_Notifications_Runner_RouteCreate_Request,
  Routes_Notifications_Runner_RouteCreate_RequestBody,
  Routes_Notifications_Runner_RouteCreate_Response,
  Routes_Notifications_Runner_RouteCreate_Result,
  Routes_Notifications_Runner_RouteCreate_Returns,
  Routes_Notifications_Runner_RouteCreate_ServiceBody,
  Routes_Notifications_Runner_RouteCreate_Split,
  Routes_Notifications_Runner_RouteDelete_Name,
  Routes_Notifications_Runner_RouteDelete_NotificationId,
  Routes_Notifications_Runner_RouteDelete_Principal,
  Routes_Notifications_Runner_RouteDelete_Request,
  Routes_Notifications_Runner_RouteDelete_Response,
  Routes_Notifications_Runner_RouteDelete_Returns,
  Routes_Notifications_Runner_RouteEvents_Request,
  Routes_Notifications_Runner_RouteEvents_Response,
  Routes_Notifications_Runner_RouteEvents_Returns,
  Routes_Notifications_Runner_RouteList_Request,
  Routes_Notifications_Runner_RouteList_Response,
  Routes_Notifications_Runner_RouteList_Returns,
  Routes_Notifications_Runner_RouteTest_NotificationId,
  Routes_Notifications_Runner_RouteTest_Request,
  Routes_Notifications_Runner_RouteTest_Response,
  Routes_Notifications_Runner_RouteTest_Result,
  Routes_Notifications_Runner_RouteTest_Returns,
  Routes_Notifications_Runner_RouteUpdate_ExistingTarget,
  Routes_Notifications_Runner_RouteUpdate_NotificationId,
  Routes_Notifications_Runner_RouteUpdate_Principal,
  Routes_Notifications_Runner_RouteUpdate_Request,
  Routes_Notifications_Runner_RouteUpdate_RequestBody,
  Routes_Notifications_Runner_RouteUpdate_Response,
  Routes_Notifications_Runner_RouteUpdate_Result,
  Routes_Notifications_Runner_RouteUpdate_Returns,
  Routes_Notifications_Runner_RouteUpdate_Split,
  Routes_Notifications_Runner_SendNameTaken_Response,
  Routes_Notifications_Runner_SendNameTaken_Returns,
  Routes_Notifications_Runner_SendNotFound_Response,
  Routes_Notifications_Runner_SendNotFound_Returns,
} from '../types/routes/notifications.d.ts';

/**
 * Notifications.
 *
 * Lets people who can change settings add, edit, test, and remove notification destinations.
 * Paths, bodies, and words match the other appliances.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Notifications - Access.
   *
   * Restricts every route here to a signed-in browser session that can change settings.
   * Mutations also need the session's CSRF header.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Notifications_Runner_Access;

  /**
   * Notifications - Context.
   *
   * Supplies the database pool and the credential key that seals destination secrets.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Notifications_Runner_Context;

  /**
   * Notifications - Constructor.
   *
   * Binds the notification routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Notifications_Runner_Constructor_Context} context - Context.
   * @param {Routes_Notifications_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Notifications_Runner_Constructor_Context, access: Routes_Notifications_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Notifications - Register.
   *
   * Installs the list, events, create, update, remove, and test routes.
   * Personal access tokens are refused on all of them.
   *
   * @param {Routes_Notifications_Runner_Register_App} app - App.
   *
   * @returns {Routes_Notifications_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Notifications_Runner_Register_App): Routes_Notifications_Runner_Register_Returns {
    app.get('/api/v1/notifications', this.#access.requireSession(false), this.#access.requirePermission('configuration:write'), handleAsync(this['routeList'].bind(this)));

    app.get('/api/v1/notifications/events', this.#access.requireSession(false), this.#access.requirePermission('configuration:write'), this['routeEvents'].bind(this));

    app.post('/api/v1/notifications', this.#access.requireSession(true), this.#access.requirePermission('configuration:write'), handleAsync(this['routeCreate'].bind(this)));

    app.put('/api/v1/notifications/:notificationId', this.#access.requireSession(true), this.#access.requirePermission('configuration:write'), handleAsync(this['routeUpdate'].bind(this)));

    app.delete('/api/v1/notifications/:notificationId', this.#access.requireSession(true), this.#access.requirePermission('configuration:write'), handleAsync(this['routeDelete'].bind(this)));

    app.post('/api/v1/notifications/:notificationId/test', this.#access.requireSession(true), this.#access.requirePermission('configuration:write'), handleAsync(this['routeTest'].bind(this)));

    return;
  }

  /**
   * Notifications - Event Keys.
   *
   * Lists the keys of the events a destination may choose.
   * The input check refuses any other key.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_EventKeys_Returns}
   *
   * @since 4.0.0
   */
  private eventKeys(): Routes_Notifications_Runner_EventKeys_Returns {
    return notificationEvents.map((event) => event['key']);
  }

  /**
   * Notifications - Get Notification ID.
   *
   * Reads the destination id from the path when it has the right shape.
   * Any other value is answered like a destination that no longer exists.
   *
   * @param {Routes_Notifications_Runner_GetNotificationId_Request} request - Request.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_GetNotificationId_Returns}
   *
   * @since 4.0.0
   */
  private getNotificationId(request: Routes_Notifications_Runner_GetNotificationId_Request): Routes_Notifications_Runner_GetNotificationId_Returns {
    const notificationId: Routes_Notifications_Runner_GetNotificationId_NotificationId = request.params['notificationId'];

    if (typeof notificationId !== 'string' || isNotificationTargetId(notificationId) === false) {
      return undefined;
    }

    return notificationId;
  }

  /**
   * Notifications - Route Create.
   *
   * Adds a destination after checking its service fields and events.
   * Secret fields are sealed before they are stored.
   *
   * @param {Routes_Notifications_Runner_RouteCreate_Request}  request  - Request.
   * @param {Routes_Notifications_Runner_RouteCreate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_RouteCreate_Returns}
   *
   * @since 4.0.0
   */
  private async routeCreate(request: Routes_Notifications_Runner_RouteCreate_Request, response: Routes_Notifications_Runner_RouteCreate_Response): Routes_Notifications_Runner_RouteCreate_Returns {
    const serviceBody: Routes_Notifications_Runner_RouteCreate_ServiceBody = notificationServiceBody.safeParse(request.body);

    if (serviceBody.success === false) {
      sendValidationError(response, 422, serviceBody.error, 'Check the highlighted fields.');

      return;
    }

    const requestBody: Routes_Notifications_Runner_RouteCreate_RequestBody = notificationInputSchema(serviceBody.data['service'], this.eventKeys(), [], []).safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    const split: Routes_Notifications_Runner_RouteCreate_Split = splitNotificationSettings(serviceBody.data['service'], requestBody.data['settings']);
    const principal: Routes_Notifications_Runner_RouteCreate_Principal = getPrincipal(response);
    const result: Routes_Notifications_Runner_RouteCreate_Result = await createNotificationTarget(this.#context['pool'], this.#context['credentialKey'], {
      events: requestBody.data['events'],
      name: requestBody.data['name'],
      secrets: split['secrets'],
      service: serviceBody.data['service'],
      settings: split['settings'],
    });

    if (result === 'name-taken') {
      this.sendNameTaken(response);

      return;
    }

    writeLog('info', 'web', 'notification_created', {
      notificationId: result['id'],
      notificationName: result['name'],
      service: result['service'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.status(201).json(result);

    return;
  }

  /**
   * Notifications - Route Delete.
   *
   * Removes a destination. Alerts stop going to it right away.
   * Its lost-key notice item goes with it.
   *
   * @param {Routes_Notifications_Runner_RouteDelete_Request}  request  - Request.
   * @param {Routes_Notifications_Runner_RouteDelete_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_RouteDelete_Returns}
   *
   * @since 4.0.0
   */
  private async routeDelete(request: Routes_Notifications_Runner_RouteDelete_Request, response: Routes_Notifications_Runner_RouteDelete_Response): Routes_Notifications_Runner_RouteDelete_Returns {
    const notificationId: Routes_Notifications_Runner_RouteDelete_NotificationId = this.getNotificationId(request);

    if (notificationId === undefined) {
      this.sendNotFound(response);

      return;
    }

    const name: Routes_Notifications_Runner_RouteDelete_Name = await removeNotificationTarget(this.#context['pool'], notificationId);

    if (name === undefined) {
      this.sendNotFound(response);

      return;
    }

    const principal: Routes_Notifications_Runner_RouteDelete_Principal = getPrincipal(response);

    writeLog('info', 'web', 'notification_removed', {
      notificationId,
      notificationName: name,
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Notifications - Route Events.
   *
   * Lists the events a destination can hear about, with the ones checked by default.
   * The words match the other appliances.
   *
   * @param {Routes_Notifications_Runner_RouteEvents_Request}  _request - Request.
   * @param {Routes_Notifications_Runner_RouteEvents_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_RouteEvents_Returns}
   *
   * @since 4.0.0
   */
  private routeEvents(_request: Routes_Notifications_Runner_RouteEvents_Request, response: Routes_Notifications_Runner_RouteEvents_Response): Routes_Notifications_Runner_RouteEvents_Returns {
    response.json({
      items: notificationEvents.map((event) => ({
        defaultEnabled: event['defaultEnabled'],
        description: event['description'],
        key: event['key'],
        label: event['label'],
      })),
    });

    return;
  }

  /**
   * Notifications - Route List.
   *
   * Lists every destination, newest first.
   * Saved secrets are only listed by field name.
   *
   * @param {Routes_Notifications_Runner_RouteList_Request}  _request - Request.
   * @param {Routes_Notifications_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_RouteList_Returns}
   *
   * @since 4.0.0
   */
  private async routeList(_request: Routes_Notifications_Runner_RouteList_Request, response: Routes_Notifications_Runner_RouteList_Response): Routes_Notifications_Runner_RouteList_Returns {
    response.json({
      items: await listNotificationTargets(this.#context['pool']),
    });

    return;
  }

  /**
   * Notifications - Route Test.
   *
   * Sends the test notification to one destination and says whether it went out.
   * A refused send is an answer, not an error.
   *
   * @param {Routes_Notifications_Runner_RouteTest_Request}  request  - Request.
   * @param {Routes_Notifications_Runner_RouteTest_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_RouteTest_Returns}
   *
   * @since 4.0.0
   */
  private async routeTest(request: Routes_Notifications_Runner_RouteTest_Request, response: Routes_Notifications_Runner_RouteTest_Response): Routes_Notifications_Runner_RouteTest_Returns {
    const notificationId: Routes_Notifications_Runner_RouteTest_NotificationId = this.getNotificationId(request);

    if (notificationId === undefined) {
      this.sendNotFound(response);

      return;
    }

    const result: Routes_Notifications_Runner_RouteTest_Result = await sendTestNotification(this.#context['pool'], this.#context['credentialKey'], notificationId);

    if (result === 'not-found') {
      this.sendNotFound(response);

      return;
    }

    if (result === 'secrets-missing') {
      response.json({
        delivered: false,
        message: 'Enter the removed secrets again first.',
      });

      return;
    }

    response.json(result);

    return;
  }

  /**
   * Notifications - Route Update.
   *
   * Changes a destination's name, events, and settings. Its service never changes.
   * A secret field left blank keeps its saved value.
   *
   * @param {Routes_Notifications_Runner_RouteUpdate_Request}  request  - Request.
   * @param {Routes_Notifications_Runner_RouteUpdate_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_RouteUpdate_Returns}
   *
   * @since 4.0.0
   */
  private async routeUpdate(request: Routes_Notifications_Runner_RouteUpdate_Request, response: Routes_Notifications_Runner_RouteUpdate_Response): Routes_Notifications_Runner_RouteUpdate_Returns {
    const notificationId: Routes_Notifications_Runner_RouteUpdate_NotificationId = this.getNotificationId(request);
    const existingTarget: Routes_Notifications_Runner_RouteUpdate_ExistingTarget = (notificationId === undefined) ? undefined : await getNotificationTarget(this.#context['pool'], notificationId);

    if (notificationId === undefined || existingTarget === undefined) {
      this.sendNotFound(response);

      return;
    }

    const requestBody: Routes_Notifications_Runner_RouteUpdate_RequestBody = notificationInputSchema(existingTarget['service'], this.eventKeys(), Object.keys(existingTarget['secrets']), existingTarget['secretsMissing']).safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    const split: Routes_Notifications_Runner_RouteUpdate_Split = splitNotificationSettings(existingTarget['service'], requestBody.data['settings']);
    const principal: Routes_Notifications_Runner_RouteUpdate_Principal = getPrincipal(response);
    const result: Routes_Notifications_Runner_RouteUpdate_Result = await updateNotificationTarget(this.#context['pool'], this.#context['credentialKey'], notificationId, {
      clearSecrets: requestBody.data['clearSecrets'],
      events: requestBody.data['events'],
      name: requestBody.data['name'],
      secrets: split['secrets'],
      settings: split['settings'],
    });

    if (result === 'not-found') {
      this.sendNotFound(response);

      return;
    }

    if (result === 'name-taken') {
      this.sendNameTaken(response);

      return;
    }

    writeLog('info', 'web', 'notification_updated', {
      notificationId: result['id'],
      notificationName: result['name'],
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json(result);

    return;
  }

  /**
   * Notifications - Send Name Taken.
   *
   * Answers a name another destination already uses, on the name field.
   * Names are compared without letter case.
   *
   * @param {Routes_Notifications_Runner_SendNameTaken_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_SendNameTaken_Returns}
   *
   * @since 4.0.0
   */
  private sendNameTaken(response: Routes_Notifications_Runner_SendNameTaken_Response): Routes_Notifications_Runner_SendNameTaken_Returns {
    sendError(response, 409, 'notification_exists', 'A notification with this name already exists.', [{
      field: 'name',
      message: 'A notification with this name already exists.',
      path: ['name'],
    }]);

    return;
  }

  /**
   * Notifications - Send Not Found.
   *
   * Answers a destination id that doesn't exist or never could.
   * Both look the same to the caller.
   *
   * @param {Routes_Notifications_Runner_SendNotFound_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Notifications_Runner_SendNotFound_Returns}
   *
   * @since 4.0.0
   */
  private sendNotFound(response: Routes_Notifications_Runner_SendNotFound_Response): Routes_Notifications_Runner_SendNotFound_Returns {
    sendError(response, 404, 'notification_not_found', 'That notification no longer exists.');

    return;
  }
}
