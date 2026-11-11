import type {
  Web_AppNavigation_Items,
  Web_AppNavigation_PathMatch,
  Web_AppNavigation_Paths,
  Web_AppNavigation_Route,
} from '@/types/web/app-navigation.d.ts';
import type { Web_Components_View } from '@/types/web/components.d.ts';

/**
 * App Navigation - Paths.
 *
 * Owns every bookmarkable console address, including feature editors and the
 * specialized invite-page editor. The selected server remains browser-local.
 *
 * @since UNRELEASED
 */
export const appNavigationPaths: Web_AppNavigation_Paths = {
  accessTokens: '/access-tokens',
  account: '/account',
  backup: '/backup',
  connection: '/connection',
  feature: '/features/:feature-id',
  features: '/features',
  invite: '/features/web-applications/invite',
  logs: '/logs',
  notifications: '/notifications',
  overview: '/overview',
  root: '/',
  users: '/users',
};

/**
 * App Navigation - Items.
 *
 * Defines the Stonker Bot navigation separately from the shared shell and
 * helpers. Desktop keeps this full order while phones derive their four tabs.
 *
 * @since 4.0.0
 */
export const appNavigationItems: Web_AppNavigation_Items = [
  {
    groups: [{
      id: 'overview',
      label: 'Overview',
      pages: [{
        id: 'overview',
        label: 'Overview',
      }],
    }],
    icon: 'overview',
    id: 'overview',
    label: 'Overview',
  },
  {
    groups: [{
      id: 'features',
      label: 'Features',
      pages: [{
        activeViews: [
          'feature',
          'invite',
        ],
        id: 'features',
        label: 'Features',
      }],
    }],
    icon: 'features',
    id: 'features',
    label: 'Features',
  },
  {
    groups: [{
      id: 'logs',
      label: 'Logs',
      pages: [{
        id: 'logs',
        label: 'Logs',
      }],
    }],
    icon: 'logs',
    id: 'logs',
    label: 'Logs',
  },
  {
    groups: [{
      id: 'settings',
      label: 'Settings',
      pages: [
        {
          description: 'The bot\'s token and status',
          icon: 'plug',
          id: 'connection',
          label: 'Connection',
        },
        {
          description: 'Export or import this setup',
          icon: 'archive',
          id: 'backup',
          label: 'Backup',
          permission: 'users:manage',
        },
        {
          description: 'Who can sign in, and their roles',
          icon: 'users',
          id: 'users',
          label: 'Users',
          permission: 'users:manage',
        },
        {
          description: 'Tokens for scripts and tools',
          icon: 'key',
          id: 'access',
          label: 'Access tokens',
        },
        {
          description: 'Where alerts are sent',
          icon: 'bell',
          id: 'notifications',
          label: 'Notifications',
          permission: 'configuration:write',
        },
      ],
    }],
    icon: 'settings',
    id: 'settings',
    isGroup: true,
    label: 'Settings',
  },
];

/**
 * App Navigation - Route for feature.
 *
 * Builds an encoded editor address while keeping feature identifiers opaque.
 * The editor receives the decoded identifier from the resolved route.
 *
 * @param {string} featureKey - Feature key.
 *
 * @returns {Web_AppNavigation_Route}
 *
 * @since UNRELEASED
 */
export const appRouteForFeature = (featureKey: string): Web_AppNavigation_Route => ({
  featureKey,
  path: `${appNavigationPaths['features']}/${encodeURIComponent(featureKey)}`,
  view: 'feature',
});

/**
 * App Navigation - Route for invite.
 *
 * Gives the specialized Web applications invite editor its own stable address.
 * The generic feature editor remains available at /features/web-applications.
 *
 * @returns {Web_AppNavigation_Route}
 *
 * @since UNRELEASED
 */
export const appRouteForInvite = (): Web_AppNavigation_Route => ({
  path: appNavigationPaths['invite'],
  view: 'invite',
});

/**
 * App Navigation - Route for view.
 *
 * Returns the canonical path used by shell navigation. The root address is a
 * valid Overview alias, while explicit Overview navigation uses /overview.
 *
 * @param {Web_Components_View} view - View.
 *
 * @returns {Web_AppNavigation_Route}
 *
 * @since UNRELEASED
 */
export const appRouteForView = (view: Web_Components_View): Web_AppNavigation_Route => {
  switch (view) {
    case 'access': {
      return {
        path: appNavigationPaths['accessTokens'],
        view,
      };
    }

    case 'connection': {
      return {
        path: appNavigationPaths['connection'],
        view,
      };
    }

    case 'features': {
      return {
        path: appNavigationPaths['features'],
        view,
      };
    }

    case 'backup': {
      return {
        path: appNavigationPaths['backup'],
        view,
      };
    }

    case 'invite': {
      return appRouteForInvite();
    }

    case 'logs': {
      return {
        path: appNavigationPaths['logs'],
        view,
      };
    }

    case 'notifications': {
      return {
        path: appNavigationPaths['notifications'],
        view,
      };
    }

    case 'security': {
      return {
        path: appNavigationPaths['account'],
        view,
      };
    }

    case 'users': {
      return {
        path: appNavigationPaths['users'],
        view,
      };
    }

    default: {
      return {
        path: appNavigationPaths['overview'],
        view: 'overview',
      };
    }
  }
};

/**
 * App Navigation - Resolve path.
 *
 * Parses every console page and one encoded feature-editor segment. Unknown or
 * malformed paths fall back to Overview with a History API replacement.
 *
 * @param {string} pathname - Pathname.
 *
 * @returns {Web_AppNavigation_PathMatch}
 *
 * @since UNRELEASED
 */
export const resolveAppNavigationPath = (pathname: string): Web_AppNavigation_PathMatch => {
  if (pathname === appNavigationPaths['root']) {
    return {
      path: pathname,
      replace: false,
      route: {
        path: pathname,
        view: 'overview',
      },
    };
  }

  if (pathname === appNavigationPaths['invite']) {
    const route: Web_AppNavigation_Route = appRouteForInvite();

    return {
      path: route['path'],
      replace: false,
      route,
    };
  }

  for (const view of [
    'overview',
    'features',
    'logs',
    'connection',
    'backup',
    'users',
    'access',
    'notifications',
    'security',
  ] as const) {
    const route: Web_AppNavigation_Route = appRouteForView(view);
    if (pathname === route['path']) {
      return {
        path: route['path'],
        replace: false,
        route,
      };
    }
  }

  if (pathname === '/import') {
    const route: Web_AppNavigation_Route = appRouteForView('backup');

    return {
      path: route['path'],
      replace: true,
      route,
    };
  }

  const featurePrefix: string = `${appNavigationPaths['features']}/`;
  if (pathname.startsWith(featurePrefix)) {
    const encodedFeatureKey: string = pathname.slice(featurePrefix.length);
    if (encodedFeatureKey !== '' && !encodedFeatureKey.includes('/')) {
      try {
        const featureKey: string = decodeURIComponent(encodedFeatureKey);
        if (featureKey !== '') {
          const route: Web_AppNavigation_Route = appRouteForFeature(featureKey);

          return {
            path: route['path'],
            replace: pathname !== route['path'],
            route,
          };
        }
      } catch {
        // Malformed percent encoding follows the same first-page fallback.
      }
    }
  }

  const route: Web_AppNavigation_Route = appRouteForView('overview');

  return {
    path: route['path'],
    replace: true,
    route,
  };
};
