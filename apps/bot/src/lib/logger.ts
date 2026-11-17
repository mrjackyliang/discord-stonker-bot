import type {
  Lib_Logger_ConfigureLogPersistence_Pool,
  Lib_Logger_ConfigureLogPersistence_Returns,
  Lib_Logger_DebugLogging,
  Lib_Logger_FormatLogMessage_Context,
  Lib_Logger_FormatLogMessage_ContextEntries,
  Lib_Logger_FormatLogMessage_ContextEntryKey,
  Lib_Logger_FormatLogMessage_ContextEntryValue,
  Lib_Logger_FormatLogMessage_ContextParts,
  Lib_Logger_FormatLogMessage_Event,
  Lib_Logger_FormatLogMessage_RawMessage,
  Lib_Logger_FormatLogMessage_Returns,
  Lib_Logger_GetErrorMessage_Error,
  Lib_Logger_GetErrorMessage_Returns,
  Lib_Logger_IsDebugLogging_Returns,
  Lib_Logger_LogPersistencePool,
  Lib_Logger_MutedChecks,
  Lib_Logger_MuteLogs_Returns,
  Lib_Logger_SetDebugLogging_Enabled,
  Lib_Logger_SetDebugLogging_Returns,
  Lib_Logger_UnmuteLogs_Returns,
  Lib_Logger_WriteLog_Component,
  Lib_Logger_WriteLog_Context,
  Lib_Logger_WriteLog_Entry,
  Lib_Logger_WriteLog_Event,
  Lib_Logger_WriteLog_Level,
  Lib_Logger_WriteLog_Message,
  Lib_Logger_WriteLog_OutputLevel,
  Lib_Logger_WriteLog_OutputLine,
  Lib_Logger_WriteLog_PersistencePromise,
  Lib_Logger_WriteLog_Returns,
} from '../types/lib/logger.d.ts';

/**
 * Logger - Log Persistence Pool.
 *
 * Holds the current service's pool after migrations make log storage available.
 * Console output remains available before this optional sink is configured.
 *
 * @since 4.0.0
 */
let logPersistencePool: Lib_Logger_LogPersistencePool = undefined;

/**
 * Logger - Muted Checks.
 *
 * Counts the settings checks in progress that must not log.
 * The control panel runs the bot's feature compilers to check settings, and their
 * rejection warnings would otherwise read as if the running bot had logged them.
 *
 * @since 4.0.0
 */
let mutedChecks: Lib_Logger_MutedChecks = 0;

/**
 * Logger - Debug Logging.
 *
 * Whether debug entries are written. Each process follows the saved switch, so the
 * bot, the control panel, and the worker change together.
 *
 * @since 4.0.0
 */
let debugLogging: Lib_Logger_DebugLogging = false;

/**
 * Logger - Configure Log Persistence.
 *
 * Enables the authenticated panel's live-tail source for one runtime process.
 * Services call this only after their database connection is ready.
 *
 * @param {Lib_Logger_ConfigureLogPersistence_Pool} pool - Pool.
 *
 * @returns {Lib_Logger_ConfigureLogPersistence_Returns}
 *
 * @since 4.0.0
 */
export function configureLogPersistence(
  pool: Lib_Logger_ConfigureLogPersistence_Pool,
): Lib_Logger_ConfigureLogPersistence_Returns {
  logPersistencePool = pool;

  return;
}

/**
 * Logger - Format Log Message.
 *
 * Renders the event and its redacted context as one newline-free plain message.
 * Container output stays readable while the database retains the typed details.
 *
 * @param {Lib_Logger_FormatLogMessage_Event}   event   - Event.
 * @param {Lib_Logger_FormatLogMessage_Context} context - Context.
 *
 * @returns {Lib_Logger_FormatLogMessage_Returns}
 *
 * @since 4.2.0
 */
function formatLogMessage(event: Lib_Logger_FormatLogMessage_Event, context: Lib_Logger_FormatLogMessage_Context): Lib_Logger_FormatLogMessage_Returns {
  const contextParts: Lib_Logger_FormatLogMessage_ContextParts = [];
  const contextEntries: Lib_Logger_FormatLogMessage_ContextEntries = Object.entries(context).sort((firstEntry, secondEntry) => firstEntry[0].localeCompare(secondEntry[0]));

  for (const contextEntry of contextEntries) {
    const contextEntryKey: Lib_Logger_FormatLogMessage_ContextEntryKey = contextEntry[0];
    const contextEntryValue: Lib_Logger_FormatLogMessage_ContextEntryValue = contextEntry[1];

    contextParts.push(`${contextEntryKey}=${String(contextEntryValue)}`);
  }

  const rawMessage: Lib_Logger_FormatLogMessage_RawMessage = [
    event,
    ...contextParts,
  ].join(' ');

  return rawMessage.replaceAll('\r', ' ').replaceAll('\n', ' ');
}

/**
 * Logger - Get Error Message.
 *
 * Converts unknown failures into a bounded public log field.
 * Callers avoid serializing stack traces or provider response objects.
 *
 * @param {Lib_Logger_GetErrorMessage_Error} error - Error.
 *
 * @returns {Lib_Logger_GetErrorMessage_Returns}
 *
 * @since 4.0.0
 */
export function getErrorMessage(error: Lib_Logger_GetErrorMessage_Error): Lib_Logger_GetErrorMessage_Returns {
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
}

/**
 * Logger - Is Debug Logging.
 *
 * Reports whether debug entries are written right now.
 * Timing wrappers check it first, so they cost nothing while it's off.
 *
 * @returns {Lib_Logger_IsDebugLogging_Returns}
 *
 * @since 4.0.0
 */
export function isDebugLogging(): Lib_Logger_IsDebugLogging_Returns {
  return debugLogging;
}

/**
 * Logger - Mute Logs.
 *
 * Starts a synchronous check during which writeLog drops every entry.
 * Each call must be paired with unmuteLogs, usually in a finally block.
 *
 * @returns {Lib_Logger_MuteLogs_Returns}
 *
 * @since 4.0.0
 */
export function muteLogs(): Lib_Logger_MuteLogs_Returns {
  mutedChecks += 1;

  return;
}

/**
 * Logger - Set Debug Logging.
 *
 * Turns debug entries on or off for this process.
 * Other levels are always written.
 *
 * @param {Lib_Logger_SetDebugLogging_Enabled} enabled - Enabled.
 *
 * @returns {Lib_Logger_SetDebugLogging_Returns}
 *
 * @since 4.0.0
 */
export function setDebugLogging(enabled: Lib_Logger_SetDebugLogging_Enabled): Lib_Logger_SetDebugLogging_Returns {
  debugLogging = enabled;

  return;
}

/**
 * Logger - Unmute Logs.
 *
 * Ends a check started with muteLogs.
 * Logging resumes once every started check has ended.
 *
 * @returns {Lib_Logger_UnmuteLogs_Returns}
 *
 * @since 4.0.0
 */
export function unmuteLogs(): Lib_Logger_UnmuteLogs_Returns {
  mutedChecks = Math.max(0, mutedChecks - 1);

  return;
}

/**
 * Logger - Write Log.
 *
 * Emits one plain line that matches the appliance logger contract. Context is explicit
 * so secrets are never included implicitly, and debug entries wait for Debug logging.
 *
 * @param {Lib_Logger_WriteLog_Level}     level     - Level.
 * @param {Lib_Logger_WriteLog_Component} component - Component.
 * @param {Lib_Logger_WriteLog_Event}     event     - Event.
 * @param {Lib_Logger_WriteLog_Context}   context   - Context.
 *
 * @returns {Lib_Logger_WriteLog_Returns}
 *
 * @since 4.2.0
 */
export function writeLog(
  level: Lib_Logger_WriteLog_Level,
  component: Lib_Logger_WriteLog_Component,
  event: Lib_Logger_WriteLog_Event,
  context: Lib_Logger_WriteLog_Context = {},
): Lib_Logger_WriteLog_Returns {
  if (
    mutedChecks > 0
    || (
      level === 'debug'
      && debugLogging === false
    )
  ) {
    return;
  }

  const entry: Lib_Logger_WriteLog_Entry = {
    component,
    context,
    event,
    level,
    timestamp: new Date().toISOString(),
  };
  const message: Lib_Logger_WriteLog_Message = formatLogMessage(event, context);
  const outputLevel: Lib_Logger_WriteLog_OutputLevel = level.toUpperCase();
  const outputLine: Lib_Logger_WriteLog_OutputLine = `${entry['timestamp']} ${outputLevel} ${component}: ${message}\n`;

  if (level === 'warn' || level === 'error') {
    process.stderr.write(outputLine);
  } else {
    process.stdout.write(outputLine);
  }

  if (
    logPersistencePool !== undefined
    && (
      component === 'bot'
      || component === 'web'
      || component === 'worker'
    )
  ) {
    const persistencePromise: Lib_Logger_WriteLog_PersistencePromise = logPersistencePool.query(
      'INSERT INTO runtime_logs (component, level, event, context, occurred_at) VALUES ($1, $2, $3, $4::jsonb, $5)',
      [
        component,
        level,
        event.slice(0, 160),
        JSON.stringify(context),
        entry['timestamp'],
      ],
    );

    void persistencePromise.catch(() => {
      return;
    });
  }

  return;
}
