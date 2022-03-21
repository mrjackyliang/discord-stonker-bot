import { Guild, NewsChannel, TextChannel } from 'discord.js';
import _ from 'lodash';

import { scheduleJob } from 'node-schedule';
import { generateLogMessage } from '../lib/utilities';
import { BumpThread } from '../types';

/**
 * Bump threads.
 *
 * @param {Guild}      guild   - Discord guild.
 * @param {BumpThread} setting - Thread to bump.
 *
 * @returns {void}
 *
 * @since 1.0.0
 */
export function bumpThreads(guild: Guild, setting: BumpThread): void {
  const name = _.get(setting, 'name', 'Unknown');
  const channelId = _.get(setting, 'channel-id');
  const threadId = _.get(setting, 'thread-id');
  const channel = <TextChannel | NewsChannel>guild.channels.resolve(channelId);

  if (channel && channel.threads) {
    channel.threads.fetch(threadId).then((thread) => {
      // Checks if thread is archived every second and un-archives it.
      scheduleJob('* * * * * *', () => {
        if (thread && thread.archived === true) {
          thread.setArchived(false).then(() => {
            generateLogMessage(
              [
                'Un-archived thread',
                `(function: bumpThreads, thread: ${thread.toString()})`,
              ].join(' '),
              30,
            );
          }).catch((error) => generateLogMessage(
            [
              'Failed to un-archive thread',
              `(function: bumpThreads, thread: ${thread.toString()})`,
            ].join(' '),
            10,
            error,
          ));
        }
      });
    }).catch((error) => generateLogMessage(
      [
        '"thread-id" is not a valid thread channel',
        `(function: bumpThreads, name: ${name})`,
      ].join(' '),
      10,
      error,
    ));
  } else {
    generateLogMessage(
      [
        '"channel-id" is not a valid text or news channel',
        `(function: bumpThreads, name: ${name})`,
      ].join(' '),
      10,
    );
  }
}
