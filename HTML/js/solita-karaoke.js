// js/solita-karaoke.js — Solita's words light up while she speaks, and her formulas are spoken: ONE place for the
// decks (decks/deck.js) and the labs (js/solita-frage.js) (Doc, 29.09.2026: "das word hiliting wie im Deck
// (zentralisieren!)"). Moved out of deck.js unchanged; the labs' additions (column sums, \qquad, \textrm, ...) only
// add rules to the formula list.
//
//   SolitaKaraoke.texWords(tex)              a formula as German words
//   SolitaKaraoke.sprechbar(text)            what the voice is given: tags gone, formulas as words, no emoji/markdown
//   SolitaKaraoke.render(el, text, opt)      the text as word spans, $...$ as KaTeX in ONE span that knows how it is said;
//                                            opt.wort = class of a word span ('ask-w'), opt.absaetze = blank lines become
//                                            paragraphs and $$...$$ is set displayed (the labs; the decks: neither)
//   SolitaKaraoke.woerter(text, opt)         how many word spans render() makes of this text
//   SolitaKaraoke.stuecke(text)              sentence pieces for a slow voice (Doc's), each ending outside $...$
//   SolitaKaraoke.spielen(el, audio, spans, opt)   lights the word being said: opt.box = the box that keeps it centred,
//                                            opt.aktiv() = false once this audio is no longer the current one
(function (global) {
    // ---- formulas as words ----------------------------------------------------------------------------------------
    // Formulas are spoken, not skipped (Doc, 23.09.2026: "10 hoch 11 wird gar nicht gelesen", then the law of gravity).
    // The full path TeX -> KaTeX MathML -> Speech Rule Engine only runs offline (js/latex-speech.js feeds the recorded
    // page formeln-vorlesen.html); here a short rewrite turns school formulas into German words. Numbers stay digits -
    // the voice says them in German by itself ("10 hoch 11" comes out as "zehn hoch elf").
    // an operation behind its bar ("| -A", "| :2", "| \text{Stellenwerte}") is announced: "Umformung: minus A";
    // a note in words is said as it is (Doc, 29.09.2026: the lab read "-A" and ":2" bare)
    function umformung(op) {
        const o = String(op).trim();
        if (/^\\text\s*\{/.test(o)) return ' , ' + o + ' . ';
        const w = o.replace(/^:/, '\\div ').replace(/^-/, '\\minusop ').replace(/^\+/, '\\plusop ').replace(/^\\cdot/, '\\malop ');
        return ' , \\text{Umformung:} ' + w + ' . ';
    }
    // a column sum set as on paper - the sign stands only before the last row, but it goes between all of them
    function spaltensumme(m, body) {
        const teile = body.split(/\\hline/);
        const zeilen = teile[0].split(/\\\\/).map(function (z) { return z.replace(/^\s*(?:\+|\\plus)\s*(?:\\[;,:!]\s*)*/, '').trim(); })
            .filter(Boolean);
        return ' ' + zeilen.join(' + ') + (teile[1] ? ' = ' + teile[1].replace(/\\\\/g, ' ').trim() : '') + ' ';
    }
    const FUNKTION_WORT = { sin: 'Sinus', cos: 'Kosinus', tan: 'Tangens', cot: 'Kotangens', ln: 'l n', lg: 'Logarithmus',
        log: 'Logarithmus', exp: 'e hoch', lim: 'Limes', max: 'Maximum', min: 'Minimum' };
    const TEX_SIGNS = [
        // the labs (Ziffernrätsel, 29.09.2026): a column sum as \begin{array} ... \hline reads "9567 plus 1085 gleich
        // 10652"; an aligned block line by line, each line a sentence; spacing and place-value marks say nothing
        [/\\begin\{array\}\{[^}]*\}([\s\S]*?)\\end\{array\}/g, spaltensumme],
        [/\\begin\{aligned\}|\\end\{aligned\}/g, ' '],
        [/(?:\\qquad\s*)?(?:&&\s*)?\\big\|\\;\s*((?:\\text\s*\{[^{}]*\})|[^\\&]*?(?:\\[a-zA-Z]+[^\\&]*?)*?)(?=\\\\|\s*$)/g,
         function (m, op) { return umformung(op); }],
        [/\\\\/g, ' . '], [/&/g, ' '],
        // formulas side by side ("E=5 \\qquad N=6") are said with a pause between them
        [/\\qquad|\\quad/g, ' , '], [/\\big|\\Big|\\;/g, ' '], [/\\mkern-?[\d.]+mu/g, ' '],
        [/\\overset\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\s*\{([^{}]*)\}/g, ' $1 '],
        // the decks' list, as it stood in deck.js
        [/\\left|\\right|\\displaystyle|\\limits|\\!|\\,|\;|\\:|\\ /g, ' '],
        [/\\(?:mathrm|mathbf|mathit|boldsymbol|bm|operatorname|text|textbf|mathsf|textrm|textup)\s*\{([^{}]*)\}/g, ' $1 '],
        // "dritte Wurzel", "neunzigste Wurzel" - "3-te" came out as "3 minus te" (the minus below took the hyphen)
        [/\\sqrt\s*\[\s*([^\]]*)\]\s*\{([^{}]*)\}/g, (m, n, r) => ' ' + wurzelGrad(n) + ' Wurzel aus ' + r + ' '],
        [/\\sqrt\s*\{([^{}]*)\}/g, ' Wurzel aus $1 '],
        [/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, ' $1 durch $2 '],
        [/\{\s*,\s*\}/g, ','],                           // 0{,}5 is one number: "null Komma fünf", not "null , fünf"
        [/\^\s*\{?\\circ\}?/g, ' Grad '],                // before the general power, which would eat the \c of \circ
        [/\\(sum|prod|int)\s*_\s*\{?([^{}\s]*)\}?\s*\^\s*\{?([^{}\s]*)\}?/g,
         (m, w, a, b) => ' ' + { sum: 'Summe', prod: 'Produkt', int: 'Integral' }[w] + ' von ' + a + ' bis ' + b + ' '],
        // the square as one says it: "6 Quadrat", not "6 hoch 2" (Doc, 30.09.2026: "lesen: 6 hoch 2 -> 6 quadrat")
        [/\^\s*(?:\{\s*2\s*\}|2(?![\d.,]))/g, ' Quadrat '],
        [/\^\s*\{([^{}]*)\}/g, ' hoch $1 '], [/\^\s*\\?(\w)/g, ' hoch $1 '],
        [/_\s*\{([^{}]*)\}/g, ' Index $1 '], [/_\s*\\?(\w)/g, ' Index $1 '],
        [/\\minusop/g, ' minus '], [/\\plusop/g, ' plus '], [/\\malop/g, ' mal '],
        [/\\cdot|\\times|\\ast/g, ' mal '], [/\\div/g, ' geteilt durch '], [/\\pm/g, ' plus minus '],
        [/\\approx/g, ' ungefähr '], [/\\neq|\\ne\b/g, ' ungleich '], [/\\leq|\\le\b/g, ' kleiner gleich '],
        [/\\geq|\\ge\b/g, ' größer gleich '], [/\\ll\b/g, ' viel kleiner '], [/\\gg\b/g, ' viel größer '],
        [/\\infty/g, ' unendlich '], [/\\sum/g, ' Summe '], [/\\prod/g, ' Produkt '], [/\\int/g, ' Integral '],
        [/\\partial/g, ' partiell '], [/\\nabla/g, ' Nabla '], [/\\circ\b/g, ' Grad '], [/\\%|%/g, ' Prozent '],
        [/\\(?:rightarrow|to|Rightarrow|implies)\b/g, ' ergibt '], [/\\(?:ldots|cdots|dots)/g, ' und so weiter '],
        // the functions by their names - as a command they fell silent with every unknown one ("\\sin x" was read "x")
        [/\\(sin|cos|tan|cot|ln|lg|log|exp|lim|max|min)\b/g, (m, f) => ' ' + FUNKTION_WORT[f] + ' '],
        [/\\in\b/g, ' aus '], [/\\cap\b/g, ' und '], [/\\cup\b/g, ' oder '], [/\\mid\b/g, ' unter der Bedingung '],
        [/\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|chi|psi|omega)/gi,
         (m, g) => ' ' + g.charAt(0).toUpperCase() + g.slice(1) + ' ']
    ];
    // A capital letter standing alone in a formula goes to the voice by its German name - bare, Solita's Studio voice
    // read "A + A + A = 1A" as "ö plus ö plus ö ..." (Doc, 29.09.2026). The puzzles' number words come letter by
    // letter already ("SEND" -> Ess Eh Enn De, "1A" -> eins Ah); lower-case variables stay as they are (x, m, r) - only
    // after a number the ones that are also units get their names (keineEinheit).
    const BUCHSTABE = { A: 'Ah', B: 'Be', C: 'Ze', D: 'De', E: 'Eh', F: 'Eff', G: 'Ge', H: 'Ha', I: 'Ih', J: 'Jott', K: 'Ka',
        L: 'Ell', M: 'Emm', N: 'Enn', O: 'Oh', P: 'Pe', Q: 'Ku', R: 'Err', S: 'Ess', T: 'Te', U: 'Uh', V: 'Fau', W: 'We',
        X: 'Ix', Y: 'Üpsilon', Z: 'Zett', 'Ä': 'Äh', 'Ö': 'Öh', 'Ü': 'Üh' };
    // A puzzle's number word (Vorrechnen's Knobeln block writes it letter by letter, \mathrm{S}\mathrm{E}... or
    // \textup{1}\textrm{A}): with a digit in it, it is read by its place values - "1A" is 1 ten and A ones, "10 plus A",
    // not "eins A" (Doc, 29.09.2026: "eigentlich müsste man sagen 10 plus A"); "A0B" is "A mal 100 plus B". Letters
    // alone are spelled ("SEND" -> S E N D) - by place values that would run on and on.
    function zahlwortLesen(z) {
        if (!/[A-Z]/.test(z)) return z;
        if (!/\d/.test(z)) return z.split('').join(' ');
        const n = z.length, teile = [];
        z.split('').forEach(function (c, i) {
            const stelle = Math.pow(10, n - 1 - i);
            if (/\d/.test(c)) { if (+c) teile.push(String(+c * stelle)); }
            else teile.push(stelle > 1 ? c + ' mal ' + stelle : c);
        });
        return teile.join(' plus ');
    }
    // Letters written side by side are a product - "Gm_1m_2" is G times m1 times m2 and goes to the voice letter by
    // letter; a run of two or three plain letters only, so a word set in a formula without \text ("Anzahl") and the
    // functions written bare (sin, max) stay whole, and so do commands, \text{...} and an index ("v_{max}")
    const FUNKTION = new Set(['sin', 'cos', 'tan', 'cot', 'log', 'ln', 'lg', 'lim', 'max', 'min', 'exp', 'ggT', 'kgV', 'mod']);
    function buchstabenEinzeln(t) {
        return t.replace(/\\(?:text\w*|math\w+|operatorname|boldsymbol|bm|begin|end|color|textcolor)\s*\{[^{}]*\}|\\[a-zA-Z]+|(?<![a-zA-ZäöüÄÖÜß]|_\{)[a-zA-Z]{2,3}(?![a-zA-ZäöüÄÖÜß])/g,
            function (m) { return m.charAt(0) === '\\' || FUNKTION.has(m) ? m : m.split('').join(' '); });
    }
    // A small letter that stands after a number in a formula is a variable, never a unit - the voice read the "1 m" of
    // "m_1 m_2" as "1 Meter" (Doc, 30.09.2026, Vorrechnen: "G m Index 1 Meter ... blödsinn"). The letters that are
    // also units go to it by their names; a unit set apart ("5\,m", "5\,\text{m}") stays one
    const EINHEIT = { m: 'Emm', g: 'Ge', s: 'Ess', l: 'Ell', h: 'Ha', t: 'Te' };
    function keineEinheit(t) {
        return t.replace(/(\d\}?\s*)([mgslht])(?![a-zA-Z])/g, function (m, vor, b) { return vor + '\\text{' + EINHEIT[b] + '}'; });
    }
    // the root's degree as a word: a number as its ordinal, anything else as "n-te" with a hyphen that is no minus
    function wurzelGrad(n) {
        n = String(n).trim();
        if (!/^\d{1,6}$/.test(n)) return n + '\u2011te';
        const z = +n, besonders = { 1: 'erste', 3: 'dritte', 7: 'siebte', 8: 'achte' };
        return z < 20 ? besonders[z] || zahlwort(z) + 'te' : zahlwort(z) + 'ste';
    }
    // Parentheses are spoken (Doc, 30.09.2026: "warum nicht? Geht?") - they were dropped, and "(a+b)^2" came out as
    // "a plus b Quadrat", which is a + b². Innermost first:
    //   a function's argument is "von": f(x), a function word (Sinus ...), and any letter before ONE number or
    //     letter - s(t), N(0) - as one reads them
    //   one number or letter alone stands without words: (x), (3); after a digit it is a product, "2 mal 3"
    //   everything else is "Klammer auf ... Klammer zu": (a+b), (-3), x(x+1)
    const FUNKTION_VOR = /(?:^|[\s(])(?:[fghFGHP]|Sinus|Kosinus|Tangens|Kotangens|Logarithmus|l n|Limes|Maximum|Minimum)\s*$/;
    function klammern(t) {
        let vor;
        do {
            vor = t;
            t = t.replace(/\(([^()]*)\)/, function (m, innen, i, alles) {
                const kern = innen.replace(/\s+/g, ' ').trim(), davor = alles.slice(0, i);
                const einfach = /^[^\s+\-=<>,;]+(?: Index [^\s+\-=<>,;]+)?$/.test(kern);   // one number or letter, no sign
                if (FUNKTION_VOR.test(davor) || (einfach && /[a-zA-Z]\s*$/.test(davor))) return ' von ' + kern + ' ';
                if (einfach) return (/\d\s*$/.test(davor) ? ' mal ' : ' ') + kern + ' ';
                return ' Klammer auf ' + kern + ' Klammer zu ';
            });
        } while (t !== vor);
        return t;
    }
    function texWords(tex) {
        // an index raised by hand, \sqrt[{}^{90}\,] (vorrechnen's w-neunzig: KaTeX set the 90 on the root's hook), is
        // just its number
        tex = String(tex).replace(/\\sqrt\s*\[\s*\{\s*\}\s*\^\s*\{?([^{}\]]*)\}?\s*(?:\\[,;:!]\s*)*\]/g, '\\sqrt[$1]');
        let t = ' ' + keineEinheit(buchstabenEinzeln(tex)) + ' ';
        t = t.replace(/(?:\\(?:mathrm|textrm|textup)\s*\{[A-Z0-9]+\})+/g, function (m) {
            return ' ' + zahlwortLesen(m.replace(/\\(?:mathrm|textrm|textup)\s*\{([A-Z0-9]+)\}/g, '$1')) + ' ';
        });
        for (let i = 0; i < 4; i++) TEX_SIGNS.forEach(function (r) { t = t.replace(r[0], r[1]); });   // unwrap nested braces
        t = klammern(t)
             .replace(/[{}()[\]]/g, ' ')
             .replace(/\\[a-zA-Z]+/g, ' ')                // anything this list does not know stays silent
             // "ist gleich", as one says it (Doc, 29.09.2026: "A plus A plus A ist gleich ...")
             .replace(/=/g, ' ist gleich ').replace(/\+/g, ' plus ').replace(/(\d|\w)\s*-\s*(?=[\w\\])/g, '$1 minus ')
             .replace(/</g, ' kleiner ').replace(/>/g, ' größer ').replace(/\|/g, ' ');
        // written bare, only the functions one says by name - an index "max" stays "max" ("v Index max")
        return t.replace(/\s+/g, ' ').trim().split(' ').map(function (w) { return BUCHSTABE[w] || (/^(sin|cos|tan|cot|ln|lg|log)$/.test(w) ? FUNKTION_WORT[w] : w); }).join(' ');
    }
    // A number that ends a sentence is a number, not an ordinal: the voice read "höchstens eine 1." as "erstens"
    // (Doc, 29.09.2026: "wir müssten hier also noch einen Sentence Segmentizer haben oder eine Heuristik"). Such a
    // number goes to the voice as a word ("eine eins."). Ordinals stay as they are: after an article or preposition
    // ("am 1.", "der 3.") and before a month ("1. Juli"); a lower-case word after the dot means no sentence ends there.
    // Not after "bis" / "ab" / "seit": "von 0 bis 9." came out as "neunte" (Doc) - a date there has its month after it.
    const EINER = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf',
        'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
    const ZEHNER = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
    function unter100(n) { return n < 20 ? EINER[n] : (n % 10 ? (n % 10 === 1 ? 'ein' : EINER[n % 10]) + 'und' : '') + ZEHNER[Math.floor(n / 10)]; }
    function unter1000(n) {
        const h = Math.floor(n / 100), r = n % 100;
        return (h ? (h === 1 ? 'ein' : EINER[h]) + 'hundert' : '') + (r ? unter100(r) : '');
    }
    function zahlwort(n) {
        if (n === 0) return 'null';
        const t = Math.floor(n / 1000), r = n % 1000;
        return (t ? (t === 1 ? 'ein' : unter1000(t)) + 'tausend' : '') + (r ? unter1000(r) : '');
    }
    const ORDINAL_DAVOR = new Set(['der', 'die', 'das', 'den', 'dem', 'des', 'am', 'im', 'vom', 'zum', 'zur', 'beim',
        'jeder', 'jede', 'jedes', 'jeden', 'dieser', 'diese', 'dieses', 'diesen', 'ihr', 'ihre', 'sein', 'seine']);
    const MONATE = new Set(['januar', 'jänner', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september',
        'oktober', 'november', 'dezember']);
    const SATZANFANG = new Set(['Es', 'Er', 'Sie', 'Das', 'Die', 'Der', 'Den', 'Dem', 'Wir', 'Ich', 'Du', 'Und', 'Aber',
        'Also', 'Dann', 'Da', 'So', 'Jetzt', 'Nun', 'Hier', 'Nur', 'Auch', 'Mit', 'Wenn', 'Weil', 'Damit', 'Probe']);
    function satzendZahlen(t) {
        return t.replace(/(^|[^\d.,])(\d{1,6})\.(?=\s|$)/g, function (m, vor, zahl, i, alles) {
            const davor = alles.slice(Math.max(0, i - 16), i + vor.length).toLowerCase().match(/([a-zäöüß]+)\s*$/);
            const danach = alles.slice(i + m.length).match(/^\s+([A-Za-zÄÖÜäöüß]+)/);
            // "die 1. Es stimmt!" - after an article the dot still ends a sentence when a sentence starts behind it
            if (davor && ORDINAL_DAVOR.has(davor[1]) && !(danach && SATZANFANG.has(danach[1]))) return m;
            if (danach && (MONATE.has(danach[1].toLowerCase()) || /^[a-zäöüß]/.test(danach[1]))) return m;
            return vor + zahlwort(+zahl) + '.';
        });
    }
    // What the voice is given: formulas as words, no emoji or markdown - and no HTML tags (a lab's step text)
    function sprechbar(text) {
        return buchstabenNamen(satzendZahlen(zifferUndBuchstabe(ohneFormeln(text)))).replace(/:\s*\./g, ':').replace(/,\s*\./g, '.')
            .replace(/\s+([.,;:!?])/g, '$1').replace(/([.!?])\s*\.+/g, '$1').replace(/\s+/g, ' ').trim();
    }
    // A puzzle's number as the model writes it, "4A" or "A0B", in the text or in $...$: digits and capitals apart, each
    // letter then by its name - the voice pulled "4A" together into "viera" (Doc, 29.09.2026: "vier A"). Only words of
    // capitals and digits with both in them; "10A" stays "10 A", "H2O" becomes "H 2 O".
    function zifferUndBuchstabe(t) {
        return t.replace(/(^|[^0-9A-Za-zÄÖÜäöüß_])((?=[A-ZÄÖÜ0-9]*\d)(?=[A-ZÄÖÜ0-9]*[A-ZÄÖÜ])[A-ZÄÖÜ0-9]+)(?![0-9A-Za-zÄÖÜäöüß_])/g,
            function (m, vor, w) { return vor + w.match(/\d+|[A-ZÄÖÜ]/g).join(' '); });
    }
    // a capital letter standing alone in the running text as well ("1 Zehner und A Einer", "N plus R") - German has
    // no one-letter capital words, so this only meets the letters of a formula or a puzzle
    function buchstabenNamen(t) {
        return t.replace(/(^|[\s(„"'–-])([A-ZÄÖÜ])(?=$|[\s,.;:!?)“"'–-])/g, function (m, vor, b) { return vor + (BUCHSTABE[b] || b); });
    }
    function ohneFormeln(text) {
        return String(text)
            .replace(/<\/(p|li|h\d|tr|div)>/gi, '. ').replace(/<br\s*\/?>/gi, '. ').replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            // maths is read too; a formula set off ends like a sentence - a pause before the text goes on
            .replace(/\$\$([\s\S]*?)\$\$/g, function (m, t) { return ' ' + texWords(t) + '. '; })
            // "Also ist $M=1$" is "also ist M gleich 1", not "... ist M ist gleich 1"
            .replace(/\$([^$\n]*?)\$/g, function (m, t, i, alles) {
                let w = texWords(t);
                if (/\bist\s*$/.test(alles.slice(Math.max(0, i - 8), i))) w = w.replace(/\bist gleich\b/, 'gleich');
                return ' ' + w + ' ';
            })
            .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, '')
            .replace(/[*_`#>]/g, '')
            .replace(/\s+([.,;:!?])/g, '$1').replace(/([.!?])\s*\.(\s|$)/g, '$1$2').replace(/^\s*\.\s*/, '')
            .replace(/\s+/g, ' ').trim();
    }

    // ---- the text as word spans ---------------------------------------------------------------------------------
    // One span per word, so her voice can light it up. The whole formula is one word for the karaoke, and it knows how
    // long it takes to say: since the voice reads formulas, leaving them out let everything after them run ahead
    // (Doc, 23.09.2026: "das Hiliting kommt durch die Formel durcheinander").
    function teile(text, opt) {                      // paragraphs, each a list of formulas and plain parts
        const absaetze = opt && opt.absaetze;
        const muster = absaetze ? /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$)/ : /(\$[^$\n]+\$)/;
        return (absaetze ? String(text).split(/\n\s*\n/) : [String(text)]).map(function (absatz) {
            return absatz.split(muster).filter(Boolean).map(function (part) {
                if (absaetze && /^\$\$[\s\S]+\$\$$/.test(part)) return { tex: part.slice(2, -2), display: true };
                if (/^\$[^$\n]+\$$/.test(part)) return { tex: part.slice(1, -1), display: false };
                return { text: part };
            });
        });
    }
    function render(el, text, opt) {
        opt = opt || {};
        const cls = opt.wort || 'ask-w';
        el.textContent = '';
        el.dataset.src = text;                          // "Kopieren" takes the text as written, $...$ and all
        teile(text, opt).forEach(function (absatz) {
            const ziel = opt.absaetze ? el.appendChild(document.createElement('p')) : el;
            absatz.forEach(function (t) {
                if (t.tex !== undefined) {
                    const span = document.createElement(t.display ? 'div' : 'span');
                    try { global.katex.render(t.tex, span, { throwOnError: false, displayMode: t.display }); }
                    catch (e) { span.textContent = t.tex; }
                    span.className = cls; span.dataset.spoken = texWords(t.tex);
                    ziel.appendChild(span);
                    return;
                }
                t.text.split(/(\s+)/).forEach(function (tok) {
                    if (!tok) return;
                    if (/^\s+$/.test(tok)) { ziel.appendChild(document.createTextNode(tok)); return; }
                    const w = document.createElement('span');
                    w.className = cls; w.textContent = tok;
                    ziel.appendChild(w);
                });
            });
        });
    }
    function woerter(text, opt) {                     // how many word spans render() makes of this text
        let n = 0;
        teile(text, opt).forEach(function (absatz) {
            absatz.forEach(function (t) { n += t.tex !== undefined ? 1 : t.text.split(/\s+/).filter(Boolean).length; });
        });
        return n;
    }
    // Doc's voice needs ~5 s for a sentence and 16 s for a long answer, past the tts function's 15 s (then Studio-C
    // steps in). So it comes sentence by sentence: the first piece at once, the next fetched while one plays, played on
    // without a gap (Doc, 25.09.2026, forloop-73's proposal). Pieces end at sentence ends outside $...$, so each one
    // renders into exactly its share of the answer's word spans - the karaoke runs piece by piece over those.
    function stuecke(text) {
        const src = String(text), ends = [];
        let inMath = false;
        for (let i = 0; i < src.length; i++) {
            const ch = src[i];
            if (ch === '$') inMath = !inMath;
            else if (!inMath && /[.!?]/.test(ch) && (i + 1 === src.length || /\s/.test(src[i + 1]))) ends.push(i + 1);
        }
        const out = [];
        let from = 0, cur = '';
        ends.concat(src.length).forEach(function (e) {
            if (e <= from) return;
            cur += src.slice(from, e); from = e;
            const want = out.length ? 120 : 60;            // a short first piece: the voice starts sooner
            if (cur.trim().length >= want) { out.push(cur.trim()); cur = ''; }
        });
        if (cur.trim()) { if (out.length && cur.trim().length < 40) out[out.length - 1] += ' ' + cur.trim(); else out.push(cur.trim()); }
        return out;
    }

    // ---- karaoke ------------------------------------------------------------------------------------------------
    // Karaoke (Doc, 16.09.2026): the word Solita is saying lights up. Google returns no word timestamps for Studio
    // voices - they do not support SSML <mark> - so the times are ESTIMATED: syllables per word, a pause after commas
    // and sentence ends, spread over the length of the audio. Measured on 16.09.2026 against Studio-C syntheses of the
    // answer cut off after every word: mean error 0.13 s, worst 0.24 s, on an answer the weights were NOT tuned on.
    // Letters instead of syllables were twice as far off, and anchoring on the pauses found in the audio made it worse.
    // lead/tail: the silence Google puts before and after the speech (measured 0.10 s and 0.09 s).
    const KARA = { lead: 0.10, tail: 0.09, base: 0.3, sentence: 1.5, comma: 0.6 };
    // Syllables of what is SAID, token by token: a number counts as its German words ("216000" = zwei-hun-dert-sech-
    // zehn-tau-send), decimals digit by digit after "Komma". Before 25.09.2026 a formula span like "1 plus 24 durch 60"
    // counted only plus and durch, and a bare number 1.5 per digit - the light ran ahead over every formula (Doc: "out of
    // sync"). Measured on a formula-heavy answer against Studio-C cut off after every word: mean error 0.20 s -> 0.13 s,
    // worst 0.72 s -> 0.43 s. Anchoring on the pauses in the audio was tried again and doubled the error (0.40 s).
    const UNIT = [1, 1, 1, 1, 1, 1, 1, 2, 1, 1];     // null eins zwei drei vier fünf sechs sieben acht neun
    function below100(n) {
        if (n < 10) return UNIT[n];
        if (n < 13) return 1;                            // zehn elf zwölf
        if (n < 20) return n === 16 || n === 17 ? 2 : UNIT[n - 10] + 1;
        const u = n % 10;
        return 2 + (u ? UNIT[u] + 1 : 0);                // zwanzig ... / einundzwanzig
    }
    function numSyl(n) {
        if (n === 0) return 1;
        if (n >= 1000000) return 6;
        let s = 0;
        const th = Math.floor(n / 1000), h = Math.floor(n % 1000 / 100), r = n % 100;
        if (th) s += (th === 1 ? 1 : numSyl(th)) + 2;    // (ein)tausend
        if (h) s += (h === 1 ? 1 : UNIT[h]) + 2;          // (ein)hundert
        if (r) s += below100(r);
        return s;
    }
    function syllables(w) {
        let s = 0;
        w.split(/\s+/).forEach(function (t) {
            const m = t.match(/^\D*?(\d+)(?:([,.])(\d+))?\D*$/);
            if (m) {
                if (m[2] === '.' && m[3].length === 3) { s += numSyl(+(m[1] + m[3])); return; }   // 3.800 - a thousands dot
                s += numSyl(+m[1]);
                if (m[3]) s += 2 + m[3].split('').reduce(function (a, c) { return a + UNIT[+c]; }, 0);   // Komma, digit by digit
                return;
            }
            const v = t.toLowerCase().match(/[aeiouyäöü]+/g);
            if (v) s += v.length;
        });
        return s;
    }
    // el: the answer; a: the audio playing it; spans: this piece's share of el's word spans (default: all of them,
    // class opt.wort or 'ask-w'); opt.box: the scrolling box her word stays centred in; opt.aktiv(): still current?
    function spielen(el, a, spans, opt) {
        opt = opt || {};
        const aktiv = opt.aktiv || function () { return true; };
        const box = opt.box || null;
        const items = [];
        let pos = 0;
        (spans || el.querySelectorAll('.' + (opt.wort || 'ask-w'))).forEach(function (sp) {
            const w = (sp.dataset.spoken || sp.textContent).replace(/[*_`#>]/g, '');   // a formula counts as what is said of it
            const k = w.split(/\s+/).filter(Boolean).length || 1;   // a formula is several words in one span
            const n = syllables(w);
            if (n) { items.push({ sp: sp, s: pos, n: n, k: k }); pos += n + KARA.base * k; }
            if (/[.!?]["')\]]*$/.test(w)) pos += KARA.sentence;
            else if (/[,;:]["')\]]*$/.test(w)) pos += KARA.comma;
        });
        if (!items.length) return;
        const last = items[items.length - 1];
        const total = last.s + last.n + KARA.base * last.k;
        let on = null;
        function mark(sp) {
            if (sp === on) return;
            if (on) on.classList.remove('on');
            on = sp;
            if (!sp || !box) { if (sp) sp.classList.add('on'); return; }
            sp.classList.add('on');
            // her word stays in the middle of the box, as far as the scroll range allows (Doc, 23.09.2026)
            const r = sp.getBoundingClientRect(), o = box.getBoundingClientRect();
            const want = box.scrollTop + (r.top + r.bottom) / 2 - (o.top + o.bottom) / 2;
            if (Math.abs(want - box.scrollTop) > 2) box.scrollTo({ top: want, behavior: 'smooth' });
        }
        function frame() {
            if (!aktiv() || a.paused) { mark(null); return; }   // stopped, closed or finished
            if (isFinite(a.duration) && a.duration > 0) {
                const u = (a.currentTime - KARA.lead) / Math.max(0.1, a.duration - KARA.lead - KARA.tail) * total;
                let i = -1;
                while (i + 1 < items.length && items[i + 1].s <= u) i++;
                mark(i >= 0 ? items[i].sp : null);
            }
            requestAnimationFrame(frame);
        }
        a.addEventListener('playing', function () { requestAnimationFrame(frame); });
    }

    global.SolitaKaraoke = { texWords: texWords, sprechbar: sprechbar, render: render, woerter: woerter,
                             stuecke: stuecke, spielen: spielen, syllables: syllables };
})(window);
