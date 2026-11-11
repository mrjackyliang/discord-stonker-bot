import {
  readdir,
  readFile,
} from 'node:fs/promises';

import {
  PGlite,
  types,
} from '@electric-sql/pglite';
import { Pool } from 'pg';

import type {
  Tests_Support_Database_CreateMigratedTemplate_Database,
  Tests_Support_Database_CreateMigratedTemplate_FileNames,
  Tests_Support_Database_CreateMigratedTemplate_Image,
  Tests_Support_Database_CreateMigratedTemplate_MigrationsDirectory,
  Tests_Support_Database_CreateMigratedTemplate_Returns,
  Tests_Support_Database_CreateTestDatabase_Database,
  Tests_Support_Database_CreateTestDatabase_Pool,
  Tests_Support_Database_CreateTestDatabase_Returns,
  Tests_Support_Database_MigratedTemplate,
  Tests_Support_Database_ParseValue,
  Tests_Support_Database_Query_Database,
  Tests_Support_Database_Query_LastResult,
  Tests_Support_Database_Query_Result,
  Tests_Support_Database_Query_Results,
  Tests_Support_Database_Query_Returns,
  Tests_Support_Database_Query_Rows,
  Tests_Support_Database_Query_Text,
  Tests_Support_Database_Query_Values,
} from '../../types/tests/support/database.d.ts';

/**
 * Database - Migrated Template.
 *
 * Holds one migrated database image per test file, so each test copies it instead of migrating.
 * It is built the first time a test asks for a database.
 *
 * @since 4.0.0
 */
let migratedTemplate: Tests_Support_Database_MigratedTemplate = undefined;

/**
 * Database - Create Test Database.
 *
 * Starts an in-memory PostgreSQL (PGlite) with every migration applied and wraps it as a pg pool.
 * Values come back the way pg returns them: big integers and numerics as text, binary as Buffers.
 *
 * @returns {Tests_Support_Database_CreateTestDatabase_Returns}
 *
 * @since 4.0.0
 */
export async function createTestDatabase(): Tests_Support_Database_CreateTestDatabase_Returns {
  if (migratedTemplate === undefined) {
    migratedTemplate = createMigratedTemplate();
  }

  const database: Tests_Support_Database_CreateTestDatabase_Database = await PGlite.create({
    loadDataDir: await migratedTemplate,
    parsers: {
      [types.BYTEA]: (value: Tests_Support_Database_ParseValue) => Buffer.from(value.slice(2), 'hex'),
      [types.INT8]: (value: Tests_Support_Database_ParseValue) => value,
      [types.NUMERIC]: (value: Tests_Support_Database_ParseValue) => value,
    },
  });
  const pool: Tests_Support_Database_CreateTestDatabase_Pool = Object.assign(new Pool(), {
    connect: async () => {
      return {
        query: async (text: Tests_Support_Database_Query_Text, values?: Tests_Support_Database_Query_Values) => query(database, text, values),
        release: () => {
          return;
        },
      };
    },
    end: async () => {
      await database.close();

      return;
    },
    query: async (text: Tests_Support_Database_Query_Text, values?: Tests_Support_Database_Query_Values) => query(database, text, values),
  });

  return {
    database,
    pool,
  };
}

/**
 * Database - Create Migrated Template.
 *
 * Applies every migration to a scratch database and keeps an image of its data folder.
 * The scratch database is closed once the image exists.
 *
 * @returns {Tests_Support_Database_CreateMigratedTemplate_Returns}
 *
 * @since 4.0.0
 */
async function createMigratedTemplate(): Tests_Support_Database_CreateMigratedTemplate_Returns {
  const database: Tests_Support_Database_CreateMigratedTemplate_Database = await PGlite.create();
  const migrationsDirectory: Tests_Support_Database_CreateMigratedTemplate_MigrationsDirectory = new URL('../../../migrations/', import.meta.url);
  const fileNames: Tests_Support_Database_CreateMigratedTemplate_FileNames = (await readdir(migrationsDirectory))
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort();

  for (const fileName of fileNames) {
    await database.exec(await readFile(new URL(fileName, migrationsDirectory), 'utf8'));
  }

  const image: Tests_Support_Database_CreateMigratedTemplate_Image = await database.dumpDataDir('none');

  await database.close();

  return image;
}

/**
 * Database - Query.
 *
 * Runs one statement with parameters, or a whole script without them, like pg does.
 * The row count covers returned rows first, then affected rows.
 *
 * @param {Tests_Support_Database_Query_Database} database - Database.
 * @param {Tests_Support_Database_Query_Text}     text     - Text.
 * @param {Tests_Support_Database_Query_Values}   [values] - Values.
 *
 * @returns {Tests_Support_Database_Query_Returns}
 *
 * @since 4.0.0
 */
async function query(database: Tests_Support_Database_Query_Database, text: Tests_Support_Database_Query_Text, values?: Tests_Support_Database_Query_Values): Tests_Support_Database_Query_Returns {
  let result: Tests_Support_Database_Query_Result = undefined;

  if (values === undefined || values.length === 0) {
    const results: Tests_Support_Database_Query_Results = await database.exec(text);
    const lastResult: Tests_Support_Database_Query_LastResult = results.at(-1);

    result = lastResult;
  } else {
    result = await database.query(text, values);
  }

  const rows: Tests_Support_Database_Query_Rows = (result === undefined) ? [] : result.rows as Tests_Support_Database_Query_Rows;

  return {
    command: '',
    fields: [],
    oid: 0,
    rowCount: (rows.length > 0 || result === undefined) ? rows.length : (result.affectedRows ?? 0),
    rows,
  };
}
