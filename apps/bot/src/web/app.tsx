import {
  useEffect,
  useState,
} from 'react';

import { AccessView } from '@/web/access-view.tsx';
import {
  ApiError,
  createToken,
  dismissRemovedSecrets,
  getBot,
  getCurrentPrincipal,
  getServers,
  getSetupStatus,
  getTokens,
  logout,
  requestBotAction,
  revokeToken,
  updateToken,
} from '@/web/api.ts';
import { appConfig } from '@/web/app-config.ts';
import {
  appRouteForFeature,
  appRouteForInvite,
  appRouteForView,
  resolveAppNavigationPath,
} from '@/web/app-navigation.ts';
import { AppShell } from '@/web/app-shell.tsx';
import { AuthenticationScreen } from '@/web/auth-screen.tsx';
import { BackupView } from '@/web/backup-view.tsx';
import { NoServer } from '@/web/bot-controls.tsx';
import { ConnectionView } from '@/web/connection-view.tsx';
import { FeatureEditor } from '@/web/feature-editor.tsx';
import { FeaturesView } from '@/web/features-view.tsx';
import { InvitePageView } from '@/web/invite-page-view.tsx';
import { KeyNotice } from '@/web/key-notice.tsx';
import {
  describeBot,
  permissionsFor,
  roleLabels,
} from '@/web/labels.ts';
import { LogsView } from '@/web/logs-view.tsx';
import {
  applyNavigationPath,
  pushNavigationPath,
  replaceNavigationPath,
  startNavigationHistory,
} from '@/web/navigation.ts';
import { NotificationsView } from '@/web/notifications-view.tsx';
import { OverviewView } from '@/web/overview-view.tsx';
import { BrandMark } from '@/web/primitives.tsx';
import { SecurityView } from '@/web/security-view.tsx';
import { ServerSwitcher } from '@/web/server-switcher.tsx';
import { UsersView } from '@/web/users-view.tsx';

import type { Web_Api_Permission } from '@/types/web/api.d.ts';
import type {
  Web_App_App_ActiveRoute,
  Web_App_App_ActiveRouteState,
  Web_App_App_ActiveView,
  Web_App_App_AddServerUrl,
  Web_App_App_ApplyAppRoute,
  Web_App_App_ApplyAppRoute_Returns,
  Web_App_App_ApplyAppRoute_Route,
  Web_App_App_Bootstrap,
  Web_App_App_Bootstrap_Returns,
  Web_App_App_Bootstrap_SetupStatus,
  Web_App_App_Bot,
  Web_App_App_BotState,
  Web_App_App_BotTimer,
  Web_App_App_Can,
  Web_App_App_Can_Permission,
  Web_App_App_Can_Returns,
  Web_App_App_ChangeServer,
  Web_App_App_ChangeServer_FeaturesRoute,
  Web_App_App_ChangeServer_NextServerId,
  Web_App_App_ChangeServer_Returns,
  Web_App_App_EnterApplication,
  Web_App_App_EnterApplication_NextPrincipal,
  Web_App_App_EnterApplication_Returns,
  Web_App_App_FeatureDirty,
  Web_App_App_FeatureDirtyState,
  Web_App_App_FeatureKey,
  Web_App_App_FeatureKeyState,
  Web_App_App_Guard,
  Web_App_App_Guard_Action,
  Web_App_App_Guard_Returns,
  Web_App_App_InitialNavigation,
  Web_App_App_LastRemovedSecret,
  Web_App_App_LoadBot,
  Web_App_App_LoadBot_Returns,
  Web_App_App_LoadRemovedSecrets,
  Web_App_App_LoadRemovedSecrets_NextPrincipal,
  Web_App_App_LoadRemovedSecrets_Returns,
  Web_App_App_LoadServers,
  Web_App_App_LoadServers_First,
  Web_App_App_LoadServers_NextServers,
  Web_App_App_LoadServers_Returns,
  Web_App_App_LoadTokens,
  Web_App_App_LoadTokens_Returns,
  Web_App_App_NoServer,
  Web_App_App_Notice,
  Web_App_App_OpenRemovedSecret,
  Web_App_App_OpenRemovedSecret_Action,
  Web_App_App_OpenRemovedSecret_Returns,
  Web_App_App_OpenRoute,
  Web_App_App_OpenRoute_Replace,
  Web_App_App_OpenRoute_Returns,
  Web_App_App_OpenRoute_Route,
  Web_App_App_OpenView,
  Web_App_App_OpenView_Returns,
  Web_App_App_OpenView_View,
  Web_App_App_Permissions,
  Web_App_App_Phase,
  Web_App_App_PhaseState,
  Web_App_App_Principal,
  Web_App_App_PrincipalState,
  Web_App_App_RemovedAt,
  Web_App_App_RemovedSecrets,
  Web_App_App_RemovedSecretsState,
  Web_App_App_RenderView,
  Web_App_App_RenderView_NextToken,
  Web_App_App_RenderView_Returns,
  Web_App_App_ResetSession,
  Web_App_App_ResetSession_Returns,
  Web_App_App_Returns,
  Web_App_App_RunBotAction,
  Web_App_App_RunBotAction_Action,
  Web_App_App_RunBotAction_Returns,
  Web_App_App_Server,
  Web_App_App_ServerId,
  Web_App_App_ServerIdState,
  Web_App_App_Servers,
  Web_App_App_ServersState,
  Web_App_App_ServerTimer,
  Web_App_App_SetActiveRoute,
  Web_App_App_SetBot,
  Web_App_App_SetFeatureDirty,
  Web_App_App_SetFeatureKey,
  Web_App_App_SetPhase,
  Web_App_App_SetPrincipal,
  Web_App_App_SetRemovedSecrets,
  Web_App_App_SetServerId,
  Web_App_App_SetServers,
  Web_App_App_SetStartupError,
  Web_App_App_SetTokens,
  Web_App_App_SignOut,
  Web_App_App_SignOut_Returns,
  Web_App_App_SignOut_RootNavigation,
  Web_App_App_StartupError,
  Web_App_App_StartupErrorState,
  Web_App_App_Tokens,
  Web_App_App_TokensState,
  Web_App_App_Username,
  Web_App_DescribeRemovedSecret_FeatureName,
  Web_App_DescribeRemovedSecret_RemovedSecret,
  Web_App_DescribeRemovedSecret_Returns,
  Web_App_DescribeRemovedSecret_ServerName,
  Web_App_ReadStoredServer_Returns,
  Web_App_ServerStorageKey,
  Web_App_StoreServer_Returns,
  Web_App_StoreServer_ServerId,
} from '@/types/web/app.d.ts';

// The server picked last is remembered per browser, like the theme.

/**
 * App - Server Storage Key.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serverStorageKey: Web_App_ServerStorageKey = 'discord-stonker-bot-server';

/**
 * App - Read Stored Server.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_App_ReadStoredServer_Returns}
 *
 * @since 4.0.0
 */
const readStoredServer = (): Web_App_ReadStoredServer_Returns => {
  try {
    return window.localStorage.getItem(serverStorageKey) ?? '';
  } catch {
    return '';
  }
};

/**
 * App - Store Server.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_App_StoreServer_ServerId} serverId - Server id.
 *
 * @returns {Web_App_StoreServer_Returns}
 *
 * @since 4.0.0
 */
const storeServer = (serverId: Web_App_StoreServer_ServerId): Web_App_StoreServer_Returns => {
  try {
    window.localStorage.setItem(serverStorageKey, serverId);
  } catch {
    // Private windows may refuse storage; the choice then lasts for this visit only.
  }

  return;
};

// What each secret removed with a lost key asks for, and where it is entered again.

/**
 * App - Describe Removed Secret.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_App_DescribeRemovedSecret_RemovedSecret} removedSecret - Removed secret.
 *
 * @returns {Web_App_DescribeRemovedSecret_Returns}
 *
 * @since 4.0.0
 */
const describeRemovedSecret = (removedSecret: Web_App_DescribeRemovedSecret_RemovedSecret): Web_App_DescribeRemovedSecret_Returns => {
  if (removedSecret['kind'] === 'notification') {
    return {
      featureKey: '',
      label: `Set up the ${removedSecret['name'] ?? 'removed'} notification again`,
      serverId: '',
      view: 'notifications',
    };
  }

  if (removedSecret['kind'] === 'bot-token') {
    return {
      featureKey: '',
      label: 'Enter the Bot Token',
      serverId: '',
      view: 'connection',
    };
  }

  if (removedSecret['kind'] === 'feature-secrets') {
    const featureName: Web_App_DescribeRemovedSecret_FeatureName = removedSecret['featureName'] ?? 'feature';
    const serverName: Web_App_DescribeRemovedSecret_ServerName = removedSecret['serverName'] ?? 'this server';

    return {
      featureKey: removedSecret['featureKey'] ?? '',
      label: `Enter the ${featureName} secrets for ${serverName}`,
      serverId: removedSecret['serverId'] ?? '',
      view: 'feature',
    };
  }

  return {
    featureKey: '',
    label: 'Set up the authenticator app',
    serverId: '',
    view: 'security',
  };
};

/**
 * App - App.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_App_App_Returns}
 *
 * @since 4.0.0
 */
export const App = (): Web_App_App_Returns => {
  const initialNavigation: Web_App_App_InitialNavigation = resolveAppNavigationPath(window.location.pathname);
  const phaseState: Web_App_App_PhaseState = useState<Web_App_App_Phase>('loading');
  const phase: Web_App_App_Phase = phaseState[0];
  const setPhase: Web_App_App_SetPhase = phaseState[1];
  const principalState: Web_App_App_PrincipalState = useState<Web_App_App_Principal>(null);
  const principal: Web_App_App_Principal = principalState[0];
  const setPrincipal: Web_App_App_SetPrincipal = principalState[1];
  const activeRouteState: Web_App_App_ActiveRouteState = useState<Web_App_App_ActiveRoute>(initialNavigation['route']);
  const activeRoute: Web_App_App_ActiveRoute = activeRouteState[0];
  const setActiveRoute: Web_App_App_SetActiveRoute = activeRouteState[1];
  const activeView: Web_App_App_ActiveView = activeRoute['view'];
  const featureKeyState: Web_App_App_FeatureKeyState = useState<Web_App_App_FeatureKey>(initialNavigation['route']['featureKey'] ?? '');
  const featureKey: Web_App_App_FeatureKey = featureKeyState[0];
  const setFeatureKey: Web_App_App_SetFeatureKey = featureKeyState[1];
  const serversState: Web_App_App_ServersState = useState<Web_App_App_Servers>([]);
  const servers: Web_App_App_Servers = serversState[0];
  const setServers: Web_App_App_SetServers = serversState[1];
  const serverIdState: Web_App_App_ServerIdState = useState<Web_App_App_ServerId>(readStoredServer);
  const serverId: Web_App_App_ServerId = serverIdState[0];
  const setServerId: Web_App_App_SetServerId = serverIdState[1];
  const botState: Web_App_App_BotState = useState<Web_App_App_Bot>(null);
  const bot: Web_App_App_Bot = botState[0];
  const setBot: Web_App_App_SetBot = botState[1];
  const tokensState: Web_App_App_TokensState = useState<Web_App_App_Tokens>([]);
  const tokens: Web_App_App_Tokens = tokensState[0];
  const setTokens: Web_App_App_SetTokens = tokensState[1];
  const removedSecretsState: Web_App_App_RemovedSecretsState = useState<Web_App_App_RemovedSecrets>([]);
  const removedSecrets: Web_App_App_RemovedSecrets = removedSecretsState[0];
  const setRemovedSecrets: Web_App_App_SetRemovedSecrets = removedSecretsState[1];
  const startupErrorState: Web_App_App_StartupErrorState = useState<Web_App_App_StartupError>('');
  const startupError: Web_App_App_StartupError = startupErrorState[0];
  const setStartupError: Web_App_App_SetStartupError = startupErrorState[1];
  const featureDirtyState: Web_App_App_FeatureDirtyState = useState<Web_App_App_FeatureDirty>(false);
  const featureDirty: Web_App_App_FeatureDirty = featureDirtyState[0];
  const setFeatureDirty: Web_App_App_SetFeatureDirty = featureDirtyState[1];

  /**
   * App - Reset Session.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_ResetSession_Returns}
   *
   * @since 4.0.0
   */
  const resetSession: Web_App_App_ResetSession = (): Web_App_App_ResetSession_Returns => {
    setPrincipal(null);
    setServers([]);
    setBot(null);
    setTokens([]);
    setRemovedSecrets([]);
    setFeatureDirty(false);
    setPhase('login');

    return;
  };

  // A request that finds the session gone sends the browser back to sign-in.

  /**
   * App - Guard.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_Guard_Action} action - Action.
   *
   * @returns {Web_App_App_Guard_Returns}
   *
   * @since 4.0.0
   */
  const guard: Web_App_App_Guard = async (action: Web_App_App_Guard_Action): Web_App_App_Guard_Returns => {
    try {
      await action();
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        resetSession();

        return;
      }

      throw caughtError;
    }

    return;
  };

  /**
   * App - Load Bot.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadBot_Returns}
   *
   * @since 4.0.0
   */
  const loadBot: Web_App_App_LoadBot = async (): Web_App_App_LoadBot_Returns => guard(async () => {
    setBot(await getBot());

    return;
  });

  /**
   * App - Load Servers.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadServers_Returns}
   *
   * @since 4.0.0
   */
  const loadServers: Web_App_App_LoadServers = async (): Web_App_App_LoadServers_Returns => guard(async () => {
    const nextServers: Web_App_App_LoadServers_NextServers = await getServers();

    setServers(nextServers);
    setServerId((current) => {
      if (nextServers.some((server) => server['id'] === current) === true) {
        return current;
      }

      const first: Web_App_App_LoadServers_First = nextServers.find((server) => server['available']) ?? nextServers[0];

      return (first === undefined) ? '' : first['id'];
    });

    return;
  });

  /**
   * App - Load Tokens.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadTokens_Returns}
   *
   * @since 4.0.0
   */
  const loadTokens: Web_App_App_LoadTokens = async (): Web_App_App_LoadTokens_Returns => guard(async () => {
    setTokens(await getTokens());

    return;
  });

  /**
   * App - Apply App Route.
   *
   * Keeps the rendered page and feature editor synchronized with a resolved
   * address. Browser Back and Forward reuse this transition without pushing.
   *
   * @param {Web_App_App_ApplyAppRoute_Route} route - Route.
   *
   * @returns {Web_App_App_ApplyAppRoute_Returns}
   *
   * @since 4.0.0
   */
  const applyAppRoute: Web_App_App_ApplyAppRoute = (route: Web_App_App_ApplyAppRoute_Route): Web_App_App_ApplyAppRoute_Returns => {
    setFeatureDirty(false);
    setFeatureKey(route['featureKey'] ?? '');
    setActiveRoute(route);

    window.scrollTo(0, 0);

    return;
  };

  /**
   * App - Open Route.
   *
   * Preserves the unsaved-feature guard, updates browser history, and then
   * applies the matching page state. Incidental page resets use replacement.
   *
   * @param {Web_App_App_OpenRoute_Route}   route     - Route.
   * @param {Web_App_App_OpenRoute_Replace} [replace] - Replace.
   *
   * @returns {Web_App_App_OpenRoute_Returns}
   *
   * @since 4.0.0
   */
  const openRoute: Web_App_App_OpenRoute = (
    route: Web_App_App_OpenRoute_Route,
    replace: Web_App_App_OpenRoute_Replace = false,
  ): Web_App_App_OpenRoute_Returns => {
    if (route['path'] === activeRoute['path']) {
      return true;
    }

    if (
      activeView === 'feature'
      && featureDirty === true
      && window.confirm('Discard your unsaved changes?') === false
    ) {
      return false;
    }

    if (replace === true) {
      replaceNavigationPath(window, route['path']);
    } else {
      pushNavigationPath(window, route['path']);
    }
    applyAppRoute(route);

    if (route['view'] === 'overview' || route['view'] === 'connection') {
      void loadBot().catch(() => undefined);
    }

    if (route['view'] === 'overview') {
      void loadServers().catch(() => undefined);
    }

    if (route['view'] === 'access') {
      void loadTokens().catch(() => undefined);
    }

    return true;
  };

  /**
   * App - Open View.
   *
   * Resolves shell destinations through the app-owned path table before the
   * shared History API transition runs.
   *
   * @param {Web_App_App_OpenView_View} view - View.
   *
   * @returns {Web_App_App_OpenView_Returns}
   *
   * @since 4.0.0
   */
  const openView: Web_App_App_OpenView = (view: Web_App_App_OpenView_View): Web_App_App_OpenView_Returns => openRoute(appRouteForView(view));

  // The notice shrinks as secrets are entered again, so the list is read again after each one.

  /**
   * App - Load Removed Secrets.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_LoadRemovedSecrets_Returns}
   *
   * @since 4.0.0
   */
  const loadRemovedSecrets: Web_App_App_LoadRemovedSecrets = async (): Web_App_App_LoadRemovedSecrets_Returns => guard(async () => {
    const nextPrincipal: Web_App_App_LoadRemovedSecrets_NextPrincipal = await getCurrentPrincipal();
    if (nextPrincipal === null) {
      resetSession();

      return;
    }

    setRemovedSecrets(nextPrincipal['removedSecrets'] ?? []);

    return;
  });

  /**
   * App - Enter Application.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_EnterApplication_Returns}
   *
   * @since 4.0.0
   */
  const enterApplication: Web_App_App_EnterApplication = async (): Web_App_App_EnterApplication_Returns => {
    const nextPrincipal: Web_App_App_EnterApplication_NextPrincipal = await getCurrentPrincipal();
    if (nextPrincipal === null || nextPrincipal['authenticationType'] !== 'session') {
      setPhase('login');

      return;
    }

    setPrincipal(nextPrincipal);
    setRemovedSecrets(nextPrincipal['removedSecrets'] ?? []);
    applyNavigationPath(window, resolveAppNavigationPath, applyAppRoute);
    setPhase('application');

    await Promise.all([
      loadBot(),
      loadServers(),
      loadTokens(),
    ]);

    return;
  };

  useEffect(() => startNavigationHistory(
    window,
    resolveAppNavigationPath,
    applyAppRoute,
  ), []);

  useEffect(() => {
    /**
     * App - Bootstrap.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @returns {Web_App_App_Bootstrap_Returns}
     *
     * @since 4.0.0
     */
    const bootstrap: Web_App_App_Bootstrap = async (): Web_App_App_Bootstrap_Returns => {
      setStartupError('');
      try {
        const setupStatus: Web_App_App_Bootstrap_SetupStatus = await getSetupStatus();
        if (setupStatus['claimRequired'] === true) {
          setPhase('claim');

          return;
        }

        await enterApplication();
      } catch (caughtError) {
        setStartupError((caughtError instanceof Error) ? caughtError.message : 'The control panel could not be loaded.');
      }

      return;
    };

    void bootstrap();

    return;
  }, []);

  // The bot's status shows in the sidebar on every page, so it refreshes in the background.
  useEffect(() => {
    if (phase !== 'application') {
      return undefined;
    }

    const botTimer: Web_App_App_BotTimer = window.setInterval(() => {
      void loadBot().catch(() => undefined);

      return;
    }, 15_000);
    const serverTimer: Web_App_App_ServerTimer = window.setInterval(() => {
      void loadServers().catch(() => undefined);

      return;
    }, 60_000);

    return () => {
      window.clearInterval(botTimer);
      window.clearInterval(serverTimer);

      return;
    };
  }, [phase]);

  useEffect(() => {
    if (serverId !== '') {
      storeServer(serverId);
    }

    return;
  }, [serverId]);

  /**
   * App - Sign Out.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_SignOut_Returns}
   *
   * @since 4.0.0
   */
  const signOut: Web_App_App_SignOut = async (): Web_App_App_SignOut_Returns => {
    try {
      await logout();
    } finally {
      const rootNavigation: Web_App_App_SignOut_RootNavigation = resolveAppNavigationPath('/');

      replaceNavigationPath(window, rootNavigation['path']);
      applyAppRoute(rootNavigation['route']);
      resetSession();
    }

    return;
  };

  if (phase === 'loading') {
    return (
      <main className="startup-screen">
        <BrandMark />
        <span className="spinner" />
        <strong>{`Opening ${appConfig['appName']}`}</strong>
        {(startupError === '') ? null : <p role="alert">{startupError}</p>}
      </main>
    );
  }

  if (
    phase === 'claim'
    || phase === 'login'
    || principal === null
  ) {
    return <AuthenticationScreen mode={(phase === 'claim') ? 'claim' : 'login'} onSignedIn={enterApplication} />;
  }

  const permissions: Web_App_App_Permissions = permissionsFor(principal);

  /**
   * App - Can.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_Can_Permission} permission - Permission.
   *
   * @returns {Web_App_App_Can_Returns}
   *
   * @since 4.0.0
   */
  const can: Web_App_App_Can = (permission: Web_App_App_Can_Permission): Web_App_App_Can_Returns => permissions.includes(permission);
  const server: Web_App_App_Server = servers.find((candidate) => candidate['id'] === serverId);
  const username: Web_App_App_Username = principal['username'] ?? 'Signed in';

  /**
   * App - Run Bot Action.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_RunBotAction_Action} action - Action.
   *
   * @returns {Web_App_App_RunBotAction_Returns}
   *
   * @since 4.0.0
   */
  const runBotAction: Web_App_App_RunBotAction = async (action: Web_App_App_RunBotAction_Action): Web_App_App_RunBotAction_Returns => guard(async () => {
    await requestBotAction(action);
    await loadBot();

    // The bot process picks the change up within a few seconds; check again so the status catches up.
    window.setTimeout(() => {
      void loadBot().catch(() => undefined);

      return;
    }, 3_000);

    return;
  });

  /**
   * App - Open Removed Secret.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_App_App_OpenRemovedSecret_Action} action - Action.
   *
   * @returns {Web_App_App_OpenRemovedSecret_Returns}
   *
   * @since 4.0.0
   */
  const openRemovedSecret: Web_App_App_OpenRemovedSecret = (action: Web_App_App_OpenRemovedSecret_Action): Web_App_App_OpenRemovedSecret_Returns => {
    if (action['view'] === 'feature') {
      if (openRoute(appRouteForFeature(action['featureKey'])) === false) {
        return;
      }

      setServerId(action['serverId']);

      return;
    }

    openView(action['view']);

    return;
  };

  const noServer: Web_App_App_NoServer = (
    <NoServer
      addServerUrl={(bot === null) ? null : bot['addServerUrl']}
      onOpenConnection={() => {
        openView('connection');

        return;
      }}
    />
  );

  /**
   * App - Render View.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_App_App_RenderView_Returns}
   *
   * @since 4.0.0
   */
  const renderView: Web_App_App_RenderView = (): Web_App_App_RenderView_Returns => {
    switch (activeView) {
      case 'access': {
        return (
          <AccessView
            onCreateToken={async (input) => {
              const nextToken: Web_App_App_RenderView_NextToken = await createToken(input);

              await loadTokens();

              return nextToken;
            }}
            onRevokeToken={async (tokenId) => {
              await revokeToken(tokenId);
              await loadTokens();

              return;
            }}
            onUpdateToken={async (tokenId, input) => {
              await updateToken(tokenId, input);
              await loadTokens();

              return;
            }}
            role={principal['role']}
            tokens={tokens}
          />
        );
      }

      case 'connection': {
        return (
          <ConnectionView
            bot={bot}
            can={can}
            onBotAction={runBotAction}
            onTokenSaved={async () => {
              await Promise.all([
                loadBot(),
                loadRemovedSecrets(),
              ]);

              return;
            }}
          />
        );
      }

      case 'feature': {
        if (server === undefined || featureKey === '') {
          return noServer;
        }

        return (
          <FeatureEditor
            canWrite={can('configuration:write')}
            featureKey={featureKey}
            key={`${server['id']}:${featureKey}`}
            onBack={() => {
              openView('features');

              return;
            }}
            onDirtyChange={setFeatureDirty}
            onFeaturesChanged={() => {
              void loadServers().catch(() => undefined);
              void loadRemovedSecrets().catch(() => undefined);

              return;
            }}
            server={server}
          />
        );
      }

      case 'features': {
        if (server === undefined) {
          return noServer;
        }

        return (
          <FeaturesView
            canWrite={can('configuration:write')}
            onFeaturesChanged={() => {
              void loadServers().catch(() => undefined);

              return;
            }}
            onOpenFeature={(nextFeatureKey) => {
              if (nextFeatureKey === 'web-applications') {
                openRoute(appRouteForInvite());

                return;
              }

              openRoute(appRouteForFeature(nextFeatureKey));

              return;
            }}
            server={server}
          />
        );
      }

      case 'backup': {
        if (can('users:manage') === true) {
          return (
            <BackupView
              onImported={async () => {
                await Promise.all([
                  loadServers(),
                  loadBot(),
                  loadRemovedSecrets(),
                  loadTokens(),
                ]);

                return;
              }}
              server={server}
            />
          );
        }

        break;
      }

      case 'invite': {
        if (server === undefined) {
          return noServer;
        }

        return (
          <InvitePageView
            canWrite={can('configuration:write')}
            onOpenFeature={(nextFeatureKey) => {
              openRoute(appRouteForFeature(nextFeatureKey));

              return;
            }}
            server={server}
          />
        );
      }

      case 'logs': {
        return <LogsView canChangeDebugLogging={can('bot:control')} />;
      }

      case 'notifications': {
        if (can('configuration:write') === true) {
          return (
            <NotificationsView
              interpreter="discord-stonker-bot"
              onChange={() => {
                void loadRemovedSecrets().catch(() => undefined);

                return;
              }}
            />
          );
        }

        break;
      }

      case 'security': {
        return (
          <SecurityView
            onAuthenticatorEnabled={() => {
              void loadRemovedSecrets().catch(() => undefined);

              return;
            }}
            onUsernameChanged={(nextUsername) => setPrincipal({
              ...principal,
              username: nextUsername,
            })}
          />
        );
      }

      case 'users': {
        if (can('users:manage') === true) {
          return <UsersView principal={principal} servers={servers} />;
        }

        break;
      }

      default: {
        break;
      }
    }

    return (
      <OverviewView
        bot={bot}
        can={can}
        onBotAction={runBotAction}
        onOpenConnection={() => {
          openView('connection');

          return;
        }}
        onOpenFeatures={() => {
          openView('features');

          return;
        }}
        onRefresh={async () => {
          await Promise.all([
            loadBot(),
            loadServers(),
          ]);

          return;
        }}
        principal={principal}
        server={server}
        servers={servers}
      />
    );
  };

  const addServerUrl: Web_App_App_AddServerUrl = (bot === null) ? null : bot['addServerUrl'];

  /**
   * App - Change Server.
   *
   * Keeps the current server selection synchronized across the desktop and
   * phone switchers without discarding an unfinished feature form silently.
   *
   * @param {Web_App_App_ChangeServer_NextServerId} nextServerId - Next server id.
   *
   * @returns {Web_App_App_ChangeServer_Returns}
   *
   * @since 4.0.0
   */
  const changeServer: Web_App_App_ChangeServer = (nextServerId: Web_App_App_ChangeServer_NextServerId): Web_App_App_ChangeServer_Returns => {
    if (
      activeView === 'feature'
      && featureDirty === true
      && window.confirm('Discard your unsaved changes?') === false
    ) {
      return;
    }

    setFeatureDirty(false);
    setServerId(nextServerId);

    if (activeView === 'feature') {
      const featuresRoute: Web_App_App_ChangeServer_FeaturesRoute = appRouteForView('features');

      replaceNavigationPath(window, featuresRoute['path']);
      applyAppRoute(featuresRoute);
    }

    return;
  };

  const lastRemovedSecret: Web_App_App_LastRemovedSecret = removedSecrets.at(-1);
  const removedAt: Web_App_App_RemovedAt = (lastRemovedSecret !== undefined) ? lastRemovedSecret['removedAt'] : '';
  const notice: Web_App_App_Notice = (removedSecrets.length === 0) ? null : (
    <KeyNotice
      appName={appConfig['appName']}
      items={removedSecrets.map((removedSecret) => ({
        id: `${removedSecret['kind']}:${removedSecret['serverId'] ?? ''}:${removedSecret['featureKey'] ?? ''}:${removedSecret['notificationId'] ?? ''}`,
        label: describeRemovedSecret(removedSecret)['label'],
        onOpen: () => openRemovedSecret(describeRemovedSecret(removedSecret)),
      }))}
      keyName="installation key"
      onDismiss={async () => {
        await dismissRemovedSecrets();
        setRemovedSecrets([]);

        return;
      }}
      removedAt={removedAt}
    />
  );

  return (
    <AppShell
      accountDetail={(principal['role'] === undefined) ? undefined : roleLabels[principal['role']]}
      activeView={activeView}
      canOpen={(permission) => can(permission as Web_Api_Permission)}
      notice={notice}
      onLogout={() => {
        void signOut();

        return;
      }}
      onViewChange={(view) => {
        openView(view);

        return;
      }}
      phonePageTop={(
        <div className="mobile-server-bar">
          <ServerSwitcher
            addServerUrl={addServerUrl}
            onChange={changeServer}
            onOpenConnection={() => {
              openView('connection');

              return;
            }}
            serverId={serverId}
            servers={servers}
          />
        </div>
      )}
      sidebarTop={(
        <ServerSwitcher
          addServerUrl={addServerUrl}
          onChange={changeServer}
          onOpenConnection={() => {
            openView('connection');

            return;
          }}
          serverId={serverId}
          servers={servers}
        />
      )}
      status={{
        ...describeBot(bot),
        onOpen: () => {
          openView('connection');

          return;
        },
      }}
      username={username}
    >
      {renderView()}
    </AppShell>
  );
};
