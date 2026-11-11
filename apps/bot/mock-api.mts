import {
  createHash,
  randomBytes,
  randomUUID,
} from 'node:crypto';
import { readFileSync } from 'node:fs';

import {
  Secret,
  TOTP,
} from 'otpauth';
import { toDataURL } from 'qrcode';

import type {
  IncomingMessage,
  ServerResponse,
} from 'node:http';

import type {
  Plugin,
  ViteDevServer,
} from 'vite';

/**
 * Mock API - Mock role.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockRole = 'administrator' | 'operator' | 'owner' | 'viewer';

/**
 * Mock API - Mock permission.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockPermission = 'bot:control' | 'configuration:write' | 'users:manage';

/**
 * Mock API - Mock scope.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockScope = 'bot:control' | 'features:read' | 'features:write' | 'logs:read';

/**
 * Mock API - Mock component.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockComponent = 'bot' | 'web' | 'worker';

/**
 * Mock API - Mock level.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockLevel = 'debug' | 'error' | 'info' | 'warn';

/**
 * Mock API - Mock issue.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockIssue = {
  field: string
  message: string
  path: string[]
};

/**
 * Mock API - Mock user.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockUser = {
  allServers: boolean
  createdAt: string
  enabled: boolean
  id: string
  lastSignInAt: string | null
  password: string
  recoveryCodes: string[]
  role: MockRole
  serverIds: string[]
  totpEnabled: boolean
  totpPending: boolean
  username: string
};

/**
 * Mock API - Mock token.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockToken = {
  createdAt: string
  expiresAt: string | null
  hash: string
  id: string
  lastUsedAt: string | null
  name: string
  scopes: MockScope[]
  userId: string
};

/**
 * Mock API - Mock passkey.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockPasskey = {
  createdAt: string
  hostname: string | null
  id: string
  lastUsedAt: string | null
  name: string
};

/**
 * Mock API - Mock principal.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockPrincipal = {
  kind: 'session' | 'token'
  token: MockToken | null
  user: MockUser
};

/**
 * Mock API - Mock server.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockServer = {
  available: boolean
  boostTier: number
  iconUrl: string | null
  id: string
  memberCount: number
  name: string
};

/**
 * Mock API - Mock channel.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockChannel = {
  available: boolean
  id: string
  name: string
  type: number
};

/**
 * Mock API - Mock discord role.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockDiscordRole = {
  available: boolean
  id: string
  name: string
  position: number
};

/**
 * Mock API - Mock catalog entry.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockCatalogEntry = {
  category: string
  description: string
  key: string
  name: string
};

/**
 * Mock API - Mock feature state.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockFeatureState = {
  configuration: unknown
  enabled: boolean
  revision: number
  updatedAt: string | null
};

/**
 * Mock API - Mock legacy result.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockLegacyResult = {
  discordToken?: string | undefined
  guildIdentifier?: string | undefined
  report: Record<string, unknown>
  secrets: {
    key: string
    value: string
  }[]
  settings: {
    features?: Record<string, {
      configuration: unknown
      enabled: boolean
    }>
  }
};

/**
 * Mock API - Mock modules.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockModules = {
  blank: (value: unknown) => unknown
  catalog: MockCatalogEntry[]
  editorFor: (featureKey: string) => Record<string, unknown>
  exampleFor: ((featureKey: string, starterSettings: unknown) => unknown) | null
  importLegacy: ((text: string, enable: boolean) => MockLegacyResult) | null
  real: boolean
  validate: ((featureKey: string, configuration: unknown, resolve: (key: string) => string | undefined) => MockIssue[]) | null
};

/**
 * Mock API - Mock backup purpose.
 *
 * Names the sensitive operation one fresh-authentication grant can authorize.
 * A separate union prevents export and import grants from being mixed.
 *
 * @since UNRELEASED
 */
type MockBackupPurpose = 'export' | 'import';

/**
 * Mock API - Mock backup feature.
 *
 * Keeps one feature's portable settings and opened secrets together.
 * The mock uses the same shape as the version-one file.
 *
 * @since UNRELEASED
 */
type MockBackupFeature = {
  configuration: unknown
  enabled: boolean
  key: string
  secrets: Record<string, string>
};

/**
 * Mock API - Mock backup server features.
 *
 * Groups portable feature state by Discord server identifier.
 * Runtime server names remain outside the export.
 *
 * @since UNRELEASED
 */
type MockBackupServerFeatures = {
  features: MockBackupFeature[]
  serverId: string
  timeZone: string
};

/**
 * Mock API - Mock backup notification.
 *
 * Opens one notification target's secret fields for the temporary file.
 * All values are invented and exist only in the mock process.
 *
 * @since UNRELEASED
 */
type MockBackupNotification = {
  events: string[]
  id: string
  name: string
  secrets: Record<string, string>
  service: MockNotificationService
  settings: Record<string, string>
};

/**
 * Mock API - Mock backup access token.
 *
 * Carries the one-way token material that can be restored without exposing a token.
 * The raw access token never appears in an export.
 *
 * @since UNRELEASED
 */
type MockBackupAccessToken = {
  expiresAt: string | null
  id: string
  name: string
  scopes: MockScope[]
  tokenHash: string
};

/**
 * Mock API - Mock backup document.
 *
 * Mirrors the browser and server version-one export contract.
 * Optional properties correspond to the selected export sections.
 *
 * @since UNRELEASED
 */
type MockBackupDocument = {
  accessTokens?: MockBackupAccessToken[] | undefined
  appVersion: string
  connection?: {
    botToken: string | null
    desiredState: 'running' | 'stopped'
  } | undefined
  exportedAt: string
  features?: MockBackupServerFeatures[] | undefined
  format: 'discord-stonker-bot-export'
  notifications?: MockBackupNotification[] | undefined
  version: 1
};

/**
 * Mock API - Mock backup source.
 *
 * Represents either source card in the shared import wizard.
 * Legacy text continues through the established config.json mapper.
 *
 * @since UNRELEASED
 */
type MockBackupSource = {
  document: MockBackupDocument
  type: 'export'
} | {
  configuration: string
  enableFeatures: boolean
  serverId: string
  type: 'legacy'
};

/**
 * Mock API - Mock backup summary.
 *
 * Holds the counts rendered by Settings and Review.
 * Apply returns the same counts after mutation.
 *
 * @since UNRELEASED
 */
type MockBackupSummary = {
  accessTokens: {
    added: number
    skipped: number
  }
  connection: 'added' | 'replaced' | 'skipped'
  features: {
    features: number
    servers: number
  }
  notifications: {
    added: number
    replaced: number
  }
};

/**
 * Mock API - Mock backup grant record.
 *
 * Retains only the grant digest with its browser-session binding.
 * Expiry and purpose are checked before sensitive work begins.
 *
 * @since UNRELEASED
 */
type MockBackupGrantRecord = {
  expiresAt: number
  purpose: MockBackupPurpose
  sessionId: string
};

/**
 * Mock API - Mock backup passkey ceremony.
 *
 * Binds the passkey prompt to the requesting session and purpose.
 * Account-management ceremonies use their own map.
 *
 * @since UNRELEASED
 */
type MockBackupPasskeyCeremony = MockBackupGrantRecord;

/**
 * Mock API - Mock invite page.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockInvitePage = {
  accentColor: string
  bannerImageId: string | null
  buttonLabel: string
  description: string
  footerText: string
  logo: 'custom' | 'none' | 'server'
  logoImageId: string | null
  revision: number
  showBoostTier: boolean
  showMemberCount: boolean
  theme: 'dark' | 'light' | 'system'
  title: string
  updatedAt: string | null
};

/**
 * Mock API - Mock image.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockImage = {
  contentType: string
  data: Buffer
  serverId: string
};

/**
 * Mock API - Mock log entry.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockLogEntry = {
  component: MockComponent
  context: Record<string, unknown>
  event: string
  id: string
  level: MockLevel
  occurredAt: string
};

/**
 * Mock API - Mock bot.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockBot = {
  activeFeatures: string[]
  applicationId: string | null
  configurationErrors: string[]
  desiredState: 'running' | 'stopped'
  resolution: string | null
  status: string
  tokenConfigured: boolean
  userTag: string | null
};

/**
 * Mock API - Mock notification service.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockNotificationService = 'apprise' | 'discord' | 'email' | 'gotify' | 'matrix' | 'ntfy' | 'ntfy-reverse-proxy' | 'pushover' | 'slack' | 'telegram' | 'webhook';

/**
 * Mock API - Mock notification.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockNotification = {
  createdAt: string
  events: string[]
  id: string
  lastAttemptAt: string | null
  lastError: string | null
  name: string
  secrets: Record<string, true>
  secretsMissing: string[]
  service: MockNotificationService
  settings: Record<string, string>
  updatedAt: string
};

// MockNotificationField is one service field: [key, message when missing, secret, required].

/**
 * Mock API - Mock notification field.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockNotificationField = [string, string, boolean, boolean];

// MockNotificationInput is a checked create or edit body, with the optional secrets to clear.

/**
 * Mock API - Mock notification input.
 *
 * Names this local contract so fixtures and handlers agree.
 * Keeping one shape prevents the surrounding workflow from drifting.
 *
 * @since 4.0.0
 */
type MockNotificationInput = Pick<MockNotification, 'events' | 'name' | 'secrets' | 'service' | 'settings'> & {
  clearSecrets: string[]
};

// Each service's fields: [key, message when missing, secret, required].

/**
 * Mock API - Notification fields.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationFields: Record<MockNotificationService, [string, string, boolean, boolean][]> = {
  'apprise': [
    [
      'url',
      'Enter the Apprise URL.',
      true,
      true,
    ],
    [
      'urls',
      '',
      true,
      false,
    ],
  ],
  'discord': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'email': [
    [
      'host',
      'Enter the SMTP server.',
      false,
      true,
    ],
    [
      'port',
      'Enter a port number.',
      false,
      true,
    ],
    [
      'security',
      'Choose STARTTLS, TLS, or none.',
      false,
      true,
    ],
    [
      'username',
      '',
      false,
      false,
    ],
    [
      'password',
      '',
      true,
      false,
    ],
    [
      'from',
      'Enter the address to send from.',
      false,
      true,
    ],
    [
      'to',
      'Enter the address to send to.',
      false,
      true,
    ],
  ],
  'gotify': [
    [
      'url',
      'Enter the server URL.',
      false,
      true,
    ],
    [
      'token',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'matrix': [
    [
      'homeserverUrl',
      'Enter the homeserver URL.',
      false,
      true,
    ],
    [
      'roomId',
      'Enter the room ID.',
      false,
      true,
    ],
    [
      'accessToken',
      'Enter the access token.',
      true,
      true,
    ],
  ],
  'ntfy': [
    [
      'url',
      'Enter the topic URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'ntfy-reverse-proxy': [
    [
      'url',
      'Enter the context URL.',
      false,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
  'pushover': [
    [
      'userKey',
      'Enter the user key.',
      true,
      true,
    ],
    [
      'appToken',
      'Enter the app token.',
      true,
      true,
    ],
  ],
  'slack': [[
    'webhookUrl',
    'Enter the webhook URL.',
    true,
    true,
  ]],
  'telegram': [
    [
      'botToken',
      'Enter the bot token.',
      true,
      true,
    ],
    [
      'chatId',
      'Enter the chat ID.',
      false,
      true,
    ],
  ],
  'webhook': [
    [
      'url',
      'Enter the URL.',
      true,
      true,
    ],
    [
      'token',
      '',
      true,
      false,
    ],
  ],
};

/**
 * Mock API - Notification events.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notificationEvents: {
  defaultEnabled: boolean
  description: string
  key: string
  label: string
}[] = [
  {
    defaultEnabled: true,
    description: 'The app started without its key and removed what it locked.',
    key: 'secrets-removed',
    label: 'Saved secrets were removed',
  },
  {
    defaultEnabled: true,
    description: 'Ten failed sign-ins from one address paused sign-in from it.',
    key: 'sign-in-locked',
    label: 'Sign-in locked',
  },
  {
    defaultEnabled: true,
    description: 'Discord refused the Bot Token, or the bot couldn\'t start.',
    key: 'bot-sign-in-failed',
    label: 'Bot can\'t sign in',
  },
  {
    defaultEnabled: true,
    description: 'The bot lost its connection to Discord.',
    key: 'bot-disconnected',
    label: 'Bot disconnected',
  },
  {
    defaultEnabled: true,
    description: 'The bot is back on Discord after a drop.',
    key: 'bot-reconnected',
    label: 'Bot reconnected',
  },
  {
    defaultEnabled: true,
    description: 'A scheduled post, feed delivery, or webhook failed on every try.',
    key: 'job-failed',
    label: 'Job gave up',
  },
];

/**
 * Mock API - Setup code.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const setupCode: string = 'K7Q2M-XR9TD-P4W8N';

/**
 * Mock API - Mock password.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const mockPassword: string = 'mock password 123';

/**
 * Mock API - Minute.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const minute: number = 60 * 1000;

/**
 * Mock API - Started at.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const startedAt: number = Date.now();

/**
 * Mock API - Level order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const levelOrder: MockLevel[] = [
  'debug',
  'info',
  'warn',
  'error',
];

/**
 * Mock API - Scope order.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const scopeOrder: MockScope[] = [
  'bot:control',
  'features:read',
  'features:write',
  'logs:read',
];

/**
 * Mock API - Role permissions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rolePermissions: Record<MockRole, MockPermission[]> = {
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

/**
 * Mock API - Permission messages.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const permissionMessages: Record<MockPermission, string> = {
  'bot:control': 'Your role can\'t start or stop the bot.',
  'configuration:write': 'Your role can\'t change settings.',
  'users:manage': 'Your role can\'t manage users.',
};

// Google's published reCAPTCHA v2 test key: the box always passes and says it's for testing.

/**
 * Mock API - Recaptcha test site key.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const recaptchaTestSiteKey: string = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

/**
 * Mock API - Lounge icon.
 *
 * The Stonker Lounge server's icon: Lucide's sofa on the purple tile.
 * Lucide Icons v1.61.0 - ISC License, Copyright (c) 2026 Lucide Icons and Contributors.
 *
 * @since 4.0.0
 */
const loungeIcon: string = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#6250d9"/><g transform="translate(14 14) scale(1.5)" fill="none" stroke="#fff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></g></svg>').toString('base64')}`;

/**
 * Mock API - Servers.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const servers: MockServer[] = [
  {
    available: true,
    boostTier: 2,
    iconUrl: loungeIcon,
    id: '1197999049190674442',
    memberCount: 1204,
    name: 'Stonker Lounge',
  },
  {
    available: true,
    boostTier: 0,
    iconUrl: null,
    id: '1215553108329484288',
    memberCount: 86,
    name: 'Book Club',
  },
];

/**
 * Mock API - Lounge ID.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const loungeId: string = '1197999049190674442';

/**
 * Mock API - Club ID.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const clubId: string = '1215553108329484288';

/**
 * Mock API - Channels.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const channels: Record<string, MockChannel[]> = {
  [clubId]: [
    {
      available: true,
      id: '1215553108786663424',
      name: 'club-chat',
      type: 0,
    },
    {
      available: true,
      id: '1215553108786663425',
      name: 'reading-list',
      type: 0,
    },
    {
      available: true,
      id: '1215553108786663426',
      name: 'book-ideas',
      type: 15,
    },
    {
      available: true,
      id: '1215553108786663427',
      name: 'club-alerts',
      type: 0,
    },
  ],
  [loungeId]: [
    {
      available: true,
      id: '1197999049811439729',
      name: 'general',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326487',
      name: 'mod-log',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326486',
      name: 'rules',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326490',
      name: 'announcements',
      type: 5,
    },
    {
      available: true,
      id: '1209383231867326491',
      name: 'memes',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326492',
      name: 'off-topic',
      type: 0,
    },
    {
      available: true,
      id: '1209383231867326493',
      name: 'welcome',
      type: 0,
    },
    {
      available: false,
      id: '1209383231867326499',
      name: 'old-news',
      type: 0,
    },
  ],
};

/**
 * Mock API - Roles.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const roles: Record<string, MockDiscordRole[]> = {
  [clubId]: [
    {
      available: true,
      id: '1215553108329484289',
      name: 'Club Lead',
      position: 3,
    },
    {
      available: true,
      id: '1215553108329484290',
      name: 'Reader',
      position: 2,
    },
    {
      available: true,
      id: '1215553108329484291',
      name: 'Guest',
      position: 1,
    },
  ],
  [loungeId]: [
    {
      available: true,
      id: '1209383231867327001',
      name: 'Admin',
      position: 9,
    },
    {
      available: true,
      id: '1209383231867327002',
      name: 'Moderator',
      position: 8,
    },
    {
      available: true,
      id: '1209383231867327003',
      name: 'Verified',
      position: 5,
    },
    {
      available: true,
      id: '1209383231867327004',
      name: 'Member',
      position: 4,
    },
    {
      available: true,
      id: '1209383231867327005',
      name: 'Muted',
      position: 2,
    },
    {
      available: false,
      id: '1209383231867327006',
      name: 'Retired Booster',
      position: 1,
    },
  ],
};

/**
 * Mock API - Owner.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let owner: MockUser | null = null;

/**
 * Mock API - User sequence.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let userSequence: number = 20;

/**
 * Mock API - Users.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const users: MockUser[] = [];
// Each account's saved passkeys; ones added in the mock are kept until it restarts.

/**
 * Mock API - Passkeys by user.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeysByUser: Map<string, MockPasskey[]> = new Map();

/**
 * Mock API - Passkey ceremonies.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const passkeyCeremonies: Map<string, string> = new Map();

/**
 * Mock API - Backup grants.
 *
 * Stores only fresh-authentication grant digests for the mock process lifetime.
 * Raw grants are returned once and are never retained here.
 *
 * @since UNRELEASED
 */
const backupGrants: Map<string, MockBackupGrantRecord> = new Map();

/**
 * Mock API - Backup passkey ceremonies.
 *
 * Keeps short-lived passkey bindings separate from account-management ceremonies.
 * Each binding expires after the same five-minute confirmation window.
 *
 * @since UNRELEASED
 */
const backupPasskeyCeremonies: Map<string, MockBackupPasskeyCeremony> = new Map();

/**
 * Mock API - Tokens.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const tokens: MockToken[] = [];

/**
 * Mock API - Sessions.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const sessions: Map<string, {
  csrfToken: string
  userId: string
}> = new Map();

/**
 * Mock API - Pending challenge.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let pendingChallenge: {
  challenge: string
  failures: number
  userId: string
} | null = null;

// MOCK_KEY_REPLACED=true starts as if the credential key had been lost, to show the notice.

/**
 * Mock API - Key replaced.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const keyReplaced: boolean = process.env['MOCK_KEY_REPLACED'] === 'true';

/**
 * Mock API - Bot.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const bot: MockBot = {
  activeFeatures: [],
  applicationId: '1205206968699592503',
  configurationErrors: [],
  desiredState: 'running',
  resolution: null,
  status: 'ready',
  tokenConfigured: !keyReplaced,
  userTag: 'stonker-bot',
};

/**
 * Mock API - Debug logging.
 *
 * The one Debug logging switch the bot, the control panel, and the worker share.
 * It starts off, as it does in a new container.
 *
 * @since UNRELEASED
 */
let debugLogging: boolean = false;

/**
 * Mock API - Removed secrets.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let removedSecrets: {
  featureKey?: string
  featureName?: string
  kind: 'authenticator' | 'bot-token' | 'feature-secrets' | 'notification'
  name?: string
  notificationId?: string
  removedAt: string
  serverId?: string
  serverName?: string
  userId?: string
}[] = (keyReplaced) ? [
  {
    kind: 'bot-token',
    removedAt: new Date().toISOString(),
  },
  {
    featureKey: 'message-copiers',
    featureName: 'Message copiers',
    kind: 'feature-secrets',
    removedAt: new Date().toISOString(),
    serverId: '1197999049190674442',
    serverName: 'Stonker Lounge',
  },
] : [];

/**
 * Mock API - Bot timer.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let botTimer: NodeJS.Timeout | undefined = undefined;

/**
 * Mock API - Notifications.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const notifications: MockNotification[] = [
  {
    createdAt: new Date(startedAt - (45 * 24 * 60 * minute)).toISOString(),
    events: [
      'secrets-removed',
      'sign-in-locked',
      'bot-sign-in-failed',
      'bot-disconnected',
      'bot-reconnected',
      'job-failed',
    ],
    id: 'ntf-3e5a7c9b1d2f4a60',
    lastAttemptAt: new Date(startedAt - (2 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'My phone',
    secrets: {},
    secretsMissing: [],
    service: 'ntfy',
    settings: { url: 'https://ntfy.sh/stonker-bot-alerts' },
    updatedAt: new Date(startedAt - (45 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (20 * 24 * 60 * minute)).toISOString(),
    events: [
      'bot-disconnected',
      'bot-reconnected',
      'job-failed',
    ],
    id: 'ntf-7d1f3b5a9c2e4f68',
    lastAttemptAt: new Date(startedAt - (26 * 60 * minute)).toISOString(),
    lastError: null,
    name: 'Mod alerts',
    secrets: { webhookUrl: true },
    secretsMissing: [],
    service: 'discord',
    settings: {},
    updatedAt: new Date(startedAt - (20 * 24 * 60 * minute)).toISOString(),
  },
  {
    createdAt: new Date(startedAt - (6 * 24 * 60 * minute)).toISOString(),
    events: [
      'secrets-removed',
      'bot-sign-in-failed',
      'bot-disconnected',
    ],
    id: 'ntf-9b2d4f6a8c0e1a35',
    lastAttemptAt: new Date(startedAt - (3 * 24 * 60 * minute)).toISOString(),
    lastError: 'HTTP 502: Bad Gateway',
    name: 'Homelab alerts',
    secrets: { token: true },
    secretsMissing: [],
    service: 'ntfy-reverse-proxy',
    settings: { url: 'https://alerts.ntfy.example.com' },
    updatedAt: new Date(startedAt - (6 * 24 * 60 * minute)).toISOString(),
  },
];

// A lost key removes every destination's saved secrets, as the server does, and pauses
// those destinations until the secrets are entered again.
if (keyReplaced) {
  for (const notification of [...notifications].sort((left: MockNotification, right: MockNotification): number => left.name.localeCompare(right.name))) {
    const secretKeys: string[] = Object.keys(notification.secrets).sort();

    if (secretKeys.length === 0) {
      continue;
    }

    notification.secrets = {};
    notification.secretsMissing = secretKeys;
    removedSecrets.push({
      kind: 'notification',
      name: notification.name,
      notificationId: notification.id,
      removedAt: new Date().toISOString(),
    });
  }
}

/**
 * Mock API - Logs.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const logs: MockLogEntry[] = [];

/**
 * Mock API - Log sequence.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let logSequence: number = 41_000;

/**
 * Mock API - Feature states.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const featureStates: Map<string, Map<string, MockFeatureState>> = new Map();

/**
 * Mock API - Secret stores.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const secretStores: Map<string, Map<string, string>> = new Map();

/**
 * Mock API - Examples.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const examples: Map<string, unknown> = new Map();

/**
 * Mock API - Features ready.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let featuresReady: Promise<void> | null = null;

/**
 * Mock API - Vite server.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let viteServer: ViteDevServer | null = null;

/**
 * Mock API - Fallback notice shown.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
let fallbackNoticeShown: boolean = false;

/**
 * Mock API - Invite pages.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const invitePages: Map<string, MockInvitePage> = new Map();

/**
 * Mock API - Images.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const images: Map<string, MockImage> = new Map();

/**
 * Mock API - Invite attempts.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const inviteAttempts: Map<string, number[]> = new Map();

// Small helpers.

/**
 * Mock API - Now iso.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const nowIso = (): string => new Date().toISOString();

/**
 * Mock API - Ago iso.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const agoIso = (minutes: number): string => new Date(Date.now() - (minutes * minute)).toISOString();

// snowflakeAt makes a Discord ID for a moment the way Discord does, milliseconds since 2015 in the
// high bits, so message and user IDs look real and sort by time.

/**
 * Mock API - Snowflake at.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const snowflakeAt = (time: number): string => String((BigInt(time - 1_420_070_400_000) * 4_194_304n) + BigInt(Math.floor(Math.random() * 4_194_304)));

/**
 * Mock API - Checks whether record.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Mock API - Digest.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const digest = (value: string): string => createHash('sha256').update(value).digest('hex');

/**
 * Mock API - User ID for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const userIdFor = (sequence: number): string => String(sequence);

/**
 * Mock API - Permissions of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const permissionsOf = (user: MockUser): MockPermission[] => rolePermissions[user.role];

/**
 * Mock API - Server visible.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const serverVisible = (user: MockUser, serverId: string): boolean => user.allServers || user.serverIds.includes(serverId);

// Codes are compared like the server does: any letter case, with or without spaces and dashes.

/**
 * Mock API - Normalizes code.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const normalizeCode = (value: string): string => value.toUpperCase().replace(/[\s-]/gu, '');

// Usernames follow the rule every appliance shares: 3 to 64 characters, starting with a letter or number.

/**
 * Mock API - Username issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const usernameIssue = (value: string): string => {
  if (value === '') {
    return 'Enter a username.';
  }

  return (/^[A-Za-z0-9][A-Za-z0-9._-]{2,63}$/u.test(value)) ? '' : 'Use 3 to 64 letters, numbers, periods, underscores, or hyphens, starting with a letter or number.';
};

/**
 * Mock API - Password issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const passwordIssue = (value: unknown): string => {
  if (typeof value !== 'string' || value.length < 12) {
    return 'Use at least 12 characters.';
  }

  return (value.length > 1024) ? 'Use 1024 characters or fewer.' : '';
};

// newRecoveryCodes makes ten codes the way the server does: ten characters without look-alikes, split 5-5.

/**
 * Mock API - New recovery codes.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const newRecoveryCodes = (): string[] => Array.from({ length: 10 }, (): string => {
  const code: string = [...randomBytes(10)].map((byte: number): string => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'.charAt(byte % 32)).join('');

  return `${code.slice(0, 5)}-${code.slice(5)}`;
});

/**
 * Mock API - Adds server URL.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const addServerUrl = (): string | null => ((bot.applicationId === null) ? null : `https://discord.com/oauth2/authorize?client_id=${bot.applicationId}&integration_type=0&scope=bot%20applications.commands`);

// Logs.

/**
 * Mock API - Writes log.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const writeLog = (component: MockComponent, level: MockLevel, event: string, context: Record<string, unknown> = {}, minutesAgo: number = 0): void => {
  logSequence += 1;
  logs.push({
    component,
    context,
    event,
    id: String(logSequence),
    level,
    occurredAt: agoIso(minutesAgo),
  });
  logs.splice(0, Math.max(0, logs.length - 3000));
};

/**
 * Mock API - Seed logs.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const seedLogs = (): void => {
  // Real events from the bot, worker, and web processes, with the fields they log.
  const entries: [MockComponent, MockLevel, string, Record<string, unknown>, number][] = [
    [
      'web',
      'info',
      'web_ready',
      {
        host: '::',
        port: 22604,
      },
      190,
    ],
    [
      'worker',
      'info',
      'worker_ready',
      { workerIdentifier: '3f9c2a7b1d04' },
      189,
    ],
    [
      'bot',
      'info',
      'gateway_ready',
      {
        activeFeatures: [
          'auto-replies',
          'message-copiers',
          'rss-feeds',
          'scammer-alerts',
          'schedule-posts',
          'sync-roles',
        ],
        configurationErrors: [],
        generation: 1,
        guildCount: 2,
        shardCount: 1,
        userTag: 'stonker-bot',
      },
      188,
    ],
    [
      'bot',
      'info',
      'application_commands_registered',
      {
        commandCount: 6,
        guildIdentifier: loungeId,
      },
      187,
    ],
    [
      'worker',
      'info',
      'rss_feed_processed',
      {
        discoveredCount: 3,
        enqueuedCount: 1,
        feedKey: 'community-news',
        guildIdentifier: loungeId,
        name: 'Reviewed community news feed',
      },
      120,
    ],
    [
      'bot',
      'info',
      'message_copier_delivered',
      {
        destinationKind: 'webhook',
        messageIdentifier: snowflakeAt(Date.now() - (95 * minute)),
        ruleName: 'Copy reviewed announcements',
      },
      95,
    ],
    [
      'bot',
      'error',
      'message_copier_delivery_failed',
      {
        destinationKind: 'webhook',
        messageIdentifier: snowflakeAt(Date.now() - (94 * minute)),
        ruleName: 'Copy reviewed announcements',
      },
      94,
    ],
    [
      'worker',
      'info',
      'discord_message_delivered',
      {
        channelIdentifier: '1209383231867326490',
        messageIdentifier: snowflakeAt(Date.now() - (60 * minute)),
        ruleName: 'Weekday morning reminder',
      },
      60,
    ],
    [
      'bot',
      'info',
      'auto_reply_sent',
      {
        messageIdentifier: snowflakeAt(Date.now() - (41 * minute)),
        ruleName: 'Help and command discovery',
      },
      41,
    ],
    [
      'bot',
      'info',
      'role_sync_reconciled',
      {
        addedRoleIdentifiers: ['1209383231867327003'],
        removedRoleIdentifiers: [],
        userIdentifier: snowflakeAt(Date.UTC(2022, 8, 3, 14, 20)),
      },
      33,
    ],
    [
      'bot',
      'info',
      'scammer_alert_sent',
      {
        messageIdentifier: snowflakeAt(Date.now() - (12 * minute)),
        ruleName: 'Giveaway scams',
        userIdentifier: snowflakeAt(Date.now() - (2 * 24 * 60 * minute)),
      },
      12,
    ],
    [
      'worker',
      'info',
      'notification_delivered',
      {
        event: 'bot-reconnected',
        targetId: 'ntf-7d1f3b5a9c2e4f68',
      },
      5,
    ],
  ];

  for (const [
    component,
    level,
    event,
    context,
    minutesAgo,
  ] of entries) {
    writeLog(component, level, event, context, minutesAgo);
  }
};

// The live feed: the bot and worker keep writing while the console is open.

/**
 * Mock API - Live events.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const liveEvents: [MockComponent, MockLevel, string, () => Record<string, unknown>][] = [
  [
    'bot',
    'info',
    'message_copier_delivered',
    (): Record<string, unknown> => ({
      destinationKind: 'webhook',
      messageIdentifier: snowflakeAt(Date.now()),
      ruleName: 'Copy reviewed announcements',
    }),
  ],
  [
    'bot',
    'info',
    'auto_reply_sent',
    (): Record<string, unknown> => ({
      messageIdentifier: snowflakeAt(Date.now()),
      ruleName: 'Help and command discovery',
    }),
  ],
  [
    'bot',
    'info',
    'configured_thread_unarchived',
    (): Record<string, unknown> => ({
      ruleName: 'Daily discussion',
      threadIdentifier: '1209383231867326495',
    }),
  ],
  [
    'worker',
    'info',
    'rss_feed_not_modified',
    (): Record<string, unknown> => ({
      feedKey: 'community-news',
      guildIdentifier: loungeId,
      name: 'Reviewed community news feed',
    }),
  ],
  [
    'bot',
    'info',
    'impersonator_alert_sent',
    (): Record<string, unknown> => ({
      ruleName: 'Protect staff names',
      userIdentifier: snowflakeAt(Date.now() - (Math.floor(Math.random() * 30) * 24 * 60 * minute)),
    }),
  ],
];

/**
 * Mock API - Writes live log.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const writeLiveLog = (): void => {
  if (bot.desiredState !== 'running' || bot.status !== 'ready') {
    return;
  }

  const pick: [MockComponent, MockLevel, string, () => Record<string, unknown>] | undefined = liveEvents[Math.floor(Math.random() * liveEvents.length)];

  if (pick !== undefined) {
    writeLog(pick[0], pick[1], pick[2], pick[3]());
  }
};

/**
 * Mock API - Matches log filters.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const matchesLogFilters = (entry: MockLogEntry, component: string, minimumLevel: MockLevel, search: string): boolean => {
  if (entry.component !== component || levelOrder.indexOf(entry.level) < levelOrder.indexOf(minimumLevel)) {
    return false;
  }

  if (search === '') {
    return true;
  }

  const needle: string = search.toLowerCase();

  return entry.event.toLowerCase().includes(needle) || JSON.stringify(entry.context).toLowerCase().includes(needle);
};

// Users and tokens.

/**
 * Mock API - Seed accounts.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const seedAccounts = (claimed: MockUser): void => {
  const seeds: [string, MockRole, boolean, string[], boolean, boolean, number | null][] = [
    [
      'avery',
      'administrator',
      true,
      [],
      true,
      true,
      130,
    ],
    [
      'riley',
      'administrator',
      false,
      [clubId],
      true,
      false,
      2_900,
    ],
    [
      'jordan',
      'operator',
      true,
      [],
      true,
      true,
      45,
    ],
    [
      'sam',
      'viewer',
      false,
      [loungeId],
      true,
      false,
      null,
    ],
    [
      'casey',
      'operator',
      false,
      [loungeId],
      false,
      false,
      20_000,
    ],
  ];

  users.push(claimed);

  // The owner has two saved passkeys, so the Sign-in and security page shows a realistic list.
  passkeysByUser.set(claimed.id, [
    {
      createdAt: agoIso(38 * 24 * 60),
      hostname: 'bot.example.com',
      id: 'pk-wE5rT8yU1iO4pA7s',
      lastUsedAt: agoIso(90),
      name: 'MacBook Pro',
    },
    {
      createdAt: agoIso(12 * 24 * 60),
      hostname: 'bot.example.com',
      id: 'pk-dF2gH6jK9lZ3xC5v',
      lastUsedAt: agoIso(3 * 24 * 60),
      name: 'iPhone',
    },
  ]);

  seeds.forEach(([
    username,
    role,
    allServers,
    serverIds,
    enabled,
    totpEnabled,
    lastSignIn,
  ], index: number): void => {
    users.push({
      allServers,
      createdAt: agoIso(40_000 - (index * 5_000)),
      enabled,
      id: userIdFor(index + 2),
      lastSignInAt: (lastSignIn === null) ? null : agoIso(lastSignIn),
      password: mockPassword,
      recoveryCodes: (totpEnabled) ? newRecoveryCodes() : [],
      role,
      serverIds,
      totpEnabled,
      totpPending: false,
      username,
    });
  });

  tokens.push(
    {
      createdAt: agoIso(30 * 24 * 60),
      expiresAt: null,
      hash: digest(`dsb_${'grafana'.repeat(6)}a`),
      id: 'tok-3f9a1c2b7d4e5f60',
      lastUsedAt: agoIso(4),
      name: 'Grafana dashboard',
      scopes: [
        'features:read',
        'logs:read',
      ],
      userId: claimed.id,
    },
    {
      createdAt: agoIso(9 * 24 * 60),
      expiresAt: new Date(Date.now() + (81 * 24 * 60 * minute)).toISOString(),
      hash: digest(`dsb_${'deploys'.repeat(6)}a`),
      id: 'tok-8b2e4d6f1a3c5e70',
      lastUsedAt: null,
      name: 'Deploy script',
      scopes: [
        'bot:control',
        'features:read',
        'features:write',
      ],
      userId: claimed.id,
    },
  );
};

// editableBy says whether a manager may change an account: never the owner or themself,
// and a manager limited to some servers only reaches people inside them.

/**
 * Mock API - Editable by.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const editableBy = (manager: MockUser, user: MockUser): boolean => (
  user.role !== 'owner'
  && user.id !== manager.id
  && (manager.allServers || (!user.allServers && user.serverIds.every((serverId: string): boolean => manager.serverIds.includes(serverId))))
);

/**
 * Mock API - User resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const userResource = (user: MockUser, manager: MockUser): Record<string, unknown> => ({
  allServers: user.allServers,
  createdAt: user.createdAt,
  editable: editableBy(manager, user),
  enabled: user.enabled,
  id: user.id,
  lastSignInAt: user.lastSignInAt,
  passkeys: (passkeysByUser.get(user.id) ?? []).length,
  role: user.role,
  serverIds: (user.allServers) ? [] : user.serverIds,
  twoFactor: user.totpEnabled,
  username: user.username,
});

/**
 * Mock API - Token resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const tokenResource = (token: MockToken): Record<string, unknown> => ({
  createdAt: token.createdAt,
  expiresAt: token.expiresAt,
  id: token.id,
  lastUsedAt: token.lastUsedAt,
  name: token.name,
  scopes: token.scopes,
});

/**
 * Mock API - Role rank.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const roleRank: Record<MockRole, number> = {
  administrator: 1,
  operator: 2,
  owner: 0,
  viewer: 3,
};

// Features.

// Hand-made editors for three features, used while the real editor module can't load.

/**
 * Mock API - Fallback editors.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackEditors: Record<string, Record<string, unknown>> = {
  'bump-threads': {
    'items': {
      properties: {
        channel: {
          properties: {
            'channel-id': {
              'title': 'Channel ID',
              'type': 'string',
              'x-widget': 'channel',
            },
            'description': {
              title: 'Description',
              type: 'string',
            },
          },
          required: ['channel-id'],
          title: 'Channel',
          type: 'object',
        },
        name: {
          maxLength: 100,
          minLength: 1,
          title: 'Name',
          type: 'string',
        },
        thread: {
          properties: {
            'description': {
              title: 'Description',
              type: 'string',
            },
            'thread-id': {
              'title': 'Thread ID',
              'type': 'string',
              'x-widget': 'discord-id',
            },
          },
          required: ['thread-id'],
          title: 'Thread',
          type: 'object',
        },
      },
      required: [
        'name',
        'channel',
        'thread',
      ],
      type: 'object',
    },
    'type': 'array',
    'x-item-label': 'Thread',
    'x-item-title-key': 'name',
  },
  'message-copiers': {
    'items': {
      properties: {
        'destinations': {
          'items': {
            'oneOf': [
              {
                properties: {
                  channel: {
                    'properties': {
                      'channel-id': {
                        'title': 'Channel ID',
                        'type': 'string',
                        'x-widget': 'channel',
                      },
                    },
                    'required': ['channel-id'],
                    'title': 'Channel',
                    'type': 'object',
                    'x-inline': true,
                  },
                  description: {
                    title: 'Description',
                    type: 'string',
                  },
                  method: {
                    const: 'discord-channel',
                    type: 'string',
                  },
                },
                required: [
                  'method',
                  'channel',
                ],
                title: 'Discord channel',
                type: 'object',
              },
              {
                properties: {
                  description: {
                    title: 'Description',
                    type: 'string',
                  },
                  method: {
                    const: 'discord-webhook',
                    type: 'string',
                  },
                  webhook: {
                    properties: {
                      'avatar-url': {
                        'format': 'uri',
                        'title': 'Avatar URL',
                        'type': 'string',
                        'x-widget': 'url',
                      },
                      'url': {
                        'properties': {
                          $secret: {
                            type: 'string',
                          },
                        },
                        'required': ['$secret'],
                        'title': 'URL',
                        'type': 'object',
                        'x-widget': 'secret',
                      },
                      'username': {
                        title: 'Username',
                        type: 'string',
                      },
                    },
                    required: ['url'],
                    title: 'Webhook',
                    type: 'object',
                  },
                },
                required: [
                  'method',
                  'webhook',
                ],
                title: 'Discord webhook',
                type: 'object',
              },
            ],
            'x-discriminator': 'method',
          },
          'minItems': 1,
          'title': 'Destinations',
          'type': 'array',
          'x-item-label': 'Destination',
        },
        'include-attachments': {
          default: false,
          title: 'Include attachments',
          type: 'boolean',
        },
        'message': {
          'maxLength': 2000,
          'title': 'Message',
          'type': 'string',
          'x-variables': [
            {
              description: 'Message text',
              token: '%MESSAGE_CONTENT%',
            },
            {
              description: 'Message link',
              token: '%MESSAGE_URL%',
            },
            {
              description: 'Member name',
              token: '%MEMBER_TAG%',
            },
          ],
          'x-widget': 'variables',
        },
        'name': {
          title: 'Name',
          type: 'string',
        },
        'regex': {
          properties: {
            flags: {
              'title': 'Flags',
              'type': 'string',
              'x-widget': 'pattern',
            },
            pattern: {
              'title': 'Pattern',
              'type': 'string',
              'x-widget': 'pattern',
            },
          },
          required: ['pattern'],
          title: 'Match',
          type: 'object',
        },
      },
      required: [
        'name',
        'regex',
        'destinations',
      ],
      type: 'object',
    },
    'type': 'array',
    'x-item-label': 'Copier',
    'x-item-title-key': 'name',
  },
  'remove-affiliates': {
    'properties': {
      'channel': {
        'properties': {
          'channel-id': {
            'title': 'Channel ID',
            'type': 'string',
            'x-widget': 'channel',
          },
        },
        'required': ['channel-id'],
        'title': 'Monitored channel',
        'type': 'object',
        'x-inline': true,
      },
      'direct-message-payload': {
        properties: {
          content: {
            'maxLength': 2000,
            'title': 'Content',
            'type': 'string',
            'x-widget': 'textarea',
          },
        },
        title: 'Member notice',
        type: 'object',
      },
      'excluded-roles': {
        'items': {
          properties: {
            'role-id': {
              'title': 'Role ID',
              'type': 'string',
              'x-widget': 'role',
            },
          },
          required: ['role-id'],
          type: 'object',
        },
        'title': 'Exempt roles',
        'type': 'array',
        'x-item-key': 'role-id',
        'x-widget': 'role-list',
      },
      'platforms': {
        'items': {
          properties: {
            platform: {
              title: 'Platform',
              type: 'string',
            },
            regex: {
              properties: {
                flags: {
                  'title': 'Flags',
                  'type': 'string',
                  'x-widget': 'pattern',
                },
                pattern: {
                  'title': 'Pattern',
                  'type': 'string',
                  'x-widget': 'pattern',
                },
              },
              required: ['pattern'],
              title: 'Match',
              type: 'object',
            },
          },
          required: [
            'platform',
            'regex',
          ],
          type: 'object',
        },
        'title': 'Link patterns',
        'type': 'array',
        'x-item-label': 'Platform',
        'x-item-title-key': 'platform',
      },
    },
    'required': [
      'channel',
      'platforms',
    ],
    'type': 'object',
    'x-sections': [
      {
        description: 'Clean up links in this Discord channel.',
        key: 'channel',
        title: 'Monitored channel',
      },
      {
        description: 'Recognize affiliate and campaign parameters by platform.',
        key: 'platforms',
        title: 'Link patterns',
      },
      {
        description: 'Explain privately why the member should post a clean link.',
        key: 'direct-message-payload',
        title: 'Member notice',
      },
      {
        description: 'Members with any of these roles can post affiliate links.',
        key: 'excluded-roles',
        title: 'Exempt roles',
      },
    ],
  },
};

/**
 * Mock API - Fallback catalog.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackCatalog: MockCatalogEntry[] = [
  [
    'anti-raid',
    'safety',
    'Anti-raid',
    'Ban known raid accounts on join and give screened members their roles.',
  ],
  [
    'auto-replies',
    'community',
    'Auto replies',
    'Reply to matching member messages with configured responses.',
  ],
  [
    'broadcast-alerts',
    'community',
    'Event broadcasts',
    'Announce Discord scheduled-event lifecycle changes.',
  ],
  [
    'bump-threads',
    'automation',
    'Thread bumping',
    'Keep selected active threads discoverable.',
  ],
  [
    'detect-suspicious-words',
    'safety',
    'Suspicious words',
    'Alert moderators when configured suspicious phrases appear.',
  ],
  [
    'impersonator-alerts',
    'safety',
    'Impersonator alerts',
    'Detect names that may impersonate trusted identities.',
  ],
  [
    'message-copiers',
    'automation',
    'Message copiers',
    'Copy matching messages to approved destinations.',
  ],
  [
    'message-proxies',
    'automation',
    'Message proxies',
    'Re-publish bot messages through configured webhooks.',
  ],
  [
    'regex-rules',
    'moderation',
    'Regex rules',
    'Remove messages that break configured pattern rules.',
  ],
  [
    'remove-affiliates',
    'moderation',
    'Affiliate cleanup',
    'Remove affiliate and campaign-tracking links.',
  ],
  [
    'role-messages',
    'community',
    'Role messages',
    'Send messages when members gain or lose roles.',
  ],
  [
    'rss-feeds',
    'integrations',
    'RSS feeds',
    'Post new items from RSS feeds.',
  ],
  [
    'scammer-alerts',
    'safety',
    'Scammer alerts',
    'Alert moderators about likely scam messages.',
  ],
  [
    'schedule-posts',
    'automation',
    'Scheduled posts',
    'Post messages on a schedule.',
  ],
  [
    'server-tools',
    'moderation',
    'Server tools',
    'Slash commands for bulk moderation work.',
  ],
  [
    'snitch',
    'moderation',
    'Audit notifications',
    'Report member and message changes to moderators.',
  ],
  [
    'sync-roles',
    'moderation',
    'Role synchronization',
    'Keep related roles in step.',
  ],
  [
    'toggle-perms',
    'moderation',
    'Permission toggles',
    'Change channel permissions on a schedule.',
  ],
  [
    'web-applications',
    'web',
    'Web applications',
    'Serve the invite page and signed webhooks.',
  ],
].map(([
  key,
  category,
  name,
  description,
]: string[
]): MockCatalogEntry => ({
  category: category ?? 'automation',
  description: description ?? '',
  key: key ?? '',
  name: name ?? '',
}));

/**
 * Mock API - Fallback configurations.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackConfigurations: Record<string, unknown> = {
  'bump-threads': [{
    channel: { 'channel-id': '1197999049811439729' },
    name: 'Daily discussion',
    thread: { 'thread-id': '000000000000000000' },
  }],
  'message-copiers': [{
    'destinations': [
      {
        channel: { 'channel-id': '1197999049811439729' },
        description: 'Publish to general',
        method: 'discord-channel',
      },
      {
        description: 'Publish to the partner server',
        method: 'discord-webhook',
        webhook: {
          url: { $secret: 'message-copiers.0.destinations.1.webhook.url' },
          username: 'Stonker Announcements',
        },
      },
    ],
    'include-attachments': true,
    'message': '%MESSAGE_CONTENT%\n\nSource: %MESSAGE_URL%',
    'name': 'Copy reviewed announcements',
    'regex': {
      flags: 'i',
      pattern: '^\\[ANNOUNCEMENT\\]\\s+(.+)$',
    },
  }],
  'web-applications': {
    'invite-generator': {
      options: {
        'max-age': 300,
        'max-uses': 1,
        'path': '/invite',
      },
      recaptcha: {
        'secret-key': { $secret: 'web-applications.invite-generator.recaptcha.secret-key' },
        'site-key': recaptchaTestSiteKey,
      },
    },
  },
  'remove-affiliates': {
    'channel': { 'channel-id': '1197999049811439729' },
    'direct-message-payload': { content: 'Your post contained an affiliate link. Please share a clean link instead.' },
    'excluded-roles': [{ 'role-id': '1209383231867327002' }],
    'platforms': [{
      platform: 'Amazon associate tags',
      regex: {
        flags: 'i',
        pattern: 'https?://(?:www\\.)?amazon\\.[^/\\s]+/[^\\s]*[?&]tag=[^\\s&#]+',
      },
    }],
  },
};

// blankSecrets empties every secret reference, like the server's example values.

/**
 * Mock API - Blank secrets.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const blankSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(blankSecrets);
  }

  if (!isRecord(value)) {
    return value;
  }

  if (typeof value['$secret'] === 'string') {
    return { $secret: '' };
  }

  return Object.fromEntries(Object.entries(value).map(([
    key,
    entry,
  ]: [string, unknown,
  ]): [string, unknown] => [
    key,
    blankSecrets(entry),
  ]));
};

/**
 * Mock API - Fallback modules.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const fallbackModules = (): MockModules => ({
  blank: blankSecrets,
  catalog: fallbackCatalog,
  editorFor: (featureKey: string): Record<string, unknown> => fallbackEditors[featureKey] ?? {
    description: 'The mock has no form for this feature while the real editor module can\'t load.',
  },
  exampleFor: null,
  importLegacy: null,
  real: false,
  validate: null,
});

// loadModules reads the real catalog, editors, import, and validation code through Vite, so the
// mock shows exactly what the server will. Server files can be mid-edit; then it falls back.

/**
 * Mock API - Loads modules.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const loadModules = async (): Promise<MockModules> => {
  if (viteServer === null) {
    return fallbackModules();
  }

  try {
    const catalogModule: Record<string, unknown> = await viteServer.ssrLoadModule('/src/lib/feature-catalog.ts');
    const editorModule: Record<string, unknown> = await viteServer.ssrLoadModule('/src/lib/feature-editor.ts');
    const importModule: Record<string, unknown> = await viteServer.ssrLoadModule('/src/lib/legacy-import.ts');
    const validationModule: Record<string, unknown> = await viteServer.ssrLoadModule('/src/lib/feature-configuration-validation.ts');
    const secretsModule: Record<string, unknown> = await viteServer.ssrLoadModule('/src/lib/feature-secrets.ts');
    const getFeatureCatalog: unknown = catalogModule['getFeatureCatalog'];
    const getFeatureEditor: unknown = editorModule['getFeatureEditor'];
    const getFeatureExample: unknown = editorModule['getFeatureExample'];
    const importLegacyConfiguration: unknown = importModule['importLegacyConfiguration'];
    const validateFeatureConfiguration: unknown = validationModule['validateFeatureConfiguration'];
    const blankSecretReferences: unknown = secretsModule['blankSecretReferences'];

    if (typeof getFeatureCatalog !== 'function' || typeof getFeatureEditor !== 'function') {
      throw new Error('The feature catalog or editor module is missing its exports.');
    }

    return {
      blank: (typeof blankSecretReferences === 'function') ? (value: unknown): unknown => blankSecretReferences(value) : blankSecrets,
      catalog: (getFeatureCatalog() as MockCatalogEntry[]).map((entry: MockCatalogEntry): MockCatalogEntry => ({
        category: entry.category,
        description: entry.description,
        key: entry.key,
        name: entry.name,
      })),
      editorFor: (featureKey: string): Record<string, unknown> => getFeatureEditor(featureKey) as Record<string, unknown>,
      exampleFor: (typeof getFeatureExample === 'function') ? (featureKey: string, starterSettings: unknown): unknown => getFeatureExample(featureKey, starterSettings) : null,
      importLegacy: (typeof importLegacyConfiguration === 'function') ? (text: string, enable: boolean): MockLegacyResult => importLegacyConfiguration(text, enable) as MockLegacyResult : null,
      real: true,
      validate: (typeof validateFeatureConfiguration === 'function') ? (featureKey: string, configuration: unknown, resolve: (key: string) => string | undefined): MockIssue[] => validateFeatureConfiguration(featureKey, configuration, resolve) as MockIssue[] : null,
    };
  } catch (error) {
    if (!fallbackNoticeShown) {
      fallbackNoticeShown = true;
      viteServer.config.logger.warn(`  Mock API: the real feature modules didn't load, so three hand-made editors stand in. (${(error instanceof Error) ? error.message : String(error)})`);
    }

    return fallbackModules();
  }
};

/**
 * Mock API - States for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const statesFor = (serverId: string): Map<string, MockFeatureState> => {
  const existing: Map<string, MockFeatureState> | undefined = featureStates.get(serverId);

  if (existing !== undefined) {
    return existing;
  }

  const created: Map<string, MockFeatureState> = new Map();

  featureStates.set(serverId, created);

  return created;
};

/**
 * Mock API - Secrets for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const secretsFor = (serverId: string): Map<string, string> => {
  const existing: Map<string, string> | undefined = secretStores.get(serverId);

  if (existing !== undefined) {
    return existing;
  }

  const created: Map<string, string> = new Map();

  secretStores.set(serverId, created);

  return created;
};

/**
 * Mock API - State of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const stateOf = (serverId: string, featureKey: string): MockFeatureState => {
  const states: Map<string, MockFeatureState> = statesFor(serverId);
  const existing: MockFeatureState | undefined = states.get(featureKey);

  if (existing !== undefined) {
    return existing;
  }

  const created: MockFeatureState = {
    configuration: null,
    enabled: false,
    revision: 0,
    updatedAt: null,
  };

  states.set(featureKey, created);

  return created;
};

// The lounge starts from the repository's example config; the club has two features set up.

/**
 * Mock API - Prepare features.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const prepareFeatures = async (): Promise<void> => {
  const modules: MockModules = await loadModules();
  const loungeOn: string[] = [
    'auto-replies',
    'bump-threads',
    'detect-suspicious-words',
    'message-copiers',
    'remove-affiliates',
    'rss-feeds',
    'web-applications',
  ];
  let exampleText: string = '';

  try {
    exampleText = readFileSync(new URL('./examples/legacy-config.e2e.json', import.meta.url), 'utf-8');
  } catch {
    exampleText = '';
  }

  let imported: MockLegacyResult | null = null;

  if (modules.importLegacy !== null && exampleText !== '') {
    try {
      imported = modules.importLegacy(exampleText, false);
    } catch {
      imported = null;
    }
  }

  const importedFeatures: Record<string, {
    configuration: unknown
    enabled: boolean
  }> = (imported === null) ? {} : (imported.settings.features ?? {});

  for (const entry of modules.catalog) {
    const configuration: unknown = (importedFeatures[entry.key] === undefined) ? fallbackConfigurations[entry.key] : importedFeatures[entry.key]?.configuration;

    if (configuration !== undefined && configuration !== null) {
      examples.set(entry.key, (modules.exampleFor !== null && imported !== null) ? modules.exampleFor(entry.key, imported.settings) : modules.blank(structuredClone(configuration)));

      Object.assign(stateOf(loungeId, entry.key), {
        configuration: structuredClone(configuration),
        enabled: loungeOn.includes(entry.key),
        revision: 2,
        updatedAt: agoIso(3 * 24 * 60),
      });
    }
  }

  for (const secret of (imported === null) ? [] : imported.secrets) {
    secretsFor(loungeId).set(secret.key, secret.value);
  }

  if (imported === null) {
    secretsFor(loungeId).set('message-copiers.0.destinations.1.webhook.url', 'https://discord.com/api/webhooks/1/mock');
    secretsFor(loungeId).set('web-applications.invite-generator.recaptcha.secret-key', 'mock-recaptcha-secret');
  }

  for (const featureKey of [
    'bump-threads',
    'schedule-posts',
  ]) {
    const example: unknown = examples.get(featureKey);

    if (example !== undefined) {
      Object.assign(stateOf(clubId, featureKey), {
        configuration: structuredClone(example),
        enabled: featureKey === 'bump-threads',
        revision: 1,
        updatedAt: agoIso(26 * 60),
      });
    }
  }

  bot.activeFeatures = loungeOn;
};

/**
 * Mock API - Ensure features.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const ensureFeatures = async (): Promise<void> => {
  if (featuresReady === null) {
    featuresReady = prepareFeatures();
  }

  await featuresReady;
};

/**
 * Mock API - Feature summary.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const featureSummary = (entry: MockCatalogEntry, serverId: string): Record<string, unknown> => {
  const state: MockFeatureState = stateOf(serverId, entry.key);

  return {
    category: entry.category,
    configured: state.configuration !== null,
    description: entry.description,
    enabled: state.enabled,
    key: entry.key,
    name: entry.name,
    revision: state.revision,
    updatedAt: state.updatedAt,
  };
};

// collectReferences finds every { "$secret": … } object with its JSON pointer and path.

/**
 * Mock API - Collect references.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const collectReferences = (value: unknown, path: string[] = []): {
  key: string
  path: string[]
}[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry: unknown, index: number) => collectReferences(entry, [
      ...path,
      String(index),
    ]));
  }

  if (!isRecord(value)) {
    return [];
  }

  if (typeof value['$secret'] === 'string') {
    return [{
      key: value['$secret'],
      path,
    }];
  }

  return Object.entries(value).flatMap(([
    key,
    entry,
  ]: [string, unknown,
  ]) => collectReferences(entry, [
    ...path,
    key,
  ]));
};

/**
 * Mock API - String list.
 *
 * Narrows one legacy report field to displayable strings.
 * Non-array values become an empty list.
 *
 * @param {unknown} value - Value.
 *
 * @returns {string[]}
 *
 * @since UNRELEASED
 */
const stringList = (value: unknown): string[] => (Array.isArray(value)) ? value.map(String) : [];

/**
 * Mock API - Feature Display Name.
 *
 * Resolves a legacy feature key through the same catalog as the Features page.
 * A missing mock entry falls back to its key so the preview remains usable.
 *
 * @param {string}      featureKey - Feature key.
 * @param {MockModules} modules    - Modules.
 *
 * @returns {string}
 *
 * @since UNRELEASED
 */
const featureDisplayName = (featureKey: string, modules: MockModules): string => {
  const feature: MockCatalogEntry | undefined = modules.catalog.find((candidate: MockCatalogEntry): boolean => candidate.key === featureKey);

  return (feature === undefined) ? featureKey : feature.name;
};

/**
 * Mock API - Legacy Warning Label.
 *
 * Mirrors the production preview labels for skipped legacy values.
 * Specific names keep the mock wizard representative of the real API.
 *
 * @param {string} warning - Warning.
 *
 * @returns {string}
 *
 * @since UNRELEASED
 */
const legacyWarningLabel = (warning: string): string => {
  if (warning.startsWith('Twitter/X keys ')) {
    return 'Twitter/X keys';
  }

  if (warning.startsWith('Twitter/X feeds ')) {
    return 'Twitter/X feeds';
  }

  if (warning.includes('message-copier destination ')) {
    return 'Message copier destination on Twitter/X';
  }

  if (warning.includes('message-copier destinations ')) {
    return 'Message copier destinations on Twitter/X';
  }

  if (warning.includes('message-copier rule ')) {
    return 'Message copier rule on Twitter/X';
  }

  if (warning.includes('message-copier rules ')) {
    return 'Message copier rules on Twitter/X';
  }

  if (warning.startsWith('Unrecognized legacy sections ')) {
    return 'Unsupported legacy sections';
  }

  return 'Legacy settings';
};

/**
 * Mock API - Empty backup summary.
 *
 * Starts a comparison result before optional sections are counted.
 * Preview and apply share this normalized shape.
 *
 * @returns {MockBackupSummary}
 *
 * @since UNRELEASED
 */
const emptyBackupSummary = (): MockBackupSummary => ({
  accessTokens: {
    added: 0,
    skipped: 0,
  },
  connection: 'skipped',
  features: {
    features: 0,
    servers: 0,
  },
  notifications: {
    added: 0,
    replaced: 0,
  },
});

/**
 * Mock API - Issues backup grant.
 *
 * Returns one opaque grant while retaining only its digest in memory.
 * The binding expires after five minutes.
 *
 * @param {string}            sessionId - Session id.
 * @param {MockBackupPurpose} purpose   - Purpose.
 *
 * @returns {{ expiresAt: string; grant: string }}
 *
 * @since UNRELEASED
 */
const issueBackupGrant = (sessionId: string, purpose: MockBackupPurpose): {
  expiresAt: string
  grant: string
} => {
  const grant: string = `bkg_${randomBytes(32).toString('base64url')}`;
  const expiresAt: number = Date.now() + (5 * minute);
  backupGrants.set(digest(grant), {
    expiresAt,
    purpose,
    sessionId: digest(sessionId),
  });
  return {
    expiresAt: new Date(expiresAt).toISOString(),
    grant,
  };
};

/**
 * Mock API - Consumes backup grant.
 *
 * Accepts a matching, unexpired, session- and purpose-bound grant once.
 * Mismatched grants remain unusable by the caller.
 *
 * @param {unknown}           value     - Value.
 * @param {string}            sessionId - Session id.
 * @param {MockBackupPurpose} purpose   - Purpose.
 *
 * @returns {boolean}
 *
 * @since UNRELEASED
 */
const consumeBackupGrant = (value: unknown, sessionId: string, purpose: MockBackupPurpose): boolean => {
  if (typeof value !== 'string') {
    return false;
  }
  const key: string = digest(value);
  const record: MockBackupGrantRecord | undefined = backupGrants.get(key);
  if (record === undefined || record.expiresAt <= Date.now()) {
    backupGrants.delete(key);
    return false;
  }
  if (record.sessionId !== digest(sessionId) || record.purpose !== purpose) {
    return false;
  }
  backupGrants.delete(key);
  return true;
};

/**
 * Mock API - Parses backup source.
 *
 * Checks the discriminator and fixed envelope before the mock reads a wizard source.
 * The real browser and server perform the complete strict schema validation.
 *
 * @param {unknown} value - Value.
 *
 * @returns {MockBackupSource | null}
 *
 * @since UNRELEASED
 */
const parseMockBackupSource = (value: unknown): MockBackupSource | null => {
  if (!isRecord(value)) {
    return null;
  }
  if (value['type'] === 'export' && isRecord(value['document'])) {
    const document: Record<string, unknown> = value['document'];
    if (document['format'] === 'discord-stonker-bot-export' && document['version'] === 1) {
      return value as MockBackupSource;
    }
    return null;
  }
  if (
    value['type'] === 'legacy'
    && typeof value['configuration'] === 'string'
    && typeof value['enableFeatures'] === 'boolean'
    && typeof value['serverId'] === 'string'
  ) {
    return value as MockBackupSource;
  }
  return null;
};

/**
 * Mock API - Creates backup document.
 *
 * Builds the same portable sections as the real export route with invented secrets.
 * Runtime-only user and Discord data never enter the document.
 *
 * @param {Record<string, unknown>} sections - Sections.
 * @param {MockUser}                user     - User.
 *
 * @returns {MockBackupDocument}
 *
 * @since UNRELEASED
 */
const createMockBackupDocument = (sections: Record<string, unknown>, user: MockUser): MockBackupDocument => {
  const document: MockBackupDocument = {
    appVersion: '4.0.0',
    exportedAt: nowIso(),
    format: 'discord-stonker-bot-export',
    version: 1,
  };
  if (sections['connection'] === true) {
    document.connection = {
      botToken: (bot.tokenConfigured) ? 'mock-discord-bot-token-northwind' : null,
      desiredState: bot.desiredState,
    };
  }
  if (sections['features'] === true) {
    document.features = servers.map((server: MockServer): MockBackupServerFeatures => ({
      features: [...statesFor(server.id)].map(([
        key,
        state]: [string, MockFeatureState,
      ]): MockBackupFeature => {
        const store: Map<string, string> = secretsFor(server.id);
        const secrets: Record<string, string> = {};
        for (const reference of collectReferences(state.configuration)) {
          const secret: string | undefined = store.get(reference.key);
          if (secret !== undefined) {
            secrets[reference.key] = secret;
          }
        }
        return {
          configuration: structuredClone(state.configuration),
          enabled: state.enabled,
          key,
          secrets,
        };
      }),
      serverId: server.id,
      timeZone: 'America/New_York',
    }));
  }
  if (sections['notifications'] === true) {
    document.notifications = notifications.map((notification: MockNotification): MockBackupNotification => ({
      events: [...notification.events],
      id: notification.id,
      name: notification.name,
      secrets: Object.fromEntries(Object.keys(notification.secrets).map((key: string): [string, string] => [
        key,
        `mock-${notification.service}-${key}-secret`,
      ])),
      service: notification.service,
      settings: { ...notification.settings },
    }));
  }
  if (sections['accessTokens'] === true) {
    document.accessTokens = tokens.filter((token: MockToken): boolean => token.userId === user.id).map((token: MockToken): MockBackupAccessToken => ({
      expiresAt: token.expiresAt,
      id: token.id,
      name: token.name,
      scopes: [...token.scopes],
      tokenHash: token.hash,
    }));
  }
  return document;
};

/**
 * Mock API - Previews backup source.
 *
 * Produces the authoritative comparison for either wizard source without mutation.
 * Human-readable values mirror the real server response.
 *
 * @param {MockBackupSource} source  - Source.
 * @param {MockUser}         user    - User.
 * @param {MockModules}      modules - Modules.
 *
 * @returns {Record<string, unknown>}
 *
 * @since UNRELEASED
 */
const previewMockBackup = (source: MockBackupSource, user: MockUser, modules: MockModules): Record<string, unknown> => {
  const summary: MockBackupSummary = emptyBackupSummary();
  if (source.type === 'legacy') {
    if (modules.importLegacy === null) {
      throw new Error('The older config.json importer is unavailable.');
    }
    const result: MockLegacyResult = modules.importLegacy(source.configuration, source.enableFeatures);
    if (result.guildIdentifier !== undefined && result.guildIdentifier !== source.serverId) {
      throw new Error('This config.json belongs to another Discord server. Switch to that server first.');
    }
    const recognized: string[] = stringList(result.report['recognizedFeatureKeys']);
    const enabled: string[] = stringList(result.report['enabledFeatureKeys']);
    const invalid: string[] = stringList(result.report['invalidFeatureKeys']);
    const unsupported: string[] = stringList(result.report['unknownSections']);
    const warnings: string[] = stringList(result.report['warnings']);
    summary.connection = (result.discordToken === undefined) ? 'skipped' : 'replaced';
    summary.features = {
      features: recognized.length,
      servers: 1,
    };
    const sections: Record<string, unknown>[] = [{
      file: `${String(recognized.length)} feature${(recognized.length === 1) ? '' : 's'} for 1 server`,
      here: 'Current settings for this server',
      id: 'features',
      label: 'Features',
      willImport: true,
    }];
    if (result.discordToken !== undefined) {
      sections.unshift({
        file: 'Bot Token set',
        here: 'Current connection',
        id: 'connection',
        label: 'Connection',
        willImport: true,
      });
    }
    const featuresRequiringFixes: Record<string, string>[] = invalid.map((key: string): Record<string, string> => ({
      id: `needs-attention-${key}`,
      label: featureDisplayName(key, modules),
      reason: 'Imported switched off. Fix its settings on the Features page before turning it on.',
    }));
    return {
      appVersion: null,
      excluded: [
        ...unsupported.map((key: string): Record<string, string> => ({
          id: `unsupported-${key}`,
          label: key,
          reason: 'This older section is not supported.',
        })),
        ...warnings.map((warning: string, index: number): Record<string, string> => ({
          id: `warning-${String(index)}`,
          label: legacyWarningLabel(warning),
          reason: warning,
        })),
      ],
      exportedAt: null,
      legacy: {
        featuresRequiringFixes,
        featuresThatTurnOn: enabled.length,
      },
      sections,
      source: 'legacy',
      summary,
    };
  }
  const document: MockBackupDocument = source.document;
  const sections: Record<string, unknown>[] = [];
  if (document.connection === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as it is',
      id: 'connection',
      label: 'Connection',
      reason: 'This export does not include Connection.',
      willImport: false,
    });
  } else {
    summary.connection = (bot.tokenConfigured) ? 'replaced' : 'added';
    sections.push({
      file: `${(document.connection.desiredState === 'running') ? 'Running' : 'Stopped'}, ${(document.connection.botToken === null) ? 'no Bot Token' : 'Bot Token set'}`,
      here: `${(bot.desiredState === 'running') ? 'Running' : 'Stopped'}, ${(bot.tokenConfigured) ? 'Bot Token set' : 'no Bot Token'}`,
      id: 'connection',
      label: 'Connection',
      willImport: true,
    });
  }
  if (document.features === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as they are',
      id: 'features',
      label: 'Features',
      reason: 'This export does not include Features.',
      willImport: false,
    });
  } else {
    summary.features = {
      features: document.features.reduce((count: number, server: MockBackupServerFeatures): number => count + server.features.length, 0),
      servers: document.features.length,
    };
    const currentFeatures: number = [...featureStates.values()].reduce((count: number, states: Map<string, MockFeatureState>): number => count + states.size, 0);
    sections.push({
      file: `${String(summary.features.features)} feature${(summary.features.features === 1) ? '' : 's'} for ${String(summary.features.servers)} server${(summary.features.servers === 1) ? '' : 's'}`,
      here: `${String(currentFeatures)} feature${(currentFeatures === 1) ? '' : 's'} for ${String(featureStates.size)} server${(featureStates.size === 1) ? '' : 's'}`,
      id: 'features',
      label: 'Features',
      willImport: true,
    });
  }
  if (document.notifications === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as they are',
      id: 'notifications',
      label: 'Notifications',
      reason: 'This export does not include Notifications.',
      willImport: false,
    });
  } else {
    const names: Set<string> = new Set(notifications.map((notification: MockNotification): string => notification.name.toLocaleLowerCase()));
    summary.notifications.replaced = document.notifications.filter((notification: MockBackupNotification): boolean => names.has(notification.name.toLocaleLowerCase())).length;
    summary.notifications.added = document.notifications.length - summary.notifications.replaced;
    sections.push({
      file: `${String(document.notifications.length)} notification${(document.notifications.length === 1) ? '' : 's'}`,
      here: `${String(notifications.length)} notification${(notifications.length === 1) ? '' : 's'}`,
      id: 'notifications',
      label: 'Notifications',
      willImport: true,
    });
  }
  const ownTokens: MockToken[] = tokens.filter((token: MockToken): boolean => token.userId === user.id);
  if (document.accessTokens === undefined) {
    sections.push({
      file: 'Not included',
      here: 'Kept as they are',
      id: 'accessTokens',
      label: 'Access tokens',
      reason: 'This export does not include Access tokens.',
      willImport: false,
    });
  } else {
    const names: Set<string> = new Set(ownTokens.map((token: MockToken): string => token.name.toLocaleLowerCase()));
    const hashes: Set<string> = new Set(ownTokens.map((token: MockToken): string => token.hash));
    summary.accessTokens.skipped = document.accessTokens.filter((token: MockBackupAccessToken): boolean => names.has(token.name.toLocaleLowerCase()) || hashes.has(token.tokenHash)).length;
    summary.accessTokens.added = document.accessTokens.length - summary.accessTokens.skipped;
    sections.push({
      file: `${String(document.accessTokens.length)} access token${(document.accessTokens.length === 1) ? '' : 's'}`,
      here: `${String(ownTokens.length)} access token${(ownTokens.length === 1) ? '' : 's'}`,
      id: 'accessTokens',
      label: 'Access tokens',
      willImport: true,
    });
  }
  return {
    appVersion: document.appVersion,
    excluded: [],
    exportedAt: document.exportedAt,
    sections,
    source: 'export',
    summary,
  };
};

/**
 * Mock API - Applies backup source.
 *
 * Mutates the in-memory console state after review and fresh authentication.
 * The returned summary contains no secret values.
 *
 * @param {MockBackupSource} source  - Source.
 * @param {MockUser}         user    - User.
 * @param {MockModules}      modules - Modules.
 *
 * @returns {Record<string, unknown>}
 *
 * @since UNRELEASED
 */
const applyMockBackup = (source: MockBackupSource, user: MockUser, modules: MockModules): Record<string, unknown> => {
  const preview: Record<string, unknown> = previewMockBackup(source, user, modules);
  const summary: MockBackupSummary = preview['summary'] as MockBackupSummary;
  const importedSections: string[] = [];
  if (source.type === 'legacy') {
    if (modules.importLegacy === null) {
      throw new Error('The older config.json importer is unavailable.');
    }
    const result: MockLegacyResult = modules.importLegacy(source.configuration, source.enableFeatures);
    for (const [
      featureKey,
      feature,
    ] of Object.entries(result.settings.features ?? {})) {
      const state: MockFeatureState = stateOf(source.serverId, featureKey);
      state.configuration = structuredClone(feature.configuration);
      state.enabled = feature.enabled;
      state.revision += 1;
      state.updatedAt = nowIso();
    }
    for (const secret of result.secrets) {
      secretsFor(source.serverId).set(secret.key, secret.value);
    }
    if (result.discordToken !== undefined) {
      bot.tokenConfigured = true;
      importedSections.push('connection');
    }
    importedSections.push('features');
    return {
      ...summary,
      importedSections,
    };
  }
  const document: MockBackupDocument = source.document;
  if (document.connection !== undefined) {
    bot.desiredState = document.connection.desiredState;
    bot.tokenConfigured = document.connection.botToken !== null;
    importedSections.push('connection');
  }
  if (document.features !== undefined) {
    for (const server of document.features) {
      const states: Map<string, MockFeatureState> = statesFor(server.serverId);
      const secrets: Map<string, string> = secretsFor(server.serverId);
      states.clear();
      secrets.clear();
      for (const feature of server.features) {
        states.set(feature.key, {
          configuration: structuredClone(feature.configuration),
          enabled: feature.enabled,
          revision: 1,
          updatedAt: nowIso(),
        });
        for (const [
          key,
          value,
        ] of Object.entries(feature.secrets)) {
          secrets.set(key, value);
        }
      }
    }
    bot.activeFeatures = [...statesFor(loungeId)].filter((entry: [string, MockFeatureState]): boolean => entry[1].enabled).map((entry: [string, MockFeatureState]): string => entry[0]);
    importedSections.push('features');
  }
  if (document.notifications !== undefined) {
    const usedIds: Set<string> = new Set(notifications.map((notification: MockNotification): string => notification.id));
    for (const portable of document.notifications) {
      const existing: MockNotification | undefined = notifications.find((notification: MockNotification): boolean => notification.name.toLocaleLowerCase() === portable.name.toLocaleLowerCase());
      let id: string = existing?.id ?? portable.id;
      if (existing === undefined && usedIds.has(id)) {
        id = `ntf-${randomBytes(8).toString('hex')}`;
      }
      const next: MockNotification = {
        createdAt: existing?.createdAt ?? nowIso(),
        events: [...portable.events],
        id,
        lastAttemptAt: existing?.lastAttemptAt ?? null,
        lastError: null,
        name: portable.name,
        secrets: Object.fromEntries(Object.keys(portable.secrets).map((key: string): [string, true] => [
          key,
          true,
        ])),
        secretsMissing: [],
        service: portable.service,
        settings: { ...portable.settings },
        updatedAt: nowIso(),
      };
      if (existing === undefined) {
        notifications.push(next);
      } else {
        Object.assign(existing, next);
      }
      usedIds.add(id);
    }
    importedSections.push('notifications');
  }
  if (document.accessTokens !== undefined) {
    const names: Set<string> = new Set(tokens.filter((token: MockToken): boolean => token.userId === user.id).map((token: MockToken): string => token.name.toLocaleLowerCase()));
    const hashes: Set<string> = new Set(tokens.map((token: MockToken): string => token.hash));
    const ids: Set<string> = new Set(tokens.map((token: MockToken): string => token.id));
    for (const portable of document.accessTokens) {
      if (names.has(portable.name.toLocaleLowerCase()) || hashes.has(portable.tokenHash)) {
        continue;
      }
      let id: string = portable.id;
      if (ids.has(id)) {
        id = `tok-${randomBytes(8).toString('hex')}`;
      }
      tokens.push({
        createdAt: nowIso(),
        expiresAt: portable.expiresAt,
        hash: portable.tokenHash,
        id,
        lastUsedAt: null,
        name: portable.name,
        scopes: [...portable.scopes],
        userId: user.id,
      });
      names.add(portable.name.toLocaleLowerCase());
      hashes.add(portable.tokenHash);
      ids.add(id);
    }
    importedSections.push('accessTokens');
  }
  return {
    ...summary,
    importedSections,
  };
};

/**
 * Mock API - Reads pointer.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readPointer = (value: unknown, pointer: string): unknown => {
  let current: unknown = value;

  for (const segment of pointer.split('/').slice(1).map((part: string): string => part.replaceAll('~1', '/').replaceAll('~0', '~'))) {
    if (Array.isArray(current)) {
      current = current[Number(segment)];
    } else if (isRecord(current)) {
      current = current[segment];
    } else {
      return undefined;
    }
  }

  return current;
};

/**
 * Mock API - Feature detail.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const featureDetail = async (entry: MockCatalogEntry, serverId: string): Promise<Record<string, unknown>> => {
  const modules: MockModules = await loadModules();
  const state: MockFeatureState = stateOf(serverId, entry.key);
  const store: Map<string, string> = secretsFor(serverId);
  const saved: Record<string, boolean> = {};

  for (const reference of collectReferences(state.configuration)) {
    if (store.has(reference.key)) {
      saved[reference.key] = true;
    }
  }

  let editor: Record<string, unknown> = {};

  try {
    editor = modules.editorFor(entry.key);
  } catch {
    editor = fallbackModules().editorFor(entry.key);
  }

  return {
    ...featureSummary(entry, serverId),
    configuration: state.configuration,
    editor,
    example: examples.get(entry.key) ?? null,
    secrets: saved,
  };
};

// Invite pages.

/**
 * Mock API - Invite page for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const invitePageFor = (server: MockServer): MockInvitePage => {
  const existing: MockInvitePage | undefined = invitePages.get(server.id);

  if (existing !== undefined) {
    return existing;
  }

  const created: MockInvitePage = (server.id === loungeId) ? {
    accentColor: '#6250d9',
    bannerImageId: null,
    buttonLabel: 'Join the server',
    description: 'Daily chat, weekly events, and a friendly crowd to hang out with.',
    footerText: 'By joining you agree to the [server rules](https://example.com/rules).\nQuestions? https://example.com/help',
    logo: 'server',
    logoImageId: null,
    revision: 3,
    showBoostTier: true,
    showMemberCount: true,
    theme: 'system',
    title: 'Join Stonker Lounge',
    updatedAt: agoIso(5 * 24 * 60),
  } : {
    accentColor: '#6250d9',
    bannerImageId: null,
    buttonLabel: 'Join',
    description: '',
    footerText: '',
    logo: 'server',
    logoImageId: null,
    revision: 0,
    showBoostTier: false,
    showMemberCount: true,
    theme: 'system',
    title: server.name,
    updatedAt: null,
  };

  invitePages.set(server.id, created);

  return created;
};

// invitePathFor reads the invite path from the server's Web applications settings.

/**
 * Mock API - Invite path for.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const invitePathFor = (serverId: string): string | null => {
  const configuration: unknown = stateOf(serverId, 'web-applications').configuration;
  const generator: unknown = (isRecord(configuration)) ? configuration['invite-generator'] : undefined;
  const options: unknown = (isRecord(generator)) ? generator['options'] : undefined;
  const path: unknown = (isRecord(options)) ? options['path'] : undefined;

  return (typeof path === 'string' && path.startsWith('/')) ? path : null;
};

/**
 * Mock API - Media URL.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const mediaUrl = (imageId: string | null): string | null => ((imageId === null) ? null : `/media/${imageId}`);

/**
 * Mock API - Designer response.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const designerResponse = (server: MockServer, origin: string): Record<string, unknown> => {
  const page: MockInvitePage = invitePageFor(server);
  const path: string | null = invitePathFor(server.id);

  return {
    enabled: stateOf(server.id, 'web-applications').enabled && path !== null,
    page: {
      ...page,
      bannerImageUrl: mediaUrl(page.bannerImageId),
      logoImageUrl: mediaUrl(page.logoImageId),
    },
    publicUrl: (path === null) ? null : `${origin}${path}`,
    server: {
      iconUrl: server.iconUrl,
      name: server.name,
    },
  };
};

/**
 * Mock API - Escape HTML.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const escapeHtml = (value: string): string => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll('\'', '&#39;');

// HTTP helpers.

/**
 * Mock API - Sends JSON.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const sendJSON = (response: ServerResponse, status: number, body: unknown): void => {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  }).end(JSON.stringify(body));
};

/**
 * Mock API - Sends empty.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const sendEmpty = (response: ServerResponse, status: number = 204): void => {
  response.writeHead(status).end();
};

/**
 * Mock API - Sends error.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const sendError = (response: ServerResponse, status: number, code: string, message: string): void => {
  sendJSON(response, status, {
    error: {
      code,
      message,
    },
  });
};

/**
 * Mock API - Sends issues.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const sendIssues = (response: ServerResponse, status: number, code: string, issues: MockIssue[]): void => {
  sendJSON(response, status, {
    error: {
      code,
      issues,
      message: issues[0]?.message ?? 'Check the highlighted fields.',
    },
  });
};

/**
 * Mock API - Field issue.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const fieldIssue = (field: string, message: string): MockIssue => ({
  field,
  message,
  path: field.split('.'),
});

/**
 * Mock API - Reads raw.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readRaw = async (request: IncomingMessage): Promise<Buffer> => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
};

/**
 * Mock API - Reads cookies.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readCookies = (request: IncomingMessage): Record<string, string> => Object.fromEntries((request.headers.cookie ?? '')
  .split(';')
  .map((part: string): string[] => part.trim().split('='))
  .filter((parts: string[]): boolean => parts.length >= 2 && parts[0] !== '')
  .map((parts: string[]): [string, string] => [
    parts[0] ?? '',
    decodeURIComponent(parts.slice(1).join('=')),
  ]));

// startSession signs a user in and answers like the real session response.

/**
 * Mock API - Starts session.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const startSession = (response: ServerResponse, user: MockUser, status: number = 200): void => {
  const sessionId: string = randomBytes(24).toString('base64url');
  const csrfToken: string = randomBytes(24).toString('base64url');

  const signedIn: MockUser | undefined = users.find((candidate: MockUser): boolean => candidate.id === user.id);

  sessions.set(sessionId, {
    csrfToken,
    userId: user.id,
  });

  if (signedIn !== undefined) {
    signedIn.lastSignInAt = nowIso();
  }

  writeLog('web', 'info', 'sign_in_succeeded', {
    userId: user.id,
    username: user.username,
  });
  response.setHeader('Set-Cookie', [
    `dsb_session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`,
    `dsb_csrf=${csrfToken}; Path=/; SameSite=Strict`,
  ]);
  sendJSON(response, status, {
    csrfToken,
    expiresAt: new Date(Date.now() + (24 * 60 * minute)).toISOString(),
    status: 'authenticated',
    user: {
      id: user.id,
      role: user.role,
      username: user.username,
    },
  });
};

// principalOf finds who is calling: a browser session or a personal access token.

/**
 * Mock API - Principal of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const principalOf = (request: IncomingMessage): MockPrincipal | null => {
  const authorization: string = request.headers.authorization ?? '';

  if (authorization.startsWith('Bearer ')) {
    const token: MockToken | undefined = tokens.find((candidate: MockToken): boolean => candidate.hash === digest(authorization.slice(7).trim()));
    const user: MockUser | undefined = (token === undefined) ? undefined : users.find((candidate: MockUser): boolean => candidate.id === token.userId);

    if (token === undefined || user === undefined || !user.enabled || (token.expiresAt !== null && Date.parse(token.expiresAt) <= Date.now())) {
      return null;
    }

    token.lastUsedAt = nowIso();

    return {
      kind: 'token',
      token,
      user,
    };
  }

  const session: {
    csrfToken: string
    userId: string
  } | undefined = sessions.get(readCookies(request)['dsb_session'] ?? '');
  const user: MockUser | undefined = (session === undefined) ? undefined : users.find((candidate: MockUser): boolean => candidate.id === session.userId);

  if (user === undefined || !user.enabled) {
    return null;
  }

  return {
    kind: 'session',
    token: null,
    user,
  };
};

/**
 * Mock API - Csrf valid.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const csrfValid = (request: IncomingMessage): boolean => {
  const session: {
    csrfToken: string
    userId: string
  } | undefined = sessions.get(readCookies(request)['dsb_session'] ?? '');

  return session !== undefined && request.headers['x-csrf-token'] === session.csrfToken;
};

/**
 * Mock API - Sign out user.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const signOutUser = (userId: string): void => {
  for (const [
    sessionId,
    session,
  ] of sessions) {
    if (session.userId === userId) {
      sessions.delete(sessionId);
    }
  }
};

// Bot state.

/**
 * Mock API - Set bot status.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const setBotStatus = (status: string, delay: number, next: string | null): void => {
  bot.status = status;

  if (botTimer !== undefined) {
    clearTimeout(botTimer);
  }

  if (next !== null) {
    botTimer = setTimeout((): void => {
      bot.status = next;

      if (next === 'ready') {
        writeLog('bot', 'info', 'gateway_ready', {
          guildCount: servers.length,
          userTag: bot.userTag,
        });
      }
    }, delay);
  }
};

/**
 * Mock API - Bot resource.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const botResource = (): Record<string, unknown> => ({
  activeFeatures: bot.activeFeatures,
  addServerUrl: addServerUrl(),
  applicationId: bot.applicationId,
  configurationErrors: bot.configurationErrors,
  desiredState: bot.desiredState,
  guildCount: (bot.status === 'ready') ? servers.length : null,
  resolution: bot.resolution,
  services: [
    {
      component: 'bot',
      status: bot.status,
      updatedAt: agoIso(0.2),
    },
    {
      component: 'web',
      status: 'ready',
      updatedAt: agoIso(0.4),
    },
    {
      component: 'worker',
      status: 'ready',
      updatedAt: agoIso(0.7),
    },
  ],
  status: bot.status,
  tokenConfigured: bot.tokenConfigured,
  userTag: (bot.status === 'ready') ? bot.userTag : null,
});

// Routes.

// handlePublic answers the public invite page and uploaded images, like the web process does.

/**
 * Mock API - Handles public.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const handlePublic = async (request: IncomingMessage, response: ServerResponse, url: URL): Promise<boolean> => {
  const method: string = request.method ?? 'GET';
  const mediaMatch: RegExpMatchArray | null = url.pathname.match(/^\/media\/([0-9a-f-]{36})$/u);

  if (method === 'GET' && mediaMatch !== null) {
    const image: MockImage | undefined = images.get(mediaMatch[1] ?? '');

    if (image === undefined) {
      response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found.');

      return true;
    }

    response.writeHead(200, {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': image.contentType,
    }).end(image.data);

    return true;
  }

  await ensureFeatures();

  const server: MockServer | undefined = servers.find((candidate: MockServer): boolean => invitePathFor(candidate.id) === url.pathname);

  if (server === undefined || viteServer === null) {
    return false;
  }

  const page: MockInvitePage = invitePageFor(server);
  const available: boolean = bot.desiredState === 'running' && bot.status === 'ready' && stateOf(server.id, 'web-applications').enabled;

  if (method === 'POST') {
    const address: string = request.socket.remoteAddress ?? 'local';
    const recent: number[] = (inviteAttempts.get(address) ?? []).filter((time: number): boolean => time > Date.now() - (10 * minute));
    let body: unknown = undefined;

    try {
      body = JSON.parse((await readRaw(request)).toString('utf-8'));
    } catch {
      sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

      return true;
    }

    if (recent.length >= 5) {
      response.setHeader('Retry-After', '600');
      sendError(response, 429, 'rate_limited', 'Too many invites from this network. Try again in 10 minutes.');

      return true;
    }

    if (!isRecord(body) || typeof body['recaptchaToken'] !== 'string' || body['recaptchaToken'].trim() === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('recaptchaToken', 'Complete the reCAPTCHA check.')]);

      return true;
    }

    if (!available) {
      sendError(response, 503, 'invite_unavailable', 'Invites are paused right now. Try again later.');

      return true;
    }

    inviteAttempts.set(address, [
      ...recent,
      Date.now(),
    ]);
    writeLog('web', 'info', 'public_invite_created', {
      guildIdentifier: server.id,
      maxAgeSeconds: 300,
      maxUses: 1,
      path: url.pathname,
    });
    sendJSON(response, 200, { inviteUrl: `https://discord.gg/mock${randomBytes(3).toString('hex')}` });

    return true;
  }

  if (method !== 'GET') {
    return false;
  }

  const origin: string = `http://${request.headers.host ?? 'localhost:5175'}`;
  const bannerUrl: string | null = mediaUrl(page.bannerImageId);
  let logoUrl: string | null = null;

  if (page.logo === 'server') {
    logoUrl = server.iconUrl;
  } else if (page.logo === 'custom') {
    logoUrl = mediaUrl(page.logoImageId);
  }

  const statsParts: string[] = [];

  if (page.showMemberCount) {
    statsParts.push(`${server.memberCount.toLocaleString('en-US')} members`);
  }

  if (page.showBoostTier && server.boostTier > 0) {
    statsParts.push(`Boost level ${server.boostTier}`);
  }

  const description: string = [
    page.description,
    statsParts.join(' · '),
  ].filter((part: string): boolean => part !== '').join(' — ');
  const previewImage: string | null = bannerUrl ?? ((logoUrl !== null && logoUrl.startsWith('/')) ? logoUrl : null);
  const head: string = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="theme-color" content="${escapeHtml(page.accentColor)}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(`${origin}${url.pathname}`)}" />`,
    ...((previewImage === null) ? [] : [`<meta property="og:image" content="${escapeHtml(`${origin}${previewImage}`)}" />`]),
    `<meta name="twitter:card" content="${(bannerUrl === null) ? 'summary' : 'summary_large_image'}" />`,
  ].join('\n    ');
  const data: string = JSON.stringify({
    available,
    page: {
      accentColor: page.accentColor,
      bannerUrl,
      buttonLabel: page.buttonLabel,
      description: page.description,
      footerText: page.footerText,
      logoUrl,
      showBoostTier: page.showBoostTier,
      showMemberCount: page.showMemberCount,
      theme: page.theme,
      title: page.title,
    },
    recaptchaSiteKey: (available) ? recaptchaTestSiteKey : null,
    server: {
      boostTier: server.boostTier,
      iconUrl: server.iconUrl,
      memberCount: server.memberCount,
      name: server.name,
    },
    submitPath: url.pathname,
  }).replaceAll('<', '\\u003c');
  const template: string = readFileSync(new URL('./invite.html', import.meta.url), 'utf-8');
  const html: string = await viteServer.transformIndexHtml(url.pathname, template
    .replace('<!-- invite-head -->', head)
    .replace('<!-- invite-data -->', `<script type="application/json" id="invite-data">${data}</script>`));

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/html; charset=utf-8',
  }).end(html);

  return true;
};

// Answers one console API call, or returns false so Vite serves the page.

/**
 * Mock API - Handles request.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const handleRequest = async (request: IncomingMessage, response: ServerResponse): Promise<boolean> => {
  // The Host header gives the address the page was opened at, like the real server sees it.
  const url: URL = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const path: string = url.pathname;
  const method: string = request.method ?? 'GET';

  if (!path.startsWith('/api/v1/')) {
    return handlePublic(request, response, url);
  }

  await ensureFeatures();

  const uploadRoute: boolean = method === 'POST' && /^\/api\/v1\/servers\/[^/]+\/invite-page\/images$/u.test(path);
  let raw: Buffer = Buffer.alloc(0);
  let body: Record<string, unknown> = {};

  if (method !== 'GET' && method !== 'HEAD') {
    raw = await readRaw(request);

    if (!uploadRoute && raw.length > 0) {
      try {
        const parsed: unknown = JSON.parse(raw.toString('utf-8'));

        body = (isRecord(parsed)) ? parsed : {};
      } catch {
        sendError(response, 400, 'invalid_json', 'The request body is not valid JSON.');

        return true;
      }
    }
  }

  if (method === 'GET' && path === '/api/v1/setup/status') {
    sendJSON(response, 200, (owner === null) ? {
      claimExpiresAt: new Date(startedAt + (30 * minute)).toISOString(),
      claimRequired: true,
    } : { claimRequired: false });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/setup/claim') {
    if (owner !== null) {
      sendError(response, 409, 'claim_unavailable', 'Setup is already complete. Sign in instead.');

      return true;
    }

    if (String(body['claimCode'] ?? '').trim() === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('claimCode', 'Enter the setup code from the container log.')]);

      return true;
    }

    if (normalizeCode(String(body['claimCode'])) !== normalizeCode(setupCode)) {
      sendIssues(response, 401, 'claim_invalid', [fieldIssue('claimCode', 'That setup code is wrong or expired. Restart the container to print a new one.')]);

      return true;
    }

    const claimUsername: string = String(body['username'] ?? '').trim();
    const claimUsernameIssue: string = usernameIssue(claimUsername);

    if (claimUsernameIssue !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', claimUsernameIssue)]);

      return true;
    }

    if (passwordIssue(body['password']) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('password', passwordIssue(body['password']))]);

      return true;
    }

    owner = {
      allServers: true,
      createdAt: nowIso(),
      enabled: true,
      id: userIdFor(1),
      lastSignInAt: null,
      password: String(body['password']),
      recoveryCodes: [],
      role: 'owner',
      serverIds: [],
      totpEnabled: false,
      totpPending: false,
      username: claimUsername,
    };
    seedAccounts(owner);
    writeLog('web', 'info', 'setup_completed', {
      userId: owner.id,
      username: owner.username,
    });
    startSession(response, owner, 201);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login') {
    const loginUsername: string = String(body['username'] ?? '').trim();
    const loginPassword: unknown = body['password'];

    if (loginUsername === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', 'Enter your username.')]);

      return true;
    }

    if (typeof loginPassword !== 'string' || loginPassword === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('password', 'Enter your password.')]);

      return true;
    }

    const user: MockUser | undefined = users.find((candidate: MockUser): boolean => candidate.username.toLowerCase() === loginUsername.toLowerCase());

    if (user === undefined || !user.enabled || user.password !== loginPassword) {
      writeLog('web', 'warn', 'sign_in_failed', { username: loginUsername });
      sendError(response, 401, 'credentials_invalid', 'The username or password is incorrect.');

      return true;
    }

    if (user.totpEnabled) {
      pendingChallenge = {
        challenge: randomBytes(24).toString('base64url'),
        failures: 0,
        userId: user.id,
      };
      sendJSON(response, 200, {
        challenge: pendingChallenge.challenge,
        expiresAt: new Date(Date.now() + (5 * minute)).toISOString(),
        status: 'second_factor_required',
      });

      return true;
    }

    startSession(response, user);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/login/second-factor') {
    const code: string = String(body['code'] ?? '').trim();
    const challengeUser: MockUser | undefined = (pendingChallenge === null) ? undefined : users.find((candidate: MockUser): boolean => candidate.id === pendingChallenge?.userId);

    if (pendingChallenge === null || body['challenge'] !== pendingChallenge.challenge || challengeUser === undefined) {
      sendError(response, 401, 'challenge_expired', 'Your sign-in timed out. Enter your password again.');

      return true;
    }

    if (code === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('code', 'Enter the code from your authenticator app, or a recovery code.')]);

      return true;
    }

    const isTotpCode: boolean = /^[0-9]{6}$/u.test(code);
    const recoveryCode: string | undefined = (isTotpCode) ? undefined : challengeUser.recoveryCodes.find((candidate: string): boolean => normalizeCode(candidate) === normalizeCode(code));

    if ((isTotpCode && code !== '123456') || (!isTotpCode && recoveryCode === undefined)) {
      pendingChallenge.failures += 1;

      if (pendingChallenge.failures >= 5) {
        pendingChallenge = null;
        sendError(response, 401, 'challenge_expired', 'Too many wrong codes. Enter your password again.');

        return true;
      }

      sendIssues(response, 401, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Try the current code, or a recovery code.')]);

      return true;
    }

    challengeUser.recoveryCodes = challengeUser.recoveryCodes.filter((candidate: string): boolean => candidate !== recoveryCode);
    pendingChallenge = null;
    startSession(response, challengeUser);

    return true;
  }

  // Passkey sign-in accepts any answer from the browser and signs in the owner, like the
  // transmission-vpn mock.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/options') {
    sendJSON(response, 200, {
      ceremonyId: randomBytes(16).toString('base64url'),
      options: {
        allowCredentials: [],
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/login/verify') {
    if (owner === null) {
      sendError(response, 401, 'passkey_rejected', 'That passkey wasn\'t accepted.');

      return true;
    }

    startSession(response, owner);

    return true;
  }

  const principal: MockPrincipal | null = principalOf(request);

  if (principal === null) {
    sendError(response, 401, 'authentication_required', 'Sign in to continue.');

    return true;
  }

  const user: MockUser = principal.user;
  const isSession: boolean = principal.kind === 'session';

  if (isSession && method !== 'GET' && !csrfValid(request)) {
    sendError(response, 403, 'csrf_invalid', 'The request CSRF token is missing or invalid.');

    return true;
  }

  // requireScope lets a token through only with the scope; sessions pass.

  /**
   * Mock API - Requires scope.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const requireScope = (scope: MockScope): boolean => {
    if (principal.token !== null && !principal.token.scopes.includes(scope)) {
      sendError(response, 403, 'scope_required', `This token doesn't have the ${scope} scope.`);

      return false;
    }

    return true;
  };

  /**
   * Mock API - Requires session.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const requireSession = (): boolean => {
    if (!isSession) {
      sendError(response, 403, 'session_required', 'A signed-in browser session is required.');

      return false;
    }

    return true;
  };

  /**
   * Mock API - Requires permission.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const requirePermission = (permission: MockPermission): boolean => {
    if (!permissionsOf(user).includes(permission)) {
      sendError(response, 403, 'permission_required', permissionMessages[permission]);

      return false;
    }

    return true;
  };

  /**
   * Mock API - Checks password.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const checkPassword = (field: string = 'password'): boolean => {
    if (typeof body[field] !== 'string' || body[field] === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(field, (field === 'currentPassword') ? 'Enter your current password.' : 'Enter your password.')]);

      return false;
    }

    if (body[field] !== user.password) {
      sendIssues(response, 422, 'password_incorrect', [fieldIssue(field, 'That password is incorrect.')]);

      return false;
    }

    return true;
  };

  if (method === 'GET' && path === '/api/v1/auth/me') {
    sendJSON(response, 200, (principal.token === null) ? {
      allServers: user.allServers,
      authenticationType: 'session',
      id: user.id,
      permissions: permissionsOf(user),
      removedSecrets: removedSecrets.filter((removedSecret): boolean => (removedSecret.kind === 'authenticator') ? removedSecret.userId === user.id : permissionsOf(user).includes('configuration:write')).map(({ userId: _userId, ...removedSecret }) => removedSecret),
      role: user.role,
      serverIds: (user.allServers) ? [] : user.serverIds,
      username: user.username,
    } : {
      authenticationType: 'token',
      id: principal.token.id,
      name: principal.token.name,
      scopes: principal.token.scopes,
      username: user.username,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation') {
    if (!requireSession() || !requirePermission('users:manage')) {
      return true;
    }
    const purpose: unknown = body['purpose'];
    if (purpose !== 'export' && purpose !== 'import') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('purpose', 'Choose what you are confirming.')]);
      return true;
    }
    if (!checkPassword()) {
      return true;
    }
    if (user.totpEnabled && body['code'] !== '123456') {
      sendIssues(response, 422, 'identity_not_confirmed', [fieldIssue('code', 'That authenticator code is incorrect. Use 123456 in the mock.')]);
      return true;
    }
    const sessionId: string = readCookies(request)['dsb_session'] ?? '';
    sendJSON(response, 200, issueBackupGrant(sessionId, purpose));
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation/passkey/options') {
    if (!requireSession() || !requirePermission('users:manage')) {
      return true;
    }
    const purpose: unknown = body['purpose'];
    if (purpose !== 'export' && purpose !== 'import') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('purpose', 'Choose what you are confirming.')]);
      return true;
    }
    if ((passkeysByUser.get(user.id) ?? []).length === 0) {
      sendError(response, 409, 'passkeys_unavailable', 'Add a passkey first, or use your password.');
      return true;
    }
    const ceremonyId: string = randomBytes(16).toString('base64url');
    const sessionId: string = readCookies(request)['dsb_session'] ?? '';
    backupPasskeyCeremonies.set(ceremonyId, {
      expiresAt: Date.now() + (5 * minute),
      purpose,
      sessionId: digest(sessionId),
    });
    sendJSON(response, 200, {
      ceremonyId,
      options: {
        allowCredentials: [],
        challenge: randomBytes(32).toString('base64url'),
        rpId: url.hostname,
        timeout: 300000,
        userVerification: 'required',
      },
    });
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/confirmation/passkey/verify') {
    if (!requireSession() || !requirePermission('users:manage')) {
      return true;
    }
    const ceremonyId: unknown = body['ceremonyId'];
    const purpose: unknown = body['purpose'];
    const sessionId: string = readCookies(request)['dsb_session'] ?? '';
    const binding: MockBackupPasskeyCeremony | undefined = (typeof ceremonyId === 'string') ? backupPasskeyCeremonies.get(ceremonyId) : undefined;
    if (
      binding === undefined
      || binding.expiresAt <= Date.now()
      || binding.sessionId !== digest(sessionId)
      || binding.purpose !== purpose
      || !isRecord(body['credential'])
    ) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');
      return true;
    }
    backupPasskeyCeremonies.delete(ceremonyId as string);
    sendJSON(response, 200, issueBackupGrant(sessionId, binding.purpose));
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/export') {
    if (!requireSession() || !requirePermission('users:manage')) {
      return true;
    }
    const selected: unknown = body['sections'];
    if (!isRecord(selected) || ![
      'connection',
      'features',
      'notifications',
      'accessTokens',
    ].some((key: string): boolean => selected[key] === true)) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('sections', 'Choose at least one section.')]);
      return true;
    }
    const sessionId: string = readCookies(request)['dsb_session'] ?? '';
    if (!consumeBackupGrant(body['grant'], sessionId, 'export')) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');
      return true;
    }
    const document: MockBackupDocument = createMockBackupDocument(selected, user);
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="discord-stonker-bot-export-${document.exportedAt.slice(0, 10)}.json"`,
      'Content-Type': 'application/json',
    }).end(JSON.stringify(document));
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/imports/preview') {
    if (!requireSession() || !requirePermission('users:manage')) {
      return true;
    }
    const source: MockBackupSource | null = parseMockBackupSource(body['source']);
    if (source === null) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('source', 'Choose a valid backup file.')]);
      return true;
    }
    try {
      sendJSON(response, 200, previewMockBackup(source, user, await loadModules()));
    } catch (error) {
      const message: string = (error instanceof Error) ? error.message : 'This file is not a supported config.json.';
      sendError(response, (message.includes('another Discord server')) ? 409 : 422, 'backup_source_invalid', message);
    }
    return true;
  }

  if (method === 'POST' && path === '/api/v1/backup/imports') {
    if (!requireSession() || !requirePermission('users:manage')) {
      return true;
    }
    const source: MockBackupSource | null = parseMockBackupSource(body['source']);
    if (source === null) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('source', 'Choose a valid backup file.')]);
      return true;
    }
    const sessionId: string = readCookies(request)['dsb_session'] ?? '';
    if (!consumeBackupGrant(body['grant'], sessionId, 'import')) {
      sendError(response, 401, 'backup_confirmation_expired', 'Confirm it\'s you again.');
      return true;
    }
    try {
      const result: Record<string, unknown> = applyMockBackup(source, user, await loadModules());
      writeLog('web', 'info', 'backup_imported', {
        importedSections: result['importedSections'],
        source: source.type,
        userId: user.id,
        username: user.username,
      });
      sendJSON(response, 200, result);
    } catch (error) {
      const message: string = (error instanceof Error) ? error.message : 'This file could not be imported.';
      sendError(response, (message.includes('another Discord server')) ? 409 : 422, 'backup_source_invalid', message);
    }
    return true;
  }

  if (method === 'DELETE' && path === '/api/v1/auth/removed-secrets') {
    if (!requireSession()) {
      return true;
    }

    removedSecrets = removedSecrets.filter((removedSecret): boolean => (removedSecret.kind === 'authenticator') ? removedSecret.userId !== user.id : !permissionsOf(user).includes('configuration:write'));
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/logout') {
    sessions.delete(readCookies(request)['dsb_session'] ?? '');
    writeLog('web', 'info', 'sign_out', {
      userId: user.id,
      username: user.username,
    });
    sendEmpty(response);

    return true;
  }

  // Bot, servers, features, logs, and the invite page accept tokens with the right scope.
  const serverMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/servers\/([^/]+)(\/.*)?$/u);

  if (method === 'GET' && path === '/api/v1/servers') {
    if (!requireScope('features:read')) {
      return true;
    }

    sendJSON(response, 200, {
      items: servers
        .filter((server: MockServer): boolean => serverVisible(user, server.id))
        .map((server: MockServer): Record<string, unknown> => ({
          available: server.available,
          enabledFeatures: [...statesFor(server.id).values()].filter((state: MockFeatureState): boolean => state.enabled).length,
          iconUrl: server.iconUrl,
          id: server.id,
          name: server.name,
        })),
    });

    return true;
  }

  if (serverMatch !== null) {
    const serverId: string = decodeURIComponent(serverMatch[1] ?? '');
    const rest: string = serverMatch[2] ?? '';
    const server: MockServer | undefined = servers.find((candidate: MockServer): boolean => candidate.id === serverId);

    if (server === undefined || !serverVisible(user, serverId)) {
      sendError(response, 404, 'server_not_found', 'That Discord server isn\'t available.');

      return true;
    }

    const modules: MockModules = await loadModules();

    if (method === 'GET' && rest === '/resources') {
      if (!requireScope('features:read')) {
        return true;
      }

      sendJSON(response, 200, {
        channels: channels[serverId] ?? [],
        roles: roles[serverId] ?? [],
      });

      return true;
    }

    if (method === 'GET' && rest === '/features') {
      if (!requireScope('features:read')) {
        return true;
      }

      sendJSON(response, 200, { items: modules.catalog.map((entry: MockCatalogEntry): Record<string, unknown> => featureSummary(entry, serverId)) });

      return true;
    }

    const featureMatch: RegExpMatchArray | null = rest.match(/^\/features\/([^/]+)(\/enabled)?$/u);

    if (featureMatch !== null) {
      const entry: MockCatalogEntry | undefined = modules.catalog.find((candidate: MockCatalogEntry): boolean => candidate.key === decodeURIComponent(featureMatch[1] ?? ''));

      if (entry === undefined) {
        sendError(response, 404, 'feature_not_found', 'That feature doesn\'t exist.');

        return true;
      }

      const state: MockFeatureState = stateOf(serverId, entry.key);
      const store: Map<string, string> = secretsFor(serverId);

      /**
       * Mock API - Resolve.
       *
       * Centralizes this operation for the surrounding workflow.
       * Callers reuse one implementation instead of repeating the behavior.
       *
       * @since 4.0.0
       */
      const resolve = (key: string): string | undefined => store.get(key);

      if (method === 'GET' && featureMatch[2] === undefined) {
        if (!requireScope('features:read')) {
          return true;
        }

        sendJSON(response, 200, await featureDetail(entry, serverId));

        return true;
      }

      if (method === 'PUT' && featureMatch[2] === '/enabled') {
        if (!requireScope('features:write') || !requirePermission('configuration:write')) {
          return true;
        }

        if (typeof body['enabled'] !== 'boolean') {
          sendIssues(response, 422, 'invalid_request', [fieldIssue('enabled', 'Choose on or off.')]);

          return true;
        }

        if (body['enabled'] && state.configuration === null) {
          sendError(response, 409, 'feature_not_configured', 'Set up this feature before turning it on.');

          return true;
        }

        if (body['enabled'] && modules.validate !== null) {
          const issues: MockIssue[] = modules.validate(entry.key, state.configuration, resolve);

          if (issues.length > 0) {
            sendJSON(response, 422, {
              error: {
                code: 'invalid_request',
                issues,
                message: 'Fix this feature\'s settings before turning it on.',
              },
            });

            return true;
          }
        }

        if (state.enabled !== body['enabled']) {
          state.enabled = body['enabled'];
          writeLog('web', 'info', (state.enabled) ? 'feature_enabled' : 'feature_disabled', {
            featureKey: entry.key,
            guildIdentifier: serverId,
            userId: user.id,
            username: user.username,
          });
          writeLog('bot', 'info', 'features_reloaded', { guildIdentifier: serverId }, 0);
        }

        sendJSON(response, 200, featureSummary(entry, serverId));

        return true;
      }

      if (method === 'PUT' && featureMatch[2] === undefined) {
        if (!requireScope('features:write') || !requirePermission('configuration:write')) {
          return true;
        }

        const unknownKeys: string[] = Object.keys(body).filter((key: string): boolean => ![
          'configuration',
          'expectedRevision',
          'secrets',
        ].includes(key));

        if (unknownKeys.length > 0) {
          sendIssues(response, 422, 'invalid_request', unknownKeys.map((key: string): MockIssue => fieldIssue(key, 'This field isn\'t accepted.')));

          return true;
        }

        if (body['expectedRevision'] !== state.revision) {
          sendError(response, 409, 'revision_conflict', 'This feature changed since you opened it. Reload to see the latest version.');

          return true;
        }

        const configuration: unknown = structuredClone(body['configuration']);
        const secretValues: Record<string, unknown> = (isRecord(body['secrets'])) ? body['secrets'] : {};
        const freshSecrets: Map<string, string> = new Map();
        const issues: MockIssue[] = [];

        for (const [
          pointer,
          plaintext,
        ] of Object.entries(secretValues)) {
          const node: unknown = readPointer(configuration, pointer);

          // An empty value keeps the secret that is already saved.
          if (plaintext === '') {
            continue;
          }

          if (!isRecord(node) || typeof node['$secret'] !== 'string' || typeof plaintext !== 'string') {
            issues.push({
              field: `secrets.${pointer}`,
              message: 'This isn\'t a secret field.',
              path: [
                'secrets',
                pointer,
              ],
            });

            continue;
          }

          // A new value always gets a fresh key, so copies never share a secret by accident.
          const key: string = `${entry.key}.${randomBytes(6).toString('hex')}`;

          node['$secret'] = key;
          freshSecrets.set(key, plaintext);
        }

        for (const reference of collectReferences(configuration)) {
          if (!freshSecrets.has(reference.key) && !store.has(reference.key)) {
            issues.push({
              field: [
                'configuration',
                ...reference.path,
              ].join('.'),
              message: 'Enter this secret.',
              path: [
                'configuration',
                ...reference.path,
              ],
            });
          }
        }

        if (issues.length === 0 && modules.validate !== null) {
          issues.push(...modules.validate(entry.key, configuration, (key: string): string | undefined => freshSecrets.get(key) ?? store.get(key)));
        }

        if (issues.length === 0 && (configuration === null || configuration === undefined)) {
          issues.push(fieldIssue('configuration', 'Add the settings this feature needs.'));
        }

        if (issues.length > 0) {
          sendIssues(response, 422, 'invalid_request', issues);

          return true;
        }

        for (const [
          key,
          value,
        ] of freshSecrets) {
          store.set(key, value);
        }

        state.configuration = configuration;
        state.revision += 1;
        state.updatedAt = nowIso();

        // Secrets no feature of this server points at any more are deleted.
        const referenced: Set<string> = new Set([...statesFor(serverId).values()].flatMap((candidate: MockFeatureState) => collectReferences(candidate.configuration).map((reference: {
          key: string
          path: string[]
        }): string => reference.key)));

        for (const key of [...store.keys()]) {
          if (!referenced.has(key)) {
            store.delete(key);
          }
        }

        removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.kind !== 'feature-secrets' || removedSecret.serverId !== serverId || removedSecret.featureKey !== entry.key);
        writeLog('web', 'info', 'feature_saved', {
          featureKey: entry.key,
          guildIdentifier: serverId,
          revision: state.revision,
          userId: user.id,
          username: user.username,
        });

        if (state.enabled) {
          writeLog('bot', 'info', 'features_reloaded', { guildIdentifier: serverId });
        }

        sendJSON(response, 200, await featureDetail(entry, serverId));

        return true;
      }
    }

    if (method === 'GET' && rest === '/invite-page') {
      if (!requireScope('features:read')) {
        return true;
      }

      sendJSON(response, 200, designerResponse(server, `http://${request.headers.host ?? 'localhost:5175'}`));

      return true;
    }

    if (method === 'PUT' && rest === '/invite-page') {
      if (!requireScope('features:write') || !requirePermission('configuration:write')) {
        return true;
      }

      const page: MockInvitePage = invitePageFor(server);
      const issues: MockIssue[] = [];

      /**
       * Mock API - Text.
       *
       * Centralizes this operation for the surrounding workflow.
       * Callers reuse one implementation instead of repeating the behavior.
       *
       * @since 4.0.0
       */
      const text = (key: string): string => ((typeof body[key] === 'string') ? String(body[key]).trim() : '');
      const allowed: string[] = [
        'accentColor',
        'bannerImageId',
        'buttonLabel',
        'description',
        'expectedRevision',
        'footerText',
        'logo',
        'logoImageId',
        'showBoostTier',
        'showMemberCount',
        'theme',
        'title',
      ];

      for (const key of Object.keys(body).filter((candidate: string): boolean => !allowed.includes(candidate))) {
        issues.push(fieldIssue(key, 'This field isn\'t accepted.'));
      }

      if (!/^#[0-9a-f]{6}$/iu.test(text('accentColor'))) {
        issues.push(fieldIssue('accentColor', 'Use a hex color like #6250d9.'));
      }

      if (text('title') === '') {
        issues.push(fieldIssue('title', 'Add a title.'));
      } else if (text('title').length > 100) {
        issues.push(fieldIssue('title', 'Use 100 characters or fewer.'));
      }

      if (text('description').length > 300) {
        issues.push(fieldIssue('description', 'Use 300 characters or fewer.'));
      }

      if (text('buttonLabel') === '') {
        issues.push(fieldIssue('buttonLabel', 'Add a button label.'));
      } else if (text('buttonLabel').length > 40) {
        issues.push(fieldIssue('buttonLabel', 'Use 40 characters or fewer.'));
      }

      if (text('footerText').length > 500) {
        issues.push(fieldIssue('footerText', 'Use 500 characters or fewer.'));
      }

      const logo: unknown = body['logo'];
      const theme: unknown = body['theme'];
      const logoImageId: string | null = (typeof body['logoImageId'] === 'string') ? body['logoImageId'] : null;
      const bannerImageId: string | null = (typeof body['bannerImageId'] === 'string') ? body['bannerImageId'] : null;

      if (logo !== 'custom' && logo !== 'none' && logo !== 'server') {
        issues.push(fieldIssue('logo', 'Choose the server icon, an uploaded logo, or no logo.'));
      }

      if (theme !== 'dark' && theme !== 'light' && theme !== 'system') {
        issues.push(fieldIssue('theme', 'Choose System, Light, or Dark.'));
      }

      if (logo === 'custom' && logoImageId === null) {
        issues.push(fieldIssue('logoImageId', 'Upload a logo, or choose another logo option.'));
      }

      for (const [
        field,
        imageId,
      ] of [
          [
            'logoImageId',
            (logo === 'custom') ? logoImageId : null,
          ],
          [
            'bannerImageId',
            bannerImageId,
          ],
        ] as [string, string | null][]) {
        if (imageId !== null && images.get(imageId)?.serverId !== serverId) {
          issues.push(fieldIssue(field, 'That image isn\'t available. Upload it again.'));
        }
      }

      if (typeof body['showMemberCount'] !== 'boolean') {
        issues.push(fieldIssue('showMemberCount', 'Choose whether to show the member count.'));
      }

      if (typeof body['showBoostTier'] !== 'boolean') {
        issues.push(fieldIssue('showBoostTier', 'Choose whether to show the boost level.'));
      }

      if (issues.length > 0) {
        sendIssues(response, 422, 'invalid_request', issues);

        return true;
      }

      if (body['expectedRevision'] !== page.revision) {
        sendError(response, 409, 'revision_conflict', 'The invite page changed since you opened it. Reload to see the latest version.');

        return true;
      }

      invitePages.set(serverId, {
        accentColor: text('accentColor').toLowerCase(),
        bannerImageId,
        buttonLabel: text('buttonLabel'),
        description: text('description'),
        footerText: text('footerText'),
        logo: logo as MockInvitePage['logo'],
        logoImageId: (logo === 'custom') ? logoImageId : null,
        revision: page.revision + 1,
        showBoostTier: body['showBoostTier'] === true,
        showMemberCount: body['showMemberCount'] === true,
        theme: theme as MockInvitePage['theme'],
        title: text('title'),
        updatedAt: nowIso(),
      });
      writeLog('web', 'info', 'invite_page_saved', {
        guildIdentifier: serverId,
        userId: user.id,
        username: user.username,
      });
      sendJSON(response, 200, designerResponse(server, `http://${request.headers.host ?? 'localhost:5175'}`));

      return true;
    }

    if (method === 'POST' && rest === '/invite-page/images') {
      if (!requireScope('features:write') || !requirePermission('configuration:write')) {
        return true;
      }

      const contentType: string = String(request.headers['content-type'] ?? '').split(';')[0]?.trim().toLowerCase() ?? '';
      const signatures: Record<string, (data: Buffer) => boolean> = {
        'image/gif': (data: Buffer): boolean => data.subarray(0, 4).toString('latin1') === 'GIF8',
        'image/jpeg': (data: Buffer): boolean => data.subarray(0, 3).equals(Buffer.from('ffd8ff', 'hex')),
        'image/png': (data: Buffer): boolean => data.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')),
        'image/webp': (data: Buffer): boolean => data.subarray(0, 4).toString('latin1') === 'RIFF' && data.subarray(8, 12).toString('latin1') === 'WEBP',
      };
      const signature: ((data: Buffer) => boolean) | undefined = signatures[contentType];

      if (raw.length > 2 * 1024 * 1024) {
        sendError(response, 413, 'payload_too_large', 'Upload an image of 2 MB or less.');

        return true;
      }

      if (signature === undefined || raw.length === 0 || !signature(raw)) {
        sendError(response, 415, 'unsupported_image', 'Upload a PNG, JPEG, WebP, or GIF image.');

        return true;
      }

      const imageId: string = randomUUID();

      images.set(imageId, {
        contentType,
        data: raw,
        serverId,
      });
      sendJSON(response, 201, {
        id: imageId,
        url: `/media/${imageId}`,
      });

      return true;
    }

    sendError(response, 404, 'not_found', 'No route matches this request.');

    return true;
  }

  if (method === 'GET' && path === '/api/v1/bot') {
    if (!requireScope('bot:control')) {
      return true;
    }

    sendJSON(response, 200, botResource());

    return true;
  }

  if (method === 'POST' && path === '/api/v1/bot/actions') {
    if (!requireScope('bot:control') || !requirePermission('bot:control')) {
      return true;
    }

    const action: unknown = body['action'];

    if (action !== 'restart' && action !== 'start' && action !== 'stop') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('action', 'Choose start, stop, or restart.')]);

      return true;
    }

    if (action !== 'stop' && !bot.tokenConfigured) {
      sendError(response, 409, 'bot_token_required', 'Add the Discord bot token before starting the bot.');

      return true;
    }

    writeLog('web', 'info', 'bot_action_requested', {
      action,
      userId: user.id,
      username: user.username,
    });

    if (action === 'stop') {
      bot.desiredState = 'stopped';
      setBotStatus('stopped', 0, null);
      writeLog('bot', 'info', 'gateway_closed', { reason: 'stop requested' });
    } else {
      bot.desiredState = 'running';
      setBotStatus('starting', 3_000, 'ready');
      writeLog('bot', 'info', 'gateway_connecting', { shard: 0 });
    }

    sendJSON(response, 202, { desiredState: bot.desiredState });

    return true;
  }

  if (method === 'PUT' && path === '/api/v1/bot/token') {
    if (!requireSession() || !requirePermission('configuration:write')) {
      return true;
    }

    const token: string = (typeof body['token'] === 'string') ? body['token'].trim() : '';

    if (token === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('token', 'Enter the bot token.')]);

      return true;
    }

    if (token.length > 512) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('token', 'Use 512 characters or fewer.')]);

      return true;
    }

    bot.tokenConfigured = true;
    bot.resolution = null;
    removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.kind !== 'bot-token');
    writeLog('web', 'info', 'bot_token_saved', {
      userId: user.id,
      username: user.username,
    });
    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && (path === '/api/v1/logs' || path === '/api/v1/logs/stream')) {
    if (!requireScope('logs:read')) {
      return true;
    }

    const component: string = url.searchParams.get('component') ?? 'bot';
    const minimumLevel: MockLevel = (levelOrder.includes(url.searchParams.get('level') as MockLevel)) ? url.searchParams.get('level') as MockLevel : 'debug';
    const search: string = (url.searchParams.get('q') ?? '').trim();
    const after: string | null = url.searchParams.get('after');
    const matching: MockLogEntry[] = logs.filter((entry: MockLogEntry): boolean => matchesLogFilters(entry, component, minimumLevel, search));

    if (path === '/api/v1/logs') {
      const items: MockLogEntry[] = (after === null) ? matching.slice(-200) : matching.filter((entry: MockLogEntry): boolean => Number(entry.id) > Number(after)).slice(0, 200);

      sendJSON(response, 200, {
        cursor: items.at(-1)?.id ?? after,
        items,
      });

      return true;
    }

    let cursor: number = Number(request.headers['last-event-id'] ?? after ?? (matching.at(-1)?.id ?? '0'));

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=utf-8',
    });
    response.write('retry: 3000\n\n');

    const poll: NodeJS.Timeout = setInterval((): void => {
      for (const entry of logs.filter((candidate: MockLogEntry): boolean => Number(candidate.id) > cursor && matchesLogFilters(candidate, component, minimumLevel, search))) {
        response.write(`id: ${entry.id}\nevent: log\ndata: ${JSON.stringify(entry)}\n\n`);
        cursor = Number(entry.id);
      }
    }, 1_000);
    const keepAlive: NodeJS.Timeout = setInterval((): void => {
      response.write(': keep-alive\n\n');
    }, 15_000);

    request.on('close', (): void => {
      clearInterval(poll);
      clearInterval(keepAlive);
    });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/diagnostics') {
    if (!requireScope('logs:read')) {
      return true;
    }

    sendJSON(response, 200, { debugLogging });

    return true;
  }

  if (method === 'PUT' && path === '/api/v1/diagnostics') {
    if (!requireSession() || !requirePermission('bot:control')) {
      return true;
    }

    const requested: unknown = body['debugLogging'];

    if (typeof requested !== 'boolean' || Object.keys(body).length !== 1) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('debugLogging', 'Choose on or off.')]);

      return true;
    }

    if (requested !== debugLogging) {
      debugLogging = requested;

      // The control panel changes at once, and the bot and the worker follow on their next check.
      writeLog('web', 'info', (requested) ? 'debug_logging_on' : 'debug_logging_off', {
        userId: user.id,
        username: user.username,
      });
      writeLog('bot', 'info', (requested) ? 'debug_logging_on' : 'debug_logging_off');
      writeLog('worker', 'info', (requested) ? 'debug_logging_on' : 'debug_logging_off');
    }

    sendJSON(response, 200, { debugLogging });

    return true;
  }

  // Everything below works only from a signed-in browser.
  if (!requireSession()) {
    return true;
  }

  if (method === 'GET' && path === '/api/v1/auth/security') {
    sendJSON(response, 200, {
      hostname: url.hostname,
      passkeys: passkeysByUser.get(user.id) ?? [],
      passkeysAvailable: true,
      recoveryCodesRemaining: user.recoveryCodes.length,
      role: user.role,
      totpEnabled: user.totpEnabled,
      username: user.username,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/password') {
    if (!checkPassword('currentPassword')) {
      return true;
    }

    if (passwordIssue(body['newPassword']) !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('newPassword', passwordIssue(body['newPassword']))]);

      return true;
    }

    user.password = String(body['newPassword']);
    writeLog('web', 'info', 'password_changed', {
      userId: user.id,
      username: user.username,
    });
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/username') {
    const nextUsername: string = String(body['username'] ?? '').trim();
    const nextUsernameIssue: string = usernameIssue(nextUsername);

    if (nextUsernameIssue !== '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('username', nextUsernameIssue)]);

      return true;
    }

    if (!checkPassword()) {
      return true;
    }

    if (users.some((candidate: MockUser): boolean => candidate.id !== user.id && candidate.username.toLowerCase() === nextUsername.toLowerCase())) {
      sendIssues(response, 409, 'username_taken', [fieldIssue('username', 'That username is already in use.')]);

      return true;
    }

    user.username = nextUsername;
    writeLog('web', 'info', 'username_changed', {
      userId: user.id,
      username: user.username,
    });
    sendJSON(response, 200, {
      user: {
        id: user.id,
        role: user.role,
        username: user.username,
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/setup') {
    if (!checkPassword()) {
      return true;
    }

    if (user.totpEnabled) {
      sendError(response, 409, 'totp_enabled', 'The authenticator app is already on.');

      return true;
    }

    // A new random secret with the same URI and QR code options as the real server, so the code
    // scans. The mock still accepts 123456 as the code.
    const totpSecret: Secret = new Secret({ size: 20 });
    const totpUri: string = new TOTP({
      algorithm: 'SHA1',
      digits: 6,
      issuer: 'Stonker Bot for Discord',
      label: user.username,
      period: 30,
      secret: totpSecret,
    }).toString();

    user.totpPending = true;
    sendJSON(response, 200, {
      expiresAt: new Date(Date.now() + (10 * minute)).toISOString(),
      qrCode: await toDataURL(totpUri, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 240,
      }),
      secret: totpSecret.base32,
      uri: totpUri,
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/enable') {
    if (!user.totpPending) {
      sendError(response, 409, 'totp_setup_expired', 'Authenticator setup expired. Start again.');

      return true;
    }

    if (body['code'] !== '123456') {
      sendIssues(response, 422, 'code_invalid', [fieldIssue('code', 'That code doesn\'t match. Check the time on your device and try again. In the mock, use 123456.')]);

      return true;
    }

    user.totpEnabled = true;
    user.totpPending = false;
    user.recoveryCodes = newRecoveryCodes();
    removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.kind !== 'authenticator' || removedSecret.userId !== user.id);
    writeLog('web', 'info', 'totp_enabled', {
      userId: user.id,
      username: user.username,
    });
    sendJSON(response, 200, { recoveryCodes: user.recoveryCodes });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/totp/disable') {
    if (!checkPassword()) {
      return true;
    }

    if (!user.totpEnabled) {
      sendError(response, 409, 'totp_disabled', 'The authenticator app is already off.');

      return true;
    }

    user.totpEnabled = false;
    user.recoveryCodes = [];
    writeLog('web', 'info', 'totp_disabled', {
      userId: user.id,
      username: user.username,
    });
    sendEmpty(response);

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/recovery-codes') {
    if (!checkPassword()) {
      return true;
    }

    if (!user.totpEnabled) {
      sendError(response, 409, 'totp_disabled', 'Turn on the authenticator app first.');

      return true;
    }

    user.recoveryCodes = newRecoveryCodes();
    writeLog('web', 'info', 'recovery_codes_replaced', {
      userId: user.id,
      username: user.username,
    });
    sendJSON(response, 200, { recoveryCodes: user.recoveryCodes });

    return true;
  }

  // Adding a passkey runs the browser's real prompt; the mock saves whatever answer comes back.
  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/options') {
    const passkeyName: string = (typeof body['name'] === 'string') ? body['name'].trim() : '';

    if (passkeyName === '' || [...passkeyName].length > 80) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', (passkeyName === '') ? 'Name this passkey.' : 'Use 80 characters or fewer.')]);

      return true;
    }

    if (!checkPassword()) {
      return true;
    }

    const ceremonyId: string = randomBytes(16).toString('base64url');

    passkeyCeremonies.set(ceremonyId, passkeyName);
    sendJSON(response, 200, {
      ceremonyId,
      options: {
        attestation: 'none',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'preferred',
        },
        challenge: randomBytes(32).toString('base64url'),
        excludeCredentials: [],
        pubKeyCredParams: [
          {
            alg: -7,
            type: 'public-key',
          },
          {
            alg: -257,
            type: 'public-key',
          },
        ],
        rp: {
          id: url.hostname,
          name: 'Stonker Bot',
        },
        timeout: 300000,
        user: {
          displayName: user.username,
          id: Buffer.from(user.id).toString('base64url'),
          name: user.username,
        },
      },
    });

    return true;
  }

  if (method === 'POST' && path === '/api/v1/auth/passkeys/register/verify') {
    const ceremonyId: string = (typeof body['ceremonyId'] === 'string') ? body['ceremonyId'] : '';
    const passkeyName: string | undefined = passkeyCeremonies.get(ceremonyId);

    if (passkeyName === undefined) {
      sendError(response, 409, 'passkey_ceremony_invalid', 'That passkey request expired. Try again.');

      return true;
    }

    const passkey: MockPasskey = {
      createdAt: new Date().toISOString(),
      hostname: url.hostname,
      id: `pk-${randomBytes(12).toString('base64url')}`,
      lastUsedAt: null,
      name: passkeyName,
    };

    passkeyCeremonies.delete(ceremonyId);
    passkeysByUser.set(user.id, [
      ...(passkeysByUser.get(user.id) ?? []),
      passkey,
    ]);
    sendJSON(response, 201, passkey);

    return true;
  }

  if (method === 'DELETE' && path.startsWith('/api/v1/auth/passkeys/')) {
    const passkeyId: string = decodeURIComponent(path.slice('/api/v1/auth/passkeys/'.length));
    const saved: MockPasskey[] = passkeysByUser.get(user.id) ?? [];

    if (!saved.some((passkey: MockPasskey): boolean => passkey.id === passkeyId)) {
      sendError(response, 404, 'passkey_not_found', 'That passkey no longer exists.');

      return true;
    }

    if (!checkPassword()) {
      return true;
    }

    passkeysByUser.set(user.id, saved.filter((passkey: MockPasskey): boolean => passkey.id !== passkeyId));
    sendEmpty(response);

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications/events') {
    if (!requireSession() || !requirePermission('configuration:write')) {
      return true;
    }

    sendJSON(response, 200, { items: notificationEvents });

    return true;
  }

  if (method === 'GET' && path === '/api/v1/notifications') {
    if (!requireSession() || !requirePermission('configuration:write')) {
      return true;
    }

    sendJSON(response, 200, { items: [...notifications].sort((left: MockNotification, right: MockNotification): number => right.createdAt.localeCompare(left.createdAt)) });

    return true;
  }

  // notificationInput checks a create or edit body like the server, sending the first problem.

  /**
   * Mock API - Notification input.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const notificationInput = (existing: MockNotification | null): MockNotificationInput | null => {
    const service: MockNotificationService = existing?.service ?? body['service'] as MockNotificationService;
    const name: string = (typeof body['name'] === 'string') ? body['name'].trim() : '';
    const events: string[] = (Array.isArray(body['events'])) ? body['events'] as string[] : [];
    const values: Record<string, unknown> = (typeof body['settings'] === 'object' && body['settings'] !== null) ? body['settings'] as Record<string, unknown> : {};

    if (notificationFields[service] === undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('service', 'Choose a service.')]);

      return null;
    }

    if (name === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Name this notification.')]);

      return null;
    }

    if (events.length === 0) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('events', 'Choose at least one event.')]);

      return null;
    }

    const settings: Record<string, string> = {};
    const secrets: Record<string, true> = { ...(existing?.secrets ?? {}) };

    for (const [
      key,
      missing,
      secret,
      required,
    ] of notificationFields[service]) {
      const value: string = (typeof values[key] === 'string') ? (values[key]).trim() : '';
      const saved: boolean = secret && existing !== null && existing.secrets[key] === true;

      if (value === '' && required && !saved) {
        sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${key}`, missing)]);

        return null;
      }

      if (value !== '' && secret) {
        secrets[key] = true;
      } else if (value !== '') {
        settings[key] = value;
      }
    }

    // Optional secrets that are saved, or missing after a lost key, can be cleared once each, never alongside a new value.
    const clearable: string[] = notificationFields[service]
      .filter((field: MockNotificationField): boolean => field[2] && !field[3] && existing !== null && (existing.secrets[field[0]] === true || existing.secretsMissing.includes(field[0])))
      .map((field: MockNotificationField): string => field[0]);
    const clearSecrets: unknown[] = (Array.isArray(body['clearSecrets'])) ? body['clearSecrets'] : [];
    const invalidIndex: number = clearSecrets.findIndex((key: unknown): boolean => typeof key !== 'string' || !clearable.includes(key));

    if (body['clearSecrets'] !== undefined && !Array.isArray(body['clearSecrets'])) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose an optional saved secret.')]);

      return null;
    }

    if (invalidIndex !== -1) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`clearSecrets.${invalidIndex}`, 'Choose an optional saved secret.')]);

      return null;
    }

    if (new Set(clearSecrets).size !== clearSecrets.length) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('clearSecrets', 'Choose each secret only once.')]);

      return null;
    }

    const replaced: string | undefined = (clearSecrets as string[]).find((key: string): boolean => typeof values[key] === 'string' && (values[key]).trim() !== '');

    if (replaced !== undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue(`settings.${replaced}`, 'Enter a new value or clear this field, not both.')]);

      return null;
    }

    for (const key of clearSecrets as string[]) {
      Reflect.deleteProperty(secrets, key);
    }

    if (notifications.some((notification: MockNotification): boolean => notification.id !== existing?.id && notification.name.toLowerCase() === name.toLowerCase())) {
      sendIssues(response, 409, 'notification_exists', [fieldIssue('name', 'A notification with this name already exists.')]);

      return null;
    }

    return {
      clearSecrets: clearSecrets as string[],
      events,
      name,
      secrets,
      service,
      settings,
    };
  };

  if (method === 'POST' && path === '/api/v1/notifications') {
    if (!requireSession() || !requirePermission('configuration:write')) {
      return true;
    }

    const input: MockNotificationInput | null = notificationInput(null);

    if (input === null) {
      return true;
    }

    const notification: MockNotification = {
      events: input.events,
      name: input.name,
      secrets: input.secrets,
      service: input.service,
      settings: input.settings,
      createdAt: new Date().toISOString(),
      id: `ntf-${randomBytes(8).toString('hex')}`,
      lastAttemptAt: null,
      lastError: null,
      secretsMissing: [],
      updatedAt: new Date().toISOString(),
    };

    notifications.push(notification);
    writeLog('web', 'info', 'notification_created', {
      notificationId: notification.id,
      notificationName: notification.name,
      service: notification.service,
      userId: user.id,
      username: user.username,
    });
    sendJSON(response, 201, notification);

    return true;
  }

  const notificationMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/notifications\/(ntf-[0-9a-f]{16})(\/test)?$/u);

  if (notificationMatch !== null) {
    if (!requireSession() || !requirePermission('configuration:write')) {
      return true;
    }

    const index: number = notifications.findIndex((notification: MockNotification): boolean => notification.id === notificationMatch[1]);
    const notification: MockNotification | undefined = notifications[index];

    if (notification === undefined) {
      sendError(response, 404, 'notification_not_found', 'That notification no longer exists.');

      return true;
    }

    if (method === 'POST' && notificationMatch[2] === '/test') {
      if (notification.secretsMissing.length > 0) {
        sendJSON(response, 200, {
          delivered: false,
          message: 'Enter the removed secrets again first.',
        });

        return true;
      }

      notification.lastAttemptAt = new Date().toISOString();
      notification.lastError = null;
      sendJSON(response, 200, { delivered: true });

      return true;
    }

    if (method === 'DELETE') {
      notifications.splice(index, 1);
      removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.notificationId !== notification.id);
      writeLog('web', 'info', 'notification_removed', {
        notificationId: notification.id,
        notificationName: notification.name,
        userId: user.id,
        username: user.username,
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'PUT') {
      const input: MockNotificationInput | null = notificationInput(notification);

      if (input === null) {
        return true;
      }

      notification.events = input.events;
      notification.name = input.name;
      notification.secrets = input.secrets;
      // A missing secret is settled by entering it again or, when optional, by clearing it.
      notification.secretsMissing = notification.secretsMissing.filter((key: string): boolean => input.secrets[key] !== true && !input.clearSecrets.includes(key));
      notification.settings = input.settings;
      notification.updatedAt = new Date().toISOString();

      if (notification.secretsMissing.length === 0) {
        removedSecrets = removedSecrets.filter((removedSecret): boolean => removedSecret.notificationId !== notification.id);
      }

      writeLog('web', 'info', 'notification_updated', {
        notificationId: notification.id,
        notificationName: notification.name,
        userId: user.id,
        username: user.username,
      });
      sendJSON(response, 200, notification);

      return true;
    }
  }

  if (method === 'GET' && path === '/api/v1/auth/tokens') {
    sendJSON(response, 200, {
      items: tokens
        .filter((token: MockToken): boolean => token.userId === user.id)
        .sort((left: MockToken, right: MockToken): number => right.createdAt.localeCompare(left.createdAt))
        .map(tokenResource),
    });

    return true;
  }

  // tokenInput reads and checks a create or edit body, sending the first problem it finds.

  /**
   * Mock API - Token input.
   *
   * Stores this module-level value in one named location.
   * Related code reuses it instead of duplicating the definition.
   *
   * @since 4.0.0
   */
  const tokenInput = (exceptId: string): {
    name: string
    scopes: MockScope[]
  } | null => {
    const name: string = (typeof body['name'] === 'string') ? body['name'].trim() : '';
    const scopes: MockScope[] = (Array.isArray(body['scopes'])) ? body['scopes'] as MockScope[] : [];
    const grantable: MockScope[] = (user.role === 'viewer') ? [
      'features:read',
      'logs:read',
    ] : scopeOrder;

    if (name === '') {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Name this token.')]);

      return null;
    }

    if (name.length > 80) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('name', 'Use 80 characters or fewer.')]);

      return null;
    }

    if (scopes.length === 0) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('scopes', 'Choose at least one scope.')]);

      return null;
    }

    if (scopes.some((scope: MockScope): boolean => !scopeOrder.includes(scope))) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('scopes', `Choose from: ${scopeOrder.join(', ')}.`)]);

      return null;
    }

    const ungrantable: MockScope | undefined = scopes.find((scope: MockScope): boolean => !grantable.includes(scope));

    if (ungrantable !== undefined) {
      sendIssues(response, 422, 'invalid_request', [fieldIssue('scopes', `Your role can't grant ${ungrantable}.`)]);

      return null;
    }

    if (tokens.some((token: MockToken): boolean => token.userId === user.id && token.id !== exceptId && token.name.toLowerCase() === name.toLowerCase())) {
      sendIssues(response, 409, 'token_exists', [fieldIssue('name', 'A token with this name already exists.')]);

      return null;
    }

    return {
      name,
      scopes: scopeOrder.filter((scope: MockScope): boolean => scopes.includes(scope)),
    };
  };

  if (method === 'POST' && path === '/api/v1/auth/tokens') {
    const input: {
      name: string
      scopes: MockScope[]
    } | null = tokenInput('');

    if (input === null) {
      return true;
    }

    const plaintext: string = `dsb_${randomBytes(32).toString('base64url')}`;
    const token: MockToken = {
      createdAt: nowIso(),
      expiresAt: (typeof body['expiresAt'] === 'string') ? body['expiresAt'] : null,
      hash: digest(plaintext),
      id: `tok-${randomBytes(8).toString('hex')}`,
      lastUsedAt: null,
      name: input.name,
      scopes: input.scopes,
      userId: user.id,
    };

    tokens.push(token);
    writeLog('web', 'info', 'token_created', {
      name: token.name,
      userId: user.id,
      username: user.username,
    });
    sendJSON(response, 201, {
      plaintext,
      token: tokenResource(token),
    });

    return true;
  }

  const tokenMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/auth\/tokens\/([a-z0-9-]+)$/u);

  if (tokenMatch !== null) {
    const index: number = tokens.findIndex((token: MockToken): boolean => token.id === tokenMatch[1] && token.userId === user.id);
    const token: MockToken | undefined = tokens[index];

    if (token === undefined) {
      sendError(response, 404, 'token_not_found', 'That token no longer exists.');

      return true;
    }

    if (method === 'DELETE') {
      tokens.splice(index, 1);
      writeLog('web', 'info', 'token_revoked', {
        name: token.name,
        userId: user.id,
        username: user.username,
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'PUT') {
      const input: {
        name: string
        scopes: MockScope[]
      } | null = tokenInput(token.id);

      if (input === null) {
        return true;
      }

      token.name = input.name;
      token.scopes = input.scopes;

      if (body['expiresAt'] !== undefined) {
        token.expiresAt = (typeof body['expiresAt'] === 'string') ? body['expiresAt'] : null;
      }

      writeLog('web', 'info', 'token_updated', {
        name: token.name,
        userId: user.id,
        username: user.username,
      });
      sendJSON(response, 200, tokenResource(token));

      return true;
    }
  }

  if (path === '/api/v1/users' || path.startsWith('/api/v1/users/')) {
    if (!requirePermission('users:manage')) {
      return true;
    }

    // accessInput checks the role and server access a create or edit gives.

    /**
     * Mock API - Access input.
     *
     * Stores this module-level value in one named location.
     * Related code reuses it instead of duplicating the definition.
     *
     * @since 4.0.0
     */
    const accessInput = (): {
      allServers: boolean
      role: MockRole
      serverIds: string[]
    } | null => {
      const role: unknown = body['role'];
      const allServers: boolean = body['allServers'] === true;
      const serverIds: string[] = (Array.isArray(body['serverIds'])) ? body['serverIds'].map(String) : [];
      const issues: MockIssue[] = [];

      if (role !== 'administrator' && role !== 'operator' && role !== 'viewer') {
        issues.push(fieldIssue('role', 'Choose administrator, operator, or viewer.'));
      }

      if (allServers && !user.allServers) {
        issues.push(fieldIssue('allServers', 'You can only give access to servers you can see.'));
      }

      if (!allServers && serverIds.length === 0) {
        issues.push(fieldIssue('serverIds', 'Choose at least one server.'));
      }

      if (!allServers && !user.allServers && serverIds.some((serverId: string): boolean => !user.serverIds.includes(serverId))) {
        issues.push(fieldIssue('serverIds', 'You can only give access to servers you can see.'));
      }

      if (issues.length > 0) {
        sendIssues(response, 422, 'invalid_request', issues);

        return null;
      }

      return {
        allServers,
        role: role as MockRole,
        serverIds: (allServers) ? [] : [...new Set(serverIds)],
      };
    };

    if (method === 'GET' && path === '/api/v1/users') {
      sendJSON(response, 200, {
        items: [...users]
          .sort((left: MockUser, right: MockUser): number => (roleRank[left.role] - roleRank[right.role]) || left.username.localeCompare(right.username))
          .map((candidate: MockUser): Record<string, unknown> => userResource(candidate, user)),
      });

      return true;
    }

    if (method === 'POST' && path === '/api/v1/users') {
      const username: string = String(body['username'] ?? '').trim();
      const usernameProblem: string = usernameIssue(username);
      const passwordProblem: string = passwordIssue(body['password']);
      const problems: MockIssue[] = [];

      // Like the server, every field with a problem is reported at once.
      if (usernameProblem !== '') {
        problems.push(fieldIssue('username', usernameProblem));
      }

      if (passwordProblem !== '') {
        problems.push(fieldIssue('password', passwordProblem));
      }

      if (problems.length > 0) {
        sendIssues(response, 422, 'invalid_request', problems);

        return true;
      }

      const access: {
        allServers: boolean
        role: MockRole
        serverIds: string[]
      } | null = accessInput();

      if (access === null) {
        return true;
      }

      if (users.some((candidate: MockUser): boolean => candidate.username.toLowerCase() === username.toLowerCase())) {
        sendIssues(response, 409, 'username_taken', [fieldIssue('username', 'That username is already in use.')]);

        return true;
      }

      const created: MockUser = {
        ...access,
        createdAt: nowIso(),
        enabled: true,
        id: userIdFor(userSequence),
        lastSignInAt: null,
        password: String(body['password']),
        recoveryCodes: [],
        totpEnabled: false,
        totpPending: false,
        username,
      };

      userSequence += 1;
      users.push(created);
      writeLog('web', 'info', 'user_created', {
        targetUserId: created.id,
        userId: user.id,
        username: user.username,
      });
      sendJSON(response, 201, userResource(created, user));

      return true;
    }

    const userMatch: RegExpMatchArray | null = path.match(/^\/api\/v1\/users\/([^/]+)(\/password|\/two-factor\/reset)?$/u);
    const target: MockUser | undefined = (userMatch === null) ? undefined : users.find((candidate: MockUser): boolean => candidate.id === userMatch[1]);

    if (userMatch === null || target === undefined) {
      sendError(response, 404, 'user_not_found', 'That user no longer exists.');

      return true;
    }

    if (!editableBy(user, target)) {
      sendError(response, 403, 'user_protected', 'You can\'t change this account here.');

      return true;
    }

    if (method === 'PUT' && userMatch[2] === undefined) {
      const access: {
        allServers: boolean
        role: MockRole
        serverIds: string[]
      } | null = accessInput();

      if (access === null) {
        return true;
      }

      if (typeof body['enabled'] !== 'boolean') {
        sendIssues(response, 422, 'invalid_request', [fieldIssue('enabled', 'Choose whether they can sign in.')]);

        return true;
      }

      Object.assign(target, access, { enabled: body['enabled'] });

      if (!target.enabled) {
        signOutUser(target.id);
      }

      writeLog('web', 'info', 'user_updated', {
        targetUserId: target.id,
        userId: user.id,
        username: user.username,
      });
      sendJSON(response, 200, userResource(target, user));

      return true;
    }

    if (method === 'POST' && userMatch[2] === '/password') {
      if (passwordIssue(body['password']) !== '') {
        sendIssues(response, 422, 'invalid_request', [fieldIssue('password', passwordIssue(body['password']))]);

        return true;
      }

      target.password = String(body['password']);
      signOutUser(target.id);
      writeLog('web', 'info', 'user_password_reset', {
        targetUserId: target.id,
        userId: user.id,
        username: user.username,
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'POST' && userMatch[2] === '/two-factor/reset') {
      target.totpEnabled = false;
      target.recoveryCodes = [];
      writeLog('web', 'info', 'user_two_factor_reset', {
        targetUserId: target.id,
        userId: user.id,
        username: user.username,
      });
      sendEmpty(response);

      return true;
    }

    if (method === 'DELETE' && userMatch[2] === undefined) {
      users.splice(users.indexOf(target), 1);
      signOutUser(target.id);

      for (let index = tokens.length - 1; index >= 0; index -= 1) {
        if (tokens[index]?.userId === target.id) {
          tokens.splice(index, 1);
        }
      }

      writeLog('web', 'info', 'user_deleted', {
        targetUserId: target.id,
        userId: user.id,
        username: user.username,
      });
      sendEmpty(response);

      return true;
    }
  }

  sendError(response, 404, 'not_found', 'No route matches this request.');

  return true;
};

/**
 * Mock API.
 *
 * Answers the control panel's API from memory, so it runs without Discord or Postgres.
 * The setup code prints at start; other accounts use "mock password 123", codes 123456.
 * Feature editors, examples, import, and checks come from the real server modules.
 *
 * @returns {Plugin}
 *
 * @since 4.0.0
 */
export const mockApi = (): Plugin => ({
  name: 'discord-stonker-bot-mock-api',
  configureServer: (server: ViteDevServer): void => {
    viteServer = server;
    seedLogs();
    server.config.logger.info(`  Mock setup code: ${setupCode}`);
    server.config.logger.info(`  Mock accounts after setup: avery, riley, jordan, sam, casey (password "${mockPassword}")`);

    const liveTimer: NodeJS.Timeout = setInterval(writeLiveLog, 4_000);

    server.httpServer?.on('close', (): void => clearInterval(liveTimer));

    server.middlewares.use((request: IncomingMessage, response: ServerResponse, next: () => void): void => {
      void handleRequest(request, response).then((handled: boolean): void => {
        if (!handled) {
          next();
        }
      }).catch((error: unknown): void => {
        server.config.logger.error(`  Mock API error: ${(error instanceof Error) ? error.stack ?? error.message : String(error)}`);

        if (!response.headersSent) {
          sendError(response, 500, 'internal_error', 'Something went wrong. Try again.');
        }
      });
    });
  },
});
