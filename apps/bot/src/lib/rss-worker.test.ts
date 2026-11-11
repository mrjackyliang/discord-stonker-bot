import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  isPublicInternetAddress,
  parseFeedItems,
} from './rss-worker.js';

import type { Lib_RssWorker_ParseFeedItems_Returns } from '../types/lib/rss-worker.d.ts';

/**
 * Rss Worker - Safe Feed Processing.
 *
 * Verifies supported feed dialects, URL normalization, XML hardening, and
 * public-network classification without performing live provider requests.
 *
 * @since 4.0.0
 */
describe('safe feed processing', () => {
  it('normalizes Rss items and removes tracking parameters', () => {
    const items: Lib_RssWorker_ParseFeedItems_Returns = parseFeedItems([
      '<?xml version="1.0"?>',
      '<rss version="2.0"><channel>',
      '<item><title>Patch Notes</title><link>https://example.com/news/patch-notes?utm_source=test#changes</link><guid>patch-1</guid></item>',
      '<item><title>Event Recap</title><link>https://example.com/news/event-recap</link><guid>recap-1</guid></item>',
      '</channel></rss>',
    ].join(''), true);

    expect(items).toHaveLength(2);

    expect(items[0]).toMatchObject({
      identifier: expect.any(String),
      link: 'https://example.com/news/patch-notes',
      title: 'Patch Notes',
    });

    return;
  });

  it('normalizes Atom alternate links while retaining query parameters', () => {
    const items: Lib_RssWorker_ParseFeedItems_Returns = parseFeedItems([
      '<?xml version="1.0"?>',
      '<feed xmlns="http://www.w3.org/2005/Atom">',
      '<entry><title>Server update</title><id>update-1</id>',
      '<link rel="self" href="https://example.com/feed.xml"/>',
      '<link rel="alternate" href="https://example.com/blog/server-update?lang=en#top"/>',
      '</entry></feed>',
    ].join(''), false);

    expect(items).toMatchObject([{
      link: 'https://example.com/blog/server-update?lang=en',
      title: 'Server update',
    }]);

    return;
  });

  it('rejects document types and non-public network destinations', () => {
    expect(() => parseFeedItems([
      '<!DOCTYPE rss [<!ENTITY secret SYSTEM "file:///etc/passwd">]>',
      '<rss><channel><item><title>&secret;</title>',
      '<link>https://example.com/item</link></item></channel></rss>',
    ].join(''), true)).toThrow('document type');

    expect(isPublicInternetAddress('127.0.0.1')).toBe(false);

    expect(isPublicInternetAddress('169.254.169.254')).toBe(false);

    expect(isPublicInternetAddress('::1')).toBe(false);

    expect(isPublicInternetAddress('2001:db8::1')).toBe(false);

    expect(isPublicInternetAddress('1.1.1.1')).toBe(true);

    expect(isPublicInternetAddress('2606:4700:4700::1111')).toBe(true);

    return;
  });

  return;
});
