import { z } from 'zod';

import { getPrincipal } from '../lib/access.js';
import { passkeySignInVerify } from '../lib/account-schemas.js';
import {
  backupImportSourceSchema,
  BackupService,
  GrantStore,
} from '../lib/backup.js';
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
  confirmPanelPassword,
  hasPanelTotp,
  verifyPanelTotp,
} from '../lib/panel-auth.js';
import { digestValue } from '../lib/panel-sessions.js';
import {
  createPanelWebauthnCeremony,
  createPasskeyAuthenticationOptions,
  getPanelPasskey,
  takePanelWebauthnCeremony,
  updatePanelPasskeyUsage,
  verifyPasskeyAuthentication,
} from '../lib/passkey-auth.js';
import {
  LIB_REGEX_PATTERN_BACKUP_GRANT,
  LIB_REGEX_PATTERN_BACKUP_TOTP_CODE,
} from '../lib/regex.js';

import type {
  Routes_Backup_AttemptKey,
  Routes_Backup_Ceremonies,
  Routes_Backup_Ceremony,
  Routes_Backup_CeremonyBindingResult,
  Routes_Backup_CeremonyId,
  Routes_Backup_Configuration,
  Routes_Backup_ConfirmationBody,
  Routes_Backup_Credential,
  Routes_Backup_Date,
  Routes_Backup_Document,
  Routes_Backup_ExportBody,
  Routes_Backup_HasSection,
  Routes_Backup_ImportBody,
  Routes_Backup_ImportResult,
  Routes_Backup_IsRateLimited_Returns,
  Routes_Backup_Passkey,
  Routes_Backup_PasskeyOptions,
  Routes_Backup_PasskeyOptionsBody,
  Routes_Backup_PasskeyVerifyBody,
  Routes_Backup_PreviewBody,
  Routes_Backup_Principal,
  Routes_Backup_RejectIdentity_Field,
  Routes_Backup_RejectIdentity_Message,
  Routes_Backup_RejectIdentity_Returns,
  Routes_Backup_RelyingPartyName,
  Routes_Backup_Request,
  Routes_Backup_Response,
  Routes_Backup_Returns,
  Routes_Backup_Runner_Access,
  Routes_Backup_Runner_Attempts,
  Routes_Backup_Runner_Constructor_Access,
  Routes_Backup_Runner_Constructor_Attempts,
  Routes_Backup_Runner_Constructor_Context,
  Routes_Backup_Runner_Constructor_Grants,
  Routes_Backup_Runner_Context,
  Routes_Backup_Runner_Grants,
  Routes_Backup_Runner_Guards,
  Routes_Backup_Runner_Register_App,
  Routes_Backup_Runner_Register_Returns,
  Routes_Backup_Runner_Service,
  Routes_Backup_SendLegacySourceError_Error,
  Routes_Backup_SendLegacySourceError_Message,
  Routes_Backup_SendLegacySourceError_Response,
  Routes_Backup_SendLegacySourceError_Returns,
  Routes_Backup_SendLegacySourceError_Status,
  Routes_Backup_SessionId_Returns,
  Routes_Backup_TotpCode,
  Routes_Backup_TotpEnabled,
  Routes_Backup_TotpVerified,
  Routes_Backup_Verification,
} from '../types/routes/backup.d.ts';

/**
 * Backup - Rp Name.
 *
 * Names this app in the browser's passkey prompt.
 * WebAuthn displays it beside the requesting hostname.
 *
 * @since UNRELEASED
 */
const RP_NAME: Routes_Backup_RelyingPartyName = 'Stonker Bot for Discord';

/**
 * Backup - Purpose Schema.
 *
 * Restricts grants to one sensitive operation.
 * Export and import credentials are never interchangeable.
 *
 * @since UNRELEASED
 */
const purposeSchema = z.enum([
  'export',
  'import',
]);

/**
 * Backup - Confirmation Schema.
 *
 * Validates password and optional authenticator proof.
 * Factor requirements still come from the current account.
 *
 * @since UNRELEASED
 */
const confirmationSchema = z.object({
  code: z.string().trim().regex(LIB_REGEX_PATTERN_BACKUP_TOTP_CODE, 'Enter the 6-digit code from your authenticator app.').optional(),
  password: z.string().min(1, 'Enter your password.').max(1024),
  purpose: purposeSchema,
}).strict();

/**
 * Backup - Has Section.
 *
 * Requires at least one selected export section.
 * Empty files are not valid version-one documents.
 *
 * @returns {boolean}
 *
 * @since UNRELEASED
 */
const hasSection: Routes_Backup_HasSection = (sections) => Object.values(sections).some(Boolean);

/**
 * Backup - Sections Schema.
 *
 * Lists all version-one export sections.
 * Strict validation rejects unknown section flags.
 *
 * @since UNRELEASED
 */
const sectionsSchema = z.object({
  accessTokens: z.boolean(),
  connection: z.boolean(),
  features: z.boolean(),
  notifications: z.boolean(),
}).strict().refine(hasSection, { message: 'Choose at least one section.' });

/**
 * Backup - Grant Schema.
 *
 * Bounds opaque grants before a digest lookup.
 * The in-memory store remains authoritative for validity.
 *
 * @since UNRELEASED
 */
const grantSchema = z.string().regex(LIB_REGEX_PATTERN_BACKUP_GRANT);

/**
 * Backup - Export Schema.
 *
 * Couples selected sections to one export grant.
 * The route consumes the grant before opening secrets.
 *
 * @since UNRELEASED
 */
const exportSchema = z.object({
  grant: grantSchema,
  sections: sectionsSchema,
}).strict();

/**
 * Backup - Preview Schema.
 *
 * Accepts one fully validated wizard source.
 * Preview never mutates application state.
 *
 * @since UNRELEASED
 */
const previewSchema = z.object({ source: backupImportSourceSchema }).strict();

/**
 * Backup - Import Schema.
 *
 * Revalidates the reviewed source beside a one-use import grant.
 * Validation repeats immediately before apply.
 *
 * @since UNRELEASED
 */
const importSchema = z.object({
  grant: grantSchema,
  source: backupImportSourceSchema,
}).strict();

/**
 * Backup - Passkey Options Schema.
 *
 * Binds a passkey ceremony to its requested operation.
 * The route also binds it to the current browser session.
 *
 * @since UNRELEASED
 */
const passkeyOptionsSchema = z.object({ purpose: purposeSchema }).strict();

/**
 * Backup - Passkey Verify Schema.
 *
 * Adds an operation purpose to the normal passkey assertion contract.
 * A mismatched purpose invalidates the ceremony.
 *
 * @since UNRELEASED
 */
const passkeyVerifySchema = passkeySignInVerify.extend({ purpose: purposeSchema }).strict();

/**
 * Backup - Send Legacy Source Error.
 *
 * Preserves the older config.json importer's actionable file and conflict errors.
 * Unrecognized failures continue to the server error handler as operational faults.
 *
 * @param {Routes_Backup_SendLegacySourceError_Response} response - Response.
 * @param {Routes_Backup_SendLegacySourceError_Error}    error    - Error.
 *
 * @returns {Routes_Backup_SendLegacySourceError_Returns}
 *
 * @since UNRELEASED
 */
function sendLegacySourceError(response: Routes_Backup_SendLegacySourceError_Response, error: Routes_Backup_SendLegacySourceError_Error): Routes_Backup_SendLegacySourceError_Returns {
  const message: Routes_Backup_SendLegacySourceError_Message = (error instanceof Error) ? error.message : '';
  let status: Routes_Backup_SendLegacySourceError_Status = 422;

  if (message.startsWith('This config.json belongs to another Discord server.') === true) {
    status = 409;
  } else if (message.startsWith('Another server already uses ') === true) {
    status = 409;
  } else if (
    (error instanceof SyntaxError) === false
    && message !== 'Legacy configuration must be a top-level JSON object.'
    && message !== 'Legacy configuration could not be converted to database settings.'
  ) {
    return false;
  }

  sendError(response, status, 'backup_source_invalid', (error instanceof SyntaxError) ? 'That config.json is not valid JSON.' : message);
  return true;
}

/**
 * Backup.
 *
 * Protects every backup operation with a browser session and the strongest permission.
 * Personal access tokens cannot reach these endpoints.
 *
 * @since UNRELEASED
 */
export class Runner {
  /**
   * Backup - Access.
   *
   * Supplies the shared session and permission guards.
   * Every registered route uses both checks.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #access: Routes_Backup_Runner_Access;

  /**
   * Backup - Attempts.
   *
   * Reuses the sign-in limiter for fresh identity proof.
   * Incorrect passwords, codes, and passkeys record failures.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #attempts: Routes_Backup_Runner_Attempts;

  /**
   * Backup - Ceremonies.
   *
   * Binds pending passkey assertions to session and purpose.
   * Entries live only in this process for five minutes.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #ceremonies: Routes_Backup_Ceremonies = new Map();

  /**
   * Backup - Context.
   *
   * Provides database, encryption, and application configuration.
   * Route handlers share the same server context.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #context: Routes_Backup_Runner_Context;

  /**
   * Backup - Grants.
   *
   * Holds only digests of short-lived confirmation credentials.
   * Each credential is session-, purpose-, and single-use-bound.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #grants: Routes_Backup_Runner_Grants;

  /**
   * Backup - Service.
   *
   * Creates portable files and applies reviewed imports.
   * Secret handling remains outside the HTTP layer.
   *
   * @private
   *
   * @since UNRELEASED
   */
  readonly #service: Routes_Backup_Runner_Service;

  /**
   * Backup - Constructor.
   *
   * Binds routes to authentication, storage, and process-local grants.
   * Optional grant injection keeps expiry behavior directly testable.
   *
   * @param {Routes_Backup_Runner_Constructor_Context}  context  - Context.
   * @param {Routes_Backup_Runner_Constructor_Access}   access   - Access.
   * @param {Routes_Backup_Runner_Constructor_Attempts} attempts - Attempts.
   * @param {Routes_Backup_Runner_Constructor_Grants}   [grants] - Grants.
   *
   * @since UNRELEASED
   */
  public constructor(context: Routes_Backup_Runner_Constructor_Context, access: Routes_Backup_Runner_Constructor_Access, attempts: Routes_Backup_Runner_Constructor_Attempts, grants?: Routes_Backup_Runner_Constructor_Grants) {
    this.#access = access;
    this.#attempts = attempts;
    this.#context = context;
    this.#grants = grants ?? new GrantStore();
    this.#service = new BackupService(context);
    return;
  }

  /**
   * Backup - Register.
   *
   * Installs session-only, users-manage-only backup endpoints.
   * All state-changing calls retain the normal CSRF protection.
   *
   * @param {Routes_Backup_Runner_Register_App} app - App.
   *
   * @returns {Routes_Backup_Runner_Register_Returns}
   *
   * @since UNRELEASED
   */
  public register(app: Routes_Backup_Runner_Register_App): Routes_Backup_Runner_Register_Returns {
    const guards: Routes_Backup_Runner_Guards = [
      this.#access.requireSession(true),
      this.#access.requirePermission('users:manage'),
    ];

    app.post('/api/v1/backup/confirmation', ...guards, handleAsync(this['routeConfirmation'].bind(this)));
    app.post('/api/v1/backup/confirmation/passkey/options', ...guards, handleAsync(this['routePasskeyOptions'].bind(this)));
    app.post('/api/v1/backup/confirmation/passkey/verify', ...guards, handleAsync(this['routePasskeyVerify'].bind(this)));
    app.post('/api/v1/backup/export', ...guards, handleAsync(this['routeExport'].bind(this)));
    app.post('/api/v1/backup/imports/preview', ...guards, handleAsync(this['routePreview'].bind(this)));
    app.post('/api/v1/backup/imports', ...guards, handleAsync(this['routeImport'].bind(this)));
    return;
  }

  /**
   * Backup - Session ID.
   *
   * Digests the current raw browser session for process-local bindings.
   * Raw session tokens are never retained in the grant store.
   *
   * @param {Routes_Backup_Principal} principal - Principal.
   *
   * @private
   *
   * @returns {Routes_Backup_SessionId_Returns}
   *
   * @since UNRELEASED
   */
  private sessionId(principal: Routes_Backup_Principal): Routes_Backup_SessionId_Returns {
    if (principal['kind'] !== 'session' || principal['sessionToken'] === undefined) {
      throw new Error('Backup requires a browser session.');
    }
    return digestValue(principal['sessionToken']);
  }

  /**
   * Backup - Is Rate Limited.
   *
   * Reuses the sign-in attempt bucket for fresh identity proof.
   * A limited client receives the normal retry duration.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {boolean}
   *
   * @since UNRELEASED
   */
  private isRateLimited(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_IsRateLimited_Returns {
    const key: Routes_Backup_AttemptKey = `sign-in:${getClientLimitKey(request)}`;
    if (this.#attempts.isAllowed(key) === true) {
      return false;
    }

    response.set('Retry-After', String(this.#attempts.getRetryAfterSeconds(key)));

    sendError(response, 429, 'rate_limited', 'Too many attempts. Try again in 15 minutes.');
    return true;
  }

  /**
   * Backup - Reject Identity.
   *
   * Records one failed fresh-auth proof without exposing factor state.
   * The response points to the field the user can correct.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   * @param {'password' | 'code'}    field    - Field.
   * @param {string}                 message  - Message.
   *
   * @private
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  private rejectIdentity(request: Routes_Backup_Request, response: Routes_Backup_Response, field: Routes_Backup_RejectIdentity_Field, message: Routes_Backup_RejectIdentity_Message): Routes_Backup_RejectIdentity_Returns {
    this.#attempts.recordFailure(`sign-in:${getClientLimitKey(request)}`);

    sendError(response, 422, 'identity_not_confirmed', message, [{
      field,
      message,
      path: [field],
    }]);
    return;
  }

  /**
   * Backup - Route Confirmation.
   *
   * Confirms password and required TOTP before issuing a purpose-bound grant.
   * Successful proof resets the shared sign-in attempt bucket.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Backup_Returns}
   *
   * @since UNRELEASED
   */
  private async routeConfirmation(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_Returns {
    if (this.isRateLimited(request, response) === true) {
      return;
    }

    const body: Routes_Backup_ConfirmationBody = confirmationSchema.safeParse(request.body);
    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Check the highlighted fields.');
      return;
    }

    const principal: Routes_Backup_Principal = getPrincipal(response);
    if (await confirmPanelPassword(this.#context['pool'], principal['user']['id'], body.data['password']) === false) {
      this.rejectIdentity(request, response, 'password', 'That password is incorrect.');
      return;
    }

    const totpEnabled: Routes_Backup_TotpEnabled = await hasPanelTotp(this.#context['pool'], principal['user']['id']);

    if (totpEnabled === true) {
      const code: Routes_Backup_TotpCode = body.data['code'];
      const totpVerified: Routes_Backup_TotpVerified = code !== undefined && await verifyPanelTotp(this.#context['pool'], principal['user']['id'], code, this.#context['credentialKey']);

      if (totpVerified === false) {
        this.rejectIdentity(request, response, 'code', 'That authenticator code is incorrect.');
        return;
      }
    }

    this.#attempts.reset(`sign-in:${getClientLimitKey(request)}`);

    response.json(this.#grants.issue(this.sessionId(principal), body.data['purpose']));
    return;
  }

  /**
   * Backup - Route Passkey Options.
   *
   * Starts a passkey ceremony bound to this session and purpose.
   * The database ceremony and process binding expire together.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Backup_Returns}
   *
   * @since UNRELEASED
   */
  private async routePasskeyOptions(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_Returns {
    const body: Routes_Backup_PasskeyOptionsBody = passkeyOptionsSchema.safeParse(request.body);
    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose what you are confirming.');
      return;
    }
    if (isPasskeyAvailable(request) === false) {
      sendError(response, 409, 'passkeys_unavailable', 'Passkeys need https and a domain name. Open this page at its domain, or use your password.');
      return;
    }
    const principal: Routes_Backup_Principal = getPrincipal(response);
    const configuration: Routes_Backup_Configuration = getWebauthnConfiguration(request, RP_NAME);
    const options: Routes_Backup_PasskeyOptions = await createPasskeyAuthenticationOptions(configuration);
    const ceremonyId: Routes_Backup_CeremonyId = await createPanelWebauthnCeremony(this.#context['pool'], {
      challenge: options['challenge'],
      kind: 'authentication',
      name: null,
      origin: configuration['origin'],
      rpId: configuration['rpId'],
      userId: principal['user']['id'],
    });

    this.#ceremonies.set(ceremonyId, {
      expiresAt: Date.now() + (5 * 60 * 1000),
      purpose: body.data['purpose'],
      sessionId: this.sessionId(principal),
    });

    response.json({
      ceremonyId,
      options,
    });
    return;
  }

  /**
   * Backup - Route Passkey Verify.
   *
   * Verifies the bound passkey and issues the same one-use grant.
   * Failed assertions share the normal fresh-authentication limiter.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Backup_Returns}
   *
   * @since UNRELEASED
   */
  private async routePasskeyVerify(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_Returns {
    if (this.isRateLimited(request, response) === true) {
      return;
    }

    const body: Routes_Backup_PasskeyVerifyBody = passkeyVerifySchema.safeParse(request.body);
    if (body.success === false) {
      this.rejectIdentity(request, response, 'password', 'That passkey wasn\'t accepted.');
      return;
    }

    const principal: Routes_Backup_Principal = getPrincipal(response);
    const binding: Routes_Backup_CeremonyBindingResult = this.#ceremonies.get(body.data['ceremonyId']);

    if (
      binding === undefined
      || binding['expiresAt'] <= Date.now()
      || binding['sessionId'] !== this.sessionId(principal)
      || binding['purpose'] !== body.data['purpose']
    ) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');
      return;
    }

    this.#ceremonies.delete(body.data['ceremonyId']);
    const ceremony: Routes_Backup_Ceremony = await takePanelWebauthnCeremony(this.#context['pool'], body.data['ceremonyId'], 'authentication');
    const configuration: Routes_Backup_Configuration = getWebauthnConfiguration(request, RP_NAME);
    const passkey: Routes_Backup_Passkey = await getPanelPasskey(this.#context['pool'], body.data['credential']['id']);
    if (
      ceremony === undefined
      || ceremony['userId'] !== principal['user']['id']
      || ceremony['rpId'] !== configuration['rpId']
      || ceremony['origin'] !== configuration['origin']
      || passkey === undefined
      || passkey['userId'] !== principal['user']['id']
    ) {
      this.rejectIdentity(request, response, 'password', 'That passkey wasn\'t accepted.');
      return;
    }

    const credential: Routes_Backup_Credential = {
      clientExtensionResults: body.data['credential']['clientExtensionResults'],
      id: body.data['credential']['id'],
      rawId: body.data['credential']['rawId'],
      response: {
        authenticatorData: body.data['credential']['response']['authenticatorData'],
        clientDataJSON: body.data['credential']['response']['clientDataJSON'],
        signature: body.data['credential']['response']['signature'],
        ...((body.data['credential']['response']['userHandle'] === undefined) ? {} : { userHandle: body.data['credential']['response']['userHandle'] }),
      },
      type: body.data['credential']['type'],
      ...((body.data['credential']['authenticatorAttachment'] === undefined) ? {} : { authenticatorAttachment: body.data['credential']['authenticatorAttachment'] }),
    };
    const verification: Routes_Backup_Verification = await verifyPasskeyAuthentication(configuration, credential, ceremony['challenge'], passkey);
    if (verification === undefined || await updatePanelPasskeyUsage(this.#context['pool'], passkey['id'], passkey['counter'], verification, ceremony['rpId']) === false) {
      this.rejectIdentity(request, response, 'password', 'That passkey wasn\'t accepted.');
      return;
    }

    this.#attempts.reset(`sign-in:${getClientLimitKey(request)}`);

    response.json(this.#grants.issue(this.sessionId(principal), body.data['purpose']));
    return;
  }

  /**
   * Backup - Route Export.
   *
   * Consumes an export grant before opening selected secrets.
   * The response bypasses server-side caches and secret logging.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Backup_Returns}
   *
   * @since UNRELEASED
   */
  private async routeExport(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_Returns {
    const body: Routes_Backup_ExportBody = exportSchema.safeParse(request.body);
    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose what to export.');
      return;
    }

    const principal: Routes_Backup_Principal = getPrincipal(response);
    if (this.#grants.consume(body.data['grant'], this.sessionId(principal), 'export') === false) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');
      return;
    }

    const document: Routes_Backup_Document = await this.#service.createDocument(body.data['sections'], principal['user']['id']);
    const date: Routes_Backup_Date = document['exportedAt'].slice(0, 10);

    response.set('Content-Disposition', `attachment; filename="discord-stonker-bot-export-${date}.json"`);

    response.json(document);
    return;
  }

  /**
   * Backup - Route Preview.
   *
   * Plans either supported source without changing state.
   * Human-readable rows drive the Settings and Review steps.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Backup_Returns}
   *
   * @since UNRELEASED
   */
  private async routePreview(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_Returns {
    const body: Routes_Backup_PreviewBody = previewSchema.safeParse(request.body);
    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose a valid backup file.');
      return;
    }

    const principal: Routes_Backup_Principal = getPrincipal(response);

    try {
      response.json(await this.#service.preview(body.data['source'], principal['user']['id']));
    } catch (error) {
      if (body.data['source']['type'] === 'legacy' && sendLegacySourceError(response, error) === true) {
        return;
      }

      throw error;
    }

    return;
  }

  /**
   * Backup - Route Import.
   *
   * Consumes an import grant before the transactional apply.
   * Audit metadata records section names without secret values.
   *
   * @param {Routes_Backup_Request}  request  - Request.
   * @param {Routes_Backup_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Backup_Returns}
   *
   * @since UNRELEASED
   */
  private async routeImport(request: Routes_Backup_Request, response: Routes_Backup_Response): Routes_Backup_Returns {
    const body: Routes_Backup_ImportBody = importSchema.safeParse(request.body);
    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose a valid backup file.');
      return;
    }

    const principal: Routes_Backup_Principal = getPrincipal(response);
    if (this.#grants.consume(body.data['grant'], this.sessionId(principal), 'import') === false) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');
      return;
    }

    try {
      const result: Routes_Backup_ImportResult = await this.#service.apply(body.data['source'], principal['user']['id']);

      writeLog('info', 'web', 'backup_imported', {
        importedSections: result['importedSections'],
        source: body.data['source']['type'],
        userId: principal['user']['id'],
        username: principal['user']['username'],
      });

      response.json(result);
    } catch (error) {
      if (body.data['source']['type'] === 'legacy' && sendLegacySourceError(response, error) === true) {
        return;
      }

      throw error;
    }
    return;
  }
}
