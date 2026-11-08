/* Ein Lehrbuch, gebaut für 49 Cent — the live tour through the book Mathematik, Berufliches Gymnasium 11 (HTML/buch/mathe11/).
 *
 * Doc, 03.11.2026: the deck decks/mathe11-lehrbuch.html tells how the book was made; the tour shows the book itself, the
 * way the Würfelspiel tour shows its lab ("So möchte ich das gerne haben"). Scene plan approved by Doc ("passt gut!"):
 * opening, contents, a chapter, a widget, a task, a self-test, the excursion, the labs, five languages, the print
 * edition, the close. Solita's text is videopipeline/mathe11-lehrbuch/narration.mjs (run1.mjs speaks it into
 * ~/Movies/videopipeline/mathe11-lehrbuch/); every tap, slide and page load lands on a line of hers (t.line(k)).
 *
 * The book is driven the way a reader drives it, without a change to the book: buttons are tapped, sliders moved
 * (t.slide), answers typed into the self-test. A link is never followed by the page itself: the tour taps it (the tap
 * is cancelled) and loads the target with t.load - a page that loads itself would come without the tour's shield.
 *
 * STORAGE: the frame is a data-device frame, so the book writes into a storage of its own (js/cyber-tour.js shield):
 * online the tour runs on docalvers.de, and the self-test it solves must not land among the viewer's solved ones.
 *
 * The book runs at 1360 px (data-width) and is zoomed to the window: the chapter's sidebar is part of the story, and
 * below 1100 px the book hides it.
 *
 * Every scene has enter(): a jump loads the scene's page and puts it where the scene begins.
 */
(function () {
    'use strict';

    const BOOK = '../buch/mathe11/';
    const CHAPTER = BOOK + 'lb3-3.html';
    const TAP_S = 0.62;                 // the cursor travels this long before a tap lands (cyber-tour's point)

    const ev = (t, fn, arg) => t.eval('lab', fn, arg);
    /* where Solita starts her k-th line in this scene (without a voice: a guess, so the scene still plays) */
    const L = (t, k) => t.line(k, 2.4 * k);

    /* the scene line; the title card goes */
    function begin(t, n, title) {
        t.caption(n, title);
        t.card(false);
    }

    /* ---- pages */
    /* a page of the book (or a lab), loaded by the tour, then held at an element: at once (enter, a fresh load) */
    async function open(t, url, sel, block) {
        await t.load('lab', url);
        await t.until(() => ev(t, () => document.readyState === 'complete' &&
            (!document.querySelector('.b-main') || !!document.querySelector('.katex'))), 15000);
        await ev(t, () => document.fonts.ready.then(() => true));
        await t.wait(400);                  // the widgets draw in their first frames
        if (sel) await ev(t, (a) => {
            const el = document.querySelector(a[0]);
            if (el) el.scrollIntoView({ block: a[1] || 'start', behavior: 'instant' });
        }, [sel, block]);
    }
    /* a glide to an element, landing at the given second */
    async function glideTo(t, sec, sel, block) {
        if (sec != null) await t.at(sec);
        const ms = t.scroll('lab', sel, block || 'center');
        await t.wait(ms + 80);
    }

    /* ---- pointing and tapping, landing at a second of the scene */
    async function pointOn(t, sec, sel) {
        if (sec != null) await t.at(sec - TAP_S);
        return t.point('lab', sel);
    }
    async function tapOn(t, sec, sel) {
        if (sec != null) await t.at(sec - TAP_S);
        return t.tap('lab', sel);
    }
    /* a link tapped without the page following it (target=_blank too): the tour decides what loads */
    async function tapStill(t, sec, sel) {
        await ev(t, (s) => {
            const el = document.querySelector(s);
            if (el) el.addEventListener('click', (e) => e.preventDefault(), { once: true, capture: true });
        }, sel);
        return tapOn(t, sec, sel);
    }
    /* ... and its target loaded in its place */
    async function follow(t, sec, sel, url, at, block) {
        await tapStill(t, sec, sel);
        await open(t, url, at, block);
    }

    /* ---- the book's own controls */
    const TOC = (id) => '.b-toc a[href="#' + id + '"]';
    /* the k-th slider of a widget */
    const slider = (t, widget, k) => ev(t, (a) =>
        document.querySelectorAll('[data-widget="' + a[0] + '"] .b-slider')[a[1]] || null, [widget, k]);
    async function slideAt(t, sec, el, to, ms) {
        if (!el) { t.log('kein Regler'); return; }
        if (sec != null) await t.at(sec - TAP_S);
        return t.slide('lab', el, to, ms);
    }
    /* the first task that has a tip, and its two buttons */
    const TASK = '.b-task:has(.b-hintbtn)';
    /* typing into a self-test field, one key after the other (the page reads it on "Prüfen") */
    async function type(t, sec, sel, text) {
        await tapOn(t, sec, sel);
        await ev(t, (s) => { const n = document.querySelector(s); n.value = ''; n.dispatchEvent(new Event('input', { bubbles: true })); }, sel);
        for (const c of text) {
            await t.wait(260);
            await ev(t, (a) => {
                const n = document.querySelector(a[0]);
                n.value += a[1];
                n.dispatchEvent(new Event('input', { bubbles: true }));
            }, [sel, c]);
        }
    }
    const CHECK = '#b-in-checkin-0';
    const CHECK_GO = CHECK + ' + .b-btn';
    /* a page of the print overview: it lives in a frame of its own inside the book page */
    const ovPage = (t, sel) => ev(t, (s) => {
        const f = document.querySelector('.b-ov iframe');
        const el = f && f.contentDocument && f.contentDocument.querySelector(s);
        if (!el) return null;
        const r = f.getBoundingClientRect(), q = el.getBoundingClientRect();
        return [r.left + q.left + q.width / 2, r.top + q.top + q.height / 2];
    }, sel);

    CyberTour.define({
        id: 'mathe11-lehrbuch',
        title: 'Ein Lehrbuch, gebaut für 49 Cent',
        chapter: 'Teil',
        /* the card title in two lines: in one it was wider than the link preview's picture (Doc, 08.11.2026: "gebaut") */
        card: { title: 'Ein Lehrbuch,\ngebaut für 49 Cent', sub: 'Mathematik · Berufliches Gymnasium · Klasse 11 – live im Buch' },
        /* the address as Solita says it, written back for the subtitles (the longer one first) */
        spelled: {
            'Dock Alvers Punkt D E, Schrägstrich Buch, Schrägstrich Mathe elf': 'docalvers.de/buch/mathe11',
            'Dock Alvers Punkt D E': 'docalvers.de',
        },

        /* the book's title page while the page loads */
        async prepare(t) {
            t.card(true);
            t.caption('', '');
            await open(t, BOOK + 'index.html', '#start');
            await t.wait(800);
        },

        scenes: [
            {
                id: 's0', n: '00', title: 'Ein Lehrbuch, gebaut für 49 Cent',
                async enter(t) { await open(t, BOOK + 'index.html', '#start'); },
                async run(t) {
                    begin(t, '00', 'Ein Lehrbuch, gebaut für 49 Cent');
                    await pointOn(t, L(t, 0) + 1.4, '.b-titel-art');            /* "Ein ganzes Lehrbuch Mathematik" */
                    await pointOn(t, L(t, 3) + 0.4, '.b-kino');                 /* "für neunundvierzig Cent" */
                    await pointOn(t, L(t, 5) + 0.6, '.b-kino');                 /* "erzählt die Präsentation hier oben" */
                    await t.rest();
                },
            },
            {
                id: 's1', n: '01', title: 'Elf Kapitel',
                async enter(t) { await open(t, BOOK + 'index.html', '#start'); },
                async run(t) {
                    begin(t, '01', 'Elf Kapitel');
                    await tapStill(t, L(t, 0) + 0.2, TOC('kapitel'));            /* "Elf Kapitel" */
                    await glideTo(t, null, '#kapitel', 'start');
                    await pointOn(t, L(t, 2) + 1.6, 'a.b-chap[href="lb2.html"] .b-chap-m');   /* "in welchem Monat" */
                    await glideTo(t, L(t, 3) + 1.0, 'a.b-chap[href="lb1.html"]');           /* "Eines fällt aus der Reihe" */
                    await pointOn(t, L(t, 4) + 0.9, 'a.b-chap[href="lb1.html"] .b-chap-k');   /* "die Nummer eins" */
                    await pointOn(t, L(t, 5) + 1.6, 'a.b-chap[href="lb1.html"] .b-chap-m');   /* "erst im April" */
                    await glideTo(t, L(t, 6), 'a.b-chap[href="lb3-3.html"]');
                    await follow(t, L(t, 6) + 2.2, 'a.b-chap[href="lb3-3.html"]', CHAPTER);  /* "Ich öffne mal ..." */
                    await t.rest();
                },
            },
            {
                id: 's2', n: '02', title: 'Ein Kapitel',
                async enter(t) { await open(t, CHAPTER); },
                async run(t) {
                    begin(t, '02', 'Ein Kapitel');
                    await pointOn(t, L(t, 0) + 1.2, '.b-hero-art');              /* "beginnt mit einem Auftakt" */
                    await pointOn(t, L(t, 2) + 0.8, TOC('auftakt'));             /* "Links steht der Weg" */
                    await pointOn(t, L(t, 3) + 0.4, TOC('erkundungen'));
                    await pointOn(t, L(t, 4) + 0.4, TOC('le2'));                 /* "drei Lerneinheiten" */
                    await pointOn(t, L(t, 5) + 0.3, TOC('wvv'));
                    await pointOn(t, L(t, 6) + 0.4, TOC('exkursion'));
                    await pointOn(t, L(t, 7) + 0.4, TOC('test'));
                    await glideTo(t, L(t, 8) + 0.2, '#le1 .b-merk');             /* "fasst ein Merke-Kasten ..." */
                    await pointOn(t, L(t, 8) + 3.6, '#le1 .b-merk .b-box-title');
                    await glideTo(t, L(t, 9) - 1.2, '#le1 .b-bsp');              /* "durchgerechnete Beispiele" */
                    await pointOn(t, null, '#le1 .b-bsp .b-box-title');
                    await t.rest();
                },
            },
            {
                id: 's3', n: '03', title: 'Widgets',
                /* the sliders at the top edge, not the widget in the middle: sliders and curve together are 450 px of the
                   book, which a 1710 x 1007 window shows only from the top (Doc, 03.11.2026, tour 03 · 0:08: "die Parabel
                   ist hier nicht wirklich vollständig zu sehen") */
                async enter(t) { await open(t, CHAPTER, '[data-widget="parabel"]', 'start'); },
                async run(t) {
                    begin(t, '03', 'Widgets');
                    await glideTo(t, null, '[data-widget="parabel"]', 'start');
                    await pointOn(t, L(t, 2) + 0.6, '[data-widget="parabel"] canvas');   /* "Parabel-Werkstatt" */
                    const a = await slider(t, 'parabel', 0);
                    await slideAt(t, L(t, 4) - 2.0, a, 2.5, 1500);               /* "Ich ziehe mal am Streckfaktor" */
                    await slideAt(t, L(t, 5) + 0.8, await slider(t, 'parabel', 1), 0, 600);   /* "den Scheitel nach oben": d */
                    await slideAt(t, null, await slider(t, 'parabel', 2), 2, 1300);            /* ... and e, to (0 | 2) */
                    await slideAt(t, L(t, 7) - 2.0, a, -1.5, 1500);              /* "ein negativer Streckfaktor" */
                    await t.rest();
                },
            },
            {
                id: 's4', n: '04', title: 'Aufgaben', air: 2500,
                async enter(t) { await open(t, CHAPTER, TASK, 'center'); },
                async run(t) {
                    begin(t, '04', 'Aufgaben');
                    await glideTo(t, null, TASK);
                    await pointOn(t, L(t, 0) + 0.8, TASK + ' .b-task-no');      /* "Dann die Aufgaben" */
                    await pointOn(t, L(t, 2) + 0.6, TASK + ' .b-lvl');          /* "in drei Stufen" */
                    await tapOn(t, L(t, 5) - 1.6, TASK + ' .b-hintbtn');        /* "holt sich erst einen Tipp" */
                    await tapOn(t, L(t, 6) + 1.3, TASK + ' button.b-btn:not(.b-hintbtn)');   /* "schaut in die Lösung" */
                    await pointOn(t, null, TASK + ' .b-sol');
                    await t.rest();
                },
            },
            {
                id: 's5', n: '05', title: 'Selbsttests',
                async enter(t) { await open(t, CHAPTER, '.b-check[data-check="checkin"]', 'center'); },
                async run(t) {
                    begin(t, '05', 'Selbsttests');
                    await glideTo(t, null, '.b-check[data-check="checkin"]');
                    await pointOn(t, L(t, 0) + 1.2, '.b-check[data-check="checkin"] .b-box-title');   /* "mit den Selbsttests" */
                    await pointOn(t, L(t, 2) + 0.8, '.b-check[data-check="checkin"] .b-q-text');      /* "minus vier zum Quadrat" */
                    await type(t, L(t, 3) + 0.6, CHECK, '-16');                  /* "Tippe ich minus sechzehn" */
                    await tapOn(t, L(t, 4) - 0.4, CHECK_GO);
                    await pointOn(t, L(t, 4) + 1.4, CHECK + ' ~ .b-fb');        /* "noch nicht" */
                    await type(t, L(t, 5) + 0.5, CHECK, '16');                   /* "Mit sechzehn" */
                    await tapOn(t, L(t, 6) - 0.3, CHECK_GO);                     /* "stimmt es" */
                    await pointOn(t, L(t, 7) + 0.6, '.b-check[data-check="checkin"] .b-check-score');
                    await t.rest();
                },
            },
            {
                id: 's6', n: '06', title: 'Exkursion',
                async enter(t) { await open(t, CHAPTER, '#exkursion', 'start'); },
                async run(t) {
                    begin(t, '06', 'Exkursion');
                    await tapStill(t, L(t, 0) + 1.2, TOC('exkursion'));          /* "einen Ausflug" */
                    await glideTo(t, null, '#exkursion', 'start');
                    await pointOn(t, L(t, 2) + 0.8, '#exkursion h2');            /* "Galileis Fallrinne" */
                    await pointOn(t, L(t, 4) + 1.2, '#exkursion figure img');    /* "eine schräge Rinne" */
                    await pointOn(t, L(t, 6) + 0.8, '#exkursion .b-row p:nth-of-type(1)');   /* "eins, drei, fünf, sieben" */
                    await pointOn(t, L(t, 7) + 0.6, '#exkursion .b-row p:nth-of-type(2)');   /* "Quadratzahlen" */
                    await t.rest();
                },
            },
            {
                id: 's7', n: '07', title: 'Labore',
                async enter(t) { await open(t, CHAPTER, '#erkundungen .b-lab', 'center'); },
                async run(t) {
                    begin(t, '07', 'Labore');
                    await glideTo(t, null, '#erkundungen .b-lab');
                    await pointOn(t, L(t, 1) + 1.4, '#erkundungen .b-lab');     /* "hier das Parabellabor" */
                    await follow(t, L(t, 2) - 1.6, '#erkundungen .b-lab', '../parabellabor.html');   /* "Ein Klick" */
                    await slideAt(t, L(t, 4) - 2.6, '#slider-d', 2, 1100);       /* "Ich verschiebe mal die Parabel" */
                    await slideAt(t, null, '#slider-e', -1.5, 900);
                    await t.rest();
                },
            },
            {
                id: 's8', n: '08', title: 'Fünf Sprachen',
                async enter(t) { await open(t, CHAPTER); },
                async run(t) {
                    begin(t, '08', 'Fünf Sprachen');
                    t.hideCursor();
                    await t.at(L(t, 1) - 0.2);
                    await open(t, '../buch/mathe11-en/lb3-3.html');               /* "auf Englisch" */
                    await t.at(L(t, 2) - 0.2);
                    await open(t, '../buch/mathe11-es/lb3-3.html');               /* "auf Spanisch" */
                    await t.at(L(t, 3) - 0.2);
                    await open(t, '../buch/mathe11-it/lb3-3.html');               /* "auf Italienisch" */
                    await t.at(L(t, 4) - 0.2);
                    await open(t, '../buch/mathe11-fr/lb3-3.html');               /* "und auf Französisch" */
                    await glideTo(t, L(t, 5), '[data-widget="parabel"]');        /* "Mit allen Widgets" */
                    await t.rest();
                },
            },
            {
                id: 's9', n: '09', title: 'Die Druckausgabe', air: 2000,
                async enter(t) { await open(t, CHAPTER); },
                async run(t) {
                    begin(t, '09', 'Die Druckausgabe');
                    await open(t, CHAPTER);
                    await pointOn(t, L(t, 1) + 1.4, 'a.b-pdfbtn');               /* "als PDF zum Drucken" */
                    await tapOn(t, L(t, 2) + 0.2, 'button.b-ovbtn:not(.b-pdfbtn)');   /* "Hundertdreiundachtzig Seiten" */
                    await t.until(() => ovPage(t, '.d-ov-cur'), 8000);
                    const xy = await ovPage(t, '.d-ov-cur');
                    await t.at(L(t, 3) + 0.4);
                    if (xy) await t.pointAt('lab', xy[0], xy[1]);                /* "Die QR-Codes auf den Seiten" */
                    await t.rest();
                },
            },
            {
                id: 's10', n: '10', title: 'Für euch',
                async enter(t) { await open(t, BOOK + 'index.html', '#start'); },
                async run(t) {
                    begin(t, '10', 'Für euch');
                    t.hideCursor();
                    await open(t, BOOK + 'index.html', '#start');
                    await pointOn(t, L(t, 4) + 0.6, '.b-titel-art');            /* "Ihr findet es auf ..." */
                    await t.rest();
                    t.hideCursor();
                    t.card(true);
                    await t.wait(2000);
                },
            },
        ],
    });
})();
