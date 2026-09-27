// Vorrechnen (vorrechnen.html), part 2 of 12: drawing (pen, finger, eraser) and rendering.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Drawing ─────────────────────────────────────────────────────────
function canvasPos(ev) {
    const rect = canvas.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top, t: performance.now() };
}

// Palm rejection. "Nur Stift" (hidden) lets only the pen draw. On by
// default is something smarter (Doc, 25.09.: "default ein!"), because Doc
// also writes with a finger: once the pen is in use - down or hovering -
// fingers and the ball of the hand do not draw, until a few seconds after
// the pen was last seen. A touch stroke under way when the pen lands is
// dropped, a second pointer while one draws is ignored, and a contact as
// wide as a palm never draws.
const STIFT_RUHE = 3000;           // ms after the pen was last seen
const BALLEN_BREITE = 45;          // px of contact: wider is a palm, not a finger
let stiftZuletzt = -Infinity, currentId = null;
// Doc, 26.09.: "Handballen -> nur Stift" - the palm filter has no switch
// any more and is always on; "Nur Stift" (penOnly) lets only the pen draw
// try { const v = localStorage.getItem('vorrechnen-handballen'); if (v !== null) view.handballen = v === '1'; } catch (_) {}
try { view.penOnly = localStorage.getItem('vorrechnen-nur-stift') === '1'; } catch (_) {}

function penAccepted(ev) {
    if (view.penOnly) return ev.pointerType === 'pen';
    if (ev.pointerType !== 'touch' || !view.handballen) return true;
    if (performance.now() - stiftZuletzt < STIFT_RUHE) return false;
    return !((ev.width || 0) > BALLEN_BREITE || (ev.height || 0) > BALLEN_BREITE);
}

// Swipe up with two or more fingers: the finished lines join the
// working under the task (rechenwegHoch). Doc asked for four fingers;
// Windows 11 may keep three and four for itself on a touchscreen, so
// any two or more count. Fingers in a gesture never draw, and a stroke
// the first finger had begun is dropped. A palm is not a finger.
const WISCH = 60;                  // px, the way of the finger that moved most
// Doc, 27.09. ("links und rechts wischen funktioniert noch nicht ... da sind irgendwelche
// Striche gemalt"), measured on the Lenovo: two fingers seldom touch and leave together -
// one lifts after 30 ms, a finger lands again right after, and each of those drew a line.
// A finger this soon after a gesture belongs to it and never draws.
const NACHLAUF = 400;              // ms after a gesture
// ... and the Lenovo reports two fingers close together as ONE contact that jumps: the first
// lifts after 45-80 ms, the next lands 20 ms later a little beside it. A contact that
// follows another this fast and this near is the same gesture; the first one's line goes.
const KETTE_MS = 45, KETTE_PX = 200;
const finger = new Map();          // pointerId -> { x0, y0, x, y, weg }
let geste = false, gesteAbgebrochen = false, gesteEnde = -Infinity, gesteStumm = false;
let letzterTouch = null;           // { ende, x0, y0, x, y, strich } of the last single finger
let kette = null;                  // { x0, y0 }: where a chain of contacts began
function fingerRunter(ev) {
    if (ev.pointerType !== 'touch') return false;
    if ((ev.width || 0) > BALLEN_BREITE || (ev.height || 0) > BALLEN_BREITE) return geste;
    const jetzt = performance.now(), l = letzterTouch;
    const nachlauf = !geste && jetzt - gesteEnde < NACHLAUF;
    const glied = !geste && !nachlauf && l && jetzt - l.ende < KETTE_MS &&
        Math.hypot(ev.clientX - l.x, ev.clientY - l.y) < KETTE_PX;
    finger.set(ev.pointerId, { x0: ev.clientX, y0: ev.clientY, x: ev.clientX, y: ev.clientY, weg: false });
    if (!geste && (nachlauf || glied || [...finger.values()].filter(f => !f.weg).length >= 2)) {
        geste = true;
        gesteAbgebrochen = false;
        if (!nachlauf) gesteStumm = false;       // a gesture of its own may turn or send again
        verlaufGesteBeginnt();
        if (current && current.pointerType === 'touch') { current = null; currentId = null; redrawBald(); }
        if (glied) {                             // the contact before began it: its line goes
            kette = { x0: l.x0, y0: l.y0 };
            const i = l.strich ? strokes.lastIndexOf(l.strich) : -1;
            if (i >= 0) { strokes.splice(i, 1); recompute(); merkeStriche(); }
        }
        letzterTouch = null;
    }
    return geste;
}
function fingerZieht(ev) {
    const f = finger.get(ev.pointerId);
    if (f && !f.weg) { f.x = ev.clientX; f.y = ev.clientY; }
    if (geste && f) verlaufZiehen([...finger.values()]);      // two fingers down: back in time
    return geste && !!f;
}
function fingerHoch(ev) {
    const f = finger.get(ev.pointerId);
    if (!f) return false;
    if (!geste) {
        finger.delete(ev.pointerId);
        letzterTouch = { ende: performance.now(), x0: f.x0, y0: f.y0, x: ev.clientX, y: ev.clientY, strich: null };
        return false;
    }
    // a cancelled pointer (the system took the gesture) has no position
    if (ev.type === 'pointercancel') gesteAbgebrochen = true;
    else if (!f.weg) { f.x = ev.clientX; f.y = ev.clientY; }
    f.weg = true;
    if ([...finger.values()].some(g => !g.weg)) return true;
    // the finger that moved most says where the swipe went (the average of one that
    // lifted after 30 ms and one that swiped halved the way)
    const weit = [...finger.values()].reduce((a, g) =>
        Math.hypot(g.x - g.x0, g.y - g.y0) > Math.hypot(a.x - a.x0, a.y - a.y0) ? g : a);
    let dx = weit.x - weit.x0, dy = weit.y - weit.y0;
    // a chain of contacts: from where the first began to where the last one left
    if (kette && Math.hypot(f.x - kette.x0, f.y - kette.y0) > Math.hypot(dx, dy)) { dx = f.x - kette.x0; dy = f.y - kette.y0; }
    kette = null;
    finger.clear();
    geste = false;
    gesteEnde = performance.now();
    if (verlaufZug) { verlaufLoslassen(); return true; }        // it was scrolling, not a send
    if (gesteAbgebrochen || gesteStumm) return true;            // a finger landing again after a turn: nothing more
    // Doc, 27.09.: two fingers to the left or right turn the task (he hit the triangles by
    // mistake) - like a page: "nach links will ich doch nach unten gehen und nach rechts nach
    // oben", to the left the next task, to the right the one before; two fingers up send the page up
    if (Math.abs(dx) > WISCH && Math.abs(dx) > Math.abs(dy)) { gesteStumm = true; naechsteVorlage(dx < 0 ? 1 : -1); }
    else if (dy < -WISCH && Math.abs(dy) > Math.abs(dx)) { gesteStumm = true; rechenwegHoch(); }
    return true;
}

// a quick sideways swipe of one finger in the upper field: 150 px at least, mostly
// sideways, 0.8 px/ms or faster (the swipes the Lenovo took for one finger: 1.1 and 1.9)
const WISCHER_PX = 150, WISCHER_TEMPO = 0.8;
// Doc, 27.09.: "funktioniert, aber er macht immer noch einen Strich, der dann weggeht ...
// den Strich will ich nicht sehen" - a finger's line in the upper field stays hidden while
// it may still be a swipe: quick and sideways so far (the first 120 ms always, at most
// 450 ms); anything else shows at once, with all its points
let verdeckt = false;
function nochWischer(s) {
    const a = s.points[0], b = s.points[s.points.length - 1], dt = b.t - a.t;
    if (dt < 120) return true;
    if (dt > 450) return false;
    const dx = b.x - a.x, dy = b.y - a.y;
    return Math.abs(dx) > 2 * Math.abs(dy) && Math.abs(dx) / dt >= WISCHER_TEMPO * 0.75;
}
function wischerOben(s) {
    if (modus === 'frei' || s.points.length < 2) return false;
    const a = s.points[0], b = s.points[s.points.length - 1];
    if (a.y >= papierGrenze(container.getBoundingClientRect().height)) return false;   // the writing field: ink
    const dx = b.x - a.x, dy = b.y - a.y, dauer = Math.max(1, b.t - a.t);
    return Math.abs(dx) >= WISCHER_PX && Math.abs(dx) > 2 * Math.abs(dy) && Math.abs(dx) / dauer >= WISCHER_TEMPO;
}

canvas.addEventListener('pointerdown', ev => {
    if (anzeigeModus) return;
    if (fingerRunter(ev)) { ev.preventDefault(); return; }
    if (ev.pointerType === 'pen') {
        stiftZuletzt = performance.now();
        // a finger or palm stroke under way when the pen lands was not meant
        if (current && current.pointerType !== 'pen' && view.handballen) {
            current = null;
            currentId = null;
            redrawBald();
        }
    }
    if (!penAccepted(ev)) return;
    if (current && ev.pointerId !== currentId) return;       // one stroke at a time
    // Capture keeps the stroke alive when the pen leaves the canvas mid
    // draw. If it is refused, carry on regardless - losing the capture is
    // a nuisance, losing the stroke is not acceptable.
    try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
    const p = canvasPos(ev);
    if (radieren) {
        if (radierId !== null && ev.pointerId !== radierId) return;
        radierId = ev.pointerId;
        radierGeaendert = false;
        radiere(p);
        zeigeRadierer(p);
        ev.preventDefault();
        return;
    }
    // Pressure widens the line a little where the tablet reports it.
    const w = 2.5 + (ev.pressure > 0 ? ev.pressure * 2.5 : 1.2);
    current = { points: [p], width: w, pointerType: ev.pointerType, farbe: stiftFarbe };
    currentId = ev.pointerId;
    verdeckt = ev.pointerType === 'touch' && modus !== 'frei' && p.y < papierGrenze(container.getBoundingClientRect().height);
    clearTimeout(autoTimer);
    ev.preventDefault();
});

// A pen samples far faster than the browser fires pointermove - the rest
// arrives bundled in getCoalescedEvents(). Without them a 260 px stroke
// ends up with 15 points and every curve turns into a chain of straight
// bits, which is exactly what "ich kann nicht richtig schreiben" feels
// like. Redrawing is throttled to one frame: doing it per event made the
// tablet drop the events we are trying to collect.
let zeichenFrame = null;
function redrawBald() {
    if (zeichenFrame) return;
    zeichenFrame = requestAnimationFrame(() => { zeichenFrame = null; redraw(); });
}

// Doc, 26.09.: "Gib mir bitte unten in dem Formelfeld in der Mitte ein
// Radiergummi, der etwa so groß ist wie so ein Kästchen" - a square of one
// square of the paper: every piece of ink that runs through it goes (a stroke
// is cut there, the rest stays). One wipe is one undo step. A colour in the
// rail takes the pen again.
let radieren = false, radierId = null, radierGeaendert = false;
function radierKasten(p) {
    const h = ZEILE / 4;
    return { x0: p.x - h, x1: p.x + h, y0: p.y - h, y1: p.y + h };
}
// where the segment a-b runs through the box: its entry and exit as fractions
// of the way from a to b, or null (Liang-Barsky)
function imKasten(a, b, k) {
    let t0 = 0, t1 = 1;
    const dx = b.x - a.x, dy = b.y - a.y;
    for (const [pp, q] of [[-dx, a.x - k.x0], [dx, k.x1 - a.x], [-dy, a.y - k.y0], [dy, k.y1 - a.y]]) {
        if (pp === 0) { if (q < 0) return null; continue; }
        const r = q / pp;
        if (pp < 0) { if (r > t1) return null; if (r > t0) t0 = r; }
        else { if (r < t0) return null; if (r < t1) t1 = r; }
    }
    return { t0, t1 };
}
const zwischen = (a, b, u) => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u,
    t: a.t !== undefined && b.t !== undefined ? a.t + (b.t - a.t) * u : a.t });
// the ink in the box goes: each stroke is cut exactly at the box's edge, so
// the pieces before and after it stay however few points they have
function radiere(p) {
    const k = radierKasten(p);
    let geaendert = false;
    const neu = [];
    strokes.forEach(st => {
        const pts = st.points;
        const b = StrokeSymbols.bboxOfPoints(pts);
        if (b.x > k.x1 || b.x + b.w < k.x0 || b.y > k.y1 || b.y + b.h < k.y0) { neu.push(st); return; }
        const laeufe = [];
        let lauf = [pts[0]], getroffen = false;
        for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1], c = pts[i], t = imKasten(a, c, k);
            if (!t) { lauf.push(c); continue; }
            getroffen = true;
            if (t.t0 > 0) lauf.push(zwischen(a, c, t.t0));        // up to where it enters
            if (lauf.length >= 2) laeufe.push(lauf);
            lauf = t.t1 < 1 ? [zwischen(a, c, t.t1), c] : [];    // on from where it leaves
        }
        if (!getroffen) { neu.push(st); return; }
        if (lauf.length >= 2) laeufe.push(lauf);
        geaendert = true;
        laeufe.forEach(l => neu.push(Object.assign({}, st, { points: l })));
    });
    if (!geaendert) return;
    if (!radierGeaendert) { merkeVerlauf('radier'); radierGeaendert = true; }
    strokes.length = 0;
    neu.forEach(st => strokes.push(st));
    redrawBald();
}
function radierEnde() {
    radierId = null;
    if (!radierGeaendert) return;
    radierGeaendert = false;
    erkennenStand++;                   // an answer on its way is void
    verwerfeErkennung();
    recompute();
    merkeStriche();
}
// the eraser's frame under the finger, for Doc only (not on the canvas: the
// canvas goes to the beamer)
function zeigeRadierer(p) {
    let r = document.getElementById('radier-rahmen');
    if (!radieren || !p) { if (r) r.style.display = 'none'; return; }
    if (!r) {
        r = document.createElement('div');
        r.id = 'radier-rahmen';
        r.setAttribute('aria-hidden', 'true');
        container.appendChild(r);
    }
    const k = radierKasten(p);
    Object.assign(r.style, { display: '', left: k.x0 + 'px', top: k.y0 + 'px', width: (k.x1 - k.x0) + 'px', height: (k.y1 - k.y0) + 'px' });
}
// Doc, 26.09. night: "der Radiergummi ist mir zu präsent ... so wie die beiden
// C-Buttons, wenn er nicht selektiert ist" - dimmed like them while there is no
// ink, lit only while it rubs
function radiererBlass() {
    const b = document.getElementById('radierer');
    // pale while nothing below the line is there to rub out (ink on the board above does not count, Doc 27.09.)
    const istOben = obenPruefer();
    if (b) b.style.opacity = radieren || strokes.some(st => !istOben(st)) ? '' : '0.35';
}
function setzeRadieren(an) {
    radieren = an;
    const b = document.getElementById('radierer');
    if (b) { b.classList.toggle('an', an); b.setAttribute('aria-pressed', an ? 'true' : 'false'); }
    radiererBlass();
    canvas.style.cursor = an ? 'none' : '';
    if (!an) zeigeRadierer(null);
}

canvas.addEventListener('pointermove', ev => {
    if (ev.pointerType === 'pen') stiftZuletzt = performance.now();   // hovering counts too
    if (fingerZieht(ev)) { ev.preventDefault(); return; }
    if (radieren) {
        zeigeRadierer(canvasPos(ev));
        if (radierId === null || ev.pointerId !== radierId) return;
        const roh = (typeof ev.getCoalescedEvents === 'function') ? ev.getCoalescedEvents() : null;
        (roh && roh.length ? roh : [ev]).forEach(e => radiere(canvasPos(e)));
        ev.preventDefault();
        return;
    }
    if (!current || ev.pointerId !== currentId) return;
    const roh = (typeof ev.getCoalescedEvents === 'function') ? ev.getCoalescedEvents() : null;
    if (roh && roh.length) roh.forEach(e => current.points.push(canvasPos(e)));
    else current.points.push(canvasPos(ev));
    if (verdeckt) verdeckt = nochWischer(current);
    redrawBald();
    ev.preventDefault();
});

// Double tap on the page switches dust <-> strokes. Doc tapped twice on
// the page (25.09.) and got two dots, the first of which also threw the
// recognition away. A tap is held back for a moment: a second tap on
// the same spot switches and neither stays; otherwise it lands as a dot.
// A colon's dots sit apart, one above the other, so they still write.
// Only in "Beispiele" now (Doc, 26.09.: "ja, absolut gute Idee"): in class a
// small colon ("| :3" in the notes) or a dot set down twice switched the
// morph by accident and vanished; there a tap is a dot at once. The switch
// stays in the card "Modus".
const TIPP_GROESSE = 10;           // px: a stroke this small is a tap
const TIPP_FENSTER = 300;          // ms between the two taps (Doc: ~150)
const TIPP_ABSTAND = 25;           // px sideways between the two taps
const TIPP_HOEHE = 12;             // px up or down: more is a colon
let tipp = null;                   // { strich, x, y, zeit, timer }
function istTipp(s) {
    const xs = s.points.map(p => p.x), ys = s.points.map(p => p.y);
    return Math.max(...xs) - Math.min(...xs) <= TIPP_GROESSE &&
        Math.max(...ys) - Math.min(...ys) <= TIPP_GROESSE;
}
function legeStrich(s) {
    if (s.points.length < 2) return false;
    merkeVerlauf('strich');
    strokes.push(s);
    merkeBeispiel(false);
    // a note in the margin changes nothing that was read: the recognised
    // line stays, no second round with Gemini (the notes margin)
    if (notizPruefer()(s)) return true;
    erkennenStand++;
    if (zeilenErgebnis.length) verwerfeErkennung();
    autoBald();
    return true;
}

// Doc, 25.09.: "Das Erkennen probieren wir mal automatisch, sagen wir
// mal nach zwei Sekunden keine Eingabe." Every stroke restarts the
// clock, a pen or finger on the page stops it. Only lines not yet
// recognised (or failed) are sent. In class only - with "Meine
// Beispiele" every pause would save half a line as a probe.
// Doc, 26.09. evening: "startet das Erkennen noch automatisch? ... das ist keine
// gute Idee. Ich tippe da lieber" - off unless the "Auto" box is ticked; after
// a tap on ERKENNEN the line still flies up at once. A new key: an "on" stored
// under the old one must not keep it on.
const AUTO_PAUSE = 2000;           // ms without input
let autoErkennen = false, autoTimer = null;
try { const v = localStorage.getItem('vorrechnen-auto-erkennen'); if (v !== null) autoErkennen = v === '1'; } catch (_) {}
function autoBald() {
    clearTimeout(autoTimer);
    if (!autoErkennen || testModus) return;
    autoTimer = setTimeout(() => {
        if (current || tipp || geste) return;          // the end of that input restarts the clock
        if (erkennenLaeuft) return autoBald();
        if (analysis.lines.some(l => !zuKlein(l) && !zeilenErgebnis[l.lineIdx])) erkennen();
    }, AUTO_PAUSE);
}
function tippAblegen() {
    if (!tipp) return;
    clearTimeout(tipp.timer);
    const s = tipp.strich;
    tipp = null;
    if (legeStrich(s)) { recompute(); merkeStriche(); }
    else redrawBald();
}

function endStroke(ev) {
    if (ev && ev.pointerType === 'pen') stiftZuletzt = performance.now();
    if (ev && fingerHoch(ev)) return;
    if (radierId !== null && (!ev || ev.pointerId === radierId)) { radierEnde(); return; }
    if (!current || (ev && ev.pointerId !== currentId)) return;
    currentId = null;
    const s = current;
    current = null;
    verdeckt = false;
    // Doc, 27.09.: "da ist so ein kleiner Strich gemalt mit zwei Fingern" - a finger's
    // stroke whose touch was cancelled (the system took it) leaves no ink; a pen's stays
    if (ev && ev.type === 'pointercancel' && s.pointerType === 'touch') { redrawBald(); return; }
    // Doc, 27.09. ("gute Idee, machen wir so"): the Lenovo often reports only one of two
    // fingers - a quick sideways swipe of one finger in the upper field (nothing is read
    // there) turns the task as well; a slow stroke there still draws
    if (s.pointerType === 'touch' && wischerOben(s)) {
        redrawBald();
        gesteEnde = performance.now();
        gesteStumm = true;                  // a finger landing again right after: nothing more
        naechsteVorlage(s.points[s.points.length - 1].x < s.points[0].x ? 1 : -1);   // to the left: the next
        return;
    }
    if (testModus && istTipp(s)) {
        const p = s.points[0], jetzt = performance.now();
        if (tipp && jetzt - tipp.zeit < TIPP_FENSTER &&
            Math.abs(p.x - tipp.x) < TIPP_ABSTAND && Math.abs(p.y - tipp.y) < TIPP_HOEHE) {
            clearTimeout(tipp.timer);
            tipp = null;
            redrawBald();
            wechsleMorphArt();
            return;
        }
        tippAblegen();
        tipp = { strich: s, x: p.x, y: p.y, zeit: jetzt, timer: setTimeout(tippAblegen, TIPP_FENSTER) };
        redrawBald();
        return;
    }
    tippAblegen();
    legeStrich(s);
    if (s.pointerType === 'touch' && letzterTouch && !letzterTouch.strich) letzterTouch.strich = s;   // a chain may take it back
    recompute();
    merkeStriche();
}

// Live-reload kept wiping Doc's strokes mid-session. They now survive a
// reload in localStorage; LEEREN clears them for good.
function merkeStriche() {
    try { localStorage.setItem('vorrechnen-striche', JSON.stringify(strokes)); } catch (_) {}
}
function holeStriche() {
    try {
        const d = JSON.parse(localStorage.getItem('vorrechnen-striche') || '[]');
        if (Array.isArray(d) && d.length) { strokes.length = 0; d.forEach(s => strokes.push(s)); }
    } catch (_) {}
}
canvas.addEventListener('pointerup', endStroke);
canvas.addEventListener('pointercancel', endStroke);
canvas.addEventListener('pointerleave', endStroke);
canvas.addEventListener('pointerleave', () => { if (radieren && radierId === null) zeigeRadierer(null); });

// Doc, 26.09.: "Gib mir bitte unten ein Drittel auf der rechten Seite, wo ich
// Anweisungen schreiben kann, die aber nicht mit transkribiert werden ...
// senkrechter Strich, wir teilen durch drei", then "ein Viertel reicht" - the
// right quarter of the squares is a margin for notes: its ink stays on the board (the class sees it), but
// it is never read and never flies up; it goes with the line it belonged to.
// A stroke counts by the middle of its box. Not in "Beispiele" (the corpus).
const NOTIZ_ANTEIL = 1 / 4;
// where the margin starts, px from the left: on a line of the squares (Doc,
// 26.09.: "die gestrichelte Linie soll coincide mit dem Karo") - the squares'
// lines lie at k * ZEILE/2 - 1 (#papier .karo). Every part of the margin -
// its line, what is read, the hint, the buttons - takes it from here.
function notizX(breite) {
    const karo = ZEILE / 2;
    return Math.round(breite * (1 - NOTIZ_ANTEIL) / karo) * karo - 1;
}
function notizPruefer() {
    if (modus === 'beispiele') return () => false;
    const r = container.getBoundingClientRect(), x0 = notizX(r.width), y0 = papierGrenze(r.height);
    return s => {
        if (!s.points || !s.points.length) return false;
        const b = StrokeSymbols.bboxOfPoints(s.points);
        return b.x + b.w / 2 >= x0 && b.y + b.h / 2 >= y0;
    };
}
// Doc, 27.09.: "Im oberen Feld, wenn man da was schreibt, soll erstmal jetzt in diesem Modus Aufgaben nichts
// erkannt werden" - ink on the board above the line (its middle above it) is left alone, like the notes:
// not read, and not what the C of the writing field, the eraser or ERKENNEN count
function obenPruefer() {
    if (!aufgabenModus) return () => false;
    const y0 = papierGrenze(container.getBoundingClientRect().height);
    return s => {
        if (!s.points || !s.points.length) return false;
        const b = StrokeSymbols.bboxOfPoints(s.points);
        return b.y + b.h / 2 < y0;
    };
}
function recompute() {
    // only the calculation is read: the notes and the board above the line stay out, the
    // indices of the rest are mapped back onto the page
    const istNotiz = notizPruefer(), istOben = obenPruefer();
    const nr = [];
    strokes.forEach((s, i) => { if (!istNotiz(s) && !istOben(s)) nr.push(i); });
    analysis = StrokeSymbols.analyse(nr.map(i => strokes[i]), opts);
    if (nr.length !== strokes.length) analysis.symbols.forEach(sy => { sy.strokeIdxs = sy.strokeIdxs.map(k => nr[k]); });
    if (aufgabenModus && naechsterSchritt()) alsEineZeile(analysis);
    const nk = document.getElementById('notiz-leeren');
    // no notes: dimmed - asked of the notes themselves, the ink on the board above is left out too (Doc, 27.09.)
    if (nk) nk.style.opacity = strokes.some(istNotiz) ? '' : '0.35';
    const sk = document.getElementById('seite-leeren');
    if (sk) sk.style.opacity = nr.length ? '' : '0.35';                     // nothing written: dimmed
    radiererBlass();
    redraw();
    updateStats();
}

// ── Rendering ───────────────────────────────────────────────────────
function strokePath(s, farbe = s.farbe) {
    if (s.points.length < 2) return;
    ctx.strokeStyle = anzeige(farbe);
    ctx.beginPath();
    ctx.moveTo(s.points[0].x, s.points[0].y);
    for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
    ctx.lineWidth = s.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function redraw() {
    if (anzeigeModus) return;
    zeigeZeitleiste();
    zeigeWerkzeuge();
    erkennenKlein();
    zeigeSatz();
    const rect = container.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Row bands first, so they sit behind everything.
    if (view.rows) {
        analysis.lines.forEach(l => {
            if (!l.bbox) return;
            ctx.fillStyle = 'rgba(0, 210, 255, 0.055)';
            ctx.fillRect(0, l.bbox.y - 8, rect.width, l.bbox.h + 16);
        });
    }

    // Strokes that belong to a morphing row are drawn by the morph
    // itself - otherwise the original ink would still sit underneath and
    // the whole thing would look like a cross-fade, which is exactly what
    // Doc does not want.
    const imMorph = new Set();
    if (morphT > 0) {
        analysis.lines.forEach(l => {
            if (morphVorbereitet[l.lineIdx])
                l.symbols.forEach(sy => sy.strokeIdxs.forEach(i => imMorph.add(i)));
        });
    }
    ctx.strokeStyle = INK;
    strokes.forEach((s, i) => { if (!imMorph.has(i)) strokePath(s); });
    if (current && !verdeckt) strokePath(current);
    if (tipp) strokePath(tipp.strich);

    if (morphT > 0) {
        analysis.lines.forEach(l => {
            const v = morphVorbereitet[l.lineIdx];
            // at t = 1 the row is real KaTeX (zeigeSatz), the canvas steps aside
            const erg = zeilenErgebnis[l.lineIdx];
            if (morphT >= 1 && erg && erg.satz) return;
            // Doc: "alles grün" - the formula ends in the ink's green, no blue
            if (v) zeichneMorph(ctx, v, morphT, anzeige(linienFarbe(l)));
        });
    }

    anzeigeBald();

    // lines on their way up (rechenwegHoch): ink or morph in a frame
    // that glides and shrinks towards the step's place
    fluege.forEach(f => {
        ctx.save();
        ctx.translate(f.p.tx, f.p.ty);
        ctx.scale(f.p.s, f.p.s);
        if (f.v && f.mt > 0) zeichneMorph(ctx, f.v, f.mt, anzeige(f.farbe));
        else f.striche.forEach(s => strokePath(s, f.farbe));
        ctx.restore();
    });

    if (view.boxes && morphT === 0) {
        analysis.lines.forEach(line => {
            line.symbols.forEach((sym, i) => {
                const c = SYM_COLORS[i % SYM_COLORS.length];
                const b = sym.bbox;
                ctx.strokeStyle = c;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 3]);
                ctx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8);
                ctx.setLineDash([]);
                // Doc: "keine Boxbeschriftung" - numbers and stroke
                // counts were for calibrating, they only clutter now.
                if (false && view.numbers) {
                    ctx.fillStyle = c;
                    ctx.font = '600 12px Orbitron, sans-serif';
                    ctx.fillText(String(sym.readIdx), b.x - 4, b.y - 9);
                    // Stroke count, so a glyph that fell apart is obvious.
                    ctx.font = '400 10px Outfit, sans-serif';
                    ctx.globalAlpha = 0.65;
                    ctx.fillText(sym.strokeIdxs.length + '×', b.x + b.w - 4, b.y - 9);
                    ctx.globalAlpha = 1;
                }
            });
        });
    }

    // Doc: "NUR die LaTeX Formel" - the per-glyph transcription on the
    // canvas is gone; the typeset formula under the row (KaTeX, see
    // zeigeFormeln) says the same thing and says it properly.
}

function updateStats() {
    const el = document.getElementById('stat-row');
    if (!el) return;
    const perLine = analysis.lines.map(l => l.symbols.length).join(' · ') || '–';
    el.innerHTML =
        `<div class="stat"><b>${strokes.length}</b><span>Striche</span></div>` +
        `<div class="stat"><b>${analysis.symbols.length}</b><span>Symbole</span></div>` +
        `<div class="stat"><b>${analysis.lines.length}</b><span>Zeilen</span></div>` +
        `<div class="stat"><b>${perLine}</b><span>je Zeile</span></div>`;
}
