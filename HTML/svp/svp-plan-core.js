// Stoffverteilungsplan renderer, part "core": group view (?g=), page head and foot, Lehrplan menu, table head.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        groupKey, inGroup, lbPdfLink, linkBadge
    });

    const tbody = P.tbody = document.querySelector('#plan-table tbody');
    if (!tbody || !window.PLAN || !window.BADGE) return false;

    /* --- Gruppen-Ansicht: eine Planseite, mehrere Lerngruppen (?g=) --------
       FOS 12 laeuft in fuenf Lerngruppen durch denselben Stoff, aber jede an
       ihren eigenen Terminen. Vier einzelne Dateien haetten vier getrennte
       Speicher (die Bearbeitungen haengen am PFAD der Seite), und derselbe
       Stoff muesste viermal gepflegt werden. Darum waehlt ?g= die Gruppe aus
       (Doc, 16.09.2026: "eher nein, KISS"): der Stoff bleibt EINER - alle
       Ansichten teilen sich Pfad und damit Speicher -, und pro Gruppe
       unterscheiden sich nur Termine, Klassenbuch-Ziel und Vortragsliste.
       Ohne ?g= bleibt die Seite genau wie bisher: alle Gruppen zusammen. */
    const groupSlug = P.groupSlug = (v) => String(v).replace(/[^A-Za-z0-9-]+/g, '_');
    const GROUP = P.GROUP = (function () {
        try { return new URLSearchParams(location.search).get('g') || ''; }
        catch (e) { return ''; }
    })();
    /* Vom Slug zurueck auf den Anzeigenamen: "FOG25-2_FOW25-2" -> "FOG25-2 + FOW25-2" */
    const GROUP_LABEL = P.GROUP_LABEL = GROUP.replace(/_/g, ' + ');
    /* Gehoert eine Untis-Stunde zur gewaehlten Gruppe? Gekoppelte Klassen stehen
       dort als "FOG25-2,FOW25-2", im Slug als "FOG25-2_FOW25-2" und im Live-Abruf
       als Array - auf dieselbe REIHENFOLGE kann man sich nirgends verlassen,
       also werden beide Seiten sortiert verglichen. */
    function groupKey(v) {
        return (Array.isArray(v) ? v : String(v || '').split(/[,_]/))
            .map(x => x.trim()).filter(Boolean).sort().join('_');
    }
    const GROUP_KEY = P.GROUP_KEY = groupKey(GROUP);
    function inGroup(klasse) { return !GROUP || groupKey(klasse) === GROUP_KEY; }

    /* Die Gruppe gehoert sichtbar in den Kopf - auch in den Ausdruck, wo die
       Auswahl (sie steht in .head-mid) wegfaellt. */
    if (GROUP) {
        document.body.classList.add('group-view');
        /* Die Ueberschrift nennt sonst alle Zuege des Plans ("Informatik ·
           FOG25 + FOS25 + FOW25") - in der Gruppen-Ansicht nennt sie die
           Gruppe (Doc, 16.09.2026: "den Header noch jeweils anpassen").
           Was vor dem Mittelpunkt steht, bleibt; dahinter stehen die Klassen
           DIESER Gruppe, und der Zug-Buchstabe behaelt seine Farbe (.zw in
           svp.css: G orange, S gruen, W rot). Ohne Mittelpunkt in der
           Ueberschrift bleibt sie unangetastet - dann ist sie kein Kopf
           dieser Bauart. */
        const h1 = document.querySelector('.page-head h1');
        if (h1 && h1.textContent.indexOf('\u00b7') > 0 && window.svpZweig) {
            svpZweig(h1, h1.textContent.split('\u00b7')[0] + '\u00b7 ' +
                GROUP.split('_').join(' + '));
        }
        document.title = document.title.replace(/\s*\|/, ' \u00b7 ' + GROUP_LABEL + ' |');
    }

    // Badge pills deep-link into the Lehrplan PDF (#page=N) when the page
    // provides LB_INFO with a page number for that type (rows + legend).
    function lbPdfLink(key) {
        const info = window.LB_INFO && window.LB_INFO[key];
        return (info && info.page && window.LB_INFO.pdf)
            ? window.LB_INFO.pdf + '#page=' + info.page : null;
    }

    function linkBadge(el, key) {
        const href = lbPdfLink(key);
        if (!href) return;
        el.classList.add('badge-link');
        el.title = 'Lehrplan (PDF) an dieser Stelle öffnen';
        el.addEventListener('click', function (e) {
            e.stopPropagation(); // keep the row's detail toggle untouched
            window.open(href, '_blank');
        });
    }

    // Material column (links to OneDrive slides etc.) is injected centrally
    // so the per-page table headers stay untouched.
    /* Die Werkzeugleiste gehoert direkt unter den Kopf, nicht zwischen die
       Lernbereich-Karten und die Tabelle — zentral umgehaengt, damit keine
       Plan-Seite angefasst werden muss. */
    (function liftToolbar() {
        const bar = document.querySelector('.toolbar');
        const cards = document.querySelector('.meta-cards');
        if (bar && cards && cards.parentNode) cards.parentNode.insertBefore(bar, cards);
    })();

    // Page footer: the usage hint and the holiday dates used to be copied into
    // each of the 17 plan pages by hand, which had drifted into four different
    // wordings and one stale holiday line. Both describe central behaviour and
    // central data, so they are built here; the page keeps only its own text.
    // Order on screen: usage hint, page text, holidays.
    // data-ferien="abi" on the footer stops the list after Easter — the Jgst. 13
    // plans end before Pfingsten.
    const FOOT_USAGE =
        'Wochenzeile anklicken \u2192 Stundenskizze ausklappen; beim Drucken werden alle Details ' +
        'ausgeklappt. \u201eBearbeiten\u201c macht Themen und Bullets editierbar (Speichern beim ' +
        'Klick auf \u201eFertig\u201c, lokal im Browser); \u201eZur\u00fccksetzen\u201c l\u00e4dt ' +
        'das Original.';

    const FERIEN_2026_27 = [
        'Herbst 12.\u201324.10.26',
        'Weihnachten 23.12.26\u201302.01.27',
        'Winter 08.\u201319.02.27',
        'Ostern 26.03.\u201302.04.27',
        'Pfingsten 07.05. + 15.\u201318.05.27',
        'Sommer ab 10.07.27'
    ];
    const FERIEN_BUSSTAG = 'Bu\u00df- und Bettag Mi 18.11.26 unterrichtsfrei';

    (function buildPageFoot() {
        const foot = document.querySelector('footer.page-foot');
        if (!foot) return;
        const bisOstern = foot.dataset.ferien === 'abi';
        const terms = (bisOstern ? FERIEN_2026_27.slice(0, 4) : FERIEN_2026_27)
            .concat(FERIEN_BUSSTAG);
        const ferien = 'Ferientermine Sachsen 2026/27 (SMK): ' + terms.join(' \u00b7 ') + '.';
        const own = ustdLang(foot.innerHTML.trim());
        foot.innerHTML = FOOT_USAGE + (own ? ' ' + own : '') + ' ' + ferien;
    })();

    /* Kopf und Werkzeugleiste bleiben beim Scrollen stehen, der Plan (Karten
       plus Tabelle) zieht darunter weg. Zentral verpackt — keine Plan-Seite
       muss dafuer angefasst werden. */
    (function stickHead() {
        const head = document.querySelector('header.page-head');
        if (!head || !head.parentNode) return;
        const bar2 = document.querySelector('.toolbar');
        const box = document.createElement('div');
        box.className = 'plan-sticky';
        head.parentNode.insertBefore(box, head);
        box.appendChild(head);
        if (bar2) box.appendChild(bar2);

        /* The table head sticks right below the bar, so it needs its height. */
        const sync = function () {
            document.documentElement.style.setProperty('--sticky-h', box.offsetHeight + 'px');
        };
        const mark = function () {
            box.classList.toggle('stuck', box.getBoundingClientRect().top <= 1);
        };
        sync(); mark();
        if (window.ResizeObserver) new ResizeObserver(sync).observe(box);
        window.addEventListener('resize', function () { sync(); mark(); });
        window.addEventListener('scroll', mark, { passive: true });
    })();

    /* Doc, 19.09.2026: "SVP weg und Eine Unterrichtsstunde pro Woche" - the
       subtitle no longer starts with "Stoffverteilungsplan" (the export head
       names it anyway) and spells the hours out. Central, like SW for "Nr.",
       so none of the 17 plan pages has to be touched. */
    /* Doc, 19.09.2026: "Ustd. -> immer Unterrichtsstunden" - the pages keep
       their short source text, what is shown is spelled out: cards, table
       head, footer and subtitle all run through here. */
    function ustdLang(s) {
        return String(s)
            .replace(/(\d+)\s*Ustd\.\/Woche/g, function (all, d) {
                return d + (d === '1' ? ' Unterrichtsstunde' : ' Unterrichtsstunden') + ' pro Woche';
            })
            .replace(/(\d+)(\s*)Ustd\./g, function (all, d, gap) {
                return d + (gap || ' ') + (d === '1' ? 'Unterrichtsstunde' : 'Unterrichtsstunden');
            })
            .replace(/Ustd\./g, 'Unterrichtsstunden');
    }
    function ustdLangIn(root) {
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
            if (n.data.indexOf('Ustd') !== -1) n.data = ustdLang(n.data);
        }
    }
    (function tidySubtitle() {
        const sub = document.querySelector('header.page-head .subtitle');
        if (!sub) return;
        const WORDS = ['', 'Eine', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht'];
        const walk = document.createTreeWalker(sub, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
            n.data = n.data
                .replace(/^\s*Stoffverteilungsplan\s*·\s*/, '')
                .replace(/(\d+)\s*Ustd\.\/Woche/, function (all, d) {
                    const k = Number(d);
                    return (WORDS[k] || d) + (k === 1 ? ' Unterrichtsstunde' : ' Unterrichtsstunden') + ' pro Woche';
                });
        }
        ustdLangIn(sub);
        document.querySelectorAll('.meta-card .vu').forEach(ustdLangIn);
    })();

    /* Doc, 19.09.2026: "oben steht Lehrplan. Mach daraus ein drop. wenn offen
       blende diese Zeile ein und zwar direkt unter Stoffverteilungsplan ... mach
       eine zusätzliche Kachel vor die LBs mit gesamter Lehrplan, idealer Weise
       mit Screenshot vom Cover". The Lernbereich cards move into the head, under
       the subtitle, and only show while "Lehrplan ▾" is open (key L). The PDF
       itself becomes the first card, with the cover of page 1 - rendered once
       into lehrplaene/covers/<same name>.jpg (pdftoppm, 180 px wide). The LB
       and bridge panels are inserted right after the grid further down, so
       they land in the same fold. Open or closed is remembered per page. */
    (function lehrplanDrop() {
        const head = document.querySelector('.plan-sticky header.page-head');
        const grid = document.querySelector('.meta-cards');
        const btn = head && [...head.querySelectorAll('.head-row button.action')]
            .find(function (b) { return /Lehrplan/i.test(b.textContent); });
        if (!head || !grid || !btn) return;
        const m = (btn.getAttribute('onclick') || '').match(/open\(\s*'([^']+\.pdf)'/);
        const pdf = m ? m[1] : ((window.LB_INFO && window.LB_INFO.pdf) || '');

        const fold = document.createElement('div');
        fold.className = 'lp-fold';
        fold.id = 'lp-fold';
        head.appendChild(fold);          /* the subtitle is the head's last line */
        fold.appendChild(grid);

        if (pdf) {
            const card = document.createElement('a');
            card.className = 'meta-card lp-card';
            card.href = pdf;
            card.target = '_blank';
            card.rel = 'noopener';
            card.title = 'Den ganzen Lehrplan (PDF) öffnen';
            const img = document.createElement('img');
            img.className = 'lp-cover';
            img.alt = '';
            img.src = pdf.replace(/([^/]+)\.pdf$/, 'covers/$1.jpg');
            img.addEventListener('error', function () { img.remove(); });
            const text = document.createElement('div');
            text.className = 'lp-text';
            text.innerHTML = '<div class="k c-bright">Lehrplan</div>'
                + '<div class="v">Gesamter Lehrplan</div><div class="vu">PDF</div>';
            card.appendChild(img);
            card.appendChild(text);
            grid.insertBefore(card, grid.firstChild);
        }

        btn.removeAttribute('onclick');
        btn.classList.add('lp-btn');
        btn.innerHTML = 'Lehrplan <span class="export-caret">▾</span>';
        btn.title = 'Lernbereiche und Lehrplan ein- oder ausblenden (L)';
        btn.setAttribute('aria-controls', 'lp-fold');

        const KEY = 'svp-lp-open:' + location.pathname;
        function setOpen(on) {
            document.body.classList.toggle('lp-open', on);
            btn.setAttribute('aria-expanded', on ? 'true' : 'false');
            try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { }
        }
        let open0 = false;
        try { open0 = localStorage.getItem(KEY) === '1'; } catch (e) { }
        setOpen(open0);
        btn.addEventListener('click', function () {
            setOpen(!document.body.classList.contains('lp-open'));
        });
        window.toggleLehrplan = function () { btn.click(); };
    })();

    const headRow = document.querySelector('#plan-table thead tr');
    if (headRow) {
        const matTh = document.createElement('th');
        matTh.textContent = 'Zusatzmaterial';
        headRow.appendChild(matTh);
        /* Leading column for the shift arrows — empty header, only visible
           while the shift mode is on (see setShiftMode). */
        const shTh = document.createElement('th');
        shTh.className = 'shift-col';
        headRow.insertBefore(shTh, headRow.firstChild);
        /* tag the Woche header so its column can shrink with its cells */
        [...headRow.children].forEach(function (th) {
            const t = th.textContent.trim();
            if (t === 'Nr.' || t === 'KW') th.classList.add('num-col');
            /* "Nr." zaehlt die Schulwochen - kurz "SW", die Langform steht im
               Tooltip (Doc, 07.09.2026). Zentral hier, damit alle 17 Plaene sie
               bekommen, ohne dass jede Seite angefasst werden muss. */
            if (t === 'Nr.') { th.textContent = 'SW'; th.title = 'Schulwoche'; }
            if (t === 'Woche') th.classList.add('date-col');
            /* Bemerkungen-Spalte entfaellt (Doc, 07.09.2026: "ganz raus") - sie war
               das Letzte, was Wochenzeilen noch mehrzeilig machte. Der Text bleibt in
               PLAN bzw. in den Overrides stehen, er wird nur nicht mehr angezeigt. */
            if (t === 'Bemerkungen') { th.remove(); return; }
            /* Spelled out first ("Unterrichts-stunden" over two lines), then Doc,
               19.09.2026: "hier doch Ustd." - the short form in the head, the
               long one in the tooltip. */
            if (/^Ustd/.test(t)) {
                th.classList.add('ustd-col');
                th.textContent = 'Ustd.';
                th.title = 'Unterrichtsstunden';
            }
            if (/^Thema/.test(t)) th.classList.add('topic-col');
        });
    }
});
