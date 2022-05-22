import { MessageOptions } from 'discord.js';
import _ from 'lodash';

import { fetchFormattedDate, generateLogMessage, getTextBasedChannel } from '../lib/utility';
import {
  RoleMessagesEventChannelChannelId,
  RoleMessagesEventDirection,
  RoleMessagesEventName,
  RoleMessagesEventPayload,
  RoleMessagesEventRoleRoleId,
  RoleMessagesEvents,
  RoleMessagesGuild,
  RoleMessagesNewMember,
  RoleMessagesOldMember,
  RoleMessagesReplaceVariablesConfigPayload,
  RoleMessagesReplaceVariablesReturns,
  RoleMessagesReturns,
  SyncRolesGuild,
  SyncRolesMember,
  SyncRolesReturns,
  SyncRolesSettings,
  SyncRolesSettingsEventHasSomeRoles,
  SyncRolesSettingsEventName,
  SyncRolesSettingsEvents,
  SyncRolesSettingsEventSomeRoleRoleId,
  SyncRolesSettingsEventSomeRoles,
  SyncRolesSettingsEventToAddRoleRoleId,
  SyncRolesSettingsEventToAddRoles,
  SyncRolesSettingsEventToRemoveRoleRoleId,
  SyncRolesSettingsEventToRemoveRoles,
  SyncRolesSettingsTimeout,
} from '../types';
import { MemorySyncRoles } from '../types/memory';

/**
 * Memory.
 *
 * @since 1.0.0
 */
const memorySyncRoles: MemorySyncRoles = {};

/**
 * Role messages.
 *
 * @param {RoleMessagesOldMember} oldMember - Member (old).
 * @param {RoleMessagesNewMember} newMember - Member (new).
 * @param {RoleMessagesGuild}     guild     - Guild.
 * @param {RoleMessagesEvents}    events    - Events.
 *
 * @returns {RoleMessagesReturns}
 *
 * @since 1.0.0
 */
export function roleMessages(oldMember: RoleMessagesOldMember, newMember: RoleMessagesNewMember, guild: RoleMessagesGuild, events: RoleMessagesEvents): RoleMessagesReturns {
  const oldMemberRoles = oldMember.roles;

  const newMemberRoles = newMember.roles;

  const guildRoles = guild.roles;

  /**
   * Role messages - Replace variables.
   *
   * @param {RoleMessagesReplaceVariablesConfigPayload} configPayload - Config payload.
   *
   * @returns {RoleMessagesReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configPayload: RoleMessagesReplaceVariablesConfigPayload): RoleMessagesReplaceVariablesReturns => {
    const editedPayload = JSON.stringify(configPayload)
      .replace(/%MEMBER_MENTION%/g, newMember.toString())
      .replace(/%YEAR%/g, fetchFormattedDate('now', undefined, 'config', 'yyyy'));

    return JSON.parse(editedPayload);
  };

  // If "role-messages" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"role-messages" is not configured',
        `(function: roleMessages, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "role-messages" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"role-messages" is not configured properly',
        `(function: roleMessages, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <RoleMessagesEventName>_.get(event, ['name']) ?? 'Unknown';
    const theRoleRoleId = <RoleMessagesEventRoleRoleId>_.get(event, ['role', 'role-id']);
    const theDirection = <RoleMessagesEventDirection>_.get(event, ['direction']);
    const thePayload = <RoleMessagesEventPayload>_.get(event, ['payload']);
    const theChannelChannelId = <RoleMessagesEventChannelChannelId>_.get(event, ['channel', 'channel-id']);

    const channel = getTextBasedChannel(guild, theChannelChannelId);

    let payload: MessageOptions = {};

    // If "role-messages[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"role-messages[${eventKey}].name" is not configured properly`,
          `(function: roleMessages, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "role-messages[${eventKey}].role.role-id" is not configured properly.
    if (
      theRoleRoleId === undefined
      || guildRoles.resolve(theRoleRoleId) === null
    ) {
      generateLogMessage(
        [
          `"role-messages[${eventKey}].role.role-id" is not configured properly`,
          `(function: roleMessages, name: ${JSON.stringify(theName)}, role id: ${JSON.stringify(theRoleRoleId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "role-messages[${eventKey}].direction" is not configured properly.
    if (
      !_.isString(theDirection)
      || (
        theDirection !== 'add'
        && theDirection !== 'remove'
      )
    ) {
      generateLogMessage(
        [
          `"role-messages[${eventKey}].direction" is not configured properly`,
          `(function: roleMessages, name: ${JSON.stringify(theName)}, direction: ${JSON.stringify(theDirection)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "role-messages[${eventKey}].payload" is not configured properly.
    if (
      thePayload === undefined
      || !_.isPlainObject(thePayload)
      || _.isEmpty(thePayload)
    ) {
      generateLogMessage(
        [
          `"role-messages[${eventKey}].payload" is not configured properly`,
          `(function: roleMessages, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(thePayload)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "role-messages[${eventKey}].channel.channel-id" is not configured properly.
    if (
      channel === undefined
      || channel === null
    ) {
      generateLogMessage(
        [
          `"role-messages[${eventKey}].channel.channel-id" is not configured properly`,
          `(function: roleMessages, name: ${JSON.stringify(theName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    if (
      (
        theDirection === 'add' // If direction is add.
        && oldMemberRoles.resolve(theRoleRoleId) === null // Old member does not have role.
        && newMemberRoles.resolve(theRoleRoleId) !== null // New member has role.
      )
      || (
        theDirection === 'remove' // If direction is remove.
        && oldMemberRoles.resolve(theRoleRoleId) !== null // Old member has role.
        && newMemberRoles.resolve(theRoleRoleId) === null // New member does not have role.
      )
    ) {
      generateLogMessage(
        [
          'Passed role change match',
          `(function: roleMessages, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(newMember.toString())}, direction: ${JSON.stringify(theDirection)})`,
        ].join(' '),
        40,
      );

      payload = replaceVariables(thePayload);

      channel.send(payload).then((sendResponse) => {
        const sendResponseUrl = sendResponse.url;

        generateLogMessage(
          [
            'Sent message',
            `(function: roleMessages, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          40,
        );
      }).catch((error: Error) => generateLogMessage(
        [
          'Failed to send message',
          `(function: roleMessages, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(channel.toString())}, payload: ${JSON.stringify(payload)})`,
        ].join(' '),
        10,
        error,
      ));
    } else {
      generateLogMessage(
        [
          'Failed role change match',
          `(function: roleMessages, name: ${JSON.stringify(theName)}, member: ${JSON.stringify(newMember.toString())}, direction: ${JSON.stringify(theDirection)})`,
        ].join(' '),
        40,
      );
    }
  });
}

/**
 * Sync roles.
 *
 * @param {SyncRolesMember}   member   - Member.
 * @param {SyncRolesGuild}    guild    - Guild.
 * @param {SyncRolesSettings} settings - Settings.
 *
 * @returns {SyncRolesReturns}
 *
 * @since 1.0.0
 */
export function syncRoles(member: SyncRolesMember, guild: SyncRolesGuild, settings: SyncRolesSettings): SyncRolesReturns {
  const memberId = member.id;
  const memberRoles = member.roles;

  const guildRoles = guild.roles;

  const settingsTimeout = <SyncRolesSettingsTimeout>_.get(settings, ['timeout']);
  const settingsEvents = <SyncRolesSettingsEvents>_.get(settings, ['events']);

  // If "sync-roles" is not configured.
  if (settings === undefined) {
    generateLogMessage(
      [
        '"sync-roles" is not configured',
        `(function: syncRoles, settings: ${JSON.stringify(settings)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "sync-roles.timeout" is not configured properly.
  if (
    !_.isNumber(settingsTimeout)
    || !_.isFinite(settingsTimeout)
  ) {
    generateLogMessage(
      [
        '"sync-roles.timeout" is not configured properly',
        `(function: syncRoles, timeout: ${JSON.stringify(settingsTimeout)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // If "sync-roles.events" is not configured properly.
  if (
    !_.isArray(settingsEvents)
    || _.isEmpty(settingsEvents)
    || !_.every(settingsEvents, (settingsEvent) => _.isPlainObject(settingsEvent) && !_.isEmpty(settingsEvent))
  ) {
    generateLogMessage(
      [
        '"sync-roles.events" is not configured properly',
        `(function: syncRoles, events: ${JSON.stringify(settingsEvents)})`,
      ].join(' '),
      10,
    );

    return;
  }

  // Only a single role sync process allowed per member.
  if (memorySyncRoles[memberId] !== undefined) {
    clearTimeout(memorySyncRoles[memberId]);
  }

  memorySyncRoles[memberId] = setTimeout(() => {
    settingsEvents.forEach((settingsEvent, settingsEventKey) => {
      const theName = <SyncRolesSettingsEventName>_.get(settingsEvent, ['name']) ?? 'Unknown';
      const theSomeRoles = <SyncRolesSettingsEventSomeRoles>_.get(settingsEvent, ['some-roles']);
      const theHasSomeRoles = <SyncRolesSettingsEventHasSomeRoles>_.get(settingsEvent, ['has-some-roles']);
      const theToAddRoles = <SyncRolesSettingsEventToAddRoles>_.get(settingsEvent, ['to-add-roles']);
      const theToRemoveRoles = <SyncRolesSettingsEventToRemoveRoles>_.get(settingsEvent, ['to-remove-roles']);

      const someRoleIds = _.map(theSomeRoles, (theSomeRole) => <SyncRolesSettingsEventSomeRoleRoleId>_.get(theSomeRole, ['role-id']));
      const toAddRoleIds = _.map(theToAddRoles, (theToAddRole) => <SyncRolesSettingsEventToAddRoleRoleId>_.get(theToAddRole, ['role-id']));
      const toRemoveRoleIds = _.map(theToRemoveRoles, (theToRemoveRole) => <SyncRolesSettingsEventToRemoveRoleRoleId>_.get(theToRemoveRole, ['role-id']));

      // If "sync-roles[${settingsEventKey}].name" is not configured properly.
      if (
        !_.isString(theName)
        || _.isEmpty(theName)
      ) {
        generateLogMessage(
          [
            `"sync-roles[${settingsEventKey}].name" is not configured properly`,
            `(function: syncRoles, name: ${JSON.stringify(theName)})`,
          ].join(' '),
          10,
        );

        return;
      }

      // If "sync-roles[${settingsEventKey}].some-roles" is not configured properly.
      if (
        !_.isArray(theSomeRoles)
        || _.isEmpty(theSomeRoles)
        || !_.every(theSomeRoles, (theSomeRole) => _.isPlainObject(theSomeRole) && !_.isEmpty(theSomeRole))
        || !_.every(someRoleIds, (someRoleId) => someRoleId !== undefined && guildRoles.resolve(someRoleId) !== null)
      ) {
        generateLogMessage(
          [
            `"sync-roles[${settingsEventKey}].some-roles" is not configured properly`,
            `(function: syncRoles, name: ${JSON.stringify(theName)}, some roles: ${JSON.stringify(theSomeRoles)})`,
          ].join(' '),
          10,
        );

        return;
      }

      // If "sync-roles[${settingsEventKey}].has-some-roles" is not configured properly.
      if (!_.isBoolean(theHasSomeRoles)) {
        generateLogMessage(
          [
            `"sync-roles[${settingsEventKey}].has-some-roles" is not configured properly`,
            `(function: syncRoles, name: ${JSON.stringify(theName)}, has some roles: ${JSON.stringify(theHasSomeRoles)})`,
          ].join(' '),
          10,
        );

        return;
      }

      // If "sync-roles[${settingsEventKey}].to-add-roles" and "sync-roles[${settingsEventKey}].to-remove-roles" is not configured properly.
      if (
        (
          theToAddRoles === undefined
          && theToRemoveRoles === undefined
        )
        || (
          theToAddRoles !== undefined
          && theToRemoveRoles !== undefined
        )
      ) {
        generateLogMessage(
          [
            `"sync-roles[${settingsEventKey}].to-add-roles" and "sync-roles[${settingsEventKey}].to-remove-roles" is not configured properly`,
            `(function: syncRoles, name: ${JSON.stringify(theName)}, to add roles: ${JSON.stringify(theToAddRoles)}, to remove roles: ${JSON.stringify(theToRemoveRoles)})`,
          ].join(' '),
          40,
        );

        return;
      }

      // If "sync-roles[${settingsEventKey}].to-add-roles" is not configured properly.
      if (
        theToAddRoles !== undefined
        && (
          !_.isArray(theToAddRoles)
          || _.isEmpty(theToAddRoles)
          || !_.every(theToAddRoles, (theToAddRole) => _.isPlainObject(theToAddRole) && !_.isEmpty(theToAddRole))
          || !_.every(toAddRoleIds, (toAddRoleId) => toAddRoleId !== undefined && guildRoles.resolve(toAddRoleId) !== null)
        )
      ) {
        generateLogMessage(
          [
            `"sync-roles[${settingsEventKey}].to-add-roles" is not configured properly`,
            `(function: syncRoles, name: ${JSON.stringify(theName)}, to add roles: ${JSON.stringify(theToAddRoles)})`,
          ].join(' '),
          10,
        );

        return;
      }

      // If "sync-roles[${settingsEventKey}].to-remove-roles" is not configured properly.
      if (
        theToRemoveRoles !== undefined
        && (
          !_.isArray(theToRemoveRoles)
          || _.isEmpty(theToRemoveRoles)
          || !_.every(theToRemoveRoles, (theToRemoveRole) => _.isPlainObject(theToRemoveRole) && !_.isEmpty(theToRemoveRole))
          || !_.every(toRemoveRoleIds, (toRemoveRoleId) => toRemoveRoleId !== undefined && guildRoles.resolve(toRemoveRoleId) !== null)
        )
      ) {
        generateLogMessage(
          [
            `"sync-roles[${settingsEventKey}].to-remove-roles" is not configured properly`,
            `(function: syncRoles, name: ${JSON.stringify(theName)}, to remove roles: ${JSON.stringify(theToRemoveRoles)})`,
          ].join(' '),
          10,
        );

        return;
      }

      if (
        (
          theHasSomeRoles
          && _.some(someRoleIds, (someRoleId) => someRoleId !== undefined && memberRoles.resolve(someRoleId) !== null) // If user has some of the roles.
        )
        || (
          !theHasSomeRoles
          && !_.some(someRoleIds, (someRoleId) => someRoleId !== undefined && memberRoles.resolve(someRoleId) !== null) // If user does not have some of the roles.
        )
      ) {
        if (
          theToAddRoles !== undefined
          && _.isArray(theToAddRoles)
          && !_.isEmpty(theToAddRoles)
          && _.every(theToAddRoles, (theToAddRole) => _.isPlainObject(theToAddRole) && !_.isEmpty(theToAddRole))
          && _.every(toAddRoleIds, (toAddRoleId) => _.isString(toAddRoleId) && !_.isEmpty(toAddRoleId))
          && !_.some(toAddRoleIds, (toAddRoleId) => toAddRoleId !== undefined && memberRoles.resolve(toAddRoleId) !== null) // If user does not have some of the roles being added.
        ) {
          memberRoles.add(
            _.filter(toAddRoleIds, _.isString),
            theName,
          ).then(() => generateLogMessage(
            [
              'Added roles',
              `(function: syncRoles, name: ${JSON.stringify(theName)}, has some roles: ${JSON.stringify(theHasSomeRoles)}, member: ${JSON.stringify(member.toString())}, roles: ${JSON.stringify(theToAddRoles)})`,
            ].join(' '),
            40,
          )).catch((error: Error) => generateLogMessage(
            [
              'Failed to add roles',
              `(function: syncRoles, name: ${JSON.stringify(theName)}, has some roles: ${JSON.stringify(theHasSomeRoles)}, member: ${JSON.stringify(member.toString())}, roles: ${JSON.stringify(theToAddRoles)})`,
            ].join(' '),
            10,
            error,
          ));
        }

        if (
          theToRemoveRoles !== undefined
          && _.isArray(theToRemoveRoles)
          && !_.isEmpty(theToRemoveRoles)
          && _.every(theToRemoveRoles, (theToRemoveRole) => _.isPlainObject(theToRemoveRole) && !_.isEmpty(theToRemoveRole))
          && _.every(toRemoveRoleIds, (toRemoveRoleId) => _.isString(toRemoveRoleId) && !_.isEmpty(toRemoveRoleId))
          && _.some(toRemoveRoleIds, (toRemoveRoleId) => toRemoveRoleId !== undefined && memberRoles.resolve(toRemoveRoleId) !== null) // If user has some of the roles being removed.
        ) {
          memberRoles.remove(
            _.filter(toRemoveRoleIds, _.isString),
            theName,
          ).then(() => generateLogMessage(
            [
              'Removed roles',
              `(function: syncRoles, name: ${JSON.stringify(theName)}, has some roles: ${JSON.stringify(theHasSomeRoles)}, member: ${JSON.stringify(member.toString())}, roles: ${JSON.stringify(theToRemoveRoles)})`,
            ].join(' '),
            40,
          )).catch((error: Error) => generateLogMessage(
            [
              'Failed to remove roles',
              `(function: syncRoles, name: ${JSON.stringify(theName)}, has some roles: ${JSON.stringify(theHasSomeRoles)}, member: ${JSON.stringify(member.toString())}, roles: ${JSON.stringify(theToRemoveRoles)})`,
            ].join(' '),
            10,
            error,
          ));
        }
      }
    });
  }, settingsTimeout * 1000);
}
