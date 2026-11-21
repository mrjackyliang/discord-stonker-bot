import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  errorMessage,
  getDiagnostics,
  getLogs,
  logStreamPath,
  parseLogEntry,
  updateDiagnostics,
} from '@/web/api.ts';
import { formatDate } from '@/web/format.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';

import type {
  Web_LogsView_ComponentOptions,
  Web_LogsView_ContextSummary_Context,
  Web_LogsView_ContextSummary_FormattedValue,
  Web_LogsView_ContextSummary_Key,
  Web_LogsView_ContextSummary_Returns,
  Web_LogsView_ContextSummary_Value,
  Web_LogsView_FormatTime_Date,
  Web_LogsView_FormatTime_Returns,
  Web_LogsView_FormatTime_Value,
  Web_LogsView_LevelOptions,
  Web_LogsView_LevelTags,
  Web_LogsView_LogsView_Active,
  Web_LogsView_LogsView_Cancelled,
  Web_LogsView_LogsView_CanChangeDebugLogging,
  Web_LogsView_LogsView_Component,
  Web_LogsView_LogsView_ComponentState,
  Web_LogsView_LogsView_Cursor,
  Web_LogsView_LogsView_CursorValue,
  Web_LogsView_LogsView_DebugLogging,
  Web_LogsView_LogsView_DebugLoggingState,
  Web_LogsView_LogsView_Entries,
  Web_LogsView_LogsView_EntriesState,
  Web_LogsView_LogsView_EntryOpen,
  Web_LogsView_LogsView_Error,
  Web_LogsView_LogsView_ErrorState,
  Web_LogsView_LogsView_Expanded,
  Web_LogsView_LogsView_ExpandedState,
  Web_LogsView_LogsView_Level,
  Web_LogsView_LogsView_LevelState,
  Web_LogsView_LogsView_LevelValue,
  Web_LogsView_LogsView_Load,
  Web_LogsView_LogsView_Load_Page,
  Web_LogsView_LogsView_Load_Returns,
  Web_LogsView_LogsView_Open,
  Web_LogsView_LogsView_Open_Log_Entry,
  Web_LogsView_LogsView_Open_Log_List,
  Web_LogsView_LogsView_Open_Log_ParsedValue,
  Web_LogsView_LogsView_Open_Returns,
  Web_LogsView_LogsView_Options,
  Web_LogsView_LogsView_Paused,
  Web_LogsView_LogsView_PausedState,
  Web_LogsView_LogsView_Props,
  Web_LogsView_LogsView_Query,
  Web_LogsView_LogsView_QueryState,
  Web_LogsView_LogsView_Reconnects,
  Web_LogsView_LogsView_ReconnectsState,
  Web_LogsView_LogsView_Returns,
  Web_LogsView_LogsView_SavingDebugLogging,
  Web_LogsView_LogsView_SavingDebugLoggingState,
  Web_LogsView_LogsView_SearchText,
  Web_LogsView_LogsView_SearchTextState,
  Web_LogsView_LogsView_SetComponent,
  Web_LogsView_LogsView_SetDebugLogging,
  Web_LogsView_LogsView_SetEntries,
  Web_LogsView_LogsView_SetError,
  Web_LogsView_LogsView_SetExpanded,
  Web_LogsView_LogsView_SetLevel,
  Web_LogsView_LogsView_SetPaused,
  Web_LogsView_LogsView_SetQuery,
  Web_LogsView_LogsView_SetReconnects,
  Web_LogsView_LogsView_SetSavingDebugLogging,
  Web_LogsView_LogsView_SetSearchText,
  Web_LogsView_LogsView_SetStreamState,
  Web_LogsView_LogsView_Source,
  Web_LogsView_LogsView_StreamState,
  Web_LogsView_LogsView_StreamStateState,
  Web_LogsView_LogsView_Summary,
  Web_LogsView_LogsView_Timer,
  Web_LogsView_LogsView_ToggleDebugLogging,
  Web_LogsView_LogsView_ToggleDebugLogging_Enabled,
  Web_LogsView_LogsView_ToggleDebugLogging_Previous,
  Web_LogsView_LogsView_ToggleDebugLogging_Returns,
  Web_LogsView_LogsView_ToggleDebugLogging_Saved,
  Web_LogsView_MaximumEntries,
  Web_LogsView_StreamLabels,
} from '@/types/web/logs-view.d.ts';

/**
 * Logs View - Component Options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const componentOptions: Web_LogsView_ComponentOptions = [
  {
    id: 'bot',
    label: 'Bot',
  },
  {
    id: 'web',
    label: 'Web',
  },
  {
    id: 'worker',
    label: 'Worker',
  },
];

/**
 * Logs View - Level Options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const levelOptions: Web_LogsView_LevelOptions = [
  {
    id: 'debug',
    label: 'Every level',
  },
  {
    id: 'info',
    label: 'Info and up',
  },
  {
    id: 'warn',
    label: 'Warnings and errors',
  },
  {
    id: 'error',
    label: 'Errors only',
  },
];

/**
 * Logs View - Level Tags.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const levelTags: Web_LogsView_LevelTags = {
  debug: 'tag log-level-debug',
  error: 'tag log-level-error',
  info: 'tag',
  warn: 'tag tag-warning',
};

/**
 * Logs View - Stream Labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const streamLabels: Web_LogsView_StreamLabels = {
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
  live: 'Live',
  paused: 'Paused',
};

// The list keeps the newest entries only, so a busy bot can't fill the browser's memory.

/**
 * Logs View - Maximum Entries.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const maximumEntries: Web_LogsView_MaximumEntries = 500;

// formatTime shows a log time with seconds, since entries often land in the same minute.

/**
 * Logs View - Format Time.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_LogsView_FormatTime_Value} value - Value.
 *
 * @returns {Web_LogsView_FormatTime_Returns}
 *
 * @since 4.0.0
 */
const formatTime = (value: Web_LogsView_FormatTime_Value): Web_LogsView_FormatTime_Returns => {
  const date: Web_LogsView_FormatTime_Date = new Date(value);

  return (Number.isNaN(date.getTime()) === true) ? value : new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

// contextSummary flattens a log entry's details into one readable line.

/**
 * Logs View - Context Summary.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_LogsView_ContextSummary_Context} context - Context.
 *
 * @returns {Web_LogsView_ContextSummary_Returns}
 *
 * @since 4.0.0
 */
const contextSummary = (context: Web_LogsView_ContextSummary_Context): Web_LogsView_ContextSummary_Returns => {
  return Object.entries(context)
    .map((contextEntry) => {
      const key: Web_LogsView_ContextSummary_Key = contextEntry[0];
      const value: Web_LogsView_ContextSummary_Value = contextEntry[1];
      const formattedValue: Web_LogsView_ContextSummary_FormattedValue = (typeof value === 'string') ? value : JSON.stringify(value);

      return `${key}=${formattedValue}`;
    })
    .join('  ');
};

/**
 * Logs View - Logs View.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_LogsView_LogsView_Props} props - Props.
 *
 * @returns {Web_LogsView_LogsView_Returns}
 *
 * @since 4.0.0
 */
export const LogsView = (props: Web_LogsView_LogsView_Props): Web_LogsView_LogsView_Returns => {
  const canChangeDebugLogging: Web_LogsView_LogsView_CanChangeDebugLogging = props['canChangeDebugLogging'];
  const debugLoggingState: Web_LogsView_LogsView_DebugLoggingState = useState<Web_LogsView_LogsView_DebugLogging>(null);
  const debugLogging: Web_LogsView_LogsView_DebugLogging = debugLoggingState[0];
  const setDebugLogging: Web_LogsView_LogsView_SetDebugLogging = debugLoggingState[1];
  const savingDebugLoggingState: Web_LogsView_LogsView_SavingDebugLoggingState = useState<Web_LogsView_LogsView_SavingDebugLogging>(false);
  const savingDebugLogging: Web_LogsView_LogsView_SavingDebugLogging = savingDebugLoggingState[0];
  const setSavingDebugLogging: Web_LogsView_LogsView_SetSavingDebugLogging = savingDebugLoggingState[1];
  const componentState: Web_LogsView_LogsView_ComponentState = useState<Web_LogsView_LogsView_Component>('bot');
  const component: Web_LogsView_LogsView_Component = componentState[0];
  const setComponent: Web_LogsView_LogsView_SetComponent = componentState[1];
  const levelState: Web_LogsView_LogsView_LevelState = useState<Web_LogsView_LogsView_Level>('debug');
  const level: Web_LogsView_LogsView_Level = levelState[0];
  const setLevel: Web_LogsView_LogsView_SetLevel = levelState[1];
  const searchTextState: Web_LogsView_LogsView_SearchTextState = useState<Web_LogsView_LogsView_SearchText>('');
  const searchText: Web_LogsView_LogsView_SearchText = searchTextState[0];
  const setSearchText: Web_LogsView_LogsView_SetSearchText = searchTextState[1];
  const queryState: Web_LogsView_LogsView_QueryState = useState<Web_LogsView_LogsView_Query>('');
  const query: Web_LogsView_LogsView_Query = queryState[0];
  const setQuery: Web_LogsView_LogsView_SetQuery = queryState[1];
  const entriesState: Web_LogsView_LogsView_EntriesState = useState<Web_LogsView_LogsView_Entries>(null);
  const entries: Web_LogsView_LogsView_Entries = entriesState[0];
  const setEntries: Web_LogsView_LogsView_SetEntries = entriesState[1];
  const errorState: Web_LogsView_LogsView_ErrorState = useState<Web_LogsView_LogsView_Error>('');
  const error: Web_LogsView_LogsView_Error = errorState[0];
  const setError: Web_LogsView_LogsView_SetError = errorState[1];
  const streamStateState: Web_LogsView_LogsView_StreamStateState = useState<Web_LogsView_LogsView_StreamState>('connecting');
  const streamState: Web_LogsView_LogsView_StreamState = streamStateState[0];
  const setStreamState: Web_LogsView_LogsView_SetStreamState = streamStateState[1];
  const pausedState: Web_LogsView_LogsView_PausedState = useState<Web_LogsView_LogsView_Paused>(false);
  const paused: Web_LogsView_LogsView_Paused = pausedState[0];
  const setPaused: Web_LogsView_LogsView_SetPaused = pausedState[1];
  const expandedState: Web_LogsView_LogsView_ExpandedState = useState<Web_LogsView_LogsView_Expanded>('');
  const expanded: Web_LogsView_LogsView_Expanded = expandedState[0];
  const setExpanded: Web_LogsView_LogsView_SetExpanded = expandedState[1];
  const reconnectsState: Web_LogsView_LogsView_ReconnectsState = useState<Web_LogsView_LogsView_Reconnects>(0);
  const reconnects: Web_LogsView_LogsView_Reconnects = reconnectsState[0];
  const setReconnects: Web_LogsView_LogsView_SetReconnects = reconnectsState[1];
  const cursor: Web_LogsView_LogsView_Cursor = useRef<Web_LogsView_LogsView_CursorValue>(null);

  useEffect(() => {
    let active: Web_LogsView_LogsView_Active = true;

    getDiagnostics().then((diagnostics) => {
      if (active === true) {
        setDebugLogging(diagnostics['debugLogging']);
      }

      return;
    }).catch((caughtError) => {
      if (active === true) {
        showToast(errorMessage(caughtError, 'Debug logging couldn\'t be loaded. Reload the page.'), false);
      }

      return;
    });

    return () => {
      active = false;

      return;
    };
  }, []);

  /**
   * Logs View - Toggle Debug Logging.
   *
   * Moves the switch at once, saves it, and shows what the server kept.
   * A failed save puts the switch back where it was.
   *
   * @param {Web_LogsView_LogsView_ToggleDebugLogging_Enabled} enabled - Enabled.
   *
   * @returns {Web_LogsView_LogsView_ToggleDebugLogging_Returns}
   *
   * @since 4.0.0
   */
  const toggleDebugLogging: Web_LogsView_LogsView_ToggleDebugLogging = async (enabled: Web_LogsView_LogsView_ToggleDebugLogging_Enabled): Web_LogsView_LogsView_ToggleDebugLogging_Returns => {
    const previous: Web_LogsView_LogsView_ToggleDebugLogging_Previous = debugLogging;

    setDebugLogging(enabled);
    setSavingDebugLogging(true);

    try {
      const saved: Web_LogsView_LogsView_ToggleDebugLogging_Saved = await updateDiagnostics({ debugLogging: enabled });

      setDebugLogging(saved['debugLogging']);
    } catch (caughtError) {
      setDebugLogging(previous);
      showToast(errorMessage(caughtError, 'Debug logging couldn\'t be changed. Try again.'), false);
    } finally {
      setSavingDebugLogging(false);
    }

    return;
  };

  // Typing in the search box waits a moment before asking the server again.
  useEffect(() => {
    const timer: Web_LogsView_LogsView_Timer = window.setTimeout(() => setQuery(searchText.trim()), 300);

    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    let source: Web_LogsView_LogsView_Source = null;
    let cancelled: Web_LogsView_LogsView_Cancelled = false;

    /**
     * Logs View - Open.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @returns {Web_LogsView_LogsView_Open_Returns}
     *
     * @since 4.0.0
     */
    const open: Web_LogsView_LogsView_Open = (): Web_LogsView_LogsView_Open_Returns => {
      if (paused === true) {
        setStreamState('paused');

        return;
      }

      setStreamState('connecting');
      source = new EventSource(logStreamPath({
        after: cursor.current ?? undefined,
        component,
        level,
        q: query,
      }));

      source.addEventListener('open', () => setStreamState('live'));
      source.addEventListener('error', () => {
        // EventSource retries on its own; once it gives up the stream stays closed.
        setStreamState((source !== null && source.readyState === EventSource.CLOSED) ? 'disconnected' : 'connecting');

        return;
      });
      source.addEventListener('log', (event) => {
        let parsedValue: Web_LogsView_LogsView_Open_Log_ParsedValue = undefined;

        try {
          parsedValue = JSON.parse(event.data);
        } catch {
          return;
        }

        const entry: Web_LogsView_LogsView_Open_Log_Entry = parseLogEntry(parsedValue);

        if (entry === null) {
          return;
        }

        cursor.current = entry['id'];
        setEntries((current) => {
          const list: Web_LogsView_LogsView_Open_Log_List = current ?? [];

          if (list.some((candidate) => candidate['id'] === entry['id']) === true) {
            return list;
          }

          return [
            entry,
            ...list,
          ].slice(0, maximumEntries);
        });

        return;
      });

      return;
    };

    /**
     * Logs View - Load.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @returns {Web_LogsView_LogsView_Load_Returns}
     *
     * @since 4.0.0
     */
    const load: Web_LogsView_LogsView_Load = async (): Web_LogsView_LogsView_Load_Returns => {
      setError('');
      try {
        const page: Web_LogsView_LogsView_Load_Page = await getLogs({
          component,
          level,
          q: query,
        });

        if (cancelled === true) {
          return;
        }

        cursor.current = page['cursor'];
        setEntries([...page['items']].reverse());
        open();
      } catch (caughtError) {
        if (cancelled === false) {
          setEntries([]);
          setStreamState('disconnected');
          setError(errorMessage(caughtError, 'The logs could not be loaded.'));
        }
      }

      return;
    };

    if (reconnects > 0 && entries !== null) {
      open();
    } else {
      setEntries(null);
      void load();
    }

    return () => {
      cancelled = true;

      if (source !== null) {
        source.close();
      }

      return;
    };
  }, [
    component,
    level,
    paused,
    query,
    reconnects,
  ]);

  const options: Web_LogsView_LogsView_Options = (
    <div className="logs-toolbar">
      <div aria-label="Log source" className="segmented logs-sources" role="group">
        {componentOptions.map((option) => (
          <button
            aria-pressed={component === option['id']}
            key={option['id']}
            onClick={() => {
              cursor.current = null;
              setReconnects(0);
              setComponent(option['id']);

              return;
            }}
            type="button"
          >
            {option['label']}
          </button>
        ))}
      </div>
      <select
        aria-label="Log level"
        className="select-control"
        onChange={(event) => {
          cursor.current = null;
          setReconnects(0);
          setLevel(event.currentTarget.value as Web_LogsView_LogsView_LevelValue);

          return;
        }}
        value={level}
      >
        {levelOptions.map((option) => <option key={option['id']} value={option['id']}>{option['label']}</option>)}
      </select>
      <label className="search-field logs-search">
        <Icon name="search" size={16} />
        <input
          aria-label="Search the logs"
          onChange={(event) => {
            cursor.current = null;
            setReconnects(0);
            setSearchText(event.currentTarget.value);

            return;
          }}
          placeholder="Search events and details"
          type="search"
          value={searchText}
        />
      </label>
    </div>
  );

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Logs</h1>
          <p>What the bot, the control panel, and the scheduled jobs wrote, newest first. Secrets are never logged.</p>
        </div>
        <div className="logs-live">
          <span className={`logs-stream logs-stream-${streamState}`}>
            <span className="status-dot" />
            {streamLabels[streamState]}
          </span>
          {(streamState === 'disconnected' && paused === false) ? (
            <Button
              icon="refresh"
              onClick={() => setReconnects(reconnects + 1)}
            >
              Reconnect
            </Button>
          ) : (
            <Button
              icon={(paused === true) ? 'play' : 'stop'}
              onClick={() => {
                setReconnects(reconnects + 1);
                setPaused(paused === false);

                return;
              }}
            >
              {(paused === true) ? 'Resume' : 'Pause'}
            </Button>
          )}
        </div>
      </div>

      <div className="panel">
        <section className="form-section">
          <div className="setting-list">
            <div className="setting-row">
              <div className="setting-copy">
                <div className="setting-title"><span>Debug logging</span></div>
                <p>Adds debug entries to these logs while you track down a problem.</p>
              </div>
              <div className="setting-control">
                <label className="switch-control">
                  <span className="switch-label">{(debugLogging === true) ? 'On' : 'Off'}</span>
                  <input
                    aria-label="Debug logging"
                    checked={debugLogging === true}
                    disabled={(
                      canChangeDebugLogging === false
                      || debugLogging === null
                      || savingDebugLogging === true
                    )}
                    onChange={(event) => {
                      void toggleDebugLogging(event.currentTarget.checked);

                      return;
                    }}
                    type="checkbox"
                  />
                  <span className="switch-track"><span /></span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>

      {options}

      {(error === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="panel">
        {(entries === null) ? (
          <div className="detail-loading">
            <span className="spinner" />
            Loading the logs…
          </div>
        ) : null}
        {(entries !== null && entries.length === 0) ? (
          <p className="select-list-empty">{(query === '' && level === 'debug') ? 'No log entries yet.' : 'No log entries match these filters.'}</p>
        ) : null}
        {(entries !== null && entries.length > 0) ? (
          <ol className="log-list">
            {entries.map((entry) => {
              const summary: Web_LogsView_LogsView_Summary = contextSummary(entry['context']);
              const entryOpen: Web_LogsView_LogsView_EntryOpen = expanded === entry['id'];

              return (
                <li className={(entryOpen === true) ? `log-row log-row-${entry['level']} log-row-open` : `log-row log-row-${entry['level']}`} key={entry['id']}>
                  <button
                    aria-expanded={(summary === '') ? undefined : entryOpen}
                    className="log-entry"
                    disabled={summary === ''}
                    onClick={() => setExpanded((entryOpen === true) ? '' : entry['id'])}
                    type="button"
                  >
                    <time dateTime={entry['occurredAt']} title={formatDate(entry['occurredAt'])}>{formatTime(entry['occurredAt'])}</time>
                    <span className={levelTags[entry['level']]}>{entry['level']}</span>
                    <span className="log-event">{entry['event']}</span>
                    {(summary === '' || entryOpen === true) ? null : <span className="log-context">{summary}</span>}
                  </button>
                  {(entryOpen === true) ? <pre className="log-details">{JSON.stringify(entry['context'], null, 2)}</pre> : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </section>
  );
};
