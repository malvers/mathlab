// Vorrechnen (vorrechnen.html), part 8 of 12: a line in flight while it is recognised, the hints.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── In flight: the line goes up while it is being recognised ────────
// The ink leaves the page at once (the next step can be written right
// away) and glides, shrinking, to where the next step will be. When
// Gemini answers (~1.5 s) the row is laid out hidden, the frame turns
// towards its exact place and the morph plays on the way; on landing
// the KaTeX row takes over. A line that cannot be read flies back.
const fluege = [];                 // lines in the air, in swipe order
const imFlug = new Set();          // steps laid out, their line not landed yet
let flugKette = Promise.resolve(), flugFrame = null, flugStand = 0;
// LEEREN of the working or another task: lines in the air are dropped
function flugAbbrechen() {
    flugStand++;
    fluege.length = 0;
    imFlug.clear();
    redraw();
}
const FLUG_START = 800;            // ms to the estimated place
function flugZiel(f, ziel, dauer) {
    f.von = Object.assign({}, f.p);
    f.ziel = ziel;
    f.t0 = performance.now();
    f.dauer = dauer;
    flugLos();
}
function flugLos() { if (!flugFrame) flugFrame = requestAnimationFrame(flugSchritt); }
function flugSchritt() {
    flugFrame = null;
    const jetzt = performance.now();
    const grenze = papierGrenze(container.getBoundingClientRect().height);
    fluege.slice().forEach(f => {
        const u = Math.min(1, (jetzt - f.t0) / f.dauer), e = 1 - Math.pow(1 - u, 3);
        ['tx', 'ty', 's'].forEach(k => { f.p[k] = f.von[k] + (f.ziel[k] - f.von[k]) * e; });
        // Doc, 26.09.: "das eigentliche Morph soll beginnen, sobald das Ding den
        // unteren Teil verlässt ... wenn die die Linie für mein Schreibpad
        // überschreitet" - once the ink's lower edge is above the line. The rest
        // of the way then takes as long as the morph, so both arrive together
        // (set here, not by flugZiel: that would start a second frame loop).
        if (f.morphBereit && f.mt0 === null && f.p.ty + f.p.s * f.unten < grenze) {
            f.mt0 = jetzt;
            f.von = Object.assign({}, f.p);
            f.t0 = jetzt;
            f.dauer = Math.max(300, morphDauer * 1000);
            return;
        }
        if (f.v && f.mt0 !== null) f.mt = Math.min(1, (jetzt - f.mt0) / (morphDauer * 1000));
        if (u < 1) return;
        if (f.zurueck) flugZurueck(f);
        else if (f.bereit && (!f.v || f.mt >= 1)) flugLandet(f);
    });
    redraw();
    if (fluege.some(f => f.von)) flugFrame = requestAnimationFrame(flugSchritt);
}
function flugWeg(f) {
    const i = fluege.indexOf(f);
    if (i >= 0) fluege.splice(i, 1);
}
function flugLandet(f) {
    flugWeg(f);
    imFlug.delete(f.schritt);
    document.querySelectorAll(`#rechenweg-schicht [data-schritt="${f.schritt}"]`).forEach(z => { z.style.visibility = ''; });
}
function flugZurueck(f) {
    flugWeg(f);
    f.striche.forEach(st => strokes.push(st));
    recompute();
    merkeStriche();
}
// where the k-th line still waiting will go: in the k-th free line under
// the working, its centre on the column of the equals signs, about a
// step's height
function schaetzeZiel(b, k) {
    const host = document.getElementById('rechenweg-schicht');
    const c = container.getBoundingClientRect(), glyph = 1.21 * parseFloat(getComputedStyle(host).fontSize);
    let gleich = c.width / 2;
    if (host.children[0]) gleich = host.children[0].getBoundingClientRect().right - c.left;
    const s = Math.min(1, 1.2 * glyph / Math.max(1, b.h));
    const mitte = (rechenwegLinie + k + 0.5) * ZEILE - 1;
    return { s, tx: gleich - s * (b.x + b.w / 2), ty: mitte - s * (b.y + b.h / 2) };
}
function starteFluege(zeilen) {
    const wartend = fluege.filter(f => !f.bereit).length;
    const neu = zeilen.map((l, k) => {
        const idxs = [...new Set(l.symbols.flatMap(sy => sy.strokeIdxs))].sort((a, b) => a - b);
        const erg = zeilenErgebnis[l.lineIdx];
        // Doc, 27.09.: "alles, was hochfliegt, ist blau" - ink, whatever the pen had
        const f = { striche: idxs.map(i => strokes[i]), latex: erg && erg.latex || null, farbe: INK, v: null, mt: 0, mt0: null,
            unten: Math.max(...idxs.flatMap(i => strokes[i].points.map(q => q.y))), morphBereit: false,
            p: { tx: 0, ty: 0, s: 1 }, bereit: false, zurueck: false, schritt: -1 };
        flugZiel(f, schaetzeZiel(l.bbox, wartend + k), FLUG_START);
        return f;
    });
    // the page is free at once - the notes in the margin go too, they belonged
    // to this step; a recognition under way is void now
    const weg = new Set(zeilen.flatMap(l => l.symbols.flatMap(sy => sy.strokeIdxs)));
    const istNotiz = notizPruefer();
    strokes.forEach((s, i) => { if (istNotiz(s)) weg.add(i); });
    const bleiben = strokes.filter((_, i) => !weg.has(i));
    strokes.length = 0;
    bleiben.forEach(st => strokes.push(st));
    neu.forEach(f => fluege.push(f));
    verwerfeErkennung();
    recompute();
    merkeStriche();
    // one after the other, so the steps keep the order they were swiped in
    neu.forEach(f => { flugKette = flugKette.then(() => erkenneFlug(f)); });
    // Doc, 27.09.: "Wenn ich unten links anfange zu schreiben, stellt die Farbe bitte
    // immer automatisch auf blau ... wenn ich mal was highlighten will, da einfach auf
    // grün schalte und dann vergesse ich zurückzuschalten" - a colour holds for the
    // line it was picked for; once that line is up, the pen writes ink again
    if (!testModus && stiftFarbe !== INK) {
        stiftFarbe = INK;
        try { localStorage.setItem('vorrechnen-farbe', INK); } catch (_) {}
        zeigeWerkzeuge();
    }
}
async function erkenneFlug(f) {
    const stand = flugStand;
    try {
        const ana = StrokeSymbols.analyse(f.striche, opts);
        if (aufgabenModus) alsEineZeile(ana, true);     // in class the flight is one step, as its row was
        if (ana.lines.length !== 1) throw new Error('keine einzelne Zeile');
        const line = ana.lines[0];
        let latex = f.latex;
        if (!latex) {                       // in class the steps still to come first
            const e = await erwarteterSchritt(line, f.striche);
            if (e) latex = e.latex;
        }
        if (!latex) {
            const modelEl = document.getElementById('modell-wahl');
            flugLiest++;
            erkennenKlein();
            let r;
            try {
                r = await FormelErkennen.erkenneZeile(f.striche, line.symbols.flatMap(sy => sy.strokeIdxs),
                    { model: modelEl ? modelEl.value : 'gemini-2.5-flash' });
            } finally {
                flugLiest--;
                erkennenKlein();
            }
            if (!r.ok || !r.latex || /^\(?\s*(empty|leer)\s*\)?$/i.test(r.latex)) throw new Error(r.error || 'nichts erkannt');
            latex = bereinige(r.latex);
        }
        if (stand !== flugStand) return;
        const { atome, satz } = await formelAufZeile(latex, line);
        const { zuordnung } = ordneZeile(line, atome, f.striche);
        try {
            await HandschriftMorph.schriftenBereit(atome);
            await HandschriftMorph.svgVorbereiten(atome);
            f.v = bereiteMorph(line, zuordnung, atome, f.striche);
        } catch (_) { f.v = null; }
        if (stand !== flugStand) return;
        // the row, hidden, gives the exact place: the typeset line's
        // corner and width map onto the row's
        const i = rechenweg.length;
        rechenweg.push({ latex, farbe: f.farbe });
        merkeRechenweg();
        imFlug.add(i);
        zeigeRechenweg();
        const c = container.getBoundingClientRect();
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity;
        document.querySelectorAll(`#rechenweg-schicht [data-schritt="${i}"]`).forEach(z => {
            const r = (z.querySelector('.katex-html') || z).getBoundingClientRect();
            if (r.width) { x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); }
        });
        f.schritt = i;
        f.bereit = true;
        if (!isFinite(x0) || !satz.kw) { f.v = null; flugZiel(f, f.ziel, 1); return; }
        const sx = satz.dx + satz.kx * satz.skala, sy = satz.dy + satz.ky * satz.skala, sw = satz.kw * satz.skala;
        const s = (x1 - x0) / Math.max(1, sw);
        f.morphBereit = true;              // it starts once the ink is over the line (flugSchritt)
        flugZiel(f, { s, tx: x0 - c.left - s * sx, ty: y0 - c.top - s * sy }, Math.max(500, morphDauer * 1000));
    } catch (e) {
        if (stand !== flugStand) return;
        f.zurueck = true;
        flugZiel(f, { tx: 0, ty: 0, s: 1 }, 600);
    }
}

function rechenwegHoch() {
    const zeilen = analysis.lines.filter(l => !zuKlein(l));
    if (!zeilen.length) return;
    verlaufZurueck();
    merkeVerlauf();
    // Doc, 25.09.: "wenn ich mit zwei Fingern nach oben schiebe, die
    // Erkennung sofort beginnt ... Vielleicht sogar in der Bewegung" -
    // a line not typeset yet takes off at once and morphs on the way
    // (starteFluege); so does everything while earlier flights are
    // still up, or the steps would overtake each other
    // ("zwei Finger oder ... soll die Handschrift hochfliegen und im Flug sich
    // verwandeln", a tap on the recognised line too - only a line already
    // typeset in place, as in "Beispiele", flies as KaTeX)
    const fertig = morphT >= 1 && zeilen.every(l => zeilenErgebnis[l.lineIdx] && zeilenErgebnis[l.lineIdx].latex && zeilenErgebnis[l.lineIdx].satz);
    if (!fertig || fluege.length) { starteFluege(zeilen); return; }
    if (morphT < 1) setzeMorph(1);
    const c = container.getBoundingClientRect();
    // where each line is now: its typeset formula, or its ink if the morph did not take
    const von = zeilen.map(l => {
        const k = document.querySelector(`#satz-schicht [data-zeile="z${l.lineIdx}"] .katex-html`);
        if (k) { const r = k.getBoundingClientRect(); if (r.width) return { x: r.left - c.left, y: r.top - c.top, w: r.width }; }
        return { x: l.bbox.x, y: l.bbox.y, w: l.bbox.w };
    });
    const latexe = zeilen.map(l => zeilenErgebnis[l.lineIdx].latex);
    const farben = zeilen.map(l => linienFarbe(l));
    const erster = rechenweg.length;
    latexe.forEach((l, k) => rechenweg.push({ latex: l, farbe: farben[k] }));
    merkeRechenweg();
    // the ink and the typeset line go; the new steps wait hidden in their place
    const weg = new Set(zeilen.flatMap(l => l.symbols.flatMap(sy => sy.strokeIdxs)));
    const bleiben = strokes.filter((_, i) => !weg.has(i));
    strokes.length = 0;
    bleiben.forEach(s => strokes.push(s));
    verwerfeErkennung();
    recompute();
    merkeStriche();
    zeigeRechenweg(erster);
    const host = document.getElementById('rechenweg-schicht');
    latexe.forEach((latex, k) => {
        const zellen = [...host.querySelectorAll(`[data-schritt="${erster + k}"]`)];
        const zeigen = () => zellen.forEach(z => { z.style.visibility = ''; });
        let x0 = Infinity, y0 = Infinity;
        zellen.forEach(z => {
            const r = (z.querySelector('.katex-html') || z).getBoundingClientRect();
            if (r.width) { x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); }
        });
        if (!isFinite(x0)) { zeigen(); return; }
        // one piece in flight, set at the step's size (smaller when newer
        // steps came with it) and nudged onto its spot
        const flug = document.createElement('div');
        flug.style.cssText = `position:absolute;left:${x0 - c.left}px;top:${y0 - c.top}px;pointer-events:none;` +
            `white-space:nowrap;line-height:normal;font-size:${getComputedStyle(zellen[0]).fontSize};color:${anzeige(farben[k])};z-index:4`;
        try { katex.render(alsDisplay(latex), flug, { throwOnError: false }); } catch (_) { flug.textContent = latex; }
        container.appendChild(flug);
        const fk = flug.querySelector('.katex-html') || flug;
        let r = fk.getBoundingClientRect();
        const links = x0 - c.left + (x0 - r.left), oben = y0 - c.top + (y0 - r.top);
        flug.style.left = links + 'px';
        flug.style.top = oben + 'px';
        r = fk.getBoundingClientRect();
        const a = von[k], s = a.w / Math.max(1, r.width);
        // scale about the formula's own corner, so start and end are exact
        flug.style.transformOrigin = `${r.left - c.left - links}px ${r.top - c.top - oben}px`;
        flug.style.transform = `translate(${a.x - (r.left - c.left)}px, ${a.y - (r.top - c.top)}px) scale(${s})`;
        const zwilling = anzeigeZwilling(flug);       // the same piece on the beamer
        flug.getBoundingClientRect();
        flug.style.transition = 'transform 0.7s cubic-bezier(0.3, 0.7, 0.3, 1)';
        flug.style.transform = 'none';
        if (zwilling) {
            try {
                zwilling.getBoundingClientRect();
                zwilling.style.transition = flug.style.transition;
                zwilling.style.transform = 'none';
            } catch (_) {}
        }
        let gelandet = false;
        const landen = () => {
            if (gelandet) return;
            gelandet = true;
            flug.remove();
            if (zwilling) try { zwilling.remove(); } catch (_) {}
            zeigen();
        };
        flug.addEventListener('transitionend', landen, { once: true });
        setTimeout(landen, 1000);
    });
}

// Doc: "auf der rechten Seite im großen Panel links und rechts ein
// Dreieck", then "in die Mitte. Y" - the panel's back and forth on the
// board itself, at the left and right edge, halfway down
// Bottom centre in class (Aufgaben, Frei): the small ERKENNEN until the
// page is recognised, then the recognised line in its place - a tap on
// that line is GO (zeigeFormeln). Doc: "wenn da noch nichts steht, kann
// ich auch nicht abschicken ... mach dann doch den Erkennen-Button"
function seiteErkannt() {
    const zeilen = analysis.lines.filter(l => !zuKlein(l));
    return zeilen.length > 0 && zeilen.every(l => zeilenErgebnis[l.lineIdx] && zeilenErgebnis[l.lineIdx].latex);
}
function erkennenKlein() {
    let k = document.getElementById('erkennen-klein');
    if (!k) {
        k = document.createElement('button');
        k.id = 'erkennen-klein';
        k.type = 'button';
        k.title = 'Erkennen';
        // the word, and the wave that replaces it while Gemini reads
        // (a path of four periods in a box of three, shifted by one)
        k.innerHTML = '<span class="erk-wort">ERKENNEN</span>' +
            '<svg class="erk-welle" viewBox="0 0 120 24" aria-hidden="true" focusable="false">' +
            '<path d="M0 12 Q10 3 20 12 T40 12 T60 12 T80 12 T100 12 T120 12 T140 12 T160 12"/></svg>';
        // Reading comes first, down on the page, then the line flies with its exact
        // place known. (26.09. night a tap sent it at once and it was read in flight:
        // when Gemini had to read, the line hovered half way and then set off a second
        // time - Doc: "das war vorher absolut perfekt". Reverted.)
        k.addEventListener('click', () => erkennen());
        container.appendChild(k);
    }
    // ERKENNEN starts 12 px right of the margin's line (Doc: "linksbündig an
    // die gestrichelte Linie"); both buttons of the margin shrink together
    // when it is narrower than ERKENNEN (150), the C (46) and their gaps
    // (12 + 8 + 12)
    const breite = container.getBoundingClientRect().width, x = notizX(breite);
    k.style.left = (x + 2 + 12) + 'px';                     // the line is 2 px wide
    // Doc, 27.09.: "den Radiergummi, die zwei Cs, und das Erkennen kleiner und ein Tick
    // weiter runter. Wir brauchen Platz" - three quarters at most (and 6 px from the bottom)
    container.style.setProperty('--knopf', Math.min(0.75, (breite - x - 2 - 32) / (150 + 46)).toFixed(3));
    const liest = erkennenLaeuft || flugLiest > 0;
    k.style.display = (testModus || seiteErkannt()) ? 'none' : '';
    k.classList.toggle('liest', liest);
    // pale on an empty page, unless a line in the air is being read
    k.style.opacity = (!liest && !analysis.lines.some(l => !zuKlein(l))) ? '0.4' : '';
}
// The next step of the solution, grey, at the top of the squares - for Doc
// only (Doc, 26.09.: "bei mir unten den jeweils nächsten Schritt in Grau ...
// aber das dürfen die Kids natürlich nicht sehen"): it is no mirrored layer,
// so the beamer never gets it. Where the working stands: its last line among
// the steps (a skipped or merged step), else by the number of lines.
function schrittNorm(s) {
    return String(s).replace(/\\(?:left|right|displaystyle|cdot|times|[,;:! ])|\s|\{\}/g, '').replace(/\\[dt]frac/g, '\\frac');
}
function naechsterIndex(loesung) {
    const letzte = rechenweg.length ? schrittNorm(rechenweg[rechenweg.length - 1].latex) : null;
    let hier = -1;
    loesung.forEach(([st], k) => { if (schrittNorm(st) === letzte) hier = k; });
    return hier >= 0 ? hier + 1 : rechenweg.length;
}
function naechsterSchritt() {
    const loesung = aufgabenModus && LOESUNGEN[AUFGABEN[aufgabeIdx][0]];
    if (!loesung) return null;
    return loesung[naechsterIndex(loesung)] || null;
}
// the next n steps, for the grey preview (Doc, 27.09.: "zeig die nächsten 3")
function naechsteSchritte(n) {
    const loesung = aufgabenModus && LOESUNGEN[AUFGABEN[aufgabeIdx][0]];
    if (!loesung) return [];
    const i = naechsterIndex(loesung);
    return loesung.slice(i, i + n);
}
// Doc, 26.09. evening: "warum machen wir denn bei den Aufgaben überhaupt eine
// Erkennung? Wir kennen ja das Ergebnis" - in class a line is first laid against
// the steps still to come: the next one, then later ones (a step skipped). A step
// counts when the handwriting's own grouping has exactly its glyphs - no
// regrouping, that would make almost anything fit - and every glyph sits where
// its symbol sits (both scaled to their own box, the check of
// tools/handschrift_auswerten.mjs). Only when none fits does Gemini read.
const LAGE_GRENZE = 0.35;
function lagePasst(symbole, atome) {
    const mitten = (liste, kasten) => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        liste.forEach(e => { const q = kasten(e); x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x + q.w); y1 = Math.max(y1, q.y + q.h); });
        const w = Math.max(1e-6, x1 - x0), h = Math.max(1e-6, y1 - y0);
        return liste.map(e => { const q = kasten(e); return { x: (q.x + q.w / 2 - x0) / w, y: (q.y + q.h / 2 - y0) / h }; });
    };
    const s = mitten(symbole, e => e.bbox), a = mitten(atome, e => e.box);
    return s.every((p, i) => Math.hypot(p.x - a[i].x, p.y - a[i].y) <= LAGE_GRENZE);
}
// Count and place alone let a flat line fit almost any flat step of the same
// length (measured on the corpus: 68 of 2650 wrong pairs), so the operators must
// agree too, read off the strokes' shape: "=" two flat strokes one above the
// other, "-" one flat stroke, "+" a flat and a steep one crossing, a fraction bar
// as the grouping marks it. Anything unclear counts as "other" - a wrong guess
// only means Gemini reads, never a wrong step.
function glyphKlasse(a) {
    if (a.art === 'line') return 'bar';
    const t = a.art === 'text' ? a.text : '';
    return t === '=' ? '=' : (t === '+' ? '+' : (t === '\u2212' || t === '-' ? '-' : 'o'));
}
function symbolKlasse(sy, striche) {
    if (sy.bruch || sy.linie) return 'bar';
    const k = sy.strokeIdxs.map(i => striche[i]).filter(st => st && st.points && st.points.length)
        .map(st => StrokeSymbols.bboxOfPoints(st.points));
    const flach = b => b.w >= 6 && b.h <= 0.35 * b.w, steil = b => b.h >= 6 && b.w <= 0.35 * b.h;
    if (k.length === 1 && flach(k[0])) return '-';
    if (k.length !== 2) return 'o';
    const [a, b] = k;
    if (flach(a) && flach(b)) {
        const ueber = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const abstand = Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));
        return ueber >= 0.4 * Math.min(a.w, b.w) && abstand > Math.max(a.h, b.h) ? '=' : 'o';
    }
    const [w, v] = flach(a) && steil(b) ? [a, b] : (flach(b) && steil(a) ? [b, a] : [null, null]);
    if (!w) return 'o';
    const vx = v.x + v.w / 2, wy = w.y + w.h / 2;
    return vx > w.x && vx < w.x + w.w && wy > v.y && wy < v.y + v.h ? '+' : 'o';
}
function passtZuSchritt(line, atome, striche) {
    if (atome.length !== line.symbols.length || !lagePasst(line.symbols, atome)) return false;
    return line.symbols.every((sy, i) => symbolKlasse(sy, striche) === glyphKlasse(atome[i]));
}
// In class one tap is one step (the next one of the solution lands, see below): what the
// analysis cut into several rows - a fraction it did not see as one, an exponent or a
// correction too far off - is taken as ONE row, or one tap would use up two steps.
// Crumbs (zuKlein) stay rows of their own and stay on the page, as before - except in
// a flight (alle): every stroke there belongs to the one row that took off.
function alsEineZeile(a, alle = false) {
    const echt = alle ? a.lines : a.lines.filter(l => !zuKlein(l));
    if (echt.length < 2) return;
    const idx = echt[0].lineIdx;
    // the analysis' own reading order: a fraction that fell apart overlaps in x
    const syms = StrokeSymbols.leseReihenfolge(echt.flatMap(l => l.symbols), a.lineHeight,
        Object.assign({}, StrokeSymbols.DEFAULTS, opts));
    syms.forEach((s, i) => { s.lineIdx = idx; s.readIdx = i; });
    const zeile = { lineIdx: idx, symbols: syms, tEnd: Math.max(...echt.map(l => l.tEnd)),
        bbox: syms.reduce((acc, s) => acc ? StrokeSymbols.bboxUnion(acc, s.bbox) : s.bbox, null) };
    a.lines = (alle ? [] : a.lines.filter(l => zuKlein(l))).concat([zeile]).sort((p, q) => p.lineIdx - q.lineIdx);
}
// Doc, 26.09. night, after Gemini had set hats on every T of "c1 m1 T1 - c1 m1 TM = ..."
// and read TM as T_mu: "ich versuche das ordentlich abzuschreiben, dass da keine Fehler
// passieren. Aber schickt das direkt rüber" - in class the next step of the solution
// lands, whatever the ink says; Gemini reads only when no step is left. The fit test
// above (passtZuSchritt: count, place, signs) is parked, not deleted.
async function erwarteterSchritt(line, striche = strokes, ab = null) {
    const loesung = aufgabenModus && LOESUNGEN[AUFGABEN[aufgabeIdx][0]];
    if (!loesung || !line.symbols.length) return null;
    const j = ab !== null ? ab : naechsterIndex(loesung);
    if (j >= loesung.length) return null;
    const latex = loesung[j][0];
    const { atome, svg, satz } = await formelAufZeile(latex, line);
    return { latex, atome, svg, satz, j };
}
// Doc, 27.09.: "Du zeigst immer den nächsten Schritt links, zeig die nächsten 3" -
// then "passt da tatsächlich noch ein vierter und vielleicht sogar ein fünfter
// Schritt hin": up to five, all of one size
// (27.09., then: "Mach mal die Vorschauformeln tatsächlich noch ein bisschen kleiner")
const HINWEIS_SCHRITTE = 5, HINWEIS_GROESSE = 1.2;            // rows, rem per row
const HINWEIS_LINKS = 8;                  // px from the left edge - the task arrows' tips too
const HINWEIS_ABSTAND = 0.6;              // em of the steps between one row's ink and the next
function zeigeHinweis() {
    if (anzeigeModus) return;
    const schritte = vorschau ? naechsteSchritte(HINWEIS_SCHRITTE) : [];   // P off: nothing grey
    let el = document.getElementById('schritt-hinweis'), opEl = document.getElementById('schritt-op');
    if (!schritte.length) { [el, opEl].forEach(e => { if (e) e.style.display = 'none'; }); return; }
    if (!el) {
        el = document.createElement('div');
        el.id = 'schritt-hinweis';
        el.setAttribute('aria-hidden', 'true');
        container.appendChild(el);
    }
    if (!opEl) {
        opEl = document.createElement('div');
        opEl.id = 'schritt-op';
        opEl.setAttribute('aria-hidden', 'true');
        container.appendChild(opEl);
    }
    // Here only the equations to copy: beside the new line "| −b" read as "now
    // take b off this line" (Doc, 26.09.: "das hinter | scheint immer falsch!").
    // The operations go where they stand on the board, see below.
    // Doc, 26.09. evening: "Schreib mir bitte rechts oben in die Ecke, in das Feld
    // rechts, wo Erkennen und C steht, was der Schritt gewesen ist" - the operation
    // that leads to each grey line, in the notes margin at the line's height, grey
    // and under the ink like the line
    const sig = JSON.stringify(schritte);
    if (el.dataset.sig !== sig) {
        el.dataset.sig = sig;
        el.textContent = '';
        opEl.textContent = '';
        schritte.forEach(([latex, op]) => {
            const z = document.createElement('div'), o = document.createElement('div');
            z.className = o.className = 'sh-zeile';
            try { katex.render(alsDisplay(latex), z, { throwOnError: false }); }
            catch (e) { z.textContent = latex; }
            // no bar in front (Doc, 27.09.: "den senkrechten Strich eigentlich rausnehmen.
            // Das ist eher verwirrend"); a leading colon an ordinary sign with a thin space
            if (op) {
                try { katex.render(op.replace(/^:/, '{:}\\,'), o, { throwOnError: false }); }
                catch (e) { o.textContent = op; }
            }
            el.appendChild(z);
            opEl.appendChild(o);
        });
    }
    const r = container.getBoundingClientRect(), nx = notizX(r.width);
    // Doc, 27.09.: "die Formeln doch wieder nach oben an die Kante und noch weiter
    // nach links. Ich brauche Platz" - right under the line, close to the left edge
    const links = HINWEIS_LINKS;
    el.style.top = opEl.style.top = (papierGrenze(r.height) + 4) + 'px';   // top left corner of the squares
    el.style.left = links + 'px';
    el.style.right = (r.width - nx) + 'px';                 // the writing's width, not the margin
    opEl.style.left = (nx + 2 + 12) + 'px';                 // like ERKENNEN: 12 px right of the line
    el.style.display = opEl.style.display = '';
    const zeilen = [...el.children], ops = [...opEl.children];
    zeilen.forEach((z, k) => {
        const o = ops[k];
        z.style.display = o.style.display = '';
        z.style.top = o.style.top = '0px';
        z.style.fontSize = o.style.fontSize = HINWEIS_GROESSE + 'rem';
        passeEin(z, nx - links - 12, HINWEIS_GROESSE);
        passeEin(o, r.width - 16 - (nx + 2 + 12), HINWEIS_GROESSE);   // "ausmultiplizieren" fits the margin
    });
    // Doc, 27.09.: "dass bei der Vorschau der Formeln der Abstand auch gleich ist" - stacked by
    // their ink, not by their KaTeX boxes (a fraction's box is far taller than its ink): a
    // row's ink starts one gap under the ink before it, as legenFrei lays the board (tinte);
    // the operation sits on the middle of its equation's ink. The first row stays at the top.
    const abstand = HINWEIS_ABSTAND * HINWEIS_GROESSE * parseFloat(getComputedStyle(document.documentElement).fontSize);
    let unten = null;
    zeilen.forEach((z, k) => {
        const o = ops[k], zk = z.getBoundingClientRect(), zt = tinte(z) || { o: zk.top, u: zk.bottom };
        const oben = unten === null ? 0 : unten + abstand - (zt.o - zk.top);
        z.style.top = oben + 'px';
        const ok = o.getBoundingClientRect(), ot = tinte(o) || { o: ok.top, u: ok.bottom };
        o.style.top = (oben + (zt.o + zt.u) / 2 - zk.top - ((ot.o + ot.u) / 2 - ok.top)) + 'px';
        unten = oben + zt.u - zk.top;
        z.dataset.unten = unten;                       // its ink's bottom, from the rows' top
    });
    // as many steps as fit above the buttons at the bottom (ERKENNEN, the Cs, the
    // eraser) - from the first that does not, none: a step left out would be a gap.
    // The next step always shows.
    const knoepfe = ['erkennen-klein', 'seite-leeren', 'notiz-leeren', 'radierer']
        .map(id => document.getElementById(id)).filter(k => k && k.style.display !== 'none' && k.offsetParent)
        .map(k => k.getBoundingClientRect().top - 6);
    const grenze = Math.min(r.bottom - 8, ...knoepfe);
    const kopf = el.getBoundingClientRect().top;
    const zuViel = zeilen.findIndex((z, k) => k > 0 && kopf + parseFloat(z.dataset.unten) > grenze);
    if (zuViel > 0) zeilen.slice(zuViel).forEach((z, k) => { z.style.display = ops[zuViel + k].style.display = 'none'; });
}
// the squares stop at the margin (Beispiele has none: squares all across) - set only
// when it changes, the beamer mirrors every change of the paper
function karoBisRand() {
    const p = document.getElementById('papier');
    if (!p) return;
    const b = container.getBoundingClientRect().width;
    const rest = (modus === 'beispiele' ? 0 : Math.round(b - notizX(b))) + 'px';
    if (p.style.getPropertyValue('--notiz-breite') !== rest) p.style.setProperty('--notiz-breite', rest);
}
// the margin's edge, a solid line for Doc only (not mirrored, hidden on the beamer)
function zeigeNotizRand() {
    if (anzeigeModus) return;
    karoBisRand();
    let el = document.getElementById('notiz-rand');
    if (modus === 'beispiele') {
        if (el) el.style.display = 'none';
        ['notiz-leeren', 'seite-leeren', 'radierer'].forEach(id => { const k = document.getElementById(id); if (k) k.style.display = 'none'; });
        setzeRadieren(false);
        return;
    }
    if (!el) {
        el = document.createElement('div');
        el.id = 'notiz-rand';
        el.setAttribute('aria-hidden', 'true');
        container.appendChild(el);
    }
    const r = container.getBoundingClientRect();
    el.style.left = notizX(r.width) + 'px';
    el.style.top = papierGrenze(r.height) + 'px';
    el.style.display = '';
    // Doc, 26.09.: "rechts in dem Feld unten ... einen extra Clear-Button. Nur für
    // dieses Feld" - the C of the rail, for the notes alone, in the margin's corner
    let k = document.getElementById('notiz-leeren');
    if (!k) {
        k = document.createElement('button');
        k.id = 'notiz-leeren';
        k.type = 'button';
        k.title = 'Notizen löschen';
        k.setAttribute('aria-label', 'Notizen löschen');
        k.textContent = 'C';           // Doc: "im gleichen Stil wie Erkennen ... Buchstabengröße und Font"
        k.addEventListener('click', () => notizenLeeren());
        container.appendChild(k);
        k.style.opacity = strokes.some(notizPruefer()) ? '' : '0.35';
    }
    k.style.display = '';
    // Doc, 26.09.: "für das linke Feld, wo ich die Gleichung schreibe, auch einen
    // Clear-Button" (a check written there, then gone again) - bottom left
    let sk = document.getElementById('seite-leeren');
    if (!sk) {
        sk = document.createElement('button');
        sk.id = 'seite-leeren';
        sk.type = 'button';
        sk.title = 'Schreibfeld löschen';
        sk.setAttribute('aria-label', 'Schreibfeld löschen');
        sk.textContent = 'C';
        sk.addEventListener('click', () => seiteLeeren());
        container.appendChild(sk);
        const istNotiz = notizPruefer();
        const istOben = obenPruefer();
        sk.style.opacity = strokes.some(st => !istNotiz(st) && !istOben(st)) ? '' : '0.35';
    }
    sk.style.right = (r.width - notizX(r.width) + 12) + 'px';
    sk.style.display = '';
    // the eraser, bottom centre of the writing field (Doc, 26.09.)
    let rk = document.getElementById('radierer');
    if (!rk) {
        rk = document.createElement('button');
        rk.id = 'radierer';
        rk.type = 'button';
        rk.title = 'Radiergummi';
        rk.setAttribute('aria-label', 'Radiergummi');
        rk.setAttribute('aria-pressed', 'false');
        rk.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor"' +
            ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3 L21 10 L11 20 L4 13 Z"/>' +
            '<path d="M8 9 L15 16"/><path d="M11 20 H20"/></g></svg>';
        rk.addEventListener('click', () => setzeRadieren(!radieren));
        container.appendChild(rk);
    }
    rk.style.left = Math.round(notizX(r.width) / 2) + 'px';
    radiererBlass();
    rk.style.display = '';
}
// the writing field without the notes: what is written there goes (undo brings
// it back), the notes and the working stay; its recognition is void
// Doc, 27.09.: the C of the writing field "soll sich bitte auf das linke untere Feld beziehen, denn der C im
// Rail auf der rechten Seite ist sozusagen für alles" - the notes and the ink on the board above stay
function seiteLeeren() {
    const istNotiz = notizPruefer(), istOben = obenPruefer();
    const bleibt = st => istNotiz(st) || istOben(st);
    if (!strokes.some(st => !bleibt(st)) && !tipp) return;
    merkeVerlauf();
    if (tipp) { clearTimeout(tipp.timer); tipp = null; }
    clearTimeout(autoTimer);
    const bleiben = strokes.filter(bleibt);
    strokes.length = 0;
    bleiben.forEach(st => strokes.push(st));
    erkennenStand++;                   // an answer on its way is void
    verwerfeErkennung();
    recompute();
    merkeStriche();
}
// only the notes go; undo brings them back. The line read before stays read:
// in class only its LaTeX is used later, and the flight reads its own strokes
function notizenLeeren() {
    const istNotiz = notizPruefer();
    if (!strokes.some(istNotiz)) return;
    merkeVerlauf();
    const bleiben = strokes.filter(st => !istNotiz(st));
    strokes.length = 0;
    bleiben.forEach(st => strokes.push(st));
    recompute();
    merkeStriche();
}
// the KaTeX fonts change the widths: fit the operation once more when they are in -
// also the faces KaTeX asks for only later (a root, a smaller size), once
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => zeigeHinweis());
if (document.fonts && document.fonts.load) {
    Promise.all(['KaTeX_Main', 'KaTeX_Math', 'KaTeX_Size1', 'KaTeX_Size2'].map(f => document.fonts.load('1em ' + f)))
        .then(() => zeigeHinweis(), () => {});
}
function zeigeTafelPfeile() {
    erkennenKlein();
    zeigeNotizRand();
    if (!document.getElementById('tafel-pfeil-zurueck')) {
        const PFEIL = 'position:absolute;width:48px;height:48px;padding:0;' +
            'border:none;background:transparent;color:#8a93a3;opacity:0.6;cursor:pointer;touch-action:manipulation;z-index:5;' +
            '-webkit-tap-highlight-color:transparent;outline:none;' +     // no flash when tapped (Doc, 27.09.)
            'display:flex;align-items:center;justify-content:center';
        // Doc, 27.09.: "die Dreiecke links aligned mit der Formel und rechts der gleiche
        // Abstand" - a tip sits 7.5 px inside its 30 px svg (6 of 24): the svg at the
        // button's outer edge, the button so that the tip lands where the grey rows begin
        const spitze = (HINWEIS_LINKS + 1 - 7.5) + 'px';          // + 1: the first glyph's bearing
        [['zurueck', -1, 'left:' + spitze + ';justify-content:flex-start', 'vorige Aufgabe', 'M17 4 L6 12 L17 20 Z'],
         ['vor', 1, 'right:' + spitze + ';justify-content:flex-end', 'nächste Aufgabe', 'M7 4 L18 12 L7 20 Z']].forEach(([id, schritt, seite, text, d]) => {
            const b = document.createElement('button');
            b.id = 'tafel-pfeil-' + id;
            b.style.cssText = PFEIL + ';' + seite;
            b.title = text;
            b.setAttribute('aria-label', text);
            b.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="currentColor"/></svg>`;
            b.addEventListener('click', () => { b.blur(); naechsteVorlage(schritt); });   // no focus ring left behind
            container.appendChild(b);
        });
    }
    // Doc, 26.09.: "bring die vor/zurück Pfeile runter in den Karobereich" - 27.09. first
    // into the squares, then just above the line; then (he hit them there by mistake, two
    // fingers sideways turn the task now): "ganz oben im Board in die linke und rechte
    // Ecke" - centred in the board's first row
    document.querySelectorAll('[id^="tafel-pfeil-"]').forEach(b => {
        b.style.display = modus === 'frei' ? 'none' : 'flex';
        b.style.top = (ZEILE / 2 - 24) + 'px';
    });
    zeigeHinweis();
}
