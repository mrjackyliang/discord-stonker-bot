import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  GuildScheduledEventEntityType,
  GuildScheduledEventStatus,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  REST,
  RESTEvents,
  Routes,
  WebhookClient,
} from 'discord.js';

import { chatPlatformEvents } from './contracts.js';

import type {
  Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Command,
  Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Options,
  Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommandOption_Option,
  Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommandOption_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordAttachment_Attachment,
  Lib_ChatPlatform_Discord_AdaptDiscordAttachment_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_Adapted,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_Channel,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_Guild,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_GuildIdentifier,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_Name,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_ParentIdentifier,
  Lib_ChatPlatform_Discord_AdaptDiscordChannel_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordClient_Client,
  Lib_ChatPlatform_Discord_AdaptDiscordClient_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_Collection,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_Filtered,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_FirstValues,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_Get_Value,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_Mapper,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordCollection_Values,
  Lib_ChatPlatform_Discord_AdaptDiscordEmbed_Embed,
  Lib_ChatPlatform_Discord_AdaptDiscordEmbed_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordEmoji_Emoji,
  Lib_ChatPlatform_Discord_AdaptDiscordEmoji_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordGuild_BanResult,
  Lib_ChatPlatform_Discord_AdaptDiscordGuild_Guild,
  Lib_ChatPlatform_Discord_AdaptDiscordGuild_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordGuild_Role,
  Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Adapted,
  Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Channel,
  Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Channel,
  Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Interaction,
  Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordMember_Member,
  Lib_ChatPlatform_Discord_AdaptDiscordMember_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordMessage_Adapted,
  Lib_ChatPlatform_Discord_AdaptDiscordMessage_Message,
  Lib_ChatPlatform_Discord_AdaptDiscordMessage_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordMessagePayload_Payload,
  Lib_ChatPlatform_Discord_AdaptDiscordMessagePayload_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordPartialUser_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordPartialUser_User,
  Lib_ChatPlatform_Discord_AdaptDiscordPermissions_Permissions,
  Lib_ChatPlatform_Discord_AdaptDiscordPermissions_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordRest_Rest,
  Lib_ChatPlatform_Discord_AdaptDiscordRest_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordRole_Adapted,
  Lib_ChatPlatform_Discord_AdaptDiscordRole_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordRole_Role,
  Lib_ChatPlatform_Discord_AdaptDiscordScheduledEvent_Event,
  Lib_ChatPlatform_Discord_AdaptDiscordScheduledEvent_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordUser_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordUser_User,
  Lib_ChatPlatform_Discord_AdaptDiscordWebhook_Returns,
  Lib_ChatPlatform_Discord_AdaptDiscordWebhook_Webhook,
  Lib_ChatPlatform_Discord_AdaptDiscordWebhookPayload_Payload,
  Lib_ChatPlatform_Discord_AdaptDiscordWebhookPayload_Returns,
  Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Allow,
  Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Deny,
  Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Entries,
  Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Flag,
  Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Permissions,
  Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Returns,
  Lib_ChatPlatform_Discord_CreateChatPlatformClient_Client,
  Lib_ChatPlatform_Discord_CreateChatPlatformClient_Intents,
  Lib_ChatPlatform_Discord_CreateChatPlatformClient_Options,
  Lib_ChatPlatform_Discord_CreateChatPlatformClient_Returns,
  Lib_ChatPlatform_Discord_CreateChatPlatformRest_Options,
  Lib_ChatPlatform_Discord_CreateChatPlatformRest_Rest,
  Lib_ChatPlatform_Discord_CreateChatPlatformRest_Returns,
  Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Options,
  Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Returns,
  Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Webhook,
  Lib_ChatPlatform_Discord_IsChatPlatformPermissionName_PermissionName,
  Lib_ChatPlatform_Discord_IsChatPlatformPermissionName_Returns,
  Lib_ChatPlatform_Discord_ListChatPlatformPermissionNames_Returns,
  Lib_ChatPlatform_Discord_MapDiscordIntent_Intent,
  Lib_ChatPlatform_Discord_MapDiscordIntent_Returns,
  Lib_ChatPlatform_Discord_MapDiscordPermission_PermissionName,
  Lib_ChatPlatform_Discord_MapDiscordPermission_Returns,
  Lib_ChatPlatform_Discord_MapDiscordPermission_Value,
  Lib_ChatPlatform_Discord_RawChannels,
  Lib_ChatPlatform_Discord_RawRoles,
  Lib_ChatPlatform_Discord_RegisterDiscordEvent_AdaptedClient,
  Lib_ChatPlatform_Discord_RegisterDiscordEvent_Client,
  Lib_ChatPlatform_Discord_RegisterDiscordEvent_EventName,
  Lib_ChatPlatform_Discord_RegisterDiscordEvent_Listener,
  Lib_ChatPlatform_Discord_RegisterDiscordEvent_Returns,
  Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_AdaptedClient,
  Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Client,
  Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_EventName,
  Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Listener,
  Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Returns,
  Lib_ChatPlatform_Discord_UnwrapDiscordChannel_Channel,
  Lib_ChatPlatform_Discord_UnwrapDiscordChannel_RawChannel,
  Lib_ChatPlatform_Discord_UnwrapDiscordChannel_Returns,
  Lib_ChatPlatform_Discord_UnwrapDiscordChannel_VoiceReturns,
  Lib_ChatPlatform_Discord_UnwrapDiscordRole_RawRole,
  Lib_ChatPlatform_Discord_UnwrapDiscordRole_Returns,
  Lib_ChatPlatform_Discord_UnwrapDiscordRole_Role,
  Lib_ChatPlatform_Discord_UnwrapDiscordRoles_Returns,
  Lib_ChatPlatform_Discord_UnwrapDiscordRoles_Roles,
} from '../../types/lib/chat-platform/discord.d.ts';
import type {
  Lib_ChatPlatform_Contracts_GuildManager_Fetch_GuildIdentifier,
  Lib_ChatPlatform_Contracts_GuildMessage,
  Lib_ChatPlatform_Contracts_ScheduledEvent_EntityType,
  Lib_ChatPlatform_Contracts_ScheduledEvent_Status,
  Lib_ChatPlatform_Contracts_SendableChannel,
  Lib_ChatPlatform_Contracts_ThreadChannel,
  Lib_ChatPlatform_Contracts_VoiceChannel,
} from '../../types/lib/chat-platform/index.d.ts';

/**
 * Discord - Raw Channels.
 *
 * Keeps provider objects private while project channel wrappers perform
 * mutations that require the original discord.js instances.
 *
 * @since 4.2.1
 */
const rawChannels: Lib_ChatPlatform_Discord_RawChannels = new WeakMap();

/**
 * Discord - Raw Roles.
 *
 * Associates project roles with the SDK roles needed by hierarchy-preserving
 * member mutations without placing provider values on the public contract.
 *
 * @since 4.2.1
 */
const rawRoles: Lib_ChatPlatform_Discord_RawRoles = new WeakMap();

/**
 * Discord - Adapt Discord Application Command.
 *
 * Converts one project command declaration to the exact discord.js shape used
 * by the guild command manager.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Command} command - Command.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordApplicationCommand(
  command: Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Command,
): Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Returns {
  let options: Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommand_Options = undefined;

  if (command['options'] !== undefined) {
    options = command['options'].map((option) => adaptDiscordApplicationCommandOption(option));
  }

  return {
    contexts: command['contexts'].map(() => InteractionContextType.Guild),
    defaultMemberPermissions: mapDiscordPermission(command['defaultMemberPermissions']),
    description: command['description'],
    integrationTypes: command['integrationTypes'].map(() => ApplicationIntegrationType.GuildInstall),
    name: command['name'],
    ...(options === undefined) ? {} : {
      options,
    },
  };
}

/**
 * Discord - Adapt Discord Application Command Option.
 *
 * Maps project option names to Discord numeric option and channel values while
 * retaining the original ordering and bounds.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommandOption_Option} option - Option.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommandOption_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordApplicationCommandOption(
  option: Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommandOption_Option,
): Lib_ChatPlatform_Discord_AdaptDiscordApplicationCommandOption_Returns {
  switch (option['type']) {
    case 'boolean': {
      return {
        description: option['description'],
        name: option['name'],
        required: option['required'],
        type: ApplicationCommandOptionType.Boolean,
      };
    }

    case 'channel': {
      return {
        ...(option['channelTypes'] === undefined) ? {} : {
          channelTypes: option['channelTypes'].map((channelType) => (
            channelType === 'guild-voice'
          ) ? ChannelType.GuildVoice : ChannelType.GuildStageVoice),
        },
        description: option['description'],
        name: option['name'],
        required: option['required'],
        type: ApplicationCommandOptionType.Channel,
      };
    }

    case 'integer': {
      return {
        description: option['description'],
        ...(option['maxValue'] === undefined) ? {} : {
          maxValue: option['maxValue'],
        },
        ...(option['minValue'] === undefined) ? {} : {
          minValue: option['minValue'],
        },
        name: option['name'],
        required: option['required'],
        type: ApplicationCommandOptionType.Integer,
      };
    }

    case 'role': {
      return {
        description: option['description'],
        name: option['name'],
        required: option['required'],
        type: ApplicationCommandOptionType.Role,
      };
    }

    case 'user': {
      return {
        description: option['description'],
        name: option['name'],
        required: option['required'],
        type: ApplicationCommandOptionType.User,
      };
    }

    default: {
      return {
        ...(option['choices'] === undefined) ? {} : {
          choices: option['choices'],
        },
        description: option['description'],
        ...(option['maxLength'] === undefined) ? {} : {
          maxLength: option['maxLength'],
        },
        name: option['name'],
        required: option['required'],
        type: ApplicationCommandOptionType.String,
      };
    }
  }
}

/**
 * Discord - Adapt Discord Attachment.
 *
 * Copies only the attachment metadata used by routing and audit features.
 * Provider collection and download behavior never crosses the adapter.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordAttachment_Attachment} attachment - Attachment.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordAttachment_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordAttachment(
  attachment: Lib_ChatPlatform_Discord_AdaptDiscordAttachment_Attachment,
): Lib_ChatPlatform_Discord_AdaptDiscordAttachment_Returns {
  return {
    name: attachment['name'],
    url: attachment['url'],
  };
}

/**
 * Discord - Adapt Discord Channel.
 *
 * Presents one Discord channel through project data and bounded operations.
 * Send, thread, and voice checks stay delegated to discord.js type guards.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordChannel_Channel} channel - Channel.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordChannel_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordChannel(
  channel: Lib_ChatPlatform_Discord_AdaptDiscordChannel_Channel,
): Lib_ChatPlatform_Discord_AdaptDiscordChannel_Returns {
  let guild: Lib_ChatPlatform_Discord_AdaptDiscordChannel_Guild = undefined;
  let guildIdentifier: Lib_ChatPlatform_Discord_AdaptDiscordChannel_GuildIdentifier = null;
  let name: Lib_ChatPlatform_Discord_AdaptDiscordChannel_Name = '';
  let parentIdentifier: Lib_ChatPlatform_Discord_AdaptDiscordChannel_ParentIdentifier = null;

  if (channel.isDMBased() === false) {
    guild = adaptDiscordGuild(channel['guild']);
    guildIdentifier = channel['guildId'];
    name = channel['name'];
  }

  if (channel.isThread() === true) {
    parentIdentifier = channel['parentId'];
  }

  const adapted: Lib_ChatPlatform_Discord_AdaptDiscordChannel_Adapted = {
    archived: (channel.isThread() === true) ? channel['archived'] : null,
    guild,
    guildId: guildIdentifier,
    id: channel['id'],
    isRegistryChannel: () => (
      channel.isTextBased()
      || channel['type'] === ChannelType.GuildForum
      || channel['type'] === ChannelType.GuildMedia
    ),
    isSendable: function isSendable(): this is Lib_ChatPlatform_Contracts_SendableChannel {
      return channel.isSendable();
    },
    isThread: function isThread(): this is Lib_ChatPlatform_Contracts_ThreadChannel {
      return channel.isThread();
    },
    isVoiceBased: function isVoiceBased(): this is Lib_ChatPlatform_Contracts_VoiceChannel {
      return channel.isVoiceBased();
    },
    name,
    parentId: parentIdentifier,
    send: async (payload) => {
      if (channel.isSendable() === false) {
        throw new Error('Discord channel is not sendable.');
      }

      await channel.send(adaptDiscordMessagePayload(payload));

      return;
    },
    setArchived: async (archived, reason) => {
      if (channel.isThread() === false) {
        throw new Error('Discord channel is not a thread.');
      }

      await channel.setArchived(archived, reason);

      return;
    },
    type: channel['type'],
  };

  rawChannels.set(adapted, channel);

  return adapted;
}

/**
 * Discord - Adapt Discord Client.
 *
 * Wraps lifecycle, caches, REST, and normalized Gateway events in the one
 * project client contract consumed by feature modules and service bootstrap.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordClient_Client} client - Client.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordClient_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordClient(
  client: Lib_ChatPlatform_Discord_AdaptDiscordClient_Client,
): Lib_ChatPlatform_Discord_AdaptDiscordClient_Returns {
  return {
    get application() {
      if (client['application'] === null) {
        return null;
      }

      return {
        id: client['application']['id'],
      };
    },
    destroy: () => {
      client.destroy();

      return;
    },
    get guilds() {
      return {
        cache: adaptDiscordCollection(client['guilds']['cache'], adaptDiscordGuild),
        fetch: async (guildIdentifier: Lib_ChatPlatform_Contracts_GuildManager_Fetch_GuildIdentifier) => {
          const guild: Lib_ChatPlatform_Discord_AdaptDiscordGuild_Guild = await client['guilds'].fetch(
            guildIdentifier,
          );

          return adaptDiscordGuild(guild);
        },
      };
    },
    login: async (token) => client.login(token),
    on: function on(eventName, listener) {
      registerDiscordEvent(client, eventName, listener, this);

      return this;
    },
    once: function once(eventName, listener) {
      registerDiscordOnceEvent(client, eventName, listener, this);

      return this;
    },
    rest: adaptDiscordRest(client['rest']),
    get user() {
      if (client['user'] === null) {
        return null;
      }

      return adaptDiscordUser(client['user']);
    },
  };
}

/**
 * Discord - Adapt Discord Collection.
 *
 * Keeps collection reads live while mapping each exposed value to a project
 * object at the moment the feature asks for it.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordCollection_Collection} collection - Collection.
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordCollection_Mapper}     mapper     - Mapper.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordCollection_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordCollection<RawValue, AdaptedValue>(
  collection: Lib_ChatPlatform_Discord_AdaptDiscordCollection_Collection<RawValue>,
  mapper: Lib_ChatPlatform_Discord_AdaptDiscordCollection_Mapper<RawValue, AdaptedValue>,
): Lib_ChatPlatform_Discord_AdaptDiscordCollection_Returns<AdaptedValue> {
  return {
    filter: (predicate) => {
      const filtered: Lib_ChatPlatform_Discord_AdaptDiscordCollection_Filtered<RawValue> = collection.filter(
        (value) => predicate(mapper(value)),
      );

      return adaptDiscordCollection(filtered, mapper);
    },
    first: (count) => {
      const firstValues: Lib_ChatPlatform_Discord_AdaptDiscordCollection_FirstValues<RawValue> = collection.first(count);

      return firstValues.map((value) => mapper(value));
    },
    get: (identifier) => {
      const value: Lib_ChatPlatform_Discord_AdaptDiscordCollection_Get_Value<RawValue> = collection.get(identifier);

      if (value === undefined) {
        return undefined;
      }

      return mapper(value);
    },
    has: (identifier) => collection.has(identifier),
    keys: () => collection.keys(),
    map: (mapValue) => {
      const values: Lib_ChatPlatform_Discord_AdaptDiscordCollection_Values<RawValue> = [...collection.values()];

      return values.map((value) => mapValue(mapper(value)));
    },
    get size() {
      return collection['size'];
    },
    some: (predicate) => collection.some((value) => predicate(mapper(value))),
  };
}

/**
 * Discord - Adapt Discord Embed.
 *
 * Converts received SDK embed builders to plain API data before a proxy
 * feature can relay them through another project-owned sender.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordEmbed_Embed} embed - Embed.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordEmbed_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordEmbed(
  embed: Lib_ChatPlatform_Discord_AdaptDiscordEmbed_Embed,
): Lib_ChatPlatform_Discord_AdaptDiscordEmbed_Returns {
  return embed.toJSON();
}

/**
 * Discord - Adapt Discord Emoji.
 *
 * Exposes only identifiers and optional names for bounded server summaries.
 * Emoji assets and SDK collection behavior remain private.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordEmoji_Emoji} emoji - Emoji.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordEmoji_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordEmoji(
  emoji: Lib_ChatPlatform_Discord_AdaptDiscordEmoji_Emoji,
): Lib_ChatPlatform_Discord_AdaptDiscordEmoji_Returns {
  return {
    id: emoji['id'],
    name: emoji['name'],
  };
}

/**
 * Discord - Adapt Discord Guild.
 *
 * Normalizes guild data and manager operations while leaving cache freshness,
 * fetches, hierarchy checks, and rate limits under discord.js ownership.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordGuild_Guild} guild - Guild.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordGuild_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordGuild(
  guild: Lib_ChatPlatform_Discord_AdaptDiscordGuild_Guild,
): Lib_ChatPlatform_Discord_AdaptDiscordGuild_Returns {
  return {
    channels: {
      get cache() {
        return adaptDiscordCollection(guild['channels']['cache'], adaptDiscordGuildChannel);
      },
      fetch: async (channelIdentifier) => {
        const channel: Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Channel = await guild['channels'].fetch(
          channelIdentifier,
        );

        if (channel === null) {
          return null;
        }

        return adaptDiscordGuildChannel(channel);
      },
    },
    commands: {
      set: async (commands) => {
        await guild['commands'].set(commands.map((command) => adaptDiscordApplicationCommand(command)));

        return;
      },
    },
    emojis: {
      get cache() {
        return adaptDiscordCollection(guild['emojis']['cache'], adaptDiscordEmoji);
      },
      fetch: async () => {
        await guild['emojis'].fetch();

        return;
      },
    },
    icon: guild['icon'],
    id: guild['id'],
    memberCount: guild['memberCount'],
    members: {
      ban: async (identifier, options) => {
        const banResult: Lib_ChatPlatform_Discord_AdaptDiscordGuild_BanResult = await guild['members'].ban(
          identifier,
          options,
        );

        if (typeof banResult === 'string') {
          return banResult;
        }

        if ('guild' in banResult) {
          return adaptDiscordMember(banResult);
        }

        return adaptDiscordUser(banResult);
      },
      get cache() {
        return adaptDiscordCollection(guild['members']['cache'], adaptDiscordMember);
      },
      fetch: async (identifier) => adaptDiscordMember(await guild['members'].fetch(identifier)),
      get me() {
        if (guild['members']['me'] === null) {
          return null;
        }

        return adaptDiscordMember(guild['members']['me']);
      },
    },
    name: guild['name'],
    ownerId: guild['ownerId'],
    roles: {
      get cache() {
        return adaptDiscordCollection(guild['roles']['cache'], adaptDiscordRole);
      },
      fetch: async (roleIdentifier) => {
        const role: Lib_ChatPlatform_Discord_AdaptDiscordGuild_Role = await guild['roles'].fetch(roleIdentifier);

        if (role === null) {
          return null;
        }

        return adaptDiscordRole(role);
      },
    },
  };
}

/**
 * Discord - Adapt Discord Guild Channel.
 *
 * Narrows a provider guild channel after the shared channel mapper has attached
 * every supported operation and the current guild context.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Channel} channel - Channel.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordGuildChannel(
  channel: Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Channel,
): Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Returns {
  const adapted: Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Adapted = adaptDiscordChannel(channel);
  const guildChannel: Lib_ChatPlatform_Discord_AdaptDiscordGuildChannel_Returns = {
    ...adapted,
    guild: adaptDiscordGuild(channel['guild']),
    guildId: channel['guildId'],
  };

  rawChannels.set(guildChannel, channel);

  return Object.assign(guildChannel);
}

/**
 * Discord - Adapt Discord Interaction.
 *
 * Wraps cached guild chat commands with project users, members, roles, channels,
 * replies, and option readers while preserving Discord response timing.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Interaction} interaction - Interaction.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordInteraction(
  interaction: Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Interaction,
): Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Returns {
  return {
    client: {
      user: adaptDiscordUser(interaction['client']['user']),
    },
    commandName: interaction['commandName'],
    deferReply: async () => {
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });

      return;
    },
    get deferred() {
      return interaction['deferred'];
    },
    editReply: async (content) => {
      await interaction.editReply(content);

      return;
    },
    guild: adaptDiscordGuild(interaction['guild']),
    guildId: interaction['guildId'],
    inCachedGuild: () => true,
    isChatInputCommand: () => true,
    member: adaptDiscordMember(interaction['member']),
    options: {
      getBoolean: (name, required) => interaction['options'].getBoolean(name, required),
      getChannel: (name) => {
        const channel: Lib_ChatPlatform_Discord_AdaptDiscordInteraction_Channel = interaction['options'].getChannel(
          name,
        );

        if (channel === null || channel.isDMBased() === true) {
          return null;
        }

        return adaptDiscordGuildChannel(channel);
      },
      getInteger: (name) => interaction['options'].getInteger(name),
      getRole: (name, required) => adaptDiscordRole(interaction['options'].getRole(name, required)),
      getString: (name, required) => interaction['options'].getString(name, required),
      getUser: (name, required) => adaptDiscordUser(interaction['options'].getUser(name, required)),
    },
    get replied() {
      return interaction['replied'];
    },
    reply: async (options) => {
      await interaction.reply({
        ...(options['content'] === undefined) ? {} : {
          content: options['content'],
        },
        flags: MessageFlags.Ephemeral,
      });

      return;
    },
    user: adaptDiscordUser(interaction['user']),
  };
}

/**
 * Discord - Adapt Discord Member.
 *
 * Provides identity, roles, permissions, moderation, and voice operations as a
 * project object. Cache-backed fields read the live SDK member when accessed.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordMember_Member} member - Member.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordMember_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordMember(
  member: Lib_ChatPlatform_Discord_AdaptDiscordMember_Member,
): Lib_ChatPlatform_Discord_AdaptDiscordMember_Returns {
  return {
    ban: async (options) => adaptDiscordMember(await member.ban(options)),
    get bannable() {
      return member['bannable'];
    },
    get displayName() {
      return member['displayName'];
    },
    guild: adaptDiscordGuild(member['guild']),
    id: member['id'],
    get manageable() {
      return member['manageable'];
    },
    get nickname() {
      return member['nickname'];
    },
    get pending() {
      return member['pending'];
    },
    get permissions() {
      return adaptDiscordPermissions(member['permissions']);
    },
    roles: {
      add: async (roles, reason) => {
        await member['roles'].add(unwrapDiscordRoles(roles), reason);

        return;
      },
      get cache() {
        return adaptDiscordCollection(member['roles']['cache'], adaptDiscordRole);
      },
      get highest() {
        return adaptDiscordRole(member['roles']['highest']);
      },
      remove: async (roles, reason) => {
        await member['roles'].remove(unwrapDiscordRoles(roles), reason);

        return;
      },
    },
    user: adaptDiscordUser(member['user']),
    voice: {
      get channelId() {
        return member['voice']['channelId'];
      },
      disconnect: async (reason) => {
        await member['voice'].disconnect(reason);

        return;
      },
      setChannel: async (channel, reason) => {
        const rawChannel: Lib_ChatPlatform_Discord_UnwrapDiscordChannel_VoiceReturns = unwrapDiscordChannel(
          channel,
        ) as Lib_ChatPlatform_Discord_UnwrapDiscordChannel_VoiceReturns;

        await member['voice'].setChannel(rawChannel, reason);

        return;
      },
    },
  };
}

/**
 * Discord - Adapt Discord Message.
 *
 * Copies message data used by features and routes sends, replies, and deletes
 * through closures over the provider message.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordMessage_Message} message - Message.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordMessage_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordMessage(
  message: Lib_ChatPlatform_Discord_AdaptDiscordMessage_Message,
): Lib_ChatPlatform_Discord_AdaptDiscordMessage_Returns {
  const adapted: Lib_ChatPlatform_Discord_AdaptDiscordMessage_Adapted = {
    attachments: adaptDiscordCollection(message['attachments'], adaptDiscordAttachment),
    author: (message['author'] === null) ? null : adaptDiscordUser(message['author']),
    channel: adaptDiscordChannel(message['channel']),
    channelId: message['channelId'],
    content: message['content'],
    createdAt: message['createdAt'],
    delete: async () => {
      await message.delete();

      return;
    },
    embeds: message['embeds'].map((embed) => adaptDiscordEmbed(embed)),
    guild: (message['guild'] === null) ? null : adaptDiscordGuild(message['guild']),
    guildId: message['guildId'],
    id: message['id'],
    inGuild: function inGuild(): this is Lib_ChatPlatform_Contracts_GuildMessage {
      return message.inGuild();
    },
    member: (message['member'] === null) ? null : adaptDiscordMember(message['member']),
    partial: message['partial'],
    reply: async (options) => {
      await message.reply(adaptDiscordMessagePayload(options));

      return;
    },
    system: message['system'],
    url: message['url'],
    webhookId: message['webhookId'],
  };

  if (message.inGuild() === true) {
    Reflect.set(adapted, 'channel', adaptDiscordGuildChannel(message['channel']));
  }

  return adapted;
}

/**
 * Discord - Adapt Discord Message Payload.
 *
 * Translates the project payload names to Discord message options without
 * changing content, mention suppression, embed order, or reply behavior.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordMessagePayload_Payload} payload - Payload.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordMessagePayload_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordMessagePayload(
  payload: Lib_ChatPlatform_Discord_AdaptDiscordMessagePayload_Payload,
): Lib_ChatPlatform_Discord_AdaptDiscordMessagePayload_Returns {
  return {
    ...(payload['allowedMentions'] === undefined) ? {} : {
      allowedMentions: payload['allowedMentions'],
    },
    ...(payload['content'] === undefined) ? {} : {
      content: payload['content'],
    },
    ...(payload['embeds'] === undefined) ? {} : {
      embeds: payload['embeds'],
    },
  };
}

/**
 * Discord - Adapt Discord Partial User.
 *
 * Preserves the optional old username from user-update cache snapshots while
 * exposing the stable identity fields used by comparison features.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordPartialUser_User} user - User.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordPartialUser_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordPartialUser(
  user: Lib_ChatPlatform_Discord_AdaptDiscordPartialUser_User,
): Lib_ChatPlatform_Discord_AdaptDiscordPartialUser_Returns {
  return {
    avatar: user['avatar'],
    bot: user['bot'],
    createdTimestamp: user['createdTimestamp'],
    globalName: user['globalName'],
    id: user['id'],
    system: user['system'],
    tag: user['tag'],
    username: user['username'],
  };
}

/**
 * Discord - Adapt Discord Permissions.
 *
 * Accepts project permission names and lets discord.js perform administrator
 * expansion and bitfield membership decisions.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordPermissions_Permissions} permissions - Permissions.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordPermissions_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordPermissions(
  permissions: Lib_ChatPlatform_Discord_AdaptDiscordPermissions_Permissions,
): Lib_ChatPlatform_Discord_AdaptDiscordPermissions_Returns {
  return {
    has: (permissionName) => permissions.has(mapDiscordPermission(permissionName)),
  };
}

/**
 * Discord - Adapt Discord Rest.
 *
 * Owns Discord route construction, HTTP verbs, payload naming, reaction
 * encoding, invite requests, permission overwrites, and rate-limit events.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordRest_Rest} rest - Rest.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordRest_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordRest(
  rest: Lib_ChatPlatform_Discord_AdaptDiscordRest_Rest,
): Lib_ChatPlatform_Discord_AdaptDiscordRest_Returns {
  return {
    createInvite: async (channelIdentifier, options, reason) => rest.post(
      Routes.channelInvites(channelIdentifier),
      {
        body: {
          max_age: options['maxAgeSeconds'],
          max_uses: options['maxUses'],
          temporary: false,
          unique: true,
        },
        reason,
      },
    ),
    createMessage: async (channelIdentifier, payload) => rest.post(
      Routes.channelMessages(channelIdentifier),
      {
        body: {
          allowed_mentions: {
            parse: (payload['allowedMentions'] === undefined) ? [] : payload['allowedMentions']['parse'],
          },
          content: payload['content'],
        },
      },
    ),
    createOwnReaction: async (channelIdentifier, messageIdentifier, reaction) => {
      await rest.put(Routes.channelMessageOwnReaction(
        channelIdentifier,
        messageIdentifier,
        encodeURIComponent(reaction),
      ));

      return;
    },
    editChannelPermission: async (channelIdentifier, targetIdentifier, overwrite, reason) => {
      await rest.put(
        Routes.channelPermission(channelIdentifier, targetIdentifier),
        {
          body: {
            allow: overwrite['allow'],
            deny: overwrite['deny'],
            type: (overwrite['targetType'] === 'role') ? 0 : 1,
          },
          reason,
        },
      );

      return;
    },
    getGuild: async (guildIdentifier, withCounts) => rest.get(
      Routes.guild(guildIdentifier),
      {
        query: new URLSearchParams({
          with_counts: String(withCounts),
        }),
      },
    ),
    onRateLimited: (listener) => {
      rest.on(RESTEvents.RateLimited, (rateLimit) => {
        listener({
          global: rateLimit['global'],
          limit: rateLimit['limit'],
          method: rateLimit['method'],
          retryAfter: rateLimit['retryAfter'],
          route: rateLimit['route'],
          scope: rateLimit['scope'],
        });

        return;
      });

      return;
    },
  };
}

/**
 * Discord - Adapt Discord Role.
 *
 * Copies role identity and hierarchy fields, reads the editable check only when
 * asked, and retains a private link for later member add and remove calls.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordRole_Role} role - Role.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordRole_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordRole(
  role: Lib_ChatPlatform_Discord_AdaptDiscordRole_Role,
): Lib_ChatPlatform_Discord_AdaptDiscordRole_Returns {
  const adapted: Lib_ChatPlatform_Discord_AdaptDiscordRole_Adapted = {
    get editable() {
      return role['editable'];
    },
    id: role['id'],
    managed: role['managed'],
    name: role['name'],
    position: role['position'],
  };

  rawRoles.set(adapted, role);

  return adapted;
}

/**
 * Discord - Adapt Discord Scheduled Event.
 *
 * Normalizes numeric provider entity and status enums before broadcast
 * features evaluate archived rules and format messages.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordScheduledEvent_Event} event - Event.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordScheduledEvent_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordScheduledEvent(
  event: Lib_ChatPlatform_Discord_AdaptDiscordScheduledEvent_Event,
): Lib_ChatPlatform_Discord_AdaptDiscordScheduledEvent_Returns {
  let entityType: Lib_ChatPlatform_Contracts_ScheduledEvent_EntityType = 'EXTERNAL';
  let status: Lib_ChatPlatform_Contracts_ScheduledEvent_Status = 'SCHEDULED';

  if (event['entityType'] === GuildScheduledEventEntityType.StageInstance) {
    entityType = 'STAGE_INSTANCE';
  } else if (event['entityType'] === GuildScheduledEventEntityType.Voice) {
    entityType = 'VOICE';
  }

  if (event['status'] === GuildScheduledEventStatus.Active) {
    status = 'ACTIVE';
  } else if (event['status'] === GuildScheduledEventStatus.Completed) {
    status = 'COMPLETED';
  } else if (event['status'] === GuildScheduledEventStatus.Canceled) {
    status = 'CANCELED';
  }

  return {
    channelId: event['channelId'],
    creatorId: event['creatorId'],
    description: event['description'],
    entityMetadata: event['entityMetadata'],
    entityType,
    guildId: event['guildId'],
    id: event['id'],
    name: event['name'],
    scheduledStartTimestamp: event['scheduledStartTimestamp'],
    status,
    userCount: event['userCount'],
  };
}

/**
 * Discord - Adapt Discord User.
 *
 * Exposes identity, avatar, and direct-message operations without allowing SDK
 * user objects to enter feature modules.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordUser_User} user - User.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordUser_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordUser(
  user: Lib_ChatPlatform_Discord_AdaptDiscordUser_User,
): Lib_ChatPlatform_Discord_AdaptDiscordUser_Returns {
  return {
    avatar: user['avatar'],
    bot: user['bot'],
    createdTimestamp: user['createdTimestamp'],
    globalName: user['globalName'],
    displayAvatarUrl: () => user.displayAvatarURL(),
    id: user['id'],
    send: async (payload) => {
      await user.send(adaptDiscordMessagePayload(payload));

      return;
    },
    system: user['system'],
    tag: user['tag'],
    username: user['username'],
  };
}

/**
 * Discord - Adapt Discord Webhook.
 *
 * Routes webhook sends and cleanup through a project sender while retaining
 * discord.js rate-limit and request behavior.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordWebhook_Webhook} webhook - Webhook.
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordWebhook_Returns}
 *
 * @since 4.2.1
 */
export function adaptDiscordWebhook(
  webhook: Lib_ChatPlatform_Discord_AdaptDiscordWebhook_Webhook,
): Lib_ChatPlatform_Discord_AdaptDiscordWebhook_Returns {
  return {
    destroy: () => {
      webhook.destroy();

      return;
    },
    send: async (payload) => {
      await webhook.send(adaptDiscordWebhookPayload(payload));

      return;
    },
  };
}

/**
 * Discord - Adapt Discord Webhook Payload.
 *
 * Maps the project avatar name to the provider field while preserving optional
 * content, embeds, username, and mention suppression.
 *
 * @param {Lib_ChatPlatform_Discord_AdaptDiscordWebhookPayload_Payload} payload - Payload.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_AdaptDiscordWebhookPayload_Returns}
 *
 * @since 4.2.1
 */
function adaptDiscordWebhookPayload(
  payload: Lib_ChatPlatform_Discord_AdaptDiscordWebhookPayload_Payload,
): Lib_ChatPlatform_Discord_AdaptDiscordWebhookPayload_Returns {
  return {
    ...(payload['allowedMentions'] === undefined) ? {} : {
      allowedMentions: payload['allowedMentions'],
    },
    ...(payload['avatarUrl'] === undefined) ? {} : {
      avatarURL: payload['avatarUrl'],
    },
    ...(payload['content'] === undefined) ? {} : {
      content: payload['content'],
    },
    ...(payload['embeds'] === undefined) ? {} : {
      embeds: payload['embeds'],
    },
    ...(payload['username'] === undefined) ? {} : {
      username: payload['username'],
    },
  };
}

/**
 * Discord - Compile Chat Platform Permission Overwrite.
 *
 * Resolves project permission names to precision-safe allow and deny strings.
 * Unsupported names fail before a worker can enqueue or send an overwrite.
 *
 * @param {Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Permissions} permissions - Permissions.
 *
 * @returns {Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Returns}
 *
 * @since 4.2.1
 */
export function compileChatPlatformPermissionOverwrite(
  permissions: Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Permissions,
): Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Returns {
  let allow: Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Allow = 0n;
  let deny: Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Deny = 0n;
  const entries: Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Entries = Object.entries(
    permissions,
  );

  for (const entry of entries) {
    const flag: Lib_ChatPlatform_Discord_CompileChatPlatformPermissionOverwrite_Flag = mapDiscordPermission(entry[0]);

    if (entry[1] === true) {
      allow += flag;
    } else {
      deny += flag;
    }
  }

  return {
    allow: allow.toString(),
    deny: deny.toString(),
  };
}

/**
 * Discord - Create Chat Platform Client.
 *
 * Creates the only discord.js Gateway client in application source and maps
 * project intent names before any network connection begins.
 *
 * @param {Lib_ChatPlatform_Discord_CreateChatPlatformClient_Options} options - Options.
 *
 * @returns {Lib_ChatPlatform_Discord_CreateChatPlatformClient_Returns}
 *
 * @since 4.2.1
 */
export function createChatPlatformClient(
  options: Lib_ChatPlatform_Discord_CreateChatPlatformClient_Options,
): Lib_ChatPlatform_Discord_CreateChatPlatformClient_Returns {
  const intents: Lib_ChatPlatform_Discord_CreateChatPlatformClient_Intents = options['intents'].map(
    (intent) => mapDiscordIntent(intent),
  );
  const client: Lib_ChatPlatform_Discord_CreateChatPlatformClient_Client = new Client({
    intents,
    shardCount: options['shardCount'],
  });

  return adaptDiscordClient(client);
}

/**
 * Discord - Create Chat Platform Rest.
 *
 * Creates a version-ten Discord REST client with its token confined to the
 * adapter and returns only project operations to workers and routes.
 *
 * @param {Lib_ChatPlatform_Discord_CreateChatPlatformRest_Options} options - Options.
 *
 * @returns {Lib_ChatPlatform_Discord_CreateChatPlatformRest_Returns}
 *
 * @since 4.2.1
 */
export function createChatPlatformRest(
  options: Lib_ChatPlatform_Discord_CreateChatPlatformRest_Options,
): Lib_ChatPlatform_Discord_CreateChatPlatformRest_Returns {
  const rest: Lib_ChatPlatform_Discord_CreateChatPlatformRest_Rest = new REST({
    version: '10',
  }).setToken(options['token']);

  return adaptDiscordRest(rest);
}

/**
 * Discord - Create Chat Platform Webhook.
 *
 * Constructs a Discord webhook sender from an already decrypted URL and keeps
 * the SDK instance behind the project send and destroy operations.
 *
 * @param {Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Options} options - Options.
 *
 * @returns {Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Returns}
 *
 * @since 4.2.1
 */
export function createChatPlatformWebhook(
  options: Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Options,
): Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Returns {
  const webhook: Lib_ChatPlatform_Discord_CreateChatPlatformWebhook_Webhook = new WebhookClient({
    url: options['url'],
  });

  return adaptDiscordWebhook(webhook);
}

/**
 * Discord - Is Chat Platform Permission Name.
 *
 * Validates imported permission names against the installed Discord version
 * without exposing provider bitfields to configuration code.
 *
 * @param {Lib_ChatPlatform_Discord_IsChatPlatformPermissionName_PermissionName} permissionName - Permission name.
 *
 * @returns {Lib_ChatPlatform_Discord_IsChatPlatformPermissionName_Returns}
 *
 * @since 4.2.1
 */
export function isChatPlatformPermissionName(
  permissionName: Lib_ChatPlatform_Discord_IsChatPlatformPermissionName_PermissionName,
): Lib_ChatPlatform_Discord_IsChatPlatformPermissionName_Returns {
  return typeof Reflect.get(PermissionFlagsBits, permissionName) === 'bigint';
}

/**
 * Discord - List Chat Platform Permission Names.
 *
 * Supplies the current SDK permission names to the control-panel schema while
 * keeping the provider enum out of feature-editor source.
 *
 * @returns {Lib_ChatPlatform_Discord_ListChatPlatformPermissionNames_Returns}
 *
 * @since 4.2.1
 */
export function listChatPlatformPermissionNames(): Lib_ChatPlatform_Discord_ListChatPlatformPermissionNames_Returns {
  return Object.keys(PermissionFlagsBits).sort();
}

/**
 * Discord - Map Discord Intent.
 *
 * Resolves one stable project intent name to the provider bit used when the
 * client is constructed.
 *
 * @param {Lib_ChatPlatform_Discord_MapDiscordIntent_Intent} intent - Intent.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_MapDiscordIntent_Returns}
 *
 * @since 4.2.1
 */
function mapDiscordIntent(
  intent: Lib_ChatPlatform_Discord_MapDiscordIntent_Intent,
): Lib_ChatPlatform_Discord_MapDiscordIntent_Returns {
  switch (intent) {
    case 'guild-members': {
      return GatewayIntentBits.GuildMembers;
    }

    case 'guild-messages': {
      return GatewayIntentBits.GuildMessages;
    }

    case 'guild-scheduled-events': {
      return GatewayIntentBits.GuildScheduledEvents;
    }

    case 'guild-voice-states': {
      return GatewayIntentBits.GuildVoiceStates;
    }

    case 'message-content': {
      return GatewayIntentBits.MessageContent;
    }

    default: {
      return GatewayIntentBits.Guilds;
    }
  }
}

/**
 * Discord - Map Discord Permission.
 *
 * Resolves a project permission name and rejects configuration drift before
 * the value reaches a Discord permission or command call.
 *
 * @param {Lib_ChatPlatform_Discord_MapDiscordPermission_PermissionName} permissionName - Permission name.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_MapDiscordPermission_Returns}
 *
 * @since 4.2.1
 */
function mapDiscordPermission(
  permissionName: Lib_ChatPlatform_Discord_MapDiscordPermission_PermissionName,
): Lib_ChatPlatform_Discord_MapDiscordPermission_Returns {
  const value: Lib_ChatPlatform_Discord_MapDiscordPermission_Value = Reflect.get(
    PermissionFlagsBits,
    permissionName,
  );

  if (typeof value !== 'bigint') {
    throw new Error(`Unsupported Discord permission name: ${permissionName}`);
  }

  return value;
}

/**
 * Discord - Register Discord Event.
 *
 * Maps every consumed SDK event argument to the corresponding project object
 * before invoking a feature listener.
 *
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordEvent_Client}        client        - Client.
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordEvent_EventName}     eventName     - Event name.
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordEvent_Listener}      listener      - Listener.
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordEvent_AdaptedClient} adaptedClient - Adapted client.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_RegisterDiscordEvent_Returns}
 *
 * @since 4.2.1
 */
function registerDiscordEvent<EventName extends Lib_ChatPlatform_Discord_RegisterDiscordEvent_EventName>(
  client: Lib_ChatPlatform_Discord_RegisterDiscordEvent_Client,
  eventName: EventName,
  listener: Lib_ChatPlatform_Discord_RegisterDiscordEvent_Listener<EventName>,
  adaptedClient: Lib_ChatPlatform_Discord_RegisterDiscordEvent_AdaptedClient,
): Lib_ChatPlatform_Discord_RegisterDiscordEvent_Returns {
  switch (eventName) {
    case chatPlatformEvents['ChannelCreate']: {
      client.on(Events.ChannelCreate, (channel) => {
        Reflect.apply(listener, undefined, [adaptDiscordChannel(channel)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ChannelDelete']: {
      client.on(Events.ChannelDelete, (channel) => {
        Reflect.apply(listener, undefined, [adaptDiscordChannel(channel)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ChannelUpdate']: {
      client.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordChannel(oldChannel),
          adaptDiscordChannel(newChannel),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ClientReady']: {
      client.on(Events.ClientReady, () => {
        Reflect.apply(listener, undefined, [adaptedClient]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildCreate']: {
      client.on(Events.GuildCreate, (guild) => {
        Reflect.apply(listener, undefined, [adaptDiscordGuild(guild)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildDelete']: {
      client.on(Events.GuildDelete, (guild) => {
        Reflect.apply(listener, undefined, [adaptDiscordGuild(guild)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildMemberAdd']: {
      client.on(Events.GuildMemberAdd, (member) => {
        Reflect.apply(listener, undefined, [adaptDiscordMember(member)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildMemberRemove']: {
      client.on(Events.GuildMemberRemove, (member) => {
        Reflect.apply(listener, undefined, [adaptDiscordMember(member)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildMemberUpdate']: {
      client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordMember(oldMember),
          adaptDiscordMember(newMember),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildRoleCreate']: {
      client.on(Events.GuildRoleCreate, (role) => {
        Reflect.apply(listener, undefined, [adaptDiscordRole(role)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildRoleDelete']: {
      client.on(Events.GuildRoleDelete, (role) => {
        Reflect.apply(listener, undefined, [adaptDiscordRole(role)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildRoleUpdate']: {
      client.on(Events.GuildRoleUpdate, (oldRole, newRole) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordRole(oldRole),
          adaptDiscordRole(newRole),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildScheduledEventCreate']: {
      client.on(Events.GuildScheduledEventCreate, (event) => {
        Reflect.apply(listener, undefined, [adaptDiscordScheduledEvent(event)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildScheduledEventDelete']: {
      client.on(Events.GuildScheduledEventDelete, (event) => {
        Reflect.apply(listener, undefined, [adaptDiscordScheduledEvent(event)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildScheduledEventUpdate']: {
      client.on(Events.GuildScheduledEventUpdate, (oldEvent, newEvent) => {
        Reflect.apply(listener, undefined, [
          (oldEvent === null) ? null : adaptDiscordScheduledEvent(oldEvent),
          adaptDiscordScheduledEvent(newEvent),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['GuildUpdate']: {
      client.on(Events.GuildUpdate, (oldGuild, newGuild) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordGuild(oldGuild),
          adaptDiscordGuild(newGuild),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['InteractionCreate']: {
      client.on(Events.InteractionCreate, (interaction) => {
        if (
          interaction.isChatInputCommand() === false
          || interaction.inCachedGuild() === false
        ) {
          return;
        }

        Reflect.apply(listener, undefined, [adaptDiscordInteraction(interaction)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['MessageCreate']: {
      client.on(Events.MessageCreate, (message) => {
        Reflect.apply(listener, undefined, [adaptDiscordMessage(message)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['MessageDelete']: {
      client.on(Events.MessageDelete, (message) => {
        Reflect.apply(listener, undefined, [adaptDiscordMessage(message)]);

        return;
      });
      break;
    }

    case chatPlatformEvents['MessageUpdate']: {
      client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordMessage(oldMessage),
          adaptDiscordMessage(newMessage),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ShardDisconnect']: {
      client.on(Events.ShardDisconnect, (closeEvent, shardIdentifier) => {
        Reflect.apply(listener, undefined, [
          {
            code: closeEvent['code'],
          },
          shardIdentifier,
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ShardError']: {
      client.on(Events.ShardError, (error, shardIdentifier) => {
        Reflect.apply(listener, undefined, [
          error,
          shardIdentifier,
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ShardReady']: {
      client.on(Events.ShardReady, (shardIdentifier, unavailableGuilds) => {
        Reflect.apply(listener, undefined, [
          shardIdentifier,
          unavailableGuilds,
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ShardReconnecting']: {
      client.on(Events.ShardReconnecting, (shardIdentifier) => {
        Reflect.apply(listener, undefined, [shardIdentifier]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ShardResume']: {
      client.on(Events.ShardResume, (shardIdentifier, replayedEvents) => {
        Reflect.apply(listener, undefined, [
          shardIdentifier,
          replayedEvents,
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['ThreadUpdate']: {
      client.on(Events.ThreadUpdate, (oldThread, newThread) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordGuildChannel(oldThread),
          adaptDiscordGuildChannel(newThread),
        ]);

        return;
      });
      break;
    }

    case chatPlatformEvents['UserUpdate']: {
      client.on(Events.UserUpdate, (oldUser, newUser) => {
        Reflect.apply(listener, undefined, [
          adaptDiscordPartialUser(oldUser),
          adaptDiscordUser(newUser),
        ]);

        return;
      });
      break;
    }

    default: {
      break;
    }
  }

  return;
}

/**
 * Discord - Register Discord Once Event.
 *
 * Preserves ready-listener ordering for startup and application command
 * synchronization while rejecting unsupported one-shot event names.
 *
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Client}        client        - Client.
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_EventName}     eventName     - Event name.
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Listener}      listener      - Listener.
 * @param {Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_AdaptedClient} adaptedClient - Adapted client.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Returns}
 *
 * @since 4.2.1
 */
function registerDiscordOnceEvent<EventName extends Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_EventName>(
  client: Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Client,
  eventName: EventName,
  listener: Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Listener<EventName>,
  adaptedClient: Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_AdaptedClient,
): Lib_ChatPlatform_Discord_RegisterDiscordOnceEvent_Returns {
  if (eventName !== chatPlatformEvents['ClientReady']) {
    throw new Error(`Unsupported one-time chat platform event: ${eventName}`);
  }

  client.once(Events.ClientReady, () => {
    Reflect.apply(listener, undefined, [adaptedClient]);

    return;
  });

  return;
}

/**
 * Discord - Unwrap Discord Channel.
 *
 * Finds the private provider channel for a previously adapted project channel.
 * Voice moves reject objects that did not originate from this adapter.
 *
 * @param {Lib_ChatPlatform_Discord_UnwrapDiscordChannel_Channel} channel - Channel.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_UnwrapDiscordChannel_Returns}
 *
 * @since 4.2.1
 */
function unwrapDiscordChannel(
  channel: Lib_ChatPlatform_Discord_UnwrapDiscordChannel_Channel,
): Lib_ChatPlatform_Discord_UnwrapDiscordChannel_Returns {
  const rawChannel: Lib_ChatPlatform_Discord_UnwrapDiscordChannel_RawChannel = rawChannels.get(channel);

  if (rawChannel === undefined) {
    throw new Error('Chat platform channel does not belong to the Discord adapter.');
  }

  return rawChannel;
}

/**
 * Discord - Unwrap Discord Role.
 *
 * Finds the private provider role for one project role before a member role
 * mutation is delegated to discord.js.
 *
 * @param {Lib_ChatPlatform_Discord_UnwrapDiscordRole_Role} role - Role.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_UnwrapDiscordRole_Returns}
 *
 * @since 4.2.1
 */
function unwrapDiscordRole(
  role: Lib_ChatPlatform_Discord_UnwrapDiscordRole_Role,
): Lib_ChatPlatform_Discord_UnwrapDiscordRole_Returns {
  const rawRole: Lib_ChatPlatform_Discord_UnwrapDiscordRole_RawRole = rawRoles.get(role);

  if (rawRole === undefined) {
    throw new Error('Chat platform role does not belong to the Discord adapter.');
  }

  return rawRole;
}

/**
 * Discord - Unwrap Discord Roles.
 *
 * Preserves identifier arrays while translating adapted role objects back to
 * provider roles for the exact SDK add or remove call.
 *
 * @param {Lib_ChatPlatform_Discord_UnwrapDiscordRoles_Roles} roles - Roles.
 *
 * @private
 *
 * @returns {Lib_ChatPlatform_Discord_UnwrapDiscordRoles_Returns}
 *
 * @since 4.2.1
 */
function unwrapDiscordRoles(
  roles: Lib_ChatPlatform_Discord_UnwrapDiscordRoles_Roles,
): Lib_ChatPlatform_Discord_UnwrapDiscordRoles_Returns {
  if (Array.isArray(roles) === false) {
    return unwrapDiscordRole(roles);
  }

  if (roles.every((role) => typeof role === 'string') === true) {
    return roles;
  }

  return roles.map((role) => {
    if (typeof role === 'string') {
      throw new Error('Chat platform role input mixes identifiers and role objects.');
    }

    return unwrapDiscordRole(role);
  });
}
