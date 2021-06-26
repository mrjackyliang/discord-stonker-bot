const chalk = require('chalk');
const _ = require('lodash');

const { createMemberMonitorEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Anti-raid auto-ban.
 *
 * @param {module:"discord.js".GuildMember} member   - Member information.
 * @param {object}                          settings - Banned users from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidAutoBan(member, settings) {
  const userAvatar = member.user.avatar;
  const userUsername = member.user.username;
  const avatars = _.get(settings, 'avatar');
  const usernames = _.get(settings, 'username');

  if (
    (_.isArray(avatars) && !_.isEmpty(avatars) && _.every(avatars, (avatar) => _.isString(avatar) && !_.isEmpty(avatar)))
    || (_.isArray(usernames) && !_.isEmpty(usernames) && _.every(usernames, (username) => _.isString(username) && !_.isEmpty(username)))
  ) {
    const bannedAvatar = userAvatar !== null && _.includes(avatars, userAvatar);
    const bannedUsername = _.includes(usernames, userUsername);
    const fragmentAvatar = (bannedAvatar) ? `avatar hash (${userAvatar})` : undefined;
    const fragmentUsername = (bannedUsername) ? `username (${userUsername})` : undefined;

    // If user has a banned avatar hash or username.
    if (bannedAvatar || bannedUsername) {
      await member.ban(
        {
          reason: `Member has a forbidden ${fragmentAvatar || fragmentUsername}`,
        },
      ).then(() => {
        generateLogMessage(
          [
            chalk.red(member.toString()),
            'was automatically banned because member has a forbidden',
            fragmentAvatar || fragmentUsername,
          ].join(' '),
          30,
        );
      }).catch((error) => generateLogMessage(
        'Failed to ban member',
        10,
        error,
      ));
    }
  }
}

/**
 * Anti-raid auto-verify.
 *
 * @param {module:"discord.js".GuildMember} member   - Member information.
 * @param {object}                          settings - Verification settings from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidAutoVerify(member, settings) {
  const memberUserCreatedTimestamp = member.user.createdTimestamp;
  const settingsVerifiedRoleId = _.get(settings, 'verified-role-id');
  const settingsTrustedAge = _.get(settings, 'trusted-age');
  const isTrustedAge = (((Date.now() - memberUserCreatedTimestamp) / 1000) >= settingsTrustedAge);

  if (!_.isFinite(settingsTrustedAge)) {
    return;
  }

  // If user meets trusted age requirement, automatically add verify role.
  if (isTrustedAge) {
    await member.roles.add(
      settingsVerifiedRoleId,
      'Member was auto-assigned the verified role',
    ).then(() => {
      generateLogMessage(
        [
          chalk.green(member.toString()),
          'was auto-assigned the verified role',
        ].join(' '),
        30,
      );
    }).catch((error) => generateLogMessage(
      'Failed to add role',
      10,
      error,
    ));
  }
}

/**
 * Anti-raid monitor.
 *
 * @param {module:"discord.js".GuildMember}            member        - Member information.
 * @param {"join"|"leave"}                             mode          - Whether a user joined or left a guild.
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidMonitor(member, mode, sendToChannel) {
  const joined = (mode === 'join') ? 'joined' : undefined;
  const left = (mode === 'leave') ? 'left' : undefined;

  if (_.isUndefined(sendToChannel)) {
    return;
  }

  generateLogMessage(
    [
      chalk.yellow(member.toString()),
      'has',
      joined || left,
      'the guild',
    ].join(' '),
    30,
  );

  await sendToChannel.send(createMemberMonitorEmbed(
    mode,
    member.user.tag,
    member.user.toString(),
    member.user.avatar,
    member.user.displayAvatarURL({
      format: 'webp',
      dynamic: true,
      size: 4096,
    }),
    member.user.createdAt,
    member.joinedAt,
    member.roles.cache,
  )).catch((error) => generateLogMessage(
    'Failed to send member monitor embed',
    10,
    error,
  ));
}

/**
 * Anti-raid verification.
 *
 * @param {module:"discord.js".Message} message  - Message object.
 * @param {object}                      settings - Verification settings from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidVerify(message, settings) {
  const messageMemberUserAvatar = _.get(message, 'member.user.avatar');
  const messageMemberUserCreatedTimestamp = _.get(message, 'member.user.createdTimestamp');
  const messageMemberUserId = _.get(message, 'member.user.id');

  const currentChannelId = _.get(message, 'channel.id');
  const settingsChannelId = _.get(settings, 'channel-id');

  const settingsVerifiedRoleId = _.get(settings, 'verified-role-id');
  const settingsMinimumAge = _.get(settings, 'minimum-age');
  const settingsSecretCodes = _.get(settings, 'secret-codes');
  const settingsExcludeRoles = _.get(settings, 'exclude-roles');

  const generateCode = (display) => _.replace(
    messageMemberUserId,
    /^([0-9]{4})(.*)([0-9]{4})$/g,
    (display) ? '$1-$3' : '$1$3',
  );
  const replaceVariables = (rawMessage) => {
    if (_.isString(rawMessage) && !_.isEmpty(rawMessage)) {
      return rawMessage
        .replace(/%MEMBER_MENTION%/g, message.member.toString())
        .replace(/%MEMBER_CODE%/g, generateCode(true));
    }

    return undefined;
  };

  const welcomeNormal = replaceVariables(_.get(settings, 'messages.welcome.normal'));
  const welcomeSuspicious = replaceVariables(_.get(settings, 'messages.welcome.suspicious'));
  const validNormal = replaceVariables(_.get(settings, 'messages.valid.normal'));
  const validSuspicious = replaceVariables(_.get(settings, 'messages.valid.suspicious'));
  const invalidNormal = replaceVariables(_.get(settings, 'messages.invalid.normal'));
  const invalidSuspicious = replaceVariables(_.get(settings, 'messages.invalid.suspicious'));

  if (
    currentChannelId !== settingsChannelId
    || !message.guild.roles.cache.has(settingsVerifiedRoleId)
    || !_.isFinite(settingsMinimumAge)
    || _.some(settingsExcludeRoles, (settingsExcludeRole) => message.member.roles.cache.has(settingsExcludeRole.id))
    || message.member.permissions.has('ADMINISTRATOR')
    || _.isUndefined(welcomeNormal)
    || _.isUndefined(welcomeSuspicious)
    || _.isUndefined(validNormal)
    || _.isUndefined(validSuspicious)
    || _.isUndefined(invalidNormal)
    || _.isUndefined(invalidSuspicious)
  ) {
    return;
  }

  // Use welcome, valid, or invalid message.
  const isAvatar = (_.isString(messageMemberUserAvatar));
  const isMinimumAge = (((Date.now() - messageMemberUserCreatedTimestamp) / 1000) >= settingsMinimumAge);
  const welcomeMessage = (isAvatar && isMinimumAge) ? welcomeNormal : welcomeSuspicious;
  const validMessage = (isAvatar && isMinimumAge) ? validNormal : validSuspicious;
  const invalidMessage = (isAvatar && isMinimumAge) ? invalidNormal : invalidSuspicious;

  // Compare user code with user input.
  const userCode = generateCode(false);
  const userInput = message.toString()
    .replace(/[- –—−]/g, '')
    .replace(/[１]/g, '1')
    .replace(/[２]/g, '2')
    .replace(/[３]/g, '3')
    .replace(/[４]/g, '4')
    .replace(/[５]/g, '5')
    .replace(/[６]/g, '6')
    .replace(/[７]/g, '7')
    .replace(/[８]/g, '8')
    .replace(/[９]/g, '9')
    .replace(/[０Oo]/g, '0');

  // Delete message first.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  // Verify member unlock code.
  if (userInput === '0') {
    // Send welcome message.
    await message.member.createDM().then(async (dmChannel) => {
      await dmChannel.send(welcomeMessage).then(() => {
        generateLogMessage(
          [
            'Sent direct message to',
            chalk.green(message.member.toString()),
            'because member requested a verification code',
          ].join(' '),
          30,
        );
      }).catch((error) => generateLogMessage(
        'Failed to send direct message',
        10,
        error,
      ));
    }).catch((error) => generateLogMessage(
      'Failed to create direct message channel',
      10,
      error,
    ));
  } else if (userCode === userInput || _.some(settingsSecretCodes, (settingsSecretCode) => settingsSecretCode === userInput)) {
    // Send valid message.
    await message.member.createDM().then(async (dmChannel) => {
      await dmChannel.send(validMessage).then(() => {
        generateLogMessage(
          [
            'Sent direct message to',
            chalk.green(message.member.toString()),
            'because member completed validation',
          ].join(' '),
          30,
        );
      }).catch((error) => generateLogMessage(
        'Failed to send direct message',
        10,
        error,
      ));
    }).catch((error) => generateLogMessage(
      'Failed to create direct message channel',
      10,
      error,
    ));

    // Add verified role.
    await message.member.roles.add(
      settingsVerifiedRoleId,
      'Member was assigned the verified role',
    ).then(() => {
      generateLogMessage(
        [
          chalk.green(message.member.toString()),
          'was assigned the verified role',
        ].join(' '),
        30,
      );
    }).catch((error) => generateLogMessage(
      'Failed to add role',
      10,
      error,
    ));
  } else {
    // Send invalid message.
    await message.member.createDM().then(async (dmChannel) => {
      await dmChannel.send(invalidMessage).then(() => {
        generateLogMessage(
          [
            'Sent direct message to',
            chalk.green(message.member.toString()),
            'because member failed validation',
          ].join(' '),
          30,
        );
      }).catch((error) => generateLogMessage(
        'Failed to send direct message',
        10,
        error,
      ));
    }).catch((error) => generateLogMessage(
      'Failed to create direct message channel',
      10,
      error,
    ));
  }
}

module.exports = {
  antiRaidAutoBan,
  antiRaidAutoVerify,
  antiRaidMonitor,
  antiRaidVerify,
};
