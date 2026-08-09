/* pagode-auth.js — optional security gate in front of START (single source, like pagode-ble.js).
   Four selectable modes, remembered in localStorage under 'pagode-auth-mode':
     'off'    — no gate (default, as before)
     'pin'    — app-local PIN: set once, stored only as a salted SHA-256 hash in localStorage
                (never the PIN itself). Works everywhere (Chrome + APK).
     'bio'    — Biometrie: the system BiometricPrompt via @aparajita/capacitor-biometric-auth.
                The phone decides fingerprint vs. face — the app can't force one. APK only;
                in the browser this mode reports unavailable.
     'pinbio' — both required (2-factor): PIN first, then biometry. APK only.
   Changing the mode (⚙) is itself gated behind the CURRENT mode, so a thief can't just tap Aus.
   Public API (window.PagodeAuth):
     MODES                      – [{id,label,hint}] for the settings UI
     getMode() / setMode(id)    – read / persist the chosen mode (setMode may open the PIN setup)
     gate()  -> Promise<bool>   – run the gate for the current mode; true = authorised
     openSettings()             – styled settings overlay (gear button calls this)
     bioAvailable() -> Promise<bool>
   The overlays (settings + PIN keypad) are injected here so both Pagode pages and the APK
   share one implementation. Styling mirrors the pagode.html gold/navy vintage theme. */
(function (global) {
    'use strict';

    var LS_MODE = 'pagode-auth-mode', LS_PIN = 'pagode-auth-pinhash', LS_SALT = 'pagode-auth-pinsalt';
    var LS = {
        get: function (k) { try { return (typeof localStorage !== 'undefined') ? localStorage.getItem(k) : null; } catch (e) { return null; } },
        set: function (k, v) { try { if (typeof localStorage !== 'undefined') localStorage.setItem(k, v); } catch (e) { } },
        del: function (k) { try { if (typeof localStorage !== 'undefined') localStorage.removeItem(k); } catch (e) { } }
    };

    var MODES = [
        { id: 'off', label: 'Aus' },
        { id: 'pin', label: 'PIN' },
        { id: 'bio', label: 'Biometrie' },
        { id: 'pinbio', label: 'PIN & Biometrie' }
    ];

    // simulation flag — shared with pagode-ble.js (URL ?sim=1 / #sim or persisted 'pagode-sim').
    // When on, Biometrie is testable in the browser via a fake fingerprint prompt (no hardware).
    function simActive() {
        try {
            if (typeof location !== 'undefined' && (/[?&]sim=1\b/.test(location.search) || location.hash === '#sim')) return true;
        } catch (e) { }
        return LS.get('pagode-sim') === '1';
    }

    function getMode() {
        var m = LS.get(LS_MODE);
        return (m === 'pin' || m === 'bio' || m === 'pinbio') ? m : 'off';
    }
    function hasPin() { return !!(LS.get(LS_PIN) && LS.get(LS_SALT)); }

    // ---- PIN hashing: salted SHA-256, only the hash is stored (never the PIN) ----
    function toHex(buf) {
        var v = new Uint8Array(buf), s = '';
        for (var i = 0; i < v.length; i++) s += ('0' + v[i].toString(16)).slice(-2);
        return s;
    }
    function randomSalt() {
        var a = new Uint8Array(16);
        (global.crypto || {}).getRandomValues ? global.crypto.getRandomValues(a) : (function () { for (var i = 0; i < a.length; i++) a[i] = (i * 40503) & 0xff; })();
        return toHex(a.buffer);
    }
    async function hashPin(pin, salt) {
        var enc = new TextEncoder().encode(salt + ':' + pin);
        if (global.crypto && global.crypto.subtle) {
            return toHex(await global.crypto.subtle.digest('SHA-256', enc));
        }
        // fallback (insecure origins without subtle) — FNV-1a, only so PIN entry still works
        var h = 0x811c9dc5;
        for (var i = 0; i < enc.length; i++) { h ^= enc[i]; h = (h * 0x01000193) >>> 0; }
        return ('0000000' + h.toString(16)).slice(-8);
    }
    async function storePin(pin) {
        var salt = randomSalt();
        LS.set(LS_SALT, salt);
        LS.set(LS_PIN, await hashPin(pin, salt));
    }
    async function checkPin(pin) {
        var salt = LS.get(LS_SALT), want = LS.get(LS_PIN);
        if (!salt || !want) return false;
        return (await hashPin(pin, salt)) === want;
    }

    // ---- Biometrie via @aparajita/capacitor-biometric-auth (native plugin, APK only) ----
    function bioPlugin() {
        var C = global.Capacitor;
        if (!C) return null;
        // Capacitor keys Capacitor.Plugins by the native @CapacitorPlugin(name=…), NOT the npm name.
        // @aparajita/capacitor-biometric-auth registers natively as "BiometricAuthNative" (proven from the
        // Android AAR). BLE works only because its native name happens to be "BluetoothLe".
        if (C.Plugins && (C.Plugins.BiometricAuthNative || C.Plugins.BiometricAuth)) return C.Plugins.BiometricAuthNative || C.Plugins.BiometricAuth;
        if (typeof C.registerPlugin === 'function') { try { return C.registerPlugin('BiometricAuthNative'); } catch (e) { } }
        return null;
    }
    async function bioAvailable() {
        var p = bioPlugin();
        if (!p) return simActive();   // no native plugin (browser) → only offered in simulation
        try { var r = await p.checkBiometry(); return !!(r && (r.isAvailable || r.strongBiometryIsAvailable)); }
        catch (e) { return false; }
    }
    async function bioAuth() {
        var p = bioPlugin();
        if (!p) return simActive() ? await simBioPrompt() : false;   // fake fingerprint prompt in the browser
        try {
            // The public authenticate() is a JS-wrapper (base.js) we don't load in this no-import app;
            // the REAL native method is internalAuthenticate() (native.js). allowDeviceCredential lets the
            // phone fall back to its own lock PIN/pattern if biometrics fail — like the bank apps.
            await p.internalAuthenticate({
                androidTitle: 'Pagode starten',
                cancelTitle: 'Abbrechen',
                allowDeviceCredential: true
            });
            return true;
        } catch (e) { return false; }
    }

    // ---- injected overlays (settings + PIN keypad), styled like pagode.html ----
    var uiReady = false;
    function ensureUI() {
        if (uiReady) return;
        uiReady = true;
        var css = document.createElement('style');
        css.textContent = [
            '.pgauth-ov{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(6,14,30,.72);z-index:9000;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
            '.pgauth-ov.open{display:flex}',
            '.pgauth-card{min-width:250px;max-width:320px;padding:22px 22px 20px;text-align:center;background:linear-gradient(180deg,#322c22,#241f18);border:1px solid #9c7a2e;border-radius:16px;box-shadow:0 14px 34px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,243,205,.12);color:#f1e6c4;font-family:Cinzel,Georgia,serif}',
            '.pgauth-title{letter-spacing:3px;text-transform:uppercase;font-size:13px;margin-bottom:16px;color:#e7c873}',
            '.pgauth-opt{display:flex;flex-direction:column;gap:2px;text-align:left;padding:12px 14px;margin:8px 0;border:1px solid #6e521d;border-radius:11px;cursor:pointer;background:rgba(255,243,205,.03);-webkit-tap-highlight-color:transparent}',
            '.pgauth-opt.sel{border-color:#e7c873;background:rgba(231,200,115,.12)}',
            '.pgauth-opt .l{font-weight:700;letter-spacing:2px;font-size:15px}',
            '.pgauth-opt .h{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-size:12px;color:#c7b692}',
            '.pgauth-opt.off{opacity:.55}',
            '.pgauth-dots{display:flex;gap:12px;justify-content:center;margin:6px 0 16px}',
            '.pgauth-dot{width:14px;height:14px;border-radius:50%;border:1px solid #9c7a2e;background:transparent}',
            '.pgauth-dot.on{background:#e7c873;box-shadow:0 0 6px rgba(231,200,115,.6)}',
            '.pgauth-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}',
            '.pgauth-key{font-family:Cinzel,serif;font-weight:700;font-size:20px;color:#f1e6c4;padding:14px 0;border:1px solid #6e521d;border-radius:11px;cursor:pointer;background:radial-gradient(circle at 50% 30%,#3a3226,#241f18);-webkit-tap-highlight-color:transparent;user-select:none}',
            '.pgauth-key:active{filter:brightness(1.15)}',
            '.pgauth-key.wide{grid-column:span 1}',
            '.pgauth-msg{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-size:12px;color:#cbbb91;min-height:16px;margin-top:12px}',
            '.pgauth-msg.err{color:#e08a7a}',
            '.pgauth-fp{display:inline-flex;align-items:center;justify-content:center;width:96px;height:96px;margin:6px auto 4px;border-radius:50%;border:1px solid #6e521d;cursor:pointer;background:radial-gradient(circle at 50% 34%,#3a3226,#241f18);box-shadow:inset 0 2px 6px rgba(0,0,0,.5),0 0 0 rgba(231,200,115,0);-webkit-tap-highlight-color:transparent;transition:box-shadow .2s}',
            '.pgauth-fp:active{box-shadow:inset 0 2px 6px rgba(0,0,0,.5),0 0 18px rgba(231,200,115,.55)}',
            '.pgauth-x{margin-top:14px;font-size:11px;letter-spacing:2px;color:#c7b692;cursor:pointer;text-transform:uppercase}'
        ].join('');
        document.head.appendChild(css);
    }
    function overlay() {
        var ov = document.createElement('div'); ov.className = 'pgauth-ov';
        ov.addEventListener('click', function (e) { if (e.target === ov) close(ov); });
        document.body.appendChild(ov);
        return ov;
    }
    function close(ov) { ov.classList.remove('open'); setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 0); }

    // Fake fingerprint prompt for the browser simulation — tap the print = unlock, resolves bool.
    // In the real APK this path is never reached (the native BiometricPrompt runs instead).
    function simBioPrompt() {
        ensureUI();
        return new Promise(function (resolve) {
            var ov = overlay(); ov.classList.add('open');
            var card = document.createElement('div'); card.className = 'pgauth-card';
            card.innerHTML =
                '<div class="pgauth-title">Biometrie · Simulation</div>' +
                '<button class="pgauth-fp" data-fp aria-label="Fingerabdruck – antippen zum Entsperren">' +
                '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#e7c873" stroke-width="1.3" stroke-linecap="round">' +
                '<path d="M12 2a9 9 0 0 0-9 9v3"/><path d="M21 13v-2a9 9 0 0 0-4-7.5"/>' +
                '<path d="M7 20a12 12 0 0 1-1-5 6 6 0 0 1 11-3"/><path d="M12 11a3 3 0 0 1 3 3c0 2 .3 4 1 5.5"/>' +
                '<path d="M9 22a15 15 0 0 1-1.5-6.5"/><path d="M12 15v1a12 12 0 0 0 1.2 5.2"/></svg></button>' +
                '<div class="pgauth-msg" data-m>antippen zum Entsperren</div>' +
                '<div class="pgauth-x" data-x>Abbrechen</div>';
            ov.appendChild(card);
            function done(ok) { close(ov); resolve(ok); }
            card.addEventListener('click', function (e) {
                if (e.target.getAttribute && e.target.getAttribute('data-x') !== null) { done(false); return; }
                if (e.target.closest && e.target.closest('[data-fp]')) {
                    var m = card.querySelector('[data-m]'); m.textContent = 'erkannt ✓'; m.style.color = '#8fbf6a';
                    setTimeout(function () { done(true); }, 260);
                }
            });
        });
    }

    // PIN keypad — flow: 'verify' (enter once) or 'set' (enter, then confirm). Resolves bool.
    function pinKeypad(flow) {
        ensureUI();
        return new Promise(function (resolve) {
            var ov = overlay(); ov.classList.add('open');
            var stage = 0, first = '', pin = '';   // set-flow: stage 0 = new, stage 1 = confirm
            var titleTxt = flow === 'set' ? 'PIN festlegen' : 'PIN eingeben';
            var card = document.createElement('div'); card.className = 'pgauth-card';
            card.innerHTML =
                '<div class="pgauth-title" data-t>' + titleTxt + '</div>' +
                '<div class="pgauth-dots">' + [0, 0, 0, 0].map(function () { return '<span class="pgauth-dot"></span>'; }).join('') + '</div>' +
                '<div class="pgauth-pad">' +
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button class="pgauth-key" data-k="' + n + '">' + n + '</button>'; }).join('') +
                '<button class="pgauth-key" data-k="del">⌫</button>' +
                '<button class="pgauth-key" data-k="0">0</button>' +
                '<button class="pgauth-key" data-k="ok">OK</button>' +
                '</div>' +
                '<div class="pgauth-msg" data-m></div>' +
                '<div class="pgauth-x" data-x>Abbrechen</div>';
            ov.appendChild(card);
            var dots = card.querySelectorAll('.pgauth-dot'), msg = card.querySelector('[data-m]'), ttl = card.querySelector('[data-t]');
            function paint() { for (var i = 0; i < 4; i++) dots[i].className = 'pgauth-dot' + (i < pin.length ? ' on' : ''); }
            function fail(t) { msg.textContent = t; msg.className = 'pgauth-msg err'; pin = ''; paint(); }
            function done(ok) { close(ov); resolve(ok); }
            async function submit() {
                if (pin.length < 4) { fail('mindestens 4 Ziffern'); return; }
                if (flow === 'set') {
                    if (stage === 0) { first = pin; pin = ''; stage = 1; ttl.textContent = 'PIN bestätigen'; msg.textContent = ''; msg.className = 'pgauth-msg'; paint(); return; }
                    if (pin !== first) { stage = 0; first = ''; ttl.textContent = 'PIN festlegen'; fail('stimmt nicht überein'); return; }
                    await storePin(pin); done(true); return;
                }
                if (await checkPin(pin)) done(true); else fail('falsche PIN');
            }
            card.addEventListener('click', function (e) {
                var k = e.target.getAttribute && e.target.getAttribute('data-k');
                if (e.target.getAttribute && e.target.getAttribute('data-x') !== null) { done(false); return; }
                if (!k) return;
                if (k === 'del') { pin = pin.slice(0, -1); msg.textContent = ''; msg.className = 'pgauth-msg'; paint(); return; }
                if (k === 'ok') { submit(); return; }
                if (pin.length < 4) { pin += k; paint(); if (pin.length === 4) submit(); }
            });
            paint();
        });
    }

    // Settings overlay — pick Aus / PIN / Biometrie.
    async function openSettings() {
        // SECURITY: changing the setting must pass the CURRENT gate — otherwise anyone could just tap ⚙ → Aus.
        // (When it's already 'off' there is nothing to protect, so first-time setup stays open.)
        if (getMode() !== 'off' && !(await gate())) return;
        ensureUI();
        var ov = overlay(); ov.classList.add('open');
        var card = document.createElement('div'); card.className = 'pgauth-card';
        card.innerHTML = '<div class="pgauth-title">Sicherheit</div>' +
            MODES.map(function (m) {
                return '<div class="pgauth-opt' + (m.id === 'off' ? ' off' : '') + (getMode() === m.id ? ' sel' : '') + '" data-id="' + m.id + '">' +
                    '<span class="l">' + m.label + '</span></div>';
            }).join('') +
            '<div class="pgauth-msg" data-m></div><div class="pgauth-x" data-x>Fertig</div>';
        ov.appendChild(card);
        var msg = card.querySelector('[data-m]');
        function refresh() {
            card.querySelectorAll('.pgauth-opt').forEach(function (el) {
                el.className = 'pgauth-opt' + (el.getAttribute('data-id') === 'off' ? ' off' : '') + (getMode() === el.getAttribute('data-id') ? ' sel' : '');
            });
        }
        card.addEventListener('click', async function (e) {
            var opt = e.target.closest ? e.target.closest('.pgauth-opt') : null;
            if (e.target.getAttribute && e.target.getAttribute('data-x') !== null) { close(ov); return; }
            if (!opt) return;
            var id = opt.getAttribute('data-id');
            msg.textContent = ''; msg.className = 'pgauth-msg';
            if (id === 'bio') {
                if (!(await bioAvailable())) { msg.textContent = 'nur in der App (mit Finger/Gesicht)'; msg.className = 'pgauth-msg err'; return; }
                LS.set(LS_MODE, 'bio'); refresh(); return;
            }
            if (id === 'pin') {
                var ok = hasPin() ? true : await pinKeypad('set');
                if (!ok) { msg.textContent = 'PIN nicht gesetzt'; msg.className = 'pgauth-msg err'; return; }
                LS.set(LS_MODE, 'pin'); refresh(); return;
            }
            if (id === 'pinbio') {   // both required: needs biometry available AND a PIN set
                if (!(await bioAvailable())) { msg.textContent = 'nur in der App (mit Finger/Gesicht)'; msg.className = 'pgauth-msg err'; return; }
                var okpb = hasPin() ? true : await pinKeypad('set');
                if (!okpb) { msg.textContent = 'PIN nicht gesetzt'; msg.className = 'pgauth-msg err'; return; }
                LS.set(LS_MODE, 'pinbio'); refresh(); return;
            }
            LS.set(LS_MODE, 'off'); refresh();   // 'off'
        });
    }

    // setMode used programmatically (rare) — mirrors the settings logic without the overlay.
    async function setMode(id) {
        if (id === 'bio') { if (!(await bioAvailable())) return false; LS.set(LS_MODE, 'bio'); return true; }
        if (id === 'pin') { if (!hasPin() && !(await pinKeypad('set'))) return false; LS.set(LS_MODE, 'pin'); return true; }
        if (id === 'pinbio') { if (!(await bioAvailable())) return false; if (!hasPin() && !(await pinKeypad('set'))) return false; LS.set(LS_MODE, 'pinbio'); return true; }
        LS.set(LS_MODE, 'off'); return true;
    }

    // The gate itself — resolves true when the driver is authorised to crank.
    async function gate() {
        var m = getMode();
        if (m === 'off') return true;
        if (m === 'bio') return await bioAuth();
        if (m === 'pin') { if (!hasPin()) return true; return await pinKeypad('verify'); }
        if (m === 'pinbio') {   // both required: PIN first, then biometry
            if (hasPin() && !(await pinKeypad('verify'))) return false;
            return await bioAuth();
        }
        return true;
    }

    global.PagodeAuth = {
        MODES: MODES, getMode: getMode, setMode: setMode, hasPin: hasPin,
        bioAvailable: bioAvailable, gate: gate, openSettings: openSettings
    };
})(window);
