import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/server';
import type express from 'express';

import type {
  passkeySignInVerify,
  setupClaim,
  signIn,
  signInSecondFactor,
} from '../../lib/account-schemas.js';
import type {
  Lib_PanelAuth_Account,
  Lib_PanelAuth_AuthenticatedUser,
  Lib_PanelAuth_SignInChallenge,
} from '../lib/panel-auth.d.ts';
import type { Lib_PanelSetup_SetupStatus } from '../lib/panel-setup.d.ts';
import type {
  Lib_PasskeyAuth_AuthenticationUsage,
  Lib_PasskeyAuth_Ceremony,
  Lib_PasskeyAuth_StoredPasskey,
} from '../lib/passkey-auth.d.ts';
import type {
  Server_Access,
  Server_Attempts,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_PanelPermission,
  Shared_Principal,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

export type Routes_Auth_Permissions = Shared_PanelPermission[];
export type Routes_Auth_RpName = string;

export type Routes_Auth_Runner_Access = Server_Access;
export type Routes_Auth_Runner_Attempts = Server_Attempts;
export type Routes_Auth_Runner_Context = Server_Context;

export type Routes_Auth_Runner_Constructor_Context = Server_Context;
export type Routes_Auth_Runner_Constructor_Access = Server_Access;
export type Routes_Auth_Runner_Constructor_Attempts = Server_Attempts;

export type Routes_Auth_Runner_Register_App = express.Express;
export type Routes_Auth_Runner_Register_Returns = void;

export type Routes_Auth_Runner_IsRateLimited_Response = express.Response;
export type Routes_Auth_Runner_IsRateLimited_Key = string;
export type Routes_Auth_Runner_IsRateLimited_Message = string;
export type Routes_Auth_Runner_IsRateLimited_Returns = boolean;

export type Routes_Auth_Runner_RejectPasskey_Response = express.Response;
export type Routes_Auth_Runner_RejectPasskey_Key = string;
export type Routes_Auth_Runner_RejectPasskey_Message = string;
export type Routes_Auth_Runner_RejectPasskey_Returns = void;

export type Routes_Auth_Runner_RouteClaim_Request = express.Request;
export type Routes_Auth_Runner_RouteClaim_Response = express.Response;
export type Routes_Auth_Runner_RouteClaim_Returns = Promise<void>;
export type Routes_Auth_Runner_RouteClaim_AttemptKey = string;
export type Routes_Auth_Runner_RouteClaim_Status = Lib_PanelSetup_SetupStatus;
export type Routes_Auth_Runner_RouteClaim_RequestBody = ReturnType<typeof setupClaim.safeParse>;
export type Routes_Auth_Runner_RouteClaim_Result = Lib_PanelAuth_Account | 'invalid' | 'unavailable';

export type Routes_Auth_Runner_RouteCurrentPrincipal_Request = express.Request;
export type Routes_Auth_Runner_RouteCurrentPrincipal_Response = express.Response;
export type Routes_Auth_Runner_RouteCurrentPrincipal_Returns = Promise<void>;
export type Routes_Auth_Runner_RouteCurrentPrincipal_Principal = Shared_Principal;

export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Request = express.Request;
export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Response = express.Response;
export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Returns = Promise<void>;
export type Routes_Auth_Runner_RouteDismissRemovedSecrets_Principal = Shared_Principal;

export type Routes_Auth_Runner_RouteLogin_Request = express.Request;
export type Routes_Auth_Runner_RouteLogin_Response = express.Response;
export type Routes_Auth_Runner_RouteLogin_Returns = Promise<void>;
export type Routes_Auth_Runner_RouteLogin_AttemptKey = string;
export type Routes_Auth_Runner_RouteLogin_RequestBody = ReturnType<typeof signIn.safeParse>;
export type Routes_Auth_Runner_RouteLogin_IsOverlong = boolean;
export type Routes_Auth_Runner_RouteLogin_User = Lib_PanelAuth_AuthenticatedUser | undefined;
export type Routes_Auth_Runner_RouteLogin_Challenge = Lib_PanelAuth_SignInChallenge;

export type Routes_Auth_Runner_RouteLogout_Request = express.Request;
export type Routes_Auth_Runner_RouteLogout_Response = express.Response;
export type Routes_Auth_Runner_RouteLogout_Returns = Promise<void>;
export type Routes_Auth_Runner_RouteLogout_Principal = Shared_Principal;

export type Routes_Auth_Runner_RoutePasskeyOptions_Request = express.Request;
export type Routes_Auth_Runner_RoutePasskeyOptions_Response = express.Response;
export type Routes_Auth_Runner_RoutePasskeyOptions_Returns = Promise<void>;
export type Routes_Auth_Runner_RoutePasskeyOptions_Configuration = Shared_WebauthnConfiguration;
export type Routes_Auth_Runner_RoutePasskeyOptions_Options = PublicKeyCredentialRequestOptionsJSON;
export type Routes_Auth_Runner_RoutePasskeyOptions_CeremonyId = string;

export type Routes_Auth_Runner_RoutePasskeyVerify_Request = express.Request;
export type Routes_Auth_Runner_RoutePasskeyVerify_Response = express.Response;
export type Routes_Auth_Runner_RoutePasskeyVerify_Returns = Promise<void>;
export type Routes_Auth_Runner_RoutePasskeyVerify_AttemptKey = string;
export type Routes_Auth_Runner_RoutePasskeyVerify_RequestBody = ReturnType<typeof passkeySignInVerify.safeParse>;
export type Routes_Auth_Runner_RoutePasskeyVerify_Ceremony = Lib_PasskeyAuth_Ceremony | undefined;
export type Routes_Auth_Runner_RoutePasskeyVerify_Configuration = Shared_WebauthnConfiguration;
export type Routes_Auth_Runner_RoutePasskeyVerify_Credential = AuthenticationResponseJSON;
export type Routes_Auth_Runner_RoutePasskeyVerify_Passkey = Lib_PasskeyAuth_StoredPasskey | undefined;
export type Routes_Auth_Runner_RoutePasskeyVerify_Usage = Lib_PasskeyAuth_AuthenticationUsage | undefined;
export type Routes_Auth_Runner_RoutePasskeyVerify_Updated = boolean;
export type Routes_Auth_Runner_RoutePasskeyVerify_Account = Lib_PanelAuth_Account | undefined;

export type Routes_Auth_Runner_RouteSecondFactor_Request = express.Request;
export type Routes_Auth_Runner_RouteSecondFactor_Response = express.Response;
export type Routes_Auth_Runner_RouteSecondFactor_Returns = Promise<void>;
export type Routes_Auth_Runner_RouteSecondFactor_AttemptKey = string;
export type Routes_Auth_Runner_RouteSecondFactor_RequestBody = ReturnType<typeof signInSecondFactor.safeParse>;
export type Routes_Auth_Runner_RouteSecondFactor_UserId = string | undefined;
export type Routes_Auth_Runner_RouteSecondFactor_IsTotpCode = boolean;
export type Routes_Auth_Runner_RouteSecondFactor_IsOverlong = boolean;
export type Routes_Auth_Runner_RouteSecondFactor_IsValid = boolean;
export type Routes_Auth_Runner_RouteSecondFactor_IsExhausted = boolean;
export type Routes_Auth_Runner_RouteSecondFactor_Account = Lib_PanelAuth_Account | undefined;

export type Routes_Auth_Runner_RouteSetupStatus_Request = express.Request;
export type Routes_Auth_Runner_RouteSetupStatus_Response = express.Response;
export type Routes_Auth_Runner_RouteSetupStatus_Returns = Promise<void>;
