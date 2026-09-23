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
  if (typeof slides === 'undefined') return;
  // The presenter window gets the slide menu too (Doc, 22.09.2026: right-click in the strip gave Chrome's
  // menu) - but nothing that edits text: there is no room for a caret while the class is watching.
  const PRES = document.documentElement.classList.contains('presenter');
  const root = document.documentElement;
  const DECK = decodeURIComponent(location.pathname.split('/').pop());
  const SRC = new WeakMap();                          // element -> its source text, as the file holds it
  let on = false, cur = null, busy = false, tt = 0, selector = '', pending = false, publishing = false, dirty = false;
  let held = 0;                                       // when a drag ended (deck-label.js): its click, if one comes at all, opens no text
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
    /* thin and grey: the frames say where a text is, they are not the thing to look at
       (Doc, 22.09.2026: "alle Linien duenner und gray") - the deck's own muted blue-grey, never black */
    'html.deck-edit [data-ed]{cursor:text;outline:.5px dashed rgba(110,126,159,.5);outline-offset:3px}',
    'html.deck-edit [data-ed]:hover{outline:1px dashed rgba(110,126,159,.85)}',
    'html.deck-edit [data-ed].ed-on{outline:1px solid rgba(110,126,159,.95);background:rgba(110,126,159,.10);',
    '  white-space:pre-wrap;caret-color:rgb(176,36,24)}',
    'html.deck-edit [data-ed].ed-busy{opacity:.5}',
    '#ed-bar{position:fixed;z-index:31;transform:translateX(-50%);display:flex;align-items:center;gap:4px;',
    '  flex-wrap:wrap;justify-content:center;max-width:min(96vw,980px);',
    '  padding:6px;border-radius:10px;background:rgba(7,22,48,.98);border:1px solid rgba(245,194,66,.55);',
    '  box-shadow:0 10px 30px rgba(0,0,0,.45)}',
    '#ed-bar[hidden],#ed-menu[hidden]{display:none}',
    '#ed-bar button{display:flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;',
    '  border:0;border-radius:7px;background:none;color:#eaf1ff;cursor:pointer;',
    '  font:700 16px Raleway,system-ui,sans-serif}',
    '#ed-bar button:hover:not(:disabled){background:rgba(245,194,66,.22)}',
    '#ed-bar button.on{background:rgba(245,194,66,.34);color:rgb(245,194,66)}',
    '#ed-bar button:disabled{opacity:.35;cursor:default}',
    '#ed-bar button svg{width:22px;height:22px}',
    '#ed-bar .ed-dot{width:25px;height:25px}',
    '#ed-bar .ed-dot svg{width:19px;height:19px}',
    '#ed-bar .ed-kursiv{font-weight:500;font-style:italic;font-family:Georgia,serif}',
    '#ed-bar .ed-unter{text-decoration:underline}',
    '#ed-bar .ed-durch{text-decoration:line-through}',
    '#ed-bar .ed-schrift{width:auto;gap:6px;padding:0 10px;font-weight:500;font-size:14px}',
    '#ed-bar .ed-sep{width:1px;height:20px;margin:0 3px;background:rgba(255,255,255,.18)}',
    '#ed-menu{position:fixed;z-index:32;min-width:180px;padding:6px;border-radius:10px;',
    '  background:rgba(7,22,48,.98);border:1px solid rgba(245,194,66,.55);box-shadow:0 10px 30px rgba(0,0,0,.45)}',
    '#ed-menu button{display:block;width:100%;padding:9px 12px;border:0;border-radius:7px;background:none;',
    '  color:#eaf1ff;font-size:16px;text-align:left;cursor:pointer}',
    '#ed-menu button:hover{background:rgba(245,194,66,.22)}',
    '#ed-menu button.on{color:rgb(245,194,66)}',
    '#ov-menu{position:fixed;z-index:30;min-width:190px;padding:6px;border-radius:10px;',
    '  background:rgba(7,22,48,.98);border:1px solid rgba(245,194,66,.55);box-shadow:0 10px 30px rgba(0,0,0,.45)}',
    '#ov-menu button{display:block;width:100%;padding:8px 12px;border:0;border-radius:7px;background:none;',
    '  color:#eaf1ff;font:500 14px Raleway,system-ui,sans-serif;text-align:left;cursor:pointer}',
    '#ov-menu button:hover:not(:disabled){background:rgba(245,194,66,.22)}',
    '#ov-menu button:disabled{opacity:.35;cursor:default}',
    '#ov-menu hr{border:0;border-top:1px solid rgba(255,255,255,.14);margin:5px 8px}',
    '@media print{#nav-edit,#nav-live,#ed-bar{display:none}}'
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
  if (PRES) { btn.hidden = true; live.hidden = true; }
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
    if (PRES) return;
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

  // ---------------------------------------------------------------- markup ---
  // The browser's copy of tools/pptx/deck_markup.py, with one difference: a formula stays the text
  // $...$ that Doc types, everything else is SHOWN instead of spelled out - bold reads as bold, not as
  // '**bold**' (Doc, 22.09.2026: "die markups moechte ich eigentlich nicht (ausser LaTeX - logisch)").
  // What travels back to the server is markup again, so the file keeps the shape html_deck.py writes.
  const B0 = String.fromCharCode(2), B1 = String.fromCharCode(3);   // a **...** around a formula, kept through the split at $
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const clean = s => s.replace(/\s*\n\s*/g, ' ').trim();

  function inline(part) {
    return esc(part)
      .replace(/\*\*((?:[^*]|\*(?!\*))+?)\*\*/g, '<b>$1</b>')   // a lone * may sit inside: **COUNT(*)**
      .replace(/&lt;(\/?)([bius])&gt;/g, '<$1$2>')
      .replace(/&lt;([cf])([1-9])&gt;/g, '<span class="$1$2">')
      .replace(/&lt;\/[cf][1-9]&gt;/g, '</span>');
  }

  function srcToHtml(src) {
    if (src.indexOf('$') < 0) return inline(src);
    const t = src.replace(/\*\*((?:[^*$]|\*(?!\*)|\$[^$]*\$)+?)\*\*/g,
      function (m, g) { return g.indexOf('$') >= 0 ? B0 + g + B1 : m; });
    return t.split(/(\$[^$]*\$)/).map(function (part, i) { return i % 2 ? esc(part) : inline(part); })
      .join('').split(B0).join('<b>').split(B1).join('</b>');
  }

  // a colour is <c1>..<c9>, a typeface <f1>..<f4> - one span each, so a word can carry both
  function kindOf(n, k) {
    if (n.nodeType !== 1 || !n.classList) return '';
    for (let i = 0; i < n.classList.length; i++) {
      const c = n.classList[i];
      if (c.length === 2 && c[0] === k && c[1] >= '1' && c[1] <= '9') return c;
    }
    return '';
  }

  // The way back: <b>, <i> and <c2> are what deck_markup reads. Whatever the browser invented while
  // typing (a stray <span style>, a <div>, a <font>) falls away and its text stays - the file only ever
  // holds the four things the deck knows.
  function htmlToSrc(node) {
    let out = '';
    node.childNodes.forEach(function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      if (n.nodeName === 'BR') { out += ' '; return; }
      const inner = htmlToSrc(n);
      if (!inner) return;
      const c = kindOf(n, 'c') || kindOf(n, 'f');
      const t = n.nodeName;
      if (!inner.trim()) out += inner;                // nothing but blanks: no tag around it
      else if (c) out += '<' + c + '>' + inner + '</' + c + '>';
      else if (t === 'B' || t === 'STRONG') out += '<b>' + inner + '</b>';
      else if (t === 'I' || t === 'EM') out += '<i>' + inner + '</i>';
      else if (t === 'U' || t === 'INS') out += '<u>' + inner + '</u>';
      else if (t === 'S' || t === 'STRIKE' || t === 'DEL') out += '<s>' + inner + '</s>';
      else out += inner;
    });
    return out;
  }

  // ------------------------------------------------------------- Werkzeuge ---
  // Over the slide, for as long as edit mode is on (Doc, 22.09.2026: "Werkzeuge oben ueber der Folie:
  // Farben etc."). The three colours are the deck's own (deck.css .c1/.c2/.c3), so a coloured word on a
  // slide looks like every other accent in the house.
  const DOT = f => '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="' + f + '"/></svg>';
  const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
    + 'stroke-linejoin="round" aria-hidden="true" style="width:13px;height:13px"><path d="M6 9l6 6 6-6"/></svg>';
  const VAR = { c1: 'orange', c2: 'red', c3: 'green', c4: 'blue', c5: 'teal',
                c6: 'violet', c7: 'magenta', c8: 'brown', c9: 'slate' };
  const NODOT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">'
    + '<circle cx="12" cy="12" r="8"/><path d="M6.3 17.7L17.7 6.3"/></svg>';
  // The nine colours are deck.css .c1-.c9, the four typefaces .f1-.f4 - one place for the look, here only
  // the buttons. Keep both lists in step with the stylesheet, or a word would carry a class nobody draws.
  const TONE = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'];
  const NAME = { c1: 'Orange', c2: 'Rot', c3: 'Gruen', c4: 'Blau', c5: 'Petrol',
                 c6: 'Violett', c7: 'Magenta', c8: 'Braun', c9: 'Grau' };
  const FONTS = [
    ['f0', 'Wie die Folie', ''],
    ['f1', 'Raleway', 'Raleway,system-ui,sans-serif'],
    ['f2', 'Orbitron', 'Orbitron,system-ui,sans-serif'],
    ['f3', 'Times', '"Times New Roman",Times,Georgia,serif'],
    ['f4', 'Menlo', 'Menlo,Consolas,monospace']
  ];
  const TOOLS = [
    ['bold', 'F', '', 'Fett (' + K + 'B)'],
    ['italic', 'K', 'ed-kursiv', 'Kursiv (' + K + 'I)'],
    ['underline', 'U', 'ed-unter', 'Unterstrichen (' + K + 'U)'],
    ['strikeThrough', 'S', 'ed-durch', 'Durchgestrichen'],
    null
  ].concat(TONE.map(function (c) { return [c, '', 'ed-dot', NAME[c]]; }),
           [['c0', '', 'ed-dot', 'Farbe weg'], null, ['schrift', 'Aa', 'ed-schrift', 'Schrift waehlen']]);

  const tools = document.createElement('div');
  tools.id = 'ed-bar';
  tools.hidden = true;
  function toolButton(t) {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.cmd = t[0]; b.title = t[3]; b.setAttribute('aria-label', t[3]);
    b.className = t[2] || '';
    if (t[0] === 'schrift') b.innerHTML = '<span>Aa</span>' + CHEV;
    else if (t[1]) b.textContent = t[1];
    else b.innerHTML = t[0] === 'c0' ? NODOT : DOT('var(--' + VAR[t[0]] + ')');
    // mousedown would take the caret out of the text and save it on its own - the click does the work
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      if (t[0] === 'schrift') fontMenu(b); else { closeFonts(); apply(t[0]); }
    });
    return b;
  }
  TOOLS.forEach(function (t) {
    if (!t) { const sep = document.createElement('span'); sep.className = 'ed-sep'; tools.appendChild(sep); return; }
    tools.appendChild(toolButton(t));
  });
  if (!PRES) document.body.appendChild(tools);

  // the typefaces sit in a little list instead of the row: each entry is set in its own face, so Doc
  // picks what he sees (Doc, 22.09.2026: "Fonts ... Raleway Times etc.")
  let fonts = null;
  function closeFonts() { if (fonts) { fonts.remove(); fonts = null; } }
  function fontMenu(anchorBtn) {
    if (fonts) { closeFonts(); return; }
    if (!cur || busy) { msg('Erst einen Text anklicken - dann wirken die Werkzeuge'); return; }
    fonts = document.createElement('div');
    fonts.id = 'ed-menu';
    const now = here('f');
    FONTS.forEach(function (f) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = f[1];
      if (f[2]) b.style.fontFamily = f[2];
      if ((now || 'f0') === f[0]) b.classList.add('on');
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function (e) { e.stopPropagation(); closeFonts(); apply(f[0]); });
      fonts.appendChild(b);
    });
    document.body.appendChild(fonts);
    const r = anchorBtn.getBoundingClientRect(), m = fonts.getBoundingClientRect();
    fonts.style.left = Math.max(8, Math.min(r.left, innerWidth - m.width - 8)) + 'px';
    fonts.style.top = Math.min(r.bottom + 6, innerHeight - m.height - 8) + 'px';
  }

  function place() {
    const d = document.getElementById('deck');
    if (!d || tools.hidden) return;
    const r = d.getBoundingClientRect();
    tools.style.left = Math.round(r.left + r.width / 2) + 'px';
    tools.style.top = Math.max(8, Math.round(r.top - tools.offsetHeight - 12)) + 'px';
  }
  addEventListener('resize', place);

  function unwrap(el) {
    const p = el.parentNode;
    while (el.firstChild) p.insertBefore(el.firstChild, el);
    p.removeChild(el);
  }
  function covers(r, el) {                            // does the selection hold this element whole?
    const a = document.createRange();
    a.selectNodeContents(el);
    return r.compareBoundaryPoints(Range.START_TO_START, a) <= 0
        && r.compareBoundaryPoints(Range.END_TO_END, a) >= 0;
  }

  // what the selection already carries of this kind ('c' or 'f'), read from the caret upwards
  function here(kind) {
    if (!cur) return '';
    const sel = getSelection();
    const n = sel.rangeCount ? sel.getRangeAt(0).commonAncestorContainer : null;
    for (let p = n; p && p !== cur.el; p = p.parentNode) { const c = kindOf(p, kind); if (c) return c; }
    return '';
  }

  // One span of this kind around the selection, and only one: an older one inside it goes, and one that
  // wrapped the selection from outside goes too - otherwise "Farbe weg" would leave the outer one behind.
  // Colour and typeface are separate kinds, so setting a colour never throws the typeface away.
  function wrap(kind, cls) {
    const sel = getSelection();
    if (!sel.rangeCount || sel.isCollapsed) { msg('Erst ein Stueck Text markieren'); return; }
    const r = sel.getRangeAt(0);
    if (!cur.el.contains(r.commonAncestorContainer)) return;
    let outer = null;
    for (let p = r.commonAncestorContainer; p && p !== cur.el; p = p.parentNode) {
      if (kindOf(p, kind) && covers(r, p)) { outer = p; break; }
    }
    const frag = r.extractContents();
    frag.querySelectorAll('span').forEach(function (sp) { if (kindOf(sp, kind)) unwrap(sp); });
    let first = frag.firstChild, last = frag.lastChild;
    if (cls) {
      const sp = document.createElement('span');
      sp.className = cls;
      sp.appendChild(frag);
      r.insertNode(sp);
      first = last = sp;
    } else {
      r.insertNode(frag);
    }
    if (outer && outer.parentNode) unwrap(outer);
    if (first && last && first.parentNode) {
      const nr = document.createRange();
      nr.setStartBefore(first); nr.setEndAfter(last);
      sel.removeAllRanges(); sel.addRange(nr);
    }
  }

  const MARKS = ['bold', 'italic', 'underline', 'strikeThrough'];

  function apply(what) {
    if (!cur || busy) { msg('Erst einen Text anklicken - dann wirken die Werkzeuge'); return; }
    cur.el.focus();
    if (MARKS.indexOf(what) >= 0) {
      try { document.execCommand('styleWithCSS', false, false); } catch (e) { }   // <b>, not <span style>
      document.execCommand(what);
    } else {
      wrap(what[0], what[1] === '0' ? '' : what);     // c0 / f0 take the colour or the typeface off again
    }
    if (cur.input) cur.input();
    state();
  }

  // which tools are on right now - grey while no text is open, lit while the selection carries them
  function state() {
    const open = !!cur && !busy;
    tools.querySelectorAll('button').forEach(function (b) {
      b.disabled = !open;
      const c = b.dataset.cmd;
      let act = false;
      if (open && MARKS.indexOf(c) >= 0) { try { act = document.queryCommandState(c); } catch (e) { } }
      if (open && /^c[1-9]$/.test(c)) act = here('c') === c;
      if (open && c === 'schrift') act = !!here('f');
      b.classList.toggle('on', act);
    });
  }
  document.addEventListener('selectionchange', function () { if (on && !PRES) state(); });

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
      tools.hidden = true; closeFonts();
      document.dispatchEvent(new Event('deck-edit-off'));
      return;
    }
    load().then(function (skipped) {
      on = true; root.classList.add('deck-edit'); label();
      if (!PRES) { tools.hidden = false; place(); state(); }
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

  // our own write is no reason for live reload (tools/live_reload.py) to reload the page
  const rebase = () => { try { if (window.__liveReload) window.__liveReload.rebase(); } catch (e) { } };

  function begin(el) {
    cur = { el: el, html: el.innerHTML, src: SRC.get(el), open: '', blur: null, input: null, paste: null };
    el.classList.add('ed-on');
    // the text as it reads, not as it is spelled: bold is bold, a colour is a colour, only $...$ stays text
    el.innerHTML = srcToHtml(cur.src);
    cur.open = el.innerHTML;                          // untouched means nothing to save - the file stays byte for byte
    el.setAttribute('contenteditable', 'true');
    cur.blur = function () { if (cur && cur.el === el && document.hasFocus()) end(true); };   // not when Doc only switches apps
    // the button turns to "Änderungen speichern" with the first typed letter, not only after Enter (Doc, 17.09.2026)
    cur.input = function () { dirty = !!cur && el.innerHTML !== cur.open; label(); };
    // what is pasted comes in as plain text - a deck knows four kinds of markup, not a web page's worth
    cur.paste = function (e) {
      e.preventDefault();
      const cb = e.clipboardData || window.clipboardData;
      document.execCommand('insertText', false, clean(cb ? cb.getData('text/plain') || '' : ''));
    };
    el.addEventListener('blur', cur.blur);
    el.addEventListener('input', cur.input);
    el.addEventListener('paste', cur.paste);
    el.focus();
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    state();
  }

  // keep: write what was typed; otherwise put the rendered text back as it was.
  // Resolves true once the text is written (or had nothing to write), false when it was dropped or failed.
  function end(keep) {
    if (!cur || busy) return Promise.resolve(false);
    const c = cur, el = c.el;
    // an untouched text goes back as it came: never let <b> and ** argue about the same word
    const text = el.innerHTML === c.open ? c.src : clean(htmlToSrc(el));
    el.removeEventListener('blur', c.blur);
    el.removeEventListener('input', c.input);
    el.removeEventListener('paste', c.paste);
    el.removeAttribute('contenteditable');
    if (!keep || text === c.src) {
      el.innerHTML = c.html; el.classList.remove('ed-on'); cur = null; dirty = false; label(); state();
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
        msg('Gespeichert – live erst mit „Änderungen speichern“'); label(); state();
        return true;
      })
      .catch(function (err) {                          // the typed text stays in the box - nothing is lost, Esc drops it
        el.innerHTML = srcToHtml(text);
        el.setAttribute('contenteditable', 'true');
        el.addEventListener('blur', c.blur);
        el.addEventListener('input', c.input);
        el.addEventListener('paste', c.paste);
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
  const TILES = '#overview .ov-cell, #pres .p-cell';
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
      window.DeckSlides.setHidden(i, hide);         // deck window, presenter strip and the other window
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
        sessionStorage.setItem('deck-edit-was', on ? '1' : '0');
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
  addEventListener('click', function (e) {
    if (!e.target.closest || (!e.target.closest('#ed-menu') && !e.target.closest('#ed-bar'))) closeFonts();
  }, true);
  addEventListener('scroll', closeMenu, true);

  // the menu hangs on the overview, not on edit mode: a right-click there is never meant for the browser
  addEventListener('contextmenu', function (e) {
    const cell = e.target.closest && e.target.closest(TILES);
    if (!cell || cell.dataset.i === undefined) return;
    e.preventDefault(); e.stopPropagation();
    openMenu(e.clientX, e.clientY, cellIndex(cell));
  }, true);

  // drag and drop inside the overview: the yellow edge shows where the slide lands
  let from = -1;
  const clearMarks = () => document.querySelectorAll('.ov-before,.ov-after,.ov-drag')
    .forEach(function (c) { c.classList.remove('ov-before', 'ov-after', 'ov-drag'); });
  addEventListener('dragstart', function (e) {
    const cell = e.target.closest && e.target.closest(TILES);
    if (!cell || cell.dataset.i === undefined) return;
    from = cellIndex(cell);
    cell.classList.add('ov-drag');
    try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(from)); } catch (err) { }
  }, true);
  addEventListener('dragover', function (e) {
    if (from < 0) return;
    const cell = e.target.closest && e.target.closest(TILES);
    e.preventDefault();
    try { e.dataTransfer.dropEffect = 'move'; } catch (err) { }
    document.querySelectorAll('.ov-before,.ov-after').forEach(function (c) { c.classList.remove('ov-before', 'ov-after'); });
    if (!cell || cellIndex(cell) === from) return;
    const r = cell.getBoundingClientRect();
    cell.classList.add(e.clientX < r.left + r.width / 2 ? 'ov-before' : 'ov-after');
  }, true);
  addEventListener('drop', function (e) {
    if (from < 0) return;
    const cell = e.target.closest && e.target.closest(TILES);
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
    if (PRES || !on || !e.target.closest || !e.target.closest('#deck')) return;
    e.stopPropagation();
    if (e.target.closest('a')) e.preventDefault();   // picture credits stay put while editing
    if (cur && cur.el.contains(e.target)) return;
    if (cur) end(true);
    if (held && Date.now() - held < 400) { held = 0; return; }   // a label was just dragged - nothing to open
    held = 0;                                        // a handle drag ends without a click: the hold must not outlive it
    const el = e.target.closest('[data-ed]');
    if (el && !cur && !busy) begin(el);
  }, true);

  // capture phase: keys typed into a text never reach the deck (arrows, space, digits, P, F ...)
  addEventListener('keydown', function (e) {
    if (cur && cur.el.contains(e.target)) {
      e.stopPropagation();
      if (e.isComposing) return;
      if (cmd(e) && (e.key === 'b' || e.key === 'B')) { e.preventDefault(); apply('bold'); }
      else if (cmd(e) && (e.key === 'i' || e.key === 'I')) { e.preventDefault(); apply('italic'); }
      else if (cmd(e) && (e.key === 'u' || e.key === 'U')) { e.preventDefault(); apply('underline'); }
      else if (cmd(e) && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); line('dup'); }
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
    if (PRES) return;                                // the presenter never edits text
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
    msg: msg,
    hold: function () { held = Date.now(); }         // deck-label.js: a click inside #deck right now is a drag's end
  };
  const pics = document.createElement('script');
  pics.src = '/decks/deck-image.js';
  pics.onerror = function () { pics.remove(); };      // not there yet: the text editor works without it
  document.head.appendChild(pics);
  const labels = document.createElement('script');    // a figure's words: moved and sized (deck-label.js)
  labels.src = '/decks/deck-label.js';
  labels.onerror = function () { labels.remove(); };
  document.head.appendChild(labels);

  // after an undo the page came back: edit mode on again, and say what was undone
  try {
    const note = sessionStorage.getItem('deck-edit-resume');
    if (note !== null) {
      sessionStorage.removeItem('deck-edit-resume');
      const back = sessionStorage.getItem('deck-edit-overview');   // a moved slide: stand on it, overview open
      const was = sessionStorage.getItem('deck-edit-was') !== '0';   // it only comes back on if it was on
      sessionStorage.removeItem('deck-edit-overview');
      sessionStorage.removeItem('deck-edit-was');
      const show = function () {
        msg(note);
        if (back !== null && window.DeckOverview) { si = Math.max(0, Math.min(slides.length - 1, +back)); step = 0; paint(); DeckOverview.open(); }
      };
      if (!was) { show(); }
      else load().then(function () {
        on = true; root.classList.add('deck-edit'); label();
        if (!PRES) { tools.hidden = false; place(); state(); }
        document.dispatchEvent(new Event('deck-edit-on')); show();
      }).catch(function (err) { msg(err.message); });
    }
  } catch (e) { }

})();
