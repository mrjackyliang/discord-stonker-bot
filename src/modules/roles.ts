import { GuildMember, PartialGuildMember } from 'discord.js';
import _ from 'lodash';

import { generateLogMessage, getTextBasedChannel } from '../lib/utilities';
import { ChangeRoles, SyncRoles } from '../types';

/**
 * Change role alert.
 *
 * @param {GuildMember|PartialGuildMember} oldMember - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember - Member information (new).
 * @param {ChangeRoles}                    roles     - Change roles configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function changeRoleAlert(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roles: ChangeRoles): void {
  const guild = newMember.guild ?? oldMember.guild;
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
        .replace(/%MEMBER_MENTION%/, newMember.toString());
    }

    return '';
  };

  _.forEach(roles, (role) => {
    const name = _.get(role, 'name', 'Unknown');
    const direction = _.get(role, 'direction');
    const roleId = _.get(role, 'role.role-id');
    const channelId = _.get(role, 'channel.channel-id');
    const message = _.get(role, 'message');
    const sendToChannel = getTextBasedChannel(guild, channelId);

    if (
      (
        direction === 'add'
        && oldMember.roles.resolve(roleId) === null
        && newMember.roles.resolve(roleId) !== null
      )
      || (
        direction === 'remove'
        && oldMember.roles.resolve(roleId) !== null
        && newMember.roles.resolve(roleId) === null
      )
    ) {
      generateLogMessage(
        [
          'Role change detected',
          `(function: changeRoleAlert, name: ${name}, member: ${newMember.toString()}, direction: ${direction})`,
        ].join(' '),
        30,
      );

      if (sendToChannel && message) {
        const payload = {
          content: replaceVariables(message),
        };

        sendToChannel.send(payload).catch((error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: changeRoleAlert, channel: ${sendToChannel.toString()}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      }
    }
  });
}

/**
 * Sync roles.
 *
 * @param {GuildMember|PartialGuildMember} oldMember - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember - Member information (new).
 * @param {SyncRoles}                      roles     - Sync roles configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function syncRoles(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roles: SyncRoles): void {
  _.forEach(roles, (role) => {
    const name = _.get(role, 'name', 'Unknown');
    const type = _.get(role, 'type');
    const beforeRoles = _.map(_.get(role, 'before'), 'role-id');
    const afterRoles = _.map(_.get(role, 'after'), 'role-id');
    const toAdd = _.map(_.get(role, 'to-add'), 'role-id');
    const toRemove = _.map(_.get(role, 'to-remove'), 'role-id');

    if (
      (
        type === 'yes-to-yes'
        && _.some(beforeRoles, (beforeRole) => oldMember.roles.resolve(beforeRole) !== null)
        && _.some(afterRoles, (afterRole) => newMember.roles.resolve(afterRole) !== null)
      )
      || (
        type === 'no-to-no'
        && !_.some(beforeRoles, (beforeRole) => oldMember.roles.resolve(beforeRole) !== null)
        && !_.some(afterRoles, (afterRole) => newMember.roles.resolve(afterRole) !== null)
      )
      || (
        type === 'yes-to-no'
        && _.some(beforeRoles, (beforeRole) => oldMember.roles.resolve(beforeRole) !== null)
        && !_.some(afterRoles, (afterRole) => newMember.roles.resolve(afterRole) !== null)
      )
      || (
        type === 'no-to-yes'
        && !_.some(beforeRoles, (beforeRole) => oldMember.roles.resolve(beforeRole) !== null)
        && _.some(afterRoles, (afterRole) => newMember.roles.resolve(afterRole) !== null)
      )
    ) {
      // Add roles.
      if (
        _.size(toAdd) > 0
        && !_.every(toAdd, _.isUndefined)
        && !_.some(toAdd, (theRole) => oldMember.roles.resolve(theRole) !== null)
      ) {
        generateLogMessage(
          [
            'Adding roles',
            `(function: syncRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to add: ${JSON.stringify(toAdd)})`,
          ].join(' '),
          40,
        );

        newMember.roles.add(
          toAdd,
          `${name} (${type})`,
        ).catch((error) => generateLogMessage(
          [
            'Failed to add roles',
            `(function: syncRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to add: ${JSON.stringify(toAdd)})`,
          ].join(' '),
          10,
          error,
        ));
      }

      // Remove roles.
      if (
        _.size(toRemove) > 0
        && !_.every(toRemove, _.isUndefined)
        && _.some(toRemove, (theRole) => newMember.roles.resolve(theRole) !== null)
      ) {
        generateLogMessage(
          [
            'Removing roles',
            `(function: syncRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to remove: ${JSON.stringify(toRemove)})`,
          ].join(' '),
          40,
        );

        newMember.roles.remove(
          toRemove,
          `${name} (${type})`,
        ).catch((error) => generateLogMessage(
          [
            'Failed to remove roles',
            `(function: syncRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to remove: ${JSON.stringify(toRemove)})`,
          ].join(' '),
          10,
          error,
        ));
      }
    }
  });
}
