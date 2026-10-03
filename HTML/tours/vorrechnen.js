/* Vorrechnen - the live tour (Doc, 03.10.2026: "so eine Tour brauche ich ganz ähnlich wie die Klasse im Blick").
 * Made from mission-control.js. The plot: drehbuch/vorrechnen.html; Solita's words: videopipeline/vorrechnen/
 * narration.mjs (run1.mjs speaks them into ~/Movies/videopipeline/vorrechnen/, tools/tourkritik.py serves them).
 * Every tap lands on the line of hers that names it (t.line(k) = where her k-th subtitle line starts in her MP3).
 *
 *   left   the board on the beamer: vorrechnen.html in its display mode - only what mission control sends
 *   right  mission control: vorrechnen.html?steuerung, the full lab where Doc writes
 *   phone  buzzer.html, floating small in a corner; t.float(true) zooms it up for its scene
 *
 * In class the board opens mission control with window.open and each finds the other (steuerFenster, opener);
 * here both are frames side by side, so the tour hands each the other. The buzzer talks to a pretend class in this
 * browser (js/buzzer-demo-backend.js via js/tour-hook.js), locally and online alike: no tap of the tour may land in
 * the real tables, they feed Doc's Wiederholung. The class off stage presses through that backend.
 *
 * Stage 1 (03.10.2026): scenes 1-4 and 6-8; stage 2: 9-13 and 15. Open: scene 5 (drawing a name needs a demo class
 * on the device) and 14 (the board in the plan needs Doc's login) - both emergency brakes in the Drehbuch.
 *
 * Scene 11 writes with Doc's own hand: tours/vorrechnen-handschrift.json, recorded on the HP with
 * vorrechnen.html?aufnahme (03.10.2026), replayed by t.write at its own pace, scaled to this board's rows.
 */
(function () {
    'use strict';

    const TAP_S = 0.62;                  // the cursor travels this long before a tap lands (cyber-tour's point)
    const BOARD = '../vorrechnen.html?aufgaben=einmaleins';
    const ev = (t, frame, fn, arg) => t.eval(frame, fn, arg);
    /* where Solita starts her k-th line in this scene (without a voice: a guess, so the scene still plays) */
    const L = (t, k) => t.line(k, 2.4 * k);

    function begin(t, n, title) {
        t.caption(n, title);
        t.card(false);
    }
    async function tapOn(t, sec, frame, sel) {
        await t.at(sec - TAP_S);
        return t.tap(frame, sel);
    }
    async function pointOn(t, sec, frame, sel) {
        await t.at(sec - TAP_S);
        return t.point(frame, sel);
    }
    /* a place in a frame given as fractions of its window */
    async function pointRel(t, sec, frame, fx, fy) {
        await t.at(sec - TAP_S);
        const xy = ev(t, frame, (f) => [innerWidth * f[0], innerHeight * f[1]], [fx, fy]);
        return t.pointAt(frame, xy[0], xy[1]);
    }
    const code = (t) => ev(t, 'control', () => Buzzer.code());
    const backend = () => window.__tourBackend;
    const index = (t, slug) => ev(t, 'control', (s) => AUFGABEN.findIndex((a) => a[0] === s), slug);

    /* Solita's answer in her box (scene 12) - word for word what videopipeline/vorrechnen/narration.mjs s12 reads */
    const FRAGE = 'Warum darf ich 2^10 · 5^10 zusammenfassen?';
    const ANTWORT = 'Weil beide Potenzen denselben Exponenten haben: die $10$. Zehn Zweien mal zehn Fünfen kannst du zu ' +
        'zehn Paaren ordnen, jedes Paar $2 \\cdot 5$, also $10$. Allgemein gilt: $a^n \\cdot b^n = (a \\cdot b)^n$. ' +
        'Mit verschiedenen Exponenten ginge das nicht.';

    /* Doc's line k (0, 1, 2) of the recording, scaled to this board: the rows' height (ZEILE) sets the size, the line
       over the squares the height, the left edge keeps its share of the width - in mission control's client px */
    const hand = (t, k) => ev(t, 'control', (z) => {
        const c = canvas.getBoundingClientRect(), fl = z.flaeche;
        const linieAlt = Math.round(fl.h * 2 / 3 / fl.zeile) * fl.zeile, linie = papierGrenze(c.height);
        const s = ZEILE / fl.zeile, x0 = Math.min(...z.striche.flatMap((st) => st.points.map((p) => p.x)));
        const links = x0 / fl.w * c.width;
        return z.striche.map((st) => ({ width: st.width, points: st.points.map((p) => ({
            x: c.left + links + (p.x - x0) * s, y: c.top + linie + (p.y - linieAlt) * s, t: p.t })) }));
    }, t.data.hand.zeilen[k]);
    /* the pen's pressure as the board turns it into width (vorrechnen-zeichnen.js: 2.5 + pressure · 2.5) */
    const druck = (st) => Math.max(0.01, Math.min(1, (st.width - 2.5) / 2.5));
    async function schreibe(t, sec, k) {
        await t.at(sec - TAP_S);
        await t.write('control', hand(t, k), { speed: 1.3, gap: 500, pressure: druck });
        t.hideCursor();
    }
    /* the swipe up that sends the written line off (vorrechnen-zeichnen.js: two fingers up) */
    async function hoch(t, sec) {
        await t.at(sec);
        ev(t, 'control', () => rechenwegHoch());
    }
    /* a question typed into Solita's line, letter by letter */
    async function tippe(t, sec, text) {
        await t.at(sec);
        for (let i = 1; i <= text.length; i++) {
            ev(t, 'control', (v) => {
                const f = document.querySelector('#solita-schicht .sf-in');
                f.value = v;
                f.dispatchEvent(new Event('input', { bubbles: true }));
            }, text.slice(0, i));
            await t.wait(45);
        }
    }

    CyberTour.define({
        id: 'vorrechnen',
        title: 'Vorrechnen',
        // the stage as a still behind the title (Drehbuch scene 1) - also the link preview (tools/og-preview shoots the card)
        card: { title: 'Vorrechnen', sub: 'Die Klasse sagt, wo es hakt – anonym, Zeile für Zeile', img: '../resources/tour-vorrechnen.jpg' },

        async prepare(t) {
            // The pages' storage: their own, in memory, seeded here (js/tour-hook.js -> storageFor) - online the tour runs
            // on docalvers.de, the origin of Doc's real board, so it never reads or writes this browser's storage.
            // - the boards run at the frames' own size, not zoomed (data-width): vorrechnen.html lays itself out in vw/vh,
            //   which a zoomed page does not fill. A pane is narrower than the lab's 980 px - its "Bildschirm zu klein"
            //   (js/ui.js) is snoozed, and mission control's side panel is shut for room
            // - the board light, the tour around it dark (Doc, 03.10.2026, after a try: "besser mit dem dunklen Hintergrund
            //   und der weißen Rechenfläche, total cool"); ?dunkel keeps the dark board
            // - dev_access: Solita's box asks for a password before a question - 'tour' opens it, and the question goes to
            //   the pretend backend, never to the real function: no password of Doc's here
            // - solita_tts off: the tour's voice reads her answer, her box stays silent (else: "Stimme nicht erreichbar")
            const hell = !new URLSearchParams(location.search).has('dunkel');
            window.__tourBackend = BuzzerDemoBackend.create({ log: t.log, seed: {
                cyberLabScreenSnooze_980x620: String(Date.now() + 864e5), 'vorrechnen-seitenleiste-zu': '1',
                'vorrechnen-hell': hell ? '1' : '0', dev_access: 'tour', solita_tts: '0',
            } });
            t.card(true);
            t.cardImage(true, false);
            t.caption('', '');
            t.float(false);
            await Promise.all([t.load('board', BOARD), t.load('control', BOARD + '&steuerung')]);
            ev(t, 'board', () => { steuerFenster = window.parent.frames.control; anzeigeAn(); });
            ev(t, 'control', () => { window.opener = window.parent.frames.board; anzeigeSenden(); });
            // the class's written feedback is read with the teacher's session only (js/buzzer.js: Buzzer.texte) - here the
            // pretend backend answers, as for the Klasse-im-Blick tour's live dashboard
            ev(t, 'control', () => {
                window.svpAuth = Object.assign(window.svpAuth || {}, {
                    hasSession: () => true, whoami: () => 'Doc', api: (path) => window.parent.__tourBackend.api(path),
                });
            });
            t.data.hand = await (await fetch('vorrechnen-handschrift.json')).json();
            await t.until(() => t.$('control', '#schritt-hoch') && t.$('board', '#rechenweg-schicht .katex'), 15000);
            await t.wait(600);
        },

        scenes: [
            {
                id: 's1', n: '01', title: 'Vorrechnen',
                async run(t) {
                    t.caption('', '');
                    await t.at(L(t, 4) + 0.6);               /* "Diese Tour zeigt ...": the stage comes up */
                    t.card(false);
                    t.cardImage(false, false);
                    await t.rest();
                },
            },
            {
                id: 's2', n: '02', title: 'Zwei Bildschirme',
                async run(t) {
                    begin(t, '02', 'Zwei Bildschirme');
                    await pointOn(t, L(t, 2) + 0.2, 'board', '#rechenweg-schicht .katex');        /* "nur die Aufgabe" */
                    await pointOn(t, L(t, 3) + 0.4, 'control', '#rechenweg-schicht .katex');      /* "Rechts ist dein Laptop" */
                    await pointOn(t, L(t, 5) + 0.3, 'control', '#right-rail-inner');               /* "die Werkzeuge am Rand" */
                    await pointOn(t, L(t, 6) + 1.2, 'control', '#schritt-hinweis');                /* "in Grau, der nächste Schritt" */
                    await pointRel(t, L(t, 8) + 0.9, 'board', 0.45, 0.78);                         /* "nie zu Gesicht": empty there */
                    await t.rest();
                    t.hideCursor();
                },
            },
            {
                id: 's3', n: '03', title: 'Der Code an der Tafel',
                async run(t) {
                    begin(t, '03', 'Der Code an der Tafel');
                    await tapOn(t, L(t, 0) + 1.1, 'control', '#werkzeug-buzzer');                 /* "Ein Tipp am rechten Rand" */
                    await pointRel(t, L(t, 1) + 1.0, 'board', 0.5, 0.45);                          /* "vorne ein QR-Code" */
                    await t.at(L(t, 2) + 0.9);                                                     /* "Wer ihn mit dem Fon scannt" */
                    await t.load('phone', '../buzzer.html?c=' + code(t));
                    await pointOn(t, L(t, 3) + 1.2, 'phone', '#knopf');                            /* "einen einzigen großen Knopf" */
                    t.hideCursor();
                    await tapOn(t, L(t, 8) + 1.6, 'control', '#buzzer-overlay .cyber-modal-x');   /* after "Der Code gilt nur heute" */
                    t.hideCursor();
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Das Fon, ganz nah',
                async run(t) {
                    begin(t, '04', 'Das Fon, ganz nah');
                    await t.at(L(t, 0) + 0.4);
                    t.float(true);                                                                 /* "Schauen wir uns das Fon genauer an" */
                    await pointOn(t, L(t, 1) + 0.5, 'phone', '#knopf');                            /* "Oben der Knopf" */
                    await pointOn(t, L(t, 4) + 0.5, 'phone', '#tempo-knoepfe [data-art="schnell"]'); /* "zu schnell" */
                    await pointOn(t, L(t, 5) + 0.3, 'phone', '#tempo-knoepfe [data-art="langsam"]'); /* "oder zu langsam" */
                    await pointOn(t, L(t, 6) + 0.9, 'phone', '#text');                             /* "ein Feld für eigene Worte" */
                    await t.at(L(t, 8) + 0.8);                                                     /* "und keiner verrät, wer es war" */
                    t.hideCursor();
                    t.float(false);
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Aufwärmen',
                async run(t) {
                    begin(t, '06', 'Aufwärmen');
                    await tapOn(t, L(t, 3) - 0.9, 'control', '#schritt-hoch');                    /* "ein Tipp auf den Pfeil" */
                    await pointOn(t, L(t, 5) - 0.3, 'board', '#rechenweg-schicht');               /* "vorne landet er genauso" */
                    await tapOn(t, L(t, 6) + 0.2, 'control', '#tafel-pfeil-vor');                 /* "Eins plus eins." */
                    await tapOn(t, L(t, 6) + 1.7, 'control', '#schritt-hoch');
                    await tapOn(t, L(t, 7) + 0.2, 'control', '#tafel-pfeil-vor');                 /* "Eins durch eins." */
                    await tapOn(t, L(t, 7) + 1.7, 'control', '#schritt-hoch');
                    t.hideCursor();
                    await t.rest();
                },
            },
            {
                id: 's7', n: '07', title: 'Eins durch null',
                async run(t) {
                    begin(t, '07', 'Eins durch null');
                    await tapOn(t, L(t, 0) + 0.3, 'control', '#tafel-pfeil-vor');                 /* "Und jetzt: eins durch null" */
                    t.hideCursor();
                    await tapOn(t, L(t, 3) - 0.9, 'phone', '#knopf');                              /* "tippt jemand auf den Knopf" */
                    t.hideCursor();
                    const c = code(t);
                    await t.at(L(t, 5) + 0.2);                                                     /* "Und noch jemand," */
                    backend().press(c);
                    backend().press(c);
                    await t.at(L(t, 6) + 0.3);                                                     /* "und noch jemand." */
                    backend().press(c);
                    backend().press(c);
                    await pointOn(t, L(t, 7) + 1.4, 'control', '#buzz-aufgabe');                   /* "hinter der Aufgabe eine Zahl" */
                    await pointOn(t, L(t, 8) + 0.3, 'board', '#buzz-aufgabe');                     /* "und vorne auch" */
                    await t.rest();
                    t.hideCursor();
                },
            },
            {
                id: 's8', n: '08', title: 'Nochmal erklären',
                async run(t) {
                    begin(t, '08', 'Nochmal erklären');
                    await tapOn(t, L(t, 1) + 0.9, 'control', '#erklaerung-hut');                  /* "Der Doktorhut holt die Erklärung" */
                    /* "Zieh sie über die Linie": the box's dots go up until its top is two rows above the line */
                    await t.at(L(t, 3) + 0.3 - TAP_S);
                    const from = ev(t, 'control', () => {
                        const g = document.getElementById('erklaerung-griff').getBoundingClientRect();
                        return [g.left + g.width / 2, g.top + g.height / 2];
                    });
                    const to = ev(t, 'control', () => {
                        const c = container.getBoundingClientRect();
                        return Math.max(c.top + 2 * ZEILE, c.top + papierGrenze(c.height) - 2.5 * ZEILE + 8);
                    });
                    await t.drag('control', (k) => [from[0], from[1] + (to - from[1]) * (k * k * (3 - 2 * k))], 1600);
                    await pointOn(t, L(t, 4) + 0.5, 'board', '#erklaerung-schicht');              /* "dann steht sie auch vorne" */
                    t.hideCursor();
                    await t.at(L(t, 5) + 0.2);                                                     /* "Der Knopf auf dem Fon ist rot" */
                    t.float(true);
                    await tapOn(t, L(t, 6) + 1.0, 'phone', '#knopf');                              /* "Drücken, wenn verstanden" */
                    t.hideCursor();
                    await t.at(L(t, 7) - 0.2);                                                     /* "Und die Zahl geht wieder runter" */
                    t.float(false);
                    const c = code(t);
                    backend().understood(c);
                    await t.wait(400);
                    backend().understood(c);
                    await pointOn(t, L(t, 8) + 0.2, 'control', '#buzz-aufgabe');
                    await tapOn(t, L(t, 9) + 1.8, 'control', '#erklaerung-zu');                    /* the box goes, here and in front */
                    t.hideCursor();
                    await t.rest();
                },
            },
            {
                id: 's9', n: '09', title: 'Das Rechteck',
                async run(t) {
                    begin(t, '09', 'Das Rechteck');
                    await tapOn(t, L(t, 1) + 0.4, 'control', '#werkzeug-aufgaben');               /* "Unter Aufgaben" */
                    const i = index(t, 'qg-rechteck');
                    const tab = ev(t, 'control', (i) => {
                        const k = document.querySelector('.aufgabe-karte[data-i="' + i + '"]');
                        return k ? '#' + k.closest('.ak-seite').id.replace('ak-seite-', 'ak-tab-') : null;
                    }, i);
                    if (tab) await tapOn(t, L(t, 2) + 0.6, 'control', tab);                        /* "bis zu den nächsten Ferien" */
                    await t.at(L(t, 2) + 1.6);
                    ev(t, 'control', (i) => document.querySelector('.aufgabe-karte[data-i="' + i + '"]')
                        .scrollIntoView({ block: 'center', behavior: 'smooth' }), i);
                    await tapOn(t, L(t, 3) - 0.2, 'control', '.aufgabe-karte[data-i="' + i + '"]'); /* "Ein Rechteck ..." */
                    t.hideCursor();
                    for (const k of [5, 6, 7, 8, 9]) {                                             /* five steps, one per word */
                        await tapOn(t, L(t, k) + 0.4, 'control', '#schritt-hoch');
                    }
                    t.hideCursor();
                    await pointOn(t, L(t, 10) + 0.6, 'board', '#rechenweg-schicht');              /* "untereinander" */
                    t.hideCursor();
                    await t.rest();
                },
            },
            {
                id: 's10', n: '10', title: 'Zu schnell!',
                async run(t) {
                    begin(t, '10', 'Zu schnell!');
                    const c = code(t);
                    for (const d of [0.5, 1.0, 1.6]) { await t.at(L(t, 0) + d); backend().tempo(c, 'schnell'); }
                    await pointOn(t, L(t, 1) + 0.6, 'control', '#tempo-pille .gespiegelt');        /* "färbt sich der Läufer" */
                    await t.at(L(t, 3) - 1.0);
                    backend().text(c, 'Woher kommt die 5?');
                    await pointOn(t, L(t, 4) + 0.2, 'control', '#tempo-pille .tx-pille');          /* "Ein Kommentar ist gekommen" */
                    await tapOn(t, L(t, 5) + 0.5, 'control', '#tempo-pille .tx-pille');            /* "Ein Tipp," */
                    await pointOn(t, L(t, 7) - 0.2, 'control', '#tempo-pille .tx-box');            /* "Woher kommt die Fünf?" */
                    await pointRel(t, L(t, 9) + 0.6, 'board', 0.45, 0.78);                         /* "Vorne ... nichts zu sehen" */
                    t.hideCursor();
                    await tapOn(t, L(t, 9) + 2.4, 'control', '#tempo-pille .tx-pille');            /* the box folds away */
                    t.hideCursor();
                    await t.rest();
                },
            },
            {
                id: 's11', n: '11', title: 'Mit der Hand',
                async run(t) {
                    begin(t, '11', 'Mit der Hand');
                    await t.at(L(t, 0) + 0.3);                                                     /* "Und jetzt mit der Hand." */
                    ev(t, 'control', (i) => zeigeAufgabe(i), index(t, 't-zehner'));
                    await schreibe(t, L(t, 4) + 1.1, 0);                                           /* the first line, in Doc's hand */
                    await hoch(t, L(t, 5) + 0.5);                                                  /* "Ein Wisch nach oben" */
                    await pointOn(t, L(t, 9) + 0.3, 'board', '#rechenweg-schicht');               /* "Vorne fliegt sie genauso" */
                    t.hideCursor();
                    const c = code(t);
                    await t.at(L(t, 10) + 0.6);                                                    /* "drücken zwei" */
                    backend().press(c);
                    await t.wait(500);
                    backend().press(c);
                    await pointOn(t, L(t, 10) + 2.2, 'control', '#buzz-aufgabe');
                    await t.rest();
                    t.hideCursor();
                },
            },
            {
                id: 's12', n: '12', title: 'Frag Solita',
                async run(t) {
                    begin(t, '12', 'Frag Solita');
                    await tapOn(t, L(t, 0) + 1.2, 'control', '#solita-knopf');                     /* "sitze ich unten links" */
                    t.hideCursor();
                    await tippe(t, L(t, 1) + 0.6, FRAGE);                                          /* "Jemand fragt: ..." */
                    /* her answer stands in the box as the voice starts reading it */
                    const send = L(t, 3) - 0.4;
                    backend().solita(ANTWORT, Math.max(300, (L(t, 5) - send - TAP_S - 0.25) * 1000));
                    await tapOn(t, send, 'control', '#solita-schicht .sf-send');                   /* "Und ich antworte" */
                    await pointOn(t, L(t, 4) + 0.4, 'board', '#solita-schicht');                  /* "für alle sichtbar" */
                    t.hideCursor();
                    /* the box scrolls to its end by itself - its narrow column would hide the start she reads first */
                    const zeige = (bis) => ev(t, 'control', (bis) => {
                        const out = document.querySelector('#solita-schicht .sf-out'), a = out && out.querySelector('.sf-a:last-of-type');
                        if (!a) return;
                        out.scrollTop = bis ? out.scrollHeight : a.offsetTop - 8;
                        out.dataset.scroll = String(Math.round(out.scrollTop));    // the beamer's copy shows the same part
                    }, bis);
                    await t.at(L(t, 5) + 0.3);
                    zeige(false);
                    await t.at(L(t, 9) + 0.2);                                                     /* "Allgemein gilt" */
                    zeige(true);
                    const c = code(t);
                    await t.at(L(t, 13));                                                          /* "Die Zahl geht auf null" */
                    backend().understood(c);
                    await t.wait(300);
                    backend().understood(c);
                    /* her line and her answer go before the pen goes on (Doc, 03.10.2026: "die Antwort und die Fragebox von
                       ihr steht da, wenn die Aufgabe mit Stift vorgerechnet wird ... wieder wegmachen") - as Esc closes it;
                       a tap on her picture would switch to Doc */
                    await t.at(L(t, 14) - 0.3);                                                    /* "und es geht weiter" */
                    ev(t, 'control', () => solitaOffen(false));
                    await schreibe(t, L(t, 14) + 1.2, 1);
                    await hoch(t, L(t, 15) + 0.2);                                                 /* "Zehn hoch zehn ..." */
                    await schreibe(t, L(t, 15) + 1.4, 2);
                    await hoch(t, L(t, 16) - 0.2);                                                 /* "ist zehn." */
                    await t.rest();
                },
            },
            {
                id: 's13', n: '13', title: 'Wiederholung',
                async run(t) {
                    begin(t, '13', 'Wiederholung');
                    await tapOn(t, L(t, 2) + 0.4, 'control', '#werkzeug-aufgaben');               /* "Unter Aufgaben ..." */
                    await tapOn(t, L(t, 2) + 2.0, 'control', '#ak-tab-wv');                        /* "... den Reiter Wiederholung" */
                    await pointOn(t, L(t, 4) + 0.2, 'control', '#ak-seite-wv .wv-reihe');          /* "wie gut sie verstanden waren" */
                    const n = ev(t, 'control', () => document.querySelectorAll('#ak-seite-wv .wv-reihe').length);
                    if (n > 1) await tapOn(t, L(t, 5) + 1.4, 'control', '#ak-seite-wv .wv-reihe:last-of-type .wv-weg');   /* "das Kreuz" */
                    await tapOn(t, L(t, 6) + 1.8, 'control', '#aufgaben-overlay .cyber-modal-x');
                    t.hideCursor();
                    await t.rest();
                },
            },
            {
                id: 's15', n: '15', title: 'Kein Name, nur ein Code',
                async run(t) {
                    t.caption('', '');
                    t.hideCursor();
                    await t.at(L(t, 1) + 0.4);
                    t.card(true);                                                                  /* back to the title card */
                    t.cardImage(true, true);
                    await t.rest();
                },
            },
        ],
    });
})();
