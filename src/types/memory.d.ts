import { GuildEmoji, GuildMember } from 'discord.js';
import cron from 'node-cron';

import { TrackedMessages, TrackedRoutes } from './shared';

/**
 * Bulk ban.
 *
 * @since 1.0.0
 */
export type MemoryBulkBanVerifiedMember = GuildMember;

export type MemoryBulkBanVerifiedMembers = MemoryBulkBanVerifiedMember[];

/**
 * Detect suspicious words.
 *
 * @since 1.0.0
 */
export type MemoryDetectSuspiciousWordsDetectedCategory = string;

export type MemoryDetectSuspiciousWordsDetectedCategories = MemoryDetectSuspiciousWordsDetectedCategory[];

/**
 * Etherscan gas oracle.
 *
 * @since 1.0.0
 */
export type MemoryEtherscanGasOracleContentSlow = string;

export type MemoryEtherscanGasOracleContentAverage = string;

export type MemoryEtherscanGasOracleContentFast = string;

export type MemoryEtherscanGasOracleContent = {
  slow: MemoryEtherscanGasOracleContentSlow;
  average: MemoryEtherscanGasOracleContentAverage;
  fast: MemoryEtherscanGasOracleContentFast;
};

export type MemoryEtherscanGasOracle = MemoryEtherscanGasOracleContent | null;

/**
 * Fetch duplicates.
 *
 * @since 1.0.0
 */
export type MemoryFetchDuplicatesSortedMember = GuildMember;

export type MemoryFetchDuplicatesSortedMembers = {
  [avatar: string]: MemoryFetchDuplicatesSortedMember[];
};

/**
 * Fetch emojis.
 *
 * @since 1.0.0
 */
export type MemoryFetchEmojisMatchedEmoji = GuildEmoji;

export type MemoryFetchEmojisMatchedEmojis = MemoryFetchEmojisMatchedEmoji[];

/**
 * Fetch members.
 *
 * @since 1.0.0
 */
export type MemoryFetchMembersMatchedMember = GuildMember;

export type MemoryFetchMembersMatchedMembers = MemoryFetchMembersMatchedMember[];

/**
 * Finnhub earnings.
 *
 * @since 1.0.0
 */
export type MemoryFinnhubEarningsContentEarning = {
  date: string;
  symbol: string;
  fiscalQuarter: string,
  callTime: string | null;
  epsEstimate: string | null;
  epsActual: string | null;
  epsSurprise: string | null;
  revenueEstimate: string | null;
  revenueActual: string | null;
  revenueSurprise: string | null;
};

export type MemoryFinnhubEarningsContentEarnings = MemoryFinnhubEarningsContentEarning[];

export type MemoryFinnhubEarningsContent = {
  earnings: MemoryFinnhubEarningsContentEarnings;
};

export type MemoryFinnhubEarnings = MemoryFinnhubEarningsContent | null;

/**
 * Message copiers - Send to destinations.
 *
 * @since 1.0.0
 */
export type MemoryMessageCopiersSendToDestinationsRequestName = string | null;

export type MemoryMessageCopiersSendToDestinationsRequestDescription = string | null;

export type MemoryMessageCopiersSendToDestinationsRequestType = string | null;

export type MemoryMessageCopiersSendToDestinationsRequestContent = Buffer | null;

export type MemoryMessageCopiersSendToDestinationsRequest = {
  name: MemoryMessageCopiersSendToDestinationsRequestName;
  description: MemoryMessageCopiersSendToDestinationsRequestDescription;
  type: MemoryMessageCopiersSendToDestinationsRequestType;
  content: MemoryMessageCopiersSendToDestinationsRequestContent;
};

export type MemoryMessageCopiersSendToDestinationsRequests = Promise<MemoryMessageCopiersSendToDestinationsRequest>[];

export type MemoryMessageCopiersSendToDestinationsAttachmentName = string;

export type MemoryMessageCopiersSendToDestinationsAttachmentDescription = string | null;

export type MemoryMessageCopiersSendToDestinationsAttachmentType = string;

export type MemoryMessageCopiersSendToDestinationsAttachmentContent = Buffer;

export type MemoryMessageCopiersSendToDestinationsAttachment = {
  name: MemoryMessageCopiersSendToDestinationsAttachmentName;
  description: MemoryMessageCopiersSendToDestinationsAttachmentDescription;
  type: MemoryMessageCopiersSendToDestinationsAttachmentType;
  content: MemoryMessageCopiersSendToDestinationsAttachmentContent;
};

export type MemoryMessageCopiersSendToDestinationsAttachments = MemoryMessageCopiersSendToDestinationsAttachment[];

/**
 * Remove affiliates.
 *
 * @since 1.0.0
 */
export type MemoryRemoveAffiliatesDetectedAffiliate = string;

export type MemoryRemoveAffiliatesDetectedAffiliates = MemoryRemoveAffiliatesDetectedAffiliate[];

/**
 * Rss feeds.
 *
 * @since 1.0.0
 */
export type MemoryRssFeedsEventSentItem = string;

export type MemoryRssFeedsEventSentItems = MemoryRssFeedsEventSentItem[];

/**
 * Stocktwits trending.
 *
 * @since 1.0.0
 */
export type MemoryStocktwitsTrendingContentSymbol = string;

export type MemoryStocktwitsTrendingContentSymbols = MemoryStocktwitsTrendingContentSymbol[];

export type MemoryStocktwitsTrendingContent = {
  symbols: MemoryStocktwitsTrendingContentSymbols;
};

export type MemoryStocktwitsTrending = MemoryStocktwitsTrendingContent | null;

/**
 * Sync roles.
 *
 * @since 1.0.0
 */
export type MemorySyncRoles = {
  [memberId: string]: ReturnType<typeof setTimeout>;
};

/**
 * Toggle perms.
 *
 * @since 1.0.0
 */
export type MemoryTogglePermsSchedules = {
  [eventKey: number]: cron.ScheduledTask;
};

/**
 * Track message.
 *
 * @since 1.0.0
 */
export type MemoryTrackedMessages = TrackedMessages;

/**
 * Track route.
 *
 * @since 1.0.0
 */
export type MemoryTrackedRoutes = TrackedRoutes;

/**
 * Upload attachment.
 *
 * @since 1.0.0
 */
export type MemoryUploadAttachmentAttachmentLink = string;

export type MemoryUploadAttachmentAttachmentLinks = MemoryUploadAttachmentAttachmentLink[];
