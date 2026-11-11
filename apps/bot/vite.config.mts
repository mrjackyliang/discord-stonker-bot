import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { mockApi } from './mock-api.mjs';

/**
 * Vite Configuration.
 *
 * Builds the control panel and the public invite page into build/console, served by the web
 * process. Development proxies API calls to the running web process or answers them from the
 * mock API. The bot's .env files aren't loaded, so their NODE_ENV can't change a build.
 *
 * @since 0.0.0
 */
export default defineConfig(({ mode }) => ({
  appType: 'spa',
  base: '/',
  build: {
    emptyOutDir: true,
    outDir: 'build/console',
    rollupOptions: {
      input: {
        console: new URL('./index.html', import.meta.url).pathname,
        invite: new URL('./invite.html', import.meta.url).pathname,
      },
    },
  },
  envDir: false,
  plugins: (mode === 'mock') ? [
    react(),
    mockApi(),
  ] : [react()],
  publicDir: 'src/web/public',
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 5175,
    proxy: (mode === 'mock') ? {} : {
      '/api': 'http://127.0.0.1:22604',
      '/media': 'http://127.0.0.1:22604',
    },
  },
}));
