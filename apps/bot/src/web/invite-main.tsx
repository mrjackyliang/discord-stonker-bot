import {
  StrictMode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';

import { isChatPlatformInviteUrl } from '@/web/chat-platform-invites.ts';
import {
  errorText,
  inviteUrlOf,
  parseInviteData,
} from '@/web/invite-data.ts';
import { InvitePage } from '@/web/invite-page.tsx';
import '@/web/styles/invite-entry.css';

import type {
  Web_InviteMain_InviteApp_Container,
  Web_InviteMain_InviteApp_ContainerValue,
  Web_InviteMain_InviteApp_Data,
  Web_InviteMain_InviteApp_Error,
  Web_InviteMain_InviteApp_ErrorState,
  Web_InviteMain_InviteApp_Join,
  Web_InviteMain_InviteApp_Join_Body,
  Web_InviteMain_InviteApp_Join_InviteUrl,
  Web_InviteMain_InviteApp_Join_Recaptcha,
  Web_InviteMain_InviteApp_Join_Response,
  Web_InviteMain_InviteApp_Join_Returns,
  Web_InviteMain_InviteApp_Join_Token,
  Web_InviteMain_InviteApp_JoinState,
  Web_InviteMain_InviteApp_JoinStateState,
  Web_InviteMain_InviteApp_Props,
  Web_InviteMain_InviteApp_Render,
  Web_InviteMain_InviteApp_Render_Recaptcha,
  Web_InviteMain_InviteApp_Render_Returns,
  Web_InviteMain_InviteApp_ResetRecaptcha,
  Web_InviteMain_InviteApp_ResetRecaptcha_Recaptcha,
  Web_InviteMain_InviteApp_ResetRecaptcha_Returns,
  Web_InviteMain_InviteApp_Returns,
  Web_InviteMain_InviteApp_Script,
  Web_InviteMain_InviteApp_SetError,
  Web_InviteMain_InviteApp_SetJoinState,
  Web_InviteMain_InviteApp_SiteKey,
  Web_InviteMain_InviteApp_WidgetId,
  Web_InviteMain_InviteApp_WidgetIdValue,
  Web_InviteMain_InviteData,
  Web_InviteMain_PrefersDark_Returns,
  Web_InviteMain_PrefersDark_Theme,
  Web_InviteMain_ReadInviteData_Element,
  Web_InviteMain_ReadInviteData_Returns,
  Web_InviteMain_ReadRecaptcha_Recaptcha,
  Web_InviteMain_ReadRecaptcha_Returns,
  Web_InviteMain_ReadRecaptcha_Value,
  Web_InviteMain_RecaptchaCallbackName,
  Web_InviteMain_RootElement,
} from '@/types/web/invite-main.d.ts';

// The name reCAPTCHA calls once its script has loaded.

/**
 * Invite Main - Recaptcha Callback Name.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const recaptchaCallbackName: Web_InviteMain_RecaptchaCallbackName = 'stonkerInviteRecaptchaLoaded';

// readInviteData reads the page data the server embedded next to the page.

/**
 * Invite Main - Read Invite Data.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_InviteMain_ReadInviteData_Returns}
 *
 * @since 4.0.0
 */
const readInviteData = (): Web_InviteMain_ReadInviteData_Returns => {
  const element: Web_InviteMain_ReadInviteData_Element = document.querySelector('#invite-data');

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
 * Invite Main - Read Recaptcha.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @returns {Web_InviteMain_ReadRecaptcha_Returns}
 *
 * @since 4.0.0
 */
const readRecaptcha = (): Web_InviteMain_ReadRecaptcha_Returns => {
  const value: Web_InviteMain_ReadRecaptcha_Value = Reflect.get(window, 'grecaptcha');

  return (
    typeof value === 'object'
    && value !== null
    && typeof Reflect.get(value, 'render') === 'function'
  ) ? value as Web_InviteMain_ReadRecaptcha_Recaptcha : undefined;
};

// prefersDark says whether the page shows its dark theme.

/**
 * Invite Main - Prefers Dark.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteMain_PrefersDark_Theme} theme - Theme.
 *
 * @returns {Web_InviteMain_PrefersDark_Returns}
 *
 * @since 4.0.0
 */
const prefersDark = (theme: Web_InviteMain_PrefersDark_Theme): Web_InviteMain_PrefersDark_Returns => (
  theme === 'dark'
  || (
    theme === 'system'
    && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
);

/**
 * Invite Main - Invite App.
 *
 * Centralizes this operation for the surrounding workflow.
 * Callers reuse one implementation instead of repeating the behavior.
 *
 * @param {Web_InviteMain_InviteApp_Props} props - Props.
 *
 * @returns {Web_InviteMain_InviteApp_Returns}
 *
 * @since 4.0.0
 */
const InviteApp = (props: Web_InviteMain_InviteApp_Props): Web_InviteMain_InviteApp_Returns => {
  const data: Web_InviteMain_InviteApp_Data = props['data'];
  const joinStateState: Web_InviteMain_InviteApp_JoinStateState = useState<Web_InviteMain_InviteApp_JoinState>('idle');
  const joinState: Web_InviteMain_InviteApp_JoinState = joinStateState[0];
  const setJoinState: Web_InviteMain_InviteApp_SetJoinState = joinStateState[1];
  const errorState: Web_InviteMain_InviteApp_ErrorState = useState<Web_InviteMain_InviteApp_Error>('');
  const error: Web_InviteMain_InviteApp_Error = errorState[0];
  const setError: Web_InviteMain_InviteApp_SetError = errorState[1];
  const container: Web_InviteMain_InviteApp_Container = useRef<Web_InviteMain_InviteApp_ContainerValue>(null);
  const widgetId: Web_InviteMain_InviteApp_WidgetId = useRef<Web_InviteMain_InviteApp_WidgetIdValue>(null);
  const siteKey: Web_InviteMain_InviteApp_SiteKey = data['recaptchaSiteKey'];

  useEffect(() => {
    document.title = data['page']['title'];

    if (data['available'] === false || siteKey === null) {
      return;
    }

    /**
     * Invite Main - Render.
     *
     * Centralizes this operation for the surrounding workflow.
     * Callers reuse one implementation instead of repeating the behavior.
     *
     * @returns {Web_InviteMain_InviteApp_Render_Returns}
     *
     * @since 4.0.0
     */
    const render: Web_InviteMain_InviteApp_Render = (): Web_InviteMain_InviteApp_Render_Returns => {
      const recaptcha: Web_InviteMain_InviteApp_Render_Recaptcha = readRecaptcha();

      if (
        recaptcha === undefined
        || container.current === null
        || widgetId.current !== null
      ) {
        return;
      }

      widgetId.current = recaptcha.render(container.current, {
        'callback': () => setError(''),
        'expired-callback': () => setError('The reCAPTCHA check expired. Check the box again.'),
        'sitekey': siteKey,

        // Google's box is 304 pixels wide, so the narrowest phones get its compact form.
        'size': (container.current.clientWidth < 304) ? 'compact' : 'normal',
        'theme': (prefersDark(data['page']['theme']) === true) ? 'dark' : 'light',
      });

      return;
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

    const script: Web_InviteMain_InviteApp_Script = document.createElement('script');

    Reflect.set(script.dataset, 'inviteRecaptcha', 'true');

    script.async = true;
    script.defer = true;
    script.src = `https://www.google.com/recaptcha/api.js?onload=${recaptchaCallbackName}&render=explicit`;
    script.addEventListener('error', () => setError('The reCAPTCHA check couldn\'t load. Check your connection and reload the page.'));

    document.head.append(script);

    return;
  }, []);

  /**
   * Invite Main - Reset Recaptcha.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_InviteMain_InviteApp_ResetRecaptcha_Returns}
   *
   * @since 4.0.0
   */
  const resetRecaptcha: Web_InviteMain_InviteApp_ResetRecaptcha = (): Web_InviteMain_InviteApp_ResetRecaptcha_Returns => {
    const recaptcha: Web_InviteMain_InviteApp_ResetRecaptcha_Recaptcha = readRecaptcha();

    if (recaptcha !== undefined && widgetId.current !== null) {
      recaptcha.reset(widgetId.current);
    }

    return;
  };

  /**
   * Invite Main - Join.
   *
   * Centralizes this operation for the surrounding workflow.
   * Callers reuse one implementation instead of repeating the behavior.
   *
   * @returns {Web_InviteMain_InviteApp_Join_Returns}
   *
   * @since 4.0.0
   */
  const join: Web_InviteMain_InviteApp_Join = async (): Web_InviteMain_InviteApp_Join_Returns => {
    let token: Web_InviteMain_InviteApp_Join_Token = '';

    setError('');

    if (siteKey !== null) {
      const recaptcha: Web_InviteMain_InviteApp_Join_Recaptcha = readRecaptcha();

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
      const response: Web_InviteMain_InviteApp_Join_Response = await fetch(data['submitPath'], {
        body: JSON.stringify({ recaptchaToken: token }),
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const body: Web_InviteMain_InviteApp_Join_Body = await response.json().catch(() => undefined);

      if (response.ok === false) {
        setJoinState('error');
        setError(errorText(body) ?? 'The invite couldn\'t be created. Try again.');
        resetRecaptcha();

        return;
      }

      const inviteUrl: Web_InviteMain_InviteApp_Join_InviteUrl = inviteUrlOf(body);

      if (inviteUrl === null || isChatPlatformInviteUrl(inviteUrl) === false) {
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

    return;
  };

  return (
    <InvitePage
      available={data['available']}
      error={error}
      joinState={joinState}
      onJoin={() => {
        void join();

        return;
      }}
      page={data['page']}
      recaptcha={(siteKey === null) ? null : <div className="invite-recaptcha" ref={container} />}
      server={data['server']}
    />
  );
};

/**
 * Invite Main - Root Element.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rootElement: Web_InviteMain_RootElement = document.querySelector('#root');

/**
 * Invite Main - Invite Data.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const inviteData: Web_InviteMain_InviteData = readInviteData();

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
