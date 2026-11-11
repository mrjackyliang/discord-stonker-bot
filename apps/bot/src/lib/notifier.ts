import { Events } from 'discord.js';
import { z } from 'zod';

import { enqueueDurableJob } from './database.js';
import {
  getErrorMessage,
  writeLog,
} from './logger.js';
import {
  listNotificationTargetIds,
  openNotificationTarget,
  recordNotificationAttempt,
} from './notification-targets.js';
import {
  buildEventNotification,
  buildSecretsRemovedNotification,
  buildSignInLockedNotification,
  buildTestNotification,
  commonNotificationEvents,
  sendNotification,
} from './notifications.js';

import type {
  Lib_Notifier_App,
  Lib_Notifier_DeliverNotificationJob_CredentialKey,
  Lib_Notifier_DeliverNotificationJob_Delivery,
  Lib_Notifier_DeliverNotificationJob_JobPayload,
  Lib_Notifier_DeliverNotificationJob_Payload,
  Lib_Notifier_DeliverNotificationJob_Pool,
  Lib_Notifier_DeliverNotificationJob_Result,
  Lib_Notifier_DeliverNotificationJob_Returns,
  Lib_Notifier_DeliverNotificationJob_Send,
  Lib_Notifier_FormatDuration_Hours,
  Lib_Notifier_FormatDuration_HourWord,
  Lib_Notifier_FormatDuration_Milliseconds,
  Lib_Notifier_FormatDuration_Minutes,
  Lib_Notifier_FormatDuration_MinuteWord,
  Lib_Notifier_FormatDuration_RemainingMinutes,
  Lib_Notifier_FormatDuration_Returns,
  Lib_Notifier_GatewayWatchers,
  Lib_Notifier_JobLabels,
  Lib_Notifier_JobPayloadSchema,
  Lib_Notifier_JobType,
  Lib_Notifier_Milliseconds,
  Lib_Notifier_NotificationEvents,
  Lib_Notifier_NotifyBotDisconnected_DownSince,
  Lib_Notifier_NotifyBotDisconnected_Pool,
  Lib_Notifier_NotifyBotDisconnected_Returns,
  Lib_Notifier_NotifyBotReconnected_DownSince,
  Lib_Notifier_NotifyBotReconnected_Pool,
  Lib_Notifier_NotifyBotReconnected_Returns,
  Lib_Notifier_NotifyBotReconnected_UpAt,
  Lib_Notifier_NotifyBotSignInFailed_Cause,
  Lib_Notifier_NotifyBotSignInFailed_Generation,
  Lib_Notifier_NotifyBotSignInFailed_Pool,
  Lib_Notifier_NotifyBotSignInFailed_Reason,
  Lib_Notifier_NotifyBotSignInFailed_Returns,
  Lib_Notifier_NotifyJobFailed_ErrorMessage,
  Lib_Notifier_NotifyJobFailed_Job,
  Lib_Notifier_NotifyJobFailed_Label,
  Lib_Notifier_NotifyJobFailed_Pool,
  Lib_Notifier_NotifyJobFailed_Returns,
  Lib_Notifier_NotifyJobFailed_RuleName,
  Lib_Notifier_NotifyJobFailed_Subject,
  Lib_Notifier_NotifySecretsRemoved_Items,
  Lib_Notifier_NotifySecretsRemoved_Pool,
  Lib_Notifier_NotifySecretsRemoved_Returns,
  Lib_Notifier_NotifySignInLocked_Address,
  Lib_Notifier_NotifySignInLocked_Key,
  Lib_Notifier_NotifySignInLocked_Now,
  Lib_Notifier_NotifySignInLocked_Pool,
  Lib_Notifier_NotifySignInLocked_Returns,
  Lib_Notifier_NotifySignInLocked_Window,
  Lib_Notifier_QueueNotification_Notification,
  Lib_Notifier_QueueNotification_Occurrence,
  Lib_Notifier_QueueNotification_Pool,
  Lib_Notifier_QueueNotification_Returns,
  Lib_Notifier_QueueNotification_TargetIds,
  Lib_Notifier_SendTestNotification_CredentialKey,
  Lib_Notifier_SendTestNotification_Delivery,
  Lib_Notifier_SendTestNotification_Pool,
  Lib_Notifier_SendTestNotification_Result,
  Lib_Notifier_SendTestNotification_Returns,
  Lib_Notifier_SendTestNotification_Send,
  Lib_Notifier_SendTestNotification_TargetId,
  Lib_Notifier_StopGatewayWatch_Client,
  Lib_Notifier_StopGatewayWatch_Returns,
  Lib_Notifier_StopGatewayWatch_Stop,
  Lib_Notifier_WatchGatewayConnection_Announced,
  Lib_Notifier_WatchGatewayConnection_Client,
  Lib_Notifier_WatchGatewayConnection_DownSince,
  Lib_Notifier_WatchGatewayConnection_GraceMilliseconds,
  Lib_Notifier_WatchGatewayConnection_MarkDown,
  Lib_Notifier_WatchGatewayConnection_MarkUp,
  Lib_Notifier_WatchGatewayConnection_Pool,
  Lib_Notifier_WatchGatewayConnection_Report,
  Lib_Notifier_WatchGatewayConnection_Returns,
  Lib_Notifier_WatchGatewayConnection_Stop,
  Lib_Notifier_WatchGatewayConnection_Stopped,
  Lib_Notifier_WatchGatewayConnection_Timer,
} from '../types/lib/notifier.d.ts';

/**
 * Notifier - Notification Job Type.
 *
 * Names the worker job that sends one notification to one destination.
 * These jobs never raise a Job gave up notification themselves.
 *
 * @since 4.0.0
 */
export const NOTIFICATION_JOB_TYPE: Lib_Notifier_JobType = 'notification.send';

/**
 * Notifier - Gateway Grace Milliseconds.
 *
 * Waits this long after the Gateway drops before calling the bot disconnected.
 * Discord resumes most drops on its own well within it.
 *
 * @since 4.0.0
 */
const GATEWAY_GRACE_MILLISECONDS: Lib_Notifier_Milliseconds = 60_000;

/**
 * Notifier - Sign In Lock Window Milliseconds.
 *
 * Matches the sign-in limiter's window, so an address is reported once per lockout.
 * Ten failures inside it pause sign-in from that address.
 *
 * @since 4.0.0
 */
const signInLockWindowMilliseconds: Lib_Notifier_Milliseconds = 15 * 60 * 1000;

/**
 * Notifier - Notification App.
 *
 * Names this app in notification titles and payloads.
 * The key also picks the matching ntfy-reverse-proxy interpreter.
 *
 * @since 4.0.0
 */
const notificationApp: Lib_Notifier_App = {
  key: 'discord-stonker-bot',
  name: 'Stonker Bot for Discord',
};

/**
 * Notifier - Job Labels.
 *
 * Describes each kind of worker job in a Job gave up notification.
 * Unknown kinds fall back to a general phrase.
 *
 * @since 4.0.0
 */
const jobLabels: Lib_Notifier_JobLabels = {
  'discord.message.send': 'A Discord message',
  'discord.permissions.apply': 'A permission change',
  'rss.feed.fetch': 'An RSS feed check',
};

/**
 * Notifier - Notification Events.
 *
 * Lists every event a destination can choose, with its label, description, and default.
 * The first two are shared by all four apps.
 *
 * @since 4.0.0
 */
export const notificationEvents: Lib_Notifier_NotificationEvents = [
  ...commonNotificationEvents,
  {
    defaultEnabled: true,
    description: 'Discord refused the Bot Token, or the bot couldn\'t start.',
    key: 'bot-sign-in-failed',
    label: 'Bot can\'t sign in',
    priority: 'high',
    tags: ['x'],
  },
  {
    defaultEnabled: true,
    description: 'The bot lost its connection to Discord.',
    key: 'bot-disconnected',
    label: 'Bot disconnected',
    priority: 'high',
    tags: ['warning'],
  },
  {
    defaultEnabled: true,
    description: 'The bot is back on Discord after a drop.',
    key: 'bot-reconnected',
    label: 'Bot reconnected',
    priority: 'default',
    tags: ['white_check_mark'],
  },
  {
    defaultEnabled: true,
    description: 'A message, permission change, or RSS feed check failed on every try.',
    key: 'job-failed',
    label: 'Job gave up',
    priority: 'high',
    tags: ['x'],
  },
];

/**
 * Notifier - Job Payload Schema.
 *
 * Reads a queued notification job: the destination and the notification to send it.
 * A malformed job fails instead of sending something unexpected.
 *
 * @since 4.0.0
 */
const jobPayloadSchema: Lib_Notifier_JobPayloadSchema = z.object({
  notification: z.object({
    details: z.record(z.string(), z.unknown()),
    event: z.string(),
    message: z.string(),
    occurredAt: z.string(),
    priority: z.enum([
      'default',
      'high',
      'low',
    ]),
    tags: z.array(z.string()),
    title: z.string(),
  }),
  targetId: z.string(),
});

/**
 * Notifier - Gateway Watchers.
 *
 * Keeps the stop function for each watched Gateway client.
 * Stopping the bot on purpose never sounds like a dropped connection.
 *
 * @since 4.0.0
 */
const gatewayWatchers: Lib_Notifier_GatewayWatchers = new WeakMap();

/**
 * Notifier - Deliver Notification Job.
 *
 * Sends one queued notification to its destination and records the attempt.
 * A failed send throws so the worker tries again; a removed destination is skipped.
 *
 * @param {Lib_Notifier_DeliverNotificationJob_Pool}          pool          - Pool.
 * @param {Lib_Notifier_DeliverNotificationJob_CredentialKey} credentialKey - Credential key.
 * @param {Lib_Notifier_DeliverNotificationJob_Payload}       payload       - Payload.
 * @param {Lib_Notifier_DeliverNotificationJob_Send}          send          - Send.
 *
 * @returns {Lib_Notifier_DeliverNotificationJob_Returns}
 *
 * @since 4.0.0
 */
export async function deliverNotificationJob(
  pool: Lib_Notifier_DeliverNotificationJob_Pool,
  credentialKey: Lib_Notifier_DeliverNotificationJob_CredentialKey,
  payload: Lib_Notifier_DeliverNotificationJob_Payload,
  send: Lib_Notifier_DeliverNotificationJob_Send = sendNotification,
): Lib_Notifier_DeliverNotificationJob_Returns {
  const jobPayload: Lib_Notifier_DeliverNotificationJob_JobPayload = jobPayloadSchema.parse(payload);
  const delivery: Lib_Notifier_DeliverNotificationJob_Delivery = await openNotificationTarget(pool, credentialKey, jobPayload['targetId']);

  if (typeof delivery === 'string') {
    writeLog('info', 'worker', 'notification_skipped', {
      event: jobPayload['notification']['event'],
      reason: delivery,
      targetId: jobPayload['targetId'],
    });

    return;
  }

  const result: Lib_Notifier_DeliverNotificationJob_Result = await send(notificationApp, delivery['target'], jobPayload['notification']);

  await recordNotificationAttempt(pool, jobPayload['targetId'], (result['delivered'] === true) ? null : result['message']);

  if (result['delivered'] === false) {
    throw new Error(`The ${delivery['name']} notification couldn't be sent: ${result['message']}`);
  }

  writeLog('info', 'worker', 'notification_delivered', {
    event: jobPayload['notification']['event'],
    targetId: jobPayload['targetId'],
  });

  return;
}

/**
 * Notifier - Notify Bot Disconnected.
 *
 * Queues the Bot disconnected notification for one outage.
 * It goes out once the Gateway has stayed down past the grace period.
 *
 * @param {Lib_Notifier_NotifyBotDisconnected_Pool}      pool      - Pool.
 * @param {Lib_Notifier_NotifyBotDisconnected_DownSince} downSince - Down since.
 *
 * @returns {Lib_Notifier_NotifyBotDisconnected_Returns}
 *
 * @since 4.0.0
 */
export async function notifyBotDisconnected(
  pool: Lib_Notifier_NotifyBotDisconnected_Pool,
  downSince: Lib_Notifier_NotifyBotDisconnected_DownSince,
): Lib_Notifier_NotifyBotDisconnected_Returns {
  await queueNotification(pool, buildEventNotification(notificationEvents[3]!, 'The bot lost its connection to Discord and hasn\'t reconnected after a minute. Features that need Discord are paused until it does.', {
    downSince: downSince.toISOString(),
  }), downSince.toISOString());

  return;
}

/**
 * Notifier - Notify Bot Reconnected.
 *
 * Queues the Bot reconnected notification after an outage that was reported.
 * The message says how long the bot was away.
 *
 * @param {Lib_Notifier_NotifyBotReconnected_Pool}      pool      - Pool.
 * @param {Lib_Notifier_NotifyBotReconnected_DownSince} downSince - Down since.
 * @param {Lib_Notifier_NotifyBotReconnected_UpAt}      upAt      - Up at.
 *
 * @returns {Lib_Notifier_NotifyBotReconnected_Returns}
 *
 * @since 4.0.0
 */
export async function notifyBotReconnected(
  pool: Lib_Notifier_NotifyBotReconnected_Pool,
  downSince: Lib_Notifier_NotifyBotReconnected_DownSince,
  upAt: Lib_Notifier_NotifyBotReconnected_UpAt,
): Lib_Notifier_NotifyBotReconnected_Returns {
  await queueNotification(pool, buildEventNotification(notificationEvents[4]!, `The bot is back on Discord after ${formatDuration(upAt.getTime() - downSince.getTime())} away.`, {
    downSince: downSince.toISOString(),
    upAt: upAt.toISOString(),
  }), downSince.toISOString());

  return;
}

/**
 * Notifier - Notify Bot Sign In Failed.
 *
 * Queues the Bot can't sign in notification for one start attempt.
 * The bot doesn't retry until someone restarts it, so this goes out once per attempt.
 *
 * @param {Lib_Notifier_NotifyBotSignInFailed_Pool}       pool       - Pool.
 * @param {Lib_Notifier_NotifyBotSignInFailed_Generation} generation - Generation.
 * @param {Lib_Notifier_NotifyBotSignInFailed_Reason}     reason     - Reason.
 *
 * @returns {Lib_Notifier_NotifyBotSignInFailed_Returns}
 *
 * @since 4.0.0
 */
export async function notifyBotSignInFailed(
  pool: Lib_Notifier_NotifyBotSignInFailed_Pool,
  generation: Lib_Notifier_NotifyBotSignInFailed_Generation,
  reason: Lib_Notifier_NotifyBotSignInFailed_Reason,
): Lib_Notifier_NotifyBotSignInFailed_Returns {
  const cause: Lib_Notifier_NotifyBotSignInFailed_Cause = (reason.endsWith('.') === true) ? reason.slice(0, -1) : reason;

  await queueNotification(pool, buildEventNotification(notificationEvents[2]!, `The bot couldn't sign in to Discord: ${cause}. Check the Bot Token on the Connection page, then restart the bot.`, {
    generation,
    reason,
  }), String(generation));

  return;
}

/**
 * Notifier - Notify Job Failed.
 *
 * Queues the Job gave up notification when a worker job fails its last try.
 * Notification jobs are left out, so a broken destination can't report itself.
 *
 * @param {Lib_Notifier_NotifyJobFailed_Pool}         pool         - Pool.
 * @param {Lib_Notifier_NotifyJobFailed_Job}          job          - Job.
 * @param {Lib_Notifier_NotifyJobFailed_ErrorMessage} errorMessage - Error message.
 *
 * @returns {Lib_Notifier_NotifyJobFailed_Returns}
 *
 * @since 4.0.0
 */
export async function notifyJobFailed(
  pool: Lib_Notifier_NotifyJobFailed_Pool,
  job: Lib_Notifier_NotifyJobFailed_Job,
  errorMessage: Lib_Notifier_NotifyJobFailed_ErrorMessage,
): Lib_Notifier_NotifyJobFailed_Returns {
  if (job['type'] === NOTIFICATION_JOB_TYPE) {
    return;
  }

  const label: Lib_Notifier_NotifyJobFailed_Label = jobLabels[job['type']] ?? 'A background job';
  const ruleName: Lib_Notifier_NotifyJobFailed_RuleName = job['payload']['ruleName'] ?? job['payload']['name'];
  const subject: Lib_Notifier_NotifyJobFailed_Subject = (typeof ruleName === 'string' && ruleName !== '') ? `${label} for ${ruleName}` : label;

  await queueNotification(pool, buildEventNotification(notificationEvents[5]!, `${subject} failed on all ${String(job['attempts'])} tries and won't run again: ${errorMessage}`, {
    attempts: job['attempts'],
    error: errorMessage,
    jobId: job['id'],
    jobType: job['type'],
  }), job['id']);

  return;
}

/**
 * Notifier - Notify Secrets Removed.
 *
 * Queues the Saved secrets were removed notification after a lost credential key.
 * Only destinations that kept working without their own secrets can receive it.
 *
 * @param {Lib_Notifier_NotifySecretsRemoved_Pool}  pool  - Pool.
 * @param {Lib_Notifier_NotifySecretsRemoved_Items} items - Items.
 *
 * @returns {Lib_Notifier_NotifySecretsRemoved_Returns}
 *
 * @since 4.0.0
 */
export async function notifySecretsRemoved(
  pool: Lib_Notifier_NotifySecretsRemoved_Pool,
  items: Lib_Notifier_NotifySecretsRemoved_Items,
): Lib_Notifier_NotifySecretsRemoved_Returns {
  if (items.length === 0) {
    return;
  }

  await queueNotification(pool, buildSecretsRemovedNotification(notificationApp, 'credential key', items), new Date().toISOString());

  return;
}

/**
 * Notifier - Notify Sign In Locked.
 *
 * Queues the Sign-in locked notification when an address reaches the failure limit.
 * Each address is reported once per lockout window, from any process.
 *
 * @param {Lib_Notifier_NotifySignInLocked_Pool} pool - Pool.
 * @param {Lib_Notifier_NotifySignInLocked_Key}  key  - Key.
 * @param {Lib_Notifier_NotifySignInLocked_Now}  now  - Now.
 *
 * @returns {Lib_Notifier_NotifySignInLocked_Returns}
 *
 * @since 4.0.0
 */
export async function notifySignInLocked(
  pool: Lib_Notifier_NotifySignInLocked_Pool,
  key: Lib_Notifier_NotifySignInLocked_Key,
  now: Lib_Notifier_NotifySignInLocked_Now = Date.now(),
): Lib_Notifier_NotifySignInLocked_Returns {
  if (key.startsWith('sign-in:') === false) {
    return;
  }

  const address: Lib_Notifier_NotifySignInLocked_Address = key.slice('sign-in:'.length);
  const window: Lib_Notifier_NotifySignInLocked_Window = Math.floor(now / signInLockWindowMilliseconds);

  await queueNotification(pool, buildSignInLockedNotification(address), `${address}:${String(window)}`);

  return;
}

/**
 * Notifier - Queue Notification.
 *
 * Adds one worker job per destination that chose the notification's event.
 * The occurrence makes a repeated report of the same thing a no-op.
 *
 * @param {Lib_Notifier_QueueNotification_Pool}         pool         - Pool.
 * @param {Lib_Notifier_QueueNotification_Notification} notification - Notification.
 * @param {Lib_Notifier_QueueNotification_Occurrence}   occurrence   - Occurrence.
 *
 * @returns {Lib_Notifier_QueueNotification_Returns}
 *
 * @since 4.0.0
 */
export async function queueNotification(
  pool: Lib_Notifier_QueueNotification_Pool,
  notification: Lib_Notifier_QueueNotification_Notification,
  occurrence: Lib_Notifier_QueueNotification_Occurrence,
): Lib_Notifier_QueueNotification_Returns {
  const targetIds: Lib_Notifier_QueueNotification_TargetIds = await listNotificationTargetIds(pool, notification['event']);

  await Promise.all(targetIds.map(async (targetId) => {
    await enqueueDurableJob(pool, NOTIFICATION_JOB_TYPE, {
      notification,
      targetId,
    }, `notification:${notification['event']}:${occurrence}:${targetId}`);

    return;
  }));

  return;
}

/**
 * Notifier - Send Test Notification.
 *
 * Sends the test notification to one destination right away and records the attempt.
 * A destination waiting for removed secrets isn't tried.
 *
 * @param {Lib_Notifier_SendTestNotification_Pool}          pool          - Pool.
 * @param {Lib_Notifier_SendTestNotification_CredentialKey} credentialKey - Credential key.
 * @param {Lib_Notifier_SendTestNotification_TargetId}      targetId      - Target id.
 * @param {Lib_Notifier_SendTestNotification_Send}          send          - Send.
 *
 * @returns {Lib_Notifier_SendTestNotification_Returns}
 *
 * @since 4.0.0
 */
export async function sendTestNotification(
  pool: Lib_Notifier_SendTestNotification_Pool,
  credentialKey: Lib_Notifier_SendTestNotification_CredentialKey,
  targetId: Lib_Notifier_SendTestNotification_TargetId,
  send: Lib_Notifier_SendTestNotification_Send = sendNotification,
): Lib_Notifier_SendTestNotification_Returns {
  const delivery: Lib_Notifier_SendTestNotification_Delivery = await openNotificationTarget(pool, credentialKey, targetId);

  if (typeof delivery === 'string') {
    return delivery;
  }

  const result: Lib_Notifier_SendTestNotification_Result = await send(notificationApp, delivery['target'], buildTestNotification(notificationApp));

  await recordNotificationAttempt(pool, targetId, (result['delivered'] === true) ? null : result['message']);

  return result;
}

/**
 * Notifier - Stop Gateway Watch.
 *
 * Stops watching a Gateway client before it is shut down on purpose.
 * A drop that was still in its grace period is forgotten.
 *
 * @param {Lib_Notifier_StopGatewayWatch_Client} client - Client.
 *
 * @returns {Lib_Notifier_StopGatewayWatch_Returns}
 *
 * @since 4.0.0
 */
export function stopGatewayWatch(client: Lib_Notifier_StopGatewayWatch_Client): Lib_Notifier_StopGatewayWatch_Returns {
  const stop: Lib_Notifier_StopGatewayWatch_Stop = gatewayWatchers.get(client);

  if (stop !== undefined) {
    stop();

    gatewayWatchers.delete(client);
  }

  return;
}

/**
 * Notifier - Watch Gateway Connection.
 *
 * Reports a Gateway drop that outlasts the grace period, then its recovery.
 * Short drops that Discord resumes on its own are never reported.
 *
 * @param {Lib_Notifier_WatchGatewayConnection_Client}            client            - Client.
 * @param {Lib_Notifier_WatchGatewayConnection_Pool}              pool              - Pool.
 * @param {Lib_Notifier_WatchGatewayConnection_GraceMilliseconds} graceMilliseconds - Grace milliseconds.
 *
 * @returns {Lib_Notifier_WatchGatewayConnection_Returns}
 *
 * @since 4.0.0
 */
export function watchGatewayConnection(
  client: Lib_Notifier_WatchGatewayConnection_Client,
  pool: Lib_Notifier_WatchGatewayConnection_Pool,
  graceMilliseconds: Lib_Notifier_WatchGatewayConnection_GraceMilliseconds = GATEWAY_GRACE_MILLISECONDS,
): Lib_Notifier_WatchGatewayConnection_Returns {
  let downSince: Lib_Notifier_WatchGatewayConnection_DownSince = undefined;
  let announced: Lib_Notifier_WatchGatewayConnection_Announced = false;
  let stopped: Lib_Notifier_WatchGatewayConnection_Stopped = false;
  let timer: Lib_Notifier_WatchGatewayConnection_Timer = undefined;

  /**
   * Notifier - Watch Gateway Connection - Report.
   *
   * Logs a notification that couldn't be queued.
   * The bot keeps running either way.
   *
   * @param {unknown} error - Error.
   *
   * @returns {void}
   *
   * @since 4.0.0
   */
  const report: Lib_Notifier_WatchGatewayConnection_Report = (error) => {
    writeLog('error', 'bot', 'notification_queue_failed', {
      error: getErrorMessage(error),
    });

    return;
  };

  /**
   * Notifier - Watch Gateway Connection - Mark Down.
   *
   * Starts the grace period when the Gateway drops or starts reconnecting.
   * A drop that is already being timed keeps its start time.
   *
   * @returns {void}
   *
   * @since 4.0.0
   */
  const markDown: Lib_Notifier_WatchGatewayConnection_MarkDown = () => {
    if (stopped === true || downSince !== undefined) {
      return;
    }

    const droppedAt: Lib_Notifier_NotifyBotDisconnected_DownSince = new Date();

    downSince = droppedAt;

    timer = setTimeout(() => {
      timer = undefined;

      if (stopped === true || downSince !== droppedAt) {
        return;
      }

      announced = true;

      void notifyBotDisconnected(pool, droppedAt).catch(report);

      return;
    }, graceMilliseconds);

    timer.unref();

    return;
  };

  /**
   * Notifier - Watch Gateway Connection - Mark Up.
   *
   * Ends a drop when the Gateway is ready or resumed again.
   * A drop that was reported gets its recovery reported too.
   *
   * @returns {void}
   *
   * @since 4.0.0
   */
  const markUp: Lib_Notifier_WatchGatewayConnection_MarkUp = () => {
    if (stopped === true || downSince === undefined) {
      return;
    }

    if (timer !== undefined) {
      clearTimeout(timer);

      timer = undefined;
    }

    const droppedAt: Lib_Notifier_NotifyBotReconnected_DownSince = downSince;

    downSince = undefined;

    if (announced === true) {
      announced = false;

      void notifyBotReconnected(pool, droppedAt, new Date()).catch(report);
    }

    return;
  };

  /**
   * Notifier - Watch Gateway Connection - Stop.
   *
   * Stops reporting for this client and cancels a grace period in progress.
   * The bot calls it before shutting the client down on purpose.
   *
   * @returns {void}
   *
   * @since 4.0.0
   */
  const stop: Lib_Notifier_WatchGatewayConnection_Stop = () => {
    stopped = true;

    if (timer !== undefined) {
      clearTimeout(timer);

      timer = undefined;
    }

    return;
  };

  client.on(Events.ShardDisconnect, markDown);

  client.on(Events.ShardReconnecting, markDown);

  client.on(Events.ShardReady, markUp);

  client.on(Events.ShardResume, markUp);

  gatewayWatchers.set(client, stop);

  return;
}

/**
 * Notifier - Format Duration.
 *
 * Writes a span of time in minutes, or hours and minutes, for a notification.
 * Anything shorter than a minute counts as one.
 *
 * @param {Lib_Notifier_FormatDuration_Milliseconds} milliseconds - Milliseconds.
 *
 * @private
 *
 * @returns {Lib_Notifier_FormatDuration_Returns}
 *
 * @since 4.0.0
 */
function formatDuration(milliseconds: Lib_Notifier_FormatDuration_Milliseconds): Lib_Notifier_FormatDuration_Returns {
  const minutes: Lib_Notifier_FormatDuration_Minutes = Math.max(1, Math.round(milliseconds / 60_000));
  const minuteWord: Lib_Notifier_FormatDuration_MinuteWord = (minutes === 1) ? 'minute' : 'minutes';

  if (minutes < 60) {
    return `${String(minutes)} ${minuteWord}`;
  }

  const hours: Lib_Notifier_FormatDuration_Hours = Math.floor(minutes / 60);
  const remainingMinutes: Lib_Notifier_FormatDuration_RemainingMinutes = minutes % 60;
  const hourWord: Lib_Notifier_FormatDuration_HourWord = (hours === 1) ? 'hour' : 'hours';

  if (remainingMinutes === 0) {
    return `${String(hours)} ${hourWord}`;
  }

  return `${String(hours)} ${hourWord} ${formatDuration(remainingMinutes * 60_000)}`;
}
