import type { Web_AppNavigation_Route } from '@/types/web/app-navigation.d.ts';
import type {
  Web_Navigation_Browser,
  Web_Navigation_CanOpen,
  Web_Navigation_Group,
  Web_Navigation_HistoryURL,
  Web_Navigation_Item,
  Web_Navigation_Items,
  Web_Navigation_Location,
  Web_Navigation_PopStateListener,
  Web_Navigation_SheetGroup,
  Web_Navigation_SheetLevel,
  Web_Navigation_SheetStack,
  Web_Navigation_Tabs,
} from '@/types/web/navigation.d.ts';

/**
 * Navigation.
 *
 * @since 4.0.0
 */
export type Tests_Web_Navigation_Item = Web_Navigation_Item;
export type Tests_Web_Navigation_Items = Web_Navigation_Items;
export type Tests_Web_Navigation_CanOpen = Web_Navigation_CanOpen;
export type Tests_Web_Navigation_OptionalGroup = Web_Navigation_Group | undefined;
export type Tests_Web_Navigation_OptionalItem = Web_Navigation_Item | undefined;
export type Tests_Web_Navigation_OptionalSheetGroup = Web_Navigation_SheetGroup | undefined;
export type Tests_Web_Navigation_SheetGroup = Web_Navigation_SheetGroup;
export type Tests_Web_Navigation_SheetLevel = Web_Navigation_SheetLevel;
export type Tests_Web_Navigation_SheetStack = Web_Navigation_SheetStack;
export type Tests_Web_Navigation_Tabs = Web_Navigation_Tabs;

/**
 * Navigation - Create History Browser.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_CreateHistoryBrowser_InitialPath = string;
export type Tests_Web_Navigation_CreateHistoryBrowser_Returns = Tests_Web_Navigation_HistoryFixture;
export type Tests_Web_Navigation_CreateHistoryBrowser_Entries = string[];
export type Tests_Web_Navigation_CreateHistoryBrowser_Listeners = Set<Web_Navigation_PopStateListener>;
export type Tests_Web_Navigation_CreateHistoryBrowser_Location = Web_Navigation_Location;
export type Tests_Web_Navigation_CreateHistoryBrowser_Browser = Web_Navigation_Browser;
export type Tests_Web_Navigation_CreateHistoryBrowser_NextPath = string;

/**
 * Navigation - History fixture.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_HistoryFixture = {
  back: () => void;
  browser: Web_Navigation_Browser;
  entries: string[];
  forward: () => void;
};

/**
 * Navigation - History position.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_HistoryPosition = {
  value: number;
};

/**
 * Navigation - Move.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_Move = (direction: Tests_Web_Navigation_Move_Direction) => Tests_Web_Navigation_Move_Returns;
export type Tests_Web_Navigation_Move_Direction = number;
export type Tests_Web_Navigation_Move_Returns = void;
export type Tests_Web_Navigation_Move_NextPosition = number;
export type Tests_Web_Navigation_Move_NextPath = string | undefined;

/**
 * Navigation - Path From History URL.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_PathFromHistoryUrl_Url = Web_Navigation_HistoryURL;
export type Tests_Web_Navigation_PathFromHistoryUrl_CurrentPath = string;
export type Tests_Web_Navigation_PathFromHistoryUrl_Returns = string;

/**
 * Navigation - Remember route.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_RememberRoute = (route: Web_AppNavigation_Route) => void;

/**
 * Navigation - Route state.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_RouteState = {
  value: Web_AppNavigation_Route;
};

/**
 * Navigation - Stop.
 *
 * @since UNRELEASED
 */
export type Tests_Web_Navigation_Stop = () => void;
