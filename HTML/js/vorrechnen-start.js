// Vorrechnen (vorrechnen.html), part 12 of 12: the side panel and the boot.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Side panel ──────────────────────────────────────────────────────
function buildPanel() {
    // Three buttons, nothing else (Doc, 25.09.). Everything that was
    // here before - statistics, undo, load, model picker, the morph
    // slider, the display switches and the seven tuning sliders - is
    // kept at the bottom of this function, commented out, because the
    // functions behind them still exist and we will want them back for
    // calibrating.
    CyberUI.createCard('ui-container', '', `
                <div class="gross-row">
                    <!-- Doc, 26.09.: "LEEREN butt weg! links" - the C on the board does it
                    <button class="cyber-btn gross" style="height:6.4rem;min-height:6.4rem;font-size:1.6rem;letter-spacing:0.12em;width:100%;padding:0;line-height:6.4rem" onclick="clearAll()">LEEREN</button> -->
                    <!-- Doc, 25.09.: "nimm den SICHERN unter Kommentar" - ERKENNEN saves every probe anyway
                    <button class="cyber-btn gross" style="height:6.4rem;min-height:6.4rem;font-size:1.6rem;letter-spacing:0.12em;width:100%;padding:0;line-height:6.4rem" onclick="exportStrokes()">SICHERN</button> -->
                    <button id="knopf-erkennen" class="cyber-btn gross" style="height:6.4rem;min-height:6.4rem;font-size:1.6rem;letter-spacing:0.12em;width:100%;padding:0;line-height:6.4rem" onclick="erkennen()">ERKENNEN</button>
                    <!-- Doc, 26.09.: "nimm die beiden vor/zur butts links raus" - the
                         triangles on the board do it now; kept, commented out
                    <div style="display:flex;gap:0.9rem">
                        <button class="cyber-btn gross" style="height:6.4rem;min-height:6.4rem;flex:1;min-width:0;padding:0;display:flex;align-items:center;justify-content:center"
                                onclick="naechsteVorlage(-1)" title="vorige Vorlage" aria-label="vorige Vorlage">
                            <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 4 L6 12 L17 20 Z" fill="currentColor"/></svg>
                        </button>
                        <button class="cyber-btn gross" style="height:6.4rem;min-height:6.4rem;flex:1;min-width:0;padding:0;display:flex;align-items:center;justify-content:center"
                                onclick="naechsteVorlage(1)" title="nächste Vorlage" aria-label="nächste Vorlage">
                            <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4 L18 12 L7 20 Z" fill="currentColor"/></svg>
                        </button>
                    </div>
                    -->
                    <!-- Doc: "mach die NOCHMAL so wie WEITER", then "NOCHMAL -> PLAY", then
                         26.09.: "nimm PLAY butt raus" - it is a triangle under the film strip now
                    <button class="cyber-btn gross" style="height:6.4rem;min-height:6.4rem;font-size:1.6rem;letter-spacing:0.12em;width:100%;padding:0;line-height:6.4rem" onclick="nochmal()">PLAY</button> -->
                </div>
                <!-- Doc 25.09.2026: "BEISPIEL Button raus" - kept, commented out, beispiel() still exists
                <div class="btn-row" style="margin-top:0.8rem">
                    <button class="cyber-btn" style="flex:1" onclick="beispiel()">BEISPIEL</button>
                </div>
                -->
                <!-- Doc: no text under the slider. Still written, just not shown -
                     display:none off again when calibrating. -->
                <div id="probe-status" class="erk-info" style="margin-top:0.6rem;display:none">–</div>
                <div id="erkennung-out" style="margin-top:1rem;display:none"><div class="erk-info">–</div></div>
                <input type="file" id="import-file" accept="application/json" style="display:none"
                       onchange="if(this.files[0]) importStrokes(this.files[0])">
                <select id="modell-wahl" style="display:none">
                    <option value="gemini-2.5-flash">2.5-flash</option>
                </select>
                <input type="range" id="morph-regler" min="0" max="1" step="0.01" value="0"
                       oninput="setzeMorph(this.value)" style="display:none">
            `, '#00d2ff');

    // Doc, 26.09.: "alle Settings (Staub Strich Slider) in eine card, die
    // default geschlossen ... persist", then "mach Einstellungen zu Modus
    // und pack alle Sliders in eine neue card Einstellungen" - the big
    // buttons on top, then "Modus" (the switches), then "Einstellungen"
    // (the sliders), both closed at first and remembered
    CyberUI.createCard('ui-container', 'Modus',
        '<div id="modus-wahl" style="margin-bottom:28px"></div><div id="schalter" style="margin-bottom:28px"></div><div id="morph-steuerung"></div>', '#00d2ff',
        { collapsible: true, collapsed: true, persistKey: 'vorrechnen-einstellungen-zu' });   // the old card's state
    CyberUI.createCard('ui-container', 'Einstellungen', '<div id="regler"></div>', '#00d2ff',
        { collapsible: true, collapsed: true, persistKey: 'vorrechnen-regler-zu' });
    // no "MODUS" over the three choices - the card says it
    CyberUI.createRadioGroup('modus-wahl', '', [
        { value: 'frei', label: 'Frei' }, { value: 'aufgaben', label: 'Aufgaben' },
        { value: 'beispiele', label: 'Beispiele' },          // Doc: "Meine Beispiele -> Beispiele"
    ], modus, v => setzeModus(v));

    // Doc: "speed slider für mich". Letting go replays the morph at the
    // new speed, so the effect can be judged right away.
    CyberUI.createRadioGroup('morph-steuerung', 'Morph (Doppel-Tippen)', [
        { value: 'staub', label: 'Staub' }, { value: 'strich', label: 'Strich' },
    ], morphArt, v => wechsleMorphArt(v));
    document.querySelectorAll('#morph-steuerung .cyber-radio-input').forEach(r => { r.name = 'morph-art'; });

    CyberUI.createSlider('regler', 'Morph-Dauer', 0.1, 1, morphDauer, 0.05, v => {
        morphDauer = v;
        try { localStorage.setItem('vorrechnen-morph-dauer', String(v)); } catch (_) {}
        nachRegler(false);
    }, '#00d2ff', v => v.toFixed(2) + ' s');

    // Doc: "welche Parameter haben wir noch - alle auf Slider bitte"
    // [label, key, min, max, step, format, needs a new preparation] -
    // most important first (Doc: "die wichtigsten als erste")
    [
        ['Wolke: Streuung', 'wolke', 0, 1, 0.05, v => v.toFixed(2), true],
        ['Wolke: Auftrieb', 'auftrieb', 0, 1, 0.05, v => v.toFixed(2), true],
        ['Wirbel', 'wirbel', 0, 0.5, 0.01, v => v.toFixed(2), false],
        ['Körnerdichte', 'dichte', 0.1, 1, 0.05, v => v.toFixed(2), true],
        ['Staubkorn', 'staub', 0.3, 2, 0.1, v => v.toFixed(1) + ' px', false],
        ['Welle links nach rechts', 'staffel', 0, 0.6, 0.05, v => v.toFixed(2), false],
        ['Pause vor dem Morph', 'pause', 0, 2, 0.1, v => v.toFixed(1) + ' s', false],
    ].forEach(([label, key, min, max, step, fmt, neu]) => {
        CyberUI.createSlider('regler', label, min, max, morphOpts[key], step, v => {
            morphOpts[key] = v;
            try { localStorage.setItem('vorrechnen-morph', JSON.stringify(morphOpts)); } catch (_) {}
            nachRegler(neu);
        }, '#00d2ff', fmt);
    });

    // Doc: "nur Stift ganz unter die Slider" - fingers then do not draw;
    // the two-finger swipe still works. Off on a new device: in class
    // Doc writes with his finger.
    // ... and it stays under the sliders when they moved to "Einstellungen"
    const nurStift = CyberUI.createCheckbox('regler', 'Nur Stift', view.penOnly, v => {
        view.penOnly = v;
        try { localStorage.setItem('vorrechnen-nur-stift', v ? '1' : '0'); } catch (_) {}
    });
    nurStift.style.marginTop = '20px';

    /* Doc, 26.09.: "Boxen zeigen weg" - back for calibrating
    CyberUI.createCheckbox('schalter', 'Boxen zeigen', view.boxes, v => {
        view.boxes = view.rows = v;
        try { localStorage.setItem('vorrechnen-boxen', v ? '1' : '0'); } catch (_) {}
        redraw();
    });
    */

    /* Doc, 26.09.: "Handballen -> nur Stift" - the filter is always on now
    CyberUI.createCheckbox('schalter', 'Handballen ignorieren', view.handballen, v => {
        view.handballen = v;
        try { localStorage.setItem('vorrechnen-handballen', v ? '1' : '0'); } catch (_) {}
    });
    */

    // Doc: "Auto reicht" - recognises after 2 s without input
    CyberUI.createCheckbox('schalter', 'Auto', autoErkennen, v => {
        autoErkennen = v;
        try { localStorage.setItem('vorrechnen-auto-erkennen', v ? '1' : '0'); } catch (_) {}
        if (v) autoBald(); else clearTimeout(autoTimer);
    });

    // Doc, 27.09.: the ruled lines "mal probieren" without - here they come back, rows on the lines again
    CyberUI.createCheckbox('schalter', 'Linien', linienZeigen, v => {
        linienZeigen = v;
        try { localStorage.setItem('vorrechnen-linien', v ? '1' : '0'); } catch (_) {}
        zeigePapier();
        zeigeRechenweg();
        redraw();
    });

    /* Ausgeblendet auf Docs Wunsch (25.09.) - die Funktionen dahinter
       leben weiter, nur die Bedienelemente sind weg:

    CyberUI.createCard('ui-container', 'Aufnahme', `
        <div id="stat-row"></div>
        <div class="btn-row">
            <button class="cyber-btn" onclick="undoStroke()">ZURÜCK</button>
            <button class="cyber-btn" onclick="document.getElementById('import-file').click()">LADEN</button>
        </div>
    `, '#00d2ff');

    CyberUI.createCheckbox('ui-container', 'Nur Stift (Handballen ignorieren)', view.penOnly,
        v => { view.penOnly = v; });
    CyberUI.createCheckbox('ui-container', 'Kästchen zeigen', view.boxes,
        v => { view.boxes = v; redraw(); });
    CyberUI.createCheckbox('ui-container', 'Nummern zeigen', view.numbers,
        v => { view.numbers = v; redraw(); });
    CyberUI.createCheckbox('ui-container', 'Zeilen zeigen', view.rows,
        v => { view.rows = v; redraw(); });

    const sl = (label, key, min, max, step) =>
        CyberUI.createSlider('ui-container', label, min, max, opts[key], step,
            v => { opts[key] = parseFloat(v); recompute(); }, 'rgb(245,194,66)');
    sl('Zeilenabstand', 'lineGapFactor', 0.4, 2.5, 0.05);
    sl('Überlappung seitlich', 'xOverlapRatio', 0.1, 0.95, 0.05);
    sl('Nachbarschaft seitlich', 'xGapFactor', 0.05, 0.8, 0.01);
    sl('Nur-Nähe: Zeitfenster (ms)', 'nearOnlyMs', 60, 800, 10);
    sl('Gleiches Zeichen: Zeitfenster (ms)', 'sameSymbolMs', 200, 2500, 50);
    sl('Später gesetzt: Überlappung', 'lateJoinRatio', 0.3, 1.0, 0.05);
    sl('Zeilentrennung senkrecht', 'yGapFactor', 0.3, 2.0, 0.05);
    */
}

// ── Boot ────────────────────────────────────────────────────────────
// The drawing surface must match its box exactly, or the ink lands beside
// the pen: the browser stretches the canvas to its CSS size, so a stale
// pixel size shows up as a horizontal offset that grows to the right.
// Measured on the tablet: 1287 px wide inside a 993 px box at dpr 1.5 -
// 1.296 instead of 1.5.
let letzteGroesse = '';
function resizeCanvasToContainer() {
    if (anzeigeModus) return false;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    const key = w + 'x' + h + '@' + dpr;
    if (key === letzteGroesse) return false;
    letzteGroesse = key;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return true;
}

function init() {
    resizeCanvasToContainer();
    zeigePapier();
    zeigeTafelPfeile();                // halfway down the squares
    zeigeRechenweg();                  // the "=" column follows the board's width
    redraw();
    updateStats();
}

// The sidebar changes width when cards are added or it is collapsed, and
// window.resize says nothing about that. Watch the box itself.
if (typeof ResizeObserver === 'function') {
    new ResizeObserver(() => {
        if (resizeCanvasToContainer()) { zeigePapier(); zeigeTafelPfeile(); zeigeRechenweg(); redraw(); zeigeFormeln(); }
    }).observe(container);
}

window.addEventListener('resize', init);
// The worker makes Chrome offer a real install (sw-vorrechnen.js says why).
// Its scope is this page alone. Not under file://, where there is none.
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw-vorrechnen.js', { scope: 'vorrechnen.html' })
            .catch(() => { /* no app then - the page itself is unaffected */ });
    });
}

document.fonts.ready.then(() => {
    buildPanel(); holeStriche(); recompute(); init(); zeigeVorlage();
    // the buzzer listens on after a reload (live reload, mission control) - if it was on today
    if (window.Buzzer) { Buzzer.tempo(tempoMeldung, () => pillenStart); texteAnmelden(); Buzzer.weiter(buzzerMeldung); }
    let warBeispiel = false;
    try { warBeispiel = localStorage.getItem('vorrechnen-beispiel') === '1'; } catch (_) {}
    if (testModus && (!strokes.length || warBeispiel)) beispiel();
    else if (!testModus && warBeispiel) {
        // an example never belongs on the board outside "Meine Beispiele"
        strokes.length = 0;
        istBeispiel = false;
        merkeBeispiel(false);
        verwerfeErkennung();
        recompute();
        merkeStriche();
    }
    fetch('/__proben/', { cache: 'no-store' }).then(r => { speichernApi = r.ok; })
        .catch(() => { speichernApi = false; })
        .then(() => setProbeStatus(speichernApi ? 'Speichern auf dem Mac bereit' : 'kein Speicher-Endpunkt – Proben als Download'));
});
