import type express from 'express';
import type {
  Pool,
  QueryResult,
} from 'pg';

import type {
  Shared_AccessSession,
  Shared_AccessToken,
  Shared_AccessUser,
  Shared_PanelPermission,
  Shared_PanelRole,
  Shared_Principal,
  Shared_TokenScope,
} from '../shared.d.ts';

export type Lib_Access_CsrfCookieName = string;
export type Lib_Access_SessionCookieName = string;
export type Lib_Access_RolePermissions = Record<Shared_PanelRole, Shared_PanelPermission[]>;
export type Lib_Access_PermissionMessages = Record<Shared_PanelPermission, string>;

export type Lib_Access_GetBearerToken_Request = express.Request;
export type Lib_Access_GetBearerToken_Returns = string | undefined;
export type Lib_Access_GetBearerToken_Header = string | undefined;
export type Lib_Access_GetBearerToken_Match = RegExpExecArray | null;

export type Lib_Access_GetPrincipal_Response = express.Response;
export type Lib_Access_GetPrincipal_Returns = Shared_Principal;
export type Lib_Access_GetPrincipal_Principal = Shared_Principal | undefined;

export type Lib_Access_GetServerId_Response = express.Response;
export type Lib_Access_GetServerId_Returns = string;
export type Lib_Access_GetServerId_ServerId = unknown;

export type Lib_Access_RoleCan_Role = Shared_PanelRole;
export type Lib_Access_RoleCan_Permission = Shared_PanelPermission;
export type Lib_Access_RoleCan_Returns = boolean;

export type Lib_Access_ServerAccessible_User = Shared_AccessUser;
export type Lib_Access_ServerAccessible_ServerId = string;
export type Lib_Access_ServerAccessible_Returns = boolean;

export type Lib_Access_Runner_Pool = Pool;
export type Lib_Access_Runner_Constructor_Pool = Pool;

export type Lib_Access_Runner_ClearSession_Request = express.Request;
export type Lib_Access_Runner_ClearSession_Response = express.Response;
export type Lib_Access_Runner_ClearSession_Returns = void;
export type Lib_Access_Runner_ClearSession_Secure = boolean;

export type Lib_Access_Runner_HasValidCsrf_Request = express.Request;
export type Lib_Access_Runner_HasValidCsrf_CsrfHash = string;
export type Lib_Access_Runner_HasValidCsrf_Returns = boolean;
export type Lib_Access_Runner_HasValidCsrf_HeaderToken = string | undefined;
export type Lib_Access_Runner_HasValidCsrf_CookieToken = string | undefined;

export type Lib_Access_Runner_IssueSession_Request = express.Request;
export type Lib_Access_Runner_IssueSession_Response = express.Response;
export type Lib_Access_Runner_IssueSession_User = Pick<Shared_AccessUser, 'id' | 'role' | 'username'>;
export type Lib_Access_Runner_IssueSession_Status = number;
export type Lib_Access_Runner_IssueSession_Returns = Promise<void>;
export type Lib_Access_Runner_IssueSession_CreatedSession = {
  csrfToken: string;
  expiresAt: string;
  sessionToken: string;
};
export type Lib_Access_Runner_IssueSession_MaxAge = number;
export type Lib_Access_Runner_IssueSession_Secure = boolean;

export type Lib_Access_Runner_RequireAccess_Options = {
  mutation: boolean;
  scope: Shared_TokenScope;
};
export type Lib_Access_Runner_RequireAccess_Returns = express.RequestHandler;
export type Lib_Access_Runner_RequireAccess_Request = express.Request;
export type Lib_Access_Runner_RequireAccess_Response = express.Response;
export type Lib_Access_Runner_RequireAccess_Next = express.NextFunction;
export type Lib_Access_Runner_RequireAccess_CallbackReturns = Promise<void>;

export type Lib_Access_Runner_RequireAuthentication_Mutation = boolean;
export type Lib_Access_Runner_RequireAuthentication_Returns = express.RequestHandler;
export type Lib_Access_Runner_RequireAuthentication_Request = express.Request;
export type Lib_Access_Runner_RequireAuthentication_Response = express.Response;
export type Lib_Access_Runner_RequireAuthentication_Next = express.NextFunction;
export type Lib_Access_Runner_RequireAuthentication_CallbackReturns = Promise<void>;

export type Lib_Access_Runner_RequirePermission_Permission = Shared_PanelPermission;
export type Lib_Access_Runner_RequirePermission_Returns = express.RequestHandler;
export type Lib_Access_Runner_RequirePermission_Request = express.Request;
export type Lib_Access_Runner_RequirePermission_Response = express.Response;
export type Lib_Access_Runner_RequirePermission_Next = express.NextFunction;
export type Lib_Access_Runner_RequirePermission_CallbackReturns = void;
export type Lib_Access_Runner_RequirePermission_Principal = Shared_Principal;

export type Lib_Access_Runner_RequireServer_Returns = express.RequestHandler;
export type Lib_Access_Runner_RequireServer_Request = express.Request;
export type Lib_Access_Runner_RequireServer_Response = express.Response;
export type Lib_Access_Runner_RequireServer_Next = express.NextFunction;
export type Lib_Access_Runner_RequireServer_CallbackReturns = Promise<void>;
export type Lib_Access_Runner_RequireServer_Principal = Shared_Principal;
export type Lib_Access_Runner_RequireServer_RawServerId = unknown;
export type Lib_Access_Runner_RequireServer_ServerId = string;
export type Lib_Access_Runner_RequireServer_ExistingServer = QueryResult;

export type Lib_Access_Runner_RequireSession_Mutation = boolean;
export type Lib_Access_Runner_RequireSession_Returns = express.RequestHandler;
export type Lib_Access_Runner_RequireSession_Request = express.Request;
export type Lib_Access_Runner_RequireSession_Response = express.Response;
export type Lib_Access_Runner_RequireSession_Next = express.NextFunction;
export type Lib_Access_Runner_RequireSession_CallbackReturns = Promise<void>;

export type Lib_Access_Runner_ResolveSession_Request = express.Request;
export type Lib_Access_Runner_ResolveSession_Response = express.Response;
export type Lib_Access_Runner_ResolveSession_Mutation = boolean;
export type Lib_Access_Runner_ResolveSession_Message = string;
export type Lib_Access_Runner_ResolveSession_Returns = Promise<boolean>;
export type Lib_Access_Runner_ResolveSession_SessionToken = string | undefined;
export type Lib_Access_Runner_ResolveSession_Session = Shared_AccessSession | undefined;

export type Lib_Access_Runner_ResolveToken_Request = express.Request;
export type Lib_Access_Runner_ResolveToken_Response = express.Response;
export type Lib_Access_Runner_ResolveToken_Scope = Shared_TokenScope | undefined;
export type Lib_Access_Runner_ResolveToken_Returns = Promise<boolean>;
export type Lib_Access_Runner_ResolveToken_RawToken = string | undefined;
export type Lib_Access_Runner_ResolveToken_AccessToken = Shared_AccessToken | undefined;
