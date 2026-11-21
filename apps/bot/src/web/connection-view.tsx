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
  Web_ConnectionView_ConnectionView_Bot,
  Web_ConnectionView_ConnectionView_Can,
  Web_ConnectionView_ConnectionView_CanWrite,
  Web_ConnectionView_ConnectionView_Copied,
  Web_ConnectionView_ConnectionView_CopiedState,
  Web_ConnectionView_ConnectionView_OnBotAction,
  Web_ConnectionView_ConnectionView_OnTokenSaved,
  Web_ConnectionView_ConnectionView_Props,
  Web_ConnectionView_ConnectionView_Replacing,
  Web_ConnectionView_ConnectionView_ReplacingState,
  Web_ConnectionView_ConnectionView_Returns,
  Web_ConnectionView_ConnectionView_Saving,
  Web_ConnectionView_ConnectionView_SavingState,
  Web_ConnectionView_ConnectionView_SetCopied,
  Web_ConnectionView_ConnectionView_SetReplacing,
  Web_ConnectionView_ConnectionView_SetSaving,
  Web_ConnectionView_ConnectionView_SetToken,
  Web_ConnectionView_ConnectionView_SetTokenError,
  Web_ConnectionView_ConnectionView_ShowForm,
  Web_ConnectionView_ConnectionView_Status,
  Web_ConnectionView_ConnectionView_Submit,
  Web_ConnectionView_ConnectionView_Submit_Event,
  Web_ConnectionView_ConnectionView_Submit_Returns,
  Web_ConnectionView_ConnectionView_Token,
  Web_ConnectionView_ConnectionView_TokenError,
  Web_ConnectionView_ConnectionView_TokenErrorState,
  Web_ConnectionView_ConnectionView_TokenIssue,
  Web_ConnectionView_ConnectionView_TokenState,
  Web_ConnectionView_ToneClasses,
} from '@/types/web/connection-view.d.ts';

/**
 * Connection View - Tone Classes.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const toneClasses: Web_ConnectionView_ToneClasses = {
  blocked: 'details-status-blocked',
  connecting: 'details-status-connecting',
  idle: '',
  protected: 'details-status-protected',
};

/**
 * Connection View - Connection View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_ConnectionView_ConnectionView_Props} props - Props.
 *
 * @returns {Web_ConnectionView_ConnectionView_Returns}
 *
 * @since 4.0.0
 */
export const ConnectionView = (props: Web_ConnectionView_ConnectionView_Props): Web_ConnectionView_ConnectionView_Returns => {
  const bot: Web_ConnectionView_ConnectionView_Bot = props['bot'];
  const can: Web_ConnectionView_ConnectionView_Can = props['can'];
  const onBotAction: Web_ConnectionView_ConnectionView_OnBotAction = props['onBotAction'];
  const onTokenSaved: Web_ConnectionView_ConnectionView_OnTokenSaved = props['onTokenSaved'];
  const tokenState: Web_ConnectionView_ConnectionView_TokenState = useState<Web_ConnectionView_ConnectionView_Token>('');
  const token: Web_ConnectionView_ConnectionView_Token = tokenState[0];
  const setToken: Web_ConnectionView_ConnectionView_SetToken = tokenState[1];
  const replacingState: Web_ConnectionView_ConnectionView_ReplacingState = useState<Web_ConnectionView_ConnectionView_Replacing>(false);
  const replacing: Web_ConnectionView_ConnectionView_Replacing = replacingState[0];
  const setReplacing: Web_ConnectionView_ConnectionView_SetReplacing = replacingState[1];
  const savingState: Web_ConnectionView_ConnectionView_SavingState = useState<Web_ConnectionView_ConnectionView_Saving>(false);
  const saving: Web_ConnectionView_ConnectionView_Saving = savingState[0];
  const setSaving: Web_ConnectionView_ConnectionView_SetSaving = savingState[1];
  const tokenErrorState: Web_ConnectionView_ConnectionView_TokenErrorState = useState<Web_ConnectionView_ConnectionView_TokenError>(null);
  const tokenError: Web_ConnectionView_ConnectionView_TokenError = tokenErrorState[0];
  const setTokenError: Web_ConnectionView_ConnectionView_SetTokenError = tokenErrorState[1];
  const copiedState: Web_ConnectionView_ConnectionView_CopiedState = useState<Web_ConnectionView_ConnectionView_Copied>(false);
  const copied: Web_ConnectionView_ConnectionView_Copied = copiedState[0];
  const setCopied: Web_ConnectionView_ConnectionView_SetCopied = copiedState[1];

  if (bot === null) {
    return (
      <div className="detail-loading">
        <span className="spinner" />
        Loading the connection…
      </div>
    );
  }

  const status: Web_ConnectionView_ConnectionView_Status = describeBot(bot);
  const canWrite: Web_ConnectionView_ConnectionView_CanWrite = can('configuration:write');
  const showForm: Web_ConnectionView_ConnectionView_ShowForm = (
    canWrite === true
    && (
      bot['tokenConfigured'] === false
      || replacing === true
    )
  );
  const tokenIssue: Web_ConnectionView_ConnectionView_TokenIssue = issueFor(tokenError, 'token');

  /**
   * Connection View - Submit.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_ConnectionView_ConnectionView_Submit_Event} event - Event.
   *
   * @returns {Web_ConnectionView_ConnectionView_Submit_Returns}
   *
   * @since 4.0.0
   */
  const submit: Web_ConnectionView_ConnectionView_Submit = async (event: Web_ConnectionView_ConnectionView_Submit_Event): Web_ConnectionView_ConnectionView_Submit_Returns => {
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

    return;
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
            {(can('bot:control') === true) ? (
              <BotControls
                bot={bot}
                onBotAction={onBotAction}
                onError={(message) => {
                  // Bot controls clear their error with an empty message, so only real errors become a toast.
                  if (message !== '') {
                    showToast(message, false);
                  }

                  return;
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
            {(
              bot['tokenConfigured'] === true
              && canWrite === true
              && replacing === false
            ) ? (
                  <button className="text-button" onClick={() => setReplacing(true)} type="button">Replace token</button>
                ) : null}
          </div>
          {(bot['tokenConfigured'] === true && showForm === false) ? (
            <p className="form-section-note">
              <span className="tag tag-success">Saved</span>
              {' Stored encrypted. It\'s never shown again.'}
            </p>
          ) : null}
          {(bot['tokenConfigured'] === false && canWrite === false) ? <p className="form-section-note">No token is saved yet. Someone with the operator role or above can add it.</p> : null}
          {(showForm === true) ? (
            <form
              className="security-form"
              noValidate
              onSubmit={(event) => {
                void submit(event);

                return;
              }}
            >
              <FieldLabel>
                <span>{(bot['tokenConfigured'] === true) ? 'New bot token' : 'Bot token'}</span>
                <input
                  {...passwordManagerIgnore}
                  aria-invalid={tokenIssue !== ''}
                  autoCapitalize="none"
                  autoComplete="off"
                  className="monospace"
                  disabled={saving}
                  onChange={(event) => setToken(event.currentTarget.value)}
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
                <Button disabled={saving === true || token.trim() === ''} type="submit" variant="primary">{(saving === true) ? 'Saving…' : 'Save token'}</Button>
                {(bot['tokenConfigured'] === true) ? (
                  <Button
                    disabled={saving}
                    onClick={() => {
                      setReplacing(false);
                      setToken('');
                      setTokenError(null);

                      return;
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
                      onClick={() => {
                        void navigator.clipboard.writeText(bot['addServerUrl'] ?? '').then(() => {
                          setCopied(true);

                          window.setTimeout(() => setCopied(false), 1800);

                          return;
                        });

                        return;
                      }}
                      title="Copy"
                      type="button"
                    >
                      <Icon name={(copied === true) ? 'check' : 'copy'} size={16} />
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
