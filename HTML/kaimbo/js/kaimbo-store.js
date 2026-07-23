/* ============================================================
   KAIMBO store — persistence in three layers:

   1. localStorage: settings + vocabulary/topics in ORIGINAL
      text formats (always written — instant boot, offline safe)
   2. File System Access API: direct read/write of Doc's real
      DataLearnLanguages folder (Vocabulary.txt, mytopics.pnk,
      images/, sounds/, Infos_*, backup/) — Chrome/Edge
   3. IndexedDB: the remembered folder handle + media blobs
      (pasted images, recordings) when no folder is connected

   Like the original, every folder load writes a timestamped
   backup into backup/ and every save rewrites txt + json twins.
   ============================================================ */
'use strict';

KB.store = {
    dir: null,           // FileSystemDirectoryHandle of DataLearnLanguages
    db: null,
    urlCache: new Map(), // image name -> objectURL
    soundDirCache: new Map()
};

const VOCAB_LS = 'kaimbo.vocabulary';
const TOPICS_LS = 'kaimbo.topics';

/* ---------------- IndexedDB ---------------- */
KB.store.openDb = function () {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('kaimbo-studio', 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            db.createObjectStore('kv');
            db.createObjectStore('media');   // pasted images: key = image basename
            db.createObjectStore('sounds');  // key = language + '/' + filename
            db.createObjectStore('infos');   // key = language + '|' + task text
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};

KB.store.idb = function (storeName, mode, fn) {
    return new Promise((resolve, reject) => {
        const tx = KB.store.db.transaction(storeName, mode);
        const req = fn(tx.objectStore(storeName));
        tx.oncomplete = () => resolve(req && req.result);
        tx.onerror = () => reject(tx.error);
    });
};

KB.store.kvGet = key => KB.store.idb('kv', 'readonly', s => s.get(key));
KB.store.kvSet = (key, val) => KB.store.idb('kv', 'readwrite', s => s.put(val, key));

/* ---------------- folder handling ---------------- */
KB.store.init = async function () {
    try { KB.store.db = await KB.store.openDb(); } catch (e) { KB.dbg('IDB failed: ' + e.message); }
    if (!KB.store.db || !window.showDirectoryPicker) return;
    try {
        const handle = await KB.store.kvGet('dirHandle');
        if (handle) {
            const perm = await handle.queryPermission({ mode: 'readwrite' });
            if (perm === 'granted') KB.store.dir = handle;
            else KB.store.pendingHandle = handle;   // needs a user gesture to re-grant
        }
    } catch (e) { KB.dbg('restore handle: ' + e.message); }
};

// user-gesture entry point (folder chip / menu)
KB.store.connectFolder = async function () {
    if (!window.showDirectoryPicker) {
        alert('This browser has no File System Access API — use Chrome, or work via Import/Export.');
        return false;
    }
    try {
        let handle = KB.store.pendingHandle;
        if (handle) {
            const perm = await handle.requestPermission({ mode: 'readwrite' });
            if (perm !== 'granted') handle = null;
        }
        if (!handle) {
            handle = await window.showDirectoryPicker({ id: 'kaimbo-data', mode: 'readwrite' });
        }
        KB.store.dir = handle;
        KB.store.pendingHandle = null;
        await KB.store.kvSet('dirHandle', handle);
        KB.store.urlCache.clear();
        KB.store.soundDirCache.clear();
        KB.store.soundUrlCache.clear();
        return true;
    } catch (e) {
        if (e.name !== 'AbortError') KB.dbg('connectFolder: ' + e.message);
        return false;
    }
};

KB.store.subdir = async function (path, create = false) {
    let d = KB.store.dir;
    if (!d) return null;
    try {
        for (const part of path.split('/').filter(Boolean)) {
            d = await d.getDirectoryHandle(part, { create });
        }
        return d;
    } catch (e) { return null; }
};

KB.store.readTextFile = async function (dir, name) {
    const r = await KB.store.readTextFileEx(dir, name);
    return r.status === 'ok' ? r.text : null;
};

// distinguishes "file does not exist" (harmless) from real read errors (dangerous:
// falling back to stale data and later writing it back would clobber the folder)
KB.store.readTextFileEx = async function (dir, name) {
    try {
        const fh = await dir.getFileHandle(name);
        return { status: 'ok', text: await (await fh.getFile()).text() };
    } catch (e) {
        if (e && e.name === 'NotFoundError') return { status: 'notfound' };
        return { status: 'error', error: e };
    }
};

KB.store.writeFile = async function (dir, name, content) {
    const fh = await dir.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(content);
    await w.close();
};

KB.store.timestamp = function () {
    const d = new Date(), p = n => String(n).padStart(2, '0');
    return p(d.getDate()) + '-' + p(d.getMonth() + 1) + '-' + d.getFullYear() + ' ' +
        p(d.getHours()) + '.' + p(d.getMinutes()) + '.' + p(d.getSeconds());
};

/* ---------------- load ---------------- */
KB.store.loadAll = async function () {
    let vocab = null, topics = null, source = 'sample';
    KB.state.loadError = false;
    if (KB.store.dir) {
        const v = await KB.store.readTextFileEx(KB.store.dir, 'Vocabulary.txt');
        const t = await KB.store.readTextFileEx(KB.store.dir, 'mytopics.pnk');
        // real read error (not "missing"): disconnect the folder so nothing stale
        // can ever be written back over it — loud, per Doc's rules
        if (v.status === 'error' || t.status === 'error') {
            const bad = v.status === 'error' ? 'Vocabulary.txt' : 'mytopics.pnk';
            KB.dbg('FOLDER READ ERROR on ' + bad + ' — folder disconnected for safety');
            alert('Could not READ ' + bad + ' from the connected folder (' +
                ((v.error || t.error) || {}).name + ').\nThe folder is disconnected for safety — nothing will be written to it. Reconnect once the file is readable.');
            KB.store.pendingHandle = KB.store.dir;
            KB.store.dir = null;
        } else {
            if (v.status === 'ok') vocab = v.text;
            if (t.status === 'ok') topics = t.text;
            if (vocab) {
                source = 'folder';
                // timestamped backups on every load, like the original (+ the tree twin)
                try {
                    const bdir = await KB.store.subdir('backup', true);
                    if (bdir) {
                        // keep a copy of newer local edits before they get replaced (data safety)
                        const ls = localStorage.getItem(VOCAB_LS);
                        if (ls && ls !== vocab && KB.state.dirty) {
                            await KB.store.writeFile(bdir, 'KaimboTasks' + KB.store.timestamp() + ' (local).txt', ls);
                        }
                        await KB.store.writeFile(bdir, 'KaimboTasks' + KB.store.timestamp() + '.txt', vocab);
                        if (topics) await KB.store.writeFile(bdir, 'KaimboTopics' + KB.store.timestamp() + '.pnk', topics);
                    }
                } catch (e) { KB.dbg('backup failed: ' + e.message); }
            }
        }
    }
    // fall back per file independently — folder may have one but not the other
    if (!vocab) {
        vocab = localStorage.getItem(VOCAB_LS);
        if (vocab) source = 'localStorage';
    }
    if (!topics) topics = localStorage.getItem(TOPICS_LS);
    if (vocab) {
        try {
            KB.state.tasks = KB.formats.parseVocabulary(vocab, { strict: true });
            localStorage.setItem(VOCAB_LS, vocab);
        } catch (e) {
            // damaged file: do NOT install a garbled parse and never save over the source
            KB.state.loadError = true;
            KB.state.tasks = [];
            alert('Vocabulary data looks DAMAGED — loading aborted, saving disabled.\n\n' + e.message +
                '\n\nFix the file (see backup/) and reload.');
            KB.dbg('LOAD ERROR: ' + e.message);
        }
    } else {
        KB.state.tasks = KB.store.sampleTasks();
    }
    KB.state.treeFromSample = !topics;
    const treeData = KB.formats.buildTree(KB.formats.parsePnk(topics || KB.store.samplePnk()));
    if (topics) localStorage.setItem(TOPICS_LS, topics);
    KB.tree.setModel(treeData);
    KB.dbg('loaded ' + KB.state.tasks.length + ' tasks from ' + source);
    return source;
};

/* ---------------- save ---------------- */
// saves are serialized through one promise chain: overlapping calls coalesce and
// always end with the LATEST state on disk (no stale-snapshot-wins race)
KB.store._saveChain = Promise.resolve();
KB.store._savePending = false;

KB.store.saveAll = function () {
    if (KB.state.loadError) {                 // never persist a garbled/aborted load
        KB.dbg('save blocked: load error state');
        return Promise.resolve('blocked');
    }
    if (KB.store._savePending) return KB.store._saveChain;
    KB.store._savePending = true;
    KB.store._saveChain = KB.store._saveChain.then(() => {
        KB.store._savePending = false;
        return KB.store._doSave();
    });
    return KB.store._saveChain;
};

KB.store._doSave = async function () {
    const vocab = KB.formats.serializeVocabulary(KB.state.tasks);
    const root = KB.tree.root();
    // a sample tree only exists when neither folder nor localStorage had topics —
    // still, never write it into a connected folder that we could not read from
    const pnk = root && !KB.state.treeFromSample ? KB.formats.serializePnk(root) : null;
    localStorage.setItem(VOCAB_LS, vocab);
    if (pnk) localStorage.setItem(TOPICS_LS, pnk);
    KB.saveSettings();
    let where = 'localStorage';
    if (KB.store.dir) {
        try {
            await KB.store.writeFile(KB.store.dir, 'Vocabulary.txt', vocab);
            await KB.store.writeFile(KB.store.dir, 'Vocabulary.json', KB.formats.serializeVocabularyJson(KB.state.tasks));
            if (pnk) {
                await KB.store.writeFile(KB.store.dir, 'mytopics.pnk', pnk);
                await KB.store.writeFile(KB.store.dir, 'mytopics.json', KB.formats.serializeTopicsJson(root));
            }
            where = 'folder + localStorage';
        } catch (e) {
            KB.dbg('folder save failed: ' + e.message);
            where = 'localStorage (folder write FAILED)';
        }
    }
    KB.state.dirty = false;
    KB.updateStatus();
    KB.dbg('saved → ' + where);
    return where;
};

/* ---------------- images ---------------- */
KB.store.imageBasename = name => (name || '').split('/').pop();

KB.store.imageURL = async function (imageName) {
    const base = KB.store.imageBasename(imageName);
    if (!base) return null;
    if (KB.store.urlCache.has(base)) return KB.store.urlCache.get(base);
    let blob = null;
    const idir = await KB.store.subdir('images');
    if (idir) {
        try { blob = await (await idir.getFileHandle(base)).getFile(); } catch (e) { /* not in folder */ }
    }
    if (!blob && KB.store.db) {
        try { blob = await KB.store.idb('media', 'readonly', s => s.get(base)); } catch (e) { }
    }
    const url = blob ? URL.createObjectURL(blob) : null;
    KB.store.urlCache.set(base, url);
    return url;
};

// store a pasted/dropped image; name derived from english text like the original
KB.store.saveImage = async function (task, blob) {
    const en = (task.english && task.english !== '-') ? task.english : 'image-' + Date.now();
    const base = en.replace(/ /g, '-').replace(/[/\\]/g, '_') + '.jpg';
    const idir = await KB.store.subdir('images', true);
    if (idir) {
        await KB.store.writeFile(idir, base, blob);
    } else if (KB.store.db) {
        await KB.store.idb('media', 'readwrite', s => s.put(blob, base));
    }
    task.backgroundImageName = './DataLearnLanguages/images/' + base;
    task.needNewImage = false;
    task.zoom = 1.0; task.right = 0; task.down = 0;
    KB.store.urlCache.delete(base);
    KB.markDirty();
};

/* ---------------- sounds ---------------- */
// synthetic file convention: {text}_{voice}_female.wav ; human: {speaker}_{text}_{voice}.wav
// filenames on disk are slash-sanitized — the SAME sanitizer must be used for save AND lookup
KB.store.soundSafe = s => String(s).replace(/[/\\]/g, '_');
KB.store.soundUrlCache = new Map();

KB.store.listSounds = async function (language) {
    if (KB.store.soundDirCache.has(language)) return KB.store.soundDirCache.get(language);
    const names = new Set();
    const sdir = await KB.store.subdir('sounds/' + language);
    if (sdir) {
        try { for await (const [name] of sdir.entries()) names.add(name); } catch (e) { }
    }
    if (KB.store.db) {
        try {
            const keys = await KB.store.idb('sounds', 'readonly', s => s.getAllKeys());
            (keys || []).forEach(k => { if (k.startsWith(language + '/')) names.add(k.slice(language.length + 1)); });
        } catch (e) { }
    }
    KB.store.soundDirCache.set(language, names);
    return names;
};

// 0 = NOSOUND, 1 = SYNTHETIC (file), 2 = HUMAN (recording)
KB.store.soundStatus = async function (task, lang) {
    const language = KB.langName(lang);
    const text = KB.txt(task, lang);
    if (!text || text === '-') return 0;
    const safe = KB.store.soundSafe(text);
    const names = await KB.store.listSounds(language);
    const voice = KB.langVoice(lang);
    for (const n of names) {
        if (n.endsWith('_' + safe + '_' + voice + '.wav')) return 2;           // human: speaker prefix
    }
    if (names.has(safe + '_' + voice + '_female.wav') || names.has(safe + '_' + voice + '.wav')) return 1;
    return 0;
};

KB.store.soundURL = async function (lang, task) {
    const language = KB.langName(lang);
    const safe = KB.store.soundSafe(KB.txt(task, lang));
    const voice = KB.langVoice(lang);
    const names = await KB.store.listSounds(language);
    let file = null;
    for (const n of names) if (n.endsWith('_' + safe + '_' + voice + '.wav')) { file = n; break; }
    if (!file && names.has(safe + '_' + voice + '_female.wav')) file = safe + '_' + voice + '_female.wav';
    if (!file && names.has(safe + '_' + voice + '.wav')) file = safe + '_' + voice + '.wav';
    if (!file) return null;
    const cacheKey = language + '/' + file;
    if (KB.store.soundUrlCache.has(cacheKey)) return KB.store.soundUrlCache.get(cacheKey);
    let url = null;
    const sdir = await KB.store.subdir('sounds/' + language);
    if (sdir) {
        try { url = URL.createObjectURL(await (await sdir.getFileHandle(file)).getFile()); } catch (e) { }
    }
    if (!url && KB.store.db) {
        try {
            const blob = await KB.store.idb('sounds', 'readonly', s => s.get(cacheKey));
            if (blob) url = URL.createObjectURL(blob);
        } catch (e) { }
    }
    if (url) KB.store.soundUrlCache.set(cacheKey, url);
    return url;
};

KB.store.saveSound = async function (lang, filename, blob) {
    const language = KB.langName(lang);
    const safe = KB.store.soundSafe(filename);
    const sdir = await KB.store.subdir('sounds/' + language, true);
    if (sdir) await KB.store.writeFile(sdir, safe, blob);
    else if (KB.store.db) await KB.store.idb('sounds', 'readwrite', s => s.put(blob, language + '/' + safe));
    KB.store.soundDirCache.delete(language);
    for (const k of KB.store.soundUrlCache.keys()) {
        if (k.startsWith(language + '/')) { URL.revokeObjectURL(KB.store.soundUrlCache.get(k)); KB.store.soundUrlCache.delete(k); }
    }
};

/* ---------------- per-task info notes (Infos_<language>/<text>.txt) ---------------- */
KB.store.infoKey = (language, text) => language + '|' + text;

KB.store.readInfo = async function (language, text) {
    const dir = await KB.store.subdir('Infos_' + language);
    if (dir) {
        const c = await KB.store.readTextFile(dir, text + '.txt');
        if (c !== null) return c;
    }
    if (KB.store.db) {
        try {
            const c = await KB.store.idb('infos', 'readonly', s => s.get(KB.store.infoKey(language, text)));
            if (c != null) return c;
        } catch (e) { }
    }
    return null;
};

// all task texts that have a non-empty note for a language (folder dir + IDB)
KB.store.listInfoKeys = async function (language) {
    const keys = new Set();
    const dir = await KB.store.subdir('Infos_' + language);
    if (dir) {
        try {
            for await (const [name, handle] of dir.entries()) {
                if (name.endsWith('.txt') && handle.kind === 'file') keys.add(name.slice(0, -4));
            }
        } catch (e) { }
    }
    if (KB.store.db) {
        try {
            const all = await KB.store.idb('infos', 'readonly', s => s.getAllKeys());
            (all || []).forEach(k => { if (k.startsWith(language + '|')) keys.add(k.slice(language.length + 1)); });
        } catch (e) { }
    }
    return keys;
};

KB.store.writeInfo = async function (language, text, content) {
    const dir = await KB.store.subdir('Infos_' + language, true);
    if (dir) { await KB.store.writeFile(dir, text + '.txt', content); return; }
    if (KB.store.db) await KB.store.idb('infos', 'readwrite', s => s.put(content, KB.store.infoKey(language, text)));
};

/* ---------------- download / upload fallbacks ---------------- */
KB.store.download = function (filename, content) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
};

KB.store.pickTextFile = function (accept) {
    return new Promise(resolve => {
        const inp = document.createElement('input');
        inp.type = 'file';
        inp.accept = accept;
        inp.onchange = async () => {
            const f = inp.files[0];
            resolve(f ? { name: f.name, text: await f.text() } : null);
        };
        inp.click();
    });
};

/* ---------------- built-in sample (only when nothing else exists) ---------------- */
KB.store.sampleTasks = function () {
    const rows = [
        ['gut', 'buono', 'bien', 'good', 'bien'],
        ['Ein Orangensaft, bitte.', "Un succo d'arancia, per favore.", 'Un zumo de naranja, por favor.', 'An orange juice, please.', "Un jus d'orange, s'il vous plaît."],
        ['Wo ist der Bahnhof?', 'Dovè la stazione?', '¿Dónde está la estación?', 'Where is the station?', 'Où est la gare ?'],
        ['Ich esse Eis nur in Italien.', 'Mangio il gelato solo in Italia.', 'Solo como helado en Italia.', 'I only eat ice cream in Italy.', 'Je ne mange de la glace qu’en Italie.'],
        ['Danke schön!', 'Grazie mille!', '¡Muchas gracias!', 'Thank you very much!', 'Merci beaucoup !']
    ];
    return rows.map(r => {
        const t = KB.newTask();
        [t.german, t.italian, t.spanish, t.english, t.flexi] = r;
        t.needNewImage = true;
        return t;
    });
};

KB.store.samplePnk = function () {
    const id1 = 'aaaaaaaa-0000-4000-8000-000000000001';
    const id2 = 'aaaaaaaa-0000-4000-8000-000000000002';
    const id3 = 'aaaaaaaa-0000-4000-8000-000000000003';
    return '# Total number of topics: 5\n[Term]\nid: root\nname:\n\n[Term]\nid: userroot\nname: My topics\nis_a: root\n\n' +
        '\n[Term]\nid: ' + id1 + '\nname: Kaimbo Language World\nis_a: userroot\ncomment: OPEND STRUCTURENODE LOCKED CHILDCOUNT 2\n' +
        '\n[Term]\nid: ' + id2 + '\nname: Food and drinks\nis_a: ' + id1 + '\ncomment: LEAF CHILDCOUNT 0\n' +
        '\n[Term]\nid: ' + id3 + '\nname: Travel\nis_a: ' + id1 + '\ncomment: LEAF CHILDCOUNT 0\n';
};
