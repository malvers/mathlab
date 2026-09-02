// End-to-end encryption for personal data on the svp pages (currently the talk
// sign-up names, informatik/vortraege.js).
//
// The problem: pupils enter their own names on their own devices, so every
// browser must be able to WRITE a name — but nobody except Doc may ever READ
// one back. A shared password would have to live in this (public) file, so
// instead the pages use a key PAIR:
//
//   * the PUBLIC key sits in Supabase (table svp_vortrag_key, world readable)
//     and is all a browser needs to seal a name — public keys are not secrets;
//   * the PRIVATE key never leaves Doc: it is stored only as a blob that was
//     wrapped with a passphrase he alone knows, and unwrapping happens in his
//     browser. A database dump, a leaked publishable key or a curious pupil
//     therefore yields ciphertext and nothing else.
//
// Scheme (ECIES, all from WebCrypto): per name a fresh ephemeral P-256 key
// pair, ECDH against the public key, the derived AES-GCM-256 key encrypts the
// name once. Blob format  v1.<ephPubRaw>.<iv>.<ciphertext>  (base64).
// The private key is wrapped as  p1.<salt>.<iv>.<ciphertext>  with
// PBKDF2-SHA256 (250 000 rounds) over the passphrase.
//
// The unwrapped key is held in sessionStorage, never in localStorage: closing
// the tab locks it again, so a classroom machine keeps nothing.
//
// Needs svp-auth.js (DB_URL/DB_KEY, session for reading the wrapped key).
// Exposes window.svpCrypto.
(function () {
    const KEY_ID = 'doc';                       /* one key pair for all pages */
    const SS_KEY = 'svp-vortrag-priv';          /* sessionStorage: unwrapped private JWK */
    const ROUNDS = 250000;
    const TABLE = 'svp_vortrag_key';

    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const subtle = (window.crypto && crypto.subtle) || null;

    const b64 = (buf) => btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
    const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

    let pubKey = null;      /* CryptoKey, cached per page load */
    let pubMissing = false; /* true once we know no key pair exists yet */
    let privKey = null;     /* CryptoKey, only after unlock() */

    function auth() {
        if (!window.svpAuth) throw new Error('svp-auth.js fehlt');
        return window.svpAuth;
    }

    /* ---------- public key: read anonymously, every visitor may seal ---------- */

    async function publicKey() {
        if (pubKey) return pubKey;
        if (pubMissing) return null;
        const a = auth();
        const res = await fetch(a.DB_URL + '/rest/v1/' + TABLE + '?id=eq.' + KEY_ID + '&select=pub', {
            headers: { apikey: a.DB_KEY, Authorization: 'Bearer ' + a.DB_KEY }
        });
        if (!res.ok) throw new Error('Schlüssel nicht erreichbar (HTTP ' + res.status + ')');
        const rows = await res.json();
        if (!rows.length) { pubMissing = true; return null; }
        pubKey = await subtle.importKey('jwk', rows[0].pub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
        return pubKey;
    }

    /* ---------- sealing (anyone) and opening (Doc only) ---------- */

    async function seal(text) {
        const pub = await publicKey();
        if (!pub) throw new Error('Es ist noch kein Schlüssel eingerichtet');
        const eph = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']);
        const aes = await subtle.deriveKey({ name: 'ECDH', public: pub }, eph.privateKey,
            { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = await subtle.encrypt({ name: 'AES-GCM', iv: iv }, aes, enc.encode(text));
        const raw = await subtle.exportKey('raw', eph.publicKey);
        return 'v1.' + b64(raw) + '.' + b64(iv) + '.' + b64(ct);
    }

    async function open(blob) {
        if (!privKey) throw new Error('gesperrt');
        const p = String(blob || '').split('.');
        if (p.length !== 4 || p[0] !== 'v1') throw new Error('unbekanntes Format');
        const ephPub = await subtle.importKey('raw', unb64(p[1]), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
        const aes = await subtle.deriveKey({ name: 'ECDH', public: ephPub }, privKey,
            { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
        const pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(p[2]) }, aes, unb64(p[3]));
        return dec.decode(pt);
    }

    /* ---------- passphrase wrapping of the private key ---------- */

    async function wrapKey(pass, salt) {
        const base = await subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
        return subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: ROUNDS, hash: 'SHA-256' },
            base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    }

    async function wrapPrivate(jwk, pass) {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const k = await wrapKey(pass, salt);
        const ct = await subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, enc.encode(JSON.stringify(jwk)));
        return 'p1.' + b64(salt) + '.' + b64(iv) + '.' + b64(ct);
    }

    async function unwrapPrivate(wrapped, pass) {
        const p = String(wrapped || '').split('.');
        if (p.length !== 4 || p[0] !== 'p1') throw new Error('unbekanntes Schlüsselformat');
        const k = await wrapKey(pass, unb64(p[1]));
        let pt;
        try {
            pt = await subtle.decrypt({ name: 'AES-GCM', iv: unb64(p[2]) }, k, unb64(p[3]));
        } catch (e) {
            throw new Error('Falsches Passwort');
        }
        return JSON.parse(dec.decode(pt));
    }

    async function useJwk(jwk) {
        privKey = await subtle.importKey('jwk', jwk, { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']);
        return privKey;
    }

    /* ---------- key pair lifecycle ---------- */

    /* One-time setup. Needs a login (the wrapped key is stored where only a
       logged-in user can read it) and returns once the pair is in the cloud. */
    async function createKeypair(pass) {
        const a = auth();
        if (!a.hasSession()) throw new Error('Bitte zuerst anmelden');
        const pair = await subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveKey']);
        const pubJwk = await subtle.exportKey('jwk', pair.publicKey);
        const privJwk = await subtle.exportKey('jwk', pair.privateKey);
        const wrapped = await wrapPrivate(privJwk, pass);
        const res = await a.api(TABLE, {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify([{ id: KEY_ID, pub: pubJwk, wrapped_priv: wrapped, ts: new Date().toISOString() }])
        });
        if (!res.ok) throw new Error('Schlüssel konnte nicht gespeichert werden (HTTP ' + res.status + ')');
        pubKey = null;
        pubMissing = false;
        await useJwk(privJwk);
        try { sessionStorage.setItem(SS_KEY, JSON.stringify(privJwk)); } catch (e) { }
        return true;
    }

    /* Doc unlocks: fetch the wrapped key (login required), unwrap, keep for the tab. */
    async function unlock(pass) {
        const a = auth();
        if (!a.hasSession()) throw new Error('Bitte zuerst anmelden');
        const res = await a.api(TABLE + '?id=eq.' + KEY_ID + '&select=wrapped_priv');
        if (!res.ok) throw new Error('Schlüssel nicht lesbar (HTTP ' + res.status + ')');
        const rows = await res.json();
        if (!rows.length || !rows[0].wrapped_priv) throw new Error('Es ist noch kein Schlüssel eingerichtet');
        const jwk = await unwrapPrivate(rows[0].wrapped_priv, pass);
        await useJwk(jwk);
        try { sessionStorage.setItem(SS_KEY, JSON.stringify(jwk)); } catch (e) { }
        return true;
    }

    function lock() {
        privKey = null;
        try { sessionStorage.removeItem(SS_KEY); } catch (e) { }
    }

    /* Re-arm from sessionStorage after a reload, before anything renders. */
    const ready = (async function () {
        if (!subtle) return false;
        let raw = null;
        try { raw = sessionStorage.getItem(SS_KEY); } catch (e) { }
        if (!raw) return false;
        try { await useJwk(JSON.parse(raw)); return true; } catch (e) { lock(); return false; }
    })();

    /* ---------- passphrase dialog (never a native prompt) ---------- */

    /* mode 'unlock' asks once, mode 'create' asks twice and warns that a lost
       passphrase means the names are gone for good. onOk() runs after success. */
    /* `title` is optional and only relabels the dialog - the talk pages call it
       without one and keep "Vortragsnamen". Same key, same passphrase; only the
       heading follows the page the user is standing on. */
    function passDialog(mode, onOk, title) {
        const create = mode === 'create';
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">' + (title || 'Vortragsnamen') + '</div>' +
            '  <div class="svp-gate-sub">' +
            (create ? 'Neues Schl&uuml;ssel-Passwort vergeben &mdash; ohne dieses Passwort sind die Namen sp&auml;ter nicht mehr lesbar.'
                : 'Schl&uuml;ssel-Passwort eingeben, um die Namen zu sehen') +
            '  </div>' +
            '  <input type="password" id="svp-cry-p1" placeholder="Schl&uuml;ssel-Passwort" aria-label="Schl&uuml;ssel-Passwort" autocomplete="off">' +
            (create ? '  <input type="password" id="svp-cry-p2" placeholder="Wiederholen" aria-label="Passwort wiederholen" autocomplete="off">' : '') +
            '  <div class="svp-gate-row">' +
            '    <button type="button" class="action secondary" id="svp-cry-cancel">Abbrechen</button>' +
            '    <button type="button" class="action" id="svp-cry-go">' + (create ? 'Schl&uuml;ssel erzeugen' : 'Entsperren') + '</button>' +
            '  </div>' +
            '  <div class="svp-gate-err" id="svp-cry-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);
        const p1 = overlay.querySelector('#svp-cry-p1');
        const p2 = overlay.querySelector('#svp-cry-p2');
        const err = overlay.querySelector('#svp-cry-err');
        const go = overlay.querySelector('#svp-cry-go');
        async function run() {
            const pass = p1.value;
            if (create && pass.length < 8) { err.textContent = 'Mindestens 8 Zeichen'; return; }
            if (create && pass !== p2.value) { err.textContent = 'Die beiden Eingaben sind verschieden'; return; }
            err.textContent = create ? 'Erzeuge Schlüssel …' : 'Entsperre …';
            go.disabled = true;
            try {
                if (create) await createKeypair(pass); else await unlock(pass);
            } catch (e) {
                err.textContent = e.message;
                go.disabled = false;
                p1.focus();
                p1.select();
                return;
            }
            overlay.remove();
            if (onOk) onOk();
        }
        go.addEventListener('click', run);
        overlay.querySelector('#svp-cry-cancel').addEventListener('click', () => overlay.remove());
        [p1, p2].forEach((el) => el && el.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); }));
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        p1.focus();
    }

    window.svpCrypto = {
        ready: ready,
        available: !!subtle,
        hasPrivate: function () { return !!privKey; },
        publicKey: publicKey,
        hasPublic: async function () { return !!(await publicKey()); },
        seal: seal,
        open: open,
        unlock: unlock,
        lock: lock,
        createKeypair: createKeypair,
        passDialog: passDialog
    };
})();
