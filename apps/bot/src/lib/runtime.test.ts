import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { readRuntimeConfiguration } from './runtime.js';

import type {
  Lib_Runtime_Test_Configuration,
  Lib_Runtime_Test_DatabaseUrl,
} from '../types/lib/runtime.d.ts';

/**
 * Runtime - Runtime Database Connection.
 *
 * Checks that every service connects to PostgreSQL over its Unix socket without a
 * password, and that the old POSTGRES_PASSWORD and POSTGRES_PORT values are ignored.
 *
 * @since 4.1.0
 */
describe('runtime database connection', () => {
  beforeEach(() => {
    vi.stubEnv('NOVA_INSTALLATION_KEY_FILE', undefined);
    vi.stubEnv('POSTGRES_DB', 'stonker');
    vi.stubEnv('POSTGRES_PASSWORD', undefined);
    vi.stubEnv('POSTGRES_PORT', undefined);
    vi.stubEnv('POSTGRES_RUNTIME_DIRECTORY', undefined);
    vi.stubEnv('POSTGRES_USER', 'stonker');

    return;
  });

  afterEach(() => {
    vi.unstubAllEnvs();

    return;
  });

  it('connects over the Unix socket without a password', () => {
    const configuration: Lib_Runtime_Test_Configuration = readRuntimeConfiguration();
    const databaseUrl: Lib_Runtime_Test_DatabaseUrl = new URL(configuration['database']['connectionString']);

    expect(databaseUrl.searchParams.get('host')).toBe('/tmp/postgresql');

    expect(databaseUrl.hostname).toBe('localhost');

    expect(databaseUrl.port).toBe('5432');

    expect(databaseUrl.username).toBe('stonker');

    expect(databaseUrl.password).toBe('');

    expect(databaseUrl.pathname).toBe('/stonker');

    return;
  });

  it('ignores POSTGRES_PASSWORD and POSTGRES_PORT from older setups', () => {
    vi.stubEnv('POSTGRES_PASSWORD', 'an-old-password-value');
    vi.stubEnv('POSTGRES_PORT', '6543');

    const configuration: Lib_Runtime_Test_Configuration = readRuntimeConfiguration();
    const databaseUrl: Lib_Runtime_Test_DatabaseUrl = new URL(configuration['database']['connectionString']);

    expect(databaseUrl.password).toBe('');

    expect(databaseUrl.port).toBe('5432');

    return;
  });

  it('follows POSTGRES_RUNTIME_DIRECTORY for the socket folder', () => {
    vi.stubEnv('POSTGRES_RUNTIME_DIRECTORY', '/tmp/postgresql');

    const configuration: Lib_Runtime_Test_Configuration = readRuntimeConfiguration();
    const databaseUrl: Lib_Runtime_Test_DatabaseUrl = new URL(configuration['database']['connectionString']);

    expect(databaseUrl.searchParams.get('host')).toBe('/tmp/postgresql');

    return;
  });

  it('keeps the installation key in the keys folder', () => {
    vi.stubEnv('NOVA_INSTALLATION_KEY_FILE', '/resolved-state/keys/installation.key');

    const configuration: Lib_Runtime_Test_Configuration = readRuntimeConfiguration();

    expect(configuration['bot']['credentialKeyFile']).toBe('/resolved-state/keys/installation.key');

    return;
  });

  return;
});

/**
 * Runtime - Runtime Control Panel Port.
 *
 * Checks that the control panel always listens on every address on 22604 and
 * that WEB_HOST and WEB_PORT values from older setups are ignored.
 *
 * @since 4.1.0
 */
describe('runtime control panel port', () => {
  afterEach(() => {
    vi.unstubAllEnvs();

    return;
  });

  it('listens on 22604 even when WEB_PORT is set', () => {
    vi.stubEnv('WEB_PORT', '8080');

    const configuration: Lib_Runtime_Test_Configuration = readRuntimeConfiguration();

    expect(configuration['web']['port']).toBe(22604);

    return;
  });

  it('listens on every address even when WEB_HOST is set', () => {
    vi.stubEnv('WEB_HOST', '127.0.0.1');

    const configuration: Lib_Runtime_Test_Configuration = readRuntimeConfiguration();

    expect(configuration['web']['host']).toBeUndefined();

    return;
  });

  return;
});
