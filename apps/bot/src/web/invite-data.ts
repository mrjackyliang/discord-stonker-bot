import type {
  Web_Invite_Data,
  Web_Invite_PageData,
  Web_Invite_ServerData,
} from '@/types/web/invite.d.ts';

// The public page checks its data by hand, so visitors don't download the console's validator.

/**
 * Invite Data - Checks whether record.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

/**
 * Invite Data - Checks whether nullable string.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string';

/**
 * Invite Data - Checks whether nullable number.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const isNullableNumber = (value: unknown): value is number | null => value === null || (typeof value === 'number' && Number.isFinite(value));

/**
 * Invite Data - Reads page.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readPage = (value: unknown): Web_Invite_PageData | null => {
  if (!isRecord(value)) {
    return null;
  }

  const theme: unknown = value['theme'];

  if (
    typeof value['accentColor'] !== 'string'
    || !isNullableString(value['bannerUrl'])
    || typeof value['buttonLabel'] !== 'string'
    || typeof value['description'] !== 'string'
    || typeof value['footerText'] !== 'string'
    || !isNullableString(value['logoUrl'])
    || typeof value['showBoostTier'] !== 'boolean'
    || typeof value['showMemberCount'] !== 'boolean'
    || (theme !== 'dark' && theme !== 'light' && theme !== 'system')
    || typeof value['title'] !== 'string'
  ) {
    return null;
  }

  return {
    accentColor: value['accentColor'],
    bannerUrl: value['bannerUrl'],
    buttonLabel: value['buttonLabel'],
    description: value['description'],
    footerText: value['footerText'],
    logoUrl: value['logoUrl'],
    showBoostTier: value['showBoostTier'],
    showMemberCount: value['showMemberCount'],
    theme,
    title: value['title'],
  };
};

/**
 * Invite Data - Reads server.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readServer = (value: unknown): Web_Invite_ServerData | null => {
  if (
    !isRecord(value)
    || !isNullableNumber(value['boostTier'])
    || !isNullableString(value['iconUrl'])
    || !isNullableNumber(value['memberCount'])
    || typeof value['name'] !== 'string'
  ) {
    return null;
  }

  return {
    boostTier: value['boostTier'],
    iconUrl: value['iconUrl'],
    memberCount: value['memberCount'],
    name: value['name'],
  };
};

// parseInviteData checks the JSON the server embedded in the page.

/**
 * Invite Data - Parses invite data.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const parseInviteData = (value: unknown): Web_Invite_Data | null => {
  if (!isRecord(value)) {
    return null;
  }

  const page: Web_Invite_PageData | null = readPage(value['page']);
  const server: Web_Invite_ServerData | null = readServer(value['server']);

  if (
    page === null
    || server === null
    || typeof value['available'] !== 'boolean'
    || !isNullableString(value['recaptchaSiteKey'])
    || typeof value['submitPath'] !== 'string'
    || !value['submitPath'].startsWith('/')
  ) {
    return null;
  }

  return {
    available: value['available'],
    page,
    recaptchaSiteKey: value['recaptchaSiteKey'],
    server,
    submitPath: value['submitPath'],
  };
};

// errorText reads the message of the shared error envelope.

/**
 * Invite Data - Error text.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const errorText = (value: unknown): string | null => {
  if (!isRecord(value) || !isRecord(value['error'])) {
    return null;
  }

  const message: unknown = value['error']['message'];

  return (typeof message === 'string' && message !== '') ? message : null;
};

// inviteUrlOf reads the invite link the join answer carries.

/**
 * Invite Data - Invite URL of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const inviteUrlOf = (value: unknown): string | null => (
  (isRecord(value) && typeof value['inviteUrl'] === 'string') ? value['inviteUrl'] : null
);
