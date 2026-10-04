// Shared Supabase auth core for all svp pages (notes.html + plan pages).
// One session under localStorage 'svp-session': logging in on notes.html
// logs every svp page in. Plain fetch, no supabase-js needed here.
// Exposes window.svpAuth = { DB_URL, DB_KEY, session, hasSession,
// storeSession, ensureFreshToken, api, login, loginDialog, whoami,
// gleich, merge3, sicherSpeichern } - the last three: saving without overwriting what came meanwhile (below).
(function () {
    const DB_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
    const DB_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; /* publishable key – public by design */
    const SESSION_KEY = 'svp-session';

    let session = null;
    try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { session = null; }

    function storeSession(s) {
        session = s;
        if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        else localStorage.removeItem(SESSION_KEY);
    }

    /* Refresh the access token via plain fetch when it is about to expire. */
    async function ensureFreshToken() {
        if (!session) throw new Error('nicht angemeldet');
        if (session.expires_at && Date.now() / 1000 < session.expires_at - 60) return;
        const res = await fetch(DB_URL + '/auth/v1/token?grant_type=refresh_token', {
            method: 'POST',
            headers: { apikey: DB_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: session.refresh_token })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            storeSession(null);
            throw new Error('Session abgelaufen — bitte neu anmelden');
        }
        storeSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600)
        });
    }

    /* PostgREST call with fresh token; one retry after a 401. */
    async function api(path, opts, retry) {
        await ensureFreshToken();
        /* svp-plan saves on beforeunload — a normal fetch is killed with the page and the last edit
           would only ever reach localStorage. keepalive lets the browser finish it, but caps the body
           at 64 kB, so oversized payloads keep the plain path. */
        const body = opts && opts.body;
        const keepalive = typeof body !== 'string' || body.length < 60000;
        const res = await fetch(DB_URL + '/rest/v1/' + path, Object.assign({ keepalive: keepalive }, opts, {
            headers: Object.assign({
                apikey: DB_KEY,
                Authorization: 'Bearer ' + session.access_token,
                'Content-Type': 'application/json'
            }, (opts && opts.headers) || {})
        }));
        if (res.status === 401 && !retry) {
            session.expires_at = 0; /* force refresh */
            return api(path, opts, true);
        }
        return res;
    }

    /* Password login via plain fetch (same call notes.html makes); stores the session. */
    async function login(email, password) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 12000);
        let res;
        try {
            res = await fetch(DB_URL + '/auth/v1/token?grant_type=password', {
                method: 'POST',
                headers: { apikey: DB_KEY, 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password }),
                signal: ctrl.signal
            });
        } catch (e) {
            clearTimeout(timer);
            throw new Error(ctrl.signal.aborted ? 'Timeout — Request kommt nicht durch' : 'Netzwerkfehler: ' + e.message);
        }
        clearTimeout(timer);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.msg || data.error_description || ('HTTP ' + res.status));
        storeSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600)
        });
        return session;
    }

    /* Styled login dialog (never a native prompt), reusing the svp-gate overlay CSS.
       Used by the plan pages when "Bearbeiten" is clicked without a session
       (Doc, 26.08.2026). onOk runs after a successful login; backdrop click cancels. */
    function loginDialog(onOk, sub) {
        /* pages without svp.css (vote.html) get the card's rules from svp-gate.js */
        if (window.svpGate && window.svpGate.ensureStyles) window.svpGate.ensureStyles();
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">Doc Alvers &middot; SVP</div>' +
            '  <div class="svp-gate-sub">' + (sub || 'Bitte anmelden, um zu bearbeiten') + '</div>' +
            '  <input type="email" id="svp-login-email" placeholder="E-Mail" aria-label="E-Mail" autocomplete="username">' +
            '  <input type="password" id="svp-login-pwd" placeholder="Passwort" aria-label="Passwort" autocomplete="current-password">' +
            '  <div class="svp-gate-row">' +
            '    <button type="button" class="action secondary" id="svp-login-cancel">Abbrechen</button>' +
            '    <button type="button" class="action" id="svp-login-go">Login</button>' +
            '  </div>' +
            '  <div class="svp-gate-err" id="svp-login-err">&nbsp;</div>' +
            '</div>';
        document.body.appendChild(overlay);
        const email = overlay.querySelector('#svp-login-email');
        const pwd = overlay.querySelector('#svp-login-pwd');
        const err = overlay.querySelector('#svp-login-err');
        const go = overlay.querySelector('#svp-login-go');
        async function tryLogin() {
            err.textContent = 'Anmelden …';
            go.disabled = true;
            try {
                /* strip paste artifacts (trailing newline/CR) — never part of a real password */
                await login(email.value.trim(), pwd.value.replace(/[\r\n]+$/, ''));
            } catch (e) {
                err.textContent = e.message;
                go.disabled = false;
                pwd.focus();
                return;
            }
            /* The dialog is no <form>, so Chrome never sees a login and never offers to save the password.
               Hand it over explicitly (capped, store() can hang without a password manager) - Doc 04.10.2026. */
            if (window.PasswordCredential && navigator.credentials) {
                try {
                    await Promise.race([
                        navigator.credentials.store(new PasswordCredential({ id: email.value.trim(), password: pwd.value.replace(/[\r\n]+$/, '') })),
                        new Promise(r => setTimeout(r, 1500))
                    ]);
                } catch (e) { }
            }
            overlay.remove();
            if (onOk) onOk();
        }
        go.addEventListener('click', tryLogin);
        overlay.querySelector('#svp-login-cancel').addEventListener('click', () => overlay.remove());
        [email, pwd].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); }));
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        email.focus();
    }

    /* Wer ist gerade angemeldet? Steht im Access-Token (JWT, Payload base64url).
       Gebraucht fuer verstaendliche Fehler: ein 403 auf einer Planseite heisst
       immer "falsches Konto", und ohne den Namen ist das Raten (Doc, 01.09.2026). */
    function whoami() {
        if (!session || !session.access_token) return '';
        try {
            const part = session.access_token.split('.')[1];
            const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
            const claims = JSON.parse(decodeURIComponent(escape(json)));
            return claims.email || claims.sub || '';
        } catch (e) { return ''; }
    }

    /* ---- Saving a whole-object row without overwriting what came meanwhile -------------------------------------
       Doc, 27.09.2026: "Das darf nie passieren. Dann stehe ich am Montag im Unterricht und alles ist weg." - a plan
       tab open since the morning saved its old state over a pill added at noon: every save wrote the whole row, the
       last write won. Now a save lands only on the cloud state it was built on: one PATCH with ts=eq.<base ts>, so
       nothing can slip in between reading and writing. If another device wrote meanwhile, no row comes back: the
       current row is fetched, merged (base / this tab / cloud) and the write tries again on it. The database keeps
       every former row as well (<table>_history). */

    /* equal as data - jsonb hands keys back in its own order, so plain JSON.stringify would see changes that are none */
    function stabil(v) {
        if (Array.isArray(v)) return '[' + v.map(stabil).join(',') + ']';
        if (v && typeof v === 'object') {
            return '{' + Object.keys(v).filter(k => v[k] !== undefined).sort()
                .map(k => JSON.stringify(k) + ':' + stabil(v[k])).join(',') + '}';
        }
        return JSON.stringify(v === undefined ? null : v);
    }
    function gleich(a, b) { return stabil(a) === stabil(b); }

    /* The general merge, key by key and as deep as both sides are objects: what one side changed wins; both the same
       way: that; both differently: this tab's (it is the one saving now) - or the cloud's while the base is unknown
       (null) - and a conflict is noted with both values. */
    function merge3(base, lokal, cloud, pfad, konflikte) {
        pfad = pfad || [];
        konflikte = konflikte || [];
        const obj = v => v && typeof v === 'object' && !Array.isArray(v);
        if (gleich(lokal, cloud)) return { wert: lokal, konflikte };
        if (base !== null && gleich(lokal, base)) return { wert: cloud, konflikte };
        if (base !== null && gleich(cloud, base)) return { wert: lokal, konflikte };
        if (obj(lokal) && obj(cloud)) {
            const out = {};
            new Set([...Object.keys(lokal), ...Object.keys(cloud), ...Object.keys(obj(base) ? base : {})]).forEach(k => {
                const b = base === null ? null : (obj(base) ? base[k] : undefined);
                const w = merge3(b, lokal[k], cloud[k], pfad.concat(k), konflikte).wert;
                if (w !== undefined) out[k] = w;
            });
            return { wert: out, konflikte };
        }
        konflikte.push({ pfad: pfad.join('.'), lokal: lokal, cloud: cloud });
        return { wert: base === null ? (cloud === undefined ? lokal : cloud) : lokal, konflikte };
    }

    /* opts: { tabelle, spalte, seite, lokal, basis, mergen }
         basis   { ts, daten }: the cloud row this tab built on; null: none known (an existing row is then merged with
                 the base unknown)
         mergen  (base|null, lokal, cloud) -> { daten, konflikte } or { stop: text } (do not write, say why);
                 default: merge3
       -> { ok, status, daten, ts, gemischt, konflikte, stop } - daten/ts: what the cloud holds now */
    async function sicherSpeichern(opts) {
        const tab = opts.tabelle, sp = opts.spalte;
        const q = tab + '?page=eq.' + encodeURIComponent(opts.seite);
        const mergen = opts.mergen || function (b, l, c) { const m = merge3(b, l, c); return { daten: m.wert, konflikte: m.konflikte }; };
        let base = opts.basis && opts.basis.ts ? opts.basis : null, daten = opts.lokal, gemischt = false, konflikte = [];
        for (let versuch = 0; versuch < 5; versuch++) {
            const ts = new Date().toISOString(), zeile = { ts: ts };
            zeile[sp] = daten;
            let res;
            if (base) {
                /* the base goes along as well: the database refuses an update without it (trigger svp_plan_*_basis,
                   27.09.2026) - so a tab still running the old code gets an error instead of overwriting */
                zeile.basis = base.ts;
                res = await api(q + '&ts=eq.' + encodeURIComponent(base.ts), {
                    method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(zeile)
                });
            } else {
                zeile.page = opts.seite;
                /* no row known: insert - a row there already answers 409, and is merged below */
                res = await api(tab, { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify([zeile]) });
            }
            if (res.ok) {
                const rows = await res.json().catch(() => []);
                if (rows.length) return { ok: true, status: res.status, daten: rows[0][sp], ts: rows[0].ts, gemischt, konflikte };
            } else if (!(res.status === 409 && !base)) {
                return { ok: false, status: res.status, gemischt, konflikte };
            }
            // nothing written: another device was faster - fetch its row and merge
            const r2 = await api(q + '&select=' + sp + ',ts');
            if (!r2.ok) return { ok: false, status: r2.status, gemischt, konflikte };
            const cloud = (await r2.json())[0];
            if (!cloud) { base = null; continue; }
            const m = mergen(base ? base.daten : null, daten, cloud[sp] || {});
            if (m.stop) return { ok: false, status: 409, stop: m.stop, cloud: { daten: cloud[sp] || {}, ts: cloud.ts }, gemischt, konflikte };
            daten = m.daten;
            konflikte = konflikte.concat(m.konflikte || []);
            base = { ts: cloud.ts, daten: cloud[sp] || {} };
            gemischt = true;
        }
        return { ok: false, status: 409, gemischt, konflikte };
    }

    window.svpAuth = {
        DB_URL: DB_URL,
        DB_KEY: DB_KEY,
        get session() { return session; },
        hasSession: function () { return !!(session && session.refresh_token); },
        storeSession: storeSession,
        ensureFreshToken: ensureFreshToken,
        api: api,
        login: login,
        loginDialog: loginDialog,
        whoami: whoami,
        gleich: gleich,
        merge3: merge3,
        sicherSpeichern: sicherSpeichern
    };
})();
