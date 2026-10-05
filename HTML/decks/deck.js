// The shell every deck shares - THE source (27.09.2026): edit here; tools/pptx/html_deck.py links or embeds this file.

// time-aware greeting - the browser knows the real clock, a .pptx never does
(function(){
  var h = new Date().getHours();
  var t = h < 5 ? 'Good night!' : h < 12 ? 'Good morning!' :
          h < 18 ? 'Good afternoon!' : h < 22 ? 'Good evening!' : 'Good night!';
  var el = document.getElementById('greet-text');
  if (el) el.textContent = t;
})();

/* A slide that lives in a file of its own and is shown by several decks: the deck holds an empty stub,
   <section class="slide" data-aus="vorspann/vos-savant.html#2"></section> (the 2nd slide of that file), and the stub is
   filled from there when the deck opens - changed in one place, the same in every deck (Doc, 03.10.2026: "die macht man an
   einer Stelle und dann ist die überall so"). The Tafel deck reads the same files (tafel.html, VORSPANN). The stub keeps
   its place and its own classes (skip), so moving and hiding it stay the deck's business; its text is edited in the file.
   Synchronous on purpose: everything below takes the slides as they stand, and deck-edit.js and the others share its
   globals - a fill that came later would find the deck already counted. */
(function () {
  const files = {};
  document.querySelectorAll('section.slide[data-aus]').forEach(function (stub) {
    const ref = stub.getAttribute('data-aus').split('#'), file = ref[0], nr = +ref[1] || 1;
    if (!(file in files)) {
      files[file] = [];
      try {
        const x = new XMLHttpRequest();
        x.open('GET', file, false);
        x.setRequestHeader('Cache-Control', 'no-cache');        // a changed file shows at once, not after the cache
        x.send();
        if (x.status === 200) {
          const t = document.createElement('template');
          t.innerHTML = x.responseText;
          files[file] = [...t.content.querySelectorAll('section.slide')];
        }
      } catch (e) { /* the stub says so below */ }
    }
    const src = files[file][nr - 1], own = [...stub.classList];
    if (!src) {
      stub.className = 'slide content';
      stub.innerHTML = '<h3>Folie fehlt</h3><div class="rules"></div><div class="body"><p class="line l0">' +
        file + ' (Folie ' + nr + ') lässt sich nicht laden.</p></div><p class="pageno"></p>';
    } else {
      [...src.attributes].forEach(function (a) { if (a.name !== 'data-aus') stub.setAttribute(a.name, a.value); });
      own.forEach(function (c) { stub.classList.add(c); });
      stub.innerHTML = src.innerHTML;
    }
  });
})();

const deck = document.getElementById('deck');
const slides = [...document.querySelectorAll('.slide')];
let si = 0, step = 0;
// the screenshot of a lab or 3D die for the presenter's previews and strip (tools/pptx/deck_shots.mjs takes them):
// named by what the frame shows and its size, not by its place - a moved lab or reordered slides keep their picture
function shotKey(f) {
  const s = f.getAttribute('src') + '|' + f.style.width + 'x' + f.style.height;
  let h = 0x811c9dc5;                                // FNV-1a, 32 bit
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 'img/shots/shot-' + (h >>> 0).toString(16).padStart(8, '0') + '.webp';
}
// labs and dice that must not run live (the presenter's previews, strip and overview: every one would be one more
// WebGL context): a stand-in keeps the place and wears the screenshot if there is one - asked once per picture,
// a missing one keeps the label
const shotHas = {};
function standIns(node, keep) {
  node.querySelectorAll('iframe').forEach(function (f) {
    if (keep && keep(f)) return;                    // the tablet keeps its labs live (deck-ink.js)
    const d = document.createElement('div');
    d.className = 'p-live';
    if (f.classList.contains('live-frame')) { d.classList.add('dice'); d.style.cssText = f.style.cssText; d.textContent = '3D-Würfel'; }
    else d.textContent = 'Labor';
    const url = shotKey(f);
    if (!shotHas[url]) shotHas[url] = new Promise(function (ok) {
      const img = new Image();
      img.onload = function () { ok(true); }; img.onerror = function () { ok(false); };
      img.src = url;
    });
    shotHas[url].then(function (has) {
      if (has) { d.style.backgroundImage = 'url("' + url + '")'; d.classList.add('shot'); }
    });
    f.replaceWith(d);
  });
}
// ?presenter: this window is the presenter view on the laptop (see PRES_JS at the end)
const PRESENTER = /[?&]presenter(&|=|$)/.test(location.search);
if (PRESENTER) document.documentElement.classList.add('presenter');
// the title slide's night runs live in the beamer window only (deck-flow.js, Doc 18.09.2026) - the presenter keeps
// the still picture from deck.css: one WebGL scene is enough. Offline or without WebGL the picture simply stays.
if (!PRESENTER && document.querySelector('.slide.title'))
  import('./deck-flow.js').then(function (m) { m.start(document.querySelector('.slide.title')); }).catch(function () { });
// the pen (s): ink on the slides, and a tablet as a remote pen (deck-ink.js, Doc 27.09.2026) - a module runs only
// after this whole file, so everything it uses is there
import('./deck-ink.js').catch(function () { });
// slide and click survive a reload (Doc, 17.09.2026: "persist slide and click") - per tab, so a new tab still
// starts at the beginning; a #7 in the URL wins
const KEEP = 'deck-pos:' + location.pathname + (PRESENTER ? ':presenter' : '');
const painted = [];                                  // run after every paint - the presenter link hooks in
// A slide can be hidden (class "skip", set by right-click in the overview while editing, Doc 21.09.2026).
// It stays in the file and keeps its number there - narration, clips and pictures stay where they are -
// but nothing navigates onto it. While editing every slide is shown, otherwise the deck skips it.
const EDITING = () => document.documentElement.classList.contains('deck-edit');
const skipped = i => slides[i].classList.contains('skip') && !EDITING();
/** The first slide from `from` in direction d that is shown, or -1. */
function seek(from, d) {
  for (let i = from; i >= 0 && i < slides.length; i += d) if (!skipped(i)) return i;
  return -1;
}
const hiddenSlide = i => slides[i].classList.contains('skip');
/** The n-th slide the class sees (1-based, clamped) - typed numbers and #7 links count those, not the file. */
function nth(n) {
  const list = slides.map((s, i) => i).filter(i => !skipped(i));
  return list.length ? list[Math.max(0, Math.min(list.length - 1, n - 1))] : 0;
}
/** Page numbers count what the class sees: a hidden slide says so instead of carrying a number. */
function renumber() {
  const total = slides.filter((s, i) => !hiddenSlide(i)).length;
  let k = 0;
  slides.forEach((s, i) => {
    const p = s.querySelector('.pageno');
    if (!p) return;
    if (hiddenSlide(i)) { p.textContent = 'ausgeblendet'; return; }   // only ever seen while editing
    // a bar between the numbers, no spaces around it, a small margin instead (deck.css .pn-sl): with spaces they stood
    // wide apart, and thin ones gave back only 2 px - every character carries the letter-spacing (Doc, 30.09.2026:
    // "den Abstand zwischen den 34 / 35 kleiner", then "/ -> |")
    p.innerHTML = (++k) + '<span class="pn-sl">|</span>' + total;
  });
}
renumber();

// keep the 960x540 stage as large as the window allows - phone, beamer, print
function fit(){
  const s = Math.min(innerWidth / 960, innerHeight / 540);
  deck.style.transform = 'scale(' + s + ')';
  dock();
}
// HUD buttons and Solita sit in the footer row, right behind the page number, flush with the end of the
// footer line (Doc, 16.09.2026: "mach die butts und Solita hinter / 24"). They keep a size a finger can
// hit, in screen pixels, so the page number moves left to make room for them - never off screen.
function dock(){
  const hud = document.getElementById('hud'), ask = document.getElementById('ask');
  if (!hud) return;
  const s = Math.min(innerWidth / 960, innerHeight / 540);
  const r = deck.getBoundingClientRect();           // the scaled slide on screen
  const btn = Math.round(Math.min(34, Math.max(22, 16 * s)));   // a third bigger (Doc, 17.09.2026: "mach die butts größer")
  const av = Math.round(Math.min(46, Math.max(26, 24 * s)));
  document.documentElement.style.setProperty('--hudbtn', btn + 'px');
  document.documentElement.style.setProperty('--askav', av + 'px');
  const cy = r.top + 522 * s;                  // middle of the footer band = middle of the footer text
  let right = Math.max(8, Math.round(innerWidth - (r.right - 16 * s)));
  if (ask) {
    ask.style.right = right + 'px'; ask.style.bottom = 'auto'; ask.style.top = Math.round(cy - av / 2) + 'px';
    if (ask.querySelector(':scope > #ask-btn') && !ask.classList.contains('greet')) right += av + 8;   // her picture in the corner needs the room - in the footer line, or hidden on her greeting page, it does not
  }
  hud.style.right = right + 'px'; hud.style.bottom = 'auto'; hud.style.top = Math.round(cy - btn / 2) + 'px';
  const nav = document.getElementById('nav');       // the slide triangles: left end of the footer line
  if (nav) { nav.style.left = Math.max(8, Math.round(r.left + 16 * s)) + 'px'; nav.style.bottom = 'auto';
             nav.style.top = Math.round(cy - btn / 2) + 'px'; }
  const left = hud.getBoundingClientRect().left;
  // the slide triangles frame the page number, ◀ 9 / 23 ▶, right before the HUD (Doc, 27.09.2026: "vor und nach den
  // Seitenzahlen"); the H stays alone at the left end. Fixed inside #nav, so they keep its looks and its hiding.
  const prevB = document.getElementById('nav-prev'), nextB = document.getElementById('nav-next');
  const pn = slides[si] && slides[si].querySelector('.pageno');
  // closer to the number, and flush with the right end of the footer line when no button stands in the HUD any more -
  // the overview and fullscreen went left (Doc, 30.09.2026: "enger rechtsbündig")
  const hudUsed = [].some.call(hud.children, b => !b.hidden && b.getBoundingClientRect().width);
  const gap = 3, top = Math.round(cy - btn / 2) + 'px';
  const nextX = left - (hudUsed ? 8 : 0) - btn;     // screen px
  deck.style.setProperty('--pnright', Math.max(16, (r.right - (nextB ? nextX - gap : left - 12)) / s) + 'px');
  if (prevB && nextB) {
    const w = pn ? pn.getBoundingClientRect() : null;
    const prevX = w && w.width ? w.left - gap - btn : nextX - 4 - btn;
    [[prevB, prevX], [nextB, nextX]].forEach(([b, x]) => {
      b.style.position = 'fixed'; b.style.left = Math.round(x) + 'px'; b.style.top = top;
    });
  }
  const jump = document.getElementById('jump');     // the typed slide number floats above the dock
  if (jump) { jump.style.right = right + 'px'; jump.style.bottom = Math.round(innerHeight - cy + av / 2 + 8) + 'px'; }
}
addEventListener('resize', fit); fit();
addEventListener('load', dock);                      // the overview and play buttons join the HUD later
painted.push(dock);                                  // "9 / 23" and "10 / 23" differ in width: the ◀ moves along

function groups(sl){
  return [...new Set([...sl.querySelectorAll('.step')].map(e => +e.dataset.g))].length;
}
// every line is in view from the start; the group clicked last carries the triangle and the box - on its first
// element, so a line with sub-lines gets one mark, not five; what was shown before steps back a little
// (Doc, 27.09.2026: "alle sichtbar ... ein Dreieck davor", "die schon gezeigten ein klein wenig heller")
function stepMarks(root, st){
  const all = [...root.querySelectorAll('.step')];
  let top = -1;
  all.forEach(e => { const g = +e.dataset.g; if (g < st && g > top) top = g; });
  const cur = all.find(e => +e.dataset.g === top);
  all.forEach(e => {
    const g = +e.dataset.g;
    e.classList.toggle('on', g < st); e.classList.toggle('past', g < top); e.classList.toggle('now', e === cur);
  });
  // a card that is one group as a whole is its own box - a box around the heading alone would cut into the card
  root.querySelectorAll('.card').forEach(c => c.classList.toggle('now', !!cur && c.contains(cur) &&
    [...c.querySelectorAll('.step')].every(e => +e.dataset.g === top)));
}
function paint(){
  slides.forEach((s, i) => s.classList.toggle('on', i === si));
  const sl = slides[si];
  // dark slides (greeting, title at night): the buttons turn light (Doc, 18.09.2026: "wenn der HG dunkel ist kaum zu sehen")
  document.documentElement.classList.toggle('dark-slide', sl.matches('.greet, .title'));
  stepMarks(sl, step);
  const shown = slides.filter((s, i) => !skipped(i)).length;          // the bar counts what the class sees
  const at = slides.filter((s, i) => i <= si && !skipped(i)).length;
  document.getElementById('bar').style.width = (at / (shown || 1) * 100) + '%';
  try { sessionStorage.setItem(KEEP, si + ':' + step + ':' + groups(sl)); } catch (e) { }
  painted.forEach(f => f());
}
function next(){
  if (step < groups(slides[si])) { step++; }
  else { const j = seek(si + 1, 1); if (j >= 0) { si = j; step = 0; } }
  paint();
}
function prev(){
  if (step > 0) { step--; }
  else { const j = seek(si - 1, -1); if (j >= 0) { si = j; step = groups(slides[si]); } }
  paint();
}
// a whole slide back or forth, shown fully built - the footer triangles and Shift+arrows (Doc, 17.09.2026)
function jump(d){
  if (typeof narr !== 'undefined') narr.stop();     // turning by hand pauses Solita
  const j = seek(si + d, d > 0 ? 1 : -1);
  if (j >= 0) si = j;
  step = groups(slides[si]); paint();
}
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;     // never eat Cmd-Shift-R
  const k = e.key;
  if (/^(Arrow|Page|Home|End)/.test(k)) narr.stop();   // turning pages by hand pauses Solita
  if (e.shiftKey && (k === 'ArrowRight' || k === 'ArrowLeft')) { jump(k === 'ArrowRight' ? 1 : -1); e.preventDefault(); }
  // not Space: it is the mic's key (Doc, 30.09.2026: "das Space, das die Folien weiterschaltet, nehmen wir raus, denn
  // dafür haben wir ja die Pfeiltasten") - js/solita-frage.js takes it
  else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown') { next(); e.preventDefault(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { prev(); e.preventDefault(); }
  else if (k === 'Home') { si = Math.max(0, seek(0, 1)); step = 0; paint(); }
  else if (k === 'End') { si = Math.max(0, seek(slides.length - 1, -1)); step = groups(slides[si]); paint(); }
  else if (k === 'a' || k === 'A') { narr.stop(); step = groups(slides[si]); paint(); }   // everything on this slide in (Doc, 17.09.2026)
  else if (k === 'f' || k === 'F') { full(); }
});
addEventListener('click', e => {
  // links (lab bar, picture credits) open - they do not turn the page as well
  if (e.target.closest('#hud') || e.target.closest('#nav') || e.target.closest('a') || e.target.closest('.play-big')) return;
  if (e.target.closest('#pres')) return;             // the presenter view handles its own clicks
  const help = document.getElementById('help');     // a click beside the open help only closes it
  if (help && !help.hidden) { help.hidden = true; return; }
  narr.stop();                                       // a click turns the page by hand
  if (e.target.closest('.labbar button')) { next(); return; }
  next();
});   // clicks inside a lab stay in the lab - they never reach this document
// Chrome's own menu (save image, copy image, inspect ...) never comes up in a deck: a right click or a long press
// on the board opened it over the slide (Doc, 28.09.2026: "das dumme Menu von Chrome ... unbedingt überschreiben
// (nix)"). The deck's own menus (Solita's box, the overview's slide menu) still open; text fields keep theirs, to paste.
addEventListener('contextmenu', e => {
  if (e.target.closest && e.target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])')) return;
  e.preventDefault();
});
// the lab bar sits right on top of its lab: each slide places its lab frame itself, so read that frame's top.
// A note that runs under the bar (a long one, mathe11-nichtlinear) pushes it up above the note instead.
function placeLabBar(s) {
  const bar = s && s.querySelector('.labbar'), frame = s && s.querySelector('.labframe');
  const top = frame ? parseFloat(frame.style.top) : NaN;
  if (!bar || !(top > 0)) return;
  bar.style.top = 'auto';
  bar.style.bottom = (540 - top + 3) + 'px';
  const note = s.querySelector('.labnote');
  if (!note || !note.textContent.trim()) return;
  const r = document.createRange();
  r.selectNodeContents(note);
  const t = r.getBoundingClientRect(), b = bar.getBoundingClientRect();
  if (t.right > b.left - 8 && t.bottom > b.top && t.top < b.bottom) bar.style.bottom = (540 - note.offsetTop + 3) + 'px';
}
painted.push(() => placeLabBar(slides[si]));
addEventListener('load', () => placeLabBar(slides[si]));   // formulas in the note are wider once KaTeX has drawn them
// a lab that stands free (.labframe.bare, deck.css): its page's ground goes, and a lab that can widen fills the frame's
// width - DOCPAD's CPWide, the call its Mac shell makes (Doc, 05.10.2026: "Zieh den ruhig breit"); it is not kept as
// DOCPAD's own width. Every page the frame loads (DOCPAD's password page first, then the app), copies in the presenter too.
function bareLab(f) {
  if (!f || f.tagName !== 'IFRAME' || !f.closest('.labframe.bare')) return;
  try {
    const d = f.contentDocument;
    if (!d || !d.body) return;
    d.documentElement.style.background = d.body.style.background = 'transparent';
    if (f.contentWindow.CPWide) f.contentWindow.CPWide(99);
  } catch (e) { }                                     // a lab from elsewhere keeps its ground
}
document.addEventListener('load', e => bareLab(e.target), true);   // a frame's load does not bubble: caught on the way down
document.querySelectorAll('.labframe.bare iframe').forEach(bareLab);
// the footer triangles: one whole slide back or forth, shown fully built - no click steps
(function () {
  const prevB = document.getElementById('nav-prev'), nextB = document.getElementById('nav-next');
  if (!prevB || !nextB) return;
  const tri = d => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="currentColor" stroke="none"/></svg>';
  const PREV = 'M16 5L7 12L16 19Z', NEXT = 'M8 5L17 12L8 19Z';
  prevB.innerHTML = tri(PREV);
  nextB.innerHTML = tri(NEXT);
  prevB.onclick = () => jump(-1);
  nextB.onclick = () => jump(1);
  painted.push(() => { prevB.disabled = si === 0; nextB.disabled = si === slides.length - 1; });

  // a lab's fullscreen icon on a slide: the lab takes the whole slide, not the screen (Doc, 17.09.2026).
  // The lab asks with 'lab-slide-full' on its iframe; the lab keeps its own height (LAB_MIN_H) and rides a
  // new scale, then hears back with 'deck-lab-full' to swap its icon. Esc or turning the slide shrinks it again.
  function labFull(frame, on) {
    const f = frame.querySelector('iframe');
    if (!f || on === frame.classList.contains('full')) return;
    if (on) f.dataset.small = f.style.cssText;
    frame.classList.toggle('full', on);
    if (on) {
      const s = frame.clientHeight / parseFloat(f.style.height);
      f.style.width = frame.clientWidth / s + 'px';
      f.style.transform = 'scale(' + s + ')';
    } else f.style.cssText = f.dataset.small;
    try { f.contentWindow.dispatchEvent(new f.contentWindow.Event('deck-lab-full')); } catch (e) { }
  }
  document.addEventListener('lab-slide-full', function (e) {
    const frame = e.target.closest && e.target.closest('.labframe');
    if (frame) labFull(frame, !frame.classList.contains('full'));
  });
  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.labframe.full').forEach(fr => labFull(fr, false));
  });
  painted.push(() => slides.forEach((s, i) => {
    if (i !== si) s.querySelectorAll('.labframe.full').forEach(fr => labFull(fr, false));
  }));

  // "H" right of the triangles: all keys of the deck (Doc, 17.09.2026: "zeig darauf ein Help O - Overview etc.").
  // It carries the key that opens it - the "?" belongs to Solita's line now (Doc, 23.09.2026: "links ? -> H").
  const helpB = document.createElement('button');
  helpB.id = 'nav-help'; helpB.type = 'button'; helpB.textContent = 'H';
  helpB.title = 'Tastenkürzel (H)'; helpB.setAttribute('aria-label', 'Hilfe: Tastenkürzel');
  const help = document.createElement('div');
  help.id = 'help'; help.hidden = true;
  help.setAttribute('role', 'dialog'); help.setAttribute('aria-label', 'Tastenkürzel');
  // Cmd and Win as the symbols printed on the keys, not as words (Doc, 17.09.2026)
  const ICON = {
    Cmd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
       + '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>',
    Win: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 2h8.5v8.5H2zM13.5 2H22v8.5h-8.5zM2 13.5h8.5V22H2zM13.5 13.5H22V22h-8.5z"/></svg>'
  };
  // '/' = a wider gap between alternatives, no slash drawn; '|' = a narrower one between two single keys
  const K = keys => keys.map(k => k === '/' ? '<span class="or"></span>' : k === '|' ? '<span class="or near"></span>'
    : ICON[k] ? '<kbd class="ico" title="' + k + '" aria-label="' + k + '">' + ICON[k] + '</kbd>'
    : '<kbd>' + k + '</kbd>').join('');
  const hint = word => '<span class="hint">' + word + '</span>';   // what the letter stands for
  const avatar = document.querySelector('#ask-btn img');   // her photo bottom right, shown small in the Solita row
  // null = a thin line between the groups: navigate | present | Solita | help (Doc, 17.09.2026)
  const rows = [
    [K(['→']), 'Nächster Schritt – auch ein Klick auf die Folie'],
    [K(['←']), 'Einen Schritt zurück'],
    [K(['A']) + hint('Alles'), 'Alles auf der Folie zeigen'],
    [K(['Shift', '→', '/', 'Shift', '←']), 'Ganze Folie vor / zurück – wie '
      + '<span class="navbtn">' + tri(PREV) + '</span><span class="navbtn">' + tri(NEXT) + '</span>'],
    [K(['Home', '|', 'End']), 'Erste / letzte Folie'],
    [K(['1', '7', 'Enter']), 'Zu Folie 17 springen'],
    [K(['O']) + hint('Overview'), 'Übersicht aller Folien'],
    null,
    [K(['F']) + hint('Fullscreen'), 'Vollbild – mit Beamer: Präsentation + Referentenansicht'],
    [K(['R']), 'Referentenansicht von Hand öffnen'],
    [K(['Cmd', 'F1', '/', 'Win', 'P']), 'Keine Referentenansicht? Bildschirm erweitern statt spiegeln – <b>erst dann</b> das Deck neu laden und starten'],
    ...('isExtended' in screen ? [['<span class="help-dot one"></span>',
      'Oranger Punkt am Vollbild-Knopf: nur ein Bildschirm – am Board heißt das gespiegelt'],
      ['<span class="help-dot ext"></span>', 'Grüner Punkt: Bildschirm erweitert – Präsentation kann starten']] : []),
    [K(['L']), 'Laserpointer an / aus – auch der Knopf rechts neben H'],
    [K(['N']) + hint('Natur'), 'Naturbild hinter den Folien wechseln – nach dem letzten wieder ohne'],
    null,
    [K(['Leertaste', '/', 'P']), 'Solita zuhören lassen – die Frage sprechen'
      + (avatar ? ' <img class="navpic" src="' + avatar.src + '" alt="">' : '')],
    null,
    [K(['Esc']), 'Schließen – beendet auch die Präsentation'],
    [K(['H']), 'Diese Hilfe']
  ];
  help.innerHTML = '<h4>Tastenkürzel</h4><table>'
    + rows.map(r => r ? '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'
                      : '<tr class="sep"><td colspan="2"></td></tr>').join('') + '</table>';
  nextB.after(helpB);
  helpB.after(help);
  helpB.onclick = () => { help.hidden = !help.hidden; };
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest('#ask, #linkgo, input, textarea')) return;   // a "?" typed to Solita
    if (e.key === 'h' || e.key === 'H') { help.hidden = !help.hidden; e.preventDefault(); }   // only H - the ? belongs to Solita's line (Doc, 23.09.2026)
    else if (e.key === 'Escape' && !help.hidden) help.hidden = true;
  });
})();
// a nature photo under the light slides, deeply dimmed - N cycles (Doc, 01.10.2026). The picking lives in
// js/natur-bild.js, shared with Vorrechnen; deck.css puts the picture under the slides.
(function () {
  const s = document.createElement('script');
  s.src = new URL('../js/natur-bild.js', (document.currentScript && document.currentScript.src) || location.href).href;
  document.head.appendChild(s);
})();
// type the slide number, then Enter: 1 7 Enter jumps to slide 17 (Doc, 15.09.2026) - like
// PowerPoint the slide starts unbuilt; Esc or a 2.5 s pause drops the typed number
(function () {
  let buf = '', timer = 0;
  const box = document.createElement('div');
  box.id = 'jump';
  box.hidden = true;
  document.body.appendChild(box);
  const clear = function () { buf = ''; box.hidden = true; };
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[0-9]$/.test(e.key)) {
      buf = (buf + e.key).replace(/^0+/, '').slice(-3);
      box.textContent = 'Folie ' + (buf || '0');
      box.hidden = false;
      clearTimeout(timer); timer = setTimeout(clear, 2500);
      e.preventDefault();
    } else if (e.key === 'Enter' && buf) {
      const n = parseInt(buf, 10);                 // past the end: the last slide (Doc, 17.09.2026)
      clear();
      if (n >= 1) {
        if (typeof narr !== 'undefined') narr.stop();   // a jump pauses Solita like turning by hand
        si = nth(n); step = 0; paint();
      }
      e.preventDefault();
    } else if (e.key === 'Escape' && buf) { clear(); }
  });
})();
// overview of all slides: o (or the grid button bottom right) opens it, a click jumps there,
// Esc, o or a click beside the tiles closes it (Doc, 15.09.2026: "Uebersicht ueber alle Folien")
(function () {
  const ov = document.createElement('div');
  ov.id = 'overview';
  ov.hidden = true;
  document.body.appendChild(ov);
  const btn = document.createElement('button');
  btn.id = 'ovbtn';
  btn.type = 'button';
  btn.title = 'Übersicht aller Folien (o)';
  btn.setAttribute('aria-label', 'Übersicht aller Folien');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">'
    + '<rect x="2.5" y="2.5" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="2.5" width="8.5" height="8.5" rx="1.2"/>'
    + '<rect x="2.5" y="13" width="8.5" height="8.5" rx="1.2"/><rect x="13" y="13" width="8.5" height="8.5" rx="1.2"/></svg>';
  // bottom left since 30.09.2026, behind the H, the pen and the laser, with the fullscreen button after it (Doc: "die
  // auch nach links") - it stood bottom right, next to play and fullscreen
  const navBox = document.getElementById('nav'), hudBox = document.getElementById('hud');
  if (navBox) navBox.appendChild(btn); else if (hudBox) hudBox.insertBefore(btn, hudBox.firstChild); else document.body.appendChild(btn);
  let built = false;
  // In fullscreen the browser keeps Esc for itself: a press left fullscreen and ended the show, the overview still
  // open. While the overview is open, Esc is locked to the page (Keyboard Lock API, Chrome/Edge) and only closes it;
  // holding Esc still leaves fullscreen (Doc, 28.09.2026: "im overview soll ESC nur den Mode schließen").
  const kb = navigator.keyboard;
  function escLock(on) {
    if (!kb || !kb.lock) return;
    if (on) kb.lock(['Escape']).catch(function () { }); else kb.unlock();
  }
  function close() { ov.hidden = true; escLock(false); }
  function build() {
    slides.forEach(function (s, i) {
      const cell = document.createElement('div');
      cell.className = 'ov-cell';
      const thumb = document.createElement('div');
      thumb.className = 'ov-thumb';
      const c = s.cloneNode(true);                     // a copy, fully built, without ids
      c.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
      c.querySelectorAll('.flow').forEach(function (e) { e.remove(); });   // an empty canvas: the still picture shows
      if (PRESENTER) standIns(c);                      // the presenter runs its current slide live already
      c.classList.add('on');
      thumb.appendChild(c);
      const num = document.createElement('span');
      num.className = 'ov-num';
      cell.appendChild(thumb);
      cell.appendChild(num);
      cell.dataset.i = i;
      cell.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof narr !== 'undefined') narr.stop();
        si = i; step = 0; paint(); close();
      });
      ov.appendChild(cell);
    });
    built = true;
    marks();
  }
  // hidden slides: dimmed and labelled while editing, gone from the overview for the class. Dragging is the
  // editor's business (decks/deck-edit.js) - it only ever gets the tiles when edit mode is on.
  function marks() {
    // the count is what the class sees, also while editing - there the hidden tiles are simply shown as well
    let k = 0, total = slides.filter(function (s, i) { return !hiddenSlide(i); }).length;
    [].forEach.call(ov.children, function (cell, i) {
      const off = hiddenSlide(i);                                   // the class attribute, not the edit mode
      cell.classList.toggle('off', off);
      // a hidden slide keeps its tile, in and out of edit mode (Doc, 21.09.2026: "nee lass bitte drin") -
      // the red frame and AUS say that the class does not see it, and a click still jumps there
      cell.hidden = false;
      // dragging and the right-click menu belong to the overview itself, not to edit mode - the editor that
      // wires them exists only on Doc's machine anyway (Doc, 21.09.2026: "das menu raus und unseres rein")
      cell.draggable = !!window.DeckEdit;
      const num = cell.querySelector('.ov-num');
      if (num) num.textContent = off ? 'aus' : (++k) + ' / ' + total;
    });
  }
  // the tiles as large as the window allows: try every column count, keep the one with the widest tile that
  // still fits width AND height (Doc, 17.09.2026: "im Overview den vorhandenen Platz ausnutzen"). Below
  // OV_MIN px a tile gets unreadable - then fixed columns of OV_MIN and the overview scrolls (phones).
  const OV_PAD = 28, OV_GAP = 18, OV_MIN = 200;
  function layout() {
    const n = [].filter.call(ov.children, function (c) { return !c.hidden; }).length || slides.length;
    const W = ov.clientWidth - 2 * OV_PAD, H = ov.clientHeight - 2 * OV_PAD;
    let c = 1, w = 0;
    for (let k = 1; k <= n; k++) {
      const r = Math.ceil(n / k);
      const t = Math.min((W - OV_GAP * (k - 1)) / k, (H - OV_GAP * (r - 1)) / r * 16 / 9);
      if (t > w) { w = t; c = k; }
    }
    if (w < OV_MIN) { c = Math.max(1, Math.floor((W + OV_GAP) / (OV_MIN + OV_GAP))); w = (W - OV_GAP * (c - 1)) / c; }
    ov.style.gridTemplateColumns = 'repeat(' + c + ',' + Math.floor(w) + 'px)';
  }
  function scale() {
    layout();
    ov.querySelectorAll('.ov-thumb').forEach(function (t) {
      t.firstChild.style.transform = 'scale(' + (t.clientWidth / 960) + ')';
    });
  }
  function open() {
    if (typeof narr !== 'undefined') narr.stop();
    if (!built) build();
    ov.hidden = false;
    escLock(true);
    marks();
    [].forEach.call(ov.children, function (c, i) { c.classList.toggle('cur', i === si); });
    scale();
    if (ov.children[si]) ov.children[si].scrollIntoView({ block: 'center' });
  }
  // Hiding and showing runs through here, so the deck window and the presenter stay in step
  // (deck-slidemenu lives in decks/deck-edit.js and calls this; `quiet` = the other window told us).
  window.DeckSlides = {
    isHidden: hiddenSlide,
    setHidden: function (i, off, quiet) {
      if (!slides[i]) return;
      slides[i].classList.toggle('skip', !!off);
      const tile = ov.children[i] && ov.children[i].querySelector('.ov-thumb > .slide');
      if (tile) tile.classList.toggle('skip', !!off);
      if (skipped(si)) { const j = seek(si, 1); si = j >= 0 ? j : Math.max(0, seek(si, -1)); step = 0; }
      window.DeckOverview.refresh();
      if (window.DeckStrip) window.DeckStrip.refresh();
      if (!quiet && window.DeckLink) window.DeckLink.skip(i, !!off);
    },
  };
  // the editor (decks/deck-edit.js) opens and refreshes the overview through this
  window.DeckOverview = {
    open: open, close: close, isOpen: function () { return !ov.hidden; }, el: ov,
    refresh: function () { renumber(); if (built) { marks(); if (!ov.hidden) scale(); } paint(); },
  };
  // edit mode shows the hidden slides and takes them away again - and never leaves the deck standing on one
  ['deck-edit-on', 'deck-edit-off'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      if (skipped(si)) { const j = seek(si, 1); si = j >= 0 ? j : Math.max(0, seek(si, -1)); step = 0; }
      window.DeckOverview.refresh();
    });
  });
  btn.addEventListener('click', function (e) { e.stopPropagation(); if (ov.hidden) open(); else close(); });
  ov.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  addEventListener('resize', function () { if (!ov.hidden) scale(); });
  addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // this one listens in the capture phase, so a question typed to Solita would reach it first:
    // 'o' would open the overview mid-sentence. Nothing from inside #ask belongs to the deck.
    // the start card too, and a text being edited on Doc's machine (decks/deck-edit.js)
    if (e.target && e.target.closest && e.target.closest('#ask, #linkgo, [contenteditable]')) return;
    if (e.key === 'o' || e.key === 'O') {
      if (ov.hidden) open(); else close();
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    if (!ov.hidden) {                                  // nothing underneath moves meanwhile
      if (e.key === 'Escape') close();
      // E is the one key that still gets through: edit mode switches on with the overview open, which is
      // exactly where slides are moved and hidden (Doc, 21.09.2026: "kann ich E auch im OV drücken?")
      if (e.key === 'e' || e.key === 'E') return;
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }, true);
})();
// fullscreen toggle - the same corner-bracket icon as the SVP pill, in and out
const ICON_ENTER = '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/>'
  + '<path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>';
const ICON_EXIT = '<path d="M3 8h3a2 2 0 0 0 2-2V3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>'
  + '<path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/>';
const fullBtn = document.getElementById('full');
// with the overview on the left (Doc, 30.09.2026: "die auch nach links") - the deck pages still put it in the HUD
{ const ov = document.getElementById('ovbtn'); if (fullBtn && ov && ov.parentNode.id === 'nav') ov.after(fullBtn); }
const fsOn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
// screen.isExtended only exists where the browser can tell (Chrome). The dot on the button says what the
// screen is doing: orange = not extended, at the board that means mirrored -> Cmd F1 / Win P (mirroring and
// "no beamer" look the same to the browser, so it also shows on the laptop alone), green = extended and ready
// to present (Doc, 21.09.2026).
const SCREEN_KNOWN = 'isExtended' in screen;
// presenting, the talk's title stands at the left end of the footer line (deck.css shows it only then)
(function () {
  const name = document.createElement('div');
  name.className = 'deck-name';
  name.textContent = document.title;
  deck.appendChild(name);
})();
function paintFull(){
  document.documentElement.classList.toggle('fs-on', fsOn());   // presenting: deck.css hides the buttons
  const ext = !!screen.isExtended;
  fullBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + (fsOn() ? ICON_EXIT : ICON_ENTER) + '</svg>'
    + (SCREEN_KNOWN && !PRESENTER ? '<span class="scr-dot ' + (ext ? 'ext' : 'one') + '" title="Bildschirme prüfen"></span>' : '');
  fullBtn.title = fsOn() ? 'Vollbild verlassen (Esc)'
    : !PRESENTER && ext ? 'Bildschirm erweitert – Präsentieren: Beamer + Referentenansicht (f)'
    : SCREEN_KNOWN ? 'Nur ein Bildschirm – gespiegelt? Cmd F1 / Win P erweitert – Vollbild (f)' : 'Vollbild (f)';
}
// Cmd F1 flips isExtended while the page is open: repaint at once ('change' on screen), with a slow poll
// as a net where the event does not fire
if (SCREEN_KNOWN) {
  let lastExt = !!screen.isExtended;
  const recheck = () => { if (!!screen.isExtended !== lastExt) { lastExt = !!screen.isExtended; paintFull(); } };
  if (screen.addEventListener) screen.addEventListener('change', recheck);
  setInterval(recheck, 2000);
}
// A click on the badge asks the screen again and says what to do. The page cannot switch mirroring itself - that
// is the Mac's own setting (Cmd F1), no browser may touch it (Doc, 23.09.2026: "könnten wir bei click schalten?").
fullBtn.addEventListener('click', function (e) {
  if (!e.target || !e.target.classList || !e.target.classList.contains('scr-dot')) return;
  e.preventDefault(); e.stopPropagation();          // the dot does not send the deck into fullscreen
  paintFull();
  const say = screen.isExtended
    ? 'Bildschirm ist erweitert – f startet Beamer und Referentenansicht'
    : 'Nur ein Bildschirm. Am Mac Cmd F1, an Windows Win P – dann f';
  if (window.DeckNote) DeckNote(say);
  screenProbe().then(function (m) {
    const txt = say + '\n\n' + m;
    const done = ok => { if (window.DeckNote) DeckNote(txt + '\n' + (ok ? '(kopiert)' : '(nicht kopiert – bitte abfotografieren)'), 30000, 'probe'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => done(true), () => done(false));
    else done(false);
  });
}, true);
// Measuring for a three-colour dot (Doc, 27.09.2026: red = no second screen, yellow = there but mirrored, green =
// extended). Mirrored and alone both look like ONE screen to the browser - maybe the resolution or the screen's
// name gives it away. A click on the dot shows what this machine reports and copies it: once alone, once mirrored
// at the board, then compare. getScreenDetails may ask "Fenster verwalten" once - the click is the user's gesture.
async function screenProbe(){
  const r = n => Math.round(n * 100) / 100;
  const out = ['Messwerte',
    'Bildschirm: ' + screen.width + '×' + screen.height + ' · DPR ' + r(devicePixelRatio)
      + ' · frei ' + screen.availWidth + '×' + screen.availHeight,
    'erweitert: ' + (screen.isExtended ? 'ja' : 'nein')];
  let sd = null;
  if (window.getScreenDetails) { try { sd = await window.getScreenDetails(); } catch (e) { } }
  if (sd) sd.screens.forEach(function (s, i) {
    out.push((i + 1) + ': „' + (s.label || '?') + '“ · intern ' + (s.isInternal ? 'ja' : 'nein')
      + ' · primär ' + (s.isPrimary ? 'ja' : 'nein') + ' · ' + s.width + '×' + s.height + ' · DPR ' + r(s.devicePixelRatio));
  });
  else out.push('Bildschirmliste: nicht erlaubt');
  const ua = navigator.userAgentData;
  out.push('System: ' + ((ua && ua.platform) || navigator.platform) + ' · '
    + (ua && ua.brands ? ua.brands.filter(b => b.brand.indexOf('Not') < 0).map(b => b.brand + ' ' + b.version).join(', ')
                       : navigator.userAgent));
  return out.join('\n');
}
function full(){
  const el = document.documentElement;
  if (fsOn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  // a second screen (Chrome knows): fullscreen goes to the beamer, the presenter view to the laptop
  else if (!PRESENTER && screen.isExtended && window.getScreenDetails) link.present();
  else {
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) Promise.resolve(req.call(el)).catch(() => {});
  }
}
fullBtn.onclick = full;
document.addEventListener('fullscreenchange', paintFull);
document.addEventListener('webkitfullscreenchange', paintFull);
if (screen.addEventListener) screen.addEventListener('change', paintFull);   // beamer plugged in or out
if (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) paintFull();
else fullBtn.hidden = true;   // no fullscreen API (iPhone Safari) - nothing to press

// #7 in the URL opens slide 7 fully built - handy for linking a single slide
function fromHash(){
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= slides.length) { si = nth(n); step = groups(slides[si]); paint(); }
}
addEventListener('hashchange', fromHash);

// formulas: KaTeX renders every $...$ the build script wrote
addEventListener('load', () => {
  if (!window.katex) return;
  document.querySelectorAll('.tex').forEach(el => {
    try { katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: false }); }
    catch (err) { el.textContent = el.dataset.tex; }
  });
});
// Solita reads the deck (Doc, 15.09.2026: "NIEMALS Browserstimme! So wie beim DocPad!") - the
// clips come from tools/pptx/deck_audio.mjs with her DocPad voice, nothing is synthesised here.
// Part 0 of a slide is spoken when it appears, part k while click group k comes in, then on.
const narr = (function () {
  const api = { playing: false, stop: function () {} };
  let data = null;
  try { data = JSON.parse(document.getElementById('narration').textContent || 'null'); } catch (e) { }
  if (!data || !data.slides) return api;
  const btn = document.getElementById('play');
  const PLAY = '<path d="M6.5 5v14l11-7z" fill="currentColor"/>';
  const PAUSE = '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>';
  const pad = n => String(n).padStart(2, '0');
  const parts = s => (data.slides[s] || []).length;
  let audio = null, aSlide = -1, part = 0;
  let wait = 0;                                       // pending pause after a clip or before the next slide
  const holds = data.hold || [];
  let held = -1;                                      // slide where Solita waits for a click
  const big = document.createElement('button');
  big.type = 'button';
  big.className = 'play-big';
  const label = document.createElement('div');
  label.className = 'play-big-label';
  label.textContent = 'Solita erklärt';
  const home = document.querySelector('.slide.title') || slides[0];   // title slide, in the orbit ring
  home.appendChild(big);
  home.appendChild(label);
  btn.hidden = false;
  function show() {
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (api.playing ? PAUSE : PLAY) + '</svg>';
    const t = api.playing ? 'Pause (p)' : held >= 0 ? 'Weiter mit Klick (p)' : 'Solita erklärt (p)';
    [btn, big].forEach(b => { b.innerHTML = icon; b.title = t; b.setAttribute('aria-label', t); });
  }
  function run() {
    if (!api.playing) return;
    if (part >= parts(si)) {                          // slide done: everything in, then on
      step = groups(slides[si]); paint();
      if (si >= slides.length - 1) { api.playing = false; audio = null; show(); return; }
      // say(hold=True): e.g. before a solution - the next slide comes only on a click
      if (holds.indexOf(si) >= 0) { api.playing = false; audio = null; held = si; show(); return; }
      // Doc 16.09.2026 "zu schnell, ein wenig mehr Pausen": the finished slide stands a moment longer
      wait = setTimeout(function () { if (!api.playing) return; si++; step = 0; part = 0; paint(); run(); }, 1600);
      return;
    }
    if (part > 0) { step = Math.min(part, groups(slides[si])); paint(); }
    // a line copied in the deck editor has an empty part (Doc, 17.09.2026: "erst mal nix"): it comes in, a pause, on
    if (!String(data.slides[si][part] || '').trim()) { wait = setTimeout(function () { part++; run(); }, 1200); return; }
    aSlide = si;
    audio = new Audio('audio/' + data.deck + '/s' + pad(si) + '-' + pad(part) + '.mp3');
    audio.onended = function () { part++; wait = setTimeout(run, part < parts(si) ? 900 : 0); };
    audio.onerror = function () { part++; run(); };   // a missing clip must not hang the talk
    audio.play().catch(function () { api.playing = false; show(); });
  }
  function resume(n) {                                // go on talking from the top of slide n
    clearTimeout(wait);
    held = -1; api.playing = true; si = n; step = 0; part = 0; audio = null; show(); paint(); run();
  }
  function toggle() {
    if (PRESENTER) { link.send({ t: 'play' }); return; }   // her voice comes from the beamer window
    clearTimeout(wait);
    if (!api.playing && held >= 0 && si === held && si < slides.length - 1) { resume(si + 1); return; }
    held = -1;
    if (api.playing) { api.playing = false; if (audio) audio.pause(); show(); return; }
    api.playing = true; show();
    if (audio && aSlide === si && audio.paused && !audio.ended && audio.currentTime > 0) { audio.play(); return; }
    part = step; audio = null; run();                 // start where the page stands
  }
  api.stop = function () {
    clearTimeout(wait);
    if (held >= 0) {
      // waiting at a hold: the click that turns to the next slide lets Solita go on there
      // (stop runs before the page handler's next(), so look once that has happened)
      const h = held; held = -1; show();
      setTimeout(function () { if (!api.playing && si === h + 1) resume(si); }, 0);
      return;
    }
    if (!api.playing) return;
    api.playing = false; if (audio) audio.pause(); audio = null; show();
  };
  api.toggle = toggle;                                // 'p' pressed in the presenter window
  // stop the click here: toggle redraws the icon, and the page's click handler would then no
  // longer see the (detached) target inside #hud - it turned the page and paused Solita again
  btn.onclick = function (e) { e.stopPropagation(); toggle(); };
  big.onclick = function (e) { e.stopPropagation(); toggle(); };
  // P belongs to Solita's mic since 23.09.2026 ("shift space und P sollen das Mic starten") - the talk starts
  // and pauses with its button in the HUD and the big one on the slide.
  show();
  return api;
})();

if (!location.hash) {
  let kept = '';
  try { kept = sessionStorage.getItem(KEEP) || ''; } catch (e) { }
  // slide:step:groups - a slide that was fully in stays fully in, even when a line was added meanwhile
  // (Doc, 17.09.2026: the copied line was missing after a reload, the page kept click 4 of now 5)
  const m = /^([0-9]+):([0-9]+)(?::([0-9]+))?$/.exec(kept);
  if (m && +m[1] < slides.length) {
    si = +m[1];
    step = m[3] !== undefined && +m[2] >= +m[3] ? groups(slides[si]) : Math.min(+m[2], groups(slides[si]));
  }
}
// the slide that was kept (or slide 1) may have been hidden meanwhile: start on the next one that is shown
if (skipped(si)) { const j = seek(si, 1); si = j >= 0 ? j : Math.max(0, seek(si, -1)); step = 0; }
paint();
fromHash();

// Ask Solita about the slide on screen: Claude Haiku answers from the deck's own text, her DocPad
// voice reads it out (Doc, 16.09.2026: "bau mal mit Haiku (solita nur voice)"). The API keys live in
// the Supabase edge functions, never here (Rule 21) - the shared password gates the proxy and is
// remembered per device in localStorage 'dev_access', the same key solita.html uses.
// Since 30.09.2026 the box itself - password (with the eye), question, her voice and the karaoke, DeepSeek, the cost,
// the right-click menu, the mic - is the labs' box, js/solita-frage.js (Doc: "ist das SolitaDoc Modul
// zentralisiert????", then "ran an den Speck"): one place, so what changes there reaches decks and labs alike. What
// stays here is the deck's own: the slides as her context, her picture and the panel above it, the question line in
// the footer, folding at a page turn, the grip that makes the panel taller, the keys, and the presenter view.
(function () {
  const DECK_JS = (document.currentScript && document.currentScript.src) || location.href;
  const box = document.getElementById('ask');
  if (!box) return;
  const panel = document.getElementById('ask-panel');
  // The box's files come from here, so no deck page needs a new line. The version rides along: a browser still holding
  // an older copy of the box (from a lab - Pages keeps files 10 minutes) takes this one.
  const SF_VERSION = '2026-10-02a';             // raise it with every change of the box or deck-solita.css
  function load(src, then) {
    const s = document.createElement('script');
    s.src = new URL(src, DECK_JS).href;
    if (then) s.onload = then;
    document.head.appendChild(s);
  }
  // the box's own look, then the decks' look for it (decks/deck-solita.css) after deck.css - both versioned: with an older
  // deck.css from a cache the box wore the labs' look and showed her picture twice (Doc, 30.09.: "eine Solita reicht")
  function css(href, before) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = new URL(href + '?v=' + SF_VERSION, DECK_JS).href;
    document.head.insertBefore(l, before || null);
  }
  if (!document.querySelector('link[href*="solita-frage.css"]')) css('../js/solita-frage.css', document.querySelector('link[href*="deck.css"]'));
  if (!document.querySelector('link[href*="deck-solita.css"]')) css('deck-solita.css');
  // the words of her formulas and the light on the word she says (js/solita-karaoke.js) - the box uses them
  if (!window.SolitaKaraoke && !document.querySelector('script[src*="solita-karaoke.js"]')) load('../js/solita-karaoke.js?v=' + SF_VERSION);
  load('../js/solita-frage.js?v=' + SF_VERSION, start);

  // Her instructions for the decks; who she is (Solita, or Doc with his voice) the box puts in front
  const SYS = 'Du hilfst Schülerinnen und '
    + 'Schülern der Klassen 11 bis 13 am Beruflichen Gymnasium und an der Fachoberschule. '
    + 'Du bekommst eine Übersicht der Präsentation und die Folie, auf der die Klasse gerade steht. '
    + 'Antworte auf Deutsch, kurz und klar: höchstens vier Sätze, gesprochene Sprache - die Antwort wird '
    + 'vorgelesen. Formeln in LaTeX zwischen Dollarzeichen. Stütze dich zuerst auf die Folien. '
    + 'Hintergrundwissen zum Thema - Personen, Geschichte, Anwendungen, verwandte Begriffe - darfst du '
    + 'ergänzen, wenn du dir sicher bist; sonst sag kurz, dass du es nicht genau weißt. Kurze Nachfragen '
    + 'wie "und woher kam der?" beziehen sich auf das bisherige Gespräch. Sprich nie über deinen Kontext, '
    + 'die Präsentation als Quelle oder darüber, ob eine Frage zum Thema passt - antworte einfach. '
    + 'JEDE Frage wissenschaftlicher Natur beantwortest du: Mathematik, Physik, Informatik, Chemie, Biologie, '
    + 'Technik, Medizin, Geschichte der Wissenschaft - auch wenn sie mit dieser Folie und diesem Deck nichts zu '
    + 'tun hat. Sätze wie "das hat nichts mit dieser Folie zu tun" oder "das gehört nicht zum Thema" sagst du nie. '
    + 'Nur bei etwas, das mit Wissenschaft und Unterricht gar nichts zu tun hat, lenk in einem Satz freundlich zurück. '
    + 'Lob die Frage nicht ("Das ist eine gute Frage!" und Ähnliches) - nur wenn sie wirklich '
    + 'außergewöhnlich klug ist, darfst du das einmal kurz sagen. Keine Emojis, keine Aufzählungen.';

  // the deck is its own source: slide text with the TeX put back in - minus the footer and page
  // number, which every slide repeats (13 % of the old context was "Nicht verzagen, ..." 24 times)
  function slideText(s) {
    const c = s.cloneNode(true);
    c.querySelectorAll('.foot, .pageno').forEach(function (e) { e.remove(); });
    c.querySelectorAll('[data-tex]').forEach(function (e) { e.textContent = '$' + e.dataset.tex + '$'; });
    return (c.textContent || '').replace(/\s+/g, ' ').trim();
  }
  let SUMMARY = {}, NARR = null;
  try { SUMMARY = JSON.parse(document.getElementById('summary').textContent || '{}') || {}; } catch (e) { }
  try { NARR = JSON.parse(document.getElementById('narration').textContent || 'null'); } catch (e) { }
  function overviewLine(i) {                        // a deck built without summaries still gets a line
    if (SUMMARY[String(i)]) return SUMMARY[String(i)];
    const h = slides[i].querySelector('h1, h2, h3');
    return h ? h.textContent.replace(/\s+/g, ' ').trim() : slideText(slides[i]).slice(0, 90);
  }

  // Compact context (Doc, 16.09.2026): one summary line per slide, the slide on screen in full, and
  // any slide the question names ("Folie 15", "F15", "Seite 15") in full too. Measured before: the
  // whole deck in full was ~3,500 tokens a question.
  // Slides behind a hold - a solution - stay OUT until the class has reached them, and Claude is told
  // not to work the task out: otherwise it hands over the answer while the class is still on it.
  function context(q) {
    const ahead = ((NARR && NARR.hold) || []).filter(function (h) { return h >= si; });
    const last = ahead.length ? Math.min.apply(null, ahead) : slides.length - 1;
    // A deck whose overview is a small book - every task of Vorrechnen: 931 slides, 107,000 characters with EVERY
    // question, 6.8 ct each (Doc, 30.09.2026: "brutal viel. Was ist denn da passiert?") - sends only the slides
    // around the class's, 15 before and after; she is told so. Any other deck goes whole, as before.
    const UEBERSICHT_MAX = 20000, NAH = 15;
    let zeilen = [];
    for (let i = 0; i <= last; i++) zeilen.push('F' + (i + 1) + ': ' + overviewLine(i));
    let kopf = 'Übersicht, eine Zeile je Folie:';
    if (zeilen.join('\n').length > UEBERSICHT_MAX) {
      const von = Math.max(0, si - NAH), bis = Math.min(last, si + NAH);
      zeilen = zeilen.slice(von, bis + 1);
      kopf = 'Das Deck hat ' + slides.length + ' Folien. Übersicht der Folien ' + (von + 1) + ' bis ' + (bis + 1)
        + ', rund um die Folie der Klasse, eine Zeile je Folie:';
    }
    const lines = ['Deck: ' + document.title, kopf].concat(zeilen);
    const full = [si];
    String(q).replace(/\b(?:folie|seite|slide|f)\s*(\d{1,3})\b/gi, function (m, n) {
      const i = +n - 1;
      if (i >= 0 && i <= last && full.indexOf(i) < 0) full.push(i);
      return m;
    });
    full.forEach(function (i) {
      lines.push('', (i === si ? 'Die Klasse steht auf Folie ' + (i + 1)
                               : 'Folie ' + (i + 1) + ', nach der gefragt wird') + ' - voller Inhalt:');
      lines.push(slideText(slides[i]));
      // a lab on the slide describes itself (<meta name="solita-about"> in the lab) - the slide's short note alone
      // made her tell the class to tap the 3D die for a new number (Doc, 17.09.2026)
      slides[i].querySelectorAll('.labframe iframe').forEach(function (f) {
        try {
          const about = f.contentDocument && f.contentDocument.querySelector('meta[name="solita-about"]');
          if (about && about.content) lines.push('So funktioniert das Lab auf dieser Folie: ' + about.content);
        } catch (e) { }                               // a lab from elsewhere: nothing to read
      });
      const spoken = NARR && NARR.slides && NARR.slides[String(i)];
      if (spoken && spoken.length) lines.push('Solita erklärt dazu: ' + spoken.join(' '));
    });
    if (ahead.length) {
      lines.push('', 'Wichtig: Die Lösung zu Folie ' + (last + 1) + ' hat die Klasse noch nicht gesehen. '
        + 'Rechne diese Aufgabe nicht vor und nenne kein Ergebnis - gib höchstens einen Tipp.');
    }
    return lines.join('\n');
  }
  window.askSolitaContext = context;   // debug: askSolitaContext('F15?') shows exactly what goes out

  function start() {
    if (!window.SolitaFrage) return;                 // the box did not come: her picture stays, nothing else happens
    // the deck pages carry the old box (html_deck.py): the box brings its own answers, field and buttons
    ['ask-out', 'ask-row'].forEach(function (id) { const e = document.getElementById(id); if (e) e.remove(); });
    panel.querySelectorAll(':scope > label').forEach(function (e) { e.remove(); });

    // the face goes with the voice: Brain = Solita shows her photo, Doc his own (Doc, 25.09.2026: "Solita selected aber
    // mein Bild"). A deck that set its own picture for Doc (set_avatar) keeps that one for him. The box says who it is.
    const faceImg = document.querySelector('#ask-btn img');
    const SOLITA_PIC = '../resources/solita-avatar.png';
    const DOC_PIC = faceImg && document.body.dataset.voice === 'doc' ? faceImg.getAttribute('src') : '../resources/team/alvers_avatar.jpg';
    document.addEventListener('solita-wer', function (e) {
      if (!faceImg) return;
      const doc = !!(e.detail && e.detail.name === 'Doc');
      faceImg.setAttribute('src', doc ? DOC_PIC : SOLITA_PIC);
      faceImg.alt = doc ? 'Doc Alvers' : 'Solita';
    });

    const sf = window.SolitaFrage.mount(panel, {
      kontext: context, kontextKopf: '', frageWort: 'Frage der Klasse', system: SYS, maxTokens: 600,
      // Solita's voice, or Doc's where the deck was built for it (<body data-voice="doc">, html_deck set_voice) - the
      // right-click menu switches it, remembered per deck on this device (Doc, 25.09.2026)
      stimme: document.body && document.body.dataset.voice === 'doc' ? 'doc' : '',
      // the invitation in the field, as long as it fits - never a cut sentence (Doc, 23.09.2026: "oder zum gesamten Deck")
      hinweise: ['Frag {name} zur Folie oder zum gesamten Deck', 'Frag {name} zur Folie oder zum Deck', 'Frag {name}'],
      // 2 s quiet ends a spoken question and sends it (Doc, 25.09.2026: 3 s "zu lang"); while it is spoken it already
      // stands in the answers (23.09.2026: "lass den Text auch schon oben erscheinen")
      mic: { stille: 2000, selbst: true }, liveZeile: true,
      menueAuf: box,                                  // panel, footer line or her picture
      // presenter view: the beamer window asks, shows and speaks, this one sends (Doc, 23.09.2026)
      senden: function (v) { if (!PRESENTER) return false; link.send({ t: 'ask', q: v }); return true; },
      diktat: function (v) { if (!PRESENTER) return false; link.send({ t: 'ask-live', q: v }); return true; },
      beimMikro: function () { if (PRESENTER) link.send({ t: 'ask-hush' }); },   // on the beamer too, where she really speaks
      beiEscape: function () { close(); },
    });
    const out = sf.out, row = sf.row, sfRoot = row.parentNode, rowHome = row.nextSibling;

    // Drag the header up and the answers get more room; the height stays on this device (Doc, 17.09.2026: "lass mich
    // das Fenster nach oben größer ziehen ... persist"). The panel hangs from its bottom edge, so it grows upwards.
    const H_KEY = 'solita_ask_h', H_MIN = 90, TOP_GAP = 48;   // 48: clear of the edit pencil and the LOCAL badge
    const head = document.getElementById('ask-head');
    (function slimHead() {                           // no header: title and × are hidden by .slim, only the grip above the panel remains
      const span = head.querySelector('span');
      if (span && span.firstChild && span.firstChild.nodeType === 3) span.firstChild.remove();
      head.classList.add('slim');
    })();
    function rest() {                                  // everything but the answers, plus the gap to the screen top
      const r = panel.getBoundingClientRect();
      const gap = out.offsetHeight ? 0 : parseFloat(getComputedStyle(out).marginBottom) || 0;   // hidden: its margin comes along
      const px = r.height - out.offsetHeight + gap + (innerHeight - r.bottom) + TOP_GAP;
      panel.style.setProperty('--askrest', Math.round(px) + 'px');
      return px;
    }
    function setHeight(h) {
      panel.style.setProperty('--askh', Math.round(h) + 'px');
      panel.classList.add('sized');
    }
    try { const h = +localStorage.getItem(H_KEY); if (h >= H_MIN) setHeight(h); } catch (e) { }
    head.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || e.target.closest('button')) return;   // no answer yet is fine: the empty panel grows too (Doc, 17.09.2026)
      e.preventDefault();
      const y0 = e.clientY, h0 = out.offsetHeight, max = innerHeight - rest();
      head.setPointerCapture(e.pointerId);
      panel.classList.add('drag'); setHeight(h0);      // follows the hand without easing; a folded box starts from zero
      function move(ev) { setHeight(Math.max(H_MIN, Math.min(max, h0 + y0 - ev.clientY))); }
      function up() {
        head.removeEventListener('pointermove', move);
        head.removeEventListener('pointerup', up);
        head.removeEventListener('pointercancel', up);
        try { localStorage.setItem(H_KEY, String(out.offsetHeight)); } catch (err) { }
        panel.classList.remove('drag');                // empty or folded: it eases shut again now
      }
      head.addEventListener('pointermove', move);
      head.addEventListener('pointerup', up);
      head.addEventListener('pointercancel', up);
    });
    addEventListener('resize', function () { if (!panel.hidden) rest(); });

    // Keys and clicks inside the panel stay there: typing a question must not turn pages, open the
    // overview ('o') or pause Solita ('p'). Measured 16.09.2026: a capture listener on window is the
    // wrong tool - it kills the event before the button's own handler sees it, yet window's own bubble
    // listeners (page keys, slide jump, overview) still fire. Stopping on the way up from #ask does
    // both right: handlers inside #ask run, nothing reaches the deck.
    box.addEventListener('keydown', function (e) { e.stopPropagation(); });
    box.addEventListener('click', function (e) { e.stopPropagation(); });

    // The presenter view mirrors this box (Doc, 23.09.2026: "Solita AI kann ich im Präsi Mode nicht bedienen ... WICHTIG"):
    // every change and every scroll goes out as HTML, at most every 16 ms, and the presenter shows the same, scrolled the same.
    // Her voice and the karaoke run here on the beamer only - what the class hears and sees.
    out.addEventListener('scroll', function () { syncSoon(); });
    new MutationObserver(function () { bare(); syncSoon(); })   // text came or went, or the box folded (sf-zu)
      .observe(out, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    let syncTimer = 0;                                 // a timer, not rAF: a window hidden behind the presenter gets no frames
    function syncSoon() { if (!PRESENTER && !syncTimer) syncTimer = setTimeout(sync, 16); }
    function sync() {
      syncTimer = 0;
      if (PRESENTER || !window.DeckLink) return;
      window.DeckLink.send({ t: 'ask-out', html: panel.hidden ? '' : out.innerHTML, shut: out.classList.contains('sf-zu'),
                             busy: sf.beschaeftigt(), st: out.scrollTop });
    }
    function shown(m) { sf.spiegel({ html: m.html, zu: m.shut, busy: m.busy, st: m.st }); }   // presenter: the beamer's box, word for word
    // The panel above Solita shows only when it has something to show. Empty, or folded away by a page turn, it fades
    // out and only the question line in the footer remains (Doc, 23.09.2026). Opacity, not display: the box underneath
    // still slides open from zero when the next text arrives.
    function bare() { panel.classList.toggle('bare', !out.children.length || out.classList.contains('sf-zu')); }

    // While the panel is open, the question line (mic, field) stands in the footer: behind "... Doc Alvers fragen!"
    // and in front of the page number, centred on that text line; the answers stay above Solita (Doc, 23.09.2026:
    // "nicht dauerhaft, nur wenn Solita clicked wie jetzt"). Too little room (a phone, a short footer text) and the
    // line stays in the panel as before.
    const btn = document.getElementById('ask-btn'), btnHome = btn.nextSibling;   // her picture: bottom right, or leading the footer line
    const line = document.createElement('div');
    line.id = 'ask-line';
    panel.parentNode.insertBefore(line, panel.nextSibling);   // inside #ask, so the line inherits its font and colours
    const LINE_GAP = 14, LINE_MIN = 220;
    const edge = window.ResizeObserver && new ResizeObserver(function () { placeRow(); });   // the page number's width jumps when its font arrives
    let edgeOn = null;                                  // the page number the observer watches - re-observing it in its own callback would fire every frame
    let again = false;                                  // one re-measure after the corner emptied or filled, never a loop
    function placeRow() {
      if (PRESENTER) { placePres(); return; }
      const s = slides[si], foot = s && s.querySelector('.foot'), pn = s && s.querySelector('.pageno');
      let fits = false;
      // her greeting page shows her large already: nothing of her below the slide, no picture, no corner - and the
      // corner is not reserved either (Doc, 23.09.2026: "auf der 1. Seite nicht bitte", then "nimm sie ganz raus")
      const greet = !!s && s.classList.contains('greet');
      if (greet !== box.classList.contains('greet')) { box.classList.toggle('greet', greet); if (typeof dock === 'function') dock(); }
      if (greet) return;
      if (edge && pn !== edgeOn) { edge.disconnect(); if (pn) edge.observe(pn); edgeOn = pn; }
      if (foot && pn && foot.textContent.trim()) {
        const rg = document.createRange();
        rg.selectNodeContents(foot);                    // the text itself - .foot spans the whole slide
        const t = rg.getBoundingClientRect(), p = pn.getBoundingClientRect();
        // no wider than about before the overview and fullscreen went left (Doc, 30.09.2026: "zu breit"): the field
        // at most 11 buttons wide, beside her picture and the mic
        const b = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hudbtn')) || 22;
        const left = t.right + LINE_GAP, width = Math.min(p.left - LINE_GAP - left, 13 * b + 12);
        if (width >= LINE_MIN) {
          // on the same middle as the buttons on the right, not on the footer text's own box - that sat 1.5 px higher
          // (Doc, 23.09.2026: "bitte alles so hoch wie die butt rechts")
          // the right group may stand empty now that the overview and fullscreen went left (30.09.2026): then the left one
          const h = ['hud', 'nav'].map(function (id) { const e = document.getElementById(id); return e && !e.hidden && e.getBoundingClientRect(); })
            .find(function (b) { return b && b.height; });
          const mid = h && h.height ? h.top + h.height / 2 : t.top + t.height / 2;
          line.style.left = left + 'px'; line.style.width = width + 'px'; line.style.top = mid + 'px';
          fits = true;
        }
      }
      // Her picture always stands behind "... fragen!", the corner stays empty; the row (mic, field) joins her while the
      // panel is open (Doc, 23.09.2026: "Solita pille rechts weg und immer nach fragen!"). No room: everything in the corner.
      const was = btn.parentNode === line;
      if (fits) {
        line.classList.add('on'); lead();
        if (panel.hidden) move(sfRoot, home()); else move(line, null);
        // the answers hang right above the line like a speech bubble, centred over the field itself and never beyond the
        // line's ends (Doc, 23.09.2026: "die Box kommt an der falschen Stelle" in the corner, then "über der Suchzeile")
        const h = line.offsetHeight || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hudbtn')) || 22;
        // exactly the width of the field it belongs to, flush with it (Doc, 23.09.2026: "Box zu breit", then "so breit
        // wie die Eingabe"). While the panel is closed the field sits inside it and has no width - then the line's.
        const f = sf.feld().getBoundingClientRect();
        if (!sliding && f.width) { fieldW = f.width; fieldL = f.left; }   // its real size, kept for the moments it has none
        const good = !sliding && f.width;                // a clipped field says nothing about its real size
        const w = fieldW || (good ? f.width : parseFloat(line.style.width));
        panel.style.left = Math.round(fieldW ? fieldL : good ? f.left : parseFloat(line.style.left)) + 'px';
        panel.style.width = Math.round(w) + 'px';
        sf.auffrischen();                              // the field just changed width: the invitation that fits
        panel.style.bottom = Math.round(innerHeight - (parseFloat(line.style.top) - h / 2) + 8) + 'px';
      }
      else rowBack();
      box.classList.toggle('inline', fits);            // the panel is then placed from here, not from the corner ('foot' is the slide's footer class - never that)
      if (was !== fits && !again && typeof dock === 'function') {   // the HUD and the page number move with the corner - measure once more
        again = true; dock(); placeRow(); again = false;
      }
    }
    function lead() { if (btn.parentNode !== line) line.insertBefore(btn, line.firstChild); }
    function home() { return rowHome && rowHome.parentNode === sfRoot ? rowHome : null; }
    function move(to, before) {                        // moving a focused field blurs it - Doc keeps typing
      if (row.parentNode === to) return;
      const typing = document.activeElement === sf.feld();
      to.insertBefore(row, before);
      if (typing) sf.feld().focus();
    }
    function rowBack() {                               // everything back to the corner: the line off, the row in the panel, her picture under it
      line.classList.remove('on');
      panel.style.left = panel.style.width = panel.style.bottom = '';   // the panel hangs from the corner again (deck.css)
      move(sfRoot, home());
      if (btn.parentNode === line) box.insertBefore(btn, btnHome && btnHome.parentNode === box ? btnHome : null);
    }
    // Presenter view (Doc, 23.09.2026: "Solita AI kann ich im Präsi Mode nicht bedienen ... WICHTIG"): the line rides on the
    // .p-ask slot under the page turner, her picture in front; the answers hang over the live slide's corner, where the
    // class sees them on the beamer. The beamer window asks, shows and speaks - this one sends and mirrors (DeckAsk below).
    function placePres() {
      const slot = document.querySelector('#pres .p-ask'), frame = document.querySelector('#pres .p-cur .p-frame');
      if (!slot || !frame) return;                     // the presenter view is not built yet
      const r = slot.getBoundingClientRect(), f = frame.getBoundingClientRect();
      line.style.left = r.left + 'px'; line.style.width = r.width + 'px'; line.style.top = (r.top + r.height / 2) + 'px';
      move(line, null); line.classList.add('on'); lead();
      box.style.right = Math.round(innerWidth - f.right + 8) + 'px';
      box.style.top = 'auto';                          // dock() hangs it from the top of the (hidden) footer band
      box.style.bottom = Math.round(innerHeight - f.bottom + 8) + 'px';
    }
    painted.push(placeRow);                             // the footer moves with the slide scale and the page
    addEventListener('resize', placeRow);
    if (document.fonts) {                               // Orbitron arrives late: the page number's edge moves with it
      document.fonts.ready.then(placeRow);
      document.fonts.addEventListener('loadingdone', placeRow);
    }

    function open() {
      if (typeof narr !== 'undefined') narr.stop();   // asking pauses the talk, like turning a page
      // decide "empty" BEFORE it shows: on the first open the panel had no .bare yet, stood there at full opacity
      // and faded out over 250 ms (Doc, 25.09.2026: "flashed ... beim ersten Mal")
      bare();
      panel.hidden = false;
      sf.auffrischen();                               // the password once, then the question
      bare();
      placeRow();
      requestAnimationFrame(function () { requestAnimationFrame(placeRow); });   // once the footer has settled after the click
      rest();                                           // the stored height never pushes the panel off the top
      sf.feld().focus();
      sf.aufwaermen();
    }
    function close() { if (PRESENTER) return; panel.hidden = true; placeRow(); sf.stop(); }   // the row goes home, her picture stays in the footer; the presenter's line stays

    // Her picture: a click or tap opens the line, and with the line open switches between Solita and Doc - the box does
    // it (Doc, 30.09.2026: "click auf Avatar switch Doc Solita (zentral bitte)"). Esc closes. The presenter's line is
    // always open.
    btn.addEventListener('click', function () { btn.classList.remove('invite'); });   // found her - no more inviting on this page
    sf.bild(btn, { offen: function () { return PRESENTER || !panel.hidden; }, oeffnen: open });
    document.getElementById('ask-close').onclick = close;
    // Space and P start the mic from anywhere on the slide, not only inside her panel; a closed line slides open
    // first (Doc, 23.09.2026: "shift space und P sollen das Mic starten auf der ganzen Folie wenn eingeklappt,
    // animiert ausklappen"; 30.09.2026: Space alone). The key itself is the box's, for the labs too ("zentral bitte
    // wie im Deck") - it also sends on Space while she listens; here only how the line opens, and P.
    sf.sprechtaste({
      offen: function () { return !panel.hidden; },
      oeffnen: function () { open(); slideRow(); },    // out of her picture, then listen
      innen: box,                                      // panel, footer line or her picture
      tasten: ['p', 'P'],
    });
    // the mic line grows out of her picture instead of jumping there. While it grows the field is clipped, so its
    // width says nothing - the box above would become a pencil (Doc, 23.09.2026, screenshot).
    let sliding = false, fieldW = 0, fieldL = 0;
    function slideRow() {
      if (!line.classList.contains('on') || row.parentNode !== line) return;
      const w = row.getBoundingClientRect().width;
      if (!w) return;
      sliding = true;
      row.style.transition = 'none'; row.style.maxWidth = '0px'; row.style.opacity = '0';
      requestAnimationFrame(function () {
        row.style.transition = 'max-width .3s ease, opacity .3s ease';
        row.style.maxWidth = Math.ceil(w) + 'px'; row.style.opacity = '1';
        setTimeout(function () {
          row.style.transition = row.style.maxWidth = row.style.opacity = '';
          sliding = false; placeRow();                 // now the field has its real width again
        }, 360);
      });
    }
    // a page turn folds the answers away, down to the mic line; the next text opens the box again (Doc, 23.09.2026:
    // "beim Seitenwechsel bis auf die Mic Zeile einfahren (animiert)") - clicks through the steps of one slide leave it
    let foldedAt = si;
    painted.push(function () { if (si !== foldedAt) { foldedAt = si; out.classList.add('sf-zu'); } });
    // the two windows of a show talk through DeckLink (link.receive): the presenter sends ask, ask-live and ask-hush,
    // the beamer sends its box back as ask-out
    window.DeckAsk = {
      // the field is emptied as by Enter; the dictated line standing there becomes the question
      ask: function (q) { if (PRESENTER || !q) return; if (panel.hidden) open(); sf.feld().value = ''; sf.frage(q); },
      live: function (q) { if (PRESENTER) return; if (panel.hidden) open(); sf.live(q); },
      hush: function () { sf.stop(); }, shown: shown, sync: sync, place: placeRow,
      words: function (tex) { return window.SolitaKaraoke ? window.SolitaKaraoke.texWords(tex) : String(tex); }
    };
    if (PRESENTER) panel.hidden = false;              // the line is always there; the answers come from the beamer
    // The ordinary window starts with her picture alone behind "... fragen!" - password stored or not - and the line (mic,
    // field) comes with the click on her (Doc, 23.09.2026: "default: nur Solita"; before that day the stored password
    // opened the line at load). No focus and no warm-up here: the keys stay with the deck until Doc clicks into the field.
    placeRow();
    if (document.readyState !== 'complete') addEventListener('load', placeRow);   // dock() moves the page number at load
  }
})();

// Presenter view (Doc, 16.09.2026: "im Präsimode (full screen) auf einen ggf. ersten Monitor ... Vorschau
// der kommenden Slides", then "der Fullscreen butt ist schon der Start"). With a second screen the
// fullscreen button puts the deck on the beamer and opens the same deck again as ?presenter on the laptop:
// the slide the class sees, what the next click brings, the click after that (centred, a bit smaller),
// timer, clock and the slide strip. No notes for now (Doc: "lass erstmal leer").
// The windows talk over a BroadcastChannel; opener and popup also by postMessage, which works where a
// channel may not (a deck opened as a file). Only a window that has heard from a presenter follows, so two
// ordinary tabs of the same deck never steer each other. Without a second screen r opens the presenter
// window by hand - to try it out next to the deck.
const link = (function () {
  const me = Math.random().toString(36).slice(2);
  const seen = new Set();                            // a message may arrive twice: channel and postMessage
  let chan = null, peer = null, seq = 0, tt = 0;
  let linked = PRESENTER, applying = false, sentSi = -1, sentStep = -1;
  let mine = false;                                  // this window opened the presenter
  let showing = false, showAt = 0;                   // this window is on the beamer for a show, since when
  let presFull = false;                              // presenter: has been fullscreen in this show
  let best = -1;                                     // presenter: rank of the best answer to its hello
  try { chan = new BroadcastChannel('deck:' + location.pathname); } catch (e) { }

  function send(m) {
    m.from = me; m.id = me + '.' + (++seq); m.p = PRESENTER;
    if (chan) try { chan.postMessage(m); } catch (e) { }
    const to = location.origin === 'null' ? '*' : location.origin;
    (PRESENTER ? [window.opener, peer] : [peer]).forEach(function (w) {
      if (w && w !== window && !w.closed) try { w.postMessage({ deckLink: m }, to); } catch (e) { }
    });
  }
  function apply(m) {
    const n = Math.max(0, Math.min(slides.length - 1, m.si | 0));
    const st = Math.max(0, Math.min(groups(slides[n]), m.step | 0));
    if (n === si && st === step) return;
    if (!PRESENTER) narr.stop();                     // turned on the laptop = turned by hand
    applying = true; sentSi = n; sentStep = st;
    si = n; step = st; paint();
    applying = false;
  }
  function receive(m, src) {
    if (!m || m.from === me || seen.has(m.id)) return;
    if (seen.size > 4000) seen.clear();              // mirrored pointer moves are many
    seen.add(m.id);
    if (src) peer = src;
    if (PRESENTER) {
      if (m.p) return;                               // another presenter window: not ours to follow
      if (m.t === 'end') { window.close(); return; }   // Esc on the beamer ended the show
      if (m.t === 'laser-on') { toast(m.on ? 'Laser an (l)' : 'Laser aus (l)'); laser.mirrorOn(m.on); return; }
      if (m.t === 'skip') { window.DeckSlides.setHidden(m.i | 0, !!m.on, true); return; }
      if (m.t === 'ask-out') { if (window.DeckAsk) DeckAsk.shown(m); return; }   // the beamer's answer box, mirrored
      if (m.t === 'here') send({ t: 'go', si: si, step: step, to: m.from });   // the beamer window reloaded
      else if (m.t === 'go') {
        // answers to our hello: the window that opened us beats a fullscreen one beats any other tab
        if (m.rank !== undefined) { if (m.rank < best) return; best = m.rank; }
        apply(m);
      }
      return;
    }
    if (!m.p) return;                                // ordinary tabs never steer each other
    if (m.t === 'hello') {                           // a presenter (re)opened: tell it where we stand
      if (!mine && document.visibilityState !== 'visible') return;   // a tab in the background stays out
      linked = true;
      send({ t: 'go', si: si, step: step, rank: (mine ? 2 : 0) + (fsOn() ? 1 : 0) });
      if (window.DeckAsk) DeckAsk.sync();            // and the answer box as it stands
      return;
    }
    if (m.t === 'skip') { window.DeckSlides.setHidden(m.i | 0, !!m.on, true); return; }   // hidden in the presenter
    if (m.t === 'go' && m.to === me) linked = true;  // the presenter answered our 'here'
    if (!linked) return;
    if (m.t === 'bye') { if (!mine) linked = false; laser.show(m); }
    else if (m.t === 'end') {                        // Esc in the presenter window ended the show
      showing = false; linked = false; mine = false; laser.show(m);
      if (fsOn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
    else if (m.t === 'play') { if (narr.toggle) narr.toggle(); }
    else if (m.t === 'ask') { if (window.DeckAsk) DeckAsk.ask(m.q); }          // asked in the presenter: answered here
    else if (m.t === 'ask-live') { if (window.DeckAsk) DeckAsk.live(m.q); }    // dictated there, already on screen here
    else if (m.t === 'ask-hush') { if (window.DeckAsk) DeckAsk.hush(); }       // the presenter's mic is on: her voice off
    else if (m.t === 'go') apply(m);
    else if (m.t === 'ev') mirror.replay(m);
    else if (m.t === 'laser') laser.show(m);
    else if (m.t === 'laser-on') { toast(m.on ? 'Laser an (l)' : 'Laser aus (l)'); laser.mirrorOn(m.on); }   // L over there
    else if (m.t === 'laser-toggle') laser.toggle();     // a presenter window from before 23.09.2026
  }
  if (chan) chan.onmessage = function (e) { receive(e.data, null); };
  addEventListener('message', function (e) {
    if (!e.data || !e.data.deckLink || e.origin !== location.origin) return;
    receive(e.data.deckLink, e.source);
  });

  // Labs and 3D dice mirrored (Doc, 16.09.2026: "ideal wäre ich bediene die und LG auch ... same for Lab").
  // The same lab runs in both windows; everything done in the presenter's live slide - pointer, mouse, wheel,
  // keys, sliders, text, scrolling - is played again in the beamer's copy, on the element at the same place
  // in the same DOM. Chance stays in step: every press re-seeds Math.random in both copies with one number,
  // so a roll shows the same pips on both screens. Limits: a lab that runs on its own clock can drift, and
  // nothing done on the beamer before the show is carried over.
  const mirror = (function () {
    const TYPES = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'mousedown', 'mousemove', 'mouseup',
                   'click', 'dblclick', 'wheel', 'keydown', 'keyup', 'input', 'change', 'scroll'];
    function prng(seed) {                             // mulberry32: small, fast, the same on both sides
      let a = seed >>> 0;
      return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    function pathOf(el, doc) {                        // child indices from <html> down to the element
      const path = [];
      if (!el || el.nodeType !== 1) return null;
      while (el && el !== doc.documentElement) {
        const up = el.parentElement;
        if (!up) return null;
        path.unshift([].indexOf.call(up.children, el));
        el = up;
      }
      return el ? path : null;
    }
    function byPath(doc, path) {
      let el = doc.documentElement;
      for (let i = 0; el && i < path.length; i++) el = el.children[path[i]];
      return el || null;
    }
    // presenter: listen to one live iframe of the current slide (capture phase, before the lab itself).
    // own: the deck window's own lab (no presenter view) - what a hand does there goes to the tablet alone
    // (Doc, 28.09.2026: "wenn auch auf dem gespiegelten Lenovo die Labs live zu sehen wären")
    function watch(f, slide, k, gesture, own) {
      let w;
      try { w = f.contentWindow; if (!w.document) return; } catch (e) { return; }   // another origin: no mirror
      if (own) { if (w.__deckTap) return; w.__deckTap = true; }   // one watch per lab window
      TYPES.forEach(function (type) {
        w.addEventListener(type, function (e) {
          if (!e.isTrusted) return;
          const doc = w.document;
          const m = { t: 'ev', si: slide, k: k, type: type, ts: e.timeStamp,
                      mods: [e.altKey, e.ctrlKey, e.metaKey, e.shiftKey] };
          let tgt = e.target;
          if (type === 'scroll' && tgt && tgt.nodeType === 9) tgt = doc.scrollingElement;
          m.path = pathOf(tgt, doc);
          if (tgt && tgt.nodeType === 1) { m.tag = tgt.tagName; m.eid = tgt.id || ''; }
          if (type === 'pointerdown' || type === 'keydown') {
            m.seed = Math.floor(Math.random() * 4294967296);
            w.Math.random = prng(m.seed);
            gesture();                                // a press in a lab counts for the presenter's fullscreen too
          }
          if (e.clientX !== undefined) {
            m.x = e.clientX; m.y = e.clientY; m.b = e.button; m.bs = e.buttons;
            m.mx = e.movementX; m.my = e.movementY; m.det = e.detail;
          }
          if (e.pointerId !== undefined) {
            m.pid = e.pointerId; m.pt = e.pointerType; m.prim = e.isPrimary; m.pr = e.pressure; m.pw = e.width; m.ph = e.height;
          }
          if (type === 'wheel') { m.dx = e.deltaX; m.dy = e.deltaY; m.dz = e.deltaZ; m.dm = e.deltaMode; }
          if (e.key !== undefined) { m.key = e.key; m.code = e.code; m.rep = e.repeat; m.kc = e.keyCode; }
          if (type === 'input' || type === 'change') { m.val = tgt && tgt.value; m.chk = tgt && tgt.checked; }
          if (type === 'scroll' && tgt) { m.st = tgt.scrollTop; m.sl = tgt.scrollLeft; }
          if (!own) send(m);                          // to the beamer window
          if (window.DeckLabTap) window.DeckLabTap(m);  // and to the tablet, when one is linked (deck-ink.js)
        }, true);
      });
      if (own) return;                                // the laser below belongs to the presenter view
      // the laser follows the mouse over a lab as well - its moves never reach this document
      w.addEventListener('pointermove', function (e) {
        const r = f.getBoundingClientRect(), k = r.width / (f.offsetWidth || 1);
        laser.move(r.left + (f.clientLeft + e.clientX) * k, r.top + (f.clientTop + e.clientY) * k);
      }, true);
    }
    // beamer: the same event, on the same element of its copy
    function guard(w) {
      // a replayed pointer has no real pointer behind it: capturing it throws and would stop the lab's handler
      if (w.__deckMirror) return;
      w.__deckMirror = true;
      ['setPointerCapture', 'releasePointerCapture'].forEach(function (n) {
        const orig = w.Element.prototype[n];
        if (orig) w.Element.prototype[n] = function () { try { return orig.apply(this, arguments); } catch (e) { } };
      });
    }
    function replay(m) {
      const slide = slides[m.si];
      const f = slide && slide.querySelectorAll('iframe')[m.k];
      if (!f) return;
      let w, doc;
      try { w = f.contentWindow; doc = w.document; } catch (e) { return; }
      if (!doc || !doc.documentElement) return;
      guard(w);
      if (m.seed !== undefined) w.Math.random = prng(m.seed);
      // Which element: for a pointer what lies at that spot (the beamer's copy has the same size, so the same
      // layout) - measured on Doc's two screens 16.09.2026, the DOM path alone missed: the two copies had
      // grown their injected extras in a different order. A press remembers its element for the moves and the
      // release that follow, like a real pointer does. Keys, inputs and scrolling go by id, then by path.
      const byId = m.eid ? doc.getElementById(m.eid) : null;
      const byP = m.path ? byPath(doc, m.path) : null;
      const onPath = byP && (!m.tag || byP.tagName === m.tag) ? byP : null;
      let t = null;
      if (m.x !== undefined) {
        const here = doc.elementFromPoint(m.x, m.y);
        if (m.type === 'pointerdown' || m.type === 'mousedown') w.__deckDown = here;
        const up = m.type === 'pointerup' || m.type === 'pointercancel' || m.type === 'mouseup';
        t = ((m.bs || up) && w.__deckDown) || here || byId || onPath;
        if (m.type === 'mouseup') w.__deckDown = null;
      } else {
        t = byId || onPath || doc.activeElement || doc.body;
      }
      if (!t) return;
      if (m.type === 'scroll') { t.scrollTop = m.st; t.scrollLeft = m.sl; return; }
      const mods = m.mods || [];
      const base = { bubbles: true, cancelable: true, composed: true, view: w,
                     altKey: !!mods[0], ctrlKey: !!mods[1], metaKey: !!mods[2], shiftKey: !!mods[3] };
      let ev;
      if (m.type === 'input' || m.type === 'change') {
        if (t.type === 'checkbox' || t.type === 'radio') t.checked = !!m.chk;
        else if ('value' in t && t.value !== m.val) t.value = m.val;
        ev = new w.Event(m.type, { bubbles: true });
      } else if (m.key !== undefined) {
        ev = new w.KeyboardEvent(m.type, Object.assign(base, { key: m.key, code: m.code, repeat: !!m.rep }));
        Object.defineProperty(ev, 'keyCode', { get: function () { return m.kc; } });
        Object.defineProperty(ev, 'which', { get: function () { return m.kc; } });
      } else {
        const mouse = Object.assign(base, { clientX: m.x, clientY: m.y, screenX: m.x, screenY: m.y, button: m.b,
                                            buttons: m.bs, detail: m.det, movementX: m.mx, movementY: m.my });
        if (m.type === 'wheel') {
          ev = new w.WheelEvent('wheel', Object.assign(mouse, { deltaX: m.dx, deltaY: m.dy, deltaZ: m.dz, deltaMode: m.dm }));
        } else if (m.pid !== undefined) {
          ev = new w.PointerEvent(m.type, Object.assign(mouse, { pointerId: m.pid, pointerType: m.pt, isPrimary: m.prim,
                                                                pressure: m.pr, width: m.pw, height: m.ph }));
        } else {
          ev = new w.MouseEvent(m.type, mouse);
        }
      }
      // The lab sees the presenter's clock, shifted once per press: a trackball throw takes its speed from the
      // times of the last moves, and those arrive here with a jitter that made the die land elsewhere.
      if (m.seed !== undefined || w.__deckOff === undefined) w.__deckOff = w.performance.now() - m.ts;
      const at = m.ts + w.__deckOff;
      let shifted = false;
      try { w.performance.now = function () { return at; }; shifted = true; } catch (e) { }
      try { t.dispatchEvent(ev); } catch (e) { }
      if (shifted) delete w.performance.now;
    }
    return { watch: watch, replay: replay };
  })();
  window.DeckLabMirror = mirror;                      // the tablet replays with it (deck-ink.js)
  // The deck window watches its own labs as well: only input that really comes from a hand counts (isTrusted),
  // so the beamer's copy, which only replays, never sends anything on. Without a linked tablet nothing leaves.
  if (!PRESENTER) {
    slides.forEach(function (s, i) {
      s.querySelectorAll('iframe').forEach(function (f, k) {
        if (!f.closest('.labframe')) return;
        const hook = function () {
          // not the frame's first empty page: Chrome may keep that window for the lab, and the mark would stick
          try { if (!f.contentWindow || f.contentWindow.location.href === 'about:blank') return; } catch (e) { return; }
          mirror.watch(f, i, k, function () { }, true);
        };
        f.addEventListener('load', hook);
        hook();                                       // loaded already (a lab from the cache)
      });
    });
  }

  // Laser pointer (Doc, 16.09.2026: "wenn ich die Maus auf presenter bewege, könnte da ein Laser im Show sein?",
  // then "lass mal immer kommen" and "l schalten ihn!"). The mouse over the presenter's current slide shows as a
  // red dot at the same place on the beamer, over labs and dice too, and in the presenter view itself.
  // On at the start; l in either window switches it and the other follows - the dot stays where it was put
  // (a window that was opened before today still understands the old laser-toggle).
  const laser = (function () {
    // It stays where he left it until L puts it out (Doc, 23.09.2026: "lass ihn an bis l" - until that day it faded
    // after two seconds without a move, and leaving the slide took it away too).
    const SIZE = 19;                                 // edge of the square pattern in slide pixels
    let on = true, dot = null;                       // beamer
    // The dot as a laser through a crossed grating - a subtle grid of points around the beam (Doc, 16.09.2026:
    // "in der Mitte zu weiß", then "eher so wie ein grid. Wenn man Doppelspalt in 2D macht ... so punkte aber
    // sehr subtil"). Far field of a 2D grating in a beam: one beam spot per order (m, n), weighted by the single
    // slit, I = sinc²(π m a/d) · sinc²(π n a/d), with a/d = 1/8 (so the 8th orders are missing). The side orders
    // are dimmed by SIDE to stay subtle, and the light is exposed like a photo, α = 1 − e^(−E·I): the centre
    // saturates into the dot, the faint orders stay small points. Doc's photo of a real grid laser (16.09.2026,
    // "in this dir"): crisp points, the centre with a GLOW. Then "viel zu groß und Kreis": half the size, and no
    // haze with a round edge - the sinc² envelope alone lets the grid fade out, square as in the photo.
    // "Viel enger und heller" showed nothing on Doc's screens; back to that look, 50 % smaller, and full red
    // ("last 4 today 50% kleiner", "und volles rot"). Then "doppelt so dicht": the grating period doubled - half
    // the pitch, a/d halved so the envelope keeps its width, twice the orders - out to the 7th, the 8th is missing.
    function grating() {
      const N = 240, K = 7, PITCH = 1.125, SIGMA = 0.3, AD = 0.125, SIDE = 0.2, E = 5; // lengths in slide pixels
      const GLOW = [0.3, 0.75];                      // [intensity, radius] around the centre
      const px2 = N / SIZE;                          // canvas pixels per slide pixel
      const sinc2 = function (m) { const u = Math.PI * m * AD; return m ? Math.pow(Math.sin(u) / u, 2) : 1; };
      const spots = [];
      for (let m = -K; m <= K; m++) for (let n = -K; n <= K; n++) {
        spots.push([N / 2 + m * PITCH * px2, N / 2 + n * PITCH * px2, (m || n ? SIDE : 1) * sinc2(m) * sinc2(n)]);
      }
      const s2 = 2 * Math.pow(SIGMA * px2, 2);
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const g = c.getContext('2d'), img = g.createImageData(N, N), px = img.data;
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const r2 = Math.pow(x + 0.5 - N / 2, 2) + Math.pow(y + 0.5 - N / 2, 2);
        let I = GLOW[0] * Math.exp(-r2 / (2 * Math.pow(GLOW[1] * px2, 2)));
        for (let k = 0; k < spots.length; k++) {
          const dx = x + 0.5 - spots[k][0], dy = y + 0.5 - spots[k][1];
          I += spots[k][2] * Math.exp(-(dx * dx + dy * dy) / s2);
        }
        const v = 1 - Math.exp(-E * I), o = 4 * (y * N + x);
        px[o] = 255; px[o + 1] = 0; px[o + 2] = 0; px[o + 3] = 255 * v;
      }
      g.putImageData(img, 0, 0);
      return 'url(' + c.toDataURL() + ')';
    }
    let want = null, sent = null, raf = 0, at = null;   // presenter; at = the dot's last place in this window
    // presenter: a mouse position in this window - on the current slide it goes out as a fraction of the slide
    function move(x, y) {
      const f = document.querySelector('#pres .p-cur .p-frame');
      const r = f && f.getBoundingClientRect();
      if (!r || !r.width) return;
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;   // off the slide: it stays where it is
      want = { x: (x - r.left) / r.width, y: (y - r.top) / r.height };
      if (!raf) raf = requestAnimationFrame(flush);   // one message per frame at most
    }
    function flush() {
      raf = 0;
      if (!want && !sent) return;                    // off, and the beamer knows
      sent = want;
      const m = want ? { t: 'laser', x: +want.x.toFixed(4), y: +want.y.toFixed(4) } : { t: 'laser' };
      send(m);
      show(m);                                       // and it stands on his own preview too
    }
    // Beamer AND presenter view: a position shows the dot, a message without one puts it out. Doc needs to see
    // where he is pointing while he talks, on his own screen too (Doc, 23.09.2026: "ich muss im PräsiAnsicht den
    // Laser sehen (parallel)") - there it rides on the preview of the current slide.
    function stage() {
      if (!PRESENTER) return deck.getBoundingClientRect();
      const f = document.querySelector('#pres .p-cur .p-frame');
      return f && f.getBoundingClientRect();
    }
    // The mouse only disappears while a dot really stands in its place - after loading there is none yet, and an
    // invisible pointer over nothing is what Doc saw (23.09.2026: "beim einschalten ... check mal genau").
    function cursor() {
      document.documentElement.classList.toggle('laser-on', !!(on && dot && dot.classList.contains('on')));
    }
    function show(m) {
      if (m.x !== undefined) at = { x: m.x, y: m.y };   // follow the hand even while the dot is out, so L lights it where he points now
      if (!on || m.x === undefined) { if (dot) dot.classList.remove('on'); cursor(); return; }
      if (!place(m)) return;                         // the preview is not built yet
      cursor();
    }
    // the dot at a fraction of the stage - the slide on the beamer, the preview in the presenter view
    function place(m) {
      const r = stage();
      if (!r || !r.width) return false;
      if (!dot) {
        dot = document.createElement('div');
        dot.id = 'laser'; dot.setAttribute('aria-hidden', 'true');
        dot.style.backgroundImage = grating();
        document.body.appendChild(dot);
      }
      dot.style.setProperty('--lz', (SIZE * r.width / 960).toFixed(1) + 'px');
      dot.style.transform = 'translate(' + (r.left + m.x * r.width).toFixed(1) + 'px,'
                                         + (r.top + m.y * r.height).toFixed(1) + 'px)';
      dot.classList.add('on');
      return true;
    }
    // Laser by hand (Doc, 28.09.2026: "mach mir da ein kleines Laser icon wenn an roter strahl"): the button right of
    // the H - or L in a window without a presenter view - makes the mouse itself the red dot on the slide, for one
    // screen at the board. Off at the start; over the buttons, Solita or the pen the arrow comes back.
    let hand = false, handBtn = null;
    function handAt(x, y, away) {
      if (!hand) return;
      const r = deck.getBoundingClientRect();
      if (away || !r.width || x < r.left || x > r.right || y < r.top || y > r.bottom) { handOff(); return; }
      place({ x: (x - r.left) / r.width, y: (y - r.top) / r.height });
      document.documentElement.classList.add('laser-hand');   // the dot stands there: the mouse shows nothing
    }
    function handOff() {
      if (dot) dot.classList.remove('on');
      document.documentElement.classList.remove('laser-hand');
    }
    // a lab's moves never reach this document - listen inside it, as the presenter does (a reloaded lab is a new window)
    function hookLabs() {
      deck.querySelectorAll('iframe').forEach(function (f) {
        if (!f.__laserLoad) { f.__laserLoad = true; f.addEventListener('load', hookLabs); }
        let w;
        try { w = f.contentWindow; if (!w || !w.document || w.__laserHand) return; } catch (e) { return; }   // another origin
        w.__laserHand = true;
        w.addEventListener('pointermove', function (e) {
          const r = f.getBoundingClientRect(), k = r.width / (f.offsetWidth || 1);
          handAt(r.left + (f.clientLeft + e.clientX) * k, r.top + (f.clientTop + e.clientY) * k, false);
        }, true);
      });
    }
    function handToggle() {
      hand = !hand;
      if (handBtn) handBtn.setAttribute('aria-pressed', String(hand));
      // a finger or pen on the board drags the dot - without this the browser takes the drag for panning and
      // cancels the pointer after a few pixels (deck.css: touch-action)
      document.documentElement.classList.toggle('laser-armed', hand);
      if (hand) hookLabs(); else handOff();
      toast(hand ? 'Laser an (l)' : 'Laser aus (l)');
    }
    const helpBtn = document.getElementById('nav-help');
    if (!PRESENTER && helpBtn) {
      handBtn = document.createElement('button');
      handBtn.id = 'nav-laser'; handBtn.type = 'button'; handBtn.title = 'Laserpointer (L)';
      handBtn.setAttribute('aria-label', 'Laserpointer'); handBtn.setAttribute('aria-pressed', 'false');
      // a pointer held aslant, its beam goes red while it is on (deck.css)
      handBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"'
        + ' stroke-linejoin="round" aria-hidden="true"><path d="M2.6 18.6l8.5-8.5 2.8 2.8-8.5 8.5z"/>'
        + '<path d="M6.3 16.3l1.4 1.4"/><g class="beam"><path d="M14.6 9.4L20 4"/>'
        + '<circle cx="20.6" cy="3.4" r="1.3" fill="currentColor" stroke="none"/></g></svg>';
      handBtn.addEventListener('click', function (e) { e.stopPropagation(); handToggle(); });
      helpBtn.after(handBtn);
    }
    if (!PRESENTER) {
      // pointerdown too: a finger or pen puts the dot where it lands, not only once it moves (Doc, 29.09.2026:
      // "auf dem HP bewegt sich der Laser nicht mit dem stift/Finger?")
      function handEv(e) { handAt(e.clientX, e.clientY, !(e.target && e.target.closest && e.target.closest('#deck'))); }
      addEventListener('pointerdown', handEv, true);
      addEventListener('pointermove', handEv, true);
      // pointing with a finger or pen is a drag - lifting it must not turn the page
      let down = null, dragged = false;
      addEventListener('pointerdown', function (e) {
        down = hand && e.pointerType !== 'mouse' ? { x: e.clientX, y: e.clientY } : null;
        dragged = false;
      }, true);
      addEventListener('pointermove', function (e) {
        if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 12) dragged = true;
      }, true);
      addEventListener('click', function (e) {
        if (dragged) { dragged = false; e.stopImmediatePropagation(); e.preventDefault(); }
      }, true);
      document.addEventListener('mouseout', function (e) { if (!e.relatedTarget) handOff(); });   // out of the window
      painted.push(function () { if (hand) hookLabs(); });
    }
    // L puts the dot back where it stood, at once - waiting for the next mouse move looked broken (Doc, 23.09.2026:
    // "l bringt nicht den Punkt sofort! Man muss erst bewegen!")
    function light() {
      // Switched on it must be SEEN, even if the mouse has never been over the slide yet - then it starts in the
      // middle (Doc, 23.09.2026: "L -> laser an aber kein laser zu sehen")
      if (on) show(at || { x: 0.5, y: 0.5 }); else show({});
    }
    function toggle() {
      on = !on;
      light();
      if (window.DeckNote) DeckNote(on ? 'Laser an (l)' : 'Laser aus (l)');   // said in the window he pressed it in
      send({ t: 'laser-on', on: on });
    }
    function mirrorOn(v) { on = !!v; light(); }      // the other window switched it
    if (PRESENTER) {
      addEventListener('pointermove', function (e) { move(e.clientX, e.clientY); });
    }
    addEventListener('keydown', function (e) {
      if ((e.key !== 'l' && e.key !== 'L') || e.metaKey || e.ctrlKey || e.altKey) return;
      // L works on both screens, whichever window has the focus, linked or not (Doc, 23.09.2026: "lass l auf
      // beiden screens zu") - whoever presses it sets the state and the other window mirrors it (laser-on).
      // Without a presenter view there is nobody to point from: L is the button right of the H.
      if (!PRESENTER && !linked) { handToggle(); return; }
      toggle();
    });
    cursor();                                        // no dot yet: the arrow stays
    window.DeckLaser = function () { return { on: on, want: want, sent: sent, raf: raf, dot: !!dot }; };   // debug
    return { move: move, show: show, toggle: toggle, mirrorOn: mirrorOn };
  })();

  window.DeckNote = toast;                            // the deck's one message box, also for the screen badge
  function toast(t, ms, cls) {                        // ms and cls: the screen probe stays longer, in Arial
    let b = document.getElementById('linkmsg');
    if (!b) {
      b = document.createElement('div'); b.id = 'linkmsg'; b.setAttribute('role', 'status');
      b.addEventListener('click', function () { b.hidden = true; });   // a tap closes it
      document.body.appendChild(b);
    }
    b.textContent = t; b.className = cls || ''; b.hidden = false;
    clearTimeout(tt); tt = setTimeout(function () { b.hidden = true; }, ms || 4500);
  }
  function openPresenter(scr) {
    // the page's own parameters stay: the board (decks/tafel.html?id=... or ?aufgaben) lost them and its presenter said
    // "Keine Tafel angegeben." (Doc, 30.09.2026: "???")
    const base = location.href.split('#')[0];
    const url = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'presenter';
    const where = scr ? ',left=' + scr.availLeft + ',top=' + scr.availTop
                        + ',width=' + scr.availWidth + ',height=' + scr.availHeight
                      : ',width=1280,height=800';
    const w = window.open(url, 'deck-presenter', 'popup' + where);
    if (!w) { toast('Referentenansicht blockiert – bitte Pop-ups für diese Seite erlauben'); return; }
    peer = w; linked = true; mine = true;
  }
  // One click, two windows: Chrome lets a page that may place windows ("Fenster verwalten", asked once)
  // go fullscreen on one screen and open a popup on another from the same click - fullscreen first.
  async function present() {
    const el = document.documentElement;
    let sd = null;
    try { sd = await window.getScreenDetails(); } catch (e) { }   // refused: plain fullscreen as before
    const screens = sd ? sd.screens : [];
    const lap = screens.filter(function (s) { return s.isInternal; })[0] || (sd && sd.currentScreen);
    const beamer = screens.filter(function (s) { return s !== lap; })[0];
    try { await el.requestFullscreen(beamer ? { screen: beamer } : undefined); }
    catch (e) { offer(!!beamer); return; }
    if (beamer) { showing = true; showAt = Date.now(); openPresenter(lap); }
  }
  // Chrome's question "Fenster verwalten" uses up the click that asked it (measured 16.09.2026 on Doc's two
  // screens: after "Allow" no fullscreen, no popup). The answer is remembered per site, so this happens
  // once - and then a big button in the middle takes the fresh click that starting needs.
  function offer(two) {
    let card = document.getElementById('linkgo');
    if (!card) {
      card = document.createElement('div');
      card.id = 'linkgo';
      card.setAttribute('role', 'dialog');
      card.setAttribute('aria-label', 'Präsentation starten');
      card.innerHTML = '<div class="lg-box"><div class="lg-title">Präsentieren</div>'
        + '<p></p>'
        + '<button type="button" class="lg-go">Präsentation starten</button>'
        + '<button type="button" class="lg-no">Abbrechen</button></div>';
      document.body.appendChild(card);
      card.addEventListener('keydown', function (e) {  // Enter and Esc belong to the card, not to the deck
        e.stopPropagation();
        if (e.key === 'Escape') card.hidden = true;
      });
      card.addEventListener('click', function (e) {
        e.stopPropagation();
        if (e.target.closest('.lg-go')) { card.hidden = true; present(); }
        else if (e.target.closest('.lg-no') || e.target === card) card.hidden = true;
      });
    }
    card.querySelector('p').textContent = two ? 'Beamer und Laptop sind bereit.' : 'Das Vollbild ist bereit.';
    card.hidden = false;
    card.querySelector('.lg-go').focus();
  }
  addEventListener('keydown', function (e) {
    if (PRESENTER || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'r' || e.key === 'R') openPresenter(null);
  });

  const view = PRESENTER ? presenterView() : null;
  painted.push(function () {
    if (view) view.render();
    if (applying || !linked || (si === sentSi && step === sentStep)) return;
    sentSi = si; sentStep = step;
    send({ t: 'go', si: si, step: step });
  });
  send({ t: PRESENTER ? 'hello' : 'here' });
  addEventListener('pagehide', function () { if (PRESENTER) send({ t: 'bye' }); });
  // Esc ends the show from either window (Doc, 16.09.2026: "ESC beendet Show" - "einfach nur auch schließen"):
  // on the beamer the browser leaves fullscreen itself and the presenter window closes; in the presenter
  // window the beamer leaves fullscreen and the presenter window closes.
  // In fullscreen the browser keeps Esc for itself, so leaving fullscreen IS the Esc. A drop right at the
  // start (a browser leaving fullscreen as the popup opens) is not Doc's Esc and ends nothing.
  document.addEventListener('fullscreenchange', function () {
    if (PRESENTER) {
      if (fsOn()) { presFull = true; return; }
      if (!presFull) return;
      presFull = false;
      endShow();
      return;
    }
    if (fsOn() || !showing || Date.now() - showAt < 1500) return;
    showing = false;
    send({ t: 'end' });
    linked = false; mine = false; peer = null;
  });
  function endShow() {                               // presenter: Esc, leaving fullscreen or the end button in the bar
    send({ t: 'end' });
    setTimeout(function () { window.close(); }, 80);   // let the message leave first
  }
  if (PRESENTER) addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return;
    const j = document.getElementById('jump');
    if (j && !j.hidden) return;                      // Esc first drops a typed slide number
    endShow();
  }, true);   // capture: before the slide-number handler clears its box; an open overview still gets Esc first

  function presenterView() {
    const svg = function (d) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
        + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
    };
    const PAUSE = '<path d="M9 5v14M15 5v14"/>', PLAY = '<path d="M7 5v14l12-7z"/>';
    const RESET = '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/>';
    const root = document.createElement('div');
    root.id = 'pres';
    root.innerHTML =
        '<div class="p-bar"><span class="p-timer" title="Laufzeit"></span>'
      + '<button type="button" class="p-pause"></button>'
      + '<button type="button" class="p-reset" title="Timer neu starten" aria-label="Timer neu starten">' + svg(RESET) + '</button>'
      + '<button type="button" class="p-ov" title="Übersicht aller Folien (o)" aria-label="Übersicht aller Folien"></button>'
      + '<span class="p-clock" title="Uhrzeit"></span>'
      + '<button type="button" class="p-end-btn" title="Präsentation beenden (Esc)" aria-label="Präsentation beenden">'
      + svg('<path d="M18 6 6 18M6 6l12 12"/>') + '</button></div>'
      + '<div class="p-cur"><div class="p-fit" title="Klick: weiter"><div class="p-frame"></div></div>'
      + '<div class="p-nav"><button type="button" class="p-prev" title="Zurück" aria-label="Zurück">' + svg('<path d="m15 5-7 7 7 7"/>') + '</button>'
      + '<div class="p-pos"><span class="p-count"></span><div class="p-prog"><i></i></div></div>'
      + '<button type="button" class="p-next" title="Weiter" aria-label="Weiter">' + svg('<path d="m9 5 7 7-7 7"/>') + '</button></div>'
      + '<div class="p-ask"></div></div>'          // the room for the Frag-Solita line (#ask-line rides on it)
      + '<div class="p-side">'
      + '<div class="p-slot"><div class="p-fit"><div class="p-frame"></div></div><div class="p-cap"></div></div>'
      + '<div class="p-slot p-after"><div class="p-fit"><div class="p-frame"></div></div><div class="p-cap"></div></div>'
      + '</div>'
      + '<div class="p-strip" role="list" aria-label="Alle Folien"></div>';
    document.body.appendChild(root);
    document.title = 'Referent · ' + document.title;
    const q = function (s) { return root.querySelector(s); };
    const fits = [].slice.call(root.querySelectorAll('.p-fit'));
    const frames = fits.map(function (f) { return f.firstChild; });   // now, next click, the click after
    const AFTER = 0.8;                               // the click after: centred, a bit smaller (Doc)
    const cur = q('.p-cur'), side = q('.p-side'), nav = q('.p-nav'), askSlot = q('.p-ask');
    const caps = root.querySelectorAll('.p-cap');
    const strip = q('.p-strip'), count = q('.p-count'), prog = q('.p-prog i');
    const timerEl = q('.p-timer'), clockEl = q('.p-clock'), pauseBtn = q('.p-pause');
    let ready = document.readyState === 'complete', cells = [];
    let liveSi = -1, liveNode = null;                // the current slide, kept alive across its steps

    function scaleIn(box) {
      const s = box.firstChild;
      if (s && s.classList && s.classList.contains('slide')) s.style.transform = 'scale(' + box.clientWidth / 960 + ')';
    }
    function size(i, w) {
      w = Math.max(0, w);
      frames[i].style.width = w + 'px'; frames[i].style.height = w * 540 / 960 + 'px';
      scaleIn(frames[i]);
    }
    // the largest slides the places allow, stacked without holes: page turner right under the slide,
    // the two previews stacked beside it (upright screen: side by side under it)
    function fitAll() {
      const r = 540 / 960;
      const under = nav.offsetHeight + askSlot.offsetHeight + (parseFloat(getComputedStyle(askSlot).marginTop) || 0);
      size(0, Math.min(cur.clientWidth, (cur.clientHeight - under) / r));
      const lab = caps[0].offsetHeight + 6;           // a caption with its margin
      const gap = parseFloat(getComputedStyle(side).rowGap) || 0;
      const row = getComputedStyle(side).flexDirection === 'row';
      const slots = side.children;
      slots[0].style.marginTop = slots[1].style.marginTop = '';
      // side by side (Doc, 16.09.2026: "Vorschaubild top aligned mit links, das bottom down aligned"): the next
      // preview starts level with the current slide, the one after ends level with it; the first caption sits
      // between them, the second one on the line of the page turner
      const w1 = row
        ? Math.min((side.clientWidth - gap) / 2, (side.clientHeight - lab) / r)
        : Math.min(side.clientWidth, (frames[0].offsetHeight - lab - gap) / (r * (1 + AFTER)));
      size(1, w1); size(2, w1 * AFTER);
      if (!row) {
        const now = frames[0].getBoundingClientRect();
        slots[0].style.marginTop = now.top - frames[1].getBoundingClientRect().top + 'px';
        slots[1].style.marginTop = now.bottom - frames[2].getBoundingClientRect().bottom + 'px';
      }
      cells.forEach(function (c) { scaleIn(c.firstChild); });
      roomForDock();
      if (window.DeckAsk) DeckAsk.place();          // the question line under the page turner, the answers over the slide
    }
    function shot(i, st, live) {                     // slide i as it stands after st clicks
      const c = slides[i].cloneNode(true);
      c.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
      c.querySelectorAll('.play-big, .play-big-label').forEach(function (e) { e.remove(); });
      if (live) {                                    // the current slide: real labs and dice, mirrored to the beamer
        c.classList.add('live');
        c.querySelectorAll('iframe').forEach(function (f, k) {
          f.addEventListener('load', function () { mirror.watch(f, i, k, goFull); });
        });
      } else standIns(c);                            // previews and strip: pictures, not live labs
      c.classList.add('on');
      stepMarks(c, st);
      return c;
    }
    function put(box, node) { if (node) box.replaceChildren(node); else box.replaceChildren(); scaleIn(box); }
    function theEnd() { const d = document.createElement('div'); d.className = 'p-end'; d.textContent = 'Ende'; return d; }
    function ahead(p) {
      if (!p) return null;
      if (p.step < groups(slides[p.si])) return { si: p.si, step: p.step + 1 };
      const j = seek(p.si + 1, 1);
      return j >= 0 ? { si: j, step: 0 } : null;
    }
    // Dock magnification on the strip (Doc, 16.09.2026: "Dock in Mac macht die icons größer über der die Maus
    // ist ... mach das mit den slides unten so"). The slides near the mouse grow upward and push their
    // neighbours aside, like the macOS Dock. Sizes and shifts come from the UNMAGNIFIED places, so nothing
    // wobbles under the mouse: scale s(u) = 1 + k cos²(πu/2R) within R of the mouse, and each slide moves by
    // k·F(u), F being the integral of that bump - the space the bigger slides between it and the mouse need.
    // The room to grow into is the free space above the strip, lent by a negative margin: the current slide
    // keeps its size.
    const DOCK_MAX = 2.6;                            // the slide under the mouse, at most (Doc: "krasser", then "'n Tick zuviel")
    let dockX = null, dockK = 0, dockRaf = 0;
    function roomForDock() {
      strip.style.marginTop = strip.style.paddingTop = '';
      const cellH = cells.length ? cells[0].offsetHeight : 0;
      if (!cellH) { dockK = 0; return; }
      let lowest = askSlot.getBoundingClientRect().bottom;
      [].forEach.call(caps, function (c) { lowest = Math.max(lowest, c.getBoundingClientRect().bottom); });
      const free = strip.getBoundingClientRect().top - lowest - 6;
      // the ring around a cell grows with it: 3px outline × 2.6 did not fit the 4px padding and the strip cut it
      // off at the top (Doc, 17.09.2026: "manchmal ist der grüne Rand oben abgeschnitten") - lend that room too
      const ring = parseFloat(getComputedStyle(cells[0]).outlineWidth) || 0;
      const head = Math.max(0, Math.min(free - ring * DOCK_MAX, (DOCK_MAX - 1) * cellH));
      dockK = head / cellH;
      const extra = Math.ceil(ring * dockK);
      strip.style.marginTop = -(head + extra) + 'px';
      strip.style.paddingTop = 4 + head + extra + 'px';
      magnify();
    }
    function magnify() {
      dockRaf = 0;
      if (dockX === null || dockK < 0.02) {
        cells.forEach(function (c) { c.style.transform = ''; c.style.zIndex = ''; });
        return;
      }
      const r = strip.getBoundingClientRect();
      const mx = dockX - r.left - strip.clientLeft + strip.scrollLeft;
      const R = 2.6 * cells[0].offsetWidth;
      cells.forEach(function (c) {
        const u = c.offsetLeft + c.offsetWidth / 2 - mx;
        const near = Math.abs(u) < R;
        const bump = near ? Math.pow(Math.cos(Math.PI * u / (2 * R)), 2) : 0;
        const F = near ? u / 2 + R / (2 * Math.PI) * Math.sin(Math.PI * u / R) : Math.sign(u) * R / 2;
        c.style.transform = 'translateX(' + (dockK * F).toFixed(1) + 'px) scale(' + (1 + dockK * bump).toFixed(3) + ')';
        c.style.zIndex = near ? String(1 + Math.round(bump * 100)) : '';
      });
    }
    function dockSoon() { if (!dockRaf) dockRaf = requestAnimationFrame(magnify); }
    strip.addEventListener('mousemove', function (e) { dockX = e.clientX; dockSoon(); });
    strip.addEventListener('mouseleave', function () { dockX = null; dockSoon(); });
    strip.addEventListener('scroll', dockSoon, { passive: true });
    // the strip, the previews and the counter leave out hidden slides - the presenter shows what the class sees
    const rank = i => slides.filter(function (s, k) { return k <= i && !skipped(k); }).length;
    function buildStrip() {
      cells = slides.map(function (s, i) {
        const cell = document.createElement('button');
        cell.type = 'button'; cell.className = 'p-cell'; cell.setAttribute('role', 'listitem');
        cell.dataset.i = i;
        cell.draggable = !!window.DeckEdit;          // only where the editor is loaded (Doc's machine)
        cell.classList.toggle('off', hiddenSlide(i));
        cell.title = 'Folie ' + rank(i); cell.setAttribute('aria-label', 'Folie ' + rank(i));
        const box = document.createElement('div');
        box.className = 'p-thumb';
        box.appendChild(shot(i, groups(s)));
        const num = document.createElement('span');
        num.className = 'p-num'; num.textContent = hiddenSlide(i) ? 'aus' : rank(i);
        cell.appendChild(box); cell.appendChild(num);
        cell.addEventListener('click', function () { si = i; step = 0; paint(); });
        strip.appendChild(cell);
        return cell;
      });
    }
    function stripMarks() {
      cells.forEach(function (c, i) {
        c.classList.toggle('off', hiddenSlide(i));
        const n = c.querySelector('.p-num');
        if (n) n.textContent = hiddenSlide(i) ? 'aus' : rank(i);
        c.title = c.getAttribute('aria-label') === null ? c.title : 'Folie ' + rank(i);
      });
    }
    window.DeckStrip = { refresh: function () { if (cells.length) { stripMarks(); render(); } } };
    function render() {
      if (!ready) return;
      if (!cells.length) buildStrip();
      const n1 = ahead({ si: si, step: step }), n2 = ahead(n1);
      if (si !== liveSi || !liveNode) { liveSi = si; liveNode = shot(si, step, true); put(frames[0], liveNode); }
      else stepMarks(liveNode, step);
      put(frames[1], n1 ? shot(n1.si, n1.step) : theEnd());
      put(frames[2], n2 ? shot(n2.si, n2.step) : n1 ? theEnd() : null);
      caps[0].textContent = n1 ? 'Nächste Folie: ' + rank(n1.si) : '';
      caps[1].textContent = n2 ? 'Übernächste Folie: ' + rank(n2.si) : '';
      fitAll();
      const shown = slides.filter(function (s, i) { return !skipped(i); }).length;
      count.textContent = 'Folie ' + rank(si) + ' von ' + shown;
      prog.style.width = rank(si) / (shown || 1) * 100 + '%';
      cells.forEach(function (c, i) { c.classList.toggle('cur', i === si); });
      const c = cells[si];
      if (c) strip.scrollTo({ left: c.offsetLeft - (strip.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    }

    let t0 = Date.now(), acc = 0, running = true;
    const two = function (n) { return String(n).padStart(2, '0'); };
    // timer and clock in THE digits widget (Doc, 17.09.2026: "die Zahlen springen -> Zahlenwidget bitte verwenden"):
    // Orbitron's 1 is half as wide as its 0. Loaded here only, the decks' pages stay as they are; until it is
    // there the plain text stands in.
    ['../js/cyber-clock.css', '../js/cyber-clock.js'].forEach(function (src) {
      const css = /\.css$/.test(src), el = document.createElement(css ? 'link' : 'script');
      if (css) { el.rel = 'stylesheet'; el.href = src; } else { el.src = src; el.onload = tick; }
      document.head.appendChild(el);
    });
    function show(el, text) {
      const key = (window.CyberClock ? 'w' : 't') + text;   // once the widget is there, redraw even the same text
      if (el.dataset.shown === key) return;
      el.dataset.shown = key;
      if (window.CyberClock) CyberClock.digits(el, text); else el.textContent = text;
    }
    function tick() {
      const s = Math.floor((running ? acc + Date.now() - t0 : acc) / 1000);
      show(timerEl, (s >= 3600 ? Math.floor(s / 3600) + ':' : '') + two(Math.floor(s / 60) % 60) + ':' + two(s % 60));
      const d = new Date();
      show(clockEl, two(d.getHours()) + ':' + two(d.getMinutes()));
    }
    function showPause() {
      pauseBtn.innerHTML = svg(running ? PAUSE : PLAY);
      const t = running ? 'Timer anhalten' : 'Timer weiter';
      pauseBtn.title = t; pauseBtn.setAttribute('aria-label', t);
    }
    pauseBtn.onclick = function () {
      if (running) { acc += Date.now() - t0; running = false; } else { t0 = Date.now(); running = true; }
      showPause(); tick();
    };
    q('.p-reset').onclick = function () { acc = 0; t0 = Date.now(); tick(); };
    // Esc without a keyboard (Doc, 29.09.2026: "im Presentermode brauch ich noch einen ESC bzw. beenden button")
    q('.p-end-btn').onclick = endShow;
    // the overview over everything, here too (Doc, 17.09.2026: "auch im Presenter den Overview possible") - the
    // deck's own grid button sits in the hidden HUD, this one borrows its icon and its click
    const ovBtn = document.getElementById('ovbtn');
    if (ovBtn) { q('.p-ov').innerHTML = ovBtn.innerHTML; q('.p-ov').onclick = function () { ovBtn.click(); }; }
    else q('.p-ov').remove();
    q('.p-prev').onclick = function () { prev(); };
    q('.p-next').onclick = function () { next(); };
    fits[0].addEventListener('click', function () { next(); });   // a click on the slide goes on, as on the beamer
    // a click on a preview goes there - one click ahead, or two (Doc, 28.09.2026: "die großen rechts ... bitte da auch")
    [1, 2].forEach(function (k) {
      fits[k].title = k === 1 ? 'Klick: zur nächsten Folie' : 'Klick: zur übernächsten Folie';
      fits[k].addEventListener('click', function () {
        let p = { si: si, step: step };
        for (let n = 0; n < k && p; n++) p = ahead(p);
        if (!p) return;                              // "Ende" or empty: nothing ahead
        si = p.si; step = p.step; paint();
      });
    });
    // a clicked button must not keep the focus: the space bar would press it again on top of turning the page
    root.addEventListener('mousedown', function (e) { if (e.target.closest('button')) e.preventDefault(); });
    setInterval(tick, 500); tick(); showPause();
    // Fullscreen here too (Doc, 16.09.2026: "kannst Du das auch Fullscreen machen?"). Chrome allows it only
    // after a click or key IN this window - handing the right over from the beamer window is not shipped
    // (chromestatus: Fullscreen Capability Delegation, proposed) and gesture-free fullscreen needs an admin
    // policy. So the first click or key in the presenter window takes it fullscreen, and does its job as well.
    // Measured on Doc's Mac (16.09.2026): the very first click into the presenter window only activates it and
    // never reaches the page, the second one goes fullscreen - the beamer window stays fullscreen meanwhile.
    // Handing the focus over by script (popup.focus()) makes Chrome drop the beamer's fullscreen - never do that.
    let wentFull = false;
    function goFull(e) {
      if (wentFull || fsOn() || (e && e.key === 'Escape')) return;
      wentFull = true;
      const el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
      // a refusal is shown, not swallowed - Chrome's reason is the only clue on a real two-screen setup
      if (req) Promise.resolve(req.call(el)).catch(function (err) {
        wentFull = false;
        toast('Vollbild abgelehnt: ' + (err && err.message ? err.message : err));
      });
    }
    addEventListener('pointerdown', goFull, true);
    addEventListener('keydown', goFull, true);
    if (window.ResizeObserver) new ResizeObserver(fitAll).observe(root);
    else addEventListener('resize', fitAll);
    addEventListener('load', function () { ready = true; render(); });   // after KaTeX has set the formulas
    if (ready) render();
    return { render: render };
  }
  return { present: present, send: send,
           skip: function (i, on) { send({ t: 'skip', i: i, on: !!on }); } };
})();
window.DeckLink = link;

/* ————— The footer line speaks, in Doc's own voice ——————————————————————————
 * Click "Nicht verzagen, Doc Alvers fragen!" and it says itself - a voice replica of Doc
 * (Google Voice Replication, built 24.09.2026 from his own recordings).
 *
 * Two traps this walks around:
 *   .foot spans the WHOLE slide, so a plain handler would fire on every click anywhere.
 *   We measure the text's own box with a Range, exactly as placeRow() does next door.
 *   And the Audio object is kept in a variable: a bare new Audio().play() can be collected
 *   mid-play (that bit us in the recording booth on 22.09.).
 *
 * The mp3 is LOCAL ONLY for now (Doc, 24.09.2026: "ersmal nur lokal") - it is listed in
 * .git/info/exclude, so a missing file must stay harmless: no error, nothing in the console.
 */
(function () {
  var spruch = null;
  document.addEventListener('click', function (e) {
    var foot = e.target && e.target.closest && e.target.closest('.foot');
    if (!foot || !foot.textContent.trim()) return;
    var rg = document.createRange();
    rg.selectNodeContents(foot);
    var t = rg.getBoundingClientRect();
    if (e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) return;
    if (!spruch) { spruch = new Audio('../resources/doc-spruch.mp3'); spruch.preload = 'none'; }
    spruch.currentTime = 0;
    spruch.play().then(function () {
      foot.style.transition = 'opacity .18s';        // a short blink, so the click has an answer
      foot.style.opacity = '.45';
      setTimeout(function () { foot.style.opacity = ''; }, 260);
    }).catch(function () { /* file not there locally - stay silent, this is a local extra */ });
  });
})();
