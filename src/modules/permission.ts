import { MessageOptions } from 'discord.js';
import _ from 'lodash';
import cron from 'node-cron';

import { createCommandErrorEmbed, createTogglePermsEmbed } from '../lib/embed';
import {
  fetchFormattedDate,
  generateCron,
  generateLogMessage,
  getCategoryChannel,
  getTextBasedNonThreadChannel,
  getVoiceBasedChannel,
  isTimeZoneValid,
  memberHasPermissions,
} from '../lib/utility';
import {
  TogglePermsEventCommandAllowedRoleRoleId,
  TogglePermsEventCommandAllowedRoles,
  TogglePermsEventCommandBaseCommand,
  TogglePermsEventName,
  TogglePermsEvents,
  TogglePermsEventSkipDates,
  TogglePermsEventToggleChannelChannelId,
  TogglePermsEventToggleOn,
  TogglePermsEventToggleOnDates,
  TogglePermsEventToggleOnDaysOfWeek,
  TogglePermsEventToggleOnHours,
  TogglePermsEventToggleOnMinutes,
  TogglePermsEventToggleOnMonths,
  TogglePermsEventToggleOnSeconds,
  TogglePermsEventToggleOnTimeZone,
  TogglePermsEventTogglePermissions,
  TogglePermsEventTogglePermissionUserOrRoleId,
  TogglePermsEventTogglePermissionUserOrRolePerms,
  TogglePermsEventToggles,
  TogglePermsGuild,
  TogglePermsMessage,
  TogglePermsReturns,
  TogglePermsTogglerEventKey,
  TogglePermsTogglerEventName,
  TogglePermsTogglerEventToggles,
  TogglePermsTogglerReturns,
  TogglePermsTogglerUserTag,
} from '../types';
import { MemoryTogglePermsSchedules } from '../types/memory';

/**
 * Memory.
 *
 * @since 1.0.0
 */
const memoryTogglePermsSchedules: MemoryTogglePermsSchedules = {};

/**
 * Toggle perms.
 *
 * @param {TogglePermsMessage} message - Message.
 * @param {TogglePermsGuild}   guild   - Guild.
 * @param {TogglePermsEvents}  events  - Events.
 *
 * @returns {TogglePermsReturns}
 *
 * @since 1.0.0
 */
export function togglePerms(message: TogglePermsMessage, guild: TogglePermsGuild, events: TogglePermsEvents): TogglePermsReturns {
  const guildMembers = guild.members;
  const guildRoles = guild.roles;

  /**
   * Toggle perms - Toggler.
   *
   * @param {TogglePermsTogglerEventName}    eventName    - Event name.
   * @param {TogglePermsTogglerEventKey}     eventKey     - Event key.
   * @param {TogglePermsTogglerEventToggles} eventToggles - Event toggles.
   * @param {TogglePermsTogglerUserTag}      [userTag]    - User tag.
   *
   * @returns {TogglePermsTogglerReturns}
   *
   * @since 1.0.0
   */
  const toggler = async (eventName: TogglePermsTogglerEventName, eventKey: TogglePermsTogglerEventKey, eventToggles: TogglePermsTogglerEventToggles, userTag?: TogglePermsTogglerUserTag): TogglePermsTogglerReturns => {
    if (
      _.isArray(eventToggles)
      && !_.isEmpty(eventToggles)
      && _.every(eventToggles, (eventToggle) => _.isPlainObject(eventToggle) && !_.isEmpty(eventToggle))
    ) {
      const channelTasks = _.map(eventToggles, async (eventToggle, eventToggleKey) => {
        const theChannelChannelId = <TogglePermsEventToggleChannelChannelId>_.get(eventToggle, ['channel', 'channel-id']);
        const thePermissions = <TogglePermsEventTogglePermissions>_.get(eventToggle, ['permissions']);

        const channel = getCategoryChannel(guild, theChannelChannelId) ?? getTextBasedNonThreadChannel(guild, theChannelChannelId) ?? getVoiceBasedChannel(guild, theChannelChannelId);

        // If "toggle-perms[${eventKey}].toggles[${eventToggleKey}].channel.channel-id" is not configured properly.
        if (
          channel === undefined
          || channel === null
        ) {
          generateLogMessage(
            [
              `"toggle-perms[${eventKey}].toggles[${eventToggleKey}].channel.channel-id" is not configured properly`,
              `(function: togglePerms, name: ${JSON.stringify(eventName)}, channel id: ${JSON.stringify(theChannelChannelId)})`,
            ].join(' '),
            10,
          );

          return false;
        }

        // If "toggle-perms[${eventKey}].toggles[${eventToggleKey}].permissions" is not configured properly.
        if (
          !_.isArray(thePermissions)
          || _.isEmpty(thePermissions)
          || !_.every(thePermissions, (thePermission) => _.isPlainObject(thePermission) && !_.isEmpty(thePermission))
        ) {
          generateLogMessage(
            [
              `"toggle-perms[${eventKey}].toggles[${eventToggleKey}].permissions" is not configured properly`,
              `(function: togglePerms, name: ${JSON.stringify(eventName)}, permissions: ${JSON.stringify(thePermissions)})`,
            ].join(' '),
            10,
          );

          return false;
        }

        const userOrRoleTasks = _.map(thePermissions, async (thePermission, permissionKey) => {
          const theUserOrRoleId = <TogglePermsEventTogglePermissionUserOrRoleId>_.get(thePermission, ['user-or-role-id']);
          const theUserOrRolePerms = <TogglePermsEventTogglePermissionUserOrRolePerms>_.get(thePermission, ['user-or-role-perms']);

          // If "toggle-perms[${eventKey}].toggles[${eventToggleKey}].permissions[${permissionKey}].user-or-role-id" is not configured properly.
          if (
            theUserOrRoleId === undefined
            || (
              guildMembers.resolve(theUserOrRoleId) === null
              && guildRoles.resolve(theUserOrRoleId) === null
            )
          ) {
            generateLogMessage(
              [
                `"toggle-perms[${eventKey}].toggles[${eventToggleKey}].permissions[${permissionKey}].user-or-role-id" is not configured properly`,
                `(function: togglePerms, name: ${JSON.stringify(eventName)}, user or role id: ${JSON.stringify(theUserOrRoleId)})`,
              ].join(' '),
              10,
            );

            return false;
          }

          // If "toggle-perms[${eventKey}].toggles[${eventToggleKey}].permissions[${permissionKey}].user-or-role-perms" is not configured properly.
          if (
            theUserOrRolePerms === undefined
            || !_.isPlainObject(theUserOrRolePerms)
            || _.isEmpty(theUserOrRolePerms)
          ) {
            generateLogMessage(
              [
                `"toggle-perms[${eventKey}].toggles[${eventToggleKey}].permissions[${permissionKey}].user-or-role-perms" is not configured properly`,
                `(function: togglePerms, name: ${JSON.stringify(eventName)}, user or role perms: ${JSON.stringify(theUserOrRolePerms)})`,
              ].join(' '),
              10,
            );

            return false;
          }

          try {
            const channelPermissionOverwrites = channel.permissionOverwrites;

            await channelPermissionOverwrites.edit(
              theUserOrRoleId,
              theUserOrRolePerms,
              {
                reason: `${userTag ?? 'Stonker Bot'} toggled permissions`,
              },
            );

            generateLogMessage(
              [
                'Toggled permissions',
                `(function: togglePerms, name: ${JSON.stringify(eventName)}, user or role id: ${JSON.stringify(theUserOrRoleId)}, user or role perms: ${JSON.stringify(theUserOrRolePerms)})`,
              ].join(' '),
              40,
            );

            return true;
          } catch (error: unknown) {
            generateLogMessage(
              [
                'Failed to toggle permissions',
                `(function: togglePerms, name: ${JSON.stringify(eventName)}, user or role id: ${JSON.stringify(theUserOrRoleId)}, user or role perms: ${JSON.stringify(theUserOrRolePerms)})`,
              ].join(' '),
              10,
              error,
            );

            return false;
          }
        });

        return Promise.all(userOrRoleTasks);
      });

      return Promise.all(channelTasks);
    }

    return false;
  };

  // If "toggle-perms" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"toggle-perms" is not configured',
        `(function: togglePerms, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "toggle-perms" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"toggle-perms" is not configured properly',
        `(function: togglePerms, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <TogglePermsEventName>_.get(event, ['name']) ?? 'Unknown';
    const theCommandBaseCommands = <TogglePermsEventCommandBaseCommand>_.get(event, ['command', 'base-commands']);
    const theCommandAllowedRoles = <TogglePermsEventCommandAllowedRoles>_.get(event, ['command', 'allowed-roles']);
    const theToggleOn = <TogglePermsEventToggleOn>_.get(event, ['toggle-on']);
    const theToggleOnTimeZone = <TogglePermsEventToggleOnTimeZone>_.get(event, ['toggle-on', 'time-zone']);
    const theToggleOnDaysOfWeek = <TogglePermsEventToggleOnDaysOfWeek>_.get(event, ['toggle-on', 'days-of-week']);
    const theToggleOnMonths = <TogglePermsEventToggleOnMonths>_.get(event, ['toggle-on', 'months']);
    const theToggleOnDates = <TogglePermsEventToggleOnDates>_.get(event, ['toggle-on', 'dates']);
    const theToggleOnHours = <TogglePermsEventToggleOnHours>_.get(event, ['toggle-on', 'hours']);
    const theToggleOnMinutes = <TogglePermsEventToggleOnMinutes>_.get(event, ['toggle-on', 'minutes']);
    const theToggleOnSeconds = <TogglePermsEventToggleOnSeconds>_.get(event, ['toggle-on', 'seconds']);
    const theSkipDates = <TogglePermsEventSkipDates>_.get(event, ['skip-dates']);
    const theToggles = <TogglePermsEventToggles>_.get(event, ['toggles']);

    const allowedRoleIds = _.map(theCommandAllowedRoles, (theCommandAllowedRole) => <TogglePermsEventCommandAllowedRoleRoleId>_.get(theCommandAllowedRole, ['role-id']));
    const regExpIsoDate = /^\d{4}-\d{2}-\d{2}$/;

    let payload: MessageOptions = {};

    // If "toggle-perms[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].name" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].command.base-commands" and "toggle-perms[${eventKey}].toggle-on" is not configured properly.
    if (
      theCommandBaseCommands === undefined
      && theToggleOn === undefined
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].command.base-commands" and "toggle-perms[${eventKey}].toggle-on" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, base commands: ${JSON.stringify(theCommandBaseCommands)}, toggle on: ${JSON.stringify(theToggleOn)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].command.base-commands" is not configured properly.
    if (
      theCommandBaseCommands !== undefined
      && (
        !_.isArray(theCommandBaseCommands)
        || _.isEmpty(theCommandBaseCommands)
        || !_.every(theCommandBaseCommands, (theCommandBaseCommand) => _.isString(theCommandBaseCommand) && !_.isEmpty(theCommandBaseCommand))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].command.base-commands" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, base commands: ${JSON.stringify(theCommandBaseCommands)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].command.allowed-roles" is not configured properly.
    if (
      theCommandAllowedRoles !== undefined
      && (
        !_.isArray(theCommandAllowedRoles)
        || _.isEmpty(theCommandAllowedRoles)
        || !_.every(theCommandAllowedRoles, (theCommandAllowedRole) => _.isPlainObject(theCommandAllowedRole) && !_.isEmpty(theCommandAllowedRole))
        || !_.every(allowedRoleIds, (allowedRoleId) => allowedRoleId !== undefined && guildRoles.resolve(allowedRoleId) !== null)
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].command.allowed-roles" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, allowed roles: ${JSON.stringify(theCommandAllowedRoles)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on" is not configured properly.
    if (
      theToggleOn !== undefined
      && (
        !_.isPlainObject(theToggleOn)
        || _.isEmpty(theToggleOn)
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, toggle on: ${JSON.stringify(theToggleOn)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.time-zone" is not configured properly.
    if (
      theToggleOnTimeZone !== undefined
      && (
        !_.isString(theToggleOnTimeZone)
        || _.isEmpty(theToggleOnTimeZone)
        || !isTimeZoneValid(theToggleOnTimeZone)
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.time-zone" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, time zone: ${JSON.stringify(theToggleOnTimeZone)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.days-of-week" is not configured properly.
    if (
      theToggleOnDaysOfWeek !== undefined
      && (
        !_.isArray(theToggleOnDaysOfWeek)
        || _.isEmpty(theToggleOnDaysOfWeek)
        || !_.every(theToggleOnDaysOfWeek, (theToggleOnDayOfWeek) => _.isNumber(theToggleOnDayOfWeek) && _.inRange(theToggleOnDayOfWeek, 0, 7))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.days-of-week" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, days of week: ${JSON.stringify(theToggleOnDaysOfWeek)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.months" is not configured properly.
    if (
      theToggleOnMonths !== undefined
      && (
        !_.isArray(theToggleOnMonths)
        || _.isEmpty(theToggleOnMonths)
        || !_.every(theToggleOnMonths, (theToggleOnMonth) => _.isNumber(theToggleOnMonth) && _.inRange(theToggleOnMonth, 1, 13))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.months" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, months: ${JSON.stringify(theToggleOnMonths)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.dates" is not configured properly.
    if (
      theToggleOnDates !== undefined
      && (
        !_.isArray(theToggleOnDates)
        || _.isEmpty(theToggleOnDates)
        || !_.every(theToggleOnDates, (theToggleOnDate) => _.isNumber(theToggleOnDate) && _.inRange(theToggleOnDate, 1, 32))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.dates" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, dates: ${JSON.stringify(theToggleOnDates)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.hours" is not configured properly.
    if (
      theToggleOnHours !== undefined
      && (
        !_.isArray(theToggleOnHours)
        || _.isEmpty(theToggleOnHours)
        || !_.every(theToggleOnHours, (theToggleOnHour) => _.isNumber(theToggleOnHour) && _.inRange(theToggleOnHour, 0, 24))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.hours" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, hours: ${JSON.stringify(theToggleOnHours)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.minutes" is not configured properly.
    if (
      theToggleOnMinutes !== undefined
      && (
        !_.isArray(theToggleOnMinutes)
        || _.isEmpty(theToggleOnMinutes)
        || !_.every(theToggleOnMinutes, (theToggleOnMinute) => _.isNumber(theToggleOnMinute) && _.inRange(theToggleOnMinute, 0, 60))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.minutes" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, minutes: ${JSON.stringify(theToggleOnMinutes)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].toggle-on.seconds" is not configured properly.
    if (
      theToggleOnSeconds !== undefined
      && (
        !_.isArray(theToggleOnSeconds)
        || _.isEmpty(theToggleOnSeconds)
        || !_.every(theToggleOnSeconds, (theToggleOnSecond) => _.isNumber(theToggleOnSecond) && _.inRange(theToggleOnSecond, 0, 60))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].toggle-on.seconds" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, seconds: ${JSON.stringify(theToggleOnSeconds)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "toggle-perms[${eventKey}].skip-dates" is not configured properly.
    if (
      theSkipDates !== undefined
      && (
        !_.isArray(theSkipDates)
        || _.isEmpty(theSkipDates)
        || !_.every(theSkipDates, (theSkipDate) => theSkipDate !== undefined && regExpIsoDate.test(theSkipDate))
      )
    ) {
      generateLogMessage(
        [
          `"toggle-perms[${eventKey}].skip-dates" is not configured properly`,
          `(function: togglePerms, name: ${JSON.stringify(theName)}, skip dates: ${JSON.stringify(theSkipDates)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // Run scheduler.
    if (
      theToggleOn !== undefined
      && memoryTogglePermsSchedules[eventKey] === undefined
    ) {
      try {
        const rule = generateCron({
          'days-of-week': theToggleOnDaysOfWeek,
          months: theToggleOnMonths,
          dates: theToggleOnDates,
          hours: theToggleOnHours,
          minutes: theToggleOnMinutes,
          seconds: theToggleOnSeconds,
        });

        memoryTogglePermsSchedules[eventKey] = cron.schedule(rule, () => {
          const todaysDate = fetchFormattedDate('now', undefined, theToggleOnTimeZone, 'iso-date');

          // If today's date is a skipped date.
          if (
            theSkipDates !== undefined
            && _.isArray(theSkipDates)
            && !_.isEmpty(theSkipDates)
            && _.every(theSkipDates, (theSkipDate) => theSkipDate !== undefined && regExpIsoDate.test(theSkipDate))
            && theSkipDates.includes(todaysDate)
          ) {
            generateLogMessage(
              [
                'Skipped task',
                `(function: togglePerms, name: ${JSON.stringify(theName)}, skip dates: ${JSON.stringify(theSkipDates)}, today's date: ${JSON.stringify(todaysDate)})`,
              ].join(' '),
              40,
            );

            return;
          }

          generateLogMessage(
            [
              'Continued task',
              `(function: togglePerms, name: ${JSON.stringify(theName)}, skip dates: ${JSON.stringify(theSkipDates)}, today's date: ${JSON.stringify(todaysDate)})`,
            ].join(' '),
            40,
          );

          toggler(theName, eventKey, theToggles).then((toggleResponses) => {
            const answers = _.flattenDeep([toggleResponses]);
            const success = _.every(answers, (answer) => answer);

            if (success) {
              generateLogMessage(
                [
                  'Toggled all permissions',
                  `(function: togglePerms, name: ${JSON.stringify(theName)})`,
                ].join(' '),
                40,
              );
            } else {
              generateLogMessage(
                [
                  'Failed to toggle all permissions',
                  `(function: togglePerms, name: ${JSON.stringify(theName)})`,
                ].join(' '),
                10,
              );
            }
          });
        }, {
          recoverMissedExecutions: false,
          scheduled: true,
          timezone: theToggleOnTimeZone,
        });

        generateLogMessage(
          [
            'Initialized event',
            `(function: togglePerms, name: ${JSON.stringify(theName)})`,
          ].join(' '),
          30,
        );
      } catch (error) {
        generateLogMessage(
          [
            'Failed to initialize event',
            `(function: togglePerms, name: ${JSON.stringify(theName)}, toggle on: ${JSON.stringify(theToggleOn)})`,
          ].join(' '),
          10,
          error,
        );
      }
    }

    // Fetch command.
    if (
      message !== undefined
      && theCommandBaseCommands !== undefined
    ) {
      if (message.member === null) {
        generateLogMessage(
          [
            'Failed to process command',
            `(function: togglePerms, name: ${JSON.stringify(theName)})`,
          ].join(' '),
          10,
        );

        return;
      }

      generateLogMessage(
        [
          'Processed command',
          `(function: togglePerms, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        40,
      );

      const messageChannel = message.channel;
      const messageContent = message.content;
      const messageMember = message.member;
      const messageMemberUserTag = message.member.user.tag;

      if (!theCommandBaseCommands.includes(messageContent)) {
        generateLogMessage(
          [
            'Skipped task',
            `(function: togglePerms, name: ${JSON.stringify(theName)}, specified base commands: ${JSON.stringify(theCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
          ].join(' '),
          40,
        );

        return;
      }

      generateLogMessage(
        [
          'Continued task',
          `(function: togglePerms, name: ${JSON.stringify(theName)}, specified base commands: ${JSON.stringify(theCommandBaseCommands)}, current base command: ${JSON.stringify(messageContent)})`,
        ].join(' '),
        40,
      );

      if (!memberHasPermissions(messageMember, theCommandAllowedRoles)) {
        payload = {
          embeds: [
            createCommandErrorEmbed(
              `You do not have permissions to use the \`${messageContent}\` command.`,
              messageMemberUserTag,
            ),
          ],
          reply: {
            messageReference: message,
          },
        };

        messageChannel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: togglePerms, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: togglePerms, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));

        return;
      }

      toggler(theName, eventKey, theToggles, messageMemberUserTag).then((toggleResponses) => {
        const answers = _.flattenDeep([toggleResponses]);
        const success = _.every(answers, (answer) => answer);

        if (success) {
          payload = {
            embeds: [
              createTogglePermsEmbed(
                `Toggled preset permissions for **${theName}**.`,
                true,
                messageMemberUserTag,
              ),
            ],
            reply: {
              messageReference: message,
            },
          };
        } else {
          payload = {
            embeds: [
              createTogglePermsEmbed(
                [
                  `Failed to toggle one or more preset permissions for **${theName}**.`,
                  'Please check the logs and configuration file then try again.',
                ].join(' '),
                false,
                messageMemberUserTag,
              ),
            ],
            reply: {
              messageReference: message,
            },
          };
        }

        messageChannel.send(payload).then((sendResponse) => {
          const sendResponseUrl = sendResponse.url;

          generateLogMessage(
            [
              'Sent message',
              `(function: togglePerms, name: ${JSON.stringify(theName)}, message url: ${JSON.stringify(sendResponseUrl)}, payload: ${JSON.stringify(payload)})`,
            ].join(' '),
            40,
          );
        }).catch((error: Error) => generateLogMessage(
          [
            'Failed to send message',
            `(function: togglePerms, name: ${JSON.stringify(theName)}, channel: ${JSON.stringify(messageChannel.toString())}, payload: ${JSON.stringify(payload)})`,
          ].join(' '),
          10,
          error,
        ));
      });
    }
  });
}
