/* The quiz backend of Mission Control, pretended in the browser - for live tours ONLINE (docalvers.de), where
 * nobody may write into the real database (Doc, 19.09.2026: "bitte Mission! Gaaanz wichtig. Habe ich schon per
 * email verschickt"). The tour page creates one per run and sets window.__tourBackend; js/tour-hook.js, the first
 * script of svp/leistungstest.html and of the test pages, routes their Supabase fetches here.
 *
 * It answers what supabase/migrations/20260918_quiz_control.sql and 20260918_quiz_leaves.sql answer, from memory:
 *   rpc quiz_ping, quiz_leave, quiz_vote, quiz_control, quiz_result, quiz_abort, quiz_reset
 *   rest quiz_stats?quiz=eq.X, quiz_submissions?quiz=eq.X
 * Anything else aimed at Supabase (auth, other tables) gets an empty answer - it never leaves the browser.
 * The ages ("seen 12 s ago", "away since") use the browser clock where the real ones use the server's.
 */
(function () {
    'use strict';

    const SUPA = 'https://fyfhxzyymmurlaenmzse.supabase.co';

    function create(opts = {}) {
        const log = opts.log || (() => {});
        const subs = [], stats = {}, runs = {}, leaves = [];
        let nextId = 1;
        const now = () => Date.now();
        const key = (q, c) => q + '|' + c;
        const up = (c) => String(c || '').trim().toUpperCase();
        const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
        const empty = () => new Response(null, { status: 204 });
        const statsOf = (q) => Object.values(stats).filter((s) => s.quiz === q).sort((a, b) => a.q - b.q)
            .map((s) => ({ quiz: s.quiz, q: s.q, counts: s.counts.slice() }));
        const run = (q, c) => runs[key(q, c)] || (runs[key(q, c)] = { started_at: null, seen_at: null, answered: 0, total: 0, aborted_at: null });

        const rpc = {
            // pupil heartbeat: progress in, run state out
            quiz_ping(a) {
                const r = run(a.p_quiz, up(a.p_code));
                r.started_at = r.started_at || now();
                r.seen_at = now();
                r.answered = Math.max(0, Math.min(50, a.p_answered | 0));
                r.total = Math.max(0, Math.min(50, a.p_total | 0));
                return json(r.aborted_at ? 'aborted' : 'running');
            },
            // a leave opens one (never two at once), 'back' closes the open one
            quiz_leave(a) {
                const q = a.p_quiz, c = up(a.p_code);
                const open = leaves.filter((l) => l.quiz === q && l.code === c && l.back_at == null);
                if (a.p_kind === 'back') { if (open.length) open[open.length - 1].back_at = now(); }
                else if (!open.length) leaves.push({ quiz: q, code: c, left_at: now(), back_at: null });
                return empty();
            },
            // the submission (once per code) and the per-question counters; an aborted run cannot submit
            quiz_vote(a) {
                const q = a.p_quiz, c = up(a.p_code) || null;
                if (c && runs[key(q, c)] && runs[key(q, c)].aborted_at) return json({ message: 'aborted' }, 400);
                if (!(c && subs.some((s) => s.quiz === q && s.code === c))) {
                    subs.push({ id: nextId++, quiz: q, code: c, score: a.p_score, total: a.p_total, answers: (a.p_answers || []).slice() });
                    (a.p_answers || []).forEach((ans, i) => {
                        const s = stats[key(q, i)] || (stats[key(q, i)] = { quiz: q, q: i, counts: [0, 0, 0, 0, 0] });
                        s.counts[ans >= 0 && ans <= 3 ? ans : 4]++;
                    });
                }
                return json(statsOf(q));
            },
            // teacher view: one row per code that has anything to show
            quiz_control(a) {
                const q = a.p_quiz, out = [];
                [...new Set((a.p_codes || []).slice(0, 60))].forEach((c) => {
                    const r = runs[key(q, c)], ls = leaves.filter((l) => l.quiz === q && l.code === c);
                    const submitted = subs.some((s) => s.quiz === q && s.code === c);
                    if (!r && !ls.length && !submitted) return;
                    const seen = r && r.seen_at;
                    // an open leave counts up to the pupil's last heartbeat, as on the server
                    const away = ls.reduce((t, l) => t + ((l.back_at != null ? l.back_at : Math.max(l.left_at, seen || now())) - l.left_at), 0);
                    const open = ls.filter((l) => l.back_at == null).map((l) => l.left_at);
                    out.push({
                        code: c, started: !!(r && r.started_at), seen_secs: seen ? Math.round((now() - seen) / 1000) : null,
                        answered: r ? r.answered : 0, total: r ? r.total : 0, aborted: !!(r && r.aborted_at),
                        leaves: ls.length, away_secs: Math.round(away / 1000),
                        away_since: open.length ? new Date(Math.max(...open)).toISOString() : null, submitted,
                    });
                });
                return json(out);
            },
            quiz_result(a) {
                const s = subs.find((x) => x.quiz === a.p_quiz && x.code === up(a.p_code));
                return json(s ? [{ score: s.score, total: s.total, answers: s.answers.slice() }] : []);
            },
            quiz_abort(a) { abort(a.p_quiz, a.p_code, a.p_on); return empty(); },
            quiz_reset() { return json(0); },
        };

        function abort(quiz, code, on) {
            run(quiz, up(code)).aborted_at = on ? now() : null;
            log('Vorführ-Klasse: ' + up(code) + (on ? ' abgebrochen' : ' läuft wieder'));
        }

        function rest(table, params) {
            const q = (params.get('quiz') || '').replace(/^eq\./, '');
            if (table === 'quiz_stats') return json(statsOf(q));
            if (table === 'quiz_submissions') return json(subs.filter((s) => s.quiz === q).map((s) => ({ id: s.id, score: s.score, total: s.total })));
            return json([]);
        }

        async function handle(url, init) {
            const u = new URL(url);
            let body = {};
            try { body = init && typeof init.body === 'string' ? JSON.parse(init.body) : {}; } catch (e) { /* no body */ }
            await new Promise((r) => setTimeout(r, 30));       // an answer is never synchronous on the real line either
            const m = u.pathname.match(/^\/rest\/v1\/(rpc\/)?([a-z_]+)/);
            if (!m) return json([]);
            if (m[1]) return rpc[m[2]] ? rpc[m[2]](body) : json([]);
            return rest(m[2], u.searchParams);
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
            abort,
            get counts() { return { submissions: subs.length, runs: Object.keys(runs).length, leaves: leaves.length }; },
        };
    }

    window.QuizDemoBackend = { create };
})();
