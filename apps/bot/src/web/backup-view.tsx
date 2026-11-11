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
  ChangeEvent,
  ReactElement,
} from 'react';

import type { Web_Api_AccountSecurity } from '@/types/web/api.d.ts';
import type {
  Web_BackupComponents_ExportOption,
  Web_BackupComponents_ExportSelection,
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
 * Backup View - Export options.
 *
 * Describes every portable section and selects all of them initially.
 * The shared dialog renders these app-specific choices.
 *
 * @since UNRELEASED
 */
const exportOptions: Web_BackupComponents_ExportOption[] = [
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
 * Backup View - Wizard steps.
 *
 * Defines the approved shared import flow.
 * Confirmation replaces Review in place before progress begins.
 *
 * @since UNRELEASED
 */
const baseWizardSteps: Web_BackupComponents_WizardStep[] = [
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
 * Backup View - Empty security.
 *
 * Supplies a safe value until current factors are loaded.
 * Real account state replaces it before confirmation.
 *
 * @since UNRELEASED
 */
const emptySecurity: Web_Api_AccountSecurity = {
  hostname: '',
  passkeys: [],
  passkeysAvailable: false,
  recoveryCodesRemaining: 0,
  totpEnabled: false,
  username: '',
};

/**
 * Backup View - Count label.
 *
 * Formats a count with correct singular and plural text.
 * Review and completion copy reuse the same helper.
 *
 * @param {number} count    - Count.
 * @param {string} singular - Singular.
 * @param {string} [plural] - Plural.
 *
 * @returns {string}
 *
 * @since UNRELEASED
 */
const countLabel = (count: number, singular: string, plural: string = `${singular}s`): string => `${String(count)} ${(count === 1) ? singular : plural}`;

/**
 * Backup View.
 *
 * Owns app-specific format and source handling while using the shared backup console.
 * Shared components provide the approved visual foundation.
 *
 * @param {Web_Backup_ViewProps} props - Props.
 *
 * @returns {ReactElement}
 *
 * @since UNRELEASED
 */
export const BackupView = ({ onImported, server }: Web_Backup_ViewProps): ReactElement => {
  const [
    exportOpen,
    setExportOpen,
  ] = useState<boolean>(false);
  const [
    importOpen,
    setImportOpen,
  ] = useState<boolean>(false);
  const [
    step,
    setStep,
  ] = useState<Web_Backup_ViewStep>('source');
  const [
    sourceType,
    setSourceType,
  ] = useState<Web_Backup_SourceType>('export');
  const [
    filename,
    setFilename,
  ] = useState<string>('');
  const [
    source,
    setSource,
  ] = useState<Web_Backup_ImportSource | null>(null);
  const [
    preview,
    setPreview,
  ] = useState<Web_Backup_ImportPreview | null>(null);
  const [
    security,
    setSecurity,
  ] = useState<Web_Api_AccountSecurity>(emptySecurity);
  const [
    enableFeatures,
    setEnableFeatures,
  ] = useState<boolean>(false);
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    error,
    setError,
  ] = useState<string>('');
  const [
    progressJob,
    setProgressJob,
  ] = useState<Web_Backup_ProgressJob | null>(null);

  const runningImport: Web_BackupComponents_RunningImport | null = useMemo((): Web_BackupComponents_RunningImport | null => {
    if (progressJob === null) {
      return null;
    }
    let title: string = 'Import in progress';
    let detail: string = `Imported ${String(progressJob['completed'])} of ${String(progressJob['total'])}`;
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

  const passkeyAvailable: boolean = security['passkeysAvailable'] && security['passkeys'].length > 0;
  const wizardSteps: Web_BackupComponents_WizardStep[] = useMemo((): Web_BackupComponents_WizardStep[] => {
    const steps: Web_BackupComponents_WizardStep[] = [...baseWizardSteps];
    if (step === 'importing') {
      steps.push({
        id: 'importing',
        label: 'Importing',
      });
    }
    return steps;
  }, [step]);
  const featuresRequiringFixes: Web_Backup_ExcludedItem[] = preview?.['legacy']?.['featuresRequiringFixes'] ?? [];
  const settingRows: Web_BackupComponents_SettingsCompareRow[] = preview?.['sections'].filter((section): boolean => section['willImport']).map((section): Web_BackupComponents_SettingsCompareRow => ({
    changed: section['file'] !== section['here'],
    fileValue: section['file'],
    hereValue: section['here'],
    id: section['id'],
    label: section['label'],
  })) ?? [];
  const attentionItems: Web_BackupComponents_SettingsCompareExcludedItem[] = featuresRequiringFixes.map(
    (feature): Web_BackupComponents_SettingsCompareExcludedItem => ({
      id: feature['id'],
      label: feature['label'],
      reason: feature['reason'],
    }),
  );
  // Only values the file holds but this import leaves out. Sections the file lacks change
  // nothing, and local-only data is covered by the Review note that it stays here.
  const excludedItems: Web_BackupComponents_SettingsCompareExcludedItem[] = [
    ...(preview?.['sections'].filter((section): boolean => section['willImport'] === false && section['file'] !== 'Not included').map((section): Web_BackupComponents_SettingsCompareExcludedItem => ({
      id: section['id'],
      label: section['label'],
      reason: section['reason'] ?? '',
    })) ?? []),
    ...(preview?.['excluded'] ?? []),
  ];
  const reviewItems: Web_BackupComponents_ReviewItem[] = [];
  if (preview !== null) {
    if (preview['summary']['connection'] !== 'skipped') {
      reviewItems.push({
        id: 'connection',
        text: `${(preview['summary']['connection'] === 'added') ? 'Add' : 'Replace'} the connection`,
      });
    }
    if (preview['summary']['features']['servers'] > 0) {
      if (preview['source'] === 'legacy' && preview['legacy'] !== undefined) {
        const featureCount: number = preview['summary']['features']['features'];
        const featuresThatNeedFixes: number = preview['legacy']['featuresRequiringFixes'].length;
        const featuresThatTurnOn: number = preview['legacy']['featuresThatTurnOn'];
        const featuresSwitchedOff: number = Math.max(0, featureCount - featuresThatNeedFixes - featuresThatTurnOn);

        if (featuresThatTurnOn > 0) {
          const turnOnVerb: string = (featuresThatTurnOn === 1) ? 'turns' : 'turn';
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
          const stayOffVerb: string = (featuresThatNeedFixes === 1) ? 'stays' : 'stay';
          const fixPronoun: string = (featuresThatNeedFixes === 1) ? 'it' : 'them';
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
      const skipped: number = preview['summary']['accessTokens']['skipped'];
      reviewItems.push({
        id: 'tokens-skipped',
        text: `Skip ${countLabel(skipped, 'access token')} that ${(skipped === 1) ? 'is' : 'are'} already here`,
      });
    }
  }
  const reviewNotes: Web_BackupComponents_ReviewNote[] = [];
  if (
    preview?.['source'] === 'legacy'
    && source?.['type'] === 'legacy'
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
   * Backup View - Load security.
   *
   * Refreshes available confirmation factors.
   * Export and import call this immediately before identity proof.
   *
   * @returns {Promise<void>}
   *
   * @since UNRELEASED
   */
  const loadSecurity = async (): Promise<void> => setSecurity(await getAccountSecurity());

  /**
   * Backup View - Clear import.
   *
   * Resets transient wizard state after cancellation or completion.
   * Saved application configuration remains untouched.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const clearImport = (): void => {
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
  };

  /**
   * Backup View - Select source.
   *
   * Changes radio cards and clears the file from the previous source.
   * The next upload receives a fresh authoritative preview.
   *
   * @param {Web_Backup_SourceType} type - Type.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const selectSource = (type: Web_Backup_SourceType): void => {
    if (type !== sourceType) {
      setSourceType(type);
      setFilename('');
      setSource(null);
      setPreview(null);
      setError('');
    }
  };

  /**
   * Backup View - Load source.
   *
   * Asks the server for the authoritative comparison plan.
   * The selected filename remains local to the browser.
   *
   * @param {Web_Backup_ImportSource} nextSource   - Next source.
   * @param {string}                  nextFilename - Next filename.
   *
   * @returns {Promise<void>}
   *
   * @since UNRELEASED
   */
  const loadSource = async (nextSource: Web_Backup_ImportSource, nextFilename: string): Promise<void> => {
    const nextPreview: Web_Backup_ImportPreview = await previewBackupImport(nextSource);
    setSource(nextSource);
    setFilename(nextFilename);
    setPreview(nextPreview);
  };

  /**
   * Backup View - Choose file.
   *
   * Strictly parses an export or sends legacy text through the existing mapping.
   * Invalid input never advances to Settings.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Event.
   * @param {Web_Backup_SourceType}         type  - Type.
   *
   * @returns {Promise<void>}
   *
   * @since UNRELEASED
   */
  const chooseFile = async (event: ChangeEvent<HTMLInputElement>, type: Web_Backup_SourceType): Promise<void> => {
    const input: HTMLInputElement = event.currentTarget;
    const file: File | undefined = input.files?.[0];
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
        const value: unknown = JSON.parse(await file.text());
        const document: Web_Backup_Document = parseBackupDocument(value);
        await loadSource({
          document,
          type: 'export',
        }, file.name);
      } else {
        if (server === undefined) {
          throw new Error('Choose a Discord server before importing an older config.json.');
        }
        const legacySource: Web_Backup_LegacySource = {
          configuration: await file.text(),
          enableFeatures,
          serverId: server['id'],
          type: 'legacy',
        };
        await loadSource(legacySource, file.name);
      }
    } catch (caughtError) {
      let message: string = 'That file could not be read.';
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
  };

  /**
   * Backup View - Apply import.
   *
   * Exchanges a one-use grant for one transactional import.
   * Completion refreshes every affected settings view.
   *
   * @param {string} grant - Grant.
   *
   * @returns {Promise<void>}
   *
   * @since UNRELEASED
   */
  const applyImport = async (grant: string): Promise<void> => {
    if (source === null || preview === null) {
      throw new Error('Choose a backup file first.');
    }
    const items: Web_BackupComponents_ImportProgressItem[] = preview['sections'].filter((section): boolean => section['willImport']).map((section): Web_BackupComponents_ImportProgressItem => ({
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
      const result: Web_Backup_ImportResult = await applyBackupImport(source, grant);
      await onImported();
      setProgressJob({
        completed: result['importedSections'].length,
        error: '',
        items: items.map((item): Web_BackupComponents_ImportProgressItem => ({
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
  };

  /**
   * Backup View - Next.
   *
   * Advances the wizard and loads factors before confirmation.
   * Source, Settings, and Review stay available until then.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const next = (): void => {
    if (step === 'source') {
      setStep('settings');
    } else if (step === 'settings') {
      setStep('review');
    } else if (step === 'review') {
      setBusy(true);
      void loadSecurity().then((): void => setStep('confirm')).catch((caughtError: unknown): void => setError((caughtError instanceof Error) ? caughtError.message : 'Account security could not be loaded.')).finally((): void => setBusy(false));
    }
  };

  /**
   * Backup View - Back.
   *
   * Moves to the preceding review step without losing the source.
   * Progress cannot be reversed after apply starts.
   *
   * @returns {void}
   *
   * @since UNRELEASED
   */
  const back = (): void => {
    if (step === 'settings') {
      setStep('source');
    } else if (step === 'review') {
      setStep('settings');
    } else if (step === 'confirm') {
      setStep('review');
    }
  };

  let content: ReactElement = <div />;
  if (step === 'source') {
    content = (
      <div className="backup-source-grid">
        <BackupFileSource
          busy={busy}
          description="A JSON file made from this Backup page."
          fileName={(sourceType === 'export') ? filename : ''}
          label="An export file"
          name="backup-source"
          onFileChange={(event: ChangeEvent<HTMLInputElement>): void => {
            void chooseFile(event, 'export');
          }}
          onSelect={(): void => selectSource('export')}
          selected={sourceType === 'export'}
        />
        <BackupFileSource
          busy={busy}
          description={(server === undefined) ? 'Choose a Discord server first.' : `The older format for ${server['name']}.`}
          fileName={(sourceType === 'legacy') ? filename : ''}
          label="An older config.json"
          name="backup-source"
          onFileChange={(event: ChangeEvent<HTMLInputElement>): void => {
            void chooseFile(event, 'legacy');
          }}
          onSelect={(): void => selectSource('legacy')}
          selected={sourceType === 'legacy'}
        />
        {(sourceType === 'legacy') ? (
          <label className="check-row backup-source-option">
            <input
              aria-label="Turn on features that pass checks"
              checked={enableFeatures}
              disabled={busy}
              onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                const enabled: boolean = event.currentTarget.checked;
                setEnableFeatures(enabled);
                if (source?.['type'] === 'legacy') {
                  const nextSource: Web_Backup_LegacySource = {
                    ...source,
                    enableFeatures: enabled,
                  };
                  setBusy(true);
                  void loadSource(nextSource, filename).catch((caughtError: unknown): void => setError((caughtError instanceof Error) ? caughtError.message : 'The file could not be compared.')).finally((): void => setBusy(false));
                }
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
        onConfirm={async (password: string, code: string): Promise<string> => confirmBackupOperation('import', password, code)}
        onConfirmed={applyImport}
        onPasskey={async (): Promise<string> => confirmBackupOperationWithPasskey('import')}
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
        onBackground={(): void => setImportOpen(false)}
        onDone={(): void => {
          showToast('Imported the selected backup configuration.', true);
          clearImport();
        }}
        progressLabel={(completed: number, total: number): string => `Imported ${String(completed)} of ${String(total)}`}
      />
    );
  }

  return (
    <section className="workspace-section">
      <div className="workspace-heading">
        <h1>Backup</h1>
        <p>Export or import this setup.</p>
      </div>
      <BackupSection
        description="Save this setup to a file, or bring one in. You can also import an older config.json."
        importJob={runningImport}
        onExport={(): void => {
          setExportOpen(true);
          void loadSecurity().catch((caughtError: unknown): void => showToast((caughtError instanceof Error) ? caughtError.message : 'Account security could not be loaded.', false));
        }}
        onImport={(): void => {
          setImportOpen(true);
          setStep((progressJob === null) ? 'source' : 'importing');
          setError('');
        }}
        onOpenImport={(): void => setImportOpen(true)}
        rowLabel="Export and import"
        title="Backup"
      />
      <BackupExportDialog
        authenticatorEnabled={security['totpEnabled']}
        description="Choose what to save in this export."
        onClose={(): void => setExportOpen(false)}
        onConfirm={async (password: string, code: string): Promise<string> => confirmBackupOperation('export', password, code)}
        onExport={async (selection: Web_BackupComponents_ExportSelection, grant: string): Promise<void> => {
          const sections: Web_Backup_ExportSections = {
            accessTokens: selection['accessTokens'] === true,
            connection: selection['connection'] === true,
            features: selection['features'] === true,
            notifications: selection['notifications'] === true,
          };
          await downloadBackupExport(sections, grant);
          showToast('Export downloaded. Keep it somewhere safe.', true);
        }}
        onPasskey={async (): Promise<string> => confirmBackupOperationWithPasskey('export')}
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
        nextDisabled={(step === 'source' && preview === null) || (step === 'settings' && preview?.['sections'].some((section): boolean => section['willImport']) !== true)}
        nextIcon={(step === 'review') ? 'upload' : undefined}
        nextLabel={(step === 'review') ? 'Import' : 'Next'}
        onBack={back}
        onClose={(): void => {
          if (progressJob !== null) {
            setImportOpen(false);
          } else {
            clearImport();
          }
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
