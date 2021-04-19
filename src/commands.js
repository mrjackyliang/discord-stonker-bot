const chalk = require('chalk');
const _ = require('lodash');

const {
  createCommandErrorEmbed,
  createHelpMenuEmbed,
  createListMembersEmbed,
  createNoResultsEmbed,
  createTogglePermsEmbed,
  createVoiceEmbed,
} = require('./embed');
const { generateLogMessage } = require('./utilities');

/**
 * Fetch members.
 *
 * @param {module:"discord.js".Message} message   - Message object.
 * @param {string}                      botPrefix - Command prefix.
 * @param {object}                      settings  - Command settings defined in configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function fetchMembers(message, botPrefix, settings) {
  const allowedRoles = _.get(settings, 'allowed-roles', []);
  const messageText = message.toString();
  const commandArguments = messageText.split(' ');
  const commandRoute = commandArguments[1];
  const commandTagOrText = commandArguments[2];
  const id = (_.isString(commandTagOrText)) ? commandTagOrText.replace(/[<@&!>]/g, '') : undefined;
  const member = message.channel.guild.members.cache.get(id);
  const role = message.channel.guild.roles.cache.get(id);
  const guildMembers = message.channel.guild.members.cache.array();
  const matchedUsers = [];

  let query;

  // Transform "string" command route input with quotes into query.
  if (commandRoute === 'string' && new RegExp(/"(.+)"/g).test(messageText)) {
    const stringArg = messageText.substring(messageText.lastIndexOf(' "') + 1);

    if (stringArg !== '"') {
      query = stringArg.replace(/"/g, '');
    } else {
      query = ' ';
    }
  } else {
    query = commandTagOrText;
  }

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id))
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
  if (!['avatar', 'role', 'string', 'username'].includes(commandRoute)) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The command route (${commandRoute}) is invalid or does not exist. Try using the command by selecting a route.\r\n`,
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
    (commandRoute === 'avatar' && !member)
    || (commandRoute === 'role' && !role)
    || (commandRoute === 'string' && _.isUndefined(query))
    || (commandRoute === 'username' && !member)
  ) {
    const userMode = (['avatar', 'username'].includes(commandRoute)) ? [`The member (${query}) is invalid`, 'tagging a member', '@user'] : [];
    const roleMode = (['role'].includes(commandRoute)) ? [`The role (${query}) is invalid`, 'tagging a role', '@role'] : [];
    const stringMode = (['string'].includes(commandRoute)) ? ['There is nothing specified', 'specifying a string (with or without quotes)', 'text'] : [];

    await message.channel.send(createCommandErrorEmbed(
      [
        `${userMode[0] || roleMode[0] || stringMode[0]}. Try using the command by ${userMode[1] || roleMode[1] || stringMode[1]}.\r\n`,
        'Example:',
        '```',
        `${botPrefix}fetch-members ${commandRoute} [${userMode[2] || roleMode[2] || stringMode[2]}]`,
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
  if (commandRoute === 'avatar' && !_.get(member, 'user.avatar')) {
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

  guildMembers.forEach((guildMember) => {
    const {
      nickname,
      user,
    } = guildMember;
    const {
      avatar,
      username,
    } = user;
    const hasRole = guildMember.roles.cache.has(id);

    if (
      (commandRoute === 'avatar' && avatar === member.user.avatar)
      || (commandRoute === 'role' && hasRole)
      || (commandRoute === 'string' && (_.includes(nickname, query) || _.includes(username, query)))
      || (commandRoute === 'username' && username === member.user.username)
    ) {
      matchedUsers.push(guildMember.toString());
    }
  });

  // No results for "string".
  if (commandRoute === 'string' && !matchedUsers.length) {
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
  _.chunk(matchedUsers, 80).forEach((matchedUsersChunk, key) => {
    const avatarTitle = (commandRoute === 'avatar') ? `Avatars Matching @${member.user.tag}` : undefined;
    const roleTitle = (commandRoute === 'role') ? `${role.name} Members` : undefined;
    const stringTitle = (commandRoute === 'string') ? `Members Matching \`${query}\`` : undefined;
    const usernameTitle = (commandRoute === 'username') ? `Usernames Matching @${member.user.tag}` : undefined;

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
 * @param {module:"discord.js".Message} message   - Message object.
 * @param {string}                      botPrefix - Command prefix.
 * @param {object}                      settings  - Command settings defined in configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function findDuplicateUsers(message, botPrefix, settings) {
  const allowedRoles = _.get(settings, 'allowed-roles', []);
  const guildMembers = message.channel.guild.members.cache.array();

  let userByAvatar = {};
  let empty = true;

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id))
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

  // Remap users based on their username or avatar.
  guildMembers.forEach((guildMember) => {
    const guildMemberAvatar = guildMember.user.avatar;

    if (guildMemberAvatar !== null) {
      // Create entry for avatar hash if it does not exist.
      if (userByAvatar[guildMemberAvatar] === undefined) {
        userByAvatar[guildMemberAvatar] = [];
      }

      userByAvatar[guildMemberAvatar].push(guildMember.toString());
    }
  });

  /**
   * Convert object to array for easier loop compatibility.
   *
   * @type {[string, string[]][]}
   */
  userByAvatar = Object.entries(userByAvatar);

  // Loop through all users with avatars.
  userByAvatar.forEach((category) => {
    const avatarHash = category[0];
    const userIds = category[1];

    if (userIds.length > 1) {
      const userIdsChunks = _.chunk(userIds, 80);

      // Empty result message switch.
      empty = false;

      // Send a message embed for every 80 members.
      userIdsChunks.forEach(async (userIdsChunk, key) => {
        await message.channel.send(createListMembersEmbed(
          [
            'Duplicate Members',
            `for \`${avatarHash.substr(avatarHash.length - 8)}\``,
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

  if (empty) {
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
 * Launch help menu.
 *
 * @param {module:"discord.js".Message} message      - Message object.
 * @param {string}                      botPrefix    - Command prefix.
 * @param {object}                      settings     - Command settings defined in configuration.
 * @param {object}                      allowedRoles - Allowed roles to use command.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function launchHelpMenu(message, botPrefix, settings, allowedRoles) {
  const allowFetchMembersRoles = _.get(allowedRoles, 'configFetchMembers.allowed-roles', []);
  const allowFindDuplicateUsersRoles = _.get(allowedRoles, 'configFindDuplicateUsers.allowed-roles', []);
  const allowedHelpRoles = _.get(settings, 'allowed-roles', []);
  const allowTogglePermsRoles = _.get(allowedRoles, 'configTogglePerms.allowed-roles', []);
  const allowVoiceRoles = _.get(allowedRoles, 'configVoice.allowed-roles', []);

  const commands = [];

  if (
    !_.some(allowedHelpRoles, (allowedHelpRole) => message.member.roles.cache.has(allowedHelpRole.id))
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
    _.some(allowFetchMembersRoles, (allowFetchMembersRole) => message.member.roles.cache.has(allowFetchMembersRole.id))
    || message.member.hasPermission('ADMINISTRATOR')
  ) {
    commands.push({
      queries: [
        `${botPrefix}fetch-members avatar [@user]`,
        `${botPrefix}fetch-members role [@role]`,
        `${botPrefix}fetch-members string [text]`,
        `${botPrefix}fetch-members username [@user]`,
      ],
      description: 'Search for members matching an avatar, character, role, or username',
    });
  }

  if (
    _.some(allowFindDuplicateUsersRoles, (allowFindDuplicateUsersRole) => message.member.roles.cache.has(allowFindDuplicateUsersRole.id))
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
    _.some(allowTogglePermsRoles, (allowTogglePermsRole) => message.member.roles.cache.has(allowTogglePermsRole.id))
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
    _.some(allowVoiceRoles, (allowVoiceRole) => message.member.roles.cache.has(allowVoiceRole.id))
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

  if (commands.length) {
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
 * @param {module:"discord.js".Message} message   - Message object.
 * @param {string}                      botPrefix - Command prefix.
 * @param {object}                      settings  - Command settings defined in configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function togglePerms(message, botPrefix, settings) {
  const commandArguments = message.toString().split(' ');
  const toggleGroup = commandArguments[1];
  const toggleDirection = commandArguments[2];
  const perms = _.get(settings, 'perms', []);
  const allowedRoles = _.get(settings, 'allowed-roles', []);
  const selectedToggleGroup = _.find(perms, { id: toggleGroup });
  const selectedToggleDirection = _.get(selectedToggleGroup, toggleDirection);
  const selectedToggleName = _.get(selectedToggleGroup, 'name', 'Unknown');

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id))
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
  if (selectedToggleGroup === undefined) {
    const permsIds = _.map(perms, 'id');

    let commands = '';

    // Shows the first 10 commands.
    permsIds.forEach((permsId, key) => {
      if (key < 10) {
        commands += `${botPrefix}toggle-perms ${permsId} on\r\n${botPrefix}toggle-perms ${permsId} off\r\n\r\n`;
      }
    });

    await message.channel.send(createCommandErrorEmbed(
      [
        `The toggle group (${toggleGroup}) is invalid. Please type your command with the correct group and try again.\r\n`,
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
    _.isEmpty(selectedToggleDirection)
    || !_.isArray(selectedToggleDirection)
    || !_.every(selectedToggleDirection, _.isPlainObject)
    || (toggleDirection !== 'on' && toggleDirection !== 'off')
  ) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The toggle direction (${toggleDirection}) is invalid or not configured. Please type your command with the correct direction and try again.\r\n`,
        'Example:',
        '```',
        `${botPrefix}toggle-perms ${toggleGroup} on`,
        `${botPrefix}toggle-perms ${toggleGroup} off`,
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
  const channelToggles = await selectedToggleDirection.map(async (channelToggle) => {
    const channelToggleId = _.get(channelToggle, 'channel-id');
    const channelTogglePerms = _.get(channelToggle, 'channel-perms', []);
    const channelToggleChannel = message.channel.guild.channels.cache.get(channelToggleId);

    if (!channelToggleChannel) {
      generateLogMessage(
        [
          'Failed to toggle preset permissions for',
          chalk.red(selectedToggleName),
          'to',
          toggleDirection,
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
    const userToggles = await channelTogglePerms.map(async (userToggle) => {
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
          toggleDirection,
        ].join(' '),
      ).catch((error) => {
        isSuccess = false;

        generateLogMessage(
          [
            'Failed to toggle preset permissions for',
            chalk.red(selectedToggleName),
            'to',
            toggleDirection,
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

    if (success) {
      generateLogMessage(
        [
          'Successfully toggled preset permissions for',
          chalk.green(selectedToggleName),
          'to',
          toggleDirection,
        ].join(' '),
        30,
      );

      await message.channel.send(createTogglePermsEmbed(
        `Successfully toggled preset permissions for **${selectedToggleName}** to ${toggleDirection}.`,
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
          `Failed to toggle one or more preset permissions for **${selectedToggleName}** to ${toggleDirection}.`,
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
 * @param {module:"discord.js".Message} message   - Message object.
 * @param {string}                      botPrefix - Command prefix.
 * @param {object}                      settings  - Command settings defined in configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function voice(message, botPrefix, settings) {
  const allowedRoles = _.get(settings, 'allowed-roles', []);
  const commandArguments = message.toString().split(' ');
  const commandRoute = commandArguments[1];
  const commandTag = commandArguments[2];
  const channelId = (_.isString(commandTag)) ? commandTag.replace(/[<#>]/g, '') : undefined;
  const channel = message.channel.guild.channels.cache.get(channelId);
  const isVoiceChannel = (channel && channel.type === 'voice');

  if (
    !_.some(allowedRoles, (allowedRole) => message.member.roles.cache.has(allowedRole.id))
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
  if (!['disconnect', 'unmute'].includes(commandRoute)) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The command route (${commandRoute}) is invalid or does not exist. Try using the command by selecting a route.\r\n`,
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
  if (!channel || !isVoiceChannel) {
    await message.channel.send(createCommandErrorEmbed(
      [
        `The voice channel (${channelId}) is invalid or does not exist. Try using the command by pasting a channel ID.\r\n`,
        'Example:',
        '```',
        `${botPrefix}voice ${commandRoute} [#channel]`,
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
    (commandRoute === 'disconnect' && !message.guild.me.hasPermission('MOVE_MEMBERS'))
    || (commandRoute === 'unmute' && !message.guild.me.hasPermission('MUTE_MEMBERS'))
  ) {
    const disconnect = (commandRoute === 'disconnect') ? 'Move Members' : undefined;
    const unmute = (commandRoute === 'unmute') ? 'Mute Members' : undefined;

    await message.channel.send(createCommandErrorEmbed(
      [
        message.guild.me.toString(),
        'requires the',
        `**${disconnect || unmute}**`,
        'permission to',
        commandRoute,
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
    commandRoute,
    `Please wait while ${message.guild.me.toString()} ${commandRoute}s all members connected to the ${channel.toString()} voice channel...`,
    'in-progress',
    message.member.user.tag,
  )).then(async (theMessage) => {
    const voiceStates = channel.guild.voiceStates.cache.array();
    const usersResults = await voiceStates.map(async (voiceState) => {
      let success = false;

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
              chalk.red(memberMention),
              'from',
              chalk.red(channelMention),
              'voice channel',
            ].join(' '),
            40,
            (_.isError(error)) ? error : undefined,
          );

          return (!_.isError(error));
        };

        if (commandRoute === 'disconnect') {
          await voiceState.kick().then(() => {
            success = logger('Disconnected');
          }).catch((error) => {
            success = logger('Failed to disconnect', error);
          });
        } else if (commandRoute === 'unmute') {
          await voiceState.setMute(false).then(() => {
            success = logger('Unmuted');
          }).catch((error) => {
            success = logger('Failed to unmute', error);
          });
        }
      }

      return success;
    });

    Promise.all(usersResults).then(async (responses) => {
      const success = _.every(responses, (response) => response === true);
      const disconnect = (commandRoute === 'disconnect') ? 'disconnected' : undefined;
      const unmute = (commandRoute === 'unmute') ? 'unmuted' : undefined;

      await theMessage.edit(createVoiceEmbed(
        commandRoute,
        [
          (success) ? 'All members have been' : 'One or more members could not be',
          disconnect || unmute,
          'from the',
          channel.toString(),
          'voice channel.',
        ].join(' '),
        (success) ? 'complete' : 'fail',
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

module.exports = {
  fetchMembers,
  findDuplicateUsers,
  launchHelpMenu,
  togglePerms,
  voice,
};
