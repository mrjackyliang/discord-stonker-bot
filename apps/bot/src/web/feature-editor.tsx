import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ApiError,
  errorMessage,
  getFeature,
  getResources,
  saveFeature,
  setFeatureEnabled,
} from '@/web/api.ts';
import { categoryLabels } from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { SchemaForm } from '@/web/schema-form.tsx';
import {
  clone,
  countChanges,
  defaultValue,
  pathKey,
  pointerPath,
  separateSecrets,
} from '@/web/schema.ts';
import { showToast } from '@/web/toast.ts';

import type { ReactElement } from 'react';

import type {
  Web_Api_ErrorIssue,
  Web_Api_FeatureDetail,
  Web_Api_FeatureSummary,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_FeatureEditor_Loaded,
  Web_Components_FeatureEditor_Props,
  Web_Components_SchemaForm_Context,
} from '@/types/web/components.d.ts';
import type {
  Web_Schema_Path,
  Web_Schema_Separated,
} from '@/types/web/schema.d.ts';

// issuePath turns an API issue path into the editor's path: configuration paths lose their
// first part, and secret pointers become the path of the secret field.

/**
 * Feature Editor - Issue path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const issuePath = (issue: Web_Api_ErrorIssue): Web_Schema_Path | null => {
  const [
    first,
    ...rest
  ] = issue['path'];

  if (first === 'configuration') {
    return rest;
  }

  if (first === 'secrets' && rest.length > 0) {
    return pointerPath((rest.join('/').startsWith('/')) ? rest.join('/') : `/${rest.join('/')}`);
  }

  return null;
};

/**
 * Feature Editor.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const FeatureEditor = ({
  canWrite,
  featureKey,
  onBack,
  onDirtyChange,
  onFeaturesChanged,
  server,
}: Web_Components_FeatureEditor_Props): ReactElement => {
  const [
    loaded,
    setLoaded,
  ] = useState<Web_Components_FeatureEditor_Loaded | null>(null);
  const [
    draft,
    setDraft,
  ] = useState<unknown>(null);
  const [
    loadError,
    setLoadError,
  ] = useState<string>('');
  const [
    saveError,
    setSaveError,
  ] = useState<string>('');
  const [
    issues,
    setIssues,
  ] = useState<Web_Api_ErrorIssue[]>([]);
  const [
    unmatchedIssues,
    setUnmatchedIssues,
  ] = useState<Web_Api_ErrorIssue[]>([]);
  const [
    conflict,
    setConflict,
  ] = useState<boolean>(false);
  const [
    saving,
    setSaving,
  ] = useState<boolean>(false);
  const [
    switching,
    setSwitching,
  ] = useState<boolean>(false);
  const [
    failedSaves,
    setFailedSaves,
  ] = useState<number>(0);
  const [
    formVersion,
    setFormVersion,
  ] = useState<number>(0);
  const shownPaths = useRef<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * Feature Editor - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const load = async (): Promise<void> => {
    setLoadError('');
    try {
      const [
        detail,
        resources,
      ] = await Promise.all([
        getFeature(server['id'], featureKey),
        getResources(server['id']),
      ]);

      setLoaded({
        detail,
        resources,
      });
      setDraft(clone(detail['configuration']));
      setIssues([]);
      setSaveError('');
      setConflict(false);
    } catch (caughtError) {
      setLoadError(errorMessage(caughtError, 'This feature could not be loaded.'));
    }
  };

  useEffect((): void => {
    setLoaded(null);
    void load();
  }, [
    featureKey,
    server['id'],
  ]);

  const changeCount: number = (loaded === null) ? 0 : countChanges(draft, loaded['detail']['configuration']);
  const dirty: boolean = changeCount > 0;

  // Leaving the page with unsaved changes asks first, like closing a document.
  useEffect((): (() => void) => {
    /**
     * Feature Editor - Warn.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 4.0.0
     */
    const warn = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
    };

    if (dirty) {
      window.addEventListener('beforeunload', warn);
    }

    return (): void => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect((): (() => void) => {
    onDirtyChange(dirty);

    return (): void => onDirtyChange(false);
  }, [
    dirty,
    onDirtyChange,
  ]);

  const issueMessages: Map<string, string> = new Map();

  for (const issue of issues) {
    const path: Web_Schema_Path | null = issuePath(issue);

    if (path !== null && !issueMessages.has(pathKey(path))) {
      issueMessages.set(pathKey(path), issue['message']);
    }
  }

  // Fields report which paths they show, so issues no field shows can be listed in the banner.
  shownPaths.current = new Set();

  useEffect((): void => {
    const unmatched: Web_Api_ErrorIssue[] = issues.filter((issue: Web_Api_ErrorIssue): boolean => {
      const path: Web_Schema_Path | null = issuePath(issue);

      return path === null || !shownPaths.current.has(pathKey(path));
    });

    if (JSON.stringify(unmatched) !== JSON.stringify(unmatchedIssues)) {
      setUnmatchedIssues(unmatched);
    }
  });

  // The save bar sits at the bottom, so a failed save brings its first error into view:
  // the first highlighted field, or the banner when no field shows one.
  useEffect((): void => {
    const section: HTMLElement | null = sectionRef.current;

    if (failedSaves === 0 || section === null) {
      return;
    }

    const target: HTMLElement | null = section.querySelector<HTMLElement>('[aria-invalid="true"], .field-error') ?? section.querySelector<HTMLElement>('[role="alert"]');

    if (target !== null) {
      target.scrollIntoView({ block: 'center' });
      target.focus({ preventScroll: true });
    }
  }, [failedSaves]);

  if (loaded === null) {
    return (
      <div className="detail-loading">
        {(loadError === '') ? (
          <>
            <span className="spinner" />
            Loading the feature…
          </>
        ) : (
          <>
            <span>{loadError}</span>
            <button className="text-button" onClick={onBack} type="button">Back to features</button>
          </>
        )}
      </div>
    );
  }

  const detail: Web_Api_FeatureDetail = loaded['detail'];
  const readOnly: boolean = !canWrite || saving;
  const context: Web_Components_SchemaForm_Context = {
    issueAt: (path: Web_Schema_Path): string => {
      // Issues about the whole form go in the banner, not under the last field.
      if (path.length === 0) {
        return '';
      }

      const key: string = pathKey(path);

      shownPaths.current.add(key);

      return issueMessages.get(key) ?? '';
    },
    readOnly,
    resources: loaded['resources'],
    root: detail['editor'],
    savedSecrets: detail['secrets'],
  };

  /**
   * Feature Editor - Replace draft.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const replaceDraft = (next: unknown): void => {
    setDraft(next);
  };

  // Discarding or saving redraws the form, so fields such as a secret being replaced
  // go back to how the stored settings show them.

  /**
   * Feature Editor - Discard.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const discard = (): void => {
    setDraft(clone(detail['configuration']));
    setFormVersion((version: number): number => version + 1);
    setIssues([]);
    setSaveError('');
  };

  /**
   * Feature Editor - Save.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const save = async (): Promise<void> => {
    const separated: Web_Schema_Separated = separateSecrets(draft);

    setSaving(true);
    setSaveError('');
    try {
      const saved: Web_Api_FeatureDetail = await saveFeature(server['id'], featureKey, {
        configuration: separated['configuration'],
        expectedRevision: detail['revision'],
        secrets: separated['secrets'],
      });

      setLoaded({
        ...loaded,
        detail: saved,
      });
      setDraft(clone(saved['configuration']));
      setFormVersion((version: number): number => version + 1);
      setIssues([]);
      showToast((saved['enabled']) ? 'Saved. The bot picks up the change within a few seconds.' : 'Saved.', true);
      onFeaturesChanged();
    } catch (caughtError) {
      // Field problems from an earlier try are cleared, so they can't hide the new message.
      if (caughtError instanceof ApiError && caughtError.code === 'revision_conflict') {
        setIssues([]);
        setConflict(true);
      } else if (caughtError instanceof ApiError && caughtError.issues.length > 0) {
        setIssues(caughtError.issues);
        setSaveError('Check the highlighted fields.');
      } else {
        setIssues([]);
        setSaveError(errorMessage(caughtError, 'The feature could not be saved. Try again.'));
      }

      setFailedSaves((count: number): number => count + 1);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Feature Editor - Toggle.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const toggle = async (): Promise<void> => {
    setSwitching(true);
    setSaveError('');
    try {
      const summary: Web_Api_FeatureSummary = await setFeatureEnabled(server['id'], featureKey, !detail['enabled']);

      setLoaded({
        ...loaded,
        detail: {
          ...detail,
          ...summary,
        },
      });
      showToast((summary['enabled']) ? `${detail['name']} is on.` : `${detail['name']} is off.`, true);
      onFeaturesChanged();
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.issues.length > 0) {
        setIssues(caughtError.issues);
      }

      setSaveError(errorMessage(caughtError, `${detail['name']} could not be switched. Try again.`));
    } finally {
      setSwitching(false);
    }
  };

  const notSetUp: boolean = draft === null || draft === undefined;
  const hasExample: boolean = detail['example'] !== null && detail['example'] !== undefined;

  return (
    <section className="workspace-section feature-editor" ref={sectionRef}>
      <div>
        <button className="text-button back-button" onClick={onBack} type="button">
          <Icon name="chevron-left" size={16} />
          Features
        </button>
      </div>

      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>{detail['name']}</h1>
          <p>{`${detail['description']} ${categoryLabels[detail['category']]} · ${server['name']}`}</p>
        </div>
        <div className="feature-editor-actions">
          <label className="switch-control" title={(detail['configured']) ? undefined : 'Set it up first'}>
            <input
              aria-label={`Turn ${detail['name']} ${(detail['enabled']) ? 'off' : 'on'}`}
              checked={detail['enabled']}
              disabled={!canWrite || switching || saving || (!detail['configured'] && !detail['enabled'])}
              onChange={(): void => {
                void toggle();
              }}
              type="checkbox"
            />
            <span className="switch-track"><span /></span>
            <span className="switch-label">{(detail['enabled']) ? 'On' : 'Off'}</span>
          </label>
        </div>
      </div>

      {(canWrite) ? null : (
        <p className="form-notice form-notice-info">
          <Icon name="shield" size={16} />
          <span>Your role can see this feature but not change it.</span>
        </p>
      )}

      {(conflict) ? (
        <div className="form-error" role="alert" tabIndex={-1}>
          <Icon name="warning" size={16} />
          <span>This feature changed since you opened it. Reload to see the latest version.</span>
          <button
            className="text-button"
            onClick={(): void => {
              void load();
            }}
            type="button"
          >
            Reload
          </button>
        </div>
      ) : null}

      {(saveError === '') ? null : (
        <div className="form-error" role="alert" tabIndex={-1}>
          <Icon name="warning" size={16} />
          <div className="form-error-body">
            <span>{saveError}</span>
            {(unmatchedIssues.length === 0) ? null : (
              <ul>
                {unmatchedIssues.map((issue: Web_Api_ErrorIssue): ReactElement => (
                  <li key={`${issue['field']}-${issue['message']}`}>
                    {(issue['field'] === '' || issue['field'] === 'configuration') ? issue['message'] : `${issue['field'].replace(/^configuration\./u, '')}: ${issue['message']}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {(notSetUp) ? (
        <div className="panel">
          <div className="empty-state">
            <span><Icon name="features" size={22} /></span>
            <h2>Not set up yet</h2>
            {(canWrite) ? (
              <>
                <p>{(hasExample) ? 'Start from the example settings and change what you need, or start with an empty form.' : 'Start with an empty form and fill in what this feature needs.'}</p>
                <div className="panel-actions">
                  {(hasExample) ? (
                    <Button onClick={(): void => replaceDraft(clone(detail['example']))} variant="primary">Start from the example</Button>
                  ) : null}
                  <Button onClick={(): void => replaceDraft(defaultValue(detail['editor'], detail['editor']))} variant={(hasExample) ? 'secondary' : 'primary'}>Start from scratch</Button>
                </div>
              </>
            ) : <p>Someone with the operator role or above can set it up.</p>}
          </div>
        </div>
      ) : (
        <SchemaForm context={context} key={formVersion} onChange={replaceDraft} schema={detail['editor']} value={draft} />
      )}

      {(dirty && canWrite) ? (
        <div aria-label="Unsaved changes" className="save-bar" role="region">
          <strong>{`${changeCount} unsaved ${(changeCount === 1) ? 'change' : 'changes'}`}</strong>
          <Button disabled={saving} onClick={discard}>Discard</Button>
          <Button
            disabled={saving || conflict}
            onClick={(): void => {
              void save();
            }}
            variant="primary"
          >
            {(saving) ? 'Saving…' : 'Save'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
