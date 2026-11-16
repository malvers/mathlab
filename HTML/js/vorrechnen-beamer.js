// Vorrechnen (vorrechnen.html), part 9 of 12: the beamer: mission control and the mirrored board.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// ── Beamer ──────────────────────────────────────────────────────────
// Doc, 26.09.: "baue einen modus wie in den Decks, das ich projizieren
// kann. Kids sehen nur die Rechnungen, ich mission control" - and: "der
// Beamer soll gerade nicht spiegeln". As in the decks: one tap puts this
// window fullscreen on the beamer (Window Management API) and opens
// mission control on the laptop (?steuerung) - the full lab, where Doc
// writes. Mission control sends every picture of the board: the canvas
// (drawImage from its own), the layers when they change, the typeset
// line's flight as a twin. Controls never reach the beamer. Closing
// mission control brings this window back.
let steuerFenster = null, anzeigeFrame = null, buehne = { w: 0, h: 0 };
// not 'formel-schicht': the recognised line is Doc's GO, the class sees
// only the ink fly up and turn into LaTeX
// 'erklaerung-schicht': the explanation box, only while Doc has pushed it up over the line (29.09.)
// 'buzz-aufgabe': the buzzer's count behind the step's number, for the class too (29.09., zeigeBuzzAufgabe)
// 'solita-schicht': Solita in the corner above the line, her box and answers - "sichtbar für alle" (30.09.)
const SPIEGEL_SCHICHTEN = ['papier', 'verlauf-schicht', 'vorlage-schicht', 'rechenweg-schicht', 'satz-schicht', 'erklaerung-schicht', 'buzz-aufgabe', 'solita-schicht'];
const spiegelCache = {};
function anzeigeLaeuft() { return anzeigeModus; }
function anzeigeZiel() {
    if (!STEUERUNG) return null;
    try {
        const z = window.opener;
        return (z && !z.closed && typeof z.anzeigeLaeuft === 'function' && z.anzeigeLaeuft()) ? z : null;
    } catch (_) { return null; }
}
// a layer's markup, read again only when it changed (watched per layer)
function spiegelSchicht(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    let c = spiegelCache[id];
    if (!c || c.el !== el) {
        c = spiegelCache[id] = { el, dirty: true, version: 0 };
        // any change of a layer sends by itself - a landing only unhides
        // a row, and nothing draws after it
        c.obs = new MutationObserver(() => { c.dirty = true; anzeigeBald(); });
        c.obs.observe(el, { subtree: true, childList: true, attributes: true, characterData: true });
    }
    if (c.obs.takeRecords().length) c.dirty = true;
    if (c.dirty) { c.css = el.style.cssText; c.html = el.innerHTML; c.dirty = false; c.version++; }
    return [id, c.css, c.html, c.version];
}
function anzeigeSenden() {
    anzeigeFrame = null;
    const ziel = anzeigeZiel();
    if (!ziel) return;
    const r = container.getBoundingClientRect();
    try {
        // knopf: the buttons' scale (--knopf, erkennenKlein) - Solita's line is measured with it, there as here
        ziel.anzeigeEmpfang({ w: Math.round(r.width), h: Math.round(r.height), hell, leinwand: canvas,
            knopf: container.style.getPropertyValue('--knopf'),
            schichten: SPIEGEL_SCHICHTEN.map(spiegelSchicht).filter(Boolean) });
    } catch (_) {}
}
function anzeigeBald() {
    if (STEUERUNG && !anzeigeFrame) anzeigeFrame = requestAnimationFrame(anzeigeSenden);
}
function anzeigeZwilling(el) {
    const ziel = anzeigeZiel();
    try { return ziel ? ziel.anzeigeKlon(el.outerHTML) : null; } catch (_) { return null; }
}

// -- on the beamer --
function anzeigeEmpfang(d) {
    if (!anzeigeModus) return;
    if (d.w !== buehne.w || d.h !== buehne.h) { buehne = { w: d.w, h: d.h }; anzeigeEinpassen(); }
    if (container.style.getPropertyValue('--knopf') !== (d.knopf || '')) container.style.setProperty('--knopf', d.knopf || '');
    if (container.classList.contains('hell') !== d.hell) {
        container.classList.toggle('hell', d.hell);
        document.documentElement.style.setProperty('--anzeige-grund', d.hell ? '#f4ecd8' : '#050d1c');
    }
    const q = d.leinwand;
    if (canvas.width !== q.width || canvas.height !== q.height) { canvas.width = q.width; canvas.height = q.height; }
    canvas.style.width = d.w + 'px';
    canvas.style.height = d.h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(q, 0, 0);
    d.schichten.forEach(([id, css, html, version]) => {
        let el = document.getElementById(id);
        if (!el) { el = document.createElement('div'); el.id = id; container.appendChild(el); }
        if (el.dataset.version === String(version)) return;
        el.dataset.version = String(version);
        el.style.cssText = css;
        el.innerHTML = html;
        // a box that scrolls shows the part Doc scrolled to (the explanation box pushed up, 29.09.)
        el.querySelectorAll('[data-scroll]').forEach(e => { e.scrollTop = +e.dataset.scroll || 0; });
    });
}
function anzeigeKlon(html) {
    if (!anzeigeModus) return null;
    const t = document.createElement('template');
    t.innerHTML = html;
    const el = t.content.firstElementChild;
    container.appendChild(el);
    return el;
}
// mission control's board, as large as the beamer allows, centred
function anzeigeEinpassen() {
    if (!anzeigeModus || !buehne.w) return;
    const sk = Math.min(innerWidth / buehne.w, innerHeight / buehne.h);
    container.style.width = buehne.w + 'px';
    container.style.height = buehne.h + 'px';
    container.style.transform = `translate(${(innerWidth - buehne.w * sk) / 2}px, ${(innerHeight - buehne.h * sk) / 2}px) scale(${sk})`;
}
window.addEventListener('resize', anzeigeEinpassen);
function anzeigeAn() {
    anzeigeModus = true;
    clearTimeout(autoTimer);
    clearTimeout(beispielTimer);
    if (tipp) { clearTimeout(tipp.timer); tipp = null; }
    current = null;
    fluege.length = 0;
    document.documentElement.style.setProperty('--anzeige-grund', hell ? '#f4ecd8' : '#050d1c');
    document.body.classList.add('anzeige');
    // out of the page layout: inside it the board sat under the backdrop
    // (an ancestor has its own stacking order); leaving reloads anyway
    document.body.appendChild(container);
    // mission control closed: back to normal
    const wache = setInterval(() => { if (!steuerFenster || steuerFenster.closed) { clearInterval(wache); anzeigeAus(); } }, 800);
}
// back to normal: the state is mission control's now, so load it afresh
function anzeigeAus() {
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    location.reload();
}
// ── The one button "Tafel" ──────────────────────────────────────────
// Doc, 16.11.2026: at the board (the school's HP, Promethean, display on
// "Erweitern") he pressed full screen instead of the beamer and nothing
// came - "nur noch EIN Knopf", it finds out itself what to do (as full()
// in decks/deck.js): a second screen, extended, and the page may place
// windows -> the beamer way (beamerStart): the working alone in full
// screen on the board, mission control on the laptop. Mirrored, one
// screen, or a browser without the Window Management API -> plain full
// screen of this window, the mirrored picture is the board's - no card.
// Pressed again it ends either; in mission control it closes it (the
// beamer window then goes back to normal, anzeigeAus).
const TAFEL_ERLAUBEN = 'Nur Vollbild – die Seite darf keine Fenster auf die Tafel legen. ' +
    'Erlauben: Schloss links in der Adressleiste → „Fenster verwalten“ → Zulassen, dann noch einmal „Tafel“.';
async function tafelKnopf() {
    if (STEUERUNG) { window.close(); return; }
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
    // the browser knows there is no second screen (Chrome: screen.isExtended
    // false = mirrored or the laptop alone), or cannot place windows at all:
    // full screen at once, without Chrome's question
    if (!window.getScreenDetails || ('isExtended' in screen && !screen.isExtended)) { tafelVollbild(); return; }
    const erlaubnis = await fensterErlaubnis();
    // refused before: Chrome will not ask again - full screen, and how to allow it
    if (erlaubnis === 'denied') { tafelVollbild(TAFEL_ERLAUBEN); return; }
    // not asked yet: one sentence first - Chrome's question uses up the tap
    // that asked it (decks, 16.09.), so the card says a second tap follows
    if (erlaubnis === 'prompt') {
        beamerAngebot('Damit die Rechnung allein auf die Tafel kommt, muss die Seite einmal „Fenster verwalten“ dürfen – ' +
            'gleich fragt der Browser: „Zulassen“, dann noch einmal tippen.', true);
        return;
    }
    beamerStart();
}
// "granted" / "prompt" / "denied", or null where the browser cannot tell
// (the permission was called window-placement before Chrome 111)
async function fensterErlaubnis() {
    for (const name of ['window-management', 'window-placement']) {
        try { return (await navigator.permissions.query({ name })).state; } catch (_) {}
    }
    return null;
}
// this window in full screen - on the board when it mirrors the laptop.
// With a note (the permission refused) the card says it; did the tap go to
// Chrome's question, a fresh one on the card makes it full screen. Without
// a note nothing shows, even if the browser says no (as the old button)
function tafelVollbild(hinweis) {
    const el = document.documentElement;
    Promise.resolve(el.requestFullscreen ? el.requestFullscreen() : Promise.reject(new Error('no fullscreen')))
        .then(() => { if (hinweis) beamerAngebot(hinweis, false); })
        .catch(() => { if (hinweis) beamerAngebot(hinweis + ' Jetzt noch einmal tippen, dann Vollbild.', () => tafelVollbild()); });
}
async function beamerStart() {
    if (!window.getScreenDetails) { tafelVollbild(); return; }
    let sd = null;
    try { sd = await window.getScreenDetails(); } catch (_) {}
    // refused just now (or the question closed): full screen of this window, and how to allow it
    if (!sd) { tafelVollbild(TAFEL_ERLAUBEN); return; }
    const lap = sd.screens.find(x => x.isInternal) || sd.currentScreen;
    const beamer = sd.screens.find(x => x !== lap);
    // only one screen after all (mirrored): plain full screen, no card
    if (!beamer) { tafelVollbild(); return; }
    // Chrome's question "Fenster verwalten" uses up the tap that asked it
    // (decks, 16.09.) - then a fresh tap on the card starts it
    try { await document.documentElement.requestFullscreen({ screen: beamer }); }
    catch (_) { beamerAngebot('Bereit – noch einmal tippen, dann kommt die Rechnung auf die Tafel.', true); return; }
    const w = window.open(location.pathname + '?steuerung', 'vorrechnen-steuerung',
        'popup,left=' + lap.availLeft + ',top=' + lap.availTop + ',width=' + lap.availWidth + ',height=' + lap.availHeight);
    if (!w) {
        try { document.exitFullscreen(); } catch (_) {}
        beamerAngebot('Mission Control wurde blockiert – bitte Pop-ups für diese Seite erlauben.', true);
        return;
    }
    steuerFenster = w;
    anzeigeAn();
}
// nochmal: true = the card's button starts the beamer way, a function = it
// runs that instead (tafelVollbild), false = only a note, closed with OK
function beamerAngebot(text, nochmal) {
    let k = document.getElementById('beamer-angebot');
    if (!k) {
        k = document.createElement('div');
        k.id = 'beamer-angebot';
        k.setAttribute('role', 'dialog');
        k.setAttribute('aria-label', 'Tafel');
        // above the right rail (z-index 2100), which covered the card's right edge on a narrow screen
        k.style.cssText = 'position:fixed;inset:0;z-index:2200;display:flex;align-items:center;justify-content:center;background:rgba(2,8,20,0.6)';
        k.innerHTML = '<div style="background:#0b1a33;border:1px solid rgba(0,210,255,0.35);border-radius:18px;padding:28px 32px;' +
            'margin:0 16px;max-width:520px;font-family:Orbitron,sans-serif;color:#eaf0f7;text-align:center">' +
            '<p class="beamer-text" style="margin:0 0 24px;line-height:1.6;font-size:1rem"></p>' +
            '<div style="display:flex;gap:14px;justify-content:center">' +
            '<button type="button" class="cyber-btn beamer-los" style="flex:1">AUF DIE TAFEL</button>' +
            '<button type="button" class="cyber-btn beamer-nein" style="flex:1">ABBRECHEN</button></div></div>';
        document.body.appendChild(k);
        k.querySelector('.beamer-los').addEventListener('click', () => { const tun = k.losTun || beamerStart; k.remove(); tun(); });
        k.querySelector('.beamer-nein').addEventListener('click', () => k.remove());
    }
    k.losTun = typeof nochmal === 'function' ? nochmal : beamerStart;
    k.querySelector('.beamer-text').textContent = text;
    // .cyber-btn is display:flex !important (js/buttons-ultra.css) - hiding needs it too
    const los = k.querySelector('.beamer-los');
    if (nochmal) los.style.removeProperty('display');
    else los.style.setProperty('display', 'none', 'important');
    k.querySelector('.beamer-nein').textContent = nochmal ? 'ABBRECHEN' : 'OK';
}
