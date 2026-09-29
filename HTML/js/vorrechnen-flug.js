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
    document.querySelectorAll(`#rechenweg-schicht :is([data-schritt="${f.schritt}"], [data-nummer="${f.schritt}"], [data-mit="${f.schritt}"])`)
        .forEach(z => { z.style.visibility = ''; });
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
    let gleich = c.width / 2, linie = rechenwegLinie;
    if (host.children[0]) gleich = host.children[0].getBoundingClientRect().right - c.left;
    // two columns: the next step goes on under the right one (zeigeRechenweg sets it)
    if (rechenwegZiel) { gleich = rechenwegZiel.gleich; linie = rechenwegZiel.linie; }
    const s = Math.min(1, 1.2 * glyph / Math.max(1, b.h));
    const mitte = (linie + k + 0.5) * ZEILE - 1;
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
    schritteLanden(erster, latexe, farben, von, c);
}
// the steps from erster on are in the working now: laid out hidden, each glides as KaTeX from where it
// stood (von, in the container) onto its row, its twin on the beamer - for a line swiped up
// (rechenwegHoch) and for a grey step sent up with the arrow (vorschauHoch)
// Doc, 27.09.: "unten links in das untere Panel ... ein Button mit einem Pfeil, so dass ich das, was da
// steht, hochpushen kann. Ohne dass ich es jetzt jedes Mal abtippen muss" - the next grey step goes up as
// if written: from its place in the preview onto its row, in ink; undo takes it back. Not while written
// lines are in the air - they keep their order (and one of them may be this very step).
function vorschauHoch() {
    const naechster = vorschau && naechsterSchritt();          // P off: nothing grey, nothing to send
    if (!naechster || fluege.length) return;
    verlaufZurueck();
    merkeVerlauf();
    const c = container.getBoundingClientRect();
    const k = document.querySelector('#schritt-hinweis > .sh-zeile .katex-html');
    const r = k && k.getBoundingClientRect();
    const von = r && r.width ? { x: r.left - c.left, y: r.top - c.top, w: r.width }
        : { x: HINWEIS_LINKS, y: papierGrenze(c.height) + 4, w: 1 };
    const erster = rechenweg.length;
    rechenweg.push({ latex: naechster[0], farbe: INK });
    merkeRechenweg();
    schritteLanden(erster, [naechster[0]], [INK], [von], c);
}
function schritteLanden(erster, latexe, farben, von, c) {
    zeigeRechenweg(erster);
    const host = document.getElementById('rechenweg-schicht');
    latexe.forEach((latex, k) => {
        const zellen = [...host.querySelectorAll(`[data-schritt="${erster + k}"]`)];
        // its number and the operation that made it show with it
        const mit = [...host.querySelectorAll(`[data-nummer="${erster + k}"], [data-mit="${erster + k}"]`)];
        const zeigen = () => [...zellen, ...mit].forEach(z => { z.style.visibility = ''; });
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
    // (\mkern: the tighter dot of the Knobeln block, js/vorrechnen-aufgaben-knobeln.js)
    return String(s).replace(/\\mkern-?[\d.]+mu|\\(?:left|right|displaystyle|cdot|times|[,;:! ])|\s|\{\}/g, '').replace(/\\[dt]frac/g, '\\frac');
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
// the arrow bottom left that sends the grey step up (vorschauHoch) - with the eraser and the Cs (zeigeNotizRand)
function hochKnopf() {
    let k = document.getElementById('schritt-hoch');
    if (!k) {
        k = document.createElement('button');
        k.id = 'schritt-hoch';
        k.type = 'button';
        k.title = 'Nächsten Schritt hochschicken';
        k.setAttribute('aria-label', 'Nächsten Schritt hochschicken');
        k.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor"' +
            ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20 V5"/><path d="M6 11 L12 5 L18 11"/></g></svg>';
        k.addEventListener('click', () => vorschauHoch());
        container.appendChild(k);
    }
    return k;
}
function zeigeHinweis() {
    if (anzeigeModus) return;
    const schritte = vorschau ? naechsteSchritte(HINWEIS_SCHRITTE) : [];   // P off: nothing grey
    let el = document.getElementById('schritt-hinweis'), opEl = document.getElementById('schritt-op');
    // the arrow stays (Doc, 27.09.: "auch wenn nicht mehr hochzuschieben ist ... symmetrischer mit dem
    // Radiergummi und dem C"), pale like the C over an empty field while no grey step shows
    const hk = document.getElementById('schritt-hoch');
    if (!schritte.length) { [el, opEl].forEach(e => { if (e) e.style.display = 'none'; }); if (hk) hk.style.opacity = '0.35'; zeigeErklaerung(); return; }
    hochKnopf().style.opacity = '';
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
    const hutRaum = erklStand().hutSteht ? hutPlatz() - 12 : 0;   // the first row keeps clear of the mortarboard (29.09.)
    zeilen.forEach((z, k) => {
        const o = ops[k];
        z.style.display = o.style.display = '';
        z.style.top = o.style.top = '0px';
        z.style.fontSize = o.style.fontSize = HINWEIS_GROESSE + 'rem';
        passeEin(z, nx - links - 12 - (k ? 0 : hutRaum), HINWEIS_GROESSE);
        passeEin(o, r.width - 16 - (nx + 2 + 12), HINWEIS_GROESSE);   // "ausmultiplizieren" fits the margin
    });
    // Doc, 27.09.: "dass bei der Vorschau der Formeln der Abstand auch gleich ist" - stacked by
    // their ink, not by their KaTeX boxes (a fraction's box is far taller than its ink): a
    // row's ink starts one gap under the ink before it, as legenFrei lays the board (tinte);
    // the operation sits on the middle of its equation's ink. Doc, 29.09.: "zur Linie mehr Platz" - the
    // first row's ink keeps that gap to the line above the squares too (it was 3 px under it): the line's
    // lower edge, 1 px under papierGrenze, stands 3 px above this layer's top.
    const abstand = HINWEIS_ABSTAND * HINWEIS_GROESSE * parseFloat(getComputedStyle(document.documentElement).fontSize);
    let unten = -3;
    zeilen.forEach((z, k) => {
        const o = ops[k], zk = z.getBoundingClientRect(), zt = tinte(z) || { o: zk.top, u: zk.bottom };
        const oben = unten + abstand - (zt.o - zk.top);
        z.style.top = oben + 'px';
        const ok = o.getBoundingClientRect(), ot = tinte(o) || { o: ok.top, u: ok.bottom };
        o.style.top = (oben + (zt.o + zt.u) / 2 - zk.top - ((ot.o + ot.u) / 2 - ok.top)) + 'px';
        unten = oben + zt.u - zk.top;
        z.dataset.unten = unten;                       // its ink's bottom, from the rows' top
    });
    // as many steps as fit above the buttons at the bottom (ERKENNEN, the Cs, the
    // eraser) - from the first that does not, none: a step left out would be a gap.
    // The next step always shows.
    const knoepfe = ['erkennen-klein', 'seite-leeren', 'notiz-leeren', 'radierer', 'schritt-hoch']
        .map(id => document.getElementById(id)).filter(k => k && k.style.display !== 'none' && k.offsetParent)
        .map(k => k.getBoundingClientRect().top - 6);
    const grenze = Math.min(r.bottom - 8, ...knoepfe);
    const kopf = el.getBoundingClientRect().top;
    const zuViel = zeilen.findIndex((z, k) => k > 0 && kopf + parseFloat(z.dataset.unten) > grenze);
    if (zuViel > 0) zeilen.slice(zuViel).forEach((z, k) => { z.style.display = ops[zuViel + k].style.display = 'none'; });
    zeigeErklaerung();
}
// Doc, 28.09.: "Blende mir hier im Preview einen ausführlichen Erklärungstext ein ... oben rechts x zum wegklicken
// (pro Aufgabe)" - the task's explanation (ERKLAERUNGEN, js/vorrechnen-aufgaben.js) in the writing field, where
// he drew it: right of the grey steps, under the ink like them (he writes straight over it), for Doc only. Part
// of the preview: P off, it goes; the × puts it away for this task; P on again brings every one back.
const ERKL_WEG = 'vorrechnen-erklaerung-weg';
let erklWeg = new Set(), erklVorschau = vorschau;
try { erklWeg = new Set(JSON.parse(localStorage.getItem(ERKL_WEG) || '[]')); } catch (_) {}
function merkeErklWeg() { try { localStorage.setItem(ERKL_WEG, JSON.stringify([...erklWeg])); } catch (_) {} }
// Doc, 29.09.: "mach da ein icon mit einem brain, das die Box einblendet", then "im Stil so wie unten und das
// Brain doch Dr. Hut und finer" - outside the puzzles the box no longer comes by itself (in a lesson it would cover
// the grey steps): a mortarboard top right in the writing field, over the field's bin and like it, brings it, its
// × puts it away again - for this visit only (erklDa). The puzzles (their block says erklaerung: 'sofort',
// js/vorrechnen-aufgaben-knobeln.js) show theirs until the ×; the mortarboard brings it back.
const erklDa = new Set();
// Doc, 29.09.: "oben an die Box ... sechs kleine Punkte ... wo ich anfassen kann und die Box nach oben schieben kann.
// Und wenn ich sie nach oben schiebe, wird sie visible für alle" - px the box is pushed up from its place under the
// line; once its top is above the line it goes into a mirrored layer (erklaerungSchicht), so the beamer shows it
let erklHoch = 0;
function erklaerungSchicht() {
    let s = document.getElementById('erklaerung-schicht');
    if (!s) {
        s = document.createElement('div');
        s.id = 'erklaerung-schicht';
        s.style.cssText = 'position:absolute;left:0;top:0;right:0;height:0;pointer-events:none';
        container.appendChild(s);
    }
    return s;
}
const erklSofort = () => aufgabenBlock(aufgabeIdx).erklaerung === 'sofort';
// the task's explanation, whether its box shows now, and whether the mortarboard is wanted instead
function erklStand() {
    if (vorschau && !erklVorschau) {                                   // P on again: all as they start
        erklDa.clear();
        if (erklWeg.size) { erklWeg.clear(); merkeErklWeg(); }
    }
    erklVorschau = vorschau;
    const slug = aufgabenModus ? AUFGABEN[aufgabeIdx][0] : null, text = slug && ERKLAERUNGEN[slug];
    const zeigt = !!text && vorschau && (erklSofort() ? !erklWeg.has(slug) : erklDa.has(slug));
    // the mortarboard stands wherever the field's bin does (not in Beispiele) while the box is shut - pale like
    // the empty bin when there is nothing to show (Doc, 29.09.: "zeigt den Dr. Hut auch, wenn nichts da ist, aber
    // eben so grayed out wie der Papierkorb unten")
    return { slug, text, zeigt, hut: !!text && vorschau && !zeigt, hutSteht: !zeigt && modus !== 'beispiele' };
}
// the room the mortarboard's button takes left of the margin's line: 12 px to the line, its width (46 px at
// --knopf, js/vorrechnen.css) and 8 px of air - the first grey row keeps clear of it
function hutPlatz() {
    return 12 + 46 * (parseFloat(container.style.getPropertyValue('--knopf')) || 1) + 8;
}
// Lucide "graduation-cap" (ISC, lucide-static 1.48.0), finer than the board's other icons (1.8); the part on the
// head 1.5 longer than Lucide's (Doc, 29.09.: "der Zylinder, der dann auf dem Kopf sitzt ... länger")
const DOKTORHUT = '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>' +
    '<path d="M22 10v6"/><path d="M6 12.5V17.5a6 3 0 0 0 12 0V12.5"/></g>';
function hutKnopf(zeigen, aktiv) {
    let k = document.getElementById('erklaerung-hut');
    if (!zeigen) { if (k) k.style.display = 'none'; return; }
    if (!k) {
        k = document.createElement('button');
        k.id = 'erklaerung-hut';
        k.type = 'button';
        k.title = 'Erklärung einblenden';
        k.setAttribute('aria-label', 'Erklärung einblenden');
        k.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${DOKTORHUT}</svg>`;
        k.addEventListener('click', () => {
            k.blur();
            const { slug, hut } = erklStand();
            if (!slug || !hut) return;                // pale: nothing to show
            if (erklSofort()) { erklWeg.delete(slug); merkeErklWeg(); } else erklDa.add(slug);
            zeigeHinweis();                    // the grey steps and the box, laid out anew
        });
        container.appendChild(k);
    }
    // right over the field's bin (#seite-leeren, zeigeNotizRand): 12 px left of the margin's line
    const r = container.getBoundingClientRect();
    Object.assign(k.style, { right: (r.width - notizX(r.width) + 12) + 'px', top: (papierGrenze(r.height) + 6) + 'px', display: '' });
    k.style.opacity = aktiv ? '' : '0.35';                // as pale as the empty bin (zeigeNotizRand)
    k.title = aktiv ? 'Erklärung einblenden' : 'Keine Erklärung zu dieser Aufgabe';
}
// every letter of a formula upright, as \mathrm (Doc, 28.09.: the letters blue - js/vorrechnen.css - "bitte nicht
// kursiv"); commands (\cdot, \ge, \mathrm) and words in \text{...} stay as they are
const aufrecht = tex => tex.replace(/\\text\{[^}]*\}|\\[a-zA-Z]+|[A-Za-z]/g, m => m.length > 1 ? m : '\\mathrm{' + m + '}');
// Paragraphs by a blank line. $$equation | operation$$ is an equation set off, as in a LaTeX text, with what was
// done to get it behind it as on the board's working, "| −A" (Doc, 28.09.: "dass diese Gleichungen so in der Zeile
// im Text stehen ... ordentliche Gleichungen ... und natürlich LaTeX", "hinter die Gleichung immer die Operation");
// $...$ stays in the sentence - a value, a letter, a term.
// Every "=" of the box stands on its middle line, text between or not ("die Gleichheitszeichen immer in die Mitte
// der Box ... auch über Text ... alle aligned"): a row of two halves, the left side flush right before the middle,
// "=" centred on it and the right side after it (js/vorrechnen.css, .erkl-gl); the operations in one column behind
// the widest right side (erklSpalte, once the box is laid out).
function erklGleichung(s) {
    const [gl, op] = s.slice(2, -2).split(' | '), i = gl.indexOf('=');
    const zeile = document.createElement('div');
    zeile.className = 'erkl-gl';
    const links = document.createElement('span'), rechts = document.createElement('span');
    links.className = 'erkl-l';
    rechts.className = 'erkl-r';
    const seite = document.createElement('span'), setze = (el, tex) => {
        try { katex.render('\\displaystyle ' + tex, el, { throwOnError: false }); } catch (_) { el.textContent = tex; }
    };
    seite.className = 'erkl-seite';
    setze(links, aufrecht(i < 0 ? gl : gl.slice(0, i)));
    setze(seite, i < 0 ? '' : '{}' + aufrecht(gl.slice(i)));    // {}: a space after the "=" as well as before
    rechts.appendChild(seite);
    if (op) {
        const o = document.createElement('span');
        o.className = 'erkl-op';
        setze(o, '\\vert\\;\\; ' + aufrecht(op.replace(/^:/, '{:}\\,')));
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
                formel.className = 'erkl-inline';            // never broken inside (js/vorrechnen.css)
                try { katex.render(aufrecht(t.slice(1, -1)), formel, { throwOnError: false }); } catch (_) { formel.textContent = t; }
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
// The box scrolls when its text does not fit (Doc: "auch wenn ... wir am Ende scrollen müssen"): the canvas lies
// over it and takes the pen, so the wheel over it moves it, and a slim bar under the × shows where one is and
// takes a tap or a drag (the arrows ▲ ▼ that were there first: "passen nicht ... mach sie weg").
function erklPfeile() {
    const el = document.getElementById('erklaerung');
    if (!el) return;
    const zuViel = el.style.display !== 'none' && el.scrollHeight > el.clientHeight + 1;
    // the slim bar under the ×: its thumb is the part in view, as large and where it is (Doc, 28.09.: "zeige
    // rechts bitte eine kleine Scrollbar ... sieht man jetzt nicht, in welchem Ausschnitt man ist")
    const leiste = document.getElementById('erklaerung-leiste');
    if (!leiste) return;
    leiste.style.display = zuViel ? '' : 'none';
    if (!zuViel) return;
    const h = leiste.clientHeight, daumen = Math.max(24, h * el.clientHeight / el.scrollHeight);
    leiste.firstChild.style.height = daumen + 'px';
    leiste.firstChild.style.top = el.scrollTop / (el.scrollHeight - el.clientHeight) * (h - daumen) + 'px';
}
function zeigeErklaerung() {
    if (anzeigeModus) return;
    let el = document.getElementById('erklaerung'), zu = document.getElementById('erklaerung-zu');
    const { slug, text, zeigt, hut, hutSteht } = erklStand();
    hutKnopf(hutSteht, hut);
    // with an explanation the grey steps on the left go (Doc, 28.09.: "lass bei den Aufgaben das links weg und
    // mach die box groß") - hidden, not removed: the operations in the margin keep their rows' places
    const grau = document.getElementById('schritt-hinweis');
    if (grau) grau.style.visibility = zeigt ? 'hidden' : '';
    // and the notes margin out of sight, the box runs over it (Doc, 28.09.: "in diesen Rätselaufgaben rechts diese
    // Box wegmachen und unsere Erklärbox über die ganze Breite ziehen" - the light way): its line, the grey
    // operations and its bin. Hidden, not gone: ink written there still counts as a note, never read
    ['notiz-rand', 'schritt-op', 'notiz-leeren'].forEach(id => {
        const e = document.getElementById(id);
        if (e) e.style.visibility = zeigt ? 'hidden' : '';
    });
    if (!zeigt) {
        [el, zu, document.getElementById('erklaerung-leiste'), document.getElementById('erklaerung-griff')]
            .forEach(e => { if (e) e.style.display = 'none'; });
        erklHoch = 0;                          // it opens again in its place, for Doc only
        return;
    }
    if (!el) {
        el = document.createElement('div');
        el.id = 'erklaerung';
        el.setAttribute('aria-hidden', 'true');
        container.appendChild(el);
        zu = document.createElement('button');
        zu.id = 'erklaerung-zu';
        zu.type = 'button';
        zu.title = 'Erklärung ausblenden – der Doktorhut holt sie zurück';
        zu.setAttribute('aria-label', 'Erklärung ausblenden');
        zu.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
            '<path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
        zu.addEventListener('click', () => {
            zu.blur();
            const s = el.dataset.slug;
            if (s && erklSofort()) { erklWeg.add(s); merkeErklWeg(); } else if (s) erklDa.delete(s);
            erklHoch = 0;
            zeigeHinweis();                    // the grey steps back, the first one clear of the mortarboard
        });
        container.appendChild(zu);
        const leiste = document.createElement('div');
        leiste.id = 'erklaerung-leiste';
        leiste.innerHTML = '<i></i>';
        const ziehe = e => {
            const k = leiste.getBoundingClientRect(), f = Math.min(1, Math.max(0, (e.clientY - k.top) / k.height));
            el.scrollTop = f * (el.scrollHeight - el.clientHeight);
        };
        leiste.addEventListener('pointerdown', e => { leiste.setPointerCapture(e.pointerId); ziehe(e); e.preventDefault(); });
        leiste.addEventListener('pointermove', e => { if (leiste.hasPointerCapture(e.pointerId)) ziehe(e); });
        container.appendChild(leiste);
        el.addEventListener('scroll', erklPfeile);
        // the beamer's copy shows the part Doc has scrolled to (anzeigeEmpfang reads data-scroll)
        el.addEventListener('scroll', () => { el.dataset.scroll = Math.round(el.scrollTop); });
        // ten dots inside the box at its top, for Doc only: dragged up, the box's top goes up with them
        const griff = document.createElement('div');
        griff.id = 'erklaerung-griff';
        griff.title = 'Nach oben ziehen – über der Linie sehen es alle';
        griff.innerHTML = '<i></i>'.repeat(10);
        let zug = null;
        griff.addEventListener('pointerdown', e => {
            griff.setPointerCapture(e.pointerId);
            zug = { y: e.clientY, hoch: erklHoch };
            e.preventDefault();
        });
        griff.addEventListener('pointermove', e => {
            if (!zug || !griff.hasPointerCapture(e.pointerId)) return;
            erklHoch = Math.max(0, zug.hoch + zug.y - e.clientY);
            zeigeErklaerung();
        });
        const los = () => { zug = null; };
        griff.addEventListener('pointerup', los);
        griff.addEventListener('pointercancel', los);
        container.appendChild(griff);
        container.addEventListener('wheel', e => {
            const k = el.getBoundingClientRect();
            if (el.style.display === 'none' || el.scrollHeight <= el.clientHeight + 1 ||
                e.clientX < k.left || e.clientX > k.right || e.clientY < k.top || e.clientY > k.bottom) return;
            el.scrollTop += e.deltaY;
            e.preventDefault();
        }, { passive: false });
    }
    if (el.dataset.slug !== slug) { el.dataset.slug = slug; el.dataset.fit = ''; erklHoch = 0; erklaerungSetzen(el, text); }
    // the whole width, over the notes margin too ("über die ganze Breite"), 12 px in from either side like the
    // buttons under it ("Box an den buttons alignen"), from just under the line down to
    // above them; one font for every box, the size of the first puzzle ("die Schriftgröße überall so wie bei
    // Aufgabe 1") - a longer text scrolls
    const ERKL_SCHRIFT = 1.45;                 // was 1.6: "ein bisschen kleiner, überall"
    const r = container.getBoundingClientRect(), oben = papierGrenze(r.height) + 16;
    const links = 12, breite = Math.max(240, r.width - 12 - links), hoehe = Math.max(80, r.height - 52 - oben);
    // pushed up by its dots (erklHoch), never above the board's first line - under the head row with the counter,
    // "umstellen nach" and the arrows (Doc, 29.09.: "bitte nicht höher ziehbar als da"); the bottom stays where it is,
    // the box grows (Doc, 29.09.: "die untere Linie ruhig da unten bleiben ... die ganze Box soll größer werden").
    // Above the line it is the class's too: into the mirrored layer, on the board's ground and over the working
    // (.oben, js/vorrechnen.css)
    erklHoch = Math.min(erklHoch, oben - ZEILE);
    const hoch = hoehe + erklHoch;
    const top = oben - erklHoch, fuerAlle = top < papierGrenze(r.height);
    el.classList.toggle('oben', fuerAlle);
    const heim = fuerAlle ? erklaerungSchicht() : container;
    // a change of layer sends at once: the mirrored layer is watched only from its first sending on
    if (el.parentNode !== heim) { heim.appendChild(el); anzeigeBald(); }
    Object.assign(el.style, { left: links + 'px', top: top + 'px', width: breite + 'px', height: hoch + 'px', display: '' });
    Object.assign(zu.style, { left: (links + breite - 36) + 'px', top: (top + 4) + 'px', display: '' });
    Object.assign(document.getElementById('erklaerung-leiste').style,
        { left: (links + breite - 28) + 'px', top: (top + 40) + 'px', height: Math.max(24, hoch - 56) + 'px' });
    Object.assign(document.getElementById('erklaerung-griff').style,
        { left: (links + breite / 2 - 22) + 'px', top: (top - 1) + 'px', display: '' });   // "ein kleines Stück hoch"
    // again only when the size or the fonts change
    const sig = [slug, breite, hoehe, document.fonts ? document.fonts.status : ''].join('|');
    if (el.dataset.fit !== sig) {
        el.dataset.fit = sig;
        el.style.fontSize = ERKL_SCHRIFT + 'rem';
        erklSpalte(el);
        el.scrollTop = 0;
    }
    erklPfeile();
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
// the bin of every clear button - the rail's (js/vorrechnen-werkzeuge.js) and the three on the board
// (Doc, 28.09.: "mach die C bitte auch Papierk."); Lucide "trash-2" (ISC)
const PAPIERKORB = '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>' +
    '<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6M14 11v6"/></g>';
const PAPIERKORB_KNOPF = `<svg viewBox="0 0 24 24" stroke-width="1.8" aria-hidden="true" focusable="false">${PAPIERKORB}</svg>`;
// the margin's edge, a solid line for Doc only (not mirrored, hidden on the beamer)
function zeigeNotizRand() {
    if (anzeigeModus) return;
    karoBisRand();
    let el = document.getElementById('notiz-rand');
    if (modus === 'beispiele') {
        if (el) el.style.display = 'none';
        ['notiz-leeren', 'seite-leeren', 'oben-leeren', 'radierer', 'schritt-hoch', 'erklaerung-hut'].forEach(id => { const k = document.getElementById(id); if (k) k.style.display = 'none'; });
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
        k.innerHTML = PAPIERKORB_KNOPF;   // was a C "im gleichen Stil wie Erkennen" (Doc, 26.09.)
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
        sk.innerHTML = PAPIERKORB_KNOPF;
        sk.addEventListener('click', () => seiteLeeren());
        container.appendChild(sk);
        const istNotiz = notizPruefer();
        const istOben = obenPruefer();
        sk.style.opacity = strokes.some(st => !istNotiz(st) && !istOben(st)) ? '' : '0.35';
    }
    sk.style.right = (r.width - notizX(r.width) + 12) + 'px';
    sk.style.display = '';
    // Doc, 28.09.: "in die rechte untere Ecke vom oberen Display ein C button der nur das cleared" - the board
    // above the line: bottom right, over the notes' C; in class only (frei has no board up there)
    let ok = document.getElementById('oben-leeren');
    if (!ok) {
        ok = document.createElement('button');
        ok.id = 'oben-leeren';
        ok.type = 'button';
        ok.title = 'Anmerkungen oben löschen – die Rechnung bleibt';
        ok.setAttribute('aria-label', 'Anmerkungen oben löschen – die Rechnung bleibt');
        ok.innerHTML = PAPIERKORB_KNOPF;
        ok.addEventListener('click', () => { ok.blur(); obenLeeren(); });
        container.appendChild(ok);
    }
    ok.style.bottom = (r.height - papierGrenze(r.height) + 6) + 'px';
    ok.style.display = aufgabenModus ? '' : 'none';
    obenBlass();
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
    // the arrow bottom left, pale until a grey step shows (zeigeHinweis)
    const hk = hochKnopf();
    if (!vorschau || !naechsterSchritt()) hk.style.opacity = '0.35';
    hk.style.display = '';
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
// only the ink written on the board above the line goes (Doc, 28.09.: "nicht die Formeln clearen ... nur die
// Annotations"); the working, the lines still in the air, the task, the writing field and the notes stay.
// Undo brings it back.
function obenLeeren() {
    const istOben = obenPruefer();
    if (!strokes.some(istOben)) return;
    merkeVerlauf();
    const bleiben = strokes.filter(st => !istOben(st));
    strokes.length = 0;
    bleiben.forEach(st => strokes.push(st));
    recompute();
    merkeStriche();
}
// no ink up there: dimmed, like the other Cs
function obenBlass() {
    const k = document.getElementById('oben-leeren');
    if (k) k.style.opacity = strokes.some(obenPruefer()) ? '' : '0.35';
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
