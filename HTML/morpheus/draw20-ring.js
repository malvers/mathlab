// Polygon-Ring diagnostic view for the draw20 stack.
// Plain global — loaded before draw20.js.
//
// Opens a separate window showing every PNG and LaTeX OUTER polygon
// arranged around a circle. Each slot has its label (PNG#N / LaTeX#M),
// matchId (= shared colour), and plausibility score for paired ones.
// Orphans get a red dashed border. Holes are rendered inside their
// outer so the shape reads correctly.
//
// Inputs:
//   ringData         — snapshot saved by renderBBoxes (lastRenderData)
//   matchingEnabled  — global match-toggle (skips orphan flagging when off)

function draw20OpenPolygonRing(ringData, matchingEnabled) {
    if (!ringData) {
        alert('Noch keine Polygon-Daten — bitte erst eine Formel laden.');
        return;
    }
    const { pngContours, latexContours, pClass, lClass,
            pngId, latId, idToPair, plausibility,
            pngDisplayScale, latDisplayScale } = ringData;

    // Build a flat list of items {polys, matchId, label, score, orphan}.
    const items = [];
    const orphanLookup = new Set();
    // Skip orphan tagging when matching is off — every outer would
    // otherwise be flagged as "no partner" and render bright red.
    if (matchingEnabled) {
        for (const [id, pair] of idToPair) {
            if (pair.png < 0 || pair.lat < 0) orphanLookup.add(id);
        }
    }
    const scoreById = new Map();
    if (plausibility) {
        for (const m of plausibility.matches) {
            for (const [id, pair] of idToPair) {
                if (pair.png === m.pngIdx) {
                    scoreById.set(id, { score: m.score, verdict: m.verdict });
                    break;
                }
            }
        }
    }

    if (pngContours && pClass) {
        for (let oi = 0; oi < pClass.outers.length; oi++) {
            const o = pClass.outers[oi];
            const id = pngId[o.idx];
            items.push({
                outer: pngContours[o.idx],
                holes: (o.holes || []).map(hi => pngContours[hi]).filter(Boolean),
                label: `P${oi}`,
                matchId: id,
                score: scoreById.get(id),
                orphan: orphanLookup.has(id) && idToPair.get(id).lat < 0,
            });
        }
    }
    if (latexContours && lClass) {
        for (let oi = 0; oi < lClass.outers.length; oi++) {
            const o = lClass.outers[oi];
            const id = latId[o.idx];
            items.push({
                outer: latexContours[o.idx],
                holes: (o.holes || []).map(hi => latexContours[hi]).filter(Boolean),
                label: `L${oi}`,
                matchId: id,
                score: scoreById.get(id),
                orphan: orphanLookup.has(id) && idToPair.get(id).png < 0,
            });
        }
    }
    if (!items.length) {
        alert('Keine Outer-Polygone zum Anzeigen.');
        return;
    }

    // Layout: PNG on LEFT half, LaTeX on RIGHT half of the ring.
    // Each polygon is drawn at the EXACT on-screen size it has in the
    // live panes (natural-pixel coords × display-scale captured when
    // renderBBoxes last ran). No re-scaling — the polygons appear as
    // big as they are on the page.
    const W = 1800, H = 1300;
    const cx = W / 2, cy = H / 2;
    const R = 580;
    const pngItems = items.filter(it => it.label[0] === 'P');
    const latItems = items.filter(it => it.label[0] === 'L');
    const pngScale = pngDisplayScale || 1;
    const latScale = latDisplayScale || 1;

    const placeAt = (it, angle, scale) => {
        const px = cx + R * Math.cos(angle);
        const py = cy + R * Math.sin(angle);
        return { it, px, py, scale };
    };
    const placed = [];
    pngItems.forEach((it, i) => {
        const angle = -Math.PI / 2 - (i + 0.5) * Math.PI / pngItems.length;
        placed.push(placeAt(it, angle, pngScale));
    });
    latItems.forEach((it, i) => {
        const angle = -Math.PI / 2 + (i + 0.5) * Math.PI / latItems.length;
        placed.push(placeAt(it, angle, latScale));
    });

    // Per-pane equation bboxes (for normalised descriptors used in
    // the cross-polygon similarity ranking).
    const pBB = pngItems.length
        ? PlausibilCheck.equationBBox(pngItems.map(it => it.outer))
        : { cx: 0, cy: 0, w: 1, h: 1 };
    const lBB = latItems.length
        ? PlausibilCheck.equationBBox(latItems.map(it => it.outer))
        : { cx: 0, cy: 0, w: 1, h: 1 };

    const svgPieces = [];
    const polyData = []; // { idx, px, py, top3: [{idx, score}, ...] }

    placed.forEach(({ it, px, py, scale }, idx) => {
        const isOrphan = !!it.orphan;
        const colour = isOrphan
            ? DRAW20_ORPHAN_COLOR
            : (it.matchId >= 0 ? draw20PaletteColor(it.matchId) : '#888');
        const pathStyle = isOrphan ? ` style="filter:${DRAW20_ORPHAN_GLOW}"` : '';

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const [x, y] of it.outer) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
        const ox = (minX + maxX) / 2;
        const oy = (minY + maxY) / 2;
        // Scaled-screen bbox for the hover hit-test rect.
        const sw = (maxX - minX) * scale;
        const sh = (maxY - minY) * scale;
        const pad = 14; // generous so even thin glyphs are easy to hit
        const boxX = px - sw / 2 - pad;
        const boxY = py - sh / 2 - pad;
        const boxW = sw + pad * 2;
        const boxH = sh + pad * 2;

        const place = (poly) => poly.map(([x, y]) =>
            `${px + (x - ox) * scale},${py + (y - oy) * scale}`).join(' ');

        let d = `M ${place(it.outer).split(' ').join(' L ')} Z`;
        for (const hp of it.holes) {
            d += ` M ${place(hp).split(' ').join(' L ')} Z`;
        }
        // Visible polygon (no hover hook).
        svgPieces.push(
            `<path d="${d}" fill="${colour}" fill-rule="evenodd" stroke="none"${pathStyle}/>`
        );
        // Transparent hit-test rect ON TOP — captures mouseenter for
        // its whole bounding box (much easier to hit than a thin
        // glyph). Visually invisible but cursor stays pointer.
        svgPieces.push(
            `<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" data-idx="${idx}" fill="transparent" pointer-events="all" style="cursor:pointer"/>`
        );
        polyData.push({ idx, px, py, colour, src: it.label[0] });
    });

    // Per-polygon shape descriptor — serialised into the popup so the
    // top-3 can be RE-COMPUTED on the fly when the user drags the
    // weight sliders.
    const descriptors = placed.map(({ it }) => {
        const bb = it.label[0] === 'P' ? pBB : lBB;
        return PlausibilCheck.shapeDescriptor(it.outer, it.holes, bb);
    });
    // Attach a slim descriptor (only what shapeOnlyPlausibility needs)
    // to each polyData entry so the popup can score pairs locally.
    descriptors.forEach((d, i) => {
        polyData[i].desc = d ? {
            size: d.size, elong: d.elong, fuzz: d.fuzz,
            massX: d.massX, massY: d.massY,
            holes: d.holes, holeFrac: d.holeFrac,
        } : null;
    });

    // Restore the user's last window size/position (persisted in
    // localStorage by the popup itself via beforeunload).
    let geom = null;
    try { geom = JSON.parse(localStorage.getItem('draw20-ring-geom') || 'null'); } catch (_) {}
    const defW = Math.min(W, Math.round(window.screen.availWidth * 0.9));
    const defH = Math.min(H + 60, Math.round(window.screen.availHeight * 0.9));
    const wsz = geom && geom.w > 200 ? geom.w : defW;
    const hsz = geom && geom.h > 200 ? geom.h : defH;
    const features = [`width=${wsz}`, `height=${hsz}`];
    if (geom && Number.isFinite(geom.x) && Number.isFinite(geom.y)) {
        features.push(`left=${geom.x}`, `top=${geom.y}`);
    }
    const win = window.open('', 'draw20-polygon-ring', features.join(','));
    if (!win) { alert('Popup wurde blockiert.'); return; }
    win.document.open();
    win.document.write(`<!DOCTYPE html><html lang="de"><head>
<meta charset="utf-8"><title>Polygon Ring (${items.length} outers)</title>
<style>
  html, body { height: 100%; }
  body { margin: 0; padding: 0; background: #000010; color: #aaa; font-family: 'Orbitron', sans-serif; display: flex; flex-direction: column; }
  .hdr { padding: 6px 16px; font-size: 11px; color: #00d2ff; border-bottom: 1px solid #222; flex: 0 0 auto; }
  .sliders { display: flex; gap: 14px; padding: 10px 16px; border-bottom: 1px solid #222; flex: 0 0 auto; flex-wrap: wrap; align-items: center; background: rgba(0,0,40,0.4); }
  .sl { display: flex; flex-direction: column; gap: 2px; min-width: 110px; }
  .sl .row { display: flex; align-items: center; gap: 8px; }
  .sl label { font-size: 10px; letter-spacing: 0.08em; color: #aaa; text-transform: uppercase; }
  .sl input[type=range] { flex: 1; accent-color: #00d2ff; }
  .sl .val { font-size: 11px; color: #00d2ff; font-weight: 700; min-width: 28px; text-align: right; font-family: Arial, sans-serif; }
  .reset { padding: 6px 12px; background: rgba(0,0,0,0.6); color: #00d2ff; border: 1px solid rgba(0,210,255,0.5); border-radius: 4px; font-family: 'Orbitron', sans-serif; font-size: 10px; font-weight: 700; cursor: pointer; letter-spacing: 0.08em; }
  .stage { flex: 1 1 auto; min-height: 0; }
  svg { display: block; background: #000010; width: 100%; height: 100%; }
  rect[data-idx] { transition: stroke 0.1s; }
</style></head><body>
<div class="hdr">Polygon Ring — ${items.length} outer polygons (PNG: ${pngItems.length}, LaTeX: ${latItems.length}) · <b>klick</b> ein Polygon (lock) — slider gewichten in Echtzeit · <span style="color:#F4C430;font-weight:700">[A]</span> Top-1 für alle</div>
<div class="sliders" id="sliders">
  <div class="sl"><label>Mass</label><div class="row"><input type="range" id="w-mass" min="0" max="100" value="38"><span class="val" id="v-mass">38</span></div></div>
  <div class="sl"><label>Size</label><div class="row"><input type="range" id="w-size" min="0" max="100" value="20"><span class="val" id="v-size">20</span></div></div>
  <div class="sl"><label>Holes</label><div class="row"><input type="range" id="w-holes" min="0" max="100" value="18"><span class="val" id="v-holes">18</span></div></div>
  <div class="sl"><label>Elong</label><div class="row"><input type="range" id="w-elong" min="0" max="100" value="14"><span class="val" id="v-elong">14</span></div></div>
  <div class="sl"><label>Fuzz</label><div class="row"><input type="range" id="w-fuzz" min="0" max="100" value="10"><span class="val" id="v-fuzz">10</span></div></div>
  <button class="reset" id="greedy-match">GREEDY [G]</button>
  <button class="reset" id="reset-weights">RESET</button>
</div>
<div class="stage"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
  <g id="similarity-lines"></g>
  ${svgPieces.join('')}
</svg></div>
<script>
  const POLYS = ${JSON.stringify(polyData)};
  const layer = document.getElementById('similarity-lines');
  function clearLines() { while (layer.firstChild) layer.removeChild(layer.firstChild); }
  const NS = 'http://www.w3.org/2000/svg';

  // Weight state — driven by the 5 sliders. Defaults match shapeOnlyPlausibility.
  const W = { mass: 38, size: 20, holes: 18, elong: 14, fuzz: 10 };
  function readSliders() {
    W.mass  = +document.getElementById('w-mass').value;
    W.size  = +document.getElementById('w-size').value;
    W.holes = +document.getElementById('w-holes').value;
    W.elong = +document.getElementById('w-elong').value;
    W.fuzz  = +document.getElementById('w-fuzz').value;
    document.getElementById('v-mass').textContent  = W.mass;
    document.getElementById('v-size').textContent  = W.size;
    document.getElementById('v-holes').textContent = W.holes;
    document.getElementById('v-elong').textContent = W.elong;
    document.getElementById('v-fuzz').textContent  = W.fuzz;
  }
  // Score function: identical to PlausibilCheck.shapeOnlyPlausibility but
  // with weights from the sliders (renormalised so they sum to 1).
  function score(a, b) {
    if (!a || !b) return 0;
    const sizeR = Math.abs(Math.log((a.size + 1e-4) / (b.size + 1e-4)));
    const sSize = Math.max(0, 1 - sizeR / 1.5);
    const elongR = Math.abs(Math.log(a.elong / b.elong));
    const sElong = Math.max(0, 1 - elongR / 1.0);
    const fuzzR = Math.abs(Math.log(a.fuzz / b.fuzz));
    const sFuzz = Math.max(0, 1 - fuzzR / 1.0);
    const dmX = Math.abs(a.massX - b.massX);
    const dmY = Math.abs(a.massY - b.massY);
    const sMass = Math.max(0, 1 - (dmX + dmY) / 1.5);
    const dh = Math.abs(a.holes - b.holes);
    const dhf = Math.abs(a.holeFrac - b.holeFrac);
    const sHoles = Math.max(0, 1 - dh / 2 - dhf * 0.5);
    const sum = W.mass + W.size + W.holes + W.elong + W.fuzz;
    if (sum <= 0) return 0;
    return (W.mass * sMass + W.size * sSize + W.holes * sHoles
          + W.elong * sElong + W.fuzz * sFuzz) / sum;
  }
  function topN(idx, n) {
    const me = POLYS[idx];
    if (!me || !me.desc) return [];
    const out = [];
    for (let j = 0; j < POLYS.length; j++) {
      if (j === idx) continue;
      const o = POLYS[j];
      if (!o.desc || o.src === me.src) continue;
      out.push({ idx: j, score: score(me.desc, o.desc) });
    }
    out.sort((a, b) => b.score - a.score);
    return out.slice(0, n);
  }

  let lockedIdx = null;
  function showFor(idx) {
    clearLines();
    const me = POLYS[idx];
    if (!me) return;
    // Recompute top-3 on the fly using current slider weights.
    const top3 = topN(idx, 3);
    if (!top3.length) return;
    // Rank 0 (most similar) gets thickest, brightest line; rank 2 thinnest.
    top3.forEach((t, r) => {
      const other = POLYS[t.idx];
      if (!other) return;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', me.px); line.setAttribute('y1', me.py);
      line.setAttribute('x2', other.px); line.setAttribute('y2', other.py);
      line.setAttribute('stroke', '#cccccc');
      line.setAttribute('stroke-width', String(4 - r));
      line.setAttribute('opacity', String(0.85 - r * 0.20));
      layer.appendChild(line);
      // Score badge: a rounded box with the percentage, positioned along the
      // line biased toward the target end. Big text + dark backdrop for
      // readability against any underlying polygon colour.
      const tx = me.px + (other.px - me.px) * 0.62;
      const ty = me.py + (other.py - me.py) * 0.62;
      const label = Math.round(t.score * 100) + '%';
      const fontSize = 32;
      const padX = 16, padY = 10;
      const charW = fontSize * 0.55;
      const boxW = label.length * charW + padX * 2;
      const boxH = fontSize + padY * 2;
      // Rank → colour: best=green, 2nd=yellow, 3rd=red.
      const RANK_COL = ['#3cb44b', '#F4C430', '#FF1744'];
      const rankCol = RANK_COL[r] || '#888';
      const g = document.createElementNS(NS, 'g');
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', tx - boxW / 2);
      rect.setAttribute('y', ty - boxH / 2);
      rect.setAttribute('width', boxW);
      rect.setAttribute('height', boxH);
      rect.setAttribute('rx', 8);
      rect.setAttribute('fill', '#000');
      rect.setAttribute('stroke', rankCol);
      rect.setAttribute('stroke-width', '2');
      g.appendChild(rect);
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', tx);
      txt.setAttribute('y', ty);
      txt.setAttribute('fill', rankCol);
      txt.setAttribute('font-size', String(fontSize));
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'central');
      txt.textContent = label;
      g.appendChild(txt);
      layer.appendChild(g);
    });
  }
  // Draw one line from each polygon's centroid to its top-1 most similar
  // partner — used by [A] overview mode. Each line is coloured by the PNG
  // endpoint's polygon colour.
  function drawTop1ForAll() {
    clearLines();
    POLYS.forEach(me => {
      if (!me.desc) return;
      const top = topN(me.idx, 1);
      if (!top.length) return;
      const other = POLYS[top[0].idx];
      if (!other) return;
      const pngEnd = me.src === 'P' ? me : (other.src === 'P' ? other : me);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', me.px); line.setAttribute('y1', me.py);
      line.setAttribute('x2', other.px); line.setAttribute('y2', other.py);
      line.setAttribute('stroke', pngEnd.colour);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('opacity', '0.75');
      layer.appendChild(line);
    });
  }
  let allMode = false;
  let greedyMode = false;

  // Greedy bipartite assignment: sort every cross-pane pair by score
  // descending, fix the top pair, mark both endpoints "used" so they can't
  // appear in another pair, repeat. Not globally optimal like Hungarian,
  // but simple and intuitive — and respects the current slider weights.
  function drawGreedy() {
    clearLines();
    const pairs = [];
    for (let i = 0; i < POLYS.length; i++) {
      const a = POLYS[i];
      if (!a.desc) continue;
      for (let j = i + 1; j < POLYS.length; j++) {
        const b = POLYS[j];
        if (!b.desc || a.src === b.src) continue;
        pairs.push({ i, j, s: score(a.desc, b.desc) });
      }
    }
    pairs.sort((x, y) => y.s - x.s);
    const used = new Set();
    const picked = [];
    for (const p of pairs) {
      if (used.has(p.i) || used.has(p.j)) continue;
      used.add(p.i); used.add(p.j);
      picked.push(p);
    }
    // Draw — top of the list = highest score = thickest, brightest line.
    picked.forEach((p, rank) => {
      const a = POLYS[p.i], b = POLYS[p.j];
      const pngEnd = a.src === 'P' ? a : (b.src === 'P' ? b : a);
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', a.px); line.setAttribute('y1', a.py);
      line.setAttribute('x2', b.px); line.setAttribute('y2', b.py);
      line.setAttribute('stroke', pngEnd.colour);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('opacity', '0.85');
      layer.appendChild(line);
      // Score badge in the middle of each line.
      const tx = (a.px + b.px) / 2;
      const ty = (a.py + b.py) / 2;
      const label = Math.round(p.s * 100) + '%';
      const fontSize = 24;
      const padX = 10, padY = 6;
      const boxW = label.length * fontSize * 0.55 + padX * 2;
      const boxH = fontSize + padY * 2;
      const rankCol = p.s >= 0.70 ? '#3cb44b' : p.s >= 0.55 ? '#F4C430' : '#FF1744';
      const g = document.createElementNS(NS, 'g');
      const rect = document.createElementNS(NS, 'rect');
      rect.setAttribute('x', tx - boxW / 2);
      rect.setAttribute('y', ty - boxH / 2);
      rect.setAttribute('width', boxW);
      rect.setAttribute('height', boxH);
      rect.setAttribute('rx', 6);
      rect.setAttribute('fill', '#000');
      rect.setAttribute('stroke', rankCol);
      rect.setAttribute('stroke-width', '2');
      g.appendChild(rect);
      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', tx);
      txt.setAttribute('y', ty);
      txt.setAttribute('fill', rankCol);
      txt.setAttribute('font-size', String(fontSize));
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'Arial, sans-serif');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('dominant-baseline', 'central');
      txt.textContent = label;
      g.appendChild(txt);
      layer.appendChild(g);
    });
  }

  // Click to LOCK a polygon's top-3 display. Click again or on another →
  // switches. The lines stay until cleared.
  document.querySelectorAll('[data-idx]').forEach(p => {
    p.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const idx = +p.dataset.idx;
      if (lockedIdx === idx) { lockedIdx = null; clearLines(); }
      else { lockedIdx = idx; allMode = false; showFor(idx); }
    });
  });
  // Click on empty space (the SVG, not on a polygon) → unlock.
  document.querySelector('svg').addEventListener('click', () => {
    lockedIdx = null;
    if (allMode) drawTop1ForAll(); else clearLines();
  });

  function redraw() {
    if (greedyMode) drawGreedy();
    else if (allMode) drawTop1ForAll();
    else if (lockedIdx !== null) showFor(lockedIdx);
    else clearLines();
  }

  // Keys: [A] = top-1 for all, [G] = greedy assignment.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'a' || e.key === 'A') {
      allMode = !allMode;
      if (allMode) { greedyMode = false; lockedIdx = null; }
      redraw();
    } else if (e.key === 'g' || e.key === 'G') {
      greedyMode = !greedyMode;
      if (greedyMode) { allMode = false; lockedIdx = null; }
      redraw();
    }
  });

  // Slider listeners — recompute live.
  ['mass','size','holes','elong','fuzz'].forEach(k => {
    document.getElementById('w-' + k).addEventListener('input', () => {
      readSliders();
      redraw();
    });
  });
  document.getElementById('reset-weights').addEventListener('click', () => {
    document.getElementById('w-mass').value = 38;
    document.getElementById('w-size').value = 20;
    document.getElementById('w-holes').value = 18;
    document.getElementById('w-elong').value = 14;
    document.getElementById('w-fuzz').value = 10;
    readSliders();
    redraw();
  });
  document.getElementById('greedy-match').addEventListener('click', () => {
    greedyMode = !greedyMode;
    if (greedyMode) { allMode = false; lockedIdx = null; }
    redraw();
  });
  readSliders();
  // Persist window geometry (size + position). Shared localStorage with the
  // opener since the popup is same-origin.
  function saveGeom() {
    try {
      localStorage.setItem('draw20-ring-geom', JSON.stringify({
        w: window.outerWidth,
        h: window.outerHeight,
        x: window.screenX,
        y: window.screenY,
      }));
    } catch (_) {}
  }
  window.addEventListener('resize', saveGeom);
  window.addEventListener('beforeunload', saveGeom);
  // Position has no event — poll every 1.5s while the popup is open.
  setInterval(saveGeom, 1500);
</script>
</body></html>`);
    win.document.close();
}
