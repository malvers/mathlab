// A figure's words (<p class="fl">, html_deck.figure) in the deck editor - only on Doc's machine, loaded by deck-edit.js
// like deck-image.js (Doc, 23.09.2026: "bitte verschieb/änderbar (size)"). While editing (E):
//   drag a label                          -> moves it (Shift: straight only)
//   drag a corner handle                  -> scales the type, the box with it
//   drag a side handle                    -> changes the width - the text wraps
//   a plain click                         -> opens the text, as before (deck-edit.js)
//   arrow keys (Shift: 10 px)             -> nudges the chosen label while no text is open
// The file side lives in tools/pptx/deck_label.py; it goes live with the green cloud like every text change.
(function () {
  const E = window.DeckEdit;
  if (!E || typeof slides === 'undefined') return;
  const W = 960;                                       // a slide in design px
  const HANDLES = ['nw', 'ne', 'se', 'sw', 'e', 'w'];  // no top or bottom: the height is the text's own
  const SAVED = new WeakMap();                         // label -> its style as the file holds it
  let sel = null, drag = null, queue = Promise.resolve(), nudgeT = 0, swallow = 0;   // swallow: when a drag ended

  const css = document.createElement('style');
  css.textContent = [
    'html.deck-edit .pic .fl:not(.ed-on){cursor:move}',
    '#lbl-box{position:absolute;z-index:50;pointer-events:none;outline:calc(1.5px / var(--k,1)) dashed rgb(245,194,66)}',
    '#lbl-box i{position:absolute;width:calc(10px / var(--k,1));height:calc(10px / var(--k,1));',
    '  transform:translate(-50%,-50%);background:#fff;border:calc(2px / var(--k,1)) solid rgb(245,194,66);',
    '  box-sizing:border-box;border-radius:2px;pointer-events:auto}',
    '#lbl-box i[data-c=nw]{left:0;top:0;cursor:nwse-resize}#lbl-box i[data-c=ne]{left:100%;top:0;cursor:nesw-resize}',
    '#lbl-box i[data-c=se]{left:100%;top:100%;cursor:nwse-resize}#lbl-box i[data-c=sw]{left:0;top:100%;cursor:nesw-resize}',
    '#lbl-box i[data-c=e]{left:100%;top:50%;cursor:ew-resize}#lbl-box i[data-c=w]{left:0;top:50%;cursor:ew-resize}',
    '@media print{#lbl-box{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  const box = document.createElement('div');
  box.id = 'lbl-box';
  box.innerHTML = HANDLES.map(function (c) { return '<i data-c="' + c + '"></i>'; }).join('');

  const deckEl = () => document.getElementById('deck');
  const scale = () => deckEl().getBoundingClientRect().width / W;
  function at(e) {                                     // pointer -> slide px (only differences are used)
    const r = deckEl().getBoundingClientRect(), k = r.width / W;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  }
  const round = v => Math.round(v * 10) / 10;
  const saved = el => SAVED.has(el) ? SAVED.get(el) : el.getAttribute('style');
  const why = err => /fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message;

  // where a label stands in its picture box: left/top/width, and the type size once it was scaled
  function geo(el) {
    return { x: parseFloat(el.style.left) || 0, y: parseFloat(el.style.top) || 0,
             w: parseFloat(el.style.width) || el.offsetWidth, s: parseFloat(el.style.fontSize) || null };
  }
  function place(el, g) {
    if (!SAVED.has(el)) SAVED.set(el, el.getAttribute('style'));   // the file's style, before the first change
    el.style.left = round(g.x) + 'px'; el.style.top = round(g.y) + 'px'; el.style.width = round(g.w) + 'px';
    el.style.fontSize = g.s ? round(g.s) + 'px' : '';
    if (el === sel) frame();
  }
  function frame() {
    if (!sel) return;
    sel.after(box);                                    // same box, same coordinates, right above the label
    box.style.cssText = 'left:' + sel.offsetLeft + 'px;top:' + sel.offsetTop + 'px;width:' + sel.offsetWidth
      + 'px;height:' + sel.offsetHeight + 'px;--k:' + scale();
  }
  function select(el) { sel = el; frame(); }
  function unselect() { sel = null; box.remove(); }

  // the overview keeps copies of the slides - they follow the file too
  function tileLabel(el) {
    const slide = el.closest('.slide'), i = slides.indexOf(slide), n = [...slide.querySelectorAll('p.fl')].indexOf(el);
    const t = document.querySelectorAll('#overview .ov-thumb')[i];
    return t && t.querySelectorAll('.slide p.fl')[n];
  }

  function post(body) {
    return fetch('/__deck/label', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); });
  }
  function save(el) {                                  // one write after the other, in the order they were made
    const old = saved(el), g = geo(el), slide = el.closest('.slide');
    const q = { deck: E.deck, slide: slides.indexOf(slide), n: [...slide.querySelectorAll('p.fl')].indexOf(el),
                old: old, x: g.x, y: g.y, w: g.w, size: g.s };
    const p = queue.then(function () { return post(q); })
      .then(function (j) {
        E.changed(j); SAVED.set(el, j.style);
        const c = tileLabel(el);
        if (c) c.setAttribute('style', j.style);
        return j;
      })
      .catch(function (err) {                          // the file did not take it: back to what it holds
        el.setAttribute('style', old); SAVED.set(el, old);
        if (el === sel) frame();
        E.msg('Beschriftung nicht gespeichert: ' + why(err));
      });
    queue = p.catch(function () { });
    return p;
  }

  // pointer events, not clicks: in edit mode deck-edit.js keeps every click inside #deck for itself. A handle takes
  // the pointer at once; the label itself only once it really moves - a plain click still opens its text.
  addEventListener('pointerdown', function (e) {
    if (!E.on() || e.button !== 0 || !e.target.closest) return;
    const handle = e.target.closest('#lbl-box [data-c]');
    const el = handle ? sel : e.target.closest('#deck .slide.on .pic p.fl');
    if (!el) {
      if (sel && e.target.closest('#deck')) unselect();
      return;
    }
    if (handle) { e.preventDefault(); e.stopPropagation(); }
    else if (el.isContentEditable) return;             // an open text: the pointer selects text, as it should
    if (el !== sel) select(el);
    const s0 = parseFloat(getComputedStyle(el).fontSize) || 12.5;
    drag = { c: handle ? handle.dataset.c : null, from: at(e), g: geo(el), el: el, moved: false, s0: s0, h0: el.offsetHeight };
  }, true);

  addEventListener('pointermove', function (e) {
    if (!drag) return;
    const q = at(e), g = drag.g, el = drag.el;
    let dx = q.x - drag.from.x, dy = q.y - drag.from.y;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 2) return;   // a click with a shaky hand is still a click
    drag.moved = true;
    e.preventDefault();
    if (!drag.c) {                                     // move
      if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      place(el, { x: g.x + dx, y: g.y + dy, w: g.w, s: g.s });
      return;
    }
    const sx = drag.c.indexOf('e') >= 0 ? 1 : -1;       // every handle has an east or west side
    const sy = drag.c.indexOf('s') >= 0 ? 1 : drag.c.indexOf('n') >= 0 ? -1 : 0;
    const w = Math.max(24, g.w + sx * dx);
    const x = sx < 0 ? g.x + g.w - w : g.x;            // the opposite side stays where it is
    if (!sy) { place(el, { x: x, y: g.y, w: w, s: g.s }); return; }
    const k = w / g.w;                                 // a corner: the type scales with the box, the far corner stays
    place(el, { x: x, y: sy < 0 ? g.y + drag.h0 * (1 - k) : g.y, w: w, s: Math.max(4, drag.s0 * k) });
  }, true);

  addEventListener('pointerup', function () {
    if (!drag) return;
    const moved = drag.moved, el = drag.el;
    drag = null;
    if (!moved) return;
    swallow = Date.now();                              // the click that ends a drag must not open the text
    if (E.hold) E.hold();                              // deck-edit.js hears the click first - it lets this one pass
    save(el);
  }, true);
  addEventListener('click', function (e) {          // a handle drag may end without a click: the mark must not outlive it
    const mine = swallow && Date.now() - swallow < 400;
    swallow = 0;
    if (mine) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // capture phase after deck-edit.js: arrows on a chosen label never turn the page - unless a text is open
  addEventListener('keydown', function (e) {
    if (!sel || !E.on() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (document.activeElement && document.activeElement.isContentEditable) return;
    const step = e.shiftKey ? 10 : 1;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!move) return;
    e.preventDefault(); e.stopPropagation();
    const g = geo(sel), el = sel;
    place(el, { x: g.x + move[0], y: g.y + move[1], w: g.w, s: g.s });
    clearTimeout(nudgeT);
    nudgeT = setTimeout(function () { save(el); }, 400);   // a row of presses is one write
  }, true);

  document.addEventListener('deck-edit-off', unselect);
  addEventListener('resize', frame);
  painted.push(function () { if (sel && !sel.closest('.slide.on')) unselect(); });
})();
