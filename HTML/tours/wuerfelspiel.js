/* Fünf von neun — the live tour through the Würfelspiel lab (Doc, 19.09.2026: "bau bitte das Kritiktool für das
 * Würfelspiel"; 18.09.: "das ganze Lab einmal durchgehen ... Kritik schon zum Lab geben, nicht nur zum Film").
 * The film's choreography (videopipeline/wuerfelspiel/run2.mjs, four takes) moved over scene by scene onto the
 * tour's API (js/cyber-tour.js); Solita speaks the film's voice (s1.mp3 ... s24.mp3 in
 * ~/Movies/videopipeline/wuerfelspiel/, served by tools/tourkritik.py). No server hooks: the lab keeps its
 * whole state in the page, nothing is written anywhere.
 *
 * What changed against the film, and why:
 *   - the lab runs at the size of Doc's window, coach box OPEN as a first visit shows it (the film collapsed
 *     it for 1280x720) - the review is about the lab the class sees
 *   - buttons are TAPPED with the tour's cursor where the film clicked them (roll, simulation, random, swap,
 *     error list, solution) - the review sees which control does what
 *   - canvas taps (a face of Mia's net, the arrow D -> A) go through t.tapAt at the place the lab's own hit
 *     list gives, converted with its VIEW - as run2 did, never guessed pixels
 *   - film time: run2 acted `atSec` after the scene mark, the voice came 0.5 s later (LEAD) - film() keeps that
 *   - every scene has enter(): a jump builds the lab's state directly (station, mode, dice) instead of
 *     replaying the minutes before it
 * Math.random is seeded as in the film, so every run rolls the same dice.
 */
(function () {
    'use strict';

    const LAB = '../wuerfelspiel.html?lang=de';
    const LEAD_S = 0.5;                 // the voice starts this long after the scene mark (cyber-tour's LEAD)
    const TAP_S = 0.62;                 // the cursor travels this long before a tap lands (cyber-tour's point)
    const SEED = 20260917;              // scene 1 rolls, as in the film
    const SEED_RANDOM = 4711;           // the "ZUFÄLLIG" pair in s18
    const MODE_LAB = '#ws-mode-slot .cyber-radio-wrapper:nth-child(2)';
    const errItem = (i) => '#ws-errs .cyber-radio-wrapper:nth-child(' + (i + 1) + ')';

    /* seconds after the film's scene mark (run2's atSec) */
    const film = (t, sec) => t.at(sec - LEAD_S);
    /* a tap that LANDS at the film's second: the cursor sets off a little earlier */
    async function tapOn(t, sec, sel) {
        await film(t, sec - TAP_S);
        return t.tap('lab', sel);
    }
    const ev = (t, fn, arg) => t.eval('lab', fn, arg);

    /* the chapter line, and the title card goes (after a jump prepare() has put it up again) */
    function begin(t, n, title) {
        t.caption(n, title);
        t.card(false);
        t.later(900, () => t.cardImage(false, false));
    }

    /* seeded Math.random in the lab's own realm (run2's SEED_JS) - runs inside the page, no closures */
    function seedRandom(seed) {
        let s = seed >>> 0;
        const next = () => {
            s = (s + 0x6D2B79F5) >>> 0;
            let t = s;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        window.__tourSeed = (n) => { s = n >>> 0; };
        Math.random = next;
    }

    /* the middle of a hit from the lab's own list, in the page's client coordinates */
    const hitXY = (t, pick) => ev(t, (pick) => {
        const r = document.getElementById('canvas').getBoundingClientRect();
        const h = pick === 'miaFace0' ? hits.filter((x) => x.w < 250)[6]      // stage hit first, A's six faces, then B's
                : pick === 'arrowBC' ? hits[hits.length - 3]                  // arrows come last: AB, BC, CD, DA
                : hits[hits.length - 1];
        return h ? [r.left + VIEW.ox + (h.x + h.w / 2) * VIEW.sc, r.top + VIEW.oy + (h.y + h.h / 2) * VIEW.sc] : null;
    }, pick);

    /* Mia with three fours and three sixes - what s17 taps together, set directly for a jump (from the deck's
       pair: a tap that went astray may have changed Lena's die instead) */
    const miaFair = (t) => ev(t, () => {
        setMode('labor');
        setPreset('deck');
        const b = S.lab.b;
        b.faces[b.faces.indexOf(4)] = 6;
        S.labPreset = 'eigene';
        onDiceChanged();
        setView('summe');
    });

    const station = (t, i) => ev(t, (i) => { if (S.mode !== 'rundgang') setMode('rundgang'); gotoStep(i); }, i);
    const setErr = (t, i) => ev(t, (i) => { S.err = i; refreshErrRadio(); render(); }, i);
    const nothing = async () => { /* the scene builds its own state at its start */ };

    CyberTour.define({
        id: 'wuerfelspiel',
        title: 'Fünf von neun',
        card: { title: 'Fünf von neun', sub: 'Das Würfelspiel-Lab – vom ersten Wurf bis zu Efrons Würfeln', img: 'wuerfelspiel.jpg' },
        // the subtitles write what is spelled for Solita's voice (narration.mjs, 17.09.: "Läbb" for the English "Lab")
        spelled: { 'Läbb': 'Lab', 'doc alvers punkt de': 'docalvers.de' },

        /* the lab, fresh, while the page loads: language and the coach box's state live in this origin's storage
           (the tour server's own - Doc's :8765 and docalvers.de keep theirs) */
        async prepare(t) {
            t.card(true);
            t.cardImage(true, false);
            t.caption('', '');
            try {
                localStorage.removeItem('cyber-lab-lang');
                Object.keys(localStorage).filter((k) => k.startsWith('coach-collapsed')).forEach((k) => localStorage.removeItem(k));
            } catch (e) { /* no storage */ }
            await t.load('lab', LAB);
            await t.until(() => ev(t, () => typeof S !== 'undefined' && !!document.getElementById('ws-roll')), 20000);
            ev(t, seedRandom, SEED);
            // the 3D dice come with a module (three.js); without WebGL the flat dice stay - the tour goes on
            await t.until(() => ev(t, () => !!(window.Dice3D && Dice3D.ok)), 8000)
                .catch((e) => { if (e.tourCancel) throw e; t.log('kein WebGL — die Würfel bleiben flach'); });
            await ev(t, () => document.fonts.ready.then(() => true));
            await t.wait(600);
        },

        scenes: [
            /* ------------------------------------------------ Rundgang: spielen, zählen, Baum (film take A) */
            {
                id: 's1', n: '01', title: 'Zwei Würfel, eine Frage',
                async run(t) {
                    begin(t, '01', 'Zwei Würfel, eine Frage');
                    await tapOn(t, 2.2, '#ws-roll');
                    await tapOn(t, t.cueEnd(0, 8.0), '#ws-roll');
                    await tapOn(t, t.cueEnd(1, 16.0), '#ws-roll');
                    await t.rest();
                },
            },
            {
                id: 's2', n: '02', title: 'Sechs Flächen, nicht drei Zahlen', enter: nothing,
                async run(t) {
                    station(t, 1);
                    begin(t, '02', 'Sechs Flächen, nicht drei Zahlen');
                    await tapOn(t, t.cueEnd(0, 14.0), '#ws-roll');
                    await t.rest();
                },
            },
            {
                id: 's3', n: '03', title: 'Zählen statt raten', enter: nothing,
                async run(t) {
                    ev(t, () => { if (S.mode !== 'rundgang') setMode('rundgang'); gotoStep(3); S.focus = 'A'; render(); });
                    begin(t, '03', 'Zählen statt raten');
                    await film(t, t.cueEnd(0, 11.1));
                    ev(t, () => { S.focus = 'B'; render(); });
                    await film(t, t.cueEnd(0, 11.1) + 7.0);
                    ev(t, () => { S.countHi = { A: null, B: 4 }; render(); });
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Zwei Stufen', enter: nothing,
                async run(t) {
                    station(t, 2);
                    begin(t, '04', 'Zwei Stufen');
                    await tapOn(t, t.cueEnd(0, 9.0), '#ws-roll');
                    await tapOn(t, t.cueEnd(1, 14.0), '#ws-roll');
                    await t.rest();
                },
            },
            {
                // the station opens with Mia's branches spread out, so the merge happens inside her first pause
                id: 's5', n: '05', title: 'Der wichtigste Trick', enter: nothing,
                async run(t) {
                    ev(t, () => {
                        if (S.mode !== 'rundgang') setMode('rundgang');
                        gotoStep(4);
                        S.merge = { die: 'B', grouped: false, u: 0, t0: 0, from: 0 };
                        render();
                    });
                    begin(t, '05', 'Der wichtigste Trick');
                    await film(t, t.cueEnd(0, 9.5));
                    ev(t, () => toggleMerge(true));
                    await film(t, t.cue(1, 19.0));
                    ev(t, () => { S.merge = { die: 'A', grouped: false, u: 0, t0: 0, from: 0 }; render(); });
                    await film(t, t.cueEnd(1, 20.0));
                    ev(t, () => toggleMerge(true));
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Stufe 1', enter: nothing,
                async run(t) {
                    station(t, 5);
                    begin(t, '06', 'Stufe 1');
                    await t.rest();
                },
            },
            {
                id: 's7', n: '07', title: 'An jedes Ende', enter: nothing,
                async run(t) {
                    station(t, 6);
                    begin(t, '07', 'An jedes Ende');
                    await t.rest();
                },
            },
            {
                id: 's8', n: '08', title: 'Die Pfadregel', enter: nothing,
                async run(t) {
                    ev(t, () => { if (S.mode !== 'rundgang') setMode('rundgang'); gotoStep(7); S.sel = 0; render(); });
                    begin(t, '08', 'Die Pfadregel');
                    await film(t, t.cueEnd(0, 24.0));
                    ev(t, () => { S.sel = 1; render(); });
                    await t.rest();
                },
            },
            {
                id: 's9', n: '09', title: 'Die Sieben schlägt die Sechs', enter: nothing,
                async run(t) {
                    ev(t, () => { if (S.mode !== 'rundgang') setMode('rundgang'); gotoStep(8); S.sel = 0; render(); });
                    begin(t, '09', 'Die Sieben schlägt die Sechs');
                    await film(t, t.cueEnd(0, 7.0));
                    ev(t, () => { S.sel = 2; render(); });
                    await film(t, t.cueEnd(0, 7.0) + 2.6);
                    ev(t, () => { S.sel = 4; render(); });
                    await film(t, t.cueEnd(1, 14.0));
                    ev(t, () => { S.sel = 5; render(); });
                    await t.rest();
                },
            },
            {
                id: 's10', n: '10', title: 'Die Summenregel', enter: nothing,
                async run(t) {
                    station(t, 9);
                    begin(t, '10', 'Die Summenregel');
                    await t.rest();
                },
            },
            {
                id: 's11', n: '11', title: 'Das Rezept', enter: nothing,
                async run(t) {
                    station(t, 11);
                    begin(t, '11', 'Das Rezept');
                    await film(t, t.cueEnd(0, 10.0));
                    for (let i = 0; i < 5; i++) {
                        ev(t, (i) => { S.recipeHi = i; render(); }, i);
                        await t.wait(1100);
                    }
                    await t.rest();
                },
            },
            {
                id: 's12', n: '12', title: 'Stimmt das wirklich?', enter: nothing,
                async run(t) {
                    station(t, 12);
                    begin(t, '12', 'Stimmt das wirklich?');
                    await tapOn(t, t.cueEnd(0, 5.0), '#ws-sim1');
                    await tapOn(t, t.cueEnd(1, 8.0), '#ws-sim100');
                    await tapOn(t, t.cueEnd(2, 12.0), '#ws-sim1000');
                    await tapOn(t, t.cueEnd(3, 16.0), '#ws-simrun');        // Dauerlauf
                    // the lab's simulation runs on the page's frames, not on the tour's clock: in a fast replay
                    // it is only switched on and off again
                    if (!t.fast) {
                        await t.until(() => ev(t, () => S.sim.n >= 200000), 30000)
                            .catch((e) => { if (e.tourCancel) throw e; t.log('Simulation: 200 000 nicht erreicht'); });
                    }
                    await t.tap('lab', '#ws-simrun');                       // anhalten
                    t.log('Simulation gestoppt bei ' + ev(t, () => S.sim.n) + ' Runden, ' +
                          ev(t, () => (S.sim.a / Math.max(1, S.sim.n)).toFixed(4)) + ' für Lena');
                    await t.rest();
                },
            },

            /* ------------------------------------------------------ Rundgang: die typischen Fehler (take B) */
            {
                id: 's13', n: '13', title: 'Fehler 1: die halbe Wahrheit', enter: nothing,
                async run(t) {
                    station(t, 10);
                    setErr(t, 0);
                    begin(t, '13', 'Fehler 1: die halbe Wahrheit');
                    await t.rest();
                },
            },
            {
                id: 's14', n: '14', title: 'Fehler 2: Wahrscheinlichkeit fünf',
                async enter(t) { station(t, 10); setErr(t, 0); },
                async run(t) {
                    begin(t, '14', 'Fehler 2: Wahrscheinlichkeit fünf');
                    await tapOn(t, 0.2, errItem(1));
                    await t.rest();
                },
            },
            {
                id: 's15', n: '15', title: 'Fehler 3: der vergessene Weg',
                async enter(t) { station(t, 10); setErr(t, 1); },
                async run(t) {
                    begin(t, '15', 'Fehler 3: der vergessene Weg');
                    await tapOn(t, 0.2, errItem(2));
                    await t.rest();
                },
            },
            {
                id: 's16', n: '16', title: 'Fehler 4 und 5',
                async enter(t) { station(t, 10); setErr(t, 2); },
                async run(t) {
                    begin(t, '16', 'Fehler 4 und 5');
                    await tapOn(t, 0.2, errItem(3));
                    await tapOn(t, t.cueEnd(0, 14.0), errItem(4));
                    await t.rest();
                },
            },

            /* ------------------------------------------------ Labor: eigene Würfel, normale Würfel, Efron (take C) */
            {
                id: 's17', n: '17', title: 'Eine Fläche, und das Spiel ist fair',
                async enter(t) { station(t, 10); setErr(t, 4); },
                async run(t) {
                    begin(t, '17', 'Eine Fläche, und das Spiel ist fair');
                    // "Mit der Taste M geht es ins Labor": the key itself, the switch it flips in view
                    await film(t, 2.4 - TAP_S);
                    const xy = await t.point('lab', MODE_LAB);
                    t.callout('Taste M', xy);
                    ev(t, () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true })));
                    t.later(1800, () => t.callout(null));
                    await film(t, t.cueEnd(0, 8.0));
                    ev(t, () => setView('netze'));
                    await t.wait(600);
                    const cell = hitXY(t, 'miaFace0');
                    if (cell) await t.tapAt('lab', cell[0], cell[1]);      // the number picker opens
                    else t.log('Mias Feld nicht in der Trefferliste');
                    await film(t, t.cue(1, 10.7) - TAP_S);                  // she says "wird eine Sechs"
                    if (t.$('lab', '#ws-pick:not([hidden]) button')) await t.tap('lab', '#ws-pick button:nth-child(7)');
                    await t.wait(300);
                    const mia = ev(t, () => S.lab.b.faces.slice().sort().join(','));
                    if (mia !== '4,4,4,6,6,6') {
                        t.log('Mias Würfel nach dem Tipp: ' + mia + ' — FALSCHES FELD, direkt gesetzt');
                        await miaFair(t);
                        ev(t, () => setView('netze'));
                    }
                    // what the one tap changed, in words on the picture (Doc's review 19.09., 18 · 0:02: "was meinst du mit
                    // eine einzige Fläche geändert und das Spiel ist fair?"): the face, the die, the result
                    if (cell) t.callout('aus 4 wird 6', await t.pointAt('lab', cell[0], cell[1]));
                    await t.at(t.line(3, t.cueEnd(1, 12.4)));               // "Mias Würfel hat jetzt dreimal die Vier ..."
                    t.callout('Mia: dreimal 4, dreimal 6', await t.point('lab', '#ws-dice'));
                    await film(t, t.cueEnd(2, 24.0));
                    t.callout(null);
                    ev(t, () => setView('summe'));
                    t.hideCursor();                                         // it stood on the Gegenprobe line
                    await t.at(t.line(5, t.dur - 3));                       // "Eine einzige Fläche geändert, und das Spiel ist fair."
                    t.callout('Lena 50 % · Mia 50 %: fair', await t.point('lab', '#ws-result'));
                    await t.rest();
                    t.callout(null);
                },
            },
            {
                id: 's18', n: '18', title: 'Tauschen und Zufall',
                async enter(t) { await miaFair(t); },
                async run(t) {
                    begin(t, '18', 'Tauschen und Zufall');
                    ev(t, (n) => window.__tourSeed(n), SEED_RANDOM);
                    await tapOn(t, 1.6, '#ws-random');
                    await tapOn(t, t.cueEnd(0, 8.0), '#ws-swap');
                    await t.rest();
                },
            },
            {
                id: 's19', n: '19', title: 'Gleiche Würfel, kein Halbe-halbe',
                async enter(t) { ev(t, () => { setMode('labor'); setView('summe'); }); },
                async run(t) {
                    begin(t, '19', 'Gleiche Würfel, kein Halbe-halbe');
                    await film(t, 1.6);
                    ev(t, () => setPreset('normal'));
                    await t.rest();
                },
            },
            {
                id: 's20', n: '20', title: 'Der Würfel-Kreis', enter: nothing,
                async run(t) {
                    begin(t, '20', 'Der Würfel-Kreis');
                    await film(t, 1.2);
                    ev(t, () => { setMode('rundgang'); gotoStep(13); S.efron = 'AB'; render(); });
                    await film(t, t.cueEnd(0, 8.0) + 2.6);
                    ev(t, () => { S.efron = 'BC'; render(); });
                    await film(t, t.cueEnd(0, 8.0) + 4.6);
                    ev(t, () => { S.efron = 'CD'; render(); });
                    await film(t, t.cueEnd(1, 18.0));
                    ev(t, () => { S.efron = 'DA'; render(); });
                    // "Wählst du C, nehme ich B." - the arrow that points at C, tapped: it comes from B (Doc's review
                    // 19.09., 20 · 0:40: "woher weiß sie, wenn ich C wähle, dass sie B nehmen muss?")
                    await t.at(t.line(-1, t.dur - 2) - TAP_S);
                    const bc = hitXY(t, 'arrowBC');
                    if (bc) t.callout('der Pfeil auf C kommt von B', await t.tapAt('lab', bc[0], bc[1]));
                    if (ev(t, () => S.efron) !== 'BC') {
                        t.log('Pfeil B → C nicht getroffen (' + ev(t, () => S.efron) + ') — direkt gesetzt');
                        ev(t, () => { S.efron = 'BC'; render(); });
                    }
                    await t.rest();
                    t.callout(null);
                },
            },
            {
                id: 's21', n: '21', title: 'Das Paradox nachgerechnet', enter: nothing,
                async run(t) {
                    begin(t, '21', 'Das Paradox nachgerechnet');
                    await film(t, 1.0);
                    ev(t, () => { setMode('labor'); setView('efron'); });
                    await t.wait(700);
                    const arrow = hitXY(t, 'lastArrow');
                    if (arrow) await t.tapAt('lab', arrow[0], arrow[1]);   // arrow D -> A loads the pair
                    if (ev(t, () => S.labPreset) !== 'efronDA') {
                        t.log('Efron-Paar im Labor: ' + ev(t, () => S.labPreset) + ' — direkt geladen');
                        ev(t, () => pickEfron('DA'));
                    }
                    await film(t, t.cueEnd(0, 6.0));
                    ev(t, () => { setView('pfad'); S.sel = 3; render(); });   // Weg (5|4)
                    await film(t, t.cueEnd(1, 16.0));
                    ev(t, () => setView('summe'));
                    await t.rest();
                },
            },

            /* --------------------------------------------- Rundgang: Zwillingsaufgabe, Lösung, Abbinder (take D) */
            {
                // the class thinks: the tour stops by itself instead of a fixed 5 s (Doc's review 19.09., 22 · 0:26: "wenn
                // man keinen Film daraus macht ... können wir ja die Demo anhalten")
                id: 's22', n: '22', title: 'Jetzt ihr', enter: nothing,
                async run(t) {
                    station(t, 14);
                    begin(t, '22', 'Jetzt ihr');
                    t.hideCursor();
                    await t.at(t.dur + 0.4);
                    t.hold('Denkpause — Leertaste zeigt die Lösung.');
                    await t.rest();
                },
            },
            {
                id: 's23', n: '23', title: 'Die Lösung',
                async enter(t) { station(t, 14); },
                async run(t) {
                    begin(t, '23', 'Die Lösung');
                    await tapOn(t, 0.4, '#ws-sol .cyber-checkbox-wrapper');     // LÖSUNG ZEIGEN
                    await t.rest();
                },
            },
            {
                id: 's24', n: '24', title: 'Abspann', enter: nothing,
                async run(t) {
                    station(t, 0);
                    begin(t, '24', 'Abspann');
                    await tapOn(t, 3.0, '#ws-roll');
                    await t.rest();
                    t.hideCursor();
                    t.card(true);
                    t.cardImage(true, true);
                    await t.wait(2500);
                },
            },
        ],
    });
})();
