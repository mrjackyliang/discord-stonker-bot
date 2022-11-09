import { GuildScheduledEventEntityType, GuildScheduledEventStatus } from 'discord.js';
import _ from 'lodash';
import numeral from 'numeral';

import { fetchFormattedDate, fetchIdentifier, generateLogMessage } from '../lib/utility.js';
import {
  BroadcastAlertsEventCreatorUserId,
  BroadcastAlertsEventEntityTypes,
  BroadcastAlertsEventMessage,
  BroadcastAlertsEventName,
  BroadcastAlertsEvents,
  BroadcastAlertsEventStatus,
  BroadcastAlertsGuild,
  BroadcastAlertsInstance,
  BroadcastAlertsReplaceVariablesConfigMessage,
  BroadcastAlertsReplaceVariablesReturns,
  BroadcastAlertsReturns,
  BroadcastAlertsTwitterClient,
  BroadcastAlertsViaGuildScheduledEventCreateEvents,
  BroadcastAlertsViaGuildScheduledEventCreateGenerateInstanceReturns,
  BroadcastAlertsViaGuildScheduledEventCreateGuild,
  BroadcastAlertsViaGuildScheduledEventCreateReturns,
  BroadcastAlertsViaGuildScheduledEventCreateScheduledEvent,
  BroadcastAlertsViaGuildScheduledEventCreateTwitterClient,
  BroadcastAlertsViaGuildScheduledEventDeleteEvents,
  BroadcastAlertsViaGuildScheduledEventDeleteGuild,
  BroadcastAlertsViaGuildScheduledEventDeleteReturns,
  BroadcastAlertsViaGuildScheduledEventDeleteScheduledEvent,
  BroadcastAlertsViaGuildScheduledEventDeleteTwitterClient,
  BroadcastAlertsViaGuildScheduledEventUpdateEvents,
  BroadcastAlertsViaGuildScheduledEventUpdateGenerateInstanceReturns,
  BroadcastAlertsViaGuildScheduledEventUpdateGuild,
  BroadcastAlertsViaGuildScheduledEventUpdateNewScheduledEvent,
  BroadcastAlertsViaGuildScheduledEventUpdateOldScheduledEvent,
  BroadcastAlertsViaGuildScheduledEventUpdateReturns,
  BroadcastAlertsViaGuildScheduledEventUpdateTwitterClient,
  ConvertEventEntityTypeEnumeration,
  ConvertEventEntityTypeReturns,
  ConvertEventStatusEnumeration,
  ConvertEventStatusReturns,
} from '../types/index.js';

/**
 * Convert event entity type.
 *
 * @param {ConvertEventEntityTypeEnumeration} enumeration - Enumeration.
 *
 * @returns {ConvertEventEntityTypeReturns}
 *
 * @since 1.0.0
 */
export function convertEventEntityType(enumeration: ConvertEventEntityTypeEnumeration): ConvertEventEntityTypeReturns {
  switch (enumeration) {
    case GuildScheduledEventEntityType.External:
      return 'EXTERNAL';
    case GuildScheduledEventEntityType.StageInstance:
      return 'STAGE_INSTANCE';
    case GuildScheduledEventEntityType.Voice:
      return 'VOICE';
    default:
      return null;
  }
}

/**
 * Convert event status.
 *
 * @param {ConvertEventStatusEnumeration} enumeration - Enumeration.
 *
 * @returns {ConvertEventStatusReturns}
 *
 * @since 1.0.0
 */
export function convertEventStatus(enumeration: ConvertEventStatusEnumeration): ConvertEventStatusReturns {
  switch (enumeration) {
    case GuildScheduledEventStatus.Scheduled:
      return 'SCHEDULED';
    case GuildScheduledEventStatus.Active:
      return 'ACTIVE';
    case GuildScheduledEventStatus.Canceled:
      return 'CANCELED';
    case GuildScheduledEventStatus.Completed:
      return 'COMPLETED';
    default:
      return null;
  }
}

/**
 * Broadcast alerts.
 *
 * @param {BroadcastAlertsInstance}      instance      - Instance.
 * @param {BroadcastAlertsTwitterClient} twitterClient - Twitter client.
 * @param {BroadcastAlertsGuild}         guild         - Guild.
 * @param {BroadcastAlertsEvents}        events        - Events.
 *
 * @returns {BroadcastAlertsReturns}
 *
 * @since 1.0.0
 */
export function broadcastAlerts(instance: BroadcastAlertsInstance, twitterClient: BroadcastAlertsTwitterClient, guild: BroadcastAlertsGuild, events: BroadcastAlertsEvents): BroadcastAlertsReturns {
  if (
    instance.creator === null
    || instance.entityType === null
    || instance.scheduledStartAt === null
  ) {
    generateLogMessage(
      [
        'Failed to invoke function',
        `(function: broadcastAlerts, creator: ${JSON.stringify(fetchIdentifier(instance.creator))}, entity type: ${JSON.stringify(instance.entityType)}, scheduled start at: ${JSON.stringify(instance.scheduledStartAt)})`,
      ].join(' '),
      10,
    );

    return;
  }

  generateLogMessage(
    [
      'Invoked function',
      `(function: broadcastAlerts, creator: ${JSON.stringify(fetchIdentifier(instance.creator))}, entity type: ${JSON.stringify(instance.entityType)}, scheduled start at: ${JSON.stringify(instance.scheduledStartAt)})`,
    ].join(' '),
    40,
  );

  const instanceChannel = instance.channel;
  const instanceCreatorId = instance.creator.id;
  const instanceCreatorTag = instance.creator.tag;
  const instanceDescription = instance.description;
  const instanceEntityType = instance.entityType;
  const instanceLocation = instance.location;
  const instanceName = instance.name;
  const instanceScheduledEndAt = instance.scheduledEndAt;
  const instanceScheduledStartAt = instance.scheduledStartAt;
  const instanceStatus = instance.status;
  const instanceUserCount = instance.userCount;

  const guildMembers = guild.members;

  /**
   * Broadcast alerts - Replace variables.
   *
   * @param {BroadcastAlertsReplaceVariablesConfigMessage} configMessage - Config message.
   *
   * @returns {BroadcastAlertsReplaceVariablesReturns}
   *
   * @since 1.0.0
   */
  const replaceVariables = (configMessage: BroadcastAlertsReplaceVariablesConfigMessage): BroadcastAlertsReplaceVariablesReturns => {
    let channelTag;
    let description;
    let location;
    let scheduledTime;
    let userCount;

    if (instanceChannel !== null) {
      channelTag = instanceChannel.name;
    } else {
      channelTag = 'No channel tag';
    }

    if (instanceDescription !== null) {
      description = instanceDescription;
    } else {
      description = 'No description';
    }

    if (instanceLocation !== null) {
      location = instanceLocation;
    } else {
      location = 'No location';
    }

    if (instanceScheduledEndAt !== null) {
      const startIsoDate = fetchFormattedDate('date', instanceScheduledStartAt, 'config', 'yyyy-LL-dd');
      const endIsoDate = fetchFormattedDate('date', instanceScheduledEndAt, 'config', 'yyyy-LL-dd');
      const sameIsoDates = startIsoDate === endIsoDate;

      scheduledTime = [
        fetchFormattedDate('date', instanceScheduledStartAt, 'config', 'ccc, LLL d'),
        fetchFormattedDate('date', instanceScheduledStartAt, 'config', 'h:mm a'),
        'to',
        ...(!sameIsoDates) ? [fetchFormattedDate('date', instanceScheduledEndAt, 'config', 'ccc, LLL d')] : [],
        fetchFormattedDate('date', instanceScheduledEndAt, 'config', 'h:mm a ZZZZ'),
      ].join(' ');
    } else {
      scheduledTime = [
        fetchFormattedDate('date', instanceScheduledStartAt, 'config', 'ccc, LLL d'),
        fetchFormattedDate('date', instanceScheduledStartAt, 'config', 'h:mm a ZZZZ'),
      ].join(' ');
    }

    if (instanceUserCount !== null) {
      userCount = numeral(instanceUserCount).format('0,0');
    } else {
      userCount = 'No user count';
    }

    return configMessage
      .replace(/%CHANNEL_TAG%/g, channelTag)
      .replace(/%CREATOR_TAG%/g, instanceCreatorTag)
      .replace(/%EVENT_DESCRIPTION%/g, description)
      .replace(/%EVENT_NAME%/g, instanceName)
      .replace(/%LOCATION%/g, location)
      .replace(/%SCHEDULED_TIME%/g, scheduledTime)
      .replace(/%USER_COUNT%/g, userCount);
  };

  // If "broadcast-alerts" is not configured.
  if (events === undefined) {
    generateLogMessage(
      [
        '"broadcast-alerts" is not configured',
        `(function: broadcastAlerts, events: ${JSON.stringify(events)})`,
      ].join(' '),
      40,
    );

    return;
  }

  // If "broadcast-alerts" is not configured properly.
  if (
    !_.isArray(events)
    || _.isEmpty(events)
    || !_.every(events, (event) => _.isPlainObject(event) && !_.isEmpty(event))
  ) {
    generateLogMessage(
      [
        '"broadcast-alerts" is not configured properly',
        `(function: broadcastAlerts, events: ${JSON.stringify(events)})`,
      ].join(' '),
      10,
    );

    return;
  }

  events.forEach((event, eventKey) => {
    const theName = <BroadcastAlertsEventName>_.get(event, ['name']) ?? 'Unknown';
    const theStatus = <BroadcastAlertsEventStatus>_.get(event, ['status']);
    const theEntityTypes = <BroadcastAlertsEventEntityTypes>_.get(event, ['entity-types']);
    const theCreatorUserId = <BroadcastAlertsEventCreatorUserId>_.get(event, ['creator', 'user-id']);
    const theMessage = <BroadcastAlertsEventMessage>_.get(event, ['message']);

    let payload: string = '';

    // If "broadcast-alerts[${eventKey}].name" is not configured properly.
    if (
      !_.isString(theName)
      || _.isEmpty(theName)
    ) {
      generateLogMessage(
        [
          `"broadcast-alerts[${eventKey}].name" is not configured properly`,
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "broadcast-alerts[${eventKey}].status" is not configured properly.
    if (
      theStatus !== 'SCHEDULED'
      && theStatus !== 'UPDATED'
      && theStatus !== 'ACTIVE'
      && theStatus !== 'COMPLETED'
      && theStatus !== 'CANCELED'
    ) {
      generateLogMessage(
        [
          `"broadcast-alerts[${eventKey}].status" is not configured properly`,
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, status: ${JSON.stringify(theStatus)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "broadcast-alerts[${eventKey}].entity-types" is not configured properly.
    if (
      !_.isArray(theEntityTypes)
      || _.isEmpty(theEntityTypes)
      || !_.every(theEntityTypes, (theEntityType) => theEntityType === 'STAGE_INSTANCE' || theEntityType === 'VOICE' || theEntityType === 'EXTERNAL')
    ) {
      generateLogMessage(
        [
          `"broadcast-alerts[${eventKey}].entity-types" is not configured properly`,
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, entity types: ${JSON.stringify(theEntityTypes)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "broadcast-alerts[${eventKey}].creator.user-id" is not configured properly.
    if (
      theCreatorUserId === undefined
      || guildMembers.resolve(theCreatorUserId) === null
    ) {
      generateLogMessage(
        [
          `"broadcast-alerts[${eventKey}].creator.user-id" is not configured properly`,
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, user id: ${JSON.stringify(theCreatorUserId)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If "broadcast-alerts[${eventKey}].message" is not configured properly.
    if (
      !_.isString(theMessage)
      || _.isEmpty(theMessage)
    ) {
      generateLogMessage(
        [
          `"broadcast-alerts[${eventKey}].message" is not configured properly`,
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, message: ${JSON.stringify(theMessage)})`,
        ].join(' '),
        10,
      );

      return;
    }

    // If status, entity types, or creator does not match.
    if (
      theStatus !== instanceStatus
      || !theEntityTypes.includes(instanceEntityType)
      || theCreatorUserId !== instanceCreatorId
    ) {
      generateLogMessage(
        [
          'Skipped task',
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, status: ${JSON.stringify(theStatus)}, entity types: ${JSON.stringify(theEntityTypes)}, user id: ${JSON.stringify(theCreatorUserId)}, current status: ${JSON.stringify(instanceStatus)}, current entity type: ${JSON.stringify(instanceEntityType)}, current user id: ${JSON.stringify(instanceCreatorId)})`,
        ].join(' '),
        40,
      );

      return;
    }

    generateLogMessage(
      [
        'Continued task',
        `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, status: ${JSON.stringify(theStatus)}, entity types: ${JSON.stringify(theEntityTypes)}, user id: ${JSON.stringify(theCreatorUserId)}, current status: ${JSON.stringify(instanceStatus)}, current entity type: ${JSON.stringify(instanceEntityType)}, current user id: ${JSON.stringify(instanceCreatorId)})`,
      ].join(' '),
      40,
    );

    payload = replaceVariables(theMessage);

    // If Twitter client not configured.
    if (twitterClient === undefined) {
      generateLogMessage(
        [
          'Twitter client not configured',
          `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, twitter client: ${JSON.stringify(twitterClient)})`,
        ].join(' '),
        10,
      );

      return;
    }

    generateLogMessage(
      [
        'Twitter client configured',
        `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, twitter client: ${JSON.stringify(twitterClient)})`,
      ].join(' '),
      40,
    );

    twitterClient.v2.tweet(payload).then(() => generateLogMessage(
      [
        'Sent tweet',
        `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      40,
    )).catch((error: Error) => generateLogMessage(
      [
        'Failed to send tweet',
        `(function: broadcastAlerts, name: ${JSON.stringify(theName)}, payload: ${JSON.stringify(payload)})`,
      ].join(' '),
      10,
      error,
    ));
  });
}

/**
 * Broadcast alerts via "guildScheduledEventCreate".
 *
 * @param {BroadcastAlertsViaGuildScheduledEventCreateScheduledEvent} scheduledEvent - Scheduled event.
 * @param {BroadcastAlertsViaGuildScheduledEventCreateTwitterClient}  twitterClient  - Twitter client.
 * @param {BroadcastAlertsViaGuildScheduledEventCreateGuild}          guild          - Guild.
 * @param {BroadcastAlertsViaGuildScheduledEventCreateEvents}         events         - Events.
 *
 * @returns {BroadcastAlertsViaGuildScheduledEventCreateReturns}
 *
 * @since 1.0.0
 */
export function broadcastAlertsViaGuildScheduledEventCreate(scheduledEvent: BroadcastAlertsViaGuildScheduledEventCreateScheduledEvent, twitterClient: BroadcastAlertsViaGuildScheduledEventCreateTwitterClient, guild: BroadcastAlertsViaGuildScheduledEventCreateGuild, events: BroadcastAlertsViaGuildScheduledEventCreateEvents): BroadcastAlertsViaGuildScheduledEventCreateReturns {
  const scheduledEventChannel = scheduledEvent.channel;
  const scheduledEventCreator = scheduledEvent.creator;
  const scheduledEventDescription = scheduledEvent.description;
  const scheduledEventEntityType = scheduledEvent.entityType;
  const scheduledEventEntityMetadata = scheduledEvent.entityMetadata;
  const scheduledEventName = scheduledEvent.name;
  const scheduledEventScheduledEndAt = scheduledEvent.scheduledEndAt;
  const scheduledEventScheduledStartAt = scheduledEvent.scheduledStartAt;
  const scheduledEventUrl = scheduledEvent.url;

  /**
   * Broadcast alerts via "guildScheduledEventCreate" - Generate instance.
   *
   * @returns {BroadcastAlertsViaGuildScheduledEventCreateGenerateInstanceReturns}
   *
   * @since 1.0.0
   */
  const generateInstance = async (): BroadcastAlertsViaGuildScheduledEventCreateGenerateInstanceReturns => {
    const instance: BroadcastAlertsInstance = {
      channel: scheduledEventChannel,
      creator: scheduledEventCreator,
      description: scheduledEventDescription,
      entityType: convertEventEntityType(scheduledEventEntityType),
      location: (scheduledEventEntityMetadata !== null) ? scheduledEventEntityMetadata.location : null,
      name: scheduledEventName,
      scheduledEndAt: scheduledEventScheduledEndAt,
      scheduledStartAt: scheduledEventScheduledStartAt,
      status: 'SCHEDULED',
      userCount: null,
    };

    try {
      const subscribers = await scheduledEvent.fetchSubscribers();
      const subscribersSize = subscribers.size;

      generateLogMessage(
        [
          'Fetched subscribers size',
          `(function: broadcastAlertsViaGuildScheduledEventCreate, scheduled event url: ${JSON.stringify(scheduledEventUrl)}, subscribers size: ${JSON.stringify(subscribersSize)})`,
        ].join(' '),
        40,
      );

      return _.assign(instance, {
        userCount: subscribersSize,
      });
    } catch (error) {
      generateLogMessage(
        [
          'Failed to fetch subscribers size',
          `(function: broadcastAlertsViaGuildScheduledEventCreate, scheduled event url: ${JSON.stringify(scheduledEventUrl)})`,
        ].join(' '),
        10,
        error,
      );

      return instance;
    }
  };

  generateInstance().then((generateInstanceResponse) => {
    broadcastAlerts(generateInstanceResponse, twitterClient, guild, events);
  });
}

/**
 * Broadcast alerts via "guildScheduledEventUpdate".
 *
 * @param {BroadcastAlertsViaGuildScheduledEventUpdateOldScheduledEvent} oldScheduledEvent - Scheduled event (old).
 * @param {BroadcastAlertsViaGuildScheduledEventUpdateNewScheduledEvent} newScheduledEvent - Scheduled event (new).
 * @param {BroadcastAlertsViaGuildScheduledEventUpdateTwitterClient}     twitterClient     - Twitter client.
 * @param {BroadcastAlertsViaGuildScheduledEventUpdateGuild}             guild             - Guild.
 * @param {BroadcastAlertsViaGuildScheduledEventUpdateEvents}            events            - Events.
 *
 * @returns {BroadcastAlertsViaGuildScheduledEventUpdateReturns}
 *
 * @since 1.0.0
 */
export function broadcastAlertsViaGuildScheduledEventUpdate(oldScheduledEvent: BroadcastAlertsViaGuildScheduledEventUpdateOldScheduledEvent, newScheduledEvent: BroadcastAlertsViaGuildScheduledEventUpdateNewScheduledEvent, twitterClient: BroadcastAlertsViaGuildScheduledEventUpdateTwitterClient, guild: BroadcastAlertsViaGuildScheduledEventUpdateGuild, events: BroadcastAlertsViaGuildScheduledEventUpdateEvents): BroadcastAlertsViaGuildScheduledEventUpdateReturns {
  const oldScheduledEventStatus = oldScheduledEvent.status;

  const newScheduledEventChannel = newScheduledEvent.channel;
  const newScheduledEventCreator = newScheduledEvent.creator;
  const newScheduledEventDescription = newScheduledEvent.description;
  const newScheduledEventEntityType = newScheduledEvent.entityType;
  const newScheduledEventEntityMetadata = newScheduledEvent.entityMetadata;
  const newScheduledEventName = newScheduledEvent.name;
  const newScheduledEventScheduledEndAt = newScheduledEvent.scheduledEndAt;
  const newScheduledEventScheduledStartAt = newScheduledEvent.scheduledStartAt;
  const newScheduledEventStatus = newScheduledEvent.status;
  const newScheduledEventUrl = newScheduledEvent.url;

  /**
   * Broadcast alerts via "guildScheduledEventUpdate" - Generate instance.
   *
   * @returns {BroadcastAlertsViaGuildScheduledEventUpdateGenerateInstanceReturns}
   *
   * @since 1.0.0
   */
  const generateInstance = async (): BroadcastAlertsViaGuildScheduledEventUpdateGenerateInstanceReturns => {
    const instance: BroadcastAlertsInstance = {
      channel: newScheduledEventChannel,
      creator: newScheduledEventCreator,
      description: newScheduledEventDescription,
      entityType: convertEventEntityType(newScheduledEventEntityType),
      location: (newScheduledEventEntityMetadata !== null) ? newScheduledEventEntityMetadata.location : null,
      name: newScheduledEventName,
      scheduledEndAt: newScheduledEventScheduledEndAt,
      scheduledStartAt: newScheduledEventScheduledStartAt,
      status: (oldScheduledEventStatus === newScheduledEventStatus) ? 'UPDATED' : convertEventStatus(newScheduledEventStatus),
      userCount: null,
    };

    try {
      const subscribers = await newScheduledEvent.fetchSubscribers();
      const subscribersSize = subscribers.size;

      generateLogMessage(
        [
          'Fetched subscribers size',
          `(function: broadcastAlertsViaGuildScheduledEventUpdate, scheduled event url: ${JSON.stringify(newScheduledEventUrl)}, subscribers size: ${JSON.stringify(subscribersSize)})`,
        ].join(' '),
        40,
      );

      return _.assign(instance, {
        userCount: subscribersSize,
      });
    } catch (error) {
      generateLogMessage(
        [
          'Failed to fetch subscribers size',
          `(function: broadcastAlertsViaGuildScheduledEventUpdate, scheduled event url: ${JSON.stringify(newScheduledEventUrl)})`,
        ].join(' '),
        10,
        error,
      );

      return instance;
    }
  };

  if (_.isEqual(oldScheduledEvent, newScheduledEvent)) {
    generateLogMessage(
      [
        'Skipped task',
        `(function: broadcastAlertsViaGuildScheduledEventUpdate, old scheduled event: ${JSON.stringify(oldScheduledEvent)}, new scheduled event: ${JSON.stringify(newScheduledEvent)})`,
      ].join(' '),
      40,
    );

    return;
  }

  generateLogMessage(
    [
      'Continued task',
      `(function: broadcastAlertsViaGuildScheduledEventUpdate, old scheduled event: ${JSON.stringify(oldScheduledEvent)}, new scheduled event: ${JSON.stringify(newScheduledEvent)})`,
    ].join(' '),
    40,
  );

  generateInstance().then((generateInstanceResponse) => {
    broadcastAlerts(generateInstanceResponse, twitterClient, guild, events);
  });
}

/**
 * Broadcast alerts via "guildScheduledEventDelete".
 *
 * @param {BroadcastAlertsViaGuildScheduledEventDeleteScheduledEvent} scheduledEvent - Scheduled event.
 * @param {BroadcastAlertsViaGuildScheduledEventDeleteTwitterClient}  twitterClient  - Twitter client.
 * @param {BroadcastAlertsViaGuildScheduledEventDeleteGuild}          guild          - Guild.
 * @param {BroadcastAlertsViaGuildScheduledEventDeleteEvents}         events         - Events.
 *
 * @returns {BroadcastAlertsViaGuildScheduledEventDeleteReturns}
 *
 * @since 1.0.0
 */
export function broadcastAlertsViaGuildScheduledEventDelete(scheduledEvent: BroadcastAlertsViaGuildScheduledEventDeleteScheduledEvent, twitterClient: BroadcastAlertsViaGuildScheduledEventDeleteTwitterClient, guild: BroadcastAlertsViaGuildScheduledEventDeleteGuild, events: BroadcastAlertsViaGuildScheduledEventDeleteEvents): BroadcastAlertsViaGuildScheduledEventDeleteReturns {
  const scheduledEventChannel = scheduledEvent.channel;
  const scheduledEventCreator = scheduledEvent.creator;
  const scheduledEventDescription = scheduledEvent.description;
  const scheduledEventEntityType = scheduledEvent.entityType;
  const scheduledEventEntityMetadata = scheduledEvent.entityMetadata;
  const scheduledEventName = scheduledEvent.name;
  const scheduledEventScheduledEndAt = scheduledEvent.scheduledEndAt;
  const scheduledEventScheduledStartAt = scheduledEvent.scheduledStartAt;

  const instance: BroadcastAlertsInstance = {
    channel: scheduledEventChannel,
    creator: scheduledEventCreator,
    description: scheduledEventDescription,
    entityType: convertEventEntityType(scheduledEventEntityType),
    location: (scheduledEventEntityMetadata !== null) ? scheduledEventEntityMetadata.location : null,
    name: scheduledEventName,
    scheduledEndAt: scheduledEventScheduledEndAt,
    scheduledStartAt: scheduledEventScheduledStartAt,
    status: 'CANCELED',
    userCount: null,
  };

  broadcastAlerts(instance, twitterClient, guild, events);
}
