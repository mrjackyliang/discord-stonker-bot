import { useState } from 'react';

import { errorMessage } from '@/web/api.ts';
import {
  Button,
  Icon,
} from '@/web/primitives.tsx';

import type {
  Web_BotControls_BotControls_Bot,
  Web_BotControls_BotControls_OnBotAction,
  Web_BotControls_BotControls_OnError,
  Web_BotControls_BotControls_Pending,
  Web_BotControls_BotControls_PendingState,
  Web_BotControls_BotControls_Props,
  Web_BotControls_BotControls_Returns,
  Web_BotControls_BotControls_Run,
  Web_BotControls_BotControls_Run_Action,
  Web_BotControls_BotControls_Run_Returns,
  Web_BotControls_BotControls_SetPending,
  Web_BotControls_NoServer_AddServerUrl,
  Web_BotControls_NoServer_OnOpenConnection,
  Web_BotControls_NoServer_Props,
  Web_BotControls_NoServer_Returns,
} from '@/types/web/bot-controls.d.ts';

/**
 * Bot Controls - Bot Controls.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_BotControls_BotControls_Props} props - Props.
 *
 * @returns {Web_BotControls_BotControls_Returns}
 *
 * @since 4.0.0
 */
export const BotControls = (props: Web_BotControls_BotControls_Props): Web_BotControls_BotControls_Returns => {
  const bot: Web_BotControls_BotControls_Bot = props['bot'];
  const onBotAction: Web_BotControls_BotControls_OnBotAction = props['onBotAction'];
  const onError: Web_BotControls_BotControls_OnError = props['onError'];
  const pendingState: Web_BotControls_BotControls_PendingState = useState<Web_BotControls_BotControls_Pending>(null);
  const pending: Web_BotControls_BotControls_Pending = pendingState[0];
  const setPending: Web_BotControls_BotControls_SetPending = pendingState[1];

  /**
   * Bot Controls - Run.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @param {Web_BotControls_BotControls_Run_Action} action - Action.
   *
   * @returns {Web_BotControls_BotControls_Run_Returns}
   *
   * @since 4.0.0
   */
  const run: Web_BotControls_BotControls_Run = async (action: Web_BotControls_BotControls_Run_Action): Web_BotControls_BotControls_Run_Returns => {
    setPending(action);
    onError('');
    try {
      await onBotAction(action);
    } catch (caughtError) {
      onError(errorMessage(caughtError, 'The bot didn\'t accept that. Try again.'));
    } finally {
      setPending(null);
    }

    return;
  };

  if (bot['desiredState'] === 'stopped') {
    return (
      <div className="panel-actions">
        <Button
          disabled={pending !== null || bot['tokenConfigured'] === false}
          icon="play"
          onClick={() => {
            void run('start');

            return;
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
        onClick={() => {
          void run('restart');

          return;
        }}
      >
        {(pending === 'restart') ? 'Restarting…' : 'Restart'}
      </Button>
      <Button
        disabled={pending !== null}
        icon="stop"
        onClick={() => {
          void run('stop');

          return;
        }}
      >
        {(pending === 'stop') ? 'Stopping…' : 'Stop'}
      </Button>
    </div>
  );
};

/**
 * Bot Controls - No Server.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_BotControls_NoServer_Props} props - Props.
 *
 * @returns {Web_BotControls_NoServer_Returns}
 *
 * @since 4.0.0
 */
export const NoServer = (props: Web_BotControls_NoServer_Props): Web_BotControls_NoServer_Returns => {
  const addServerUrl: Web_BotControls_NoServer_AddServerUrl = props['addServerUrl'];
  const onOpenConnection: Web_BotControls_NoServer_OnOpenConnection = props['onOpenConnection'];

  return (
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
};
