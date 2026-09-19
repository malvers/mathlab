// Stoffverteilungsplan renderer, part "export": the export view of the plan.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // functions the other parts call
    Object.assign(P, {
        lbMeta, buildExport
    });

    // --- Print export ------------------------------------------------------
    // Printing a plan page produces a clean, light SVP document (Raleway),
    // built fresh from PLAN + local edits on every print: header block,
    // Lernbereich banners (from the meta cards) and one row per week.
    document.body.classList.add('has-export');
    (function loadRaleway() {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&display=swap';
        document.head.appendChild(l);
    })();

    // Lernbereich meta per type, read off the meta cards — shared by both
    // exports (Stoffverteilungsplan banner rows and Modulablaufplan blocks).
    function lbMeta() {
        const out = {};
        document.querySelectorAll('.meta-card[data-lb]').forEach(card => {
            const k = card.querySelector('.k');
            out[card.dataset.lb] = {
                /* long name ("Lernbereich 2"); the head itself shows "LB 2" + pill */
                k: k ? (k.dataset.full || k.textContent) : '',
                v: card.querySelector('.v') ? card.querySelector('.v').textContent : '',
                vu: card.querySelector('.vu') ? card.querySelector('.vu').textContent : ''
            };
        });
        return out;
    }

    function buildExport() {
        P.building = true;
        const old = document.getElementById('svp-export');
        if (old) old.remove();
        const ex = document.createElement('div');
        ex.id = 'svp-export';

        const h1 = document.querySelector('h1');
        const sub = document.querySelector('.page-head .subtitle');
        const head = document.createElement('header');
        head.innerHTML =
            '<div class="x-doc">Stoffverteilungsplan · Schuljahr 2026/27</div>' +
            '<div class="x-title"></div>' +
            '<div class="x-sub"></div>' +
            '<div class="x-meta">Name: Dr. Michael R. Alvers · IBB Berufliche Schulen Dresden · Stand: ' +
            new Date().toLocaleDateString('de-DE') + '</div>';
        head.querySelector('.x-title').textContent = h1 ? h1.textContent : 'Stoffverteilungsplan';
        head.querySelector('.x-sub').textContent =
            sub ? sub.textContent.replace(/\s+/g, ' ').trim() : '';
        ex.appendChild(head);

        // Lernbereich meta (banner text per type) from the meta cards.
        const metaByType = lbMeta();

        // Ziele column (Vorlage: Inhalte | Ziele | Bemerkungen) — only when
        // the page's PLAN rows carry ziel fields (derived from the Lerninhalte).
        const hasZiele = P.planRows.some(function (r, i) { return r.ziel || (P.saved[i] || {}).ziel; });
        const cols = hasZiele ? 6 : 5;

        const table = document.createElement('table');
        table.innerHTML =
            '<thead><tr><th>KW</th><th>Woche</th><th>Ustd.</th>' +
            '<th>Unterrichtsinhalte</th>' + (hasZiele ? '<th>Ziele</th>' : '') +
            '<th>Bemerkungen</th></tr></thead>';
        const xbody = document.createElement('tbody');
        const seenLb = new Set();

        /* planRows, not window.PLAN: a shift can push content into weeks that
           exist only in the edits — those must reach the paper too. */
        P.planRows.forEach((row, i) => {
            const ov = P.saved[i] || {};
            if (ov.ferien || row.ferien) {
                const tr = document.createElement('tr');
                tr.className = 'x-fer';
                const td = document.createElement('td');
                td.colSpan = cols;
                td.textContent = ov.ferien || row.ferien;
                tr.appendChild(td);
                xbody.appendChild(tr);
                return;
            }
            const rowType = ov.type || row.type || 'org';
            const [badgeClass] = window.BADGE[rowType] || window.BADGE.org;

            // First week of a Lernbereich: banner row with name + Ustd.
            if (metaByType[rowType] && !seenLb.has(rowType)) {
                seenLb.add(rowType);
                const m = metaByType[rowType];
                const tr = document.createElement('tr');
                tr.className = 'x-lb ' + badgeClass;
                const td = document.createElement('td');
                td.colSpan = cols;
                td.textContent = m.k + ' · ' + m.v + (m.vu ? ' · ' + m.vu : '');
                tr.appendChild(td);
                xbody.appendChild(tr);
            }

            const tr = document.createElement('tr');
            tr.className = 'x-week ' + badgeClass;
            const kw = document.createElement('td');
            kw.className = 'x-kw';
            kw.textContent = ov.kw != null ? ov.kw : row.kw;
            const date = document.createElement('td');
            date.className = 'x-date';
            // Drop the trailing year (17.–21.08.26 → 17.–21.08.; the school year
            // is in the header) and set start/end on their own lines, so the
            // column stays as narrow as one date.
            const dtxt = String(ov.date != null ? ov.date : row.date).replace(/\.\d{2}$/, '.');
            const dash = dtxt.indexOf('–');
            if (dash > -1) {
                const a = document.createElement('span');
                a.textContent = dtxt.slice(0, dash + 1);
                const b = document.createElement('span');
                b.textContent = dtxt.slice(dash + 1);
                date.appendChild(a);
                date.appendChild(b);
            } else {
                date.textContent = dtxt;
            }
            const u = document.createElement('td');
            u.className = 'x-u';
            // Ustd. like "7/13" or "19–20/24" break after the slash, same idea
            // as the date: two short lines instead of one wide column.
            const utxt = String(ov.u != null ? ov.u : (row.u || ''));
            const slash = utxt.indexOf('/');
            if (slash > -1) {
                const a = document.createElement('span');
                a.textContent = utxt.slice(0, slash + 1);
                const b = document.createElement('span');
                b.textContent = utxt.slice(slash + 1);
                u.appendChild(a);
                u.appendChild(b);
            } else {
                u.textContent = utxt;
            }
            const inh = document.createElement('td');
            inh.className = 'x-inh';
            const strong = document.createElement('b');
            P.setMathText(strong, ov.topic != null ? ov.topic : row.topic);
            inh.appendChild(strong);
            const items = ov.details || row.details;
            if (items && items.length) {
                const ul = document.createElement('ul');
                P.buildDetailList(ul, items);
                inh.appendChild(ul);
            }
            const cells = [kw, date, u, inh];
            if (hasZiele) {
                // Ziel cell: leading Lernziel verb (Kennen/Beherrschen/…) bold,
                // like in the official template.
                const ziel = document.createElement('td');
                ziel.className = 'x-ziel';
                const text = ov.ziel != null ? ov.ziel : (row.ziel || '');
                const sp = text.indexOf(' ');
                if (sp > 0) {
                    const b = document.createElement('b');
                    b.textContent = text.slice(0, sp);
                    ziel.appendChild(b);
                    ziel.appendChild(document.createTextNode(text.slice(sp)));
                } else {
                    ziel.textContent = text;
                }
                cells.push(ziel);
            }
            const rem = document.createElement('td');
            rem.className = 'x-rem';
            P.setMathText(rem, ov.remark != null ? ov.remark : row.remark);
            cells.push(rem);
            cells.forEach(td => tr.appendChild(td));
            xbody.appendChild(tr);
        });

        table.appendChild(xbody);
        ex.appendChild(table);
        document.body.appendChild(ex);
        P.building = false;
    }
});
