/*
 * DocFit's data on the web: the same private Supabase tables as the Android app (supabase/migrations/
 * 20261121_docfit.sql), with Doc's SVP login (svp-auth.js) - "DocFit im Web = identisch zum Phone" (Doc, 20.11.2026).
 *
 * The rules are the phone's (docfit-app/.../SyncRows.java, SyncPlan.java):
 * - a row is keyed by its moment in ms (weigh-ins, readings, times) or by the person (0 = Doc, 1 = the second person);
 *   every write is an upsert (on_conflict = user_id + key), so sending twice never hurts;
 * - deleting sets deleted_at (a tombstone the phone takes over), undo writes the row again;
 * - writes wait in a small queue (kept in localStorage, the only thing kept there) and are retried - 5 s, then up to
 *   60 s - until the server has them; a row still waiting is never overwritten by what comes from the server;
 * - what the phone changed comes in with a pull of everything changed since the last one (on focus and every minute).
 * Health data is never cached in the browser beyond the queue of unsent writes.
 */
(function () {
    'use strict';
    const auth = window.svpAuth;
    const QUEUE_KEY = 'docfit-outbox';
    const OVERLAP_MS = 120000, PAGE = 1000;

    const T = {
        profile: { name: 'docfit_profile', key: 'person', cols: ['person', 'name', 'height_cm', 'birth_year', 'sex', 'active'] },
        weighing: { name: 'docfit_weighing', key: 'measured_at', cols: ['measured_at', 'person', 'centi_kg', 'ohm', 'waist_mm', 'hip_mm'] },
        run: { name: 'docfit_run', key: 'started_at', cols: ['started_at', 'duration_ms', 'kind'] },
        bp: { name: 'docfit_bp', key: 'measured_at', cols: ['measured_at', 'person', 'sys', 'dia', 'pulse', 'source', 'note'] },
        glucose: { name: 'docfit_glucose', key: 'measured_at', cols: ['measured_at', 'person', 'mg_dl', 'context', 'source', 'note'] },
        // live fasts (20261121d_docfit_fast.sql): keyed by the fast's id, listed by their start
        fast: { name: 'docfit_fast', key: 'fast_id', sort: 'started_at', cols: ['fast_id', 'person', 'started_at', 'ended_at', 'planned_days', 'note'] }
    };
    const isTime = c => c === 'measured_at' || c === 'started_at' || c === 'ended_at';
    const iso = ms => new Date(ms).toISOString();

    const rows = { profile: new Map(), weighing: new Map(), run: new Map(), bp: new Map(), glucose: new Map(), fast: new Map() };
    const cursor = { profile: 0, weighing: 0, run: 0, bp: 0, glucose: 0, fast: 0 };
    let queue = new Map();   // 'table:key' -> { table, key, wire }
    let listeners = [], statusListeners = [];
    let busy = false, retryT = null, retryMs = 5000, status = { text: '', kind: '' };

    try {
        const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        for (const it of q) queue.set(it.table + ':' + it.key, it);
    } catch (e) { queue = new Map(); }
    function saveQueue() {
        try { localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue.values()])); } catch (e) { }
    }

    /** a row from the server: moments as ms, everything else as it comes */
    function fromDb(table, o) {
        const r = {};
        for (const c of T[table].cols) {
            const v = o[c];
            r[c] = v == null ? null : isTime(c) ? Date.parse(v) : v;
        }
        r._deleted = o.deleted_at != null;
        r._updated = o.updated_at ? Date.parse(o.updated_at) : 0;
        return r;
    }
    const keyOf = (table, r) => String(r[T[table].key]);

    function wire(table, r, deletedAt) {
        const o = {};
        for (const c of T[table].cols) {
            const v = r[c] === undefined ? null : r[c];
            o[c] = v != null && isTime(c) ? iso(v) : v;
        }
        o.deleted_at = deletedAt ? iso(deletedAt) : null;
        return o;
    }

    function emit() { listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
    function setStatus(text, kind) {
        status = { text, kind: kind || '' };
        statusListeners.forEach(f => { try { f(status); } catch (e) { } });
    }

    async function fetchAll(table, after) {
        const t = T[table], out = [];
        const filter = after ? '&updated_at=gt.' + encodeURIComponent(iso(after)) : '&deleted_at=is.null';
        for (let off = 0; ; off += PAGE) {
            const res = await auth.api(`${t.name}?select=*${filter}&order=updated_at.asc,${t.key}.asc&limit=${PAGE}&offset=${off}`);
            if (res.status === 404) return out;   // the table is not there yet (its SQL not run): empty for now
            if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? 'Kein Zugriff mit diesem Konto' : 'HTTP ' + res.status);
            const page = await res.json();
            out.push(...page);
            if (page.length < PAGE) return out;
        }
    }

    /** everything once (no tombstones) */
    async function load() {
        for (const table of Object.keys(T)) {
            const list = await fetchAll(table, 0);
            rows[table].clear();
            for (const o of list) {
                const r = fromDb(table, o);
                rows[table].set(keyOf(table, r), r);
                cursor[table] = Math.max(cursor[table], r._updated);
            }
        }
        overlayQueue();
        emit();
        flush();
    }

    /** what changed since the last pull, tombstones included; a row still waiting in the queue keeps the local version */
    async function pull() {
        let changed = false;
        for (const table of Object.keys(T)) {
            const list = await fetchAll(table, cursor[table] ? cursor[table] - OVERLAP_MS : 1);
            for (const o of list) {
                const r = fromDb(table, o), k = keyOf(table, r);
                cursor[table] = Math.max(cursor[table], r._updated);
                if (queue.has(table + ':' + k)) continue;
                const had = rows[table].get(k);
                if (r._deleted) {
                    if (had) { rows[table].delete(k); changed = true; }
                } else if (!had || JSON.stringify(wire(table, had)) !== JSON.stringify(wire(table, r))) {
                    rows[table].set(k, r);
                    changed = true;
                }
            }
        }
        if (changed) emit();
        return changed;
    }

    /** the queue's rows over what came from the server (an unsent change stays visible after a reload) */
    function overlayQueue() {
        for (const it of queue.values()) {
            const r = {};
            for (const c of T[it.table].cols) r[c] = it.wire[c] != null && isTime(c) ? Date.parse(it.wire[c]) : it.wire[c];
            if (it.wire.deleted_at) rows[it.table].delete(it.key);
            else rows[it.table].set(it.key, r);
        }
    }

    function enqueue(table, r, deletedAt) {
        const k = keyOf(table, r);
        queue.set(table + ':' + k, { table, key: k, wire: wire(table, r, deletedAt) });
        saveQueue();
        clearTimeout(retryT);
        setTimeout(flush, 0);
    }

    /** sends the queue, one request per table; on failure it stays and is retried */
    async function flush() {
        if (busy || !queue.size) return;
        busy = true;
        clearTimeout(retryT);
        retryT = null;
        let failed = false;
        setStatus('speichert …');
        try {
            const byTable = {};
            for (const it of queue.values()) (byTable[it.table] = byTable[it.table] || []).push(it);
            for (const table of Object.keys(byTable)) {
                const items = byTable[table];
                const res = await auth.api(`${T[table].name}?on_conflict=user_id,${T[table].key}`, {
                    method: 'POST',
                    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
                    body: JSON.stringify(items.map(it => it.wire))
                });
                if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? 'Kein Zugriff mit diesem Konto' : 'HTTP ' + res.status);
                for (const it of items) {
                    const cur = queue.get(table + ':' + it.key);
                    if (cur && JSON.stringify(cur.wire) === JSON.stringify(it.wire)) queue.delete(table + ':' + it.key);
                }
                saveQueue();
            }
            retryMs = 5000;
            setStatus('gespeichert ✓', 'ok');
        } catch (err) {
            failed = true;
            const offline = navigator.onLine === false || err instanceof TypeError;
            setStatus((offline ? 'offline' : 'nicht gespeichert (' + err.message + ')') + ' – wird nachgeholt', 'err');
            retryT = setTimeout(flush, retryMs);
            retryMs = Math.min(retryMs * 2, 60000);
        } finally {
            busy = false;
            if (queue.size && !failed) setTimeout(flush, 0);   // written meanwhile
        }
    }

    // ---- the API the page uses ----------------------------------------------------------------------------------

    const api = {
        T, rows,
        load, pull, flush,
        onChange(f) { listeners.push(f); },
        onStatus(f) { statusListeners.push(f); f(status); },
        pending: () => queue.size,
        /** all rows of a table, newest first by their key (moments) */
        list(table, filter) {
            const out = [...rows[table].values()].filter(r => !filter || filter(r));
            const k = T[table].sort || T[table].key;
            return out.sort((a, b) => b[k] - a[k]);
        },
        get: (table, key) => rows[table].get(String(key)) || null,
        /** the historic fasts 2021-2024 (docfit_fasting: one generated document), null while there is none */
        async historic() {
            try {
                const res = await auth.api('docfit_fasting?select=data&deleted_at=is.null&limit=1');
                if (!res.ok) return null;
                const list = await res.json();
                return list.length ? list[0].data : null;
            } catch (e) { return null; }
        },
        /** writes a row (new or changed) */
        put(table, r) {
            const clean = {};
            for (const c of T[table].cols) clean[c] = r[c] === undefined ? null : r[c];
            rows[table].set(keyOf(table, clean), clean);
            enqueue(table, clean, 0);
            emit();
            return clean;
        },
        /** deletes a row (tombstone); returns it for "Rückgängig" */
        remove(table, key) {
            const r = rows[table].get(String(key));
            if (!r) return null;
            rows[table].delete(String(key));
            enqueue(table, r, Date.now());
            emit();
            return r;
        },
        /** the profile of a person as the core takes it: { heightCm, birthYear, sex, name, active } */
        profile(person) {
            const r = rows.profile.get(String(person)) || {};
            return {
                heightCm: r.height_cm || 0, birthYear: r.birth_year || 0, sex: r.sex || '',
                name: person === 0 ? 'Doc' : (r.name || 'Gast'), active: r.active !== false
            };
        }
    };
    window.DocFitData = api;
})();
