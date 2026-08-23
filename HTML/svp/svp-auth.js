// Shared Supabase auth core for all svp pages (notes.html + plan pages).
// One session under localStorage 'svp-session': logging in on notes.html
// logs every svp page in. Plain fetch, no supabase-js needed here.
// Exposes window.svpAuth = { DB_URL, DB_KEY, session, hasSession,
// storeSession, ensureFreshToken, api }.
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

    window.svpAuth = {
        DB_URL: DB_URL,
        DB_KEY: DB_KEY,
        get session() { return session; },
        hasSession: function () { return !!(session && session.refresh_token); },
        storeSession: storeSession,
        ensureFreshToken: ensureFreshToken,
        api: api
    };
})();
