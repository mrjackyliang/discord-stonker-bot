import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';

export type Tests_Routes_Bot_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Bot_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Bot_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Bot_Token = string;
export type Tests_Routes_Bot_UserId = string;
