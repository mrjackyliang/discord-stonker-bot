import chalk from 'chalk';
import { GuildMember, PartialGuildMember } from 'discord.js';
import _ from 'lodash';

import { generateLogMessage } from '../lib/utilities';
import { ChangeRoles } from '../typings';

/**
 * Change roles.
 *
 * @param {GuildMember|PartialGuildMember} oldMember - Member information (old).
 * @param {GuildMember|PartialGuildMember} newMember - Member information (new).
 * @param {ChangeRoles}                    roles     - Change roles configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
export default async function changeRoles(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember, roles: ChangeRoles): Promise<void> {
  _.map(roles, async (role) => {
    const name = _.get(role, 'name', 'Unknown');
    const type = _.get(role, 'type');
    const beforeRoles = _.map(_.get(role, 'before'), 'id');
    const afterRoles = _.map(_.get(role, 'after'), 'id');
    const toAdd = _.map(_.get(role, 'to-add'), 'id');
    const toRemove = _.map(_.get(role, 'to-remove'), 'id');

    if (
      (
        type === 'yes-to-yes'
        && _.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole))
        && _.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole))
      )
      || (
        type === 'no-to-no'
        && !_.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole))
        && !_.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole))
      )
      || (
        type === 'yes-to-no'
        && _.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole))
        && !_.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole))
      )
      || (
        type === 'no-to-yes'
        && !_.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole))
        && _.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole))
      )
    ) {
      // Add roles.
      if (
        _.size(toAdd) > 0
        && !_.every(toAdd, _.isUndefined)
        && !_.some(toAdd, (theRole) => oldMember.roles.cache.has(theRole))
      ) {
        generateLogMessage(
          [
            'Adding roles for',
            chalk.green(newMember.toString()),
            `(name: ${name}, type: ${type})`,
          ].join(' '),
          40,
        );

        await newMember.roles.add(
          toAdd,
          `${name} (${type})`,
        ).catch((error: Error) => generateLogMessage(
          'Failed to add roles',
          10,
          error,
        ));
      }

      // Remove roles.
      if (
        _.size(toRemove) > 0
        && !_.every(toRemove, _.isUndefined)
        && _.some(toRemove, (theRole) => newMember.roles.cache.has(theRole))
      ) {
        generateLogMessage(
          [
            'Removing roles for',
            chalk.yellow(newMember.toString()),
            `(name: ${name}, type: ${type})`,
          ].join(' '),
          40,
        );

        await newMember.roles.remove(
          toRemove,
          `${name} (${type})`,
        ).catch((error: Error) => generateLogMessage(
          'Failed to remove roles',
          10,
          error,
        ));
      }
    }
  });
}
