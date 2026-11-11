import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  flattenFeatureConfiguration,
  inflateFeatureConfiguration,
} from './feature-storage.js';

import type { Shared_JsonObject } from '../types/shared.d.ts';

describe('feature storage', () => {
  it('round trips nested objects, arrays, and scalar values', () => {
    const configuration: Shared_JsonObject = {
      enabled: true,
      emptyList: [],
      rules: [{
        channel: '1197999049811439729',
        count: 3,
        optional: null,
      }],
    };

    expect(inflateFeatureConfiguration(flattenFeatureConfiguration(configuration))).toEqual(configuration);

    return;
  });

  it('rejects values that cannot be represented as JSON', () => {
    expect(() => flattenFeatureConfiguration({ invalid: undefined })).toThrow(
      'Feature configuration contains a value that cannot be stored.',
    );

    return;
  });

  return;
});
