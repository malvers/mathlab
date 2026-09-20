// Stoffverteilungsplan renderer, part "menus": export, Vortraege and group menus, print titles.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        exportTitle
    });

    // Password-gate the plain "Drucken" button too — centrally, overriding the
    // inline onclick="window.print()" every plan page ships with.
    (function gatePrintButton() {
        document.querySelectorAll('.toolbar button').forEach(function (b) {
            if (b.textContent.trim() === 'Drucken') {
                b.onclick = null; /* drop the inline handler */
                b.addEventListener('click', function () {
                    P.withEditGate(function () { window.print(); });
                });
            }
        });
    })();

    // Both output actions live in one "Export" dropdown instead of two loose
    // buttons. The existing buttons are moved into the menu, so their handlers
    // (and the edit gate on them) stay exactly as they are.
    (function buildExportMenu() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        const items = [...bar.querySelectorAll('button')].filter(function (b) {
            const t = b.textContent.trim();
            return t === 'Drucken' || t === 'Modulablaufplan' ||
                   t === 'Stoffverteilungsplan';
        });
        if (!items.length) return;

        const drop = document.createElement('div');
        drop.className = 'export-drop';
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'action export-toggle';
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = 'Export <span class="export-caret">▾</span>';
        const menu = document.createElement('div');
        menu.className = 'export-menu';
        menu.hidden = true;

        bar.insertBefore(drop, items[0]);
        items.forEach(function (b) {
            b.classList.add('export-item');
            /* the print dialog is also the way to a PDF — say so, the pages
               themselves keep their plain "Drucken" markup */
            if (b.textContent.trim() === 'Drucken') b.textContent = 'Drucken / PDF';
            menu.appendChild(b);
        });
        drop.appendChild(toggle);
        drop.appendChild(menu);

        function open(on) {
            menu.hidden = !on;
            toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
            toggle.classList.toggle('on', !!on);
        }
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            open(menu.hidden);
        });
        menu.addEventListener('click', function () { open(false); });
        document.addEventListener('click', function (e) {
            if (!drop.contains(e.target)) open(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') open(false);
        });
    })();

    /* Der Vortrags-Knopf als Dropdown, wenn ein Plan mehrere Lerngruppen hat.
       FOS 12 laeuft in fuenf Gruppen durch denselben Stoff - die Themenliste ist
       eine, die NAMEN haengen an der Gruppe. Statt fuenf Knoepfen also einer mit
       Auswahl (Doc, 01.09.2026). Die Gruppen kommen aus svp-map.json, damit
       es keine zweite, von Hand gepflegte Liste gibt. Aussehen und Verhalten
       teilt er sich mit dem Export-Menue. */
    /* svp-map.json wird von zwei Menues gelesen (Vortraege und Gruppenwahl) -
       geholt wird sie trotzdem nur einmal. */
    let svpMapPromise = null;
    function planMapEntry(planPage) {
        if (!svpMapPromise) {
            svpMapPromise = fetch(P.SVP_DIR + 'svp-map.json', { cache: 'no-store' })
                .then(res => (res.ok ? res.json() : null))
                .catch(() => null);
        }
        return svpMapPromise.then(map =>
            (map && (map.pages || []).find(p => planPage.endsWith(p.page))) || null);
    }

    (function buildVortraegeMenu() {
        const btn = document.querySelector('button[data-groups]');
        if (!btn) return;
        const src = btn.dataset.groups;
        const target = btn.dataset.href;
        if (!src || !target) return;
        const slug = P.groupSlug;
        /* data-groups nennt den Plan ("fos12.untis.json"); die Gruppen selbst stehen
           seit dem 10.09.2026 in svp-map.json - nur Klassenkuerzel, deshalb weiter
           oeffentlich. Termine und Stundeninhalte liegen in Supabase hinter dem Login. */
        const planPage = new URL(src.replace(/\.untis\.json$/, '.html'), location.href).pathname;

        /* In der Gruppen-Ansicht braucht es kein Menue mehr: der Knopf geht
           direkt auf die Vortragsliste DIESER Gruppe. */
        if (P.GROUP) {
            btn.title = 'Vortragsthemen und Namen der Gruppe ' + P.GROUP_LABEL;
            btn.setAttribute('onclick', '');
            btn.onclick = () => { location.href = target + '?g=' + encodeURIComponent(P.GROUP); };
            return;
        }

        planMapEntry(planPage)
            .then(entry => {
                if (!entry || !entry.groups) return;              /* keine Gruppen: Knopf bleibt Knopf */
                const seen = new Set(entry.groups);
                if (seen.size < 2) return;                        /* eine Gruppe braucht kein Menue */

                const drop = document.createElement('div');
                drop.className = 'export-drop';
                const toggle = document.createElement('button');
                toggle.type = 'button';
                toggle.className = 'action export-toggle';
                toggle.title = btn.title || '';
                toggle.setAttribute('aria-haspopup', 'true');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.innerHTML = 'Vortr&auml;ge <span class="export-caret">▾</span>';
                const menu = document.createElement('div');
                menu.className = 'export-menu';
                menu.hidden = true;

                for (const g of [...seen].sort()) {
                    const item = document.createElement('button');
                    item.type = 'button';
                    item.className = 'action secondary export-item';
                    item.textContent = g.replace(/,/g, ' + ');
                    item.title = 'Vortragsthemen und Namen der Gruppe ' + g.replace(/,/g, ' + ');
                    item.addEventListener('click', () => {
                        location.href = target + '?g=' + encodeURIComponent(slug(g));
                    });
                    menu.appendChild(item);
                }

                btn.parentNode.insertBefore(drop, btn);
                btn.remove();
                drop.appendChild(toggle);
                drop.appendChild(menu);

                function open(on) {
                    menu.hidden = !on;
                    toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
                    toggle.classList.toggle('on', !!on);
                }
                toggle.addEventListener('click', (e) => { e.stopPropagation(); open(menu.hidden); });
                menu.addEventListener('click', () => open(false));
                document.addEventListener('click', (e) => { if (!drop.contains(e.target)) open(false); });
                document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
            })
            .catch(() => { /* offline: der einfache Knopf bleibt stehen */ });
    })();

    /* Die Gruppenwahl: derselbe Knopf mit Auswahl wie das Export- und das
       Vortragsmenue, damit die Seite eine Sprache spricht. Sie erscheint von
       allein auf jedem Plan, den mehr als eine Lerngruppe teilt - die Liste
       kommt aus svp-map.json, es gibt also keine zweite von Hand gepflegte.
       Eine gemischte Ansicht gibt es seit dem 20.09.2026 nicht mehr - die
       Seite zeigt immer genau eine Gruppe. */
    (function buildGroupMenu() {
        const mid = document.querySelector('.page-head .head-row .head-mid');
        if (!mid) return;

        const urlFor = (g) => {
            const u = new URL(location.href);
            if (g) u.searchParams.set('g', P.groupSlug(g)); else u.searchParams.delete('g');
            /* Ein ?kw= aus dem Stundenplan zeigt auf EINE Woche - beim Wechsel
               der Gruppe waere es ein Sprung an die falsche Stelle. */
            u.searchParams.delete('kw');
            return u.pathname + (u.search || '') + u.hash;
        };

        planMapEntry(location.pathname).then(entry => {
            const groups = entry && entry.groups ? [...new Set(entry.groups)].sort() : [];
            if (groups.length < 2) return;               /* eine Gruppe braucht keine Wahl */

            /* Die gemischte Ansicht gibt es nicht mehr (Doc, 20.09.2026: "nimm
               die gemischte Gruppe ganz raus generell"). Sie warf die Termine
               aller fuenf Lerngruppen in eine Spalte, und jede Gruppe kommt an
               ihrem eigenen Tag - der gemeinsame Plan war ein Plan von
               niemandem. Ohne ?g= springt die Seite deshalb auf die zuletzt
               gewaehlte Gruppe, sonst auf die erste. Ein ?kw= aus dem
               Stundenplan bleibt dabei stehen: es zeigt auf eine Woche, nicht
               auf eine Gruppe. */
            const LAST_KEY = 'svp-group:' + location.pathname;
            if (!P.GROUP) {
                let last = '';
                try { last = localStorage.getItem(LAST_KEY) || ''; } catch (e) { }
                const pick = groups.find(g => P.groupSlug(g) === last) || groups[0];
                const u = new URL(location.href);
                u.searchParams.set('g', P.groupSlug(pick));
                location.replace(u.pathname + (u.search || '') + u.hash);
                return;
            }
            try { localStorage.setItem(LAST_KEY, P.GROUP); } catch (e) { }

            const drop = document.createElement('div');
            drop.className = 'export-drop group-drop';
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'action export-toggle' + (P.GROUP ? ' on-group' : '');
            toggle.title = 'Den Plan auf eine Lerngruppe einstellen';
            toggle.setAttribute('aria-haspopup', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            /* "Gruppen", nicht "Alle Gruppen": der Kopf steht sonst auf zwei
               Zeilen (Doc, 16.09.2026: "bitte auf eine Zeile"). Gemessen bei
               1200 px Inhaltsbreite - der Titel mit allen drei Zuegen braucht
               679 px, und mit dem laengeren Wort fehlten 41 px. */
            toggle.innerHTML = (P.GROUP ? P.GROUP_LABEL : 'Gruppen') +
                ' <span class="export-caret">\u25be</span>';

            const menu = document.createElement('div');
            menu.className = 'export-menu';
            menu.hidden = true;

            const add = (label, g) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'action secondary export-item';
                item.textContent = label;
                if (P.groupSlug(g || '') === P.GROUP) item.classList.add('is-current');
                item.addEventListener('click', () => { location.href = urlFor(g); });
                menu.appendChild(item);
            };
            for (const g of groups) add(g.replace(/,/g, ' + '), g);

            /* Die Gruppenwahl steht nicht mehr im Kopf (Doc, 20.09.2026: "das
               bitte auch raus (nicht zeigen)"): man kommt ueber die
               Gruppenpillen der Quick-Nav ohnehin direkt in die richtige
               Ansicht. Gebaut wird sie trotzdem - sie traegt die Umleitung auf
               die zuletzt gewaehlte Gruppe und den gemerkten Stand. */
            drop.style.display = 'none';
            mid.insertBefore(drop, mid.firstChild);
            drop.appendChild(toggle);
            drop.appendChild(menu);

            function open(on) {
                menu.hidden = !on;
                toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
                toggle.classList.toggle('on', !!on);
            }
            toggle.addEventListener('click', (e) => { e.stopPropagation(); open(menu.hidden); });
            menu.addEventListener('click', () => open(false));
            document.addEventListener('click', (e) => { if (!drop.contains(e.target)) open(false); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false); });
        });
    })();

    // ?map — on-screen preview of the form (also what headless print uses).
    if (/[?&]map\b/.test(location.search)) {
        P.buildMap(true);
        document.body.classList.add('map-print', 'map-preview');
        document.title = P.mapTitle(); /* also names the PDF in headless print */
    }

    // ?form — on-screen preview of the campus form (same document as print).
    if (/[?&]form\b/.test(location.search)) {
        P.buildForm(true);
        document.body.classList.add('form-print', 'form-preview');
        document.title = P.formTitle();
    }

    // The PDF file name comes from document.title, so swap in a clean one for
    // the duration of the print: "SVP Informatik OS Kl 9 SJ 2026-27".
    // Schulform abbreviations are the ones the Lehrpläne use (OS/BGY/FOS).
    const SHORT = [
        [/Berufliches Gymnasium/g, 'BGY'],
        [/Fachoberschule/g, 'FOS'],
        [/Oberschule/g, 'OS'],
        [/Jahrgangsstufe/g, 'Jgst'],
        [/Klassenstufe/g, 'Kl'],
        [/Klasse/g, 'Kl']
    ];

    function exportTitle() {
        const h1 = document.querySelector('h1');
        let name = h1 ? h1.textContent : 'Stoffverteilungsplan';
        for (const [re, rep] of SHORT) name = name.replace(re, rep);
        name = name.replace(/·/g, ' ').replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
        return 'SVP ' + name + ' SJ 2026-27';
    }

    let pageTitle = document.title;

    window.addEventListener('beforeprint', function () {
        pageTitle = document.title;
        if (P.mapMode) {
            P.buildMap();
            document.body.classList.add('map-print');
            document.title = P.mapTitle();
        } else if (P.formMode) {
            P.buildForm();
            document.body.classList.add('form-print');
            document.title = P.formTitle();
        } else {
            P.buildExport();
            document.title = exportTitle();
        }
    });

    // Drop the export again afterwards — the live page keeps a light DOM.
    window.addEventListener('afterprint', function () {
        document.title = pageTitle;
        if (!document.body.classList.contains('map-preview')) {
            document.body.classList.remove('map-print');
            const mp = document.getElementById('svp-map');
            if (mp) mp.remove();
        }
        if (!document.body.classList.contains('form-preview')) {
            document.body.classList.remove('form-print');
            const fp = document.getElementById('svp-form');
            if (fp) fp.remove();
        }
        P.mapMode = false;
        P.formMode = false;
        const ex = document.getElementById('svp-export');
        if (ex) ex.remove();
    });
});
