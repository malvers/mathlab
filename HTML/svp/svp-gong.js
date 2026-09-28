// A gong at the start of a lesson (Doc, 28.09.2026: "in den Fahrplan zum Stundenanfang ein schönen Gong").
// Today's lessons come from WebUntis (svp_untis, all plans); a gong rings where a block starts - a lesson
// with no lesson of the same day ending right before it (45 minutes earlier), so a double lesson rings once.
// The sound is made here (Web Audio, a long Asian gong - Doc: "asiatisch ... so ein langer Gong"), no file. Browsers only play after a first tap
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

    /* an Asian gong, about 18 s: sine partials [ratio, amp, attack s, decay end s] over a low fundamental -
       close pairs beat (the shimmer), the high ones bloom late; every pitch sinks 1 % in the first 3 s;
       a soft mallet thump (noise through a low pass). Heard first as a WAV on Doc's Mac (28.09.) */
    const F0 = 92.5;
    const TEILE = [
        [0.50, 0.30, 0.03, 16], [1.00, 1.00, 0.02, 18], [1.004, 0.55, 0.02, 15],
        [1.52, 0.45, 0.06, 12], [2.00, 0.30, 0.08, 10], [2.41, 0.40, 0.35, 11],
        [2.43, 0.25, 0.40, 9],  [2.97, 0.28, 0.55, 9],  [3.76, 0.22, 0.75, 8],
        [4.53, 0.16, 0.95, 7],  [5.90, 0.10, 1.20, 6],  [7.30, 0.06, 1.40, 5]];
    function gong() {
        const c = unlock();
        if (!c) return;
        const out = c.createGain();
        out.gain.value = 0.35;
        out.connect(c.destination);
        const t0 = c.currentTime + 0.05;
        TEILE.forEach(function (p) {
            const o = c.createOscillator(), g = c.createGain(), f = F0 * p[0];
            o.type = 'sine';
            o.frequency.setValueAtTime(f, t0);
            o.frequency.exponentialRampToValueAtTime(f * 0.99, t0 + 3);
            g.gain.setValueAtTime(0.0001, t0);
            g.gain.linearRampToValueAtTime(p[1], t0 + p[2]);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + p[3]);
            o.connect(g).connect(out);
            o.start(t0);
            o.stop(t0 + p[3] + 0.05);
        });
        const n = Math.floor(c.sampleRate * 0.08), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) { const x = 1 - i / n; d[i] = (Math.random() * 2 - 1) * x * x * 2; }
        const q = c.createBufferSource(), lp = c.createBiquadFilter();
        q.buffer = buf;
        lp.type = 'lowpass';
        lp.frequency.value = 300;
        q.connect(lp).connect(out);
        q.start(t0);
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
