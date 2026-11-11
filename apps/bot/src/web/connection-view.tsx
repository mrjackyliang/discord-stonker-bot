import { useState } from 'react';

import {
  errorMessage,
  issueFor,
  saveBotToken,
} from '@/web/api.ts';
import { BotControls } from '@/web/bot-controls.tsx';
import { FieldLabel } from '@/web/field-label.tsx';
import { describeBot } from '@/web/labels.ts';
import {
  Button,
  Icon,
  passwordManagerIgnore,
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';

import type {
  ChangeEvent,
  FormEvent,
  ReactElement,
} from 'react';

import type {
  Web_Components_BotStatus,
  Web_Components_ConnectionView_Props,
} from '@/types/web/components.d.ts';

/**
 * Connection View - Tone classes.
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
 * Connection View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const ConnectionView = ({
  bot,
  can,
  onBotAction,
  onTokenSaved,
}: Web_Components_ConnectionView_Props): ReactElement => {
  const [
    token,
    setToken,
  ] = useState<string>('');
  const [
    replacing,
    setReplacing,
  ] = useState<boolean>(false);
  const [
    saving,
    setSaving,
  ] = useState<boolean>(false);
  const [
    tokenError,
    setTokenError,
  ] = useState<unknown>(null);
  const [
    copied,
    setCopied,
  ] = useState<boolean>(false);

  if (bot === null) {
    return (
      <div className="detail-loading">
        <span className="spinner" />
        Loading the connection…
      </div>
    );
  }

  const status: Web_Components_BotStatus = describeBot(bot);
  const canWrite: boolean = can('configuration:write');
  const showForm: boolean = canWrite && (!bot['tokenConfigured'] || replacing);
  const tokenIssue: string = issueFor(tokenError, 'token');

  /**
   * Connection View - Submit.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSaving(true);
    setTokenError(null);
    try {
      await saveBotToken(token);
      setToken('');
      setReplacing(false);
      showToast((bot['desiredState'] === 'running') ? 'Token saved. The bot signs in with it within a few seconds.' : 'Token saved. Start the bot to bring it online.', true);
      await onTokenSaved();
    } catch (caughtError) {
      setTokenError(caughtError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="workspace-section">
      <div className="workspace-heading">
        <h1>Connection</h1>
        <p>{'The Discord bot token, the bot\'s status, and the link that adds the bot to a server.'}</p>
      </div>

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Bot</h2>
            {(can('bot:control')) ? (
              <BotControls
                bot={bot}
                onBotAction={onBotAction}
                onError={(message: string): void => {
                  // Bot controls clear their error with an empty message, so only real errors become a toast.
                  if (message !== '') {
                    showToast(message, false);
                  }
                }}
              />
            ) : null}
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
              <dt>Signed in as</dt>
              <dd>{bot['userTag'] ?? 'Shown once the bot signs in'}</dd>
            </div>
            <div>
              <dt>Application ID</dt>
              <dd>{bot['applicationId'] ?? 'Shown once the bot signs in'}</dd>
            </div>
          </dl>
          {(bot['resolution'] === null || status['tone'] === 'protected') ? null : (
            <p className="form-notice form-notice-warning">
              <Icon name="warning" size={16} />
              <span>{bot['resolution']}</span>
            </p>
          )}
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <h2>Bot token</h2>
            {(bot['tokenConfigured'] && canWrite && !replacing) ? (
              <button className="text-button" onClick={(): void => setReplacing(true)} type="button">Replace token</button>
            ) : null}
          </div>
          {(bot['tokenConfigured'] && !showForm) ? (
            <p className="form-section-note">
              <span className="tag tag-success">Saved</span>
              {' Stored encrypted. It\'s never shown again.'}
            </p>
          ) : null}
          {(!bot['tokenConfigured'] && !canWrite) ? <p className="form-section-note">No token is saved yet. Someone with the operator role or above can add it.</p> : null}
          {(showForm) ? (
            <form
              className="security-form"
              noValidate
              onSubmit={(event: FormEvent<HTMLFormElement>): void => {
                void submit(event);
              }}
            >
              <FieldLabel>
                <span>{(bot['tokenConfigured']) ? 'New bot token' : 'Bot token'}</span>
                <input
                  {...passwordManagerIgnore}
                  aria-invalid={tokenIssue !== ''}
                  autoCapitalize="none"
                  autoComplete="off"
                  className="monospace"
                  disabled={saving}
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => setToken(event.currentTarget.value)}
                  spellCheck={false}
                  type="password"
                  value={token}
                />
                {(tokenIssue === '') ? <small>In the Discord Developer Portal, open your application, choose Bot, then Reset Token.</small> : <small className="field-error">{tokenIssue}</small>}
              </FieldLabel>
              {(tokenError !== null && tokenIssue === '') ? (
                <div className="form-error" role="alert">
                  <Icon name="warning" size={16} />
                  <span>{errorMessage(tokenError, 'The token could not be saved. Try again.')}</span>
                </div>
              ) : null}
              <div className="panel-actions panel-actions-start">
                <Button disabled={saving || token.trim() === ''} type="submit" variant="primary">{(saving) ? 'Saving…' : 'Save token'}</Button>
                {(bot['tokenConfigured']) ? (
                  <Button
                    disabled={saving}
                    onClick={(): void => {
                      setReplacing(false);
                      setToken('');
                      setTokenError(null);
                    }}
                    variant="quiet"
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          ) : null}
        </section>

        <section className="form-section">
          <div className="form-section-head">
            <h2>Add the bot to a server</h2>
          </div>
          {(bot['addServerUrl'] === null) ? (
            <p className="form-section-note">The link appears once the bot signs in to Discord with its token.</p>
          ) : (
            <>
              <p className="form-section-note">Open the link, pick a server you manage, and approve the bot. The server shows up in the server menu once the bot joins it.</p>
              <div className="copy-list">
                <div className="copy-row">
                  <span>Invite link</span>
                  <code>{bot['addServerUrl']}</code>
                  <span className="invite-link-actions">
                    <button
                      aria-label="Copy the invite link"
                      className="icon-button"
                      onClick={(): void => {
                        void navigator.clipboard.writeText(bot['addServerUrl'] ?? '').then((): void => {
                          setCopied(true);
                          window.setTimeout((): void => setCopied(false), 1800);
                        });
                      }}
                      title="Copy"
                      type="button"
                    >
                      <Icon name={(copied) ? 'check' : 'copy'} size={16} />
                    </button>
                    <a aria-label="Open the invite link" className="icon-button" href={bot['addServerUrl']} rel="noopener noreferrer" target="_blank" title="Open">
                      <Icon name="external" size={16} />
                    </a>
                  </span>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
};
