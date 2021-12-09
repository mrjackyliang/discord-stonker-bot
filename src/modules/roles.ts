import { GuildMember, PartialGuildMember } from 'discord.js';
import _ from 'lodash';

import { generateLogMessage } from '../lib/utilities';
import { ChangeRoles } from '../types';

/**
 * Change roles.
 *
 * @param {GuildMember|PartialGuildMember} oldMember - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember - Member information (new).
 * @param {ChangeRoles}                    roles     - Change roles configuration.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function changeRoles(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roles: ChangeRoles): void {
  _.map(roles, (role) => {
    const name = _.get(role, 'name', 'Unknown');
    const type = _.get(role, 'type');
    const beforeRoles = _.map(_.get(role, 'before'), 'id');
    const afterRoles = _.map(_.get(role, 'after'), 'id');
    const toAdd = _.map(_.get(role, 'to-add'), 'id');
    const toRemove = _.map(_.get(role, 'to-remove'), 'id');

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
            `(function: changeRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to add: ${JSON.stringify(toAdd)})`,
          ].join(' '),
          40,
        );

        newMember.roles.add(
          toAdd,
          `${name} (${type})`,
        ).catch((error) => generateLogMessage(
          [
            'Failed to add roles',
            `(function: changeRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to add: ${JSON.stringify(toAdd)})`,
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
            `(function: changeRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to remove: ${JSON.stringify(toRemove)})`,
          ].join(' '),
          40,
        );

        newMember.roles.remove(
          toRemove,
          `${name} (${type})`,
        ).catch((error) => generateLogMessage(
          [
            'Failed to remove roles',
            `(function: changeRoles, name: ${name}, member: ${newMember.toString()}, type: ${type}, to remove: ${JSON.stringify(toRemove)})`,
          ].join(' '),
          10,
          error,
        ));
      }
    }
  });
}
