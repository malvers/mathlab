// Stoffverteilungsplan renderer, part "tafel": the board of a lesson, sent from vorrechnen.html.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
//
// Doc, 26.09.2026: "das, was wir hier gemacht haben, sollen definitiv alle sehen. Das ist ja
// gerade der Witz. Wir rechnen es gemeinsam und die haben dann die Musterlösung schon vor sich
// liegen." - vorrechnen.html sends what was worked out in class to the table svp_tafel (one row
// per plan page and day: the tasks and their working as LaTeX; everyone reads, only Doc writes).
// Here every board becomes a pill "Tafel 26.09." in the week of its day, next to the
// Formelsammlung: a fixed pill (festePillen), never part of the week's stored material text -
// so no open plan tab can push it away again with an older edit state (the ts trap of
// svp_plan_edits). The pill opens decks/tafel.html: the working as a deck, one slide per task, with
// Solita to ask about every step (Doc, 27.09.2026: "viel besser ... ein Deck", the PDF is gone).
//
// Doc, 30.09.2026: "ich hätte gern pro Woche Vorrechnen von 10 (20?) Aufgaben zum Thema ... einen Button pro Woche und
// das Deck pro Woche" - only in Mathe BGY 11 ("Ich mache Mathe nur BGY 11 ... dafür!"). A block of vorrechnen.html that
// carries a calendar week (BLOECKE kw) is a pill "Vorrechnen" in that week, before the boards: decks/tafel.html?kw=<week>,
// every task of the week with its solution step by step. A fixed pill as well.
window.svpPlanParts.push(function (P) {
    Object.assign(P, { tafelLinks, vorrechnenKnopf, montag });   /* montag: also the lists of the toolbar (svp-plan-listen.js) */

    const me = document.querySelector('script[src*="svp-plan-tafel.js"]');
    const TAFEL_URL = new URL('../decks/tafel.html', me ? me.src : location.href).href;
    const WURZEL = new URL('../', me ? me.src : location.href).href;
    const VORRECHNEN_SEITE = /\/svp\/mathe\/mathe11\.html$/;    /* the week blocks and the Aufgabensammlung */
    /* the pages that read the Vorrechnen blocks: Mathe 11 and every page a deck by theme is pinned to (SAMMLUNGEN seite,
       js/vorrechnen-aufgaben.js - Doc, 02.10.2026: "Eins mal eins" in Informatik 9) */
    const VORRECHNEN_SEITEN = [VORRECHNEN_SEITE, /\/svp\/informatik\/informatik9\.html$/];
    function vorrechnenSeite() { return VORRECHNEN_SEITEN.some(r => r.test(location.pathname)); }

    let tafeln = [];    /* [{ id, kw, datum, titel }] of this page, this school year */
    let vorrechnen = {};    /* { kw: the titles of its blocks } */
    let wochenListe = [];    /* [kw, titles] in the order of the school year, for the Aufgabensammlung */
    let sammlungen = {};    /* the decks by theme, SAMMLUNGEN in js/vorrechnen-aufgaben.js */

    /* "2026-09-26" -> "26.09." */
    function tag(datum) {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(datum || ''));
        return m ? m[3] + '.' + m[2] + '.' : '';
    }

    /* Doc, 30.09.2026: "Alle Decks, die jetzt da drin sind, bitte ausblenden programmatisch, weil ich nicht jedes
       einzelne klicken will" - the pill "Vorrechnen" of a week is hidden from the class until Doc opens it with the
       eye over it (edit mode, svp-plan-material.js). Hidden is the rule, so nothing had to be written for the weeks
       there are; the eye sets vorrechnenAn in the week's stored edits (svp_plan_edits, read by everyone) and takes it
       out again. The switch belongs to the calendar week like the pill: saving the table and a shift leave it with
       its row (svp-plan-edit.js, svp-plan-shift.js). */
    function vorrechnenAn(ref) {
        const woche = P.saved && P.saved[ref.i];
        return !!(woche && woche.vorrechnenAn);
    }
    function vorrechnenSchalten(ref) {
        P.wocheSetzen(ref, 'vorrechnenAn', vorrechnenAn(ref) ? null : true);
        P.updateMaterial(ref, ref.matTd.dataset.src || '');
        if (ref.refreshExpandable) ref.refreshExpandable();
    }

    /* Doc, 01.10.2026: "die ... noch nicht verlinkt sind, in diese Woche verlinken" - a deck by theme (SAMMLUNGEN) is a
       pill in the week its kw names, after the pill "Vorrechnen". Hidden from the class the same way until Doc opens it
       with its eye ("die Kids sollen das ja nicht vorher sehen"): sammlungAn in the week's stored edits holds the keys
       of the decks switched on - carried by saving the table and by a shift like vorrechnenAn. A week whose own material
       links the deck already keeps that pill and gets no second one. */
    function sammlungenAn(ref) {
        const woche = P.saved && P.saved[ref.i];
        return woche && Array.isArray(woche.sammlungAn) ? woche.sammlungAn : [];
    }
    function sammlungSchalten(ref, key) {
        const an = sammlungenAn(ref).filter(k => k !== key);
        if (an.length === sammlungenAn(ref).length) an.push(key);
        P.wocheSetzen(ref, 'sammlungAn', an.length ? an : null);
        P.updateMaterial(ref, ref.matTd.dataset.src || '');
        if (ref.refreshExpandable) ref.refreshExpandable();
    }
    /* the theme decks the week's material links itself: "tafel.html?aufgaben" is '', "?aufgaben=knobeln" knobeln */
    function selbstVerlinkt(ref) {
        const keys = new Set();
        String((ref.matTd && ref.matTd.dataset.src) || '')
            .replace(/tafel\.html\?aufgaben(?:=([\w-]+))?(?![\w=-])/g, (m, k) => { keys.add(k || ''); return m; });
        return keys;
    }
    function sammlungUrl(key) {
        return TAFEL_URL + '?aufgaben' + (key ? '=' + encodeURIComponent(key) : '');
    }

    /* The pills of one week: every board whose day lies in the week's calendar week.
       Pages that count appointments instead of weeks (UNTIS_TERMIN, FO) have no week
       number per row - the board is not placed there rather than placed wrongly.
       A hidden pill "Vorrechnen" (aus) goes to Doc alone - grey, with its eye (schalte); the class never gets it. */
    function tafelLinks(ref) {
        if (!ref || window.UNTIS_TERMIN || ref.kw == null || ref.kw === '') return [];
        const woche = vorrechnen[String(ref.kw)];
        const an = !!woche && vorrechnenAn(ref);
        const schon = selbstVerlinkt(ref);
        const themen = Object.keys(sammlungen).filter(k => String(sammlungen[k].kw) === String(ref.kw) && !schon.has(k))
            .map(k => ({ k, an: sammlungenAn(ref).indexOf(k) >= 0 })).filter(s => s.an || P.CAN_EDIT_MAT)
            .map(s => ({
                label: sammlungen[s.k].titel + ' – alle Aufgaben',
                url: sammlungUrl(s.k),
                icon: 'tafel',
                titel: 'Aufgabensammlung ' + sammlungen[s.k].titel + ' - alle Aufgaben mit Musterlösung Schritt für Schritt, ' +
                    'mit Solita' + (s.an ? '' : ' (für die Klasse ausgeblendet)'),
                aus: !s.an,
                schalte: function () { sammlungSchalten(ref, s.k); }
            }));
        return (woche && (an || P.CAN_EDIT_MAT) ? [{
            label: 'Vorrechnen',
            url: TAFEL_URL + '?kw=' + encodeURIComponent(ref.kw),
            icon: 'tafel',
            titel: 'Vorrechnen der Woche: ' + woche + ' - alle Aufgaben mit Musterlösung Schritt für Schritt, mit Solita' +
                (an ? '' : ' (für die Klasse ausgeblendet)'),
            aus: !an,
            schalte: function () { vorrechnenSchalten(ref); }
        }] : []).concat(themen, tafeln.filter(t => String(t.kw) === String(ref.kw)).map(t => ({
            label: 'Tafel ' + tag(t.datum),
            url: TAFEL_URL + '?id=' + encodeURIComponent(t.id),
            icon: 'tafel',
            titel: 'Tafelbild vom ' + tag(t.datum) + ' - die Rechnung aus der Stunde als Deck, mit Solita zu jedem Schritt'
        })));
    }

    /* Doc, 30.09.2026, over the free room left of the week's tabs (Zusatzmaterial | Videos | Aufgaben): "gib mir da
       das Tafelicon. Wenn click: zeig Vorrechnen - das Tool mit den Aufgaben! Genial" - in a week with a Vorrechnen
       block the blackboard stands there and opens vorrechnen.html on that block (?kw=, js/vorrechnen-zustand.js), in
       a tab of its own; in the other weeks nothing. Built with the week's head (svp-plan-rows.js), shown once the
       blocks are read (vorrechnenLaden). Same day: "mach das Tafel Icon hinter Aufgaben und so klein wie die
       anderen" - it stands behind the tabs now, before the pen. And: "das Vorrechen-Icon bitte nur, wenn ich
       eingeloggt bin. Das sollen die Schüler nicht sehen" - built for Doc alone, like the pen next to it. */
    const knoepfe = [];
    /* Doc, 02.10.2026, Informatik 9: "als Vorrechenlink und als [Deck]" - a deck by theme pinned to a page of its own
       (SAMMLUNGEN seite) has no Aufgabensammlung there to open Vorrechnen from, so its week's blackboard opens it */
    function labZiel(ref) {
        const woche = vorrechnen[String(ref.kw)];
        if (woche) return { param: 'kw=' + encodeURIComponent(ref.kw), titel: woche };
        const k = Object.keys(sammlungen).find(k => sammlungen[k].seite && String(sammlungen[k].kw) === String(ref.kw));
        return k == null ? null : { param: 'aufgaben' + (k ? '=' + encodeURIComponent(k) : ''), titel: sammlungen[k].titel };
    }
    function knopfZeigen(k) {
        const ziel = labZiel(k.ref);
        k.b.hidden = !ziel;
        if (ziel) k.b.title = 'Vorrechnen: ' + ziel.titel;
    }
    function vorrechnenKnopf(ref, kopf) {
        if (!P.CAN_EDIT_MAT) return;
        if (!vorrechnenSeite() || window.UNTIS_TERMIN || ref.kw == null || ref.kw === '') return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'sub-vorrechnen';
        b.setAttribute('aria-label', 'Vorrechnen mit den Aufgaben der Woche');
        b.appendChild(P.tafelIcon());
        b.addEventListener('mousedown', P.keinMausfokus);
        b.addEventListener('click', function (ev) {
            ev.stopPropagation();   /* sonst klappt der Zeilenklick zu */
            const ziel = labZiel(ref);
            if (ziel) window.open(WURZEL + 'vorrechnen.html?' + ziel.param, '_blank', 'noopener');
        });
        kopf.appendChild(b);
        const k = { ref, b };
        knoepfe.push(k);
        knopfZeigen(k);
    }

    /* Doc, 01.10.2026: "eine zentrale Stelle ... Oben links neben Formelsammlung ... ein Panel, kommt mit einer Tabelle,
       mit den ganzen [Decks] vom ganzen Jahr" and "die Taste darf man natürlich nur sehen, wenn ich eingeloggt bin" -
       every deck of the tasks in one list: the decks by theme, the Vorrechnen deck of every week, the boards sent from
       class. For Doc alone, on the page of the Vorrechnen blocks; left of the Formelsammlung in the head's button group
       (P.kopfKnoepfe, svp-plan-search.js), dropped down like the Export menu (.export-drop, svp-dialogs.css). The table
       is drawn anew at every opening, so a board sent meanwhile is in it. */
    function wochenRang(kw) { return +kw >= 31 ? +kw - 31 : +kw + 22; }   /* the school year starts in August */
    function montag(kw) {   /* the Monday of a calendar week of this school year as "26.10." */
        const beginn = +schuljahrBeginn().slice(0, 4), jahr = +kw >= 31 ? beginn : beginn + 1;
        const vier = new Date(Date.UTC(jahr, 0, 4));
        const mo = new Date(vier.getTime() + ((1 - (vier.getUTCDay() || 7)) + (kw - 1) * 7) * 864e5);
        return String(mo.getUTCDate()).padStart(2, '0') + '.' + String(mo.getUTCMonth() + 1).padStart(2, '0') + '.';
    }
    function kwHeute() {
        const d = new Date(), t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
        return Math.ceil(((t - Date.UTC(t.getUTCFullYear(), 0, 1)) / 864e5 + 1) / 7);
    }
    function aufgabensammlung() {
        if (!P.CAN_EDIT_MAT || !VORRECHNEN_SEITE.test(location.pathname) || !P.kopfKnoepfe) return;
        if (document.querySelector('.aufg-drop')) return;
        const gruppe = P.kopfKnoepfe();
        if (!gruppe) return;
        const drop = document.createElement('div');
        drop.className = 'export-drop aufg-drop';
        const knopf = document.createElement('button');
        knopf.type = 'button';
        knopf.className = 'action secondary export-toggle';
        knopf.setAttribute('aria-haspopup', 'true');
        knopf.setAttribute('aria-expanded', 'false');
        knopf.title = 'Aufgabensammlung: alle Aufgaben-Decks des Schuljahrs - nur mit Anmeldung zu sehen';
        /* "Aufgaben", not "Aufgabensammlung" (Doc, 01.10.2026: "dann wird es schmaler und passt auf die Zeile hoch") */
        knopf.innerHTML = 'Aufgaben <span class="export-caret">▾</span>';
        const menu = document.createElement('div');
        menu.className = 'export-menu aufg-menu';
        menu.hidden = true;
        drop.append(knopf, menu);
        gruppe.insertBefore(drop, gruppe.firstChild);

        const jetzt = kwHeute();
        function link(text, url, titel) {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = text;
            if (titel) a.title = titel;
            return a;
        }
        function teil(tbody, text) {
            const tr = document.createElement('tr');
            tr.className = 'aufg-teil';
            const th = document.createElement('th');
            th.colSpan = 3;
            th.textContent = text;
            tr.appendChild(th);
            tbody.appendChild(tr);
        }
        /* when: "KW 44" with its Monday, or a board's day; extra: what stands at the right end */
        function zeile(tbody, kw, tag, inhalt, extra) {
            const tr = document.createElement('tr');
            if (kw != null && +kw === jetzt) tr.className = 'aufg-jetzt';
            const wann = document.createElement('td');
            wann.className = 'aufg-wann';
            wann.textContent = kw != null ? 'KW ' + kw : tag;
            if (kw != null) {
                const d = document.createElement('span');
                d.className = 'aufg-datum';
                d.textContent = montag(kw);
                wann.appendChild(d);
            }
            const was = document.createElement('td');
            was.appendChild(inhalt);
            const dazu = document.createElement('td');
            dazu.className = 'aufg-dazu';
            if (extra) dazu.appendChild(extra);
            tr.append(wann, was, dazu);
            tbody.appendChild(tr);
            return tr;
        }
        /* Doc, 01.10.2026: "hinter dem Symbol rechts sollte sich ... nicht das Deck verstecken, sondern ... der Link zum
           Vorrechnen", "ich brauche den Button fürs [Vorrechnen]" - the blackboard alone read as the deck (the pills of
           the decks carry it too): a button with its word, in every row that has a block in Vorrechnen. The deck is
           the title, a link underlined under the pointer. */
        function labKnopf(param, wofuer) {
            const a = document.createElement('a');
            a.href = WURZEL + 'vorrechnen.html?' + param;
            a.target = '_blank';
            a.rel = 'noopener';
            a.className = 'aufg-lab';
            a.title = wofuer + ' im Vorrechnen öffnen - die Aufgaben an der Tafel';
            a.appendChild(P.tafelIcon());
            const wort = document.createElement('span');
            wort.textContent = 'Vorrechnen';
            a.appendChild(wort);
            return a;
        }
        function zeichnen() {
            menu.textContent = '';
            const kopf = document.createElement('div');
            kopf.className = 'aufg-kopf';
            kopf.textContent = 'Aufgabensammlung · alle Decks des Schuljahrs';
            const tab = document.createElement('table');
            tab.className = 'aufg-tab';
            const tbody = document.createElement('tbody');
            tab.appendChild(tbody);
            teil(tbody, 'Sammlungen');
            Object.keys(sammlungen).forEach(k => {
                const s = sammlungen[k];
                zeile(tbody, s.kw != null ? s.kw : null, '', link(s.titel, sammlungUrl(k), 'Deck: ' + s.kicker),
                    labKnopf('aufgaben' + (k ? '=' + encodeURIComponent(k) : ''), s.titel));
            });
            teil(tbody, 'Vorrechnen · ein Deck pro Woche');
            let ziel = null;
            wochenListe.forEach(([kw, titel]) => {
                const tr = zeile(tbody, kw, '', link(titel, TAFEL_URL + '?kw=' + encodeURIComponent(kw), 'Deck der KW ' + kw),
                    labKnopf('kw=' + encodeURIComponent(kw), 'KW ' + kw));
                if (!ziel && wochenRang(kw) >= wochenRang(jetzt)) ziel = tr;
            });
            if (tafeln.length) {
                teil(tbody, 'Tafelbilder aus dem Unterricht');
                tafeln.forEach(t => zeile(tbody, null, tag(t.datum),
                    link(t.titel || 'Tafel ' + tag(t.datum), TAFEL_URL + '?id=' + encodeURIComponent(t.id))));
            }
            menu.append(kopf, tab);
            return ziel;
        }
        /* under the button, as wide as the screen allows: ending with the button where it fits, else starting with it,
           never past the screen's edges */
        function legen() {
            const r = drop.getBoundingClientRect(), w = Math.min(560, innerWidth - 32);
            const links = Math.max(16, Math.min(r.right - w >= 16 ? r.right - w : r.left, innerWidth - 16 - w));
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
            /* the coming week in sight: scrolled up to it only when it would stand below the fold */
            const tiefe = ziel ? ziel.getBoundingClientRect().top - menu.getBoundingClientRect().top : 0;
            if (tiefe > menu.clientHeight - 80) menu.scrollTop = tiefe - 72;
        }
        knopf.addEventListener('click', function (e) {
            e.stopPropagation();
            open(menu.hidden);
        });
        menu.addEventListener('click', function (e) { if (e.target.closest('a')) open(false); });
        document.addEventListener('click', function (e) { if (!drop.contains(e.target)) open(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
        addEventListener('resize', function () { if (!menu.hidden) legen(); });
    }

    /* the weeks are built by now: draw their material again, pills included */
    function neuZeichnen() {
        knoepfe.forEach(knopfZeigen);
        (P.rendered || []).forEach(r => {
            if (!r.matTd || !tafelLinks(r).length) return;
            P.updateMaterial(r, r.matTd.dataset.src || '');
            if (r.refreshExpandable) r.refreshExpandable();
        });
    }

    /* A school year starts in August: last year's boards of the same calendar week stay out. */
    function schuljahrBeginn() {
        const d = new Date();
        const jahr = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
        return jahr + '-08-01';
    }

    /* Read without a session - the class sees the plan without logging in. Only the
       handful of fields for the pills; the working itself is fetched by decks/tafel.html. */
    (function laden() {
        if (!/\.html$/.test(location.pathname) || !window.svpAuth) return;
        const url = svpAuth.DB_URL + '/rest/v1/svp_tafel?page=eq.' + encodeURIComponent(location.pathname) +
            '&datum=gte.' + schuljahrBeginn() + '&select=id,kw,datum,titel&order=datum';
        fetch(url, { headers: { apikey: svpAuth.DB_KEY } })
            .then(res => (res.ok ? res.json() : []))
            .then(rows => {
                if (!Array.isArray(rows) || !rows.length) return;
                tafeln = rows;
                neuZeichnen();
            })
            .catch(() => { /* offline or no table: the plan stays as it is */ });
    })();

    /* The weeks of the Vorrechnen blocks: the table WOCHEN in js/vorrechnen-aufgaben.js (name -> [week, title]), THE
       place for both - one file instead of all the task files (36 of them, 339 kB, for one pill a week; Doc,
       30.09.2026: "die Tabelle find ich eine gute Idee!"). The file runs in a function of its own, so nothing of it
       lands in this page's globals. */
    (function vorrechnenLaden() {
        if (!vorrechnenSeite()) return;
        fetch(WURZEL + 'js/vorrechnen-aufgaben.js')
            .then(res => (res.ok ? res.text() : ''))
            .then(text => {
                if (!text) return;
                const daten = new Function(text + '\n;return { wochen: WOCHEN, ' +
                    'sammlungen: typeof SAMMLUNGEN === "undefined" ? {} : SAMMLUNGEN };')();
                const tabelle = daten.wochen, wochen = {}, liste = [];
                Object.keys(tabelle).forEach(name => {
                    const k = String(tabelle[name][0]), titel = tabelle[name][1];
                    if (!wochen[k]) liste.push(k);
                    wochen[k] = wochen[k] ? wochen[k] + ' + ' + titel : titel;
                });
                /* the week blocks are Mathe 11's; a deck by theme belongs to its page (seite, else Mathe 11) */
                const mathe11 = VORRECHNEN_SEITE.test(location.pathname);
                vorrechnen = mathe11 ? wochen : {};
                wochenListe = mathe11 ? liste.map(k => [k, wochen[k]]) : [];
                sammlungen = {};
                Object.keys(daten.sammlungen).forEach(k => {
                    const seite = daten.sammlungen[k].seite;
                    if (seite ? location.pathname.endsWith(seite) : mathe11) sammlungen[k] = daten.sammlungen[k];
                });
                neuZeichnen();
                aufgabensammlung();
            })
            .catch(() => { /* offline or a file that does not run: no pill, the plan stays as it is */ });
    })();
});
