import {
  ChannelMention,
  EmojiIdentifierResolvable,
  MemberMention,
  MessageOptions,
  PermissionOverwriteOptions,
  RoleMention,
  Snowflake,
} from 'discord.js';
import { Recurrence, Timezone } from 'node-schedule';

/**
 * Global types.
 */
export type RegularExpression = {
  pattern: string;
  flags: string;
}

export type RegularExpressionReplacement = {
  pattern: string;
  flags: string;
  'replace-with': string;
};

export type RegularExpressionReplacements = RegularExpressionReplacement[];

export type ReoccurringSchedule = {
  'time-zone': Timezone;
  'days-of-week': Recurrence[];
  hour: Recurrence;
  minute: Recurrence;
  second: Recurrence;
};

export type Role = {
  description?: string;
  id: Snowflake;
}

export type Roles = Role[];

/**
 * Configuration.
 */
export type AffiliateLinksWebsite = {
  website?: string;
  regex: RegularExpression;
};

export type AffiliateLinks = {
  links: AffiliateLinksWebsite[];
  'channel-id': Snowflake;
  'direct-message': string;
  'excluded-roles': Roles;
};

export type AntiRaidAutoBanSettings = {
  avatar?: string[];
  username?: string[];
};

export type AntiRaidMembershipGateSettings = {
  'verified-role-id': Snowflake;
};

export type ChangeRole = {
  name?: string;
  type: 'yes-to-yes' | 'no-to-no' | 'yes-to-no' | 'no-to-yes';
  before: Roles;
  after: Roles;
  'to-add'?: Roles;
  'to-remove'?: Roles;
};

export type ChangeRoles = ChangeRole[];

export type MessageCopier = {
  name?: string;
  'channel-id': Snowflake;
  regex: RegularExpression;
  replacements: RegularExpressionReplacements;
  format: string;
  'allowed-users'?: Snowflake[];
  'allowed-channels'?: Snowflake[];
};

export type MessageCopiers = MessageCopier[];

export type RegexRule = {
  name?: string;
  'channel-id': Snowflake;
  regex: RegularExpression;
  'direct-message': string;
  'exclude-roles': Roles;
};

export type RegexRules = RegexRule[];

export type Reply = {
  name?: string;
  'channel-ids'?: Snowflake[];
  reply: boolean;
  regex: RegularExpression;
  messages: string[];
};

export type Replies = Reply[];

export type RssFeed = {
  name?: string;
  'channel-id': Snowflake;
  interval?: string;
  url: string;
  message: string;
};

export type SchedulePost = {
  name?: string;
  'channel-id': Snowflake;
  message: MessageOptions;
  reactions?: EmojiIdentifierResolvable[];
  'send-every': ReoccurringSchedule;
  'skip-days': string[];
};

export type Stocktwit = {
  name?: string;
  'channel-id': Snowflake;
  message?: string;
  'show-embed': boolean;
  limit: number;
  'send-every': ReoccurringSchedule;
  'skip-days': string[];
};

export type SuspiciousWordsCategory = {
  category?: string;
  words?: string[];
};

export type SuspiciousWords = {
  'channel-id': Snowflake;
  categories: SuspiciousWordsCategory[];
};

export type TogglePermsSettingUser = {
  description?: string;
  'user-or-role-id': Snowflake;
  'user-or-role-perms': PermissionOverwriteOptions;
};

export type TogglePermsSettingChannel = {
  description?: string;
  'channel-id': Snowflake;
  'channel-perms': TogglePermsSettingUser[];
};

export type TogglePermsSetting = {
  name: string;
  id: string;
  on: TogglePermsSettingChannel[];
  off: TogglePermsSettingChannel[];
};

export type TogglePermsSettings = TogglePermsSetting[];

/**
 * Miscellaneous.
 */
export type DuplicateUsers = {
  [avatarHash: string]: MemberMention[];
};

export type EmbedStatus = 'complete' | 'fail' | 'in-progress';

export type FetchMembersAction = MemberMention | RoleMention | string;

export type FetchMembersRoute = 'avatar' | 'role' | 'string' | 'username';

export type HelpMenuSettings = {
  fetchMembers?: Roles;
  findDuplicateUsers?: Roles;
  role?: Roles;
  togglePerms?: Roles;
  voice?: Roles;
};

export type LogMessagePriority = 10 | 20 | 30 | 40;

export type MemberMonitorMode = 'join' | 'leave';

export type RoleAction = RoleMention;

export type RoleRoute = 'add' | 'remove';

export type RoleSelection = 'everyone' | 'no-role' | RoleMention;

export type StoredMessage = {
  id: Snowflake;
  content: string;
};

export type StoredMessages = StoredMessage[];

export type TogglePermsGroup = string;

export type TogglePermsToggle = 'on' | 'off';

export type VoiceAction = ChannelMention;

export type VoiceRoute = 'disconnect' | 'unmute';
