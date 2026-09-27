// Vorrechnen (vorrechnen.html), part 3 of 12: recognition, the morph into real LaTeX, the film strip.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Recognition ─────────────────────────────────────────────────────
// One call per row. Gemini says WHAT is written; WHERE comes from the
// strokes. Both lists are in reading order, so laying them onto each
// other needs no coordinates from the model - which is good, because its
// coordinates were never trustworthy.
// Hidden host where KaTeX sets the formula for measuring. visibility:hidden,
// not display:none - the boxes must exist.
function messHost() {
    let h = document.getElementById('mess-host');
    if (!h) {
        h = document.createElement('div');
        h.id = 'mess-host';
        h.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;white-space:nowrap;pointer-events:none';
        document.body.appendChild(h);
    }
    return h;
}

// A row that is only a speck (a slip of the pen) is not a formula.
function zuKlein(line) {
    return !line.bbox || Math.max(line.bbox.w, line.bbox.h) < 16;
}

// Doc: "Wurzel und Summenzeichen sehen noch falsch aus" - KaTeX set them
// in text style (limits beside the sum, squeezed fractions and roots). By
// hand a formula is written in display style, so every formula on this
// page - template, measurement, the end of the morph, the recognised one
// - is set that way.
function alsDisplay(latex) { return '\\displaystyle ' + engeBrueche(latex); }

// Doc, 26.09.: "kommen so große Abstände aus LaTeX?" - yes: in display
// style TeX lifts every numerator and lowers every denominator by the
// same fixed amount, whatever they hold. Then "JA" to closing them up,
// and "die Wurzeln nicht so wahnsinnig auseinandergezogen" - so it is
// done in the LaTeX, before KaTeX sets it: the numerator goes down, the
// denominator up, and KaTeX stops each at its least distance from the
// bar (3 bar widths) - and sizes roots and \left( \right) around the
// tight fraction. Only fractions set in display style (not those in a
// numerator or an exponent: they are small and tight already).
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

// How far the ink of a set formula reaches, in page px: glyphs measured
// on a canvas at their baseline, lines and SVGs (roots) by their boxes.
// KaTeX's boxes are taller than the glyphs - and a denominator raised by
// engeBrueche keeps its full depth there.
const tinteCtx = document.createElement('canvas').getContext('2d');
function tinte(el) {
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
        tinteCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = tinteCtx.measureText(text);
        o = Math.min(o, y - m.actualBoundingBoxAscent); u = Math.max(u, y + m.actualBoundingBoxDescent);
    });
    return isFinite(o) ? { o, u } : null;
}

// Shrink a rendered formula (font size in rem) until it fits `frei` px.
function passeEin(el, frei, basis = 2.4) {             // basis: its font size in rem
    if (!el || frei <= 0) return;
    const breit = el.getBoundingClientRect().width;     // scrollWidth is 0 for an inline span
    if (breit > frei) el.style.fontSize = (basis * frei / breit).toFixed(3) + 'rem';
}

// KaTeX sets the formula; the atoms say where every glyph sits. Then the
// whole block is scaled and moved onto the handwriting: same height as
// the row, left edge aligned, centred vertically - Doc's "gleiche Größe".
async function formelAufZeile(latex, line) {
    const m = await KatexAtome.atomeAusLatex(engeBrueche(latex), messHost(), { fontSize: 100, display: true });
    const u = KatexAtome.umfang(m.atome);
    let atome = m.atome;
    // where KaTeX's box sat inside the measuring host - the real formula
    // at the end of the morph goes to exactly the same place
    const hr = messHost().getBoundingClientRect(), kh = messHost().querySelector('.katex-html');
    const kr = kh ? kh.getBoundingClientRect() : hr;
    const satz = { latex, skala: 1, dx: 0, dy: 0, kx: kr.left - hr.left, ky: kr.top - hr.top, kw: kr.width };
    if (u && u.h > 0 && u.w > 0) {
        // "Gleiche Größe" means: the typeset block fits the footprint of
        // the handwriting - height AND width - and never leaves the
        // canvas. Height alone sent a tall integral's fraction off the
        // right edge.
        // Centred on the handwriting (Doc: "den Morph bitte auch x
        // zentriert"), and it must fit on both sides of that centre.
        const breite = container.getBoundingClientRect().width;
        const mitte = line.bbox.x + line.bbox.w / 2;
        const platz = 2 * Math.max(20, Math.min(mitte - 24, breite - mitte - 24));
        const skala = Math.min(line.bbox.h / u.h, line.bbox.w / u.w, platz / u.w);
        const dx = mitte - (u.x + u.w / 2) * skala;
        const dy = (line.bbox.y + line.bbox.h / 2) - (u.y + u.h / 2) * skala;
        atome = KatexAtome.transformiere(m.atome, skala, dx, dy);
        Object.assign(satz, { skala, dx, dy });
    }
    return { atome, svg: m.svg, satz };
}

// Which handwritten symbol is which typeset glyph. The typesetter knows
// the glyph count; when the grouping disagrees it gives way - fused
// symbols are split at their widest gap, fragments merged - and the
// reading order is redone.
function ordneZeile(line, atome, striche = strokes) {
    let zuordnung = FormelErkennen.ordneZu(line.symbols, atome);
    let nachjustiert = false;
    if (!zuordnung.passt) {
        const neu = StrokeSymbols.nachjustieren(line, striche, atome.length, opts);
        if (neu.length === atome.length) {
            line.symbols = neu;
            zuordnung = FormelErkennen.ordneZu(neu, atome);
            nachjustiert = true;
        }
    }
    return { zuordnung, nachjustiert };
}

// Gemini's reading is cleaned before it is used. Doc, 26.09.: "Ein rund-
// oder ungefähr-Zeichen müssen wir immer in ein Gleichheitszeichen
// umbauen" (an unsplit "≈" also threw the row out of the "=" column), and
// "macht er manchmal aus Kleinbuchstaben, besonders bei x, ein großes X -
// können wir die Konsistenz checken?": a letter the task and the working
// know only in the other case takes that case (with "A" and "a" both in
// use, as in the trapezium, nothing changes).
const UNGEFAEHR = /\\(?:approx|thickapprox|simeq|cong|sim)(?![a-zA-Z])|[≈≃≅∼]/g;
const TEXT_BEFEHL = /^\\(?:text|textrm|mathrm|operatorname)$/;
// the letters of a formula - command names and \text{...} left out
function buchstaben(latex) {
    return latex.replace(/\\(?:text|textrm|mathrm|operatorname)\s*\{[^}]*\}/g, ' ')
        .replace(/\\[a-zA-Z]+/g, ' ').split('').filter(c => /[a-zA-Z]/.test(c));
}
function bereinige(latex) {
    const s = latex.replace(UNGEFAEHR, '=');
    const kontext = new Set();
    if (aufgabenModus) {
        buchstaben(AUFGABEN[aufgabeIdx][1]).forEach(c => kontext.add(c));
        kontext.add(AUFGABEN[aufgabeIdx][2]);
    }
    rechenweg.forEach(e => buchstaben(e.latex).forEach(c => kontext.add(c)));
    let out = '', i = 0;
    while (i < s.length) {
        if (s[i] === '\\') {
            const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(i));
            const befehl = m ? m[0] : '\\';
            let n = befehl.length;
            if (TEXT_BEFEHL.test(befehl)) {
                const gruppe = /^\s*\{[^}]*\}/.exec(s.slice(i + n));
                if (gruppe) n += gruppe[0].length;
            }
            out += s.slice(i, i + n);
            i += n;
            continue;
        }
        const c = s[i];
        if (/[a-zA-Z]/.test(c)) {
            const andere = c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase();
            out += (!kontext.has(c) && kontext.has(andere)) ? andere : c;
        } else out += c;
        i++;
    }
    return out;
}

async function erkennen() {
    if (erkennenLaeuft) return;
    if (!analysis.lines.length) { setErgebnisText('Erst etwas schreiben.'); return; }
    erkennenLaeuft = true;
    erkennenKlein();                   // the wave runs
    // a stroke written while the answer is on its way makes it stale
    const stand = erkennenStand;
    setErgebnisText('Erkenne …');
    const modelEl = document.getElementById('modell-wahl');
    const model = modelEl ? modelEl.value : 'gemini-2.5-flash';
    let ab = null;                     // a second line tries the steps after the first one's
    try {
        for (const line of analysis.lines) {
            if (zuKlein(line)) { zeilenErgebnis[line.lineIdx] = { uebersprungen: true }; continue; }
            const idxs = line.symbols.flatMap(sy => sy.strokeIdxs);
            // in class the steps still to come first - Gemini only when none fits
            const erwartet = await erwarteterSchritt(line, strokes, ab);
            if (stand !== erkennenStand) return;
            if (erwartet) ab = erwartet.j + 1;
            const r = erwartet ? { ok: true, latex: erwartet.latex, tokens: [], ms: 0 }
                : await FormelErkennen.erkenneZeile(strokes, idxs, { model });
            if (stand !== erkennenStand) return;
            if (!r.ok) {
                zeilenErgebnis[line.lineIdx] = { fehler: r.error };
            } else if (!r.latex || /^\(?\s*(empty|leer)\s*\)?$/i.test(r.latex)) {
                zeilenErgebnis[line.lineIdx] = { fehler: 'nichts erkannt' };
            } else {
                const latex = erwartet ? erwartet.latex : bereinige(r.latex);
                const { atome, svg, satz } = erwartet || await formelAufZeile(latex, line);
                if (stand !== erkennenStand) return;
                const { zuordnung, nachjustiert } = ordneZeile(line, atome);
                zeilenErgebnis[line.lineIdx] = {
                    latex, tokens: r.tokens, atome, ms: r.ms, zuordnung, svg, nachjustiert, satz, erwartet: !!erwartet,
                };
                // Doc's plan B: the row crumbles to one dust cloud and
                // settles into the formula (js/staub-morph.js) - each
                // symbol's dust into its own glyph when the mapping holds,
                // the row as a whole when it does not. Radicals and
                // vector arrows are SVG in KaTeX - they are traced first.
                try {
                    await HandschriftMorph.schriftenBereit(atome);
                    await HandschriftMorph.svgVorbereiten(atome);
                    if (stand !== erkennenStand) return;
                    morphVorbereitet[line.lineIdx] = bereiteMorph(line, zuordnung, atome);
                } catch (e) {
                    morphVorbereitet[line.lineIdx] = null;
                }
            }
            redraw();
            setErgebnisText(null);
            zeigeFormeln();
        }
    } finally {
        erkennenLaeuft = false;
        erkennenKlein();               // also after a stale answer, which returns early
    }
    // Straight into the morph - with the button gone there is nothing
    // left to press, and Doc wanted it to happen by itself anyway.
    // Doc, 26.09.: "Wenn die Erkennung fertig ist ... noch nix weiter" -
    // outside "Beispiele" the recognised line shows at the bottom and the
    // ink waits; a tap on that line sends it up, morphing on the way
    if (testModus && morphVorbereitet.some(Boolean)) morphen(1);
    redraw();
    // Every ERKENNEN is a probe for the corpus, good or bad.
    if (strokes.length) speichereProbe();
    // Doc, 26.09. evening: "Wenn das erkannt ist, starte bitte die Animation
    // sofort" - in class the recognised page flies up at once, no tap needed.
    // By itself only a whole step: every line with an "=" (a pause in the
    // middle sent "1/f - 1/g" up without its "= 1/b"); a tap or two fingers
    // still send anything
    const ganz = analysis.lines.every(l => zuKlein(l) || (zeilenErgebnis[l.lineIdx] && /=/.test(zeilenErgebnis[l.lineIdx].latex || '')));
    if (!testModus && seiteErkannt() && ganz) rechenwegHoch();
}

// The typeset formula under the handwriting - real LaTeX, set by KaTeX.
function zeigeFormeln() {
    if (anzeigeModus) return;
    let host = document.getElementById('formel-schicht');
    if (!host) {
        host = document.createElement('div');
        host.id = 'formel-schicht';
        // Doc: "so groß wie oben und weiter runter" - the counterpart of the
        // template strip: a strip at the bottom edge, formulas centred
        host.style.cssText = `position:absolute;left:0;right:0;bottom:${ZEITLEISTE_H}px;min-height:84px;pointer-events:none;` +
            'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.4rem';
        container.appendChild(host);
    }
    host.innerHTML = '';
    // above the film strip in "Beispiele"; in class at the bottom edge -
    // Doc, 26.09.: "zeige unten nur, was Google erkannt hat, sozusagen als
    // Zeile ... tippt drauf, wusch, geht's hoch"
    host.style.bottom = (testModus ? ZEITLEISTE_H : 8) + 'px';
    host.style.minHeight = testModus ? '84px' : '0';
    host.style.justifyContent = testModus ? 'center' : 'flex-end';
    if (!view.formelUnten) return;
    analysis.lines.forEach(line => {
        const erg = zeilenErgebnis[line.lineIdx];
        if (!erg || !erg.latex || !line.bbox) return;
        const d = document.createElement('div');
        // a shade darker than the ink, as large as the template on top; in
        // class green - Doc: "wenn die Formel da ist ... die Formel in grün"
        d.style.cssText = `color:${testModus ? (hell ? '#7a8294' : '#9aa5b5') : 'rgb(121, 158, 49)'};font-size:2.4rem`;
        try { katex.render(alsDisplay(erg.latex), d, { throwOnError: false, displayMode: false }); }
        catch (e) { d.textContent = erg.latex; }
        if (!testModus) {
            // a tap (not a stroke) sends the page up, as the two-finger swipe does
            d.style.pointerEvents = 'auto';
            d.style.cursor = 'pointer';
            d.style.touchAction = 'manipulation';
            d.title = 'Tippen: hochschicken';
            let tipp0 = null;
            d.addEventListener('pointerdown', ev => { tipp0 = { x: ev.clientX, y: ev.clientY }; });
            d.addEventListener('pointerup', ev => {
                if (tipp0 && Math.hypot(ev.clientX - tipp0.x, ev.clientY - tipp0.y) < 12) rechenwegHoch();
                tipp0 = null;
            });
        }
        host.appendChild(d);
        passeEin(d, host.clientWidth - 48);
    });
    anzeigeBald();
}

// ── Morph ───────────────────────────────────────────────────────────
// Doc: "meine in LT faden (morph nicht transp)" - the ink turns into
// the formula, it does not fade. How long it takes is Doc's to set
// (slider "Morph-Dauer", remembered on the device).
// Doc: 0.1 to 1 s ("mach den speed slider 0.1 - 1 s")
let morphDauer = 0.6;                        // seconds
// Dust or strokes (Doc, 25.09.: "Bau mir bitte einen Schalter ... welches
// von beiden"). The stroke morph (js/strich-morph.js) bends each pen line
// onto the glyph's centre line; it needs the symbol-glyph pairing, so
// without one the dust takes over.
let morphArt = 'staub';
try { if (localStorage.getItem('vorrechnen-morph-art') === 'strich') morphArt = 'strich'; } catch (_) {}
function bereiteMorph(line, zuordnung, atome, striche = strokes) {
    if (morphArt === 'strich' && zuordnung && zuordnung.passt) {
        const g = StrichMorph.vorbereiten(line, striche, zuordnung);
        if (g && g.length) return { art: 'strich', glyphen: g };
    }
    const v = StaubMorph.vorbereiten(line, striche, zuordnung && zuordnung.paare ? zuordnung : atome, morphOpts);
    return v ? Object.assign(v, { art: 'staub' }) : null;
}
function zeichneMorph(c, v, t, farbe = INK) {
    if (v.art === 'strich') StrichMorph.zeichnen(c, v.glyphen, t, { farbe, zielFarbe: farbe, staffel: morphOpts.staffel });
    else StaubMorph.zeichnen(c, v, t, { farbe, zielFarbe: farbe,
        staffel: morphOpts.staffel, wirbel: morphOpts.wirbel, staub: morphOpts.staub });
}
function wechsleMorphArt(art) {
    morphArt = art || (morphArt === 'staub' ? 'strich' : 'staub');
    try { localStorage.setItem('vorrechnen-morph-art', morphArt); } catch (_) {}
    document.querySelectorAll('input[name="morph-art"]').forEach(r => { r.checked = r.value === morphArt; });
    nachRegler(true);                    // prepare again in the new kind, replay
}

// The dust morph's knobs (js/staub-morph.js), on sliders for Doc: the
// cloud's shape needs a new preparation, the rest only a new drawing.
const morphOpts = { dichte: 0.5, wolke: 0.25, auftrieb: 0.25, wirbel: 0.1, staffel: 0, staub: 0.8, pause: 0.9 };
try { Object.assign(morphOpts, JSON.parse(localStorage.getItem('vorrechnen-morph') || '{}')); } catch (_) {}
function bereiteMorphNeu() {
    analysis.lines.forEach(line => {
        const erg = zeilenErgebnis[line.lineIdx];
        if (!erg || !erg.atome || !morphVorbereitet[line.lineIdx]) return;
        morphVorbereitet[line.lineIdx] = bereiteMorph(line, erg.zuordnung, erg.atome);
    });
}
// Letting go of a slider replays the morph, so the effect can be judged.
let reglerTimer = null, reglerNeu = false;
function nachRegler(neu) {
    reglerNeu = reglerNeu || neu;
    clearTimeout(reglerTimer);
    reglerTimer = setTimeout(() => {
        if (reglerNeu) bereiteMorphNeu();
        reglerNeu = false;
        if (!morphVorbereitet.some(Boolean)) return;
        setzeMorph(0);
        morphen(1);
    }, 350);
}
try { const v = parseFloat(localStorage.getItem('vorrechnen-morph-dauer')); if (v > 0) morphDauer = Math.min(1, Math.max(0.1, v)); } catch (_) {}
function morphen(ziel) {
    if (morphAnim) cancelAnimationFrame(morphAnim);
    const von = morphT, nach = (ziel === undefined) ? (morphT > 0.5 ? 0 : 1) : ziel;
    const dauer = morphDauer * 1000;
    const t0 = performance.now();
    const schritt = () => {
        const f = Math.min(1, (performance.now() - t0) / dauer);
        morphT = von + (nach - von) * f;
        redraw();
        const sl = document.getElementById('morph-regler');
        if (sl) sl.value = morphT;
        if (f < 1) morphAnim = requestAnimationFrame(schritt);
        else { morphAnim = null; morphT = nach; redraw(); }
    };
    schritt();
}

function setzeMorph(v) {
    if (morphAnim) { cancelAnimationFrame(morphAnim); morphAnim = null; }
    morphT = parseFloat(v);
    redraw();
}

// ── The end of the morph is real LaTeX ──────────────────────────────
// Doc: "könntest Du heimlich am Ende LaTeX zeigen (ich sehe das :-)". The
// dust lands on traced outlines of the KaTeX glyphs; at t = 1 the row is
// handed to KaTeX itself, at exactly the place and size the atoms were
// measured from - the swap cannot be seen, the result is just sharper.
function zeigeSatz() {
    let host = document.getElementById('satz-schicht');
    if (!host) {
        host = document.createElement('div');
        host.id = 'satz-schicht';
        host.style.cssText = 'position:absolute;inset:0;pointer-events:none';
        container.appendChild(host);
    }
    const soll = new Set();
    analysis.lines.forEach(line => {
        const erg = zeilenErgebnis[line.lineIdx];
        if (morphT < 1 || !erg || !erg.satz || !morphVorbereitet[line.lineIdx]) return;
        const z = erg.satz, key = 'z' + line.lineIdx, farbe = anzeige(linienFarbe(line));
        const sig = [z.latex, z.skala, z.dx, z.dy, farbe].join('|');
        soll.add(key);
        const alt = host.querySelector(`[data-zeile="${key}"]`);
        if (alt && alt.dataset.sig === sig) return;
        if (alt) alt.remove();
        const d = document.createElement('div');
        d.dataset.zeile = key;
        d.dataset.sig = sig;
        d.style.cssText = `position:absolute;left:${z.dx}px;top:${z.dy}px;font-size:${100 * z.skala}px;` +
            `white-space:nowrap;line-height:normal;color:${farbe}`;
        host.appendChild(d);
        try { katex.render(alsDisplay(z.latex), d, { throwOnError: false, displayMode: false }); } catch (_) { return; }
        // land on the measured spot: correct whatever the surroundings shifted
        const k = d.querySelector('.katex-html');
        if (!k) return;
        const c = container.getBoundingClientRect(), r = k.getBoundingClientRect();
        const sollX = z.dx + z.kx * z.skala, sollY = z.dy + z.ky * z.skala;
        d.style.left = (z.dx + sollX - (r.left - c.left)) + 'px';
        d.style.top = (z.dy + sollY - (r.top - c.top)) + 'px';
    });
    host.querySelectorAll('[data-zeile]').forEach(d => { if (!soll.has(d.dataset.zeile)) d.remove(); });
}

// ── Film strip: scrub the morph back and forth ──────────────────────
// Doc: "wie in einem Movie einen Slider (vor, zurück)", "mit dem Finger
// ... ganze Breite", "oder Stift!". A strip of its own along the bottom
// edge, not a gesture on the page: Doc writes with pen AND finger. Any
// pointer anywhere across the full width sets the morph to that point.
// Built on first use; redraw() keeps it in step with the morph.
let zeitleiste = null, abspielen = null;
// Doc, 26.09.: "nimm PLAY butt raus und mach ihn unter den Slider rechts
// als Dreieck", then "x mittig", "größer wie vor zurück" - the strip grew
// from 56 to 80 px: the track stays 28 px from its top, PLAY sits under
// its middle, as large as the board's back/forward triangles
const ZEITLEISTE_H = 80;
function zeigeZeitleiste() {
    if (!zeitleiste) {
        zeitleiste = document.createElement('div');
        zeitleiste.id = 'zeitleiste';
        zeitleiste.setAttribute('role', 'slider');
        zeitleiste.setAttribute('aria-label', 'Morph vor und zurück');
        zeitleiste.setAttribute('aria-valuemin', '0');
        zeitleiste.setAttribute('aria-valuemax', '1');
        zeitleiste.style.cssText = `position:absolute;left:0;right:0;bottom:0;height:${ZEITLEISTE_H}px;` +
            'touch-action:none;cursor:ew-resize;z-index:5';
        zeitleiste.innerHTML = '<div class="zl-spur"></div><div class="zl-fuellung"></div><div class="zl-knopf"></div>';
        container.appendChild(zeitleiste);
        // a sibling above the strip, so a tap on it plays and does not scrub
        abspielen = document.createElement('button');
        abspielen.id = 'zl-play';
        abspielen.title = 'Morph noch einmal abspielen';
        abspielen.setAttribute('aria-label', 'Morph noch einmal abspielen');
        abspielen.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);bottom:1px;width:56px;height:40px;padding:0;border:none;' +
            'background:transparent;color:#8a93a3;cursor:pointer;touch-action:manipulation;z-index:6;' +
            'display:flex;align-items:center;justify-content:center';
        abspielen.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path d="M7 4 L18 12 L7 20 Z" fill="currentColor"/></svg>';
        abspielen.addEventListener('click', () => nochmal());
        container.appendChild(abspielen);
        const zeitAn = ev => {
            const r = zeitleiste.getBoundingClientRect();
            return Math.max(0, Math.min(1, (ev.clientX - r.left - 24) / Math.max(1, r.width - 48)));
        };
        // Doc: "den Switch zwischen den beiden auf Double-Tap oder Double-
        // Mausklick" - here, not on the page, where two quick taps are a
        // colon or an i's dot
        let tippZeit = 0, tippX = 0;
        zeitleiste.addEventListener('pointerdown', ev => {
            const jetzt = performance.now();
            if (jetzt - tippZeit < 350 && Math.abs(ev.clientX - tippX) < 40) {
                tippZeit = 0;
                ev.preventDefault();
                wechsleMorphArt();
                return;
            }
            tippZeit = jetzt; tippX = ev.clientX;
            try { zeitleiste.setPointerCapture(ev.pointerId); } catch (_) {}
            clearTimeout(beispielTimer);            // a pending replay must not jump in
            setzeMorph(zeitAn(ev));
            ev.preventDefault();
        });
        zeitleiste.addEventListener('pointermove', ev => {
            if (zeitleiste.hasPointerCapture && zeitleiste.hasPointerCapture(ev.pointerId)) setzeMorph(zeitAn(ev));
        });
    }
    const b = Math.max(0, zeitleiste.clientWidth - 48);
    zeitleiste.querySelector('.zl-fuellung').style.width = (b * morphT) + 'px';
    zeitleiste.querySelector('.zl-knopf').style.left = (24 + b * morphT) + 'px';
    zeitleiste.style.opacity = morphVorbereitet.some(Boolean) ? '1' : '0.35';
    abspielen.style.opacity = zeitleiste.style.opacity;
    // Doc, 26.09.: "zeig play und slider nur in Beispiel Mode"
    zeitleiste.style.display = testModus ? '' : 'none';
    abspielen.style.display = testModus ? 'flex' : 'none';
    zeitleiste.setAttribute('aria-valuenow', morphT.toFixed(2));
}

function setErgebnisText(msg) {
    const el = document.getElementById('erkennung-out');
    if (!el) return;
    if (msg) { el.innerHTML = '<div class="erk-info">' + msg + '</div>'; return; }
    const teile = analysis.lines.map(l => {
        const e = zeilenErgebnis[l.lineIdx];
        if (!e) return '';
        if (e.fehler) return `<div class="erk-zeile"><b>Zeile ${l.lineIdx}</b>
                    <div class="erk-fehler">${e.fehler}</div></div>`;
        if (e.uebersprungen) return '';
        const z = e.zuordnung;
        const hinweis = '';
        return `<div class="erk-zeile"><b>Zeile ${l.lineIdx}</b>
                    <div class="erk-latex">${e.latex.replace(/</g, '&lt;')}</div>
                    <div class="${z.passt ? 'erk-ok' : 'erk-warn'}">${z.diagnose}${e.nachjustiert ? ' – Gruppierung an die Zeichenzahl angeglichen' : ''}</div>${hinweis}
                    <div class="erk-info">${e.atome.length} Zeichen gesetzt · ${e.ms} ms</div></div>`;
    });
    el.innerHTML = teile.join('') || '<div class="erk-info">–</div>';
}
