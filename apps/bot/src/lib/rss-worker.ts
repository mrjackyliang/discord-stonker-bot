import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import { request as requestHttps } from 'node:https';
import {
  BlockList,
  isIP,
} from 'node:net';

import {
  XMLParser,
  XMLValidator,
} from 'fast-xml-parser';

import {
  enqueueRssItems,
  getRssFeedCursor,
} from './database.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import { parseRssFetchJob } from './worker-features.js';

import type {
  Lib_RssWorker_AssertPublicHttpsUrl_Addresses,
  Lib_RssWorker_AssertPublicHttpsUrl_Hostname,
  Lib_RssWorker_AssertPublicHttpsUrl_ResolvedAddress,
  Lib_RssWorker_AssertPublicHttpsUrl_Returns,
  Lib_RssWorker_AssertPublicHttpsUrl_Url,
  Lib_RssWorker_AssertPublicHttpsUrl_Value,
  Lib_RssWorker_BlockedAddressRanges,
  Lib_RssWorker_BuildFeedHeaders_Cursor,
  Lib_RssWorker_BuildFeedHeaders_Headers,
  Lib_RssWorker_BuildFeedHeaders_Payload,
  Lib_RssWorker_BuildFeedHeaders_Returns,
  Lib_RssWorker_CreateBlockedAddressRanges_Returns,
  Lib_RssWorker_CreateDeliveryJob_Content,
  Lib_RssWorker_CreateDeliveryJob_Item,
  Lib_RssWorker_CreateDeliveryJob_JobPayload,
  Lib_RssWorker_CreateDeliveryJob_Payload,
  Lib_RssWorker_CreateDeliveryJob_Returns,
  Lib_RssWorker_ExtractFeedItem_Entry,
  Lib_RssWorker_ExtractFeedItem_Identifier,
  Lib_RssWorker_ExtractFeedItem_Link,
  Lib_RssWorker_ExtractFeedItem_NormalizedLink,
  Lib_RssWorker_ExtractFeedItem_RawIdentifier,
  Lib_RssWorker_ExtractFeedItem_RemoveParameters,
  Lib_RssWorker_ExtractFeedItem_Returns,
  Lib_RssWorker_ExtractFeedItem_Title,
  Lib_RssWorker_ExtractItemLink_Entry,
  Lib_RssWorker_ExtractItemLink_Fallback,
  Lib_RssWorker_ExtractItemLink_Href,
  Lib_RssWorker_ExtractItemLink_LinkRecord,
  Lib_RssWorker_ExtractItemLink_Links,
  Lib_RssWorker_ExtractItemLink_LinkValue,
  Lib_RssWorker_ExtractItemLink_Relation,
  Lib_RssWorker_ExtractItemLink_Returns,
  Lib_RssWorker_FeedByteLimit,
  Lib_RssWorker_FeedItemLimit,
  Lib_RssWorker_FetchFeed_CurrentUrl,
  Lib_RssWorker_FetchFeed_Cursor,
  Lib_RssWorker_FetchFeed_Headers,
  Lib_RssWorker_FetchFeed_Payload,
  Lib_RssWorker_FetchFeed_Returns,
  Lib_RssWorker_FetchFeedResponse_ContentLength,
  Lib_RssWorker_FetchFeedResponse_ContentLengthHeader,
  Lib_RssWorker_FetchFeedResponse_ContentType,
  Lib_RssWorker_FetchFeedResponse_CurrentUrl,
  Lib_RssWorker_FetchFeedResponse_Cursor,
  Lib_RssWorker_FetchFeedResponse_Etag,
  Lib_RssWorker_FetchFeedResponse_Headers,
  Lib_RssWorker_FetchFeedResponse_LastModified,
  Lib_RssWorker_FetchFeedResponse_Location,
  Lib_RssWorker_FetchFeedResponse_Payload,
  Lib_RssWorker_FetchFeedResponse_RedirectCount,
  Lib_RssWorker_FetchFeedResponse_Response,
  Lib_RssWorker_FetchFeedResponse_ResponseEtag,
  Lib_RssWorker_FetchFeedResponse_ResponseLastModified,
  Lib_RssWorker_FetchFeedResponse_Returns,
  Lib_RssWorker_FetchFeedResponse_StatusCode,
  Lib_RssWorker_FetchFeedResponse_Url,
  Lib_RssWorker_FetchFeedResponse_Xml,
  Lib_RssWorker_FetchTimeoutMilliseconds,
  Lib_RssWorker_IsAllowedItemLink_AllowedUrl,
  Lib_RssWorker_IsAllowedItemLink_AllowedUrlPath,
  Lib_RssWorker_IsAllowedItemLink_AllowedUrls,
  Lib_RssWorker_IsAllowedItemLink_Link,
  Lib_RssWorker_IsAllowedItemLink_LinkUrl,
  Lib_RssWorker_IsAllowedItemLink_Returns,
  Lib_RssWorker_IsFeedItem_TypeGuard,
  Lib_RssWorker_IsFeedItem_Value,
  Lib_RssWorker_IsPublicInternetAddress_Address,
  Lib_RssWorker_IsPublicInternetAddress_AddressType,
  Lib_RssWorker_IsPublicInternetAddress_Returns,
  Lib_RssWorker_IsPublicInternetAddress_Version,
  Lib_RssWorker_IsRecord_TypeGuard,
  Lib_RssWorker_IsRecord_Value,
  Lib_RssWorker_IsRedirectStatus_Returns,
  Lib_RssWorker_IsRedirectStatus_Status,
  Lib_RssWorker_NormalizeHostname_Hostname,
  Lib_RssWorker_NormalizeHostname_Returns,
  Lib_RssWorker_NormalizeItemLink_RemoveParameters,
  Lib_RssWorker_NormalizeItemLink_Returns,
  Lib_RssWorker_NormalizeItemLink_Url,
  Lib_RssWorker_NormalizeItemLink_Value,
  Lib_RssWorker_ParseFeedItems_Entries,
  Lib_RssWorker_ParseFeedItems_Item,
  Lib_RssWorker_ParseFeedItems_Items,
  Lib_RssWorker_ParseFeedItems_Parsed,
  Lib_RssWorker_ParseFeedItems_ParsedRecord,
  Lib_RssWorker_ParseFeedItems_Parser,
  Lib_RssWorker_ParseFeedItems_RawItems,
  Lib_RssWorker_ParseFeedItems_RemoveParameters,
  Lib_RssWorker_ParseFeedItems_Returns,
  Lib_RssWorker_ParseFeedItems_SeenIdentifiers,
  Lib_RssWorker_ParseFeedItems_ValidationResult,
  Lib_RssWorker_ParseFeedItems_Xml,
  Lib_RssWorker_ProcessRssFetchJob_AllowedItems,
  Lib_RssWorker_ProcessRssFetchJob_CandidateItems,
  Lib_RssWorker_ProcessRssFetchJob_Cursor,
  Lib_RssWorker_ProcessRssFetchJob_EnqueuedCount,
  Lib_RssWorker_ProcessRssFetchJob_HttpResult,
  Lib_RssWorker_ProcessRssFetchJob_Items,
  Lib_RssWorker_ProcessRssFetchJob_Job,
  Lib_RssWorker_ProcessRssFetchJob_Jobs,
  Lib_RssWorker_ProcessRssFetchJob_Payload,
  Lib_RssWorker_ProcessRssFetchJob_Pool,
  Lib_RssWorker_ProcessRssFetchJob_PreviousSeenItems,
  Lib_RssWorker_ProcessRssFetchJob_PreviousSeenSet,
  Lib_RssWorker_ProcessRssFetchJob_ResolvedItems,
  Lib_RssWorker_ProcessRssFetchJob_Returns,
  Lib_RssWorker_ProcessRssFetchJob_SeenItems,
  Lib_RssWorker_ReadBoundedResponseBody_Chunk,
  Lib_RssWorker_ReadBoundedResponseBody_Chunks,
  Lib_RssWorker_ReadBoundedResponseBody_Response,
  Lib_RssWorker_ReadBoundedResponseBody_Returns,
  Lib_RssWorker_ReadBoundedResponseBody_TotalBytes,
  Lib_RssWorker_ReadHeader_HeaderName,
  Lib_RssWorker_ReadHeader_Headers,
  Lib_RssWorker_ReadHeader_Returns,
  Lib_RssWorker_ReadHeader_Value,
  Lib_RssWorker_ReadText_Record,
  Lib_RssWorker_ReadText_Returns,
  Lib_RssWorker_ReadText_Value,
  Lib_RssWorker_RedirectLimit,
  Lib_RssWorker_RequestUrl_Headers,
  Lib_RssWorker_RequestUrl_Method,
  Lib_RssWorker_RequestUrl_ResolvedTarget,
  Lib_RssWorker_RequestUrl_Returns,
  Lib_RssWorker_RequestUrl_Url,
  Lib_RssWorker_ResolveCandidateItem_ErrorMessage,
  Lib_RssWorker_ResolveCandidateItem_Item,
  Lib_RssWorker_ResolveCandidateItem_Payload,
  Lib_RssWorker_ResolveCandidateItem_ResolvedLink,
  Lib_RssWorker_ResolveCandidateItem_Returns,
  Lib_RssWorker_ResolveItemRedirect_CurrentUrl,
  Lib_RssWorker_ResolveItemRedirect_Returns,
  Lib_RssWorker_ResolveItemRedirect_Value,
  Lib_RssWorker_ResolveItemRedirectHop_CurrentUrl,
  Lib_RssWorker_ResolveItemRedirectHop_Location,
  Lib_RssWorker_ResolveItemRedirectHop_RedirectCount,
  Lib_RssWorker_ResolveItemRedirectHop_Response,
  Lib_RssWorker_ResolveItemRedirectHop_Returns,
  Lib_RssWorker_ResolveItemRedirectHop_StatusCode,
  Lib_RssWorker_ResolveItemRedirectHop_Url,
  Lib_RssWorker_RssDeliveryLimit,
  Lib_RssWorker_RssSeenItemLimit,
  Lib_RssWorker_ToArray_Returns,
  Lib_RssWorker_ToArray_Value,
} from '../types/lib/rss-worker.d.ts';

/**
 * Rss Worker - Blocked Address Ranges.
 *
 * Rejects non-public IPv4, IPv6, transition, and documentation networks before
 * an HTTPS socket is opened. Requests connect to the validated address itself.
 *
 * @since 4.0.0
 */
const blockedAddressRanges: Lib_RssWorker_BlockedAddressRanges = createBlockedAddressRanges();

/**
 * Rss Worker - Feed Byte Limit.
 *
 * Bounds an uncompressed response body to one mebibyte before XML parsing.
 * This protects the single worker process from oversized provider responses.
 *
 * @since 4.0.0
 */
const feedByteLimit: Lib_RssWorker_FeedByteLimit = 1_048_576;

/**
 * Rss Worker - Feed Item Limit.
 *
 * Bounds the number of XML entries normalized during each successful poll.
 * Current feed order is retained for predictable duplicate suppression.
 *
 * @since 4.0.0
 */
const feedItemLimit: Lib_RssWorker_FeedItemLimit = 100;

/**
 * Rss Worker - Fetch Timeout Milliseconds.
 *
 * Stops slow feed and redirect requests after a fixed ten-second boundary.
 * Durable retry policy remains owned by the existing PostgreSQL worker queue.
 *
 * @since 4.0.0
 */
const fetchTimeoutMilliseconds: Lib_RssWorker_FetchTimeoutMilliseconds = 10_000;

/**
 * Rss Worker - Redirect Limit.
 *
 * Bounds operator-enabled redirect traversal for feeds and item links.
 * Each destination is independently resolved and validated before connecting.
 *
 * @since 4.0.0
 */
const redirectLimit: Lib_RssWorker_RedirectLimit = 5;

/**
 * Rss Worker - Rss Delivery Limit.
 *
 * Prevents one busy feed from flooding a Discord channel during a single poll.
 * Older overflow entries are acknowledged rather than replayed indefinitely.
 *
 * @since 4.0.0
 */
const rssDeliveryLimit: Lib_RssWorker_RssDeliveryLimit = 20;

/**
 * Rss Worker - Rss Seen Item Limit.
 *
 * Retains a bounded rolling set of identifiers in PostgreSQL for restarts.
 * Feed-supplied identifiers are hashed before they reach persistent storage.
 *
 * @since 4.0.0
 */
const rssSeenItemLimit: Lib_RssWorker_RssSeenItemLimit = 500;

/**
 * Rss Worker - Assert Public HTTPS URL.
 *
 * Resolves every destination and rejects the entire response set when any
 * address is not publicly routable, closing common DNS rebinding paths.
 *
 * @param {Lib_RssWorker_AssertPublicHttpsUrl_Value} value - Value.
 *
 * @returns {Lib_RssWorker_AssertPublicHttpsUrl_Returns}
 *
 * @since 4.0.0
 */
async function assertPublicHttpsUrl(
  value: Lib_RssWorker_AssertPublicHttpsUrl_Value,
): Lib_RssWorker_AssertPublicHttpsUrl_Returns {
  const url: Lib_RssWorker_AssertPublicHttpsUrl_Url = new URL(value);

  if (
    url.protocol !== 'https:'
    || url.username.length > 0
    || url.password.length > 0
  ) {
    throw new Error('RSS destinations must use HTTPS without embedded credentials.');
  }

  const hostname: Lib_RssWorker_AssertPublicHttpsUrl_Hostname = normalizeHostname(url.hostname);
  const addresses: Lib_RssWorker_AssertPublicHttpsUrl_Addresses = (isIP(hostname) > 0) ? [{
    address: hostname,
    family: isIP(hostname),
  }] : await lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (
    addresses.length === 0
    || addresses.some((address) => isPublicInternetAddress(address['address']) === false) === true
  ) {
    throw new Error('RSS destination DNS resolved to a blocked network address.');
  }

  const resolvedAddress: Lib_RssWorker_AssertPublicHttpsUrl_ResolvedAddress = addresses[0];

  if (resolvedAddress === undefined) {
    throw new Error('RSS destination DNS returned no network address.');
  }

  return {
    address: resolvedAddress['address'],
    family: resolvedAddress['family'],
    hostname,
    url,
  };
}

/**
 * Rss Worker - Build Feed Headers.
 *
 * Adds stable provider identification and any durable cache validators.
 * Conditional polling lowers bandwidth without treating remote state as truth.
 *
 * @param {Lib_RssWorker_BuildFeedHeaders_Payload} payload - Payload.
 * @param {Lib_RssWorker_BuildFeedHeaders_Cursor}  cursor  - Cursor.
 *
 * @returns {Lib_RssWorker_BuildFeedHeaders_Returns}
 *
 * @since 4.0.0
 */
function buildFeedHeaders(
  payload: Lib_RssWorker_BuildFeedHeaders_Payload,
  cursor: Lib_RssWorker_BuildFeedHeaders_Cursor,
): Lib_RssWorker_BuildFeedHeaders_Returns {
  const headers: Lib_RssWorker_BuildFeedHeaders_Headers = {
    'Accept': 'application/atom+xml, application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.1',
    'User-Agent': payload['userAgent'],
  };

  if (cursor !== undefined && cursor['etag'] !== undefined) {
    Reflect.set(headers, 'If-None-Match', cursor['etag']);
  }

  if (cursor !== undefined && cursor['lastModified'] !== undefined) {
    Reflect.set(headers, 'If-Modified-Since', cursor['lastModified']);
  }

  return headers;
}

/**
 * Rss Worker - Create Blocked Address Ranges.
 *
 * Builds one reusable network policy for private, special-use, transition,
 * multicast, and documentation ranges across both supported IP families.
 *
 * @returns {Lib_RssWorker_CreateBlockedAddressRanges_Returns}
 *
 * @since 4.0.0
 */
function createBlockedAddressRanges(): Lib_RssWorker_CreateBlockedAddressRanges_Returns {
  const ranges: Lib_RssWorker_CreateBlockedAddressRanges_Returns = new BlockList();

  ranges.addSubnet('0.0.0.0', 8, 'ipv4');
  ranges.addSubnet('10.0.0.0', 8, 'ipv4');
  ranges.addSubnet('100.64.0.0', 10, 'ipv4');
  ranges.addSubnet('127.0.0.0', 8, 'ipv4');
  ranges.addSubnet('169.254.0.0', 16, 'ipv4');
  ranges.addSubnet('172.16.0.0', 12, 'ipv4');
  ranges.addSubnet('192.0.0.0', 24, 'ipv4');
  ranges.addSubnet('192.0.2.0', 24, 'ipv4');
  ranges.addSubnet('192.88.99.0', 24, 'ipv4');
  ranges.addSubnet('192.168.0.0', 16, 'ipv4');
  ranges.addSubnet('198.18.0.0', 15, 'ipv4');
  ranges.addSubnet('198.51.100.0', 24, 'ipv4');
  ranges.addSubnet('203.0.113.0', 24, 'ipv4');
  ranges.addSubnet('224.0.0.0', 4, 'ipv4');
  ranges.addSubnet('240.0.0.0', 4, 'ipv4');
  ranges.addSubnet('::', 128, 'ipv6');
  ranges.addSubnet('::1', 128, 'ipv6');
  ranges.addSubnet('64:ff9b::', 96, 'ipv6');
  ranges.addSubnet('64:ff9b:1::', 48, 'ipv6');
  ranges.addSubnet('2001::', 32, 'ipv6');
  ranges.addSubnet('2001:2::', 48, 'ipv6');
  ranges.addSubnet('2001:10::', 28, 'ipv6');
  ranges.addSubnet('2001:20::', 28, 'ipv6');
  ranges.addSubnet('2001:db8::', 32, 'ipv6');
  ranges.addSubnet('2002::', 16, 'ipv6');
  ranges.addSubnet('3fff::', 20, 'ipv6');
  ranges.addSubnet('fc00::', 7, 'ipv6');
  ranges.addSubnet('fe80::', 10, 'ipv6');
  ranges.addSubnet('fec0::', 10, 'ipv6');
  ranges.addSubnet('ff00::', 8, 'ipv6');

  return ranges;
}

/**
 * Rss Worker - Create Delivery Job.
 *
 * Expands only the two documented feed placeholders and disables reactions.
 * The shared Discord worker applies its existing mention-suppression boundary.
 *
 * @param {Lib_RssWorker_CreateDeliveryJob_Payload} payload - Payload.
 * @param {Lib_RssWorker_CreateDeliveryJob_Item}    item    - Item.
 *
 * @returns {Lib_RssWorker_CreateDeliveryJob_Returns}
 *
 * @since 4.0.0
 */
function createDeliveryJob(
  payload: Lib_RssWorker_CreateDeliveryJob_Payload,
  item: Lib_RssWorker_CreateDeliveryJob_Item,
): Lib_RssWorker_CreateDeliveryJob_Returns {
  const content: Lib_RssWorker_CreateDeliveryJob_Content = payload['messageTemplate']
    .replaceAll('%ITEM_LINK%', item['link'])
    .replaceAll('%ITEM_TITLE%', item['title'])
    .slice(0, 2_000);
  const jobPayload: Lib_RssWorker_CreateDeliveryJob_JobPayload = {
    channelIdentifier: payload['channelIdentifier'],
    content,
    guildIdentifier: payload['guildIdentifier'],
    reactions: [],
    ruleName: payload['name'],
  };

  return {
    dedupeKey: `rss-item:${payload['guildIdentifier']}:${payload['feedKey']}:${item['identifier']}`,
    payload: jobPayload,
    type: 'discord.message.send',
  };
}

/**
 * Rss Worker - Extract Feed Item.
 *
 * Normalizes RSS and Atom fields into one bounded delivery shape.
 * Identifiers are hashed so arbitrary provider strings never become queue keys.
 *
 * @param {Lib_RssWorker_ExtractFeedItem_Entry}            entry            - Entry.
 * @param {Lib_RssWorker_ExtractFeedItem_RemoveParameters} removeParameters - Remove parameters.
 *
 * @returns {Lib_RssWorker_ExtractFeedItem_Returns}
 *
 * @since 4.0.0
 */
function extractFeedItem(
  entry: Lib_RssWorker_ExtractFeedItem_Entry,
  removeParameters: Lib_RssWorker_ExtractFeedItem_RemoveParameters,
): Lib_RssWorker_ExtractFeedItem_Returns {
  const title: Lib_RssWorker_ExtractFeedItem_Title = readText(entry['title']);
  const link: Lib_RssWorker_ExtractFeedItem_Link = extractItemLink(entry);
  const normalizedLink: Lib_RssWorker_ExtractFeedItem_NormalizedLink = (link === undefined) ? undefined : normalizeItemLink(link, removeParameters);

  if (normalizedLink === undefined) {
    return undefined;
  }

  const rawIdentifier: Lib_RssWorker_ExtractFeedItem_RawIdentifier = readText(entry['guid'])
    ?? readText(entry['id'])
    ?? normalizedLink;
  const identifier: Lib_RssWorker_ExtractFeedItem_Identifier = createHash('sha256')
    .update(rawIdentifier)
    .digest('hex');

  return {
    identifier,
    link: normalizedLink,
    title: (title ?? 'New feed item').slice(0, 500),
  };
}

/**
 * Rss Worker - Extract Item Link.
 *
 * Supports RSS text links and Atom link attributes without evaluating markup.
 * Atom alternate links take precedence over other relationship types.
 *
 * @param {Lib_RssWorker_ExtractItemLink_Entry} entry - Entry.
 *
 * @returns {Lib_RssWorker_ExtractItemLink_Returns}
 *
 * @since 4.0.0
 */
function extractItemLink(
  entry: Lib_RssWorker_ExtractItemLink_Entry,
): Lib_RssWorker_ExtractItemLink_Returns {
  const linkValue: Lib_RssWorker_ExtractItemLink_LinkValue = entry['link'];

  if (typeof linkValue === 'string') {
    return linkValue.trim();
  }

  const links: Lib_RssWorker_ExtractItemLink_Links = toArray(linkValue);
  let fallback: Lib_RssWorker_ExtractItemLink_Fallback = undefined;

  for (const link of links) {
    if (isRecord(link) === false) {
      continue;
    }

    const linkRecord: Lib_RssWorker_ExtractItemLink_LinkRecord = link;
    const href: Lib_RssWorker_ExtractItemLink_Href = readText(linkRecord['@_href'])
      ?? readText(linkRecord['#text']);
    const relation: Lib_RssWorker_ExtractItemLink_Relation = readText(linkRecord['@_rel']);

    if (href === undefined) {
      continue;
    }

    if (relation === undefined || relation === 'alternate') {
      return href;
    }

    fallback ??= href;
  }

  return fallback;
}

/**
 * Rss Worker - Fetch Feed.
 *
 * Applies conditional validators, bounded redirects, content checks, and a
 * streaming body limit while keeping every outbound connection DNS-pinned.
 *
 * @param {Lib_RssWorker_FetchFeed_Payload} payload - Payload.
 * @param {Lib_RssWorker_FetchFeed_Cursor}  cursor  - Cursor.
 *
 * @returns {Lib_RssWorker_FetchFeed_Returns}
 *
 * @since 4.0.0
 */
function fetchFeed(
  payload: Lib_RssWorker_FetchFeed_Payload,
  cursor: Lib_RssWorker_FetchFeed_Cursor,
): Lib_RssWorker_FetchFeed_Returns {
  const currentUrl: Lib_RssWorker_FetchFeed_CurrentUrl = payload['url'];
  const headers: Lib_RssWorker_FetchFeed_Headers = buildFeedHeaders(payload, cursor);

  return fetchFeedResponse(payload, cursor, currentUrl, headers, 0);
}

/**
 * Rss Worker - Fetch Feed Response.
 *
 * Processes one HTTPS response and recursively validates an approved redirect.
 * Recursion makes the intentionally sequential redirect policy explicit.
 *
 * @param {Lib_RssWorker_FetchFeedResponse_Payload}       payload       - Payload.
 * @param {Lib_RssWorker_FetchFeedResponse_Cursor}        cursor        - Cursor.
 * @param {Lib_RssWorker_FetchFeedResponse_CurrentUrl}    currentUrl    - Current url.
 * @param {Lib_RssWorker_FetchFeedResponse_Headers}       headers       - Headers.
 * @param {Lib_RssWorker_FetchFeedResponse_RedirectCount} redirectCount - Redirect count.
 *
 * @returns {Lib_RssWorker_FetchFeedResponse_Returns}
 *
 * @since 4.0.0
 */
async function fetchFeedResponse(
  payload: Lib_RssWorker_FetchFeedResponse_Payload,
  cursor: Lib_RssWorker_FetchFeedResponse_Cursor,
  currentUrl: Lib_RssWorker_FetchFeedResponse_CurrentUrl,
  headers: Lib_RssWorker_FetchFeedResponse_Headers,
  redirectCount: Lib_RssWorker_FetchFeedResponse_RedirectCount,
): Lib_RssWorker_FetchFeedResponse_Returns {
  const url: Lib_RssWorker_FetchFeedResponse_Url = new URL(currentUrl);
  const response: Lib_RssWorker_FetchFeedResponse_Response = await requestUrl(url, headers, 'GET');
  const statusCode: Lib_RssWorker_FetchFeedResponse_StatusCode = response.statusCode ?? 0;

  if (isRedirectStatus(statusCode) === true) {
    const location: Lib_RssWorker_FetchFeedResponse_Location = readHeader(
      response.headers,
      'location',
    );

    response.resume();

    if (payload['followRedirects'] === false) {
      throw new Error('RSS feed redirected while redirect following is disabled.');
    }

    if (location === undefined || redirectCount === redirectLimit) {
      throw new Error('RSS feed exceeded the redirect policy.');
    }

    return fetchFeedResponse(
      payload,
      cursor,
      new URL(location, url).toString(),
      headers,
      redirectCount + 1,
    );
  }

  const etag: Lib_RssWorker_FetchFeedResponse_Etag = readHeader(response.headers, 'etag');
  const lastModified: Lib_RssWorker_FetchFeedResponse_LastModified = readHeader(
    response.headers,
    'last-modified',
  );

  if (statusCode === 304) {
    let responseEtag: Lib_RssWorker_FetchFeedResponse_ResponseEtag = (
      cursor === undefined
    ) ? undefined : cursor['etag'];
    let responseLastModified: Lib_RssWorker_FetchFeedResponse_ResponseLastModified = (
      cursor === undefined
    ) ? undefined : cursor['lastModified'];

    response.resume();

    if (etag !== undefined) {
      responseEtag = etag.slice(0, 1_024);
    }

    if (lastModified !== undefined) {
      responseLastModified = lastModified.slice(0, 256);
    }

    return {
      etag: responseEtag,
      lastModified: responseLastModified,
      notModified: true,
    };
  }

  if (statusCode !== 200) {
    response.resume();

    throw new Error(`RSS provider returned HTTP ${statusCode}.`);
  }

  const contentLengthHeader: Lib_RssWorker_FetchFeedResponse_ContentLengthHeader = readHeader(
    response.headers,
    'content-length',
  );
  const contentLength: Lib_RssWorker_FetchFeedResponse_ContentLength = (
    contentLengthHeader === undefined
  ) ? 0 : Number.parseInt(contentLengthHeader, 10);

  if (Number.isNaN(contentLength) === false && contentLength > feedByteLimit) {
    response.destroy();

    throw new Error('RSS response exceeded the one-mebibyte limit.');
  }

  const contentType: Lib_RssWorker_FetchFeedResponse_ContentType = (
    readHeader(response.headers, 'content-type') ?? ''
  ).toLowerCase();

  if (
    contentType.includes('text/html') === true
    || contentType.includes('application/xhtml+xml') === true
  ) {
    response.destroy();

    throw new Error('RSS provider returned HTML instead of a feed document.');
  }

  const xml: Lib_RssWorker_FetchFeedResponse_Xml = await readBoundedResponseBody(response);

  return {
    etag: (etag === undefined) ? undefined : etag.slice(0, 1_024),
    lastModified: (lastModified === undefined) ? undefined : lastModified.slice(0, 256),
    notModified: false,
    xml,
  };
}

/**
 * Rss Worker - Is Allowed Item Link.
 *
 * Compares exact origins and path-segment boundaries instead of unsafe string
 * prefixes. An empty allowlist preserves the legacy any-public-link behavior.
 *
 * @param {Lib_RssWorker_IsAllowedItemLink_Link}        link        - Link.
 * @param {Lib_RssWorker_IsAllowedItemLink_AllowedUrls} allowedUrls - Allowed urls.
 *
 * @returns {Lib_RssWorker_IsAllowedItemLink_Returns}
 *
 * @since 4.0.0
 */
function isAllowedItemLink(
  link: Lib_RssWorker_IsAllowedItemLink_Link,
  allowedUrls: Lib_RssWorker_IsAllowedItemLink_AllowedUrls,
): Lib_RssWorker_IsAllowedItemLink_Returns {
  if (allowedUrls.length === 0) {
    return true;
  }

  const linkUrl: Lib_RssWorker_IsAllowedItemLink_LinkUrl = new URL(link);

  return allowedUrls.some((allowedValue) => {
    const allowedUrl: Lib_RssWorker_IsAllowedItemLink_AllowedUrl = new URL(allowedValue);
    const allowedUrlPath: Lib_RssWorker_IsAllowedItemLink_AllowedUrlPath = (
      allowedUrl.pathname.endsWith('/') === true
    ) ? allowedUrl.pathname : `${allowedUrl.pathname}/`;

    return linkUrl.origin === allowedUrl.origin
      && (
        linkUrl.pathname === allowedUrl.pathname
        || linkUrl.pathname.startsWith(allowedUrlPath)
      );
  });
}

/**
 * Rss Worker - Is Feed Item.
 *
 * Narrows optional results after redirect failures are isolated per item.
 * This lets one unreachable article remain independent from other deliveries.
 *
 * @param {Lib_RssWorker_IsFeedItem_Value} value - Value.
 *
 * @returns {Lib_RssWorker_IsFeedItem_TypeGuard}
 *
 * @since 4.0.0
 */
function isFeedItem(
  value: Lib_RssWorker_IsFeedItem_Value,
): value is Lib_RssWorker_IsFeedItem_TypeGuard {
  return value !== undefined;
}

/**
 * Rss Worker - Is Public Internet Address.
 *
 * Classifies DNS results against special-use and non-routable address ranges.
 * Exported behavior is unit-tested without issuing any outbound requests.
 *
 * @param {Lib_RssWorker_IsPublicInternetAddress_Address} address - Address.
 *
 * @returns {Lib_RssWorker_IsPublicInternetAddress_Returns}
 *
 * @since 4.0.0
 */
export function isPublicInternetAddress(
  address: Lib_RssWorker_IsPublicInternetAddress_Address,
): Lib_RssWorker_IsPublicInternetAddress_Returns {
  const version: Lib_RssWorker_IsPublicInternetAddress_Version = isIP(address);

  if (version === 0) {
    return false;
  }

  const addressType: Lib_RssWorker_IsPublicInternetAddress_AddressType = (version === 4) ? 'ipv4' : 'ipv6';

  return blockedAddressRanges.check(address, addressType) === false;
}

/**
 * Rss Worker - Is Record.
 *
 * Narrows unknown XML nodes without trusting parser-produced object shapes.
 * Arrays and null remain outside the accepted record boundary.
 *
 * @param {Lib_RssWorker_IsRecord_Value} value - Value.
 *
 * @returns {Lib_RssWorker_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
function isRecord(
  value: Lib_RssWorker_IsRecord_Value,
): value is Lib_RssWorker_IsRecord_TypeGuard {
  return typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false;
}

/**
 * Rss Worker - Is Redirect Status.
 *
 * Restricts traversal to standard permanent and temporary HTTP redirects.
 * Other status codes remain provider failures or terminal item responses.
 *
 * @param {Lib_RssWorker_IsRedirectStatus_Status} status - Status.
 *
 * @returns {Lib_RssWorker_IsRedirectStatus_Returns}
 *
 * @since 4.0.0
 */
function isRedirectStatus(
  status: Lib_RssWorker_IsRedirectStatus_Status,
): Lib_RssWorker_IsRedirectStatus_Returns {
  return status === 301
    || status === 302
    || status === 303
    || status === 307
    || status === 308;
}

/**
 * Rss Worker - Normalize Hostname.
 *
 * Removes URL brackets from IPv6 literals before address classification.
 * Domain names and IPv4 literals pass through without transformation.
 *
 * @param {Lib_RssWorker_NormalizeHostname_Hostname} hostname - Hostname.
 *
 * @returns {Lib_RssWorker_NormalizeHostname_Returns}
 *
 * @since 4.0.0
 */
function normalizeHostname(
  hostname: Lib_RssWorker_NormalizeHostname_Hostname,
): Lib_RssWorker_NormalizeHostname_Returns {
  if (hostname.startsWith('[') === true && hostname.endsWith(']') === true) {
    return hostname.slice(1, -1);
  }

  return hostname;
}

/**
 * Rss Worker - Normalize Item Link.
 *
 * Accepts only credential-free HTTPS article URLs and strips fragments.
 * Operators may also remove tracking query parameters during migration.
 *
 * @param {Lib_RssWorker_NormalizeItemLink_Value}            value            - Value.
 * @param {Lib_RssWorker_NormalizeItemLink_RemoveParameters} removeParameters - Remove parameters.
 *
 * @returns {Lib_RssWorker_NormalizeItemLink_Returns}
 *
 * @since 4.0.0
 */
function normalizeItemLink(
  value: Lib_RssWorker_NormalizeItemLink_Value,
  removeParameters: Lib_RssWorker_NormalizeItemLink_RemoveParameters,
): Lib_RssWorker_NormalizeItemLink_Returns {
  try {
    const url: Lib_RssWorker_NormalizeItemLink_Url = new URL(value);

    if (
      url.protocol !== 'https:'
      || url.username.length > 0
      || url.password.length > 0
    ) {
      return undefined;
    }

    url.hash = '';

    if (removeParameters === true) {
      url.search = '';
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

/**
 * Rss Worker - Parse Feed Items.
 *
 * Validates and normalizes bounded RSS 2, Atom, and RDF feed documents.
 * Document type declarations and external entity processing are disabled.
 *
 * @param {Lib_RssWorker_ParseFeedItems_Xml}              xml              - Xml.
 * @param {Lib_RssWorker_ParseFeedItems_RemoveParameters} removeParameters - Remove parameters.
 *
 * @returns {Lib_RssWorker_ParseFeedItems_Returns}
 *
 * @since 4.0.0
 */
export function parseFeedItems(
  xml: Lib_RssWorker_ParseFeedItems_Xml,
  removeParameters: Lib_RssWorker_ParseFeedItems_RemoveParameters,
): Lib_RssWorker_ParseFeedItems_Returns {
  if (xml.toUpperCase().includes('<!DOCTYPE') === true) {
    throw new Error('RSS document type declarations are not accepted.');
  }

  const validationResult: Lib_RssWorker_ParseFeedItems_ValidationResult = XMLValidator.validate(xml);

  if (validationResult !== true) {
    throw new Error('RSS provider returned invalid XML.');
  }

  const parser: Lib_RssWorker_ParseFeedItems_Parser = new XMLParser({
    attributeNamePrefix: '@_',
    ignoreAttributes: false,
    maxNestedTags: 100,
    parseAttributeValue: false,
    parseTagValue: false,
    processEntities: false,
    removeNSPrefix: true,
    trimValues: true,
  });
  const parsed: Lib_RssWorker_ParseFeedItems_Parsed = parser.parse(xml);

  if (isRecord(parsed) === false) {
    throw new Error('RSS provider returned an unsupported feed document.');
  }

  const parsedRecord: Lib_RssWorker_ParseFeedItems_ParsedRecord = parsed;
  let rawItems: Lib_RssWorker_ParseFeedItems_RawItems = undefined;

  if (
    isRecord(parsedRecord['rss']) === true
    && isRecord(parsedRecord['rss']['channel']) === true
  ) {
    rawItems = parsedRecord['rss']['channel']['item'] ?? [];
  } else if (isRecord(parsedRecord['feed']) === true) {
    rawItems = parsedRecord['feed']['entry'] ?? [];
  } else if (isRecord(parsedRecord['RDF']) === true) {
    rawItems = parsedRecord['RDF']['item'] ?? [];
  } else {
    throw new Error('RSS provider returned an unsupported feed document.');
  }

  const entries: Lib_RssWorker_ParseFeedItems_Entries = toArray(rawItems).slice(0, feedItemLimit);
  const items: Lib_RssWorker_ParseFeedItems_Items = [];
  const seenIdentifiers: Lib_RssWorker_ParseFeedItems_SeenIdentifiers = new Set();

  for (const entry of entries) {
    if (isRecord(entry) === false) {
      continue;
    }

    const item: Lib_RssWorker_ParseFeedItems_Item = extractFeedItem(entry, removeParameters);

    if (item === undefined || seenIdentifiers.has(item['identifier']) === true) {
      continue;
    }

    seenIdentifiers.add(item['identifier']);

    items.push(item);
  }

  return items;
}

/**
 * Rss Worker - Process Rss Fetch Job.
 *
 * Baselines the first successful poll, queues only unseen allowed entries, and
 * atomically advances the feed cursor with the resulting delivery jobs.
 *
 * @param {Lib_RssWorker_ProcessRssFetchJob_Job}  job  - Job.
 * @param {Lib_RssWorker_ProcessRssFetchJob_Pool} pool - Pool.
 *
 * @returns {Lib_RssWorker_ProcessRssFetchJob_Returns}
 *
 * @since 4.0.0
 */
export async function processRssFetchJob(
  job: Lib_RssWorker_ProcessRssFetchJob_Job,
  pool: Lib_RssWorker_ProcessRssFetchJob_Pool,
): Lib_RssWorker_ProcessRssFetchJob_Returns {
  const payload: Lib_RssWorker_ProcessRssFetchJob_Payload = parseRssFetchJob(job['payload']);
  const cursor: Lib_RssWorker_ProcessRssFetchJob_Cursor = await getRssFeedCursor(
    pool,
    payload['guildIdentifier'],
    payload['feedKey'],
  );
  const httpResult: Lib_RssWorker_ProcessRssFetchJob_HttpResult = await fetchFeed(payload, cursor);

  if (httpResult['notModified'] === true) {
    writeLog('info', 'worker', 'rss_feed_not_modified', {
      feedKey: payload['feedKey'],
      guildIdentifier: payload['guildIdentifier'],
      name: payload['name'],
    });

    return;
  }

  const items: Lib_RssWorker_ProcessRssFetchJob_Items = parseFeedItems(
    httpResult['xml'],
    payload['removeParameters'],
  );
  const previousSeenItems: Lib_RssWorker_ProcessRssFetchJob_PreviousSeenItems = (
    cursor === undefined
  ) ? [] : cursor['seenItems'];
  const previousSeenSet: Lib_RssWorker_ProcessRssFetchJob_PreviousSeenSet = new Set(previousSeenItems);
  const seenItems: Lib_RssWorker_ProcessRssFetchJob_SeenItems = [...new Set([
    ...items.map((item) => item['identifier']),
    ...previousSeenItems,
  ])].slice(0, rssSeenItemLimit);

  if (cursor === undefined || cursor['initialized'] === false) {
    await enqueueRssItems(
      pool,
      payload['guildIdentifier'],
      payload['feedKey'],
      httpResult['etag'],
      httpResult['lastModified'],
      seenItems,
      true,
      [],
    );

    writeLog('info', 'worker', 'rss_feed_baselined', {
      feedKey: payload['feedKey'],
      guildIdentifier: payload['guildIdentifier'],
      itemCount: items.length,
      name: payload['name'],
    });

    return;
  }

  const candidateItems: Lib_RssWorker_ProcessRssFetchJob_CandidateItems = items
    .filter((item) => previousSeenSet.has(item['identifier']) === false)
    .slice(0, rssDeliveryLimit)
    .reverse();
  const resolvedItems: Lib_RssWorker_ProcessRssFetchJob_ResolvedItems = (
    await Promise.all(candidateItems.map((item) => resolveCandidateItem(item, payload)))
  ).filter(isFeedItem);
  const allowedItems: Lib_RssWorker_ProcessRssFetchJob_AllowedItems = resolvedItems.filter(
    (item) => isAllowedItemLink(item['link'], payload['allowedUrls']),
  );
  const jobs: Lib_RssWorker_ProcessRssFetchJob_Jobs = allowedItems.map(
    (item) => createDeliveryJob(payload, item),
  );
  const enqueuedCount: Lib_RssWorker_ProcessRssFetchJob_EnqueuedCount = await enqueueRssItems(
    pool,
    payload['guildIdentifier'],
    payload['feedKey'],
    httpResult['etag'],
    httpResult['lastModified'],
    seenItems,
    true,
    jobs,
  );

  writeLog('info', 'worker', 'rss_feed_processed', {
    discoveredCount: candidateItems.length,
    enqueuedCount,
    feedKey: payload['feedKey'],
    guildIdentifier: payload['guildIdentifier'],
    name: payload['name'],
  });

  return;
}

/**
 * Rss Worker - Read Bounded Response Body.
 *
 * Streams provider bytes while enforcing the limit independently of headers.
 * A lying or absent content-length value therefore cannot bypass the boundary.
 *
 * @param {Lib_RssWorker_ReadBoundedResponseBody_Response} response - Response.
 *
 * @returns {Lib_RssWorker_ReadBoundedResponseBody_Returns}
 *
 * @since 4.0.0
 */
async function readBoundedResponseBody(
  response: Lib_RssWorker_ReadBoundedResponseBody_Response,
): Lib_RssWorker_ReadBoundedResponseBody_Returns {
  const chunks: Lib_RssWorker_ReadBoundedResponseBody_Chunks = [];
  let totalBytes: Lib_RssWorker_ReadBoundedResponseBody_TotalBytes = 0;

  for await (const value of response) {
    const chunk: Lib_RssWorker_ReadBoundedResponseBody_Chunk = Buffer.from(value);

    totalBytes += chunk.length;

    if (totalBytes > feedByteLimit) {
      response.destroy();

      throw new Error('RSS response exceeded the one-mebibyte limit.');
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks, totalBytes).toString('utf8');
}

/**
 * Rss Worker - Read Header.
 *
 * Converts Node's string-or-array header representation into one bounded value.
 * Missing headers remain undefined for conditional request handling.
 *
 * @param {Lib_RssWorker_ReadHeader_Headers}    headers    - Headers.
 * @param {Lib_RssWorker_ReadHeader_HeaderName} headerName - Header name.
 *
 * @returns {Lib_RssWorker_ReadHeader_Returns}
 *
 * @since 4.0.0
 */
function readHeader(
  headers: Lib_RssWorker_ReadHeader_Headers,
  headerName: Lib_RssWorker_ReadHeader_HeaderName,
): Lib_RssWorker_ReadHeader_Returns {
  const value: Lib_RssWorker_ReadHeader_Value = headers[headerName];

  if (Array.isArray(value) === true) {
    return value[0];
  }

  return value;
}

/**
 * Rss Worker - Read Text.
 *
 * Reads plain parser values and text-node objects without coercing structures.
 * Empty or unsupported values stay absent from normalized feed entries.
 *
 * @param {Lib_RssWorker_ReadText_Value} value - Value.
 *
 * @returns {Lib_RssWorker_ReadText_Returns}
 *
 * @since 4.0.0
 */
function readText(
  value: Lib_RssWorker_ReadText_Value,
): Lib_RssWorker_ReadText_Returns {
  if (typeof value === 'string') {
    return (value.trim().length === 0) ? undefined : value.trim();
  }

  if (isRecord(value) === true) {
    const record: Lib_RssWorker_ReadText_Record = value;

    return readText(record['#text']);
  }

  return undefined;
}

/**
 * Rss Worker - Request URL.
 *
 * Opens HTTPS directly against one previously validated DNS result while using
 * the original hostname for TLS verification and the HTTP Host header.
 *
 * @param {Lib_RssWorker_RequestUrl_Url}     url     - Url.
 * @param {Lib_RssWorker_RequestUrl_Headers} headers - Headers.
 * @param {Lib_RssWorker_RequestUrl_Method}  method  - Method.
 *
 * @returns {Lib_RssWorker_RequestUrl_Returns}
 *
 * @since 4.0.0
 */
async function requestUrl(
  url: Lib_RssWorker_RequestUrl_Url,
  headers: Lib_RssWorker_RequestUrl_Headers,
  method: Lib_RssWorker_RequestUrl_Method,
): Lib_RssWorker_RequestUrl_Returns {
  const resolvedTarget: Lib_RssWorker_RequestUrl_ResolvedTarget = await assertPublicHttpsUrl(
    url.toString(),
  );

  return new Promise((resolve, reject) => {
    requestHttps({
      family: resolvedTarget['family'],
      headers: {
        ...headers,
        Host: url.host,
      },
      hostname: resolvedTarget['address'],
      method,
      path: `${url.pathname}${url.search}`,
      port: (url.port.length === 0) ? 443 : Number.parseInt(url.port, 10),
      servername: resolvedTarget['hostname'],
      signal: AbortSignal.timeout(fetchTimeoutMilliseconds),
    }, resolve).once('error', reject).end();

    return;
  });
}

/**
 * Rss Worker - Resolve Candidate Item.
 *
 * Resolves redirects only when requested and isolates link failures per entry.
 * Failed items are acknowledged but cannot block healthy entries in the feed.
 *
 * @param {Lib_RssWorker_ResolveCandidateItem_Item}    item    - Item.
 * @param {Lib_RssWorker_ResolveCandidateItem_Payload} payload - Payload.
 *
 * @returns {Lib_RssWorker_ResolveCandidateItem_Returns}
 *
 * @since 4.0.0
 */
async function resolveCandidateItem(
  item: Lib_RssWorker_ResolveCandidateItem_Item,
  payload: Lib_RssWorker_ResolveCandidateItem_Payload,
): Lib_RssWorker_ResolveCandidateItem_Returns {
  if (payload['followRedirects'] === false) {
    return item;
  }

  try {
    const resolvedLink: Lib_RssWorker_ResolveCandidateItem_ResolvedLink = await resolveItemRedirect(
      item['link'],
    );

    return {
      ...item,
      link: resolvedLink,
    };
  } catch (error) {
    const errorMessage: Lib_RssWorker_ResolveCandidateItem_ErrorMessage = getErrorMessage(error);

    writeLog('warn', 'worker', 'rss_item_redirect_failed', {
      error: errorMessage,
      feedKey: payload['feedKey'],
      guildIdentifier: payload['guildIdentifier'],
      itemIdentifier: item['identifier'],
    });

    return undefined;
  }
}

/**
 * Rss Worker - Resolve Item Redirect.
 *
 * Uses bounded HEAD requests to normalize legacy short links before allowlist
 * comparison. Every hop receives the same DNS and private-network protections.
 *
 * @param {Lib_RssWorker_ResolveItemRedirect_Value} value - Value.
 *
 * @returns {Lib_RssWorker_ResolveItemRedirect_Returns}
 *
 * @since 4.0.0
 */
async function resolveItemRedirect(
  value: Lib_RssWorker_ResolveItemRedirect_Value,
): Lib_RssWorker_ResolveItemRedirect_Returns {
  const currentUrl: Lib_RssWorker_ResolveItemRedirect_CurrentUrl = value;

  return resolveItemRedirectHop(currentUrl, 0);
}

/**
 * Rss Worker - Resolve Item Redirect Hop.
 *
 * Processes one item-link response before recursively following a safe hop.
 * Terminal responses preserve the current normalized HTTPS link.
 *
 * @param {Lib_RssWorker_ResolveItemRedirectHop_CurrentUrl}    currentUrl    - Current url.
 * @param {Lib_RssWorker_ResolveItemRedirectHop_RedirectCount} redirectCount - Redirect count.
 *
 * @returns {Lib_RssWorker_ResolveItemRedirectHop_Returns}
 *
 * @since 4.0.0
 */
async function resolveItemRedirectHop(
  currentUrl: Lib_RssWorker_ResolveItemRedirectHop_CurrentUrl,
  redirectCount: Lib_RssWorker_ResolveItemRedirectHop_RedirectCount,
): Lib_RssWorker_ResolveItemRedirectHop_Returns {
  const url: Lib_RssWorker_ResolveItemRedirectHop_Url = new URL(currentUrl);
  const response: Lib_RssWorker_ResolveItemRedirectHop_Response = await requestUrl(url, {}, 'HEAD');
  const statusCode: Lib_RssWorker_ResolveItemRedirectHop_StatusCode = response.statusCode ?? 0;

  response.resume();

  if (isRedirectStatus(statusCode) === false) {
    return currentUrl;
  }

  const location: Lib_RssWorker_ResolveItemRedirectHop_Location = readHeader(
    response.headers,
    'location',
  );

  if (location === undefined || redirectCount === redirectLimit) {
    throw new Error('RSS item exceeded the redirect policy.');
  }

  return resolveItemRedirectHop(
    new URL(location, url).toString(),
    redirectCount + 1,
  );
}

/**
 * Rss Worker - To Array.
 *
 * Normalizes XML parser singleton and repeated-element output into one shape.
 * Missing values become an empty collection rather than a synthetic item.
 *
 * @param {Lib_RssWorker_ToArray_Value} value - Value.
 *
 * @returns {Lib_RssWorker_ToArray_Returns}
 *
 * @since 4.0.0
 */
function toArray(
  value: Lib_RssWorker_ToArray_Value,
): Lib_RssWorker_ToArray_Returns {
  if (value === undefined) {
    return [];
  }

  return (Array.isArray(value) === true) ? value : [value];
}
