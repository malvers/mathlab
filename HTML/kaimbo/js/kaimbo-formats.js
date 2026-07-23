/* ============================================================
   KAIMBO formats — faithful parsers/serializers for the
   original KaimboStudio files:
     - Vocabulary.txt   (24-line task blocks, authoritative)
     - *.pnk            (OBO-style topic tree, authoritative)
     - Vocabulary.json / mytopics.json (write-only mirrors)
     - *.kaimbo         (manifest: list of .txt/.pnk files)

   Quirks kept ON PURPOSE for round-trip fidelity with Doc's data:
     - filler '0' lines at block positions 8/15/18/23
     - german/spanish/flexi have NO millis/level lines in .txt —
       they reset to now/0 on every load (original behavior)
     - the 'OPEND' misspelling in pnk comments (restore matches
       on substring 'OPEN')
   Deviations (documented): empty texts serialize as '-' so the
   line-positional reader can never derail; JSON mirrors are
   valid JSON (original wrote unescaped strings).
   ============================================================ */
'use strict';

KB.formats = {};

/* ================= Vocabulary.txt ================= */

KB.formats.VOCAB_HEADER = [
    '#',
    '# Pattern:',
    '#',
    '# Task: # <number> average error level <level> over all languages (not fully implemented)',
    '# Name of the background image',
    '# Task in german',
    '# error level',
    '# learn level',
    '# Task in italian',
    '# last learned date in milliseconds',
    '# error level',
    '# learn level',
    '# Task in spanish',
    '# error level',
    '# learn level',
    '# Task in french',
    '# error level',
    '# learn level',
    '# Task in english',
    '# last learned date in milliseconds',
    '# error level',
    '# learn level',
    '',
    '# if a line starts with <#> line is a comment',
    ''
].join('\n');

// parse Vocabulary.txt (or any exported task .txt) → array of tasks.
// opts.strict: validate the fixed block structure and THROW instead of
// installing a garbled parse (a stray line would shift all positional fields
// and the next save would persist the damage).
KB.formats.parseVocabulary = function (text, opts = {}) {
    const lines = text.split(/\r?\n/);
    const tasks = [];
    let i = 0;
    const now = Date.now();
    const fail = msg => { throw new Error('Vocabulary parse error at line ' + (i + 1) + ': ' + msg); };
    while (i < lines.length) {
        const line = lines[i];
        if (!line.trim() || line.startsWith('#')) { i++; continue; }
        if (!line.startsWith('Task:')) {
            if (opts.strict) fail('expected "Task:" block start, got: ' + JSON.stringify(line.slice(0, 60)));
            i++; continue;
        }
        // 24-line block, positional
        const block = lines.slice(i, i + 24);
        if (block.length < 24) {
            if (opts.strict) fail('file ends inside a task block (' + block.length + ' of 24 lines)');
            break;
        }
        if (opts.strict) {
            // filler lines and the image-flag line are fixed anchors of the format
            [7, 14, 17, 22].forEach(p => {
                if (block[p].trim() !== '0') fail('task block misaligned — expected filler "0" at offset ' + p + ', got ' + JSON.stringify(block[p]));
            });
            if (!block[23].includes('IMAGE')) fail('expected GOOD IMAGE/NEED NEW IMAGE, got ' + JSON.stringify(block[23]));
        }
        const t = KB.newTask();
        const idx = line.lastIndexOf(' error level ');
        t.averageErrorLevel = idx >= 0 ? parseInt(line.slice(idx + 13), 10) || 0 : 0;
        t.backgroundImageName = block[1];
        t.zoom = parseFloat(block[2]) || 1.0;
        t.right = parseInt(block[3], 10) || 0;
        t.down = parseInt(block[4], 10) || 0;
        t.german = block[5];
        t.germanRepeats = parseInt(block[6], 10) || 0;
        /* block[7] filler '0' */
        t.italian = block[8];
        t.lastLearnedItalianInMillis = parseInt(block[9], 10) || now;
        t.italianRepeats = parseInt(block[10], 10) || 0;
        t.learnLevelItalianInDays = parseInt(block[11], 10) || 0;
        t.spanish = block[12];
        t.spanishRepeats = parseInt(block[13], 10) || 0;
        /* block[14] filler */
        t.flexi = block[15];
        t.flexiRepeats = parseInt(block[16], 10) || 0;
        /* block[17] filler */
        t.english = block[18];
        t.lastLearnedEnglishInMillis = parseInt(block[19], 10) || now;
        t.englishRepeats = parseInt(block[20], 10) || 0;
        t.learnLevelEnglishInDays = parseInt(block[21], 10) || 0;
        /* block[22] filler */
        t.needNewImage = (block[23] || '').includes('NEED NEW IMAGE');
        // german/spanish/flexi millis+level are NOT in the file → stay at now/0 (faithful)
        tasks.push(t);
        i += 24;
    }
    return tasks;
};

const vSafe = s => { s = String(s == null ? '-' : s); return s.trim() === '' ? '-' : s.replace(/\r?\n/g, ' '); };
// Java Double.toString style: integers get a trailing '.0' (byte-faithful zoom lines)
const vZoom = z => Number.isInteger(z) ? z.toFixed(1) : String(z);

KB.formats.serializeVocabulary = function (tasks) {
    const out = ['# Number of tasks: ' + tasks.length, KB.formats.VOCAB_HEADER];
    tasks.forEach((t, n) => {
        const avg = Math.floor((t.germanRepeats + t.italianRepeats + t.spanishRepeats + t.englishRepeats + t.flexiRepeats) / 5);
        out.push(
            'Task: ' + (n + 1) + ' average error level ' + avg,
            t.backgroundImageName || KB.PLACEHOLDER_IMAGE,
            vZoom(t.zoom), String(t.right), String(t.down),
            vSafe(t.german), String(t.germanRepeats), '0',
            vSafe(t.italian), String(t.lastLearnedItalianInMillis), String(t.italianRepeats), String(t.learnLevelItalianInDays),
            vSafe(t.spanish), String(t.spanishRepeats), '0',
            vSafe(t.flexi), String(t.flexiRepeats), '0',
            vSafe(t.english), String(t.lastLearnedEnglishInMillis), String(t.englishRepeats), String(t.learnLevelEnglishInDays),
            '0',
            t.needNewImage ? 'NEED NEW IMAGE' : 'GOOD IMAGE',
            ''
        );
    });
    return out.join('\n') + '\n';
};

// Vocabulary.json mirror (write-only in the original; kept for the mobile app)
KB.formats.serializeVocabularyJson = function (tasks) {
    const arr = tasks.map((t, n) => {
        const avg = Math.floor((t.germanRepeats + t.italianRepeats + t.spanishRepeats + t.englishRepeats + t.flexiRepeats) / 5);
        const o = {};
        o['Task: ' + (n + 1)] = 'average error level ' + avg;
        o['image name'] = t.backgroundImageName;
        o.zoom = String(t.zoom); o.right = String(t.right); o.down = String(t.down);
        KB.LANGS.forEach(l => {
            const cap = KB.LANG_META[l].cap;
            o[l] = String(t[l]);
            o['lastLearned' + cap + 'InMillis'] = String(KB.lastLearned(t, l));
            o[l + 'Repeats'] = String(KB.reps(t, l));
            o['learnLevel' + cap + 'InDays'] = String(KB.learnLevel(t, l));
        });
        o.imageInfo = t.needNewImage ? 'NEED NEW IMAGE' : 'GOOD IMAGE';
        o.sorting = KB.letterCombi(n);
        return o;
    });
    return JSON.stringify({ vocabulary: arr }, null, 1);
};

/* ================= .pnk topic tree ================= */

/* parse pnk text → flat list of {id, isa, text, synonyms[], comment} in file order.
   Root/userroot preamble (first 9 physical lines) is skipped like the original. */
KB.formats.parsePnk = function (text) {
    const lines = text.split(/\r?\n/);
    const terms = [];
    let cur = null;
    for (let i = 9; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;
        if (line.startsWith('#')) continue;
        if (line.startsWith('[Term]')) { cur = { id: '', isa: '', text: '', synonyms: [], comment: '' }; terms.push(cur); continue; }
        if (!cur) continue;
        if (line.startsWith('id: ')) cur.id = line.slice(4);
        else if (line.startsWith('name: ')) cur.text = line.slice(6);
        else if (line.startsWith('name:')) cur.text = '';
        else if (line.startsWith('synonym: ')) cur.synonyms.push(line.slice(9));
        else if (line.startsWith('is_a: ')) cur.isa = line.slice(6);
        else if (line.startsWith('comment: ')) cur.comment = line.slice(9);
    }
    return terms.filter(t => t.id);
};

/* build a tree from the flat list: id→node map keyed on is_a (file order = sibling order).
   Replaces the fragile Java buildTree (substring matching) — same result on valid files. */
KB.formats.buildTree = function (terms) {
    const nodes = new Map();
    terms.forEach(t => {
        nodes.set(t.id, {
            id: t.id, isa: t.isa, text: t.text,
            synonyms: t.synonyms.slice(), comment: t.comment || '',
            expanded: /OPEN/.test(t.comment || ''),
            structure: /STRUCTURENODE/.test(t.comment || ''),
            locked: /LOCKED/.test(t.comment || ''),
            checkStatus: /SELECTED/.test(t.comment || '') ? 1 : 0,
            children: [], parent: null, matchedTasks: [], aggregated: 0
        });
    });
    let root = null;
    const orphans = [];
    terms.forEach(t => {
        const node = nodes.get(t.id);
        const parent = nodes.get(t.isa);
        if (parent) { node.parent = parent; parent.children.push(node); }
        else if (!root) root = node;   // first term after preamble = displayed root
        else orphans.push(node);       // parent missing (second userroot child, damaged isa, …)
    });
    // never drop terms silently — a dropped branch would be DELETED on the next save.
    // Orphans are grafted under the root, preserving file order.
    if (root && orphans.length) {
        orphans.forEach(n => { n.parent = root; n.isa = root.id; root.children.push(n); });
        if (typeof KB !== 'undefined' && KB.dbg) KB.dbg('pnk: ' + orphans.length + ' orphan topic(s) re-attached under the root');
    }
    return { root, nodes };
};

/* serialize tree → pnk text (pre-order DFS, preamble + per-node blocks) */
KB.formats.serializePnk = function (root, opts = {}) {
    const blocks = [];
    let count = 2; // root + userroot
    const walk = (node, isaOverride) => {
        count++;
        const lines = ['[Term]', 'id: ' + node.id, 'name: ' + node.text];
        node.synonyms.forEach(s => lines.push('synonym: ' + s));
        const isa = isaOverride !== undefined ? isaOverride : node.isa;
        if (isa) {
            lines.push('is_a: ' + isa);
            let flag = node.children.length === 0 ? 'LEAF' : (node.expanded ? 'OPEND' : 'CLOSED');
            if (node.structure) flag += ' STRUCTURENODE';
            if (node.checkStatus > 0) flag += ' SELECTED';
            if (node.locked) flag += ' LOCKED';
            if (node.children.length > 0 && node.children.every(c => c.children.length === 0)) flag += ' LEAFSONLY';
            lines.push('comment: ' + flag + ' CHILDCOUNT ' + node.children.length);
        }
        blocks.push(lines.join('\n'));
        node.children.forEach(c => walk(c));
    };
    walk(root, opts.exportSubtree ? 'userroot' : undefined);
    const head = '# Total number of topics: ' + count + '\n' +
        '[Term]\nid: root\nname:\n\n' +
        '[Term]\nid: userroot\nname: My topics\nis_a: root\n';
    return head + '\n' + blocks.join('\n\n') + '\n';
};

/* topics JSON mirror (write-only) — pre-order, sorting keys 'aaaa'.. */
KB.formats.serializeTopicsJson = function (root) {
    const arr = [
        { id: 'root', name: '', sorting: 'aaaa' },
        { id: 'userroot', name: 'My topics', is_a: 'root', sorting: 'aaab' }
    ];
    let count = 1;
    const walk = node => {
        count++;
        const leaf = node.children.length === 0;
        let comment = (node.expanded ? 'OPEND' : 'CLOSED') + (leaf ? ' LEAF' : '');
        arr.push({
            id: node.id, name: node.text,
            ...(node.synonyms.length ? { synonym: node.synonyms[0] } : {}),
            is_a: node.isa, comment,
            childcount: node.children.length,
            leafsonly: node.children.length > 0 && node.children.every(c => c.children.length === 0),
            sorting: KB.letterCombi(count)
        });
        node.children.forEach(walk);
    };
    walk(root);
    return JSON.stringify({ Term: arr }, null, 1);
};

/* ================= .kaimbo manifest ================= */
KB.formats.parseKaimboManifest = function (text) {
    return text.split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#') && !l.startsWith('//'));
};
