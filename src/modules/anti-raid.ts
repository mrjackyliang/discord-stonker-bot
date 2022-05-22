import { MessageOptions } from 'discord.js';
import _ from 'lodash';

import { fetchFormattedDate, generateLogMessage, getTextBasedChannel } from '../lib/utility';
import {
  AntiRaidAutoBanMember,
  AntiRaidAutoBanReturns,
  AntiRaidAutoBanSettings,
  AntiRaidAutoBanSettingsAvatarAvatar,
  AntiRaidAutoBanSettingsAvatars,
  AntiRaidAutoBanSettingsUsernames,
  AntiRaidAutoBanSettingsUsernameUsername,
  AntiRaidMembershipGateGuild,
  AntiRaidMembershipGateNewMember,
  AntiRaidMembershipGateOldMember,
  AntiRaidMembershipGateReplaceVariablesConfigPayload,
  AntiRaidMembershipGateReplaceVariablesReturns,
  AntiRaidMembershipGateReturns,
  AntiRaidMembershipGateSettings,
  AntiRaidMembershipGateSettingsChannelChannelId,
  AntiRaidMembershipGateSettingsPayload,
  AntiRaidMembershipGateSettingsRoleRoleId,
  AntiRaidMembershipGateSettingsRoles,
} from '../types';

/**
 * Anti-raid auto ban.
 *
 * @param {AntiRaidAutoBanMember}   member   - Member.
 * @param {AntiRaidAutoBanSettings} settings - Settings.
 *
 * @returns {AntiRaidAutoBanReturns}
 *
 * @since 1.0.0
 */
export function antiRaidAutoBan(member: AntiRaidAutoBanMember, settings: AntiRaidAutoBanSettings): AntiRaidAutoBanReturns {
  const memberUserAvatar = member.user.avatar;
  const memberUserUsername = member.user.username;

  const settingsAvatars = <AntiRaidAutoBanSettingsAvatars>_.get(settings, ['avatars']);
  const settingsUsernames = <AntiRaidAutoBanSettingsUsernames>_.get(settings, ['usernames']);

  const avatars = _.map(settingsAvatars, (settingsAvatar) => <AntiRaidAutoBanSettingsAvatarAvatar>_.get(settingsAvatar, ['avatar']));
  const usernames = _.map(settingsUsernames, (settingsUsername) => <AntiRaidAutoBanSettingsUsernameUsername>_.get(settingsUsername, ['username']));

  // If "anti-raid.auto-ban" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"anti-raid.auto-ban" is not configured',
        `(function: antiRaidAutoBan, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "anti-raid.auto-ban.avatars" and "anti-raid.auto-ban.usernames" is not configured properly.
  if (
    settingsAvatars === undefined
    && settingsUsernames === undefined
  ) {
    generateLogMessage(
      [
        '"anti-raid.auto-ban.avatars" and "anti-raid.auto-ban.usernames" is not configured properly',
        `(function: antiRaidAutoBan, avatars: ${JSON.stringify(settingsAvatars)}, usernames: ${JSON.stringify(settingsUsernames)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "anti-raid.auto-ban.avatars" is not configured properly.
  if (
    settingsAvatars !== undefined
    && (
      !_.isArray(settingsAvatars)
      || _.isEmpty(settingsAvatars)
      || !_.every(settingsAvatars, (settingsAvatar) => _.isPlainObject(settingsAvatar) && !_.isEmpty(settingsAvatar))
      || !_.every(avatars, (avatar) => _.isString(avatar) && !_.isEmpty(avatar))
    )
  ) {
    generateLogMessage(
      [
        '"anti-raid.auto-ban.avatars" is not configured properly',
        `(function: antiRaidAutoBan, avatars: ${JSON.stringify(settingsAvatars)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "anti-raid.auto-ban.usernames" is not configured properly.
  if (
    settingsUsernames !== undefined
    && (
      !_.isArray(settingsUsernames)
      || _.isEmpty(settingsUsernames)
      || !_.every(settingsUsernames, (settingsUsername) => _.isPlainObject(settingsUsername) && !_.isEmpty(settingsUsername))
      || !_.every(usernames, (username) => _.isString(username) && !_.isEmpty(username))
    )
  ) {
    generateLogMessage(
      [
        '"anti-raid.auto-ban.usernames" is not configured properly',
        `(function: antiRaidAutoBan, usernames: ${JSON.stringify(settingsUsernames)})`,
      ].join(' '),
      10,
    );

    return;
  }

  const hasBannedAvatar = memberUserAvatar !== null && avatars.includes(memberUserAvatar);
  const hasBannedUsername = usernames.includes(memberUserUsername);

  if (
    hasBannedAvatar
    || hasBannedUsername
  ) {
    member.ban(
      {
        reason: [
          'Member has a forbidden',
          ...(hasBannedAvatar) ? [`avatar (${memberUserAvatar})`] : [],
          ...(hasBannedAvatar && hasBannedUsername) ? ['and'] : [],
          ...(hasBannedUsername) ? [`username (${memberUserUsername})`] : [],
        ].join(' '),
      },
    ).then(() => generateLogMessage(
      [
        'Banned member',
        `(function: antiRaidAutoBan, member: ${JSON.stringify(member.toString())}, avatar: ${JSON.stringify(memberUserAvatar)}, username: ${JSON.stringify(memberUserUsername)}, has banned avatar: ${JSON.stringify(hasBannedAvatar)}, has banned username: ${JSON.stringify(hasBannedUsername)})`,
      ].join(' '),
      40,
    )).catch((error: Error) => generateLogMessage(
      [
        'Failed to ban member',
        `(function: antiRaidAutoBan, member: ${JSON.stringify(member.toString())}, avatar: ${JSON.stringify(memberUserAvatar)}, username: ${JSON.stringify(memberUserUsername)}, has banned avatar: ${JSON.stringify(hasBannedAvatar)}, has banned username: ${JSON.stringify(hasBannedUsername)})`,
      ].join(' '),
      10,
      error,
    ));
  }
}

/**
 * Anti-raid membership gate.
 *
 * @param {AntiRaidMembershipGateOldMember} oldMember - Member (old).
 * @param {AntiRaidMembershipGateNewMember} newMember - Member (new).
 * @param {AntiRaidMembershipGateGuild}     guild     - Guild.
 * @param {AntiRaidMembershipGateSettings}  settings  - Settings.
 *
 * @returns {AntiRaidMembershipGateReturns}
 *
 * @since 1.0.0
 */
export function antiRaidMembershipGate(oldMember: AntiRaidMembershipGateOldMember, newMember: AntiRaidMembershipGateNewMember, guild: AntiRaidMembershipGateGuild, settings: AntiRaidMembershipGateSettings): AntiRaidMembershipGateReturns {
  const oldMemberPending = oldMember.pending;

  const newMemberPending = newMember.pending;
  const newMemberRoles = newMember.roles;

  const guildName = guild.name;
  const guildRoles = guild.roles;

  const settingsRoles = <AntiRaidMembershipGateSettingsRoles>_.get(settings, ['roles']);
  const settingsPayload = <AntiRaidMembershipGateSettingsPayload>_.get(settings, ['payload']);
  const settingsChannelChannelId = <AntiRaidMembershipGateSettingsChannelChannelId>_.get(settings, ['channel', 'channel-id']);

  const channel = getTextBasedChannel(guild, settingsChannelChannelId);

  /**
   * Anti-raid membership gate - Replace variables.
   *
   * @param {AntiRaidMembershipGateReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {AntiRaidMembershipGateReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: AntiRaidMembershipGateReplaceVariablesConfigPayload): AntiRaidMembershipGateReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%GUILD_NAME%/g, guildName)
      .replace(/%MEMBER_MENTION%/g, newMember.toString())
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    return JSON.parse(editedPayload);
  };

  const roleIds = _.map(settingsRoles, (settingsRole) => <AntiRaidMembershipGateSettingsRoleRoleId>_.get(settingsRole, ['role-id']));

  let payload: MessageOptions = {};

  // If "anti-raid.membership-gate" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"anti-raid.membership-gate" is not configured',
        `(function: antiRaidMembershipGate, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "anti-raid.membership-gate.roles" is not configured properly.
  if (
    !_.isArray(settingsRoles)
    || _.isEmpty(settingsRoles)
    || !_.every(settingsRoles, (settingsRole) => _.isPlainObject(settingsRole) && !_.isEmpty(settingsRole))
    || !_.every(roleIds, (roleId) => roleId !== undefined && guildRoles.resolve(roleId) !== null)
  ) {
    generateLogMessage(
      [
        '"anti-raid.membership-gate.roles" is not configured properly',
        `(function: antiRaidMembershipGate, roles: ${JSON.stringify(settingsRoles)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "anti-raid.membership-gate.payload" is not configured properly.
  if (
    settingsPayload !== undefined
    && (
      !_.isPlainObject(settingsPayload)
      || _.isEmpty(settingsPayload)
    )
  ) {
    generateLogMessage(
      [
        '"anti-raid.membership-gate.payload" is not configured properly',
        `(function: antiRaidMembershipGate, payload: ${JSON.stringify(settingsPayload)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "anti-raid.membership-gate.channel.channel-id" is not configured properly.
  if (
    settingsChannelChannelId !== undefined
    && (
      channel === undefined
      || channel === null
    )
  ) {
    generateLogMessage(
      [
        '"anti-raid.membership-gate.channel.channel-id" is not configured properly',
        `(function: antiRaidMembershipGate, channel id: ${JSON.stringify(settingsChannelChannelId)})`,
      ].join(' '),
      10,
    );

    return;
  }

  if (
    oldMemberPending
    && !newMemberPending
  ) {
    newMemberRoles.add(
      _.filter(roleIds, _.isString),
      'Member passed the membership gate',
    ).then(() => generateLogMessage(
      [
        'Added roles',
        `(function: antiRaidMembershipGate, member: ${JSON.stringify(newMember.toString())}, roles: ${JSON.stringify(settingsRoles)})`,
      ].join(' '),
      40,
    )).catch((error: Error) => generateLogMessage(
      [
        'Failed to add roles',
        `(function: antiRaidMembershipGate, member: ${JSON.stringify(newMember.toString())}, roles: ${JSON.stringify(settingsRoles)})`,
      ].join(' '),
      10,
      error,
    ));

    if (channel) {
      if (
        settingsPayload !== undefined
        && _.isPlainObject(settingsPayload)
        && !_.isEmpty(settingsPayload)
      ) {
        payload = replaceVariables(settingsPayload);
      } else {
        payload = {
          content: 'You have successfully passed the membership gate.',
        };
      }

      channel.send(payload).then((sendResponse) => {
        const sendResponseUrl = sendResponse.url;

        generateLogMessage(
          [
            'Sent message',
            `(function: antiRaidMembershipGate, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          40,
        );
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to send message',
          `(function: antiRaidMembershipGate, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        10,
        error,
      ));
    }
  }
}
