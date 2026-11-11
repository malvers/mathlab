// Doc Alvers Mathe-Labor - the slide "Üben & Nachlesen" at the end of a deck (Doc, 11.11.2026: "Wir müssen in den
// Mathe-Decks überall ... den Verweis auf die Aufgaben machen, die wir im Stoffverteilungsplan haben, dass man den
// direkt sehen kann. Und natürlich auch zu den Seiten im Mathebuch jeweils").
//
// The slide is vorspann/verweise.html (a deck holds the stub <section class="slide" data-aus="vorspann/verweise.html#1">),
// its <div class="verweise-box"></div> is filled here; deck.js loads this file only in a deck that has one.
//   which plan    the deck's name says it: mathe11-quadratisch.html belongs to svp/mathe/mathe11.html and the book
//                 buch/mathe11/ - svp/plan-verweise.json (tools/build-plan-suchindex.mjs) holds that plan's weeks and
//                 the book's Lerneinheiten with their hours.
//   which week    the week whose material names this deck (decks/<name>.html) - the material lives in the cloud
//                 (svp_plan_edits, readable by anyone), so a deck Doc adds to a week in the SVP shows its exercises at
//                 once. Two weeks naming the same deck: both, in the order of the school year.
//   the exercises what the SVP's "Aufgaben" offers for that week: the week's set (quiz), every exercise sheet of the
//                 material (/aufgaben/) and every further set (/mathetest...), and the red "Das kann drankommen"
//                 list, which opens in the SVP (?kw=).
//   the book      the week's hours inside its Lernbereich (u '16–20/75') against the hours of the book's Lerneinheiten
//                 (3.3 LE 1 = hours 16-20 of LB 3) - a week may name its Lerneinheit by hand (buch: 'lb3-3.html#le2').
//                 The printed page comes live from the book's page map on R2 (buch/seiten/<book>/seiten.json, the
//                 same one the book's page overview uses), so it is the page of the print edition as it stands.
//   the QR        the week's first exercise set on the live site (a phone cannot reach localhost).
// Plain REST, no supabase-js. Every .verweise-box is filled, the overview's and the presenter's copies too.
(function () {
  'use strict';
  const DB = 'https://fyfhxzyymmurlaenmzse.supabase.co/rest/v1/';
  const KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';   // publishable (public by design), as in vote.html
  const MEDIA = 'https://pub-5e3b331002a14e5a8532e12ebae95bf9.r2.dev/buch/';
  const LIVE = 'https://docalvers.de/';
  const own = [].find.call(document.scripts, function (s) { return /\/deck-verweise\.js(\?|$)/.test(s.src); });
  const DECKS = new URL('./', own ? own.src : location.href);
  const SITE = new URL('../', DECKS);                 // HTML/ - the site's root, here or live
  const DECK = decodeURIComponent(location.pathname.split('/').pop()).replace(/\.html$/, '');
  const NAME = DECK.split('-')[0];                    // mathe11-quadratisch -> mathe11
  const MAX_EINTRAEGE = 5, MAX_LE = 3;   // what fits the field: five entries (the red list counts), three Lerneinheiten

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // the plan's formulas ($...$) are shown as plain text here: the slide names topics, it does not set maths
  const plain = s => String(s || '').replace(/\$([^$]*)\$/g, '$1').replace(/\\[a-z]+\{([^}]*)\}/gi, '$1').replace(/\\/g, '');
  function getJson(url, init) {
    return fetch(url, Object.assign({ cache: 'no-cache' }, init || {}))
      .then(function (r) { if (!r.ok) throw new Error(url + ': HTTP ' + r.status); return r.json(); });
  }
  // a link of the site: on docalvers.de it goes where it says, from localhost to the local copy of the same page
  function siteUrl(href, base) {
    let u;
    try { u = new URL(href, base || SITE); } catch (_) { return null; }
    if (/(^|\.)docalvers\.de$/.test(u.hostname)) return new URL(u.pathname.replace(/^\//, '') + u.search + u.hash, SITE);
    return u;
  }
  function liveUrl(u) {
    const rel = u.href.indexOf(SITE.href) === 0 ? u.href.slice(SITE.href.length) : null;
    return rel === null ? u.href : LIVE + rel;
  }

  // the material line of a week: "Label URL «what it is» [[datei:...]] Label URL ..." (svp-plan-material.js)
  function eintraege(text) {
    const out = [], re = /(https?:\/\/[^\s«»]+)(?:\s*«([^»]*)»)?(?:\s*\[\[[^\]]*\]\])*/g;
    let last = 0, m;
    text = String(text || '');
    while ((m = re.exec(text))) {
      out.push({ label: text.slice(last, m.index).replace(/\[\[[^\]]*\]\]/g, '').trim(), url: m[1], desc: (m[2] || '').trim() });
      last = re.lastIndex;
    }
    return out;
  }
  const istUebung = u => /\/aufgaben\//.test(u.pathname) || /\/mathetest[^/]*\.html$/.test(u.pathname);
  const istDieses = u => u.pathname.split('/').pop() === DECK + '.html' && /\/decks\//.test(u.pathname);

  // the week as it stands: the plan file's row, the cloud's fields over it (an override that names quiz/redBtn, even
  // as null, replaces the file's - the rule of svp-plan-aufgaben.js quizSource)
  function wochen(plan, edits) {
    const byI = {};
    plan.wochen.forEach(function (w) { byI[w.i] = Object.assign({}, w); });
    Object.keys(edits || {}).forEach(function (k) {
      const e = edits[k];
      if (!e || typeof e !== 'object' || !/^\d+$/.test(k)) return;
      const w = byI[k] || (byI[k] = { i: +k });
      ['kw', 'nr', 'topic', 'type', 'u', 'material'].forEach(function (f) {
        if (e[f] === undefined) return;
        w[{ topic: 'thema', type: 'typ' }[f] || f] = e[f];
      });
      if (Object.prototype.hasOwnProperty.call(e, 'quiz')) w.quiz = e.quiz ? (typeof e.quiz === 'string' ? { href: e.quiz } : e.quiz) : null;
      if (Object.prototype.hasOwnProperty.call(e, 'redBtn')) w.rot = e.redBtn && e.redBtn.src ? { label: e.redBtn.label, title: e.redBtn.title } : null;
    });
    return Object.keys(byI).map(k => byI[k]).sort((a, b) => a.i - b.i);
  }

  function aufgaben(w, planUrl) {
    const list = [], seen = {};
    function add(href, label, desc, base, art) {
      const u = siteUrl(href, base);
      if (!u || seen[u.pathname]) return;
      seen[u.pathname] = 1;
      const m = /^(.*?)\s*\((\d+)\)\s*$/.exec(label || '');
      list.push({ url: u, name: m ? m[1] : (label || 'Aufgaben'), n: m ? m[2] : '', desc: desc || '', art: art || '' });
    }
    if (w.quiz && w.quiz.href) add(w.quiz.href, w.quiz.label || 'Aufgaben', '', planUrl);
    eintraege(w.material).forEach(function (e) {
      let u;
      try { u = new URL(e.url); } catch (_) { return; }
      if (istUebung(u)) add(e.url, e.label, e.desc, null, /\/aufgaben\//.test(u.pathname) ? 'text' : '');
    });
    return list;
  }

  // the week's Lerneinheiten: by hand (w.buch), else its hours inside the Lernbereich against the book's
  function lerneinheiten(buch, w) {
    const out = [];
    if (w.buch) {
      [].concat(w.buch).forEach(function (ref) {
        const p = String(ref).split('#'), k = buch.kapitel.find(x => x.f === p[0]), le = k && k.le.find(x => x.s === p[1]);
        if (k && le) out.push({ k: k, le: le });
      });
      return out;
    }
    const m = /^(\d+)\s*[–-]\s*(\d+)/.exec(w.u || '');
    if (!m || !w.typ) return out;
    const a = +m[1], b = +m[2];
    let bis = 0;
    buch.kapitel.filter(k => k.lb === w.typ).forEach(function (k) {
      k.le.forEach(function (le) {
        const von = bis + 1;
        bis += le.u;
        if (von <= b && a <= bis) out.push({ k: k, le: le });
      });
    });
    return out;
  }

  // printed pages: "lb3-3.html|le1|4" per block on each page; a section's first page, and its solutions - the
  // first page where it turns up again after a gap (the Lösungen at the back of the book)
  function seitenVon(map) {
    const first = {}, loes = {}, last = {};
    (map && map.seiten || []).forEach(function (zs, i) {
      const p = i + 1, here = {};
      zs.forEach(function (z) { const t = z.split('|'); here[t[0] + '|' + t[1]] = 1; });
      Object.keys(here).forEach(function (key) {
        if (!(key in first)) first[key] = p;
        else if (!(key in loes) && p > last[key] + 1) loes[key] = p;
        last[key] = p;
      });
    });
    return { first: first, loes: loes };
  }

  function qrSvg(text) {
    if (typeof qrcode === 'undefined') return '';
    const q = qrcode(0, 'L');
    q.addData(text);
    q.make();
    return q.createSvgTag({ scalable: true, margin: 0 });
  }

  function render(d) {
    const planUrl = new URL('svp/' + d.plan.href, SITE);
    const svp = kw => new URL('svp/' + d.plan.href + (kw ? '?kw=' + kw : ''), SITE).href;
    let links = '', qr = '', erste = null, weitere = 0;
    if (!d.hits.length) {
      links = '<div class="vw-woche">Im Stoffverteilungsplan</div>' +
        '<a class="vw-a vw-svp" href="' + esc(svp()) + '" target="_blank" rel="noopener"><span class="vw-n">›</span><span class="vw-txt">' +
        '<span class="vw-name">Alle Aufgaben stehen im Stoffverteilungsplan</span></span></a>';
    } else {
      // one group per week (two only when two weeks name this deck): its heading, its sets, its red list
      d.hits.forEach(function (w) {
        const auf = aufgaben(w, planUrl);
        if (!erste && auf.length) erste = auf[0];
        links += '<div class="vw-woche">KW ' + esc(w.kw) + (w.thema ? ' · ' + esc(plain(w.thema)) : '') + '</div>';
        // the week's set first, then its first written sheet, then the rest in the material's order - so a long list
        // still shows both kinds; what does not fit is counted in the link to the SVP
        const platz = (d.hits.length > 1 ? 2 : MAX_EINTRAEGE) - (w.rot ? 1 : 0);
        const text = auf.findIndex((a, i) => i > 0 && a.art === 'text');
        const order = auf.length && text > 1 ? [auf[0], auf[text]].concat(auf.filter((a, i) => i && i !== text)) : auf;
        weitere += Math.max(0, order.length - platz);
        order.slice(0, platz).forEach(function (a) {
          links += '<a class="vw-a' + (a.art ? ' vw-' + a.art : '') + '" href="' + esc(a.url.href) + '" target="_blank" rel="noopener">' +
            '<span class="vw-n">' + (a.n ? esc(a.n) : '') + '</span><span class="vw-txt"><span class="vw-name">' + esc(a.name) +
            '</span>' + (a.desc ? '<span class="vw-desc">' + esc(a.desc) + '</span>' : '') + '</span></a>';
        });
        if (w.rot) {
          // "Klassenarbeit 1: Das kann drankommen (42 Übungsaufgaben)": the bracket goes into the second line
          const t = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(w.rot.title || '') || [null, w.rot.title || w.rot.label, ''];
          links += '<a class="vw-a vw-rot" href="' + esc(svp(w.kw)) + '" target="_blank" rel="noopener"><span class="vw-n">!</span>' +
            '<span class="vw-txt"><span class="vw-name">' + esc(t[1]) + '</span>' +
            '<span class="vw-desc">' + (t[2] ? esc(t[2]) + ' · ' : '') + 'die Liste steht im Stoffverteilungsplan</span></span></a>';
        }
      });
      links += '<a class="vw-mehr" href="' + esc(svp(d.hits[0].kw)) + '" target="_blank" rel="noopener">' +
        (weitere ? '+ ' + weitere + ' weitere · ' : '') + 'alles zur Woche im Stoffverteilungsplan ›</a>';
    }
    if (erste) {
      const svg = qrSvg(liveUrl(erste.url));
      if (svg) qr = '<div class="vw-qr">' + svg + '</div><div class="vw-qr-sub">' + esc(erste.name) + '<br>aufs Smartphone</div>';
    }

    // the book
    const b = d.plan.buch, cover = new URL('resources/og/buch-' + b.name + '-cover.jpg', SITE).href;
    const les = [];
    d.hits.forEach(function (w) { lerneinheiten(b, w).forEach(function (x) { if (!les.some(y => y.le === x.le)) les.push(x); }); });
    const S = d.seiten;
    const seite = (f, s) => S && S.first[f + '|' + s];
    let buch = '';
    if (!les.length) {
      buch = '<a class="vw-kapitel" href="' + esc(new URL('buch/' + b.name + '/', SITE).href) + '" target="_blank" rel="noopener">' +
        '<span class="vw-kk">Lehrbuch</span><span class="vw-kt">' + esc(b.titel) + '</span></a>' +
        '<div class="vw-leer">' + (d.hits.length ? 'Zu dieser Woche gibt es keine eigene Lerneinheit.' : '') + '</div>' +
        '<div class="vw-chips"><a href="' + esc(new URL('buch/' + b.name + '/#kapitel', SITE).href) + '" target="_blank" rel="noopener">Alle Kapitel</a></div>';
    } else {
      let kap = null;
      les.slice(0, MAX_LE).forEach(function (x) {
        const href = new URL('buch/' + b.name + '/' + x.k.f + '#' + x.le.s, SITE).href;
        if (kap !== x.k) {
          kap = x.k;
          buch += '<a class="vw-kapitel" href="' + esc(new URL('buch/' + b.name + '/' + x.k.f, SITE).href) + '" target="_blank" rel="noopener">' +
            '<span class="vw-kk">' + esc(/^\d/.test(x.k.k) ? 'Kapitel ' + x.k.k : x.k.lbt || x.k.k) + '</span><span class="vw-kt">' + esc(x.k.t) + '</span></a>';
        }
        const p = seite(x.k.f, x.le.s);
        buch += '<a class="vw-le" href="' + esc(href) + '" target="_blank" rel="noopener"><span class="vw-ln">Lerneinheit ' + esc(x.le.n) +
          (p ? '<span class="vw-s">S. ' + p + '</span>' : '') + '</span><span class="vw-lt">' + esc(x.le.t) + '</span></a>';
      });
      // the chapter's practice, test and the solutions of its (first) Lerneinheit
      const k = les[0].k, chips = [];
      [['wvv', 'Üben'], ['test', 'Test']].forEach(function (c) {
        const p = seite(k.f, c[0]);
        if (p) chips.push('<a href="' + esc(new URL('buch/' + b.name + '/' + k.f + '#' + c[0], SITE).href) + '" target="_blank" rel="noopener">' +
          c[1] + ' S. ' + p + '</a>');
      });
      const l = S && S.loes[k.f + '|' + les[0].le.s];
      if (l) chips.push('<span>Lösungen S. ' + l + '</span>');
      if (chips.length) buch += '<div class="vw-chips">' + chips.join('') + '</div>';
      if (!S) buch += '<div class="vw-leer">Seitenzahlen gerade nicht erreichbar.</div>';
    }

    const html =
      '<div class="vw-karte vw-ueben"><div class="vw-kopf">Üben</div>' +
        '<div class="vw-body"><div class="vw-links">' + links + '</div>' + (qr ? '<div class="vw-qr-box">' + qr + '</div>' : '') + '</div></div>' +
      '<div class="vw-karte vw-buch"><div class="vw-kopf">Nachlesen<span>im Lehrbuch</span></div>' +
        '<div class="vw-buch-body"><img class="vw-cover" src="' + esc(cover) + '" alt="" draggable="false">' +
        '<div class="vw-buch-txt">' + buch + '</div></div></div>';
    document.querySelectorAll('.verweise-box').forEach(function (box) {
      box.innerHTML = html;
      box.classList.toggle('vw-zwei', d.hits.length > 1);
      box.classList.add('vw-da');
    });
  }

  function fehler(msg) {
    document.querySelectorAll('.verweise-box').forEach(function (box) {
      if (box.classList.contains('vw-da')) return;
      box.innerHTML = '<div class="vw-fehler">' + esc(msg) + '</div>';
    });
  }

  function qrLib() {
    if (typeof qrcode !== 'undefined') return Promise.resolve();
    return new Promise(function (ok) {
      const s = document.createElement('script');
      s.src = new URL('svp/qrcode.min.js', SITE).href;
      s.onload = s.onerror = function () { ok(); };
      document.head.appendChild(s);
    });
  }

  getJson(new URL('svp/plan-verweise.json', SITE).href).then(function (idx) {
    const plan = (idx.plaene || []).find(p => p.href.split('/').pop() === NAME + '.html');
    if (!plan) { fehler('Zu diesem Deck gibt es keinen Stoffverteilungsplan mit Lehrbuch.'); return; }
    const page = '/svp/' + plan.href;
    const edits = getJson(DB + 'svp_plan_edits?select=edits&page=eq.' + encodeURIComponent(page), { headers: { apikey: KEY } })
      .then(rows => (rows && rows[0] && rows[0].edits) || {}, function () { return {}; });   // offline: the plan file alone
    const seiten = getJson(MEDIA + 'seiten/' + plan.buch.name + '/seiten.json').then(seitenVon, function () { return null; });
    return Promise.all([edits, seiten, qrLib()]).then(function (r) {
      const hits = wochen(plan, r[0]).filter(function (w) {
        return eintraege(w.material).some(function (e) { try { return istDieses(new URL(e.url)); } catch (_) { return false; } });
      }).slice(0, 2);
      render({ plan: plan, hits: hits, seiten: r[1] });
    });
  }).catch(function () { fehler('Aufgaben und Buchseiten lassen sich gerade nicht laden.'); });
})();
