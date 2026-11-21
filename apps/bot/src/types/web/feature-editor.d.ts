import type {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
} from 'react';

import type {
  Web_Api_ErrorIssue,
  Web_Api_FeatureDetail,
  Web_Api_FeatureSummary,
  Web_Api_Resources,
  Web_Api_Server,
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

/**
 * Feature Editor.
 *
 * @since 4.2.1
 */
export type Web_FeatureEditor_FeatureEditor_Props = Web_Components_FeatureEditor_Props;
export type Web_FeatureEditor_FeatureEditor_Returns = ReactElement;
export type Web_FeatureEditor_FeatureEditor_CanWrite = boolean;
export type Web_FeatureEditor_FeatureEditor_FeatureKey = string;
export type Web_FeatureEditor_FeatureEditor_OnBack = () => void;
export type Web_FeatureEditor_FeatureEditor_OnDirtyChange = (dirty: boolean) => void;
export type Web_FeatureEditor_FeatureEditor_OnFeaturesChanged = () => void;
export type Web_FeatureEditor_FeatureEditor_Server = Web_Api_Server;
export type Web_FeatureEditor_FeatureEditor_LoadedState = [Web_Components_FeatureEditor_Loaded | null, Dispatch<SetStateAction<Web_Components_FeatureEditor_Loaded | null>>];
export type Web_FeatureEditor_FeatureEditor_Loaded = Web_Components_FeatureEditor_Loaded | null;
export type Web_FeatureEditor_FeatureEditor_SetLoaded = Dispatch<SetStateAction<Web_Components_FeatureEditor_Loaded | null>>;
export type Web_FeatureEditor_FeatureEditor_DraftState = [unknown, Dispatch<SetStateAction<unknown>>];
export type Web_FeatureEditor_FeatureEditor_Draft = unknown;
export type Web_FeatureEditor_FeatureEditor_SetDraft = Dispatch<SetStateAction<unknown>>;
export type Web_FeatureEditor_FeatureEditor_LoadErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_FeatureEditor_FeatureEditor_LoadError = string;
export type Web_FeatureEditor_FeatureEditor_SetLoadError = Dispatch<SetStateAction<string>>;
export type Web_FeatureEditor_FeatureEditor_SaveErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_FeatureEditor_FeatureEditor_SaveError = string;
export type Web_FeatureEditor_FeatureEditor_SetSaveError = Dispatch<SetStateAction<string>>;
export type Web_FeatureEditor_FeatureEditor_IssuesState = [Web_Api_ErrorIssue[], Dispatch<SetStateAction<Web_Api_ErrorIssue[]>>];
export type Web_FeatureEditor_FeatureEditor_Issues = Web_Api_ErrorIssue[];
export type Web_FeatureEditor_FeatureEditor_SetIssues = Dispatch<SetStateAction<Web_Api_ErrorIssue[]>>;
export type Web_FeatureEditor_FeatureEditor_UnmatchedIssuesState = [Web_Api_ErrorIssue[], Dispatch<SetStateAction<Web_Api_ErrorIssue[]>>];
export type Web_FeatureEditor_FeatureEditor_UnmatchedIssues = Web_Api_ErrorIssue[];
export type Web_FeatureEditor_FeatureEditor_SetUnmatchedIssues = Dispatch<SetStateAction<Web_Api_ErrorIssue[]>>;
export type Web_FeatureEditor_FeatureEditor_ConflictState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_FeatureEditor_FeatureEditor_Conflict = boolean;
export type Web_FeatureEditor_FeatureEditor_SetConflict = Dispatch<SetStateAction<boolean>>;
export type Web_FeatureEditor_FeatureEditor_SavingState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_FeatureEditor_FeatureEditor_Saving = boolean;
export type Web_FeatureEditor_FeatureEditor_SetSaving = Dispatch<SetStateAction<boolean>>;
export type Web_FeatureEditor_FeatureEditor_SwitchingState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_FeatureEditor_FeatureEditor_Switching = boolean;
export type Web_FeatureEditor_FeatureEditor_SetSwitching = Dispatch<SetStateAction<boolean>>;
export type Web_FeatureEditor_FeatureEditor_FailedSavesState = [number, Dispatch<SetStateAction<number>>];
export type Web_FeatureEditor_FeatureEditor_FailedSaves = number;
export type Web_FeatureEditor_FeatureEditor_SetFailedSaves = Dispatch<SetStateAction<number>>;
export type Web_FeatureEditor_FeatureEditor_FormVersionState = [number, Dispatch<SetStateAction<number>>];
export type Web_FeatureEditor_FeatureEditor_FormVersion = number;
export type Web_FeatureEditor_FeatureEditor_SetFormVersion = Dispatch<SetStateAction<number>>;
export type Web_FeatureEditor_FeatureEditor_ShownPaths = RefObject<Set<string>>;
export type Web_FeatureEditor_FeatureEditor_SectionRef = RefObject<HTMLElement | null>;
export type Web_FeatureEditor_FeatureEditor_Load_Returns = Promise<void>;
export type Web_FeatureEditor_FeatureEditor_Load = () => Web_FeatureEditor_FeatureEditor_Load_Returns;
export type Web_FeatureEditor_FeatureEditor_Load_Responses = [Web_Api_FeatureDetail, Web_Api_Resources];
export type Web_FeatureEditor_FeatureEditor_Load_Detail = Web_Api_FeatureDetail;
export type Web_FeatureEditor_FeatureEditor_Load_Resources = Web_Api_Resources;
export type Web_FeatureEditor_FeatureEditor_ChangeCount = number;
export type Web_FeatureEditor_FeatureEditor_Dirty = boolean;
export type Web_FeatureEditor_FeatureEditor_Warn_Event = BeforeUnloadEvent;
export type Web_FeatureEditor_FeatureEditor_Warn_Returns = void;
export type Web_FeatureEditor_FeatureEditor_Warn = (event: Web_FeatureEditor_FeatureEditor_Warn_Event) => Web_FeatureEditor_FeatureEditor_Warn_Returns;
export type Web_FeatureEditor_FeatureEditor_IssueMessages = Map<string, string>;
export type Web_FeatureEditor_FeatureEditor_Path = Web_Schema_Path | null;
export type Web_FeatureEditor_FeatureEditor_Unmatched = Web_Api_ErrorIssue[];
export type Web_FeatureEditor_FeatureEditor_Section = HTMLElement | null;
export type Web_FeatureEditor_FeatureEditor_Target = HTMLElement | null;
export type Web_FeatureEditor_FeatureEditor_Detail = Web_Api_FeatureDetail;
export type Web_FeatureEditor_FeatureEditor_ReadOnly = boolean;
export type Web_FeatureEditor_FeatureEditor_Context = Web_Components_SchemaForm_Context;
export type Web_FeatureEditor_FeatureEditor_Key = string;
export type Web_FeatureEditor_FeatureEditor_ReplaceDraft_Next = unknown;
export type Web_FeatureEditor_FeatureEditor_ReplaceDraft_Returns = void;
export type Web_FeatureEditor_FeatureEditor_ReplaceDraft = (next: Web_FeatureEditor_FeatureEditor_ReplaceDraft_Next) => Web_FeatureEditor_FeatureEditor_ReplaceDraft_Returns;
export type Web_FeatureEditor_FeatureEditor_Discard_Returns = void;
export type Web_FeatureEditor_FeatureEditor_Discard = () => Web_FeatureEditor_FeatureEditor_Discard_Returns;
export type Web_FeatureEditor_FeatureEditor_Save_Returns = Promise<void>;
export type Web_FeatureEditor_FeatureEditor_Save = () => Web_FeatureEditor_FeatureEditor_Save_Returns;
export type Web_FeatureEditor_FeatureEditor_Save_Separated = Web_Schema_Separated;
export type Web_FeatureEditor_FeatureEditor_Save_Saved = Web_Api_FeatureDetail;
export type Web_FeatureEditor_FeatureEditor_Toggle_Returns = Promise<void>;
export type Web_FeatureEditor_FeatureEditor_Toggle = () => Web_FeatureEditor_FeatureEditor_Toggle_Returns;
export type Web_FeatureEditor_FeatureEditor_Toggle_Summary = Web_Api_FeatureSummary;
export type Web_FeatureEditor_FeatureEditor_NotSetUp = boolean;
export type Web_FeatureEditor_FeatureEditor_HasExample = boolean;
export type Web_FeatureEditor_FeatureEditor_NextState = 'off' | 'on';
export type Web_FeatureEditor_FeatureEditor_ChangeWord = 'change' | 'changes';

/**
 * Feature Editor.
 *
 * @since 4.2.1
 */
export type Web_FeatureEditor_IssuePath_Issue = Web_Api_ErrorIssue;
export type Web_FeatureEditor_IssuePath_Returns = Web_Schema_Path | null;
export type Web_FeatureEditor_IssuePath_Segments = string[];
export type Web_FeatureEditor_IssuePath_First = string | undefined;
export type Web_FeatureEditor_IssuePath_Rest = string[];
export type Web_FeatureEditor_IssuePath_Joined = string;
export type Web_FeatureEditor_IssuePath_Pointer = string;
