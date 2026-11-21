import type { SpawnSyncReturns } from 'node:child_process';

import type {
  APIResponse,
  Locator,
  Page,
} from '@playwright/test';

/**
 * Control Panel Test.
 *
 * @since 4.2.1
 */
export type Tests_E2e_ControlPanelTest_BotToken = string;
export type Tests_E2e_ControlPanelTest_ContainerName = string;
export type Tests_E2e_ControlPanelTest_OwnerPassword = string;
export type Tests_E2e_ControlPanelTest_OwnerUsername = string;
export type Tests_E2e_ControlPanelTest_PanelPage_Heading = string;
export type Tests_E2e_ControlPanelTest_PanelPage_NavigationLabel = string;
export type Tests_E2e_ControlPanelTest_PanelPage = {
  heading: Tests_E2e_ControlPanelTest_PanelPage_Heading;
  navigationLabel: Tests_E2e_ControlPanelTest_PanelPage_NavigationLabel;
};
export type Tests_E2e_ControlPanelTest_PanelPages = Tests_E2e_ControlPanelTest_PanelPage[];

/**
 * Control Panel Test - Control Panel Appliance - Sets Up The Owner Opens Every Page And Saves A Bot Token.
 *
 * @since 4.2.1
 */
export type Tests_E2e_ControlPanelTest_ControlPanelAppliance_SetsUpTheOwnerOpensEveryPageAndSavesABotToken_ConsoleErrors = string[];
export type Tests_E2e_ControlPanelTest_ControlPanelAppliance_SetsUpTheOwnerOpensEveryPageAndSavesABotToken_PageErrors = string[];
export type Tests_E2e_ControlPanelTest_ControlPanelAppliance_SetsUpTheOwnerOpensEveryPageAndSavesABotToken_Sidebar = Locator;

/**
 * Control Panel Test - Control Panel Appliance - Sets Up The Owner Opens Every Page And Saves A Bot Token - Sign Out.
 *
 * @since 4.2.1
 */
export type Tests_E2e_ControlPanelTest_ControlPanelAppliance_SetsUpTheOwnerOpensEveryPageAndSavesABotToken_SignOut_SessionResponse = APIResponse;

/**
 * Control Panel Test - Read Setup Code.
 *
 * @since 4.2.1
 */
export type Tests_E2e_ControlPanelTest_ReadSetupCode_Returns = string;
export type Tests_E2e_ControlPanelTest_ReadSetupCode_ContainerLogResult = SpawnSyncReturns<string>;
export type Tests_E2e_ControlPanelTest_ReadSetupCode_ContainerLog = string;
export type Tests_E2e_ControlPanelTest_ReadSetupCode_SetupCodeLine = string | undefined;
export type Tests_E2e_ControlPanelTest_ReadSetupCode_SetupCode = string;

/**
 * Control Panel Test - Sign Out.
 *
 * @since 4.2.1
 */
export type Tests_E2e_ControlPanelTest_SignOut_Page = Page;
export type Tests_E2e_ControlPanelTest_SignOut_Returns = Promise<void>;
