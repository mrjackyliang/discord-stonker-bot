import { PermissionFlagsBits } from 'discord.js';
import { z } from 'zod';

import { antiRaidSchema } from './anti-raid-features.js';
import { auditSchema } from './audit-features.js';
import { getFeatureDefinition } from './feature-catalog.js';
import { blankSecretReferences } from './feature-secrets.js';
import {
  broadcastAlertsSchema,
  bumpThreadsSchema,
  roleMessagesSchema,
} from './gateway-features.js';
import { impersonatorAlertsSchema } from './impersonator-features.js';
import {
  affiliateCleanupSchema,
  autoRepliesSchema,
  regexRulesSchema,
  suspiciousWordsSchema,
} from './message-features.js';
import {
  copierSchema,
  proxySchema,
} from './message-routing-features.js';
import { roleSyncSchema } from './role-sync-features.js';
import { scammerAlertsSchema } from './scammer-features.js';
import { serverToolsSchema } from './server-tool-features.js';
import { webApplicationSchema } from './web-application-features.js';
import {
  permissionRulesSchema,
  rssFeedsSchema,
  schedulePostsSchema,
} from './worker-features.js';

import type {
  Lib_FeatureEditor_BuildFeatureEditor_Definition,
  Lib_FeatureEditor_BuildFeatureEditor_Editor,
  Lib_FeatureEditor_BuildFeatureEditor_FeatureKey,
  Lib_FeatureEditor_BuildFeatureEditor_Presentation,
  Lib_FeatureEditor_BuildFeatureEditor_Returns,
  Lib_FeatureEditor_CreateEnumLabel_Override,
  Lib_FeatureEditor_CreateEnumLabel_Returns,
  Lib_FeatureEditor_CreateEnumLabel_Value,
  Lib_FeatureEditor_CreateItemLabel_Key,
  Lib_FeatureEditor_CreateItemLabel_Label,
  Lib_FeatureEditor_CreateItemLabel_Override,
  Lib_FeatureEditor_CreateItemLabel_Returns,
  Lib_FeatureEditor_CreateLabel_Key,
  Lib_FeatureEditor_CreateLabel_Override,
  Lib_FeatureEditor_CreateLabel_Phrase,
  Lib_FeatureEditor_CreateLabel_Returns,
  Lib_FeatureEditor_CreateSections_Key,
  Lib_FeatureEditor_CreateSections_Keys,
  Lib_FeatureEditor_CreateSections_Node,
  Lib_FeatureEditor_CreateSections_Presentation,
  Lib_FeatureEditor_CreateSections_Properties,
  Lib_FeatureEditor_CreateSections_Returns,
  Lib_FeatureEditor_CreateSections_Section,
  Lib_FeatureEditor_CreateSections_Sections,
  Lib_FeatureEditor_DecorateArray_Context,
  Lib_FeatureEditor_DecorateArray_IdentifierKey,
  Lib_FeatureEditor_DecorateArray_ItemLabel,
  Lib_FeatureEditor_DecorateArray_ItemProperties,
  Lib_FeatureEditor_DecorateArray_Items,
  Lib_FeatureEditor_DecorateArray_Key,
  Lib_FeatureEditor_DecorateArray_ListWidget,
  Lib_FeatureEditor_DecorateArray_Node,
  Lib_FeatureEditor_DecorateArray_ObjectRows,
  Lib_FeatureEditor_DecorateArray_PropertyKeys,
  Lib_FeatureEditor_DecorateArray_Returns,
  Lib_FeatureEditor_DecorateArray_TitleKey,
  Lib_FeatureEditor_DecorateNode_Context,
  Lib_FeatureEditor_DecorateNode_Node,
  Lib_FeatureEditor_DecorateNode_Returns,
  Lib_FeatureEditor_DecorateObject_ChildContext,
  Lib_FeatureEditor_DecorateObject_ChildNode,
  Lib_FeatureEditor_DecorateObject_Context,
  Lib_FeatureEditor_DecorateObject_Description,
  Lib_FeatureEditor_DecorateObject_Entry,
  Lib_FeatureEditor_DecorateObject_EntryKey,
  Lib_FeatureEditor_DecorateObject_EntryValue,
  Lib_FeatureEditor_DecorateObject_Node,
  Lib_FeatureEditor_DecorateObject_OnlyChild,
  Lib_FeatureEditor_DecorateObject_Properties,
  Lib_FeatureEditor_DecorateObject_PropertyKeys,
  Lib_FeatureEditor_DecorateObject_Returns,
  Lib_FeatureEditor_DecorateObject_SectionTitle,
  Lib_FeatureEditor_DecorateScalar_Context,
  Lib_FeatureEditor_DecorateScalar_EnumLabels,
  Lib_FeatureEditor_DecorateScalar_EnumValues,
  Lib_FeatureEditor_DecorateScalar_Format,
  Lib_FeatureEditor_DecorateScalar_Key,
  Lib_FeatureEditor_DecorateScalar_MaxLength,
  Lib_FeatureEditor_DecorateScalar_Node,
  Lib_FeatureEditor_DecorateScalar_Returns,
  Lib_FeatureEditor_DecorateScalar_Type,
  Lib_FeatureEditor_DecorateScalar_Widget,
  Lib_FeatureEditor_DecorateUnion_Context,
  Lib_FeatureEditor_DecorateUnion_Discriminator,
  Lib_FeatureEditor_DecorateUnion_Node,
  Lib_FeatureEditor_DecorateUnion_OptionProperties,
  Lib_FeatureEditor_DecorateUnion_Options,
  Lib_FeatureEditor_DecorateUnion_OptionValue,
  Lib_FeatureEditor_DecorateUnion_Returns,
  Lib_FeatureEditor_DescribedFields,
  Lib_FeatureEditor_DiscordIdentifierWidgets,
  Lib_FeatureEditor_EditorCache,
  Lib_FeatureEditor_EnumLabels,
  Lib_FeatureEditor_FeatureSchemas,
  Lib_FeatureEditor_FeatureVariableTokens,
  Lib_FeatureEditor_FieldLabels,
  Lib_FeatureEditor_FindDiscriminator_Candidate,
  Lib_FeatureEditor_FindDiscriminator_FirstOption,
  Lib_FeatureEditor_FindDiscriminator_FirstProperties,
  Lib_FeatureEditor_FindDiscriminator_Options,
  Lib_FeatureEditor_FindDiscriminator_Returns,
  Lib_FeatureEditor_GetFeatureEditor_Cached,
  Lib_FeatureEditor_GetFeatureEditor_Editor,
  Lib_FeatureEditor_GetFeatureEditor_FeatureKey,
  Lib_FeatureEditor_GetFeatureEditor_Returns,
  Lib_FeatureEditor_GetFeatureExample_Feature,
  Lib_FeatureEditor_GetFeatureExample_FeatureKey,
  Lib_FeatureEditor_GetFeatureExample_Features,
  Lib_FeatureEditor_GetFeatureExample_Returns,
  Lib_FeatureEditor_GetFeatureExample_StarterSettings,
  Lib_FeatureEditor_GetFeatureMessageVariables_FeatureKey,
  Lib_FeatureEditor_GetFeatureMessageVariables_Returns,
  Lib_FeatureEditor_GetFeatureMessageVariables_Tokens,
  Lib_FeatureEditor_GetFeatureSchema_FeatureKey,
  Lib_FeatureEditor_GetFeatureSchema_Returns,
  Lib_FeatureEditor_GetMessageVariables_Returns,
  Lib_FeatureEditor_GetRecord_Key,
  Lib_FeatureEditor_GetRecord_Node,
  Lib_FeatureEditor_GetRecord_Returns,
  Lib_FeatureEditor_GetRecord_Value,
  Lib_FeatureEditor_GetRecordList_Key,
  Lib_FeatureEditor_GetRecordList_Node,
  Lib_FeatureEditor_GetRecordList_Returns,
  Lib_FeatureEditor_GetRecordList_Value,
  Lib_FeatureEditor_IgnoredFeatureFields,
  Lib_FeatureEditor_IgnoredFields,
  Lib_FeatureEditor_IsRecord_Record,
  Lib_FeatureEditor_IsRecord_Value,
  Lib_FeatureEditor_ItemLabels,
  Lib_FeatureEditor_ItemTitleKeys,
  Lib_FeatureEditor_PermissionNames,
  Lib_FeatureEditor_Presentations,
  Lib_FeatureEditor_TemplateVariables,
  Lib_FeatureEditor_VariableFields,
} from '../types/lib/feature-editor.d.ts';

/**
 * Feature Editor - Feature Schemas.
 *
 * Points every catalog feature at the zod schema its runtime compiler parses.
 * The editor and save validation read the same rules the bot enforces.
 *
 * @since 4.0.0
 */
const featureSchemas: Lib_FeatureEditor_FeatureSchemas = {
  'anti-raid': antiRaidSchema,
  'auto-replies': autoRepliesSchema,
  'broadcast-alerts': broadcastAlertsSchema,
  'bump-threads': bumpThreadsSchema,
  'detect-suspicious-words': suspiciousWordsSchema,
  'impersonator-alerts': impersonatorAlertsSchema,
  'message-copiers': copierSchema,
  'message-proxies': proxySchema,
  'regex-rules': regexRulesSchema,
  'remove-affiliates': affiliateCleanupSchema,
  'role-messages': roleMessagesSchema,
  'rss-feeds': rssFeedsSchema,
  'scammer-alerts': scammerAlertsSchema,
  'schedule-posts': schedulePostsSchema,
  'server-tools': serverToolsSchema,
  'snitch': auditSchema,
  'sync-roles': roleSyncSchema,
  'toggle-perms': permissionRulesSchema,
  'web-applications': webApplicationSchema,
};

/**
 * Feature Editor - Field Labels.
 *
 * Translates storage keys into the words the control panel shows next to each field.
 * Keys without an entry fall back to the key in sentence case.
 *
 * @since 4.0.0
 */
const fieldLabels: Lib_FeatureEditor_FieldLabels = {
  'allowed-channels': 'Allowed channels',
  'allowed-roles': 'Who can use it',
  'allowed-urls': 'Allowed item URLs',
  'allowed-users': 'Allowed members',
  'avatar': 'Avatar hash',
  'avatar-url': 'Avatar URL',
  'categories': 'Categories',
  'channel-id': 'Discord channel',
  'content': 'Text',
  'dates': 'Days of the month',
  'days-of-week': 'Days of the week',
  'delete-message': 'Delete the command message',
  'destinations': 'Destinations',
  'direct-message-payload': 'Direct message',
  'disallowed-channels': 'Blocked channels',
  'disallowed-users': 'Blocked members',
  'entity-types': 'Event types',
  'exclude-replies': 'Ignore replies',
  'exclude-retweets': 'Ignore reposts',
  'excluded-links': 'Links to ignore',
  'excluded-roles': 'Roles to ignore',
  'fetch-on': 'Fetch schedule',
  'follow-redirects': 'Follow redirects',
  'footer': 'Footer',
  'has-some-roles': 'Member has one of these roles',
  'include-attachments': 'Include attachments',
  'match': 'Act when the message matches',
  'max-age': 'Invite lifetime (seconds)',
  'max-uses': 'Uses per invite',
  'message': 'Message template',
  'method': 'Send to',
  'no-perms-payload': 'Permission denied message',
  'options': 'Invite options',
  'payload': 'Message',
  'payloads': 'Messages',
  'permissions': 'Permission overrides',
  'print-payload': 'Show the submitted message',
  'reactions': 'Reactions',
  'recaptcha': 'reCAPTCHA',
  'regex': 'Regular expression',
  'remove-parameters': 'Remove tracking parameters',
  'replace-with': 'Replace with',
  'reply': 'Reply to the message',
  'role-id': 'Discord role',
  'secret-key': 'Secret key',
  'send-on': 'Posting schedule',
  'signing-secret': 'Signing secret',
  'site-key': 'Site key',
  'skip-dates': 'Dates to skip',
  'some-roles': 'Roles to check',
  'target-type': 'Applies to',
  'text': 'Footer text',
  'thread-id': 'Thread ID',
  'time-zone': 'Time zone',
  'to-add-roles': 'Roles to add',
  'to-remove-roles': 'Roles to remove',
  'toggle-on': 'Schedule',
  'toggles': 'Channel changes',
  'user': 'Trusted member',
  'user-agent': 'Request user agent',
  'user-id': 'Discord member ID',
  'user-or-role-id': 'Member or role ID',
  'user-or-role-perms': 'Discord permissions',
  'webhook-url': 'Webhook URL',
  'words': 'Words and phrases',
};

/**
 * Feature Editor - Described Fields.
 *
 * Adds a short hint under fields whose meaning isn't clear from the label alone.
 * Limits such as lengths and ranges already come from the schema.
 *
 * @since 4.0.0
 */
const describedFields: Lib_FeatureEditor_DescribedFields = {
  'avatar': 'The avatar hash from a known raid account\'s profile picture.',
  'days-of-week': '0 is Sunday and 6 is Saturday.',
  'flags': 'Regular expression flags, such as i to ignore letter case.',
  'has-some-roles': 'Turn off to act when the member has none of them.',
  'match': 'Turn off to act on messages that don\'t match.',
  'pattern': 'A JavaScript regular expression.',
  'skip-dates': 'Dates in YYYY-MM-DD format when this doesn\'t run.',
  'time-zone': 'An IANA time zone, such as America/New_York.',
  'user-agent': 'Sent to the feed server with every request.',
};

/**
 * Feature Editor - Enum Labels.
 *
 * Gives fixed choices readable names while the stored values stay unchanged.
 * Values without an entry fall back to the value in sentence case.
 *
 * @since 4.0.0
 */
const enumLabels: Lib_FeatureEditor_EnumLabels = {
  'ACTIVE': 'Started',
  'CANCELED': 'Canceled',
  'COMPLETED': 'Ended',
  'EXTERNAL': 'External',
  'SCHEDULED': 'Scheduled',
  'STAGE_INSTANCE': 'Stage',
  'UPDATED': 'Updated',
  'VOICE': 'Voice',
  'add': 'Role added',
  'boolean': 'True or false',
  'discord-channel': 'Discord channel',
  'discord-webhook': 'Discord webhook',
  'member': 'Member',
  'remove': 'Role removed',
  'role': 'Role',
  'string': 'Text',
  'ts-millis': 'Timestamp in milliseconds',
  'ts-seconds': 'Timestamp in seconds',
  'usd-cents': 'US dollars from cents',
  'usd-dollars': 'US dollars',
};

/**
 * Feature Editor - Item Labels.
 *
 * Names one row of a repeating list, such as "Role" for a list of roles.
 * Top-level lists use the feature's own item label instead.
 *
 * @since 4.0.0
 */
const itemLabels: Lib_FeatureEditor_ItemLabels = {
  'allowed-channels': 'Channel',
  'allowed-roles': 'Role',
  'allowed-users': 'Member',
  'avatars': 'Avatar',
  'categories': 'Category',
  'channels': 'Channel',
  'destinations': 'Destination',
  'disallowed-channels': 'Channel',
  'disallowed-users': 'Member',
  'excluded-links': 'Link',
  'excluded-roles': 'Role',
  'map-webhooks': 'Webhook',
  'payloads': 'Message',
  'permissions': 'Override',
  'platforms': 'Platform',
  'replacements': 'Replacement',
  'roles': 'Role',
  'some-roles': 'Role',
  'to-add-roles': 'Role',
  'to-remove-roles': 'Role',
  'toggles': 'Channel',
  'usernames': 'Username',
  'variables': 'Variable',
};

/**
 * Feature Editor - Item Title Keys.
 *
 * Lists, in order of preference, the row property shown in a repeating row's header.
 * A row without any of them is titled by its position.
 *
 * @since 4.0.0
 */
const itemTitleKeys: Lib_FeatureEditor_ItemTitleKeys = [
  'name',
  'category',
  'platform',
  'username',
  'avatar',
  'path',
  'id',
];

/**
 * Feature Editor - Discord Identifier Widgets.
 *
 * Maps Discord ID fields to the control that picks them: a channel or role picker,
 * or a plain ID box for members, threads, and servers that aren't listed.
 *
 * @since 4.0.0
 */
const discordIdentifierWidgets: Lib_FeatureEditor_DiscordIdentifierWidgets = {
  'channel-id': 'channel',
  'guild-id': 'discord-id',
  'role-id': 'role',
  'thread-id': 'discord-id',
  'user-id': 'discord-id',
  'user-or-role-id': 'discord-id',
};

/**
 * Feature Editor - Variable Fields.
 *
 * Names the message fields that accept %VARIABLES% the bot replaces when it posts.
 * The editor offers insert buttons on these fields only.
 *
 * @since 4.0.0
 */
const variableFields: Lib_FeatureEditor_VariableFields = [
  'content',
  'message',
  'text',
];

/**
 * Feature Editor - Ignored Fields.
 *
 * Names legacy keys the features accept but never read.
 * The form keeps their values without showing them.
 *
 * @since 4.0.0
 */
const ignoredFields: Lib_FeatureEditor_IgnoredFields = ['base-commands'];

/**
 * Feature Editor - Ignored Feature Fields.
 *
 * Hides preserved legacy switches that a specific rewritten feature never reads.
 * Fields with the same name in another feature remain available when they are active.
 *
 * @since 4.0.0
 */
const ignoredFeatureFields: Lib_FeatureEditor_IgnoredFeatureFields = {
  'message-proxies': ['print-payload'],
  'server-tools': ['delete-message'],
};

/**
 * Feature Editor - Template Variables.
 *
 * Lists every message variable with a short description for the insert buttons.
 * The bot replaces each one when it posts the message.
 *
 * @since 4.0.0
 */
const templateVariables: Lib_FeatureEditor_TemplateVariables = [
  {
    description: 'Channel mention',
    token: '%CHANNEL_MENTION%',
  },
  {
    description: 'Channel mention',
    token: '%CHANNEL_TAG%',
  },
  {
    description: 'Event creator',
    token: '%CREATOR_TAG%',
  },
  {
    description: 'Event description',
    token: '%EVENT_DESCRIPTION%',
  },
  {
    description: 'Event name',
    token: '%EVENT_NAME%',
  },
  {
    description: 'Server name',
    token: '%GUILD_NAME%',
  },
  {
    description: 'Item link',
    token: '%ITEM_LINK%',
  },
  {
    description: 'Item title',
    token: '%ITEM_TITLE%',
  },
  {
    description: 'Event location',
    token: '%LOCATION%',
  },
  {
    description: 'Member mention',
    token: '%MEMBER_MENTION%',
  },
  {
    description: 'Member name',
    token: '%MEMBER_TAG%',
  },
  {
    description: 'User mention',
    token: '%MEMBER_USER_MENTION%',
  },
  {
    description: 'Message text',
    token: '%MESSAGE_CONTENT%',
  },
  {
    description: 'Message preview',
    token: '%MESSAGE_EXCERPT%',
  },
  {
    description: 'Message link',
    token: '%MESSAGE_URL%',
  },
  {
    description: 'Scheduled time',
    token: '%SCHEDULED_TIME%',
  },
  {
    description: 'Interested members',
    token: '%USER_COUNT%',
  },
  {
    description: 'Current year',
    token: '%YEAR%',
  },
];

/**
 * Feature Editor - Feature Variable Tokens.
 *
 * Lists only the placeholders each runtime renderer replaces for that feature.
 * Message-looking fields in other features remain ordinary text controls.
 *
 * @since 4.0.0
 */
const featureVariableTokens: Lib_FeatureEditor_FeatureVariableTokens = {
  'anti-raid': [
    '%GUILD_NAME%',
    '%MEMBER_MENTION%',
    '%YEAR%',
  ],
  'broadcast-alerts': [
    '%CHANNEL_TAG%',
    '%CREATOR_TAG%',
    '%EVENT_DESCRIPTION%',
    '%EVENT_NAME%',
    '%LOCATION%',
    '%SCHEDULED_TIME%',
    '%USER_COUNT%',
  ],
  'impersonator-alerts': ['%MEMBER_USER_MENTION%'],
  'message-copiers': [
    '%CHANNEL_MENTION%',
    '%MEMBER_MENTION%',
    '%MEMBER_TAG%',
    '%MESSAGE_CONTENT%',
    '%MESSAGE_EXCERPT%',
    '%MESSAGE_URL%',
  ],
  'message-proxies': ['%YEAR%'],
  'role-messages': [
    '%MEMBER_MENTION%',
    '%YEAR%',
  ],
  'rss-feeds': [
    '%ITEM_LINK%',
    '%ITEM_TITLE%',
  ],
  'scammer-alerts': ['%MEMBER_USER_MENTION%'],
  'schedule-posts': ['%YEAR%'],
  'web-applications': ['%YEAR%'],
};

/**
 * Feature Editor - Presentations.
 *
 * Gives every feature a row name for its lists and titled sections for its top-level parts.
 * Section text explains the outcome instead of repeating the stored key.
 *
 * @since 4.0.0
 */
const presentations: Lib_FeatureEditor_Presentations = {
  'anti-raid': {
    itemLabel: 'Protection',
    sections: [
      {
        description: 'Ban joining members who match a known raid avatar or username, and choose where moderators see each ban.',
        key: 'auto-ban',
        title: 'Raid bans',
      },
      {
        description: 'Welcome new members, give them their entry roles, and route the completed membership check.',
        key: 'membership-gate',
        title: 'New member access',
      },
    ],
  },
  'auto-replies': {
    itemLabel: 'Reply',
    sections: [],
  },
  'broadcast-alerts': {
    itemLabel: 'Alert',
    sections: [],
  },
  'bump-threads': {
    itemLabel: 'Thread',
    sections: [],
  },
  'detect-suspicious-words': {
    itemLabel: 'Category',
    sections: [
      {
        description: 'Send matches to a private moderator channel.',
        key: 'channel',
        title: 'Alert destination',
      },
      {
        description: 'Group related phrases so moderator alerts explain why a message was flagged.',
        key: 'categories',
        title: 'Phrase categories',
      },
    ],
  },
  'impersonator-alerts': {
    itemLabel: 'Identity check',
    sections: [
      {
        description: 'Send possible impersonation matches to this moderator channel.',
        key: 'channel',
        title: 'Alert destination',
      },
      {
        description: 'Describe trusted identities and the suspicious names that imitate them.',
        key: 'entities',
        title: 'Protected identities',
      },
    ],
  },
  'message-copiers': {
    itemLabel: 'Route',
    sections: [],
  },
  'message-proxies': {
    itemLabel: 'Proxy',
    sections: [],
  },
  'regex-rules': {
    itemLabel: 'Rule',
    sections: [],
  },
  'remove-affiliates': {
    itemLabel: 'Platform',
    sections: [
      {
        description: 'Send link-removal alerts to this moderator channel. Links are checked in every channel.',
        key: 'channel',
        title: 'Alert destination',
      },
      {
        description: 'Recognize affiliate and campaign parameters by platform.',
        key: 'platforms',
        title: 'Link patterns',
      },
      {
        description: 'Explain privately why the member should post a clean link.',
        key: 'direct-message-payload',
        title: 'Member notice',
      },
      {
        description: 'Members with any of these roles can post affiliate links.',
        key: 'excluded-roles',
        title: 'Exempt roles',
      },
    ],
  },
  'role-messages': {
    itemLabel: 'Role message',
    sections: [],
  },
  'rss-feeds': {
    itemLabel: 'Feed',
    sections: [],
  },
  'scammer-alerts': {
    itemLabel: 'Scam check',
    sections: [
      {
        description: 'Send likely scam matches to this moderator channel.',
        key: 'channel',
        title: 'Alert destination',
      },
      {
        description: 'Define the language patterns and alert text for each scam type.',
        key: 'entities',
        title: 'Detection rules',
      },
    ],
  },
  'schedule-posts': {
    itemLabel: 'Post',
    sections: [],
  },
  'server-tools': {
    itemLabel: 'Command',
    sections: [
      {
        description: 'Ban up to 25 Discord user IDs at once.',
        key: 'bulk-ban',
        title: 'Bulk ban',
      },
      {
        description: 'Find duplicate display names among cached members.',
        key: 'fetch-duplicates',
        title: 'Duplicate finder',
      },
      {
        description: 'Show a summary of the server\'s emojis.',
        key: 'fetch-emojis',
        title: 'Emoji summary',
      },
      {
        description: 'Show the member count and how many members are cached.',
        key: 'fetch-members',
        title: 'Member count',
      },
      {
        description: 'Add or remove one role for one member.',
        key: 'role-manager',
        title: 'Role manager',
      },
      {
        description: 'Move or disconnect one member in voice.',
        key: 'voice-tools',
        title: 'Voice tools',
      },
    ],
  },
  'snitch': {
    itemLabel: 'Audit event',
    sections: [
      {
        description: 'Report members who join the server.',
        key: 'guild-join',
        title: 'Members joining',
      },
      {
        description: 'Report members who leave the server.',
        key: 'guild-leave',
        title: 'Members leaving',
      },
      {
        description: 'Report nickname changes.',
        key: 'change-nickname',
        title: 'Nickname changes',
      },
      {
        description: 'Report username changes.',
        key: 'change-username',
        title: 'Username changes',
      },
      {
        description: 'Report roles that members gain or lose.',
        key: 'role-change',
        title: 'Role changes',
      },
      {
        description: 'Report edited messages.',
        key: 'update-message',
        title: 'Edited messages',
      },
      {
        description: 'Report deleted messages.',
        key: 'delete-message',
        title: 'Deleted messages',
      },
      {
        description: 'Report messages that contain links, except the ones listed.',
        key: 'includes-link',
        title: 'Messages with links',
      },
      {
        description: 'Report uploaded files.',
        key: 'upload-attachment',
        title: 'Attachments',
      },
    ],
  },
  'sync-roles': {
    itemLabel: 'Workflow',
    sections: [
      {
        description: 'Wait this many seconds before checking role changes.',
        key: 'timeout',
        title: 'Evaluation delay',
      },
      {
        description: 'Add or remove roles when a member matches the conditions below.',
        key: 'events',
        title: 'Role workflows',
      },
    ],
  },
  'toggle-perms': {
    itemLabel: 'Schedule',
    sections: [],
  },
  'web-applications': {
    itemLabel: 'Route',
    sections: [
      {
        description: 'Create limited Discord invites from a protected public page.',
        key: 'invite-generator',
        title: 'Invite page',
      },
      {
        description: 'Verify incoming services, map their fields, and post a Discord message.',
        key: 'map-webhooks',
        title: 'Incoming webhooks',
      },
    ],
  },
};

/**
 * Feature Editor - Permission Names.
 *
 * Lists every Discord permission name the permission toggles accept, sorted for pickers.
 * They come from discord.js, so new Discord permissions appear automatically.
 *
 * @since 4.0.0
 */
const permissionNames: Lib_FeatureEditor_PermissionNames = Object.keys(PermissionFlagsBits).sort();

/**
 * Feature Editor - Editor Cache.
 *
 * Keeps each feature's editor after it is first built.
 * Editors depend only on code, so they never change while the process runs.
 *
 * @since 4.0.0
 */
const editorCache: Lib_FeatureEditor_EditorCache = new Map();

/**
 * Feature Editor - Get Feature Editor.
 *
 * Returns the JSON Schema form description the control panel renders for one feature.
 * Each call gets its own copy, so callers can't change the cached editor.
 *
 * @param {Lib_FeatureEditor_GetFeatureEditor_FeatureKey} featureKey - Feature key.
 *
 * @returns {Lib_FeatureEditor_GetFeatureEditor_Returns}
 *
 * @since 4.0.0
 */
export function getFeatureEditor(featureKey: Lib_FeatureEditor_GetFeatureEditor_FeatureKey): Lib_FeatureEditor_GetFeatureEditor_Returns {
  const cached: Lib_FeatureEditor_GetFeatureEditor_Cached = editorCache.get(featureKey);

  if (cached !== undefined) {
    return structuredClone(cached);
  }

  const editor: Lib_FeatureEditor_GetFeatureEditor_Editor = buildFeatureEditor(featureKey);

  editorCache.set(featureKey, editor);

  return structuredClone(editor);
}

/**
 * Feature Editor - Get Feature Example.
 *
 * Returns one feature's starter settings with every secret emptied, or null without any.
 * The control panel offers it as a starting point for a feature that isn't set up yet.
 *
 * @param {Lib_FeatureEditor_GetFeatureExample_FeatureKey}      featureKey      - Feature key.
 * @param {Lib_FeatureEditor_GetFeatureExample_StarterSettings} starterSettings - Starter settings.
 *
 * @returns {Lib_FeatureEditor_GetFeatureExample_Returns}
 *
 * @since 4.0.0
 */
export function getFeatureExample(featureKey: Lib_FeatureEditor_GetFeatureExample_FeatureKey, starterSettings: Lib_FeatureEditor_GetFeatureExample_StarterSettings): Lib_FeatureEditor_GetFeatureExample_Returns {
  const features: Lib_FeatureEditor_GetFeatureExample_Features = starterSettings['features'];

  if (isRecord(features) === false) {
    return null;
  }

  const feature: Lib_FeatureEditor_GetFeatureExample_Feature = features[featureKey];

  if (isRecord(feature) === false || feature['configuration'] === undefined) {
    return null;
  }

  return blankSecretReferences(feature['configuration']);
}

/**
 * Feature Editor - Get Feature Schema.
 *
 * Returns the zod schema a feature's stored configuration must pass.
 * Save validation checks it before the feature's own compiler runs.
 *
 * @param {Lib_FeatureEditor_GetFeatureSchema_FeatureKey} featureKey - Feature key.
 *
 * @returns {Lib_FeatureEditor_GetFeatureSchema_Returns}
 *
 * @since 4.0.0
 */
export function getFeatureSchema(featureKey: Lib_FeatureEditor_GetFeatureSchema_FeatureKey): Lib_FeatureEditor_GetFeatureSchema_Returns {
  return featureSchemas[featureKey];
}

/**
 * Feature Editor - Get Message Variables.
 *
 * Returns the message variables the bot replaces, with their descriptions.
 * The control panel lists them next to message fields.
 *
 * @returns {Lib_FeatureEditor_GetMessageVariables_Returns}
 *
 * @since 4.0.0
 */
export function getMessageVariables(): Lib_FeatureEditor_GetMessageVariables_Returns {
  return templateVariables.map((variable) => ({
    ...variable,
  }));
}

/**
 * Feature Editor - Get Feature Message Variables.
 *
 * Filters the complete placeholder catalog to the variables one feature renders.
 * A feature without a renderer gets no variable insertion controls.
 *
 * @param {Lib_FeatureEditor_GetFeatureMessageVariables_FeatureKey} featureKey - Feature key.
 *
 * @returns {Lib_FeatureEditor_GetFeatureMessageVariables_Returns}
 *
 * @since 4.0.0
 */
function getFeatureMessageVariables(featureKey: Lib_FeatureEditor_GetFeatureMessageVariables_FeatureKey): Lib_FeatureEditor_GetFeatureMessageVariables_Returns {
  const tokens: Lib_FeatureEditor_GetFeatureMessageVariables_Tokens = featureVariableTokens[featureKey] ?? [];

  return getMessageVariables().filter((variable) => tokens.includes(variable['token']));
}

/**
 * Feature Editor - Build Feature Editor.
 *
 * Converts the feature's zod schema to JSON Schema and adds titles, hints, and sections.
 * Refinements stay server-side; the editor only shapes the form.
 *
 * @param {Lib_FeatureEditor_BuildFeatureEditor_FeatureKey} featureKey - Feature key.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_BuildFeatureEditor_Returns}
 *
 * @since 4.0.0
 */
function buildFeatureEditor(featureKey: Lib_FeatureEditor_BuildFeatureEditor_FeatureKey): Lib_FeatureEditor_BuildFeatureEditor_Returns {
  const definition: Lib_FeatureEditor_BuildFeatureEditor_Definition = getFeatureDefinition(featureKey);
  const presentation: Lib_FeatureEditor_BuildFeatureEditor_Presentation = presentations[featureKey];
  const editor: Lib_FeatureEditor_BuildFeatureEditor_Editor = z.toJSONSchema(featureSchemas[featureKey], {
    io: 'input',
    unrepresentable: 'any',
  }) as Lib_FeatureEditor_BuildFeatureEditor_Editor;

  Reflect.set(editor, 'title', definition['name']);

  Reflect.set(editor, 'description', definition['description']);

  decorateNode(editor, {
    depth: 0,
    featureKey,
    itemLabel: presentation['itemLabel'],
    key: undefined,
    presentation,
  });

  if (isRecord(editor['properties']) === true) {
    Reflect.set(editor, 'x-sections', createSections(editor, presentation));
  }

  return editor;
}

/**
 * Feature Editor - Create Enum Label.
 *
 * Names one fixed choice, falling back to the stored value in sentence case.
 * Upper-case values such as STAGE_INSTANCE become "Stage instance".
 *
 * @param {Lib_FeatureEditor_CreateEnumLabel_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_CreateEnumLabel_Returns}
 *
 * @since 4.0.0
 */
function createEnumLabel(value: Lib_FeatureEditor_CreateEnumLabel_Value): Lib_FeatureEditor_CreateEnumLabel_Returns {
  const override: Lib_FeatureEditor_CreateEnumLabel_Override = enumLabels[value];

  if (override !== undefined) {
    return override;
  }

  return createLabel(value.toLowerCase().replaceAll('_', '-'));
}

/**
 * Feature Editor - Create Item Label.
 *
 * Names one row of a nested list from its key, or from the list label minus its plural s.
 * Top-level lists use the feature's item label instead.
 *
 * @param {Lib_FeatureEditor_CreateItemLabel_Key}   key   - Key.
 * @param {Lib_FeatureEditor_CreateItemLabel_Label} label - Label.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_CreateItemLabel_Returns}
 *
 * @since 4.0.0
 */
function createItemLabel(key: Lib_FeatureEditor_CreateItemLabel_Key, label: Lib_FeatureEditor_CreateItemLabel_Label): Lib_FeatureEditor_CreateItemLabel_Returns {
  const override: Lib_FeatureEditor_CreateItemLabel_Override = itemLabels[key];

  if (override !== undefined) {
    return override;
  }

  return (label.endsWith('s') === true) ? label.slice(0, -1) : label;
}

/**
 * Feature Editor - Create Label.
 *
 * Names a field from its key, using the curated wording when there is one.
 * Other keys become sentence case, with ID, URL, and API kept in capitals.
 *
 * @param {Lib_FeatureEditor_CreateLabel_Key} key - Key.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_CreateLabel_Returns}
 *
 * @since 4.0.0
 */
function createLabel(key: Lib_FeatureEditor_CreateLabel_Key): Lib_FeatureEditor_CreateLabel_Returns {
  const override: Lib_FeatureEditor_CreateLabel_Override = fieldLabels[key];

  if (override !== undefined) {
    return override;
  }

  const phrase: Lib_FeatureEditor_CreateLabel_Phrase = key.split('-').map((word) => {
    if (
      word === 'api'
      || word === 'id'
      || word === 'url'
    ) {
      return word.toUpperCase();
    }

    return word;
  }).join(' ');

  return `${phrase.slice(0, 1).toUpperCase()}${phrase.slice(1)}`;
}

/**
 * Feature Editor - Create Sections.
 *
 * Orders an object feature's top-level parts: curated sections first, then the rest.
 * Hidden legacy parts are left out.
 *
 * @param {Lib_FeatureEditor_CreateSections_Node}         node         - Node.
 * @param {Lib_FeatureEditor_CreateSections_Presentation} presentation - Presentation.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_CreateSections_Returns}
 *
 * @since 4.0.0
 */
function createSections(node: Lib_FeatureEditor_CreateSections_Node, presentation: Lib_FeatureEditor_CreateSections_Presentation): Lib_FeatureEditor_CreateSections_Returns {
  const properties: Lib_FeatureEditor_CreateSections_Properties = getRecord(node, 'properties');
  const keys: Lib_FeatureEditor_CreateSections_Keys = Object.keys(properties).filter((key) => {
    const property: Lib_FeatureEditor_GetRecord_Value = properties[key];

    return isRecord(property) === false || property['x-hidden'] !== true;
  });
  const sections: Lib_FeatureEditor_CreateSections_Sections = [];

  for (const section of presentation['sections']) {
    if (keys.includes(section['key']) === true) {
      sections.push({
        description: section['description'],
        key: section['key'],
        title: section['title'],
      });
    }
  }

  for (const key of keys) {
    const sectionKey: Lib_FeatureEditor_CreateSections_Key = key;
    const existing: Lib_FeatureEditor_CreateSections_Section = sections.find((section) => section['key'] === sectionKey);

    if (existing === undefined) {
      sections.push({
        description: '',
        key: sectionKey,
        title: createLabel(sectionKey),
      });
    }
  }

  return sections;
}

/**
 * Feature Editor - Decorate Array.
 *
 * Names a list's rows and its row header field, and marks lists of plain Discord IDs.
 * Such lists can be shown as one multi-select instead of a card per row.
 *
 * @param {Lib_FeatureEditor_DecorateArray_Node}    node    - Node.
 * @param {Lib_FeatureEditor_DecorateArray_Context} context - Context.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_DecorateArray_Returns}
 *
 * @since 4.0.0
 */
function decorateArray(node: Lib_FeatureEditor_DecorateArray_Node, context: Lib_FeatureEditor_DecorateArray_Context): Lib_FeatureEditor_DecorateArray_Returns {
  const items: Lib_FeatureEditor_DecorateArray_Items = getRecord(node, 'items');
  const itemProperties: Lib_FeatureEditor_DecorateArray_ItemProperties = getRecord(items, 'properties');
  const propertyKeys: Lib_FeatureEditor_DecorateArray_PropertyKeys = Object.keys(itemProperties);
  const objectRows: Lib_FeatureEditor_DecorateArray_ObjectRows = propertyKeys.length > 0 || Array.isArray(items['oneOf']) === true;
  const key: Lib_FeatureEditor_DecorateArray_Key = context['key'] ?? '';

  if (objectRows === true) {
    let itemLabel: Lib_FeatureEditor_DecorateArray_ItemLabel = itemLabels[key];

    if (context['depth'] === 0) {
      itemLabel = context['itemLabel'];
    } else if (itemLabel === undefined) {
      itemLabel = (context['depth'] === 1) ? context['itemLabel'] : createItemLabel(key, createLabel(key));
    }

    Reflect.set(node, 'x-item-label', itemLabel);

    const titleKey: Lib_FeatureEditor_DecorateArray_TitleKey = itemTitleKeys.find((itemTitleKey) => propertyKeys.includes(itemTitleKey));

    if (titleKey !== undefined) {
      Reflect.set(node, 'x-item-title-key', titleKey);
    }
  }

  if (propertyKeys.length === 1) {
    const identifierKey: Lib_FeatureEditor_DecorateArray_IdentifierKey = propertyKeys[0] ?? '';
    const listWidget: Lib_FeatureEditor_DecorateArray_ListWidget = discordIdentifierWidgets[identifierKey];

    if (listWidget !== undefined) {
      Reflect.set(node, 'x-widget', `${listWidget}-list`);

      Reflect.set(node, 'x-item-key', identifierKey);
    }
  }

  decorateNode(items, {
    ...context,
    depth: context['depth'] + 1,
  });

  return;
}

/**
 * Feature Editor - Decorate Node.
 *
 * Walks one JSON Schema node and dispatches it by shape: object, list, union, or value.
 * Unknown legacy values are marked hidden so the form keeps them without showing them.
 *
 * @param {Lib_FeatureEditor_DecorateNode_Node}    node    - Node.
 * @param {Lib_FeatureEditor_DecorateNode_Context} context - Context.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_DecorateNode_Returns}
 *
 * @since 4.0.0
 */
function decorateNode(node: Lib_FeatureEditor_DecorateNode_Node, context: Lib_FeatureEditor_DecorateNode_Context): Lib_FeatureEditor_DecorateNode_Returns {
  if (Object.keys(node).filter((key) => key !== 'title' && key !== 'description').length === 0) {
    Reflect.set(node, 'x-hidden', true);

    return;
  }

  if (Array.isArray(node['oneOf']) === true || Array.isArray(node['anyOf']) === true) {
    decorateUnion(node, context);

    return;
  }

  if (node['type'] === 'array') {
    decorateArray(node, context);

    return;
  }

  if (node['type'] === 'object') {
    decorateObject(node, context);

    return;
  }

  decorateScalar(node, context);

  return;
}

/**
 * Feature Editor - Decorate Object.
 *
 * Titles each property, marks secret references, and walks into every child.
 * An object holding a single picker is marked inline, so its title labels the picker.
 *
 * @param {Lib_FeatureEditor_DecorateObject_Node}    node    - Node.
 * @param {Lib_FeatureEditor_DecorateObject_Context} context - Context.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_DecorateObject_Returns}
 *
 * @since 4.0.0
 */
function decorateObject(node: Lib_FeatureEditor_DecorateObject_Node, context: Lib_FeatureEditor_DecorateObject_Context): Lib_FeatureEditor_DecorateObject_Returns {
  const properties: Lib_FeatureEditor_DecorateObject_Properties = getRecord(node, 'properties');
  const propertyKeys: Lib_FeatureEditor_DecorateObject_PropertyKeys = Object.keys(properties);

  if (propertyKeys.length === 1 && propertyKeys[0] === '$secret') {
    Reflect.set(node, 'x-widget', 'secret');

    return;
  }

  if (node['additionalProperties'] !== undefined && propertyKeys.length === 0) {
    if (context['key'] === 'user-or-role-perms') {
      Reflect.set(node, 'x-widget', 'permission-map');

      Reflect.set(node, 'x-options', [...permissionNames]);
    }

    return;
  }

  for (const entry of Object.entries(properties)) {
    const typedEntry: Lib_FeatureEditor_DecorateObject_Entry = entry;
    const entryKey: Lib_FeatureEditor_DecorateObject_EntryKey = typedEntry[0];
    const entryValue: Lib_FeatureEditor_DecorateObject_EntryValue = typedEntry[1];

    if (isRecord(entryValue) === false) {
      continue;
    }

    const childNode: Lib_FeatureEditor_DecorateObject_ChildNode = entryValue;

    if (
      ignoredFields.includes(entryKey) === true
      || (ignoredFeatureFields[context['featureKey']] ?? []).includes(entryKey) === true
    ) {
      Reflect.set(childNode, 'x-hidden', true);

      continue;
    }

    const sectionTitle: Lib_FeatureEditor_DecorateObject_SectionTitle = (context['depth'] === 0) ? context['presentation']['sections'].find((section) => section['key'] === entryKey) : undefined;
    const description: Lib_FeatureEditor_DecorateObject_Description = describedFields[entryKey];
    const childContext: Lib_FeatureEditor_DecorateObject_ChildContext = {
      depth: context['depth'] + 1,
      featureKey: context['featureKey'],
      itemLabel: context['itemLabel'],
      key: entryKey,
      presentation: context['presentation'],
    };

    Reflect.set(childNode, 'title', (sectionTitle === undefined) ? createLabel(entryKey) : sectionTitle['title']);

    if (sectionTitle !== undefined && sectionTitle['description'] !== '') {
      Reflect.set(childNode, 'description', sectionTitle['description']);
    } else if (description !== undefined) {
      Reflect.set(childNode, 'description', description);
    }

    decorateNode(childNode, childContext);
  }

  if (propertyKeys.length === 1) {
    const onlyChild: Lib_FeatureEditor_DecorateObject_OnlyChild = properties[propertyKeys[0] ?? ''];

    if (
      isRecord(onlyChild) === true
      && typeof onlyChild['x-widget'] === 'string'
      && discordIdentifierWidgets[propertyKeys[0] ?? ''] !== undefined
    ) {
      Reflect.set(node, 'x-inline', true);
    }
  }

  return;
}

/**
 * Feature Editor - Decorate Scalar.
 *
 * Picks the control for one value: a Discord picker, a pattern box, a message box with
 * variables, a URL, a time zone, or long text; fixed choices get readable labels.
 *
 * @param {Lib_FeatureEditor_DecorateScalar_Node}    node    - Node.
 * @param {Lib_FeatureEditor_DecorateScalar_Context} context - Context.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_DecorateScalar_Returns}
 *
 * @since 4.0.0
 */
function decorateScalar(node: Lib_FeatureEditor_DecorateScalar_Node, context: Lib_FeatureEditor_DecorateScalar_Context): Lib_FeatureEditor_DecorateScalar_Returns {
  const key: Lib_FeatureEditor_DecorateScalar_Key = context['key'] ?? '';
  const type: Lib_FeatureEditor_DecorateScalar_Type = node['type'];
  const enumValues: Lib_FeatureEditor_DecorateScalar_EnumValues = node['enum'];

  if (Array.isArray(enumValues) === true) {
    const labels: Lib_FeatureEditor_DecorateScalar_EnumLabels = {};

    for (const value of enumValues) {
      if (typeof value === 'string') {
        Reflect.set(labels, value, createEnumLabel(value));
      }
    }

    Reflect.set(node, 'x-enum-labels', labels);

    return;
  }

  if (type !== 'string') {
    return;
  }

  const format: Lib_FeatureEditor_DecorateScalar_Format = node['format'];
  const maxLength: Lib_FeatureEditor_DecorateScalar_MaxLength = node['maxLength'];
  let widget: Lib_FeatureEditor_DecorateScalar_Widget = discordIdentifierWidgets[key];

  if (
    widget === undefined
    && (
      key === 'flags'
      || key === 'pattern'
    )
  ) {
    widget = 'pattern';
  }

  if (widget === undefined && variableFields.includes(key) === true) {
    const variables: Lib_FeatureEditor_GetFeatureMessageVariables_Returns = getFeatureMessageVariables(context['featureKey']);

    if (variables.length > 0) {
      widget = 'variables';

      Reflect.set(node, 'x-variables', variables);
    }
  }

  if (widget === undefined && key === 'time-zone') {
    widget = 'time-zone';
  }

  if (
    widget === undefined
    && (
      format === 'uri'
      || key === 'url'
      || key.endsWith('-url') === true
    )
  ) {
    widget = 'url';
  }

  if (
    widget === undefined
    && typeof maxLength === 'number'
    && maxLength > 500
  ) {
    widget = 'textarea';
  }

  if (widget !== undefined) {
    Reflect.set(node, 'x-widget', widget);
  }

  return;
}

/**
 * Feature Editor - Decorate Union.
 *
 * Marks the property that tells a union's options apart and names each option.
 * Copier destinations, for example, switch between a channel and a webhook.
 *
 * @param {Lib_FeatureEditor_DecorateUnion_Node}    node    - Node.
 * @param {Lib_FeatureEditor_DecorateUnion_Context} context - Context.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_DecorateUnion_Returns}
 *
 * @since 4.0.0
 */
function decorateUnion(node: Lib_FeatureEditor_DecorateUnion_Node, context: Lib_FeatureEditor_DecorateUnion_Context): Lib_FeatureEditor_DecorateUnion_Returns {
  const options: Lib_FeatureEditor_DecorateUnion_Options = [
    ...getRecordList(node, 'oneOf'),
    ...getRecordList(node, 'anyOf'),
  ];
  const discriminator: Lib_FeatureEditor_DecorateUnion_Discriminator = findDiscriminator(options);

  if (discriminator !== undefined) {
    Reflect.set(node, 'x-discriminator', discriminator);
  }

  for (const option of options) {
    if (discriminator !== undefined) {
      const optionProperties: Lib_FeatureEditor_DecorateUnion_OptionProperties = getRecord(option, 'properties');
      const optionValue: Lib_FeatureEditor_DecorateUnion_OptionValue = getRecord(optionProperties, discriminator)['const'];

      if (typeof optionValue === 'string') {
        Reflect.set(option, 'title', createEnumLabel(optionValue));
      }
    }

    decorateNode(option, context);
  }

  return;
}

/**
 * Feature Editor - Find Discriminator.
 *
 * Finds the property every union option fixes to its own constant value.
 * Unions without one have no discriminator.
 *
 * @param {Lib_FeatureEditor_FindDiscriminator_Options} options - Options.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_FindDiscriminator_Returns}
 *
 * @since 4.0.0
 */
function findDiscriminator(options: Lib_FeatureEditor_FindDiscriminator_Options): Lib_FeatureEditor_FindDiscriminator_Returns {
  const firstOption: Lib_FeatureEditor_FindDiscriminator_FirstOption = options[0];

  if (firstOption === undefined) {
    return undefined;
  }

  const firstProperties: Lib_FeatureEditor_FindDiscriminator_FirstProperties = getRecord(firstOption, 'properties');

  return Object.keys(firstProperties).find((candidate) => {
    const candidateKey: Lib_FeatureEditor_FindDiscriminator_Candidate = candidate;

    return options.every((option) => getRecord(getRecord(option, 'properties'), candidateKey)['const'] !== undefined);
  });
}

/**
 * Feature Editor - Get Record.
 *
 * Reads one property of a JSON Schema node as an object, or an empty object otherwise.
 * The walker can then read nested keys without type guards everywhere.
 *
 * @param {Lib_FeatureEditor_GetRecord_Node} node - Node.
 * @param {Lib_FeatureEditor_GetRecord_Key}  key  - Key.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_GetRecord_Returns}
 *
 * @since 4.0.0
 */
function getRecord(node: Lib_FeatureEditor_GetRecord_Node, key: Lib_FeatureEditor_GetRecord_Key): Lib_FeatureEditor_GetRecord_Returns {
  const value: Lib_FeatureEditor_GetRecord_Value = node[key];

  return (isRecord(value) === true) ? value : {};
}

/**
 * Feature Editor - Get Record List.
 *
 * Reads one property of a JSON Schema node as a list of objects, skipping other entries.
 * A missing property gives an empty list.
 *
 * @param {Lib_FeatureEditor_GetRecordList_Node} node - Node.
 * @param {Lib_FeatureEditor_GetRecordList_Key}  key  - Key.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_GetRecordList_Returns}
 *
 * @since 4.0.0
 */
function getRecordList(node: Lib_FeatureEditor_GetRecordList_Node, key: Lib_FeatureEditor_GetRecordList_Key): Lib_FeatureEditor_GetRecordList_Returns {
  const value: Lib_FeatureEditor_GetRecordList_Value = node[key];

  if (Array.isArray(value) === false) {
    return [];
  }

  return value.filter((entry) => isRecord(entry) === true);
}

/**
 * Feature Editor - Is Record.
 *
 * Narrows unknown JSON Schema values to plain objects.
 * Arrays and null values are excluded.
 *
 * @param {Lib_FeatureEditor_IsRecord_Value} value - Value.
 *
 * @private
 *
 * @returns {Lib_FeatureEditor_IsRecord_Returns}
 *
 * @since 4.0.0
 */
function isRecord(value: Lib_FeatureEditor_IsRecord_Value): value is Lib_FeatureEditor_IsRecord_Record {
  return (
    typeof value === 'object'
    && value !== null
    && Array.isArray(value) === false
  );
}
