import type {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
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
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_ComponentOptions = Web_Components_LogComponentOption[];

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_ContextSummary_Context = Record<string, unknown>;
export type Web_LogsView_ContextSummary_Returns = string;
export type Web_LogsView_ContextSummary_Key = string;
export type Web_LogsView_ContextSummary_Value = unknown;
export type Web_LogsView_ContextSummary_FormattedValue = string;

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_FormatTime_Value = string;
export type Web_LogsView_FormatTime_Returns = string;
export type Web_LogsView_FormatTime_Date = Date;

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_LevelOptions = Web_Components_LogLevelOption[];

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_LevelTags = Record<Web_Api_LogLevel, string>;

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_LogsView_Props = Web_Components_LogsView_Props;
export type Web_LogsView_LogsView_Returns = ReactElement;
export type Web_LogsView_LogsView_CanChangeDebugLogging = Web_Components_LogsView_Props['canChangeDebugLogging'];
export type Web_LogsView_LogsView_DebugLogging = boolean | null;
export type Web_LogsView_LogsView_SetDebugLogging = Dispatch<SetStateAction<Web_LogsView_LogsView_DebugLogging>>;
export type Web_LogsView_LogsView_DebugLoggingState = [Web_LogsView_LogsView_DebugLogging, Web_LogsView_LogsView_SetDebugLogging];
export type Web_LogsView_LogsView_SavingDebugLogging = boolean;
export type Web_LogsView_LogsView_SetSavingDebugLogging = Dispatch<SetStateAction<Web_LogsView_LogsView_SavingDebugLogging>>;
export type Web_LogsView_LogsView_SavingDebugLoggingState = [Web_LogsView_LogsView_SavingDebugLogging, Web_LogsView_LogsView_SetSavingDebugLogging];
export type Web_LogsView_LogsView_Component = Web_Api_ServiceComponent;
export type Web_LogsView_LogsView_SetComponent = Dispatch<SetStateAction<Web_LogsView_LogsView_Component>>;
export type Web_LogsView_LogsView_ComponentState = [Web_LogsView_LogsView_Component, Web_LogsView_LogsView_SetComponent];
export type Web_LogsView_LogsView_Level = Web_Api_LogLevel;
export type Web_LogsView_LogsView_SetLevel = Dispatch<SetStateAction<Web_LogsView_LogsView_Level>>;
export type Web_LogsView_LogsView_LevelState = [Web_LogsView_LogsView_Level, Web_LogsView_LogsView_SetLevel];
export type Web_LogsView_LogsView_SearchText = string;
export type Web_LogsView_LogsView_SetSearchText = Dispatch<SetStateAction<Web_LogsView_LogsView_SearchText>>;
export type Web_LogsView_LogsView_SearchTextState = [Web_LogsView_LogsView_SearchText, Web_LogsView_LogsView_SetSearchText];
export type Web_LogsView_LogsView_Query = string;
export type Web_LogsView_LogsView_SetQuery = Dispatch<SetStateAction<Web_LogsView_LogsView_Query>>;
export type Web_LogsView_LogsView_QueryState = [Web_LogsView_LogsView_Query, Web_LogsView_LogsView_SetQuery];
export type Web_LogsView_LogsView_Entries = Web_Api_LogEntry[] | null;
export type Web_LogsView_LogsView_SetEntries = Dispatch<SetStateAction<Web_LogsView_LogsView_Entries>>;
export type Web_LogsView_LogsView_EntriesState = [Web_LogsView_LogsView_Entries, Web_LogsView_LogsView_SetEntries];
export type Web_LogsView_LogsView_Error = string;
export type Web_LogsView_LogsView_SetError = Dispatch<SetStateAction<Web_LogsView_LogsView_Error>>;
export type Web_LogsView_LogsView_ErrorState = [Web_LogsView_LogsView_Error, Web_LogsView_LogsView_SetError];
export type Web_LogsView_LogsView_StreamState = Web_Components_LogStreamState;
export type Web_LogsView_LogsView_SetStreamState = Dispatch<SetStateAction<Web_LogsView_LogsView_StreamState>>;
export type Web_LogsView_LogsView_StreamStateState = [Web_LogsView_LogsView_StreamState, Web_LogsView_LogsView_SetStreamState];
export type Web_LogsView_LogsView_Paused = boolean;
export type Web_LogsView_LogsView_SetPaused = Dispatch<SetStateAction<Web_LogsView_LogsView_Paused>>;
export type Web_LogsView_LogsView_PausedState = [Web_LogsView_LogsView_Paused, Web_LogsView_LogsView_SetPaused];
export type Web_LogsView_LogsView_Expanded = string;
export type Web_LogsView_LogsView_SetExpanded = Dispatch<SetStateAction<Web_LogsView_LogsView_Expanded>>;
export type Web_LogsView_LogsView_ExpandedState = [Web_LogsView_LogsView_Expanded, Web_LogsView_LogsView_SetExpanded];
export type Web_LogsView_LogsView_Reconnects = number;
export type Web_LogsView_LogsView_SetReconnects = Dispatch<SetStateAction<Web_LogsView_LogsView_Reconnects>>;
export type Web_LogsView_LogsView_ReconnectsState = [Web_LogsView_LogsView_Reconnects, Web_LogsView_LogsView_SetReconnects];
export type Web_LogsView_LogsView_CursorValue = string | null;
export type Web_LogsView_LogsView_Cursor = RefObject<Web_LogsView_LogsView_CursorValue>;
export type Web_LogsView_LogsView_Active = boolean;
export type Web_LogsView_LogsView_ToggleDebugLogging_Enabled = boolean;
export type Web_LogsView_LogsView_ToggleDebugLogging_Returns = Promise<void>;
export type Web_LogsView_LogsView_ToggleDebugLogging = (enabled: Web_LogsView_LogsView_ToggleDebugLogging_Enabled) => Web_LogsView_LogsView_ToggleDebugLogging_Returns;
export type Web_LogsView_LogsView_ToggleDebugLogging_Previous = boolean | null;
export type Web_LogsView_LogsView_ToggleDebugLogging_Saved = Web_Api_Diagnostics;
export type Web_LogsView_LogsView_Timer = number;
export type Web_LogsView_LogsView_Source = EventSource | null;
export type Web_LogsView_LogsView_Cancelled = boolean;
export type Web_LogsView_LogsView_Open_Returns = void;
export type Web_LogsView_LogsView_Open = () => Web_LogsView_LogsView_Open_Returns;
export type Web_LogsView_LogsView_Open_Log_ParsedValue = unknown;
export type Web_LogsView_LogsView_Open_Log_Entry = Web_Api_LogEntry | null;
export type Web_LogsView_LogsView_Open_Log_List = Web_Api_LogEntry[];
export type Web_LogsView_LogsView_Load_Returns = Promise<void>;
export type Web_LogsView_LogsView_Load = () => Web_LogsView_LogsView_Load_Returns;
export type Web_LogsView_LogsView_Load_Page = Web_Api_LogPage;
export type Web_LogsView_LogsView_Options = ReactElement;
export type Web_LogsView_LogsView_LevelValue = Web_Api_LogLevel;
export type Web_LogsView_LogsView_Summary = string;
export type Web_LogsView_LogsView_EntryOpen = boolean;

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_MaximumEntries = number;

/**
 * Logs View.
 *
 * @since 4.2.1
 */
export type Web_LogsView_StreamLabels = Record<Web_Components_LogStreamState, string>;
