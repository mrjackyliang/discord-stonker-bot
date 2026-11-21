import type {
  Lib_ChatPlatform_Contracts_Events,
  Lib_ChatPlatform_Contracts_Intents,
  Lib_ChatPlatform_Contracts_PermissionNames,
} from '../../types/lib/chat-platform/contracts.d.ts';

/**
 * Contracts - Chat Platform Events.
 *
 * Names every Gateway event consumed by the bot without exposing SDK enums.
 * The Discord implementation translates each event before features receive it.
 *
 * @since 4.2.1
 */
export const chatPlatformEvents: Lib_ChatPlatform_Contracts_Events = {
  ChannelCreate: 'channelCreate',
  ChannelDelete: 'channelDelete',
  ChannelUpdate: 'channelUpdate',
  ClientReady: 'clientReady',
  GuildCreate: 'guildCreate',
  GuildDelete: 'guildDelete',
  GuildMemberAdd: 'guildMemberAdd',
  GuildMemberRemove: 'guildMemberRemove',
  GuildMemberUpdate: 'guildMemberUpdate',
  GuildRoleCreate: 'guildRoleCreate',
  GuildRoleDelete: 'guildRoleDelete',
  GuildRoleUpdate: 'guildRoleUpdate',
  GuildScheduledEventCreate: 'guildScheduledEventCreate',
  GuildScheduledEventDelete: 'guildScheduledEventDelete',
  GuildScheduledEventUpdate: 'guildScheduledEventUpdate',
  GuildUpdate: 'guildUpdate',
  InteractionCreate: 'interactionCreate',
  MessageCreate: 'messageCreate',
  MessageDelete: 'messageDelete',
  MessageUpdate: 'messageUpdate',
  ShardDisconnect: 'shardDisconnect',
  ShardError: 'shardError',
  ShardReady: 'shardReady',
  ShardReconnecting: 'shardReconnecting',
  ShardResume: 'shardResume',
  ThreadUpdate: 'threadUpdate',
  UserUpdate: 'userUpdate',
};

/**
 * Contracts - Chat Platform Intents.
 *
 * Gives features stable intent names while the implementation owns bit flags.
 * Startup can still request only the capabilities enabled for each server.
 *
 * @since 4.2.1
 */
export const chatPlatformIntents: Lib_ChatPlatform_Contracts_Intents = {
  GuildMembers: 'guild-members',
  GuildMessages: 'guild-messages',
  GuildScheduledEvents: 'guild-scheduled-events',
  GuildVoiceStates: 'guild-voice-states',
  Guilds: 'guilds',
  MessageContent: 'message-content',
};

/**
 * Contracts - Chat Platform Permissions.
 *
 * Supplies permission names for feature decisions and command declarations.
 * Only the Discord implementation resolves these names to provider bitfields.
 *
 * @since 4.2.1
 */
export const chatPlatformPermissions: Lib_ChatPlatform_Contracts_PermissionNames = {
  BanMembers: 'BanMembers',
  ManageGuild: 'ManageGuild',
  ManageRoles: 'ManageRoles',
  MoveMembers: 'MoveMembers',
};
