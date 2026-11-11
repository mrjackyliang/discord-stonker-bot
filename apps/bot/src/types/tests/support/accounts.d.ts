import type { Pool } from 'pg';

import type { Shared_PanelRole } from '../../shared.d.ts';
import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Response,
} from './harness.d.ts';

export type Tests_Support_Accounts_OwnerPassword = string;
export type Tests_Support_Accounts_Authenticator = {
  recoveryCodes: string[];
  secret: string;
  step: number;
};

export type Tests_Support_Accounts_AddUser_Owner = Tests_Support_Harness_Client;
export type Tests_Support_Accounts_AddUser_Input = {
  allServers: boolean;
  password: string;
  role: Exclude<Shared_PanelRole, 'owner'>;
  serverIds: string[];
  username: string;
};
export type Tests_Support_Accounts_AddUser_Returns = Promise<string>;
export type Tests_Support_Accounts_AddUser_Response = Tests_Support_Harness_Response;

export type Tests_Support_Accounts_ClaimOwner_Pool = Pool;
export type Tests_Support_Accounts_ClaimOwner_Client = Tests_Support_Harness_Client;
export type Tests_Support_Accounts_ClaimOwner_Username = string;
export type Tests_Support_Accounts_ClaimOwner_Returns = Promise<Tests_Support_Harness_Response>;
export type Tests_Support_Accounts_ClaimOwner_SetupClaim = {
  code: string;
  expiresAt: string;
} | undefined;

export type Tests_Support_Accounts_CreateTotpCode_Secret = string;
export type Tests_Support_Accounts_CreateTotpCode_Step = number;
export type Tests_Support_Accounts_CreateTotpCode_Returns = string;

export type Tests_Support_Accounts_EnableAuthenticator_Client = Tests_Support_Harness_Client;
export type Tests_Support_Accounts_EnableAuthenticator_Password = string;
export type Tests_Support_Accounts_EnableAuthenticator_Returns = Promise<Tests_Support_Accounts_Authenticator>;
export type Tests_Support_Accounts_EnableAuthenticator_Step = number;
export type Tests_Support_Accounts_EnableAuthenticator_Setup = Tests_Support_Harness_Response;
export type Tests_Support_Accounts_EnableAuthenticator_Secret = string;
export type Tests_Support_Accounts_EnableAuthenticator_Enabled = Tests_Support_Harness_Response;

export type Tests_Support_Accounts_GetTotpStep_Returns = Promise<number>;
export type Tests_Support_Accounts_GetTotpStep_Remaining = number;

export type Tests_Support_Accounts_RequestInOrder_Requests = (() => Promise<Tests_Support_Harness_Response>)[];
export type Tests_Support_Accounts_RequestInOrder_Returns = Promise<Tests_Support_Harness_Response[]>;
export type Tests_Support_Accounts_RequestInOrder_Responses = Tests_Support_Harness_Response[];
export type Tests_Support_Accounts_RequestInOrder_Previous = Promise<void>;

export type Tests_Support_Accounts_SignIn_Client = Tests_Support_Harness_Client;
export type Tests_Support_Accounts_SignIn_Username = string;
export type Tests_Support_Accounts_SignIn_Password = string;
export type Tests_Support_Accounts_SignIn_Returns = Promise<Tests_Support_Harness_Response>;
