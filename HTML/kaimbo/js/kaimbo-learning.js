/* ============================================================
   KAIMBO learning view — the main canvas: one task at a time,
   background image with per-task pan/zoom, one row per enabled
   language (auto-fitted font), master selection, cover mode
   with the typing quiz (color feedback + spaced repetition),
   corner hotspots, dictionary/browser modifier actions,
   clipboard/drag-drop image import, per-task info notes.
   ============================================================ */
'use strict';

KB.learning = {
    quiz: { wrongState: false, errorCount: 0, solved: false, advanceTimer: null },
    coverStore: {},
    _gen: 0
};

const $stage = () => document.getElementById('stage');

KB.learning.init = function () {
    const stage = $stage();
    document.getElementById('hot-delete').addEventListener('click', () => KB.learning.deleteCurrent());
    document.getElementById('hot-new').addEventListener('click', () => KB.dialog.openNew());
    document.getElementById('hot-info').addEventListener('click', () => KB.learning.openTaskInfo());
    // click on empty canvas toggles the field layer (drawData)
    stage.addEventListener('click', e => {
        if (e.target === stage || e.target.id === 'stage-bg') {
            KB.state.drawData = !KB.state.drawData;
            document.getElementById('lang-rows').style.visibility = KB.state.drawData ? 'visible' : 'hidden';
        }
    });
    // paste image
    document.addEventListener('paste', async e => {
        if (KB.state.editing || KB.dialog.isOpen()) return;
        const item = [...(e.clipboardData || {}).items || []].find(i => i.type.startsWith('image/'));
        if (item) {
            const task = KB.currentTask();
            if (task) { await KB.store.saveImage(task, item.getAsFile()); KB.emit('task-shown'); }
        }
    });
    // drag & drop image (the desktop app had only a stub — finished here);
    // window-level guards keep an off-target drop from navigating the tab away
    window.addEventListener('dragover', e => e.preventDefault());
    window.addEventListener('drop', e => e.preventDefault());
    stage.addEventListener('drop', async e => {
        e.preventDefault();
        const f = [...e.dataTransfer.files].find(f => f.type.startsWith('image/'));
        const task = KB.currentTask();
        if (f && task) { await KB.store.saveImage(task, f); KB.emit('task-shown'); }
    });
    window.addEventListener('resize', () => KB.learning.fitFonts());
    KB.on('task-shown', () => KB.learning.show());
    KB.on('selection-changed', () => KB.updateStatus());
};

/* ---------------- render current task ---------------- */
KB.learning.show = async function () {
    const gen = ++KB.learning._gen;          // generation token: stale async renders bail out
    const task = KB.currentTask();
    const empty = document.getElementById('empty-state');
    const rowsHost = document.getElementById('lang-rows');
    KB.learning.quiz.wrongState = false;
    KB.learning.quiz.errorCount = 0;
    KB.learning.quiz.solved = false;
    clearTimeout(KB.learning.quiz.advanceTimer);
    KB.updateStatus();
    if (!task || !KB.numberSelected()) {
        empty.classList.remove('hidden');
        rowsHost.innerHTML = '';
        document.getElementById('stage-bg').style.backgroundImage = '';
        document.getElementById('need-image-dot').classList.add('hidden');
        return;
    }
    empty.classList.add('hidden');
    document.getElementById('need-image-dot').classList.toggle('hidden', !task.needNewImage);
    document.getElementById('newbie-line').classList.toggle('hidden', !KB.settings.showNewbie);

    // background image with per-task pan/zoom
    const bg = document.getElementById('stage-bg');
    const url = await KB.store.imageURL(task.backgroundImageName);
    if (gen !== KB.learning._gen) return;    // user advanced while loading
    bg.style.backgroundImage = url ? 'url("' + url.replace(/"/g, '%22') + '")' : '';
    bg.style.transform = 'translate(' + task.right + 'px,' + task.down + 'px) scale(' + task.zoom + ')';

    // language rows
    rowsHost.innerHTML = '';
    rowsHost.style.visibility = KB.state.drawData ? 'visible' : 'hidden';
    for (const lang of KB.LANGS) {
        if (!KB.learning.langShown(lang)) continue;
        const row = await KB.learning.buildRow(task, lang);
        if (gen !== KB.learning._gen) return;
        rowsHost.appendChild(row);
    }
    KB.learning.fitFonts();
    // info hotspot goes green when the task has a note on disk
    const info = await KB.store.readInfo('tasks', task.english);
    if (gen !== KB.learning._gen) return;
    task.hasInfo = !!(info && info.length);
    document.getElementById('hot-info').classList.toggle('has-info', task.hasInfo);
};

KB.learning.langShown = function (lang) {
    return {
        german: KB.settings.showGerman, italian: KB.settings.showItalian,
        spanish: KB.settings.showSpanish, english: KB.settings.showEnglish,
        flexi: KB.settings.showFlexi
    }[lang];
};

const ICONS = {
    play: '<svg viewBox="0 0 24 24"><path d="M5 4l14 8-14 8V4z"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 5V4L8 9H4zm14.5 3l2.8-2.8-1.4-1.4-2.9 2.8-2.8-2.8-1.4 1.4 2.8 2.8-2.8 2.8 1.4 1.4 2.8-2.8 2.9 2.8 1.4-1.4-2.8-2.8z"/></svg>',
    human: '<svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M3 17.2V21h3.8L17.9 9.9l-3.8-3.8L3 17.2zM20.7 7.1a1 1 0 000-1.4l-2.4-2.4a1 1 0 00-1.4 0l-1.8 1.8 3.8 3.8 1.8-1.8z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 7h2v9h-2V9zm0-4h2v2h-2V5z"/></svg>'
};

KB.learning.buildRow = async function (task, lang) {
    const row = document.createElement('div');
    row.className = 'lang-row';
    const isMaster = KB.settings.masterLanguage === lang;
    if (isMaster) row.classList.add('master');
    const covered = KB.state.covered && isMaster;
    if (covered) row.classList.add('covered');

    // left: master box + language code
    const left = document.createElement('div');
    left.className = 'lr-left';
    left.title = 'Set ' + KB.langName(lang) + ' as master language';
    left.innerHTML = '<span class="lr-master-box"></span><span class="lr-code">' + KB.langCode(lang) + '</span>';
    left.addEventListener('click', () => {
        KB.settings.masterLanguage = lang;
        KB.saveSettings();
        KB.emit('master-changed');
        KB.emit('task-shown');
    });
    row.appendChild(left);

    // badges (master row only): due-today, learn level, due date, repeats
    if (isMaster) {
        const due = KB.countDueToday(lang);
        const reps = KB.reps(task, lang);
        const nextDue = KB.lastLearned(task, lang) + KB.learnLevel(task, lang) * 86400000;
        const b = document.createElement('div');
        b.className = 'lr-badges';
        b.innerHTML =
            '<span class="badge ' + (due ? 'due' : 'due-zero') + '" title="Tasks to repeat today">' + (due || '☺') + '</span>' +
            '<span class="badge level" title="Learn level in days">' + KB.learnLevel(task, lang) + 'd</span>' +
            '<span class="badge date" title="Next repetition">' + KB.dateString(nextDue) + '</span>' +
            '<span class="badge ' + (reps === 0 ? 'reps-ok' : 'reps-open') + '" title="Repeats left">' + reps + '</span>';
        row.appendChild(b);
    }

    // center: the text
    const input = document.createElement('input');
    input.className = 'lr-input';
    input.spellcheck = false;
    input.setAttribute('aria-label', KB.langName(lang) + ' text');
    const text = KB.txt(task, lang);
    input.value = covered ? '' : text;
    input.readOnly = !covered;
    input.dataset.lang = lang;
    if (covered) {
        input.placeholder = 'type the ' + KB.langName(lang) + ' text …';
        input.readOnly = false;
        input.addEventListener('input', () => KB.learning.quizCheck(task, lang, input));
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // after a correct answer an auto-advance is pending — Enter must not double-step
                if (KB.learning.quiz.solved) clearTimeout(KB.learning.quiz.advanceTimer);
                KB.step(1);
            }
            e.stopPropagation();
        });
        setTimeout(() => input.focus(), 50);
    } else {
        input.addEventListener('click', e => KB.learning.rowClick(e, task, lang));
        input.addEventListener('dblclick', () => KB.learning.startEditRow(task, lang, input, row));
        input.addEventListener('contextmenu', e => { e.preventDefault(); KB.learning.rowMenu(e, task, lang); });
    }
    row.appendChild(input);

    // right: info / pen / sound
    const right = document.createElement('div');
    right.className = 'lr-right';
    const soundState = await KB.store.soundStatus(task, lang);
    right.innerHTML =
        '<button class="lr-btn" data-a="info" title="Note: needs new sound / remarks">' + ICONS.info + '</button>' +
        '<button class="lr-btn" data-a="edit" title="Edit this text (double-click works too)">' + ICONS.pen + '</button>' +
        '<button class="lr-btn ' + (soundState === 2 ? 'sound-human' : soundState === 0 ? 'sound-none' : '') +
        '" data-a="play" title="' + (soundState === 2 ? 'Play recording' : soundState === 1 ? 'Play sound file' : 'Speak (TTS)') + '">' +
        (soundState === 2 ? ICONS.human : soundState === 0 ? ICONS.mute : ICONS.play) + '</button>';
    right.querySelector('[data-a="play"]').addEventListener('click', () => KB.audio.playTask(task, lang));
    right.querySelector('[data-a="edit"]').addEventListener('click', () => KB.learning.startEditRow(task, lang, input, row));
    right.querySelector('[data-a="info"]').addEventListener('click', e => KB.learning.openRowInfo(e, task, lang));
    row.appendChild(right);
    return row;
};

/* auto-fit: shrink from 40px until the widest of the 4 fixed languages fits (original quirk: flexi not measured) */
KB.learning.fitFonts = function () {
    const task = KB.currentTask();
    if (!task) return;
    const stage = $stage();
    const width = stage.clientWidth - 240;    // minus side chrome of the rows
    if (width <= 0) return;
    const ctx = (KB.learning._mctx = KB.learning._mctx || document.createElement('canvas').getContext('2d'));
    let size = Math.min(40, Math.round(stage.clientHeight / 12));
    const texts = [task.spanish, task.english, task.german, task.italian].map(s => s || '');
    for (; size > 11; size--) {
        ctx.font = size + 'px Arial';
        if (Math.max(...texts.map(t => ctx.measureText(t).width)) <= width - 20) break;
    }
    document.querySelectorAll('.lr-input').forEach(i => { i.style.fontSize = size + 'px'; });
};

/* ---------------- modifier-click browser actions (LEO / Reverso / Google) ---------------- */
KB.learning.rowClick = function (e, task, lang) {
    if (KB.state.editing) return;
    const word = KB.txt(task, lang);
    if (!word || word === '-') return;
    const enc = encodeURIComponent(word);
    const name = KB.langName(lang);
    let url = null;
    if (e.metaKey) {               // Cmd = Google image search (per-language TLD)
        const tld = { italian: 'it', spanish: 'es', german: 'de', english: 'co.uk' }[name] || 'com';
        url = 'https://www.google.' + tld + '/search?q=' + enc + '&source=lnms&tbm=isch';
    } else if (e.ctrlKey) {        // Ctrl = Google translate
        url = 'https://translate.google.com/?sl=auto&tl=de&text=' + enc;
    } else if (e.altKey) {         // Alt = Reverso conjugator
        const m = { italian: 'italienisch', spanish: 'spanisch', german: 'deutsch', english: 'english' }[name];
        if (m) url = 'https://konjugator.reverso.net/konjugation-' + m + '-verb-' + encodeURIComponent(word.toLowerCase()) + '.html';
    } else if (e.shiftKey) {       // Shift = Reverso context examples
        url = 'https://context.reverso.net/%C3%BCbersetzung/' + name + '-deutsch/' + encodeURIComponent(word.toLowerCase());
    } else {                       // plain = LEO dictionary
        const m = { italian: 'italienisch-deutsch', spanish: 'spanisch-deutsch', english: 'englisch-deutsch', french: 'französisch-deutsch' }[name];
        if (m) url = 'https://dict.leo.org/' + m + '/' + enc;
    }
    if (url) window.open(url, '_blank');
};

KB.learning.rowMenu = function (e, task, lang) {
    const word = KB.txt(task, lang);
    const en = encodeURIComponent(task.english === '-' ? '' : task.english);
    KB.app.showContextMenu(e.clientX, e.clientY, [
        ['LEO translate', 'Click', () => KB.learning.rowClick({ }, task, lang)],
        ['Conjugation', 'Alt+Click', () => KB.learning.rowClick({ altKey: true }, task, lang)],
        ['Google translate', 'Ctrl+Click', () => KB.learning.rowClick({ ctrlKey: true }, task, lang)],
        ['Examples', 'Shift+Click', () => KB.learning.rowClick({ shiftKey: true }, task, lang)],
        '-',
        ['Pixabay images', '', () => window.open('https://pixabay.com/de/photos/?q=' + en, '_blank')],
        ['Unsplash images', '', () => window.open('https://unsplash.com/s/photos/' + en, '_blank')],
        ['Google image search', 'Cmd+Click', () => KB.learning.rowClick({ metaKey: true }, task, lang)],
        '-',
        [KB.langName('flexi') + ' needs correction', '', () => KB.learning.flagCorrection(task)],
        '-',
        ['Play sound', '', () => KB.audio.playTask(task, lang)],
        ['Cover / uncover (quiz)', 'Ctrl+C', () => KB.learning.toggleCover()]
    ]);
};

// append english+flexi to <flexiLanguage>_corrections.txt, like the original
KB.learning.flagCorrection = async function (task) {
    const name = KB.langName('flexi');
    const line = task.english + '\n' + task.flexi + '\n';
    if (KB.store.dir) {
        const old = (await KB.store.readTextFile(KB.store.dir, name + '_corrections.txt')) || '';
        await KB.store.writeFile(KB.store.dir, name + '_corrections.txt', old + line);
        KB.dbg('correction noted → ' + name + '_corrections.txt');
    } else {
        KB.store.download(name + '_corrections.txt', line);
    }
};

/* ---------------- inline row editing ---------------- */
KB.learning.startEditRow = function (task, lang, input, row) {
    if (KB.state.covered) return;
    KB.state.editing = true;
    row.classList.add('editing');
    input.readOnly = false;
    input.focus();
    input.select();
    const done = save => {
        KB.state.editing = false;
        row.classList.remove('editing');
        input.readOnly = true;
        if (save) {
            KB.setTxt(task, lang, input.value.trim() || '-');
            KB.markDirty();
            KB.tree.matchAll(); KB.tree.render();
            KB.store.saveAll();
        } else input.value = KB.txt(task, lang);
    };
    input.onkeydown = e => {
        e.stopPropagation();
        if (e.key === 'Enter') { e.preventDefault(); done(true); }
        if (e.key === 'Escape') { e.preventDefault(); done(false); }
    };
    input.onblur = () => { if (KB.state.editing) done(true); };
};

/* ---------------- cover mode + typing quiz ---------------- */
KB.learning.toggleCover = function () {
    const task = KB.currentTask();
    if (!task) return;
    const lang = KB.settings.masterLanguage;
    if (!KB.state.covered) {
        KB.state.covered = true;
    } else {
        KB.state.covered = false;
        // manual uncover counts as a miss: repeats++ and level down if repeats were > 0 (original)
        const r = KB.reps(task, lang);
        KB.setReps(task, lang, r + 1);
        if (r > 0) KB.decLearnLevel(task, lang);
        KB.markDirty();
    }
    KB.emit('task-shown');
};

KB.learning.quizCheck = function (task, lang, input) {
    const target = (KB.txt(task, lang) || '').trim();
    let typed = input.value.replace(/[`´']+$/, '');       // strip trailing accents, like the original
    input.classList.remove('quiz-exact', 'quiz-prefix', 'quiz-inside', 'quiz-wrong');
    const q = KB.learning.quiz;
    if (typed === target) {
        input.classList.add('quiz-exact');
        input.readOnly = true;
        q.solved = true;
        const r = Math.floor(KB.reps(task, lang) / 2);
        KB.setReps(task, lang, r);
        if (r === 0) { KB.incLearnLevel(task, lang); }
        KB.setLastLearned(task, lang, Date.now());
        KB.markDirty();
        KB.store.saveAll();
        q.advanceTimer = setTimeout(async () => {
            await KB.audio.playTask(task, lang);
            KB.step(1);
        }, 500);
        return;
    }
    const lowTarget = target.toLowerCase(), lowTyped = typed.toLowerCase();
    if (lowTarget.startsWith(lowTyped)) {
        input.classList.add('quiz-prefix');
        q.wrongState = false;
    } else if (lowTarget.includes(lowTyped)) {
        input.classList.add('quiz-inside');
        q.wrongState = false;
    } else {
        input.classList.add('quiz-wrong');
        if (!q.wrongState) {                               // count one error per divergence
            q.wrongState = true;
            q.errorCount++;
            KB.audio.dong();
            const r = KB.reps(task, lang);
            KB.setReps(task, lang, r + 1);
            if (q.errorCount > 2) KB.decLearnLevel(task, lang);
            KB.markDirty();
        }
    }
};

/* ---------------- image pan/zoom (Alt+arrows, Alt+] / Alt+/, Alt+R) ---------------- */
KB.learning.adjustImage = function (e) {
    const task = KB.currentTask();
    if (!task || !e.altKey) return false;
    const stepPx = e.ctrlKey ? 20 : 10;
    const stepZoom = e.ctrlKey ? 0.10 : 0.05;
    let done = true;
    // e.code, not e.key: on macOS Option+key composes characters (Option+R = ®)
    switch (e.code) {
        case 'ArrowLeft': task.right -= stepPx; break;
        case 'ArrowRight': task.right += stepPx; break;
        case 'ArrowUp': task.down -= stepPx; break;
        case 'ArrowDown': task.down += stepPx; break;
        case 'BracketRight': task.zoom = +(task.zoom + stepZoom).toFixed(2); break;
        case 'Slash': task.zoom = Math.max(0.1, +(task.zoom - stepZoom).toFixed(2)); break;
        case 'KeyR': task.zoom = 1.0; task.right = 0; task.down = 0; break;
        default: done = false;
    }
    if (done) {
        e.preventDefault();
        const bg = document.getElementById('stage-bg');
        bg.style.transform = 'translate(' + task.right + 'px,' + task.down + 'px) scale(' + task.zoom + ')';
        KB.markDirty();
    }
    return done;
};

/* ---------------- delete / info ---------------- */
KB.learning.deleteCurrent = function () {
    const task = KB.currentTask();
    // only a task that is actually on display may be deleted — never an invisible one
    if (!task || !task.selected || !KB.numberSelected()) return;
    if (!confirm("Really delete selected Task? (Can't be undone)")) return;
    KB.state.tasks.splice(KB.state.tasks.indexOf(task), 1);
    KB.state.taskIndex = Math.min(KB.state.taskIndex, KB.state.tasks.length - 1);
    KB.markDirty();
    KB.tree.matchAll(); KB.tree.render();
    KB.store.saveAll();
    KB.emit('task-shown');
};

// bottom-left hotspot: general task note (pseudo-language 'tasks', flag 'Needs new image')
KB.learning.openTaskInfo = function () {
    const task = KB.currentTask();
    if (!task) return;
    KB.infobox.open({
        language: 'tasks', key: task.english, flagLabel: 'Needs new image',
        flagGet: () => task.needNewImage,
        flagSet: v => { task.needNewImage = v; KB.markDirty(); },
        onSaved: has => { task.hasInfo = has; KB.emit('task-shown'); }
    });
};

// per-row info icon: sound note for that language (flag 'Needs new sound')
KB.learning.openRowInfo = function (e, task, lang) {
    KB.infobox.open({
        language: KB.langName(lang), key: KB.txt(task, lang), flagLabel: 'Needs new sound',
        flagGet: () => false, flagSet: () => { }, onSaved: () => { }
    });
};

/* ---------------- info box (floating note window) ---------------- */
KB.infobox = {};

KB.infobox.open = async function (cfg) {
    const el = document.getElementById('infobox');
    const existing = await KB.store.readInfo(cfg.language, cfg.key) || '';
    let body = existing, flagged = cfg.flagGet();
    // strip the '#<label>' first-line flag from the visible text
    if (body.startsWith('#' + cfg.flagLabel)) {
        flagged = true;
        body = body.split('\n').slice(1).join('\n');
    }
    el.innerHTML =
        '<div class="fw-title"><span>INFO — ' + KB.escapeHtml(cfg.language) + '</span>' +
        '<button class="fw-close" id="ib-close">✕</button></div>' +
        '<textarea id="ib-text" aria-label="Task note" placeholder="Notes …"></textarea>' +
        '<label class="ib-flag"><input type="checkbox" id="ib-flag"> ' + KB.escapeHtml(cfg.flagLabel) + '</label>';
    el.querySelector('#ib-text').value = body;
    el.querySelector('#ib-flag').checked = flagged;
    el.classList.remove('hidden');
    el.style.left = 'calc(50% - 150px)'; el.style.top = '25%';
    KB.app.makeDraggable(el);
    const save = async () => {
        const text = el.querySelector('#ib-text').value;
        const flag = el.querySelector('#ib-flag').checked;
        const content = (flag ? '#' + cfg.flagLabel + '\n' : '') + text;
        await KB.store.writeInfo(cfg.language, cfg.key, content);
        cfg.flagSet(flag);
        cfg.onSaved(content.trim().length > 0);
        el.classList.add('hidden');
    };
    el.querySelector('#ib-close').onclick = save;
    el.onkeydown = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); save(); } };
    el.querySelector('#ib-text').focus();
};
