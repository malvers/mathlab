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
    const TEX_SIGNS = [
        // the labs (Ziffernrätsel, 29.09.2026): a column sum as \begin{array} ... \hline reads "9567 plus 1085 gleich
        // 10652", spacing and Vorrechnen's place-value marks say nothing
        [/\\begin\{array\}\{[^}]*\}|\\end\{array\}/g, ' '], [/\\hline/g, ' gleich '], [/\\\\/g, ' '],
        [/\\qquad|\\quad|\\big|\\Big|\\;/g, ' '], [/\\mkern-?[\d.]+mu/g, ' '],
        [/\\overset\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}\s*\{([^{}]*)\}/g, ' $1 '],
        // the decks' list, as it stood in deck.js
        [/\\left|\\right|\\displaystyle|\\limits|\\!|\\,|\;|\\:|\\ /g, ' '],
        [/\\(?:mathrm|mathbf|mathit|boldsymbol|bm|operatorname|text|textbf|mathsf|textrm|textup)\s*\{([^{}]*)\}/g, ' $1 '],
        [/\\sqrt\s*\[\s*([^\]]*)\]\s*\{([^{}]*)\}/g, ' $1-te Wurzel aus $2 '],
        [/\\sqrt\s*\{([^{}]*)\}/g, ' Wurzel aus $1 '],
        [/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, ' $1 durch $2 '],
        [/\{\s*,\s*\}/g, ','],                           // 0{,}5 is one number: "null Komma fünf", not "null , fünf"
        [/\^\s*\{?\\circ\}?/g, ' Grad '],                // before the general power, which would eat the \c of \circ
        [/\\(sum|prod|int)\s*_\s*\{?([^{}\s]*)\}?\s*\^\s*\{?([^{}\s]*)\}?/g,
         (m, w, a, b) => ' ' + { sum: 'Summe', prod: 'Produkt', int: 'Integral' }[w] + ' von ' + a + ' bis ' + b + ' '],
        [/\^\s*\{([^{}]*)\}/g, ' hoch $1 '], [/\^\s*\\?(\w)/g, ' hoch $1 '],
        [/_\s*\{([^{}]*)\}/g, ' Index $1 '], [/_\s*\\?(\w)/g, ' Index $1 '],
        [/\\cdot|\\times|\\ast/g, ' mal '], [/\\div/g, ' geteilt durch '], [/\\pm/g, ' plus minus '],
        [/\\approx/g, ' ungefähr '], [/\\neq|\\ne\b/g, ' ungleich '], [/\\leq|\\le\b/g, ' kleiner gleich '],
        [/\\geq|\\ge\b/g, ' größer gleich '], [/\\ll\b/g, ' viel kleiner '], [/\\gg\b/g, ' viel größer '],
        [/\\infty/g, ' unendlich '], [/\\sum/g, ' Summe '], [/\\prod/g, ' Produkt '], [/\\int/g, ' Integral '],
        [/\\partial/g, ' partiell '], [/\\nabla/g, ' Nabla '], [/\\circ\b/g, ' Grad '], [/\\%|%/g, ' Prozent '],
        [/\\(?:rightarrow|to|Rightarrow|implies)\b/g, ' ergibt '], [/\\(?:ldots|cdots|dots)/g, ' und so weiter '],
        [/\\in\b/g, ' aus '], [/\\cap\b/g, ' und '], [/\\cup\b/g, ' oder '], [/\\mid\b/g, ' unter der Bedingung '],
        [/\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|chi|psi|omega)/gi,
         (m, g) => ' ' + g.charAt(0).toUpperCase() + g.slice(1) + ' ']
    ];
    function texWords(tex) {
        let t = ' ' + String(tex) + ' ';
        for (let i = 0; i < 4; i++) TEX_SIGNS.forEach(function (r) { t = t.replace(r[0], r[1]); });   // unwrap nested braces
        t = t.replace(/([a-zA-Z])\s*\(/g, '$1 von (')     // f(x) is "f von x", not "f Klammer auf x"
             .replace(/[{}()[\]]/g, ' ')
             .replace(/\\[a-zA-Z]+/g, ' ')                // anything this list does not know stays silent
             .replace(/=/g, ' gleich ').replace(/\+/g, ' plus ').replace(/(\d|\w)\s*-\s*(?=[\w\\])/g, '$1 minus ')
             .replace(/</g, ' kleiner ').replace(/>/g, ' größer ').replace(/\|/g, ' ');
        return t.replace(/\s+/g, ' ').trim();
    }
    // What the voice is given: formulas as words, no emoji or markdown - and no HTML tags (a lab's step text)
    function sprechbar(text) {
        return String(text)
            .replace(/<\/(p|li|h\d|tr|div)>/gi, '. ').replace(/<br\s*\/?>/gi, '. ').replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/\$\$([\s\S]*?)\$\$/g, function (m, t) { return ' ' + texWords(t) + ' '; })   // maths is read too
            .replace(/\$([^$\n]*?)\$/g, function (m, t) { return ' ' + texWords(t) + ' '; })
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
