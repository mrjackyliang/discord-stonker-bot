import type {
  CSSProperties,
  ReactElement,
} from 'react';

import type { Web_Components_InvitePage_Props } from '@/types/web/components.d.ts';
import type {
  Web_Invite_FooterPart,
  Web_Invite_Rgb,
} from '@/types/web/invite.d.ts';

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_ButtonTextColor_Accent = Web_Invite_Rgb;
export type Web_InvitePage_ButtonTextColor_Returns = Web_Invite_Rgb;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_ContrastRatio_First = Web_Invite_Rgb;
export type Web_InvitePage_ContrastRatio_Second = Web_Invite_Rgb;
export type Web_InvitePage_ContrastRatio_Returns = number;
export type Web_InvitePage_ContrastRatio_Lighter = number;
export type Web_InvitePage_ContrastRatio_Darker = number;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_DarkText = Web_Invite_Rgb;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_FallbackAccent = Web_Invite_Rgb;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_FooterLinkPattern = RegExp;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_InvitePage_Props = Web_Components_InvitePage_Props;
export type Web_InvitePage_InvitePage_Returns = ReactElement;
export type Web_InvitePage_InvitePage_Available = Web_Components_InvitePage_Props['available'];
export type Web_InvitePage_InvitePage_Error = Web_Components_InvitePage_Props['error'];
export type Web_InvitePage_InvitePage_JoinState = Web_Components_InvitePage_Props['joinState'];
export type Web_InvitePage_InvitePage_OnJoin = Web_Components_InvitePage_Props['onJoin'];
export type Web_InvitePage_InvitePage_Page = Web_Components_InvitePage_Props['page'];
export type Web_InvitePage_InvitePage_Preview = NonNullable<Web_Components_InvitePage_Props['preview']>;
export type Web_InvitePage_InvitePage_Recaptcha = ReactElement | null;
export type Web_InvitePage_InvitePage_Server = Web_Components_InvitePage_Props['server'];
export type Web_InvitePage_InvitePage_Accent = Web_Invite_Rgb;
export type Web_InvitePage_InvitePage_Style = CSSProperties;
export type Web_InvitePage_InvitePage_CustomProperty = string;
export type Web_InvitePage_InvitePage_Stats = string[];
export type Web_InvitePage_InvitePage_MemberNoun = string;
export type Web_InvitePage_InvitePage_Footer = Web_Invite_FooterPart[];
export type Web_InvitePage_InvitePage_Busy = boolean;
export type Web_InvitePage_InvitePage_ButtonLabel = string;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_Luminance_Color = Web_Invite_Rgb;
export type Web_InvitePage_Luminance_Returns = number;
export type Web_InvitePage_Luminance_Channels = number[];
export type Web_InvitePage_Luminance_Value = number;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_ParseFooter_Text = string;
export type Web_InvitePage_ParseFooter_Returns = Web_Invite_FooterPart[];
export type Web_InvitePage_ParseFooter_Parts = Web_Invite_FooterPart[];
export type Web_InvitePage_ParseFooter_Position = number;
export type Web_InvitePage_ParseFooter_Index = number;
export type Web_InvitePage_ParseFooter_Label = string | undefined;
export type Web_InvitePage_ParseFooter_Address = string;
export type Web_InvitePage_ParseFooter_Trailing = string;
export type Web_InvitePage_ParseFooter_Punctuation = RegExpExecArray | null;
export type Web_InvitePage_ParseFooter_Href = string | undefined;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_ParseHex_Value = string;
export type Web_InvitePage_ParseHex_Returns = Web_Invite_Rgb | null;
export type Web_InvitePage_ParseHex_Match = RegExpExecArray | null;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_RgbText_Color = Web_Invite_Rgb;
export type Web_InvitePage_RgbText_Returns = string;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_SafeLink_Value = string;
export type Web_InvitePage_SafeLink_Returns = string | undefined;
export type Web_InvitePage_SafeLink_Url = URL;

/**
 * Invite Page.
 *
 * @since 4.2.1
 */
export type Web_InvitePage_WhiteText = Web_Invite_Rgb;
