import brandMarkUrl from '@/web/assets/brand-mark.svg';

import type { Web_AppConfig } from '@/types/web/app-config.d.ts';

/**
 * App Config - Application config.
 *
 * Keeps product copy, storage keys, and token capabilities outside the shared
 * console foundation so another app can adopt it without editing shared files.
 *
 * @since 4.0.0
 */
export const appConfig: Web_AppConfig = {
  appName: 'Stonker Bot for Discord',
  brandMarkUrl,
  brandName: 'Stonker Bot for Discord',
  claimCodeHint: 'Find it with docker logs. A new code is printed each time the container restarts.',
  recoveryCodeFileName: 'discord-stonker-bot-recovery-codes.txt',
  roleLabels: {
    administrator: 'Administrator',
    operator: 'Operator',
    owner: 'Owner',
    viewer: 'Viewer',
  },
  securityLabel: 'Sign-in and security',
  securitySurfaceName: 'control panel',
  storageKeys: {
    theme: 'discord-stonker-bot-theme',
  },
  tokenDefaultScopes: ['features:read'],
  tokenNamePlaceholder: 'e.g. Status dashboard',
  tokenScopes: [
    {
      description: 'See the bot\'s status, and start, stop, or restart it.',
      id: 'bot:control',
    },
    {
      description: 'See your servers with their channels and roles, feature settings, and the invite page.',
      id: 'features:read',
    },
    {
      description: 'Change feature settings, turn features on or off, and edit the invite page.',
      id: 'features:write',
    },
    {
      description: 'Read the bot, web, and worker logs.',
      id: 'logs:read',
    },
  ],
};
