import type { ComponentType } from 'react';

import type { Web_Components_FeatureIcon_Props } from '@/types/web/components.d.ts';

/**
 * Feature Icons.
 *
 * @since 4.0.0
 */
export type Tests_Web_FeatureIcons_Module_FeatureIcon = ComponentType<Web_Components_FeatureIcon_Props>;
export type Tests_Web_FeatureIcons_Module = {
  FeatureIcon: Tests_Web_FeatureIcons_Module_FeatureIcon;
};
export type Tests_Web_FeatureIcons_Fallback = string;
export type Tests_Web_FeatureIcons_Drawn = Set<string>;
export type Tests_Web_FeatureIcons_Markup = string;
