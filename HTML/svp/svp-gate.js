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
    const HASH = '517ac27fb0b499ddd50da49532cc40d47d4d36a9a49a43e1558f16eec5cbeda4';   // plain SHA-256 (legacy)
    const ROUNDS = 200000;

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
