import { useState } from 'react';

import { errorMessage } from '@/web/api.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type { ReactElement } from 'react';

import type { Web_Api_BotAction } from '@/types/web/api.d.ts';
import type {
  Web_Components_BotControls_Props,
  Web_Components_NoServer_Props,
} from '@/types/web/components.d.ts';

/**
 * Bot Controls.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const BotControls = ({
  bot,
  onBotAction,
  onError,
}: Web_Components_BotControls_Props): ReactElement => {
  const [
    pending,
    setPending,
  ] = useState<Web_Api_BotAction | null>(null);

  /**
   * Bot Controls - Run.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const run = async (action: Web_Api_BotAction): Promise<void> => {
    setPending(action);
    onError('');
    try {
      await onBotAction(action);
    } catch (caughtError) {
      onError(errorMessage(caughtError, 'The bot didn\'t accept that. Try again.'));
    } finally {
      setPending(null);
    }
  };

  if (bot['desiredState'] === 'stopped') {
    return (
      <div className="panel-actions">
        <Button
          disabled={pending !== null || !bot['tokenConfigured']}
          icon="play"
          onClick={(): void => {
            void run('start');
          }}
          variant="primary"
        >
          {(pending === 'start') ? 'Starting…' : 'Start'}
        </Button>
      </div>
    );
  }

  return (
    <div className="panel-actions">
      <Button
        disabled={pending !== null}
        icon="refresh"
        onClick={(): void => {
          void run('restart');
        }}
      >
        {(pending === 'restart') ? 'Restarting…' : 'Restart'}
      </Button>
      <Button
        disabled={pending !== null}
        icon="stop"
        onClick={(): void => {
          void run('stop');
        }}
      >
        {(pending === 'stop') ? 'Stopping…' : 'Stop'}
      </Button>
    </div>
  );
};

/**
 * Bot Controls - No server.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const NoServer = ({
  addServerUrl,
  onOpenConnection,
}: Web_Components_NoServer_Props): ReactElement => (
  <div className="panel">
    <div className="empty-state">
      <span><Icon name="server" size={22} /></span>
      <h2>No Discord servers yet</h2>
      <p>Add the bot to a server. It shows up here once the bot is online and has joined it.</p>
      {(addServerUrl === null) ? (
        <Button onClick={onOpenConnection} variant="primary">Add the bot token</Button>
      ) : (
        <a className="button button-primary" href={addServerUrl} rel="noopener noreferrer" target="_blank">
          <Icon name="add" size={16} />
          <span>Add a server</span>
        </a>
      )}
    </div>
  </div>
);
