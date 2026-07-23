/* ============================================================
   MATHTRAINER app — game flow (question/answer alternation,
   countdown, penalty, end screen), keyboard map, mouse and
   context menu, file open / drag&drop, picker overlay, boot.
   ============================================================ */
'use strict';

MT.app = {};
MT.flow = {};

/* ---------------- game flow ---------------- */
MT.flow.startTimers = function () {
    clearInterval(MT.state.stopwatchTimer);
    MT.state.stopwatchTimer = setInterval(() => MT.render.stopwatch(), 1000);
};

MT.flow.startCountdown = function () {
    MT.flow.stopCountdown();
    if (!MT.settings.countdownMode) { MT.state.countdown = -1; MT.render.countdown(); return; }
    MT.state.countdown = MT.COUNTDOWN_FROM;
    MT.render.countdown();
    MT.state.countdownTimer = setInterval(() => {
        MT.state.countdown--;
        if (MT.state.countdown <= 0) {
            MT.flow.stopCountdown();
            MT.flow.next({ timeout: true });      // auto-reveal at 0
            return;
        }
        MT.render.countdown();
    }, 1000);
};

MT.flow.stopCountdown = function () {
    clearInterval(MT.state.countdownTimer);
    MT.state.countdownTimer = null;
    MT.state.countdown = -1;
    MT.state.pausedCountdown = 0;
    MT.render.countdown();
};

// pages pause a running question countdown instead of letting it expire invisibly
MT.flow.pauseCountdown = function () {
    if (MT.state.countdownTimer && MT.state.countdown > 0) {
        MT.state.pausedCountdown = MT.state.countdown;
        clearInterval(MT.state.countdownTimer);
        MT.state.countdownTimer = null;
    }
};

MT.flow.resumeCountdown = function () {
    if (MT.state.pausedCountdown > 0 && !MT.state.splash && !MT.state.page &&
        !MT.state.showingAnswer && MT.settings.countdownMode) {
        MT.state.countdown = MT.state.pausedCountdown;
        MT.state.pausedCountdown = 0;
        MT.render.countdown();
        MT.state.countdownTimer = setInterval(() => {
            MT.state.countdown--;
            if (MT.state.countdown <= 0) {
                MT.flow.stopCountdown();
                MT.flow.next({ timeout: true });
                return;
            }
            MT.render.countdown();
        }, 1000);
    } else {
        MT.state.pausedCountdown = 0;
    }
};

MT.flow.showQuestion = function (firstPress) {
    const t = MT.tasks.current();
    if (!t) return;
    MT.state.showingAnswer = false;
    MT.state.wrongPressed = false;
    MT.flow.startCountdown();
    if (MT.settings.drawNames) {
        // first press announces the full name, later questions the first name
        MT.audio.sayName(firstPress ? t.name : MT.people.firstName(t.name));
    }
    MT.audio.sayQuestion(t.question);
    MT.render.update();
};

MT.flow.next = function (opts = {}) {
    if (MT.state.page && MT.state.page !== 'end') return;    // pages swallow ↓
    if (MT.state.finished) return;
    if (MT.state.splash) {
        if (!MT.tasks.total()) MT.tasks.initTasks();
        if (!MT.tasks.total()) { MT.toast('No pupils present — check the Students page (S)'); return; }
        MT.state.splash = false;
        // resume an interrupted run (Esc mid-game) instead of restarting it
        if (MT.state.taskIndex >= 0 && MT.state.timerStart) {
            if (!MT.state.showingAnswer) MT.flow.startCountdown();
            MT.render.update();
            return;
        }
        MT.state.timerStart = Date.now();
        MT.state.penalty = 0;
        MT.flow.startTimers();
        MT.state.taskIndex = 0;
        MT.flow.showQuestion(true);
        return;
    }
    if (!MT.state.showingAnswer) {
        // reveal the answer; credit a right solution only on a normal manual reveal
        MT.state.showingAnswer = true;
        MT.flow.stopCountdown();
        const t = MT.tasks.current();
        if (t && !opts.timeout && !MT.state.wrongPressed) {
            const s = MT.people.team.find(x => x.name === t.name);
            if (s) s.numberRightSolutions++;
        }
        MT.state.wrongPressed = false;
        MT.render.update();
        return;
    }
    // advance to the next task
    if (MT.state.taskIndex + 1 >= MT.tasks.total()) { MT.flow.finish(); return; }
    MT.state.taskIndex++;
    MT.flow.showQuestion(false);
};

MT.flow.wrong = function () {
    if (MT.state.splash || MT.state.finished || MT.state.page) return;
    MT.state.penalty += 10;
    MT.state.wrongPressed = true;
    MT.flow.next();
};

MT.flow.finish = function () {
    MT.state.finalDeltaT = Date.now() - MT.state.timerStart;
    MT.state.finished = true;
    MT.flow.stopCountdown();
    MT.state.page = 'end';
    MT.render.update();
};

// 'B' / New game — restart with a fresh shuffle (initBeginning)
MT.flow.newGame = async function () {
    MT.flow.stopCountdown();
    clearInterval(MT.state.stopwatchTimer);
    Object.assign(MT.state, {
        splash: true, taskIndex: -1, showingAnswer: false, finished: false,
        page: null, penalty: 0, timerStart: 0, finalDeltaT: 0, wrongPressed: false
    });
    await MT.people.loadTeam(MT.settings.actualTeam, true);   // new game shuffles
    MT.tasks.initTasks();
    MT.render.update();
};

MT.app.setTaskType = function (type) {
    MT.settings.taskType = type;
    MT.saveSettings();
    // Dropped without any loaded file: fall back to the built-in demo set so the
    // key '2' visibly does something (the Java app silently kept generating 1x1)
    if (type === MT.DROPPED && !MT.tasks.deck.length && !MT.settings.lastTasks.length) {
        MT.tasks.loadDropped(MT.store.demoTasks(), 'Demo');
        MT.toast('Demo tasks loaded — O opens one of your task files');
    }
    MT.tasks.initTasks();
    MT.state.page = null;
    MT.render.update();
};

MT.app.setTeam = async function (id) {
    MT.settings.actualTeam = id;
    MT.saveSettings();
    await MT.people.loadTeam(id, false);      // team switch does not shuffle (Java)
    MT.tasks.initTasks();
    MT.state.splash = true;
    MT.state.page = null;
    MT.render.update();
};

/* ---------------- pages & picker ---------------- */
MT.app.togglePage = function (name) {
    const opening = MT.state.page !== name;
    MT.state.page = opening ? name : null;
    if (opening) MT.flow.pauseCountdown();
    else MT.flow.resumeCountdown();
    MT.render.update();
};

MT.app.showPicker = function () {
    const picked = MT.people.pickRandom();
    if (!picked) { MT.toast('No pupils present'); return; }
    if (MT.state.page !== 'picker') MT.flow.pauseCountdown();
    MT.state.page = 'picker';
    MT.app._pickerData = picked;
    MT.app.renderPicker();
    MT.audio.sayName(picked.name);
};

// separate render so a window resize (render.page) can rebuild the overlay
MT.app.renderPicker = function () {
    const picked = MT.app._pickerData;
    if (!picked) return;
    const page = $('page');
    page.className = 'picker';
    page.classList.remove('hidden');
    page.innerHTML =
        '<div class="pk-photo" id="pk-photo">🙂</div>' +
        '<div class="pk-name">' + MT.escapeHtml(picked.name) + '</div>' +
        '<div class="pk-round">Round ' + MT.people.picker.round +
        ' — ' + MT.people.picker.pool.filter(s => s.present).length + ' pupils left · P = next · Esc = close</div>';
    MT.store.photoURL(picked.name).then(url => {
        const el = $('pk-photo');
        if (url && el && MT.state.page === 'picker') {
            el.style.backgroundImage = 'url("' + url.replace(/"/g, '%22') + '")';
            el.textContent = '';
        }
    });
};

MT.app.closePicker = function () {
    MT.state.page = null;
    MT.app._pickerData = null;
    MT.flow.resumeCountdown();
    MT.render.update();
};

/* ---------------- esc cascade ---------------- */
MT.app.esc = function () {
    if (!$('ctx-menu').classList.contains('hidden')) { $('ctx-menu').classList.add('hidden'); return; }
    if (MT.state.page === 'end') { MT.flow.newGame(); return; }
    if (MT.state.page === 'picker') { MT.app.closePicker(); return; }
    if (MT.state.page) { MT.state.page = null; MT.flow.resumeCountdown(); MT.render.update(); return; }
    if (!MT.state.splash) {                  // back to the splash — ↓ resumes the run
        MT.flow.stopCountdown();
        MT.state.splash = true;
        MT.render.update();
    }
};

/* ---------------- keyboard ---------------- */
MT.app.initKeyboard = function () {
    document.addEventListener('keydown', e => {
        if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
        // never react to browser shortcuts (Cmd+C copy would toggle the countdown …)
        if (e.metaKey || e.ctrlKey) return;
        const key = e.key;
        if (MT.state.page === 'picker' && e.code !== 'KeyP' && key !== 'Escape') {
            e.preventDefault();
            MT.app.closePicker();                       // any key closes the picker …
            return;                                     // … and is CONSUMED (no double action)
        }
        switch (key) {
            case 'ArrowDown': case ' ': case 'PageDown': e.preventDefault(); MT.flow.next(); return;
            case 'ArrowRight': e.preventDefault(); MT.flow.wrong(); return;
            case 'Escape':
                // in fullscreen the browser consumes Esc to exit — don't also pause the game
                if (document.fullscreenElement) return;
                e.preventDefault(); MT.app.esc(); return;
            case '+': MT.settings.numberTasksPerStudent++; MT.app.afterTaskCountChange(); return;
            case '-': MT.settings.numberTasksPerStudent = Math.max(3, MT.settings.numberTasksPerStudent - 1);
                MT.app.afterTaskCountChange(); return;
            case '*': MT.settings.fontSizeNumbers += 5; MT.saveSettings(); MT.render.update(); return;
            case '_': MT.settings.fontSizeNumbers = Math.max(40, MT.settings.fontSizeNumbers - 5);
                MT.saveSettings(); MT.render.update(); return;
            case '0': MT.settings.colorSchemeId = (MT.settings.colorSchemeId + 1) % 4;
                MT.saveSettings(); MT.render.update(); return;
            case '1': MT.app.setTaskType(MT.MATHEMATICS); return;
            case '2': MT.app.setTaskType(MT.DROPPED); return;
        }
        switch (e.code) {
            case 'KeyA': MT.state.drawTask = !MT.state.drawTask; MT.render.update(); return;
            case 'KeyB': MT.flow.newGame(); return;
            case 'KeyC': MT.settings.countdownMode = !MT.settings.countdownMode; MT.saveSettings();
                MT.toast('Countdown ' + (MT.settings.countdownMode ? 'on' : 'off'));
                if (!MT.settings.countdownMode) MT.flow.stopCountdown(); else MT.render.countdown();
                return;
            case 'KeyE': MT.app.togglePage('series'); return;
            case 'KeyF': MT.app.toggleFullscreen(); return;
            case 'KeyH': MT.app.togglePage('help'); return;
            case 'KeyL': MT.settings.limitedToSelectedSeries = !MT.settings.limitedToSelectedSeries;
                MT.saveSettings(); MT.tasks.initTasks(); MT.render.update(); return;
            case 'KeyM': MT.audio.toggleMusic(); return;
            case 'KeyN':
                if (e.altKey) { MT.settings.nameLearning = !MT.settings.nameLearning; }
                else if (e.shiftKey) { MT.settings.showAllNames = !MT.settings.showAllNames; }
                else { MT.settings.drawNames = !MT.settings.drawNames; }
                MT.saveSettings(); MT.render.update(); return;
            case 'KeyO': MT.app.openTaskFile(); return;
            case 'KeyP': MT.app.showPicker(); return;
            case 'KeyQ': MT.settings.playQuestion = !MT.settings.playQuestion; MT.saveSettings();
                MT.toast('Read question ' + (MT.settings.playQuestion ? 'on' : 'off')); return;
            case 'KeyS': MT.app.togglePage('students'); return;
            case 'KeyT': {
                const d = e.shiftKey ? -0.1 : 0.1;
                MT.settings.transparency = Math.min(0.95, Math.max(0, +(MT.settings.transparency + d).toFixed(2)));
                MT.saveSettings(); MT.render.update(); return;
            }
            case 'KeyV': MT.audio.changeVolume(e.shiftKey ? 0.1 : -0.1); return;
        }
    });
};

// real browser fullscreen for the beamer ("full full") — F toggles, Esc leaves
MT.app.toggleFullscreen = function () {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
    } else {
        document.documentElement.requestFullscreen().catch(e => MT.toast('Fullscreen blocked: ' + e.message));
    }
};

MT.app.afterTaskCountChange = function () {
    MT.saveSettings();
    MT.tasks.initTasks();
    MT.toast(MT.settings.numberTasksPerStudent + ' tasks per pupil');
    MT.render.update();
};

/* ---------------- mouse ---------------- */
MT.app.initMouse = function () {
    // operation strip toggles (regenerate all tasks; × forced on if all off)
    $('op-strip').addEventListener('click', e => {
        const span = e.target.closest('[data-op]');
        if (!span) return;
        const op = span.dataset.op;
        MT.settings.operations[op] = !MT.settings.operations[op];
        MT.tasks.enabledOps();          // enforces ×-on-if-all-off
        MT.saveSettings();
        MT.tasks.initTasks();
        MT.render.update();
    });
    $('picker-btn').addEventListener('click', () => MT.app.showPicker());
    $('folder-chip').addEventListener('click', () => MT.app.connectFolder());

    // right-click context menu (MyPopup)
    document.getElementById('stage').addEventListener('contextmenu', e => {
        e.preventDefault();
        MT.app.showMenu(e.clientX, e.clientY);
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('#ctx-menu')) $('ctx-menu').classList.add('hidden');
    });

    // drag & drop task files
    window.addEventListener('dragover', e => e.preventDefault());
    window.addEventListener('drop', async e => {
        e.preventDefault();
        const f = [...e.dataTransfer.files].find(f => f.name.endsWith('.txt'));
        if (!f) return;
        const pairs = MT.tasks.parseTaskFile(await f.text());
        if (!pairs.length) { MT.toast('No "question :: answer" lines found in ' + f.name); return; }
        MT.tasks.loadDropped(pairs, f.name);
        MT.state.splash = true;
        MT.render.update();
        MT.toast(pairs.length + ' tasks loaded from ' + f.name);
    });
};

MT.app.showMenu = function (x, y) {
    const menu = $('ctx-menu');
    const items = [];
    const add = (label, hint, fn, cls) => items.push({ label, hint, fn, cls });
    add('New game', 'B', () => MT.flow.newGame());
    items.push('-');
    add('Mathematics', '1', () => MT.app.setTaskType(MT.MATHEMATICS),
        MT.settings.taskType === MT.MATHEMATICS ? 'radio-on' : '');
    add('Dropped', '2', () => MT.app.setTaskType(MT.DROPPED),
        MT.settings.taskType === MT.DROPPED ? 'radio-on' : '');
    add('Open task file …', 'O', () => MT.app.openTaskFile());
    items.push('-');
    MT.people.teamLabels.forEach((label, id) => {
        add('Team ' + label, '', () => MT.app.setTeam(id), id === MT.settings.actualTeam ? 'radio-on' : '');
    });
    items.push('-');
    add('Students', 'S', () => MT.app.togglePage('students'));
    add('Series', 'E', () => MT.app.togglePage('series'));
    add('Help', 'H', () => MT.app.togglePage('help'));
    items.push('-');
    add('Music on/off', 'M', () => MT.audio.toggleMusic(), MT.settings.playMusic ? 'checked' : '');
    add('YouTube music …', '', () => {
        const v = prompt('YouTube URL or video id for the music fallback:',
            'https://www.youtube.com/watch?v=' + MT.settings.youtubeMusicId);
        if (v) MT.audio.setYouTubeId(v);
    });
    add('Countdown on/off', 'C', () => {
        MT.settings.countdownMode = !MT.settings.countdownMode; MT.saveSettings();
        if (!MT.settings.countdownMode) MT.flow.stopCountdown(); else MT.render.countdown();
    }, MT.settings.countdownMode ? 'checked' : '');
    add('Pupil name on/off', 'N', () => {
        MT.settings.drawNames = !MT.settings.drawNames; MT.saveSettings(); MT.render.update();
    }, MT.settings.drawNames ? 'checked' : '');
    menu.innerHTML = items.map((it, i) => it === '-' ? '<div class="sep"></div>' :
        '<div class="mi ' + (it.cls || '') + '" data-i="' + i + '"><span>' + MT.escapeHtml(it.label) +
        '</span><span class="hint">' + it.hint + '</span></div>').join('');
    menu.classList.remove('hidden');
    menu.style.left = Math.min(x, window.innerWidth - menu.offsetWidth - 8) + 'px';
    menu.style.top = Math.min(y, window.innerHeight - menu.offsetHeight - 8) + 'px';
    menu.querySelectorAll('.mi').forEach(el => el.addEventListener('click', () => {
        menu.classList.add('hidden');
        items[+el.dataset.i].fn();
    }));
};

/* ---------------- file open ---------------- */
MT.app.openTaskFile = async function () {
    // prefer the folder's tasks/ directory when connected
    if (MT.store.dir) {
        const files = await MT.store.listTaskFiles();
        if (files.length) {
            const menu = $('ctx-menu');
            menu.innerHTML = files.map(f =>
                '<div class="mi" data-f="' + MT.escapeHtml(f) + '"><span>' + MT.escapeHtml(f) + '</span></div>').join('');
            menu.classList.remove('hidden');
            menu.style.left = Math.max(8, (window.innerWidth - menu.offsetWidth) / 2) + 'px';
            menu.style.top = '120px';
            menu.querySelectorAll('.mi').forEach(el => el.addEventListener('click', async () => {
                menu.classList.add('hidden');
                const name = el.dataset.f;
                const text = await MT.store.readTaskFile(name);
                if (text === null) { MT.toast('Could not read ' + name); return; }
                const pairs = MT.tasks.parseTaskFile(text);
                if (!pairs.length) { MT.toast('No "question :: answer" lines found in ' + name); return; }
                MT.tasks.loadDropped(pairs, name);
                MT.render.update();
                MT.toast(pairs.length + ' tasks loaded from ' + name);
            }));
            return;
        }
    }
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.txt';
    inp.onchange = async () => {
        const f = inp.files[0];
        if (!f) return;
        const pairs = MT.tasks.parseTaskFile(await f.text());
        if (!pairs.length) { MT.toast('No "question :: answer" lines found'); return; }
        MT.tasks.loadDropped(pairs, f.name);
        MT.state.splash = true;
        MT.render.update();
    };
    inp.click();
};

/* ---------------- folder chip ---------------- */
MT.app.updateFolderChip = function () {
    const chip = $('folder-chip');
    if (MT.store.dir) {
        chip.textContent = 'resources ✓';
        chip.className = 'chip-on';
        chip.title = 'Photos, name audio, teams, tasks and images come from the connected folder';
    } else if (MT.store.pendingHandle) {
        chip.textContent = 'reconnect folder';
        chip.className = 'chip-off';
    } else {
        chip.textContent = 'no folder';
        chip.className = 'chip-off';
    }
};

MT.app.connectFolder = async function () {
    if (await MT.store.connectFolder()) {
        await MT.people.loadTeams();
        await MT.people.loadTeam(MT.settings.actualTeam, false);
        MT.tasks.initTasks();
        MT.render.update();
        MT.toast('Folder connected — teams, photos and sounds are live');
    }
    MT.app.updateFolderChip();
};

/* ---------------- boot ---------------- */
MT.app.boot = async function () {
    MT.applyScheme();
    MT.app.initKeyboard();
    MT.app.initMouse();
    await MT.store.init();
    await MT.people.loadTeams();
    await MT.people.loadTeam(MT.settings.actualTeam, false);
    if (MT.settings.taskType === MT.DROPPED && MT.settings.lastTasks.length) {
        MT.tasks.deck = MT.shuffled(MT.settings.lastTasks);   // restore the last task set
    }
    MT.tasks.initTasks();
    MT.app.updateFolderChip();
    MT.render.update();
    window.addEventListener('resize', () => MT.render.update());
    window.addEventListener('beforeunload', () => MT.saveSettings());
    // original auto-played music at startup — browsers need one user gesture first
    const musicKick = () => { if (MT.settings.playMusic) MT.audio.startMusic(); };
    document.addEventListener('pointerdown', musicKick, { once: true });
    document.addEventListener('keydown', musicKick, { once: true });
    MT.dbg('mathtrainer web booted — ' + MT.people.team.length + ' pupils, ' + MT.tasks.total() + ' tasks');
};

document.addEventListener('DOMContentLoaded', MT.app.boot);
