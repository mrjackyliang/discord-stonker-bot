import type {
  CSSProperties,
  ReactElement,
} from 'react';

import type { Web_Components_InvitePage_Props } from '@/types/web/components.d.ts';
import type {
  Web_Invite_FooterPart,
  Web_Invite_Rgb,
} from '@/types/web/invite.d.ts';

// Footer links are either [text](https://…) or a bare https:// address.

/**
 * Invite Page - Footer link pattern.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const footerLinkPattern: RegExp = /\[([^\]\n]{1,200})\]\((https:\/\/[^\s)]{1,2000})\)|(https:\/\/[^\s<>()[\]]{1,2000})/gu;

// safeLink keeps only https addresses that parse, so a footer can't link to scripts or other schemes.

/**
 * Invite Page - Safe link.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const safeLink = (value: string): string | undefined => {
  try {
    const url: URL = new URL(value);

    return (url.protocol === 'https:') ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

// parseFooter splits footer text into plain text and links, without ever reading it as HTML.

/**
 * Invite Page - Parses footer.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const parseFooter = (text: string): Web_Invite_FooterPart[] => {
  const parts: Web_Invite_FooterPart[] = [];
  let position: number = 0;

  for (const match of text.matchAll(footerLinkPattern)) {
    const index: number = match.index;
    const label: string | undefined = match[1];
    let address: string = match[2] ?? match[3] ?? '';
    let trailing: string = '';

    if (match[3] !== undefined) {
      // A bare link at the end of a sentence keeps its full stop as text.
      const punctuation: RegExpExecArray | null = /[.,;:!?]+$/u.exec(address);

      if (punctuation !== null) {
        trailing = punctuation[0];
        address = address.slice(0, -trailing.length);
      }
    }

    const href: string | undefined = safeLink(address);

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
 * Invite Page - Parses hex.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const parseHex = (value: string): Web_Invite_Rgb | null => {
  const match: RegExpExecArray | null = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/iu.exec(value.trim());

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
 * @since 4.0.0
 */
const luminance = (color: Web_Invite_Rgb): number => {
  const channels: number[] = color.map((channel: number): number => {
    const value: number = channel / 255;

    return (value <= 0.040_45) ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return (0.2126 * (channels[0] ?? 0)) + (0.7152 * (channels[1] ?? 0)) + (0.0722 * (channels[2] ?? 0));
};

// contrastRatio is the WCAG contrast between two colors, from 1 to 21.

/**
 * Invite Page - Contrast ratio.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const contrastRatio = (first: Web_Invite_Rgb, second: Web_Invite_Rgb): number => {
  const lighter: number = Math.max(luminance(first), luminance(second));
  const darker: number = Math.min(luminance(first), luminance(second));

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Invite Page - White text.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const whiteText: Web_Invite_Rgb = [
  255,
  255,
  255,
];

/**
 * Invite Page - Dark text.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const darkText: Web_Invite_Rgb = [
  17,
  19,
  22,
];

// buttonTextColor picks white or near-black text, whichever reads better on the accent.

/**
 * Invite Page - Button text color.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
export const buttonTextColor = (accent: Web_Invite_Rgb): Web_Invite_Rgb => (
  (contrastRatio(accent, whiteText) >= contrastRatio(accent, darkText)) ? whiteText : darkText
);

/**
 * Invite Page - Fallback accent.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const fallbackAccent: Web_Invite_Rgb = [
  98,
  80,
  217,
];

/**
 * Invite Page - Rgb text.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const rgbText = (color: Web_Invite_Rgb): string => `rgb(${color[0]} ${color[1]} ${color[2]})`;

/**
 * Invite Page.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
export const InvitePage = ({
  available,
  error,
  joinState,
  onJoin,
  page,
  preview = false,
  recaptcha = null,
  server,
}: Web_Components_InvitePage_Props): ReactElement => {
  const accent: Web_Invite_Rgb = parseHex(page['accentColor']) ?? fallbackAccent;
  const style: CSSProperties = {
    ['--invite-accent' as string]: rgbText(accent),
    ['--invite-on-accent' as string]: rgbText(buttonTextColor(accent)),
  };
  const stats: string[] = [];

  if (page['showMemberCount']) {
    if (server['memberCount'] !== null) {
      stats.push(`${server['memberCount'].toLocaleString('en-US')} ${(server['memberCount'] === 1) ? 'member' : 'members'}`);
    } else if (preview) {
      stats.push('Member count');
    }
  }

  if (page['showBoostTier']) {
    if (server['boostTier'] !== null && server['boostTier'] > 0) {
      stats.push(`Boost level ${server['boostTier']}`);
    } else if (preview) {
      stats.push('Boost level');
    }
  }

  const footer: Web_Invite_FooterPart[] = parseFooter(page['footerText']);
  const busy: boolean = joinState === 'joining' || joinState === 'redirecting';
  let buttonLabel: string = page['buttonLabel'];

  if (joinState === 'joining') {
    buttonLabel = 'Creating your invite…';
  } else if (joinState === 'redirecting') {
    buttonLabel = 'Opening Discord…';
  }

  return (
    <div className={(preview) ? 'invite-page invite-page-preview' : 'invite-page'} data-theme={page['theme']} style={style}>
      <main className="invite-card">
        {(page['bannerUrl'] === null) ? null : <img alt="" className="invite-banner" src={page['bannerUrl']} />}
        <div className={(page['bannerUrl'] === null) ? 'invite-body' : 'invite-body invite-body-banner'}>
          {(page['logoUrl'] === null) ? null : <img alt="" className="invite-logo" src={page['logoUrl']} />}
          <p className="invite-server">{server['name']}</p>
          <h1>{page['title']}</h1>
          {(page['description'].trim() === '') ? null : <p className="invite-description">{page['description']}</p>}
          {(stats.length === 0) ? null : (
            <ul aria-label="About this server" className="invite-stats">
              {stats.map((stat: string): ReactElement => <li key={stat}>{stat}</li>)}
            </ul>
          )}
          {(available) ? recaptcha : null}
          <button
            className="invite-button"
            disabled={!available || busy || onJoin === undefined}
            onClick={onJoin}
            type="button"
          >
            {buttonLabel}
          </button>
          {(available) ? null : <p className="invite-paused">Invites are paused right now. Try again later.</p>}
          {(error === '') ? null : <p className="invite-error" role="alert">{error}</p>}
        </div>
        {(footer.length === 0) ? null : (
          <footer className="invite-footer">
            {footer.map((part: Web_Invite_FooterPart, index: number): ReactElement => (
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
