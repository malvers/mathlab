// Solita tools: start_engine / stop_engine — voice-crank Doc's 1964 Mercedes 230 SL "Pagode" (W113).
//
// Self-contained add-on: registers into window.SolitaTools (Regel 7), touches no core, load-order independent —
// same shape as solita-time.js / solita-where.js (spec + handler returning { ok, summary } + badge).
//
// BLE goes through the SHARED single source js/pagode-ble.js (window.PagodeBLE): same module, UUIDs (FFE0/FFE1),
// A0 commands, "DSD TECH" name filter, getDevices auto-reconnect and the space-separated-hex native fix as the
// Pagode app — no duplicate BLE code here. solita.html must load ../pagode/js/pagode-ble.js BEFORE this file.
// If PagodeBLE is absent (no Web Bluetooth / no native BLE), the tools fall back to a dry-run so the flow stays testable.
//
// HARDWARE (full write-up: Solita_goes_Pagode.md). A DSD TECH 2-channel BLE relay sits in the car, key on ON:
//   * Channel 1 (K1) -> drives a 70 A Bosch relay -> terminal 50 (starter-solenoid trigger) = CRANK (momentary).
//   * Channel 2 (K2) -> normally-closed, in series with the ignition coil = KILL (open briefly to stop the engine).
// The heavy 200-500 A starter current never reaches us: it is switched by the starter's OWN solenoid (terminal 30).
//
// PAIRING: navigator.bluetooth.requestDevice() needs a USER GESTURE, so the first link is window.SolitaPagode.pair()
// (call it from a button/console tap once). After that — with the Chrome getDevices flag, or natively — the voice
// tools reconnect on their own without a further gesture.
//
// SAFETY (HIGH CRITICAL — real machine, possibly moving): BOTH start AND stop need a deliberate spoken confirmation.
// Killing the engine while driving = no power steering/brakes, dangerous; an accidental "ja"/mis-hear must never fire.
// So actuation requires a confirm_phrase containing "ja" + the action verb + "Pagode" (e.g. "Ja, stoppe die Pagode!").
(function () {
    'use strict';

    var CONFIG = {
        CRANK_MS: 900,             // how long to hold the starter (terminal 50) — momentary, like the key
        STOP_MS: 1500,             // how long to break the ignition coil to be sure the engine dies
        MAX_STOP_SPEED_MS: 1.4,    // ~5 km/h: at or above this the car counts as moving and stop is refused outright
        PENDING_MS: 120000         // a "switch off once we stop" wish expires after 2 min (never a stale kill later)
    };

    // tiny debug log -> Doc keeps a DEBUG panel open (feedback_always_log_to_debug); fall back to console.
    function dbg(msg) {
        try { if (window.DebugWindow && window.DebugWindow.log) { window.DebugWindow.log('[pagode] ' + msg); return; } } catch (e) {}
        try { if (typeof window.dbg === 'function') { window.dbg('[pagode] ' + msg); return; } } catch (e) {}
        try { console.log('[pagode]', msg); } catch (e) {}
    }

    // ---- SAFETY: deliberate spoken confirmation. A bare "ja" must NOT trigger — require "ja" + verb + "Pagode". ----
    // Trigger sentences: "Ja, starte die Pagode!" / "Ja, stoppe die Pagode!". This also separates the confirmation
    // from the initial command (which won't contain all three), so the two-step ask can't be skipped by accident.
    function confirmOk(input, kind) {
        var p = (input && input.confirm_phrase ? String(input.confirm_phrase) : '').toLowerCase();
        if (!/\bja\b/.test(p)) return false;          // an explicit affirmative
        if (p.indexOf('pagode') < 0) return false;    // must name the car, not a stray "ja"
        return kind === 'start'
            ? /\b(start\w*|anlass\w*)\b/.test(p)
            : /\b(stop\w*|abstell\w*|ausschalt\w*)\b/.test(p) || /\bstell\w*\b.*\bab\b/.test(p);
    }

    // ---- DETERMINISTIC motion gate (NOT the LLM): GPS-Doppler speed. Stop is refused while the car moves. ----
    // Resolves { known, moving, speed_ms }. Unknown (no geolocation / no speed in the fix, e.g. indoors at the
    // bench) => allow, because the deliberate-phrase gate still applies. Set window.SolitaPagode.testSpeedMs
    // (m/s) to simulate motion when bench-testing.
    function vehicleSpeed() {
        return new Promise(function (resolve) {
            var t = window.SolitaPagode && window.SolitaPagode.testSpeedMs;
            if (typeof t === 'number') { resolve({ known: true, moving: t >= CONFIG.MAX_STOP_SPEED_MS, speed_ms: t }); return; }
            if (!navigator.geolocation) { resolve({ known: false }); return; }
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    var s = pos && pos.coords && typeof pos.coords.speed === 'number' ? pos.coords.speed : null;
                    if (s === null || isNaN(s)) resolve({ known: false });
                    else resolve({ known: true, moving: s >= CONFIG.MAX_STOP_SPEED_MS, speed_ms: s });
                },
                function () { resolve({ known: false }); },
                { enableHighAccuracy: true, timeout: 4000, maximumAge: 2000 }
            );
        });
    }

    // ---- PENDING STOP: "stop once we halt" wish, asked again proactively when the car stops ------------------
    // Refusing a stop mid-drive is right, but plain "no" loses Doc's intent. So we REMEMBER it and, the moment
    // the car comes to a stand, Solita asks once: "we've stopped — switch off?" — Doc still has to confirm with
    // the deliberate phrase (NEVER an automatic kill: that would cut the engine at a red light). The wish expires
    // after PENDING_MS so a forgotten command can't trigger a surprise kill at some later halt.
    var pendingStopAt = 0, stopWatchIv = null;
    function clearStopWatch() { if (stopWatchIv) { clearInterval(stopWatchIv); stopWatchIv = null; } pendingStopAt = 0; }
    function armStopWatch() {
        pendingStopAt = Date.now();
        if (stopWatchIv) return;   // already polling
        dbg('STOP gemerkt — frage beim nächsten Halt nach (läuft in ' + (CONFIG.PENDING_MS / 1000) + ' s ab)');
        stopWatchIv = setInterval(async function () {
            if (!pendingStopAt || Date.now() - pendingStopAt > CONFIG.PENDING_MS) { dbg('gemerkter Stopp abgelaufen'); clearStopWatch(); return; }
            var m = await vehicleSpeed();
            if (m.known && !m.moving) {
                clearStopWatch();
                dbg('Wagen steht → Doc proaktiv fragen');
                var ask = 'Wir stehen jetzt. Soll ich die Pagode abstellen? Sag „Ja, stoppe die Pagode!", dann mache ich es.';
                if (window.solitaProactive) window.solitaProactive(ask);
                else if (window.speakReply) window.speakReply(ask);
            }
        }, 4000);
    }

    // ---- BLE via the shared single source (window.PagodeBLE from js/pagode-ble.js) ----
    function PB() { return window.PagodeBLE || null; }
    function cmd() { var p = PB(); return p && p.CFG && p.CFG.CMD; }
    // true only if a real BLE transport is available in this runtime (Chrome Web Bluetooth or native plugin)
    function haveBle() { var p = PB(); return !!(p && p.CFG && p.CFG.CMD && (p.isNative || (navigator && navigator.bluetooth))); }

    var backend = null, linked = false;
    function ensureBackend() {
        if (!backend && PB()) backend = PB().createBackend({ onDisconnect: function () { linked = false; dbg('disconnected'); } });
        return backend;
    }
    function connected() { return linked; }
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    // connect/reconnect; the FIRST call must come from a user gesture (requestDevice), later ones are gesture-free.
    async function link() {
        if (linked) return true;
        if (!ensureBackend()) throw new Error('Pagode-BLE steht in dieser Umgebung nicht zur Verfügung.');
        var name = await backend.connect();
        linked = true;
        dbg('linked with ' + name);
        return true;
    }

    // PAIR — bind this to a button/tap (USER GESTURE) for the first connection.
    async function pair() { return link(); }
    function disconnect() { try { if (backend) backend.disconnect(); } catch (e) {} linked = false; }

    // best-effort (re)connect before a voice command; ok to fail (then we ask Doc to pair once)
    async function tryLink() { try { return await link(); } catch (e) { dbg('link failed: ' + (e && e.message)); return false; } }

    // pulse a channel ON for ms, then OFF (momentary). channel = 1 (crank, terminal 50) or 2 (kill, ignition).
    async function pulse(channel, ms) {
        var C = cmd();
        var on = channel === 1 ? C.K1_ON : C.K2_ON;
        var off = channel === 1 ? C.K1_OFF : C.K2_OFF;
        await backend.write(on);
        dbg('channel ' + channel + ' ON (' + ms + ' ms)');
        await sleep(ms);
        await backend.write(off);
        dbg('channel ' + channel + ' OFF');
    }

    // expose for a pairing button / console (gesture-bound) and for status
    window.SolitaPagode = { pair: pair, disconnect: disconnect, connected: connected, config: CONFIG };

    // ---- tool: start_engine ------------------------------------------------------------------------------------
    var startSpec = {
        name: 'start_engine',
        description: 'Starte den Motor von Docs Mercedes 230 SL „Pagode" (Baujahr 1964) per Bluetooth-Relais. '
            + 'Nutze dies, wenn Doc sinngemäß sagt „starte (mal) die Engine/den Motor", „lass den Wagen/die Pagode an", '
            + '„Solita, let\'s go", „wollen wir (eine kleine Ausfahrt)?", „lass uns (raus)fahren". Der Zündschlüssel steht '
            + 'bereits auf ON; dieses Werkzeug betätigt nur kurz den Anlasser (wie der Schlüssel in Stellung „Start"). '
            + 'ABLAUF (WICHTIG): Rufe start_engine SOFORT auf, sobald Doc starten möchte — beim ERSTEN Mal OHNE '
            + 'confirm_phrase. NICHT vorher von dir aus rückfragen. Das Werkzeug fordert dich dann auf, Docs ausdrückliche '
            + 'Bestätigung einzuholen — frage „Soll ich die Pagode wirklich starten?" und rufe start_engine erneut auf, '
            + 'sobald Doc DEUTLICH „Ja, starte die Pagode!" sagt (wörtlich als confirm_phrase). SICHERHEIT (hoch kritisch, '
            + 'reale Maschine): Bei bloßem „ja", „ok", Unsicherheit oder Nebengeräusch NICHT starten. Im Testmodus (kein '
            + 'BLE) läuft alles trocken durch.',
        input_schema: {
            type: 'object',
            properties: {
                confirm_phrase: {
                    type: 'string',
                    description: 'Docs WÖRTLICHE Bestätigung, NACHDEM du ihn gefragt hast — übergib genau das, was er gesagt '
                        + 'hat. Es wird nur gestartet, wenn er deutlich „Ja, starte die Pagode!" sagt. Bei bloßem „ja"/„ok", '
                        + 'Unsicherheit oder Nebengeräusch: leer lassen und erneut nachfragen.'
                }
            }
        }
    };

    async function startHandler(input) {
        // SAFETY GATE FIRST: only a deliberate spoken phrase confirms — never a bare "ja"
        if (!confirmOk(input, 'start')) {
            return { ok: true, summary: 'Sicherheitsabfrage vor dem Start (reale Maschine). ANWEISUNG AN DICH (Solita): '
                + 'Frage Doc kurz gesprochen „Soll ich die Pagode wirklich starten?" und rufe start_engine erst dann erneut '
                + 'auf, wenn Doc DEUTLICH „Ja, starte die Pagode!" sagt — übergib seine wörtliche Antwort als confirm_phrase. '
                + 'Bei bloßem „ja", „ok", Unsicherheit oder Nebengeräusch NICHT starten.' };
        }
        clearStopWatch();   // a deliberate fresh start cancels any remembered "switch off at the next halt"

        if (!haveBle()) {
            dbg('START (dry-run) — PagodeBLE/Transport nicht verfügbar');
            return { ok: true, summary: 'TESTMODUS (kein Bluetooth in dieser Umgebung): Der Startbefehl wurde simuliert — '
                + 'in echt würde jetzt der Anlasser ca. ' + CONFIG.CRANK_MS + ' ms drehen. ANWEISUNG AN DICH (Solita): '
                + 'Bestätige Doc gesprochen, dass du die Pagode (im Testmodus) gestartet hast.' };
        }

        if (!connected() && !(await tryLink())) {
            return { ok: false, summary: 'Keine Verbindung zum Pagode-Relais. ANWEISUNG AN DICH (Solita): Sag Doc, er soll '
                + 'das ☰-Menü öffnen und dort einmal auf das Bluetooth-Symbol („Pagode koppeln") tippen — Bluetooth '
                + 'braucht beim ersten Mal eine Berührung, danach starte ich sie per Stimme.' };
        }
        try {
            await pulse(1, CONFIG.CRANK_MS);   // momentary crank on terminal 50
            return { ok: true, summary: 'Anlasser betätigt (Klemme 50, ' + CONFIG.CRANK_MS + ' ms). ANWEISUNG AN DICH '
                + '(Solita): Sag Doc gesprochen kurz und freundlich, dass die Pagode gestartet ist.' };
        } catch (e) {
            linked = false;
            return { ok: false, summary: 'Der Startbefehl kam nicht durch (' + (e && e.message ? e.message : 'Funkfehler') + '). '
                + 'ANWEISUNG AN DICH (Solita): Sag Doc, dass die Verbindung zum Pagode-Relais gerade nicht steht und er die '
                + 'Kopplung prüfen soll.' };
        }
    }

    function startBadge() { return '🔑 ich starte die Pagode …'; }

    // ---- tool: stop_engine -------------------------------------------------------------------------------------
    var stopSpec = {
        name: 'stop_engine',
        description: 'Stelle den Motor von Docs Mercedes 230 SL „Pagode" ab — über das Bluetooth-Relais (unterbricht kurz '
            + 'die Zündung). Nutze dies, wenn Doc sinngemäß sagt „mach den Motor aus", „stell die Pagode ab", „Motor stop", '
            + '„wir sind da". ABLAUF (WICHTIG): Rufe stop_engine SOFORT auf, sobald Doc abstellen möchte — beim ERSTEN Mal '
            + 'OHNE confirm_phrase. NICHT vorher von dir aus rückfragen. Das Werkzeug entscheidet dann deterministisch und '
            + 'sagt dir, was zu tun ist: (a) Fährt der Wagen, lehnt es SOFORT ab — dann KEINE Bestätigung einholen, sondern '
            + 'Doc nur ruhig sagen, dass während der Fahrt nicht abgestellt wird. (b) Steht der Wagen, fordert es dich auf, '
            + 'Docs ausdrückliche Bestätigung einzuholen — frage dann „Soll ich die Pagode wirklich abstellen?" und rufe '
            + 'stop_engine erneut auf, sobald Doc DEUTLICH „Ja, stoppe die Pagode!" sagt (wörtlich als confirm_phrase). '
            + 'SICHERHEIT (HOCH KRITISCH): Ein versehentliches Abstellen während der Fahrt ist gefährlich (Motor aus = keine '
            + 'Servolenkung/-bremse); bei bloßem „ja", Unsicherheit oder Nebengeräusch NICHT abstellen. Im Testmodus läuft '
            + 'alles trocken durch.',
        input_schema: {
            type: 'object',
            properties: {
                confirm_phrase: {
                    type: 'string',
                    description: 'Docs WÖRTLICHE Bestätigung, NACHDEM du ihn gefragt hast. Es wird nur abgestellt, wenn er '
                        + 'deutlich „Ja, stoppe die Pagode!" sagt. Bei bloßem „ja"/Unsicherheit: leer lassen und erneut nachfragen.'
                }
            }
        }
    };

    async function stopHandler(input) {
        // DETERMINISTIC SAFETY GATE (not the LLM): never stop a moving car — even with the correct phrase.
        var m = await vehicleSpeed();
        if (m.known && m.moving) {
            var kmh = Math.round(m.speed_ms * 3.6);
            dbg('STOP refused — moving ~' + kmh + ' km/h');
            armStopWatch();   // remember the wish; ask again proactively at the next halt (expires after PENDING_MS)
            return { ok: false, summary: 'ABSTELLEN VERWEIGERT — der Wagen bewegt sich (~' + kmh + ' km/h). Aus Sicherheit wird '
                + 'der Motor während der Fahrt NIEMALS abgestellt, auch nicht automatisch. ANWEISUNG AN DICH (Solita): Sag Doc '
                + 'ruhig und bestimmt, dass du die Pagode während der Fahrt nicht abstellst, dich aber von selbst meldest, '
                + 'sobald ihr steht. Stelle NICHT ab.' };
        }
        clearStopWatch();   // stopped (or speed unknown) → any pending "ask at next halt" is moot now

        // SAFETY GATE: deliberate spoken phrase (a bare "ja" must not trigger)
        if (!confirmOk(input, 'stop')) {
            return { ok: true, summary: 'Sicherheitsabfrage vor dem Abstellen (hoch kritisch — niemals versehentlich während '
                + 'der Fahrt). ANWEISUNG AN DICH (Solita): Frage Doc kurz gesprochen „Soll ich die Pagode wirklich abstellen?" '
                + 'und rufe stop_engine erst dann erneut auf, wenn Doc DEUTLICH „Ja, stoppe die Pagode!" sagt — übergib seine '
                + 'wörtliche Antwort als confirm_phrase. Bei bloßem „ja", Unsicherheit oder Nebengeräusch NICHT abstellen.' };
        }

        if (!haveBle()) {
            dbg('STOP (dry-run) — PagodeBLE/Transport nicht verfügbar');
            return { ok: true, summary: 'TESTMODUS (kein Bluetooth in dieser Umgebung): Der Stoppbefehl wurde simuliert. '
                + 'ANWEISUNG AN DICH (Solita): Bestätige Doc gesprochen, dass du die Pagode (im Testmodus) abgestellt hast.' };
        }
        if (!connected() && !(await tryLink())) {
            return { ok: false, summary: 'Keine Verbindung zum Pagode-Relais. ANWEISUNG AN DICH (Solita): Sag Doc, er soll '
                + 'das ☰-Menü öffnen und dort einmal auf das Bluetooth-Symbol („Pagode koppeln") tippen.' };
        }
        try {
            await pulse(2, CONFIG.STOP_MS);    // break ignition coil -> engine dies
            return { ok: true, summary: 'Zündung unterbrochen (' + CONFIG.STOP_MS + ' ms) — Motor aus. ANWEISUNG AN DICH '
                + '(Solita): Bestätige Doc gesprochen kurz, dass die Pagode aus ist.' };
        } catch (e) {
            linked = false;
            return { ok: false, summary: 'Der Stoppbefehl kam nicht durch (' + (e && e.message ? e.message : 'Funkfehler') + '). '
                + 'ANWEISUNG AN DICH (Solita): Sag Doc, dass die Verbindung zum Pagode-Relais gerade nicht steht.' };
        }
    }

    function stopBadge() { return '🛑 ich stelle die Pagode ab …'; }

    // Register both tools into the shared Solita tool registry (idempotent — independent of load order).
    var reg = (window.SolitaTools = window.SolitaTools || { specs: [], handlers: {}, badges: {} });
    reg.specs.push(startSpec); reg.handlers[startSpec.name] = startHandler; reg.badges[startSpec.name] = startBadge;
    reg.specs.push(stopSpec); reg.handlers[stopSpec.name] = stopHandler; reg.badges[stopSpec.name] = stopBadge;
})();
