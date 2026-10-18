/* buch-it.js — Italian for the widgets of the textbooks, in the Italian editions (HTML/buch/<book>-it/, <html lang="it">).
 * Doc, 18.10.2026: "schnappt ihr bitte zwei Agentinnen und macht die Übersetzung für die Mathebücher BGY elf zwölf
 * dreizehn. Bitte in Italienisch." (package IT0: this file, the start pages, the tools; the chapters: IT1–IT3)
 *
 * The sibling of js/buch-es.js (and of js/buch-en.js), with the same mechanics: the widget modules (js/buch-funktionen.js, …)
 * and the add-ons in the header (Solita, "Fehler melden") write German, and this file translates what they write at the
 * moment they write it: innerHTML, insertAdjacentHTML, textContent, title, aria-label, placeholder and canvas text.
 * js/buch.js itself has its Italian words inline (Buch.t(de, en, es, it), Buch.lang === 'it').
 * A copy and not a shared core, as for Spanish: js/buch-en.js and js/buch-es.js stay byte for byte as they are, so the
 * English and Spanish books cannot change; the engine part below ("the module files" up to the end) is the same code as
 * in js/buch-es.js - change all three or none.
 *
 * The words of each widget module are in their own file, js/buch-it/<module>.js for js/buch-<module>.js, which the
 * Italian page loads right after the module and which registers itself with BuchIT.add(name, { word, phrase, rule }).
 *   WORD    a whole label (button, heading, cell, attribute, canvas text) → its Italian
 *   PHRASE  German words and sentence pieces inside longer strings, exactly as the widget source writes them
 *   RULE    patterns that change the word order or the notation; order: the rules here, then the rules of the module
 *           files in load order, then the header rules here
 * Numbers are NOT converted: Italian writes them like German (0,5 · 10.000 · 30 %). Only points change their notation,
 * exactly as in Spanish: P(1 | 2) → P(1, 2) with whole numbers, P(1,5; 2) as soon as a coordinate has a decimal comma;
 * intervals the same ([1;\,2] → [1, 2], [0{,}5;\,3] stays). Every rule needs "\mid" or ";\," around the numbers - an SVG
 * path "88,4 66,2" or "88.4,664.6" can never match (tools/buch-es/auftrag.md, section 5).
 * node tools/buch-en/check.mjs --lang it finds German widget sentences without Italian, and with ?debug every string
 * that still looks German is listed in the debug window ("[it] still German: …").
 * Only pages with <html lang="it"> load this file, before js/buch.js. German, English and Spanish books never see it.
 */
(function () {
    'use strict';
    if (!/^it/i.test(document.documentElement.lang || '')) return;

    // ---------- whole labels, shared ----------
    const WORD = {
        // js/buch-plot.js, shared
        'Funktionsgraph': 'Grafico della funzione', 'Funktion': 'Funzione', 'Beispiel': 'Esempio', 'Summe': 'Totale',
        'Zurücksetzen': 'Azzera', 'Zurück': 'Annulla', 'Tipp': 'Suggerimento', 'Prüfen': 'Verifica', 'Umformung': 'Trasformazione',
        'linear': 'lineare', 'exponentiell': 'esponenziale', 'quadratisch': 'quadratica', 'Modell': 'Modello',
        // the header: "Fehler melden" (js/buch-feedback.js) and Solita (js/buch-solita.js, js/solita-frage.js)
        'Fehler melden': 'Segnala un errore', 'Fehler melden: einsprechen oder tippen': 'Segnala un errore: parla o scrivi',
        'Schließen (Esc)': 'Chiudi (Esc)', 'Schließen': 'Chiudi', 'Einsprechen': 'Parla', 'Zuhören beenden': 'Smetti di ascoltare',
        'Was ist falsch oder unklar? Sprich einfach los oder tippe.': 'Che cosa è sbagliato o poco chiaro? Parla pure o scrivi.',
        'Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21.': 'Per esempio: nell’esercizio 3 deve esserci 12, non 21.',
        'Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.':
            'Il riconoscimento vocale lo fa il tuo browser. Si salva solo il testo con il punto del libro, nessuna registrazione e nessun nome.',
        'Senden': 'Invia', 'Ich höre zu …': 'Ti ascolto …', 'Bitte erst etwas einsprechen oder tippen.': 'Prima di’ o scrivi qualcosa, per favore.',
        'Wird gesendet …': 'Invio in corso …', 'Danke! Deine Meldung ist angekommen.': 'Grazie! La tua segnalazione è arrivata.',
        'Gerade sind es zu viele Meldungen. Bitte später noch einmal.': 'In questo momento ci sono troppe segnalazioni. Riprova più tardi.',
        'Das hat nicht geklappt. Bitte später noch einmal.': 'Non ha funzionato. Riprova più tardi.',
        'Keine Verbindung. Bitte später noch einmal.': 'Nessuna connessione. Riprova più tardi.',
        'Frage sprechen': 'Di’ la tua domanda', 'Passwort zeigen': 'Mostra la password', 'Passwort verbergen': 'Nascondi la password',
        'Stimme anhalten': 'Ferma la voce', 'Frage senden': 'Invia la domanda', 'Passwort': 'Password',
        'Passwort – wird auf diesem Gerät gemerkt': 'Password – viene ricordata su questo dispositivo', 'Passwort bestätigen': 'Conferma la password',
        'Das Passwort gilt nicht mehr.': 'La password non è più valida.',
        // the colour scheme button in the header (js/farbschema.js): its label names the next scheme
        'Blau': 'Blu', 'Grau': 'Grigio', 'Hell': 'Chiaro', 'Farbschema Blau einschalten': 'Attiva i colori blu',
        'Farbschema Grau einschalten': 'Attiva i colori grigi', 'Farbschema Hell einschalten': 'Attiva i colori chiari'
    };

    // ---------- pieces of sentences, shared ----------
    const PHRASE = [
        // used by more than one module: graphquiz (funktionen), vierfeld-trainer (stochastik)
        ['richtig', 'corretto'],
        // header; Solita's invitations "Frag Solita zu dieser Stelle im Buch" (the rule below turns "Frag Solita" first)
        ['Fehler<br>melden', 'Segnala<br>un errore'], ['Zur Markierung in ', 'Sulla selezione in '], ['Deine Frage an ', 'La tua domanda a '],
        [' zu dieser Stelle im Buch', ' su questo punto del libro'], [' zu dieser Stelle', ' su questo punto'], [' zur Markierung', ' sulla selezione']
    ];

    // ---------- word order and notation ----------
    // a number as the German widgets write it: 2, -3, −3, 1,5 or in TeX 1{,}5 (Italian keeps all of them)
    const NUM = '[-−]?\\d+(?:(?:\\{,\\}|,)\\d+)?';
    const DEC = /,/;                       // a decimal comma in a coordinate → the coordinates are separated by a semicolon
    const sep = (...c) => c.some(x => DEC.test(x)) ? '; ' : ', ';
    const RULE = [
        // points: S(1 \mid 2) → S(1, 2), S(1{,}5 \mid 2) → S(1{,}5; 2), also in space: (1 \mid 2 \mid 3) → (1, 2, 3)
        [new RegExp('\\((' + NUM + ') \\\\mid (' + NUM + ') \\\\mid (' + NUM + ')\\)', 'g'), (m, a, b, c) => '(' + a + sep(a, b, c) + b + sep(a, b, c) + c + ')'],
        [new RegExp('\\((' + NUM + ') \\\\mid (' + NUM + ')\\)', 'g'), (m, a, b) => '(' + a + sep(a, b) + b + ')'],
        // intervals: [1;\,2] → [1, 2]; with a decimal comma the German semicolon stays: [0{,}5;\,3]
        [new RegExp('\\[(' + NUM + ');\\\\,(' + NUM + ')\\]', 'g'), (m, a, b) => DEC.test(a + b) ? m : '[' + a + ', ' + b + ']']
    ];
    // after the rules of the module files
    const RULE_LAST = [
        // header
        [/^Zu (?=\S)/, 'Riguardo a '], [/\bFrag (Solita|Doc)\b/g, 'Chiedi a $1'], [/Klick: zu (Solita|Doc) wechseln/g, 'Clic: passa a $1'],
        [/Einmal das Passwort, dann kann (Solita|Doc) antworten\./g, 'Inserisci la password una volta e $1 potrà rispondere.'],
        // the AI marks in Solita's field (js/solita-frage.js): "Es antwortet Claude Haiku und DeepSeek"
        [/^Es antwortet (.+)$/, (m, w) => (/ und /.test(w) ? 'Rispondono ' : 'Risponde ') + w.replace(/ und /g, ' e ')]
    ];
    // after the pieces: nothing - Italian keeps the German typography of numbers and percent ("30 %")
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
            Object.keys(d.word).forEach(k => { if (DEBUG && k in WORDS && WORDS[k] !== d.word[k]) say('[it] ' + d.name + ' changes "' + k + '": ' + WORDS[k] + ' → ' + d.word[k]); });
            d.phrase.forEach(([de]) => { if (DEBUG && MAP.has(de) && MAP.get(de) !== new Map(d.phrase).get(de)) say('[it] ' + d.name + ' changes "' + de + '"'); });
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
                say('[it] still German: ' + r.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
            }
        }
        return r;
    }
    const DEBUG = new URLSearchParams(location.search).has('debug');
    function say(msg) {
        try { if (window.Buch && Buch.dbg) Buch.dbg(msg); } catch (_) { }
        console.debug('[buch-it] ' + msg);
    }
    // tools/buch-en/check.mjs --lang it reads the registered files through dicts
    window.BuchIT = { tr: s => tr(s, 'h'), plain: s => tr(s, 'p'), add, dicts: DICTS };

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
