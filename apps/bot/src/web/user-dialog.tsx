import {
  useEffect,
  useState,
} from 'react';

import {
  createUser,
  issueFor,
  resetUserPassword,
  resetUserTwoFactor,
  summaryFor,
  updateUser,
} from '@/web/api.ts';
import { FieldLabel } from '@/web/field-label.tsx';
import {
  roleDescriptions,
  roleLabels,
} from '@/web/labels.ts';
import { PasswordMeter } from '@/web/password-meter.tsx';
import {
  Button,
  Icon,
  passwordManagerIgnore,
} from '@/web/primitives.tsx';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type {
  Web_UserDialog_ManagedRoles,
  Web_UserDialog_UserDialog_AllServers,
  Web_UserDialog_UserDialog_AllServersState,
  Web_UserDialog_UserDialog_Busy,
  Web_UserDialog_UserDialog_BusyState,
  Web_UserDialog_UserDialog_Choices,
  Web_UserDialog_UserDialog_Error,
  Web_UserDialog_UserDialog_ErrorState,
  Web_UserDialog_UserDialog_ManagerAllServers,
  Web_UserDialog_UserDialog_NewPassword,
  Web_UserDialog_UserDialog_NewPasswordState,
  Web_UserDialog_UserDialog_OnClose,
  Web_UserDialog_UserDialog_OnSaved,
  Web_UserDialog_UserDialog_Open,
  Web_UserDialog_UserDialog_Password,
  Web_UserDialog_UserDialog_PasswordIssue,
  Web_UserDialog_UserDialog_PasswordState,
  Web_UserDialog_UserDialog_Principal,
  Web_UserDialog_UserDialog_Props,
  Web_UserDialog_UserDialog_Returns,
  Web_UserDialog_UserDialog_Role,
  Web_UserDialog_UserDialog_RoleIssue,
  Web_UserDialog_UserDialog_RoleState,
  Web_UserDialog_UserDialog_ServerIds,
  Web_UserDialog_UserDialog_ServerIdsState,
  Web_UserDialog_UserDialog_Servers,
  Web_UserDialog_UserDialog_ServersIssue,
  Web_UserDialog_UserDialog_SetAllServers,
  Web_UserDialog_UserDialog_SetBusy,
  Web_UserDialog_UserDialog_SetError,
  Web_UserDialog_UserDialog_SetNewPassword,
  Web_UserDialog_UserDialog_SetPassword,
  Web_UserDialog_UserDialog_SetRole,
  Web_UserDialog_UserDialog_SetServerIds,
  Web_UserDialog_UserDialog_SetSuspended,
  Web_UserDialog_UserDialog_SetTurnOffTwoFactor,
  Web_UserDialog_UserDialog_SetUsername,
  Web_UserDialog_UserDialog_Submit,
  Web_UserDialog_UserDialog_Submit_Event,
  Web_UserDialog_UserDialog_Submit_Returns,
  Web_UserDialog_UserDialog_SubmitLabel,
  Web_UserDialog_UserDialog_Summary,
  Web_UserDialog_UserDialog_Suspended,
  Web_UserDialog_UserDialog_SuspendedState,
  Web_UserDialog_UserDialog_ToggleServer,
  Web_UserDialog_UserDialog_ToggleServer_Returns,
  Web_UserDialog_UserDialog_ToggleServer_ServerId,
  Web_UserDialog_UserDialog_TurnOffTwoFactor,
  Web_UserDialog_UserDialog_TurnOffTwoFactorState,
  Web_UserDialog_UserDialog_User,
  Web_UserDialog_UserDialog_Username,
  Web_UserDialog_UserDialog_UsernameIssue,
  Web_UserDialog_UserDialog_UsernameState,
} from '@/types/web/user-dialog.d.ts';

/**
 * User Dialog - Managed Roles.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const managedRoles: Web_UserDialog_ManagedRoles = [
  'administrator',
  'operator',
  'viewer',
];

/**
 * User Dialog - User Dialog.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_UserDialog_UserDialog_Props} props - Props.
 *
 * @returns {Web_UserDialog_UserDialog_Returns}
 *
 * @since 4.0.0
 */
export const UserDialog = (props: Web_UserDialog_UserDialog_Props): Web_UserDialog_UserDialog_Returns => {
  const onClose: Web_UserDialog_UserDialog_OnClose = props['onClose'];
  const onSaved: Web_UserDialog_UserDialog_OnSaved = props['onSaved'];
  const open: Web_UserDialog_UserDialog_Open = props['open'];
  const principal: Web_UserDialog_UserDialog_Principal = props['principal'];
  const servers: Web_UserDialog_UserDialog_Servers = props['servers'];
  const user: Web_UserDialog_UserDialog_User = props['user'];
  const usernameState: Web_UserDialog_UserDialog_UsernameState = useState<Web_UserDialog_UserDialog_Username>('');
  const username: Web_UserDialog_UserDialog_Username = usernameState[0];
  const setUsername: Web_UserDialog_UserDialog_SetUsername = usernameState[1];
  const passwordState: Web_UserDialog_UserDialog_PasswordState = useState<Web_UserDialog_UserDialog_Password>('');
  const password: Web_UserDialog_UserDialog_Password = passwordState[0];
  const setPassword: Web_UserDialog_UserDialog_SetPassword = passwordState[1];
  const roleState: Web_UserDialog_UserDialog_RoleState = useState<Web_UserDialog_UserDialog_Role>('operator');
  const role: Web_UserDialog_UserDialog_Role = roleState[0];
  const setRole: Web_UserDialog_UserDialog_SetRole = roleState[1];
  const allServersState: Web_UserDialog_UserDialog_AllServersState = useState<Web_UserDialog_UserDialog_AllServers>(false);
  const allServers: Web_UserDialog_UserDialog_AllServers = allServersState[0];
  const setAllServers: Web_UserDialog_UserDialog_SetAllServers = allServersState[1];
  const serverIdsState: Web_UserDialog_UserDialog_ServerIdsState = useState<Web_UserDialog_UserDialog_ServerIds>([]);
  const serverIds: Web_UserDialog_UserDialog_ServerIds = serverIdsState[0];
  const setServerIds: Web_UserDialog_UserDialog_SetServerIds = serverIdsState[1];
  const newPasswordState: Web_UserDialog_UserDialog_NewPasswordState = useState<Web_UserDialog_UserDialog_NewPassword>(false);
  const newPassword: Web_UserDialog_UserDialog_NewPassword = newPasswordState[0];
  const setNewPassword: Web_UserDialog_UserDialog_SetNewPassword = newPasswordState[1];
  const turnOffTwoFactorState: Web_UserDialog_UserDialog_TurnOffTwoFactorState = useState<Web_UserDialog_UserDialog_TurnOffTwoFactor>(false);
  const turnOffTwoFactor: Web_UserDialog_UserDialog_TurnOffTwoFactor = turnOffTwoFactorState[0];
  const setTurnOffTwoFactor: Web_UserDialog_UserDialog_SetTurnOffTwoFactor = turnOffTwoFactorState[1];
  const suspendedState: Web_UserDialog_UserDialog_SuspendedState = useState<Web_UserDialog_UserDialog_Suspended>(false);
  const suspended: Web_UserDialog_UserDialog_Suspended = suspendedState[0];
  const setSuspended: Web_UserDialog_UserDialog_SetSuspended = suspendedState[1];
  const errorState: Web_UserDialog_UserDialog_ErrorState = useState<Web_UserDialog_UserDialog_Error>(null);
  const error: Web_UserDialog_UserDialog_Error = errorState[0];
  const setError: Web_UserDialog_UserDialog_SetError = errorState[1];
  const busyState: Web_UserDialog_UserDialog_BusyState = useState<Web_UserDialog_UserDialog_Busy>(false);
  const busy: Web_UserDialog_UserDialog_Busy = busyState[0];
  const setBusy: Web_UserDialog_UserDialog_SetBusy = busyState[1];
  const managerAllServers: Web_UserDialog_UserDialog_ManagerAllServers = principal['allServers'] === true;

  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open === false) {
      return;
    }

    setUsername((user === null) ? '' : user['username']);
    setPassword('');
    setRole((user === null || user['role'] === 'owner') ? 'operator' : user['role']);
    setAllServers((user === null) ? managerAllServers : user['allServers']);
    setServerIds((user === null) ? [] : user['serverIds']);
    setNewPassword(false);
    setTurnOffTwoFactor(false);
    setSuspended(user !== null && user['enabled'] === false);
    setError(null);

    return;
  }, [
    open,
    user,
  ]);

  if (open === false) {
    return null;
  }

  // Servers the user already has stay listed even when the bot left them, so saving keeps them.
  const choices: Web_UserDialog_UserDialog_Choices = [
    ...servers.map((server) => ({
      available: server['available'],
      id: server['id'],
      name: server['name'],
    })),
    ...serverIds
      .filter((serverId) => servers.some((server) => server['id'] === serverId) === false)
      .map((serverId) => ({
        available: false,
        id: serverId,
        name: `Unknown server (${serverId})`,
      })),
  ];

  /**
   * User Dialog - Toggle Server.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_UserDialog_UserDialog_ToggleServer_ServerId} serverId - Server id.
   *
   * @returns {Web_UserDialog_UserDialog_ToggleServer_Returns}
   *
   * @since 4.0.0
   */
  const toggleServer: Web_UserDialog_UserDialog_ToggleServer = (serverId: Web_UserDialog_UserDialog_ToggleServer_ServerId): Web_UserDialog_UserDialog_ToggleServer_Returns => {
    setServerIds((current) => (
      (current.includes(serverId) === true) ? current.filter((candidate) => candidate !== serverId) : [
        ...current,
        serverId,
      ]
    ));

    return;
  };

  /**
   * User Dialog - Submit.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_UserDialog_UserDialog_Submit_Event} event - Event.
   *
   * @returns {Web_UserDialog_UserDialog_Submit_Returns}
   *
   * @since 4.0.0
   */
  const submit: Web_UserDialog_UserDialog_Submit = async (event: Web_UserDialog_UserDialog_Submit_Event): Web_UserDialog_UserDialog_Submit_Returns => {
    event.preventDefault();

    setBusy(true);
    setError(null);
    try {
      if (user === null) {
        await createUser({
          allServers,
          password,
          role,
          serverIds,
          username,
        });
      } else {
        // The new password goes first, so a password it rejects leaves the rest unsaved.
        if (newPassword === true) {
          await resetUserPassword(user['id'], password);
        }

        await updateUser(user['id'], {
          allServers,
          enabled: suspended === false,
          role,
          serverIds,
        });

        if (turnOffTwoFactor === true) {
          await resetUserTwoFactor(user['id']);
        }
      }

      await onSaved();
      onClose();
    } catch (caughtError) {
      setError(caughtError);
    } finally {
      setBusy(false);
    }

    return;
  };

  const usernameIssue: Web_UserDialog_UserDialog_UsernameIssue = issueFor(error, 'username');
  const passwordIssue: Web_UserDialog_UserDialog_PasswordIssue = issueFor(error, 'password');
  const roleIssue: Web_UserDialog_UserDialog_RoleIssue = issueFor(error, 'role');
  const serversIssue: Web_UserDialog_UserDialog_ServersIssue = issueFor(error, 'serverIds') || issueFor(error, 'allServers');
  const summary: Web_UserDialog_UserDialog_Summary = summaryFor(error, [
    'allServers',
    'password',
    'role',
    'serverIds',
    'username',
  ], 'The user could not be saved.');
  let submitLabel: Web_UserDialog_UserDialog_SubmitLabel = (user === null) ? 'Add user' : 'Save';

  if (busy === true) {
    submitLabel = 'Saving…';
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <section aria-labelledby="user-dialog-title" aria-modal="true" className="dialog" role="dialog">
        <div className="dialog-heading">
          <div>
            <h2 id="user-dialog-title">{(user === null) ? 'Add user' : `Edit ${user['username']}`}</h2>
            <p>{(user === null) ? 'They sign in with this username and password, which you share with them privately. In Sign-in and security, they can change the password and add an authenticator app or passkey.' : 'Change their role, the servers they see, and how they sign in.'}</p>
          </div>
          <button aria-label="Close" className="icon-button" onClick={onClose} type="button">
            <Icon name="x" size={18} />
          </button>
        </div>

        <form noValidate onSubmit={submit}>
          {(user === null) ? (
            <>
              <FieldLabel>
                <span>Username</span>
                <input
                  {...passwordManagerIgnore}
                  aria-invalid={usernameIssue !== ''}
                  autoCapitalize="none"
                  autoComplete="off"
                  maxLength={64}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                  spellCheck={false}
                  value={username}
                />
                {(usernameIssue === '') ? <small>3 to 64 letters, numbers, periods, underscores, or hyphens.</small> : <small className="field-error">{usernameIssue}</small>}
              </FieldLabel>
              <FieldLabel>
                <span>Password</span>
                <input
                  {...passwordManagerIgnore}
                  aria-invalid={passwordIssue !== ''}
                  autoComplete="off"
                  maxLength={1024}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  type="password"
                  value={password}
                />
                <PasswordMeter hints={[username]} issue={(passwordIssue === '') ? null : <small className="field-error">{passwordIssue}</small>} password={password} />
              </FieldLabel>
            </>
          ) : null}

          <fieldset className="scope-fieldset">
            <legend>Role</legend>
            {managedRoles.map((candidate) => (
              <label aria-label={roleLabels[candidate]} className="check-row" key={candidate}>
                <input
                  checked={role === candidate}
                  name="user-role"
                  onChange={() => setRole(candidate)}
                  type="radio"
                />
                <span>
                  <strong>{roleLabels[candidate]}</strong>
                  <small>{roleDescriptions[candidate]}</small>
                </span>
              </label>
            ))}
            {(roleIssue === '') ? null : <small className="field-error">{roleIssue}</small>}
          </fieldset>

          <fieldset className="scope-fieldset">
            <legend>Server access</legend>
            <label aria-label="All servers" className="check-row">
              <input
                checked={allServers}
                disabled={managerAllServers === false}
                name="user-servers"
                onChange={() => setAllServers(true)}
                type="radio"
              />
              <span>
                <strong>All servers</strong>
                <small>{(managerAllServers === true) ? 'Includes servers the bot joins later.' : 'Only people who see every server can give this.'}</small>
              </span>
            </label>
            <label aria-label="Only these servers" className="check-row">
              <input
                checked={allServers === false}
                name="user-servers"
                onChange={() => setAllServers(false)}
                type="radio"
              />
              <span>
                <strong>Only these servers</strong>
                <small>{(managerAllServers === true) ? 'They see only the servers you tick.' : 'You can give the servers you can open.'}</small>
              </span>
            </label>
            {(allServers === true) ? null : (
              <div aria-label="Servers" className="select-list user-servers" role="group">
                {(choices.length === 0) ? <p className="select-list-empty">No servers yet.</p> : choices.map((choice) => (
                  <label aria-label={choice['name']} className="select-list-row" key={choice['id']}>
                    <input
                      checked={serverIds.includes(choice['id'])}
                      onChange={() => toggleServer(choice['id'])}
                      type="checkbox"
                    />
                    <span className="select-list-main">
                      <span>{choice['name']}</span>
                      <small className="monospace">{choice['id']}</small>
                    </span>
                  </label>
                ))}
              </div>
            )}
            {(serversIssue === '') ? null : <small className="field-error">{serversIssue}</small>}
          </fieldset>

          {(user === null) ? null : (
            <fieldset className="scope-fieldset">
              <legend>Account</legend>
              <label aria-label="Set a new password" className="check-row">
                <input
                  checked={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.currentTarget.checked);
                    setPassword('');

                    return;
                  }}
                  type="checkbox"
                />
                <span>
                  <strong>Set a new password</strong>
                  <small>{'They\'re signed out everywhere. Their access tokens keep working.'}</small>
                </span>
              </label>
              {(newPassword === true) ? (
                <FieldLabel>
                  <span>New password</span>
                  <input
                    {...passwordManagerIgnore}
                    aria-invalid={passwordIssue !== ''}
                    autoComplete="off"
                    maxLength={1024}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    type="password"
                    value={password}
                  />
                  <PasswordMeter hints={[user['username']]} issue={(passwordIssue === '') ? null : <small className="field-error">{passwordIssue}</small>} password={password} />
                </FieldLabel>
              ) : null}
              {(user['twoFactor'] === true || user['passkeys'] > 0) ? (
                <label aria-label="Turn off two-factor" className="check-row">
                  <input
                    checked={turnOffTwoFactor}
                    onChange={(event) => setTurnOffTwoFactor(event.currentTarget.checked)}
                    type="checkbox"
                  />
                  <span>
                    <strong>Turn off two-factor</strong>
                    <small>Removes their authenticator app, recovery codes, and passkeys.</small>
                  </span>
                </label>
              ) : null}
              <label aria-label="Suspended" className="check-row">
                <input
                  checked={suspended}
                  onChange={(event) => setSuspended(event.currentTarget.checked)}
                  type="checkbox"
                />
                <span>
                  <strong>Suspended</strong>
                  <small>{'They\'re signed out and can\'t sign in. Their access tokens stop working too.'}</small>
                </span>
              </label>
            </fieldset>
          )}

          {(summary === '') ? null : (
            <div className="form-error" role="alert">
              <Icon name="warning" size={16} />
              <span>{summary}</span>
            </div>
          )}

          <div className="dialog-actions">
            <Button disabled={busy} onClick={onClose}>Cancel</Button>
            <Button
              disabled={(
                busy
                || (
                  allServers === false
                  && serverIds.length === 0
                )
              )}
              type="submit"
              variant="primary"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};
