// A nature photo deep in the background, deeply dimmed - shared by the decks (deck.js loads this file) and
// Vorrechnen (Doc, 01.10.2026: "ein schönes Bild ... Natur ... total gedimmt ... macht das Ganze noch lebendiger",
// "im Vorrechnen-Modus ... mach das da auch mal rein"). This file only picks the picture: it sets class "natur" and
// --natur (a url) on <html>; each page's CSS decides where the picture goes and how much lies over it.
// It starts with the clouds (START); N cycles through the pictures and back to none. The choice is kept per browser under one key for decks and
// Vorrechnen, and a second window (beamer, presenter) follows at once. ?natur=3 picks one by link, ?natur=0 none.
// The pictures are CC0 from StockSnap - decks/natur/credits.json
(function () {
  if (window.NaturBild) return;
  // Three rows of seven, as the picker shows them: mountains, the sea (Doc, 04.10.2026: "noch irgendwas mit Ocean, so
  // Underwater"), and a mixed row. New pictures go to the end - the stored choice is the number, not the name.
  const PICS = [['nebelsee', 'Nebelsee'], ['schneeberge', 'Schneeberge im Nebel'], ['bergketten', 'Bergketten im Gegenlicht'],
    ['wolkenmeer', 'Berge über den Wolken'], ['wiese', 'Wiese unter Wolken'], ['bergsee', 'Bergsee'], ['spiegelung', 'Spiegelung im Bergsee'],
    ['quallen', 'Quallenschwarm'], ['qualle', 'Qualle im Blau'], ['riff', 'Fische am Riff'], ['welle', 'Brechende Welle'],
    ['lagune', 'Türkise Brandung'], ['blauestunde', 'Blaue Stunde am Strand'], ['abendmeer', 'Abendstille am Meer'],
    ['polarlicht', 'Polarlicht'], ['milchstrasse', 'Milchstraße über den Dünen'], ['duenen', 'Sanddünen'], ['lavendel', 'Lavendelfeld'],
    ['herbstberge', 'Herbstberge'], ['steilkueste', 'Wasserfall an der Steilküste'], ['gletschersee', 'Gletschersee']];
  const KEY = 'deck-natur';
  // until N is pressed: the mountains above the clouds (Doc, 01.10.2026: "Wolkenbild ... really slick", "Das machen wir so")
  const START = 4;
  const base = (document.currentScript && document.currentScript.src) || location.href;
  let n = START;                                             // 0 = none, 1..21 = PICS[n - 1]
  try { const v = localStorage.getItem(KEY); if (v !== null) n = +v || 0; } catch (e) { }   // a chosen "none" stays none
  const m = /[?&]natur=(\d+)/.exec(location.search);
  if (m) n = +m[1];

  // the page's own message box if it has one (the decks), else a small one of our own
  let box = null, boxTimer = 0;
  function note(t) {
    if (window.DeckNote) { window.DeckNote(t); return; }
    if (!box) {
      box = document.createElement('div');
      box.style.cssText = 'position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:100000;pointer-events:none;'
        + 'padding:8px 16px;border-radius:8px;background:rgba(7,22,48,.88);color:#E6ECF8;'
        + 'font:600 14px/1.3 Raleway,system-ui,sans-serif;transition:opacity .3s';
      document.body.appendChild(box);
    }
    box.textContent = t;
    box.style.opacity = '1';
    clearTimeout(boxTimer);
    boxTimer = setTimeout(() => { box.style.opacity = '0'; }, 1800);
  }
  const url = i => new URL('../decks/natur/natur-' + PICS[i - 1][0] + '.webp', base).href;
  function set(i, say) {
    n = (i >= 0 && i <= PICS.length) ? i : 0;
    const root = document.documentElement;
    root.classList.toggle('natur', n > 0);
    if (n > 0) root.style.setProperty('--natur', 'url("' + url(n) + '")');
    else root.style.removeProperty('--natur');
    if (say) note(n > 0 ? 'Natur ' + n + '/' + PICS.length + ': ' + PICS[n - 1][1] + ' (n)' : 'Natur aus (n)');
  }
  // how strongly the photo shows: --natur-mal on <html>, 1 = the host's standard, 0 = gone, 5 = five times as much.
  // Set by the slider in the picker and kept per browser; each host's CSS decides what it multiplies (svp-natur.css).
  const KEY_MAL = 'natur-mal', MAL_MAX = 5;
  let mal = 1;
  try { const v = parseFloat(localStorage.getItem(KEY_MAL)); if (v >= 0 && v <= MAL_MAX) mal = v; } catch (e) { }
  function setMal(v) {
    mal = Math.max(0, Math.min(MAL_MAX, v));
    document.documentElement.style.setProperty('--natur-mal', String(mal));
  }
  setMal(mal);
  function keep() { kept = n; try { localStorage.setItem(KEY, String(n)); } catch (err) { } }   // N while the menu is open counts too
  function next() {
    set((n + 1) % (PICS.length + 1), true);
    keep();
  }
  set(n, false);

  // A picker for the picture (Doc, 04.10.2026: "gib mir da irgendwie ein Menü, wo ich die Hintergrundbilder einstellen
  // kann") - the host page opens it, the SVP on a right click (svp-gate.js). A grid of thumbnails, seven to a row (Doc:
  // "Drei mal vier ... machen mal einundzwanzig"), "none" up in the head; pointing at a picture shows it behind the page
  // at once, leaving the menu goes back, a click keeps it. On a narrow window the grid takes fewer columns and scrolls.
  // It takes the host's colours (--panel, --line, --text, --muted, --phi, --shadow) and falls back to the decks' blue.
  let menuEl = null, kept = n;
  const HEAD = 'var(--head,rgb(230,236,248))', PHI = 'var(--phi,rgb(121,158,49))', LINE = 'var(--line,rgba(150,180,230,.25))', MUTED = 'var(--muted,rgb(150,170,200))';
  const MENU_CSS = '.natur-menu{position:fixed;z-index:10000;box-sizing:border-box;width:min(820px,calc(100vw - 16px));'
    + 'max-height:calc(100vh - 16px);overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px;'
    + 'background:var(--panel,rgb(12,30,64));color:var(--text,rgb(230,236,248));border:1px solid ' + LINE + ';'
    + 'border-radius:10px;box-shadow:0 8px 22px var(--shadow,rgba(0,0,0,.45))}'
    + '.natur-menu-head{display:flex;align-items:center;gap:10px;margin:0 2px}'
    + '.natur-menu-title{font-family:Orbitron,sans-serif;font-size:.6rem;letter-spacing:.07em;text-transform:uppercase;color:' + MUTED + '}'
    + '.natur-menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px}'
    + '.natur-menu-item{display:flex;flex-direction:column;align-items:stretch;gap:4px;background:none;border:1px solid transparent;'
    + 'border-radius:8px;color:inherit;font:inherit;font-size:.72rem;line-height:1.2;text-align:center;padding:4px;cursor:pointer}'
    + '.natur-menu-item:hover,.natur-menu-item:focus-visible{outline:none;border-color:' + PHI + ';'
    + 'background:color-mix(in srgb,' + PHI + ' 16%,transparent)}'
    + '.natur-menu-item[aria-checked="true"]{font-weight:600}'
    + '.natur-menu-thumb{display:block;width:100%;aspect-ratio:16/9;border-radius:5px;background:center/cover no-repeat;'
    + 'border:1px solid ' + LINE + ';box-sizing:border-box}'
    + '.natur-menu-item[aria-checked="true"] .natur-menu-thumb{border-color:' + PHI + ';box-shadow:0 0 0 1px ' + PHI + '}'
    + '.natur-menu-name{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:2.4em}'
    + '.natur-menu-aus{flex-direction:row;align-items:center;gap:8px;padding:3px 10px 3px 4px;font-size:.78rem}'
    + '.natur-menu-aus .natur-menu-name{min-height:0}'
    + '.natur-menu-aus .natur-menu-thumb{width:28px;height:16px;aspect-ratio:auto;background-image:linear-gradient(to top right,'
    + 'transparent calc(50% - .75px),' + MUTED + ' 50%,transparent calc(50% + .75px))}'
    + '.natur-menu-hint{font-size:.72rem;color:' + MUTED + ';margin-right:auto}'
    // the slider runs the whole width, in the page's head colour on its line colour - no green (Doc, 04.10.2026:
    // "bitte nicht so grün ... über die ganze Breite"); --p is the filled share, set from the script
    + '.natur-menu-mal{display:flex;align-items:center;gap:12px;font-size:.78rem;margin:2px 2px 0}'
    + '.natur-menu-mal input{flex:1 1 auto;min-width:0;height:18px;margin:0;background:none;-webkit-appearance:none;appearance:none;cursor:pointer}'
    + '.natur-menu-mal input::-webkit-slider-runnable-track{height:4px;border-radius:2px;'
    + 'background:linear-gradient(to right,' + HEAD + ' var(--p,20%),' + LINE + ' var(--p,20%))}'
    + '.natur-menu-mal input::-moz-range-track{height:4px;border-radius:2px;background:' + LINE + '}'
    + '.natur-menu-mal input::-moz-range-progress{height:4px;border-radius:2px;background:' + HEAD + '}'
    + '.natur-menu-mal input::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;margin-top:-6px;border-radius:50%;'
    + 'background:' + HEAD + ';border:2px solid var(--panel,rgb(12,30,64));box-shadow:0 0 0 1px ' + LINE + '}'
    + '.natur-menu-mal input::-moz-range-thumb{width:12px;height:12px;border-radius:50%;'
    + 'background:' + HEAD + ';border:2px solid var(--panel,rgb(12,30,64));box-shadow:0 0 0 1px ' + LINE + '}'
    + '.natur-menu-mal input:focus-visible{outline:none}'
    + '.natur-menu-mal input:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 3px ' + LINE + '}'
    + '.natur-menu-mal output{min-width:3.6em;text-align:right;font-variant-numeric:tabular-nums;color:' + MUTED + '}'
    + '@media print{.natur-menu{display:none}}';
  function outside(e) { if (menuEl && !menuEl.contains(e.target)) closeMenu(); }
  function onKey(e) { if (e.key === 'Escape') { closeMenu(); e.preventDefault(); } }
  function onScroll(e) { if (menuEl && !menuEl.contains(e.target)) closeMenu(); }   // the page, not the grid itself
  function closeMenu() {
    if (!menuEl) return;
    menuEl.remove();
    menuEl = null;
    if (n !== kept) set(kept, false);                // a preview nobody clicked
    removeEventListener('pointerdown', outside, true);
    removeEventListener('keydown', onKey, true);
    removeEventListener('scroll', onScroll, true);
    removeEventListener('resize', closeMenu);
    removeEventListener('blur', closeMenu);
  }
  function item(i, cls) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'natur-menu-item' + cls;
    b.setAttribute('role', 'menuitemradio');
    b.setAttribute('aria-checked', String(i === kept));
    const th = document.createElement('span');
    th.className = 'natur-menu-thumb';
    if (i) th.style.backgroundImage = 'url("' + url(i) + '")';
    const name = document.createElement('span');
    name.className = 'natur-menu-name';
    name.textContent = i ? PICS[i - 1][1] : 'Kein Bild';
    if (i) b.title = PICS[i - 1][1];
    b.append(th, name);
    b.addEventListener('pointerenter', () => set(i, false));
    b.addEventListener('pointerleave', () => set(kept, false));   // on the way to the slider the preview goes back
    b.addEventListener('focus', () => set(i, false));
    b.addEventListener('click', e => { e.stopPropagation(); set(i, false); keep(); closeMenu(); });
    return b;
  }
  // the transparency slider at the foot (Doc, 04.10.2026): it moves the photo live and keeps the value at once;
  // a double click goes back to the standard
  function slider() {
    const lab = document.createElement('label');
    lab.className = 'natur-menu-mal';
    const txt = document.createElement('span');
    txt.textContent = 'Transparenz';
    const r = document.createElement('input');
    r.type = 'range';
    r.min = '0';
    r.max = String(MAL_MAX * 100);
    r.step = '10';
    r.value = String(Math.round(mal * 100));
    r.title = 'Doppelklick: Standard (100 %)';
    const out = document.createElement('output');
    const show = () => { out.textContent = Math.round(mal * 100) + ' %'; r.style.setProperty('--p', (mal / MAL_MAX * 100) + '%'); };
    const save = () => { try { localStorage.setItem(KEY_MAL, String(mal)); } catch (err) { } };
    r.addEventListener('input', () => { setMal(+r.value / 100); show(); });
    r.addEventListener('change', save);
    r.addEventListener('dblclick', () => { setMal(1); r.value = '100'; show(); save(); });
    show();
    lab.append(txt, r, out);
    return lab;
  }
  function menu(x, y) {
    closeMenu();
    if (!document.getElementById('natur-menu-css')) {
      const st = document.createElement('style');
      st.id = 'natur-menu-css';
      st.textContent = MENU_CSS;
      document.head.appendChild(st);
    }
    kept = n;
    const m = document.createElement('div');
    m.className = 'natur-menu';
    m.setAttribute('role', 'menu');
    const head = document.createElement('div');
    head.className = 'natur-menu-head';
    const title = document.createElement('span');
    title.className = 'natur-menu-title';
    title.textContent = 'Hintergrund';
    const hint = document.createElement('span');
    hint.className = 'natur-menu-hint';
    hint.textContent = '· Taste N: das nächste Bild';
    head.append(title, hint, item(0, ' natur-menu-aus'));
    const grid = document.createElement('div');
    grid.className = 'natur-menu-grid';
    for (let i = 1; i <= PICS.length; i++) grid.appendChild(item(i, ''));
    m.append(head, grid, slider());
    m.addEventListener('pointerleave', () => set(kept, false));
    document.body.appendChild(m);
    const r = m.getBoundingClientRect();                     // never off screen
    m.style.left = Math.max(8, Math.min(x, innerWidth - r.width - 8)) + 'px';
    m.style.top = Math.max(8, Math.min(y, innerHeight - r.height - 8)) + 'px';
    menuEl = m;
    addEventListener('pointerdown', outside, true);
    addEventListener('keydown', onKey, true);
    addEventListener('scroll', onScroll, true);
    addEventListener('resize', closeMenu);
    addEventListener('blur', closeMenu);
  }
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (e.key !== 'n' && e.key !== 'N') return;
    const f = e.target;
    if (f && (f.isContentEditable || (f.closest && f.closest('#ask, #linkgo, input, textarea, select')))) return;   // typing
    next();
    e.preventDefault();
  });
  addEventListener('storage', e => {                         // the other window pressed N or moved the slider
    if (e.key === KEY) { set(+e.newValue || 0, false); kept = n; }
    if (e.key === KEY_MAL) setMal(parseFloat(e.newValue) >= 0 ? parseFloat(e.newValue) : 1);
  });
  window.NaturBild = { next, set: i => set(i, false), get: () => n, menu, mal: v => setMal(v), PICS };
})();
