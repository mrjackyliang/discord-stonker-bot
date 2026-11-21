import type {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type { Web_Api_AccountSecurity } from '@/types/web/api.d.ts';
import type {
  Web_BackupComponents_ExportOption,
  Web_BackupComponents_ImportProgressItem,
  Web_BackupComponents_ReviewItem,
  Web_BackupComponents_ReviewNote,
  Web_BackupComponents_RunningImport,
  Web_BackupComponents_SettingsCompareExcludedItem,
  Web_BackupComponents_SettingsCompareRow,
  Web_BackupComponents_WizardStep,
} from '@/types/web/backup-components.d.ts';
import type {
  Web_Backup_Document,
  Web_Backup_ExcludedItem,
  Web_Backup_ExportSections,
  Web_Backup_ImportPreview,
  Web_Backup_ImportResult,
  Web_Backup_ImportSource,
  Web_Backup_LegacySource,
  Web_Backup_ProgressJob,
  Web_Backup_SourceType,
  Web_Backup_ViewProps,
  Web_Backup_ViewStep,
} from '@/types/web/backup.d.ts';

/**
 * Backup View.
 *
 * @since 4.2.1
 */
export type Web_BackupView_BackupView_Props = Web_Backup_ViewProps;
export type Web_BackupView_BackupView_Returns = ReactElement;
export type Web_BackupView_BackupView_OnImported = Web_Backup_ViewProps['onImported'];
export type Web_BackupView_BackupView_Server = Web_Backup_ViewProps['server'];
export type Web_BackupView_BackupView_ExportOpen = boolean;
export type Web_BackupView_BackupView_SetExportOpen = Dispatch<SetStateAction<Web_BackupView_BackupView_ExportOpen>>;
export type Web_BackupView_BackupView_ExportOpenState = [Web_BackupView_BackupView_ExportOpen, Web_BackupView_BackupView_SetExportOpen];
export type Web_BackupView_BackupView_ImportOpen = boolean;
export type Web_BackupView_BackupView_SetImportOpen = Dispatch<SetStateAction<Web_BackupView_BackupView_ImportOpen>>;
export type Web_BackupView_BackupView_ImportOpenState = [Web_BackupView_BackupView_ImportOpen, Web_BackupView_BackupView_SetImportOpen];
export type Web_BackupView_BackupView_Step = Web_Backup_ViewStep;
export type Web_BackupView_BackupView_SetStep = Dispatch<SetStateAction<Web_BackupView_BackupView_Step>>;
export type Web_BackupView_BackupView_StepState = [Web_BackupView_BackupView_Step, Web_BackupView_BackupView_SetStep];
export type Web_BackupView_BackupView_SourceType = Web_Backup_SourceType;
export type Web_BackupView_BackupView_SetSourceType = Dispatch<SetStateAction<Web_BackupView_BackupView_SourceType>>;
export type Web_BackupView_BackupView_SourceTypeState = [Web_BackupView_BackupView_SourceType, Web_BackupView_BackupView_SetSourceType];
export type Web_BackupView_BackupView_Filename = string;
export type Web_BackupView_BackupView_SetFilename = Dispatch<SetStateAction<Web_BackupView_BackupView_Filename>>;
export type Web_BackupView_BackupView_FilenameState = [Web_BackupView_BackupView_Filename, Web_BackupView_BackupView_SetFilename];
export type Web_BackupView_BackupView_Source = Web_Backup_ImportSource | null;
export type Web_BackupView_BackupView_SetSource = Dispatch<SetStateAction<Web_BackupView_BackupView_Source>>;
export type Web_BackupView_BackupView_SourceState = [Web_BackupView_BackupView_Source, Web_BackupView_BackupView_SetSource];
export type Web_BackupView_BackupView_Preview = Web_Backup_ImportPreview | null;
export type Web_BackupView_BackupView_SetPreview = Dispatch<SetStateAction<Web_BackupView_BackupView_Preview>>;
export type Web_BackupView_BackupView_PreviewState = [Web_BackupView_BackupView_Preview, Web_BackupView_BackupView_SetPreview];
export type Web_BackupView_BackupView_Security = Web_Api_AccountSecurity;
export type Web_BackupView_BackupView_SetSecurity = Dispatch<SetStateAction<Web_BackupView_BackupView_Security>>;
export type Web_BackupView_BackupView_SecurityState = [Web_BackupView_BackupView_Security, Web_BackupView_BackupView_SetSecurity];
export type Web_BackupView_BackupView_EnableFeatures = boolean;
export type Web_BackupView_BackupView_SetEnableFeatures = Dispatch<SetStateAction<Web_BackupView_BackupView_EnableFeatures>>;
export type Web_BackupView_BackupView_EnableFeaturesState = [Web_BackupView_BackupView_EnableFeatures, Web_BackupView_BackupView_SetEnableFeatures];
export type Web_BackupView_BackupView_Busy = boolean;
export type Web_BackupView_BackupView_SetBusy = Dispatch<SetStateAction<Web_BackupView_BackupView_Busy>>;
export type Web_BackupView_BackupView_BusyState = [Web_BackupView_BackupView_Busy, Web_BackupView_BackupView_SetBusy];
export type Web_BackupView_BackupView_Error = string;
export type Web_BackupView_BackupView_SetError = Dispatch<SetStateAction<Web_BackupView_BackupView_Error>>;
export type Web_BackupView_BackupView_ErrorState = [Web_BackupView_BackupView_Error, Web_BackupView_BackupView_SetError];
export type Web_BackupView_BackupView_ProgressJob = Web_Backup_ProgressJob | null;
export type Web_BackupView_BackupView_SetProgressJob = Dispatch<SetStateAction<Web_BackupView_BackupView_ProgressJob>>;
export type Web_BackupView_BackupView_ProgressJobState = [Web_BackupView_BackupView_ProgressJob, Web_BackupView_BackupView_SetProgressJob];
export type Web_BackupView_BackupView_RunningImport = Web_BackupComponents_RunningImport | null;
export type Web_BackupView_BackupView_Title = string;
export type Web_BackupView_BackupView_Detail = string;
export type Web_BackupView_BackupView_PasskeyAvailable = boolean;
export type Web_BackupView_BackupView_WizardSteps = Web_BackupComponents_WizardStep[];
export type Web_BackupView_BackupView_Steps = Web_BackupComponents_WizardStep[];
export type Web_BackupView_BackupView_FeaturesRequiringFixes = Web_Backup_ExcludedItem[];
export type Web_BackupView_BackupView_SettingRows = Web_BackupComponents_SettingsCompareRow[];
export type Web_BackupView_BackupView_AttentionItems = Web_BackupComponents_SettingsCompareExcludedItem[];
export type Web_BackupView_BackupView_ExcludedSections = Web_BackupComponents_SettingsCompareExcludedItem[];
export type Web_BackupView_BackupView_PreviewExcluded = Web_Backup_ExcludedItem[];
export type Web_BackupView_BackupView_ExcludedItems = Web_BackupComponents_SettingsCompareExcludedItem[];
export type Web_BackupView_BackupView_ReviewItems = Web_BackupComponents_ReviewItem[];
export type Web_BackupView_BackupView_ConnectionVerb = string;
export type Web_BackupView_BackupView_FeatureCount = number;
export type Web_BackupView_BackupView_FeaturesThatNeedFixes = number;
export type Web_BackupView_BackupView_FeaturesThatTurnOn = number;
export type Web_BackupView_BackupView_FeaturesSwitchedOff = number;
export type Web_BackupView_BackupView_TurnOnVerb = string;
export type Web_BackupView_BackupView_StayOffVerb = string;
export type Web_BackupView_BackupView_FixPronoun = string;
export type Web_BackupView_BackupView_Skipped = number;
export type Web_BackupView_BackupView_SkippedVerb = string;
export type Web_BackupView_BackupView_ReviewNotes = Web_BackupComponents_ReviewNote[];
export type Web_BackupView_BackupView_LoadSecurity_Returns = Promise<void>;
export type Web_BackupView_BackupView_LoadSecurity = () => Web_BackupView_BackupView_LoadSecurity_Returns;
export type Web_BackupView_BackupView_ClearImport_Returns = void;
export type Web_BackupView_BackupView_ClearImport = () => Web_BackupView_BackupView_ClearImport_Returns;
export type Web_BackupView_BackupView_SelectSource_Type = Web_Backup_SourceType;
export type Web_BackupView_BackupView_SelectSource_Returns = void;
export type Web_BackupView_BackupView_SelectSource = (type: Web_BackupView_BackupView_SelectSource_Type) => Web_BackupView_BackupView_SelectSource_Returns;
export type Web_BackupView_BackupView_LoadSource_NextSource = Web_Backup_ImportSource;
export type Web_BackupView_BackupView_LoadSource_NextFilename = string;
export type Web_BackupView_BackupView_LoadSource_Returns = Promise<void>;
export type Web_BackupView_BackupView_LoadSource = (nextSource: Web_BackupView_BackupView_LoadSource_NextSource, nextFilename: Web_BackupView_BackupView_LoadSource_NextFilename) => Web_BackupView_BackupView_LoadSource_Returns;
export type Web_BackupView_BackupView_LoadSource_NextPreview = Web_Backup_ImportPreview;
export type Web_BackupView_BackupView_ChooseFile_Event = ChangeEvent<HTMLInputElement>;
export type Web_BackupView_BackupView_ChooseFile_Type = Web_Backup_SourceType;
export type Web_BackupView_BackupView_ChooseFile_Returns = Promise<void>;
export type Web_BackupView_BackupView_ChooseFile = (event: Web_BackupView_BackupView_ChooseFile_Event, type: Web_BackupView_BackupView_ChooseFile_Type) => Web_BackupView_BackupView_ChooseFile_Returns;
export type Web_BackupView_BackupView_ChooseFile_Input = HTMLInputElement;
export type Web_BackupView_BackupView_ChooseFile_InputFiles = FileList | null;
export type Web_BackupView_BackupView_ChooseFile_File = File | undefined;
export type Web_BackupView_BackupView_ChooseFile_Value = unknown;
export type Web_BackupView_BackupView_ChooseFile_Document = Web_Backup_Document;
export type Web_BackupView_BackupView_ChooseFile_LegacySource = Web_Backup_LegacySource;
export type Web_BackupView_BackupView_ChooseFile_Message = string;
export type Web_BackupView_BackupView_ApplyImport_Grant = string;
export type Web_BackupView_BackupView_ApplyImport_Returns = Promise<void>;
export type Web_BackupView_BackupView_ApplyImport = (grant: Web_BackupView_BackupView_ApplyImport_Grant) => Web_BackupView_BackupView_ApplyImport_Returns;
export type Web_BackupView_BackupView_ApplyImport_Items = Web_BackupComponents_ImportProgressItem[];
export type Web_BackupView_BackupView_ApplyImport_Result = Web_Backup_ImportResult;
export type Web_BackupView_BackupView_Next_Returns = void;
export type Web_BackupView_BackupView_Next = () => Web_BackupView_BackupView_Next_Returns;
export type Web_BackupView_BackupView_Back_Returns = void;
export type Web_BackupView_BackupView_Back = () => Web_BackupView_BackupView_Back_Returns;
export type Web_BackupView_BackupView_Content = ReactElement;
export type Web_BackupView_BackupView_Enabled = boolean;
export type Web_BackupView_BackupView_NextSource = Web_Backup_LegacySource;
export type Web_BackupView_BackupView_SettingsImportable = boolean;
export type Web_BackupView_BackupView_Sections = Web_Backup_ExportSections;

/**
 * Backup View.
 *
 * @since 4.2.1
 */
export type Web_BackupView_BaseWizardSteps = Web_BackupComponents_WizardStep[];

/**
 * Backup View.
 *
 * @since 4.2.1
 */
export type Web_BackupView_CountLabel_Count = number;
export type Web_BackupView_CountLabel_Singular = string;
export type Web_BackupView_CountLabel_Plural = string;
export type Web_BackupView_CountLabel_Returns = string;
export type Web_BackupView_CountLabel_Noun = string;

/**
 * Backup View.
 *
 * @since 4.2.1
 */
export type Web_BackupView_EmptySecurity = Web_Api_AccountSecurity;

/**
 * Backup View.
 *
 * @since 4.2.1
 */
export type Web_BackupView_ExportOptions = Web_BackupComponents_ExportOption[];
