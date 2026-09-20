// Neuigkeiten-Laufband unter der Navileiste (Doc, 20.09.2026: "bring da einen
// News ticker", dann "da laeuft nix ... Reuters oder so?"). Die Zeile selbst
// haengt svp-nav.js auf, die Optik steht in svp-news.css - hier stehen nur die
// Nachrichten: eigene Meldungen aus svp-news.json und die Schlagzeilen der
// Feeds, die darin eingetragen sind.
//
// Warum tagesschau und heise und nicht Reuters: Reuters hat seine offenen RSS
// abgeschaltet, und ein Feed taugt hier nur, wenn er CORS erlaubt - sonst
// braeuchte jede Seite einen Proxy. Gemessen am 20.09.2026:
// tagesschau spiegelt die Origin zurueck (auch localhost), heise und DW
// schicken "*", BBC schickt gar keinen Header und faellt damit aus.
(function () {
    const script = document.currentScript;
    const box = document.querySelector('.nav-news');
    if (!script || !box) return;
    const base = script.dataset.base || script.src.replace(/svp-news\.js.*$/, '');

    /* Zwischenspeicher: die Schlagzeilen halten eine Viertelstunde. Ohne ihn
       holt jeder Seitenwechsel im Plan den Feed neu - das sind bei einer
       Unterrichtsstunde schnell dreissig Abrufe fuer dieselben zehn Zeilen. */
    const CACHE_KEY = 'svp-news-cache';
    const CACHE_MS = 15 * 60 * 1000;

    /* Tempo des Bandes in Pixeln je Sekunde. 70 px/s liest sich mit, ohne dass
       eine lange Schlagzeile ewig braucht (gemessen an der Zeile, nicht geraten:
       die Dauer rechnet sich aus der tatsaechlichen Breite). */
    const SPEED = 70;

    function heute() {
        /* Ortszeit, nicht UTC: toISOString() schiebt Berlin abends auf den
           naechsten Tag, ein "bis heute" waere abends schon abgelaufen. */
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
            '-' + String(d.getDate()).padStart(2, '0');
    }

    function eigenAktuell(it) {
        if (!it || !it.text) return false;
        const t = heute();
        if (it.ab && it.ab > t) return false;
        if (it.bis && it.bis < t) return false;
        return true;
    }

    /* ---- Feeds ---------------------------------------------------------
       Ein Eintrag in svp-news.json ist entweder ein Kuerzel aus FEEDS oder
       ein eigenes { name, url, typ } - "typ" ist "json" (tagesschau) oder
       "rss" (alles andere, RSS wie Atom). */
    const FEEDS = {
        /* "logo" statt des Wortes vor der Schlagzeile (Doc, 20.09.2026:
           "Tagesschau lieber ein ARD logo"). Das Bild liegt HIER im Projekt
           und wird nicht von tagesschau.de geholt: sonst meldet jeder Aufruf
           einer Planseite die IP der Schuelerin oder des Schuelers an die ARD,
           und das auf einer Schulseite ohne Not. Die Datei ist das offizielle
           Icon von tagesschau.de (der blaue Ball mit der Eins), auf 64 px
           gebracht; es steht als Quellenangabe und verlinkt auf die Meldung. */
        tagesschau: {
            name: 'tagesschau', typ: 'json', url: 'https://www.tagesschau.de/api2u/news',
            logo: 'icons/tagesschau.png'
        },
        heise: { name: 'heise', typ: 'rss', url: 'https://www.heise.de/rss/heise-atom.xml' },
        dw: { name: 'DW', typ: 'rss', url: 'https://rss.dw.com/rdf/rss-de-all' }
    };

    /* Drei Quellen, eine Zeile: die eigenen Meldungen aus svp-news.json, die
       Zeilen des Plans (diese Woche, naechste Vortraege - svp-plan-news.js
       meldet sie) und die Schlagzeilen. In dieser Reihenfolge laufen sie auch:
       was aus dem eigenen Unterricht kommt, steht vor der Weltlage. */
    let eigene = [];
    let lokal = Array.isArray(window.svpNewsLokal) ? window.svpNewsLokal : [];
    let feed = [];

    /* Der Plan ist beim Laden dieser Datei schon gebaut, die Vortraege kommen
       aber erst aus der Cloud nach - deshalb bleibt die Tuer offen. */
    window.svpNews = {
        lokal: function (items) {
            lokal = Array.isArray(items) ? items : [];
            zeichnen();
        }
    };

    function zeichnen() {
        const alle = lokal.concat(eigene, feed);
        if (alle.length) zeigen(alle);
    }

    /* ---- Knopf in der Navileiste --------------------------------------
       Doc, 20.09.2026: "und da noch ein butt der die zeile ausblenden kann" -
       eine Pille bei Zahnrad, Vollbild und QR. Die Wahl bleibt im Browser
       stehen, wie die versteckten Navi-Pillen auch. */
    const AUS_KEY = 'svp-news-aus';

    function aus() {
        try { return localStorage.getItem(AUS_KEY) === '1'; } catch (e) { return false; }
    }

    function ausSetzen(an) {
        try { localStorage.setItem(AUS_KEY, an ? '1' : '0'); } catch (e) { /* privates Fenster */ }
    }

    /* Megafon (Doc, 20.09.2026: "nimm ein Megafon bitte SVG schoen zentriert",
       dann "einfach leicht schraeg nach oben und KISS"). Zwei Striche: der
       Trichter und das Mundstueck, um 18 Grad angehoben, mittig im 24er-Feld.
       Mehr braucht das Bild nicht - alles Weitere wird bei 15 px zu Matsch. */
    /* Der halbe Pixel, den die gedrehte Form nach links oben aus der Mitte
       faellt, ist zurueckgeschoben (gemessen: links 1.0 zu rechts 1.8). */
    const MEGAFON = '<g transform="rotate(-18 12 12) translate(0.6 -0.2)">'
        + '<path d="M19.5 5.5v13L8 14.5v-5l11.5-4Z"/>'
        + '<path d="M8 9.5H5.75a2.5 2.5 0 0 0 0 5H8"/>'
        + '</g>';
    const ICON_AN = MEGAFON;
    const ICON_AUS = MEGAFON + '<path d="M4 4 20 20"/>';

    const pill = document.createElement('a');
    pill.className = 'badge b-grey nav-news-btn';
    pill.href = '#';

    function pillMalen() {
        const an = !aus();
        /* Dieselbe Zeichnung wie die anderen Icon-Pillen: 15 px, Strich 1.5
           (svp-nav.js, Doc am 09.09.2026). */
        pill.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
            'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
            'stroke-linejoin="round" aria-hidden="true">' + (an ? ICON_AN : ICON_AUS) + '</svg>';
        const text = an ? 'Neuigkeiten ausblenden' : 'Neuigkeiten einblenden';
        pill.title = text;
        pill.setAttribute('aria-label', text);
        pill.setAttribute('aria-pressed', an ? 'true' : 'false');
        box.classList.toggle('zu', !an);
    }

    pill.addEventListener('click', function (e) {
        e.preventDefault();
        ausSetzen(!aus());
        pillMalen();
    });

    (function pillEinhaengen() {
        const rechts = document.querySelector('nav.quick-nav .nav-right');
        /* Vor das Zahnrad: die Pille gehoert zu den Schaltern der Seite, nicht
           zu Schema und Anmeldung am Ende der Reihe. */
        if (rechts) rechts.insertBefore(pill, rechts.firstChild);
        pillMalen();
    })();

    function feedAufloesen(f) {
        if (typeof f === 'string') return FEEDS[f] || null;
        if (f && f.url) return { name: f.name || 'News', typ: f.typ || 'rss', url: f.url, logo: f.logo || '' };
        return null;
    }

    /* Die tagesschau-API liefert neben Meldungen auch Videos und die
       Schnipsel laufender Liveticker ("++ ... ++"). Fuer das Band bleiben die
       Meldungen, und die Plus-Zeichen fliegen aus dem Titel. */
    function ausJson(data, name, logo) {
        return (data.news || [])
            .filter(function (n) { return n && n.title && n.type === 'story'; })
            .map(function (n) {
                return {
                    text: n.title.replace(/^\++\s*/, '').replace(/\s*\++$/, '').trim(),
                    href: n.detailsweb || n.shareURL || '',
                    quelle: name,
                    logo: logo || ''
                };
            });
    }

    /* RSS und Atom in einem: beide tragen die Schlagzeile in <title> und den
       Link in <link> - bei Atom im href-Attribut. */
    function ausXml(text, name, logo) {
        const doc = new DOMParser().parseFromString(text, 'application/xml');
        if (doc.querySelector('parsererror')) return [];
        const eintraege = Array.from(doc.querySelectorAll('item, entry'));
        return eintraege.map(function (e) {
            const t = e.querySelector('title');
            const l = e.querySelector('link');
            return {
                text: (t ? t.textContent : '').trim(),
                href: l ? (l.getAttribute('href') || l.textContent || '').trim() : '',
                quelle: name,
                logo: logo || ''
            };
        }).filter(function (e) { return e.text; });
    }

    async function ladeFeed(f, anzahl) {
        const r = await fetch(f.url, { cache: 'no-cache' });
        if (!r.ok) throw new Error(f.name + ' ' + r.status);
        const roh = f.typ === 'json' ? ausJson(await r.json(), f.name, f.logo)
            : ausXml(await r.text(), f.name, f.logo);
        return roh.slice(0, anzahl);
    }

    /* ---- Das Band ------------------------------------------------------ */
    function zeile(eintraege) {
        const line = document.createElement('span');
        line.className = 'nav-news-line';
        eintraege.forEach(function (it) {
            const item = document.createElement(it.href ? 'a' : 'span');
            item.className = 'nav-news-item';
            if (it.href) {
                item.href = /^https?:/.test(it.href) ? it.href : new URL(it.href, base).href;
                /* Die Schlagzeile fuehrt aus dem Plan heraus - sie geht in
                   einen eigenen Tab, damit die Stunde stehen bleibt. */
                if (/^https?:/.test(it.href)) { item.target = '_blank'; item.rel = 'noopener'; }
            }
            if (it.klick) {
                item.classList.add('klickbar');
                item.addEventListener('click', it.klick);
            }
            /* Woher die Zeile kommt, steht nicht mehr vor ihr, sondern links
               im Etikett (Doc, 20.09.2026: "Schreib links wo News steht z.B.:
               Vortraege oder Tagesschau oder Stoff der Woche"). Der Eintrag
               traegt es nur noch als Merkmal mit sich. */
            item.dataset.rubrik = it.quelle || 'News';
            if (it.logo) item.dataset.logo = it.logo;
            item.appendChild(document.createTextNode(it.text));
            line.appendChild(item);
            const dot = document.createElement('span');
            dot.className = 'nav-news-dot';
            dot.textContent = '•';
            line.appendChild(dot);
        });
        return line;
    }

    function zeigen(eintraege) {
        if (!eintraege.length) return;
        box.textContent = '';

        const label = document.createElement('span');
        label.className = 'nav-news-label';

        const view = document.createElement('span');
        view.className = 'nav-news-view';
        const run = document.createElement('span');
        run.className = 'nav-news-run';
        const line = zeile(eintraege);
        run.appendChild(line);
        view.appendChild(run);
        box.appendChild(label);
        box.appendChild(view);
        box.hidden = false;

        /* Das Band laeuft immer (Doc, 20.09.2026: "da laeuft nix"). Damit es
           dabei nie leer wird, muss eine Haelfte breiter sein als das Fenster:
           kurze Meldungen werden so oft wiederholt, bis sie es sind, dann
           kommt die zweite, gleiche Haelfte dazu - die Animation schiebt um
           genau eine Haelfte und faengt nahtlos von vorn an. */
        requestAnimationFrame(function () {
            /* getBoundingClientRect statt scrollWidth: gemessen wird die
               tatsaechlich gerenderte Breite - bei einer Zeile, die gerade
               erst im Dokument steht, ist das der verlaessliche Wert. */
            const breite = function (el) { return Math.round(el.getBoundingClientRect().width); };
            const platz = view.clientWidth || 600;
            let schutz = 0;
            while (breite(line) > 0 && breite(line) < platz && schutz++ < 12) {
                Array.from(zeile(eintraege).childNodes).forEach(function (n) { line.appendChild(n); });
            }
            run.appendChild(line.cloneNode(true));
            /* Misst der Browser (noch) nichts, laeuft das Band mit einer
               ruhigen Standarddauer, statt mit 0s stillzustehen. */
            const dauer = breite(line) ? Math.round(breite(line) / SPEED) : 40;
            run.style.animationDuration = Math.max(20, dauer) + 's';
            box.classList.add('runs');
            labelBreite(label, eintraege);
            labelFolgen(label, view, run);
        });
    }

    /* ---- Das Etikett links -------------------------------------------- */

    /* Es nennt die Rubrik der Zeile, die gerade am linken Rand steht - also
       "Stoff der Woche", "Vortraege" oder tagesschau, je nachdem, was laeuft.
       Feste Breite: sonst schoebe jeder Wechsel das Fenster auf oder zu, und
       das Band ruckelte bei jedem Rubrikwechsel. */
    function labelBreite(label, eintraege) {
        const mess = document.createElement('span');
        mess.className = 'nav-news-label';
        mess.style.cssText = 'position:absolute;visibility:hidden;width:auto;white-space:nowrap';
        box.appendChild(mess);
        let max = 0;
        const gesehen = new Set();
        eintraege.forEach(function (it) {
            const r = it.quelle || 'News';
            if (gesehen.has(r)) return;
            gesehen.add(r);
            mess.textContent = r;
            /* Das Logo steht im Etikett vor dem Wort und will seinen Platz. */
            max = Math.max(max, mess.getBoundingClientRect().width + (it.logo ? 20 : 0));
        });
        mess.remove();
        if (max) label.style.width = Math.ceil(max) + 'px';
    }

    function labelSetzen(label, rubrik, logo) {
        if (label.dataset.jetzt === rubrik) return;
        label.dataset.jetzt = rubrik;
        label.textContent = '';
        if (logo) {
            const img = document.createElement('img');
            img.className = 'nav-news-logo';
            img.src = new URL(logo, base).href;
            img.alt = '';
            /* Laedt das Bild nicht, bleibt das Wort allein stehen - die Quelle
               geht also nie verloren. */
            img.onerror = function () { img.remove(); };
            label.appendChild(img);
            label.appendChild(document.createTextNode(' '));
        }
        label.appendChild(document.createTextNode(rubrik));
    }

    let uhr = null;
    function labelFolgen(label, view, run) {
        if (uhr) clearInterval(uhr);
        function schauen() {
            /* Im Hintergrund laeuft die Animation ohnehin nicht weiter. */
            if (document.hidden || !box.isConnected) return;
            const rand = view.getBoundingClientRect().left + 2;
            const items = run.querySelectorAll('.nav-news-item');
            for (const it of items) {
                /* Der erste Eintrag, der rechts vom linken Rand noch etwas
                   zeigt - das ist der, den man gerade liest. */
                if (it.getBoundingClientRect().right > rand) {
                    labelSetzen(label, it.dataset.rubrik || 'News', it.dataset.logo || '');
                    return;
                }
            }
        }
        schauen();
        /* Ein Viertelsekunden-Takt statt eines Bildes pro Frame: bei 70 px/s
           wandert das Band in der Zeit 17 px, der Wechsel kommt also puenktlich
           genug - und kostet nicht jeden Frame eine Messung. */
        uhr = setInterval(schauen, 250);
    }

    function cacheLesen() {
        try {
            const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (c && Array.isArray(c.items)) return c;
        } catch (e) { /* kaputt oder gesperrt - dann eben ohne */ }
        return null;
    }

    async function los() {
        let conf = {};
        try {
            const r = await fetch(base + 'svp-news.json', { cache: 'no-cache' });
            if (r.ok) conf = await r.json();
        } catch (e) { /* nicht da - dann laufen nur die Feeds */ }

        eigene = (conf.items || []).filter(eigenAktuell).map(function (it) {
            return { text: it.text, href: it.href || '', quelle: it.quelle || '' };
        });

        const feeds = (conf.feeds || ['tagesschau']).map(feedAufloesen).filter(Boolean);
        const jeFeed = conf.anzahl || 8;

        /* Erst zeigen, was schon da ist: eigene Meldungen und die Schlagzeilen
           vom letzten Mal. Das Band laeuft damit sofort, statt auf das Netz zu
           warten; kommen die frischen an, wird es neu gesetzt. */
        const cache = cacheLesen();
        const frisch = cache && (Date.now() - cache.ts) < CACHE_MS;
        if (cache) feed = cache.items;
        zeichnen();
        if (frisch) return;

        const geholt = await Promise.all(feeds.map(function (f) {
            return ladeFeed(f, jeFeed).catch(function (e) {
                console.warn('svp news:', e.message);
                return [];
            });
        }));

        /* Reihum aus den Feeds, nicht erst alle von einer Quelle: bei zwei
           Feeds stehen die Schlagzeilen sonst in zwei Bloecken. */
        const gemischt = [];
        for (let i = 0; i < jeFeed; i++) {
            geholt.forEach(function (liste) { if (liste[i]) gemischt.push(liste[i]); });
        }
        if (!gemischt.length) return;

        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items: gemischt }));
        } catch (e) { /* kein Platz oder gesperrt - der Ticker laeuft trotzdem */ }
        feed = gemischt;
        zeichnen();
    }

    los().catch(function (e) { console.warn('svp news:', e); });
})();
