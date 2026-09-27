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
//   Buzzer.start(onBuzz)     listen to today's code; onBuzz(n, neu, frisch): n buzzes not seen yet, neu = one just
//                            came, frisch = the ids of those that came just now
//   Buzzer.weiter(onBuzz)    the same, but only if it was listening today already (a reload keeps it running)
//   Buzzer.gesehen()         the teacher has seen them: back to 0
//   Buzzer.neuerCode()       a fresh code - for the next class; phones with the old one no longer count
//   Buzzer.karte()           an element with inline styles only: QR, code, address (for an overlay, or a beamer twin)
//   Buzzer.markiere(el, n)   the central mark on a button: orange, a number, one pulse when it rises
//   Buzzer.blitz()           a short orange glow along the screen edge (never on a mirrored layer)
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
    let laeuft = false, melde = null, ids = new Set(), kanal = null, sb = null, timer = null, bisher = 0;
    // ladeSkript: js/lade-skript.js, loaded before this file
    // onBuzz(n, neu, frisch): frisch = the ids that came just now - a page that keeps a log counts by id, so two
    // buzzes in one look count twice and a reload does not count the unseen ones again
    function zaehlen(neue) {
        const gesehen = lies(KEY_GESEHEN, 0) || 0, frisch = [];
        neue.forEach(id => { if (id > gesehen && !ids.has(id)) { ids.add(id); frisch.push(id); } });
        if (ids.size !== bisher) {
            const neu = ids.size > bisher;
            bisher = ids.size;
            if (melde) melde(bisher, neu, frisch);
        }
    }
    // the net: what came since the last one seen (also after a reload, a lost websocket, a sleeping laptop)
    async function nachsehen() {
        const c = code(), gesehen = lies(KEY_GESEHEN, 0) || 0;
        try {
            const res = await fetch(DB_URL + '/rest/v1/buzzer?code=eq.' + c + '&id=gt.' + gesehen + '&select=id',
                { headers: { apikey: DB_KEY }, cache: 'no-store' });
            if (res.ok) zaehlen((await res.json()).map(r => r.id));
        } catch (_) { /* offline for a moment - the next look catches up */ }
    }
    async function verbinden() {
        ids = new Set();
        bisher = 0;
        if (melde) melde(0, false);
        clearInterval(timer);
        timer = setInterval(nachsehen, 5000);
        nachsehen();
        try {
            if (!window.supabase) await ladeSkript(DIR + 'vendor/supabase.min.js');
            if (!sb) sb = window.supabase.createClient(DB_URL, DB_KEY, { auth: { persistSession: false } });
            if (kanal) { sb.removeChannel(kanal); kanal = null; }
            const c = code();
            kanal = sb.channel('buzzer:' + c)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'buzzer', filter: 'code=eq.' + c },
                    p => { if (p.new && p.new.code === code()) zaehlen([p.new.id]); })
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
        bisher = 0;
        if (melde) melde(0, false);
    }

    // ---- the card for the board: QR, code, address - inline styles, so a twin on the beamer looks the same --------
    function karte() {
        const k = document.createElement('div');
        k.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;' +
            'font-family:Orbitron,sans-serif;color:#eaf0f7';
        const titel = document.createElement('div');
        titel.style.cssText = 'font-size:clamp(1.1rem,2.6vw,1.9rem);letter-spacing:0.08em';
        titel.textContent = 'NICHT VERSTANDEN? TIPPEN!';
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
        const zahl = document.createElement('div');
        zahl.style.cssText = 'font-size:clamp(1.6rem,5vw,3.2rem);letter-spacing:0.35em;color:' + ORANGE;
        zahl.textContent = code();
        const adr = document.createElement('div');
        adr.style.cssText = 'font-size:clamp(0.75rem,1.4vw,1rem);letter-spacing:0.06em;color:#8a93a3';
        adr.textContent = 'docalvers.de/buzzer.html · anonym – niemand sieht, wer drückt';
        k.append(titel, qr, zahl, adr);
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

    window.Buzzer = { start, weiter, gesehen, neuerCode, code, link, karte, karteBereit, markiere, blitz,
        aktiv: () => laeuft };
})();
