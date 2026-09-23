// DocPoint step 1: pictures in the deck editor - only on Doc's machine, loaded by deck-edit.js (Doc, 17.09.2026:
// "ich träume von DocPoint, das cooler ist als PPT"). While editing (E), like PowerPoint:
//   drop a picture file onto the slide, or paste one (Cmd-V)  -> it lands there and is written into the deck file
//   drag a picture                                            -> moves it (snaps to margins and middle; Shift: straight
//                                                                only, Alt: no snapping)
//   touch a picture the generator placed                      -> it becomes a free picture right where it is, then as above
//                                                                (Doc, 23.09.2026: "verschieben etc ... IMMER!")
//   drag a corner / a side handle                             -> resizes with the proportions / stretches one way
//   drag the knob above it                                    -> rotates (snaps to 0/90/180/270; Shift: 15° steps)
//   Backspace / Delete, arrow keys (Shift: 10 px)             -> removes, nudges
// The file side lives in tools/pptx/deck_image.py; it goes live with the green cloud like every text change.
(function () {
  const E = window.DeckEdit;
  if (!E || typeof slides === 'undefined') return;
  const W = 960, H = 540;                              // a slide in design px
  const MAX_EDGE = 1600, MAX_BYTES = 900 * 1024;       // downscaled here: nothing big in git, serve.py takes 1 MB
  const SNAP = 6, SNAP_DEG = 4;
  const XS = [72, 480, 888], YS = [146, 270, 496];     // margins, middle, body top and bottom (design_lib.py)
  const TYPES = /^image\/(png|jpeg|webp|gif|svg\+xml)$/;
  const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  const SAVED = new WeakMap();                         // picture -> its style as the file holds it
  const ORIG = new WeakMap();                          // generator picture set free on the page, not yet in the file -> {src, n}
  let sel = null, drag = null, queue = Promise.resolve(), nudgeT = 0;

  const css = document.createElement('style');
  css.textContent = [
    'html.deck-edit .slide img:not(.greet-pic){cursor:move;-webkit-user-drag:none;user-select:none}',
    'html.deck-edit .slide img:not(.greet-pic):hover{outline:1px dashed rgba(245,194,66,.75)}',
    '#pic-box{position:absolute;z-index:50;pointer-events:none;outline:calc(2px / var(--k,1)) solid rgb(245,194,66)}',
    '#pic-box i,#pic-box b{position:absolute;width:calc(12px / var(--k,1));height:calc(12px / var(--k,1));',
    '  transform:translate(-50%,-50%);background:#fff;border:calc(2px / var(--k,1)) solid rgb(245,194,66);',
    '  box-sizing:border-box;pointer-events:auto}',
    '#pic-box i{border-radius:2px}',
    '#pic-box i[data-c=nw]{left:0;top:0;cursor:nwse-resize}#pic-box i[data-c=n]{left:50%;top:0;cursor:ns-resize}',
    '#pic-box i[data-c=ne]{left:100%;top:0;cursor:nesw-resize}#pic-box i[data-c=e]{left:100%;top:50%;cursor:ew-resize}',
    '#pic-box i[data-c=se]{left:100%;top:100%;cursor:nwse-resize}#pic-box i[data-c=s]{left:50%;top:100%;cursor:ns-resize}',
    '#pic-box i[data-c=sw]{left:0;top:100%;cursor:nesw-resize}#pic-box i[data-c=w]{left:0;top:50%;cursor:ew-resize}',
    // the rotation knob sits above the middle of the top edge, on a short stem
    '#pic-box b{left:50%;top:calc(-28px / var(--k,1));border-radius:50%;cursor:grab}',
    '#pic-box::before{content:"";position:absolute;left:50%;top:calc(-22px / var(--k,1));height:calc(22px / var(--k,1));',
    '  border-left:calc(2px / var(--k,1)) solid rgb(245,194,66)}',
    '@media print{#pic-box{display:none}}'
  ].join('\n');
  document.head.appendChild(css);

  const box = document.createElement('div');
  box.id = 'pic-box';
  box.innerHTML = HANDLES.map(function (c) { return '<i data-c="' + c + '"></i>'; }).join('') + '<b data-c="rot"></b>';

  const deckEl = () => document.getElementById('deck');
  const scale = () => deckEl().getBoundingClientRect().width / W;
  function at(e) {                                     // pointer -> slide px
    const r = deckEl().getBoundingClientRect(), k = r.width / W;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  }
  const round = v => Math.round(v * 10) / 10;
  const saved = img => SAVED.has(img) ? SAVED.get(img) : img.getAttribute('style');
  const why = err => /fetch/i.test(err.message) ? 'serve.py antwortet nicht' : err.message;

  // where a picture stands: its unturned box (left/top/width/height), the turn, and whether its height is its own
  function geo(img) {
    const turn = /rotate\((-?[\d.]+)deg\)/.exec(img.style.transform || '');
    return { x: parseFloat(img.style.left) || 0, y: parseFloat(img.style.top) || 0,
             w: parseFloat(img.style.width) || img.offsetWidth, h: parseFloat(img.style.height) || img.offsetHeight,
             r: turn ? parseFloat(turn[1]) : 0, fixed: !!img.style.height };
  }
  function place(img, g) {
    // the file's style, taken before the first change - a picture loaded with the page has no entry yet
    // (Doc, 17.09.2026: after a reload every drag "flipped zurück", the server saw the changed style as old)
    if (!SAVED.has(img)) SAVED.set(img, img.getAttribute('style'));
    img.style.left = round(g.x) + 'px'; img.style.top = round(g.y) + 'px'; img.style.width = round(g.w) + 'px';
    img.style.height = g.fixed ? round(g.h) + 'px' : '';
    img.style.transform = g.r ? 'rotate(' + round(g.r) + 'deg)' : '';
    if (img === sel) frame();
  }

  // the drawn picture inside its element, in slide px: in a .pic/.below/.chap-pic box it is object-fit:contain, so a
  // box wider or taller than the picture has margins that are not picture
  function shown(img) {
    const d = deckEl().getBoundingClientRect(), k = d.width / W, r = img.getBoundingClientRect();
    let x = (r.left - d.left) / k, y = (r.top - d.top) / k, w = r.width / k, h = r.height / k;
    const nw = img.naturalWidth, nh = img.naturalHeight;
    if (nw && nh && getComputedStyle(img).objectFit === 'contain') {
      const s = Math.min(w / nw, h / nh), cw = nw * s, ch = nh * s;
      x += (w - cw) / 2; y += (h - ch) / 2; w = cw; h = ch;
    }
    // the height is its own only where the generator squeezed the picture; otherwise the width carries it
    return { x: x, y: y, w: w, h: h, r: 0, fixed: !(nw && nh) || Math.abs(h - w * nh / nw) > 0.5 };
  }
  const emptyBox = el => el.matches('.pic, .below, .chap-pic') && !el.children.length && !el.textContent.trim();
  // A picture the generator placed (a .pic, a .below, a chapter picture, Kahneman beside his bullets) becomes a free
  // picture on the first touch, right where it is - on the page now, in the file with its first change. The box that
  // held only this picture goes with it; a chapter picture loses its card. Solita's greeting picture stays as it is.
  function free(img) {
    const slide = img.closest('.slide'), src = img.getAttribute('src'), box = img.parentElement;
    const n = [...slide.querySelectorAll('img:not(.free-pic)')].filter(function (i) { return i.getAttribute('src') === src; }).indexOf(img);
    const g = shown(img);
    ORIG.set(img, { src: src, n: n });
    img.className = 'free-pic';
    img.setAttribute('style', 'position:absolute;left:' + round(g.x) + 'px;top:' + round(g.y) + 'px;width:' + round(g.w) + 'px'
      + (g.fixed ? ';height:' + round(g.h) + 'px' : ''));
    slide.insertBefore(img, slide.querySelector(':scope > p.foot'));
    if (emptyBox(box)) box.remove();
    E.msg('Bild ist frei – ziehen verschiebt, Ecken und Seiten ändern die Größe, der Knopf oben dreht');
  }

  function frame() {
    if (!sel) return;
    sel.after(box);                                    // same slide, same coordinates, right above the picture
    box.style.cssText = 'left:' + sel.offsetLeft + 'px;top:' + sel.offsetTop + 'px;width:' + sel.offsetWidth
      + 'px;height:' + sel.offsetHeight + 'px;transform:' + (sel.style.transform || 'none') + ';--k:' + scale();
  }
  function select(img) { sel = img; frame(); }
  function unselect() { sel = null; box.remove(); }

  // the overview keeps copies of the slides - they follow the file too
  function tileOf(img) {
    const i = slides.indexOf(img.closest('.slide'));
    const t = document.querySelectorAll('#overview .ov-thumb')[i];
    return t && t.querySelector('.slide');
  }
  function tilePic(img) {
    const t = tileOf(img);
    return t && t.querySelector('.free-pic[data-pic="' + img.dataset.pic + '"]');
  }
  function freeTile(img, o, keep) {                    // the overview copy of a freed picture follows: freed too, or gone
    const t = tileOf(img);
    const c = t && [...t.querySelectorAll('img:not(.free-pic)')].filter(function (i) { return i.getAttribute('src') === o.src; })[o.n];
    if (!c) return;
    const box = c.parentElement;
    if (keep) t.insertBefore(img.cloneNode(), t.querySelector(':scope > p.foot'));
    c.remove();
    if (emptyBox(box)) box.remove();
  }

  function post(url, body, type) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': type }, body: body })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; }); });
  }
  // one write after the other, in the order they were made
  function send(q) {
    const p = queue.then(function () {
      return post('/__deck/image/pic', JSON.stringify(Object.assign({ deck: E.deck }, q)), 'application/json');
    }).then(function (j) { E.changed(j); return j; });
    queue = p.catch(function () { });
    return p;
  }

  function save(img) {
    const old = saved(img), g = geo(img), i = slides.indexOf(img.closest('.slide')), o = ORIG.get(img);
    if (o) {                                           // the first change of a generator picture: it enters the file free
      return send({ slide: i, op: 'free', src: o.src, n: o.n, x: g.x, y: g.y, w: g.w, h: g.fixed ? g.h : null, r: g.r || null })
        .then(function (j) {
          ORIG.delete(img); img.dataset.pic = j.id; SAVED.set(img, j.style);
          freeTile(img, o, true);
        })
        .catch(function (err) { E.msg('Bild nicht gespeichert: ' + why(err)); });
    }
    return send({ slide: i, op: 'move', id: img.dataset.pic, old: old,
                  x: g.x, y: g.y, w: g.w, h: g.fixed ? g.h : null, r: g.r || null })
      .then(function (j) {
        SAVED.set(img, j.style);
        const c = tilePic(img);
        if (c) c.setAttribute('style', j.style);
      })
      .catch(function (err) {
        img.setAttribute('style', old); SAVED.set(img, old);
        if (img === sel) frame();
        E.msg('Bild nicht gespeichert: ' + why(err));
      });
  }

  function remove(img) {
    unselect();
    const i = slides.indexOf(img.closest('.slide')), o = ORIG.get(img);
    send(o ? { slide: i, op: 'free', src: o.src, n: o.n, del: true } : { slide: i, op: 'del', id: img.dataset.pic, old: saved(img) })
      .then(function () {
        if (o) freeTile(img, o, false);
        else { const c = tilePic(img); if (c) c.remove(); }
        img.remove();
        E.msg('Bild entfernt');
      })
      .catch(function (err) { E.msg('Bild nicht entfernt: ' + why(err)); });
  }

  // a picture file -> small enough for git -> uploaded -> on the current slide, centred on (cx, cy)
  function prepare(file) {
    return new Promise(function (ok, fail) {
      const url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        URL.revokeObjectURL(url);
        const nw = im.naturalWidth || 400, nh = im.naturalHeight || 300;
        const s = Math.min(1, MAX_EDGE / Math.max(nw, nh));
        const keep = /gif|svg/.test(file.type);       // an animation or a drawing stays as it is
        if (keep || (s === 1 && file.size <= MAX_BYTES)) {
          if (file.size > MAX_BYTES) return fail(new Error('größer als 900 KB – bitte vorher verkleinern'));
          return ok({ blob: file, w: nw, h: nh });
        }
        const c = document.createElement('canvas');
        c.width = Math.round(nw * s); c.height = Math.round(nh * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        const type = file.type === 'image/jpeg' ? 'image/jpeg' : file.type === 'image/png' ? 'image/png' : 'image/webp';
        c.toBlob(function (b) {
          if (b && b.size <= MAX_BYTES) return ok({ blob: b, w: c.width, h: c.height });
          c.toBlob(function (b2) {                     // a big photo as PNG: WebP keeps transparency and is small
            if (b2 && b2.size <= MAX_BYTES) ok({ blob: b2, w: c.width, h: c.height });
            else fail(new Error('auch verkleinert noch zu groß'));
          }, 'image/webp', 0.82);
        }, type, 0.86);
      };
      im.onerror = function () { URL.revokeObjectURL(url); fail(new Error('das Bild lässt sich nicht lesen')); };
      im.src = url;
    });
  }

  function insert(file, cx, cy) {
    const slide = slides[si], i = si;
    E.msg('Bild wird eingefügt …');
    prepare(file)
      .then(function (p) {
        return post('/__deck/image/upload?deck=' + encodeURIComponent(E.deck), p.blob, p.blob.type)
          .then(function (u) {
            const w = Math.min(p.w, 400, W - 40), h = w * p.h / p.w;
            const x = Math.max(0, Math.min(W - w, cx - w / 2)), y = Math.max(0, Math.min(H - h, cy - h / 2));
            return send({ slide: i, op: 'add', src: u.src, x: x, y: y, w: w }).then(function (j) {
              const img = document.createElement('img');
              img.className = 'free-pic'; img.dataset.pic = j.id; img.src = u.src; img.alt = ''; img.setAttribute('style', j.style);
              SAVED.set(img, j.style);
              const foot = slide.querySelector(':scope > p.foot');
              slide.insertBefore(img, foot);
              const t = tileOf(img);
              if (t) t.insertBefore(img.cloneNode(), t.querySelector(':scope > p.foot'));
              if (img.complete) select(img); else img.addEventListener('load', function () { select(img); }, { once: true });
              E.msg('Bild eingefügt – ziehen verschiebt, Ecken und Seiten ändern die Größe, der Knopf oben dreht');
            });
          });
      })
      .catch(function (err) { E.msg('Bild nicht eingefügt: ' + why(err)); });
  }

  const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].indexOf('Files') >= 0;
  const pictures = list => [...(list || [])].filter(function (f) { return TYPES.test(f.type); });

  addEventListener('dragover', function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();                                // otherwise the browser opens the file instead of the deck
    e.dataTransfer.dropEffect = E.on() ? 'copy' : 'none';
  }, true);
  addEventListener('drop', function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault(); e.stopPropagation();
    if (!E.on()) { E.msg('Bilder einfügen: erst E drücken'); return; }
    const files = pictures(e.dataTransfer.files);
    if (!files.length) { E.msg('Nur PNG, JPEG, WebP, GIF oder SVG'); return; }
    const p = at(e);
    files.forEach(function (f, k) { insert(f, p.x + 24 * k, p.y + 24 * k); });
  }, true);
  addEventListener('paste', function (e) {
    if (!E.on() || (document.activeElement && document.activeElement.isContentEditable)) return;
    const files = pictures(e.clipboardData && e.clipboardData.files);
    if (!files.length) return;
    e.preventDefault();
    files.forEach(function (f, k) { insert(f, W / 2 + 24 * k, H / 2 + 24 * k); });
  });

  // snap one edge or the middle of the picture to a margin or the middle of the slide
  function snap(v, len, lines) {
    let best = null;
    [0, len / 2, len].forEach(function (off) {
      lines.forEach(function (l) {
        const d = l - (v + off);
        if (Math.abs(d) <= SNAP && (best === null || Math.abs(d) < Math.abs(best))) best = d;
      });
    });
    return best === null ? v : v + best;
  }
  const deg = (p, c) => Math.atan2(p.y - c.y, p.x - c.x) * 180 / Math.PI;

  // pointer events, not clicks: in edit mode deck-edit.js keeps every click inside #deck for itself
  addEventListener('pointerdown', function (e) {
    if (!E.on() || e.button !== 0 || !e.target.closest) return;
    const handle = e.target.closest('#pic-box [data-c]');
    const img = handle ? sel : e.target.closest('#deck .slide.on img:not(.greet-pic)');
    if (!img) {
      if (sel && e.target.closest('#deck')) unselect();
      return;
    }
    e.preventDefault(); e.stopPropagation();          // no native picture drag, no text selection
    if (!img.classList.contains('free-pic')) free(img);
    if (img !== sel) select(img);
    const g = geo(img);
    drag = { c: handle ? handle.dataset.c : null, from: at(e), g: g, moved: false,
             centre: { x: g.x + g.w / 2, y: g.y + g.h / 2 } };
  }, true);

  addEventListener('pointermove', function (e) {
    if (!drag || !sel) return;
    e.preventDefault();
    const q = at(e), g = drag.g;
    let dx = q.x - drag.from.x, dy = q.y - drag.from.y;
    drag.moved = drag.moved || Math.abs(dx) + Math.abs(dy) > 0.5;

    if (!drag.c) {                                     // move
      if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      place(sel, Object.assign({}, g, { x: e.altKey ? g.x + dx : snap(g.x + dx, g.w, XS),
                                        y: e.altKey ? g.y + dy : snap(g.y + dy, g.h, YS) }));
      return;
    }

    if (drag.c === 'rot') {                            // rotate around the middle
      let r = g.r + deg(q, drag.centre) - deg(drag.from, drag.centre);
      r = ((r % 360) + 540) % 360 - 180;               // -180 .. 180
      if (e.shiftKey) r = Math.round(r / 15) * 15;
      else { const n = Math.round(r / 90) * 90; if (Math.abs(r - n) <= SNAP_DEG) r = n; }
      place(sel, Object.assign({}, g, { r: r === -180 ? 180 : r }));
      return;
    }

    // resize in the picture's own (turned) axes; the opposite corner or side stays where it is
    const t = g.r * Math.PI / 180, cos = Math.cos(t), sin = Math.sin(t);
    const lx = dx * cos + dy * sin, ly = -dx * sin + dy * cos;
    const sx = drag.c.indexOf('e') >= 0 ? 1 : drag.c.indexOf('w') >= 0 ? -1 : 0;
    const sy = drag.c.indexOf('s') >= 0 ? 1 : drag.c.indexOf('n') >= 0 ? -1 : 0;
    let w = sx ? Math.max(16, g.w + sx * lx) : g.w;
    let h = sy ? Math.max(16, g.h + sy * ly) : g.h;
    if (sx && sy) h = w * g.h / g.w;                   // a corner keeps the proportions
    const ax = -sx * g.w / 2, ay = -sy * g.h / 2;      // the anchor, seen from the old middle
    const px = drag.centre.x + ax * cos - ay * sin, py = drag.centre.y + ax * sin + ay * cos;
    const bx = -sx * w / 2, by = -sy * h / 2;          // the same anchor, seen from the new middle
    const cx = px - (bx * cos - by * sin), cy = py - (bx * sin + by * cos);
    place(sel, { x: cx - w / 2, y: cy - h / 2, w: w, h: h, r: g.r, fixed: g.fixed || !(sx && sy) });
  }, true);

  addEventListener('pointerup', function () {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved && sel) save(sel);
  }, true);

  // capture phase after deck-edit.js: arrows and Backspace on a chosen picture never turn the page
  addEventListener('keydown', function (e) {
    if (!sel || !E.on() || e.metaKey || e.ctrlKey) return;
    // an open text keeps its keys (Backspace, Shift+arrows select) - never both a text and a picture react
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (document.activeElement && document.activeElement.isContentEditable) return;
    const step = e.shiftKey ? 10 : 1;
    const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault(); e.stopPropagation();
      remove(sel);
    } else if (move) {
      e.preventDefault(); e.stopPropagation();
      const g = geo(sel), img = sel;
      place(img, Object.assign(g, { x: g.x + move[0], y: g.y + move[1] }));
      clearTimeout(nudgeT);
      nudgeT = setTimeout(function () { save(img); }, 400);   // a row of presses is one write
    }
  }, true);

  document.addEventListener('deck-edit-off', unselect);
  addEventListener('resize', frame);
  painted.push(function () { if (sel && !sel.closest('.slide.on')) unselect(); });
})();
