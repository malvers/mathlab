/* buch-sw.js — Swahili for the widgets of the textbooks, in the Swahili editions (HTML/buch/<book>-sw/, <html lang="sw">).
 * Doc, 03.11.2026: "übersetz mal bitte BGY11 in Suaheli (Kenia) ich habe da "Prüfer" ob wir gut genug in der Sprache sind"
 * (package SW0: this file, the start page of mathe11-sw, the tools; the book: sw-1, tools/buch-sw/README.md)
 *
 * The sibling of js/buch-en.js (and of js/buch-es.js, js/buch-it.js, js/buch-fr.js), with the same mechanics: the widget
 * modules (js/buch-funktionen.js, …) and the add-ons in the header (Solita, "Fehler melden") write German, and this file
 * translates what they write at the moment they write it: innerHTML, insertAdjacentHTML, textContent, title, aria-label,
 * placeholder and canvas text. js/buch.js itself has its Swahili words inline (Buch.t(de, en, es, it, fr, sw)).
 * A copy and not a shared core, as for the other languages: the other engines stay byte for byte as they are. The engine
 * part below ("the module files" up to the end) is the code of js/buch-en.js, because Kenya writes numbers as English
 * does: a decimal point, a comma between thousands, no space before percent (0.5 · 10,000 · 30%); Buch.fmt does the same
 * for Swahili (Buch.dot).
 *
 * The words of each widget module are in their own file, js/buch-sw/<module>.js for js/buch-<module>.js, which the
 * Swahili page loads right after the module and which registers itself with BuchSW.add(name, { word, phrase, rule }).
 *   WORD    a whole label (button, heading, cell, attribute, canvas text) → its Swahili
 *   PHRASE  German words and sentence pieces inside longer strings, exactly as the widget source writes them
 *   RULE    patterns that change the word order or the notation; order: the number rules here, then the rules of the
 *           module files in load order, then the header rules here
 * Kiswahili sanifu as Kenyan schools teach it, the pupil is addressed with "wewe" (imperative singular: "Hesabu", "Chora").
 * Terms: tools/buch-sw/istilahi.md. Points and intervals the Kenyan school way (the English one):
 *   every \mid of a widget becomes a comma - S(1 \mid 2) → S(1, 2), Q(x \mid f(x)) → Q(x, f(x)) - except inside a set
 *   \{ … \}: {x ∈ ℝ | x ≥ 0} keeps its bar; intervals [1;\,2] → [1, 2], ]1;\,2[ → (1, 2), [1;\,2[ → [1, 2).
 * node tools/buch-en/check.mjs --lang sw finds German widget sentences without Swahili, and with ?debug every string
 * that still looks German is listed in the debug window ("[sw] still German: …").
 * Only pages with <html lang="sw"> load this file, before js/buch.js. The other books never see it.
 */
(function () {
    'use strict';
    if (!/^sw/i.test(document.documentElement.lang || '')) return;

    // ---------- whole labels, shared ----------
    const WORD = {
        // js/buch-plot.js, shared
        'Funktionsgraph': 'Grafu ya fanksheni', 'Funktion': 'Fanksheni', 'Beispiel': 'Mfano', 'Summe': 'Jumla',
        'Zurücksetzen': 'Anza upya', 'Zurück': 'Tendua', 'Tipp': 'Dokezo', 'Prüfen': 'Kagua', 'Umformung': 'Hatua ya kubadilisha',
        // growth curves and regression models: the class of "ukuaji" (growth) and "modeli" (model)
        'linear': 'wa mstari', 'exponentiell': 'wa kipeo', 'quadratisch': 'wa kipeo cha pili', 'Modell': 'Modeli',
        // the header: "Fehler melden" (js/buch-feedback.js) and Solita (js/buch-solita.js, js/solita-frage.js)
        'Fehler melden': 'Ripoti kosa', 'Fehler melden: einsprechen oder tippen': 'Ripoti kosa: sema au andika',
        'Schließen (Esc)': 'Funga (Esc)', 'Schließen': 'Funga', 'Einsprechen': 'Sema', 'Zuhören beenden': 'Acha kusikiliza',
        'Was ist falsch oder unklar? Sprich einfach los oder tippe.': 'Nini si sahihi au hakieleweki? Anza tu kusema, au andika.',
        'Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21.': 'Kwa mfano: Katika zoezi la 3 inapaswa kuwa 12, si 21.',
        'Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.':
            'Kivinjari chako ndicho kinachotambua sauti. Kinachohifadhiwa ni maandishi tu pamoja na mahali pake kitabuni: hakuna rekodi ya sauti, hakuna jina.',
        'Senden': 'Tuma', 'Ich höre zu …': 'Ninasikiliza …', 'Bitte erst etwas einsprechen oder tippen.': 'Tafadhali sema au andika kitu kwanza.',
        'Wird gesendet …': 'Inatumwa …', 'Danke! Deine Meldung ist angekommen.': 'Asante! Ripoti yako imefika.',
        'Gerade sind es zu viele Meldungen. Bitte später noch einmal.': 'Kwa sasa kuna ripoti nyingi mno. Tafadhali jaribu tena baadaye.',
        'Das hat nicht geklappt. Bitte später noch einmal.': 'Imeshindikana. Tafadhali jaribu tena baadaye.',
        'Keine Verbindung. Bitte später noch einmal.': 'Hakuna muunganisho. Tafadhali jaribu tena baadaye.',
        'Frage sprechen': 'Sema swali lako', 'Passwort zeigen': 'Onyesha nenosiri', 'Passwort verbergen': 'Ficha nenosiri',
        'Stimme anhalten': 'Simamisha sauti', 'Frage senden': 'Tuma swali', 'Passwort': 'Nenosiri',
        'Passwort – wird auf diesem Gerät gemerkt': 'Nenosiri – litakumbukwa kwenye kifaa hiki', 'Passwort bestätigen': 'Thibitisha nenosiri',
        'Das Passwort gilt nicht mehr.': 'Nenosiri hili halitumiki tena.',
        // the colour scheme button in the header (js/farbschema.js): its label names the next scheme
        'Blau': 'Bluu', 'Grau': 'Kijivu', 'Hell': 'Angavu', 'Farbschema Blau einschalten': 'Washa rangi za bluu',
        'Farbschema Grau einschalten': 'Washa rangi za kijivu', 'Farbschema Hell einschalten': 'Washa rangi angavu'
    };

    // ---------- pieces of sentences, shared ----------
    const PHRASE = [
        // used by more than one module: graphquiz (funktionen), vierfeld-trainer (stochastik)
        ['richtig', 'sahihi'],
        // header; Solita's invitations "Frag Solita zu dieser Stelle im Buch" (the rule below turns "Frag Solita" first)
        ['Fehler<br>melden', 'Ripoti<br>kosa'], ['Zur Markierung in ', 'Kuhusu ulichochagua katika '], ['Deine Frage an ', 'Swali lako kwa '],
        [' zu dieser Stelle im Buch', ' kuhusu sehemu hii ya kitabu'], [' zu dieser Stelle', ' kuhusu sehemu hii'], [' zur Markierung', ' kuhusu ulichochagua']
    ];

    // ---------- word order and notation ----------
    // a number after the first rules have given it its decimal point: 2, -3, −3, 1.5
    const NUM = '[-−]?\\d+(?:\\.\\d+)?';
    const RULE = [
        // numbers first: thousands with a narrow space (toLocaleString('de-DE')) → 10,000; other narrow spaces → plain ones
        [/(\d) (?=\d{3}(?!\d))/g, '$1,'], [/ /g, ' '], [/(\d) (\d{3}) Punkte/g, '$1,$2 Punkte'],
        // decimal commas that the widget source writes by hand in TeX: 4{,}905 → 4.905
        [/(\d)\{,\}(\d)/g, '$1.$2'],
        // a product of two numbers in TeX with the Kenyan multiplication sign: 2 \cdot 15 → 2 \times 15 (\cdot stays
        // between letters and in front of a function: 4.28 \cdot \sin, k \cdot \pi)
        [/(\d) ?\\cdot ?(?=\d)/g, '$1 \\times '],
        // points: every \mid → a comma, whatever the coordinates are; not inside a set \{ … \} of the same formula
        // ("\{\, x \in \mathbb{R} \mid x \geq 0 \,\}" keeps its bar), never \middle
        [/(?<!\\\{(?:(?!\\\})[^$])*) ?\\mid(?![A-Za-z]) ?/g, ', '],
        // intervals the English way: [1;\,2] → [1, 2], ]0.5;\,3[ → (0.5, 3), [1;\,2[ → [1, 2), ]1;\,2] → (1, 2]
        [new RegExp('([\\[\\]])(' + NUM + ');\\\\,(' + NUM + ')([\\[\\]])', 'g'), (m, a, x, y, b) => (a === '[' ? '[' : '(') + x + ', ' + y + (b === ']' ? ']' : ')')]
    ];
    // after the rules of the module files
    const RULE_LAST = [
        // header
        [/^Zu (?=\S)/, 'Kuhusu '], [/\bFrag (Solita|Doc)\b/g, 'Muulize $1'], [/Klick: zu (Solita|Doc) wechseln/g, 'Bofya: hamia kwa $1'],
        [/Einmal das Passwort, dann kann (Solita|Doc) antworten\./g, 'Weka nenosiri mara moja, kisha $1 ataweza kujibu.'],
        // the AI marks in Solita's field (js/solita-frage.js): "Es antwortet Claude Haiku und DeepSeek"
        [/^Es antwortet (.+)$/, (m, w) => (/ und /.test(w) ? 'Wanaojibu: ' : 'Anayejibu: ') + w.replace(/ und /g, ' na ')]
    ];
    // after the pieces: the typography of percent as in English ("30 %" → "30%", "30\,\%" → "30\%")
    const POST = [[/(\d) %/g, '$1%'], [/\\,\\%/g, '\\%']];

    // ---------- the module files ----------
    const DICTS = [];
    let WORDS = WORD, MAP = new Map(), RULES = [], PHRASE_RE = null, dirty = true;
    function add(name, d) {
        DICTS.push({ name, word: d.word || {}, phrase: d.phrase || [], rule: d.rule || [] });
        dirty = true; memo.p.clear(); memo.h.clear();
    }

    // ---------- the engine ----------
    const LETTER = 'A-Za-zÄÖÜäöüß';
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    function compile() {
        WORDS = Object.assign({}, WORD); MAP = new Map(PHRASE); RULES = RULE.slice();
        DICTS.forEach(d => {
            // the same German translated differently by two files: the later one wins, ?debug says so
            Object.keys(d.word).forEach(k => { if (DEBUG && k in WORDS && WORDS[k] !== d.word[k]) say('[sw] ' + d.name + ' changes "' + k + '": ' + WORDS[k] + ' → ' + d.word[k]); });
            d.phrase.forEach(([de]) => { if (DEBUG && MAP.has(de) && MAP.get(de) !== new Map(d.phrase).get(de)) say('[sw] ' + d.name + ' changes "' + de + '"'); });
            Object.assign(WORDS, d.word); d.phrase.forEach(([de, en]) => MAP.set(de, en)); RULES.push(...d.rule);
        });
        RULES.push(...RULE_LAST);
        // one pass over the string: longest piece first, words never inside other words ("oben" not in "verschoben")
        const KEYS = Array.from(MAP.keys()).sort((a, b) => b.length - a.length);
        const ALT = KEYS.map(k => (new RegExp('^[' + LETTER + ']').test(k) ? '(?<![' + LETTER + '])' : '') + esc(k) +
            (new RegExp('[' + LETTER + ']$').test(k) ? '(?![' + LETTER + '])' : ''));
        PHRASE_RE = ALT.length ? new RegExp(ALT.join('|'), 'g') : null;
        dirty = false;
    }

    function word(s) {
        const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
        return Object.prototype.hasOwnProperty.call(WORDS, m[2]) ? m[1] + WORDS[m[2]] + m[3] : null;
    }
    const run = (s, list) => { list.forEach(([re, to]) => { s = s.replace(re, to); }); return s; };
    const pieces = s => PHRASE_RE ? s.replace(PHRASE_RE, k => MAP.get(k)) : s;
    function plain(s) {
        const w = word(s); if (w != null) return w;
        return run(pieces(run(s, RULES)), POST);
    }

    // the pieces never touch the inside of a tag (data-v="links" must stay "links"), except plain formatting tags,
    // which sentences run across ("geht <b>gleich viel</b> weg"): every other tag is parked while the pieces are replaced
    // a real tag starts with a letter or a slash: "$f(1) < 0$ und $f(2) > 0$" is maths, not a tag
    const TAG = /<(?=[A-Za-z\/!])(?!\/?(?:b|i|br)>)[^>]*>/g;
    const ATTR = /(\s(?:title|aria-label|placeholder|alt)=")([^"]*)(")/g;
    const SPLIT = /(<[A-Za-z\/!][^>]*>)/;
    const SPLIT_LABEL = /(<(?=[A-Za-z\/!])(?!\/?(?:b|i|br)>)[^>]*>)/;
    function html(s) {
        // whole labels between two tags first, before a piece ("und" → "and") can change a sentence that has its own English;
        // <b>, <i> and <br> belong to the sentence ("ist ein <b>Quadrat</b>"), so they do not cut it into labels here
        const done = [];
        s = s.split(SPLIT_LABEL).map(part => {
            if (part[0] === '<') return part;
            const w = word(part); return w == null ? part : '\u0003' + (done.push(w) - 1) + '\u0004';
        }).join('');
        s = run(s, RULES);
        const tags = [];
        s = s.replace(TAG, t => '\u0001' + (tags.push(t) - 1) + '\u0002');
        s = run(pieces(s), POST);
        s = s.replace(/\u0001(\d+)\u0002/g, (m, i) => tags[+i]).replace(/\u0003(\d+)\u0004/g, (m, i) => done[+i]);
        // whole labels: the text between two tags, and the words in title, aria-label, placeholder, alt
        return s.split(SPLIT).map(part => {
            if (part[0] === '<') return part.replace(ATTR, (all, a, v, b) => a + plain(v) + b);
            const w = word(part); return w != null ? w : part;
        }).join('');
    }

    // remembered: a widget draws the same labels again and again
    const memo = { p: new Map(), h: new Map() };
    function tr(s, kind) {
        // one difference to js/buch-en.js (as in js/buch-fr.js): a backslash counts too, so a bare interval "$[1;\,2]$" turns
        if (typeof s !== 'string' || !s || s.length > 20000 || !/[A-Za-zÄÖÜäöüß {\\]/.test(s)) return s;
        if (dirty) compile();
        const m = memo[kind];
        let r = m.get(s);
        if (r === undefined) {
            r = kind === 'h' ? html(s) : plain(s);
            if (m.size > 5000) m.clear();
            m.set(s, r);
            if (DEBUG && /[äöüÄÖÜß]|\b(der|die|das|und|nicht|ist|mit|von|für|auf|eine?)\b/.test(r.replace(/<[^>]*>/g, ' ').replace(/\$[^$]*\$/g, ' '))) {
                say('[sw] still German: ' + r.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
            }
        }
        return r;
    }
    const DEBUG = new URLSearchParams(location.search).has('debug');
    function say(msg) {
        try { if (window.Buch && Buch.dbg) Buch.dbg(msg); } catch (_) { }
        console.debug('[buch-sw] ' + msg);
    }
    // tools/buch-en/check.mjs --lang sw reads the registered files through dicts
    window.BuchSW = { tr: s => tr(s, 'h'), plain: s => tr(s, 'p'), add, dicts: DICTS };

    // ---------- where the widgets write ----------
    function hookSetter(proto, prop, kind) {
        const d = Object.getOwnPropertyDescriptor(proto, prop);
        if (!d || !d.set) return;
        Object.defineProperty(proto, prop, Object.assign({}, d, { set(v) { d.set.call(this, tr(v, kind)); } }));
    }
    hookSetter(Element.prototype, 'innerHTML', 'h');
    hookSetter(Node.prototype, 'textContent', 'p');
    hookSetter(HTMLElement.prototype, 'innerText', 'p');
    hookSetter(HTMLElement.prototype, 'title', 'p');
    hookSetter(HTMLInputElement.prototype, 'placeholder', 'p');
    hookSetter(HTMLTextAreaElement.prototype, 'placeholder', 'p');
    const insertHTML = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function (pos, s) { return insertHTML.call(this, pos, tr(s, 'h')); };
    const setAttr = Element.prototype.setAttribute;
    const TEXT_ATTR = { title: 1, 'aria-label': 1, placeholder: 1, alt: 1 };
    Element.prototype.setAttribute = function (name, v) { return setAttr.call(this, name, TEXT_ATTR[name] ? tr(String(v), 'p') : v); };

    // canvas: labels and numbers drawn by the widgets (a decimal comma between digits is always one there)
    const canvas = s => { if (typeof s !== 'string') return s; return tr(s, 'p').replace(/(\d),(\d)/g, '$1.$2'); };
    const C2D = CanvasRenderingContext2D.prototype;
    ['fillText', 'strokeText', 'measureText'].forEach(fn => {
        const orig = C2D[fn];
        C2D[fn] = function (s, ...rest) { return orig.call(this, canvas(s), ...rest); };
    });
})();
