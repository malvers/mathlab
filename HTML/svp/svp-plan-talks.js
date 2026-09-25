// Stoffverteilungsplan renderer, part "talks": the "Vortrag: Nr · Titel" line of a week.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        paintTalk, loadTalks
    });

    /* Doc, 18.09.2026: "Vortrag: ..." - the head of a week's sub-row names the
       talk given that week, "Vortrag: 1 · Big Data im Alltag", per Lerngruppe when
       9a and 9b differ. Built-in dates and topics come from
       svp/informatik/vortraege.js in its data mode (one source for both pages);
       Doc's topic list, order, fundus and dates from svp_plan_edits, read the way
       the talk page reads them. A talk belongs to the week with its ISO calendar
       week - the KW column. Only on plans with a Vortraege page. */
    function paintTalk(ref) {
        const head = ref.subHeadL;
        if (!head) return;
        const old = head.querySelector('.sub-talk');
        if (old) old.remove();
        const box = document.createElement('span');
        box.className = 'sub-talk';
        const line = document.createElement('span');
        ref.talk.forEach(function (part, n) {
            const b = document.createElement('b');
            b.textContent = part[0];
            line.appendChild(b);
            line.appendChild(document.createTextNode(' ' + part[1] + (n < ref.talk.length - 1 ? '   ' : '')));
        });
        box.title = line.textContent.trim();
        if (ref.talkTicker) {
            /* ticker: the line twice in a row, moved left by one copy (-50 %) and
               started again - seamless; the speed follows the length */
            box.classList.add('ticker');
            const run = document.createElement('span');
            run.className = 'sub-talk-run';
            run.appendChild(line);
            run.appendChild(line.cloneNode(true));
            run.style.animationDuration = Math.max(10, Math.round(line.textContent.length / 5)) + 's';
            box.appendChild(run);
        } else {
            box.appendChild(line);
        }
        head.classList.add('has-talk');
        head.appendChild(box);
    }
    function loadTalks() {
        /* the talk data lives next to the informatics plans and covers only them -
           other plans do not load it (the group view ?g= has no Vortraege button
           to go by, so the folder decides) */
        if (!/\/svp\/informatik\//.test(location.pathname) || !window.svpAuth) return;
        const me = document.querySelector('script[src*="svp-plan.js"]');
        if (!me) return;
        const s = document.createElement('script');
        s.dataset.mode = 'data';
        s.src = new URL('informatik/vortraege.js', me.src).href;
        s.onload = function () { showTalks().catch(function (e) { console.warn('svp talks:', e); }); };
        document.head.appendChild(s);
    }
    async function showTalks() {
        const V = window.SVP_VORTRAEGE;
        if (!V) return;
        const file = location.pathname.replace(/^.*\//, '');
        const key = Object.keys(V.PLANS).find(function (k) { return V.PLANS[k].page === file; });
        if (!key) return;
        const def = V.PLANS[key];
        /* per-group dates (FOS 12): the groups are the keys of that object, and a
           group's order is filed under its key; ?g= shows only that group */
        const perGroup = def.dates && !Array.isArray(def.dates);
        const klassen = (perGroup
            ? Object.keys(def.dates).map(function (g) { return [g, g.replace(/_/g, ' + ')]; })
            : (def.klassen || [['a', '']]))
            .filter(function (k) { return !perGroup || !P.GROUP || P.groupKey(k[0]) === P.GROUP_KEY; });
        const base = '/svp/vortraege/' + key;
        const metaPages = klassen.map(function (k) { return base + '/' + k[0]; }).concat(
            klassen.filter(function (k) { return k[1]; }).map(function (k) { return base + '/' + String(k[1]).replace(/[^A-Za-z0-9-]+/g, '_'); }));
        /* since 23.09.2026 every Lerngruppe has a topic list of its own (META_PAGE +
           '/themen', see vortraege.js); the plan-wide row is only the template a
           group without one still shows */
        const pages = [base].concat(metaPages, metaPages.map(function (p) { return p + '/themen'; }));
        const res = await fetch(svpAuth.DB_URL + '/rest/v1/svp_plan_edits?page=in.' +
            encodeURIComponent('(' + pages.map(function (p) { return '"' + p + '"'; }).join(',') + ')') +
            '&select=page,edits', { headers: { apikey: svpAuth.DB_KEY, Authorization: 'Bearer ' + svpAuth.DB_KEY } });
        const rows = res.ok ? await res.json() : [];
        const row = function (p) { return rows.find(function (x) { return x.page === p; }); };
        const edits = function (p) { const r = row(p); return (r && r.edits) || {}; };
        /* a plan with Lerngruppen (inf12: ?g=BGY25) files its order under the group
           name, slugged like vortraege.js does - the letter otherwise */
        const slug = function (t) { return String(t).replace(/[^A-Za-z0-9-]+/g, '_'); };
        const metaPage = function (k) {
            const byGroup = base + '/' + slug(k[1]);
            return !row(base + '/' + k[0]) && k[1] && row(byGroup) ? byGroup : base + '/' + k[0];
        };
        /* the topics of one Lerngruppe: its own list, else the plan-wide template,
           else the built-in ones */
        const catOf = function (k) {
            const own = edits(metaPage(k) + '/themen').list;
            const src = Array.isArray(own) && own.length ? own : edits(base).list;
            const seen = new Set();
            const cat = [];
            (Array.isArray(src) ? src : []).forEach(function (e) {
                const id = +(e && e.id);
                if (!Number.isFinite(id) || id < 0 || seen.has(id)) return;
                seen.add(id);
                cat.push({ id: id, title: typeof e.title === 'string' ? e.title : '' });
            });
            return cat.length ? cat : (def.topics || []).map(function (t, i) { return { id: i, title: t.title }; });
        };
        /* kw -> Lerngruppe label -> ["1 · Titel", ...] */
        const byKw = {};
        /* dieselben Vortraege noch einmal flach, mit Datum: daraus macht
           svp-plan-news.js die naechsten Termine fuer das Neuigkeiten-Band
           (Doc, 20.09.2026: "welche Vortraege wann sind") */
        const termine = [];
        /* Gruppe -> die Themen-Ids, die sie zu vergeben hat (siehe markTalksDone) */
        const themen = {};
        klassen.forEach(function (k) {
            const m = edits(metaPage(k));
            const fundus = new Set((Array.isArray(m.fundus) ? m.fundus : []).map(Number));
            const order = Array.isArray(m.order) ? m.order.map(Number) : null;
            const list = V.arrange(catOf(k), order).filter(function (e) { return !fundus.has(e.id); });
            themen[k[0]] = list.map(function (e) { return e.id; });
            const own = V.datesFor(def, k[0]);
            const md = m.dates && typeof m.dates === 'object' ? m.dates : {};
            list.forEach(function (e, pos) {
                const iso = Object.prototype.hasOwnProperty.call(md, pos) ? md[pos] : own[pos];
                if (!iso) return;
                const w = P.isoWeek(new Date(iso + 'T12:00:00'));   /* the one markCurrentWeek uses */
                const g = (byKw[w] = byKw[w] || {});
                (g[k[1]] = g[k[1]] || []).push((pos + 1) + ' · ' + e.title);
                termine.push({ iso: iso, label: k[1] || '', text: (pos + 1) + ' · ' + e.title });
            });
        });
        P.rendered.forEach(function (ref) {
            const g = ref.kw != null && byKw[+ref.kw];
            if (!g || !ref.ensureSubRow) return;
            const labels = Object.keys(g);
            const texts = labels.map(function (l) { return g[l].join(' · '); });
            /* the same talk in every Lerngruppe: one line without the group */
            ref.talk = texts.every(function (t) { return t === texts[0]; })
                ? [['Vortrag', texts[0]]]
                : labels.map(function (l, n) { return [(n ? '' : 'Vortrag ') + l, texts[n]]; });
            /* Doc, 18.09.2026: more than one talk in the week (inf11: two per day, FOS 12:
               two per group) - "laufbandmaessig durchlaufen" */
            ref.talkTicker = labels.some(function (l) { return g[l].length > 1; }) || ref.talk.length > 1;
            ref.ensureSubRow();
            paintTalk(ref);
        });
        if (P.newsTalks) P.newsTalks(termine);
        markTalksDone(key, themen).catch(function (e) { console.warn('svp talks done:', e); });
    }

    /* Der Vortraege-Knopf wird gruen, sobald jedes Thema dieser Lerngruppe
       vergeben ist (Doc, 20.09.2026: "wenn alle Vortraege vergeben sind mach
       den so gruen wie die Vortraege"). Vergeben heisst: an dem Thema steht
       MINDESTENS ein Name - "die duerfen auch alleine", zwei Plaetze sind die
       Regel, keine Bedingung.
       Gelesen wird nur das Flag taken; die Namen selbst sind gegen Docs
       oeffentlichen Schluessel versiegelt und kommen hier gar nicht erst an
       (svp/informatik/vortraege.js, Tabelle svp_vortrag_namen). */
    /* Wohin ein Knopf fuehrt - data-href auf den Seiten mit Gruppen-Menue, sonst
       das blanke onclick. Daran wird der Vortraege-Knopf erkannt: frueher hing
       die Suche an data-groups, und das Attribut markiert den GRUPPEN-Umschalter.
       inf11 und informatik9 haben nur eine Liste je Seite und deshalb kein
       data-groups - dort wurde der Knopf nie gruen, obwohl alles vergeben war
       (Doc, 22.09.2026: "Vortraege nicht gruen? Alle sind vergeben"). */
    function talkBtnZiel(b) {
        return b.getAttribute('data-href') || b.getAttribute('onclick') || '';
    }
    function talkButtons() {
        return [].slice.call(document.querySelectorAll('button')).filter(function (b) {
            return /-vortraege\.html/.test(talkBtnZiel(b));
        });
    }

    async function markTalksDone(plan, themen) {
        const btns = talkButtons();
        const keys = Object.keys(themen);
        if (!btns.length || !keys.length || !window.svpAuth) return;
        /* eine Abfrage fuer den ganzen Plan, danach je Lerngruppe getrennt -
           informatik9 hat zwei Knoepfe (9a und 9b) mit je eigener Liste. */
        const res = await fetch(svpAuth.DB_URL + '/rest/v1/svp_vortrag_namen' +
            '?plan=eq.' + encodeURIComponent(plan) +
            '&taken=is.true&select=klasse,idx',
            { headers: { apikey: svpAuth.DB_KEY, Authorization: 'Bearer ' + svpAuth.DB_KEY } });
        if (!res.ok) return;
        const rows = await res.json();
        btns.forEach(function (btn) {
            /* "informatik9b-vortraege.html" -> "informatik9b" endet auf den
               Schluessel "b". Mit ?g= zaehlt die gewaehlte Gruppe, sonst die
               einzige - und nur wenn nichts passt, die erste. */
            const seite = (talkBtnZiel(btn).match(/([A-Za-z0-9_+-]+)-vortraege\.html/) || [])[1] || '';
            const treffer = keys.find(function (k) { return seite.endsWith(k); });
            /* Laesst sich der Knopf keiner einzelnen Gruppe zuordnen (fos12 ohne
               ?g=), dann zaehlen ALLE - gruen heisst dort: bei jeder Gruppe ist
               alles vergeben. Frueher entschied stumm die erste Gruppe. */
            const zu = P.GROUP ? [P.GROUP] : (treffer ? [treffer] : keys);
            const ids = zu.reduce(function (a, k) { return a.concat(themen[k] || []); }, []);
            if (!ids.length) return;
            const offen = zu.reduce(function (n, k) {
                const belegt = new Set(rows.filter(function (r) { return r.klasse === k; })
                    .map(function (r) { return r.idx; }));
                return n + (themen[k] || []).filter(function (id) { return !belegt.has(id); }).length;
            }, 0);
            btn.classList.toggle('vortraege-voll', !offen);
            /* Der Titel sagt, warum der Knopf gruen ist - oder wie viel noch fehlt. */
            btn.title = btn.title.replace(/\s—\s(alle vergeben|noch\s\d+.*)$/, '') +
                (offen ? ' — noch ' + offen + (offen === 1 ? ' Thema' : ' Themen') + ' ohne Namen'
                       : ' — alle vergeben');
        });
    }
});
