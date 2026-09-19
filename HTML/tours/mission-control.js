/* Die ganze Klasse im Blick — the live tour (Doc, 19.09.2026: "ich würde gern den 'Die ganze Klasse' erst
 * machen"). The film's choreography (videopipeline/mission-control/run2.mjs) moved over scene by scene onto
 * the tour's API (js/cyber-tour.js); Solita speaks the film's takes (narration.mjs -> s1.mp3 ... s12.mp3 in
 * ~/Movies/videopipeline/mission-control/, served by tools/tourkritik.py).
 *
 * What the film needed a second browser, Playwright and the management API for, happens here like this:
 *   - the eight pupils in the background are pages off stage (t.addFrame) - simulated devices, each with its
 *     own storage, their heartbeat 15 s -> 3 s (as run2's INIT, note 3)
 *   - a pupil leaving is t.leave(): the page's own visibilitychange path; the viewer switching windows does
 *     NOT count (the pupil frames' visibility and focus belong to the tour)
 *   - GENII's staged submissions are parked for the tour and put back at its end (tour_hooks.py setup /
 *     teardown - also when the page is closed mid-tour, then after 3 min, or when the server stops)
 *   - the second click on the red button needs Doc's svp session: tour_hooks.py abort runs quiz_abort as the
 *     plan owner, exactly as run2 (note 4); the page's svpAuth.api answers ok
 * Pages come from the tour server's own origin, so this origin keeps its own GENII codes (24 of them).
 */
(function () {
    'use strict';

    const WRONG = new Set([4, 11, 19, 27]);                   // the pupil's four mistakes: 29/33, Note 2
    const DONE_KEY = 'done-infotestfos12-eingang-v1-GENII';
    // as the slip's QR since 19.09.2026: code AND deck name (the start screen shows "NEPHRIT · Zettel-Code Q37M")
    const TEST = (code, alias) => '../infotestfos12.html?klasse=GENII&code=' + code + (alias ? '&alias=' + encodeURIComponent(alias) : '');
    const tile = (code) => '.lt-tile[data-code="' + code + '"]';

    /* the dashboard's gate hash, read from the gate itself (public by design, never the passphrase) */
    async function gateHash() {
        const src = await (await fetch('../svp/svp-gate.js')).text();
        const m = src.match(/const HASHES = \[\s*'([0-9a-f]{64})'/);
        if (!m) throw new Error('Gate-Hash nicht gefunden in svp-gate.js');
        return m[1];
    }

    /* an earlier poll: the page asks every 5 s anyway; this only saves the wait */
    const refresh = (t) => t.eval('teacher', () => { const b = document.getElementById('ltResults'); if (b) b.click(); });

    /* the pupil's next answer: with the cursor (a tap) or quietly (scrolled into view and clicked) */
    async function answer(t, withCursor) {
        const i = t.data.next++;
        const sol = t.eval('pupil', (i) => window.QUIZ.questions[i].solution, i);
        const sel = '.opt[data-q="' + i + '"][data-o="' + (WRONG.has(i) ? (sol + 1) % 4 : sol) + '"]';
        if (withCursor) { await t.tap('pupil', sel); return; }
        t.eval('pupil', (s) => {
            const b = document.querySelector(s);
            b.scrollIntoView({ block: 'center', behavior: 'smooth' });
            setTimeout(() => b.click(), 300);
        }, sel);
    }

    /* ------------------------------------------------ the class in the background */
    const bgAnswer = (t, b, n, p) => t.eval(b.name, ({ n, p }) => {
        const Q = window.QUIZ.questions;
        let done = 0;
        for (let i = 0; i < Q.length && done < n; i++) {
            if (document.querySelector('.opt.sel[data-q="' + i + '"]')) continue;
            let o = Q[i].solution;
            if (Math.random() > p) o = (o + 1 + Math.floor(Math.random() * 3)) % 4;
            const btn = document.querySelector('.opt[data-q="' + i + '"][data-o="' + o + '"]');
            if (btn) { btn.click(); done++; }
        }
    }, { n, p });
    function bgDrip(t, b, every, p) {
        b.stop = t.every(() => every * (0.7 + Math.random() * 0.6), () => bgAnswer(t, b, 1, p));
    }
    function bgFinish(t, b, p) {
        if (b.stop) b.stop();
        bgAnswer(t, b, 99, p);
        t.eval(b.name, () => document.getElementById('submitBtn').click());
    }
    const deselect = (t) => t.eval('teacher', () => {
        document.querySelectorAll('.lt-tile.sel').forEach((x) => x.classList.remove('sel'));
        document.getElementById('ltDetail').hidden = true;
    });

    /* inline SVG where a picture has to change colour (the IBB logo's grey letters on the dark scan screen) */
    document.querySelectorAll('[data-svg]').forEach((el) => {
        fetch(el.dataset.svg).then((r) => r.text()).then((txt) => {
            el.innerHTML = txt.replace(/^[\s\S]*?(<svg)/, '$1');     // without the XML prolog
        }).catch(() => { /* the block stays without a logo */ });
    });

    CyberTour.define({
        id: 'mission-control',
        title: 'Die ganze Klasse im Blick',
        // Doc, 19.09.2026: "Test-Sperre und Mission Control ... irgendwas Beschreibenderes bitte"
        card: { title: 'Die ganze Klasse im Blick', sub: 'Einen Online-Test live begleiten – vom Zettel bis zur Auswertung', img: '../resources/kids.jpeg' },

        /* the stage, while the page loads - nothing here touches the server's data (Doc, 19.09.2026: "beim 1. space
           dauert es 'ne Weile"): pages, codes, deck names, the class off stage waiting on its start screens */
        async prepare(t) {
            t.card(true);
            t.cardImage(true, false);                            // the class from the start, still (Doc, 18.09.)
            t.caption('', '');
            try { localStorage.removeItem(DONE_KEY); } catch (e) { /* no storage */ }
            // a fresh demo class every run, as in the film's fresh browser: once stored, leistungstest.html seals
            // the names and the tiles show only the deck names (measured after a reload, 19.09.2026). This is the
            // tour server's own origin - Doc's real groups live on localhost:8765 / docalvers.de, not here.
            try {
                const all = JSON.parse(localStorage.getItem('svp-leistungstest-v1') || '{}');
                delete all.GENII;
                delete all.Demo;
                localStorage.setItem('svp-leistungstest-v1', JSON.stringify(all));
            } catch (e) { /* no storage */ }
            await t.load('teacher', '../svp/leistungstest.html?test');
            await t.until(() => t.$('teacher', '.lt-tile[data-code]'));
            await t.wait(400);
            const codes = t.eval('teacher', () => [...document.querySelectorAll('.lt-tile[data-code]')].map((x) => x.dataset.code));
            if (codes.length !== 24) throw new Error('GENII-Liste hat ' + codes.length + ' Codes');
            // the deck names, from the tiles ("NEPHRIT · Q37M" under the real name)
            t.data.alias = t.eval('teacher', () => Object.fromEntries([...document.querySelectorAll('.lt-tile[data-code]')].map((x) => {
                const sub = (x.querySelector('.tl-sub') || {}).textContent || '';
                return [x.dataset.code, sub.includes('\u00b7') ? sub.split('\u00b7')[0].trim() : ''];
            })));
            t.data.A = codes[0];
            t.data.next = 0;
            const gate = await gateHash();
            t.eval('teacher', (h) => {
                localStorage.setItem('svp-edit-gate', h);         // the live dashboard's gate (s11)
                svpAuth.hasSession = () => true;                  // the server call is tour_hooks.abort's
                svpAuth.api = async () => ({ ok: true, status: 204 });
                svpAuth.whoami = () => 'Doc';
            }, gate);
            t.scroll('teacher', '#ltMc');
            t.data.bg = codes.slice(1, 9).map((code) => ({ code, name: 'bg-' + code, stop: null }));
            await Promise.all(t.data.bg.map((b) => t.addFrame(b.name, TEST(b.code, t.data.alias[b.code]), { timers: '15000:3000' })));
            await t.until(() => t.data.bg.every((b) => t.$(b.name, '.guard-start .guard-btn')));
            t.log('Klasse bereit: ' + t.data.A + ' + ' + t.data.bg.map((b) => b.code).join(' '));
        },

        /* on SPACE: GENII is parked while scene 1 already plays (title card and voice need no server); nobody writes
           before scene 3, which waits for it */
        async setup(t) {
            t.card(true);
            t.cardImage(true, false);
            t.caption('', '');
            t.data.parked = t.hook('setup');                     // park GENII (or clear an earlier tour's rows)
            t.data.parked.catch(() => { /* surfaces in scene 3 */ });
        },

        async teardown(t) {
            await t.hook('teardown');                            // GENII's 21 staged submissions come back
        },

        scenes: [
            {
                id: 's1', n: '', title: 'Die ganze Klasse im Blick',
                async run(t) {
                    t.caption('', '');
                    await t.rest();
                    t.eval('teacher', () => window.scrollTo(0, 0));
                    t.card(false);
                    await t.wait(900);
                    t.cardImage(false, false);                   // the end card slides in again later, with the cheer
                },
            },
            {
                id: 's2', n: '02', title: 'Die Zettel',
                async run(t) {
                    t.caption('02', 'Die Zettel');
                    await t.at(0.6);
                    t.scroll('teacher', '#ltMc');
                    await t.at(t.cue(0, 7.7));
                    t.scroll('teacher', '#ltName', 'center');
                    await t.wait(800);
                    await t.tap('teacher', '#ltName');           // "Zettel ohne Klarname"
                    await t.wait(600);
                    const glide = t.scroll('teacher', '#ltSlipCard');
                    await t.wait(Math.max(1400, glide + 150));   // the card measures the middle - only once the page stands
                    // one card grows - as a copy on top, by ZOOM stepped per frame, so text and QR stay sharp - and moves to
                    // the middle of the picture while it grows (Doc, 19.09.2026: "du zoomst das Calcit oben raus und lässt
                    // es in der Ecke stehen ... beim Zoomen in die Mitte schieben"). Where the middle is gets MEASURED: the
                    // page is zoomed from outside, the card by itself, and translate lengths may scale with the card's zoom.
                    t.eval('teacher', () => {
                        const s = document.querySelector('#ltSlips .lt-slip');
                        if (!s) return;
                        const box = s.parentNode;
                        if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
                        const c = s.cloneNode(true);
                        c.id = 'vp-bigslip';
                        // opaque: the slips below must not shine through the big one
                        const bg = getComputedStyle(s).backgroundColor.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgb($1,$2,$3)');
                        Object.assign(c.style, { position: 'absolute', left: s.offsetLeft + 'px', top: s.offsetTop + 'px',
                            width: s.offsetWidth + 'px', zIndex: 50, margin: 0, background: bg === 'rgba(0, 0, 0, 0)' ? '#0e2146' : bg,
                            boxShadow: '0 12px 40px rgba(0,0,0,0.55)' });
                        box.appendChild(c);
                        const Z = 1.55;
                        const mid = (r) => [r.left + r.width / 2, r.top + r.height / 2];
                        const probe = document.createElement('div');
                        probe.style.cssText = 'position:fixed;inset:0;visibility:hidden;pointer-events:none';
                        document.body.appendChild(probe);
                        const [vx, vy] = mid(probe.getBoundingClientRect());
                        probe.remove();
                        const at = (z, tx, ty) => { c.style.zoom = String(z); c.style.translate = tx + 'px ' + ty + 'px'; return mid(c.getBoundingClientRect()); };
                        const k = (z) => { const a = at(z, 0, 0), b = at(z, 100, 100); return [(b[0] - a[0]) / 100, (b[1] - a[1]) / 100, a]; };
                        const k1 = k(1), kZ = k(Z);
                        const D = [vx - kZ[2][0], vy - kZ[2][1]];
                        at(1, 0, 0);
                        const t0 = performance.now();
                        const step = (now) => {
                            const p = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - p, 3);
                            const z = 1 + (Z - 1) * e, f = (z - 1) / (Z - 1);
                            at(z, (D[0] * e) / (k1[0] + (kZ[0] - k1[0]) * f), (D[1] * e) / (k1[1] + (kZ[1] - k1[1]) * f));
                            if (p < 1) requestAnimationFrame(step);
                        };
                        requestAnimationFrame(step);
                    });
                    await t.rest();
                    t.eval('teacher', () => { const b = document.getElementById('vp-bigslip'); if (b) b.remove(); });
                },
            },
            {
                id: 's3', n: '03', title: 'QR scannen',
                async run(t) {
                    t.caption('03', 'QR scannen');
                    await t.data.parked;                         // GENII is parked before the first pupil can write
                    await t.load('pupil', TEST(t.data.A, t.data.alias[t.data.A]));
                    t.scroll('teacher', '#ltMc');
                    await t.until(() => t.$('pupil', '.guard-start .guard-btn'));
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Die Klasse legt los',
                async run(t) {
                    const bg = t.data.bg;
                    t.caption('04', 'Die Klasse legt los');
                    await t.at(t.cue(0, 1.5));
                    await t.tap('pupil', '.guard-btn');          // Test starten
                    await t.wait(700);
                    await answer(t, true);
                    await t.wait(500);
                    await answer(t, true);
                    await t.wait(1200);
                    refresh(t);
                    await t.wait(1800);
                    await answer(t, false);
                    await t.at(t.cue(1, 13.0));
                    for (let i = 0; i < bg.length; i++) {        // the others start, one by one
                        const btn = t.$(bg[i].name, '.guard-btn');
                        if (btn) btn.click();
                        bgDrip(t, bg[i], 3200 + i * 250, i === 6 ? 0.55 : 0.75);
                        await t.wait(450);
                    }
                    // s7: the WLAN goes, the page stays - no leave is reported, only the heartbeat stops
                    bgAnswer(t, bg[7], 2, 0.75);
                    t.later(6000, () => { if (bg[7].stop) bg[7].stop(); t.offline(bg[7].name); });
                    await t.wait(900);
                    refresh(t);
                    await answer(t, false);
                    await t.wait(2500);
                    refresh(t);
                    await answer(t, false);
                    await t.rest();
                },
            },
            {
                id: 's5', n: '05', title: 'Kurz mal weg',
                async run(t) {
                    t.caption('05', 'Kurz mal weg');
                    await t.at(t.cue(0, 3.1));
                    t.leave('pupil', true);                      // another window: the guard's own path
                    await t.wait(1800);
                    refresh(t);
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Weiter',
                async run(t) {
                    t.caption('06', 'Weiter');
                    await t.at(0.2);
                    t.leave('pupil', false);
                    await t.tap('pupil', '.guard-btn');          // Weiter mit dem Test
                    await t.at(t.cue(0, 5.3));
                    await answer(t, true);
                    await t.wait(1800);
                    refresh(t);
                    await t.rest();
                },
            },
            {
                // Doc's review of the tour (19.09., 07 · 0:07): "was bedeutet 07 Funkstille? der ist doch wieder online" -
                // the pupil on the right works on, so the scene has to SHOW which one is gone: the title is the term
                // Solita introduces here, and the cursor sits on that tile while she says "offline"
                id: 's7', n: '07', title: 'Offline',
                async run(t) {
                    t.caption('07', 'Offline');
                    await t.at(0.3);
                    refresh(t);
                    await t.at(3.5);
                    await answer(t, false);
                    await t.at(5.6);
                    // on the word itself, not the tile's middle (Doc, 19.09.2026: "der Mauszeiger zeigt nicht direkt
                    // auf das Offline ... auf 3/33"); the pill is a clear slate now, the label next to it says why
                    const xy = await t.point('teacher', tile(t.data.bg[7].code) + ' .tl-pill');
                    t.callout('meldet sich nicht mehr', xy);
                    await t.rest();
                    t.callout(null);
                },
            },
            {
                // The film (18.09., 2:28) put a label next to every button of this scene. In the tour the buttons speak
                // for themselves now - the confirming click loud red, taking it back green - and the labels went
                // (Doc, 19.09.2026: "jetzt wo die Dinger rot bzw. grün sind, braucht man die extra Pillen nicht mehr")
                id: 's8', n: '08', title: 'Der rote Knopf',
                async run(t) {
                    const A = t.data.A;
                    t.caption('08', 'Der rote Knopf');
                    await t.at(1.5);
                    await answer(t, false);
                    await t.at(4.2);
                    await t.tap('teacher', tile(A));             // the detail with the red button
                    await t.wait(500);
                    t.scroll('teacher', '#ltMc');                // tiles AND detail in the picture
                    await t.wait(900);
                    await t.point('teacher', '#ltAbort .lt-btn');
                    await t.wait(500);
                    await t.tap('teacher', '#ltAbort .lt-btn');  // -> "Wirklich? Nochmal klicken"
                    await t.at(t.cue(0, 8.7) - 0.9);
                    await t.hook('abort', { code: A, on: true });
                    await t.tap('teacher', '#ltAbort .lt-btn');  // the second click
                    await t.wait(400);
                    t.scroll('teacher', '#ltMc');
                    await t.at(t.cue(1, 15.4) + 0.2);
                    await t.point('teacher', '#ltAbort .lt-btn');   // "Abbruch zurücknehmen", while Solita names it
                    await t.at(t.cue(2, 20.7) - 0.4);
                    await t.hook('abort', { code: A, on: false });
                    await t.tap('teacher', '#ltAbort .lt-btn');
                    await t.wait(1200);
                    await t.until(() => t.$('pupil', '.guard-start:not([hidden]) .guard-btn'), 6000).catch((e) => { if (e.tourCancel) throw e; });
                    await t.wait(1600);                          // "Es geht weiter" stays in the picture a moment
                    await t.tap('pupil', '.guard-btn');          // Weiter mit dem Test
                    await t.rest();
                },
            },
            {
                id: 's9', n: '09', title: 'Abgabe',
                async run(t) {
                    t.caption('09', 'Abgabe');
                    await t.at(0.3);
                    t.data.bg.slice(0, 6).forEach((b, i) => t.later(900 + i * 1400, () => bgFinish(t, b, 0.75)));
                    while (t.data.next < 33) { await answer(t, false); await t.wait(170); }
                    await t.wait(400);
                    await t.tap('pupil', '#submitBtn');
                    await t.wait(1800);
                    refresh(t);
                    t.scroll('teacher', '#ltMc');
                    await t.wait(2500);
                    refresh(t);
                    await t.rest();
                },
            },
            {
                id: 's10', n: '10', title: 'Frage für Frage',
                async run(t) {
                    t.caption('10', 'Frage für Frage');
                    await t.at(0.2);
                    deselect(t);
                    t.data.dash = t.load('teacher2', '../infotestfos12.html?klasse=GENII&auswertung');
                    t.data.dash.catch(() => { /* awaited in s11 */ });
                    refresh(t);
                    await t.at(t.cue(0, 2.2));
                    await t.tap('teacher', tile(t.data.A));
                    await t.wait(500);
                    t.scroll('teacher', '#ltMc');
                    await t.rest();
                },
            },
            {
                id: 's11', n: '11', title: 'Die Klasse als Ganzes',
                async run(t) {
                    t.caption('11', 'Die Klasse als Ganzes');
                    await t.data.dash;
                    await t.at(t.cue(0, 2.8));
                    t.show('teacher2', true);
                    await t.at(7.5);
                    t.eval('teacher2', () => { const d = document.getElementById('dashquestions'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
                    await t.rest();
                },
            },
            {
                id: 's12', n: '12', title: 'Kein Name auf dem Server',
                async run(t) {
                    t.caption('12', 'Kein Name auf dem Server');
                    t.show('teacher2', false);
                    deselect(t);
                    t.scroll('teacher', '#ltMc');
                    t.hideCursor();
                    await t.at(t.cue(0, 7.8));
                    t.card(true);
                    await t.rest();
                    // Doc's review (18.09., 3:28): the title moves up, the class from the intro comes in, with its cheer
                    t.cardImage(true, true);
                    t.sound('../resources/kids.wav', 0.3);
                    await t.wait(5200);
                },
            },
        ],
    });
})();
