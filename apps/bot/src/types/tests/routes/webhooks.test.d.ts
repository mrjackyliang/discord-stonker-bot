import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';

export type Tests_Routes_Webhooks_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Webhooks_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Webhooks_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Webhooks_LegacyConfiguration = Record<string, unknown>;
export type Tests_Routes_Webhooks_Body = string;
export type Tests_Routes_Webhooks_Timestamp = string;
export type Tests_Routes_Webhooks_JobRow = {
  dedupe_key: string;
  payload: unknown;
  type: string;
};
export type Tests_Routes_Webhooks_JobRows = Tests_Routes_Webhooks_JobRow[];

export type Tests_Routes_Webhooks_TurnOnWebhooks_Harness = Tests_Support_Harness_Harness;
export type Tests_Routes_Webhooks_TurnOnWebhooks_Running = boolean;
export type Tests_Routes_Webhooks_TurnOnWebhooks_Returns = Promise<void>;
export type Tests_Routes_Webhooks_TurnOnWebhooks_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Webhooks_TurnOnWebhooks_UserId = string;
export type Tests_Routes_Webhooks_TurnOnWebhooks_Confirmation = Tests_Support_Harness_Response;
export type Tests_Routes_Webhooks_TurnOnWebhooks_Grant = {
  grant: string;
};
export type Tests_Routes_Webhooks_TurnOnWebhooks_Imported = Tests_Support_Harness_Response;

export type Tests_Routes_Webhooks_SignedHeaders_Body = string;
export type Tests_Routes_Webhooks_SignedHeaders_Timestamp = string;
export type Tests_Routes_Webhooks_SignedHeaders_Returns = Record<string, string>;

export type Tests_Routes_Webhooks_ReadJobs_Harness = Tests_Support_Harness_Harness;
export type Tests_Routes_Webhooks_ReadJobs_Returns = Promise<Tests_Routes_Webhooks_JobRows>;
