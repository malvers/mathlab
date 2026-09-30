// How a working is set on the board of vorrechnen.html - the pieces another page needs to look the same
// (decks/tafel.html, Doc 30.09.2026: "die Optik in Tafel ist noch anders als Vorrechnen. Bitte angleichen").
// A classic script: its functions are globals. The same functions still live in the Vorrechnen scripts
// (engeBrueche, alsDisplay, tinte: js/vorrechnen-erkennen.js; hebeVariable: js/vorrechnen-werkzeuge.js;
// smileyIcon: js/vorrechnen-rechenweg.js) - they are meant to come from here once Vorrechnen loads this file.
// No top-level const/let here: the Vorrechnen scripts share one global scope and declare their own.

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
