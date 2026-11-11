import type {
  PGlite,
  Results,
} from '@electric-sql/pglite';
import type {
  Pool,
  QueryResult,
} from 'pg';

export type Tests_Support_Database_TestDatabase = {
  database: PGlite;
  pool: Pool;
};

export type Tests_Support_Database_CreateTestDatabase_Returns = Promise<Tests_Support_Database_TestDatabase>;
export type Tests_Support_Database_CreateTestDatabase_Database = PGlite;
export type Tests_Support_Database_CreateTestDatabase_Pool = Pool;

export type Tests_Support_Database_Query_Database = PGlite;
export type Tests_Support_Database_Query_Text = string;
export type Tests_Support_Database_Query_Values = unknown[];
export type Tests_Support_Database_Query_Returns = Promise<QueryResult>;
export type Tests_Support_Database_Query_Result = Results | undefined;
export type Tests_Support_Database_Query_Results = Results[];
export type Tests_Support_Database_Query_LastResult = Results | undefined;
export type Tests_Support_Database_Query_Rows = Record<string, unknown>[];
export type Tests_Support_Database_ParseValue = string;
export type Tests_Support_Database_MigratedTemplate = Promise<Blob | File> | undefined;
export type Tests_Support_Database_CreateMigratedTemplate_Returns = Promise<Blob | File>;
export type Tests_Support_Database_CreateMigratedTemplate_Database = PGlite;
export type Tests_Support_Database_CreateMigratedTemplate_MigrationsDirectory = URL;
export type Tests_Support_Database_CreateMigratedTemplate_FileNames = string[];
export type Tests_Support_Database_CreateMigratedTemplate_Image = Blob | File;
