// Doc Alvers Mathe-Labor - the "nicht verstanden" buzzer, the teacher's side. Central: any lab or deck may use it.
//
// Doc, 26.09.2026: "Ich würde den Kindern gerne einen Buzzer geben. Nicht, dass ich hören kann, welches Pad oder
// welcher Computer ringt, sondern dass ich nur sehe, vorne bei mir ... dass irgendjemand gesagt hat, er versteht das
// nie. So dass ich es nochmal erklären kann ... dass die Kinder sich nicht schämen, zum 25. Mal zu fragen" - and on
// 27.09.: "mach mal für allgemein bitte ... aber jetzt für vorr".
//
// The class opens buzzer.html?c=<code> (the QR on the board) and taps one button. A tap is one row in the table
// buzzer: the code and the time - no device, no name (RLS: everyone inserts the code only and reads the last day,
// at most 40 a minute per code). This side listens - realtime, and a look every 5 s as a net, because school Wi-Fi
// drops websockets (see vote.html) - and tells its page, which shows it silently where only the teacher looks.
//
//   Buzzer.start(onBuzz)     listen to today's code; onBuzz(n, neu, frisch, zeiten, bezuege): n buzzes not seen and
//                            not understood yet, neu = one just came, frisch = the ids of the rows that came just now,
//                            zeiten = {id: ms} when each was pressed (the server's time of its row - it may arrive
//                            seconds later), bezuege = {id: the buzz it answers} for a "verstanden"
//
// Doc, 01.10.2026: "wenn die Zahl wieder runter geht habe ich gut erklärt" - after its "nicht verstanden" a phone's
// button turns red ("DRÜCKEN, WENN VERSTANDEN"); that tap is a row of its own with bezug = the id it answers (one
// per question, of the same code and day - the table's insert policy), and the count goes down again.
//   Buzzer.weiter(onBuzz)    the same, but only if it was listening today already (a reload keeps it running)
//   Buzzer.gesehen()         the teacher has seen them: back to 0
//   Buzzer.neuerCode()       a fresh code - for the next class; phones with the old one no longer count
//   Buzzer.karte()           an element with inline styles only: the QR (for an overlay, or a beamer twin)
//   Buzzer.markiere(el, n)   the central mark on a button: orange, a number, one pulse when it rises
//   Buzzer.blitz()           a short orange glow along the screen edge (never on a mirrored layer)
//   Buzzer.tempo(onTempo, ab) the phones' "zu schnell" / "zu langsam" (Doc, 01.10.2026): onTempo({schnell, langsam,
//                            neu}) with the counts since ab() (Vorrechnen: since the task came on the board; without
//                            ab: the last two minutes), at every change and every 5 s; Buzzer.tempoJetzt() at once
//   Buzzer.tempoMarke(el, s) shows such a count beside a button, left of it (the teacher's side only)
//   Buzzer.texte(onTexte)    the phones' written feedback of today (table buzzer_text, Doc 01.10.2026): onTexte({texte,
//                            angemeldet, neu}) every 5 s; readable only with the teacher's svpAuth session
//   Buzzer.texte(onTexte, { schluessel: true })   the same without a session (rueckmeldung.html, Doc 07.10.2026):
//                            the code is claimed for the day with a key of this device; if another has claimed it,
//                            a fresh code follows and window hears 'buzzer-code'
//   Buzzer.aktiv(), Buzzer.code()
(function () {
    'use strict';
    const DB_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
    const DB_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';     // publishable (public by design)
    // the class always goes to the live page - a phone cannot reach a teacher's localhost
    const SEITE = 'https://www.docalvers.de/buzzer.html';
    const ORANGE = 'rgb(245, 194, 66)';
    const KEY_CODE = 'buzzer-code', KEY_GESEHEN = 'buzzer-gesehen', KEY_AKTIV = 'buzzer-aktiv';
    const me = document.currentScript;
    const DIR = me && me.src ? me.src.replace(/[^/]*$/, '') : 'js/';

    const lies = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (_) { return d; } };
    const schreib = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* private window: the session keeps it */ } };
    const heute = () => new Date().toDateString();

    // ---- the code: one a day, a fresh one on demand ------------------------------------------------------------
    function neuerCode() {
        const alt = (lies(KEY_CODE, {}) || {}).code;
        let c;
        do { c = String(1000 + Math.floor(Math.random() * 9000)); } while (c === alt);
        schreib(KEY_CODE, { code: c, tag: heute() });
        schreib(KEY_GESEHEN, 0);
        if (laeuft) verbinden();
        return c;
    }
    function code() {
        const k = lies(KEY_CODE, null);
        return k && k.tag === heute() && /^\d{4}$/.test(k.code) ? k.code : neuerCode();
    }
    function link() { return SEITE + '?c=' + code(); }

    // ---- listening ----------------------------------------------------------------------------------------------
    let laeuft = false, melde = null, ids = new Set(), offen = new Set(), kanal = null, sb = null, timer = null, bisher = 0;
    // ladeSkript: js/lade-skript.js, loaded before this file
    // onBuzz(n, neu, frisch): frisch = the ids that came just now - a page that keeps a log counts by id, so two
    // buzzes in one look count twice and a reload does not count the unseen ones again
    function zaehlen(neue, zeiten = {}, bezuege = {}) {
        const gesehen = lies(KEY_GESEHEN, 0) || 0, frisch = [];
        neue.forEach(id => { if (id > gesehen && !ids.has(id)) { ids.add(id); frisch.push(id); } });
        if (!frisch.length) return;
        frisch.forEach(id => { if (!bezuege[id]) offen.add(id); });            // the questions first, then
        frisch.forEach(id => { if (bezuege[id]) offen.delete(bezuege[id]); });  // what answers them (one look may bring both)
        bisher = offen.size;
        if (melde) melde(bisher, frisch.some(id => !bezuege[id]), frisch, zeiten, bezuege);
    }
    // rows -> {id: the buzz a "verstanden" answers} (before the column existed: none)
    function bezuegeAus(zeilen) {
        const b = {};
        zeilen.forEach(r => { if (r && r.bezug) b[r.id] = r.bezug; });
        return b;
    }
    // rows -> {id: ms of created_at}; a timestamptz may come as "2026-10-01 06:27:05.25+00" or without a zone (UTC)
    function zeitenAus(zeilen) {
        const z = {};
        zeilen.forEach(r => {
            if (!r || typeof r.created_at !== 'string') return;
            let t = r.created_at.trim().replace(' ', 'T').replace(/([+-]\d\d)$/, '$1:00');     // ISO wants +00:00
            if (!/(Z|[+-]\d\d(:?\d\d)?)$/.test(t)) t += 'Z';
            const ms = Date.parse(t);
            if (!isNaN(ms)) z[r.id] = ms;
        });
        return z;
    }
    // the net: what came since the last one seen (also after a reload, a lost websocket, a sleeping laptop)
    async function nachsehen() {
        const c = code(), gesehen = lies(KEY_GESEHEN, 0) || 0;
        try {
            // select=*: the column bezug is read where the table has it
            const res = await fetch(DB_URL + '/rest/v1/buzzer?code=eq.' + c + '&id=gt.' + gesehen + '&select=*&order=id',
                { headers: { apikey: DB_KEY }, cache: 'no-store' });
            if (res.ok) { const zeilen = await res.json(); zaehlen(zeilen.map(r => r.id), zeitenAus(zeilen), bezuegeAus(zeilen)); }
        } catch (_) { /* offline for a moment - the next look catches up */ }
    }
    // ---- the tempo (Doc, 01.10.2026: "Das soll mir Feedback geben, ob ich zu schnell erkläre oder zu langsam
    // erkläre"): the phones' "zu schnell" / "zu langsam" are rows of the table buzzer_tempo - a table of its own, since
    // a tab with the old code counts every row of buzzer as a question. Counted from the moment the page names (then
    // "pro Aufgabe ... neutralisiert, wenn wir eine neue Aufgabe machen": Vorrechnen gives the time its task came on
    // the board), else over the last two minutes; the look every 5 s refreshes it.
    const TEMPO_FENSTER = 120000;
    let tempoMelde = null, tempoAb = null, tempoZeilen = new Map();         // id -> {art, t}
    function tempoSeit() {
        const a = tempoAb ? tempoAb() : NaN;
        return a > 0 ? a : Date.now() - TEMPO_FENSTER;
    }
    function tempoStand(neu) {
        const seit = tempoSeit(), s = { schnell: 0, langsam: 0, neu: neu || null };
        tempoZeilen.forEach((z, id) => { if (z.t < seit) tempoZeilen.delete(id); else s[z.art]++; });
        return s;
    }
    function tempoDazu(zeilen) {
        const zeiten = zeitenAus(zeilen), seit = tempoSeit();
        let neu = null;
        zeilen.forEach(r => {
            if (!r || (r.art !== 'schnell' && r.art !== 'langsam') || tempoZeilen.has(r.id)) return;
            const t = zeiten[r.id] || Date.now();
            if (t < seit) return;                                           // pressed before what counts now
            tempoZeilen.set(r.id, { art: r.art, t });
            neu = r.art;
        });
        if (tempoMelde) tempoMelde(tempoStand(neu));
    }
    async function tempoNachsehen() {
        try {
            const ab = new Date(tempoSeit()).toISOString();
            const res = await fetch(DB_URL + '/rest/v1/buzzer_tempo?code=eq.' + code() + '&created_at=gt.' + encodeURIComponent(ab) +
                '&select=id,art,created_at&order=id', { headers: { apikey: DB_KEY }, cache: 'no-store' });
            if (res.ok) tempoDazu(await res.json());
        } catch (_) { /* offline for a moment - the next look catches up */ }
    }
    // ---- written feedback (Doc, 01.10.2026: "ein Feld. Für Feedback. Wo die mir also tatsächlich irgendwas schreiben
    // können ... bei mir im Mission Control"): rows of buzzer_text, today's of this code. Only a signed-in teacher may
    // read them (svpAuth - the page brings it along), so without a session there is nothing to show.
    let texteMelde = null, texteMitSchluessel = false, texte = new Map();  // id -> {id, text, t}
    function texteDazu(zeilen) {
        const zeiten = zeitenAus(zeilen);
        let neu = false;
        zeilen.forEach(r => {
            if (!r || texte.has(r.id)) return;
            texte.set(r.id, { id: r.id, text: String(r.text || ''), t: zeiten[r.id] || Date.now() });
            neu = true;
        });
        texteMelde({ texte: [...texte.values()], angemeldet: true, neu });
    }
    async function texteNachsehen() {
        if (!texteMelde) return;
        const auth = window.svpAuth;
        if (!auth || !auth.hasSession || !auth.hasSession()) {
            if (texteMitSchluessel) texteMitSchluesselNachsehen();
            else texteMelde({ texte: [], angemeldet: false, neu: false });
            return;
        }
        try {
            const heute0 = new Date(); heute0.setHours(0, 0, 0, 0);
            const res = await auth.api('buzzer_text?code=eq.' + code() + '&created_at=gt.' + encodeURIComponent(heute0.toISOString()) +
                '&select=id,text,created_at&order=id');
            if (res.ok) texteDazu(await res.json());
        } catch (_) { /* offline for a moment - the next look catches up */ }
    }
    // ---- the texts without a session (Doc, 07.10.2026: rueckmeldung.html for colleagues, who have no SVP login):
    // a 4-digit code alone must not open what a class wrote, so the page claims its code for the day with a random
    // key that never leaves this device - the first claim of a code wins, and only that key reads the texts written
    // since (functions buzzer_anmelden / buzzer_texte, supabase/migrations/20261007_buzzer_besitz.sql). A code
    // another page has claimed today is given up for a fresh one, a few times at most.
    const KEY_SCHLUESSEL = 'buzzer-schluessel';
    let besitzVersuche = 0;
    function neuerSchluessel() {
        const b = new Uint8Array(16);
        crypto.getRandomValues(b);
        return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
    }
    function rpc(name, args) {
        return fetch(DB_URL + '/rest/v1/rpc/' + name, {
            method: 'POST', cache: 'no-store',
            headers: { apikey: DB_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify(args)
        });
    }
    // the key of today's code, claimed if need be; null: offline, or the code is another's (a fresh one follows).
    // One claim at a time: on the first start of a day the connection is made twice, and two claims racing each
    // other could take the page's own code for another's.
    let besitzLaeuft = null;
    function schluessel() {
        if (!besitzLaeuft) besitzLaeuft = anmelden().finally(() => { besitzLaeuft = null; });
        return besitzLaeuft;
    }
    async function anmelden() {
        const c = code(), s = lies(KEY_SCHLUESSEL, null);
        const meins = s && s.code === c && s.tag === heute() && typeof s.key === 'string';
        if (meins && s.ok) return s.key;
        // kept before it is sent, so a reload in between claims with the same key
        const key = meins ? s.key : neuerSchluessel();
        schreib(KEY_SCHLUESSEL, { code: c, tag: heute(), key, ok: false });
        const res = await rpc('buzzer_anmelden', { p_code: c, p_schluessel: key });
        if (!res.ok || c !== code()) return null;                     // the code changed meanwhile: the next look
        if (await res.json() === true) {
            schreib(KEY_SCHLUESSEL, { code: c, tag: heute(), key, ok: true });
            besitzVersuche = 0;
            return key;
        }
        if (++besitzVersuche <= 5) {
            neuerCode();
            dispatchEvent(new CustomEvent('buzzer-code', { detail: code() }));
        }
        return null;
    }
    async function texteMitSchluesselNachsehen() {
        try {
            const c = code(), key = await schluessel();
            if (!key || c !== code()) return;
            const res = await rpc('buzzer_texte', { p_code: c, p_schluessel: key });
            if (res.ok && c === code()) texteDazu(await res.json());
        } catch (_) { /* offline for a moment - the next look catches up */ }
    }
    async function verbinden() {
        ids = new Set();
        offen = new Set();
        bisher = 0;
        tempoZeilen = new Map();
        texte = new Map();
        if (melde) melde(0, false);
        if (tempoMelde) tempoMelde(tempoStand());
        clearInterval(timer);
        timer = setInterval(() => { nachsehen(); tempoNachsehen(); texteNachsehen(); }, 5000);
        nachsehen();
        tempoNachsehen();
        texteNachsehen();
        try {
            if (!window.supabase) await ladeSkript(DIR + 'vendor/supabase.min.js');
            if (!sb) sb = window.supabase.createClient(DB_URL, DB_KEY, { auth: { persistSession: false } });
            if (kanal) { sb.removeChannel(kanal); kanal = null; }
            const c = code();
            kanal = sb.channel('buzzer:' + c)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'buzzer', filter: 'code=eq.' + c },
                    p => { if (p.new && p.new.code === code()) zaehlen([p.new.id], zeitenAus([p.new]), bezuegeAus([p.new])); })
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'buzzer_tempo', filter: 'code=eq.' + c },
                    p => { if (p.new && p.new.code === code()) tempoDazu([p.new]); })
                .subscribe();
        } catch (_) { /* no realtime (school Wi-Fi): the look every 5 s carries it alone */ }
    }
    function start(onBuzz) {
        if (onBuzz) melde = onBuzz;
        schreib(KEY_AKTIV, heute());
        if (!laeuft) { laeuft = true; verbinden(); }
        return code();
    }
    function weiter(onBuzz) {
        if (lies(KEY_AKTIV, '') === heute()) start(onBuzz);
        else if (onBuzz) melde = onBuzz;
    }
    function gesehen() {
        const max = Math.max(lies(KEY_GESEHEN, 0) || 0, ...ids);
        schreib(KEY_GESEHEN, max);
        ids = new Set();
        offen = new Set();
        bisher = 0;
        if (melde) melde(0, false);
    }

    // ---- the card for the board: "FEEDBACK" over the QR - inline styles, so a twin on the beamer looks the same ------
    // Doc, 01.10.2026: "alles raus bitte auch den Header" - no code in figures, no address any more; then "Vielleicht
    // machen wir doch einen Header für Feedback": one word, since the phone has three kinds of it now
    function karte() {
        const k = document.createElement('div');
        k.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:18px;' +
            'font-family:Orbitron,sans-serif;color:#eaf0f7';
        const titel = document.createElement('div');
        titel.style.cssText = 'font-size:clamp(1.1rem,2.6vw,1.6rem);letter-spacing:0.18em;text-indent:0.18em';
        titel.textContent = 'FEEDBACK';
        const qr = document.createElement('div');
        qr.style.cssText = 'width:min(52vh,70vw);aspect-ratio:1;background:#fff;padding:14px;border-radius:14px;box-sizing:border-box';
        try {
            const q = qrcode(0, 'M');
            q.addData(link());
            q.make();
            qr.innerHTML = q.createSvgTag({ scalable: true, margin: 0 });
            const svg = qr.firstElementChild;
            if (svg) svg.style.cssText = 'width:100%;height:100%;display:block';
        } catch (_) { qr.textContent = link(); qr.style.color = '#0b1a33'; }
        k.append(titel, qr);
        return k;
    }
    // the QR library comes along only when the card is needed
    async function karteBereit() {
        if (typeof qrcode === 'undefined') await ladeSkript(DIR + '../svp/qrcode.min.js');
        return karte();
    }

    // ---- showing it: the central mark, silent -------------------------------------------------------------------
    function markiere(el, n) {
        if (!el) return;
        let z = el.querySelector(':scope > .buzz-zahl');
        if (n > 0) {
            if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
            if (!z) {
                z = document.createElement('span');
                z.className = 'buzz-zahl';
                z.setAttribute('aria-hidden', 'true');
                z.style.cssText = 'position:absolute;top:-7px;right:-7px;min-width:22px;height:22px;padding:0 6px;' +
                    'box-sizing:border-box;border-radius:11px;pointer-events:none;text-align:center;' +
                    'font:700 12px/22px Orbitron,sans-serif;color:#0b1a33;background:' + ORANGE;
                el.appendChild(z);
            }
            const vorher = +z.textContent || 0;
            z.textContent = n > 99 ? '99+' : String(n);
            el.style.setProperty('border-color', ORANGE, 'important');
            el.style.setProperty('box-shadow', '0 0 20px rgba(245, 194, 66, 0.65)', 'important');
            el.style.setProperty('color', ORANGE, 'important');
            if (n > vorher && el.animate) {
                el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.22)' }, { transform: 'scale(1)' }],
                    { duration: 700, iterations: 2, easing: 'ease-out' });
            }
        } else {
            if (z) z.remove();
            ['border-color', 'box-shadow', 'color'].forEach(p => el.style.removeProperty(p));
        }
    }
    // "bang, schlägt was auf" - without a sound: the screen's edge glows orange for a moment
    function blitz() {
        const b = document.createElement('div');
        b.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60000;' +
            'box-shadow:inset 0 0 0 6px ' + ORANGE + ', inset 0 0 60px rgba(245, 194, 66, 0.55)';
        document.body.appendChild(b);
        const a = b.animate ? b.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 1, offset: 0.5 }, { opacity: 0 }],
            { duration: 1800, easing: 'ease-out' }) : null;
        if (a) a.onfinish = () => b.remove(); else setTimeout(() => b.remove(), 1800);
    }

    // the tempo beside a button (the teacher's only - put it where the beamer does not look): "ZU SCHNELL 3" in Doc's
    // red, "ZU LANGSAM 1" in his orange, a short pulse on the one that just came, gone when both are 0. It lies on
    // the page itself, left of the button where it is now: a rail that clips (Vorrechnen's right-rail) would cut it.
    const ROT = 'rgb(176, 36, 24)';
    function tempoLegen(el, m) {
        const r = el.getBoundingClientRect();
        m.style.display = r.width ? 'flex' : 'none';               // the button hidden (e.g. a closed rail): so is this
        m.style.right = Math.round(innerWidth - r.left + 10) + 'px';
        m.style.top = Math.round(r.top + r.height / 2) + 'px';
    }
    function tempoMarke(el, s) {
        if (!el) return;
        let m = el._buzzTempo;
        if (!s || (!s.schnell && !s.langsam)) { if (m) { m.remove(); el._buzzTempo = null; } return; }
        if (!m || !m.isConnected) {
            m = el._buzzTempo = document.createElement('span');
            m.className = 'buzz-tempo';
            m.style.cssText = 'position:fixed;transform:translateY(-50%);z-index:2200;' +
                'flex-direction:column;align-items:flex-end;gap:4px;pointer-events:none';
            document.body.appendChild(m);
            addEventListener('resize', () => { if (el._buzzTempo === m) tempoLegen(el, m); });
        }
        tempoLegen(el, m);
        m.title = 'Tempo-Feedback';
        m.textContent = '';
        [['schnell', 'ZU SCHNELL', ROT, '#fff'], ['langsam', 'ZU LANGSAM', ORANGE, '#0b1a33']].forEach(([art, wort, grund, tinte]) => {
            if (!s[art]) return;
            const p = document.createElement('span');
            p.textContent = wort + ' ' + s[art];
            p.style.cssText = 'white-space:nowrap;padding:3px 9px;border-radius:11px;letter-spacing:0.06em;' +
                'font:700 11px/16px Orbitron,sans-serif;color:' + tinte + ';background:' + grund;
            m.appendChild(p);
            if (s.neu === art && p.animate) {
                p.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
                    { duration: 600, iterations: 2, easing: 'ease-out' });
            }
        });
    }

    window.Buzzer = { start, weiter, gesehen, neuerCode, code, link, karte, karteBereit, markiere, blitz, tempoMarke,
        // tempo(onTempo, ab): onTempo({schnell, langsam, neu}) - the counts since ab() (ms; without it: the last two
        // minutes), neu = the kind just come; tempoJetzt(): count again now (the page's ab() moved on)
        tempo: (cb, ab) => { tempoMelde = cb; tempoAb = ab || null; if (laeuft && cb) cb(tempoStand()); },
        tempoJetzt: () => { if (tempoMelde) tempoMelde(tempoStand()); },
        // texte(onTexte, {schluessel}): onTexte({texte: [{id, text, t}], angemeldet, neu}) - today's written feedback
        // of this code; schluessel: true reads them without a session, with the code claimed by this device
        texte: (cb, opts) => { texteMelde = cb; texteMitSchluessel = !!(opts && opts.schluessel); if (laeuft && cb) texteNachsehen(); },
        aktiv: () => laeuft };
})();
