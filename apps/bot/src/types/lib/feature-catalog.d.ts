import type {
  Shared_FeatureDefinition,
  Shared_FeatureKey,
} from '../shared.d.ts';

export type Lib_FeatureCatalog_FeatureCatalog = readonly Shared_FeatureDefinition[];

export type Lib_FeatureCatalog_GetFeatureCatalog_Returns = Lib_FeatureCatalog_FeatureCatalog;

export type Lib_FeatureCatalog_GetFeatureDefinition_FeatureDefinition = Shared_FeatureDefinition | undefined;
export type Lib_FeatureCatalog_GetFeatureDefinition_FeatureKey = Shared_FeatureKey;
export type Lib_FeatureCatalog_GetFeatureDefinition_Returns = Shared_FeatureDefinition;

export type Lib_FeatureCatalog_IsFeatureKey_FeatureDefinition = Shared_FeatureDefinition | undefined;
export type Lib_FeatureCatalog_IsFeatureKey_Returns = boolean;
export type Lib_FeatureCatalog_IsFeatureKey_Value = string;
