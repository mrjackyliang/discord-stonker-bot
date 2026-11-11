import type { Web_Components_View } from '@/types/web/components.d.ts';

import type {
  Web_Navigation_Items,
  Web_Navigation_PathMatch,
} from '@/types/web/navigation.d.ts';

/**
 * App Navigation.
 *
 * @since 4.0.0
 */
export type Web_AppNavigation_Items = Web_Navigation_Items;

/**
 * App Navigation - Paths.
 *
 * @since UNRELEASED
 */
export type Web_AppNavigation_Paths = {
  accessTokens: string;
  account: string;
  backup: string;
  connection: string;
  feature: string;
  features: string;
  invite: string;
  logs: string;
  notifications: string;
  overview: string;
  root: string;
  users: string;
};

/**
 * App Navigation - Route.
 *
 * @since UNRELEASED
 */
export type Web_AppNavigation_Route = {
  featureKey?: string;
  path: string;
  view: Web_Components_View;
};

/**
 * App Navigation - Path match.
 *
 * @since UNRELEASED
 */
export type Web_AppNavigation_PathMatch = Web_Navigation_PathMatch<Web_AppNavigation_Route>;
