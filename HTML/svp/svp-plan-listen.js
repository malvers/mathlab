// Stoffverteilungsplan renderer, part "listen": two lists in the toolbar, each a button that drops a panel with a
// table of the whole school year, week by week.
//   "Zusatzmaterial" - every deck and lab of every week, where "Wochen auf" stood (Doc, 06.10.2026: "wo der Knopf
//                      Wochen auf steht, macht bitte hin Zusatzmaterial, und bring dort alle Decks und Labs rein,
//                      die wir pro Woche haben")
//   "Videos"         - every film, where "Bearbeiten" stood (Doc, 06.10.2026: "an die Stelle bitte ein Button
//                      Videos, der irgendwie eine Liste zeigt mit allen Videos, die wir haben. Sowohl den Titel als
//                      auch eine kurze Beschreibung")
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
//
// Title and description come from the material text of each week (Label URL «Beschreibung»), the same source as
// the pills and their tooltips - measured on 06.10.2026: 81 of 83 videos in the stored plans carry a description,
// so nothing has to be fetched from YouTube. The panel is the one of the Aufgabensammlung (svp-plan-tafel.js):
// .export-drop with .export-menu.aufg-menu and the table .aufg-tab (svp-dialogs.css). A list is drawn anew at
// every opening, so material added meanwhile is in it.
window.svpPlanParts.push(function (P) {

    /* The entries of every week that pass `passt`, in the plan's order: what the class sees - nothing hidden
       ([[aus]]), the same rule as the pills and the search. One item per week with its entries. */
    function wochen(passt) {
        const out = [];
        P.rendered.forEach(function (r) {
            if (!r.matTd) return;   /* a holiday row */
            const alle = P.parseMat(r.matTd.dataset.src || '');
            const treffer = alle.filter(function (en) { return !en.aus && passt(en); });
            if (!treffer.length) return;
            out.push({
                kw: P.weekOf ? P.weekOf(r) : r.kw,
                thema: r.topicSpan ? r.topicSpan.textContent.trim() : '',
                eintraege: treffer.map(function (en) {
                    /* a deck's own description says "the same slides as a web page" and means its PowerPoint twin:
                       the tooltip shows the twin's text instead (matTipText), so does this list */
                    return { label: en.label, url: en.url, desc: P.matTipText(en, alle) };
                })
            });
        });
        return out;
    }

    /* A button with its dropped panel, placed before `vor` in the toolbar. opts: name, title, icon (an element or
       null), klasse (of the panel), leer (said when nothing is there), kopf(n) (the panel's head line), liste()
       (the weeks, from wochen) and icons (true: each entry with its pill's sign). */
    function listenKnopf(bar, vor, opts) {
        const drop = document.createElement('div');
        drop.className = 'export-drop liste-drop';
        const knopf = document.createElement('button');
        knopf.type = 'button';
        knopf.className = 'action export-toggle';
        knopf.setAttribute('aria-haspopup', 'true');
        knopf.setAttribute('aria-expanded', 'false');
        knopf.title = opts.title;
        knopf.innerHTML = opts.name + ' <span class="export-caret">▾</span>';
        if (opts.icon) knopf.insertBefore(opts.icon, knopf.firstChild);
        const menu = document.createElement('div');
        menu.className = 'export-menu aufg-menu liste-menu ' + opts.klasse;
        menu.hidden = true;
        drop.append(knopf, menu);
        bar.insertBefore(drop, vor || bar.firstChild);

        function eintrag(e) {
            const div = document.createElement('div');
            div.className = 'liste-eintrag';
            const a = document.createElement('a');
            a.href = P.siteHref(e.url);
            a.target = '_blank';
            a.rel = 'noopener';
            if (opts.icons) a.appendChild(P.matIconEl(e.url, e.label));
            a.appendChild(document.createTextNode(e.label || P.matDefaultLabel(e.url)));
            /* as the pill: a plain left click opens our own player or window (openMat), Cmd/middle click a tab */
            a.addEventListener('click', function (ev) {
                if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
                ev.preventDefault();
                open(false);
                P.openMat(e.url, e.label);
            });
            div.appendChild(a);
            if (e.desc) {
                const d = document.createElement('div');
                d.className = 'liste-desc';
                d.textContent = e.desc;
                div.appendChild(d);
            }
            return div;
        }
        function zeichnen() {
            menu.textContent = '';
            const liste = opts.liste();
            const n = liste.reduce(function (s, w) { return s + w.eintraege.length; }, 0);
            const jetzt = +P.isoWeek(new Date());
            const kopf = document.createElement('div');
            kopf.className = 'aufg-kopf';
            kopf.textContent = opts.kopf(n);
            menu.appendChild(kopf);
            if (!n) {
                const leer = document.createElement('div');
                leer.className = 'liste-desc';
                leer.textContent = opts.leer;
                menu.appendChild(leer);
                return null;
            }
            const tab = document.createElement('table');
            tab.className = 'aufg-tab';
            const tbody = document.createElement('tbody');
            tab.appendChild(tbody);
            let ziel = null;
            liste.forEach(function (w) {
                const tr = document.createElement('tr');
                if (+w.kw === jetzt) tr.className = 'aufg-jetzt';
                const wann = document.createElement('td');
                wann.className = 'aufg-wann';
                wann.textContent = 'KW ' + w.kw;
                if (w.thema) wann.title = w.thema;
                if (P.montag) {
                    const d = document.createElement('span');
                    d.className = 'aufg-datum';
                    d.textContent = P.montag(w.kw);
                    wann.appendChild(d);
                }
                const was = document.createElement('td');
                w.eintraege.forEach(function (e) { was.appendChild(eintrag(e)); });
                tr.append(wann, was);
                tbody.appendChild(tr);
                if (!ziel && P.schuljahrPos(w.kw) >= P.schuljahrPos(jetzt)) ziel = tr;
            });
            menu.appendChild(tab);
            return ziel;
        }
        /* under the button, as wide as the screen allows, never past its edges (as the Aufgabensammlung) */
        function legen() {
            const r = drop.getBoundingClientRect(), w = Math.min(560, innerWidth - 32);
            const links = Math.max(16, Math.min(r.left, innerWidth - 16 - w));
            menu.style.width = w + 'px';
            menu.style.left = (links - r.left) + 'px';
        }
        function open(on) {
            menu.hidden = !on;
            knopf.setAttribute('aria-expanded', on ? 'true' : 'false');
            knopf.classList.toggle('on', !!on);
            if (!on) return;
            const ziel = zeichnen();
            legen();
            /* the current week in sight: scrolled to it only when it would stand below the fold */
            const tiefe = ziel ? ziel.getBoundingClientRect().top - menu.getBoundingClientRect().top : 0;
            if (tiefe > menu.clientHeight - 80) menu.scrollTop = tiefe - 72;
        }
        knopf.addEventListener('click', function (e) {
            e.stopPropagation();
            open(menu.hidden);
        });
        document.addEventListener('click', function (e) { if (!drop.contains(e.target)) open(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
        addEventListener('resize', function () { if (!menu.hidden) legen(); });
    }

    (function buildListen() {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        /* both in the place of a button that is out of sight now (svp-dialogs.css) */
        listenKnopf(bar, bar.querySelector('button[onclick*="togglePlanDetails"]'), {
            name: 'Zusatzmaterial',
            title: 'Alle Decks und Labs dieses Plans, Woche für Woche',
            klasse: 'zusatz-menu',
            icons: true,
            leer: 'In diesem Plan stehen noch keine Decks oder Labs.',
            kopf: function (n) { return 'Zusatzmaterial · ' + n + ' Decks und Labs im Schuljahr'; },
            liste: function () {
                return wochen(function (en) {
                    const k = P.matKind(en.url || '', en.label || '');
                    return (k === 'deck' || k === 'lab') && !P.isExerciseEntry(en);
                });
            }
        });
        listenKnopf(bar, bar.querySelector('button[onclick*="togglePlanEdit"]'), {
            name: 'Videos',
            title: 'Alle Videos dieses Plans mit Titel und Beschreibung',
            /* Doc, 06.10.2026: "mach bitte vor Videos noch das YouTube-Zeichen" - the red sign of the video pills */
            icon: P.matIconEl('https://www.youtube.com/', ''),
            klasse: 'vid-menu',
            leer: 'In diesem Plan stehen noch keine Videos.',
            kopf: function (n) { return 'Videos · ' + n + (n === 1 ? ' Film' : ' Filme') + ' im Schuljahr'; },
            liste: function () { return wochen(P.isVideoEntry); }
        });
    })();
});
