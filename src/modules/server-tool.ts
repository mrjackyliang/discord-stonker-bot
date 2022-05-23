import { MessageEditOptions, MessageOptions } from 'discord.js';
import _ from 'lodash';

import {
  createEmojisInlineAttachment,
  createEmojisTableAttachment,
  createMembersInlineAttachment,
  createMembersTableAttachment,
} from '../lib/attachment';
import {
  createBulkBanEmbed,
  createCommandErrorEmbed,
  createListEmojisEmbed,
  createListMembersEmbed,
  createNoResultsEmbed,
  createRoleManagerEmbed,
  createVoiceToolsEmbed,
} from '../lib/embed';
import {
  generateLogMessage,
  getCollectionItems,
  getVoiceBasedChannel,
  memberHasPermissions,
} from '../lib/utility';
import {
  BulkBanMessage,
  BulkBanReturns,
  BulkBanSettings,
  BulkBanSettingsAllowedRoleRoleId,
  BulkBanSettingsAllowedRoles,
  BulkBanSettingsBaseCommands,
  BulkBanSettingsDeleteMessage,
  DeleteCommandMessageMessage,
  DeleteCommandMessageReturns,
  FetchDuplicatesMessage,
  FetchDuplicatesReturns,
  FetchDuplicatesSettings,
  FetchDuplicatesSettingsAllowedRoleRoleId,
  FetchDuplicatesSettingsAllowedRoles,
  FetchDuplicatesSettingsBaseCommands,
  FetchDuplicatesSettingsDeleteMessage,
  FetchEmojisCommandRoute,
  FetchEmojisMessage,
  FetchEmojisReturns,
  FetchEmojisSettings,
  FetchEmojisSettingsAllowedRoleRoleId,
  FetchEmojisSettingsAllowedRoles,
  FetchEmojisSettingsBaseCommands,
  FetchEmojisSettingsDeleteMessage,
  FetchMembersCommandAction,
  FetchMembersCommandRoute,
  FetchMembersMessage,
  FetchMembersReturns,
  FetchMembersSettings,
  FetchMembersSettingsAllowedRoleRoleId,
  FetchMembersSettingsAllowedRoles,
  FetchMembersSettingsBaseCommands,
  FetchMembersSettingsDeleteMessage,
  RoleManagerCommandAction,
  RoleManagerCommandRoute,
  RoleManagerCommandSelection,
  RoleManagerMessage,
  RoleManagerReturns,
  RoleManagerSettings,
  RoleManagerSettingsAllowedRoleRoleId,
  RoleManagerSettingsAllowedRoles,
  RoleManagerSettingsBaseCommands,
  RoleManagerSettingsDeleteMessage,
  ShowErrorMessageChannel,
  ShowErrorMessageErrorMessage,
  ShowErrorMessageMessage,
  ShowErrorMessageReturns,
  ShowErrorMessageUserTag,
  ShowNoPermissionsMessageBaseCommand,
  ShowNoPermissionsMessageChannel,
  ShowNoPermissionsMessageMessage,
  ShowNoPermissionsMessageReturns,
  ShowNoPermissionsMessageUserTag,
  ShowNoResultsMessageChannel,
  ShowNoResultsMessageMessage,
  ShowNoResultsMessageReason,
  ShowNoResultsMessageReturns,
  ShowNoResultsMessageUserTag,
  VoiceToolsCommandAction,
  VoiceToolsCommandRoute,
  VoiceToolsMessage,
  VoiceToolsReturns,
  VoiceToolsSettings,
  VoiceToolsSettingsAllowedRoleRoleId,
  VoiceToolsSettingsAllowedRoles,
  VoiceToolsSettingsBaseCommands,
  VoiceToolsSettingsDeleteMessage,
} from '../types';
import {
  MemoryBulkBanVerifiedMembers,
  MemoryFetchDuplicatesSortedMembers,
  MemoryFetchEmojisMatchedEmojis,
  MemoryFetchMembersMatchedMembers,
} from '../types/memory';

/**
 * Delete command message.
 *
 * @param {DeleteCommandMessageMessage} message - Message.
 *
 * @returns {DeleteCommandMessageReturns}
 *
 * @since 1.0.0
 */
export function deleteCommandMessage(message: DeleteCommandMessageMessage): DeleteCommandMessageReturns {
  const messageUrl = message.url;

  message.delete().then(() => generateLogMessage(
    [
      'Deleted message',
      `(function: deleteCommandMessage, message url: ${JSON.stringify(messageUrl)})`,
    ].join(' '),
    40,
  )).catch((error: Error) => generateLogMessage(
    [
      'Failed to delete message',
      `(function: deleteCommandMessage, message url: ${JSON.stringify(messageUrl)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Show error message.
 *
 * @param {ShowErrorMessageErrorMessage} errorMessage - Error message.
 * @param {ShowErrorMessageMessage}      message      - Message.
 * @param {ShowErrorMessageUserTag}      userTag      - User tag.
 * @param {ShowErrorMessageChannel}      channel      - Channel.
 *
 * @returns {ShowErrorMessageReturns}
 *
 * @since 1.0.0
 */
export function showErrorMessage(errorMessage: ShowErrorMessageErrorMessage, message: ShowErrorMessageMessage, userTag: ShowErrorMessageUserTag, channel: ShowErrorMessageChannel): ShowErrorMessageReturns {
  const payload: MessageOptions = {
    embeds: [
      createCommandErrorEmbed(
        errorMessage,
        userTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: showErrorMessage, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: showErrorMessage, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Show no permissions message.
 *
 * @param {ShowNoPermissionsMessageBaseCommand} baseCommand - Base command.
 * @param {ShowNoPermissionsMessageMessage}     message     - Message.
 * @param {ShowNoPermissionsMessageUserTag}     userTag     - User tag.
 * @param {ShowNoPermissionsMessageChannel}     channel     - Channel.
 *
 * @returns {ShowNoPermissionsMessageReturns}
 *
 * @since 1.0.0
 */
export function showNoPermissionsMessage(baseCommand: ShowNoPermissionsMessageBaseCommand, message: ShowNoPermissionsMessageMessage, userTag: ShowNoPermissionsMessageUserTag, channel: ShowNoPermissionsMessageChannel): ShowNoPermissionsMessageReturns {
  const payload: MessageOptions = {
    embeds: [
      createCommandErrorEmbed(
        `You do not have permissions to use the \`${baseCommand}\` command.`,
        userTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: showNoPermissionsMessage, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: showNoPermissionsMessage, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Show no results message.
 *
 * @param {ShowNoResultsMessageReason}  reason  - Reason.
 * @param {ShowNoResultsMessageMessage} message - Message.
 * @param {ShowNoResultsMessageUserTag} userTag - User tag.
 * @param {ShowNoResultsMessageChannel} channel - Channel.
 *
 * @returns {ShowNoResultsMessageReturns}
 *
 * @since 1.0.0
 */
export function showNoResultsMessage(reason: ShowNoResultsMessageReason, message: ShowNoResultsMessageMessage, userTag: ShowNoResultsMessageUserTag, channel: ShowNoResultsMessageChannel): ShowNoResultsMessageReturns {
  const payload: MessageOptions = {
    embeds: [
      createNoResultsEmbed(
        reason,
        userTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  channel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: showNoResultsMessage, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: showNoResultsMessage, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Bulk ban.
 *
 * @param {BulkBanMessage}  message  - Message.
 * @param {BulkBanSettings} settings - Settings.
 *
 * @returns {BulkBanReturns}
 *
 * @since 1.0.0
 */
export function bulkBan(message: BulkBanMessage, settings: BulkBanSettings): BulkBanReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: bulkBan, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: bulkBan, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuild = message.guild;
  const messageGuildMembers = message.guild.members;
  const messageGuildRoles = message.guild.roles;
  const messageMember = message.member;
  const messageMemberUserTag = message.member.user.tag;

  const settingsBaseCommands = <BulkBanSettingsBaseCommands>_.get(settings, ['base-commands']);
  const settingsDeleteMessage = <BulkBanSettingsDeleteMessage>_.get(settings, ['delete-message']);
  const settingsAllowedRoles = <BulkBanSettingsAllowedRoles>_.get(settings, ['allowed-roles']);

  const commandArguments = messageContent.split(' ');
  const commandArgumentsBase = <string>_.get(commandArguments, ['0']) ?? '';
  const commandArgumentsTags = commandArguments.slice(1);

  const allowedRoleIds = _.map(settingsAllowedRoles, (settingsAllowedRole) => <BulkBanSettingsAllowedRoleRoleId>_.get(settingsAllowedRole, ['role-id']));
  const unverifiedMemberIds = _.map(commandArgumentsTags, (commandArgumentsTag) => commandArgumentsTag.replace(/<@!?([0-9]+)>/g, '$1'));

  const verifiedMembers: MemoryBulkBanVerifiedMembers = [];

  let payload: MessageOptions = {};
  let editPayload: MessageEditOptions = {};

  // If "commands.bulk-ban" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"commands.bulk-ban" is not configured',
        `(function: bulkBan, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "commands.bulk-ban.base-commands" is not configured properly.
  if (
    !_.isArray(settingsBaseCommands)
    || _.isEmpty(settingsBaseCommands)
    || !_.every(settingsBaseCommands, (settingsBaseCommand) => _.isString(settingsBaseCommand) && !_.isEmpty(settingsBaseCommands))
  ) {
    generateLogMessage(
      [
        '"commands.bulk-ban.base-commands" is not configured properly',
        `(function: bulkBan, base commands: ${JSON.stringify(settingsBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.bulk-ban.delete-message" is not configured properly.
  if (
    settingsDeleteMessage !== undefined
    && !_.isBoolean(settingsDeleteMessage)
  ) {
    generateLogMessage(
      [
        '"commands.bulk-ban.delete-message" is not configured properly',
        `(function: bulkBan, delete message: ${JSON.stringify(settingsDeleteMessage)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.bulk-ban.allowed-roles" is not configured properly.
  if (
    settingsAllowedRoles !== undefined
    && (
      !_.isArray(settingsAllowedRoles)
      || _.isEmpty(settingsAllowedRoles)
      || !_.every(settingsAllowedRoles, (settingsAllowedRole) => _.isPlainObject(settingsAllowedRole) && !_.isEmpty(settingsAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && messageGuildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"commands.bulk-ban.allowed-roles" is not configured properly',
        `(function: bulkBan, allowed roles: ${JSON.stringify(settingsAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!settingsBaseCommands.includes(commandArgumentsBase)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: bulkBan, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: bulkBan, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
    ].join(' '),
    40,
  );

  if (!memberHasPermissions(messageMember, settingsAllowedRoles)) {
    showNoPermissionsMessage(commandArgumentsBase, message, messageMemberUserTag, messageChannel);

    return;
  }

  // Only keep verified members.
  unverifiedMemberIds.forEach((unverifiedMemberId) => {
    const guildMember = messageGuildMembers.resolve(unverifiedMemberId);

    if (guildMember !== null) {
      verifiedMembers.push(guildMember);
    }
  });

  if (verifiedMembers.length === 0) {
    showErrorMessage(
      [
        'No members were detected. Try using the command by tagging one or more members or specifying their user IDs.\n',
        'Example:',
        '```',
        `${commandArgumentsBase} [@user] (@user)`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (settingsDeleteMessage === true) {
    deleteCommandMessage(message);
  }

  payload = {
    embeds: [
      createBulkBanEmbed(
        'Please wait while Stonker Bot bans the selected members ...',
        'in-progress',
        messageMemberUserTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  messageChannel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: bulkBan, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );

    const banResults = _.map(verifiedMembers, async (verifiedMember) => {
      try {
        await verifiedMember.ban({
          reason: `${messageMemberUserTag} used the bulk ban command`,
        });

        generateLogMessage(
          [
            'Banned member',
            `(function: bulkBan, member: ${JSON.stringify(verifiedMember.toString())})`,
          ].join(' '),
          40,
        );

        return true;
      } catch (error: unknown) {
        generateLogMessage(
          [
            'Failed to ban member',
            `(function: bulkBan, member: ${JSON.stringify(verifiedMember.toString())})`,
          ].join(' '),
          10,
          error,
        );

        return false;
      }
    });

    Promise.all(banResults).then((banResponses) => {
      const success = _.every(banResponses, (banResponse) => banResponse === true);

      editPayload = {
        embeds: [
          createBulkBanEmbed(
            [
              'Selected members',
              ...(success) ? ['were'] : ['could not be'],
              `banned from the **${messageGuild.toString()}** guild.`,
            ].join(' '),
            (success) ? 'complete' : 'fail',
            messageMemberUserTag,
          ),
        ],
      };

      sendResponse.edit(editPayload).then(() => generateLogMessage(
        [
          'Edited message',
          `(function: bulkBan, message url: ${JSON.stringify(sendResponseUrl)}, edit payload: ${JSON.stringify(editPayload)})`,
        ].join(' '),
        40,
      )).catch((error: Error) => generateLogMessage(
        [
          'Failed to edit message',
          `(function: bulkBan, message url: ${JSON.stringify(sendResponseUrl)}, edit payload: ${JSON.stringify(editPayload)})`,
        ].join(' '),
        10,
        error,
      ));
    });
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: bulkBan, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Fetch duplicates.
 *
 * @param {FetchDuplicatesMessage}  message  - Message.
 * @param {FetchDuplicatesSettings} settings - Settings.
 *
 * @returns {FetchDuplicatesReturns}
 *
 * @since 1.0.0
 */
export function fetchDuplicates(message: FetchDuplicatesMessage, settings: FetchDuplicatesSettings): FetchDuplicatesReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: fetchDuplicates, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: fetchDuplicates, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuild = message.guild;
  const messageGuildMembersCache = message.guild.members.cache;
  const messageGuildRoles = message.guild.roles;
  const messageMember = message.member;
  const messageMemberUserTag = message.member.user.tag;

  const settingsBaseCommands = <FetchDuplicatesSettingsBaseCommands>_.get(settings, ['base-commands']);
  const settingsDeleteMessage = <FetchDuplicatesSettingsDeleteMessage>_.get(settings, ['delete-message']);
  const settingsAllowedRoles = <FetchDuplicatesSettingsAllowedRoles>_.get(settings, ['allowed-roles']);

  const commandArguments = messageContent.split(' ');
  const commandArgumentsBase = <string>_.get(commandArguments, ['0']) ?? '';

  const guildMembers = getCollectionItems(messageGuildMembersCache);

  const allowedRoleIds = _.map(settingsAllowedRoles, (settingsAllowedRole) => <FetchDuplicatesSettingsAllowedRoleRoleId>_.get(settingsAllowedRole, ['role-id']));

  const sortedMembers: MemoryFetchDuplicatesSortedMembers = {};

  let noResultsMessage = true;

  let payload: MessageOptions = {};

  // If "commands.fetch-duplicates" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"commands.fetch-duplicates" is not configured',
        `(function: fetchDuplicates, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "commands.fetch-duplicates.base-commands" is not configured properly.
  if (
    !_.isArray(settingsBaseCommands)
    || _.isEmpty(settingsBaseCommands)
    || !_.every(settingsBaseCommands, (settingsBaseCommand) => _.isString(settingsBaseCommand) && !_.isEmpty(settingsBaseCommands))
  ) {
    generateLogMessage(
      [
        '"commands.fetch-duplicates.base-commands" is not configured properly',
        `(function: fetchDuplicates, base commands: ${JSON.stringify(settingsBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.fetch-duplicates.delete-message" is not configured properly.
  if (
    settingsDeleteMessage !== undefined
    && !_.isBoolean(settingsDeleteMessage)
  ) {
    generateLogMessage(
      [
        '"commands.fetch-duplicates.delete-message" is not configured properly',
        `(function: fetchDuplicates, delete message: ${JSON.stringify(settingsDeleteMessage)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.fetch-duplicates.allowed-roles" is not configured properly.
  if (
    settingsAllowedRoles !== undefined
    && (
      !_.isArray(settingsAllowedRoles)
      || _.isEmpty(settingsAllowedRoles)
      || !_.every(settingsAllowedRoles, (settingsAllowedRole) => _.isPlainObject(settingsAllowedRole) && !_.isEmpty(settingsAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && messageGuildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"commands.fetch-duplicates.allowed-roles" is not configured properly',
        `(function: fetchDuplicates, allowed roles: ${JSON.stringify(settingsAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!settingsBaseCommands.includes(commandArgumentsBase)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: fetchDuplicates, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: fetchDuplicates, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
    ].join(' '),
    40,
  );

  if (!memberHasPermissions(messageMember, settingsAllowedRoles)) {
    showNoPermissionsMessage(commandArgumentsBase, message, messageMemberUserTag, messageChannel);

    return;
  }

  if (settingsDeleteMessage === true) {
    deleteCommandMessage(message);
  }

  // Sort members into avatar groups.
  guildMembers.forEach((guildMember) => {
    const guildMemberUserAvatar = guildMember.user.avatar;

    // If member has an avatar.
    if (guildMemberUserAvatar !== null) {
      // Create entry for avatar if it does not exist.
      if (sortedMembers[guildMemberUserAvatar] === undefined) {
        sortedMembers[guildMemberUserAvatar] = [];
      }

      sortedMembers[guildMemberUserAvatar].push(guildMember);
    }
  });

  Object.entries(sortedMembers).forEach((sortedMember) => {
    const sortedMemberAvatar = sortedMember[0];
    const sortedMemberMembers = sortedMember[1];

    // If only a single member uses that avatar.
    if (sortedMemberMembers.length === 1) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: fetchDuplicates, avatar: ${JSON.stringify(sortedMemberAvatar)}, members: ${JSON.stringify(sortedMemberMembers)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: fetchDuplicates, avatar: ${JSON.stringify(sortedMemberAvatar)}, members: ${JSON.stringify(sortedMemberMembers)})`,
      ].join(' '),
      40,
    );

    noResultsMessage = false;

    payload = {
      files: [
        createMembersTableAttachment(
          sortedMemberMembers,
          [
            'duplicates-',
            sortedMemberAvatar,
          ].join(''),
        ),
        createMembersInlineAttachment(
          sortedMemberMembers,
          [
            'duplicates-',
            sortedMemberAvatar,
          ].join(''),
        ),
      ],
      embeds: [
        createListMembersEmbed(
          [
            'Duplicate Members for',
            `\`...${sortedMemberAvatar.substring(sortedMemberAvatar.length - 8)}\``,
          ].join(' '),
          messageMemberUserTag,
        ),
      ],
      reply: {
        messageReference: message,
      },
    };

    messageChannel.send(payload).then((sendResponse) => {
      const sendResponseUrl = sendResponse.url;

      generateLogMessage(
        [
          'Sent message',
          `(function: fetchDuplicates, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        40,
      );
    }).catch((error: Error) => generateLogMessage(
      [
        'Failed to send message',
        `(function: fetchDuplicates, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      10,
      error,
    ));
  });

  if (noResultsMessage) {
    showNoResultsMessage(
      [
        'There are no duplicate users found in the',
        `**${messageGuild.toString()}**`,
        'guild.',
      ].join(' '),
      message,
      messageMemberUserTag,
      messageChannel,
    );
  }
}

/**
 * Fetch emojis.
 *
 * @param {FetchEmojisMessage}  message  - Message.
 * @param {FetchEmojisSettings} settings - Settings.
 *
 * @returns {FetchEmojisReturns}
 *
 * @since 1.0.0
 */
export function fetchEmojis(message: FetchEmojisMessage, settings: FetchEmojisSettings): FetchEmojisReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: fetchEmojis, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: fetchEmojis, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuild = message.guild;
  const messageGuildEmojisCache = message.guild.emojis.cache;
  const messageGuildRoles = message.guild.roles;
  const messageMember = message.member;
  const messageMemberUserTag = message.member.user.tag;

  const settingsBaseCommands = <FetchEmojisSettingsBaseCommands>_.get(settings, ['base-commands']);
  const settingsDeleteMessage = <FetchEmojisSettingsDeleteMessage>_.get(settings, ['delete-message']);
  const settingsAllowedRoles = <FetchEmojisSettingsAllowedRoles>_.get(settings, ['allowed-roles']);

  const commandArguments = messageContent.split(' ');
  const commandArgumentsBase = <string>_.get(commandArguments, ['0']) ?? '';
  const commandArgumentsRoute = <FetchEmojisCommandRoute>_.get(commandArguments, ['1']) ?? '';

  const guildEmojis = getCollectionItems(messageGuildEmojisCache);

  const allowedRoleIds = _.map(settingsAllowedRoles, (settingsAllowedRole) => <FetchEmojisSettingsAllowedRoleRoleId>_.get(settingsAllowedRole, ['role-id']));

  const matchedEmojis: MemoryFetchEmojisMatchedEmojis = [];

  let payload: MessageOptions = {};

  // If "commands.fetch-emojis" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"commands.fetch-emojis" is not configured',
        `(function: fetchEmojis, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "commands.fetch-emojis.base-commands" is not configured properly.
  if (
    !_.isArray(settingsBaseCommands)
    || _.isEmpty(settingsBaseCommands)
    || !_.every(settingsBaseCommands, (settingsBaseCommand) => _.isString(settingsBaseCommand) && !_.isEmpty(settingsBaseCommands))
  ) {
    generateLogMessage(
      [
        '"commands.fetch-emojis.base-commands" is not configured properly',
        `(function: fetchEmojis, base commands: ${JSON.stringify(settingsBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.fetch-emojis.delete-message" is not configured properly.
  if (
    settingsDeleteMessage !== undefined
    && !_.isBoolean(settingsDeleteMessage)
  ) {
    generateLogMessage(
      [
        '"commands.fetch-emojis.delete-message" is not configured properly',
        `(function: fetchEmojis, delete message: ${JSON.stringify(settingsDeleteMessage)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.fetch-emojis.allowed-roles" is not configured properly.
  if (
    settingsAllowedRoles !== undefined
    && (
      !_.isArray(settingsAllowedRoles)
      || _.isEmpty(settingsAllowedRoles)
      || !_.every(settingsAllowedRoles, (settingsAllowedRole) => _.isPlainObject(settingsAllowedRole) && !_.isEmpty(settingsAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && messageGuildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"commands.fetch-emojis.allowed-roles" is not configured properly',
        `(function: fetchEmojis, allowed roles: ${JSON.stringify(settingsAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!settingsBaseCommands.includes(commandArgumentsBase)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: fetchEmojis, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: fetchEmojis, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
    ].join(' '),
    40,
  );

  if (!memberHasPermissions(messageMember, settingsAllowedRoles)) {
    showNoPermissionsMessage(commandArgumentsBase, message, messageMemberUserTag, messageChannel);

    return;
  }

  if (
    commandArgumentsRoute !== 'all'
    && commandArgumentsRoute !== 'animated'
    && commandArgumentsRoute !== 'static'
  ) {
    showErrorMessage(
      [
        `The command route (${commandArgumentsRoute}) is invalid or does not exist. Try using the command by selecting a route.\n`,
        'Examples:',
        '```',
        `${commandArgumentsBase} all`,
        `${commandArgumentsBase} animated`,
        `${commandArgumentsBase} static`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (settingsDeleteMessage === true) {
    deleteCommandMessage(message);
  }

  guildEmojis.forEach((guildEmoji) => {
    const regExpAnimatedEmoji = /^<a:(.+):([0-9]+)>$/;
    const regExpStaticEmoji = /^<:(.+):([0-9]+)>$/;

    if (
      commandArgumentsRoute === 'all' // Fetch all emojis.
      || (
        commandArgumentsRoute === 'animated' // Fetch animated emojis.
        && regExpAnimatedEmoji.test(guildEmoji.toString()) // If regex matches an animated emoji.
      )
      || (
        commandArgumentsRoute === 'static' // Fetch static emojis.
        && regExpStaticEmoji.test(guildEmoji.toString()) // If regex matches a static emoji.
      )
    ) {
      matchedEmojis.push(guildEmoji);
    }
  });

  if (matchedEmojis.length === 0) {
    showNoResultsMessage(
      [
        'There are no',
        ...(commandArgumentsRoute === 'animated') ? ['animated'] : [],
        ...(commandArgumentsRoute === 'static') ? ['static'] : [],
        'emojis found in the',
        `**${messageGuild.toString()}**`,
        'guild.',
      ].join(' '),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  payload = {
    files: [
      createEmojisTableAttachment(
        matchedEmojis,
        commandArgumentsRoute,
      ),
      createEmojisInlineAttachment(
        matchedEmojis,
        commandArgumentsRoute,
      ),
    ],
    embeds: [
      createListEmojisEmbed(
        commandArgumentsRoute,
        messageMemberUserTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  messageChannel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: fetchEmojis, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: fetchEmojis, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Fetch members.
 *
 * @param {FetchMembersMessage}  message  - Message.
 * @param {FetchMembersSettings} settings - Settings.
 *
 * @returns {FetchMembersReturns}
 *
 * @since 1.0.0
 */
export function fetchMembers(message: FetchMembersMessage, settings: FetchMembersSettings): FetchMembersReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: fetchMembers, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: fetchMembers, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuildMembers = message.guild.members;
  const messageGuildMembersCache = message.guild.members.cache;
  const messageGuildName = message.guild.name;
  const messageGuildRoles = message.guild.roles;
  const messageMember = message.member;
  const messageMemberUserTag = message.member.user.tag;

  const settingsBaseCommands = <FetchMembersSettingsBaseCommands>_.get(settings, ['base-commands']);
  const settingsDeleteMessage = <FetchMembersSettingsDeleteMessage>_.get(settings, ['delete-message']);
  const settingsAllowedRoles = <FetchMembersSettingsAllowedRoles>_.get(settings, ['allowed-roles']);

  const commandArguments = messageContent.split(' ');
  const commandArgumentsBase = <string>_.get(commandArguments, ['0']) ?? '';
  const commandArgumentsRoute = <FetchMembersCommandRoute>_.get(commandArguments, ['1']) ?? '';
  const commandArgumentsAction = <FetchMembersCommandAction>_.get(commandArguments, ['2']) ?? '';

  const guildMembers = getCollectionItems(messageGuildMembersCache);

  const allowedRoleIds = _.map(settingsAllowedRoles, (settingsAllowedRole) => <FetchMembersSettingsAllowedRoleRoleId>_.get(settingsAllowedRole, ['role-id']));

  const matchedMembers: MemoryFetchMembersMatchedMembers = [];

  let payload: MessageOptions = {};

  // If "commands.fetch-members" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"commands.fetch-members" is not configured',
        `(function: fetchMembers, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "commands.fetch-members.base-commands" is not configured properly.
  if (
    !_.isArray(settingsBaseCommands)
    || _.isEmpty(settingsBaseCommands)
    || !_.every(settingsBaseCommands, (settingsBaseCommand) => _.isString(settingsBaseCommand) && !_.isEmpty(settingsBaseCommands))
  ) {
    generateLogMessage(
      [
        '"commands.fetch-members.base-commands" is not configured properly',
        `(function: fetchMembers, base commands: ${JSON.stringify(settingsBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.fetch-members.delete-message" is not configured properly.
  if (
    settingsDeleteMessage !== undefined
    && !_.isBoolean(settingsDeleteMessage)
  ) {
    generateLogMessage(
      [
        '"commands.fetch-members.delete-message" is not configured properly',
        `(function: fetchMembers, delete message: ${JSON.stringify(settingsDeleteMessage)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.fetch-members.allowed-roles" is not configured properly.
  if (
    settingsAllowedRoles !== undefined
    && (
      !_.isArray(settingsAllowedRoles)
      || _.isEmpty(settingsAllowedRoles)
      || !_.every(settingsAllowedRoles, (settingsAllowedRole) => _.isPlainObject(settingsAllowedRole) && !_.isEmpty(settingsAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && messageGuildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"commands.fetch-members.allowed-roles" is not configured properly',
        `(function: fetchMembers, allowed roles: ${JSON.stringify(settingsAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!settingsBaseCommands.includes(commandArgumentsBase)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: fetchMembers, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: fetchMembers, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
    ].join(' '),
    40,
  );

  if (!memberHasPermissions(messageMember, settingsAllowedRoles)) {
    showNoPermissionsMessage(commandArgumentsBase, message, messageMemberUserTag, messageChannel);

    return;
  }

  if (
    commandArgumentsRoute !== 'avatar'
    && commandArgumentsRoute !== 'everyone'
    && commandArgumentsRoute !== 'role'
    && commandArgumentsRoute !== 'string'
    && commandArgumentsRoute !== 'username'
  ) {
    showErrorMessage(
      [
        `The command route (${commandArgumentsRoute}) is invalid or does not exist. Try using the command by selecting a route.\n`,
        'Examples:',
        '```',
        `${commandArgumentsBase} avatar [@user]`,
        `${commandArgumentsBase} everyone`,
        `${commandArgumentsBase} role [@role]`,
        `${commandArgumentsBase} string [string]`,
        `${commandArgumentsBase} username [@user]`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (
    commandArgumentsRoute === 'avatar'
    || commandArgumentsRoute === 'username'
  ) {
    const selectedMemberId = commandArgumentsAction.replace(/[<@!>]/g, '');
    const selectedMember = messageGuildMembers.resolve(selectedMemberId);

    if (selectedMember === null) {
      showErrorMessage(
        [
          `The member (${commandArgumentsAction}) is invalid. Try using the command by tagging a member or specifying a user ID.\n`,
          'Example:',
          '```',
          `${commandArgumentsBase} ${commandArgumentsRoute} [@user]`,
          '```',
        ].join('\n'),
        message,
        messageMemberUserTag,
        messageChannel,
      );

      return;
    }

    const selectedMemberUserAvatar = selectedMember.user.avatar;
    const selectedMemberUserTag = selectedMember.user.tag;
    const selectedMemberUserUsername = selectedMember.user.username;

    if (
      commandArgumentsRoute === 'avatar'
      && selectedMemberUserAvatar === null
    ) {
      showErrorMessage(
        `Cannot compare members. ${selectedMember.toString()} does not have an avatar to compare from.`,
        message,
        messageMemberUserTag,
        messageChannel,
      );

      return;
    }

    if (settingsDeleteMessage === true) {
      deleteCommandMessage(message);
    }

    guildMembers.forEach((guildMember) => {
      const guildMemberUserAvatar = guildMember.user.avatar;
      const guildMemberUserUsername = guildMember.user.username;

      if (
        (
          commandArgumentsRoute === 'avatar' // Fetch members with the same avatar.
          && selectedMemberUserAvatar === guildMemberUserAvatar // If selected member has the same avatar as current looped member.
        )
        || (
          commandArgumentsRoute === 'username' // Fetch members with the same username.
          && selectedMemberUserUsername === guildMemberUserUsername // If selected member has the same username as current looped member.
        )
      ) {
        matchedMembers.push(guildMember);
      }
    });

    payload = {
      files: [
        createMembersTableAttachment(
          matchedMembers,
          [
            'members-',
            `${commandArgumentsRoute}-`,
            (commandArgumentsRoute === 'avatar') ? [selectedMemberUserAvatar] : [],
            (commandArgumentsRoute === 'username') ? [selectedMemberUserUsername] : [],
          ].join(''),
        ),
        createMembersInlineAttachment(
          matchedMembers,
          [
            'members-',
            `${commandArgumentsRoute}-`,
            (commandArgumentsRoute === 'avatar') ? [selectedMemberUserAvatar] : [],
            (commandArgumentsRoute === 'username') ? [selectedMemberUserUsername] : [],
          ].join(''),
        ),
      ],
      embeds: [
        createListMembersEmbed(
          [
            ...(commandArgumentsRoute === 'avatar') ? ['Avatars Matching'] : [],
            ...(commandArgumentsRoute === 'username') ? ['Usernames Matching'] : [],
            `${selectedMemberUserTag}`,
          ].join(' '),
          messageMemberUserTag,
          selectedMember.displayAvatarURL({
            format: 'webp',
            dynamic: true,
            size: 4096,
          }),
        ),
      ],
      reply: {
        messageReference: message,
      },
    };
  }

  if (commandArgumentsRoute === 'everyone') {
    guildMembers.forEach((guildMember) => {
      matchedMembers.push(guildMember);
    });

    payload = {
      files: [
        createMembersTableAttachment(
          matchedMembers,
          [
            'members-',
            'everyone',
          ].join(''),
        ),
        createMembersInlineAttachment(
          matchedMembers,
          [
            'members-',
            'everyone',
          ].join(''),
        ),
      ],
      embeds: [
        createListMembersEmbed(
          [
            messageGuildName,
            'Members',
          ].join(' '),
          messageMemberUserTag,
        ),
      ],
      reply: {
        messageReference: message,
      },
    };
  }

  if (commandArgumentsRoute === 'role') {
    const selectedRoleId = commandArgumentsAction.replace(/[<@&>]/g, '');
    const selectedRole = messageGuildRoles.resolve(selectedRoleId);

    if (selectedRole === null) {
      showErrorMessage(
        [
          `The role (${commandArgumentsAction}) is invalid. Try using the command by tagging a role or specifying a role ID.\n`,
          'Example:',
          '```',
          `${commandArgumentsBase} ${commandArgumentsRoute} [@role]`,
          '```',
        ].join('\n'),
        message,
        messageMemberUserTag,
        messageChannel,
      );

      return;
    }

    const selectedRoleMembers = selectedRole.members;
    const selectedRoleName = selectedRole.name;

    const roleMembers = getCollectionItems(selectedRoleMembers);

    if (settingsDeleteMessage === true) {
      deleteCommandMessage(message);
    }

    roleMembers.forEach((roleMember) => {
      matchedMembers.push(roleMember);
    });

    if (matchedMembers.length === 0) {
      showNoResultsMessage(
        [
          'The member list for',
          selectedRole.toString(),
          'role is empty.',
        ].join(' '),
        message,
        messageMemberUserTag,
        messageChannel,
      );

      return;
    }

    payload = {
      files: [
        createMembersTableAttachment(
          matchedMembers,
          [
            'members-',
            'role-',
            selectedRoleName,
          ].join(''),
        ),
        createMembersInlineAttachment(
          matchedMembers,
          [
            'members-',
            'role-',
            selectedRoleName,
          ].join(''),
        ),
      ],
      embeds: [
        createListMembersEmbed(
          [
            selectedRoleName,
            'Members',
          ].join(' '),
          messageMemberUserTag,
        ),
      ],
      reply: {
        messageReference: message,
      },
    };
  }

  if (commandArgumentsRoute === 'string') {
    const regExp = /(")(.+)(")/g;

    let query = commandArgumentsAction;

    // Transform string input (with quotes) into query.
    if (regExp.test(messageContent)) {
      const stringArg = messageContent.substring(messageContent.lastIndexOf('string "') + 7);

      query = stringArg.replace(regExp, '$2');
    }

    if (
      query === undefined
      || query === '""'
    ) {
      showErrorMessage(
        [
          'There is nothing specified. Try using the command by specifying a string (with or without quotes).\n',
          'Example:',
          '```',
          `${commandArgumentsBase} ${commandArgumentsRoute} [text]`,
          '```',
        ].join('\n'),
        message,
        messageMemberUserTag,
        messageChannel,
      );

      return;
    }

    if (settingsDeleteMessage === true) {
      deleteCommandMessage(message);
    }

    guildMembers.forEach((guildMember) => {
      const guildMemberNickname = guildMember.nickname;
      const guildMemberUserAvatar = guildMember.user.avatar;
      const guildMemberUserUsername = guildMember.user.username;

      if (
        (
          guildMemberNickname !== null // If user has a nickname.
          && guildMemberNickname.includes(query) // Match partial nickname.
        )
        || guildMemberUserUsername.includes(query) // Match partial username.
        || (
          guildMemberUserAvatar !== null // If user has an avatar.
          && guildMemberUserAvatar === query // Match avatar.
        )
      ) {
        matchedMembers.push(guildMember);
      }
    });

    if (matchedMembers.length === 0) {
      showNoResultsMessage(
        [
          'No results were found using',
          `\`${query}\`.`,
        ].join(' '),
        message,
        messageMemberUserTag,
        messageChannel,
      );

      return;
    }

    payload = {
      files: [
        createMembersTableAttachment(
          matchedMembers,
          [
            'members-',
            'string-',
            query,
          ].join(''),
        ),
        createMembersInlineAttachment(
          matchedMembers,
          [
            'members-',
            'string-',
            query,
          ].join(''),
        ),
      ],
      embeds: [
        createListMembersEmbed(
          [
            'Members Matching',
            `\`${query}\``,
          ].join(' '),
          messageMemberUserTag,
        ),
      ],
      reply: {
        messageReference: message,
      },
    };
  }

  messageChannel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: fetchMembers, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: fetchMembers, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Role manager.
 *
 * @param {RoleManagerMessage}  message  - Message.
 * @param {RoleManagerSettings} settings - Settings.
 *
 * @returns {RoleManagerReturns}
 *
 * @since 1.0.0
 */
export function roleManager(message: RoleManagerMessage, settings: RoleManagerSettings): RoleManagerReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: roleManager, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: roleManager, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuildMembersCache = message.guild.members.cache;
  const messageGuildRoles = message.guild.roles;
  const messageMember = message.member;
  const messageMemberUserTag = message.member.user.tag;

  const settingsBaseCommands = <RoleManagerSettingsBaseCommands>_.get(settings, ['base-commands']);
  const settingsDeleteMessage = <RoleManagerSettingsDeleteMessage>_.get(settings, ['delete-message']);
  const settingsAllowedRoles = <RoleManagerSettingsAllowedRoles>_.get(settings, ['allowed-roles']);

  const commandArguments = messageContent.split(' ');
  const commandArgumentsBase = <string>_.get(commandArguments, ['0']) ?? '';
  const commandArgumentsRoute = <RoleManagerCommandRoute>_.get(commandArguments, ['1']) ?? '';
  const commandArgumentsSelection = <RoleManagerCommandSelection>_.get(commandArguments, ['2']) ?? '';
  const commandArgumentsAction = <RoleManagerCommandAction>_.get(commandArguments, ['3']) ?? '';

  const guildMembers = getCollectionItems(messageGuildMembersCache);

  const allowedRoleIds = _.map(settingsAllowedRoles, (settingsAllowedRole) => <RoleManagerSettingsAllowedRoleRoleId>_.get(settingsAllowedRole, ['role-id']));
  const roleOneId = commandArgumentsSelection.replace(/[<@&>]/g, '');
  const roleTwoId = commandArgumentsAction.replace(/[<@&>]/g, '');
  const roleOne = messageGuildRoles.resolve(roleOneId);
  const roleTwo = messageGuildRoles.resolve(roleTwoId);

  let payload: MessageOptions = {};
  let editPayload: MessageEditOptions = {};

  // If "commands.role-manager" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"commands.role-manager" is not configured',
        `(function: roleManager, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "commands.role-manager.base-commands" is not configured properly.
  if (
    !_.isArray(settingsBaseCommands)
    || _.isEmpty(settingsBaseCommands)
    || !_.every(settingsBaseCommands, (settingsBaseCommand) => _.isString(settingsBaseCommand) && !_.isEmpty(settingsBaseCommands))
  ) {
    generateLogMessage(
      [
        '"commands.role-manager.base-commands" is not configured properly',
        `(function: roleManager, base commands: ${JSON.stringify(settingsBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.role-manager.delete-message" is not configured properly.
  if (
    settingsDeleteMessage !== undefined
    && !_.isBoolean(settingsDeleteMessage)
  ) {
    generateLogMessage(
      [
        '"commands.role-manager.delete-message" is not configured properly',
        `(function: roleManager, delete message: ${JSON.stringify(settingsDeleteMessage)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.role-manager.allowed-roles" is not configured properly.
  if (
    settingsAllowedRoles !== undefined
    && (
      !_.isArray(settingsAllowedRoles)
      || _.isEmpty(settingsAllowedRoles)
      || !_.every(settingsAllowedRoles, (settingsAllowedRole) => _.isPlainObject(settingsAllowedRole) && !_.isEmpty(settingsAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && messageGuildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"commands.role-manager.allowed-roles" is not configured properly',
        `(function: roleManager, allowed roles: ${JSON.stringify(settingsAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!settingsBaseCommands.includes(commandArgumentsBase)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: roleManager, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: roleManager, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
    ].join(' '),
    40,
  );

  if (!memberHasPermissions(messageMember, settingsAllowedRoles)) {
    showNoPermissionsMessage(commandArgumentsBase, message, messageMemberUserTag, messageChannel);

    return;
  }

  if (
    commandArgumentsRoute !== 'add'
    && commandArgumentsRoute !== 'remove'
  ) {
    showErrorMessage(
      [
        `The command route (${commandArgumentsRoute}) is invalid or does not exist. Try using the command by specifying a route.\n`,
        'Examples:',
        '```',
        `${commandArgumentsBase} add everyone [@role to add]`,
        `${commandArgumentsBase} add [@role] [@role to add]`,
        `${commandArgumentsBase} add no-role [@role to add]`,
        `${commandArgumentsBase} remove everyone [@role to remove]`,
        `${commandArgumentsBase} remove [@role] [@role to remove]`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (
    (
      commandArgumentsRoute === 'add'
      && commandArgumentsSelection !== 'everyone'
      && roleOne === null
      && commandArgumentsSelection !== 'no-role'
    )
    || (
      commandArgumentsRoute === 'remove'
      && commandArgumentsSelection !== 'everyone'
      && roleOne === null
    )
  ) {
    showErrorMessage(
      [
        `The command selection (${commandArgumentsSelection}) is invalid or does not exist. Try using the command by inputting a selection.\n`,
        'Examples:',
        '```',
        ...[
          `${commandArgumentsBase} ${commandArgumentsRoute} everyone [@role to ${commandArgumentsRoute}]`,
          `${commandArgumentsBase} ${commandArgumentsRoute} [@role] [@role to ${commandArgumentsRoute}]`,
          ...(commandArgumentsRoute === 'add') ? [`${commandArgumentsBase} add no-role [@role to add]`] : [],
        ],
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (roleTwo === null) {
    showErrorMessage(
      [
        `The role (${commandArgumentsAction}) is invalid or does not exist. Try using the command by tagging a role or specifying a role ID to add.\n`,
        'Examples:',
        '```',
        `${commandArgumentsBase} ${commandArgumentsRoute} ${commandArgumentsSelection} [@role to ${commandArgumentsRoute}]`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (settingsDeleteMessage === true) {
    deleteCommandMessage(message);
  }

  payload = {
    embeds: [
      createRoleManagerEmbed(
        [
          `Please wait while Stonker Bot ${commandArgumentsRoute}s the ${roleTwo.toString()} role`,
          ...(commandArgumentsRoute === 'add') ? ['to'] : [],
          ...(commandArgumentsRoute === 'remove') ? ['from'] : [],
          'all',
          ...(commandArgumentsSelection === 'everyone') ? ['members'] : [],
          ...(roleOne) ? [`members with the ${roleOne.toString()} role`] : [],
          ...(commandArgumentsSelection === 'no-role') ? ['members with no roles'] : [],
          '...',
        ].join(' '),
        commandArgumentsRoute,
        'in-progress',
        messageMemberUserTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  messageChannel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: roleManager, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );

    const roleResults = _.map(guildMembers, async (guildMember) => {
      const guildMemberRoles = guildMember.roles;
      const guildMemberRolesCache = guildMember.roles.cache;

      if (
        commandArgumentsRoute === 'add' // Add action.
        && guildMemberRoles.resolve(roleTwoId) === null // If member does not have the role.
        && (
          commandArgumentsSelection === 'everyone' // Add role to everyone.
          || (
            roleOne !== null // If role #1 exists.
            && guildMemberRoles.resolve(roleOneId) !== null // Add role to members with role #1.
          )
          || (
            commandArgumentsSelection === 'no-role' // Add role to members with no roles.
            && guildMemberRolesCache.size === 1 // If member has one role (the @everyone role).
          )
        )
      ) {
        try {
          await guildMemberRoles.add(roleTwo);

          generateLogMessage(
            [
              'Added role',
              `(function: roleManager, member: ${JSON.stringify(guildMember.toString())}, role: ${JSON.stringify(roleTwo.toString())})`,
            ].join(' '),
            40,
          );

          return true;
        } catch (error: unknown) {
          generateLogMessage(
            [
              'Failed to add role',
              `(function: roleManager, member: ${JSON.stringify(guildMember.toString())}, role: ${JSON.stringify(roleTwo.toString())})`,
            ].join(' '),
            10,
            error,
          );

          return false;
        }
      }

      if (
        commandArgumentsRoute === 'remove' // Remove action.
        && guildMemberRoles.resolve(roleTwoId) !== null // If member has the role.
        && (
          commandArgumentsSelection === 'everyone' // Remove role from everyone.
          || (
            roleOne !== null // If role #1 exists.
            && guildMemberRoles.resolve(roleOneId) !== null // Remove role from members with role #1.
          )
        )
      ) {
        try {
          await guildMemberRoles.remove(roleTwo);

          generateLogMessage(
            [
              'Removed role',
              `(function: roleManager, member: ${JSON.stringify(guildMember.toString())}, role: ${JSON.stringify(roleTwo.toString())})`,
            ].join(' '),
            40,
          );

          return true;
        } catch (error: unknown) {
          generateLogMessage(
            [
              'Failed to remove role',
              `(function: roleManager, member: ${JSON.stringify(guildMember.toString())}, role: ${JSON.stringify(roleTwo.toString())})`,
            ].join(' '),
            10,
            error,
          );

          return false;
        }
      }

      // Skips if member does not match statement above.
      return true;
    });

    Promise.all(roleResults).then((roleResponses) => {
      const success = _.every(roleResponses, (roleResponse) => roleResponse === true);

      editPayload = {
        embeds: [
          createRoleManagerEmbed(
            [
              roleTwo.toString(),
              ...(success) ? ['was'] : ['could not be'],
              ...(commandArgumentsRoute === 'add') ? ['added to'] : [],
              ...(commandArgumentsRoute === 'remove') ? ['removed from'] : [],
              'all',
              ...(commandArgumentsSelection === 'everyone') ? ['members.'] : [],
              ...(roleOne) ? [`members with the ${roleOne.toString()} role.`] : [],
              ...(commandArgumentsSelection === 'no-role') ? ['members with no roles.'] : [],
            ].join(' '),
            commandArgumentsRoute,
            (success) ? 'complete' : 'fail',
            messageMemberUserTag,
          ),
        ],
      };

      sendResponse.edit(editPayload).then(() => generateLogMessage(
        [
          'Edited message',
          `(function: roleManager, message url: ${JSON.stringify(sendResponseUrl)}, edit payload: ${JSON.stringify(editPayload)})`,
        ].join(' '),
        40,
      )).catch((error: Error) => generateLogMessage(
        [
          'Failed to edit message',
          `(function: roleManager, message url: ${JSON.stringify(sendResponseUrl)}, edit payload: ${JSON.stringify(editPayload)})`,
        ].join(' '),
        10,
        error,
      ));
    });
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: roleManager, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}

/**
 * Voice tools.
 *
 * @param {VoiceToolsMessage}  message  - Message.
 * @param {VoiceToolsSettings} settings - Settings.
 *
 * @returns {VoiceToolsReturns}
 *
 * @since 1.0.0
 */
export function voiceTools(message: VoiceToolsMessage, settings: VoiceToolsSettings): VoiceToolsReturns {
  if (
    message.guild === null
    || message.member === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: voiceTools, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: voiceTools, guild: ${JSON.stringify(message.guild)}, member: ${JSON.stringify(message.member)})`,
    ].join(' '),
    40,
  );

  const messageChannel = message.channel;
  const messageContent = message.content;
  const messageGuild = message.guild;
  const messageGuildRoles = message.guild.roles;
  const messageGuildVoiceStatesCache = message.guild.voiceStates.cache;
  const messageMember = message.member;
  const messageMemberUserTag = message.member.user.tag;

  const settingsBaseCommands = <VoiceToolsSettingsBaseCommands>_.get(settings, ['base-commands']);
  const settingsDeleteMessage = <VoiceToolsSettingsDeleteMessage>_.get(settings, ['delete-message']);
  const settingsAllowedRoles = <VoiceToolsSettingsAllowedRoles>_.get(settings, ['allowed-roles']);

  const commandArguments = messageContent.split(' ');
  const commandArgumentsBase = <string>_.get(commandArguments, ['0'], '');
  const commandArgumentsRoute = <VoiceToolsCommandRoute>_.get(commandArguments, ['1']) ?? '';
  const commandArgumentsSelection = <VoiceToolsCommandAction>_.get(commandArguments, ['2']) ?? '';

  const allowedRoleIds = _.map(settingsAllowedRoles, (settingsAllowedRole) => <VoiceToolsSettingsAllowedRoleRoleId>_.get(settingsAllowedRole, ['role-id']));
  const channel = getVoiceBasedChannel(messageGuild, commandArgumentsSelection.replace(/[<#>]/g, ''));
  const voiceStates = getCollectionItems(messageGuildVoiceStatesCache);

  let payload: MessageOptions = {};
  let editPayload: MessageEditOptions = {};

  // If "commands.voice-tools" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"commands.voice-tools" is not configured',
        `(function: voiceTools, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "commands.voice-tools.base-commands" is not configured properly.
  if (
    !_.isArray(settingsBaseCommands)
    || _.isEmpty(settingsBaseCommands)
    || !_.every(settingsBaseCommands, (settingsBaseCommand) => _.isString(settingsBaseCommand) && !_.isEmpty(settingsBaseCommands))
  ) {
    generateLogMessage(
      [
        '"commands.voice-tools.base-commands" is not configured properly',
        `(function: voiceTools, base commands: ${JSON.stringify(settingsBaseCommands)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.voice-tools.delete-message" is not configured properly.
  if (
    settingsDeleteMessage !== undefined
    && !_.isBoolean(settingsDeleteMessage)
  ) {
    generateLogMessage(
      [
        '"commands.voice-tools.delete-message" is not configured properly',
        `(function: voiceTools, delete message: ${JSON.stringify(settingsDeleteMessage)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "commands.voice-tools.allowed-roles" is not configured properly.
  if (
    settingsAllowedRoles !== undefined
    && (
      !_.isArray(settingsAllowedRoles)
      || _.isEmpty(settingsAllowedRoles)
      || !_.every(settingsAllowedRoles, (settingsAllowedRole) => _.isPlainObject(settingsAllowedRole) && !_.isEmpty(settingsAllowedRole))
      || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && messageGuildRoles.resolve(allowedRoleId) !== null)
    )
  ) {
    generateLogMessage(
      [
        '"commands.voice-tools.allowed-roles" is not configured properly',
        `(function: voiceTools, allowed roles: ${JSON.stringify(settingsAllowedRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (!settingsBaseCommands.includes(commandArgumentsBase)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: voiceTools, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: voiceTools, specified base commands: ${JSON.stringify(settingsBaseCommands)}, current base command: ${JSON.stringify(commandArgumentsBase)})`,
    ].join(' '),
    40,
  );

  if (!memberHasPermissions(messageMember, settingsAllowedRoles)) {
    showNoPermissionsMessage(commandArgumentsBase, message, messageMemberUserTag, messageChannel);

    return;
  }

  if (
    commandArgumentsRoute !== 'disconnect'
    && commandArgumentsRoute !== 'unmute'
  ) {
    showErrorMessage(
      [
        `The command route (${commandArgumentsRoute}) is invalid or does not exist. Try using the command by selecting a route.\n`,
        'Examples:',
        '```',
        `${commandArgumentsBase} disconnect [#channel]`,
        `${commandArgumentsBase} unmute [#channel]`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (
    channel === undefined
    || channel === null
  ) {
    showErrorMessage(
      [
        `The voice or stage channel (${commandArgumentsSelection}) is invalid or does not exist. Try using the command by specifying a voice or stage channel ID.\n`,
        'Example:',
        '```',
        `${commandArgumentsBase} ${commandArgumentsRoute} [#channel]`,
        '```',
      ].join('\n'),
      message,
      messageMemberUserTag,
      messageChannel,
    );

    return;
  }

  if (settingsDeleteMessage === true) {
    deleteCommandMessage(message);
  }

  const channelId = channel.id;
  const channelType = channel.type;

  payload = {
    embeds: [
      createVoiceToolsEmbed(
        [
          `Please wait while Stonker Bot ${commandArgumentsRoute}s all members connected to the`,
          channel.toString(),
          ...(channelType === 'GUILD_VOICE') ? ['voice'] : [],
          ...(channelType === 'GUILD_STAGE_VOICE') ? ['stage'] : [],
          'channel ...',
        ].join(' '),
        (commandArgumentsRoute === 'unmute' && channelType === 'GUILD_STAGE_VOICE') ? 'invite' : commandArgumentsRoute,
        'in-progress',
        messageMemberUserTag,
      ),
    ],
    reply: {
      messageReference: message,
    },
  };

  messageChannel.send(payload).then((sendResponse) => {
    const sendResponseUrl = sendResponse.url;

    generateLogMessage(
      [
        'Sent message',
        `(function: voiceTools, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    );

    const voiceResults = _.map(voiceStates, async (voiceState) => {
      const voiceStateChannel = voiceState.channel;
      const voiceStateMember = voiceState.member;

      if (
        voiceStateChannel !== null
        && voiceStateMember !== null
      ) {
        const voiceStateChannelId = voiceStateChannel.id;

        // Disconnect members connected to selected voice or stage channel.
        if (voiceStateChannelId === channelId) {
          if (commandArgumentsRoute === 'disconnect') {
            try {
              await voiceState.disconnect();

              generateLogMessage(
                [
                  'Disconnected member',
                  `(function: voiceTools, member: ${JSON.stringify(voiceStateMember.toString())}, channel: ${JSON.stringify(voiceStateChannel.toString())}, channel type: ${JSON.stringify(channelType)})`,
                ].join(' '),
                40,
              );

              return true;
            } catch (error: unknown) {
              generateLogMessage(
                [
                  'Failed to disconnect member',
                  `(function: voiceTools, member: ${JSON.stringify(voiceStateMember.toString())}, channel: ${JSON.stringify(voiceStateChannel.toString())}, channel type: ${JSON.stringify(channelType)})`,
                ].join(' '),
                10,
                error,
              );

              return false;
            }
          }

          // Unmute members connected to selected voice or stage channel.
          if (commandArgumentsRoute === 'unmute') {
            try {
              await voiceState.setMute(false);

              generateLogMessage(
                [
                  'Unmuted member',
                  `(function: voiceTools, member: ${JSON.stringify(voiceStateMember.toString())}, channel: ${JSON.stringify(voiceStateChannel.toString())}, channel type: ${JSON.stringify(channelType)})`,
                ].join(' '),
                40,
              );

              return true;
            } catch (error: unknown) {
              generateLogMessage(
                [
                  'Failed to unmute member',
                  `(function: voiceTools, member: ${JSON.stringify(voiceStateMember.toString())}, channel: ${JSON.stringify(voiceStateChannel.toString())}, channel type: ${JSON.stringify(channelType)})`,
                ].join(' '),
                10,
                error,
              );

              return false;
            }
          }
        }
      }

      // Skips if voice state is not the selected voice or stage channel.
      return true;
    });

    Promise.all(voiceResults).then((voiceResponses) => {
      const success = _.every(voiceResponses, (voiceResponse) => voiceResponse === true);

      editPayload = {
        embeds: [
          createVoiceToolsEmbed(
            [
              ...(success) ? ['All members have been'] : ['One or more members could not be'],
              ...(commandArgumentsRoute === 'disconnect') ? ['disconnected from'] : [],
              ...(commandArgumentsRoute === 'unmute' && channelType === 'GUILD_VOICE') ? ['unmuted from'] : [],
              ...(commandArgumentsRoute === 'unmute' && channelType === 'GUILD_STAGE_VOICE') ? ['invited to speak in'] : [],
              'the',
              channel.toString(),
              ...(channelType === 'GUILD_VOICE') ? ['voice'] : [],
              ...(channelType === 'GUILD_STAGE_VOICE') ? ['stage'] : [],
              'channel.',
            ].join(' '),
            (commandArgumentsRoute === 'unmute' && channelType === 'GUILD_STAGE_VOICE') ? 'invite' : commandArgumentsRoute,
            (success) ? 'complete' : 'fail',
            messageMemberUserTag,
          ),
        ],
      };

      sendResponse.edit(editPayload).then(() => generateLogMessage(
        [
          'Edited message',
          `(function: voiceTools, message url: ${JSON.stringify(sendResponseUrl)}, edit payload: ${JSON.stringify(editPayload)})`,
        ].join(' '),
        40,
      )).catch((error: Error) => generateLogMessage(
        [
          'Failed to edit message',
          `(function: voiceTools, message url: ${JSON.stringify(sendResponseUrl)}, edit payload: ${JSON.stringify(editPayload)})`,
        ].join(' '),
        10,
        error,
      ));
    });
  }).catch((error: Error) => generateLogMessage(
    [
      'Failed to send message',
      `(function: voiceTools, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
    ].join(' '),
    10,
    error,
  ));
}
