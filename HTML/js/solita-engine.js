// Solita tools: start_engine / stop_engine — remote-crank Doc's 1964 Mercedes 230 SL "Pagode" (W113) by voice.
//
// Self-contained add-on: registers into window.SolitaTools (Regel 7), touches no core, load-order independent —
// same shape as solita-time.js / solita-where.js (spec + handler returning { ok, summary } + badge).
//
// HARDWARE (full write-up: Solita_goes_Pagode.md). A DSD TECH 2-channel BLE relay module sits in the car. The
// ignition key stays in position ON (ignition + fuel pump live). The two relay channels replicate the key's last
// two jobs:
//   * Channel 1 -> drives a 70 A Bosch relay -> terminal 50 (starter-solenoid trigger) = CRANK (momentary).
//   * Channel 2 -> normally-closed, in series with the ignition coil = KILL (open briefly to stop the engine).
// The heavy 200-500 A starter current never reaches us: it is switched by the starter's OWN solenoid (terminal 30).
//
// BLE: cheap relay modules speak a serial-over-BLE characteristic with short command frames. The exact
// service/characteristic UUIDs and command bytes are MODULE-SPECIFIC and unknown until the part is in hand, so
// they live in CONFIG below and the module starts in SIM_MODE (no Bluetooth — it just walks the flow through).
// navigator.bluetooth.requestDevice() needs a USER GESTURE, so pairing is window.SolitaPagode.pair() (call it
// from a button/console tap); once paired, the voice tools write without a further gesture.
//
// SAFETY: cranking a real engine remotely is risky (car could be in gear). In real mode start_engine is a
// two-step confirm — the first call asks Doc to confirm, only a confirmed call actually cranks. SIM mode skips it.
(function () {
    'use strict';

    // ---- CONFIG — fill from the DSD TECH datasheet / an nRF-Connect sniff once the module is in hand ----------
    var CONFIG = {
        SIM_MODE: true,            // true = no Bluetooth, dry-run the flow (test before the hardware arrives)
        DEVICE_NAME_PREFIX: '',    // optional BLE name filter, e.g. 'DSD' — empty = let Doc pick in the chooser
        SERVICE_UUID: null,        // e.g. 0xFFE0 (Nordic-UART-like serial service) — UNKNOWN until datasheet
        CHAR_UUID: null,           // e.g. 0xFFE1 (write characteristic) — UNKNOWN until datasheet
        // command frames (byte arrays) the module expects — PLACEHOLDERS in the common "LC relay" style:
        CMD: {
            CH1_ON:  [0xA0, 0x01, 0x01, 0xA2],
            CH1_OFF: [0xA0, 0x01, 0x00, 0xA1],
            CH2_ON:  [0xA0, 0x02, 0x01, 0xA3],
            CH2_OFF: [0xA0, 0x02, 0x00, 0xA2]
        },
        CRANK_MS: 900,             // how long to hold the starter (terminal 50) — momentary, like the key
        STOP_MS: 1500              // how long to break the ignition coil to be sure the engine dies
    };

    // tiny debug log -> Doc keeps a DEBUG panel open (feedback_always_log_to_debug); fall back to console.
    function dbg(msg) {
        try { if (window.DebugWindow && window.DebugWindow.log) { window.DebugWindow.log('[pagode] ' + msg); return; } } catch (e) {}
        try { if (typeof window.dbg === 'function') { window.dbg('[pagode] ' + msg); return; } } catch (e) {}
        try { console.log('[pagode]', msg); } catch (e) {}
    }

    // ---- BLE link state ----
    var gattDevice = null, writeChar = null;

    function connected() { return !!(gattDevice && gattDevice.gatt && gattDevice.gatt.connected && writeChar); }

    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    // write one command frame to the relay module
    async function send(frame) {
        if (!writeChar) throw new Error('not connected');
        await writeChar.writeValue(new Uint8Array(frame));
    }

    // pulse a channel ON for ms, then OFF (momentary). channel = 1 (crank, terminal 50) or 2 (kill, ignition).
    async function pulse(channel, ms) {
        var on = channel === 1 ? CONFIG.CMD.CH1_ON : CONFIG.CMD.CH2_ON;
        var off = channel === 1 ? CONFIG.CMD.CH1_OFF : CONFIG.CMD.CH2_OFF;
        await send(on);
        dbg('channel ' + channel + ' ON (' + ms + ' ms)');
        await sleep(ms);
        await send(off);
        dbg('channel ' + channel + ' OFF');
    }

    // PAIR — must be called from a USER GESTURE (button/tap). Stores the device + write characteristic.
    async function pair() {
        if (!navigator.bluetooth) throw new Error('Web Bluetooth steht auf diesem Gerät/Browser nicht zur Verfügung.');
        var opts = CONFIG.DEVICE_NAME_PREFIX
            ? { filters: [{ namePrefix: CONFIG.DEVICE_NAME_PREFIX }], optionalServices: [CONFIG.SERVICE_UUID] }
            : { acceptAllDevices: true, optionalServices: [CONFIG.SERVICE_UUID] };
        gattDevice = await navigator.bluetooth.requestDevice(opts);
        var server = await gattDevice.gatt.connect();
        var service = await server.getPrimaryService(CONFIG.SERVICE_UUID);
        writeChar = await service.getCharacteristic(CONFIG.CHAR_UUID);
        dbg('paired with ' + (gattDevice.name || 'relay module'));
        return true;
    }

    function disconnect() {
        try { if (gattDevice && gattDevice.gatt && gattDevice.gatt.connected) gattDevice.gatt.disconnect(); } catch (e) {}
        gattDevice = null; writeChar = null;
    }

    // expose for a pairing button / console (gesture-bound) and for status
    window.SolitaPagode = { pair: pair, disconnect: disconnect, connected: connected, config: CONFIG };

    // ---- tool: start_engine ------------------------------------------------------------------------------------
    var startSpec = {
        name: 'start_engine',
        description: 'Starte den Motor von Docs Mercedes 230 SL „Pagode" (Baujahr 1964) per Bluetooth-Relais. '
            + 'Nutze dies, wenn Doc sinngemäß sagt „starte (mal) die Engine/den Motor", „lass den Wagen/die Pagode an", '
            + '„Solita, let\'s go". Der Zündschlüssel steht bereits auf ON; dieses Werkzeug betätigt nur kurz den Anlasser '
            + '(wie der Schlüssel in Stellung „Start"). SICHERHEIT: Das ist eine reale Maschine. Frage Doc IMMER zuerst kurz '
            + '„Soll ich die Pagode wirklich starten?" und rufe dieses Werkzeug erst mit confirmed=true auf, wenn er '
            + 'bestätigt hat. Im Testmodus (noch keine Hardware) läuft alles trocken durch.',
        input_schema: {
            type: 'object',
            properties: {
                confirmed: { type: 'boolean', description: 'true erst, NACHDEM Doc das Starten ausdrücklich bestätigt hat.' }
            }
        }
    };

    async function startHandler(input) {
        var sim = CONFIG.SIM_MODE || !connected();
        var confirmed = !!(input && input.confirmed);

        // real mode: require an explicit confirm before cranking a real engine
        if (!sim && !confirmed) {
            return { ok: true, summary: 'Sicherheitsabfrage vor dem realen Start. ANWEISUNG AN DICH (Solita): Frage Doc '
                + 'kurz gesprochen „Soll ich die Pagode wirklich starten?" und rufe start_engine erst mit confirmed=true '
                + 'auf, wenn er bestätigt. Starte NICHT ungefragt.' };
        }

        if (sim) {
            dbg('START (SIM) — would crank terminal 50 for ' + CONFIG.CRANK_MS + ' ms');
            return { ok: true, summary: 'TESTMODUS (keine Hardware verbunden): Der Startbefehl wurde simuliert — in echt '
                + 'würde jetzt der Anlasser ca. ' + CONFIG.CRANK_MS + ' ms drehen. ANWEISUNG AN DICH (Solita): Bestätige '
                + 'Doc gesprochen, dass du die Pagode (im Testmodus) gestartet hast, z.B. „Alles klar — Pagode gestartet. '
                + 'Hinweis: Testmodus, das Relais ist noch nicht angeschlossen."' };
        }

        try {
            await pulse(1, CONFIG.CRANK_MS);   // momentary crank on terminal 50
            return { ok: true, summary: 'Anlasser betätigt (Klemme 50, ' + CONFIG.CRANK_MS + ' ms). ANWEISUNG AN DICH '
                + '(Solita): Sag Doc gesprochen kurz und freundlich, dass die Pagode gestartet ist.' };
        } catch (e) {
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
            + 'die Zündung). Nutze dies, wenn Doc sinngemäß sagt „mach den Motor aus", „stell die Pagode ab", „Motor stop". '
            + 'Im Testmodus läuft alles trocken durch.',
        input_schema: { type: 'object', properties: {} }
    };

    async function stopHandler() {
        var sim = CONFIG.SIM_MODE || !connected();
        if (sim) {
            dbg('STOP (SIM) — would break ignition for ' + CONFIG.STOP_MS + ' ms');
            return { ok: true, summary: 'TESTMODUS (keine Hardware verbunden): Der Stoppbefehl wurde simuliert. ANWEISUNG '
                + 'AN DICH (Solita): Bestätige Doc gesprochen, dass du die Pagode (im Testmodus) abgestellt hast.' };
        }
        try {
            await pulse(2, CONFIG.STOP_MS);    // break ignition coil -> engine dies
            return { ok: true, summary: 'Zündung unterbrochen (' + CONFIG.STOP_MS + ' ms) — Motor aus. ANWEISUNG AN DICH '
                + '(Solita): Bestätige Doc gesprochen kurz, dass die Pagode aus ist.' };
        } catch (e) {
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
