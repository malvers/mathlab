// Deck editor - only on Doc's machine: serve.py puts this file into /decks/*.html, docalvers.de never loads it.
// E (or the pencil in the footer, right of "?") turns editing on: every text of the deck gets a dashed frame, a click shows its
// source ($...$ formulas, **bold**), Enter or a click elsewhere writes it straight into the deck file, Esc drops
// the change (Doc, 17.09.2026: "Deck ist Master"). What counts as a text and how it is written back lives in
// tools/pptx/deck_edit.py - this page only asks it.
// In an open bullet line Cmd-D puts a copy right below it (open for typing), Cmd-Backspace removes the line.
// The pencil is yellow while editing. As soon as the deck differs from what is live, a green cloud button shows up
// next to it - a click puts the deck live (commit + push of this one deck, Doc's standing go-ahead). Both sit in the
// footer next to the slide triangles; top left stays free (Doc, 17.09.2026: "mach hier ein Stift ... oben links weg").
(function () {
  if (typeof slides === 'undefined' || document.documentElement.classList.contains('presenter')) return;
  const root = document.documentElement;
  const DECK = decodeURIComponent(location.pathname.split('/').pop());
  const SRC = new WeakMap();                          // element -> its source text, as the file holds it
  let on = false, cur = null, busy = false, tt = 0, selector = '', pending = false, publishing = false, dirty = false;
  let known = Math.floor(Date.parse(document.lastModified) / 1000) || 0;   // file time this page was loaded with
  const MAC = /Mac|iP(hone|ad|od)/.test(navigator.platform);
  const cmd = e => MAC ? e.metaKey : e.ctrlKey;       // Ctrl-D on a Mac stays "delete forward" while typing
  const K = MAC ? '⌘' : 'Strg+';

  const css = document.createElement('style');
  css.textContent = [
    'html.deck-edit #nav #nav-edit{background:rgb(245,194,66);color:#0E244E;opacity:1}',
    '#nav #nav-live{background:rgb(121,158,49);color:#fff}',
    '#nav #nav-live[hidden]{display:none}',
    '#nav #nav-live:disabled{opacity:.55;cursor:progress}',
    'html.deck-edit .slide .step{opacity:1!important}',
    'html.deck-edit [data-ed]{cursor:text;outline:1px dashed rgba(245,194,66,.75);outline-offset:3px}',
    'html.deck-edit [data-ed]:hover{outline:2px dashed rgb(245,194,66)}',
    'html.deck-edit [data-ed].ed-on{outline:2px solid rgb(245,194,66);background:rgba(245,194,66,.16);',
    '  white-space:pre-wrap;caret-color:rgb(176,36,24)}',
    'html.deck-edit [data-ed].ed-busy{opacity:.5}',
    '#ov-menu{position:fixed;z-index:30;min-width:190px;padding:6px;border-radius:10px;',
    '  background:rgba(7,22,48,.98);border:1px solid rgba(245,194,66,.55);box-shadow:0 10px 30px rgba(0,0,0,.45)}',
    '#ov-menu button{display:block;width:100%;padding:8px 12px;border:0;border-radius:7px;background:none;',
    '  color:#eaf1ff;font:500 14px Raleway,system-ui,sans-serif;text-align:left;cursor:pointer}',
    '#ov-menu button:hover:not(:disabled){background:rgba(245,194,66,.22)}',
    '#ov-menu button:disabled{opacity:.35;cursor:default}',
    '#ov-menu hr{border:0;border-top:1px solid rgba(255,255,255,.14);margin:5px 8px}',
    '@media print{#nav-edit,#nav-live{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  const ICON = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
    + 'stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  function navButton(id, icon, after) {
    const b = document.createElement('button');
    b.id = id; b.type = 'button'; b.innerHTML = ICON(icon);
    // mousedown would take the focus from the text being typed and save it on its own - the click does both steps
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
    after.after(b);
    return b;
  }
  const nav = document.getElementById('nav');
  const anchor = document.getElementById('nav-help') || document.getElementById('nav-next') || nav;
  if (!nav) return;                                   // a deck without the footer: no editor controls
  const btn = navButton('nav-edit', '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>', anchor);
  const live = navButton('nav-live', '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.6 8.6 4 4 0 0 1 17 18"/>'
    + '<path d="M12 12v9"/><path d="M9 15l3-3 3 3"/>', btn);
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (publishing || busy) return;                  // a text is still being written
    toggle();
  });
  live.addEventListener('click', function (e) {
    e.stopPropagation();
    if (publishing || busy) return;
    // write the open text first, then put the deck live
    (cur ? end(true) : Promise.resolve(true)).then(function (ok) { if (ok && pending) publish(); });
  });

  function label() {
    btn.title = on ? 'Bearbeiten beenden (E)' : 'Texte bearbeiten (E)';
    btn.setAttribute('aria-label', btn.title);
    live.hidden = !(pending || dirty || publishing);
    live.disabled = publishing;
    live.title = publishing ? 'Wird live gestellt …' : 'Änderungen speichern und live stellen (docalvers.de)';
    live.setAttribute('aria-label', live.title);
  }
  label();

  function publish() {
    publishing = true; label();
    fetch('/__deck/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deck: DECK }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
      .then(function (j) {
        pending = j.pending;
        msg(j.files.length ? 'Live gestellt (' + j.commit + ') – auf docalvers.de in 1–2 Minuten' : 'Schon live – nichts zu tun');
      })
      .catch(function (err) { msg(/fetch/i.test(err.message) ? 'Nicht live gestellt: serve.py antwortet nicht' : err.message); })
      .finally(function () { publishing = false; label(); });
  }

  // the deck's own message box (#linkmsg in deck.css), so the editor speaks in the same voice
  function msg(t) {
    let b = document.getElementById('linkmsg');
    if (!b) {
      b = document.createElement('div'); b.id = 'linkmsg'; b.setAttribute('role', 'status');
      document.body.appendChild(b);
    }
    b.textContent = t; b.hidden = false;
    clearTimeout(tt); tt = setTimeout(function () { b.hidden = true; }, 4500);
  }

  function tex(el) {
    if (!window.katex) return;
    el.querySelectorAll('.tex').forEach(function (t) {
      try { katex.render(t.dataset.tex, t, { throwOnError: false, displayMode: false }); }
      catch (err) { t.textContent = t.dataset.tex; }
    });
  }

  function load() {
    return fetch('/__deck/source?deck=' + encodeURIComponent(DECK), { cache: 'no-store' })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
      .then(function (m) {
        if (m.mtime > known + 1) throw new Error('Die Datei ist neuer als diese Seite – bitte neu laden (Cmd-Shift-R).');
        if (m.slides.length !== slides.length) throw new Error('Folienzahl passt nicht zur Datei – bitte neu laden.');
        selector = m.selector; pending = m.pending;
        document.querySelectorAll('[data-ed]').forEach(function (el) { el.removeAttribute('data-ed'); });
        let skipped = 0;
        slides.forEach(function (sl, i) {
          const els = sl.querySelectorAll(m.selector), src = m.slides[i];
          if (els.length !== src.length) { skipped++; return; }   // counted differently: leave this slide alone
          els.forEach(function (el, n) {
            if (src[n] === null) return;
            el.dataset.ed = i + ':' + n;
            SRC.set(el, src[n]);
          });
        });
        return skipped;
      });
  }

  function toggle() {
    if (on) {
      if (cur) end(true);
      on = false; root.classList.remove('deck-edit'); label();
      document.dispatchEvent(new Event('deck-edit-off'));
      return;
    }
    load().then(function (skipped) {
      on = true; root.classList.add('deck-edit'); label();
      document.dispatchEvent(new Event('deck-edit-on'));
      msg(skipped ? skipped + ' Folie(n) lassen sich nicht bearbeiten – der Rest schon.'
                  : 'Text anklicken · Enter speichert · Esc verwirft · ' + K + 'D kopiert · ' + K + '⌫ löscht · E beendet');
    }).catch(function (err) {
      msg('Bearbeiten geht nicht: ' + (/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message));
    });
  }

  // one step back (or forward) on the server, then the page shows the file as it is now - back in edit mode, same slide
  function undo(redo) {
    if (busy || publishing) return;
    busy = true;
    fetch('/__deck/undo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deck: DECK, redo: !!redo }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
      .then(function (j) {
        try { sessionStorage.setItem('deck-edit-resume', (redo ? 'Wiederhergestellt: ' : 'Rückgängig: ') + (j.what || 'Änderung')); } catch (e) { }
        location.reload();
      })
      .catch(function (err) { msg(/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message); })
      .finally(function () { busy = false; });
  }

  const typed = el => el.textContent.replace(/\s*\n\s*/g, ' ').trim();
  // our own write is no reason for live reload (tools/live_reload.py) to reload the page
  const rebase = () => { try { if (window.__liveReload) window.__liveReload.rebase(); } catch (e) { } };

  function begin(el) {
    cur = { el: el, html: el.innerHTML, src: SRC.get(el), blur: null, input: null };
    el.classList.add('ed-on');
    el.textContent = cur.src;
    el.setAttribute('contenteditable', 'plaintext-only');
    if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
    cur.blur = function () { if (cur && cur.el === el && document.hasFocus()) end(true); };   // not when Doc only switches apps
    // the button turns to "Änderungen speichern" with the first typed letter, not only after Enter (Doc, 17.09.2026)
    cur.input = function () { dirty = !!cur && typed(el) !== cur.src; label(); };
    el.addEventListener('blur', cur.blur);
    el.addEventListener('input', cur.input);
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // keep: write what was typed; otherwise put the rendered text back as it was.
  // Resolves true once the text is written (or had nothing to write), false when it was dropped or failed.
  function end(keep) {
    if (!cur || busy) return Promise.resolve(false);
    const c = cur, el = c.el;
    const text = typed(el);
    el.removeEventListener('blur', c.blur);
    el.removeEventListener('input', c.input);
    el.removeAttribute('contenteditable');
    if (!keep || text === c.src) {
      el.innerHTML = c.html; el.classList.remove('ed-on'); cur = null; dirty = false; label();
      return Promise.resolve(keep);
    }
    const at = el.dataset.ed.split(':').map(Number);
    busy = true; el.classList.add('ed-busy');
    return fetch('/__deck/save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deck: DECK, slide: at[0], n: at[1], old: c.src, new: text })
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
      .then(function (j) {
        el.innerHTML = j.html; tex(el); SRC.set(el, j.src); known = j.mtime; pending = j.pending; rebase();
        const tile = document.querySelectorAll('#overview .ov-thumb')[at[0]];   // the overview keeps copies
        const copy = tile && tile.querySelectorAll(selector)[at[1]];
        if (copy) { copy.innerHTML = j.html; tex(copy); }
        el.classList.remove('ed-on'); cur = null; dirty = false;
        msg('Gespeichert – live erst mit „Änderungen speichern“'); label();
        return true;
      })
      .catch(function (err) {                          // the typed text stays in the box - nothing is lost, Esc drops it
        el.textContent = text;
        el.setAttribute('contenteditable', 'plaintext-only');
        if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', c.blur);
        el.addEventListener('input', c.input);
        msg('Nicht gespeichert: ' + (/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message));
        return false;
      })
      .finally(function () { busy = false; el.classList.remove('ed-busy'); });
  }

  // the change deck_edit.line made in the file, once more on a slide or its overview copy; returns the copy
  function restructure(box, n, op, own, g) {
    const el = box.querySelectorAll(selector)[n];
    if (!el) return null;
    if (own) box.querySelectorAll('.step').forEach(function (s) {
      if (+s.dataset.g > g) s.dataset.g = +s.dataset.g + (op === 'dup' ? 1 : -1);
    });
    if (op === 'del') { el.remove(); return null; }
    const copy = el.cloneNode(true);
    copy.classList.remove('ed-on', 'ed-busy');
    copy.removeAttribute('data-ed');
    if (own) copy.dataset.g = g + 1;
    el.after(copy);
    return copy;
  }

  // Cmd-D: the open line once more right below it, ready to type over; Cmd-Backspace: the open line is gone.
  // A copy is silent in Solita's reading (Doc, 17.09.2026: "erst mal nix").
  function line(op) {
    if (!cur || busy) return;
    const el = cur.el;
    if (!el.matches('p.line, p.col')) { msg('Kopieren und Löschen geht nur bei Aufzählungszeilen.'); return; }
    // copy: what was typed is saved first; remove: what was typed goes with the line
    end(op === 'dup').then(function (ok) {
      if (op === 'dup' && !ok) return;               // not saved - the message says why, nothing is copied
      const at = el.dataset.ed.split(':').map(Number);
      busy = true; el.classList.add('ed-busy');
      return fetch('/__deck/line', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deck: DECK, slide: at[0], n: at[1], old: SRC.get(el), op: op })
      })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
        .then(function (j) {
          known = j.mtime; pending = j.pending; rebase();
          const copy = restructure(slides[at[0]], at[1], op, j.own, j.g);
          const tile = document.querySelectorAll('#overview .ov-thumb')[at[0]];
          if (tile) restructure(tile, at[1], op, j.own, j.g);
          return load().then(function () {
            label();
            if (copy && !copy.dataset.ed) { msg('Neu laden (Cmd-Shift-R), dann geht es weiter.'); return; }
            if (copy) { el.classList.remove('ed-busy'); busy = false; begin(copy); }
            msg((op === 'dup' ? 'Zeile kopiert' : 'Zeile gelöscht') + (j.narration ? ' – für Solita einmal neu laden' : ''));
          });
        })
        .catch(function (err) {
          msg((op === 'dup' ? 'Nicht kopiert: ' : 'Nicht gelöscht: ') + (/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message));
        })
        .finally(function () { busy = false; el.classList.remove('ed-busy'); });
    });
  }

  // ---------------------------------------------------------------- slides ---
  // In edit mode the overview (o) is the place where slides are ordered: drag a tile to its new place, or
  // right-click one for hide / show and one step left or right (Doc, 21.09.2026: "in Overview Folien
  // verschieben und ausblenden (rechte Maus)"). Hiding only sets a class, so it happens right here on the
  // page; moving renumbers Solita as well, so the page comes back from the file afterwards.
  const OV = () => window.DeckOverview;
  const cellIndex = c => +c.dataset.i;

  function slideOp(body) {
    if (busy || publishing) return Promise.resolve(false);
    busy = true;
    return fetch('/__deck/slide', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ deck: DECK }, body))
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
      .then(function (j) { known = j.mtime; pending = j.pending; rebase(); label(); return j; })
      .catch(function (err) { msg('Ging nicht: ' + (/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message)); return false; })
      .finally(function () { busy = false; });
  }

  function hideSlide(i, hide) {
    slideOp({ index: i, op: hide ? 'hide' : 'show' }).then(function (j) {
      if (!j) return;
      slides[i].classList.toggle('skip', hide);
      const cell = OV() && OV().el.children[i];
      if (cell) { const c = cell.querySelector('.ov-thumb > .slide'); if (c) c.classList.toggle('skip', hide); }
      if (OV()) OV().refresh();
      msg(hide ? 'Folie ausgeblendet – die Klasse sieht sie nicht mehr' : 'Folie wieder eingeblendet');
    });
  }

  // the whole page comes back from the file: order, page numbers and Solita's parts all moved with it
  function structure(body, note, where) {
    slideOp(body).then(function (j) {
      if (!j) return;
      try {
        sessionStorage.setItem('deck-edit-resume', note + (j.narration ? ' – Solitas Aufnahmen sind mitgewandert' : ''));
        sessionStorage.setItem('deck-edit-overview', String(typeof j.at === 'number' ? j.at : where));
      } catch (e) { }
      location.reload();
    });
  }
  function moveSlide(from, to) {
    if (from !== to) structure({ index: from, op: 'move', to: to }, 'Folie verschoben', to);
  }

  // right-click menu on a tile - the deck's own look, Esc or a click beside it closes
  let menu = null;
  function closeMenu() { if (menu) { menu.remove(); menu = null; } }
  function openMenu(x, y, i) {
    closeMenu();
    const last = slides.length - 1;
    const items = [
      [hiddenSlide(i) ? 'Einblenden' : 'Ausblenden', function () { hideSlide(i, !hiddenSlide(i)); }],
      ['Folie einfügen', function () { structure({ index: i, op: 'insert' }, 'Folie eingefügt – Text anklicken', i + 1); }],
      ['Folie kopieren', function () { structure({ index: i, op: 'dup' }, 'Folie kopiert', i + 1); }],
      ['Folie löschen', last > 0 ? function () { structure({ index: i, op: 'del' }, 'Folie gelöscht – ' + K + 'Z holt sie zurück', Math.max(0, i - 1)); } : null],
      null,
      ['Eine nach vorn', i > 0 ? function () { moveSlide(i, i - 1); } : null],
      ['Eine nach hinten', i < last ? function () { moveSlide(i, i + 1); } : null],
      ['An den Anfang', i > 0 ? function () { moveSlide(i, 0); } : null],
      ['Ans Ende', i < last ? function () { moveSlide(i, last); } : null],
    ];
    menu = document.createElement('div');
    menu.id = 'ov-menu';
    items.forEach(function (it) {
      if (!it) { menu.appendChild(document.createElement('hr')); return; }
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = it[0];
      b.disabled = !it[1];
      b.addEventListener('click', function (e) { e.stopPropagation(); closeMenu(); it[1](); });
      menu.appendChild(b);
    });
    document.body.appendChild(menu);
    const r = menu.getBoundingClientRect();          // never off screen
    menu.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
    menu.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
  }
  // capture: a click anywhere closes the menu - except inside it, where the entry still has to fire
  addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('#ov-menu')) closeMenu(); }, true);
  addEventListener('scroll', closeMenu, true);

  addEventListener('contextmenu', function (e) {
    const cell = on && e.target.closest && e.target.closest('#overview .ov-cell');
    if (!cell) return;
    e.preventDefault(); e.stopPropagation();
    openMenu(e.clientX, e.clientY, cellIndex(cell));
  }, true);

  // drag and drop inside the overview: the yellow edge shows where the slide lands
  let from = -1;
  const clearMarks = () => document.querySelectorAll('.ov-before,.ov-after,.ov-drag')
    .forEach(function (c) { c.classList.remove('ov-before', 'ov-after', 'ov-drag'); });
  addEventListener('dragstart', function (e) {
    const cell = on && e.target.closest && e.target.closest('#overview .ov-cell');
    if (!cell) return;
    from = cellIndex(cell);
    cell.classList.add('ov-drag');
    try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(from)); } catch (err) { }
  }, true);
  addEventListener('dragover', function (e) {
    if (from < 0) return;
    const cell = e.target.closest && e.target.closest('#overview .ov-cell');
    e.preventDefault();
    try { e.dataTransfer.dropEffect = 'move'; } catch (err) { }
    document.querySelectorAll('.ov-before,.ov-after').forEach(function (c) { c.classList.remove('ov-before', 'ov-after'); });
    if (!cell || cellIndex(cell) === from) return;
    const r = cell.getBoundingClientRect();
    cell.classList.add(e.clientX < r.left + r.width / 2 ? 'ov-before' : 'ov-after');
  }, true);
  addEventListener('drop', function (e) {
    if (from < 0) return;
    const cell = e.target.closest && e.target.closest('#overview .ov-cell');
    e.preventDefault();
    const start = from;
    const before = cell && cell.classList.contains('ov-before');
    clearMarks(); from = -1;
    if (!cell) return;
    const j = cellIndex(cell);
    if (j === start) return;
    // where it lands among the others: before the tile, or right after it
    moveSlide(start, before ? (j > start ? j - 1 : j) : (j > start ? j : j + 1));
  }, true);
  addEventListener('dragend', function () { clearMarks(); from = -1; }, true);

  // capture phase: in edit mode a click on the slide edits and never turns the page
  addEventListener('click', function (e) {
    if (!on || !e.target.closest || !e.target.closest('#deck')) return;
    e.stopPropagation();
    if (e.target.closest('a')) e.preventDefault();   // picture credits stay put while editing
    if (cur && cur.el.contains(e.target)) return;
    if (cur) end(true);
    const el = e.target.closest('[data-ed]');
    if (el && !cur && !busy) begin(el);
  }, true);

  // capture phase: keys typed into a text never reach the deck (arrows, space, digits, P, F ...)
  addEventListener('keydown', function (e) {
    if (cur && cur.el.contains(e.target)) {
      e.stopPropagation();
      if (e.isComposing) return;
      if (cmd(e) && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); line('dup'); }
      else if (cmd(e) && e.key === 'Backspace') { e.preventDefault(); line('del'); }
      else if (e.key === 'Enter') { e.preventDefault(); end(true); }
      else if (e.key === 'Escape') { e.preventDefault(); end(false); }
      else if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); end(true); }
      return;
    }
    // Cmd-Z / Cmd-Shift-Z with no text open: one step of the deck back or forward (deck_undo.py) - texts, lines, pictures
    if (on && !cur && cmd(e) && (e.key === 'z' || e.key === 'Z')) {
      e.stopPropagation(); e.preventDefault();
      undo(e.shiftKey);
      return;
    }
    if (on && cmd(e) && (e.key === 'd' || e.key === 'D' || e.key === 'Backspace')) {
      e.stopPropagation(); e.preventDefault();       // no bookmark dialog in edit mode
      msg('Erst eine Zeile anklicken – dann ' + K + 'D kopiert, ' + K + '⌫ löscht');
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], #ask')) return;
    if (e.key === 'e' || e.key === 'E') { e.stopPropagation(); e.preventDefault(); toggle(); }
    else if (on && e.key === 'Escape' && !cur) { e.stopPropagation(); toggle(); }
  }, true);

  // turning the page with a text still open saves it first
  painted.push(function () { if (cur && !cur.el.closest('.slide.on')) end(true); });

  // DocPoint pictures (HTML/decks/deck-image.js, built by a second agent on 17.09.2026) plug in here, so the file time,
  // the "not live yet" flag and the pencil/cloud stay in this one place. deck-image.js writes through
  // /__deck/image/... and hands each reply ({mtime, pending}) to changed().
  window.DeckEdit = {
    deck: DECK,
    on: function () { return on; },
    changed: function (reply) {
      rebase();
      if (reply && reply.mtime) known = reply.mtime;
      if (reply && typeof reply.pending === 'boolean') pending = reply.pending;
      label();
    },
    msg: msg
  };
  const pics = document.createElement('script');
  pics.src = '/decks/deck-image.js';
  pics.onerror = function () { pics.remove(); };      // not there yet: the text editor works without it
  document.head.appendChild(pics);

  // after an undo the page came back: edit mode on again, and say what was undone
  try {
    const note = sessionStorage.getItem('deck-edit-resume');
    if (note !== null) {
      sessionStorage.removeItem('deck-edit-resume');
      const back = sessionStorage.getItem('deck-edit-overview');   // a moved slide: stand on it, overview open
      sessionStorage.removeItem('deck-edit-overview');
      load().then(function () {
        on = true; root.classList.add('deck-edit'); label(); document.dispatchEvent(new Event('deck-edit-on')); msg(note);
        if (back !== null && window.DeckOverview) { si = Math.max(0, Math.min(slides.length - 1, +back)); step = 0; paint(); DeckOverview.open(); }
      }).catch(function (err) { msg(err.message); });
    }
  } catch (e) { }

})();
