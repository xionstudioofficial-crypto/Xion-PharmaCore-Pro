
const DB_NAME = 'PharmacyDB';
const DB_VERSION = 2;
const STORE_NAME = 'inventory';
const SYNC_STORE = 'pending_sync';

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const savePendingSync = async (data: any) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_STORE);
    store.add(data);
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getPendingSyncs = async (): Promise<any[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE, 'readonly');
    const store = transaction.objectStore(SYNC_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const clearPendingSync = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(SYNC_STORE, 'readwrite');
    const store = transaction.objectStore(SYNC_STORE);
    store.clear();
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
};
