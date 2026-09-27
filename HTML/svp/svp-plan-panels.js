// Stoffverteilungsplan renderer, part "panels": Lernbereich panels and the bridge panel of the cards.
// Loaded by svp-plan.js, run by svp-plan-run.js - how the parts talk to each other: see svp-plan.js.
window.svpPlanParts.push(function (P) {
    // The LB info panel and the bridge panel are mutually exclusive —
    // opening one closes the other (hooks set by the two blocks below).
    let closeLbPanel = null, closeBridgePanel = null;

    // --- Lernbereich info panels -----------------------------------------
    // Meta cards carrying data-lb open a shared summary panel below the
    // card row: bullets from the page's LB_INFO, week stats computed from
    // PLAN, and a deep link into the Lehrplan PDF (#page=N).
    (function () {
        const cards = document.querySelectorAll('.meta-card[data-lb]');
        const grid = document.querySelector('.meta-cards');
        if (!cards.length || !grid || !window.LB_INFO) return;

        const panel = document.createElement('div');
        panel.className = 'lb-panel';
        panel.hidden = true;
        grid.insertAdjacentElement('afterend', panel);
        let openKey = null;

        // Which card is open is remembered per page, per browser.
        const STORE_KEY = 'svp-lb-open:' + location.pathname;
        function remember(key) {
            try {
                if (key) localStorage.setItem(STORE_KEY, key);
                else localStorage.removeItem(STORE_KEY);
            } catch (e) { }
        }

        // Chevron marks the cards as expandable, matching the plan rows.
        cards.forEach(card => {
            card.classList.add('expandable');
            const chev = document.createElement('span');
            chev.className = 'chev';
            chev.textContent = '▸';
            card.insertBefore(chev, card.firstChild);
        });

        closeLbPanel = function () {
            openKey = null;
            panel.hidden = true;
            cards.forEach(c => c.classList.remove('open'));
        };

        function statsFor(key) {
            const rows = window.PLAN.filter(r => r.type === key);
            if (!rows.length) return '';
            const first = rows[0], last = rows[rows.length - 1];
            if (rows.length === 1) return 'Im Plan: Woche ' + first.nr + ' (' + first.date + ')';
            return 'Im Plan: ' + rows.length + ' Wochen, von Woche ' + first.nr + ' (' + first.date +
                ') bis Woche ' + last.nr + ' (' + last.date + ')';
        }

        function showCard(card) {
            const key = card.dataset.lb;
            openKey = key;
            if (closeBridgePanel) closeBridgePanel();
            cards.forEach(c => c.classList.toggle('open', c === card));
            const info = window.LB_INFO[key] || {};
            panel.textContent = '';

            const title = document.createElement('div');
            title.className = 'lb-panel-title';
            const kEl = card.querySelector('.k');
            const vEl = card.querySelector('.v');
            title.textContent = (kEl ? kEl.textContent + ' — ' : '') + (vEl ? vEl.textContent : '');
            panel.appendChild(title);

            const ul = document.createElement('ul');
            (info.bullets || []).forEach(b => {
                const li = document.createElement('li');
                P.setMathText(li, b);
                ul.appendChild(li);
            });
            panel.appendChild(ul);

            const foot = document.createElement('div');
            foot.className = 'lb-panel-foot';
            foot.textContent = statsFor(key);
            if (window.LB_INFO.pdf) {
                const a = document.createElement('a');
                const pg = info.page || window.LB_INFO.page;
                a.href = window.LB_INFO.pdf + (pg ? '#page=' + pg : '');
                a.target = '_blank';
                a.rel = 'noopener';
                a.textContent = 'im Lehrplan (PDF)';
                foot.appendChild(document.createTextNode(' · '));
                foot.appendChild(a);
            }
            panel.appendChild(foot);
            panel.hidden = false;
        }

        cards.forEach(card => card.addEventListener('click', () => {
            if (openKey === card.dataset.lb) {
                closeLbPanel();
                remember(null);
                return;
            }
            showCard(card);
            remember(card.dataset.lb);
        }));

        // Nothing opens by default — restore the card left open last time.
        let stored = null;
        try { stored = localStorage.getItem(STORE_KEY); } catch (e) { }
        if (stored) {
            const card = [...cards].find(c => c.dataset.lb === stored);
            if (card) showCard(card);
        }
    })();

    // --- Bridge card (cross-subject links, free-form editable) ------------
    // Pages define window.BRIDGE = { label, sub, html } to get an extra meta
    // card whose panel is always-editable rich text (like the notes page):
    // auto-save to localStorage, cloud sync via the svp_plan_edits table
    // under the pseudo page '<path>#bridge'. Last write wins by timestamp.
    (function () {
        const grid = document.querySelector('.meta-cards');
        if (!window.BRIDGE || !grid) return;
        const BKEY = 'svp-bridge:' + location.pathname;
        const BTS = BKEY + ':ts';
        const PAGE = location.pathname + '#bridge';

        const card = document.createElement('div');
        card.className = 'meta-card bridge-card';
        const k = document.createElement('div');
        k.className = 'k c-green';
        k.textContent = window.BRIDGE.label || 'Bridge';
        const v = document.createElement('div');
        v.className = 'v';
        v.textContent = window.BRIDGE.sub || 'Verzahnung der Fächer';
        card.appendChild(k);
        card.appendChild(v);
        grid.appendChild(card);

        const panel = document.createElement('div');
        panel.className = 'lb-panel bridge-panel';
        panel.hidden = true;
        grid.insertAdjacentElement('afterend', panel);

        // Hint sits at the top right of the box (before the editable body).
        const foot = document.createElement('div');
        foot.className = 'lb-panel-foot bridge-hint';
        const HINT = '✎ frei editierbar — speichert automatisch';
        foot.textContent = HINT;
        panel.appendChild(foot);

        const body = document.createElement('div');
        body.className = 'bridge-body';
        body.setAttribute('contenteditable', 'true');
        /* The text is stored as HTML and comes back from the cloud for every visitor - it is set through
           svpFmtBar.safe (structure stays, nothing runs), here and at every pull below (audit 27.09.2026). */
        body.innerHTML = svpFmtBar.safe(localStorage.getItem(BKEY) || window.BRIDGE.html || '');
        panel.appendChild(body);

        closeBridgePanel = function () {
            panel.hidden = true;
            card.classList.remove('open');
        };

        card.addEventListener('click', () => {
            panel.hidden = !panel.hidden;
            card.classList.toggle('open', !panel.hidden);
            if (!panel.hidden && closeLbPanel) closeLbPanel();
        });

        /* Saved the safe way (27.09.2026, svpAuth.sicherSpeichern): on the row this text was built on - if another
           device wrote meanwhile, merged, never the whole text over a newer one unseen. */
        const BBASE = BKEY + ':basis';
        /* per tab (two tabs share localStorage); localStorage only carries it over a reload */
        let bTab = null;
        const bBasis = () => { if (bTab) return bTab; try { return JSON.parse(localStorage.getItem(BBASE) || 'null'); } catch (e) { return null; } };
        const bBasisSetzen = (ts, daten) => { bTab = { ts: ts, daten: JSON.parse(JSON.stringify(daten || {})) }; try { localStorage.setItem(BBASE, JSON.stringify(bTab)); } catch (e) { } };
        function pushBridge() {
            if (!window.svpAuth || !svpAuth.hasSession()) return;
            const gesendet = { html: localStorage.getItem(BKEY) || '' };
            svpAuth.sicherSpeichern({ tabelle: 'svp_plan_edits', spalte: 'edits', seite: PAGE, lokal: gesendet, basis: bBasis() })
                .then(r => {
                    foot.textContent = HINT + (r.ok ? ' · ☁ synchron' : ' · ' + P.cloudErr(r.status));
                    if (!r.ok) return;
                    bBasisSetzen(r.ts, r.daten);
                    localStorage.setItem(BTS, r.ts);
                    if (r.gemischt && (localStorage.getItem(BKEY) || '') === gesendet.html) {
                        localStorage.setItem(BKEY, (r.daten && r.daten.html) || '');
                        body.innerHTML = svpFmtBar.safe((r.daten && r.daten.html) || '');
                    }
                }).catch(() => {});
        }

        let timer = null;
        body.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                localStorage.setItem(BKEY, body.innerHTML);
                localStorage.setItem(BTS, new Date().toISOString());
                pushBridge();
            }, 600);
        });

        (async function pullBridge() {
            if (!window.svpAuth) return;
            if (!svpAuth.hasSession()) {
                /* visitor without login: read-only pull of the bridge text */
                try {
                    const row = await P.fetchPublicEdits(PAGE);
                    const localTs = Date.parse(localStorage.getItem(BTS) || '') || 0;
                    if (row && (Date.parse(row.ts) || 0) > localTs) {
                        localStorage.setItem(BKEY, row.edits.html || '');
                        localStorage.setItem(BTS, row.ts);
                        body.innerHTML = svpFmtBar.safe(row.edits.html || '');
                    }
                } catch (e) { /* offline: local copy stays */ }
                return;
            }
            try {
                const res = await svpAuth.api(
                    'svp_plan_edits?page=eq.' + encodeURIComponent(PAGE) + '&select=edits,ts');
                if (!res.ok) return;
                const rows = await res.json();
                const localTs = Date.parse(localStorage.getItem(BTS) || '') || 0;
                if (!rows.length) {
                    if (localStorage.getItem(BKEY)) pushBridge();
                    return;
                }
                const remoteTs = Date.parse(rows[0].ts) || 0;
                if (remoteTs > localTs) {
                    bBasisSetzen(rows[0].ts, rows[0].edits);
                    localStorage.setItem(BKEY, rows[0].edits.html || '');
                    localStorage.setItem(BTS, rows[0].ts);
                    body.innerHTML = svpFmtBar.safe(rows[0].edits.html || '');
                    foot.textContent = HINT + ' · ☁ synchron';
                } else if (localTs > remoteTs) {
                    pushBridge();          /* merged onto the cloud row (its base: the last one seen here) */
                } else {
                    bBasisSetzen(rows[0].ts, rows[0].edits);
                    foot.textContent = HINT + ' · ☁ synchron';
                }
            } catch (e) { /* offline: local copy stays */ }
        })();
    })();
});
