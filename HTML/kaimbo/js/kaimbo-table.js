/* ============================================================
   KAIMBO task table + statistics —
   Task List tab: # | English | German | Spanish | Italian |
   Flexi over the currently shown (filtered) tasks. Click a row
   to jump to that task (small usability addition — the Swing
   table was display-only).
   Statistics: spaced-repetition due-date histogram for the
   master language (the Java original was Italian-only).
   ============================================================ */
'use strict';

KB.table = {};

KB.table.render = function () {
    const host = document.getElementById('tasklist-pane');
    const shown = KB.shownTasks();
    const rows = shown.map((t, i) =>
        '<tr data-i="' + KB.state.tasks.indexOf(t) + '"><td class="num">' + (i + 1) + '</td>' +
        '<td>' + KB.escapeHtml(t.english) + '</td><td>' + KB.escapeHtml(t.german) + '</td>' +
        '<td>' + KB.escapeHtml(t.spanish) + '</td><td>' + KB.escapeHtml(t.italian) + '</td>' +
        '<td>' + KB.escapeHtml(t.flexi) + '</td></tr>').join('');
    host.innerHTML =
        '<table><thead><tr><th>Task</th><th>English</th><th>German</th><th>Spanish</th><th>Italian</th>' +
        '<th>' + KB.escapeHtml(KB.langName('flexi')) + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
    host.querySelectorAll('tr[data-i]').forEach(tr => {
        tr.addEventListener('click', () => {
            KB.showTask(+tr.dataset.i);
            KB.app.showPane('content-tabs', 'learning-pane');
        });
    });
};

/* ---------------- statistics window ---------------- */
KB.stats = { visible: false };

KB.stats.toggle = function () { KB.stats.visible ? KB.stats.hide() : KB.stats.show(); };

KB.stats.show = function () {
    const lang = KB.settings.masterLanguage;
    const counts = new Map();
    KB.state.tasks.forEach(t => {
        const due = KB.lastLearned(t, lang) + KB.learnLevel(t, lang) * 86400000;
        const key = KB.dateString(due);
        counts.set(key, (counts.get(key) || 0) + 1);
    });
    const parse = s => { const [d, m, y] = s.split('.').map(Number); return new Date(y, m - 1, d).getTime(); };
    const entries = [...counts.entries()].sort((a, b) => parse(b[0]) - parse(a[0]));
    const total = entries.reduce((s, [, c]) => s + c, 0);
    const el = document.getElementById('stats-win');
    el.innerHTML =
        '<div class="fw-title"><span>SPACED REPETITION — ' + KB.escapeHtml(KB.langName(lang).toUpperCase()) +
        '</span><button class="fw-close" id="st-close">✕</button></div>' +
        '<div class="fw-body"><table><thead><tr><th>Date</th><th>Tasks to repeat</th></tr></thead><tbody>' +
        entries.map(([d, c]) => '<tr><td>' + d + '</td><td>' + c + '</td></tr>').join('') +
        '<tr class="total"><td>Total</td><td>' + total + '</td></tr>' +
        '</tbody></table></div>';
    el.classList.remove('hidden');
    el.style.right = '30px'; el.style.top = '80px'; el.style.left = 'auto';
    document.getElementById('st-close').onclick = () => KB.stats.hide();
    KB.app.makeDraggable(el);
    KB.stats.visible = true;
};

KB.stats.hide = function () {
    document.getElementById('stats-win').classList.add('hidden');
    KB.stats.visible = false;
};
