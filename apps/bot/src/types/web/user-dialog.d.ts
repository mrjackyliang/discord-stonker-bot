import type {
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Components_ManagedRole,
  Web_Components_ServerChoice,
  Web_Components_UserDialog_Props,
} from '@/types/web/components.d.ts';

/**
 * User Dialog.
 *
 * @since 4.2.1
 */
export type Web_UserDialog_ManagedRoles = Web_Components_ManagedRole[];

/**
 * User Dialog.
 *
 * @since 4.2.1
 */
export type Web_UserDialog_UserDialog_Props = Web_Components_UserDialog_Props;
export type Web_UserDialog_UserDialog_Returns = ReactElement | null;
export type Web_UserDialog_UserDialog_OnClose = Web_Components_UserDialog_Props['onClose'];
export type Web_UserDialog_UserDialog_OnSaved = Web_Components_UserDialog_Props['onSaved'];
export type Web_UserDialog_UserDialog_Open = Web_Components_UserDialog_Props['open'];
export type Web_UserDialog_UserDialog_Principal = Web_Components_UserDialog_Props['principal'];
export type Web_UserDialog_UserDialog_Servers = Web_Components_UserDialog_Props['servers'];
export type Web_UserDialog_UserDialog_User = Web_Components_UserDialog_Props['user'];
export type Web_UserDialog_UserDialog_UsernameState = [string, Dispatch<SetStateAction<string>>];
export type Web_UserDialog_UserDialog_Username = string;
export type Web_UserDialog_UserDialog_SetUsername = Dispatch<SetStateAction<string>>;
export type Web_UserDialog_UserDialog_PasswordState = [string, Dispatch<SetStateAction<string>>];
export type Web_UserDialog_UserDialog_Password = string;
export type Web_UserDialog_UserDialog_SetPassword = Dispatch<SetStateAction<string>>;
export type Web_UserDialog_UserDialog_RoleState = [Web_Components_ManagedRole, Dispatch<SetStateAction<Web_Components_ManagedRole>>];
export type Web_UserDialog_UserDialog_Role = Web_Components_ManagedRole;
export type Web_UserDialog_UserDialog_SetRole = Dispatch<SetStateAction<Web_Components_ManagedRole>>;
export type Web_UserDialog_UserDialog_AllServersState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UserDialog_UserDialog_AllServers = boolean;
export type Web_UserDialog_UserDialog_SetAllServers = Dispatch<SetStateAction<boolean>>;
export type Web_UserDialog_UserDialog_ServerIdsState = [string[], Dispatch<SetStateAction<string[]>>];
export type Web_UserDialog_UserDialog_ServerIds = string[];
export type Web_UserDialog_UserDialog_SetServerIds = Dispatch<SetStateAction<string[]>>;
export type Web_UserDialog_UserDialog_NewPasswordState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UserDialog_UserDialog_NewPassword = boolean;
export type Web_UserDialog_UserDialog_SetNewPassword = Dispatch<SetStateAction<boolean>>;
export type Web_UserDialog_UserDialog_TurnOffTwoFactorState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UserDialog_UserDialog_TurnOffTwoFactor = boolean;
export type Web_UserDialog_UserDialog_SetTurnOffTwoFactor = Dispatch<SetStateAction<boolean>>;
export type Web_UserDialog_UserDialog_SuspendedState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UserDialog_UserDialog_Suspended = boolean;
export type Web_UserDialog_UserDialog_SetSuspended = Dispatch<SetStateAction<boolean>>;
export type Web_UserDialog_UserDialog_ErrorState = [unknown, Dispatch<SetStateAction<unknown>>];
export type Web_UserDialog_UserDialog_Error = unknown;
export type Web_UserDialog_UserDialog_SetError = Dispatch<SetStateAction<unknown>>;
export type Web_UserDialog_UserDialog_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UserDialog_UserDialog_Busy = boolean;
export type Web_UserDialog_UserDialog_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_UserDialog_UserDialog_ManagerAllServers = boolean;
export type Web_UserDialog_UserDialog_Choices = Web_Components_ServerChoice[];
export type Web_UserDialog_UserDialog_ToggleServer_ServerId = string;
export type Web_UserDialog_UserDialog_ToggleServer_Returns = void;
export type Web_UserDialog_UserDialog_ToggleServer = (serverId: Web_UserDialog_UserDialog_ToggleServer_ServerId) => Web_UserDialog_UserDialog_ToggleServer_Returns;
export type Web_UserDialog_UserDialog_Submit_Event = FormEvent<HTMLFormElement>;
export type Web_UserDialog_UserDialog_Submit_Returns = Promise<void>;
export type Web_UserDialog_UserDialog_Submit = (event: Web_UserDialog_UserDialog_Submit_Event) => Web_UserDialog_UserDialog_Submit_Returns;
export type Web_UserDialog_UserDialog_UsernameIssue = string;
export type Web_UserDialog_UserDialog_PasswordIssue = string;
export type Web_UserDialog_UserDialog_RoleIssue = string;
export type Web_UserDialog_UserDialog_ServersIssue = string;
export type Web_UserDialog_UserDialog_Summary = string;
export type Web_UserDialog_UserDialog_SubmitLabel = string;
