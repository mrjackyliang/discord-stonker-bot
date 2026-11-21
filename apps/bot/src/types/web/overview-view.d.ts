import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Service,
  Web_Api_ServiceComponent,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_BotStatus,
  Web_Components_OverviewView_Props,
  Web_Components_ServiceStatus,
} from '@/types/web/components.d.ts';

/**
 * Overview View.
 *
 * @since 4.2.1
 */
export type Web_OverviewView_OverviewView_Props = Web_Components_OverviewView_Props;
export type Web_OverviewView_OverviewView_Returns = ReactElement;
export type Web_OverviewView_OverviewView_Bot = Web_Components_OverviewView_Props['bot'];
export type Web_OverviewView_OverviewView_Can = Web_Components_OverviewView_Props['can'];
export type Web_OverviewView_OverviewView_OnBotAction = Web_Components_OverviewView_Props['onBotAction'];
export type Web_OverviewView_OverviewView_OnOpenConnection = Web_Components_OverviewView_Props['onOpenConnection'];
export type Web_OverviewView_OverviewView_OnOpenFeatures = Web_Components_OverviewView_Props['onOpenFeatures'];
export type Web_OverviewView_OverviewView_OnRefresh = Web_Components_OverviewView_Props['onRefresh'];
export type Web_OverviewView_OverviewView_Principal = Web_Components_OverviewView_Props['principal'];
export type Web_OverviewView_OverviewView_Server = Web_Components_OverviewView_Props['server'];
export type Web_OverviewView_OverviewView_Servers = Web_Components_OverviewView_Props['servers'];
export type Web_OverviewView_OverviewView_Busy = boolean;
export type Web_OverviewView_OverviewView_SetBusy = Dispatch<SetStateAction<Web_OverviewView_OverviewView_Busy>>;
export type Web_OverviewView_OverviewView_BusyState = [Web_OverviewView_OverviewView_Busy, Web_OverviewView_OverviewView_SetBusy];
export type Web_OverviewView_OverviewView_Error = string;
export type Web_OverviewView_OverviewView_SetError = Dispatch<SetStateAction<Web_OverviewView_OverviewView_Error>>;
export type Web_OverviewView_OverviewView_ErrorState = [Web_OverviewView_OverviewView_Error, Web_OverviewView_OverviewView_SetError];
export type Web_OverviewView_OverviewView_Copied = boolean;
export type Web_OverviewView_OverviewView_SetCopied = Dispatch<SetStateAction<Web_OverviewView_OverviewView_Copied>>;
export type Web_OverviewView_OverviewView_CopiedState = [Web_OverviewView_OverviewView_Copied, Web_OverviewView_OverviewView_SetCopied];
export type Web_OverviewView_OverviewView_Refresh_Returns = Promise<void>;
export type Web_OverviewView_OverviewView_Refresh = () => Web_OverviewView_OverviewView_Refresh_Returns;
export type Web_OverviewView_OverviewView_Status = Web_Components_BotStatus;
export type Web_OverviewView_OverviewView_Services = Web_Api_ServiceComponent[];
export type Web_OverviewView_OverviewView_EnabledFeaturesNoun = string;
export type Web_OverviewView_OverviewView_Service = Web_Api_Service | undefined;
export type Web_OverviewView_OverviewView_ServiceStatus = Web_Components_ServiceStatus;

/**
 * Overview View.
 *
 * @since 4.2.1
 */
export type Web_OverviewView_ServiceNames = Record<Web_Api_ServiceComponent, string>;

/**
 * Overview View.
 *
 * @since 4.2.1
 */
export type Web_OverviewView_ToneClasses = Record<Web_Components_BotStatus['tone'], string>;
