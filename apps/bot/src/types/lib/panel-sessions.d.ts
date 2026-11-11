import type {
  Pool,
  QueryResult,
} from 'pg';

import type {
  Shared_AccessSession,
  Shared_AccessToken,
  Shared_AccessUser,
  Shared_PanelRole,
  Shared_TokenScope,
} from '../shared.d.ts';

export type Lib_PanelSessions_SessionDurationHours = number;
export type Lib_PanelSessions_UserAgentLimit = number;

export type Lib_PanelSessions_UserRow = {
  all_guilds: boolean;
  guild_ids: string[];
  role: Shared_PanelRole;
  user_id: string;
  username: string;
};

export type Lib_PanelSessions_AccessUserFromRow_Row = Lib_PanelSessions_UserRow;
export type Lib_PanelSessions_AccessUserFromRow_Returns = Shared_AccessUser;

export type Lib_PanelSessions_AuthenticatePanelToken_Pool = Pool;
export type Lib_PanelSessions_AuthenticatePanelToken_RawToken = string;
export type Lib_PanelSessions_AuthenticatePanelToken_Returns = Promise<Shared_AccessToken | undefined>;
export type Lib_PanelSessions_AuthenticatePanelToken_Row = Lib_PanelSessions_UserRow & {
  scopes: Shared_TokenScope[];
  token_id: string;
  token_name: string;
};
export type Lib_PanelSessions_AuthenticatePanelToken_FirstRow = Lib_PanelSessions_AuthenticatePanelToken_Row | undefined;
export type Lib_PanelSessions_AuthenticatePanelToken_Result = QueryResult<Lib_PanelSessions_AuthenticatePanelToken_Row>;

export type Lib_PanelSessions_CreatePanelSession_Pool = Pool;
export type Lib_PanelSessions_CreatePanelSession_UserId = string;
export type Lib_PanelSessions_CreatePanelSession_Metadata = {
  ipAddress: string;
  userAgent: string;
};
export type Lib_PanelSessions_CreatePanelSession_Returns = Promise<{
  csrfToken: string;
  expiresAt: string;
  sessionToken: string;
}>;
export type Lib_PanelSessions_CreatePanelSession_SessionToken = string;
export type Lib_PanelSessions_CreatePanelSession_CsrfToken = string;
export type Lib_PanelSessions_CreatePanelSession_Row = {
  expires_at: Date;
};
export type Lib_PanelSessions_CreatePanelSession_FirstRow = Lib_PanelSessions_CreatePanelSession_Row | undefined;
export type Lib_PanelSessions_CreatePanelSession_Result = QueryResult<Lib_PanelSessions_CreatePanelSession_Row>;

export type Lib_PanelSessions_DeletePanelSession_Pool = Pool;
export type Lib_PanelSessions_DeletePanelSession_SessionToken = string;
export type Lib_PanelSessions_DeletePanelSession_Returns = Promise<void>;

export type Lib_PanelSessions_DeletePanelUserSessions_Pool = Pool;
export type Lib_PanelSessions_DeletePanelUserSessions_UserId = string;
export type Lib_PanelSessions_DeletePanelUserSessions_ExceptSessionToken = string;
export type Lib_PanelSessions_DeletePanelUserSessions_Returns = Promise<void>;

export type Lib_PanelSessions_DigestsEqual_Left = string;
export type Lib_PanelSessions_DigestsEqual_Right = string;
export type Lib_PanelSessions_DigestsEqual_LeftBuffer = Buffer;
export type Lib_PanelSessions_DigestsEqual_RightBuffer = Buffer;
export type Lib_PanelSessions_DigestsEqual_Returns = boolean;

export type Lib_PanelSessions_DigestValue_Value = string;
export type Lib_PanelSessions_DigestValue_Returns = string;

export type Lib_PanelSessions_GetPanelSession_Pool = Pool;
export type Lib_PanelSessions_GetPanelSession_SessionToken = string;
export type Lib_PanelSessions_GetPanelSession_Returns = Promise<Shared_AccessSession | undefined>;
export type Lib_PanelSessions_GetPanelSession_Row = Lib_PanelSessions_UserRow & {
  csrf_token_hash: string;
  expires_at: Date;
};
export type Lib_PanelSessions_GetPanelSession_FirstRow = Lib_PanelSessions_GetPanelSession_Row | undefined;
export type Lib_PanelSessions_GetPanelSession_Result = QueryResult<Lib_PanelSessions_GetPanelSession_Row>;
