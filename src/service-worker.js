/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

clientsClaim();

// Auto-inject all build assets (JS, CSS, fonts, icons, etc.)
precacheAndRoute(self.__WB_MANIFEST);

// ✅ Allow offline deep-links (App Shell pattern)
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_/, /^\/api/],
});
registerRoute(navigationRoute);

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

// ✅ Offline Analytics (Background Sync for Vercel Analytics)
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/_vercel/insights') ||
    url.pathname.startsWith('/_vercel/speed-insights') ||
    url.pathname === '/_analytics',
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin('analytics-queue', {
        maxRetentionTime: 24 * 60, // Retry for up to 24 hours (in minutes)
      }),
    ],
  }),
  'POST'
);

// ✅ Global fallback catch handler
// Prevents "Uncaught (in promise) no-response" when offline / dead Wi-Fi
setCatchHandler(async ({ request }) => {
  if (request.destination === 'image') {
    // Return a 1x1 transparent SVG so image errors fail cleanly without crashing the Service Worker
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  return Response.error();
});

