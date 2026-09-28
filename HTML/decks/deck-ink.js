// Doc Alvers Mathe-Labor - the pen in the decks: ink on the slides, and a tablet as a remote pen. Loaded by deck.js.
//
// Doc, 27.09.2026: "wenn ich die Decks vorführe, dass ich da irgendwie direkt wenigstens kleine Dinge reinschreiben
// kann ... einen Stiftmodus ... auf dem Mac habe ich ja kein Touchscreen ... Ich habe das Lenovo. Wenn man das
// irgendwie hinkriegen könnte, wäre das natürlich super."
//
// On the deck:
//   s, or the pen in the HUD    pen on/off - mouse, trackpad, finger or pen. While it is on, a click writes instead of
//                               turning the page; arrows, space and the footer triangles still turn.
//   z / c (pen on)              the last stroke on this slide back / the slide wiped
//   the bar at the left         colours, back, wipe, the tablet, pen off
// Ink stays on its slide until it is wiped (over a reload too, per tab) and shows in the beamer window and the
// presenter view alike: written on the presenter's current slide, it appears on the beamer (BroadcastChannel).
//
// The tablet (Doc's Lenovo): the tablet button shows a QR - the same deck on docalvers.de with ?stift=<code>. The
// tablet follows this machine's slides, into another deck as well, and what is written on it appears here, over
// Supabase Realtime Broadcast: no table, nothing stored (measured 27.09.2026: 20 of 20 messages, 35-40 ms). Its
// triangles turn the slides on the beamer. The code stays on both devices, so pairing is once: later a deck opened
// with ?stift on the tablet finds this machine by itself.
//
// Every message is idempotent (a stroke has an id, points carry their index): the beamer may hear a stroke twice,
// over the channel and over the net, and draws it once.

const W = 960, H = 540;                              // a slide in design px - the ink lives in these
const DB_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
const DB_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';     // publishable (public by design), as js/buzzer.js
const SITE = 'https://www.docalvers.de';             // a tablet cannot reach this machine's localhost
const COLORS = ['#B02418', '#0E244E', '#799E31', '#F5C242'];         // Doc's red, dark blue, green, orange (deck.css)
const NAMES = ['Rot', 'Dunkelblau', 'Grün', 'Orange'];
const WIDTH = 2.6;                                   // line width in slide px
const KEY_CODE = 'deck-ink-code', KEY_COLOR = 'deck-ink-color';
const NS = 'http://www.w3.org/2000/svg';

const params = new URLSearchParams(location.search);
const REMOTE = params.has('stift');                  // this page is the tablet
const DECK = location.pathname.replace(/\.html$/, '');
const DIR = DECK.replace(/[^/]*$/, '');
const HERE = new URL('.', import.meta.url).href;     // the decks folder
const STORE = 'deck-ink:' + DECK + (PRESENTER ? ':presenter' : '');
const me = Math.random().toString(36).slice(2);

const lies = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
const schreib = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private window: this page keeps it */ } };
const r1 = v => Math.round(v * 10) / 10;
const icon = body => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"'
  + ' stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
// a pen over a written line - the plain pencil bottom left is the text editor's (E)
const PEN = '<path d="M9.5 15.5l-3.3.8.8-3.3 8.6-8.6a1.8 1.8 0 0 1 2.5 2.5z"/><path d="M3 20.5c1.6-1.3 3.2-1.3 4.8 0s3.2 1.3 4.8 0 3.2-1.3 4.8 0"/>';
const UNDO = '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>';
const WIPE = '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>';
const TABLET = '<rect x="4" y="2.5" width="16" height="19" rx="2.2"/><path d="M11 18.5h2"/>';
const CLOSE = '<path d="M6 6l12 12M18 6L6 18"/>';
const PREV = '<path d="M16 5L7 12L16 19Z" fill="currentColor" stroke="none"/>';
const NEXT = '<path d="M8 5L17 12L8 19Z" fill="currentColor" stroke="none"/>';

// ---- the ink: slide index -> strokes {id, c, w, p: [x0, y0, x1, y1, ...]} in slide px ---------------------------
// what comes from outside (the net, the store) is checked before it is drawn: numbers only, strokes only
const nums = a => Array.isArray(a) ? a.filter(v => typeof v === 'number' && isFinite(v)) : [];
function clean(o) {
  const out = {};
  if (!o || typeof o !== 'object') return out;
  Object.keys(o).forEach(function (k) {
    const n = parseInt(k, 10);
    if (String(n) !== k || n < 0 || !Array.isArray(o[k])) return;
    out[n] = o[k].filter(st => st && typeof st.id === 'string' && Array.isArray(st.p))
                 .map(st => ({ id: st.id, c: st.c | 0, w: +st.w || WIDTH, p: nums(st.p) }));
  });
  return out;
}
let ink = {};
try { ink = clean(JSON.parse(sessionStorage.getItem(STORE))); } catch (e) { ink = {}; }
let saveT = 0;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(function () { try { sessionStorage.setItem(STORE, JSON.stringify(ink)); } catch (e) { } }, 300);
}
const find = (s, id) => (ink[s] || []).find(x => x.id === id);

const css = document.createElement('style');
css.textContent = [
  '#ink{position:fixed;left:0;top:0;width:0;height:0;z-index:8;pointer-events:none;overflow:visible;touch-action:none}',
  'html.presenter #ink{z-index:10}',                 // over the presenter view (#pres is 8)
  'html.ink-pen #ink{pointer-events:auto;cursor:crosshair}',
  '#ink path{fill:none;stroke-linecap:round;stroke-linejoin:round}',
  '#ink-bar{position:fixed;left:8px;top:30%;z-index:12;display:none;flex-direction:column;align-items:center;gap:4px;',
  '  padding:6px;border-radius:14px;background:rgba(14,36,78,.9);box-shadow:0 4px 18px rgba(0,0,0,.28);touch-action:none}',
  'html.ink-pen #ink-bar{display:flex}',
  'html.deck-edit #ink,html.deck-edit #ink-bar{display:none}',
  '#ink-bar button{all:unset;box-sizing:border-box;width:40px;height:40px;border-radius:10px;display:grid;',
  '  place-items:center;color:#E6ECF8;cursor:pointer;position:relative}',
  'html.ink-remote #ink-bar button{width:46px;height:46px}',
  '#ink-bar button:hover{background:rgba(126,143,181,.35)}',
  '#ink-bar button svg{width:24px;height:24px;display:block}',
  '#ink-bar .dot i{width:20px;height:20px;border-radius:50%;box-shadow:0 0 0 2px rgba(230,236,248,.22)}',
  '#ink-bar .dot[aria-pressed="true"] i{box-shadow:0 0 0 2px rgba(14,36,78,.9),0 0 0 4.5px #E6ECF8}',
  '#ink-bar hr{width:26px;border:0;border-top:1px solid rgba(230,236,248,.25);margin:3px 0}',
  '#ink-bar .net{width:12px;height:12px;border-radius:50%;margin:6px 0 4px;background:#F5C242}',
  '#ink-bar .net[data-s="ok"]{background:#799E31}#ink-bar .net[data-s="off"]{background:#B02418}',
  '#ink-bar .tab.linked::after{content:"";position:absolute;right:5px;top:5px;width:8px;height:8px;border-radius:50%;',
  '  background:#799E31}',
  '#hud #penbtn[aria-pressed="true"]{color:#F5C242}',
  'html.ink-remote #ask,html.ink-remote #play{display:none!important}',
  '#ink-card{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:rgba(7,22,48,.72);',
  '  font-family:Orbitron,sans-serif}',
  '#ink-card .box{display:flex;flex-direction:column;align-items:center;gap:16px;max-width:min(92vw,520px);',
  '  padding:26px 28px;border-radius:18px;background:#0E244E;color:#E6ECF8;text-align:center;',
  '  box-shadow:0 10px 40px rgba(0,0,0,.4)}',
  '#ink-card h2{margin:0;font-size:clamp(1rem,2.4vw,1.35rem);letter-spacing:.08em;font-weight:600}',
  '#ink-card .qr{width:min(46vh,70vw,320px);aspect-ratio:1;background:#fff;padding:12px;border-radius:12px;',
  '  box-sizing:border-box}',
  '#ink-card .qr svg{width:100%;height:100%;display:block}',
  '#ink-card .code{font-size:clamp(1.5rem,5vw,2.4rem);letter-spacing:.3em;color:#F5C242}',
  '#ink-card p{margin:0;font-size:.78rem;line-height:1.6;letter-spacing:.03em;color:#AEBBD6}',
  '#ink-card .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}',
  '#ink-card button{font:600 .8rem Orbitron,sans-serif;letter-spacing:.06em;padding:10px 18px;border-radius:10px;',
  '  border:1px solid rgba(230,236,248,.3);background:transparent;color:#E6ECF8;cursor:pointer}',
  '#ink-card button.go{background:#F5C242;border-color:#F5C242;color:#0E244E}',
  '#ink-card label{font-size:.8rem;letter-spacing:.06em}',
  '#ink-card input{font:600 1.6rem Orbitron,sans-serif;letter-spacing:.3em;text-align:center;width:9ch;',
  '  padding:8px 10px;border-radius:10px;border:1px solid rgba(230,236,248,.35);background:#071630;color:#F5C242}',
  '@media print{#ink,#ink-bar,#ink-card{display:none!important}}'
].join('\n');
document.head.appendChild(css);

// ---- drawing it: an SVG over the slide, in slide px - sharp at any size -------------------------------------------
const svg = document.createElementNS(NS, 'svg');
svg.id = 'ink';
svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
svg.setAttribute('preserveAspectRatio', 'none');
svg.setAttribute('aria-hidden', 'true');
document.body.appendChild(svg);

// the slide on screen: the deck itself, or in the presenter view the preview of the current slide (as the laser)
function stage() {
  if (!PRESENTER) return deck.getBoundingClientRect();
  const f = document.querySelector('#pres .p-cur .p-frame');
  return f && f.getBoundingClientRect();
}
let placed = '';
function place() {
  const r = stage();
  if (!r || !r.width) { svg.style.visibility = 'hidden'; placed = ''; return; }
  const key = [r.left, r.top, r.width, r.height].map(Math.round).join(',');
  if (key === placed) return;
  placed = key;
  svg.style.visibility = '';
  svg.style.left = r.left + 'px'; svg.style.top = r.top + 'px';
  svg.style.width = r.width + 'px'; svg.style.height = r.height + 'px';
  placeBar(r);
}

function dOf(p) {
  if (p.length < 4) return 'M' + p[0] + ' ' + p[1] + 'h0.01';   // a dot
  let s = 'M' + p[0] + ' ' + p[1];
  for (let i = 2; i < p.length - 2; i += 2) {        // through the midpoints: smooth without leaving the hand's line
    s += 'Q' + p[i] + ' ' + p[i + 1] + ' ' + r1((p[i] + p[i + 2]) / 2) + ' ' + r1((p[i + 1] + p[i + 3]) / 2);
  }
  return s + 'L' + p[p.length - 2] + ' ' + p[p.length - 1];
}
let shownSlide = -1;
const paths = new Map();                             // stroke id -> its path, for the slide on screen
function drawStroke(st) {
  if (!st.p.length) return;
  let el = paths.get(st.id);
  if (!el) {
    el = document.createElementNS(NS, 'path');
    el.setAttribute('stroke', COLORS[st.c] || COLORS[0]);
    el.setAttribute('stroke-width', st.w || WIDTH);
    svg.appendChild(el);
    paths.set(st.id, el);
  }
  el.setAttribute('d', dOf(st.p));
}
function render() {
  if (shownSlide !== si) { shownSlide = si; paths.forEach(el => el.remove()); paths.clear(); }
  const list = ink[si] || [], ids = new Set(list.map(x => x.id));
  paths.forEach((el, id) => { if (!ids.has(id)) { el.remove(); paths.delete(id); } });
  list.forEach(drawStroke);
}

// one change, from here or from another window - applied the same way everywhere, and harmless twice
function applyInk(m) {
  const s = m.s | 0;
  let st = null;
  if (m.op === 'start' || m.op === 'pts' || m.op === 'end') {
    const p = nums(m.p);
    if (typeof m.id !== 'string' || !p.length) return;
    st = find(s, m.id);
    if (!st) { st = { id: m.id, c: m.c | 0, w: +m.w || WIDTH, p: [] }; (ink[s] = ink[s] || []).push(st); }
    if (m.op === 'end') st.p = p;
    else if (m.op === 'start') { if (!st.p.length) st.p = p; }
    else {                                           // points from index i on: only what is new counts
      const i = m.i | 0, n = st.p.length;
      if (i >= n) st.p = st.p.concat(p);
      else if (i + p.length > n) st.p = st.p.concat(p.slice(n - i));
    }
  } else if (m.op === 'undo') {
    ink[s] = (ink[s] || []).filter(x => x.id !== m.id);
  } else if (m.op === 'clear') {
    const gone = new Set(m.ids || []);
    ink[s] = (ink[s] || []).filter(x => !gone.has(x.id));
  } else return;
  if (s === si) { if (st) drawStroke(st); else render(); }
  save();
}

// ---- the two ways out: this machine's windows (BroadcastChannel) and the tablet (Supabase) -----------------------
let chan = null, net = null, netUp = false, sb = null, netCode = '';
try { chan = new BroadcastChannel('deck-ink:' + DECK); chan.onmessage = function (e) { receive(e.data); }; } catch (e) { }
function send(m) {
  m.from = me; m.deck = DECK;
  if (chan) try { chan.postMessage(m); } catch (e) { }
  if (net && netUp) try { Promise.resolve(net.send({ type: 'broadcast', event: 'm', payload: m })).catch(function () { }); } catch (e) { }
}
function op(m) { m.t = 'ink'; applyInk(m); send(m); }

// ---- labs live on the tablet (Doc, 28.09.2026: "wenn auch auf dem gespiegelten Lenovo die Labs live zu sehen
// wären ... geht?" - "ja"). deck.js watches every lab a hand works in - the presenter's live slide or the deck window's
// own - and hands each input here (DeckLabTap). It goes to the tablet only, bundled every 40 ms like the pen's points;
// the tablet keeps its labs live and plays the input again on its own copy (DeckLabMirror.replay). The lab has the
// same inner size everywhere (the frame is scaled, not resized), so a press lands on the same spot. Limits as between
// presenter and beamer: the tablet's lab starts fresh when its page loads - "Labor zuruecksetzen" puts both in step.
const LAB_TYPES = new Set(['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'mousedown', 'mousemove',
  'mouseup', 'click', 'dblclick', 'wheel', 'keydown', 'keyup', 'input', 'change', 'scroll']);
let labQ = [], labT = 0;
window.DeckLabTap = function (m) {
  if (REMOTE || !net || !netUp) return;
  labQ.push(Object.assign({}, m));
  if (labT) return;
  labT = setTimeout(function () {
    labT = 0;
    const evs = labQ; labQ = [];
    if (!evs.length || !net || !netUp) return;
    const out = { t: 'lab', evs: evs, from: me, deck: DECK };
    try { Promise.resolve(net.send({ type: 'broadcast', event: 'm', payload: out })).catch(function () { }); } catch (e) { }
  }, 40);
};
// what comes in is a replay order for one of the tablet's own labs - checked field by field before it runs
function labOk(e) {
  return e && typeof e === 'object' && LAB_TYPES.has(e.type) && Number.isInteger(e.si) && Number.isInteger(e.k)
    && e.si >= 0 && e.si < slides.length && e.k >= 0 && e.k < 8;
}

function loadScript(src) {
  return new Promise(function (ok, no) {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = function () { no(new Error(src)); };
    document.head.appendChild(s);
  });
}
async function connect(code) {
  if (!code || code === netCode) return;
  netCode = code;
  setNet('wait');
  try {
    if (!window.supabase) await loadScript(HERE + '../js/vendor/supabase.min.js');
    if (!sb) sb = window.supabase.createClient(DB_URL, DB_KEY, { auth: { persistSession: false } });
    if (net) { sb.removeChannel(net); net = null; netUp = false; }
    const ch = sb.channel('deck-ink:' + code, { config: { broadcast: { self: false } } });
    ch.on('broadcast', { event: 'm' }, function (p) { receive(p && p.payload); });
    net = ch;
    ch.subscribe(function (status) {
      if (ch !== net) return;
      netUp = status === 'SUBSCRIBED';
      if (!netUp) { setNet(status === 'CLOSED' ? 'wait' : 'off'); return; }
      if (REMOTE) { setNet('wait'); hello(); }
      else if (document.visibilityState === 'visible') announce(true);
    });
  } catch (e) { setNet('off'); }
}

let applying = false, sentSi = -1, sentStep = -1, gotState = false, helloT = 0;
// the slide the other side stands on, taken over without sending it back
function follow(m) {
  const n = Math.max(0, Math.min(slides.length - 1, m.si | 0));
  const st = Math.max(0, Math.min(groups(slides[n]), m.step | 0));
  if (n === si && st === step) return;
  applying = true;
  try { si = n; step = st; paint(); } finally { applying = false; }
}
// the beamer window says where it stands: after every turn, and when it comes (back) into view - a deck that only
// wakes up in a background tab (a reload) stays quiet, so it never pulls the tablet away from the deck being shown.
// Turned is turned, though, hidden or not: the beamer window may lie under the presenter view on one screen.
function announce(force) {
  if (REMOTE || PRESENTER || !netUp) return;
  if (!force && si === sentSi && step === sentStep) return;
  sentSi = si; sentStep = step;
  send({ t: 'go', si: si, step: step });
}
function hello() {                                   // asked until someone answers: the Mac may come later
  send({ t: 'hello', remote: REMOTE });
  clearTimeout(helloT);
  if (REMOTE) helloT = setTimeout(function () { if (!gotState && netUp) hello(); }, 3000);
}
function receive(m) {
  if (!m || m.from === me || typeof m.t !== 'string') return;
  if (REMOTE && m.t === 'go' && m.deck !== DECK) {   // the Mac went to another deck: the tablet goes along
    if (typeof m.deck === 'string' && m.deck.indexOf(DIR) === 0 && /^[\w\/.-]+$/.test(m.deck))
      location.replace(m.deck + '.html?stift');
    return;
  }
  if (m.deck !== DECK) return;
  if (m.t === 'ink') applyInk(m);
  else if (m.t === 'lab') {                           // a hand in a lab on the Mac: the same on the tablet's copy
    if (!REMOTE || !Array.isArray(m.evs) || !window.DeckLabMirror) return;
    m.evs.forEach(function (e) { if (labOk(e)) try { DeckLabMirror.replay(e); } catch (err) { } });
  }
  else if (m.t === 'hello') {                         // asked for this very deck: answered, seen or not
    if (REMOTE || PRESENTER) return;
    send({ t: 'state', to: m.from, si: si, step: step, ink: ink });
    if (m.remote) { tabLinked(true); if (window.DeckNote) DeckNote('Tablet verbunden'); }
  } else if (m.t === 'state') {
    if (m.to !== me || !(REMOTE || PRESENTER)) return;
    ink = clean(m.ink);
    save(); shownSlide = -1; render();
    if (REMOTE) { gotState = true; setNet('ok'); follow(m); }
  } else if (m.t === 'go') {
    if (!REMOTE) return;
    setNet('ok');
    follow(m);
    if (!gotState) hello();                          // the Mac came after us: fetch its ink too
  } else if (m.t === 'turn') {                        // the tablet's triangles turn the beamer
    if (REMOTE || PRESENTER) return;
    tabLinked(true);
    if (typeof narr !== 'undefined' && narr.stop) narr.stop();
    follow(m);
    announce(true);
  }
}

// ---- writing: pointer events on the SVG ---------------------------------------------------------------------------
let penOn = false, color = Math.max(0, Math.min(COLORS.length - 1, +lies(KEY_COLOR, 0) || 0));
let cur = null, sentN = 0, flushT = 0, sawPen = false;
function toSlide(e) {
  const r = svg.getBoundingClientRect();
  return [r1((e.clientX - r.left) / r.width * W), r1((e.clientY - r.top) / r.height * H)];
}
svg.addEventListener('pointerdown', function (e) {
  if (!penOn || cur || e.button > 0) return;
  if (e.pointerType === 'pen') sawPen = true;
  else if (e.pointerType === 'touch' && sawPen) return;   // once a pen wrote, the hand resting on the tablet does not
  e.preventDefault(); e.stopPropagation();
  try { svg.setPointerCapture(e.pointerId); } catch (err) { }
  const id = me.slice(0, 4) + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  cur = { s: si, id: id, pid: e.pointerId };
  op({ op: 'start', s: si, id: id, c: color, w: WIDTH, p: toSlide(e) });
  sentN = 2;
});
svg.addEventListener('pointermove', function (e) {
  if (!cur || e.pointerId !== cur.pid) return;
  const st = find(cur.s, cur.id);
  if (!st) return;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  let added = false;
  (evs.length ? evs : [e]).forEach(function (ev) {
    const pt = toSlide(ev), n = st.p.length;
    if (n >= 2 && Math.hypot(pt[0] - st.p[n - 2], pt[1] - st.p[n - 1]) < 0.8) return;
    st.p.push(pt[0], pt[1]);
    added = true;
  });
  if (!added) return;
  if (cur.s === si) drawStroke(st);
  if (!flushT) flushT = setTimeout(flush, 40);       // the points go out in bundles, 25 a second at most
});
function flush() {
  flushT = 0;
  if (!cur) return;
  const st = find(cur.s, cur.id);
  if (!st || st.p.length <= sentN) return;
  send({ t: 'ink', op: 'pts', s: cur.s, id: cur.id, c: st.c, w: st.w, i: sentN, p: st.p.slice(sentN) });
  sentN = st.p.length;
}
function finish(e) {
  if (!cur || e.pointerId !== cur.pid) return;
  clearTimeout(flushT); flushT = 0;
  const st = find(cur.s, cur.id);
  if (st) send({ t: 'ink', op: 'end', s: cur.s, id: cur.id, c: st.c, w: st.w, p: st.p });
  cur = null;
  save();
}
svg.addEventListener('pointerup', finish);
svg.addEventListener('pointercancel', finish);
svg.addEventListener('click', function (e) { e.stopPropagation(); });   // a click that wrote does not turn the page

function undo() {
  const list = ink[si] || [], st = list[list.length - 1];
  if (st) op({ op: 'undo', s: si, id: st.id });
}
function wipe() {
  const list = ink[si] || [];
  if (list.length) op({ op: 'clear', s: si, ids: list.map(x => x.id) });
}

// ---- the bar: colours, back, wipe - and the tablet (here) or the triangles (on the tablet) --------------------------
const bar = document.createElement('div');
bar.id = 'ink-bar';
function button(cls, title, html, fn) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = cls; b.title = title; b.setAttribute('aria-label', title);
  b.innerHTML = html;
  b.addEventListener('click', function (e) { e.stopPropagation(); fn(); });
  bar.appendChild(b);
  return b;
}
const dots = COLORS.map(function (c, i) {
  return button('dot', 'Farbe: ' + NAMES[i], '<i style="background:' + c + '"></i>', function () { pick(i); });
});
function pick(i) {
  color = i; schreib(KEY_COLOR, String(i));
  dots.forEach(function (d, k) { d.setAttribute('aria-pressed', String(k === i)); });
}
pick(color);
bar.appendChild(document.createElement('hr'));
button('undo', 'Letzten Strich zurück (z)', icon(UNDO), undo);
button('wipe', 'Folie wischen (c)', icon(WIPE), wipe);
bar.appendChild(document.createElement('hr'));
let tabBtn = null, netDot = null;
if (REMOTE) {
  button('prev', 'Zurück', icon(PREV), function () { prev(); });
  button('next', 'Weiter', icon(NEXT), function () { next(); });
  netDot = document.createElement('span');
  netDot.className = 'net';
  bar.appendChild(netDot);
} else {
  tabBtn = button('tab', 'Tablet als Stift koppeln', icon(TABLET), pairCard);
  button('off', 'Stift aus (s)', icon(CLOSE), function () { pen(false); });
}
bar.addEventListener('click', function (e) { e.stopPropagation(); });
bar.addEventListener('mousedown', function (e) { e.preventDefault(); });   // a pressed button keeps no focus for space
document.body.appendChild(bar);

function placeBar(r) {
  if (!penOn) return;
  const bw = bar.offsetWidth, bh = bar.offsetHeight;
  // beside the slide if there is room; on the tablet at the right, where the writing hand is (Doc, 27.09.2026:
  // "Mach bitte die Bedienbar auf die rechte Seite, auf dem Lenovo")
  const x = REMOTE
    ? (innerWidth - r.right >= bw + 16 ? r.right + 8 : Math.min(innerWidth - bw - 6, r.right - bw - 6))
    : (r.left >= bw + 16 ? r.left - bw - 8 : Math.max(6, r.left + 6));
  const y = Math.max(6, Math.min(innerHeight - bh - 6, r.top + (r.height - bh) / 2));
  bar.style.left = Math.round(x) + 'px'; bar.style.top = Math.round(y) + 'px';
}
function setNet(s) {
  if (!netDot) return;
  netDot.dataset.s = s;
  netDot.title = s === 'ok' ? 'Verbunden' : s === 'off' ? 'Keine Verbindung' : 'Warte auf den Mac';
}
function tabLinked(on) { if (tabBtn) tabBtn.classList.toggle('linked', !!on); }

let penBtn = null;
function pen(on) {
  penOn = REMOTE || !!on;
  document.documentElement.classList.toggle('ink-pen', penOn);
  if (penBtn) penBtn.setAttribute('aria-pressed', String(penOn));
  placed = ''; place();
  if (!REMOTE && window.DeckNote) DeckNote(penOn ? 'Stift an (s)' : 'Stift aus (s)');
}
const hud = document.getElementById('hud');
if (hud && !REMOTE) {                                // the pen in the HUD, for a touch screen without keys (the HP)
  penBtn = document.createElement('button');
  penBtn.id = 'penbtn'; penBtn.type = 'button'; penBtn.title = 'Stift (s)';
  penBtn.setAttribute('aria-label', 'Stift'); penBtn.setAttribute('aria-pressed', 'false');
  penBtn.innerHTML = icon(PEN);
  penBtn.addEventListener('click', function (e) { e.stopPropagation(); pen(!penOn); });
  hud.insertBefore(penBtn, hud.firstChild);
  if (typeof dock === 'function') dock();
}

addEventListener('keydown', function (e) {
  if (REMOTE || e.metaKey || e.ctrlKey || e.altKey) return;
  const t = e.target;
  if (t && t.closest && t.closest('input, textarea, select, [contenteditable], #ask, #ink-card')) return;
  if (document.documentElement.classList.contains('deck-edit')) return;
  const k = e.key;
  if (k === 's' || k === 'S') { pen(!penOn); e.preventDefault(); }
  else if (penOn && (k === 'z' || k === 'Z')) { undo(); e.preventDefault(); }
  else if (penOn && (k === 'c' || k === 'C')) { wipe(); e.preventDefault(); }
});

// ---- pairing: the QR here, the code there -------------------------------------------------------------------------
function code() {
  let c = lies(KEY_CODE, '');
  if (!/^\d{6}$/.test(c)) { c = String(100000 + Math.floor(Math.random() * 900000)); schreib(KEY_CODE, c); }
  return c;
}
function tabletUrl(c) {
  const base = /(^|\.)docalvers\.de$/.test(location.hostname) ? location.origin : SITE;
  return base + DECK + '.html?stift=' + c;
}
function card(build) {
  let k = document.getElementById('ink-card');
  if (k) k.remove();
  k = document.createElement('div');
  k.id = 'ink-card';
  const box = document.createElement('div');
  box.className = 'box';
  box.setAttribute('role', 'dialog');
  k.appendChild(box);
  const shut = function () { k.remove(); removeEventListener('keydown', esc, true); };
  const esc = function (e) { if (e.key === 'Escape') { e.stopPropagation(); shut(); } };
  addEventListener('keydown', esc, true);
  k.addEventListener('click', function (e) { e.stopPropagation(); if (e.target === k) shut(); });
  box.addEventListener('keydown', function (e) { e.stopPropagation(); });   // digits for the code, not a slide jump
  build(box, shut);
  document.body.appendChild(k);
  return k;
}
async function pairCard() {
  if (typeof qrcode === 'undefined') { try { await loadScript(HERE + '../svp/qrcode.min.js'); } catch (e) { } }
  const fill = function (box, shut) {
    const c = code();
    connect(c);
    const url = tabletUrl(c);
    box.innerHTML = '<h2>TABLET ALS STIFT</h2><div class="qr"></div><div class="code"></div>'
      + '<p>Auf dem Tablet den QR scannen – oder dort das Deck auf docalvers.de mit <b>?stift</b> öffnen und den Code '
      + 'eingeben. Einmal koppeln reicht.</p><div class="row"><button type="button" class="neu">Neuer Code</button>'
      + '<button type="button" class="go">Fertig</button></div>';
    box.querySelector('.code').textContent = c;
    const qr = box.querySelector('.qr');
    try {
      const q = qrcode(0, 'M');
      q.addData(url); q.make();
      qr.innerHTML = q.createSvgTag({ scalable: true, margin: 0 });
    } catch (e) { qr.textContent = url; qr.style.cssText += ';color:#0E244E;font-size:.7rem;word-break:break-all'; }
    box.querySelector('.go').onclick = shut;
    box.querySelector('.neu').onclick = function () {   // a fresh code: a tablet with the old one no longer writes here
      let n;
      do { n = String(100000 + Math.floor(Math.random() * 900000)); } while (n === c);
      schreib(KEY_CODE, n);
      tabLinked(false);
      fill(box, shut);
    };
  };
  card(fill);
}
function askCode() {                                 // the tablet, opened with ?stift but never paired
  card(function (box, shut) {
    box.innerHTML = '<h2>STIFT KOPPELN</h2><label for="ink-code">Code vom Mac (Stift → Tablet)</label>'
      + '<input id="ink-code" inputmode="numeric" autocomplete="off" maxlength="6" pattern="[0-9]*">'
      + '<div class="row"><button type="button" class="go">Koppeln</button></div>';
    const inp = box.querySelector('input');
    const go = function () {
      const c = inp.value.replace(/\D/g, '');
      if (!/^\d{6}$/.test(c)) { inp.focus(); return; }
      schreib(KEY_CODE, c);
      shut();
      connect(c);
    };
    box.querySelector('.go').onclick = go;
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    setTimeout(function () { inp.focus(); }, 50);
  });
}

// ---- start ----------------------------------------------------------------------------------------------------------
painted.push(function () {
  render(); place();
  if (applying) return;
  if (REMOTE) { if (netUp) send({ t: 'turn', si: si, step: step }); }
  else announce();
});
addEventListener('resize', function () { placed = ''; place(); });
setInterval(place, 500);                             // the presenter view lays itself out late and on its own
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState !== 'visible') return;
  if (REMOTE) { gotState = false; if (netUp) hello(); }
  else announce(true);
});

if (REMOTE) {
  document.documentElement.classList.add('ink-remote');
  const c = params.get('stift');
  if (/^\d{6}$/.test(c || '')) { schreib(KEY_CODE, c); history.replaceState(null, '', location.pathname + '?stift' + location.hash); }
  // the labs run on the tablet too and follow the Mac (DeckLabTap above); the 3D dice stay pictures
  try { standIns(deck, function (f) { return !!f.closest('.labframe'); }); } catch (e) { }
  // a click beside the slide must not turn it - on the tablet only the triangles do
  addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('#nav, #hud, #ink-bar, #ink-card, #overview, a')) return;
    e.stopPropagation();
  }, true);
  let lock = null;                                   // the tablet stays awake while it is the pen
  const awake = function () {
    if (lock || !navigator.wakeLock) return;
    navigator.wakeLock.request('screen').then(function (l) { lock = l; l.addEventListener('release', function () { lock = null; }); })
      .catch(function () { });
  };
  addEventListener('pointerdown', awake, true);
  document.addEventListener('visibilitychange', awake);
  setNet('wait');
  pen(true);
  const have = lies(KEY_CODE, '');
  if (/^\d{6}$/.test(have)) connect(have); else askCode();
} else {
  const have = lies(KEY_CODE, '');
  if (/^\d{6}$/.test(have)) connect(have);            // paired once: listen for the tablet in every deck
  if (PRESENTER) hello();                            // the beamer window hands over what is written so far
}
render(); place();

window.DeckInk = { pen: pen, undo: undo, wipe: wipe, pair: pairCard,
  debug: function () { return { remote: REMOTE, penOn: penOn, netUp: netUp, code: netCode, slides: Object.keys(ink).length }; } };
