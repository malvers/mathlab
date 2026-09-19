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
        const pages = [base].concat(klassen.map(function (k) { return base + '/' + k[0]; }),
            klassen.filter(function (k) { return k[1]; }).map(function (k) { return base + '/' + String(k[1]).replace(/[^A-Za-z0-9-]+/g, '_'); }));
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
        /* Doc's shared list in its order, else the built-in topics */
        const seen = new Set();
        let cat = [];
        (Array.isArray(edits(base).list) ? edits(base).list : []).forEach(function (e) {
            const id = +(e && e.id);
            if (!Number.isFinite(id) || id < 0 || seen.has(id)) return;
            seen.add(id);
            cat.push({ id: id, title: typeof e.title === 'string' ? e.title : '' });
        });
        if (!cat.length) cat = (def.topics || []).map(function (t, i) { return { id: i, title: t.title }; });
        /* kw -> Lerngruppe label -> ["1 · Titel", ...] */
        const byKw = {};
        klassen.forEach(function (k) {
            const m = edits(metaPage(k));
            const fundus = new Set((Array.isArray(m.fundus) ? m.fundus : []).map(Number));
            const order = Array.isArray(m.order) ? m.order.map(Number) : null;
            const list = V.arrange(cat, order).filter(function (e) { return !fundus.has(e.id); });
            const own = V.datesFor(def, k[0]);
            const md = m.dates && typeof m.dates === 'object' ? m.dates : {};
            list.forEach(function (e, pos) {
                const iso = Object.prototype.hasOwnProperty.call(md, pos) ? md[pos] : own[pos];
                if (!iso) return;
                const w = P.isoWeek(new Date(iso + 'T12:00:00'));   /* the one markCurrentWeek uses */
                const g = (byKw[w] = byKw[w] || {});
                (g[k[1]] = g[k[1]] || []).push((pos + 1) + ' · ' + e.title);
            });
        });
        P.rendered.forEach(function (ref) {
            const g = ref.kw != null && byKw[+ref.kw];
            if (!g || !ref.ensureSubRow) return;
            const labels = Object.keys(g);
            const texts = labels.map(function (l) { return g[l].join(' · '); });
            /* the same talk in every Lerngruppe: one line without the group */
            ref.talk = texts.every(function (t) { return t === texts[0]; })
                ? [['Vortrag:', texts[0]]]
                : labels.map(function (l, n) { return [(n ? '' : 'Vortrag ') + l + ':', texts[n]]; });
            /* Doc, 18.09.2026: more than one talk in the week (inf11: two per day, FOS 12:
               two per group) - "laufbandmaessig durchlaufen" */
            ref.talkTicker = labels.some(function (l) { return g[l].length > 1; }) || ref.talk.length > 1;
            ref.ensureSubRow();
            paintTalk(ref);
        });
    }
});
