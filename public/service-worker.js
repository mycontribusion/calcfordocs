const CACHE_NAME = "calcfordocs-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico"
  // you can also cache static assets like icons, CSS, etc.
];

// Install event - cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve cached files when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
