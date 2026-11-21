import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_FeatureSummary,
  Web_Api_Server,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_FeatureFilter,
  Web_Components_FeatureFilterOption,
  Web_Components_FeaturesView_Props,
} from '@/types/web/components.d.ts';

/**
 * Features View.
 *
 * @since 4.2.1
 */
export type Web_FeaturesView_FeaturesView_Props = Web_Components_FeaturesView_Props;
export type Web_FeaturesView_FeaturesView_Returns = ReactElement;
export type Web_FeaturesView_FeaturesView_CanWrite = boolean;
export type Web_FeaturesView_FeaturesView_OnFeaturesChanged = () => void;
export type Web_FeaturesView_FeaturesView_OnOpenFeature = (featureKey: string) => void;
export type Web_FeaturesView_FeaturesView_Server = Web_Api_Server;
export type Web_FeaturesView_FeaturesView_FeaturesState = [Web_Api_FeatureSummary[] | null, Dispatch<SetStateAction<Web_Api_FeatureSummary[] | null>>];
export type Web_FeaturesView_FeaturesView_Features = Web_Api_FeatureSummary[] | null;
export type Web_FeaturesView_FeaturesView_SetFeatures = Dispatch<SetStateAction<Web_Api_FeatureSummary[] | null>>;
export type Web_FeaturesView_FeaturesView_FilterState = [Web_Components_FeatureFilter, Dispatch<SetStateAction<Web_Components_FeatureFilter>>];
export type Web_FeaturesView_FeaturesView_Filter = Web_Components_FeatureFilter;
export type Web_FeaturesView_FeaturesView_SetFilter = Dispatch<SetStateAction<Web_Components_FeatureFilter>>;
export type Web_FeaturesView_FeaturesView_SwitchingState = [string, Dispatch<SetStateAction<string>>];
export type Web_FeaturesView_FeaturesView_Switching = string;
export type Web_FeaturesView_FeaturesView_SetSwitching = Dispatch<SetStateAction<string>>;
export type Web_FeaturesView_FeaturesView_ErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_FeaturesView_FeaturesView_Error = string;
export type Web_FeaturesView_FeaturesView_SetError = Dispatch<SetStateAction<string>>;
export type Web_FeaturesView_FeaturesView_Load_Returns = Promise<void>;
export type Web_FeaturesView_FeaturesView_Load = () => Web_FeaturesView_FeaturesView_Load_Returns;
export type Web_FeaturesView_FeaturesView_Toggle_Feature = Web_Api_FeatureSummary;
export type Web_FeaturesView_FeaturesView_Toggle_Returns = Promise<void>;
export type Web_FeaturesView_FeaturesView_Toggle = (feature: Web_FeaturesView_FeaturesView_Toggle_Feature) => Web_FeaturesView_FeaturesView_Toggle_Returns;
export type Web_FeaturesView_FeaturesView_Toggle_Updated = Web_Api_FeatureSummary;
export type Web_FeaturesView_FeaturesView_Options = Web_Components_FeatureFilterOption[];
export type Web_FeaturesView_FeaturesView_CountFor_Option = Web_Components_FeatureFilter;
export type Web_FeaturesView_FeaturesView_CountFor_Returns = number;
export type Web_FeaturesView_FeaturesView_CountFor = (option: Web_FeaturesView_FeaturesView_CountFor_Option) => Web_FeaturesView_FeaturesView_CountFor_Returns;
export type Web_FeaturesView_FeaturesView_Visible = Web_Api_FeatureSummary[];
export type Web_FeaturesView_FeaturesView_EnabledCount = number;
export type Web_FeaturesView_FeaturesView_NextState = 'off' | 'on';
