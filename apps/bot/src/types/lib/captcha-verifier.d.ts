import type { z } from 'zod';

export type Lib_CaptchaVerifier_MaximumProviderResponseCharacters = number;
export type Lib_CaptchaVerifier_ProviderTimeoutMilliseconds = number;
export type Lib_CaptchaVerifier_SiteVerifyUrl = string;

export type Lib_CaptchaVerifier_CaptchaResponse = {
  'error-codes'?: string[] | undefined;
  'hostname'?: string | undefined;
  'success': boolean;
};

export type Lib_CaptchaVerifier_ContentSecurityPolicySources_Connect = readonly string[];
export type Lib_CaptchaVerifier_ContentSecurityPolicySources_Frame = readonly string[];
export type Lib_CaptchaVerifier_ContentSecurityPolicySources_Script = readonly string[];
export type Lib_CaptchaVerifier_ContentSecurityPolicySources = {
  connect: Lib_CaptchaVerifier_ContentSecurityPolicySources_Connect;
  frame: Lib_CaptchaVerifier_ContentSecurityPolicySources_Frame;
  script: Lib_CaptchaVerifier_ContentSecurityPolicySources_Script;
};

export type Lib_CaptchaVerifier_Runner_GetContentSecurityPolicySources_Returns = Lib_CaptchaVerifier_ContentSecurityPolicySources;

export type Lib_CaptchaVerifier_Runner_Verify_Token = string;
export type Lib_CaptchaVerifier_Runner_Verify_Secret = string;
export type Lib_CaptchaVerifier_Runner_Verify_ExpectedHostname = string;
export type Lib_CaptchaVerifier_Runner_Verify_RemoteAddress = string;
export type Lib_CaptchaVerifier_Runner_Verify_Returns = Promise<boolean>;
export type Lib_CaptchaVerifier_Runner_Verify_Form = URLSearchParams;
export type Lib_CaptchaVerifier_Runner_Verify_Response = Response;
export type Lib_CaptchaVerifier_Runner_Verify_ResponseText = string;
export type Lib_CaptchaVerifier_Runner_Verify_ParsedJson = unknown;
export type Lib_CaptchaVerifier_Runner_Verify_Parsed = z.ZodSafeParseResult<Lib_CaptchaVerifier_CaptchaResponse>;
export type Lib_CaptchaVerifier_Runner_Verify_SolvedHostname = string | undefined;
