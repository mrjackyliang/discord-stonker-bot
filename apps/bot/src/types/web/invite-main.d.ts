import type {
  Dispatch,
  ReactElement,
  RefObject,
  SetStateAction,
} from 'react';

import type {
  Web_Invite_AppProps,
  Web_Invite_Data,
  Web_Invite_JoinState,
  Web_Invite_Recaptcha,
} from '@/types/web/invite.d.ts';

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_InviteApp_Props = Web_Invite_AppProps;
export type Web_InviteMain_InviteApp_Returns = ReactElement;
export type Web_InviteMain_InviteApp_Data = Web_Invite_Data;
export type Web_InviteMain_InviteApp_JoinStateState = [Web_Invite_JoinState, Dispatch<SetStateAction<Web_Invite_JoinState>>];
export type Web_InviteMain_InviteApp_JoinState = Web_Invite_JoinState;
export type Web_InviteMain_InviteApp_SetJoinState = Dispatch<SetStateAction<Web_Invite_JoinState>>;
export type Web_InviteMain_InviteApp_ErrorState = [string, Dispatch<SetStateAction<string>>];
export type Web_InviteMain_InviteApp_Error = string;
export type Web_InviteMain_InviteApp_SetError = Dispatch<SetStateAction<string>>;
export type Web_InviteMain_InviteApp_ContainerValue = HTMLDivElement | null;
export type Web_InviteMain_InviteApp_Container = RefObject<HTMLDivElement | null>;
export type Web_InviteMain_InviteApp_WidgetIdValue = number | null;
export type Web_InviteMain_InviteApp_WidgetId = RefObject<number | null>;
export type Web_InviteMain_InviteApp_SiteKey = string | null;
export type Web_InviteMain_InviteApp_Render_Returns = void;
export type Web_InviteMain_InviteApp_Render = () => Web_InviteMain_InviteApp_Render_Returns;
export type Web_InviteMain_InviteApp_Render_Recaptcha = Web_Invite_Recaptcha | undefined;
export type Web_InviteMain_InviteApp_Script = HTMLScriptElement;
export type Web_InviteMain_InviteApp_ResetRecaptcha_Returns = void;
export type Web_InviteMain_InviteApp_ResetRecaptcha = () => Web_InviteMain_InviteApp_ResetRecaptcha_Returns;
export type Web_InviteMain_InviteApp_ResetRecaptcha_Recaptcha = Web_Invite_Recaptcha | undefined;
export type Web_InviteMain_InviteApp_Join_Returns = Promise<void>;
export type Web_InviteMain_InviteApp_Join = () => Web_InviteMain_InviteApp_Join_Returns;
export type Web_InviteMain_InviteApp_Join_Token = string;
export type Web_InviteMain_InviteApp_Join_Recaptcha = Web_Invite_Recaptcha | undefined;
export type Web_InviteMain_InviteApp_Join_Response = Response;
export type Web_InviteMain_InviteApp_Join_Body = unknown;
export type Web_InviteMain_InviteApp_Join_InviteUrl = string | null;

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_InviteData = Web_Invite_Data | null;

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_PrefersDark_Theme = Web_Invite_Data['page']['theme'];
export type Web_InviteMain_PrefersDark_Returns = boolean;

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_ReadInviteData_Returns = Web_Invite_Data | null;
export type Web_InviteMain_ReadInviteData_Element = HTMLElement | null;

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_ReadRecaptcha_Returns = Web_Invite_Recaptcha | undefined;
export type Web_InviteMain_ReadRecaptcha_Value = unknown;
export type Web_InviteMain_ReadRecaptcha_Recaptcha = Web_Invite_Recaptcha;

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_RecaptchaCallbackName = string;

/**
 * Invite Main.
 *
 * @since 4.2.1
 */
export type Web_InviteMain_RootElement = HTMLElement | null;
