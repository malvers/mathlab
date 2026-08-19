// Client-side password gate for all svp pages (except the kids' practice log
// uebung.html). Static hosting = no server auth; this is a view shield, not a
// vault: only the SHA-256 hash of the passphrase lives in the code (never the
// passphrase itself), unlock state persists per browser in localStorage.
// Include EARLY in <head>: <script src="svp-gate.js"></script> (root) or
// "../svp-gate.js" (subdirs).
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
    // TEMP (2026-08-19, Doc): gate disabled — set GATE_OFF to false to re-enable.
    const GATE_OFF = true;
    if (GATE_OFF) return;

    const HASH = '517ac27fb0b499ddd50da49532cc40d47d4d36a9a49a43e1558f16eec5cbeda4';
    const KEY = 'svp-gate';

    if (localStorage.getItem(KEY) === HASH) return;

    // Lock the page before first paint; svp.css hides body while locked.
    document.documentElement.classList.add('svp-locked');

    async function sha256hex(text) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">Doc Alvers &middot; SVP</div>' +
            '  <div class="svp-gate-sub">Interner Bereich &mdash; bitte Passwort eingeben</div>' +
            '  <input type="password" id="svp-gate-pwd" aria-label="Passwort" autocomplete="current-password">' +
            '  <button type="button" class="action" id="svp-gate-go">Öffnen</button>' +
            '  <div class="svp-gate-err" id="svp-gate-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);

        const input = document.getElementById('svp-gate-pwd');
        const err = document.getElementById('svp-gate-err');

        async function tryUnlock() {
            const hex = await sha256hex(input.value);
            if (hex === HASH) {
                localStorage.setItem(KEY, HASH);
                document.documentElement.classList.remove('svp-locked');
                overlay.remove();
            } else {
                err.textContent = 'Leider nein — nochmal probieren.';
                input.value = '';
                input.focus();
            }
        }

        document.getElementById('svp-gate-go').addEventListener('click', tryUnlock);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
        input.focus();
    });
})();
