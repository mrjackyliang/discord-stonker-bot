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
          reason: `Member has a banned ${fragmentAvatar || fragmentUsername}`,
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
 * Anti-raid verification notice.
 *
 * @param {module:"discord.js".GuildMember}            member        - Member information.
 * @param {object}                                     settings      - Verification settings from configuration.
 * @param {module:"discord.js".TextBasedChannelFields} sendToChannel - Send message to channel.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidVerifyNotice(member, settings, sendToChannel) {
  const userCreatedTimestamp = _.get(member, 'user.createdTimestamp');
  const userId = _.get(member, 'user.id');
  const minimumAge = _.get(settings, 'minimum-age');
  const memberCode = _.replace(userId, /^([0-9]{4})(.*)([0-9]{4})$/g, '$1-$3');

  let welcomeNormal = _.get(settings, 'messages.welcome.normal');
  let welcomeSuspicious = _.get(settings, 'messages.welcome.suspicious');

  if (
    _.isUndefined(sendToChannel)
    || !_.isFinite(minimumAge)
    || !_.isString(welcomeNormal)
    || _.isEmpty(welcomeNormal)
    || !_.isString(welcomeSuspicious)
    || _.isEmpty(welcomeSuspicious)
  ) {
    return;
  }

  // Replace variables.
  welcomeNormal = welcomeNormal
    .replace(/%MEMBER_MENTION%/g, member.toString())
    .replace(/%MEMBER_CODE%/g, memberCode);
  welcomeSuspicious = welcomeSuspicious
    .replace(/%MEMBER_MENTION%/g, member.toString());

  // Use normal or suspicious message.
  const isMinimumAge = (((Date.now() - userCreatedTimestamp) / 1000) >= minimumAge);
  const normalOrSuspicious = (isMinimumAge) ? welcomeNormal : welcomeSuspicious;

  // Send verify notice.
  await sendToChannel.send(normalOrSuspicious).catch((error) => generateLogMessage(
    'Failed to send message',
    10,
    error,
  ));
}

/**
 * Anti-raid verification role.
 *
 * @param {module:"discord.js".Message} message  - Message object.
 * @param {object}                      settings - Verification settings from configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidVerifyRole(message, settings) {
  const messageMemberUserCreatedTimestamp = _.get(message, 'member.user.createdTimestamp');
  const messageMemberUserId = _.get(message, 'member.user.id');
  const messageChannelId = _.get(message, 'channel.id');
  const settingsChannelId = _.get(settings, 'channel-id');
  const settingsVerifiedRoleId = _.get(settings, 'verified-role-id');
  const settingsMinimumAge = _.get(settings, 'minimum-age');
  const settingsExcludeRoles = _.get(settings, 'exclude-roles');
  const displayCode = _.replace(messageMemberUserId, /^([0-9]{4})(.*)([0-9]{4})$/g, '$1-$3');
  const messageContent = message.toString().toLowerCase();

  let welcomeNormal = _.get(settings, 'messages.welcome.normal');
  let welcomeSuspicious = _.get(settings, 'messages.welcome.suspicious');
  let validNormal = _.get(settings, 'messages.valid.normal');
  let validSuspicious = _.get(settings, 'messages.valid.suspicious');
  let invalidNormal = _.get(settings, 'messages.invalid.normal');
  let invalidSuspicious = _.get(settings, 'messages.invalid.suspicious');

  if (
    messageChannelId !== settingsChannelId
    || !_.isString(settingsVerifiedRoleId)
    || _.isEmpty(settingsVerifiedRoleId)
    || !_.isFinite(settingsMinimumAge)
    || _.some(settingsExcludeRoles, (settingsExcludeRole) => message.member.roles.cache.has(settingsExcludeRole.id))
    || message.member.permissions.has('ADMINISTRATOR')
    || !_.isString(welcomeNormal)
    || _.isEmpty(welcomeNormal)
    || !_.isString(welcomeSuspicious)
    || _.isEmpty(welcomeSuspicious)
    || !_.isString(validNormal)
    || _.isEmpty(validNormal)
    || !_.isString(validSuspicious)
    || _.isEmpty(validSuspicious)
    || !_.isString(invalidNormal)
    || _.isEmpty(invalidNormal)
    || !_.isString(invalidSuspicious)
    || _.isEmpty(invalidSuspicious)
  ) {
    return;
  }

  // Replace variables.
  welcomeNormal = welcomeNormal
    .replace(/%MEMBER_MENTION%/g, message.member.toString())
    .replace(/%MEMBER_CODE%/g, displayCode);
  welcomeSuspicious = welcomeSuspicious
    .replace(/%MEMBER_MENTION%/g, message.member.toString());
  validNormal = validNormal
    .replace(/%MEMBER_MENTION%/g, message.member.toString());
  validSuspicious = validSuspicious
    .replace(/%MEMBER_MENTION%/g, message.member.toString());
  invalidNormal = invalidNormal
    .replace(/%MEMBER_MENTION%/g, message.member.toString())
    .replace(/%MEMBER_CODE%/g, displayCode);
  invalidSuspicious = invalidSuspicious
    .replace(/%MEMBER_MENTION%/g, message.member.toString());

  // Use normal or suspicious message.
  const isMinimumAge = (((Date.now() - messageMemberUserCreatedTimestamp) / 1000) >= settingsMinimumAge);
  const welcomeMessage = (isMinimumAge) ? welcomeNormal : welcomeSuspicious;
  const validMessage = (isMinimumAge) ? validNormal : validSuspicious;
  const invalidMessage = (isMinimumAge) ? invalidNormal : invalidSuspicious;

  // Compare user code with user input.
  const userCode = _.replace(messageMemberUserId, /^([0-9]{4})(.*)([0-9]{4})$/g, '$1$3');
  const userInput = messageContent
    .replace(/[- –—−]/g, '')
    .replace(/[０]/g, '0')
    .replace(/[１]/g, '1')
    .replace(/[２]/g, '2')
    .replace(/[３]/g, '3')
    .replace(/[４]/g, '4')
    .replace(/[５]/g, '5')
    .replace(/[６]/g, '6')
    .replace(/[７]/g, '7')
    .replace(/[８]/g, '8')
    .replace(/[９]/g, '9');

  // Delete message first.
  await message.delete().catch((error) => generateLogMessage(
    'Failed to delete message',
    10,
    error,
  ));

  // If message includes "verify", or is a user code.
  if (_.includes(messageContent, 'verify')) {
    // Send welcome message.
    await message.channel.send(welcomeMessage).catch((error) => generateLogMessage(
      'Failed to send message',
      10,
      error,
    ));
  } else if (userCode === userInput) {
    // Send valid message.
    await message.channel.send(validMessage).catch((error) => generateLogMessage(
      'Failed to send message',
      10,
      error,
    ));

    // Add verified role.
    await message.member.roles.add(
      settingsVerifiedRoleId,
      'Member completed verification and was assigned the verified role',
    ).then(() => {
      generateLogMessage(
        [
          chalk.green(message.member.toString()),
          'has completed verification and was assigned the verified role',
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
    await message.channel.send(invalidMessage).catch((error) => generateLogMessage(
      'Failed to send message',
      10,
      error,
    ));
  }
}

module.exports = {
  antiRaidAutoBan,
  antiRaidMonitor,
  antiRaidVerifyNotice,
  antiRaidVerifyRole,
};
