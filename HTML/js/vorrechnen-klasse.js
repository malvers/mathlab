// Vorrechnen (vorrechnen.html), part 6 of 12: the buzzer and drawing a name.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// Doc, 26.09. night: "Ich würde den Kindern gerne einen Buzzer geben ... dass ich nur sehe, vorne bei mir ...
// dass irgendjemand gesagt hat, er versteht das nie" - 27.09.: "mach mal für allgemein ... aber jetzt für vorr".
// The buzzer is central (js/buzzer.js, buzzer.html); here only its button on the rail. The first tap listens
// and puts the QR on the board (on the beamer as a twin); a buzz lights the button orange with its count and
// the screen's edge glows once - the rail and the glow never reach the beamer; a tap then means "seen".
// Which task was on the board when a buzz came is kept on this device (vorrechnen-buzzer), for later.
function buzzLog() {
    try { const l = JSON.parse(localStorage.getItem('vorrechnen-buzzer') || '[]'); return Array.isArray(l) ? l : []; }
    catch (_) { return []; }
}
// one entry per buzz (by its id): which task was on the board, with today's code - a reload that brings
// the unseen ones back does not count them twice, and only a really new one makes the edge glow
function buzzerMeldung(n, neu, frisch = []) {
    if (anzeigeModus) return;                        // the beamer window never shows it
    // Doc, 27.09.: the count on the QR button "weg bitte und auch nicht gelb, denn wir haben ja die Pille
    // rechts oben" - the rail button stays plain (Buzzer.markiere is not used here)
    const log = buzzLog(), bekannt = new Set(log.map(e => e.id));
    const neue = frisch.filter(id => !bekannt.has(id));
    if (neue.length) {
        // no glow along the edge any more (Doc, 27.09.: "so einen kurzen Flash ... in Gelb bitte nicht
        // machen") - the pill alone tells it; Buzzer.blitz() stays in js/buzzer.js for other pages
        // the step on the board: 0 = the task itself, k = the k-th line of the working
        const aufgabe = aufgabenModus ? AUFGABEN[aufgabeIdx][0] : null, code = Buzzer.code(), schritt = rechenweg.length;
        neue.forEach(id => log.push({ id, zeit: Date.now(), code, aufgabe, schritt }));
        try { localStorage.setItem('vorrechnen-buzzer', JSON.stringify(log.slice(-500))); } catch (_) {}
    }
    zeigeBuzzAufgabe();
}
// Doc, 27.09.: first "in die erste Zeile ... ein Icon ... wie viele gebuzzert haben ... pro Aufgabe", then
// "eigentlich müsste ja die Pille pro Rechenschritt erscheinen ... wenn der nächste Schritt kommt, kommt
// die einfach dahinter und ist wieder null", "am rechten Rand" - one pill at the board's right edge on the
// newest row's height (the task's before the first step), counting the buzzes of that step (today, this
// code). For Doc only: no mirrored layer,
// so it never reaches the beamer; hidden while the finished tasks are pulled down.
function zeigeBuzzAufgabe() {
    let el = document.getElementById('buzz-aufgabe');
    const schritt = rechenweg.length;
    const zellen = [...document.querySelectorAll(`#rechenweg-schicht [data-schritt="${schritt ? schritt - 1 : 'aufgabe'}"] .katex-html`)];
    if (anzeigeModus || !aufgabenModus || !window.Buzzer || !Buzzer.aktiv() || verlaufY > 0 || !zellen.length) {
        if (el) el.style.display = 'none';
        return;
    }
    if (!el) {
        el = document.createElement('div');
        el.id = 'buzz-aufgabe';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<span></span>';
        container.appendChild(el);
    }
    const heute = new Date().toDateString(), key = AUFGABEN[aufgabeIdx][0], code = Buzzer.code();
    const n = buzzLog().filter(e => e.aufgabe === key && e.schritt === schritt && e.code === code &&
        new Date(e.zeit).toDateString() === heute).length;
    el.lastElementChild.textContent = String(n);
    // Doc, 27.09.: "grün, wenn null gebuzzert haben, und rot, wenn zwanzig ... Sind immer zwanzig in der
    // Klasse. Also unser üblicher Farbverlauf" - green, orange at ten, red from twenty on (the palette)
    const t = Math.min(1, n / 20), mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
    const GRUEN = [121, 158, 49], ORANGE = [245, 194, 66], ROT = [176, 36, 24];
    const c = t <= 0.5 ? mix(GRUEN, ORANGE, t * 2) : mix(ORANGE, ROT, (t - 0.5) * 2);
    el.style.background = `rgb(${c.join(', ')})`;
    el.style.color = t > 0.7 ? '#fff' : '#0b1a33';
    el.title = n === 1 ? '1 × nicht verstanden bei diesem Schritt' : n + ' × nicht verstanden bei diesem Schritt';
    // right behind the row's ink, on its middle
    const c0 = container.getBoundingClientRect();
    let rechts = -Infinity, oben = Infinity, unten = -Infinity;
    zellen.forEach(z => {
        const r = z.getBoundingClientRect();
        if (r.width) { rechts = Math.max(rechts, r.right); oben = Math.min(oben, r.top); unten = Math.max(unten, r.bottom); }
    });
    if (!isFinite(rechts)) { el.style.display = 'none'; return; }
    // Doc, 27.09.: "macht das bitte am rechten Rand" - on the step's height, at the board's right edge;
    // "wenn dann Bruch steht ... auf Y zentriert auf den Bruchstrich" - with a fraction in the row its bar
    // (the widest, the main one) is the middle, else the middle of the ink
    let mitte = (oben + unten) / 2, breit = 0;
    document.querySelectorAll(`#rechenweg-schicht [data-schritt="${schritt ? schritt - 1 : 'aufgabe'}"] .frac-line`).forEach(f => {
        const r = f.getBoundingClientRect();
        if (r.width > breit) { breit = r.width; mitte = r.top + r.height / 2; }
    });
    const h = Math.round(ZEILE * 0.62);                 // it fits a row with air above and below
    const top = Math.round(mitte - c0.top - h / 2);
    el.style.height = h + 'px';
    // Doc, 27.09.: "zieh die Pille genauso weit nach rechts wie das Dreieck" - its right edge where the tip
    // of ▶ ends (read off the arrow, 9 px when there is none); the arrow sits in the top right corner (the
    // first row, 48 px, the right 56 px): a pill that would reach up there steps left of it
    const spitze = document.querySelector('#tafel-pfeil-vor path');
    const sr = spitze && spitze.getBoundingClientRect();
    const rand = sr && sr.width ? Math.round(c0.right - sr.right) : 9;
    el.style.right = (top < ZEILE / 2 + 24 + 4 ? rand + 56 : rand) + 'px';
    el.style.top = top + 'px';
    el.style.fontSize = Math.round(h * 0.6) + 'px';
    el.style.display = '';
}
function buzzerKnopf() {
    if (!window.Buzzer) return;
    if (!Buzzer.aktiv()) Buzzer.start(buzzerMeldung);
    buzzerKarte();                                   // always the QR - the count is the pill in the first row
}
let buzzerZwilling = null;
async function buzzerKarte(auf = true) {
    let o = document.getElementById('buzzer-overlay');
    if (buzzerZwilling) { buzzerZwilling.remove(); buzzerZwilling = null; }
    if (!auf) { if (o) o.classList.remove('open'); return; }
    if (!o) {
        o = document.createElement('div');
        o.id = 'buzzer-overlay';
        o.className = 'cyber-overlay';
        o.innerHTML = '<div class="cyber-modal cyber-modal--neon" role="dialog" aria-label="Buzzer">' +
            '<button type="button" class="cyber-modal-x" title="Schließen" aria-label="Schließen">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" fill="none"' +
            ' stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
            '<div class="bz-karte"></div>' +
            '<div class="bz-knoepfe"><button type="button" class="cyber-btn bz-neu">NEUER CODE</button>' +
            '<button type="button" class="cyber-btn bz-zu">FERTIG</button></div></div>';
        o.addEventListener('click', e => { if (e.target === o) buzzerKarte(false); });
        o.querySelector('.cyber-modal-x').addEventListener('click', () => buzzerKarte(false));
        o.querySelector('.bz-zu').addEventListener('click', () => buzzerKarte(false));
        // another class: a fresh code, the phones with the old one no longer count
        o.querySelector('.bz-neu').addEventListener('click', () => { Buzzer.neuerCode(); buzzerKarte(); });
        document.body.appendChild(o);
    }
    const karte = await Buzzer.karteBereit();
    o.querySelector('.bz-karte').replaceChildren(karte);
    // the class has to see it: with the beamer running, the same card as a twin over the board
    const bild = document.createElement('div');
    bild.style.cssText = 'position:absolute;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;' +
        'background:rgba(5, 13, 28, 0.95)';
    bild.appendChild(karte.cloneNode(true));
    buzzerZwilling = anzeigeZwilling(bild);
    requestAnimationFrame(() => o.classList.add('open'));
}
// Doc, 27.09.: "in Vorrechnen rechts einen Button mit einem Porträt ... Namen sollen zufällig (sinnvoll)
// gezogen werden", read out by Solita and by Doc in turn - "das Panel ... bitte nicht zeigen. Einfach nur
// den Namen", the big one "zu aggressiv", then "deutlich dezenter". Central in js/namen-ziehen.js (the class
// file stays on the device); here only the button: the name in a quiet pill on the line above the squares,
// on the beamer there too.
// Doc, 27.09.: at the top there is no room above a tall formula - "Plan B ... die Pille über die Linie, die den
// unteren Teil abtrennt": the edge of the squares (#papier .karo, set by zeigePapier)
function namenOpts() {
    return { buehne: container, linie: namenLinie, zwilling: el => anzeigeZwilling(el) };
}
function namenLinie() {
    const karo = document.querySelector('#papier .karo');
    const y = karo ? parseFloat(karo.style.top) : NaN;
    return isFinite(y) ? y : papierGrenze(container.getBoundingClientRect().height);
}
function namenKnopf() {
    if (window.Namen) Namen.ziehen(namenOpts());
}
window.addEventListener('keydown', e => {
    if (!document.querySelector('#buzzer-overlay.open')) return;
    if (e.key === 'Escape') buzzerKarte(false);
    if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation();
}, true);
