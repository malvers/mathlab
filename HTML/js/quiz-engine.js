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
       submit: false,               // optional: hide the button entirely
       submitLabel: 'Auswertung',   // optional: rename it (default "Abgeben")
       version: 'v9',               // optional: data pool version, default 'v1'
       solutions: 'always',         // optional: readable without submitting; 'none' = no panel
       gradeScale: [[95, 1], ...],  // optional
       questions: [ { q, opts, steps, solution }, ... ]
     };

   URL switches: ?test = demo pool + key r, ?klasse=11a = own pool,
   ?auswertung = teacher dashboard, ?code=7K3M = pupil's slip code
   (leistungstest.html QR): submission is stored under that pseudonym,
   one submission per code, result retrievable via rpc/quiz_result. */
(function () {
  'use strict';

  const CFG = window.QUIZ || {};
  /* Uebungsblaetter nennen den Knopf "Auswertung", Tests behalten "Abgeben" */
  const SUBMIT_LABEL = CFG.submitLabel || 'Abgeben';
  /* Uebungsmodus: solutions readable right away instead of after "Abgeben" */
  const FREE_SOLUTIONS = CFG.solutions === 'always';
  /* quizzes without step-by-step solutions (e.g. infotest9) hide the panel */
  const NO_SOLUTIONS = CFG.solutions === 'none';

  const FOOT_ANON = 'Doc Alvers Mathe-Labor · Es werden keine persönlichen Daten gespeichert, ' +
    'nur anonyme Gesamt-Zähler.';

  /* The page markup is identical for every quiz, so the engine builds it. */
  function buildPage() {
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    wrap.innerHTML =
      '<h1></h1>' +
      '<div class="sub"></div>' +
      '<div id="quiz"></div>' +
      '<div id="dash" style="display:none">' +
        '<div class="card">' +
          '<div class="dashhead">Einzelleistungen <span class="live" id="liveinfo"></span></div>' +
          '<div id="dashscores">Noch keine Abgaben.</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="dashhead">Notenspiegel <span class="live" id="gmhint">Anzahl je Note, darunter die Punkte dafür</span></div>' +
          '<div id="dashgrades">Noch keine Abgaben.</div>' +
        '</div>' +
        '<div class="card">' +
          '<div class="dashhead">Gruppenleistung pro Frage</div>' +
          '<div id="dashquestions"></div>' +
        '</div>' +
      '</div>' +
      (CFG.submit === false ? '' :
        '<div class="actions" id="submitBox">' +
          '<button class="btn" id="submitBtn" type="button">' + SUBMIT_LABEL + '</button>' +
          '<div class="hint" id="hint"></div>' +
        '</div>') +
      '<div class="card" id="result" style="display:none">' +
        '<h2>Dein Ergebnis</h2>' +
        '<div class="score" id="score"></div>' +
        '<div id="review"></div>' +
        '<div class="avg" id="classavg">Klassen-Durchschnitt wird geladen …</div>' +
      '</div>' +
      '<footer></footer>';
    wrap.querySelector('h1').textContent = CFG.title || '';
    wrap.querySelector('footer').textContent = FOOT_ANON;
    wrap.querySelector('.sub').textContent = CFG.subtitle || '';

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
  /* ?code = the slip code from leistungstest.html; sent with the submission
     so the sealed local list can match results back to names. Server enforces
     one submission per (quiz, code). The QR brings it along; the code field
     (placeCodeField) takes it by hand - the slip says "Code eintragen", so
     there has to be a place to type it (Doc, 10.09.2026). */
  /* Slip codes: 4 characters from leistungstest.html's alphabet - no I, O, 0, 1. */
  const CODE_RE = /^[2-9A-HJ-NP-Z]{4}$/;
  function normCode(s) {
    return String(s).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  }
  let code = normCode(PARAMS.get('code') || '');
  /* ?alias = the slip's deck name (the QR carries it since 19.09.2026): the start
     screen shows it next to the code, as on the slip (Doc: "ich würde da auch den
     Nickname sagen"). Only for the pupil's eyes, never sent. Shown only while the
     code is still the one the QR brought - older slips have no alias at all. */
  const ALIAS = (PARAMS.get('alias') || '').replace(/[^A-Za-zÄÖÜäöüß-]/g, '').slice(0, 20).toUpperCase();
  const ALIAS_CODE = code;
  function slipLabel() {
    return (ALIAS && code === ALIAS_CODE ? ALIAS + ' \u00b7 ' : '') + 'Zettel-Code ' + code;
  }
  /* Slips for this very test and group exist in this browser: leistungstest.html
     keeps them under 'svp-leistungstest-v1' on the same origin. Then the teacher
     is looking at a Leistungstest even without a code in the address - above
     all in the dashboard, which never carries one (Doc, 10.09.2026). Pupils
     bring their code anyway, so their view is unchanged. */
  function slipsHere() {
    if (!KLASSE) return false;
    try {
      const rec = JSON.parse(localStorage.getItem('svp-leistungstest-v1') || '{}')[KLASSE];
      if (!rec || !rec.test) return false;
      return rec.test.split('?')[0].replace(/^.*\//, '') === location.pathname.replace(/^.*\//, '');
    } catch (e) { return false; }
  }
  const SLIPS = slipsHere();
  /* QUIZ.requireCode (Doc, 05.11.2026: "ohne Code gar nicht anfangen"): in BGY24
     two pupils left the field empty, their submissions came in without a code and
     never reached Mission Control. With the flag the test does not start without
     a valid code (codeGate) and nothing is submitted without one. The demo pool
     (?test) stays open. */
  const REQUIRE_CODE = CFG.requireCode === true && !TEST_MODE && CFG.submit !== false;
  /* empty is fine otherwise: without slips the test simply stays anonymous */
  function codeOk() { return CODE_RE.test(code) || (!code && !REQUIRE_CODE); }
  /* With a code the footer claim "anonymous" would be wrong: the submission is
     pseudonymous (Art. 4 Nr. 5 DSGVO) - say so. */
  function tagFooter() {
    const foot = document.querySelector('.wrap footer');
    if (!foot) return;
    foot.textContent = code && codeOk()
      ? 'Doc Alvers Mathe-Labor · Abgabe pseudonym unter deinem Zettel-Code ' + code +
        ' — ohne Namen. Die Zuordnung existiert nur auf dem Rechner der Lehrkraft.'
      : SLIPS
      ? 'Doc Alvers Mathe-Labor · Abgaben pseudonym unter Zettel-Codes — ohne Namen. ' +
        'Die Zuordnung existiert nur auf dem Rechner der Lehrkraft.'
      : FOOT_ANON;
  }
  tagFooter();
  const QUIZ_ID = TEST_MODE ? CFG.id + '-test'
                            : CFG.id + '-' + (CFG.version || 'v1') + (KLASSE ? '-' + KLASSE : '');
  /* soft lock against double submits per browser; tied to QUIZ_ID so a new
     quiz version automatically resets the lock */
  const DONE_KEY = 'done-' + QUIZ_ID;

  /* Notenpunkte for BGY 12 and 13 (Doc, 05.11.2026: "Wir müssen unbedingt die
     Notenpunkte der 12 und 13 nehmen" - 17 of 20 had shown "Note 2", it is
     13 NP = 1-). QUIZ.gradeScale = 'np' takes the table of svp/punktetabelle.html
     (SCALES[12]) with its rule: needed points = threshold x total, rounded up
     only on a genuine remainder. */
  const NP_SCALE = [[95, '15'], [90, '14'], [85, '13'], [80, '12'], [75, '11'], [70, '10'],
                    [65, '09'], [60, '08'], [55, '07'], [50, '06'], [45, '05'], [40, '04'],
                    [33.3, '03'], [28.3, '02'], [20, '01']];
  /* BGY Klasse 11, Note 1-6 (punktetabelle.html SCALES[11]): same rule as the
     Notenpunkte, below 25 % = 6. */
  const BGY11_SCALE = [[95, 1], [80, 2], [65, 3], [45, 4], [25, 5]];
  /* A page without QUIZ.gradeScale gets the table of its Klassenstufe from its
     file name (Doc, 05.11.2026: "nach der jeweiligen Bewertungstabelle" - the
     weekly quizzes of BGY 11-13 showed the online scale 95/80/60/40/20, which
     is no grade key: 9 of 10 read "Note 2", it is 14 NP = 1). Only the BGY
     pages: the weekly quizzes inf11test-/inf12test-/inf13test-, Mathe 11 and the
     entry tests infotest11/12/13 and mathetest12/13 ("Berufliches Gymnasium" in
     their subtitle). infotest11-* and infotest12-* are FOS weekly quizzes and,
     like OS and GY, keep the old scale. */
  const PAGE_FILE = (location.pathname.split('/').pop() || '').toLowerCase();
  const PAGE_SCALE = /^(inf12test-|inf13test-|(infotest|mathetest)1[23](\.html)?$)/.test(PAGE_FILE) ? 'np'
                   : /^(inf11test-|infotest11(\.html)?$|mathetest11(-|\.html|$))/.test(PAGE_FILE) ? 'bgy11'
                   : '';
  const SCALE_NAME = typeof CFG.gradeScale === 'string' ? CFG.gradeScale
                   : CFG.gradeScale ? '' : PAGE_SCALE;
  const NP = SCALE_NAME === 'np';
  /* the two BGY tables count units, never a rounded percent: needed units =
     threshold x total, rounded up only on a genuine remainder */
  const BY_UNITS = NP || SCALE_NAME === 'bgy11';
  function unitsMark(score, total) {
    const rows = NP ? NP_SCALE : BGY11_SCALE;
    for (let i = 0; i < rows.length; i++) {
      if (score >= Math.ceil(Number((rows[i][0] / 100 * total).toFixed(9)))) return rows[i][1];
    }
    return NP ? '00' : 6;
  }
  function npFor(score, total) { return unitsMark(score, total); }
  /* The Zensur of each Notenpunkte value, from the same table (punktetabelle.html
     SCALES[12]: 15-13 = 1, 12-10 = 2, 09-07 = 3, 06-04 = 4, 03-01 = 5, 00 = 6);
     within a Note the three values read +, plain, - (Doc, 06.11.2026: "welche
     Zensuren das sind"). The whole Note is its first digit. */
  const NP_ZENSUR = { '15': '1+', '14': '1', '13': '1\u2212', '12': '2+', '11': '2', '10': '2\u2212',
                      '09': '3+', '08': '3', '07': '3\u2212', '06': '4+', '05': '4', '04': '4\u2212',
                      '03': '5+', '02': '5', '01': '5\u2212', '00': '6' };
  /* Grading scale: [min percentage, grade]. A page may override it via QUIZ.gradeScale. */
  const GRADE_SCALE = NP ? NP_SCALE
                         : SCALE_NAME === 'bgy11' ? BGY11_SCALE.concat([[0, 6]])
                         : CFG.gradeScale || [[95, 1], [80, 2], [60, 3], [40, 4], [20, 5], [0, 6]];
  /* the scale actually in force, for the Note column of svp/leistungstest.html
     (it loads this page in a hidden frame) - one scale, not a copy there;
     quizGradeRule 'units' tells it to count units like unitsMark() */
  window.quizGradeScale = GRADE_SCALE;
  window.quizGradeUnit = NP ? 'NP' : '';
  window.quizGradeRule = BY_UNITS ? 'units' : 'percent';
  /* A Klassenarbeit with a paper part (Doc, 04.11.2026): QUIZ.partB = the points
     of Teil B, written on paper. The page then shows only the points of Teil A -
     the grade of A + B comes from svp/leistungstest.html once Teil B is entered
     there, so no pupil sees a grade that is not the final one. */
  const PART_B = Number(CFG.partB) > 0 ? Number(CFG.partB) : 0;
  /* QUIZ.noGrades: a quiz without grades, e.g. for colleagues (Doc, 12.11.2026: "nimm HIER Noten -> Fux raus") - points
     and percent only, no Note after submitting, no Notenspiegel in the dashboard; Mission Control reads it too */
  const NO_GRADES = CFG.noGrades === true;

  function gradeFor(pct) {
    for (let i = 0; i < GRADE_SCALE.length; i++) {
      if (pct >= GRADE_SCALE[i][0]) return GRADE_SCALE[i][1];
    }
    return 6;
  }
  /* The mark of score/total - one rule for the pupil's result screen and the
     Notenspiegel of the dashboard: the BGY tables count units, every other
     scale takes the rounded percent. */
  function markOf(score, total) {
    return BY_UNITS ? unitsMark(score, total) : gradeFor(Math.round(score / total * 100));
  }

  const QUESTIONS = CFG.questions || [];


  const LETTERS = ['A', 'B', 'C', 'D'];
  const answers = new Array(QUESTIONS.length).fill(-1);
  let locked = false;

  /* Answers survive a reload (KA KI FOG/FOW25-2, 02.11.2026: a swipe reloaded
     the page and "everything was gone"). Kept per test in this browser, with
     the code they were given under; after the submission they bring the
     result back instead of an empty test. Demo mode and exercise sheets keep
     nothing. */
  const KEEP_KEY = 'answers-' + QUIZ_ID;
  const KEEP_ON = !TEST_MODE && CFG.submit !== false;
  function keepAnswers() {
    if (!KEEP_ON) return;
    try { localStorage.setItem(KEEP_KEY, JSON.stringify({ code: code, answers: answers })); } catch (e) { /* no storage */ }
  }
  /* true when answers came back; marks them like a pick does */
  function restoreAnswers() {
    if (!KEEP_ON) return false;
    let kept = null;
    try { kept = JSON.parse(localStorage.getItem(KEEP_KEY) || 'null'); } catch (e) { return false; }
    if (!kept || !Array.isArray(kept.answers) || kept.answers.length !== QUESTIONS.length) return false;
    /* another slip on this device: its answers are not ours */
    if (code && kept.code && kept.code !== code) return false;
    /* typed by hand last time: the reload lost it from the field, not from here */
    if (!code && kept.code && CODE_RE.test(kept.code)) { code = kept.code; tagFooter(); }
    kept.answers.forEach(function (oi, qi) {
      if (!(oi >= 0 && oi < QUESTIONS[qi].opts.length)) return;
      answers[qi] = oi;
      document.querySelectorAll('.opt[data-q="' + qi + '"]').forEach(function (b) {
        b.classList.toggle('sel', Number(b.dataset.o) === oi);
      });
    });
    return true;
  }

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

  /* Eine Zeichnung zur Frage: das Quiz kann dasselbe wie die Aufgabenblaetter,
     naemlich ein fertiges Inline-SVG aus tools/aufgaben/svgfig.py (Doc, 09.09.2026:
     "wir haben gestern zum Abitraining ultracoole SVGs gemacht"). Das Feld ist
     optional - Fragen ohne fig sehen aus wie bisher. Der Inhalt stammt aus dem
     eigenen Generator, nicht von aussen. */
  function addFigure(card, item) {
    if (!item.fig) return;
    const fig = document.createElement('figure');
    fig.className = 'qfig';
    fig.innerHTML = item.fig;
    if (item.figcap) {
      const cap = document.createElement('figcaption');
      /* 10.10.2026 (Turing): captions carry $...$ like the questions - textContent showed
         the LaTeX raw (15 FO 12 sheets, e.g. $\overline{BF}$); quiz.py already checks them with KaTeX. */
      renderMath(cap, item.figcap);
      fig.appendChild(cap);
    }
    card.appendChild(fig);
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
    head.textContent = 'Richtige Antwort: ' + LETTERS[item.solution] + ' \u2192 ';
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
      addFigure(card, item);
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
      solBtn.title = solBtn.disabled ? 'Wird nach "' + SUBMIT_LABEL + '" freigeschaltet' : '';
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

  /* "Abgeben" unlocks only once every question has been answered - and a
     Zettel-Code, if one was typed, is complete and valid. */
  function updateSubmitState() {
    if (!submitBtn) return;
    const open = TEST_MODE ? 0 : answers.filter(function (a) { return a < 0; }).length;
    const badCode = !codeOk();
    submitBtn.disabled = open > 0 || badCode;
    if (hintEl) {
      hintEl.textContent = badCode
        ? (code.length < 4 ? 'Zettel-Code: noch ' + (4 - code.length) + ' Zeichen.'
                           : 'Diesen Zettel-Code gibt es nicht - bitte mit dem Zettel vergleichen.')
        : open === 0 ? ''
        : 'Noch ' + open + (open === 1 ? ' Frage offen.' : ' Fragen offen.');
    }
  }

  /* Single choice: picking an option always clears the previous one. */
  function pick(qi, oi, card) {
    if (locked || guardAborted) return;
    answers[qi] = oi;
    card.querySelectorAll('.opt').forEach(function (b) {
      b.classList.toggle('sel', Number(b.dataset.o) === oi);
    });
    keepAnswers();
    updateSubmitState();
    guardProgress();
  }

  /* replay === true: the result shown again after a reload - nothing is sent then,
     so a code typed by hand and lost with the reload must not block it */
  function submit(replay) {
    if (locked || guardAborted || (replay !== true && !codeOk())) return;
    locked = true;
    guardStop();
    if (submitBtn) submitBtn.disabled = true;
    const codeInput = document.getElementById('codeInput');
    if (codeInput) codeInput.disabled = true;

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
    if (NO_GRADES) {
      document.getElementById('score').innerHTML =
        score + ' / ' + QUESTIONS.length + ' <span style="font-size:0.6em">· <span style="color:' + barColor(pctOwn) + '">' +
        pctOwn + ' %</span></span>';
    } else if (PART_B) {
      document.getElementById('score').innerHTML =
        score + ' / ' + QUESTIONS.length + ' <span style="font-size:0.6em">· Punkte in Teil A</span>' +
        '<div style="font-size:0.45em; margin-top:8px">Die Note gibt es zusammen mit Teil B.</div>';
    } else {
      document.getElementById('score').innerHTML =
        score + ' / ' + QUESTIONS.length +
        ' <span style="font-size:0.6em">· ' + pctOwn + ' % · ' + (NP ? '' : 'Note ') + '<span style="color:' +
        barColor(pctOwn) + '">' + markOf(score, QUESTIONS.length) + (NP ? ' NP' : '') +
        '</span></span>';
    }

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
            p_total: QUESTIONS.length,
            p_code: code || null
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

  /* Per question: own answer as richtig/falsch plus the class percentage.
     Under each line the question itself, the own pick and - when it was wrong -
     the correct option, so the result page can be read without scrolling back
     up to the cards (Doc, 31.08.2026). */
  function renderReview(rows) {
    const byQ = {};
    (rows || []).forEach(function (r) { byQ[r.q] = r; });
    const table = document.createElement('table');
    table.className = 'revtable';
    table.innerHTML = '<thead><tr>' +
      '<th>Frage</th><th>Deine Antwort</th><th colspan="2">Klassendurchschnitt</th>' +
      '</tr></thead>';
    const body = document.createElement('tbody');
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
      const tr = document.createElement('tr');
      tr.className = 'revmain';
      tr.innerHTML = '<td>' + (qi + 1) + '</td>' +
              '<td class="' + (ok ? 'ok' : 'nok') + '">' + (ok ? 'richtig' : 'falsch') + '</td>' +
              '<td class="pct">' + (pct === null ? '' :
                '<div class="bar"><div style="width:' + pct + '%;background:' +
                barColor(pct) + '"></div></div>') + '</td>' +
              '<td class="num">' + (pct === null ? '\u2013' : pct + ' %') + '</td>';
      body.appendChild(tr);

      const det = document.createElement('tr');
      det.className = 'revq';
      const cell = document.createElement('td');
      cell.colSpan = 4;
      const qt = document.createElement('div');
      qt.className = 'rq';
      renderMath(qt, item.q);
      cell.appendChild(qt);
      const mine = document.createElement('div');
      mine.className = 'ra ' + (ok ? 'ok' : 'nok');
      const chosen = answers[qi];
      renderMath(mine, 'Deine Antwort: ' + (chosen < 0 ? 'nicht beantwortet' :
        (LETTERS[chosen] || '?') + ' \u2192 ' + (item.opts[chosen] || '')));
      cell.appendChild(mine);
      /* the correct option only where the quiz shows solutions at all */
      if (!ok && !NO_SOLUTIONS) {
        const cor = document.createElement('div');
        cor.className = 'ra ok';
        renderMath(cor, 'Richtig: ' + (LETTERS[item.solution] || '?') + ' \u2192 ' +
          (item.opts[item.solution] || ''));
        cell.appendChild(cor);
      }
      det.appendChild(cell);
      body.appendChild(det);
    });
    table.appendChild(body);
    const el = document.getElementById('review');
    el.textContent = '';
    el.appendChild(table);
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

  /* Der Weg zurueck in den Stoffverteilungsplan steht links in derselben
     Leiste wie "Auswertung" und "Alle einklappen" - nicht mehr frei am
     Fensterrand. margin-right:auto haelt ihn links, der Rest bleibt rechts. */
  function planButton() {
    const btn = pillButton('backBtn', 'Zum Plan', 'Zurueck zum Stoffverteilungsplan',
      function () { location.href = CFG.back; });
    btn.className += ' btn-back';
    return btn;
  }

  function placePlanButton() {
    if (!CFG.back) return;
    const bar = toolbar(document.getElementById('quiz'));
    bar.insertBefore(planButton(), bar.firstChild);
  }

  function placeEvalButton() {
    const bar = toolbar(document.getElementById('quiz'));
    bar.insertBefore(pillButton('evalBtn', 'Auswertung', 'Live-Auswertung - nur mit Passwort',
      function () { switchTo(true); }), bar.firstChild);
  }

  /* "QR-Codes": jump into leistungstest.html with this very test and group
     already chosen - the teacher never picks from the dropdown again. The
     page shows a stranger nothing: names live only in the teacher's browser.
     The pill floats centred between "Zum Plan" and "Auswertung" (btn-slip);
     the plan button gives up its auto margin, or the centre would drift. */
  function placeSlipButton() {
    const bar = toolbar(document.getElementById('quiz'));
    const ziel = location.pathname.replace(/^.*\//, '') + (KLASSE ? '?klasse=' + KLASSE : '');
    const btn = pillButton('slipBtn', 'QR-Codes', 'Code-Zettel mit QR fuer diese Gruppe erzeugen',
      function () { window.open('svp/leistungstest.html?ziel=' + encodeURIComponent(ziel), '_blank', 'noopener'); });
    btn.className += ' btn-slip';
    const back = bar.querySelector('.btn-back');
    if (back) {
      back.style.marginRight = '0';
      bar.insertBefore(btn, back.nextSibling);
    } else {
      bar.insertBefore(btn, bar.firstChild);
    }
  }

  /* Zettel-Code: shows the code the QR brought along, and takes it by hand
     when the address was typed. Sits under the subtitle, above the questions -
     the slip says "QR scannen, Code eintragen, Test bearbeiten". */
  function placeCodeField() {
    const row = document.createElement('label');
    row.className = 'coderow';
    row.htmlFor = 'codeInput';
    row.innerHTML = '<span>Zettel-Code</span>' +
      '<input id="codeInput" type="text" maxlength="8" autocomplete="off" ' +
      'autocapitalize="characters" spellcheck="false" placeholder="' +
      (REQUIRE_CODE ? 'vom Zettel' : 'falls vorhanden') + '">';
    const input = row.querySelector('input');
    input.value = code;
    input.addEventListener('input', function () {
      const v = normCode(input.value);
      if (input.value !== v) input.value = v;
      code = v;
      paintCode(input);
      tagFooter();
      tagContext();
      updateSubmitState();
      guardOffer();
    });
    paintCode(input);
    const sub = document.querySelector('.wrap .sub');
    sub.parentNode.insertBefore(row, sub.nextSibling);
  }

  /* green once valid; red only for a complete but impossible code, not while typing */
  function paintCode(input) {
    input.classList.toggle('ok', CODE_RE.test(code));
    input.classList.toggle('bad', code.length === 4 && !CODE_RE.test(code));
  }

  /* Der Rueckweg aus der Auswertung steht rechts neben der Ueberschrift, auf
     deren Schriftlinie. Dafuer wandert die <h1> in eine gemeinsame Zeile
     (.titlerow) - nur so richtet der Flexbox-Baseline-Modus beide wirklich
     aneinander aus; ein fester Abstand von oben trifft die Linie nie, weil
     die Titelgroesse mit dem Fenster waechst. */
  function placeBackToTestButton() {
    const h1 = document.querySelector('.wrap h1');
    const row = document.createElement('div');
    row.className = 'titlerow';
    h1.parentNode.insertBefore(row, h1);
    row.appendChild(h1);
    row.appendChild(pillButton('toTestBtn', 'Zum Test', 'Zurueck zur Testansicht',
      function () { switchTo(false); }));
    if (CFG.back) row.appendChild(planButton());
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
      renderGradeMirror(subs);
      return fetch(DB_URL + '/rest/v1/quiz_stats?quiz=eq.' + QUIZ_ID + '&order=q', {
        headers: { apikey: DB_KEY, Authorization: 'Bearer ' + DB_KEY }
      });
    }).then(function (res) { return res.json(); })
      .then(renderQuestionStats)
      .catch(function () {
        document.getElementById('liveinfo').textContent = '(Verbindung gestört — versuche weiter …)';
      });
  }

  /* How many pupils the group has (Doc, 06.11.2026: "19 Abgaben ... von so und
     so viel Gesamtschülern, dass man sofort sieht, wie viele haben nicht
     abgegeben"): the slips of this test and group that leistungstest.html keeps
     in this browser, one per pupil - codes only, no names. Read on every
     refresh, so a changed list counts at once. Without slips here (another
     browser, an anonymous test) there is no total and the count stands alone. */
  function classSize() {
    if (!SLIPS) return 0;
    try {
      const rec = JSON.parse(localStorage.getItem('svp-leistungstest-v1') || '{}')[KLASSE];
      return rec && Array.isArray(rec.ids) ? rec.ids.length : 0;
    } catch (e) { return 0; }
  }
  function countText(n) {
    const of = classSize();
    if (!of) return n + (n === 1 ? ' Abgabe' : ' Abgaben');
    return n + ' von ' + of + ' Abgaben' + (of > n ? ' · ' + (of - n) + ' ohne Abgabe' : '');
  }

  function renderScores(subs) {
    const el = document.getElementById('dashscores');
    const info = document.getElementById('liveinfo');
    if (!subs.length) {
      el.textContent = 'Noch keine Abgaben.';
      info.textContent = '(' + (classSize() ? countText(0) + ' · ' : '') + 'live, aktualisiert alle 5 s)';
      return;
    }
    let sum = 0;
    let html = '<div class="chips">';
    subs.forEach(function (s, i) {
      sum += s.score;
      const low = s.score < s.total / 2 ? ' low' : '';
      const col = chipColor(s.score, s.total);
      html += '<span class="chip' + low + '" title="Abgabe ' + (i + 1) + '" style="background:' +
              col + ';border-color:' + col + ';color:' + textOn(col) + '">' +
              s.score + '/' + s.total + '</span>';
    });
    html += '</div>';
    const avg = sum / subs.length;
    el.innerHTML = html +
      '<div class="avg">Ø <b>' + (Math.round(avg * 10) / 10) + ' / ' + QUESTIONS.length +
      '</b> (' + Math.round(avg / QUESTIONS.length * 100) + ' %)</div>' +
      '<div class="avgsub">' + countText(subs.length) + '</div>';
    info.textContent = '(' + countText(subs.length) + ' · live, aktualisiert alle 5 s)';
  }

  /* The colour of a score (Doc, 06.11.2026: "bei den Einzelleistungen das
     Farbschema ... hinterlegen" - "tatsächlich gefüllt ... wie im Histogramm"):
     the colour of its mark's bar in the Notenspiegel - the lowest score that
     still earns the mark - so a chip and its column match. With Teil B on paper
     there is no mark yet: plain percent. */
  function chipColor(score, total) {
    if (PART_B || !total) return barColor(total ? score / total * 100 : 0);
    const m = String(markOf(score, total));
    let p = score;
    while (p > 0 && String(markOf(p - 1, total)) === m) p--;
    return barColor(p / total * 100);
  }
  /* Text on a filled chip: navy or white, whichever stands out more against
     the fill (WCAG contrast) - navy on green and orange, white on red. */
  function textOn(rgb) {
    const lum = function (c) {
      const l = c.map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
    };
    const L = lum(rgb.match(/\d+/g).map(Number));
    const navy = lum([14, 36, 78]);
    return 1.05 / (L + 0.05) > (L + 0.05) / (navy + 0.05) ? '#fff' : 'rgb(14, 36, 78)';
  }

  /* Notenspiegel (Doc, 06.11.2026: "dass man bei der Auswertung auch den
     Notenspiegel sieht"): how many got which mark, best mark first, every mark
     from markOf() - the very rule of the result screen, never a second scale.
     Under each mark the points it takes, worked out with the same rule. With
     Teil B on paper there is no mark here yet. Notenpunkte pages also show the
     Zensur under each value and the average Note next to the average NP - the
     mean of the pupils' whole Noten from NP_ZENSUR (Doc, 06.11.2026: "hinter
     den Notenpunkten noch Gedankenstrich, Note ... die Durchschnittsnote"). */
  function renderGradeMirror(subs) {
    const el = document.getElementById('dashgrades');
    if (!el) return;
    if (NO_GRADES) { el.closest('.card').style.display = 'none'; return; }
    if (PART_B) {
      el.textContent = 'Die Noten gibt es erst zusammen mit Teil B (Papier) – deshalb hier kein Notenspiegel.';
      return;
    }
    if (!subs.length) { el.textContent = 'Noch keine Abgaben.'; return; }
    const hint = document.getElementById('gmhint');
    if (hint && NP) hint.textContent = 'Anzahl je Notenpunkte, darunter Zensur und Punkte dafür';
    const steps = [];
    GRADE_SCALE.forEach(function (st) { if (steps.indexOf(String(st[1])) < 0) steps.push(String(st[1])); });
    const floor = NP ? '00' : '6';
    if (steps.indexOf(floor) < 0) steps.push(floor);
    /* points per mark for this test's length */
    const T = QUESTIONS.length;
    const range = {};
    for (let p = 0; p <= T; p++) {
      const m = String(markOf(p, T));
      if (!range[m]) range[m] = [p, p];
      range[m][1] = p;
    }
    const count = {};
    steps.forEach(function (m) { count[m] = 0; });
    let sum = 0;
    let noteSum = 0;
    subs.forEach(function (s) {
      const m = String(markOf(s.score, s.total));
      if (!(m in count)) { count[m] = 0; steps.push(m); }
      count[m]++;
      sum += Number(m);
      if (NP) noteSum += parseInt(NP_ZENSUR[m], 10);
    });
    const max = Math.max.apply(null, steps.map(function (m) { return count[m]; }));
    let html = '<div class="gm' + (steps.length > 8 ? ' many' : '') + '" style="--gm-n:' + steps.length + '">';
    steps.forEach(function (m) {
      const r = range[m];
      const n = count[m];
      const h = n ? Math.max(6, Math.round(n / max * 100)) : 0;
      const col = barColor(r ? r[0] / T * 100 : 0);
      html += '<div class="gm-col">' +
        '<div class="gm-n' + (n ? '' : ' zero') + '">' + n + '</div>' +
        '<div class="gm-bar"><i style="height:' + h + '%;background:' + col + '"></i></div>' +
        '<div class="gm-g">' + m + '</div>' +
        (NP ? '<div class="gm-z">' + (NP_ZENSUR[m] || '') + '</div>' : '') +
        '<div class="gm-r">' + (!r ? '–' : r[0] === r[1] ? r[0] : r[0] + '–' + r[1]) + '</div>' +
      '</div>';
    });
    html += '</div>';
    const oneDec = function (x) { return (Math.round(x * 10) / 10).toFixed(1).replace('.', ','); };
    const avg = oneDec(sum / subs.length);
    el.innerHTML = html + '<div class="avg gm-avg">Ø ' +
      (NP ? '<b>' + avg + ' NP</b> – Note <b>' + oneDec(noteSum / subs.length) + '</b>'
          : 'Note <b>' + avg + '</b>') + '</div>';
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
      renderMath(ans, 'Richtig: ' + (LETTERS[item.solution] || '?') + ' \u2192 ' +
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

  /* With a Zettel-Code the page is a Leistungstest, no longer anonymous:
     "Anonymer Eingangstest ..." turns into "Leistungstest ..." in the heading
     and the tab, and the sub line says so (Doc, 10.09.2026). Follows the
     code like the footer does, so typing one flips it too. */
  const TAB_TITLE = document.title;
  let subBase = null;
  function tagContext() {
    const coded = (!!code && codeOk()) || SLIPS;
    const swap = function (t) {
      return coded ? t.replace(/^Anonymer Eingangstest/, 'Leistungstest') : t;
    };
    document.querySelector('.wrap h1').textContent = swap(CFG.title || '');
    document.title = swap(TAB_TITLE);
    const sub = document.querySelector('.wrap .sub');
    if (subBase === null) subBase = sub.textContent;   /* after tagSubline: keeps "· Klasse ..." */
    sub.textContent = coded
      ? subBase.replace('anonyme Einzelscores', 'Einzelscores unter Zettel-Code') + ' · Leistungstest mit Zettel-Code'
      : subBase;
  }

  /* --- Test guard (Doc, 18.09.2026) ----------------------------------------
     As in the Saxon Kompetenztest (onlinetest.schule): with a slip code the
     test starts in full screen, and leaving it - another tab or app, the
     window losing focus, Esc out of full screen - covers the test with a red
     lock screen. Every leave is reported (rpc quiz_leave) and shows up next to
     the name in svp/leistungstest.html. Since 02.11.2026 only the teacher lets
     the pupil go on (Doc: "Weitermachen nur ich!"): the lock has no button,
     the server holds the leave open until Mission Control releases it (rpc
     quiz_release), and quiz_ping answers 'away' until then - also after a
     reload. A web page cannot lock the device: this locks the test, not the
     screen. Anonymous tests and exercise sheets stay untouched; QUIZ.guard =
     false switches it off for a single test. */
  const GUARD_ON = CFG.guard !== false && CFG.submit !== false;
  let guardEl = null;
  let guardMode = '';         /* the face showing: 'start' | 'code' | 'lock' | 'abort' */
  let guardArmed = false;     /* from "Test starten" until the submission */
  let guardAway = false;      /* lock screen showing, waiting for the teacher */
  let guardAwaySeen = false;  /* the server has this leave - only then is 'running' a release */
  let guardKind = '';         /* what the open leave was, to report it again if it got lost */
  let awayTimer = null;       /* faster beat while locked, so a release shows within seconds */
  let guardAborted = false;   /* the teacher ended this test (Mission Control) */
  let guardLeaves = 0;
  let guardQuietUntil = 0;    /* going full screen may blur the window for a moment */
  /* Tablets and phones drop full screen by themselves: a swipe down at the
     top ends it (FOG/FOW25-2, 02.11.2026: "scrolled down, kicked out"). There
     a lost full screen is no leave - the next tap brings it back; another tab
     or app still locks the test. */
  const GUARD_TOUCH = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  let pingTimer = null;
  let pingSoon = null;

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }
  function enterFullscreen() {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!req || fsElement()) return;
    keepScrollThroughFullscreen();
    try {
      const p = req.call(el);
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* iPhone: no full screen for pages - the other triggers still work */ }
  }
  /* Going full screen throws tablets back to the top of the page. On touch the
     tap on an answer brings a lost full screen back (GUARD_TOUCH), so a pupil far
     down picked an answer and had to scroll all the way down again after every
     tap (Info 9b, 06.11.2026). Remember the place and put it back while the
     switch settles; a new touch by the pupil ends the restoring at once. */
  function keepScrollThroughFullscreen() {
    const y = window.scrollY || window.pageYOffset || 0;
    if (y < 1) return;
    let done = false;
    const back = function () {
      if (done) return;
      const now = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(now - y) > 2) window.scrollTo(0, y);
    };
    const stop = function () {
      done = true;
      window.removeEventListener('touchstart', stop, true);
      window.removeEventListener('wheel', stop, true);
      ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
        document.removeEventListener(ev, back);
      });
    };
    window.addEventListener('touchstart', stop, { capture: true, passive: true });
    window.addEventListener('wheel', stop, { capture: true, passive: true });
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
      document.addEventListener(ev, back);
    });
    [0, 60, 150, 300, 500, 800].forEach(function (ms) { setTimeout(back, ms); });
    setTimeout(stop, 1000);
  }
  function exitFullscreen() {
    const ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (!ex || !fsElement()) return;
    try {
      const p = ex.call(document);
      if (p && p.catch) p.catch(function () {});
    } catch (e) { /* nothing to undo */ }
  }

  /* keepalive: a leave by closing or reloading the tab still gets through.
     Durations come from the server clock ('back' closes the open leave). */
  function reportGuard(kind) {
    fetch(DB_URL + '/rest/v1/rpc/quiz_leave', {
      method: 'POST',
      keepalive: true,
      headers: {
        apikey: DB_KEY,
        Authorization: 'Bearer ' + DB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_quiz: QUIZ_ID, p_code: code, p_kind: kind })
    }).catch(function () {});
  }

  /* Mission Control (svp/leistungstest.html): a heartbeat every 15 s plus one
     shortly after each answer tells the teacher "working, 12 of 20"; the reply
     carries the run state ('running' | 'away' | 'aborted'), so an abort or a
     release by the teacher arrives here within one beat - and so does taking
     an abort back. */
  /* The beat also says how many answers are right so far (Doc, 11.11.2026: "auch während des Tests schon die Note
     einblenden, die zu erwarten ist"), counted by the very rule of the score on submitting; only the teacher's
     session can read it back (quiz_live). A server without the five-argument quiz_ping yet
     (supabase/migrations/20261111_quiz_live_correct.sql) answers 404 - then this page beats the old way, so the
     heartbeat never stops over it. */
  let pingCorrect = true;
  function rightSoFar() {
    let n = 0;
    QUESTIONS.forEach(function (item, qi) { if (answers[qi] === item.solution) n++; });
    return n;
  }
  function guardPing() {
    const beat = {
      p_quiz: QUIZ_ID,
      p_code: code,
      p_answered: answers.filter(function (a) { return a >= 0; }).length,
      p_total: QUESTIONS.length
    };
    if (pingCorrect) beat.p_correct = rightSoFar();
    fetch(DB_URL + '/rest/v1/rpc/quiz_ping', {
      method: 'POST',
      headers: {
        apikey: DB_KEY,
        Authorization: 'Bearer ' + DB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(beat)
    }).then(function (res) {
      /* 404: no such function (PGRST202), 300: not unique (PGRST203) - beat again without p_correct */
      if (!res.ok && pingCorrect && (res.status === 404 || res.status === 300)) {
        pingCorrect = false;
        guardPing();
        return null;
      }
      return res.ok ? res.json() : null;
    }).then(function (state) {
      if (!guardArmed) return;
      if (state === 'aborted') {
        if (guardAborted) return;
        guardAborted = true;
        guardAway = false;
        awayPoll(false);
        /* "Er" stays with its sentence (no-break space) - on a phone it stood alone at the line's end (Doc, 19.09.2026) */
        showGuard('abort', 'Test beendet',
          'Deine Lehrkraft hat deinen Test beendet. Er wird nicht gewertet.',
          'Bitte melde dich bei deiner Lehrkraft.', '');
      } else if (state === 'away') {
        guardAwaySeen = true;
        guardAborted = false;
        /* the server still holds a leave: after a reload, or an abort taken back */
        if (!guardAway) lockGuard('');
      } else if (state === 'running' && guardAborted) {
        guardAborted = false;
        showGuard('start', 'Es geht weiter',
          'Deine Lehrkraft hat deinen Test wieder freigegeben.',
          slipLabel(), 'Weiter mit dem Test');
      } else if (state === 'running' && guardAway) {
        /* the report of the leave got lost (network): send it again, never
           read that as a release */
        if (!guardAwaySeen) { reportGuard(guardKind); return; }
        guardAway = false;
        awayPoll(false);
        showGuard('start', 'Es geht weiter',
          'Deine Lehrkraft hat dich wieder freigegeben.',
          slipLabel(), 'Weiter mit dem Test');
      }
    }).catch(function () { /* next beat */ });
  }
  function awayPoll(on) {
    clearInterval(awayTimer);
    awayTimer = on ? setInterval(guardPing, 3000) : null;
  }
  function guardProgress() {
    if (!guardArmed) return;
    clearTimeout(pingSoon);
    pingSoon = setTimeout(guardPing, 1500);
  }

  /* One screen, three faces: 'start' (light, before the test), 'lock' (red,
     after a leave) and 'abort' (red, ended by the teacher - no button). */
  function showGuard(mode, title, text, note, label) {
    if (!guardEl) {
      guardEl = document.createElement('div');
      guardEl.setAttribute('role', 'dialog');
      guardEl.setAttribute('aria-modal', 'true');
      guardEl.innerHTML =
        '<div class="guard-box">' +
          '<div class="guard-title"></div>' +
          '<p class="guard-text"></p>' +
          '<p class="guard-note"></p>' +
          '<input type="text" class="guard-code" maxlength="8" autocomplete="off" ' +
            'autocapitalize="characters" spellcheck="false" aria-label="Zettel-Code" hidden>' +
          '<button type="button" class="guard-btn"></button>' +
        '</div>';
      guardEl.querySelector('.guard-btn').addEventListener('click', guardGo);
      guardEl.querySelector('.guard-code').addEventListener('input', gateInput);
      guardEl.querySelector('.guard-code').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && CODE_RE.test(code) && codeCleared()) guardGo();
      });
      document.body.appendChild(guardEl);
    }
    /* 'code' is the start screen with the code field (codeGate) */
    guardMode = mode;
    guardEl.className = 'guard guard-' + (mode === 'code' ? 'start' : mode);
    const gateIn = guardEl.querySelector('.guard-code');
    gateIn.hidden = mode !== 'code';
    guardEl.querySelector('.guard-title').textContent = title;
    guardEl.querySelector('.guard-text').textContent = text;
    guardEl.querySelector('.guard-note').textContent = note;
    const btn = guardEl.querySelector('.guard-btn');
    btn.textContent = label;
    btn.hidden = !label;
    btn.disabled = mode === 'code' && !CODE_RE.test(code);
    guardEl.querySelector('.guard-note').classList.remove('guard-warn');
    guardEl.hidden = false;
    document.documentElement.classList.add('guard-open');
    if (mode === 'code') gateIn.focus();
    else if (label) btn.focus();
  }
  function hideGuard() {
    if (guardEl) guardEl.hidden = true;
    document.documentElement.classList.remove('guard-open');
  }

  /* Start screen: hides the questions until the pupil starts - the click is
     also the user gesture full screen needs. Offered as soon as a valid code
     is there (QR at load, or typed by hand). */
  function guardOffer() {
    if (!GUARD_ON || guardArmed || locked) return;
    try { if (!TEST_MODE && localStorage.getItem(DONE_KEY) === '1') return; } catch (e) { /* no storage */ }
    if (!CODE_RE.test(code)) {
      if (REQUIRE_CODE) codeGate();
      return;
    }
    showGuard('start', 'Leistungstest',
      'Der Test läuft im Vollbild. Verlässt du ihn (anderer Tab, andere App, Esc), ' +
      'wird er unterbrochen, und nur deine Lehrkraft kann dich wieder freigeben.',
      slipLabel(),
      'Test starten');
    if (REQUIRE_CODE) { paintVerdict(); askCode(); }
  }

  /* Only codes of the teacher's list start (Doc, 05.11.2026: "die Codes nehmen wir
     gar nicht an"). Mission Control puts the list's codes - never names - on the
     server (rpc quiz_codes_set); before "Test starten" turns green the page asks
     rpc quiz_code_ok: 'ok' starts, 'unknown' is a typo (compare with the slip),
     'nolist' means Mission Control has not been opened for this test yet - asked
     again every 5 s, so the pupil gets in as soon as the teacher opens it. A
     network error lets the pupil start as before: a flaky check must not lock a
     whole class out (and the old server without the rpc answers 404 = start). */
  let verdict = '';         /* '' | 'checking' | 'ok' | 'unknown' | 'nolist' | 'error' */
  let verdictCode = '';
  let verdictTimer = null;
  function codeCleared() { return verdictCode === code && (verdict === 'ok' || verdict === 'error'); }
  function askCode() {
    clearTimeout(verdictTimer);
    if (!REQUIRE_CODE || !CODE_RE.test(code)) return;
    const asked = code;
    if (verdictCode !== asked || (verdict !== 'nolist' && verdict !== 'checking')) verdict = 'checking';
    verdictCode = asked;
    fetch(DB_URL + '/rest/v1/rpc/quiz_code_ok', {
      method: 'POST',
      headers: {
        apikey: DB_KEY,
        Authorization: 'Bearer ' + DB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_quiz: QUIZ_ID, p_code: asked })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (v) {
      if (code !== asked) return;
      verdict = v === 'ok' || v === 'unknown' || v === 'nolist' ? v : 'error';
      afterVerdict();
    }).catch(function () {
      if (code !== asked) return;
      verdict = 'error';
      afterVerdict();
    });
  }
  function afterVerdict() {
    if (verdict === 'unknown' && guardMode === 'start') { codeGate(); return; }
    paintVerdict();
    if (verdict === 'nolist' && guardEl && !guardEl.hidden) verdictTimer = setTimeout(askCode, 5000);
  }
  /* the start screen (QR) or the code screen, as far as the server's answer goes */
  function paintVerdict() {
    if (!guardEl || guardEl.hidden || (guardMode !== 'start' && guardMode !== 'code') || guardArmed) return;
    const btn = guardEl.querySelector('.guard-btn');
    const note = guardEl.querySelector('.guard-note');
    const inp = guardEl.querySelector('.guard-code');
    const valid = CODE_RE.test(code);
    const known = valid && verdictCode === code;
    btn.disabled = !(valid && codeCleared());
    inp.classList.toggle('ok', valid && codeCleared());
    inp.classList.toggle('bad', (code.length === 4 && !valid) || (known && verdict === 'unknown'));
    note.classList.toggle('guard-warn', known && (verdict === 'unknown' || verdict === 'nolist'));
    if (!valid) note.textContent = guardMode === 'code' ? '4 Zeichen, sie stehen auf deinem Zettel' : slipLabel();
    else if (!known || verdict === 'checking') note.textContent = 'Code wird geprüft …';
    else if (verdict === 'unknown') note.textContent = 'Diesen Code gibt es für diesen Test nicht – bitte genau mit deinem Zettel vergleichen.';
    else if (verdict === 'nolist') note.textContent = 'Deine Lehrkraft hat die Codes für diesen Test noch nicht freigegeben – bitte kurz warten oder melden.';
    else note.textContent = guardMode === 'code' ? 'Zettel-Code ' + code : slipLabel();
  }

  /* "Test starten", and "Weiter mit dem Test" once the teacher has released
     the pupil or taken an abort back. */
  /* No code, no test (QUIZ.requireCode): the start screen asks for the code
     first; "Test starten" stays grey until it is a valid slip code. */
  function codeGate() {
    showGuard('code', 'Leistungstest',
      'Gib zuerst den Code von deinem Zettel ein. Ohne Code kannst du den Test nicht starten.',
      '4 Zeichen, sie stehen auf deinem Zettel', 'Test starten');
    const inp = guardEl.querySelector('.guard-code');
    inp.value = code;
    paintVerdict();
    if (CODE_RE.test(code) && !(verdictCode === code && verdict === 'unknown')) askCode();
  }
  function gateInput() {
    const inp = guardEl.querySelector('.guard-code');
    const v = normCode(inp.value);
    if (inp.value !== v) inp.value = v;
    code = v;
    clearTimeout(verdictTimer);
    if (CODE_RE.test(code)) askCode();
    paintVerdict();
    /* the field on the page shows the same code */
    const codeInput = document.getElementById('codeInput');
    if (codeInput) { codeInput.value = code; paintCode(codeInput); }
    tagFooter();
    tagContext();
    updateSubmitState();
  }

  /* The screen stays on while the test runs (Doc, 11.11.2026: "Wenn das Mobiltelefon den Bildschirm wegschaltet, also
     in Sleep-Modus geht, dann ist auch aus dem Test rausgeflogen. Das geht auch nicht."): a phone that dims and locks
     itself hides the page just like a switch to another app, and the page cannot tell the two apart. The Screen Wake
     Lock API (Safari from iOS 16.4, Chrome on Android) keeps the screen awake; the browser drops the lock whenever the
     page is hidden, so it is asked for again each time the page comes back. Without the API nothing changes. */
  let wakeLock = null;
  function keepAwake() {
    if (!guardArmed || wakeLock || document.hidden || !('wakeLock' in navigator)) return;
    navigator.wakeLock.request('screen').then(function (l) {
      wakeLock = l;
      l.addEventListener('release', function () { if (wakeLock === l) wakeLock = null; });
      if (!guardArmed) letSleep();
    }).catch(function () { /* not allowed just now (battery saver, page hidden): the next return asks again */ });
  }
  function letSleep() {
    const l = wakeLock;
    wakeLock = null;
    if (l) l.release().catch(function () {});
  }

  function guardGo() {
    if (guardAborted || guardAway) return;
    if (REQUIRE_CODE && !(CODE_RE.test(code) && codeCleared()) && !guardArmed) return;
    clearTimeout(verdictTimer);
    guardQuietUntil = Date.now() + 1500;
    enterFullscreen();
    if (!guardArmed) {
      guardArmed = true;
      /* the code the leaves are filed under must not change mid-test */
      const codeInput = document.getElementById('codeInput');
      if (codeInput) codeInput.disabled = true;
      guardPing();
      pingTimer = setInterval(guardPing, 15000);
    }
    keepAwake();
    hideGuard();
  }

  /* The red lock: no button - it lifts only when the teacher releases. hhmm is
     empty when the lock comes from the server (a leave from before a reload). */
  function lockGuard(hhmm) {
    guardAway = true;
    awayPoll(true);
    showGuard('lock', 'Test unterbrochen',
      (hhmm ? 'Du hast den Test um ' + hhmm + ' Uhr verlassen.' : 'Du hast den Test verlassen.') +
      ' Nur deine Lehrkraft kann dich wieder freigeben – bitte melde dich.',
      hhmm ? guardLeaves + '. Unterbrechung' : slipLabel(), '');
  }

  function guardLeave(kind) {
    if (!guardArmed || guardAway || guardAborted || locked || Date.now() < guardQuietUntil) return;
    guardLeaves++;
    guardKind = kind;
    guardAwaySeen = false;
    reportGuard(kind);
    const t = new Date();
    lockGuard(String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0'));
  }

  /* After the submission there is nothing left to guard. */
  function guardStop() {
    if (!guardArmed) return;
    guardArmed = false;
    guardAway = false;
    clearInterval(pingTimer);
    clearTimeout(pingSoon);
    awayPoll(false);
    letSleep();
    hideGuard();
    exitFullscreen();
  }

  /* A short look away is no leave (Doc, 11.11.2026, KA FOS25-2 on iPhones: "auch wenn man die Uhrzeit runterzieht,
     gilt das offensichtlich als testverlassen" - pulling down the status bar, or a swipe up from the bottom edge
     meant as scrolling, hides the page for a moment). Only an absence of GUARD_GRACE or longer locks the test; a real
     switch to another app or tab still does. Phones put the timers of a hidden page to sleep, so the length is taken
     from the clock when the page comes back; the timer catches the desktop, where the page keeps running while another
     window has the focus. QUIZ.guardGrace (ms) changes it for one test, 0 = the old instant lock. */
  const GUARD_GRACE = typeof CFG.guardGrace === 'number' ? Math.max(0, CFG.guardGrace) : 3000;
  let awaySince = 0, awayKind = '', graceTimer = null;
  function awayStart(kind) {
    if (awaySince) return;
    awaySince = Date.now();
    awayKind = kind;
    clearTimeout(graceTimer);
    /* still away when it fires (desktop), or fired late because it slept (phone): either way the absence was long */
    graceTimer = setTimeout(function () {
      if (awaySince && (document.hidden || !document.hasFocus() || Date.now() - awaySince >= GUARD_GRACE)) awayEnd(true);
    }, GUARD_GRACE);
  }
  function awayEnd(long) {
    if (!awaySince) return;
    const kind = awayKind;
    long = long || Date.now() - awaySince >= GUARD_GRACE;
    awaySince = 0;
    awayKind = '';
    clearTimeout(graceTimer);
    if (long) guardLeave(kind);
  }

  function guardWatch() {
    if (!GUARD_ON) return;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) awayStart('tab');
      else {
        keepAwake();                                  /* the browser let go of the wake lock while hidden */
        if (document.hasFocus()) awayEnd(false);
      }
    });
    /* a real switch keeps the focus away; a flicker is back within a moment */
    window.addEventListener('blur', function () {
      setTimeout(function () { if (!document.hasFocus()) awayStart('focus'); }, 250);
    });
    window.addEventListener('focus', function () { if (!document.hidden) awayEnd(false); });
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
      document.addEventListener(ev, function () { if (!fsElement() && !GUARD_TOUCH) guardLeave('fullscreen'); });
    });
    if (GUARD_TOUCH) {
      document.addEventListener('click', function () {
        if (!guardArmed || guardAway || guardAborted || locked || fsElement()) return;
        guardQuietUntil = Date.now() + 1500;
        enterFullscreen();
      }, true);
    }
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
      tagContext();
    });
  } else {
    if (submitBtn) submitBtn.addEventListener('click', submit);
    render();
    const restored = restoreAnswers();
    QuizCollapse.init(quizEl);
    /* Uebungsmodus (submit:false): es wird nie etwas abgegeben, also fuehren
       die beiden Lehrer-Pillen - Live-Auswertung und QR-Code-Zettel - ins
       Leere und bleiben weg (Doc, 07.09.2026). */
    if (CFG.submit !== false) placeEvalButton();   /* nach init, damit die .qbar schon steht */
    placePlanButton();
    if (CFG.submit !== false) placeSlipButton();   /* zuletzt: braucht den Plan-Knopf schon in der Leiste */
    if (CFG.submit !== false) placeCodeField();    /* Uebungsmodus gibt nie ab - kein Code noetig */
    updateSubmitState();
    tagSubline();
    tagContext();
    guardWatch();
    guardOffer();
    /* submitted before the reload: show the result again, nothing is sent twice
       (sendStats only reads the class average once DONE_KEY is set) */
    let doneHere = false;
    try { doneHere = localStorage.getItem(DONE_KEY) === '1'; } catch (e) { /* no storage */ }
    if (restored && doneHere) submit(true);
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
