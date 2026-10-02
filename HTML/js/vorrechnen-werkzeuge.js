// Vorrechnen (vorrechnen.html), part 10 of 12: undo/redo, the right rail's tools, full screen, the task panel, the arrow keys.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Undo / redo ─────────────────────────────────────────────────────
// Doc, 26.09.: "unten: C (für clear), undo/redo". A snapshot of the page
// and the working before every change (a stroke, C / LEEREN, a swipe);
// undo steps back through them, redo forth. A new task, mode or
// example starts a new history.
const verlauf = [], vorwaerts = [];
const VERLAUF_MAX = 200;
// art 'strich' (a stroke laid down) or 'radier' (a wipe of the eraser): the same kind in one go undoes
// together, a stroke and a wipe never (forloop-df's note: a wipe right after a stroke took the stroke along)
function schnappschuss(art = null) { return { striche: strokes.slice(), rechenweg: rechenweg.slice(), zeit: Date.now(), art }; }
function merkeVerlauf(art = null) {
    verlauf.push(schnappschuss(art));
    if (verlauf.length > VERLAUF_MAX) verlauf.shift();
    vorwaerts.length = 0;
}
function vergissVerlauf() { verlauf.length = 0; vorwaerts.length = 0; }

function setzeHell(an) {
    hell = an;
    try { localStorage.setItem('vorrechnen-hell', an ? '1' : '0'); } catch (_) {}
    container.classList.toggle('hell', an);
    zeigeVorlage();                    // template colour, and the working
    zeigeFormeln();
    redraw();                          // ink, morph, typeset lines, circles
}
function stelleHer(z) {
    flugAbbrechen();
    clearTimeout(autoTimer);
    clearTimeout(beispielTimer);
    if (tipp) { clearTimeout(tipp.timer); tipp = null; }
    current = null;
    strokes.length = 0;
    z.striche.forEach(st => strokes.push(st));
    rechenweg.length = 0;
    z.rechenweg.forEach(l => rechenweg.push(l));
    istBeispiel = false;
    merkeBeispiel(false);
    verwerfeErkennung();
    recompute();
    merkeStriche();
    merkeRechenweg();
    zeigeRechenweg();
    autoBald();                        // a line that came back is read again
}
// Doc, 27.09.: "bei einem Undo was in der letzten Sekunde gemacht wurde, am Stück weg, wenn ich also zwei
// kurze Striche mache, zack, zack, dann sollen die beide weggehen" - strokes each less than a second after
// the one before go back together; C, a swipe or a flight stays a step of its own. Redo brings the whole
// group back in one step (it keeps only the state before the undo).
const AM_STUECK_MS = 1000;
function rueckgaengig() {
    if (!verlauf.length) return;
    vorwaerts.push(schnappschuss());
    let ziel = verlauf.pop();
    while ((ziel.art === 'strich' || ziel.art === 'radier') && verlauf.length) {
        const davor = verlauf[verlauf.length - 1];
        if (davor.art !== ziel.art || ziel.zeit - davor.zeit > AM_STUECK_MS) break;
        ziel = verlauf.pop();
    }
    stelleHer(ziel);
}
function wiederholen() {
    if (!vorwaerts.length) return;
    verlauf.push(schnappschuss());
    stelleHer(vorwaerts.pop());
}

// The tools sit on the right rail (Doc, 26.09.: "rechts einen dunkelblauen
// Streifen, so wie das Mini-Rail ... pack die Icons auf dieses Mini-Rail"):
// rail buttons like the left ones - at the top full screen, beamer and light,
// at the foot the colours, C / undo / redo and the reload. Icons are SVG (Doc:
// never a font glyph), the C too;
// their stroke is the rail's (1.5, js/cyber-lab-overrides.css).
const WERKZEUG_ICONS = {
    // clear everything: a bin (Doc, 28.09.: "im Rail das C um in Papierkorb"), the one of js/vorrechnen-flug.js
    clear: PAPIERKORB,
    // the toggle of the row that slides out to the left: Lucide "chevrons-left" (ISC), mirrored while open
    klappe: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></g>',
    undo: '<path d="M9 13 L4.5 8.5 L9 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M4.5 8.5 H14 A5.5 5.5 0 0 1 14 19.5 H10" fill="none" stroke="currentColor" stroke-linecap="round"/>',
    redo: '<path d="M15 13 L19.5 8.5 L15 4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M19.5 8.5 H10 A5.5 5.5 0 0 0 10 19.5 H14" fill="none" stroke="currentColor" stroke-linecap="round"/>',
    // the buzzer: a QR code (Doc, 27.09.: "da wo jetzt das Fragezeichen in der Blase steht,
    // bitte den QR-Code") - the mini-rail's QR icon (js/branding/nav.js), which left the rail here
    buzzer: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"/>' +
            '<path d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"/></g>',
    // who comes to the board: a portrait, head and shoulders
    namen: '<circle cx="12" cy="8.5" r="3.75" fill="none" stroke="currentColor"/>' +
           '<path d="M4.75 20 A7.25 6.5 0 0 1 19.25 20" fill="none" stroke="currentColor" stroke-linecap="round"/>',
    // light / dark: a circle, half filled
    hell: '<circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor"/>' +
          '<path d="M12 4.5 A7.5 7.5 0 0 0 12 19.5 Z" fill="currentColor"/>',
    // full screen, as in the decks: corners out / corners in
    vollbild: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/>' +
              '<path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></g>',
    vollbildAus: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M3 8h3a2 2 0 0 0 2-2V3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>' +
              '<path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/></g>',
    // preview: a P, drawn like the C
    vorschau: '<path d="M7.5 19.5 V4.5 H12 A4.25 4.25 0 0 1 12 13 H7.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
    // the board into the plan: a tray, an arrow up out of it
    tafel: '<path d="M4 14.5 V18.5 A1.5 1.5 0 0 0 5.5 20 H18.5 A1.5 1.5 0 0 0 20 18.5 V14.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
           '<path d="M12 15.5 V4 M7.5 8.5 L12 4 L16.5 8.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
    // all tasks: a list
    aufgaben: '<path d="M9.5 6.5 H19.5 M9.5 12 H19.5 M9.5 17.5 H19.5" fill="none" stroke="currentColor" stroke-linecap="round"/>' +
              '<circle cx="5" cy="6.5" r="1.4" fill="currentColor"/><circle cx="5" cy="12" r="1.4" fill="currentColor"/>' +
              '<circle cx="5" cy="17.5" r="1.4" fill="currentColor"/>',
    // beamer: a screen on its stand
    beamer: '<rect x="3.5" y="5" width="17" height="11" rx="1.5" fill="none" stroke="currentColor"/>' +
            '<path d="M12 16 V20 M8 20 H16" fill="none" stroke="currentColor" stroke-linecap="round"/>',
    // reload: three quarters and more of a circle, the arrow on its end clockwise
    neuladen: '<path d="M19.24 14.44 A7.5 7.5 0 1 1 17.3 7.2" fill="none" stroke="currentColor" stroke-linecap="round"/>' +
              '<path d="M17.3 3.2 V7.2 H13.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>',
};
// Doc, 26.09.: "Da ich das HP jetzt so aufgestellt habe, dass die Tastatur nach
// unten liegt, kann ich kein Hard Reload mehr machen ... rechts ganz unten ein
// Hard Reload-Button" - the arrow turns while the files come fresh from the
// server (CyberUI.hardReload); the page, the working and the task stay
function neuLaden() {
    const b = document.getElementById('werkzeug-neuladen');
    if (b) b.classList.add('dreht');
    // half new, the old ui.js from the cache: at least a plain reload
    if (typeof CyberUI.hardReload === 'function') CyberUI.hardReload();
    else location.reload();
}
function railKnopf(id, text, inhalt, tun, neueGruppe, ziel) {
    const b = document.createElement('button');
    b.type = 'button';
    b.id = id;
    b.className = 'nav-btn';
    b.title = text;
    b.setAttribute('aria-label', text);
    b.style.touchAction = 'manipulation';
    if (neueGruppe) b.style.marginTop = '12px';
    b.innerHTML = inhalt;
    b.addEventListener('click', e => tun(e));
    (ziel || document.getElementById('right-rail-inner')).appendChild(b);
    return b;
}
// The row that slides out of the rail (Doc, 28.09.): placed at the rail's left edge, level with its toggle,
// each time it opens; a tap anywhere else, Esc or a new window size shut it again
function klappeOffen() {
    const l = document.getElementById('werkzeug-leiste');
    return !!l && l.classList.contains('auf');
}
function klappeAuf(an) {
    const l = document.getElementById('werkzeug-leiste'), k = document.getElementById('werkzeug-klappe');
    if (!l || !k || an === klappeOffen()) return;
    if (an) {
        const r = k.getBoundingClientRect(), rail = document.getElementById('right-rail').getBoundingClientRect();
        l.style.right = (innerWidth - rail.left) + 'px';
        l.style.top = (r.top + r.height / 2) + 'px';
    }
    l.classList.toggle('auf', an);
    k.setAttribute('aria-expanded', an ? 'true' : 'false');
    leuchte(k, an);
}
// Doc, 28.09.: "Zeigt das aber bitte nur, wenn kein Platz ist" - with room in the rail the row's buttons stand
// in it, in the toggle's place, and the toggle goes; only when they would not fit does the row slide out.
// The room is the colours' auto margin above farbe-0 (layout units: offset*, the rail's scale does not count)
function klappePlatz() {
    const inner = document.getElementById('right-rail-inner'), k = document.getElementById('werkzeug-klappe'),
          l = document.getElementById('werkzeug-leiste'), f = document.getElementById('farbe-0');
    if (!inner || !k || !l || !f) return;
    const knoepfe = ['hell', 'tafel', 'vorschau'].map(id => document.getElementById('werkzeug-' + id));
    const imRail = knoepfe[0].parentNode === inner;
    let passt;
    if (imRail) passt = inner.scrollHeight <= inner.clientHeight;
    else {
        const gap = parseFloat(getComputedStyle(inner).rowGap) || 0;
        let p = f.previousElementSibling;
        while (p && !p.offsetHeight) p = p.previousElementSibling;       // hidden ones (beamer, ...) take no room
        const frei = f.offsetTop - (p ? p.offsetTop + p.offsetHeight : f.offsetTop) - gap;
        // the visible ones need their height and a gap each, the toggle gives its own back
        const noetig = knoepfe.reduce((s, b) => s + (b.offsetHeight ? b.offsetHeight + gap : 0), 0) - k.offsetHeight - gap;
        passt = frei >= noetig;
    }
    if (passt === imRail) return;
    if (passt) klappeAuf(false);
    knoepfe.forEach(b => (passt ? inner.insertBefore(b, k) : l.appendChild(b)));
    knoepfe[0].style.marginTop = passt ? '12px' : '';                  // the group's gap, as the toggle had
    if (passt) k.style.setProperty('display', 'none', 'important');
    else k.style.removeProperty('display');
}
// the rail's scale comes a frame after the resize (js/cyber-left-chrome.js)
addEventListener('cyber-left-chrome-zoom', () => klappePlatz());
document.addEventListener('pointerdown', e => {
    if (klappeOffen() && !(e.target.closest && e.target.closest('#werkzeug-leiste, #werkzeug-klappe'))) klappeAuf(false);
}, true);
addEventListener('keydown', e => { if (e.key === 'Escape') klappeAuf(false); });
addEventListener('resize', () => klappeAuf(false));
function vollbildUmschalten() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
}
// The dot of the decks (deck.js, Doc 21.09.): orange = not extended - at the
// board that means mirrored, Win P / Cmd F1 (mirrored and "laptop alone" look
// the same to the browser); green = extended, the beamer is ready. Only where
// the browser can tell (Chrome), and not in mission control: it projects already.
const SCHIRM_BEKANNT = 'isExtended' in screen;
function zeigeVollbildKnopf() {
    const b = document.getElementById('werkzeug-vollbild');
    if (!b) return;
    const an = !!document.fullscreenElement, erweitert = SCHIRM_BEKANNT && screen.isExtended;
    const punkt = SCHIRM_BEKANNT && !STEUERUNG;
    const sig = [an, erweitert, punkt].join();
    if (b.dataset.sig !== sig) {
        b.dataset.sig = sig;
        b.style.position = 'relative';
        b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${WERKZEUG_ICONS[an ? 'vollbildAus' : 'vollbild']}</svg>` +
            (punkt ? `<span class="schirm-punkt" style="position:absolute;top:-4px;right:-4px;width:11px;height:11px;` +
                `border-radius:50%;background:${erweitert ? 'rgb(121, 158, 49)' : 'rgb(245, 194, 66)'}"></span>` : '');
        b.title = an ? 'Vollbild verlassen'
            : erweitert ? 'Vollbild – der zweite Bildschirm ist erweitert, der Beamer-Knopf ist da'
            : SCHIRM_BEKANNT ? 'Vollbild – nur ein Bildschirm: gespiegelt? Windows: Win P → Erweitern' : 'Vollbild';
    }
    leuchte(b, an);
}
// a tap on the dot says what the screens do; anywhere else on the button: full screen
function vollbildKnopf(e) {
    if (e && e.target && e.target.closest && e.target.closest('.schirm-punkt')) {
        const erweitert = screen.isExtended;
        beamerAngebot(erweitert
            ? 'Der zweite Bildschirm ist erweitert – der Beamer-Knopf in der rechten Leiste projiziert nur die Rechnung.'
            : 'Nur ein Bildschirm zu sehen. Hängt der Beamer dran, ist er gespiegelt: Windows Win P → „Erweitern“, am Mac ⌘ F1.', erweitert);
        return;
    }
    vollbildUmschalten();
}
document.addEventListener('fullscreenchange', () => zeigeWerkzeuge());
// a beamer plugged in or out, mirrored or extended: at once where the browser
// says so, and a slow look as a net (as in the decks)
if (SCHIRM_BEKANNT) {
    let zuletzt = !!screen.isExtended;
    const nochmal = () => { if (!!screen.isExtended !== zuletzt) { zuletzt = !!screen.isExtended; zeigeWerkzeuge(); } };
    if (screen.addEventListener) screen.addEventListener('change', nochmal);
    setInterval(nochmal, 2000);
}
// lit = the rail's hover look; the central rule has !important, so this too
function leuchte(b, an) {
    if (an) {
        b.style.setProperty('border-color', '#00d2ff', 'important');
        b.style.setProperty('box-shadow', '0 0 18px rgba(0, 210, 255, 0.5)', 'important');
    } else {
        b.style.removeProperty('border-color');
        b.style.removeProperty('box-shadow');
    }
}
function zeigeWerkzeuge() {
    if (!document.getElementById('right-rail-inner')) return;
    if (!document.getElementById('farbe-0')) {
        const werkzeuge = (liste, ziel) => liste.forEach(([id, text, tun, neueGruppe]) => {
            railKnopf('werkzeug-' + id, text,
                `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${WERKZEUG_ICONS[id]}</svg>`, tun, neueGruppe, ziel);
        });
        // Doc, 26.09.: "den Fullscreen-Button, den Projection-Button und den
        // Hell-Dunkel-Button ganz nach oben in dieser Leiste"
        werkzeuge([
            // Doc, 26.09.: "Fullscreen immer zeigen, auch wenn kein zweiter Bildschirm
            // dran ist, den Beamer nur, wenn ein zweiter Bildschirm wirklich dran ist"
            ['vollbild', 'Vollbild', (e) => vollbildKnopf(e), false],
            // in mission control it ends the projection
            ['beamer', STEUERUNG ? 'Beamer beenden' : 'Beamer: nur die Rechnung projizieren',
                () => { if (STEUERUNG) window.close(); else beamerStart(); }, false],
            // Doc, 26./27.09.: the anonymous "nicht verstanden" buzzer (js/buzzer.js)
            ['buzzer', 'Buzzer – „nicht verstanden“, anonym (erster Tipp: QR aufs Board)', () => buzzerKnopf(), false],
            // Doc, 27.09.: "rechts einen Button mit einem Porträt" - a name drawn (js/namen-ziehen.js)
            ['namen', 'Name ziehen – wer kommt an die Tafel (lange drücken: die Klasse)', () => namenKnopf(), false]]);
        // held down (or a right click): the panel with the class, not a draw
        if (window.Namen) Namen.knopf(document.getElementById('werkzeug-namen'), namenOpts);
        // "... die Farbknöpfe, C und Undo, Redo über den Hard Reload-Button, der
        // jetzt rechts unten ist" - the rail is a column, from the colours down
        // everything sits at its foot
        FARBEN.forEach(([name, wert], i) => {
            const b = railKnopf('farbe-' + i, 'Stift ' + name,
                `<span style="display:block;width:26px;height:26px;border-radius:50%;background:${wert};` +
                'box-shadow:0 0 0 1px rgba(255, 255, 255, 0.35)"></span>',
                () => {
                    stiftFarbe = wert;
                    setzeRadieren(false);          // a colour: the pen again
                    try { localStorage.setItem('vorrechnen-farbe', wert); } catch (_) {}
                    zeigeWerkzeuge();
                }, false);
            b.dataset.farbe = wert;
        });
        document.getElementById('farbe-0').style.marginTop = 'auto';
        // Doc, 26.09.: "rechts in das Rail einen Button unter die grüne Farbe, über
        // das C, wo ich mir alle Aufgaben in einem Panel anzeigen lassen kann"
        // Doc, 26.09.: "über dem Button der die ganzen Aufgaben anzeigt, einen Button
        // mit P" - the grey preview on / off, lit while it shows
        // Doc, 28.09.: "rechts ... ausklappbar, wo man da reinpacken hell dunkel, dann das Upload ... und P für
        // Preview auch da rein ... zur linken Seite" - the seldom ones sit in a row that slides out of the rail
        // to the left (.rail-klappe, js/cyber-lab-overrides.css); the toggle takes the P's place
        werkzeuge([
            ['klappe', 'Mehr: Hell / Dunkel, Tafel senden, Vorschau', () => klappeAuf(!klappeOffen()), true],
            ['aufgaben', 'Alle Aufgaben', () => aufgabenPanel(true), false]]);
        const kk = document.getElementById('werkzeug-klappe');
        kk.classList.add('rail-klappe-knopf');
        kk.setAttribute('aria-expanded', 'false');
        kk.setAttribute('aria-controls', 'werkzeug-leiste');
        const leiste = document.createElement('div');
        leiste.id = 'werkzeug-leiste';       // werkzeug-: hidden on the beamer with the rail's buttons
        leiste.className = 'rail-klappe';
        document.body.appendChild(leiste);
        werkzeuge([
            ['hell', 'Hell / Dunkel', () => setzeHell(!hell), false],
            // Doc, 26.09.: the working of today into the Stoffverteilungsplan, for the class
            ['tafel', 'Tafel senden – in den Stoffverteilungsplan, für alle', () => { klappeAuf(false); tafelSenden(); }, false],
            ['vorschau', 'Vorschau: der graue nächste Schritt (P)', () => {
                vorschau = !vorschau;
                try { localStorage.setItem('vorrechnen-vorschau', vorschau ? '1' : '0'); } catch (_) {}
                zeigeHinweis();
                zeigeWerkzeuge();
            }, false]], leiste);
        werkzeuge([
            // two taps again (Doc, 29.09.: "Hatte ich einstufig gesagt? Nee, ich glaub 2"): the first clears the
            // ink, the second - on the empty page - the working too; undo brings either back
            ['clear', 'Leeren – 1. Tipp die Tinte, 2. Tipp auch der Rechenweg', () => clearAll(), true],
            ['undo', 'Rückgängig', () => rueckgaengig(), false],
            ['redo', 'Wiederholen', () => wiederholen(), false],
            ['neuladen', 'Neu laden – frisch vom Server (wie Strg F5)', () => neuLaden(), true]]);
    }
    // the pen's colour is lit; white is ink on paper
    FARBEN.forEach((_, i) => {
        const b = document.getElementById('farbe-' + i), an = b.dataset.farbe === stiftFarbe;
        leuchte(b, an);
        b.setAttribute('aria-pressed', an ? 'true' : 'false');
        if (i === 0) {
            b.firstElementChild.style.background = anzeige(INK);
            b.title = hell ? 'Stift Tinte' : 'Stift Weiß';
        }
    });
    const hk = document.getElementById('werkzeug-hell');
    hk.setAttribute('aria-pressed', hell ? 'true' : 'false');
    leuchte(hk, hell);
    // in mission control the beamer button is lit: the projection runs;
    // elsewhere it only shows with a second screen, extended
    const bk = document.getElementById('werkzeug-beamer');
    if (STEUERUNG) leuchte(bk, true);
    // (the rail's buttons are display:flex !important - hiding needs it too)
    else if (SCHIRM_BEKANNT && screen.isExtended) bk.style.removeProperty('display');
    else bk.style.setProperty('display', 'none', 'important');
    zeigeVollbildKnopf();
    // the preview and the panel only where there are tasks
    ['werkzeug-vorschau', 'werkzeug-aufgaben'].forEach(id => {
        const b = document.getElementById(id);
        if (aufgabenModus) b.style.removeProperty('display');
        else b.style.setProperty('display', 'none', 'important');
    });
    const vk = document.getElementById('werkzeug-vorschau');
    vk.setAttribute('aria-pressed', vorschau ? 'true' : 'false');
    leuchte(vk, vorschau);
    // the board into the plan: in class (tasks) and free, not with the test templates
    const tk = document.getElementById('werkzeug-tafel');
    if (testModus) tk.style.setProperty('display', 'none', 'important');
    else tk.style.removeProperty('display');
    zeigeBuzzAufgabe();                // another task, mode or size: the count of that task
    klappePlatz();                     // buttons shown or hidden above: room in the rail again?
    // nothing to undo or redo: dimmed
    document.getElementById('werkzeug-undo').style.opacity = verlauf.length ? '1' : '0.35';
    document.getElementById('werkzeug-redo').style.opacity = vorwaerts.length ? '1' : '0.35';
}

// Doc: "mach bei Weiter einen left right mit Dreiecken" - back and forth.
// Without "Meine Beispiele" it steps through the tasks; a new task
// starts on a clean board.
function naechsteVorlage(schritt) {
    if (modus === 'frei') return;
    if (aufgabenModus) {                // within the task's block, round and round
        const b = aufgabenBlock(aufgabeIdx), n = b.bis - b.ab;
        zeigeAufgabe(b.ab + ((aufgabeIdx - b.ab + (schritt === -1 ? -1 : 1)) % n + n) % n);
        return;
    }
    const n = VORLAGEN.length;
    vorlageIdx = (vorlageIdx + (schritt === -1 ? -1 : 1) + n) % n;
    try { localStorage.setItem('vorrechnen-vorlage', String(vorlageIdx)); } catch (_) {}
    clearAll();
    vergissVerlauf();
    zeigeVorlage();
    setProbeStatus('–');
    if (testModus) beispiel();
}
// a task by its number: the triangles, the arrow keys and the list of all tasks
function zeigeAufgabe(i) {
    const n = AUFGABEN.length;
    // a task computed scrolls up and is kept, the next fades in (rechenwegHochScrollen)
    const wechsel = rechenweg.length > 0 && !anzeigeModus;
    verlaufZurueck();
    if (wechsel) { rechenwegArchivieren(); rechenwegHochScrollen(); }
    aufgabeIdx = ((i % n) + n) % n;
    if (typeof pilleNull === 'function') pilleNull();          // the buzzer's pill starts at 0 (js/vorrechnen-klasse.js)
    merkeAufgabe();
    flugAbbrechen();
    rechenweg.length = 0;
    merkeRechenweg();
    clearAll();
    vergissVerlauf();          // undo must not bring the last task's ink onto this one
    zeigeVorlage();
    if (wechsel) aufgabeEinblenden();
}
// Doc, 29.09.: "Oben rechts steht ja Level 1. Wenn ich da auf Level 1 klicke ... ein Pop-up ..., wo ich alle Levels
// sehe und auswählen kann, direkt hier ... im Vorrechenmodus". The block's name sits in the head layer, which the
// beamer mirrors - so a clear button of Doc's own lies over it (placed by zeigeRechenweg), and a small menu of all
// blocks opens right under it: each with its number of tasks, the current one marked; a tap goes to a block's first
// task. A tap elsewhere or Escape closes it.
function levelKnopf(block) {
    let k = document.getElementById('level-knopf');
    if (!block || anzeigeModus) { if (k) k.style.display = 'none'; levelMenue(false); return; }
    if (!k) {
        k = document.createElement('button');
        k.id = 'level-knopf';
        k.type = 'button';
        k.title = 'Level wählen';
        k.setAttribute('aria-label', 'Level wählen');
        k.addEventListener('click', () => { k.blur(); levelMenue(!document.querySelector('#level-menue.offen')); });
        container.appendChild(k);
    }
    const c = container.getBoundingClientRect(), r = block.getBoundingClientRect();
    Object.assign(k.style, { left: (r.left - c.left - 8) + 'px', top: (r.top - c.top - 8) + 'px',
        width: (r.width + 16) + 'px', height: (r.height + 16) + 'px', display: '' });
}
function levelMenue(auf) {
    let m = document.getElementById('level-menue');
    if (!auf) { if (m) m.classList.remove('offen'); return; }
    if (!m) {
        m = document.createElement('div');
        m.id = 'level-menue';
        m.setAttribute('role', 'menu');
        container.appendChild(m);
        document.addEventListener('pointerdown', e => {
            if (m.classList.contains('offen') && !m.contains(e.target) && e.target.id !== 'level-knopf') levelMenue(false);
        }, true);
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('offen')) levelMenue(false); });
    }
    const jetzt = aufgabenBlock(aufgabeIdx);
    m.textContent = '';
    BLOECKE.forEach(blk => {
        const b = document.createElement('button'), n = blk.bis - blk.ab;
        b.type = 'button';
        b.setAttribute('role', 'menuitem');
        b.classList.toggle('aktuell', blk === jetzt);
        b.innerHTML = `<span class="lm-titel"></span><span class="lm-zahl">${n} Aufgabe${n === 1 ? '' : 'n'}</span>`;
        b.firstChild.textContent = blk.titel;
        b.addEventListener('click', () => {
            levelMenue(false);
            if (blk !== jetzt) zeigeAufgabe(blk.ab);
        });
        m.appendChild(b);
    });
    // right under the block's name, flush with its right edge
    const k = document.getElementById('level-knopf'), c = container.getBoundingClientRect(), r = k.getBoundingClientRect();
    Object.assign(m.style, { right: (c.right - r.right + 8) + 'px', top: (r.bottom - c.top) + 'px' });
    m.classList.add('offen');
}
// All tasks in one panel (Doc, 26.09.), for Doc only: a tap on one goes there.
// The look is the central modal (ui.js: .cyber-overlay, .cyber-modal--wide,
// .cyber-modal-x). Night: "die Kacheln sind schön, aber zu groß ... flacher ...
// Aufgaben oben drüber weglassen ... nach x gefällt mir nicht ... Schließen oben
// rechts klein ... im hellen Modus hell, mit blauer Schrift wie Tinte" - a tile is
// its number and its formula; what to solve for is coloured in the formula itself:
// Doc's orange on the dark board, his red on sand (orange is too pale there)
// what is solved for, coloured: Doc's orange on the dark board, his red on sand (one rule for the task
// panel and the task on the board - Doc, 27.09.: "das x in der Aufgabe auch entsprechend rot")
function variablenFarbe() { return hell ? '#B02418' : '#F5C242'; }
function hebeVariable(latex, v, farbe) {
    const farbig = `{\\textcolor{${farbe}}{${v}}}`;            // a group of its own: 2^x, (...)^n
    // a variable with an index (R_1, T_2, r_i) as a whole, a letter as a token of its own
    if (v.length > 1) return latex.split(v).join(farbig);
    return latex.replace(/\\[a-zA-Z]+|./g, t => t === v ? farbig : t);
}
// Doc, 01.10. in class: "Jeder click dauert sehr lange ... auch die formeln hochzuschieben" - once opened, the
// panel's 758 formulas (61,000 nodes) stayed in the page and every measuring on the board paid for them, hidden
// or not: picking a task 270 ms instead of 35 (measured). Closed, it now leaves the page after its fade and
// is kept here, set and fitted, for the next opening.
let akOverlay = null, akWeg = null;
// Doc, 02.10.2026: one tab per block had grown to 41, the newest far out of sight at the right ("die Tab-Leiste ... müssen
// wir irgendwie reorganisieren ... zu den Wochen zwischen den Ferien"; the idea agreed: "Machen, toll"). The pages of
// the panel now: Sammlungen - every block without a week, in load order - and one page per stretch of school weeks
// between two holidays. The stretches are read from the gaps in the blocks' weeks (WOCHEN), so there is no second
// list of the holidays; a page is named after the holidays that end it, the last one "bis Sommer". On a page every
// block is a section: its heading, its tiles under it. [{ titel, hinweis, bloecke: [block index] }]
const FERIEN_NACH_KW = [[40, 45, 'Herbst'], [50, 53, 'Weihnachten'], [1, 1, 'Weihnachten'], [5, 9, 'Winter'], [10, 17, 'Ostern']];
function schulRang(kw) { return kw >= 31 ? kw - 31 : kw + 22; }      // the school year starts in August
function aufgabenSeiten() {
    const ohne = [], wochen = [];
    BLOECKE.forEach((b, k) => (b.kw === undefined ? ohne : wochen).push(k));
    wochen.sort((a, b) => schulRang(BLOECKE[a].kw) - schulRang(BLOECKE[b].kw));
    const seiten = ohne.length ? [{ titel: 'Sammlungen', hinweis: 'Alle Blöcke ohne Woche', bloecke: ohne }] : [];
    let lauf = [];
    const abschliessen = letzte => {
        const von = BLOECKE[lauf[0]].kw, bis = BLOECKE[lauf[lauf.length - 1]].kw, frei = bis % 53 + 1;
        const ferien = letzte ? 'Sommer' : (FERIEN_NACH_KW.find(([a, b]) => frei >= a && frei <= b) || [])[2];
        const kws = 'KW ' + von + (bis !== von ? '–' + bis : '');
        seiten.push({ titel: ferien ? 'bis ' + ferien : kws, hinweis: kws, bloecke: lauf });
        lauf = [];
    };
    wochen.forEach((k, n) => {
        if (lauf.length && schulRang(BLOECKE[k].kw) - schulRang(BLOECKE[lauf[lauf.length - 1]].kw) > 1) abschliessen(false);
        lauf.push(k);
        if (n === wochen.length - 1) abschliessen(true);
    });
    return seiten;
}
let akSeiten = [];
function aufgabenPanel(auf, sofort = false) {
    let o = akOverlay;
    clearTimeout(akWeg);
    if (!auf) {
        if (o) {
            o.classList.remove('open');
            delete o.dataset.auf;
            if (sofort) o.remove();                                       // a task picked: no fade, the board is new anyway
            else akWeg = setTimeout(() => { if (!o.dataset.auf) o.remove(); }, 350);     // after the fade (ui.js: 0.3s)
        }
        return;
    }
    if (!o) {
        o = document.createElement('div');
        o.id = 'aufgaben-overlay';
        o.className = 'cyber-overlay';
        o.innerHTML = '<div class="cyber-modal cyber-modal--neon cyber-modal--wide" role="dialog" aria-label="Alle Aufgaben">' +
            '<button type="button" class="cyber-modal-x" title="Schließen" aria-label="Schließen">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" fill="none"' +
            ' stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
            '<div class="ak-tabs" role="tablist" aria-label="Blöcke"></div><div class="ak-buehne"></div></div>';
        o.addEventListener('click', e => { if (e.target === o) aufgabenPanel(false); });
        o.querySelector('.cyber-modal-x').addEventListener('click', () => aufgabenPanel(false));
        // Doc, 30.09.: "mach mal den Overview mit Tabs" - one tab per block, its grid the page under it (was: every
        // block's grid under its small title, one below the other); a tile counts within its block
        const tabs = o.querySelector('.ak-tabs'), buehne = o.querySelector('.ak-buehne');
        // Doc, 01.10.: "Wiedervorlage nach Verstandengrad!" - the first tab (index -1): every task the class did not
        // understand, from the buzzer's history (feedbackUebersicht, js/vorrechnen-klasse.js); a row brings it back
        const wvTab = document.createElement('button');
        wvTab.type = 'button';
        wvTab.className = 'ak-tab';
        wvTab.id = 'ak-tab-wv';
        wvTab.textContent = 'Wiederholung';                   // Doc, 01.10.: "Wiederholung bitte"
        wvTab.setAttribute('role', 'tab');
        wvTab.setAttribute('aria-controls', 'ak-seite-wv');
        wvTab.addEventListener('click', () => aufgabenTab(-1));
        const wv = document.createElement('div');
        wv.className = 'ak-wv';
        wv.id = 'ak-seite-wv';
        wv.hidden = true;
        wv.setAttribute('role', 'tabpanel');
        wv.setAttribute('aria-labelledby', wvTab.id);
        tabs.appendChild(wvTab);
        buehne.appendChild(wv);
        akSeiten = aufgabenSeiten();
        akSeiten.forEach((s, k) => {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'ak-tab';
            tab.id = 'ak-tab-' + k;
            tab.textContent = s.titel;
            tab.title = s.hinweis;
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', 'ak-seite-' + k);
            tab.addEventListener('click', () => aufgabenTab(k));
            const seite = document.createElement('div');
            seite.className = 'ak-seite';
            seite.id = 'ak-seite-' + k;
            seite.setAttribute('role', 'tabpanel');
            seite.setAttribute('aria-labelledby', tab.id);
            s.bloecke.forEach(n => {
                const blk = BLOECKE[n];
                // the block's heading: a week's with its calendar week in front, "KW 44 · Wachstum und Zerfall · ..."
                const kopf = document.createElement('h3');
                kopf.className = 'ak-kopf';
                kopf.id = 'ak-block-' + n;
                if (blk.kw !== undefined) {
                    const kw = document.createElement('span');
                    kw.className = 'ak-kw';
                    kw.textContent = 'KW ' + blk.kw;
                    kopf.append(kw, ' · ');
                }
                kopf.append(blk.titel);
                const liste = document.createElement('div');
                liste.className = 'aufgaben-liste';
                for (let i = blk.ab; i < blk.bis; i++) {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'aufgabe-karte';
                    b.dataset.i = String(i);
                    b.innerHTML = `<span class="ak-nr">${i - blk.ab + 1}</span><span class="ak-formel"></span>`;
                    b.addEventListener('click', () => { aufgabenPanel(false, true); zeigeAufgabe(i); });     // out first: the board measures
                    liste.appendChild(b);
                }
                seite.append(kopf, liste);
            });
            tabs.appendChild(tab);
            buehne.appendChild(seite);
        });
        akOverlay = o;
    }
    if (!o.isConnected) document.body.appendChild(o);
    // light or dark like the board; the formulas are set again for their colour, and
    // one line each: a long one shrinks to its tile (the overlay is laid out while hidden).
    // Every page is shown for that, and measured: the stage keeps the tallest page's height, so the
    // modal does not jump (it is centred) and the tabs stay under the finger from page to page
    // Doc, 01.10.: the HP froze for half a minute and more on opening it - every one of the 758 tiles was set
    // anew on every opening and measured right after its own write, so the browser laid out the whole panel
    // 758 times. Now the formulas are set once and kept (again only for the other colour), and fitted in one
    // layout (again when the window's size changes, and once more when KaTeX's fonts have come in).
    o.classList.toggle('hell', hell);
    o.dataset.auf = '1';                                          // open from here on: another o does not start it again
    const farbe = variablenFarbe(), mass = innerWidth + 'x' + innerHeight;
    if (o.dataset.farbe !== farbe) {
        o.querySelectorAll('.aufgabe-karte').forEach(b => {
            const [, latex, nach] = AUFGABEN[+b.dataset.i], f = b.querySelector('.ak-formel');
            try { katex.render(alsDisplay(hebeVariable(latex, nach, farbe)), f, { throwOnError: false }); }
            catch (e) { f.textContent = latex; }
        });
        o.dataset.farbe = farbe;
        o.dataset.mass = '';
    }
    if (o.dataset.mass !== mass) {
        aufgabenEinpassen(o);
        o.dataset.mass = mass;
        // a font KaTeX asked for only now measures wrong until it is there
        if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => aufgabenEinpassen(o));
    }
    o.querySelectorAll('.aufgabe-karte').forEach(b => b.classList.toggle('aktuell', +b.dataset.i === aufgabeIdx));
    // it opens at the block of the task on the board: on that block's page, scrolled to its heading
    const n = BLOECKE.indexOf(aufgabenBlock(aufgabeIdx));
    aufgabenTab(Math.max(0, akSeiten.findIndex(s => s.bloecke.indexOf(n) >= 0)));
    const kopf = o.querySelector('#ak-block-' + n);
    if (kopf) o.querySelector('.ak-buehne').scrollTop = kopf.offsetTop - 2;          // the stage scrolls, the tabs stay
    requestAnimationFrame(() => { if (o.dataset.auf) o.classList.add('open'); });      // not when closed before the frame
    wiedervorlageLaden(o);                                        // the history comes after: the table and the tiles' counts
}
// every page shown for a moment and measured in ONE layout: the widths read first, then the sizes written (a long
// formula shrinks to its tile as passeEin does, basis 1.3rem); the stage keeps the tallest page's height
function aufgabenEinpassen(o) {
    if (!o.isConnected) { o.dataset.mass = ''; return; }          // closed meanwhile: fitted at the next opening
    const seiten = [...o.querySelectorAll('.ak-seite')], buehne = o.querySelector('.ak-buehne');
    const versteckt = seiten.map(s => s.hidden);
    const karten = [...o.querySelectorAll('.aufgabe-karte')], formeln = karten.map(b => b.querySelector('.ak-formel'));
    seiten.forEach(s => { s.hidden = false; });
    buehne.style.minHeight = '';
    formeln.forEach(f => { f.style.fontSize = ''; });
    const masse = karten.map((b, n) => [b.clientWidth - 24, formeln[n].getBoundingClientRect().width]);
    masse.forEach(([frei, breit], n) => { if (frei > 0 && breit > frei) formeln[n].style.fontSize = (1.3 * frei / breit).toFixed(3) + 'rem'; });
    // a page of 13 weeks is far taller than the screen: the stage keeps the tallest page's height only up to what the
    // modal shows at most (92vh, ui.js), so a short page does not scroll into empty space
    const modal = o.querySelector('.cyber-modal'), stil = getComputedStyle(modal);
    const rand = parseFloat(stil.paddingTop) + parseFloat(stil.paddingBottom) + parseFloat(stil.borderTopWidth) +
        parseFloat(stil.borderBottomWidth) + o.querySelector('.ak-tabs').offsetHeight + 16;     // the tabs' margin below
    buehne.style.minHeight = Math.min(Math.max(...seiten.map(s => s.offsetHeight)), innerHeight * 0.92 - rand) + 'px';
    seiten.forEach((s, n) => { s.hidden = versteckt[n]; });
}
// one tab of the panel: its page shows, the others hide; ← → step through them while the panel is open.
// -1 is the Wiedervorlage, the first tab
function aufgabenTab(k) {
    const o = akOverlay;
    if (!o || !o.isConnected) return;
    k = Math.max(-1, Math.min(akSeiten.length - 1, k));
    o.dataset.tab = String(k);
    o.querySelectorAll('.ak-tab').forEach((t, j) => {
        const an = j === k + 1;
        t.classList.toggle('aktiv', an);
        t.setAttribute('aria-selected', String(an));
        t.tabIndex = an ? 0 : -1;
    });
    o.querySelector('.ak-wv').hidden = k !== -1;
    o.querySelectorAll('.ak-seite').forEach((s, j) => { s.hidden = j !== k; });
    o.querySelector('.ak-buehne').scrollTop = 0;
    o.querySelector(k === -1 ? '#ak-tab-wv' : '#ak-tab-' + k).scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (k === -1) wiedervorlageEinpassen(o);
}

// ── Wiedervorlage ───────────────────────────────────────────────────
// Verstandengrad = the share of a task's "nicht verstanden" that a "verstanden" answered later (0 to 1); the
// colour runs from Doc's red (nothing understood) over his orange to his green. Sorted by a tap on a column's
// head; at first by the Verstandengrad, the least understood first, then by the number of questions.
let wvDaten = null, wvSortierung = { spalte: 'grad', auf: true };
// on the phone the two counts' heads are the buzzer's own signs (buzzer.html): its question mark and its tick
const WV_FRAGE = '<svg class="wv-zeichen" viewBox="0 0 24 24" aria-label="nicht verstanden" role="img"><path d="M8.2 8.6 A3.9 3.9 0 1 1' +
    ' 13.6 12.2 C12.6 12.8 12 13.6 12 14.8 V15.6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"' +
    ' stroke-linejoin="round"/><circle cx="12" cy="19.6" r="1.5" fill="currentColor"/></svg>';
const WV_HAKEN = '<svg class="wv-zeichen" viewBox="0 0 24 24" aria-label="verstanden" role="img"><path d="M4.8 12.8 L9.8 17.6 L19.2 6.8"' +
    ' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const WV_SPALTEN = [['aufgabe', 'Aufgabe', 'Aufgabe'], ['nicht', 'Nicht verstanden', WV_FRAGE],
    ['verstanden', 'Verstanden', WV_HAKEN], ['grad', 'Verstandengrad', 'Grad'], ['zuletzt', 'Zuletzt', 'Zuletzt']];
function gradFarbe(g) {
    const ROT = [176, 36, 24], ORANGE = [245, 194, 66], GRUEN = [121, 158, 49];
    const mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
    return 'rgb(' + (g <= 0.5 ? mix(ROT, ORANGE, g * 2) : mix(ORANGE, GRUEN, (g - 0.5) * 2)).join(', ') + ')';
}
// Doc, 02.10.2026: the number of "nicht verstanden" in the table as a pill in its colour - "alles, was über 20 ist, ist
// rot": green for a single question, orange at 10, red from 20 on, the same three colours as the Verstandengrad
const WV_ROT_AB = 20;
function anzahlFarbe(n) { return gradFarbe(1 - Math.min(n, WV_ROT_AB) / WV_ROT_AB); }
async function wiedervorlageLaden(o) {
    const seite = o.querySelector('.ak-wv');
    if (!wvDaten) seite.innerHTML = '<p class="wv-hinweis">Lade das Feedback …</p>';
    const { proAufgabe, wolke } = await feedbackUebersicht();          // js/vorrechnen-klasse.js
    const index = new Map(AUFGABEN.map((a, i) => [a[0], i]));
    wvDaten = { wolke, zeilen: [...proAufgabe].map(([key, a]) => Object.assign({ key, i: index.has(key) ? index.get(key) : -1,
        grad: a.nicht ? a.verstanden / a.nicht : 1 }, a)) };
    if (akOverlay !== o) return;
    // every tile with a history carries its number of questions, coloured by its Verstandengrad
    const proKey = new Map(wvDaten.zeilen.map(z => [z.key, z]));
    o.querySelectorAll('.aufgabe-karte').forEach(b => {
        const z = proKey.get(AUFGABEN[+b.dataset.i][0]);
        let el = b.querySelector('.ak-wv-zahl');
        if (!z) { if (el) el.remove(); return; }
        if (!el) { el = document.createElement('span'); el.className = 'ak-wv-zahl'; b.appendChild(el); }
        el.textContent = String(z.nicht);
        el.style.background = gradFarbe(z.grad);
        el.title = z.nicht + ' × nicht verstanden, ' + z.verstanden + ' × danach verstanden';
    });
    wiedervorlageTabelle(o);
}
function wiedervorlageTabelle(o) {
    const seite = o.querySelector('.ak-wv');
    if (!wvDaten) return;
    seite.textContent = '';
    if (!wvDaten.zeilen.length) {
        seite.innerHTML = '<p class="wv-hinweis">Noch kein Feedback – sobald jemand „nicht verstanden“ drückt, steht die Aufgabe hier.</p>';
    } else {
        const { spalte, auf } = wvSortierung, r = auf ? 1 : -1;
        const wert = z => spalte === 'aufgabe' ? (z.i < 0 ? 1e9 : z.i) : z[spalte];
        const zeilen = wvDaten.zeilen.slice().sort((a, b) => r * (wert(a) - wert(b)) || b.nicht - a.nicht || a.i - b.i);
        const tabelle = document.createElement('div');
        tabelle.className = 'wv-tabelle';
        tabelle.setAttribute('role', 'table');
        const kopf = document.createElement('div');
        kopf.className = 'wv-kopf';
        kopf.setAttribute('role', 'row');
        WV_SPALTEN.forEach(([s, lang, kurz]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'wv-spalte wv-s-' + s;
            b.setAttribute('role', 'columnheader');
            if (s === spalte) b.setAttribute('aria-sort', auf ? 'ascending' : 'descending');
            // Doc, 02.10.2026: "Mach bitte, dass ich nach nicht verstanden, verstanden auch sortieren kann" - every head
            // sorted already, but only the active one showed it. Then: "die Pfeile sind zu klein ... mach daraus bitte
            // ein Dreieck. Und bei den anderen auch ein Dreieck und nur eins" - one filled triangle on every head: up
            // ascending, down descending; pale on the others, pointing the way their first tap sorts
            const hoch = s === spalte ? auf : s === 'grad' || s === 'aufgabe';
            b.innerHTML = '<span class="wv-lang"></span><span class="wv-kurz"></span>' +
                '<svg class="wv-dreieck' + (s === spalte ? '' : ' wv-sortierbar') + '" viewBox="0 0 12 10" aria-hidden="true" ' +
                'focusable="false"><path d="' + (hoch ? 'M1 9 L6 1 L11 9 Z' : 'M1 1 L6 9 L11 1 Z') + '" fill="currentColor"/></svg>';
            b.children[0].textContent = lang;
            if (kurz.startsWith('<svg')) b.children[1].innerHTML = kurz; else b.children[1].textContent = kurz;
            // a column tapped again turns round; a new one starts with what matters: few understood, many questions, the newest
            b.addEventListener('click', () => {
                wvSortierung = s === spalte ? { spalte, auf: !auf } : { spalte: s, auf: hoch };
                wiedervorlageTabelle(o);
            });
            kopf.appendChild(b);
        });
        tabelle.appendChild(kopf);
        const farbe = variablenFarbe();
        zeilen.forEach(z => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'wv-zeile';
            b.setAttribute('role', 'row');
            b.disabled = z.i < 0;                                       // a task no longer in the lab: its key only
            const blk = z.i < 0 ? null : aufgabenBlock(z.i);
            // where most of the questions came: the task itself or the row (k) of the working
            const [meist] = Object.entries(z.schritte).sort((x, y) => y[1] - x[1]);
            const wo = meist && Object.keys(z.schritte).length > 1 || meist && +meist[0] > 0
                ? ' · meist bei ' + (+meist[0] === 0 ? 'der Aufgabe' : '(' + meist[0] + ')') : '';
            const datum = new Date(z.zuletzt);
            b.innerHTML = '<span class="wv-aufgabe" role="cell"><span class="wv-block"></span><span class="wv-formel"></span></span>' +
                '<span class="wv-zahl wv-nicht" role="cell"></span><span class="wv-zahl wv-verstanden" role="cell"></span>' +
                '<span class="wv-grad" role="cell"><span class="wv-balken"><i></i></span><span class="wv-prozent"></span></span>' +
                '<span class="wv-zuletzt" role="cell"></span>';
            b.querySelector('.wv-block').textContent = blk ? blk.titel + ' · ' + (z.i - blk.ab + 1) + wo : z.key;
            const f = b.querySelector('.wv-formel');
            if (z.i >= 0) {
                const [, latex, nach] = AUFGABEN[z.i];
                try { katex.render(alsDisplay(hebeVariable(latex, nach, farbe)), f, { throwOnError: false }); }
                catch (e) { f.textContent = latex; }
            }
            const pille = document.createElement('span');
            pille.className = 'wv-pille';
            pille.textContent = String(z.nicht);
            pille.style.background = anzahlFarbe(z.nicht);
            b.querySelector('.wv-nicht').appendChild(pille);
            b.querySelector('.wv-verstanden').textContent = String(z.verstanden);
            const balken = b.querySelector('.wv-balken i');
            balken.style.width = Math.round(z.grad * 100) + '%';
            balken.style.background = gradFarbe(z.grad);
            b.querySelector('.wv-prozent').textContent = Math.round(z.grad * 100) + ' %';
            b.querySelector('.wv-zuletzt').textContent = z.zuletzt
                ? String(datum.getDate()).padStart(2, '0') + '.' + String(datum.getMonth() + 1).padStart(2, '0') + '.' : '';
            if (z.i >= 0) b.addEventListener('click', () => { aufgabenPanel(false, true); zeigeAufgabe(z.i); });
            // Doc, 01.10.: "rechts ein x" - off the list (feedbackErledigt, js/vorrechnen-klasse.js); beside the row,
            // not in it - a button holds no button. The row goes at once, the cloud follows.
            const reihe = document.createElement('div');
            reihe.className = 'wv-reihe';
            const weg = document.createElement('button');
            weg.type = 'button';
            weg.className = 'wv-weg';
            weg.title = 'Aus der Wiederholung nehmen – ein neues „nicht verstanden“ bringt sie zurück';
            weg.setAttribute('aria-label', 'Aus der Wiederholung nehmen');
            weg.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" fill="none"' +
                ' stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
            weg.addEventListener('click', () => {
                feedbackErledigt(z.key);
                wvDaten.zeilen = wvDaten.zeilen.filter(w => w.key !== z.key);
                o.querySelectorAll('.aufgabe-karte').forEach(k => {      // its tile loses its number of questions
                    if (AUFGABEN[+k.dataset.i][0] === z.key) { const el = k.querySelector('.ak-wv-zahl'); if (el) el.remove(); }
                });
                wiedervorlageTabelle(o);
            });
            reihe.append(b, weg);
            tabelle.appendChild(reihe);
        });
        seite.appendChild(tabelle);
    }
    if (!wvDaten.wolke) {
        const p = document.createElement('p');
        p.className = 'wv-hinweis';
        p.textContent = 'Nur der Verlauf dieses Geräts – die Cloud war nicht erreichbar (im Stoffverteilungsplan angemeldet?).';
        seite.appendChild(p);
    }
    wiedervorlageEinpassen(o);
}
// a long formula shrinks to its cell - all widths read in one layout, then the sizes written; only while it shows
function wiedervorlageEinpassen(o) {
    const seite = o.querySelector('.ak-wv');
    if (!seite || seite.hidden || !o.isConnected) return;
    const formeln = [...seite.querySelectorAll('.wv-formel')];
    formeln.forEach(f => { f.style.fontSize = ''; });
    const masse = formeln.map(f => [f.parentElement.clientWidth, f.getBoundingClientRect().width]);
    masse.forEach(([frei, breit], n) => { if (frei > 0 && breit > frei) formeln[n].style.fontSize = (1.15 * frei / breit).toFixed(3) + 'rem'; });
    // Doc, 02.10.2026: "mach bitte die Boxen alle gleich groß. Also so groß wie die größte. Sonst springt das" - a row
    // with a fraction stood taller than one without, and a new sorting moved every row below it; now every row is as
    // tall as the tallest (measured once the formulas are fitted)
    const zeilen = [...seite.querySelectorAll('.wv-zeile')];
    zeilen.forEach(z => { z.style.minHeight = ''; });
    const hoehe = Math.max(0, ...zeilen.map(z => z.offsetHeight));
    zeilen.forEach(z => { z.style.minHeight = hoehe + 'px'; });
}
// Doc, 26.09.: "left arrow key & right arrow key" - the arrow keys step like
// ◀ ▶. A tapped button, slider or radio keeps the focus: it lets go first, so
// no focus ring turns up ("bitte keine selects") and a radio does not switch
// the mode. Text fields keep their keys; holding a key does not race on.
// Doc, 29.09.: the arrow bottom left "auf arrow up" - ↑ sends the next grey step up like that button;
// ↓ takes the newest row back (vorschauRunter, 30.09.: "arrow down einen Schritt zurück").
// Doc, 30.09.: "gib mir auf key o den Overview" - o opens the panel with all tasks like its button in the
// rail, in every mode; o again closes it. Not while another dialog (buzzer, Tafel, names) is open.
document.addEventListener('keydown', e => {
    const o = (e.key === 'o' || e.key === 'O') && !e.repeat && !e.altKey && !e.ctrlKey && !e.metaKey;
    const panel = document.querySelector('#aufgaben-overlay[data-auf]');      // open, or opening (the class comes a frame later)
    if (panel) {
        if (e.key === 'Escape' || o) aufgabenPanel(false);
        else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.repeat) {
            e.preventDefault();
            aufgabenTab(+panel.dataset.tab + (e.key === 'ArrowLeft' ? -1 : 1));
        }
        return;
    }
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && !o) return;
    if (anzeigeModus || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!o && (modus === 'frei' || e.shiftKey)) return;
    if (o && document.querySelector('.cyber-overlay.open')) return;
    const f = document.activeElement;
    if (f && (f.isContentEditable || f.tagName === 'TEXTAREA' || f.tagName === 'SELECT' ||
        (f.tagName === 'INPUT' && !/^(range|checkbox|radio|button)$/.test(f.type)))) return;
    e.preventDefault();
    if (f && f !== document.body && typeof f.blur === 'function') f.blur();
    if (o) { aufgabenPanel(true); return; }
    if (e.key === 'ArrowUp') { vorschauHoch(); return; }
    if (e.key === 'ArrowDown') { vorschauRunter(); return; }
    naechsteVorlage(e.key === 'ArrowLeft' ? -1 : 1);
});
