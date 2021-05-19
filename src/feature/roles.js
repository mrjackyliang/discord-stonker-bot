const chalk = require('chalk');
const _ = require('lodash');

const { generateLogMessage } = require('../lib/utilities');

/**
 * Change roles.
 *
 * @param {module:"discord.js".GuildMember} oldMember - Member information (old).
 * @param {module:"discord.js".GuildMember} newMember - Member information (new).
 * @param {object[]}                        roles     - Change roles configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function changeRoles(oldMember, newMember, roles) {
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
        && _.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole) === true)
        && _.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole) === true)
      )
      || (
        type === 'no-to-no'
        && !_.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole) === true)
        && !_.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole) === true)
      )
      || (
        type === 'yes-to-no'
        && _.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole) === true)
        && !_.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole) === true)
      )
      || (
        type === 'no-to-yes'
        && !_.some(beforeRoles, (beforeRole) => oldMember.roles.cache.has(beforeRole) === true)
        && _.some(afterRoles, (afterRole) => newMember.roles.cache.has(afterRole) === true)
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
          /**
           * @type {RoleResolvable[]}
           */
          toAdd,
          `${name} (${type})`,
        ).catch((error) => generateLogMessage(
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
          /**
           * @type {RoleResolvable[]}
           */
          toRemove,
          `${name} (${type})`,
        ).catch((error) => generateLogMessage(
          'Failed to remove roles',
          10,
          error,
        ));
      }
    }
  });
}

module.exports = {
  changeRoles,
};
