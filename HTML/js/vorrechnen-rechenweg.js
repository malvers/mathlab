// Vorrechnen (vorrechnen.html), part 4 of 12: the template on top and the working that climbs up under the task.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Vorlage: the formula to copy, shown above the writing area ──────
function zeigeVorlage(hinweis) {
    if (anzeigeModus) return;
    let host = document.getElementById('vorlage-schicht');
    if (!host) {
        host = document.createElement('div');
        host.id = 'vorlage-schicht';
        // Doc: the template centred in x and y in the head strip; the
        // counter stays at the left edge
        // at least 84 px; a display-style sum with its limits needs more
        host.style.cssText = 'position:absolute;left:0;right:0;top:0;min-height:84px;padding:6px 0;box-sizing:border-box;' +
            'pointer-events:none;display:flex;align-items:center;justify-content:center;color:#00d2ff';
        container.appendChild(host);
    }
    zeigeTafelPfeile();
    // Doc, 26.09.: "Erkennen nur im Frei mod" - in class Auto and the swipe
    // recognise, the examples bring their LaTeX. buttons-ultra.css pins
    // .cyber-btn to display:flex !important, so hiding needs !important too.
    const ek = document.getElementById('knopf-erkennen');
    if (ek) {
        if (modus === 'frei') ek.style.removeProperty('display');
        else ek.style.setProperty('display', 'none', 'important');
        // with LEEREN gone ERKENNEN is the card's only button - no empty box
        const karte = ek.closest('.instrument-card');
        if (karte) karte.style.display = modus === 'frei' ? '' : 'none';
    }
    // frei: nothing up there, the board is Doc's
    if (modus === 'frei') {
        host.style.display = 'none';
        host.innerHTML = '';
        zeigeRechenweg();
        return;
    }
    // beispiele: the template to copy; aufgaben: the task (AUFGABEN)
    // with what to solve for at the right edge
    const liste = testModus ? VORLAGEN : AUFGABEN, nr = testModus ? vorlageIdx : aufgabeIdx;
    const [slug, latex, nach] = liste[nr];
    // Doc, 26.09.: "7 von 20 ... und nach x - bring das links und rechts an die
    // Formel ran, mach's größer, in der Y-Mitte der Zeile; rechts 'umstellen
    // nach x'" - in class larger, placed beside the task by zeigeRechenweg
    const RAND = 'position:absolute;top:50%;transform:translateY(-50%);white-space:nowrap;' +
        `font-family:Orbitron,sans-serif;font-size:${aufgabenModus ? '1rem' : '0.8rem'};letter-spacing:0.1em;color:#8a93a3`;   // 27.09. evening on the arrows' line: "umstellen nach, Level und so. Ein bisschen kleiner" (was 1.2rem)
    // Doc: "Font-Size überall gleich", "Gleichheitszeichen untereinander" -
    // in class the task is the first row of the working (zeigeRechenweg),
    // up here only the counter and what to solve for, on the task's height
    host.innerHTML = `<span style="${RAND};left:24px">` +
        `${aufgabenModus ? `Aufgabe ${nr - aufgabenBlock(nr).ab + 1} / ${aufgabenBlock(nr).bis - aufgabenBlock(nr).ab}` : `${nr + 1} / ${liste.length}`}${hinweis ? ' · ' + hinweis : ''}</span>` +      // Doc: "schreib links vor 4 von 20 Aufgabe"
        // Doc, 27.09. evening: "Was könnte man rechts an den Pfeil noch ranschreiben? ... symmetrisch" - the
        // block the counter counts in ("Level 3 · echte Nüsse"), right before ▶ (placed by zeigeRechenweg)
        (aufgabenModus ? `<span id="vorlage-block" style="${RAND};right:24px">${aufgabenBlock(nr).titel}</span>` : '') +
        (testModus ? `<span id="vorlage-formel" style="font-size:2.4rem;color:${anzeige(INK)}"></span>` : '') +
        (nach ? `<span id="vorlage-nach" style="${RAND};right:24px">umstellen nach <span style="font-size:1.4em"></span></span>`
            // Doc, 28.09.: a term to simplify (Wurzeln · Stolperfallen, no variable) - "vereinfachen" in its place,
            // or what its block says (Knobeln: "Ziffern finden")
            : aufgabenModus && nach === '' ? `<span id="vorlage-nach" style="${RAND};right:24px">${aufgabenBlock(nr).kopf || 'vereinfachen'}</span>` : '');
    if (nach) {
        const v = host.querySelector('#vorlage-nach span');
        try { katex.render(nach, v, { throwOnError: false }); } catch (e) { v.textContent = nach; }
        v.style.color = variablenFarbe();          // the same colour as in the task (Doc, 27.09.)
    }
    host.style.display = 'flex';
    if (aufgabenModus) {
        host.style.minHeight = '0';
        host.style.padding = '0';
        zeigeRechenweg();
        return;
    }
    host.style.minHeight = '84px';
    host.style.padding = '6px 0';
    host.style.top = '0';
    host.style.height = '';
    try { katex.render(alsDisplay(latex), document.getElementById('vorlage-formel'), { throwOnError: false }); }
    catch (e) { document.getElementById('vorlage-formel').textContent = latex; }
    // a long one (Navier-Stokes) shrinks until it clears the counter
    const h = host.getBoundingClientRect();
    const zaehler = host.querySelector('span'), nachEl = document.getElementById('vorlage-nach');
    const rand = Math.max(zaehler ? zaehler.getBoundingClientRect().right - h.left + 32 : 170,
        nachEl ? h.right - nachEl.getBoundingClientRect().left + 32 : 0);
    passeEin(document.getElementById('vorlage-formel'), host.clientWidth - 2 * rand);
    zeigeRechenweg();
}

// ── Working: the finished lines climb up under the task ─────────────
// Doc, 25.09.: "wenn ich zum Beispiel mit vier Fingern nach oben schiebe,
// dass diese Formel ... kleiner wird und als nächste Zeile für die Lösung
// dieser Umformung oben steht". Each recognised line on the page becomes
// one step: its typeset formula shrinks and flies up, its ink is gone,
// the page is free for the next step. The steps line up at their first
// equals sign, the way one writes a working on the board.
function merkeRechenweg() {
    try { localStorage.setItem('vorrechnen-rechenweg', JSON.stringify(rechenweg)); } catch (_) {}
    zeigeHinweis();                    // a step more or less: the next one changes
}
// "3x+5=20" -> ["3x+5", "{}=20"]; the empty group keeps the space
// before the "=". Only an "=" outside braces splits.
function amGleich(latex) {
    let tiefe = 0;
    for (let i = 0; i < latex.length; i++) {
        const c = latex[i];
        if (c === '\\') { i++; continue; }
        if (c === '{') tiefe++;
        else if (c === '}') tiefe--;
        else if (c === '=' && tiefe === 0) return [latex.slice(0, i), '{}' + latex.slice(i)];
    }
    return [latex, ''];
}
// Doc, 26.09.: "die Zeilengröße müssen wir an den Bildschirm anpassen" - a
// fixed number of ruled lines above the squares; the line height follows
// the board's height (even, so the squares stay whole pixels). The paper
// takes it as --zeile.
const LINIEN = 11;                 // ruled lines above the squares
let ZEILE = 64;                    // px between the ruled lines (zeileMessen)
function zeileMessen() {
    const h = container.getBoundingClientRect().height;
    if (h > 0) ZEILE = Math.max(32, 2 * Math.floor(h * 2 / 3 / LINIEN / 2));
}
// Doc, 26.09.: first "Großbuchstaben mittig 80%", then "die 80% in der
// Zeile sind offensichtlich zu groß ... Klammern ragen über die untere
// Zeile" - a parenthesis (1 em in KaTeX, 0.75 above the baseline and 0.25
// below) fills 85 % of a line, and the math axis - the middle of a
// parenthesis, the bar of a fraction, the "=" - lies on the middle of the
// line. Capitals come to about 60 %.
const KLAMMER = 0.85;              // a parenthesis' share of a line
const ACHSE_EM = 0.25;             // the math axis above the baseline, in em
// px of KaTeX's em at full size; one size for the task and every step,
// the flying line included
const rechenEm = () => KLAMMER * ZEILE;
// the font size around the formula (.katex sets itself 1.21 times that)
const rechenSchrift = () => (rechenEm() / 1.21).toFixed(2) + 'px';
// the steps' numbers (1), (2), ...: this share of their row's size, after this much air (em of the row) -
// on the board (zeigeRechenweg) and in the tasks done before (nummernNachtragen)
const NUMMER_GROESSE = 0.7, NUMMER_LUFT = 1.5;
// what was done to a row ("| -3x", umformungen): this share of the row's size, after this much air
const UMFORMUNG_GROESSE = 0.8, UMFORMUNG_LUFT = 1.0;
// px from the baseline of a row at size s down to its ruled line
const linieAb = s => ZEILE / 2 - ACHSE_EM * rechenEm() * s;
// verborgenAb: steps from this index on are laid out but not yet shown -
// they are where the flying lines land
// Doc, 26.09.: "die Aufgabe direkt auf der Zeile" - every row sits in a
// line of its own, and takes the lines above and below that its
// fractions reach into. The "=" stay in one column (left cell ends
// there, right starts).
// Doc, 26.09.: "Wenn da steht x ist gleich irgendwas, dann ist das
// offensichtlich das Ergebnis. Und das kann man sofort automatisch doppelt
// unterstreichen" - the last step that reads VAR = something without VAR,
// VAR being what the task asks for; never the task itself, not in Frei (no
// task, no VAR). -1 when there is none.
function ergebnisSchritt() {
    if (!aufgabenModus) return -1;
    const v = AUFGABEN[aufgabeIdx][2];
    // a term to simplify (no variable, Doc 28.09.): its result is the last step of its solution
    if (v === '') {
        const l = LOESUNGEN[AUFGABEN[aufgabeIdx][0]], ende = l && l.length ? schrittNorm(l[l.length - 1][0]) : null;
        for (let i = rechenweg.length - 1; i >= 0; i--) if (ende && schrittNorm(rechenweg[i].latex) === ende) return i;
        return -1;
    }
    for (let i = rechenweg.length - 1; i >= 0; i--) {
        const [l, r] = amGleich(rechenweg[i].latex.replace(UNGEFAEHR, '='));
        const links = l.replace(/\\displaystyle|[\s{}]/g, '');
        // every letter left once the commands (\frac, \cdot) are gone is a variable
        const rechts = r.replace(/^\{\}=/, '').replace(/\\[a-zA-Z]+/g, ' ');
        if (links === v && rechts.replace(/[\s{}]/g, '') && !rechts.includes(v)) return i;
    }
    return -1;
}
// Doc, 27.09. evening: "die ausgeführten Schritte mit dem vertikalen Strich dahinter ... pro Schritt was
// gemacht wurde" - what was done to a row to get the next one, "| -3x" as on paper, beside the row it was
// done to, once the next one stands: from the task's solution (LOESUNGEN) and only where both rows are its
// steps - a step skipped joins its operations, a row of another way has none. Keyed like the rows:
// 'aufgabe', 0, 1, ...
function umformungen() {
    const ops = new Map();
    const loesung = aufgabenModus && LOESUNGEN[AUFGABEN[aufgabeIdx][0]];
    if (!loesung) return ops;
    const norm = loesung.map(([st]) => schrittNorm(st));
    let vorher = -1;                               // the task stands before step 0
    rechenweg.forEach((e, i) => {
        const j = norm.indexOf(schrittNorm(e.latex));
        if (j >= 0 && vorher !== null && j > vorher) {
            // ":5", not ": 5" - KaTeX sets a bare colon as a relation (as in decks/tafel.html)
            const op = loesung.slice(vorher + 1, j + 1).map(st => st[1]).filter(Boolean)
                .map(o => o.replace(/^\s*:/, '{:}')).join(',\\;');
            if (op) ops.set(i === 0 ? 'aufgabe' : i - 1, op);
        }
        vorher = j >= 0 ? j : null;                // a row off the solution: the next one has no "before"
    });
    return ops;
}
let rechenwegWartet = false;
let rechenwegLinie = 0;            // the last line the working takes (schaetzeZiel)
let rechenwegZiel = null;          // in two columns: { gleich, linie } where the next step goes (schaetzeZiel)
let rechenwegMass = null;          // what the last layout measured and decided - for a look from outside (DevTools)
function zeigeRechenweg(verborgenAb) {
    if (anzeigeModus) return;
    if (typeof obenBlass === 'function') obenBlass();   // the board's C: dimmed without ink up there (js/vorrechnen-flug.js)
    let host = document.getElementById('rechenweg-schicht');
    if (!host) {
        host = document.createElement('div');
        host.id = 'rechenweg-schicht';
        host.style.cssText = 'position:absolute;left:0;top:0;right:0;height:0;pointer-events:none';
        container.appendChild(host);
    }
    zeileMessen();
    host.style.fontSize = rechenSchrift();
    const kopf = document.getElementById('vorlage-schicht');
    if (!kopf) return;                 // at start: zeigeVorlage() builds it and calls back
    host.style.color = anzeige(INK);
    host.innerHTML = '';
    const zeilen = [];
    const zelle = (teil, schritt, verborgen, farbe) => {
        const d = document.createElement('div');
        d.dataset.schritt = schritt;
        d.style.cssText = 'position:absolute;left:0;top:0;white-space:nowrap;line-height:normal';
        if (farbe && farbe !== INK) d.style.color = farbe;
        if (verborgen) d.style.visibility = 'hidden';
        try { katex.render(alsDisplay(teil), d, { throwOnError: false }); } catch (_) { d.textContent = teil; }
        const sonde = document.createElement('span');          // a probe on the baseline
        sonde.style.cssText = 'display:inline-block;width:0;height:0';
        d.appendChild(sonde);
        host.appendChild(d);
        return d;
    };
    const ergebnis = ergebnisSchritt();
    const zeile = (latex, schritt, verborgen, farbe) => {
        const [l, r] = amGleich(latex);
        zeilen.push({ links: zelle(l, schritt, verborgen, farbe), rechts: zelle(r, schritt, verborgen, farbe),
            schritt, verborgen, farbe, ergebnis: schritt === ergebnis });
    };
    // the task with what is solved for in colour, as in the task panel (Doc, 27.09.)
    if (aufgabenModus) zeile(hebeVariable(AUFGABEN[aufgabeIdx][1], AUFGABEN[aufgabeIdx][2], variablenFarbe()), 'aufgabe', false);
    // Doc, 27.09.: "in der Aufgabe ist ja T2 rot. Mach das bitte auch in den anderen rot und
    // alles, was hochfliegt, ist blau" - every row in ink (also one stored in green before)
    const farbig = latex => aufgabenModus ? hebeVariable(latex, AUFGABEN[aufgabeIdx][2], variablenFarbe()) : latex;
    rechenweg.forEach((e, i) => zeile(farbig(e.latex.replace(UNGEFAEHR, '=')), i, (verborgenAb !== undefined && i >= verborgenAb) || imFlug.has(i), null));
    // Doc, 27.09.: "im vernünftigen Abstand und zwar aligned untereinander ... welcher Schritt das ist, wie
    // das so in wissenschaftlichen Publikationen üblich ist ... dahinter in Klammern" - every step gets its
    // number, (1), (2), ..., grey and smaller, flush right in a column of its own beside its column of
    // equations, on the row's baseline; the task is no step and has none. data-nummer, not data-schritt:
    // the flight measures a step by its cells and must not count the number (it shows with the row on
    // landing - flugLandet, schritteLanden)
    zeilen.forEach(z => {
        if (typeof z.schritt !== 'number') return;
        const d = zelle('(' + (z.schritt + 1) + ')', z.schritt, z.verborgen, null);
        delete d.dataset.schritt;
        d.dataset.nummer = z.schritt;
        d.className = 'rw-nummer';
        z.nummer = d;
    });
    // the operations (umformungen), green like the deck's, in a column of their own between the rows and the
    // numbers; each shows with the row it made (data-mit: flugLandet, schritteLanden)
    const ops = umformungen();
    zeilen.forEach(z => {
        const op = ops.get(z.schritt);
        if (!op) return;
        const macht = z.schritt === 'aufgabe' ? 0 : z.schritt + 1;
        const weg = (verborgenAb !== undefined && macht >= verborgenAb) || imFlug.has(macht);
        const d = zelle('\\textstyle\\vert\\;\\; ' + op, macht, weg, null);
        delete d.dataset.schritt;
        d.dataset.mit = macht;
        d.className = 'rw-op';
        z.umformung = d;
    });
    // the double underline of the result: two lines UNTER_EM apart under
    // the ink, the first as far below it (in em of the row)
    const UNTER_EM = 0.12, unterDicke = em => Math.max(1.5, 0.05 * em);
    // width, where the baseline lies in the cell, and how far the ink
    // reaches above and below it (the cell's own line box is far taller)
    // - all of it, and the fractions on their own
    const mass = d => {
        const r = d.getBoundingClientRect(), b = d.lastChild.getBoundingClientRect().top;
        const t = tinte(d) || { o: b, u: b };
        let bruchHoch = 0, bruchTief = 0;
        d.querySelectorAll('.mfrac').forEach(f => {
            const q = tinte(f);
            if (q) { bruchHoch = Math.max(bruchHoch, b - q.o); bruchTief = Math.max(bruchTief, q.u - b); }
        });
        return { w: r.width, auf: b - r.top, hoch: b - t.o, tief: t.u - b, bruchHoch, bruchTief };
    };
    zeilen.forEach(z => { z.l = mass(z.links); z.r = mass(z.rechts); if (z.nummer) z.n = mass(z.nummer); if (z.umformung) z.o = mass(z.umformung); });
    // down the lines, from the second line (or under the template strip).
    // Line n runs from (n-1)*ZEILE - 1 to n*ZEILE - 1. A row takes a line
    // of its own plus every line above and below that it reaches more
    // than a quarter into - a parenthesis or an exponent may stick out
    // that far, as by hand. A fraction keeps an eighth of a line of air
    // from the ink of the row above and below: its numerator's x stood
    // right under the x of the row above.
    // Doc, 26.09.: "beginne IMMER in der 2. Zeile ... oder 3. wenn nötig
    // nicht erste" - the first row's own line (the "=") is the second; a
    // numerator may use the first. The third only when more stands above
    // (a root over a fraction), never the first.
    const ragt = ZEILE / 4, luft = ZEILE / 8;
    const linien = (weit, frei) => Math.max(0, Math.ceil((weit - frei - ragt) / ZEILE));
    const erste = testModus ? Math.ceil(kopf.getBoundingClientRect().height / ZEILE) : 0;
    // the rows at sizes s[i]: on which line each stands, and the last line taken - all rows, or the rows
    // idx in that order going on from a row laid out before (stand: the task, above both columns)
    const legenAufLinien = (s, idx = zeilen.map((_, i) => i), stand = null) => {
        let linie = stand ? stand.linie : erste, vor = stand ? stand.vor : null;
        const lage = [];
        idx.forEach(i => {
            const z = zeilen[i];
            const ab = linieAb(s[i]);
            const hoch = s[i] * Math.max(z.l.hoch, z.r.hoch);
            // the result's double underline takes its room below the ink
            const unter = z.ergebnis ? 2 * UNTER_EM * rechenEm() + unterDicke(rechenEm()) : 0;
            const tief = s[i] * (Math.max(z.l.tief, z.r.tief) + unter);
            const bruch = z.l.bruchHoch || z.r.bruchHoch || z.l.bruchTief || z.r.bruchTief;
            linie += 1 + linien(hoch, ZEILE - ab);
            if (!vor) linie = Math.max(linie, 2);          // the first row (of a column without the task)
            if (!vor && obenFrei) while (linie * ZEILE - 1 - ab - hoch < obenFrei) linie++;   // under the labels
            if (vor && (bruch || vor.bruch)) {
                while (linie * ZEILE - 1 - ab - hoch - (vor.basis + vor.tief) < luft) linie++;
            }
            const hier = { linie, ab, basis: linie * ZEILE - 1 - ab, tief, bruch };
            linie += linien(tief, ab);
            vor = hier;
            lage[i] = hier;
        });
        return { lage, linie, stand: { linie, vor } };
    };
    // Without the lines (Doc, 27.09.): the first row where it always stood (its "=" on the second line), every
    // next one the same gap below the ink of the one above - half a line, a little more than most rows had
    // on the lines. "linie" stays the unit the rest reckons in: where the working ends, in lines.
    const ABSTAND = ZEILE / 2;
    const legenFrei = (s, idx = zeilen.map((_, i) => i), stand = null) => {
        let vor = stand ? stand.vor : null;
        const lage = [];
        idx.forEach(i => {
            const z = zeilen[i];
            const ab = linieAb(s[i]);
            const hoch = s[i] * Math.max(z.l.hoch, z.r.hoch);
            const unter = z.ergebnis ? 2 * UNTER_EM * rechenEm() + unterDicke(rechenEm()) : 0;
            const tief = s[i] * (Math.max(z.l.tief, z.r.tief) + unter);
            const bruch = z.l.bruchHoch || z.r.bruchHoch || z.l.bruchTief || z.r.bruchTief;
            let basis = vor ? vor.basis + vor.tief + ABSTAND + hoch
                : Math.max(2 * ZEILE - 1 - ab, erste * ZEILE + hoch + ABSTAND / 2, obenFrei ? obenFrei + hoch : 0);
            const hier = { linie: basis / ZEILE, ab, basis, tief, bruch };
            vor = hier;
            lage[i] = hier;
        });
        const ende = vor ? vor.basis + vor.tief + ABSTAND / 2 : erste * ZEILE;
        return { lage, linie: Math.ceil(ende / ZEILE), stand: { vor }, ende };
    };
    const legen = (s, idx, stand) => linienZeigen ? legenAufLinien(s, idx, stand) : legenFrei(s, idx, stand);
    // Doc, 26.09.: the task "breiter als der Platz zwischen 'Aufgabe 6 / 20'
    // und 'umstellen nach x'" on the Lenovo - all rows shrink together
    // until the widest fits, the task with its two labels beside it
    const c = container.getBoundingClientRect(), RAND = 16;
    const zaehler = kopf.querySelector('span'), nach = document.getElementById('vorlage-nach');
    // Doc, 27.09. evening: "der Schriftzug Aufgabe 12 von 12 soll bitte doch links oben hinter dem
    // Zurückpfeil erscheinen ... und das Umstellen nach bitte über die eigentliche Aufgabe" - both on the
    // board's first row, the line of the arrows: the counter right behind the left one, "umstellen nach x"
    // centred over the task (once it is laid out, further down); the task starts a quarter line under them
    let obenFrei = 0;
    if (aufgabenModus) {
        kopf.style.top = '0px';
        kopf.style.height = ZEILE + 'px';                  // the labels' top:50% is the arrows' middle
        const pfeil = document.querySelector('#tafel-pfeil-zurueck svg'), pr = pfeil && pfeil.getBoundingClientRect();
        if (zaehler) { zaehler.style.right = 'auto'; zaehler.style.left = ((pr && pr.width ? pr.right - c.left : 32) + 8) + 'px'; }
        // the block's name the same way before the right arrow
        const block = document.getElementById('vorlage-block');
        const pfeilVor = document.querySelector('#tafel-pfeil-vor svg'), pv = pfeilVor && pfeilVor.getBoundingClientRect();
        if (block) block.style.right = ((pv && pv.width ? c.right - pv.left : 32) + 8) + 'px';
        if (nach) { nach.style.right = 'auto'; nach.style.left = (c.width / 2) + 'px'; nach.style.transform = 'translate(-50%, -50%)'; }
        obenFrei = Math.max(0, ...[zaehler, block, nach].filter(Boolean).map(e => e.getBoundingClientRect().bottom - c.top)) + ZEILE / 4;
    }
    const nummerBreite = (s, idx) => Math.max(0, ...idx.filter(i => zeilen[i].n)
        .map(i => s[i] * (NUMMER_LUFT * rechenEm() + NUMMER_GROESSE * zeilen[i].n.w)));
    const umformungBreite = (s, idx) => Math.max(0, ...idx.filter(i => zeilen[i].o)
        .map(i => s[i] * (UMFORMUNG_LUFT * rechenEm() + UMFORMUNG_GROESSE * zeilen[i].o.w)));
    // the "=" column of the rows idx within [links, links + breite]: centred by their widest parts,
    // the operations' column (ob) and the numbers' (nb) right of them counted in
    const spalteIn = (s, idx, links, breite) => {
        const lm = Math.max(0, ...idx.map(i => s[i] * zeilen[i].l.w)), rm = Math.max(0, ...idx.map(i => s[i] * zeilen[i].r.w));
        const ob = umformungBreite(s, idx), nb = nummerBreite(s, idx);
        return { lm, rm, ob, nb, x: links + (breite - lm - rm - ob - nb) / 2 + lm };
    };
    const alle = zeilen.map((_, i) => i);
    const spalte = s => spalteIn(s, alle, 0, c.width);
    // (until 27.09. evening the task also had to fit between its two labels; they stand above it now)
    const passtBreit = s => {
        const { lm, rm, ob, nb } = spalte(s);
        return lm + rm + ob + nb <= c.width - 2 * RAND;
    };
    let g = 1;
    while (g > 0.3 && !passtBreit(zeilen.map(() => g))) g -= 0.02;
    // Doc, 26.09.: a "Pyramiden-Size" (the newest row full, the older ones smaller). 27.09. on the Lenovo
    // a long working had the newest row twice as large as the rest and still ran into the squares - then
    // "was hältst du von zwei Spalten?": every row one size, and a working longer than the board goes on
    // in a second column, as on a blackboard. The task stays on top across the board, the steps fill the
    // left half from under it, then the right half from under it again; each half has its own "=" column.
    // Rows too wide for half the board stay in one column, all shrinking together (never below half
    // size); what does not fit even then runs into the squares.
    const platz = papierGrenze(c.height) / ZEILE;
    const gleich = t => zeilen.map(() => t);
    const kopfIdx = aufgabenModus && zeilen.length ? [0] : [];
    const schritte = alle.filter(i => !kopfIdx.includes(i));
    const HALB = c.width / 2, ZWEI_MIN = 0.6;           // smaller than that, a second column is not worth it
    const ZWEI_VORZUG = 1.1;                            // ... nor when it does not make the writing a tenth larger
    const SPALT_RAND = 32;                              // air to the line between the columns and to the edge
    const passtHalb = s => { const { lm, rm, ob, nb } = spalteIn(s, schritte, 0, HALB); return lm + rm + ob + nb <= HALB - 2 * SPALT_RAND; };
    // the task, the left column as full as it goes, the rest on the right
    const zweiSpalten = s => {
        const oben = legen(s, kopfIdx, null);
        let k = schritte.length - 1, l1 = legen(s, schritte.slice(0, k), oben.stand);
        while (k > 1 && l1.linie > platz) { k--; l1 = legen(s, schritte.slice(0, k), oben.stand); }
        const l2 = legen(s, schritte.slice(k), oben.stand);
        const lage = [];
        [oben, l1, l2].forEach(t => t.lage.forEach((p, i) => { if (p) lage[i] = p; }));
        return { lage, linie: Math.max(oben.linie, l1.linie, l2.linie), links: schritte.slice(0, k), rechts: schritte.slice(k), rechtsLinie: l2.linie };
    };
    // one column, as large as it fits (never below half size) ...
    let t1 = g, einzeln = legen(gleich(g));
    while (einzeln.linie > platz && t1 - 0.02 >= 0.5) { t1 -= 0.02; einzeln = legen(gleich(t1)); }
    let s = gleich(t1), gelegt = einzeln, zwei = null, t2 = null;
    // ... and two only when one does not fit at full size and two make the writing clearly larger (Doc,
    // 27.09.: "warum die x ist gleich 8 Fünftel nicht noch unten drunter gepasst hat" - one column missed
    // by 6 px, and the two had to shrink to 0.78 for the width of (2x+1)(x-1) in half the board). When
    // neither fits, two hold more.
    if (t1 < g && schritte.length >= 2) {
        let t = g;
        while (t > ZWEI_MIN && !passtHalb(gleich(t))) t -= 0.02;
        if (passtHalb(gleich(t))) {
            let versuch = zweiSpalten(gleich(t));
            while (versuch.linie > platz && t - 0.02 >= ZWEI_MIN) { t -= 0.02; versuch = zweiSpalten(gleich(t)); }
            t2 = t;
            if (versuch.linie <= platz ? t >= ZWEI_VORZUG * t1 : einzeln.linie > platz) { zwei = versuch; s = gleich(t); gelegt = versuch; }
        }
    }
    // Doc, 27.09.: "die linke und rechte Spalte, diesen Block, tatsächlich y zentriert machen zwischen unter
    // der Aufgabe und dem Panel unten" - the columns move down by half the room left under them (on the
    // ruled lines by whole lines). The left column is filled first and sets the block's height, so nothing
    // moves while the right one fills.
    if (zwei) {
        let unten = -Infinity;
        schritte.forEach(i => { unten = Math.max(unten, gelegt.lage[i].basis + gelegt.lage[i].tief); });
        const frei = papierGrenze(c.height) - ABSTAND / 2 - unten;
        const schub = frei <= 0 ? 0 : linienZeigen ? Math.floor(frei / 2 / ZEILE) * ZEILE : frei / 2;
        if (schub) {
            schritte.forEach(i => { gelegt.lage[i].basis += schub; });
            gelegt.linie = Math.max(gelegt.linie, Math.ceil((unten + schub + ABSTAND / 2) / ZEILE));
            gelegt.rechtsLinie += schub / ZEILE;
        }
    }
    rechenwegMass = { zeile: ZEILE, platz, grenze: papierGrenze(c.height), hoehe: c.height, g, t1, t2, s: s[0], zwei: !!zwei,
        einzelnLinie: einzeln.linie, einzelnEnde: einzeln.ende, obenFrei };
    // each row's "=" column: one for all, or the task's (across the board), the left and the right one's -
    // and where its column's numbers end on the right
    const setze = (idx, sp) => idx.forEach(i => {
        zeilen[i].gleichX = sp.x;
        zeilen[i].umformungLinks = sp.x + sp.rm;
        zeilen[i].nummerRechts = sp.x + sp.rm + sp.ob + sp.nb;
    });
    if (zwei) {
        setze(kopfIdx, spalteIn(s, kopfIdx, 0, c.width));
        setze(zwei.links, spalteIn(s, zwei.links, 0, HALB));
        setze(zwei.rechts, spalteIn(s, zwei.rechts, HALB, HALB));
    } else setze(alle, spalte(s));
    const F = parseFloat(host.style.fontSize);
    zeilen.forEach((z, i) => {
        const { basis, ab } = gelegt.lage[i];
        if (s[i] < 1) [z.links, z.rechts].forEach(d => { d.style.fontSize = (s[i] * F).toFixed(2) + 'px'; });
        z.links.style.left = (z.gleichX - s[i] * z.l.w) + 'px';
        z.links.style.top = (basis - s[i] * z.l.auf) + 'px';
        z.rechts.style.left = z.gleichX + 'px';
        z.rechts.style.top = (basis - s[i] * z.r.auf) + 'px';
        if (z.umformung) {
            const os = s[i] * UMFORMUNG_GROESSE;
            z.umformung.style.fontSize = (os * F).toFixed(2) + 'px';
            z.umformung.style.left = (z.umformungLinks + s[i] * UMFORMUNG_LUFT * rechenEm()) + 'px';
            z.umformung.style.top = (basis - os * z.o.auf) + 'px';
        }
        if (z.nummer) {
            const ns = s[i] * NUMMER_GROESSE;
            z.nummer.style.fontSize = (ns * F).toFixed(2) + 'px';
            z.nummer.style.left = (z.nummerRechts - ns * z.n.w) + 'px';
            z.nummer.style.top = (basis - ns * z.n.auf) + 'px';
        }
        z.basis = basis;
        z.ab = ab;
    });
    rechenwegLinie = zeilen.length ? gelegt.linie : Math.max(erste, 1);
    // in two columns the next step goes on under the right one - the flight's first guess (schaetzeZiel)
    rechenwegZiel = zwei ? { gleich: zeilen[zwei.rechts[0]].gleichX, linie: zwei.rechtsLinie } : null;
    // Doc, 27.09.: "wenn wir zwei Spalten haben, muss in der Mitte unbedingt ein senkrechter dünner Strich
    // sein. Sonst sieht das irgendwie durcheinander aus", in the colour of the line above the squares
    // (.rw-trenner) - then "nach unten bitte nur auf die Baseline der tiefliegendsten Formel ... und oben
    // auch bitte nur Top Line der am oben liegendsten Formel": from the top of the highest step's ink to
    // the bottom of the lowest one's (a fraction's denominator counts, a result's underline does not)
    if (zwei) {
        let von = Infinity, bis = -Infinity;
        schritte.forEach(i => {
            const z = zeilen[i], b = gelegt.lage[i].basis;
            von = Math.min(von, b - s[i] * Math.max(z.l.hoch, z.r.hoch));
            bis = Math.max(bis, b + s[i] * Math.max(z.l.tief, z.r.tief));
        });
        const t = document.createElement('div');
        t.className = 'rw-trenner';
        t.style.cssText = `left:${Math.round(HALB)}px;top:${von}px;height:${Math.max(0, bis - von)}px`;
        host.appendChild(t);
    }
    // the double underline, under the whole row; it lands with it (data-schritt)
    zeilen.forEach((z, i) => {
        if (!z.ergebnis) return;
        const em = rechenEm() * s[i], dicke = unterDicke(em);
        const u = document.createElement('div');
        u.dataset.schritt = z.schritt;
        u.style.cssText = `position:absolute;left:${z.gleichX - s[i] * z.l.w}px;width:${s[i] * (z.l.w + z.r.w)}px;` +
            `top:${z.basis + s[i] * Math.max(z.l.tief, z.r.tief) + UNTER_EM * em}px;height:${UNTER_EM * em + dicke}px;` +
            `box-sizing:border-box;border-top:${dicke}px solid currentColor;border-bottom:${dicke}px solid currentColor`;
        if (z.farbe && z.farbe !== INK) u.style.color = z.farbe;
        if (z.verborgen) u.style.visibility = 'hidden';
        host.appendChild(u);
    });
    // a second look: each cell exactly on its line (a cell may lay out
    // a little differently where it ends up)
    const oben = container.getBoundingClientRect().top;
    zeilen.forEach(z => [z.links, z.rechts, z.nummer, z.umformung].filter(Boolean).forEach(d => {
        const ist = d.lastChild.getBoundingClientRect().top - oben;
        if (Math.abs(ist - z.basis) > 0.25) d.style.top = (parseFloat(d.style.top) + z.basis - ist) + 'px';
    }));
    // KaTeX's fonts may still be on their way (the first layout after a
    // load): measured with a stand-in font the rows miss their lines and
    // the "=" gap - lay them out again once the fonts are there
    if (document.fonts && document.fonts.status === 'loading' && !rechenwegWartet) {
        rechenwegWartet = true;
        document.fonts.ready.then(() => { rechenwegWartet = false; zeigeRechenweg(verborgenAb); });
    }
    // "umstellen nach x" centred over the typeset task (its line was set above, before the layout)
    if (aufgabenModus && nach) {
        let links = Infinity, rechts = -Infinity;
        host.querySelectorAll('[data-schritt="aufgabe"] .katex-html').forEach(z => {
            const r = z.getBoundingClientRect();
            if (r.width) { links = Math.min(links, r.left); rechts = Math.max(rechts, r.right); }
        });
        if (isFinite(links)) nach.style.left = ((links + rechts) / 2 - c.left) + 'px';
    }
    zeigeBuzzAufgabe();                // the buzzer's pill goes behind the newest row
    anzeigeBald();
}
// Doc, 26.09.: "wenn die Rechnung fertig ist ... und ich tippe das rechte
// Dreieck für die nächste Aufgabe, dann sollen ... alle Zeilen einschließlich
// Aufgabe und umstellen nach x nach oben raus scrollen ... und erhalten
// bleiben bitte. Und die nächste Aufgabe soll sozusagen out of the dark ...
// faden" - a copy of the task strip and the working glides up past the top
// edge (the beamer gets its twin), and the task that comes fades in where
// the task stands. What was computed is kept on the device (vorrechnen-erledigt).
const WECHSEL_MS = 900;
function rechenwegArchivieren() {
    let a = [];
    try { a = JSON.parse(localStorage.getItem('vorrechnen-erledigt') || '[]'); } catch (_) {}
    if (!Array.isArray(a)) a = [];
    a.push({ aufgabe: AUFGABEN[aufgabeIdx][0], latex: AUFGABEN[aufgabeIdx][1], zeit: Date.now(),
        rechenweg: rechenweg.map(e => ({ latex: e.latex, farbe: e.farbe || null })) });
    try { localStorage.setItem('vorrechnen-erledigt', JSON.stringify(a.slice(-200))); } catch (_) {}
}
