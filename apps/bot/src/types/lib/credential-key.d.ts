import type { FileHandle } from 'node:fs/promises';

import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type {
  Shared_AccessUser,
  Shared_FeatureDefinition,
  Shared_RemovedSecrets,
} from '../shared.d.ts';
import type { Tests_Support_Database_TestDatabase } from '../tests/support/database.d.ts';
import type { Lib_NotificationTargets_CreateNotificationTarget_Returns } from './notification-targets.d.ts';

export type Lib_CredentialKey_FindSealedSample_Pool = Pool;
export type Lib_CredentialKey_FindSealedSample_Sample_Ciphertext = string;
export type Lib_CredentialKey_FindSealedSample_Sample_Purpose = string;
export type Lib_CredentialKey_FindSealedSample_Sample = {
  ciphertext: Lib_CredentialKey_FindSealedSample_Sample_Ciphertext;
  purpose: Lib_CredentialKey_FindSealedSample_Sample_Purpose;
};
export type Lib_CredentialKey_FindSealedSample_Returns = Promise<Lib_CredentialKey_FindSealedSample_Sample | undefined>;
export type Lib_CredentialKey_FindSealedSample_TokenRow_DiscordTokenCiphertext = string;
export type Lib_CredentialKey_FindSealedSample_TokenRow = {
  discord_token_ciphertext: Lib_CredentialKey_FindSealedSample_TokenRow_DiscordTokenCiphertext;
};
export type Lib_CredentialKey_FindSealedSample_TokenResult = QueryResult<Lib_CredentialKey_FindSealedSample_TokenRow>;
export type Lib_CredentialKey_FindSealedSample_TokenRowResult = Lib_CredentialKey_FindSealedSample_TokenRow | undefined;
export type Lib_CredentialKey_FindSealedSample_SecretRow_Ciphertext = string;
export type Lib_CredentialKey_FindSealedSample_SecretRow_GuildId = string;
export type Lib_CredentialKey_FindSealedSample_SecretRow_SecretKey = string;
export type Lib_CredentialKey_FindSealedSample_SecretRow = {
  ciphertext: Lib_CredentialKey_FindSealedSample_SecretRow_Ciphertext;
  guild_id: Lib_CredentialKey_FindSealedSample_SecretRow_GuildId;
  secret_key: Lib_CredentialKey_FindSealedSample_SecretRow_SecretKey;
};
export type Lib_CredentialKey_FindSealedSample_SecretResult = QueryResult<Lib_CredentialKey_FindSealedSample_SecretRow>;
export type Lib_CredentialKey_FindSealedSample_SecretRowResult = Lib_CredentialKey_FindSealedSample_SecretRow | undefined;
export type Lib_CredentialKey_FindSealedSample_TotpRow_SecretCiphertext = string;
export type Lib_CredentialKey_FindSealedSample_TotpRow_UserId = string;
export type Lib_CredentialKey_FindSealedSample_TotpRow = {
  secret_ciphertext: Lib_CredentialKey_FindSealedSample_TotpRow_SecretCiphertext;
  user_id: Lib_CredentialKey_FindSealedSample_TotpRow_UserId;
};
export type Lib_CredentialKey_FindSealedSample_TotpResult = QueryResult<Lib_CredentialKey_FindSealedSample_TotpRow>;
export type Lib_CredentialKey_FindSealedSample_TotpRowResult = Lib_CredentialKey_FindSealedSample_TotpRow | undefined;

export type Lib_CredentialKey_IsMissingFile_Error = unknown;
export type Lib_CredentialKey_IsMissingFile_Returns = boolean;

export type Lib_CredentialKey_PrepareCredentialKey_Pool = Pool;
export type Lib_CredentialKey_PrepareCredentialKey_FilePath = string;
export type Lib_CredentialKey_PrepareCredentialKey_Returns = Promise<string[]>;
export type Lib_CredentialKey_PrepareCredentialKey_CredentialKey = Buffer | undefined;
export type Lib_CredentialKey_PrepareCredentialKey_NewKey = Buffer;
export type Lib_CredentialKey_PrepareCredentialKey_Client = PoolClient;
export type Lib_CredentialKey_PrepareCredentialKey_RemovedSecrets = string[];
export type Lib_CredentialKey_PrepareCredentialKey_KeyFile = FileHandle;

export type Lib_CredentialKey_RemoveLockedSecrets_Client = PoolClient;
export type Lib_CredentialKey_RemoveLockedSecrets_Returns = Promise<string[]>;
export type Lib_CredentialKey_RemoveLockedSecrets_RemovedSecrets = string[];
export type Lib_CredentialKey_RemoveLockedSecrets_TokenRow_HasToken = boolean;
export type Lib_CredentialKey_RemoveLockedSecrets_TokenRow = {
  has_token: Lib_CredentialKey_RemoveLockedSecrets_TokenRow_HasToken;
};
export type Lib_CredentialKey_RemoveLockedSecrets_TokenResult = QueryResult<Lib_CredentialKey_RemoveLockedSecrets_TokenRow>;
export type Lib_CredentialKey_RemoveLockedSecrets_TokenRowResult = Lib_CredentialKey_RemoveLockedSecrets_TokenRow | undefined;
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureRow_FeatureKey = string;
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureRow_GuildId = string;
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureRow_ServerName = string;
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureRow = {
  feature_key: Lib_CredentialKey_RemoveLockedSecrets_FeatureRow_FeatureKey;
  guild_id: Lib_CredentialKey_RemoveLockedSecrets_FeatureRow_GuildId;
  server_name: Lib_CredentialKey_RemoveLockedSecrets_FeatureRow_ServerName;
};
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureResult = QueryResult<Lib_CredentialKey_RemoveLockedSecrets_FeatureRow>;
export type Lib_CredentialKey_RemoveLockedSecrets_SecretCountRow_Count = string;
export type Lib_CredentialKey_RemoveLockedSecrets_SecretCountRow = {
  count: Lib_CredentialKey_RemoveLockedSecrets_SecretCountRow_Count;
};
export type Lib_CredentialKey_RemoveLockedSecrets_SecretCountResult = QueryResult<Lib_CredentialKey_RemoveLockedSecrets_SecretCountRow>;
export type Lib_CredentialKey_RemoveLockedSecrets_SecretCountRowResult = Lib_CredentialKey_RemoveLockedSecrets_SecretCountRow | undefined;
export type Lib_CredentialKey_RemoveLockedSecrets_UserRow_Id = string;
export type Lib_CredentialKey_RemoveLockedSecrets_UserRow_Username = string;
export type Lib_CredentialKey_RemoveLockedSecrets_UserRow = {
  id: Lib_CredentialKey_RemoveLockedSecrets_UserRow_Id;
  username: Lib_CredentialKey_RemoveLockedSecrets_UserRow_Username;
};
export type Lib_CredentialKey_RemoveLockedSecrets_UserResult = QueryResult<Lib_CredentialKey_RemoveLockedSecrets_UserRow>;
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureDefinition = Shared_FeatureDefinition | undefined;
export type Lib_CredentialKey_RemoveLockedSecrets_FeatureName = string;
export type Lib_CredentialKey_RemoveLockedSecrets_HadSecrets = boolean;
export type Lib_CredentialKey_RemoveLockedSecrets_NotificationRow = {
  id: string;
  missing_secrets: string[];
  name: string;
  secret_fields: string[];
};
export type Lib_CredentialKey_RemoveLockedSecrets_NotificationResult = QueryResult<Lib_CredentialKey_RemoveLockedSecrets_NotificationRow>;
export type Lib_CredentialKey_RemoveLockedSecrets_MissingSecrets = string[];

export type Lib_CredentialKey_VerifyCredentialKey_Pool = Pool;
export type Lib_CredentialKey_VerifyCredentialKey_CredentialKey = Buffer;
export type Lib_CredentialKey_VerifyCredentialKey_FilePath = string;
export type Lib_CredentialKey_VerifyCredentialKey_Returns = Promise<void>;
export type Lib_CredentialKey_VerifyCredentialKey_Mismatch = Error;
export type Lib_CredentialKey_VerifyCredentialKey_CheckRow_Ciphertext = string;
export type Lib_CredentialKey_VerifyCredentialKey_CheckRow = {
  ciphertext: Lib_CredentialKey_VerifyCredentialKey_CheckRow_Ciphertext;
};
export type Lib_CredentialKey_VerifyCredentialKey_CheckResult = QueryResult<Lib_CredentialKey_VerifyCredentialKey_CheckRow>;
export type Lib_CredentialKey_VerifyCredentialKey_CheckRowResult = Lib_CredentialKey_VerifyCredentialKey_CheckRow | undefined;
export type Lib_CredentialKey_VerifyCredentialKey_Sample = Lib_CredentialKey_FindSealedSample_Sample | undefined;

export type Lib_CredentialKey_Test_Count = Record<string, unknown>[];
export type Lib_CredentialKey_Test_Directory = string;
export type Lib_CredentialKey_Test_GetTestDatabase_Returns = Tests_Support_Database_TestDatabase;
export type Lib_CredentialKey_Test_Key = Buffer;
export type Lib_CredentialKey_Test_KeyPath = string;
export type Lib_CredentialKey_Test_Mode = string;
export type Lib_CredentialKey_Test_Notification = Awaited<Lib_NotificationTargets_CreateNotificationTarget_Returns>;
export type Lib_CredentialKey_Test_Owner = Shared_AccessUser;
export type Lib_CredentialKey_Test_OwnerId = string;
export type Lib_CredentialKey_Test_Pool = Pool;
export type Lib_CredentialKey_Test_RemovedSecrets = string[];
export type Lib_CredentialKey_Test_RemovedSecretNotices = Shared_RemovedSecrets;
export type Lib_CredentialKey_Test_RemovedSecretKinds = string[];
export type Lib_CredentialKey_Test_TestDatabase = Tests_Support_Database_TestDatabase | undefined;
