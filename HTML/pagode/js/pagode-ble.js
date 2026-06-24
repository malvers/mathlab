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
        CMD: {
            K1_ON: [0xA0, 0x01, 0x01, 0xA2], K1_OFF: [0xA0, 0x01, 0x00, 0xA1],   // channel 1 = START (Klemme 50)
            K2_ON: [0xA0, 0x02, 0x01, 0xA3], K2_OFF: [0xA0, 0x02, 0x00, 0xA2]    // channel 2 = STOP (ignition)
        }
    };

    // native platform = Capacitor APK; otherwise the browser (Web Bluetooth)
    var isNative = !!(global.Capacitor && typeof global.Capacitor.isNativePlatform === 'function'
        && global.Capacitor.isNativePlatform());

    // ---- Web Bluetooth (Chrome / Android / Desktop) ----
    function webBackend(opts) {
        var device = null, characteristic = null;
        return {
            name: 'Web Bluetooth',
            async connect() {
                device = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true, optionalServices: [CFG.SERVICE]
                });
                device.addEventListener('gattserverdisconnected', function () {
                    characteristic = null;
                    if (opts.onDisconnect) opts.onDisconnect();
                });
                var server = await device.gatt.connect();
                var service = await server.getPrimaryService(CFG.SERVICE);
                characteristic = await service.getCharacteristic(CFG.CHAR);
                return device.name || 'Relais-Modul';
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
        var toB64 = function (bytes) { return btoa(String.fromCharCode.apply(null, bytes)); };  // plugin wants base64 value
        return {
            name: 'Capacitor BLE-Plugin',
            async connect() {
                await Ble.initialize();
                var r = await Ble.requestDevice({ optionalServices: [CFG.SERVICE_STR] });
                deviceId = r.deviceId;
                await Ble.connect({ deviceId: deviceId });
                return r.name || 'Relais-Modul';
            },
            async write(bytes) {
                if (!deviceId) throw new Error('nicht verbunden');
                await Ble.write({ deviceId: deviceId, service: CFG.SERVICE_STR, characteristic: CFG.CHAR_STR, value: toB64(bytes) });
            },
            async disconnect() { try { if (deviceId) await Ble.disconnect({ deviceId: deviceId }); } catch (e) { /* ignore */ } }
        };
    }

    // Pick the right transport for this runtime; returns null if no BLE is available.
    // opts.onDisconnect() is called on an unexpected GATT disconnect (Web Bluetooth path).
    // Call this inside a user gesture — connect() triggers requestDevice().
    function createBackend(opts) {
        opts = opts || {};
        if (isNative) return nativeBackend();
        if (navigator.bluetooth) return webBackend(opts);
        return null;
    }

    global.PagodeBLE = { CFG: CFG, isNative: isNative, createBackend: createBackend };
})(window);
