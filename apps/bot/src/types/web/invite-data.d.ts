import type {
  Web_Invite_Data,
  Web_Invite_PageData,
  Web_Invite_ServerData,
} from '@/types/web/invite.d.ts';

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_ErrorText_Value = unknown;
export type Web_InviteData_ErrorText_Returns = string | null;
export type Web_InviteData_ErrorText_Message = unknown;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_InviteUrlOf_Value = unknown;
export type Web_InviteData_InviteUrlOf_Returns = string | null;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_IsNullableNumber_Value = unknown;
export type Web_InviteData_IsNullableNumber_TypeGuard = number | null;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_IsNullableString_Value = unknown;
export type Web_InviteData_IsNullableString_TypeGuard = string | null;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_IsRecord_Value = unknown;
export type Web_InviteData_IsRecord_TypeGuard = Record<string, unknown>;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_ParseInviteData_Value = unknown;
export type Web_InviteData_ParseInviteData_Returns = Web_Invite_Data | null;
export type Web_InviteData_ParseInviteData_Page = Web_Invite_PageData | null;
export type Web_InviteData_ParseInviteData_Server = Web_Invite_ServerData | null;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_ReadPage_Value = unknown;
export type Web_InviteData_ReadPage_Returns = Web_Invite_PageData | null;
export type Web_InviteData_ReadPage_Theme = unknown;

/**
 * Invite Data.
 *
 * @since 4.2.1
 */
export type Web_InviteData_ReadServer_Value = unknown;
export type Web_InviteData_ReadServer_Returns = Web_Invite_ServerData | null;
