import type { Tests_Lib_Notifiers_Fixtures_CreatePayload_Returns } from '../../../src/types/tests/lib/notifiers/fixtures.d.ts';

/**
 * Fixtures - Create Payload.
 *
 * Builds one fixed high-priority payload for every service adapter test.
 * Stable content makes exact serialized request comparisons readable.
 *
 * @returns {Tests_Lib_Notifiers_Fixtures_CreatePayload_Returns}
 *
 * @since 4.2.1
 */
export function createPayload(): Tests_Lib_Notifiers_Fixtures_CreatePayload_Returns {
  return {
    notification: {
      details: {},
      event: 'test',
      message: 'Message <&>.',
      occurredAt: '2026-11-20T12:00:00.000Z',
      priority: 'high',
      tags: ['warning'],
      title: 'Alert',
    },
    title: 'Stonker Bot for Discord: Alert',
    webhook: {
      app: 'discord-stonker-bot',
      details: {},
      event: 'test',
      message: 'Message <&>.',
      occurredAt: '2026-11-20T12:00:00.000Z',
      priority: 4,
      tags: ['warning'],
      title: 'Alert',
      version: 1,
    },
  };
}
