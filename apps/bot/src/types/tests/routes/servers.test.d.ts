import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
} from '../support/harness.d.ts';

export type Tests_Routes_Servers_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Servers_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Servers_ServerId = string;
export type Tests_Routes_Servers_Token = string;
export type Tests_Routes_Servers_UserId = string;

export type Tests_Routes_Servers_GetHarness_Returns = Tests_Support_Harness_Harness;
