import chalk from 'chalk';
import {
  GuildMember,
  Message,
  Permissions,
  TextBasedChannels,
} from 'discord.js';
import _ from 'lodash';

import {
  createBulkBanEmbed,
  createCommandErrorEmbed,
  createHelpMenuEmbed,
  createListMembersEmbed,
  createNoResultsEmbed,
  createRoleManagerEmbed,
  createTogglePermsEmbed,
  createVoiceToolsEmbed,
} from '../lib/embed';
import { generateLogMessage } from '../lib/utilities';
import {
  DuplicateMembers,
  FetchMembersAction,
  FetchMembersRoute,
  HelpMenuSettings,
  RoleAction,
  RoleRoute,
  Roles,
  RoleSelection,
  RoleToOrFrom,
  TogglePermsGroup,
  TogglePermsSettings,
  TogglePermsToggle,
  VoiceAction,
  VoiceRoute,
} from '../types';

/**
 * Command no results.
 *
 * @param {TextBasedChannels} channel - Channel to send to.
 * @param {GuildMember}       member  - Member attempting to use command.
 * @param {string}            message - The no results message.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function commandNoResults(channel: TextBasedChannels, member: GuildMember, message: string): void {
  channel.send({
    embeds: [
      createNoResultsEmbed(
        message,
        member.user.tag,
      ),
    ],
  }).catch((error) => generateLogMessage(
    'Failed to send no results embed',
    10,
    error,
  ));
}

/**
 * Command error.
 *
 * @param {TextBasedChannels} channel - Channel to send to.
 * @param {GuildMember}       member  - Member attempting to use command.
 * @param {string}            message - The error message.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function commandError(channel: TextBasedChannels, member: GuildMember, message: string): void {
  channel.send({
    embeds: [
      createCommandErrorEmbed(
        message,
        member.user.tag,
      ),
    ],
  }).catch((error) => generateLogMessage(
    'Failed to send command error embed',
    10,
    error,
  ));
}

/**
 * Command no permissions.
 *
 * @param {TextBasedChannels} channel     - Channel to send to.
 * @param {GuildMember}       member      - Member attempting to use command.
 * @param {string}            baseCommand - The command member attempted to use.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function commandNoPermissions(channel: TextBasedChannels, member: GuildMember, baseCommand: string): void {
  channel.send({
    embeds: [
      createCommandErrorEmbed(
        `You do not have enough permissions to use the \`${baseCommand}\` command.`,
        member.user.tag,
      ),
    ],
  }).catch((error) => generateLogMessage(
    'Failed to send command error embed',
    10,
    error,
  ));
}

/**
 * Command delete message.
 *
 * @param {Message} message - Message object.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
function commandDeleteMessage(message: Message): void {
  message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));
}

/**
 * Bulk ban.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function bulkBan(message: Message, allowedRoles: Roles): Promise<void> {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    guild,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const commandTags = commandArguments.slice(1);
  const guildMembers = await guild.members.fetch();
  const unverifiedUserIds = _.map(commandTags, (commandTag) => commandTag.replace(/<@!?([0-9]+)>/g, '$1'));
  const verifiedUsers: GuildMember[] = [];

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // Only keep verified users.
  _.forEach(unverifiedUserIds, (unverifiedUserId) => {
    const guildMember = guildMembers.get(unverifiedUserId);

    if (guildMember) {
      verifiedUsers.push(guildMember);
    }
  });

  // If no verified users have been specified.
  if (verifiedUsers.length === 0) {
    commandError(
      channel,
      member,
      [
        'No member tags were detected. Try using the command by tagging one or more members or specifying their IDs.\n',
        'Example:',
        '```',
        `${commandCommand} [@user]`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Send status message.
  const statusMessage = await channel.send({
    embeds: [
      createBulkBanEmbed(
        'Please wait while Stonker Bot bans the selected members',
        'in-progress',
        member.user.tag,
      ),
    ],
  });

  // Perform actions.
  const banResults = _.map(verifiedUsers, async (verifiedUser) => {
    /**
     * Ban results logger.
     *
     * @param {string}  word      - Base wording.
     * @param {boolean} isSuccess - Is successful.
     * @param {unknown} error     - Error object.
     *
     * @returns {void}
     *
     * @since 1.0.0
     */
    const logger = (word: string, isSuccess: boolean, error?: unknown): void => {
      generateLogMessage(
        [
          word,
          ...(isSuccess) ? [chalk.green(verifiedUser.toString())] : [chalk.red(verifiedUser.toString())],
          'using the bulk ban command',
        ].join(' '),
        (isSuccess) ? 30 : 10,
        (_.isError(error)) ? error : undefined,
      );
    };

    let success = true;

    try {
      await verifiedUser.ban({
        reason: `@${member.user.tag} used the bulk ban command`,
      });

      logger('Successfully banned', true);
    } catch (error) {
      success = false;

      logger('Failed to ban', false);
    }

    return success;
  });

  // Check actions and edit status message.
  Promise.all(banResults).then((responses) => {
    const success = _.every(responses, (response) => response === true);

    statusMessage.edit({
      embeds: [
        createBulkBanEmbed(
          [
            'Selected members',
            ...(success) ? ['were'] : ['could not be'],
            `successfully banned from the **${guild.toString()}** guild.`,
          ].join(' '),
          (success) ? 'complete' : 'fail',
          member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to edit role embed',
      10,
      error,
    ));
  });
}

/**
 * Fetch duplicates.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function fetchDuplicates(message: Message, allowedRoles: Roles): Promise<void> {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    guild,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const guildMembers = await guild.members.fetch();
  const members: DuplicateMembers = {};

  let empty = true;

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Remap users based on their avatar.
  _.forEach([...guildMembers.values()], (guildMember) => {
    const guildMemberUserAvatar = guildMember.user.avatar;

    // If member has an avatar.
    if (guildMemberUserAvatar !== null) {
      // Create entry for avatar hash if it does not exist.
      if (members[guildMemberUserAvatar] === undefined) {
        members[guildMemberUserAvatar] = [];
      }

      members[guildMemberUserAvatar].push(guildMember.toString());
    }
  });

  // Loop through all members with avatars.
  _.forEach(Object.entries(members), (usersEntry) => {
    const avatarHash = usersEntry[0];
    const userIds = usersEntry[1];

    if (_.size(userIds) > 1) {
      const userIdsChunks = _.chunk(userIds, 80);

      // Don't show empty results message.
      empty = false;

      // Send a message embed for every 80 members.
      _.forEach(userIdsChunks, (userIdsChunk, key) => {
        channel.send({
          embeds: [
            createListMembersEmbed(
              [
                'Duplicate Members for',
                `\`...${avatarHash.substr(_.size(avatarHash) - 8)}\``,
                ...(key > 0) ? [`(Page ${key + 1})`] : [],
              ].join(' '),
              userIdsChunk,
              undefined,
              member.user.tag,
            ),
          ],
        }).catch((error) => generateLogMessage(
          'Failed to send list members embed',
          10,
          error,
        ));
      });
    }
  });

  if (empty) {
    commandNoResults(
      channel,
      member,
      `There are no duplicate users found in the **${guild.toString()}** guild.`,
    );
  }
}

/**
 * Fetch members.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function fetchMembers(message: Message, allowedRoles: Roles): Promise<void> {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    guild,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const commandRoute = <FetchMembersRoute>commandArguments[1];
  const commandAction = <FetchMembersAction>commandArguments[2];
  const guildMembers = await guild.members.fetch();
  const matchedUsers: string[] = [];

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // If command route is invalid.
  if (!_.includes(['avatar', 'role', 'string', 'username'], commandRoute)) {
    commandError(
      channel,
      member,
      [
        `The command route (${commandRoute}) is invalid or does not exist. Try using the command by selecting a route.\n`,
        'Examples:',
        '```',
        `${commandCommand} avatar [@user]`,
        `${commandCommand} role [@role]`,
        `${commandCommand} string [string]`,
        `${commandCommand} username [@user]`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // If command route is "avatar" or "username".
  if (_.includes(['avatar', 'username'], commandRoute)) {
    try {
      const theMember = await guild.members.fetch(_.replace(commandAction, /[<@!>]/g, ''));

      // If selected member does not have an avatar.
      if (commandRoute === 'avatar' && theMember.user.avatar === null) {
        commandError(
          channel,
          member,
          `Cannot compare members. ${theMember.toString()} does not have an avatar to compare from.`,
        );

        return;
      }

      // Delete message with command.
      commandDeleteMessage(message);

      // Fetch members that either have the same avatar or username as selected member.
      _.forEach([...guildMembers.values()], (guildMember) => {
        if (
          (commandRoute === 'avatar' && theMember.user.avatar === guildMember.user.avatar)
          || (commandRoute === 'username' && theMember.user.username === guildMember.user.username)
        ) {
          matchedUsers.push(guildMember.toString());
        }
      });

      // Send a message embed for every 80 members.
      _.forEach(_.chunk(matchedUsers, 80), (matchedUsersChunk, key) => {
        channel.send({
          embeds: [
            createListMembersEmbed(
              [
                ...(commandRoute === 'avatar') ? [`Avatars Matching @${theMember?.user.tag}`] : [],
                ...(commandRoute === 'username') ? [`Usernames Matching @${theMember?.user.tag}`] : [],
                ...(key > 0) ? [`(Page ${key + 1})`] : [],
              ].join(' '),
              matchedUsersChunk,
              theMember.user.displayAvatarURL({
                format: 'webp',
                dynamic: true,
                size: 4096,
              }),
              member.user.tag,
            ),
          ],
        }).catch((error) => generateLogMessage(
          'Failed to send list members embed',
          10,
          error,
        ));
      });
    } catch {
      commandError(
        channel,
        member,
        [
          `The member (${commandAction}) is invalid. Try using the command by tagging a member.\n`,
          'Example:',
          '```',
          `${commandCommand} ${commandRoute} [@user]`,
          '```',
        ].join('\n'),
      );
    }
  }

  // If command route is "role".
  if (_.includes(['role'], commandRoute)) {
    const theRole = guild.roles.resolve(_.replace(commandAction, /[<@&>]/g, ''));

    // If role does not exist.
    if (theRole === null) {
      commandError(
        channel,
        member,
        [
          `The role (${commandAction}) is invalid. Try using the command by tagging a role.\n`,
          'Example:',
          '```',
          `${commandCommand} ${commandRoute} [@role]`,
          '```',
        ].join('\n'),
      );

      return;
    }

    // Delete message with command.
    commandDeleteMessage(message);

    // Fetch members that have the selected role.
    _.forEach([...theRole.members.values()], (guildMember) => {
      matchedUsers.push(guildMember.toString());
    });

    // If no results were found.
    if (_.size(matchedUsers) === 0) {
      commandNoResults(
        channel,
        member,
        `The member list for ${theRole.toString()} role is empty.`,
      );

      return;
    }

    // Send a message embed for every 80 members.
    _.forEach(_.chunk(matchedUsers, 80), (matchedUsersChunk, key) => {
      channel.send({
        embeds: [
          createListMembersEmbed(
            [
              `${theRole.name} Members`,
              ...(key > 0) ? [`(Page ${key + 1})`] : [],
            ].join(' '),
            matchedUsersChunk,
            undefined,
            member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to send list members embed',
        10,
        error,
      ));
    });
  }

  // If command route is "string".
  if (_.includes(['string'], commandRoute)) {
    let query = commandAction;

    // Transform string input (with quotes) into query.
    if (new RegExp(/"(.+)"/g).test(messageText)) {
      const stringArg = messageText.substring(messageText.lastIndexOf('string "') + 7);

      query = _.replace(stringArg, /(")(.+)(")/g, '$2');
    }

    // If no string is specified.
    if (query === undefined || query === '""') {
      commandError(
        channel,
        member,
        [
          'There is nothing specified. Try using the command by specifying a string (with or without quotes).\n',
          'Example:',
          '```',
          `${commandCommand} ${commandRoute} [text]`,
          '```',
        ].join('\n'),
      );

      return;
    }

    // Delete message with command.
    commandDeleteMessage(message);

    // Fetch members that match partial nickname, partial username, or avatar hash.
    _.forEach([...guildMembers.values()], (guildMember) => {
      if (
        _.includes(guildMember.nickname, query)
        || _.includes(guildMember.user.username, query)
        || (
          guildMember.user.avatar !== null
          && guildMember.user.avatar === query
        )
      ) {
        matchedUsers.push(guildMember.toString());
      }
    });

    // If no results were found.
    if (_.size(matchedUsers) === 0) {
      commandNoResults(
        channel,
        member,
        `No results were found using \`${query}\`.`,
      );

      return;
    }

    // Send a message embed for every 80 members.
    _.forEach(_.chunk(matchedUsers, 80), (matchedUsersChunk, key) => {
      channel.send({
        embeds: [
          createListMembersEmbed(
            [
              `Members Matching \`${query}\``,
              ...(key > 0) ? [`(Page ${key + 1})`] : [],
            ].join(' '),
            matchedUsersChunk,
            undefined,
            member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to send list members embed',
        10,
        error,
      ));
    });
  }
}

/**
 * Help menu.
 *
 * @param {Message}          message      - Message object.
 * @param {Roles}            allowedRoles - Roles allowed to use this command.
 * @param {HelpMenuSettings} settings     - Command settings.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function helpMenu(message: Message, allowedRoles: Roles, settings: HelpMenuSettings): Promise<void> {
  if (!message.channel || !message.member) {
    generateLogMessage(
      'Missing the "channel" or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const theBotPrefix = settings.botPrefix;
  const allowBulkBanRoles = settings.bulkBan;
  const allowFetchDuplicatesRoles = settings.fetchDuplicates;
  const allowFetchMembersRoles = settings.fetchMembers;
  const allowRoleManagerRoles = settings.roleManager;
  const allowTogglePermsRoles = settings.togglePerms;
  const allowVoiceToolsRoles = settings.voiceTools;
  const commands = [];

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  if (
    _.some(allowBulkBanRoles, (allowBulkBanRole) => member.roles.resolve(allowBulkBanRole.id) !== null)
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}bulk-ban [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}ban [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}bb [@user]`] : [],
      ],
      description: 'Bulk ban members tagged in a single command',
    });
  }

  if (
    _.some(allowFetchDuplicatesRoles, (allowFetchDuplicatesRole) => member.roles.resolve(allowFetchDuplicatesRole.id) !== null)
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}fetch-duplicates`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}duplicates`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}fd`] : [],
      ],
      description: 'Search for duplicate members matching the same avatar',
    });
  }

  if (
    _.some(allowFetchMembersRoles, (allowFetchMembersRole) => member.roles.resolve(allowFetchMembersRole.id) !== null)
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}fetch-members avatar [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}fetch-members role [@role]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}fetch-members string [string]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}fetch-members username [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}members avatar [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}members role [@role]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}members string [string]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}members username [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}fm avatar [@user]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}fm role [@role]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}fm string [string]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}fm username [@user]`] : [],
      ],
      description: 'Search for members matching an avatar, role, string, or username',
    });
  }

  if (
    _.some(allowRoleManagerRoles, (allowRoleManagerRole) => member.roles.resolve(allowRoleManagerRole.id) !== null)
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}role-manager add everyone [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}role-manager add no-role [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}role-manager add [@role] [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}role-manager remove everyone [@role to remove]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}role-manager remove [@role] [@role to remove]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}role add everyone [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}role add no-role [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}role add [@role] [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}role remove everyone [@role to remove]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}role remove [@role] [@role to remove]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}rm add everyone [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}rm add no-role [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}rm add [@role] [@role to add]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}rm remove everyone [@role to remove]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}rm remove [@role] [@role to remove]`] : [],
      ],
      description: 'Add or remove roles from everyone, users with no roles, or users with a specific role',
    });
  }

  if (
    _.some(allowTogglePermsRoles, (allowTogglePermsRole) => member.roles.resolve(allowTogglePermsRole.id) !== null)
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}toggle-perms [id] on`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}toggle-perms [id] off`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}perms [id] on`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}perms [id] off`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}tp [id] on`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}tp [id] off`] : [],
      ],
      description: 'Toggle preset permissions',
    });
  }

  if (
    _.some(allowVoiceToolsRoles, (allowVoiceToolsRole) => member.roles.resolve(allowVoiceToolsRole.id) !== null)
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}voice-tools disconnect [#channel]`] : [],
        ...(commandCommand === `${theBotPrefix}help-menu`) ? [`${theBotPrefix}voice-tools unmute [#channel]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}voice disconnect [#channel]`] : [],
        ...(commandCommand === `${theBotPrefix}help`) ? [`${theBotPrefix}voice unmute [#channel]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}vt disconnect [#channel]`] : [],
        ...(commandCommand === `${theBotPrefix}hm`) ? [`${theBotPrefix}vt unmute [#channel]`] : [],
      ],
      description: 'Disconnect or unmute everyone in a voice or stage channel',
    });
  }

  if (_.size(commands) > 0) {
    try {
      await channel.send({
        embeds: [
          createHelpMenuEmbed(
            commands,
            member.user.tag,
          ),
        ],
      });
    } catch (error) {
      generateLogMessage(
        'Failed to send help menu embed',
        10,
        error,
      );
    }
  } else {
    commandError(
      channel,
      member,
      'You do not have available commands assigned for your use.',
    );
  }
}

/**
 * Role manager.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function roleManager(message: Message, allowedRoles: Roles): Promise<void> {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    guild,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const commandRoute = <RoleRoute>commandArguments[1];
  const commandSelection = <RoleSelection>commandArguments[2];
  const commandAction = <RoleAction>commandArguments[3];
  const guildMembers = await guild.members.fetch();
  const roleOne = guild.roles.resolve(_.replace(commandSelection, /[<@&>]/g, ''));
  const roleTwo = guild.roles.resolve(_.replace(commandAction, /[<@&>]/g, ''));

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // If command route is invalid.
  if (!_.includes(['add', 'remove'], commandRoute)) {
    commandError(
      channel,
      member,
      [
        `The command route (${commandRoute}) is invalid or does not exist. Try using the command by inputting a route.\n`,
        'Examples:',
        '```',
        `${commandCommand} add everyone [@role to add]`,
        `${commandCommand} add no-role [@role to add]`,
        `${commandCommand} add [@role] [@role to add]`,
        `${commandCommand} remove everyone [@role to remove]`,
        `${commandCommand} remove [@role] [@role to remove]`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // If command selection is invalid.
  if (
    (commandRoute === 'add' && !_.includes(['everyone', 'no-role'], commandSelection) && roleOne === null)
    || (commandRoute === 'remove' && !_.includes(['everyone'], commandSelection) && roleOne === null)
  ) {
    commandError(
      channel,
      member,
      [
        `The command selection (${commandSelection}) is invalid or does not exist. Try using the command by inputting a selection.\n`,
        'Examples:',
        '```',
        ...[
          `${commandCommand} ${commandRoute} everyone [@role to ${commandRoute}]`,
          ...(commandRoute === 'add') ? [`${commandCommand} add no-role [@role to add]`] : [],
          `${commandCommand} ${commandRoute} [@role] [@role to ${commandRoute}]`,
        ],
        '```',
      ].join('\n'),
    );

    return;
  }

  // If command action is invalid.
  if (roleTwo === null) {
    commandError(
      channel,
      member,
      [
        `The role (${commandAction}) is invalid or does not exist. Try using the command by tagging a role to add.\n`,
        'Examples:',
        '```',
        `${commandCommand} ${commandRoute} ${commandSelection} [@role to ${commandRoute}]`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Send status message.
  const statusMessage = await channel.send({
    embeds: [
      createRoleManagerEmbed(
        commandRoute,
        [
          `Please wait while Stonker Bot ${commandRoute}s the ${roleTwo.toString()} role`,
          ...(commandRoute === 'add') ? ['to'] : [],
          ...(commandRoute === 'remove') ? ['from'] : [],
          'all',
          ...(commandSelection === 'everyone') ? ['members'] : [],
          ...(commandSelection === 'no-role') ? ['members with no roles'] : [],
          ...(roleOne) ? [`members with the ${roleOne.toString()} role`] : [],
          '...',
        ].join(' '),
        'in-progress',
        member.user.tag,
      ),
    ],
  });

  // Perform actions.
  const roleResults = _.map([...guildMembers.values()], async (guildMember) => {
    /**
     * Role results logger.
     *
     * @param {string}       word      - Base wording.
     * @param {RoleToOrFrom} toOrFrom  - Command direction.
     * @param {boolean}      isSuccess - Is successful.
     * @param {unknown}      error     - Error object.
     *
     * @returns {void}
     *
     * @since 1.0.0
     */
    const logger = (word: string, toOrFrom: RoleToOrFrom, isSuccess: boolean, error?: unknown): void => {
      generateLogMessage(
        [
          word,
          ...(isSuccess) ? [chalk.green(roleTwo.toString())] : [chalk.red(roleTwo.toString())],
          toOrFrom,
          ...(isSuccess) ? [chalk.green(guildMember.toString())] : [chalk.red(guildMember.toString())],
        ].join(' '),
        (isSuccess) ? 30 : 10,
        (_.isError(error)) ? error : undefined,
      );
    };

    let success = true;

    // Add: Make sure member does not have role.
    if (commandRoute === 'add' && guildMember.roles.resolve(roleTwo.id) === null) {
      if (
        (commandSelection === 'everyone') // Add role to everyone.
        || (commandSelection === 'no-role' && _.size(guildMember.roles.cache) === 1) // Add role to members with no roles.
        || (roleOne && guildMember.roles.resolve(roleOne.id) !== null) // Add role if user has role #1.
      ) {
        try {
          await guildMember.roles.add(roleTwo);

          logger('Successfully added', 'to', true);
        } catch (error) {
          success = false;

          logger('Failed to add', 'to', false, error);
        }
      }
    }

    // Remove: Make sure member has role.
    if (commandRoute === 'remove' && guildMember.roles.resolve(roleTwo.id) !== null) {
      if (
        (commandSelection === 'everyone') // Remove role from everyone.
        || (roleOne && guildMember.roles.resolve(roleOne.id) !== null) // Remove role if user has role #1.
      ) {
        try {
          await guildMember.roles.remove(roleTwo);

          logger('Successfully removed', 'from', true);
        } catch (error) {
          success = false;

          logger('Failed to remove', 'from', false, error);
        }
      }
    }

    return success;
  });

  // Check actions and edit status message.
  Promise.all(roleResults).then((responses) => {
    const success = _.every(responses, (response) => response === true);

    statusMessage.edit({
      embeds: [
        createRoleManagerEmbed(
          commandRoute,
          [
            roleTwo.toString(),
            ...(success) ? ['was successfully'] : ['could not be'],
            ...(commandRoute === 'add') ? ['added to'] : [],
            ...(commandRoute === 'remove') ? ['removed from'] : [],
            'all',
            ...(commandSelection === 'everyone') ? ['members'] : [],
            ...(commandSelection === 'no-role') ? ['members with no roles'] : [],
            ...(roleOne) ? [`members with the ${roleOne.toString()} role`] : [],
            '...',
          ].join(' '),
          (success) ? 'complete' : 'fail',
          member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to edit role embed',
      10,
      error,
    ));
  });
}

/**
 * Toggle perms.
 *
 * @param {Message}             message      - Message object.
 * @param {Roles}               allowedRoles - Roles allowed to use this command.
 * @param {TogglePermsSettings} settings     - Command settings.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function togglePerms(message: Message, allowedRoles: Roles, settings: TogglePermsSettings): Promise<void> {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    guild,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const commandGroup = <TogglePermsGroup>commandArguments[1];
  const commandToggle = <TogglePermsToggle>commandArguments[2];
  const selectedToggleGroup = _.find(settings, { id: commandGroup });
  const selectedToggleDirection = _.get(selectedToggleGroup, commandToggle);
  const selectedToggleName = _.get(selectedToggleGroup, 'name', 'Unknown');

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // If toggle group is invalid.
  if (selectedToggleGroup === undefined) {
    const permsIds = _.map(settings, 'id');

    let commands = '';

    // Shows the first 15 toggle groups.
    _.forEach(permsIds, (permsId, key) => {
      if (key < 15) {
        commands += [
          `${commandCommand} ${permsId} on`,
          `${commandCommand} ${permsId} off\n\n`,
        ].join('\n');
      }
    });

    commandError(
      channel,
      member,
      [
        `The toggle group (${commandGroup}) is invalid. Please type your command with the correct group and try again.\n`,
        'Example(s):',
        '```',
        commands,
        '```',
      ].join('\n'),
    );

    return;
  }

  // If toggle direction is invalid or not configured.
  if (
    !_.isArray(selectedToggleDirection)
    || _.isEmpty(selectedToggleDirection)
    || !_.every(selectedToggleDirection, _.isPlainObject)
    || (commandToggle !== 'on' && commandToggle !== 'off')
  ) {
    commandError(
      channel,
      member,
      [
        `The toggle direction (${commandToggle}) is invalid or not configured. Please type your command with the correct direction and try again.\n`,
        'Example:',
        '```',
        `${commandCommand} ${commandGroup} on`,
        `${commandCommand} ${commandGroup} off`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Perform actions for channels.
  const channelToggles = _.map(selectedToggleDirection, async (channelToggle) => {
    const channelToggleId = _.get(channelToggle, 'channel-id');
    const channelTogglePerms = _.get(channelToggle, 'channel-perms');

    try {
      const channelToggleChannel = await guild.channels.fetch(channelToggleId);

      if (channelToggleChannel) {
        // Perform actions for users or roles.
        const userOrRoleToggles = _.map(channelTogglePerms, async (userToggle) => {
          const theId = _.get(userToggle, 'user-or-role-id');
          const thePerms = _.get(userToggle, 'user-or-role-perms');

          let isSuccess = true;

          try {
            await channelToggleChannel.permissionOverwrites.edit(
              theId,
              thePerms,
              {
                reason: `@${member.user.tag} toggled preset permissions for ${selectedToggleName} to ${commandToggle}`,
              },
            );
          } catch (error) {
            isSuccess = false;

            generateLogMessage(
              [
                'Failed to toggle preset permissions for',
                chalk.red(selectedToggleName),
                `to ${commandToggle} for`,
                chalk.red(channelToggleChannel.toString()),
              ].join(' '),
              10,
              error,
            );
          }

          return isSuccess;
        });

        return Promise.all(userOrRoleToggles);
      }

      return false;
    } catch {
      generateLogMessage(
        [
          'Failed to toggle preset permissions for',
          chalk.red(selectedToggleName),
          `to ${commandToggle} because`,
          chalk.red(`<#${channelToggleId}>`),
          'is invalid',
        ].join(' '),
        10,
      );

      return false;
    }
  });

  // Check actions and send success or fail message.
  Promise.all(channelToggles).then((responses) => {
    const answers = _.flattenDeep(responses);
    const success = _.every(answers, (answer) => answer === true);

    if (success) {
      generateLogMessage(
        [
          'Successfully toggled preset permissions for',
          chalk.green(selectedToggleName),
          `to ${commandToggle}`,
        ].join(' '),
        30,
      );

      channel.send({
        embeds: [
          createTogglePermsEmbed(
            `Successfully toggled preset permissions for **${selectedToggleName}** to ${commandToggle}.`,
            true,
            member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to send toggle perms embed',
        10,
        error,
      ));
    } else {
      channel.send({
        embeds: [
          createTogglePermsEmbed(
            [
              `Failed to toggle one or more preset permissions for **${selectedToggleName}** to ${commandToggle}.`,
              'Please check the logs and configuration file then try again.',
            ].join(' '),
            false,
            member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to send toggle perms embed',
        10,
        error,
      ));
    }
  });
}

/**
 * Voice tools.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export async function voiceTools(message: Message, allowedRoles: Roles): Promise<void> {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const {
    channel,
    guild,
    member,
  } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const commandRoute = <VoiceRoute>commandArguments[1];
  const commandSelection = <VoiceAction>commandArguments[2];
  const voiceOrStageChannel = guild.channels.resolve(_.replace(commandSelection, /[<#>]/g, ''));
  const voiceOrStageChannelType = (voiceOrStageChannel) ? voiceOrStageChannel.type : undefined;
  const voiceStates = [...guild.voiceStates.cache.values()];

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.resolve(allowedRole.id) !== null)
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // If command route is invalid.
  if (!_.includes(['disconnect', 'unmute'], commandRoute)) {
    commandError(
      channel,
      member,
      [
        `The command route (${commandRoute}) is invalid or does not exist. Try using the command by selecting a route.\n`,
        'Examples:',
        '```',
        `${commandCommand} disconnect [#channel]`,
        `${commandCommand} unmute [#channel]`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // If command selection is invalid.
  if (voiceOrStageChannel === null) {
    commandError(
      channel,
      member,
      [
        `The voice or stage channel (${commandSelection}) is invalid or does not exist. Try using the command by pasting a channel ID.\n`,
        'Example:',
        '```',
        `${commandCommand} ${commandRoute} [#channel]`,
        '```',
      ].join('\n'),
    );

    return;
  }

  // If bot does not have enough permissions.
  if (
    guild.me
    && (
      (commandRoute === 'disconnect' && !guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS))
      || (commandRoute === 'unmute' && !guild.me.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
    )
  ) {
    commandError(
      channel,
      member,
      [
        'Stonker Bot requires the',
        ...(commandRoute === 'disconnect') ? ['**Move Members**'] : [],
        ...(commandRoute === 'unmute') ? ['**Mute Members**'] : [],
        `permission to ${commandRoute} members from the`,
        voiceOrStageChannel.toString(),
        ...(voiceOrStageChannelType === 'GUILD_VOICE') ? ['voice'] : [],
        ...(voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? ['stage'] : [],
        'channel.',
      ].join(' '),
    );

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Send status message.
  const statusMessage = await channel.send({
    embeds: [
      createVoiceToolsEmbed(
        (commandRoute === 'unmute' && voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? 'invite' : commandRoute,
        [
          `Please wait while Stonker Bot ${commandRoute}s all members connected to the`,
          voiceOrStageChannel.toString(),
          ...(voiceOrStageChannelType === 'GUILD_VOICE') ? ['voice'] : [],
          ...(voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? ['stage'] : [],
          'channel...',
        ].join(' '),
        'in-progress',
        member.user.tag,
      ),
    ],
  });

  // Perform actions.
  const voiceResults = _.map(voiceStates, async (voiceState) => {
    let success = true;

    if (
      voiceState.member
      && voiceState.channel
      && voiceState.channelId === voiceOrStageChannel.id
    ) {
      const memberMention = voiceState.member.toString();
      const channelMention = voiceState.channel.toString();
      /**
       * Voice results logger.
       *
       * @param {string}  word      - Base wording.
       * @param {boolean} isSuccess - Is successful.
       * @param {unknown} error     - Error object.
       *
       * @returns {void}
       *
       * @since 1.0.0
       */
      const logger = (word: string, isSuccess: boolean, error?: unknown): void => {
        generateLogMessage(
          [
            word,
            ...(isSuccess) ? [chalk.green(memberMention)] : [chalk.red(memberMention)],
            'from the',
            ...(isSuccess) ? [chalk.green(channelMention)] : [chalk.red(channelMention)],
            ...(voiceOrStageChannelType === 'GUILD_VOICE') ? ['voice'] : [],
            ...(voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? ['stage'] : [],
            'channel',
          ].join(' '),
          (isSuccess) ? 30 : 10,
          (_.isError(error)) ? error : undefined,
        );
      };

      // Disconnect members connected to selected voice or stage channel.
      if (commandRoute === 'disconnect') {
        try {
          await voiceState.disconnect();

          logger('Disconnected', true);
        } catch (error) {
          success = false;

          logger('Failed to disconnect', false, error);
        }
      }

      // Unmute members connected to selected voice or stage channel.
      if (commandRoute === 'unmute') {
        try {
          await voiceState.setMute(false);

          logger('Unmuted', true);
        } catch (error) {
          success = false;

          logger('Failed to unmute', false, error);
        }
      }
    }

    return success;
  });

  // Check actions and edit status message.
  Promise.all(voiceResults).then((responses) => {
    const success = _.every(responses, (response) => response === true);

    statusMessage.edit({
      embeds: [
        createVoiceToolsEmbed(
          (commandRoute === 'unmute' && voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? 'invite' : commandRoute,
          [
            ...(success) ? ['All members have been'] : ['One or more members could not be'],
            ...(commandRoute === 'disconnect') ? ['disconnected from'] : [],
            ...(commandRoute === 'unmute' && voiceOrStageChannelType === 'GUILD_VOICE') ? ['unmuted from'] : [],
            ...(commandRoute === 'unmute' && voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? ['invited to speak in'] : [],
            'the',
            voiceOrStageChannel.toString(),
            ...(voiceOrStageChannelType === 'GUILD_VOICE') ? ['voice'] : [],
            ...(voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? ['stage'] : [],
            'channel.',
          ].join(' '),
          (success) ? 'complete' : 'fail',
          member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to edit voice embed',
      10,
      error,
    ));
  });
}
