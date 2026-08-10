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

    function buildDetailList(ul, items) {
        ul.textContent = '';
        for (const item of items) {
            const li = document.createElement('li');
            li.textContent = item;
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
            } else if (idx !== 5) {
                td.textContent = text;
            }
            tds.push(td);
            tr.appendChild(td);
        });

        // Topic cell: optional chevron + editable text span.
        const topicSpan = document.createElement('span');
        topicSpan.className = 'topic-text';
        topicSpan.textContent = ov.topic != null ? ov.topic : row.topic;
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
            const td = document.createElement('td');
            td.colSpan = 7;
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

    function setEditable(on) {
        const flag = on ? 'true' : 'false';
        for (const r of rendered) {
            for (const el of [r.ferienTd, r.dateTd, r.uTd, r.topicSpan, r.remarkTd, r.ul]) {
                if (el) el.setAttribute('contenteditable', flag);
            }
        }
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

    window.resetPlanEdits = function () {
        if (confirm('Lokale Änderungen verwerfen und Original laden?')) {
            localStorage.removeItem(KEY);
            location.reload();
        }
    };

    // Safety net: persist pending edits when the tab closes mid-edit.
    window.addEventListener('beforeunload', () => {
        if (document.body.classList.contains('editing')) saveEdits();
    });
})();
