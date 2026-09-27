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
        `font-family:Orbitron,sans-serif;font-size:${aufgabenModus ? '1.2rem' : '0.8rem'};letter-spacing:0.1em;color:#8a93a3`;
    // Doc: "Font-Size überall gleich", "Gleichheitszeichen untereinander" -
    // in class the task is the first row of the working (zeigeRechenweg),
    // up here only the counter and what to solve for, on the task's height
    host.innerHTML = `<span style="${RAND};left:24px">` +
        `${aufgabenModus ? `Aufgabe ${nr - aufgabenBlock(nr).ab + 1} / ${aufgabenBlock(nr).bis - aufgabenBlock(nr).ab}` : `${nr + 1} / ${liste.length}`}${hinweis ? ' · ' + hinweis : ''}</span>` +      // Doc: "schreib links vor 4 von 20 Aufgabe"
        (testModus ? `<span id="vorlage-formel" style="font-size:2.4rem;color:${anzeige(INK)}"></span>` : '') +
        (nach ? `<span id="vorlage-nach" style="${RAND};right:24px">umstellen nach <span style="font-size:1.4em"></span></span>` : '');
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
    for (let i = rechenweg.length - 1; i >= 0; i--) {
        const [l, r] = amGleich(rechenweg[i].latex.replace(UNGEFAEHR, '='));
        const links = l.replace(/\\displaystyle|[\s{}]/g, '');
        // every letter left once the commands (\frac, \cdot) are gone is a variable
        const rechts = r.replace(/^\{\}=/, '').replace(/\\[a-zA-Z]+/g, ' ');
        if (links === v && rechts.replace(/[\s{}]/g, '') && !rechts.includes(v)) return i;
    }
    return -1;
}
let rechenwegWartet = false;
let rechenwegLinie = 0;            // the last line the working takes (schaetzeZiel)
function zeigeRechenweg(verborgenAb) {
    if (anzeigeModus) return;
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
    zeilen.forEach(z => { z.l = mass(z.links); z.r = mass(z.rechts); });
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
    // the rows at sizes s[i]: on which line each stands, and the last line taken
    const legenAufLinien = s => {
        let linie = erste, vor = null;
        const lage = zeilen.map((z, i) => {
            const ab = linieAb(s[i]);
            const hoch = s[i] * Math.max(z.l.hoch, z.r.hoch);
            // the result's double underline takes its room below the ink
            const unter = z.ergebnis ? 2 * UNTER_EM * rechenEm() + unterDicke(rechenEm()) : 0;
            const tief = s[i] * (Math.max(z.l.tief, z.r.tief) + unter);
            const bruch = z.l.bruchHoch || z.r.bruchHoch || z.l.bruchTief || z.r.bruchTief;
            linie += 1 + linien(hoch, ZEILE - ab);
            if (i === 0) linie = Math.max(linie, 2);
            if (vor && (bruch || vor.bruch)) {
                while (linie * ZEILE - 1 - ab - hoch - (vor.basis + vor.tief) < luft) linie++;
            }
            const hier = { linie, ab, basis: linie * ZEILE - 1 - ab, tief, bruch };
            linie += linien(tief, ab);
            vor = hier;
            return hier;
        });
        return { lage, linie };
    };
    // Without the lines (Doc, 27.09.): the first row where it always stood (its "=" on the second line), every
    // next one the same gap below the ink of the one above - half a line, a little more than most rows had
    // on the lines. "linie" stays the unit the rest reckons in: where the working ends, in lines.
    const ABSTAND = ZEILE / 2;
    const legenFrei = s => {
        let vor = null;
        const lage = zeilen.map((z, i) => {
            const ab = linieAb(s[i]);
            const hoch = s[i] * Math.max(z.l.hoch, z.r.hoch);
            const unter = z.ergebnis ? 2 * UNTER_EM * rechenEm() + unterDicke(rechenEm()) : 0;
            const tief = s[i] * (Math.max(z.l.tief, z.r.tief) + unter);
            const bruch = z.l.bruchHoch || z.r.bruchHoch || z.l.bruchTief || z.r.bruchTief;
            let basis = vor ? vor.basis + vor.tief + ABSTAND + hoch
                : Math.max(2 * ZEILE - 1 - ab, erste * ZEILE + hoch + ABSTAND / 2);
            const hier = { linie: basis / ZEILE, ab, basis, tief, bruch };
            vor = hier;
            return hier;
        });
        const ende = vor ? vor.basis + vor.tief + ABSTAND / 2 : erste * ZEILE;
        return { lage, linie: Math.ceil(ende / ZEILE) };
    };
    const legen = s => linienZeigen ? legenAufLinien(s) : legenFrei(s);
    // Doc, 26.09.: the task "breiter als der Platz zwischen 'Aufgabe 6 / 20'
    // und 'umstellen nach x'" on the Lenovo - all rows shrink together
    // until the widest fits, the task with its two labels beside it
    const c = container.getBoundingClientRect(), RAND = 16;
    const zaehler = kopf.querySelector('span'), nach = document.getElementById('vorlage-nach');
    const zw = aufgabenModus && zaehler ? zaehler.getBoundingClientRect().width : 0;
    const nw = aufgabenModus && nach ? nach.getBoundingClientRect().width : 0;
    const spalte = s => {
        const lm = Math.max(0, ...zeilen.map((z, i) => s[i] * z.l.w)), rm = Math.max(0, ...zeilen.map((z, i) => s[i] * z.r.w));
        return { lm, rm, x: (c.width - lm - rm) / 2 + lm };
    };
    const passtBreit = s => {
        const { lm, rm, x } = spalte(s);
        if (lm + rm > c.width - 2 * RAND) return false;
        if (!aufgabenModus || !zeilen.length) return true;
        return x - s[0] * zeilen[0].l.w - 48 - zw >= RAND && x + s[0] * zeilen[0].r.w + 48 + nw <= c.width - RAND;
    };
    let g = 1;
    while (g > 0.3 && !passtBreit(zeilen.map(() => g))) g -= 0.02;
    // Doc, 26.09.: "jedes Mal, wenn eine neue Zeile dazukommt, werden die
    // oben kleiner und die nächste ein bisschen weniger kleiner ... so eine
    // Pyramiden-Size" - the newest row at full size, each older one q
    // times the next, q as large as lets everything end above the squares
    // (the task counts too). Never below half size; what does not fit
    // then runs into the squares for now (scrolling, a fit button: later).
    const platz = papierGrenze(c.height) / ZEILE;
    const groessen = q => zeilen.map((_, i) => g * Math.max(0.5, Math.pow(q, zeilen.length - 1 - i)));
    let s = groessen(1), gelegt = legen(s);
    for (let q = 0.98; gelegt.linie > platz && q >= 0.5; q -= 0.02) { s = groessen(q); gelegt = legen(s); }
    const gleichX = spalte(s).x, F = parseFloat(host.style.fontSize);
    zeilen.forEach((z, i) => {
        const { basis, ab } = gelegt.lage[i];
        if (s[i] < 1) [z.links, z.rechts].forEach(d => { d.style.fontSize = (s[i] * F).toFixed(2) + 'px'; });
        z.links.style.left = (gleichX - s[i] * z.l.w) + 'px';
        z.links.style.top = (basis - s[i] * z.l.auf) + 'px';
        z.rechts.style.left = gleichX + 'px';
        z.rechts.style.top = (basis - s[i] * z.r.auf) + 'px';
        z.basis = basis;
        z.ab = ab;
    });
    rechenwegLinie = zeilen.length ? gelegt.linie : Math.max(erste, 1);
    // the double underline, under the whole row; it lands with it (data-schritt)
    zeilen.forEach((z, i) => {
        if (!z.ergebnis) return;
        const em = rechenEm() * s[i], dicke = unterDicke(em);
        const u = document.createElement('div');
        u.dataset.schritt = z.schritt;
        u.style.cssText = `position:absolute;left:${gleichX - s[i] * z.l.w}px;width:${s[i] * (z.l.w + z.r.w)}px;` +
            `top:${z.basis + s[i] * Math.max(z.l.tief, z.r.tief) + UNTER_EM * em}px;height:${UNTER_EM * em + dicke}px;` +
            `box-sizing:border-box;border-top:${dicke}px solid currentColor;border-bottom:${dicke}px solid currentColor`;
        if (z.farbe && z.farbe !== INK) u.style.color = z.farbe;
        if (z.verborgen) u.style.visibility = 'hidden';
        host.appendChild(u);
    });
    // a second look: each cell exactly on its line (a cell may lay out
    // a little differently where it ends up)
    const oben = container.getBoundingClientRect().top;
    zeilen.forEach(z => [z.links, z.rechts].forEach(d => {
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
    // counter and "NACH x" sit level with the task
    if (aufgabenModus) {
        // the typeset formula itself, not its cells: the labels sit on its middle
        let o = Infinity, u = -Infinity;
        host.querySelectorAll('[data-schritt="aufgabe"] .katex-html').forEach(z => {
            const r = z.getBoundingClientRect();
            if (r.height) { o = Math.min(o, r.top); u = Math.max(u, r.bottom); }
        });
        if (isFinite(o)) {
            const c = container.getBoundingClientRect();
            // centred on the task's own line (the strip is at least 84 px)
            const h = Math.max(84, u - o), mitte = zeilen[0].basis + zeilen[0].ab - ZEILE / 2;
            kopf.style.top = (mitte - h / 2) + 'px';
            kopf.style.height = h + 'px';
            // the counter ends, "umstellen nach x" starts, 48 px beside the task
            // (Doc: "den Abstand links und rechts von der Formel etwas größer")
            let links = Infinity, rechts = -Infinity;
            host.querySelectorAll('[data-schritt="aufgabe"] .katex-html').forEach(z => {
                const r = z.getBoundingClientRect();
                if (r.width) { links = Math.min(links, r.left); rechts = Math.max(rechts, r.right); }
            });
            const zaehler = kopf.querySelector('span'), nach = document.getElementById('vorlage-nach');
            if (isFinite(links) && zaehler) { zaehler.style.left = 'auto'; zaehler.style.right = (c.right - links + 48) + 'px'; }
            if (isFinite(rechts) && nach) { nach.style.right = 'auto'; nach.style.left = (rechts - c.left + 48) + 'px'; }
        }
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
