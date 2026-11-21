import type {
  Web_InviteData_ErrorText_Message,
  Web_InviteData_ErrorText_Returns,
  Web_InviteData_ErrorText_Value,
  Web_InviteData_InviteUrlOf_Returns,
  Web_InviteData_InviteUrlOf_Value,
  Web_InviteData_IsNullableNumber_TypeGuard,
  Web_InviteData_IsNullableNumber_Value,
  Web_InviteData_IsNullableString_TypeGuard,
  Web_InviteData_IsNullableString_Value,
  Web_InviteData_IsRecord_TypeGuard,
  Web_InviteData_IsRecord_Value,
  Web_InviteData_ParseInviteData_Page,
  Web_InviteData_ParseInviteData_Returns,
  Web_InviteData_ParseInviteData_Server,
  Web_InviteData_ParseInviteData_Value,
  Web_InviteData_ReadPage_Returns,
  Web_InviteData_ReadPage_Theme,
  Web_InviteData_ReadPage_Value,
  Web_InviteData_ReadServer_Returns,
  Web_InviteData_ReadServer_Value,
} from '@/types/web/invite-data.d.ts';

// The public page checks its data by hand, so visitors don't download the console's validator.

/**
 * Invite Data - Is Record.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_IsRecord_Value} value - Value.
 *
 * @returns {Web_InviteData_IsRecord_TypeGuard}
 *
 * @since 4.0.0
 */
const isRecord = (value: Web_InviteData_IsRecord_Value): value is Web_InviteData_IsRecord_TypeGuard => (
  typeof value === 'object'
  && value !== null
  && Array.isArray(value) === false
);

/**
 * Invite Data - Is Nullable String.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_IsNullableString_Value} value - Value.
 *
 * @returns {Web_InviteData_IsNullableString_TypeGuard}
 *
 * @since 4.0.0
 */
const isNullableString = (value: Web_InviteData_IsNullableString_Value): value is Web_InviteData_IsNullableString_TypeGuard => value === null || typeof value === 'string';

/**
 * Invite Data - Is Nullable Number.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_IsNullableNumber_Value} value - Value.
 *
 * @returns {Web_InviteData_IsNullableNumber_TypeGuard}
 *
 * @since 4.0.0
 */
const isNullableNumber = (value: Web_InviteData_IsNullableNumber_Value): value is Web_InviteData_IsNullableNumber_TypeGuard => (
  value === null
  || (
    typeof value === 'number'
    && Number.isFinite(value) === true
  )
);

/**
 * Invite Data - Read Page.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_ReadPage_Value} value - Value.
 *
 * @returns {Web_InviteData_ReadPage_Returns}
 *
 * @since 4.0.0
 */
const readPage = (value: Web_InviteData_ReadPage_Value): Web_InviteData_ReadPage_Returns => {
  if (isRecord(value) === false) {
    return null;
  }

  const theme: Web_InviteData_ReadPage_Theme = value['theme'];

  if (
    typeof value['accentColor'] !== 'string'
    || isNullableString(value['bannerUrl']) === false
    || typeof value['buttonLabel'] !== 'string'
    || typeof value['description'] !== 'string'
    || typeof value['footerText'] !== 'string'
    || isNullableString(value['logoUrl']) === false
    || typeof value['showBoostTier'] !== 'boolean'
    || typeof value['showMemberCount'] !== 'boolean'
    || (
      theme !== 'dark'
      && theme !== 'light'
      && theme !== 'system'
    )
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
 * Invite Data - Read Server.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_ReadServer_Value} value - Value.
 *
 * @returns {Web_InviteData_ReadServer_Returns}
 *
 * @since 4.0.0
 */
const readServer = (value: Web_InviteData_ReadServer_Value): Web_InviteData_ReadServer_Returns => {
  if (
    isRecord(value) === false
    || isNullableNumber(value['boostTier']) === false
    || isNullableString(value['iconUrl']) === false
    || isNullableNumber(value['memberCount']) === false
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
 * Invite Data - Parse Invite Data.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_ParseInviteData_Value} value - Value.
 *
 * @returns {Web_InviteData_ParseInviteData_Returns}
 *
 * @since 4.0.0
 */
export const parseInviteData = (value: Web_InviteData_ParseInviteData_Value): Web_InviteData_ParseInviteData_Returns => {
  if (isRecord(value) === false) {
    return null;
  }

  const page: Web_InviteData_ParseInviteData_Page = readPage(value['page']);
  const server: Web_InviteData_ParseInviteData_Server = readServer(value['server']);

  if (
    page === null
    || server === null
    || typeof value['available'] !== 'boolean'
    || isNullableString(value['recaptchaSiteKey']) === false
    || typeof value['submitPath'] !== 'string'
    || value['submitPath'].startsWith('/') === false
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
 * Invite Data - Error Text.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_ErrorText_Value} value - Value.
 *
 * @returns {Web_InviteData_ErrorText_Returns}
 *
 * @since 4.0.0
 */
export const errorText = (value: Web_InviteData_ErrorText_Value): Web_InviteData_ErrorText_Returns => {
  if (isRecord(value) === false || isRecord(value['error']) === false) {
    return null;
  }

  const message: Web_InviteData_ErrorText_Message = value['error']['message'];

  return (typeof message === 'string' && message !== '') ? message : null;
};

// inviteUrlOf reads the invite link the join answer carries.

/**
 * Invite Data - Invite URL Of.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteData_InviteUrlOf_Value} value - Value.
 *
 * @returns {Web_InviteData_InviteUrlOf_Returns}
 *
 * @since 4.0.0
 */
export const inviteUrlOf = (value: Web_InviteData_InviteUrlOf_Value): Web_InviteData_InviteUrlOf_Returns => (
  (isRecord(value) === true && typeof value['inviteUrl'] === 'string') ? value['inviteUrl'] : null
);
