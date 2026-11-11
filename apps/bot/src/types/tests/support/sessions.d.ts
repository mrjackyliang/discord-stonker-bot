import type {
  Pool,
  QueryResult,
} from 'pg';

import type {
  Shared_PanelRole,
  Shared_TokenScope,
} from '../../shared.d.ts';
import type { Tests_Support_Harness_Client } from './harness.d.ts';

export type Tests_Support_Sessions_UserOptions = {
  allServers: boolean;
  role: Shared_PanelRole;
  serverIds: string[];
  username: string;
};

export type Tests_Support_Sessions_CreateTestToken_Pool = Pool;
export type Tests_Support_Sessions_CreateTestToken_UserId = string;
export type Tests_Support_Sessions_CreateTestToken_Scopes = Shared_TokenScope[];
export type Tests_Support_Sessions_CreateTestToken_Returns = Promise<string>;
export type Tests_Support_Sessions_CreateTestToken_RawToken = string;
export type Tests_Support_Sessions_CreateTestToken_TokenId = string;

export type Tests_Support_Sessions_CreateTestUser_Pool = Pool;
export type Tests_Support_Sessions_CreateTestUser_Options = Tests_Support_Sessions_UserOptions;
export type Tests_Support_Sessions_CreateTestUser_Returns = Promise<string>;
export type Tests_Support_Sessions_CreateTestUser_Row = {
  id: string;
};
export type Tests_Support_Sessions_CreateTestUser_FirstRow = Tests_Support_Sessions_CreateTestUser_Row | undefined;
export type Tests_Support_Sessions_CreateTestUser_Result = QueryResult<Tests_Support_Sessions_CreateTestUser_Row>;

export type Tests_Support_Sessions_SignInTestUser_Pool = Pool;
export type Tests_Support_Sessions_SignInTestUser_Client = Tests_Support_Harness_Client;
export type Tests_Support_Sessions_SignInTestUser_Options = Tests_Support_Sessions_UserOptions;
export type Tests_Support_Sessions_SignInTestUser_Returns = Promise<string>;
export type Tests_Support_Sessions_SignInTestUser_UserId = string;
export type Tests_Support_Sessions_SignInTestUser_Session = {
  csrfToken: string;
  expiresAt: string;
  sessionToken: string;
};
