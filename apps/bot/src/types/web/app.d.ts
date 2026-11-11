import type { Web_Components_View } from '@/types/web/components.d.ts';

/**
 * App.
 *
 * @since 4.0.0
 */
export type Web_App_Phase = 'application' | 'claim' | 'loading' | 'login';

/**
 * App.
 *
 * @since 4.0.0
 */
export type Web_App_RemovedSecretAction = {
  featureKey: string;
  label: string;
  serverId: string;
  view: Web_Components_View;
};
