import type {
  Pool,
  QueryResult,
} from 'pg';

import type {
  Shared_AccessUser,
  Shared_FeatureDefinition,
  Shared_RemovedSecret_Kind,
  Shared_RemovedSecrets,
} from '../shared.d.ts';

export type Lib_RemovedSecrets_DismissRemovedSecrets_Pool = Pool;
export type Lib_RemovedSecrets_DismissRemovedSecrets_User = Shared_AccessUser;
export type Lib_RemovedSecrets_DismissRemovedSecrets_Returns = Promise<void>;
export type Lib_RemovedSecrets_DismissRemovedSecrets_CanWrite = boolean;

export type Lib_RemovedSecrets_ListRemovedSecrets_Pool = Pool;
export type Lib_RemovedSecrets_ListRemovedSecrets_User = Shared_AccessUser;
export type Lib_RemovedSecrets_ListRemovedSecrets_Returns = Promise<Shared_RemovedSecrets>;
export type Lib_RemovedSecrets_ListRemovedSecrets_CanWrite = boolean;
export type Lib_RemovedSecrets_ListRemovedSecrets_Row = {
  feature_key: string | null;
  guild_id: string | null;
  kind: Shared_RemovedSecret_Kind;
  notification_id: string | null;
  notification_name: string | null;
  removed_at: Date;
  server_name: string | null;
};
export type Lib_RemovedSecrets_ListRemovedSecrets_Result = QueryResult<Lib_RemovedSecrets_ListRemovedSecrets_Row>;
export type Lib_RemovedSecrets_ListRemovedSecrets_FeatureKey = string;
export type Lib_RemovedSecrets_ListRemovedSecrets_FeatureDefinition = Shared_FeatureDefinition | undefined;
export type Lib_RemovedSecrets_ListRemovedSecrets_FeatureName = string;
