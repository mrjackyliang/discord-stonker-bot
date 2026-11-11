import {
  useEffect,
  useState,
} from 'react';

import {
  errorMessage,
  getFeatures,
  setFeatureEnabled,
} from '@/web/api.ts';
import { FeatureIcon } from '@/web/feature-icons.tsx';
import {
  categoryLabels,
  categoryOrder,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type { ReactElement } from 'react';

import type {
  Web_Api_FeatureCategory,
  Web_Api_FeatureSummary,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_FeatureFilter,
  Web_Components_FeatureFilterOption,
  Web_Components_FeaturesView_Props,
} from '@/types/web/components.d.ts';

/**
 * Features View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const FeaturesView = ({
  canWrite,
  onFeaturesChanged,
  onOpenFeature,
  server,
}: Web_Components_FeaturesView_Props): ReactElement => {
  const [
    features,
    setFeatures,
  ] = useState<Web_Api_FeatureSummary[] | null>(null);
  const [
    filter,
    setFilter,
  ] = useState<Web_Components_FeatureFilter>('all');
  const [
    switching,
    setSwitching,
  ] = useState<string>('');
  const [
    error,
    setError,
  ] = useState<string>('');

  /**
   * Features View - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const load = async (): Promise<void> => {
    setError('');
    try {
      setFeatures(await getFeatures(server['id']));
    } catch (caughtError) {
      setError(errorMessage(caughtError, 'The features could not be loaded.'));
    }
  };

  useEffect((): void => {
    setFeatures(null);
    setFilter('all');
    void load();
  }, [server['id']]);

  /**
   * Features View - Toggle.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const toggle = async (feature: Web_Api_FeatureSummary): Promise<void> => {
    setSwitching(feature['key']);
    setError('');
    try {
      const updated: Web_Api_FeatureSummary = await setFeatureEnabled(server['id'], feature['key'], !feature['enabled']);

      setFeatures((current: Web_Api_FeatureSummary[] | null): Web_Api_FeatureSummary[] | null => (
        (current === null) ? current : current.map((candidate: Web_Api_FeatureSummary): Web_Api_FeatureSummary => ((candidate['key'] === updated['key']) ? updated : candidate))
      ));
      onFeaturesChanged();
    } catch (caughtError) {
      setError(errorMessage(caughtError, `${feature['name']} could not be switched. Try again.`));
    } finally {
      setSwitching('');
    }
  };

  if (features === null) {
    return (
      <div className="detail-loading">
        {(error === '') ? (
          <>
            <span className="spinner" />
            Loading features…
          </>
        ) : error}
      </div>
    );
  }

  const options: Web_Components_FeatureFilterOption[] = [
    {
      id: 'all',
      label: 'All',
    },
    {
      id: 'on',
      label: 'On',
    },
    ...categoryOrder
      .filter((category: Web_Api_FeatureCategory): boolean => features.some((feature: Web_Api_FeatureSummary): boolean => feature['category'] === category))
      .map((category: Web_Api_FeatureCategory): Web_Components_FeatureFilterOption => ({
        id: category,
        label: categoryLabels[category],
      })),
  ];

  /**
   * Features View - Count for.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const countFor = (option: Web_Components_FeatureFilter): number => features.filter((feature: Web_Api_FeatureSummary): boolean => {
    if (option === 'all') {
      return true;
    }

    if (option === 'on') {
      return feature['enabled'];
    }

    return feature['category'] === option;
  }).length;

  const visible: Web_Api_FeatureSummary[] = features
    .filter((feature: Web_Api_FeatureSummary): boolean => {
      if (filter === 'all') {
        return true;
      }

      if (filter === 'on') {
        return feature['enabled'];
      }

      return feature['category'] === filter;
    })
    .sort((left: Web_Api_FeatureSummary, right: Web_Api_FeatureSummary): number => left['name'].localeCompare(right['name']));
  const enabledCount: number = countFor('on');

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Features</h1>
          <p>{`${enabledCount} of ${features.length} turned on in ${server['name']}. The bot picks up changes within a few seconds.`}</p>
        </div>
        <Button
          icon="refresh"
          onClick={(): void => {
            void load();
          }}
        >
          Refresh
        </Button>
      </div>

      {(error === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{error}</span>
        </div>
      )}

      <div aria-label="Filter features" className="status-chips" role="group">
        {options.map((option: Web_Components_FeatureFilterOption): ReactElement => (
          <button
            aria-pressed={filter === option['id']}
            className="chip"
            key={option['id']}
            onClick={(): void => setFilter(option['id'])}
            type="button"
          >
            {option['label']}
            <span className="chip-count">{countFor(option['id'])}</span>
          </button>
        ))}
      </div>

      {(visible.length === 0) ? (
        <div className="panel">
          <p className="select-list-empty">No features are turned on yet.</p>
        </div>
      ) : (
        <ul className="feature-grid">
          {visible.map((feature: Web_Api_FeatureSummary): ReactElement => (
            <li className={(feature['enabled']) ? 'feature-card feature-card-on' : 'feature-card'} key={feature['key']}>
              <div className="feature-card-top">
                <span aria-hidden="true" className="feature-card-icon">
                  <FeatureIcon featureKey={feature['key']} />
                </span>
                <label className="switch-control" title={(feature['configured']) ? undefined : 'Set it up first'}>
                  <input
                    aria-label={`Turn ${feature['name']} ${(feature['enabled']) ? 'off' : 'on'}`}
                    checked={feature['enabled']}
                    disabled={!canWrite || switching !== '' || (!feature['configured'] && !feature['enabled'])}
                    onChange={(): void => {
                      void toggle(feature);
                    }}
                    type="checkbox"
                  />
                  <span className="switch-track"><span /></span>
                </label>
              </div>
              <button className="feature-card-open" onClick={(): void => onOpenFeature(feature['key'])} type="button">
                <span className="feature-card-text">
                  <span className="feature-card-name">
                    <span>{feature['name']}</span>
                    {(feature['configured']) ? null : <span className="tag tag-warning">Not set up</span>}
                  </span>
                  <span className="feature-card-description">{feature['description']}</span>
                </span>
                <span className="feature-card-foot">
                  <span className="feature-card-category">{categoryLabels[feature['category']]}</span>
                  <span className="feature-card-action">
                    {(feature['configured']) ? 'Settings' : 'Set up'}
                    <Icon name="chevron" size={14} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
