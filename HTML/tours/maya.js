/* Live tour "Maya" - the Drehbuch of tours/maya.html.
 *
 * Like kreisteilung.js this one does NOT come from a film: no take, no cue list. It is the walkthrough Doc wants
 * BEFORE a film is shot (18.09.2026: "erst das Lab kritisieren, dann drehen"), every scene shows one thing the lab
 * does. The voice is DOC's own (his clone, Doc 24.09.2026: "nimm mich"): videopipeline/maya/narration.json ->
 * voice_doc.py -> ~/Movies/videopipeline/maya/sN.mp3, and the second every line starts -> maya-times.js, so each
 * tap below lands on the word that names it (lines(sid)(k)).
 *
 * Space pauses, Enter records a remark (tools/tourkritik.py keeps them per scene and second).
 *
 * The lab's script is a classic top-level script, so its functions (layout, changed, setPlaces, turnFlow, ...)
 * and its state (digits, flow, task, placeCount, upright) are reachable through t.eval. Every scene has enter():
 * a jump builds the lab's state directly instead of replaying what came before.
 *
 * Laying a digit is a real drag: pointerdown on the panel cell, pointermoves along the way, pointerup on the
 * place - the lab's own endDrag() decides, so a refused digit (18 on the twenties place) is refused here too.
 */
(function () {
    'use strict';

    const LAB = '../maya.html';
    const TAP_S = 0.62;                 // the cursor travels this long before a tap lands (cyber-tour's point)

    const ev = (t, fn, arg) => t.eval('lab', fn, arg);
    /* a tap that LANDS at the given second: the cursor sets off a little earlier */
    async function tapOn(t, sec, sel) {
        await t.at(sec - TAP_S);
        return t.tap('lab', sel);
    }

    /* where Doc starts his k-th line in a scene - measured by videopipeline/maya/voice_doc.py (maya-times.js) */
    const lines = (sid) => (k) => ((window.MAYA_TIMES || {})[sid] || [])[k] ?? 2 * k;

    /* the gear in the rail opens the place values (a right click on the stage does the same) */
    async function gear(t, sec) {
        const sel = '#mini-rail .nav-btn[title="Stellenwerte"]';
        if (await ev(t, (sel) => !!document.querySelector(sel), sel)) return tapOn(t, sec, sel);
        await t.at(sec);
        await ev(t, () => openSystem());
    }

    /* the chapter line; the title card goes */
    function begin(t, n, title) {
        t.caption(n, title);
        t.card(false);
    }

    /* ---- the lab's state, set without a tap (for a jump into the middle of the tour) */

    /* the plain starting point: waagerecht, Kalender, four places, colours off, no popup, empty board, arrow up */
    const start = (t) => ev(t, () => {
        if (editing) endEdit(false);
        closeSystem();
        if (upright) document.querySelector('#maya-arrange input[value="flat"]').click();
        if (sysKey !== 'kalender') document.querySelector('#maya-system input[value="kalender"]').click();
        if (colorMode) { colorMode = false; store.set('colour', '0'); }
        setPlaces(4);
        task = null;
        digits = [0, 0, 0, 0, 0];
        blank = true;
        setFlow('up', true);
        changed();
    });
    /* a number on the board, the arrow up - as if it had been laid by hand */
    const lie = (t, n) => ev(t, (n) => {
        task = null;
        layout(n);
        setFlow('up', true);
        changed();
    }, n);

    /* ---- where things are, in the page's client coordinates */

    /* the middle of the panel cell of a digit, or of a place on the board */
    const cellXY = (t, digit) => ev(t, (d) => {
        const r = canvas.getBoundingClientRect(), h = palette.find((p) => p.digit === d);
        return h ? [r.left + h.x + h.w / 2, r.top + h.y + h.h / 2] : null;
    }, digit);
    const placeXY = (t, place) => ev(t, (k) => {
        const r = canvas.getBoundingClientRect(), h = cards.find((c) => c.place === k);
        return h ? [r.left + h.x + h.w / 2, r.top + h.y + h.h / 2] : null;
    }, place);
    const centerOf = (t, sel) => ev(t, (sel) => {
        const b = document.querySelector(sel).getBoundingClientRect();
        return [b.left + b.width / 2, b.top + b.height / 2];
    }, sel);

    /* the pointer events a real finger sends, straight onto the lab's canvas */
    const fire = (t, type, xy) => ev(t, (a) => {
        const o = { bubbles: true, cancelable: true, clientX: a.x, clientY: a.y, button: 0,
            buttons: a.type === 'pointerup' ? 0 : 1, pointerId: 1, pointerType: 'mouse', isPrimary: true };
        canvas.dispatchEvent(new PointerEvent(a.type, o));
    }, { type, x: xy[0], y: xy[1] });

    /* drag a digit out of the panel onto a place - lands (pointerup) at the given second */
    async function lay(t, sec, digit, place) {
        await t.at(sec - 2 * TAP_S - 0.3);
        const from = await cellXY(t, digit), to = await placeXY(t, place);
        if (!from || !to) return;
        await t.pointAt('lab', from[0], from[1]);
        await fire(t, 'pointerdown', from);
        const glide = t.pointAt('lab', to[0], to[1]);      // the cursor travels, the digit rides along
        const N = 12;
        for (let i = 1; i <= N; i++) {
            await t.wait(45);
            await fire(t, 'pointermove', [from[0] + (to[0] - from[0]) * i / N, from[1] + (to[1] - from[1]) * i / N]);
        }
        await glide;
        await fire(t, 'pointerup', to);
        await t.wait(250);
    }

    /* the digits of a number over the places, highest first - what has to be laid for it */
    const digitsOf = (t, n) => ev(t, (n) => {
        const v = sys().values, out = [];
        for (let i = v.length - 1; i >= 0; i--) { const d = Math.floor(n / v[i]); n -= d * v[i]; out.push([i, d]); }
        return out.filter((p, j) => p[1] > 0 || out.slice(0, j).some((q) => q[1] > 0));
    }, n);

    /* typing on the big number, one key after the other - Enter at enterSec */
    async function type(t, sec, text, enterSec) {
        await t.at(sec - TAP_S);
        const xy = await centerOf(t, '#maya-num');
        await t.tapAt('lab', xy[0], xy[1]);          // pointerdown opens the field
        await ev(t, () => { const n = document.getElementById('maya-num'); n.textContent = ''; renderTyped(); });
        for (const ch of text) {
            await t.wait(380);
            await ev(t, (ch) => {
                const n = document.getElementById('maya-num');
                n.textContent = n.textContent + ch;
                renderTyped();
            }, ch);
        }
        await t.at(enterSec);
        await ev(t, () => endEdit(true));           // Enter
    }

    CyberTour.define({
        id: 'maya',
        title: 'Maya-Zahlen',
        card: { title: 'Maya-Zahlen', sub: 'Punkte, Striche, eine Muschel – und die Zwanzig als Grundzahl' },
        /* Doc's head in the corner: 80 % of Solita's size in the films - his photo from ~/Movies/videopipeline/maya/ */
        avatar: { poster: '/__tour/audio/avatar.png', scale: 0.8, zoom: 1.15, y: 0.06 },   // the circle up, less sweater - no zoom (Doc, 25.09.2026)

        /* the lab, fresh, while the page loads: its settings live in this origin's storage (the tour server's
           own - Doc's :8765 and docalvers.de keep theirs) */
        async prepare(t) {
            t.card(true);
            t.caption('', '');
            try {
                localStorage.removeItem('cyber-lab-lang');
                Object.keys(localStorage).filter((k) => k.startsWith('maya.') || k.startsWith('coach-collapsed'))
                    .forEach((k) => localStorage.removeItem(k));
            } catch (e) { /* no storage */ }
            await t.load('lab', LAB);
            await t.until(() => ev(t, () => typeof changed === 'function' && palette.length === 20), 20000);
            await ev(t, () => document.fonts.ready.then(() => true));
            await t.wait(1600);                     // the branding settles (maya.html waits 1.5 s quiet)
        },

        scenes: [
            {
                id: 's0', n: '00', title: 'Ein leeres Brett',
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '00', 'Ein leeres Brett');
                    await start(t);         /* always from the plain lab - a run may follow a replay that left it hochkant */
                    const L = lines('s0');
                    await t.at(L(1) + 0.3);                 /* "Oben steht unsere Zahl" */
                    await t.point('lab', '#maya-head');
                    await t.rest();
                },
            },
            {
                id: 's1', n: '01', title: 'Die zwanzig Ziffern',
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '01', 'Die zwanzig Ziffern');
                    const L = lines('s1');
                    /* one, four, five, thirteen, nineteen, and the shell - each as Doc names it */
                    const shown = [1, 4, 5, 13, 19, 0];
                    for (let k = 0; k < shown.length; k++) {
                        await t.at(L(k + 1) - 0.4);
                        const xy = await cellXY(t, shown[k]);
                        if (xy) await t.pointAt('lab', xy[0], xy[1]);
                    }
                    await t.rest();
                },
            },
            {
                id: 's2', n: '02', title: 'Eine Ziffer legen',
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '02', 'Eine Ziffer legen');
                    const L = lines('s2');
                    await lay(t, L(1) + 1.2, 7, 0);          /* "Sieben auf die Einer" */
                    await t.rest();
                },
            },
            {
                id: 's3', n: '03', title: 'Die Zwanziger-Stelle',
                async enter(t) { await lie(t, 7); },
                async run(t) {
                    begin(t, '03', 'Die Zwanziger-Stelle');
                    const L = lines('s3');
                    await lay(t, L(1) + 1.0, 2, 1);          /* "Zwei Punkte dort": 47 */
                    await lay(t, L(2) + 1.6, 18, 1);         /* "Die Achtzehn passt hier aber nicht hin" - refused */
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Übertrag',
                async enter(t) { await lie(t, 47); },
                async run(t) {
                    begin(t, '04', 'Übertrag');
                    const L = lines('s4');
                    await lay(t, L(0) + 2.4, 17, 0);         /* "siebzehn auf die Einer": 57 */
                    const up = '#maya-head > .maya-spin:not(.left) .spin-up';
                    await tapOn(t, L(2) + 0.1, up);          /* 58 */
                    await tapOn(t, L(3) + 0.1, up);          /* 59 */
                    await tapOn(t, L(4) + 0.1, up);          /* 60 - twenty ones carry */
                    await t.rest();
                },
            },
            {
                id: 's5', n: '05', title: 'Eine Zahl eintippen',
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '05', 'Eine Zahl eintippen');
                    const L = lines('s5');
                    await type(t, L(1) - 0.5, '2026', L(1) + 2.4);   /* "Zweitausendsechsundzwanzig, Enter" */
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Der Pfeil',
                async enter(t) {
                    await start(t);
                    await ev(t, () => { layout(2026); setFlow('down', true); changed(); });
                },
                async run(t) {
                    begin(t, '06', 'Der Pfeil');
                    const L = lines('s6');
                    await t.at(0.6);
                    await t.point('lab', '#maya-link');      /* "Der Pfeil in der Mitte" */
                    await tapOn(t, L(1) + 0.5, '#maya-link'); /* "Ein Klick" - the answer goes, the number stays */
                    await tapOn(t, L(3) + 0.8, '#maya-link'); /* "Noch ein Klick" - it lays itself again */
                    await t.rest();
                },
            },
            {
                id: 's7', n: '07', title: 'Würfeln und legen', air: 2500,
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '07', 'Würfeln und legen');
                    const L = lines('s7');
                    await t.at(0.9 - TAP_S);
                    const die = await centerOf(t, '#maya-dice');
                    await t.tapAt('lab', die[0], die[1]);
                    /* no die (no WebGL) - a task all the same, so the scene still plays */
                    await t.wait(300);
                    if (!(await ev(t, () => !!task))) await ev(t, () => newTask());
                    const target = await ev(t, () => task.target);
                    const plan = await digitsOf(t, target);
                    let sec = L(2) + 1.0;                    /* "Stelle für Stelle, von oben nach unten" */
                    for (const [place, d] of plan) {
                        if (d > 0) await lay(t, sec, d, place);
                        sec += 2.4;
                    }
                    await t.rest();                          /* "Stimmt alles, wird die Zahl grün" */
                },
            },
            {
                id: 's8', n: '08', title: 'Wie viele Stellen',
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '08', 'Wie viele Stellen');
                    const L = lines('s8');
                    await type(t, 0.2, '47', L(1) + 0.4);    /* "Siebenundvierzig passt in zwei" */
                    const up = '#maya-places .spin-up', down = '#maya-places .spin-down';
                    await tapOn(t, L(2) + 2.0, down);        /* "nimmst du Stellen weg": three */
                    await tapOn(t, L(2) + 3.0, down);        /* two - 47 still fits */
                    await tapOn(t, L(3) + 0.6, up);          /* "oder gibst welche dazu" */
                    await tapOn(t, L(3) + 1.5, up);
                    await tapOn(t, L(3) + 2.4, up);          /* five: "Die fünfte hat ihre eigene Farbe" */
                    await t.rest();
                },
            },
            {
                id: 's9', n: '09', title: 'Kalender oder rein zwanzig', air: 2500,
                async enter(t) { await start(t); },
                async run(t) {
                    begin(t, '09', 'Kalender oder rein zwanzig');
                    const L = lines('s9');
                    await type(t, 0.3, '2026', 2.6);
                    await gear(t, L(2) + 0.8);                /* "Hinter dem Zahnrad" */
                    await tapOn(t, L(3) + 0.2, '#maya-system label:has(input[value="rein20"])');   /* "dieselben Zeichen, ein anderer Wert" */
                    await tapOn(t, L(4) + 0.2, '#maya-system label:has(input[value="kalender"])'); /* "Und wieder zurück" */
                    await tapOn(t, L(4) + 1.8, '#maya-dlg-close');
                    await t.rest();
                },
            },
            {
                id: 's10', n: '10', title: 'Hochkant',
                async enter(t) { await start(t); await lie(t, 2026); },
                async run(t) {
                    begin(t, '10', 'Hochkant');
                    const L = lines('s10');
                    await gear(t, L(0) + 1.8);
                    await tapOn(t, L(1) + 0.4, '#maya-arrange label:has(input[value="upright"])');  /* "Hochkant" */
                    await tapOn(t, L(1) + 1.6, '#maya-dlg-close');
                    await t.rest();
                },
            },
            {
                id: 's11', n: '11', title: 'Farben', air: 2500,
                async enter(t) {
                    await start(t);
                    await ev(t, () => document.querySelector('#maya-arrange input[value="upright"]').click());
                    await lie(t, 2026);
                },
                async run(t) {
                    begin(t, '11', 'Farben');
                    const L = lines('s11');
                    /* "Mit der Taste C": every place its own colour */
                    await t.at(L(0) + 1.3);
                    await ev(t, () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true })));
                    await t.rest();
                    t.hideCursor();
                    t.card(true);
                    await t.wait(2000);
                },
            },
        ],
    });
})();
