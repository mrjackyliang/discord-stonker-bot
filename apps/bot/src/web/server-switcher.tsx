import { useState } from 'react';

import { Icon } from '@/web/primitives.tsx';
import { whitespacePattern } from '@/web/regex.js';
import { useEscapeKey } from '@/web/use-escape-key.ts';

import type {
  Web_ServerSwitcher_Initials_Letters,
  Web_ServerSwitcher_Initials_Name,
  Web_ServerSwitcher_Initials_Returns,
  Web_ServerSwitcher_Initials_Words,
  Web_ServerSwitcher_ServerIcon_IconUrl,
  Web_ServerSwitcher_ServerIcon_Name,
  Web_ServerSwitcher_ServerIcon_Props,
  Web_ServerSwitcher_ServerIcon_Returns,
  Web_ServerSwitcher_ServerIcon_Size,
  Web_ServerSwitcher_ServerSwitcher_AddServerUrl,
  Web_ServerSwitcher_ServerSwitcher_Current,
  Web_ServerSwitcher_ServerSwitcher_OnChange,
  Web_ServerSwitcher_ServerSwitcher_OnOpenConnection,
  Web_ServerSwitcher_ServerSwitcher_Open,
  Web_ServerSwitcher_ServerSwitcher_OpenState,
  Web_ServerSwitcher_ServerSwitcher_Props,
  Web_ServerSwitcher_ServerSwitcher_Returns,
  Web_ServerSwitcher_ServerSwitcher_ServerId,
  Web_ServerSwitcher_ServerSwitcher_Servers,
  Web_ServerSwitcher_ServerSwitcher_SetOpen,
} from '@/types/web/server-switcher.d.ts';

/**
 * Server Switcher - Initials.
 *
 * Picks up to two letters for a server that does not have an icon.
 * The fallback stays recognizable in both the switcher and its menu.
 *
 * @param {Web_ServerSwitcher_Initials_Name} name - Name.
 *
 * @returns {Web_ServerSwitcher_Initials_Returns}
 *
 * @since 4.0.0
 */
const initials = (name: Web_ServerSwitcher_Initials_Name): Web_ServerSwitcher_Initials_Returns => {
  const words: Web_ServerSwitcher_Initials_Words = name.trim().split(new RegExp(whitespacePattern, 'u')).filter((word) => word !== '');
  const letters: Web_ServerSwitcher_Initials_Letters = words.slice(0, 2).map((word) => word.charAt(0)).join('');

  return (letters === '') ? '?' : letters.toUpperCase();
};

/**
 * Server Switcher - Server Icon.
 *
 * Shows a Discord server icon when one exists and initials otherwise.
 * Both switcher surfaces reuse the same compact presentation.
 *
 * @param {Web_ServerSwitcher_ServerIcon_Props} props - Props.
 *
 * @returns {Web_ServerSwitcher_ServerIcon_Returns}
 *
 * @since 4.0.0
 */
export const ServerIcon = (props: Web_ServerSwitcher_ServerIcon_Props): Web_ServerSwitcher_ServerIcon_Returns => {
  const iconUrl: Web_ServerSwitcher_ServerIcon_IconUrl = props['iconUrl'];
  const name: Web_ServerSwitcher_ServerIcon_Name = props['name'];
  const size: Web_ServerSwitcher_ServerIcon_Size = props['size'] ?? 'small';

  return (
    <span aria-hidden="true" className={`server-icon server-icon-${size}`}>
      {(iconUrl === null) ? initials(name) : <img alt="" src={iconUrl} />}
    </span>
  );
};

/**
 * Server Switcher - Server Switcher.
 *
 * Selects an available Discord server and exposes the app's install link.
 * The shell places this app-owned control in its desktop and phone slots.
 *
 * @param {Web_ServerSwitcher_ServerSwitcher_Props} props - Props.
 *
 * @returns {Web_ServerSwitcher_ServerSwitcher_Returns}
 *
 * @since 4.0.0
 */
export const ServerSwitcher = (props: Web_ServerSwitcher_ServerSwitcher_Props): Web_ServerSwitcher_ServerSwitcher_Returns => {
  const addServerUrl: Web_ServerSwitcher_ServerSwitcher_AddServerUrl = props['addServerUrl'];
  const onChange: Web_ServerSwitcher_ServerSwitcher_OnChange = props['onChange'];
  const onOpenConnection: Web_ServerSwitcher_ServerSwitcher_OnOpenConnection = props['onOpenConnection'];
  const serverId: Web_ServerSwitcher_ServerSwitcher_ServerId = props['serverId'];
  const servers: Web_ServerSwitcher_ServerSwitcher_Servers = props['servers'];
  const openState: Web_ServerSwitcher_ServerSwitcher_OpenState = useState<Web_ServerSwitcher_ServerSwitcher_Open>(false);
  const open: Web_ServerSwitcher_ServerSwitcher_Open = openState[0];
  const setOpen: Web_ServerSwitcher_ServerSwitcher_SetOpen = openState[1];
  const current: Web_ServerSwitcher_ServerSwitcher_Current = servers.find((server) => server['id'] === serverId);

  useEscapeKey(() => setOpen(false), open);

  return (
    <div className="server-switcher">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="server-switcher-button"
        onClick={() => setOpen(open === false)}
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

      {(open === true) ? (
        <>
          <button
            aria-label="Close menu"
            className="menu-scrim"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="menu server-menu" role="menu">
            {(servers.length === 0) ? (
              <p className="server-menu-empty">The bot shows each Discord server here once it joins one.</p>
            ) : servers.map((server) => (
              <button
                aria-checked={server['id'] === serverId}
                key={server['id']}
                onClick={() => {
                  setOpen(false);
                  onChange(server['id']);

                  return;
                }}
                role="menuitemradio"
                type="button"
              >
                <ServerIcon iconUrl={server['iconUrl']} name={server['name']} />
                <span className="server-menu-name">{server['name']}</span>
                {(server['available'] === true) ? null : <span className="tag">Bot removed</span>}
                {(server['id'] === serverId) ? <Icon name="check" size={16} /> : null}
              </button>
            ))}
            <hr />
            {(addServerUrl === null) ? (
              <button
                onClick={() => {
                  setOpen(false);
                  onOpenConnection();

                  return;
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
