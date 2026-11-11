import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  blankSecretReferences,
  collectSecretReferences,
  createSecretKey,
  isSecretReference,
  pointerToPath,
  readJsonPointer,
} from './feature-secrets.js';
import { LIB_REGEX_PATTERN_SECRET_KEY } from './regex.js';

import type {
  Lib_FeatureSecrets_Test_Configuration,
  Lib_FeatureSecrets_Test_SecretKey,
} from '../types/lib/feature-secrets.d.ts';

/**
 * Feature Secrets - Configuration.
 *
 * Holds two secret references, one with a key and one still empty, plus an escaped name.
 * Every test reads the same shape.
 *
 * @since 4.0.0
 */
const configuration: Lib_FeatureSecrets_Test_Configuration = {
  'invite-generator': {
    recaptcha: {
      'secret-key': {
        $secret: 'web-applications:1a2b3c4d5e6f7a8b',
      },
    },
  },
  'map-webhooks': [{
    'a/b~c': 'escaped',
    'signing-secret': {
      $secret: '',
    },
  }],
};

/**
 * Feature Secrets - Feature Secrets.
 *
 * Finds, empties, and addresses the secret references inside a feature configuration.
 * Pointers follow JSON Pointer escaping.
 *
 * @since 4.0.0
 */
describe('feature secrets', () => {
  it('collects every secret reference with its JSON pointer', () => {
    expect(collectSecretReferences(configuration)).toEqual([
      {
        key: 'web-applications:1a2b3c4d5e6f7a8b',
        pointer: '/invite-generator/recaptcha/secret-key',
      },
      {
        key: '',
        pointer: '/map-webhooks/0/signing-secret',
      },
    ]);

    expect(collectSecretReferences(null)).toEqual([]);

    return;
  });

  it('empties every secret reference in a copy', () => {
    const blank: Lib_FeatureSecrets_Test_Configuration = blankSecretReferences(configuration) as Lib_FeatureSecrets_Test_Configuration;

    expect(collectSecretReferences(blank).map((reference) => reference['key'])).toEqual([
      '',
      '',
    ]);

    expect(collectSecretReferences(configuration)[0]).toEqual(expect.objectContaining({
      key: 'web-applications:1a2b3c4d5e6f7a8b',
    }));

    return;
  });

  it('reads and splits JSON pointers', () => {
    expect(readJsonPointer(configuration, '/map-webhooks/0/a~1b~0c')).toBe('escaped');

    expect(pointerToPath('/map-webhooks/0/a~1b~0c')).toEqual([
      'map-webhooks',
      '0',
      'a/b~c',
    ]);

    expect(isSecretReference(readJsonPointer(configuration, '/map-webhooks/0/signing-secret'))).toBe(true);

    expect(isSecretReference(readJsonPointer(configuration, '/map-webhooks/0'))).toBe(false);

    expect(readJsonPointer(configuration, '/map-webhooks/00')).toBeUndefined();

    expect(readJsonPointer(configuration, '/map-webhooks/1')).toBeUndefined();

    expect(readJsonPointer(configuration, 'map-webhooks')).toBeUndefined();

    expect(readJsonPointer(configuration, '/toString')).toBeUndefined();

    return;
  });

  it('names each new secret after its feature with a random suffix', () => {
    const secretKey: Lib_FeatureSecrets_Test_SecretKey = createSecretKey('message-proxies');

    expect(secretKey.startsWith('message-proxies:')).toBe(true);

    expect(secretKey.slice('message-proxies:'.length)).toHaveLength(16);

    expect(LIB_REGEX_PATTERN_SECRET_KEY.test(secretKey)).toBe(true);

    expect(createSecretKey('message-proxies')).not.toBe(secretKey);

    return;
  });

  return;
});
