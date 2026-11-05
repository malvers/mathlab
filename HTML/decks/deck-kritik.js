// Remarks on a running deck, spoken into her talk (Doc, 01.11.2026: "dass ich dazu direkt kommentieren kann", as
// filmkritik.html for films). Space stops Solita and starts a remark at the present slide, Space again saves it and she
// goes on (Doc, 02.11.2026: "wenn sie weiterspricht, dann kann ich ja nicht hören, was sie da spricht"). p stays the plain
// pause, k does what Space does and also works when she is not talking. Each remark lands with slide, click and clip in
// ~/Documents/deck-kritik/<deck>.jsonl (tools/pptx/deck_edit.py), an agent works through that file afterwards. Loaded by
// deck-edit.js, so it exists on this machine only.
// Remarks belong to the edit mode (E, html.deck-edit): only there Space and k record and the red marks show; outside it
// Space is the plain pause and the bar only says where we are (Doc, 03.11.2026: "wenn ich unterbreche mit Spacebar, dass
// da nichts aufgenommen werden kann. Denn das ist ja sozusagen nur unser Edit-Modus").
(function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  const deck = location.pathname.split('/').pop().replace(/\.html$/, '');
  const pill = document.createElement('div');
  pill.id = 'kritik-pill';
  pill.style.cssText = 'position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:99;max-width:70vw;padding:8px 18px;border-radius:18px;'
    + 'background:#B02418;color:#fff;font:600 15px Raleway,system-ui,sans-serif;box-shadow:0 4px 18px rgba(14,36,78,.35);display:none';
  document.body.appendChild(pill);
  let rec = null, on = false, done = '', mid = '', from = null, count = 0, hide = 0;
  const editing = () => document.documentElement.classList.contains('deck-edit');
  const say = (t, ms) => { clearTimeout(hide); pill.textContent = t; pill.style.display = 'block'; if (ms) hide = setTimeout(() => { pill.style.display = 'none'; }, ms); };
  function start() {
    const s = slides[si], h = s && s.querySelector('h1,h2,h3');
    from = { deck, folie: si + 1, klick: step, clip: narr.clip ? narr.clip() : 0, titel: h ? h.textContent : '', zeit: new Date().toISOString() };
    done = ''; mid = ''; on = true;
    if (narr.pause) narr.pause();
    say('Kommentar zu Folie ' + from.folie + ': Ich höre zu …');
    listen();
  }
  function listen() {
    rec = new SR(); rec.lang = 'de-DE'; rec.continuous = true; rec.interimResults = true;
    rec.onresult = ev => {
      mid = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) done += r[0].transcript + ' '; else mid += r[0].transcript;
      }
      say('Folie ' + from.folie + ': ' + (done + mid).slice(-120));
    };
    rec.onend = () => { if (on) listen(); };          // Chrome stops after a silence
    rec.start();
  }
  function stop() {
    on = false;
    if (rec) rec.stop();
    if (narr.weiter) narr.weiter();
    setTimeout(() => {                                // the last words arrive after stop()
      const text = (done + mid).trim();
      if (!text) { say('Nichts gehört', 1500); return; }
      fetch('/__deck/kritik', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ text }, from)) })
        .then(r => { if (!r.ok) throw new Error(r.status); count++; items.push(Object.assign({ text }, from)); marks(); say('Kommentar ' + count + ' gespeichert', 1500); })
        .catch(() => say('Nicht gespeichert: ' + text.slice(0, 80), 6000));
    }, 700);
  }
  // the bar along the bottom, as under a film in filmkritik.html: where we are, and a red mark for each remark. A click
  // on it goes to that slide; it stands there at the desk, in fullscreen only while Solita talks or after k. 10 px, not 16
  // (Doc, 03.11.2026: "könnte ein Tick schmaler sein. Generell"); the red marks only while editing ("im Solita erklärt
  // Modus ... die roten Striche ... nicht")
  const bar = document.createElement('div'), fill = document.createElement('div');
  bar.id = 'kritik-bar';
  bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:10px;z-index:98;background:rgba(14,36,78,.22);cursor:pointer;display:none';
  fill.style.cssText = 'position:absolute;left:0;top:0;bottom:0;background:rgba(245,194,66,.85);width:0';
  bar.appendChild(fill); document.body.appendChild(bar);
  let items = [], used = false;
  const left = (n, clip) => ((n - 1 + Math.min(clip || 0, 9) / 10) / slides.length * 100).toFixed(2) + '%';
  function marks() {
    bar.querySelectorAll('.km').forEach(m => m.remove());
    const seen = {};
    items.forEach(it => {
      const m = document.createElement('div'), at = it.folie + '.' + (it.clip || 0);
      seen[at] = (seen[at] || 0) + 1;                 // thin lines, side by side: several at one place stay countable (Doc, 02.11.2026)
      m.className = 'km'; m.title = 'Folie ' + it.folie + ': ' + it.text;
      m.style.cssText = 'position:absolute;top:0;bottom:0;width:7px;margin-left:' + (seen[at] * 4 - 7.5) + 'px;background:linear-gradient(#B02418,#B02418) center/2px 100% no-repeat;left:' + left(it.folie, it.clip);
      m.addEventListener('click', e => { e.stopPropagation(); goto(it.folie); say('Folie ' + it.folie + ': ' + it.text, 5000); });
      bar.appendChild(m);
    });
  }
  function goto(n) { if (narr.stop) narr.stop(); location.hash = '#' + n; }
  ['click', 'pointerdown', 'mousedown'].forEach(t => bar.addEventListener(t, e => e.stopPropagation()));
  bar.addEventListener('click', e => goto(Math.min(slides.length, 1 + Math.floor(e.clientX / bar.clientWidth * slides.length))));
  fetch('/__deck/kritik?deck=' + encodeURIComponent(deck)).then(r => r.json()).then(j => { items = j.items || []; marks(); }).catch(() => { });
  setInterval(() => {
    bar.style.display = !document.fullscreenElement || narr.playing || on || used ? 'block' : 'none';   // at the desk always, in a show only while it is used
    fill.style.width = (si + 1) / slides.length * 100 + '%';
    const show = editing() || on ? '' : 'none';
    bar.querySelectorAll('.km').forEach(m => { m.style.display = show; });
  }, 400);
  addEventListener('keydown', e => {
    if (e.key !== 'k' && e.key !== 'K') return;
    if (!on && !editing()) return;                    // a remark is the edit mode's business
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable) return;
    e.preventDefault(); e.stopImmediatePropagation();
    take();
  }, true);
  function take() { used = true; if (on) stop(); else start(); }
  narr.kommentar = key => {                           // deck.js asks while she talks or stands paused; p ends a remark too
    if (!on && (key !== ' ' || !editing())) return false;   // outside the edit mode Space is the plain pause
    take();
    return true;
  };
})();
