// Deck editor - only on Doc's machine: serve.py puts this file into /decks/*.html, docalvers.de never loads it.
// E (or the pencil top left) turns editing on: every text of the deck gets a dashed frame, a click shows its
// source ($...$ formulas, **bold**), Enter or a click elsewhere writes it straight into the deck file, Esc drops
// the change (Doc, 17.09.2026: "Deck ist Master"). What counts as a text and how it is written back lives in
// tools/pptx/deck_edit.py - this page only asks it.
(function () {
  if (typeof slides === 'undefined' || document.documentElement.classList.contains('presenter')) return;
  const root = document.documentElement;
  const DECK = decodeURIComponent(location.pathname.split('/').pop());
  const SRC = new WeakMap();                          // element -> its source text, as the file holds it
  let on = false, cur = null, busy = false, tt = 0, selector = '';
  let known = Math.floor(Date.parse(document.lastModified) / 1000) || 0;   // file time this page was loaded with

  const css = document.createElement('style');
  css.textContent = [
    '#ed-btn{position:fixed;top:calc(8px + env(safe-area-inset-top, 0px));left:calc(8px + env(safe-area-inset-left, 0px));',
    '  z-index:2147483646;display:flex;align-items:center;gap:7px;padding:6px 11px;border-radius:8px;cursor:pointer;',
    '  border:1px solid rgba(126,143,181,.6);background:#0E244E;color:#E8EEF9;',
    '  font:700 11px/1 Orbitron,sans-serif;letter-spacing:.12em;text-transform:uppercase}',
    '#ed-btn svg{display:block;width:14px;height:14px;flex:none}',
    'html.deck-edit #ed-btn{background:rgb(245,194,66);border-color:rgb(245,194,66);color:#0E244E}',
    'html.deck-edit .slide .step{opacity:1!important}',
    'html.deck-edit [data-ed]{cursor:text;outline:1px dashed rgba(245,194,66,.75);outline-offset:3px}',
    'html.deck-edit [data-ed]:hover{outline:2px dashed rgb(245,194,66)}',
    'html.deck-edit [data-ed].ed-on{outline:2px solid rgb(245,194,66);background:rgba(245,194,66,.16);',
    '  white-space:pre-wrap;caret-color:rgb(176,36,24)}',
    'html.deck-edit [data-ed].ed-busy{opacity:.5}',
    '@media print{#ed-btn{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  const btn = document.createElement('button');
  btn.id = 'ed-btn'; btn.type = 'button'; btn.title = 'Texte bearbeiten (E)';
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
    + 'stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>'
    + '<span>Bearbeiten</span>';
  btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
  document.body.appendChild(btn);

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
        selector = m.selector;
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
      on = false; root.classList.remove('deck-edit');
      return;
    }
    load().then(function (skipped) {
      on = true; root.classList.add('deck-edit');
      msg(skipped ? skipped + ' Folie(n) lassen sich nicht bearbeiten – der Rest schon.'
                  : 'Text anklicken · Enter speichert · Esc verwirft · E beendet');
    }).catch(function (err) {
      msg('Bearbeiten geht nicht: ' + (/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message));
    });
  }

  function begin(el) {
    cur = { el: el, html: el.innerHTML, src: SRC.get(el), blur: null };
    el.classList.add('ed-on');
    el.textContent = cur.src;
    el.setAttribute('contenteditable', 'plaintext-only');
    if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
    cur.blur = function () { if (cur && cur.el === el && document.hasFocus()) end(true); };   // not when Doc only switches apps
    el.addEventListener('blur', cur.blur);
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // keep: write what was typed; otherwise put the rendered text back as it was
  function end(keep) {
    if (!cur || busy) return;
    const c = cur, el = c.el;
    const text = el.textContent.replace(/\s*\n\s*/g, ' ').trim();
    el.removeEventListener('blur', c.blur);
    el.removeAttribute('contenteditable');
    if (!keep || text === c.src) {
      el.innerHTML = c.html; el.classList.remove('ed-on'); cur = null;
      return;
    }
    const at = el.dataset.ed.split(':').map(Number);
    busy = true; el.classList.add('ed-busy');
    fetch('/__deck/save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deck: DECK, slide: at[0], n: at[1], old: c.src, new: text })
    })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); })
      .then(function (j) {
        el.innerHTML = j.html; tex(el); SRC.set(el, j.src); known = j.mtime;
        const tile = document.querySelectorAll('#overview .ov-thumb')[at[0]];   // the overview keeps copies
        const copy = tile && tile.querySelectorAll(selector)[at[1]];
        if (copy) { copy.innerHTML = j.html; tex(copy); }
        el.classList.remove('ed-on'); cur = null;
        msg('Gespeichert');
      })
      .catch(function (err) {                          // the typed text stays in the box - nothing is lost, Esc drops it
        el.textContent = text;
        el.setAttribute('contenteditable', 'plaintext-only');
        if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', c.blur);
        msg('Nicht gespeichert: ' + (/fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message));
      })
      .finally(function () { busy = false; el.classList.remove('ed-busy'); });
  }

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
      if (e.key === 'Enter') { e.preventDefault(); end(true); }
      else if (e.key === 'Escape') { e.preventDefault(); end(false); }
      else if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) { e.preventDefault(); end(true); }
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable], #ask')) return;
    if (e.key === 'e' || e.key === 'E') { e.stopPropagation(); e.preventDefault(); toggle(); }
    else if (on && e.key === 'Escape' && !cur) { e.stopPropagation(); toggle(); }
  }, true);

  // turning the page with a text still open saves it first
  painted.push(function () { if (cur && !cur.el.closest('.slide.on')) end(true); });
})();
