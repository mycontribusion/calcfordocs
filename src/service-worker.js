/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

self.skipWaiting();
clientsClaim();

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ✅ Precache only core assets (index.html, main JS/CSS, manifest, essential icons)
// Secondary assets (calculator-icon.png, robots.txt, sitemap.xml) are runtime-cached below
precacheAndRoute(self.__WB_MANIFEST);

// ✅ Allow offline deep-links (App Shell pattern)
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler, {
  denylist: [/^\/_/, /^\/api/],
});
registerRoute(navigationRoute);

// ✅ Cache images (both local and cross-origin app icons with status 0)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Allows cross-origin opaque images to actually be saved to cache
      }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30 days
    ],
  })
);

// ✅ Runtime cache for secondary assets (not precached)
// These are cached on first request, then served from cache
registerRoute(
  ({ url }) =>
    url.pathname === '/calculator-icon.png' ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/sitemap.xml',
  new StaleWhileRevalidate({
    cacheName: 'secondary-assets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 }), // 7 days
    ],
  })
);

// ✅ Offline Analytics (fail silently with 204 when offline to prevent network error spam)
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/_vercel/insights') ||
    url.pathname.startsWith('/_vercel/speed-insights') ||
    url.pathname === '/_analytics',
  async ({ request }) => {
    try {
      return await fetch(request.clone());
    } catch {
      return new Response(null, { status: 204, statusText: 'No Content' });
    }
  },
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

