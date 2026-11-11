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

import type { ReactElement } from 'react';

import type { Web_Api_Token } from '@/types/web/api.d.ts';
import type {
  Web_Components_AccessView_Props,
  Web_Components_Endpoint,
} from '@/types/web/components.d.ts';

/**
 * Access View - Endpoints.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const endpoints: Web_Components_Endpoint[] = [
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
 * Access View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const AccessView = ({
  onCreateToken,
  onRevokeToken,
  onUpdateToken,
  role,
  tokens,
}: Web_Components_AccessView_Props): ReactElement => {
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState<boolean>(false);
  const [
    editingToken,
    setEditingToken,
  ] = useState<Web_Api_Token | null>(null);
  const [
    revoking,
    setRevoking,
  ] = useState<Web_Api_Token | null>(null);
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    revokeError,
    setRevokeError,
  ] = useState<string>('');
  const [
    copied,
    setCopied,
  ] = useState<string>('');
  const baseUrl: string = window.location.origin;

  /**
   * Access View - Copies value.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const copyValue = async (label: string, value: string): Promise<void> => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout((): void => setCopied(''), 1800);
  };

  /**
   * Access View - Revoke.
   *
   * Revokes the token picked in the confirm dialog and confirms it with a toast.
   * A failure stays in the dialog so it can be tried again.
   *
   * @since 4.0.0
   */
  const revoke = async (token: Web_Api_Token): Promise<void> => {
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
  };

  /**
   * Access View - Expiry label.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const expiryLabel = (token: Web_Api_Token): string => {
    if (token['expiresAt'] === null) {
      return 'no expiry';
    }

    return (Date.parse(token['expiresAt']) <= Date.now()) ? `expired ${formatShortDate(token['expiresAt'])}` : `expires ${formatShortDate(token['expiresAt'])}`;
  };

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Access tokens</h1>
          <p>Personal tokens for scripts that call this control panel. Each one acts as you, limited to its scopes.</p>
        </div>
        <Button
          icon="add"
          onClick={(): void => {
            setEditingToken(null);
            setDialogOpen(true);
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
            <span>{`${tokens.length} ${(tokens.length === 1) ? 'token' : 'tokens'}`}</span>
          </div>
          {(tokens.length === 0) ? (
            <p className="select-list select-list-empty">No tokens yet. Create one for each script or app that calls the API.</p>
          ) : (
            <div className="select-list token-list">
              {tokens.map((token: Web_Api_Token): ReactElement => (
                <div className="select-list-row token-row" key={token['id']}>
                  <span className="select-list-main">
                    <span className="token-title">
                      <span className="token-name">{token['name']}</span>
                      {token['scopes'].map((scope: string): ReactElement => <span className="tag" key={scope}>{scope}</span>)}
                    </span>
                    <small>
                      {[
                        `created ${formatShortDate(token['createdAt'])}`,
                        (token['lastUsedAt'] === null) ? 'never used' : `used ${formatRelative(token['lastUsedAt'])}`,
                        expiryLabel(token),
                      ].map((part: string): string => keepTogether(part)).join(' · ')}
                    </small>
                  </span>
                  <span className="token-actions">
                    <Button
                      icon="edit"
                      onClick={(): void => {
                        setEditingToken(token);
                        setDialogOpen(true);
                      }}
                      variant="quiet"
                    >
                      Edit
                    </Button>
                    <Button
                      icon="remove"
                      onClick={(): void => {
                        setRevokeError('');
                        setRevoking(token);
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
                onClick={(): void => {
                  void copyValue('base', baseUrl);
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
            {endpoints.map((endpoint: Web_Components_Endpoint): ReactElement => (
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
        onClose={(): void => setDialogOpen(false)}
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
        onCancel={(): void => setRevoking(null)}
        onConfirm={(): void => {
          if (revoking !== null) {
            void revoke(revoking);
          }
        }}
        open={revoking !== null}
        title={`Revoke ${revoking?.['name'] ?? 'token'}?`}
      />
    </section>
  );
};
