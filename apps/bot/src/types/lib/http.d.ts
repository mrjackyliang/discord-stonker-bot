import type { BlockList } from 'node:net';

import type express from 'express';
import type { ZodError } from 'zod';

import type {
  Shared_ErrorIssue,
  Shared_ErrorIssues,
  Shared_WebauthnConfiguration,
} from '../shared.d.ts';

export type Lib_Http_BuildCookie_Name = string;
export type Lib_Http_BuildCookie_Value = string;
export type Lib_Http_BuildCookie_Options_HttpOnly = boolean;
export type Lib_Http_BuildCookie_Options_MaxAge = number;
export type Lib_Http_BuildCookie_Options_Secure = boolean;
export type Lib_Http_BuildCookie_Options = {
  httpOnly: Lib_Http_BuildCookie_Options_HttpOnly;
  maxAge: Lib_Http_BuildCookie_Options_MaxAge;
  secure: Lib_Http_BuildCookie_Options_Secure;
};
export type Lib_Http_BuildCookie_Returns = string;

export type Lib_Http_CreateTrustedProxyRanges_Returns = BlockList;
export type Lib_Http_CreateTrustedProxyRanges_Ranges = BlockList;

export type Lib_Http_ExpandIpv6_Address = string;
export type Lib_Http_ExpandIpv6_Returns = number[];
export type Lib_Http_ExpandIpv6_Halves = string[];
export type Lib_Http_ExpandIpv6_Head = number[];
export type Lib_Http_ExpandIpv6_Tail = number[];

export type Lib_Http_GetClientAddress_Request = express.Request;
export type Lib_Http_GetClientAddress_Returns = string;
export type Lib_Http_GetClientAddress_Address = string | undefined;

export type Lib_Http_GetClientLimitKey_Request = express.Request;
export type Lib_Http_GetClientLimitKey_Returns = string;
export type Lib_Http_GetClientLimitKey_Address = string;

export type Lib_Http_GetRequestHost_Request = express.Request;
export type Lib_Http_GetRequestHost_Returns = string;
export type Lib_Http_GetRequestHost_ForwardedHost = string | undefined;
export type Lib_Http_GetRequestHost_Host = string;

export type Lib_Http_GetRequestHostname_Request = express.Request;
export type Lib_Http_GetRequestHostname_Returns = string;
export type Lib_Http_GetRequestHostname_Host = string;
export type Lib_Http_GetRequestHostname_PortIndex = number;

export type Lib_Http_GetRequestOrigin_Request = express.Request;
export type Lib_Http_GetRequestOrigin_Returns = string;

export type Lib_Http_GetRequestScheme_Request = express.Request;
export type Lib_Http_GetRequestScheme_Returns = 'http' | 'https';

export type Lib_Http_GetValidationIssues_Error = ZodError;
export type Lib_Http_GetValidationIssues_Returns = Shared_ErrorIssues;
export type Lib_Http_GetValidationIssues_Path = string[];

export type Lib_Http_GetWebauthnConfiguration_Request = express.Request;
export type Lib_Http_GetWebauthnConfiguration_RpName = string;
export type Lib_Http_GetWebauthnConfiguration_Returns = Shared_WebauthnConfiguration;

export type Lib_Http_HandleAsync_Request = express.Request;
export type Lib_Http_HandleAsync_Response = express.Response;
export type Lib_Http_HandleAsync_Next = express.NextFunction;
export type Lib_Http_HandleAsync_Handler = (request: Lib_Http_HandleAsync_Request, response: Lib_Http_HandleAsync_Response, next: Lib_Http_HandleAsync_Next) => Promise<void>;
export type Lib_Http_HandleAsync_Returns = express.RequestHandler;
export type Lib_Http_HandleAsync_CallbackReturns = void;

export type Lib_Http_Ipv6LimitPrefixLength = number;

export type Lib_Http_IsPasskeyAvailable_Request = express.Request;
export type Lib_Http_IsPasskeyAvailable_Returns = boolean;
export type Lib_Http_IsPasskeyAvailable_Hostname = string;
export type Lib_Http_IsPasskeyAvailable_UnbracketedHostname = string;

export type Lib_Http_IsTrustedProxyAddress_Address = string | undefined;
export type Lib_Http_IsTrustedProxyAddress_Returns = boolean;
export type Lib_Http_IsTrustedProxyAddress_NormalizedAddress = string;

export type Lib_Http_NormalizeAddress_Address = string;
export type Lib_Http_NormalizeAddress_Returns = string;
export type Lib_Http_NormalizeAddress_Unmapped = string;

export type Lib_Http_ReadCookie_Request = express.Request;
export type Lib_Http_ReadCookie_Name = string;
export type Lib_Http_ReadCookie_Returns = string | undefined;
export type Lib_Http_ReadCookie_CookieHeader = string | undefined;
export type Lib_Http_ReadCookie_CookiePrefix = string;
export type Lib_Http_ReadCookie_Match = string | undefined;

export type Lib_Http_SendError_Response = express.Response;
export type Lib_Http_SendError_Status = number;
export type Lib_Http_SendError_Code = string;
export type Lib_Http_SendError_Message = string;
export type Lib_Http_SendError_Issues = Shared_ErrorIssues;
export type Lib_Http_SendError_Returns = void;

export type Lib_Http_SendValidationError_Response = express.Response;
export type Lib_Http_SendValidationError_Status = number;
export type Lib_Http_SendValidationError_Error = ZodError;
export type Lib_Http_SendValidationError_Message = string;
export type Lib_Http_SendValidationError_Returns = void;
export type Lib_Http_SendValidationError_Issues = Shared_ErrorIssues;
export type Lib_Http_SendValidationError_FirstIssue = Shared_ErrorIssue | undefined;

export type Lib_Http_ToIpv6Groups_Part = string | undefined;
export type Lib_Http_ToIpv6Groups_Returns = number[];

export type Lib_Http_ToIpv6Network_Address = string;
export type Lib_Http_ToIpv6Network_PrefixLength = number;
export type Lib_Http_ToIpv6Network_Returns = string;
export type Lib_Http_ToIpv6Network_Network = number[];
export type Lib_Http_ToIpv6Network_KeptBits = number;
export type Lib_Http_ToIpv6Network_Hostname = string;

export type Lib_Http_TrustedProxyRanges = BlockList;
