/* Collapsible answer choices for the online tests (mathetest11, infotest9, ...).
   Shared on purpose: all tests render the same card markup
   (.card > .qnum + .qtext + .opt* [+ .solbtn + .solution]), so the whole
   fold-away behaviour lives here and never in a single test page.

   Usage: QuizCollapse.init(document.getElementById('quiz')) right after render().
   Cards start expanded; a bar above the quiz folds/unfolds every card at once. */
(function (global) {
  'use strict';

  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  const CSS = [
    '.qhead { display: flex; align-items: center; gap: 8px; cursor: pointer; }',
    '.qhead .qnum { flex: 1 1 auto; margin-bottom: 0; }',
    /* letter of the picked answer, only visible while the card is folded */
    '.qhead .qpick {',
    '  font-family: "Orbitron", sans-serif; font-size: 0.7rem;',
    '  color: rgb(96, 128, 36); border: 1px solid rgba(121, 158, 49, 0.6);',
    '  border-radius: 999px; padding: 1px 8px;',
    '}',
    '.qtoggle {',
    '  flex: 0 0 auto; background: transparent; border: 0; cursor: pointer;',
    '  color: rgba(14, 36, 78, 0.55); font-size: 0.85rem; line-height: 1;',
    '  padding: 4px 2px;',
    '}',
    '.qtoggle:hover { color: rgb(14, 36, 78); }',
    '.qtoggle svg { display: block; transition: transform 0.18s ease; }',
    '.card.folded .qtoggle svg { transform: rotate(-90deg); }',
    '.card.folded .qtext { margin-bottom: 0; }',
    '.card.folded .opts, .card.folded .solbtn, .card.folded .solution { display: none; }',
    '.qbar { display: flex; justify-content: flex-end; gap: 8px; margin: 0 0 10px; }',
    '.qbar .btn-fold {',
    '  font-family: "Orbitron", sans-serif; font-size: 0.68rem; letter-spacing: 0.06em;',
    '  background: transparent; color: rgb(96, 128, 36);',
    '  border: 1px solid rgba(121, 158, 49, 0.6); border-radius: 6px;',
    '  padding: 4px 12px; cursor: pointer;',
    '}',
    '.qbar .btn-fold:hover:not(:disabled) { background: rgba(121, 158, 49, 0.14); }',
    '.qbar .btn-fold:disabled { opacity: 0.45; cursor: default; }'
  ].join('\n');

  function injectStyle() {
    if (document.getElementById('quiz-collapse-css')) return;
    const st = document.createElement('style');
    st.id = 'quiz-collapse-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function chevron() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('aria-hidden', 'true');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', 'M3 6l5 5 5-5');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'currentColor');
    p.setAttribute('stroke-width', '2');
    p.setAttribute('stroke-linecap', 'round');
    p.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(p);
    return svg;
  }

  /* Folded cards only show the question, so the picked letter moves into the head. */
  function refreshPick(card) {
    const chip = card.querySelector('.qpick');
    if (!chip) return;
    const sel = card.querySelector('.opt.sel, .opt.correct.sel, .opt.wrong');
    const oi = sel ? Number(sel.dataset.o) : -1;
    const folded = card.classList.contains('folded');
    chip.textContent = oi >= 0 ? LETTERS[oi] : '';
    chip.hidden = !folded || oi < 0;
  }

  function setFolded(card, folded) {
    card.classList.toggle('folded', folded);
    const btn = card.querySelector('.qtoggle');
    if (btn) btn.setAttribute('aria-expanded', folded ? 'false' : 'true');
    refreshPick(card);
  }

  function prepare(card, idx) {
    const opts = Array.prototype.slice.call(card.querySelectorAll('.opt'));
    if (!opts.length) return null;

    // wrap the choices so one class on the card hides them all
    const box = document.createElement('div');
    box.className = 'opts';
    box.id = 'opts-' + idx;
    card.insertBefore(box, opts[0]);
    opts.forEach(function (o) { box.appendChild(o); });

    // question number row becomes the clickable header
    const num = card.querySelector('.qnum');
    const head = document.createElement('div');
    head.className = 'qhead';
    if (num) card.insertBefore(head, num);
    else card.insertBefore(head, box);
    if (num) head.appendChild(num);

    const chip = document.createElement('span');
    chip.className = 'qpick';
    chip.hidden = true;
    head.appendChild(chip);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'qtoggle';
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', box.id);
    btn.setAttribute('aria-label', 'Antworten zu Frage ' + (idx + 1) + ' ein- oder ausklappen');
    btn.appendChild(chevron());
    head.appendChild(btn);

    head.addEventListener('click', function () {
      setFolded(card, !card.classList.contains('folded'));
    });
    // picking an answer must not bubble up into the head toggle
    box.addEventListener('click', function () { refreshPick(card); });

    return card;
  }

  function init(quizEl) {
    if (!quizEl || quizEl.dataset.collapsible === '1') return;
    injectStyle();

    const cards = Array.prototype.slice.call(quizEl.querySelectorAll('.card'))
      .map(prepare).filter(Boolean);
    if (!cards.length) return;
    quizEl.dataset.collapsible = '1';

    const bar = document.createElement('div');
    bar.className = 'qbar';

    const all = document.createElement('button');
    all.type = 'button';
    all.className = 'btn-fold';
    function syncFold() {
      const open = cards.some(function (c) { return !c.classList.contains('folded'); });
      all.textContent = open ? 'Alle einklappen' : 'Alle ausklappen';
    }
    all.addEventListener('click', function () {
      const fold = cards.some(function (c) { return !c.classList.contains('folded'); });
      cards.forEach(function (c) { setFolded(c, fold); });
      syncFold();
    });
    syncFold();

    /* Doc, 08.09.2026: ein Knopf oben, der alle Loesungen auf einmal aufschlaegt.
       Er klickt schlicht die vorhandenen Loesungsknoepfe durch - so bleiben deren
       Beschriftung und aria-expanded richtig, und die Engine muss nichts davon
       wissen. Eingeklappte Karten macht er vorher auf: .card.folded blendet die
       Loesung aus, sie waere sonst offen und trotzdem unsichtbar. */
    function solBtns() {
      return Array.prototype.slice.call(quizEl.querySelectorAll('.solbtn'));
    }
    function isOpen(b) { return b.getAttribute('aria-expanded') === 'true'; }

    if (solBtns().length) {
      const sol = document.createElement('button');
      sol.type = 'button';
      sol.className = 'btn-fold btn-sol';
      function syncSol() {
        const bs = solBtns();
        /* Bei einem echten Test sind die Loesungen bis zum Abgeben gesperrt -
           dann ist auch dieser Knopf gesperrt, sonst waere er ein Schluessel. */
        const locked = bs.length > 0 && bs.every(function (b) { return b.disabled; });
        sol.disabled = locked;
        sol.title = locked ? 'Wird nach dem Abgeben freigeschaltet' : '';
        sol.textContent = (bs.length > 0 && bs.every(isOpen))
          ? 'Lösungen ausblenden' : 'Alle Lösungen';
      }
      sol.addEventListener('click', function () {
        const bs = solBtns().filter(function (b) { return !b.disabled; });
        const show = bs.some(function (b) { return !isOpen(b); });
        if (show) cards.forEach(function (c) { setFolded(c, false); });
        bs.forEach(function (b) { if (isOpen(b) !== show) b.click(); });
        syncFold();
        syncSol();
      });
      syncSol();
      /* Nach dem Abgeben gibt die Engine die Loesungsknoepfe frei. Das hier
         merkt es, ohne dass die beiden Dateien voneinander wissen muessen. */
      document.addEventListener('click', function () { setTimeout(syncSol, 0); });
      bar.appendChild(sol);
    }

    bar.appendChild(all);
    quizEl.parentNode.insertBefore(bar, quizEl);
  }

  global.QuizCollapse = { init: init };
})(window);
