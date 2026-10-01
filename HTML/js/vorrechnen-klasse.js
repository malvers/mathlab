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
// Doc, 01.10.: two "nicht verstanden" on a task the moment it came up, with nobody pressing - a buzz went to the
// task on the board when it ARRIVED: the look every 5 s (school Wi-Fi drops the websocket) or a page busy for a
// moment brought the last taps of the old task onto the new one. Now it goes to the task and step that stood on
// the board when it was PRESSED (its row's time on the server; the laptop's clock is taken to be right, a buzz
// "from the future" counts as now). The board's states of today, one entry per change - kept over a reload, so a
// buzz pressed before it and arriving after still finds its task; while the page is closed nothing stood there.
const TAFEL_STAENDE = 'vorrechnen-tafelstaende';
const tafelStaende = (() => {
    try {
        const s = JSON.parse(localStorage.getItem(TAFEL_STAENDE) || '{}');
        return s.tag === new Date().toDateString() && Array.isArray(s.staende) ? s.staende : [];
    } catch (_) { return []; }
})();
// Doc, 01.10.: "Immer, wenn eine neue Aufgabe kommt oder ich die Seite neu lade oder ich von vorne anfange, müssen
// die Votes null sein" - the pill counts what was pressed since then; the history keeps everything (Wiedervorlage)
let pillenStart = Date.now();
function pilleNull() {                                       // also zeigeAufgabe: a task picked or started again
    pillenStart = Date.now();
    // the tempo counts per task too (Doc, 01.10.: "neutralisiert ... wenn wir eine neue Aufgabe machen"): 0 at once
    if (window.Buzzer && Buzzer.tempoJetzt) Buzzer.tempoJetzt();
}
function tafelStandDazu(aufgabe, schritt) {
    tafelStaende.push({ t: Date.now(), aufgabe, schritt });
    if (tafelStaende.length > 1000) tafelStaende.splice(0, tafelStaende.length - 1000);
    try { localStorage.setItem(TAFEL_STAENDE, JSON.stringify({ tag: new Date().toDateString(), staende: tafelStaende })); } catch (_) {}
}
function merkeTafelStand() {
    if (anzeigeModus) return;
    const aufgabe = aufgabenModus && AUFGABEN[aufgabeIdx] ? AUFGABEN[aufgabeIdx][0] : null, schritt = rechenweg.length;
    const l = tafelStaende[tafelStaende.length - 1];
    if (l && l.aufgabe === aufgabe && l.schritt === schritt) return;
    if (!l || l.aufgabe !== aufgabe) pilleNull();
    tafelStandDazu(aufgabe, schritt);
}
addEventListener('pagehide', () => { if (!anzeigeModus) tafelStandDazu(null, 0); });
// what stood on the board at time t; before the first state known today: nothing (not shown, not kept)
function tafelStandUm(t) {
    for (let k = tafelStaende.length - 1; k >= 0; k--) if (tafelStaende[k].t <= t) return tafelStaende[k];
    return { aufgabe: null, schritt: 0 };
}
function buzzLog() {
    try { const l = JSON.parse(localStorage.getItem('vorrechnen-buzzer') || '[]'); return Array.isArray(l) ? l : []; }
    catch (_) { return []; }
}
// one entry per buzz (by its id): which task was on the board, with today's code - a reload that brings
// the unseen ones back does not count them twice, and only a really new one makes the edge glow
function buzzerMeldung(n, neu, frisch = [], zeiten = {}, bezuege = {}) {
    if (anzeigeModus) return;                        // the beamer window never shows it
    // Doc, 27.09.: the count on the QR button "weg bitte und auch nicht gelb, denn wir haben ja die Pille
    // rechts oben" - the rail button stays plain (Buzzer.markiere is not used here)
    let log = buzzLog();
    // an answer that an older script logged as a question of its own (Doc, 01.10.: "die Rücknahme sehe ich nicht" -
    // the board still had yesterday's js/buzzer.js from the cache) is taken out again, and then counts as what it is
    const falsch = new Set(frisch.filter(id => bezuege[id]));
    const vorher = log.length;
    log = log.filter(e => !falsch.has(e.id));
    const bekannt = new Set(log.map(e => e.id));
    const neue = frisch.filter(id => !bekannt.has(id));
    if (neue.length || log.length !== vorher) {
        // no glow along the edge any more (Doc, 27.09.: "so einen kurzen Flash ... in Gelb bitte nicht
        // machen") - the pill alone tells it; Buzzer.blitz() stays in js/buzzer.js for other pages
        // the step on the board: 0 = the task itself, k = the k-th line of the working
        merkeTafelStand();
        const code = Buzzer.code(), jetzt = Date.now();
        neue.filter(id => !bezuege[id]).forEach(id => {
            const zeit = Math.min(zeiten[id] || jetzt, jetzt), { aufgabe, schritt } = tafelStandUm(zeit);
            log.push({ id, zeit, code, aufgabe, schritt });
        });
        // Doc, 01.10.: "wenn die Zahl wieder runter geht habe ich gut erklärt" - a "verstanden" marks the question it
        // answers (js/buzzer.js), which then no longer counts on its step's pill
        neue.filter(id => bezuege[id]).forEach(id => {
            const frage = log.find(e => e.id === bezuege[id]);
            if (frage) frage.verstanden = Math.min(zeiten[id] || jetzt, jetzt);
        });
        try { localStorage.setItem('vorrechnen-buzzer', JSON.stringify(log.slice(-500))); } catch (_) {}
        feedbackSenden();
    }
    zeigeBuzzAufgabe();
}

// Doc, 01.10.: "Die Idee ist aber trotzdem, sich das im Hintergrund zu merken ... welche Aufgabe wurde nicht wirklich
// verstanden ... das Feedback dazu nutzen, was wir üben müssen", "ja mit Tabelle in supa bitte", "Wiedervorlage nach
// Verstandengrad!" - every question with its task, step and time, and its "verstanden" once it came, in the table
// vorrechnen_feedback (one row per buzz, buzz_id; only the signed-in teacher's own rows: user_id = auth.uid()).
// The log on this device stays the source: what has not gone up yet (gesendet) goes with the next buzz or the next
// look at the Wiedervorlage - without a session, or offline, nothing is lost. The beamer window never sends.
const FEEDBACK_TABELLE = 'vorrechnen_feedback';
let feedbackLaeuft = null;
function feedbackStand(e) { return e.aufgabe + '|' + (e.schritt || 0) + '|' + (e.verstanden || ''); }
function feedbackSenden() {
    if (anzeigeModus) return Promise.resolve(false);
    if (feedbackLaeuft) return feedbackLaeuft;
    feedbackLaeuft = (async () => {
        try {
            await svpAnmeldungLaden();                         // js/vorrechnen-tafel.js
            if (!svpAuth.hasSession()) return false;
            const offen = buzzLog().filter(e => e.aufgabe && e.gesendet !== feedbackStand(e));
            if (!offen.length) return true;
            const res = await svpAuth.api(FEEDBACK_TABELLE + '?on_conflict=buzz_id', {
                method: 'POST',
                headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
                body: JSON.stringify(offen.map(e => ({
                    buzz_id: e.id, aufgabe: e.aufgabe, schritt: e.schritt || 0, code: e.code || null,
                    gedrueckt: new Date(e.zeit).toISOString(),
                    verstanden: e.verstanden ? new Date(e.verstanden).toISOString() : null })))
            });
            if (!res.ok) return false;
            // marked on the log as it is now: a buzz or a "verstanden" that came meanwhile stays to be sent
            const stand = new Map(offen.map(e => [e.id, feedbackStand(e)])), log = buzzLog();
            log.forEach(e => { if (stand.get(e.id) === feedbackStand(e)) e.gesendet = stand.get(e.id); });
            try { localStorage.setItem('vorrechnen-buzzer', JSON.stringify(log.slice(-500))); } catch (_) {}
            return true;
        } catch (_) { return false; }
        finally { feedbackLaeuft = null; }
    })();
    return feedbackLaeuft;
}
// Doc, 01.10.: "Wiederholung ... rechts ein x" - the x takes a task off the list (feedbackErledigt): everything pressed
// for it up to then is done with, a newer "nicht verstanden" brings it back with the new questions only. The moment
// is kept on this device (vorrechnen-wiederholung-aus) and in the cloud (erledigt on each of the task's rows), so
// another device learns it from the rows it reads. Nothing is deleted.
const ERLEDIGT_KEY = 'vorrechnen-wiederholung-aus';
function erledigtHier() {
    try { const m = JSON.parse(localStorage.getItem(ERLEDIGT_KEY) || '{}'); return m && typeof m === 'object' ? m : {}; }
    catch (_) { return {}; }
}
async function feedbackErledigt(aufgabe) {
    const jetzt = Date.now(), hier = erledigtHier();
    hier[aufgabe] = jetzt;
    try { localStorage.setItem(ERLEDIGT_KEY, JSON.stringify(hier)); } catch (_) {}
    try {
        await feedbackSenden();                         // its rows must be up there to be marked
        if (!(window.svpAuth && svpAuth.hasSession())) return false;
        const res = await svpAuth.api(FEEDBACK_TABELLE + '?aufgabe=eq.' + encodeURIComponent(aufgabe) + '&erledigt=is.null', {
            method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ erledigt: new Date(jetzt).toISOString() })
        });
        return res.ok;
    } catch (_) { return false; }
}
// the whole history per task: this device's log (the newest state) and the cloud's rows, each buzz once; what an x
// has done with (erledigtHier, the rows' erledigt) does not count.
// {proAufgabe: Map key -> {nicht, verstanden, zuletzt, schritte: {step: n}}, wolke: the cloud was read}
async function feedbackUebersicht() {
    const proAufgabe = new Map(), eintraege = new Map(), bis = new Map(Object.entries(erledigtHier()));
    const merke = (id, aufgabe, schritt, gedrueckt, verstanden) => {
        if (aufgabe && !eintraege.has(id)) eintraege.set(id, { aufgabe, schritt, gedrueckt, verstanden });
    };
    buzzLog().forEach(e => merke(e.id, e.aufgabe, e.schritt || 0, e.zeit, e.verstanden));
    let wolke = false;
    try {
        await feedbackSenden();
        if (window.svpAuth && svpAuth.hasSession()) {
            // PostgREST hands out 1000 rows at a time
            for (let ab = 0; ; ab += 1000) {
                const res = await svpAuth.api(FEEDBACK_TABELLE + '?select=buzz_id,aufgabe,schritt,gedrueckt,verstanden,erledigt' +
                    '&order=buzz_id&limit=1000&offset=' + ab);
                if (!res.ok) break;
                const zeilen = await res.json();
                zeilen.forEach(r => {
                    merke(r.buzz_id, r.aufgabe, r.schritt || 0, Date.parse(r.gedrueckt), r.verstanden);
                    if (r.erledigt) bis.set(r.aufgabe, Math.max(bis.get(r.aufgabe) || 0, Date.parse(r.erledigt)));
                });
                wolke = true;
                if (zeilen.length < 1000) break;
            }
        }
    } catch (_) { /* offline: this device's log alone */ }
    eintraege.forEach(e => {
        if ((e.gedrueckt || 0) <= (bis.get(e.aufgabe) || 0)) return;      // done with by an x
        let a = proAufgabe.get(e.aufgabe);
        if (!a) proAufgabe.set(e.aufgabe, a = { nicht: 0, verstanden: 0, zuletzt: 0, schritte: {} });
        a.nicht++;
        if (e.verstanden) a.verstanden++;
        a.zuletzt = Math.max(a.zuletzt, e.gedrueckt || 0);
        a.schritte[e.schritt] = (a.schritte[e.schritt] || 0) + 1;
    });
    return { proAufgabe, wolke };
}
// Doc, 27.09.: "grün, wenn null gebuzzert haben, und rot, wenn zwanzig ... Sind immer zwanzig in der Klasse. Also
// unser üblicher Farbverlauf" - green, orange at ten, red from twenty on (the palette), as a faint ground (0.14).
// Shared by the count behind a step and the tempo pills (Doc, 01.10.: "die Farbgebung genauso wie bei der grünen
// Pille ... je mehr gedrückt haben, desto rot").
function buzzGrund(n) {
    const t = Math.min(1, n / 20), mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u));
    const GRUEN = [121, 158, 49], ORANGE = [245, 194, 66], ROT = [176, 36, 24];
    const c = t <= 0.5 ? mix(GRUEN, ORANGE, t * 2) : mix(ORANGE, ROT, (t - 0.5) * 2);
    return `rgba(${c.join(', ')}, 0.14)`;
}
// Doc, 27.09.: first "in die erste Zeile ... ein Icon ... wie viele gebuzzert haben ... pro Aufgabe", then
// "eigentlich müsste ja die Pille pro Rechenschritt erscheinen ... wenn der nächste Schritt kommt, kommt
// die einfach dahinter und ist wieder null", "am rechten Rand" - one pill on the newest row's height (the
// task's before the first step), since 29.09. right behind its number (1), (2), ..., counting the buzzes of that step (today, this
// code); hidden while the finished tasks are pulled down.
// Doc, 29.09.: "Zeig bitte die Feedback-Pille rechts neben der Gleichungsnummer auch für die Zuschauer" - the
// count goes to the beamer as a mirrored layer of its own (SPIEGEL_SCHICHTEN); the faint pill behind the row
// stays Doc's. The beamer window never draws either itself: it shows mission control's copy.
function zeigeBuzzAufgabe() {
    if (anzeigeModus) return;
    merkeTafelStand();                                   // every change of task or step passes here
    let el = document.getElementById('buzz-aufgabe'), grund = document.getElementById('buzz-zeile');
    const schritt = rechenweg.length;
    const zellen = [...document.querySelectorAll(`#rechenweg-schicht [data-schritt="${schritt ? schritt - 1 : 'aufgabe'}"] .katex-html`)];
    if (!aufgabenModus || !window.Buzzer || !Buzzer.aktiv() || verlaufY > 0 || !zellen.length) {
        if (el) el.style.display = 'none';
        if (grund) grund.style.display = 'none';
        return;
    }
    if (!el) {
        el = document.createElement('div');
        el.id = 'buzz-aufgabe';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<span></span>';
        container.appendChild(el);
    }
    if (!grund) {                                        // the row's faint pill (see below)
        grund = document.createElement('div');
        grund.id = 'buzz-zeile';
        grund.setAttribute('aria-hidden', 'true');
        container.appendChild(grund);
    }
    const heute = new Date().toDateString(), key = AUFGABEN[aufgabeIdx][0], code = Buzzer.code();
    const n = buzzLog().filter(e => e.aufgabe === key && e.schritt === schritt && e.code === code && !e.verstanden &&
        e.zeit >= pillenStart && new Date(e.zeit).toDateString() === heute).length;
    // Doc, 29.09.: "bei 0 keine Pille und kein badge rechts" - both only once somebody has buzzed
    if (!n) { el.style.display = 'none'; grund.style.display = 'none'; return; }
    el.lastElementChild.textContent = String(n);
    // the colour by the count: buzzGrund (green, orange at ten, red from twenty on)
    // Doc, 29.09.: "mach das badge genauso transp wie die Eq. Pille" - one faint ground for both (until then
    // the badge was solid); on it the number in the board's ink, dark on sand, light on the dark board
    const grundFarbe = buzzGrund(n);
    el.style.background = grundFarbe;
    el.style.color = anzeige(INK);
    el.title = n === 1 ? '1 × nicht verstanden bei diesem Schritt' : n + ' × nicht verstanden bei diesem Schritt';
    // right behind the row's ink, on its middle
    const c0 = container.getBoundingClientRect();
    let links = Infinity, rechts = -Infinity, oben = Infinity, unten = -Infinity;
    zellen.forEach(z => {
        const r = z.getBoundingClientRect();
        if (r.width) { links = Math.min(links, r.left); rechts = Math.max(rechts, r.right); oben = Math.min(oben, r.top); unten = Math.max(unten, r.bottom); }
    });
    if (!isFinite(rechts)) { el.style.display = 'none'; grund.style.display = 'none'; return; }
    // Doc, 27.09.: "macht das bitte am rechten Rand" - on the step's height, at the board's right edge;
    // "wenn dann Bruch steht ... auf Y zentriert auf den Bruchstrich" - with a fraction in the row its bar
    // (the widest, the main one) is the middle, else the middle of the ink
    // Doc, 29.09.: "die Pille sitzt zu tief" - the middle of the INK, from KaTeX's struts (each spans its
    // formula from its top to its depth); the rows' boxes carry the line height and reach further down than
    // the ink (measured on 4x = 12: 6 px too low)
    let so = Infinity, su = -Infinity;
    zellen.forEach(z => z.querySelectorAll('.strut').forEach(st => {
        const r = st.getBoundingClientRect();
        if (r.height) { so = Math.min(so, r.top); su = Math.max(su, r.bottom); }
    }));
    let mitte = isFinite(so) ? (so + su) / 2 : (oben + unten) / 2, breit = 0;
    document.querySelectorAll(`#rechenweg-schicht [data-schritt="${schritt ? schritt - 1 : 'aufgabe'}"] .frac-line`).forEach(f => {
        const r = f.getBoundingClientRect();
        if (r.width > breit) { breit = r.width; mitte = r.top + r.height / 2; }
    });
    // Doc, 29.09.: "bitte y zent" - behind a number the pill is centred on it: the middle of the (1)'s box
    // (its brackets reach as far above the axis as below it, so that is where a fraction bar sits too);
    // the middle of the row's boxes stood about 7 px above it (measured on x = 5 with its (1))
    const nummer = schritt ? document.querySelector(`#rechenweg-schicht .rw-nummer[data-nummer="${schritt - 1}"]`) : null;
    const nr = nummer && (nummer.querySelector('.katex-html') || nummer).getBoundingClientRect();
    if (nr && nr.height) mitte = nr.top + nr.height / 2;
    const h = Math.round(ZEILE * 0.62);                 // it fits a row with air above and below
    const top = Math.round(mitte - c0.top - h / 2);
    el.style.height = h + 'px';
    el.style.top = top + 'px';
    el.style.fontSize = Math.round(h * 0.6) + 'px';
    el.style.display = '';
    // Doc, 29.09.: "hinterleg die Gleichung mit einer dezenten Pille mit der Farbe, aber trans" - the row
    // itself on a faint pill in the count's colour, under the ink.
    // Doc, 29.09.: "wenn da ein Bruch steht oder wenn da ... ist gleich 2 doppelt unterstrichen steht, dann
    // passt die Pille nie wirklich" - it hugs the row's real ink now (tinte(), vorrechnen-erkennen.js): the
    // KaTeX boxes it took before are taller than the glyphs, and a denominator raised by engeBrueche keeps
    // its full depth there. The result's double underline is an element of its own under the row (same
    // data-schritt, no formula) and is taken in too.
    let io = Infinity, iu = -Infinity;
    document.querySelectorAll(`#rechenweg-schicht [data-schritt="${schritt ? schritt - 1 : 'aufgabe'}"]`).forEach(d => {
        const k = d.querySelector('.katex-html'), r = d.getBoundingClientRect();
        const t = k ? tinte(k) : (r.width && r.height ? { o: r.top, u: r.bottom } : null);
        if (t) { io = Math.min(io, t.o); iu = Math.max(iu, t.u); }
    });
    if (!isFinite(io)) { io = oben; iu = unten; }
    const luftY = Math.round(ZEILE * 0.14), halb = (iu - io) / 2 + luftY;
    // a row of one line stays a pill; a taller one (a fraction, a root over a fraction) rounds its corners
    // by half a line only - fully round ends grew so wide they ran under the count behind the row. The air
    // at the sides is enough that the ink's corners stay inside the rounding.
    const rund = Math.min(halb, ZEILE * 0.5);
    const luftX = Math.max(Math.round(ZEILE * 0.4), Math.ceil(rund - Math.sqrt(rund * rund - (rund - luftY) ** 2)) + 2);
    grund.style.borderRadius = Math.round(rund) + 'px';
    grund.style.left = Math.round(links - c0.left - luftX) + 'px';
    grund.style.width = Math.round(rechts - links + 2 * luftX) + 'px';
    grund.style.top = Math.round(io - c0.top - luftY) + 'px';
    grund.style.height = Math.round(iu - io + 2 * luftY) + 'px';
    grund.style.background = grundFarbe;
    grund.style.display = '';
    // Doc, 29.09.: "bring die feedback pille hinter die (#)" - right behind the step's number (1), (2), ...;
    // the task has none, there right behind its ink. Never further right than the tip of ▶ ends (Doc,
    // 27.09.: "genauso weit nach rechts wie das Dreieck" - read off the arrow, 9 px when there is none), and
    // in the first row not under the arrow itself (the top right corner, the right 56 px): a pill that would
    // reach there stands flush against that limit instead
    const hinter = (nr && nr.width ? nr.right : rechts) - c0.left;
    const spitze = document.querySelector('#tafel-pfeil-vor path');
    const sr = spitze && spitze.getBoundingClientRect();
    const rand = sr && sr.width ? Math.round(c0.right - sr.right) : 9;
    const grenze = c0.width - (top < ZEILE / 2 + 24 + 4 ? rand + 56 : rand);
    el.style.right = 'auto';
    // Doc, 29.09.: "das Badge 20% nach rechts" - a fifth of its own width further away from the number
    el.style.left = Math.round(Math.min(hinter + h * 0.4 + el.offsetWidth * 0.2, grenze - el.offsetWidth)) + 'px';
    anzeigeBald();                                   // the first count: its layer is not watched yet
}
function buzzerKnopf() {
    if (!window.Buzzer) return;
    Buzzer.tempo(tempoMeldung, () => pillenStart);
    texteAnmelden();
    if (!Buzzer.aktiv()) Buzzer.start(buzzerMeldung);
    buzzerKarte();                                   // always the QR - the count is the pill in the first row
}
// Doc, 01.10.: "Das soll mir Feedback geben, ob ich zu schnell erkläre oder zu langsam erkläre ... bei mir ... in
// Mission Control" - the phones' tempo since the task came on the board, "pro Aufgabe" like the count (js/buzzer.js:
// Buzzer.tempo, pillenStart), then "bitte unten unter
// die Trennlinie oben in die Mitte ... muss nicht so krass sein ... so transparent wie die Zahl selbst": centred just
// under the line over the squares (namenLinie), faint pills like the count behind a step's number - coloured like
// it, green to red with the number of presses, the board's ink on them. Not a mirrored layer, and hidden in the beamer
// window (vorrechnen.css): his alone.
let tempoLetzt = null, texteLetzt = { texte: [], angemeldet: false };
function tempoMeldung(s) {
    if (anzeigeModus) return;
    tempoLetzt = s;
    pillenZeichnen(s && s.neu, false);
}
// Doc, 01.10.: "mach unten ein Feld. Für Feedback ... wo man das dann bei mir im Mission Control ... zeigen" - the
// phones' written feedback (js/buzzer.js: Buzzer.texte, readable with Doc's SVP session only) as a 💬 pill with the
// number of today's comments, then "das Kommentarding in die Mitte. Zwischen Runner und Schnecke ... keinen extra Dialog ...
// wenn ich auf die Blase ticke, soll klein drunter mit genau den gleichen Rundungen eine Box kommen mit den
// Kommentaren ... wenn ich noch mal klicke, soll es wieder einklappen": 🏃 💬 🐌 in one row, a tap on 💬 folds the
// box under it open and shut; shutting it marks them read. Today's, of today's code.
const TEXTE_GELESEN = 'vorrechnen-texte-gelesen';
let texteOffen = false;
function texteGelesen() { try { return +localStorage.getItem(TEXTE_GELESEN) || 0; } catch (_) { return 0; } }
function texteMeldung(t) {
    if (anzeigeModus) return;
    texteLetzt = t || { texte: [] };
    if (!(texteLetzt.texte || []).length) texteOffen = false;
    pillenZeichnen(null, !!(t && t.neu));
}
function texteKlappen() {
    if (texteOffen) {                                   // shut: what was open is read now
        const max = Math.max(texteGelesen(), ...(texteLetzt.texte || []).map(x => x.id));
        try { localStorage.setItem(TEXTE_GELESEN, String(max)); } catch (_) {}
    }
    texteOffen = !texteOffen;
    pillenZeichnen(null, false);
}
const APPLE_BILD = 'https://cdn.jsdelivr.net/gh/iamcal/emoji-data@master/img-apple-160/';
function pillenZeichnen(neuTempo, neuText) {
    const s = tempoLetzt, texte = texteLetzt.texte || [];
    let el = document.getElementById('tempo-pille');
    // Doc, 01.10.: "Wenn überhaupt kein zu langsam oder zu schnell da ist, mal die Bubbles immer aber grau in dem
    // üblichen Stil wie ... der Papierkorb ... wenn sie da sind, werden sie bunt ... das Icon soll vorher auch da sein
    // aber grayed" - the three always stand while the buzzer listens; empty they are pale with a grey icon, no number
    if (!el) {
        el = document.createElement('div');
        el.id = 'tempo-pille';
        container.appendChild(el);
    }
    el.textContent = '';
    const reihe = document.createElement('div');
    reihe.className = 'pillen-reihe';
    el.appendChild(reihe);
    const ink = anzeige(INK);
    const puls = p => { if (p.animate) p.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' }); };
    const pille = (code, klasse) => {
        const p = document.createElement('span');
        p.className = 'ic-pille' + (klasse ? ' ' + klasse : '');
        p.style.color = ink;
        const bild = document.createElement('img');
        bild.src = APPLE_BILD + code + '.png';
        bild.alt = '';
        p.appendChild(bild);
        return p;
    };
    // the colour as on the count behind a step: the more pressed, the redder (buzzGrund). Doc, 01.10.: "die Pille mit
    // dem Icon finde ich super ... Runner und Schnecke" - Apple's 🏃 (mirrored: "den Runner bitte spiegeln") and 🐌
    // with the number, the words in the tooltip
    const tempo = (art, wort, code, klasse) => {
        const n = s && s[art] || 0;
        const p = pille(code, (klasse ? klasse + ' ' : '') + (n ? '' : 'leer'));
        if (n) {
            p.appendChild(document.createTextNode(String(n)));
            p.style.background = buzzGrund(n);
        }
        p.title = n ? n + ' × ' + wort + ' bei dieser Aufgabe' : 'noch kein „' + wort + '“ bei dieser Aufgabe';
        reihe.appendChild(p);
        if (n && neuTempo === art) puls(p);
    };
    tempo('schnell', 'zu schnell', '1f3c3', 'gespiegelt');
    if (!texte.length) {
        const p = pille('1f4ac', 'tx-pille leer');
        p.title = texteLetzt.angemeldet === false ? 'Feedback-Nachrichten – nur mit Anmeldung im Stoffverteilungsplan' : 'heute noch keine Feedback-Nachricht';
        reihe.appendChild(p);
    } else {
        const gelesen = texteGelesen(), neu = texte.filter(x => x.id > gelesen).length;
        const p = pille('1f4ac', 'tx-pille' + (neu ? ' ungelesen' : '') + (texteOffen ? ' offen' : ''));
        // all of today's (Doc, 01.10.: "die eins ... passt nicht. Das sind vier Kommentare"); what is new shows in the
        // yellow ground and the bold lines in the box
        p.appendChild(document.createTextNode(String(texte.length)));
        p.title = texte.length + ' Feedback-Nachricht' + (texte.length === 1 ? '' : 'en') + ' heute' + (neu ? ', ' + neu + ' neu' : '') +
            (texteOffen ? ' – antippen zum Einklappen' : ' – antippen');
        p.addEventListener('click', texteKlappen);
        reihe.appendChild(p);
        if (neuText) puls(p);
    }
    tempo('langsam', 'zu langsam', '1f40c');
    // the box under the row: newest first, the time and the words - as text only, never as markup (any phone wrote them)
    if (texteOffen && texte.length) {
        const box = document.createElement('div');
        box.className = 'tx-box';
        box.style.color = ink;
        const gelesen = texteGelesen();
        texte.slice().sort((a, b) => b.id - a.id).forEach(x => {
            const d = document.createElement('div');
            d.className = 'tx' + (x.id > gelesen ? ' neu' : '');
            const zeit = document.createElement('span');
            zeit.className = 'tx-zeit';
            const t = new Date(x.t);
            zeit.textContent = String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0');
            const text = document.createElement('span');
            text.className = 'tx-text';
            text.textContent = x.text;
            d.append(zeit, text);
            box.appendChild(d);
        });
        el.appendChild(box);
    }
    el.style.display = 'flex';
    tempoLegen(el);
}
// the texts are read with Doc's SVP session: its script comes along (the login itself stays the SVP's)
function texteAnmelden() {
    Buzzer.texte(texteMeldung);
    if (!window.svpAuth) ladeSkript('svp/svp-auth.js').catch(() => {});
}
// Doc, 01.10.: "mittig in der linken Box, also sozusagen über den Radiergummi, denn das ist der Bereich, wo ich im
// Wesentlichen arbeite" - over the eraser's middle (it sits centred at the foot of the left box); without it the
// middle between the board's left edge and the line of the notes (#notiz-rand)
function tempoLegen(el) {
    const c0 = container.getBoundingClientRect();
    const rad = document.getElementById('radierer'), rand = document.getElementById('notiz-rand');
    const r = rad && rad.getBoundingClientRect(), n = rand && rand.getBoundingClientRect();
    const mitte = r && r.width ? r.left + r.width / 2 : n && n.width ? (c0.left + n.left) / 2 : c0.left + c0.width / 2;
    el.style.left = Math.round(mitte - c0.left) + 'px';
    el.style.top = Math.round(namenLinie() + 10) + 'px';
}
addEventListener('resize', () => {
    const el = document.getElementById('tempo-pille');
    if (el && el.style.display !== 'none') tempoLegen(el);
});
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
            // the QR alone (Doc, 01.10.: "alles raus bitte auch den Header") - no "NEUER CODE" / "FERTIG" any more:
            // the ✕, a click beside it or Esc closes; the code is a new one every day anyway
            '<div class="bz-karte"></div></div>';
        o.addEventListener('click', e => { if (e.target === o) buzzerKarte(false); });
        o.querySelector('.cyber-modal-x').addEventListener('click', () => buzzerKarte(false));
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
    if (e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') e.stopPropagation();
}, true);
