// Service Worker for caching CheerpJ and app assets
const CACHE_NAME = 'freej2me-cache-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/web/',
  '/web/index.html',
  '/web/run.html',
  '/web/freej2me-web.jar'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache strategy for different resources
  if (
    // CheerpJ loader and runtime files
    url.hostname === 'cjrtnc.leaningtech.com' ||
    // Local JAR files
    url.pathname.endsWith('.jar') ||
    // Local JS/HTML files
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', url.pathname);
            return cachedResponse;
          }

          console.log('[SW] Fetching and caching:', url.pathname);
          return fetch(event.request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(err => {
            console.error('[SW] Fetch failed:', url.pathname, err);
            throw err;
          });
        });
      })
    );
  } else {
    // For other requests, just use network
    event.respondWith(fetch(event.request));
  }
});
