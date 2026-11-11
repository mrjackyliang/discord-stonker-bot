import type express from 'express';

import type {
  tokenCreate,
  tokenUpdate,
} from '../../lib/account-schemas.js';
import type {
  Lib_PanelTokens_CreatedToken,
  Lib_PanelTokens_Token,
} from '../lib/panel-tokens.d.ts';
import type {
  Server_Access,
  Server_Context,
} from '../server.d.ts';
import type {
  Shared_Principal,
  Shared_TokenScope,
} from '../shared.d.ts';

export type Routes_Tokens_ViewerScopes = Shared_TokenScope[];

export type Routes_Tokens_Runner_Access = Server_Access;
export type Routes_Tokens_Runner_Context = Server_Context;

export type Routes_Tokens_Runner_Constructor_Context = Server_Context;
export type Routes_Tokens_Runner_Constructor_Access = Server_Access;

export type Routes_Tokens_Runner_Register_App = express.Express;
export type Routes_Tokens_Runner_Register_Returns = void;

export type Routes_Tokens_Runner_GetTokenId_Request = express.Request;
export type Routes_Tokens_Runner_GetTokenId_Returns = string | undefined;
export type Routes_Tokens_Runner_GetTokenId_TokenId = unknown;

export type Routes_Tokens_Runner_IsScopeRefused_Response = express.Response;
export type Routes_Tokens_Runner_IsScopeRefused_Scopes = Shared_TokenScope[];
export type Routes_Tokens_Runner_IsScopeRefused_Returns = boolean;
export type Routes_Tokens_Runner_IsScopeRefused_Principal = Shared_Principal;
export type Routes_Tokens_Runner_IsScopeRefused_RefusedScope = Shared_TokenScope | undefined;

export type Routes_Tokens_Runner_RouteCreate_Request = express.Request;
export type Routes_Tokens_Runner_RouteCreate_Response = express.Response;
export type Routes_Tokens_Runner_RouteCreate_Returns = Promise<void>;
export type Routes_Tokens_Runner_RouteCreate_RequestBody = ReturnType<typeof tokenCreate.safeParse>;
export type Routes_Tokens_Runner_RouteCreate_Principal = Shared_Principal;
export type Routes_Tokens_Runner_RouteCreate_Result = Lib_PanelTokens_CreatedToken | 'name-taken';

export type Routes_Tokens_Runner_RouteDelete_Request = express.Request;
export type Routes_Tokens_Runner_RouteDelete_Response = express.Response;
export type Routes_Tokens_Runner_RouteDelete_Returns = Promise<void>;
export type Routes_Tokens_Runner_RouteDelete_TokenId = string | undefined;
export type Routes_Tokens_Runner_RouteDelete_Principal = Shared_Principal;
export type Routes_Tokens_Runner_RouteDelete_Name = string | undefined;

export type Routes_Tokens_Runner_RouteList_Request = express.Request;
export type Routes_Tokens_Runner_RouteList_Response = express.Response;
export type Routes_Tokens_Runner_RouteList_Returns = Promise<void>;
export type Routes_Tokens_Runner_RouteList_Principal = Shared_Principal;

export type Routes_Tokens_Runner_RouteUpdate_Request = express.Request;
export type Routes_Tokens_Runner_RouteUpdate_Response = express.Response;
export type Routes_Tokens_Runner_RouteUpdate_Returns = Promise<void>;
export type Routes_Tokens_Runner_RouteUpdate_TokenId = string | undefined;
export type Routes_Tokens_Runner_RouteUpdate_Principal = Shared_Principal;
export type Routes_Tokens_Runner_RouteUpdate_RequestBody = ReturnType<typeof tokenUpdate.safeParse>;
export type Routes_Tokens_Runner_RouteUpdate_Result = Lib_PanelTokens_Token | 'name-taken' | 'not-found';
