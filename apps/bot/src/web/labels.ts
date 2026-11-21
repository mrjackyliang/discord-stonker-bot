import { formatRelative } from '@/web/format.ts';

import type {
  Web_Labels_CategoryLabels,
  Web_Labels_CategoryOrder,
  Web_Labels_DescribeBot_Bot,
  Web_Labels_DescribeBot_Returns,
  Web_Labels_DescribeBot_Status,
  Web_Labels_DescribeService_Now,
  Web_Labels_DescribeService_Returns,
  Web_Labels_DescribeService_Service,
  Web_Labels_DescribeService_Status,
  Web_Labels_PermissionsFor_Principal,
  Web_Labels_PermissionsFor_Returns,
  Web_Labels_RoleDescriptions,
  Web_Labels_RoleLabels,
  Web_Labels_RolePermissions,
  Web_Labels_ScopesForRole_Returns,
  Web_Labels_ScopesForRole_Role,
  Web_Labels_ServerAccessLabel_AllServers,
  Web_Labels_ServerAccessLabel_Names,
  Web_Labels_ServerAccessLabel_Returns,
  Web_Labels_ServerAccessLabel_Server,
  Web_Labels_ServerAccessLabel_ServerIds,
  Web_Labels_ServerAccessLabel_Servers,
  Web_Labels_ServiceStaleMilliseconds,
} from '@/types/web/labels.d.ts';

/**
 * Labels - Role Labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const roleLabels: Web_Labels_RoleLabels = {
  administrator: 'Administrator',
  operator: 'Operator',
  owner: 'Owner',
  viewer: 'Viewer',
};

/**
 * Labels - Role Descriptions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const roleDescriptions: Web_Labels_RoleDescriptions = {
  administrator: 'Everything, including adding and changing users.',
  operator: 'Changes features and starts or stops the bot.',
  viewer: 'Sees everything but can\'t change anything.',
};

/**
 * Labels - Role Permissions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rolePermissions: Web_Labels_RolePermissions = {
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
 * Labels - Permissions For.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_PermissionsFor_Principal} principal - Principal.
 *
 * @returns {Web_Labels_PermissionsFor_Returns}
 *
 * @since 4.0.0
 */
export const permissionsFor = (principal: Web_Labels_PermissionsFor_Principal): Web_Labels_PermissionsFor_Returns => {
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
 * Labels - Scopes For Role.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_ScopesForRole_Role} role - Role.
 *
 * @returns {Web_Labels_ScopesForRole_Returns}
 *
 * @since 4.0.0
 */
export const scopesForRole = (role: Web_Labels_ScopesForRole_Role): Web_Labels_ScopesForRole_Returns => {
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
 * Labels - Category Labels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const categoryLabels: Web_Labels_CategoryLabels = {
  automation: 'Automation',
  community: 'Community',
  integrations: 'Integrations',
  moderation: 'Moderation',
  safety: 'Safety',
  web: 'Web',
};

/**
 * Labels - Category Order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const categoryOrder: Web_Labels_CategoryOrder = [
  'safety',
  'moderation',
  'automation',
  'community',
  'integrations',
  'web',
];

// serverAccessLabel says which servers a user can see, by name when there are few.

/**
 * Labels - Server Access Label.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_ServerAccessLabel_AllServers} allServers - All servers.
 * @param {Web_Labels_ServerAccessLabel_ServerIds}  serverIds  - Server ids.
 * @param {Web_Labels_ServerAccessLabel_Servers}    servers    - Servers.
 *
 * @returns {Web_Labels_ServerAccessLabel_Returns}
 *
 * @since 4.0.0
 */
export const serverAccessLabel = (allServers: Web_Labels_ServerAccessLabel_AllServers, serverIds: Web_Labels_ServerAccessLabel_ServerIds, servers: Web_Labels_ServerAccessLabel_Servers): Web_Labels_ServerAccessLabel_Returns => {
  if (allServers === true) {
    return 'All servers';
  }

  if (serverIds.length === 0) {
    return 'No servers';
  }

  const names: Web_Labels_ServerAccessLabel_Names = serverIds.map((serverId) => {
    const server: Web_Labels_ServerAccessLabel_Server = servers.find((candidate) => candidate['id'] === serverId);

    return (server === undefined) ? serverId : server['name'];
  });

  return (names.length <= 2) ? names.join(', ') : `${names.length} servers`;
};

// describeBot reduces the bot's state to what the shell and overview show at a glance.

/**
 * Labels - Describe Bot.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_Labels_DescribeBot_Bot} bot - Bot.
 *
 * @returns {Web_Labels_DescribeBot_Returns}
 *
 * @since 4.0.0
 */
export const describeBot = (bot: Web_Labels_DescribeBot_Bot): Web_Labels_DescribeBot_Returns => {
  if (bot === null) {
    return {
      detail: 'Loading…',
      label: 'Bot',
      tone: 'idle',
    };
  }

  if (bot['tokenConfigured'] === false) {
    return {
      detail: 'Add the bot token',
      label: 'Not connected',
      tone: 'blocked',
    };
  }

  const status: Web_Labels_DescribeBot_Status = bot['status'].toLowerCase();

  if (
    status === 'ready'
    || status === 'running'
    || status === 'online'
  ) {
    return {
      detail: 'Connected to Discord',
      label: 'Online',
      tone: 'protected',
    };
  }

  if (
    status === 'starting'
    || status === 'connecting'
    || status === 'reconnecting'
    || status === 'restarting'
  ) {
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

  if (
    status === 'failed'
    || status === 'error'
    || status === 'configuration_required'
  ) {
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
 * Labels - Service Stale Milliseconds.
 *
 * A service that hasn't written a heartbeat for this long counts as not responding.
 * It matches the limit the server uses for the bot's own status.
 *
 * @since 4.0.0
 */
const serviceStaleMilliseconds: Web_Labels_ServiceStaleMilliseconds = 90_000;

// describeService reduces a service's latest heartbeat to a status word for the Services list.

/**
 * Labels - Describe Service.
 *
 * A service that checks in on time shows only its status, since its heartbeat is recent.
 * Once it stops checking in, the heartbeat's age says when it was last heard from.
 *
 * @param {Web_Labels_DescribeService_Service} service - Service.
 * @param {Web_Labels_DescribeService_Now}     [now]   - Now.
 *
 * @returns {Web_Labels_DescribeService_Returns}
 *
 * @since 4.0.0
 */
export const describeService = (service: Web_Labels_DescribeService_Service, now: Web_Labels_DescribeService_Now = Date.now()): Web_Labels_DescribeService_Returns => {
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

  const status: Web_Labels_DescribeService_Status = (service['status'] ?? '').toLowerCase();

  if (
    status === 'ready'
    || status === 'running'
    || status === 'online'
  ) {
    return {
      detail: null,
      label: 'Ready',
      tone: 'protected',
    };
  }

  if (
    status === 'starting'
    || status === 'connecting'
    || status === 'reconnecting'
    || status === 'restarting'
  ) {
    return {
      detail: null,
      label: 'Starting',
      tone: 'connecting',
    };
  }

  if (
    status === 'failed'
    || status === 'error'
    || status === 'configuration_required'
  ) {
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
