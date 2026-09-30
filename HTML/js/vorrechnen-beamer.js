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
async function beamerStart() {
    if (!window.getScreenDetails) { beamerAngebot('Dieser Browser kann keinen zweiten Bildschirm ansteuern – bitte Chrome oder Edge.', false); return; }
    let sd = null;
    try { sd = await window.getScreenDetails(); } catch (_) {}
    if (!sd) { beamerAngebot('Die Seite darf keine Fenster auf andere Bildschirme legen – bitte „Fenster verwalten“ erlauben (Schloss in der Adressleiste).', true); return; }
    const lap = sd.screens.find(x => x.isInternal) || sd.currentScreen;
    const beamer = sd.screens.find(x => x !== lap);
    if (!beamer) { beamerAngebot('Kein zweiter Bildschirm gefunden. Den Beamer auf „Erweitern“ stellen, nicht „Duplizieren“ (Windows: Win + P, Mac: ⌘ F1) – dann noch einmal.', true); return; }
    // Chrome's question "Fenster verwalten" uses up the tap that asked it
    // (decks, 16.09.) - then a fresh tap on the card starts it
    try { await document.documentElement.requestFullscreen({ screen: beamer }); }
    catch (_) { beamerAngebot('Bereit – noch einmal tippen, dann kommt die Rechnung auf den Beamer.', true); return; }
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
function beamerAngebot(text, nochmal) {
    let k = document.getElementById('beamer-angebot');
    if (!k) {
        k = document.createElement('div');
        k.id = 'beamer-angebot';
        k.setAttribute('role', 'dialog');
        k.setAttribute('aria-label', 'Beamer');
        k.style.cssText = 'position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;background:rgba(2,8,20,0.6)';
        k.innerHTML = '<div style="background:#0b1a33;border:1px solid rgba(0,210,255,0.35);border-radius:18px;padding:28px 32px;' +
            'max-width:520px;font-family:Orbitron,sans-serif;color:#eaf0f7;text-align:center">' +
            '<p class="beamer-text" style="margin:0 0 24px;line-height:1.6;font-size:1rem"></p>' +
            '<div style="display:flex;gap:14px;justify-content:center">' +
            '<button type="button" class="cyber-btn beamer-los" style="flex:1">AUF DEN BEAMER</button>' +
            '<button type="button" class="cyber-btn beamer-nein" style="flex:1">ABBRECHEN</button></div></div>';
        document.body.appendChild(k);
        k.querySelector('.beamer-los').addEventListener('click', () => { k.remove(); beamerStart(); });
        k.querySelector('.beamer-nein').addEventListener('click', () => k.remove());
    }
    k.querySelector('.beamer-text').textContent = text;
    k.querySelector('.beamer-los').style.display = nochmal ? '' : 'none';
}
