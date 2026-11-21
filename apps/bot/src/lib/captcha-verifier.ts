import { isIP } from 'node:net';

import { z } from 'zod';

import type {
  Lib_CaptchaVerifier_ContentSecurityPolicySources,
  Lib_CaptchaVerifier_MaximumProviderResponseCharacters,
  Lib_CaptchaVerifier_ProviderTimeoutMilliseconds,
  Lib_CaptchaVerifier_Runner_GetContentSecurityPolicySources_Returns,
  Lib_CaptchaVerifier_Runner_Verify_ExpectedHostname,
  Lib_CaptchaVerifier_Runner_Verify_Form,
  Lib_CaptchaVerifier_Runner_Verify_Parsed,
  Lib_CaptchaVerifier_Runner_Verify_ParsedJson,
  Lib_CaptchaVerifier_Runner_Verify_RemoteAddress,
  Lib_CaptchaVerifier_Runner_Verify_Response,
  Lib_CaptchaVerifier_Runner_Verify_ResponseText,
  Lib_CaptchaVerifier_Runner_Verify_Returns,
  Lib_CaptchaVerifier_Runner_Verify_Secret,
  Lib_CaptchaVerifier_Runner_Verify_SolvedHostname,
  Lib_CaptchaVerifier_Runner_Verify_Token,
  Lib_CaptchaVerifier_SiteVerifyUrl,
} from '../types/lib/captcha-verifier.d.ts';

/**
 * Captcha Verifier - Maximum Provider Response Characters.
 *
 * Bounds the fixed reCAPTCHA response before JSON parsing.
 * Provider error bodies are never forwarded to visitors or logs.
 *
 * @since 4.2.1
 */
const maximumProviderResponseCharacters: Lib_CaptchaVerifier_MaximumProviderResponseCharacters = 65_536;

/**
 * Captcha Verifier - Provider Timeout Milliseconds.
 *
 * Stops stalled verification without tying up the public listener.
 * This matches the existing invite verification deadline.
 *
 * @since 4.2.1
 */
const providerTimeoutMilliseconds: Lib_CaptchaVerifier_ProviderTimeoutMilliseconds = 8_000;

/**
 * Captcha Verifier - Site Verify URL.
 *
 * Keeps Google's server-side verification endpoint inside this adapter.
 * Callers supply only project data and never provider request details.
 *
 * @since 4.2.1
 */
const siteVerifyUrl: Lib_CaptchaVerifier_SiteVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

/**
 * Captcha Verifier - Content Security Policy Sources.
 *
 * Owns every Google source required by the browser challenge.
 * The invite route consumes these values without hard-coded provider hosts.
 *
 * @since 4.2.1
 */
const contentSecurityPolicySources: Lib_CaptchaVerifier_ContentSecurityPolicySources = {
  connect: ['https://www.google.com/recaptcha/'],
  frame: [
    'https://www.google.com/recaptcha/',
    'https://recaptcha.google.com/recaptcha/',
  ],
  script: [
    'https://www.google.com/recaptcha/',
    'https://www.gstatic.com/recaptcha/',
  ],
};

/**
 * Captcha Verifier - Captcha Response Schema.
 *
 * Narrows the provider response to its admission decision and solving host.
 * Unknown response fields stay outside the project contract.
 *
 * @since 4.2.1
 */
const captchaResponseSchema = z.object({
  'error-codes': z.array(z.string().max(100)).max(20).optional(),
  'hostname': z.string().max(253).optional(),
  'success': z.boolean(),
});

/**
 * Captcha Verifier.
 *
 * Owns the reCAPTCHA endpoint, request mapping, response validation, and
 * browser sources required by the public invite flow.
 *
 * @since 4.2.1
 */
export class Runner {
  /**
   * Captcha Verifier - Get Content Security Policy Sources.
   *
   * Returns the provider sources that the invite page must allow.
   * The shared arrays preserve the established policy ordering.
   *
   * @returns {Lib_CaptchaVerifier_Runner_GetContentSecurityPolicySources_Returns}
   *
   * @since 4.2.1
   */
  public static getContentSecurityPolicySources(): Lib_CaptchaVerifier_Runner_GetContentSecurityPolicySources_Returns {
    return contentSecurityPolicySources;
  }

  /**
   * Captcha Verifier - Verify.
   *
   * Exchanges one browser challenge and checks that its solving host matches.
   * Missing, oversized, malformed, unsuccessful, or foreign-host responses fail closed.
   *
   * @param {Lib_CaptchaVerifier_Runner_Verify_Token}            token            - Token.
   * @param {Lib_CaptchaVerifier_Runner_Verify_Secret}           secret           - Secret.
   * @param {Lib_CaptchaVerifier_Runner_Verify_ExpectedHostname} expectedHostname - Expected hostname.
   * @param {Lib_CaptchaVerifier_Runner_Verify_RemoteAddress}    [remoteAddress]  - Remote address.
   *
   * @returns {Lib_CaptchaVerifier_Runner_Verify_Returns}
   *
   * @since 4.2.1
   */
  public static async verify(
    token: Lib_CaptchaVerifier_Runner_Verify_Token,
    secret: Lib_CaptchaVerifier_Runner_Verify_Secret,
    expectedHostname: Lib_CaptchaVerifier_Runner_Verify_ExpectedHostname,
    remoteAddress?: Lib_CaptchaVerifier_Runner_Verify_RemoteAddress,
  ): Lib_CaptchaVerifier_Runner_Verify_Returns {
    if (token.trim() === '' || token.length > 4_096) {
      return false;
    }

    const form: Lib_CaptchaVerifier_Runner_Verify_Form = new URLSearchParams({
      response: token,
      secret,
    });

    if (remoteAddress !== undefined && isIP(remoteAddress) !== 0) {
      form.set('remoteip', remoteAddress);
    }

    const response: Lib_CaptchaVerifier_Runner_Verify_Response = await fetch(
      siteVerifyUrl,
      {
        body: form,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        signal: AbortSignal.timeout(providerTimeoutMilliseconds),
      },
    );
    const responseText: Lib_CaptchaVerifier_Runner_Verify_ResponseText = await response.text();

    if (
      response.ok === false
      || responseText.length > maximumProviderResponseCharacters
    ) {
      return false;
    }

    let parsedJson: Lib_CaptchaVerifier_Runner_Verify_ParsedJson = undefined;

    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      return false;
    }

    const parsed: Lib_CaptchaVerifier_Runner_Verify_Parsed = captchaResponseSchema.safeParse(parsedJson);

    if (parsed['success'] === false || parsed['data']['success'] === false) {
      return false;
    }

    const solvedHostname: Lib_CaptchaVerifier_Runner_Verify_SolvedHostname = parsed['data']['hostname'];

    return (
      solvedHostname === undefined
      || solvedHostname.toLowerCase() === expectedHostname.toLowerCase()
    );
  }
}
