/* Live tour "Kreisteilung" - the Drehbuch of tours/kreisteilung.html.
 *
 * Unlike wuerfelspiel.js this one does NOT come from a film: there is no take, no voice, no cue list. It is the
 * silent walkthrough Doc wants BEFORE a film is shot (18.09.2026: "erst das Lab kritisieren, dann drehen") -
 * cyber-tour.js finds no tour.json for it and says so in the log, which is right and costs nothing.
 *
 * Therefore the timing is plain: t.at(sec) counts seconds inside the scene, and every scene leaves enough air to
 * look at the picture. Space pauses, Enter records a remark (tools/tourkritik.py keeps them per scene and second).
 *
 * Every scene has enter(): a jump builds the lab's state directly (n, the two positions, the four view switches)
 * instead of replaying what came before - so any scene can be reached on its own.
 */
(function () {
    'use strict';

    const LAB = '../kreisteilung.html';
    const TAP_S = 0.62;                 // the cursor travels this long before a tap lands (cyber-tour's point)

    const ev = (t, fn, arg) => t.eval('lab', fn, arg);
    /* a tap that LANDS at the given second: the cursor sets off a little earlier */
    async function tapOn(t, sec, sel) {
        await t.at(sec - TAP_S);
        return t.tap('lab', sel);
    }

    /* the chapter line; the title card goes */
    function begin(t, n, title) {
        t.caption(n, title);
        t.card(false);
    }

    /* the lab's own state, set without a tap - for a jump into the middle of the tour */
    const setN = (t, n) => ev(t, (n) => { setNAndSync(n); }, n);
    /* the four view switches, by their checkbox ids - click(), so the lab's own handler runs */
    const view = (t, want) => ev(t, (want) => {
        Object.keys(want).forEach(function (id) {
            const b = document.getElementById(id);
            if (b && b.checked !== want[id]) b.click();
        });
    }, want);
    const ALL_ON = { 'kt-fill': true, 'kt-chords-box': true, 'kt-cuts-box': true, 'kt-numbers': false };
    /* the plain starting point every scene may jump to: regular position, everything visible, no numbers */
    async function start(t, n) {
        await ev(t, () => { document.getElementById('kt-regular').click(); });
        await view(t, ALL_ON);
        await setN(t, n);
    }

    CyberTour.define({
        id: 'kreisteilung',
        title: 'Kreisteilung',
        card: { title: 'Kreisteilung', sub: 'Punkte auf dem Kreis, Sehnen dazwischen – und eine Folge, die lügt' },

        /* the lab, fresh, while the page loads: language and the coach box live in this origin's storage
           (the tour server's own - Doc's :8765 and docalvers.de keep theirs) */
        async prepare(t) {
            t.card(true);
            t.caption('', '');
            try {
                localStorage.removeItem('cyber-lab-lang');
                Object.keys(localStorage).filter((k) => k.startsWith('coach-collapsed')).forEach((k) => localStorage.removeItem(k));
            } catch (e) { /* no storage */ }
            await t.load('lab', LAB);
            await t.until(() => ev(t, () => typeof S !== 'undefined' && !!document.getElementById('kt-slider')), 20000);
            await ev(t, () => document.fonts.ready.then(() => true));
            await t.wait(600);
        },

        scenes: [
            {
                id: 's1', n: '01', title: 'Zwei Punkte, eine Sehne',
                async enter(t) { await start(t, 2); },
                async run(t) {
                    begin(t, '01', 'Zwei Punkte, eine Sehne');
                    await t.at(3.0);
                    await setN(t, 1);
                    await t.at(6.0);
                    await setN(t, 2);
                    await t.rest();
                },
            },
            {
                id: 's2', n: '02', title: 'Jedes Mal das Doppelte',
                async enter(t) { await start(t, 2); },
                async run(t) {
                    begin(t, '02', 'Jedes Mal das Doppelte');
                    /* 1, 2, 4, 8, 16 - the lie builds itself while you watch */
                    await t.at(2.5);
                    await setN(t, 3);
                    await t.at(6.0);
                    await setN(t, 4);
                    await t.at(10.0);
                    await setN(t, 5);
                    await t.rest();
                },
            },
            {
                id: 's3', n: '03', title: 'Und dann 31',
                async enter(t) { await start(t, 5); },
                async run(t) {
                    begin(t, '03', 'Und dann 31');
                    await t.at(3.0);
                    await setN(t, 6);        /* 32 would be the guess - it is 31 */
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Regelmäßig oder allgemein',
                async enter(t) { await start(t, 6); },
                async run(t) {
                    begin(t, '04', 'Regelmäßig oder allgemein');
                    /* regular: three chords meet in the centre, one face less. Nudged apart: the full 31 */
                    await tapOn(t, 3.5, '#kt-jitter');
                    await tapOn(t, 9.0, '#kt-regular');
                    await t.rest();
                },
            },
            {
                id: 's5', n: '05', title: 'Was man sieht',
                async enter(t) { await start(t, 6); },
                async run(t) {
                    begin(t, '05', 'Was man sieht');
                    await tapOn(t, 2.5, '#kt-fill');          /* faces off: only the chords are left */
                    await tapOn(t, 6.0, '#kt-cuts-box');      /* and the crossings go too */
                    await tapOn(t, 9.5, '#kt-cuts-box');
                    await tapOn(t, 12.0, '#kt-fill');
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Nummern',
                async enter(t) { await start(t, 6); },
                async run(t) {
                    begin(t, '06', 'Nummern');
                    await tapOn(t, 2.5, '#kt-numbers');       /* count them yourself - that is the point */
                    await t.at(9.0);
                    await setN(t, 7);
                    await t.rest();
                },
            },
            {
                id: 's7', n: '07', title: 'Abspielen',
                async enter(t) {
                    await start(t, 1);
                    await view(t, { 'kt-numbers': false });
                },
                async run(t) {
                    begin(t, '07', 'Abspielen');
                    await tapOn(t, 2.0, '#kt-play');
                    await t.rest();
                },
            },
            {
                id: 's8', n: '08', title: 'Die Formel',
                async enter(t) { await start(t, 8); },
                async run(t) {
                    begin(t, '08', 'Die Formel');
                    await t.at(3.0);
                    await setN(t, 10);
                    await t.at(8.0);
                    await setN(t, 12);
                    await t.rest();
                    t.hideCursor();
                    t.card(true);
                    await t.wait(2000);
                },
            },
        ],
    });
})();
