import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  appNavigationItems,
  appNavigationPaths,
  appRouteForFeature,
  appRouteForInvite,
  appRouteForView,
  resolveAppNavigationPath,
} from '../../web/app-navigation.js';
import {
  applyNavigationPath,
  closeNavSheetStack,
  createMoreNavSheetLevel,
  createNavSheetLevel,
  firstNavigationView,
  navigationItemHasSheet,
  navigationItemHoldsView,
  openNavSheetStack,
  PHONE_TABS,
  phoneNavigationLabel,
  phoneTabs,
  popNavSheetStack,
  pushNavigationPath,
  pushNavSheetStack,
  startNavigationHistory,
  visibleNavigationItems,
} from '../../web/navigation.js';

import type {
  Tests_Web_Navigation_CanOpen,
  Tests_Web_Navigation_CreateHistoryBrowser_Browser,
  Tests_Web_Navigation_CreateHistoryBrowser_Entries,
  Tests_Web_Navigation_CreateHistoryBrowser_InitialPath,
  Tests_Web_Navigation_CreateHistoryBrowser_Listeners,
  Tests_Web_Navigation_CreateHistoryBrowser_Location,
  Tests_Web_Navigation_CreateHistoryBrowser_NextPath,
  Tests_Web_Navigation_CreateHistoryBrowser_Returns,
  Tests_Web_Navigation_HistoryFixture,
  Tests_Web_Navigation_HistoryPosition,
  Tests_Web_Navigation_Item,
  Tests_Web_Navigation_Items,
  Tests_Web_Navigation_Move,
  Tests_Web_Navigation_Move_Direction,
  Tests_Web_Navigation_Move_NextPath,
  Tests_Web_Navigation_Move_NextPosition,
  Tests_Web_Navigation_Move_Returns,
  Tests_Web_Navigation_OptionalGroup,
  Tests_Web_Navigation_OptionalItem,
  Tests_Web_Navigation_OptionalSheetGroup,
  Tests_Web_Navigation_PathFromHistoryUrl_CurrentPath,
  Tests_Web_Navigation_PathFromHistoryUrl_Returns,
  Tests_Web_Navigation_PathFromHistoryUrl_Url,
  Tests_Web_Navigation_RememberRoute,
  Tests_Web_Navigation_RouteState,
  Tests_Web_Navigation_SheetLevel,
  Tests_Web_Navigation_SheetStack,
  Tests_Web_Navigation_Stop,
  Tests_Web_Navigation_Tabs,
} from '@/types/tests/web/navigation.test.d.ts';
import type { Web_AppNavigation_Route } from '@/types/web/app-navigation.d.ts';

/**
 * Navigation - Path From History URL.
 *
 * Normalizes the History API's optional URL input for the in-memory browser.
 * Tests can therefore exercise the shared helpers without a DOM implementation.
 *
 * @param {Tests_Web_Navigation_PathFromHistoryUrl_Url}         url         - Url.
 * @param {Tests_Web_Navigation_PathFromHistoryUrl_CurrentPath} currentPath - Current path.
 *
 * @returns {Tests_Web_Navigation_PathFromHistoryUrl_Returns}
 *
 * @since UNRELEASED
 */
const pathFromHistoryURL = (
  url: Tests_Web_Navigation_PathFromHistoryUrl_Url,
  currentPath: Tests_Web_Navigation_PathFromHistoryUrl_CurrentPath,
): Tests_Web_Navigation_PathFromHistoryUrl_Returns => {
  if (url === undefined || url === null) {
    return currentPath;
  }

  if (url instanceof URL) {
    return url.pathname;
  }

  return new URL(url, 'http://navigation.test').pathname;
};

/**
 * Navigation - Create History Browser.
 *
 * Models entries, location, and popstate listeners closely enough for routing.
 * Back and Forward update the same mutable location exposed to the helpers.
 *
 * @param {Tests_Web_Navigation_CreateHistoryBrowser_InitialPath} initialPath - Initial path.
 *
 * @returns {Tests_Web_Navigation_CreateHistoryBrowser_Returns}
 *
 * @since UNRELEASED
 */
const createHistoryBrowser = (
  initialPath: Tests_Web_Navigation_CreateHistoryBrowser_InitialPath,
): Tests_Web_Navigation_CreateHistoryBrowser_Returns => {
  const entries: Tests_Web_Navigation_CreateHistoryBrowser_Entries = [initialPath];
  const position: Tests_Web_Navigation_HistoryPosition = { value: 0 };
  const listeners: Tests_Web_Navigation_CreateHistoryBrowser_Listeners = new Set();
  const location: Tests_Web_Navigation_CreateHistoryBrowser_Location = { pathname: initialPath };

  /**
   * Navigation - Move.
   *
   * Applies one bounded Back or Forward transition and publishes popstate.
   * The fixture ignores attempts to move beyond either end of the stack.
   *
   * @param {Tests_Web_Navigation_Move_Direction} direction - Direction.
   *
   * @returns {Tests_Web_Navigation_Move_Returns}
   *
   * @since UNRELEASED
   */
  const move: Tests_Web_Navigation_Move = (
    direction: Tests_Web_Navigation_Move_Direction,
  ): Tests_Web_Navigation_Move_Returns => {
    const nextPosition: Tests_Web_Navigation_Move_NextPosition = position['value'] + direction;
    if (nextPosition < 0 || nextPosition >= entries.length) {
      return;
    }

    const nextPath: Tests_Web_Navigation_Move_NextPath = entries.at(nextPosition);
    if (nextPath === undefined) {
      return;
    }

    Reflect.set(position, 'value', nextPosition);
    Reflect.set(location, 'pathname', nextPath);

    for (const listener of listeners) {
      listener();
    }

    return;
  };

  const browser: Tests_Web_Navigation_CreateHistoryBrowser_Browser = {
    addEventListener: (_type, listener) => {
      listeners.add(listener);

      return;
    },
    history: {
      pushState: (_data, _unused, url) => {
        const nextPath: Tests_Web_Navigation_CreateHistoryBrowser_NextPath = pathFromHistoryURL(url, location['pathname']);

        entries.splice(position['value'] + 1);

        entries.push(nextPath);

        Reflect.set(position, 'value', entries.length - 1);
        Reflect.set(location, 'pathname', nextPath);

        return;
      },
      replaceState: (_data, _unused, url) => {
        const nextPath: Tests_Web_Navigation_CreateHistoryBrowser_NextPath = pathFromHistoryURL(url, location['pathname']);

        entries.splice(position['value'], 1, nextPath);

        Reflect.set(location, 'pathname', nextPath);

        return;
      },
    },
    location,
    removeEventListener: (_type, listener) => {
      listeners.delete(listener);

      return;
    },
  };

  return {
    back: () => move(-1),
    browser,
    entries,
    forward: () => move(1),
  };
};

describe('navigation', () => {
  const groupedItem: Tests_Web_Navigation_Item = {
    groups: [{
      id: 'settings',
      label: 'Settings',
      pages: [
        {
          id: 'connection',
          label: 'Connection',
          permission: 'connection:write',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          permission: 'notifications:write',
        },
      ],
    }],
    icon: 'settings',
    id: 'settings',
    isGroup: true,
    label: 'Settings',
  };

  it('keeps this app at four direct phone tabs and builds the Settings sheet copy', () => {
    const tabs: Tests_Web_Navigation_Tabs = phoneTabs(appNavigationItems);

    expect(PHONE_TABS).toBe(4);

    expect(tabs['tabs'].map((item) => item['id'])).toEqual([
      'overview',
      'features',
      'logs',
      'settings',
    ]);

    expect(tabs['more']).toEqual([]);

    expect(tabs['tabs'].length).toBeLessThanOrEqual(PHONE_TABS);

    const settingsItem: Tests_Web_Navigation_OptionalItem = tabs['tabs'].at(3);

    if (settingsItem === undefined) {
      throw new Error('The Settings tab needs to be present.');
    }

    const settingsLevel: Tests_Web_Navigation_SheetLevel = createNavSheetLevel(settingsItem);
    const settingsGroup: Tests_Web_Navigation_OptionalSheetGroup = settingsLevel['groups'].at(0);

    if (settingsGroup === undefined) {
      throw new Error('The Settings sheet needs a row group.');
    }

    expect(settingsGroup['rows']).toMatchObject([
      {
        description: 'The bot\'s token and status',
        label: 'Connection',
      },
      {
        description: 'Export or import this setup',
        label: 'Backup',
      },
      {
        description: 'Who can sign in, and their roles',
        label: 'Users',
      },
      {
        description: 'Tokens for scripts and tools',
        label: 'Access tokens',
      },
      {
        description: 'Where alerts are sent',
        label: 'Notifications',
      },
    ]);

    const cannotOpen: Tests_Web_Navigation_CanOpen = () => false;
    const restrictedItems: Tests_Web_Navigation_Items = visibleNavigationItems(
      appNavigationItems,
      cannotOpen,
    );
    const restrictedSettings: Tests_Web_Navigation_OptionalItem = restrictedItems.find((item) => item['id'] === 'settings');

    if (restrictedSettings === undefined) {
      throw new Error('The restricted Settings tab needs to be present.');
    }

    const restrictedGroup: Tests_Web_Navigation_OptionalGroup = restrictedSettings['groups'].at(0);

    if (restrictedGroup === undefined) {
      throw new Error('The restricted Settings tab needs a page group.');
    }

    expect(restrictedGroup['pages'].map((page) => page['id'])).toEqual([
      'connection',
      'access',
    ]);

    return;
  });

  it('opens a group at the first page the current role can use', () => {
    const canOpen: Tests_Web_Navigation_CanOpen = (permission) => permission === 'notifications:write';
    const visibleItems: Tests_Web_Navigation_Items = visibleNavigationItems(
      [groupedItem],
      canOpen,
    );
    const visibleGroup: Tests_Web_Navigation_OptionalItem = visibleItems.at(0);

    if (visibleGroup === undefined) {
      throw new Error('The Settings group needs one visible page.');
    }

    const visibleLevel: Tests_Web_Navigation_SheetLevel = createNavSheetLevel(visibleGroup);
    const visibleSheetGroup: Tests_Web_Navigation_OptionalSheetGroup = visibleLevel['groups'].at(0);

    if (visibleSheetGroup === undefined) {
      throw new Error('The Settings sheet needs a row group.');
    }

    expect(firstNavigationView(visibleGroup)).toBe('notifications');

    expect(navigationItemHasSheet(visibleGroup)).toBe(true);

    expect(visibleSheetGroup['rows'].map((row) => row['label'])).toEqual(['Notifications']);

    return;
  });

  it('marks a parent current for its page and every declared child view', () => {
    const featuresItem: Tests_Web_Navigation_Item = {
      groups: [{
        id: 'features',
        label: 'Features',
        pages: [{
          activeViews: ['invite'],
          id: 'features',
          label: 'Features',
        }],
      }],
      icon: 'features',
      id: 'features',
      label: 'Features',
    };

    expect(navigationItemHoldsView(featuresItem, 'features')).toBe(true);

    expect(navigationItemHoldsView(featuresItem, 'invite')).toBe(true);

    expect(navigationItemHoldsView(featuresItem, 'logs')).toBe(false);

    return;
  });

  it('keeps the app navigation labels in sidebar order', () => {
    expect(appNavigationItems.map((item) => item['label'])).toEqual([
      'Overview',
      'Features',
      'Logs',
      'Settings',
    ]);

    expect(appNavigationItems.map(phoneNavigationLabel)).toEqual([
      'Overview',
      'Features',
      'Logs',
      'Settings',
    ]);

    return;
  });

  it('maps every console page and feature editor through the app path table', () => {
    expect(appNavigationPaths).toEqual({
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
    });

    expect(resolveAppNavigationPath('/')['route']).toMatchObject({
      path: '/',
      view: 'overview',
    });

    expect(resolveAppNavigationPath('/overview')['route']).toEqual(appRouteForView('overview'));

    expect(resolveAppNavigationPath('/features')['route']).toEqual(appRouteForView('features'));

    expect(resolveAppNavigationPath('/logs')['route']).toEqual(appRouteForView('logs'));

    expect(resolveAppNavigationPath('/connection')['route']).toEqual(appRouteForView('connection'));

    expect(resolveAppNavigationPath('/backup')['route']).toEqual(appRouteForView('backup'));

    expect(resolveAppNavigationPath('/import')).toEqual({
      path: '/backup',
      replace: true,
      route: appRouteForView('backup'),
    });

    expect(resolveAppNavigationPath('/users')['route']).toEqual(appRouteForView('users'));

    expect(resolveAppNavigationPath('/access-tokens')['route']).toEqual(appRouteForView('access'));

    expect(resolveAppNavigationPath('/notifications')['route']).toEqual(appRouteForView('notifications'));

    expect(resolveAppNavigationPath('/account')['route']).toEqual(appRouteForView('security'));

    expect(resolveAppNavigationPath('/features/web-applications/invite')['route']).toEqual(appRouteForInvite());

    expect(resolveAppNavigationPath('/features/web-applications')['route']).toEqual(appRouteForFeature('web-applications'));

    const featureRoute: Web_AppNavigation_Route = appRouteForFeature('message/copiers');

    expect(featureRoute['path']).toBe('/features/message%2Fcopiers');

    expect(resolveAppNavigationPath(featureRoute['path'])['route']).toEqual(featureRoute);

    return;
  });

  it('pushes page entries and restores them with Back and Forward', () => {
    const fixture: Tests_Web_Navigation_HistoryFixture = createHistoryBrowser('/');
    const routeState: Tests_Web_Navigation_RouteState = {
      value: resolveAppNavigationPath('/')['route'],
    };
    const rememberRoute: Tests_Web_Navigation_RememberRoute = (route) => {
      Reflect.set(routeState, 'value', route);

      return;
    };
    const stop: Tests_Web_Navigation_Stop = startNavigationHistory(
      fixture['browser'],
      resolveAppNavigationPath,
      rememberRoute,
    );
    const featuresRoute: Web_AppNavigation_Route = appRouteForView('features');

    pushNavigationPath(fixture['browser'], featuresRoute['path']);
    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    const featureRoute: Web_AppNavigation_Route = appRouteForFeature('message-copiers');

    pushNavigationPath(fixture['browser'], featureRoute['path']);
    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    expect(fixture['entries']).toEqual([
      '/',
      '/features',
      '/features/message-copiers',
    ]);

    expect(routeState['value']).toEqual(featureRoute);

    fixture.back();

    expect(routeState['value']).toEqual(featuresRoute);

    expect(fixture['browser']['location']['pathname']).toBe('/features');

    fixture.forward();

    expect(routeState['value']).toEqual(featureRoute);

    expect(fixture['browser']['location']['pathname']).toBe('/features/message-copiers');

    stop();

    return;
  });

  it('replaces unknown and malformed paths with Overview', () => {
    const fixture: Tests_Web_Navigation_HistoryFixture = createHistoryBrowser('/features/broken/path');
    const routeState: Tests_Web_Navigation_RouteState = {
      value: resolveAppNavigationPath('/')['route'],
    };
    const rememberRoute: Tests_Web_Navigation_RememberRoute = (route) => {
      Reflect.set(routeState, 'value', route);

      return;
    };
    const stop: Tests_Web_Navigation_Stop = startNavigationHistory(
      fixture['browser'],
      resolveAppNavigationPath,
      rememberRoute,
    );

    expect(fixture['entries']).toEqual(['/overview']);

    expect(fixture['browser']['location']['pathname']).toBe('/overview');

    expect(routeState['value']).toEqual(appRouteForView('overview'));

    expect(resolveAppNavigationPath('/features/%')['replace']).toBe(true);

    expect(resolveAppNavigationPath('/missing')['route']).toEqual(appRouteForView('overview'));

    stop();

    return;
  });

  it('keeps the requested address through sign-in and first-run setup', () => {
    const fixture: Tests_Web_Navigation_HistoryFixture = createHistoryBrowser('/features/message-copiers');
    const routeState: Tests_Web_Navigation_RouteState = {
      value: resolveAppNavigationPath('/')['route'],
    };
    const rememberRoute: Tests_Web_Navigation_RememberRoute = (route) => {
      Reflect.set(routeState, 'value', route);

      return;
    };
    const stop: Tests_Web_Navigation_Stop = startNavigationHistory(
      fixture['browser'],
      resolveAppNavigationPath,
      rememberRoute,
    );

    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    applyNavigationPath(fixture['browser'], resolveAppNavigationPath, rememberRoute);

    expect(fixture['entries']).toEqual(['/features/message-copiers']);

    expect(routeState['value']).toEqual(appRouteForFeature('message-copiers'));

    stop();

    return;
  });

  it('opens, pushes, pops, and closes the sheet stack without mutation', () => {
    const moreLevel: Tests_Web_Navigation_SheetLevel = createMoreNavSheetLevel([groupedItem]);
    const childLevel: Tests_Web_Navigation_SheetLevel = createNavSheetLevel(groupedItem, 'More');
    const rootStack: Tests_Web_Navigation_SheetStack = openNavSheetStack(moreLevel);
    const pushedStack: Tests_Web_Navigation_SheetStack = pushNavSheetStack(rootStack, childLevel);

    expect(rootStack).toEqual([moreLevel]);

    expect(pushedStack).toEqual([
      moreLevel,
      childLevel,
    ]);

    expect(popNavSheetStack(pushedStack)).toEqual([moreLevel]);

    expect(popNavSheetStack(rootStack)).toBe(rootStack);

    expect(closeNavSheetStack()).toEqual([]);

    return;
  });

  return;
});
