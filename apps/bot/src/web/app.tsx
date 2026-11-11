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

import type { ReactElement } from 'react';

import type {
  Web_Api_Bot,
  Web_Api_BotAction,
  Web_Api_CreatedToken,
  Web_Api_CreateTokenInput,
  Web_Api_Permission,
  Web_Api_Principal,
  Web_Api_RemovedSecret,
  Web_Api_Server,
  Web_Api_Token,
  Web_Api_UpdateTokenInput,
} from '@/types/web/api.d.ts';
import type {
  Web_AppNavigation_PathMatch,
  Web_AppNavigation_Route,
} from '@/types/web/app-navigation.d.ts';
import type {
  Web_App_Phase,
  Web_App_RemovedSecretAction,
} from '@/types/web/app.d.ts';
import type { Web_Components_View } from '@/types/web/components.d.ts';

// The server picked last is remembered per browser, like the theme.

/**
 * App - Server storage key.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serverStorageKey: string = 'discord-stonker-bot-server';

/**
 * App - Reads stored server.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readStoredServer = (): string => {
  try {
    return window.localStorage.getItem(serverStorageKey) ?? '';
  } catch {
    return '';
  }
};

/**
 * App - Store server.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const storeServer = (serverId: string): void => {
  try {
    window.localStorage.setItem(serverStorageKey, serverId);
  } catch {
    // Private windows may refuse storage; the choice then lasts for this visit only.
  }
};

// What each secret removed with a lost key asks for, and where it is entered again.

/**
 * App - Describe removed secret.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const describeRemovedSecret = (removedSecret: Web_Api_RemovedSecret): Web_App_RemovedSecretAction => {
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
    const featureName: string = removedSecret['featureName'] ?? 'feature';
    const serverName: string = removedSecret['serverName'] ?? 'this server';

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
 * App.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const App = (): ReactElement => {
  const initialNavigation: Web_AppNavigation_PathMatch = resolveAppNavigationPath(window.location.pathname);
  const [
    phase,
    setPhase,
  ] = useState<Web_App_Phase>('loading');
  const [
    principal,
    setPrincipal,
  ] = useState<Web_Api_Principal | null>(null);
  const [
    activeRoute,
    setActiveRoute,
  ] = useState<Web_AppNavigation_Route>(initialNavigation['route']);
  const activeView: Web_Components_View = activeRoute['view'];
  const [
    featureKey,
    setFeatureKey,
  ] = useState<string>(initialNavigation['route']['featureKey'] ?? '');
  const [
    servers,
    setServers,
  ] = useState<Web_Api_Server[]>([]);
  const [
    serverId,
    setServerId,
  ] = useState<string>(readStoredServer);
  const [
    bot,
    setBot,
  ] = useState<Web_Api_Bot | null>(null);
  const [
    tokens,
    setTokens,
  ] = useState<Web_Api_Token[]>([]);
  const [
    removedSecrets,
    setRemovedSecrets,
  ] = useState<Web_Api_RemovedSecret[]>([]);
  const [
    startupError,
    setStartupError,
  ] = useState<string>('');
  const [
    featureDirty,
    setFeatureDirty,
  ] = useState<boolean>(false);

  /**
   * App - Reset session.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const resetSession = (): void => {
    setPrincipal(null);
    setServers([]);
    setBot(null);
    setTokens([]);
    setRemovedSecrets([]);
    setFeatureDirty(false);
    setPhase('login');
  };

  // A request that finds the session gone sends the browser back to sign-in.

  /**
   * App - Guard.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const guard = async (action: () => Promise<void>): Promise<void> => {
    try {
      await action();
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.status === 401) {
        resetSession();

        return;
      }

      throw caughtError;
    }
  };

  /**
   * App - Loads bot.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const loadBot = async (): Promise<void> => guard(async (): Promise<void> => {
    setBot(await getBot());
  });

  /**
   * App - Loads servers.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const loadServers = async (): Promise<void> => guard(async (): Promise<void> => {
    const nextServers: Web_Api_Server[] = await getServers();

    setServers(nextServers);
    setServerId((current: string): string => {
      if (nextServers.some((server: Web_Api_Server): boolean => server['id'] === current)) {
        return current;
      }

      const first: Web_Api_Server | undefined = nextServers.find((server: Web_Api_Server): boolean => server['available']) ?? nextServers[0];

      return (first === undefined) ? '' : first['id'];
    });
  });

  /**
   * App - Loads tokens.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const loadTokens = async (): Promise<void> => guard(async (): Promise<void> => {
    setTokens(await getTokens());
  });

  /**
   * App - Applies route.
   *
   * Keeps the rendered page and feature editor synchronized with a resolved
   * address. Browser Back and Forward reuse this transition without pushing.
   *
   * @param {Web_AppNavigation_Route} route - Route.
   *
   * @since UNRELEASED
   */
  const applyAppRoute = (route: Web_AppNavigation_Route): void => {
    setFeatureDirty(false);
    setFeatureKey(route['featureKey'] ?? '');
    setActiveRoute(route);
    window.scrollTo(0, 0);

    return;
  };

  /**
   * App - Opens route.
   *
   * Preserves the unsaved-feature guard, updates browser history, and then
   * applies the matching page state. Incidental page resets use replacement.
   *
   * @param {Web_AppNavigation_Route} route     - Route.
   * @param {boolean}                 [replace] - Replace.
   *
   * @returns {boolean}
   *
   * @since UNRELEASED
   */
  const openRoute = (
    route: Web_AppNavigation_Route,
    replace: boolean = false,
  ): boolean => {
    if (route['path'] === activeRoute['path']) {
      return true;
    }

    if (activeView === 'feature' && featureDirty && !window.confirm('Discard your unsaved changes?')) {
      return false;
    }

    if (replace) {
      replaceNavigationPath(window, route['path']);
    } else {
      pushNavigationPath(window, route['path']);
    }
    applyAppRoute(route);

    if (route['view'] === 'overview' || route['view'] === 'connection') {
      void loadBot().catch((): undefined => undefined);
    }

    if (route['view'] === 'overview') {
      void loadServers().catch((): undefined => undefined);
    }

    if (route['view'] === 'access') {
      void loadTokens().catch((): undefined => undefined);
    }

    return true;
  };

  /**
   * App - Opens view.
   *
   * Resolves shell destinations through the app-owned path table before the
   * shared History API transition runs.
   *
   * @param {Web_Components_View} view - View.
   *
   * @returns {boolean}
   *
   * @since UNRELEASED
   */
  const openView = (view: Web_Components_View): boolean => openRoute(appRouteForView(view));

  // The notice shrinks as secrets are entered again, so the list is read again after each one.

  /**
   * App - Loads removed secrets.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const loadRemovedSecrets = async (): Promise<void> => guard(async (): Promise<void> => {
    const nextPrincipal: Web_Api_Principal | null = await getCurrentPrincipal();
    if (nextPrincipal === null) {
      resetSession();

      return;
    }

    setRemovedSecrets(nextPrincipal['removedSecrets'] ?? []);
  });

  /**
   * App - Enter application.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const enterApplication = async (): Promise<void> => {
    const nextPrincipal: Web_Api_Principal | null = await getCurrentPrincipal();
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
  };

  useEffect((): (() => void) => startNavigationHistory(
    window,
    resolveAppNavigationPath,
    applyAppRoute,
  ), []);

  useEffect((): void => {
    /**
     * App - Bootstrap.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 4.0.0
     */
    const bootstrap = async (): Promise<void> => {
      setStartupError('');
      try {
        const setupStatus = await getSetupStatus();
        if (setupStatus['claimRequired']) {
          setPhase('claim');

          return;
        }

        await enterApplication();
      } catch (caughtError) {
        setStartupError((caughtError instanceof Error) ? caughtError.message : 'The control panel could not be loaded.');
      }
    };

    void bootstrap();
  }, []);

  // The bot's status shows in the sidebar on every page, so it refreshes in the background.
  useEffect((): (() => void) | undefined => {
    if (phase !== 'application') {
      return undefined;
    }

    const botTimer: number = window.setInterval((): void => {
      void loadBot().catch((): undefined => undefined);
    }, 15_000);
    const serverTimer: number = window.setInterval((): void => {
      void loadServers().catch((): undefined => undefined);
    }, 60_000);

    return (): void => {
      window.clearInterval(botTimer);
      window.clearInterval(serverTimer);
    };
  }, [phase]);

  useEffect((): void => {
    if (serverId !== '') {
      storeServer(serverId);
    }
  }, [serverId]);

  /**
   * App - Sign out.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const signOut = async (): Promise<void> => {
    try {
      await logout();
    } finally {
      const rootNavigation: Web_AppNavigation_PathMatch = resolveAppNavigationPath('/');

      replaceNavigationPath(window, rootNavigation['path']);
      applyAppRoute(rootNavigation['route']);
      resetSession();
    }
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

  if (phase === 'claim' || phase === 'login' || principal === null) {
    return <AuthenticationScreen mode={(phase === 'claim') ? 'claim' : 'login'} onSignedIn={enterApplication} />;
  }

  const permissions: Web_Api_Permission[] = permissionsFor(principal);

  /**
   * App - Can.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const can = (permission: Web_Api_Permission): boolean => permissions.includes(permission);
  const server: Web_Api_Server | undefined = servers.find((candidate: Web_Api_Server): boolean => candidate['id'] === serverId);
  const username: string = principal['username'] ?? 'Signed in';

  /**
   * App - Run bot action.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const runBotAction = async (action: Web_Api_BotAction): Promise<void> => guard(async (): Promise<void> => {
    await requestBotAction(action);
    await loadBot();

    // The bot process picks the change up within a few seconds; check again so the status catches up.
    window.setTimeout((): void => {
      void loadBot().catch((): undefined => undefined);
    }, 3_000);
  });

  /**
   * App - Opens removed secret.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const openRemovedSecret = (action: Web_App_RemovedSecretAction): void => {
    if (action['view'] === 'feature') {
      if (!openRoute(appRouteForFeature(action['featureKey']))) {
        return;
      }

      setServerId(action['serverId']);

      return;
    }

    openView(action['view']);

    return;
  };

  const noServer: ReactElement = (
    <NoServer
      addServerUrl={(bot === null) ? null : bot['addServerUrl']}
      onOpenConnection={(): void => {
        openView('connection');
      }}
    />
  );

  /**
   * App - Renders view.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const renderView = (): ReactElement => {
    switch (activeView) {
      case 'access': {
        return (
          <AccessView
            onCreateToken={async (input: Web_Api_CreateTokenInput): Promise<Web_Api_CreatedToken> => {
              const nextToken: Web_Api_CreatedToken = await createToken(input);

              await loadTokens();

              return nextToken;
            }}
            onRevokeToken={async (tokenId: string): Promise<void> => {
              await revokeToken(tokenId);
              await loadTokens();
            }}
            onUpdateToken={async (tokenId: string, input: Web_Api_UpdateTokenInput): Promise<void> => {
              await updateToken(tokenId, input);
              await loadTokens();
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
            onTokenSaved={async (): Promise<void> => {
              await Promise.all([
                loadBot(),
                loadRemovedSecrets(),
              ]);
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
            onBack={(): void => {
              openView('features');
            }}
            onDirtyChange={setFeatureDirty}
            onFeaturesChanged={(): void => {
              void loadServers().catch((): undefined => undefined);
              void loadRemovedSecrets().catch((): undefined => undefined);
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
            onFeaturesChanged={(): void => {
              void loadServers().catch((): undefined => undefined);
            }}
            onOpenFeature={(nextFeatureKey: string): void => {
              if (nextFeatureKey === 'web-applications') {
                openRoute(appRouteForInvite());

                return;
              }

              openRoute(appRouteForFeature(nextFeatureKey));
            }}
            server={server}
          />
        );
      }
      case 'backup': {
        if (can('users:manage')) {
          return (
            <BackupView
              onImported={async (): Promise<void> => {
                await Promise.all([
                  loadServers(),
                  loadBot(),
                  loadRemovedSecrets(),
                  loadTokens(),
                ]);
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
            onOpenFeature={(nextFeatureKey: string): void => {
              openRoute(appRouteForFeature(nextFeatureKey));
            }}
            server={server}
          />
        );
      }
      case 'logs': {
        return <LogsView canChangeDebugLogging={can('bot:control')} />;
      }
      case 'notifications': {
        if (can('configuration:write')) {
          return (
            <NotificationsView
              interpreter="discord-stonker-bot"
              onChange={(): void => {
                void loadRemovedSecrets().catch((): undefined => undefined);
              }}
            />
          );
        }

        break;
      }
      case 'security': {
        return (
          <SecurityView
            onAuthenticatorEnabled={(): void => {
              void loadRemovedSecrets().catch((): undefined => undefined);
            }}
            onUsernameChanged={(nextUsername: string): void => setPrincipal({
              ...principal,
              username: nextUsername,
            })}
          />
        );
      }
      case 'users': {
        if (can('users:manage')) {
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
        onOpenConnection={(): void => {
          openView('connection');
        }}
        onOpenFeatures={(): void => {
          openView('features');
        }}
        onRefresh={async (): Promise<void> => {
          await Promise.all([
            loadBot(),
            loadServers(),
          ]);
        }}
        principal={principal}
        server={server}
        servers={servers}
      />
    );
  };

  const addServerUrl: string | null = (bot === null) ? null : bot['addServerUrl'];

  /**
   * App - Change server.
   *
   * Keeps the current server selection synchronized across the desktop and
   * phone switchers without discarding an unfinished feature form silently.
   *
   * @param {string} nextServerId - Next server id.
   *
   * @since 4.0.0
   */
  const changeServer = (nextServerId: string): void => {
    if (activeView === 'feature' && featureDirty && !window.confirm('Discard your unsaved changes?')) {
      return;
    }

    setFeatureDirty(false);
    setServerId(nextServerId);

    if (activeView === 'feature') {
      const featuresRoute: Web_AppNavigation_Route = appRouteForView('features');

      replaceNavigationPath(window, featuresRoute['path']);
      applyAppRoute(featuresRoute);
    }

    return;
  };

  const notice: ReactElement | null = (removedSecrets.length === 0) ? null : (
    <KeyNotice
      appName={appConfig['appName']}
      items={removedSecrets.map((removedSecret: Web_Api_RemovedSecret) => ({
        id: `${removedSecret['kind']}:${removedSecret['serverId'] ?? ''}:${removedSecret['featureKey'] ?? ''}:${removedSecret['notificationId'] ?? ''}`,
        label: describeRemovedSecret(removedSecret)['label'],
        onOpen: (): void => openRemovedSecret(describeRemovedSecret(removedSecret)),
      }))}
      keyName="credential key"
      onDismiss={async (): Promise<void> => {
        await dismissRemovedSecrets();
        setRemovedSecrets([]);
      }}
      removedAt={removedSecrets.at(-1)?.['removedAt'] ?? ''}
    />
  );

  return (
    <AppShell
      accountDetail={(principal['role'] === undefined) ? undefined : roleLabels[principal['role']]}
      activeView={activeView}
      canOpen={(permission: string): boolean => can(permission as Web_Api_Permission)}
      notice={notice}
      onLogout={(): void => {
        void signOut();
      }}
      onViewChange={(view: Web_Components_View): void => {
        openView(view);
      }}
      phonePageTop={(
        <div className="mobile-server-bar">
          <ServerSwitcher
            addServerUrl={addServerUrl}
            onChange={changeServer}
            onOpenConnection={(): void => {
              openView('connection');
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
          onOpenConnection={(): void => {
            openView('connection');
          }}
          serverId={serverId}
          servers={servers}
        />
      )}
      status={{
        ...describeBot(bot),
        onOpen: (): void => {
          openView('connection');
        },
      }}
      username={username}
    >
      {renderView()}
    </AppShell>
  );
};
