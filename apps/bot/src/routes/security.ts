import { toDataURL } from 'qrcode';

import { getPrincipal } from '../lib/access.js';
import {
  passkeyCredentialIdentifier,
  passkeyRegistrationStart,
  passkeyRegistrationVerify,
  passwordChange,
  passwordConfirmation,
  totpEnable,
  usernameChange,
} from '../lib/account-schemas.js';
import {
  getClientLimitKey,
  getRequestHostname,
  getWebauthnConfiguration,
  handleAsync,
  isPasskeyAvailable,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import { writeLog } from '../lib/logger.js';
import {
  changePanelPassword,
  changePanelUsername,
  confirmPanelPassword,
  createPanelTotpSecret,
  disablePanelTotp,
  enablePanelTotp,
  getPanelSecurity,
  getPanelTotpEnrollment,
  hasPanelTotp,
  replacePanelRecoveryCodes,
  startPanelTotpEnrollment,
  verifyPanelTotpCode,
} from '../lib/panel-auth.js';
import {
  createPanelPasskey,
  createPanelWebauthnCeremony,
  createPasskeyRegistrationOptions,
  listPanelPasskeyDescriptors,
  removePanelPasskey,
  takePanelWebauthnCeremony,
  verifyPasskeyRegistration,
} from '../lib/passkey-auth.js';

import type {
  Routes_Security_RpName,
  Routes_Security_Runner_Access,
  Routes_Security_Runner_Attempts,
  Routes_Security_Runner_ConfirmPassword_AttemptKey,
  Routes_Security_Runner_ConfirmPassword_Field,
  Routes_Security_Runner_ConfirmPassword_Password,
  Routes_Security_Runner_ConfirmPassword_Principal,
  Routes_Security_Runner_ConfirmPassword_Request,
  Routes_Security_Runner_ConfirmPassword_Response,
  Routes_Security_Runner_ConfirmPassword_Returns,
  Routes_Security_Runner_Constructor_Access,
  Routes_Security_Runner_Constructor_Attempts,
  Routes_Security_Runner_Constructor_Context,
  Routes_Security_Runner_Context,
  Routes_Security_Runner_Register_App,
  Routes_Security_Runner_Register_Returns,
  Routes_Security_Runner_RouteChangePassword_Principal,
  Routes_Security_Runner_RouteChangePassword_Request,
  Routes_Security_Runner_RouteChangePassword_RequestBody,
  Routes_Security_Runner_RouteChangePassword_Response,
  Routes_Security_Runner_RouteChangePassword_Returns,
  Routes_Security_Runner_RouteChangeUsername_Principal,
  Routes_Security_Runner_RouteChangeUsername_Request,
  Routes_Security_Runner_RouteChangeUsername_RequestBody,
  Routes_Security_Runner_RouteChangeUsername_Response,
  Routes_Security_Runner_RouteChangeUsername_Result,
  Routes_Security_Runner_RouteChangeUsername_Returns,
  Routes_Security_Runner_RouteDeletePasskey_Name,
  Routes_Security_Runner_RouteDeletePasskey_PasskeyId,
  Routes_Security_Runner_RouteDeletePasskey_Principal,
  Routes_Security_Runner_RouteDeletePasskey_Request,
  Routes_Security_Runner_RouteDeletePasskey_RequestBody,
  Routes_Security_Runner_RouteDeletePasskey_Response,
  Routes_Security_Runner_RouteDeletePasskey_Returns,
  Routes_Security_Runner_RouteDisableTotp_Disabled,
  Routes_Security_Runner_RouteDisableTotp_Principal,
  Routes_Security_Runner_RouteDisableTotp_Request,
  Routes_Security_Runner_RouteDisableTotp_RequestBody,
  Routes_Security_Runner_RouteDisableTotp_Response,
  Routes_Security_Runner_RouteDisableTotp_Returns,
  Routes_Security_Runner_RouteEnableTotp_MatchedStep,
  Routes_Security_Runner_RouteEnableTotp_Principal,
  Routes_Security_Runner_RouteEnableTotp_RecoveryCodes,
  Routes_Security_Runner_RouteEnableTotp_Request,
  Routes_Security_Runner_RouteEnableTotp_RequestBody,
  Routes_Security_Runner_RouteEnableTotp_Response,
  Routes_Security_Runner_RouteEnableTotp_Returns,
  Routes_Security_Runner_RouteEnableTotp_Secret,
  Routes_Security_Runner_RoutePasskeyOptions_CeremonyId,
  Routes_Security_Runner_RoutePasskeyOptions_Configuration,
  Routes_Security_Runner_RoutePasskeyOptions_ExistingPasskeys,
  Routes_Security_Runner_RoutePasskeyOptions_Options,
  Routes_Security_Runner_RoutePasskeyOptions_Principal,
  Routes_Security_Runner_RoutePasskeyOptions_Request,
  Routes_Security_Runner_RoutePasskeyOptions_RequestBody,
  Routes_Security_Runner_RoutePasskeyOptions_Response,
  Routes_Security_Runner_RoutePasskeyOptions_Returns,
  Routes_Security_Runner_RoutePasskeyVerify_Ceremony,
  Routes_Security_Runner_RoutePasskeyVerify_Configuration,
  Routes_Security_Runner_RoutePasskeyVerify_Credential,
  Routes_Security_Runner_RoutePasskeyVerify_Name,
  Routes_Security_Runner_RoutePasskeyVerify_Passkey,
  Routes_Security_Runner_RoutePasskeyVerify_Principal,
  Routes_Security_Runner_RoutePasskeyVerify_RegisteredCredential,
  Routes_Security_Runner_RoutePasskeyVerify_Request,
  Routes_Security_Runner_RoutePasskeyVerify_RequestBody,
  Routes_Security_Runner_RoutePasskeyVerify_Response,
  Routes_Security_Runner_RoutePasskeyVerify_Result,
  Routes_Security_Runner_RoutePasskeyVerify_Returns,
  Routes_Security_Runner_RoutePasskeyVerify_Security,
  Routes_Security_Runner_RouteRecoveryCodes_Principal,
  Routes_Security_Runner_RouteRecoveryCodes_RecoveryCodes,
  Routes_Security_Runner_RouteRecoveryCodes_Request,
  Routes_Security_Runner_RouteRecoveryCodes_RequestBody,
  Routes_Security_Runner_RouteRecoveryCodes_Response,
  Routes_Security_Runner_RouteRecoveryCodes_Returns,
  Routes_Security_Runner_RouteSecurity_Principal,
  Routes_Security_Runner_RouteSecurity_Request,
  Routes_Security_Runner_RouteSecurity_Response,
  Routes_Security_Runner_RouteSecurity_Returns,
  Routes_Security_Runner_RouteSecurity_Security,
  Routes_Security_Runner_RouteTotpSetup_ExpiresAt,
  Routes_Security_Runner_RouteTotpSetup_Principal,
  Routes_Security_Runner_RouteTotpSetup_QrCode,
  Routes_Security_Runner_RouteTotpSetup_Request,
  Routes_Security_Runner_RouteTotpSetup_RequestBody,
  Routes_Security_Runner_RouteTotpSetup_Response,
  Routes_Security_Runner_RouteTotpSetup_Returns,
  Routes_Security_Runner_RouteTotpSetup_TotpSecret,
} from '../types/routes/security.d.ts';

/**
 * Security - Rp Name.
 *
 * Names the app in the browser's passkey prompts while a passkey is added.
 * It matches the name used for passkey sign-in.
 *
 * @since 4.0.0
 */
const RP_NAME: Routes_Security_RpName = 'Stonker Bot for Discord';

/**
 * Security.
 *
 * Lets the signed-in user manage their password, username, and every sign-in method.
 * Each change needs a browser session and the current password, never an access token.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Security - Access.
   *
   * Restricts every route here to a signed-in browser session.
   * Mutations also need the session's CSRF header.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Security_Runner_Access;

  /**
   * Security - Attempts.
   *
   * Counts wrong password confirmations in the same per-address count as sign-in.
   * A stolen session therefore can't guess the password faster than the sign-in form.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #attempts: Routes_Security_Runner_Attempts;

  /**
   * Security - Context.
   *
   * Supplies the database pool and the key that encrypts authenticator secrets.
   * Nothing else is read.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Security_Runner_Context;

  /**
   * Security - Constructor.
   *
   * Binds the security routes to the shared context, access checks, and attempt counter.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Security_Runner_Constructor_Context}  context  - Context.
   * @param {Routes_Security_Runner_Constructor_Access}   access   - Access.
   * @param {Routes_Security_Runner_Constructor_Attempts} attempts - Attempts.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Security_Runner_Constructor_Context, access: Routes_Security_Runner_Constructor_Access, attempts: Routes_Security_Runner_Constructor_Attempts) {
    this.#access = access;
    this.#attempts = attempts;
    this.#context = context;

    return;
  }

  /**
   * Security - Register.
   *
   * Installs the summary and every password, username, authenticator, and passkey route.
   * Paths match the other appliances so one interface client works with all of them.
   *
   * @param {Routes_Security_Runner_Register_App} app - App.
   *
   * @returns {Routes_Security_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Security_Runner_Register_App): Routes_Security_Runner_Register_Returns {
    app.get('/api/v1/auth/security', this.#access.requireSession(false), handleAsync(this['routeSecurity'].bind(this)));

    app.post('/api/v1/auth/password', this.#access.requireSession(true), handleAsync(this['routeChangePassword'].bind(this)));

    app.post('/api/v1/auth/username', this.#access.requireSession(true), handleAsync(this['routeChangeUsername'].bind(this)));

    app.post('/api/v1/auth/totp/setup', this.#access.requireSession(true), handleAsync(this['routeTotpSetup'].bind(this)));

    app.post('/api/v1/auth/totp/enable', this.#access.requireSession(true), handleAsync(this['routeEnableTotp'].bind(this)));

    app.post('/api/v1/auth/totp/disable', this.#access.requireSession(true), handleAsync(this['routeDisableTotp'].bind(this)));

    app.post('/api/v1/auth/recovery-codes', this.#access.requireSession(true), handleAsync(this['routeRecoveryCodes'].bind(this)));

    app.post('/api/v1/auth/passkeys/register/options', this.#access.requireSession(true), handleAsync(this['routePasskeyOptions'].bind(this)));

    app.post('/api/v1/auth/passkeys/register/verify', this.#access.requireSession(true), handleAsync(this['routePasskeyVerify'].bind(this)));

    app.delete('/api/v1/auth/passkeys/:passkeyId', this.#access.requireSession(true), handleAsync(this['routeDeletePasskey'].bind(this)));

    return;
  }

  /**
   * Security - Confirm Password.
   *
   * Checks the signed-in user's current password before a security change.
   * Wrong passwords count toward the same limit as sign-in.
   *
   * @param {Routes_Security_Runner_ConfirmPassword_Request}  request  - Request.
   * @param {Routes_Security_Runner_ConfirmPassword_Response} response - Response.
   * @param {Routes_Security_Runner_ConfirmPassword_Password} password - Password.
   * @param {Routes_Security_Runner_ConfirmPassword_Field}    field    - Field.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_ConfirmPassword_Returns}
   *
   * @since 4.0.0
   */
  private async confirmPassword(request: Routes_Security_Runner_ConfirmPassword_Request, response: Routes_Security_Runner_ConfirmPassword_Response, password: Routes_Security_Runner_ConfirmPassword_Password, field: Routes_Security_Runner_ConfirmPassword_Field): Routes_Security_Runner_ConfirmPassword_Returns {
    const attemptKey: Routes_Security_Runner_ConfirmPassword_AttemptKey = `sign-in:${getClientLimitKey(request)}`;
    const principal: Routes_Security_Runner_ConfirmPassword_Principal = getPrincipal(response);

    if (this.#attempts.isAllowed(attemptKey) === false) {
      response.set('Retry-After', String(this.#attempts.getRetryAfterSeconds(attemptKey)));

      sendError(response, 429, 'rate_limited', 'Too many attempts. Try again in 15 minutes.');

      return false;
    }

    if (await confirmPanelPassword(this.#context['pool'], principal['user']['id'], password) === false) {
      this.#attempts.recordFailure(attemptKey);

      sendError(response, 422, 'password_incorrect', 'That password is incorrect.', [{
        field,
        message: 'That password is incorrect.',
        path: [field],
      }]);

      return false;
    }

    return true;
  }

  /**
   * Security - Route Change Password.
   *
   * Replaces the password after checking the current one.
   * Every other session of the user is signed out; this one stays signed in.
   *
   * @param {Routes_Security_Runner_RouteChangePassword_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteChangePassword_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteChangePassword_Returns}
   *
   * @since 4.0.0
   */
  private async routeChangePassword(request: Routes_Security_Runner_RouteChangePassword_Request, response: Routes_Security_Runner_RouteChangePassword_Response): Routes_Security_Runner_RouteChangePassword_Returns {
    const requestBody: Routes_Security_Runner_RouteChangePassword_RequestBody = passwordChange.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteChangePassword_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['currentPassword'], 'currentPassword') === false) {
      return;
    }

    if (principal['sessionToken'] === undefined) {
      sendError(response, 401, 'authentication_required', 'Sign in to continue.');

      return;
    }

    await changePanelPassword(this.#context['pool'], principal['user']['id'], requestBody.data['newPassword'], principal['sessionToken']);

    writeLog('info', 'web', 'password_changed', {
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Security - Route Change Username.
   *
   * Renames the signed-in user after checking their password.
   * Usernames are unique ignoring letter case, as at sign-in.
   *
   * @param {Routes_Security_Runner_RouteChangeUsername_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteChangeUsername_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteChangeUsername_Returns}
   *
   * @since 4.0.0
   */
  private async routeChangeUsername(request: Routes_Security_Runner_RouteChangeUsername_Request, response: Routes_Security_Runner_RouteChangeUsername_Response): Routes_Security_Runner_RouteChangeUsername_Returns {
    const requestBody: Routes_Security_Runner_RouteChangeUsername_RequestBody = usernameChange.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteChangeUsername_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['password'], 'password') === false) {
      return;
    }

    const result: Routes_Security_Runner_RouteChangeUsername_Result = await changePanelUsername(this.#context['pool'], principal['user']['id'], requestBody.data['username']);

    if (result === 'not-found') {
      sendError(response, 401, 'authentication_required', 'Sign in to continue.');

      return;
    }

    if (result === 'conflict') {
      sendError(response, 409, 'username_taken', 'That username is already in use.', [{
        field: 'username',
        message: 'That username is already in use.',
        path: ['username'],
      }]);

      return;
    }

    writeLog('info', 'web', 'username_changed', {
      previousUsername: principal['user']['username'],
      userId: result['id'],
      username: result['username'],
    });

    response.json({
      user: {
        id: result['id'],
        role: result['role'],
        username: result['username'],
      },
    });

    return;
  }

  /**
   * Security - Route Delete Passkey.
   *
   * Removes one of the signed-in user's passkeys after checking their password.
   * Unknown and malformed passkey ids share one answer.
   *
   * @param {Routes_Security_Runner_RouteDeletePasskey_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteDeletePasskey_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteDeletePasskey_Returns}
   *
   * @since 4.0.0
   */
  private async routeDeletePasskey(request: Routes_Security_Runner_RouteDeletePasskey_Request, response: Routes_Security_Runner_RouteDeletePasskey_Response): Routes_Security_Runner_RouteDeletePasskey_Returns {
    const passkeyId: Routes_Security_Runner_RouteDeletePasskey_PasskeyId = (typeof request.params['passkeyId'] === 'string') ? request.params['passkeyId'] : undefined;
    const requestBody: Routes_Security_Runner_RouteDeletePasskey_RequestBody = passwordConfirmation.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteDeletePasskey_Principal = getPrincipal(response);

    if (passkeyId === undefined || passkeyCredentialIdentifier.safeParse(passkeyId).success === false) {
      sendError(response, 404, 'passkey_not_found', 'That passkey no longer exists.');

      return;
    }

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter your password.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['password'], 'password') === false) {
      return;
    }

    const name: Routes_Security_Runner_RouteDeletePasskey_Name = await removePanelPasskey(this.#context['pool'], principal['user']['id'], passkeyId);

    if (name === undefined) {
      sendError(response, 404, 'passkey_not_found', 'That passkey no longer exists.');

      return;
    }

    writeLog('info', 'web', 'passkey_removed', {
      passkey: name,
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Security - Route Disable Totp.
   *
   * Turns the authenticator app off after checking the password.
   * Its recovery codes are deleted with it.
   *
   * @param {Routes_Security_Runner_RouteDisableTotp_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteDisableTotp_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteDisableTotp_Returns}
   *
   * @since 4.0.0
   */
  private async routeDisableTotp(request: Routes_Security_Runner_RouteDisableTotp_Request, response: Routes_Security_Runner_RouteDisableTotp_Response): Routes_Security_Runner_RouteDisableTotp_Returns {
    const requestBody: Routes_Security_Runner_RouteDisableTotp_RequestBody = passwordConfirmation.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteDisableTotp_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter your password.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['password'], 'password') === false) {
      return;
    }

    const disabled: Routes_Security_Runner_RouteDisableTotp_Disabled = await disablePanelTotp(this.#context['pool'], principal['user']['id']);

    if (disabled === false) {
      sendError(response, 409, 'totp_disabled', 'The authenticator app is already off.');

      return;
    }

    writeLog('info', 'web', 'totp_disabled', {
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.sendStatus(204);

    return;
  }

  /**
   * Security - Route Enable Totp.
   *
   * Turns the authenticator app on once a code from the pending secret matches.
   * The answer carries the new recovery codes, shown once.
   *
   * @param {Routes_Security_Runner_RouteEnableTotp_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteEnableTotp_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteEnableTotp_Returns}
   *
   * @since 4.0.0
   */
  private async routeEnableTotp(request: Routes_Security_Runner_RouteEnableTotp_Request, response: Routes_Security_Runner_RouteEnableTotp_Response): Routes_Security_Runner_RouteEnableTotp_Returns {
    const requestBody: Routes_Security_Runner_RouteEnableTotp_RequestBody = totpEnable.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteEnableTotp_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter the 6-digit code from your app.');

      return;
    }

    const secret: Routes_Security_Runner_RouteEnableTotp_Secret = await getPanelTotpEnrollment(this.#context['pool'], principal['user']['id'], this.#context['credentialKey']);

    if (secret === undefined) {
      sendError(response, 409, 'totp_setup_expired', 'Authenticator setup expired. Start again.');

      return;
    }

    const matchedStep: Routes_Security_Runner_RouteEnableTotp_MatchedStep = verifyPanelTotpCode(secret, requestBody.data['code']);

    if (matchedStep === undefined) {
      sendError(response, 422, 'code_invalid', 'That code doesn\'t match. Check the time on your device and try again.', [{
        field: 'code',
        message: 'That code doesn\'t match. Check the time on your device and try again.',
        path: ['code'],
      }]);

      return;
    }

    const recoveryCodes: Routes_Security_Runner_RouteEnableTotp_RecoveryCodes = await enablePanelTotp(this.#context['pool'], principal['user']['id'], secret, matchedStep, this.#context['credentialKey']);

    writeLog('info', 'web', 'totp_enabled', {
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json({
      recoveryCodes,
    });

    return;
  }

  /**
   * Security - Route Passkey Options.
   *
   * Starts adding a passkey for this request's hostname after checking the password.
   * Passkeys the user already has are excluded so the same one isn't added twice.
   *
   * @param {Routes_Security_Runner_RoutePasskeyOptions_Request}  request  - Request.
   * @param {Routes_Security_Runner_RoutePasskeyOptions_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RoutePasskeyOptions_Returns}
   *
   * @since 4.0.0
   */
  private async routePasskeyOptions(request: Routes_Security_Runner_RoutePasskeyOptions_Request, response: Routes_Security_Runner_RoutePasskeyOptions_Response): Routes_Security_Runner_RoutePasskeyOptions_Returns {
    const requestBody: Routes_Security_Runner_RoutePasskeyOptions_RequestBody = passkeyRegistrationStart.safeParse(request.body);
    const principal: Routes_Security_Runner_RoutePasskeyOptions_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Check the highlighted fields.');

      return;
    }

    if (isPasskeyAvailable(request) === false) {
      sendError(response, 409, 'passkeys_unavailable', 'Passkeys need https and a domain name. Open this page at its domain, or use your password.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['password'], 'password') === false) {
      return;
    }

    const configuration: Routes_Security_Runner_RoutePasskeyOptions_Configuration = getWebauthnConfiguration(request, RP_NAME);
    const existingPasskeys: Routes_Security_Runner_RoutePasskeyOptions_ExistingPasskeys = await listPanelPasskeyDescriptors(this.#context['pool'], principal['user']['id']);
    const options: Routes_Security_Runner_RoutePasskeyOptions_Options = await createPasskeyRegistrationOptions(configuration, {
      id: principal['user']['id'],
      username: principal['user']['username'],
    }, existingPasskeys);
    const ceremonyId: Routes_Security_Runner_RoutePasskeyOptions_CeremonyId = await createPanelWebauthnCeremony(this.#context['pool'], {
      challenge: options['challenge'],
      kind: 'registration',
      name: requestBody.data['name'],
      origin: configuration['origin'],
      rpId: configuration['rpId'],
      userId: principal['user']['id'],
    });

    response.json({
      ceremonyId,
      options,
    });

    return;
  }

  /**
   * Security - Route Passkey Verify.
   *
   * Verifies the browser's new passkey against its ceremony and stores it.
   * The ceremony must belong to this user and to this request's hostname and origin.
   *
   * @param {Routes_Security_Runner_RoutePasskeyVerify_Request}  request  - Request.
   * @param {Routes_Security_Runner_RoutePasskeyVerify_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RoutePasskeyVerify_Returns}
   *
   * @since 4.0.0
   */
  private async routePasskeyVerify(request: Routes_Security_Runner_RoutePasskeyVerify_Request, response: Routes_Security_Runner_RoutePasskeyVerify_Response): Routes_Security_Runner_RoutePasskeyVerify_Returns {
    const requestBody: Routes_Security_Runner_RoutePasskeyVerify_RequestBody = passkeyRegistrationVerify.safeParse(request.body);
    const principal: Routes_Security_Runner_RoutePasskeyVerify_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendError(response, 422, 'passkey_invalid', 'The passkey couldn\'t be verified. Try again.');

      return;
    }

    const ceremony: Routes_Security_Runner_RoutePasskeyVerify_Ceremony = await takePanelWebauthnCeremony(this.#context['pool'], requestBody.data['ceremonyId'], 'registration');
    const configuration: Routes_Security_Runner_RoutePasskeyVerify_Configuration = getWebauthnConfiguration(request, RP_NAME);

    if (
      ceremony === undefined
      || ceremony['userId'] !== principal['user']['id']
      || ceremony['rpId'] !== configuration['rpId']
      || ceremony['origin'] !== configuration['origin']
    ) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return;
    }

    const credential: Routes_Security_Runner_RoutePasskeyVerify_Credential = requestBody.data['credential'] as Routes_Security_Runner_RoutePasskeyVerify_Credential;
    const registeredCredential: Routes_Security_Runner_RoutePasskeyVerify_RegisteredCredential = await verifyPasskeyRegistration(configuration, credential, ceremony['challenge']);

    if (registeredCredential === undefined) {
      sendError(response, 422, 'passkey_invalid', 'The passkey couldn\'t be verified. Try again.');

      return;
    }

    const name: Routes_Security_Runner_RoutePasskeyVerify_Name = ceremony['name'] ?? 'Passkey';
    const result: Routes_Security_Runner_RoutePasskeyVerify_Result = await createPanelPasskey(this.#context['pool'], principal['user']['id'], name, ceremony['rpId'], registeredCredential);

    if (result === 'conflict') {
      sendError(response, 409, 'passkey_exists', 'This passkey is already added.');

      return;
    }

    const security: Routes_Security_Runner_RoutePasskeyVerify_Security = await getPanelSecurity(this.#context['pool'], principal['user']['id']);
    const passkey: Routes_Security_Runner_RoutePasskeyVerify_Passkey = (security === undefined) ? undefined : security['passkeys'].find((summary) => summary['id'] === registeredCredential['id']);

    if (passkey === undefined) {
      sendError(response, 401, 'authentication_required', 'Sign in to continue.');

      return;
    }

    writeLog('info', 'web', 'passkey_added', {
      passkey: name,
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.status(201).json(passkey);

    return;
  }

  /**
   * Security - Route Recovery Codes.
   *
   * Replaces every recovery code after checking the password.
   * The old codes stop working at once and the new ones are shown once.
   *
   * @param {Routes_Security_Runner_RouteRecoveryCodes_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteRecoveryCodes_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteRecoveryCodes_Returns}
   *
   * @since 4.0.0
   */
  private async routeRecoveryCodes(request: Routes_Security_Runner_RouteRecoveryCodes_Request, response: Routes_Security_Runner_RouteRecoveryCodes_Response): Routes_Security_Runner_RouteRecoveryCodes_Returns {
    const requestBody: Routes_Security_Runner_RouteRecoveryCodes_RequestBody = passwordConfirmation.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteRecoveryCodes_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter your password.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['password'], 'password') === false) {
      return;
    }

    const recoveryCodes: Routes_Security_Runner_RouteRecoveryCodes_RecoveryCodes = await replacePanelRecoveryCodes(this.#context['pool'], principal['user']['id']);

    if (recoveryCodes === undefined) {
      sendError(response, 409, 'totp_disabled', 'Turn on the authenticator app first.');

      return;
    }

    writeLog('info', 'web', 'recovery_codes_replaced', {
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    response.json({
      recoveryCodes,
    });

    return;
  }

  /**
   * Security - Route Security.
   *
   * Summarizes the signed-in user's role, authenticator, recovery codes, and passkeys.
   * It also says whether passkeys can be added at the address in use.
   *
   * @param {Routes_Security_Runner_RouteSecurity_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteSecurity_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteSecurity_Returns}
   *
   * @since 4.0.0
   */
  private async routeSecurity(request: Routes_Security_Runner_RouteSecurity_Request, response: Routes_Security_Runner_RouteSecurity_Response): Routes_Security_Runner_RouteSecurity_Returns {
    const principal: Routes_Security_Runner_RouteSecurity_Principal = getPrincipal(response);
    const security: Routes_Security_Runner_RouteSecurity_Security = await getPanelSecurity(this.#context['pool'], principal['user']['id']);

    if (security === undefined) {
      sendError(response, 401, 'authentication_required', 'Sign in to continue.');

      return;
    }

    response.json({
      ...security,
      hostname: getRequestHostname(request),
      passkeysAvailable: isPasskeyAvailable(request),
    });

    return;
  }

  /**
   * Security - Route Totp Setup.
   *
   * Creates a pending authenticator secret and its QR code after checking the password.
   * The secret only takes effect once a code from it is confirmed.
   *
   * @param {Routes_Security_Runner_RouteTotpSetup_Request}  request  - Request.
   * @param {Routes_Security_Runner_RouteTotpSetup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Security_Runner_RouteTotpSetup_Returns}
   *
   * @since 4.0.0
   */
  private async routeTotpSetup(request: Routes_Security_Runner_RouteTotpSetup_Request, response: Routes_Security_Runner_RouteTotpSetup_Response): Routes_Security_Runner_RouteTotpSetup_Returns {
    const requestBody: Routes_Security_Runner_RouteTotpSetup_RequestBody = passwordConfirmation.safeParse(request.body);
    const principal: Routes_Security_Runner_RouteTotpSetup_Principal = getPrincipal(response);

    if (requestBody.success === false) {
      sendValidationError(response, 422, requestBody.error, 'Enter your password.');

      return;
    }

    if (await this.confirmPassword(request, response, requestBody.data['password'], 'password') === false) {
      return;
    }

    if (await hasPanelTotp(this.#context['pool'], principal['user']['id']) === true) {
      sendError(response, 409, 'totp_enabled', 'The authenticator app is already on.');

      return;
    }

    const totpSecret: Routes_Security_Runner_RouteTotpSetup_TotpSecret = createPanelTotpSecret(principal['user']['username']);
    const qrCode: Routes_Security_Runner_RouteTotpSetup_QrCode = await toDataURL(totpSecret['uri'], {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 240,
    });
    const expiresAt: Routes_Security_Runner_RouteTotpSetup_ExpiresAt = await startPanelTotpEnrollment(this.#context['pool'], principal['user']['id'], totpSecret['secret'], this.#context['credentialKey']);

    response.json({
      expiresAt,
      qrCode,
      secret: totpSecret['secret'],
      uri: totpSecret['uri'],
    });

    return;
  }
}
