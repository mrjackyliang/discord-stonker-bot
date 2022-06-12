import {
  BufferResolvable,
  ChannelMention,
  Client,
  Collection,
  ColorResolvable,
  EmbedFieldData,
  EmojiIdentifierResolvable,
  Guild,
  GuildEmoji,
  GuildMember,
  GuildScheduledEvent,
  MemberMention,
  Message,
  MessageAttachment,
  MessageEmbed,
  MessageOptions,
  NewsChannel,
  PermissionOverwriteOptions,
  Role,
  RoleMention,
  Snowflake,
  StageChannel,
  TextBasedChannel,
  TextChannel,
  ThreadChannel,
  User,
  UserMention,
  VoiceChannel,
} from 'discord.js';
import { Express } from 'express';
import { TwitterApi } from 'twitter-api-v2';

import {
  ConfigChannel,
  ConfigGuild,
  ConfigRegex,
  ConfigReplacement,
  ConfigRole,
  ConfigThread,
  ConfigUser,
  CredentialLike,
  EmbedStatus,
  LogLevel,
  TimeZone,
  TrackedMessages,
} from './shared';
import {
  MemoryDetectSuspiciousWordsDetectedCategories,
  MemoryFinnhubEarningsContentEarnings,
  MemoryRemoveAffiliatesDetectedAffiliates,
  MemoryTrackedMessages,
  MemoryTrackedRoutes,
} from './memory';

/**
 * Add attachment fields.
 *
 * @since 1.0.0
 */
export type AddAttachmentFieldsMessageAttachments = MessageAttachment[];

export type AddAttachmentFieldsReturns = EmbedFieldData[];

/**
 * Add message fields.
 *
 * @since 1.0.0
 */
export type AddMessageFieldsTitle = string;

export type AddMessageFieldsMessageContent = string;

export type AddMessageFieldsReturns = EmbedFieldData[];

/**
 * Add time duration fields.
 *
 * @since 1.0.0
 */
export type AddTimeDurationFieldsAccountAge = Date;

export type AddTimeDurationFieldsTimeOfStay = Date;

export type AddTimeDurationFieldsReturns = EmbedFieldData[];

/**
 * Add user information fields.
 *
 * @since 1.0.0
 */
export type AddUserInformationFieldsUserTag = string;

export type AddUserInformationFieldsUserMention = UserMention;

export type AddUserInformationFieldsUserAvatar = string | null;

export type AddUserInformationFieldsReturns = EmbedFieldData[];

/**
 * Anti-raid auto ban.
 *
 * @since 1.0.0
 */
export type AntiRaidAutoBanMember = GuildMember;

export type AntiRaidAutoBanSettingsAvatarDescription = string | undefined;

export type AntiRaidAutoBanSettingsAvatarAvatar = string | undefined;

export type AntiRaidAutoBanSettingsAvatar = {
  description: AntiRaidAutoBanSettingsAvatarDescription;
  avatar: AntiRaidAutoBanSettingsAvatarAvatar;
} | undefined;

export type AntiRaidAutoBanSettingsAvatars = AntiRaidAutoBanSettingsAvatar[] | undefined;

export type AntiRaidAutoBanSettingsUsernameDescription = string | undefined;

export type AntiRaidAutoBanSettingsUsernameUsername = string | undefined;

export type AntiRaidAutoBanSettingsUsername = {
  description: AntiRaidAutoBanSettingsUsernameDescription;
  username: AntiRaidAutoBanSettingsUsernameUsername;
} | undefined;

export type AntiRaidAutoBanSettingsUsernames = AntiRaidAutoBanSettingsUsername[] | undefined;

export type AntiRaidAutoBanSettings = {
  avatars: AntiRaidAutoBanSettingsAvatars;
  usernames: AntiRaidAutoBanSettingsUsernames;
} | undefined;

export type AntiRaidAutoBanReturns = void;

/**
 * Anti-raid membership gate.
 *
 * @since 1.0.0
 */
export type AntiRaidMembershipGateOldMember = GuildMember;

export type AntiRaidMembershipGateNewMember = GuildMember;

export type AntiRaidMembershipGateGuild = Guild;

export type AntiRaidMembershipGateSettingsRoleRoleId = ConfigRole['role-id'] | undefined;

export type AntiRaidMembershipGateSettingsRole = ConfigRole | undefined;

export type AntiRaidMembershipGateSettingsRoles = AntiRaidMembershipGateSettingsRole[] | undefined;

export type AntiRaidMembershipGateSettingsPayload = MessageOptions | undefined;

export type AntiRaidMembershipGateSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type AntiRaidMembershipGateSettingsChannel = ConfigChannel | undefined;

export type AntiRaidMembershipGateSettings = {
  roles: AntiRaidMembershipGateSettingsRoles;
  payload: AntiRaidMembershipGateSettingsPayload;
  channel: AntiRaidMembershipGateSettingsChannel;
} | undefined;

export type AntiRaidMembershipGateReturns = void;

/**
 * Anti-raid membership gate - Replace variables.
 *
 * @since 1.0.0
 */
export type AntiRaidMembershipGateReplaceVariablesConfigPayload = MessageOptions;

export type AntiRaidMembershipGateReplaceVariablesReturns = MessageOptions;

/**
 * Auto replies.
 *
 * @since 1.0.0
 */
export type AutoRepliesMessage = Message;

export type AutoRepliesEventName = string | undefined;

export type AutoRepliesEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type AutoRepliesEventChannel = ConfigChannel | undefined;

export type AutoRepliesEventChannels = AutoRepliesEventChannel[] | undefined;

export type AutoRepliesEventRegexPattern = ConfigRegex['pattern'] | undefined;

export type AutoRepliesEventRegexFlags = ConfigRegex['flags'] | undefined;

export type AutoRepliesEventRegex = ConfigRegex | undefined;

export type AutoRepliesEventPayload = MessageOptions | undefined;

export type AutoRepliesEventPayloads = AutoRepliesEventPayload[] | undefined;

export type AutoRepliesEventReply = boolean | undefined;

export type AutoRepliesEvent = {
  name: AutoRepliesEventName;
  channels: AutoRepliesEventChannels;
  regex: AutoRepliesEventRegex;
  payloads: AutoRepliesEventPayloads;
  reply: AutoRepliesEventReply;
} | undefined;

export type AutoRepliesEvents = AutoRepliesEvent[] | undefined;

export type AutoRepliesReturns = void;

/**
 * Broadcast alerts.
 *
 * @since 1.0.0
 */
export type BroadcastAlertsInstance = {
  channel: StageChannel | VoiceChannel | null;
  creator: User | null;
  description: string | null;
  entityType: 'STAGE_INSTANCE' | 'VOICE' | 'EXTERNAL';
  location: string | null;
  name: string;
  scheduledEndAt: Date | null;
  scheduledStartAt: Date;
  status: 'SCHEDULED' | 'UPDATED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED';
  userCount: number | null;
};

export type BroadcastAlertsTwitterClient = TwitterApi | undefined;

export type BroadcastAlertsGuild = Guild;

export type BroadcastAlertsEventName = string | undefined;

export type BroadcastAlertsEventStatus = 'SCHEDULED' | 'UPDATED' | 'ACTIVE' | 'COMPLETED' | 'CANCELED' | undefined;

export type BroadcastAlertsEventEntityType = 'STAGE_INSTANCE' | 'VOICE' | 'EXTERNAL' | undefined;

export type BroadcastAlertsEventEntityTypes = BroadcastAlertsEventEntityType[] | undefined;

export type BroadcastAlertsEventCreatorUserId = ConfigUser['user-id'] | undefined;

export type BroadcastAlertsEventCreator = ConfigUser | undefined;

export type BroadcastAlertsEventMessage = string | undefined;

export type BroadcastAlertsEvent = {
  name: BroadcastAlertsEventName;
  status: BroadcastAlertsEventStatus;
  'entity-types': BroadcastAlertsEventEntityTypes;
  creator: BroadcastAlertsEventCreator;
  message: BroadcastAlertsEventMessage;
} | undefined;

export type BroadcastAlertsEvents = BroadcastAlertsEvent[] | undefined;

export type BroadcastAlertsReturns = void;

/**
 * Broadcast alerts - Replace variables.
 *
 * @since 1.0.0
 */
export type BroadcastAlertsReplaceVariablesConfigMessage = string;

export type BroadcastAlertsReplaceVariablesReturns = string;

/**
 * Broadcast alerts via "guildScheduledEventCreate".
 *
 * @since 1.0.0
 */
export type BroadcastAlertsViaGuildScheduledEventCreateScheduledEvent = GuildScheduledEvent;

export type BroadcastAlertsViaGuildScheduledEventCreateTwitterClient = TwitterApi | undefined;

export type BroadcastAlertsViaGuildScheduledEventCreateGuild = Guild;

export type BroadcastAlertsViaGuildScheduledEventCreateEvents = BroadcastAlertsEvents;

export type BroadcastAlertsViaGuildScheduledEventCreateReturns = void;

/**
 * Broadcast alerts via "guildScheduledEventCreate" - Generate instance.
 *
 * @since 1.0.0
 */
export type BroadcastAlertsViaGuildScheduledEventCreateGenerateInstanceReturns = Promise<BroadcastAlertsInstance>;

/**
 * Broadcast alerts via "guildScheduledEventUpdate".
 *
 * @since 1.0.0
 */
export type BroadcastAlertsViaGuildScheduledEventUpdateOldScheduledEvent = GuildScheduledEvent;

export type BroadcastAlertsViaGuildScheduledEventUpdateNewScheduledEvent = GuildScheduledEvent;

export type BroadcastAlertsViaGuildScheduledEventUpdateTwitterClient = TwitterApi | undefined;

export type BroadcastAlertsViaGuildScheduledEventUpdateGuild = Guild;

export type BroadcastAlertsViaGuildScheduledEventUpdateEvents = BroadcastAlertsEvents;

export type BroadcastAlertsViaGuildScheduledEventUpdateReturns = void;

/**
 * Broadcast alerts via "guildScheduledEventUpdate" - Generate instance.
 *
 * @since 1.0.0
 */
export type BroadcastAlertsViaGuildScheduledEventUpdateGenerateInstanceReturns = Promise<BroadcastAlertsInstance>;

/**
 * Broadcast alerts via "guildScheduledEventDelete".
 *
 * @since 1.0.0
 */
export type BroadcastAlertsViaGuildScheduledEventDeleteScheduledEvent = GuildScheduledEvent;

export type BroadcastAlertsViaGuildScheduledEventDeleteTwitterClient = TwitterApi | undefined;

export type BroadcastAlertsViaGuildScheduledEventDeleteGuild = Guild;

export type BroadcastAlertsViaGuildScheduledEventDeleteEvents = BroadcastAlertsEvents;

export type BroadcastAlertsViaGuildScheduledEventDeleteReturns = void;

/**
 * Bulk ban.
 *
 * @since 1.0.0
 */
export type BulkBanMessage = Message;

export type BulkBanSettingsBaseCommand = string | undefined;

export type BulkBanSettingsBaseCommands = BulkBanSettingsBaseCommand[] | undefined;

export type BulkBanSettingsDeleteMessage = boolean | undefined;

export type BulkBanSettingsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type BulkBanSettingsAllowedRole = ConfigRole | undefined;

export type BulkBanSettingsAllowedRoles = BulkBanSettingsAllowedRole[] | undefined;

export type BulkBanSettings = {
  'base-commands': BulkBanSettingsBaseCommands;
  'delete-message': BulkBanSettingsDeleteMessage;
  'allowed-roles': BulkBanSettingsAllowedRoles;
} | undefined;

export type BulkBanReturns = void;

/**
 * Bump threads.
 *
 * @since 1.0.0
 */
export type BumpThreadsGuild = Guild;

export type BumpThreadsEventName = string | undefined;

export type BumpThreadsEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type BumpThreadsEventChannel = ConfigChannel | undefined;

export type BumpThreadsEventThreadThreadId = ConfigThread['thread-id'] | undefined;

export type BumpThreadsEventThread = ConfigThread | undefined;

export type BumpThreadsEvent = {
  name: BumpThreadsEventName;
  channel: BumpThreadsEventChannel;
  thread: BumpThreadsEventThread;
};

export type BumpThreadsEvents = BumpThreadsEvent[] | undefined;

export type BumpThreadsReturns = void;

/**
 * Change nickname.
 *
 * @since 1.0.0
 */
export type ChangeNicknameOldMember = GuildMember;

export type ChangeNicknameNewMember = GuildMember;

export type ChangeNicknameGuild = Guild;

export type ChangeNicknameSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type ChangeNicknameSettingsChannel = ConfigChannel | undefined;

export type ChangeNicknameSettings = {
  channel: ChangeNicknameSettingsChannel;
} | undefined;

export type ChangeNicknameReturns = void;

/**
 * Change username.
 *
 * @since 1.0.0
 */
export type ChangeUsernameOldUser = User;

export type ChangeUsernameNewUser = User;

export type ChangeUsernameGuild = Guild;

export type ChangeUsernameSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type ChangeUsernameSettingsChannel = ConfigChannel | undefined;

export type ChangeUsernameSettings = {
  channel: ChangeUsernameSettingsChannel;
} | undefined;

export type ChangeUsernameReturns = void;

/**
 * Create bulk ban embed.
 *
 * @since 1.0.0
 */
export type CreateBulkBanEmbedProgressMessage = string;

export type CreateBulkBanEmbedStatus = EmbedStatus;

export type CreateBulkBanEmbedUserTag = string;

export type CreateBulkBanEmbedReturns = MessageEmbed;

/**
 * Create change nickname embed.
 *
 * @since 1.0.0
 */
export type CreateChangeNicknameEmbedOldNickname = string | null;

export type CreateChangeNicknameEmbedNewNickname = string | null;

export type CreateChangeNicknameEmbedUserMention = UserMention;

export type CreateChangeNicknameEmbedUserAvatarUrl = string;

export type CreateChangeNicknameEmbedReturns = MessageEmbed;

/**
 * Create change username embed.
 *
 * @since 1.0.0
 */
export type CreateChangeUsernameEmbedOldUserTag = string | null;

export type CreateChangeUsernameEmbedNewUserTag = string;

export type CreateChangeUsernameEmbedUserMention = UserMention;

export type CreateChangeUsernameEmbedUserAvatarUrl = string;

export type CreateChangeUsernameEmbedReturns = MessageEmbed;

/**
 * Create command error embed.
 *
 * @since 1.0.0
 */
export type CreateCommandErrorEmbedReason = string;

export type CreateCommandErrorEmbedUserTag = string;

export type CreateCommandErrorEmbedReturns = MessageEmbed;

/**
 * Create delete message embed.
 *
 * @since 1.0.0
 */
export type CreateDeleteMessageEmbedUserMention = UserMention;

export type CreateDeleteMessageEmbedChannelMention = ChannelMention;

export type CreateDeleteMessageEmbedMessageId = Snowflake;

export type CreateDeleteMessageEmbedMessageContent = string;

export type CreateDeleteMessageEmbedMessageAttachments = MessageAttachment[];

export type CreateDeleteMessageEmbedMessageUrl = string;

export type CreateDeleteMessageEmbedReturns = MessageEmbed;

/**
 * Create earnings table attachment.
 *
 * @since 1.0.0
 */
export type CreateEarningsTableAttachmentEarnings = MemoryFinnhubEarningsContentEarnings;

export type CreateEarningsTableAttachmentReturns = MessageAttachment;

/**
 * Create emojis inline attachment.
 *
 * @since 1.0.0
 */
export type CreateEmojisInlineAttachmentEmojis = GuildEmoji[];

export type CreateEmojisInlineAttachmentRoute = 'all' | 'animated' | 'static';

export type CreateEmojisInlineAttachmentReturns = MessageAttachment;

/**
 * Create emojis table attachment.
 *
 * @since 1.0.0
 */
export type CreateEmojisTableAttachmentEmojis = GuildEmoji[];

export type CreateEmojisTableAttachmentRoute = 'all' | 'animated' | 'static';

export type CreateEmojisTableAttachmentReturns = MessageAttachment;

/**
 * Create guild join embed.
 *
 * @since 1.0.0
 */
export type CreateGuildJoinEmbedUserTag = string;

export type CreateGuildJoinEmbedUserMention = UserMention;

export type CreateGuildJoinEmbedUserAvatar = string | null;

export type CreateGuildJoinEmbedUserAvatarUrl = string;

export type CreateGuildJoinEmbedUserCreatedAt = Date;

export type CreateGuildJoinEmbedReturns = MessageEmbed;

/**
 * Create guild leave embed.
 *
 * @since 1.0.0
 */
export type CreateGuildLeaveEmbedUserTag = string;

export type CreateGuildLeaveEmbedUserMention = UserMention;

export type CreateGuildLeaveEmbedUserAvatar = string | null;

export type CreateGuildLeaveEmbedUserAvatarUrl = string;

export type CreateGuildLeaveEmbedUserCreatedAt = Date;

export type CreateGuildLeaveEmbedMemberJoinedAt = Date;

export type CreateGuildLeaveEmbedMemberRoles = Role[];

export type CreateGuildLeaveEmbedReturns = MessageEmbed;

/**
 * Create includes link embed.
 *
 * @since 1.0.0
 */
export type CreateIncludesLinkEmbedUserMention = UserMention;

export type CreateIncludesLinkEmbedChannelMention = ChannelMention;

export type CreateIncludesLinkEmbedMessageId = Snowflake;

export type CreateIncludesLinkEmbedMessageContent = string;

export type CreateIncludesLinkEmbedMessageAttachments = MessageAttachment[];

export type CreateIncludesLinkEmbedMessageUrl = string;

export type CreateIncludesLinkEmbedReturns = MessageEmbed;

/**
 * Create list emojis embed.
 *
 * @since 1.0.0
 */
export type CreateListEmojisEmbedRoute = 'all' | 'animated' | 'static';

export type CreateListEmojisEmbedUserTag = string;

export type CreateListEmojisEmbedReturns = MessageEmbed;

/**
 * Create list members embed.
 *
 * @since 1.0.0
 */
export type CreateListMembersEmbedTitle = string;

export type CreateListMembersEmbedUserTag = string;

export type CreateListMembersEmbedThumbnailUrl = string;

export type CreateListMembersEmbedReturns = MessageEmbed;

/**
 * Create members inline attachment.
 *
 * @since 1.0.0
 */
export type CreateMembersInlineAttachmentMembers = GuildMember[];

export type CreateMembersInlineAttachmentName = string;

export type CreateMembersInlineAttachmentReturns = MessageAttachment;

/**
 * Create members table attachment.
 *
 * @since 1.0.0
 */
export type CreateMembersTableAttachmentMembers = GuildMember[];

export type CreateMembersTableAttachmentName = string;

export type CreateMembersTableAttachmentReturns = MessageAttachment;

/**
 * Create no results embed.
 *
 * @since 1.0.0
 */
export type CreateNoResultsEmbedReason = string;

export type CreateNoResultsEmbedUserTag = string;

export type CreateNoResultsEmbedReturns = MessageEmbed;

/**
 * Create remove affiliates embed.
 *
 * @since 1.0.0
 */
export type CreateRemoveAffiliatesEmbedUserMention = UserMention;

export type CreateRemoveAffiliatesEmbedChannelMention = ChannelMention;

export type CreateRemoveAffiliatesEmbedMessageId = Snowflake;

export type CreateRemoveAffiliatesEmbedMessageContent = string;

export type CreateRemoveAffiliatesEmbedMessageAttachments = MessageAttachment[];

export type CreateRemoveAffiliatesEmbedMessageUrl = string;

export type CreateRemoveAffiliatesEmbedPlatforms = MemoryRemoveAffiliatesDetectedAffiliates;

export type CreateRemoveAffiliatesEmbedReturns = MessageEmbed;

/**
 * Create role change embed.
 *
 * @since 1.0.0
 */
export type CreateRoleChangeEmbedUserMention = UserMention;

export type CreateRoleChangeEmbedUserAvatarUrl = string;

export type CreateRoleChangeEmbedAddedMemberRoles = Role[];

export type CreateRoleChangeEmbedRemovedMemberRoles = Role[];

export type CreateRoleChangeEmbedReturns = MessageEmbed;

/**
 * Create role manager embed.
 *
 * @since 1.0.0
 */
export type CreateRoleManagerEmbedProgressMessage = string;

export type CreateRoleManagerEmbedRoute = 'add' | 'remove';

export type CreateRoleManagerEmbedStatus = EmbedStatus;

export type CreateRoleManagerEmbedUserTag = string;

export type CreateRoleManagerEmbedReturns = MessageEmbed;

/**
 * Create suspicious words embed.
 *
 * @since 1.0.0
 */
export type CreateSuspiciousWordsEmbedUserMention = UserMention;

export type CreateSuspiciousWordsEmbedChannelMention = ChannelMention;

export type CreateSuspiciousWordsEmbedMessageId = Snowflake;

export type CreateSuspiciousWordsEmbedMessageContent = string;

export type CreateSuspiciousWordsEmbedMessageAttachments = MessageAttachment[];

export type CreateSuspiciousWordsEmbedMessageUrl = string;

export type CreateSuspiciousWordsEmbedCategories = MemoryDetectSuspiciousWordsDetectedCategories;

export type CreateSuspiciousWordsEmbedReturns = MessageEmbed;

/**
 * Create toggle perms embed.
 *
 * @since 1.0.0
 */
export type CreateTogglePermsEmbedProgressMessage = string;

export type CreateTogglePermsEmbedSuccess = boolean;

export type CreateTogglePermsEmbedUserTag = string;

export type CreateTogglePermsEmbedReturns = MessageEmbed;

/**
 * Create update message embed.
 *
 * @since 1.0.0
 */
export type CreateUpdateMessageEmbedUserMention = UserMention;

export type CreateUpdateMessageEmbedChannelMention = ChannelMention;

export type CreateUpdateMessageEmbedMessageId = Snowflake;

export type CreateUpdateMessageEmbedOldMessageContent = string;

export type CreateUpdateMessageEmbedNewMessageContent = string;

export type CreateUpdateMessageEmbedMessageAttachments = MessageAttachment[];

export type CreateUpdateMessageEmbedMessageUrl = string;

export type CreateUpdateMessageEmbedReturns = MessageEmbed;

/**
 * Create upload attachment embed.
 *
 * @since 1.0.0
 */
export type CreateUploadAttachmentEmbedUserMention = UserMention;

export type CreateUploadAttachmentEmbedChannelMention = ChannelMention;

export type CreateUploadAttachmentEmbedMessageId = Snowflake;

export type CreateUploadAttachmentEmbedMessageAttachments = MessageAttachment[];

export type CreateUploadAttachmentEmbedMessageUrl = string;

export type CreateUploadAttachmentEmbedReturns = MessageEmbed;

/**
 * Create voice tools embed.
 *
 * @since 1.0.0
 */
export type CreateVoiceToolsEmbedProgressMessage = string;

export type CreateVoiceToolsEmbedRoute = 'disconnect' | 'unmute' | 'invite';

export type CreateVoiceToolsEmbedStatus = EmbedStatus;

export type CreateVoiceToolsEmbedUserTag = string;

export type CreateVoiceToolsEmbedReturns = MessageEmbed;

/**
 * Delete command message.
 *
 * @since 1.0.0
 */
export type DeleteCommandMessageMessage = Message;

export type DeleteCommandMessageReturns = void;

/**
 * Delete message.
 *
 * @since 1.0.0
 */
export type DeleteMessageMessage = Message;

export type DeleteMessageGuild = Guild;

export type DeleteMessageSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type DeleteMessageSettingsChannel = ConfigChannel | undefined;

export type DeleteMessageSettings = {
  channel: DeleteMessageSettingsChannel;
} | undefined;

export type DeleteMessageReturns = void;

/**
 * Detect suspicious words.
 *
 * @since 1.0.0
 */
export type DetectSuspiciousWordsMessage = Message;

export type DetectSuspiciousWordsSettingsCategoryCategory = string | undefined;

export type DetectSuspiciousWordsSettingsCategoryWord = string | undefined;

export type DetectSuspiciousWordsSettingsCategoryWords = DetectSuspiciousWordsSettingsCategoryWord[] | undefined;

export type DetectSuspiciousWordsSettingsCategory = {
  category: DetectSuspiciousWordsSettingsCategoryCategory;
  words: DetectSuspiciousWordsSettingsCategoryWords;
} | undefined;

export type DetectSuspiciousWordsSettingsCategories = DetectSuspiciousWordsSettingsCategory[] | undefined;

export type DetectSuspiciousWordsSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type DetectSuspiciousWordsSettingsChannel = ConfigChannel | undefined;

export type DetectSuspiciousWordsSettings = {
  categories: DetectSuspiciousWordsSettingsCategories;
  channel: DetectSuspiciousWordsSettingsChannel;
} | undefined;

export type DetectSuspiciousWordsReturns = void;

/**
 * Escape characters.
 *
 * @since 1.0.0
 */
export type EscapeCharactersString = string;

export type EscapeCharactersReturns = string;

/**
 * Etherscan gas oracle.
 *
 * @since 1.0.0
 */
export type EtherscanGasOracleMessage = Message | undefined;

export type EtherscanGasOracleGuild = Guild;

export type EtherscanGasOracleSettingsSettingsApiKey = string | undefined;

export type EtherscanGasOracleSettingsSettings = {
  'api-key': EtherscanGasOracleSettingsSettingsApiKey;
} | undefined;

export type EtherscanGasOracleSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type EtherscanGasOracleSettingsChannel = ConfigChannel | undefined;

export type EtherscanGasOracleSettingsCommandBaseCommand = string | undefined;

export type EtherscanGasOracleSettingsCommandBaseCommands = EtherscanGasOracleSettingsCommandBaseCommand[] | undefined;

export type EtherscanGasOracleSettingsCommandAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type EtherscanGasOracleSettingsCommandAllowedRole = ConfigRole | undefined;

export type EtherscanGasOracleSettingsCommandAllowedRoles = EtherscanGasOracleSettingsCommandAllowedRole[] | undefined;

export type EtherscanGasOracleSettingsCommandNoPermsPayload = MessageOptions | undefined;

export type EtherscanGasOracleSettingsCommand = {
  'base-commands': EtherscanGasOracleSettingsCommandBaseCommands;
  'allowed-roles': EtherscanGasOracleSettingsCommandAllowedRoles;
  'no-perms-payload': EtherscanGasOracleSettingsCommandNoPermsPayload;
} | undefined;

export type EtherscanGasOracleSettings = {
  settings: EtherscanGasOracleSettingsSettings;
  channel: EtherscanGasOracleSettingsChannel;
  command: EtherscanGasOracleSettingsCommand;
} | undefined;

export type EtherscanGasOracleReturns = void;

/**
 * Etherscan gas oracle - Replace variables.
 *
 * @since 1.0.0
 */
export type EtherscanGasOracleReplaceVariablesConfigPayload = MessageOptions;

export type EtherscanGasOracleReplaceVariablesReturns = MessageOptions;

/**
 * Fetch duplicates.
 *
 * @since 1.0.0
 */
export type FetchDuplicatesMessage = Message;

export type FetchDuplicatesSettingsBaseCommand = string | undefined;

export type FetchDuplicatesSettingsBaseCommands = FetchDuplicatesSettingsBaseCommand[] | undefined;

export type FetchDuplicatesSettingsDeleteMessage = boolean | undefined;

export type FetchDuplicatesSettingsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type FetchDuplicatesSettingsAllowedRole = ConfigRole | undefined;

export type FetchDuplicatesSettingsAllowedRoles = FetchDuplicatesSettingsAllowedRole[] | undefined;

export type FetchDuplicatesSettings = {
  'base-commands': FetchDuplicatesSettingsBaseCommands;
  'delete-message': FetchDuplicatesSettingsDeleteMessage;
  'allowed-roles': FetchDuplicatesSettingsAllowedRoles;
} | undefined;

export type FetchDuplicatesReturns = void;

/**
 * Fetch emojis.
 *
 * @since 1.0.0
 */
export type FetchEmojisMessage = Message;

export type FetchEmojisSettingsBaseCommand = string | undefined;

export type FetchEmojisSettingsBaseCommands = FetchEmojisSettingsBaseCommand[] | undefined;

export type FetchEmojisSettingsDeleteMessage = boolean | undefined;

export type FetchEmojisSettingsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type FetchEmojisSettingsAllowedRole = ConfigRole | undefined;

export type FetchEmojisSettingsAllowedRoles = FetchEmojisSettingsAllowedRole[] | undefined;

export type FetchEmojisSettings = {
  'base-commands': FetchEmojisSettingsBaseCommands;
  'delete-message': FetchEmojisSettingsDeleteMessage;
  'allowed-roles': FetchEmojisSettingsAllowedRoles;
} | undefined;

export type FetchEmojisReturns = void;

export type FetchEmojisCommandRoute = 'all' | 'animated' | 'static' | '';

/**
 * Fetch formatted date.
 *
 * @since 1.0.0
 */
export type FetchFormattedDateType = 'date' | 'iso' | 'ts-seconds' | 'ts-millis' | 'now';

export type FetchFormattedDateFrom = Date | string | number | undefined;

export type FetchFormattedDateTimeZone = 'config' | string | undefined;

export type FetchFormattedDateFormat = 'iso' | 'iso-date' | 'iso-time' | string;

export type FetchFormattedDateReturns = string;

/**
 * Fetch formatted duration.
 *
 * @since 1.0.0
 */
export type FetchFormattedDurationTimeBegin = Date;

export type FetchFormattedDurationReturns = string;

/**
 * Fetch members.
 *
 * @since 1.0.0
 */
export type FetchMembersMessage = Message;

export type FetchMembersSettingsBaseCommand = string | undefined;

export type FetchMembersSettingsBaseCommands = FetchMembersSettingsBaseCommand[] | undefined;

export type FetchMembersSettingsDeleteMessage = boolean | undefined;

export type FetchMembersSettingsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type FetchMembersSettingsAllowedRole = ConfigRole | undefined;

export type FetchMembersSettingsAllowedRoles = FetchMembersSettingsAllowedRole[] | undefined;

export type FetchMembersSettings = {
  'base-commands': FetchMembersSettingsBaseCommands;
  'delete-message': FetchMembersSettingsDeleteMessage;
  'allowed-roles': FetchMembersSettingsAllowedRoles;
} | undefined;

export type FetchMembersReturns = void;

export type FetchMembersCommandRoute = 'avatar' | 'everyone' | 'role' | 'string' | 'username' | '';

export type FetchMembersCommandAction = MemberMention | RoleMention | string;

/**
 * Finnhub earnings.
 *
 * @since 1.0.0
 */
export type FinnhubEarningsMessage = Message | undefined;

export type FinnhubEarningsGuild = Guild;

export type FinnhubEarningsSettingsSettingsApiKey = string | undefined;

export type FinnhubEarningsSettingsSettings = {
  'api-key': FinnhubEarningsSettingsSettingsApiKey;
} | undefined;

export type FinnhubEarningsSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type FinnhubEarningsSettingsChannel = ConfigChannel | undefined;

export type FinnhubEarningsSettingsCommandBaseCommand = string | undefined;

export type FinnhubEarningsSettingsCommandBaseCommands = FinnhubEarningsSettingsCommandBaseCommand[] | undefined;

export type FinnhubEarningsSettingsCommandAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type FinnhubEarningsSettingsCommandAllowedRole = ConfigRole | undefined;

export type FinnhubEarningsSettingsCommandAllowedRoles = FinnhubEarningsSettingsCommandAllowedRole[] | undefined;

export type FinnhubEarningsSettingsCommandNoPermsPayload = MessageOptions | undefined;

export type FinnhubEarningsSettingsCommand = {
  'base-commands': FinnhubEarningsSettingsCommandBaseCommands;
  'allowed-roles': FinnhubEarningsSettingsCommandAllowedRoles;
  'no-perms-payload': FinnhubEarningsSettingsCommandNoPermsPayload;
} | undefined;

export type FinnhubEarningsSettings = {
  settings: FinnhubEarningsSettingsSettings;
  channel: FinnhubEarningsSettingsChannel;
  command: FinnhubEarningsSettingsCommand;
} | undefined;

export type FinnhubEarningsReturns = void;

/**
 * Finnhub earnings - Calculate surprise.
 *
 * @since 1.0.0
 */
export type FinnhubEarningsCalculateSurpriseEstimate = number;

export type FinnhubEarningsCalculateSurpriseActual = number;

export type FinnhubEarningsCalculateSurpriseReturns = string;

/**
 * Finnhub earnings - Format eps.
 *
 * @since 1.0.0
 */
export type FinnhubEarningsFormatEpsEarningsPerShare = number;

export type FinnhubEarningsFormatEpsReturns = string;

/**
 * Finnhub earnings - Format revenue.
 *
 * @since 1.0.0
 */
export type FinnhubEarningsFormatRevenueRevenue = number;

export type FinnhubEarningsFormatRevenueReturns = string;

/**
 * Finnhub earnings - Replace variables.
 *
 * @since 1.0.0
 */
export type FinnhubEarningsReplaceVariablesConfigPayload = MessageOptions;

export type FinnhubEarningsReplaceVariablesReturns = MessageOptions;

/**
 * Generate attachment.
 *
 * @since 1.0.0
 */
export type GenerateAttachmentBuffer = BufferResolvable;

export type GenerateAttachmentFileName = string;

export type GenerateAttachmentDescription = string | undefined;

export type GenerateAttachmentReturns = MessageAttachment;

/**
 * Generate color.
 *
 * @since 1.0.0
 */
export type GenerateColorKey = 'complete' | 'success' | 'fail' | 'error' | 'in-progress' | 'warn' | 'info' | 'default';

export type GenerateColorReturns = ColorResolvable;

/**
 * Generate cron.
 *
 * @since 1.0.0
 */
export type GenerateCronRule = {
  'days-of-week': (number | undefined)[] | undefined;
  months: (number | undefined)[] | undefined;
  dates: (number | undefined)[] | undefined;
  hours: (number | undefined)[] | undefined;
  minutes: (number | undefined)[] | undefined;
  seconds: (number | undefined)[] | undefined;
};

export type GenerateCronReturns = string;

/**
 * Generate embed.
 *
 * @since 1.0.0
 */
export type GenerateEmbedTitle = string;

export type GenerateEmbedDescription = string;

export type GenerateEmbedFields = EmbedFieldData[] | undefined;

export type GenerateEmbedColor = ColorResolvable;

export type GenerateEmbedFooterText = string;

export type GenerateEmbedThumbnailUrl = string | undefined;

export type GenerateEmbedReturns = MessageEmbed;

/**
 * Generate log message.
 *
 * @since 1.0.0
 */
export type GenerateLogMessageLogMessage = string;

export type GenerateLogMessagePriority = LogLevel;

export type GenerateLogMessageErrorObject = Error | unknown;

export type GenerateLogMessageReturns = void;

/**
 * Generate server message.
 *
 * @since 1.0.0
 */
export type GenerateServerMessageLogMessage = string;

export type GenerateServerMessageErrorObject = Error;

export type GenerateServerMessageReturns = void;

/**
 * Generate title.
 *
 * @since 1.0.0
 */
export type GenerateTitleKey = string;

export type GenerateTitleReturns = string;

/**
 * Generate user agent.
 *
 * @since 1.0.0
 */
export type GenerateUserAgentReturns = string;

/**
 * Get collection items.
 *
 * @since 1.0.0
 */
export type GetCollectionItemsCollection<Key, Value> = Collection<Key, Value>;

export type GetCollectionItemsReturns<Value> = Value[];

/**
 * Get text-based channel.
 *
 * @since 1.0.0
 */
export type GetTextBasedChannelGuild = Guild;

export type GetTextBasedChannelId = Snowflake | undefined;

export type GetTextBasedChannelReturns = NewsChannel | TextChannel | ThreadChannel | null | undefined;

/**
 * Get text-based non-thread channel.
 *
 * @since 1.0.0
 */
export type GetTextBasedNonThreadChannelGuild = Guild;

export type GetTextBasedNonThreadChannelId = Snowflake | undefined;

export type GetTextBasedNonThreadChannelReturns = NewsChannel | TextChannel | null | undefined;

/**
 * Get voice-based channel.
 *
 * @since 1.0.0
 */
export type GetVoiceBasedChannelGuild = Guild;

export type GetVoiceBasedChannelId = Snowflake | undefined;

export type GetVoiceBasedChannelReturns = StageChannel | VoiceChannel | null | undefined;

/**
 * Guild join.
 *
 * @since 1.0.0
 */
export type GuildJoinMember = GuildMember;

export type GuildJoinGuild = Guild;

export type GuildJoinSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type GuildJoinSettingsChannel = ConfigChannel | undefined;

export type GuildJoinSettings = {
  channel: GuildJoinSettingsChannel;
} | undefined;

export type GuildJoinReturns = void;

/**
 * Guild leave.
 *
 * @since 1.0.0
 */
export type GuildLeaveMember = GuildMember;

export type GuildLeaveGuild = Guild;

export type GuildLeaveSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type GuildLeaveSettingsChannel = ConfigChannel | undefined;

export type GuildLeaveSettings = {
  channel: GuildLeaveSettingsChannel;
} | undefined;

export type GuildLeaveReturns = void;

/**
 * Impersonator alerts.
 *
 * @since 1.0.0
 */
export type ImpersonatorAlertsNicknameOrUsername = string;

export type ImpersonatorAlertsMemberOrUser = GuildMember | User;

export type ImpersonatorAlertsGuild = Guild;

export type ImpersonatorAlertsSettingsEntityName = string | undefined;

export type ImpersonatorAlertsSettingsEntityUserUserId = ConfigUser['user-id'] | undefined;

export type ImpersonatorAlertsSettingsEntityUser = ConfigUser | undefined;

export type ImpersonatorAlertsSettingsEntityRegexPattern = ConfigRegex['pattern'] | undefined;

export type ImpersonatorAlertsSettingsEntityRegexFlags = ConfigRegex['flags'] | undefined;

export type ImpersonatorAlertsSettingsEntityRegex = ConfigRegex | undefined;

export type ImpersonatorAlertsSettingsEntityPayload = MessageOptions | undefined;

export type ImpersonatorAlertsSettingsEntity = {
  name: ImpersonatorAlertsSettingsEntityName;
  user: ImpersonatorAlertsSettingsEntityUser;
  regex: ImpersonatorAlertsSettingsEntityRegex;
  payload: ImpersonatorAlertsSettingsEntityPayload;
} | undefined;

export type ImpersonatorAlertsSettingsEntities = ImpersonatorAlertsSettingsEntity[] | undefined;

export type ImpersonatorAlertsSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type ImpersonatorAlertsSettingsChannel = ConfigChannel | undefined;

export type ImpersonatorAlertsSettings = {
  entities: ImpersonatorAlertsSettingsEntities;
  channel: ImpersonatorAlertsSettingsChannel;
} | undefined;

export type ImpersonatorAlertsReturns = void;

/**
 * Impersonator alerts - Replace variables.
 *
 * @since 1.0.0
 */
export type ImpersonatorAlertsReplaceVariablesConfigPayload = MessageOptions;

export type ImpersonatorAlertsReplaceVariablesReturns = MessageOptions;

/**
 * Impersonator alerts via "guildMemberAdd".
 *
 * @since 1.0.0
 */
export type ImpersonatorAlertsViaGuildMemberAddMember = GuildMember;

export type ImpersonatorAlertsViaGuildMemberAddGuild = Guild;

export type ImpersonatorAlertsViaGuildMemberAddSettings = ImpersonatorAlertsSettings | undefined;

export type ImpersonatorAlertsViaGuildMemberAddReturns = void;

/**
 * Impersonator alerts via "guildMemberUpdate".
 *
 * @since 1.0.0
 */
export type ImpersonatorAlertsViaGuildMemberUpdateOldMember = GuildMember;

export type ImpersonatorAlertsViaGuildMemberUpdateNewMember = GuildMember;

export type ImpersonatorAlertsViaGuildMemberUpdateGuild = Guild;

export type ImpersonatorAlertsViaGuildMemberUpdateSettings = ImpersonatorAlertsSettings | undefined;

export type ImpersonatorAlertsViaGuildMemberUpdateReturns = void;

/**
 * Impersonator alerts via "userUpdate".
 *
 * @since 1.0.0
 */
export type ImpersonatorAlertsViaUserUpdateOldUser = User;

export type ImpersonatorAlertsViaUserUpdateNewUser = User;

export type ImpersonatorAlertsViaUserUpdateGuild = Guild;

export type ImpersonatorAlertsViaUserUpdateSettings = ImpersonatorAlertsSettings | undefined;

export type ImpersonatorAlertsViaUserUpdateReturns = void;

/**
 * Includes link.
 *
 * @since 1.0.0
 */
export type IncludesLinkMessage = Message;

export type IncludesLinkGuild = Guild;

export type IncludesLinkSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type IncludesLinkSettingsChannel = ConfigChannel | undefined;

export type IncludesLinkSettingsExcludedLinkName = string | undefined;

export type IncludesLinkSettingsExcludedLinkRegexPattern = ConfigRegex['pattern'] | undefined;

export type IncludesLinkSettingsExcludedLinkRegexFlags = ConfigRegex['flags'] | undefined;

export type IncludesLinkSettingsExcludedLinkRegex = ConfigRegex | undefined;

export type IncludesLinkSettingsExcludedLink = {
  name: IncludesLinkSettingsExcludedLinkName;
  regex: IncludesLinkSettingsExcludedLinkRegex;
} | undefined;

export type IncludesLinkSettingsExcludedLinks = IncludesLinkSettingsExcludedLink[] | undefined;

export type IncludesLinkSettings = {
  channel: IncludesLinkSettingsChannel;
  'excluded-links': IncludesLinkSettingsExcludedLinks;
} | undefined;

export type IncludesLinkReturns = void;

/**
 * Initialize.
 *
 * @since 1.0.0
 */
export type InitializeDiscordClient = Client;

export type InitializeTwitterClient = TwitterApi | undefined;

export type InitializeGuild = Guild;

export type InitializeReturns = void;

/**
 * Invite generator.
 *
 * @since 1.0.0
 */
export type InviteGeneratorGuild = Guild;

export type InviteGeneratorWebServer = Express;

export type InviteGeneratorSettingsOptionsPath = string | undefined;

export type InviteGeneratorSettingsOptionsErrorPostfix = string | undefined;

export type InviteGeneratorSettingsOptionsMaxAge = number | undefined;

export type InviteGeneratorSettingsOptionsMaxUses = number | undefined;

export type InviteGeneratorSettingsOptions = {
  path: InviteGeneratorSettingsOptionsPath;
  'error-postfix': InviteGeneratorSettingsOptionsErrorPostfix;
  'max-age': InviteGeneratorSettingsOptionsMaxAge;
  'max-uses': InviteGeneratorSettingsOptionsMaxUses;
} | undefined;

export type InviteGeneratorSettingsDesignBackgroundColor = string | undefined;

export type InviteGeneratorSettingsDesignLinkColor = string | undefined;

export type InviteGeneratorSettingsDesignTextColor = string | undefined;

export type InviteGeneratorSettingsDesign = {
  'background-color': InviteGeneratorSettingsDesignBackgroundColor;
  'link-color': InviteGeneratorSettingsDesignLinkColor;
  'text-color': InviteGeneratorSettingsDesignTextColor;
} | undefined;

export type InviteGeneratorSettingsImagesLogoUrl = string | undefined;

export type InviteGeneratorSettingsImagesFaviconUrl = string | undefined;

export type InviteGeneratorSettingsImages = {
  'logo-url': InviteGeneratorSettingsImagesLogoUrl;
  'favicon-url': InviteGeneratorSettingsImagesFaviconUrl;
} | undefined;

export type InviteGeneratorSettingsInjectCodeHeaderAreaDescription = string | undefined;

export type InviteGeneratorSettingsInjectCodeHeaderAreaCode = string | undefined;

export type InviteGeneratorSettingsInjectCodeHeaderArea = {
  description: InviteGeneratorSettingsInjectCodeHeaderAreaDescription;
  code: InviteGeneratorSettingsInjectCodeHeaderAreaCode;
} | undefined;

export type InviteGeneratorSettingsInjectCodeHeaderAreas = InviteGeneratorSettingsInjectCodeHeaderArea[] | undefined;

export type InviteGeneratorSettingsInjectCodeFooterAreaDescription = string | undefined;

export type InviteGeneratorSettingsInjectCodeFooterAreaCode = string | undefined;

export type InviteGeneratorSettingsInjectCodeFooterArea = {
  description: InviteGeneratorSettingsInjectCodeFooterAreaDescription;
  code: InviteGeneratorSettingsInjectCodeFooterAreaCode;
} | undefined;

export type InviteGeneratorSettingsInjectCodeFooterAreas = InviteGeneratorSettingsInjectCodeFooterArea[] | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitSuccessDescription = string | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitSuccessCode = string | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitSuccess = {
  description: InviteGeneratorSettingsInjectCodeSubmitSuccessDescription;
  code: InviteGeneratorSettingsInjectCodeSubmitSuccessCode;
} | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitSuccesses = InviteGeneratorSettingsInjectCodeSubmitSuccess[] | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitFailDescription = string | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitFailCode = string | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitFail = {
  description: InviteGeneratorSettingsInjectCodeSubmitFailDescription;
  code: InviteGeneratorSettingsInjectCodeSubmitFailCode;
} | undefined;

export type InviteGeneratorSettingsInjectCodeSubmitFails = InviteGeneratorSettingsInjectCodeSubmitFail[] | undefined;

export type InviteGeneratorSettingsInjectCode = {
  'header-areas': InviteGeneratorSettingsInjectCodeHeaderAreas;
  'footer-areas': InviteGeneratorSettingsInjectCodeFooterAreas;
  'submit-successes': InviteGeneratorSettingsInjectCodeSubmitSuccesses;
  'submit-fails': InviteGeneratorSettingsInjectCodeSubmitFails;
} | undefined;

export type InviteGeneratorSettingsRecaptchaSiteKey = string | undefined;

export type InviteGeneratorSettingsRecaptchaSecretKey = string | undefined;

export type InviteGeneratorSettingsRecaptcha = {
  'site-key': InviteGeneratorSettingsRecaptchaSiteKey;
  'secret-key': InviteGeneratorSettingsRecaptchaSecretKey;
} | undefined;

export type InviteGeneratorSettings = {
  options: InviteGeneratorSettingsOptions;
  design: InviteGeneratorSettingsDesign;
  images: InviteGeneratorSettingsImages;
  'inject-code': InviteGeneratorSettingsInjectCode;
  recaptcha: InviteGeneratorSettingsRecaptcha;
} | undefined;

export type InviteGeneratorReturns = void;

/**
 * Is time zone valid.
 *
 * @since 1.0.0
 */
export type IsTimeZoneValidTimeZone = string | undefined;

export type IsTimeZoneValidReturns = boolean;

/**
 * Map webhooks.
 *
 * @since 1.0.0
 */
export type MapWebhooksGuild = Guild;

export type MapWebhooksWebServer = Express;

export type MapWebhooksEventName = string | undefined;

export type MapWebhooksEventPath = string | undefined;

export type MapWebhooksEventVariableId = string | undefined;

export type MapWebhooksEventVariableType = 'string' | 'boolean' | 'ts-seconds' | 'ts-millis' | 'usd-dollars' | 'usd-cents' | undefined;

export type MapWebhooksEventVariablePath = string | undefined;

export type MapWebhooksEventVariable = {
  id: MapWebhooksEventVariableId;
  type: MapWebhooksEventVariableType;
  path: MapWebhooksEventVariablePath;
} | undefined;

export type MapWebhooksEventVariables = MapWebhooksEventVariable[] | undefined;

export type MapWebhooksEventReplacementPattern = ConfigReplacement['pattern'] | undefined;

export type MapWebhooksEventReplacementFlags = ConfigReplacement['flags'] | undefined;

export type MapWebhooksEventReplacementReplaceWith = ConfigReplacement['replace-with'] | undefined;

export type MapWebhooksEventReplacement = ConfigReplacement | undefined;

export type MapWebhooksEventReplacements = MapWebhooksEventReplacement[] | undefined;

export type MapWebhooksEventPayload = MessageOptions | undefined;

export type MapWebhooksEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type MapWebhooksEventChannel = ConfigChannel | undefined;

export type MapWebhooksEvent = {
  name: MapWebhooksEventName;
  path: MapWebhooksEventPath;
  variables: MapWebhooksEventVariables;
  replacements: MapWebhooksEventReplacements;
  payload: MapWebhooksEventPayload;
  channel: MapWebhooksEventChannel;
} | undefined;

export type MapWebhooksEvents = MapWebhooksEvent[] | undefined;

export type MapWebhooksReturns = void;

/**
 * Map webhooks - Replace variables and text.
 *
 * @since 1.0.0
 */
export type MapWebhooksReplaceVariablesAndTextEventName = string;

export type MapWebhooksReplaceVariablesAndTextEventKey = number;

export type MapWebhooksReplaceVariablesAndTextEventVariables = MapWebhooksEventVariables;

export type MapWebhooksReplaceVariablesAndTextEventReplacements = MapWebhooksEventReplacements;

export type MapWebhooksReplaceVariablesAndTextEventPayload = MapWebhooksEventPayload;

export type MapWebhooksReplaceVariablesAndTextRequestBody = any;

export type MapWebhooksReplaceVariablesAndTextReturns = MessageOptions;

/**
 * Member has permissions.
 *
 * @since 1.0.0
 */
export type MemberHasPermissionsMember = GuildMember;

export type MemberHasPermissionsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type MemberHasPermissionsAllowedRole = ConfigRole | undefined;

export type MemberHasPermissionsAllowedRoles = MemberHasPermissionsAllowedRole[] | undefined;

export type MemberHasPermissionsReturns = boolean;

/**
 * Message copiers.
 *
 * @since 1.0.0
 */
export type MessageCopiersMessage = Message;

export type MessageCopiersTwitterClient = TwitterApi | undefined;

export type MessageCopiersEventName = string | undefined;

export type MessageCopiersEventRegexPattern = ConfigRegex['pattern'] | undefined;

export type MessageCopiersEventRegexFlags = ConfigRegex['flags'] | undefined;

export type MessageCopiersEventRegex = ConfigRegex | undefined;

export type MessageCopiersEventAllowedUserUserId = ConfigUser['user-id'] | undefined;

export type MessageCopiersEventAllowedUser = ConfigUser | undefined;

export type MessageCopiersEventAllowedUsers = MessageCopiersEventAllowedUser[] | undefined;

export type MessageCopiersEventAllowedChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type MessageCopiersEventAllowedChannel = ConfigChannel | undefined;

export type MessageCopiersEventAllowedChannels = MessageCopiersEventAllowedChannel[] | undefined;

export type MessageCopiersEventDisallowedUserUserId = ConfigUser['user-id'] | undefined;

export type MessageCopiersEventDisallowedUser = ConfigUser | undefined;

export type MessageCopiersEventDisallowedUsers = MessageCopiersEventDisallowedUser[] | undefined;

export type MessageCopiersEventDisallowedChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type MessageCopiersEventDisallowedChannel = ConfigChannel | undefined;

export type MessageCopiersEventDisallowedChannels = MessageCopiersEventDisallowedChannel[] | undefined;

export type MessageCopiersEventReplacementPattern = ConfigReplacement['pattern'] | undefined;

export type MessageCopiersEventReplacementFlags = ConfigReplacement['flags'] | undefined;

export type MessageCopiersEventReplacementReplaceWith = ConfigReplacement['replace-with'] | undefined;

export type MessageCopiersEventReplacement = ConfigReplacement | undefined;

export type MessageCopiersEventReplacements = MessageCopiersEventReplacement[] | undefined;

export type MessageCopiersEventMessage = string | undefined;

export type MessageCopiersEventIncludeAttachments = boolean | undefined;

export type MessageCopiersEventDestinationDescription = string | undefined;

export type MessageCopiersEventDestinationMethod = 'discord-channel' | 'discord-webhook' | 'twitter-account' | undefined;

export type MessageCopiersEventDestinationChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type MessageCopiersEventDestinationChannel = ConfigChannel | undefined;

export type MessageCopiersEventDestinationWebhookDescription = string | undefined;

export type MessageCopiersEventDestinationWebhookUsername = string | undefined;

export type MessageCopiersEventDestinationWebhookAvatarUrl = string | undefined;

export type MessageCopiersEventDestinationWebhookUrl = `https://discord.com/api/webhooks/${string}/${string}` | undefined;

export type MessageCopiersEventDestinationWebhook = {
  description: MessageCopiersEventDestinationWebhookDescription;
  username: MessageCopiersEventDestinationWebhookUsername;
  'avatar-url': MessageCopiersEventDestinationWebhookAvatarUrl;
  url: MessageCopiersEventDestinationWebhookUrl;
} | undefined;

export type MessageCopiersEventDestination = {
  description: MessageCopiersEventDestinationDescription;
  method: MessageCopiersEventDestinationMethod;
  channel: MessageCopiersEventDestinationChannel;
  webhook: MessageCopiersEventDestinationWebhook;
} | undefined;

export type MessageCopiersEventDestinations = MessageCopiersEventDestination[] | undefined;

export type MessageCopiersEvent = {
  name: MessageCopiersEventName;
  regex: MessageCopiersEventRegex;
  'allowed-users': MessageCopiersEventAllowedUsers;
  'allowed-channels': MessageCopiersEventAllowedChannels;
  'disallowed-users': MessageCopiersEventDisallowedUsers;
  'disallowed-channels': MessageCopiersEventDisallowedChannels;
  replacements: MessageCopiersEventReplacements;
  message: MessageCopiersEventMessage;
  'include-attachments': MessageCopiersEventIncludeAttachments;
  destinations: MessageCopiersEventDestinations;
} | undefined;

export type MessageCopiersEvents = MessageCopiersEvent[] | undefined;

export type MessageCopiersReturns = void;

/**
 * Message copiers - Replace text and variables.
 *
 * @since 1.0.0
 */
export type MessageCopiersReplaceTextAndVariablesEventName = string;

export type MessageCopiersReplaceTextAndVariablesEventKey = number;

export type MessageCopiersReplaceTextAndVariablesEventReplacements = MessageCopiersEventReplacements;

export type MessageCopiersReplaceTextAndVariablesEventMessage = MessageCopiersEventMessage;

export type MessageCopiersReplaceTextAndVariablesOriginalMessageContent = string;

export type MessageCopiersReplaceTextAndVariablesReturns = string;

/**
 * Message copiers - Send to destinations.
 *
 * @since 1.0.0
 */
export type MessageCopiersSendToDestinationsEventName = string;

export type MessageCopiersSendToDestinationsEventKey = number;

export type MessageCopiersSendToDestinationsEventIncludeAttachments = MessageCopiersEventIncludeAttachments;

export type MessageCopiersSendToDestinationsEventDestinations = MessageCopiersEventDestination[];

export type MessageCopiersSendToDestinationsModifiedMessageContent = string;

export type MessageCopiersSendToDestinationsOriginalMessageAttachments = MessageAttachment[];

export type MessageCopiersSendToDestinationsReturns = void;

/**
 * Regex rules.
 *
 * @since 1.0.0
 */
export type RegexRulesMessage = Message;

export type RegexRulesEventName = string | undefined;

export type RegexRulesEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type RegexRulesEventChannel = ConfigChannel | undefined;

export type RegexRulesEventMatch = boolean | undefined;

export type RegexRulesEventRegexPattern = ConfigRegex['pattern'] | undefined;

export type RegexRulesEventRegexFlags = ConfigRegex['flags'] | undefined;

export type RegexRulesEventRegex = ConfigRegex | undefined;

export type RegexRulesEventExcludedRoleRoleId = ConfigRole['role-id'] | undefined;

export type RegexRulesEventExcludedRole = ConfigRole | undefined;

export type RegexRulesEventExcludedRoles = RegexRulesEventExcludedRole[] | undefined;

export type RegexRulesEventDirectMessagePayload = MessageOptions | undefined;

export type RegexRulesEvent = {
  name: RegexRulesEventName;
  channel: RegexRulesEventChannel;
  match: RegexRulesEventMatch;
  regex: RegexRulesEventRegex;
  'excluded-roles': RegexRulesEventExcludedRoles;
  'direct-message-payload': RegexRulesEventDirectMessagePayload;
} | undefined;

export type RegexRulesEvents = RegexRulesEvent[] | undefined;

export type RegexRulesReturns = void;

/**
 * Remove affiliates.
 *
 * @since 1.0.0
 */
export type RemoveAffiliatesMessage = Message;

export type RemoveAffiliatesSettingsPlatformPlatform = string | undefined;

export type RemoveAffiliatesSettingsPlatformRegexPattern = ConfigRegex['pattern'] | undefined;

export type RemoveAffiliatesSettingsPlatformRegexFlags = ConfigRegex['flags'] | undefined;

export type RemoveAffiliatesSettingsPlatformRegex = ConfigRegex | undefined;

export type RemoveAffiliatesSettingsPlatform = {
  platform: RemoveAffiliatesSettingsPlatformPlatform;
  regex: RemoveAffiliatesSettingsPlatformRegex;
} | undefined;

export type RemoveAffiliatesSettingsPlatforms = RemoveAffiliatesSettingsPlatform[] | undefined;

export type RemoveAffiliatesSettingsExcludedRoleRoleId = ConfigRole['role-id'] | undefined;

export type RemoveAffiliatesSettingsExcludedRole = ConfigRole | undefined;

export type RemoveAffiliatesSettingsExcludedRoles = RemoveAffiliatesSettingsExcludedRole[] | undefined;

export type RemoveAffiliatesSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type RemoveAffiliatesSettingsChannel = ConfigChannel | undefined;

export type RemoveAffiliatesSettingsDirectMessagePayload = MessageOptions | undefined;

export type RemoveAffiliatesSettings = {
  platforms: RemoveAffiliatesSettingsPlatforms;
  'excluded-roles': RemoveAffiliatesSettingsExcludedRoles;
  channel: RemoveAffiliatesSettingsChannel;
  'direct-message-payload': RemoveAffiliatesSettingsDirectMessagePayload;
} | undefined;

export type RemoveAffiliatesReturns = void;

/**
 * Role change.
 *
 * @since 1.0.0
 */
export type RoleChangeOldMember = GuildMember;

export type RoleChangeNewMember = GuildMember;

export type RoleChangeGuild = Guild;

export type RoleChangeSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type RoleChangeSettingsChannel = ConfigChannel | undefined;

export type RoleChangeSettings = {
  channel: RoleChangeSettingsChannel;
} | undefined;

export type RoleChangeReturns = void;

/**
 * Role manager.
 *
 * @since 1.0.0
 */
export type RoleManagerMessage = Message;

export type RoleManagerSettingsBaseCommand = string | undefined;

export type RoleManagerSettingsBaseCommands = RoleManagerSettingsBaseCommand[] | undefined;

export type RoleManagerSettingsDeleteMessage = boolean | undefined;

export type RoleManagerSettingsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type RoleManagerSettingsAllowedRole = ConfigRole | undefined;

export type RoleManagerSettingsAllowedRoles = RoleManagerSettingsAllowedRole[] | undefined;

export type RoleManagerSettings = {
  'base-commands': RoleManagerSettingsBaseCommands;
  'delete-message': RoleManagerSettingsDeleteMessage;
  'allowed-roles': RoleManagerSettingsAllowedRoles;
} | undefined;

export type RoleManagerReturns = void;

export type RoleManagerCommandRoute = 'add' | 'remove' | '';

export type RoleManagerCommandSelection = 'everyone' | RoleMention | 'no-role' | '';

export type RoleManagerCommandAction = RoleMention | '';

/**
 * Role messages.
 *
 * @since 1.0.0
 */
export type RoleMessagesOldMember = GuildMember;

export type RoleMessagesNewMember = GuildMember;

export type RoleMessagesGuild = Guild;

export type RoleMessagesEventName = string | undefined;

export type RoleMessagesEventRoleRoleId = ConfigRole['role-id'] | undefined;

export type RoleMessagesEventRole = ConfigRole | undefined;

export type RoleMessagesEventDirection = 'add' | 'remove' | undefined;

export type RoleMessagesEventPayload = MessageOptions | undefined;

export type RoleMessagesEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type RoleMessagesEventChannel = ConfigChannel | undefined;

export type RoleMessagesEvent = {
  name: RoleMessagesEventName;
  role: RoleMessagesEventRole;
  direction: RoleMessagesEventDirection;
  payload: RoleMessagesEventPayload;
  channel: RoleMessagesEventChannel;
} | undefined;

export type RoleMessagesEvents = RoleMessagesEvent[] | undefined;

export type RoleMessagesReturns = void;

/**
 * Role messages - Replace variables.
 *
 * @since 1.0.0
 */
export type RoleMessagesReplaceVariablesConfigPayload = MessageOptions;

export type RoleMessagesReplaceVariablesReturns = MessageOptions;

/**
 * Rss feeds.
 *
 * @since 1.0.0
 */
export type RssFeedsGuild = Guild;

export type RssFeedsEventName = string | undefined;

export type RssFeedsEventUrl = string | undefined;

export type RssFeedsEventUserAgent = string | undefined;

export type RssFeedsEventFollowRedirects = boolean | undefined;

export type RssFeedsEventRemoveParameters = boolean | undefined;

export type RssFeedsEventPayload = MessageOptions | undefined;

export type RssFeedsEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type RssFeedsEventChannel = ConfigChannel | undefined;

export type RssFeedsEventFetchOnTimeZone = string | undefined;

export type RssFeedsEventFetchOnDayOfWeek = number | undefined;

export type RssFeedsEventFetchOnDaysOfWeek = RssFeedsEventFetchOnDayOfWeek[] | undefined;

export type RssFeedsEventFetchOnMonth = number | undefined;

export type RssFeedsEventFetchOnMonths = RssFeedsEventFetchOnMonth[] | undefined;

export type RssFeedsEventFetchOnDate = number | undefined;

export type RssFeedsEventFetchOnDates = RssFeedsEventFetchOnDate[] | undefined;

export type RssFeedsEventFetchOnHour = number | undefined;

export type RssFeedsEventFetchOnHours = RssFeedsEventFetchOnHour[] | undefined;

export type RssFeedsEventFetchOnMinute = number | undefined;

export type RssFeedsEventFetchOnMinutes = RssFeedsEventFetchOnMinute[] | undefined;

export type RssFeedsEventFetchOnSecond = number | undefined;

export type RssFeedsEventFetchOnSeconds = RssFeedsEventFetchOnSecond[] | undefined;

export type RssFeedsEventFetchOn = {
  'time-zone': RssFeedsEventFetchOnTimeZone;
  'days-of-week': RssFeedsEventFetchOnDaysOfWeek;
  months: RssFeedsEventFetchOnMonths;
  dates: RssFeedsEventFetchOnDates;
  hours: RssFeedsEventFetchOnHours;
  minutes: RssFeedsEventFetchOnMinutes;
  seconds: RssFeedsEventFetchOnSeconds;
} | undefined;

export type RssFeedsEvent = {
  name: RssFeedsEventName;
  url: RssFeedsEventUrl;
  'user-agent': RssFeedsEventUserAgent;
  'follow-redirects': RssFeedsEventFollowRedirects;
  'remove-parameters': RssFeedsEventRemoveParameters;
  payload: RssFeedsEventPayload;
  channel: RssFeedsEventChannel;
  'fetch-on': RssFeedsEventFetchOn;
} | undefined;

export type RssFeedsEvents = RssFeedsEvent[] | undefined;

export type RssFeedsReturns = void;

/**
 * Rss feeds - Remove parameters.
 *
 * @since 1.0.0
 */
export type RssFeedsRemoveParametersItemLink = string | undefined;

export type RssFeedsRemoveParametersReturns = string | undefined;

/**
 * Rss feeds - Replace variables.
 *
 * @since 1.0.0
 */
export type RssFeedsReplaceVariablesConfigPayload = MessageOptions;

export type RssFeedsReplaceVariablesItemLink = string | undefined;

export type RssFeedsReplaceVariablesItemTitle = string | undefined;

export type RssFeedsReplaceVariablesReturns = MessageOptions;

/**
 * Schedule posts.
 *
 * @since 1.0.0
 */
export type SchedulePostsGuild = Guild;

export type SchedulePostsEventName = string | undefined;

export type SchedulePostsEventPayload = MessageOptions | undefined;

export type SchedulePostsEventReaction = EmojiIdentifierResolvable | undefined;

export type SchedulePostsEventReactions = SchedulePostsEventReaction[] | undefined;

export type SchedulePostsEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type SchedulePostsEventChannel = ConfigChannel | undefined;

export type SchedulePostsEventSendOnTimeZone = string | undefined;

export type SchedulePostsEventSendOnDayOfWeek = number | undefined;

export type SchedulePostsEventSendOnDaysOfWeek = SchedulePostsEventSendOnDayOfWeek[] | undefined;

export type SchedulePostsEventSendOnMonth = number | undefined;

export type SchedulePostsEventSendOnMonths = SchedulePostsEventSendOnMonth[] | undefined;

export type SchedulePostsEventSendOnDate = number | undefined;

export type SchedulePostsEventSendOnDates = SchedulePostsEventSendOnDate[] | undefined;

export type SchedulePostsEventSendOnHour = number | undefined;

export type SchedulePostsEventSendOnHours = SchedulePostsEventSendOnHour[] | undefined;

export type SchedulePostsEventSendOnMinute = number | undefined;

export type SchedulePostsEventSendOnMinutes = SchedulePostsEventSendOnMinute[] | undefined;

export type SchedulePostsEventSendOnSecond = number | undefined;

export type SchedulePostsEventSendOnSeconds = SchedulePostsEventSendOnSecond[] | undefined;

export type SchedulePostsEventSendOn = {
  'time-zone': SchedulePostsEventSendOnTimeZone;
  'days-of-week': SchedulePostsEventSendOnDaysOfWeek;
  months: SchedulePostsEventSendOnMonths;
  dates: SchedulePostsEventSendOnDates;
  hours: SchedulePostsEventSendOnHours;
  minutes: SchedulePostsEventSendOnMinutes;
  seconds: SchedulePostsEventSendOnSeconds;
} | undefined;

export type SchedulePostsEventSkipDate = string | undefined;

export type SchedulePostsEventSkipDates = SchedulePostsEventSkipDate[] | undefined;

export type SchedulePostsEvent = {
  name: SchedulePostsEventName;
  payload: SchedulePostsEventPayload;
  reactions: SchedulePostsEventReactions;
  channel: SchedulePostsEventChannel;
  'send-on': SchedulePostsEventSendOn;
  'skip-dates': SchedulePostsEventSkipDates;
} | undefined;

export type SchedulePostsEvents = SchedulePostsEvent[] | undefined;

export type SchedulePostsReturns = void;

/**
 * Schedule posts - Replace variables.
 *
 * @since 1.0.0
 */
export type SchedulePostsReplaceVariablesConfigPayload = MessageOptions;

export type SchedulePostsReplaceVariablesReturns = MessageOptions;

/**
 * Settings.
 *
 * @since 1.0.0
 */
export type SettingsDiscordToken = CredentialLike | undefined;

export type SettingsDiscordGuildGuildId = ConfigGuild['guild-id'] | undefined;

export type SettingsTwitterApiKey = CredentialLike | undefined;

export type SettingsTwitterApiKeySecret = CredentialLike | undefined;

export type SettingsTwitterAccessToken = CredentialLike | undefined;

export type SettingsTwitterAccessTokenSecret = CredentialLike | undefined;

export type SettingsTwitter = {
  'api-key': SettingsTwitterApiKey;
  'api-key-secret': SettingsTwitterApiKeySecret;
  'access-token': SettingsTwitterAccessToken;
  'access-token-secret': SettingsTwitterAccessTokenSecret;
} | undefined;

export type SettingsTimeZone = TimeZone | undefined;

export type SettingsLogLevel = LogLevel | undefined;

/**
 * Show error message.
 *
 * @since 1.0.0
 */
export type ShowErrorMessageErrorMessage = string;

export type ShowErrorMessageMessage = Message;

export type ShowErrorMessageUserTag = string;

export type ShowErrorMessageChannel = TextBasedChannel;

export type ShowErrorMessageReturns = void;

/**
 * Show no permissions message.
 *
 * @since 1.0.0
 */
export type ShowNoPermissionsMessageBaseCommand = string;

export type ShowNoPermissionsMessageMessage = Message;

export type ShowNoPermissionsMessageUserTag = string;

export type ShowNoPermissionsMessageChannel = TextBasedChannel;

export type ShowNoPermissionsMessageReturns = void;

/**
 * Show no results message.
 *
 * @since 1.0.0
 */
export type ShowNoResultsMessageReason = string;

export type ShowNoResultsMessageDeleteMessage = boolean | undefined;

export type ShowNoResultsMessageMessage = Message;

export type ShowNoResultsMessageUserTag = string;

export type ShowNoResultsMessageChannel = TextBasedChannel;

export type ShowNoResultsMessageReturns = void;

/**
 * Split string chunks.
 *
 * @since 1.0.0
 */
export type SplitStringChunksOriginalString = string;

export type SplitStringChunksMaxSize = number;

export type SplitStringChunksReturns = string[];

/**
 * Stocktwits trending.
 *
 * @since 1.0.0
 */
export type StocktwitsTrendingMessage = Message | undefined;

export type StocktwitsTrendingGuild = Guild;

export type StocktwitsTrendingSettingsSettingsLimit = number | undefined;

export type StocktwitsTrendingSettingsSettings = {
  limit: StocktwitsTrendingSettingsSettingsLimit;
} | undefined;

export type StocktwitsTrendingSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type StocktwitsTrendingSettingsChannel = ConfigChannel | undefined;

export type StocktwitsTrendingSettingsCommandBaseCommand = string | undefined;

export type StocktwitsTrendingSettingsCommandBaseCommands = StocktwitsTrendingSettingsCommandBaseCommand[] | undefined;

export type StocktwitsTrendingSettingsCommandAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type StocktwitsTrendingSettingsCommandAllowedRole = ConfigRole | undefined;

export type StocktwitsTrendingSettingsCommandAllowedRoles = StocktwitsTrendingSettingsCommandAllowedRole[] | undefined;

export type StocktwitsTrendingSettingsCommandNoPermsPayload = MessageOptions | undefined;

export type StocktwitsTrendingSettingsCommand = {
  'base-commands': StocktwitsTrendingSettingsCommandBaseCommands;
  'allowed-roles': StocktwitsTrendingSettingsCommandAllowedRoles;
  'no-perms-payload': StocktwitsTrendingSettingsCommandNoPermsPayload;
} | undefined;

export type StocktwitsTrendingSettings = {
  settings: StocktwitsTrendingSettingsSettings;
  channel: StocktwitsTrendingSettingsChannel;
  command: StocktwitsTrendingSettingsCommand;
} | undefined;

export type StocktwitsTrendingReturns = void;

/**
 * Stocktwits trending - Replace variables.
 *
 * @since 1.0.0
 */
export type StocktwitsTrendingReplaceVariablesConfigPayload = MessageOptions;

export type StocktwitsTrendingReplaceVariablesReturns = MessageOptions;

/**
 * Sync roles.
 *
 * @since 1.0.0
 */
export type SyncRolesMember = GuildMember;

export type SyncRolesGuild = Guild;

export type SyncRolesSettingsTimeout = number | undefined;

export type SyncRolesSettingsEventName = string | undefined;

export type SyncRolesSettingsEventSomeRoleRoleId = ConfigRole['role-id'] | undefined;

export type SyncRolesSettingsEventSomeRole = ConfigRole | undefined;

export type SyncRolesSettingsEventSomeRoles = SyncRolesSettingsEventSomeRole[] | undefined;

export type SyncRolesSettingsEventHasSomeRoles = boolean | undefined;

export type SyncRolesSettingsEventToAddRoleRoleId = ConfigRole['role-id'] | undefined

export type SyncRolesSettingsEventToAddRole = ConfigRole | undefined;

export type SyncRolesSettingsEventToAddRoles = SyncRolesSettingsEventToAddRole[] | undefined;

export type SyncRolesSettingsEventToRemoveRoleRoleId = ConfigRole['role-id'] | undefined;

export type SyncRolesSettingsEventToRemoveRole = ConfigRole | undefined;

export type SyncRolesSettingsEventToRemoveRoles = SyncRolesSettingsEventToRemoveRole[] | undefined;

export type SyncRolesSettingsEvent = {
  name: SyncRolesSettingsEventName;
  'some-roles': SyncRolesSettingsEventSomeRoles;
  'has-some-roles': SyncRolesSettingsEventHasSomeRoles;
  'to-add-roles': SyncRolesSettingsEventToAddRoles;
  'to-remove-roles': SyncRolesSettingsEventToRemoveRoles;
} | undefined;

export type SyncRolesSettingsEvents = SyncRolesSettingsEvent[] | undefined;

export type SyncRolesSettings = {
  timeout: SyncRolesSettingsTimeout;
  events: SyncRolesSettingsEvents;
} | undefined;

export type SyncRolesReturns = void;

/**
 * Toggle perms.
 *
 * @since 1.0.0
 */
export type TogglePermsMessage = Message | undefined;

export type TogglePermsGuild = Guild;

export type TogglePermsEventName = string | undefined;

export type TogglePermsEventCommandBaseCommand = string | undefined;

export type TogglePermsEventCommandBaseCommands = TogglePermsEventCommandBaseCommand[] | undefined;

export type TogglePermsEventCommandAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type TogglePermsEventCommandAllowedRole = ConfigRole | undefined;

export type TogglePermsEventCommandAllowedRoles = TogglePermsEventCommandAllowedRole[] | undefined;

export type TogglePermsEventCommand = {
  'base-commands': TogglePermsEventCommandBaseCommands;
  'allowed-roles': TogglePermsEventCommandAllowedRoles;
} | undefined;

export type TogglePermsEventToggleOnTimeZone = string | undefined;

export type TogglePermsEventToggleOnDayOfWeek = number | undefined;

export type TogglePermsEventToggleOnDaysOfWeek = TogglePermsEventToggleOnDayOfWeek[] | undefined;

export type TogglePermsEventToggleOnMonth = number | undefined;

export type TogglePermsEventToggleOnMonths = TogglePermsEventToggleOnMonth[] | undefined;

export type TogglePermsEventToggleOnDate = number | undefined;

export type TogglePermsEventToggleOnDates = TogglePermsEventToggleOnDate[] | undefined;

export type TogglePermsEventToggleOnHour = number | undefined;

export type TogglePermsEventToggleOnHours = TogglePermsEventToggleOnHour[] | undefined;

export type TogglePermsEventToggleOnMinute = number | undefined;

export type TogglePermsEventToggleOnMinutes = TogglePermsEventToggleOnMinute[] | undefined;

export type TogglePermsEventToggleOnSecond = number | undefined;

export type TogglePermsEventToggleOnSeconds = TogglePermsEventToggleOnSecond[] | undefined;

export type TogglePermsEventToggleOn = {
  'time-zone': TogglePermsEventToggleOnTimeZone;
  'days-of-week': TogglePermsEventToggleOnDaysOfWeek;
  months: TogglePermsEventToggleOnMonths;
  dates: TogglePermsEventToggleOnDates;
  hours: TogglePermsEventToggleOnHours;
  minutes: TogglePermsEventToggleOnMinutes;
  seconds: TogglePermsEventToggleOnSeconds;
} | undefined;

export type TogglePermsEventSkipDate = string | undefined;

export type TogglePermsEventSkipDates = TogglePermsEventSkipDate[] | undefined;

export type TogglePermsEventToggleDescription = string | undefined;

export type TogglePermsEventToggleChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type TogglePermsEventToggleChannel = ConfigChannel | undefined;

export type TogglePermsEventTogglePermissionDescription = string | undefined;

export type TogglePermsEventTogglePermissionUserOrRoleId = Snowflake | undefined;

export type TogglePermsEventTogglePermissionUserOrRolePerms = PermissionOverwriteOptions | undefined;

export type TogglePermsEventTogglePermission = {
  description: TogglePermsEventTogglePermissionDescription;
  'user-or-role-id': TogglePermsEventTogglePermissionUserOrRoleId;
  'user-or-role-perms': TogglePermsEventTogglePermissionUserOrRolePerms;
} | undefined;

export type TogglePermsEventTogglePermissions = TogglePermsEventTogglePermission[] | undefined;

export type TogglePermsEventToggle = {
  description: TogglePermsEventToggleDescription;
  channel: TogglePermsEventToggleChannel;
  permissions: TogglePermsEventTogglePermissions;
} | undefined;

export type TogglePermsEventToggles = TogglePermsEventToggle[] | undefined;

export type TogglePermsEvent = {
  name: TogglePermsEventName;
  command: TogglePermsEventCommand;
  'toggle-on': TogglePermsEventToggleOn;
  'skip-dates': TogglePermsEventSkipDates;
  toggles: TogglePermsEventToggles;
} | undefined;

export type TogglePermsEvents = TogglePermsEvent[] | undefined;

export type TogglePermsReturns = void;

/**
 * Toggle perms - Toggler.
 *
 * @since 1.0.0
 */
export type TogglePermsTogglerEventName = string;

export type TogglePermsTogglerEventKey = number;

export type TogglePermsTogglerEventToggles = TogglePermsEventToggles;

export type TogglePermsTogglerUserTag = string;

export type TogglePermsTogglerReturns = Promise<boolean | (boolean | boolean[])[]>;

/**
 * Track message.
 *
 * @since 1.0.0
 */
export type TrackMessageMessage = Message;

export type TrackMessageReturns = MemoryTrackedMessages;

/**
 * Track message is duplicate.
 *
 * @since 1.0.0
 */
export type TrackMessageIsDuplicateTrackedMessages = TrackedMessages;

export type TrackMessageIsDuplicateReturns = boolean;

/**
 * Track route.
 *
 * @since 1.0.0
 */
export type TrackRouteServerPath = string;

export type TrackRouteServerMethod = 'GET' | 'POST';

export type TrackRouteReturns = MemoryTrackedRoutes;

/**
 * Track route is tracked.
 *
 * @since 1.0.0
 */
export type TrackRouteIsTrackedServerPath = string;

export type TrackRouteIsTrackedServerMethod = 'GET' | 'POST';

export type TrackRouteIsTrackedReturns = boolean;

/**
 * Twitter feeds.
 *
 * @since 1.0.0
 */
export type TwitterFeedsTwitterClient = TwitterApi | undefined;

export type TwitterFeedsGuild = Guild;

export type TwitterFeedsEventName = string | undefined;

export type TwitterFeedsEventTwitterId = string | undefined;

export type TwitterFeedsEventExcludeRetweets = boolean | undefined;

export type TwitterFeedsEventExcludeReplies = boolean | undefined;

export type TwitterFeedsEventPayload = MessageOptions | undefined;

export type TwitterFeedsEventChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type TwitterFeedsEventChannel = ConfigChannel | undefined;

export type TwitterFeedsEvent = {
  name: TwitterFeedsEventName;
  'twitter-id': TwitterFeedsEventTwitterId;
  'exclude-retweets': TwitterFeedsEventExcludeRetweets;
  'exclude-replies': TwitterFeedsEventExcludeReplies;
  payload: TwitterFeedsEventPayload;
  channel: TwitterFeedsEventChannel;
} | undefined;

export type TwitterFeedsEvents = TwitterFeedsEvent[] | undefined;

export type TwitterFeedsReturns = void;

/**
 * Twitter feeds - Replace variables.
 *
 * @since 1.0.0
 */
export type TwitterFeedsReplaceVariablesConfigPayload = MessageOptions;

export type TwitterFeedsReplaceVariablesTweetLink = string;

export type TwitterFeedsReplaceVariablesReturns = MessageOptions;

/**
 * Twitter feeds - Stream.
 *
 * @since 1.0.0
 */
export type TwitterFeedsStreamEventName = string;

export type TwitterFeedsStreamEventTwitterId = string;

export type TwitterFeedsStreamEventExcludeRetweets = boolean | undefined;

export type TwitterFeedsStreamEventExcludeReplies = boolean | undefined;

export type TwitterFeedsStreamEventPayload = MessageOptions | undefined;

export type TwitterFeedsStreamChannel = NewsChannel | TextChannel | ThreadChannel;

export type TwitterFeedsStreamStartTime = number;

export type TwitterFeedsStreamReturns = void;

/**
 * Update message.
 *
 * @since 1.0.0
 */
export type UpdateMessageMessage = Message;

export type UpdateMessageGuild = Guild;

export type UpdateMessageSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type UpdateMessageSettingsChannel = ConfigChannel | undefined;

export type UpdateMessageSettings = {
  channel: UpdateMessageSettingsChannel;
} | undefined;

export type UpdateMessageReturns = void;

/**
 * Upload attachment.
 *
 * @since 1.0.0
 */
export type UploadAttachmentMessage = Message;

export type UploadAttachmentGuild = Guild;

export type UploadAttachmentSettingsChannelChannelId = ConfigChannel['channel-id'] | undefined;

export type UploadAttachmentSettingsChannel = ConfigChannel | undefined;

export type UploadAttachmentSettings = {
  channel: UploadAttachmentSettingsChannel;
} | undefined;

export type UploadAttachmentReturns = void;

/**
 * Voice tools.
 *
 * @since 1.0.0
 */
export type VoiceToolsMessage = Message;

export type VoiceToolsSettingsBaseCommand = string | undefined;

export type VoiceToolsSettingsBaseCommands = VoiceToolsSettingsBaseCommand[] | undefined;

export type VoiceToolsSettingsDeleteMessage = boolean | undefined;

export type VoiceToolsSettingsAllowedRoleRoleId = ConfigRole['role-id'] | undefined;

export type VoiceToolsSettingsAllowedRole = ConfigRole | undefined;

export type VoiceToolsSettingsAllowedRoles = VoiceToolsSettingsAllowedRole[] | undefined;

export type VoiceToolsSettings = {
  'base-commands': VoiceToolsSettingsBaseCommands;
  'delete-message': VoiceToolsSettingsDeleteMessage;
  'allowed-roles': VoiceToolsSettingsAllowedRoles;
} | undefined;

export type VoiceToolsReturns = void;

export type VoiceToolsCommandRoute = 'disconnect' | 'unmute' | '';

export type VoiceToolsCommandAction = ChannelMention | '';

/**
 * Web applications setup.
 *
 * @since 1.0.0
 */
export type WebApplicationsSetupGuild = Guild;

export type WebApplicationsSetupSettingsHttpServerPort = number | undefined;

export type WebApplicationsSetupSettingsHttpServer = {
  port: WebApplicationsSetupSettingsHttpServerPort;
} | undefined;

export type WebApplicationsSetupSettingsHttpsServerPort = number | undefined;

export type WebApplicationsSetupSettingsHttpsServerKey = string | undefined;

export type WebApplicationsSetupSettingsHttpsServerCert = string | undefined;

export type WebApplicationsSetupSettingsHttpsServerCa = string | undefined;

export type WebApplicationsSetupSettingsHttpsServer = {
  port: WebApplicationsSetupSettingsHttpsServerPort;
  key: WebApplicationsSetupSettingsHttpsServerKey;
  cert: WebApplicationsSetupSettingsHttpsServerCert;
  ca: WebApplicationsSetupSettingsHttpsServerCa;
} | undefined;

export type WebApplicationsSetupSettingsInviteGenerator = InviteGeneratorSettings | undefined;

export type WebApplicationsSetupSettingsMapWebhooks = MapWebhooksEvents | undefined;

export type WebApplicationsSetupSettings = {
  'http-server': WebApplicationsSetupSettingsHttpServer;
  'https-server': WebApplicationsSetupSettingsHttpsServer;
  'invite-generator': WebApplicationsSetupSettingsInviteGenerator;
  'map-webhooks': WebApplicationsSetupSettingsMapWebhooks;
} | undefined;

export type WebApplicationsSetupReturns = void;

/**
 * Web applications setup - HTTP server.
 *
 * @since 1.0.0
 */
export type WebApplicationsSetupHttpServerReturns = Promise<boolean>;

/**
 * Web applications setup - HTTPS server.
 *
 * @since 1.0.0
 */
export type WebApplicationsSetupHttpsServerReturns = Promise<boolean>;
