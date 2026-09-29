// svp-notenvergabe.js - the Notenvergabe pages' tables stacked on a phone (see svp-notenvergabe.css).
// Moved out of bewertungen.html unchanged (Doc, 29.09.2026).
(function () {
    'use strict';
    /* Stacked on a phone, a cell has lost its column head - carry it
       along in data-col, taken from the thead so nothing is written
       twice. <br> in a heading becomes a space, not a run-on word, and
       the aside ("je Halbjahr", "z. B. Info") stays out of it.
       A cell spanning both Fachgruppen belongs to neither and keeps
       its row label instead. */
    document.querySelectorAll('table.bw').forEach(function (table) {
        const heads = [...table.tHead.rows[0].cells].map(function (th) {
            const copy = th.cloneNode(true);
            copy.querySelectorAll('.bw-hj-note, .bw-eg').forEach(el => el.remove());
            return copy.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').trim();
        });
        [...table.tBodies[0].rows].forEach(function (tr) {
            [...tr.cells].forEach(function (cell, i) {
                if (cell.tagName === 'TD' && cell.colSpan === 1) cell.dataset.col = heads[i] || '';
            });
        });
    });
}());
