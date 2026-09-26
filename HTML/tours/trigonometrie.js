/* Live tour "Trigonometrie" - the Drehbuch of tours/trigonometrie.html.
 *
 * Doc, 26.09.2026: "überleg dir eine coole Tour, mach Sound dazu, mit Solitas Stimme". Like maya.js it does not come
 * from a film: every scene is one chapter of the lab (HTML/trigonometrie.html) and shows the one thing that chapter is
 * for - 00 the opening, then 01 to 11 with the lab's own numbers. Solita's text is videopipeline/trigonometrie/
 * narration.mjs (run1.mjs speaks it into ~/Movies/videopipeline/trigonometrie/); every tap and drag below lands on the
 * line of hers that names it (t.line(k) = where her k-th subtitle line starts, measured in her MP3).
 *
 * Space pauses, Enter records a remark (tools/tourkritik.py keeps them per scene and second).
 *
 * The lab is driven the way a pupil drives it - no change to the lab for the tour: tabs, checkboxes, buttons and the
 * dropdown are tapped; sliders are moved (t.slide: input events, the lab's own handler runs); the points on the stage
 * are dragged with pointer events on the canvas (t.drag) - so the snapping, the HUD and the refits are the real ones.
 * The page's `stage` (TrigLab.TrigStage, a global of the lab's script) tells where a point of its world is on screen.
 *
 * Every scene has enter(): a jump loads the lab fresh (every chapter at its defaults) and opens that scene's chapter.
 * A scene never needs more: each one starts from its chapter's defaults, since no scene before it touches that chapter.
 */
(function () {
    'use strict';

    const LAB = '../trigonometrie.html';
    const TAP_S = 0.62;                 // the cursor travels this long before a tap lands (cyber-tour's point)
    const PI = Math.PI, TAU = 2 * PI, rad = (d) => d * PI / 180;
    const M = [-1.55, 0];               // centre of the unit circle in the chapters with a graph (trigonometrie-mod-kurven.js)

    const ev = (t, fn, arg) => t.eval('lab', fn, arg);
    /* where Solita starts her k-th line in this scene (without a voice: a guess, so the scene still plays) */
    const L = (t, k) => t.line(k, 2.4 * k);

    /* the chapter line; the title card goes */
    function begin(t, n, title) {
        t.caption(n, title);
        t.card(false);
    }

    /* ---- tapping and pointing, landing at a second of the scene */
    async function tapOn(t, sec, sel) {
        await t.at(sec - TAP_S);
        return t.tap('lab', sel);
    }
    async function pointOn(t, sec, sel) {
        await t.at(sec - TAP_S);
        return t.point('lab', sel);
    }
    /* a row of the value panel, looked up when the cursor sets off - the panel is rebuilt on every change */
    async function pointRow(t, sec, text) {
        await t.at(sec - TAP_S);
        const el = await hudRow(t, text);
        if (!el) { t.log('keine Zeile im Wertefeld: ' + text); return null; }
        return t.point('lab', el);
    }
    /* a point of the stage's world */
    async function pointW(t, sec, p) {
        await t.at(sec - TAP_S);
        const xy = await at(t, p);
        return t.pointAt('lab', xy[0], xy[1]);
    }

    /* ---- the lab */
    const TAB = (id) => '#tab-bar .tab-btn[data-tab="' + id + '"]';
    /* a chapter at once, without the cursor (enter) */
    async function tabNow(t, id) {
        await ev(t, (sel) => document.querySelector(sel).click(), TAB(id));
        await t.wait(250);                  // switchTab draws in the next frame
    }
    /* ... and as a scene begins: the tab tapped while Solita starts */
    async function tabTap(t, id) {
        await t.tap('lab', TAB(id));
        await t.wait(150);
    }

    /* a point of the stage's world in the page's client coordinates */
    const at = (t, p) => ev(t, (p) => {
        const r = stage.cv.getBoundingClientRect(), s = stage.w2s(p);
        return [r.left + s[0], r.top + s[1]];
    }, p);
    /* where the i-th draggable point of the chapter on stage is now */
    const handleAt = (t, i) => ev(t, (i) => {
        const r = stage.cv.getBoundingClientRect(), s = stage.w2s(stage.handles[i].get());
        return [r.left + s[0], r.top + s[1]];
    }, i);
    /* drag point i along world(k), k from 0 to 1 - the finger's motion ends at the given second */
    async function dragTo(t, endSec, i, world, ms) {
        await t.at(endSec - ms / 1000 - TAP_S);
        return t.drag('lab', (k) => (k === 0 ? handleAt(t, i) : at(t, world(k))), ms);
    }
    /* paths in the world: a straight stretch, an arc counter-clockwise */
    const seg = (p, q) => (k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
    const arc = (m, r, a0, a1) => (k) => [m[0] + r * Math.cos(a0 + (a1 - a0) * k), m[1] + r * Math.sin(a0 + (a1 - a0) * k)];

    /* a slider moved by the finger, landing on it at the given second (null: right away) */
    async function slideAt(t, sec, sel, to, ms) {
        if (sec != null) await t.at(sec - TAP_S);
        return t.slide('lab', sel, to, ms);
    }
    /* the checkbox of a sidebar card, found by its label */
    const box = (t, cid, text) => ev(t, (a) => {
        const l = [...document.querySelectorAll('#' + a[0] + ' label')].find((x) => x.textContent.includes(a[1]));
        return l ? l.querySelector('input') : null;
    }, [cid, text]);
    async function tick(t, sec, cid, text) {
        const el = await box(t, cid, text);
        if (!el) { t.log('kein Häkchen: ' + cid + ' ' + text); return; }
        await t.at(sec - TAP_S);
        await t.tap('lab', el);
    }
    /* a small button of a card, found by its text */
    const button = (t, cid, text) => ev(t, (a) =>
        [...document.querySelectorAll('#' + a[0] + ' .v-mini')].find((x) => x.textContent.trim() === a[1]) || null, [cid, text]);
    /* a row of the value panel over the stage, found by its text */
    const hudRow = (t, text) => ev(t, (s) =>
        [...document.querySelectorAll('#v-hud .v-hud-row, #v-hud .v-hud-note')].find((x) => x.textContent.includes(s)) || null, text);
    /* the theory column scrolls at reading pace to an element of it (its own scroll box, not the page) */
    const docTo = (t, sel) => ev(t, (sel) => {
        const box = document.getElementById('v-doc'), el = document.querySelector(sel);
        if (!box || !el) return 0;
        const y0 = box.scrollTop, y1 = y0 + el.getBoundingClientRect().top - box.getBoundingClientRect().top - 60;
        const t0 = performance.now(), ms = 1400;
        const step = (now) => {
            const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
            box.scrollTop = y0 + (y1 - y0) * e;
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        return ms;
    }, sel);
    /* the next puzzle made to order: Math.random answers the five picks of newQuiz() - a, its sign, b, c, d - and is
       itself again after the last one */
    const rigRandom = (t, seq) => ev(t, (seq) => {
        const orig = Math.random, q = seq.slice();
        Math.random = function () { const v = q.shift(); if (!q.length) Math.random = orig; return v; };
    }, seq);

    const SLIDER = (cid, k) => '#' + cid + ' .cyber-control-group:nth-of-type(' + (k + 1) + ') input[type="range"]';

    CyberTour.define({
        id: 'trigonometrie',
        title: 'Trigonometrie',
        card: { title: 'Trigonometrie', sub: 'Vom rechtwinkligen Dreieck zur Welle – in elf Kapiteln' },
        /* what is spelled for Solita's voice, written back for the subtitles (Gegenkatehte -> Gegenkathete) */
        spelled: { atehte: 'athete' },

        /* the lab, fresh, while the page loads: its settings live in this origin's storage (the tour server's own -
           Doc's :8765 and docalvers.de keep theirs) */
        async prepare(t) {
            t.card(true);
            t.caption('', '');
            try {
                localStorage.removeItem('cyber-lab-lang');
                Object.keys(localStorage).filter((k) => k.startsWith('coach-collapsed')).forEach((k) => localStorage.removeItem(k));
            } catch (e) { /* no storage */ }
            await t.load('lab', LAB);
            await t.until(() => ev(t, () => typeof stage !== 'undefined' && stage.w > 0 && stage.handles.length > 0 &&
                !!window.katex && !!document.querySelector('#v-hud .katex')), 20000);
            await ev(t, () => document.fonts.ready.then(() => true));
            await t.wait(1600);                     // the branding settles
        },

        scenes: [
            {
                id: 's0', n: '00', title: 'Vom Dreieck zur Welle',
                async enter(t) { await tabNow(t, 'dreieck'); },
                async run(t) {
                    begin(t, '00', 'Vom Dreieck zur Welle');
                    await pointOn(t, L(t, 3) + 1.3, '#tab-bar');                  /* "in elf Kapiteln" */
                    await t.rest();
                },
            },
            {
                id: 's1', n: '01', title: 'Das rechtwinklige Dreieck',
                async enter(t) { await tabNow(t, 'dreieck'); },
                async run(t) {
                    begin(t, '01', 'Das rechtwinklige Dreieck');
                    await pointOn(t, L(t, 1) + 0.5, '#v-hud .v-hud-box');         /* "Oben links rechnet das Labor mit" */
                    await pointOn(t, L(t, 2) + 1.4, '#v-hud .v-hud-box > div:nth-child(3)');   /* "... ist der Sinus" */
                    await pointOn(t, L(t, 3) + 1.4, '#v-hud .v-hud-box > div:nth-child(4)');   /* "... der Kosinus" */
                    /* "Zieh die Ecke B nach außen": (4|3) to (8|6), along the line through A */
                    await dragTo(t, L(t, 5) - 0.2, 0, seg([4, 3], [8, 6]), 1400);
                    await pointOn(t, L(t, 6) + 0.6, '#v-hud .v-hud-box > div:nth-child(3)');   /* "die Verhältnisse bleiben gleich" */
                    await tick(t, L(t, 8) - 0.3, 't1-opt', 'Ähnliches Dreieck');   /* "Ist die Hypotenuse genau eins lang" */
                    await t.rest();
                },
            },
            {
                id: 's2', n: '02', title: 'Der Einheitskreis',
                async enter(t) { await tabNow(t, 'kreis'); },
                async run(t) {
                    begin(t, '02', 'Der Einheitskreis');
                    await tabTap(t, 'kreis');
                    const P = [Math.cos(rad(30)), Math.sin(rad(30))];
                    await pointW(t, L(t, 1) + 0.9, P);                            /* "Der Punkt P" */
                    await pointW(t, L(t, 2) + 0.3, [P[0] / 2, 0]);                /* "Kosinus nach rechts" */
                    await pointW(t, L(t, 2) + 1.5, [P[0], P[1] / 2]);             /* "Sinus nach oben" */
                    /* "größer als neunzig Grad": into the second quadrant, then the third */
                    await dragTo(t, L(t, 4) - 0.2, 0, arc([0, 0], 1, rad(30), rad(135)), 1200);
                    await dragTo(t, L(t, 5) - 0.2, 0, arc([0, 0], 1, rad(135), rad(225)), 1100);
                    await t.rest();
                },
            },
            {
                id: 's3', n: '03', title: 'Das Bogenmaß',
                async enter(t) { await tabNow(t, 'bogen'); },
                async run(t) {
                    begin(t, '03', 'Das Bogenmaß');
                    await tabTap(t, 'bogen');
                    await pointW(t, L(t, 1) + 0.6, [Math.cos(rad(30)), Math.sin(rad(30))]);   /* "als grünen Bogen" */
                    const one = await button(t, 't3-ang', '1 rad ≈ 57,3°');
                    await t.at(L(t, 3) - 0.3 - TAP_S);
                    if (one) await t.tap('lab', one);                            /* "gehört er zum Winkel eins" */
                    await pointW(t, L(t, 5) + 1.0, [1.26 * Math.cos(6), 1.26 * Math.sin(6)]);   /* "Gut sechs solche Stücke" */
                    await dragTo(t, L(t, 6) - 0.2, 0, arc([0, 0], 1, 1, TAU - 0.001), 1900);    /* "um den Kreis herum": 2π */
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Die Sinuskurve',
                async enter(t) { await tabNow(t, 'sinus'); },
                async run(t) {
                    begin(t, '04', 'Die Sinuskurve');
                    await tabTap(t, 'sinus');
                    await pointW(t, L(t, 1) + 1.0, [rad(30), 0]);                 /* "Den Bogen legen wir auf die x-Achse" */
                    await pointW(t, L(t, 2) + 1.4, [rad(60), Math.sin(rad(60)) / 2]);   /* "die Höhe von P" */
                    /* "Einmal ganz herum": P from 60° to 360°, the curve grows behind it */
                    await dragTo(t, L(t, 4) - 0.3, 0, arc(M, 1, rad(60), TAU), 5000);
                    await tick(t, L(t, 5) + 1.2, 't4-opt', 'Zweite Umdrehung');    /* "Nach zwei Pi beginnt alles von vorn" */
                    await tick(t, L(t, 6) - 0.1, 't4-opt', 'Ganze Kurve');         /* "Die zweite Welle ist eine genaue Kopie" */
                    await t.rest();
                },
            },
            {
                id: 's5', n: '05', title: 'Die Kosinuskurve',
                async enter(t) { await tabNow(t, 'kosinus'); },
                async run(t) {
                    begin(t, '05', 'Die Kosinuskurve');
                    await tabTap(t, 'kosinus');
                    await pointW(t, L(t, 0) + 1.3, [PI, -1]);                     /* "Die blaue Kurve ist der Kosinus" */
                    await pointW(t, L(t, 1) + 0.9, [M[0] + Math.cos(rad(60)) / 2, 0]);   /* "die x-Koordinate von P" */
                    await pointW(t, L(t, 2) + 1.0, [PI / 2, 1]);                  /* "wie der Sinus" - the faint orange curve */
                    await tick(t, L(t, 3) + 0.5, 't5-sh', 'sin(x + s)');          /* "Schieben wir den Sinus" */
                    await slideAt(t, L(t, 4) - 1.9, '#t5-sh input[type="range"]', 90, 1600);   /* s: 0° to 90° */
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Gleichungen',
                async enter(t) { await tabNow(t, 'gleichung'); },
                async run(t) {
                    begin(t, '06', 'Gleichungen');
                    await tabTap(t, 'gleichung');
                    await pointW(t, L(t, 1) + 1.2, [M[0] - 1.05, 0.5]);            /* "Die waagerechte Linie" */
                    await pointW(t, L(t, 2) + 0.2, [M[0] + Math.cos(rad(30)), 0.5]);    /* "bei dreißig Grad" */
                    await pointW(t, L(t, 3) + 0.5, [M[0] + Math.cos(rad(150)), 0.5]);   /* "und bei hundertfünfzig Grad" */
                    await pointRow(t, L(t, 4) + 0.9, 'Taschenrechner');  /* "Der Taschenrechner nennt nur die erste" */
                    await pointW(t, L(t, 5) + 1.0, [5 * PI / 6, 0.5]);             /* "die zweite findest du über die Symmetrie" */
                    /* "Liegt die Linie höher als eins": y₀ from ½ up to 1,2 - touching at 1, then nothing */
                    await dragTo(t, L(t, 7) - 0.2, 0, seg([0, 0.5], [0, 1.2]), 2000);
                    await t.rest();
                },
            },
            {
                id: 's7', n: '07', title: 'Vier Parameter', air: 2500,
                async enter(t) { await tabNow(t, 'parameter'); },
                async run(t) {
                    begin(t, '07', 'Vier Parameter');
                    await tabTap(t, 'parameter');
                    await slideAt(t, L(t, 1) + 0.2, SLIDER('t7-p', 0), 2, 1100);   /* "a streckt sie in die Höhe" */
                    await slideAt(t, L(t, 2) + 0.2, SLIDER('t7-p', 1), 2, 800);    /* "b staucht sie zusammen" */
                    await slideAt(t, L(t, 3) + 0.2, SLIDER('t7-p', 2), 3, 800);    /* "c schiebt sie zur Seite": π/4 */
                    await slideAt(t, L(t, 4) + 0.2, SLIDER('t7-p', 3), 0.5, 800);  /* "d hebt sie an" */
                    /* "Jetzt ein Rätsel": the target 1,5 · sin(x − π/2) − 1, made to order - then solved */
                    await rigRandom(t, [0.4, 0.1, 0.3, 0.78, 0.2]);
                    const quiz = await button(t, 't7-q', 'Neues Rätsel');
                    await t.at(L(t, 5) + 0.5 - TAP_S);
                    if (quiz) await t.tap('lab', quiz);
                    await slideAt(t, L(t, 6) + 1.4, SLIDER('t7-p', 0), 1.5, 600);  /* a */
                    await slideAt(t, null, SLIDER('t7-p', 2), 6, 700);             /* c = π/2 */
                    await slideAt(t, null, SLIDER('t7-p', 3), -1, 900);            /* d: "Treffer!" */
                    await t.rest();
                },
            },
            {
                id: 's8', n: '08', title: 'Tageslänge in Dresden',
                async enter(t) { await tabNow(t, 'modell'); },
                async run(t) {
                    begin(t, '08', 'Tageslänge in Dresden');
                    await tabTap(t, 'modell');
                    await pointW(t, L(t, 1) + 1.2, [166, 16.4]);                   /* "die Tageslänge in Dresden" - mid June */
                    await dragTo(t, L(t, 3) - 0.2, 0, seg([150, 14.5], [172, 16.6]), 1300);   /* "Sommeranfang": 21 June */
                    await dragTo(t, L(t, 4) - 0.2, 1, seg([320, 9], [355, 7.9]), 1300);       /* "Winteranfang": 21 December */
                    await pointRow(t, L(t, 4) + 0.9, 'Abweichung');      /* "Schon passt ein Sinus fast genau" */
                    await pointRow(t, L(t, 5) + 0.6, 'Amplitude');       /* "Amplitude, Periode und Mittellage" */
                    await t.rest();
                },
            },
            {
                id: 's9', n: '09', title: 'Der Tangens',
                async enter(t) { await tabNow(t, 'tangens'); },
                async run(t) {
                    begin(t, '09', 'Der Tangens');
                    await tabTap(t, 'tangens');
                    await pointW(t, L(t, 0) + 2.0, [M[0] + Math.cos(rad(40)), Math.sin(rad(40))]);   /* "der Strahl durch P" */
                    await pointW(t, L(t, 1) + 0.5, [M[0] + 1, Math.tan(rad(40))]);                    /* "im Punkt T" */
                    await dragTo(t, L(t, 3) + 1.4, 0, arc(M, 1, rad(40), rad(84)), 2600);  /* "Je näher P an neunzig Grad" */
                    await dragTo(t, L(t, 4) + 1.4, 0, arc(M, 1, rad(84), rad(90)), 700);   /* "Bei genau neunzig Grad" */
                    await pointW(t, L(t, 5) + 1.0, [PI / 2, 1.6]);                /* "eine Polstelle": the red dashed line */
                    await t.rest();
                },
            },
            {
                id: 's10', n: '10', title: 'Zwei Dreiecke',
                async enter(t) { await tabNow(t, 'saetze'); },
                async run(t) {
                    begin(t, '10', 'Zwei Dreiecke');
                    await tabTap(t, 'saetze');
                    await pointOn(t, L(t, 0) + 1.8, '#v-hud .v-hud-box');         /* "Sinussatz und Kosinussatz" */
                    /* "zwei Seiten und ein Winkel, der nicht zwischen ihnen liegt": the SSW case */
                    await tapOn(t, L(t, 2) + 0.3, '#t10-m .dropdown-trigger');
                    await tapOn(t, L(t, 2) + 1.4, '#t10-m .dropdown-option[data-id="ssw"]');
                    const Cc = [6 * Math.cos(rad(30)), 6 * Math.sin(rad(30))], r = Math.sqrt(3.6 * 3.6 - Cc[1] * Cc[1]);
                    await pointW(t, L(t, 3) + 0.9, Cc);                           /* "Der Kreis um C" */
                    await pointW(t, L(t, 4) + 0.3, [Cc[0] + r, 0]);               /* "zwei verschiedene Dreiecke": B₁ ... */
                    await pointW(t, L(t, 4) + 1.4, [Cc[0] - r, 0]);               /* ... and B₂ */
                    await slideAt(t, L(t, 6) - 1.4, '#t10-s input[type="range"]', 3, 1000);   /* "Wird a kürzer": 3 - one */
                    await slideAt(t, L(t, 7) - 1.1, '#t10-s input[type="range"]', 2.6, 700);  /* 2,6 - none */
                    await t.rest();
                },
            },
            {
                id: 's11', n: '11', title: 'Die Ableitung',
                async enter(t) { await tabNow(t, 'ableitung'); },
                async run(t) {
                    begin(t, '11', 'Die Ableitung');
                    await tabTap(t, 'ableitung');
                    /* "Fahr die Sinuskurve entlang": from 30° back to 0, then once to 2π - every step leaves its slope as a blue dot */
                    const along = (k) => { const x = k < 0.06 ? rad(30) * (1 - k / 0.06) : TAU * (k - 0.06) / 0.94; return [x, Math.sin(x)]; };
                    await dragTo(t, L(t, 3) - 0.3, 0, along, 6800);
                    await tick(t, L(t, 4) + 0.2, 't11-o', 'Ableitungskurve');       /* "den Kosinus" */
                    await pointOn(t, L(t, 5) + 1.0, '#tab-bar');                   /* "Elf Kapitel" */
                    await pointOn(t, L(t, 6) + 1.0, '#doc-ableitung .v-doc-card h3');   /* "Rechts ... die Theorie" */
                    await t.at(L(t, 7) - 1.5);
                    await docTo(t, '#doc-ableitung .v-tasks');
                    await pointOn(t, L(t, 7) + 0.6, '#doc-ableitung .v-tasks h3');  /* "darunter Aufgaben mit Lösungen" */
                    await t.rest();
                    t.hideCursor();
                    t.card(true);
                    await t.wait(2000);
                },
            },
        ],
    });
})();
