/* buch-tr.js — Turkish for the widgets of the textbooks, in the Turkish editions (HTML/buch/<book>-tr/, <html lang="tr">).
 * Package arch3 (08.11.2026): the architecture for three new languages at once - Portuguese (Portugal) pt, Dutch nl,
 * Turkish tr -, with BGY 11 (mathe11-tr, block tr-1) as the first book; tools/buch-tr/README.md.
 *
 * The sibling of js/buch-fr.js (and of js/buch-it.js, js/buch-es.js, js/buch-en.js), with the same mechanics: the widget
 * modules (js/buch-funktionen.js, …) and the add-ons in the header (Solita, "Fehler melden") write German, and this file
 * translates what they write at the moment they write it: innerHTML, insertAdjacentHTML, textContent, title, aria-label,
 * placeholder and canvas text. js/buch.js itself has its Turkish words inline (Buch.t(de, en, es, it, fr, sw, pt, nl, tr),
 * Buch.lang === 'tr'). A copy and not a shared core: the other engines stay byte for byte as they are; the engine part
 * below ("the module files" up to the end) is the same code as in js/buch-fr.js, js/buch-es.js and js/buch-it.js - change
 * all of them or none.
 *
 * The words of each widget module are in their own file, js/buch-tr/<module>.js for js/buch-<module>.js, which the
 * Turkish page loads right after the module and which registers itself with BuchTR.add(name, { word, phrase, rule }).
 *   WORD    a whole label (button, heading, cell, attribute, canvas text) → its Turkish
 *   PHRASE  German words and sentence pieces inside longer strings, exactly as the widget source writes them
 *   RULE    patterns that change the word order or the notation; order: the rules here, then the rules of the module
 *           files in load order, then the header rules here
 * Numbers are NOT converted: Turkish writes them like German, with a decimal comma (Buch.dot is false). Every rule needs
 * "\mid" or ";\," around the numbers - an SVG path "88,4 66,2" or "88.4,664.6" can never match (tools/buch-es/auftrag.md,
 * section 5). Canvas text keeps its decimal comma.
 * TODO tr: the point and interval notation of Turkish schools is still the provisional one of js/buch-pt.js
 *   (points (1, 2), with a decimal comma (1,5; 2); intervals [1, 2], ]1, 2[; the set bar stays) - decide it and change
 *   RULE below (Turkish schools write open intervals with round brackets, (1, 2) and [1, 2), and points (1, 2); decide what the BGY 11 pupils should see).
 * node tools/buch-en/check.mjs --lang tr finds German widget sentences without Turkish, and with ?debug every string
 * that still looks German is listed in the debug window ("[tr] still German: …").
 * Only pages with <html lang="tr"> load this file, before js/buch.js. The other books never see it.
 */
(function () {
    'use strict';
    if (!/^tr/i.test(document.documentElement.lang || '')) return;

    // ---------- whole labels, shared ----------
    // TODO tr: every Turkish word below is still the English placeholder - translate (the keys stay German)
    const WORD = {
        // js/buch-plot.js, shared
        'Funktionsgraph': 'Graph of the function', 'Funktion': 'Function', 'Beispiel': 'Example', 'Summe': 'Total',
        'Zurücksetzen': 'Reset', 'Zurück': 'Undo', 'Tipp': 'Hint', 'Prüfen': 'Check', 'Umformung': 'Transformation',
        'linear': 'linear', 'exponentiell': 'exponential', 'quadratisch': 'quadratic', 'Modell': 'Model',
        // the header: "Fehler melden" (js/buch-feedback.js) and Solita (js/buch-solita.js, js/solita-frage.js); TODO tr
        'Fehler melden': 'Report an error', 'Fehler melden: einsprechen oder tippen': 'Report an error: speak or type',
        'Schließen (Esc)': 'Close (Esc)', 'Schließen': 'Close', 'Einsprechen': 'Speak', 'Zuhören beenden': 'Stop listening',
        'Was ist falsch oder unklar? Sprich einfach los oder tippe.': 'What is wrong or unclear? Just start speaking or type.',
        'Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21.': 'For example: in exercise 3 it should say 12, not 21.',
        'Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.':
            'Your browser does the speech recognition. Only the text and the place in the book are saved, no recording and no name.',
        'Senden': 'Send', 'Ich höre zu …': 'Listening …', 'Bitte erst etwas einsprechen oder tippen.': 'Please say or type something first.',
        'Wird gesendet …': 'Sending …', 'Danke! Deine Meldung ist angekommen.': 'Thank you! Your report has arrived.',
        'Gerade sind es zu viele Meldungen. Bitte später noch einmal.': 'There are too many reports right now. Please try again later.',
        'Das hat nicht geklappt. Bitte später noch einmal.': 'That did not work. Please try again later.',
        'Keine Verbindung. Bitte später noch einmal.': 'No connection. Please try again later.',
        'Frage sprechen': 'Speak your question', 'Passwort zeigen': 'Show password', 'Passwort verbergen': 'Hide password',
        'Stimme anhalten': 'Stop the voice', 'Frage senden': 'Send question', 'Passwort': 'Password',
        'Passwort – wird auf diesem Gerät gemerkt': 'Password – remembered on this device', 'Passwort bestätigen': 'Confirm password',
        'Das Passwort gilt nicht mehr.': 'The password is no longer valid.',
        // the colour scheme button in the header (js/farbschema.js): its label names the next scheme; TODO tr
        'Blau': 'Blue', 'Grau': 'Grey', 'Hell': 'Light', 'Farbschema Blau einschalten': 'Switch to the blue colours',
        'Farbschema Grau einschalten': 'Switch to the grey colours', 'Farbschema Hell einschalten': 'Switch to the light colours'
    };

    // ---------- pieces of sentences, shared ----------
    // TODO tr: English placeholders
    const PHRASE = [
        // used by more than one module: graphquiz (funktionen), vierfeld-trainer (stochastik)
        ['richtig', 'correct'],
        // header; Solita's invitations "Frag Solita zu dieser Stelle im Buch" (the rule below turns "Frag Solita" first)
        ['Fehler<br>melden', 'Report<br>an error'], ['Zur Markierung in ', 'On the selection in '], ['Deine Frage an ', 'Your question to '],
        [' zu dieser Stelle im Buch', ' about this part of the book'], [' zu dieser Stelle', ' about this part'], [' zur Markierung', ' about the selection']
    ];

    // ---------- word order and notation ----------
    // a number as the German widgets write it: 2, -3, −3, 1,5 or in TeX 1{,}5 (Turkish keeps all of them)
    const NUM = '[-−]?\\d+(?:(?:\\{,\\}|,)\\d+)?';
    // an end of an interval: a number, ±∞ or a letter (a, b)
    const END = '(?:' + NUM + '|[-−+]?\\\\infty|[a-z])';
    const DEC = /\{,\}|\d,\d/;            // a decimal comma in a coordinate → the coordinates are separated by a semicolon
    const sep = parts => parts.some(p => DEC.test(p)) ? '; ' : ', ';
    const RULE = [
        // sets keep their bar here: {x ∈ ℝ | x ≥ 0} (TODO tr: or a colon, as in js/buch-pt.js?)
        // points: every \mid inside round brackets (one level of brackets inside, Q(x \mid f(x)); \left( … \right) too)
        [/\(((?:[^()$]|\([^()$]*\))*?\\mid(?![A-Za-z])(?:[^()$]|\([^()$]*\))*)\)/g, (m, inner) => {
            const parts = inner.split(/ ?\\mid(?![A-Za-z]) ?/);
            return '(' + parts.join(sep(parts)) + ')';
        }],
        // intervals: [1;\,2] → [1, 2], ]1;\,2[ → ]1, 2[, [0{,}5;\,3] → [0{,}5; 3]
        // TODO tr: Turkish schools write open intervals with round brackets, (1, 2) and [1, 2), and points (1, 2); decide what the BGY 11 pupils should see
        [new RegExp('([\\[\\]])(' + END + ');\\\\,(' + END + ')([\\[\\]])', 'g'), (m, a, x, y, b) => a + x + sep([x, y]) + y + b]
    ];
    // after the rules of the module files
    // TODO tr: English placeholders
    const RULE_LAST = [
        // header
        [/^Zu (?=\S)/, 'On '], [/\bFrag (Solita|Doc)\b/g, 'Ask $1'], [/Klick: zu (Solita|Doc) wechseln/g, 'Click: switch to $1'],
        [/Einmal das Passwort, dann kann (Solita|Doc) antworten\./g, 'Enter the password once, then $1 can answer.'],
        // the AI marks in Solita's field (js/solita-frage.js): "Es antwortet Claude Haiku und DeepSeek"
        [/^Es antwortet (.+)$/, (m, w) => 'Answering: ' + w.replace(/ und /g, ' and ')]
    ];
    // after the pieces: nothing - Turkish keeps the German decimal comma (TODO tr: and the space before percent, "30 %"?)
    const POST = [];

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
            Object.keys(d.word).forEach(k => { if (DEBUG && k in WORDS && WORDS[k] !== d.word[k]) say('[tr] ' + d.name + ' changes "' + k + '": ' + WORDS[k] + ' → ' + d.word[k]); });
            d.phrase.forEach(([de]) => { if (DEBUG && MAP.has(de) && MAP.get(de) !== new Map(d.phrase).get(de)) say('[tr] ' + d.name + ' changes "' + de + '"'); });
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
        // one difference to js/buch-en.js: a backslash counts too, so a bare interval "$[1;\,2]$" gets its comma
        if (typeof s !== 'string' || !s || s.length > 20000 || !/[A-Za-zÄÖÜäöüß {\\]/.test(s)) return s;
        if (dirty) compile();
        const m = memo[kind];
        let r = m.get(s);
        if (r === undefined) {
            r = kind === 'h' ? html(s) : plain(s);
            if (m.size > 5000) m.clear();
            m.set(s, r);
            if (DEBUG && /[äöüÄÖÜß]|\b(der|die|das|und|nicht|ist|mit|von|für|auf|eine?)\b/.test(r.replace(/<[^>]*>/g, ' ').replace(/\$[^$]*\$/g, ' '))) {
                say('[tr] still German: ' + r.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
            }
        }
        return r;
    }
    const DEBUG = new URLSearchParams(location.search).has('debug');
    function say(msg) {
        try { if (window.Buch && Buch.dbg) Buch.dbg(msg); } catch (_) { }
        console.debug('[buch-tr] ' + msg);
    }
    // tools/buch-en/check.mjs --lang tr reads the registered files through dicts
    window.BuchTR = { tr: s => tr(s, 'h'), plain: s => tr(s, 'p'), add, dicts: DICTS };

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

    // canvas: labels drawn by the widgets; numbers keep their decimal comma (unlike the English editions)
    const canvas = s => typeof s === 'string' ? tr(s, 'p') : s;
    const C2D = CanvasRenderingContext2D.prototype;
    ['fillText', 'strokeText', 'measureText'].forEach(fn => {
        const orig = C2D[fn];
        C2D[fn] = function (s, ...rest) { return orig.call(this, canvas(s), ...rest); };
    });
})();
