const chalk = require('chalk');
const _ = require('lodash');

const { createMemberMonitorEmbed } = require('../lib/embed');
const { generateLogMessage } = require('../lib/utilities');

/**
 * Anti-raid auto-ban.
 *
 * @param {GuildMember} member   - Member information.
 * @param {object}      settings - Banned users from configuration.
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
          reason: `Member has a forbidden ${fragmentAvatar ?? fragmentUsername}`,
        },
      ).then(() => {
        generateLogMessage(
          [
            chalk.red(member.toString()),
            'was automatically banned because member has a forbidden',
            fragmentAvatar ?? fragmentUsername,
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
 * Anti-raid membership gate.
 *
 * @param {GuildMember} oldMember - Member information (old).
 * @param {GuildMember} newMember - Member information (new).
 * @param {object}      settings  - Membership gate settings.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function antiRaidMembershipGate(oldMember, newMember, settings) {
  const guild = _.get(newMember, 'guild') ?? _.get(oldMember, 'guild');
  const oldMemberPending = _.get(oldMember, 'pending');
  const newMemberPending = _.get(newMember, 'pending');
  const settingsVerifiedRoleId = _.get(settings, 'verified-role-id');

  if (
    guild.roles.cache.has(settingsVerifiedRoleId)
    && oldMemberPending === true
    && newMemberPending === false
  ) {
    await newMember.roles.add(
      settingsVerifiedRoleId,
      'Member was assigned the verified role',
    ).then(() => {
      generateLogMessage(
        [
          chalk.green(newMember.toString()),
          'was assigned the verified role',
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
 * @param {GuildMember}    member        - Member information.
 * @param {"join"|"leave"} mode          - Whether a user joined or left a guild.
 * @param {TextChannel}    sendToChannel - Send message to channel.
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
      joined ?? left,
      'the guild',
    ].join(' '),
    30,
  );

  await sendToChannel.send({
    embeds: [
      createMemberMonitorEmbed(
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
      ),
    ],
  }).catch((error) => generateLogMessage(
    'Failed to send member monitor embed',
    10,
    error,
  ));
}

module.exports = {
  antiRaidAutoBan,
  antiRaidMembershipGate,
  antiRaidMonitor,
};
