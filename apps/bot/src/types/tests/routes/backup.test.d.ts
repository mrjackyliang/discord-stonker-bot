import type { QueryResult } from 'pg';

import type {
  Lib_Backup_Document,
  Lib_Backup_Grant,
  Lib_Backup_ImportPreview,
  Lib_Backup_LegacySource,
  Lib_Backup_Purpose,
} from '../../lib/backup.d.ts';
import type { Tests_Support_Accounts_Authenticator } from '../support/accounts.d.ts';
import type {
  Tests_Support_Harness_Client,
  Tests_Support_Harness_Harness,
  Tests_Support_Harness_Response,
} from '../support/harness.d.ts';
import type {
  Tests_Support_Passkeys_Authenticator,
  Tests_Support_Passkeys_Options,
} from '../support/passkeys.d.ts';

export type Tests_Routes_Backup_BaseUrl = string;
export type Tests_Routes_Backup_Client = Tests_Support_Harness_Client;
export type Tests_Routes_Backup_Harness = Tests_Support_Harness_Harness | undefined;
export type Tests_Routes_Backup_RequiredHarness = Tests_Support_Harness_Harness;
export type Tests_Routes_Backup_Response = Tests_Support_Harness_Response;
export type Tests_Routes_Backup_Password = string;
export type Tests_Routes_Backup_UserId = string;
export type Tests_Routes_Backup_PlaintextToken = string;
export type Tests_Routes_Backup_Grant = Lib_Backup_Grant;
export type Tests_Routes_Backup_Purpose = Lib_Backup_Purpose;
export type Tests_Routes_Backup_OptionalCode = string | undefined;
export type Tests_Routes_Backup_LegacyConfiguration = Record<string, unknown>;
export type Tests_Routes_Backup_LegacySource = Lib_Backup_LegacySource;
export type Tests_Routes_Backup_Preview = Lib_Backup_ImportPreview;
export type Tests_Routes_Backup_Document = Lib_Backup_Document;
export type Tests_Routes_Backup_SerializedDocument = string;
export type Tests_Routes_Backup_Authenticator = Tests_Support_Accounts_Authenticator;
export type Tests_Routes_Backup_Passkey = Tests_Support_Passkeys_Authenticator;
export type Tests_Routes_Backup_Options = Tests_Support_Passkeys_Options;
export type Tests_Routes_Backup_TokenHashRow = {
  token_hash: string;
};
export type Tests_Routes_Backup_TokenHashResult = QueryResult<Tests_Routes_Backup_TokenHashRow>;
export type Tests_Routes_Backup_TokenHashRowResult = Tests_Routes_Backup_TokenHashRow | undefined;
export type Tests_Routes_Backup_TokenHash = string;
export type Tests_Routes_Backup_RuntimeRow = {
  desired_state: string;
  discord_token_ciphertext: string | null;
};
export type Tests_Routes_Backup_RuntimeResult = QueryResult<Tests_Routes_Backup_RuntimeRow>;
export type Tests_Routes_Backup_ServerCountRow = {
  count: string;
};
export type Tests_Routes_Backup_ServerCountResult = QueryResult<Tests_Routes_Backup_ServerCountRow>;
export type Tests_Routes_Backup_ServerCountRowResult = Tests_Routes_Backup_ServerCountRow | undefined;
export type Tests_Routes_Backup_DeepConfiguration = Record<string, unknown>;
export type Tests_Routes_Backup_DeepKey = string;
export type Tests_Routes_Backup_UnknownBody = Record<string, unknown>;
export type Tests_Routes_Backup_UnknownValue = unknown;
export type Tests_Routes_Backup_ContentDisposition = string | null;
export type Tests_Routes_Backup_FirstRow<Value> = Value | undefined;
export type Tests_Routes_Backup_GetHarness_Returns = Tests_Routes_Backup_RequiredHarness;
export type Tests_Routes_Backup_GrantFrom_Response = Tests_Routes_Backup_Response;
export type Tests_Routes_Backup_GrantFrom_Returns = Tests_Routes_Backup_Grant;
export type Tests_Routes_Backup_Confirm_Client = Tests_Routes_Backup_Client;
export type Tests_Routes_Backup_Confirm_Purpose = Tests_Routes_Backup_Purpose;
export type Tests_Routes_Backup_Confirm_Password = Tests_Routes_Backup_Password;
export type Tests_Routes_Backup_Confirm_Code = Tests_Routes_Backup_OptionalCode;
export type Tests_Routes_Backup_Confirm_Returns = Promise<Tests_Routes_Backup_Response>;
