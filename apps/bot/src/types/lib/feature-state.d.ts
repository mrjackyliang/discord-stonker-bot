import type {
  Shared_FeatureDefinition,
  Shared_JsonObject,
} from '../shared.d.ts';

export type Lib_FeatureState_FeatureState_Configuration = unknown;
export type Lib_FeatureState_FeatureState_Enabled = boolean;
export type Lib_FeatureState_FeatureState = {
  configuration: Lib_FeatureState_FeatureState_Configuration;
  enabled: Lib_FeatureState_FeatureState_Enabled;
} | undefined;
export type Lib_FeatureState_GetFeatureState_Settings = Shared_JsonObject;
export type Lib_FeatureState_GetFeatureState_FeatureKey = Shared_FeatureDefinition['key'];
export type Lib_FeatureState_GetFeatureState_Returns = Lib_FeatureState_FeatureState;
export type Lib_FeatureState_GetFeatureState_FeaturesValue = unknown;
export type Lib_FeatureState_GetFeatureState_RawState = unknown;
export type Lib_FeatureState_IsRecord_Value = unknown;
export type Lib_FeatureState_IsRecord_Record = Record<string, unknown>;
export type Lib_FeatureState_IsRecord_Returns = boolean;
