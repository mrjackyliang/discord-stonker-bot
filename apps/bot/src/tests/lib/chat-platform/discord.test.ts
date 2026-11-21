import {
  ApplicationCommandOptionType,
  ApplicationIntegrationType,
  ChannelType,
  Client,
  Events,
  InteractionContextType,
  PermissionFlagsBits,
  RESTEvents,
  Routes,
} from 'discord.js';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  adaptDiscordChannel,
  adaptDiscordClient,
  adaptDiscordGuild,
  adaptDiscordMember,
  adaptDiscordRest,
  adaptDiscordRole,
  adaptDiscordUser,
  buildChatPlatformGuildIconUrl,
  chatPlatformAssetContentSecurityPolicySource,
  chatPlatformAssetUrlPattern,
  chatPlatformEvents,
  compileChatPlatformPermissionOverwrite,
} from '../../../lib/chat-platform/index.js';

import type {
  Tests_Lib_ChatPlatform_Discord_Channel,
  Tests_Lib_ChatPlatform_Discord_Client,
  Tests_Lib_ChatPlatform_Discord_Guild,
  Tests_Lib_ChatPlatform_Discord_Member,
  Tests_Lib_ChatPlatform_Discord_MemberState,
  Tests_Lib_ChatPlatform_Discord_Mock,
  Tests_Lib_ChatPlatform_Discord_Overwrite,
  Tests_Lib_ChatPlatform_Discord_Permissions,
  Tests_Lib_ChatPlatform_Discord_ProviderValue,
  Tests_Lib_ChatPlatform_Discord_RateLimitListener,
  Tests_Lib_ChatPlatform_Discord_RawChannel,
  Tests_Lib_ChatPlatform_Discord_RawClient,
  Tests_Lib_ChatPlatform_Discord_RawGuild,
  Tests_Lib_ChatPlatform_Discord_RawMember,
  Tests_Lib_ChatPlatform_Discord_RawRateLimitListener,
  Tests_Lib_ChatPlatform_Discord_RawRest,
  Tests_Lib_ChatPlatform_Discord_RawRole,
  Tests_Lib_ChatPlatform_Discord_RawUser,
  Tests_Lib_ChatPlatform_Discord_Rest,
  Tests_Lib_ChatPlatform_Discord_Role,
  Tests_Lib_ChatPlatform_Discord_User,
} from '../../../types/tests/lib/chat-platform/discord.test.d.ts';

/**
 * Discord - Discord Adapter Boundary.
 *
 * Verifies provider values, routes, and payloads become project-owned shapes.
 * Every fake stays local and no Discord connection is opened.
 *
 * @since 4.2.1
 */
describe('Discord adapter boundary', () => {
  it('compiles project permissions to Discord bitfield strings', () => {
    const permissions: Tests_Lib_ChatPlatform_Discord_Permissions = {
      ManageMessages: false,
      SendMessages: true,
      ViewChannel: true,
    };
    const overwrite: Tests_Lib_ChatPlatform_Discord_Overwrite = compileChatPlatformPermissionOverwrite(permissions);

    expect(overwrite).toEqual({
      allow: (PermissionFlagsBits.SendMessages + PermissionFlagsBits.ViewChannel).toString(),
      deny: PermissionFlagsBits.ManageMessages.toString(),
    });

    expect(() => compileChatPlatformPermissionOverwrite({
      NotADiscordPermission: true,
    })).toThrow('Unsupported Discord permission name: NotADiscordPermission');

    return;
  });

  it('maps REST operations to the same Discord routes and payloads', async () => {
    const get: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn().mockResolvedValue({});
    const on: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn();
    const post: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn().mockResolvedValue({});
    const put: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn().mockResolvedValue({});
    const rawRest: Tests_Lib_ChatPlatform_Discord_RawRest = {
      get,
      on,
      post,
      put,
    } as Tests_Lib_ChatPlatform_Discord_ProviderValue as Tests_Lib_ChatPlatform_Discord_RawRest;
    const rest: Tests_Lib_ChatPlatform_Discord_Rest = adaptDiscordRest(rawRest);

    await rest.createInvite('rules', {
      maxAgeSeconds: 300,
      maxUses: 1,
    }, 'Verification complete');

    expect(post).toHaveBeenNthCalledWith(1, Routes.channelInvites('rules'), {
      body: {
        max_age: 300,
        max_uses: 1,
        temporary: false,
        unique: true,
      },
      reason: 'Verification complete',
    });

    await rest.createMessage('alerts', {
      allowedMentions: {
        parse: [],
      },
      content: 'hello',
    });

    expect(post).toHaveBeenNthCalledWith(2, Routes.channelMessages('alerts'), {
      body: {
        allowed_mentions: {
          parse: [],
        },
        content: 'hello',
      },
    });

    await rest.createOwnReaction('alerts', 'message', '🔥');

    await rest.createOwnReaction('alerts', 'message', 'stonks:1197999049190674442');

    expect(put).toHaveBeenNthCalledWith(1, Routes.channelMessageOwnReaction(
      'alerts',
      'message',
      '%F0%9F%94%A5',
    ));

    expect(put).toHaveBeenNthCalledWith(2, Routes.channelMessageOwnReaction(
      'alerts',
      'message',
      'stonks%3A1197999049190674442',
    ));

    await rest.editChannelPermission('alerts', 'moderators', {
      allow: '1024',
      deny: '2048',
      targetType: 'role',
    }, 'Synchronize permissions');

    expect(put).toHaveBeenNthCalledWith(3, Routes.channelPermission('alerts', 'moderators'), {
      body: {
        allow: '1024',
        deny: '2048',
        type: 0,
      },
      reason: 'Synchronize permissions',
    });

    await rest.editChannelPermission('alerts', 'member', {
      allow: '0',
      deny: '1024',
      targetType: 'member',
    }, 'Synchronize permissions');

    expect(put).toHaveBeenNthCalledWith(4, Routes.channelPermission('alerts', 'member'), {
      body: {
        allow: '0',
        deny: '1024',
        type: 1,
      },
      reason: 'Synchronize permissions',
    });

    await rest.getGuild('stonkers', true);

    expect(get).toHaveBeenCalledWith(Routes.guild('stonkers'), {
      query: new URLSearchParams({
        with_counts: 'true',
      }),
    });

    return;
  });

  it('maps project application commands to Discord command data', async () => {
    const set: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn().mockResolvedValue([]);
    const rawGuild: Tests_Lib_ChatPlatform_Discord_RawGuild = {
      channels: {},
      commands: {
        set,
      },
      emojis: {},
      icon: 'guild-icon',
      id: 'stonkers',
      memberCount: 42,
      members: {},
      name: 'Stonkers',
      ownerId: 'owner',
      roles: {},
    } as Tests_Lib_ChatPlatform_Discord_ProviderValue as Tests_Lib_ChatPlatform_Discord_RawGuild;
    const guild: Tests_Lib_ChatPlatform_Discord_Guild = adaptDiscordGuild(rawGuild);

    await guild['commands'].set([{
      contexts: ['guild'],
      defaultMemberPermissions: 'ManageGuild',
      description: 'Manage the server',
      integrationTypes: ['guild-install'],
      name: 'manage',
      options: [
        {
          description: 'Confirm',
          name: 'confirm',
          required: true,
          type: 'boolean',
        },
        {
          channelTypes: [
            'guild-voice',
            'guild-stage-voice',
          ],
          description: 'Channel',
          name: 'channel',
          required: true,
          type: 'channel',
        },
        {
          description: 'Count',
          maxValue: 25,
          minValue: 1,
          name: 'count',
          required: true,
          type: 'integer',
        },
        {
          description: 'Role',
          name: 'role',
          required: true,
          type: 'role',
        },
        {
          choices: [{
            name: 'Add',
            value: 'add',
          }],
          description: 'Action',
          maxLength: 10,
          name: 'action',
          required: true,
          type: 'string',
        },
        {
          description: 'Member',
          name: 'member',
          required: true,
          type: 'user',
        },
      ],
    }]);

    expect(set).toHaveBeenCalledWith([{
      contexts: [InteractionContextType.Guild],
      defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
      description: 'Manage the server',
      integrationTypes: [ApplicationIntegrationType.GuildInstall],
      name: 'manage',
      options: [
        {
          description: 'Confirm',
          name: 'confirm',
          required: true,
          type: ApplicationCommandOptionType.Boolean,
        },
        {
          channelTypes: [
            ChannelType.GuildVoice,
            ChannelType.GuildStageVoice,
          ],
          description: 'Channel',
          name: 'channel',
          required: true,
          type: ApplicationCommandOptionType.Channel,
        },
        {
          description: 'Count',
          maxValue: 25,
          minValue: 1,
          name: 'count',
          required: true,
          type: ApplicationCommandOptionType.Integer,
        },
        {
          description: 'Role',
          name: 'role',
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
        {
          choices: [{
            name: 'Add',
            value: 'add',
          }],
          description: 'Action',
          maxLength: 10,
          name: 'action',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          description: 'Member',
          name: 'member',
          required: true,
          type: ApplicationCommandOptionType.User,
        },
      ],
    }]);

    return;
  });

  it('forwards only token-free fields from Discord REST rate-limit events', () => {
    const on: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn();
    const rawRest: Tests_Lib_ChatPlatform_Discord_RawRest = {
      get: vi.fn(),
      on,
      post: vi.fn(),
      put: vi.fn(),
    } as Tests_Lib_ChatPlatform_Discord_ProviderValue as Tests_Lib_ChatPlatform_Discord_RawRest;
    const rest: Tests_Lib_ChatPlatform_Discord_Rest = adaptDiscordRest(rawRest);
    const listener: Tests_Lib_ChatPlatform_Discord_RateLimitListener = vi.fn();

    rest.onRateLimited(listener);

    expect(on).toHaveBeenCalledWith(RESTEvents.RateLimited, expect.any(Function));

    const rawListener: Tests_Lib_ChatPlatform_Discord_RawRateLimitListener = Reflect.get(
      Object(on['mock']['calls'][0]),
      '1',
    ) as Tests_Lib_ChatPlatform_Discord_RawRateLimitListener;

    rawListener({
      global: false,
      hash: 'fixture-bucket',
      limit: 5,
      majorParameter: '222222222222222222/fixture-webhook-token',
      method: 'POST',
      retryAfter: 750,
      route: '/webhooks/:id/:token',
      scope: 'shared',
      sublimitTimeout: 0,
      timeToReset: 750,
      url: 'https://discord.com/api/v10/webhooks/222222222222222222/fixture-webhook-token',
    });

    expect(listener).toHaveBeenCalledWith({
      global: false,
      limit: 5,
      method: 'POST',
      retryAfter: 750,
      route: '/webhooks/:id/:token',
      scope: 'shared',
    });

    return;
  });

  it('wraps sendable channels without leaking Discord objects', async () => {
    const send: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn().mockResolvedValue({});
    const rawChannel: Tests_Lib_ChatPlatform_Discord_RawChannel = {
      id: 'direct-message',
      isDMBased: () => true,
      isSendable: () => true,
      isTextBased: () => true,
      isThread: () => false,
      isVoiceBased: () => false,
      send,
      type: ChannelType.DM,
    } as Tests_Lib_ChatPlatform_Discord_ProviderValue as Tests_Lib_ChatPlatform_Discord_RawChannel;
    const channel: Tests_Lib_ChatPlatform_Discord_Channel = adaptDiscordChannel(rawChannel);

    expect(channel).toMatchObject({
      archived: null,
      guild: undefined,
      guildId: null,
      id: 'direct-message',
      name: '',
      parentId: null,
      type: ChannelType.DM,
    });

    expect(channel.isRegistryChannel()).toBe(true);

    if (channel.isSendable() === false) {
      throw new Error('The fake channel was not mapped as sendable.');
    }

    await channel.send({
      allowedMentions: {
        parse: [],
      },
      content: 'project payload',
    });

    expect(send).toHaveBeenCalledWith({
      allowedMentions: {
        parse: [],
      },
      content: 'project payload',
    });

    return;
  });

  it('copies role and user data while routing user sends', async () => {
    const rawRole: Tests_Lib_ChatPlatform_Discord_RawRole = {
      editable: true,
      id: 'role',
      managed: false,
      name: 'Moderators',
      position: 4,
    } as Tests_Lib_ChatPlatform_Discord_RawRole;
    const role: Tests_Lib_ChatPlatform_Discord_Role = adaptDiscordRole(rawRole);
    const send: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn().mockResolvedValue({});
    const rawUser: Tests_Lib_ChatPlatform_Discord_RawUser = {
      avatar: 'avatar-hash',
      bot: false,
      createdTimestamp: 1_700_000_000_000,
      displayAvatarURL: () => 'https://cdn.discordapp.com/avatars/user/avatar.png',
      globalName: 'Stonker',
      id: 'user',
      send,
      system: false,
      tag: 'stonker',
      username: 'stonker',
    } as Tests_Lib_ChatPlatform_Discord_ProviderValue as Tests_Lib_ChatPlatform_Discord_RawUser;
    const user: Tests_Lib_ChatPlatform_Discord_User = adaptDiscordUser(rawUser);

    expect(role).toEqual({
      editable: true,
      id: 'role',
      managed: false,
      name: 'Moderators',
      position: 4,
    });

    expect(user).toMatchObject({
      avatar: 'avatar-hash',
      bot: false,
      createdTimestamp: 1_700_000_000_000,
      globalName: 'Stonker',
      id: 'user',
      system: false,
      tag: 'stonker',
      username: 'stonker',
    });

    expect(user.displayAvatarUrl()).toBe('https://cdn.discordapp.com/avatars/user/avatar.png');

    await user.send({
      content: 'hello',
    });

    expect(send).toHaveBeenCalledWith({
      content: 'hello',
    });

    return;
  });

  it('reads cache-backed member fields from the live Discord member', () => {
    const memberState: Tests_Lib_ChatPlatform_Discord_MemberState = {
      manageable: true,
      reads: 0,
    };
    const rawMember: Tests_Lib_ChatPlatform_Discord_RawMember = {
      bannable: false,
      displayName: 'Stonker',
      guild: {
        icon: null,
        id: 'stonkers',
        memberCount: 42,
        name: 'Stonkers',
        ownerId: 'owner',
      },
      id: 'member',
      get manageable() {
        Reflect.set(memberState, 'reads', memberState['reads'] + 1);

        return memberState['manageable'];
      },
      nickname: null,
      pending: false,
      roles: {},
      user: {
        avatar: null,
        bot: false,
        createdTimestamp: 1_700_000_000_000,
        globalName: null,
        id: 'member',
        system: false,
        tag: 'stonker',
        username: 'stonker',
      },
      voice: {
        channelId: null,
      },
    } as Tests_Lib_ChatPlatform_Discord_ProviderValue as Tests_Lib_ChatPlatform_Discord_RawMember;
    const member: Tests_Lib_ChatPlatform_Discord_Member = adaptDiscordMember(rawMember);

    expect(memberState['reads']).toBe(0);

    expect(member['manageable']).toBe(true);

    Reflect.set(memberState, 'manageable', false);

    expect(member['manageable']).toBe(false);

    expect(memberState['reads']).toBe(2);

    return;
  });

  it('normalizes Gateway event names onto the project client', () => {
    const rawClient: Tests_Lib_ChatPlatform_Discord_RawClient = new Client({
      intents: [],
    });
    const client: Tests_Lib_ChatPlatform_Discord_Client = adaptDiscordClient(rawClient);
    const listener: Tests_Lib_ChatPlatform_Discord_Mock = vi.fn();

    client.on(chatPlatformEvents['ShardReconnecting'], listener);

    rawClient.emit(Events.ShardReconnecting, 3);

    expect(listener).toHaveBeenCalledWith(3);

    rawClient.destroy();

    return;
  });

  it('owns Discord asset hosts, patterns, and guild icon URLs', () => {
    expect(chatPlatformAssetContentSecurityPolicySource).toBe('https://cdn.discordapp.com');

    expect(new RegExp(chatPlatformAssetUrlPattern, 'u').test('https://cdn.discordapp.com/icons/guild/icon.png')).toBe(true);

    expect(buildChatPlatformGuildIconUrl('guild id', 'icon/hash', 256)).toBe('https://cdn.discordapp.com/icons/guild%20id/icon%2Fhash.png?size=256');

    expect(buildChatPlatformGuildIconUrl('guild', null, 256)).toBeNull();

    expect(buildChatPlatformGuildIconUrl('guild', '', 128)).toBeNull();

    return;
  });

  return;
});
