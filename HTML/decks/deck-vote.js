// Doc Alvers Mathe-Labor - the survey at the end of a deck (Doc, 11.11.2026: "am Ende jeder Vorführung, jeder
// Präsentation ... eine Umfrage machen ... in der Folie müsste der QR-Code stehen, den die scannen ... und was ich
// dann sehe, sollte sozusagen in der Folie sein").
//
// The slide is vorspann/umfrage.html (a deck holds the stub <section class="slide" data-aus="vorspann/umfrage.html#1">),
// its <div class="vote-box"></div> is filled here; deck.js loads this file only in a deck that has one. It is
// vote.html?host, small, on the slide:
//   "Umfrage starten"  publishes a round in vote_polls - the same table and the same owner token as vote.html?host,
//                      so the round is in its history and can be deleted there. The question always names THIS deck
//                      (Doc, 11.11.2026: "dass man da immer wirklich Bezug auf diese Präsentation nimmt"): the stub's
//                      data-frage="Wie fandet ihr die Herleitung der pq-Formel?" - only a person gets article and case
//                      right - else "Wie fandet ihr „<title of the title slide>“?". It is the slide's heading and the
//                      round's title, so the phones and vote.html read the same words.
//   the QR             leads the class to vote.html?c=<code> on the live site (a phone cannot reach localhost), where
//                      they tap 1..10 once - the page they know from the polls.
//   the counter        runs while they tap; "Ergebnis" opens a big box over the slide with the bars 1..10 and the
//                      mean (Doc: "in einer Box ..., die sich über alles drüber weglegt und groß ist") - the deck's own
//                      .pop, so x, a click beside it, Esc and turning the page close it, and the presenter's click opens
//                      it on the beamer too. The mean only on a click, as on vote.html: the first votes do not steer
//                      the rest.
//   "Neue Runde"       a new round under the same code: phones that scanned already are switched over (vote.html).
// Plain REST and a look every 2 s while the slide is up - no supabase-js, and school Wi-Fi that drops websockets does
// not matter. The round is kept per deck in localStorage: the beamer and the presenter window share it (storage
// event), and coming back to the slide - or reloading - picks it up again for three hours. After that the slide asks
// for a fresh start, with a fresh code no round has used before.
(function () {
  'use strict';
  const DB = 'https://fyfhxzyymmurlaenmzse.supabase.co/rest/v1/';
  const KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';   // publishable (public by design), as in vote.html
  const PAGE = 'https://www.docalvers.de/vote.html';
  const KEEP_MS = 3 * 3600 * 1000;
  const STORE = 'deck-vote:' + location.pathname;
  // 1 -> 10 and the colour ramp red -> orange -> green: vote.html's, so the slide and the phones look alike
  const FACES = ['\u{1F648}', '\u{1F620}', '\u{1F61F}', '\u{1F615}', '\u{1F610}',
    '\u{1F642}', '\u{1F60A}', '\u{1F600}', '\u{1F601}', '\u{1F929}'];
  const RED = [176, 36, 24], ORANGE = [245, 194, 66], GREEN = [121, 158, 49];
  function ramp(t) {
    const [a, b, u] = t < 0.5 ? [RED, ORANGE, t * 2] : [ORANGE, GREEN, (t - 0.5) * 2];
    return 'rgb(' + a.map((c, k) => Math.round(c + (b[k] - c) * u)).join(',') + ')';
  }
  const fmtMean = x => x.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const me = document.currentScript;
  const base = me && me.src ? me.src : location.href;
  let state = read();          // { poll: {id, code, title}, t: ms of the start }
  let values = [];             // the votes of the round, 1..10
  let busy = false, msg = '', looking = false, qrFor = '', qrSvg = '';

  function read() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (s && s.poll && Date.now() - s.t < KEEP_MS) return s;
    } catch (_) { /* private window: the slide keeps it while it is open */ }
    return { poll: null, t: 0 };
  }
  function write() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (_) { /* see read */ } }

  function api(path, opt) {
    opt = opt || {};
    opt.cache = 'no-store';
    opt.headers = Object.assign({ apikey: KEY }, opt.headers || {});
    return fetch(DB + path, opt);
  }

  // vote.html?host's owner token (same origin): only this browser may delete its rounds, the row keeps its SHA-256
  function owner() {
    try {
      let o = localStorage.getItem('vote-host-owner');
      if (!o) {
        o = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
        localStorage.setItem('vote-host-owner', o);
      }
      return o;
    } catch (_) { return 'nostorage'; }
  }
  async function sha256hex(str) {
    if (!(window.crypto && crypto.subtle)) return null;   // not a secure context: the round is simply nobody's
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
  }

  // a code no round has carried yet: vote.html shows a phone the LATEST round of its code, so an old one would let
  // the class vote on last week's question
  async function freshCode() {
    for (let k = 0; k < 8; k++) {
      const c = String(1000 + Math.floor(Math.random() * 9000));
      const res = await api('vote_polls?code=eq.' + c + '&select=id&limit=1');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (!(await res.json()).length) return c;
    }
    throw new Error('kein freier Code');
  }

  function question(box) {
    const s = box && box.closest('.slide');
    if (s && s.dataset.frage) return s.dataset.frage.trim();
    const h1 = document.querySelector('.slide.title h1');
    const t = ((h1 && h1.textContent) || document.title || '').replace(/\s+/g, ' ').trim();
    return t ? 'Wie fandet ihr „' + t + '“?' : 'Wie fandet ihr die Präsentation?';
  }

  // the question as the slide's heading; a heading of two lines needs the rules lower (deck.js titleLines, measured
  // once already - so once more, after Orbitron is there)
  function headings() {
    let changed = false;
    document.querySelectorAll('.slide .vote-box').forEach(function (box) {
      const h = box.closest('.slide').querySelector(':scope > h3'), q = question(box);
      if (h && h.textContent !== q) { h.textContent = q; changed = true; }
    });
    if (changed && typeof titleLines === 'function') {
      if (document.fonts) document.fonts.ready.then(titleLines, titleLines); else titleLines();
    }
  }

  async function start(box, again) {
    if (busy) return;
    busy = true; msg = ''; render();
    try {
      const code = again && state.poll ? state.poll.code : await freshCode();
      const title = question(box);
      const res = await api('vote_polls?select=id,code,title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ code: code, title: title, owner_hash: await sha256hex(owner()) })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const row = (await res.json())[0];
      state = { poll: { id: row.id, code: row.code, title: row.title }, t: Date.now() };
      values = [];
      write();
    } catch (e) {
      msg = 'Die Umfrage ließ sich nicht starten (' + (e.message || e) + ').';
    }
    busy = false;
    render();
    look();
  }

  async function look() {
    if (!state.poll || looking) return;
    looking = true;
    const id = state.poll.id;
    try {
      const res = await api('vote_votes?poll_id=eq.' + id + '&select=value');
      if (res.ok) {
        const rows = await res.json();
        if (state.poll && state.poll.id === id) { values = rows.map(r => r.value); msg = ''; render(); }
      }
    } catch (_) { /* offline for a moment - the next look catches up */ }
    looking = false;
  }

  function qr(code) {
    if (code === qrFor) return qrSvg;
    if (typeof qrcode === 'undefined') return '';
    const q = qrcode(0, 'L');                         // L: bigger modules - the last row scans it from the beamer
    q.addData(PAGE + '?c=' + code);
    q.make();
    qrFor = code;
    qrSvg = q.createSvgTag({ scalable: true, margin: 0 });
    return qrSvg;
  }

  function build(box) {
    box.innerHTML =
      '<div class="vote-left"><div class="vote-qr" role="img" aria-label="QR-Code zur Umfrage"></div>' +
      '<p class="vote-link"></p></div>' +
      '<div class="vote-right">' +
      '<div class="vote-count"><b class="vote-n">0</b><span class="vote-n-sub">Votes</span></div>' +
      '<div class="vote-btns"><button type="button" class="vote-go">Umfrage starten</button>' +
      '<button type="button" class="vote-show" data-pop="vote-pop">Ergebnis</button>' +
      '<button type="button" class="vote-new ghost">Neue Runde</button></div>' +
      '<p class="vote-msg"></p></div>';
    box.dataset.built = '2';
    // the result box: a .pop of the slide itself (deck.js opens it from data-pop, the presenter's copy takes it along)
    const slide = box.closest('.slide');
    if (slide && !slide.querySelector('.vote-pop')) {
      let cols = '';
      for (let i = 1; i <= 10; i++) {
        cols += '<div class="vote-col"><span class="vote-track"><span class="vote-cnt"></span><i class="vote-bar" ' +
          'style="background:' + ramp((i - 1) / 9) + '"></i></span><span class="vote-x">' + i + '<em>' + FACES[i - 1] +
          '</em></span></div>';
      }
      const pop = document.createElement('div');
      pop.className = 'pop vote-pop';
      pop.id = 'vote-pop';
      pop.hidden = true;
      pop.innerHTML = '<button class="pop-x" aria-label="Schließen">×</button><h4 class="vote-q"></h4>' +
        '<div class="vote-result"><div class="vote-mean"><b></b><span></span></div>' +
        '<div class="vote-bars">' + cols + '</div></div>';
      slide.appendChild(pop);
    }
  }

  // every box - the slide, the presenter's copies, the overview's - shows the same round
  function render() {
    const poll = state.poll, n = values.length;
    const counts = Array(10).fill(0);
    values.forEach(v => { if (v >= 1 && v <= 10) counts[v - 1]++; });
    const max = Math.max(1, ...counts);
    const mean = n ? values.reduce((a, b) => a + b, 0) / n : 0;
    document.querySelectorAll('.vote-box').forEach(function (box) {
      if (box.dataset.built !== '2') build(box);
      box.classList.toggle('idle', !poll);
      box.classList.toggle('live', !!poll);
      box.classList.toggle('busy', busy);
      const q = box.querySelector('.vote-qr');
      const svg = poll ? qr(poll.code) : '';
      const want = !poll ? 'idle' : (svg ? 'qr:' : 'code:') + poll.code;   // the code alone while the QR library loads
      if (q.dataset.k !== want) {
        q.innerHTML = !poll ? '<span>QR kommt mit dem Start</span>' : svg || '<span>' + poll.code + '</span>';
        q.dataset.k = want;
      }
      box.querySelector('.vote-link').textContent = poll
        ? 'docalvers.de/vote · Code ' + poll.code : 'Scannen · 1 bis 10 tippen';
      // none yet: no 0 (Orbitron's slashed zero read as a strange sign), the words alone on its line - the same rule as
      // the result box (Doc, 11.11.2026: "Das sieht irgendwie komisch aus, wenn da noch keine sind")
      box.querySelector('.vote-n').textContent = n ? String(n) : '';
      box.querySelector('.vote-n-sub').textContent = !n ? 'Noch keine Votes' : n === 1 ? 'Vote' : 'Votes';
      box.querySelector('.vote-go').textContent = busy ? 'Startet …' : 'Umfrage starten';
      box.querySelectorAll('button').forEach(b => { b.disabled = busy; });
      box.querySelector('.vote-msg').textContent = msg;
    });
    document.querySelectorAll('.vote-pop').forEach(function (pop) {
      pop.querySelector('.vote-q').textContent = poll ? poll.title : 'Ergebnis';
      const m = pop.querySelector('.vote-mean b');
      m.textContent = n ? fmtMean(mean) : '';   // no dash for "none yet" - the line says it (deck.css .vote-mean)
      m.style.color = n ? ramp((mean - 1) / 9) : '';
      pop.querySelector('.vote-mean span').textContent = n
        ? 'Mittelwert · ' + n + (n === 1 ? ' Vote' : ' Votes') : 'Noch keine Votes';
      pop.querySelectorAll('.vote-col').forEach(function (col, i) {
        col.querySelector('.vote-cnt').textContent = counts[i] ? counts[i] : '';
        col.querySelector('.vote-bar').style.height = (counts[i] / max * 86) + '%';   // room for the count above
      });
    });
  }

  // the buttons - wherever the box is: on the beamer, on the presenter's current slide; never in the editor, where a
  // click picks the element, and never in the overview's or the strip's little copies. "Ergebnis" is deck.js's (data-pop).
  document.addEventListener('click', function (e) {
    const b = e.target.closest && e.target.closest('.vote-box button');
    if (!b || b.classList.contains('vote-show')) return;
    if (document.documentElement.classList.contains('deck-edit') || b.closest('.ov-thumb, .p-thumb')) return;
    e.stopPropagation();
    e.preventDefault();
    const box = b.closest('.vote-box');
    if (b.classList.contains('vote-go')) start(box, false);
    else if (b.classList.contains('vote-new')) start(box, true);
  }, true);

  // the other window (beamer / presenter) started a round
  addEventListener('storage', function (e) {
    if (e.key !== STORE) return;
    const before = state.poll && state.poll.id;
    state = read();
    if ((state.poll && state.poll.id) !== before) values = [];
    render();
    look();
  });

  function onScreen() {
    return typeof slides !== 'undefined' && typeof si !== 'undefined' && !!(slides[si] && slides[si].querySelector('.vote-box'));
  }
  setInterval(function () {
    if (state.poll && document.visibilityState === 'visible' && onScreen()) look();
  }, 2000);
  // after every page turn: the presenter's fresh copy of the slide gets the round too, and arriving looks at once
  if (typeof painted !== 'undefined') painted.push(function () { render(); if (state.poll && onScreen()) look(); });

  function load(src) {
    return new Promise(function (ok, no) {
      const s = document.createElement('script');
      s.src = new URL(src, base).href; s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
  }
  headings();
  render();
  (typeof qrcode !== 'undefined' ? Promise.resolve() : load('../svp/qrcode.min.js'))
    .then(function () { qrFor = ''; render(); }, function () { /* no QR library (offline copy): the code still stands there */ });
  look();
})();
