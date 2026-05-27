
const CACHE_NAME = 'pharmacy-erp-v2';
const urlsToCache = [
  './',
  'index.html'
];

// Install Event - cache initial pages and skip waiting to activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate Event - clear out old caches to avoid serving stale index.html or assets
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('ServiceWorker clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - network-first for navigation/HTML, cache-first for hashed static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Choose network-first strategy for navigation requests, index.html, root, and API endpoints
  if (
    event.request.mode === 'navigate' ||
    url.pathname.endsWith('index.html') ||
    url.pathname === '/' ||
    url.pathname === '' ||
    url.pathname.includes('/api/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If response is valid, clone and save to cache for offline backup
          if (response && response.status === 200) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseCopy);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first strategy for static assets (Vite's content hashes make them immutable)
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseCopy);
              });
            }
            return networkResponse;
          });
        })
    );
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-inventory') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  const dbRequest = indexedDB.open('PharmacyDB', 2);
  const db = await new Promise((resolve, reject) => {
    dbRequest.onsuccess = () => resolve(dbRequest.result);
    dbRequest.onerror = () => reject(dbRequest.error);
  });

  const transaction = db.transaction('pending_sync', 'readonly');
  const store = transaction.objectStore('pending_sync');
  const items = await new Promise((resolve) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });

  for (const item of items) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      break; // All processed in one request
    } catch (e) {
      console.error('Failed to sync', e);
      throw e; // Retry later
    }
  }

  // Clear on success
  const clearTransaction = db.transaction('pending_sync', 'readwrite');
  const clearStore = clearTransaction.objectStore('pending_sync');
  clearStore.clear();
}
