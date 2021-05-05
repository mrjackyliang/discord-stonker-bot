const chalk = require('chalk');
const _ = require('lodash');

const { generateLogMessage } = require('./utilities');

/**
 * Remove roles if no roles.
 *
 * @param {module:"discord.js".GuildMember} member      - Member information.
 * @param {object[]}                        removeRoles - Remove roles configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function removeRolesIfNoRoles(member, removeRoles) {
  const noRoles = _.filter(removeRoles, { type: 'if-no-roles' });

  _.map(noRoles, async (noRole) => {
    const name = _.get(noRole, 'name', 'Unknown');

    /**
     * No roles to detect.
     *
     * @type {RoleResolvable[]}
     */
    const noRolesToDetect = _.map(noRole['to-detect'], 'id');

    /**
     * No roles to remove.
     *
     * @type {RoleResolvable[]}
     */
    const noRolesToRemove = _.map(noRole['to-remove'], 'id');

    if (
      !_.some(noRolesToDetect, (noRoleToDetect) => member.roles.cache.has(noRoleToDetect) === true)
      && _.some(noRolesToRemove, (noRoleToRemove) => member.roles.cache.has(noRoleToRemove) === true)
    ) {
      generateLogMessage(
        [
          'Removing roles for',
          chalk.yellow(member.toString()),
          `(name: ${name}, type: if-no-roles)`,
        ].join(' '),
        40,
      );

      await member.roles.remove(
        noRolesToRemove,
        `${name} (if-no-roles)`,
      ).catch((error) => generateLogMessage(
        'Failed to remove roles',
        10,
        error,
      ));
    }
  });
}

/**
 * Remove roles if roles.
 *
 * @param {module:"discord.js".GuildMember} member      - Member information.
 * @param {object[]}                        removeRoles - Remove roles configuration.
 *
 * @returns {Promise<void>}
 *
 * @since 1.0.0
 */
async function removeRolesIfRoles(member, removeRoles) {
  const roles = _.filter(removeRoles, { type: 'if-roles' });

  _.map(roles, async (role) => {
    const name = _.get(role, 'name', 'Unknown');

    /**
     * Roles to detect.
     *
     * @type {RoleResolvable[]}
     */
    const rolesToDetect = _.map(role['to-detect'], 'id');

    /**
     * Roles to remove.
     *
     * @type {RoleResolvable[]}
     */
    const rolesToRemove = _.map(role['to-remove'], 'id');

    if (
      _.some(rolesToDetect, (roleToDetect) => member.roles.cache.has(roleToDetect) === true)
      && _.some(rolesToRemove, (roleToRemove) => member.roles.cache.has(roleToRemove) === true)
    ) {
      generateLogMessage(
        [
          'Removing roles for',
          chalk.yellow(member.toString()),
          `(name: ${name}, type: if-roles)`,
        ].join(' '),
        40,
      );

      await member.roles.remove(
        rolesToRemove,
        `${name} (if-roles)`,
      ).catch((error) => generateLogMessage(
        'Failed to remove roles',
        10,
        error,
      ));
    }
  });
}

module.exports = {
  removeRolesIfNoRoles,
  removeRolesIfRoles,
};
