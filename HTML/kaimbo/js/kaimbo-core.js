/* ============================================================
   KAIMBO core — namespace, constants, data model, spaced
   repetition, selection helpers, event bus, settings, status.

   Data model uses the EXACT Java field names of LanguageTask /
   Topic so the Vocabulary.txt / .pnk round-trip stays faithful.
   ============================================================ */
'use strict';

const KB = window.KB = {};

/* ---------------- debug window (Doc rule: logs go to a debug window) ---------------- */
KB.dbgLines = [];
KB.dbg = function (msg) {
    const line = new Date().toTimeString().slice(0, 8) + '  ' + msg;
    KB.dbgLines.push(line);
    if (KB.dbgLines.length > 400) KB.dbgLines.shift();
    const el = document.getElementById('dbg-log');
    if (el) { el.textContent = KB.dbgLines.join('\n'); el.scrollTop = el.scrollHeight; }
};

/* ---------------- event bus ---------------- */
KB.listeners = {};
KB.on = (ev, fn) => { (KB.listeners[ev] = KB.listeners[ev] || []).push(fn); };
KB.emit = (ev, arg) => { (KB.listeners[ev] || []).forEach(fn => { try { fn(arg); } catch (e) { KB.dbg('ERR in ' + ev + ': ' + e.message); } }); };

/* ---------------- languages ---------------- */
// Fixed four + configurable flexi slot (historically french).
// cap = infix used in the Java field names (lastLearned<Cap>InMillis ...).
KB.LANGS = ['german', 'italian', 'spanish', 'english', 'flexi'];
KB.LANG_META = {
    german:  { cap: 'German',  code: 'DE', voice: 'de-DE' },
    italian: { cap: 'Italian', code: 'IT', voice: 'it-IT' },
    spanish: { cap: 'Spanish', code: 'ES', voice: 'es-ES' },
    english: { cap: 'English', code: 'EN', voice: 'en-GB' },
    flexi:   { cap: 'Flexi',   code: 'FR', voice: 'fr-FR' }   // code/voice follow settings.flexi*
};

KB.flexiCode = () => (KB.settings.sFlexiLanguageShort || 'fr').toUpperCase();
KB.flexiVoice = () => KB.settings.sFlexiLanguageVoice || 'fr-FR';
KB.langCode = l => l === 'flexi' ? KB.flexiCode() : KB.LANG_META[l].code;
KB.langVoice = l => l === 'flexi' ? KB.flexiVoice() : KB.LANG_META[l].voice;
// Display name of a language ('flexi' resolves to e.g. 'french')
KB.langName = l => l === 'flexi' ? (KB.settings.sFlexiLanguageID || 'french') : l;

/* field accessors on the flat Java-named task object */
KB.txt = (t, l) => t[l];
KB.setTxt = (t, l, v) => { t[l] = v; };
KB.reps = (t, l) => t[l + 'Repeats'];
KB.setReps = (t, l, v) => { t[l + 'Repeats'] = Math.max(0, v); };
KB.lastLearned = (t, l) => t['lastLearned' + KB.LANG_META[l].cap + 'InMillis'];
KB.setLastLearned = (t, l, v) => { t['lastLearned' + KB.LANG_META[l].cap + 'InMillis'] = v; };
KB.learnLevel = (t, l) => t['learnLevel' + KB.LANG_META[l].cap + 'InDays'];
KB.setLearnLevel = (t, l, v) => { t['learnLevel' + KB.LANG_META[l].cap + 'InDays'] = v; };

/* ---------------- task factory ---------------- */
KB.PLACEHOLDER_IMAGE = './DataLearnLanguages/images/Find me an image 2.jpg';

KB.newTask = function () {
    const now = Date.now();
    return {
        selected: true,
        averageErrorLevel: 4,
        backgroundImageName: KB.PLACEHOLDER_IMAGE,
        zoom: 1.0, right: 0, down: 0,
        needNewImage: false,
        hasInfo: false,
        // per-language blocks — constructor defaults of the Java original
        german: '-',  germanRepeats: 0,  lastLearnedGermanInMillis: now,  learnLevelGermanInDays: 0,
        italian: '-', italianRepeats: 2, lastLearnedItalianInMillis: now, learnLevelItalianInDays: 0,
        spanish: '-', spanishRepeats: 4, lastLearnedSpanishInMillis: now, learnLevelSpanishInDays: 0,
        english: '-', englishRepeats: 2, lastLearnedEnglishInMillis: now, learnLevelEnglishInDays: 0,
        flexi: '-',   flexiRepeats: 4,   lastLearnedFlexiInMillis: now,   learnLevelFlexiInDays: 0
    };
};

KB.hasNoImage = t => (t.backgroundImageName || '').includes('Find me an image');

/* ---------------- spaced repetition (ladder 0-1-2-4-7-14-60-180 days) ---------------- */
KB.LADDER = [0, 1, 2, 4, 7, 14, 60, 180];

// off-ladder values (hand-edited files, old data) snap to the nearest step
// instead of freezing forever like the Java indexOf did
KB.incLearnLevel = function (task, lang) {
    const cur = KB.learnLevel(task, lang);
    const next = KB.LADDER.find(v => v > cur);
    KB.setLearnLevel(task, lang, next !== undefined ? next : KB.LADDER[KB.LADDER.length - 1]);
};

KB.decLearnLevel = function (task, lang) {
    const cur = KB.learnLevel(task, lang);
    const lower = KB.LADDER.filter(v => v < cur);
    KB.setLearnLevel(task, lang, lower.length ? lower[lower.length - 1] : 0);
};

// day-level rounding like MyDateHelpers.compareDatesOnDayLevel
KB.midnight = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };

KB.isDueToday = function (task, lang) {
    const next = KB.lastLearned(task, lang) + KB.learnLevel(task, lang) * 86400000;
    return KB.midnight(next) <= KB.midnight(Date.now());
};

KB.countDueToday = lang => KB.state.tasks.filter(t => KB.isDueToday(t, lang)).length;

KB.dateString = ms => { const d = new Date(ms); return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear(); };

/* ---------------- state ---------------- */
KB.SHOW_ALL = 201; KB.SHOW_LEARNED = 202; KB.SHOW_NOTLEARNED = 203;

KB.state = {
    tasks: [],            // array of task objects (flat Java field names)
    taskIndex: 0,         // taskOnDisplayId
    covered: false,
    drawData: true,
    editing: false,
    dirty: false
};

/* ---------------- settings (replaces .KaimboSettings.bin — JSON, NO password) ---------------- */
KB.SETTINGS_KEY = 'kaimbo.settings';

KB.defaultSettings = () => ({
    randomMode: false,
    dividerLocation: 300,
    showOntology: true,
    taskOnDisplayId: 0,
    showStatus: KB.SHOW_ALL,
    showNewbie: false,
    sFlexiLanguageSpeakerName: 'Michael',
    showGerman: true, showItalian: true, showSpanish: true, showEnglish: true, showFlexi: true,
    sFlexiLanguageID: 'french', sFlexiLanguageShort: 'fr', sFlexiLanguageVoice: 'fr-FR',
    masterLanguage: 'italian',
    showAggregated: true,
    googleKey: ''         // optional user-entered Translate key — localStorage only, never in code
});

KB.loadSettings = function () {
    try {
        KB.settings = Object.assign(KB.defaultSettings(), JSON.parse(localStorage.getItem(KB.SETTINGS_KEY) || '{}'));
    } catch (e) { KB.settings = KB.defaultSettings(); }
};

KB.saveSettings = function () {
    KB.settings.taskOnDisplayId = KB.state.taskIndex;
    localStorage.setItem(KB.SETTINGS_KEY, JSON.stringify(KB.settings));
};

/* ---------------- selection / filters (MyArrayList semantics) ---------------- */
KB.shownTasks = () => KB.state.tasks.filter(t => t.selected);
KB.numberSelected = () => KB.shownTasks().length;

KB.selectAll = function (on = true) { KB.state.tasks.forEach(t => { t.selected = on; }); };

// 'learned' = repeats of the master language == 0.
// Java hardcoded italianRepeats here; the port parameterizes by master
// language (default master = italian → identical behavior). Documented deviation.
KB.selectLearned = function (lang) { KB.state.tasks.forEach(t => { t.selected = KB.reps(t, lang) === 0; }); };
KB.selectNotLearned = function (lang) { KB.state.tasks.forEach(t => { t.selected = KB.reps(t, lang) > 0; }); };
KB.selectDueToday = function (lang) { KB.state.tasks.forEach(t => { t.selected = KB.isDueToday(t, lang); }); };
KB.selectNoImage = function () { KB.state.tasks.forEach(t => { t.selected = KB.hasNoImage(t); }); };
KB.selectNeedImage = function () { KB.state.tasks.forEach(t => { t.selected = !!t.needNewImage; }); };
KB.selectHasInfo = function () { KB.state.tasks.forEach(t => { t.selected = !!t.hasInfo; }); };
KB.selectUnclassified = function () { KB.state.tasks.forEach(t => { t.selected = !(t._topics && t._topics.length); }); };
KB.selectNoSound = function () { KB.state.tasks.forEach(t => { t.selected = !(t._hasSound > 0); }); };
KB.selectLearnLevel = function (days, lang) { KB.state.tasks.forEach(t => { t.selected = KB.learnLevel(t, lang) === days; }); };

/* task<->topic matching: topic text vs english, whole string or any token,
   delimiters "!,.-?: " — case-insensitive exact equality (no substring). */
KB.TOKEN_RE = /[!,.\-?:\s]+/;
KB.taskMatchesWord = function (task, word) {
    const w = word.toLowerCase(), en = (task.english || '').toLowerCase();
    if (en === w) return true;
    return en.split(KB.TOKEN_RE).some(tok => tok === w);
};

/* ---------------- navigation ---------------- */
KB.currentTask = function () {
    const s = KB.state;
    if (!s.tasks.length) return null;
    s.taskIndex = Math.min(Math.max(0, s.taskIndex), s.tasks.length - 1);
    return s.tasks[s.taskIndex];
};

// advance skipping unselected, wrap-around, size-bounded guard
KB.step = function (dir) {
    const s = KB.state, n = s.tasks.length;
    if (!n || !KB.numberSelected()) return;
    let i = s.taskIndex;
    for (let g = 0; g < n; g++) {
        i = (i + dir + n) % n;
        if (s.tasks[i].selected) { s.taskIndex = i; break; }
    }
    KB.emit('task-shown');
};

KB.showTask = function (i) {
    KB.state.taskIndex = Math.min(Math.max(0, i), Math.max(0, KB.state.tasks.length - 1));
    KB.emit('task-shown');
};

// jump to the n-th SHOWN task (1-based), like typing a number in the original
KB.jumpToShown = function (num) {
    const shown = KB.shownTasks();
    if (!shown.length) return;
    const target = shown[Math.min(Math.max(1, num), shown.length) - 1];
    KB.state.taskIndex = KB.state.tasks.indexOf(target);
    KB.emit('task-shown');
};

/* ---------------- status line (replaces the Swing frame title) ---------------- */
KB.updateStatus = function () {
    const s = KB.state, el = document.getElementById('status-text');
    let msg;
    if (!s.tasks.length) {
        msg = 'No tasks are loaded. Go to Menu — File | Import tasks …';
    } else if (!KB.numberSelected()) {
        msg = 'No task out of ' + s.tasks.length + ' is shown';
    } else {
        const shown = KB.shownTasks();
        const pos = shown.indexOf(KB.currentTask());
        msg = 'Task on display: ' + (pos + 1) + '   Shown: ' + shown.length + '   All: ' + s.tasks.length;
        if (KB.settings.randomMode) msg += '   random mode';
        if (KB.state.dirty) msg += '   ●';
    }
    if (el) el.textContent = msg;
    document.title = 'KAIMBO STUDIO';
    // repeats-due badge
    const due = KB.countDueToday(KB.settings.masterLanguage);
    const badge = document.getElementById('repeat-badge');
    if (badge) {
        badge.classList.remove('hidden');
        badge.classList.toggle('none', due === 0);
        badge.textContent = due === 0 ? 'nothing to repeat' : due + ' to repeat';
    }
};

KB.markDirty = function () { KB.state.dirty = true; KB.updateStatus(); };

/* ---------------- misc helpers ---------------- */
KB.escapeHtml = s => String(s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

KB.uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    }));

// Fisher-Yates on a copy (replaces the Java swap-storm shuffle)
KB.shuffled = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// 4-letter base-26 'sorting' keys (LetterCombiGenerator.next) — 'aaaa' = 0
KB.letterCombi = function (pos) {
    if (pos < 0 || pos >= 26 ** 4) return '----';
    let s = '';
    for (let d = 3; d >= 0; d--) s += String.fromCharCode(97 + (Math.floor(pos / 26 ** d) % 26));
    return s;
};

KB.loadSettings();
