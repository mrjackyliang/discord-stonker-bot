import type {
  Pool,
  QueryResult,
} from 'pg';

import type { Shared_TokenScope } from '../shared.d.ts';

export type Lib_PanelTokens_Token = {
  createdAt: string;
  expiresAt: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
  scopes: Shared_TokenScope[];
};
export type Lib_PanelTokens_CreatedToken = {
  plaintext: string;
  token: Lib_PanelTokens_Token;
};
export type Lib_PanelTokens_TokenInput = {
  expiresAt?: string | null | undefined;
  name: string;
  scopes: Shared_TokenScope[];
};
export type Lib_PanelTokens_TokenQueryRow = {
  created_at: Date;
  expires_at: Date | null;
  id: string;
  last_used_at: Date | null;
  name: string;
  scopes: Shared_TokenScope[];
};
export type Lib_PanelTokens_TokenColumns = string;
export type Lib_PanelTokens_TokenIdCharacters = string;

export type Lib_PanelTokens_CreatePanelToken_Pool = Pool;
export type Lib_PanelTokens_CreatePanelToken_UserId = string;
export type Lib_PanelTokens_CreatePanelToken_Input = Lib_PanelTokens_TokenInput;
export type Lib_PanelTokens_CreatePanelToken_Returns = Promise<Lib_PanelTokens_CreatedToken | 'name-taken'>;
export type Lib_PanelTokens_CreatePanelToken_Taken = QueryResult;
export type Lib_PanelTokens_CreatePanelToken_Id = string;
export type Lib_PanelTokens_CreatePanelToken_Plaintext = string;
export type Lib_PanelTokens_CreatePanelToken_Result = QueryResult<Lib_PanelTokens_TokenQueryRow>;
export type Lib_PanelTokens_CreatePanelToken_Row = Lib_PanelTokens_TokenQueryRow | undefined;

export type Lib_PanelTokens_DeletePanelToken_Pool = Pool;
export type Lib_PanelTokens_DeletePanelToken_UserId = string;
export type Lib_PanelTokens_DeletePanelToken_TokenId = string;
export type Lib_PanelTokens_DeletePanelToken_Returns = Promise<string | undefined>;
export type Lib_PanelTokens_DeletePanelToken_QueryRow = {
  name: string;
};
export type Lib_PanelTokens_DeletePanelToken_Row = Lib_PanelTokens_DeletePanelToken_QueryRow | undefined;
export type Lib_PanelTokens_DeletePanelToken_Result = QueryResult<Lib_PanelTokens_DeletePanelToken_QueryRow>;

export type Lib_PanelTokens_IsPanelTokenId_Value = unknown;
export type Lib_PanelTokens_IsPanelTokenId_Returns = boolean;

export type Lib_PanelTokens_ListPanelTokens_Pool = Pool;
export type Lib_PanelTokens_ListPanelTokens_UserId = string;
export type Lib_PanelTokens_ListPanelTokens_Returns = Promise<Lib_PanelTokens_Token[]>;
export type Lib_PanelTokens_ListPanelTokens_Result = QueryResult<Lib_PanelTokens_TokenQueryRow>;

export type Lib_PanelTokens_TokenFromRow_Row = Lib_PanelTokens_TokenQueryRow;
export type Lib_PanelTokens_TokenFromRow_Returns = Lib_PanelTokens_Token;

export type Lib_PanelTokens_UpdatePanelToken_Pool = Pool;
export type Lib_PanelTokens_UpdatePanelToken_UserId = string;
export type Lib_PanelTokens_UpdatePanelToken_TokenId = string;
export type Lib_PanelTokens_UpdatePanelToken_Input = Lib_PanelTokens_TokenInput;
export type Lib_PanelTokens_UpdatePanelToken_Returns = Promise<Lib_PanelTokens_Token | 'name-taken' | 'not-found'>;
export type Lib_PanelTokens_UpdatePanelToken_Existing = QueryResult;
export type Lib_PanelTokens_UpdatePanelToken_Taken = QueryResult;
export type Lib_PanelTokens_UpdatePanelToken_Result = QueryResult<Lib_PanelTokens_TokenQueryRow>;
export type Lib_PanelTokens_UpdatePanelToken_Row = Lib_PanelTokens_TokenQueryRow | undefined;
