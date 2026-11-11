import type { QueryResult } from 'pg';

import type { Lib_FeatureSecrets_SecretReference } from '../../lib/feature-secrets.d.ts';
import type { Shared_FeatureKey } from '../../shared.d.ts';
import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';
import type { Tests_Support_Sessions_UserOptions } from '../support/sessions.d.ts';

export type Tests_Routes_Features_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Features_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Features_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Features_ServerId = string;
export type Tests_Routes_Features_WebhookUrl = string;
export type Tests_Routes_Features_SecretKey = string;
export type Tests_Routes_Features_SecretKeys = string[];
export type Tests_Routes_Features_Generation = number;
export type Tests_Routes_Features_Token = string;
export type Tests_Routes_Features_UserId = string;
export type Tests_Routes_Features_AntiRaidConfiguration = Record<string, unknown>;
export type Tests_Routes_Features_WebApplicationsConfiguration = Record<string, unknown>;
export type Tests_Routes_Features_Summary = {
  configured: boolean;
  enabled: boolean;
  key: string;
  revision: number;
  updatedAt: string | null;
};
export type Tests_Routes_Features_List = {
  items: Tests_Routes_Features_Summary[];
};
export type Tests_Routes_Features_Detail = Tests_Routes_Features_Summary & {
  configuration: unknown;
  secrets: Record<string, boolean>;
};

export type Tests_Routes_Features_GetHarness_Returns = Tests_Support_Harness_Harness;

export type Tests_Routes_Features_CreateProxyConfiguration_SecretKeys = string[];
export type Tests_Routes_Features_CreateProxyConfiguration_Returns = Record<string, unknown>[];

export type Tests_Routes_Features_ListSecretKeys_Returns = Promise<string[]>;
export type Tests_Routes_Features_ListSecretKeys_Row = {
  secret_key: string;
};
export type Tests_Routes_Features_ListSecretKeys_Result = QueryResult<Tests_Routes_Features_ListSecretKeys_Row>;

export type Tests_Routes_Features_ReadGeneration_Returns = Promise<number>;
export type Tests_Routes_Features_ReadGeneration_Row = {
  generation: string;
};
export type Tests_Routes_Features_ReadGeneration_Result = QueryResult<Tests_Routes_Features_ReadGeneration_Row>;
export type Tests_Routes_Features_ReadGeneration_FirstRow = Tests_Routes_Features_ReadGeneration_Row | undefined;

export type Tests_Routes_Features_ReadSecretKey_Body = unknown;
export type Tests_Routes_Features_ReadSecretKey_Index = number;
export type Tests_Routes_Features_ReadSecretKey_Returns = string;
export type Tests_Routes_Features_ReadSecretKey_Reference = Lib_FeatureSecrets_SecretReference | undefined;

export type Tests_Routes_Features_SignIn_Options = Tests_Support_Sessions_UserOptions;
export type Tests_Routes_Features_SignIn_Returns = Promise<Tests_Support_Harness_Client>;

export type Tests_Routes_Features_StoreFeature_FeatureKey = Shared_FeatureKey;
export type Tests_Routes_Features_StoreFeature_Configuration = unknown;
export type Tests_Routes_Features_StoreFeature_Returns = Promise<void>;
