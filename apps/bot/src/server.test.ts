import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  createClient,
  startHarness,
} from './tests/support/harness.js';

import type {
  Tests_Server_Client,
  Tests_Server_Harness,
  Tests_Server_Response,
} from './types/tests/server.test.d.ts';

/**
 * Server - Harness.
 *
 * Holds the running app for the current test.
 * Each test gets a fresh database.
 *
 * @since 4.0.0
 */
let harness: Tests_Server_Harness = undefined;

beforeEach(async () => {
  harness = await startHarness();

  return;
});

afterEach(async () => {
  if (harness !== undefined) {
    await harness.close();
  }

  harness = undefined;

  return;
});

/**
 * Server - Server Pipeline.
 *
 * Checks the shared middleware: probes, the error envelope, and the control panel fallback.
 * Feature areas test their own routes.
 *
 * @since 4.0.0
 */
describe('server pipeline', () => {
  it('answers probes, unknown API paths, and page paths', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const client: Tests_Server_Client = createClient(harness['baseUrl']);

    expect(await client.request('GET', '/health')).toEqual(expect.objectContaining({
      body: 'ok',
      status: 200,
    }));

    expect(await client.request('GET', '/ready')).toEqual(expect.objectContaining({
      body: 'ready',
      status: 200,
    }));

    expect(await client.request('GET', '/api/v1/unknown')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'not_found',
          message: 'No route matches this request.',
        },
      },
      status: 404,
    }));

    expect(await client.request('POST', '/api/v1/unknown', '{"broken":')).toEqual(expect.objectContaining({
      body: {
        error: {
          code: 'invalid_json',
          message: 'The request body is not valid JSON.',
        },
      },
      status: 400,
    }));

    expect(await client.request('POST', '/api/v1/unknown', {
      value: 'x'.repeat(70_000),
    })).toEqual(expect.objectContaining({
      status: 413,
    }));

    const page: Tests_Server_Response = await client.request('GET', '/features');

    expect(page['status']).toBe(200);

    expect(String(page['body'])).toContain('<title>Stonker Bot for Discord</title>');

    expect(page['headers'].get('Content-Security-Policy')).toContain('frame-ancestors \'none\'');

    return;
  });

  it('serves the console shell for feature editor deep paths', async () => {
    if (harness === undefined) {
      throw new Error('The test server is not running.');
    }

    const client: Tests_Server_Client = createClient(harness['baseUrl']);
    const page: Tests_Server_Response = await client.request(
      'GET',
      '/features/web-applications/invite',
    );

    expect(page['status']).toBe(200);

    expect(String(page['body'])).toContain('<title>Stonker Bot for Discord</title>');

    expect(page['headers'].get('Cache-Control')).toBe('no-store');

    return;
  });

  return;
});
