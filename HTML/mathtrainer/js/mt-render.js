/* ============================================================
   MATHTRAINER render — DOM rendering of every screen: splash,
   task/answer with KaTeX (orange, shrink-to-fit like the
   JLaTeXMath loop), pupil photo+name, countdown square,
   header/status, modal pages (help/students/series/end/picker),
   stopwatch and the operation strip.
   ============================================================ */
'use strict';

MT.render = {};

const $ = id => document.getElementById(id);

/* ---------------- master update ---------------- */
MT.render.update = function () {
    MT.applyScheme();
    MT.render.header();
    MT.render.opStrip();
    $('splash').classList.toggle('hidden', !MT.state.splash);
    $('task-screen').classList.toggle('hidden', MT.state.splash || !!MT.state.page);
    document.getElementById('stage').classList.toggle('name-learning', MT.settings.nameLearning);
    if (MT.state.page) MT.render.page();
    else $('page').classList.add('hidden');
    if (MT.state.splash) MT.render.splash();
    else if (!MT.state.page) MT.render.task();
    MT.render.stopwatch();
};

/* ---------------- splash ---------------- */
MT.render.splash = function () {
    const title = MT.settings.taskType === MT.MATHEMATICS
        ? 'Mathematics'
        : (new Date().getHours() < 12 ? 'Good morning!' : 'Good afternoon!');
    $('splash-title').textContent = title;
    document.title = title + ' — SchoolTrainer by Dr. Michael R. Alvers';
    $('bg-image').style.backgroundImage = '';
};

/* ---------------- header / status bar ---------------- */
MT.render.header = function () {
    $('hdr-left').textContent = MT.people.teamLabel() + ' - ' + MT.people.presentStudents().length + ' Students';
    $('hdr-right').textContent = MT.tasks.total() + ' Tasks';
    $('hdr-limit').classList.toggle('hidden',
        !(MT.settings.limitedToSelectedSeries && MT.settings.taskType === MT.MATHEMATICS));
    $('hdr-file').textContent = (MT.settings.taskType === MT.DROPPED && MT.settings.lastTaskName)
        ? MT.settings.lastTaskName.replace(/\.txt$/, '') : '';
};

MT.render.opStrip = function () {
    const strip = $('op-strip');
    const show = MT.settings.taskType === MT.MATHEMATICS && !MT.state.page;
    strip.classList.toggle('hidden', !show);
    if (!show) return;
    strip.innerHTML = MT.OPS.map(op =>
        '<span data-op="' + op + '" class="' + (MT.settings.operations[op] ? MT.OP_CLASS[op] : '') + '">' +
        { multiply: '×', divide: '÷', plus: '+', minus: '−' }[op] + '</span>').join(' ');
};

/* ---------------- task screen ---------------- */
MT.render._gen = 0;

MT.render.task = async function () {
    const gen = ++MT.render._gen;            // stale async renders (photo/bg I/O) bail out
    const t = MT.tasks.current();
    const taskEl = $('task-area'), solEl = $('solution-area');
    if (!t || MT.state.taskIndex < 0) {
        taskEl.innerHTML = ''; solEl.innerHTML = '';
        $('pupil-name').textContent = '';
        $('pupil-photo').style.backgroundImage = '';
        $('pupil-photo').textContent = '';
        $('task-header').textContent = '';
        return;
    }
    $('task-header').textContent = MT.settings.nameLearning ? 'Learning Names Mode' : 'Task ' + (MT.state.taskIndex + 1);

    // pupil
    const nameShown = MT.settings.showAllNames ? t.name : MT.people.firstName(t.name);
    const nameEl = $('pupil-name');
    nameEl.innerHTML = MT.settings.drawNames ? '<span class="fit">' + MT.escapeHtml(nameShown) + '</span>' : '';
    if (MT.settings.drawNames) MT.render.fit(nameEl);   // long full names shrink on beamers
    const photo = $('pupil-photo');
    if (MT.settings.drawNames) {
        photo.style.display = '';
        const url = await MT.store.photoURL(t.name);
        if (gen !== MT.render._gen) return;
        if (url) { photo.style.backgroundImage = 'url("' + url.replace(/"/g, '%22') + '")'; photo.textContent = ''; }
        else { photo.style.backgroundImage = ''; photo.textContent = '🙂'; }
    } else {
        photo.style.display = 'none';
    }

    // task / answer
    if (!MT.state.drawTask || MT.settings.nameLearning) {
        taskEl.innerHTML = ''; solEl.innerHTML = '';
    } else if (t.type === MT.MATHEMATICS || !MT.tasks.isLatex(t.question)) {
        const text = MT.state.showingAnswer ? (t.answer || '') : (t.question || '');
        const color = t.op ? MT.OP_COLOR[t.op] : 'var(--fg-dark)';
        taskEl.innerHTML = '<span class="fit" style="color:' + color + '">' + MT.escapeHtml(text) + '</span>';
        solEl.innerHTML = '';
        MT.render.fit(taskEl);
    } else {
        // LaTeX task via KaTeX (orange like JLaTeXMath, size 160 → shrink-to-fit)
        const q = MT.tasks.latexInner(t.question);
        const tex = MT.state.showingAnswer && MT.tasks.isLatex(t.answer)
            ? MT.tasks.joinedLatex(t.question, t.answer)
            : q.inner + (q.trail ? ' \\;\\text{' + MT.tasks.texEscapeText(q.trail) + '}' : '') +
              (MT.state.showingAnswer ? ' \\quad \\text{' + MT.tasks.texEscapeText(t.answer || '') + '}' : '');
        taskEl.innerHTML = '<span class="fit" style="font-size:160px"></span>';
        solEl.innerHTML = '';
        try {
            window.katex.render(tex, taskEl.firstChild, { displayMode: true, throwOnError: false });
        } catch (e) {
            taskEl.firstChild.textContent = t.question + (MT.state.showingAnswer ? '   ' + t.answer : '');
        }
        MT.render.fit(taskEl);
    }

    // background image for multiply/divide (matrix [smaller][larger] / [quotient][divisor])
    let bgUrl = null;
    if (t.type === MT.MATHEMATICS && (t.op === 'multiply' || t.op === 'divide') && MT.store.imageList.length) {
        // matrix is [smaller][larger] — Java orders quotient/divisor min/max too
        const a = t.op === 'divide' ? t.n1 / t.n2 : t.n1;
        const b = t.n2;
        bgUrl = await MT.store.backgroundURL(Math.min(a, b), Math.max(a, b));
    }
    if (gen !== MT.render._gen) return;
    $('bg-image').style.backgroundImage = bgUrl ? 'url("' + bgUrl.replace(/"/g, '%22') + '")' : '';
};

// shrink-to-fit: scale down until the content fits 95% of the width
MT.render.fit = function (host) {
    const el = host.querySelector('.fit');
    if (!el) return;
    el.style.transform = '';
    const max = host.clientWidth * 0.95;
    const w = el.scrollWidth;
    if (w > max) el.style.transform = 'scale(' + (max / w) + ')';
};

/* ---------------- countdown ---------------- */
MT.render.countdown = function () {
    const el = $('countdown');
    const c = MT.state.countdown;
    // faithful nuance dropped on purpose: Java hid the countdown together with the
    // pupil name (N key) — here the countdown stays visible whenever it runs
    if (c < 0 || !MT.settings.countdownMode || MT.state.splash || MT.state.page || MT.state.showingAnswer) {
        el.classList.add('hidden');
        return;
    }
    el.classList.remove('hidden');
    el.textContent = c;
    el.classList.toggle('warn', c < 4 && c >= 2);
    el.classList.toggle('hot', c < 2);
};

/* ---------------- stopwatch ---------------- */
MT.render.stopwatch = function () {
    const el = $('stopwatch');
    if (MT.state.splash || !MT.state.timerStart || MT.state.page) { el.textContent = ''; return; }
    const ms = MT.state.finished ? MT.state.finalDeltaT : Date.now() - MT.state.timerStart;
    let s = MT.timeString(ms);
    if (MT.settings.countdownMode && MT.state.penalty > 0) s += ' + ' + MT.state.penalty + ' s penalty';
    el.textContent = s;
};

/* ---------------- modal pages ---------------- */
MT.render.page = function () {
    const page = $('page');
    page.className = '';
    page.classList.remove('hidden');
    switch (MT.state.page) {
        case 'help': MT.render.helpPage(page); break;
        case 'students': MT.render.studentsPage(page); break;
        case 'series': MT.render.seriesPage(page); break;
        case 'end': MT.render.endPage(page); break;
        case 'picker': MT.app.renderPicker(); break;   // rebuild on resize too
    }
};

MT.render.helpPage = function (page) {
    const rows = [
        ['↓ / Space / PageDown', 'Start / next (question → answer → next pupil)'],
        ['→', 'Wrong answer: +10 s penalty, then advance'],
        ['Esc', 'Close pages / back to the training'],
        ['B', 'New game (restart)'],
        ['1', '1 x 1 mathematics mode'],
        ['2', 'Dropped/loaded task files mode'],
        ['O', 'Open a task file (.txt, "question :: answer")'],
        ['Drag & drop', 'Drop a .txt task file anywhere'],
        ['+ / −', 'More / fewer tasks per pupil (Shift: font size)'],
        ['C', 'Countdown on/off'],
        ['E', 'Series page (2er–9er)'],
        ['L', 'Limit 1x1 to the selected series'],
        ['S', 'Students page (presence, counts)'],
        ['N', 'Pupil name & photo on/off (Shift+N: full vs first name)'],
        ['Alt+N (⌥N)', 'Name-learning mode (big photo flashcards)'],
        ['P  or 🎲', 'Random pupil picker (no repeats until everyone had a turn)'],
        ['Q', 'Read the question aloud on/off'],
        ['M', 'Music on/off — V / Shift+V volume'],
        ['F', 'Fullscreen on/off (beamer!)'],
        ['0', 'Cycle the 4 color schemes'],
        ['T / Shift+T', 'Background dim stronger / weaker'],
        ['A', 'Show / hide the task text'],
        ['H', 'This help'],
        ['Right-click', 'Menu: teams, modes, pages, toggles']
    ];
    page.innerHTML = '<h1>HELP</h1>' +
        '<p style="margin-bottom:16px"><a href="manualito.html" target="_blank" ' +
        'style="color:rgb(67,151,255);font-size:18px">📖 Manualito — die Kurzanleitung (neuer Tab)</a></p>' +
        '<table>' +
        rows.map(([k, d]) => '<tr><td>' + MT.escapeHtml(k) + '</td><td>' + MT.escapeHtml(d) + '</td></tr>').join('') +
        '</table><div class="copyright">SchoolTrainer by Dr. Michael R. Alvers — web edition</div>';
};

MT.render.studentsPage = function (page) {
    page.innerHTML = '<h1>STUDENTS — ' + MT.escapeHtml(MT.people.teamLabel()) +
        ' (click a row to toggle present/absent)</h1>' +
        MT.people.team.map((s, i) =>
            '<div class="row' + (s.present ? '' : ' absent') + '" data-i="' + i + '">' +
            '<span class="icon">' + (s.present ? '✅' : '❌') + '</span>' +
            '<span class="name">' + MT.escapeHtml(s.name) + '</span>' +
            '<span class="num">' + s.numberTasks + ' tasks</span>' +
            '<span class="num">' + s.numberRightSolutions + ' right</span></div>').join('');
    page.querySelectorAll('.row').forEach(r => r.addEventListener('click', () => {
        MT.people.togglePresent(+r.dataset.i);
        MT.render.update();
    }));
};

MT.render.seriesPage = function (page) {
    page.innerHTML = '<h1>SERIES (1 x 1) — L = limit mode ' +
        (MT.settings.limitedToSelectedSeries ? 'ON' : 'off') + '</h1>' +
        [2, 3, 4, 5, 6, 7, 8, 9].map(n =>
            '<div class="row" data-n="' + n + '"><span class="icon">' +
            (MT.settings.series[n] ? '✓' : '·') + '</span><span>' + n + 'er series</span></div>').join('');
    page.querySelectorAll('.row').forEach(r => r.addEventListener('click', () => {
        const n = +r.dataset.n;
        MT.settings.series[n] = !MT.settings.series[n];
        MT.saveSettings();
        MT.tasks.initTasks();
        MT.render.update();
    }));
};

MT.render.endPage = function (page) {
    page.classList.add('end');
    const totalMs = MT.state.finalDeltaT + MT.state.penalty * 1000;
    const s = Math.floor(totalMs / 1000);
    const n = MT.tasks.total() || 1;
    page.innerHTML =
        '<div class="label' + (MT.state.penalty ? ' penalty' : '') + '">Gesamtzeit für das Team' +
        (MT.state.penalty ? ' mit ' + MT.state.penalty + ' s Strafe' : '') + '</div>' +
        '<div class="total">' + Math.floor(s / 60) + ' min ' + (s % 60) + ' s</div>' +
        '<div class="label">Time per task per student</div>' +
        '<div class="pertask">' + (totalMs / 1000 / n).toFixed(3) + ' s</div>';
};
