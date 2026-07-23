/* ============================================================
   KAIMBO filters —
   1. the "Select" filter list (Filters.pnk magic names: Show
      all / learned / not learned / no image / … + learn levels)
      rendered above the topic tree
   2. the "Special filters" QA panel (5 checkboxes with counts)
   ============================================================ */
'use strict';

KB.filters = { active: 'Show all' };

/* learn-level day mapping of the original filter tree */
KB.filters.LEVELS = [
    ['New today', 0], ['Level 1', 1], ['Level 2', 2], ['Level 3', 4],
    ['Level 4', 7], ['Level 5', 14], ['Level 6', 60], ['Learned', 180]
];

KB.filters.MAIN = ['Show all', 'Show not learned', 'Show learned', 'Show no image',
    'Show need new image', 'Show no sound', 'Show unclassified'];

KB.filters.apply = async function (name) {
    const lang = KB.settings.masterLanguage;
    switch (name) {
        case 'Show all': KB.selectAll(true); KB.settings.showStatus = KB.SHOW_ALL; break;
        case 'Show not learned': KB.selectNotLearned(lang); KB.settings.showStatus = KB.SHOW_NOTLEARNED; break;
        case 'Show learned': KB.selectLearned(lang); KB.settings.showStatus = KB.SHOW_LEARNED; break;
        case 'Show no image': KB.selectNoImage(); break;
        case 'Show need new image': KB.selectNeedImage(); break;
        case 'Show no sound': await KB.filters.computeSoundFlags(); KB.selectNoSound(); break;
        case 'Show unclassified': KB.tree.matchAll(); KB.selectUnclassified(); break;
        default: {
            const lvl = KB.filters.LEVELS.find(([n]) => n === name);
            if (lvl) KB.selectLearnLevel(lvl[1], lang);
        }
    }
    KB.filters.active = name;
    KB.filters.renderFilterTree();
    KB.emit('selection-changed');
    // jump to first shown task
    const first = KB.state.tasks.findIndex(t => t.selected);
    if (first >= 0) KB.state.taskIndex = first;
    KB.emit('task-shown');
};

// bulk-load which tasks have an info note (Infos_tasks/<english>.txt or IDB)
KB.filters.computeInfoFlags = async function () {
    const keys = await KB.store.listInfoKeys('tasks');
    KB.state.tasks.forEach(t => { t.hasInfo = keys.has(t.english); });
};

// resolve async sound status into a plain flag the selectors can use
KB.filters.computeSoundFlags = async function () {
    for (const t of KB.state.tasks) {
        let has = 0;
        for (const l of KB.LANGS) {
            const st = await KB.store.soundStatus(t, l);
            if (st > has) has = st;
        }
        t._hasSound = has;
    }
};

/* ---------------- filter tree above the topics ---------------- */
KB.filters.renderFilterTree = function () {
    const host = document.getElementById('filter-tree');
    const row = (name, level) =>
        '<div class="tree-row' + (KB.filters.active === name ? ' active' : '') + '" data-f="' + name + '"' +
        ' style="padding-left:' + (level * 14) + 'px"><span class="ftr-dot"></span><span class="tree-label">' +
        name + '</span></div>';
    let html = KB.filters.MAIN.map(n => row(n, 0)).join('');
    html += KB.filters.LEVELS.map(([n]) => row(n, 1)).join('');
    host.innerHTML = html;
    host.querySelectorAll('.tree-row').forEach(r => {
        r.addEventListener('click', () => KB.filters.apply(r.dataset.f));
    });
};

/* ---------------- special filters panel ---------------- */
KB.filters.SPECIAL = [
    ['Unclassified tasks', 'unclassified'],
    ['Tasks with no good image', 'needimage'],
    ['Tasks with no custom image', 'noimage'],
    ['Tasks without sound', 'nosound'],
    ['Tasks with general info', 'hasinfo']
];

KB.filters.renderSpecialPanel = function () {
    const host = document.getElementById('special-pane');
    host.innerHTML = KB.filters.SPECIAL.map(([label, key]) =>
        '<label class="sf-row"><input type="checkbox" data-k="' + key + '" aria-label="' + label + '">' +
        '<span>' + label + '</span><span class="sf-count" data-c="' + key + '"></span></label>').join('') +
        '<div class="sf-hint">One filter at a time — Esc or clicking the background clears and shows all tasks again.</div>';
    host.querySelectorAll('input').forEach(cb => {
        cb.addEventListener('change', () => KB.filters.specialToggle(cb));
    });
    host.addEventListener('click', e => {
        if (e.target === host) KB.filters.specialClear();
    });
};

KB.filters.specialToggle = async function (cb) {
    // exclusive like radio behavior of the original panel usage
    document.querySelectorAll('#special-pane input').forEach(o => { if (o !== cb) o.checked = false; });
    if (!cb.checked) { KB.filters.specialClear(); return; }
    switch (cb.dataset.k) {
        case 'unclassified': KB.tree.matchAll(); KB.selectUnclassified(); break;
        case 'needimage': KB.selectNeedImage(); break;
        case 'noimage': KB.selectNoImage(); break;
        case 'nosound': await KB.filters.computeSoundFlags(); KB.selectNoSound(); break;
        case 'hasinfo': await KB.filters.computeInfoFlags(); KB.selectHasInfo(); break;
    }
    const count = KB.numberSelected();
    document.querySelectorAll('#special-pane .sf-count').forEach(el => { el.textContent = ''; });
    document.querySelector('#special-pane [data-c="' + cb.dataset.k + '"]').textContent = count;
    const first = KB.state.tasks.findIndex(t => t.selected);
    if (first >= 0) KB.state.taskIndex = first;
    KB.emit('selection-changed');
    KB.emit('task-shown');
};

KB.filters.specialClear = function () {
    document.querySelectorAll('#special-pane input').forEach(o => { o.checked = false; });
    document.querySelectorAll('#special-pane .sf-count').forEach(el => { el.textContent = ''; });
    KB.selectAll(true);
    KB.emit('selection-changed');
    KB.emit('task-shown');
};
