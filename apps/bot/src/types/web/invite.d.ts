import type { Web_Api_InviteTheme } from '@/types/web/api.d.ts';

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_PageData = {
  accentColor: string;
  bannerUrl: string | null;
  buttonLabel: string;
  description: string;
  footerText: string;
  logoUrl: string | null;
  showBoostTier: boolean;
  showMemberCount: boolean;
  theme: Web_Api_InviteTheme;
  title: string;
};

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_ServerData = {
  boostTier: number | null;
  iconUrl: string | null;
  memberCount: number | null;
  name: string;
};

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_Data = {
  available: boolean;
  page: Web_Invite_PageData;
  recaptchaSiteKey: string | null;
  server: Web_Invite_ServerData;
  submitPath: string;
};

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_JoinState = 'error' | 'idle' | 'joining' | 'redirecting';

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_FooterPart = {
  href?: string | undefined;
  text: string;
};

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_Recaptcha = {
  getResponse: (widgetId?: number) => string;
  ready: (callback: () => void) => void;
  render: (container: HTMLElement, parameters: Record<string, unknown>) => number;
  reset: (widgetId?: number) => void;
};

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_Rgb = [number, number, number];

/**
 * Invite.
 *
 * @since 4.0.0
 */
export type Web_Invite_AppProps = {
  data: Web_Invite_Data;
};
