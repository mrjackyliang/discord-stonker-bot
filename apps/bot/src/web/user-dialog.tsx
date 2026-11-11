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
  ChangeEvent,
  FormEvent,
  ReactElement,
} from 'react';

import type { Web_Api_Server } from '@/types/web/api.d.ts';
import type {
  Web_Components_ManagedRole,
  Web_Components_ServerChoice,
  Web_Components_UserDialog_Props,
} from '@/types/web/components.d.ts';

/**
 * User Dialog - Managed roles.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const managedRoles: Web_Components_ManagedRole[] = [
  'administrator',
  'operator',
  'viewer',
];

/**
 * User Dialog.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const UserDialog = ({
  onClose,
  onSaved,
  open,
  principal,
  servers,
  user,
}: Web_Components_UserDialog_Props): ReactElement | null => {
  const [
    username,
    setUsername,
  ] = useState<string>('');
  const [
    password,
    setPassword,
  ] = useState<string>('');
  const [
    role,
    setRole,
  ] = useState<Web_Components_ManagedRole>('operator');
  const [
    allServers,
    setAllServers,
  ] = useState<boolean>(false);
  const [
    serverIds,
    setServerIds,
  ] = useState<string[]>([]);
  const [
    newPassword,
    setNewPassword,
  ] = useState<boolean>(false);
  const [
    turnOffTwoFactor,
    setTurnOffTwoFactor,
  ] = useState<boolean>(false);
  const [
    suspended,
    setSuspended,
  ] = useState<boolean>(false);
  const [
    error,
    setError,
  ] = useState<unknown>(null);
  const [
    busy,
    setBusy,
  ] = useState<boolean>(false);
  const managerAllServers: boolean = principal['allServers'] === true;

  useEscapeKey(onClose, open);

  useEffect((): void => {
    if (!open) {
      return;
    }

    setUsername((user === null) ? '' : user['username']);
    setPassword('');
    setRole((user === null || user['role'] === 'owner') ? 'operator' : user['role']);
    setAllServers((user === null) ? managerAllServers : user['allServers']);
    setServerIds((user === null) ? [] : user['serverIds']);
    setNewPassword(false);
    setTurnOffTwoFactor(false);
    setSuspended(user !== null && !user['enabled']);
    setError(null);
  }, [
    open,
    user,
  ]);

  if (!open) {
    return null;
  }

  // Servers the user already has stay listed even when the bot left them, so saving keeps them.
  const choices: Web_Components_ServerChoice[] = [
    ...servers.map((server: Web_Api_Server): Web_Components_ServerChoice => ({
      available: server['available'],
      id: server['id'],
      name: server['name'],
    })),
    ...serverIds
      .filter((serverId: string): boolean => !servers.some((server: Web_Api_Server): boolean => server['id'] === serverId))
      .map((serverId: string): Web_Components_ServerChoice => ({
        available: false,
        id: serverId,
        name: `Unknown server (${serverId})`,
      })),
  ];

  /**
   * User Dialog - Toggles server.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const toggleServer = (serverId: string): void => {
    setServerIds((current: string[]): string[] => (
      (current.includes(serverId)) ? current.filter((candidate: string): boolean => candidate !== serverId) : [
        ...current,
        serverId,
      ]
    ));
  };

  /**
   * User Dialog - Submit.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
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
        if (newPassword) {
          await resetUserPassword(user['id'], password);
        }

        await updateUser(user['id'], {
          allServers,
          enabled: !suspended,
          role,
          serverIds,
        });

        if (turnOffTwoFactor) {
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
  };

  const usernameIssue: string = issueFor(error, 'username');
  const passwordIssue: string = issueFor(error, 'password');
  const roleIssue: string = issueFor(error, 'role');
  const serversIssue: string = issueFor(error, 'serverIds') || issueFor(error, 'allServers');
  const summary: string = summaryFor(error, [
    'allServers',
    'password',
    'role',
    'serverIds',
    'username',
  ], 'The user could not be saved.');
  let submitLabel: string = (user === null) ? 'Add user' : 'Save';

  if (busy) {
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
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => setUsername(event.currentTarget.value)}
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
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => setPassword(event.currentTarget.value)}
                  type="password"
                  value={password}
                />
                <PasswordMeter hints={[username]} issue={(passwordIssue === '') ? null : <small className="field-error">{passwordIssue}</small>} password={password} />
              </FieldLabel>
            </>
          ) : null}

          <fieldset className="scope-fieldset">
            <legend>Role</legend>
            {managedRoles.map((candidate: Web_Components_ManagedRole): ReactElement => (
              <label aria-label={roleLabels[candidate]} className="check-row" key={candidate}>
                <input
                  checked={role === candidate}
                  name="user-role"
                  onChange={(): void => setRole(candidate)}
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
                disabled={!managerAllServers}
                name="user-servers"
                onChange={(): void => setAllServers(true)}
                type="radio"
              />
              <span>
                <strong>All servers</strong>
                <small>{(managerAllServers) ? 'Includes servers the bot joins later.' : 'Only people who see every server can give this.'}</small>
              </span>
            </label>
            <label aria-label="Only these servers" className="check-row">
              <input
                checked={!allServers}
                name="user-servers"
                onChange={(): void => setAllServers(false)}
                type="radio"
              />
              <span>
                <strong>Only these servers</strong>
                <small>{(managerAllServers) ? 'They see only the servers you tick.' : 'You can give the servers you can open.'}</small>
              </span>
            </label>
            {(allServers) ? null : (
              <div aria-label="Servers" className="select-list user-servers" role="group">
                {(choices.length === 0) ? <p className="select-list-empty">No servers yet.</p> : choices.map((choice: Web_Components_ServerChoice): ReactElement => (
                  <label aria-label={choice['name']} className="select-list-row" key={choice['id']}>
                    <input
                      checked={serverIds.includes(choice['id'])}
                      onChange={(): void => toggleServer(choice['id'])}
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
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    setNewPassword(event.currentTarget.checked);
                    setPassword('');
                  }}
                  type="checkbox"
                />
                <span>
                  <strong>Set a new password</strong>
                  <small>{'They\'re signed out everywhere. Their access tokens keep working.'}</small>
                </span>
              </label>
              {(newPassword) ? (
                <FieldLabel>
                  <span>New password</span>
                  <input
                    {...passwordManagerIgnore}
                    aria-invalid={passwordIssue !== ''}
                    autoComplete="off"
                    maxLength={1024}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => setPassword(event.currentTarget.value)}
                    type="password"
                    value={password}
                  />
                  <PasswordMeter hints={[user['username']]} issue={(passwordIssue === '') ? null : <small className="field-error">{passwordIssue}</small>} password={password} />
                </FieldLabel>
              ) : null}
              {(user['twoFactor'] || user['passkeys'] > 0) ? (
                <label aria-label="Turn off two-factor" className="check-row">
                  <input
                    checked={turnOffTwoFactor}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void => setTurnOffTwoFactor(event.currentTarget.checked)}
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
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => setSuspended(event.currentTarget.checked)}
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
            <Button disabled={busy || (!allServers && serverIds.length === 0)} type="submit" variant="primary">
              {submitLabel}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};
