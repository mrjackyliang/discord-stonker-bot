import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import type express from 'express';

import type {
  passkeyRegistrationStart,
  passkeyRegistrationVerify,
  passwordChange,
  passwordConfirmation,
  totpEnable,
  usernameChange,
} from '../../lib/account-schemas.js';
import type {
  Lib_PanelAuth_Account,
  Lib_PanelAuth_Security,
  Lib_PanelAuth_SecurityPasskey,
  Lib_PanelAuth_TotpSecret,
} from '../lib/panel-auth.d.ts';
import type {
  Lib_PasskeyAuth_Ceremony,
  Lib_PasskeyAuth_PasskeyDescriptor,
  Lib_PasskeyAuth_RegisteredCredential,
} from '../lib/passkey-auth.d.ts';
import type {
  Server_Access,
  Server_Attempts,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_Principal,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

export type Routes_Security_RpName = string;

export type Routes_Security_Runner_Access = Server_Access;
export type Routes_Security_Runner_Attempts = Server_Attempts;
export type Routes_Security_Runner_Context = Server_Context;

export type Routes_Security_Runner_Constructor_Context = Server_Context;
export type Routes_Security_Runner_Constructor_Access = Server_Access;
export type Routes_Security_Runner_Constructor_Attempts = Server_Attempts;

export type Routes_Security_Runner_Register_App = express.Express;
export type Routes_Security_Runner_Register_Returns = void;

export type Routes_Security_Runner_ConfirmPassword_Request = express.Request;
export type Routes_Security_Runner_ConfirmPassword_Response = express.Response;
export type Routes_Security_Runner_ConfirmPassword_Password = string;
export type Routes_Security_Runner_ConfirmPassword_Field = string;
export type Routes_Security_Runner_ConfirmPassword_Returns = Promise<boolean>;
export type Routes_Security_Runner_ConfirmPassword_AttemptKey = string;
export type Routes_Security_Runner_ConfirmPassword_Principal = Shared_Principal;

export type Routes_Security_Runner_RouteChangePassword_Request = express.Request;
export type Routes_Security_Runner_RouteChangePassword_Response = express.Response;
export type Routes_Security_Runner_RouteChangePassword_Returns = Promise<void>;
export type Routes_Security_Runner_RouteChangePassword_RequestBody = ReturnType<typeof passwordChange.safeParse>;
export type Routes_Security_Runner_RouteChangePassword_Principal = Shared_Principal;

export type Routes_Security_Runner_RouteChangeUsername_Request = express.Request;
export type Routes_Security_Runner_RouteChangeUsername_Response = express.Response;
export type Routes_Security_Runner_RouteChangeUsername_Returns = Promise<void>;
export type Routes_Security_Runner_RouteChangeUsername_RequestBody = ReturnType<typeof usernameChange.safeParse>;
export type Routes_Security_Runner_RouteChangeUsername_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteChangeUsername_Result = Lib_PanelAuth_Account | 'conflict' | 'not-found';

export type Routes_Security_Runner_RouteDeletePasskey_Request = express.Request;
export type Routes_Security_Runner_RouteDeletePasskey_Response = express.Response;
export type Routes_Security_Runner_RouteDeletePasskey_Returns = Promise<void>;
export type Routes_Security_Runner_RouteDeletePasskey_PasskeyId = string | undefined;
export type Routes_Security_Runner_RouteDeletePasskey_RequestBody = ReturnType<typeof passwordConfirmation.safeParse>;
export type Routes_Security_Runner_RouteDeletePasskey_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteDeletePasskey_Name = string | undefined;

export type Routes_Security_Runner_RouteDisableTotp_Request = express.Request;
export type Routes_Security_Runner_RouteDisableTotp_Response = express.Response;
export type Routes_Security_Runner_RouteDisableTotp_Returns = Promise<void>;
export type Routes_Security_Runner_RouteDisableTotp_RequestBody = ReturnType<typeof passwordConfirmation.safeParse>;
export type Routes_Security_Runner_RouteDisableTotp_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteDisableTotp_Disabled = boolean;

export type Routes_Security_Runner_RouteEnableTotp_Request = express.Request;
export type Routes_Security_Runner_RouteEnableTotp_Response = express.Response;
export type Routes_Security_Runner_RouteEnableTotp_Returns = Promise<void>;
export type Routes_Security_Runner_RouteEnableTotp_RequestBody = ReturnType<typeof totpEnable.safeParse>;
export type Routes_Security_Runner_RouteEnableTotp_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteEnableTotp_Secret = string | undefined;
export type Routes_Security_Runner_RouteEnableTotp_MatchedStep = number | undefined;
export type Routes_Security_Runner_RouteEnableTotp_RecoveryCodes = string[];

export type Routes_Security_Runner_RoutePasskeyOptions_Request = express.Request;
export type Routes_Security_Runner_RoutePasskeyOptions_Response = express.Response;
export type Routes_Security_Runner_RoutePasskeyOptions_Returns = Promise<void>;
export type Routes_Security_Runner_RoutePasskeyOptions_RequestBody = ReturnType<typeof passkeyRegistrationStart.safeParse>;
export type Routes_Security_Runner_RoutePasskeyOptions_Principal = Shared_Principal;
export type Routes_Security_Runner_RoutePasskeyOptions_Configuration = Shared_WebauthnConfiguration;
export type Routes_Security_Runner_RoutePasskeyOptions_ExistingPasskeys = Lib_PasskeyAuth_PasskeyDescriptor[];
export type Routes_Security_Runner_RoutePasskeyOptions_Options = PublicKeyCredentialCreationOptionsJSON;
export type Routes_Security_Runner_RoutePasskeyOptions_CeremonyId = string;

export type Routes_Security_Runner_RoutePasskeyVerify_Request = express.Request;
export type Routes_Security_Runner_RoutePasskeyVerify_Response = express.Response;
export type Routes_Security_Runner_RoutePasskeyVerify_Returns = Promise<void>;
export type Routes_Security_Runner_RoutePasskeyVerify_RequestBody = ReturnType<typeof passkeyRegistrationVerify.safeParse>;
export type Routes_Security_Runner_RoutePasskeyVerify_Principal = Shared_Principal;
export type Routes_Security_Runner_RoutePasskeyVerify_Ceremony = Lib_PasskeyAuth_Ceremony | undefined;
export type Routes_Security_Runner_RoutePasskeyVerify_Configuration = Shared_WebauthnConfiguration;
export type Routes_Security_Runner_RoutePasskeyVerify_Credential = RegistrationResponseJSON;
export type Routes_Security_Runner_RoutePasskeyVerify_RegisteredCredential = Lib_PasskeyAuth_RegisteredCredential | undefined;
export type Routes_Security_Runner_RoutePasskeyVerify_Name = string;
export type Routes_Security_Runner_RoutePasskeyVerify_Result = 'conflict' | 'created';
export type Routes_Security_Runner_RoutePasskeyVerify_Security = Lib_PanelAuth_Security | undefined;
export type Routes_Security_Runner_RoutePasskeyVerify_Passkey = Lib_PanelAuth_SecurityPasskey | undefined;

export type Routes_Security_Runner_RouteRecoveryCodes_Request = express.Request;
export type Routes_Security_Runner_RouteRecoveryCodes_Response = express.Response;
export type Routes_Security_Runner_RouteRecoveryCodes_Returns = Promise<void>;
export type Routes_Security_Runner_RouteRecoveryCodes_RequestBody = ReturnType<typeof passwordConfirmation.safeParse>;
export type Routes_Security_Runner_RouteRecoveryCodes_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteRecoveryCodes_RecoveryCodes = string[] | undefined;

export type Routes_Security_Runner_RouteSecurity_Request = express.Request;
export type Routes_Security_Runner_RouteSecurity_Response = express.Response;
export type Routes_Security_Runner_RouteSecurity_Returns = Promise<void>;
export type Routes_Security_Runner_RouteSecurity_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteSecurity_Security = Lib_PanelAuth_Security | undefined;

export type Routes_Security_Runner_RouteTotpSetup_Request = express.Request;
export type Routes_Security_Runner_RouteTotpSetup_Response = express.Response;
export type Routes_Security_Runner_RouteTotpSetup_Returns = Promise<void>;
export type Routes_Security_Runner_RouteTotpSetup_RequestBody = ReturnType<typeof passwordConfirmation.safeParse>;
export type Routes_Security_Runner_RouteTotpSetup_Principal = Shared_Principal;
export type Routes_Security_Runner_RouteTotpSetup_TotpSecret = Lib_PanelAuth_TotpSecret;
export type Routes_Security_Runner_RouteTotpSetup_QrCode = string;
export type Routes_Security_Runner_RouteTotpSetup_ExpiresAt = string;
