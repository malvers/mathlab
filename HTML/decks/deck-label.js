// A figure's words (<p class="fl">, html_deck.figure) in the deck editor - only on Doc's machine, loaded by deck-edit.js
// like deck-image.js (Doc, 23.09.2026: "bitte verschieb/änderbar (size)"). While editing (E):
//   drag a label                          -> moves it (Shift: straight only)
//   drag a corner handle                  -> scales the type, the box with it
//   drag a side handle                    -> changes the width - the text wraps
//   a plain click                         -> opens the text, as before (deck-edit.js)
//   arrow keys (Shift: 10 px)             -> nudges the chosen label while no text is open
//   small A / big A in the edit bar      -> the type of the chosen label, 1 px at a time (Doc: "Fontsize wäre toll!")
// Every text box standing on a slide (KINDS: the heading, the body, kicker and sub, a table, a code panel ...) goes the
// same way (Doc, 05.10.2026: "die Box ... löschen ... beziehungsweise verschieben können", "die Überschriftenboxen ...
// verschieben ... in der Größe verändern ... löschen. Alle Textboxen, die wir drin haben, genauso behandeln"):
//   a click on a text in it                              -> opens the text as before, and the box's frame shows up:
//                                                           the red x beside its corner removes the box (Cmd-Z brings it back)
//   drag the box (on a text not open, or the frame's rim) -> moves it (Shift: straight only)
//   drag a side handle                                   -> changes the width - the text wraps
//   drag a corner handle                                 -> sizes the whole box, type and all (CSS scale), the far corner stays
//   a click on the frame's rim (or a gap between texts)  -> chooses the box itself: arrow keys nudge, Backspace / Delete
//                                                           removes it - after typing, those keys stay with the page
// The frame sits around what the box holds, just outside deck-edit.js's grey lines - not around the box, which
// deck.css makes 330 px tall however little is in it (Doc, 05.10.2026: "Warum ist die gelbe Box so groß?").
// The file side lives in tools/pptx/deck_label.py; it goes live with the green cloud like every text change.
(function () {
  const E = window.DeckEdit;
  if (!E || typeof slides === 'undefined') return;
  const W = 960;                                       // a slide in design px
  const HANDLES = ['nw', 'ne', 'se', 'sw', 'e', 'w'];  // no top or bottom: the height is the text's own
  const LABELS = '#deck .slide.on:not([data-aus]) .pic p.fl';   // data-aus: from its own file
  // the text boxes that stand on a slide - the same list as tools/pptx/deck_label.py KINDS, keep both in step
  const KINDS = ['div.body', 'div.colgrid', 'div.codepanel', 'table.dtable', 'h1', 'h2', 'h3', 'p.kicker', 'p.sub',
                 'p.satz', 'p.label', 'p.labnote', 'p.greet-lead', 'p.greet-quote', 'p.greet-author', 'div.labbar'];
  const RIGHT = ['div.labbar'];                        // hangs from the right in deck.css: moved, it needs right:auto
  const BOXES = KINDS.map(k => '#deck .slide.on:not([data-aus]) > ' + k).join(', ');
  const SAVED = new WeakMap();                         // label or box -> its style as the file holds it
  const UNDO = /Mac|iP(hone|ad|od)/.test(navigator.platform) ? '⌘Z' : 'Strg+Z';
  const PAD = 10;                                      // a box's frame around its contents, past the grey lines (3 px)
  let sel = null, drag = null, queue = Promise.resolve(), nudgeT = 0, swallow = 0;   // swallow: when a drag ended
  let armed = false;                                   // a box chosen for itself (rim, drag) - only then the keys act on it
  let grab = false;                                    // the pointer is over a box's rim: the hand shows
  let onSelect = function () { };                   // the edit bar's size readout follows the choice (set below)

  const css = document.createElement('style');
  css.textContent = [
    'html.deck-edit .pic .fl:not(.ed-on){cursor:move}',
    'html.box-grab #deck *{cursor:move!important}',   // over a box's rim (hover() below) - its texts keep the caret
    '#lbl-box{position:absolute;z-index:50;pointer-events:none;outline:calc(1.5px / var(--k,1)) dashed rgb(245,194,66)}',
    '#lbl-box i{position:absolute;width:calc(10px / var(--k,1));height:calc(10px / var(--k,1));',
    '  transform:translate(-50%,-50%);background:#fff;border:calc(2px / var(--k,1)) solid rgb(245,194,66);',
    '  box-sizing:border-box;border-radius:2px;pointer-events:auto}',
    '#lbl-box i[data-c=nw]{left:0;top:0;cursor:nwse-resize}#lbl-box i[data-c=ne]{left:100%;top:0;cursor:nesw-resize}',
    '#lbl-box i[data-c=se]{left:100%;top:100%;cursor:nwse-resize}#lbl-box i[data-c=sw]{left:0;top:100%;cursor:nesw-resize}',
    '#lbl-box i[data-c=e]{left:100%;top:50%;cursor:ew-resize}#lbl-box i[data-c=w]{left:0;top:50%;cursor:ew-resize}',
    // a box can go: the red x sits out beside its top right corner, clear of the corner handle (frame() places it)
    // disc and x are one picture: drawn apart they slipped half a pixel against each other at some zooms, and a shadow
    // only below made the disc look low (Doc, 05.10.2026: "Das sitzt nicht so ganz zentral")
    '#lbl-box b{display:none;position:absolute;width:calc(20px / var(--k,1));height:calc(20px / var(--k,1));',
    '  transform:translate(-50%,-50%);cursor:pointer;pointer-events:auto}',
    '#lbl-box.is-box b{display:block}',
    '#lbl-box b svg{display:block;width:100%;height:100%;pointer-events:none;filter:drop-shadow(0 0 2px rgba(0,0,0,.35))}',
    '@media print{#lbl-box{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  const box = document.createElement('div');
  box.id = 'lbl-box';
  box.innerHTML = HANDLES.map(function (c) { return '<i data-c="' + c + '"></i>'; }).join('')
    + '<b data-c="del" title="Textbox löschen (⌫)" aria-label="Textbox löschen"><svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="12" fill="rgb(176,36,24)"/><path d="M8.2 8.2l7.6 7.6M15.8 8.2l-7.6 7.6" fill="none" '
    + 'stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg></b>';

  const deckEl = () => document.getElementById('deck');
  const scale = () => deckEl().getBoundingClientRect().width / W;
  function at(e) {                                     // pointer -> slide px (only differences are used)
    const r = deckEl().getBoundingClientRect(), k = r.width / W;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  }
  const round = v => Math.round(v * 10) / 10;
  const kindOf = el => KINDS.find(k => el.matches(k));
  const isBox = el => !!el.parentElement && el.parentElement.classList.contains('slide') && !!kindOf(el);
  const kind = el => isBox(el) ? kindOf(el) : 'p.fl';
  // a box counts among the slide's own children of its kind (deck_label.py does the same), a label among the slide's labels
  const peers = (slide, k) => k === 'p.fl' ? [...slide.querySelectorAll(k)] : [...slide.children].filter(c => c.matches(k));
  // the style as the file holds it - deck.js places the lab bar at run time and keeps the file's aside (data-file-style);
  // an empty style is no style, on both sides (deck_label.py)
  const saved = el => (SAVED.has(el) ? SAVED.get(el)
    : el.dataset.fileStyle !== undefined ? el.dataset.fileStyle : el.getAttribute('style')) || null;
  const restyle = (el, s) => s === null ? el.removeAttribute('style') : el.setAttribute('style', s);   // a box may have none
  const why = err => /fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message;
  const textOpen = () => !!document.querySelector('#deck .ed-on');   // deck-edit.js: a text open or still being written

  // where a label stands in its picture box (a box: on its slide): left/top/width, and the type size once it was scaled.
  // A box without a place or width of its own stands where deck.css puts it - and keeps the stylesheet's width (wSet);
  // its size is a CSS scale from its top left corner (sc), so a box full of lines grows as one, whatever their type sizes.
  function geo(el) {
    const s = el.style;
    // a number of its own, or where the layout put it ("auto": deck.js hangs the lab bar from its bottom)
    const own = (v, d) => isFinite(parseFloat(v)) ? parseFloat(v) : d;
    if (isBox(el)) return { x: own(s.left, el.offsetLeft), y: own(s.top, el.offsetTop),
                            w: own(s.width, el.offsetWidth), s: null, wSet: isFinite(parseFloat(s.width)), sc: own(s.scale, 1) };
    return { x: parseFloat(s.left) || 0, y: parseFloat(s.top) || 0,
             w: parseFloat(s.width) || el.offsetWidth, s: parseFloat(s.fontSize) || null, wSet: true };
  }
  function place(el, g) {
    if (!SAVED.has(el)) SAVED.set(el, saved(el));      // the file's style, before the first change
    el.style.left = round(g.x) + 'px'; el.style.top = round(g.y) + 'px';
    if (isBox(el) && RIGHT.indexOf(kindOf(el)) >= 0) { el.style.right = 'auto'; el.style.bottom = ''; }
    if (g.wSet) el.style.width = round(g.w) + 'px';
    if (!isBox(el)) el.style.fontSize = g.s ? round(g.s) + 'px' : '';
    else if (Math.abs(g.sc - 1) >= 0.001) { el.style.scale = String(Math.round(g.sc * 1000) / 1000); el.style.transformOrigin = '0 0'; }
    else { el.style.scale = ''; el.style.transformOrigin = ''; }
    if (el === sel) frame();
  }
  // a box's frame in slide px: around what it holds, PAD further out - a container (div) around its children, as
  // deck-edit.js frames their texts; a heading, a paragraph or a table around itself
  function outline(el) {
    const k = scale(), o = el.closest('.slide').getBoundingClientRect();
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    (el.tagName === 'DIV' ? [...el.children] : [el]).forEach(function (c) {
      const q = c.getBoundingClientRect();
      if (!q.width && !q.height) return;               // nothing to see: no room for it in the frame
      l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom);
    });
    if (l === Infinity) { const q = el.getBoundingClientRect(); l = q.left; t = q.top; r = q.left + Math.min(q.width, 120); b = q.top + 40; }
    return { x: (l - o.left) / k - PAD, y: (t - o.top) / k - PAD, w: (r - l) / k + 2 * PAD, h: (b - t) / k + 2 * PAD };
  }
  // the box on the slide shown whose frame holds the pointer - the last one wins, it is drawn on top
  function boxAt(e) {
    const p = at(e), all = document.querySelectorAll(BOXES);
    for (let i = all.length - 1; i >= 0; i--) {
      const o = outline(all[i]);
      if (p.x >= o.x && p.x <= o.x + o.w && p.y >= o.y && p.y <= o.y + o.h) return all[i];
    }
    return null;
  }
  function frame() {
    if (!sel) return;
    // same box, same coordinates, right above the label - put there once: moving the node under a pressed pointer on
    // every step of a drag can cost the drag its pointerup
    if (box.previousElementSibling !== sel) sel.after(box);
    box.classList.toggle('is-box', isBox(sel));
    const g = isBox(sel) ? outline(sel) : { x: sel.offsetLeft, y: sel.offsetTop, w: sel.offsetWidth, h: sel.offsetHeight };
    box.style.cssText = 'left:' + g.x + 'px;top:' + g.y + 'px;width:' + g.w + 'px;height:' + g.h + 'px;--k:' + scale();
    if (!isBox(sel)) return;
    // the x out beside the top right corner - inside it where the slide would cut it off (a box at the right or top edge)
    const d = 15 / scale(), x = box.querySelector('b');
    x.style.left = (g.x + g.w + d + 10 / scale() > W ? g.w - d : g.w + d) + 'px';
    x.style.top = (g.y - d - 10 / scale() < 0 ? d : -d) + 'px';
  }
  function select(el) { sel = el; frame(); onSelect(); }
  function unselect() { sel = null; armed = false; box.remove(); onSelect(); }
  function hover(e) {                                  // the hand over a box's rim, never over a text
    const t = e.target, on = E.on() && !!t.closest && !!t.closest('#deck')
      && !t.closest('[data-ed], img, #pic-box, #lbl-box [data-c], ' + LABELS) && !!boxAt(e);
    if (on !== grab) { grab = on; document.documentElement.classList.toggle('box-grab', on); }
  }

  // the overview keeps copies of the slides - they follow the file too
  function twin(el) {
    const slide = el.closest('.slide'), i = slides.indexOf(slide), n = peers(slide, kind(el)).indexOf(el);
    const t = document.querySelectorAll('#overview .ov-thumb')[i], copy = t && t.querySelector('.slide');
    return copy && peers(copy, kind(el))[n];
  }

  function post(path, body) {
    return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); });
  }
  function save(el) {                                  // one write after the other, in the order they were made
    const old = saved(el), g = geo(el), slide = el.closest('.slide');
    const n = peers(slide, kind(el)).indexOf(el);
    const q = isBox(el)
      ? { deck: E.deck, slide: slides.indexOf(slide), kind: kind(el), n: n, old: old, op: 'move', x: g.x, y: g.y,
          w: g.wSet ? g.w : null, scale: g.sc }
      : { deck: E.deck, slide: slides.indexOf(slide), n: n, old: old, x: g.x, y: g.y, w: g.w, size: g.s };
    const p = queue.then(function () { return post(isBox(el) ? '/__deck/box' : '/__deck/label', q); })
      .then(function (j) {
        E.changed(j); SAVED.set(el, j.style);
        const c = twin(el);
        if (c) c.setAttribute('style', j.style);
        return j;
      })
      .catch(function (err) {                          // the file did not take it: back to what it holds
        restyle(el, old); SAVED.set(el, old);
        if (el === sel) frame();
        E.msg((isBox(el) ? 'Textbox' : 'Beschriftung') + ' nicht gespeichert: ' + why(err));
      });
    queue = p.catch(function () { });
    return p;
  }

  // A box goes with all it holds; its click groups and Solita's parts close up on the server, so the page comes back
  // from the file afterwards - in edit mode, on the same slide (deck-edit.js), as after Cmd-Z.
  // A text still open in it is written first: the click on the x closes it (deck-edit.js), this waits for that.
  function drop(el, tries) {
    if (textOpen()) {
      if ((tries || 0) < 60) setTimeout(function () { drop(el, (tries || 0) + 1); }, 50);
      else E.msg('Erst den offenen Text schließen (Enter)');
      return;
    }
    clearTimeout(nudgeT);
    const slide = el.closest('.slide');
    const q = { deck: E.deck, slide: slides.indexOf(slide), kind: kind(el), n: peers(slide, kind(el)).indexOf(el), op: 'del' };
    const p = queue.then(function () { q.old = saved(el); return post('/__deck/box', q); })   // after a move still on its way
      .then(function (j) {
        E.changed(j);
        E.resume('Textbox gelöscht – ' + (j.narration ? 'Solitas Aufnahmen sind mitgewandert' : UNDO + ' holt sie zurück'));
      })
      .catch(function (err) { E.msg('Textbox nicht gelöscht: ' + why(err)); });
    queue = p.catch(function () { });
  }

  // pointer events, not clicks: in edit mode deck-edit.js keeps every click inside #deck for itself. A handle takes
  // the pointer at once; a label or a box's text only once it really moves - a plain click still opens the text.
  addEventListener('pointerdown', function (e) {
    if (!E.on() || e.button !== 0 || !e.target.closest) return;
    const t = e.target;
    const handle = t.closest('#lbl-box [data-c]');
    if (handle && handle.dataset.c === 'del') { e.preventDefault(); e.stopPropagation(); return; }   // the click removes
    let el = handle ? sel : t.closest(LABELS), typing = false;
    if (!el && t.closest('#deck') && !t.closest('img, #pic-box')) {   // a picture is deck-image.js's, even over a box
      el = boxAt(e);                                   // inside its frame - the empty rest of the box is not the box
      if (el && t.closest('[data-ed]')) {
        if (el.contains(t)) typing = true;             // its own text: opens on the click, the frame shows the x
        else el = null;                                // another element's text that only reaches into the rim
      }
    }
    if (!el) {
      if (sel && t.closest('#deck')) unselect();
      return;
    }
    if (handle) { e.preventDefault(); e.stopPropagation(); }
    else if (t.isContentEditable) return;              // an open text: the pointer selects text, as it should
    if (el !== sel) select(el);
    // a box's text is for typing: arrow keys and Backspace stay with the page afterwards - only a box chosen by its
    // rim (or dragged) takes them
    if (!handle && isBox(el)) armed = !typing;
    if (!handle && isBox(el) && !typing) e.preventDefault();   // the rim: no text selection starts there
    const s0 = isBox(el) ? null : parseFloat(getComputedStyle(el).fontSize) || 12.5;
    const g = geo(el);
    let inner = null;                                  // a box: what it holds, in its own unscaled px (corner anchors)
    if (isBox(el)) {
      const o = outline(el);
      inner = { x: (o.x + PAD - g.x) / g.sc, y: (o.y + PAD - g.y) / g.sc, w: (o.w - 2 * PAD) / g.sc, h: (o.h - 2 * PAD) / g.sc };
    }
    drag = { c: handle ? handle.dataset.c : null, from: at(e), g: g, el: el, moved: false, s0: s0, h0: el.offsetHeight, inner: inner };
  }, true);

  addEventListener('pointermove', function (e) {
    if (!drag) { hover(e); return; }
    if (!(e.buttons & 1)) { finish(); return; }        // the button came up where no pointerup reached us
    const q = at(e), g = drag.g, el = drag.el;
    let dx = q.x - drag.from.x, dy = q.y - drag.from.y;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 2) return;   // a click with a shaky hand is still a click
    if (!drag.moved && isBox(el)) armed = true;        // a box dragged by its text: chosen for itself now
    drag.moved = true;
    e.preventDefault();
    if (!document.activeElement || !document.activeElement.isContentEditable) getSelection().removeAllRanges();
    if (!drag.c) {                                     // move
      if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      place(el, Object.assign({}, g, { x: g.x + dx, y: g.y + dy }));
      return;
    }
    const sx = drag.c.indexOf('e') >= 0 ? 1 : -1;       // every handle has an east or west side
    const sy = drag.c.indexOf('s') >= 0 ? 1 : drag.c.indexOf('n') >= 0 ? -1 : 0;
    if (isBox(el)) {
      if (!sy) {                                       // a side: the width in the box's own px, the far side stays
        const w = Math.max(24, g.w + sx * dx / g.sc);
        place(el, Object.assign({}, g, { x: sx < 0 ? g.x + (g.w - w) * g.sc : g.x, w: w, wSet: true }));
        return;
      }
      // a corner: the whole box scales from its top left; the corner of its contents opposite the handle stays put
      const c = drag.inner, sc = Math.max(0.2, Math.min(6, (c.w * g.sc + sx * dx) / c.w));
      const ax = sx > 0 ? c.x : c.x + c.w, ay = sy > 0 ? c.y : c.y + c.h;
      place(el, Object.assign({}, g, { x: g.x + ax * (g.sc - sc), y: g.y + ay * (g.sc - sc), sc: sc }));
      return;
    }
    const w = Math.max(24, g.w + sx * dx);
    const x = sx < 0 ? g.x + g.w - w : g.x;            // the opposite side stays where it is
    if (!sy) { place(el, { x: x, y: g.y, w: w, s: g.s, wSet: true }); return; }
    const k = w / g.w;                                 // a corner: the type scales with the box, the far corner stays
    place(el, { x: x, y: sy < 0 ? g.y + drag.h0 * (1 - k) : g.y, w: w, s: Math.max(4, drag.s0 * k), wSet: true });
  }, true);

  function finish() {
    if (!drag) return;
    const moved = drag.moved, el = drag.el;
    drag = null;
    if (!moved) return;
    swallow = Date.now();                              // the click that ends a drag must not open the text
    if (E.hold) E.hold();                              // deck-edit.js hears the click first - it lets this one pass
    save(el);
  }
  addEventListener('pointerup', finish, true);
  addEventListener('pointercancel', finish, true);     // a drag the browser took over still ends - and is saved
  // a link in a box (the lab bar) would start the browser's own link drag and swallow ours
  addEventListener('dragstart', function (e) { if (drag) e.preventDefault(); }, true);
  addEventListener('click', function (e) {          // a handle drag may end without a click: the mark must not outlive it
    const mine = swallow && Date.now() - swallow < 400;
    swallow = 0;
    if (mine) { e.preventDefault(); e.stopPropagation(); return; }
    // the red x: on the click, after deck-edit.js has heard it first (an open text is written before the box goes)
    if (sel && isBox(sel) && e.target.closest && e.target.closest('#lbl-box [data-c=del]')) {
      e.preventDefault(); e.stopPropagation();
      drop(sel);
    }
  }, true);

  // capture phase after deck-edit.js: arrows on a chosen label never turn the page - unless a text is open
  addEventListener('keydown', function (e) {
    if (!sel || !E.on() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (document.activeElement && document.activeElement.isContentEditable) return;
    if (isBox(sel) && !armed) return;                  // shown for its text only: the keys turn pages, as before
    if ((e.key === 'Backspace' || e.key === 'Delete') && isBox(sel)) {
      e.preventDefault(); e.stopPropagation();
      drop(sel);
      return;
    }
    const step = e.shiftKey ? 10 : 1;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!move) return;
    e.preventDefault(); e.stopPropagation();
    const g = geo(sel), el = sel;
    place(el, Object.assign({}, g, { x: g.x + move[0], y: g.y + move[1] }));
    clearTimeout(nudgeT);
    nudgeT = setTimeout(function () { save(el); }, 400);   // a row of presses is one write
  }, true);

  // Type size in the edit bar (Doc, 23.09.2026: "Fontsize wäre toll!"): a small A and a big A. In an open text they act
  // on the marked words only - nothing marked: the whole text - one step of deck.css .z1-.z9 (deck-edit.js size();
  // Doc, 05.10.2026: "das, was selektiert ist, soll größer gemacht werden ... So wie es immer ist"). A label chosen by
  // its frame, or open with nothing marked, keeps its own 1 px steps. The number between them: the size in px.
  const bar = document.getElementById('ed-bar');
  if (bar) {
    const sep = document.createElement('span'); sep.className = 'ed-sep';
    const num = document.createElement('span'); num.className = 'ed-size'; num.title = 'Schriftgröße in px';
    const mk = function (text, size, title, d) {
      const b = document.createElement('button');
      b.type = 'button'; b.title = title; b.setAttribute('aria-label', title);
      b.dataset.own = 'label';                       // showSize() below owns its state - deck-edit.js's bar leaves it alone
      b.innerHTML = '<span style="font-size:' + size + 'px;font-weight:600">' + text + '</span>';
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });   // the caret stays in an open text
      b.addEventListener('click', function (e) { e.stopPropagation(); bump(d); });
      return b;
    };
    const minus = mk('A', 11, 'Schrift kleiner – das Markierte, sonst der ganze Text', -1);
    const plus = mk('A', 17, 'Schrift größer – das Markierte, sonst der ganze Text', 1);
    const style = document.createElement('style');
    style.textContent = '#ed-bar .ed-size{min-width:34px;text-align:center;font:600 13px Raleway,system-ui,sans-serif;'
      + 'color:#eaf1ff}';                       // the bar's own colour - inherit gave it the body's dark blue on near black (Doc, 23.09.2026: "kaum lesbar")
    document.head.appendChild(style);
    const slot = bar.querySelector('[data-slot=size]');   // right after the marks, as in the Fahrplan (deck-edit.js TOOLS)
    if (slot) { slot.appendChild(minus); slot.appendChild(num); slot.appendChild(plus); }
    else { bar.appendChild(sep); bar.appendChild(minus); bar.appendChild(num); bar.appendChild(plus); }
    const open = () => (E.text && E.text()) || null;   // a text open for typing (deck-edit.js)
    const marked = () => { const s = getSelection(); return !!s.rangeCount && !s.isCollapsed; };
    // a label's own size: chosen by its frame, or open with nothing marked; a chosen box has none of its own (corners)
    const label = () => { const t = open(); return t ? (t.matches('.pic p.fl') && !marked() ? t : null) : sel && !isBox(sel) ? sel : null; };
    const sizeOf = el => parseFloat(el.style.fontSize) || parseFloat(getComputedStyle(el).fontSize) || 12.5;
    function showSize() {
      const l = E.on() ? label() : null, t = E.on() ? open() : null;
      const px = l ? sizeOf(l) : t && E.sizePx ? E.sizePx() : 0;
      // only the number: the two A stand there in full like the whole bar (Doc, 05.10.2026: "nicht grayed out") - a
      // click with nothing to act on says so (bump)
      const txt = px ? String(Math.round(px * 10) / 10).replace('.', ',') : '–';
      if (num.textContent !== txt) num.textContent = txt;
    }
    function bump(d) {
      const el = label();
      if (!el) {                                       // an open text: the marked words, one step (deck-edit.js)
        if (open() && E.size) { if (E.size(d)) showSize(); }
        else E.msg('Erst einen Text anklicken oder Wörter darin markieren');
        return;
      }
      const g = geo(el);
      place(el, Object.assign({}, g, { s: Math.max(4, Math.min(200, sizeOf(el) + d)) }));
      if (el !== sel) select(el);
      showSize();
      clearTimeout(nudgeT);
      nudgeT = setTimeout(function () { save(el); }, 400);   // a row of presses is one write
    }
    onSelect = showSize;                               // a label chosen or let go: the number follows
    document.addEventListener('deck-edit-state', showSize);   // a text opened, closed or marked (deck-edit.js state())
    addEventListener('keyup', showSize);
    document.addEventListener('selectionchange', showSize);   // marking other words: their size
    document.addEventListener('deck-edit-off', showSize);
    painted.push(showSize);
    showSize();
  }

  document.addEventListener('deck-edit-off', function () {
    unselect();
    if (grab) { grab = false; document.documentElement.classList.remove('box-grab'); }
  });
  addEventListener('resize', frame);
  painted.push(function () { if (sel && !sel.closest('.slide.on')) unselect(); });
})();
