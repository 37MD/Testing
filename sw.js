// ==========================================
// QuickCommerce - Service Worker (sw.js)
// Place this file in the ROOT of your repo
// ==========================================

var GHPATH = '/QuickCommerce';
var APP_PREFIX = 'qcfinder_';
var VERSION = 'version_01';
var CACHE_NAME = APP_PREFIX + VERSION;

// Files to cache for offline use
var URLS = [
    GHPATH + '/',
    GHPATH + '/index.html',
    GHPATH + '/manifest.json',
    GHPATH + '/icon-192.png',
    GHPATH + '/icon-512.png'
];

// FETCH: serve from cache if available, else fetch from network
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(cachedResponse) {
            return cachedResponse || fetch(e.request);
        })
    );
});

// INSTALL: cache all listed files
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(URLS);
        })
    );
    self.skipWaiting();
});

// ACTIVATE: delete old caches from previous versions
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(
                keyList.map(function(key) {
                    if (key.indexOf(APP_PREFIX) === 0 && key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});