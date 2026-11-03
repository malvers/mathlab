// Doc Alvers Mathe-Labor - the board on the laptop: a live picture of what the board really shows. Loaded by deck.js.
//
// Doc, 02.11.2026: "wenn ich mit der Tafel, mit der Promethean verbunden bin, oder auch mit dem zweiten Bildschirm ...
// dass ich genau sehe, was auf der Tafel eigentlich abgeht. Dass es also wirklich gespiegelt wird, irgendein
// Rückstream". The presenter view copies slides, ink and labs, but a copy can drift (a pupil's taps in a lab, a video,
// an animation) - this is the real picture.
//
// On the deck:
//   t (Tafel)    the mirror. Chrome asks once what to show - the board's screen (preselected) or the beamer window.
//                Starting the show (f, two screens) asks by itself before it goes on - then the question costs
//                nothing - and t in the normal view does the same by hand. Once the show runs, the picture
//                stands in the presenter view where the slide after next was, captioned "Tafel live"
//                (Doc, 03.11.2026: "ich will ja mein Presenter-Modus behalten ... dahin, wo übernächste Folie ist").
//                In the presenter view t switches between the board and the slide after next, without a new question.
//                Pressed in the show with no picture yet, Chrome asks then - and its question takes the beamer's
//                fullscreen (measured 03.11.2026: 58 ms after the question). The show goes on; the presenter's next
//                key hands the fullscreen back (capability delegation), else a tap on the deck on the board does.
//                In the normal view t asks and keeps the picture ready, with no window of its own; t again or
//                Chrome's "Freigabe beenden" end it.
// Nothing leaves the machine: getDisplayMedia hands the frames to this page only. macOS asks once for screen recording
// (System Settings > Privacy > Screen Recording > Google Chrome, then Chrome starts again).
// The floating window (Document Picture-in-Picture) and the box at the bottom right below are no longer called by t
// since 03.11.2026 - they stay until Doc says they may go.

const PRES = /[?&]presenter(&|=|$)/.test(location.search);   // the presenter view on the laptop (as deck.js)
const SIZE = { width: 480, height: 270 };            // the floating window at first, 16:9 as the board
let on = false, run = 0;                             // run: a later stop() makes an answer still on its way stale
let stream = null, video = null, pip = null, box = null;
let slot = null, watch = null;                       // the presenter's slot of the slide after next, while it shows the board
let fitTitle = '';                                   // its own hover text ("Klick: zur übernächsten Folie"), back on stop
// Chrome drops a fullscreen for its question - that drop must not end the show (deck.js asks here, in both windows).
// Its event can come seconds late, so no time window: the next drop is Chrome's, unless the question is over and the
// fullscreen still stands. lost: the beamer lost its fullscreen that way and waits for it back.
let drop = false, lost = false;
window.DeckSpiegel = {
  dropped: () => { const d = drop; drop = false; if (d && !PRES) lost = true; return d; },
  // the beamer, called from the presenter view around its question
  arm: () => { drop = !!document.fullscreenElement; },
  settle: () => {                                    // the question is over - did the board keep its fullscreen?
    if (document.fullscreenElement) drop = false;
    else if (drop) lost = true;                      // dropped, its event still on the way
    return !lost;
  },
  stream: () => stream && stream.active ? stream : null,   // the picture asked for before the show
  boardWaits: () => PRES ? !!(beam() && beam().boardWaits()) : lost,
  // the show's start asks by itself (deck.js present()), once per tab: not again after a "no" or a t that ended it
  // (Doc, 03.11.2026: "ich habe nur Angst, dass ich vergesse T zu drücken")
  wanted: () => !PRES && !on && !declined && !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia),
  ask: () => start()                                 // resolves once Chrome's question is over
};
let declined = false;

const css = document.createElement('style');
css.textContent = [
  '#spiegel{position:fixed;right:16px;bottom:16px;z-index:30;width:min(36vw,420px);aspect-ratio:16/9;background:#000;',
  '  border-radius:6px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.35);cursor:pointer}',
  '#spiegel video{display:block;width:100%;height:100%;object-fit:contain}',
  'html.deck-edit #spiegel{display:none}',
  // the presenter view: the picture over the slide after next, its caption reads "Tafel live" (same place, same size)
  '#pres .p-frame > video.tafel{position:absolute;inset:0;z-index:1;width:100%;height:100%;object-fit:contain;',
  '  background:#000}',
  '#pres .p-after.tafel .p-fit{cursor:default}',
  '#pres .p-after.tafel .p-cap{position:relative;color:transparent}',
  "#pres .p-after.tafel .p-cap::after{content:'Tafel live';position:absolute;inset:0;color:#B8C6DF}"
].join('\n');
document.head.appendChild(css);

const note = t => { if (window.DeckNote) window.DeckNote(t); };
const LOST = 'Die Tafel hat das Vollbild verloren – die nächste Taste hier holt es zurück';

// the beamer window's mirror, seen from the presenter view (it opened this window)
function beam() {
  try { const o = window.opener; return o && !o.closed && o.DeckSpiegel || null; } catch (e) { return null; }
}
// a picture that still runs: this window's own, or in the presenter view the one asked for before the show
function live() {
  if (stream && stream.active) return stream;
  const b = PRES && beam();
  return b && b.stream() || null;
}
function picture(s) {
  video = document.createElement('video');
  video.muted = true; video.autoplay = true; video.playsInline = true;
  video.srcObject = s;
}

function start() {
  const md = navigator.mediaDevices;
  if (!md || !md.getDisplayMedia) {
    note('Rückspiegel: Dieser Browser kann keinen Bildschirm zeigen');
    return Promise.resolve();
  }
  on = true;
  const my = ++run;
  const opts = { video: { displaySurface: 'monitor', frameRate: 30 }, audio: false, selfBrowserSurface: 'exclude' };
  let ctl = null;                                    // the keys stay here when the beamer window is picked
  try { ctl = new CaptureController(); opts.controller = ctl; ctl.setFocusBehavior('no-focus-change'); } catch (e) { }
  // first the question, then the window: the question needs the key's click but leaves it, the window uses it up
  const b = PRES ? beam() : null;
  if (b) b.arm();
  drop = !!document.fullscreenElement;
  const asked = md.getDisplayMedia(opts);
  const settled = () => {
    if (document.fullscreenElement) drop = false;
    if (b && !b.settle()) note(LOST);
  };
  asked.then(settled, settled);
  const after = PRES && document.querySelector('#pres .p-after');   // the presenter view: the slot
  asked.then(s => {
    try { if (ctl) ctl.setFocusBehavior('no-focus-change'); } catch (e) { }   // an older Chrome: only right here
    if (my !== run) { s.getTracks().forEach(tr => tr.stop()); return; }
    stream = s;
    s.getVideoTracks()[0].addEventListener('ended', stop);   // Chrome's own "Freigabe beenden"
    picture(s);
    if (after) { inSlot(after); return; }
    // the normal view: no window of its own (Doc, 03.11.2026: "am Anfang gab es ein Extrafenster") - the picture
    // waits for the show, its presenter view takes it
    note('Tafelbild bereit – in der Referentenansicht rechts unten');
  }, e => {
    if (my !== run) return;
    stop();
    declined = true;
    const msg = String(e && e.message || '');
    note(/system/i.test(msg) ? 'Rückspiegel: macOS erlaubt Chrome noch keine Bildschirmaufnahme – Systemeinstellungen › '
      + 'Datenschutz › Bildschirmaufnahme' : e && e.name === 'NotAllowedError' ? 'Rückspiegel abgebrochen'
      : 'Rückspiegel geht nicht: ' + (msg || e));
  });
  return asked.then(() => { }, () => { });
}

function stop() {
  on = false; run++;
  if (stream) stream.getTracks().forEach(tr => tr.stop());
  unslot();
  if (video) video.remove();
  stream = null; video = null;
  if (pip) { const w = pip; pip = null; w.close(); }
  if (box) { box.remove(); box = null; }
}

// the floating window: black, the picture as large as it fits; a key pressed there works the deck as here
function dress(w) {
  const d = w.document;
  d.title = 'Tafel';
  document.querySelectorAll('link[href*="fonts.googleapis"]').forEach(l => d.head.appendChild(l.cloneNode()));
  const st = d.createElement('style');
  st.textContent = 'html,body{margin:0;height:100%;background:#000;overflow:hidden}'
    + 'video{display:block;width:100%;height:100%;object-fit:contain}'
    + 'p{margin:0;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;'
    + 'padding:16px;color:#E6ECF8;font:400 15px/1.6 Orbitron,system-ui,sans-serif}';
  d.head.appendChild(st);
  d.body.innerHTML = '<p>Was zeigt die Tafel?<br>Bildschirm oder Fenster wählen</p>';
  ['keydown', 'keyup'].forEach(type => d.addEventListener(type, e => {
    document.body.dispatchEvent(new KeyboardEvent(type, { key: e.key, code: e.code, shiftKey: e.shiftKey,
      metaKey: e.metaKey, ctrlKey: e.ctrlKey, altKey: e.altKey, repeat: e.repeat, bubbles: true, cancelable: true }));
  }));
  w.addEventListener('pagehide', () => { if (pip === w) { pip = null; stop(); } });
}
function show(w) {
  w.document.body.replaceChildren(video);
  video.play().catch(() => { });
}
// the picture asked for earlier floats again (t in the normal view after a show)
function float() {
  const dpip = window.documentPictureInPicture;
  if (!dpip) { inBox(); return; }
  const my = run;
  dpip.requestWindow(SIZE).then(w => {
    if (my !== run) { w.close(); return; }
    pip = w; dress(w); show(w);
  }, () => { if (my === run) inBox(); });
}

// the presenter view: the picture over the slide after next. Every page turn paints that frame anew, so the picture
// goes back on top each time; a click on it stays here instead of going to the slide after next.
function inSlot(s) {
  const frame = s.querySelector('.p-frame');
  video.className = 'tafel';
  video.title = 'Tafel live – t: wieder die übernächste Folie';
  const keep = () => {
    if (!video || frame.contains(video)) return;
    frame.appendChild(video);
    video.play().catch(() => { });
  };
  watch = new MutationObserver(keep);
  watch.observe(frame, { childList: true });
  slot = s;
  const fit = s.querySelector('.p-fit');             // the whole slot is wider than the picture - its hover text too
  fitTitle = fit.title; fit.title = video.title;
  s.classList.add('tafel');
  s.addEventListener('click', hold, true);
  keep();
}
function hold(e) { e.stopPropagation(); }
function unslot() {                                  // the slide after next is still underneath
  if (watch) { watch.disconnect(); watch = null; }
  if (!slot) return;
  slot.classList.remove('tafel'); slot.removeEventListener('click', hold, true);
  slot.querySelector('.p-fit').title = fitTitle;
  slot = null;
  if (video) video.remove();
}
// presenter view: the picture that still runs into the slot - without a question
function slotIn(s) {
  const after = document.querySelector('#pres .p-after');
  if (!after || slot) return;
  on = true;
  if (!video || video.srcObject !== s) picture(s);
  if (s !== stream) s.getVideoTracks()[0].addEventListener('ended', hide);   // the beamer's picture ended
  inSlot(after);
}
function hide() { on = false; unslot(); }            // presenter view: t again - the picture keeps running

function inBox() {
  box = document.createElement('div');
  box.id = 'spiegel';
  box.title = 'Tafel – Klick: als eigenes Fenster';
  box.appendChild(video);
  document.body.appendChild(box);
  video.play().catch(() => { });
  box.addEventListener('click', e => {
    e.stopPropagation();                             // never a page turn
    const dpip = window.documentPictureInPicture;
    if (!dpip || pip) return;
    const my = run;
    dpip.requestWindow(SIZE).then(w => {
      if (my !== run) { w.close(); return; }
      pip = w; dress(w); show(w);
      if (box) { box.remove(); box = null; }
    }).catch(() => { });
  });
}

addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || (e.key !== 't' && e.key !== 'T')) return;
  const t = e.target;
  if (t && t.closest && t.closest('input, textarea, select, [contenteditable], #ask, #ink-card, #linkgo')) return;
  if (document.documentElement.classList.contains('deck-edit')) return;
  e.preventDefault();
  if (PRES) {
    if (slot) hide();
    else { const s = live(); if (s) slotIn(s); else start(); }
    return;
  }
  if (on) { stop(); declined = true; note('Rückspiegel aus'); } else start();
});

if (PRES) {
  // the picture asked for before the show goes straight into the presenter view, once that is built
  let tries = 0;
  const early = () => {
    const b = beam(), s = b && b.stream();
    if (!s || slot) return;
    if (!document.querySelector('#pres .p-after')) { if (++tries < 50) setTimeout(early, 100); return; }
    slotIn(s);
  };
  early();
  // the board waits for its fullscreen: the next key or tap here hands it over (the beamer may not take it itself
  // without a tap of its own; Chrome lets a window delegate its click with postMessage). t keeps its own job.
  ['keydown', 'pointerdown'].forEach(type => addEventListener(type, e => {
    if (e.key === 't' || e.key === 'T') return;
    const b = beam();
    if (!b || !b.boardWaits()) return;
    try {
      window.opener.postMessage({ spiegel: 'voll' }, { targetOrigin: location.origin, delegate: 'fullscreen' });
    } catch (err) { note('Tafel ohne Vollbild – einmal auf die Tafel ins Deck tippen'); }
  }, true));
} else {
  // the show begins: the picture moves to the presenter view (it takes it from here), the board shows only the deck
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) return;
    lost = false;
    if (pip) { const w = pip; pip = null; w.close(); }
    if (box) { box.remove(); box = null; }
  });
  addEventListener('message', e => {
    if (e.origin === location.origin && e.data && e.data.spiegel === 'voll') refull(e.source);
  });
  addEventListener('pointerdown', () => {            // a tap on the board does it too - and turns no page
    if (!lost) return;
    refull(null);
    addEventListener('click', e => { e.stopPropagation(); e.preventDefault(); }, { capture: true, once: true });
  }, true);
}
// beamer: back into fullscreen on the board's screen - leaving it, Chrome put the window back where it was before
async function refull(src) {
  if (!lost || document.fullscreenElement) return;
  let screen;
  try {
    const sd = await window.getScreenDetails();
    const lap = sd.screens.filter(x => x.isInternal)[0] || sd.currentScreen;
    screen = sd.screens.filter(x => x !== lap)[0];
  } catch (e) { }
  try {
    await document.documentElement.requestFullscreen(screen ? { screen } : undefined);
    lost = false;
  } catch (e) {
    if (src && src.DeckNote) src.DeckNote('Tafel ohne Vollbild – einmal auf die Tafel ins Deck tippen');
  }
}
