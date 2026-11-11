import z from 'zod';

import {
  getPrincipal,
  getServerId,
} from '../lib/access.js';
import {
  getGuildFeature,
  getGuildSecretCiphertexts,
  listGuildFeatureStates,
  saveGuildFeatureConfiguration,
  setNormalizedGuildFeatureEnabled,
} from '../lib/configuration-database.js';
import {
  decryptSecret,
  encryptSecret,
} from '../lib/credential-vault.js';
import {
  getFeatureCatalog,
  getFeatureDefinition,
  isFeatureKey,
} from '../lib/feature-catalog.js';
import { validateFeatureConfiguration } from '../lib/feature-configuration-validation.js';
import {
  getFeatureEditor,
  getFeatureExample,
} from '../lib/feature-editor.js';
import {
  collectSecretReferences,
  createSecretKey,
  isSecretReference,
  pointerToPath,
  readJsonPointer,
} from '../lib/feature-secrets.js';
import {
  handleAsync,
  sendError,
  sendValidationError,
} from '../lib/http.js';
import {
  getErrorMessage,
  writeLog,
} from '../lib/logger.js';
import {
  findWebApplicationPathConflicts,
  forgetWebApplicationRoutes,
} from '../lib/web-application-features.js';

import type {
  Routes_Features_CheckConfiguration_Configuration,
  Routes_Features_CheckConfiguration_FeatureKey,
  Routes_Features_CheckConfiguration_Issues,
  Routes_Features_CheckConfiguration_Node,
  Routes_Features_CheckConfiguration_Resolver,
  Routes_Features_CheckConfiguration_Returns,
  Routes_Features_CheckConfiguration_ValidationConfiguration,
  Routes_Features_CheckConfiguration_Values,
  Routes_Features_CreateSecretIssue_Path,
  Routes_Features_CreateSecretIssue_Pointer,
  Routes_Features_CreateSecretIssue_Returns,
  Routes_Features_CreateSecretPurpose_Returns,
  Routes_Features_CreateSecretPurpose_SecretKey,
  Routes_Features_CreateSecretPurpose_ServerId,
  Routes_Features_CreateSummary_Definition,
  Routes_Features_CreateSummary_Returns,
  Routes_Features_CreateSummary_State,
  Routes_Features_DecryptStoredSecret_Ciphertext,
  Routes_Features_DecryptStoredSecret_CredentialKey,
  Routes_Features_DecryptStoredSecret_Returns,
  Routes_Features_DecryptStoredSecret_SecretKey,
  Routes_Features_DecryptStoredSecret_ServerId,
  Routes_Features_MissingSecretKey,
  Routes_Features_ReadFeatureKey_FeatureKey,
  Routes_Features_ReadFeatureKey_Request,
  Routes_Features_ReadFeatureKey_Response,
  Routes_Features_ReadFeatureKey_Returns,
  Routes_Features_Runner_Access,
  Routes_Features_Runner_Constructor_Access,
  Routes_Features_Runner_Constructor_Context,
  Routes_Features_Runner_Context,
  Routes_Features_Runner_CreateDetail_Ciphertexts,
  Routes_Features_Runner_CreateDetail_Configuration,
  Routes_Features_Runner_CreateDetail_FeatureKey,
  Routes_Features_Runner_CreateDetail_Returns,
  Routes_Features_Runner_CreateDetail_SecretKeys,
  Routes_Features_Runner_CreateDetail_Secrets,
  Routes_Features_Runner_CreateDetail_ServerId,
  Routes_Features_Runner_CreateDetail_Stored,
  Routes_Features_Runner_ReadSecretValues_Ciphertexts,
  Routes_Features_Runner_ReadSecretValues_Returns,
  Routes_Features_Runner_ReadSecretValues_SecretKeys,
  Routes_Features_Runner_ReadSecretValues_ServerId,
  Routes_Features_Runner_ReadSecretValues_Value,
  Routes_Features_Runner_ReadSecretValues_Values,
  Routes_Features_Runner_Register_App,
  Routes_Features_Runner_Register_Returns,
  Routes_Features_Runner_RouteDetail_Detail,
  Routes_Features_Runner_RouteDetail_FeatureKey,
  Routes_Features_Runner_RouteDetail_Request,
  Routes_Features_Runner_RouteDetail_Response,
  Routes_Features_Runner_RouteDetail_Returns,
  Routes_Features_Runner_RouteEnabled_Body,
  Routes_Features_Runner_RouteEnabled_FeatureKey,
  Routes_Features_Runner_RouteEnabled_Issues,
  Routes_Features_Runner_RouteEnabled_Outcome,
  Routes_Features_Runner_RouteEnabled_PathConflicts,
  Routes_Features_Runner_RouteEnabled_Principal,
  Routes_Features_Runner_RouteEnabled_Request,
  Routes_Features_Runner_RouteEnabled_Response,
  Routes_Features_Runner_RouteEnabled_Returns,
  Routes_Features_Runner_RouteEnabled_SecretKeys,
  Routes_Features_Runner_RouteEnabled_ServerId,
  Routes_Features_Runner_RouteEnabled_States,
  Routes_Features_Runner_RouteEnabled_Stored,
  Routes_Features_Runner_RouteEnabled_WebApplicationSettings,
  Routes_Features_Runner_RouteList_Request,
  Routes_Features_Runner_RouteList_Response,
  Routes_Features_Runner_RouteList_Returns,
  Routes_Features_Runner_RouteList_States,
  Routes_Features_Runner_RouteSave_Body,
  Routes_Features_Runner_RouteSave_Configuration,
  Routes_Features_Runner_RouteSave_Detail,
  Routes_Features_Runner_RouteSave_FeatureKey,
  Routes_Features_Runner_RouteSave_FirstIssue,
  Routes_Features_Runner_RouteSave_Issues,
  Routes_Features_Runner_RouteSave_KeptKeys,
  Routes_Features_Runner_RouteSave_NewSecrets,
  Routes_Features_Runner_RouteSave_Node,
  Routes_Features_Runner_RouteSave_Outcome,
  Routes_Features_Runner_RouteSave_PathConflicts,
  Routes_Features_Runner_RouteSave_Pointer,
  Routes_Features_Runner_RouteSave_Principal,
  Routes_Features_Runner_RouteSave_Request,
  Routes_Features_Runner_RouteSave_Response,
  Routes_Features_Runner_RouteSave_Returns,
  Routes_Features_Runner_RouteSave_SecretKey,
  Routes_Features_Runner_RouteSave_Secrets,
  Routes_Features_Runner_RouteSave_ServerId,
  Routes_Features_Runner_RouteSave_Stored,
  Routes_Features_Runner_RouteSave_StoredConfiguration,
  Routes_Features_Runner_RouteSave_StoredKeys,
  Routes_Features_Runner_RouteSave_Value,
  Routes_Features_Runner_RouteSave_Values,
  Routes_Features_Runner_RouteSave_WebApplicationSettings,
  Routes_Features_SendRevisionConflict_Response,
  Routes_Features_SendRevisionConflict_Returns,
} from '../types/routes/features.d.ts';

/**
 * Features - Missing Secret Key.
 *
 * Stands in for a secret nobody entered yet, so the other settings can still be checked.
 * It is only used while checking and is never saved.
 *
 * @since 4.0.0
 */
const MISSING_SECRET_KEY: Routes_Features_MissingSecretKey = 'missing-secret';

/**
 * Features - Secret Value Schema.
 *
 * Accepts one new secret value of up to 3,000 bytes, apart from surrounding spaces.
 * An empty value keeps the secret that is already saved.
 *
 * @since 4.0.0
 */
const secretValueSchema = z.string({ error: 'Enter the secret as text.' }).trim().refine(
  (value) => Buffer.byteLength(value, 'utf8') <= 3_000,
  'Use 3,000 bytes or fewer.',
);

/**
 * Features - Save Schema.
 *
 * Reads the settings, the revision they were opened at, and new secrets by JSON pointer.
 * The feature's own schema and compiler check the settings themselves.
 *
 * @since 4.0.0
 */
const saveSchema = z.object({
  configuration: z.union([
    z.array(z.unknown()),
    z.record(z.string(), z.unknown()),
  ], { error: 'Send the settings as an object or a list.' }),
  expectedRevision: z.number({ error: 'Send the revision you opened.' })
    .int('Send the revision you opened.')
    .min(0, 'Send the revision you opened.'),
  secrets: z.record(z.string(), secretValueSchema).optional(),
}).strict();

/**
 * Features - Enabled Schema.
 *
 * Accepts the new state of one feature switch.
 * Any other field in the body is reported back as not accepted.
 *
 * @since 4.0.0
 */
const enabledSchema = z.object({
  enabled: z.boolean({ error: 'Choose on or off.' }),
}).strict();

/**
 * Features - Create Secret Issue.
 *
 * Reports a secret field that has no value yet, at the path of its secret object.
 * The control panel shows the message next to that field.
 *
 * @param {Routes_Features_CreateSecretIssue_Pointer} pointer - Pointer.
 *
 * @returns {Routes_Features_CreateSecretIssue_Returns}
 *
 * @since 4.0.0
 */
function createSecretIssue(pointer: Routes_Features_CreateSecretIssue_Pointer): Routes_Features_CreateSecretIssue_Returns {
  const path: Routes_Features_CreateSecretIssue_Path = [
    'configuration',
    ...pointerToPath(pointer),
  ];

  return {
    field: path.join('.'),
    message: 'Enter this secret.',
    path,
  };
}

/**
 * Features - Check Configuration.
 *
 * Checks one configuration with the secret values that could be found for it.
 * Secrets without a value are reported, and only the schema runs until every one is set.
 *
 * @param {Routes_Features_CheckConfiguration_FeatureKey}    featureKey    - Feature key.
 * @param {Routes_Features_CheckConfiguration_Configuration} configuration - Configuration.
 * @param {Routes_Features_CheckConfiguration_Values}        values        - Values.
 *
 * @returns {Routes_Features_CheckConfiguration_Returns}
 *
 * @since 4.0.0
 */
function checkConfiguration(featureKey: Routes_Features_CheckConfiguration_FeatureKey, configuration: Routes_Features_CheckConfiguration_Configuration, values: Routes_Features_CheckConfiguration_Values): Routes_Features_CheckConfiguration_Returns {
  const validationConfiguration: Routes_Features_CheckConfiguration_ValidationConfiguration = structuredClone(configuration);
  const issues: Routes_Features_CheckConfiguration_Issues = [];

  for (const reference of collectSecretReferences(validationConfiguration)) {
    if (values.has(reference['key']) === true) {
      continue;
    }

    const node: Routes_Features_CheckConfiguration_Node = readJsonPointer(validationConfiguration, reference['pointer']);

    if (isSecretReference(node) === true) {
      Reflect.set(node, '$secret', MISSING_SECRET_KEY);
    }

    issues.push(createSecretIssue(reference['pointer']));
  }

  const resolver: Routes_Features_CheckConfiguration_Resolver = (issues.length === 0) ? (key) => values.get(key) : undefined;

  return [
    ...issues,
    ...validateFeatureConfiguration(featureKey, validationConfiguration, resolver),
  ];
}

/**
 * Features - Create Secret Purpose.
 *
 * Binds a stored secret to its server and key, the same way the bot reads it back.
 * A ciphertext moved to another server or key no longer decrypts.
 *
 * @param {Routes_Features_CreateSecretPurpose_ServerId}  serverId  - Server id.
 * @param {Routes_Features_CreateSecretPurpose_SecretKey} secretKey - Secret key.
 *
 * @returns {Routes_Features_CreateSecretPurpose_Returns}
 *
 * @since 4.0.0
 */
function createSecretPurpose(serverId: Routes_Features_CreateSecretPurpose_ServerId, secretKey: Routes_Features_CreateSecretPurpose_SecretKey): Routes_Features_CreateSecretPurpose_Returns {
  return `guild-secret:${serverId}:${secretKey}`;
}

/**
 * Features - Create Summary.
 *
 * Describes one catalog feature with its switch, revision, and last change in a server.
 * Features never saved there are off, not configured, and at revision 0.
 *
 * @param {Routes_Features_CreateSummary_Definition} definition - Definition.
 * @param {Routes_Features_CreateSummary_State}      state      - State.
 *
 * @returns {Routes_Features_CreateSummary_Returns}
 *
 * @since 4.0.0
 */
function createSummary(definition: Routes_Features_CreateSummary_Definition, state: Routes_Features_CreateSummary_State): Routes_Features_CreateSummary_Returns {
  return {
    category: definition['category'],
    configured: (state === undefined) ? false : state['configured'],
    description: definition['description'],
    enabled: (state === undefined) ? false : state['enabled'],
    key: definition['key'],
    name: definition['name'],
    revision: (state === undefined) ? 0 : state['revision'],
    updatedAt: (state === undefined) ? null : state['updatedAt'],
  };
}

/**
 * Features - Decrypt Stored Secret.
 *
 * Reads one saved secret value, or undefined when it no longer decrypts.
 * That happens after the credential key changes, and the secret is then entered again.
 *
 * @param {Routes_Features_DecryptStoredSecret_ServerId}      serverId      - Server id.
 * @param {Routes_Features_DecryptStoredSecret_SecretKey}     secretKey     - Secret key.
 * @param {Routes_Features_DecryptStoredSecret_Ciphertext}    ciphertext    - Ciphertext.
 * @param {Routes_Features_DecryptStoredSecret_CredentialKey} credentialKey - Credential key.
 *
 * @returns {Routes_Features_DecryptStoredSecret_Returns}
 *
 * @since 4.0.0
 */
function decryptStoredSecret(serverId: Routes_Features_DecryptStoredSecret_ServerId, secretKey: Routes_Features_DecryptStoredSecret_SecretKey, ciphertext: Routes_Features_DecryptStoredSecret_Ciphertext, credentialKey: Routes_Features_DecryptStoredSecret_CredentialKey): Routes_Features_DecryptStoredSecret_Returns {
  try {
    return decryptSecret(ciphertext, createSecretPurpose(serverId, secretKey), credentialKey);
  } catch (error) {
    writeLog('warn', 'web', 'feature_secret_unreadable', {
      error: getErrorMessage(error),
      secretKey,
      serverId,
    });

    return undefined;
  }
}

/**
 * Features - Read Feature Key.
 *
 * Checks the :featureKey route parameter against the feature catalog.
 * An unknown key returns undefined after the error is sent.
 *
 * @param {Routes_Features_ReadFeatureKey_Request}  request  - Request.
 * @param {Routes_Features_ReadFeatureKey_Response} response - Response.
 *
 * @returns {Routes_Features_ReadFeatureKey_Returns}
 *
 * @since 4.0.0
 */
function readFeatureKey(request: Routes_Features_ReadFeatureKey_Request, response: Routes_Features_ReadFeatureKey_Response): Routes_Features_ReadFeatureKey_Returns {
  const featureKey: Routes_Features_ReadFeatureKey_FeatureKey = request.params['featureKey'];

  if (featureKey === undefined || isFeatureKey(featureKey) === false) {
    sendError(response, 404, 'feature_not_found', 'That feature doesn\'t exist.');

    return undefined;
  }

  return featureKey;
}

/**
 * Features - Send Revision Conflict.
 *
 * Tells the caller the feature was saved by someone else after they opened it.
 * Nothing was changed.
 *
 * @param {Routes_Features_SendRevisionConflict_Response} response - Response.
 *
 * @returns {Routes_Features_SendRevisionConflict_Returns}
 *
 * @since 4.0.0
 */
function sendRevisionConflict(response: Routes_Features_SendRevisionConflict_Response): Routes_Features_SendRevisionConflict_Returns {
  sendError(response, 409, 'revision_conflict', 'This feature changed since you opened it. Reload to see the latest version.');

  return;
}

/**
 * Features.
 *
 * Reads, saves, and switches the bot features of one Discord server.
 * Any signed-in role can read them; changes need a role that can change settings.
 *
 * @since 4.0.0
 */
export class Runner {
  /**
   * Features - Access.
   *
   * Accepts a browser session or a token with the features:read or features:write scope.
   * Every route also checks the caller can see the server.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #access: Routes_Features_Runner_Access;

  /**
   * Features - Context.
   *
   * Supplies the database pool, the credential key for secrets, and the starter settings.
   * The starter settings provide each feature's example.
   *
   * @private
   *
   * @since 4.0.0
   */
  readonly #context: Routes_Features_Runner_Context;

  /**
   * Features - Constructor.
   *
   * Binds the feature routes to the shared context and access checks.
   * Nothing is registered until register is called.
   *
   * @param {Routes_Features_Runner_Constructor_Context} context - Context.
   * @param {Routes_Features_Runner_Constructor_Access}  access  - Access.
   *
   * @since 4.0.0
   */
  public constructor(context: Routes_Features_Runner_Constructor_Context, access: Routes_Features_Runner_Constructor_Access) {
    this.#access = access;
    this.#context = context;

    return;
  }

  /**
   * Features - Register.
   *
   * Installs the feature list, one feature's details, saving, and the switch.
   * Saving and switching need the features:write scope and the configuration:write permission.
   *
   * @param {Routes_Features_Runner_Register_App} app - App.
   *
   * @returns {Routes_Features_Runner_Register_Returns}
   *
   * @since 4.0.0
   */
  public register(app: Routes_Features_Runner_Register_App): Routes_Features_Runner_Register_Returns {
    app.get('/api/v1/servers/:serverId/features', this.#access.requireAccess({
      mutation: false,
      scope: 'features:read',
    }), this.#access.requireServer(), handleAsync(this['routeList'].bind(this)));

    app.get('/api/v1/servers/:serverId/features/:featureKey', this.#access.requireAccess({
      mutation: false,
      scope: 'features:read',
    }), this.#access.requireServer(), handleAsync(this['routeDetail'].bind(this)));

    app.put('/api/v1/servers/:serverId/features/:featureKey', this.#access.requireAccess({
      mutation: true,
      scope: 'features:write',
    }), this.#access.requirePermission('configuration:write'), this.#access.requireServer(), handleAsync(this['routeSave'].bind(this)));

    app.put('/api/v1/servers/:serverId/features/:featureKey/enabled', this.#access.requireAccess({
      mutation: true,
      scope: 'features:write',
    }), this.#access.requirePermission('configuration:write'), this.#access.requireServer(), handleAsync(this['routeEnabled'].bind(this)));

    return;
  }

  /**
   * Features - Route Detail.
   *
   * Answers one feature with its saved settings, the form that edits them, and an example.
   * Secret values never leave the server; only whether each one is saved does.
   *
   * @param {Routes_Features_Runner_RouteDetail_Request}  request  - Request.
   * @param {Routes_Features_Runner_RouteDetail_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Features_Runner_RouteDetail_Returns}
   *
   * @since 4.0.0
   */
  private async routeDetail(request: Routes_Features_Runner_RouteDetail_Request, response: Routes_Features_Runner_RouteDetail_Response): Routes_Features_Runner_RouteDetail_Returns {
    const featureKey: Routes_Features_Runner_RouteDetail_FeatureKey = readFeatureKey(request, response);

    if (featureKey === undefined) {
      return;
    }

    const detail: Routes_Features_Runner_RouteDetail_Detail = await this.createDetail(getServerId(response), featureKey);

    response.json(detail);

    return;
  }

  /**
   * Features - Route Enabled.
   *
   * Turns one feature on or off. Turning it on checks the saved settings first.
   * Asking for the state it already has changes nothing and doesn't reload the bot.
   *
   * @param {Routes_Features_Runner_RouteEnabled_Request}  request  - Request.
   * @param {Routes_Features_Runner_RouteEnabled_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Features_Runner_RouteEnabled_Returns}
   *
   * @since 4.0.0
   */
  private async routeEnabled(request: Routes_Features_Runner_RouteEnabled_Request, response: Routes_Features_Runner_RouteEnabled_Response): Routes_Features_Runner_RouteEnabled_Returns {
    const featureKey: Routes_Features_Runner_RouteEnabled_FeatureKey = readFeatureKey(request, response);

    if (featureKey === undefined) {
      return;
    }

    const body: Routes_Features_Runner_RouteEnabled_Body = enabledSchema.safeParse(request.body);

    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Choose on or off.');

      return;
    }

    const serverId: Routes_Features_Runner_RouteEnabled_ServerId = getServerId(response);

    if (body.data['enabled'] === true) {
      const stored: Routes_Features_Runner_RouteEnabled_Stored = await getGuildFeature(this.#context['pool'], serverId, featureKey);

      if (stored === undefined || stored['configuration'] === null) {
        sendError(response, 409, 'feature_not_configured', 'Set up this feature before turning it on.');

        return;
      }

      const secretKeys: Routes_Features_Runner_RouteEnabled_SecretKeys = [...new Set(collectSecretReferences(stored['configuration']).map((reference) => reference['key']))];
      const issues: Routes_Features_Runner_RouteEnabled_Issues = checkConfiguration(featureKey, stored['configuration'], await this.readSecretValues(serverId, secretKeys));

      if (issues.length > 0) {
        sendError(response, 422, 'invalid_request', 'Fix this feature\'s settings before turning it on.', issues);

        return;
      }

      if (featureKey === 'web-applications') {
        const settings: Routes_Features_Runner_RouteEnabled_WebApplicationSettings = {
          features: {
            'web-applications': {
              configuration: stored['configuration'],
              enabled: true,
            },
          },
        };
        const pathConflicts: Routes_Features_Runner_RouteEnabled_PathConflicts = await findWebApplicationPathConflicts(this.#context['pool'], serverId, settings);

        if (pathConflicts.length > 0) {
          sendError(response, 409, 'public_path_conflict', `Another server already uses ${pathConflicts[0]}. Choose a unique public path.`);

          return;
        }
      }
    }

    const outcome: Routes_Features_Runner_RouteEnabled_Outcome = await setNormalizedGuildFeatureEnabled(this.#context['pool'], serverId, featureKey, body.data['enabled']);

    if (outcome === 'missing' && body.data['enabled'] === true) {
      sendError(response, 409, 'feature_not_configured', 'Set up this feature before turning it on.');

      return;
    }

    if (outcome === 'changed') {
      const principal: Routes_Features_Runner_RouteEnabled_Principal = getPrincipal(response);

      if (featureKey === 'web-applications') {
        forgetWebApplicationRoutes(this.#context['pool']);
      }

      writeLog('info', 'web', (body.data['enabled'] === true) ? 'feature_enabled' : 'feature_disabled', {
        featureKey,
        serverId,
        userId: principal['user']['id'],
        username: principal['user']['username'],
      });
    }

    const states: Routes_Features_Runner_RouteEnabled_States = await listGuildFeatureStates(this.#context['pool'], serverId);

    response.json(createSummary(getFeatureDefinition(featureKey), states.get(featureKey)));

    return;
  }

  /**
   * Features - Route List.
   *
   * Answers every catalog feature with its state in one server, in catalog order.
   * Features never saved there are listed as off and not configured.
   *
   * @param {Routes_Features_Runner_RouteList_Request}  _request - Request.
   * @param {Routes_Features_Runner_RouteList_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Features_Runner_RouteList_Returns}
   *
   * @since 4.0.0
   */
  private async routeList(_request: Routes_Features_Runner_RouteList_Request, response: Routes_Features_Runner_RouteList_Response): Routes_Features_Runner_RouteList_Returns {
    const states: Routes_Features_Runner_RouteList_States = await listGuildFeatureStates(this.#context['pool'], getServerId(response));

    response.json({
      items: getFeatureCatalog().map((definition) => createSummary(definition, states.get(definition['key']))),
    });

    return;
  }

  /**
   * Features - Route Save.
   *
   * Checks new settings with their real secret values, then saves both in one transaction.
   * New secret values get fresh keys, and secrets nothing uses any more are deleted.
   * Saving web applications makes their public paths answer right away.
   *
   * @param {Routes_Features_Runner_RouteSave_Request}  request  - Request.
   * @param {Routes_Features_Runner_RouteSave_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Features_Runner_RouteSave_Returns}
   *
   * @since 4.0.0
   */
  private async routeSave(request: Routes_Features_Runner_RouteSave_Request, response: Routes_Features_Runner_RouteSave_Response): Routes_Features_Runner_RouteSave_Returns {
    const featureKey: Routes_Features_Runner_RouteSave_FeatureKey = readFeatureKey(request, response);

    if (featureKey === undefined) {
      return;
    }

    const body: Routes_Features_Runner_RouteSave_Body = saveSchema.safeParse(request.body);

    if (body.success === false) {
      sendValidationError(response, 422, body.error, 'Check the feature settings.');

      return;
    }

    const serverId: Routes_Features_Runner_RouteSave_ServerId = getServerId(response);
    const stored: Routes_Features_Runner_RouteSave_Stored = await getGuildFeature(this.#context['pool'], serverId, featureKey);

    if (((stored === undefined) ? 0 : stored['revision']) !== body.data['expectedRevision']) {
      sendRevisionConflict(response);

      return;
    }

    const storedConfiguration: Routes_Features_Runner_RouteSave_StoredConfiguration = (stored === undefined) ? null : stored['configuration'];
    const storedKeys: Routes_Features_Runner_RouteSave_StoredKeys = new Set(collectSecretReferences(storedConfiguration).map((reference) => reference['key']));
    const configuration: Routes_Features_Runner_RouteSave_Configuration = structuredClone(body.data['configuration']);
    const issues: Routes_Features_Runner_RouteSave_Issues = [];
    const newSecrets: Routes_Features_Runner_RouteSave_NewSecrets = [];

    for (const entry of Object.entries(body.data['secrets'] ?? {})) {
      const pointer: Routes_Features_Runner_RouteSave_Pointer = entry[0];
      const value: Routes_Features_Runner_RouteSave_Value = entry[1];
      const node: Routes_Features_Runner_RouteSave_Node = readJsonPointer(configuration, pointer);

      if (isSecretReference(node) === false) {
        issues.push({
          field: `secrets.${pointer}`,
          message: 'This isn\'t a secret field.',
          path: [
            'secrets',
            pointer,
          ],
        });

        continue;
      }

      if (value === '') {
        continue;
      }

      const secretKey: Routes_Features_Runner_RouteSave_SecretKey = createSecretKey(featureKey);

      Reflect.set(node, '$secret', secretKey);

      newSecrets.push({
        key: secretKey,
        value,
      });
    }

    const keptKeys: Routes_Features_Runner_RouteSave_KeptKeys = [...new Set(collectSecretReferences(configuration).map((reference) => reference['key']).filter((key) => storedKeys.has(key) === true))];
    const values: Routes_Features_Runner_RouteSave_Values = await this.readSecretValues(serverId, keptKeys);

    for (const newSecret of newSecrets) {
      values.set(newSecret['key'], newSecret['value']);
    }

    issues.push(...checkConfiguration(featureKey, configuration, values));

    const firstIssue: Routes_Features_Runner_RouteSave_FirstIssue = issues[0];

    if (firstIssue !== undefined) {
      sendError(response, 422, 'invalid_request', firstIssue['message'], issues);

      return;
    }

    if (
      featureKey === 'web-applications'
      && stored !== undefined
      && stored['enabled'] === true
    ) {
      const settings: Routes_Features_Runner_RouteSave_WebApplicationSettings = {
        features: {
          'web-applications': {
            configuration,
            enabled: true,
          },
        },
      };
      const pathConflicts: Routes_Features_Runner_RouteSave_PathConflicts = await findWebApplicationPathConflicts(this.#context['pool'], serverId, settings);

      if (pathConflicts.length > 0) {
        sendError(response, 409, 'public_path_conflict', `Another server already uses ${pathConflicts[0]}. Choose a unique public path.`);

        return;
      }
    }

    const secrets: Routes_Features_Runner_RouteSave_Secrets = newSecrets.map((newSecret) => ({
      ciphertext: encryptSecret(newSecret['value'], createSecretPurpose(serverId, newSecret['key']), this.#context['credentialKey']),
      key: newSecret['key'],
    }));
    const outcome: Routes_Features_Runner_RouteSave_Outcome = await saveGuildFeatureConfiguration(this.#context['pool'], {
      configuration,
      expectedRevision: body.data['expectedRevision'],
      featureKey,
      guildIdentifier: serverId,
      secrets,
    });

    if (outcome['status'] === 'revision-conflict') {
      sendRevisionConflict(response);

      return;
    }

    if (featureKey === 'web-applications') {
      forgetWebApplicationRoutes(this.#context['pool']);
    }

    const principal: Routes_Features_Runner_RouteSave_Principal = getPrincipal(response);

    writeLog('info', 'web', 'feature_saved', {
      featureKey,
      serverId,
      userId: principal['user']['id'],
      username: principal['user']['username'],
    });

    const detail: Routes_Features_Runner_RouteSave_Detail = await this.createDetail(serverId, featureKey);

    response.json(detail);

    return;
  }

  /**
   * Features - Create Detail.
   *
   * Combines one feature's summary with its saved settings, form, example, and saved secrets.
   * The secrets map only says which referenced secrets have a stored value.
   *
   * @param {Routes_Features_Runner_CreateDetail_ServerId}   serverId   - Server id.
   * @param {Routes_Features_Runner_CreateDetail_FeatureKey} featureKey - Feature key.
   *
   * @private
   *
   * @returns {Routes_Features_Runner_CreateDetail_Returns}
   *
   * @since 4.0.0
   */
  private async createDetail(serverId: Routes_Features_Runner_CreateDetail_ServerId, featureKey: Routes_Features_Runner_CreateDetail_FeatureKey): Routes_Features_Runner_CreateDetail_Returns {
    const stored: Routes_Features_Runner_CreateDetail_Stored = await getGuildFeature(this.#context['pool'], serverId, featureKey);
    const configuration: Routes_Features_Runner_CreateDetail_Configuration = (stored === undefined) ? null : stored['configuration'];
    const secretKeys: Routes_Features_Runner_CreateDetail_SecretKeys = [...new Set(collectSecretReferences(configuration).map((reference) => reference['key']))];
    const ciphertexts: Routes_Features_Runner_CreateDetail_Ciphertexts = await getGuildSecretCiphertexts(this.#context['pool'], serverId, secretKeys);
    const secrets: Routes_Features_Runner_CreateDetail_Secrets = {};

    for (const secretKey of secretKeys) {
      if (ciphertexts.has(secretKey) === true) {
        Reflect.set(secrets, secretKey, true);
      }
    }

    return {
      ...createSummary(getFeatureDefinition(featureKey), (stored === undefined) ? undefined : {
        configured: configuration !== null,
        enabled: stored['enabled'],
        revision: stored['revision'],
        updatedAt: stored['updatedAt'],
      }),
      configuration,
      editor: getFeatureEditor(featureKey),
      example: getFeatureExample(featureKey, this.#context['starterSettings']),
      secrets,
    };
  }

  /**
   * Features - Read Secret Values.
   *
   * Decrypts the named secrets of one server for checking settings before they are saved.
   * Secrets that are missing or no longer decrypt are left out.
   *
   * @param {Routes_Features_Runner_ReadSecretValues_ServerId}   serverId   - Server id.
   * @param {Routes_Features_Runner_ReadSecretValues_SecretKeys} secretKeys - Secret keys.
   *
   * @private
   *
   * @returns {Routes_Features_Runner_ReadSecretValues_Returns}
   *
   * @since 4.0.0
   */
  private async readSecretValues(serverId: Routes_Features_Runner_ReadSecretValues_ServerId, secretKeys: Routes_Features_Runner_ReadSecretValues_SecretKeys): Routes_Features_Runner_ReadSecretValues_Returns {
    const ciphertexts: Routes_Features_Runner_ReadSecretValues_Ciphertexts = await getGuildSecretCiphertexts(this.#context['pool'], serverId, secretKeys);
    const values: Routes_Features_Runner_ReadSecretValues_Values = new Map();

    for (const entry of ciphertexts) {
      const value: Routes_Features_Runner_ReadSecretValues_Value = decryptStoredSecret(serverId, entry[0], entry[1], this.#context['credentialKey']);

      if (value !== undefined) {
        values.set(entry[0], value);
      }
    }

    return values;
  }
}
