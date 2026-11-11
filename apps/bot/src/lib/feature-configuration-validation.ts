import { prepareAntiRaidFeatures } from './anti-raid-features.js';
import { prepareAuditFeatures } from './audit-features.js';
import { getFeatureSchema } from './feature-editor.js';
import { prepareGatewayFeatures } from './gateway-features.js';
import { prepareImpersonatorFeatures } from './impersonator-features.js';
import {
  muteLogs,
  unmuteLogs,
} from './logger.js';
import { prepareMessageFeatures } from './message-features.js';
import { prepareMessageRoutingFeatures } from './message-routing-features.js';
import {
  LIB_REGEX_PATTERN_DISCORD_IDENTIFIER,
  LIB_REGEX_PATTERN_POSITIVE_INTEGER,
  LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH,
  LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH,
  LIB_REGEX_PATTERN_WEBHOOK_PROPERTY_PATH,
  LIB_REGEX_PATTERN_WEBHOOK_VARIABLE_IDENTIFIER,
} from './regex.js';
import { prepareRoleSyncFeatures } from './role-sync-features.js';
import { prepareScammerFeatures } from './scammer-features.js';
import { prepareServerToolFeatures } from './server-tool-features.js';
import { prepareWebApplicationFeatures } from './web-application-features.js';
import { prepareWorkerFeatures } from './worker-features.js';

import type {
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_ConfigurationErrors,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_Details,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_Entries,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_FeatureKey,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_FeaturePrefix,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_Issues,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_Message,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_Path,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_RawPath,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_Returns,
  Lib_FeatureConfigurationValidation_CreateCompilerIssues_SeparatorIndex,
  Lib_FeatureConfigurationValidation_CreateIssue_Message,
  Lib_FeatureConfigurationValidation_CreateIssue_Path,
  Lib_FeatureConfigurationValidation_CreateIssue_Returns,
  Lib_FeatureConfigurationValidation_CreateIssue_SegmentsPath,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Configuration,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Error,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Field,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Issue,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Issues,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Path,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Returns,
  Lib_FeatureConfigurationValidation_CreateSchemaIssues_Seen,
  Lib_FeatureConfigurationValidation_CreateSettings_Configuration,
  Lib_FeatureConfigurationValidation_CreateSettings_FeatureKey,
  Lib_FeatureConfigurationValidation_CreateSettings_Returns,
  Lib_FeatureConfigurationValidation_DescribeFormat_Format,
  Lib_FeatureConfigurationValidation_DescribeFormat_Pattern,
  Lib_FeatureConfigurationValidation_DescribeFormat_Returns,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Configuration,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Expected,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Issue,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Limit,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Origin,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Returns,
  Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Value,
  Lib_FeatureConfigurationValidation_FormatPatterns,
  Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Configuration,
  Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_FeatureKey,
  Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Prepared,
  Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Returns,
  Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Secrets,
  Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Configuration,
  Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_FeatureKey,
  Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Returns,
  Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Secrets,
  Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Settings,
  Lib_FeatureConfigurationValidation_Preparers,
  Lib_FeatureConfigurationValidation_ReadPath_Current,
  Lib_FeatureConfigurationValidation_ReadPath_Path,
  Lib_FeatureConfigurationValidation_ReadPath_Returns,
  Lib_FeatureConfigurationValidation_ReadPath_Value,
  Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Configuration,
  Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_FeatureKey,
  Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Parsed,
  Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Prepared,
  Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Returns,
  Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Secrets,
} from '../types/lib/feature-configuration-validation.d.ts';

/**
 * Feature Configuration Validation - Format Patterns.
 *
 * Explains in plain words what each fixed text format expects.
 * Patterns are matched by their regular expression text, the way zod reports it.
 *
 * @since 4.0.0
 */
const formatPatterns: Lib_FeatureConfigurationValidation_FormatPatterns = [
  {
    message: 'Enter a Discord ID (17 to 20 digits).',
    pattern: LIB_REGEX_PATTERN_DISCORD_IDENTIFIER.toString(),
  },
  {
    message: 'Enter a whole number above 0.',
    pattern: LIB_REGEX_PATTERN_POSITIVE_INTEGER.toString(),
  },
  {
    message: 'Use a path like /invite or /join/members.',
    pattern: LIB_REGEX_PATTERN_PUBLIC_INVITE_PATH.toString(),
  },
  {
    message: 'Use a path like /webhooks/orders.',
    pattern: LIB_REGEX_PATTERN_PUBLIC_WEBHOOK_PATH.toString(),
  },
  {
    message: 'Use dot-separated property names, like order.total.',
    pattern: LIB_REGEX_PATTERN_WEBHOOK_PROPERTY_PATH.toString(),
  },
  {
    message: 'Use capital letters, digits, and underscores, like ORDER_TOTAL.',
    pattern: LIB_REGEX_PATTERN_WEBHOOK_VARIABLE_IDENTIFIER.toString(),
  },
];

/**
 * Feature Configuration Validation - Preparers.
 *
 * Routes every catalog key through the feature module that owns its domain checks.
 * Features that read secrets get the resolver the caller provides.
 *
 * @since 4.0.0
 */
const preparers: Lib_FeatureConfigurationValidation_Preparers = {
  'anti-raid': (settings) => prepareAntiRaidFeatures(settings),
  'auto-replies': (settings) => prepareMessageFeatures(settings),
  'broadcast-alerts': (settings) => prepareGatewayFeatures(settings),
  'bump-threads': (settings) => prepareGatewayFeatures(settings),
  'detect-suspicious-words': (settings) => prepareMessageFeatures(settings),
  'impersonator-alerts': (settings) => prepareImpersonatorFeatures(settings),
  'message-copiers': (settings, secrets) => prepareMessageRoutingFeatures(settings, secrets),
  'message-proxies': (settings, secrets) => prepareMessageRoutingFeatures(settings, secrets),
  'regex-rules': (settings) => prepareMessageFeatures(settings),
  'remove-affiliates': (settings) => prepareMessageFeatures(settings),
  'role-messages': (settings) => prepareGatewayFeatures(settings),
  'rss-feeds': (settings) => prepareWorkerFeatures(settings),
  'scammer-alerts': (settings) => prepareScammerFeatures(settings),
  'schedule-posts': (settings) => prepareWorkerFeatures(settings),
  'server-tools': (settings) => prepareServerToolFeatures(settings),
  'snitch': (settings) => prepareAuditFeatures(settings),
  'sync-roles': (settings) => prepareRoleSyncFeatures(settings),
  'toggle-perms': (settings) => prepareWorkerFeatures(settings),
  'web-applications': (settings, secrets) => prepareWebApplicationFeatures(settings, secrets),
};

/**
 * Feature Configuration Validation - Is Feature Configuration Valid.
 *
 * Reports whether a staged legacy configuration compiles with its imported secret values.
 * Import uses it to decide which features may be turned on.
 *
 * @param {Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_FeatureKey}    featureKey    - Feature key.
 * @param {Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Configuration} configuration - Configuration.
 * @param {Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Secrets}       secrets       - Secrets.
 *
 * @returns {Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Returns}
 *
 * @since 4.0.0
 */
export function isFeatureConfigurationValid(
  featureKey: Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_FeatureKey,
  configuration: Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Configuration,
  secrets: Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Secrets,
): Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Returns {
  const prepared: Lib_FeatureConfigurationValidation_IsFeatureConfigurationValid_Prepared = prepareFeatureConfiguration(
    featureKey,
    configuration,
    secrets,
  );

  return prepared['activeFeatureKeys'].includes(featureKey);
}

/**
 * Feature Configuration Validation - Validate Feature Configuration.
 *
 * Checks a configuration against its schema, then its compiler with the real secret values.
 * Without a secret resolver only the schema is checked. Issues sit under "configuration".
 *
 * @param {Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_FeatureKey}    featureKey    - Feature key.
 * @param {Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Configuration} configuration - Configuration.
 * @param {Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Secrets}       secrets       - Secrets.
 *
 * @returns {Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Returns}
 *
 * @since 4.0.0
 */
export function validateFeatureConfiguration(
  featureKey: Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_FeatureKey,
  configuration: Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Configuration,
  secrets: Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Secrets,
): Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Returns {
  const parsed: Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Parsed = getFeatureSchema(featureKey).safeParse(configuration);

  if (parsed.success === false) {
    return createSchemaIssues(parsed.error, configuration);
  }

  if (secrets === undefined) {
    return [];
  }

  const prepared: Lib_FeatureConfigurationValidation_ValidateFeatureConfiguration_Prepared = prepareFeatureConfiguration(
    featureKey,
    configuration,
    secrets,
  );

  if (prepared['activeFeatureKeys'].includes(featureKey) === true) {
    return [];
  }

  return createCompilerIssues(featureKey, prepared['configurationErrors']);
}

/**
 * Feature Configuration Validation - Create Compiler Issues.
 *
 * Turns a feature compiler's error text into issues, keeping any path it names.
 * Errors without a path point at the whole configuration.
 *
 * @param {Lib_FeatureConfigurationValidation_CreateCompilerIssues_FeatureKey}          featureKey          - Feature key.
 * @param {Lib_FeatureConfigurationValidation_CreateCompilerIssues_ConfigurationErrors} configurationErrors - Configuration errors.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_CreateCompilerIssues_Returns}
 *
 * @since 4.0.0
 */
function createCompilerIssues(
  featureKey: Lib_FeatureConfigurationValidation_CreateCompilerIssues_FeatureKey,
  configurationErrors: Lib_FeatureConfigurationValidation_CreateCompilerIssues_ConfigurationErrors,
): Lib_FeatureConfigurationValidation_CreateCompilerIssues_Returns {
  const issues: Lib_FeatureConfigurationValidation_CreateCompilerIssues_Issues = [];
  const featurePrefix: Lib_FeatureConfigurationValidation_CreateCompilerIssues_FeaturePrefix = `${featureKey}: `;

  for (const configurationError of configurationErrors) {
    const details: Lib_FeatureConfigurationValidation_CreateCompilerIssues_Details = (
      configurationError.startsWith(featurePrefix) === true
    ) ? configurationError.slice(featurePrefix.length) : configurationError;
    const entries: Lib_FeatureConfigurationValidation_CreateCompilerIssues_Entries = details.split('; ');

    for (const entry of entries) {
      const separatorIndex: Lib_FeatureConfigurationValidation_CreateCompilerIssues_SeparatorIndex = entry.indexOf(': ');
      let rawPath: Lib_FeatureConfigurationValidation_CreateCompilerIssues_RawPath = '';
      let message: Lib_FeatureConfigurationValidation_CreateCompilerIssues_Message = entry;

      if (separatorIndex > 0 && entry.slice(0, separatorIndex).includes(' ') === false) {
        rawPath = entry.slice(0, separatorIndex);
        message = entry.slice(separatorIndex + 2);
      }

      const path: Lib_FeatureConfigurationValidation_CreateCompilerIssues_Path = (rawPath === '') ? [] : rawPath.split('.');

      issues.push(createIssue(path, message));
    }
  }

  if (issues.length === 0) {
    issues.push(createIssue([], 'These settings don\'t match what this feature needs.'));
  }

  return issues;
}

/**
 * Feature Configuration Validation - Create Issue.
 *
 * Builds one issue whose path starts with "configuration", as the control panel expects.
 * The field is the same path joined with dots.
 *
 * @param {Lib_FeatureConfigurationValidation_CreateIssue_Path}    path    - Path.
 * @param {Lib_FeatureConfigurationValidation_CreateIssue_Message} message - Message.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_CreateIssue_Returns}
 *
 * @since 4.0.0
 */
function createIssue(
  path: Lib_FeatureConfigurationValidation_CreateIssue_Path,
  message: Lib_FeatureConfigurationValidation_CreateIssue_Message,
): Lib_FeatureConfigurationValidation_CreateIssue_Returns {
  const segmentsPath: Lib_FeatureConfigurationValidation_CreateIssue_SegmentsPath = [
    'configuration',
    ...path,
  ];

  return {
    field: segmentsPath.join('.'),
    message,
    path: segmentsPath,
  };
}

/**
 * Feature Configuration Validation - Create Schema Issues.
 *
 * Converts schema failures into one plain-language issue per field.
 * Later problems on a field that already has an issue are dropped.
 *
 * @param {Lib_FeatureConfigurationValidation_CreateSchemaIssues_Error}         error         - Error.
 * @param {Lib_FeatureConfigurationValidation_CreateSchemaIssues_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_CreateSchemaIssues_Returns}
 *
 * @since 4.0.0
 */
function createSchemaIssues(
  error: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Error,
  configuration: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Configuration,
): Lib_FeatureConfigurationValidation_CreateSchemaIssues_Returns {
  const issues: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Issues = [];
  const seen: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Seen = new Set();

  for (const issue of error.issues) {
    const typedIssue: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Issue = issue;
    const path: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Path = typedIssue.path.map((segment) => String(segment));
    const field: Lib_FeatureConfigurationValidation_CreateSchemaIssues_Field = path.join('.');

    if (seen.has(field) === true) {
      continue;
    }

    seen.add(field);

    issues.push(createIssue(path, describeSchemaIssue(typedIssue, configuration)));
  }

  return issues;
}

/**
 * Feature Configuration Validation - Create Settings.
 *
 * Wraps one candidate configuration in the enabled-feature shape the feature modules read.
 * Only the candidate feature is present.
 *
 * @param {Lib_FeatureConfigurationValidation_CreateSettings_FeatureKey}    featureKey    - Feature key.
 * @param {Lib_FeatureConfigurationValidation_CreateSettings_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_CreateSettings_Returns}
 *
 * @since 4.0.0
 */
function createSettings(
  featureKey: Lib_FeatureConfigurationValidation_CreateSettings_FeatureKey,
  configuration: Lib_FeatureConfigurationValidation_CreateSettings_Configuration,
): Lib_FeatureConfigurationValidation_CreateSettings_Returns {
  return {
    features: {
      [featureKey]: {
        configuration,
        enabled: true,
      },
    },
  };
}

/**
 * Feature Configuration Validation - Describe Format.
 *
 * Explains a failed text format, such as a Discord ID, a URL, or a date.
 * Unknown patterns get a general message.
 *
 * @param {Lib_FeatureConfigurationValidation_DescribeFormat_Format}  format  - Format.
 * @param {Lib_FeatureConfigurationValidation_DescribeFormat_Pattern} pattern - Pattern.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_DescribeFormat_Returns}
 *
 * @since 4.0.0
 */
function describeFormat(
  format: Lib_FeatureConfigurationValidation_DescribeFormat_Format,
  pattern: Lib_FeatureConfigurationValidation_DescribeFormat_Pattern,
): Lib_FeatureConfigurationValidation_DescribeFormat_Returns {
  if (format === 'url') {
    return 'Enter a full URL, starting with https://.';
  }

  if (format === 'date') {
    return 'Use a date like 2027-01-31.';
  }

  for (const formatPattern of formatPatterns) {
    if (formatPattern['pattern'] === pattern) {
      return formatPattern['message'];
    }
  }

  return 'This value isn\'t in the expected format.';
}

/**
 * Feature Configuration Validation - Describe Schema Issue.
 *
 * Rewrites one schema failure in the control panel's words, using the field's current value.
 * Custom rule messages from the feature modules are kept as they are.
 *
 * @param {Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Issue}         issue         - Issue.
 * @param {Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Configuration} configuration - Configuration.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Returns}
 *
 * @since 4.0.0
 */
function describeSchemaIssue(
  issue: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Issue,
  configuration: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Configuration,
): Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Returns {
  const value: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Value = readPath(configuration, issue.path.map((segment) => String(segment)));

  switch (issue.code) {
    case 'invalid_type': {
      const expected: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Expected = issue.expected;

      if (value === undefined || value === null) {
        if (expected === 'array') {
          return 'Add at least one.';
        }

        return (expected === 'object') ? 'Fill in this section.' : 'Enter a value.';
      }

      if (expected === 'number' || expected === 'int') {
        return (expected === 'int') ? 'Enter a whole number.' : 'Enter a number.';
      }

      if (expected === 'boolean') {
        return 'Choose on or off.';
      }

      return (expected === 'string') ? 'Enter text.' : 'This value has the wrong shape.';
    }

    case 'too_small': {
      const origin: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Origin = issue.origin;
      const limit: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Limit = Number(issue.minimum);

      if (origin === 'string') {
        return (limit <= 1) ? 'Enter a value.' : `Use at least ${limit} characters.`;
      }

      if (origin === 'array' || origin === 'set') {
        return (limit <= 1) ? 'Add at least one.' : `Add at least ${limit}.`;
      }

      return (issue.inclusive === true) ? `Use ${limit} or more.` : `Use more than ${limit}.`;
    }

    case 'too_big': {
      const origin: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Origin = issue.origin;
      const limit: Lib_FeatureConfigurationValidation_DescribeSchemaIssue_Limit = Number(issue.maximum);

      if (origin === 'string') {
        return `Use ${limit} characters or fewer.`;
      }

      if (origin === 'array' || origin === 'set') {
        return `Use ${limit} or fewer.`;
      }

      return (issue.inclusive === true) ? `Use ${limit} or less.` : `Use less than ${limit}.`;
    }

    case 'invalid_format': {
      return describeFormat(issue.format, issue.pattern);
    }

    case 'invalid_value': {
      return 'Choose one of the options.';
    }

    case 'invalid_union': {
      return 'Choose a valid option.';
    }

    case 'custom': {
      return issue.message;
    }

    default: {
      return issue.message;
    }
  }
}

/**
 * Feature Configuration Validation - Prepare Feature Configuration.
 *
 * Runs one candidate through the same compiler the bot uses when it connects.
 * Secrets come from the given resolver, and the compiler's logs are muted.
 *
 * @param {Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_FeatureKey}    featureKey    - Feature key.
 * @param {Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Configuration} configuration - Configuration.
 * @param {Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Secrets}       secrets       - Secrets.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Returns}
 *
 * @since 4.0.0
 */
function prepareFeatureConfiguration(
  featureKey: Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_FeatureKey,
  configuration: Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Configuration,
  secrets: Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Secrets,
): Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Returns {
  const settings: Lib_FeatureConfigurationValidation_PrepareFeatureConfiguration_Settings = createSettings(
    featureKey,
    configuration,
  );

  // The compilers log what they reject, but a check from the control panel isn't the running bot.
  muteLogs();

  try {
    return preparers[featureKey](settings, secrets);
  } finally {
    unmuteLogs();
  }
}

/**
 * Feature Configuration Validation - Read Path.
 *
 * Reads the value at an issue's path, so its message can tell missing from wrong.
 * Paths that leave the structure give undefined.
 *
 * @param {Lib_FeatureConfigurationValidation_ReadPath_Value} value - Value.
 * @param {Lib_FeatureConfigurationValidation_ReadPath_Path}  path  - Path.
 *
 * @private
 *
 * @returns {Lib_FeatureConfigurationValidation_ReadPath_Returns}
 *
 * @since 4.0.0
 */
function readPath(
  value: Lib_FeatureConfigurationValidation_ReadPath_Value,
  path: Lib_FeatureConfigurationValidation_ReadPath_Path,
): Lib_FeatureConfigurationValidation_ReadPath_Returns {
  let current: Lib_FeatureConfigurationValidation_ReadPath_Current = value;

  for (const segment of path) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    current = Reflect.get(current, segment);
  }

  return current;
}
