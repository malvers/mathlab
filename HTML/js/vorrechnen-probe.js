// Vorrechnen (vorrechnen.html), part 11 of 12: test mode (Doc's handwriting examples), export/import of the strokes.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Test mode: Doc's own handwriting for the template on top ────────
// Doc, 25.09.: "Wir sind jetzt im Modus, dass wir erstmal testen, wie gut
// das Morph funktioniert. Aufgrund der Beispiele, die wir haben." With
// "Meine Beispiele" on, every template (WEITER, and at start) comes with
// what he wrote for it - the corpus from the OneDrive zip - centred, a
// moment to see the ink, then the morph into the template. BEISPIEL shows
// it again. No API call; an example is never saved as a probe.
let korpus = null, beispielTimer = null, istBeispiel = false;

// A new mode is a new board: the page, the lines in flight and the
// working all go
function setzeModus(m) {
    if (!MODI.includes(m) || m === modus) return;
    modus = m;
    testModus = m === 'beispiele';
    aufgabenModus = m === 'aufgaben';
    try { localStorage.setItem('vorrechnen-modus', m); } catch (_) {}
    leereTafel();
    zeigeVorlage();
    if (testModus) beispiel();
}
function leereTafel() {
    clearTimeout(beispielTimer);
    clearTimeout(autoTimer);
    flugAbbrechen();
    vergissVerlauf();
    rechenweg.length = 0;
    merkeRechenweg();
    strokes.length = 0;
    current = null;
    if (tipp) { clearTimeout(tipp.timer); tipp = null; }
    istBeispiel = false;
    merkeBeispiel(false);
    verwerfeErkennung();
    recompute();
    merkeStriche();
}

// template LaTeX -> the first probe written for it. Later probes under the
// same slug may hold anything (probe 26-32: an integral under "linear").
async function ladeKorpus() {
    if (korpus) return korpus;
    korpus = new Map();
    try {
        const namen = (await (await fetch('/__proben/', { cache: 'no-store' })).json()).proben || [];
        const daten = await Promise.all(namen.map(n =>
            fetch('morpheus/handschrift-proben/' + n, { cache: 'no-store' }).then(r => r.json()).catch(() => null)));
        daten.forEach(d => {
            const l = d && d.vorlage && d.vorlage.latex;
            if (l && d.strokes && d.strokes.length && !korpus.has(l)) korpus.set(l, d);
        });
    } catch (_) {}
    return korpus;
}

// A reload (live reload after every edit) brings the strokes back but not
// the recognition - Doc then saw his handwriting without morph or formula.
// So the lab remembers that the canvas shows an example and replays it.
function merkeBeispiel(ja) {
    try { localStorage.setItem('vorrechnen-beispiel', ja ? '1' : '0'); } catch (_) {}
}

async function beispiel() {
    const latex = VORLAGEN[vorlageIdx][1];
    const d = (await ladeKorpus()).get(latex);
    clearTimeout(beispielTimer);
    vergissVerlauf();
    verwerfeErkennung();
    strokes.length = 0;
    current = null;
    istBeispiel = !!d;
    merkeBeispiel(!!d);
    if (!d) { recompute(); merkeStriche(); redraw(); zeigeVorlage('keine Probe'); return; }
    // Written on another screen: centred under the head strip, shrunk
    // only if it would not fit - never enlarged, it is Doc's size.
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    d.strokes.forEach(st => st.points.forEach(q => { x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y); x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y); }));
    // between the template strip on top and, at the bottom, the recognised
    // formula (84 px) above the film strip (ZEITLEISTE_H)
    // the recognised formula is the same formula, so it is as tall as the
    // template strip
    const rect = container.getBoundingClientRect();
    const kopfEl = document.getElementById('vorlage-schicht');
    const KOPF = Math.max(84, kopfEl ? kopfEl.getBoundingClientRect().height : 84), FUSS = ZEITLEISTE_H + KOPF;
    const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);
    const sk = Math.min(1, (rect.width - 100) / w, (rect.height - KOPF - FUSS - 20) / h);
    const ox = (rect.width - w * sk) / 2, oy = KOPF + (rect.height - KOPF - FUSS - h * sk) / 2;
    d.strokes.forEach(st => strokes.push(Object.assign({}, st, {
        width: (st.width || 3) * sk,
        points: st.points.map(q => Object.assign({}, q, { x: ox + (q.x - x0) * sk, y: oy + (q.y - y0) * sk })),
    })));
    recompute();
    merkeStriche();
    redraw();
    zeigeVorlage();
    const zeilen = analysis.lines.filter(l => !zuKlein(l));
    if (zeilen.length !== 1) return;
    const line = zeilen[0];
    const { atome, svg, satz } = await formelAufZeile(latex, line);
    const { zuordnung, nachjustiert } = ordneZeile(line, atome);
    zeilenErgebnis[line.lineIdx] = { latex, tokens: [], atome, ms: 0, zuordnung, svg, nachjustiert, satz };
    await HandschriftMorph.schriftenBereit(atome);
    await HandschriftMorph.svgVorbereiten(atome);
    morphVorbereitet[line.lineIdx] = bereiteMorph(line, zuordnung, atome);
    zeigeFormeln();
    beispielTimer = setTimeout(() => morphen(1), morphOpts.pause * 1000);
}

// Doc: "Show (again)" - back to the handwriting, a moment to see it,
// then the morph once more. Nothing is recognised or saved again.
function nochmal() {
    if (!morphVorbereitet.some(Boolean)) { setProbeStatus('Erst ERKENNEN oder BEISPIEL'); return; }
    clearTimeout(beispielTimer);
    setzeMorph(0);
    beispielTimer = setTimeout(() => morphen(1), morphOpts.pause * 1000);
}

function setProbeStatus(msg) {
    const el = document.getElementById('probe-status');
    if (el) el.textContent = msg;
}

// One probe per ERKENNEN: strokes, the template, what was recognised,
// and how the pairing went. The server picks the running number.
async function speichereProbe() {
    // probes are for the templates only - in class (the tasks) nothing
    // is saved, and on docalvers.de nothing may land as a download
    if (istBeispiel || !testModus) return;
    const [slug, vorlage] = VORLAGEN[vorlageIdx];
    const erg = analysis.lines.map(l => zeilenErgebnis[l.lineIdx]).find(e => e && e.latex);
    const probe = {
        version: 2, created: new Date().toISOString(), geraet: navigator.userAgent.includes('Android') ? 'Tablet' : 'Mac',
        canvas: { w: canvas.width, h: canvas.height, dpr: devicePixelRatio },
        vorlage: { idx: vorlageIdx, slug, latex: vorlage },
        latex: erg ? erg.latex : '', tokens: erg ? erg.tokens : [],
        zeichen: erg && erg.atome ? erg.atome.length : 0,
        passt: !!(erg && erg.zuordnung && erg.zuordnung.passt),
        nachjustiert: !!(erg && erg.nachjustiert),
        diagnose: erg && erg.zuordnung ? erg.zuordnung.diagnose : (erg && erg.fehler) || '',
        morph: !!morphVorbereitet.some(Boolean),
        options: opts, strokes,
    };
    const body = JSON.stringify(probe, null, 1);
    if (speichernApi) {
        try {
            const r = await fetch('/__proben/' + encodeURIComponent(slug), {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
            const j = await r.json().catch(() => ({}));
            if (r.ok && j.name) {
                setProbeStatus('gespeichert: ' + j.name);
                korpus = null;          // a new probe is an example right away, not after a reload
                return;
            }
            setProbeStatus('Speichern fehlgeschlagen (' + r.status + ') – Download stattdessen');
        } catch (e) {
            setProbeStatus('Speichern fehlgeschlagen – Download stattdessen');
        }
    } else {
        setProbeStatus('kein Speicher-Endpunkt – Download stattdessen');
    }
    const blob = new Blob([body], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'probe-' + slug + '-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

// ── Export / import ─────────────────────────────────────────────────
// The point of this page: draw once, then replay the strokes as often as
// needed while tuning, without picking the tablet back up.
function exportStrokes() {
    const data = {
        version: 1,
        created: new Date().toISOString(),
        canvas: { w: Math.round(container.getBoundingClientRect().width),
                  h: Math.round(container.getBoundingClientRect().height) },
        options: opts,
        strokes,
    };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'striche-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function importStrokes(file) {
    const r = new FileReader();
    r.onload = () => {
        try {
            const d = JSON.parse(r.result);
            if (!Array.isArray(d.strokes)) throw new Error('keine Striche in der Datei');
            strokes.length = 0;
            d.strokes.forEach(s => strokes.push(s));
            recompute();
        } catch (e) {
            alert('Konnte die Datei nicht lesen: ' + e.message);
        }
    };
    r.readAsText(file);
}

// Anything that was recognised belongs to the strokes as they were. Once
// the ink changes, that result is stale - so it goes, together with the
// morph built from it. Otherwise a second example would inherit the
// first one's glyphs.
function verwerfeErkennung() {
    erkennenStand++;
    zeilenErgebnis.length = 0;
    morphVorbereitet.length = 0;
    if (morphAnim) { cancelAnimationFrame(morphAnim); morphAnim = null; }
    morphT = 0;
    const r = document.getElementById('morph-regler');
    if (r) r.value = 0;
    const h = document.getElementById('formel-schicht');
    if (h) h.innerHTML = '';
    setErgebnisText('–');
}

function clearAll() {
    if (strokes.length || tipp || rechenweg.length) merkeVerlauf();   // C / LEEREN can be undone
    // The working survives a LEEREN of the page (a botched step must not
    // cost the lesson's board); LEEREN on an empty page clears it too.
    if (!strokes.length && !current && !tipp && (rechenweg.length || fluege.length)) {
        flugAbbrechen();
        rechenweg.length = 0;
        merkeRechenweg();
        zeigeRechenweg();
    }
    clearTimeout(beispielTimer);
    clearTimeout(autoTimer);
    istBeispiel = false;
    merkeBeispiel(false);
    strokes.length = 0;
    current = null;
    if (tipp) { clearTimeout(tipp.timer); tipp = null; }
    verwerfeErkennung();
    recompute();
    merkeStriche();
}

function undoStroke() {
    strokes.pop();
    verwerfeErkennung();
    recompute();
    merkeStriche();
}
