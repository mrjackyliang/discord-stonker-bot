import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';
import type { ZodType } from 'zod';

import type { Tests_Support_Database_TestDatabase } from '../tests/support/database.d.ts';
import type {
  Lib_Notifications_Service,
  Lib_Notifications_Target,
  Lib_Notifications_Values,
} from './notifications.d.ts';

export type Lib_NotificationTargets_Target = {
  createdAt: string;
  events: string[];
  id: string;
  lastAttemptAt: string | null;
  lastError: string | null;
  name: string;
  secrets: Record<string, true>;
  secretsMissing: string[];
  service: Lib_Notifications_Service;
  settings: Lib_Notifications_Values;
  updatedAt: string;
};
export type Lib_NotificationTargets_TargetInput = {
  events: string[];
  name: string;
  secrets: Lib_Notifications_Values;
  service: Lib_Notifications_Service;
  settings: Lib_Notifications_Values;
};
export type Lib_NotificationTargets_TargetUpdate = {
  clearSecrets: string[];
  events: string[];
  name: string;
  secrets: Lib_Notifications_Values;
  settings: Lib_Notifications_Values;
};
export type Lib_NotificationTargets_Delivery = {
  name: string;
  target: Lib_Notifications_Target;
};
export type Lib_NotificationTargets_TargetQueryRow = {
  created_at: Date;
  events: unknown;
  id: string;
  last_attempt_at: Date | null;
  last_error: string | null;
  missing_secrets: unknown;
  name: string;
  secret_fields: unknown;
  secrets_ciphertext: string | null;
  service: string;
  settings: unknown;
  updated_at: Date;
};
export type Lib_NotificationTargets_TargetIdQueryRow = {
  id: string;
};
export type Lib_NotificationTargets_TargetNameQueryRow = {
  name: string;
};
export type Lib_NotificationTargets_TargetColumns = string;
export type Lib_NotificationTargets_TargetIdCharacters = string;
export type Lib_NotificationTargets_StoredKeys = ZodType<string[]>;
export type Lib_NotificationTargets_StoredValues = ZodType<Lib_Notifications_Values>;

export type Lib_NotificationTargets_CreateNotificationTarget_Pool = Pool;
export type Lib_NotificationTargets_CreateNotificationTarget_CredentialKey = Buffer;
export type Lib_NotificationTargets_CreateNotificationTarget_Input = Lib_NotificationTargets_TargetInput;
export type Lib_NotificationTargets_CreateNotificationTarget_Returns = Promise<Lib_NotificationTargets_Target | 'name-taken'>;
export type Lib_NotificationTargets_CreateNotificationTarget_Taken = QueryResult;
export type Lib_NotificationTargets_CreateNotificationTarget_Id = string;
export type Lib_NotificationTargets_CreateNotificationTarget_Result = QueryResult<Lib_NotificationTargets_TargetQueryRow>;
export type Lib_NotificationTargets_CreateNotificationTarget_Row = Lib_NotificationTargets_TargetQueryRow | undefined;

export type Lib_NotificationTargets_GetNotificationTarget_Pool = Pool;
export type Lib_NotificationTargets_GetNotificationTarget_TargetId = string;
export type Lib_NotificationTargets_GetNotificationTarget_Returns = Promise<Lib_NotificationTargets_Target | undefined>;
export type Lib_NotificationTargets_GetNotificationTarget_Result = QueryResult<Lib_NotificationTargets_TargetQueryRow>;
export type Lib_NotificationTargets_GetNotificationTarget_Row = Lib_NotificationTargets_TargetQueryRow | undefined;

export type Lib_NotificationTargets_IsNotificationTargetId_Value = unknown;
export type Lib_NotificationTargets_IsNotificationTargetId_Returns = boolean;

export type Lib_NotificationTargets_ListNotificationTargetIds_Pool = Pool;
export type Lib_NotificationTargets_ListNotificationTargetIds_Event = string;
export type Lib_NotificationTargets_ListNotificationTargetIds_Returns = Promise<string[]>;
export type Lib_NotificationTargets_ListNotificationTargetIds_Result = QueryResult<Lib_NotificationTargets_TargetIdQueryRow>;

export type Lib_NotificationTargets_ListNotificationTargets_Pool = Pool;
export type Lib_NotificationTargets_ListNotificationTargets_Returns = Promise<Lib_NotificationTargets_Target[]>;
export type Lib_NotificationTargets_ListNotificationTargets_Result = QueryResult<Lib_NotificationTargets_TargetQueryRow>;

export type Lib_NotificationTargets_OpenNotificationTarget_Pool = Pool;
export type Lib_NotificationTargets_OpenNotificationTarget_CredentialKey = Buffer;
export type Lib_NotificationTargets_OpenNotificationTarget_TargetId = string;
export type Lib_NotificationTargets_OpenNotificationTarget_Returns = Promise<Lib_NotificationTargets_Delivery | 'not-found' | 'secrets-missing'>;
export type Lib_NotificationTargets_OpenNotificationTarget_Result = QueryResult<Lib_NotificationTargets_TargetQueryRow>;
export type Lib_NotificationTargets_OpenNotificationTarget_Row = Lib_NotificationTargets_TargetQueryRow | undefined;

export type Lib_NotificationTargets_OpenSecrets_Row = Lib_NotificationTargets_TargetQueryRow;
export type Lib_NotificationTargets_OpenSecrets_CredentialKey = Buffer;
export type Lib_NotificationTargets_OpenSecrets_Returns = Lib_Notifications_Values;

export type Lib_NotificationTargets_RecordNotificationAttempt_Pool = Pool;
export type Lib_NotificationTargets_RecordNotificationAttempt_TargetId = string;
export type Lib_NotificationTargets_RecordNotificationAttempt_ErrorMessage = string | null;
export type Lib_NotificationTargets_RecordNotificationAttempt_Returns = Promise<void>;

export type Lib_NotificationTargets_RemoveNotificationTarget_Pool = Pool;
export type Lib_NotificationTargets_RemoveNotificationTarget_TargetId = string;
export type Lib_NotificationTargets_RemoveNotificationTarget_Returns = Promise<string | undefined>;
export type Lib_NotificationTargets_RemoveNotificationTarget_Result = QueryResult<Lib_NotificationTargets_TargetNameQueryRow>;
export type Lib_NotificationTargets_RemoveNotificationTarget_Row = Lib_NotificationTargets_TargetNameQueryRow | undefined;

export type Lib_NotificationTargets_SealSecrets_TargetId = string;
export type Lib_NotificationTargets_SealSecrets_Secrets = Lib_Notifications_Values;
export type Lib_NotificationTargets_SealSecrets_CredentialKey = Buffer;
export type Lib_NotificationTargets_SealSecrets_Returns = string | null;

export type Lib_NotificationTargets_TargetFromRow_Row = Lib_NotificationTargets_TargetQueryRow;
export type Lib_NotificationTargets_TargetFromRow_Returns = Lib_NotificationTargets_Target;
export type Lib_NotificationTargets_TargetFromRow_SecretFields = string[];

export type Lib_NotificationTargets_UpdateNotificationTarget_Pool = Pool;
export type Lib_NotificationTargets_UpdateNotificationTarget_CredentialKey = Buffer;
export type Lib_NotificationTargets_UpdateNotificationTarget_TargetId = string;
export type Lib_NotificationTargets_UpdateNotificationTarget_Input = Lib_NotificationTargets_TargetUpdate;
export type Lib_NotificationTargets_UpdateNotificationTarget_Returns = Promise<Lib_NotificationTargets_Target | 'name-taken' | 'not-found'>;
export type Lib_NotificationTargets_UpdateNotificationTarget_Existing = QueryResult<Lib_NotificationTargets_TargetQueryRow>;
export type Lib_NotificationTargets_UpdateNotificationTarget_ExistingRow = Lib_NotificationTargets_TargetQueryRow | undefined;
export type Lib_NotificationTargets_UpdateNotificationTarget_Taken = QueryResult;
export type Lib_NotificationTargets_UpdateNotificationTarget_Secrets = Lib_Notifications_Values;
export type Lib_NotificationTargets_UpdateNotificationTarget_MissingSecrets = string[];
export type Lib_NotificationTargets_UpdateNotificationTarget_Client = PoolClient;
export type Lib_NotificationTargets_UpdateNotificationTarget_Result = QueryResult<Lib_NotificationTargets_TargetQueryRow>;
export type Lib_NotificationTargets_UpdateNotificationTarget_Row = Lib_NotificationTargets_TargetQueryRow | undefined;

export type Lib_NotificationTargets_Test_Created = Awaited<Lib_NotificationTargets_CreateNotificationTarget_Returns>;
export type Lib_NotificationTargets_Test_GetTestDatabase_Returns = Tests_Support_Database_TestDatabase;
export type Lib_NotificationTargets_Test_Ids = string[];
export type Lib_NotificationTargets_Test_Key = Buffer;
export type Lib_NotificationTargets_Test_Pool = Pool;
export type Lib_NotificationTargets_Test_Rows = Record<string, unknown>[];
export type Lib_NotificationTargets_Test_Target = Lib_NotificationTargets_Target;
export type Lib_NotificationTargets_Test_TestDatabase = Tests_Support_Database_TestDatabase | undefined;
