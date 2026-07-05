/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

clientsClaim();

// Auto-inject all build assets (JS, CSS, images, etc.)
precacheAndRoute(self.__WB_MANIFEST);

// ✅ Allow offline deep-links (App Shell pattern)

// ✅ Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 1 week
    ],
  })
);

// ✅ Cache Google Fonts CSS
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// ✅ Cache Google Fonts (WOFF2 files)
registerRoute(
  ({ url }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 year
        maxEntries: 30, // Don't cache more than 30 fonts
      }),
    ],
  })
);

// ✅ Offline Analytics (Background Sync for Vercel Analytics)
registerRoute(
  ({ url }) => url.pathname === '/_analytics',
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin('analytics-queue', {
        maxRetentionTime: 24 * 60, // Retry for up to 24 hours (in minutes)
      }),
    ],
  }),
  'POST'
);
