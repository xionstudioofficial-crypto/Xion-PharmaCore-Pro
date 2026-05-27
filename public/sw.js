
const CACHE_NAME = 'pharmacy-erp-v1';
const urlsToCache = [
  './',
  'index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
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
