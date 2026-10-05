// How a working is set on the board of vorrechnen.html - the pieces another page needs to look the same
// (decks/tafel.html, Doc 30.09.2026: "die Optik in Tafel ist noch anders als Vorrechnen. Bitte angleichen").
// A classic script: its functions are globals. The same functions still live in the Vorrechnen scripts
// (engeBrueche, alsDisplay, tinte: js/vorrechnen-erkennen.js; hebeVariable: js/vorrechnen-werkzeuge.js;
// smileyIcon: js/vorrechnen-rechenweg.js) - they are meant to come from here once Vorrechnen loads this file.
// Vorrechnen loads it since 30.09.2026, before its own scripts, whose five functions of the same name still win;
// the explanation's setting at the end (erklaerungSetzen and its helpers) lives here only - the lab's explanation
// box and the deck's explanation slides are set by the same code.
// No top-level const/let here: the Vorrechnen scripts share one global scope and declare their own.

// What the head says over a task - beside it in vorrechnen.html, over it on the slides of decks/tafel.html, in Solita's
// context: null for "umstellen nach x" (the caller sets the variable in red), else the words. A term ('' instead of a
// variable) is simplified, or does what its block says (kopf; Knobeln: "Ziffern finden"). A task whose variable stands
// alone on the left already, with none of it on the right, is worked out, not rearranged (Doc, 05.10.2026, over
// "umstellen nach y" above y = 3·4 - 2: "verstehe nicht ... ist doch schon?" - 60 such tasks over the year).
function aufgabenKopf(latex, nach, kopf) {
    if (nach === '') return kopf || 'vereinfachen';
    if (!nach) return null;
    const k = String(latex).indexOf('=');
    if (k < 0 || latex.slice(0, k).trim() !== nach) return null;
    const v = nach.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
    return new RegExp('(^|[^a-zA-Z\\\\])' + v + '(?![a-zA-Z])').test(latex.slice(k + 1)) ? null : 'ausrechnen';
}

// Doc: "Wurzel und Summenzeichen sehen noch falsch aus" - by hand a formula is written in display style.
function alsDisplay(latex) { return '\\displaystyle ' + engeBrueche(latex); }

// Doc, 26.09.: "kommen so große Abstände aus LaTeX?" - yes: in display style TeX lifts every numerator and
// lowers every denominator by the same fixed amount, whatever they hold. Then "JA" to closing them up, and
// "die Wurzeln nicht so wahnsinnig auseinandergezogen" - so it is done in the LaTeX, before KaTeX sets it:
// the numerator goes down, the denominator up, and KaTeX stops each at its least distance from the bar
// (3 bar widths) - and sizes roots and \left( \right) around the tight fraction. Only fractions set in
// display style (not those in a numerator or an exponent: they are small and tight already).
function engeBrueche(latex, display = true) {
    let aus = '', i = 0;
    const n = latex.length;
    // one argument: a {group} or a single token
    const arg = () => {
        while (latex[i] === ' ') i++;
        if (latex[i] === '{') {
            const s = ++i;
            for (let t = 1; i < n; i++) {
                if (latex[i] === '\\') { i++; continue; }
                if (latex[i] === '{') t++;
                else if (latex[i] === '}' && --t === 0) break;
            }
            return { text: latex.slice(s, i++), gruppe: true };
        }
        return { text: befehl() || latex[i++] || '', gruppe: false };
    };
    // a \command at i (or nothing)
    const befehl = () => {
        if (latex[i] !== '\\') return '';
        const s = i++;
        if (/[a-zA-Z]/.test(latex[i] || '')) while (i < n && /[a-zA-Z]/.test(latex[i])) i++;
        else i++;
        return latex.slice(s, i);
    };
    while (i < n) {
        const c = latex[i];
        if (c === '\\') {
            const b = befehl();
            if (b === '\\frac' || b === '\\dfrac') {
                const z = engeBrueche(arg().text, false), m = engeBrueche(arg().text, false);
                aus += display || b === '\\dfrac'
                    ? `${b}{\\raisebox{-0.3em}{$${z}$}}{\\raisebox{0.6em}{$${m}$}}` : `${b}{${z}}{${m}}`;
                continue;
            }
            if (b === '\\displaystyle') display = true;
            else if (/^\\(text|script|scriptscript)style$/.test(b)) display = false;
            aus += b;
        } else if (c === '^' || c === '_') {
            i++;
            const a = arg();
            aus += c + (a.gruppe ? '{' + engeBrueche(a.text, false) + '}' : a.text);
        } else if (c === '{') {
            aus += '{' + engeBrueche(arg().text, display) + '}';
        } else { aus += c; i++; }
    }
    return aus;
}

// How far the ink of a set formula reaches, in page px: glyphs measured on a canvas at their baseline, lines
// and SVGs (roots) by their boxes. KaTeX's boxes are taller than the glyphs - and a denominator raised by
// engeBrueche keeps its full depth there. k: the scale the page shows it at (a deck's stage) - the canvas
// measures at the unscaled font size. { o, u }: top and bottom of the ink, or null.
function tinte(el, k = 1) {
    const ctx = tinte.ctx || (tinte.ctx = document.createElement('canvas').getContext('2d'));
    let o = Infinity, u = -Infinity;
    el.querySelectorAll('svg, .frac-line, .sqrt-line, .overline-line, .underline-line').forEach(x => {
        const r = x.getBoundingClientRect();
        if (r.width || r.height) { o = Math.min(o, r.top); u = Math.max(u, r.bottom); }
    });
    const texte = [], gang = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t = gang.nextNode(); t; t = gang.nextNode()) {
        const text = t.textContent.replace(/​/g, '');
        if (!text.trim() || t.parentElement.closest('svg, .katex-mathml')) continue;
        const sonde = document.createElement('span');          // on the text's baseline
        sonde.style.cssText = 'display:inline-block;width:0;height:0';
        t.parentElement.appendChild(sonde);
        texte.push({ text, p: t.parentElement, sonde });
    }
    // all probes in, then all read: one layout, not one per glyph
    texte.forEach(x => { x.y = x.sonde.getBoundingClientRect().top; });
    texte.forEach(({ text, p, sonde, y }) => {
        sonde.remove();
        const cs = getComputedStyle(p);
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = ctx.measureText(text);
        o = Math.min(o, y - k * m.actualBoundingBoxAscent); u = Math.max(u, y + k * m.actualBoundingBoxDescent);
    });
    return isFinite(o) ? { o, u } : null;
}

// The variable solved for, in its colour in every row (Doc, 27.09.: "7x rot und so weiter") - a variable with an
// index (R_1, T_2, r_i) as a whole, a letter as a token of its own, so the "a" of \frac stays ink.
function hebeVariable(latex, v, farbe) {
    if (!v) return latex;
    const farbig = `{\\textcolor{${farbe}}{${v}}}`;            // a group of its own: 2^x, (...)^n
    if (v.length > 1) return latex.split(v).join(farbig);
    return latex.replace(/\\[a-zA-Z]+|./g, t => t === v ? farbig : t);
}

// Doc, 30.09.2026: "lass in der letzten Zeile hinter | immer einen freundlichen Smiley kommen" - Apple's 😊 as an
// image from the set the VGP uses too (iamcal/emoji-data img-apple-160 on jsdelivr, js/vgp-setup.js), the same on
// every device, whose own fonts draw other faces
function smileyIcon() {
    const i = document.createElement('img');
    i.src = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/1f60a.png';
    i.alt = '😊';
    i.style.cssText = 'width:1.15em;height:1.15em;vertical-align:-0.25em';
    return i;
}

// ── a task's explanation (ERKLAERUNGEN, js/vorrechnen-aufgaben.js) ──────────────────────────────────────────
// Moved here from js/vorrechnen-flug.js (30.09.2026), when the deck of the tasks got a slide for each explanation
// (decks/tafel.html, Doc: "eine Erklärbox ... in das Deck als Folie danach mit einbauen"). The look comes from the
// page (#erklaerung in js/vorrechnen.css, .tf-erkl in the deck); the layout of .erkl-gl and its parts: js/formel-satz.css.
// every letter of a formula upright, as \mathrm (Doc, 28.09.: the letters blue - js/vorrechnen.css - "bitte nicht
// kursiv"); commands (\cdot, \ge, \mathrm) and words in \text{...} stay as they are
function formelAufrecht(tex) {
    return tex.replace(/\\text\{[^}]*\}|\\[a-zA-Z]+|[A-Za-z]/g, m => m.length > 1 ? m : '\\mathrm{' + m + '}');
}
// Paragraphs by a blank line. $$equation | operation$$ is an equation set off, as in a LaTeX text, with what is done
// to it next behind it as on the board's working, "| −A" (since 29.09.2026 the data come that way:
// umformungenVorziehen, js/vorrechnen-aufgaben.js - Doc: "Auch in der EB!") (Doc, 28.09.: "dass diese Gleichungen so in der Zeile
// im Text stehen ... ordentliche Gleichungen ... und natürlich LaTeX", "hinter die Gleichung immer die Operation");
// $...$ stays in the sentence - a value, a letter, a term.
// Every "=" of the box stands on its middle line, text between or not ("die Gleichheitszeichen immer in die Mitte
// der Box ... auch über Text ... alle aligned"): a row of two halves, the left side flush right before the middle,
// "=" centred on it and the right side after it (.erkl-gl); the operations in one column behind the widest right
// side (erklSpalte, once the box is laid out).
// data-tex: the formula as LaTeX, for Solita - a deck puts it back as $...$ when she reads the slide (decks/deck.js)
function erklGleichung(s) {
    const [gl, op] = s.slice(2, -2).split(' | '), i = gl.indexOf('=');
    const zeile = document.createElement('div');
    zeile.className = 'erkl-gl';
    zeile.dataset.tex = op ? gl + ' \\quad \\big|\\; ' + op : gl;
    const links = document.createElement('span'), rechts = document.createElement('span');
    links.className = 'erkl-l';
    rechts.className = 'erkl-r';
    const seite = document.createElement('span'), setze = (el, tex) => {
        try { katex.render('\\displaystyle ' + tex, el, { throwOnError: false }); } catch (_) { el.textContent = tex; }
    };
    seite.className = 'erkl-seite';
    setze(links, formelAufrecht(i < 0 ? gl : gl.slice(0, i)));
    setze(seite, i < 0 ? '' : '{}' + formelAufrecht(gl.slice(i)));    // {}: a space after the "=" as well as before
    rechts.appendChild(seite);
    if (op) {
        const o = document.createElement('span');
        o.className = 'erkl-op';
        setze(o, '\\vert\\;\\; ' + formelAufrecht(op.replace(/^:/, '{:}\\,')));
        rechts.appendChild(o);
    }
    zeile.append(links, rechts);
    return zeile;
}
// the operations' column: every right side as wide as the widest of the box
function erklSpalte(el) {
    const seiten = [...el.querySelectorAll('.erkl-seite')];
    seiten.forEach(s => { s.style.minWidth = ''; });
    const breit = Math.max(0, ...seiten.map(s => s.getBoundingClientRect().width));
    seiten.forEach(s => { s.style.minWidth = breit + 'px'; });
}
function erklaerungSetzen(el, text) {
    el.textContent = '';
    text.split('\n\n').forEach(absatz => {
        const p = document.createElement('p');
        let formel = null;
        absatz.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/).forEach(t => {
            if (!t) return;
            if (t.startsWith('$$')) {
                // the first and the last equation of a block keep more room from the text ("zwischen den Texten und
                // den Gleichungsblöcken noch ein bisschen mehr")
                const z = erklGleichung(t), davor = p.lastChild;
                if (!(davor && davor.classList && davor.classList.contains('erkl-gl'))) z.classList.add('erkl-anfang');
                p.appendChild(z);
                formel = null;
                return;
            }
            const davor = p.lastChild;
            if (t.trim() && davor && davor.classList && davor.classList.contains('erkl-gl')) davor.classList.add('erkl-ende');
            if (!t.trim() && !formel) return;                 // blanks between two equations
            if (t[0] === '$') {
                formel = document.createElement('span');
                formel.className = 'erkl-inline';            // never broken inside (js/formel-satz.css)
                formel.dataset.tex = t.slice(1, -1);
                try { katex.render(formelAufrecht(t.slice(1, -1)), formel, { throwOnError: false }); } catch (_) { formel.textContent = t; }
                p.appendChild(formel);
                return;
            }
            // a stop right after a formula goes into its last piece: the line may break inside the formula,
            // never between it and its "." (Doc, 28.09.: ". auf nächster Zeile")
            const zeichen = formel && t.match(/^[.,;:!?)]+/), stuecke = formel && formel.querySelectorAll('.base');
            if (zeichen && stuecke.length) {
                stuecke[stuecke.length - 1].appendChild(document.createTextNode(zeichen[0]));
                t = t.slice(zeichen[0].length);
            }
            formel = null;
            if (t) p.appendChild(document.createTextNode(t));
        });
        el.appendChild(p);
    });
}
