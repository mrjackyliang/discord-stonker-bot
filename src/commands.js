const chalk = require('chalk');
const _ = require('lodash');

const {
  createAddRoleEmbed,
  createCommandErrorEmbed,
  createHelpMenuEmbed,
  createListMembersEmbed,
  createNoResultsEmbed,
  createTogglePermsEmbed,
  createVoiceEmbed,
  createWhitelistEmbed,
} = require('./embed');
const { generateLogMessage } = require('./utilities');

/**
 * Add role.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function addRole(message, botPrefix, allowedRoles) {
  const commandArguments = message.toString().split(' ');
  const roleOne = message.channel.guild.roles.cache.get(_.replace(commandArguments[1], /[<@&>]/g, ''));
  const roleTwo = message.channel.guild.roles.cache.get(_.replace(commandArguments[2], /[<@&>]/g, ''));
  const guildMembers = message.channel.guild.members.cache.array();
  const messageEveryone = (commandArguments[1] === 'everyone') ? 'members...' : '';
  const messageNoRole = (commandArguments[1] === 'no-role') ? 'members with no roles...' : '';
  const messageRole = (!_.isUndefined(roleOne)) ? `members with the ${roleOne.toString()} role...` : '';

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}add-role\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (
    commandArguments[1] !== 'everyone'
    && commandArguments[1] !== 'no-role'
    && _.isUndefined(roleOne)
  ) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The command selection (${commandArguments[1]}) is invalid or does not exist. Try using the command by inputting a selection.\r\n`,
        'Examples:',
        '```',
        `${botPrefix}add-role everyone [@role to add]`,
        `${botPrefix}add-role no-role [@role to add]`,
        `${botPrefix}add-role [@role] [@role to add]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (_.isUndefined(roleTwo)) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The role (${commandArguments[2]}) is invalid or does not exist. Try using the command by tagging a role to add.\r\n`,
        'Examples:',
        '```',
        `${botPrefix}add-role ${commandArguments[1]} [@role to add]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Begin to perform add role actions.
  await message.channel.send(createAddRoleEmbed(
    [
      'Please wait while',
      message.guild.me.toString(),
      'adds the',
      roleTwo.toString(),
      'role to all',
      messageEveryone || messageNoRole || messageRole,
    ].join(' '),
    'in-progress',
    message.member.user.tag,
  )).then(async (theMessage) => {
    const results = await _.map(guildMembers, async (guildMember) => {
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
            (!_.isError(error)) ? chalk.green(roleTwo.toString()) : chalk.red(roleTwo.toString()),
            'role to',
            (!_.isError(error)) ? chalk.green(guildMember.toString()) : chalk.red(guildMember.toString()),
          ].join(' '),
          (!_.isError(error)) ? 40 : 10,
          (_.isError(error)) ? error : undefined,
        );

        return (!_.isError(error));
      };

      let success = true;

      // Make sure member doesn't have role first.
      if (guildMember.roles.cache.has(roleTwo.id) === false) {
        if (commandArguments[1] === 'everyone') {
          await guildMember.roles.add(roleTwo).then(() => logger(
            'Successfully added',
          )).catch((error) => {
            success = logger(
              'Failed to add',
              error,
            );
          });
        } else if (commandArguments[1] === 'no-role') {
          const roles = guildMember.roles.cache.array();

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
      }

      return success;
    });

    Promise.all(results).then(async (responses) => {
      const success = _.every(responses, (response) => response === true);

      await theMessage.edit(createAddRoleEmbed(
        [
          roleTwo.toString(),
          (success === true) ? 'was successfully added to all' : 'could not be added to all',
          messageEveryone || messageNoRole || messageRole,
        ].join(' '),
        (success === true) ? 'complete' : 'fail',
        message.member.user.tag,
      )).catch((error) => generateLogMessage(
        'Failed to edit add role embed',
        10,
        error,
      ));
    });
  }).catch((error) => generateLogMessage(
    'Failed to send add role embed',
    10,
    error,
  ));
}

/**
 * Fetch members.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function fetchMembers(message, botPrefix, allowedRoles) {
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const member = message.channel.guild.members.cache.get(_.replace(commandArguments[2], /[<@!>]/g, ''));
  const role = message.channel.guild.roles.cache.get(_.replace(commandArguments[2], /[<@&>]/g, ''));
  const guildMembers = message.channel.guild.members.cache.array();
  const matchedUsers = [];

  let query = commandArguments[2];

  // Transform "string" command route input with quotes into query.
  if (commandArguments[1] === 'string' && new RegExp(/"(.+)"/g).test(messageText) === true) {
    const stringArg = messageText.substring(messageText.lastIndexOf(' "') + 1);

    if (stringArg !== '"') {
      query = _.replace(stringArg, /"$/g, '');
    } else {
      query = ' ';
    }
  }

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}fetch-members\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If command route is invalid.
  if (!_.includes(['avatar', 'role', 'string', 'username'], commandArguments[1])) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The command route (${commandArguments[1]}) is invalid or does not exist. Try using the command by selecting a route.\r\n`,
        'Examples:',
        '```',
        `${botPrefix}fetch-members avatar [@user]`,
        `${botPrefix}fetch-members role [@role]`,
        `${botPrefix}fetch-members string [text]`,
        `${botPrefix}fetch-members username [@user]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If member or role is invalid.
  if (
    (commandArguments[1] === 'avatar' && _.isUndefined(member))
    || (commandArguments[1] === 'role' && _.isUndefined(role))
    || (commandArguments[1] === 'string' && _.isUndefined(query))
    || (commandArguments[1] === 'username' && _.isUndefined(member))
  ) {
    const userMode = (_.includes(['avatar', 'username'], commandArguments[1])) ? [`The member (${query}) is invalid`, 'tagging a member', '@user'] : [];
    const roleMode = (_.includes(['role'], commandArguments[1])) ? [`The role (${query}) is invalid`, 'tagging a role', '@role'] : [];
    const stringMode = (_.includes(['string'], commandArguments[1])) ? ['There is nothing specified', 'specifying a string (with or without quotes)', 'text'] : [];

    await message.channel.send(createCommandErrorEmbed(
      [
        `${userMode[0] || roleMode[0] || stringMode[0]}. Try using the command by ${userMode[1] || roleMode[1] || stringMode[1]}.\r\n`,
        'Example:',
        '```',
        `${botPrefix}fetch-members ${commandArguments[1]} [${userMode[2] || roleMode[2] || stringMode[2]}]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If user does not have an avatar.
  if (commandArguments[1] === 'avatar' && member.user.avatar === null) {
    await message.channel.send(createCommandErrorEmbed(
      `Cannot compare members. ${member.toString()} does not have an avatar to compare from.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  _.forEach(guildMembers, (guildMember) => {
    const memberNickname = guildMember.nickname;
    const userAvatar = guildMember.user.avatar;
    const userUsername = guildMember.user.username;
    const hasRole = guildMember.roles.cache.has(_.replace(commandArguments[2], /[<@&>]/g, ''));

    if (
      (commandArguments[1] === 'avatar' && userAvatar === member.user.avatar)
      || (commandArguments[1] === 'role' && hasRole === true)
      || (commandArguments[1] === 'string' && (_.includes(memberNickname, query) || _.includes(userUsername, query) || (userAvatar !== null && userAvatar === query)))
      || (commandArguments[1] === 'username' && userUsername === member.user.username)
    ) {
      matchedUsers.push(guildMember.toString());
    }
  });

  // No results for "string".
  if (commandArguments[1] === 'string' && _.size(matchedUsers) < 1) {
    await message.channel.send(createNoResultsEmbed(
      `No results were found using \`${query}\`.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send no results embed',
      10,
      error,
    ));

    return;
  }

  // Send a message embed for every 80 members.
  _.forEach(_.chunk(matchedUsers, 80), (matchedUsersChunk, key) => {
    const avatarTitle = (commandArguments[1] === 'avatar') ? `Avatars Matching @${member.user.tag}` : undefined;
    const roleTitle = (commandArguments[1] === 'role') ? `${role.name} Members` : undefined;
    const stringTitle = (commandArguments[1] === 'string') ? `Members Matching \`${query}\`` : undefined;
    const usernameTitle = (commandArguments[1] === 'username') ? `Usernames Matching @${member.user.tag}` : undefined;

    message.channel.send(createListMembersEmbed(
      `${avatarTitle || roleTitle || stringTitle || usernameTitle}${(key > 0) ? ` (Page ${key + 1})` : ''}`,
      matchedUsersChunk,
      (_.has(member, 'user')) ? member.user.displayAvatarURL({ size: 256 }) : null,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send list members embed',
      10,
      error,
    ));
  });
}

/**
 * Find duplicate users.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function findDuplicateUsers(message, botPrefix, allowedRoles) {
  const guildMembers = message.channel.guild.members.cache.array();

  let users = {};
  let empty = true;

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}find-duplicate-users\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

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
        await message.channel.send(createListMembersEmbed(
          [
            'Duplicate Members for',
            `\`${avatarHash.substr(_.size(avatarHash) - 8)}\``,
            (key > 0) ? `(Page ${key + 1})` : '',
          ].join(' '),
          userIdsChunk,
          null,
          message.member.user.tag,
        )).catch((error) => generateLogMessage(
          'Failed to send list members embed',
          10,
          error,
        ));
      });
    }
  });

  if (empty === true) {
    await message.channel.send(createNoResultsEmbed(
      `There are no duplicate users found in the **${message.channel.guild.toString()}** guild.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send no results embed',
      10,
      error,
    ));
  }
}

/**
 * Help.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 * @param {object}                      settings     - Command settings.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function help(message, botPrefix, allowedRoles, settings) {
  const allowAddRoleRoles = _.get(settings, 'configCommandsAddRole');
  const allowFetchMembersRoles = _.get(settings, 'configCommandsFetchMembers');
  const allowFindDuplicateUsersRoles = _.get(settings, 'configCommandsFindDuplicateUsers');
  const allowTogglePermsRoles = _.get(settings, 'configCommandsTogglePerms');
  const allowVoiceRoles = _.get(settings, 'configCommandsVoice');
  const allowWhitelistRoles = _.get(settings, 'configCommandsWhitelist');

  const commands = [];

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}help\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  if (
    _.some(allowAddRoleRoles, (allowAddRoleRole) => message.member.roles.cache.has(allowAddRoleRole.id) === true)
    || message.member.hasPermission('ADMINISTRATOR')
  ) {
    commands.push({
      queries: [
        `${botPrefix}add-role everyone [@role to add]`,
        `${botPrefix}add-role no-role [@role to add]`,
        `${botPrefix}add-role [@role] [@role to add]`,
      ],
      description: 'Add role to everyone, users with no roles, or users with a specific role',
    });
  }

  if (
    _.some(allowFetchMembersRoles, (allowFetchMembersRole) => message.member.roles.cache.has(allowFetchMembersRole.id) === true)
    || message.member.hasPermission('ADMINISTRATOR')
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
    || message.member.hasPermission('ADMINISTRATOR')
  ) {
    commands.push({
      queries: [
        `${botPrefix}find-duplicate-users`,
      ],
      description: 'Find duplicate users that have the same avatar',
    });
  }

  if (
    _.some(allowTogglePermsRoles, (allowTogglePermsRole) => message.member.roles.cache.has(allowTogglePermsRole.id) === true)
    || message.member.hasPermission('ADMINISTRATOR')
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
    || message.member.hasPermission('ADMINISTRATOR')
  ) {
    commands.push({
      queries: [
        `${botPrefix}voice disconnect [#channel]`,
        `${botPrefix}voice unmute [#channel]`,
      ],
      description: 'Disconnect or unmute everyone in a voice channel',
    });
  }

  if (
    _.some(allowWhitelistRoles, (allowWhitelistRole) => message.member.roles.cache.has(allowWhitelistRole.id) === true)
    || message.member.hasPermission('ADMINISTRATOR')
  ) {
    commands.push({
      queries: [
        `${botPrefix}whitelist [@user]`,
      ],
      description: 'Temporarily whitelist a user kicked by anti-raid measures',
    });
  }

  if (_.size(commands) > 0) {
    await message.channel.send(createHelpMenuEmbed(
      commands,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send help menu embed',
      10,
      error,
    ));
  } else {
    await message.channel.send(createCommandErrorEmbed(
      'You do not have available commands currently assigned for your use.',
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));
  }
}

/**
 * Toggle permissions.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 * @param {object[]}                    settings     - Command settings.
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
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}toggle-perms\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
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
          `${botPrefix}toggle-perms ${permsId} off\r\n`,
        ].join('\r\n\r\n');
      }
    });

    await message.channel.send(createCommandErrorEmbed(
      [
        `The toggle group (${commandArguments[1]}) is invalid. Please type your command with the correct group and try again.\r\n`,
        'Example(s):',
        '```',
        commands,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
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
    await message.channel.send(createCommandErrorEmbed(
      [
        `The toggle direction (${commandArguments[2]}) is invalid or not configured. Please type your command with the correct direction and try again.\r\n`,
        'Example:',
        '```',
        `${botPrefix}toggle-perms ${commandArguments[1]} on`,
        `${botPrefix}toggle-perms ${commandArguments[1]} off`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  /**
   * Toggle permissions per channel.
   *
   * @type {[boolean, boolean[]]}
   */
  const channelToggles = await _.map(selectedToggleDirection, async (channelToggle) => {
    const channelToggleId = _.get(channelToggle, 'channel-id');
    const channelTogglePerms = _.get(channelToggle, 'channel-perms');
    const channelToggleChannel = message.channel.guild.channels.cache.get(channelToggleId);

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
    const userToggles = await _.map(channelTogglePerms, async (userToggle) => {
      const theId = userToggle['user-or-role-id'];
      const thePerms = userToggle['user-or-role-perms'];

      let isSuccess = true;

      await channelToggleChannel.updateOverwrite(
        theId,
        thePerms,
        [
          `@${message.member.user.tag}`,
          'toggled preset permissions for',
          selectedToggleName,
          'to',
          commandArguments[2],
        ].join(' '),
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

      await message.channel.send(createTogglePermsEmbed(
        `Successfully toggled preset permissions for **${selectedToggleName}** to ${commandArguments[2]}.`,
        true,
        message.member.user.tag,
      )).catch((error) => generateLogMessage(
        'Failed to send toggle perms embed',
        10,
        error,
      ));
    } else {
      await message.channel.send(createTogglePermsEmbed(
        [
          `Failed to toggle one or more preset permissions for **${selectedToggleName}** to ${commandArguments[2]}.`,
          'Please check the logs and configuration then try again.',
        ].join(' '),
        false,
        message.member.user.tag,
      )).catch((error) => generateLogMessage(
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
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function voice(message, botPrefix, allowedRoles) {
  const commandArguments = message.toString().split(' ');
  const channel = message.channel.guild.channels.cache.get(_.replace(commandArguments[2], /[<#>]/g, ''));
  const isVoiceChannel = (channel && channel.type === 'voice');

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}voice\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If command route is invalid.
  if (!_.includes(['disconnect', 'unmute'], commandArguments[1])) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The command route (${commandArguments[1]}) is invalid or does not exist. Try using the command by selecting a route.\r\n`,
        'Examples:',
        '```',
        `${botPrefix}voice disconnect [#channel]`,
        `${botPrefix}voice unmute [#channel]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If voice channel is invalid or does not exist.
  if (_.isUndefined(channel) || _.isUndefined(isVoiceChannel)) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The voice channel (${commandArguments[2]}) is invalid or does not exist. Try using the command by pasting a channel ID.\r\n`,
        'Example:',
        '```',
        `${botPrefix}voice ${commandArguments[1]} [#channel]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If bot does not have enough permissions.
  if (
    (commandArguments[1] === 'disconnect' && !message.guild.me.hasPermission('MOVE_MEMBERS'))
    || (commandArguments[1] === 'unmute' && !message.guild.me.hasPermission('MUTE_MEMBERS'))
  ) {
    const disconnect = (commandArguments[1] === 'disconnect') ? 'Move Members' : undefined;
    const unmute = (commandArguments[1] === 'unmute') ? 'Mute Members' : undefined;

    await message.channel.send(createCommandErrorEmbed(
      [
        message.guild.me.toString(),
        'requires the',
        `**${disconnect || unmute}**`,
        'permission to',
        commandArguments[1],
        'members from the',
        channel.toString(),
        'voice channel.',
      ].join(' '),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Begin to perform voice channel actions.
  await message.channel.send(createVoiceEmbed(
    commandArguments[1],
    `Please wait while ${message.guild.me.toString()} ${commandArguments[1]}s all members connected to the ${channel.toString()} voice channel...`,
    'in-progress',
    message.member.user.tag,
  )).then(async (theMessage) => {
    const voiceStates = channel.guild.voiceStates.cache.array();
    const usersResults = await _.map(voiceStates, async (voiceState) => {
      let success = true;

      if (voiceState.channelID === channel.id) {
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
              'voice channel',
            ].join(' '),
            (!_.isError(error)) ? 40 : 10,
            (_.isError(error)) ? error : undefined,
          );

          return (!_.isError(error));
        };

        if (commandArguments[1] === 'disconnect') {
          await voiceState.kick().then(() => logger(
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
      const disconnect = (commandArguments[1] === 'disconnect') ? 'disconnected' : undefined;
      const unmute = (commandArguments[1] === 'unmute') ? 'unmuted' : undefined;

      await theMessage.edit(createVoiceEmbed(
        commandArguments[1],
        [
          (success === true) ? 'All members have been' : 'One or more members could not be',
          disconnect || unmute,
          'from the',
          channel.toString(),
          'voice channel.',
        ].join(' '),
        (success === true) ? 'complete' : 'fail',
        message.member.user.tag,
      )).catch((error) => generateLogMessage(
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

/**
 * Whitelist.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object[]}                    allowedRoles - Roles allowed to use this command.
 * @param {object}                      storage      - Anti-raid session storage.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function whitelist(message, botPrefix, allowedRoles, storage) {
  const commandArguments = message.toString().split(' ');
  const potentialUserId = _.replace(commandArguments[1], /[<@!>]/g, '');

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id) === true)
    && !message.member.hasPermission('ADMINISTRATOR')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      `You do not have enough permissions to use the \`${botPrefix}whitelist\` command.`,
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // If member is invalid.
  if (potentialUserId === '' || new RegExp(/^\d+$/, 'g').test(potentialUserId) === false) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The member (${commandArguments[1]}) is invalid. Try using the command by tagging a member or pasting in the user ID.\r\n`,
        'Examples:',
        '```',
        `${botPrefix}whitelist [@user]`,
        '```',
      ].join('\r\n'),
      message.member.user.tag,
    )).catch((error) => generateLogMessage(
      'Failed to send command error embed',
      10,
      error,
    ));

    return;
  }

  // Set user ID into whitelist.
  storage.whitelist.push(potentialUserId);

  // Send success message.
  await message.channel.send(createWhitelistEmbed(
    potentialUserId,
    message.member.user.tag,
  )).catch((error) => generateLogMessage(
    'Failed to send whitelist embed',
    10,
    error,
  ));
}

module.exports = {
  addRole,
  fetchMembers,
  findDuplicateUsers,
  help,
  togglePerms,
  voice,
  whitelist,
};
