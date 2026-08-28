/* Shared engine of the online tests (mathetest11, mathetest12, mathetest13,
   mathetest11-jahresabschluss, ...). Extracted from mathetest11 so the pages
   themselves only carry their questions.

   A page defines its quiz before loading this file:

     window.QUIZ = {
       id: 'mathetest12-eingang',   // '-test' in ?test, '-v1' + ?klasse otherwise
       title: 'Anonymer Eingangstest Mathematik · Klasse 12',
       subtitle: 'Berufliches Gymnasium · ...',
       dashSub: '...',              // optional: sub line of the ?auswertung view
       back: 'svp/',                // optional: "Zur Übersicht" button (href) top left above the
                                    //   title — for tests opened in a new tab from an svp plan
       submit: false,               // optional: hide "Abgeben" (Uebungsmodus)
       version: 'v9',               // optional: data pool version, default 'v1'
       solutions: 'always',         // optional: readable without submitting; 'none' = no panel
       gradeScale: [[95, 1], ...],  // optional
       questions: [ { q, opts, steps, solution }, ... ]
     };

   URL switches: ?test = demo pool + key r, ?klasse=11a = own pool,
   ?auswertung = teacher dashboard. */
(function () {
  'use strict';

  const CFG = window.QUIZ || {};
  /* Uebungsmodus: solutions readable right away instead of after "Abgeben" */
  const FREE_SOLUTIONS = CFG.solutions === 'always';
  /* quizzes without step-by-step solutions (e.g. infotest9) hide the panel */
  const NO_SOLUTIONS = CFG.solutions === 'none';

  /* The page markup is identical for every quiz, so the engine builds it. */
  function buildPage() {
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.innerHTML =
      (CFG.back ? '<div class="backrow"><button class="backbtn" id="backBtn" type="button" title="Zur Übersicht">Zur Übersicht</button></div>' : '') +
      '<h1></h1>' +
      '<div class="sub"></div>' +
      '<div id="quiz"></div>' +
      '<div id="dash" style="display:none">' +
        '<div class="card">' +
          '<div class="dashhead">Einzelleistungen <span class="live" id="liveinfo"></span></div>' +
          '<div id="dashscores">Noch keine Abgaben.</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="dashhead">Gruppenleistung pro Frage</div>' +
          '<div id="dashquestions"></div>' +
        '</div>' +
      '</div>' +
      (CFG.submit === false ? '' :
        '<div class="actions" id="submitBox">' +
          '<button class="btn" id="submitBtn" type="button">Abgeben</button>' +
          '<div class="hint" id="hint"></div>' +
        '</div>') +
      '<div class="card" id="result" style="display:none">' +
        '<h2>Dein Ergebnis</h2>' +
        '<div class="score" id="score"></div>' +
        '<div id="review"></div>' +
        '<div class="avg" id="classavg">Klassen-Durchschnitt wird geladen …</div>' +
      '</div>' +
      '<footer>Doc Alvers Mathe-Labor · Es werden keine persönlichen Daten gespeichert, ' +
      'nur anonyme Gesamt-Zähler.</footer>';
    wrap.querySelector('h1').textContent = CFG.title || '';
    wrap.querySelector('.sub').textContent = CFG.subtitle || '';
    const back = wrap.querySelector('#backBtn');
    if (back) back.addEventListener('click', function () { location.href = CFG.back; });

    document.body.appendChild(wrap);
  }
  buildPage();

  const DB_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
  const DB_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk'; /* publishable key - public by design */
  const PARAMS = new URLSearchParams(location.search);
  /* ?test = demo mode: separate data pool, key r, unlimited submits */
  const TEST_MODE = PARAMS.has('test');
  /* ?klasse=9a = own data pool (and own submit lock) per class/run;
     a "reset" is simply a new value, e.g. ?klasse=9a-2 */
  const KLASSE = (PARAMS.get('klasse') || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 20);
  const QUIZ_ID = TEST_MODE ? CFG.id + '-test'
                            : CFG.id + '-' + (CFG.version || 'v1') + (KLASSE ? '-' + KLASSE : '');
  /* soft lock against double submits per browser; tied to QUIZ_ID so a new
     quiz version automatically resets the lock */
  const DONE_KEY = 'done-' + QUIZ_ID;

  /* Grading scale: [min percentage, grade]. A page may override it via QUIZ.gradeScale. */
  const GRADE_SCALE = CFG.gradeScale || [[95, 1], [80, 2], [60, 3], [40, 4], [20, 5], [0, 6]];

  function gradeFor(pct) {
    for (let i = 0; i < GRADE_SCALE.length; i++) {
      if (pct >= GRADE_SCALE[i][0]) return GRADE_SCALE[i][1];
    }
    return 6;
  }

  const QUESTIONS = CFG.questions || [];


  const LETTERS = ['A', 'B', 'C', 'D'];
  const answers = new Array(QUESTIONS.length).fill(-1);
  let locked = false;

  /* Formulas are written as $...$ inside the question/option strings and
     rendered with KaTeX. Plain text parts stay plain text (no innerHTML). */
  function renderMath(el, src) {
    el.dataset.src = src;
    el.textContent = '';
    /* A backslash escapes a dollar sign, so spreadsheet references like \$A\$1
       can be written without opening a formula. */
    const ESC = '\u0000';
    src.replace(/\\\$/g, ESC).split(/\$([^$]+)\$/).forEach(function (part, idx) {
      if (!part) return;
      const text = part.split(ESC).join('$');
      if (idx % 2 === 0) {
        el.appendChild(document.createTextNode(text));
      } else if (window.katex) {
        const span = document.createElement('span');
        try { katex.render(text, span, { throwOnError: false }); }
        catch (e) { span.textContent = text; }
        el.appendChild(span);
      } else {
        el.appendChild(document.createTextNode(text));
      }
    });
  }

  const quizEl = document.getElementById('quiz');
  const hintEl = document.getElementById('hint');
  const submitBtn = document.getElementById('submitBtn');

  /* Step-by-step solution panel: numbered steps plus the correct option. */
  function buildSolution(item) {
    const box = document.createElement('div');
    box.className = 'solution';
    box.hidden = true;
    const title = document.createElement('div');
    title.className = 'soltitle';
    title.textContent = 'SCHRITT FÜR SCHRITT';
    box.appendChild(title);
    const ol = document.createElement('ol');
    (item.steps || []).forEach(function (step) {
      const li = document.createElement('li');
      renderMath(li, step);
      ol.appendChild(li);
    });
    box.appendChild(ol);
    const ans = document.createElement('div');
    ans.className = 'solanswer';
    const head = document.createElement('span');
    head.textContent = 'Richtige Antwort: ' + LETTERS[item.solution] + ' — ';
    ans.appendChild(head);
    const val = document.createElement('span');
    renderMath(val, item.opts[item.solution]);
    ans.appendChild(val);
    box.appendChild(ans);
    return box;
  }

  function render() {
    QUESTIONS.forEach(function (item, qi) {
      const card = document.createElement('div');
      card.className = 'card';
      const num = document.createElement('div');
      num.className = 'qnum';
      num.textContent = 'FRAGE ' + (qi + 1) + ' / ' + QUESTIONS.length;
      const qt = document.createElement('div');
      qt.className = 'qtext';
      renderMath(qt, item.q);
      card.appendChild(num);
      card.appendChild(qt);
      item.opts.forEach(function (opt, oi) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.dataset.q = qi;
        b.dataset.o = oi;
        b.setAttribute('aria-label', 'Frage ' + (qi + 1) + ', Antwort ' + LETTERS[oi]);
        const lt = document.createElement('span');
        lt.className = 'letter';
        lt.textContent = LETTERS[oi];
        b.appendChild(lt);
        const txt = document.createElement('span');
        renderMath(txt, opt);
        b.appendChild(txt);
        b.addEventListener('click', function () { pick(qi, oi, card); });
        card.appendChild(b);
      });

      /* Solution toggle below the answer options; the step-by-step panel
         opens directly underneath the button. */
      if (NO_SOLUTIONS) {
        quizEl.appendChild(card);
        return;
      }
      const sol = buildSolution(item);
      const solBtn = document.createElement('button');
      solBtn.type = 'button';
      solBtn.className = 'solbtn';
      const solOpen = TEST_MODE;
      solBtn.textContent = solOpen ? 'Lösung ausblenden' : 'Lösung';
      solBtn.setAttribute('aria-expanded', solOpen ? 'true' : 'false');
      solBtn.setAttribute('aria-label', 'Lösung zu Frage ' + (qi + 1) + ' anzeigen');
      solBtn.disabled = !(FREE_SOLUTIONS || TEST_MODE);
      solBtn.title = solBtn.disabled ? 'Wird nach dem Abgeben freigeschaltet' : '';
      sol.hidden = !solOpen;
      solBtn.addEventListener('click', function () {
        const open = sol.hidden;
        sol.hidden = !open;
        solBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        solBtn.textContent = open ? 'Lösung ausblenden' : 'Lösung';
      });
      card.appendChild(solBtn);
      card.appendChild(sol);

      quizEl.appendChild(card);
    });
  }

  /* "Abgeben" unlocks only once every question has been answered. */
  function updateSubmitState() {
    if (!submitBtn) return;
    if (TEST_MODE) { submitBtn.disabled = false; return; }
    const open = answers.filter(function (a) { return a < 0; }).length;
    submitBtn.disabled = open > 0;
    if (hintEl) {
      hintEl.textContent = open === 0 ? ''
        : 'Noch ' + open + (open === 1 ? ' Frage offen.' : ' Fragen offen.');
    }
  }

  /* Single choice: picking an option always clears the previous one. */
  function pick(qi, oi, card) {
    if (locked) return;
    answers[qi] = oi;
    card.querySelectorAll('.opt').forEach(function (b) {
      b.classList.toggle('sel', Number(b.dataset.o) === oi);
    });
    updateSubmitState();
  }

  function submit() {
    if (locked) return;
    locked = true;
    if (submitBtn) submitBtn.disabled = true;

    let score = 0;
    document.querySelectorAll('.opt').forEach(function (b) {
      b.disabled = true;
      const qi = Number(b.dataset.q), oi = Number(b.dataset.o);
      if (oi === QUESTIONS[qi].solution) b.classList.add('correct');
      else if (answers[qi] === oi) b.classList.add('wrong');
    });
    QUESTIONS.forEach(function (item, qi) { if (answers[qi] === item.solution) score++; });

    document.querySelectorAll('.solbtn').forEach(function (b) {
      b.disabled = false;
      b.title = '';
    });

    const box = document.getElementById('submitBox');
    if (box) box.style.display = 'none';
    const resEl = document.getElementById('result');
    resEl.style.display = 'block';
    const pctOwn = Math.round(score / QUESTIONS.length * 100);
    document.getElementById('score').innerHTML =
      score + ' / ' + QUESTIONS.length +
      ' <span style="font-size:0.6em">· ' + pctOwn + ' % · Note <span style="color:' +
      barColor(pctOwn) + '">' + gradeFor(pctOwn) + '</span></span>';

    resEl.scrollIntoView({ behavior: 'smooth' });

    sendStats(score);
  }

  /* Send answers once; server stores one anonymous submission row ("12/20")
     plus aggregated per-question counters. */
  function sendStats(score) {
    const avgEl = document.getElementById('classavg');
    const alreadyDone = !TEST_MODE && localStorage.getItem(DONE_KEY) === '1';
    const call = alreadyDone
      ? fetch(DB_URL + '/rest/v1/quiz_stats?quiz=eq.' + QUIZ_ID + '&order=q', {
          headers: { apikey: DB_KEY, Authorization: 'Bearer ' + DB_KEY }
        })
      : fetch(DB_URL + '/rest/v1/rpc/quiz_vote', {
          method: 'POST',
          headers: {
            apikey: DB_KEY,
            Authorization: 'Bearer ' + DB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            p_quiz: QUIZ_ID,
            p_answers: answers,
            p_score: score,
            p_total: QUESTIONS.length
          })
        });

    call.then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      if (!alreadyDone && !TEST_MODE) localStorage.setItem(DONE_KEY, '1');
      return res.json();
    }).then(function (rows) {
      showAverage(rows, avgEl);
    }).catch(function () {
      renderReview(null); /* still show own richtig/falsch without class data */
      avgEl.textContent = 'Klassendurchschnitt gerade nicht verfügbar.';
    });
  }

  /* Bar color ramp: palette red (0%) -> orange (50%) -> green (100%). */
  function barColor(pct) {
    const red = [176, 36, 24], orange = [245, 194, 66], green = [121, 158, 49];
    const a = pct <= 50 ? red : orange;
    const b = pct <= 50 ? orange : green;
    const t = (pct <= 50 ? pct : pct - 50) / 50;
    const c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); });
    return 'rgb(' + c.join(',') + ')';
  }

  /* Per question: own answer as richtig/falsch plus the class percentage. */
  function renderReview(rows) {
    const byQ = {};
    (rows || []).forEach(function (r) { byQ[r.q] = r; });
    let html = '<table class="revtable"><thead><tr>' +
               '<th>Frage</th><th>Deine Antwort</th><th colspan="2">Klassendurchschnitt</th>' +
               '</tr></thead><tbody>';
    QUESTIONS.forEach(function (item, qi) {
      const ok = answers[qi] === item.solution;
      let pct = null;
      const row = byQ[qi];
      if (row) {
        const counts = row.counts || [];
        const total = counts.reduce(function (a, b) { return a + b; }, 0);
        const correct = counts[item.solution] || 0;
        if (total) pct = Math.round(correct / total * 100);
      }
      html += '<tr><td>' + (qi + 1) + '</td>' +
              '<td class="' + (ok ? 'ok' : 'nok') + '">' + (ok ? 'richtig' : 'falsch') + '</td>' +
              '<td class="pct">' + (pct === null ? '' :
                '<div class="bar"><div style="width:' + pct + '%;background:' +
                barColor(pct) + '"></div></div>') + '</td>' +
              '<td class="num">' + (pct === null ? '–' : pct + ' %') + '</td></tr>';
    });
    html += '</tbody></table>';
    document.getElementById('review').innerHTML = html;
  }

  function showAverage(rows, avgEl) {
    renderReview(rows);
    if (!rows || !rows.length) { avgEl.textContent = ''; return; }
    let sumRate = 0, n = 0, submissions = 0;
    rows.forEach(function (row) {
      if (row.q < 0 || row.q >= QUESTIONS.length) return;
      const counts = row.counts || [0, 0, 0, 0, 0];
      const total = counts.reduce(function (a, b) { return a + b; }, 0);
      const correct = counts[QUESTIONS[row.q].solution] || 0;
      sumRate += total ? correct / total : 0; n++;
      submissions = Math.max(submissions, total);
    });
    const avg = n ? Math.round((sumRate / n) * 100) : 0;
    avgEl.innerHTML = '<div class="avg">Klassendurchschnitt gesamt: <b>' + avg +
      ' % richtig</b> bei ' + submissions + ' Abgaben.</div>';
  }

  /* Der Auswerte-Knopf gehoert in die Spalte, nicht an den Fensterrand: er
     zieht in die Leiste ueber den Fragen, in der auch "Alle einklappen"
     sitzt. Gibt es die nicht (Quiz ohne einklappbare Karten), baut er sich
     eine eigene Zeile im selben Stil. */
  /* Wechsel zwischen Test und Auswertung. Vorhandene Parameter bleiben stehen:
     ?klasse gehoert zur Quiz-Id, sonst zeigt das Dashboard die Zahlen einer
     anderen Gruppe. */
  function switchTo(dashboard) {
    const params = new URLSearchParams(location.search);
    if (dashboard) params.set('auswertung', '');
    else params.delete('auswertung');
    const q = params.toString().replace(/=(?=&|$)/g, '');
    location.href = location.pathname + (q ? '?' + q : '');
  }

  function pillButton(id, label, title, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-eval';
    btn.id = id;
    btn.textContent = label;
    btn.title = title;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /* Die Leiste ueber dem Inhalt - im Test die von quiz-collapse.js mit
     "Alle einklappen", in der Auswertung eine eigene. */
  function toolbar(before) {
    let bar = document.querySelector('.qbar');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'qbar';
      before.parentNode.insertBefore(bar, before);
    }
    return bar;
  }

  function placeEvalButton() {
    const bar = toolbar(document.getElementById('quiz'));
    bar.insertBefore(pillButton('evalBtn', 'Auswertung', 'Live-Auswertung - nur mit Passwort',
      function () { switchTo(true); }), bar.firstChild);
  }

  function placeBackToTestButton() {
    const bar = toolbar(document.getElementById('dash'));
    bar.appendChild(pillButton('toTestBtn', 'Zum Test', 'Zurueck zur Testansicht',
      function () { switchTo(false); }));
  }

  /* The teacher view sits behind the usual password. The gate lives in
     svp/svp-gate.js, so one unlock covers the plan pages and the tests alike;
     the script is pulled in on demand, which keeps all quiz pages untouched.
     This is a view shield, not a vault - the numbers themselves stay readable
     for anyone who knows the Supabase endpoint. */
  function withGate(fn) {
    if (window.svpGate) { window.svpGate.run(fn); return; }
    const el = document.createElement('script');
    el.src = 'svp/svp-gate.js';
    el.onload = function () {
      if (window.svpGate) window.svpGate.run(fn);
      else gateFailed();
    };
    el.onerror = gateFailed;
    document.head.appendChild(el);
  }

  function gateFailed() {
    const sub = document.querySelector('.sub');
    if (sub) sub.textContent = 'Auswertung nicht moeglich: die Passwortpruefung konnte nicht geladen werden.';
  }

  /* --- Teacher dashboard (?auswertung): anonymous individual scores counting
     up live while students submit, plus group performance per question. --- */
  function initDashboard() {
    const box = document.getElementById('submitBox');
    if (box) box.style.display = 'none';
    document.querySelector('.sub').textContent = CFG.dashSub ||
      (CFG.title + ' · Live-Auswertung: anonyme Einzelscores + Gruppenleistung pro Frage');
    document.getElementById('dash').style.display = 'block';
    refreshDashboard();
    /* Left open on the beamer all day this would poll for hours; a hidden tab tells us nobody is
       looking, so we stop and catch up on return. */
    let timer = setInterval(refreshDashboard, 5000);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearInterval(timer);
        timer = null;
      } else if (!timer) {
        refreshDashboard();
        timer = setInterval(refreshDashboard, 5000);
      }
    });
  }

  function refreshDashboard() {
    fetch(DB_URL + '/rest/v1/quiz_submissions?quiz=eq.' + QUIZ_ID +
          '&select=id,score,total&order=id', {
      headers: { apikey: DB_KEY, Authorization: 'Bearer ' + DB_KEY }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (subs) {
      renderScores(subs);
      return fetch(DB_URL + '/rest/v1/quiz_stats?quiz=eq.' + QUIZ_ID + '&order=q', {
        headers: { apikey: DB_KEY, Authorization: 'Bearer ' + DB_KEY }
      });
    }).then(function (res) { return res.json(); })
      .then(renderQuestionStats)
      .catch(function () {
        document.getElementById('liveinfo').textContent = '(Verbindung gestört — versuche weiter …)';
      });
  }

  function renderScores(subs) {
    const el = document.getElementById('dashscores');
    const info = document.getElementById('liveinfo');
    if (!subs.length) {
      el.textContent = 'Noch keine Abgaben.';
      info.textContent = '(live, aktualisiert alle 5 s)';
      return;
    }
    let sum = 0;
    let html = '<div class="chips">';
    subs.forEach(function (s, i) {
      sum += s.score;
      const low = s.score < s.total / 2 ? ' low' : '';
      html += '<span class="chip' + low + '" title="Abgabe ' + (i + 1) + '">' +
              s.score + '/' + s.total + '</span>';
    });
    html += '</div>';
    const avg = sum / subs.length;
    el.innerHTML = html +
      '<div class="avg">Ø <b>' + (Math.round(avg * 10) / 10) + ' / ' + QUESTIONS.length +
      '</b> (' + Math.round(avg / QUESTIONS.length * 100) + ' %)</div>' +
      '<div class="avgsub">' + subs.length + (subs.length === 1 ? ' Abgabe' : ' Abgaben') + '</div>';
    info.textContent = '(' + subs.length + ' Abgaben · live, aktualisiert alle 5 s)';
  }

  function renderQuestionStats(rows) {
    const el = document.getElementById('dashquestions');
    const frag = document.createDocumentFragment();
    let html = '';
    rows.forEach(function (row) {
      if (row.q < 0 || row.q >= QUESTIONS.length) return;
      const item = QUESTIONS[row.q];
      const counts = row.counts || [0, 0, 0, 0, 0];
      /* counts[0..3] = options A-D, counts[4] = no answer.
         Single choice: anything but the correct option is simply wrong. */
      const total = counts.reduce(function (a, b) { return a + b; }, 0);
      const correct = counts[item.solution] || 0;
      const wrong = total - correct;
      const pct = total ? Math.round(correct / total * 100) : 0;
      const label = document.createElement('div');
      label.className = 'barlabel';
      const b = document.createElement('b');
      b.textContent = 'Frage ' + (row.q + 1);
      label.appendChild(b);
      const rest = document.createElement('span');
      renderMath(rest, ' (' + correct + ' richtig · ' + wrong + ' falsch = ' + pct + ' %): ' + item.q);
      label.appendChild(rest);
      frag.appendChild(label);
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.innerHTML = '<div style="width:' + pct + '%;background:' + barColor(pct) + '"></div>';
      frag.appendChild(bar);
      /* Unter den Balken die richtige Antwort - mit demselben Buchstaben, den
         die Schueler im Test sehen, damit man beim Besprechen nicht sucht. */
      const ans = document.createElement('div');
      ans.className = 'baranswer';
      renderMath(ans, 'Richtig: ' + (LETTERS[item.solution] || '?') + ' — ' +
        (item.opts[item.solution] || ''));
      frag.appendChild(ans);
      html = '1';
    });
    el.textContent = '';
    if (html) el.appendChild(frag); else el.textContent = 'Noch keine Daten.';
  }

  /* make the active pool visible in the sub line */
  function tagSubline() {
    const sub = document.querySelector('.sub');
    if (TEST_MODE) sub.textContent += ' · TESTMODUS';
    else if (KLASSE) sub.textContent += ' · Klasse ' + KLASSE;
  }

  /* KaTeX is deferred: if it arrives after the first paint, redraw the math.
     Every element rendered by renderMath() keeps its source in data-src. */
  window.addEventListener('load', function () {
    if (!window.katex) return;
    document.querySelectorAll('[data-src]').forEach(function (el) {
      renderMath(el, el.dataset.src);
    });
  });

  if (PARAMS.has('auswertung')) {
    /* Auch der direkt getippte Link muss durchs Passwort - sonst waere der
       Knopf nur Zierde. */
    withGate(function () {
      initDashboard();
      placeBackToTestButton();
      tagSubline();
    });
  } else {
    if (submitBtn) submitBtn.addEventListener('click', submit);
    render();
    QuizCollapse.init(quizEl);
    placeEvalButton();   /* nach init, damit die .qbar schon steht */
    updateSubmitState();
    tagSubline();
    /* Demo helper (?test): key r fills a random answer set, ~95% correct. */
    if (TEST_MODE) {
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'r' || locked) return;
        QUESTIONS.forEach(function (item, qi) {
          let oi;
          if (Math.random() < 0.95) {
            oi = item.solution;
          } else {
            do { oi = Math.floor(Math.random() * 4); } while (oi === item.solution);
          }
          const btn = document.querySelector('.opt[data-q="' + qi + '"][data-o="' + oi + '"]');
          if (btn) btn.click();
        });
      });
    }
  }
})();
