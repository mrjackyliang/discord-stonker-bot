import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  parseDiscordMessageJob,
  parseDiscordPermissionJob,
  prepareWorkerFeatures,
} from './worker-features.js';
import { getScanInstants } from './worker-scheduler.js';

import type {
  Lib_WorkerFeatures_JobCollector_Returns,
  Lib_WorkerFeatures_PrepareWorkerFeatures_Returns,
} from '../types/lib/worker-features.d.ts';
import type { Lib_WorkerScheduler_GetScanInstants_Returns } from '../types/lib/worker-scheduler.d.ts';

/**
 * Worker Features - Worker Feature Preparation.
 *
 * Verifies time-zone matching, skip dates, deterministic deduplication, bounded
 * replay windows, and queue-payload validation without PostgreSQL or Discord.
 *
 * @since 4.0.0
 */
describe('worker feature preparation', () => {
  it('keeps durable scheduling disabled when the feature switch is off', () => {
    const prepared: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'schedule-posts': {
          configuration: [],
          enabled: false,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual([]);

    expect(prepared.collectJobs('1197999049190674442', [new Date('2026-10-23T13:30:00.000Z')])).toEqual([]);

    return;
  });

  it('creates one deterministic job at the configured local time', () => {
    const prepared: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'schedule-posts': {
          configuration: [{
            'channel': {
              'channel-id': '1197999049811439729',
            },
            'name': 'Friday check-in',
            'payload': {
              content: 'Happy Friday! Share your wins from %YEAR% so far.',
              footer: {
                text: 'Automated reminder',
              },
            },
            'reactions': ['👋'],
            'send-on': {
              'days-of-week': [5],
              'hours': [9],
              'minutes': [30],
              'seconds': [0],
              'time-zone': 'America/New_York',
            },
          }],
          enabled: true,
        },
      },
    });
    const jobs: Lib_WorkerFeatures_JobCollector_Returns = prepared.collectJobs(
      '1197999049190674442',
      [
        new Date('2026-10-23T13:30:00.000Z'),
        new Date('2026-10-23T13:30:01.000Z'),
      ],
    );

    expect(prepared['activeFeatureKeys']).toEqual(['schedule-posts']);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(jobs).toEqual([{
      dedupeKey: 'schedule-post:1197999049190674442:0:2026-10-23T13:30:00.000Z',
      payload: {
        channelIdentifier: '1197999049811439729',
        content: [
          'Happy Friday! Share your wins from 2026 so far.',
          'Automated reminder',
        ].join('\n'),
        guildIdentifier: '1197999049190674442',
        reactions: ['👋'],
        ruleName: 'Friday check-in',
      },
      type: 'discord.message.send',
    }]);

    return;
  });

  it('creates validated Rss polling jobs without accepting insecure sources', () => {
    const prepared: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'rss-feeds': {
          configuration: [{
            'allowed-urls': ['https://example.com/news/'],
            'channel': {
              'channel-id': '1197999049811439729',
            },
            'fetch-on': {
              'hours': [9],
              'minutes': [30],
              'time-zone': 'America/New_York',
            },
            'follow-redirects': true,
            'name': 'Community news',
            'payload': {
              content: [
                '**%ITEM_TITLE%**',
                '%ITEM_LINK%',
              ].join('\n'),
            },
            'remove-parameters': true,
            'url': 'https://example.com/community-news.xml',
            'user-agent': 'discord-stonker-bot/test',
          }],
          enabled: true,
        },
      },
    });
    const jobs: Lib_WorkerFeatures_JobCollector_Returns = prepared.collectJobs(
      '1197999049190674442',
      [new Date('2026-10-23T13:30:00.000Z')],
    );
    const invalid: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'rss-feeds': {
          configuration: [{
            'channel': {
              'channel-id': '1197999049811439729',
            },
            'fetch-on': {
              'time-zone': 'UTC',
            },
            'name': 'Insecure feed',
            'payload': {
              content: '%ITEM_LINK%',
            },
            'url': 'http://example.com/feed.xml',
          }],
          enabled: true,
        },
      },
    });

    expect(prepared['activeFeatureKeys']).toEqual(['rss-feeds']);

    expect(prepared['configurationErrors']).toEqual([]);

    expect(jobs).toMatchObject([{
      payload: {
        allowedUrls: ['https://example.com/news/'],
        channelIdentifier: '1197999049811439729',
        followRedirects: true,
        guildIdentifier: '1197999049190674442',
        messageTemplate: [
          '**%ITEM_TITLE%**',
          '%ITEM_LINK%',
        ].join('\n'),
        name: 'Community news',
        removeParameters: true,
        url: 'https://example.com/community-news.xml',
      },
      type: 'rss.feed.fetch',
    }]);

    expect(invalid['activeFeatureKeys']).toEqual([]);

    expect(invalid['configurationErrors'][0]).toContain('rss-feeds');

    return;
  });

  it('honors local skip dates and rejects unsupported time zones', () => {
    const skipped: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'schedule-posts': {
          configuration: [{
            'channel': {
              'channel-id': '1197999049811439729',
            },
            'name': 'Holiday closure',
            'payload': {
              content: 'This should not send.',
            },
            'send-on': {
              'hours': [9],
              'minutes': [30],
              'time-zone': 'America/New_York',
            },
            'skip-dates': ['2026-11-26'],
          }],
          enabled: true,
        },
      },
    });
    const invalid: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'schedule-posts': {
          configuration: [{
            'channel': {
              'channel-id': '1197999049811439729',
            },
            'name': 'Invalid zone',
            'payload': {
              content: 'Never queued.',
            },
            'send-on': {
              'time-zone': 'Mars/Olympus_Mons',
            },
          }],
          enabled: true,
        },
      },
    });

    expect(skipped.collectJobs('1197999049190674442', [new Date('2026-11-26T14:30:00.000Z')])).toEqual([]);

    expect(invalid['activeFeatureKeys']).toEqual([]);

    expect(invalid['configurationErrors'][0]).toContain('time-zone');

    return;
  });

  it('creates bounded idempotent permission jobs with explicit target types', () => {
    const prepared: Lib_WorkerFeatures_PrepareWorkerFeatures_Returns = prepareWorkerFeatures({
      features: {
        'toggle-perms': {
          configuration: [{
            'name': 'Open the lounge',
            'toggle-on': {
              'hours': [9],
              'minutes': [30],
              'time-zone': 'America/New_York',
            },
            'toggles': [{
              channel: {
                'channel-id': '1197999049811439729',
              },
              permissions: [{
                'target-type': 'role',
                'user-or-role-id': '1209383231867326487',
                'user-or-role-perms': {
                  SendMessages: true,
                  ViewChannel: true,
                },
              }],
            }],
          }],
          enabled: true,
        },
      },
    });
    const jobs: Lib_WorkerFeatures_JobCollector_Returns = prepared.collectJobs(
      '1197999049190674442',
      [new Date('2026-10-23T13:30:00.000Z')],
    );

    expect(prepared['activeFeatureKeys']).toEqual(['toggle-perms']);

    expect(jobs).toEqual([{
      dedupeKey: 'permission-set:1197999049190674442:0:2026-10-23T13:30:00.000Z',
      payload: {
        guildIdentifier: '1197999049190674442',
        name: 'Open the lounge',
        overwrites: [{
          allow: '3072',
          channelIdentifier: '1197999049811439729',
          deny: '0',
          targetIdentifier: '1209383231867326487',
          targetType: 'role',
        }],
      },
      type: 'discord.permissions.apply',
    }]);

    if (jobs[0] === undefined) {
      throw new Error('Expected a permission job.');
    }

    expect(parseDiscordPermissionJob(jobs[0]['payload'])).toMatchObject({
      name: 'Open the lounge',
    });

    return;
  });

  it('bounds scheduler replay and validates durable payloads', () => {
    const instants: Lib_WorkerScheduler_GetScanInstants_Returns = getScanInstants(
      new Date('2026-10-22T12:00:00.000Z'),
      new Date('2026-10-22T12:00:03.000Z'),
    );

    expect(instants.map((instant) => instant.toISOString())).toEqual([
      '2026-10-22T12:00:01.000Z',
      '2026-10-22T12:00:02.000Z',
      '2026-10-22T12:00:03.000Z',
    ]);

    expect(() => parseDiscordMessageJob({
      channelIdentifier: 'not-a-channel',
      content: 'Unsafe job',
      guildIdentifier: '1197999049190674442',
      reactions: [],
      ruleName: 'Bad job',
    })).toThrow();

    return;
  });

  return;
});
