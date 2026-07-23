/* ============================================================
   MATHTRAINER store — File System Access to Doc's real
   MathTrainer/resources folder (photos/, sound/, teams/,
   tasks/, images/, teamNames.txt). PRIVACY: pupil photos,
   name recordings and rosters stay folder-local — the public
   repo ships only code. Without a folder the app runs on a
   built-in demo team and the 1x1 generator.
   ============================================================ */
'use strict';

MT.store = {
    dir: null,                // resources folder handle
    db: null,
    pendingHandle: null,
    photoList: [],            // [{name(lowercase basename no ext), file}]
    soundList: new Map(),     // lowercase name (no .wav) -> filename
    imageList: [],            // alphabetical image filenames (9x10 matrix)
    urlCache: new Map()
};

/* ---------------- IndexedDB for the folder handle ---------------- */
MT.store.openDb = function () {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('mathtrainer-web', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('kv');
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};

MT.store.kv = function (mode, fn) {
    return new Promise((resolve, reject) => {
        const tx = MT.store.db.transaction('kv', mode);
        const req = fn(tx.objectStore('kv'));
        tx.oncomplete = () => resolve(req && req.result);
        tx.onerror = () => reject(tx.error);
    });
};

MT.store.init = async function () {
    try { MT.store.db = await MT.store.openDb(); } catch (e) { MT.dbg('idb: ' + e.message); }
    if (!MT.store.db || !window.showDirectoryPicker) return;
    try {
        const h = await MT.store.kv('readonly', s => s.get('dirHandle'));
        if (h) {
            const perm = await h.queryPermission({ mode: 'read' });
            if (perm === 'granted') { MT.store.dir = h; await MT.store.scanFolder(); }
            else MT.store.pendingHandle = h;
        }
    } catch (e) { MT.dbg('restore handle: ' + e.message); }
};

MT.store.connectFolder = async function () {
    if (!window.showDirectoryPicker) {
        alert('This browser has no File System Access API — use Chrome. The demo team and the 1x1 generator work anyway.');
        return false;
    }
    try {
        let h = MT.store.pendingHandle;
        if (h && (await h.requestPermission({ mode: 'read' })) !== 'granted') h = null;
        if (!h) h = await window.showDirectoryPicker({ id: 'mathtrainer-res', mode: 'read' });
        // Doc may pick the project root — descend into resources/ if present
        try { h = await h.getDirectoryHandle('resources'); } catch (e) { }
        MT.store.dir = h;
        MT.store.pendingHandle = null;
        if (MT.store.db) await MT.store.kv('readwrite', s => s.put(h, 'dirHandle'));
        MT.store.urlCache.forEach(url => URL.revokeObjectURL(url));
        MT.store.urlCache.clear();
        await MT.store.scanFolder();
        return true;
    } catch (e) {
        if (e.name !== 'AbortError') MT.dbg('connectFolder: ' + e.message);
        return false;
    }
};

/* ---------------- folder scanning ---------------- */
MT.store.subdir = async function (name) {
    if (!MT.store.dir) return null;
    try { return await MT.store.dir.getDirectoryHandle(name); } catch (e) { return null; }
};

MT.store.readText = async function (dir, name) {
    try { return await (await (await dir.getFileHandle(name)).getFile()).text(); } catch (e) { return null; }
};

MT.store.scanFolder = async function () {
    // photos
    MT.store.photoList = [];
    const pdir = await MT.store.subdir('photos');
    if (pdir) {
        for await (const [name, handle] of pdir.entries()) {
            if (handle.kind === 'file' && /\.(jpe?g|png)$/i.test(name)) {
                // strip extension and a trailing ' 1234' avatar number;
                // NFC-normalize: macOS filenames are NFD, roster files are NFC (umlauts!)
                const base = name.replace(/\.(jpe?g|png)$/i, '').replace(/ \d+$/, '').toLowerCase().normalize('NFC');
                MT.store.photoList.push({ name: base, file: name });
            }
        }
    }
    // sounds
    MT.store.soundList = new Map();
    const sdir = await MT.store.subdir('sound');
    if (sdir) {
        for await (const [name, handle] of sdir.entries()) {
            if (handle.kind === 'file' && /\.wav$/i.test(name)) {
                MT.store.soundList.set(name.replace(/\.wav$/i, '').toLowerCase().normalize('NFC'), name);
            }
        }
    }
    // background images (alphabetical, 9x10 matrix like the Java loader)
    MT.store.imageList = [];
    const idir = await MT.store.subdir('images');
    if (idir) {
        for await (const [name, handle] of idir.entries()) {
            if (handle.kind === 'file' && /\.(jpe?g|png)$/i.test(name) && !/smiley/i.test(name)) {
                MT.store.imageList.push(name);
            }
        }
        MT.store.imageList.sort((a, b) => a.localeCompare(b));
    }
    MT.dbg('folder scan: ' + MT.store.photoList.length + ' photos, ' + MT.store.soundList.size + ' sounds, ' +
        MT.store.imageList.length + ' images');
};

/* ---------------- asset lookup ---------------- */
MT.store.fileURL = async function (dirName, fileName) {
    const key = dirName + '/' + fileName;
    if (MT.store.urlCache.has(key)) return MT.store.urlCache.get(key);
    const dir = await MT.store.subdir(dirName);
    if (!dir) return null;
    try {
        const url = URL.createObjectURL(await (await dir.getFileHandle(fileName)).getFile());
        MT.store.urlCache.set(key, url);
        return url;
    } catch (e) { return null; }
};

// photo by pupil name: exact basename match first, then substring (both directions)
MT.store.photoURL = async function (pupilName) {
    const n = pupilName.toLowerCase().normalize('NFC');
    let hit = MT.store.photoList.find(p => p.name === n);
    if (!hit) hit = MT.store.photoList.find(p => p.name.includes(n) || n.includes(p.name));
    if (!hit) return null;
    return MT.store.fileURL('photos', hit.file);
};

// name audio: try exact key ('adele berit jacob' or 'adele'), else null → TTS fallback
MT.store.nameSoundURL = async function (name) {
    const file = MT.store.soundList.get(name.toLowerCase().normalize('NFC'));
    if (!file) return null;
    return MT.store.fileURL('sound', file);
};

// multiplication background: 9x10 matrix indexed [smaller][larger] (divide: [quotient][divisor])
MT.store.backgroundURL = async function (row, col) {
    const idx = row * 10 + col;
    if (idx < 0 || idx >= MT.store.imageList.length) return null;
    return MT.store.fileURL('images', MT.store.imageList[idx]);
};

/* ---------------- teams / tasks from folder ---------------- */
MT.store.readTeamNames = async function () {
    if (!MT.store.dir) return null;
    const txt = await MT.store.readText(MT.store.dir, 'teamNames.txt');
    if (!txt) return null;
    return txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
};

MT.store.readRoster = async function (fileBase) {
    const tdir = await MT.store.subdir('teams');
    if (!tdir) return null;
    const txt = await MT.store.readText(tdir, 'Team' + fileBase + '.txt');
    if (!txt) return null;
    return txt.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('//'));
};

MT.store.listTaskFiles = async function () {
    const tdir = await MT.store.subdir('tasks');
    if (!tdir) return [];
    const out = [];
    for await (const [name, handle] of tdir.entries()) {
        if (handle.kind === 'file' && name.endsWith('.txt')) out.push(name);
    }
    return out.sort((a, b) => a.localeCompare(b));
};

MT.store.readTaskFile = async function (name) {
    const tdir = await MT.store.subdir('tasks');
    if (!tdir) return null;
    return MT.store.readText(tdir, name);
};

MT.store.musicURL = async function () {
    const file = MT.store.soundList.get('madonna - frozen');
    return file ? MT.store.fileURL('sound', file) : null;
};

/* ---------------- demo data (no real pupils!) ---------------- */
MT.store.demoTeam = () => ['Ada Lovelace', 'Alan Turing', 'Emmy Noether', 'Carl Gauß',
    'Sofja Kowalewskaja', 'Leonhard Euler', 'Maryam Mirzakhani', 'Srinivasa Ramanujan'];

MT.store.demoTasks = () => [
    ['\\( \\sqrt{n + 11} = 7 \\)', '\\( n = 38 \\)'],
    ['\\( 3x + 5 = 20 \\)', '\\( x = 5 \\)'],
    ['\\( \\frac{2}{3} + \\frac{1}{6} \\)', '\\( = \\frac{5}{6} \\)'],
    ['Capital of Spain?', 'Madrid'],
    ['\\( 2^{10} \\)', '\\( = 1024 \\)']
];
