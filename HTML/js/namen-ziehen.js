// Doc Alvers Mathe-Labor - drawing a name: who comes to the board next. Central: any lab or deck may use it.
//
// Doc, 27.09.2026: "in Vorrechnen rechts einen Button mit einem Porträt ... Namen sollen zufällig (sinnvoll)
// gezogen werden", then "wechselseitig 50-50 von Solita und von meiner Stimme vorgelesen", "einmal aufnehmen
// und dann nicht jedes Mal neu abschicken", and "das Panel ... bitte nicht zeigen. Einfach nur den Namen".
//
// The names never enter this public repo. The class file (OneDrive, e.g. MATH BGY 11/klasse-bgy11.json: the first
// names from the Eingangstest list, both voices recorded once by tools/namen-stimmen.mjs) is loaded once per device
// with KLASSE LADEN and then lives in this browser only (IndexedDB) - nothing is sent anywhere, nothing is fetched.
//
// Drawn sensibly: a bag per class - everyone once before anyone twice, kept across lessons, and a new round never
// starts with the one drawn last. Who is missing today goes back into the bag and comes up in a later lesson.
// Who speaks is ticked in the panel: Solita, Doc, or both - then mixed at random, about half and half, never three
// times the same in a row (a name without a recording in a voice takes the other one).
//
//   Namen.ziehen(opts)    a tap on the portrait: the name in a quiet pill in the middle of the board, sitting on the
//                         line opts.linie() gives (px from the board's top; else at the top), spoken - the board stays
//                         free (Doc: the big name on dark blue "zu aggressiv", then "deutlich dezenter", and - the
//                         top has no room above a tall formula - "Plan B ... die Pille über die Linie").
//                         A tap on the pill: gone. Held down: missing today - back into the bag, the next one rolls
//                         in. opts.buehne: the board it sits on (else the screen). No class yet: the panel instead.
//   Namen.panel(opts)     a long press on the portrait: the class - load it, mark who is missing, switch classes
//   Namen.knopf(b, opts)  wires a button: its click draws (the page's own handler calls Namen.ziehen), a long press
//                         or a right click opens the panel and swallows that click; opts may be a function
//   opts.zwilling(el)     may put el on a second screen and return the copy there (vorrechnen: the beamer); the
//                         name there follows the draw
//   Namen.schliessen(), Namen.offen(), Namen.klasse()
(function () {
    'use strict';
    const ORANGE = 'rgb(245, 194, 66)', ROT = 'rgb(176, 36, 24)';
    const KEY = 'namen-ziehen';                          // localStorage: which class, the bags, today's absent ones
    const DB = 'namen-ziehen', STORE = 'klassen';        // IndexedDB: the class files, names and voices
    const STIMMEN = ['solita', 'doc'];

    const heute = () => new Date().toDateString();
    const lies = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) { return {}; } };
    const schreib = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) { /* private window: the session keeps it */ } };
    let stand = lies();
    if (!stand.zustand) stand.zustand = {};

    // ---- the class files: IndexedDB, a memory copy if that is closed (private window) ---------------------------
    let klassen = null;                                   // { name: { klasse, namen, stimmen } }
    function db() {
        return new Promise((ok, fehler) => {
            const r = indexedDB.open(DB, 1);
            r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'klasse' });
            r.onsuccess = () => ok(r.result);
            r.onerror = () => fehler(r.error);
        });
    }
    async function ladeKlassen() {
        if (klassen) return klassen;
        klassen = {};
        try {
            const d = await db();
            const alle = await new Promise((ok, fehler) => {
                const q = d.transaction(STORE).objectStore(STORE).getAll();
                q.onsuccess = () => ok(q.result);
                q.onerror = () => fehler(q.error);
            });
            alle.forEach(k => { klassen[k.klasse] = k; });
        } catch (_) { /* no IndexedDB: the class holds for this visit */ }
        return klassen;
    }
    async function speichereKlasse(k) {
        klassen[k.klasse] = k;
        try {
            const d = await db();
            await new Promise((ok, fehler) => {
                const t = d.transaction(STORE, 'readwrite');
                t.objectStore(STORE).put(k);
                t.oncomplete = ok;
                t.onerror = () => fehler(t.error);
            });
        } catch (_) { /* kept in memory */ }
    }
    function aktiv() { return klassen && klassen[stand.aktiv] ? klassen[stand.aktiv] : null; }
    function zustand(k) {
        const z = stand.zustand[k.klasse] || (stand.zustand[k.klasse] = {});
        if (!Array.isArray(z.rest)) z.rest = k.namen.slice();
        if (!z.fehlt || z.fehlt.tag !== heute()) z.fehlt = { tag: heute(), namen: [] };   // a new day: all there
        return z;
    }

    // a class file: { klasse, namen: [...], stimmen: { name: { solita, doc } } } - or just a list of names
    async function klasseLaden(datei) {
        let d;
        try { d = JSON.parse(await datei.text()); } catch (_) { throw new Error('Die Datei ist kein JSON.'); }
        if (Array.isArray(d)) d = { namen: d };
        const namen = d && Array.isArray(d.namen) ? d.namen.filter(n => typeof n === 'string' && n.trim()).map(n => n.trim()) : [];
        if (!namen.length) throw new Error('In der Datei steht keine Namensliste („namen“).');
        const name = String(d.klasse || datei.name.replace(/\.json$/i, '')).trim() || 'Klasse';
        const stimmen = {};
        namen.forEach(n => {
            const s = d.stimmen && d.stimmen[n];
            if (s) STIMMEN.forEach(v => { if (typeof s[v] === 'string' && s[v].startsWith('data:audio/')) (stimmen[n] = stimmen[n] || {})[v] = s[v]; });
        });
        const alt = klassen[name];
        await speichereKlasse({ klasse: name, namen, stimmen });
        // the same class again: the bag keeps who was drawn, a new name joins it, a gone one leaves it
        const z = stand.zustand[name];
        if (z && Array.isArray(z.rest) && alt) z.rest = z.rest.filter(n => namen.includes(n)).concat(namen.filter(n => !alt.namen.includes(n)));
        else delete stand.zustand[name];
        stand.aktiv = name;
        schreib(stand);
    }

    // ---- the draw ----------------------------------------------------------------------------------------------
    let aktuell = null;                                   // the name on the board now
    function ziehen(k) {
        const z = zustand(k), fehlt = new Set(z.fehlt.namen);
        z.rest = z.rest.filter(n => k.namen.includes(n));
        let pool = z.rest.filter(n => !fehlt.has(n));
        if (!pool.length) {
            // a new round; not with the one drawn last, if anyone else is there
            z.rest = k.namen.slice();
            pool = z.rest.filter(n => !fehlt.has(n) && n !== z.zuletzt);
            if (!pool.length) pool = z.rest.filter(n => !fehlt.has(n));
        }
        if (!pool.length) return null;                   // everyone is missing
        const n = pool[Math.floor(Math.random() * pool.length)];
        z.rest = z.rest.filter(x => x !== n);
        z.zuletzt = n;
        schreib(stand);
        return n;
    }
    function fehltUmschalten(k, n) {
        const z = zustand(k), i = z.fehlt.namen.indexOf(n);
        if (i >= 0) z.fehlt.namen.splice(i, 1);
        else {
            z.fehlt.namen.push(n);
            // the one just drawn is not there, so has not had the turn: back into the bag
            if (n === aktuell && !z.rest.includes(n)) z.rest.push(n);
        }
        schreib(stand);
    }

    // ---- the voice: recorded once, played from here ------------------------------------------------------------------
    // Doc, 27.09.: which voices speak when a name is drawn - ticked in the panel (Vorlesen off): only Solita, only Doc,
    // or both; none ticked: silent. Both: "nie Doc Solita Doc Solita ... ein bisschen verteilter, sonst ist es fatal" -
    // at random, the one heard less the likelier (about 50:50 in the long run), never three times the same in a row
    function ziehStimmen() { return Array.isArray(stand.ziehStimmen) ? STIMMEN.filter(v => stand.ziehStimmen.includes(v)) : STIMMEN.slice(); }
    function waehleStimme(z, erlaubt) {
        if (erlaubt.length === 1) return erlaubt[0];
        const [a, b] = erlaubt, zaehl = z.zaehler || (z.zaehler = {}), letzte = Array.isArray(z.letzte) ? z.letzte : [];
        let v;
        if (letzte.length >= 2 && letzte[0] === letzte[1] && erlaubt.includes(letzte[1])) v = letzte[1] === a ? b : a;
        else {
            const p = Math.min(0.8, Math.max(0.2, 0.5 + 0.15 * ((zaehl[b] || 0) - (zaehl[a] || 0))));
            v = Math.random() < p ? a : b;
        }
        zaehl[v] = (zaehl[v] || 0) + 1;
        z.letzte = letzte.concat(v).slice(-2);
        return v;
    }
    let ton = null;
    function sprich(k, n) {
        if (ton) { ton.pause(); ton = null; }
        const z = zustand(k), s = k.stimmen && k.stimmen[n];
        if (!s) return;
        const erlaubt = ziehStimmen().filter(v => s[v]);
        if (!erlaubt.length) return;
        const v = waehleStimme(z, erlaubt);
        schreib(stand);
        ton = new Audio(s[v]);
        ton.play().catch(() => {});
    }

    // Doc, 27.09.: "ein Checkmark Vorlesen ... wo ich nur auf die Namen tippe und den Namen kriege", "check Solita
    // Doc - radio" - to hear how a voice says a name: the chosen one (the other where it has no recording); not a
    // draw, and it does not count for the mix of the draws
    function vorleseStimme() { return STIMMEN.includes(stand.vorleseStimme) ? stand.vorleseStimme : STIMMEN[0]; }
    function vorlesen(k, n) {
        if (ton) { ton.pause(); ton = null; }
        const s = k.stimmen && k.stimmen[n];
        if (!s) return;
        const v = s[vorleseStimme()] ? vorleseStimme() : STIMMEN.find(x => s[x]);
        if (!v) return;
        ton = new Audio(s[v]);
        ton.play().catch(() => {});
    }

    // ---- the look ----------------------------------------------------------------------------------------------
    const HALTEN_MS = 600;                                // held this long: missing (on the name), the panel (on the button)
    // Doc, 27.09.: "blende den Namen danach aus" - it stays this long after landing, then fades
    const ZEIGEN_MS = 4000, AUSBLENDEN_MS = 600;
    // Doc, 27.09.: "oben in der Mitte, aber deutlich dezenter ... eine Pille, den Hintergrund ein bisschen dunkler als
    // den Hintergrund ... den Namen so in der Schrift wie jetzt Kehrwert, Hauptnenner, oder ein bisschen dunkler. Und
    // ein Faden" - the board's grey serif (CMU Serif: the notes are KaTeX text, and KaTeX_Main has no umlauts), a shade
    // darker than the board and solid (it sits on a line, which must not show through), a hairline. On sand (.hell)
    // darker grey; on the dark board the notes' grey. One sheet for the pill and its beamer twin (the twin carries it
    // along: the other window has no copy of it).
    const PILLE_STIL = `@import url('https://cdn.jsdelivr.net/npm/computer-modern@0.1.3/cmu-serif.css');
        :is(#namen-pille, #namen-pille-zwilling) { position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
            z-index: 50; display: flex; align-items: center; justify-content: center; box-sizing: border-box;
            padding: 2px 22px 4px; border-radius: 999px; background: rgb(4, 13, 30); border: 1px solid rgba(138, 147, 163, 0.45);
            font-family: 'CMU Serif', KaTeX_Main, 'Times New Roman', serif; font-size: 1.6rem; line-height: 1.2;
            color: #8a93a3; white-space: nowrap; transition: opacity ${AUSBLENDEN_MS}ms ease; }
        .hell :is(#namen-pille, #namen-pille-zwilling) { background: rgb(234, 225, 203); border-color: rgba(93, 102, 120, 0.45); color: #5d6678; }
        :is(#namen-pille, #namen-pille-zwilling).aus { opacity: 0; }
        :is(#namen-pille, #namen-pille-zwilling) .nz-pl-name { position: relative; }
        :is(#namen-pille, #namen-pille-zwilling) .nz-pl-name.rollt { opacity: 0.5; }
        #namen-pille .nz-pl-name.gelandet { animation: nz-landen 0.35s ease-out; }
        @keyframes nz-landen { from { transform: scale(1.06); } to { transform: scale(1); } }`;
    const STIL = PILLE_STIL + `
        #namen-pille { cursor: pointer; touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
        /* held down: a red line runs through the name - let go before it is through, and nothing happens */
        #namen-pille .nz-pl-name::after { content: ''; position: absolute; left: -0.08em; right: -0.08em; top: 55%;
            height: 0.08em; border-radius: 0.04em; background: ${ROT}; transform: scaleX(0); transform-origin: left center; }
        #namen-pille.haelt .nz-pl-name::after { transform: scaleX(1); transition: transform ${HALTEN_MS}ms linear; }
        #namen-overlay .cyber-modal { max-width: min(760px, 94vw); padding: 48px 28px 22px; box-sizing: border-box;
            font-family: 'Orbitron', sans-serif; -webkit-user-select: none; user-select: none; }
        #namen-overlay .nz-kopf { font-size: 0.72rem; letter-spacing: 0.1em; color: #8a93a3; min-height: 1.2em;
            display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; align-items: center; }
        #namen-overlay .nz-kopf button { font: inherit; letter-spacing: inherit; color: inherit; background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 999px; padding: 4px 12px; cursor: pointer; }
        #namen-overlay .nz-kopf button.an { color: #00d2ff; border-color: rgba(0, 210, 255, 0.6); }
        #namen-overlay .nz-text { margin: 18px 0 0; font-size: 0.8rem; line-height: 1.6; letter-spacing: 0.03em; color: rgba(255, 255, 255, 0.8); }
        #namen-overlay .nz-text:empty { display: none; }
        #namen-overlay .nz-text.fehler { color: ${ROT}; }
        #namen-overlay .nz-liste { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 22px 0 24px; }
        #namen-overlay .nz-liste:empty { display: none; }
        #namen-overlay .nz-liste button { font-family: 'Orbitron', sans-serif; font-size: 0.7rem; letter-spacing: 0.04em;
            color: #eaf0f7; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 999px; padding: 5px 11px; cursor: pointer; touch-action: manipulation; }
        #namen-overlay .nz-liste button.dran { opacity: 0.4; }
        #namen-overlay .nz-liste button.fehlt { opacity: 0.45; text-decoration: line-through; border-color: ${ROT}; }
        #namen-overlay .nz-liste button.jetzt { opacity: 1; border-color: ${ORANGE}; color: ${ORANGE}; }
        #namen-overlay .nz-knoepfe { display: flex; gap: 12px; margin-top: 22px; }
        #namen-overlay .nz-liste:not(:empty) + .nz-knoepfe { margin-top: 0; }
        #namen-overlay .nz-knoepfe .cyber-btn { flex: 1; }
        #namen-overlay .nz-fuss { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12px 22px; margin-top: 18px; }
        #namen-overlay .nz-fuss .cyber-checkbox-wrapper { margin: 0; width: auto; flex: none; }
        /* Solita / Doc: a radio while Vorlesen is on, two ticks for the draws while it is off - side by side */
        #namen-overlay .nz-stimme .cyber-radio-group { flex-direction: row; width: auto; margin: 0; gap: 16px; }
        #namen-overlay .nz-stimme .nz-haken-reihe { display: flex; gap: 16px; }
        #namen-overlay .nz-fuss .cyber-modal-close { margin: 0; }
        @media (max-width: 520px) {
            #namen-overlay .cyber-modal { padding: 44px 16px 18px; }
            /* the central buttons keep their padding (!important): one under the other instead of squeezed */
            #namen-overlay .nz-knoepfe { flex-direction: column; gap: 8px; }
        }`;
    function stil() {
        if (document.getElementById('namen-ziehen-stil')) return;
        const st = document.createElement('style');
        st.id = 'namen-ziehen-stil';
        st.textContent = STIL;
        document.head.appendChild(st);
    }
    let opts = {}, lauf = 0;
    const langsterName = k => Math.max(...k.namen.map(n => n.length), 4);

    // ---- the name in a pill, at the top middle of the board -------------------------------------------------------
    let pille = null, zwilling = null, zwillingGefragt = false, halten = null, ausUhr = null;
    function bauePille() {
        if (pille) return pille;
        stil();
        pille = document.createElement('div');
        pille.id = 'namen-pille';
        pille.setAttribute('role', 'status');
        pille.title = 'Tippen: weg · gedrückt halten: fehlt heute, der nächste Name';
        pille.innerHTML = '<span class="nz-pl-name"></span>';
        // the board below never sees these: no stroke, no swipe
        pille.addEventListener('pointerdown', e => {
            e.stopPropagation();
            e.preventDefault();
            if (e.button > 0) return;
            clearTimeout(halten);
            pille.classList.add('haelt');
            halten = setTimeout(() => { halten = null; pille.classList.remove('haelt'); fehltUndWeiter(); }, HALTEN_MS);
        });
        const los = e => {
            e.stopPropagation();
            if (!halten) return;                          // held long enough: done already
            clearTimeout(halten);
            halten = null;
            pille.classList.remove('haelt');
            if (e.type === 'pointerup') weg();
        };
        pille.addEventListener('pointerup', los);
        pille.addEventListener('pointercancel', los);
        pille.addEventListener('pointermove', e => e.stopPropagation());
        pille.addEventListener('contextmenu', e => e.preventDefault());
        return pille;
    }
    function pilleOffen() { return !!(pille && pille.isConnected); }
    // on the board (else the screen), at its top middle - the place is the sheet's; as wide as the widest name of the
    // class, so the roll does not make it breathe (measured each time: the serif may have come in meanwhile)
    // opts.linie(): the line on the board (px from its top) the pill sits on, its middle on the line
    function zeigePille(k) {
        const host = opts.buehne || document.body, p = bauePille();
        clearTimeout(ausUhr);
        p.classList.remove('aus');
        if (p.parentNode !== host) host.appendChild(p);
        p.style.position = host === document.body ? 'fixed' : '';
        p.style.zIndex = host === document.body ? '50000' : '';
        const el = p.firstElementChild, alt = el.textContent;
        el.className = 'nz-pl-name';                      // unscaled: not in the middle of landing
        const breit = Math.ceil(Math.max(...k.namen.map(n => { el.textContent = n; return el.getBoundingClientRect().width; })));
        // its height with a name in it (empty it is flatter)
        let oben = 8;
        const linie = typeof opts.linie === 'function' ? opts.linie() : null;
        if (typeof linie === 'number' && isFinite(linie)) oben = Math.round(linie + 1 - p.offsetHeight / 2);   // +1: the 2 px line's middle
        p.style.top = oben + 'px';
        el.textContent = alt;
        p.style.minWidth = (breit + 46) + 'px';
        return { breite: breit + 46, oben };
    }
    function setzeName(n, k, fertig, ort) {
        const el = pille.firstElementChild;
        el.className = 'nz-pl-name ' + (fertig ? 'gelandet' : 'rollt');
        el.textContent = n;
        if (typeof opts.zwilling === 'function' && !zwilling && !zwillingGefragt) {
            zwillingGefragt = true;                      // no second screen: asked once per draw, not every frame
            // the same pill on the same spot of the board, its sheet along (the board there has .hell as here)
            const bild = document.createElement('div');
            bild.id = 'namen-pille-zwilling';
            bild.style.minWidth = ort.breite + 'px';
            bild.style.top = ort.oben + 'px';
            bild.innerHTML = '<style>' + PILLE_STIL + '</style><span class="nz-pl-name"></span>';
            zwilling = opts.zwilling(bild) || null;
        }
        if (zwilling) {
            const z = zwilling.querySelector('.nz-pl-name');
            if (z) { z.textContent = n; z.className = 'nz-pl-name' + (fertig ? '' : ' rollt'); }
        }
    }
    // a short roll through the names that are there, slowing down; then the drawn one lands and is spoken
    function ziehenZeigen() {
        const k = aktiv();
        if (!k) { panel(); return; }
        const n = ziehen(k);
        if (!n) { weg(); aktuell = null; panel(null, 'Heute fehlen alle? Tippe auf einen Namen, der da ist.'); return; }
        aktuell = n;
        const ort = zeigePille(k);
        const mein = ++lauf;
        zwillingGefragt = false;
        if (ton) { ton.pause(); ton = null; }
        const fehlt = zustand(k).fehlt.namen, da = k.namen.filter(x => !fehlt.includes(x));
        const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
        const landen = () => { setzeName(n, k, true, ort); sprich(k, n); ausUhr = setTimeout(() => ausblenden(mein), ZEIGEN_MS); };
        if (still || da.length < 2) { landen(); return; }
        let vorher = null, schritt = 0;
        const SCHRITTE = 10;                              // about 0.8 s in all
        (function rolle() {
            if (mein !== lauf || !pilleOffen()) return;
            if (schritt >= SCHRITTE) { landen(); return; }
            let x;
            do { x = da[Math.floor(Math.random() * da.length)]; } while (x === vorher);
            vorher = x;
            setzeName(x, k, false, ort);
            setTimeout(rolle, 30 * Math.pow(1.2, schritt++));
        })();
    }
    // the one in the pill is not there: missing today, back into the bag, the next one
    function fehltUndWeiter() {
        const k = aktiv();
        if (!k || !aktuell) return;
        fehltUmschalten(k, aktuell);
        ziehenZeigen();
    }
    // after a while it fades by itself - not while a finger holds it, and not if another name came meanwhile
    function ausblenden(mein) {
        if (mein !== lauf || !pilleOffen()) return;
        if (halten) { ausUhr = setTimeout(() => ausblenden(mein), 1000); return; }
        pille.classList.add('aus');
        if (zwilling) zwilling.classList.add('aus');
        ausUhr = setTimeout(() => { if (mein === lauf) weg(); }, AUSBLENDEN_MS);
    }
    // gone again - the voice may finish its name
    function weg() {
        lauf++;
        clearTimeout(ausUhr);
        clearTimeout(halten);
        halten = null;
        if (zwilling) { zwilling.remove(); zwilling = null; }
        if (pille) { pille.classList.remove('haelt', 'aus'); pille.remove(); }
    }
    async function ziehenOeffnen(o2 = {}) {
        opts = o2 || {};
        await ladeKlassen();
        if (!aktiv()) { const n = Object.keys(klassen)[0]; if (n) { stand.aktiv = n; schreib(stand); } }
        ziehenZeigen();
    }

    // ---- the panel: the class --------------------------------------------------------------------------------------
    let o = null;
    function baue() {
        if (o) return;
        stil();
        o = document.createElement('div');
        o.id = 'namen-overlay';
        o.className = 'cyber-overlay';
        o.innerHTML = '<div class="cyber-modal cyber-modal--neon" role="dialog" aria-label="Die Klasse">' +
            '<button type="button" class="cyber-modal-x" title="Schließen" aria-label="Schließen">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" fill="none"' +
            ' stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
            '<div class="nz-kopf"></div>' +
            '<p class="nz-text" aria-live="polite"></p>' +
            '<div class="nz-liste"></div>' +
            '<div class="nz-knoepfe"><button type="button" class="cyber-btn nz-los">NAME ZIEHEN</button>' +
            '<button type="button" class="cyber-btn nz-zu">FERTIG</button></div>' +
            '<div class="nz-fuss"><button type="button" class="cyber-modal-close nz-laden">Klasse laden</button></div>' +
            '<input type="file" class="nz-datei" hidden></div>';
        o.addEventListener('click', e => { if (e.target === o) panelZu(); });
        o.querySelector('.cyber-modal-x').addEventListener('click', panelZu);
        o.querySelector('.nz-zu').addEventListener('click', panelZu);
        o.querySelector('.nz-los').addEventListener('click', () => {
            if (!aktiv()) { waehleDatei(); return; }
            panelZu();
            ziehenZeigen();
        });
        // Android wants a filter, else it offers only camera, camcorder and photos - with it the file picker, OneDrive in
        // its menu (Lenovo, 27.09.). On the Mac the same filter greyed the file out (reason unknown - macOS types it
        // public.json), and without it the file loads - so only there
        if (/Android/i.test(navigator.userAgent)) o.querySelector('.nz-datei').accept = '.json,application/json';
        o.querySelector('.nz-laden').addEventListener('click', waehleDatei);
        // the central checkbox (CyberUI), the same markup by hand where there is none
        const umschalten = v => { stand.vorlesen = !!v; schreib(stand); zeigePanel(); };
        let haken;
        if (window.CyberUI && typeof CyberUI.createCheckbox === 'function') haken = CyberUI.createCheckbox(null, 'Vorlesen', !!stand.vorlesen, umschalten);
        else {
            haken = document.createElement('label');
            haken.className = 'cyber-checkbox-wrapper';
            haken.innerHTML = '<input type="checkbox" class="cyber-checkbox"><span class="cyber-label">Vorlesen</span>';
            haken.firstElementChild.checked = !!stand.vorlesen;
            haken.firstElementChild.addEventListener('change', e => umschalten(e.target.checked));
        }
        haken.classList.add('nz-vorlesen');
        haken.title = 'An: ein Tipp auf einen Namen liest ihn vor – aus: Tipp = fehlt heute';
        const wahl = document.createElement('div');
        wahl.className = 'nz-stimme';
        wahl.id = 'nz-stimme-wahl';
        o.querySelector('.nz-fuss').prepend(haken, wahl);
        o.querySelector('.nz-datei').addEventListener('change', async e => {
            const f = e.target.files && e.target.files[0];
            e.target.value = '';
            if (!f) return;
            try {
                await klasseLaden(f);
                aktuell = null;
                const k = aktiv();
                zeigePanel(k.klasse + ' ist geladen: ' + k.namen.length + ' Namen. Wer heute fehlt: antippen.');
            } catch (err) { zeigePanel(err.message, true); }
        });
        document.body.appendChild(o);
        // which voice reads: the central radio group (it needs its container in the page), else the same by hand
    }
    // Solita / Doc, built anew with every look of the panel: Vorlesen on - one voice to listen with (the central radio
    // group; it needs its container in the page); off - the voices of the draws, each a tick (the central checkbox)
    const OPTIONEN = [{ label: 'Solita', value: 'solita' }, { label: 'Doc', value: 'doc' }];
    function zeigeStimmwahl() {
        const wahl = o.querySelector('#nz-stimme-wahl');
        wahl.replaceChildren();
        const ui = window.CyberUI || {};
        if (stand.vorlesen) {
            const setzen = v => { stand.vorleseStimme = v; schreib(stand); zeigePanel(); };
            wahl.title = 'Mit welcher Stimme ein Tipp auf einen Namen vorliest';
            if (typeof ui.createRadioGroup === 'function') { ui.createRadioGroup('nz-stimme-wahl', '', OPTIONEN, vorleseStimme(), setzen); return; }
            const g = document.createElement('div');
            g.className = 'cyber-radio-group';
            OPTIONEN.forEach(opt => {
                const l = document.createElement('label');
                l.className = 'cyber-radio-wrapper';
                l.innerHTML = '<input type="radio" name="nz-stimme" class="cyber-radio-input"><span class="cyber-label"></span>';
                l.firstElementChild.checked = opt.value === vorleseStimme();
                l.firstElementChild.addEventListener('change', () => setzen(opt.value));
                l.lastElementChild.textContent = opt.label;
                g.appendChild(l);
            });
            wahl.appendChild(g);
            return;
        }
        wahl.title = 'Wer beim Ziehen spricht – beide: gemischt, keine: stumm';
        const reihe = document.createElement('div');
        reihe.className = 'nz-haken-reihe';
        OPTIONEN.forEach(opt => {
            const an = ziehStimmen().includes(opt.value);
            const setzen = v => {
                const neu = new Set(ziehStimmen());
                if (v) neu.add(opt.value); else neu.delete(opt.value);
                stand.ziehStimmen = STIMMEN.filter(x => neu.has(x));
                schreib(stand);
                zeigePanel();
            };
            let l;
            if (typeof ui.createCheckbox === 'function') l = ui.createCheckbox(null, opt.label, an, setzen);
            else {
                l = document.createElement('label');
                l.className = 'cyber-checkbox-wrapper';
                l.innerHTML = '<input type="checkbox" class="cyber-checkbox"><span class="cyber-label"></span>';
                l.firstElementChild.checked = an;
                l.firstElementChild.addEventListener('change', e => setzen(e.target.checked));
                l.lastElementChild.textContent = opt.label;
            }
            reihe.appendChild(l);
        });
        wahl.appendChild(reihe);
    }
    function waehleDatei() { o.querySelector('.nz-datei').click(); }
    function zeigePanel(text, fehler) {
        const k = aktiv(), t = o.querySelector('.nz-text');
        t.className = 'nz-text' + (fehler ? ' fehler' : '');
        t.textContent = text !== undefined && text !== null ? text
            : k && stand.vorlesen ? 'Antippen: der Name wird vorgelesen – von ' + (vorleseStimme() === 'doc' ? 'Doc.' : 'Solita.')
            : k ? 'Antippen: fehlt heute – noch einmal: wieder da. Beim Ziehen spricht ' + ({ 2: 'Solita oder Doc, gemischt.',
                1: (ziehStimmen()[0] === 'doc' ? 'Doc.' : 'Solita.'), 0: 'niemand.' })[ziehStimmen().length]
            : 'Auf diesem Gerät ist noch keine Klasse. „Klasse laden“ holt die Datei, z. B. klasse-bgy11.json aus OneDrive. Die Namen bleiben nur hier im Browser.';
        o.querySelector('.nz-los').textContent = k ? 'NAME ZIEHEN' : 'KLASSE LADEN';
        zeigeStimmwahl();
        zeigeKopf();
        zeigeListe();
    }
    // the head: the class (several on this device: one chip each) and how many are left in this round
    function zeigeKopf() {
        const kopf = o.querySelector('.nz-kopf'), k = aktiv(), namen = Object.keys(klassen || {});
        kopf.replaceChildren();
        if (namen.length > 1) {
            namen.sort().forEach(n => {
                const b = document.createElement('button');
                b.type = 'button';
                b.textContent = n;
                if (k && n === k.klasse) b.className = 'an';
                b.addEventListener('click', () => { stand.aktiv = n; schreib(stand); aktuell = null; zeigePanel(); });
                kopf.appendChild(b);
            });
        } else if (k) kopf.append(k.klasse);
        if (k) {
            const z = zustand(k), fehlt = new Set(z.fehlt.namen), offen = z.rest.filter(n => !fehlt.has(n)).length;
            const s = document.createElement('span');
            s.textContent = offen === 1 ? '· noch 1 in dieser Runde' : '· noch ' + offen + ' in dieser Runde';
            kopf.appendChild(s);
        }
    }
    // the class: dim = had a turn this round, struck = missing today, orange = drawn last; a tap: missing / there
    function zeigeListe() {
        const liste = o.querySelector('.nz-liste'), k = aktiv();
        liste.replaceChildren();
        if (!k) return;
        const z = zustand(k), fehlt = new Set(z.fehlt.namen), rest = new Set(z.rest);
        k.namen.slice().sort((a, b) => a.localeCompare(b, 'de')).forEach(n => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = n;
            b.className = [fehlt.has(n) ? 'fehlt' : '', !rest.has(n) && !fehlt.has(n) ? 'dran' : '', n === aktuell ? 'jetzt' : ''].join(' ').trim();
            b.title = stand.vorlesen ? 'tippen: vorlesen' : fehlt.has(n) ? 'fehlt heute – tippen: ist doch da' : 'tippen: fehlt heute';
            b.addEventListener('click', () => {
                if (stand.vorlesen) { vorlesen(k, n); return; }
                fehltUmschalten(k, n);
                zeigeKopf();
                zeigeListe();
            });
            liste.appendChild(b);
        });
    }
    function panelOffen() { return !!(o && o.classList.contains('open')); }
    async function panel(o2, text) {
        if (o2) opts = o2;
        baue();
        await ladeKlassen();
        if (!aktiv()) { const n = Object.keys(klassen)[0]; if (n) { stand.aktiv = n; schreib(stand); } }
        zeigePanel(text);
        o.classList.add('open');
    }
    function panelZu() { if (o) o.classList.remove('open'); }

    // ---- the button: a tap draws (the page's click handler), held or right-clicked: the panel ----------------------
    function knopf(b, o2) {
        const hol = () => (typeof o2 === 'function' ? o2() : o2) || {};
        let t = null, lang = false;
        const stopp = () => { clearTimeout(t); t = null; };
        b.addEventListener('pointerdown', e => {
            lang = false;
            stopp();
            if (e.button > 0) return;
            t = setTimeout(() => { t = null; lang = true; panel(hol()); }, HALTEN_MS);
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, stopp));
        b.addEventListener('contextmenu', e => {
            e.preventDefault();
            stopp();
            if (!panelOffen()) { lang = true; panel(hol()); }
        });
        // after a long press the click that follows is not a draw
        b.addEventListener('click', e => { if (lang) { lang = false; e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    }

    function offen() { return pilleOffen() || panelOffen(); }
    function schliessen() { weg(); panelZu(); }
    // the panel's keys are its own (Esc closes it, nothing reaches the page); with the pill alone the board keeps
    // its keys, only Esc takes the pill away
    window.addEventListener('keydown', e => {
        if (panelOffen()) {
            e.stopPropagation();
            if (e.key === 'Escape') { e.preventDefault(); panelZu(); }
        } else if (pilleOffen() && e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); weg(); }
    }, true);

    window.Namen = { ziehen: ziehenOeffnen, panel, knopf, schliessen, offen, klasse: () => (aktiv() || {}).klasse || null };
})();
