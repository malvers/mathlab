/* buch-nl.js — Dutch for the widgets of the textbooks, in the Dutch editions (HTML/buch/<book>-nl/, <html lang="nl">).
 * Package arch3 (08.11.2026): the architecture for three new languages at once - Portuguese (Portugal) pt, Dutch nl,
 * Turkish tr -, with BGY 11 (mathe11-nl, block nl-1) as the first book; tools/buch-nl/README.md.
 *
 * The sibling of js/buch-fr.js (and of js/buch-it.js, js/buch-es.js, js/buch-en.js), with the same mechanics: the widget
 * modules (js/buch-funktionen.js, …) and the add-ons in the header (Solita, "Fehler melden") write German, and this file
 * translates what they write at the moment they write it: innerHTML, insertAdjacentHTML, textContent, title, aria-label,
 * placeholder and canvas text. js/buch.js itself has its Dutch words inline (Buch.t(de, en, es, it, fr, sw, pt, nl, tr),
 * Buch.lang === 'nl'). A copy and not a shared core: the other engines stay byte for byte as they are; the engine part
 * below ("the module files" up to the end) is the same code as in js/buch-fr.js, js/buch-es.js and js/buch-it.js - change
 * all of them or none.
 *
 * The words of each widget module are in their own file, js/buch-nl/<module>.js for js/buch-<module>.js, which the
 * Dutch page loads right after the module and which registers itself with BuchNL.add(name, { word, phrase, rule }).
 *   WORD    a whole label (button, heading, cell, attribute, canvas text) → its Dutch
 *   PHRASE  German words and sentence pieces inside longer strings, exactly as the widget source writes them
 *   RULE    patterns that change the word order or the notation; order: the rules here, then the rules of the module
 *           files in load order, then the header rules here
 * Numbers are NOT converted: Dutch writes them like German, with a decimal comma (Buch.dot is false). Every rule needs
 * "\mid" or ";\," around the numbers - an SVG path "88,4 66,2" or "88.4,664.6" can never match (tools/buch-es/auftrag.md,
 * section 5). Canvas text keeps its decimal comma.
 * Points and intervals the Dutch school way (havo/vwo): points (1, 2), with a decimal comma (1,5; 2); closed intervals
 * [1, 2], open ends with angle brackets: ]1;\,2[ → ⟨1, 2⟩, [1;\,2[ → [1, 2⟩; the set bar stays ({x ∈ ℝ | x ≥ 0}); percent
 * without a space (30%), as Dutch writes it. The letters of the Dutch school formulas (y = ax + b, b · g^x, a(x - p)^2 + q
 * with the top T(p, q), a + b sin(c(x - d)), ^g log, the solution set V) are in the module files.
 * node tools/buch-en/check.mjs --lang nl finds German widget sentences without Dutch, and with ?debug every string
 * that still looks German is listed in the debug window ("[nl] still German: …").
 * Only pages with <html lang="nl"> load this file, before js/buch.js. The other books never see it.
 */
(function () {
    'use strict';
    if (!/^nl/i.test(document.documentElement.lang || '')) return;

    // ---------- whole labels, shared ----------
    const WORD = {
        // js/buch-plot.js, shared
        'Funktionsgraph': 'Grafiek van de functie', 'Funktion': 'Functie', 'Beispiel': 'Voorbeeld', 'Summe': 'Som',
        'Zurücksetzen': 'Opnieuw', 'Zurück': 'Ongedaan maken', 'Tipp': 'Tip', 'Prüfen': 'Controleren', 'Umformung': 'Bewerking',
        'linear': 'lineair', 'exponentiell': 'exponentieel', 'quadratisch': 'kwadratisch', 'Modell': 'Model',
        // the header: "Fehler melden" (js/buch-feedback.js) and Solita (js/buch-solita.js, js/solita-frage.js)
        'Fehler melden': 'Fout melden', 'Fehler melden: einsprechen oder tippen': 'Fout melden: inspreken of typen',
        'Schließen (Esc)': 'Sluiten (Esc)', 'Schließen': 'Sluiten', 'Einsprechen': 'Inspreken', 'Zuhören beenden': 'Stoppen met luisteren',
        'Was ist falsch oder unklar? Sprich einfach los oder tippe.': 'Wat klopt er niet of is onduidelijk? Begin gewoon te praten of typ.',
        'Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21.': 'Bijvoorbeeld: in opgave 3 moet het 12 zijn, niet 21.',
        'Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.':
            'De spraakherkenning doet je browser. Alleen de tekst met de plek in het boek wordt opgeslagen, geen opname en geen naam.',
        'Senden': 'Versturen', 'Ich höre zu …': 'Ik luister …', 'Bitte erst etwas einsprechen oder tippen.': 'Spreek eerst iets in of typ iets.',
        'Wird gesendet …': 'Wordt verstuurd …', 'Danke! Deine Meldung ist angekommen.': 'Bedankt! Je melding is aangekomen.',
        'Gerade sind es zu viele Meldungen. Bitte später noch einmal.': 'Er zijn nu te veel meldingen. Probeer het later nog eens.',
        'Das hat nicht geklappt. Bitte später noch einmal.': 'Dat is niet gelukt. Probeer het later nog eens.',
        'Keine Verbindung. Bitte später noch einmal.': 'Geen verbinding. Probeer het later nog eens.',
        'Frage sprechen': 'Vraag inspreken', 'Passwort zeigen': 'Wachtwoord tonen', 'Passwort verbergen': 'Wachtwoord verbergen',
        'Stimme anhalten': 'Stem stoppen', 'Frage senden': 'Vraag versturen', 'Passwort': 'Wachtwoord',
        'Passwort – wird auf diesem Gerät gemerkt': 'Wachtwoord – wordt op dit apparaat onthouden', 'Passwort bestätigen': 'Wachtwoord bevestigen',
        'Das Passwort gilt nicht mehr.': 'Het wachtwoord is niet meer geldig.',
        // the colour scheme button in the header (js/farbschema.js): its label names the next scheme
        'Blau': 'Blauw', 'Grau': 'Grijs', 'Hell': 'Licht', 'Farbschema Blau einschalten': 'Kleurenschema blauw inschakelen',
        'Farbschema Grau einschalten': 'Kleurenschema grijs inschakelen', 'Farbschema Hell einschalten': 'Kleurenschema licht inschakelen'
    };

    // ---------- pieces of sentences, shared ----------
    const PHRASE = [
        // used by more than one module: graphquiz (funktionen), vierfeld-trainer (stochastik)
        ['richtig', 'goed'],
        // header; Solita's invitations "Frag Solita zu dieser Stelle im Buch" (the rule below turns "Frag Solita" first)
        ['Fehler<br>melden', 'Fout<br>melden'], ['Zur Markierung in ', 'Over je markering in '], ['Deine Frage an ', 'Je vraag aan '],
        [' zu dieser Stelle im Buch', ' over deze plek in het boek'], [' zu dieser Stelle', ' over deze plek'], [' zur Markierung', ' over je markering']
    ];

    // ---------- word order and notation ----------
    // a number as the German widgets write it: 2, -3, −3, 1,5 or in TeX 1{,}5 (Dutch keeps all of them)
    const NUM = '[-−]?\\d+(?:(?:\\{,\\}|,)\\d+)?';
    // an end of an interval: a number, ±∞ or a letter (a, b)
    const END = '(?:' + NUM + '|[-−+]?\\\\infty|[a-z])';
    const DEC = /\{,\}|\d,\d/;            // a decimal comma in a coordinate → the coordinates are separated by a semicolon
    const sep = parts => parts.some(p => DEC.test(p)) ? '; ' : ', ';
    const RULE = [
        // sets keep their bar: {x ∈ ℝ | x ≥ 0}
        // points: every \mid inside round brackets (one level of brackets inside, Q(x \mid f(x)); \left( … \right) too)
        [/\(((?:[^()$]|\([^()$]*\))*?\\mid(?![A-Za-z])(?:[^()$]|\([^()$]*\))*)\)/g, (m, inner) => {
            const parts = inner.split(/ ?\\mid(?![A-Za-z]) ?/);
            return '(' + parts.join(sep(parts)) + ')';
        }],
        // intervals the Dutch way, open ends with angle brackets: [1;\,2] → [1, 2], ]1;\,2[ → ⟨1, 2⟩, [1;\,2[ → [1, 2⟩,
        // [0{,}5;\,3] → [0{,}5; 3]
        [new RegExp('([\\[\\]])(' + END + ');\\\\,(' + END + ')([\\[\\]])', 'g'),
            (m, a, x, y, b) => (a === '[' ? '[' : '\\langle ') + x + sep([x, y]) + y + (b === ']' ? ']' : ' \\rangle')]
    ];
    // after the rules of the module files
    const RULE_LAST = [
        // header
        [/^Zu (?=\S)/, 'Over '], [/\bFrag (Solita|Doc)\b/g, 'Vraag het $1'], [/Klick: zu (Solita|Doc) wechseln/g, 'Klik: naar $1 wisselen'],
        [/Einmal das Passwort, dann kann (Solita|Doc) antworten\./g, 'Eén keer het wachtwoord, dan kan $1 antwoorden.'],
        // the AI marks in Solita's field (js/solita-frage.js): "Es antwortet Claude Haiku und DeepSeek"
        [/^Es antwortet (.+)$/, (m, w) => (/ und /.test(w) ? 'Er antwoorden ' : 'Er antwoordt ') + w.replace(/ und /g, ' en ')]
    ];
    // after the pieces: Dutch keeps the decimal comma, but writes percent without a space ("30 %" → "30%", "30\,\%" → "30\%")
    const POST = [[/(\d)[ \u00a0\u202f]%/g, '$1%'], [/\\,\\%/g, '\\%']];

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
            Object.keys(d.word).forEach(k => { if (DEBUG && k in WORDS && WORDS[k] !== d.word[k]) say('[nl] ' + d.name + ' changes "' + k + '": ' + WORDS[k] + ' → ' + d.word[k]); });
            d.phrase.forEach(([de]) => { if (DEBUG && MAP.has(de) && MAP.get(de) !== new Map(d.phrase).get(de)) say('[nl] ' + d.name + ' changes "' + de + '"'); });
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
                say('[nl] still German: ' + r.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
            }
        }
        return r;
    }
    const DEBUG = new URLSearchParams(location.search).has('debug');
    function say(msg) {
        try { if (window.Buch && Buch.dbg) Buch.dbg(msg); } catch (_) { }
        console.debug('[buch-nl] ' + msg);
    }
    // tools/buch-en/check.mjs --lang nl reads the registered files through dicts
    window.BuchNL = { tr: s => tr(s, 'h'), plain: s => tr(s, 'p'), add, dicts: DICTS };

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
