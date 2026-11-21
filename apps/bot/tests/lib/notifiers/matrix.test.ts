import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { Runner as MatrixNotifier } from '../../../src/lib/notifiers/matrix.js';
import { createPayload } from './fixtures.js';

vi.mock('node:crypto', () => ({ randomUUID: () => 'transaction-id' }));

/**
 * Matrix - Matrix Adapter.
 *
 * Locks Matrix validation, authentication, URL construction, and message body.
 * Changes here would alter a stored destination's delivery behavior.
 *
 * @since 4.2.1
 */
describe('Matrix adapter', () => {
  it('builds the exact request', () => {
    expect(new MatrixNotifier({
      secrets: { accessToken: 'matrix-token' },
      service: 'matrix',
      settings: {
        homeserverUrl: 'https://matrix.example.com/',
        roomId: '!alerts:example.com',
      },
    }).buildRequest(createPayload())).toEqual({
      body: JSON.stringify({
        body: [
          'Stonker Bot for Discord: Alert',
          'Message <&>.',
        ].join('\n'),
        msgtype: 'm.text',
      }),
      headers: {
        'Authorization': 'Bearer matrix-token',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      url: 'https://matrix.example.com/_matrix/client/v3/rooms/!alerts%3Aexample.com/send/m.room.message/transaction-id',
    });

    return;
  });

  it('validates homeservers and concrete room IDs', () => {
    expect(MatrixNotifier.validate('homeserverUrl', 'https://matrix.example.com')).toBe(true);

    expect(MatrixNotifier.validate('homeserverUrl', 'http://matrix.example.com')).toBe(false);

    expect(MatrixNotifier.validate('roomId', '!alerts:example.com')).toBe(true);

    expect(MatrixNotifier.validate('roomId', '#alerts:example.com')).toBe(false);

    return;
  });

  return;
});
