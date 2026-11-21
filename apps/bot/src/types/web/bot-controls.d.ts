import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type { Web_Api_BotAction } from '@/types/web/api.d.ts';
import type {
  Web_Components_BotControls_Props,
  Web_Components_NoServer_Props,
} from '@/types/web/components.d.ts';

/**
 * Bot Controls.
 *
 * @since 4.2.1
 */
export type Web_BotControls_BotControls_Props = Web_Components_BotControls_Props;
export type Web_BotControls_BotControls_Returns = ReactElement;
export type Web_BotControls_BotControls_Bot = Web_Components_BotControls_Props['bot'];
export type Web_BotControls_BotControls_OnBotAction = Web_Components_BotControls_Props['onBotAction'];
export type Web_BotControls_BotControls_OnError = Web_Components_BotControls_Props['onError'];
export type Web_BotControls_BotControls_Pending = Web_Api_BotAction | null;
export type Web_BotControls_BotControls_SetPending = Dispatch<SetStateAction<Web_BotControls_BotControls_Pending>>;
export type Web_BotControls_BotControls_PendingState = [Web_BotControls_BotControls_Pending, Web_BotControls_BotControls_SetPending];
export type Web_BotControls_BotControls_Run_Action = Web_Api_BotAction;
export type Web_BotControls_BotControls_Run_Returns = Promise<void>;
export type Web_BotControls_BotControls_Run = (action: Web_BotControls_BotControls_Run_Action) => Web_BotControls_BotControls_Run_Returns;

/**
 * Bot Controls.
 *
 * @since 4.2.1
 */
export type Web_BotControls_NoServer_Props = Web_Components_NoServer_Props;
export type Web_BotControls_NoServer_Returns = ReactElement;
export type Web_BotControls_NoServer_AddServerUrl = Web_Components_NoServer_Props['addServerUrl'];
export type Web_BotControls_NoServer_OnOpenConnection = Web_Components_NoServer_Props['onOpenConnection'];
