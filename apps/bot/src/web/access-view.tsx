import { useState } from 'react';

import { ConfirmDialog } from '@/web/confirm-dialog.tsx';
import {
  formatRelative,
  formatShortDate,
  keepTogether,
} from '@/web/format.ts';
import { scopesForRole } from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';
import { TokenDialog } from '@/web/token-dialog.tsx';

import type {
  Web_AccessView_AccessView_BaseUrl,
  Web_AccessView_AccessView_Busy,
  Web_AccessView_AccessView_BusyState,
  Web_AccessView_AccessView_Copied,
  Web_AccessView_AccessView_CopiedState,
  Web_AccessView_AccessView_CopyValue,
  Web_AccessView_AccessView_CopyValue_Label,
  Web_AccessView_AccessView_CopyValue_Returns,
  Web_AccessView_AccessView_CopyValue_Value,
  Web_AccessView_AccessView_DialogOpen,
  Web_AccessView_AccessView_DialogOpenState,
  Web_AccessView_AccessView_EditingToken,
  Web_AccessView_AccessView_EditingTokenState,
  Web_AccessView_AccessView_ExpiryLabel,
  Web_AccessView_AccessView_ExpiryLabel_Returns,
  Web_AccessView_AccessView_ExpiryLabel_Token,
  Web_AccessView_AccessView_OnCreateToken,
  Web_AccessView_AccessView_OnRevokeToken,
  Web_AccessView_AccessView_OnUpdateToken,
  Web_AccessView_AccessView_Props,
  Web_AccessView_AccessView_Returns,
  Web_AccessView_AccessView_Revoke,
  Web_AccessView_AccessView_Revoke_Returns,
  Web_AccessView_AccessView_Revoke_Token,
  Web_AccessView_AccessView_RevokeError,
  Web_AccessView_AccessView_RevokeErrorState,
  Web_AccessView_AccessView_Revoking,
  Web_AccessView_AccessView_RevokingName,
  Web_AccessView_AccessView_RevokingState,
  Web_AccessView_AccessView_Role,
  Web_AccessView_AccessView_SetBusy,
  Web_AccessView_AccessView_SetCopied,
  Web_AccessView_AccessView_SetDialogOpen,
  Web_AccessView_AccessView_SetEditingToken,
  Web_AccessView_AccessView_SetRevokeError,
  Web_AccessView_AccessView_SetRevoking,
  Web_AccessView_AccessView_Tokens,
  Web_AccessView_AccessView_TokensNoun,
  Web_AccessView_Endpoints,
} from '@/types/web/access-view.d.ts';

/**
 * Access View - Endpoints.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const endpoints: Web_AccessView_Endpoints = [
  {
    method: 'GET',
    path: '/api/v1/servers',
    scope: 'features:read',
  },
  {
    method: 'GET',
    path: '/api/v1/servers/{serverId}/features',
    scope: 'features:read',
  },
  {
    method: 'PUT',
    path: '/api/v1/servers/{serverId}/features/{featureKey}',
    scope: 'features:write',
  },
  {
    method: 'PUT',
    path: '/api/v1/servers/{serverId}/features/{featureKey}/enabled',
    scope: 'features:write',
  },
  {
    method: 'GET',
    path: '/api/v1/bot',
    scope: 'bot:control',
  },
  {
    method: 'POST',
    path: '/api/v1/bot/actions',
    scope: 'bot:control',
  },
  {
    method: 'GET',
    path: '/api/v1/logs',
    scope: 'logs:read',
  },
];

/**
 * Access View - Access View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_AccessView_AccessView_Props} props - Props.
 *
 * @returns {Web_AccessView_AccessView_Returns}
 *
 * @since 4.0.0
 */
export const AccessView = (props: Web_AccessView_AccessView_Props): Web_AccessView_AccessView_Returns => {
  const onCreateToken: Web_AccessView_AccessView_OnCreateToken = props['onCreateToken'];
  const onRevokeToken: Web_AccessView_AccessView_OnRevokeToken = props['onRevokeToken'];
  const onUpdateToken: Web_AccessView_AccessView_OnUpdateToken = props['onUpdateToken'];
  const role: Web_AccessView_AccessView_Role = props['role'];
  const tokens: Web_AccessView_AccessView_Tokens = props['tokens'];
  const dialogOpenState: Web_AccessView_AccessView_DialogOpenState = useState<Web_AccessView_AccessView_DialogOpen>(false);
  const dialogOpen: Web_AccessView_AccessView_DialogOpen = dialogOpenState[0];
  const setDialogOpen: Web_AccessView_AccessView_SetDialogOpen = dialogOpenState[1];
  const editingTokenState: Web_AccessView_AccessView_EditingTokenState = useState<Web_AccessView_AccessView_EditingToken>(null);
  const editingToken: Web_AccessView_AccessView_EditingToken = editingTokenState[0];
  const setEditingToken: Web_AccessView_AccessView_SetEditingToken = editingTokenState[1];
  const revokingState: Web_AccessView_AccessView_RevokingState = useState<Web_AccessView_AccessView_Revoking>(null);
  const revoking: Web_AccessView_AccessView_Revoking = revokingState[0];
  const setRevoking: Web_AccessView_AccessView_SetRevoking = revokingState[1];
  const busyState: Web_AccessView_AccessView_BusyState = useState<Web_AccessView_AccessView_Busy>(false);
  const busy: Web_AccessView_AccessView_Busy = busyState[0];
  const setBusy: Web_AccessView_AccessView_SetBusy = busyState[1];
  const revokeErrorState: Web_AccessView_AccessView_RevokeErrorState = useState<Web_AccessView_AccessView_RevokeError>('');
  const revokeError: Web_AccessView_AccessView_RevokeError = revokeErrorState[0];
  const setRevokeError: Web_AccessView_AccessView_SetRevokeError = revokeErrorState[1];
  const copiedState: Web_AccessView_AccessView_CopiedState = useState<Web_AccessView_AccessView_Copied>('');
  const copied: Web_AccessView_AccessView_Copied = copiedState[0];
  const setCopied: Web_AccessView_AccessView_SetCopied = copiedState[1];
  const baseUrl: Web_AccessView_AccessView_BaseUrl = window.location.origin;

  /**
   * Access View - Copy Value.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_AccessView_AccessView_CopyValue_Label} label - Label.
   * @param {Web_AccessView_AccessView_CopyValue_Value} value - Value.
   *
   * @returns {Web_AccessView_AccessView_CopyValue_Returns}
   *
   * @since 4.0.0
   */
  const copyValue: Web_AccessView_AccessView_CopyValue = async (label: Web_AccessView_AccessView_CopyValue_Label, value: Web_AccessView_AccessView_CopyValue_Value): Web_AccessView_AccessView_CopyValue_Returns => {
    await navigator.clipboard.writeText(value);

    setCopied(label);

    window.setTimeout(() => setCopied(''), 1800);

    return;
  };

  /**
   * Access View - Revoke.
   *
   * Revokes the token picked in the confirm dialog and confirms it with a toast.
   * A failure stays in the dialog so it can be tried again.
   *
   * @param {Web_AccessView_AccessView_Revoke_Token} token - Token.
   *
   * @returns {Web_AccessView_AccessView_Revoke_Returns}
   *
   * @since 4.0.0
   */
  const revoke: Web_AccessView_AccessView_Revoke = async (token: Web_AccessView_AccessView_Revoke_Token): Web_AccessView_AccessView_Revoke_Returns => {
    setBusy(true);
    setRevokeError('');
    try {
      await onRevokeToken(token['id']);
      setRevoking(null);
      showToast(`${token['name']} revoked.`, true);
    } catch (caughtError) {
      setRevokeError((caughtError instanceof Error) ? caughtError.message : 'The token could not be revoked.');
    } finally {
      setBusy(false);
    }

    return;
  };

  /**
   * Access View - Expiry Label.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_AccessView_AccessView_ExpiryLabel_Token} token - Token.
   *
   * @returns {Web_AccessView_AccessView_ExpiryLabel_Returns}
   *
   * @since 4.0.0
   */
  const expiryLabel: Web_AccessView_AccessView_ExpiryLabel = (token: Web_AccessView_AccessView_ExpiryLabel_Token): Web_AccessView_AccessView_ExpiryLabel_Returns => {
    if (token['expiresAt'] === null) {
      return 'no expiry';
    }

    return (Date.parse(token['expiresAt']) <= Date.now()) ? `expired ${formatShortDate(token['expiresAt'])}` : `expires ${formatShortDate(token['expiresAt'])}`;
  };

  const tokensNoun: Web_AccessView_AccessView_TokensNoun = (tokens.length === 1) ? 'token' : 'tokens';
  const revokingName: Web_AccessView_AccessView_RevokingName = (revoking !== null) ? revoking['name'] : 'token';

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Access tokens</h1>
          <p>Personal tokens for scripts that call this control panel. Each one acts as you, limited to its scopes.</p>
        </div>
        <Button
          icon="add"
          onClick={() => {
            setEditingToken(null);
            setDialogOpen(true);

            return;
          }}
          variant="primary"
        >
          Create token
        </Button>
      </div>

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Tokens</h2>
            <span>{`${tokens.length} ${tokensNoun}`}</span>
          </div>
          {(tokens.length === 0) ? (
            <p className="select-list select-list-empty">No tokens yet. Create one for each script or app that calls the API.</p>
          ) : (
            <div className="select-list token-list">
              {tokens.map((token) => (
                <div className="select-list-row token-row" key={token['id']}>
                  <span className="select-list-main">
                    <span className="token-title">
                      <span className="token-name">{token['name']}</span>
                      {token['scopes'].map((scope) => <span className="tag" key={scope}>{scope}</span>)}
                    </span>
                    <small>
                      {[
                        `created ${formatShortDate(token['createdAt'])}`,
                        (token['lastUsedAt'] === null) ? 'never used' : `used ${formatRelative(token['lastUsedAt'])}`,
                        expiryLabel(token),
                      ].map((part) => keepTogether(part)).join(' · ')}
                    </small>
                  </span>
                  <span className="token-actions">
                    <Button
                      icon="edit"
                      onClick={() => {
                        setEditingToken(token);
                        setDialogOpen(true);

                        return;
                      }}
                      variant="quiet"
                    >
                      Edit
                    </Button>
                    <Button
                      icon="remove"
                      onClick={() => {
                        setRevokeError('');
                        setRevoking(token);

                        return;
                      }}
                      variant="danger"
                    >
                      Revoke
                    </Button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="panel">
        <section className="form-section">
          <div className="form-section-head">
            <h2>Calling the API</h2>
          </div>
          <div className="copy-list">
            <div className="copy-row">
              <span>Base URL</span>
              <code>{baseUrl}</code>
              <button
                className="icon-button"
                onClick={() => {
                  void copyValue('base', baseUrl);

                  return;
                }}
                title="Copy base URL"
                type="button"
              >
                <Icon name={(copied === 'base') ? 'check' : 'copy'} size={16} />
              </button>
            </div>
            <div className="copy-row">
              <span>Header</span>
              <code>Authorization: Bearer dsb_…</code>
            </div>
          </div>
          <ul className="endpoint-list">
            {endpoints.map((endpoint) => (
              <li key={`${endpoint['method']} ${endpoint['path']}`}>
                <code>
                  <span className="endpoint-method">{endpoint['method']}</span>
                  {endpoint['path']}
                </code>
                <span className="tag">{endpoint['scope']}</span>
              </li>
            ))}
          </ul>
          <p className="form-section-note">A token reaches the same servers you can, and stops working if your account is suspended or deleted.</p>
        </section>
      </div>

      <TokenDialog
        allowedScopes={scopesForRole(role)}
        onClose={() => setDialogOpen(false)}
        onCreate={onCreateToken}
        onUpdate={onUpdateToken}
        open={dialogOpen}
        token={editingToken}
      />

      <ConfirmDialog
        busy={busy}
        busyLabel="Revoking…"
        confirmLabel="Revoke"
        error={revokeError}
        message="Apps using this token stop working right away. This can't be undone."
        onCancel={() => setRevoking(null)}
        onConfirm={() => {
          if (revoking !== null) {
            void revoke(revoking);
          }

          return;
        }}
        open={revoking !== null}
        title={`Revoke ${revokingName}?`}
      />
    </section>
  );
};
