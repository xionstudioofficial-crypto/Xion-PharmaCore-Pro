export const saveToIDB = async (key: string, value: any) => {
    const db = await openDB();
    const tx = db.transaction('store', 'readwrite');
    tx.objectStore('store').put(value, key);
};

export const getFromIDB = async (key: string) => {
    const db = await openDB();
    const tx = db.transaction('store', 'readonly');
    return new Promise((resolve) => {
        const request = tx.objectStore('store').get(key);
        request.onsuccess = () => resolve(request.result);
    });
};

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('pharma-db', 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore('store');
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};
