import {
  StrictMode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';

import {
  errorText,
  inviteUrlOf,
  parseInviteData,
} from '@/web/invite-data.ts';
import { InvitePage } from '@/web/invite-page.tsx';
import '@/web/styles/invite-entry.css';

import type { ReactElement } from 'react';

import type {
  Web_Invite_AppProps,
  Web_Invite_Data,
  Web_Invite_JoinState,
  Web_Invite_Recaptcha,
} from '@/types/web/invite.d.ts';

// The name reCAPTCHA calls once its script has loaded.

/**
 * Invite Main - Recaptcha callback name.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const recaptchaCallbackName: string = 'stonkerInviteRecaptchaLoaded';

// readInviteData reads the page data the server embedded next to the page.

/**
 * Invite Main - Reads invite data.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readInviteData = (): Web_Invite_Data | null => {
  const element: HTMLElement | null = document.querySelector('#invite-data');

  if (element === null) {
    return null;
  }

  try {
    return parseInviteData(JSON.parse(element.textContent ?? ''));
  } catch {
    return null;
  }
};

// readRecaptcha returns the reCAPTCHA API once Google's script defines it.

/**
 * Invite Main - Reads recaptcha.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const readRecaptcha = (): Web_Invite_Recaptcha | undefined => {
  const value: unknown = Reflect.get(window, 'grecaptcha');

  return (typeof value === 'object' && value !== null && typeof Reflect.get(value, 'render') === 'function') ? value as Web_Invite_Recaptcha : undefined;
};

// isDiscordInvite accepts only Discord's own invite links before the page navigates.

/**
 * Invite Main - Checks whether discord invite.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const isDiscordInvite = (value: string): boolean => {
  try {
    const url: URL = new URL(value);

    return url.protocol === 'https:' && (url.hostname === 'discord.gg' || url.hostname === 'discord.com');
  } catch {
    return false;
  }
};

// prefersDark says whether the page shows its dark theme.

/**
 * Invite Main - Prefers dark.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const prefersDark = (theme: Web_Invite_Data['page']['theme']): boolean => (
  theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
);

/**
 * Invite Main - Invite app.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @since 4.0.0
 */
const InviteApp = ({ data }: Web_Invite_AppProps): ReactElement => {
  const [
    joinState,
    setJoinState,
  ] = useState<Web_Invite_JoinState>('idle');
  const [
    error,
    setError,
  ] = useState<string>('');
  const container = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<number | null>(null);
  const siteKey: string | null = data['recaptchaSiteKey'];

  useEffect((): void => {
    document.title = data['page']['title'];

    if (!data['available'] || siteKey === null) {
      return;
    }

    /**
     * Invite Main - Render.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @since 4.0.0
     */
    const render = (): void => {
      const recaptcha: Web_Invite_Recaptcha | undefined = readRecaptcha();

      if (recaptcha === undefined || container.current === null || widgetId.current !== null) {
        return;
      }

      widgetId.current = recaptcha.render(container.current, {
        'callback': (): void => setError(''),
        'expired-callback': (): void => setError('The reCAPTCHA check expired. Check the box again.'),
        'sitekey': siteKey,
        // Google's box is 304 pixels wide, so the narrowest phones get its compact form.
        'size': (container.current.clientWidth < 304) ? 'compact' : 'normal',
        'theme': (prefersDark(data['page']['theme'])) ? 'dark' : 'light',
      });
    };

    if (readRecaptcha() !== undefined) {
      render();

      return;
    }

    Reflect.set(window, recaptchaCallbackName, render);

    // React's development double mount must not load Google's script twice.
    if (document.querySelector('script[data-invite-recaptcha]') !== null) {
      return;
    }

    const script: HTMLScriptElement = document.createElement('script');

    script.dataset['inviteRecaptcha'] = 'true';
    script.async = true;
    script.defer = true;
    script.src = `https://www.google.com/recaptcha/api.js?onload=${recaptchaCallbackName}&render=explicit`;
    script.addEventListener('error', (): void => setError('The reCAPTCHA check couldn\'t load. Check your connection and reload the page.'));
    document.head.append(script);
  }, []);

  /**
   * Invite Main - Reset recaptcha.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const resetRecaptcha = (): void => {
    const recaptcha: Web_Invite_Recaptcha | undefined = readRecaptcha();

    if (recaptcha !== undefined && widgetId.current !== null) {
      recaptcha.reset(widgetId.current);
    }
  };

  /**
   * Invite Main - Join.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @since 4.0.0
   */
  const join = async (): Promise<void> => {
    let token: string = '';

    setError('');

    if (siteKey !== null) {
      const recaptcha: Web_Invite_Recaptcha | undefined = readRecaptcha();

      if (recaptcha === undefined || widgetId.current === null) {
        setError('The reCAPTCHA check is still loading. Try again in a moment.');

        return;
      }

      token = recaptcha.getResponse(widgetId.current);

      if (token === '') {
        setError('Complete the reCAPTCHA check.');

        return;
      }
    }

    setJoinState('joining');

    try {
      const response: Response = await fetch(data['submitPath'], {
        body: JSON.stringify({ recaptchaToken: token }),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const body: unknown = await response.json().catch((): undefined => undefined);

      if (!response.ok) {
        setJoinState('error');
        setError(errorText(body) ?? 'The invite couldn\'t be created. Try again.');
        resetRecaptcha();

        return;
      }

      const inviteUrl: string | null = inviteUrlOf(body);

      if (inviteUrl === null || !isDiscordInvite(inviteUrl)) {
        setJoinState('error');
        setError('Discord didn\'t send an invite. Try again.');
        resetRecaptcha();

        return;
      }

      setJoinState('redirecting');
      window.location.assign(inviteUrl);
    } catch {
      setJoinState('error');
      setError('The invite couldn\'t be created. Check your connection and try again.');
      resetRecaptcha();
    }
  };

  return (
    <InvitePage
      available={data['available']}
      error={error}
      joinState={joinState}
      onJoin={(): void => {
        void join();
      }}
      page={data['page']}
      recaptcha={(siteKey === null) ? null : <div className="invite-recaptcha" ref={container} />}
      server={data['server']}
    />
  );
};

/**
 * Invite Main - Root element.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rootElement: HTMLElement | null = document.querySelector('#root');

/**
 * Invite Main - Invite data.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const inviteData: Web_Invite_Data | null = readInviteData();

if (rootElement !== null) {
  createRoot(rootElement).render(
    <StrictMode>
      {(inviteData === null) ? (
        <main className="invite-missing">
          <h1>This invite page isn&apos;t available</h1>
          <p>Reload the page, or ask the server&apos;s moderators for a new link.</p>
        </main>
      ) : <InviteApp data={inviteData} />}
    </StrictMode>,
  );
}
