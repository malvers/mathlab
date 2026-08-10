// Shared renderer for the Stoffverteilungsplan pages.
// Each page defines window.PLAN (array of week rows / holiday rows)
// and window.BADGE (type -> [cssClass, label]) before including this script.
(function () {
    const tbody = document.querySelector('#plan-table tbody');
    if (!tbody || !window.PLAN || !window.BADGE) return;

    for (const row of window.PLAN) {
        const tr = document.createElement('tr');
        if (row.ferien) {
            tr.className = 'ferien';
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = row.ferien;
            tr.appendChild(td);
        } else {
            const [badgeClass, badgeLabel] = window.BADGE[row.type];
            const cells = [
                ['num', String(row.nr)],
                ['num', String(row.kw)],
                ['date', row.date],
                ['', null],
                ['num', row.u],
                ['topic', row.topic],
                ['remark', row.remark]
            ];
            cells.forEach(([cls, text], i) => {
                const td = document.createElement('td');
                if (cls) td.className = cls;
                if (i === 3) {
                    const span = document.createElement('span');
                    span.className = 'badge ' + badgeClass;
                    span.textContent = badgeLabel;
                    td.appendChild(span);
                } else {
                    td.textContent = text;
                }
                tr.appendChild(td);
            });
        }
        tbody.appendChild(tr);
    }
})();
