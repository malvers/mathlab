// Shared renderer for the Stoffverteilungsplan pages.
// Each page defines window.PLAN (array of week rows / holiday rows)
// and window.BADGE (type -> [cssClass, label]) before including this script.
// Week rows may carry details: ['bullet', ...] — rendered as an expandable sub-row.
// Edit mode (togglePlanEdit): cells become contenteditable; changes are saved
// to localStorage per page and re-applied on load. resetPlanEdits() clears them.
(function () {
    const tbody = document.querySelector('#plan-table tbody');
    if (!tbody || !window.PLAN || !window.BADGE) return;

    const KEY = 'svp-edits:' + location.pathname;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }

    // Per-row references for edit mode and persistence.
    const rendered = [];

    // --- LaTeX support ---------------------------------------------------
    // Formulas in PLAN strings use $...$ (KaTeX inline math). KaTeX is loaded
    // on demand, only when a page actually contains math. Edit mode always
    // shows and saves the raw $...$ source (see setEditable).
    const KATEX = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min';
    const mathEls = new Set();

    function renderMathInto(el) {
        const src = el.dataset.src || '';
        if (!window.katex) { el.textContent = src; return; }
        el.textContent = '';
        src.split(/\$([^$]+)\$/).forEach((part, idx) => {
            if (!part) return;
            if (idx % 2 === 0) {
                el.appendChild(document.createTextNode(part));
            } else {
                const span = document.createElement('span');
                try { katex.render(part, span, { throwOnError: false }); }
                catch (e) { span.textContent = '$' + part + '$'; }
                el.appendChild(span);
            }
        });
    }

    function ensureKatex() {
        if (window.katex || document.getElementById('katex-js')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = KATEX + '.css';
        document.head.appendChild(link);
        const s = document.createElement('script');
        s.id = 'katex-js';
        s.src = KATEX + '.js';
        s.onload = () => {
            if (document.body.classList.contains('editing')) return;
            mathEls.forEach(el => { if (el.isConnected) renderMathInto(el); });
        };
        document.head.appendChild(s);
    }

    // Sets text that may contain $...$ math; keeps the raw source in data-src.
    function setMathText(el, text) {
        text = text == null ? '' : String(text);
        el.dataset.src = text;
        if (text.includes('$')) {
            mathEls.add(el);
            ensureKatex();
            renderMathInto(el);
        } else {
            mathEls.delete(el);
            el.textContent = text;
        }
    }

    function buildDetailList(ul, items) {
        ul.textContent = '';
        for (const item of items) {
            const li = document.createElement('li');
            setMathText(li, item);
            ul.appendChild(li);
        }
    }

    window.PLAN.forEach((row, i) => {
        const ov = saved[i] || {};
        const tr = document.createElement('tr');

        if (row.ferien) {
            tr.className = 'ferien';
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = ov.ferien || row.ferien;
            tr.appendChild(td);
            tbody.appendChild(tr);
            rendered.push({ i, ferienTd: td });
            return;
        }

        const [badgeClass, badgeLabel] = window.BADGE[row.type];
        const tds = [];
        const values = [
            ['num', String(row.nr)],
            ['num', String(row.kw)],
            ['date', ov.date != null ? ov.date : row.date],
            ['', null],
            ['num', ov.u != null ? ov.u : row.u],
            ['topic', null],
            ['remark', ov.remark != null ? ov.remark : row.remark]
        ];
        values.forEach(([cls, text], idx) => {
            const td = document.createElement('td');
            if (cls) td.className = cls;
            if (idx === 3) {
                const span = document.createElement('span');
                span.className = 'badge ' + badgeClass;
                span.textContent = badgeLabel;
                td.appendChild(span);
            } else if (idx !== 5 && idx !== 6) {
                td.textContent = text;
            }
            tds.push(td);
            tr.appendChild(td);
        });
        setMathText(tds[6], values[6][1]);

        // Topic cell: optional chevron + editable text span.
        const topicSpan = document.createElement('span');
        topicSpan.className = 'topic-text';
        setMathText(topicSpan, ov.topic != null ? ov.topic : row.topic);
        tds[5].appendChild(topicSpan);
        tbody.appendChild(tr);

        const ref = { i, dateTd: tds[2], uTd: tds[4], topicSpan, remarkTd: tds[6], ul: null };

        const detailItems = ov.details || row.details;
        if (detailItems && detailItems.length) {
            tr.classList.add('expandable');
            const chev = document.createElement('span');
            chev.className = 'chev';
            chev.textContent = '▸';
            tds[5].insertBefore(chev, topicSpan);

            const detailTr = document.createElement('tr');
            detailTr.className = 'detail-row';
            // Empty spacer under columns 1-5 so the bullets sit under the topic column.
            const spacer = document.createElement('td');
            spacer.colSpan = 5;
            detailTr.appendChild(spacer);
            const td = document.createElement('td');
            td.colSpan = 2;
            const ul = document.createElement('ul');
            buildDetailList(ul, detailItems);
            td.appendChild(ul);
            detailTr.appendChild(td);
            tbody.appendChild(detailTr);
            ref.ul = ul;

            tr.addEventListener('click', () => {
                if (document.body.classList.contains('editing')) return;
                tr.classList.toggle('open');
                detailTr.classList.toggle('open');
            });
        }

        rendered.push(ref);
    });

    function setAllDetails(open) {
        document.querySelectorAll('tr.detail-row').forEach(r => {
            r.classList.toggle('open', open);
            r.previousElementSibling.classList.toggle('open', open);
        });
    }

    // Toolbar helper: expand/collapse all detail rows at once.
    window.togglePlanDetails = function () {
        const rows = Array.from(document.querySelectorAll('tr.detail-row'));
        setAllDetails(rows.some(r => !r.classList.contains('open')));
    };

    // Cells that may contain $...$ math (detail lis queried live — edit mode
    // can add new ones via Enter inside the contenteditable ul).
    function eachMathCandidate(fn) {
        for (const r of rendered) {
            if (r.topicSpan) fn(r.topicSpan);
            if (r.remarkTd) fn(r.remarkTd);
            if (r.ul) r.ul.querySelectorAll('li').forEach(fn);
        }
    }

    function setEditable(on) {
        const flag = on ? 'true' : 'false';
        for (const r of rendered) {
            for (const el of [r.ferienTd, r.dateTd, r.uTd, r.topicSpan, r.remarkTd, r.ul]) {
                if (el) el.setAttribute('contenteditable', flag);
            }
        }
        // While editing show the raw $...$ source; on exit re-render from the
        // (possibly edited) text. saveEdits runs before this, so it saves raw.
        eachMathCandidate(el => {
            if (on) {
                if (el.dataset.src != null) el.textContent = el.dataset.src;
            } else {
                setMathText(el, el.textContent);
            }
        });
    }

    function saveEdits() {
        const out = {};
        for (const r of rendered) {
            if (r.ferienTd) {
                out[r.i] = { ferien: r.ferienTd.textContent.trim() };
            } else {
                const entry = {
                    date: r.dateTd.textContent.trim(),
                    u: r.uTd.textContent.trim(),
                    topic: r.topicSpan.textContent.trim(),
                    remark: r.remarkTd.textContent.trim()
                };
                if (r.ul) {
                    entry.details = Array.from(r.ul.querySelectorAll('li'))
                        .map(li => li.textContent.trim())
                        .filter(t => t.length);
                }
                out[r.i] = entry;
            }
        }
        localStorage.setItem(KEY, JSON.stringify(out));
        localStorage.setItem(TS_KEY, new Date().toISOString());
        pushRemote();
    }

    window.togglePlanEdit = function (btn) {
        const editing = document.body.classList.toggle('editing');
        if (editing) {
            setAllDetails(true);
        } else {
            saveEdits();
        }
        setEditable(editing);
        if (btn) btn.textContent = editing ? '✔ Fertig' : '✎ Bearbeiten';
    };

    // Two-click confirm (no native dialogs): first click arms the button, second click resets.
    window.resetPlanEdits = function (btn) {
        if (btn && !btn.dataset.armed) {
            btn.dataset.armed = '1';
            const original = btn.textContent;
            btn.textContent = 'Wirklich? Nochmal klicken';
            setTimeout(() => {
                delete btn.dataset.armed;
                btn.textContent = original;
            }, 3000);
            return;
        }
        localStorage.removeItem(KEY);
        localStorage.removeItem(TS_KEY);
        const done = () => location.reload();
        if (window.svpAuth && svpAuth.hasSession()) {
            svpAuth.api('svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname), { method: 'DELETE' })
                .catch(() => {}).then(done, done);
        } else done();
    };

    // Safety net: persist pending edits when the tab closes mid-edit.
    window.addEventListener('beforeunload', () => {
        if (document.body.classList.contains('editing')) saveEdits();
    });

    // --- Supabase sync (table svp_plan_edits, RLS owner-only) ------------
    // Reuses the svp-session login from notes.html (shared svp-auth.js).
    // Logged out: local-only, exactly as before. Logged in: whole edits
    // object is synced per page, last write wins by timestamp (TS_KEY).
    const TS_KEY = 'svp-edits-ts:' + location.pathname;
    const cloudEl = document.createElement(window.svpAuth && svpAuth.hasSession() ? 'span' : 'a');
    cloudEl.className = 'cloud';
    (function () {
        const bar = document.querySelector('.toolbar');
        if (!bar) return;
        if (cloudEl.tagName === 'A') {
            cloudEl.href = '../notes.html';
            cloudEl.textContent = '☁ lokal';
            cloudEl.title = 'Edits nur in diesem Browser — für Cloud-Sync über die Notizen-Seite anmelden';
        }
        bar.appendChild(cloudEl);
    })();

    function setCloud(text, ok) {
        if (cloudEl.tagName === 'A') return; /* logged out: keep the login hint */
        cloudEl.textContent = text;
        cloudEl.classList.toggle('on', !!ok);
    }

    // Re-applies an edits object to the already rendered table (remote wins).
    function applyEdits(map) {
        for (const r of rendered) {
            const ov = map[r.i] || {};
            const row = window.PLAN[r.i];
            if (r.ferienTd) {
                r.ferienTd.textContent = ov.ferien || row.ferien;
                continue;
            }
            r.dateTd.textContent = ov.date != null ? ov.date : row.date;
            r.uTd.textContent = ov.u != null ? ov.u : row.u;
            setMathText(r.topicSpan, ov.topic != null ? ov.topic : row.topic);
            setMathText(r.remarkTd, ov.remark != null ? ov.remark : row.remark);
            if (r.ul) buildDetailList(r.ul, ov.details || row.details || []);
        }
    }

    function pushRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        const ts = localStorage.getItem(TS_KEY) || new Date().toISOString();
        svpAuth.api('svp_plan_edits', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify([{
                page: location.pathname,
                edits: JSON.parse(localStorage.getItem(KEY) || '{}'),
                ts: ts
            }])
        }).then(res => setCloud(res.ok ? '☁ synchron' : '☁ Fehler: HTTP ' + res.status, res.ok))
            .catch(e => setCloud('☁ ' + e.message, false));
    }

    async function syncFromRemote() {
        if (!window.svpAuth || !svpAuth.hasSession()) return;
        try {
            const res = await svpAuth.api(
                'svp_plan_edits?page=eq.' + encodeURIComponent(location.pathname) + '&select=edits,ts');
            if (!res.ok) { setCloud('☁ Fehler: HTTP ' + res.status, false); return; }
            const rows = await res.json();
            const localTs = Date.parse(localStorage.getItem(TS_KEY) || '') || 0;
            if (!rows.length) {
                /* nothing in the cloud yet — seed it from local edits if any */
                if (localStorage.getItem(KEY)) pushRemote();
                else setCloud('☁ synchron', true);
                return;
            }
            const remoteTs = Date.parse(rows[0].ts) || 0;
            if (remoteTs > localTs) {
                saved = rows[0].edits || {};
                localStorage.setItem(KEY, JSON.stringify(saved));
                localStorage.setItem(TS_KEY, rows[0].ts);
                applyEdits(saved);
                setCloud('☁ synchron', true);
            } else if (localTs > remoteTs) {
                pushRemote(); /* offline edits from this browser win */
            } else {
                setCloud('☁ synchron', true);
            }
        } catch (e) { setCloud('☁ ' + e.message, false); }
    }

    syncFromRemote();
})();
