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

import type {
  Web_UsersView_RoleOrder,
  Web_UsersView_TwoFactorMethods_Methods,
  Web_UsersView_TwoFactorMethods_PasskeyNoun,
  Web_UsersView_TwoFactorMethods_Returns,
  Web_UsersView_TwoFactorMethods_User,
  Web_UsersView_TwoFactorOptions,
  Web_UsersView_UsersView_Busy,
  Web_UsersView_UsersView_BusyState,
  Web_UsersView_UsersView_ConfirmError,
  Web_UsersView_UsersView_ConfirmErrorState,
  Web_UsersView_UsersView_Deleting,
  Web_UsersView_UsersView_DeletingState,
  Web_UsersView_UsersView_DialogOpen,
  Web_UsersView_UsersView_DialogOpenState,
  Web_UsersView_UsersView_Editing,
  Web_UsersView_UsersView_EditingState,
  Web_UsersView_UsersView_Error,
  Web_UsersView_UsersView_ErrorState,
  Web_UsersView_UsersView_Filtered,
  Web_UsersView_UsersView_Load,
  Web_UsersView_UsersView_Load_Returns,
  Web_UsersView_UsersView_Principal,
  Web_UsersView_UsersView_Props,
  Web_UsersView_UsersView_Remove,
  Web_UsersView_UsersView_Remove_Returns,
  Web_UsersView_UsersView_Remove_User,
  Web_UsersView_UsersView_RenderUser,
  Web_UsersView_UsersView_RenderUser_Access,
  Web_UsersView_UsersView_RenderUser_Manageable,
  Web_UsersView_UsersView_RenderUser_Methods,
  Web_UsersView_UsersView_RenderUser_Owner,
  Web_UsersView_UsersView_RenderUser_Returns,
  Web_UsersView_UsersView_RenderUser_Self,
  Web_UsersView_UsersView_RenderUser_User,
  Web_UsersView_UsersView_Returns,
  Web_UsersView_UsersView_RoleFilter,
  Web_UsersView_UsersView_RoleFilterState,
  Web_UsersView_UsersView_ServerFilter,
  Web_UsersView_UsersView_ServerFilterState,
  Web_UsersView_UsersView_Servers,
  Web_UsersView_UsersView_SetBusy,
  Web_UsersView_UsersView_SetConfirmError,
  Web_UsersView_UsersView_SetDeleting,
  Web_UsersView_UsersView_SetDialogOpen,
  Web_UsersView_UsersView_SetEditing,
  Web_UsersView_UsersView_SetError,
  Web_UsersView_UsersView_SetRoleFilter,
  Web_UsersView_UsersView_SetServerFilter,
  Web_UsersView_UsersView_SetTwoFactorFilter,
  Web_UsersView_UsersView_SetUsers,
  Web_UsersView_UsersView_Total,
  Web_UsersView_UsersView_TotalLabel,
  Web_UsersView_UsersView_TwoFactorFilter,
  Web_UsersView_UsersView_TwoFactorFilterState,
  Web_UsersView_UsersView_UserNoun,
  Web_UsersView_UsersView_Users,
  Web_UsersView_UsersView_UsersState,
  Web_UsersView_UsersView_VisibleUsers,
} from '@/types/web/users-view.d.ts';

/**
 * Users View - Role Order.
 *
 * The Role filter lists roles from the most access to the least.
 * The labels come from the shared role labels, so the menu and rows match.
 *
 * @since 4.0.0
 */
const roleOrder: Web_UsersView_RoleOrder = [
  'owner',
  'administrator',
  'operator',
  'viewer',
];

/**
 * Users View - Two Factor Options.
 *
 * The 2FA filter's choices, worded the same way as each row.
 * An authenticator app or any passkey counts as 2FA on.
 *
 * @since 4.0.0
 */
const twoFactorOptions: Web_UsersView_TwoFactorOptions = [
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
 * Users View - Two Factor Methods.
 *
 * Names the sign-in methods behind a user's 2FA, for the tooltip on their 2FA mark.
 * An empty list means the user signs in with a password only.
 *
 * @param {Web_UsersView_TwoFactorMethods_User} user - User.
 *
 * @returns {Web_UsersView_TwoFactorMethods_Returns}
 *
 * @since 4.0.0
 */
const twoFactorMethods = (user: Web_UsersView_TwoFactorMethods_User): Web_UsersView_TwoFactorMethods_Returns => {
  const methods: Web_UsersView_TwoFactorMethods_Methods = [];

  if (user['twoFactor'] === true) {
    methods.push('Authenticator app');
  }

  if (user['passkeys'] > 0) {
    const passkeyNoun: Web_UsersView_TwoFactorMethods_PasskeyNoun = (user['passkeys'] === 1) ? 'passkey' : 'passkeys';

    methods.push(`${user['passkeys']} ${passkeyNoun}`);
  }

  return methods;
};

/**
 * Users View - Users View.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_UsersView_UsersView_Props} props - Props.
 *
 * @returns {Web_UsersView_UsersView_Returns}
 *
 * @since 4.0.0
 */
export const UsersView = (props: Web_UsersView_UsersView_Props): Web_UsersView_UsersView_Returns => {
  const principal: Web_UsersView_UsersView_Principal = props['principal'];
  const servers: Web_UsersView_UsersView_Servers = props['servers'];
  const usersState: Web_UsersView_UsersView_UsersState = useState<Web_UsersView_UsersView_Users>(null);
  const users: Web_UsersView_UsersView_Users = usersState[0];
  const setUsers: Web_UsersView_UsersView_SetUsers = usersState[1];
  const errorState: Web_UsersView_UsersView_ErrorState = useState<Web_UsersView_UsersView_Error>('');
  const error: Web_UsersView_UsersView_Error = errorState[0];
  const setError: Web_UsersView_UsersView_SetError = errorState[1];
  const confirmErrorState: Web_UsersView_UsersView_ConfirmErrorState = useState<Web_UsersView_UsersView_ConfirmError>('');
  const confirmError: Web_UsersView_UsersView_ConfirmError = confirmErrorState[0];
  const setConfirmError: Web_UsersView_UsersView_SetConfirmError = confirmErrorState[1];
  const dialogOpenState: Web_UsersView_UsersView_DialogOpenState = useState<Web_UsersView_UsersView_DialogOpen>(false);
  const dialogOpen: Web_UsersView_UsersView_DialogOpen = dialogOpenState[0];
  const setDialogOpen: Web_UsersView_UsersView_SetDialogOpen = dialogOpenState[1];
  const editingState: Web_UsersView_UsersView_EditingState = useState<Web_UsersView_UsersView_Editing>(null);
  const editing: Web_UsersView_UsersView_Editing = editingState[0];
  const setEditing: Web_UsersView_UsersView_SetEditing = editingState[1];
  const deletingState: Web_UsersView_UsersView_DeletingState = useState<Web_UsersView_UsersView_Deleting>(null);
  const deleting: Web_UsersView_UsersView_Deleting = deletingState[0];
  const setDeleting: Web_UsersView_UsersView_SetDeleting = deletingState[1];
  const busyState: Web_UsersView_UsersView_BusyState = useState<Web_UsersView_UsersView_Busy>(false);
  const busy: Web_UsersView_UsersView_Busy = busyState[0];
  const setBusy: Web_UsersView_UsersView_SetBusy = busyState[1];
  const serverFilterState: Web_UsersView_UsersView_ServerFilterState = useState<Web_UsersView_UsersView_ServerFilter>('');
  const serverFilter: Web_UsersView_UsersView_ServerFilter = serverFilterState[0];
  const setServerFilter: Web_UsersView_UsersView_SetServerFilter = serverFilterState[1];
  const twoFactorFilterState: Web_UsersView_UsersView_TwoFactorFilterState = useState<Web_UsersView_UsersView_TwoFactorFilter>('');
  const twoFactorFilter: Web_UsersView_UsersView_TwoFactorFilter = twoFactorFilterState[0];
  const setTwoFactorFilter: Web_UsersView_UsersView_SetTwoFactorFilter = twoFactorFilterState[1];
  const roleFilterState: Web_UsersView_UsersView_RoleFilterState = useState<Web_UsersView_UsersView_RoleFilter>('');
  const roleFilter: Web_UsersView_UsersView_RoleFilter = roleFilterState[0];
  const setRoleFilter: Web_UsersView_UsersView_SetRoleFilter = roleFilterState[1];
  const filtered: Web_UsersView_UsersView_Filtered = (
    serverFilter !== ''
    || twoFactorFilter !== ''
    || roleFilter !== ''
  );
  const visibleUsers: Web_UsersView_UsersView_VisibleUsers = (users === null) ? [] : users.filter((user) => (
    (
      serverFilter === ''
      || user['allServers']
      || user['serverIds'].includes(serverFilter)
    )
    && (
      twoFactorFilter === ''
      || (twoFactorFilter === 'on') === (twoFactorMethods(user).length > 0)
    )
    && (
      roleFilter === ''
      || user['role'] === roleFilter
    )
  ));
  const total: Web_UsersView_UsersView_Total = (users === null) ? 0 : users.length;
  const userNoun: Web_UsersView_UsersView_UserNoun = (total === 1) ? 'user' : 'users';
  const totalLabel: Web_UsersView_UsersView_TotalLabel = `${total} ${userNoun}`;

  /**
   * Users View - Load.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_UsersView_UsersView_Load_Returns}
   *
   * @since 4.0.0
   */
  const load: Web_UsersView_UsersView_Load = async (): Web_UsersView_UsersView_Load_Returns => {
    setError('');
    try {
      setUsers(await getUsers());
    } catch (caughtError) {
      setError(errorMessage(caughtError, 'The users could not be loaded.'));
    }

    return;
  };

  useEffect(() => {
    void load();

    return;
  }, []);

  /**
   * Users View - Remove.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_UsersView_UsersView_Remove_User} user - User.
   *
   * @returns {Web_UsersView_UsersView_Remove_Returns}
   *
   * @since 4.0.0
   */
  const remove: Web_UsersView_UsersView_Remove = async (user: Web_UsersView_UsersView_Remove_User): Web_UsersView_UsersView_Remove_Returns => {
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

    return;
  };

  /**
   * Users View - Render User.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_UsersView_UsersView_RenderUser_User} user - User.
   *
   * @returns {Web_UsersView_UsersView_RenderUser_Returns}
   *
   * @since 4.0.0
   */
  const renderUser: Web_UsersView_UsersView_RenderUser = (user: Web_UsersView_UsersView_RenderUser_User): Web_UsersView_UsersView_RenderUser_Returns => {
    const self: Web_UsersView_UsersView_RenderUser_Self = user['id'] === principal['id'];
    const owner: Web_UsersView_UsersView_RenderUser_Owner = user['role'] === 'owner';

    // The server decides who you can change: never the owner or yourself, and only people inside your servers.
    const manageable: Web_UsersView_UsersView_RenderUser_Manageable = (
      user['editable']
      && self === false
      && owner === false
    );
    const access: Web_UsersView_UsersView_RenderUser_Access = serverAccessLabel(user['allServers'], user['serverIds'], servers);
    const methods: Web_UsersView_UsersView_RenderUser_Methods = twoFactorMethods(user);

    return (
      <li className="user-row" key={user['id']}>
        <span aria-hidden="true" className="avatar user-avatar">{user['username'].slice(0, 1).toUpperCase()}</span>
        <div className="user-main">
          <div className="user-name">
            <span className="user-username">{user['username']}</span>
            {(self === true) ? <span className="tag">You</span> : null}
            {(user['enabled'] === true) ? null : <span className="tag tag-warning">Suspended</span>}
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
        {(manageable === true) ? (
          <span className="user-actions">
            <Button
              icon="edit"
              onClick={() => {
                setEditing(user);
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
                setConfirmError('');
                setDeleting(user);

                return;
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
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);

            return;
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
              <span className="users-count">{(filtered === true) ? `${visibleUsers.length} of ${totalLabel}` : totalLabel}</span>
              <UsersFilter
                anyLabel="Any server"
                className="users-filter-servers"
                label="Servers"
                onChange={setServerFilter}
                options={servers.map((server) => ({
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
                options={roleOrder.map((role) => ({
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
                  onClick={() => {
                    setServerFilter('');
                    setTwoFactorFilter('');
                    setRoleFilter('');

                    return;
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
        onClose={() => setDialogOpen(false)}
        onSaved={async () => {
          showToast((editing === null) ? 'User added.' : `${editing['username']} was updated.`, true);
          await load();

          return;
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
        onCancel={() => {
          setDeleting(null);
          setConfirmError('');

          return;
        }}
        onConfirm={() => {
          if (deleting !== null) {
            void remove(deleting);
          }

          return;
        }}
        open={deleting !== null}
        title={(deleting === null) ? '' : `Delete ${deleting['username']}?`}
        tone="danger"
      />
    </section>
  );
};
