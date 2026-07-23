/* ============================================================
   KAIMBO search — the top search line + autocomplete popup
   (MySearchLine + CollectPopup). Typing filters the task list
   against the MASTER language: startsWith matches first, then
   contains matches, capped at 29 + a 'Total Findings' row.
   Hovering / arrow-walking a row live-filters the main view.
   Typing ONLY digits jumps to that task number.
   (Deviation: matching is case-insensitive here; the Swing
   original was case-sensitive.)
   ============================================================ */
'use strict';

KB.search = { selIndex: -1, items: [], lastPattern: '' };

KB.search.el = () => document.getElementById('search-line');
KB.search.popup = () => document.getElementById('collect-popup');

KB.search.init = function () {
    const inp = KB.search.el();
    inp.addEventListener('input', () => KB.search.onInput(inp.value));
    inp.addEventListener('keydown', e => KB.search.onKey(e));
    inp.addEventListener('blur', () => setTimeout(() => KB.search.hidePopup(), 200));
};

/* main entry — also called by the topic tree (label click pushes the text here) */
KB.search.handleSearchInput = function (pattern, fromTree) {
    const inp = KB.search.el();
    if (fromTree) inp.value = pattern;
    KB.search.applyFilter(pattern);
    if (!fromTree) KB.search.buildPopup(pattern);
};

KB.search.onInput = function (value) {
    const v = value.trim();
    if (!v) { KB.search.clear(); return; }
    if (/^\d+$/.test(v)) {                    // number → jump to shown-task number
        KB.search.hidePopup();
        KB.jumpToShown(parseInt(v, 10));
        return;
    }
    KB.search.handleSearchInput(v, false);
};

KB.search.applyFilter = function (pattern) {
    const master = KB.settings.masterLanguage;
    const p = pattern.toLowerCase();
    let n = 0;
    KB.state.tasks.forEach(t => {
        const txt = (KB.txt(t, master) || '').toLowerCase();
        t.selected = txt.includes(p);
        if (t.selected) n++;
    });
    KB.search.lastPattern = pattern;
    // land on the first match
    const first = KB.state.tasks.findIndex(t => t.selected);
    if (first >= 0) KB.state.taskIndex = first;
    KB.emit('selection-changed');
    KB.emit('task-shown');
    return n;
};

KB.search.buildPopup = function (pattern) {
    const master = KB.settings.masterLanguage;
    const p = pattern.toLowerCase();
    const starts = [], contains = [];
    // index 0 can be a just-created empty task — the original skips it too
    KB.state.tasks.forEach(t => {
        const txt = KB.txt(t, master) || '';
        const lower = txt.toLowerCase();
        if (txt === '-' || !txt) return;
        if (lower.startsWith(p)) starts.push(txt);
        else if (lower.includes(p)) contains.push(txt);
    });
    const all = starts.concat(contains);
    const items = all.slice(0, 29);
    KB.search.items = items;
    KB.search.selIndex = -1;
    const pop = KB.search.popup();
    if (!items.length) { KB.search.hidePopup(); return; }
    let html = items.map((txt, i) => {
        const at = txt.toLowerCase().indexOf(p);
        const hl = at < 0 ? KB.escapeHtml(txt) :
            KB.escapeHtml(txt.slice(0, at)) + '<b>' + KB.escapeHtml(txt.slice(at, at + p.length)) + '</b>' +
            KB.escapeHtml(txt.slice(at + p.length));
        return '<div class="collect-row" data-i="' + i + '"><span class="collect-num">' + (i + 1) + '</span><span>' + hl + '</span></div>';
    }).join('');
    if (all.length > items.length) html += '<div class="collect-total">Total findings: ' + all.length + '</div>';
    pop.innerHTML = html;
    pop.classList.remove('hidden');
    pop.querySelectorAll('.collect-row').forEach(row => {
        const txt = items[+row.dataset.i];
        row.addEventListener('mouseenter', () => KB.search.applyFilter(txt));   // hover = live preview filter
        row.addEventListener('mousedown', e => { e.preventDefault(); KB.search.choose(+row.dataset.i); });
    });
};

KB.search.choose = function (i) {
    const txt = KB.search.items[i];
    if (txt == null) return;
    KB.search.el().value = txt;
    KB.search.applyFilter(txt);
    KB.search.hidePopup();
    document.getElementById('stage').focus();
};

KB.search.onKey = function (e) {
    const pop = KB.search.popup();
    const open = !pop.classList.contains('hidden');
    if (e.key === 'Escape') {
        e.preventDefault();
        if (open) { KB.search.hidePopup(); return; }
        KB.search.clear();
        document.getElementById('stage').focus();
        return;
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        if (KB.search.selIndex >= 0) KB.search.choose(KB.search.selIndex);
        else { KB.search.hidePopup(); document.getElementById('stage').focus(); }
        return;
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && open) {
        e.preventDefault();
        const n = KB.search.items.length;
        KB.search.selIndex = ((KB.search.selIndex + (e.key === 'ArrowDown' ? 1 : -1)) % n + n) % n;
        pop.querySelectorAll('.collect-row').forEach((r, i) => r.classList.toggle('sel', i === KB.search.selIndex));
        KB.search.applyFilter(KB.search.items[KB.search.selIndex]);  // arrow-walk live-filters too
    }
};

KB.search.hidePopup = function () { KB.search.popup().classList.add('hidden'); };

KB.search.clear = function () {
    KB.search.el().value = '';
    KB.search.lastPattern = '';
    KB.search.hidePopup();
    KB.selectAll(true);
    KB.emit('selection-changed');
    KB.emit('task-shown');
};
