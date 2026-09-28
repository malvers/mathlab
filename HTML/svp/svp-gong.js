// A gong at the start of a lesson (Doc, 28.09.2026: "in den Fahrplan zum Stundenanfang ein schönen Gong").
// Today's lessons come from WebUntis (svp_untis, all plans); a gong rings where a block starts - a lesson
// with no lesson of the same day ending right before it (45 minutes earlier), so a double lesson rings once.
// The sound is made here (Web Audio, a soft two-note bell), no file. Browsers only play after a first tap
// on the page, so any tap unlocks it. Try it: svpGong.test() in the console, or ?gong=test in the URL.
// Needs svp-auth.js (svpAuth.api).
(function (global) {
    'use strict';

    let ctx = null;
    function unlock() {
        if (!ctx) {
            const AC = global.AudioContext || global.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
        }
        if (ctx.state === 'suspended') ctx.resume().catch(function () {});
        return ctx;
    }
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (t) {
        global.addEventListener(t, unlock, { capture: true, passive: true });
    });

    /* one bell strike: a few inharmonic partials, each fading on its own (the high ones faster) */
    function glocke(c, out, f, t0, laut) {
        [[1, 1, 4.5], [2, 0.5, 3], [2.76, 0.35, 2], [5.4, 0.15, 1.2], [0.5, 0.3, 5]].forEach(function (p) {
            const o = c.createOscillator(), g = c.createGain();
            o.type = 'sine';
            o.frequency.value = f * p[0];
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.exponentialRampToValueAtTime(laut * p[1], t0 + 0.012);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + p[2]);
            o.connect(g).connect(out);
            o.start(t0);
            o.stop(t0 + p[2] + 0.05);
        });
    }
    function gong() {
        const c = unlock();
        if (!c) return;
        const out = c.createGain();
        out.gain.value = 0.35;
        out.connect(c.destination);
        const t0 = c.currentTime + 0.05;
        glocke(c, out, 659.25, t0, 1);          // E5
        glocke(c, out, 523.25, t0 + 0.9, 1);    // C5 - "ding dong"
    }

    /* today's block starts, "HH:MM" */
    let starts = [];
    const pad = function (n) { return String(n).padStart(2, '0'); };
    function heute() { const d = new Date(); return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); }
    function minuten(s) { const m = /^(\d{1,2}):(\d{2})/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; }
    async function lade() {
        if (!global.svpAuth || !svpAuth.api) return;
        try {
            const res = await svpAuth.api('svp_untis?select=data');
            if (!res.ok) return;
            geladen = true;
            const tag = heute(), alle = new Set();
            (await res.json()).forEach(function (row) {
                const w = (row.data && row.data.weeks) || {};
                Object.keys(w).forEach(function (kw) {
                    w[kw].forEach(function (e) {
                        if (e.date === tag && e.code !== 'cancelled' && minuten(e.start) != null) alle.add(minuten(e.start));
                    });
                });
            });
            starts = [...alle].filter(function (m) { return !alle.has(m - 45); }).sort(function (a, b) { return a - b; })
                .map(function (m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); });
        } catch (_) {}
    }

    const geklungen = new Set();
    function pruefe() {
        const d = new Date(), jetzt = pad(d.getHours()) + ':' + pad(d.getMinutes());
        if (starts.indexOf(jetzt) >= 0 && !geklungen.has(heute() + jetzt)) {
            geklungen.add(heute() + jetzt);
            gong();
        }
    }

    /* until the first answer (the login may come later) every 20 s, then every 15 min: a new day, a change in Untis */
    let geladen = false, seit = 0;
    lade();
    setInterval(function () { seit += 20; if (!geladen || seit >= 900) { seit = 0; lade(); } }, 20000);
    setInterval(pruefe, 5000);
    if (/[?&]gong=test/.test(location.search)) global.addEventListener('pointerdown', function () { gong(); }, { once: true });

    global.svpGong = { test: gong, starts: function () { return starts.slice(); }, lade: lade };
})(window);
