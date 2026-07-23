/* ============================================================
   KAIMBO topic tree — port of MyTree: hierarchical topics with
   tri-state checkboxes (left-click = AND/green, right-click on
   the box = OR/blue), match counts (aggregated by default),
   context-menu editing, cut/copy/paste with fresh UUIDs, group,
   move, lock/structure flags, snapshot undo/redo, pnk export/
   import. Label click single-selects AND pushes the topic text
   into the global search (original coupling).
   ============================================================ */
'use strict';

KB.tree = {
    model: { root: null, nodes: new Map() },
    clipboard: [],           // deep-copied subtrees
    undoStack: [], redoStack: [],
    selectedIds: new Set(),
    orActive: false          // clearedForOr flag
};

KB.tree.root = () => KB.tree.model.root;

KB.tree.setModel = function (model) {
    KB.tree.model = model;
    KB.tree.selectedIds.clear();
    KB.tree.matchAll();
    KB.tree.render();
};

/* ---------------- matching ---------------- */
KB.tree.forEach = function (fn, node) {
    const walk = n => { if (!n) return; fn(n); n.children.forEach(walk); };
    walk(node || KB.tree.model.root);
};

KB.tree.matchAll = function () {
    KB.state.tasks.forEach(t => { t._topics = []; });
    KB.tree.forEach(n => { n.matchedTasks = []; });
    KB.tree.forEach(n => {
        if (n.structure || !n.text) return;
        KB.state.tasks.forEach(t => {
            if (KB.taskMatchesWord(t, n.text)) {
                n.matchedTasks.push(t);
                t._topics.push(n);
            }
        });
    });
    // clean post-order aggregation (the Java accumulator bug is fixed here)
    const agg = n => {
        n.aggregated = n.matchedTasks.length + n.children.reduce((s, c) => s + agg(c), 0);
        return n.aggregated;
    };
    if (KB.tree.model.root) agg(KB.tree.model.root);
};

/* ---------------- rendering ---------------- */
KB.tree.render = function () {
    const host = document.getElementById('topic-tree');
    if (!host) return;
    const rows = [];
    const walk = (n, level) => {
        rows.push(KB.tree.rowHtml(n, level));
        if (n.expanded) n.children.forEach(c => walk(c, level + 1));
    };
    if (KB.tree.model.root) walk(KB.tree.model.root, 0);
    host.innerHTML = rows.join('');
    host.querySelectorAll('.tree-row').forEach(row => KB.tree.wireRow(row));
};

KB.tree.rowHtml = function (n, level) {
    const count = KB.settings.showAggregated ? n.aggregated : n.matchedTasks.length;
    const cls = ['tree-row'];
    if (KB.tree.selectedIds.has(n.id)) cls.push('selected');
    if (n.locked) cls.push('locked');
    if (n.structure) cls.push('structure');
    const check = n.checkStatus === 1 ? 'and' : n.checkStatus === 2 ? 'or' : '';
    const twist = n.children.length ? (n.expanded ? '▾' : '▸') : '·';
    return '<div class="' + cls.join(' ') + '" data-id="' + n.id + '" style="padding-left:' + (level * 16 + 4) + 'px">' +
        '<span class="tree-twist">' + twist + '</span>' +
        '<span class="tree-check ' + check + '" title="Click: AND filter (green) — right-click: OR filter (blue)"></span>' +
        '<span class="tree-label" title="' + KB.escapeHtml(n.text) + '">' + KB.escapeHtml(n.text) + '</span>' +
        (n.children.length ? '<span class="tree-kids">' + KB.tree.totalChildCount(n) + '</span>' : '') +
        '<span class="tree-count' + (count ? '' : ' zero') + '">' + count + '</span>' +
        '</div>';
};

KB.tree.totalChildCount = function (n) {
    let c = 0;
    KB.tree.forEach(() => c++, n);
    return c - 1;
};

KB.tree.node = id => KB.tree.model.nodes.get(id);

KB.tree.wireRow = function (row) {
    const n = KB.tree.node(row.dataset.id);
    if (!n) return;
    row.querySelector('.tree-twist').addEventListener('click', e => {
        e.stopPropagation();
        if (n.children.length) { n.expanded = !n.expanded; KB.tree.render(); KB.tree.persistSoon(); }
    });
    const check = row.querySelector('.tree-check');
    check.addEventListener('click', e => { e.stopPropagation(); KB.tree.toggleCheck(n, 1); });
    check.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); KB.tree.toggleCheck(n, 2); });
    const label = row.querySelector('.tree-label');
    label.addEventListener('click', e => {
        if (e.ctrlKey || e.metaKey) {          // multi-select for group/cut/copy
            KB.tree.selectedIds.has(n.id) ? KB.tree.selectedIds.delete(n.id) : KB.tree.selectedIds.add(n.id);
        } else if (e.shiftKey) {
            KB.tree.newTopicFromTask(n);       // original: Shift+click = new child topic from task
            return;
        } else {
            KB.tree.selectedIds.clear();
            KB.tree.selectedIds.add(n.id);
            KB.search.handleSearchInput(n.text, true);   // tree drives the global search
        }
        KB.tree.render();
    });
    label.addEventListener('dblclick', () => KB.tree.editTopic(n));
    row.addEventListener('contextmenu', e => {
        if (e.target === check) return;
        e.preventDefault();
        if (!KB.tree.selectedIds.has(n.id)) { KB.tree.selectedIds.clear(); KB.tree.selectedIds.add(n.id); KB.tree.render(); }
        KB.tree.contextMenu(e, n);
    });
};

/* ---------------- checkbox filtering (AND / OR) ---------------- */
KB.tree.toggleCheck = function (n, mode) {
    const target = n.checkStatus === mode ? 0 : mode;
    const setRec = (node, v) => { node.checkStatus = v; node.children.forEach(c => setRec(c, v)); };
    setRec(n, target);
    KB.tree.applyChecks(mode);
    KB.tree.render();
};

KB.tree.applyChecks = function (mode) {
    const checked = [];
    KB.tree.forEach(x => { if (x.checkStatus > 0) checked.push(x); });
    if (!checked.length) { KB.selectAll(true); KB.tree.orActive = false; }
    else {
        KB.selectAll(false);
        checked.forEach(topic => topic.matchedTasks.forEach(t => { t.selected = true; }));
    }
    const first = KB.state.tasks.findIndex(t => t.selected);
    if (first >= 0) KB.state.taskIndex = first;
    KB.emit('selection-changed');
    KB.emit('task-shown');
};

/* ---------------- undo / redo (whole-tree snapshots) ---------------- */
KB.tree.snapshot = function () {
    if (!KB.tree.model.root) return;
    KB.tree.undoStack.push(KB.formats.serializePnk(KB.tree.model.root));
    if (KB.tree.undoStack.length > 100) KB.tree.undoStack.shift();
    KB.tree.redoStack = [];
};

KB.tree.restore = function (pnk) {
    KB.tree.setModel(KB.formats.buildTree(KB.formats.parsePnk(pnk)));
    KB.tree.persistSoon();
};

KB.tree.undo = function () {
    if (!KB.tree.undoStack.length) return;
    KB.tree.redoStack.push(KB.formats.serializePnk(KB.tree.model.root));
    KB.tree.restore(KB.tree.undoStack.pop());
};

KB.tree.redo = function () {
    if (!KB.tree.redoStack.length) return;
    KB.tree.undoStack.push(KB.formats.serializePnk(KB.tree.model.root));
    KB.tree.restore(KB.tree.redoStack.pop());
};

/* ---------------- mutations ---------------- */
KB.tree.persistTimer = null;
KB.tree.persistSoon = function () {
    KB.markDirty();
    clearTimeout(KB.tree.persistTimer);
    KB.tree.persistTimer = setTimeout(() => KB.store.saveAll(), 1200);
};

KB.tree.afterMutation = function () {
    KB.state.treeFromSample = false;   // the user made the tree their own — persist it from now on
    KB.tree.matchAll();
    KB.tree.render();
    KB.tree.persistSoon();
};

KB.tree.makeNode = function (text, parent) {
    const node = {
        id: KB.uuid(), isa: parent.id, text, synonyms: [], comment: '',
        expanded: false, structure: false, locked: false, checkStatus: 0,
        children: [], parent, matchedTasks: [], aggregated: 0
    };
    KB.tree.model.nodes.set(node.id, node);
    return node;
};

KB.tree.newTopic = function (parent) {
    const name = prompt(parent.text + ' — create new child:');
    if (!name) return;
    KB.tree.snapshot();
    const node = KB.tree.makeNode(name, parent);
    parent.children.unshift(node);          // insert at index 0, like the original
    parent.expanded = true;
    KB.tree.afterMutation();
};

KB.tree.newTopicFromTask = function (parent) {
    const task = KB.currentTask();
    const name = task && task.english !== '-' ? task.english : null;
    if (!name) { KB.tree.newTopic(parent); return; }
    KB.tree.snapshot();
    const node = KB.tree.makeNode(name, parent);
    parent.children.unshift(node);
    parent.expanded = true;
    KB.tree.afterMutation();
};

KB.tree.editTopic = function (n) {
    if (n.locked) { alert('Unlock topic before editing.'); return; }
    const name = prompt('Edit topic:', n.text);
    if (!name) return;
    KB.tree.snapshot();
    n.text = name;
    KB.tree.afterMutation();
};

KB.tree.deleteTopic = function (n) {
    if (n.locked) { alert('Unlock topic before deleting.'); return; }
    if (!n.parent) { alert('Cannot delete the root.'); return; }
    if (!confirm('Delete topic "' + n.text + '" with its subtree?')) return;
    KB.tree.snapshot();
    n.parent.children = n.parent.children.filter(c => c !== n);
    KB.tree.forEach(x => KB.tree.model.nodes.delete(x.id), n);
    KB.tree.selectedIds.delete(n.id);
    KB.tree.afterMutation();
};

KB.tree.selectedNodes = function () {
    return [...KB.tree.selectedIds].map(id => KB.tree.node(id)).filter(Boolean);
};

KB.tree.deepCopy = function (n) {
    return {
        ...n,
        synonyms: n.synonyms.slice(),
        children: n.children.map(c => KB.tree.deepCopy(c)),
        matchedTasks: [], parent: null
    };
};

KB.tree.copy = function () {
    KB.tree.clipboard = KB.tree.selectedNodes().filter(n => !n.locked).map(n => KB.tree.deepCopy(n));
};

KB.tree.cut = function () {
    const nodes = KB.tree.selectedNodes().filter(n => !n.locked && n.parent);
    if (!nodes.length) return;
    KB.tree.snapshot();
    KB.tree.clipboard = nodes.map(n => KB.tree.deepCopy(n));
    nodes.forEach(n => {
        n.parent.children = n.parent.children.filter(c => c !== n);
        KB.tree.forEach(x => KB.tree.model.nodes.delete(x.id), n);
    });
    KB.tree.selectedIds.clear();
    KB.tree.afterMutation();
};

KB.tree.paste = function (target) {
    if (!KB.tree.clipboard.length) return;
    KB.tree.snapshot();
    KB.tree.clipboard.forEach(clip => {
        const attach = (src, parent) => {
            // fresh UUIDs for the whole pasted subtree, like reconnectNodesRecursively
            const node = { ...src, id: KB.uuid(), isa: parent.id, parent, matchedTasks: [], children: [] };
            KB.tree.model.nodes.set(node.id, node);
            src.children.forEach(c => node.children.push(attach(c, node)));
            return node;
        };
        target.children.unshift(attach(clip, target));
    });
    target.expanded = true;
    KB.tree.afterMutation();
};

KB.tree.group = function () {
    const nodes = KB.tree.selectedNodes().filter(n => n.parent && !n.locked);
    if (!nodes.length) return;
    const name = prompt('Name of the new group:');
    if (!name) return;
    KB.tree.snapshot();
    const parent = nodes[0].parent;
    const g = KB.tree.makeNode(name, parent);
    parent.children.unshift(g);
    nodes.forEach(n => {
        n.parent.children = n.parent.children.filter(c => c !== n);
        n.parent = g; n.isa = g.id;
        g.children.push(n);
    });
    g.expanded = true;
    KB.tree.afterMutation();
};

KB.tree.move = function (n, dir) {
    if (!n.parent) return;
    const sib = n.parent.children;
    const i = sib.indexOf(n);
    const j = Math.min(Math.max(0, i + dir), sib.length - 1);
    if (i === j) return;
    KB.tree.snapshot();
    sib.splice(i, 1);
    sib.splice(j, 0, n);
    KB.tree.afterMutation();
};

KB.tree.collapseToLevel = function (level) {
    const walk = (n, d) => {
        n.expanded = d < level;
        n.children.forEach(c => walk(c, d + 1));
    };
    if (KB.tree.model.root) walk(KB.tree.model.root, 0);
    KB.tree.render();
    KB.tree.persistSoon();
};

KB.tree.deselectAll = function () {
    KB.tree.selectedIds.clear();
    KB.tree.forEach(n => { n.checkStatus = 0; });
    KB.selectAll(true);
    KB.tree.render();
    KB.emit('selection-changed');
    KB.emit('task-shown');
};

/* ---------------- export / import ---------------- */
KB.tree.exportSubtree = function (n) {
    const pnk = KB.formats.serializePnk(n, { exportSubtree: true });
    KB.store.download((n.text || 'topics') + '.pnk', pnk);
    KB.store.download((n.text || 'topics') + '.json', KB.formats.serializeTopicsJson(n));
};

KB.tree.importTree = async function () {
    const f = await KB.store.pickTextFile('.pnk');
    if (!f) return;
    const terms = KB.formats.parsePnk(f.text);
    if (!terms.length) { alert('No topics found in ' + f.name); return; }
    KB.tree.snapshot();
    if (terms[0].text.includes('Kaimbo Language World')) {
        // replace the whole tree
        KB.tree.setModel(KB.formats.buildTree(terms));
    } else {
        // graft under the current root — with FRESH ids, so re-importing an own
        // export can never collide with nodes that still exist in the tree
        const current = KB.tree.model.root;
        const sub = KB.formats.buildTree(terms);
        if (sub.root) KB.tree.graftCopy(sub.root, current);
    }
    KB.tree.afterMutation();
};

// deep-attach a foreign subtree under parent, minting new UUIDs for every node
KB.tree.graftCopy = function (srcRoot, parent) {
    const attach = (src, par) => {
        const node = {
            ...src, id: KB.uuid(), isa: par.id, parent: par,
            synonyms: (src.synonyms || []).slice(), matchedTasks: [], children: []
        };
        KB.tree.model.nodes.set(node.id, node);
        (src.children || []).forEach(c => node.children.push(attach(c, node)));
        return node;
    };
    parent.children.push(attach(srcRoot, parent));
};

/* ---------------- context menu ---------------- */
KB.tree.contextMenu = function (e, n) {
    KB.app.showContextMenu(e.clientX, e.clientY, [
        ['New child topic from task', 'Shift+Click', () => KB.tree.newTopicFromTask(n)],
        ['New child topic', '', () => KB.tree.newTopic(n)],
        ['Edit topic', 'Double-click', () => KB.tree.editTopic(n)],
        ['Delete topic', '', () => KB.tree.deleteTopic(n)],
        ['Group selected topics', 'G', () => KB.tree.group()],
        '-',
        ['Cut', 'Ctrl+X', () => KB.tree.cut()],
        ['Copy', 'Ctrl+C', () => KB.tree.copy()],
        ['Paste', 'Ctrl+V', () => KB.tree.paste(n)],
        '-',
        ['Move topic up', 'Alt+↑', () => KB.tree.move(n, -1)],
        ['Move topic down', 'Alt+↓', () => KB.tree.move(n, 1)],
        ['Open/Collapse to level', 'Shift+1…9', () => { }],
        '-',
        ['Undo', 'Ctrl+Z', () => KB.tree.undo()],
        ['Redo', 'Ctrl+Shift+Z', () => KB.tree.redo()],
        '-',
        ['Deselect all nodes', 'Esc', () => KB.tree.deselectAll()],
        [(KB.settings.showAggregated ? '✓ ' : '') + 'Show aggregated counts', '', () => {
            KB.settings.showAggregated = !KB.settings.showAggregated; KB.saveSettings(); KB.tree.render();
        }],
        [(n.structure ? '✓ ' : '') + 'Toggle is structure node', '', () => {
            KB.tree.snapshot(); n.structure = !n.structure; KB.tree.afterMutation();
        }],
        [(n.locked ? '✓ ' : '') + 'Toggle lock node', '', () => {
            KB.tree.snapshot(); n.locked = !n.locked; KB.tree.afterMutation();
        }],
        '-',
        ['Export tree or subtree …', '', () => KB.tree.exportSubtree(n)],
        ['Import tree …', '', () => KB.tree.importTree()]
    ]);
};

/* ---------------- keyboard (tree pane focused) ---------------- */
KB.tree.handleKey = function (e) {
    const sel = KB.tree.selectedNodes()[0];
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? KB.tree.redo() : KB.tree.undo(); return true; }
    if (mod && e.key.toLowerCase() === 'x') { e.preventDefault(); KB.tree.cut(); return true; }
    if (mod && e.key.toLowerCase() === 'c') { e.preventDefault(); KB.tree.copy(); return true; }
    if (mod && e.key.toLowerCase() === 'v' && sel) { e.preventDefault(); KB.tree.paste(sel); return true; }
    if (e.key === 'g' && sel) { KB.tree.group(); return true; }
    if (e.altKey && e.key === 'ArrowUp' && sel) { e.preventDefault(); KB.tree.move(sel, -1); return true; }
    if (e.altKey && e.key === 'ArrowDown' && sel) { e.preventDefault(); KB.tree.move(sel, 1); return true; }
    if (e.shiftKey && /^[1-9]$/.test(e.key)) { KB.tree.collapseToLevel(+e.key); return true; }
    if ((e.key === 'Backspace' || e.key === 'Delete') && sel) { e.preventDefault(); KB.tree.deleteTopic(sel); return true; }
    if (e.key === 'Escape') { KB.tree.deselectAll(); return true; }
    return false;
};
