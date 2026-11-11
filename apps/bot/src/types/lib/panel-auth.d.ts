import type { TOTP } from 'otpauth';
import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type {
  Shared_AccessUser,
  Shared_PanelRole,
} from '../shared.d.ts';

export type Lib_PanelAuth_Account = {
  id: string;
  role: Shared_PanelRole;
  username: string;
};
export type Lib_PanelAuth_AuthenticatedUser = Shared_AccessUser & {
  totpEnabled: boolean;
};
export type Lib_PanelAuth_SecurityPasskey = {
  createdAt: string;
  hostname: string | null;
  id: string;
  lastUsedAt: string | null;
  name: string;
};
export type Lib_PanelAuth_Security = {
  passkeys: Lib_PanelAuth_SecurityPasskey[];
  recoveryCodesRemaining: number;
  role: Shared_PanelRole;
  totpEnabled: boolean;
  username: string;
};
export type Lib_PanelAuth_SignInChallenge = {
  challenge: string;
  expiresAt: string;
};
export type Lib_PanelAuth_TotpSecret = {
  secret: string;
  uri: string;
};

export type Lib_PanelAuth_CodeAlphabet = string;
export type Lib_PanelAuth_RecoveryCodeCharacters = string;
export type Lib_PanelAuth_TotpIssuer = string;
export type Lib_PanelAuth_PasswordHashOptions = {
  algorithm: 2;
  memoryCost: number;
  outputLen: number;
  parallelism: number;
  timeCost: number;
};
export type Lib_PanelAuth_DummyPasswordHash = Promise<string> | undefined;

export type Lib_PanelAuth_AuthenticatePanelUser_Pool = Pool;
export type Lib_PanelAuth_AuthenticatePanelUser_Username = string;
export type Lib_PanelAuth_AuthenticatePanelUser_Password = string;
export type Lib_PanelAuth_AuthenticatePanelUser_Returns = Promise<Lib_PanelAuth_AuthenticatedUser | undefined>;
export type Lib_PanelAuth_AuthenticatePanelUser_QueryRow = {
  all_guilds: boolean;
  enabled: boolean;
  guild_ids: string[];
  id: string;
  password_hash: string;
  role: Shared_PanelRole;
  totp_enabled: boolean;
  username: string;
};
export type Lib_PanelAuth_AuthenticatePanelUser_Row = Lib_PanelAuth_AuthenticatePanelUser_QueryRow | undefined;
export type Lib_PanelAuth_AuthenticatePanelUser_Result = QueryResult<Lib_PanelAuth_AuthenticatePanelUser_QueryRow>;
export type Lib_PanelAuth_AuthenticatePanelUser_IsValid = boolean;

export type Lib_PanelAuth_ChangePanelPassword_Pool = Pool;
export type Lib_PanelAuth_ChangePanelPassword_UserId = string;
export type Lib_PanelAuth_ChangePanelPassword_NewPassword = string;
export type Lib_PanelAuth_ChangePanelPassword_KeepSessionToken = string;
export type Lib_PanelAuth_ChangePanelPassword_Returns = Promise<void>;
export type Lib_PanelAuth_ChangePanelPassword_PasswordHash = string;
export type Lib_PanelAuth_ChangePanelPassword_Client = PoolClient;

export type Lib_PanelAuth_ChangePanelUsername_Pool = Pool;
export type Lib_PanelAuth_ChangePanelUsername_UserId = string;
export type Lib_PanelAuth_ChangePanelUsername_Username = string;
export type Lib_PanelAuth_ChangePanelUsername_Returns = Promise<Lib_PanelAuth_Account | 'conflict' | 'not-found'>;
export type Lib_PanelAuth_ChangePanelUsername_Conflict = QueryResult;
export type Lib_PanelAuth_ChangePanelUsername_QueryRow = {
  id: string;
  role: Shared_PanelRole;
  username: string;
};
export type Lib_PanelAuth_ChangePanelUsername_Row = Lib_PanelAuth_ChangePanelUsername_QueryRow | undefined;
export type Lib_PanelAuth_ChangePanelUsername_Result = QueryResult<Lib_PanelAuth_ChangePanelUsername_QueryRow>;

export type Lib_PanelAuth_ConfirmPanelPassword_Pool = Pool;
export type Lib_PanelAuth_ConfirmPanelPassword_UserId = string;
export type Lib_PanelAuth_ConfirmPanelPassword_Password = string;
export type Lib_PanelAuth_ConfirmPanelPassword_Returns = Promise<boolean>;
export type Lib_PanelAuth_ConfirmPanelPassword_QueryRow = {
  password_hash: string;
};
export type Lib_PanelAuth_ConfirmPanelPassword_Row = Lib_PanelAuth_ConfirmPanelPassword_QueryRow | undefined;
export type Lib_PanelAuth_ConfirmPanelPassword_Result = QueryResult<Lib_PanelAuth_ConfirmPanelPassword_QueryRow>;

export type Lib_PanelAuth_ConsumePanelRecoveryCode_Pool = Pool;
export type Lib_PanelAuth_ConsumePanelRecoveryCode_UserId = string;
export type Lib_PanelAuth_ConsumePanelRecoveryCode_Code = string;
export type Lib_PanelAuth_ConsumePanelRecoveryCode_Returns = Promise<boolean>;
export type Lib_PanelAuth_ConsumePanelRecoveryCode_NormalizedCode = string | undefined;
export type Lib_PanelAuth_ConsumePanelRecoveryCode_Result = QueryResult;

export type Lib_PanelAuth_CreatePanelSignInChallenge_Pool = Pool;
export type Lib_PanelAuth_CreatePanelSignInChallenge_UserId = string;
export type Lib_PanelAuth_CreatePanelSignInChallenge_Returns = Promise<Lib_PanelAuth_SignInChallenge>;
export type Lib_PanelAuth_CreatePanelSignInChallenge_Challenge = string;
export type Lib_PanelAuth_CreatePanelSignInChallenge_QueryRow = {
  expires_at: Date;
};
export type Lib_PanelAuth_CreatePanelSignInChallenge_Row = Lib_PanelAuth_CreatePanelSignInChallenge_QueryRow | undefined;
export type Lib_PanelAuth_CreatePanelSignInChallenge_Result = QueryResult<Lib_PanelAuth_CreatePanelSignInChallenge_QueryRow>;

export type Lib_PanelAuth_CreatePanelTotpSecret_Username = string;
export type Lib_PanelAuth_CreatePanelTotpSecret_Returns = Lib_PanelAuth_TotpSecret;
export type Lib_PanelAuth_CreatePanelTotpSecret_Totp = TOTP;

export type Lib_PanelAuth_DeletePanelSignInChallenge_Pool = Pool;
export type Lib_PanelAuth_DeletePanelSignInChallenge_Challenge = string;
export type Lib_PanelAuth_DeletePanelSignInChallenge_Returns = Promise<void>;

export type Lib_PanelAuth_DisablePanelTotp_Pool = Pool;
export type Lib_PanelAuth_DisablePanelTotp_UserId = string;
export type Lib_PanelAuth_DisablePanelTotp_Returns = Promise<boolean>;
export type Lib_PanelAuth_DisablePanelTotp_Client = PoolClient;
export type Lib_PanelAuth_DisablePanelTotp_Result = QueryResult;

export type Lib_PanelAuth_EnablePanelTotp_Pool = Pool;
export type Lib_PanelAuth_EnablePanelTotp_UserId = string;
export type Lib_PanelAuth_EnablePanelTotp_Secret = string;
export type Lib_PanelAuth_EnablePanelTotp_Step = number;
export type Lib_PanelAuth_EnablePanelTotp_CredentialKey = Buffer;
export type Lib_PanelAuth_EnablePanelTotp_Returns = Promise<string[]>;
export type Lib_PanelAuth_EnablePanelTotp_SecretCiphertext = string;
export type Lib_PanelAuth_EnablePanelTotp_RecoveryCodes = string[];
export type Lib_PanelAuth_EnablePanelTotp_Client = PoolClient;

export type Lib_PanelAuth_GeneratePanelRecoveryCodes_Returns = string[];
export type Lib_PanelAuth_GeneratePanelRecoveryCodes_Codes = string[];
export type Lib_PanelAuth_GeneratePanelRecoveryCodes_Characters = string;

export type Lib_PanelAuth_GetDummyPasswordHash_Returns = Promise<string>;

export type Lib_PanelAuth_GetPanelAccount_Pool = Pool;
export type Lib_PanelAuth_GetPanelAccount_UserId = string;
export type Lib_PanelAuth_GetPanelAccount_Returns = Promise<Lib_PanelAuth_Account | undefined>;
export type Lib_PanelAuth_GetPanelAccount_QueryRow = {
  id: string;
  role: Shared_PanelRole;
  username: string;
};
export type Lib_PanelAuth_GetPanelAccount_Row = Lib_PanelAuth_GetPanelAccount_QueryRow | undefined;
export type Lib_PanelAuth_GetPanelAccount_Result = QueryResult<Lib_PanelAuth_GetPanelAccount_QueryRow>;

export type Lib_PanelAuth_GetPanelSecurity_Pool = Pool;
export type Lib_PanelAuth_GetPanelSecurity_UserId = string;
export type Lib_PanelAuth_GetPanelSecurity_Returns = Promise<Lib_PanelAuth_Security | undefined>;
export type Lib_PanelAuth_GetPanelSecurity_QueryRow = {
  recovery_codes_remaining: string;
  role: Shared_PanelRole;
  totp_enabled: boolean;
  username: string;
};
export type Lib_PanelAuth_GetPanelSecurity_Row = Lib_PanelAuth_GetPanelSecurity_QueryRow | undefined;
export type Lib_PanelAuth_GetPanelSecurity_Result = QueryResult<Lib_PanelAuth_GetPanelSecurity_QueryRow>;
export type Lib_PanelAuth_GetPanelSecurity_PasskeyRow = {
  created_at: Date;
  credential_id: string;
  last_used_at: Date | null;
  name: string;
  rp_id: string | null;
};
export type Lib_PanelAuth_GetPanelSecurity_PasskeyResult = QueryResult<Lib_PanelAuth_GetPanelSecurity_PasskeyRow>;

export type Lib_PanelAuth_GetPanelSignInChallenge_Pool = Pool;
export type Lib_PanelAuth_GetPanelSignInChallenge_Challenge = string;
export type Lib_PanelAuth_GetPanelSignInChallenge_Returns = Promise<string | undefined>;
export type Lib_PanelAuth_GetPanelSignInChallenge_QueryRow = {
  user_id: string;
};
export type Lib_PanelAuth_GetPanelSignInChallenge_Row = Lib_PanelAuth_GetPanelSignInChallenge_QueryRow | undefined;
export type Lib_PanelAuth_GetPanelSignInChallenge_Result = QueryResult<Lib_PanelAuth_GetPanelSignInChallenge_QueryRow>;

export type Lib_PanelAuth_GetPanelTotpEnrollment_Pool = Pool;
export type Lib_PanelAuth_GetPanelTotpEnrollment_UserId = string;
export type Lib_PanelAuth_GetPanelTotpEnrollment_CredentialKey = Buffer;
export type Lib_PanelAuth_GetPanelTotpEnrollment_Returns = Promise<string | undefined>;
export type Lib_PanelAuth_GetPanelTotpEnrollment_QueryRow = {
  secret_ciphertext: string;
};
export type Lib_PanelAuth_GetPanelTotpEnrollment_Row = Lib_PanelAuth_GetPanelTotpEnrollment_QueryRow | undefined;
export type Lib_PanelAuth_GetPanelTotpEnrollment_Result = QueryResult<Lib_PanelAuth_GetPanelTotpEnrollment_QueryRow>;

export type Lib_PanelAuth_HasPanelTotp_Pool = Pool;
export type Lib_PanelAuth_HasPanelTotp_UserId = string;
export type Lib_PanelAuth_HasPanelTotp_Returns = Promise<boolean>;
export type Lib_PanelAuth_HasPanelTotp_Result = QueryResult;

export type Lib_PanelAuth_HashPanelPassword_Password = string;
export type Lib_PanelAuth_HashPanelPassword_Returns = Promise<string>;

export type Lib_PanelAuth_HashPanelRecoveryCode_UserId = string;
export type Lib_PanelAuth_HashPanelRecoveryCode_NormalizedCode = string;
export type Lib_PanelAuth_HashPanelRecoveryCode_Returns = string;

export type Lib_PanelAuth_InsertRecoveryCodes_Client = PoolClient;
export type Lib_PanelAuth_InsertRecoveryCodes_UserId = string;
export type Lib_PanelAuth_InsertRecoveryCodes_Codes = string[];
export type Lib_PanelAuth_InsertRecoveryCodes_Returns = Promise<void>;

export type Lib_PanelAuth_NormalizePanelRecoveryCode_Value = string;
export type Lib_PanelAuth_NormalizePanelRecoveryCode_Returns = string | undefined;
export type Lib_PanelAuth_NormalizePanelRecoveryCode_Characters = string;

export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_Pool = Pool;
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_Challenge = string;
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_Returns = Promise<boolean>;
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_ChallengeHash = string;
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_FailureLimit = number;
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_QueryRow = {
  failures: number;
};
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_Row = Lib_PanelAuth_RecordPanelSignInChallengeFailure_QueryRow | undefined;
export type Lib_PanelAuth_RecordPanelSignInChallengeFailure_Result = QueryResult<Lib_PanelAuth_RecordPanelSignInChallengeFailure_QueryRow>;

export type Lib_PanelAuth_ReplacePanelRecoveryCodes_Pool = Pool;
export type Lib_PanelAuth_ReplacePanelRecoveryCodes_UserId = string;
export type Lib_PanelAuth_ReplacePanelRecoveryCodes_Returns = Promise<string[] | undefined>;
export type Lib_PanelAuth_ReplacePanelRecoveryCodes_RecoveryCodes = string[];
export type Lib_PanelAuth_ReplacePanelRecoveryCodes_Client = PoolClient;

export type Lib_PanelAuth_RunTransaction_Pool = Pool;
export type Lib_PanelAuth_RunTransaction_Callback = (client: PoolClient) => Promise<boolean>;
export type Lib_PanelAuth_RunTransaction_Returns = Promise<boolean>;
export type Lib_PanelAuth_RunTransaction_Client = PoolClient;
export type Lib_PanelAuth_RunTransaction_Result = boolean;

export type Lib_PanelAuth_StartPanelTotpEnrollment_Pool = Pool;
export type Lib_PanelAuth_StartPanelTotpEnrollment_UserId = string;
export type Lib_PanelAuth_StartPanelTotpEnrollment_Secret = string;
export type Lib_PanelAuth_StartPanelTotpEnrollment_CredentialKey = Buffer;
export type Lib_PanelAuth_StartPanelTotpEnrollment_Returns = Promise<string>;
export type Lib_PanelAuth_StartPanelTotpEnrollment_QueryRow = {
  expires_at: Date;
};
export type Lib_PanelAuth_StartPanelTotpEnrollment_Row = Lib_PanelAuth_StartPanelTotpEnrollment_QueryRow | undefined;
export type Lib_PanelAuth_StartPanelTotpEnrollment_Result = QueryResult<Lib_PanelAuth_StartPanelTotpEnrollment_QueryRow>;

export type Lib_PanelAuth_VerifyPanelPassword_PasswordHash = string;
export type Lib_PanelAuth_VerifyPanelPassword_Password = string;
export type Lib_PanelAuth_VerifyPanelPassword_Returns = Promise<boolean>;

export type Lib_PanelAuth_VerifyPanelTotp_Pool = Pool;
export type Lib_PanelAuth_VerifyPanelTotp_UserId = string;
export type Lib_PanelAuth_VerifyPanelTotp_Code = string;
export type Lib_PanelAuth_VerifyPanelTotp_CredentialKey = Buffer;
export type Lib_PanelAuth_VerifyPanelTotp_Now = number;
export type Lib_PanelAuth_VerifyPanelTotp_Returns = Promise<boolean>;
export type Lib_PanelAuth_VerifyPanelTotp_QueryRow = {
  last_used_step: string | null;
  secret_ciphertext: string;
};
export type Lib_PanelAuth_VerifyPanelTotp_Row = Lib_PanelAuth_VerifyPanelTotp_QueryRow | undefined;
export type Lib_PanelAuth_VerifyPanelTotp_Result = QueryResult<Lib_PanelAuth_VerifyPanelTotp_QueryRow>;
export type Lib_PanelAuth_VerifyPanelTotp_Secret = string;
export type Lib_PanelAuth_VerifyPanelTotp_MatchedStep = number | undefined;
export type Lib_PanelAuth_VerifyPanelTotp_Update = QueryResult;

export type Lib_PanelAuth_VerifyPanelTotpCode_Secret = string;
export type Lib_PanelAuth_VerifyPanelTotpCode_Code = string;
export type Lib_PanelAuth_VerifyPanelTotpCode_Now = number;
export type Lib_PanelAuth_VerifyPanelTotpCode_Returns = number | undefined;
export type Lib_PanelAuth_VerifyPanelTotpCode_Totp = TOTP;
export type Lib_PanelAuth_VerifyPanelTotpCode_Delta = number | null;
