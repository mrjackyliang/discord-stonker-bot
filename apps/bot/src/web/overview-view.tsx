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

import type { ReactElement } from 'react';

import type {
  Web_Api_Service,
  Web_Api_ServiceComponent,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_BotStatus,
  Web_Components_OverviewView_Props,
  Web_Components_ServiceStatus,
} from '@/types/web/components.d.ts';

/**
 * Overview View - Service names.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const serviceNames: Record<Web_Api_ServiceComponent, string> = {
  bot: 'Bot process',
  web: 'Control panel',
  worker: 'Scheduled jobs',
};

/**
 * Overview View - Tone classes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const toneClasses: Record<Web_Components_BotStatus['tone'], string> = {
  blocked: 'details-status-blocked',
  connecting: 'details-status-connecting',
  idle: '',
  protected: 'details-status-protected',
};

/**
 * Overview View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const OverviewView = ({
  bot,
  can,
  onBotAction,
  onOpenConnection,
  onOpenFeatures,
  onRefresh,
  principal,
  server,
  servers,
}: Web_Components_OverviewView_Props): ReactElement => {
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    error,
    setError,
  ] = useState<string>('');
  const [
    copied,
    setCopied,
  ] = useState<boolean>(false);

  /**
   * Overview View - Refresh.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const refresh = async (): Promise<void> => {
    setBusy(true);
    setError('');
    try {
      await onRefresh();
    } catch (caughtError) {
      setError((caughtError instanceof Error) ? caughtError.message : 'The overview could not be loaded.');
    } finally {
      setBusy(false);
    }
  };

  if (bot === null) {
    return (
      <div className="detail-loading">
        <span className="spinner" />
        Loading the overview…
      </div>
    );
  }

  const status: Web_Components_BotStatus = describeBot(bot);
  const services: Web_Api_ServiceComponent[] = [
    'bot',
    'web',
    'worker',
  ];

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Overview</h1>
          <p>{(server === undefined) ? 'The bot hasn\'t joined a Discord server yet.' : `${server['name']} has ${server['enabledFeatures']} ${(server['enabledFeatures'] === 1) ? 'feature' : 'features'} turned on.`}</p>
        </div>
        <Button
          disabled={busy}
          icon="refresh"
          onClick={(): void => {
            void refresh();
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

      {(bot['tokenConfigured']) ? null : (
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
            {(can('bot:control')) ? <BotControls bot={bot} onBotAction={onBotAction} onError={setError} /> : null}
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
              <dd>{(bot['tokenConfigured']) ? 'Saved' : 'Not added'}</dd>
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
                {bot['configurationErrors'].map((configurationError: string): ReactElement => <li key={configurationError}>{configurationError}</li>)}
              </ul>
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <h2>Services</h2>
          </div>
          <dl className="details">
            {services.map((component: Web_Api_ServiceComponent): ReactElement => {
              const service: Web_Api_Service | undefined = bot['services'].find((candidate: Web_Api_Service): boolean => candidate['component'] === component);
              const serviceStatus: Web_Components_ServiceStatus = describeService(service);

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
                    onClick={(): void => {
                      void navigator.clipboard.writeText(server['id']).then((): void => {
                        setCopied(true);
                        window.setTimeout((): void => setCopied(false), 1800);
                      });
                    }}
                    title="Copy server ID"
                    type="button"
                  >
                    <Icon name={(copied) ? 'check' : 'copy'} size={14} />
                  </button>
                </dd>
              </div>
              <div>
                <dt>Features on</dt>
                <dd>{server['enabledFeatures']}</dd>
              </div>
              <div>
                <dt>Bot in this server</dt>
                <dd>{(server['available']) ? 'Yes' : 'No, it was removed'}</dd>
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
