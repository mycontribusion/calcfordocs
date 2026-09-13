import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      injectRegister: null,
      manifest: false,
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
        // Only precache core assets needed for the app to function offline
        // Secondary assets (calculator-icon.png, robots.txt, sitemap.xml) will be runtime-cached
        globPatterns: [
          'index.html',
          'manifest.json',
          'favicon.ico',
          'logo.png',
          'assets/*.js',
          'assets/*.css',
        ],
      },
    }),
  ],
  build: {
    outDir: 'build',
  },
});
