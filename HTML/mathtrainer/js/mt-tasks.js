/* ============================================================
   MATHTRAINER tasks — the 1x1 generator (faithful MathTask
   semantics) and the dropped ':: ' task files.

   Generator rules from MathTask.java:
   - number1 ∈ 2..9 and must be in an ENABLED series (always)
   - number2 ∈ 2..9 (series-constrained only in limit mode)
   - divide and minus: number1 = number2 * number1
     (→ integer division, non-negative subtraction)
   - question glyph for multiply is ' ∙ ' (not ×)
   Deviation (documented): getRandomOperation picks uniformly
   among ENABLED operations (Java could return a disabled one
   after 10 re-roll tries).
   ============================================================ */
'use strict';

MT.tasks = { list: [] };
// task item: {name(pupil), type, question, answer, op?, n1?, n2?}

/* ---------------- 1x1 generator ---------------- */
MT.tasks.OP_ID = { multiply: 0, divide: 1, plus: 2, minus: 3 };
MT.tasks.OP_BY_ID = ['multiply', 'divide', 'plus', 'minus'];
MT.tasks.OP_SIGN = { multiply: ' ∙ ', divide: ' ÷ ', plus: ' + ', minus: ' − ' };

MT.tasks.enabledOps = function () {
    const on = MT.OPS.filter(op => MT.settings.operations[op]);
    if (!on.length) { MT.settings.operations.multiply = true; on.push('multiply'); }  // Java: × forced on
    return on;
};

MT.tasks.enabledSeries = function () {
    const on = [];
    for (let i = 2; i <= 9; i++) if (MT.settings.series[i]) on.push(i);
    if (!on.length) { MT.settings.series[2] = true; on.push(2); }
    return on;
};

MT.tasks.randomFrom = arr => arr[Math.floor(Math.random() * arr.length)];

MT.tasks.makeMathTask = function (pupilName) {
    const op = MT.tasks.randomFrom(MT.tasks.enabledOps());
    const series = MT.tasks.enabledSeries();
    let n1 = MT.tasks.randomFrom(series);                                  // series always applies to n1
    let n2 = MT.settings.limitedToSelectedSeries
        ? MT.tasks.randomFrom(series)
        : 2 + Math.floor(Math.random() * 8);
    if (op === 'divide' || op === 'minus') n1 = n2 * n1;
    let result;
    switch (op) {
        case 'multiply': result = n1 * n2; break;
        case 'divide': result = n1 / n2; break;
        case 'plus': result = n1 + n2; break;
        case 'minus': result = n1 - n2; break;
    }
    return {
        name: pupilName, type: MT.MATHEMATICS, op, n1, n2,
        question: n1 + MT.tasks.OP_SIGN[op] + n2,
        answer: n1 + MT.tasks.OP_SIGN[op] + n2 + ' = ' + result
    };
};

/* ---------------- dropped task files ---------------- */
// parser: UTF-8 lines 'question :: answer', '//' + blank lines skipped
MT.tasks.parseTaskFile = function (text) {
    return text.split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('//'))
        .map(l => l.split(/\s*::\s*/))
        .filter(p => p.length >= 2 && p[0])
        .map(p => [p[0], p[1]]);
};

MT.tasks.deck = [];         // shuffled [q, a] pairs, pointer wraps like the Java deck
MT.tasks.deckPos = 0;

MT.tasks.loadDropped = function (pairs, displayName) {
    MT.tasks.deck = MT.shuffled(pairs);
    MT.tasks.deckPos = 0;
    MT.settings.lastTasks = pairs;
    MT.settings.lastTaskName = displayName;
    MT.settings.taskType = MT.DROPPED;
    MT.saveSettings();
    MT.tasks.initTasks();
};

MT.tasks.nextFromDeck = function (pupilName) {
    if (!MT.tasks.deck.length) return null;
    if (MT.tasks.deckPos >= MT.tasks.deck.length) MT.tasks.deckPos = 0;   // wrap like getQuestion()
    const [q, a] = MT.tasks.deck[MT.tasks.deckPos++];
    return { name: pupilName, type: MT.DROPPED, question: q, answer: a };
};

// LaTeX joining like getProperLatex(): '=\)' → thin space, else quad
MT.tasks.isLatex = s => (s || '').startsWith('\\(');

// extract the inner TeX between \( and \) — real files carry trailing junk
// after the closing delimiter ('\( n = 38 \) ✓' in CheckFile.txt) which must
// not leak raw into KaTeX
MT.tasks.latexInner = function (s) {
    const m = /^\s*\\\(([\s\S]*)\\\)\s*([\s\S]*)$/.exec(s || '');
    if (!m) return { inner: (s || '').replace(/^\\\(/, ''), trail: '' };
    return { inner: m[1].trim(), trail: m[2].trim() };
};

MT.tasks.texEscapeText = s => s.replace(/[\\{}^_%$&#~]/g, ' ');

MT.tasks.joinedLatex = function (q, a) {
    const qi = MT.tasks.latexInner(q);
    const ai = MT.tasks.latexInner(a);
    const joiner = /=\s*$/.test(qi.inner) ? ' \\; ' : ' \\quad ';
    let tex = qi.inner + joiner + ai.inner;
    if (ai.trail) tex += ' \\;\\text{' + MT.tasks.texEscapeText(ai.trail) + '}';
    return tex;
};

/* ---------------- assignment ---------------- */
MT.tasks.initTasks = function () {
    // regenerating tasks invalidates any running game: kill a live countdown and
    // fall back to the splash so the flow can never point at a blank task list
    if (window.MT && MT.flow && MT.flow.stopCountdown) MT.flow.stopCountdown();
    MT.state.splash = true;
    const present = MT.people.presentStudents();
    const per = MT.settings.numberTasksPerStudent;
    MT.people.team.forEach(s => { s.numberTasks = 0; s.numberRightSolutions = 0; });
    let list = [];
    present.forEach(s => {
        for (let k = 0; k < per; k++) {
            const t = MT.settings.taskType === MT.DROPPED && (MT.tasks.deck.length || MT.settings.lastTasks.length)
                ? null : MT.tasks.makeMathTask(s.name);
            list.push(t || { name: s.name, type: MT.DROPPED });
        }
    });
    list = MT.shuffled(list);
    // avoid the same pupil twice in a row (checkForDoubleNames single pass)
    for (let i = 0; i < list.length - 1; i++) {
        if (list[i].name === list[i + 1].name) {
            list.push(list.splice(i, 1)[0]);
        }
    }
    // dropped questions are dealt from the deck AFTER shuffling the pupil slots
    if (MT.settings.taskType === MT.DROPPED) {
        if (!MT.tasks.deck.length && MT.settings.lastTasks.length) {
            MT.tasks.deck = MT.shuffled(MT.settings.lastTasks);
            MT.tasks.deckPos = 0;
        }
        list.forEach(t => {
            const drawn = MT.tasks.nextFromDeck(t.name);
            if (drawn) Object.assign(t, drawn);
            else Object.assign(t, MT.tasks.makeMathTask(t.name));   // no deck → fall back to 1x1
        });
    }
    list.forEach(t => {
        const s = MT.people.team.find(x => x.name === t.name);
        if (s) s.numberTasks++;
    });
    MT.tasks.list = list;
    MT.state.taskIndex = -1;
    MT.state.showingAnswer = false;
    MT.state.finished = false;
};

MT.tasks.current = () => MT.tasks.list[MT.state.taskIndex] || null;
MT.tasks.total = () => MT.tasks.list.length;
