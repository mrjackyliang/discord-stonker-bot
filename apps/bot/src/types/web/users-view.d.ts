import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';

import type {
  Web_Api_Role,
  Web_Api_User,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_UsersFilter_Option,
  Web_Components_UsersView_Props,
} from '@/types/web/components.d.ts';

/**
 * Users View.
 *
 * @since 4.2.1
 */
export type Web_UsersView_RoleOrder = Web_Api_Role[];

/**
 * Users View.
 *
 * @since 4.2.1
 */
export type Web_UsersView_TwoFactorMethods_User = Web_Api_User;
export type Web_UsersView_TwoFactorMethods_Returns = string[];
export type Web_UsersView_TwoFactorMethods_Methods = string[];
export type Web_UsersView_TwoFactorMethods_PasskeyNoun = string;

/**
 * Users View.
 *
 * @since 4.2.1
 */
export type Web_UsersView_TwoFactorOptions = Web_Components_UsersFilter_Option[];

/**
 * Users View.
 *
 * @since 4.2.1
 */
export type Web_UsersView_UsersView_Props = Web_Components_UsersView_Props;
export type Web_UsersView_UsersView_Returns = ReactElement;
export type Web_UsersView_UsersView_Principal = Web_Components_UsersView_Props['principal'];
export type Web_UsersView_UsersView_Servers = Web_Components_UsersView_Props['servers'];
export type Web_UsersView_UsersView_UsersState = [Web_Api_User[] | null, Dispatch<SetStateAction<Web_Api_User[] | null>>];
export type Web_UsersView_UsersView_Users = Web_Api_User[] | null;
export type Web_UsersView_UsersView_SetUsers = Dispatch<SetStateAction<Web_Api_User[] | null>>;
export type Web_UsersView_UsersView_ErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_UsersView_UsersView_Error = string;
export type Web_UsersView_UsersView_SetError = Dispatch<SetStateAction<string>>;
export type Web_UsersView_UsersView_ConfirmErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_UsersView_UsersView_ConfirmError = string;
export type Web_UsersView_UsersView_SetConfirmError = Dispatch<SetStateAction<string>>;
export type Web_UsersView_UsersView_DialogOpenState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UsersView_UsersView_DialogOpen = boolean;
export type Web_UsersView_UsersView_SetDialogOpen = Dispatch<SetStateAction<boolean>>;
export type Web_UsersView_UsersView_EditingState = [Web_Api_User | null, Dispatch<SetStateAction<Web_Api_User | null>>];
export type Web_UsersView_UsersView_Editing = Web_Api_User | null;
export type Web_UsersView_UsersView_SetEditing = Dispatch<SetStateAction<Web_Api_User | null>>;
export type Web_UsersView_UsersView_DeletingState = [Web_Api_User | null, Dispatch<SetStateAction<Web_Api_User | null>>];
export type Web_UsersView_UsersView_Deleting = Web_Api_User | null;
export type Web_UsersView_UsersView_SetDeleting = Dispatch<SetStateAction<Web_Api_User | null>>;
export type Web_UsersView_UsersView_BusyState = [boolean, Dispatch<SetStateAction<boolean>>];
export type Web_UsersView_UsersView_Busy = boolean;
export type Web_UsersView_UsersView_SetBusy = Dispatch<SetStateAction<boolean>>;
export type Web_UsersView_UsersView_ServerFilterState = [string, Dispatch<SetStateAction<string>>];
export type Web_UsersView_UsersView_ServerFilter = string;
export type Web_UsersView_UsersView_SetServerFilter = Dispatch<SetStateAction<string>>;
export type Web_UsersView_UsersView_TwoFactorFilterState = [string, Dispatch<SetStateAction<string>>];
export type Web_UsersView_UsersView_TwoFactorFilter = string;
export type Web_UsersView_UsersView_SetTwoFactorFilter = Dispatch<SetStateAction<string>>;
export type Web_UsersView_UsersView_RoleFilterState = [string, Dispatch<SetStateAction<string>>];
export type Web_UsersView_UsersView_RoleFilter = string;
export type Web_UsersView_UsersView_SetRoleFilter = Dispatch<SetStateAction<string>>;
export type Web_UsersView_UsersView_Filtered = boolean;
export type Web_UsersView_UsersView_VisibleUsers = Web_Api_User[];
export type Web_UsersView_UsersView_Total = number;
export type Web_UsersView_UsersView_UserNoun = string;
export type Web_UsersView_UsersView_TotalLabel = string;
export type Web_UsersView_UsersView_Load_Returns = Promise<void>;
export type Web_UsersView_UsersView_Load = () => Web_UsersView_UsersView_Load_Returns;
export type Web_UsersView_UsersView_Remove_User = Web_Api_User;
export type Web_UsersView_UsersView_Remove_Returns = Promise<void>;
export type Web_UsersView_UsersView_Remove = (user: Web_UsersView_UsersView_Remove_User) => Web_UsersView_UsersView_Remove_Returns;
export type Web_UsersView_UsersView_RenderUser_User = Web_Api_User;
export type Web_UsersView_UsersView_RenderUser_Returns = ReactElement;
export type Web_UsersView_UsersView_RenderUser = (user: Web_UsersView_UsersView_RenderUser_User) => Web_UsersView_UsersView_RenderUser_Returns;
export type Web_UsersView_UsersView_RenderUser_Self = boolean;
export type Web_UsersView_UsersView_RenderUser_Owner = boolean;
export type Web_UsersView_UsersView_RenderUser_Manageable = boolean;
export type Web_UsersView_UsersView_RenderUser_Access = string;
export type Web_UsersView_UsersView_RenderUser_Methods = string[];
