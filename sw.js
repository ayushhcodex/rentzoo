// ================================================
// Rentzoo Service Worker — PWA Offline Support
// ================================================

const CACHE_NAME = 'rentzoo-v1';
const OFFLINE_URL = '/';

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/about',
  '/catalog',
  '/contact',
  '/styles.css',
  '/script.js',
  '/assets/images/logo.png',
  '/assets/images/favicon.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/manifest.json'
];

// Install — precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch — Network-first for HTML, Cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (WhatsApp, analytics, etc.)
  if (!request.url.startsWith(self.location.origin)) return;

  // HTML pages — network first, fallback to cache
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Static assets — cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Cache images, CSS, JS for future use
        if (
          response.ok &&
          (request.url.match(/\.(css|js|png|jpg|jpeg|webp|svg|woff2?)$/i) ||
            request.url.includes('/assets/'))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
