// IndexedDB persistence: "current" recording + library of saved recordings.
const DB_NAME = 'voicerec', DB_VERSION = 2;
const STORE = 'recordings', KEY = 'current';
const STORE_LIB = 'library';

function openDB() {
    return new Promise((res, rej) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE))     db.createObjectStore(STORE);
            if (!db.objectStoreNames.contains(STORE_LIB)) db.createObjectStore(STORE_LIB);
        };
        req.onsuccess = () => res(req.result);
        req.onerror   = () => rej(req.error);
    });
}

export async function saveToDB(blob, transcript) {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put({ blob, transcript, savedAt: Date.now() }, KEY);
    return new Promise(res => tx.oncomplete = () => res());
}

export async function loadFromDB() {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readonly');
    return new Promise(res => {
        const r = tx.objectStore(STORE).get(KEY);
        r.onsuccess = () => res(r.result || null);
        r.onerror   = () => res(null);
    });
}

export async function clearDB() {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(KEY);
    return new Promise(res => tx.oncomplete = () => res());
}

export async function saveToLibrary(blob, transcript, name) {
    const db = await openDB();
    const tx = db.transaction(STORE_LIB, 'readwrite');
    const id = Date.now();
    tx.objectStore(STORE_LIB).put({ id, blob, transcript, name, savedAt: id }, id);
    return new Promise(res => tx.oncomplete = () => res(id));
}

export async function listLibrary() {
    const db = await openDB();
    const tx = db.transaction(STORE_LIB, 'readonly');
    return new Promise(res => {
        const r = tx.objectStore(STORE_LIB).getAll();
        r.onsuccess = () => res(r.result || []);
        r.onerror   = () => res([]);
    });
}

export async function deleteFromLibrary(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_LIB, 'readwrite');
    tx.objectStore(STORE_LIB).delete(id);
    return new Promise(res => tx.oncomplete = () => res());
}
