import { getFeatureCatalog } from './feature-catalog.js';
import { isFeatureConfigurationValid } from './feature-configuration-validation.js';

import type {
  Lib_LegacyImport_GetStringAtPath_Current,
  Lib_LegacyImport_GetStringAtPath_Path,
  Lib_LegacyImport_GetStringAtPath_Returns,
  Lib_LegacyImport_GetStringAtPath_Value,
  Lib_LegacyImport_ImportLegacyConfiguration_CurrentDate,
  Lib_LegacyImport_ImportLegacyConfiguration_EnabledFeatureKeys,
  Lib_LegacyImport_ImportLegacyConfiguration_EnableImportedFeatures,
  Lib_LegacyImport_ImportLegacyConfiguration_FeatureConfiguration,
  Lib_LegacyImport_ImportLegacyConfiguration_FeatureConfigurationValid,
  Lib_LegacyImport_ImportLegacyConfiguration_FeatureEnabled,
  Lib_LegacyImport_ImportLegacyConfiguration_Features,
  Lib_LegacyImport_ImportLegacyConfiguration_GuildIdentifier,
  Lib_LegacyImport_ImportLegacyConfiguration_ImportedAt,
  Lib_LegacyImport_ImportLegacyConfiguration_InvalidFeatureKeys,
  Lib_LegacyImport_ImportLegacyConfiguration_Parsed,
  Lib_LegacyImport_ImportLegacyConfiguration_ParsedConfiguration,
  Lib_LegacyImport_ImportLegacyConfiguration_PreparedConfiguration,
  Lib_LegacyImport_ImportLegacyConfiguration_RawConfiguration,
  Lib_LegacyImport_ImportLegacyConfiguration_Recognized,
  Lib_LegacyImport_ImportLegacyConfiguration_RecognizedFeatureKeys,
  Lib_LegacyImport_ImportLegacyConfiguration_Returns,
  Lib_LegacyImport_ImportLegacyConfiguration_SanitizedConfiguration,
  Lib_LegacyImport_ImportLegacyConfiguration_SanitizedValue,
  Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver,
  Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Key,
  Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Returns,
  Lib_LegacyImport_ImportLegacyConfiguration_Secrets,
  Lib_LegacyImport_ImportLegacyConfiguration_SecretValues,
  Lib_LegacyImport_ImportLegacyConfiguration_Settings,
  Lib_LegacyImport_ImportLegacyConfiguration_UnknownSections,
  Lib_LegacyImport_ImportLegacyConfiguration_Warnings,
  Lib_LegacyImport_IsJsonObject_Value,
  Lib_LegacyImport_IsSecretPath_JoinedPath,
  Lib_LegacyImport_IsSecretPath_LastSegment,
  Lib_LegacyImport_IsSecretPath_MessageFeaturePath,
  Lib_LegacyImport_IsSecretPath_Path,
  Lib_LegacyImport_IsSecretPath_Returns,
  Lib_LegacyImport_IsSecretPath_WebhookKey,
  Lib_LegacyImport_IsSecretPath_WebhookPath,
  Lib_LegacyImport_PrepareLegacyConfiguration_Entries,
  Lib_LegacyImport_PrepareLegacyConfiguration_ParsedConfiguration,
  Lib_LegacyImport_PrepareLegacyConfiguration_PreparedConfiguration,
  Lib_LegacyImport_PrepareLegacyConfiguration_Returns,
  Lib_LegacyImport_PrepareLegacyConfiguration_SectionName,
  Lib_LegacyImport_PrepareLegacyConfiguration_SectionValue,
  Lib_LegacyImport_PrepareLegacyConfiguration_Warnings,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_DestinationNoun,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_Destinations,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_IgnoredDestinationCount,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_IgnoredMessageCopierCount,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_Method,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedDestinations,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedMessageCopier,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedMessageCopiers,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_Returns,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_RuleNoun,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_Value,
  Lib_LegacyImport_PrepareLegacyMessageCopiers_Warnings,
  Lib_LegacyImport_PrepareLegacySettings_Entries,
  Lib_LegacyImport_PrepareLegacySettings_PreparedSettings,
  Lib_LegacyImport_PrepareLegacySettings_Returns,
  Lib_LegacyImport_PrepareLegacySettings_SettingName,
  Lib_LegacyImport_PrepareLegacySettings_SettingValue,
  Lib_LegacyImport_PrepareLegacySettings_Value,
  Lib_LegacyImport_PrepareLegacySettings_Warnings,
  Lib_LegacyImport_SanitizeValue_ChildPath,
  Lib_LegacyImport_SanitizeValue_Entries,
  Lib_LegacyImport_SanitizeValue_EntryKey,
  Lib_LegacyImport_SanitizeValue_EntryValue,
  Lib_LegacyImport_SanitizeValue_Path,
  Lib_LegacyImport_SanitizeValue_Returns,
  Lib_LegacyImport_SanitizeValue_SanitizedArray,
  Lib_LegacyImport_SanitizeValue_SanitizedObject,
  Lib_LegacyImport_SanitizeValue_SecretKey,
  Lib_LegacyImport_SanitizeValue_Secrets,
  Lib_LegacyImport_SanitizeValue_Value,
} from '../types/lib/legacy-import.d.ts';

/**
 * Legacy Import - Twitter Feeds Warning.
 *
 * Explains skipped Twitter/X feed sections in the import report.
 * A file with both feed sections still gets the note once.
 *
 * @since 4.0.0
 */
const TWITTER_FEEDS_WARNING = 'Twitter/X feeds were skipped, since the bot no longer supports Twitter/X.';

/**
 * Legacy Import - Market Data Warning.
 *
 * Explains the skipped `api-fetch` section in the import report.
 * The section's lookups are no longer part of the bot, so nothing from it is kept.
 *
 * @since 4.0.0
 */
const MARKET_DATA_WARNING = 'Market data (api-fetch) was skipped, since the bot no longer supports market data.';

/**
 * Legacy Import - Get String At Path.
 *
 * Reads a legacy scalar without trusting intermediate object shapes.
 * Blank strings remain distinct from configured identifiers and credentials.
 *
 * @param {Lib_LegacyImport_GetStringAtPath_Value} value - Value.
 * @param {Lib_LegacyImport_GetStringAtPath_Path}  path  - Path.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_GetStringAtPath_Returns}
 *
 * @since 4.0.0
 */
function getStringAtPath(
  value: Lib_LegacyImport_GetStringAtPath_Value,
  path: Lib_LegacyImport_GetStringAtPath_Path,
): Lib_LegacyImport_GetStringAtPath_Returns {
  let current: Lib_LegacyImport_GetStringAtPath_Current = value;

  for (const segment of path) {
    if (isJsonObject(current) === false) {
      return undefined;
    }

    current = (current)[segment];
  }

  return (typeof current === 'string' && current.trim() !== '') ? current.trim() : undefined;
}

/**
 * Legacy Import - Import Legacy Configuration.
 *
 * Translates one archived config.json into the revisioned database model,
 * separating secrets from feature settings and listing what still needs attention.
 *
 * @param {Lib_LegacyImport_ImportLegacyConfiguration_RawConfiguration}       rawConfiguration       - Raw configuration.
 * @param {Lib_LegacyImport_ImportLegacyConfiguration_EnableImportedFeatures} enableImportedFeatures - Enable imported features.
 * @param {Lib_LegacyImport_ImportLegacyConfiguration_CurrentDate}            [currentDate]          - Current date.
 *
 * @returns {Lib_LegacyImport_ImportLegacyConfiguration_Returns}
 *
 * @since 4.0.0
 */
export function importLegacyConfiguration(
  rawConfiguration: Lib_LegacyImport_ImportLegacyConfiguration_RawConfiguration,
  enableImportedFeatures: Lib_LegacyImport_ImportLegacyConfiguration_EnableImportedFeatures,
  currentDate: Lib_LegacyImport_ImportLegacyConfiguration_CurrentDate = new Date(),
): Lib_LegacyImport_ImportLegacyConfiguration_Returns {
  const parsed: Lib_LegacyImport_ImportLegacyConfiguration_Parsed = JSON.parse(rawConfiguration);

  if (isJsonObject(parsed) === false) {
    throw new Error('Legacy configuration must be a top-level JSON object.');
  }

  const parsedConfiguration: Lib_LegacyImport_ImportLegacyConfiguration_ParsedConfiguration = parsed;
  const warnings: Lib_LegacyImport_ImportLegacyConfiguration_Warnings = [];
  const preparedConfiguration: Lib_LegacyImport_ImportLegacyConfiguration_PreparedConfiguration = prepareLegacyConfiguration(
    parsedConfiguration,
    warnings,
  );
  const secrets: Lib_LegacyImport_ImportLegacyConfiguration_Secrets = [];
  const sanitizedValue: Lib_LegacyImport_ImportLegacyConfiguration_SanitizedValue = sanitizeValue(
    preparedConfiguration,
    [],
    secrets,
  );

  if (isJsonObject(sanitizedValue) === false) {
    throw new Error('Legacy configuration could not be converted to database settings.');
  }

  const sanitizedConfiguration: Lib_LegacyImport_ImportLegacyConfiguration_SanitizedConfiguration = sanitizedValue;
  const secretValues: Lib_LegacyImport_ImportLegacyConfiguration_SecretValues = Object.fromEntries(secrets.map((secret) => [
    secret['key'],
    secret['value'],
  ]));
  /**
   * Legacy Import - Import Legacy Configuration - Resolve Secret.
   *
   * Returns the real value collected from the legacy file during validation.
   * Placeholder values can no longer make invalid credentials look configured.
   *
   * @param {Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Key} key - Key.
   *
   * @returns {Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Returns}
   *
   * @since 4.0.0
   */
  const resolveSecret: Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver = (
    key: Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Key,
  ): Lib_LegacyImport_ImportLegacyConfiguration_SecretResolver_Returns => secretValues[key] ?? '';
  const features: Lib_LegacyImport_ImportLegacyConfiguration_Features = {};
  const enabledFeatureKeys: Lib_LegacyImport_ImportLegacyConfiguration_EnabledFeatureKeys = [];
  const invalidFeatureKeys: Lib_LegacyImport_ImportLegacyConfiguration_InvalidFeatureKeys = [];
  const recognizedFeatureKeys: Lib_LegacyImport_ImportLegacyConfiguration_RecognizedFeatureKeys = [];
  const unknownSections: Lib_LegacyImport_ImportLegacyConfiguration_UnknownSections = [];

  for (const featureDefinition of getFeatureCatalog()) {
    const featureConfiguration: Lib_LegacyImport_ImportLegacyConfiguration_FeatureConfiguration = sanitizedConfiguration[
      featureDefinition['key']
    ];

    if (featureConfiguration === undefined) {
      continue;
    }

    const featureConfigurationValid: Lib_LegacyImport_ImportLegacyConfiguration_FeatureConfigurationValid = isFeatureConfigurationValid(
      featureDefinition['key'],
      featureConfiguration,
      resolveSecret,
    );

    const featureEnabled: Lib_LegacyImport_ImportLegacyConfiguration_FeatureEnabled = (
      enableImportedFeatures === true
      && featureDefinition['status'] === 'ported'
      && featureConfigurationValid === true
    );

    Reflect.set(features, featureDefinition['key'], {
      configuration: featureConfiguration,
      enabled: featureEnabled,
    });

    recognizedFeatureKeys.push(featureDefinition['key']);

    if (featureEnabled === true) {
      enabledFeatureKeys.push(featureDefinition['key']);
    }

    if (featureConfigurationValid === false) {
      invalidFeatureKeys.push(featureDefinition['key']);
    }
  }

  for (const sectionName of Object.keys(parsedConfiguration)) {
    if (
      sectionName === 'settings'
      || sectionName === 'api-fetch'
      || sectionName === 'twitter-feeds'
      || sectionName === 'x-feeds'
    ) {
      continue;
    }

    const recognized: Lib_LegacyImport_ImportLegacyConfiguration_Recognized = getFeatureCatalog().some(
      (featureDefinition) => featureDefinition['key'] === sectionName,
    );

    if (recognized === false) {
      unknownSections.push(sectionName);
    }
  }

  if (unknownSections.length > 0) {
    warnings.push(`Unrecognized legacy sections were not imported: ${unknownSections.join(', ')}.`);
  }

  const importedAt: Lib_LegacyImport_ImportLegacyConfiguration_ImportedAt = currentDate.toISOString();
  const settings: Lib_LegacyImport_ImportLegacyConfiguration_Settings = {
    core: sanitizedConfiguration['settings'] ?? {},
    features,
    migration: {
      importedAt,
      source: 'legacy-config.json',
    },
    schemaVersion: 1,
  };
  const guildIdentifier: Lib_LegacyImport_ImportLegacyConfiguration_GuildIdentifier = getStringAtPath(
    parsedConfiguration,
    [
      'settings',
      'discord',
      'guild',
      'guild-id',
    ],
  );

  return {
    discordToken: getStringAtPath(parsedConfiguration, [
      'settings',
      'discord',
      'token',
    ]),
    guildIdentifier,
    report: {
      enabledFeatureKeys,
      invalidFeatureKeys,
      recognizedFeatureKeys,
      secretCount: secrets.length,
      unknownSections,
      warnings,
    },
    secrets,
    settings,
  };
}

/**
 * Legacy Import - Prepare Legacy Configuration.
 *
 * Removes retired provider behavior before generic secret sanitization while
 * preserving unrelated Discord destinations and other supported settings.
 *
 * @param {Lib_LegacyImport_PrepareLegacyConfiguration_ParsedConfiguration} parsedConfiguration - Parsed configuration.
 * @param {Lib_LegacyImport_PrepareLegacyConfiguration_Warnings}            warnings            - Warnings.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_PrepareLegacyConfiguration_Returns}
 *
 * @since 4.0.0
 */
function prepareLegacyConfiguration(
  parsedConfiguration: Lib_LegacyImport_PrepareLegacyConfiguration_ParsedConfiguration,
  warnings: Lib_LegacyImport_PrepareLegacyConfiguration_Warnings,
): Lib_LegacyImport_PrepareLegacyConfiguration_Returns {
  const preparedConfiguration: Lib_LegacyImport_PrepareLegacyConfiguration_PreparedConfiguration = {};
  const entries: Lib_LegacyImport_PrepareLegacyConfiguration_Entries = Object.entries(parsedConfiguration);

  for (const entry of entries) {
    const sectionName: Lib_LegacyImport_PrepareLegacyConfiguration_SectionName = entry[0];
    const sectionValue: Lib_LegacyImport_PrepareLegacyConfiguration_SectionValue = entry[1];

    if (sectionName === 'api-fetch') {
      warnings.push(MARKET_DATA_WARNING);

      continue;
    }

    if (sectionName === 'twitter-feeds' || sectionName === 'x-feeds') {
      if (warnings.includes(TWITTER_FEEDS_WARNING) === false) {
        warnings.push(TWITTER_FEEDS_WARNING);
      }

      continue;
    }

    if (sectionName === 'settings') {
      Reflect.set(preparedConfiguration, sectionName, prepareLegacySettings(sectionValue, warnings));

      continue;
    }

    if (sectionName === 'message-copiers') {
      Reflect.set(preparedConfiguration, sectionName, prepareLegacyMessageCopiers(sectionValue, warnings));

      continue;
    }

    Reflect.set(preparedConfiguration, sectionName, sectionValue);
  }

  return preparedConfiguration;
}

/**
 * Legacy Import - Prepare Legacy Message Copiers.
 *
 * Preserves Discord destinations while removing retired publishing actions.
 * Rules that targeted only X are omitted because they have no remaining sink.
 *
 * @param {Lib_LegacyImport_PrepareLegacyMessageCopiers_Value}    value    - Value.
 * @param {Lib_LegacyImport_PrepareLegacyMessageCopiers_Warnings} warnings - Warnings.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_PrepareLegacyMessageCopiers_Returns}
 *
 * @since 4.0.0
 */
function prepareLegacyMessageCopiers(
  value: Lib_LegacyImport_PrepareLegacyMessageCopiers_Value,
  warnings: Lib_LegacyImport_PrepareLegacyMessageCopiers_Warnings,
): Lib_LegacyImport_PrepareLegacyMessageCopiers_Returns {
  if (Array.isArray(value) === false) {
    return value;
  }

  const preparedMessageCopiers: Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedMessageCopiers = [];
  let ignoredDestinationCount: Lib_LegacyImport_PrepareLegacyMessageCopiers_IgnoredDestinationCount = 0;
  let ignoredMessageCopierCount: Lib_LegacyImport_PrepareLegacyMessageCopiers_IgnoredMessageCopierCount = 0;

  for (const messageCopier of value) {
    if (isJsonObject(messageCopier) === false) {
      preparedMessageCopiers.push(messageCopier);

      continue;
    }

    const destinations: Lib_LegacyImport_PrepareLegacyMessageCopiers_Destinations = messageCopier['destinations'];

    if (Array.isArray(destinations) === false) {
      preparedMessageCopiers.push(messageCopier);

      continue;
    }

    const preparedDestinations: Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedDestinations = [];

    for (const destination of destinations) {
      const method: Lib_LegacyImport_PrepareLegacyMessageCopiers_Method = (
        isJsonObject(destination) === true
      ) ? destination['method'] : undefined;

      if (method === 'twitter-account') {
        ignoredDestinationCount += 1;

        continue;
      }

      preparedDestinations.push(destination);
    }

    if (
      destinations.length > 0
      && preparedDestinations.length === 0
    ) {
      ignoredMessageCopierCount += 1;

      continue;
    }

    const preparedMessageCopier: Lib_LegacyImport_PrepareLegacyMessageCopiers_PreparedMessageCopier = {
      ...messageCopier,
      destinations: preparedDestinations,
    };

    preparedMessageCopiers.push(preparedMessageCopier);
  }

  if (ignoredDestinationCount > 0) {
    const destinationNoun: Lib_LegacyImport_PrepareLegacyMessageCopiers_DestinationNoun = (ignoredDestinationCount === 1) ? 'destination' : 'destinations';

    warnings.push(`Skipped ${ignoredDestinationCount} message-copier ${destinationNoun} that posted to Twitter/X.`);
  }

  if (ignoredMessageCopierCount > 0) {
    const ruleNoun: Lib_LegacyImport_PrepareLegacyMessageCopiers_RuleNoun = (ignoredMessageCopierCount === 1) ? 'rule' : 'rules';

    warnings.push(`Skipped ${ignoredMessageCopierCount} message-copier ${ruleNoun} that only posted to Twitter/X.`);
  }

  return preparedMessageCopiers;
}

/**
 * Legacy Import - Prepare Legacy Settings.
 *
 * Keeps reusable core settings while discarding obsolete Twitter OAuth data.
 * Provider credentials must be entered again for any future X integration.
 *
 * @param {Lib_LegacyImport_PrepareLegacySettings_Value}    value    - Value.
 * @param {Lib_LegacyImport_PrepareLegacySettings_Warnings} warnings - Warnings.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_PrepareLegacySettings_Returns}
 *
 * @since 4.0.0
 */
function prepareLegacySettings(
  value: Lib_LegacyImport_PrepareLegacySettings_Value,
  warnings: Lib_LegacyImport_PrepareLegacySettings_Warnings,
): Lib_LegacyImport_PrepareLegacySettings_Returns {
  if (isJsonObject(value) === false) {
    return value;
  }

  const preparedSettings: Lib_LegacyImport_PrepareLegacySettings_PreparedSettings = {};
  const entries: Lib_LegacyImport_PrepareLegacySettings_Entries = Object.entries(value);

  for (const entry of entries) {
    const settingName: Lib_LegacyImport_PrepareLegacySettings_SettingName = entry[0];
    const settingValue: Lib_LegacyImport_PrepareLegacySettings_SettingValue = entry[1];

    if (settingName === 'twitter') {
      warnings.push('Twitter/X keys were skipped and not stored, since the bot no longer supports Twitter/X.');

      continue;
    }

    Reflect.set(preparedSettings, settingName, settingValue);
  }

  return preparedSettings;
}

/**
 * Legacy Import - Is JSON Object.
 *
 * Distinguishes dictionary objects from arrays and null at untrusted boundaries.
 * Successful checks allow safe keyed access without a type assertion.
 *
 * @param {Lib_LegacyImport_IsJsonObject_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_IsJsonObject_Returns}
 *
 * @since 4.0.0
 */
function isJsonObject(
  value: Lib_LegacyImport_IsJsonObject_Value,
): value is Lib_LegacyImport_GetStringAtPath_Value {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}

/**
 * Legacy Import - Is Secret Path.
 *
 * Identifies retained credentials from the archived schema, including webhook
 * URLs. Retired Twitter credentials are removed before this traversal.
 *
 * @param {Lib_LegacyImport_IsSecretPath_Path} path - Path.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_IsSecretPath_Returns}
 *
 * @since 4.0.0
 */
function isSecretPath(
  path: Lib_LegacyImport_IsSecretPath_Path,
): Lib_LegacyImport_IsSecretPath_Returns {
  const joinedPath: Lib_LegacyImport_IsSecretPath_JoinedPath = path.join('.');
  const lastSegment: Lib_LegacyImport_IsSecretPath_LastSegment = path.at(-1) ?? '';

  if (joinedPath === 'settings.discord.token') {
    return true;
  }

  if (
    joinedPath.startsWith('web-applications.invite-generator.recaptcha.') === true
    && lastSegment === 'secret-key'
  ) {
    return true;
  }

  if (
    joinedPath.startsWith('web-applications.map-webhooks.') === true
    && lastSegment === 'signing-secret'
  ) {
    return true;
  }

  if (
    joinedPath.startsWith('web-applications.https-server.') === true
    && [
      'ca',
      'cert',
      'key',
    ].includes(lastSegment) === true
  ) {
    return true;
  }

  const messageFeaturePath: Lib_LegacyImport_IsSecretPath_MessageFeaturePath = (
    joinedPath.startsWith('message-copiers.') === true
    || joinedPath.startsWith('message-proxies.') === true
  );
  const webhookPath: Lib_LegacyImport_IsSecretPath_WebhookPath = joinedPath.includes('.webhook.') === true;
  const webhookKey: Lib_LegacyImport_IsSecretPath_WebhookKey = (
    lastSegment === 'url'
    || lastSegment === 'webhook-url'
  );

  return (
    messageFeaturePath === true
    && webhookPath === true
    && webhookKey === true
  );
}

/**
 * Legacy Import - Sanitize Value.
 *
 * Copies legacy JSON while replacing credentials with encrypted-store references.
 * Array indexes remain in secret keys so nested webhooks can be restored later.
 *
 * @param {Lib_LegacyImport_SanitizeValue_Value}   value   - Value.
 * @param {Lib_LegacyImport_SanitizeValue_Path}    path    - Path.
 * @param {Lib_LegacyImport_SanitizeValue_Secrets} secrets - Secrets.
 *
 * @private
 *
 * @returns {Lib_LegacyImport_SanitizeValue_Returns}
 *
 * @since 4.0.0
 */
function sanitizeValue(
  value: Lib_LegacyImport_SanitizeValue_Value,
  path: Lib_LegacyImport_SanitizeValue_Path,
  secrets: Lib_LegacyImport_SanitizeValue_Secrets,
): Lib_LegacyImport_SanitizeValue_Returns {
  if (
    typeof value === 'string'
    && value.trim() !== ''
    && isSecretPath(path) === true
  ) {
    const secretKey: Lib_LegacyImport_SanitizeValue_SecretKey = path.join('.');

    secrets.push({
      key: secretKey,
      value,
    });

    return {
      $secret: secretKey,
    };
  }

  if (Array.isArray(value) === true) {
    const sanitizedArray: Lib_LegacyImport_SanitizeValue_SanitizedArray = [];

    for (let index = 0; index < value.length; index += 1) {
      const childPath: Lib_LegacyImport_SanitizeValue_ChildPath = [
        ...path,
        index.toString(),
      ];

      sanitizedArray.push(sanitizeValue(value[index], childPath, secrets));
    }

    return sanitizedArray;
  }

  if (isJsonObject(value) === true) {
    const sanitizedObject: Lib_LegacyImport_SanitizeValue_SanitizedObject = {};
    const entries: Lib_LegacyImport_SanitizeValue_Entries = Object.entries(value);

    for (const entry of entries) {
      const key: Lib_LegacyImport_SanitizeValue_EntryKey = entry[0];
      const childValue: Lib_LegacyImport_SanitizeValue_EntryValue = entry[1];
      const childPath: Lib_LegacyImport_SanitizeValue_ChildPath = [
        ...path,
        key,
      ];

      Reflect.set(sanitizedObject, key, sanitizeValue(childValue, childPath, secrets));
    }

    return sanitizedObject;
  }

  return value;
}
