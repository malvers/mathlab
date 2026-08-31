// Client-side password gate for all svp pages (except the kids' practice log
// uebung.html). Static hosting = no server auth; this is a view shield, not a
// vault: only a hash of the passphrase lives in the code (never the
// passphrase itself), unlock state persists per browser in localStorage.
// Include EARLY in <head>: <script src="svp-gate.js"></script> (root) or
// "../svp-gate.js" (subdirs).
// A page can carry its OWN gate, independent of the global switch below:
//   <script src="svp-gate.js" data-gate="<hex>" data-gate-key="svp-gate-sp"
//           data-gate-title="Stundenplan"></script>
// where <hex> = PBKDF2-SHA256 (200 000 rounds, salt = the key string) of the
// passphrase. Compute it with node, never commit the passphrase:
//   node -e "console.log(require('crypto').pbkdf2Sync(process.argv[1],'svp-gate-sp',200000,32,'sha256').toString('hex'))" 'PASSPHRASE'
// Colour scheme (chosen in the quick-nav pencil panel) is applied here rather
// than in svp-nav.js because this file is the only one loaded in <head> —
// setting the class before first paint avoids a dark flash on light pages.
(function () {
    try {
        if (localStorage.getItem('svp-theme') === 'light') {
            document.documentElement.classList.add('svp-light');
        }
    } catch (e) { }
})();

(function () {
    // TEMP (2026-08-19, Doc): global gate disabled — set GATE_OFF to false to re-enable.
    const GATE_OFF = true;
    // Two people unlock the edit button, each with their OWN passphrase — Doc
    // and Liliana (Doc, 31.08.2026). Only the plain SHA-256 hashes live here,
    // never the passphrases. A new one is added with:
    //   node -e "console.log(require('crypto').createHash('sha256').update(process.argv[1]).digest('hex'))" 'PASSPHRASE'
    const HASHES = [
        '517ac27fb0b499ddd50da49532cc40d47d4d36a9a49a43e1558f16eec5cbeda4',  // Doc
        'e5dc8c8b884948b1986c832d5e5b2955b11c8e1a60ef06f820ce81680a07c44c'   // Liliana
    ];
    const HASH = HASHES[0];   // legacy page gate below (currently switched off)
    const ROUNDS = 200000;

    // --- Shared BUTTON gate ------------------------------------------------
    // Any svp page can put an action behind the SVP password with
    //   svpGate.run(function () { ...  });
    // Same hash and unlock key as the plan pages' edit button, so one unlock
    // covers both. Only the SHA-256 hash lives here, never the passphrase.
    // Exported before the early returns below, which only concern the page gate.
    const BTN_KEY = 'svp-edit-gate';
    const toHex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

    /* Das Overlay wird in svp.css gestylt. Seiten ausserhalb der Plaene (die
       Online-Tests) laden die nicht - dann bringen wir die paar Regeln selbst
       mit, statt sie dort ein zweites Mal zu pflegen. Erkannt wird das an
       einer Probe: ohne svp.css ist die Position nicht fixed. */
    function ensureGateStyles() {
        if (document.getElementById('svp-gate-style')) return;
        const probe = document.createElement('div');
        probe.className = 'svp-gate-overlay';
        document.body.appendChild(probe);
        const styled = getComputedStyle(probe).position === 'fixed';
        probe.remove();
        if (styled) return;
        const st = document.createElement('style');
        st.id = 'svp-gate-style';
        st.textContent = [
            '.svp-gate-overlay{position:fixed;inset:0;z-index:2000;display:flex;',
            'align-items:center;justify-content:center;background:rgba(8,20,42,0.55);}',
            '.svp-gate-card{background:#fff;border:1px solid rgba(40,70,120,0.3);border-radius:14px;',
            'padding:30px 34px;text-align:center;width:min(90vw,360px);',
            'box-shadow:0 8px 30px rgba(8,20,42,0.25);}',
            '.svp-gate-title{font-family:Orbitron,sans-serif;font-size:1.05rem;letter-spacing:0.06em;',
            'color:rgb(14,36,78);margin-bottom:6px;}',
            '.svp-gate-sub{font-size:0.85rem;color:rgb(96,112,140);margin-bottom:18px;}',
            '.svp-gate-card input{width:100%;background:#fff;border:1px solid rgba(40,70,120,0.3);',
            'border-radius:8px;color:rgb(14,36,78);font-size:1rem;padding:10px 12px;',
            'margin-bottom:12px;text-align:center;}',
            '.svp-gate-card input:focus{outline:1px solid rgb(28,118,158);}',
            '.svp-gate-card button{width:100%;font-family:Orbitron,sans-serif;font-size:0.72rem;',
            'letter-spacing:0.06em;color:rgb(14,36,78);background:linear-gradient(180deg,#fff,rgb(232,238,248));',
            'border:1px solid rgba(40,70,120,0.3);border-radius:10px;padding:10px 14px;cursor:pointer;}',
            '.svp-gate-err{margin-top:10px;font-size:0.8rem;color:rgb(176,36,24);min-height:1em;}'
        ].join('');
        document.head.appendChild(st);
    }

    function askButtonPwd(onOk) {
        ensureGateStyles();
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">Doc Alvers &middot; SVP</div>' +
            '  <div class="svp-gate-sub">Bitte Passwort eingeben</div>' +
            '  <input type="password" id="svp-btn-pwd" aria-label="Passwort" autocomplete="current-password">' +
            '  <button type="button" class="action" id="svp-btn-go">Freischalten</button>' +
            '  <div class="svp-gate-err" id="svp-btn-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);

        const input = overlay.querySelector('#svp-btn-pwd');
        const err = overlay.querySelector('#svp-btn-err');

        async function tryUnlock() {
            try {
                const hexed = toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value)));
                if (HASHES.indexOf(hexed) >= 0) {
                    try { localStorage.setItem(BTN_KEY, hexed); } catch (e) { }
                    overlay.remove();
                    onOk();
                    return;
                }
                err.textContent = 'Leider nein — nochmal probieren.';
            } catch (e) {
                err.textContent = 'Passwortprüfung nicht möglich (braucht https oder localhost).';
            }
            input.value = '';
            input.focus();
        }

        overlay.querySelector('#svp-btn-go').addEventListener('click', tryUnlock);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
        /* click on the dark backdrop (not the card) cancels */
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        input.focus();
    }

    window.svpGate = {
        unlocked: function () {
            try { return HASHES.indexOf(localStorage.getItem(BTN_KEY)) >= 0; } catch (e) { return false; }
        },
        /* run fn straight away when unlocked, otherwise after a correct password */
        run: function (fn) {
            if (window.svpGate.unlocked()) fn(); else askButtonPwd(fn);
        },
        /* always ask, even when already unlocked (svp-plan.js edit button) */
        ask: askButtonPwd
    };

    // per-page gate from the script tag's data attributes (see header comment)
    const me = document.currentScript;
    const ds = (me && me.dataset) || {};
    const gate = ds.gate
        ? { hash: ds.gate, key: ds.gateKey || 'svp-gate-page', title: ds.gateTitle || 'Doc Alvers &middot; SVP', slow: true }
        : GATE_OFF ? null : { hash: HASH, key: 'svp-gate', title: 'Doc Alvers &middot; SVP', slow: false };
    if (!gate) return;

    try { if (localStorage.getItem(gate.key) === gate.hash) return; } catch (e) { }

    // Lock the page before first paint; svp.css hides body while locked.
    document.documentElement.classList.add('svp-locked');

    const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    async function digest(text) {
        const enc = new TextEncoder();
        if (!gate.slow) return hex(await crypto.subtle.digest('SHA-256', enc.encode(text)));
        // PBKDF2 makes offline guessing against the public hash expensive
        const key = await crypto.subtle.importKey('raw', enc.encode(text), 'PBKDF2', false, ['deriveBits']);
        return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(gate.key), iterations: ROUNDS }, key, 256));
    }

    document.addEventListener('DOMContentLoaded', function () {
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">' + gate.title + '</div>' +
            '  <div class="svp-gate-sub">Interner Bereich &mdash; bitte Passwort eingeben</div>' +
            '  <input type="password" id="svp-gate-pwd" aria-label="Passwort" autocomplete="current-password">' +
            '  <button type="button" class="action" id="svp-gate-go">Öffnen</button>' +
            '  <div class="svp-gate-err" id="svp-gate-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);

        const input = document.getElementById('svp-gate-pwd');
        const err = document.getElementById('svp-gate-err');
        let busy = false;

        async function tryUnlock() {
            if (busy) return;
            busy = true;
            err.textContent = gate.slow ? 'Prüfe …' : ' ';
            try {
                if (await digest(input.value) === gate.hash) {
                    try { localStorage.setItem(gate.key, gate.hash); } catch (e) { }
                    document.documentElement.classList.remove('svp-locked');
                    overlay.remove();
                    return;
                }
                err.textContent = 'Leider nein — nochmal probieren.';
            } catch (e) {
                err.textContent = 'Passwortprüfung nicht möglich (braucht https oder localhost).';
            }
            input.value = '';
            input.focus();
            busy = false;
        }

        document.getElementById('svp-gate-go').addEventListener('click', tryUnlock);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
        input.focus();
    });
})();
