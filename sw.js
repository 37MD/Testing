// QuickCommerce Service Worker
// Scope: /QuickCommerce/
 
const CACHE_NAME = 'qc-finder-v2';
 
const URLS_TO_CACHE = [
  '/QuickCommerce/',
  '/QuickCommerce/index.html',
  '/QuickCommerce/manifest.json',
  '/QuickCommerce/icon-192.png',
  '/QuickCommerce/icon-512.png'
];
 
// INSTALL: pre-cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});
 
// ACTIVATE: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});
 
// FETCH: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});