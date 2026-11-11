import type { LookupAddress } from 'node:dns';
import type {
  IncomingHttpHeaders,
  IncomingMessage,
} from 'node:http';
import type { BlockList } from 'node:net';

import type {
  ValidationError,
  XMLParser,
} from 'fast-xml-parser';
import type { Pool } from 'pg';

import type {
  Shared_Job,
  Shared_JsonObject,
} from '../shared.d.ts';
import type { Lib_Database_GetRssFeedCursor_Cursor } from './database.d.ts';
import type {
  Lib_WorkerFeatures_RssFetchJobPayload,
  Lib_WorkerFeatures_ScheduledJob,
} from './worker-features.d.ts';

export type Lib_RssWorker_BlockedAddressRanges = BlockList;
export type Lib_RssWorker_FeedByteLimit = number;
export type Lib_RssWorker_FeedItem_Identifier = string;
export type Lib_RssWorker_FeedItem_Link = string;
export type Lib_RssWorker_FeedItem_Title = string;
export type Lib_RssWorker_FeedItem = {
  identifier: Lib_RssWorker_FeedItem_Identifier;
  link: Lib_RssWorker_FeedItem_Link;
  title: Lib_RssWorker_FeedItem_Title;
};
export type Lib_RssWorker_FeedItemLimit = number;
export type Lib_RssWorker_FetchTimeoutMilliseconds = number;
export type Lib_RssWorker_HttpResult_Etag = string | undefined;
export type Lib_RssWorker_HttpResult_LastModified = string | undefined;
export type Lib_RssWorker_HttpResult_NotModified = {
  etag: Lib_RssWorker_HttpResult_Etag;
  lastModified: Lib_RssWorker_HttpResult_LastModified;
  notModified: true;
};
export type Lib_RssWorker_HttpResult_Content_Xml = string;
export type Lib_RssWorker_HttpResult_Content = {
  etag: Lib_RssWorker_HttpResult_Etag;
  lastModified: Lib_RssWorker_HttpResult_LastModified;
  notModified: false;
  xml: Lib_RssWorker_HttpResult_Content_Xml;
};
export type Lib_RssWorker_HttpResult = Lib_RssWorker_HttpResult_Content | Lib_RssWorker_HttpResult_NotModified;
export type Lib_RssWorker_RedirectLimit = number;
export type Lib_RssWorker_ResolvedTarget_Address = string;
export type Lib_RssWorker_ResolvedTarget_Family = number;
export type Lib_RssWorker_ResolvedTarget_Hostname = string;
export type Lib_RssWorker_ResolvedTarget_Url = URL;
export type Lib_RssWorker_ResolvedTarget = {
  address: Lib_RssWorker_ResolvedTarget_Address;
  family: Lib_RssWorker_ResolvedTarget_Family;
  hostname: Lib_RssWorker_ResolvedTarget_Hostname;
  url: Lib_RssWorker_ResolvedTarget_Url;
};
export type Lib_RssWorker_RssDeliveryLimit = number;
export type Lib_RssWorker_RssSeenItemLimit = number;

export type Lib_RssWorker_AssertPublicHttpsUrl_Value = string;
export type Lib_RssWorker_AssertPublicHttpsUrl_Returns = Promise<Lib_RssWorker_ResolvedTarget>;
export type Lib_RssWorker_AssertPublicHttpsUrl_Url = URL;
export type Lib_RssWorker_AssertPublicHttpsUrl_Hostname = string;
export type Lib_RssWorker_AssertPublicHttpsUrl_Addresses = LookupAddress[];
export type Lib_RssWorker_AssertPublicHttpsUrl_ResolvedAddress = LookupAddress | undefined;

export type Lib_RssWorker_BuildFeedHeaders_Payload = Lib_WorkerFeatures_RssFetchJobPayload;
export type Lib_RssWorker_BuildFeedHeaders_Cursor = Lib_Database_GetRssFeedCursor_Cursor | undefined;
export type Lib_RssWorker_BuildFeedHeaders_Returns = Record<string, string>;
export type Lib_RssWorker_BuildFeedHeaders_Headers = Record<string, string>;

export type Lib_RssWorker_CreateBlockedAddressRanges_Returns = BlockList;

export type Lib_RssWorker_CreateDeliveryJob_Payload = Lib_WorkerFeatures_RssFetchJobPayload;
export type Lib_RssWorker_CreateDeliveryJob_Item = Lib_RssWorker_FeedItem;
export type Lib_RssWorker_CreateDeliveryJob_Returns = Lib_WorkerFeatures_ScheduledJob;
export type Lib_RssWorker_CreateDeliveryJob_Content = string;
export type Lib_RssWorker_CreateDeliveryJob_JobPayload = Shared_JsonObject;

export type Lib_RssWorker_ExtractFeedItem_Entry = Record<string, unknown>;
export type Lib_RssWorker_ExtractFeedItem_RemoveParameters = boolean;
export type Lib_RssWorker_ExtractFeedItem_Returns = Lib_RssWorker_FeedItem | undefined;
export type Lib_RssWorker_ExtractFeedItem_Title = string | undefined;
export type Lib_RssWorker_ExtractFeedItem_Link = string | undefined;
export type Lib_RssWorker_ExtractFeedItem_NormalizedLink = string | undefined;
export type Lib_RssWorker_ExtractFeedItem_RawIdentifier = string;
export type Lib_RssWorker_ExtractFeedItem_Identifier = string;

export type Lib_RssWorker_ExtractItemLink_Entry = Record<string, unknown>;
export type Lib_RssWorker_ExtractItemLink_Returns = string | undefined;
export type Lib_RssWorker_ExtractItemLink_LinkValue = unknown;
export type Lib_RssWorker_ExtractItemLink_Links = unknown[];
export type Lib_RssWorker_ExtractItemLink_Fallback = string | undefined;
export type Lib_RssWorker_ExtractItemLink_LinkRecord = Record<string, unknown>;
export type Lib_RssWorker_ExtractItemLink_Href = string | undefined;
export type Lib_RssWorker_ExtractItemLink_Relation = string | undefined;

export type Lib_RssWorker_FetchFeed_Payload = Lib_WorkerFeatures_RssFetchJobPayload;
export type Lib_RssWorker_FetchFeed_Cursor = Lib_Database_GetRssFeedCursor_Cursor | undefined;
export type Lib_RssWorker_FetchFeed_Returns = Promise<Lib_RssWorker_HttpResult>;
export type Lib_RssWorker_FetchFeed_CurrentUrl = string;
export type Lib_RssWorker_FetchFeed_Headers = Record<string, string>;
export type Lib_RssWorker_FetchFeed_Url = URL;
export type Lib_RssWorker_FetchFeed_Response = IncomingMessage;
export type Lib_RssWorker_FetchFeed_StatusCode = number;
export type Lib_RssWorker_FetchFeed_Location = string | undefined;
export type Lib_RssWorker_FetchFeed_Etag = string | undefined;
export type Lib_RssWorker_FetchFeed_LastModified = string | undefined;
export type Lib_RssWorker_FetchFeed_ContentLengthHeader = string | undefined;
export type Lib_RssWorker_FetchFeed_ContentLength = number;
export type Lib_RssWorker_FetchFeed_ContentType = string;
export type Lib_RssWorker_FetchFeed_Xml = string;

export type Lib_RssWorker_FetchFeedResponse_Payload = Lib_WorkerFeatures_RssFetchJobPayload;
export type Lib_RssWorker_FetchFeedResponse_Cursor = Lib_Database_GetRssFeedCursor_Cursor | undefined;
export type Lib_RssWorker_FetchFeedResponse_CurrentUrl = string;
export type Lib_RssWorker_FetchFeedResponse_Headers = Record<string, string>;
export type Lib_RssWorker_FetchFeedResponse_RedirectCount = number;
export type Lib_RssWorker_FetchFeedResponse_Returns = Promise<Lib_RssWorker_HttpResult>;
export type Lib_RssWorker_FetchFeedResponse_Url = URL;
export type Lib_RssWorker_FetchFeedResponse_Response = IncomingMessage;
export type Lib_RssWorker_FetchFeedResponse_StatusCode = number;
export type Lib_RssWorker_FetchFeedResponse_Location = string | undefined;
export type Lib_RssWorker_FetchFeedResponse_Etag = string | undefined;
export type Lib_RssWorker_FetchFeedResponse_LastModified = string | undefined;
export type Lib_RssWorker_FetchFeedResponse_ResponseEtag = string | undefined;
export type Lib_RssWorker_FetchFeedResponse_ResponseLastModified = string | undefined;
export type Lib_RssWorker_FetchFeedResponse_ContentLengthHeader = string | undefined;
export type Lib_RssWorker_FetchFeedResponse_ContentLength = number;
export type Lib_RssWorker_FetchFeedResponse_ContentType = string;
export type Lib_RssWorker_FetchFeedResponse_Xml = string;

export type Lib_RssWorker_IsAllowedItemLink_Link = string;
export type Lib_RssWorker_IsAllowedItemLink_AllowedUrls = string[];
export type Lib_RssWorker_IsAllowedItemLink_Returns = boolean;
export type Lib_RssWorker_IsAllowedItemLink_LinkUrl = URL;
export type Lib_RssWorker_IsAllowedItemLink_AllowedUrl = URL;
export type Lib_RssWorker_IsAllowedItemLink_AllowedUrlPath = string;

export type Lib_RssWorker_IsFeedItem_Value = Lib_RssWorker_FeedItem | undefined;
export type Lib_RssWorker_IsFeedItem_TypeGuard = Lib_RssWorker_FeedItem;

export type Lib_RssWorker_IsPublicInternetAddress_Address = string;
export type Lib_RssWorker_IsPublicInternetAddress_Returns = boolean;
export type Lib_RssWorker_IsPublicInternetAddress_Version = number;
export type Lib_RssWorker_IsPublicInternetAddress_AddressType = 'ipv4' | 'ipv6';

export type Lib_RssWorker_IsRecord_Value = unknown;
export type Lib_RssWorker_IsRecord_TypeGuard = Record<string, unknown>;

export type Lib_RssWorker_IsRedirectStatus_Status = number;
export type Lib_RssWorker_IsRedirectStatus_Returns = boolean;

export type Lib_RssWorker_NormalizeHostname_Hostname = string;
export type Lib_RssWorker_NormalizeHostname_Returns = string;

export type Lib_RssWorker_NormalizeItemLink_Value = string;
export type Lib_RssWorker_NormalizeItemLink_RemoveParameters = boolean;
export type Lib_RssWorker_NormalizeItemLink_Returns = string | undefined;
export type Lib_RssWorker_NormalizeItemLink_Url = URL;

export type Lib_RssWorker_ParseFeedItems_Xml = string;
export type Lib_RssWorker_ParseFeedItems_RemoveParameters = boolean;
export type Lib_RssWorker_ParseFeedItems_Returns = Lib_RssWorker_FeedItem[];
export type Lib_RssWorker_ParseFeedItems_ValidationResult = true | ValidationError;
export type Lib_RssWorker_ParseFeedItems_Parser = XMLParser;
export type Lib_RssWorker_ParseFeedItems_Parsed = unknown;
export type Lib_RssWorker_ParseFeedItems_ParsedRecord = Record<string, unknown>;
export type Lib_RssWorker_ParseFeedItems_RawItems = unknown;
export type Lib_RssWorker_ParseFeedItems_Entries = unknown[];
export type Lib_RssWorker_ParseFeedItems_Items = Lib_RssWorker_FeedItem[];
export type Lib_RssWorker_ParseFeedItems_SeenIdentifiers = Set<string>;
export type Lib_RssWorker_ParseFeedItems_Item = Lib_RssWorker_FeedItem | undefined;

export type Lib_RssWorker_ProcessRssFetchJob_Job = Shared_Job;
export type Lib_RssWorker_ProcessRssFetchJob_Pool = Pool;
export type Lib_RssWorker_ProcessRssFetchJob_Returns = Promise<void>;
export type Lib_RssWorker_ProcessRssFetchJob_Payload = Lib_WorkerFeatures_RssFetchJobPayload;
export type Lib_RssWorker_ProcessRssFetchJob_Cursor = Lib_Database_GetRssFeedCursor_Cursor | undefined;
export type Lib_RssWorker_ProcessRssFetchJob_HttpResult = Lib_RssWorker_HttpResult;
export type Lib_RssWorker_ProcessRssFetchJob_Items = Lib_RssWorker_FeedItem[];
export type Lib_RssWorker_ProcessRssFetchJob_PreviousSeenItems = string[];
export type Lib_RssWorker_ProcessRssFetchJob_PreviousSeenSet = Set<string>;
export type Lib_RssWorker_ProcessRssFetchJob_SeenItems = string[];
export type Lib_RssWorker_ProcessRssFetchJob_CandidateItems = Lib_RssWorker_FeedItem[];
export type Lib_RssWorker_ProcessRssFetchJob_ResolvedItems = Lib_RssWorker_FeedItem[];
export type Lib_RssWorker_ProcessRssFetchJob_AllowedItems = Lib_RssWorker_FeedItem[];
export type Lib_RssWorker_ProcessRssFetchJob_Jobs = Lib_WorkerFeatures_ScheduledJob[];
export type Lib_RssWorker_ProcessRssFetchJob_EnqueuedCount = number;

export type Lib_RssWorker_ReadBoundedResponseBody_Response = IncomingMessage;
export type Lib_RssWorker_ReadBoundedResponseBody_Returns = Promise<string>;
export type Lib_RssWorker_ReadBoundedResponseBody_Chunks = Buffer[];
export type Lib_RssWorker_ReadBoundedResponseBody_TotalBytes = number;
export type Lib_RssWorker_ReadBoundedResponseBody_Chunk = Buffer;

export type Lib_RssWorker_ReadHeader_Headers = IncomingHttpHeaders;
export type Lib_RssWorker_ReadHeader_HeaderName = string;
export type Lib_RssWorker_ReadHeader_Returns = string | undefined;
export type Lib_RssWorker_ReadHeader_Value = string | string[] | undefined;

export type Lib_RssWorker_ReadText_Value = unknown;
export type Lib_RssWorker_ReadText_Returns = string | undefined;
export type Lib_RssWorker_ReadText_Record = Record<string, unknown>;

export type Lib_RssWorker_RequestUrl_Url = URL;
export type Lib_RssWorker_RequestUrl_Headers = Record<string, string>;
export type Lib_RssWorker_RequestUrl_Method = 'GET' | 'HEAD';
export type Lib_RssWorker_RequestUrl_Returns = Promise<IncomingMessage>;
export type Lib_RssWorker_RequestUrl_ResolvedTarget = Lib_RssWorker_ResolvedTarget;

export type Lib_RssWorker_ResolveCandidateItem_Item = Lib_RssWorker_FeedItem;
export type Lib_RssWorker_ResolveCandidateItem_Payload = Lib_WorkerFeatures_RssFetchJobPayload;
export type Lib_RssWorker_ResolveCandidateItem_Returns = Promise<Lib_RssWorker_FeedItem | undefined>;
export type Lib_RssWorker_ResolveCandidateItem_ResolvedLink = string;
export type Lib_RssWorker_ResolveCandidateItem_ErrorMessage = string;

export type Lib_RssWorker_ResolveItemRedirect_Value = string;
export type Lib_RssWorker_ResolveItemRedirect_Returns = Promise<string>;
export type Lib_RssWorker_ResolveItemRedirect_CurrentUrl = string;

export type Lib_RssWorker_ResolveItemRedirectHop_CurrentUrl = string;
export type Lib_RssWorker_ResolveItemRedirectHop_RedirectCount = number;
export type Lib_RssWorker_ResolveItemRedirectHop_Returns = Promise<string>;
export type Lib_RssWorker_ResolveItemRedirectHop_Url = URL;
export type Lib_RssWorker_ResolveItemRedirectHop_Response = IncomingMessage;
export type Lib_RssWorker_ResolveItemRedirectHop_StatusCode = number;
export type Lib_RssWorker_ResolveItemRedirectHop_Location = string | undefined;

export type Lib_RssWorker_ToArray_Value = unknown;
export type Lib_RssWorker_ToArray_Returns = unknown[];
