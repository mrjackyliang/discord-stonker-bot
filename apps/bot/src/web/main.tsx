import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/web/app.tsx';
import '@/web/styles/index.css';
import {
  applyThemePreference,
  readThemePreference,
} from '@/web/theme.ts';

applyThemePreference(readThemePreference());

/**
 * Main - Root element.
 *
 * Stores this module-level value in one named location.
 * Related code reuses it instead of duplicating the definition.
 *
 * @since 4.0.0
 */
const rootElement: HTMLElement | null = document.querySelector('#root');
if (rootElement === null) {
  throw new Error('The application root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
