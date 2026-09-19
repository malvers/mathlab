/* Live tour with review - a Drehbuch that plays INSIDE the real pages, and can be paused and commented
 * like a film in filmkritik.html.
 *
 * Doc, 19.09.2026: "eine (umfangreichere) Tour direkt im Lab, die ich genau wie im filmkritik anhalten und
 * kommentieren kann ... mach es bitte allgemein, sodass wir es immer wieder nutzen können".
 *
 * A tour page (HTML/tours/<id>.html, served by tools/tourkritik.py <id>) declares its panes - iframes with a
 * name - and loads this file, js/kritik-recorder.js and its Drehbuch, which calls
 *
 *   CyberTour.define({
 *     id: 'mission-control', card: { title, sub, img },
 *     async prepare(t) { ... },           // the stage, nothing on the server: already while the page loads
 *     async setup(t) { ... },             // server side, on SPACE (after prepare, also before every jump)
 *     async teardown(t) { ... },          // after the last scene
 *     scenes: [{ id: 's4', n: '04', title: 'Die Klasse legt los', async run(t) { ... } }, ...],
 *   });
 *
 * A scene may also carry
 *   air: ms             room after its voice (default AIR) - e.g. a pause for the class to think
 *   async enter(t)      it can build its own stage: a jump to it starts from prepare() + enter() instead of
 *                       replaying every scene before it (see JUMPING)
 *
 * The scene API is run2.mjs's, so a film's choreography moves over almost line by line:
 *   t.at(sec) t.rest() t.wait(ms) t.cue(i, fallback) t.cueEnd(i, fallback) t.until(fn, timeout)
 *   t.load(frame, url) t.eval(frame, fn, arg) t.$(frame, sel) t.scroll(frame, sel, block) t.show(frame, on)
 *   t.point(frame, sel) t.tap(frame, sel) t.pointAt(frame, x, y) t.tapAt(frame, x, y) (a place on a canvas)
 *   t.line(k, fallback) (second where Solita's k-th subtitle line starts) t.dur t.hold(text) (the tour pauses itself)
 *   t.callout(text, xy) t.hideCursor() t.caption(n, title)
 *   t.card(on) t.cardImage(on, animate) t.sound(url, vol) t.hook(name, args) t.every(ms, fn) t.later(ms, fn)
 *   t.addFrame(name, url, opts) t.leave(frame, on) t.offline(frame) t.data (shared by all scenes of one run)
 *
 * HOW IT KEEPS TIME: one pausable clock. Every wait of a scene is a point on that clock, so SPACE freezes the
 * choreography, Solita's voice and every background task at once; nothing the tour does runs on the wall
 * clock. Solita's pauses of 1 s or more are the stage directions (as in the films' silencedetect): they are
 * found in the decoded MP3 here in the browser, t.cue(0) is the first one.
 *
 * JUMPING: the pages' state is the sum of everything before (answers, server rows), so a scene cannot be
 * entered in the middle. A jump runs setup() and replays the scenes before it at FAST speed, silent, behind
 * a veil, then plays the scene. Where a page's state is cheap to set (a lab: station, view, dice), a scene's
 * enter() builds it directly - the replay then starts at the nearest such scene, not at the first. A reload
 * (live reload after a fix) starts over from the beginning, SPACE plays, as in filmkritik.html (Doc, 19.09.2026: "nach reload ganz vom Anfang" - first it spooled back by itself, which
 * every edit of mine set off again, then it offered the old scene, which left a half-filled bar behind).
 *
 * ONLINE (docalvers.de, Doc 19.09.2026: "ja, das zuerst ... R2"): without tools/tourkritik.py behind the page (no
 * /__tour/info) Solita's voice and the subtitles come from the R2 bucket "tours" (MEDIA_BASE + <id>/tour.json and
 * <id>/sN.mp3, put there by tools/tour_publish.mjs), there is no pulse and no review - remarks are stored by the tour
 * server only. A tour whose Drehbuch needs server hooks says `local: true` and only explains itself online.
 *
 * REVIEW ONLY WITH ?critics (Doc, 19.09.2026: "andere sollen ja nicht bedienen können, wenn ich das rausgebe"):
 * microphone, remarks list and ABSCHICKEN exist only when the address carries ?critics - without it the page
 * is a plain player (space, scenes, full screen), Enter records nothing.
 *
 * SIMULATED DEVICES (data-device on an iframe, or t.addFrame): visibility, focus and full screen of that
 * page belong to the tour - the viewer switching windows must not count as a pupil leaving; t.leave() is the
 * pupil doing it, through the page's real code path.
 */
(function () {
    'use strict';

    const FAST = 8;              // speed of the replay before a jump
    const LEAD = 500;            // the voice starts this long after the scene mark (as buildScenes' adelay)
    const AIR = 1500;            // room after every scene's voice
    const PULSE = 5000;          // the page's pulse to the server (it tears an armed tour down without one)
    const SUBMIT_GUARD_MS = 3000;
    let CRITICS = new URLSearchParams(location.search).has('critics');     // and only with the tour server (define)
    // the R2 bucket "tours", public: Solita's voice and texts per tour for the pages online (tools/tour_publish.mjs)
    const MEDIA_BASE = 'https://pub-025e3faab48145a9ac22aaabe307d722.r2.dev/';

    const CANCEL = new Error('tour-cancel');
    CANCEL.tourCancel = true;
    const isCancel = (e) => !!(e && e.tourCancel);
    const mmss = (s) => Math.floor(Math.max(0, s) / 60) + ':' + String(Math.floor(Math.max(0, s) % 60)).padStart(2, '0');

    const LOG = [];
    function dbg(m) {
        LOG.push(new Date().toISOString().slice(11, 19) + ' ' + m);
        if (LOG.length > 400) LOG.shift();
        try { if (window.DebugWindow) window.DebugWindow.log('🎬 ' + m); } catch (e) { /* no debug window */ }
    }

    /* ================================================================ clock */
    const clock = {
        base: 0, since: 0, paused: true,
        now() { return this.paused ? this.base : this.base + performance.now() - this.since; },
        pause() { if (!this.paused) { this.base = this.now(); this.paused = true; } },
        resume() { if (this.paused) { this.since = performance.now(); this.paused = false; } },
    };
    let waiters = [];
    let lastPump = performance.now();
    (function pump() {
        // a gap of seconds between two ticks while visible = the Mac slept (or hung): the clock goes back to the
        // last tick and stands - otherwise every wait that fell due in the meantime would fire at once on waking,
        // e.g. pupils submitting into data the server has put back in the meantime (19.09.2026)
        const wall = performance.now();
        if (!clock.paused && wall - lastPump > 3000 && E.state === 'running') {
            clock.base += lastPump - clock.since;
            clock.paused = true;
            onGap(Math.round((wall - lastPump) / 1000));
        }
        lastPump = wall;
        if (!clock.paused && waiters.length) {
            const now = clock.now();
            const due = waiters.filter((w) => w.at <= now);
            if (due.length) {
                waiters = waiters.filter((w) => w.at > now);
                due.forEach((w) => w.resolve());
            }
        }
        setTimeout(pump, 16);
    })();

    function waitUntil(run, at) {
        if (run.cancelled) return Promise.reject(CANCEL);
        return new Promise((resolve, reject) => waiters.push({ at, resolve, reject, run }));
    }
    function check(run) { if (run.cancelled) throw CANCEL; }

    /* ================================================================ state */
    const E = {
        def: null,
        scenes: [],
        voices: {},              // scene id -> { url, audio, dur, cues, lines }
        texts: Promise.resolve({}),   // scene id -> the SSML Solita spoke (for the subtitles)
        local: false,            // tools/tourkritik.py serves this page (voice, hooks, review); otherwise online mode
        manifest: null,          // online: promise of <id>/tour.json { version, texts }
        ready: null,             // promise: all voices decoded
        cur: -1,                 // scene on stage
        scene: null,             // { i, t0, voiceAt, deadline }
        run: null,
        state: 'idle',           // idle | forward | running | paused | ended
        voice: null,             // { audio, at } of the running scene
        rec: null,
        items: [],
        submitted: false,
        armed: false,            // the server's hooks are set up (from the last hook answer)
        stale: false,            // the server tore the tour down behind our back (no pulse for minutes)
        error: '',
    };

    const $id = (id) => document.getElementById(id);
    function frameEl(name) {
        const f = document.querySelector('iframe[name="' + name + '"]');
        if (!f) throw new Error('kein Rahmen: ' + name);
        return f;
    }

    /* ============================================================== voices */
    /* ffmpeg silencedetect noise=-40dB d=1.0, per sample - what run2.mjs used for its cues */
    function silences(buf, minLen = 1.0, noise = 0.01) {
        const n = buf.length, sr = buf.sampleRate, ch = [];
        for (let c = 0; c < buf.numberOfChannels; c++) ch.push(buf.getChannelData(c));
        const out = [];
        let start = -1;
        for (let i = 0; i < n; i++) {
            let a = 0;
            for (let c = 0; c < ch.length; c++) a = Math.max(a, Math.abs(ch[c][i]));
            if (a < noise) { if (start < 0) start = i; continue; }
            if (start >= 0 && (i - start) / sr >= minLen) out.push({ start: start / sr, end: i / sr });
            start = -1;
        }
        if (start >= 0 && (n - start) / sr >= minLen) out.push({ start: start / sr, end: n / sr });
        return out;
    }

    /* SUBTITLES (Doc, 19.09.2026: "die Untertitel mit einblenden ... so dass möglichst nichts überdeckt"): what Solita
       says, from the text that was really synthesised (tourkritik.py /__tour/text = texts.json of the tour's folder),
       one line per <break>. Where a line starts is found in her own MP3: the pauses of 0.3 s or more, each break
       matched to the pause nearest to where the text says it should be. def.spelled turns what is spelled for her
       voice back into writing ({ 'Läbb': 'Lab' }). */
    function ssmlLines(ssml) {
        if (!ssml) return [];
        const spelled = E.def.spelled || {};
        return String(ssml).replace(/<\/?speak>/g, '').split(/<break\b[^>]*>/)
            .map((s) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
                .replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim())
            .map((s) => Object.keys(spelled).reduce((a, k) => a.split(k).join(spelled[k]), s))
            .filter(Boolean);
    }

    function timeLines(texts, buf) {
        if (!texts.length) return [];
        const gaps = silences(buf, 0.3), dur = buf.duration;
        let s0 = 0, s1 = dur;
        if (gaps.length && gaps[0].start < 0.05) s0 = gaps.shift().end;
        if (gaps.length && gaps[gaps.length - 1].end > dur - 0.05) s1 = gaps.pop().start;
        const cuts = [];
        let cur = s0, from = 0, rest = texts.reduce((a, x) => a + x.length, 0);
        for (let k = 0; k < texts.length - 1; k++) {
            // where the break should be: this line's share of the words still to come
            const want = cur + (s1 - cur) * texts[k].length / Math.max(1, rest);
            rest -= texts[k].length;
            const left = texts.length - 2 - k;             // breaks still to place after this one
            let best = -1, bd = Infinity;
            for (let j = from; j < gaps.length - left; j++) {
                const d = Math.abs((gaps[j].start + gaps[j].end) / 2 - want);
                if (d < bd) { bd = d; best = j; }
            }
            const g = best >= 0 ? gaps[best] : { start: want, end: want };
            if (best >= 0) from = best + 1;
            cuts.push(g);
            cur = g.end;
        }
        return texts.map((text, k) => ({ text, start: k ? cuts[k - 1].end : s0, end: k < cuts.length ? cuts[k].start : s1 }));
    }

    /* the line on screen at `pos` seconds into the voice: from its start until the next one, gone 1.5 s after it ends */
    function lineAt(v, pos) {
        const L = (v && v.lines) || [];
        let x = null;
        for (const l of L) if (l.start - 0.1 <= pos) x = l;
        return x && pos <= x.end + 1.5 ? x : null;
    }

    async function voiceUrl(sc) {
        if (E.def.audio) return E.def.audio(sc);
        if (E.local) return '/__tour/audio/' + sc.id + '.mp3';
        const m = await E.manifest;
        return MEDIA_BASE + E.def.id + '/' + sc.id + '.mp3?v=' + encodeURIComponent(m.version || '');
    }

    async function loadVoice(sc) {
        // registered at once: the progress bar reads every scene's length while the voices still load
        const v = { url: '', audio: null, dur: sc.dur || 8, cues: [], lines: [] };
        E.voices[sc.id] = v;
        const url = v.url = await voiceUrl(sc).catch(() => '');
        if (sc.voice === false || !url) return v;          // online without a published voice: the scene runs silent
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(res.status);
            const bytes = await res.arrayBuffer();
            const ctx = new OfflineAudioContext(1, 44100, 44100);
            const buf = await ctx.decodeAudioData(bytes.slice(0));
            v.dur = buf.duration;
            v.cues = silences(buf);
            v.lines = timeLines(ssmlLines((await E.texts)[sc.id]), buf);
            v.audio = new Audio(URL.createObjectURL(new Blob([bytes], { type: res.headers.get('Content-Type') || 'audio/mpeg' })));
            v.audio.preload = 'auto';
            dbg(sc.id + ': ' + v.dur.toFixed(1) + ' s, Regiepausen ' + v.cues.map((c) => c.start.toFixed(1)).join('/'));
        } catch (err) {
            dbg(sc.id + ': keine Stimme (' + err.message + ') — ' + v.dur + ' s ohne Ton');
        }
        return v;
    }

    const sceneLen = (sc) => LEAD + E.voices[sc.id].dur * 1000 + (sc.air ?? AIR);    // ms at speed 1

    function voiceStart(run, v, at) {
        if (!v.audio || run.fast) return;
        waitUntil(run, at).then(() => {
            if (run.cancelled) return;
            E.voice = { audio: v.audio, at };
            v.audio.currentTime = 0;
            v.audio.play().catch((e) => dbg('Stimme: ' + e.message));
        }).catch(() => { /* cancelled */ });
    }
    function voicePause() { if (E.voice) E.voice.audio.pause(); }
    function voiceResume() {
        if (!E.voice) return;
        const a = E.voice.audio, pos = (clock.now() - E.voice.at) / 1000;
        if (pos < 0 || pos >= a.duration) return;
        a.currentTime = pos;
        a.play().catch((e) => dbg('Stimme: ' + e.message));
    }
    function voiceStop() {
        if (!E.voice) return;
        E.voice.audio.pause();
        E.voice = null;
    }

    /* ============================================================== frames */
    function applyZoom(f) {
        const w = +f.dataset.width;
        if (!w) return;
        try { f.contentDocument.documentElement.style.zoom = String(f.clientWidth / w); } catch (e) { /* not loaded */ }
    }
    window.addEventListener('resize', () => document.querySelectorAll('iframe[data-width]').forEach(applyZoom));

    /* rects inside a zoomed page: are they already in the frame's pixels, or in the page's own? Measured, not
       assumed - Chrome changed this with the standardised CSS zoom */
    function coordScale(f) {
        const d = f.contentDocument, z = parseFloat(d.documentElement.style.zoom) || 1;
        if (z === 1) return 1;
        const p = d.createElement('div');
        p.style.cssText = 'position:absolute;left:0;top:0;width:100px;height:1px;visibility:hidden';
        d.body.appendChild(p);
        const w = p.getBoundingClientRect().width;
        p.remove();
        return Math.abs(w - 100 * z) < Math.abs(w - 100) ? 1 : z;
    }

    /* a device of its own keeps its own storage: all frames of the tour share one origin, and a page that
       remembers "submitted" (quiz-engine's DONE_KEY) would otherwise refuse the next pupil's submission */
    function memStorage() {
        const m = new Map();
        return {
            getItem: (k) => (m.has(String(k)) ? m.get(String(k)) : null),
            setItem: (k, v) => { m.set(String(k), String(v)); },
            removeItem: (k) => { m.delete(String(k)); },
            clear: () => m.clear(),
            key: (i) => [...m.keys()][i] ?? null,
            get length() { return m.size; },
        };
    }

    function shield(w) {
        if (w.__tourShield) return;
        w.__tourShield = true;
        const d = w.document;
        Object.defineProperty(d, 'hidden', { configurable: true, get: () => !!w.__tourAway });
        Object.defineProperty(d, 'visibilityState', { configurable: true, get: () => (w.__tourAway ? 'hidden' : 'visible') });
        d.hasFocus = () => !w.__tourAway;
        const block = (e) => { if (!w.__tourPass) e.stopImmediatePropagation(); };
        ['visibilitychange', 'blur', 'fullscreenchange', 'webkitfullscreenchange'].forEach((ev) => w.addEventListener(ev, block, true));
        ['localStorage', 'sessionStorage'].forEach((k) => {
            try { Object.defineProperty(w, k, { configurable: true, value: memStorage() }); } catch (e) { dbg('eigener Speicher: ' + e.message); }
        });
        // the viewer's key press activates every same-origin frame (user activation v2): a device's "Test starten"
        // then REALLY went full screen and one hidden pupil covered the whole monitor (headless run, 19.09.2026)
        const noFs = function () { return Promise.resolve(); };
        w.Element.prototype.requestFullscreen = noFs;
        w.Element.prototype.webkitRequestFullscreen = noFs;
    }

    function patchTimers(w, spec) {
        const map = {};
        spec.split(',').forEach((p) => { const [a, b] = p.split(':').map(Number); if (a && b) map[a] = b; });
        const si = w.setInterval;
        w.setInterval = function (fn, ms, ...rest) { return si.call(w, fn, map[ms] || ms, ...rest); };
    }

    function prepare(f) {
        const w = f.contentWindow, d = f.contentDocument;
        if (!w || !d || w.location.href === 'about:blank') return;
        w.__liveReloadBusy = () => true;          // the tour page decides when anything reloads
        const badge = d.getElementById('local-badge');
        if (badge) badge.remove();
        applyZoom(f);
        if (f.dataset.device !== undefined) shield(w);
        if (f.dataset.timers) patchTimers(w, f.dataset.timers);
        w.addEventListener('keydown', onKey, true); // a click into a paused page must not take the keys away
    }

    function resetFrames() {
        document.querySelectorAll('.tour-stage iframe[name]').forEach((f) => {
            f.classList.remove('on');
            if (f.getAttribute('src') !== 'about:blank') f.src = 'about:blank';
        });
        const off = $id('tour-offstage');
        if (off) off.innerHTML = '';
    }

    /* ============================================================ overlay */
    function cursorTo(x, y) {
        const c = $id('tour-cursor');
        c.classList.add('on');
        c.style.left = x + 'px';
        c.style.top = y + 'px';
    }
    function ripple(x, y) {
        const r = document.createElement('div');
        r.className = 'tour-rip';
        r.style.left = x + 'px';
        r.style.top = y + 'px';
        document.body.appendChild(r);
        setTimeout(() => r.remove(), 700);
    }
    function callout(text, xy) {
        const c = $id('tour-callout');
        if (!text) { c.classList.remove('on'); return; }
        c.textContent = text;
        const w = c.offsetWidth || 260, x = xy ? xy[0] : innerWidth / 2, y = xy ? xy[1] : innerHeight / 2;
        c.style.left = Math.max(8, Math.min(innerWidth - w - 8, x + 26)) + 'px';
        c.style.top = Math.max(8, y - 62) + 'px';
        c.classList.add('on');
    }
    /* "Kapitel 04 · Die Klasse legt los" - the word before the number (Doc, 19.09.2026: "jetzt verstehe ich, was das
       bedeutet ... schreib bitte davor Kapitel"); a scene without a number shows only its title */
    function caption(n, t) {
        const cap = $id('tour-cap');
        cap.classList.add('swap');
        setTimeout(() => {
            cap.querySelector('.k').textContent = n ? (E.def.chapter || 'Kapitel') : '';
            cap.querySelector('.n').textContent = n || '';
            cap.querySelector('.t').textContent = t || '';
            cap.classList.remove('swap');
        }, 350);
    }

    /* Scrolling at a reading pace: Chrome's "smooth" is fixed and too fast to keep the context (Doc, 19.09.2026: "der
       Scroll ... ein Tick zu schnell, so dass man den Kontext verliert"). The target comes from the page's own
       scrollIntoView (jumped there and back in one task, nothing is painted in between), the way there is eased here.
       Returns the milliseconds it takes; point() waits for a glide still under way before it measures. */
    function glide(el, block, fast) {
        const d = el.ownerDocument, w = d.defaultView, se = d.scrollingElement;
        const y0 = se.scrollTop;
        el.scrollIntoView({ block, behavior: 'instant' });
        const y1 = se.scrollTop;
        if (fast || Math.abs(y1 - y0) < 2) return 0;
        se.scrollTop = y0;
        const ms = Math.min(2000, Math.max(900, 700 + Math.abs(y1 - y0) * 0.6));
        // the steps get the FRAME's rAF time, so the start is taken on the frame's clock too: the tour page's clock
        // runs ahead by the time between the two page loads (seconds online while the voice loads from R2, minutes
        // after a jump), and the glide held the page at its start until that was made up (Doc, 19.09.2026: "dass das
        // Zoomen auf eine Karte nicht richtig ist" - the card grew over the page's head, not over the slips)
        const token = (w.__tourGlide || 0) + 1, t0 = w.performance.now(), sb = se.style.scrollBehavior;
        w.__tourGlide = token;
        w.__tourGlideEnd = performance.now() + ms;          // read by point() on the tour's clock
        se.style.scrollBehavior = 'auto';                // a page's own scroll-behavior would fight every step
        const step = (now) => {
            if (w.__tourGlide !== token) return;         // a newer glide took over
            const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
            se.scrollTop = y0 + (y1 - y0) * e;
            if (k < 1) w.requestAnimationFrame(step); else se.style.scrollBehavior = sb;
        };
        w.requestAnimationFrame(step);
        return ms;
    }
    function card(on) { $id('tour-card').classList.toggle('hide', !on); }
    function cardImage(on, animate) {
        const c = $id('tour-card');
        if (!animate) c.classList.add('still');
        c.classList.toggle('img', on);
        if (!animate) { void c.offsetWidth; c.classList.remove('still'); }
    }

    /* ========================================================= scene context */
    function ctx(run, sc, i) {
        const t = {
            run, scene: sc, index: i, data: run.data,
            get fast() { return run.fast; },
            get speed() { return run.fast ? FAST : 1; },
            voiceAt: 0, deadline: 0,
            log: dbg,

            wait(ms) { return waitUntil(run, clock.now() + ms / t.speed); },
            at(sec) { return waitUntil(run, t.voiceAt + (sec * 1000) / t.speed); },
            rest() { return waitUntil(run, t.deadline); },
            cue(n, fb) { const c = sc && E.voices[sc.id].cues[n]; return c ? c.start : fb; },
            cueEnd(n, fb) { const c = sc && E.voices[sc.id].cues[n]; return c ? c.end : fb; },
            /* where Solita starts her k-th line (as in the subtitles; negative counts from the end), and her length */
            line(k, fb) { const L = (sc && E.voices[sc.id].lines) || []; const x = L[k < 0 ? L.length + k : k]; return x ? x.start : fb; },
            get dur() { return sc ? E.voices[sc.id].dur : 0; },
            /* with tools/tourkritik.py behind the page (hooks, review) - or online */
            get local() { return E.local; },
            /* the tour stops by itself - a pause to think, as if SPACE was pressed; SPACE plays on */
            hold(text) {
                if (run.fast) return;
                pause();
                if (text) live(text, true);
            },
            async until(fn, timeout = 20000, every = 200) {
                const end = clock.now() + timeout;
                for (;;) {
                    check(run);
                    let v = null;
                    try { v = await fn(); } catch (e) { v = null; }
                    if (v) return v;
                    if (clock.now() > end) throw new Error('Zeitüberschreitung nach ' + timeout / 1000 + ' s');
                    await waitUntil(run, clock.now() + every);
                }
            },
            /* repeating / one-off work in the background, on the tour's clock - frozen with it, gone with the run */
            every(ms, fn) {
                let on = true;
                (async () => {
                    while (on && !run.cancelled && !run.stopped) {
                        await waitUntil(run, clock.now() + (typeof ms === 'function' ? ms() : ms) / t.speed);
                        if (on && !run.stopped) await fn();
                    }
                })().catch((e) => { if (!isCancel(e)) dbg('Hintergrund: ' + e.message); });
                return () => { on = false; };
            },
            later(ms, fn) {
                waitUntil(run, clock.now() + ms / t.speed).then(() => { if (!run.cancelled && !run.stopped) return fn(); })
                    .catch((e) => { if (!isCancel(e)) dbg('Später: ' + e.message); });
            },

            /* ---- pages */
            win(name) { return frameEl(name).contentWindow; },
            $(name, sel) { return frameEl(name).contentDocument.querySelector(sel); },
            /* like Playwright's frame.evaluate: fn runs in the page's own realm, without the tour's closures */
            eval(name, fn, arg) {
                check(run);
                const w = frameEl(name).contentWindow;
                return w.Function('__a', 'return (' + fn.toString() + ')(__a)')(arg);
            },
            async load(name, url) {
                check(run);
                const f = frameEl(name);
                f.style.visibility = 'hidden';          // no unzoomed flash before prepare()
                await new Promise((resolve, reject) => {
                    const done = () => { f.removeEventListener('load', done); clearTimeout(to); resolve(); };
                    const to = setTimeout(() => { f.removeEventListener('load', done); reject(new Error('lädt nicht: ' + url)); }, 30000);
                    f.addEventListener('load', done);
                    f.src = url;
                });
                check(run);
                prepare(f);
                f.style.visibility = '';
                if (f.closest('.tour-screen')) f.classList.add('on');
                return f.contentWindow;
            },
            async addFrame(name, url, opts = {}) {
                const f = document.createElement('iframe');
                f.name = name;
                f.title = opts.title || name;
                if (opts.device !== false) f.dataset.device = '';
                if (opts.timers) f.dataset.timers = opts.timers;
                $id('tour-offstage').appendChild(f);
                await t.load(name, url);
                return f.contentWindow;
            },
            show(name, on) { frameEl(name).classList.toggle('on', on); },
            scroll(name, sel, block = 'start') {
                check(run);
                const el = t.$(name, sel);
                return el ? glide(el, block, run.fast) : 0;
            },
            async point(name, sel) {
                check(run);
                const f = frameEl(name);
                const el = typeof sel === 'string' ? f.contentDocument.querySelector(sel) : sel;
                if (!el) throw new Error('kein Ziel: ' + name + ' ' + sel);
                const w = f.contentWindow, left = (w.__tourGlideEnd || 0) - performance.now();
                if (left > 0) await waitUntil(run, clock.now() + left + 50);     // a scroll is still under way
                let k = coordScale(f), b = el.getBoundingClientRect();
                if (!(b.top * k >= 0 && b.bottom * k <= f.clientHeight)) {
                    const ms = glide(el, 'center', run.fast);
                    await waitUntil(run, clock.now() + (run.fast ? 30 : ms + 50));
                    k = coordScale(f);
                    b = el.getBoundingClientRect();
                }
                const R = f.getBoundingClientRect(), s = f.offsetWidth ? R.width / f.offsetWidth : 1;
                const x = R.left + (b.left + b.width / 2) * k * s, y = R.top + (b.top + b.height / 2) * k * s;
                cursorTo(x, y);
                await t.wait(620);
                return [x, y];
            },
            async tap(name, sel) {
                const [x, y] = await t.point(name, sel);
                check(run);
                ripple(x, y);
                const el = typeof sel === 'string' ? t.$(name, sel) : sel;
                if (el) el.click();
                await t.wait(250);
                return [x, y];
            },
            /* a place instead of an element - a face of a net, an arrow drawn on a canvas. x, y are the page's own
               client coordinates (what its getBoundingClientRect gives and its pointer events carry) */
            async pointAt(name, x, y) {
                check(run);
                const f = frameEl(name), k = coordScale(f);
                const R = f.getBoundingClientRect(), s = f.offsetWidth ? R.width / f.offsetWidth : 1;
                const X = R.left + x * k * s, Y = R.top + y * k * s;
                cursorTo(X, Y);
                await t.wait(620);
                return [X, Y];
            },
            /* ... and a tap there: the pointer and mouse events a real finger sends, to whatever lies on top */
            async tapAt(name, x, y) {
                const xy = await t.pointAt(name, x, y);
                check(run);
                ripple(xy[0], xy[1]);
                const w = t.win(name), el = w.document.elementFromPoint(x, y) || w.document.body;
                const o = { bubbles: true, cancelable: true, composed: true, view: w, clientX: x, clientY: y,
                    button: 0, buttons: 1, pointerId: 1, pointerType: 'mouse', isPrimary: true };
                el.dispatchEvent(new w.PointerEvent('pointerdown', o));
                el.dispatchEvent(new w.MouseEvent('mousedown', o));
                el.dispatchEvent(new w.PointerEvent('pointerup', { ...o, buttons: 0 }));
                el.dispatchEvent(new w.MouseEvent('mouseup', { ...o, buttons: 0 }));
                el.dispatchEvent(new w.MouseEvent('click', { ...o, buttons: 0 }));
                await t.wait(250);
                return xy;
            },
            /* a simulated device looks away (another window) and back - the page's own visibility path */
            leave(name, on) {
                check(run);
                const w = t.win(name);
                w.__tourAway = !!on;
                w.__tourPass = true;
                try { w.document.dispatchEvent(new w.Event('visibilitychange')); } finally { w.__tourPass = false; }
            },
            /* the WLAN goes: the page stays, its requests fail (heartbeats stop) */
            offline(name) { const w = t.win(name); w.fetch = () => Promise.reject(new w.TypeError('offline (Tour)')); },

            /* ---- stage */
            callout(text, xy) { check(run); callout(text, xy); },
            hideCursor() { $id('tour-cursor').classList.remove('on'); },
            caption(n, title) { check(run); caption(n, title); },
            card(on) { card(on); },
            cardImage(on, animate) { cardImage(on, animate); },
            sound(url, vol = 1) {
                if (run.fast) return null;
                const a = new Audio(url);
                a.volume = vol;
                run.sounds.push(a);
                a.play().catch((e) => dbg('Ton: ' + e.message));
                return a;
            },

            /* ---- server (tools/tourkritik.py -> videopipeline/<id>/tour_hooks.py) */
            async hook(name, args) {
                check(run);
                const res = await fetch('/__tour/hook/' + name, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Tour': '1' }, body: JSON.stringify(args || {}),
                });
                const j = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error('Hook ' + name + ': ' + (j.error || res.status));
                E.armed = !!j.armed;
                dbg('Hook ' + name + ' → ' + JSON.stringify(j.out));
                return j.out;
            },
        };
        return t;
    }

    /* ================================================================= runs */
    function cancelRun(run) {
        if (!run || run.cancelled) return;
        run.cancelled = true;
        waiters.filter((w) => w.run === run).forEach((w) => w.reject(CANCEL));
        waiters = waiters.filter((w) => w.run !== run);
        voiceStop();
        run.sounds.forEach((a) => a.pause());
    }

    async function runScene(i, run) {
        const sc = E.scenes[i];
        const t = ctx(run, sc, i);
        const t0 = clock.now();
        t.voiceAt = t0 + LEAD / t.speed;
        t.deadline = t0 + sceneLen(sc) / t.speed;
        E.cur = i;
        E.scene = { i, t0, voiceAt: t.voiceAt, deadline: t.deadline };
        if (!run.fast) {
            dbg('Szene ' + (sc.n || sc.id) + ' · ' + (sc.title || ''));
        }
        voiceStart(run, E.voices[sc.id], t.voiceAt);
        ui();
        await sc.run(t);
        await t.rest();
    }

    /* from: the scene to play - everything before it is replayed fast */
    async function play(from = 0) {
        if (!E.local && E.def.local) { live(LOCAL_ONLY, true); return; }
        // the stage built while the page loaded (prepareStage) is taken over when the tour starts at the beginning
        const prep = E.prep;
        E.prep = null;
        const reuse = !!(prep && from === 0 && !prep.run.cancelled);
        if (prep && !reuse) cancelRun(prep.run);
        cancelRun(E.run);
        const run = reuse ? prep.run : { cancelled: false, fast: false, data: {}, sounds: [] };
        run.fast = from > 0;
        E.run = run;
        E.error = '';
        E.stale = false;
        setState(from > 0 ? 'forward' : 'running');
        live('', true);
        clock.resume();
        try {
            await E.ready;
            check(run);
            let staged = false;
            if (reuse) {
                live('Einen Moment — die Bühne wird noch aufgebaut …', true);
                staged = await prep.ready;
                live('', true);
                check(run);
            }
            if (!staged) resetFrames();
            $id('tour-cursor').classList.remove('on');
            callout(null);
            document.body.classList.toggle('fast', run.fast);
            // the nearest scene at or before the target that builds its own stage: the replay starts there
            let first = 0;
            for (let j = from; j > 0; j--) if (typeof E.scenes[j].enter === 'function') { first = j; break; }
            veil(from > 0 ? from : -1, 0, first === from);
            const t = ctx(run, null, -1);
            if (!staged && E.def.prepare) await E.def.prepare(t);
            if (E.def.setup) await E.def.setup(t);
            if (first > 0) await E.scenes[first].enter(ctx(run, E.scenes[first], first));
            for (let i = first; i < from; i++) {
                veil(from, (i - first) / (from - first));
                await runScene(i, run);
            }
            run.fast = false;
            document.body.classList.remove('fast');
            veil(-1);
            if (E.state === 'forward') setState('running');
            for (let i = from; i < E.scenes.length; i++) {
                await runScene(i, run);
            }
            voiceStop();
            E.scene = null;
            // the stage stays as it is, but nothing works on in the background: the devices off stage go (their
            // heartbeats would write into data the teardown just put back), every/later stop
            run.stopped = true;
            $id('tour-offstage').innerHTML = '';
            setState('ended');
            live(CRITICS ? 'Tour zu Ende · ' + E.items.length + ' Kommentare. Enter nimmt noch einen auf, ABSCHICKEN schickt alles an die Sitzung.'
                         : 'Tour zu Ende. Home spielt sie noch einmal, ◀ ▶ wählen eine Szene.', true);
            if (E.def.teardown) await E.def.teardown(ctx(run, null, -1));
        } catch (err) {
            if (isCancel(err)) return;
            E.error = err.message;
            dbg('FEHLER: ' + err.stack);
            veil(-1);
            document.body.classList.remove('fast');
            run.fast = false;
            clock.pause();
            voicePause();
            setState('paused');
            live('Die Tour hängt in Szene ' + label(E.cur) + ': ' + err.message + (CRITICS ? ' — Kommentar mit Enter, ◀ spielt die Szene neu.' : ' — ◀ spielt die Szene neu.'), true);
        }
    }

    /* Space should start the tour at once (Doc, 19.09.2026: "beim 1. space dauert es 'ne Weile"): whatever the stage
       needs and does not touch the server - pages, codes, the class off stage - is built while the page loads, behind
       the title card. play(0) takes it over; a jump builds anew (it needs a fresh stage anyway). */
    function prepareStage() {
        if (!E.def.prepare) return;
        const run = { cancelled: false, fast: false, data: {}, sounds: [] };
        const t = ctx(run, null, -1);
        clock.resume();                             // prepare's waits run on the clock; idle, nothing else does
        const prep = { run, ready: null };
        prep.ready = (async () => {
            const t0 = performance.now();
            resetFrames();
            await E.def.prepare(t);
            dbg('Bühne vorbereitet in ' + Math.round(performance.now() - t0) + ' ms');
            return true;
        })().catch((e) => { if (!isCancel(e)) dbg('Vorbereiten: ' + e.message); return false; });
        E.prep = prep;
    }

    function label(i) {
        const sc = E.scenes[i];
        return sc ? (sc.n || String(i + 1).padStart(2, '0')) + (sc.title ? ' · ' + sc.title : '') : '';
    }

    function onGap(sec) {
        dbg('Uhr stand ' + sec + ' s still (Ruhezustand?) — angehalten');
        pause();
        live('Angehalten: ' + sec + ' s lang lief die Seite nicht (Ruhezustand?). Leertaste spielt weiter.', true);
    }

    function pause() {
        if (E.state !== 'running') return;
        clock.pause();
        voicePause();
        if (E.run) E.run.sounds.forEach((a) => a.pause());
        setState('paused');
        live(CRITICS ? 'Angehalten. Enter nimmt einen Kommentar auf — Leertaste spielt weiter.' : 'Angehalten — Leertaste spielt weiter.', true);
    }

    function resume() {
        if (E.state === 'idle' || E.state === 'ended') return;
        if (E.state !== 'paused') return;
        reopen();
        if (E.stale || E.error) { goto(E.cur); return; }
        clock.resume();
        voiceResume();
        if (E.run) E.run.sounds.forEach((a) => { if (!a.ended && a.currentTime > 0) a.play().catch(() => {}); });
        setState('running');
        live('', true);
    }

    function goto(i) {
        if (!E.scenes.length) return;
        i = Math.max(0, Math.min(E.scenes.length - 1, i));
        dbg('Sprung zu Szene ' + label(i));
        play(i);
    }

    /* ============================================================= position */

    /* ================================================================ review */
    function remarkMeta() {
        const i = Math.max(0, E.cur), sc = E.scenes[i];
        let st = 0;
        if (E.scene && E.scene.i === i) st = Math.max(0, (clock.now() - E.scene.voiceAt) / 1000);
        let off = 0;
        for (let j = 0; j < i; j++) off += sceneLen(E.scenes[j]) / 1000;
        // what Solita said at that moment goes along: the remark can be read against her words
        const said = lineAt(E.voices[sc.id], st) || [...(E.voices[sc.id].lines || [])].reverse().find((l) => l.start <= st);
        return { t: off + LEAD / 1000 + st, szene: sc.id, szene_nr: sc.n || String(i + 1).padStart(2, '0'), szene_titel: sc.title || '', szene_t: st,
                 sagt: said ? said.text : '' };
    }

    let pendingMeta = null;
    async function startRemark() {
        if (!E.rec || E.rec.recording) return;
        if (E.state === 'running') pause();
        if (E.state === 'forward' || E.state === 'idle') return;
        reopen();
        pendingMeta = remarkMeta();
        try {
            await E.rec.start();
        } catch (err) {
            live(err.message, true);
            return;
        }
        document.body.classList.add('recording');
        $id('tour-view').classList.add('rec');
        ui();
    }

    async function stopRemark(keep) {
        if (!E.rec || !E.rec.recording) return false;
        document.body.classList.remove('recording');
        $id('tour-view').classList.remove('rec');
        try {
            const r = await E.rec.stop(keep, pendingMeta);
            if (!r) return false;
            if (r.discarded) { live('Verworfen.', true); return false; }
            E.items = r.items;
            live((r.text ? '„' + r.text + '“' : 'Ton') + ' — gespeichert bei Szene ' + pendingMeta.szene_nr + ', ' + mmss(pendingMeta.szene_t), true);
            renderList();
            return true;
        } catch (err) {
            live('Nicht gespeichert (läuft tools/tourkritik.py?): ' + err.message, true);
            return false;
        } finally {
            ui();
        }
    }

    /* the second Enter: the remark is saved and the tour plays on at once (at the end it just stays there) */
    function saveAndGoOn() {
        stopRemark(true).then(() => { if (E.state === 'paused') resume(); });
    }

    function reopen() {
        if (!E.submitted) return;
        E.submitted = false;
        showSubmitted();
        if (E.rec) E.rec.reopen();
        dbg('Weiter nach dem Abschicken — das war noch nicht das Ende');
    }

    async function submit(ev) {
        const sinceSave = E.rec && E.rec.savedAt ? Math.round(performance.now() - E.rec.savedAt) : null;
        const how = { via: ev ? ev.type : 'code', detail: ev ? ev.detail : null, trusted: ev ? ev.isTrusted : false, sinceSave, szene: label(E.cur) };
        if (E.rec.recording) { live('Erst den Kommentar beenden (Enter) — dann ABSCHICKEN.', true); return; }
        if (ev && ev.detail === 0) { live('ABSCHICKEN geht nur per Klick, nicht per Taste.', true); return; }
        // a click right after saving is often the second half of a double press - it only counts once more. The old line
        // ("ABSCHICKEN erst ganz am Ende drücken") confused at the very end (Doc, 19.09.2026: "aber ich bin am Ende")
        if (sinceSave !== null && sinceSave < SUBMIT_GUARD_MS) { live('Kommentar gespeichert. Zum Abschicken bitte noch einmal auf ABSCHICKEN klicken.', true); return; }
        try {
            const j = await E.rec.submit(how);
            E.submitted = true;
            pause();
            showSubmitted();
            live('Abgeschickt · ' + (j.items || E.items).length + ' Kommentare sind bei der Sitzung. Doch nicht fertig? Leertaste nimmt das zurück.', true);
        } catch (err) {
            live('Konnte nicht abschicken (läuft tools/tourkritik.py?): ' + err.message, true);
        }
    }

    /* green and pulsing until the review goes on (Doc, 19.09.2026: "Abgeschickt ... grün wabernd") */
    function showSubmitted() {
        document.body.classList.toggle('submitted', E.submitted);
        const b = $id('tour-send');
        if (b) b.textContent = E.submitted ? 'ABGESCHICKT ✓' : 'ABSCHICKEN';
        fitHud();
    }

    async function drop(n) {
        try { E.items = await E.rec.drop(n); } catch (err) { live('Nicht gelöscht: ' + err.message, true); }
        renderList();
    }

    /* ================================================================== keys */
    function onKey(ev) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
        const tg = ev.target;
        if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT' || tg.isContentEditable)) return;
        const k = ev.key;
        const recording = E.rec && E.rec.recording;
        // Doc, 19.09.2026: "space start/stopp, ENTER stopp sofort rec, ENTER nochmal go on"
        if (k === ' ') {
            ev.preventDefault();
            ev.stopPropagation();
            if (recording) { saveAndGoOn(); return; }
            if (E.state === 'idle') { play(0); return; }
            if (E.state === 'ended') { if (E.submitted) reopen(); return; }
            if (E.state === 'running') pause(); else if (E.state === 'paused') resume();
        } else if (k === 'Enter') {
            if (!(E.state === 'running' || E.state === 'paused' || E.state === 'ended')) return;
            ev.preventDefault();
            ev.stopPropagation();
            if (recording) saveAndGoOn(); else startRemark();
        } else if (k === 'Escape') {
            if (!recording) { const d = $id('tour-drawer'); if (d) d.classList.remove('on'); return; }
            ev.preventDefault();
            stopRemark(false);
        } else if (k === 'ArrowLeft' && !recording) {
            // as a player's "back": more than 3 s into a scene = this scene again, otherwise the one before
            ev.preventDefault();
            const inScene = E.scene ? (clock.now() - E.scene.t0) / 1000 : 0;
            goto(E.cur < 0 ? 0 : (inScene > 3 ? E.cur : E.cur - 1));
        } else if (k === 'ArrowRight' && !recording) {
            ev.preventDefault();
            goto(E.cur + 1);
        } else if (k === 'Home' && !recording) {
            ev.preventDefault();
            goto(0);
        } else if (k === 'f') {
            if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {});
        } else if (k === 'k' && CRITICS) {
            $id('tour-drawer').classList.toggle('on');
        } else if (k === 'u') {
            subsOn = !subsOn;
            try { localStorage.setItem(SUBS_KEY, subsOn ? '1' : '0'); } catch (e) { /* no storage */ }
            showSubs();
        }
    }

    /* ============================================================== subtitles */
    const SUBS_KEY = 'cyber-tour-subs';
    let subsOn = true;
    try { subsOn = localStorage.getItem(SUBS_KEY) !== '0'; } catch (e) { /* no storage: on */ }
    // the row only exists for a tour with text, and only while it is switched on (u)
    function showSubs() {
        const any = E.scenes.some((sc) => E.voices[sc.id] && E.voices[sc.id].lines.length);
        document.body.classList.toggle('subs', subsOn && any);
    }
    function subtitle() {
        const box = $id('tour-sub');
        if (!box) return;
        let text = '';
        if (E.scene && !(E.run && E.run.fast) && (E.state === 'running' || E.state === 'paused')) {
            const sc = E.scenes[E.scene.i], x = lineAt(E.voices[sc.id], (clock.now() - E.scene.voiceAt) / 1000);
            if (x) text = x.text;
        }
        const span = box.querySelector('span');
        if (span.textContent !== text) span.textContent = text;
    }

    /* the bar's outer columns are at least as wide as the buttons on the right: they overflowed to the left and hid the
       total time in a narrower window (Doc, 19.09.2026: "im Kritiktool unten die Zeit nicht zu sehen - doch, man muss es
       breit [ziehen]"). Both sides get the same minimum, so the bar stays in the middle. */
    function fitHud() {
        const hud = $id('tour-hud');
        if (!hud) return;
        const r = hud.querySelector('.hud-r'), gap = parseFloat(getComputedStyle(r).columnGap) || 0;
        const right = [...r.children].reduce((a, c) => a + c.offsetWidth, 0) + Math.max(0, r.children.length - 1) * gap;
        const side = Math.ceil(Math.max(right, 180));
        hud.style.setProperty('--side', side + 'px');
        // too narrow for three columns (the bar with its times needs ~260 px): the bar gets a row of its own on top
        const cs = getComputedStyle(hud);
        const inner = hud.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        hud.classList.toggle('stack', 2 * side + 2 * (parseFloat(cs.columnGap) || 0) + 260 > inner);
    }
    window.addEventListener('resize', fitHud);

    /* ==================================================================== ui */
    function el(tag, attrs, html) {
        const e = document.createElement(tag);
        Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
        if (html) e.innerHTML = html;
        return e;
    }

    /* drawn, not the ▶ glyph: a font's triangle sits off centre in the round button (Doc, 19.09.2026: "das Dreieck
       im Play sitzt nicht ... zumindest optisch"). Its centroid is on the button's middle - where a triangle looks centred. */
    const PLAY_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M8.5 5.5 L19 12 L8.5 18.5 Z"/></svg>';
    const PAUSE_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5.5" width="4" height="13" rx="1"/><rect x="13.5" y="5.5" width="4" height="13" rx="1"/></svg>';

    const MIC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="9" y="2.5" width="6" height="11.5" rx="3" fill="currentColor"></rect><path d="M5.5 11a6.5 6.5 0 0 0 13 0"></path>' +
        '<line x1="12" y1="17.5" x2="12" y2="21.5"></line><line x1="8.5" y1="21.5" x2="15.5" y2="21.5"></line></svg>';

    function buildChrome() {
        const body = document.body;
        body.classList.add('cyber-tour');
        const stage = document.querySelector('.tour-stage');
        const view = el('div', { id: 'tour-view' });
        stage.parentNode.insertBefore(view, stage);
        view.appendChild(el('div', { id: 'tour-cap' }, '<span class="k"></span><span class="n"></span><span class="t"></span>'));
        view.appendChild(stage);
        const c = E.def.card || {};
        const cardEl = el('div', { id: 'tour-card' }, '<div class="blk"><h1></h1><p></p><div class="sig">Doc Alvers Mathe-Labor</div></div>');
        cardEl.querySelector('h1').textContent = c.title || E.def.title || '';
        cardEl.querySelector('p').textContent = c.sub || '';
        const media = el('div', { class: 'media' });
        if (c.img) { const img = el('img', { alt: '' }); img.src = c.img; media.appendChild(img); }
        const go = el('button', { id: 'tour-start', type: 'button', title: 'Tour starten (Leertaste)', 'aria-label': 'Tour starten' }, PLAY_SVG);
        go.tabIndex = -1;
        go.addEventListener('mousedown', (e) => e.preventDefault());
        go.addEventListener('click', () => { if (E.state === 'idle') play(0); });
        media.appendChild(go);
        cardEl.appendChild(media);
        view.appendChild(cardEl);
        view.appendChild(el('div', { id: 'tour-veil' }, '<div><b></b><span></span><i></i></div>'));
        if (CRITICS) view.appendChild(el('div', { id: 'tour-rec' }, '<i></i> AUFNAHME — ENTER SPEICHERT UND SPIELT WEITER, ESC VERWIRFT'));
        body.appendChild(el('div', { id: 'tour-offstage', 'aria-hidden': 'true' }));
        body.appendChild(el('div', { id: 'tour-callout' }));
        body.insertAdjacentHTML('beforeend', '<svg id="tour-cursor" viewBox="0 0 26 38" width="26" height="38"><path d="M2 2 L2 30 L9.5 23.5 L14 34 L18.5 32 L14 21.5 L24 21 Z" fill="#fff" stroke="#000" stroke-width="2.2" stroke-linejoin="round"/></svg>');
        // subtitles in a row of their own between stage and hints: they cover nothing of the lab
        body.appendChild(el('div', { id: 'tour-sub', 'aria-live': 'off' }, '<span></span>'));
        body.appendChild(el('div', { id: 'tour-live', class: 'empty' }, '<span></span>'));
        // three columns, the outer two equally wide: the bar with its times sits in the window's middle
        // (Doc, 19.09.2026: "Balken x-sym ... zentriert")
        const hud = el('div', { id: 'tour-hud' }, `
            <div class="hud-l">
                <button class="tour-btn" id="tour-play" title="Leertaste">${PLAY_SVG}</button>
                <div class="tour-now" id="tour-now"><b>–</b>bereit</div>
            </div>
            <div class="hud-c">
                <span class="tour-time run" id="tour-run">0:00</span>
                <div id="tour-segs"></div>
                <span class="tour-time" id="tour-time">0:00</span>
            </div>
            <div class="hud-r">` + (CRITICS ? `
                <button class="tour-btn" id="tour-mic" title="Enter">${MIC_SVG}ENTER</button>
                <button class="tour-btn" id="tour-list" title="k">0 KOMMENTARE</button>
                <button class="tour-btn" id="tour-send">ABSCHICKEN</button>` : '') + `
            </div>`);
        body.appendChild(hud);
        if (CRITICS) body.appendChild(el('div', { id: 'tour-drawer' }, '<h3>KOMMENTARE</h3><div class="list"></div>'));

        // a clicked button must not keep the focus: space is the whole interface (as in filmkritik.html)
        hud.querySelectorAll('.tour-btn').forEach((b) => { b.tabIndex = -1; b.addEventListener('mousedown', (e) => e.preventDefault()); });
        $id('tour-play').addEventListener('click', () => {
            if (E.rec && E.rec.recording) { saveAndGoOn(); return; }
            if (E.state === 'idle') play(0); else if (E.state === 'running') pause(); else if (E.state === 'paused') resume();
        });
        if (CRITICS) {
            // the microphone is Enter by mouse: stops and records, a second press saves and plays on
            $id('tour-mic').addEventListener('click', () => { if (E.rec && E.rec.recording) saveAndGoOn(); else startRemark(); });
            $id('tour-list').addEventListener('click', () => $id('tour-drawer').classList.toggle('on'));
            $id('tour-send').addEventListener('click', submit);
        }
        window.addEventListener('keydown', onKey, true);
        document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    }

    function segments() {
        const box = $id('tour-segs');
        box.innerHTML = '';
        E.scenes.forEach((sc, i) => {
            const s = el('div', { class: 'seg', title: label(i) }, '<i></i>');
            s.style.flexGrow = String(sceneLen(sc) / 1000);
            s.addEventListener('click', () => { if (!(E.rec && E.rec.recording)) goto(i); });
            box.appendChild(s);
        });
        markers();
    }

    function markers() {
        const segs = $id('tour-segs').children;
        [...segs].forEach((s) => s.querySelectorAll('.mk').forEach((m) => m.remove()));
        E.items.forEach((x) => {
            const i = E.scenes.findIndex((sc) => sc.id === x.szene);
            if (i < 0 || !segs[i]) return;
            const m = el('span', { class: 'mk', title: x.zeit + ' ' + (x.text || '') });
            m.style.left = Math.min(100, ((LEAD / 1000 + (x.szene_t || 0)) * 1000 / sceneLen(E.scenes[i])) * 100) + '%';
            segs[i].appendChild(m);
        });
    }

    function renderList() {
        const box = document.querySelector('#tour-drawer .list');
        box.innerHTML = E.items.length ? '' : '<div class="empty">Noch keine Kommentare.</div>';
        E.items.forEach((x) => {
            const row = el('div', { class: 'tour-item' });
            row.innerHTML = '<b></b><span></span><span class="x" title="löschen">✕</span>';
            row.querySelector('b').textContent = x.zeit;
            const tx = row.querySelector('span');
            tx.textContent = x.text || '(nur Ton, ' + x.dauer + ' s)';
            if (!x.text) tx.className = 'leer';
            row.addEventListener('click', (ev) => {
                if (ev.target.classList.contains('x')) { drop(x.n); return; }
                const i = E.scenes.findIndex((sc) => sc.id === x.szene);
                if (i >= 0) goto(i);
            });
            box.appendChild(row);
        });
        $id('tour-list').textContent = E.items.length + (E.items.length === 1 ? ' KOMMENTAR' : ' KOMMENTARE');
        markers();
        fitHud();
    }

    function veil(target, p, direct) {
        const v = $id('tour-veil');
        if (target < 0) { v.classList.remove('on'); return; }
        v.classList.add('on');
        v.querySelector('b').textContent = (direct ? 'Springe zu Szene ' : 'Spule vor zu Szene ') + label(target);
        if (direct !== undefined) {
            v.querySelector('span').textContent = direct ? 'die Seite wird für diese Szene aufgebaut'
                                                         : 'alles davor läuft im Schnelldurchlauf, ohne Ton';
        }
        v.querySelector('i').style.setProperty('--p', Math.round((p || 0) * 100) + '%');
    }

    function live(text, hint) {
        const box = $id('tour-live');
        if (!box) return;
        box.classList.toggle('empty', !!hint);
        box.querySelector('span').textContent = text || '';
    }

    function setState(s) {
        E.state = s;
        ui();
    }

    function ui() {
        const b = document.body, recording = E.rec && E.rec.recording;
        b.classList.toggle('running', E.state === 'running' || E.state === 'forward');
        b.classList.toggle('idle', E.state === 'idle');
        b.classList.toggle('can-rec', !recording && (E.state === 'running' || E.state === 'paused' || E.state === 'ended'));
        const play = $id('tour-play');
        if (play) play.innerHTML = E.state === 'running' ? PAUSE_SVG : PLAY_SVG;
        const now = $id('tour-now');
        if (now) {
            const sc = E.scenes[E.cur];
            now.innerHTML = '';
            const bb = el('b');
            bb.textContent = sc ? (sc.n || String(E.cur + 1).padStart(2, '0')) : '–';
            now.appendChild(bb);
            now.appendChild(document.createTextNode(sc ? (sc.title || E.def.title || '') : 'bereit'));
        }
        const send = $id('tour-send');
        if (send) send.disabled = !!recording;
    }

    // progress: the running scene's segment fills, the ones before are done
    setInterval(() => {
        subtitle();
        const segs = $id('tour-segs');
        if (!segs || !E.scenes.length) return;
        [...segs.children].forEach((s, i) => {
            // nothing played yet after a reload: no filled segments (Doc, 19.09.2026: "warum steht der Balken nach
            // reload da?") - only the scene space goes back to is outlined
            s.classList.toggle('done', E.state !== 'idle' && (i < E.cur || E.state === 'ended'));
            const fill = s.querySelector('i');
            if (i !== E.cur || E.state === 'ended') { fill.style.width = ''; return; }
            const p = E.scene && E.scene.i === i ? (clock.now() - E.scene.t0) / (E.scene.deadline - E.scene.t0) : 0;
            fill.style.width = Math.max(0, Math.min(100, p * 100)) + '%';
        });
        // the whole tour as in filmkritik.html: running time left of the bar, total right of it (Doc, 19.09.2026: "hier
        // Gesamtzeit, links runtime"). Measured in scene lengths, so a fast replay counts as the time it stands for.
        const tm = $id('tour-time'), tr = $id('tour-run');
        if (tm && tr && E.ready) {
            const total = E.scenes.reduce((a, sc) => a + sceneLen(sc), 0) / 1000;
            let run = 0;
            if (E.state === 'ended') run = total;
            else if (E.cur >= 0) {
                for (let j = 0; j < E.cur && j < E.scenes.length; j++) run += sceneLen(E.scenes[j]) / 1000;
                if (E.scene && E.scene.i === E.cur) {
                    const p = (clock.now() - E.scene.t0) / (E.scene.deadline - E.scene.t0);
                    run += Math.max(0, Math.min(1, p)) * sceneLen(E.scenes[E.cur]) / 1000;
                }
            }
            tr.textContent = mmss(run);
            tm.textContent = mmss(total);
        }
    }, 100);

    // the pulse: an armed tour whose page is gone is torn down by the server (tools/tourkritik.py). The other way
    // round, a tour whose server is gone or has torn it down stops at once: its pupils would go on writing into
    // data the server has put back (19.09.2026, a test submission landed in GENII's restored pool)
    setInterval(() => {
        if (!E.def || !E.local || document.hidden && E.state === 'idle') return;
        // the state goes along: a page that only waits (idle after a reload) does not keep a parked tour alive
        fetch('/__tour/alive', { method: 'POST', body: JSON.stringify({ state: E.state }) }).then((r) => r.json()).then((j) => {
            if (E.armed && !j.armed && (E.state === 'running' || E.state === 'paused' || E.state === 'forward')) {
                E.stale = true;
                E.armed = false;
                if (E.state === 'forward') { cancelRun(E.run); clock.pause(); setState('paused'); } else pause();
                live('Der Server hat die Tour zurückgesetzt (die Seite war lange weg). Leertaste startet die Szene neu.', true);
            }
        }).catch(() => {
            if (E.state !== 'running') return;
            pause();
            live('Der Tour-Server antwortet nicht — angehalten. Läuft tools/tourkritik.py noch?', true);
        });
    }, PULSE);

    // live reload (tools/live_reload.py) asks before reloading: never mid-scene, never mid-remark
    window.__liveReloadBusy = () => E.state === 'running' || E.state === 'forward' || !!(E.rec && E.rec.recording);

    const LOCAL_ONLY = 'Diese Tour spielt echte Server-Daten nach und läuft nur auf Docs Rechner (tools/tourkritik.py).';

    /* ================================================================ define */
    function define(def) {
        E.def = def;
        E.scenes = def.scenes || [];
        const start = async () => {
            E.local = await fetch('/__tour/info', { cache: 'no-store' })
                .then((r) => r.ok && (r.headers.get('Content-Type') || '').includes('json')).catch(() => false);
            if (!E.local) {
                CRITICS = false;                    // nowhere to store a remark
                E.manifest = fetch(MEDIA_BASE + def.id + '/tour.json', { cache: 'no-store' })
                    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
                E.manifest.catch((e) => dbg('Stimme online nicht gefunden (' + e.message + ') — tools/tour_publish.mjs ' + def.id));
            }
            buildChrome();
            ui();                                   // body.idle: the big play shows from the first paint
            fitHud();
            document.fonts.ready.then(fitHud);      // Orbitron makes the buttons wider once it is there
            card(true);
            if (def.card && def.card.img) cardImage(true, false);
            E.rec = CRITICS && window.KritikRecorder ? KritikRecorder.create({ log: dbg, onLive: (s) => live(s || 'Ich höre zu …', !s) }) : null;
            live('Lade Solitas Stimme …', true);
            E.texts = E.local ? fetch('/__tour/text').then((r) => (r.ok ? r.json() : {})).catch(() => ({}))
                              : E.manifest.then((m) => m.texts || {}).catch(() => ({}));
            E.ready = Promise.all(E.scenes.map(loadVoice));
            await E.ready;
            segments();
            showSubs();
            if (E.rec) {
                try {
                    const j = await E.rec.list();
                    E.items = j.items || [];
                } catch (e) { dbg('Kommentarliste nicht erreichbar — läuft tools/tourkritik.py?'); }
                renderList();
            }
            live(CRITICS ? 'Leertaste startet und stoppt · Enter hält sofort an und nimmt auf, Enter nochmal speichert und spielt weiter · ◀ ▶ Szenen · k Kommentare · u Untertitel · f Vollbild'
                         : 'Leertaste startet und stoppt · ◀ ▶ Szenen · u Untertitel · f Vollbild', true);
            if (!E.local && def.local) { live(LOCAL_ONLY, true); return; }
            prepareStage();
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
    }

    window.CyberTour = {
        define,
        play, pause, resume, goto,
        get state() { return { state: E.state, cur: E.cur, error: E.error, items: E.items.length, armed: E.armed, fast: !!(E.run && E.run.fast) }; },
        get voices() { return E.voices; },
        log: LOG,
    };
})();
