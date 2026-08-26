// Shared Supabase auth core for all svp pages (notes.html + plan pages).
// One session under localStorage 'svp-session': logging in on notes.html
// logs every svp page in. Plain fetch, no supabase-js needed here.
// Exposes window.svpAuth = { DB_URL, DB_KEY, session, hasSession,
// storeSession, ensureFreshToken, api, login, loginDialog }.
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
    function loginDialog(onOk) {
        const overlay = document.createElement('div');
        overlay.className = 'svp-gate-overlay';
        overlay.innerHTML =
            '<div class="svp-gate-card">' +
            '  <div class="svp-gate-title">Doc Alvers &middot; SVP</div>' +
            '  <div class="svp-gate-sub">Bitte anmelden, um zu bearbeiten</div>' +
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
            overlay.remove();
            if (onOk) onOk();
        }
        go.addEventListener('click', tryLogin);
        overlay.querySelector('#svp-login-cancel').addEventListener('click', () => overlay.remove());
        [email, pwd].forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); }));
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
        email.focus();
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
        loginDialog: loginDialog
    };
})();
