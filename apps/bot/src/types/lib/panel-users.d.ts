import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type { Shared_PanelRole } from '../shared.d.ts';

export type Lib_PanelUsers_AssignableRole = Exclude<Shared_PanelRole, 'owner'>;
export type Lib_PanelUsers_User = {
  allServers: boolean;
  createdAt: string;
  enabled: boolean;
  id: string;
  lastSignInAt: string | null;
  passkeys: number;
  role: Shared_PanelRole;
  serverIds: string[];
  twoFactor: boolean;
  username: string;
};
export type Lib_PanelUsers_UserQueryRow = {
  all_guilds: boolean;
  created_at: Date;
  enabled: boolean;
  guild_ids: string[];
  id: string;
  last_login_at: Date | null;
  passkey_count: string;
  role: Shared_PanelRole;
  totp_enabled: boolean;
  username: string;
};
export type Lib_PanelUsers_UserColumns = string;

export type Lib_PanelUsers_CreatePanelUser_Pool = Pool;
export type Lib_PanelUsers_CreatePanelUser_Input = {
  allServers: boolean;
  password: string;
  role: Lib_PanelUsers_AssignableRole;
  serverIds: string[];
  username: string;
};
export type Lib_PanelUsers_CreatePanelUser_Returns = Promise<Lib_PanelUsers_User | 'server-unknown' | 'username-taken'>;
export type Lib_PanelUsers_CreatePanelUser_Taken = QueryResult;
export type Lib_PanelUsers_CreatePanelUser_PasswordHash = string;
export type Lib_PanelUsers_CreatePanelUser_UserId = string;
export type Lib_PanelUsers_CreatePanelUser_Client = PoolClient;
export type Lib_PanelUsers_CreatePanelUser_InsertedRow = {
  id: string;
};
export type Lib_PanelUsers_CreatePanelUser_FirstInsertedRow = Lib_PanelUsers_CreatePanelUser_InsertedRow | undefined;
export type Lib_PanelUsers_CreatePanelUser_Inserted = QueryResult<Lib_PanelUsers_CreatePanelUser_InsertedRow>;
export type Lib_PanelUsers_CreatePanelUser_User = Lib_PanelUsers_User | undefined;

export type Lib_PanelUsers_DeletePanelUser_Pool = Pool;
export type Lib_PanelUsers_DeletePanelUser_UserId = string;
export type Lib_PanelUsers_DeletePanelUser_Returns = Promise<string | undefined>;
export type Lib_PanelUsers_DeletePanelUser_QueryRow = {
  username: string;
};
export type Lib_PanelUsers_DeletePanelUser_Row = Lib_PanelUsers_DeletePanelUser_QueryRow | undefined;
export type Lib_PanelUsers_DeletePanelUser_Result = QueryResult<Lib_PanelUsers_DeletePanelUser_QueryRow>;

export type Lib_PanelUsers_GetPanelUser_Pool = Pool;
export type Lib_PanelUsers_GetPanelUser_UserId = string;
export type Lib_PanelUsers_GetPanelUser_Returns = Promise<Lib_PanelUsers_User | undefined>;
export type Lib_PanelUsers_GetPanelUser_Result = QueryResult<Lib_PanelUsers_UserQueryRow>;
export type Lib_PanelUsers_GetPanelUser_Row = Lib_PanelUsers_UserQueryRow | undefined;

export type Lib_PanelUsers_InsertServerAccess_Client = PoolClient;
export type Lib_PanelUsers_InsertServerAccess_UserId = string;
export type Lib_PanelUsers_InsertServerAccess_AllServers = boolean;
export type Lib_PanelUsers_InsertServerAccess_ServerIds = string[];
export type Lib_PanelUsers_InsertServerAccess_Returns = Promise<void>;

export type Lib_PanelUsers_ListPanelUsers_Pool = Pool;
export type Lib_PanelUsers_ListPanelUsers_Returns = Promise<Lib_PanelUsers_User[]>;
export type Lib_PanelUsers_ListPanelUsers_Result = QueryResult<Lib_PanelUsers_UserQueryRow>;

export type Lib_PanelUsers_ResetPanelUserPassword_Pool = Pool;
export type Lib_PanelUsers_ResetPanelUserPassword_UserId = string;
export type Lib_PanelUsers_ResetPanelUserPassword_Password = string;
export type Lib_PanelUsers_ResetPanelUserPassword_Returns = Promise<boolean>;
export type Lib_PanelUsers_ResetPanelUserPassword_PasswordHash = string;
export type Lib_PanelUsers_ResetPanelUserPassword_Client = PoolClient;
export type Lib_PanelUsers_ResetPanelUserPassword_Result = QueryResult;

export type Lib_PanelUsers_ResetPanelUserTwoFactor_Pool = Pool;
export type Lib_PanelUsers_ResetPanelUserTwoFactor_UserId = string;
export type Lib_PanelUsers_ResetPanelUserTwoFactor_Returns = Promise<boolean>;
export type Lib_PanelUsers_ResetPanelUserTwoFactor_Client = PoolClient;
export type Lib_PanelUsers_ResetPanelUserTwoFactor_Existing = QueryResult;

export type Lib_PanelUsers_ServersExist_Queryable = Pool | PoolClient;
export type Lib_PanelUsers_ServersExist_ServerIds = string[];
export type Lib_PanelUsers_ServersExist_Returns = Promise<boolean>;
export type Lib_PanelUsers_ServersExist_CountRow = {
  count: string;
};
export type Lib_PanelUsers_ServersExist_FirstCountRow = Lib_PanelUsers_ServersExist_CountRow | undefined;
export type Lib_PanelUsers_ServersExist_Count = QueryResult<Lib_PanelUsers_ServersExist_CountRow>;

export type Lib_PanelUsers_UpdatePanelUser_Pool = Pool;
export type Lib_PanelUsers_UpdatePanelUser_UserId = string;
export type Lib_PanelUsers_UpdatePanelUser_Input = {
  allServers: boolean;
  enabled: boolean;
  role: Lib_PanelUsers_AssignableRole;
  serverIds: string[];
};
export type Lib_PanelUsers_UpdatePanelUser_Returns = Promise<Lib_PanelUsers_User | 'not-found' | 'server-unknown'>;
export type Lib_PanelUsers_UpdatePanelUser_Updated = boolean;
export type Lib_PanelUsers_UpdatePanelUser_Client = PoolClient;
export type Lib_PanelUsers_UpdatePanelUser_UpdateResult = QueryResult;

export type Lib_PanelUsers_UserFromRow_Row = Lib_PanelUsers_UserQueryRow;
export type Lib_PanelUsers_UserFromRow_Returns = Lib_PanelUsers_User;
