import chalk from 'chalk';
import { GuildMember, PartialGuildMember, TextBasedChannels } from 'discord.js';
import _ from 'lodash';

import { createMemberMonitorEmbed } from '../lib/embed';
import { generateLogMessage, getTextBasedChannel } from '../lib/utilities';
import { AntiRaidAutoBan, AntiRaidMembershipGate, MemberMonitorMode } from '../typings';

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
      member.ban(
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
      }).catch((error: Error) => generateLogMessage(
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
  const settingsRoleId = _.get(settings, 'role-id');
  const settingsChannelId = _.get(settings, 'channel-id');
  const settingsMessage = _.get(settings, 'message');
  const sendToChannel = getTextBasedChannel(guild, settingsChannelId);
  const replaceVariables = (configMessage: string): string => {
    if (_.isString(configMessage) && !_.isEmpty(configMessage)) {
      return configMessage
        .replace(/%MEMBER_MENTION%/g, newMember.toString())
        .replace(/%GUILD_NAME%/g, guild.name);
    }

    return 'Thanks for verifying!';
  };

  if (
    guild.roles.cache.has(settingsRoleId)
    && oldMemberPending
    && !newMemberPending
  ) {
    newMember.roles.add(
      settingsRoleId,
      'Member was assigned the verified role',
    ).then(() => {
      generateLogMessage(
        [
          chalk.green(newMember.toString()),
          'was assigned the verified role',
        ].join(' '),
        30,
      );
    }).catch((error: Error) => generateLogMessage(
      'Failed to add role',
      10,
      error,
    ));

    if (sendToChannel) {
      sendToChannel.send({
        content: replaceVariables(settingsMessage),
      }).catch((error) => generateLogMessage(
        'Failed to send message',
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
 * @param {TextBasedChannels|undefined}    sendToChannel - Send message to channel.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function antiRaidMonitor(member: GuildMember | PartialGuildMember, mode: MemberMonitorMode, sendToChannel: TextBasedChannels | undefined): void {
  const joined = (mode === 'join') ? 'joined' : undefined;
  const left = (mode === 'leave') ? 'left' : undefined;

  generateLogMessage(
    [
      chalk.yellow(member.toString()),
      'has',
      joined ?? left,
      'the guild',
    ].join(' '),
    30,
  );

  if (sendToChannel && member.user && member.joinedAt) {
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
          member.roles.cache,
        ),
      ],
    }).catch((error: Error) => generateLogMessage(
      'Failed to send member monitor embed',
      10,
      error,
    ));
  }
}
