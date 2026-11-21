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
import { configurationPrefixPattern } from '@/web/regex.js';
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

import type {
  Web_FeatureEditor_FeatureEditor_CanWrite,
  Web_FeatureEditor_FeatureEditor_ChangeCount,
  Web_FeatureEditor_FeatureEditor_ChangeWord,
  Web_FeatureEditor_FeatureEditor_Conflict,
  Web_FeatureEditor_FeatureEditor_ConflictState,
  Web_FeatureEditor_FeatureEditor_Context,
  Web_FeatureEditor_FeatureEditor_Detail,
  Web_FeatureEditor_FeatureEditor_Dirty,
  Web_FeatureEditor_FeatureEditor_Discard,
  Web_FeatureEditor_FeatureEditor_Discard_Returns,
  Web_FeatureEditor_FeatureEditor_Draft,
  Web_FeatureEditor_FeatureEditor_DraftState,
  Web_FeatureEditor_FeatureEditor_FailedSaves,
  Web_FeatureEditor_FeatureEditor_FailedSavesState,
  Web_FeatureEditor_FeatureEditor_FeatureKey,
  Web_FeatureEditor_FeatureEditor_FormVersion,
  Web_FeatureEditor_FeatureEditor_FormVersionState,
  Web_FeatureEditor_FeatureEditor_HasExample,
  Web_FeatureEditor_FeatureEditor_IssueMessages,
  Web_FeatureEditor_FeatureEditor_Issues,
  Web_FeatureEditor_FeatureEditor_IssuesState,
  Web_FeatureEditor_FeatureEditor_Key,
  Web_FeatureEditor_FeatureEditor_Load,
  Web_FeatureEditor_FeatureEditor_Load_Detail,
  Web_FeatureEditor_FeatureEditor_Load_Resources,
  Web_FeatureEditor_FeatureEditor_Load_Responses,
  Web_FeatureEditor_FeatureEditor_Load_Returns,
  Web_FeatureEditor_FeatureEditor_Loaded,
  Web_FeatureEditor_FeatureEditor_LoadedState,
  Web_FeatureEditor_FeatureEditor_LoadError,
  Web_FeatureEditor_FeatureEditor_LoadErrorState,
  Web_FeatureEditor_FeatureEditor_NextState,
  Web_FeatureEditor_FeatureEditor_NotSetUp,
  Web_FeatureEditor_FeatureEditor_OnBack,
  Web_FeatureEditor_FeatureEditor_OnDirtyChange,
  Web_FeatureEditor_FeatureEditor_OnFeaturesChanged,
  Web_FeatureEditor_FeatureEditor_Path,
  Web_FeatureEditor_FeatureEditor_Props,
  Web_FeatureEditor_FeatureEditor_ReadOnly,
  Web_FeatureEditor_FeatureEditor_ReplaceDraft,
  Web_FeatureEditor_FeatureEditor_ReplaceDraft_Next,
  Web_FeatureEditor_FeatureEditor_ReplaceDraft_Returns,
  Web_FeatureEditor_FeatureEditor_Returns,
  Web_FeatureEditor_FeatureEditor_Save,
  Web_FeatureEditor_FeatureEditor_Save_Returns,
  Web_FeatureEditor_FeatureEditor_Save_Saved,
  Web_FeatureEditor_FeatureEditor_Save_Separated,
  Web_FeatureEditor_FeatureEditor_SaveError,
  Web_FeatureEditor_FeatureEditor_SaveErrorState,
  Web_FeatureEditor_FeatureEditor_Saving,
  Web_FeatureEditor_FeatureEditor_SavingState,
  Web_FeatureEditor_FeatureEditor_Section,
  Web_FeatureEditor_FeatureEditor_SectionRef,
  Web_FeatureEditor_FeatureEditor_Server,
  Web_FeatureEditor_FeatureEditor_SetConflict,
  Web_FeatureEditor_FeatureEditor_SetDraft,
  Web_FeatureEditor_FeatureEditor_SetFailedSaves,
  Web_FeatureEditor_FeatureEditor_SetFormVersion,
  Web_FeatureEditor_FeatureEditor_SetIssues,
  Web_FeatureEditor_FeatureEditor_SetLoaded,
  Web_FeatureEditor_FeatureEditor_SetLoadError,
  Web_FeatureEditor_FeatureEditor_SetSaveError,
  Web_FeatureEditor_FeatureEditor_SetSaving,
  Web_FeatureEditor_FeatureEditor_SetSwitching,
  Web_FeatureEditor_FeatureEditor_SetUnmatchedIssues,
  Web_FeatureEditor_FeatureEditor_ShownPaths,
  Web_FeatureEditor_FeatureEditor_Switching,
  Web_FeatureEditor_FeatureEditor_SwitchingState,
  Web_FeatureEditor_FeatureEditor_Target,
  Web_FeatureEditor_FeatureEditor_Toggle,
  Web_FeatureEditor_FeatureEditor_Toggle_Returns,
  Web_FeatureEditor_FeatureEditor_Toggle_Summary,
  Web_FeatureEditor_FeatureEditor_Unmatched,
  Web_FeatureEditor_FeatureEditor_UnmatchedIssues,
  Web_FeatureEditor_FeatureEditor_UnmatchedIssuesState,
  Web_FeatureEditor_FeatureEditor_Warn,
  Web_FeatureEditor_FeatureEditor_Warn_Event,
  Web_FeatureEditor_FeatureEditor_Warn_Returns,
  Web_FeatureEditor_IssuePath_First,
  Web_FeatureEditor_IssuePath_Issue,
  Web_FeatureEditor_IssuePath_Joined,
  Web_FeatureEditor_IssuePath_Pointer,
  Web_FeatureEditor_IssuePath_Rest,
  Web_FeatureEditor_IssuePath_Returns,
  Web_FeatureEditor_IssuePath_Segments,
} from '@/types/web/feature-editor.d.ts';

// issuePath turns an API issue path into the editor's path: configuration paths lose their
// first part, and secret pointers become the path of the secret field.

/**
 * Feature Editor - Issue Path.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_FeatureEditor_IssuePath_Issue} issue - Issue.
 *
 * @returns {Web_FeatureEditor_IssuePath_Returns}
 *
 * @since 4.0.0
 */
const issuePath = (issue: Web_FeatureEditor_IssuePath_Issue): Web_FeatureEditor_IssuePath_Returns => {
  const segments: Web_FeatureEditor_IssuePath_Segments = issue['path'];
  const first: Web_FeatureEditor_IssuePath_First = segments[0];
  const rest: Web_FeatureEditor_IssuePath_Rest = segments.slice(1);

  if (first === 'configuration') {
    return rest;
  }

  if (first === 'secrets' && rest.length > 0) {
    const joined: Web_FeatureEditor_IssuePath_Joined = rest.join('/');
    const pointer: Web_FeatureEditor_IssuePath_Pointer = (joined.startsWith('/') === true) ? joined : `/${joined}`;

    return pointerPath(pointer);
  }

  return null;
};

/**
 * Feature Editor - Feature Editor.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_FeatureEditor_FeatureEditor_Props} props - Props.
 *
 * @returns {Web_FeatureEditor_FeatureEditor_Returns}
 *
 * @since 4.0.0
 */
export const FeatureEditor = (props: Web_FeatureEditor_FeatureEditor_Props): Web_FeatureEditor_FeatureEditor_Returns => {
  const canWrite: Web_FeatureEditor_FeatureEditor_CanWrite = props['canWrite'];
  const featureKey: Web_FeatureEditor_FeatureEditor_FeatureKey = props['featureKey'];
  const onBack: Web_FeatureEditor_FeatureEditor_OnBack = props['onBack'];
  const onDirtyChange: Web_FeatureEditor_FeatureEditor_OnDirtyChange = props['onDirtyChange'];
  const onFeaturesChanged: Web_FeatureEditor_FeatureEditor_OnFeaturesChanged = props['onFeaturesChanged'];
  const server: Web_FeatureEditor_FeatureEditor_Server = props['server'];
  const loadedState: Web_FeatureEditor_FeatureEditor_LoadedState = useState<Web_FeatureEditor_FeatureEditor_Loaded>(null);
  const loaded: Web_FeatureEditor_FeatureEditor_Loaded = loadedState[0];
  const setLoaded: Web_FeatureEditor_FeatureEditor_SetLoaded = loadedState[1];
  const draftState: Web_FeatureEditor_FeatureEditor_DraftState = useState<Web_FeatureEditor_FeatureEditor_Draft>(null);
  const draft: Web_FeatureEditor_FeatureEditor_Draft = draftState[0];
  const setDraft: Web_FeatureEditor_FeatureEditor_SetDraft = draftState[1];
  const loadErrorState: Web_FeatureEditor_FeatureEditor_LoadErrorState = useState<Web_FeatureEditor_FeatureEditor_LoadError>('');
  const loadError: Web_FeatureEditor_FeatureEditor_LoadError = loadErrorState[0];
  const setLoadError: Web_FeatureEditor_FeatureEditor_SetLoadError = loadErrorState[1];
  const saveErrorState: Web_FeatureEditor_FeatureEditor_SaveErrorState = useState<Web_FeatureEditor_FeatureEditor_SaveError>('');
  const saveError: Web_FeatureEditor_FeatureEditor_SaveError = saveErrorState[0];
  const setSaveError: Web_FeatureEditor_FeatureEditor_SetSaveError = saveErrorState[1];
  const issuesState: Web_FeatureEditor_FeatureEditor_IssuesState = useState<Web_FeatureEditor_FeatureEditor_Issues>([]);
  const issues: Web_FeatureEditor_FeatureEditor_Issues = issuesState[0];
  const setIssues: Web_FeatureEditor_FeatureEditor_SetIssues = issuesState[1];
  const unmatchedIssuesState: Web_FeatureEditor_FeatureEditor_UnmatchedIssuesState = useState<Web_FeatureEditor_FeatureEditor_UnmatchedIssues>([]);
  const unmatchedIssues: Web_FeatureEditor_FeatureEditor_UnmatchedIssues = unmatchedIssuesState[0];
  const setUnmatchedIssues: Web_FeatureEditor_FeatureEditor_SetUnmatchedIssues = unmatchedIssuesState[1];
  const conflictState: Web_FeatureEditor_FeatureEditor_ConflictState = useState<Web_FeatureEditor_FeatureEditor_Conflict>(false);
  const conflict: Web_FeatureEditor_FeatureEditor_Conflict = conflictState[0];
  const setConflict: Web_FeatureEditor_FeatureEditor_SetConflict = conflictState[1];
  const savingState: Web_FeatureEditor_FeatureEditor_SavingState = useState<Web_FeatureEditor_FeatureEditor_Saving>(false);
  const saving: Web_FeatureEditor_FeatureEditor_Saving = savingState[0];
  const setSaving: Web_FeatureEditor_FeatureEditor_SetSaving = savingState[1];
  const switchingState: Web_FeatureEditor_FeatureEditor_SwitchingState = useState<Web_FeatureEditor_FeatureEditor_Switching>(false);
  const switching: Web_FeatureEditor_FeatureEditor_Switching = switchingState[0];
  const setSwitching: Web_FeatureEditor_FeatureEditor_SetSwitching = switchingState[1];
  const failedSavesState: Web_FeatureEditor_FeatureEditor_FailedSavesState = useState<Web_FeatureEditor_FeatureEditor_FailedSaves>(0);
  const failedSaves: Web_FeatureEditor_FeatureEditor_FailedSaves = failedSavesState[0];
  const setFailedSaves: Web_FeatureEditor_FeatureEditor_SetFailedSaves = failedSavesState[1];
  const formVersionState: Web_FeatureEditor_FeatureEditor_FormVersionState = useState<Web_FeatureEditor_FeatureEditor_FormVersion>(0);
  const formVersion: Web_FeatureEditor_FeatureEditor_FormVersion = formVersionState[0];
  const setFormVersion: Web_FeatureEditor_FeatureEditor_SetFormVersion = formVersionState[1];
  const shownPaths: Web_FeatureEditor_FeatureEditor_ShownPaths = useRef<Set<string>>(new Set());
  const sectionRef: Web_FeatureEditor_FeatureEditor_SectionRef = useRef<HTMLElement>(null);

  /**
   * Feature Editor - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_FeatureEditor_FeatureEditor_Load_Returns}
   *
   * @since 4.0.0
   */
  const load: Web_FeatureEditor_FeatureEditor_Load = async (): Web_FeatureEditor_FeatureEditor_Load_Returns => {
    setLoadError('');

    try {
      const responses: Web_FeatureEditor_FeatureEditor_Load_Responses = await Promise.all([
        getFeature(server['id'], featureKey),
        getResources(server['id']),
      ]);
      const detail: Web_FeatureEditor_FeatureEditor_Load_Detail = responses[0];
      const resources: Web_FeatureEditor_FeatureEditor_Load_Resources = responses[1];

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

    return;
  };

  useEffect(() => {
    setLoaded(null);
    void load();

    return;
  }, [
    featureKey,
    server['id'],
  ]);

  const changeCount: Web_FeatureEditor_FeatureEditor_ChangeCount = (loaded === null) ? 0 : countChanges(draft, loaded['detail']['configuration']);
  const dirty: Web_FeatureEditor_FeatureEditor_Dirty = changeCount > 0;

  // Leaving the page with unsaved changes asks first, like closing a document.
  useEffect(() => {
    /**
     * Feature Editor - Warn.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @param {Web_FeatureEditor_FeatureEditor_Warn_Event} event - Event.
     *
     * @returns {Web_FeatureEditor_FeatureEditor_Warn_Returns}
     *
     * @since 4.0.0
     */
    const warn: Web_FeatureEditor_FeatureEditor_Warn = (event: Web_FeatureEditor_FeatureEditor_Warn_Event): Web_FeatureEditor_FeatureEditor_Warn_Returns => {
      event.preventDefault();

      return;
    };

    if (dirty === true) {
      window.addEventListener('beforeunload', warn);
    }

    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    onDirtyChange(dirty);

    return () => onDirtyChange(false);
  }, [
    dirty,
    onDirtyChange,
  ]);

  const issueMessages: Web_FeatureEditor_FeatureEditor_IssueMessages = new Map();

  for (const issue of issues) {
    const path: Web_FeatureEditor_FeatureEditor_Path = issuePath(issue);

    if (path !== null && issueMessages.has(pathKey(path)) === false) {
      issueMessages.set(pathKey(path), issue['message']);
    }
  }

  // Fields report which paths they show, so issues no field shows can be listed in the banner.
  shownPaths.current = new Set();

  useEffect(() => {
    const unmatched: Web_FeatureEditor_FeatureEditor_Unmatched = issues.filter((issue) => {
      const path: Web_FeatureEditor_FeatureEditor_Path = issuePath(issue);

      return path === null || shownPaths.current.has(pathKey(path)) === false;
    });

    if (JSON.stringify(unmatched) !== JSON.stringify(unmatchedIssues)) {
      setUnmatchedIssues(unmatched);
    }

    return;
  });

  // The save bar sits at the bottom, so a failed save brings its first error into view:
  // the first highlighted field, or the banner when no field shows one.
  useEffect(() => {
    const section: Web_FeatureEditor_FeatureEditor_Section = sectionRef.current;

    if (failedSaves === 0 || section === null) {
      return;
    }

    const target: Web_FeatureEditor_FeatureEditor_Target = section.querySelector<HTMLElement>('[aria-invalid="true"], .field-error') ?? section.querySelector<HTMLElement>('[role="alert"]');

    if (target !== null) {
      target.scrollIntoView({ block: 'center' });

      target.focus({ preventScroll: true });
    }

    return;
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

  const detail: Web_FeatureEditor_FeatureEditor_Detail = loaded['detail'];
  const readOnly: Web_FeatureEditor_FeatureEditor_ReadOnly = canWrite === false || saving === true;
  const context: Web_FeatureEditor_FeatureEditor_Context = {
    issueAt: (path) => {
      // Issues about the whole form go in the banner, not under the last field.
      if (path.length === 0) {
        return '';
      }

      const key: Web_FeatureEditor_FeatureEditor_Key = pathKey(path);

      shownPaths.current.add(key);

      return issueMessages.get(key) ?? '';
    },
    readOnly,
    resources: loaded['resources'],
    root: detail['editor'],
    savedSecrets: detail['secrets'],
  };

  /**
   * Feature Editor - Replace Draft.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_FeatureEditor_FeatureEditor_ReplaceDraft_Next} next - Next.
   *
   * @returns {Web_FeatureEditor_FeatureEditor_ReplaceDraft_Returns}
   *
   * @since 4.0.0
   */
  const replaceDraft: Web_FeatureEditor_FeatureEditor_ReplaceDraft = (next: Web_FeatureEditor_FeatureEditor_ReplaceDraft_Next): Web_FeatureEditor_FeatureEditor_ReplaceDraft_Returns => {
    setDraft(next);

    return;
  };

  // Discarding or saving redraws the form, so fields such as a secret being replaced
  // go back to how the stored settings show them.

  /**
   * Feature Editor - Discard.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_FeatureEditor_FeatureEditor_Discard_Returns}
   *
   * @since 4.0.0
   */
  const discard: Web_FeatureEditor_FeatureEditor_Discard = (): Web_FeatureEditor_FeatureEditor_Discard_Returns => {
    setDraft(clone(detail['configuration']));
    setFormVersion((version) => version + 1);
    setIssues([]);
    setSaveError('');

    return;
  };

  /**
   * Feature Editor - Save.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_FeatureEditor_FeatureEditor_Save_Returns}
   *
   * @since 4.0.0
   */
  const save: Web_FeatureEditor_FeatureEditor_Save = async (): Web_FeatureEditor_FeatureEditor_Save_Returns => {
    const separated: Web_FeatureEditor_FeatureEditor_Save_Separated = separateSecrets(draft);

    setSaving(true);
    setSaveError('');

    try {
      const saved: Web_FeatureEditor_FeatureEditor_Save_Saved = await saveFeature(server['id'], featureKey, {
        configuration: separated['configuration'],
        expectedRevision: detail['revision'],
        secrets: separated['secrets'],
      });

      setLoaded({
        ...loaded,
        detail: saved,
      });
      setDraft(clone(saved['configuration']));
      setFormVersion((version) => version + 1);
      setIssues([]);
      showToast((saved['enabled'] === true) ? 'Saved. The bot picks up the change within a few seconds.' : 'Saved.', true);
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

      setFailedSaves((count) => count + 1);
    } finally {
      setSaving(false);
    }

    return;
  };

  /**
   * Feature Editor - Toggle.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_FeatureEditor_FeatureEditor_Toggle_Returns}
   *
   * @since 4.0.0
   */
  const toggle: Web_FeatureEditor_FeatureEditor_Toggle = async (): Web_FeatureEditor_FeatureEditor_Toggle_Returns => {
    setSwitching(true);
    setSaveError('');

    try {
      const summary: Web_FeatureEditor_FeatureEditor_Toggle_Summary = await setFeatureEnabled(server['id'], featureKey, detail['enabled'] === false);

      setLoaded({
        ...loaded,
        detail: {
          ...detail,
          ...summary,
        },
      });
      showToast((summary['enabled'] === true) ? `${detail['name']} is on.` : `${detail['name']} is off.`, true);
      onFeaturesChanged();
    } catch (caughtError) {
      if (caughtError instanceof ApiError && caughtError.issues.length > 0) {
        setIssues(caughtError.issues);
      }

      setSaveError(errorMessage(caughtError, `${detail['name']} could not be switched. Try again.`));
    } finally {
      setSwitching(false);
    }

    return;
  };

  const notSetUp: Web_FeatureEditor_FeatureEditor_NotSetUp = draft === null || draft === undefined;
  const hasExample: Web_FeatureEditor_FeatureEditor_HasExample = detail['example'] !== null && detail['example'] !== undefined;
  const nextState: Web_FeatureEditor_FeatureEditor_NextState = (detail['enabled'] === true) ? 'off' : 'on';
  const changeWord: Web_FeatureEditor_FeatureEditor_ChangeWord = (changeCount === 1) ? 'change' : 'changes';

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
          <label className="switch-control" title={(detail['configured'] === true) ? undefined : 'Set it up first'}>
            <input
              aria-label={`Turn ${detail['name']} ${nextState}`}
              checked={detail['enabled']}
              disabled={(
                canWrite === false
                || switching === true
                || saving === true
                || (
                  detail['configured'] === false
                  && detail['enabled'] === false
                )
              )}
              onChange={() => {
                void toggle();

                return;
              }}
              type="checkbox"
            />
            <span className="switch-track"><span /></span>
            <span className="switch-label">{(detail['enabled'] === true) ? 'On' : 'Off'}</span>
          </label>
        </div>
      </div>

      {(canWrite === true) ? null : (
        <p className="form-notice form-notice-info">
          <Icon name="shield" size={16} />
          <span>Your role can see this feature but not change it.</span>
        </p>
      )}

      {(conflict === true) ? (
        <div className="form-error" role="alert" tabIndex={-1}>
          <Icon name="warning" size={16} />
          <span>This feature changed since you opened it. Reload to see the latest version.</span>
          <button
            className="text-button"
            onClick={() => {
              void load();

              return;
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
                {unmatchedIssues.map((issue) => (
                  <li key={`${issue['field']}-${issue['message']}`}>
                    {(issue['field'] === '' || issue['field'] === 'configuration') ? issue['message'] : `${issue['field'].replace(new RegExp(configurationPrefixPattern, 'u'), '')}: ${issue['message']}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {(notSetUp === true) ? (
        <div className="panel">
          <div className="empty-state">
            <span><Icon name="features" size={22} /></span>
            <h2>Not set up yet</h2>
            {(canWrite === true) ? (
              <>
                <p>{(hasExample === true) ? 'Start from the example settings and change what you need, or start with an empty form.' : 'Start with an empty form and fill in what this feature needs.'}</p>
                <div className="panel-actions">
                  {(hasExample === true) ? (
                    <Button onClick={() => replaceDraft(clone(detail['example']))} variant="primary">Start from the example</Button>
                  ) : null}
                  <Button onClick={() => replaceDraft(defaultValue(detail['editor'], detail['editor']))} variant={(hasExample === true) ? 'secondary' : 'primary'}>Start from scratch</Button>
                </div>
              </>
            ) : <p>Someone with the operator role or above can set it up.</p>}
          </div>
        </div>
      ) : (
        <SchemaForm context={context} key={formVersion} onChange={replaceDraft} schema={detail['editor']} value={draft} />
      )}

      {(dirty === true && canWrite === true) ? (
        <div aria-label="Unsaved changes" className="save-bar" role="region">
          <strong>{`${changeCount} unsaved ${changeWord}`}</strong>
          <Button disabled={saving} onClick={discard}>Discard</Button>
          <Button
            disabled={saving || conflict}
            onClick={() => {
              void save();

              return;
            }}
            variant="primary"
          >
            {(saving === true) ? 'Saving…' : 'Save'}
          </Button>
        </div>
      ) : null}
    </section>
  );
};
