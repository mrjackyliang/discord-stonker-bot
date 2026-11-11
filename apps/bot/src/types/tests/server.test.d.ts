import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from './support/harness.d.ts';

export type Tests_Server_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Server_Client = Tests_Support_Harness_Client;
export type Tests_Server_Response = Tests_Support_Harness_Response;
