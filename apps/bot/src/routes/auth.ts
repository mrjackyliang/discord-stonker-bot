import {
  getPrincipal,
  roleCan,
} from '../lib/access.js';
import {
  passkeySignInVerify,
  setupClaim,
  signIn,
  signInSecondFactor,
} from '../lib/account-schemas.js';
import {
  getClientLimitKey,
  getWebauthnConfiguration,
  handleAsync,
  isPasskeyAvailable,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import { writeLog } from '../lib/logger.js';
import {
  authenticatePanelUser,
  consumePanelRecoveryCode,
  createPanelSignInChallenge,
  deletePanelSignInChallenge,
  getPanelAccount,
  getPanelSignInChallenge,
  recordPanelSignInChallengeFailure,
  verifyPanelTotp,
} from '../lib/panel-auth.js';
import { deletePanelSession } from '../lib/panel-sessions.js';
import {
  claimPanelSetup,
  getPanelSetupStatus,
} from '../lib/panel-setup.js';
import {
  createPanelWebauthnCeremony,
  createPasskeyAuthenticationOptions,
  getPanelPasskey,
  takePanelWebauthnCeremony,
  updatePanelPasskeyUsage,
  verifyPasskeyAuthentication,
} from '../lib/passkey-auth.js';
import { LIB_REGEX_PATTERN_TOTP_TOKEN } from '../lib/regex.js';
import {
  dismissRemovedSecrets,
  listRemovedSecrets,
} from '../lib/removed-secrets.js';

import type {
  Routes_Auth_Permissions,
  Routes_Auth_RpName,
  Routes_Auth_Runner_Access,
  Routes_Auth_Runner_Attempts,
  Routes_Auth_Runner_Constructor_Access,
  Routes_Auth_Runner_Constructor_Attempts,
  Routes_Auth_Runner_Constructor_Context,
  Routes_Auth_Runner_Context,
  Routes_Auth_Runner_IsRateLimited_Key,
  Routes_Auth_Runner_IsRateLimited_Message,
  Routes_Auth_Runner_IsRateLimited_Response,
  Routes_Auth_Runner_IsRateLimited_Returns,
  Routes_Auth_Runner_Register_App,
  Routes_Auth_Runner_Register_Returns,
  Routes_Auth_Runner_RejectPasskey_Key,
  Routes_Auth_Runner_RejectPasskey_Message,
  Routes_Auth_Runner_RejectPasskey_Response,
  Routes_Auth_Runner_RejectPasskey_Returns,
  Routes_Auth_Runner_RouteClaim_AttemptKey,
  Routes_Auth_Runner_RouteClaim_Request,
  Routes_Auth_Runner_RouteClaim_RequestBody,
  Routes_Auth_Runner_RouteClaim_Response,
  Routes_Auth_Runner_RouteClaim_Result,
  Routes_Auth_Runner_RouteClaim_Returns,
  Routes_Auth_Runner_RouteClaim_Status,
  Routes_Auth_Runner_RouteCurrentPrincipal_Principal,
  Routes_Auth_Runner_RouteCurrentPrincipal_Request,
  Routes_Auth_Runner_RouteCurrentPrincipal_Response,
  Routes_Auth_Runner_RouteCurrentPrincipal_Returns,
  Routes_Auth_Runner_RouteDismissRemovedSecrets_Principal,
  Routes_Auth_Runner_RouteDismissRemovedSecrets_Request,
  Routes_Auth_Runner_RouteDismissRemovedSecrets_Response,
  Routes_Auth_Runner_RouteDismissRemovedSecrets_Returns,
  Routes_Auth_Runner_RouteLogin_AttemptKey,
  Routes_Auth_Runner_RouteLogin_Challenge,
  Routes_Auth_Runner_RouteLogin_IsOverlong,
  Routes_Auth_Runner_RouteLogin_Request,
  Routes_Auth_Runner_RouteLogin_RequestBody,
  Routes_Auth_Runner_RouteLogin_Response,
  Routes_Auth_Runner_RouteLogin_Returns,
  Routes_Auth_Runner_RouteLogin_User,
  Routes_Auth_Runner_RouteLogout_Principal,
  Routes_Auth_Runner_RouteLogout_Request,
  Routes_Auth_Runner_RouteLogout_Response,
  Routes_Auth_Runner_RouteLogout_Returns,
  Routes_Auth_Runner_RoutePasskeyOptions_CeremonyId,
  Routes_Auth_Runner_RoutePasskeyOptions_Configuration,
  Routes_Auth_Runner_RoutePasskeyOptions_Options,
  Routes_Auth_Runner_RoutePasskeyOptions_Request,
  Routes_Auth_Runner_RoutePasskeyOptions_Response,
  Routes_Auth_Runner_RoutePasskeyOptions_Returns,
  Routes_Auth_Runner_RoutePasskeyVerify_Account,
  Routes_Auth_Runner_RoutePasskeyVerify_AttemptKey,
  Routes_Auth_Runner_RoutePasskeyVerify_Ceremony,
  Routes_Auth_Runner_RoutePasskeyVerify_Configuration,
  Routes_Auth_Runner_RoutePasskeyVerify_Credential,
  Routes_Auth_Runner_RoutePasskeyVerify_Passkey,
  Routes_Auth_Runner_RoutePasskeyVerify_Request,
  Routes_Auth_Runner_RoutePasskeyVerify_RequestBody,
  Routes_Auth_Runner_RoutePasskeyVerify_Response,
  Routes_Auth_Runner_RoutePasskeyVerify_Returns,
  Routes_Auth_Runner_RoutePasskeyVerify_Updated,
  Routes_Auth_Runner_RoutePasskeyVerify_Usage,
  Routes_Auth_Runner_RouteSecondFactor_Account,
  Routes_Auth_Runner_RouteSecondFactor_AttemptKey,
  Routes_Auth_Runner_RouteSecondFactor_IsExhausted,
  Routes_Auth_Runner_RouteSecondFactor_IsOverlong,
  Routes_Auth_Runner_RouteSecondFactor_IsTotpCode,
  Routes_Auth_Runner_RouteSecondFactor_IsValid,
  Routes_Auth_Runner_RouteSecondFactor_Request,
  Routes_Auth_Runner_RouteSecondFactor_RequestBody,
  Routes_Auth_Runner_RouteSecondFactor_Response,
  Routes_Auth_Runner_RouteSecondFactor_Returns,
  Routes_Auth_Runner_RouteSecondFactor_UserId,
  Routes_Auth_Runner_RouteSetupStatus_Request,
  Routes_Auth_Runner_RouteSetupStatus_Response,
  Routes_Auth_Runner_RouteSetupStatus_Returns,
} from '../types/routes/auth.d.ts';

/**
 * Auth - Permissions.
 *
 * Lists every panel permission so a session's identity can name the ones its role has.
 * The control panel uses them to hide what the user can't do.
 *
 * @since 4.0.0
 */
const permissions: Routes_Auth_Permissions = [
  'bot:control',
  'configuration:write',
  'users:manage',
];

/**
 * Auth - Rp Name.
 *
 * Names the app in the browser's passkey prompts.
 * Passkeys are tied to the hostname, never to this name.
 *
 * @since 4.0.0
 */
const RP_NAME: Routes_Auth_RpName = 'Stonker Bot for Discord';

/**
 * Auth.
 *
 * Handles first-run setup and every way of signing in and out.
 * Password, code, setup, and passkey failures count against the caller's address.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Auth - Access.
   *
   * Issues and clears browser sessions and checks who is calling.
   * Every sign-in method finishes through the same session issuer.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Auth_Runner_Access;

  /**
   * Auth - Attempts.
   *
   * Counts failed attempts per client address across every sign-in method.
   * Setup codes use a separate count so a typo can't block sign-in.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #attempts: Routes_Auth_Runner_Attempts;

  /**
   * Auth - Context.
   *
   * Supplies the database pool and the key that decrypts authenticator secrets.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Auth_Runner_Context;

  /**
   * Auth - Constructor.
   *
   * Binds the sign-in routes to the shared context, access checks, and attempt counter.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Auth_Runner_Constructor_Context}  context  - Context.
   * @param {Routes_Auth_Runner_Constructor_Access}   access   - Access.
   * @param {Routes_Auth_Runner_Constructor_Attempts} attempts - Attempts.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Auth_Runner_Constructor_Context, access: Routes_Auth_Runner_Constructor_Access, attempts: Routes_Auth_Runner_Constructor_Attempts) {
    this.#access = access;
    this.#attempts = attempts;
    this.#context = context;

    return;
  }

  /**
   * Auth - Register.
   *
   * Installs the public setup and sign-in routes and the signed-in identity routes.
   * Paths match the other appliances so one interface client works with all of them.
   *
   * @param {Routes_Auth_Runner_Register_App} app - App.
   *
   * @returns {Routes_Auth_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Auth_Runner_Register_App): Routes_Auth_Runner_Register_Returns {
    app.get('/api/v1/setup/status', handleAsync(this['routeSetupStatus'].bind(this)));

    app.post('/api/v1/setup/claim', handleAsync(this['routeClaim'].bind(this)));

    app.post('/api/v1/auth/login', handleAsync(this['routeLogin'].bind(this)));

    app.post('/api/v1/auth/login/second-factor', handleAsync(this['routeSecondFactor'].bind(this)));

    app.post('/api/v1/auth/passkeys/login/options', handleAsync(this['routePasskeyOptions'].bind(this)));

    app.post('/api/v1/auth/passkeys/login/verify', handleAsync(this['routePasskeyVerify'].bind(this)));

    app.post('/api/v1/auth/logout', this.#access.requireAuthentication(true), handleAsync(this['routeLogout'].bind(this)));

    app.get('/api/v1/auth/me', this.#access.requireAuthentication(false), handleAsync(this['routeCurrentPrincipal'].bind(this)));

    app.delete('/api/v1/auth/removed-secrets', this.#access.requireSession(true), handleAsync(this['routeDismissRemovedSecrets'].bind(this)));

    return;
  }

  /**
   * Auth - Is Rate Limited.
   *
   * Refuses an attempt when its address already reached the failure limit.
   * The response tells the client how many seconds to wait.
   *
   * @param {Routes_Auth_Runner_IsRateLimited_Response} response - Response.
   * @param {Routes_Auth_Runner_IsRateLimited_Key}      key      - Key.
   * @param {Routes_Auth_Runner_IsRateLimited_Message}  message  - Message.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_IsRateLimited_Returns}
   *
   * @since 4.0.0
   */
  private isRateLimited(response: Routes_Auth_Runner_IsRateLimited_Response, key: Routes_Auth_Runner_IsRateLimited_Key, message: Routes_Auth_Runner_IsRateLimited_Message): Routes_Auth_Runner_IsRateLimited_Returns {
    if (this.#attempts.isAllowed(key) === true) {
      return false;
    }

    response.set('Retry-After', String(this.#attempts.getRetryAfterSeconds(key)));

    sendError(response, 429, 'rate_limited', message);

    return true;
  }

  /**
   * Auth - Reject Passkey.
   *
   * Counts a failed passkey sign-in and answers with the rejection for its situation.
   * The answer never says which check failed.
   *
   * @param {Routes_Auth_Runner_RejectPasskey_Response} response - Response.
   * @param {Routes_Auth_Runner_RejectPasskey_Key}      key      - Key.
   * @param {Routes_Auth_Runner_RejectPasskey_Message}  message  - Message.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RejectPasskey_Returns}
   *
   * @since 4.0.0
   */
  private rejectPasskey(response: Routes_Auth_Runner_RejectPasskey_Response, key: Routes_Auth_Runner_RejectPasskey_Key, message: Routes_Auth_Runner_RejectPasskey_Message): Routes_Auth_Runner_RejectPasskey_Returns {
    this.#attempts.recordFailure(key);

    writeLog('warn', 'web', 'sign_in_failed', {
      method: 'passkey',
    });

    sendError(response, 401, 'passkey_rejected', message);

    return;
  }

  /**
   * Auth - Route Claim.
   *
   * Creates the owner account with the setup code from the container log.
   * A correct code signs the new account in right away.
   *
   * @param {Routes_Auth_Runner_RouteClaim_Request}  request  - Request.
   * @param {Routes_Auth_Runner_RouteClaim_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteClaim_Returns}
   *
   * @since 4.0.0
   */
  private async routeClaim(request: Routes_Auth_Runner_RouteClaim_Request, response: Routes_Auth_Runner_RouteClaim_Response): Routes_Auth_Runner_RouteClaim_Returns {
    const attemptKey: Routes_Auth_Runner_RouteClaim_AttemptKey = `setup:${getClientLimitKey(request)}`;

    if (this.isRateLimited(response, attemptKey, 'Too many setup attempts. Try again in 15 minutes.') === true) {
      return;
    }

    const status: Routes_Auth_Runner_RouteClaim_Status = await getPanelSetupStatus(this.#context['pool']);

    if (status['claimRequired'] === false) {
      sendError(response, 409, 'claim_unavailable', 'Setup is already complete. Sign in instead.');

      return;
    }

    const requestBody: Routes_Auth_Runner_RouteClaim_RequestBody = setupClaim.safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    const result: Routes_Auth_Runner_RouteClaim_Result = await claimPanelSetup(this.#context['pool'], requestBody.data['claimCode'], requestBody.data['username'], requestBody.data['password']);

    if (result === 'unavailable') {
      sendError(response, 409, 'claim_unavailable', 'Setup is already complete. Sign in instead.');

      return;
    }

    if (result === 'invalid') {
      this.#attempts.recordFailure(attemptKey);

      writeLog('warn', 'web', 'setup_code_rejected');

      sendError(response, 401, 'claim_invalid', 'That setup code is wrong or expired. Restart the container to print a new one.', [{
        field: 'claimCode',
        message: 'That setup code is wrong or expired. Restart the container to print a new one.',
        path: ['claimCode'],
      }]);

      return;
    }

    this.#attempts.reset(attemptKey);

    writeLog('info', 'web', 'setup_completed', {
      userId: result['id'],
      username: result['username'],
    });

    await this.#access.issueSession(request, response, result, 201);

    return;
  }

  /**
   * Auth - Route Current Principal.
   *
   * Describes the signed-in browser session or the personal access token making the request.
   * The control panel calls it on load to decide between the console and sign-in. A session
   * also gets the secrets a lost credential key removed that this user can enter again.
   *
   * @param {Routes_Auth_Runner_RouteCurrentPrincipal_Request}  _request - Request.
   * @param {Routes_Auth_Runner_RouteCurrentPrincipal_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteCurrentPrincipal_Returns}
   *
   * @since 4.0.0
   */
  private async routeCurrentPrincipal(_request: Routes_Auth_Runner_RouteCurrentPrincipal_Request, response: Routes_Auth_Runner_RouteCurrentPrincipal_Response): Routes_Auth_Runner_RouteCurrentPrincipal_Returns {
    const principal: Routes_Auth_Runner_RouteCurrentPrincipal_Principal = getPrincipal(response);

    if (principal['token'] !== undefined) {
      response.json({
        authenticationType: 'token',
        id: principal['token']['id'],
        name: principal['token']['name'],
        scopes: principal['token']['scopes'],
        username: principal['user']['username'],
      });

      return;
    }

    response.json({
      allServers: principal['user']['allServers'],
      authenticationType: 'session',
      id: principal['user']['id'],
      permissions: permissions.filter((permission) => roleCan(principal['user']['role'], permission)),
      removedSecrets: await listRemovedSecrets(this.#context['pool'], principal['user']),
      role: principal['user']['role'],
      serverIds: principal['user']['serverIds'],
      username: principal['user']['username'],
    });

    return;
  }

  /**
   * Auth - Route Dismiss Removed Secrets.
   *
   * Hides this user's control panel notice about secrets a lost credential key took.
   * Only a signed-in browser session can dismiss it.
   *
   * @param {Routes_Auth_Runner_RouteDismissRemovedSecrets_Request}  _request - Request.
   * @param {Routes_Auth_Runner_RouteDismissRemovedSecrets_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteDismissRemovedSecrets_Returns}
   *
   * @since 4.0.0
   */
  private async routeDismissRemovedSecrets(_request: Routes_Auth_Runner_RouteDismissRemovedSecrets_Request, response: Routes_Auth_Runner_RouteDismissRemovedSecrets_Response): Routes_Auth_Runner_RouteDismissRemovedSecrets_Returns {
    const principal: Routes_Auth_Runner_RouteDismissRemovedSecrets_Principal = getPrincipal(response);

    await dismissRemovedSecrets(this.#context['pool'], principal['user']);

    response.sendStatus(204);

    return;
  }

  /**
   * Auth - Route Login.
   *
   * Checks the username and password, then asks for a second step when an authenticator is on.
   * Wrong credentials share one answer that never says which field was wrong.
   *
   * @param {Routes_Auth_Runner_RouteLogin_Request}  request  - Request.
   * @param {Routes_Auth_Runner_RouteLogin_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteLogin_Returns}
   *
   * @since 4.0.0
   */
  private async routeLogin(request: Routes_Auth_Runner_RouteLogin_Request, response: Routes_Auth_Runner_RouteLogin_Response): Routes_Auth_Runner_RouteLogin_Returns {
    const attemptKey: Routes_Auth_Runner_RouteLogin_AttemptKey = `sign-in:${getClientLimitKey(request)}`;

    if (this.isRateLimited(response, attemptKey, 'Too many sign-in attempts. Try again in 15 minutes.') === true) {
      return;
    }

    const requestBody: Routes_Auth_Runner_RouteLogin_RequestBody = signIn.safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter your username and password.');

      return;
    }

    // Values longer than any account allows can't be right, so they skip the hash check.
    const isOverlong: Routes_Auth_Runner_RouteLogin_IsOverlong = requestBody.data['username'].length > 64 || requestBody.data['password'].length > 1024;
    const user: Routes_Auth_Runner_RouteLogin_User = (isOverlong === true) ? undefined : await authenticatePanelUser(this.#context['pool'], requestBody.data['username'], requestBody.data['password']);

    if (user === undefined) {
      this.#attempts.recordFailure(attemptKey);

      writeLog('warn', 'web', 'sign_in_failed', {
        method: 'password',
      });

      sendError(response, 401, 'credentials_invalid', 'The username or password is incorrect.');

      return;
    }

    if (user['totpEnabled'] === true) {
      const challenge: Routes_Auth_Runner_RouteLogin_Challenge = await createPanelSignInChallenge(this.#context['pool'], user['id']);

      response.json({
        challenge: challenge['challenge'],
        expiresAt: challenge['expiresAt'],
        status: 'second_factor_required',
      });

      return;
    }

    this.#attempts.reset(attemptKey);

    writeLog('info', 'web', 'sign_in_succeeded', {
      method: 'password',
      userId: user['id'],
      username: user['username'],
    });

    await this.#access.issueSession(request, response, user, 200);

    return;
  }

  /**
   * Auth - Route Logout.
   *
   * Deletes the stored browser session and expires its cookies.
   * Token callers have no session, so the call does nothing for them.
   *
   * @param {Routes_Auth_Runner_RouteLogout_Request}  request  - Request.
   * @param {Routes_Auth_Runner_RouteLogout_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteLogout_Returns}
   *
   * @since 4.0.0
   */
  private async routeLogout(request: Routes_Auth_Runner_RouteLogout_Request, response: Routes_Auth_Runner_RouteLogout_Response): Routes_Auth_Runner_RouteLogout_Returns {
    const principal: Routes_Auth_Runner_RouteLogout_Principal = getPrincipal(response);

    if (principal['sessionToken'] !== undefined) {
      await deletePanelSession(this.#context['pool'], principal['sessionToken']);

      writeLog('info', 'web', 'sign_out', {
        userId: principal['user']['id'],
        username: principal['user']['username'],
      });

      this.#access.clearSession(request, response);
    }

    response.sendStatus(204);

    return;
  }

  /**
   * Auth - Route Passkey Options.
   *
   * Starts a username-less passkey sign-in for this request's hostname.
   * Hostnames that browsers refuse for passkeys get a clear error instead.
   *
   * @param {Routes_Auth_Runner_RoutePasskeyOptions_Request}  request  - Request.
   * @param {Routes_Auth_Runner_RoutePasskeyOptions_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RoutePasskeyOptions_Returns}
   *
   * @since 4.0.0
   */
  private async routePasskeyOptions(request: Routes_Auth_Runner_RoutePasskeyOptions_Request, response: Routes_Auth_Runner_RoutePasskeyOptions_Response): Routes_Auth_Runner_RoutePasskeyOptions_Returns {
    if (isPasskeyAvailable(request) === false) {
      sendError(response, 409, 'passkeys_unavailable', 'Passkeys need https and a domain name. Open this page at its domain, or use your password.');

      return;
    }

    const configuration: Routes_Auth_Runner_RoutePasskeyOptions_Configuration = getWebauthnConfiguration(request, RP_NAME);
    const options: Routes_Auth_Runner_RoutePasskeyOptions_Options = await createPasskeyAuthenticationOptions(configuration);
    const ceremonyId: Routes_Auth_Runner_RoutePasskeyOptions_CeremonyId = await createPanelWebauthnCeremony(this.#context['pool'], {
      challenge: options['challenge'],
      kind: 'authentication',
      name: null,
      origin: configuration['origin'],
      rpId: configuration['rpId'],
      userId: null,
    });

    response.json({
      ceremonyId,
      options,
    });

    return;
  }

  /**
   * Auth - Route Passkey Verify.
   *
   * Verifies a passkey assertion against its stored ceremony and signs the account in.
   * The hostname and origin must match the ones the ceremony was started on.
   *
   * @param {Routes_Auth_Runner_RoutePasskeyVerify_Request}  request  - Request.
   * @param {Routes_Auth_Runner_RoutePasskeyVerify_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RoutePasskeyVerify_Returns}
   *
   * @since 4.0.0
   */
  private async routePasskeyVerify(request: Routes_Auth_Runner_RoutePasskeyVerify_Request, response: Routes_Auth_Runner_RoutePasskeyVerify_Response): Routes_Auth_Runner_RoutePasskeyVerify_Returns {
    const attemptKey: Routes_Auth_Runner_RoutePasskeyVerify_AttemptKey = `sign-in:${getClientLimitKey(request)}`;

    if (this.isRateLimited(response, attemptKey, 'Too many sign-in attempts. Try again in 15 minutes.') === true) {
      return;
    }

    const requestBody: Routes_Auth_Runner_RoutePasskeyVerify_RequestBody = passkeySignInVerify.safeParse(request.body);

    if (requestBody.success === false) {
      this.rejectPasskey(response, attemptKey, 'That passkey wasn\'t accepted.');

      return;
    }

    const ceremony: Routes_Auth_Runner_RoutePasskeyVerify_Ceremony = await takePanelWebauthnCeremony(this.#context['pool'], requestBody.data['ceremonyId'], 'authentication');
    const configuration: Routes_Auth_Runner_RoutePasskeyVerify_Configuration = getWebauthnConfiguration(request, RP_NAME);

    if (ceremony === undefined) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return;
    }

    if (
      ceremony['rpId'] !== configuration['rpId']
      || ceremony['origin'] !== configuration['origin']
    ) {
      this.rejectPasskey(response, attemptKey, 'That passkey wasn\'t accepted. It may belong to a different address for this app.');

      return;
    }

    const credential: Routes_Auth_Runner_RoutePasskeyVerify_Credential = requestBody.data['credential'] as Routes_Auth_Runner_RoutePasskeyVerify_Credential;
    const passkey: Routes_Auth_Runner_RoutePasskeyVerify_Passkey = await getPanelPasskey(this.#context['pool'], credential['id']);

    if (passkey === undefined) {
      this.rejectPasskey(response, attemptKey, 'That passkey wasn\'t accepted. It may belong to a different address for this app.');

      return;
    }

    const usage: Routes_Auth_Runner_RoutePasskeyVerify_Usage = await verifyPasskeyAuthentication(configuration, credential, ceremony['challenge'], passkey);

    if (usage === undefined) {
      this.rejectPasskey(response, attemptKey, 'That passkey wasn\'t accepted. It may belong to a different address for this app.');

      return;
    }

    const updated: Routes_Auth_Runner_RoutePasskeyVerify_Updated = await updatePanelPasskeyUsage(this.#context['pool'], passkey['id'], passkey['counter'], usage, ceremony['rpId']);
    const account: Routes_Auth_Runner_RoutePasskeyVerify_Account = await getPanelAccount(this.#context['pool'], passkey['userId']);

    if (updated === false || account === undefined) {
      this.rejectPasskey(response, attemptKey, 'That passkey wasn\'t accepted.');

      return;
    }

    this.#attempts.reset(attemptKey);

    writeLog('info', 'web', 'sign_in_succeeded', {
      method: 'passkey',
      passkey: passkey['name'],
      userId: account['id'],
      username: account['username'],
    });

    await this.#access.issueSession(request, response, account, 200);

    return;
  }

  /**
   * Auth - Route Second Factor.
   *
   * Finishes a password sign-in with an authenticator code or a recovery code.
   * Six digits are checked as an authenticator code and anything else as a recovery code.
   *
   * @param {Routes_Auth_Runner_RouteSecondFactor_Request}  request  - Request.
   * @param {Routes_Auth_Runner_RouteSecondFactor_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteSecondFactor_Returns}
   *
   * @since 4.0.0
   */
  private async routeSecondFactor(request: Routes_Auth_Runner_RouteSecondFactor_Request, response: Routes_Auth_Runner_RouteSecondFactor_Response): Routes_Auth_Runner_RouteSecondFactor_Returns {
    const attemptKey: Routes_Auth_Runner_RouteSecondFactor_AttemptKey = `sign-in:${getClientLimitKey(request)}`;

    if (this.isRateLimited(response, attemptKey, 'Too many sign-in attempts. Try again in 15 minutes.') === true) {
      return;
    }

    const requestBody: Routes_Auth_Runner_RouteSecondFactor_RequestBody = signInSecondFactor.safeParse(request.body);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter a code.');

      return;
    }

    const userId: Routes_Auth_Runner_RouteSecondFactor_UserId = await getPanelSignInChallenge(this.#context['pool'], requestBody.data['challenge']);

    if (userId === undefined) {
      sendError(response, 401, 'challenge_expired', 'Your sign-in timed out. Enter your password again.');

      return;
    }

    const isTotpCode: Routes_Auth_Runner_RouteSecondFactor_IsTotpCode = requestBody.data['code'].length === 6 && LIB_REGEX_PATTERN_TOTP_TOKEN.test(requestBody.data['code']);
    const isOverlong: Routes_Auth_Runner_RouteSecondFactor_IsOverlong = requestBody.data['code'].length > 64;
    let isValid: Routes_Auth_Runner_RouteSecondFactor_IsValid = false;

    if (isTotpCode === true) {
      isValid = await verifyPanelTotp(this.#context['pool'], userId, requestBody.data['code'], this.#context['credentialKey']);
    } else if (isOverlong === false) {
      isValid = await consumePanelRecoveryCode(this.#context['pool'], userId, requestBody.data['code']);
    }

    if (isValid === false) {
      this.#attempts.recordFailure(attemptKey);

      const isExhausted: Routes_Auth_Runner_RouteSecondFactor_IsExhausted = await recordPanelSignInChallengeFailure(this.#context['pool'], requestBody.data['challenge']);

      writeLog('warn', 'web', 'sign_in_failed', {
        method: (isTotpCode === true) ? 'authenticator-code' : 'recovery-code',
      });

      if (isExhausted === true) {
        sendError(response, 401, 'challenge_expired', 'Too many wrong codes. Enter your password again.');

        return;
      }

      sendError(response, 401, 'code_invalid', 'That code doesn\'t match. Try the current code, or a recovery code.', [{
        field: 'code',
        message: 'That code doesn\'t match. Try the current code, or a recovery code.',
        path: ['code'],
      }]);

      return;
    }

    const account: Routes_Auth_Runner_RouteSecondFactor_Account = await getPanelAccount(this.#context['pool'], userId);

    await deletePanelSignInChallenge(this.#context['pool'], requestBody.data['challenge']);

    if (account === undefined) {
      sendError(response, 401, 'challenge_expired', 'Your sign-in timed out. Enter your password again.');

      return;
    }

    this.#attempts.reset(attemptKey);

    writeLog('info', 'web', 'sign_in_succeeded', {
      method: (isTotpCode === true) ? 'password-and-authenticator-code' : 'password-and-recovery-code',
      userId: account['id'],
      username: account['username'],
    });

    await this.#access.issueSession(request, response, account, 200);

    return;
  }

  /**
   * Auth - Route Setup Status.
   *
   * Tells the control panel whether to show the setup screen or the sign-in screen.
   * The answer holds no code and no account details.
   *
   * @param {Routes_Auth_Runner_RouteSetupStatus_Request}  _request - Request.
   * @param {Routes_Auth_Runner_RouteSetupStatus_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Auth_Runner_RouteSetupStatus_Returns}
   *
   * @since 4.0.0
   */
  private async routeSetupStatus(_request: Routes_Auth_Runner_RouteSetupStatus_Request, response: Routes_Auth_Runner_RouteSetupStatus_Response): Routes_Auth_Runner_RouteSetupStatus_Returns {
    response.json(await getPanelSetupStatus(this.#context['pool']));

    return;
  }
}
