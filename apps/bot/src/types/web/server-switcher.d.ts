import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type { Web_Api_Server } from '@/types/web/api.d.ts';

/**
 * Server Switcher.
 *
 * @since 4.2.1
 */
export type Web_ServerSwitcher_Initials_Name = string;
export type Web_ServerSwitcher_Initials_Returns = string;
export type Web_ServerSwitcher_Initials_Words = string[];
export type Web_ServerSwitcher_Initials_Letters = string;

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
export type Web_ServerSwitcher_ServerIcon_Returns = ReactElement;
export type Web_ServerSwitcher_ServerIcon_IconUrl = Web_ServerSwitcher_ServerIcon_Props['iconUrl'];
export type Web_ServerSwitcher_ServerIcon_Name = Web_ServerSwitcher_ServerIcon_Props['name'];
export type Web_ServerSwitcher_ServerIcon_Size = NonNullable<Web_ServerSwitcher_ServerIcon_Props['size']>;

/**
 * Server Switcher.
 *
 * @since 4.0.0
 */
export type Web_ServerSwitcher_ServerSwitcher_Props = {
  addServerUrl: string | null;
  onChange: (serverId: string) => void;
  onOpenConnection: () => void;
  serverId: string;
  servers: Web_Api_Server[];
};
export type Web_ServerSwitcher_ServerSwitcher_Returns = ReactElement;
export type Web_ServerSwitcher_ServerSwitcher_AddServerUrl = Web_ServerSwitcher_ServerSwitcher_Props['addServerUrl'];
export type Web_ServerSwitcher_ServerSwitcher_OnChange = Web_ServerSwitcher_ServerSwitcher_Props['onChange'];
export type Web_ServerSwitcher_ServerSwitcher_OnOpenConnection = Web_ServerSwitcher_ServerSwitcher_Props['onOpenConnection'];
export type Web_ServerSwitcher_ServerSwitcher_ServerId = Web_ServerSwitcher_ServerSwitcher_Props['serverId'];
export type Web_ServerSwitcher_ServerSwitcher_Servers = Web_ServerSwitcher_ServerSwitcher_Props['servers'];
export type Web_ServerSwitcher_ServerSwitcher_OpenState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_ServerSwitcher_ServerSwitcher_Open = boolean;
export type Web_ServerSwitcher_ServerSwitcher_SetOpen = Dispatch<SetStateAction<boolean>>;
export type Web_ServerSwitcher_ServerSwitcher_Current = Web_Api_Server | undefined;
