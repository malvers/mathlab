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

    function openMorph3D(ringData) {
        // Pass data through the opener so the popup can read it.
        global.__morph3dData = ringData || null;

        // Restore the user's last window size/position (persisted via
        // beforeunload + poll in the popup itself).
        let geom = null;
        try { geom = JSON.parse(localStorage.getItem(GEOM_KEY) || 'null'); } catch (_) {}
        const defW = Math.min(1200, Math.round(window.screen.availWidth * 0.9));
        const defH = Math.min(900, Math.round(window.screen.availHeight * 0.9));
        const wsz = geom && geom.w > 200 ? geom.w : defW;
        const hsz = geom && geom.h > 200 ? geom.h : defH;
        const features = [`width=${wsz}`, `height=${hsz}`];
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
        return win;
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
    #hud { position: fixed; top: 12px; left: 12px; font-size: 11px; letter-spacing: 1.5px; opacity: 0.85; pointer-events: none; line-height: 1.5; }
    #empty { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; font-size: 1.1rem; letter-spacing: 0.1em; opacity: 0.7; }
    .row { display: flex; gap: 14px; align-items: center; }
    .swatch { display: inline-block; width: 12px; height: 12px; border-radius: 2px; vertical-align: middle; }
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
</head><body>
<div id="hud">
    <div class="row"><span class="swatch" style="background:#adff2f"></span>PNG · DRAWING</div>
    <div class="row"><span class="swatch" style="background:#F4C430"></span>LaTeX · TARGET</div>
    <div style="margin-top:8px;opacity:0.6">drag · orbit · wheel · zoom · ESC · close</div>
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
        const targetSize = 400;
        const pngScale = Math.max(pngBB.w, pngBB.h) > 0 ? targetSize / Math.max(pngBB.w, pngBB.h) : 1;
        const latScale = Math.max(latBB.w, latBB.h) > 0 ? targetSize / Math.max(latBB.w, latBB.h) : 1;
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
        cam.position.set(450, 250, 700);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(renderer.domElement);

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

        function addOuterPoints(pts, z, plane, partnerPts, partnerZ, alignment) {
            if (!pts || !pts.length) return;
            const verts = new Float32Array(pts.length * 3);
            for (let i = 0; i < pts.length; i++) {
                verts[i * 3] = pts[i].x; verts[i * 3 + 1] = pts[i].y; verts[i * 3 + 2] = z;
            }
            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
            const obj = new THREE.Points(geom, new THREE.PointsMaterial({
                color: 0xff3344, size: 7, sizeAttenuation: false,
            }));
            obj.userData = {
                plane: plane,
                ownPts: pts,
                ownCum: cumulativeLengths(pts),
                ownZ: z,
                partnerPts: partnerPts || null,
                partnerCum: partnerPts ? cumulativeLengths(partnerPts) : null,
                partnerZ: partnerPts ? partnerZ : null,
                // Engine alignment (computed by draw20-render.js openMorph3D).
                // 'forward' = use idxMap as-is (PNG → LaTeX direction).
                // 'reverse' = invert it (LaTeX → PNG direction).
                alignment: alignment || null,
            };
            scene.add(obj);
            pickablePoints.push(obj);
        }

        // Draw outlines for every outer (matched + orphan).
        for (const o of pngN) {
            addOutlineLoop(o.pts, Z_PNG, PNG_COLOR);
            for (const h of o.holes) addOutlineLoop(h, Z_PNG, PNG_COLOR);
        }
        for (const o of latN) {
            addOutlineLoop(o.pts, Z_LAT, LAT_COLOR);
            for (const h of o.holes) addOutlineLoop(h, Z_LAT, LAT_COLOR);
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

            const linkVerts = [];
            for (const entry of data.idToPair) {
                const id = entry[0], pair = entry[1];
                if (pair.png < 0 || pair.lat < 0) continue;
                const pi = pngIdx.get(id), li = latIdx.get(id);
                if (pi == null || li == null || !pngN[pi] || !latN[li]) continue;
                const align = alignByOuterId.get(id) || null;
                // PNG vertex picking: forward — src → dst via idxMap.
                addOuterPoints(pngN[pi].pts, Z_PNG, 'png', latN[li].pts, Z_LAT,
                    align ? { dir: 'forward', N: align.N, idxMap: align.idxMap } : null);
                // LaTeX vertex picking: reverse — dst → src by inverting idxMap.
                addOuterPoints(latN[li].pts, Z_LAT, 'lat', pngN[pi].pts, Z_PNG,
                    align ? { dir: 'reverse', N: align.N, idxMap: align.idxMap } : null);
                matchedPngOuters.add(pi);
                matchedLatOuters.add(li);
                // Visual correspondence net: same 80-sample line bundle as before.
                const a = resample(pngN[pi].pts, SAMPLES);
                const b = resample(latN[li].pts, SAMPLES);
                for (let k = 0; k < SAMPLES; k++) {
                    linkVerts.push(a[k].x, a[k].y, Z_PNG);
                    linkVerts.push(b[k].x, b[k].y, Z_LAT);
                }
            }
            if (linkVerts.length) {
                const lg = new THREE.BufferGeometry();
                lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linkVerts), 3));
                scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
                    color: LINK_COLOR, transparent: true, opacity: 0.45,
                })));
            }
        }

        // Orphan outers — still pickable but no partner.
        for (let i = 0; i < pngN.length; i++) {
            if (!matchedPngOuters.has(i)) addOuterPoints(pngN[i].pts, Z_PNG, 'png', null, null);
        }
        for (let i = 0; i < latN.length; i++) {
            if (!matchedLatOuters.has(i)) addOuterPoints(latN[i].pts, Z_LAT, 'lat', null, null);
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
        const HL_SPHERE_R = 4;     // smaller pick-marker spheres
        const HL_LINE_R = 1.6;     // cylinder radius — fakes a thick "in-focus" line
        const HL_COLOR = 0xff9020; // orange

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
                highlightFromHit(hits[0].object, hits[0].index);
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

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') window.close();
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
    setInterval(saveGeom, 1500);
})();
</script>
</body></html>`;

    global.Morph3D = { createMorph3DButton, openMorph3D };
})(window);
