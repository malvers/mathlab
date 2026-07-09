/* pagode-ble.js — single source for the Pagode BLE transport.
   Drives the DSD TECH 2-channel BLE relay (SH-HC-08): service 0xFFE0, write characteristic
   0xFFE1, A0-series relay commands. Two transports behind one API: Web Bluetooth in the
   browser (Chrome, needs HTTPS + a user gesture) and the Capacitor BLE plugin in the APK.
   Consumed by pagode-remote.html (diagnostic) and pagode.html (car remote); `npm run prep`
   copies it into the Capacitor app's www/js. Protocol details: ../../Solita_goes_Pagode.md §5.1.
   The command bytes must be checked against the real module (datasheet / nRF Connect). */
(function (global) {
    'use strict';

    // ---- protocol constants — verify on the real module ----
    var CFG = {
        SERVICE: 0xffe0, SERVICE_STR: '0000ffe0-0000-1000-8000-00805f9b34fb',
        CHAR: 0xffe1, CHAR_STR: '0000ffe1-0000-1000-8000-00805f9b34fb',
        NAME_PREFIX: 'DSD TECH',   // BLE-Gerätename des Moduls → Filter im Geräte-Dialog
        CMD: {
            K1_ON: [0xA0, 0x01, 0x01, 0xA2], K1_OFF: [0xA0, 0x01, 0x00, 0xA1],   // channel 1 = START (Klemme 50)
            K2_ON: [0xA0, 0x02, 0x01, 0xA3], K2_OFF: [0xA0, 0x02, 0x00, 0xA2]    // channel 2 = STOP (ignition)
        }
    };

    // native platform = Capacitor APK; otherwise the browser (Web Bluetooth)
    var isNative = !!(global.Capacitor && typeof global.Capacitor.isNativePlatform === 'function'
        && global.Capacitor.isNativePlatform());

    // remember the paired module so the native app reconnects silently (no picker after the first time)
    var LS_ID = 'pagode-ble-deviceid', LS_NAME = 'pagode-ble-name';
    var LS = {
        get: function (k) { try { return (typeof localStorage !== 'undefined') ? localStorage.getItem(k) : null; } catch (e) { return null; } },
        set: function (k, v) { try { if (typeof localStorage !== 'undefined') localStorage.setItem(k, v); } catch (e) { } },
        del: function (k) { try { if (typeof localStorage !== 'undefined') localStorage.removeItem(k); } catch (e) { } }
    };

    // ---- Web Bluetooth (Chrome / Android / Desktop) ----
    function webBackend(opts) {
        var device = null, characteristic = null;
        return {
            name: 'Web Bluetooth',
            async connect() {
                async function attach(d) {
                    device = d;
                    d.addEventListener('gattserverdisconnected', function () {
                        characteristic = null;
                        if (opts.onDisconnect) opts.onDisconnect();
                    });
                    var server = await d.gatt.connect();
                    var service = await server.getPrimaryService(CFG.SERVICE);
                    characteristic = await service.getCharacteristic(CFG.CHAR);
                    return d.name || 'Relais-Modul';
                }
                function withTimeout(p, ms) {
                    return new Promise(function (res, rej) {
                        var t = setTimeout(function () { rej(new Error('timeout')); }, ms);
                        p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
                    });
                }
                // 1) reconnect to an already-permitted module WITHOUT the chooser
                try {
                    if (navigator.bluetooth.getDevices) {
                        var known = await navigator.bluetooth.getDevices();
                        var m = known.filter(function (d) { return (d.name || '').indexOf(CFG.NAME_PREFIX) === 0; })[0];
                        if (m) return await withTimeout(attach(m), 6000);
                    }
                } catch (e) { /* not in range / unsupported → fall back to the chooser */ }
                // 2) first time (or fallback): filtered chooser → one click
                var dev = await navigator.bluetooth.requestDevice({
                    filters: [{ namePrefix: CFG.NAME_PREFIX }], optionalServices: [CFG.SERVICE]
                });
                return await attach(dev);
            },
            async write(bytes) {
                if (!characteristic) throw new Error('nicht verbunden');
                var data = new Uint8Array(bytes);
                // FFE1 is usually write-with-response; fall back to without-response if needed.
                if (characteristic.properties.write) await characteristic.writeValue(data);
                else await characteristic.writeValueWithoutResponse(data);
            },
            async disconnect() { try { if (device && device.gatt.connected) device.gatt.disconnect(); } catch (e) { /* ignore */ } }
        };
    }

    // ---- Capacitor @capacitor-community/bluetooth-le (the APK) ----
    // best-effort; VERIFY the write value-encoding (base64 vs hex) on the real module.
    function nativeBackend() {
        var Ble = global.Capacitor.Plugins.BluetoothLe;
        var deviceId = null;
        var toHex = function (bytes) { return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join(' '); };  // plugin parses SPACE-separated hex byte pairs, e.g. "a0 01 01 a2" (NOT base64, NOT joined hex)
        function withTimeout(p, ms) { return new Promise(function (res, rej) { var t = setTimeout(function () { rej(new Error('timeout')); }, ms); p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); }); }); }
        return {
            name: 'Capacitor BLE-Plugin',
            async connect() {
                // androidNeverForLocation: we don't derive location from BLE → plugin drops the
                // ACCESS_FINE_LOCATION requirement (matches BLUETOOTH_SCAN neverForLocation in the manifest).
                await Ble.initialize({ androidNeverForLocation: true });
                // 1) silent reconnect to a REMEMBERED module (deviceId = Android MAC) — no picker
                var savedId = LS.get(LS_ID);
                if (savedId) {
                    try {
                        await withTimeout(Ble.connect({ deviceId: savedId }), 8000);
                        deviceId = savedId;
                        return LS.get(LS_NAME) || 'Relais-Modul';
                    } catch (e) { /* module gone/changed/out of range → fall through to the picker */ }
                }
                // 2) first time ever (or fallback): the plugin picker, then remember the choice
                var r = await Ble.requestDevice({ namePrefix: CFG.NAME_PREFIX, optionalServices: [CFG.SERVICE_STR] });
                deviceId = r.deviceId;
                await Ble.connect({ deviceId: deviceId });
                LS.set(LS_ID, r.deviceId); LS.set(LS_NAME, r.name || 'Relais-Modul');
                return r.name || 'Relais-Modul';
            },
            async write(bytes) {
                if (!deviceId) throw new Error('nicht verbunden');
                await Ble.write({ deviceId: deviceId, service: CFG.SERVICE_STR, characteristic: CFG.CHAR_STR, value: toHex(bytes) });
            },
            async disconnect() { try { if (deviceId) await Ble.disconnect({ deviceId: deviceId }); } catch (e) { /* ignore */ } }
        };
    }

    // ---- Simulation (no hardware) — dry-run the whole flow in Chrome or the APK ----
    // A fake module that "connects" instantly and just acknowledges the relay commands, so the
    // connect → gate (PIN/Biometrie) → hold-to-crank → START/STOP flow can be tested without the
    // real DSD module. Enabled via ?sim=1 / #sim in the URL or the persisted 'pagode-sim' flag.
    var LS_SIM = 'pagode-sim';
    function simActive() {
        try {
            if (typeof location !== 'undefined' && (/[?&]sim=1\b/.test(location.search) || location.hash === '#sim')) return true;
        } catch (e) { }
        return LS.get(LS_SIM) === '1';
    }
    var SIM = { active: simActive, set: function (on) { on ? LS.set(LS_SIM, '1') : LS.del(LS_SIM); } };
    function simBackend() {
        var conn = false;
        function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
        return {
            name: 'Simulation',
            async connect() { await delay(300); conn = true; return 'Simulator'; },
            async write(bytes) { if (!conn) throw new Error('nicht verbunden'); await delay(120); },
            async disconnect() { conn = false; }
        };
    }

    // Pick the right transport for this runtime; returns null if no BLE is available.
    // opts.onDisconnect() is called on an unexpected GATT disconnect (Web Bluetooth path).
    // Call this inside a user gesture — connect() triggers requestDevice().
    function createBackend(opts) {
        opts = opts || {};
        if (simActive()) return simBackend();
        if (isNative) return nativeBackend();
        if (navigator.bluetooth) return webBackend(opts);
        return null;
    }

    global.PagodeBLE = { CFG: CFG, isNative: isNative, createBackend: createBackend, sim: SIM, forget: function () { LS.del(LS_ID); LS.del(LS_NAME); } };
})(window);
