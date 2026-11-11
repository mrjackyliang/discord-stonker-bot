import type {
  Lib_FeatureState_GetFeatureState_FeatureKey,
  Lib_FeatureState_GetFeatureState_FeaturesValue,
  Lib_FeatureState_GetFeatureState_RawState,
  Lib_FeatureState_GetFeatureState_Returns,
  Lib_FeatureState_GetFeatureState_Settings,
  Lib_FeatureState_IsRecord_Record,
  Lib_FeatureState_IsRecord_Value,
} from '../types/lib/feature-state.d.ts';

/**
 * Feature State - Get Feature State.
 *
 * Reads one feature's enabled flag and configuration from guild settings.
 * Missing or malformed entries return undefined instead of a default.
 *
 * @param {Lib_FeatureState_GetFeatureState_Settings}   settings   - Settings.
 * @param {Lib_FeatureState_GetFeatureState_FeatureKey} featureKey - Feature key.
 *
 * @returns {Lib_FeatureState_GetFeatureState_Returns}
 *
 * @since 4.0.0
 */
export function getFeatureState(
  settings: Lib_FeatureState_GetFeatureState_Settings,
  featureKey: Lib_FeatureState_GetFeatureState_FeatureKey,
): Lib_FeatureState_GetFeatureState_Returns {
  const featuresValue: Lib_FeatureState_GetFeatureState_FeaturesValue = settings['features'];

  if (isRecord(featuresValue) === false) {
    return undefined;
  }

  const rawState: Lib_FeatureState_GetFeatureState_RawState = featuresValue[featureKey];

  if (isRecord(rawState) === false) {
    return undefined;
  }

  return {
    configuration: rawState['configuration'] ?? {},
    enabled: rawState['enabled'] === true,
  };
}

/**
 * Feature State - Is Record.
 *
 * Narrows unknown settings values to plain objects.
 * Arrays and null values are excluded.
 *
 * @param {Lib_FeatureState_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_FeatureState_IsRecord_Returns}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_FeatureState_IsRecord_Value,
): value is Lib_FeatureState_IsRecord_Record {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}
