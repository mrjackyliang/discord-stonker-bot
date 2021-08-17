import { TextBasedChannels } from 'discord.js';
import { scheduleJob } from 'node-schedule';
import { generateLogMessage } from '../lib/utilities';

/**
 * Threads bumper.
 *
 * @param {TextBasedChannels|undefined} thread - Thread to bump.
 *
 * @return {void}
 *
 * @since 1.0.0
 */
export default function threadsBumper(thread: TextBasedChannels | undefined): void {
  if (!thread || !thread.isThread()) {
    return;
  }

  scheduleJob('*/59 * * * *', async () => {
    thread.send({
      content: 'Bump!',
    }).then((message) => {
      message.delete().catch((error) => generateLogMessage(
        'Failed to delete message',
        10,
        error,
      ));
    }).catch((error) => generateLogMessage(
      'Failed to send message',
      10,
      error,
    ));
  });
}
