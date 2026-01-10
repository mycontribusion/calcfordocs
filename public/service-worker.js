/* CalcforDocs Service Worker
   Offline-first PWA with navigation fallback
*/

const CACHE_NAME = "calcfordocs-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico"
];

// Install: cache core app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: offline-first with navigation fallback
self.addEventListener("fetch", (event) => {
  // Handle app reloads / reopening
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html")
    );
    return;
  }

  // Handle all other requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
