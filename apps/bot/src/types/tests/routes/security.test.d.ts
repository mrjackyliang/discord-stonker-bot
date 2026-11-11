import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';
import type {
  Tests_Support_Passkeys_Authenticator,
  Tests_Support_Passkeys_Options,
} from '../support/passkeys.d.ts';

export type Tests_Routes_Security_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Security_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Security_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Security_Responses = Tests_Support_Harness_Response[];
export type Tests_Routes_Security_Password = string;
export type Tests_Routes_Security_Secret = string;
export type Tests_Routes_Security_Step = number;
export type Tests_Routes_Security_RecoveryCodes = string[];
export type Tests_Routes_Security_Token = string;
export type Tests_Routes_Security_Passkey = Tests_Support_Passkeys_Authenticator;
export type Tests_Routes_Security_Options = Tests_Support_Passkeys_Options;
export type Tests_Routes_Security_PasskeyId = string;
