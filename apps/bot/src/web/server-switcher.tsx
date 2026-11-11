import { useState } from 'react';

import { Icon } from '@/web/primitives.tsx';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type { ReactElement } from 'react';

import type { Web_Api_Server } from '@/types/web/api.d.ts';
import type {
  Web_ServerSwitcher_Props,
  Web_ServerSwitcher_ServerIcon_Props,
} from '@/types/web/server-switcher.d.ts';

/**
 * Server Switcher - Initials.
 *
 * Picks up to two letters for a server that does not have an icon.
 * The fallback stays recognizable in both the switcher and its menu.
 *
 * @param {string} name - Name.
 *
 * @returns {string}
 *
 * @since 4.0.0
 */
const initials = (name: string): string => {
  const words: string[] = name.trim().split(/\s+/u).filter((word: string): boolean => word !== '');
  const letters: string = words.slice(0, 2).map((word: string): string => word.charAt(0)).join('');

  return (letters === '') ? '?' : letters.toUpperCase();
};

/**
 * Server Switcher - Server icon.
 *
 * Shows a Discord server icon when one exists and initials otherwise.
 * Both switcher surfaces reuse the same compact presentation.
 *
 * @param {Web_ServerSwitcher_ServerIcon_Props} props - Props.
 *
 * @returns {ReactElement}
 *
 * @since 4.0.0
 */
export const ServerIcon = ({
  iconUrl,
  name,
  size = 'small',
}: Web_ServerSwitcher_ServerIcon_Props): ReactElement => (
  <span aria-hidden="true" className={`server-icon server-icon-${size}`}>
    {(iconUrl === null) ? initials(name) : <img alt="" src={iconUrl} />}
  </span>
);

/**
 * Server Switcher.
 *
 * Selects an available Discord server and exposes the app's install link.
 * The shell places this app-owned control in its desktop and phone slots.
 *
 * @param {Web_ServerSwitcher_Props} props - Props.
 *
 * @returns {ReactElement}
 *
 * @since 4.0.0
 */
export const ServerSwitcher = ({
  addServerUrl,
  onChange,
  onOpenConnection,
  serverId,
  servers,
}: Web_ServerSwitcher_Props): ReactElement => {
  const [
    open,
    setOpen,
  ] = useState<boolean>(false);
  const current: Web_Api_Server | undefined = servers.find((server: Web_Api_Server): boolean => server['id'] === serverId);

  useEscapeKey((): void => setOpen(false), open);

  return (
    <div className="server-switcher">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="server-switcher-button"
        onClick={(): void => setOpen(!open)}
        type="button"
      >
        {(current === undefined) ? (
          <>
            <span aria-hidden="true" className="server-icon server-icon-small server-icon-empty"><Icon name="server" size={16} /></span>
            <span className="server-switcher-name">{(servers.length === 0) ? 'No servers yet' : 'Choose a server'}</span>
          </>
        ) : (
          <>
            <ServerIcon iconUrl={current['iconUrl']} name={current['name']} />
            <span className="server-switcher-name">{current['name']}</span>
          </>
        )}
        <Icon name="chevron-down" size={16} />
      </button>

      {(open) ? (
        <>
          <button
            aria-label="Close menu"
            className="menu-scrim"
            onClick={(): void => setOpen(false)}
            type="button"
          />
          <div className="menu server-menu" role="menu">
            {(servers.length === 0) ? (
              <p className="server-menu-empty">The bot shows each Discord server here once it joins one.</p>
            ) : servers.map((server: Web_Api_Server): ReactElement => (
              <button
                aria-checked={server['id'] === serverId}
                key={server['id']}
                onClick={(): void => {
                  setOpen(false);
                  onChange(server['id']);
                }}
                role="menuitemradio"
                type="button"
              >
                <ServerIcon iconUrl={server['iconUrl']} name={server['name']} />
                <span className="server-menu-name">{server['name']}</span>
                {(server['available']) ? null : <span className="tag">Bot removed</span>}
                {(server['id'] === serverId) ? <Icon name="check" size={16} /> : null}
              </button>
            ))}
            <hr />
            {(addServerUrl === null) ? (
              <button
                onClick={(): void => {
                  setOpen(false);
                  onOpenConnection();
                }}
                role="menuitem"
                type="button"
              >
                <Icon name="add" size={16} />
                Add a server
              </button>
            ) : (
              <a className="menu-link" href={addServerUrl} rel="noopener noreferrer" role="menuitem" target="_blank">
                <Icon name="add" size={16} />
                Add a server
                <Icon name="external" size={14} />
              </a>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
