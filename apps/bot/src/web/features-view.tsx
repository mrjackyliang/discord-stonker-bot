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

import type {
  Web_FeaturesView_FeaturesView_CanWrite,
  Web_FeaturesView_FeaturesView_CountFor,
  Web_FeaturesView_FeaturesView_CountFor_Option,
  Web_FeaturesView_FeaturesView_CountFor_Returns,
  Web_FeaturesView_FeaturesView_EnabledCount,
  Web_FeaturesView_FeaturesView_Error,
  Web_FeaturesView_FeaturesView_ErrorState,
  Web_FeaturesView_FeaturesView_Features,
  Web_FeaturesView_FeaturesView_FeaturesState,
  Web_FeaturesView_FeaturesView_Filter,
  Web_FeaturesView_FeaturesView_FilterState,
  Web_FeaturesView_FeaturesView_Load,
  Web_FeaturesView_FeaturesView_Load_Returns,
  Web_FeaturesView_FeaturesView_NextState,
  Web_FeaturesView_FeaturesView_OnFeaturesChanged,
  Web_FeaturesView_FeaturesView_OnOpenFeature,
  Web_FeaturesView_FeaturesView_Options,
  Web_FeaturesView_FeaturesView_Props,
  Web_FeaturesView_FeaturesView_Returns,
  Web_FeaturesView_FeaturesView_Server,
  Web_FeaturesView_FeaturesView_SetError,
  Web_FeaturesView_FeaturesView_SetFeatures,
  Web_FeaturesView_FeaturesView_SetFilter,
  Web_FeaturesView_FeaturesView_SetSwitching,
  Web_FeaturesView_FeaturesView_Switching,
  Web_FeaturesView_FeaturesView_SwitchingState,
  Web_FeaturesView_FeaturesView_Toggle,
  Web_FeaturesView_FeaturesView_Toggle_Feature,
  Web_FeaturesView_FeaturesView_Toggle_Returns,
  Web_FeaturesView_FeaturesView_Toggle_Updated,
  Web_FeaturesView_FeaturesView_Visible,
} from '@/types/web/features-view.d.ts';

/**
 * Features View - Features View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_FeaturesView_FeaturesView_Props} props - Props.
 *
 * @returns {Web_FeaturesView_FeaturesView_Returns}
 *
 * @since 4.0.0
 */
export const FeaturesView = (props: Web_FeaturesView_FeaturesView_Props): Web_FeaturesView_FeaturesView_Returns => {
  const canWrite: Web_FeaturesView_FeaturesView_CanWrite = props['canWrite'];
  const onFeaturesChanged: Web_FeaturesView_FeaturesView_OnFeaturesChanged = props['onFeaturesChanged'];
  const onOpenFeature: Web_FeaturesView_FeaturesView_OnOpenFeature = props['onOpenFeature'];
  const server: Web_FeaturesView_FeaturesView_Server = props['server'];
  const featuresState: Web_FeaturesView_FeaturesView_FeaturesState = useState<Web_FeaturesView_FeaturesView_Features>(null);
  const features: Web_FeaturesView_FeaturesView_Features = featuresState[0];
  const setFeatures: Web_FeaturesView_FeaturesView_SetFeatures = featuresState[1];
  const filterState: Web_FeaturesView_FeaturesView_FilterState = useState<Web_FeaturesView_FeaturesView_Filter>('all');
  const filter: Web_FeaturesView_FeaturesView_Filter = filterState[0];
  const setFilter: Web_FeaturesView_FeaturesView_SetFilter = filterState[1];
  const switchingState: Web_FeaturesView_FeaturesView_SwitchingState = useState<Web_FeaturesView_FeaturesView_Switching>('');
  const switching: Web_FeaturesView_FeaturesView_Switching = switchingState[0];
  const setSwitching: Web_FeaturesView_FeaturesView_SetSwitching = switchingState[1];
  const errorState: Web_FeaturesView_FeaturesView_ErrorState = useState<Web_FeaturesView_FeaturesView_Error>('');
  const error: Web_FeaturesView_FeaturesView_Error = errorState[0];
  const setError: Web_FeaturesView_FeaturesView_SetError = errorState[1];

  /**
   * Features View - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_FeaturesView_FeaturesView_Load_Returns}
   *
   * @since 4.0.0
   */
  const load: Web_FeaturesView_FeaturesView_Load = async (): Web_FeaturesView_FeaturesView_Load_Returns => {
    setError('');

    try {
      setFeatures(await getFeatures(server['id']));
    } catch (caughtError) {
      setError(errorMessage(caughtError, 'The features could not be loaded.'));
    }

    return;
  };

  useEffect(() => {
    setFeatures(null);
    setFilter('all');
    void load();

    return;
  }, [server['id']]);

  /**
   * Features View - Toggle.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_FeaturesView_FeaturesView_Toggle_Feature} feature - Feature.
   *
   * @returns {Web_FeaturesView_FeaturesView_Toggle_Returns}
   *
   * @since 4.0.0
   */
  const toggle: Web_FeaturesView_FeaturesView_Toggle = async (feature: Web_FeaturesView_FeaturesView_Toggle_Feature): Web_FeaturesView_FeaturesView_Toggle_Returns => {
    setSwitching(feature['key']);
    setError('');

    try {
      const updated: Web_FeaturesView_FeaturesView_Toggle_Updated = await setFeatureEnabled(server['id'], feature['key'], feature['enabled'] === false);

      setFeatures((current) => (
        (current === null) ? current : current.map((candidate) => ((candidate['key'] === updated['key']) ? updated : candidate))
      ));
      onFeaturesChanged();
    } catch (caughtError) {
      setError(errorMessage(caughtError, `${feature['name']} could not be switched. Try again.`));
    } finally {
      setSwitching('');
    }

    return;
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

  const options: Web_FeaturesView_FeaturesView_Options = [
    {
      id: 'all',
      label: 'All',
    },
    {
      id: 'on',
      label: 'On',
    },
    ...categoryOrder
      .filter((category) => features.some((feature) => feature['category'] === category))
      .map((category) => ({
        id: category,
        label: categoryLabels[category],
      })),
  ];

  /**
   * Features View - Count For.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_FeaturesView_FeaturesView_CountFor_Option} option - Option.
   *
   * @returns {Web_FeaturesView_FeaturesView_CountFor_Returns}
   *
   * @since 4.0.0
   */
  const countFor: Web_FeaturesView_FeaturesView_CountFor = (option: Web_FeaturesView_FeaturesView_CountFor_Option): Web_FeaturesView_FeaturesView_CountFor_Returns => features.filter((feature) => {
    if (option === 'all') {
      return true;
    }

    if (option === 'on') {
      return feature['enabled'];
    }

    return feature['category'] === option;
  }).length;

  const visible: Web_FeaturesView_FeaturesView_Visible = features
    .filter((feature) => {
      if (filter === 'all') {
        return true;
      }

      if (filter === 'on') {
        return feature['enabled'];
      }

      return feature['category'] === filter;
    })
    .sort((left, right) => left['name'].localeCompare(right['name']));
  const enabledCount: Web_FeaturesView_FeaturesView_EnabledCount = countFor('on');

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Features</h1>
          <p>{`${enabledCount} of ${features.length} turned on in ${server['name']}. The bot picks up changes within a few seconds.`}</p>
        </div>
        <Button
          icon="refresh"
          onClick={() => {
            void load();

            return;
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
        {options.map((option) => (
          <button
            aria-pressed={filter === option['id']}
            className="chip"
            key={option['id']}
            onClick={() => setFilter(option['id'])}
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
          {visible.map((feature) => {
            const nextState: Web_FeaturesView_FeaturesView_NextState = (feature['enabled'] === true) ? 'off' : 'on';

            return (
              <li className={(feature['enabled'] === true) ? 'feature-card feature-card-on' : 'feature-card'} key={feature['key']}>
                <div className="feature-card-top">
                  <span aria-hidden="true" className="feature-card-icon">
                    <FeatureIcon featureKey={feature['key']} />
                  </span>
                  <label className="switch-control" title={(feature['configured'] === true) ? undefined : 'Set it up first'}>
                    <input
                      aria-label={`Turn ${feature['name']} ${nextState}`}
                      checked={feature['enabled']}
                      disabled={(
                        canWrite === false
                        || switching !== ''
                        || (
                          feature['configured'] === false
                          && feature['enabled'] === false
                        )
                      )}
                      onChange={() => {
                        void toggle(feature);

                        return;
                      }}
                      type="checkbox"
                    />
                    <span className="switch-track"><span /></span>
                  </label>
                </div>
                <button className="feature-card-open" onClick={() => onOpenFeature(feature['key'])} type="button">
                  <span className="feature-card-text">
                    <span className="feature-card-name">
                      <span>{feature['name']}</span>
                      {(feature['configured'] === true) ? null : <span className="tag tag-warning">Not set up</span>}
                    </span>
                    <span className="feature-card-description">{feature['description']}</span>
                  </span>
                  <span className="feature-card-foot">
                    <span className="feature-card-category">{categoryLabels[feature['category']]}</span>
                    <span className="feature-card-action">
                      {(feature['configured'] === true) ? 'Settings' : 'Set up'}
                      <Icon name="chevron" size={14} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
