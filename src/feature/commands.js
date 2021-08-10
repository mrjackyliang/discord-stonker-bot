const chalk = require('chalk');
const { Permissions } = require('discord.js');
const _ = require('lodash');

const {
  createCommandErrorEmbed,
  createHelpMenuEmbed,
  createListMembersEmbed,
  createNoResultsEmbed,
  createRoleEmbed,
  createTogglePermsEmbed,
  createVoiceEmbed,
} = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Fetch members.
 *
 * @param {Message}  message      - Message object.
 * @param {string}   botPrefix    - Command prefix.
 * @param {object[]} allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function fetchMembers(message, botPrefix, allowedRoles) {
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const theMember = message.channel.guild.members.cache.get(_.replace(commandArguments[2], /[<@!>]/g, ''));
  const theRole = message.channel.guild.roles.cache.get(_.replace(commandArguments[2], /[<@&>]/g, ''));
  const guildMembers = [...message.channel.guild.members.cache.values()];
  const matchedUsers = [];

  let query = commandArguments[2];

  // Transform "string" command route input with quotes into query.
  if (commandArguments[1] === 'string' && new RegExp(/"(.+)"/g).test(messageText) === true) {
    const stringArg = messageText.substring(messageText.lastIndexOf('string "') + 7);

    if (stringArg !== '"') {
      // Remove the quotes.
      query = _.replace(stringArg, /(")(.*)(")/g, '$2');
    } else {
      query = ' ';
    }
  }

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `You do not have enough permissions to use the \`${botPrefix}fetch-members\` command.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If command route is invalid.
  if (!_.includes(['avatar', 'role', 'string', 'username'], commandArguments[1])) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The command route (${commandArguments[1]}) is invalid or does not exist. Try using the command by selecting a route.\n`,
            'Examples:',
            '```',
            `${botPrefix}fetch-members avatar [@user]`,
            `${botPrefix}fetch-members role [@role]`,
            `${botPrefix}fetch-members string [text]`,
            `${botPrefix}fetch-members username [@user]`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If member or role is invalid.
  if (
    (commandArguments[1] === 'avatar' && _.isUndefined(theMember))
    || (commandArguments[1] === 'role' && _.isUndefined(theRole))
    || (commandArguments[1] === 'string' && _.isUndefined(query))
    || (commandArguments[1] === 'username' && _.isUndefined(theMember))
  ) {
    const userMode = (_.includes(['avatar', 'username'], commandArguments[1])) ? [`The member (${query}) is invalid`, 'tagging a member', '@user'] : [];
    const roleMode = (_.includes(['role'], commandArguments[1])) ? [`The role (${query}) is invalid`, 'tagging a role', '@role'] : [];
    const stringMode = (_.includes(['string'], commandArguments[1])) ? ['There is nothing specified', 'specifying a string (with or without quotes)', 'text'] : [];

    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `${userMode[0] ?? roleMode[0] ?? stringMode[0]}. Try using the command by ${userMode[1] ?? roleMode[1] ?? stringMode[1]}.\n`,
            'Example:',
            '```',
            `${botPrefix}fetch-members ${commandArguments[1]} [${userMode[2] ?? roleMode[2] ?? stringMode[2]}]`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If user does not have an avatar.
  if (commandArguments[1] === 'avatar' && theMember.user.avatar === null) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `Cannot compare members. ${theMember.toString()} does not have an avatar to compare from.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  _.forEach(guildMembers, (guildMember) => {
    const memberNickname = guildMember.nickname;
    const userAvatar = guildMember.user.avatar;
    const userUsername = guildMember.user.username;
    const hasRole = guildMember.roles.cache.has(_.replace(commandArguments[2], /[<@&>]/g, ''));

    if (
      (commandArguments[1] === 'avatar' && userAvatar === theMember.user.avatar)
      || (commandArguments[1] === 'role' && hasRole === true)
      || (commandArguments[1] === 'string' && (_.includes(memberNickname, query) || _.includes(userUsername, query) || (userAvatar !== null && userAvatar === query)))
      || (commandArguments[1] === 'username' && userUsername === theMember.user.username)
    ) {
      matchedUsers.push(guildMember.toString());
    }
  });

  // No results for "string".
  if (commandArguments[1] === 'string' && _.size(matchedUsers) < 1) {
    await message.channel.send({
      embeds: [
        createNoResultsEmbed(
          `No results were found using \`${query}\`.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send no results embed',
      10,
      error,
    ));

    return;
  }

  // Send a message embed for every 80 members.
  _.forEach(_.chunk(matchedUsers, 80), (matchedUsersChunk, key) => {
    const avatarTitle = (commandArguments[1] === 'avatar') ? `Avatars Matching @${theMember.user.tag}` : undefined;
    const roleTitle = (commandArguments[1] === 'role') ? `${theRole.name} Members` : undefined;
    const stringTitle = (commandArguments[1] === 'string') ? `Members Matching \`${query}\`` : undefined;
    const usernameTitle = (commandArguments[1] === 'username') ? `Usernames Matching @${theMember.user.tag}` : undefined;

    message.channel.send({
      embeds: [
        createListMembersEmbed(
          `${avatarTitle ?? roleTitle ?? stringTitle ?? usernameTitle}${(key > 0) ? ` (Page ${key + 1})` : ''}`,
          matchedUsersChunk,
          (_.has(theMember, 'user')) ? theMember.user.displayAvatarURL({
            format: 'webp',
            dynamic: true,
            size: 4096,
          }) : null,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send list members embed',
      10,
      error,
    ));
  });
}

/**
 * Find duplicate users.
 *
 * @param {Message}  message      - Message object.
 * @param {string}   botPrefix    - Command prefix.
 * @param {object[]} allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function findDuplicateUsers(message, botPrefix, allowedRoles) {
  const guildMembers = [...message.channel.guild.members.cache.values()];

  let users = {};
  let empty = true;

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `You do not have enough permissions to use the \`${botPrefix}find-duplicate-users\` command.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

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

  /**
   * Convert object to array for loop later.
   *
   * @type {[string, string[]][]}
   */
  users = Object.entries(users);

  // Loop through all users with avatars.
  _.forEach(users, (category) => {
    const avatarHash = category[0];
    const userIds = category[1];

    if (_.size(userIds) > 1) {
      const userIdsChunks = _.chunk(userIds, 80);

      // Don't show empty results message.
      empty = false;

      // Send a message embed for every 80 members.
      _.forEach(userIdsChunks, async (userIdsChunk, key) => {
        await message.channel.send({
          embeds: [
            createListMembersEmbed(
              [
                'Duplicate Members for',
                `\`${avatarHash.substr(_.size(avatarHash) - 8)}\``,
                (key > 0) ? `(Page ${key + 1})` : '',
              ].join(' '),
              userIdsChunk,
              null,
              message.member.user.tag,
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

  if (empty === true) {
    await message.channel.send({
      embeds: [
        createNoResultsEmbed(
          `There are no duplicate users found in the **${message.channel.guild.toString()}** guild.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send no results embed',
      10,
      error,
    ));
  }
}

/**
 * Help.
 *
 * @param {Message}  message      - Message object.
 * @param {string}   botPrefix    - Command prefix.
 * @param {object[]} allowedRoles - Roles allowed to use this command.
 * @param {object}   settings     - Command settings.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function help(message, botPrefix, allowedRoles, settings) {
  const allowFetchMembersRoles = _.get(settings, 'fetchMembers');
  const allowFindDuplicateUsersRoles = _.get(settings, 'findDuplicateUsers');
  const allowRoleRoles = _.get(settings, 'role');
  const allowTogglePermsRoles = _.get(settings, 'togglePerms');
  const allowVoiceRoles = _.get(settings, 'voice');

  const commands = [];

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `You do not have enough permissions to use the \`${botPrefix}help\` command.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  if (
    _.some(allowFetchMembersRoles, (allowFetchMembersRole) => message.member.roles.cache.has(allowFetchMembersRole.id) === true)
    || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${botPrefix}fetch-members avatar [@user]`,
        `${botPrefix}fetch-members role [@role]`,
        `${botPrefix}fetch-members string [text]`,
        `${botPrefix}fetch-members username [@user]`,
      ],
      description: 'Search for members matching an avatar, role, string, or username',
    });
  }

  if (
    _.some(allowFindDuplicateUsersRoles, (allowFindDuplicateUsersRole) => message.member.roles.cache.has(allowFindDuplicateUsersRole.id) === true)
    || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${botPrefix}find-duplicate-users`,
      ],
      description: 'Find duplicate users that have the same avatar',
    });
  }

  if (
    _.some(allowRoleRoles, (allowRoleRole) => message.member.roles.cache.has(allowRoleRole.id) === true)
    || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${botPrefix}role add everyone [@role to add]`,
        `${botPrefix}role add no-role [@role to add]`,
        `${botPrefix}role add [@role] [@role to add]`,
        `${botPrefix}role remove everyone [@role to remove]`,
        `${botPrefix}role remove [@role] [@role to remove]`,
      ],
      description: 'Add or remove roles from everyone, users with no roles (add only), or users with a specific role',
    });
  }

  if (
    _.some(allowTogglePermsRoles, (allowTogglePermsRole) => message.member.roles.cache.has(allowTogglePermsRole.id) === true)
    || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${botPrefix}toggle-perms [id] on`,
        `${botPrefix}toggle-perms [id] off`,
      ],
      description: 'Toggle preset permissions',
    });
  }

  if (
    _.some(allowVoiceRoles, (allowVoiceRole) => message.member.roles.cache.has(allowVoiceRole.id) === true)
    || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    commands.push({
      queries: [
        `${botPrefix}voice disconnect [#channel]`,
        `${botPrefix}voice unmute [#channel]`,
      ],
      description: 'Disconnect or unmute everyone in a voice channel',
    });
  }

  if (_.size(commands) > 0) {
    await message.channel.send({
      embeds: [
        createHelpMenuEmbed(
          commands,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send help menu embed',
      10,
      error,
    ));
  } else {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          'You do not have available commands currently assigned for your use.',
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));
  }
}

/**
 * Role.
 *
 * @param {Message}  message      - Message object.
 * @param {string}   botPrefix    - Command prefix.
 * @param {object[]} allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function role(message, botPrefix, allowedRoles) {
  const commandArguments = message.toString().split(' ');
  const roleOne = message.channel.guild.roles.cache.get(_.replace(commandArguments[2], /[<@&>]/g, ''));
  const roleTwo = message.channel.guild.roles.cache.get(_.replace(commandArguments[3], /[<@&>]/g, ''));
  const guildMembers = [...message.channel.guild.members.cache.values()];
  const messageEveryone = (commandArguments[2] === 'everyone') ? 'members...' : undefined;
  const messageNoRole = (commandArguments[2] === 'no-role') ? 'members with no roles...' : undefined;
  const messageRole = (!_.isUndefined(roleOne)) ? `members with the ${roleOne.toString()} role...` : undefined;
  const messageAdded = (commandArguments[1] === 'add') ? 'added to' : undefined;
  const messageRemoved = (commandArguments[1] === 'remove') ? 'removed from' : undefined;

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `You do not have enough permissions to use the \`${botPrefix}role\` command.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (!_.includes(['add', 'remove'], commandArguments[1])) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The command route (${commandArguments[1]}) is invalid or does not exist. Try using the command by inputting a route.\n`,
            'Examples:',
            '```',
            `${botPrefix}role add everyone [@role to add]`,
            `${botPrefix}role add no-role [@role to add]`,
            `${botPrefix}role add [@role] [@role to add]`,
            `${botPrefix}role remove everyone [@role to remove]`,
            `${botPrefix}role remove [@role] [@role to remove]`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (
    (commandArguments[1] === 'add' && commandArguments[2] !== 'everyone' && commandArguments[2] !== 'no-role' && _.isUndefined(roleOne))
    || (commandArguments[1] === 'remove' && commandArguments[2] !== 'everyone' && _.isUndefined(roleOne))
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The command selection (${commandArguments[2]}) is invalid or does not exist. Try using the command by inputting a selection.\n`,
            'Examples:',
            '```',
            ...[
              `${botPrefix}role ${commandArguments[1]} everyone [@role to ${commandArguments[1]}]`,
              ...(commandArguments[1] === 'add') ? [`${botPrefix}role add no-role [@role to add]`] : [],
              `${botPrefix}role ${commandArguments[1]} [@role] [@role to ${commandArguments[1]}]`,
            ],
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (_.isUndefined(roleTwo)) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The role (${commandArguments[3]}) is invalid or does not exist. Try using the command by tagging a role to add.\n`,
            'Examples:',
            '```',
            `${botPrefix}role ${commandArguments[1]} ${commandArguments[2]} [@role to ${commandArguments[1]}]`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  // Begin to perform add role actions.
  await message.channel.send({
    embeds: [
      createRoleEmbed(
        commandArguments[1],
        [
          'Please wait while',
          message.guild.me.toString(),
          `${commandArguments[1]}s the`,
          roleTwo.toString(),
          'role',
          ...(commandArguments[1] === 'add') ? ['to'] : [],
          ...(commandArguments[1] === 'remove') ? ['from'] : [],
          'all',
          messageEveryone ?? messageNoRole ?? messageRole,
        ].join(' '),
        'in-progress',
        message.member.user.tag,
      ),
    ],
  }).then(async (theMessage) => {
    const results = _.map(guildMembers, async (guildMember) => {
      /**
       * Role assignment result logger.
       *
       * @param {string}          word  - Beginning phrase.
       * @param {undefined|Error} error - Error object.
       *
       * @returns {boolean}
       *
       * @since 1.0.0
       */
      const logger = (word, error = undefined) => {
        generateLogMessage(
          [
            word,
            (!_.isError(error)) ? chalk.green(roleTwo.toString()) : chalk.red(roleTwo.toString()),
            'role',
            ...(commandArguments[1] === 'add') ? ['to'] : [],
            ...(commandArguments[1] === 'remove') ? ['from'] : [],
            (!_.isError(error)) ? chalk.green(guildMember.toString()) : chalk.red(guildMember.toString()),
          ].join(' '),
          (!_.isError(error)) ? 30 : 10,
          (_.isError(error)) ? error : undefined,
        );

        return (!_.isError(error));
      };

      let success = true;

      if (
        commandArguments[1] === 'add'
        && guildMember.roles.cache.has(roleTwo.id) === false // Make sure member doesn't have role first.
      ) {
        if (commandArguments[2] === 'everyone') {
          await guildMember.roles.add(roleTwo).then(() => logger(
            'Successfully added',
          )).catch((error) => {
            success = logger(
              'Failed to add',
              error,
            );
          });
        } else if (commandArguments[2] === 'no-role') {
          const roles = [...guildMember.roles.cache.values()];

          // Users with no roles always have the @everyone role.
          if (_.size(roles) === 1) {
            await guildMember.roles.add(roleTwo).then(() => logger(
              'Successfully added',
            )).catch((error) => {
              success = logger(
                'Failed to add',
                error,
              );
            });
          }
        } else if (!_.isUndefined(roleOne)) {
          const hasRoleOne = guildMember.roles.cache.has(roleOne.id);

          // If user has role #1, add role #2.
          if (hasRoleOne === true) {
            await guildMember.roles.add(roleTwo).then(() => logger(
              'Successfully added',
            )).catch((error) => {
              success = logger(
                'Failed to add',
                error,
              );
            });
          }
        }
      } else if (
        commandArguments[1] === 'remove'
        && guildMember.roles.cache.has(roleTwo.id) === true // Make sure member has role first.
      ) {
        if (commandArguments[2] === 'everyone') {
          await guildMember.roles.remove(roleTwo).then(() => logger(
            'Successfully removed',
          )).catch((error) => {
            success = logger(
              'Failed to remove',
              error,
            );
          });
        } else if (!_.isUndefined(roleOne)) {
          const hasRoleOne = guildMember.roles.cache.has(roleOne.id);

          // If user has role #1, remove role #2.
          if (hasRoleOne === true) {
            await guildMember.roles.remove(roleTwo).then(() => logger(
              'Successfully removed',
            )).catch((error) => {
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

    Promise.all(results).then(async (responses) => {
      const success = _.every(responses, (response) => response === true);

      await theMessage.edit({
        embeds: [
          createRoleEmbed(
            commandArguments[1],
            [
              roleTwo.toString(),
              (success === true) ? `was successfully ${messageAdded ?? messageRemoved} all` : `could not be ${messageAdded ?? messageRemoved} all`,
              messageEveryone ?? messageNoRole ?? messageRole,
            ].join(' '),
            (success === true) ? 'complete' : 'fail',
            message.member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to edit role embed',
        10,
        error,
      ));
    });
  }).catch((error) => generateLogMessage(
    'Failed to send role embed',
    10,
    error,
  ));
}

/**
 * Toggle permissions.
 *
 * @param {Message}  message      - Message object.
 * @param {string}   botPrefix    - Command prefix.
 * @param {object[]} allowedRoles - Roles allowed to use this command.
 * @param {object[]} settings     - Command settings.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function togglePerms(message, botPrefix, allowedRoles, settings) {
  const commandArguments = message.toString().split(' ');
  const selectedToggleGroup = _.find(settings, { id: commandArguments[1] });
  const selectedToggleDirection = _.get(selectedToggleGroup, commandArguments[2]);
  const selectedToggleName = _.get(selectedToggleGroup, 'name', 'Unknown');

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `You do not have enough permissions to use the \`${botPrefix}toggle-perms\` command.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If toggle group is invalid.
  if (_.isUndefined(selectedToggleGroup)) {
    const permsIds = _.map(settings, 'id');

    let commands = '';

    // Shows the first 10 toggle groups.
    _.forEach(permsIds, (permsId, key) => {
      if (key < 10) {
        commands += [
          `${botPrefix}toggle-perms ${permsId} on`,
          `${botPrefix}toggle-perms ${permsId} off\n\n`,
        ].join('\n');
      }
    });

    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The toggle group (${commandArguments[1]}) is invalid. Please type your command with the correct group and try again.\n`,
            'Example(s):',
            '```',
            commands,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
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
    || (commandArguments[2] !== 'on' && commandArguments[2] !== 'off')
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The toggle direction (${commandArguments[2]}) is invalid or not configured. Please type your command with the correct direction and try again.\n`,
            'Example:',
            '```',
            `${botPrefix}toggle-perms ${commandArguments[1]} on`,
            `${botPrefix}toggle-perms ${commandArguments[1]} off`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  /**
   * Toggle permissions per channel.
   *
   * @type {[boolean, boolean[]]}
   */
  const channelToggles = _.map(selectedToggleDirection, async (channelToggle) => {
    const channelToggleId = _.get(channelToggle, 'channel-id');
    const channelTogglePerms = _.get(channelToggle, 'channel-perms');
    const channelToggleChannel = message.guild.channels.cache.get(channelToggleId);

    if (_.isUndefined(channelToggleChannel)) {
      generateLogMessage(
        [
          'Failed to toggle preset permissions for',
          chalk.red(selectedToggleName),
          'to',
          commandArguments[2],
          `because channel (${channelToggleId}) is invalid`,
        ].join(' '),
        10,
      );

      return false;
    }

    /**
     * Toggle channel permissions per user or role.
     *
     * @type {boolean[]}
     */
    const userToggles = _.map(channelTogglePerms, async (userToggle) => {
      const theId = userToggle['user-or-role-id'];
      const thePerms = userToggle['user-or-role-perms'];

      let isSuccess = true;

      await channelToggleChannel.permissionOverwrites.edit(
        theId,
        thePerms,
        {
          reason: [
            `@${message.member.user.tag}`,
            'toggled preset permissions for',
            selectedToggleName,
            'to',
            commandArguments[2],
          ].join(' '),
        },
      ).catch((error) => {
        isSuccess = false;

        generateLogMessage(
          [
            'Failed to toggle preset permissions for',
            chalk.red(selectedToggleName),
            'to',
            commandArguments[2],
            'for',
            chalk.red(channelToggleChannel.toString()),
          ].join(' '),
          10,
          error,
        );
      });

      return isSuccess;
    });

    return Promise.all(userToggles);
  });

  // Display success or failed message embed.
  Promise.all(channelToggles).then(async (responses) => {
    const answers = _.flattenDeep(responses);
    const success = _.every(answers, (answer) => answer === true);

    if (success === true) {
      generateLogMessage(
        [
          'Successfully toggled preset permissions for',
          chalk.green(selectedToggleName),
          'to',
          commandArguments[2],
        ].join(' '),
        30,
      );

      await message.channel.send({
        embeds: [
          createTogglePermsEmbed(
            `Successfully toggled preset permissions for **${selectedToggleName}** to ${commandArguments[2]}.`,
            true,
            message.member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to send toggle perms embed',
        10,
        error,
      ));
    } else {
      await message.channel.send({
        embeds: [
          createTogglePermsEmbed(
            [
              `Failed to toggle one or more preset permissions for **${selectedToggleName}** to ${commandArguments[2]}.`,
              'Please check the logs and configuration then try again.',
            ].join(' '),
            false,
            message.member.user.tag,
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
 * Voice.
 *
 * @param {Message}  message      - Message object.
 * @param {string}   botPrefix    - Command prefix.
 * @param {object[]} allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function voice(message, botPrefix, allowedRoles) {
  const commandArguments = message.toString().split(' ');
  const channel = message.channel.guild.channels.cache.get(_.replace(commandArguments[2], /[<#>]/g, ''));
  const channelType = _.get(channel, 'type');
  const isVoiceOrStageChannel = _.includes(['GUILD_VOICE', 'GUILD_STAGE_VOICE'], channelType);

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          `You do not have enough permissions to use the \`${botPrefix}voice\` command.`,
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If command route is invalid.
  if (!_.includes(['disconnect', 'unmute'], commandArguments[1])) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The command route (${commandArguments[1]}) is invalid or does not exist. Try using the command by selecting a route.\n`,
            'Examples:',
            '```',
            `${botPrefix}voice disconnect [#channel]`,
            `${botPrefix}voice unmute [#channel]`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If voice or stage channel is invalid or does not exist.
  if (_.isUndefined(channel) || isVoiceOrStageChannel !== true) {
    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            `The voice or stage channel (${commandArguments[2]}) is invalid or does not exist. Try using the command by pasting a channel ID.\n`,
            'Example:',
            '```',
            `${botPrefix}voice ${commandArguments[1]} [#channel]`,
            '```',
          ].join('\n'),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If bot does not have enough permissions.
  if (
    (commandArguments[1] === 'disconnect' && !message.guild.me.permissions.has(Permissions.FLAGS.MOVE_MEMBERS))
    || (commandArguments[1] === 'unmute' && !message.guild.me.permissions.has(Permissions.FLAGS.MUTE_MEMBERS))
  ) {
    const disconnect = (commandArguments[1] === 'disconnect') ? 'Move Members' : undefined;
    const unmute = (commandArguments[1] === 'unmute') ? 'Mute Members' : undefined;

    await message.channel.send({
      embeds: [
        createCommandErrorEmbed(
          [
            message.guild.me.toString(),
            'requires the',
            `**${disconnect ?? unmute}**`,
            'permission to',
            commandArguments[1],
            'members from the',
            channel.toString(),
            channelType,
            'channel.',
          ].join(' '),
          message.member.user.tag,
        ),
      ],
    }).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Delete message with command.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  // Begin to perform voice or stage channel actions.
  await message.channel.send({
    embeds: [
      createVoiceEmbed(
        commandArguments[1],
        `Please wait while ${message.guild.me.toString()} ${commandArguments[1]}s all members connected to the ${channel.toString()} channel...`,
        'in-progress',
        message.member.user.tag,
      ),
    ],
  }).then(async (theMessage) => {
    const voiceStates = [...channel.guild.voiceStates.cache.values()];
    const usersResults = _.map(voiceStates, async (voiceState) => {
      let success = true;

      if (voiceState.channelId === channel.id) {
        const memberMention = voiceState.member.toString();
        const channelMention = voiceState.channel.toString();

        /**
         * Voice state result logger.
         *
         * @param {string}          word  - Beginning phrase.
         * @param {undefined|Error} error - Error object.
         *
         * @returns {boolean}
         *
         * @since 1.0.0
         */
        const logger = (word, error = undefined) => {
          generateLogMessage(
            [
              word,
              (!_.isError(error)) ? chalk.green(memberMention) : chalk.red(memberMention),
              'from',
              (!_.isError(error)) ? chalk.green(channelMention) : chalk.red(channelMention),
              channelType,
              'channel',
            ].join(' '),
            (!_.isError(error)) ? 30 : 10,
            (_.isError(error)) ? error : undefined,
          );

          return (!_.isError(error));
        };

        if (commandArguments[1] === 'disconnect') {
          await voiceState.disconnect().then(() => logger(
            'Disconnected',
          )).catch((error) => {
            success = logger('Failed to disconnect', error);
          });
        } else if (commandArguments[1] === 'unmute') {
          await voiceState.setMute(false).then(() => logger(
            'Unmuted',
          )).catch((error) => {
            success = logger('Failed to unmute', error);
          });
        }
      }

      return success;
    });

    Promise.all(usersResults).then(async (responses) => {
      const success = _.every(responses, (response) => response === true);
      const disconnect = (commandArguments[1] === 'disconnect') ? 'disconnected from' : undefined;
      const unmuteVoice = (commandArguments[1] === 'unmute' && channelType === 'GUILD_VOICE') ? 'unmuted from' : undefined;
      const unmuteStage = (commandArguments[1] === 'unmute' && channelType === 'GUILD_STAGE_VOICE') ? 'invited to speak in' : undefined;

      console.log('done');

      await theMessage.edit({
        embeds: [
          createVoiceEmbed(
            commandArguments[1],
            [
              (success === true) ? 'All members have been' : 'One or more members could not be',
              disconnect ?? unmuteVoice ?? unmuteStage,
              'the',
              channel.toString(),
              'channel.',
            ].join(' '),
            (success === true) ? 'complete' : 'fail',
            message.member.user.tag,
          ),
        ],
      }).catch((error) => generateLogMessage(
        'Failed to edit voice embed',
        10,
        error,
      ));
    });
  }).catch((error) => generateLogMessage(
    'Failed to send voice embed',
    10,
    error,
  ));
}

module.exports = {
  fetchMembers,
  findDuplicateUsers,
  help,
  role,
  togglePerms,
  voice,
};
