/* buch-fr.js — French for the widgets of the textbooks, in the French editions (HTML/buch/<book>-fr/, <html lang="fr">).
 * Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch. Fang mit BGY an."
 * (package FR0: this file, the start page of mathe11-fr, the tools; the books: fr-1 … fr-5, tools/buch-fr/README.md)
 *
 * The sibling of js/buch-it.js (and of js/buch-es.js, js/buch-en.js), with the same mechanics: the widget modules
 * (js/buch-funktionen.js, …) and the add-ons in the header (Solita, "Fehler melden") write German, and this file translates
 * what they write at the moment they write it: innerHTML, insertAdjacentHTML, textContent, title, aria-label, placeholder
 * and canvas text. js/buch.js itself has its French words inline (Buch.t(de, en, es, it, fr), Buch.lang === 'fr').
 * A copy and not a shared core, as for Spanish and Italian: js/buch-en.js, js/buch-es.js and js/buch-it.js stay byte for
 * byte as they are, so the other editions cannot change; the engine part below ("the module files" up to the end) is the
 * same code as in js/buch-es.js and js/buch-it.js - change all four or none.
 *
 * The words of each widget module are in their own file, js/buch-fr/<module>.js for js/buch-<module>.js, which the
 * French page loads right after the module and which registers itself with BuchFR.add(name, { word, phrase, rule }).
 *   WORD    a whole label (button, heading, cell, attribute, canvas text) → its French
 *   PHRASE  German words and sentence pieces inside longer strings, exactly as the widget source writes them
 *   RULE    patterns that change the word order or the notation; order: the rules here, then the rules of the module
 *           files in load order, then the header rules here
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Numbers are NOT converted: French writes them like German (0,5 · 10 000 · 30 %). Only points and intervals change
 * their notation, the French school way, always with a semicolon (tools/buch-fr/glossaire.md, section 4):
 *   every \mid of a widget becomes \,;\, - S(1 \mid 2) → S(1\,;\,2), (1{,}5 \mid 2 \mid 3) → (1{,}5\,;\,2\,;\,3),
 *   Q(x \mid f(x)) → Q(x\,;\,f(x)) - except inside a set \{ … \}: {x ∈ ℝ | x ≥ 0} keeps its bar;
 *   intervals [1;\,2] → [1\,;\,2], also ]1;\,2[ and the half-open ones.
 * No rule here can touch an SVG path ("88,4 66,2" or "88.4,664.6"): they need \mid, or ;\, between two brackets
 * (tools/buch-es/auftrag.md, section 5). Canvas text keeps its decimal comma.
 * node tools/buch-en/check.mjs --lang fr finds German widget sentences without French, and with ?debug every string
 * that still looks German is listed in the debug window ("[fr] still German: …").
 * Only pages with <html lang="fr"> load this file, before js/buch.js. German, English, Spanish and Italian books never see it.
 */
(function () {
    'use strict';
    if (!/^fr/i.test(document.documentElement.lang || '')) return;

    // ---------- whole labels, shared ----------
    const WORD = {
        // js/buch-plot.js, shared
        'Funktionsgraph': 'Courbe de la fonction', 'Funktion': 'Fonction', 'Beispiel': 'Exemple', 'Summe': 'Total',
        'Zurücksetzen': 'Réinitialiser', 'Zurück': 'Annuler', 'Tipp': 'Indice', 'Prüfen': 'Vérifier', 'Umformung': 'Transformation',
        // growth curves and regression models: feminine, as croissance / régression linéaire, quadratique, exponentielle
        'linear': 'linéaire', 'exponentiell': 'exponentielle', 'quadratisch': 'quadratique', 'Modell': 'Modèle',
        // the header: "Fehler melden" (js/buch-feedback.js) and Solita (js/buch-solita.js, js/solita-frage.js)
        'Fehler melden': 'Signaler une erreur', 'Fehler melden: einsprechen oder tippen': 'Signaler une erreur : parle ou écris',
        'Schließen (Esc)': 'Fermer (Échap)', 'Schließen': 'Fermer', 'Einsprechen': 'Parler', 'Zuhören beenden': 'Arrêter l’écoute',
        'Was ist falsch oder unklar? Sprich einfach los oder tippe.': 'Qu’est-ce qui est faux ou pas clair ? Parle tout simplement, ou écris.',
        'Zum Beispiel: In Aufgabe 3 muss es 12 heißen, nicht 21.': 'Par exemple : dans l’exercice 3, il faut lire 12 et non 21.',
        'Die Spracherkennung macht dein Browser. Gespeichert wird nur der Text mit der Stelle im Buch, keine Aufnahme und kein Name.':
            'C’est ton navigateur qui reconnaît la voix. Seul le texte est enregistré, avec l’endroit du manuel : aucun enregistrement audio, aucun nom.',
        'Senden': 'Envoyer', 'Ich höre zu …': 'Je t’écoute…', 'Bitte erst etwas einsprechen oder tippen.': 'Dis ou écris d’abord quelque chose, s’il te plaît.',
        'Wird gesendet …': 'Envoi en cours…', 'Danke! Deine Meldung ist angekommen.': 'Merci ! Ton signalement est bien arrivé.',
        'Gerade sind es zu viele Meldungen. Bitte später noch einmal.': 'Il y a trop de signalements en ce moment. Réessaie plus tard.',
        'Das hat nicht geklappt. Bitte später noch einmal.': 'Cela n’a pas marché. Réessaie plus tard.',
        'Keine Verbindung. Bitte später noch einmal.': 'Pas de connexion. Réessaie plus tard.',
        'Frage sprechen': 'Dire ta question', 'Passwort zeigen': 'Afficher le mot de passe', 'Passwort verbergen': 'Masquer le mot de passe',
        'Stimme anhalten': 'Arrêter la voix', 'Frage senden': 'Envoyer la question', 'Passwort': 'Mot de passe',
        'Passwort – wird auf diesem Gerät gemerkt': 'Mot de passe – mémorisé sur cet appareil', 'Passwort bestätigen': 'Confirmer le mot de passe',
        'Das Passwort gilt nicht mehr.': 'Le mot de passe n’est plus valable.',
        // the colour scheme button in the header (js/farbschema.js): its label names the next scheme
        'Blau': 'Bleu', 'Grau': 'Gris', 'Hell': 'Clair', 'Farbschema Blau einschalten': 'Passer aux couleurs bleues',
        'Farbschema Grau einschalten': 'Passer aux couleurs grises', 'Farbschema Hell einschalten': 'Passer aux couleurs claires'
    };

    // ---------- pieces of sentences, shared ----------
    const PHRASE = [
        // used by more than one module: graphquiz (funktionen), vierfeld-trainer (stochastik)
        ['richtig', 'correct'],
        // header; Solita's invitations "Frag Solita zu dieser Stelle im Buch" (the rule below turns "Frag Solita" first)
        ['Fehler<br>melden', 'Signaler<br>une erreur'], ['Zur Markierung in ', 'Sur la sélection dans '], ['Deine Frage an ', 'Ta question à '],
        [' zu dieser Stelle im Buch', ' sur ce passage du manuel'], [' zu dieser Stelle', ' sur ce passage'], [' zur Markierung', ' sur la sélection']
    ];

    // ---------- word order and notation ----------
    // a number as the German widgets write it: 2, -3, −3, 1,5 or in TeX 1{,}5 (French keeps all of them)
    const NUM = '[-−]?\\d+(?:(?:\\{,\\}|,)\\d+)?';
    const RULE = [
        // points: every \mid → \,;\, (thin space, semicolon, thin space), whatever the coordinates are; not inside a set
        // \{ … \} of the same formula ("\{\, x \in \mathbb{R} \mid x \geq 0 \,\}" keeps its bar), never \middle
        [/(?<!\\\{(?:(?!\\\})[^$])*) ?\\mid(?![A-Za-z]) ?/g, '\\,;\\,'],
        // intervals: [1;\,2] → [1\,;\,2], ]0{,}5;\,3[ → ]0{,}5\,;\,3[ (the German semicolon gets its French thin space before)
        [new RegExp('([\\[\\]])(' + NUM + ');\\\\,(' + NUM + ')([\\[\\]])', 'g'), '$1$2\\,;\\,$3$4']
    ];
    // after the rules of the module files
    const RULE_LAST = [
        // header
        [/^Zu (?=\S)/, 'Concernant '], [/\bFrag (Solita|Doc)\b/g, 'Demande à $1'], [/Klick: zu (Solita|Doc) wechseln/g, 'Clic : passer à $1'],
        [/Einmal das Passwort, dann kann (Solita|Doc) antworten\./g, 'Saisis une fois le mot de passe, et $1 pourra répondre.'],
        // the AI marks in Solita's field (js/solita-frage.js): "Es antwortet Claude Haiku und DeepSeek"
        [/^Es antwortet (.+)$/, (m, w) => (/ und /.test(w) ? 'Réponses de ' : 'Réponse de ') + w.replace(/ und /g, ' et ')]
    ];
    // after the pieces: nothing - French keeps the German typography of numbers and percent ("30 %")
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
            Object.keys(d.word).forEach(k => { if (DEBUG && k in WORDS && WORDS[k] !== d.word[k]) say('[fr] ' + d.name + ' changes "' + k + '": ' + WORDS[k] + ' → ' + d.word[k]); });
            d.phrase.forEach(([de]) => { if (DEBUG && MAP.has(de) && MAP.get(de) !== new Map(d.phrase).get(de)) say('[fr] ' + d.name + ' changes "' + de + '"'); });
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
                say('[fr] still German: ' + r.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 160));
            }
        }
        return r;
    }
    const DEBUG = new URLSearchParams(location.search).has('debug');
    function say(msg) {
        try { if (window.Buch && Buch.dbg) Buch.dbg(msg); } catch (_) { }
        console.debug('[buch-fr] ' + msg);
    }
    // tools/buch-en/check.mjs --lang fr reads the registered files through dicts
    window.BuchFR = { tr: s => tr(s, 'h'), plain: s => tr(s, 'p'), add, dicts: DICTS };

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
