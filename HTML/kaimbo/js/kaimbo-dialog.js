/* ============================================================
   KAIMBO task dialog — new/edit window (TaskDialog port):
   5 stacked language fields, exactly one master field (pale
   green) that is the translation source; Enter machine-
   translates the other languages, a second Enter saves the
   task (inserted at index 0). Edit mode writes changes live
   into the task (the original has no Save/Cancel buttons).

   Translation: MyMemory free API by default (no key needed);
   if a Google Translate API key is stored in the settings
   (localStorage only — NEVER in code), Google v2 is used.
   ============================================================ */
'use strict';

KB.dialog = { mode: null, task: null, translated: false };

KB.dialog.isOpen = () => !document.getElementById('task-dialog').classList.contains('hidden');

KB.dialog.langLabel = l => l === 'flexi' ? KB.langName('flexi').toUpperCase() : l.toUpperCase();

KB.dialog.openNew = function () { KB.dialog.open('new', null); };
KB.dialog.openEdit = function () {
    const t = KB.currentTask();
    if (t && !KB.state.covered) KB.dialog.open('edit', t);
};

KB.dialog.open = function (mode, task) {
    KB.dialog.mode = mode;
    KB.dialog.task = task;
    KB.dialog.translated = false;
    const el = document.getElementById('task-dialog');
    const rows = KB.LANGS.map(l =>
        '<div class="td-row"><span class="td-label">' + KB.escapeHtml(KB.dialog.langLabel(l)) + '</span>' +
        '<input class="td-field" data-lang="' + l + '" spellcheck="false" aria-label="' + l + ' text"></div>').join('');
    el.innerHTML =
        '<div class="card" role="dialog">' +
        '<div class="card-title" id="td-title"></div>' +
        '<div class="card-body">' + rows + '</div>' +
        '<div class="card-status" id="td-status"></div>' +
        '<div class="btn-row">' +
        '<button class="btn secondary" id="td-cancel">Close (Esc)</button>' +
        '<button class="btn" id="td-main">Translate</button>' +
        '</div></div>';
    el.classList.remove('hidden');
    KB.dialog.setTitle(mode === 'new'
        ? 'Enter new task, hit Return and get automated translations.'
        : 'Edit task. Changes are saved live. Esc closes.');

    const fields = [...el.querySelectorAll('.td-field')];
    if (mode === 'edit') {
        fields.forEach(f => { f.value = KB.txt(task, f.dataset.lang); });
    }
    fields.forEach(f => {
        f.addEventListener('focus', () => KB.dialog.setMaster(f, fields));
        f.addEventListener('input', () => {
            if (mode === 'edit') {          // live write-back, like the original caretUpdate
                KB.setTxt(task, f.dataset.lang, f.value.trim() || '-');
                KB.markDirty();
                KB.emit('task-shown');
            } else if (!KB.dialog.translated && f.classList.contains('master')) {
                // typing the NEW draft clears the other four fields; after a translation
                // ran, typing only corrects that one field (no wiping the draft)
                fields.forEach(o => { if (o !== f) o.value = ''; });
                document.getElementById('td-main').textContent = 'Translate';
            }
        });
        f.addEventListener('keydown', e => {
            e.stopPropagation();
            if (e.key === 'Enter') { e.preventDefault(); KB.dialog.enter(fields); }
            if (e.key === 'Escape') { e.preventDefault(); KB.dialog.esc(fields); }
        });
    });
    document.getElementById('td-cancel').onclick = () => KB.dialog.close();
    document.getElementById('td-main').onclick = () => KB.dialog.enter(fields);
    el.onclick = e => { if (e.target === el) KB.dialog.close(); };
    KB.dialog.setMaster(fields[KB.LANGS.indexOf(KB.settings.masterLanguage)] || fields[0], fields);
    (fields[KB.LANGS.indexOf(KB.settings.masterLanguage)] || fields[0]).focus();
};

KB.dialog.setMaster = function (field, fields) {
    fields.forEach(f => f.classList.toggle('master', f === field));
};

KB.dialog.setTitle = function (t) { document.getElementById('td-title').textContent = t; };
KB.dialog.setStatus = function (t) { document.getElementById('td-status').textContent = t; };

KB.dialog.enter = async function (fields) {
    if (KB.dialog.mode === 'edit') { KB.dialog.close(); return; }
    if (KB.dialog.translating) return;      // no parallel translate runs
    const master = fields.find(f => f.classList.contains('master'));
    const filled = fields.filter(f => f.value.trim());
    if (!master || !master.value.trim()) { KB.dialog.setStatus('Type the task into one field first.'); return; }
    if (!KB.dialog.translated || filled.length < 2) {
        await KB.dialog.translateAll(fields, master);
    } else {
        KB.dialog.saveNew(fields);
    }
};

KB.dialog.esc = function (fields) {
    if (KB.dialog.mode === 'new' && fields.some(f => f.value.trim())) {
        fields.forEach(f => { f.value = ''; });
        KB.dialog.translated = false;
        KB.dialog.setTitle('Enter a new task or hit Esc to close the dialog.');
    } else {
        KB.dialog.close();
    }
};

KB.dialog.close = function () {
    document.getElementById('task-dialog').classList.add('hidden');
    if (KB.dialog.mode === 'edit') { KB.tree.matchAll(); KB.tree.render(); KB.store.saveAll(); }
    KB.dialog.mode = null;
    document.getElementById('stage').focus();
};

KB.dialog.translateAll = async function (fields, master) {
    const fromLang = master.dataset.lang;
    const text = master.value.trim();
    const targets = fields.filter(f => f !== master);
    let done = 0;
    KB.dialog.translating = true;
    const run = KB.dialog.runToken = (KB.dialog.runToken || 0) + 1;
    KB.dialog.setTitle('Translating …');
    try {
        for (const f of targets) {
            let value = '';
            try {
                value = await KB.translateText(text, fromLang, f.dataset.lang);
            } catch (e) {
                KB.dialog.setStatus('Translation problems (' + f.dataset.lang + '): ' + e.message);
            }
            if (run !== KB.dialog.runToken || !KB.dialog.isOpen()) return;   // dialog moved on
            f.value = value;
            done++;
            KB.dialog.setTitle('Translating … ' + Math.round(done * 100 / targets.length) + ' % done');
        }
        KB.dialog.translated = true;
        KB.dialog.setTitle('Hit Enter to save and create the next task. Esc to discard.');
        document.getElementById('td-main').textContent = 'Add task to portfolio';
    } finally {
        KB.dialog.translating = false;
    }
};

KB.dialog.saveNew = function (fields) {
    const t = KB.newTask();
    fields.forEach(f => KB.setTxt(t, f.dataset.lang, f.value.trim() || '-'));
    t.needNewImage = true;
    KB.state.tasks.unshift(t);          // insert at index 0, like the original
    KB.state.taskIndex = 0;
    KB.markDirty();
    KB.tree.matchAll(); KB.tree.render();
    KB.store.saveAll();
    KB.emit('task-shown');
    fields.forEach(f => { f.value = ''; });
    KB.dialog.translated = false;
    document.getElementById('td-main').textContent = 'Translate';
    KB.dialog.setTitle('Adding task … done. Enter the next task or hit Esc to close.');
    fields[KB.LANGS.indexOf(KB.settings.masterLanguage)].focus();
};

/* ---------------- translation service ---------------- */
KB.langShort = l => l === 'flexi' ? (KB.settings.sFlexiLanguageShort || 'fr')
    : { german: 'de', italian: 'it', spanish: 'es', english: 'en' }[l];

KB.translateText = async function (text, fromLang, toLang) {
    const from = KB.langShort(fromLang), to = KB.langShort(toLang);
    if (KB.settings.googleKey) {
        const res = await fetch('https://translation.googleapis.com/language/translate/v2?key=' +
            encodeURIComponent(KB.settings.googleKey), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: from, target: to, format: 'text' })
        });
        if (!res.ok) throw new Error('Google ' + res.status);
        const j = await res.json();
        return j.data.translations[0].translatedText;
    }
    // free fallback: MyMemory (rate-limited, good enough for authoring)
    const res = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) +
        '&langpair=' + from + '|' + to);
    if (!res.ok) throw new Error('MyMemory ' + res.status);
    const j = await res.json();
    if (!j.responseData || !j.responseData.translatedText) throw new Error('nothing found');
    return j.responseData.translatedText;
};
