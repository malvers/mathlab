// A nature photo deep in the background, deeply dimmed - shared by the decks (deck.js loads this file) and
// Vorrechnen (Doc, 01.10.2026: "ein schönes Bild ... Natur ... total gedimmt ... macht das Ganze noch lebendiger",
// "im Vorrechnen-Modus ... mach das da auch mal rein"). This file only picks the picture: it sets class "natur" and
// --natur (a url) on <html>; each page's CSS decides where the picture goes and how much lies over it.
// N cycles through the pictures and back to none. The choice is kept per browser under one key for decks and
// Vorrechnen, and a second window (beamer, presenter) follows at once. ?natur=3 picks one by link, ?natur=0 none.
// The pictures are CC0 from StockSnap - decks/natur/credits.json
(function () {
  if (window.NaturBild) return;
  const PICS = [['nebelsee', 'Nebelsee'], ['schneeberge', 'Schneeberge im Nebel'], ['bergketten', 'Bergketten im Gegenlicht'],
    ['wolkenmeer', 'Berge über den Wolken'], ['wiese', 'Wiese unter Wolken'], ['bergsee', 'Bergsee'], ['spiegelung', 'Spiegelung im Bergsee']];
  const KEY = 'deck-natur';
  const base = (document.currentScript && document.currentScript.src) || location.href;
  let n = 0;                                                 // 0 = none, 1..7 = PICS[n - 1]
  try { n = +localStorage.getItem(KEY) || 0; } catch (e) { }
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
  function set(i, say) {
    n = (i >= 0 && i <= PICS.length) ? i : 0;
    const root = document.documentElement;
    root.classList.toggle('natur', n > 0);
    if (n > 0) root.style.setProperty('--natur', 'url("' + new URL('../decks/natur/natur-' + PICS[n - 1][0] + '.webp', base).href + '")');
    else root.style.removeProperty('--natur');
    if (say) note(n > 0 ? 'Natur ' + n + '/' + PICS.length + ': ' + PICS[n - 1][1] + ' (n)' : 'Natur aus (n)');
  }
  function next() {
    set((n + 1) % (PICS.length + 1), true);
    try { localStorage.setItem(KEY, String(n)); } catch (err) { }
  }
  set(n, false);
  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
    if (e.key !== 'n' && e.key !== 'N') return;
    const f = e.target;
    if (f && (f.isContentEditable || (f.closest && f.closest('#ask, #linkgo, input, textarea, select')))) return;   // typing
    next();
    e.preventDefault();
  });
  addEventListener('storage', e => { if (e.key === KEY) set(+e.newValue || 0, false); });   // the other window pressed N
  window.NaturBild = { next, set: i => set(i, false), get: () => n, PICS };
})();
