import {
  useEffect,
  useState,
} from 'react';

import {
  deleteUser,
  errorMessage,
  getUsers,
} from '@/web/api.ts';
import { ConfirmDialog } from '@/web/confirm-dialog.tsx';
import { formatRelative } from '@/web/format.ts';
import {
  roleLabels,
  serverAccessLabel,
} from '@/web/labels.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';
import { showToast } from '@/web/toast.ts';
import { UserDialog } from '@/web/user-dialog.tsx';
import { UsersFilter } from '@/web/users-filter.tsx';

import type { ReactElement } from 'react';

import type {
  Web_Api_Role,
  Web_Api_Server,
  Web_Api_User,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_UsersFilter_Option,
  Web_Components_UsersView_Props,
} from '@/types/web/components.d.ts';

/**
 * Users View - Role order.
 *
 * The Role filter lists roles from the most access to the least.
 * The labels come from the shared role labels, so the menu and rows match.
 *
 * @since 4.0.0
 */
const roleOrder: Web_Api_Role[] = [
  'owner',
  'administrator',
  'operator',
  'viewer',
];

/**
 * Users View - Two-factor options.
 *
 * The 2FA filter's choices, worded the same way as each row.
 * An authenticator app or any passkey counts as 2FA on.
 *
 * @since 4.0.0
 */
const twoFactorOptions: Web_Components_UsersFilter_Option[] = [
  {
    label: '2FA on',
    value: 'on',
  },
  {
    label: 'No 2FA',
    value: 'off',
  },
];

/**
 * Users View - Two-factor methods.
 *
 * Names the sign-in methods behind a user's 2FA, for the tooltip on their 2FA mark.
 * An empty list means the user signs in with a password only.
 *
 * @since 4.0.0
 */
const twoFactorMethods = (user: Web_Api_User): string[] => {
  const methods: string[] = [];

  if (user['twoFactor']) {
    methods.push('Authenticator app');
  }

  if (user['passkeys'] > 0) {
    methods.push(`${user['passkeys']} ${(user['passkeys'] === 1) ? 'passkey' : 'passkeys'}`);
  }

  return methods;
};

/**
 * Users View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const UsersView = ({
  principal,
  servers,
}: Web_Components_UsersView_Props): ReactElement => {
  const [
    users,
    setUsers,
  ] = useState<Web_Api_User[] | null>(null);
  const [
    error,
    setError,
  ] = useState<string>('');
  const [
    confirmError,
    setConfirmError,
  ] = useState<string>('');
  const [
    dialogOpen,
    setDialogOpen,
  ] = useState<boolean>(false);
  const [
    editing,
    setEditing,
  ] = useState<Web_Api_User | null>(null);
  const [
    deleting,
    setDeleting,
  ] = useState<Web_Api_User | null>(null);
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const [
    serverFilter,
    setServerFilter,
  ] = useState<string>('');
  const [
    twoFactorFilter,
    setTwoFactorFilter,
  ] = useState<string>('');
  const [
    roleFilter,
    setRoleFilter,
  ] = useState<string>('');
  const filtered: boolean = serverFilter !== '' || twoFactorFilter !== '' || roleFilter !== '';
  const visibleUsers: Web_Api_User[] = (users === null) ? [] : users.filter((user: Web_Api_User): boolean => (
    (serverFilter === '' || user['allServers'] || user['serverIds'].includes(serverFilter))
    && (twoFactorFilter === '' || (twoFactorFilter === 'on') === (twoFactorMethods(user).length > 0))
    && (roleFilter === '' || user['role'] === roleFilter)
  ));
  const total: number = (users === null) ? 0 : users.length;
  const totalLabel: string = `${total} ${(total === 1) ? 'user' : 'users'}`;

  /**
   * Users View - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const load = async (): Promise<void> => {
    setError('');
    try {
      setUsers(await getUsers());
    } catch (caughtError) {
      setError(errorMessage(caughtError, 'The users could not be loaded.'));
    }
  };

  useEffect((): void => {
    void load();
  }, []);

  /**
   * Users View - Remove.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const remove = async (user: Web_Api_User): Promise<void> => {
    setBusy(true);
    setConfirmError('');
    try {
      await deleteUser(user['id']);
      showToast(`${user['username']} was deleted.`, true);
      setDeleting(null);
      await load();
    } catch (caughtError) {
      setConfirmError(errorMessage(caughtError, 'That change didn\'t go through. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  /**
   * Users View - Renders user.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const renderUser = (user: Web_Api_User): ReactElement => {
    const self: boolean = user['id'] === principal['id'];
    const owner: boolean = user['role'] === 'owner';
    // The server decides who you can change: never the owner or yourself, and only people inside your servers.
    const manageable: boolean = user['editable'] && !self && !owner;
    const access: string = serverAccessLabel(user['allServers'], user['serverIds'], servers);
    const methods: string[] = twoFactorMethods(user);

    return (
      <li className="user-row" key={user['id']}>
        <span aria-hidden="true" className="avatar user-avatar">{user['username'].slice(0, 1).toUpperCase()}</span>
        <div className="user-main">
          <div className="user-name">
            <span className="user-username">{user['username']}</span>
            {(self) ? <span className="tag">You</span> : null}
            {(user['enabled']) ? null : <span className="tag tag-warning">Suspended</span>}
          </div>
          <small>{(user['lastSignInAt'] === null) ? 'Never signed in' : `Signed in ${formatRelative(user['lastSignInAt'])}`}</small>
        </div>
        <div className="user-facts">
          <span className="user-fact" title={access}>
            <Icon name="server" size={15} />
            <span>{access}</span>
          </span>
          {(methods.length > 0) ? (
            <span className="user-fact user-fact-on" title={methods.join(', ')}>
              <span>2FA</span>
              <Icon name="check" size={15} />
            </span>
          ) : (
            <span className="user-fact user-fact-off">
              <span>No 2FA</span>
            </span>
          )}
          <span className="user-fact user-fact-role">
            <span>{roleLabels[user['role']]}</span>
          </span>
        </div>
        {(manageable) ? (
          <span className="user-actions">
            <Button
              icon="edit"
              onClick={(): void => {
                setEditing(user);
                setDialogOpen(true);
              }}
              variant="quiet"
            >
              Edit
            </Button>
            <Button
              icon="remove"
              onClick={(): void => {
                setConfirmError('');
                setDeleting(user);
              }}
              variant="danger"
            >
              Delete
            </Button>
          </span>
        ) : null}
      </li>
    );
  };

  return (
    <section className="workspace-section">
      <div className="workspace-heading workspace-heading-split">
        <div>
          <h1>Users</h1>
          <p>People who can sign in to this control panel. Each one signs in with their own username and password.</p>
        </div>
        <Button
          icon="add"
          onClick={(): void => {
            setEditing(null);
            setDialogOpen(true);
          }}
          variant="primary"
        >
          Add user
        </Button>
      </div>

      {(error === '') ? null : (
        <div className="form-error" role="alert">
          <Icon name="warning" size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="panel users-panel">
        {(users === null) ? (
          <div className="detail-loading">
            {(error === '') ? (
              <>
                <span className="spinner" />
                Loading users…
              </>
            ) : null}
          </div>
        ) : (
          <>
            <div className="users-head">
              <span className="users-count">{(filtered) ? `${visibleUsers.length} of ${totalLabel}` : totalLabel}</span>
              <UsersFilter
                anyLabel="Any server"
                className="users-filter-servers"
                label="Servers"
                onChange={setServerFilter}
                options={servers.map((server: Web_Api_Server): Web_Components_UsersFilter_Option => ({
                  label: server['name'],
                  value: server['id'],
                }))}
                value={serverFilter}
              />
              <UsersFilter
                anyLabel="Any"
                className="users-filter-2fa"
                label="2FA"
                onChange={setTwoFactorFilter}
                options={twoFactorOptions}
                value={twoFactorFilter}
              />
              <UsersFilter
                anyLabel="Any role"
                className="users-filter-role"
                label="Role"
                onChange={setRoleFilter}
                options={roleOrder.map((role: Web_Api_Role): Web_Components_UsersFilter_Option => ({
                  label: roleLabels[role],
                  value: role,
                }))}
                value={roleFilter}
              />
            </div>
            {(visibleUsers.length === 0) ? (
              <div className="users-empty">
                <span>No users match these filters.</span>
                <Button
                  onClick={(): void => {
                    setServerFilter('');
                    setTwoFactorFilter('');
                    setRoleFilter('');
                  }}
                  variant="quiet"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <ul aria-label="Users" className="user-list">
                {visibleUsers.map(renderUser)}
              </ul>
            )}
          </>
        )}
      </div>

      <UserDialog
        onClose={(): void => setDialogOpen(false)}
        onSaved={async (): Promise<void> => {
          showToast((editing === null) ? 'User added.' : `${editing['username']} was updated.`, true);
          await load();
        }}
        open={dialogOpen}
        principal={principal}
        servers={servers}
        user={editing}
      />
      <ConfirmDialog
        busy={busy}
        busyLabel="Deleting…"
        confirmLabel="Delete"
        error={confirmError}
        message={'They can\'t sign in again, and their access tokens stop working.'}
        onCancel={(): void => {
          setDeleting(null);
          setConfirmError('');
        }}
        onConfirm={(): void => {
          if (deleting !== null) {
            void remove(deleting);
          }
        }}
        open={deleting !== null}
        title={(deleting === null) ? '' : `Delete ${deleting['username']}?`}
        tone="danger"
      />
    </section>
  );
};
