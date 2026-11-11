import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { getFeatureCatalog } from '../../lib/feature-catalog.js';

import type {
  Tests_Web_FeatureIcons_Drawn,
  Tests_Web_FeatureIcons_Fallback,
  Tests_Web_FeatureIcons_Markup,
  Tests_Web_FeatureIcons_Module,
} from '@/types/tests/web/feature-icons.test.d.ts';

describe('feature icons', () => {
  it('gives every catalog feature its own Lucide icon', async () => {
    const iconModule: Tests_Web_FeatureIcons_Module = await vi.importActual<Tests_Web_FeatureIcons_Module>('../../web/feature-icons.js');
    const fallback: Tests_Web_FeatureIcons_Fallback = renderToStaticMarkup(createElement(iconModule['FeatureIcon'], { featureKey: 'not-a-feature' }));
    const drawn: Tests_Web_FeatureIcons_Drawn = new Set();

    for (const feature of getFeatureCatalog()) {
      const markup: Tests_Web_FeatureIcons_Markup = renderToStaticMarkup(createElement(iconModule['FeatureIcon'], { featureKey: feature['key'] }));

      expect(markup).toContain('viewBox="0 0 24 24"');

      expect(markup).toContain('stroke="currentColor"');

      expect(markup).not.toBe(fallback);

      drawn.add(markup);
    }

    expect(drawn.size).toBe(getFeatureCatalog().length);

    return;
  });

  return;
});
