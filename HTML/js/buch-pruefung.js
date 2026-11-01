/* buch-pruefung.js — widgets of the training book (buch/pruefung/), Doc, 01.11.2026: "ich möchte daraus ein Mathebuch bauen".
 *   titelbildpruefung  the cover: the cubic of the first Abitur task with its parallel tangents, B(12; 0,25) of the
 *                      lot stall, five boxes to tick - every drawing is one of the book's own tasks
 *   beverteilung       the marks of an exam as one bar, data-teile='[["Teil A", 25], ...]'
 *   pruefungsuhr       the clock for a rehearsal, data-min="155"
 * Looks: js/buch.css (section "training book"), js/buch-titel.css. The chapters are generated once by tools/buch-pruefung/.
 */
(function () {
    'use strict';
    const B = window.Buch;
    const W = B.widget;

    W('titelbildpruefung', function (box) {
        const Wd = 600, Ht = 850;
        const X = x => 46 + (x + 0.5) / 5.1 * 508, Y = y => 772 - (y + 1.4) / 7.2 * 306;
        const f = x => x * x * x - 6 * x * x + 9 * x, n1 = v => v.toFixed(1);
        let d = '';
        for (let i = 0; i <= 200; i++) { const x = -0.13 + 4.63 * i / 200; d += (i ? 'L' : 'M') + n1(X(x)) + ' ' + n1(Y(f(x))); }
        let grid = '';
        for (let x = 0; x <= Wd; x += 50) grid += '<line x1="' + x + '" y1="400" x2="' + x + '" y2="' + Ht + '" />';
        for (let y = 400; y <= Ht; y += 50) grid += '<line x1="0" y1="' + y + '" x2="' + Wd + '" y2="' + y + '" />';
        // B(12; 0,25): the lot stall of the Stochastik chapter
        let bars = '', c = Math.pow(0.75, 12);
        for (let k = 0; k <= 9; k++) {
            const h = c * 560;
            bars += '<rect x="' + (66 + k * 27) + '" y="' + n1(772 - h) + '" width="21" height="' + n1(h) + '" rx="2" />';
            c = c * (12 - k) / (k + 1) * (0.25 / 0.75);
        }
        const tang = (x0, a, b) => '<line x1="' + n1(X(x0 + a)) + '" y1="' + n1(Y(f(x0) + 9 * a)) + '" x2="' + n1(X(x0 + b)) + '" y2="' + n1(Y(f(x0) + 9 * b)) + '" />';
        const dot = (x, col) => '<circle cx="' + n1(X(x)) + '" cy="' + n1(Y(f(x))) + '" r="7" fill="' + col + '" stroke="#ffffff" stroke-width="2" />';
        // five boxes as in part A of every exam: one is ticked
        let tick = '';
        'ABCDE'.split('').forEach((l, i) => {
            const x = 56 + i * 62, y = 426;
            tick += '<rect x="' + x + '" y="' + y + '" width="40" height="40" rx="6" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.6)" stroke-width="2" />';
            tick += '<text x="' + (x + 20) + '" y="' + (y + 62) + '" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="15" fill="rgba(255,255,255,0.75)">' + l + '</text>';
            if (l === 'C') tick += '<path d="M' + (x + 8) + ' ' + (y + 8) + 'L' + (x + 32) + ' ' + (y + 32) + 'M' + (x + 32) + ' ' + (y + 8) + 'L' + (x + 8) + ' ' + (y + 32) + '" stroke="rgb(245, 194, 66)" stroke-width="6" stroke-linecap="round" />';
        });
        box.innerHTML = '<svg viewBox="0 0 ' + Wd + ' ' + Ht + '" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<g stroke="rgba(255,255,255,0.05)" stroke-width="1">' + grid + '</g>' +
            '<g fill="rgba(160,196,90,0.5)">' + bars + '</g>' +
            '<g stroke="rgb(160,196,90)" stroke-width="4" stroke-linecap="round">' + tang(0, -0.1, 0.5) + tang(4, -0.42, 0.13) + '</g>' +
            '<path d="' + d + '" fill="none" stroke="rgb(245, 194, 66)" stroke-width="6" stroke-linecap="round" />' +
            dot(1, 'rgb(245, 194, 66)') + dot(2, 'rgb(176, 36, 24)') + dot(3, 'rgb(245, 194, 66)') + tick + '</svg>';
    });

    W('beverteilung', function (box) {
        const teile = JSON.parse(box.dataset.teile || '[]');
        const sum = teile.reduce((s, t) => s + t[1], 0);
        B.div(box, 'b-bebar', teile.map(t => '<div style="width:' + (100 * t[1] / sum).toFixed(2) + '%"><b>' + t[1] + '</b>' + t[0] + '</div>').join(''));
    });

    W('pruefungsuhr', function (box) {
        const full = +(box.dataset.min || 60) * 60;
        let left = full, timer = null;
        const wrap = B.div(box, 'b-uhr', '<span class="b-uhr-zeit" role="timer"></span>' +
            '<button type="button" class="b-btn b-go">Start</button><button type="button" class="b-btn">Zurück</button>');
        const face = wrap.querySelector('.b-uhr-zeit'), [go, back] = wrap.querySelectorAll('button');
        const show = () => {
            const m = Math.floor(left / 60), s = left % 60;
            face.textContent = m + ':' + String(s).padStart(2, '0');
            face.classList.toggle('b-uhr-ende', left === 0);
        };
        const halt = () => { clearInterval(timer); timer = null; go.textContent = 'Start'; };
        go.addEventListener('click', () => {
            if (timer) { halt(); return; }
            if (!left) return;
            go.textContent = 'Pause';
            timer = setInterval(() => { left--; show(); if (!left) halt(); }, 1000);
        });
        back.addEventListener('click', () => { halt(); left = full; show(); });
        show();
    });
})();
