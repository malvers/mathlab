/* ============================================================
   KAIMBO app — shell wiring: menu bar, tabs, sidebar splitter,
   context-menu/draggable helpers, global keyboard dispatcher,
   import/export, flexi-language chooser, help page, boot.
   ============================================================ */
'use strict';

KB.app = {};

/* ---------------- menus ---------------- */
KB.app.buildMenus = function () {
    const M = [
        ['File', () => [
            ['Connect data folder …', '', () => KB.app.connectFolder()],
            '-',
            ['Import Tasks …', '', () => KB.app.importTasks()],
            ['Export Tasks …', '', () => KB.app.exportTasks()],
            ['Import tree …', '', () => KB.tree.importTree()],
            ['Export tree …', '', () => KB.tree.exportSubtree(KB.tree.root())],
            ['Load .kaimbo project …', '', () => KB.app.importKaimbo()],
            '-',
            ['Save', 'Ctrl+S', () => KB.store.saveAll()],
            ['Download Vocabulary.txt', '', () => KB.store.download('Vocabulary.txt', KB.formats.serializeVocabulary(KB.state.tasks))],
            ['Download mytopics.pnk', '', () => KB.store.download('mytopics.pnk', KB.formats.serializePnk(KB.tree.root()))],
            '-',
            ['Translate settings …', '', () => KB.app.translateSettings()]
        ]],
        ['Edit', () => [
            ['New task …', 'Ctrl+N', () => KB.dialog.openNew()],
            ['Edit task …', 'Ctrl+E', () => KB.dialog.openEdit()],
            '-',
            ['Delete current task', 'Backspace', () => KB.learning.deleteCurrent()],
            ['Delete all selected tasks', '', () => KB.app.deleteSelected()]
        ]],
        ['View', () => [
            [(KB.settings.showOntology ? '✓ ' : '') + 'Show ontology', 'Ctrl+O', () => KB.app.toggleSidebar()],
            ['Show simulator', 'Alt+S', () => KB.sim.toggle()],
            ['Show statistics', 'Ctrl+P', () => KB.stats.toggle()],
            '-',
            ...KB.LANGS.map(l => {
                const key = 'show' + KB.LANG_META[l].cap;
                const label = l === 'flexi' ? 'Flexible language (' + KB.langName('flexi') + ')' : KB.LANG_META[l].cap;
                return [(KB.settings[key] ? '✓ ' : '') + 'Show ' + label, '', () => {
                    KB.settings[key] = !KB.settings[key]; KB.saveSettings(); KB.emit('task-shown');
                }];
            }),
            '-',
            [(KB.settings.showNewbie ? '✓ ' : '') + 'Show newbie help line', '', () => {
                KB.settings.showNewbie = !KB.settings.showNewbie; KB.saveSettings(); KB.emit('task-shown');
            }],
            ['Debug window', 'Ctrl+L', () => KB.app.toggleDbg()]
        ]],
        ['Select', () => [
            [(KB.settings.showStatus === KB.SHOW_ALL ? '● ' : '') + 'Show all', '', () => KB.filters.apply('Show all')],
            [(KB.settings.showStatus === KB.SHOW_LEARNED ? '● ' : '') + 'Show learned', '', () => KB.filters.apply('Show learned')],
            [(KB.settings.showStatus === KB.SHOW_NOTLEARNED ? '● ' : '') + 'Show not learned', '', () => KB.app.showNotLearned()]
        ]],
        ['Modi', () => [
            [(KB.settings.randomMode ? '✓ ' : '') + 'Random mode', '', () => KB.app.toggleRandom()],
            [(KB.state.covered ? '✓ ' : '') + 'Cover mode (typing quiz)', 'Ctrl+C', () => KB.learning.toggleCover()],
            '-',
            ['Master language: ' + KB.langName(KB.settings.masterLanguage), '', () => { }],
            ['Choose flexible language …', '', () => KB.app.flexiChooser()]
        ]],
        ['Help', () => [
            ['Help', 'Ctrl+H', () => KB.app.showPane('content-tabs', 'help-pane')],
            ['About Kaimbo', 'Ctrl+A', () => alert('KAIMBO STUDIO — web port of KaimboStudio (Java/Swing).\nData formats are 1:1 compatible with the desktop app.')]
        ]]
    ];
    const bar = document.getElementById('menubar');
    bar.innerHTML = '';
    M.forEach(([name, items]) => {
        const root = document.createElement('div');
        root.className = 'menu-root';
        root.textContent = name;
        root.addEventListener('click', e => {
            e.stopPropagation();
            const existing = root.querySelector('.menu-drop');
            document.querySelectorAll('.menu-drop').forEach(d => d.remove());
            document.querySelectorAll('.menu-root').forEach(r => r.classList.remove('open'));
            if (existing) return;
            root.classList.add('open');
            const drop = document.createElement('div');
            drop.className = 'menu-drop';
            items().forEach(it => {
                if (it === '-') { drop.insertAdjacentHTML('beforeend', '<div class="menu-sep"></div>'); return; }
                const [label, hint, fn] = it;
                const mi = document.createElement('div');
                mi.className = 'menu-item';
                mi.innerHTML = '<span>' + KB.escapeHtml(label) + '</span><span class="mi-hint">' + hint + '</span>';
                mi.addEventListener('click', () => { document.querySelectorAll('.menu-drop').forEach(d => d.remove()); fn(); });
                drop.appendChild(mi);
            });
            root.appendChild(drop);
        });
        bar.appendChild(root);
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.menu-drop').forEach(d => d.remove());
        document.querySelectorAll('.menu-root').forEach(r => r.classList.remove('open'));
    });
};

/* ---------------- tabs / sidebar / splitter ---------------- */
KB.app.showPane = function (barId, paneId) {
    const bar = document.getElementById(barId);
    bar.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.pane === paneId));
    const parent = barId === 'sidebar-tabs' ? document.getElementById('sidebar') : document.getElementById('content');
    parent.querySelectorAll(':scope > .pane').forEach(p => p.classList.toggle('active', p.id === paneId));
    if (paneId === 'tasklist-pane') KB.table.render();
    if (paneId === 'help-pane') KB.app.renderHelp();
};

KB.app.initTabs = function () {
    ['sidebar-tabs', 'content-tabs'].forEach(barId => {
        document.getElementById(barId).querySelectorAll('.tab').forEach(t => {
            t.addEventListener('click', () => KB.app.showPane(barId, t.dataset.pane));
        });
    });
};

KB.app.toggleSidebar = function () {
    const sb = document.getElementById('sidebar');
    sb.classList.toggle('collapsed');
    KB.settings.showOntology = !sb.classList.contains('collapsed');
    KB.saveSettings();
    KB.learning.fitFonts();
};

KB.app.initSplitter = function () {
    const div = document.getElementById('divider');
    const sb = document.getElementById('sidebar');
    sb.style.width = (KB.settings.dividerLocation || 300) + 'px';
    if (!KB.settings.showOntology) sb.classList.add('collapsed');
    let dragging = false;
    div.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        const w = Math.min(Math.max(160, e.clientX), window.innerWidth * 0.6);
        sb.style.width = w + 'px';
        KB.settings.dividerLocation = w;
    });
    window.addEventListener('mouseup', () => {
        if (dragging) { dragging = false; KB.saveSettings(); KB.learning.fitFonts(); }
    });
};

/* ---------------- helpers: context menu + draggable windows ---------------- */
KB.app.showContextMenu = function (x, y, items) {
    const menu = document.getElementById('ctx-menu');
    menu.innerHTML = '';
    items.forEach(it => {
        if (it === '-') { menu.insertAdjacentHTML('beforeend', '<div class="menu-sep"></div>'); return; }
        const [label, hint, fn] = it;
        const mi = document.createElement('div');
        mi.className = 'menu-item';
        mi.innerHTML = '<span>' + KB.escapeHtml(label) + '</span><span class="mi-hint">' + hint + '</span>';
        mi.addEventListener('click', () => { KB.app.hideContextMenu(); fn(); });
        menu.appendChild(mi);
    });
    menu.classList.remove('hidden');
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    menu.style.left = Math.min(x, window.innerWidth - mw - 8) + 'px';
    menu.style.top = Math.min(y, window.innerHeight - mh - 8) + 'px';
    setTimeout(() => document.addEventListener('click', KB.app.hideContextMenu, { once: true }), 0);
};

KB.app.hideContextMenu = function () { document.getElementById('ctx-menu').classList.add('hidden'); };

KB.app.makeDraggable = function (el) {
    const title = el.querySelector('.fw-title');
    if (!title) return;
    title.onmousedown = e => {
        if (e.target.closest('button')) return;
        e.preventDefault();
        const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop;
        const move = ev => {
            el.style.left = (ev.clientX - sx) + 'px';
            el.style.top = (ev.clientY - sy) + 'px';
            el.style.right = 'auto';
        };
        const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };
};

/* ---------------- folder chip ---------------- */
KB.app.updateFolderChip = function () {
    const chip = document.getElementById('folder-chip');
    if (KB.store.dir) {
        chip.textContent = KB.store.dir.name + ' ✓';
        chip.className = 'chip chip-on';
        chip.title = 'Data folder connected — saving writes Vocabulary.txt / mytopics.pnk directly';
    } else if (KB.store.pendingHandle) {
        chip.textContent = 'reconnect folder';
        chip.className = 'chip chip-off';
        chip.title = 'Click to re-grant access to ' + KB.store.pendingHandle.name;
    } else {
        chip.textContent = 'no folder';
        chip.className = 'chip chip-off';
        chip.title = 'Click to connect your DataLearnLanguages folder';
    }
};

KB.app.connectFolder = async function () {
    if (await KB.store.connectFolder()) {
        // unsaved local work must never be silently replaced by the folder version
        if (KB.state.dirty && KB.state.tasks.length) {
            const keepLocal = !confirm(
                'You have local edits from this session.\n\nOK = load the FOLDER version (your local state is copied to backup/ first)\nCancel = KEEP your local edits and write them to the folder');
            if (keepLocal) {
                await KB.store.saveAll();
                KB.app.updateFolderChip();
                return;
            }
        }
        await KB.store.loadAll();
        KB.filters.renderFilterTree();
        KB.state.taskIndex = Math.min(KB.settings.taskOnDisplayId || 0, KB.state.tasks.length - 1);
        KB.emit('task-shown');
    }
    KB.app.updateFolderChip();
};

/* ---------------- import / export ---------------- */
KB.app.importTasks = async function () {
    const f = await KB.store.pickTextFile('.txt');
    if (!f) return;
    const tasks = KB.formats.parseVocabulary(f.text);
    if (!tasks.length) { alert('No tasks found in ' + f.name); return; }
    const add = confirm('How shall I treat the ' + tasks.length + ' tasks to load?\n\nOK = Add to existing   ·   Cancel = Override all');
    KB.state.tasks = add ? KB.state.tasks.concat(tasks) : tasks;
    KB.state.taskIndex = 0;
    KB.markDirty();
    KB.tree.matchAll(); KB.tree.render();
    KB.store.saveAll();
    KB.emit('task-shown');
};

KB.app.exportTasks = function () {
    const selected = KB.shownTasks();
    if (!selected.length) { alert('Nothing selected.'); return; }
    if (selected.length === KB.state.tasks.length && !confirm('Export all tasks?')) return;
    const name = prompt('File name:', 'give_name_here.txt');
    if (!name) return;
    KB.store.download(name, KB.formats.serializeVocabulary(selected));
};

KB.app.importKaimbo = async function () {
    const f = await KB.store.pickTextFile('.kaimbo');
    if (!f) return;
    if (!KB.store.dir) { alert('Connect the data folder first — the .kaimbo manifest references files inside it.'); return; }
    for (const entry of KB.formats.parseKaimboManifest(f.text)) {
        const file = entry.split('/').pop();
        const text = await KB.store.readTextFile(KB.store.dir, file);
        if (text === null) { KB.dbg('.kaimbo: ' + file + ' not found'); continue; }
        if (file.endsWith('.txt')) KB.state.tasks = KB.state.tasks.concat(KB.formats.parseVocabulary(text));
        else if (file.endsWith('.pnk')) {
            const sub = KB.formats.buildTree(KB.formats.parsePnk(text));
            if (sub.root) KB.tree.graftCopy(sub.root, KB.tree.root());
        }
    }
    KB.markDirty();
    KB.tree.afterMutation();
    KB.emit('task-shown');
};

KB.app.deleteSelected = function () {
    const n = KB.numberSelected();
    if (!n) return;
    if (!confirm("Really delete all " + n + " selected Tasks? (Can't be undone)")) return;
    KB.state.tasks = KB.state.tasks.filter(t => !t.selected);
    KB.state.taskIndex = 0;
    KB.selectAll(true);
    KB.markDirty();
    KB.tree.matchAll(); KB.tree.render();
    KB.store.saveAll();
    KB.emit('task-shown');
};

/* ---------------- select / modi ---------------- */
KB.app.showNotLearned = function () {
    const lang = KB.settings.masterLanguage;
    if (!KB.state.tasks.some(t => KB.reps(t, lang) > 0)) { alert('Nothing to repeat!'); return; }
    KB.filters.apply('Show not learned');
};

KB.app.toggleRandom = function () {
    KB.settings.randomMode = !KB.settings.randomMode;
    if (KB.settings.randomMode) {
        KB.state.tasks = KB.shuffled(KB.state.tasks);
        KB.state.taskIndex = Math.floor(Math.random() * KB.state.tasks.length);
    } else {
        KB.state.taskIndex = 0;
    }
    KB.saveSettings();
    KB.emit('task-shown');
};

/* ---------------- flexi language chooser ---------------- */
KB.app.flexiChooser = async function () {
    let langs = [
        ['french', 'fr', 'fr-FR'], ['dutch', 'nl', 'nl-NL'], ['japanese', 'ja', 'ja-JP'],
        ['korean', 'ko', 'ko-KR'], ['portugese', 'pt', 'pt-BR'], ['swedish', 'sv', 'sv-SE'],
        ['turkish', 'tr', 'tr-TR'], ['russian', 'ru', 'ru-RU'], ['polish', 'pl', 'pl-PL'],
        ['greek', 'el', 'el-GR'], ['arabic', 'ar', 'ar-SA'], ['chinese', 'zh', 'zh-CN']
    ];
    // prefer Doc's SupportedLanguages.txt when the folder is connected
    if (KB.store.dir) {
        const txt = await KB.store.readTextFile(KB.store.dir, 'SupportedLanguages.txt');
        if (txt) {
            const parsed = txt.split(/\r?\n/)
                .filter(l => l.trim() && !l.trim().startsWith('//'))
                .map(l => l.split(',').map(p => p.trim()))
                .filter(p => p.length >= 2)
                .map(p => [p[0].toLowerCase(), p[1], p[2] || '']);
            if (parsed.length) langs = parsed;
        }
    }
    const el = document.getElementById('modal');
    el.innerHTML = '<div class="card"><div class="card-title">CHOOSE FLEXIBLE LANGUAGE</div>' +
        '<div class="card-body" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px">' +
        langs.map(([name, short, voice]) =>
            '<button class="btn secondary" style="font-family:var(--font-ui);font-size:13px' +
            (name === KB.settings.sFlexiLanguageID ? ';background:var(--nice-green);color:#fff' : '') +
            (voice.includes('-') ? ';font-weight:600' : '') + '" data-l="' + KB.escapeHtml(name) +
            '" data-s="' + KB.escapeHtml(short) + '" data-v="' + KB.escapeHtml(voice) + '">' +
            KB.escapeHtml(name.toUpperCase()) + (voice.includes('-') ? ' 🔊' : '') + '</button>').join('') +
        '</div><div class="btn-row"><button class="btn secondary" id="fx-close">Close (Esc)</button></div></div>';
    el.classList.remove('hidden');
    el.querySelectorAll('[data-l]').forEach(b => b.addEventListener('click', () => {
        KB.settings.sFlexiLanguageID = b.dataset.l;
        KB.settings.sFlexiLanguageShort = b.dataset.s;
        KB.settings.sFlexiLanguageVoice = b.dataset.v || (b.dataset.s + '-' + b.dataset.s.toUpperCase());
        KB.saveSettings();
        el.classList.add('hidden');
        KB.emit('task-shown');
    }));
    document.getElementById('fx-close').onclick = () => el.classList.add('hidden');
    el.onclick = e => { if (e.target === el) el.classList.add('hidden'); };
};

/* ---------------- translate settings ---------------- */
KB.app.translateSettings = function () {
    const key = prompt(
        'Google Translate API key (optional).\nEmpty = free MyMemory service.\nThe key is stored ONLY in this browser (localStorage), never in any file.',
        KB.settings.googleKey || '');
    if (key === null) return;
    KB.settings.googleKey = key.trim();
    KB.saveSettings();
};

/* ---------------- debug window ---------------- */
KB.app.toggleDbg = function () {
    const el = document.getElementById('dbg-win');
    if (!el.classList.contains('hidden')) { el.classList.add('hidden'); return; }
    el.innerHTML = '<div class="fw-title"><span>DEBUG</span><button class="fw-close" id="dbg-close">✕</button></div>' +
        '<div id="dbg-log"></div>';
    el.classList.remove('hidden');
    el.style.left = '20px'; el.style.bottom = '40px'; el.style.top = 'auto';
    document.getElementById('dbg-log').textContent = KB.dbgLines.join('\n');
    document.getElementById('dbg-close').onclick = () => el.classList.add('hidden');
    KB.app.makeDraggable(el);
};

/* ---------------- help page ---------------- */
KB.app.renderHelp = function () {
    const rows = [
        ['Esc', 'Cascade: stop editing → clear search → back to “Show all” → close windows'],
        ['↑ / ↓', 'Previous / next task (skips filtered-out tasks, wraps around)'],
        ['Enter', 'Next task (while covered)'],
        ['1…9 (search field)', 'Jump to task number'],
        ['Typing (search field)', 'Live search in the master language, ↑/↓ walks the suggestions'],
        ['Backspace', 'Delete current task (with confirmation)'],
        ['Ctrl+N / Ctrl+E', 'New task dialog / edit task dialog'],
        ['Ctrl+S', 'Save vocabulary and topics (folder + browser)'],
        ['Ctrl+C', 'Cover / uncover the master language (typing quiz)'],
        ['Ctrl+I', 'Toggle “needs new image” flag'],
        ['Ctrl+O', 'Show / hide the ontology sidebar'],
        ['Ctrl+P', 'Spaced-repetition statistics'],
        ['Ctrl+R', 'Voice recorder'],
        ['Ctrl+H', 'This help page'],
        ['Ctrl+L', 'Debug window'],
        ['Ctrl+A', 'About Kaimbo'],
        ['Alt+S', 'Phone simulator'],
        ['Alt+←→↑↓', 'Pan the task image (with Ctrl: bigger steps)'],
        ['Alt+] / Alt+/', 'Zoom the task image in / out'],
        ['Alt+R', 'Reset image zoom and pan'],
        ['Ctrl+V / drop', 'Paste or drop an image into the current task']
    ];
    const mouse = [
        ['Click on a task row', 'Open LEO dictionary for that text'],
        ['Shift+Click', 'Reverso context examples'],
        ['Ctrl+Click', 'Google translate'],
        ['Alt+Click', 'Reverso verb conjugator'],
        ['Cmd+Click', 'Google image search'],
        ['Right-click row', 'Context menu (all lookups, Pixabay/Unsplash, corrections)'],
        ['Left edge of a row', 'Make that language the master language'],
        ['Tree: click box', 'AND filter (green) — right-click box: OR filter (blue)'],
        ['Tree: click label', 'Select topic and push its text into the search'],
        ['Tree: Shift+Click label', 'New child topic named after the current task'],
        ['Empty canvas click', 'Hide / show the text rows']
    ];
    const table = rows => '<table>' + rows.map(([a, b]) => '<tr><td>' + a + '</td><td>' + b + '</td></tr>').join('') + '</table>';
    document.getElementById('help-pane').innerHTML =
        '<p style="margin:4px 0 10px 0"><a href="manualito.html" target="_blank" ' +
        'style="color:var(--nice-lightblue);font-size:14.5px">📖 Manualito — die Kurzanleitung (neuer Tab)</a></p>' +
        '<h2>KEYBOARD</h2>' + table(rows) + '<h2>MOUSE</h2>' + table(mouse) +
        '<h2>DATA</h2><p style="font-size:13.5px;max-width:640px;line-height:1.6">All data is stored in the browser ' +
        '(localStorage) in the ORIGINAL formats — and, when the DataLearnLanguages folder is connected, saved ' +
        'directly to <b>Vocabulary.txt</b> / <b>mytopics.pnk</b> with timestamped copies in <b>backup/</b>, fully ' +
        'compatible with the Java desktop app. Images and sounds are read from <b>images/</b> and <b>sounds/</b>.</p>';
};

/* ---------------- global keyboard ---------------- */
KB.app.initKeyboard = function () {
    document.addEventListener('keydown', e => {
        if (KB.sim.open) { if (KB.sim.handleKey(e)) { e.preventDefault(); return; } }
        if (KB.recorder.visible && KB.recorder.handleKey(e)) { e.preventDefault(); return; }
        const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
        const mod = e.ctrlKey && !e.metaKey;
        // shortcuts that also work while a field has focus
        if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); KB.store.saveAll(); return; }
        if (mod && e.key.toLowerCase() === 'l') { e.preventDefault(); KB.app.toggleDbg(); return; }
        if (inField) return;
        // tree pane focused?
        if (document.activeElement.id === 'topic-tree' && KB.tree.handleKey(e)) return;
        if (mod) {
            switch (e.key.toLowerCase()) {
                case 'n': e.preventDefault(); KB.dialog.openNew(); return;
                case 'e': e.preventDefault(); KB.dialog.openEdit(); return;
                case 'c': case 't': e.preventDefault(); KB.learning.toggleCover(); return;
                case 'i': {
                    e.preventDefault();
                    const t = KB.currentTask();
                    if (t) { t.needNewImage = !t.needNewImage; KB.markDirty(); KB.emit('task-shown'); }
                    return;
                }
                case 'o': e.preventDefault(); KB.app.toggleSidebar(); return;
                case 'p': e.preventDefault(); KB.stats.toggle(); return;
                case 'r': e.preventDefault(); KB.recorder.toggle(); return;
                case 'h': e.preventDefault(); KB.app.showPane('content-tabs', 'help-pane'); return;
                case 'a': e.preventDefault(); alert('KAIMBO STUDIO — web port. Formats compatible with the Java desktop app.'); return;
            }
        }
        // Alt combos match on e.code — macOS composes Option+letter into ß/®/… in e.key
        if (e.altKey && e.code === 'KeyS') { e.preventDefault(); KB.sim.toggle(); return; }
        if (KB.learning.adjustImage(e)) return;
        switch (e.key) {
            case 'ArrowUp': e.preventDefault(); KB.step(-1); return;
            case 'ArrowDown': e.preventDefault(); KB.step(1); return;
            case 'Enter': if (KB.state.covered) { e.preventDefault(); KB.step(1); } return;
            case 'Backspace': e.preventDefault(); KB.learning.deleteCurrent(); return;
            case 'Escape': e.preventDefault(); KB.app.escCascade(); return;
        }
        // letters and digits route into the search line, like the original canvas capture
        if (/^[\p{L}\d]$/u.test(e.key) && !e.altKey && !mod && !e.metaKey) {
            const inp = document.getElementById('search-line');
            inp.focus();
        }
    });
};

KB.app.escCascade = function () {
    if (!document.getElementById('ctx-menu').classList.contains('hidden')) { KB.app.hideContextMenu(); return; }
    if (KB.dialog.isOpen()) { KB.dialog.close(); return; }
    if (KB.stats.visible) { KB.stats.hide(); return; }
    if (KB.state.covered) { KB.learning.toggleCover(); return; }
    if (KB.search.el().value) { KB.search.clear(); return; }
    if (KB.settings.showStatus !== KB.SHOW_ALL || KB.numberSelected() < KB.state.tasks.length) {
        KB.filters.apply('Show all');
        KB.tree.deselectAll();
        return;
    }
    KB.dbg('Esc: nothing to close (the desktop app would ask “Quit program?” here)');
};

/* ---------------- boot ---------------- */
KB.app.boot = async function () {
    KB.dbg('kaimbo studio web — booting');
    KB.app.buildMenus();
    KB.app.initTabs();
    KB.app.initSplitter();
    KB.app.initKeyboard();
    KB.search.init();
    KB.learning.init();
    KB.filters.renderFilterTree();
    KB.filters.renderSpecialPanel();
    document.getElementById('folder-chip').addEventListener('click', () => KB.app.connectFolder());
    KB.on('master-changed', () => { KB.app.buildMenus(); KB.filters.renderFilterTree(); });
    KB.on('selection-changed', () => {
        if (document.getElementById('tasklist-pane').classList.contains('active')) KB.table.render();
    });

    await KB.store.init();
    await KB.store.loadAll();
    KB.app.updateFolderChip();

    KB.state.taskIndex = Math.min(KB.settings.taskOnDisplayId || 0, Math.max(0, KB.state.tasks.length - 1));
    // startup like the original: if repetitions are due, jump into “Show not learned”
    if (KB.countDueToday(KB.settings.masterLanguage) > 0 &&
        KB.state.tasks.some(t => KB.reps(t, KB.settings.masterLanguage) > 0)) {
        KB.filters.apply('Show not learned');
    } else {
        KB.emit('task-shown');
    }
    KB.updateStatus();

    // persistence safety nets
    window.addEventListener('beforeunload', () => { KB.saveSettings(); });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && KB.state.dirty) KB.store.saveAll();
    });
};

document.addEventListener('DOMContentLoaded', KB.app.boot);
