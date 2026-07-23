/* ============================================================
   MATHTRAINER core — state, settings (localStorage JSON instead
   of the Java binary ObjectOutputStream), the 4 color schemes,
   helpers. All field names follow the Java original.
   ============================================================ */
'use strict';

const MT = window.MT = {};

MT.dbg = msg => console.log('[MT] ' + msg);

/* ---------------- constants ---------------- */
MT.MATHEMATICS = 0;
MT.DROPPED = 2;

MT.OPS = ['multiply', 'divide', 'plus', 'minus'];          // Java Operations order
MT.OP_GLYPH = { plus: ' + ', minus: ' − ', multiply: ' × ', divide: ' ÷ ' };
MT.OP_CLASS = { plus: 'on-plus', minus: 'on-minus', multiply: 'on-mul', divide: 'on-div' };
MT.OP_COLOR = { plus: 'cyan', minus: 'rgb(178,0,0)', multiply: 'rgb(0,255,0)', divide: 'orange' };

// ColorSheme: [background, fgDark, fgLight]
MT.SCHEMES = [
    ['lightgray', 'darkgray', 'lightgray'],
    ['darkgray', 'white', 'lightgray'],
    ['rgb(0,0,40)', 'orange', 'lightgray'],
    ['rgb(0,0,40)', 'rgb(113,197,37)', 'white']
];

MT.COUNTDOWN_FROM = 10;

/* ---------------- settings ---------------- */
MT.SETTINGS_KEY = 'mathtrainer.settings';

MT.defaultSettings = () => ({
    colorSchemeId: 2,
    numberTasksPerStudent: 3,
    transparency: 0.5,
    fontSizeNumbers: 180,
    soundVolume: 0.5,
    playMusic: false,
    // deviation (documented): Java never initialized these — all OFF on first run.
    // Here all four operations default ON.
    operations: { multiply: true, divide: true, plus: true, minus: true },
    taskType: MT.MATHEMATICS,
    actualTeam: 0,
    countdownMode: true,
    playQuestion: false,
    drawNames: true,
    showAllNames: true,
    nameLearning: false,
    series: { 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true, 9: true },
    limitedToSelectedSeries: false,
    lastTaskName: '',          // display name of the loaded task file
    lastTasks: [],             // parsed [question, answer] pairs persisted inline
    youtubeMusicId: 'SKEFN9XNlyY'   // Frozen (Boral Kibil Remix) — IS Doc's local 8:06 WAV (r=0.999 verified)
});

MT.loadSettings = function () {
    try {
        const raw = JSON.parse(localStorage.getItem(MT.SETTINGS_KEY) || '{}');
        MT.settings = Object.assign(MT.defaultSettings(), raw);
        MT.settings.operations = Object.assign(MT.defaultSettings().operations, raw.operations || {});
        MT.settings.series = Object.assign(MT.defaultSettings().series, raw.series || {});
        // migration: earlier defaults → the verified Boral Kibil Remix (identical to the local WAV)
        if (['XS088Opj9o0', 'IDd2QEpxUB8'].includes(MT.settings.youtubeMusicId)) MT.settings.youtubeMusicId = 'SKEFN9XNlyY';
    } catch (e) { MT.settings = MT.defaultSettings(); }
};

MT.saveSettings = function () {
    localStorage.setItem(MT.SETTINGS_KEY, JSON.stringify(MT.settings));
};

/* ---------------- runtime state ---------------- */
MT.state = {
    splash: true,              // 'beginning'
    taskIndex: -1,             // current task (0-based)
    showingAnswer: false,      // question/answer alternation (Java iterationCount parity)
    finished: false,
    page: null,                // 'help' | 'students' | 'series' | 'end' | 'picker' | null
    drawTask: true,            // key A
    penalty: 0,                // seconds
    timerStart: 0,
    finalDeltaT: 0,
    countdown: -1,             // -1 = hidden
    countdownTimer: null,
    stopwatchTimer: null,
    wrongPressed: false        // set by → so the reveal does not count as a right solution
};

MT.applyScheme = function () {
    const [bg, dark, light] = MT.SCHEMES[MT.settings.colorSchemeId % 4];
    const r = document.documentElement.style;
    r.setProperty('--bg', bg);
    r.setProperty('--fg-dark', dark);
    r.setProperty('--fg-light', light);
    r.setProperty('--font-numbers', MT.settings.fontSizeNumbers + 'px');
    const ov = document.getElementById('bg-overlay');
    if (ov) ov.style.opacity = MT.settings.transparency;
};

/* ---------------- helpers ---------------- */
MT.escapeHtml = s => String(s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

MT.shuffled = function (arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

MT.toast = function (msg, ms = 1800) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(MT._toastTimer);
    MT._toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
};

MT.timeString = function (ms) {
    const s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};

MT.loadSettings();
