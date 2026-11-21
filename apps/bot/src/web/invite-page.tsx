import {
  hexColorChannelsPattern,
  inviteFooterLinkPattern,
  trailingPunctuationPattern,
} from '@/web/regex.js';

import type {
  Web_InvitePage_ButtonTextColor_Accent,
  Web_InvitePage_ButtonTextColor_Returns,
  Web_InvitePage_ContrastRatio_Darker,
  Web_InvitePage_ContrastRatio_First,
  Web_InvitePage_ContrastRatio_Lighter,
  Web_InvitePage_ContrastRatio_Returns,
  Web_InvitePage_ContrastRatio_Second,
  Web_InvitePage_DarkText,
  Web_InvitePage_FallbackAccent,
  Web_InvitePage_FooterLinkPattern,
  Web_InvitePage_InvitePage_Accent,
  Web_InvitePage_InvitePage_Available,
  Web_InvitePage_InvitePage_Busy,
  Web_InvitePage_InvitePage_ButtonLabel,
  Web_InvitePage_InvitePage_CustomProperty,
  Web_InvitePage_InvitePage_Error,
  Web_InvitePage_InvitePage_Footer,
  Web_InvitePage_InvitePage_JoinState,
  Web_InvitePage_InvitePage_MemberNoun,
  Web_InvitePage_InvitePage_OnJoin,
  Web_InvitePage_InvitePage_Page,
  Web_InvitePage_InvitePage_Preview,
  Web_InvitePage_InvitePage_Props,
  Web_InvitePage_InvitePage_Recaptcha,
  Web_InvitePage_InvitePage_Returns,
  Web_InvitePage_InvitePage_Server,
  Web_InvitePage_InvitePage_Stats,
  Web_InvitePage_InvitePage_Style,
  Web_InvitePage_Luminance_Channels,
  Web_InvitePage_Luminance_Color,
  Web_InvitePage_Luminance_Returns,
  Web_InvitePage_Luminance_Value,
  Web_InvitePage_ParseFooter_Address,
  Web_InvitePage_ParseFooter_Href,
  Web_InvitePage_ParseFooter_Index,
  Web_InvitePage_ParseFooter_Label,
  Web_InvitePage_ParseFooter_Parts,
  Web_InvitePage_ParseFooter_Position,
  Web_InvitePage_ParseFooter_Punctuation,
  Web_InvitePage_ParseFooter_Returns,
  Web_InvitePage_ParseFooter_Text,
  Web_InvitePage_ParseFooter_Trailing,
  Web_InvitePage_ParseHex_Match,
  Web_InvitePage_ParseHex_Returns,
  Web_InvitePage_ParseHex_Value,
  Web_InvitePage_RgbText_Color,
  Web_InvitePage_RgbText_Returns,
  Web_InvitePage_SafeLink_Returns,
  Web_InvitePage_SafeLink_Url,
  Web_InvitePage_SafeLink_Value,
  Web_InvitePage_WhiteText,
} from '@/types/web/invite-page.d.ts';

// Footer links are either [text](https://…) or a bare https:// address.

/**
 * Invite Page - Footer Link Pattern.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const footerLinkPattern: Web_InvitePage_FooterLinkPattern = new RegExp(inviteFooterLinkPattern, 'gu');

// safeLink keeps only https addresses that parse, so a footer can't link to scripts or other schemes.

/**
 * Invite Page - Safe Link.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_SafeLink_Value} value - Value.
 *
 * @returns {Web_InvitePage_SafeLink_Returns}
 *
 * @since 4.0.0
 */
const safeLink = (value: Web_InvitePage_SafeLink_Value): Web_InvitePage_SafeLink_Returns => {
  try {
    const url: Web_InvitePage_SafeLink_Url = new URL(value);

    return (url.protocol === 'https:') ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

// parseFooter splits footer text into plain text and links, without ever reading it as HTML.

/**
 * Invite Page - Parse Footer.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_ParseFooter_Text} text - Text.
 *
 * @returns {Web_InvitePage_ParseFooter_Returns}
 *
 * @since 4.0.0
 */
export const parseFooter = (text: Web_InvitePage_ParseFooter_Text): Web_InvitePage_ParseFooter_Returns => {
  const parts: Web_InvitePage_ParseFooter_Parts = [];
  let position: Web_InvitePage_ParseFooter_Position = 0;

  for (const match of text.matchAll(footerLinkPattern)) {
    const index: Web_InvitePage_ParseFooter_Index = match.index;
    const label: Web_InvitePage_ParseFooter_Label = match[1];
    let address: Web_InvitePage_ParseFooter_Address = (
      match[2]
      ?? match[3]
      ?? ''
    );
    let trailing: Web_InvitePage_ParseFooter_Trailing = '';

    if (match[3] !== undefined) {
      // A bare link at the end of a sentence keeps its full stop as text.
      const punctuation: Web_InvitePage_ParseFooter_Punctuation = new RegExp(trailingPunctuationPattern, 'u').exec(address);

      if (punctuation !== null) {
        trailing = punctuation[0];
        address = address.slice(0, -trailing.length);
      }
    }

    const href: Web_InvitePage_ParseFooter_Href = safeLink(address);

    if (index > position) {
      parts.push({ text: text.slice(position, index) });
    }

    parts.push((href === undefined) ? { text: match[0] } : {
      href,
      text: label ?? address,
    });

    if (trailing !== '') {
      parts.push({ text: trailing });
    }

    position = index + match[0].length;
  }

  if (position < text.length) {
    parts.push({ text: text.slice(position) });
  }

  return parts;
};

// parseHex reads a #rrggbb color, or returns null for anything else.

/**
 * Invite Page - Parse Hex.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_ParseHex_Value} value - Value.
 *
 * @returns {Web_InvitePage_ParseHex_Returns}
 *
 * @since 4.0.0
 */
export const parseHex = (value: Web_InvitePage_ParseHex_Value): Web_InvitePage_ParseHex_Returns => {
  const match: Web_InvitePage_ParseHex_Match = new RegExp(hexColorChannelsPattern, 'iu').exec(value.trim());

  if (match === null) {
    return null;
  }

  return [
    Number.parseInt(match[1] ?? '0', 16),
    Number.parseInt(match[2] ?? '0', 16),
    Number.parseInt(match[3] ?? '0', 16),
  ];
};

// luminance is the WCAG relative luminance of a color.

/**
 * Invite Page - Luminance.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_Luminance_Color} color - Color.
 *
 * @returns {Web_InvitePage_Luminance_Returns}
 *
 * @since 4.0.0
 */
const luminance = (color: Web_InvitePage_Luminance_Color): Web_InvitePage_Luminance_Returns => {
  const channels: Web_InvitePage_Luminance_Channels = color.map((channel) => {
    const value: Web_InvitePage_Luminance_Value = channel / 255;

    return (value <= 0.040_45) ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return (0.2126 * (channels[0] ?? 0)) + (0.7152 * (channels[1] ?? 0)) + (0.0722 * (channels[2] ?? 0));
};

// contrastRatio is the WCAG contrast between two colors, from 1 to 21.

/**
 * Invite Page - Contrast Ratio.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_ContrastRatio_First}  first  - First.
 * @param {Web_InvitePage_ContrastRatio_Second} second - Second.
 *
 * @returns {Web_InvitePage_ContrastRatio_Returns}
 *
 * @since 4.0.0
 */
export const contrastRatio = (first: Web_InvitePage_ContrastRatio_First, second: Web_InvitePage_ContrastRatio_Second): Web_InvitePage_ContrastRatio_Returns => {
  const lighter: Web_InvitePage_ContrastRatio_Lighter = Math.max(luminance(first), luminance(second));
  const darker: Web_InvitePage_ContrastRatio_Darker = Math.min(luminance(first), luminance(second));

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Invite Page - White Text.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const whiteText: Web_InvitePage_WhiteText = [
  255,
  255,
  255,
];

/**
 * Invite Page - Dark Text.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const darkText: Web_InvitePage_DarkText = [
  17,
  19,
  22,
];

// buttonTextColor picks white or near-black text, whichever reads better on the accent.

/**
 * Invite Page - Button Text Color.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_ButtonTextColor_Accent} accent - Accent.
 *
 * @returns {Web_InvitePage_ButtonTextColor_Returns}
 *
 * @since 4.0.0
 */
export const buttonTextColor = (accent: Web_InvitePage_ButtonTextColor_Accent): Web_InvitePage_ButtonTextColor_Returns => (
  (contrastRatio(accent, whiteText) >= contrastRatio(accent, darkText)) ? whiteText : darkText
);

/**
 * Invite Page - Fallback Accent.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackAccent: Web_InvitePage_FallbackAccent = [
  98,
  80,
  217,
];

/**
 * Invite Page - Rgb Text.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InvitePage_RgbText_Color} color - Color.
 *
 * @returns {Web_InvitePage_RgbText_Returns}
 *
 * @since 4.0.0
 */
const rgbText = (color: Web_InvitePage_RgbText_Color): Web_InvitePage_RgbText_Returns => `rgb(${color[0]} ${color[1]} ${color[2]})`;

/**
 * Invite Page - Invite Page.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @param {Web_InvitePage_InvitePage_Props} props - Props.
 *
 * @returns {Web_InvitePage_InvitePage_Returns}
 *
 * @since 4.0.0
 */
export const InvitePage = (props: Web_InvitePage_InvitePage_Props): Web_InvitePage_InvitePage_Returns => {
  const available: Web_InvitePage_InvitePage_Available = props['available'];
  const error: Web_InvitePage_InvitePage_Error = props['error'];
  const joinState: Web_InvitePage_InvitePage_JoinState = props['joinState'];
  const onJoin: Web_InvitePage_InvitePage_OnJoin = props['onJoin'];
  const page: Web_InvitePage_InvitePage_Page = props['page'];
  const preview: Web_InvitePage_InvitePage_Preview = props['preview'] ?? false;
  const recaptcha: Web_InvitePage_InvitePage_Recaptcha = props['recaptcha'] ?? null;
  const server: Web_InvitePage_InvitePage_Server = props['server'];
  const accent: Web_InvitePage_InvitePage_Accent = parseHex(page['accentColor']) ?? fallbackAccent;
  const style: Web_InvitePage_InvitePage_Style = {
    ['--invite-accent' as Web_InvitePage_InvitePage_CustomProperty]: rgbText(accent),
    ['--invite-on-accent' as Web_InvitePage_InvitePage_CustomProperty]: rgbText(buttonTextColor(accent)),
  };
  const stats: Web_InvitePage_InvitePage_Stats = [];

  if (page['showMemberCount'] === true) {
    if (server['memberCount'] !== null) {
      const memberNoun: Web_InvitePage_InvitePage_MemberNoun = (server['memberCount'] === 1) ? 'member' : 'members';

      stats.push(`${server['memberCount'].toLocaleString('en-US')} ${memberNoun}`);
    } else if (preview === true) {
      stats.push('Member count');
    }
  }

  if (page['showBoostTier'] === true) {
    if (server['boostTier'] !== null && server['boostTier'] > 0) {
      stats.push(`Boost level ${server['boostTier']}`);
    } else if (preview === true) {
      stats.push('Boost level');
    }
  }

  const footer: Web_InvitePage_InvitePage_Footer = parseFooter(page['footerText']);
  const busy: Web_InvitePage_InvitePage_Busy = joinState === 'joining' || joinState === 'redirecting';
  let buttonLabel: Web_InvitePage_InvitePage_ButtonLabel = page['buttonLabel'];

  if (joinState === 'joining') {
    buttonLabel = 'Creating your invite…';
  } else if (joinState === 'redirecting') {
    buttonLabel = 'Opening Discord…';
  }

  return (
    <div className={(preview === true) ? 'invite-page invite-page-preview' : 'invite-page'} data-theme={page['theme']} style={style}>
      <main className="invite-card">
        {(page['bannerUrl'] === null) ? null : <img alt="" className="invite-banner" src={page['bannerUrl']} />}
        <div className={(page['bannerUrl'] === null) ? 'invite-body' : 'invite-body invite-body-banner'}>
          {(page['logoUrl'] === null) ? null : <img alt="" className="invite-logo" src={page['logoUrl']} />}
          <p className="invite-server">{server['name']}</p>
          <h1>{page['title']}</h1>
          {(page['description'].trim() === '') ? null : <p className="invite-description">{page['description']}</p>}
          {(stats.length === 0) ? null : (
            <ul aria-label="About this server" className="invite-stats">
              {stats.map((stat) => <li key={stat}>{stat}</li>)}
            </ul>
          )}
          {(available === true) ? recaptcha : null}
          <button
            className="invite-button"
            disabled={(
              available === false
              || busy === true
              || onJoin === undefined
            )}
            onClick={onJoin}
            type="button"
          >
            {buttonLabel}
          </button>
          {(available === true) ? null : <p className="invite-paused">Invites are paused right now. Try again later.</p>}
          {(error === '') ? null : <p className="invite-error" role="alert">{error}</p>}
        </div>
        {(footer.length === 0) ? null : (
          <footer className="invite-footer">
            {footer.map((part, index) => (
              (part['href'] === undefined) ? (
                <span key={index}>{part['text']}</span>
              ) : (
                <a href={part['href']} key={index} rel="noopener noreferrer nofollow" target="_blank">{part['text']}</a>
              )
            ))}
          </footer>
        )}
      </main>
    </div>
  );
};
