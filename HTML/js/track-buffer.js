// Crash-proof live track buffer for the Doc Alvers Tracker.
//
// While recording, the app hands its full in-progress state (points + photos) here on every
// new fix; we persist it to IndexedDB (handles the base64 photos, unlike localStorage's ~5 MB).
// If the app is closed, killed or crashes, the track survives — on next start the app calls
// load() and offers to restore it. After a successful cloud save the app calls clear().
//
// It also covers the offline case: a SPEICHERN that fails (no net) leaves the buffer in place,
// so the track comes back on the next start and can be re-saved.
//
// Writes are throttled (>= MIN_MS apart, with a trailing flush) so frequent fixes don't hammer
// the disk. Everything is best-effort and guarded — a storage error never throws into the app.
//
// Exposes window.TrackBuffer: save(state) [throttled], saveNow(state) [immediate], load() -> state|null, clear().

(function (global) {
    'use strict';

    const DB_NAME = 'tracker';
    const STORE = 'active';
    const OUTBOX = 'outbox'; // durable multi-slot queue of FINISHED tracks awaiting a confirmed cloud save
    const KEY = 'current';
    const MIN_MS = 5000; // shortest gap between throttled writes

    function dbg(m) {
        try { if (global.DebugWindow && DebugWindow.log) DebugWindow.log('TrackBuffer: ' + m); } catch (_) {}
    }

    const hasIDB = (function () { try { return !!global.indexedDB; } catch (_) { return false; } })();

    let dbPromise = null;
    function openDb() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise(function (resolve, reject) {
            const req = indexedDB.open(DB_NAME, 2);
            req.onupgradeneeded = function () {
                const db = req.result;
                if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
                // v2: durable OUTBOX of FINISHED-but-unconfirmed tracks (multi-slot, keyed by a stable
                //     local id). A failed offline SPEICHERN is queued here and auto-retried — and can
                //     never be clobbered by the next recording (unlike the single 'active' slot).
                if (!db.objectStoreNames.contains(OUTBOX)) db.createObjectStore(OUTBOX, { keyPath: 'id' });
            };
            req.onsuccess = function () { resolve(req.result); };
            req.onerror = function () { reject(req.error); };
        });
        return dbPromise;
    }

    function idbPut(value) {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(STORE, 'readwrite');
                tx.objectStore(STORE).put(value, KEY);
                tx.oncomplete = function () { resolve(); };
                tx.onerror = function () { reject(tx.error); };
            });
        });
    }
    function idbGet() {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(STORE, 'readonly');
                const rq = tx.objectStore(STORE).get(KEY);
                rq.onsuccess = function () { resolve(rq.result || null); };
                rq.onerror = function () { reject(rq.error); };
            });
        });
    }
    function idbDel() {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(STORE, 'readwrite');
                tx.objectStore(STORE).delete(KEY);
                tx.oncomplete = function () { resolve(); };
                tx.onerror = function () { reject(tx.error); };
            });
        });
    }

    // ---- durable OUTBOX (multi-slot): finished tracks awaiting a confirmed cloud upload ----
    function outboxPut(entry) {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(OUTBOX, 'readwrite');
                tx.objectStore(OUTBOX).put(entry); // keyPath 'id'
                tx.oncomplete = function () { resolve(); };
                tx.onerror = function () { reject(tx.error); };
            });
        });
    }
    function outboxAll() {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(OUTBOX, 'readonly');
                const rq = tx.objectStore(OUTBOX).getAll();
                rq.onsuccess = function () { resolve(rq.result || []); };
                rq.onerror = function () { reject(rq.error); };
            });
        });
    }
    function outboxDel(id) {
        return openDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(OUTBOX, 'readwrite');
                tx.objectStore(OUTBOX).delete(id);
                tx.oncomplete = function () { resolve(); };
                tx.onerror = function () { reject(tx.error); };
            });
        });
    }

    // ---- throttled writer (coalesces; always flushes the latest pending state) ----
    let lastWrite = 0, timer = null, pending = null, inflight = false;

    function doWrite() {
        timer = null;
        if (pending == null || inflight) return;
        const value = pending; pending = null; inflight = true; lastWrite = Date.now();
        idbPut(value)
            .catch(function (e) { dbg('put failed ' + e); })
            .then(function () { inflight = false; if (pending != null) schedule(); });
    }
    function schedule() {
        if (timer || inflight) return;
        const wait = Math.max(0, MIN_MS - (Date.now() - lastWrite));
        timer = setTimeout(doWrite, wait);
    }

    function save(state) {
        if (!hasIDB) return;
        pending = state;
        schedule();
    }
    function saveNow(state) {
        if (!hasIDB) return;
        pending = state;
        if (timer) { clearTimeout(timer); timer = null; }
        if (!inflight) doWrite();
    }
    function load() {
        if (!hasIDB) return Promise.resolve(null);
        return idbGet().catch(function (e) { dbg('get failed ' + e); return null; });
    }
    function clear() {
        pending = null;
        if (timer) { clearTimeout(timer); timer = null; }
        if (!hasIDB) return Promise.resolve();
        return idbDel().catch(function (e) { dbg('del failed ' + e); });
    }

    global.TrackBuffer = {
        save: save, saveNow: saveNow, load: load, clear: clear,
        // durable multi-slot outbox for finished tracks awaiting a confirmed cloud save
        outbox: {
            put: function (entry) { return hasIDB ? outboxPut(entry) : Promise.resolve(); },
            all: function () { return hasIDB ? outboxAll().catch(function (e) { dbg('outbox all failed ' + e); return []; }) : Promise.resolve([]); },
            del: function (id) { return hasIDB ? outboxDel(id).catch(function (e) { dbg('outbox del failed ' + e); }) : Promise.resolve(); }
        }
    };
})(window);
