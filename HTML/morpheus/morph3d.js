// 3D MORPH — companion to the RING diagnostic. Owns the button creation and
// the popup-window logic for the 3D view.
//
// Mirrors draw20-ring.js exactly: window.open with EMPTY URL + document.write,
// so window-features (width/height/left/top) are reliably honored by the
// browser. Data is passed via a global on the opener.
//
// Public API:
//   Morph3D.createMorph3DButton(host, onClick?)
//   Morph3D.openMorph3D(ringData) → opens the 3D MORPH window
(function (global) {

    const GEOM_KEY = 'draw20-morph3d-geom';

    // Tracks the most recently opened popup window so we can detect "still open"
    // for auto-refresh on formula changes.
    let popupWin = null;

    function openMorph3D(ringData) {
        // Pass data through the opener so the popup can read it.
        global.__morph3dData = ringData || null;

        // Restore the user's last window position (persisted via beforeunload).
        // Size is fixed to avoid width/height feature creep.
        let geom = null;
        try { geom = JSON.parse(localStorage.getItem(GEOM_KEY) || 'null'); } catch (_) {}
        const defW = 800;
        const defH = Math.min(900, Math.round(window.screen.availHeight * 0.9));
        const features = [`width=${defW}`, `height=${defH}`];
        if (geom && Number.isFinite(geom.x) && Number.isFinite(geom.y)) {
            features.push(`left=${geom.x}`, `top=${geom.y}`);
        }

        // EMPTY URL + document.write — same pattern as RING. Browsers honor
        // features reliably with an empty URL; navigating a same-named window
        // to a real URL tends to be treated as a tab in modern Chrome.
        const win = window.open('', 'draw20-morph3d', features.join(','));
        if (!win) { alert('Popup wurde blockiert.'); return null; }
        try { win.focus(); } catch (e) {}

        // If reusing an existing window, wipe it before writing fresh content.
        win.document.open();
        win.document.write(POPUP_HTML);
        win.document.close();
        popupWin = win;
        return win;
    }

    // Called by render after a formula change. Triggers a refresh ONLY if the
    // popup is currently open — silent no-op otherwise.
    function refreshIfOpen() {
        if (popupWin && !popupWin.closed) {
            const btn = document.getElementById('draw20-morph3d-btn');
            if (btn) btn.click();
        }
    }

    function createMorph3DButton(host, onClick) {
        const btn = document.createElement('button');
        btn.id = 'draw20-morph3d-btn';
        btn.textContent = '3D MORPH';
        btn.title = '3D-Morph-Ansicht öffnen (neues Fenster)';
        btn.addEventListener('click', () => {
            if (typeof onClick === 'function') onClick();
            else openMorph3D(null);
        });
        if (host && typeof host.appendChild === 'function') host.appendChild(btn);
        return btn;
    }

    // ── Popup HTML template ────────────────────────────────────────────────
    // Loaded via document.write into the popup. Reads window.opener.__morph3dData
    // and builds a Three.js scene with the PNG outers at z=0 and LaTeX outers
    // at z=Z_LAT, connected by per-vertex correspondence lines.
    const POPUP_HTML = `<!DOCTYPE html>
<html lang="de"><head>
<meta charset="UTF-8"><title>3D MORPH</title>
<style>
    html, body { margin: 0; padding: 0; height: 100%; background: rgb(8, 20, 42); overflow: hidden; font-family: 'Orbitron', sans-serif; color: #00d2ff; }
    canvas { display: block; }
    #hud { position: fixed; bottom: 12px; left: 12px; font-size: 11px; letter-spacing: 1.5px; opacity: 0.85; pointer-events: none; line-height: 1.5; }
    #top-bar {
        position: fixed; top: 12px; left: 12px; right: 12px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 10px; z-index: 100;
    }
    #empty { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-size: 1.1rem; letter-spacing: 0.1em; opacity: 0.7; }
    .row { display: flex; gap: 14px; align-items: center; }
    .swatch { display: inline-block; width: 12px; height: 12px; border-radius: 2px; vertical-align: middle; }
    #reload-btn, .top-toggle, .view-btn {
        font-family: 'Orbitron', sans-serif; font-size: 11px; letter-spacing: 1.2px;
        padding: 6px 12px; cursor: pointer;
        background: rgba(0, 210, 255, 0.08); color: rgba(0, 210, 255, 0.85);
        border: 1px solid rgba(0, 210, 255, 0.3); border-radius: 4px;
        transition: background 0.15s ease, color 0.15s ease;
        white-space: nowrap;
        display: flex; align-items: center; justify-content: center; width: 100px; height: 32px;
        box-sizing: border-box;
    }
    #reload-btn:hover, .top-toggle:hover, .view-btn:hover {
        background: rgba(0, 210, 255, 0.22); color: #fff;
    }
    .top-toggle { display: inline-flex; align-items: center; gap: 8px; user-select: none; }
    .top-toggle input { cursor: pointer; accent-color: #00d2ff; }
    #reload-btn {
        background: rgba(0, 210, 255, 0.12); color: #00d2ff;
        border-color: rgba(0, 210, 255, 0.45);
        letter-spacing: 1.5px;
    }
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head><body>
<div id="hud">
    <div class="row"><span class="swatch" style="background:#adff2f"></span>PNG · DRAWING · <span id="hud-png-pts">–</span> Pts</div>
    <div class="row"><span class="swatch" style="background:#F4C430"></span>LaTeX · TARGET · <span id="hud-lat-pts">–</span> Pts</div>
    <div style="margin-top:8px;opacity:0.6">drag · orbit · wheel · zoom · ESC · reset</div>
    <div style="margin-top:2px;opacity:0.6">Ansicht: O/U oben/unten · V/H vorn/hinten · R rechts · L LINIEN toggle</div>
</div>
<div id="top-bar">
    <label class="top-toggle" title="Korrespondenz-Linien zwischen den Ebenen ein/aus">
        <input type="checkbox" id="lines-mode-cb">LINIEN
    </label>
    <label class="top-toggle" title="Picking-Modus: große Punkte zum Auswählen (off = 30%, dezent)">
        <input type="checkbox" id="pick-mode-cb">PICKING
    </label>
    <label class="top-toggle" title="Originalgrößen (kein Auto-Fit pro Seite)">
        <input type="checkbox" id="scale-natural-cb">ORIGINAL
    </label>
    <button class="view-btn" id="view-btn-vorn-hinten"  data-toggle="front-back">V ⇄ H</button>
    <button class="view-btn" id="view-btn-links-rechts" data-toggle="left-right">L ⇄ R</button>
    <button class="view-btn" id="view-btn-oben-unten"   data-toggle="top-bottom">O ⇄ U</button>
    <button id="reload-btn" onclick="(function(){ try { var b = window.opener && window.opener.document.getElementById('draw20-morph3d-btn'); if (b) b.click(); else location.reload(); } catch (e) { location.reload(); } })()">↻ RELOAD</button>
</div>
<div id="empty" style="display:none">Keine Polygon-Daten — bitte erst Formel + Zeichnung in morph.html laden.</div>
<script>
(function () {
    const data = window.opener && window.opener.__morph3dData;
    const emptyEl = document.getElementById('empty');
    if (!data || !data.pngContours || !data.latexContours) {
        const why = !window.opener ? 'window.opener ist null (Popup-Block oder noopener?)'
                   : !window.opener.__morph3dData ? '__morph3dData ist null/undefined auf opener'
                   : !data.pngContours ? 'pngContours fehlen'
                   : !data.latexContours ? 'latexContours fehlen'
                   : 'unbekannt';
        emptyEl.innerHTML = 'Keine Polygon-Daten — bitte erst Formel + Zeichnung in morph.html laden.<br><br>'
            + '<span style="font-size:0.7rem;opacity:0.6">Diagnose: ' + why + '</span>';
        emptyEl.style.display = 'block';
    } else if (typeof THREE === 'undefined') {
        emptyEl.innerHTML = 'Three.js konnte nicht geladen werden — Netzwerk prüfen.';
        emptyEl.style.display = 'block';
    } else {
        runScene(data);
    }

    function runScene(data) {
        function collectOuters(contours, classification, displayScale) {
            const out = [];
            if (!contours || !classification || !classification.outers) return out;
            for (let oi = 0; oi < classification.outers.length; oi++) {
                const o = classification.outers[oi];
                const c = contours[o.idx];
                if (c && c.length) {
                    const pts = c.map(function (p) { return { x: p[0] * displayScale, y: p[1] * displayScale }; });
                    out.push({
                        pts: pts,
                        holes: (o.holes || []).map(function (hi) { return contours[hi]; }).filter(Boolean)
                            .map(function (h) { return h.map(function (p) { return { x: p[0] * displayScale, y: p[1] * displayScale }; }); }),
                    });
                }
            }
            return out;
        }

        const pngOuters = collectOuters(data.pngContours, data.pClass, data.pngDisplayScale || 1);
        const latOuters = collectOuters(data.latexContours, data.lClass, data.latDisplayScale || 1);

        if (!pngOuters.length && !latOuters.length) {
            document.getElementById('empty').style.display = 'block';
            return;
        }

        function bboxOf(outers) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const o of outers) for (const p of o.pts) {
                if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
                if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y;
            }
            return { minX: minX, minY: minY, maxX: maxX, maxY: maxY,
                     w: maxX - minX, h: maxY - minY,
                     cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
        }
        const pngBB = bboxOf(pngOuters);
        const latBB = bboxOf(latOuters);
        // Auto-fit (default): each side scaled so longest axis = targetSize.
        // Natural: no scaling — both sides keep their real relative sizes.
        const SCALE_KEY = 'draw20-morph3d-natural';
        const naturalMode = false; // (function () {
            // try { return localStorage.getItem(SCALE_KEY) === '1'; } catch (_) { return false; }
        // })();
        const cb = document.getElementById('scale-natural-cb');
        if (cb) {
            cb.checked = naturalMode;
            cb.addEventListener('change', function () {
                // try { localStorage.setItem(SCALE_KEY, cb.checked ? '1' : '0'); } catch (_) {}
                // Popup URL is about:blank (window.open with empty url + doc.write),
                // so location.reload() would render an empty page. Instead poke the
                // opener's 3D MORPH button — it re-writes fresh content into the
                // same named window, which picks up the new SCALE_KEY value.
                try {
                    const b = window.opener && window.opener.document.getElementById('draw20-morph3d-btn');
                    if (b) b.click();
                } catch (_) {}
            });
        }
        const targetSize = 400;
        let pngScale, latScale;
        if (naturalMode) {
            // Shared scale: relative sizes preserved, total fits the camera.
            const longest = Math.max(pngBB.w, pngBB.h, latBB.w, latBB.h);
            const uniform = longest > 0 ? targetSize / longest : 1;
            pngScale = uniform;
            latScale = uniform;
        } else {
            // Auto-fit per side: each shape uses the same on-screen footprint.
            pngScale = Math.max(pngBB.w, pngBB.h) > 0 ? targetSize / Math.max(pngBB.w, pngBB.h) : 1;
            latScale = Math.max(latBB.w, latBB.h) > 0 ? targetSize / Math.max(latBB.w, latBB.h) : 1;
        }
        function normalize(outers, bb, scale) {
            return outers.map(function (o) {
                return {
                    pts: o.pts.map(function (p) { return { x: (p.x - bb.cx) * scale, y: -(p.y - bb.cy) * scale }; }),
                    holes: o.holes.map(function (h) { return h.map(function (p) { return { x: (p.x - bb.cx) * scale, y: -(p.y - bb.cy) * scale }; }); }),
                };
            });
        }
        const pngN = normalize(pngOuters, pngBB, pngScale);
        const latN = normalize(latOuters, latBB, latScale);

        // Total vertex counts → HUD top-left, mirrors morph.html's "Pts:" cards.
        function totalPts(outers) {
            let n = 0;
            for (const o of outers) n += o.pts.length;
            return n;
        }
        const pngPtsEl = document.getElementById('hud-png-pts');
        const latPtsEl = document.getElementById('hud-lat-pts');
        if (pngPtsEl) pngPtsEl.textContent = totalPts(pngN);
        if (latPtsEl) latPtsEl.textContent = totalPts(latN);

        function resample(pts, N) {
            if (!pts || pts.length < 2) {
                const fallback = []; for (let i = 0; i < N; i++) fallback.push({ x: 0, y: 0 }); return fallback;
            }
            let total = 0;
            const segLen = [];
            for (let i = 0; i < pts.length; i++) {
                const a = pts[i], b = pts[(i + 1) % pts.length];
                const d = Math.hypot(b.x - a.x, b.y - a.y);
                segLen.push(d); total += d;
            }
            if (total === 0) {
                const out0 = []; for (let i = 0; i < N; i++) out0.push(pts[0]); return out0;
            }
            const step = total / N;
            const out = [];
            let segIdx = 0, segRem = segLen[0], cur = { x: pts[0].x, y: pts[0].y };
            for (let i = 0; i < N; i++) {
                out.push({ x: cur.x, y: cur.y });
                let need = step;
                while (need > segRem + 1e-9 && segIdx < pts.length - 1) {
                    need -= segRem;
                    segIdx++;
                    cur = { x: pts[segIdx].x, y: pts[segIdx].y };
                    segRem = segLen[segIdx];
                }
                if (segRem > 1e-9) {
                    const next = pts[(segIdx + 1) % pts.length];
                    const t = need / segRem;
                    cur = { x: cur.x + (next.x - cur.x) * t, y: cur.y + (next.y - cur.y) * t };
                    segRem -= need;
                }
            }
            return out;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x081428);

        const cam = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 5000);
        cam.position.set(700, 400, 1100);
        // Remember initial camera + orbit-target so ESC restores the default view.
        const CAM_HOME = cam.position.clone();
        const TARGET_HOME = new THREE.Vector3(0, 0, 175);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(renderer.domElement);

        cam.up.set(0, 1, 0); // Explicit up before constructing controls
        const controls = new THREE.OrbitControls(cam, renderer.domElement);
        controls.enableDamping = false; // No inertia/Nachlauf — camera stops instantly on release
        controls.target.set(0, 0, 175);

        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(300, 400, 300);
        scene.add(sun);

        // Grid helpers removed — user-requested clean view.

        function addOutlineLoop(pts, z, color) {
            if (!pts.length) return;
            const verts = pts.map(function (p) { return new THREE.Vector3(p.x, p.y, z); });
            verts.push(verts[0].clone());
            const geom = new THREE.BufferGeometry().setFromPoints(verts);
            scene.add(new THREE.Line(geom, new THREE.LineBasicMaterial({ color: color })));
        }
        const PNG_COLOR = 0xadff2f;
        const LAT_COLOR = 0xF4C430;
        const LINK_COLOR = 0x4dbfa0;
        const SAMPLES = 80;
        const Z_PNG = 0;
        const Z_LAT = 350;

        // Picking renders the ORIGINAL polygon vertices (not resampled). For a
        // matched outer pair, each original vertex's partner is found via
        // arc-length-fraction: vertex at fraction t along outline A maps to
        // the point at the same fraction along outline B.
        const pickablePoints = [];
        const highlightGroup = new THREE.Group();
        scene.add(highlightGroup);

        // Cumulative perimeter lengths — used to map a vertex index → fraction t.
        function cumulativeLengths(pts) {
            const cum = [0];
            let total = 0;
            for (let i = 0; i < pts.length; i++) {
                const a = pts[i], b = pts[(i + 1) % pts.length];
                total += Math.hypot(b.x - a.x, b.y - a.y);
                cum.push(total);
            }
            return { cum: cum, total: total };
        }
        // Sample interpolated point at arc-length-fraction t ∈ [0,1].
        function sampleAtFraction(pts, cum, t) {
            if (cum.total === 0) return pts[0];
            const target = t * cum.total;
            for (let i = 0; i < pts.length; i++) {
                if (cum.cum[i + 1] >= target) {
                    const a = pts[i], b = pts[(i + 1) % pts.length];
                    const seg = cum.cum[i + 1] - cum.cum[i];
                    const st = seg > 0 ? (target - cum.cum[i]) / seg : 0;
                    return { x: a.x + (b.x - a.x) * st, y: a.y + (b.y - a.y) * st };
                }
            }
            return pts[pts.length - 1];
        }

        // PICKING toggle: large dots = easy to click; off = 30% size.
        const PICK_KEY = 'draw20-morph3d-picking';
        const pickingMode = false; // (function () {
            // try { return localStorage.getItem(PICK_KEY) === '1'; } catch (_) { return false; }
        // })();
        const pickCb = document.getElementById('pick-mode-cb');
        if (pickCb) {
            pickCb.checked = pickingMode;
            pickCb.addEventListener('change', function () {
                // try { localStorage.setItem(PICK_KEY, pickCb.checked ? '1' : '0'); } catch (_) {}
                try {
                    const b = window.opener && window.opener.document.getElementById('draw20-morph3d-btn');
                    if (b) b.click();
                } catch (_) {}
            });
        }
        const PICK_SPHERE_R = pickingMode ? 3.2 : 1.0;
        const pickSphereGeom = new THREE.SphereGeometry(PICK_SPHERE_R, 10, 10);

        // Per-match palette colors come from data.colorByMatchId (built upstream
        // via draw20PaletteColor). Same convention as 2D: both sides of a pair
        // share the colour. Orphans use red. Cache materials per colour.
        const ORPHAN_COLOR = 0xFF0000;
        const colorMap = data.colorByMatchId || {};
        const pickMatCache = {};
        function pickMatFor(matchId, isOrphan) {
            const key = isOrphan ? 'orph' : String(matchId);
            if (!pickMatCache[key]) {
                const col = isOrphan ? ORPHAN_COLOR
                    : (colorMap[matchId] || '#ff3344');
                pickMatCache[key] = new THREE.MeshBasicMaterial({ color: col });
            }
            return pickMatCache[key];
        }
        function colorForMatch(matchId, isOrphan) {
            if (isOrphan) return ORPHAN_COLOR;
            return colorMap[matchId] || 0x00d2ff;
        }

        // Correspondence-line visibility toggle (default OFF). Stored in
        // localStorage, applies to all per-pair link bundles built below.
        const LINES_KEY = 'draw20-morph3d-lines';
        const linesVisible = false; // (function () {
            // try { return localStorage.getItem(LINES_KEY) === '1'; } catch (_) { return false; }
        // })();
        const linkLineMeshes = [];
        const linesCb = document.getElementById('lines-mode-cb');
        if (linesCb) {
            linesCb.checked = linesVisible;
            linesCb.addEventListener('change', function () {
                // try { localStorage.setItem(LINES_KEY, linesCb.checked ? '1' : '0'); } catch (_) {}
                for (const m of linkLineMeshes) m.visible = linesCb.checked;
            });
        }
        function addOuterPoints(pts, z, plane, partnerPts, partnerZ, alignment, matchId, isOrphan) {
            if (!pts || !pts.length) return;
            const mat = pickMatFor(matchId, isOrphan);
            const ownCum = cumulativeLengths(pts);
            const partnerCum = partnerPts ? cumulativeLengths(partnerPts) : null;
            const baseData = {
                plane: plane,
                ownPts: pts,
                ownCum: ownCum,
                ownZ: z,
                partnerPts: partnerPts || null,
                partnerCum: partnerCum,
                partnerZ: partnerPts ? partnerZ : null,
                alignment: alignment || null,
            };
            for (let i = 0; i < pts.length; i++) {
                const m = new THREE.Mesh(pickSphereGeom, mat);
                m.position.set(pts[i].x, pts[i].y, z);
                m.userData = Object.assign({ vertIdx: i }, baseData);
                scene.add(m);
                pickablePoints.push(m);
            }
        }

        const matchedPngOuters = new Set();
        const matchedLatOuters = new Set();

        if (data.idToPair && data.pngId && data.latId) {
            function indexById(classification, idArr) {
                const map = new Map();
                for (let oi = 0; oi < classification.outers.length; oi++) {
                    const o = classification.outers[oi];
                    map.set(idArr[o.idx], oi);
                }
                return map;
            }
            const pngIdx = indexById(data.pClass, data.pngId);
            const latIdx = indexById(data.lClass, data.latId);

            // Quick lookup: outerId → alignment entry from the engine.
            const alignByOuterId = new Map();
            if (data.pairAlignments && data.pairAlignments.length) {
                for (const a of data.pairAlignments) alignByOuterId.set(a.outerId, a);
            }

            for (const entry of data.idToPair) {
                const id = entry[0], pair = entry[1];
                if (pair.png < 0 || pair.lat < 0) continue;
                const pi = pngIdx.get(id), li = latIdx.get(id);
                if (pi == null || li == null || !pngN[pi] || !latN[li]) continue;
                const align = alignByOuterId.get(id) || null;
                const matchCol = colorForMatch(id, false);
                // Outlines (outer + holes) in the per-match palette colour.
                addOutlineLoop(pngN[pi].pts, Z_PNG, matchCol);
                for (const h of (pngN[pi].holes || [])) addOutlineLoop(h, Z_PNG, matchCol);
                addOutlineLoop(latN[li].pts, Z_LAT, matchCol);
                for (const h of (latN[li].holes || [])) addOutlineLoop(h, Z_LAT, matchCol);
                // Pick spheres carry the match colour via pickMatFor.
                addOuterPoints(pngN[pi].pts, Z_PNG, 'png', latN[li].pts, Z_LAT,
                    align ? { dir: 'forward', N: align.N, idxMap: align.idxMap } : null,
                    id, false);
                addOuterPoints(latN[li].pts, Z_LAT, 'lat', pngN[pi].pts, Z_PNG,
                    align ? { dir: 'reverse', N: align.N, idxMap: align.idxMap } : null,
                    id, false);
                // Holes (paired by index).
                const pngHoles = pngN[pi].holes || [];
                const latHoles = latN[li].holes || [];
                const nHoles = Math.min(pngHoles.length, latHoles.length);
                for (let h = 0; h < nHoles; h++) {
                    addOuterPoints(pngHoles[h], Z_PNG, 'png', latHoles[h], Z_LAT, null, id, false);
                    addOuterPoints(latHoles[h], Z_LAT, 'lat', pngHoles[h], Z_PNG, null, id, false);
                }
                matchedPngOuters.add(pi);
                matchedLatOuters.add(li);
                // Correspondence net for this pair — original vertices, no
                // resampling. Per-pair LineSegments so each takes the match colour.
                const a = pngN[pi].pts;
                const b = latN[li].pts;
                const nLink = Math.min(a.length, b.length);
                if (nLink) {
                    const linkVerts = new Float32Array(nLink * 6);
                    for (let k = 0; k < nLink; k++) {
                        linkVerts[k * 6]     = a[k].x; linkVerts[k * 6 + 1] = a[k].y; linkVerts[k * 6 + 2] = Z_PNG;
                        linkVerts[k * 6 + 3] = b[k].x; linkVerts[k * 6 + 4] = b[k].y; linkVerts[k * 6 + 5] = Z_LAT;
                    }
                    const lg = new THREE.BufferGeometry();
                    lg.setAttribute('position', new THREE.BufferAttribute(linkVerts, 3));
                    const ls = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
                        color: matchCol, transparent: true, opacity: 0.45,
                    }));
                    ls.visible = linesVisible;
                    linkLineMeshes.push(ls);
                    scene.add(ls);
                }
            }
        }

        // Orphans — outline + pick spheres in orphan red, no partner.
        for (let i = 0; i < pngN.length; i++) {
            if (!matchedPngOuters.has(i)) {
                addOutlineLoop(pngN[i].pts, Z_PNG, ORPHAN_COLOR);
                for (const h of (pngN[i].holes || [])) addOutlineLoop(h, Z_PNG, ORPHAN_COLOR);
                addOuterPoints(pngN[i].pts, Z_PNG, 'png', null, null, null, -1, true);
                for (const h of pngN[i].holes || []) addOuterPoints(h, Z_PNG, 'png', null, null, null, -1, true);
            }
        }
        for (let i = 0; i < latN.length; i++) {
            if (!matchedLatOuters.has(i)) {
                addOutlineLoop(latN[i].pts, Z_LAT, ORPHAN_COLOR);
                for (const h of (latN[i].holes || [])) addOutlineLoop(h, Z_LAT, ORPHAN_COLOR);
                addOuterPoints(latN[i].pts, Z_LAT, 'lat', null, null, null, -1, true);
                for (const h of latN[i].holes || []) addOuterPoints(h, Z_LAT, 'lat', null, null, null, -1, true);
            }
        }

        // ── Picking: click → highlight clicked vertex + its partner ─────────
        const raycaster = new THREE.Raycaster();
        raycaster.params.Points.threshold = 6;
        const pointer = new THREE.Vector2();

        function clearHighlights() {
            while (highlightGroup.children.length) {
                const c = highlightGroup.children.pop();
                if (c.geometry) c.geometry.dispose();
                if (c.material) c.material.dispose();
            }
        }
        const HL_SPHERE_R = 2.4;   // small pick-marker spheres
        const HL_LINE_R = 0.9;     // matching slimmer cylinder
        const HL_COLOR = 0xff3344; // red — only the picked/matched line

        function addHighlightSphere(p, color) {
            const geom = new THREE.SphereGeometry(HL_SPHERE_R, 16, 16);
            const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
            const s = new THREE.Mesh(geom, mat);
            s.position.copy(p);
            highlightGroup.add(s);
        }
        // Cylinder-as-line to get a visibly thick line in focus — WebGL's
        // LineBasicMaterial.linewidth is ignored by most drivers.
        function addHighlightLine(a, b, color) {
            const dir = new THREE.Vector3().subVectors(b, a);
            const length = dir.length();
            if (length === 0) return;
            const geom = new THREE.CylinderGeometry(HL_LINE_R, HL_LINE_R, length, 12);
            const mat = new THREE.MeshBasicMaterial({ color: color });
            const cyl = new THREE.Mesh(geom, mat);
            cyl.position.copy(a).add(dir.clone().multiplyScalar(0.5));
            cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
            highlightGroup.add(cyl);
        }

        function highlightFromHit(obj, vertIdx) {
            clearHighlights();
            const ud = obj.userData;
            if (!ud || !ud.ownPts) return;
            const clicked = ud.ownPts[vertIdx];
            const pa = new THREE.Vector3(clicked.x, clicked.y, ud.ownZ);
            if (!ud.partnerPts) {
                addHighlightSphere(pa, 0xffffff);
                return;
            }

            // Map clicked-vertex → partner-point via the engine alignment.
            // 1. clicked vertex has arc-length fraction t_own along its outline.
            // 2. find resampled index i = round(t_own * N) — same parametrization
            //    morphHelpers.resampleClosed used → indexes are interchangeable.
            // 3. partner resampled index j:
            //      forward (PNG→LaTeX):  j = idxMap[i]
            //      reverse (LaTeX→PNG):  j = inverse_idxMap[i]
            // 4. partner fraction t_partner = j / N.
            // 5. sample partner outline at t_partner.
            // No alignment → fall back to arc-length identity.
            let tPartner;
            const t = ud.ownCum.total > 0 ? ud.ownCum.cum[vertIdx] / ud.ownCum.total : 0;
            if (ud.alignment && ud.alignment.idxMap && ud.alignment.N) {
                const N = ud.alignment.N;
                const idxMap = ud.alignment.idxMap;
                const i = ((Math.round(t * N) % N) + N) % N;
                let j;
                if (ud.alignment.dir === 'reverse') {
                    // Build inverse map on demand (cache it on the alignment).
                    if (!ud.alignment._inv) {
                        const inv = new Array(N).fill(0);
                        for (let k = 0; k < N; k++) {
                            const m = ((idxMap[k] % N) + N) % N;
                            inv[m] = k;
                        }
                        ud.alignment._inv = inv;
                    }
                    j = ud.alignment._inv[i];
                } else {
                    j = ((idxMap[i] % N) + N) % N;
                }
                tPartner = j / N;
            } else {
                tPartner = t; // fallback: arc-length identity
            }
            const partner = sampleAtFraction(ud.partnerPts, ud.partnerCum, tPartner);
            const pb = new THREE.Vector3(partner.x, partner.y, ud.partnerZ);
            addHighlightSphere(pa, HL_COLOR);
            addHighlightSphere(pb, HL_COLOR);
            addHighlightLine(pa, pb, HL_COLOR);
        }

        let dragMoved = false;
        renderer.domElement.addEventListener('pointerdown', () => { dragMoved = false; });
        renderer.domElement.addEventListener('pointermove', (e) => {
            if (e.buttons !== 0) dragMoved = true;
        });
        renderer.domElement.addEventListener('click', (e) => {
            if (dragMoved) return; // OrbitControls was rotating — ignore click
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, cam);
            const hits = raycaster.intersectObjects(pickablePoints, false);
            if (hits.length) {
                const obj = hits[0].object;
                // Mesh path: vertex index is on userData (one mesh per vertex).
                // Points fallback: hits[0].index from the BufferGeometry index.
                const idx = (obj.userData && obj.userData.vertIdx != null)
                    ? obj.userData.vertIdx
                    : hits[0].index;
                highlightFromHit(obj, idx);
            } else {
                clearHighlights();
            }
        });

        function loop() {
            requestAnimationFrame(loop);
            controls.update();
            renderer.render(scene, cam);
        }
        loop();

        window.addEventListener('resize', function () {
            cam.aspect = innerWidth / innerHeight;
            cam.updateProjectionMatrix();
            renderer.setSize(innerWidth, innerHeight);
        });

        // Toggle state for the 3 paired view buttons. Each click alternates
        // between the two members of its pair.
        const viewToggle = { 'top-bottom': 'top', 'left-right': 'left', 'front-back': 'front' };
        const viewPair = {
            'top-bottom':  ['top', 'bottom'],
            'left-right':  ['left', 'right'],
            'front-back':  ['front', 'back'],
        };
        document.querySelectorAll('.view-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const key = btn.dataset.toggle;
                const pair = viewPair[key];
                const next = (viewToggle[key] === pair[0]) ? pair[1] : pair[0];
                viewToggle[key] = next;
                setView(next);
            });
        });

        // Canonical-view shortcuts. Camera is placed 'd' units away from the
        // scene target on the chosen axis, looking back toward target.
        // Top/Bottom would be degenerate with world-up=(0,1,0) → add a tiny
        // tilt along Z so cam.up stays (0,1,0) consistently and OrbitControls
        // doesn't flip its internal "up" reference between views.
        function setView(name) {
            const t = TARGET_HOME;
            const d = 1100;
            const eps = 0.5; // small tilt to avoid up/view colinearity
            cam.up.set(0, 1, 0); // always world Y up — keeps orbit consistent
            switch (name) {
                case 'top':    cam.position.set(t.x, t.y + d, t.z + eps); break;
                case 'bottom': cam.position.set(t.x, t.y - d, t.z + eps); break;
                case 'front':  cam.position.set(t.x, t.y, t.z + d); break;
                case 'back':   cam.position.set(t.x, t.y, t.z - d); break;
                case 'left':   cam.position.set(t.x - d, t.y, t.z); break;
                case 'right':  cam.position.set(t.x + d, t.y, t.z); break;
            }
            controls.target.copy(t);
            controls.update();
        }

        document.addEventListener('keydown', function (e) {
            // Ignore if focus is in a text input (no inputs in this popup, but defensive).
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
            const k = e.key.toLowerCase();
            // Cmd+R / Ctrl+R → trigger our reload (browser reload would render
            // about:blank empty since this window was opened with empty URL).
            if ((e.metaKey || e.ctrlKey) && k === 'r') {
                e.preventDefault();
                try {
                    const b = window.opener && window.opener.document.getElementById('draw20-morph3d-btn');
                    if (b) b.click();
                } catch (_) {}
                return;
            }
            if (e.key === 'Escape') {
                cam.up.set(0, 1, 0);
                cam.position.copy(CAM_HOME);
                controls.target.copy(TARGET_HOME);
                controls.update();
                return;
            }
            // Canonical-view shortcuts — each key toggles its pair (same
            // behavior as the V⇄H / L⇄R / O⇄U buttons).
            function togglePair(pairKey) {
                const pair = viewPair[pairKey];
                const next = (viewToggle[pairKey] === pair[0]) ? pair[1] : pair[0];
                viewToggle[pairKey] = next;
                setView(next);
            }
            switch (k) {
                case 'o': case 'u': togglePair('top-bottom');  break;
                case 'v': case 'h': togglePair('front-back');  break;
                case 'r':           togglePair('left-right');  break;
                case 'l': {
                    // L toggles the correspondence-lines checkbox.
                    const cb = document.getElementById('lines-mode-cb');
                    if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); }
                    break;
                }
            }
        });
    }

    // Persist window geometry (size + position). Same-origin → shared
    // localStorage with the opener.
    function saveGeom() {
        try {
            localStorage.setItem('draw20-morph3d-geom', JSON.stringify({
                w: window.outerWidth,
                h: window.outerHeight,
                x: window.screenX,
                y: window.screenY,
            }));
        } catch (_) {}
    }
    window.addEventListener('resize', saveGeom);
    window.addEventListener('beforeunload', saveGeom);
    // No setInterval poll — it creates a feedback loop with window.open's
    // height feature: each reload would add Chrome's chrome height (~100px),
    // saveGeom captures the inflated value, next open uses it as the new base.
})();
</script>
</body></html>`;

    global.Morph3D = { createMorph3DButton, openMorph3D, refreshIfOpen };
})(window);
