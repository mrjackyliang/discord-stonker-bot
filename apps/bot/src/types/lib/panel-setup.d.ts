import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type { Lib_PanelAuth_Account } from './panel-auth.d.ts';

export type Lib_PanelSetup_SetupStatus = {
  claimExpiresAt?: string;
  claimRequired: boolean;
};

export type Lib_PanelSetup_SetupClaimMinutes = number;
export type Lib_PanelSetup_SetupCodeAlphabet = string;

export type Lib_PanelSetup_GenerateSetupCode_Returns = string;
export type Lib_PanelSetup_GenerateSetupCode_Characters = string;

export type Lib_PanelSetup_PreparePanelSetupClaim_Pool = Pool;
export type Lib_PanelSetup_PreparePanelSetupClaim_Returns = Promise<{
  code: string;
  expiresAt: string;
} | undefined>;
export type Lib_PanelSetup_PreparePanelSetupClaim_UserCountRow = {
  count: string;
};
export type Lib_PanelSetup_PreparePanelSetupClaim_UserCount = QueryResult<Lib_PanelSetup_PreparePanelSetupClaim_UserCountRow>;
export type Lib_PanelSetup_PreparePanelSetupClaim_Code = string;
export type Lib_PanelSetup_PreparePanelSetupClaim_Row = {
  expires_at: Date;
};
export type Lib_PanelSetup_PreparePanelSetupClaim_Result = QueryResult<Lib_PanelSetup_PreparePanelSetupClaim_Row>;
export type Lib_PanelSetup_PreparePanelSetupClaim_FirstRow = Lib_PanelSetup_PreparePanelSetupClaim_Row | undefined;
export type Lib_PanelSetup_PreparePanelSetupClaim_FirstUserCountRow = Lib_PanelSetup_PreparePanelSetupClaim_UserCountRow | undefined;

export type Lib_PanelSetup_ClaimPanelSetup_Pool = Pool;
export type Lib_PanelSetup_ClaimPanelSetup_Code = string;
export type Lib_PanelSetup_ClaimPanelSetup_Username = string;
export type Lib_PanelSetup_ClaimPanelSetup_Password = string;
export type Lib_PanelSetup_ClaimPanelSetup_Returns = Promise<Lib_PanelAuth_Account | 'invalid' | 'unavailable'>;
export type Lib_PanelSetup_ClaimPanelSetup_NormalizedCode = string | undefined;
export type Lib_PanelSetup_ClaimPanelSetup_CodeHash = string;
export type Lib_PanelSetup_ClaimPanelSetup_StoredClaim = QueryResult;
export type Lib_PanelSetup_ClaimPanelSetup_PasswordHash = string;
export type Lib_PanelSetup_ClaimPanelSetup_Account = Lib_PanelAuth_Account | undefined;
export type Lib_PanelSetup_ClaimPanelSetup_Client = PoolClient;
export type Lib_PanelSetup_ClaimPanelSetup_UserCountRow = {
  count: string;
};
export type Lib_PanelSetup_ClaimPanelSetup_FirstUserCountRow = Lib_PanelSetup_ClaimPanelSetup_UserCountRow | undefined;
export type Lib_PanelSetup_ClaimPanelSetup_UserCount = QueryResult<Lib_PanelSetup_ClaimPanelSetup_UserCountRow>;
export type Lib_PanelSetup_ClaimPanelSetup_ExistingClaim = QueryResult;
export type Lib_PanelSetup_ClaimPanelSetup_InsertedRow = Lib_PanelAuth_Account;
export type Lib_PanelSetup_ClaimPanelSetup_Inserted = QueryResult<Lib_PanelSetup_ClaimPanelSetup_InsertedRow>;

export type Lib_PanelSetup_GetPanelSetupStatus_Pool = Pool;
export type Lib_PanelSetup_GetPanelSetupStatus_Returns = Promise<Lib_PanelSetup_SetupStatus>;
export type Lib_PanelSetup_GetPanelSetupStatus_UserCountRow = {
  count: string;
};
export type Lib_PanelSetup_GetPanelSetupStatus_FirstUserCountRow = Lib_PanelSetup_GetPanelSetupStatus_UserCountRow | undefined;
export type Lib_PanelSetup_GetPanelSetupStatus_UserCount = QueryResult<Lib_PanelSetup_GetPanelSetupStatus_UserCountRow>;
export type Lib_PanelSetup_GetPanelSetupStatus_ClaimRow = {
  expires_at: Date;
};
export type Lib_PanelSetup_GetPanelSetupStatus_FirstClaimRow = Lib_PanelSetup_GetPanelSetupStatus_ClaimRow | undefined;
export type Lib_PanelSetup_GetPanelSetupStatus_ClaimRowResult = QueryResult<Lib_PanelSetup_GetPanelSetupStatus_ClaimRow>;

export type Lib_PanelSetup_NormalizePanelSetupCode_Value = string;
export type Lib_PanelSetup_NormalizePanelSetupCode_Returns = string | undefined;
export type Lib_PanelSetup_NormalizePanelSetupCode_Characters = string;
