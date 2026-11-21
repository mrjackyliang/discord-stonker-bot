import { useState } from 'react';

import {
  BotControls,
  NoServer,
} from '@/web/bot-controls.tsx';
import { formatDate } from '@/web/format.ts';
import {
  describeBot,
  describeService,
  roleLabels,
  serverAccessLabel,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type {
  Web_OverviewView_OverviewView_Bot,
  Web_OverviewView_OverviewView_Busy,
  Web_OverviewView_OverviewView_BusyState,
  Web_OverviewView_OverviewView_Can,
  Web_OverviewView_OverviewView_Copied,
  Web_OverviewView_OverviewView_CopiedState,
  Web_OverviewView_OverviewView_EnabledFeaturesNoun,
  Web_OverviewView_OverviewView_Error,
  Web_OverviewView_OverviewView_ErrorState,
  Web_OverviewView_OverviewView_OnBotAction,
  Web_OverviewView_OverviewView_OnOpenConnection,
  Web_OverviewView_OverviewView_OnOpenFeatures,
  Web_OverviewView_OverviewView_OnRefresh,
  Web_OverviewView_OverviewView_Principal,
  Web_OverviewView_OverviewView_Props,
  Web_OverviewView_OverviewView_Refresh,
  Web_OverviewView_OverviewView_Refresh_Returns,
  Web_OverviewView_OverviewView_Returns,
  Web_OverviewView_OverviewView_Server,
  Web_OverviewView_OverviewView_Servers,
  Web_OverviewView_OverviewView_Service,
  Web_OverviewView_OverviewView_Services,
  Web_OverviewView_OverviewView_ServiceStatus,
  Web_OverviewView_OverviewView_SetBusy,
  Web_OverviewView_OverviewView_SetCopied,
  Web_OverviewView_OverviewView_SetError,
  Web_OverviewView_OverviewView_Status,
  Web_OverviewView_ServiceNames,
  Web_OverviewView_ToneClasses,
} from '@/types/web/overview-view.d.ts';

/**
 * Overview View - Service Names.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serviceNames: Web_OverviewView_ServiceNames = {
  bot: 'Bot process',
  web: 'Control panel',
  worker: 'Scheduled jobs',
};

/**
 * Overview View - Tone Classes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const toneClasses: Web_OverviewView_ToneClasses = {
  blocked: 'details-status-blocked',
  connecting: 'details-status-connecting',
  idle: '',
  protected: 'details-status-protected',
};

/**
 * Overview View - Overview View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_OverviewView_OverviewView_Props} props - Props.
 *
 * @returns {Web_OverviewView_OverviewView_Returns}
 *
 * @since 4.0.0
 */
export const OverviewView = (props: Web_OverviewView_OverviewView_Props): Web_OverviewView_OverviewView_Returns => {
  const bot: Web_OverviewView_OverviewView_Bot = props['bot'];
  const can: Web_OverviewView_OverviewView_Can = props['can'];
  const onBotAction: Web_OverviewView_OverviewView_OnBotAction = props['onBotAction'];
  const onOpenConnection: Web_OverviewView_OverviewView_OnOpenConnection = props['onOpenConnection'];
  const onOpenFeatures: Web_OverviewView_OverviewView_OnOpenFeatures = props['onOpenFeatures'];
  const onRefresh: Web_OverviewView_OverviewView_OnRefresh = props['onRefresh'];
  const principal: Web_OverviewView_OverviewView_Principal = props['principal'];
  const server: Web_OverviewView_OverviewView_Server = props['server'];
  const servers: Web_OverviewView_OverviewView_Servers = props['servers'];
  const busyState: Web_OverviewView_OverviewView_BusyState = useState<Web_OverviewView_OverviewView_Busy>(false);
  const busy: Web_OverviewView_OverviewView_Busy = busyState[0];
  const setBusy: Web_OverviewView_OverviewView_SetBusy = busyState[1];
  const errorState: Web_OverviewView_OverviewView_ErrorState = useState<Web_OverviewView_OverviewView_Error>('');
  const error: Web_OverviewView_OverviewView_Error = errorState[0];
  const setError: Web_OverviewView_OverviewView_SetError = errorState[1];
  const copiedState: Web_OverviewView_OverviewView_CopiedState = useState<Web_OverviewView_OverviewView_Copied>(false);
  const copied: Web_OverviewView_OverviewView_Copied = copiedState[0];
  const setCopied: Web_OverviewView_OverviewView_SetCopied = copiedState[1];

  /**
   * Overview View - Refresh.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_OverviewView_OverviewView_Refresh_Returns}
   *
   * @since 4.0.0
   */
  const refresh: Web_OverviewView_OverviewView_Refresh = async (): Web_OverviewView_OverviewView_Refresh_Returns => {
    setBusy(true);
    setError('');
    try {
      await onRefresh();
    } catch (caughtError) {
      setError((caughtError instanceof Error) ? caughtError.message : 'The overview could not be loaded.');
    } finally {
      setBusy(false);
    }

    return;
  };

  if (bot === null) {
    return (
      <div className="detail-loading">
        <span className="spinner" />
        Loading the overview…
      </div>
    );
  }

  const status: Web_OverviewView_OverviewView_Status = describeBot(bot);
  const services: Web_OverviewView_OverviewView_Services = [
    'bot',
    'web',
    'worker',
  ];
  const enabledFeaturesNoun: Web_OverviewView_OverviewView_EnabledFeaturesNoun = (server !== undefined && server['enabledFeatures'] === 1) ? 'feature' : 'features';

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Overview</h1>
          <p>{(server === undefined) ? 'The bot hasn\'t joined a Discord server yet.' : `${server['name']} has ${server['enabledFeatures']} ${enabledFeaturesNoun} turned on.`}</p>
        </div>
        <Button
          disabled={busy}
          icon="refresh"
          onClick={() => {
            void refresh();

            return;
          }}
        >
          Refresh
        </Button>
      </div>

      {(error === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{error}</span>
        </div>
      )}

      {(bot['tokenConfigured'] === true) ? null : (
        <div className="panel">
          <section className="form-section">
            <div className="form-section-head">
              <h2>Connect the bot</h2>
            </div>
            <p className="form-section-note">{'The bot can\'t sign in to Discord until you add its token from the Discord Developer Portal.'}</p>
            <div className="panel-actions panel-actions-start">
              <Button onClick={onOpenConnection} variant="primary">Add the bot token</Button>
            </div>
          </section>
        </div>
      )}

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Bot</h2>
            {(can('bot:control') === true) ? <BotControls bot={bot} onBotAction={onBotAction} onError={setError} /> : null}
          </div>
          <dl className="details">
            <div>
              <dt>Status</dt>
              <dd className={toneClasses[status['tone']]}>
                {(status['tone'] === 'idle') ? null : <span className="status-dot" />}
                {status['label']}
              </dd>
            </div>
            <div>
              <dt>Bot token</dt>
              <dd>{(bot['tokenConfigured'] === true) ? 'Saved' : 'Not added'}</dd>
            </div>
            <div>
              <dt>Signed in as</dt>
              <dd>{bot['userTag'] ?? 'Shown once the bot signs in'}</dd>
            </div>
            <div>
              <dt>Application ID</dt>
              <dd>{bot['applicationId'] ?? 'Shown once the bot signs in'}</dd>
            </div>
            {(bot['guildCount'] === null) ? null : (
              <div>
                <dt>Servers joined</dt>
                <dd>{bot['guildCount']}</dd>
              </div>
            )}
          </dl>
          {(bot['resolution'] === null || status['tone'] === 'protected') ? null : (
            <p className="form-notice">
              <Icon name="warning" size={16} />
              <span>{bot['resolution']}</span>
            </p>
          )}
          {(bot['configurationErrors'].length === 0) ? null : (
            <div className="bot-errors">
              <p className="form-section-note">{(bot['configurationErrors'].length === 1) ? 'One feature has settings the bot couldn\'t use:' : `${bot['configurationErrors'].length} features have settings the bot couldn't use:`}</p>
              <ul>
                {bot['configurationErrors'].map((configurationError) => <li key={configurationError}>{configurationError}</li>)}
              </ul>
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <h2>Services</h2>
          </div>
          <dl className="details">
            {services.map((component) => {
              const service: Web_OverviewView_OverviewView_Service = bot['services'].find((candidate) => candidate['component'] === component);
              const serviceStatus: Web_OverviewView_OverviewView_ServiceStatus = describeService(service);

              return (
                <div key={component}>
                  <dt>{serviceNames[component]}</dt>
                  <dd
                    className={`service-status ${toneClasses[serviceStatus['tone']]}`}
                    title={(service === undefined || service['updatedAt'] === null) ? undefined : `Last heartbeat ${formatDate(service['updatedAt'])}`}
                  >
                    {(serviceStatus['tone'] === 'idle') ? null : <span className="status-dot" />}
                    {serviceStatus['label']}
                    {(serviceStatus['detail'] === null) ? null : <span className="service-status-detail">{serviceStatus['detail']}</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      </div>

      {(server === undefined) ? (
        <NoServer addServerUrl={bot['addServerUrl']} onOpenConnection={onOpenConnection} />
      ) : (
        <div className="panel">
          <section className="form-section">
            <div className="form-section-head">
              <h2>{server['name']}</h2>
              <button className="text-button" onClick={onOpenFeatures} type="button">Open features</button>
            </div>
            <dl className="details">
              <div>
                <dt>Server ID</dt>
                <dd>
                  {server['id']}
                  <button
                    aria-label="Copy server ID"
                    className="icon-button icon-button-inline"
                    onClick={() => {
                      void navigator.clipboard.writeText(server['id']).then(() => {
                        setCopied(true);

                        window.setTimeout(() => setCopied(false), 1800);

                        return;
                      });

                      return;
                    }}
                    title="Copy server ID"
                    type="button"
                  >
                    <Icon name={(copied === true) ? 'check' : 'copy'} size={14} />
                  </button>
                </dd>
              </div>
              <div>
                <dt>Features on</dt>
                <dd>{server['enabledFeatures']}</dd>
              </div>
              <div>
                <dt>Bot in this server</dt>
                <dd>{(server['available'] === true) ? 'Yes' : 'No, it was removed'}</dd>
              </div>
              <div>
                <dt>Servers you can open</dt>
                <dd>{servers.length}</dd>
              </div>
            </dl>
          </section>
        </div>
      )}

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Your account</h2>
          </div>
          <dl className="details">
            <div>
              <dt>Username</dt>
              <dd>{principal['username'] ?? '—'}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{(principal['role'] === undefined) ? '—' : roleLabels[principal['role']]}</dd>
            </div>
            <div>
              <dt>Server access</dt>
              <dd>{serverAccessLabel(principal['allServers'] ?? false, principal['serverIds'] ?? [], servers)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};
