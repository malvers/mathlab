// Vorrechnen (vorrechnen.html), part 5 of 12: sending the tasks done to the plan (svp_tafel).
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

// Doc, 26.09.: "können wir ein PDF von den gerechneten Aufgaben exportieren ... dass die
// Rechnung sofort ... auf Stoffverteilungsplan aufschlagen könnte" - and: "das sollen
// definitiv alle sehen ... die haben dann die Musterlösung schon vor sich liegen".
// "Tafel senden" (right rail) puts today's working into the table svp_tafel: one row
// per plan page and day, the class reads it, only Doc's account writes. The plan shows
// it as a pill "Tafel 26.09." in its week (svp/svp-plan-tafel.js); the pill opens
// decks/tafel.html, the working as a deck with Solita to ask about every step (the PDF is gone,
// Doc 27.09.: "viel besser, wenn wir davon ein Deck machen").
const TAFEL_ZIEL = 'vorrechnen-tafel-ziel';
let tafelPlaene = null, tafelZiel = null, tafelAus = new Set(), tafelUntis = null;
function tagIso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// the ISO week, the one the plan numbers its rows by (svp-plan-keys.js)
function isoWoche(d) { return svpIsoWeek(d); }   // svp/svp-woche.js, loaded by vorrechnen.html before this file
// ladeSkript: js/lade-skript.js, loaded before this file
// the login of the plans (one session for every svp page), only when it is needed
async function svpAnmeldungLaden() {
    if (!window.svpAuth) await ladeSkript('svp/svp-auth.js');
    if (!window.svpGate) await ladeSkript('svp/svp-gate.js');      // the login card's look
}
// What goes on the board: every task worked out today (vorrechnen-erledigt) and the
// one on the board now, one entry per task - the latest working wins, the order is
// that of the first time. A task already sent to another class today stays out
// (two classes in one day). In Frei the working has no task: one "Rechnung" a day.
function tafelSammeln(ziel) {
    const heute = tagIso(new Date());
    let a = [];
    try { a = JSON.parse(localStorage.getItem('vorrechnen-erledigt') || '[]'); } catch (_) {}
    if (!Array.isArray(a)) a = [];
    // the number within its block ("Level 2", Aufgabe 3), as the counter on the board says it
    // with every line the step that made it ("-3x", ":4") from LOESUNGEN - the deck of the board
    // shows it beside the line before (Doc, 27.09.: "die Anweisung pro Zeile, was zu machen ist")
    const eintrag = (schluessel, latex, zeilen, zeit) => {
        const i = AUFGABEN.findIndex(t => t[0] === schluessel), b = i >= 0 ? aufgabenBlock(i) : null;
        const loesung = (schluessel && LOESUNGEN[schluessel]) || [];
        const umformung = l => { const s = loesung.find(([st]) => schrittNorm(st) === schrittNorm(l.latex)); return s ? s[1] : null; };
        return { schluessel: schluessel || 'frei-' + heute, nr: b ? i - b.ab + 1 : null, block: b ? b.titel : null,
            latex: latex || null, nach: i >= 0 ? AUFGABEN[i][2] : null, rechenweg: zeilen.map(l => l.latex),
            umformungen: zeilen.map(umformung), zeit };
    };
    const liste = a.filter(e => e && e.zeit && tagIso(new Date(e.zeit)) === heute && (e.rechenweg || []).length &&
        (!e.tafel || e.tafel === ziel)).map(e => eintrag(e.aufgabe, e.latex, e.rechenweg, e.zeit));
    if (rechenweg.length && !testModus) {
        liste.push(aufgabenModus ? eintrag(AUFGABEN[aufgabeIdx][0], AUFGABEN[aufgabeIdx][1], rechenweg, Date.now())
            : eintrag(null, null, rechenweg, Date.now()));
    }
    const je = new Map();
    liste.forEach(e => { const alt = je.get(e.schluessel); je.set(e.schluessel, alt ? Object.assign({}, e, { zeit: alt.zeit }) : e); });
    return [...je.values()].sort((x, y) => x.zeit - y.zeit);
}
// what was sent where: those tasks stay with that class
function tafelMerken(ziel, schluessel) {
    let a = [];
    try { a = JSON.parse(localStorage.getItem('vorrechnen-erledigt') || '[]'); } catch (_) {}
    if (!Array.isArray(a)) return;
    const heute = tagIso(new Date());
    a.forEach(e => { if (e && e.zeit && tagIso(new Date(e.zeit)) === heute && schluessel.has(e.aufgabe)) e.tafel = ziel; });
    try { localStorage.setItem('vorrechnen-erledigt', JSON.stringify(a)); } catch (_) {}
}
// The class: the lesson running now (or the last one today, else the next one), from
// the Untis state in Supabase that only Doc reads; without it the class of last time.
async function tafelZielRaten() {
    if (!tafelUntis) {
        try {
            const res = await svpAuth.api('svp_untis?select=page,data');
            tafelUntis = res.ok ? await res.json() : [];
        } catch (e) { tafelUntis = []; }
    }
    const jetzt = new Date(), heute = tagIso(jetzt).replace(/-/g, '');
    const uhr = String(jetzt.getHours()).padStart(2, '0') + ':' + String(jetzt.getMinutes()).padStart(2, '0');
    const stunden = [];
    tafelUntis.forEach(r => {
        const wochen = (r && r.data && r.data.weeks) || {};
        Object.values(wochen).forEach(w => (w || []).forEach(e => {
            if (String(e.date) === heute && e.code !== 'cancelled') stunden.push({ page: r.page, start: String(e.start) });
        }));
    });
    stunden.sort((x, y) => x.start.localeCompare(y.start));
    const vorbei = stunden.filter(s => s.start <= uhr);
    const s = vorbei.length ? vorbei[vorbei.length - 1] : stunden[0];
    if (s) return s.page;
    try { return localStorage.getItem(TAFEL_ZIEL); } catch (_) { return null; }
}
async function tafelSenden() {
    try { await svpAnmeldungLaden(); }
    catch (e) { tafelDialog(); tafelStatus('Die Anmeldung lässt sich nicht laden: ' + e.message, true); return; }
    if (!svpAuth.hasSession()) {
        svpAuth.loginDialog(() => tafelSenden(), 'Anmelden, um die Tafel in den Stoffverteilungsplan zu senden');
        return;
    }
    tafelDialog();
    tafelStatus('Suche die Stunde …');
    if (!tafelPlaene) {
        try {
            const idx = await (await fetch('svp/plan-suchindex.json', { cache: 'no-cache' })).json();
            tafelPlaene = (idx.plaene || []).map(p => ({ page: '/svp/' + p.href, kurz: p.kurz, lang: p.lang, wochen: p.wochen || [] }));
        } catch (e) { tafelPlaene = []; }
    }
    const geraten = await tafelZielRaten();
    tafelZiel = tafelPlaene.some(p => p.page === geraten) ? geraten : null;
    tafelAus = new Set();
    tafelZeigen();
}
function tafelDialog(auf = true) {
    let o = document.getElementById('tafel-overlay');
    if (!auf) { if (o) o.classList.remove('open'); return; }
    if (!o) {
        o = document.createElement('div');
        o.id = 'tafel-overlay';
        o.className = 'cyber-overlay';
        o.innerHTML = '<div class="cyber-modal cyber-modal--neon" role="dialog" aria-label="Tafel senden">' +
            '<button type="button" class="cyber-modal-x" title="Schließen" aria-label="Schließen">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6 L18 18 M18 6 L6 18" fill="none"' +
            ' stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>' +
            '<h3>Tafel senden</h3>' +
            '<div class="ts-text">In den Stoffverteilungsplan – die Klasse geht die Rechnung als Deck durch und kann Solita zu jedem Schritt fragen.</div>' +
            '<div class="ts-label">KLASSE</div><div class="ts-reihe ts-plaene"></div><div class="ts-woche"></div>' +
            '<div class="ts-label">AUFGABEN</div><div class="ts-reihe ts-aufgaben"></div>' +
            '<div class="ts-status" role="status"></div>' +
            '<div class="ts-knoepfe"><button type="button" class="cyber-btn ts-los">SENDEN</button>' +
            '<button type="button" class="cyber-btn ts-ansehen" hidden>ANSEHEN</button></div></div>';
        o.addEventListener('click', e => { if (e.target === o) tafelDialog(false); });
        o.querySelector('.cyber-modal-x').addEventListener('click', () => tafelDialog(false));
        o.querySelector('.ts-los').addEventListener('click', () => tafelHochladen());
        document.body.appendChild(o);
    }
    o.classList.toggle('hell', hell);
    o.querySelector('.ts-plaene').textContent = '';
    o.querySelector('.ts-aufgaben').textContent = '';
    o.querySelector('.ts-woche').textContent = '';
    o.querySelector('.ts-ansehen').hidden = true;
    o.querySelector('.ts-los').textContent = 'SENDEN';
    requestAnimationFrame(() => o.classList.add('open'));
}
function tafelStatus(text, fehler) {
    const s = document.querySelector('#tafel-overlay .ts-status');
    if (!s) return;
    s.textContent = text;
    s.style.color = fehler ? 'rgb(176, 36, 24)' : '';
}
function tafelChip(text, an, tun, titel) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ts-chip' + (an ? ' an' : '');
    b.textContent = text;
    if (titel) b.title = titel;
    b.setAttribute('aria-pressed', an ? 'true' : 'false');
    b.addEventListener('click', tun);
    return b;
}
// the class chips, the week it lands in, and the tasks - a tap takes one out or back in
function tafelZeigen() {
    const o = document.getElementById('tafel-overlay');
    if (!o) return;
    const plaeneEl = o.querySelector('.ts-plaene'), aufgabenEl = o.querySelector('.ts-aufgaben');
    plaeneEl.textContent = '';
    tafelPlaene.forEach(p => plaeneEl.appendChild(tafelChip(p.kurz, p.page === tafelZiel,
        () => { tafelZiel = p.page; tafelZeigen(); }, p.lang)));
    const jetzt = new Date(), kw = isoWoche(jetzt);
    const plan = tafelPlaene.find(p => p.page === tafelZiel);
    const woche = plan && plan.wochen.find(w => w.kw === kw);
    o.querySelector('.ts-woche').textContent = !plan ? 'Welche Klasse?'
        : jetzt.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }) +
          ' · KW ' + kw + (woche ? ' · ' + woche.thema : ' · diese Woche hat im Plan keine Zeile – die Pille erscheint dort nicht');
    const liste = tafelSammeln(tafelZiel);
    aufgabenEl.textContent = '';
    liste.forEach(e => aufgabenEl.appendChild(tafelChip(e.nr ? (e.block || '').split(' · ')[0] + ' · ' + e.nr : 'Rechnung',
        !tafelAus.has(e.schluessel),
        () => { if (tafelAus.has(e.schluessel)) tafelAus.delete(e.schluessel); else tafelAus.add(e.schluessel); tafelZeigen(); })));
    const n = liste.filter(e => !tafelAus.has(e.schluessel)).length;
    o.querySelector('.ts-los').disabled = !plan || !n;
    tafelStatus(!liste.length ? 'Heute ist noch nichts gerechnet.' : !plan ? 'Tippe die Klasse an.' : '');
}
// Into the table, as the row of this class and day: what is already there from another
// device stays, the same task is replaced, a task tapped away goes out.
async function tafelHochladen() {
    const o = document.getElementById('tafel-overlay');
    const plan = tafelPlaene && tafelPlaene.find(p => p.page === tafelZiel);
    if (!o || !plan) return;
    const los = o.querySelector('.ts-los');
    const liste = tafelSammeln(tafelZiel).filter(e => !tafelAus.has(e.schluessel));
    const jetzt = new Date(), datum = tagIso(jetzt), kw = isoWoche(jetzt);
    los.disabled = true;
    tafelStatus('Sende …');
    try {
        const alt = await svpAuth.api('svp_tafel?page=eq.' + encodeURIComponent(plan.page) + '&datum=eq.' + datum + '&select=aufgaben');
        const altListe = alt.ok ? ((await alt.json())[0] || {}).aufgaben || [] : [];
        const neu = new Set(liste.map(e => e.schluessel));
        const aufgaben = altListe.filter(e => !neu.has(e.schluessel) && !tafelAus.has(e.schluessel))
            .concat(liste).sort((x, y) => (x.zeit || 0) - (y.zeit || 0));
        const res = await svpAuth.api('svp_tafel?on_conflict=page,datum', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
            body: JSON.stringify({ page: plan.page, datum, kw, titel: plan.kurz, aufgaben, updated_at: jetzt.toISOString() })
        });
        const zeilen = res.ok ? await res.json() : null;
        if (!zeilen || !zeilen.length) {
            throw new Error(res.status === 401 || res.status === 403 || res.ok
                ? 'kein Schreibrecht – angemeldet als ' + (svpAuth.whoami() || '?') : 'HTTP ' + res.status);
        }
        try { localStorage.setItem(TAFEL_ZIEL, plan.page); } catch (_) {}
        tafelMerken(plan.page, neu);
        tafelStatus('Im Plan: ' + plan.kurz + ' · KW ' + kw + ' – ' + aufgaben.length +
            (aufgaben.length === 1 ? ' Aufgabe' : ' Aufgaben') + ', für alle sichtbar.');
        los.textContent = 'NOCHMAL SENDEN';
        const ansehen = o.querySelector('.ts-ansehen');
        ansehen.hidden = false;
        ansehen.onclick = () => window.open('decks/tafel.html?id=' + encodeURIComponent(zeilen[0].id), '_blank', 'noopener');
    } catch (e) {
        tafelStatus('Nicht gesendet: ' + e.message, true);
    }
    los.disabled = false;
}
// the arrow keys and Escape belong to the dialog while it is open (before the page's own)
window.addEventListener('keydown', e => {
    if (!document.querySelector('#tafel-overlay.open')) return;
    if (e.key === 'Escape') tafelDialog(false);
    if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation();
}, true);
