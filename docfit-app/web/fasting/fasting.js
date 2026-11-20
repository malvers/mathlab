/*
 * DocFit "Fasten" (Doc, 19.11.2026: "Ich habe ja mehrere Male gefastet und dort eingetragen" - "DocFit ... eine extra
 * Rubrik ... Fasting"). Two views, chosen in the row on top (and in the URL hash, so Back works in the app too):
 * - "Vergleich": all fasts on top of each other from day 1 (one measure at a time, change since day 1 or absolute),
 *   and a summary card per fast.
 * - one fast: start -> end of every measure and a chart per measure like Doc's Excel dashboard, the fast shaded and a
 *   red line on its last day ("Fastenzeit" / "+4 Wochen" / "+3 Monate" afterwards).
 * Data: window.FASTING_DATA from private/fasting-data.js (tools/fasting_from_excel.py). Day 1 = the first fasting day,
 * its morning weigh-in is the start value; the end value is the morning of the last fasting day.
 */
(function () {
  'use strict';

  const D = window.FASTING_DATA;
  // the chart colours come from the CSS of the chosen scheme (Blau / Grau / Hell), read again at every render
  let COL = {};
  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    const v = name => cs.getPropertyValue(name).trim();
    COL = {
      line: v('--c-line'), line2: v('--c-line2'), grid: v('--c-grid'), band: v('--c-band'), end: v('--c-end'),
      event: v('--c-event'), tip: v('--c-tip'), tipRim: v('--c-tip-rim'), labelBg: v('--c-label-bg'),
      text: v('--text'), muted: v('--muted')
    };
  }
  // Hell: each fast's own hue one step darker - the Blau/Grau colours are too pale on white (validated set, >= 3:1)
  const LIGHT = {
    '#E66767': '#E34948', '#3987E5': '#2A78D6', '#799E31': '#5C7A20', '#D55181': '#C2457E',
    '#F5C242': '#B07A00', '#9085E9': '#6250D6', '#199E70': '#138A60'
  };
  function colorOf(f) {
    return document.documentElement.classList.contains('svp-light') ? (LIGHT[f.color.toUpperCase()] || f.color) : f.color;
  }
  // dec: decimals shown; 'auto' = whole numbers without decimals (belly 97 / 97,5)
  const M = {
    // chip: the short name on the buttons above the comparison chart, so all of them fit on a phone (Doc, 20.11.2026:
    // "Gewicht, Bauchumfang, Körperfett … ein bisschen schmaler, sodass die Tasten auch hinpassen")
    weight: { label: 'Gewicht', chip: 'Gewicht', unit: 'kg', dec: 1 },
    belly: { label: 'Bauchumfang', chip: 'Bauch', unit: 'cm', dec: 'auto' },
    bodyAge: { label: 'Körperalter', chip: 'Körperalter', unit: 'Jahre', dec: 0, hint: 'Tanita' },
    fat: { label: 'Körperfett', chip: 'Fett', unit: '%', dec: 1 },
    water: { label: 'Körperwasser', chip: 'Wasser', unit: '%', dec: 1 },
    organFat: { label: 'Organfett', chip: 'Organfett', unit: 'Stufe', dec: 0, hint: 'Tanita 1–12' },
    sys: { label: 'Blutdruck SYS', chip: 'SYS', unit: 'mmHg', dec: 0 },
    dia: { label: 'Blutdruck DIA', chip: 'DIA', unit: 'mmHg', dec: 0 },
    pulse: { label: 'Ruhepuls', chip: 'Puls', unit: '/min', dec: 0 },
    sugar: { label: 'Blutzucker', chip: 'Zucker', unit: 'mg/dl', dec: 0 },
    ketones: { label: 'Ketone', chip: 'Ketone', unit: 'mmol/l', dec: 1 },
    kcal: { label: 'Nahrung', chip: 'Nahrung', unit: 'kcal', dec: 0 }
  };
  // the chart grid of one fast, in the order of Doc's Excel dashboard; 'bp' = SYS and DIA in one chart
  const GRID = ['weight', 'belly', 'bodyAge', 'fat', 'bp', 'water', 'organFat', 'pulse', 'sugar', 'ketones', 'kcal'];
  const COMPARE = ['weight', 'belly', 'fat', 'bodyAge', 'sugar', 'ketones', 'pulse', 'sys', 'dia', 'water', 'organFat'];
  const RANGES = [['fast', 'Fastenzeit', 1], ['28', '+4 Wochen', 28], ['90', '+3 Monate', 90]];
  const DAY = 864e5;
  // text and line sizes of a tile and of the big view (tap on a chart)
  const SIZE = {
    small: { tick: 11, title: 11, mark: 10, tipTitle: 12, tipBody: 13, line: 2, point: 2.5, yTicks: 6 },
    big: { tick: 14, title: 14, mark: 13, tipTitle: 14, tipBody: 16, line: 2.5, point: 3.2, yTicks: 10 }
  };
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  const state = { metric: 'weight', mode: 'delta', range: '28', hidden: new Set() };
  try {   // per-viewer conveniences only; the page works without storage
    const s = JSON.parse(localStorage.getItem('docfit-fasting') || '{}');
    if (M[s.metric]) state.metric = s.metric;
    if (s.mode === 'abs' || s.mode === 'delta') state.mode = s.mode;
    if (RANGES.some(r => r[0] === s.range)) state.range = s.range;
  } catch (e) { /* private window or blocked storage */ }
  function save() {
    try {
      localStorage.setItem('docfit-fasting', JSON.stringify({ metric: state.metric, mode: state.mode, range: state.range }));
    } catch (e) { /* see above */ }
  }

  const view = document.getElementById('view');
  const nav = document.getElementById('nav');
  let charts = [];

  // inside DocFit (WebView on file:///android_asset/) the app's own title and tabs stand above - no second header
  if (location.pathname.indexOf('/android_asset/') === 0 || new URLSearchParams(location.search).get('app') === '1') {
    document.body.classList.add('app');
  }

  // ---------- helpers ----------
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function decimals(metric, v) {
    const d = M[metric].dec;
    return d === 'auto' ? (Math.round(v) === v ? 0 : 1) : d;
  }
  function num(v, d) { return v.toFixed(d).replace('.', ','); }
  function fmt(metric, v) { return num(v, decimals(metric, v)); }
  function signed(metric, v, d) {
    const dd = d != null ? d : Math.max(decimals(metric, v), M[metric].dec === 'auto' ? 0 : M[metric].dec);
    const r = Number(v.toFixed(dd));
    if (r === 0) return '±0';
    return (r < 0 ? '−' : '+') + num(Math.abs(r), dd);
  }
  function utc(iso) { const p = iso.split('-').map(Number); return Date.UTC(p[0], p[1] - 1, p[2]); }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function dayNo(f, isoDate) { return Math.round((utc(isoDate) - utc(f.start)) / DAY) + 1; }
  function dateOf(f, n) { return new Date(utc(f.start) + (n - 1) * DAY); }
  function dm(d) { return String(d.getUTCDate()).padStart(2, '0') + '.' + String(d.getUTCMonth() + 1).padStart(2, '0') + '.'; }
  function dmy(d) { return dm(d) + d.getUTCFullYear(); }
  function span(f) {
    const a = dateOf(f, 1), b = dateOf(f, f.days);
    return (a.getUTCFullYear() === b.getUTCFullYear() ? dm(a) : dmy(a)) + '–' + dmy(b);
  }
  function short(f) { return f.label.replace(/^(\S{3})\S*/, '$1') + ' · ' + f.days + ' T' + (f.endSure ? '' : '?'); }
  /** the fast in the legend chips: "Jan 21" ("Januar 2021"); the length stands at the end of its line in the chart */
  function tiny(f) {
    const m = /^(\S{3})\S*\s+\d{2}(\d{2})$/.exec(f.label.trim());
    return m ? m[1] + ' ' + m[2] : short(f);
  }
  function dayWord(f, n) {
    if (n < 1) return (1 - n) + (n === 0 ? ' Tag' : ' Tage') + ' vorher';
    if (n > f.days) return (n - f.days) + (n - f.days === 1 ? ' Tag' : ' Tage') + ' danach';
    return 'Tag ' + n;
  }
  function value(isoDate, metric) {
    const d = D.days[isoDate];
    return d && d.v[metric] != null ? d.v[metric] : null;
  }
  /** the points of one measure for one fast, x = day number (1 = first fasting day) */
  function series(f, metric, from, to) {
    const pts = [];
    for (let n = from; n <= to; n++) {
      const v = value(iso(utc(f.start) + (n - 1) * DAY), metric);
      if (v != null) pts.push({ x: n, y: v });
    }
    return pts;
  }
  function baseOf(f, metric) {
    const s = f.summary[metric];
    return s && s.start ? s.start.value : null;
  }
  function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }
  /** the fasts in time order, oldest first - every row of them runs left -> right, newest right (Doc, 19.11.2026),
   *  whatever order the data file has */
  function chrono() { return D.fasts.slice().sort((a, b) => a.start < b.start ? -1 : a.start > b.start ? 1 : 0); }

  // ---------- Chart.js defaults: the card of the chosen scheme ----------
  function chartDefaults() {
    readColors();
    Chart.defaults.font.family = 'Orbitron, system-ui, sans-serif';
    Chart.defaults.font.size = 11;
    Chart.defaults.color = COL.muted;
    Chart.defaults.borderColor = COL.grid;
    Chart.defaults.animation = false;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.plugins.legend.display = false;
    Object.assign(Chart.defaults.plugins.tooltip, {
      backgroundColor: COL.tip, borderColor: COL.tipRim, borderWidth: 1,
      titleColor: COL.muted, bodyColor: COL.text, padding: 10, displayColors: true, boxWidth: 14, boxHeight: 3,
      titleFont: { family: 'system-ui, sans-serif', size: 12, weight: '400' },
      bodyFont: { family: 'Orbitron, system-ui, sans-serif', size: 13 },
      footerFont: { family: 'system-ui, sans-serif', size: 12, weight: '400' }, footerColor: COL.muted
    });
  }

  /**
   * Hover: the nearest day, then every visible line's value on exactly that day (SYS and DIA; all fasts on one fasting
   * day) - never the neighbouring day that happens to lie within the hit radius.
   */
  if (window.Chart) {
    Chart.Interaction.modes.sameDay = function (chart, e, options, useFinal) {
      const near = Chart.Interaction.modes.nearest(chart, e, { axis: 'x', intersect: false }, useFinal);
      if (!near.length) return [];
      const x = chart.data.datasets[near[0].datasetIndex].data[near[0].index].x;
      const out = [];
      chart.data.datasets.forEach((ds, di) => {
        if (!chart.isDatasetVisible(di)) return;
        const i = ds.data.findIndex(pt => pt.x === x);
        if (i >= 0) out.push({ element: chart.getDatasetMeta(di).data[i], datasetIndex: di, index: i });
      });
      return out;
    };
  }

  /** the fast shaded, a red line on its last day (dashed when the end is not written down), events as grey lines */
  const marks = {
    id: 'fastMarks',
    beforeDatasetsDraw(chart, args, o) {
      if (!o || !o.end) return;
      const { ctx, chartArea: a, scales: { x } } = chart;
      ctx.save();
      const x1 = Math.max(a.left, x.getPixelForValue(1)), x2 = Math.min(a.right, x.getPixelForValue(o.end));
      if (x2 > x1) { ctx.fillStyle = COL.band; ctx.fillRect(x1, a.top, x2 - x1, a.bottom - a.top); }
      (o.events || []).forEach(ev => {
        const px = x.getPixelForValue(ev.x);
        if (px < a.left || px > a.right) return;
        ctx.strokeStyle = COL.event; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, a.top + (o.big ? 18 : 14)); ctx.lineTo(px, a.bottom); ctx.stroke();
      });
      const px = x.getPixelForValue(o.end);
      if (px >= a.left && px <= a.right) {
        ctx.strokeStyle = COL.end; ctx.lineWidth = o.big ? 2.5 : 2; ctx.setLineDash(o.sure ? [] : [6, 4]);
        ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke();
      }
      ctx.restore();
    },
    afterDatasetsDraw(chart, args, o) {
      if (!o || !o.end) return;
      const { ctx, chartArea: a, scales: { x } } = chart;
      ctx.save();
      ctx.font = SIZE[o.big ? 'big' : 'small'].mark + 'px Orbitron, system-ui, sans-serif';
      ctx.textBaseline = 'top';
      const px = x.getPixelForValue(o.end);
      if (px >= a.left && px <= a.right) {
        const t = 'Ende' + (o.sure ? '' : '?');
        const w = ctx.measureText(t).width;
        const left = px + 4 + w > a.right;
        ctx.fillStyle = COL.text;
        ctx.textAlign = left ? 'right' : 'left';
        ctx.fillText(t, left ? px - 4 : px + 4, a.top + 2);
      }
      (o.events || []).forEach(ev => {
        const p = x.getPixelForValue(ev.x);
        if (p < a.left || p > a.right) return;
        ctx.fillStyle = COL.muted; ctx.textAlign = p > (a.left + a.right) / 2 ? 'right' : 'left';
        ctx.fillText(ev.text, p + (ctx.textAlign === 'right' ? -4 : 4), a.top + 2);
      });
      ctx.restore();
    }
  };

  /** comparison: a short label at the end of each longer line, in text ink with a dot of the line's colour */
  const endLabels = {
    id: 'endLabels',
    afterDatasetsDraw(chart, args, o) {
      if (!o || !o.on) return;
      const { ctx, chartArea: a } = chart;
      ctx.save();
      const fs = SIZE[o.big ? 'big' : 'small'].mark;
      ctx.font = fs + 'px Orbitron, system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      chart.data.datasets.forEach((ds, i) => {
        const meta = chart.getDatasetMeta(i);
        if (meta.hidden || !ds.data.length || ds.data.length < 10) return;
        const p = meta.data[meta.data.length - 1];
        if (!p) return;
        const t = ds.endLabel;
        const w = ctx.measureText(t).width;
        let x = p.x + 8;
        if (x + w > a.right) x = p.x - 8 - w;
        const h = fs + 4;
        const y = Math.min(a.bottom - h / 2, Math.max(a.top + h / 2, p.y - h * 0.7));
        ctx.fillStyle = COL.labelBg;
        ctx.fillRect(x - 3, y - h / 2, w + 6, h);
        ctx.fillStyle = COL.text;
        ctx.textAlign = 'left';
        ctx.fillText(t, x, y);
      });
      ctx.restore();
    }
  };

  function lineSet(label, color, data, extra) {
    return Object.assign({
      label, data, borderColor: color, backgroundColor: color, borderWidth: 2, pointRadius: 2.5,
      pointHoverRadius: 5, pointHitRadius: 12, tension: 0.15, spanGaps: true
    }, extra || {});
  }

  // ---------- navigation ----------
  function route() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    const f = D && D.fasts.find(x => x.id === id);
    teardownZoom();
    renderNav(f ? f.id : 'vergleich');
    destroyCharts();
    chartDefaults();
    view.textContent = '';
    if (f) renderFast(f); else renderCompare();
    window.scrollTo(0, 0);
  }

  function renderNav(current) {
    nav.textContent = '';
    const items = [['vergleich', 'Vergleich', null]].concat(
      chrono().map(f => [f.id, short(f), colorOf(f)]));
    items.forEach(([id, label, color]) => {
      const b = el('button', 'chip');
      b.type = 'button';
      if (color) { const k = el('span', 'key'); k.style.background = color; b.appendChild(k); }
      b.appendChild(document.createTextNode(label));
      if (id === current) b.setAttribute('aria-current', 'page');
      b.addEventListener('click', () => {
        if (id === 'vergleich') {
          if (location.hash) history.pushState(null, '', location.pathname + location.search);
          route();
        } else {
          location.hash = id;
        }
      });
      nav.appendChild(b);
      if (id === current) setTimeout(() => b.scrollIntoView({ block: 'nearest', inline: 'center' }), 0);
    });
  }

  // ---------- view: all fasts compared ----------
  function renderCompare() {
    view.appendChild(el('div', 'head', 'Alle Fastenzeiten ab Tag 1'));
    const card = el('section', 'card');
    view.appendChild(card);

    const metrics = COMPARE.filter(m => D.fasts.filter(f => f.coverage[m] && f.coverage[m].days >= 2).length >= 2);
    if (!metrics.includes(state.metric)) state.metric = 'weight';
    const segM = el('div', 'seg');
    metrics.forEach(m => {
      const b = toggle(M[m].chip || M[m].label, state.metric === m, () => { state.metric = m; save(); route(); });
      b.title = M[m].label;
      b.setAttribute('aria-label', M[m].label);
      segM.appendChild(b);
    });
    card.appendChild(segM);

    const row = el('div', 'row');
    const segMode = el('div', 'seg');
    segMode.appendChild(toggle('Änderung ab Tag 1', state.mode === 'delta', () => { state.mode = 'delta'; save(); route(); }));
    segMode.appendChild(toggle('Absolut', state.mode === 'abs', () => { state.mode = 'abs'; save(); route(); }));
    row.appendChild(segMode);
    card.appendChild(row);

    const plot = el('div', 'plot');
    const canvas = el('canvas');
    canvas.setAttribute('role', 'img');
    plot.appendChild(canvas);
    card.appendChild(plot);

    const m = state.metric, unit = M[m].unit;
    const sets = [];
    chrono().forEach(f => {
      let pts = series(f, m, 1, f.days);
      if (!pts.length) return;
      const base = baseOf(f, m);
      if (state.mode === 'delta') {
        if (base == null) return;
        pts = pts.map(p => ({ x: p.x, y: Number((p.y - base).toFixed(2)) }));
      }
      sets.push(lineSet(f.label, colorOf(f), pts, {
        fastId: f.id, endLabel: f.days + ' T', hidden: state.hidden.has(f.id),
        borderDash: f.endSure ? [] : [5, 4], pointRadius: pts.length > 20 ? 1.8 : 2.5
      }));
    });
    canvas.setAttribute('aria-label', M[m].label + ' aller Fastenzeiten ab Tag 1');
    const maxDay = Math.max.apply(null, D.fasts.map(f => f.days));
    const make = (cv, big) => compareChart(cv, big ? copySets(sets) : sets, m, maxDay, big);
    charts.push(make(canvas, false));
    zoomable(plot, {
      title: M[m].label, unit: (state.mode === 'delta' ? 'Δ ' : '') + unit,
      sub: 'Alle Fastenzeiten ab Tag 1' + (state.mode === 'delta' ? ' · Änderung ab Tag 1' : ''),
      legend: () => legendOf(sets.filter(s => !state.hidden.has(s.fastId))
        .map(s => [s.borderColor, short(D.fasts.find(x => x.id === s.fastId))])),
      make: cv => make(cv, true)
    });

    // the fasts as toggles = the legend (colour follows the fast, never its position): small chips with a colour dot
    // and "Jan 21", a few to a line (Doc, 20.11.2026: "die Legende darunter nimmt verdächtig viel Platz weg")
    const segF = el('div', 'seg toggles legendchips');
    chrono().forEach(f => {
      const has = sets.some(s => s.fastId === f.id);
      const b = toggle(tiny(f), has && !state.hidden.has(f.id), () => {
        if (state.hidden.has(f.id)) state.hidden.delete(f.id); else state.hidden.add(f.id);
        route();
      }, colorOf(f));
      b.setAttribute('aria-label', short(f));
      b.title = short(f);
      if (!has) { b.disabled = true; b.title = 'Keine Werte für ' + M[m].label; }
      segF.appendChild(b);
    });
    card.appendChild(segF);
    const note = el('p', 'hint');
    note.textContent = (state.mode === 'delta' ? 'Änderung gegenüber dem Morgen von Tag 1. ' : '') +
      'Nur die Fastentage. Gestrichelt: Ende nicht eingetragen. Tippen auf einen Namen blendet ihn aus.';
    card.appendChild(note);

    view.appendChild(el('div', 'head', 'Fastenzeiten'));
    const list = el('div', 'cards');
    chrono().forEach(f => list.appendChild(fastCard(f)));
    view.appendChild(list);
    const foot = el('p', 'hint');
    foot.style.marginTop = '18px';
    const g = D.generated.split('T');
    foot.textContent = 'Aus „' + D.workbook + '“, eingelesen am ' + g[0].split('-').reverse().join('.') + ' um ' + g[1].slice(0, 5) +
      '. Nur auf diesem Gerät – nichts davon ist im Internet.';
    view.appendChild(foot);
  }

  /** tooltip and axis fonts of a tile or of the big view */
  function fonts(big) {
    const z = SIZE[big ? 'big' : 'small'];
    return {
      tick: { size: z.tick }, title: { size: z.title },
      tip: big ? {
        titleFont: { family: 'system-ui, sans-serif', size: z.tipTitle, weight: '400' },
        bodyFont: { family: 'Orbitron, system-ui, sans-serif', size: z.tipBody },
        footerFont: { family: 'system-ui, sans-serif', size: z.tipTitle, weight: '400' }, padding: 12, boxWidth: 18, boxHeight: 4
      } : {}
    };
  }

  /** the comparison chart: all fasts from day 1 (the tile, or big = the view after a tap) */
  function compareChart(canvas, sets, m, maxDay, big) {
    const unit = M[m].unit, ft = fonts(big);
    return new Chart(canvas, {
      type: 'line',
      data: { datasets: sets },
      plugins: [endLabels],
      options: {
        parsing: false,
        interaction: { mode: 'sameDay', intersect: false },
        scales: {
          x: { type: 'linear', min: 1, max: maxDay + 1, grid: { color: COL.grid },
            title: { display: true, text: 'Fastentag', font: ft.title },
            afterBuildTicks: axis => { axis.ticks = dayTicks(1, maxDay, axis.width, true, big); },
            ticks: { autoSkip: false, maxRotation: 0, font: ft.tick } },
          y: { title: { display: true, text: (state.mode === 'delta' ? 'Δ ' : '') + unit, font: ft.title }, grid: { color: COL.grid },
            ticks: { font: ft.tick, maxTicksLimit: big ? SIZE.big.yTicks : undefined,
              callback: v => state.mode === 'delta' ? signed(m, v, Number.isInteger(v) ? 0 : 1) : num(v, Number.isInteger(v) ? 0 : 1) } }
        },
        plugins: {
          endLabels: { on: true, big },
          tooltip: Object.assign({
            callbacks: {
              title: items => items.length ? 'Tag ' + items[0].parsed.x : '',
              label: it => {
                const f = D.fasts.find(x => x.id === it.dataset.fastId);
                const raw = value(iso(utc(f.start) + (it.parsed.x - 1) * DAY), m);
                const shown = state.mode === 'delta' ? signed(m, it.parsed.y) + ' ' + unit + '  (' + fmt(m, raw) + ')'
                  : fmt(m, raw) + ' ' + unit;
                return shown + '   ' + f.label;
              }
            }
          }, ft.tip)
        }
      }
    });
  }

  /** own copies of the datasets for a second chart, thicker lines for the big view */
  function copySets(sets) {
    const z = SIZE.big;
    return sets.map(s => Object.assign({}, s, {
      data: s.data.map(p => ({ x: p.x, y: p.y })), borderWidth: z.line,
      pointRadius: s.pointRadius < SIZE.small.point ? s.pointRadius + 0.4 : z.point, pointHoverRadius: 6
    }));
  }

  /** a legend row: [colour, text] pairs */
  function legendOf(items) {
    const lg = el('div', 'legend');
    items.forEach(([color, text]) => {
      const it = el('span');
      const i = el('i'); i.style.background = color;
      it.appendChild(i); it.appendChild(document.createTextNode(text));
      lg.appendChild(it);
    });
    return lg;
  }

  // ---------- big view: tap on a chart -> the same chart drawn again over the whole screen ----------
  let zoom = null;   // { el, chart, opener, pushed }
  // Material Icons "open_in_full" and "close" (Apache 2.0)
  const ICON_OPEN = 'M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z';
  const ICON_CLOSE = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z';
  function icon(path, cls) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    if (cls) svg.setAttribute('class', cls);
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', path);
    svg.appendChild(p);
    return svg;
  }

  /** makes a tile (or the comparison plot) open the big view on tap, Enter or Space */
  function zoomable(target, spec) {
    target.classList.add('zoomable');
    target.tabIndex = 0;
    target.setAttribute('role', 'button');
    target.setAttribute('aria-label', spec.title + ' groß anzeigen');
    target.addEventListener('click', () => openZoom(spec, target));
    target.addEventListener('keydown', e => {
      if (e.target === target && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openZoom(spec, target); }
    });
  }

  function openZoom(spec, opener) {
    if (zoom) teardownZoom();
    const layer = el('div', 'zoom');
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-modal', 'true');
    layer.setAttribute('aria-labelledby', 'zoomTitle');
    const box = el('div', 'zoom-box');
    if (spec.color) box.style.setProperty('--c', spec.color);
    const head = el('div', 'zoom-head');
    const titles = el('div', 'zoom-titles');
    const h = el('h3', 'ctitle');
    h.id = 'zoomTitle';
    h.appendChild(document.createTextNode(spec.title));
    h.appendChild(el('span', null, spec.unit));
    titles.appendChild(h);
    if (spec.sub) titles.appendChild(el('div', 't2', spec.sub));
    head.appendChild(titles);
    const x = el('button', 'zoom-x');
    x.type = 'button';
    x.setAttribute('aria-label', 'Schließen');
    x.appendChild(icon(ICON_CLOSE));
    x.addEventListener('click', closeZoom);
    head.appendChild(x);
    box.appendChild(head);
    if (spec.legend) { const lg = spec.legend(); if (lg) box.appendChild(lg); }
    const plot = el('div', 'zoom-plot');
    const canvas = el('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', spec.title + (spec.sub ? ', ' + spec.sub : ''));
    plot.appendChild(canvas);
    box.appendChild(plot);
    layer.appendChild(box);
    // a tap beside the card closes it; taps on the chart are for its tooltips
    layer.addEventListener('click', e => { if (e.target === layer) closeZoom(); });
    document.body.appendChild(layer);
    document.documentElement.classList.add('zoomed');
    zoom = { el: layer, chart: spec.make(canvas), opener, pushed: false };
    // one history step, so Back (browser, or Android's back inside DocFit = WebView.goBack) closes the big view
    try { history.pushState({ docfitZoom: true }, ''); zoom.pushed = true; } catch (e) { /* no history API */ }
    x.focus({ preventScroll: true });
  }

  /** removes the big view at once (Back already went one step, or the page is drawn again) */
  function teardownZoom() {
    if (!zoom) return;
    const z = zoom;
    zoom = null;
    z.chart.destroy();
    z.el.remove();
    document.documentElement.classList.remove('zoomed');
    if (z.opener && document.contains(z.opener)) z.opener.focus({ preventScroll: true });
  }

  /** the close button, a tap beside the card or Esc: go back the step the big view added */
  function closeZoom() {
    if (!zoom) return;
    if (zoom.pushed && history.state && history.state.docfitZoom) history.back();   // popstate tears it down
    else teardownZoom();
  }
  window.addEventListener('popstate', () => { if (zoom) teardownZoom(); });
  document.addEventListener('keydown', e => { if (zoom && e.key === 'Escape') closeZoom(); });

  function toggle(label, on, click, color) {
    const b = el('button', 'chip');
    b.type = 'button';
    if (color) { const k = el('span', 'key'); k.style.background = color; b.appendChild(k); }
    b.appendChild(document.createTextNode(label));
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.addEventListener('click', click);
    return b;
  }

  function fastCard(f) {
    const b = el('button', 'card fast');
    b.type = 'button';
    b.style.setProperty('--c', colorOf(f));
    b.appendChild(el('div', 't1', f.label));
    b.appendChild(el('div', 't2', span(f) + ' · ' + f.days + ' Tage'));
    const w = f.summary.weight;
    if (w && w.start && w.end) {
      const h = el('div', 'hero', signed('weight', w.end.value - w.start.value, 1));
      h.appendChild(el('small', null, 'kg'));
      b.appendChild(h);
      b.appendChild(el('div', 't2', fmt('weight', w.start.value) + ' → ' + fmt('weight', w.end.value) + ' kg'));
    }
    const mini = el('div', 'mini');
    ['belly', 'fat', 'bodyAge', 'sugar'].forEach(m => {
      const s = f.summary[m];
      if (!s || !s.start || !s.end) return;
      mini.appendChild(el('span', 'k', M[m].label));
      mini.appendChild(el('span', 'v', fmt(m, s.start.value) + ' → ' + fmt(m, s.end.value) + ' ' + M[m].unit));
      mini.appendChild(el('span', 'd', signed(m, s.end.value - s.start.value)));
    });
    b.appendChild(mini);
    if (!f.endSure) b.appendChild(el('div', 'warn', 'Ende nicht eingetragen'));
    b.addEventListener('click', () => { location.hash = f.id; });
    return b;
  }

  // ---------- view: one fast ----------
  function renderFast(f) {
    const top = el('section', 'card');
    top.style.marginTop = '14px';
    top.style.borderLeft = '5px solid ' + colorOf(f);
    top.appendChild(el('div', 't1', f.label + ' · ' + f.days + ' Tage'));
    top.appendChild(el('div', 't2', dmy(dateOf(f, 1)) + ' (Tag 1) bis ' + dmy(dateOf(f, f.days)) + ' (Tag ' + f.days + ')'));
    if (f.endNote) top.appendChild(el('div', 'warn', f.endNote));
    top.appendChild(summaryTable(f));
    if (f.quote) top.appendChild(el('p', 'quote', '„' + f.quote + '“'));
    const det = el('details', 'src');
    det.appendChild(el('summary', null, 'WOHER DIE DATEN KOMMEN'));
    det.appendChild(el('p', null, f.evidence));
    det.appendChild(el('p', null, 'Start = Messung am Morgen von Tag 1, Ende = Messung am Morgen des letzten Fastentags. ' +
      'Blutzucker immer in mg/dl. Organfett und Körperalter: Werte der Tanita-Waage.'));
    top.appendChild(det);
    view.appendChild(top);

    const row = el('div', 'row');
    row.style.marginTop = '18px';
    row.appendChild(el('div', 'head', 'Verlauf'));
    const seg = el('div', 'seg onpage');
    seg.style.margin = '0';
    RANGES.forEach(([id, label]) => seg.appendChild(toggle(label, state.range === id, () => { state.range = id; save(); route(); })));
    row.appendChild(seg);
    view.appendChild(row);

    const after = RANGES.find(r => r[0] === state.range)[2];
    const from = -2, to = f.days + after;
    const events = (D.events || []).map(e => ({ x: dayNo(f, e.date), text: e.text, metrics: e.metrics }))
      .filter(e => e.x >= from && e.x <= to);
    const grid = el('div', 'grid');
    view.appendChild(grid);
    const rangeLabel = RANGES.find(r => r[0] === state.range)[1];
    GRID.forEach(key => {
      const parts = key === 'bp' ? ['sys', 'dia'] : [key];
      const sets = parts.map((m, i) => ({ m, pts: series(f, m, from, to), color: i ? COL.line2 : COL.line }))
        .filter(s => s.pts.length >= 2);
      if (!sets.length) return;
      const name = key === 'bp' ? 'Blutdruck' : M[key].label;
      const unitText = (key === 'bp' ? 'mmHg' : M[key].unit) + (M[key] && M[key].hint ? ' · ' + M[key].hint : '');
      const legend = () => sets.length > 1 ? legendOf(sets.map(s => [s.color, s.m === 'sys' ? 'SYS' : 'DIA'])) : null;
      const card = el('section', 'card');
      const title = el('h3', 'ctitle');
      title.appendChild(document.createTextNode(name));
      const u = el('span', null, unitText);
      u.appendChild(icon(ICON_OPEN, 'zoom-hint'));
      title.appendChild(u);
      card.appendChild(title);
      const lg = legend();
      if (lg) card.appendChild(lg);
      const plot = el('div', 'plot small');
      const canvas = el('canvas');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', name + ', ' + f.label);
      plot.appendChild(canvas);
      card.appendChild(plot);
      grid.appendChild(card);
      const tileEvents = events.filter(e => !e.metrics || e.metrics.includes(key));
      charts.push(fastChart(canvas, f, key, sets, from, to, tileEvents, false));
      zoomable(card, {
        title: name, unit: unitText, sub: f.label + ' · ' + rangeLabel, color: colorOf(f), legend,
        make: cv => fastChart(cv, f, key, sets, from, to, tileEvents, true)
      });
    });
    if (!grid.children.length) grid.appendChild(el('p', 'hint', 'Keine Messwerte in diesem Zeitraum.'));
  }

  /** the chart of one measure of one fast: the tile, or big = the view after a tap */
  function fastChart(canvas, f, key, sets, from, to, events, big) {
    const z = SIZE[big ? 'big' : 'small'], ft = fonts(big);
    const unitOf = m => M[m].unit;
    return new Chart(canvas, {
      type: 'line',
      data: {
        datasets: sets.map(s => lineSet(s.m === 'sys' ? 'SYS' : s.m === 'dia' ? 'DIA' : M[s.m].label, s.color,
          s.pts.map(p => ({ x: p.x, y: p.y })),
          { metric: s.m, borderWidth: z.line, pointRadius: s.pts.length > 45 ? z.point - 0.9 : z.point, pointHoverRadius: big ? 6 : 5 }))
      },
      plugins: [marks],
      options: {
        parsing: false,
        interaction: { mode: 'sameDay', intersect: false },
        scales: {
          x: {
            type: 'linear', min: from, max: to, grid: { color: COL.grid },
            afterBuildTicks: axis => { axis.ticks = dayTicks(from, to, axis.width, false, big); },
            ticks: { autoSkip: false, maxRotation: 0, font: ft.tick, callback: v => dm(dateOf(f, v)) }
          },
          y: { grid: { color: COL.grid }, grace: '8%', min: key === 'ketones' ? 0 : undefined,
            ticks: { maxTicksLimit: z.yTicks, font: ft.tick, precision: key === 'bp' || M[key].dec === 0 ? 0 : undefined,
              callback: v => num(v, Number.isInteger(v) ? 0 : 1) } }
        },
        plugins: {
          fastMarks: { end: f.days, sure: f.endSure, events, big },
          tooltip: Object.assign({
            callbacks: {
              title: items => {
                if (!items.length) return '';
                const d = dateOf(f, items[0].parsed.x);
                return WD[d.getUTCDay()] + ' ' + dmy(d) + ' · ' + dayWord(f, items[0].parsed.x);
              },
              label: it => {
                const m = it.dataset.metric;
                return (key === 'bp' ? (m === 'sys' ? 'SYS ' : 'DIA ') : '') + fmt(m, it.parsed.y) + ' ' + unitOf(m);
              },
              footer: items => {
                if (key !== 'weight' || !items.length) return '';
                const d = D.days[iso(utc(f.start) + (items[0].parsed.x - 1) * DAY)];
                return d && d.note ? wrap(d.note, big ? 60 : 42) : '';
              }
            }
          }, ft.tip)
        }
      }
    });
  }

  /** x ticks: day 1 and whole steps (1, 2, 7, 14, 28 days) from there, about one date per 70 px (big view: 64 px -
   *  its dates are 53 px wide at 14 px Orbitron, so an upright phone gets 14-day steps instead of 28) */
  function dayTicks(from, to, width, plain, big) {
    const room = Math.max(2, Math.floor((width || 300) / (plain ? 50 : big ? 64 : 70)));
    const steps = plain ? [1, 2, 5, 10, 20] : [1, 2, 7, 14, 28];
    const step = steps.find(s => (to - from) / s <= room) || steps[steps.length - 1];
    const out = [];
    if (plain) {   // fasting days: 1, 5, 10, 15 ...
      out.push({ value: 1 });
      for (let n = step; n <= to; n += step) if (n > 1 + step / 3) out.push({ value: n });
      return out;
    }
    for (let n = 1 - Math.floor((1 - from) / step) * step; n <= to; n += step) if (n >= from) out.push({ value: n });
    return out;
  }

  function wrap(text, n) {
    const out = [];
    let line = '';
    text.split(/\s+/).forEach(w => {
      if ((line + ' ' + w).trim().length > n) { if (line) out.push(line); line = w; } else line = (line + ' ' + w).trim();
    });
    if (line) out.push(line);
    return out;
  }

  function summaryTable(f) {
    const t = el('table', 'sumtable');
    const head = el('tr');
    ['', 'Tag 1', 'Tag ' + f.days, 'Δ'].forEach(h => head.appendChild(el('th', null, h)));
    t.appendChild(head);
    const order = ['weight', 'belly', 'fat', 'bodyAge', 'water', 'organFat', 'sys', 'dia', 'pulse', 'sugar', 'ketones'];
    order.forEach(m => {
      const s = f.summary[m];
      if (!s) return;
      const tr = el('tr');
      tr.appendChild(el('td', null, M[m].label + ' (' + M[m].unit + ')'));
      if (m === 'ketones') {
        // ketones start near 0 - what counts is how high they rose
        const c = el('td');
        c.colSpan = 3;
        c.className = 'delta';
        c.textContent = 'max ' + fmt(m, s.max.value);
        c.appendChild(el('small', null, dayWord(f, dayNo(f, s.max.date)) + ' · gemessen ab ' +
          dayWord(f, dayNo(f, f.coverage[m].first)) + ', ' + f.coverage[m].days + ' von ' + f.days + ' Tagen'));
        tr.appendChild(c);
      } else {
        tr.appendChild(cell(f, m, s.start));
        tr.appendChild(cell(f, m, s.end));
        tr.appendChild(el('td', 'delta', s.start && s.end ? signed(m, s.end.value - s.start.value) : '–'));
      }
      t.appendChild(tr);
    });
    return t;
  }

  function cell(f, m, p) {
    const td = el('td', null, p ? fmt(m, p.value) : '–');
    if (p && p.offset) td.appendChild(el('small', null, dayWord(f, dayNo(f, p.date))));
    return td;
  }

  // ---------- start ----------
  if (!D || !D.fasts || !window.Chart) {
    nav.hidden = true;
    const c = el('section', 'card empty');
    c.style.marginTop = '24px';
    c.appendChild(el('div', 't1', !window.Chart ? 'Diagramm-Bibliothek fehlt' : 'Noch keine Fasten-Daten'));
    const p = el('p', 'hint');
    p.appendChild(document.createTextNode('Auf dem Mac im Ordner docfit-app: '));
    p.appendChild(el('code', null, 'python3 tools/fasting_from_excel.py'));
    p.appendChild(document.createTextNode(' – danach DocFit neu bauen.'));
    c.appendChild(p);
    view.appendChild(c);
    return;
  }
  // the colour scheme in the browser: gear -> Blau / Grau / Hell, stored under svp-theme like DocDo (in the app the
  // header with the gear is hidden - DocFit's own setting decides, see index.html)
  const THEMES = ['dark', 'grey', 'light'];
  const gear = document.getElementById('gearBtn'), settings = document.getElementById('settings');
  const seg = document.getElementById('themeSeg');
  function markTheme() {
    const r = document.documentElement;
    const t = r.classList.contains('svp-light') ? 'light' : r.classList.contains('svp-grey') ? 'grey' : 'dark';
    for (const b of seg.children) b.setAttribute('aria-checked', String(b.dataset.theme === t));
  }
  function applyTheme(t) {
    t = THEMES.includes(t) ? t : 'dark';
    document.documentElement.classList.toggle('svp-light', t === 'light');
    document.documentElement.classList.toggle('svp-grey', t === 'grey');
    try { localStorage.setItem('svp-theme', t); } catch (e) { /* storage blocked */ }
    markTheme();
    route();
  }
  function showSettings(on) {
    settings.hidden = !on;
    gear.setAttribute('aria-expanded', String(on));
  }
  markTheme();
  seg.addEventListener('click', e => { const b = e.target.closest('button'); if (b) applyTheme(b.dataset.theme); });
  gear.addEventListener('click', () => showSettings(settings.hidden));
  document.addEventListener('pointerdown', e => {
    if (!settings.hidden && !e.target.closest('#settings, #gearBtn')) showSettings(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') showSettings(false); });

  window.addEventListener('hashchange', route);
  // a turn of the phone changes whether the row of fasts wraps or scrolls sideways: keep the shown one in sight
  window.addEventListener('resize', () => {
    const c = nav.querySelector('[aria-current]');
    if (!c || nav.scrollWidth <= nav.clientWidth) return;
    const off = c.getBoundingClientRect().left - nav.getBoundingClientRect().left;
    nav.scrollLeft += off - (nav.clientWidth - c.offsetWidth) / 2;
  });
  route();
})();
