import type { MockInstance } from 'vitest';

import type { Tests_Support_Accounts_Authenticator } from '../support/accounts.d.ts';
import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';
import type {
  Tests_Support_Passkeys_Authenticator,
  Tests_Support_Passkeys_Options,
} from '../support/passkeys.d.ts';

export type Tests_Routes_Auth_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Auth_BaseUrl = string;
export type Tests_Routes_Auth_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Auth_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Auth_Responses = Tests_Support_Harness_Response[];
export type Tests_Routes_Auth_SetupClaim = {
  code: string;
  expiresAt: string;
} | undefined;
export type Tests_Routes_Auth_Code = string;
export type Tests_Routes_Auth_Challenge = string;
export type Tests_Routes_Auth_Count = {
  count: string;
};
export type Tests_Routes_Auth_UserId = string;
export type Tests_Routes_Auth_Token = string;
export type Tests_Routes_Auth_Authenticator = Tests_Support_Accounts_Authenticator;
export type Tests_Routes_Auth_Passkey = Tests_Support_Passkeys_Authenticator;
export type Tests_Routes_Auth_Options = Tests_Support_Passkeys_Options;
export type Tests_Routes_Auth_Step = number;
export type Tests_Routes_Auth_RecoveryCode = string;
export type Tests_Routes_Auth_Output = string;
export type Tests_Routes_Auth_OutputSpy = MockInstance<typeof process.stdout.write>;
export type Tests_Routes_Auth_KeyDirectory = string;
export type Tests_Routes_Auth_RemovedSecrets = string[];
