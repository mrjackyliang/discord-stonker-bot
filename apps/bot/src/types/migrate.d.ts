import type {
  Pool,
  PoolClient,
  QueryResult,
} from 'pg';

import type { Shared_RuntimeConfiguration } from './shared.d.ts';

export type Migrate_ApplyMigration_Checksum = string;
export type Migrate_ApplyMigration_Client = PoolClient;
export type Migrate_ApplyMigration_Contents = string;
export type Migrate_ApplyMigration_ExistingResult = QueryResult<Migrate_ApplyMigration_ExistingRow>;
export type Migrate_ApplyMigration_ExistingRow_Checksum = string;
export type Migrate_ApplyMigration_ExistingRow = {
  checksum: Migrate_ApplyMigration_ExistingRow_Checksum;
};
export type Migrate_ApplyMigration_ExistingRowResult = Migrate_ApplyMigration_ExistingRow | undefined;
export type Migrate_ApplyMigration_Name = string;
export type Migrate_ApplyMigration_Returns = Promise<void>;

export type Migrate_Main_Returns = Promise<void>;

export type Migrate_RunMigrations_Client = PoolClient;
export type Migrate_RunMigrations_Configuration = Shared_RuntimeConfiguration;
export type Migrate_RunMigrations_Contents = string;
export type Migrate_RunMigrations_FileNames = string[];
export type Migrate_RunMigrations_MigrationFileNames = string[];
export type Migrate_RunMigrations_MigrationPath = string;
export type Migrate_RunMigrations_MigrationsDirectory = string;
export type Migrate_RunMigrations_Pool = Pool;
export type Migrate_RunMigrations_RemovedSecrets = string[];
export type Migrate_RunMigrations_Returns = Promise<void>;
