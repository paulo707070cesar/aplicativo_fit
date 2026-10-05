import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    build: { emptyOutDir: true },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script',
        manifest: {
          id: '/',
          name: 'FitPulse - Gestão de Alunos, Treinos e Cobranças',
          short_name: 'FitPulse',
          description: 'Gestão de alunos, treinos, cobranças e acompanhamento fitness.',
          lang: 'pt-BR',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          theme_color: '#141b2b',
          background_color: '#f9f9ff',
          categories: ['health', 'fitness', 'business'],
          icons: [
            {src: '/pwa-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
            {src: '/pwa-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable'},
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallbackDenylist: [/^\/api\//],
          maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});