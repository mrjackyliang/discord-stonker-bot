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
  DuplicateUsers,
  FetchMembersAction,
  FetchMembersRoute,
  HelpMenuSettings,
  RoleAction,
  RoleRoute,
  Roles,
  RoleSelection,
  TogglePermsGroup,
  TogglePermsSettings,
  TogglePermsToggle,
  VoiceAction,
  VoiceRoute,
} from '../types';

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
  }).catch((error: Error) => generateLogMessage(
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
  message.delete().catch((error: Error) => generateLogMessage(
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
 * @returns {void}
 *
 * @since 1.0.0
 */
export function bulkBan(message: Message, allowedRoles: Roles): void {
  if (!message.channel || !message.guild || !message.member) {
    generateLogMessage(
      'Missing the "channel", "guild", or "member" property.',
      10,
    );

    return;
  }

  const { channel, guild, member } = message;
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandCommand = commandArguments[0];
  const commandTags = commandArguments.slice(1);
  const tags = <string[]>_.filter(commandTags, (commandTag) => commandTag.match(/<@!?([0-9]+)>/g));
  const matches = _.map(tags, (tag) => tag.replace(/<@!?([0-9]+)>/g, '$1'));

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  if (matches.length === 0) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            'No member tags were detected. Try using the command by tagging one or more members.\n',
            'Example:',
            '```',
            `${commandCommand} [@user]`,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Begin to perform role actions.
  channel.send({
    embeds: [
      createBulkBanEmbed(
        'Please wait while Stonker Bot bans the selected members',
        'in-progress',
        member.user.tag,
      ),
    ],
  }).then((theMessage) => {
    const banResults = _.map(matches, (match) => {
      const guildMember = guild.members.cache.get(match);

      let success = true;

      if (guildMember) {
        const guildMemberMention = guildMember.toString();
        /**
         * Ban member result logger.
         *
         * @param {string} word  - Beginning phrase.
         * @param {Error}  error - Error object.
         *
         * @returns {boolean}
         *
         * @since 1.0.0
         */
        const logger = (word: string, error?: Error): boolean => {
          generateLogMessage(
            [
              word,
              (!_.isError(error)) ? chalk.green(guildMemberMention) : chalk.red(guildMemberMention),
              'using the bulk ban command',
            ].join(' '),
            (!_.isError(error)) ? 30 : 10,
            (_.isError(error)) ? error : undefined,
          );

          return (!_.isError(error));
        };

        guildMember.ban({
          reason: [
            `@${member.user.tag}`,
            'used the bulk ban command',
          ].join(' '),
        }).then(() => logger(
          'Successfully banned',
        )).catch((error: Error) => {
          success = logger(
            'Failed to ban',
            error,
          );
        });
      }

      return success;
    });

    Promise.all(banResults).then((responses) => {
      const success = _.every(responses, (response) => response === true);

      theMessage.edit({
        embeds: [
          createBulkBanEmbed(
            [
              'Selected members',
              (success) ? 'were' : 'could not be',
              `successfully banned from the **${guild.toString()}** guild.`,
            ].join(' '),
            (success) ? 'complete' : 'fail',
            member.user.tag,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to edit role embed',
        10,
        error,
      ));
    });
  }).catch((error: Error) => generateLogMessage(
    'Failed to send bulk ban embed',
    10,
    error,
  ));
}

/**
 * Fetch duplicates.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function fetchDuplicates(message: Message, allowedRoles: Roles): void {
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
  const guildMembers = [...guild.members.cache.values()];
  const users: DuplicateUsers = {};

  let empty = true;

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Remap users based on their avatar.
  _.forEach(guildMembers, (guildMember) => {
    const guildMemberAvatar = guildMember.user.avatar;

    if (guildMemberAvatar !== null) {
      // Create entry for avatar hash if it does not exist.
      if (users[guildMemberAvatar] === undefined) {
        users[guildMemberAvatar] = [];
      }

      users[guildMemberAvatar].push(guildMember.toString());
    }
  });

  // Loop through all users with avatars.
  _.forEach(Object.entries(users), (usersEntry) => {
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
                `\`${avatarHash.substr(_.size(avatarHash) - 8)}\``,
                (key > 0) ? `(Page ${key + 1})` : '',
              ].join(' '),
              userIdsChunk,
              undefined,
              member.user.tag,
            ),
          ],
        }).catch((error: Error) => generateLogMessage(
          'Failed to send list members embed',
          10,
          error,
        ));
      });
    }
  });

  if (empty) {
    channel.send({
      embeds: [
        createNoResultsEmbed(
          `There are no duplicate users found in the **${guild.toString()}** guild.`,
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send no results embed',
      10,
      error,
    ));
  }
}

/**
 * Fetch members.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function fetchMembers(message: Message, allowedRoles: Roles): void {
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
  const theMember = guild.members.cache.get(_.replace(commandAction, /[<@!>]/g, ''));
  const theRole = guild.roles.cache.get(_.replace(commandAction, /[<@&>]/g, ''));
  const guildMembers = [...guild.members.cache.values()];
  const matchedUsers: string[] = [];

  let query = commandAction;

  // Transform string input (with quotes) into query.
  if (commandRoute === 'string' && new RegExp(/"(.+)"/g).test(messageText)) {
    const stringArg = messageText.substring(messageText.lastIndexOf('string "') + 7);

    if (stringArg !== '"') {
      // Remove the quotes.
      query = _.replace(stringArg, /(")(.+)(")/g, '$2');
    } else {
      query = ' ';
    }
  }

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // If command route is invalid.
  if (!_.includes(['avatar', 'role', 'string', 'username'], commandRoute)) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
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
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If member or role is invalid.
  if (
    (commandRoute === 'avatar' && theMember === undefined)
    || (commandRoute === 'role' && theRole === undefined)
    || (commandRoute === 'string' && query === undefined)
    || (commandRoute === 'username' && theMember === undefined)
  ) {
    const userMode = (_.includes(['avatar', 'username'], commandRoute)) ? [`The member (${query}) is invalid`, 'tagging a member', '@user'] : [];
    const roleMode = (_.includes(['role'], commandRoute)) ? [`The role (${query}) is invalid`, 'tagging a role', '@role'] : [];
    const stringMode = (_.includes(['string'], commandRoute)) ? ['There is nothing specified', 'specifying a string (with or without quotes)', 'text'] : [];

    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `${userMode[0] ?? roleMode[0] ?? stringMode[0]}. Try using the command by ${userMode[1] ?? roleMode[1] ?? stringMode[1]}.\n`,
            'Example:',
            '```',
            `${commandCommand} ${commandRoute} [${userMode[2] ?? roleMode[2] ?? stringMode[2]}]`,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If user does not have an avatar.
  if (commandRoute === 'avatar' && theMember?.user.avatar === null) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          `Cannot compare members. ${theMember?.toString()} does not have an avatar to compare from.`,
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  _.forEach(guildMembers, (guildMember) => {
    const memberNickname = guildMember.nickname;
    const userAvatar = guildMember.user.avatar;
    const userUsername = guildMember.user.username;
    const hasRole = guildMember.roles.cache.has(_.replace(commandAction, /[<@&>]/g, ''));

    if (
      (commandRoute === 'avatar' && userAvatar === theMember?.user.avatar)
      || (commandRoute === 'role' && hasRole)
      || (commandRoute === 'string' && (_.includes(memberNickname, query) || _.includes(userUsername, query) || (userAvatar !== null && userAvatar === query)))
      || (commandRoute === 'username' && userUsername === theMember?.user.username)
    ) {
      matchedUsers.push(guildMember.toString());
    }
  });

  // No results for "string".
  if (commandRoute === 'string' && _.size(matchedUsers) < 1) {
    channel.send({
      embeds: [
        createNoResultsEmbed(
          `No results were found using \`${query}\`.`,
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send no results embed',
      10,
      error,
    ));

    return;
  }

  // Send a message embed for every 80 members.
  _.forEach(_.chunk(matchedUsers, 80), (matchedUsersChunk, key) => {
    const avatarTitle = (commandRoute === 'avatar') ? `Avatars Matching @${theMember?.user.tag}` : undefined;
    const roleTitle = (commandRoute === 'role') ? `${theRole?.name} Members` : undefined;
    const stringTitle = (commandRoute === 'string') ? `Members Matching \`${query}\`` : undefined;
    const usernameTitle = (commandRoute === 'username') ? `Usernames Matching @${theMember?.user.tag}` : undefined;

    channel.send({
      embeds: [
        createListMembersEmbed(
          `${avatarTitle ?? roleTitle ?? stringTitle ?? usernameTitle}${(key > 0) ? ` (Page ${key + 1})` : ''}`,
          matchedUsersChunk,
          theMember?.user.displayAvatarURL({
            format: 'webp',
            dynamic: true,
            size: 4096,
          }),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send list members embed',
      10,
      error,
    ));
  });
}

/**
 * Help menu.
 *
 * @param {Message}          message      - Message object.
 * @param {Roles}            allowedRoles - Roles allowed to use this command.
 * @param {HelpMenuSettings} settings     - Command settings.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function helpMenu(message: Message, allowedRoles: Roles, settings: HelpMenuSettings): void {
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
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  if (
    _.some(allowBulkBanRoles, (allowBulkBanRole) => member.roles.cache.has(allowBulkBanRole.id))
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${theBotPrefix}bulk-ban [@user]`,
      ],
      description: 'Bulk ban members tagged in a single command',
    });
  }

  if (
    _.some(allowFetchDuplicatesRoles, (allowFetchDuplicatesRole) => member.roles.cache.has(allowFetchDuplicatesRole.id))
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${theBotPrefix}fetch-duplicates`,
      ],
      description: 'Search for duplicate members matching the same avatar',
    });
  }

  if (
    _.some(allowFetchMembersRoles, (allowFetchMembersRole) => member.roles.cache.has(allowFetchMembersRole.id))
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${theBotPrefix}fetch-members avatar [@user]`,
        `${theBotPrefix}fetch-members role [@role]`,
        `${theBotPrefix}fetch-members string [string]`,
        `${theBotPrefix}fetch-members username [@user]`,
      ],
      description: 'Search for members matching an avatar, role, string, or username',
    });
  }

  if (
    _.some(allowRoleManagerRoles, (allowRoleManagerRole) => member.roles.cache.has(allowRoleManagerRole.id))
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${theBotPrefix}role-manager add everyone [@role to add]`,
        `${theBotPrefix}role-manager add no-role [@role to add]`,
        `${theBotPrefix}role-manager add [@role] [@role to add]`,
        `${theBotPrefix}role-manager remove everyone [@role to remove]`,
        `${theBotPrefix}role-manager remove [@role] [@role to remove]`,
      ],
      description: 'Add or remove roles from everyone, users with no roles, or users with a specific role',
    });
  }

  if (
    _.some(allowTogglePermsRoles, (allowTogglePermsRole) => member.roles.cache.has(allowTogglePermsRole.id))
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${theBotPrefix}toggle-perms [id] on`,
        `${theBotPrefix}toggle-perms [id] off`,
      ],
      description: 'Toggle preset permissions',
    });
  }

  if (
    _.some(allowVoiceToolsRoles, (allowVoiceToolsRole) => member.roles.cache.has(allowVoiceToolsRole.id))
    || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${theBotPrefix}voice-tools disconnect [#channel]`,
        `${theBotPrefix}voice-tools unmute [#channel]`,
      ],
      description: 'Disconnect or unmute everyone in a voice or stage channel',
    });
  }

  if (_.size(commands) > 0) {
    channel.send({
      embeds: [
        createHelpMenuEmbed(
          commands,
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send help menu embed',
      10,
      error,
    ));
  } else {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          'You do not have available commands currently assigned for your use.',
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));
  }
}

/**
 * Role manager.
 *
 * @param {Message} message      - Message object.
 * @param {Roles}   allowedRoles - Roles allowed to use this command.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function roleManager(message: Message, allowedRoles: Roles): void {
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
  const roleOne = guild.roles.cache.get(_.replace(commandSelection, /[<@&>]/g, ''));
  const roleTwo = guild.roles.cache.get(_.replace(commandAction, /[<@&>]/g, ''));
  const guildMembers = [...guild.members.cache.values()];
  const messageEveryone = (commandSelection === 'everyone') ? 'members...' : undefined;
  const messageNoRole = (commandSelection === 'no-role') ? 'members with no roles...' : undefined;
  const messageRole = (roleOne) ? `members with the ${roleOne.toString()} role...` : undefined;
  const messageAdded = (commandRoute === 'add') ? 'added to' : undefined;
  const messageRemoved = (commandRoute === 'remove') ? 'removed from' : undefined;

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  if (!_.includes(['add', 'remove'], commandRoute)) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
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
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (
    (commandRoute === 'add' && commandSelection !== 'everyone' && commandSelection !== 'no-role' && !roleOne)
    || (commandRoute === 'remove' && commandSelection !== 'everyone' && !roleOne)
  ) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
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
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (!roleTwo) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The role (${commandAction}) is invalid or does not exist. Try using the command by tagging a role to add.\n`,
            'Examples:',
            '```',
            `${commandCommand} ${commandRoute} ${commandSelection} [@role to ${commandRoute}]`,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Begin to perform role actions.
  channel.send({
    embeds: [
      createRoleManagerEmbed(
        commandRoute,
        [
          'Please wait while Stonker Bot',
          `${commandRoute}s the`,
          roleTwo.toString(),
          'role',
          ...(commandRoute === 'add') ? ['to'] : [],
          ...(commandRoute === 'remove') ? ['from'] : [],
          'all',
          messageEveryone ?? messageNoRole ?? messageRole,
        ].join(' '),
        'in-progress',
        member.user.tag,
      ),
    ],
  }).then((theMessage) => {
    const roleResults = _.map(guildMembers, (guildMember) => {
      /**
       * Role assignment result logger.
       *
       * @param {string} word  - Beginning phrase.
       * @param {Error}  error - Error object.
       *
       * @returns {boolean}
       *
       * @since 1.0.0
       */
      const logger = (word: string, error?: Error): boolean => {
        generateLogMessage(
          [
            word,
            (!_.isError(error)) ? chalk.green(roleTwo.toString()) : chalk.red(roleTwo.toString()),
            'role',
            ...(commandRoute === 'add') ? ['to'] : [],
            ...(commandRoute === 'remove') ? ['from'] : [],
            (!_.isError(error)) ? chalk.green(guildMember.toString()) : chalk.red(guildMember.toString()),
          ].join(' '),
          (!_.isError(error)) ? 30 : 10,
          (_.isError(error)) ? error : undefined,
        );

        return (!_.isError(error));
      };

      let success = true;

      // "add": Make sure member doesn't have role first. "remove": Make sure member has role first.
      if (commandRoute === 'add' && !guildMember.roles.cache.has(roleTwo.id)) {
        if (commandSelection === 'everyone') {
          guildMember.roles.add(roleTwo).then(() => logger(
            'Successfully added',
          )).catch((error: Error) => {
            success = logger(
              'Failed to add',
              error,
            );
          });
        } else if (commandSelection === 'no-role') {
          const roles = [...guildMember.roles.cache.values()];

          // Users with no roles always have the @everyone role.
          if (_.size(roles) === 1) {
            guildMember.roles.add(roleTwo).then(() => logger(
              'Successfully added',
            )).catch((error: Error) => {
              success = logger(
                'Failed to add',
                error,
              );
            });
          }
        } else if (roleOne) {
          const hasRoleOne = guildMember.roles.cache.has(roleOne.id);

          // If user has role #1, add role #2.
          if (hasRoleOne === true) {
            guildMember.roles.add(roleTwo).then(() => logger(
              'Successfully added',
            )).catch((error: Error) => {
              success = logger(
                'Failed to add',
                error,
              );
            });
          }
        }
      } else if (commandRoute === 'remove' && guildMember.roles.cache.has(roleTwo.id)) {
        if (commandSelection === 'everyone') {
          guildMember.roles.remove(roleTwo).then(() => logger(
            'Successfully removed',
          )).catch((error: Error) => {
            success = logger(
              'Failed to remove',
              error,
            );
          });
        } else if (roleOne) {
          const hasRoleOne = guildMember.roles.cache.has(roleOne.id);

          // If user has role #1, remove role #2.
          if (hasRoleOne === true) {
            guildMember.roles.remove(roleTwo).then(() => logger(
              'Successfully removed',
            )).catch((error: Error) => {
              success = logger(
                'Failed to remove',
                error,
              );
            });
          }
        }
      }

      return success;
    });

    Promise.all(roleResults).then((responses) => {
      const success = _.every(responses, (response) => response === true);

      theMessage.edit({
        embeds: [
          createRoleManagerEmbed(
            commandRoute,
            [
              roleTwo.toString(),
              (success) ? 'was successfully' : 'could not be',
              messageAdded ?? messageRemoved,
              'all',
              messageEveryone ?? messageNoRole ?? messageRole,
            ].join(' '),
            (success) ? 'complete' : 'fail',
            member.user.tag,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to edit role embed',
        10,
        error,
      ));
    });
  }).catch((error: Error) => generateLogMessage(
    'Failed to send role embed',
    10,
    error,
  ));
}

/**
 * Toggle perms.
 *
 * @param {Message}             message      - Message object.
 * @param {Roles}               allowedRoles - Roles allowed to use this command.
 * @param {TogglePermsSettings} settings     - Command settings.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function togglePerms(message: Message, allowedRoles: Roles, settings: TogglePermsSettings): void {
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
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
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

    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The toggle group (${commandGroup}) is invalid. Please type your command with the correct group and try again.\n`,
            'Example(s):',
            '```',
            commands,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If toggle direction is invalid or not configured.
  if (
    !_.isArray(selectedToggleDirection)
    || _.isEmpty(selectedToggleDirection)
    || !_.every(selectedToggleDirection, _.isPlainObject)
    || (commandToggle !== 'on' && commandToggle !== 'off')
  ) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The toggle direction (${commandToggle}) is invalid or not configured. Please type your command with the correct direction and try again.\n`,
            'Example:',
            '```',
            `${commandCommand} ${commandGroup} on`,
            `${commandCommand} ${commandGroup} off`,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Toggle permissions per channel.
  const channelToggles: (boolean | boolean[])[] = _.map(selectedToggleDirection, (channelToggle) => {
    const channelToggleId = _.get(channelToggle, 'channel-id');
    const channelTogglePerms = _.get(channelToggle, 'channel-perms');
    const channelToggleChannel = guild.channels.cache.get(channelToggleId);

    if (channelToggleChannel === undefined || channelToggleChannel.isThread()) {
      generateLogMessage(
        [
          'Failed to toggle preset permissions for',
          chalk.red(selectedToggleName),
          'to',
          commandToggle,
          `because channel (${channelToggleId}) is invalid`,
        ].join(' '),
        10,
      );

      return false;
    }

    return _.map(channelTogglePerms, (userToggle) => {
      const theId = _.get(userToggle, 'user-or-role-id');
      const thePerms = _.get(userToggle, 'user-or-role-perms');

      let isSuccess = true;

      channelToggleChannel.permissionOverwrites.edit(
        theId,
        thePerms,
        {
          reason: [
            `@${member.user.tag}`,
            'toggled preset permissions for',
            selectedToggleName,
            'to',
            commandToggle,
          ].join(' '),
        },
      ).catch((error: Error) => {
        isSuccess = false;

        generateLogMessage(
          [
            'Failed to toggle preset permissions for',
            chalk.red(selectedToggleName),
            'to',
            commandToggle,
            'for',
            chalk.red(channelToggleChannel.toString()),
          ].join(' '),
          10,
          error,
        );
      });

      return isSuccess;
    });
  });

  // Display success or failed message embed.
  Promise.all(channelToggles).then((responses) => {
    const answers = _.flattenDeep(responses);
    const success = _.every(answers, (answer) => answer === true);

    if (success) {
      generateLogMessage(
        [
          'Successfully toggled preset permissions for',
          chalk.green(selectedToggleName),
          'to',
          commandToggle,
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
      }).catch((error: Error) => generateLogMessage(
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
              'Please check the logs and configuration then try again.',
            ].join(' '),
            false,
            member.user.tag,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
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
 * @returns {void}
 *
 * @since 1.0.0
 */
export function voiceTools(message: Message, allowedRoles: Roles): void {
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
  const voiceOrStageChannel = guild.channels.cache.get(_.replace(commandSelection, /[<#>]/g, ''));
  const voiceOrStageChannelType = (voiceOrStageChannel) ? voiceOrStageChannel.type : undefined;
  const isVoiceOrStageChannel = _.includes(['GUILD_VOICE', 'GUILD_STAGE_VOICE'], voiceOrStageChannelType);
  const voiceChannel = (voiceOrStageChannelType === 'GUILD_VOICE') ? 'voice' : undefined;
  const stageChannel = (voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? 'stage' : undefined;

  if (
    !_.some(allowedRoles, (allowedRole) => member.roles.cache.has(allowedRole.id))
    && !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commandNoPermissions(channel, member, commandCommand);

    return;
  }

  // If command route is invalid.
  if (!_.includes(['disconnect', 'unmute'], commandRoute)) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The command route (${commandRoute}) is invalid or does not exist. Try using the command by selecting a route.\n`,
            'Examples:',
            '```',
            `${commandCommand} disconnect [#channel]`,
            `${commandCommand} unmute [#channel]`,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If voice or stage channel is invalid or does not exist.
  if (voiceOrStageChannel === undefined || !isVoiceOrStageChannel) {
    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The voice or stage channel (${commandSelection}) is invalid or does not exist. Try using the command by pasting a channel ID.\n`,
            'Example:',
            '```',
            `${commandCommand} ${commandRoute} [#channel]`,
            '```',
          ].join('\n'),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If bot does not have enough permissions.
  if (
    !guild.me
    || (commandRoute === 'disconnect' && !guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS))
    || (commandRoute === 'unmute' && !guild.me.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
  ) {
    const disconnect = (commandRoute === 'disconnect') ? 'Move Members' : undefined;
    const unmute = (commandRoute === 'unmute') ? 'Mute Members' : undefined;

    channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            'Stonker Bot requires the',
            `**${disconnect ?? unmute}**`,
            'permission to',
            commandRoute,
            'members from the',
            voiceOrStageChannel.toString(),
            voiceChannel ?? stageChannel,
            'channel.',
          ].join(' '),
          member.user.tag,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  commandDeleteMessage(message);

  // Begin to perform voice or stage channel actions.
  channel.send({
    embeds: [
      createVoiceToolsEmbed(
        commandRoute,
        `Please wait while Stonker Bot ${commandRoute}s all members connected to the ${voiceOrStageChannel.toString()} ${voiceChannel ?? stageChannel} channel...`,
        'in-progress',
        member.user.tag,
      ),
    ],
  }).then((theMessage) => {
    const voiceStates = [...voiceOrStageChannel.guild.voiceStates.cache.values()];
    const usersResults = _.map(voiceStates, (voiceState) => {
      let success = true;

      if (
        voiceState.member
        && voiceState.channel
        && voiceState.channelId === voiceOrStageChannel.id
      ) {
        const memberMention = voiceState.member.toString();
        const channelMention = voiceState.channel.toString();

        /**
         * Voice state result logger.
         *
         * @param {string} word  - Beginning phrase.
         * @param {Error}  error - Error object.
         *
         * @returns {boolean}
         *
         * @since 1.0.0
         */
        const logger = (word: string, error?: Error): boolean => {
          generateLogMessage(
            [
              word,
              (!_.isError(error)) ? chalk.green(memberMention) : chalk.red(memberMention),
              'from the',
              (!_.isError(error)) ? chalk.green(channelMention) : chalk.red(channelMention),
              voiceChannel ?? stageChannel,
              'channel',
            ].join(' '),
            (!_.isError(error)) ? 30 : 10,
            (_.isError(error)) ? error : undefined,
          );

          return (!_.isError(error));
        };

        if (commandRoute === 'disconnect') {
          voiceState.disconnect().then(() => logger(
            'Disconnected',
          )).catch((error: Error) => {
            success = logger('Failed to disconnect', error);
          });
        } else if (commandRoute === 'unmute') {
          voiceState.setMute(false).then(() => logger(
            'Unmuted',
          )).catch((error: Error) => {
            success = logger('Failed to unmute', error);
          });
        }
      }

      return success;
    });

    Promise.all(usersResults).then((responses) => {
      const success = _.every(responses, (response) => response === true);
      const disconnect = (commandRoute === 'disconnect') ? 'disconnected from' : undefined;
      const unmuteVoice = (commandRoute === 'unmute' && voiceOrStageChannelType === 'GUILD_VOICE') ? 'unmuted from' : undefined;
      const unmuteStage = (commandRoute === 'unmute' && voiceOrStageChannelType === 'GUILD_STAGE_VOICE') ? 'invited to speak in' : undefined;

      theMessage.edit({
        embeds: [
          createVoiceToolsEmbed(
            commandRoute,
            [
              (success) ? 'All members have been' : 'One or more members could not be',
              disconnect ?? unmuteVoice ?? unmuteStage,
              'the',
              voiceOrStageChannel.toString(),
              voiceChannel ?? stageChannel,
              'channel.',
            ].join(' '),
            (success) ? 'complete' : 'fail',
            member.user.tag,
          ),
        ],
      }).catch((error: Error) => generateLogMessage(
        'Failed to edit voice embed',
        10,
        error,
      ));
    });
  }).catch((error: Error) => generateLogMessage(
    'Failed to send voice embed',
    10,
    error,
  ));
}
