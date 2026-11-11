import type { Web_Api_Server } from '@/types/web/api.d.ts';

/**
 * Server Switcher - Server icon.
 *
 * @since 4.0.0
 */
export type Web_ServerSwitcher_ServerIcon_Props = {
  iconUrl: string | null;
  name: string;
  size?: 'large' | 'small';
};

/**
 * Server Switcher.
 *
 * @since 4.0.0
 */
export type Web_ServerSwitcher_Props = {
  addServerUrl: string | null;
  onChange: (serverId: string) => void;
  onOpenConnection: () => void;
  serverId: string;
  servers: Web_Api_Server[];
};
