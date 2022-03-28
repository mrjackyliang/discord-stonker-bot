import { GuildMember, PartialGuildMember, TextBasedChannel } from 'discord.js';
import _ from 'lodash';

import { createMemberMonitorEmbed } from '../lib/embed';
import { generateLogMessage, getTextBasedChannel } from '../lib/utilities';
import { AntiRaidAutoBan, AntiRaidMembershipGate, MemberMonitorMode } from '../types';

/**
 * Anti-raid auto-ban.
 *
 * @param {GuildMember}     member   - Member information.
 * @param {AntiRaidAutoBan} settings - Banned users from configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function antiRaidAutoBan(member: GuildMember, settings: AntiRaidAutoBan): void {
  const userAvatar = member.user.avatar;
  const userUsername = member.user.username;
  const avatars = _.map(_.get(settings, 'avatars'), (avatar) => avatar['avatar-hash']);
  const usernames = _.map(_.get(settings, 'usernames'), (username) => username.username);

  if (
    (_.isArray(avatars) && !_.isEmpty(avatars) && _.every(avatars, (avatar) => _.isString(avatar) && !_.isEmpty(avatar)))
    || (_.isArray(usernames) && !_.isEmpty(usernames) && _.every(usernames, (username) => _.isString(username) && !_.isEmpty(username)))
  ) {
    const bannedAvatar = userAvatar !== null && _.includes(avatars, userAvatar);
    const bannedUsername = _.includes(usernames, userUsername);

    // If user has a banned avatar hash or username.
    if (bannedAvatar || bannedUsername) {
      member.ban(
        {
          reason: [
            'Member has a forbidden',
            ...(bannedAvatar) ? [`avatar hash (${userAvatar})`] : [],
            ...(bannedAvatar && bannedUsername) ? ['and'] : [],
            ...(bannedUsername) ? [`username (${userUsername})`] : [],
          ].join(' '),
        },
      ).then(() => {
        generateLogMessage(
          [
            'Member banned',
            `(function: antiRaidAutoBan, member: ${member.toString()}, banned avatar: ${bannedAvatar}, banned username: ${bannedUsername})`,
          ].join(' '),
          30,
        );
      }).catch((error: any) => generateLogMessage(
        [
          'Failed to ban member',
          `(function: antiRaidAutoBan, member: ${member.toString()}, banned avatar: ${bannedAvatar}, banned username: ${bannedUsername})`,
        ].join(' '),
        10,
        error,
      ));
    }
  }
}

/**
 * Anti-raid membership gate.
 *
 * @param {GuildMember|PartialGuildMember} oldMember - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember - Member information (new).
 * @param {AntiRaidMembershipGate}         settings  - Membership gate settings.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function antiRaidMembershipGate(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, settings: AntiRaidMembershipGate): void {
  const guild = newMember.guild ?? oldMember.guild;
  const oldMemberPending = oldMember.pending;
  const newMemberPending = newMember.pending;
  const roleId = _.get(settings, 'role.role-id');
  const channelId = _.get(settings, 'channel.channel-id');
  const message = _.get(settings, 'message');
  const sendToChannel = getTextBasedChannel(guild, channelId);
  /**
   * Replace variables.
   *
   * @param {string} configMessage - Message from configuration.
   *
   * @returns {string}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configMessage: string): string => {
    if (_.isString(configMessage) && !_.isEmpty(configMessage)) {
      return configMessage
        .replace(/%MEMBER_MENTION%/g, newMember.toString())
        .replace(/%GUILD_NAME%/g, guild.name);
    }

    return 'Thanks for verifying!';
  };

  if (
    roleId
    && guild.roles.resolve(roleId) !== null
    && oldMemberPending
    && !newMemberPending
  ) {
    newMember.roles.add(
      roleId,
      'Member passed the membership gate',
    ).then(() => {
      generateLogMessage(
        [
          'Role added',
          `(function: antiRaidMembershipGate, member: ${newMember.toString()}, role id: ${roleId})`,
        ].join(' '),
        30,
      );
    }).catch((error: any) => generateLogMessage(
      [
        'Failed to add role',
        `(function: antiRaidMembershipGate, member: ${newMember.toString()}, role id: ${roleId})`,
      ].join(' '),
      10,
      error,
    ));

    if (sendToChannel && message) {
      const payload = {
        content: replaceVariables(message),
      };

      sendToChannel.send(payload).catch((error: any) => generateLogMessage(
        [
          'Failed to send message',
          `(function: antiRaidMembershipGate, channel: ${sendToChannel.toString()}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        10,
        error,
      ));
    }
  }
}

/**
 * Anti-raid monitor.
 *
 * @param {GuildMember|PartialGuildMember} member        - Member information.
 * @param {MemberMonitorMode}              mode          - Whether a user joined or left a guild.
 * @param {TextBasedChannel|undefined}     sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function antiRaidMonitor(member: GuildMember | PartialGuildMember, mode: MemberMonitorMode, sendToChannel: TextBasedChannel | undefined): void {
  if (sendToChannel && member.user && member.joinedAt) {
    generateLogMessage(
      [
        'Guild member joined or left guild',
        `(function: antiRaidMonitor, member: ${member.toString()}, mode: ${mode})`,
      ].join(' '),
      30,
    );

    sendToChannel.send({
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
          member.roles,
        ),
      ],
    }).catch((error: any) => generateLogMessage(
      [
        'Failed to send embed',
        `(function: antiRaidMonitor, channel: ${sendToChannel.toString()})`,
      ].join(' '),
      10,
      error,
    ));
  }
}
