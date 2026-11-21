export type Lib_ChatPlatform_Contracts_Identifier = string;

export type Lib_ChatPlatform_Contracts_AllowedMentions_ParseValue = 'everyone' | 'roles' | 'users';
export type Lib_ChatPlatform_Contracts_AllowedMentions_Parse = Lib_ChatPlatform_Contracts_AllowedMentions_ParseValue[];
export type Lib_ChatPlatform_Contracts_AllowedMentions_RepliedUser = boolean;
export type Lib_ChatPlatform_Contracts_AllowedMentions = {
  parse: Lib_ChatPlatform_Contracts_AllowedMentions_Parse;
  repliedUser?: Lib_ChatPlatform_Contracts_AllowedMentions_RepliedUser;
};

export type Lib_ChatPlatform_Contracts_Application_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Application = {
  id: Lib_ChatPlatform_Contracts_Application_Id;
};

export type Lib_ChatPlatform_Contracts_ApplicationCommandChoice_Name = string;
export type Lib_ChatPlatform_Contracts_ApplicationCommandChoice_Value = string;
export type Lib_ChatPlatform_Contracts_ApplicationCommandChoice = {
  name: Lib_ChatPlatform_Contracts_ApplicationCommandChoice_Name;
  value: Lib_ChatPlatform_Contracts_ApplicationCommandChoice_Value;
};
export type Lib_ChatPlatform_Contracts_ApplicationCommandChoices = Lib_ChatPlatform_Contracts_ApplicationCommandChoice[];
export type Lib_ChatPlatform_Contracts_ApplicationCommandOptionType =
  | 'boolean'
  | 'channel'
  | 'integer'
  | 'role'
  | 'string'
  | 'user';
export type Lib_ChatPlatform_Contracts_ApplicationCommandChannelType = 'guild-stage-voice' | 'guild-voice';
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_ChannelTypes = Lib_ChatPlatform_Contracts_ApplicationCommandChannelType[] | undefined;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_Choices = Lib_ChatPlatform_Contracts_ApplicationCommandChoices | undefined;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_Description = string;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_MaxLength = number | undefined;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_MaxValue = number | undefined;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_MinValue = number | undefined;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_Name = string;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_Required = boolean;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption_Type = Lib_ChatPlatform_Contracts_ApplicationCommandOptionType;
export type Lib_ChatPlatform_Contracts_ApplicationCommandOption = {
  channelTypes?: Lib_ChatPlatform_Contracts_ApplicationCommandOption_ChannelTypes;
  choices?: Lib_ChatPlatform_Contracts_ApplicationCommandOption_Choices;
  description: Lib_ChatPlatform_Contracts_ApplicationCommandOption_Description;
  maxLength?: Lib_ChatPlatform_Contracts_ApplicationCommandOption_MaxLength;
  maxValue?: Lib_ChatPlatform_Contracts_ApplicationCommandOption_MaxValue;
  minValue?: Lib_ChatPlatform_Contracts_ApplicationCommandOption_MinValue;
  name: Lib_ChatPlatform_Contracts_ApplicationCommandOption_Name;
  required: Lib_ChatPlatform_Contracts_ApplicationCommandOption_Required;
  type: Lib_ChatPlatform_Contracts_ApplicationCommandOption_Type;
};
export type Lib_ChatPlatform_Contracts_ApplicationCommandOptions = Lib_ChatPlatform_Contracts_ApplicationCommandOption[];
export type Lib_ChatPlatform_Contracts_ApplicationCommand_Context = 'guild';
export type Lib_ChatPlatform_Contracts_ApplicationCommand_Contexts = Lib_ChatPlatform_Contracts_ApplicationCommand_Context[];
export type Lib_ChatPlatform_Contracts_ApplicationCommand_DefaultMemberPermissions = Lib_ChatPlatform_Contracts_PermissionName;
export type Lib_ChatPlatform_Contracts_ApplicationCommand_Description = string;
export type Lib_ChatPlatform_Contracts_ApplicationCommand_IntegrationType = 'guild-install';
export type Lib_ChatPlatform_Contracts_ApplicationCommand_IntegrationTypes = Lib_ChatPlatform_Contracts_ApplicationCommand_IntegrationType[];
export type Lib_ChatPlatform_Contracts_ApplicationCommand_Name = string;
export type Lib_ChatPlatform_Contracts_ApplicationCommand_Options = Lib_ChatPlatform_Contracts_ApplicationCommandOptions | undefined;
export type Lib_ChatPlatform_Contracts_ApplicationCommand = {
  contexts: Lib_ChatPlatform_Contracts_ApplicationCommand_Contexts;
  defaultMemberPermissions: Lib_ChatPlatform_Contracts_ApplicationCommand_DefaultMemberPermissions;
  description: Lib_ChatPlatform_Contracts_ApplicationCommand_Description;
  integrationTypes: Lib_ChatPlatform_Contracts_ApplicationCommand_IntegrationTypes;
  name: Lib_ChatPlatform_Contracts_ApplicationCommand_Name;
  options?: Lib_ChatPlatform_Contracts_ApplicationCommand_Options;
};
export type Lib_ChatPlatform_Contracts_ApplicationCommands = Lib_ChatPlatform_Contracts_ApplicationCommand[];

export type Lib_ChatPlatform_Contracts_Attachment_Name = string;
export type Lib_ChatPlatform_Contracts_Attachment_Url = string;
export type Lib_ChatPlatform_Contracts_Attachment = {
  name: Lib_ChatPlatform_Contracts_Attachment_Name;
  url: Lib_ChatPlatform_Contracts_Attachment_Url;
};

export type Lib_ChatPlatform_Contracts_ChannelType = number;
export type Lib_ChatPlatform_Contracts_Channel_Archived = boolean | null;
export type Lib_ChatPlatform_Contracts_Channel_Guild = Lib_ChatPlatform_Contracts_Guild | undefined;
export type Lib_ChatPlatform_Contracts_Channel_GuildId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_Channel_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Channel_Name = string;
export type Lib_ChatPlatform_Contracts_Channel_ParentId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_Channel_Type = Lib_ChatPlatform_Contracts_ChannelType;
export type Lib_ChatPlatform_Contracts_Channel_IsRegistryChannel_Returns = boolean;
export type Lib_ChatPlatform_Contracts_Channel_IsSendable_TypeGuard = Lib_ChatPlatform_Contracts_SendableChannel;
export type Lib_ChatPlatform_Contracts_Channel_IsThread_TypeGuard = Lib_ChatPlatform_Contracts_ThreadChannel;
export type Lib_ChatPlatform_Contracts_Channel_IsVoiceBased_TypeGuard = Lib_ChatPlatform_Contracts_VoiceChannel;
export type Lib_ChatPlatform_Contracts_Channel = {
  archived: Lib_ChatPlatform_Contracts_Channel_Archived;
  guild: Lib_ChatPlatform_Contracts_Channel_Guild;
  guildId: Lib_ChatPlatform_Contracts_Channel_GuildId;
  id: Lib_ChatPlatform_Contracts_Channel_Id;
  name: Lib_ChatPlatform_Contracts_Channel_Name;
  parentId: Lib_ChatPlatform_Contracts_Channel_ParentId;
  type: Lib_ChatPlatform_Contracts_Channel_Type;
  isRegistryChannel(): Lib_ChatPlatform_Contracts_Channel_IsRegistryChannel_Returns;
  isSendable(): this is Lib_ChatPlatform_Contracts_Channel_IsSendable_TypeGuard;
  isThread(): this is Lib_ChatPlatform_Contracts_Channel_IsThread_TypeGuard;
  isVoiceBased(): this is Lib_ChatPlatform_Contracts_Channel_IsVoiceBased_TypeGuard;
};
export type Lib_ChatPlatform_Contracts_GuildChannel = Lib_ChatPlatform_Contracts_Channel & {
  guild: Lib_ChatPlatform_Contracts_Guild;
  guildId: Lib_ChatPlatform_Contracts_Identifier;
};

export type Lib_ChatPlatform_Contracts_ChannelManager_Cache = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_GuildChannel>;
export type Lib_ChatPlatform_Contracts_ChannelManager_Fetch_ChannelIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_ChannelManager_Fetch_Returns = Promise<Lib_ChatPlatform_Contracts_GuildChannel | null>;
export type Lib_ChatPlatform_Contracts_ChannelManager_Fetch = (
  channelIdentifier: Lib_ChatPlatform_Contracts_ChannelManager_Fetch_ChannelIdentifier,
) => Lib_ChatPlatform_Contracts_ChannelManager_Fetch_Returns;
export type Lib_ChatPlatform_Contracts_ChannelManager = {
  cache: Lib_ChatPlatform_Contracts_ChannelManager_Cache;
  fetch: Lib_ChatPlatform_Contracts_ChannelManager_Fetch;
};

export type Lib_ChatPlatform_Contracts_ClientEventArguments = {
  channelCreate: [Lib_ChatPlatform_Contracts_Channel];
  channelDelete: [Lib_ChatPlatform_Contracts_Channel];
  channelUpdate: [Lib_ChatPlatform_Contracts_Channel, Lib_ChatPlatform_Contracts_Channel];
  clientReady: [Lib_ChatPlatform_Contracts_Client];
  guildCreate: [Lib_ChatPlatform_Contracts_Guild];
  guildDelete: [Lib_ChatPlatform_Contracts_Guild];
  guildMemberAdd: [Lib_ChatPlatform_Contracts_Member];
  guildMemberRemove: [Lib_ChatPlatform_Contracts_Member];
  guildMemberUpdate: [Lib_ChatPlatform_Contracts_Member, Lib_ChatPlatform_Contracts_Member];
  guildRoleCreate: [Lib_ChatPlatform_Contracts_Role];
  guildRoleDelete: [Lib_ChatPlatform_Contracts_Role];
  guildRoleUpdate: [Lib_ChatPlatform_Contracts_Role, Lib_ChatPlatform_Contracts_Role];
  guildScheduledEventCreate: [Lib_ChatPlatform_Contracts_ScheduledEvent];
  guildScheduledEventDelete: [Lib_ChatPlatform_Contracts_ScheduledEvent];
  guildScheduledEventUpdate: [Lib_ChatPlatform_Contracts_ScheduledEvent | null, Lib_ChatPlatform_Contracts_ScheduledEvent];
  guildUpdate: [Lib_ChatPlatform_Contracts_Guild, Lib_ChatPlatform_Contracts_Guild];
  interactionCreate: [Lib_ChatPlatform_Contracts_Interaction];
  messageCreate: [Lib_ChatPlatform_Contracts_FullMessage];
  messageDelete: [Lib_ChatPlatform_Contracts_Message];
  messageUpdate: [Lib_ChatPlatform_Contracts_Message, Lib_ChatPlatform_Contracts_FullMessage];
  shardDisconnect: [Lib_ChatPlatform_Contracts_CloseEvent, number];
  shardError: [unknown, number];
  shardReady: [number, Set<string> | undefined];
  shardReconnecting: [number];
  shardResume: [number, number];
  threadUpdate: [Lib_ChatPlatform_Contracts_ThreadChannel, Lib_ChatPlatform_Contracts_ThreadChannel];
  userUpdate: [Lib_ChatPlatform_Contracts_PartialUser, Lib_ChatPlatform_Contracts_User];
};
export type Lib_ChatPlatform_Contracts_ClientEventName = keyof Lib_ChatPlatform_Contracts_ClientEventArguments;
export type Lib_ChatPlatform_Contracts_ClientEventListener<EventName extends Lib_ChatPlatform_Contracts_ClientEventName> = (
  ...eventArguments: Lib_ChatPlatform_Contracts_ClientEventArguments[EventName]
) => void;

export type Lib_ChatPlatform_Contracts_Client_Application = Lib_ChatPlatform_Contracts_Application | null;
export type Lib_ChatPlatform_Contracts_Client_Guilds = Lib_ChatPlatform_Contracts_GuildManager;
export type Lib_ChatPlatform_Contracts_Client_Rest = Lib_ChatPlatform_Contracts_Rest;
export type Lib_ChatPlatform_Contracts_Client_User = Lib_ChatPlatform_Contracts_User | null;
export type Lib_ChatPlatform_Contracts_Client_Destroy_Returns = void;
export type Lib_ChatPlatform_Contracts_Client_Login_Token = string;
export type Lib_ChatPlatform_Contracts_Client_Login_Returns = Promise<string>;
export type Lib_ChatPlatform_Contracts_Client_On_EventName = Lib_ChatPlatform_Contracts_ClientEventName;
export type Lib_ChatPlatform_Contracts_Client_On_Returns = Lib_ChatPlatform_Contracts_Client;
export type Lib_ChatPlatform_Contracts_Client_Once_EventName = Lib_ChatPlatform_Contracts_ClientEventName;
export type Lib_ChatPlatform_Contracts_Client_Once_Returns = Lib_ChatPlatform_Contracts_Client;
export type Lib_ChatPlatform_Contracts_Client = {
  application: Lib_ChatPlatform_Contracts_Client_Application;
  guilds: Lib_ChatPlatform_Contracts_Client_Guilds;
  rest: Lib_ChatPlatform_Contracts_Client_Rest;
  user: Lib_ChatPlatform_Contracts_Client_User;
  destroy(): Lib_ChatPlatform_Contracts_Client_Destroy_Returns;
  login(token: Lib_ChatPlatform_Contracts_Client_Login_Token): Lib_ChatPlatform_Contracts_Client_Login_Returns;
  on<EventName extends Lib_ChatPlatform_Contracts_Client_On_EventName>(
    eventName: EventName,
    listener: Lib_ChatPlatform_Contracts_ClientEventListener<EventName>,
  ): Lib_ChatPlatform_Contracts_Client_On_Returns;
  once<EventName extends Lib_ChatPlatform_Contracts_Client_Once_EventName>(
    eventName: EventName,
    listener: Lib_ChatPlatform_Contracts_ClientEventListener<EventName>,
  ): Lib_ChatPlatform_Contracts_Client_Once_Returns;
};

export type Lib_ChatPlatform_Contracts_ClientOptions_Intents = Lib_ChatPlatform_Contracts_Intent[];
export type Lib_ChatPlatform_Contracts_ClientOptions_ShardCount = number;
export type Lib_ChatPlatform_Contracts_ClientOptions = {
  intents: Lib_ChatPlatform_Contracts_ClientOptions_Intents;
  shardCount: Lib_ChatPlatform_Contracts_ClientOptions_ShardCount;
};

export type Lib_ChatPlatform_Contracts_CloseEvent_Code = number;
export type Lib_ChatPlatform_Contracts_CloseEvent = {
  code: Lib_ChatPlatform_Contracts_CloseEvent_Code;
};

export type Lib_ChatPlatform_Contracts_Collection_Filter_Predicate<Value> = (value: Value) => boolean;
export type Lib_ChatPlatform_Contracts_Collection_First_Count = number;
export type Lib_ChatPlatform_Contracts_Collection_Get_Identifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Collection_Has_Identifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Collection_Map_Mapper<Value, Result> = (value: Value) => Result;
export type Lib_ChatPlatform_Contracts_Collection_Some_Predicate<Value> = (value: Value) => boolean;
export type Lib_ChatPlatform_Contracts_Collection<Value> = {
  size: number;
  filter(predicate: Lib_ChatPlatform_Contracts_Collection_Filter_Predicate<Value>): Lib_ChatPlatform_Contracts_Collection<Value>;
  first(count: Lib_ChatPlatform_Contracts_Collection_First_Count): Value[];
  get(identifier: Lib_ChatPlatform_Contracts_Collection_Get_Identifier): Value | undefined;
  has(identifier: Lib_ChatPlatform_Contracts_Collection_Has_Identifier): boolean;
  keys(): IterableIterator<string>;
  map<Result>(mapper: Lib_ChatPlatform_Contracts_Collection_Map_Mapper<Value, Result>): Result[];
  some(predicate: Lib_ChatPlatform_Contracts_Collection_Some_Predicate<Value>): boolean;
};

export type Lib_ChatPlatform_Contracts_Embed = object;

export type Lib_ChatPlatform_Contracts_Emoji_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Emoji_Name = string | null;
export type Lib_ChatPlatform_Contracts_Emoji = {
  id: Lib_ChatPlatform_Contracts_Emoji_Id;
  name: Lib_ChatPlatform_Contracts_Emoji_Name;
};

export type Lib_ChatPlatform_Contracts_EmojiManager_Cache = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_Emoji>;
export type Lib_ChatPlatform_Contracts_EmojiManager_Fetch_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_EmojiManager = {
  cache: Lib_ChatPlatform_Contracts_EmojiManager_Cache;
  fetch(): Lib_ChatPlatform_Contracts_EmojiManager_Fetch_Returns;
};

export type Lib_ChatPlatform_Contracts_Events_ChannelCreate = 'channelCreate';
export type Lib_ChatPlatform_Contracts_Events_ChannelDelete = 'channelDelete';
export type Lib_ChatPlatform_Contracts_Events_ChannelUpdate = 'channelUpdate';
export type Lib_ChatPlatform_Contracts_Events_ClientReady = 'clientReady';
export type Lib_ChatPlatform_Contracts_Events_GuildCreate = 'guildCreate';
export type Lib_ChatPlatform_Contracts_Events_GuildDelete = 'guildDelete';
export type Lib_ChatPlatform_Contracts_Events_GuildMemberAdd = 'guildMemberAdd';
export type Lib_ChatPlatform_Contracts_Events_GuildMemberRemove = 'guildMemberRemove';
export type Lib_ChatPlatform_Contracts_Events_GuildMemberUpdate = 'guildMemberUpdate';
export type Lib_ChatPlatform_Contracts_Events_GuildRoleCreate = 'guildRoleCreate';
export type Lib_ChatPlatform_Contracts_Events_GuildRoleDelete = 'guildRoleDelete';
export type Lib_ChatPlatform_Contracts_Events_GuildRoleUpdate = 'guildRoleUpdate';
export type Lib_ChatPlatform_Contracts_Events_GuildScheduledEventCreate = 'guildScheduledEventCreate';
export type Lib_ChatPlatform_Contracts_Events_GuildScheduledEventDelete = 'guildScheduledEventDelete';
export type Lib_ChatPlatform_Contracts_Events_GuildScheduledEventUpdate = 'guildScheduledEventUpdate';
export type Lib_ChatPlatform_Contracts_Events_GuildUpdate = 'guildUpdate';
export type Lib_ChatPlatform_Contracts_Events_InteractionCreate = 'interactionCreate';
export type Lib_ChatPlatform_Contracts_Events_MessageCreate = 'messageCreate';
export type Lib_ChatPlatform_Contracts_Events_MessageDelete = 'messageDelete';
export type Lib_ChatPlatform_Contracts_Events_MessageUpdate = 'messageUpdate';
export type Lib_ChatPlatform_Contracts_Events_ShardDisconnect = 'shardDisconnect';
export type Lib_ChatPlatform_Contracts_Events_ShardError = 'shardError';
export type Lib_ChatPlatform_Contracts_Events_ShardReady = 'shardReady';
export type Lib_ChatPlatform_Contracts_Events_ShardReconnecting = 'shardReconnecting';
export type Lib_ChatPlatform_Contracts_Events_ShardResume = 'shardResume';
export type Lib_ChatPlatform_Contracts_Events_ThreadUpdate = 'threadUpdate';
export type Lib_ChatPlatform_Contracts_Events_UserUpdate = 'userUpdate';
export type Lib_ChatPlatform_Contracts_Events = {
  ChannelCreate: Lib_ChatPlatform_Contracts_Events_ChannelCreate;
  ChannelDelete: Lib_ChatPlatform_Contracts_Events_ChannelDelete;
  ChannelUpdate: Lib_ChatPlatform_Contracts_Events_ChannelUpdate;
  ClientReady: Lib_ChatPlatform_Contracts_Events_ClientReady;
  GuildCreate: Lib_ChatPlatform_Contracts_Events_GuildCreate;
  GuildDelete: Lib_ChatPlatform_Contracts_Events_GuildDelete;
  GuildMemberAdd: Lib_ChatPlatform_Contracts_Events_GuildMemberAdd;
  GuildMemberRemove: Lib_ChatPlatform_Contracts_Events_GuildMemberRemove;
  GuildMemberUpdate: Lib_ChatPlatform_Contracts_Events_GuildMemberUpdate;
  GuildRoleCreate: Lib_ChatPlatform_Contracts_Events_GuildRoleCreate;
  GuildRoleDelete: Lib_ChatPlatform_Contracts_Events_GuildRoleDelete;
  GuildRoleUpdate: Lib_ChatPlatform_Contracts_Events_GuildRoleUpdate;
  GuildScheduledEventCreate: Lib_ChatPlatform_Contracts_Events_GuildScheduledEventCreate;
  GuildScheduledEventDelete: Lib_ChatPlatform_Contracts_Events_GuildScheduledEventDelete;
  GuildScheduledEventUpdate: Lib_ChatPlatform_Contracts_Events_GuildScheduledEventUpdate;
  GuildUpdate: Lib_ChatPlatform_Contracts_Events_GuildUpdate;
  InteractionCreate: Lib_ChatPlatform_Contracts_Events_InteractionCreate;
  MessageCreate: Lib_ChatPlatform_Contracts_Events_MessageCreate;
  MessageDelete: Lib_ChatPlatform_Contracts_Events_MessageDelete;
  MessageUpdate: Lib_ChatPlatform_Contracts_Events_MessageUpdate;
  ShardDisconnect: Lib_ChatPlatform_Contracts_Events_ShardDisconnect;
  ShardError: Lib_ChatPlatform_Contracts_Events_ShardError;
  ShardReady: Lib_ChatPlatform_Contracts_Events_ShardReady;
  ShardReconnecting: Lib_ChatPlatform_Contracts_Events_ShardReconnecting;
  ShardResume: Lib_ChatPlatform_Contracts_Events_ShardResume;
  ThreadUpdate: Lib_ChatPlatform_Contracts_Events_ThreadUpdate;
  UserUpdate: Lib_ChatPlatform_Contracts_Events_UserUpdate;
};

export type Lib_ChatPlatform_Contracts_Guild_Channels = Lib_ChatPlatform_Contracts_ChannelManager;
export type Lib_ChatPlatform_Contracts_Guild_Commands = Lib_ChatPlatform_Contracts_GuildCommandManager;
export type Lib_ChatPlatform_Contracts_Guild_Emojis = Lib_ChatPlatform_Contracts_EmojiManager;
export type Lib_ChatPlatform_Contracts_Guild_Icon = string | null;
export type Lib_ChatPlatform_Contracts_Guild_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Guild_MemberCount = number;
export type Lib_ChatPlatform_Contracts_Guild_Members = Lib_ChatPlatform_Contracts_MemberManager;
export type Lib_ChatPlatform_Contracts_Guild_Name = string;
export type Lib_ChatPlatform_Contracts_Guild_OwnerId = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Guild_Roles = Lib_ChatPlatform_Contracts_RoleManager;
export type Lib_ChatPlatform_Contracts_Guild = {
  channels: Lib_ChatPlatform_Contracts_Guild_Channels;
  commands: Lib_ChatPlatform_Contracts_Guild_Commands;
  emojis: Lib_ChatPlatform_Contracts_Guild_Emojis;
  icon: Lib_ChatPlatform_Contracts_Guild_Icon;
  id: Lib_ChatPlatform_Contracts_Guild_Id;
  memberCount: Lib_ChatPlatform_Contracts_Guild_MemberCount;
  members: Lib_ChatPlatform_Contracts_Guild_Members;
  name: Lib_ChatPlatform_Contracts_Guild_Name;
  ownerId: Lib_ChatPlatform_Contracts_Guild_OwnerId;
  roles: Lib_ChatPlatform_Contracts_Guild_Roles;
};

export type Lib_ChatPlatform_Contracts_GuildCommandManager_Set_Commands = Lib_ChatPlatform_Contracts_ApplicationCommands;
export type Lib_ChatPlatform_Contracts_GuildCommandManager_Set_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_GuildCommandManager = {
  set(commands: Lib_ChatPlatform_Contracts_GuildCommandManager_Set_Commands): Lib_ChatPlatform_Contracts_GuildCommandManager_Set_Returns;
};

export type Lib_ChatPlatform_Contracts_GuildManager_Cache = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_Guild>;
export type Lib_ChatPlatform_Contracts_GuildManager_Fetch_GuildIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_GuildManager_Fetch_Returns = Promise<Lib_ChatPlatform_Contracts_Guild>;
export type Lib_ChatPlatform_Contracts_GuildManager = {
  cache: Lib_ChatPlatform_Contracts_GuildManager_Cache;
  fetch(guildIdentifier: Lib_ChatPlatform_Contracts_GuildManager_Fetch_GuildIdentifier): Lib_ChatPlatform_Contracts_GuildManager_Fetch_Returns;
};

export type Lib_ChatPlatform_Contracts_Intent =
  | 'guild-members'
  | 'guild-messages'
  | 'guild-scheduled-events'
  | 'guild-voice-states'
  | 'guilds'
  | 'message-content';
export type Lib_ChatPlatform_Contracts_Intents_GuildMembers = 'guild-members';
export type Lib_ChatPlatform_Contracts_Intents_GuildMessages = 'guild-messages';
export type Lib_ChatPlatform_Contracts_Intents_GuildScheduledEvents = 'guild-scheduled-events';
export type Lib_ChatPlatform_Contracts_Intents_GuildVoiceStates = 'guild-voice-states';
export type Lib_ChatPlatform_Contracts_Intents_Guilds = 'guilds';
export type Lib_ChatPlatform_Contracts_Intents_MessageContent = 'message-content';
export type Lib_ChatPlatform_Contracts_Intents = {
  GuildMembers: Lib_ChatPlatform_Contracts_Intents_GuildMembers;
  GuildMessages: Lib_ChatPlatform_Contracts_Intents_GuildMessages;
  GuildScheduledEvents: Lib_ChatPlatform_Contracts_Intents_GuildScheduledEvents;
  GuildVoiceStates: Lib_ChatPlatform_Contracts_Intents_GuildVoiceStates;
  Guilds: Lib_ChatPlatform_Contracts_Intents_Guilds;
  MessageContent: Lib_ChatPlatform_Contracts_Intents_MessageContent;
};

export type Lib_ChatPlatform_Contracts_Interaction_Client = Lib_ChatPlatform_Contracts_InteractionClient;
export type Lib_ChatPlatform_Contracts_Interaction_CommandName = string;
export type Lib_ChatPlatform_Contracts_Interaction_Deferred = boolean;
export type Lib_ChatPlatform_Contracts_Interaction_Guild = Lib_ChatPlatform_Contracts_Guild;
export type Lib_ChatPlatform_Contracts_Interaction_GuildId = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Interaction_Member = Lib_ChatPlatform_Contracts_Member;
export type Lib_ChatPlatform_Contracts_Interaction_Options = Lib_ChatPlatform_Contracts_InteractionOptions;
export type Lib_ChatPlatform_Contracts_Interaction_Replied = boolean;
export type Lib_ChatPlatform_Contracts_Interaction_User = Lib_ChatPlatform_Contracts_User;
export type Lib_ChatPlatform_Contracts_Interaction_DeferReply_Options = Lib_ChatPlatform_Contracts_InteractionReplyOptions;
export type Lib_ChatPlatform_Contracts_Interaction_DeferReply_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Interaction_EditReply_Content = string;
export type Lib_ChatPlatform_Contracts_Interaction_EditReply_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Interaction_InCachedGuild_Returns = boolean;
export type Lib_ChatPlatform_Contracts_Interaction_IsChatInputCommand_Returns = boolean;
export type Lib_ChatPlatform_Contracts_Interaction_Reply_Options = Lib_ChatPlatform_Contracts_InteractionReplyOptions;
export type Lib_ChatPlatform_Contracts_Interaction_Reply_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Interaction = {
  client: Lib_ChatPlatform_Contracts_Interaction_Client;
  commandName: Lib_ChatPlatform_Contracts_Interaction_CommandName;
  deferred: Lib_ChatPlatform_Contracts_Interaction_Deferred;
  guild: Lib_ChatPlatform_Contracts_Interaction_Guild;
  guildId: Lib_ChatPlatform_Contracts_Interaction_GuildId;
  member: Lib_ChatPlatform_Contracts_Interaction_Member;
  options: Lib_ChatPlatform_Contracts_Interaction_Options;
  replied: Lib_ChatPlatform_Contracts_Interaction_Replied;
  user: Lib_ChatPlatform_Contracts_Interaction_User;
  deferReply(options: Lib_ChatPlatform_Contracts_Interaction_DeferReply_Options): Lib_ChatPlatform_Contracts_Interaction_DeferReply_Returns;
  editReply(content: Lib_ChatPlatform_Contracts_Interaction_EditReply_Content): Lib_ChatPlatform_Contracts_Interaction_EditReply_Returns;
  inCachedGuild(): Lib_ChatPlatform_Contracts_Interaction_InCachedGuild_Returns;
  isChatInputCommand(): Lib_ChatPlatform_Contracts_Interaction_IsChatInputCommand_Returns;
  reply(options: Lib_ChatPlatform_Contracts_Interaction_Reply_Options): Lib_ChatPlatform_Contracts_Interaction_Reply_Returns;
};

export type Lib_ChatPlatform_Contracts_InteractionClient_User = Lib_ChatPlatform_Contracts_User;
export type Lib_ChatPlatform_Contracts_InteractionClient = {
  user: Lib_ChatPlatform_Contracts_InteractionClient_User;
};

export type Lib_ChatPlatform_Contracts_InteractionOptions_GetBoolean_Name = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetBoolean_Required = true;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetBoolean_Returns = boolean;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetChannel_Name = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetChannel_Returns = Lib_ChatPlatform_Contracts_GuildChannel | null;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetInteger_Name = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetInteger_Returns = number | null;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetRole_Name = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetRole_Required = true;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetRole_Returns = Lib_ChatPlatform_Contracts_Role;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetString_Name = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetString_Required = true;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetString_Returns = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetUser_Name = string;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetUser_Required = true;
export type Lib_ChatPlatform_Contracts_InteractionOptions_GetUser_Returns = Lib_ChatPlatform_Contracts_User;
export type Lib_ChatPlatform_Contracts_InteractionOptions = {
  getBoolean(
    name: Lib_ChatPlatform_Contracts_InteractionOptions_GetBoolean_Name,
    required: Lib_ChatPlatform_Contracts_InteractionOptions_GetBoolean_Required,
  ): Lib_ChatPlatform_Contracts_InteractionOptions_GetBoolean_Returns;
  getChannel(name: Lib_ChatPlatform_Contracts_InteractionOptions_GetChannel_Name): Lib_ChatPlatform_Contracts_InteractionOptions_GetChannel_Returns;
  getInteger(name: Lib_ChatPlatform_Contracts_InteractionOptions_GetInteger_Name): Lib_ChatPlatform_Contracts_InteractionOptions_GetInteger_Returns;
  getRole(
    name: Lib_ChatPlatform_Contracts_InteractionOptions_GetRole_Name,
    required: Lib_ChatPlatform_Contracts_InteractionOptions_GetRole_Required,
  ): Lib_ChatPlatform_Contracts_InteractionOptions_GetRole_Returns;
  getString(
    name: Lib_ChatPlatform_Contracts_InteractionOptions_GetString_Name,
    required: Lib_ChatPlatform_Contracts_InteractionOptions_GetString_Required,
  ): Lib_ChatPlatform_Contracts_InteractionOptions_GetString_Returns;
  getUser(
    name: Lib_ChatPlatform_Contracts_InteractionOptions_GetUser_Name,
    required: Lib_ChatPlatform_Contracts_InteractionOptions_GetUser_Required,
  ): Lib_ChatPlatform_Contracts_InteractionOptions_GetUser_Returns;
};

export type Lib_ChatPlatform_Contracts_InteractionReplyOptions_Content = string | undefined;
export type Lib_ChatPlatform_Contracts_InteractionReplyOptions_Flags = 'ephemeral';
export type Lib_ChatPlatform_Contracts_InteractionReplyOptions = {
  content?: Lib_ChatPlatform_Contracts_InteractionReplyOptions_Content;
  flags: Lib_ChatPlatform_Contracts_InteractionReplyOptions_Flags;
};

export type Lib_ChatPlatform_Contracts_Member_Bannable = boolean;
export type Lib_ChatPlatform_Contracts_Member_DisplayName = string;
export type Lib_ChatPlatform_Contracts_Member_Guild = Lib_ChatPlatform_Contracts_Guild;
export type Lib_ChatPlatform_Contracts_Member_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Member_Manageable = boolean;
export type Lib_ChatPlatform_Contracts_Member_Nickname = string | null;
export type Lib_ChatPlatform_Contracts_Member_Pending = boolean | null;
export type Lib_ChatPlatform_Contracts_Member_Permissions = Lib_ChatPlatform_Contracts_Permissions;
export type Lib_ChatPlatform_Contracts_Member_Roles = Lib_ChatPlatform_Contracts_MemberRoleManager;
export type Lib_ChatPlatform_Contracts_Member_User = Lib_ChatPlatform_Contracts_User;
export type Lib_ChatPlatform_Contracts_Member_Voice = Lib_ChatPlatform_Contracts_VoiceState;
export type Lib_ChatPlatform_Contracts_Member_Ban_Options = Lib_ChatPlatform_Contracts_MemberBanOptions;
export type Lib_ChatPlatform_Contracts_Member_Ban_Returns = Promise<Lib_ChatPlatform_Contracts_Member>;
export type Lib_ChatPlatform_Contracts_Member = {
  bannable: Lib_ChatPlatform_Contracts_Member_Bannable;
  displayName: Lib_ChatPlatform_Contracts_Member_DisplayName;
  guild: Lib_ChatPlatform_Contracts_Member_Guild;
  id: Lib_ChatPlatform_Contracts_Member_Id;
  manageable: Lib_ChatPlatform_Contracts_Member_Manageable;
  nickname: Lib_ChatPlatform_Contracts_Member_Nickname;
  pending: Lib_ChatPlatform_Contracts_Member_Pending;
  permissions: Lib_ChatPlatform_Contracts_Member_Permissions;
  roles: Lib_ChatPlatform_Contracts_Member_Roles;
  user: Lib_ChatPlatform_Contracts_Member_User;
  voice: Lib_ChatPlatform_Contracts_Member_Voice;
  ban(options: Lib_ChatPlatform_Contracts_Member_Ban_Options): Lib_ChatPlatform_Contracts_Member_Ban_Returns;
};

export type Lib_ChatPlatform_Contracts_MemberBanOptions_Reason = string;
export type Lib_ChatPlatform_Contracts_MemberBanOptions = {
  reason: Lib_ChatPlatform_Contracts_MemberBanOptions_Reason;
};

export type Lib_ChatPlatform_Contracts_MemberManager_Cache = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_Member>;
export type Lib_ChatPlatform_Contracts_MemberManager_Me = Lib_ChatPlatform_Contracts_Member | null;
export type Lib_ChatPlatform_Contracts_MemberManager_Ban_Identifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_MemberManager_Ban_Options = Lib_ChatPlatform_Contracts_MemberManagerBanOptions;
export type Lib_ChatPlatform_Contracts_MemberManager_Ban_Returns = Promise<Lib_ChatPlatform_Contracts_Member | Lib_ChatPlatform_Contracts_User | string>;
export type Lib_ChatPlatform_Contracts_MemberManager_Fetch_Identifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_MemberManager_Fetch_Returns = Promise<Lib_ChatPlatform_Contracts_Member>;
export type Lib_ChatPlatform_Contracts_MemberManager = {
  cache: Lib_ChatPlatform_Contracts_MemberManager_Cache;
  me: Lib_ChatPlatform_Contracts_MemberManager_Me;
  ban(
    identifier: Lib_ChatPlatform_Contracts_MemberManager_Ban_Identifier,
    options: Lib_ChatPlatform_Contracts_MemberManager_Ban_Options,
  ): Lib_ChatPlatform_Contracts_MemberManager_Ban_Returns;
  fetch(identifier: Lib_ChatPlatform_Contracts_MemberManager_Fetch_Identifier): Lib_ChatPlatform_Contracts_MemberManager_Fetch_Returns;
};

export type Lib_ChatPlatform_Contracts_MemberManagerBanOptions_DeleteMessageSeconds = number;
export type Lib_ChatPlatform_Contracts_MemberManagerBanOptions_Reason = string;
export type Lib_ChatPlatform_Contracts_MemberManagerBanOptions = {
  deleteMessageSeconds: Lib_ChatPlatform_Contracts_MemberManagerBanOptions_DeleteMessageSeconds;
  reason: Lib_ChatPlatform_Contracts_MemberManagerBanOptions_Reason;
};

export type Lib_ChatPlatform_Contracts_MemberRoleManager_Cache = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_Role>;
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Highest = Lib_ChatPlatform_Contracts_Role;
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Add_Roles = Lib_ChatPlatform_Contracts_Role | Lib_ChatPlatform_Contracts_Role[] | string[];
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Add_Reason = string;
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Add_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Remove_Roles = Lib_ChatPlatform_Contracts_Role | string[];
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Remove_Reason = string;
export type Lib_ChatPlatform_Contracts_MemberRoleManager_Remove_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_MemberRoleManager = {
  cache: Lib_ChatPlatform_Contracts_MemberRoleManager_Cache;
  highest: Lib_ChatPlatform_Contracts_MemberRoleManager_Highest;
  add(
    roles: Lib_ChatPlatform_Contracts_MemberRoleManager_Add_Roles,
    reason: Lib_ChatPlatform_Contracts_MemberRoleManager_Add_Reason,
  ): Lib_ChatPlatform_Contracts_MemberRoleManager_Add_Returns;
  remove(
    roles: Lib_ChatPlatform_Contracts_MemberRoleManager_Remove_Roles,
    reason: Lib_ChatPlatform_Contracts_MemberRoleManager_Remove_Reason,
  ): Lib_ChatPlatform_Contracts_MemberRoleManager_Remove_Returns;
};

export type Lib_ChatPlatform_Contracts_Message_Attachments = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_Attachment>;
export type Lib_ChatPlatform_Contracts_Message_Author = Lib_ChatPlatform_Contracts_User | null;
export type Lib_ChatPlatform_Contracts_Message_Channel = Lib_ChatPlatform_Contracts_Channel;
export type Lib_ChatPlatform_Contracts_Message_ChannelId = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Message_Content = string | null;
export type Lib_ChatPlatform_Contracts_Message_CreatedAt = Date;
export type Lib_ChatPlatform_Contracts_Message_Embeds = Lib_ChatPlatform_Contracts_Embed[];
export type Lib_ChatPlatform_Contracts_Message_Guild = Lib_ChatPlatform_Contracts_Guild | null;
export type Lib_ChatPlatform_Contracts_Message_GuildId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_Message_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Message_Member = Lib_ChatPlatform_Contracts_Member | null;
export type Lib_ChatPlatform_Contracts_Message_Partial = boolean;
export type Lib_ChatPlatform_Contracts_Message_System = boolean | null;
export type Lib_ChatPlatform_Contracts_Message_Url = string;
export type Lib_ChatPlatform_Contracts_Message_WebhookId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_Message_Delete_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Message_InGuild_TypeGuard = Lib_ChatPlatform_Contracts_GuildMessage;
export type Lib_ChatPlatform_Contracts_Message_Reply_Options = Lib_ChatPlatform_Contracts_MessagePayload;
export type Lib_ChatPlatform_Contracts_Message_Reply_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Message = {
  attachments: Lib_ChatPlatform_Contracts_Message_Attachments;
  author: Lib_ChatPlatform_Contracts_Message_Author;
  channel: Lib_ChatPlatform_Contracts_Message_Channel;
  channelId: Lib_ChatPlatform_Contracts_Message_ChannelId;
  content: Lib_ChatPlatform_Contracts_Message_Content;
  createdAt: Lib_ChatPlatform_Contracts_Message_CreatedAt;
  embeds: Lib_ChatPlatform_Contracts_Message_Embeds;
  guild: Lib_ChatPlatform_Contracts_Message_Guild;
  guildId: Lib_ChatPlatform_Contracts_Message_GuildId;
  id: Lib_ChatPlatform_Contracts_Message_Id;
  member: Lib_ChatPlatform_Contracts_Message_Member;
  partial: Lib_ChatPlatform_Contracts_Message_Partial;
  system: Lib_ChatPlatform_Contracts_Message_System;
  url: Lib_ChatPlatform_Contracts_Message_Url;
  webhookId: Lib_ChatPlatform_Contracts_Message_WebhookId;
  delete(): Lib_ChatPlatform_Contracts_Message_Delete_Returns;
  inGuild(): this is Lib_ChatPlatform_Contracts_Message_InGuild_TypeGuard;
  reply(options: Lib_ChatPlatform_Contracts_Message_Reply_Options): Lib_ChatPlatform_Contracts_Message_Reply_Returns;
};
export type Lib_ChatPlatform_Contracts_GuildMessage = Lib_ChatPlatform_Contracts_Message & {
  channel: Lib_ChatPlatform_Contracts_GuildChannel;
  guild: Lib_ChatPlatform_Contracts_Guild;
  guildId: Lib_ChatPlatform_Contracts_Identifier;
};
export type Lib_ChatPlatform_Contracts_FullMessage = Lib_ChatPlatform_Contracts_Message & {
  author: Lib_ChatPlatform_Contracts_User;
  content: string;
  partial: false;
  system: boolean;
};
export type Lib_ChatPlatform_Contracts_FullGuildMessage = Lib_ChatPlatform_Contracts_FullMessage
  & Lib_ChatPlatform_Contracts_GuildMessage;

export type Lib_ChatPlatform_Contracts_MessagePayload_AllowedMentions = Lib_ChatPlatform_Contracts_AllowedMentions | undefined;
export type Lib_ChatPlatform_Contracts_MessagePayload_AvatarUrl = string | undefined;
export type Lib_ChatPlatform_Contracts_MessagePayload_Content = string | undefined;
export type Lib_ChatPlatform_Contracts_MessagePayload_Embeds = Lib_ChatPlatform_Contracts_Embed[] | undefined;
export type Lib_ChatPlatform_Contracts_MessagePayload_Username = string | undefined;
export type Lib_ChatPlatform_Contracts_MessagePayload = {
  allowedMentions?: Lib_ChatPlatform_Contracts_MessagePayload_AllowedMentions;
  avatarUrl?: Lib_ChatPlatform_Contracts_MessagePayload_AvatarUrl;
  content?: Lib_ChatPlatform_Contracts_MessagePayload_Content;
  embeds?: Lib_ChatPlatform_Contracts_MessagePayload_Embeds;
  username?: Lib_ChatPlatform_Contracts_MessagePayload_Username;
};

export type Lib_ChatPlatform_Contracts_PartialUser_Avatar = string | null;
export type Lib_ChatPlatform_Contracts_PartialUser_Bot = boolean;
export type Lib_ChatPlatform_Contracts_PartialUser_CreatedTimestamp = number;
export type Lib_ChatPlatform_Contracts_PartialUser_GlobalName = string | null;
export type Lib_ChatPlatform_Contracts_PartialUser_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_PartialUser_System = boolean;
export type Lib_ChatPlatform_Contracts_PartialUser_Tag = string | null;
export type Lib_ChatPlatform_Contracts_PartialUser_Username = string | null;
export type Lib_ChatPlatform_Contracts_PartialUser = {
  avatar: Lib_ChatPlatform_Contracts_PartialUser_Avatar;
  bot: Lib_ChatPlatform_Contracts_PartialUser_Bot;
  createdTimestamp: Lib_ChatPlatform_Contracts_PartialUser_CreatedTimestamp;
  globalName: Lib_ChatPlatform_Contracts_PartialUser_GlobalName;
  id: Lib_ChatPlatform_Contracts_PartialUser_Id;
  system: Lib_ChatPlatform_Contracts_PartialUser_System;
  tag: Lib_ChatPlatform_Contracts_PartialUser_Tag;
  username: Lib_ChatPlatform_Contracts_PartialUser_Username;
};

export type Lib_ChatPlatform_Contracts_PermissionName = string;
export type Lib_ChatPlatform_Contracts_Permissions_Has_PermissionName = Lib_ChatPlatform_Contracts_PermissionName;
export type Lib_ChatPlatform_Contracts_Permissions_Has_Returns = boolean;
export type Lib_ChatPlatform_Contracts_Permissions = {
  has(permissionName: Lib_ChatPlatform_Contracts_Permissions_Has_PermissionName): Lib_ChatPlatform_Contracts_Permissions_Has_Returns;
};

export type Lib_ChatPlatform_Contracts_PermissionOverwrite_Allow = string;
export type Lib_ChatPlatform_Contracts_PermissionOverwrite_Deny = string;
export type Lib_ChatPlatform_Contracts_PermissionOverwrite = {
  allow: Lib_ChatPlatform_Contracts_PermissionOverwrite_Allow;
  deny: Lib_ChatPlatform_Contracts_PermissionOverwrite_Deny;
};

export type Lib_ChatPlatform_Contracts_PermissionNames_BanMembers = 'BanMembers';
export type Lib_ChatPlatform_Contracts_PermissionNames_ManageGuild = 'ManageGuild';
export type Lib_ChatPlatform_Contracts_PermissionNames_ManageRoles = 'ManageRoles';
export type Lib_ChatPlatform_Contracts_PermissionNames_MoveMembers = 'MoveMembers';
export type Lib_ChatPlatform_Contracts_PermissionNames = {
  BanMembers: Lib_ChatPlatform_Contracts_PermissionNames_BanMembers;
  ManageGuild: Lib_ChatPlatform_Contracts_PermissionNames_ManageGuild;
  ManageRoles: Lib_ChatPlatform_Contracts_PermissionNames_ManageRoles;
  MoveMembers: Lib_ChatPlatform_Contracts_PermissionNames_MoveMembers;
};

export type Lib_ChatPlatform_Contracts_RateLimit_Global = boolean;
export type Lib_ChatPlatform_Contracts_RateLimit_Limit = number;
export type Lib_ChatPlatform_Contracts_RateLimit_Method = string;
export type Lib_ChatPlatform_Contracts_RateLimit_RetryAfter = number;
export type Lib_ChatPlatform_Contracts_RateLimit_Route = string;
export type Lib_ChatPlatform_Contracts_RateLimit_Scope = string;
export type Lib_ChatPlatform_Contracts_RateLimit = {
  global: Lib_ChatPlatform_Contracts_RateLimit_Global;
  limit: Lib_ChatPlatform_Contracts_RateLimit_Limit;
  method: Lib_ChatPlatform_Contracts_RateLimit_Method;
  retryAfter: Lib_ChatPlatform_Contracts_RateLimit_RetryAfter;
  route: Lib_ChatPlatform_Contracts_RateLimit_Route;
  scope: Lib_ChatPlatform_Contracts_RateLimit_Scope;
};

export type Lib_ChatPlatform_Contracts_Rest_CreateInvite_ChannelIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_CreateInvite_Options = Lib_ChatPlatform_Contracts_RestInviteOptions;
export type Lib_ChatPlatform_Contracts_Rest_CreateInvite_Reason = string;
export type Lib_ChatPlatform_Contracts_Rest_CreateInvite_Returns = Promise<unknown>;
export type Lib_ChatPlatform_Contracts_Rest_CreateMessage_ChannelIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_CreateMessage_Payload = Lib_ChatPlatform_Contracts_MessagePayload;
export type Lib_ChatPlatform_Contracts_Rest_CreateMessage_Returns = Promise<unknown>;
export type Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_ChannelIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_MessageIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_Reaction = string;
export type Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_ChannelIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_TargetIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_Overwrite = Lib_ChatPlatform_Contracts_RestPermissionOverwrite;
export type Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_Reason = string;
export type Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Rest_GetGuild_GuildIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Rest_GetGuild_WithCounts = boolean;
export type Lib_ChatPlatform_Contracts_Rest_GetGuild_Returns = Promise<unknown>;
export type Lib_ChatPlatform_Contracts_Rest_OnRateLimited_Listener = (rateLimit: Lib_ChatPlatform_Contracts_RateLimit) => void;
export type Lib_ChatPlatform_Contracts_Rest_OnRateLimited_Returns = void;
export type Lib_ChatPlatform_Contracts_Rest = {
  createInvite(
    channelIdentifier: Lib_ChatPlatform_Contracts_Rest_CreateInvite_ChannelIdentifier,
    options: Lib_ChatPlatform_Contracts_Rest_CreateInvite_Options,
    reason: Lib_ChatPlatform_Contracts_Rest_CreateInvite_Reason,
  ): Lib_ChatPlatform_Contracts_Rest_CreateInvite_Returns;
  createMessage(
    channelIdentifier: Lib_ChatPlatform_Contracts_Rest_CreateMessage_ChannelIdentifier,
    payload: Lib_ChatPlatform_Contracts_Rest_CreateMessage_Payload,
  ): Lib_ChatPlatform_Contracts_Rest_CreateMessage_Returns;
  createOwnReaction(
    channelIdentifier: Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_ChannelIdentifier,
    messageIdentifier: Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_MessageIdentifier,
    reaction: Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_Reaction,
  ): Lib_ChatPlatform_Contracts_Rest_CreateOwnReaction_Returns;
  editChannelPermission(
    channelIdentifier: Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_ChannelIdentifier,
    targetIdentifier: Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_TargetIdentifier,
    overwrite: Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_Overwrite,
    reason: Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_Reason,
  ): Lib_ChatPlatform_Contracts_Rest_EditChannelPermission_Returns;
  getGuild(
    guildIdentifier: Lib_ChatPlatform_Contracts_Rest_GetGuild_GuildIdentifier,
    withCounts: Lib_ChatPlatform_Contracts_Rest_GetGuild_WithCounts,
  ): Lib_ChatPlatform_Contracts_Rest_GetGuild_Returns;
  onRateLimited(
    listener: Lib_ChatPlatform_Contracts_Rest_OnRateLimited_Listener,
  ): Lib_ChatPlatform_Contracts_Rest_OnRateLimited_Returns;
};

export type Lib_ChatPlatform_Contracts_RestInviteOptions_MaxAgeSeconds = number;
export type Lib_ChatPlatform_Contracts_RestInviteOptions_MaxUses = number;
export type Lib_ChatPlatform_Contracts_RestInviteOptions = {
  maxAgeSeconds: Lib_ChatPlatform_Contracts_RestInviteOptions_MaxAgeSeconds;
  maxUses: Lib_ChatPlatform_Contracts_RestInviteOptions_MaxUses;
};

export type Lib_ChatPlatform_Contracts_RestOptions_Token = string;
export type Lib_ChatPlatform_Contracts_RestOptions = {
  token: Lib_ChatPlatform_Contracts_RestOptions_Token;
};

export type Lib_ChatPlatform_Contracts_RestPermissionOverwrite_Allow = string;
export type Lib_ChatPlatform_Contracts_RestPermissionOverwrite_Deny = string;
export type Lib_ChatPlatform_Contracts_RestPermissionOverwrite_TargetType = 'member' | 'role';
export type Lib_ChatPlatform_Contracts_RestPermissionOverwrite = {
  allow: Lib_ChatPlatform_Contracts_RestPermissionOverwrite_Allow;
  deny: Lib_ChatPlatform_Contracts_RestPermissionOverwrite_Deny;
  targetType: Lib_ChatPlatform_Contracts_RestPermissionOverwrite_TargetType;
};

export type Lib_ChatPlatform_Contracts_Role_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_Role_Editable = boolean;
export type Lib_ChatPlatform_Contracts_Role_Managed = boolean;
export type Lib_ChatPlatform_Contracts_Role_Name = string;
export type Lib_ChatPlatform_Contracts_Role_Position = number;
export type Lib_ChatPlatform_Contracts_Role = {
  editable: Lib_ChatPlatform_Contracts_Role_Editable;
  id: Lib_ChatPlatform_Contracts_Role_Id;
  managed: Lib_ChatPlatform_Contracts_Role_Managed;
  name: Lib_ChatPlatform_Contracts_Role_Name;
  position: Lib_ChatPlatform_Contracts_Role_Position;
};

export type Lib_ChatPlatform_Contracts_RoleManager_Cache = Lib_ChatPlatform_Contracts_Collection<Lib_ChatPlatform_Contracts_Role>;
export type Lib_ChatPlatform_Contracts_RoleManager_Fetch_RoleIdentifier = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_RoleManager_Fetch_Returns = Promise<Lib_ChatPlatform_Contracts_Role | null>;
export type Lib_ChatPlatform_Contracts_RoleManager = {
  cache: Lib_ChatPlatform_Contracts_RoleManager_Cache;
  fetch(roleIdentifier: Lib_ChatPlatform_Contracts_RoleManager_Fetch_RoleIdentifier): Lib_ChatPlatform_Contracts_RoleManager_Fetch_Returns;
};

export type Lib_ChatPlatform_Contracts_ScheduledEventEntityType = 'EXTERNAL' | 'STAGE_INSTANCE' | 'VOICE';
export type Lib_ChatPlatform_Contracts_ScheduledEventStatus = 'ACTIVE' | 'CANCELED' | 'COMPLETED' | 'SCHEDULED';
export type Lib_ChatPlatform_Contracts_ScheduledEvent_ChannelId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_CreatorId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_Description = string | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_EntityMetadata = Lib_ChatPlatform_Contracts_ScheduledEventEntityMetadata | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_EntityType = Lib_ChatPlatform_Contracts_ScheduledEventEntityType;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_GuildId = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_Name = string | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_ScheduledStartTimestamp = number | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_Status = Lib_ChatPlatform_Contracts_ScheduledEventStatus;
export type Lib_ChatPlatform_Contracts_ScheduledEvent_UserCount = number | null;
export type Lib_ChatPlatform_Contracts_ScheduledEvent = {
  channelId: Lib_ChatPlatform_Contracts_ScheduledEvent_ChannelId;
  creatorId: Lib_ChatPlatform_Contracts_ScheduledEvent_CreatorId;
  description: Lib_ChatPlatform_Contracts_ScheduledEvent_Description;
  entityMetadata: Lib_ChatPlatform_Contracts_ScheduledEvent_EntityMetadata;
  entityType: Lib_ChatPlatform_Contracts_ScheduledEvent_EntityType;
  guildId: Lib_ChatPlatform_Contracts_ScheduledEvent_GuildId;
  id: Lib_ChatPlatform_Contracts_ScheduledEvent_Id;
  name: Lib_ChatPlatform_Contracts_ScheduledEvent_Name;
  scheduledStartTimestamp: Lib_ChatPlatform_Contracts_ScheduledEvent_ScheduledStartTimestamp;
  status: Lib_ChatPlatform_Contracts_ScheduledEvent_Status;
  userCount: Lib_ChatPlatform_Contracts_ScheduledEvent_UserCount;
};

export type Lib_ChatPlatform_Contracts_ScheduledEventEntityMetadata_Location = string | null;
export type Lib_ChatPlatform_Contracts_ScheduledEventEntityMetadata = {
  location: Lib_ChatPlatform_Contracts_ScheduledEventEntityMetadata_Location;
};

export type Lib_ChatPlatform_Contracts_SendableChannel_Send_Payload = Lib_ChatPlatform_Contracts_MessagePayload;
export type Lib_ChatPlatform_Contracts_SendableChannel_Send_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_SendableChannel = Lib_ChatPlatform_Contracts_Channel & {
  send(payload: Lib_ChatPlatform_Contracts_SendableChannel_Send_Payload): Lib_ChatPlatform_Contracts_SendableChannel_Send_Returns;
};

export type Lib_ChatPlatform_Contracts_ThreadChannel_SetArchived_Archived = boolean;
export type Lib_ChatPlatform_Contracts_ThreadChannel_SetArchived_Reason = string;
export type Lib_ChatPlatform_Contracts_ThreadChannel_SetArchived_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_ThreadChannel = Lib_ChatPlatform_Contracts_GuildChannel & {
  archived: boolean | null;
  setArchived(
    archived: Lib_ChatPlatform_Contracts_ThreadChannel_SetArchived_Archived,
    reason: Lib_ChatPlatform_Contracts_ThreadChannel_SetArchived_Reason,
  ): Lib_ChatPlatform_Contracts_ThreadChannel_SetArchived_Returns;
};

export type Lib_ChatPlatform_Contracts_User_Avatar = string | null;
export type Lib_ChatPlatform_Contracts_User_Bot = boolean;
export type Lib_ChatPlatform_Contracts_User_CreatedTimestamp = number;
export type Lib_ChatPlatform_Contracts_User_GlobalName = string | null;
export type Lib_ChatPlatform_Contracts_User_Id = Lib_ChatPlatform_Contracts_Identifier;
export type Lib_ChatPlatform_Contracts_User_System = boolean;
export type Lib_ChatPlatform_Contracts_User_Tag = string;
export type Lib_ChatPlatform_Contracts_User_Username = string;
export type Lib_ChatPlatform_Contracts_User_DisplayAvatarUrl_Returns = string;
export type Lib_ChatPlatform_Contracts_User_Send_Payload = Lib_ChatPlatform_Contracts_MessagePayload;
export type Lib_ChatPlatform_Contracts_User_Send_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_User = {
  avatar: Lib_ChatPlatform_Contracts_User_Avatar;
  bot: Lib_ChatPlatform_Contracts_User_Bot;
  createdTimestamp: Lib_ChatPlatform_Contracts_User_CreatedTimestamp;
  globalName: Lib_ChatPlatform_Contracts_User_GlobalName;
  id: Lib_ChatPlatform_Contracts_User_Id;
  system: Lib_ChatPlatform_Contracts_User_System;
  tag: Lib_ChatPlatform_Contracts_User_Tag;
  username: Lib_ChatPlatform_Contracts_User_Username;
  displayAvatarUrl(): Lib_ChatPlatform_Contracts_User_DisplayAvatarUrl_Returns;
  send(payload: Lib_ChatPlatform_Contracts_User_Send_Payload): Lib_ChatPlatform_Contracts_User_Send_Returns;
};

export type Lib_ChatPlatform_Contracts_VoiceChannel = Lib_ChatPlatform_Contracts_GuildChannel;

export type Lib_ChatPlatform_Contracts_VoiceState_ChannelId = Lib_ChatPlatform_Contracts_Identifier | null;
export type Lib_ChatPlatform_Contracts_VoiceState_Disconnect_Reason = string;
export type Lib_ChatPlatform_Contracts_VoiceState_Disconnect_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_VoiceState_SetChannel_Channel = Lib_ChatPlatform_Contracts_VoiceChannel;
export type Lib_ChatPlatform_Contracts_VoiceState_SetChannel_Reason = string;
export type Lib_ChatPlatform_Contracts_VoiceState_SetChannel_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_VoiceState = {
  channelId: Lib_ChatPlatform_Contracts_VoiceState_ChannelId;
  disconnect(reason: Lib_ChatPlatform_Contracts_VoiceState_Disconnect_Reason): Lib_ChatPlatform_Contracts_VoiceState_Disconnect_Returns;
  setChannel(
    channel: Lib_ChatPlatform_Contracts_VoiceState_SetChannel_Channel,
    reason: Lib_ChatPlatform_Contracts_VoiceState_SetChannel_Reason,
  ): Lib_ChatPlatform_Contracts_VoiceState_SetChannel_Returns;
};

export type Lib_ChatPlatform_Contracts_Webhook_Destroy_Returns = void;
export type Lib_ChatPlatform_Contracts_Webhook_Send_Payload = Lib_ChatPlatform_Contracts_MessagePayload;
export type Lib_ChatPlatform_Contracts_Webhook_Send_Returns = Promise<void>;
export type Lib_ChatPlatform_Contracts_Webhook = {
  destroy(): Lib_ChatPlatform_Contracts_Webhook_Destroy_Returns;
  send(payload: Lib_ChatPlatform_Contracts_Webhook_Send_Payload): Lib_ChatPlatform_Contracts_Webhook_Send_Returns;
};

export type Lib_ChatPlatform_Contracts_WebhookOptions_Url = string;
export type Lib_ChatPlatform_Contracts_WebhookOptions = {
  url: Lib_ChatPlatform_Contracts_WebhookOptions_Url;
};
