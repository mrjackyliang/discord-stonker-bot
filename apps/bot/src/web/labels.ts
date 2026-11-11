import { formatRelative } from '@/web/format.ts';

import type {
  Web_Api_Bot,
  Web_Api_FeatureCategory,
  Web_Api_Permission,
  Web_Api_Principal,
  Web_Api_Role,
  Web_Api_Scope,
  Web_Api_Server,
  Web_Api_Service,
} from '@/types/web/api.d.ts';
import type {
  Web_Components_BotStatus,
  Web_Components_ServiceStatus,
} from '@/types/web/components.d.ts';

/**
 * Labels - Role labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const roleLabels: Record<Web_Api_Role, string> = {
  administrator: 'Administrator',
  operator: 'Operator',
  owner: 'Owner',
  viewer: 'Viewer',
};

/**
 * Labels - Role descriptions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const roleDescriptions: Record<Exclude<Web_Api_Role, 'owner'>, string> = {
  administrator: 'Everything, including adding and changing users.',
  operator: 'Changes features and starts or stops the bot.',
  viewer: 'Sees everything but can\'t change anything.',
};

/**
 * Labels - Role permissions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rolePermissions: Record<Web_Api_Role, Web_Api_Permission[]> = {
  administrator: [
    'bot:control',
    'configuration:write',
    'users:manage',
  ],
  operator: [
    'bot:control',
    'configuration:write',
  ],
  owner: [
    'bot:control',
    'configuration:write',
    'users:manage',
  ],
  viewer: [],
};

// permissionsFor uses the permissions the server sent, or works them out from the role.

/**
 * Labels - Permissions for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const permissionsFor = (principal: Web_Api_Principal | null): Web_Api_Permission[] => {
  if (principal === null) {
    return [];
  }

  if (principal['permissions'] !== undefined) {
    return principal['permissions'];
  }

  return (principal['role'] === undefined) ? [] : rolePermissions[principal['role']];
};

// scopesForRole lists the token scopes a role may grant: viewers only read.

/**
 * Labels - Scopes for role.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const scopesForRole = (role: Web_Api_Role | undefined): Web_Api_Scope[] => {
  if (role === undefined || role === 'viewer') {
    return [
      'features:read',
      'logs:read',
    ];
  }

  return [
    'bot:control',
    'features:read',
    'features:write',
    'logs:read',
  ];
};

/**
 * Labels - Category labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const categoryLabels: Record<Web_Api_FeatureCategory, string> = {
  automation: 'Automation',
  community: 'Community',
  integrations: 'Integrations',
  moderation: 'Moderation',
  safety: 'Safety',
  web: 'Web',
};

/**
 * Labels - Category order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const categoryOrder: Web_Api_FeatureCategory[] = [
  'safety',
  'moderation',
  'automation',
  'community',
  'integrations',
  'web',
];

// serverAccessLabel says which servers a user can see, by name when there are few.

/**
 * Labels - Server access label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const serverAccessLabel = (allServers: boolean, serverIds: string[], servers: Web_Api_Server[]): string => {
  if (allServers) {
    return 'All servers';
  }

  if (serverIds.length === 0) {
    return 'No servers';
  }

  const names: string[] = serverIds.map((serverId: string): string => {
    const server: Web_Api_Server | undefined = servers.find((candidate: Web_Api_Server): boolean => candidate['id'] === serverId);

    return (server === undefined) ? serverId : server['name'];
  });

  return (names.length <= 2) ? names.join(', ') : `${names.length} servers`;
};

// describeBot reduces the bot's state to what the shell and overview show at a glance.

/**
 * Labels - Describe bot.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const describeBot = (bot: Web_Api_Bot | null): Web_Components_BotStatus => {
  if (bot === null) {
    return {
      detail: 'Loading…',
      label: 'Bot',
      tone: 'idle',
    };
  }

  if (!bot['tokenConfigured']) {
    return {
      detail: 'Add the bot token',
      label: 'Not connected',
      tone: 'blocked',
    };
  }

  const status: string = bot['status'].toLowerCase();

  if (status === 'ready' || status === 'running' || status === 'online') {
    return {
      detail: 'Connected to Discord',
      label: 'Online',
      tone: 'protected',
    };
  }

  if (status === 'starting' || status === 'connecting' || status === 'reconnecting' || status === 'restarting') {
    return {
      detail: 'Connecting to Discord',
      label: 'Starting',
      tone: 'connecting',
    };
  }

  if (status === 'unresponsive') {
    return {
      detail: 'No heartbeat from the bot',
      label: 'Not responding',
      tone: 'blocked',
    };
  }

  if (status === 'failed' || status === 'error' || status === 'configuration_required') {
    return {
      detail: (status === 'configuration_required') ? 'Check the bot token' : 'See the bot logs',
      label: 'Stopped by an error',
      tone: 'blocked',
    };
  }

  if (bot['desiredState'] === 'running') {
    return {
      detail: 'Waiting for the bot process',
      label: 'Starting',
      tone: 'connecting',
    };
  }

  return {
    detail: 'Start it to go online',
    label: 'Stopped',
    tone: 'idle',
  };
};

/**
 * Labels - Service stale milliseconds.
 *
 * A service that hasn't written a heartbeat for this long counts as not responding.
 * It matches the limit the server uses for the bot's own status.
 *
 * @since 4.0.0
 */
const serviceStaleMilliseconds: number = 90_000;

// describeService reduces a service's latest heartbeat to a status word for the Services list.

/**
 * Labels - Describe service.
 *
 * A service that checks in on time shows only its status, since its heartbeat is recent.
 * Once it stops checking in, the heartbeat's age says when it was last heard from.
 *
 * @since 4.0.0
 */
export const describeService = (service: Web_Api_Service | undefined, now: number = Date.now()): Web_Components_ServiceStatus => {
  if (service === undefined || service['updatedAt'] === null) {
    return {
      detail: null,
      label: 'No heartbeat yet',
      tone: 'idle',
    };
  }

  if (now - Date.parse(service['updatedAt']) > serviceStaleMilliseconds) {
    return {
      detail: `last heartbeat ${formatRelative(service['updatedAt'], now)}`,
      label: 'Not responding',
      tone: 'blocked',
    };
  }

  const status: string = (service['status'] ?? '').toLowerCase();

  if (status === 'ready' || status === 'running' || status === 'online') {
    return {
      detail: null,
      label: 'Ready',
      tone: 'protected',
    };
  }

  if (status === 'starting' || status === 'connecting' || status === 'reconnecting' || status === 'restarting') {
    return {
      detail: null,
      label: 'Starting',
      tone: 'connecting',
    };
  }

  if (status === 'failed' || status === 'error' || status === 'configuration_required') {
    return {
      detail: null,
      label: 'Stopped by an error',
      tone: 'blocked',
    };
  }

  if (status === 'stopped') {
    return {
      detail: null,
      label: 'Stopped',
      tone: 'idle',
    };
  }

  return {
    detail: null,
    label: (status === '') ? 'No status' : status.charAt(0).toUpperCase() + status.slice(1).replaceAll('_', ' '),
    tone: 'idle',
  };
};
