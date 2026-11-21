import {
  useMemo,
  useState,
} from 'react';

import {
  applyBackupImport,
  confirmBackupOperation,
  confirmBackupOperationWithPasskey,
  downloadBackupExport,
  getAccountSecurity,
  previewBackupImport,
} from '@/web/api.ts';
import { BackupExportDialog } from '@/web/backup-export-dialog.tsx';
import { BackupFileSource } from '@/web/backup-file-source.tsx';
import { parseBackupDocument } from '@/web/backup-format.ts';
import { BackupImportProgress } from '@/web/backup-import-progress.tsx';
import { BackupImportWizardShell } from '@/web/backup-import-wizard-shell.tsx';
import { BackupReviewList } from '@/web/backup-review-list.tsx';
import { BackupSection } from '@/web/backup-section.tsx';
import { BackupSettingsCompare } from '@/web/backup-settings-compare.tsx';
import { ConfirmIdentityStep } from '@/web/confirm-identity-step.tsx';
import { showToast } from '@/web/toast.ts';

import type {
  Web_BackupView_BackupView_ApplyImport,
  Web_BackupView_BackupView_ApplyImport_Grant,
  Web_BackupView_BackupView_ApplyImport_Items,
  Web_BackupView_BackupView_ApplyImport_Result,
  Web_BackupView_BackupView_ApplyImport_Returns,
  Web_BackupView_BackupView_AttentionItems,
  Web_BackupView_BackupView_Back,
  Web_BackupView_BackupView_Back_Returns,
  Web_BackupView_BackupView_Busy,
  Web_BackupView_BackupView_BusyState,
  Web_BackupView_BackupView_ChooseFile,
  Web_BackupView_BackupView_ChooseFile_Document,
  Web_BackupView_BackupView_ChooseFile_Event,
  Web_BackupView_BackupView_ChooseFile_File,
  Web_BackupView_BackupView_ChooseFile_Input,
  Web_BackupView_BackupView_ChooseFile_InputFiles,
  Web_BackupView_BackupView_ChooseFile_LegacySource,
  Web_BackupView_BackupView_ChooseFile_Message,
  Web_BackupView_BackupView_ChooseFile_Returns,
  Web_BackupView_BackupView_ChooseFile_Type,
  Web_BackupView_BackupView_ChooseFile_Value,
  Web_BackupView_BackupView_ClearImport,
  Web_BackupView_BackupView_ClearImport_Returns,
  Web_BackupView_BackupView_ConnectionVerb,
  Web_BackupView_BackupView_Content,
  Web_BackupView_BackupView_Detail,
  Web_BackupView_BackupView_Enabled,
  Web_BackupView_BackupView_EnableFeatures,
  Web_BackupView_BackupView_EnableFeaturesState,
  Web_BackupView_BackupView_Error,
  Web_BackupView_BackupView_ErrorState,
  Web_BackupView_BackupView_ExcludedItems,
  Web_BackupView_BackupView_ExcludedSections,
  Web_BackupView_BackupView_ExportOpen,
  Web_BackupView_BackupView_ExportOpenState,
  Web_BackupView_BackupView_FeatureCount,
  Web_BackupView_BackupView_FeaturesRequiringFixes,
  Web_BackupView_BackupView_FeaturesSwitchedOff,
  Web_BackupView_BackupView_FeaturesThatNeedFixes,
  Web_BackupView_BackupView_FeaturesThatTurnOn,
  Web_BackupView_BackupView_Filename,
  Web_BackupView_BackupView_FilenameState,
  Web_BackupView_BackupView_FixPronoun,
  Web_BackupView_BackupView_ImportOpen,
  Web_BackupView_BackupView_ImportOpenState,
  Web_BackupView_BackupView_LoadSecurity,
  Web_BackupView_BackupView_LoadSecurity_Returns,
  Web_BackupView_BackupView_LoadSource,
  Web_BackupView_BackupView_LoadSource_NextFilename,
  Web_BackupView_BackupView_LoadSource_NextPreview,
  Web_BackupView_BackupView_LoadSource_NextSource,
  Web_BackupView_BackupView_LoadSource_Returns,
  Web_BackupView_BackupView_Next,
  Web_BackupView_BackupView_Next_Returns,
  Web_BackupView_BackupView_NextSource,
  Web_BackupView_BackupView_OnImported,
  Web_BackupView_BackupView_PasskeyAvailable,
  Web_BackupView_BackupView_Preview,
  Web_BackupView_BackupView_PreviewExcluded,
  Web_BackupView_BackupView_PreviewState,
  Web_BackupView_BackupView_ProgressJob,
  Web_BackupView_BackupView_ProgressJobState,
  Web_BackupView_BackupView_Props,
  Web_BackupView_BackupView_Returns,
  Web_BackupView_BackupView_ReviewItems,
  Web_BackupView_BackupView_ReviewNotes,
  Web_BackupView_BackupView_RunningImport,
  Web_BackupView_BackupView_Sections,
  Web_BackupView_BackupView_Security,
  Web_BackupView_BackupView_SecurityState,
  Web_BackupView_BackupView_SelectSource,
  Web_BackupView_BackupView_SelectSource_Returns,
  Web_BackupView_BackupView_SelectSource_Type,
  Web_BackupView_BackupView_Server,
  Web_BackupView_BackupView_SetBusy,
  Web_BackupView_BackupView_SetEnableFeatures,
  Web_BackupView_BackupView_SetError,
  Web_BackupView_BackupView_SetExportOpen,
  Web_BackupView_BackupView_SetFilename,
  Web_BackupView_BackupView_SetImportOpen,
  Web_BackupView_BackupView_SetPreview,
  Web_BackupView_BackupView_SetProgressJob,
  Web_BackupView_BackupView_SetSecurity,
  Web_BackupView_BackupView_SetSource,
  Web_BackupView_BackupView_SetSourceType,
  Web_BackupView_BackupView_SetStep,
  Web_BackupView_BackupView_SettingRows,
  Web_BackupView_BackupView_SettingsImportable,
  Web_BackupView_BackupView_Skipped,
  Web_BackupView_BackupView_SkippedVerb,
  Web_BackupView_BackupView_Source,
  Web_BackupView_BackupView_SourceState,
  Web_BackupView_BackupView_SourceType,
  Web_BackupView_BackupView_SourceTypeState,
  Web_BackupView_BackupView_StayOffVerb,
  Web_BackupView_BackupView_Step,
  Web_BackupView_BackupView_Steps,
  Web_BackupView_BackupView_StepState,
  Web_BackupView_BackupView_Title,
  Web_BackupView_BackupView_TurnOnVerb,
  Web_BackupView_BackupView_WizardSteps,
  Web_BackupView_BaseWizardSteps,
  Web_BackupView_CountLabel_Count,
  Web_BackupView_CountLabel_Noun,
  Web_BackupView_CountLabel_Plural,
  Web_BackupView_CountLabel_Returns,
  Web_BackupView_CountLabel_Singular,
  Web_BackupView_EmptySecurity,
  Web_BackupView_ExportOptions,
} from '@/types/web/backup-view.d.ts';

/**
 * Backup View - Export Options.
 *
 * Describes every portable section and selects all of them initially.
 * The shared dialog renders these app-specific choices.
 *
 * @since 4.0.0
 */
const exportOptions: Web_BackupView_ExportOptions = [
  {
    description: 'Bot Token and connection state.',
    id: 'connection',
    label: 'Connection',
  },
  {
    description: 'Every feature’s settings for every server, including secrets.',
    id: 'features',
    label: 'Features',
  },
  {
    description: 'Targets, events, settings, and secrets.',
    id: 'notifications',
    label: 'Notifications',
  },
  {
    description: 'Names, scopes, expiry, and stored hashes.',
    id: 'accessTokens',
    label: 'Access tokens',
  },
];

/**
 * Backup View - Base Wizard Steps.
 *
 * Defines the approved shared import flow.
 * Confirmation replaces Review in place before progress begins.
 *
 * @since 4.0.0
 */
const baseWizardSteps: Web_BackupView_BaseWizardSteps = [
  {
    id: 'source',
    label: 'Source',
  },
  {
    id: 'settings',
    label: 'Settings',
  },
  {
    id: 'review',
    label: 'Review',
  },
];

/**
 * Backup View - Empty Security.
 *
 * Supplies a safe value until current factors are loaded.
 * Real account state replaces it before confirmation.
 *
 * @since 4.0.0
 */
const emptySecurity: Web_BackupView_EmptySecurity = {
  hostname: '',
  passkeys: [],
  passkeysAvailable: false,
  recoveryCodesRemaining: 0,
  totpEnabled: false,
  username: '',
};

/**
 * Backup View - Count Label.
 *
 * Formats a count with correct singular and plural text.
 * Review and completion copy reuse the same helper.
 *
 * @param {Web_BackupView_CountLabel_Count}    count    - Count.
 * @param {Web_BackupView_CountLabel_Singular} singular - Singular.
 * @param {Web_BackupView_CountLabel_Plural}   [plural] - Plural.
 *
 * @returns {Web_BackupView_CountLabel_Returns}
 *
 * @since 4.0.0
 */
const countLabel = (count: Web_BackupView_CountLabel_Count, singular: Web_BackupView_CountLabel_Singular, plural: Web_BackupView_CountLabel_Plural = `${singular}s`): Web_BackupView_CountLabel_Returns => {
  const noun: Web_BackupView_CountLabel_Noun = (count === 1) ? singular : plural;

  return `${String(count)} ${noun}`;
};

/**
 * Backup View - Backup View.
 *
 * Owns app-specific format and source handling while using the shared backup console.
 * Shared components provide the approved visual foundation.
 *
 * @param {Web_BackupView_BackupView_Props} props - Props.
 *
 * @returns {Web_BackupView_BackupView_Returns}
 *
 * @since 4.0.0
 */
export const BackupView = (props: Web_BackupView_BackupView_Props): Web_BackupView_BackupView_Returns => {
  const onImported: Web_BackupView_BackupView_OnImported = props['onImported'];
  const server: Web_BackupView_BackupView_Server = props['server'];
  const exportOpenState: Web_BackupView_BackupView_ExportOpenState = useState<Web_BackupView_BackupView_ExportOpen>(false);
  const exportOpen: Web_BackupView_BackupView_ExportOpen = exportOpenState[0];
  const setExportOpen: Web_BackupView_BackupView_SetExportOpen = exportOpenState[1];
  const importOpenState: Web_BackupView_BackupView_ImportOpenState = useState<Web_BackupView_BackupView_ImportOpen>(false);
  const importOpen: Web_BackupView_BackupView_ImportOpen = importOpenState[0];
  const setImportOpen: Web_BackupView_BackupView_SetImportOpen = importOpenState[1];
  const stepState: Web_BackupView_BackupView_StepState = useState<Web_BackupView_BackupView_Step>('source');
  const step: Web_BackupView_BackupView_Step = stepState[0];
  const setStep: Web_BackupView_BackupView_SetStep = stepState[1];
  const sourceTypeState: Web_BackupView_BackupView_SourceTypeState = useState<Web_BackupView_BackupView_SourceType>('export');
  const sourceType: Web_BackupView_BackupView_SourceType = sourceTypeState[0];
  const setSourceType: Web_BackupView_BackupView_SetSourceType = sourceTypeState[1];
  const filenameState: Web_BackupView_BackupView_FilenameState = useState<Web_BackupView_BackupView_Filename>('');
  const filename: Web_BackupView_BackupView_Filename = filenameState[0];
  const setFilename: Web_BackupView_BackupView_SetFilename = filenameState[1];
  const sourceState: Web_BackupView_BackupView_SourceState = useState<Web_BackupView_BackupView_Source>(null);
  const source: Web_BackupView_BackupView_Source = sourceState[0];
  const setSource: Web_BackupView_BackupView_SetSource = sourceState[1];
  const previewState: Web_BackupView_BackupView_PreviewState = useState<Web_BackupView_BackupView_Preview>(null);
  const preview: Web_BackupView_BackupView_Preview = previewState[0];
  const setPreview: Web_BackupView_BackupView_SetPreview = previewState[1];
  const securityState: Web_BackupView_BackupView_SecurityState = useState<Web_BackupView_BackupView_Security>(emptySecurity);
  const security: Web_BackupView_BackupView_Security = securityState[0];
  const setSecurity: Web_BackupView_BackupView_SetSecurity = securityState[1];
  const enableFeaturesState: Web_BackupView_BackupView_EnableFeaturesState = useState<Web_BackupView_BackupView_EnableFeatures>(false);
  const enableFeatures: Web_BackupView_BackupView_EnableFeatures = enableFeaturesState[0];
  const setEnableFeatures: Web_BackupView_BackupView_SetEnableFeatures = enableFeaturesState[1];
  const busyState: Web_BackupView_BackupView_BusyState = useState<Web_BackupView_BackupView_Busy>(false);
  const busy: Web_BackupView_BackupView_Busy = busyState[0];
  const setBusy: Web_BackupView_BackupView_SetBusy = busyState[1];
  const errorState: Web_BackupView_BackupView_ErrorState = useState<Web_BackupView_BackupView_Error>('');
  const error: Web_BackupView_BackupView_Error = errorState[0];
  const setError: Web_BackupView_BackupView_SetError = errorState[1];
  const progressJobState: Web_BackupView_BackupView_ProgressJobState = useState<Web_BackupView_BackupView_ProgressJob>(null);
  const progressJob: Web_BackupView_BackupView_ProgressJob = progressJobState[0];
  const setProgressJob: Web_BackupView_BackupView_SetProgressJob = progressJobState[1];

  const runningImport: Web_BackupView_BackupView_RunningImport = useMemo<Web_BackupView_BackupView_RunningImport>(() => {
    if (progressJob === null) {
      return null;
    }

    let title: Web_BackupView_BackupView_Title = 'Import in progress';
    let detail: Web_BackupView_BackupView_Detail = `Imported ${String(progressJob['completed'])} of ${String(progressJob['total'])}`;

    if (progressJob['status'] === 'completed') {
      title = 'Import complete';
      detail = 'See what changed';
    } else if (progressJob['status'] === 'failed') {
      title = 'Import stopped';
      detail = progressJob['error'] || 'Needs review';
    }

    return {
      detail,
      progress: (progressJob['total'] === 0) ? 0 : progressJob['completed'] / progressJob['total'],
      title,
    };
  }, [progressJob]);

  const passkeyAvailable: Web_BackupView_BackupView_PasskeyAvailable = security['passkeysAvailable'] && security['passkeys'].length > 0;
  const wizardSteps: Web_BackupView_BackupView_WizardSteps = useMemo<Web_BackupView_BackupView_WizardSteps>(() => {
    const steps: Web_BackupView_BackupView_Steps = [...baseWizardSteps];

    if (step === 'importing') {
      steps.push({
        id: 'importing',
        label: 'Importing',
      });
    }

    return steps;
  }, [step]);
  const featuresRequiringFixes: Web_BackupView_BackupView_FeaturesRequiringFixes = (preview !== null && preview['legacy'] !== undefined) ? preview['legacy']['featuresRequiringFixes'] : [];
  const settingRows: Web_BackupView_BackupView_SettingRows = (preview !== null) ? preview['sections'].filter((section) => section['willImport']).map((section) => ({
    changed: section['file'] !== section['here'],
    fileValue: section['file'],
    hereValue: section['here'],
    id: section['id'],
    label: section['label'],
  })) : [];
  const attentionItems: Web_BackupView_BackupView_AttentionItems = featuresRequiringFixes.map(
    (feature) => ({
      id: feature['id'],
      label: feature['label'],
      reason: feature['reason'],
    }),
  );

  // Only values the file holds but this import leaves out. Sections the file lacks change
  // nothing, and local-only data is covered by the Review note that it stays here.
  const excludedSections: Web_BackupView_BackupView_ExcludedSections = (preview !== null) ? preview['sections'].filter((section) => section['willImport'] === false && section['file'] !== 'Not included').map((section) => ({
    id: section['id'],
    label: section['label'],
    reason: section['reason'] ?? '',
  })) : [];
  const previewExcluded: Web_BackupView_BackupView_PreviewExcluded = (preview !== null) ? preview['excluded'] : [];
  const excludedItems: Web_BackupView_BackupView_ExcludedItems = [
    ...excludedSections,
    ...previewExcluded,
  ];
  const reviewItems: Web_BackupView_BackupView_ReviewItems = [];

  if (preview !== null) {
    if (preview['summary']['connection'] !== 'skipped') {
      const connectionVerb: Web_BackupView_BackupView_ConnectionVerb = (preview['summary']['connection'] === 'added') ? 'Add' : 'Replace';

      reviewItems.push({
        id: 'connection',
        text: `${connectionVerb} the connection`,
      });
    }

    if (preview['summary']['features']['servers'] > 0) {
      if (preview['source'] === 'legacy' && preview['legacy'] !== undefined) {
        const featureCount: Web_BackupView_BackupView_FeatureCount = preview['summary']['features']['features'];
        const featuresThatNeedFixes: Web_BackupView_BackupView_FeaturesThatNeedFixes = preview['legacy']['featuresRequiringFixes'].length;
        const featuresThatTurnOn: Web_BackupView_BackupView_FeaturesThatTurnOn = preview['legacy']['featuresThatTurnOn'];
        const featuresSwitchedOff: Web_BackupView_BackupView_FeaturesSwitchedOff = Math.max(0, featureCount - featuresThatNeedFixes - featuresThatTurnOn);

        if (featuresThatTurnOn > 0) {
          const turnOnVerb: Web_BackupView_BackupView_TurnOnVerb = (featuresThatTurnOn === 1) ? 'turns' : 'turn';

          reviewItems.push({
            id: 'features-on',
            text: `Import ${countLabel(featuresThatTurnOn, 'feature')} that ${turnOnVerb} on`,
          });
        }

        if (featuresSwitchedOff > 0) {
          reviewItems.push({
            id: 'features-off',
            text: `Import ${countLabel(featuresSwitchedOff, 'feature')} switched off`,
          });
        }

        if (featuresThatNeedFixes > 0) {
          const stayOffVerb: Web_BackupView_BackupView_StayOffVerb = (featuresThatNeedFixes === 1) ? 'stays' : 'stay';
          const fixPronoun: Web_BackupView_BackupView_FixPronoun = (featuresThatNeedFixes === 1) ? 'it' : 'them';

          reviewItems.push({
            id: 'features-needing-fixes',
            text: `Import ${countLabel(featuresThatNeedFixes, 'feature')} that ${stayOffVerb} off until you fix ${fixPronoun}`,
          });
        }
      } else {
        reviewItems.push({
          id: 'features',
          text: `Replace ${countLabel(preview['summary']['features']['features'], 'feature')} for ${countLabel(preview['summary']['features']['servers'], 'server')}`,
        });
      }
    }

    if (preview['summary']['notifications']['added'] > 0) {
      reviewItems.push({
        id: 'notifications-added',
        text: `Add ${countLabel(preview['summary']['notifications']['added'], 'notification')}`,
      });
    }

    if (preview['summary']['notifications']['replaced'] > 0) {
      reviewItems.push({
        id: 'notifications-replaced',
        text: `Replace ${countLabel(preview['summary']['notifications']['replaced'], 'notification')} with the same name`,
      });
    }

    if (preview['summary']['accessTokens']['added'] > 0) {
      reviewItems.push({
        id: 'tokens-added',
        text: `Add ${countLabel(preview['summary']['accessTokens']['added'], 'access token')}`,
      });
    }

    if (preview['summary']['accessTokens']['skipped'] > 0) {
      const skipped: Web_BackupView_BackupView_Skipped = preview['summary']['accessTokens']['skipped'];
      const skippedVerb: Web_BackupView_BackupView_SkippedVerb = (skipped === 1) ? 'is' : 'are';

      reviewItems.push({
        id: 'tokens-skipped',
        text: `Skip ${countLabel(skipped, 'access token')} that ${skippedVerb} already here`,
      });
    }
  }

  const reviewNotes: Web_BackupView_BackupView_ReviewNotes = [];

  if (
    preview !== null
    && preview['source'] === 'legacy'
    && source !== null
    && source['type'] === 'legacy'
    && source['enableFeatures'] === false
    && preview['summary']['features']['features'] > 0
  ) {
    reviewNotes.push({
      icon: 'features',
      id: 'legacy-features-off',
      text: 'Imported features stay off until you turn them on.',
    });
  }

  reviewNotes.push(
    {
      icon: 'clock',
      id: 'transaction',
      text: 'Everything is applied at once after you confirm.',
    },
    {
      icon: 'shield',
      id: 'local-data',
      text: 'Users, sign-in security, sessions, logs and Discord runtime data stay here.',
    },
  );

  /**
   * Backup View - Load Security.
   *
   * Refreshes available confirmation factors.
   * Export and import call this immediately before identity proof.
   *
   * @returns {Web_BackupView_BackupView_LoadSecurity_Returns}
   *
   * @since 4.0.0
   */
  const loadSecurity: Web_BackupView_BackupView_LoadSecurity = async (): Web_BackupView_BackupView_LoadSecurity_Returns => {
    setSecurity(await getAccountSecurity());

    return;
  };

  /**
   * Backup View - Clear Import.
   *
   * Resets transient wizard state after cancellation or completion.
   * Saved application configuration remains untouched.
   *
   * @returns {Web_BackupView_BackupView_ClearImport_Returns}
   *
   * @since 4.0.0
   */
  const clearImport: Web_BackupView_BackupView_ClearImport = (): Web_BackupView_BackupView_ClearImport_Returns => {
    setImportOpen(false);
    setStep('source');
    setSourceType('export');
    setFilename('');
    setSource(null);
    setPreview(null);
    setEnableFeatures(false);
    setError('');
    setBusy(false);
    setProgressJob(null);

    return;
  };

  /**
   * Backup View - Select Source.
   *
   * Changes radio cards and clears the file from the previous source.
   * The next upload receives a fresh authoritative preview.
   *
   * @param {Web_BackupView_BackupView_SelectSource_Type} type - Type.
   *
   * @returns {Web_BackupView_BackupView_SelectSource_Returns}
   *
   * @since 4.0.0
   */
  const selectSource: Web_BackupView_BackupView_SelectSource = (type: Web_BackupView_BackupView_SelectSource_Type): Web_BackupView_BackupView_SelectSource_Returns => {
    if (type !== sourceType) {
      setSourceType(type);
      setFilename('');
      setSource(null);
      setPreview(null);
      setError('');
    }

    return;
  };

  /**
   * Backup View - Load Source.
   *
   * Asks the server for the authoritative comparison plan.
   * The selected filename remains local to the browser.
   *
   * @param {Web_BackupView_BackupView_LoadSource_NextSource}   nextSource   - Next source.
   * @param {Web_BackupView_BackupView_LoadSource_NextFilename} nextFilename - Next filename.
   *
   * @returns {Web_BackupView_BackupView_LoadSource_Returns}
   *
   * @since 4.0.0
   */
  const loadSource: Web_BackupView_BackupView_LoadSource = async (nextSource: Web_BackupView_BackupView_LoadSource_NextSource, nextFilename: Web_BackupView_BackupView_LoadSource_NextFilename): Web_BackupView_BackupView_LoadSource_Returns => {
    const nextPreview: Web_BackupView_BackupView_LoadSource_NextPreview = await previewBackupImport(nextSource);

    setSource(nextSource);
    setFilename(nextFilename);
    setPreview(nextPreview);

    return;
  };

  /**
   * Backup View - Choose File.
   *
   * Strictly parses an export or sends legacy text through the existing mapping.
   * Invalid input never advances to Settings.
   *
   * @param {Web_BackupView_BackupView_ChooseFile_Event} event - Event.
   * @param {Web_BackupView_BackupView_ChooseFile_Type}  type  - Type.
   *
   * @returns {Web_BackupView_BackupView_ChooseFile_Returns}
   *
   * @since 4.0.0
   */
  const chooseFile: Web_BackupView_BackupView_ChooseFile = async (event: Web_BackupView_BackupView_ChooseFile_Event, type: Web_BackupView_BackupView_ChooseFile_Type): Web_BackupView_BackupView_ChooseFile_Returns => {
    const input: Web_BackupView_BackupView_ChooseFile_Input = event.currentTarget;
    const inputFiles: Web_BackupView_BackupView_ChooseFile_InputFiles = input.files;
    const file: Web_BackupView_BackupView_ChooseFile_File = (inputFiles !== null) ? inputFiles[0] : undefined;

    input.value = '';

    if (file === undefined) {
      return;
    }

    selectSource(type);
    setBusy(true);
    setError('');

    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Choose a JSON file smaller than 10 MB.');
      }

      if (type === 'export') {
        const value: Web_BackupView_BackupView_ChooseFile_Value = JSON.parse(await file.text());
        const document: Web_BackupView_BackupView_ChooseFile_Document = parseBackupDocument(value);

        await loadSource({
          document,
          type: 'export',
        }, file.name);
      } else {
        if (server === undefined) {
          throw new Error('Choose a Discord server before importing an older config.json.');
        }

        const legacySource: Web_BackupView_BackupView_ChooseFile_LegacySource = {
          configuration: await file.text(),
          enableFeatures,
          serverId: server['id'],
          type: 'legacy',
        };

        await loadSource(legacySource, file.name);
      }
    } catch (caughtError) {
      let message: Web_BackupView_BackupView_ChooseFile_Message = 'That file could not be read.';

      if (caughtError instanceof SyntaxError) {
        message = 'That file is not valid JSON.';
      } else if (caughtError instanceof Error) {
        message = caughtError.message;
      }

      setFilename('');
      setSource(null);
      setPreview(null);
      setError(message);
    } finally {
      setBusy(false);
    }

    return;
  };

  /**
   * Backup View - Apply Import.
   *
   * Exchanges a one-use grant for one transactional import.
   * Completion refreshes every affected settings view.
   *
   * @param {Web_BackupView_BackupView_ApplyImport_Grant} grant - Grant.
   *
   * @returns {Web_BackupView_BackupView_ApplyImport_Returns}
   *
   * @since 4.0.0
   */
  const applyImport: Web_BackupView_BackupView_ApplyImport = async (grant: Web_BackupView_BackupView_ApplyImport_Grant): Web_BackupView_BackupView_ApplyImport_Returns => {
    if (source === null || preview === null) {
      throw new Error('Choose a backup file first.');
    }

    const items: Web_BackupView_BackupView_ApplyImport_Items = preview['sections'].filter((section) => section['willImport']).map((section) => ({
      context: 'Waiting',
      id: section['id'],
      name: section['label'],
      status: 'Queued',
      tone: 'muted',
    }));

    setStep('importing');
    setBusy(true);
    setProgressJob({
      completed: 0,
      error: '',
      items,
      status: 'running',
      total: items.length,
    });

    try {
      const result: Web_BackupView_BackupView_ApplyImport_Result = await applyBackupImport(source, grant);

      await onImported();

      setProgressJob({
        completed: result['importedSections'].length,
        error: '',
        items: items.map((item) => ({
          ...item,
          context: 'Applied',
          status: 'Imported',
          tone: 'success',
        })),
        status: 'completed',
        total: items.length,
      });
    } catch (caughtError) {
      setProgressJob({
        completed: 0,
        error: (caughtError instanceof Error) ? caughtError.message : 'The import could not be applied.',
        items,
        status: 'failed',
        total: items.length,
      });

      throw caughtError;
    } finally {
      setBusy(false);
    }

    return;
  };

  /**
   * Backup View - Next.
   *
   * Advances the wizard and loads factors before confirmation.
   * Source, Settings, and Review stay available until then.
   *
   * @returns {Web_BackupView_BackupView_Next_Returns}
   *
   * @since 4.0.0
   */
  const next: Web_BackupView_BackupView_Next = (): Web_BackupView_BackupView_Next_Returns => {
    if (step === 'source') {
      setStep('settings');
    } else if (step === 'settings') {
      setStep('review');
    } else if (step === 'review') {
      setBusy(true);
      void loadSecurity().then(() => setStep('confirm')).catch((caughtError) => setError((caughtError instanceof Error) ? caughtError.message : 'Account security could not be loaded.')).finally(() => setBusy(false));
    }

    return;
  };

  /**
   * Backup View - Back.
   *
   * Moves to the preceding review step without losing the source.
   * Progress cannot be reversed after apply starts.
   *
   * @returns {Web_BackupView_BackupView_Back_Returns}
   *
   * @since 4.0.0
   */
  const back: Web_BackupView_BackupView_Back = (): Web_BackupView_BackupView_Back_Returns => {
    if (step === 'settings') {
      setStep('source');
    } else if (step === 'review') {
      setStep('settings');
    } else if (step === 'confirm') {
      setStep('review');
    }

    return;
  };

  let content: Web_BackupView_BackupView_Content = <div />;

  if (step === 'source') {
    content = (
      <div className="backup-source-grid">
        <BackupFileSource
          busy={busy}
          description="A JSON file made from this Backup page."
          fileName={(sourceType === 'export') ? filename : ''}
          label="An export file"
          name="backup-source"
          onFileChange={(event) => {
            void chooseFile(event, 'export');

            return;
          }}
          onSelect={() => selectSource('export')}
          selected={sourceType === 'export'}
        />
        <BackupFileSource
          busy={busy}
          description={(server === undefined) ? 'Choose a Discord server first.' : `The older format for ${server['name']}.`}
          fileName={(sourceType === 'legacy') ? filename : ''}
          label="An older config.json"
          name="backup-source"
          onFileChange={(event) => {
            void chooseFile(event, 'legacy');

            return;
          }}
          onSelect={() => selectSource('legacy')}
          selected={sourceType === 'legacy'}
        />
        {(sourceType === 'legacy') ? (
          <label className="check-row backup-source-option">
            <input
              aria-label="Turn on features that pass checks"
              checked={enableFeatures}
              disabled={busy}
              onChange={(event) => {
                const enabled: Web_BackupView_BackupView_Enabled = event.currentTarget.checked;

                setEnableFeatures(enabled);

                if (source !== null && source['type'] === 'legacy') {
                  const nextSource: Web_BackupView_BackupView_NextSource = {
                    ...source,
                    enableFeatures: enabled,
                  };

                  setBusy(true);
                  void loadSource(nextSource, filename).catch((caughtError) => setError((caughtError instanceof Error) ? caughtError.message : 'The file could not be compared.')).finally(() => setBusy(false));
                }

                return;
              }}
              type="checkbox"
            />
            <span>
              <strong>Turn on features that pass checks</strong>
              <small>The rest stay off until you review them.</small>
            </span>
          </label>
        ) : null}
        {(error === '') ? null : <div className="form-error" role="alert">{error}</div>}
      </div>
    );
  } else if (step === 'settings' && preview !== null) {
    content = <BackupSettingsCompare attentionItems={attentionItems} description="Review what changes and what remains here." excludedItems={excludedItems} fileColumn="In the file" rows={settingRows} />;
  } else if (step === 'review') {
    content = <BackupReviewList error={error} items={reviewItems} notes={reviewNotes} />;
  } else if (step === 'confirm') {
    content = (
      <ConfirmIdentityStep
        authenticatorEnabled={security['totpEnabled']}
        description="Confirm the current account before applying this import."
        onBack={back}
        onConfirm={async (password, code) => confirmBackupOperation('import', password, code)}
        onConfirmed={applyImport}
        onPasskey={async () => confirmBackupOperationWithPasskey('import')}
        passkeyAvailable={passkeyAvailable}
      />
    );
  } else if (step === 'importing' && progressJob !== null) {
    content = (
      <BackupImportProgress
        applyingLabel="Applying configuration in one transaction…"
        contextColumn="Change"
        headingSummary={countLabel(progressJob['total'], 'section')}
        itemColumn="Section"
        job={progressJob}
        onBackground={() => setImportOpen(false)}
        onDone={() => {
          showToast('Imported the selected backup configuration.', true);
          clearImport();

          return;
        }}
        progressLabel={(completed, total) => `Imported ${String(completed)} of ${String(total)}`}
      />
    );
  }

  const settingsImportable: Web_BackupView_BackupView_SettingsImportable = preview !== null && preview['sections'].some((section) => section['willImport']);

  return (
    <section className="workspace-section">
      <div className="workspace-heading">
        <h1>Backup</h1>
        <p>Export or import this setup.</p>
      </div>
      <BackupSection
        description="Save this setup to a file, or bring one in. You can also import an older config.json."
        importJob={runningImport}
        onExport={() => {
          setExportOpen(true);
          void loadSecurity().catch((caughtError) => showToast((caughtError instanceof Error) ? caughtError.message : 'Account security could not be loaded.', false));

          return;
        }}
        onImport={() => {
          setImportOpen(true);
          setStep((progressJob === null) ? 'source' : 'importing');
          setError('');

          return;
        }}
        onOpenImport={() => setImportOpen(true)}
        rowLabel="Export and import"
        title="Backup"
      />
      <BackupExportDialog
        authenticatorEnabled={security['totpEnabled']}
        description="Choose what to save in this export."
        onClose={() => setExportOpen(false)}
        onConfirm={async (password, code) => confirmBackupOperation('export', password, code)}
        onExport={async (selection, grant) => {
          const sections: Web_BackupView_BackupView_Sections = {
            accessTokens: selection['accessTokens'] === true,
            connection: selection['connection'] === true,
            features: selection['features'] === true,
            notifications: selection['notifications'] === true,
          };

          await downloadBackupExport(sections, grant);

          showToast('Export downloaded. Keep it somewhere safe.', true);

          return;
        }}
        onPasskey={async () => confirmBackupOperationWithPasskey('export')}
        open={exportOpen}
        options={exportOptions}
        passkeyAvailable={passkeyAvailable}
        secretWarning="The file includes passwords and keys in plain text. Keep it somewhere safe."
        title="Export"
      />
      <BackupImportWizardShell
        backDisabled={step === 'source'}
        busy={busy}
        currentStep={(step === 'confirm') ? 'review' : step}
        description={(step === 'importing') ? 'You can close this dialog without stopping the import.' : 'Bring settings into this Stonker Bot for Discord.'}
        hideNavigation={step === 'confirm' || step === 'importing'}
        nextDisabled={(
          (
            step === 'source'
            && preview === null
          )
          || (
            step === 'settings'
            && settingsImportable !== true
          )
        )}
        nextIcon={(step === 'review') ? 'upload' : undefined}
        nextLabel={(step === 'review') ? 'Import' : 'Next'}
        onBack={back}
        onClose={() => {
          if (progressJob !== null) {
            setImportOpen(false);
          } else {
            clearImport();
          }

          return;
        }}
        onNext={next}
        open={importOpen}
        steps={wizardSteps}
        title="Import"
      >
        {content}
      </BackupImportWizardShell>
    </section>
  );
};
