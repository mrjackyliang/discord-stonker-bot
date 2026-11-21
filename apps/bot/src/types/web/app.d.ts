import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Bot,
  Web_Api_BotAction,
  Web_Api_CreatedToken,
  Web_Api_Permission,
  Web_Api_Principal,
  Web_Api_RemovedSecret,
  Web_Api_Server,
  Web_Api_SetupStatus,
  Web_Api_Token,
} from '@/types/web/api.d.ts';
import type {
  Web_AppNavigation_PathMatch,
  Web_AppNavigation_Route,
} from '@/types/web/app-navigation.d.ts';
import type { Web_Components_View } from '@/types/web/components.d.ts';

/**
 * App.
 *
 * @since 4.2.1
 */
export type Web_App_App_Returns = ReactElement;
export type Web_App_App_InitialNavigation = Web_AppNavigation_PathMatch;
export type Web_App_App_Phase = Web_App_Phase;
export type Web_App_App_SetPhase = Dispatch<SetStateAction<Web_App_App_Phase>>;
export type Web_App_App_PhaseState = [Web_App_App_Phase, Web_App_App_SetPhase];
export type Web_App_App_Principal = Web_Api_Principal | null;
export type Web_App_App_SetPrincipal = Dispatch<SetStateAction<Web_App_App_Principal>>;
export type Web_App_App_PrincipalState = [Web_App_App_Principal, Web_App_App_SetPrincipal];
export type Web_App_App_ActiveRoute = Web_AppNavigation_Route;
export type Web_App_App_SetActiveRoute = Dispatch<SetStateAction<Web_App_App_ActiveRoute>>;
export type Web_App_App_ActiveRouteState = [Web_App_App_ActiveRoute, Web_App_App_SetActiveRoute];
export type Web_App_App_ActiveView = Web_Components_View;
export type Web_App_App_FeatureKey = string;
export type Web_App_App_SetFeatureKey = Dispatch<SetStateAction<Web_App_App_FeatureKey>>;
export type Web_App_App_FeatureKeyState = [Web_App_App_FeatureKey, Web_App_App_SetFeatureKey];
export type Web_App_App_Servers = Web_Api_Server[];
export type Web_App_App_SetServers = Dispatch<SetStateAction<Web_App_App_Servers>>;
export type Web_App_App_ServersState = [Web_App_App_Servers, Web_App_App_SetServers];
export type Web_App_App_ServerId = string;
export type Web_App_App_SetServerId = Dispatch<SetStateAction<Web_App_App_ServerId>>;
export type Web_App_App_ServerIdState = [Web_App_App_ServerId, Web_App_App_SetServerId];
export type Web_App_App_Bot = Web_Api_Bot | null;
export type Web_App_App_SetBot = Dispatch<SetStateAction<Web_App_App_Bot>>;
export type Web_App_App_BotState = [Web_App_App_Bot, Web_App_App_SetBot];
export type Web_App_App_Tokens = Web_Api_Token[];
export type Web_App_App_SetTokens = Dispatch<SetStateAction<Web_App_App_Tokens>>;
export type Web_App_App_TokensState = [Web_App_App_Tokens, Web_App_App_SetTokens];
export type Web_App_App_RemovedSecrets = Web_Api_RemovedSecret[];
export type Web_App_App_SetRemovedSecrets = Dispatch<SetStateAction<Web_App_App_RemovedSecrets>>;
export type Web_App_App_RemovedSecretsState = [Web_App_App_RemovedSecrets, Web_App_App_SetRemovedSecrets];
export type Web_App_App_StartupError = string;
export type Web_App_App_SetStartupError = Dispatch<SetStateAction<Web_App_App_StartupError>>;
export type Web_App_App_StartupErrorState = [Web_App_App_StartupError, Web_App_App_SetStartupError];
export type Web_App_App_FeatureDirty = boolean;
export type Web_App_App_SetFeatureDirty = Dispatch<SetStateAction<Web_App_App_FeatureDirty>>;
export type Web_App_App_FeatureDirtyState = [Web_App_App_FeatureDirty, Web_App_App_SetFeatureDirty];
export type Web_App_App_ResetSession_Returns = void;
export type Web_App_App_ResetSession = () => Web_App_App_ResetSession_Returns;
export type Web_App_App_Guard_Action = () => Promise<void>;
export type Web_App_App_Guard_Returns = Promise<void>;
export type Web_App_App_Guard = (action: Web_App_App_Guard_Action) => Web_App_App_Guard_Returns;
export type Web_App_App_LoadBot_Returns = Promise<void>;
export type Web_App_App_LoadBot = () => Web_App_App_LoadBot_Returns;
export type Web_App_App_LoadServers_Returns = Promise<void>;
export type Web_App_App_LoadServers = () => Web_App_App_LoadServers_Returns;
export type Web_App_App_LoadServers_NextServers = Web_Api_Server[];
export type Web_App_App_LoadServers_First = Web_Api_Server | undefined;
export type Web_App_App_LoadTokens_Returns = Promise<void>;
export type Web_App_App_LoadTokens = () => Web_App_App_LoadTokens_Returns;
export type Web_App_App_ApplyAppRoute_Route = Web_AppNavigation_Route;
export type Web_App_App_ApplyAppRoute_Returns = void;
export type Web_App_App_ApplyAppRoute = (route: Web_App_App_ApplyAppRoute_Route) => Web_App_App_ApplyAppRoute_Returns;
export type Web_App_App_OpenRoute_Route = Web_AppNavigation_Route;
export type Web_App_App_OpenRoute_Replace = boolean;
export type Web_App_App_OpenRoute_Returns = boolean;
export type Web_App_App_OpenRoute = (route: Web_App_App_OpenRoute_Route, replace?: Web_App_App_OpenRoute_Replace) => Web_App_App_OpenRoute_Returns;
export type Web_App_App_OpenView_View = Web_Components_View;
export type Web_App_App_OpenView_Returns = boolean;
export type Web_App_App_OpenView = (view: Web_App_App_OpenView_View) => Web_App_App_OpenView_Returns;
export type Web_App_App_LoadRemovedSecrets_Returns = Promise<void>;
export type Web_App_App_LoadRemovedSecrets = () => Web_App_App_LoadRemovedSecrets_Returns;
export type Web_App_App_LoadRemovedSecrets_NextPrincipal = Web_Api_Principal | null;
export type Web_App_App_EnterApplication_Returns = Promise<void>;
export type Web_App_App_EnterApplication = () => Web_App_App_EnterApplication_Returns;
export type Web_App_App_EnterApplication_NextPrincipal = Web_Api_Principal | null;
export type Web_App_App_Bootstrap_Returns = Promise<void>;
export type Web_App_App_Bootstrap = () => Web_App_App_Bootstrap_Returns;
export type Web_App_App_Bootstrap_SetupStatus = Web_Api_SetupStatus;
export type Web_App_App_BotTimer = number;
export type Web_App_App_ServerTimer = number;
export type Web_App_App_SignOut_Returns = Promise<void>;
export type Web_App_App_SignOut = () => Web_App_App_SignOut_Returns;
export type Web_App_App_SignOut_RootNavigation = Web_AppNavigation_PathMatch;
export type Web_App_App_Permissions = Web_Api_Permission[];
export type Web_App_App_Can_Permission = Web_Api_Permission;
export type Web_App_App_Can_Returns = boolean;
export type Web_App_App_Can = (permission: Web_App_App_Can_Permission) => Web_App_App_Can_Returns;
export type Web_App_App_Server = Web_Api_Server | undefined;
export type Web_App_App_Username = string;
export type Web_App_App_RunBotAction_Action = Web_Api_BotAction;
export type Web_App_App_RunBotAction_Returns = Promise<void>;
export type Web_App_App_RunBotAction = (action: Web_App_App_RunBotAction_Action) => Web_App_App_RunBotAction_Returns;
export type Web_App_App_OpenRemovedSecret_Action = Web_App_RemovedSecretAction;
export type Web_App_App_OpenRemovedSecret_Returns = void;
export type Web_App_App_OpenRemovedSecret = (action: Web_App_App_OpenRemovedSecret_Action) => Web_App_App_OpenRemovedSecret_Returns;
export type Web_App_App_NoServer = ReactElement;
export type Web_App_App_RenderView_Returns = ReactElement;
export type Web_App_App_RenderView = () => Web_App_App_RenderView_Returns;
export type Web_App_App_RenderView_NextToken = Web_Api_CreatedToken;
export type Web_App_App_AddServerUrl = string | null;
export type Web_App_App_ChangeServer_NextServerId = string;
export type Web_App_App_ChangeServer_Returns = void;
export type Web_App_App_ChangeServer = (nextServerId: Web_App_App_ChangeServer_NextServerId) => Web_App_App_ChangeServer_Returns;
export type Web_App_App_ChangeServer_FeaturesRoute = Web_AppNavigation_Route;
export type Web_App_App_LastRemovedSecret = Web_Api_RemovedSecret | undefined;
export type Web_App_App_RemovedAt = string;
export type Web_App_App_Notice = ReactElement | null;

/**
 * App.
 *
 * @since 4.2.1
 */
export type Web_App_DescribeRemovedSecret_RemovedSecret = Web_Api_RemovedSecret;
export type Web_App_DescribeRemovedSecret_Returns = Web_App_RemovedSecretAction;
export type Web_App_DescribeRemovedSecret_FeatureName = string;
export type Web_App_DescribeRemovedSecret_ServerName = string;

/**
 * App.
 *
 * @since 4.0.0
 */
export type Web_App_Phase = 'application' | 'claim' | 'loading' | 'login';

/**
 * App.
 *
 * @since 4.2.1
 */
export type Web_App_ReadStoredServer_Returns = string;

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

/**
 * App.
 *
 * @since 4.2.1
 */
export type Web_App_ServerStorageKey = string;

/**
 * App.
 *
 * @since 4.2.1
 */
export type Web_App_StoreServer_ServerId = string;
export type Web_App_StoreServer_Returns = void;
