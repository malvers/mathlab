// Doc Alvers Mathe-Labor - the board on the laptop: a live picture of what the board really shows. Loaded by deck.js.
//
// Doc, 02.11.2026: "wenn ich mit der Tafel, mit der Promethean verbunden bin, oder auch mit dem zweiten Bildschirm ...
// dass ich genau sehe, was auf der Tafel eigentlich abgeht. Dass es also wirklich gespiegelt wird, irgendein
// Rückstream". The presenter view copies slides, ink and labs, but a copy can drift (a pupil's taps in a lab, a video,
// an animation) - this is the real picture.
//
// On the deck:
//   t (Tafel)    the mirror on/off. Chrome asks once what to show - the board's screen (preselected) or the beamer
//                window -, then a small window floats over everything on the laptop (Document Picture-in-Picture):
//                move it, pull it bigger. Closing it, t again or Chrome's "Freigabe beenden" end it.
// Nothing leaves the machine: getDisplayMedia hands the frames to this page only. macOS asks once for screen recording
// (System Settings > Privacy > Screen Recording > Google Chrome, then Chrome starts again).
// Without the floating window (an older Chrome, or the key's click used up by the question) the picture stands in a box
// at the bottom right of this window - a click on it lets it float.

const SIZE = { width: 480, height: 270 };            // the floating window at first, 16:9 as the board
let on = false, run = 0;                             // run: a later stop() makes an answer still on its way stale
let stream = null, video = null, pip = null, box = null;

const css = document.createElement('style');
css.textContent = [
  '#spiegel{position:fixed;right:16px;bottom:16px;z-index:30;width:min(36vw,420px);aspect-ratio:16/9;background:#000;',
  '  border-radius:6px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,.35);cursor:pointer}',
  '#spiegel video{display:block;width:100%;height:100%;object-fit:contain}',
  'html.deck-edit #spiegel{display:none}'
].join('\n');
document.head.appendChild(css);

const note = t => { if (window.DeckNote) window.DeckNote(t); };

function start() {
  const md = navigator.mediaDevices;
  if (!md || !md.getDisplayMedia) { note('Rückspiegel: Dieser Browser kann keinen Bildschirm zeigen'); return; }
  on = true;
  const my = ++run;
  const opts = { video: { displaySurface: 'monitor', frameRate: 30 }, audio: false, selfBrowserSurface: 'exclude' };
  let ctl = null;                                    // the keys stay here when the beamer window is picked
  try { ctl = new CaptureController(); opts.controller = ctl; ctl.setFocusBehavior('no-focus-change'); } catch (e) { }
  // first the question, then the window: the question needs the key's click but leaves it, the window uses it up
  const asked = md.getDisplayMedia(opts);
  const dpip = window.documentPictureInPicture;
  const floated = dpip ? dpip.requestWindow(SIZE).catch(() => null) : Promise.resolve(null);
  floated.then(w => {
    if (!w) return;
    if (my !== run) { w.close(); return; }
    pip = w; dress(w);
  });
  asked.then(s => {
    try { if (ctl) ctl.setFocusBehavior('no-focus-change'); } catch (e) { }   // an older Chrome: only right here
    if (my !== run) { s.getTracks().forEach(tr => tr.stop()); return; }
    stream = s;
    s.getVideoTracks()[0].addEventListener('ended', stop);   // Chrome's own "Freigabe beenden"
    video = document.createElement('video');
    video.muted = true; video.autoplay = true; video.playsInline = true;
    video.srcObject = s;
    floated.then(w => {
      if (my !== run) return;
      if (w && !w.closed) show(w); else inBox();
    });
  }, e => {
    if (my !== run) return;
    stop();
    const msg = String(e && e.message || '');
    note(/system/i.test(msg) ? 'Rückspiegel: macOS erlaubt Chrome noch keine Bildschirmaufnahme – Systemeinstellungen › '
      + 'Datenschutz › Bildschirmaufnahme' : e && e.name === 'NotAllowedError' ? 'Rückspiegel abgebrochen'
      : 'Rückspiegel geht nicht: ' + (msg || e));
  });
}

function stop() {
  on = false; run++;
  if (stream) stream.getTracks().forEach(tr => tr.stop());
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
  if (on) stop(); else start();
});
