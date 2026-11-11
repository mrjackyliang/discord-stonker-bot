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
  ChangeEvent,
  ReactElement,
} from 'react';

import type {
  Web_Api_Diagnostics,
  Web_Api_LogEntry,
  Web_Api_LogLevel,
  Web_Api_LogPage,
  Web_Api_ServiceComponent,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_LogComponentOption,
  Web_Components_LogLevelOption,
  Web_Components_LogStreamState,
  Web_Components_LogsView_Props,
} from '@/types/web/components.d.ts';

/**
 * Logs View - Component options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const componentOptions: Web_Components_LogComponentOption[] = [
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
 * Logs View - Level options.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const levelOptions: Web_Components_LogLevelOption[] = [
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
 * Logs View - Level tags.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const levelTags: Record<Web_Api_LogLevel, string> = {
  debug: 'tag log-level-debug',
  error: 'tag log-level-error',
  info: 'tag',
  warn: 'tag tag-warning',
};

/**
 * Logs View - Stream labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const streamLabels: Record<Web_Components_LogStreamState, string> = {
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
  live: 'Live',
  paused: 'Paused',
};

// The list keeps the newest entries only, so a busy bot can't fill the browser's memory.

/**
 * Logs View - Maximum entries.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const maximumEntries: number = 500;

// formatTime shows a log time with seconds, since entries often land in the same minute.

/**
 * Logs View - Formats time.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const formatTime = (value: string): string => {
  const date: Date = new Date(value);

  return (Number.isNaN(date.getTime())) ? value : new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

// contextSummary flattens a log entry's details into one readable line.

/**
 * Logs View - Context summary.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const contextSummary = (context: Record<string, unknown>): string => Object.entries(context)
  .map(([
    key,
    value,
  ]: [string, unknown,
  ]): string => `${key}=${(typeof value === 'string') ? value : JSON.stringify(value)}`)
  .join('  ');

/**
 * Logs View.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const LogsView = ({ canChangeDebugLogging }: Web_Components_LogsView_Props): ReactElement => {
  const [
    debugLogging,
    setDebugLogging,
  ] = useState<boolean | null>(null);
  const [
    savingDebugLogging,
    setSavingDebugLogging,
  ] = useState<boolean>(false);
  const [
    component,
    setComponent,
  ] = useState<Web_Api_ServiceComponent>('bot');
  const [
    level,
    setLevel,
  ] = useState<Web_Api_LogLevel>('debug');
  const [
    searchText,
    setSearchText,
  ] = useState<string>('');
  const [
    query,
    setQuery,
  ] = useState<string>('');
  const [
    entries,
    setEntries,
  ] = useState<Web_Api_LogEntry[] | null>(null);
  const [
    error,
    setError,
  ] = useState<string>('');
  const [
    streamState,
    setStreamState,
  ] = useState<Web_Components_LogStreamState>('connecting');
  const [
    paused,
    setPaused,
  ] = useState<boolean>(false);
  const [
    expanded,
    setExpanded,
  ] = useState<string>('');
  const [
    reconnects,
    setReconnects,
  ] = useState<number>(0);
  const cursor = useRef<string | null>(null);

  useEffect((): (() => void) => {
    let active: boolean = true;

    getDiagnostics().then((diagnostics: Web_Api_Diagnostics): void => {
      if (active) {
        setDebugLogging(diagnostics['debugLogging']);
      }
    }).catch((caughtError: unknown): void => {
      if (active) {
        showToast(errorMessage(caughtError, 'Debug logging couldn\'t be loaded. Reload the page.'), false);
      }
    });

    return (): void => {
      active = false;
    };
  }, []);

  /**
   * Logs View - Toggle debug logging.
   *
   * Moves the switch at once, saves it, and shows what the server kept.
   * A failed save puts the switch back where it was.
   *
   * @since UNRELEASED
   */
  const toggleDebugLogging = async (enabled: boolean): Promise<void> => {
    const previous: boolean | null = debugLogging;

    setDebugLogging(enabled);
    setSavingDebugLogging(true);

    try {
      const saved: Web_Api_Diagnostics = await updateDiagnostics({ debugLogging: enabled });

      setDebugLogging(saved['debugLogging']);
    } catch (caughtError) {
      setDebugLogging(previous);
      showToast(errorMessage(caughtError, 'Debug logging couldn\'t be changed. Try again.'), false);
    } finally {
      setSavingDebugLogging(false);
    }
  };

  // Typing in the search box waits a moment before asking the server again.
  useEffect((): (() => void) => {
    const timer: number = window.setTimeout((): void => setQuery(searchText.trim()), 300);

    return (): void => window.clearTimeout(timer);
  }, [searchText]);

  useEffect((): (() => void) => {
    let source: EventSource | null = null;
    let cancelled: boolean = false;

    /**
     * Logs View - Open.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 4.0.0
     */
    const open = (): void => {
      if (paused) {
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

      source.addEventListener('open', (): void => setStreamState('live'));
      source.addEventListener('error', (): void => {
        // EventSource retries on its own; once it gives up the stream stays closed.
        setStreamState((source !== null && source.readyState === EventSource.CLOSED) ? 'disconnected' : 'connecting');
      });
      source.addEventListener('log', (event: MessageEvent<string>): void => {
        let parsedValue: unknown = undefined;

        try {
          parsedValue = JSON.parse(event.data);
        } catch {
          return;
        }

        const entry: Web_Api_LogEntry | null = parseLogEntry(parsedValue);

        if (entry === null) {
          return;
        }

        cursor.current = entry['id'];
        setEntries((current: Web_Api_LogEntry[] | null): Web_Api_LogEntry[] => {
          const list: Web_Api_LogEntry[] = current ?? [];

          if (list.some((candidate: Web_Api_LogEntry): boolean => candidate['id'] === entry['id'])) {
            return list;
          }

          return [
            entry,
            ...list,
          ].slice(0, maximumEntries);
        });
      });
    };

    /**
     * Logs View - Load.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 4.0.0
     */
    const load = async (): Promise<void> => {
      setError('');
      try {
        const page: Web_Api_LogPage = await getLogs({
          component,
          level,
          q: query,
        });

        if (cancelled) {
          return;
        }

        cursor.current = page['cursor'];
        setEntries([...page['items']].reverse());
        open();
      } catch (caughtError) {
        if (!cancelled) {
          setEntries([]);
          setStreamState('disconnected');
          setError(errorMessage(caughtError, 'The logs could not be loaded.'));
        }
      }
    };

    if (reconnects > 0 && entries !== null) {
      open();
    } else {
      setEntries(null);
      void load();
    }

    return (): void => {
      cancelled = true;

      if (source !== null) {
        source.close();
      }
    };
  }, [
    component,
    level,
    paused,
    query,
    reconnects,
  ]);

  const options: ReactElement = (
    <div className="logs-toolbar">
      <div aria-label="Log source" className="segmented logs-sources" role="group">
        {componentOptions.map((option: Web_Components_LogComponentOption): ReactElement => (
          <button
            aria-pressed={component === option['id']}
            key={option['id']}
            onClick={(): void => {
              cursor.current = null;
              setReconnects(0);
              setComponent(option['id']);
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
        onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
          cursor.current = null;
          setReconnects(0);
          setLevel(event.currentTarget.value as Web_Api_LogLevel);
        }}
        value={level}
      >
        {levelOptions.map((option: Web_Components_LogLevelOption): ReactElement => <option key={option['id']} value={option['id']}>{option['label']}</option>)}
      </select>
      <label className="search-field logs-search">
        <Icon name="search" size={16} />
        <input
          aria-label="Search the logs"
          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
            cursor.current = null;
            setReconnects(0);
            setSearchText(event.currentTarget.value);
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
          {(streamState === 'disconnected' && !paused) ? (
            <Button
              icon="refresh"
              onClick={(): void => setReconnects(reconnects + 1)}
            >
              Reconnect
            </Button>
          ) : (
            <Button
              icon={(paused) ? 'play' : 'stop'}
              onClick={(): void => {
                setReconnects(reconnects + 1);
                setPaused(!paused);
              }}
            >
              {(paused) ? 'Resume' : 'Pause'}
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
                    disabled={!canChangeDebugLogging || debugLogging === null || savingDebugLogging}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                      void toggleDebugLogging(event.currentTarget.checked);
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
            {entries.map((entry: Web_Api_LogEntry): ReactElement => {
              const summary: string = contextSummary(entry['context']);
              const open: boolean = expanded === entry['id'];

              return (
                <li className={(open) ? `log-row log-row-${entry['level']} log-row-open` : `log-row log-row-${entry['level']}`} key={entry['id']}>
                  <button
                    aria-expanded={(summary === '') ? undefined : open}
                    className="log-entry"
                    disabled={summary === ''}
                    onClick={(): void => setExpanded((open) ? '' : entry['id'])}
                    type="button"
                  >
                    <time dateTime={entry['occurredAt']} title={formatDate(entry['occurredAt'])}>{formatTime(entry['occurredAt'])}</time>
                    <span className={levelTags[entry['level']]}>{entry['level']}</span>
                    <span className="log-event">{entry['event']}</span>
                    {(summary === '' || open) ? null : <span className="log-context">{summary}</span>}
                  </button>
                  {(open) ? <pre className="log-details">{JSON.stringify(entry['context'], null, 2)}</pre> : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>
    </section>
  );
};
