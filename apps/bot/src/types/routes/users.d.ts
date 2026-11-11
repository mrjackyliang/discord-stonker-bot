import type express from 'express';

import type {
  userCreate,
  userPasswordReset,
  userUpdate,
} from '../../lib/account-schemas.js';
import type { Lib_PanelUsers_User } from '../lib/panel-users.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_AccessUser,
  Shared_Principal,
} from '../shared.d.ts';

export type Routes_Users_UserIdMaximumLength = number;
export type Routes_Users_ManagedUser = Lib_PanelUsers_User & {
  editable: boolean;
};

export type Routes_Users_CanManage_Caller = Shared_AccessUser;
export type Routes_Users_CanManage_Target = Lib_PanelUsers_User;
export type Routes_Users_CanManage_Returns = boolean;

export type Routes_Users_DescribeUser_Caller = Shared_AccessUser;
export type Routes_Users_DescribeUser_User = Lib_PanelUsers_User;
export type Routes_Users_DescribeUser_Returns = Routes_Users_ManagedUser;

export type Routes_Users_Runner_Access = Server_Access;
export type Routes_Users_Runner_Context = Server_Context;

export type Routes_Users_Runner_Constructor_Context = Server_Context;
export type Routes_Users_Runner_Constructor_Access = Server_Access;

export type Routes_Users_Runner_Register_App = express.Express;
export type Routes_Users_Runner_Register_Returns = void;

export type Routes_Users_Runner_FindTarget_Request = express.Request;
export type Routes_Users_Runner_FindTarget_Response = express.Response;
export type Routes_Users_Runner_FindTarget_Returns = Promise<Lib_PanelUsers_User | undefined>;
export type Routes_Users_Runner_FindTarget_UserId = unknown;
export type Routes_Users_Runner_FindTarget_Principal = Shared_Principal;
export type Routes_Users_Runner_FindTarget_Target = Lib_PanelUsers_User | undefined;

export type Routes_Users_Runner_IsGrantRefused_Response = express.Response;
export type Routes_Users_Runner_IsGrantRefused_AllServers = boolean;
export type Routes_Users_Runner_IsGrantRefused_ServerIds = string[];
export type Routes_Users_Runner_IsGrantRefused_Returns = boolean;
export type Routes_Users_Runner_IsGrantRefused_Principal = Shared_Principal;

export type Routes_Users_Runner_RouteCreate_Request = express.Request;
export type Routes_Users_Runner_RouteCreate_Response = express.Response;
export type Routes_Users_Runner_RouteCreate_Returns = Promise<void>;
export type Routes_Users_Runner_RouteCreate_RequestBody = ReturnType<typeof userCreate.safeParse>;
export type Routes_Users_Runner_RouteCreate_Principal = Shared_Principal;
export type Routes_Users_Runner_RouteCreate_Result = Lib_PanelUsers_User | 'server-unknown' | 'username-taken';

export type Routes_Users_Runner_RouteDelete_Request = express.Request;
export type Routes_Users_Runner_RouteDelete_Response = express.Response;
export type Routes_Users_Runner_RouteDelete_Returns = Promise<void>;
export type Routes_Users_Runner_RouteDelete_Target = Lib_PanelUsers_User | undefined;
export type Routes_Users_Runner_RouteDelete_Principal = Shared_Principal;
export type Routes_Users_Runner_RouteDelete_Username = string | undefined;

export type Routes_Users_Runner_RouteList_Request = express.Request;
export type Routes_Users_Runner_RouteList_Response = express.Response;
export type Routes_Users_Runner_RouteList_Returns = Promise<void>;
export type Routes_Users_Runner_RouteList_Principal = Shared_Principal;
export type Routes_Users_Runner_RouteList_Users = Lib_PanelUsers_User[];

export type Routes_Users_Runner_RouteResetPassword_Request = express.Request;
export type Routes_Users_Runner_RouteResetPassword_Response = express.Response;
export type Routes_Users_Runner_RouteResetPassword_Returns = Promise<void>;
export type Routes_Users_Runner_RouteResetPassword_Target = Lib_PanelUsers_User | undefined;
export type Routes_Users_Runner_RouteResetPassword_Principal = Shared_Principal;
export type Routes_Users_Runner_RouteResetPassword_RequestBody = ReturnType<typeof userPasswordReset.safeParse>;
export type Routes_Users_Runner_RouteResetPassword_Reset = boolean;

export type Routes_Users_Runner_RouteResetTwoFactor_Request = express.Request;
export type Routes_Users_Runner_RouteResetTwoFactor_Response = express.Response;
export type Routes_Users_Runner_RouteResetTwoFactor_Returns = Promise<void>;
export type Routes_Users_Runner_RouteResetTwoFactor_Target = Lib_PanelUsers_User | undefined;
export type Routes_Users_Runner_RouteResetTwoFactor_Principal = Shared_Principal;
export type Routes_Users_Runner_RouteResetTwoFactor_Reset = boolean;

export type Routes_Users_Runner_RouteUpdate_Request = express.Request;
export type Routes_Users_Runner_RouteUpdate_Response = express.Response;
export type Routes_Users_Runner_RouteUpdate_Returns = Promise<void>;
export type Routes_Users_Runner_RouteUpdate_Target = Lib_PanelUsers_User | undefined;
export type Routes_Users_Runner_RouteUpdate_Principal = Shared_Principal;
export type Routes_Users_Runner_RouteUpdate_RequestBody = ReturnType<typeof userUpdate.safeParse>;
export type Routes_Users_Runner_RouteUpdate_Result = Lib_PanelUsers_User | 'not-found' | 'server-unknown';
