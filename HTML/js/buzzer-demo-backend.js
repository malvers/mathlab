/* The buzzer's backend (js/buzzer.js, buzzer.html), pretended in the browser - for live tours (the Vorrechnen tour,
 * Doc 03.10.2026), where no tap may land in the real tables: the class's "nicht verstanden" feeds Doc's Wiederholung.
 * Made from js/quiz-demo-backend.js. The tour page creates one per run and sets window.__tourBackend; js/tour-hook.js,
 * the first script of vorrechnen.html and buzzer.html, routes their Supabase fetches here.
 *
 * It answers what the tables buzzer, buzzer_tempo and buzzer_text answer, from memory:
 *   POST rest/v1/buzzer?select=id {code[, bezug]}        -> [{id}]
 *   GET  rest/v1/buzzer?code=eq.C&id=gt.N                -> the rows after N
 *   POST rest/v1/buzzer_tempo {code, art}, GET ...?code=eq.C&created_at=gt.T
 *   POST rest/v1/buzzer_text {code, text},  GET ...?code=eq.C&created_at=gt.T (svpAuth.api, see api())
 * Solita's box at the board (js/solita-frage.js) asks functions/v1/claude: the tour sets her answer beforehand
 * (solita(text, ms)), so the box shows the very words the tour's voice reads; functions/v1/tts brings no audio, the box
 * stays silent. Anything else aimed at Supabase (vorrechnen_feedback, auth, other functions) gets an empty answer - it
 * never leaves the browser. The tour itself presses for the class it does not show: press(), understood(), tempo(), text().
 *
 * storageFor(w): every page of the tour gets a localStorage and sessionStorage of its own in memory, seeded with
 * opts.seed (js/tour-hook.js puts them in before the page's first script reads) - online the tour shares docalvers.de
 * with Doc's real board, and nothing of a tour may land there.
 */
(function () {
    'use strict';

    const SUPA = 'https://fyfhxzyymmurlaenmzse.supabase.co';

    /* a Storage in memory, as the pages use it */
    function memStorage(seed) {
        const m = new Map(Object.entries(seed || {}).map(([k, v]) => [k, String(v)]));
        return {
            getItem: (k) => (m.has(String(k)) ? m.get(String(k)) : null),
            setItem: (k, v) => { m.set(String(k), String(v)); },
            removeItem: (k) => { m.delete(String(k)); },
            clear: () => m.clear(),
            key: (i) => [...m.keys()][i] ?? null,
            get length() { return m.size; },
        };
    }

    function create(opts = {}) {
        const log = opts.log || (() => {});
        const tables = { buzzer: [], buzzer_tempo: [], buzzer_text: [] };
        let nextId = 1, antwort = { text: '', ms: 1200 };
        const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
        const empty = (status = 201) => new Response(null, { status });

        function insert(table, row) {
            const r = Object.assign({ id: nextId++, created_at: new Date().toISOString() }, row);
            tables[table].push(r);
            return r;
        }
        /* PostgREST's filters as the pages use them: eq, gt (numbers or ISO times) */
        function select(table, params) {
            let rows = tables[table].slice();
            params.forEach((v, k) => {
                const m = /^(eq|gt)\.(.*)$/.exec(v);
                if (!m || !(k in (rows[0] || { [k]: 1 }))) return;
                const want = decodeURIComponent(m[2]);
                rows = rows.filter((r) => {
                    const have = r[k];
                    if (m[1] === 'eq') return String(have) === want;
                    return typeof have === 'number' ? have > Number(want) : Date.parse(have) > Date.parse(want);
                });
            });
            return rows.sort((a, b) => a.id - b.id);
        }

        async function handle(url, init) {
            const u = new URL(url);
            const method = ((init && init.method) || 'GET').toUpperCase();
            let body = {};
            try { body = init && typeof init.body === 'string' ? JSON.parse(init.body) : {}; } catch (e) { /* no body */ }
            await new Promise((r) => setTimeout(r, 40));       // an answer is never synchronous on the real line either
            if (u.pathname === '/functions/v1/claude') {
                if (body.ping) return json({ ok: true });
                await new Promise((r) => setTimeout(r, antwort.ms));    // she thinks for a moment (the box's wave)
                log('Solita antwortet (Tour)');
                return json({ choices: [{ message: { role: 'assistant', content: antwort.text } }], model: 'tour', usage: {} });
            }
            if (u.pathname.startsWith('/functions/v1/')) return json({});
            const m = u.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
            if (!m || !tables[m[1]]) return method === 'GET' ? json([]) : empty(204);
            if (method === 'POST') {
                const r = insert(m[1], body);
                if (m[1] === 'buzzer') log('Buzzer: ' + (r.bezug ? 'verstanden (' + r.bezug + ')' : 'nicht verstanden') + ' · ' + r.code);
                return u.searchParams.has('select') ? json([{ id: r.id }], 201) : empty(201);
            }
            return json(select(m[1], u.searchParams));
        }

        return {
            /* the fetch a page inside the tour uses: Supabase goes here, everything else to its own network */
            fetchFor(w) {
                const real = w.fetch.bind(w);
                return function (input, init) {
                    const url = typeof input === 'string' ? input : (input && input.url) || String(input);
                    return url.startsWith(SUPA) ? handle(url, init) : real(input, init);
                };
            },
            storageFor() { return { local: memStorage(opts.seed), session: memStorage() }; },
            /* svpAuth.api(path) of the teacher's page, for the written feedback only the signed-in teacher may read */
            api(path) { return handle(SUPA + '/rest/v1/' + path, { method: 'GET' }); },
            /* the class off stage: a "nicht verstanden", and the "verstanden" that answers the newest open one - the
               question just asked, not one of an earlier task (Vorrechnen tour: 1 : 0 took the ones meant for 2^10) */
            press(code) { return insert('buzzer', { code: String(code) }).id; },
            understood(code) {
                const done = new Set(tables.buzzer.filter((r) => r.bezug).map((r) => r.bezug));
                const open = tables.buzzer.slice().reverse().find((r) => r.code === String(code) && !r.bezug && !done.has(r.id));
                return open ? insert('buzzer', { code: String(code), bezug: open.id }).id : null;
            },
            tempo(code, art) { return insert('buzzer_tempo', { code: String(code), art }).id; },
            text(code, text) { return insert('buzzer_text', { code: String(code), text: String(text) }).id; },
            /* what Solita answers to the next question in her box, and after how long */
            solita(text, ms = 1200) { antwort = { text: String(text), ms }; },
            get counts() { return Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])); },
        };
    }

    window.BuzzerDemoBackend = { create };
})();
