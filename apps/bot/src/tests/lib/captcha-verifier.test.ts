import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Runner as CaptchaVerifier } from '../../lib/captcha-verifier.js';

import type {
  Tests_Lib_CaptchaVerifier_Fetch,
  Tests_Lib_CaptchaVerifier_Form,
  Tests_Lib_CaptchaVerifier_RequestInit,
  Tests_Lib_CaptchaVerifier_Verified,
} from '../../types/tests/lib/captcha-verifier.test.d.ts';

/**
 * Captcha Verifier - Captcha Verifier Adapter Boundary.
 *
 * Verifies provider URL, form, response, hostname, and browser-source mapping.
 * Every provider response is local and no network request is made.
 *
 * @since 4.2.1
 */
describe('captcha verifier adapter boundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();

    return;
  });

  it('owns the reCAPTCHA request and browser policy sources', async () => {
    const fetchMock: Tests_Lib_CaptchaVerifier_Fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({
      hostname: 'invite.example.com',
      success: true,
    }));
    const verified: Tests_Lib_CaptchaVerifier_Verified = await CaptchaVerifier.verify(
      'browser-token',
      'server-secret',
      'invite.example.com',
      '203.0.113.10',
    );

    expect(verified).toBe(true);

    expect(fetchMock).toHaveBeenCalledWith('https://www.google.com/recaptcha/api/siteverify', {
      body: expect.any(URLSearchParams),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      signal: expect.any(AbortSignal),
    });

    const requestInit: Tests_Lib_CaptchaVerifier_RequestInit = Reflect.get(
      Object(fetchMock['mock']['calls'][0]),
      '1',
    ) as Tests_Lib_CaptchaVerifier_RequestInit;
    const form: Tests_Lib_CaptchaVerifier_Form = String(requestInit['body']);

    expect(form).toContain('response=browser-token');

    expect(form).toContain('secret=server-secret');

    expect(form).toContain('remoteip=203.0.113.10');

    expect(CaptchaVerifier.getContentSecurityPolicySources()).toEqual({
      connect: ['https://www.google.com/recaptcha/'],
      frame: [
        'https://www.google.com/recaptcha/',
        'https://recaptcha.google.com/recaptcha/',
      ],
      script: [
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',
      ],
    });

    return;
  });

  it('fails closed for a response solved on another hostname', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({
      hostname: 'foreign.example.com',
      success: true,
    }));

    expect(await CaptchaVerifier.verify(
      'browser-token',
      'server-secret',
      'invite.example.com',
    )).toBe(false);

    return;
  });

  it('fails closed for malformed provider responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('not-json'));

    expect(await CaptchaVerifier.verify(
      'browser-token',
      'server-secret',
      'invite.example.com',
    )).toBe(false);

    return;
  });

  return;
});
