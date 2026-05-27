// worldclock-sky.js — the planetarium / star-dome subsystem (Phase 4 refactor).
// Sky DATA + loaders, the hover/zoom/tooltip interaction, and drawStarfield itself.
// Loaded AFTER worldclock.js (its scalar sky STATE — skyT/skyTarget/skyZoom/show*/hovered* — stays there)
// and BEFORE worldclock-menus.js. Reads/writes those globals + ctx/canvas/getDisplayTime/siderealTimeDeg
// /CONSTELLATION_LINES/planetPositions/drawMoonImg at runtime (classic scripts share the global scope).
// Behaviour unchanged — pure move.

// ===== Sky data + loaders =====
        // Fixed centroid (RA/Dec) per constellation — a stable label anchor that pans smoothly (no jump as
        // individual stars cross the horizon). Averaged as 3D unit vectors so RA wraparound is handled.
        const CON_CENTROIDS = (() => {
            const m = {};
            if (typeof CONSTELLATION_LINES !== 'undefined') {
                const D = Math.PI / 180;
                for (const con of CONSTELLATION_LINES) {
                    let x = 0, y = 0, z = 0, n = 0;
                    for (const path of con.paths) {
                        for (let i = 0; i < path.length; i += 2) {
                            const ra = path[i] * D, dec = path[i + 1] * D;
                            x += Math.cos(dec) * Math.cos(ra); y += Math.cos(dec) * Math.sin(ra); z += Math.sin(dec); n++;
                        }
                    }
                    if (n) m[con.id] = [(Math.atan2(y, x) * 180 / Math.PI + 360) % 360, Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI];
                }
            }
            return m;
        })();
        // Ecliptic sample points (RA/Dec, deg) — the Sun/Moon/planet highway; projected each frame as a faint arc.
        const ECLIPTIC_PTS = (() => {
            const ecl = 23.4393 * Math.PI / 180, pts = [];
            for (let L = 0; L <= 360; L += 3) {
                const lr = L * Math.PI / 180, x = Math.cos(lr), y = Math.sin(lr) * Math.cos(ecl), z = Math.sin(lr) * Math.sin(ecl);
                pts.push([((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360, Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI]);
            }
            return pts;
        })();
        // Zodiac signs: symbol (♈…♓) at the centre of each 30° ecliptic segment (RA/Dec on the ecliptic).
        const ZODIAC = (() => {
            const ecl = 23.4393 * Math.PI / 180, out = [];
            const nm = ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'];
            for (let i = 0; i < 12; i++) {
                const L = (i * 30 + 15) * Math.PI / 180, x = Math.cos(L), y = Math.sin(L) * Math.cos(ecl), z = Math.sin(L) * Math.sin(ecl);
                out.push({ sym: String.fromCodePoint(0x2648 + i), name: nm[i], ra: ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360, dec: Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI });
            }
            return out;
        })();
        // Bright deep-sky objects (Messier): RA/Dec in degrees, German name + type, base glow radius (px) and tint.
        // type → colour: galaxy=soft white, emission=pink/red, open cluster=blue-white, globular=warm white, planetary=teal.
        const DEEPSKY = [
            { id: 'M31', ra: 10.68,  dec: 41.27,  name: 'Andromedanebel',   type: 'Galaxie',              rad: 17, r: 205, g: 213, b: 238, img: 'Andromeda_Galaxy_(with_h-alpha).jpg' },
            { id: 'M42', ra: 83.82,  dec: -5.39,  name: 'Orionnebel',       type: 'Emissionsnebel',       rad: 14, r: 255, g: 120, b: 140, img: 'Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg' },
            { id: 'M45', ra: 56.75,  dec: 24.12,  name: 'Plejaden',         type: 'Offener Sternhaufen',  rad: 13, r: 175, g: 205, b: 255, img: 'Pleiades_large.jpg' },
            { id: 'M44', ra: 130.05, dec: 19.67,  name: 'Praesepe',         type: 'Offener Sternhaufen',  rad: 12, r: 175, g: 205, b: 255 },
            { id: 'M13', ra: 250.42, dec: 36.46,  name: 'Herkuleshaufen',   type: 'Kugelsternhaufen',     rad: 10, r: 255, g: 240, b: 210 },
            { id: 'M8',  ra: 270.92, dec: -24.38, name: 'Lagunennebel',     type: 'Emissionsnebel',       rad: 12, r: 255, g: 130, b: 150, img: 'Lagoon_Nebula_(ESO).jpg' },
            { id: 'M27', ra: 299.90, dec: 22.72,  name: 'Hantelnebel',      type: 'Planetarischer Nebel', rad: 8,  r: 120, g: 230, b: 210, img: 'M27_-_Dumbbell_Nebula.jpg' },
            { id: 'M57', ra: 283.40, dec: 33.03,  name: 'Ringnebel',        type: 'Planetarischer Nebel', rad: 7,  r: 120, g: 230, b: 210, img: 'M57_The_Ring_Nebula.JPG' },
            { id: 'M51', ra: 202.47, dec: 47.20,  name: 'Whirlpool-Galaxie',type: 'Galaxie',              rad: 9,  r: 205, g: 213, b: 238, img: 'M51_Hubble_Remix.jpg' },
            { id: 'M81', ra: 148.89, dec: 69.07,  name: 'Bodes Galaxie',    type: 'Galaxie',              rad: 9,  r: 205, g: 213, b: 238, img: 'M81.jpg' },
            { id: 'M104',ra: 189.99, dec: -11.62, name: 'Sombrero-Galaxie', type: 'Galaxie',              rad: 8,  r: 205, g: 213, b: 238, img: 'M104_ngc4594_sombrero_galaxy_hi-res.jpg' },
            { id: 'h+χ', ra: 34.70,  dec: 57.10,  name: 'Doppelhaufen Perseus', type: 'Offener Sternhaufen', rad: 11, r: 175, g: 205, b: 255 }
        ];
        let dsoPhotos = true;   // true = real photos (additive, soft-masked); false = stylised glow only. Toggle: key 'b'
        // Load each photo once, pre-mask it to a soft round vignette (so no hard rectangle edge), store on the entry.
        function loadNebulaImages() {
            const _withImg = DEEPSKY.filter(d => d.img).length;
            try { DebugWindow.log('[deepsky] starte Foto-Laden: ' + _withImg + ' Bilder'); } catch (_) {}
            for (const d of DEEPSKY) {
                if (!d.img) continue;
                const im = new Image();
                im.onload = () => {
                    try {
                        const S = 256, cv = document.createElement('canvas'); cv.width = S; cv.height = S;
                        const cc = cv.getContext('2d');
                        cc.drawImage(im, 0, 0, S, S);
                        cc.globalCompositeOperation = 'destination-in';   // feather the edges into transparency → round nebula
                        const g = cc.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
                        g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.62, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
                        cc.fillStyle = g; cc.fillRect(0, 0, S, S);
                        d._masked = cv;
                        try { DebugWindow.log('[deepsky] Foto geladen: ' + d.id); } catch (_) {}
                    } catch (err) {
                        try { DebugWindow.log('[deepsky] Maskier-Fehler ' + d.id + ': ' + err); } catch (_) {}
                    }
                };
                im.onerror = () => { try { DebugWindow.log('[deepsky] Foto FEHLT: ' + d.id + ' → ' + im.src); } catch (_) {} };
                im.src = '../resources/nebulas/' + d.img;            // HTML/ is the server root locally and live
            }
        }
        setTimeout(loadNebulaImages, 0);   // defer so DebugWindow exists when we log
        let STAR_FIELD = null;      // full colour star catalog (loaded async from starcatalog.json); null → figure-vertex fallback
        (function loadStarCatalog() {
            fetch('starcatalog.json').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(data => {
                // B-V colour index → approximate star RGB (blue → white → yellow → orange → red).
                const anc = [[-0.4, 155, 176, 255], [0.0, 200, 213, 255], [0.3, 248, 247, 255], [0.6, 255, 244, 232], [1.0, 255, 213, 160], [1.5, 255, 182, 132], [2.0, 255, 160, 120]];
                const bvToRgb = (bv) => {
                    if (bv <= anc[0][0]) return [anc[0][1], anc[0][2], anc[0][3]];
                    for (let i = 1; i < anc.length; i++) {
                        if (bv <= anc[i][0]) {
                            const a0 = anc[i - 1], b0 = anc[i], t = (bv - a0[0]) / (b0[0] - a0[0]);
                            return [a0[1] + (b0[1] - a0[1]) * t, a0[2] + (b0[2] - a0[2]) * t, a0[3] + (b0[3] - a0[3]) * t];
                        }
                    }
                    const L = anc[anc.length - 1]; return [L[1], L[2], L[3]];
                };
                const out = [];
                for (const f of (data.features || [])) {
                    const c = f.geometry && f.geometry.coordinates;
                    if (!c) continue;
                    const p = f.properties || {};
                    const mag = (typeof p.mag === 'number') ? p.mag : parseFloat(p.mag);
                    if (!isFinite(mag)) continue;
                    const bv = parseFloat(p.bv);
                    const rgb = bvToRgb(isFinite(bv) ? bv : 0.6);
                    out.push({
                        id: f.id, ra: c[0], dec: c[1], mag: mag, bv: (isFinite(bv) ? bv : 0.6),
                        r: Math.round(rgb[0]), g: Math.round(rgb[1]), b: Math.round(rgb[2]),
                        size: Math.max(0.5, 2.6 - 0.34 * mag),   // brighter (lower mag) → bigger
                        af: Math.max(0.35, 1 - mag * 0.10),       // brighter → more opaque
                        tw: Math.random() * 6.283                 // random twinkle phase (so stars don't flicker in sync)
                    });
                }
                STAR_FIELD = out;
                try { DebugWindow.log('[stars] catalog: ' + out.length + ' stars'); } catch (_) {}
            }).catch(err => { try { DebugWindow.log('[stars] catalog load failed: ' + err); } catch (_) {} });
        })();
        // Optional star-name table (HIP → {name, bayer, desig, c}) for the click tooltip.
        fetch('starnames.json').then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(d => { window.STAR_NAMES = d; try { DebugWindow.log('[stars] names loaded'); } catch (_) {} })
            .catch(() => {});
        // Milky Way (mw.json): contour vertices jittered into a haze, grouped by brightness level so each
        // level draws in ONE batched fill (no per-point fill/shadow → smooth). Points project individually → wrap-safe.
        let MW_LEVELS = null, mwCount = 0;
        fetch('mw.json').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
            const fs = (d.features || []).slice().sort((p, q) => String(p.id).localeCompare(String(q.id)));   // ol1 … ol5
            const al = [0.20, 0.25, 0.30, 0.35, 0.40];   // per-level brightness
            const levels = [];
            fs.forEach((f, li) => {
                const verts = [];                                     // collect every coordinate pair, whatever the nesting depth
                (function rec(node) { if (typeof node[0] === 'number') verts.push(node); else for (const c of node) rec(c); })(f.geometry.coordinates);
                const pts = [];
                for (let i = 0; i < verts.length; i += 2) {          // jitter each contour vertex into a random haze
                    pts.push([verts[i][0] + (Math.random() - 0.5) * 4, verts[i][1] + (Math.random() - 0.5) * 4]);
                }
                levels.push({ alpha: al[Math.min(li, al.length - 1)], pts });
            });
            MW_LEVELS = levels;
            mwCount = levels.reduce((s, l) => s + l.pts.length, 0);
            try { DebugWindow.log('[stars] milky way levels: ' + levels.length + ', points: ' + mwCount); } catch (_) {}
        }).catch(() => {});

// ===== Sky interaction (hover, zoom, tooltips) =====
        // --- Constellation hover: track the pointer in canvas px so drawStarfield can highlight what's under it ---
        function setStarHover(clientX, clientY) {
            const rect = canvas.getBoundingClientRect();
            starHover.x = clientX - rect.left;
            starHover.y = clientY - rect.top;
            starHover.on = true;
        }
        canvas.addEventListener('mousemove', (e) => setStarHover(e.clientX, e.clientY));
        canvas.addEventListener('mouseleave', () => { starHover.on = false; });
        canvas.addEventListener('touchstart', (e) => { if (e.touches.length) setStarHover(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
        canvas.addEventListener('touchmove',  (e) => { if (e.touches.length === 1) setStarHover(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

        // --- Planetarium zoom: mouse wheel + two-finger pinch (only while the planetarium is active) ---
        canvas.addEventListener('wheel', (e) => {
            if (!skyTarget) return;                                  // outside planetarium: leave the wheel alone
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const C0x = rect.width / 2, C0y = rect.height / 2;       // unzoomed dome centre (canvas px)
            // Shift = zoom about the window centre; otherwise zoom toward the cursor.
            const mx = e.shiftKey ? C0x : (e.clientX - rect.left);
            const my = e.shiftKey ? C0y : (e.clientY - rect.top);
            const z0 = skyZoom;
            const z1 = Math.max(0.4, Math.min(12, z0 * Math.exp(-e.deltaY * 0.0015)));  // scroll up = zoom in
            // Keep the chosen anchor (cursor or centre) fixed while zooming.
            skyPanX = (mx - C0x) - (z1 / z0) * (mx - C0x - skyPanX);
            skyPanY = (my - C0y) - (z1 / z0) * (my - C0y - skyPanY);
            skyZoom = z1;
        }, { passive: false });
        let pinchDist0 = 0, pinchZoom0 = 1;
        const pinchSpan = (e) => Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                                            e.touches[0].clientY - e.touches[1].clientY);
        canvas.addEventListener('touchstart', (e) => {
            if (skyTarget && !window.useGlobe && e.touches.length === 2) { pinchDist0 = pinchSpan(e) || 1; pinchZoom0 = skyZoom; }
        }, { passive: true });
        canvas.addEventListener('touchmove', (e) => {
            if (skyTarget && !window.useGlobe && e.touches.length === 2 && pinchDist0) {
                skyZoom = Math.max(0.4, Math.min(12, pinchZoom0 * (pinchSpan(e) / pinchDist0)));
                e.preventDefault();
            }
        }, { passive: false });

        // --- Click/tap a star → identify it (planetarium only). Screen positions are cached during render (s._x/_y/_vis). ---
        // Render a number as fixed-width digit boxes (Orbitron isn't tabular → plain text jitters). Rebuilds only on change.
        function setSkyDigits(el, n) {
            if (!el) return;
            const s = String(n);
            if (el._v === s) return;
            el._v = s;
            el.innerHTML = s.replace(/./g, c => '<span class="scd">' + c + '</span>');
        }
        function bvSpectral(bv) {
            if (bv < -0.05) return 'blau (B)';
            if (bv < 0.20)  return 'blau-weiß (A)';
            if (bv < 0.45)  return 'weiß (F)';
            if (bv < 0.75)  return 'gelb (G)';
            if (bv < 1.35)  return 'orange (K)';
            return 'rot (M)';
        }
        function showInfoBox(name, sub, clientX, clientY) {   // shared tooltip renderer (stars + zodiac)
            const box = document.getElementById('star-info');
            if (!box) return;
            if (!name) { box.style.display = 'none'; return; }
            const nEl = document.getElementById('star-info-name');
            const sEl = document.getElementById('star-info-sub');
            if (nEl) nEl.textContent = name;
            if (sEl) sEl.textContent = sub || '';
            box.style.left = Math.min(window.innerWidth - 170, clientX + 12) + 'px';
            box.style.top = Math.max(8, clientY - 8) + 'px';
            box.style.display = 'block';
        }
        function showStarInfo(star, clientX, clientY) {
            hoveredStar = star;   // drives the on-canvas highlight ring
            if (!star) { showInfoBox(null); return; }
            const info = window.STAR_NAMES && window.STAR_NAMES[star.id];
            let label = 'HIP ' + star.id, conName = '';
            if (info) {
                if (info.name) label = info.name;                                  // proper name (e.g. Wega)
                else if (info.desig) label = info.desig + (info.c ? ' ' + info.c : '');  // else Bayer/Flamsteed (e.g. τ Phe)
                if (info.c) conName = (typeof CONSTELLATION_NAMES_DE !== 'undefined' && CONSTELLATION_NAMES_DE[info.c]) || info.c;
            }
            showInfoBox(label, 'Mag ' + star.mag.toFixed(2) + ' · ' + bvSpectral(star.bv) + (conName ? ' · ' + conName : ''), clientX, clientY);
        }
        function starAt(clientX, clientY) {       // nearest visible catalog star within ~16 px, else null
            if (!STAR_FIELD) return null;
            const rect = canvas.getBoundingClientRect();
            const px = clientX - rect.left, py = clientY - rect.top;
            let best = null, bd = 16 * 16;
            for (const s of STAR_FIELD) {
                if (!s._vis) continue;
                const dx = s._x - px, dy = s._y - py, d = dx * dx + dy * dy;
                if (d < bd) { bd = d; best = s; }
            }
            return best;
        }
        function zodiacAt(clientX, clientY) {     // nearest visible zodiac glyph within ~15 px, else null
            const rect = canvas.getBoundingClientRect();
            const px = clientX - rect.left, py = clientY - rect.top;
            let best = null, bd = 15 * 15;
            for (const z of ZODIAC) {
                if (!z._vis) continue;
                const dx = z._x - px, dy = z._y - py, d = dx * dx + dy * dy;
                if (d < bd) { bd = d; best = z; }
            }
            return best;
        }
        function deepskyAt(clientX, clientY) {    // nearest visible deep-sky object (within its glow radius + a little)
            const rect = canvas.getBoundingClientRect();
            const px = clientX - rect.left, py = clientY - rect.top;
            let best = null, bd = Infinity;
            for (const d of DEEPSKY) {
                if (!d._vis) continue;
                const dx = d._x - px, dy = d._y - py, dd = dx * dx + dy * dy;
                const drawn = (dsoPhotos && d._masked ? d.rad * 2.4 : d.rad * 1.5) * skyZoom;  // match the rendered size
                const hit = drawn + 6;             // plus a small margin so the edge is grabbable
                if (dd < hit * hit && dd < bd) { bd = dd; best = d; }
            }
            return best;
        }
        function hoverPick(clientX, clientY) {    // priority: zodiac → deep-sky → star/constellation
            const zod = zodiacAt(clientX, clientY);
            if (zod) {
                hoveredZodiac = zod; hoveredDeepsky = null; hoveredStar = null;
                showInfoBox(zod.sym + ' ' + zod.name, 'Tierkreiszeichen', clientX, clientY);
                return;
            }
            const ds = deepskyAt(clientX, clientY);
            if (ds) {
                hoveredDeepsky = ds; hoveredZodiac = null; hoveredStar = null;
                showInfoBox(ds.id + ' · ' + ds.name, ds.type, clientX, clientY);
                return;
            }
            hoveredZodiac = null; hoveredDeepsky = null;
            showStarInfo(starAt(clientX, clientY), clientX, clientY);
        }
        let _spDown = null;   // pointer-down position; cleared once it turns into a drag
        canvas.addEventListener('pointerdown', (e) => { _spDown = { x: e.clientX, y: e.clientY }; });
        canvas.addEventListener('pointermove', (e) => {
            if (_spDown && (Math.abs(e.clientX - _spDown.x) > 5 || Math.abs(e.clientY - _spDown.y) > 5)) _spDown = null;
            if (e.buttons === 0 && skyTarget) hoverPick(e.clientX, e.clientY);  // mouse hover → live tooltip
        });
        canvas.addEventListener('pointerup', (e) => {
            if (!_spDown) return;                 // it was a drag (rotation), not a click/tap
            _spDown = null;
            if (skyTarget) hoverPick(e.clientX, e.clientY);
        });
        canvas.addEventListener('pointerleave', () => { showStarInfo(null); hoveredZodiac = null; hoveredDeepsky = null; });
        document.getElementById('sky-play')?.addEventListener('click', () => toggleLapse());

// ===== segDist + drawStarfield =====
        function segDist(px, py, ax, ay, bx, by) {
            const dx = bx - ax, dy = by - ay;
            const l2 = dx * dx + dy * dy;
            let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
            t = t < 0 ? 0 : (t > 1 ? 1 : t);
            return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        }

        // Draw the Moon at (x,y) radius r with its phase: dark disc + lit lune; the bright limb faces `brightAngle`.
        // Real Moon texture (moon.png) with the phase: dim full disc (earthshine) + bright texture clipped to the lit lune.
        // drawMoonImg + drawMoonPhase → worldclock-moon.js (Phase 2 refactor).

        function drawStarfield(w, h, cx, cy) {
            if (typeof CONSTELLATION_LINES === 'undefined' || typeof siderealTimeDeg !== 'function') return;
            if (window.useGlobe) return;                             // globe mode: canvas sits over the 3D globe → skip for now
            cx += skyPanX; cy += skyPanY;                            // shift the whole dome so zoom homes in on the cursor (ESC resets)
            const D2R = Math.PI / 180;
            const a = 0.35 + 0.65 * skyT;                            // dim behind the clock; full in sky mode
            const lst = siderealTimeDeg(getDisplayTime(), skyLon);   // skyLon eases toward the selected city → smooth pan
            const dome = skyView >= 0.5;
            const Rdome = Math.max(w, h) * 0.62 * skyZoom;           // horizon radius (× zoom) — large enough that the horizon ring sits past the window corners → sky fills the whole window

            let proj;                                                // (ra,dec) → [x, y, visible]
            if (dome) {
                const lat = skyLat * D2R;                            // eases toward the city's latitude → dome tilts
                proj = (ra, dec) => {
                    const H = (lst - ra) * D2R, d = dec * D2R;
                    const sinAlt = Math.sin(lat) * Math.sin(d) + Math.cos(lat) * Math.cos(d) * Math.cos(H);
                    const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
                    const azN = Math.atan2(-Math.cos(d) * Math.sin(H),
                                           Math.sin(d) * Math.cos(lat) - Math.cos(d) * Math.sin(lat) * Math.cos(H)); // 0=N, +=E
                    const rr = (Math.PI / 2 - alt) / (Math.PI / 2) * Rdome;  // zenith→0, horizon→Rdome
                    return [cx - rr * Math.sin(azN), cy - rr * Math.cos(azN), alt > 0];  // N up, E left (sign tunable)
                };
            } else {
                const north = !CW;                                   // CCW → north celestial pole; CW → south
                const Req = Math.max(w, h) * 0.62 * skyZoom;
                proj = (ra, dec) => {
                    const colat = north ? (90 - dec) : (90 + dec);
                    const rr = (colat / 90) * Req;
                    const ang = dirSign * (ra - lst) * D2R - Math.PI / 2;
                    return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang), true];
                };
            }

            ctx.save();
            ctx.globalAlpha = 1;                                     // stars unaffected by the clock fade
            ctx.lineJoin = "round";
            ctx.lineWidth = 1;

            // Which constellation is under the pointer? (planetarium mode only) → highlight it red.
            let hoverId = null;
            if (skyTarget && starHover.on && !hoveredZodiac) {
                let best = Infinity;
                for (const con of CONSTELLATION_LINES) {
                    for (const path of con.paths) {
                        let prev = null;
                        for (let i = 0; i < path.length; i += 2) {
                            const p = proj(path[i], path[i + 1]);
                            if (prev && prev[2] && p[2]) {
                                const d = segDist(starHover.x, starHover.y, prev[0], prev[1], p[0], p[1]);
                                if (d < best) { best = d; hoverId = con.id; }
                            }
                            prev = p;
                        }
                    }
                }
                if (best > 22) hoverId = null;                       // only when the pointer is actually near a figure
            }
            const HL = `rgba(176, 36, 24, ${Math.max(a, 0.9)})`;     // Υ red highlight (project palette)

            // Milky Way band — faint filled glow, drawn first (backmost), clipped to the horizon; levels stack into a core gradient.
            if (MW_LEVELS) {                                         // Milky Way haze — one batched fill per level (cheap, smooth)
                for (const lvl of MW_LEVELS) {
                    ctx.fillStyle = `rgba(185, 205, 240, ${lvl.alpha * a})`;
                    ctx.beginPath();
                    for (const p of lvl.pts) {
                        const q = proj(p[0], p[1]);
                        if (!q[2]) continue;
                        ctx.rect(q[0] - 0.6, q[1] - 0.6, 1.3, 1.3);   // tiny square — batches far better than per-point arc
                    }
                    ctx.fill();
                }
            }

            // Deep-sky objects (Messier nebulae/clusters/galaxies) — soft radial glow, tinted by type; names in planetarium.
            let _dsVis = 0;
            const _dsCore = 0.9;                                     // bright, additive — clearly visible in both modes
            if (!showDeepsky) { for (const d of DEEPSKY) d._vis = false; }   // hidden → not drawn, not hoverable
            else for (const d of DEEPSKY) {
                const q = proj(d.ra, d.dec);
                d._x = q[0]; d._y = q[1]; d._vis = q[2];             // cache for hover hit-testing
                if (!q[2]) continue;
                _dsVis++;
                const rad = d.rad * 1.5 * skyZoom;
                // Fade in/out over the last ~6 % toward the horizon (no popping as it rises/sets).
                const _hf = dome ? Math.max(0, Math.min(1, (Rdome - Math.hypot(q[0] - cx, q[1] - cy)) / (Rdome * 0.06))) : 1;
                const dc = _dsCore * _hf;
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';            // additive → photo/glow shines out; black photo background adds nothing
                if (dsoPhotos && d._masked) {                        // real photo, pre-masked to a soft round vignette
                    const R = d.rad * 2.4 * skyZoom;
                    ctx.globalAlpha = (0.5 + 0.5 * skyT) * _hf;      // dim behind the clock, full in the planetarium
                    ctx.drawImage(d._masked, q[0] - R, q[1] - R, 2 * R, 2 * R);
                } else {                                             // stylised fallback: two stacked additive halos
                    const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], rad);
                    g.addColorStop(0, `rgba(${d.r}, ${d.g}, ${d.b}, ${dc})`);
                    g.addColorStop(0.5, `rgba(${d.r}, ${d.g}, ${d.b}, ${dc * 0.45})`);
                    g.addColorStop(1, `rgba(${d.r}, ${d.g}, ${d.b}, 0)`);
                    ctx.fillStyle = g;
                    ctx.beginPath(); ctx.arc(q[0], q[1], rad, 0, Math.PI * 2); ctx.fill();
                    const g2 = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], rad * 0.45);
                    g2.addColorStop(0, `rgba(${d.r}, ${d.g}, ${d.b}, ${dc})`);
                    g2.addColorStop(1, `rgba(${d.r}, ${d.g}, ${d.b}, 0)`);
                    ctx.fillStyle = g2;
                    ctx.beginPath(); ctx.arc(q[0], q[1], rad * 0.45, 0, Math.PI * 2); ctx.fill();
                }
                ctx.restore();
                if (skyTarget) {                                     // tiny catalog label only in the planetarium
                    const lblR = (dsoPhotos && d._masked) ? d.rad * 2.4 * skyZoom : rad;   // sit just below the drawn object
                    ctx.fillStyle = `rgba(${d.r}, ${d.g}, ${d.b}, ${a * 0.9})`;
                    ctx.font = '10px Orbitron, sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    ctx.fillText(d.id, q[0], q[1] + lblR + 2);
                }
            }
            if (_dsVis !== _dsLastLog) { _dsLastLog = _dsVis; try { DebugWindow.log('[deepsky] ' + _dsVis + '/' + DEEPSKY.length + ' über Horizont'); } catch (_) {} }

            if (dome) {                                              // horizon circle (the "HORIZONT" label is drawn last → always on top)
                ctx.strokeStyle = `rgba(120, 160, 220, ${a * 0.45})`;
                ctx.beginPath(); ctx.arc(cx, cy, Rdome, 0, Math.PI * 2); ctx.stroke();
            }
            // Constellation lines — batched into ONE path per colour (one stroke instead of thousands) → much cheaper.
            if (showConstLines) {
                ctx.strokeStyle = `rgba(120, 160, 220, ${a * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                for (const con of CONSTELLATION_LINES) {
                    if (con.id === hoverId) continue;                    // hovered one drawn separately (red, thicker)
                    for (const path of con.paths) {
                        let prev = null;
                        for (let i = 0; i < path.length; i += 2) {
                            const p = proj(path[i], path[i + 1]);
                            if (prev && prev[2] && p[2]) { ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); }
                            prev = p;
                        }
                    }
                }
                ctx.stroke();
                if (hoverId) {                                           // hovered constellation in red, one stroke
                    const _hcon = CONSTELLATION_LINES.find(c => c.id === hoverId);
                    if (_hcon) {
                        ctx.strokeStyle = HL; ctx.lineWidth = 1.8;
                        ctx.beginPath();
                        for (const path of _hcon.paths) {
                            let prev = null;
                            for (let i = 0; i < path.length; i += 2) {
                                const p = proj(path[i], path[i + 1]);
                                if (prev && prev[2] && p[2]) { ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); }
                                prev = p;
                            }
                        }
                        ctx.stroke();
                    }
                }
            }
            ctx.lineWidth = 1;
            // Figure stars (path vertices) → offscreen trail layer that fades toward transparent instead of
            // clearing → long-exposure star trails. Slow fade while turning (trails build up), fast when idle.
            const _moving = isMouseDown || isReturning;
            // Drag → low fade (long trails). Release → ease the fade back up to 1 so trails dissolve softly instead of
            // vanishing in one frame; once settled at ~1 it is a full clear again (crisp twinkle, no smearing).
            const _fadeTarget = _moving ? 0.02 : 1;
            _trailFadeEased += (_fadeTarget - _trailFadeEased) * (_moving ? 0.4 : 0.06);
            const _trailFade = _trailFadeEased;
            trailCtx.save();
            trailCtx.globalCompositeOperation = 'destination-out';   // erase a bit of alpha everywhere → existing trails fade out
            trailCtx.fillStyle = `rgba(0, 0, 0, ${_trailFade})`;
            trailCtx.fillRect(0, 0, w, h);
            trailCtx.globalCompositeOperation = 'source-over';
            if (STAR_FIELD) {                                        // full catalog: real colours (B-V) + size by magnitude
                let _vs = 0;
                const _tnow = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
                for (const s of STAR_FIELD) {
                    const p = proj(s.ra, s.dec);
                    s._x = p[0]; s._y = p[1]; s._vis = p[2];   // cache screen pos for click hit-testing
                    if (!p[2]) continue;
                    _vs++;
                    // Twinkle (atmospheric scintillation): present everywhere, stronger toward the horizon.
                    const rf = dome ? Math.hypot(p[0] - cx, p[1] - cy) / Rdome : 0.4;   // 0 = zenith, 1 = horizon
                    const amp = 0.3 + 0.5 * rf;                                       // 0.3 high up … 0.8 at the horizon
                    const fl = 0.6 * Math.sin(_tnow * 1.8 + s.tw) + 0.4 * Math.sin(_tnow * 2.9 + s.tw * 1.7);
                    const bf = 1 - amp * (0.5 - 0.5 * fl);                            // dips brightness in [1-amp, 1]
                    const hf = dome ? Math.max(0, Math.min(1, (1 - rf) / 0.06)) : 1;  // fade in/out at the horizon (no popping)
                    trailCtx.fillStyle = `rgba(${s.r}, ${s.g}, ${s.b}, ${a * s.af * bf * hf})`;
                    trailCtx.beginPath(); trailCtx.arc(p[0], p[1], s.size * (0.85 + 0.3 * bf), 0, Math.PI * 2); trailCtx.fill();
                }
                visStarCount = _vs;
            } else {                                                 // fallback until the catalog loads: plain figure-vertex dots
                trailCtx.fillStyle = `rgba(235, 242, 255, ${a})`;
                for (const con of CONSTELLATION_LINES) {
                    for (const path of con.paths) {
                        for (let i = 0; i < path.length; i += 2) {
                            const p = proj(path[i], path[i + 1]);
                            if (!p[2]) continue;
                            trailCtx.beginPath(); trailCtx.arc(p[0], p[1], 0.9, 0, Math.PI * 2); trailCtx.fill();
                        }
                    }
                }
            }
            // Hover highlight: the hovered constellation's figure stars in bright white
            if (hoverId) {
                const _hc = CONSTELLATION_LINES.find(c => c.id === hoverId);
                if (_hc) {
                    trailCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(a, 0.95)})`;
                    for (const path of _hc.paths) {
                        for (let i = 0; i < path.length; i += 2) {
                            const p = proj(path[i], path[i + 1]);
                            if (!p[2]) continue;
                            trailCtx.beginPath(); trailCtx.arc(p[0], p[1], 1.5, 0, Math.PI * 2); trailCtx.fill();
                        }
                    }
                }
            }
            trailCtx.restore();
            ctx.drawImage(trailCanvas, 0, 0, w, h);                  // composite the trailed stars onto the sky (above the lines)
            // Highlight the hovered/selected star (the one the tooltip describes) with a crisp cyan ring.
            if (skyTarget && hoveredStar && hoveredStar._vis) {
                ctx.save();
                ctx.strokeStyle = 'rgba(0, 210, 255, 0.95)';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.arc(hoveredStar._x, hoveredStar._y, Math.max(4.5, (hoveredStar.size || 1) + 3.5), 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
            // Highlight the hovered deep-sky object with a cyan ring around its glow.
            if (skyTarget && hoveredDeepsky && hoveredDeepsky._vis) {
                ctx.save();
                ctx.strokeStyle = 'rgba(0, 210, 255, 0.95)';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.arc(hoveredDeepsky._x, hoveredDeepsky._y, hoveredDeepsky.rad * skyZoom + 3, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
            // Ecliptic — the Sun/Moon/planet highway; faint dashed arc, broken at the horizon.
            if (showEcliptic) {
                ctx.save();
                if (dome) { ctx.beginPath(); ctx.arc(cx, cy, Rdome, 0, Math.PI * 2); ctx.clip(); }   // so it reaches exactly to the horizon
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = `rgba(245, 194, 66, ${a * 0.5})`;
                ctx.lineWidth = 1.4;
                let _ePrev = null;
                for (const _ep of ECLIPTIC_PTS) {
                    const q = proj(_ep[0], _ep[1]);
                    if (_ePrev && (_ePrev[2] || q[2])) { ctx.beginPath(); ctx.moveTo(_ePrev[0], _ePrev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
                    _ePrev = q;
                }
                ctx.restore();
            }
            // Zodiac signs along the ecliptic (symbol at each 30° sign centre).
            if (showZodiac) {
                ctx.save();
                ctx.font = '16px sans-serif';   // astrological glyphs (Orbitron lacks them)
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                for (const z of ZODIAC) {
                    const q = proj(z.ra, z.dec);
                    z._x = q[0]; z._y = q[1]; z._vis = q[2];   // cache for hover hit-testing
                    if (!q[2]) continue;
                    // Fade in/out over the last ~6 % toward the horizon (no popping as a sign rises/sets).
                    const _zf = dome ? Math.max(0, Math.min(1, (Rdome - Math.hypot(q[0] - cx, q[1] - cy)) / (Rdome * 0.06))) : 1;
                    ctx.fillStyle = `rgba(245, 210, 130, ${a * 0.7 * _zf})`;
                    ctx.fillText(z.sym, q[0], q[1]);
                }
                ctx.restore();
            } else {
                for (const z of ZODIAC) z._vis = false;        // hidden → not hoverable
            }
            // Twilight glow at the Sun's position, fading from horizon into night (subtle — keeps the stars visible).
            if (dome && typeof sunPosition === 'function') {
                const _sun = sunPosition(getDisplayTime());
                const _H = (lst - _sun.ra) * D2R, _dd = _sun.dec * D2R, _la = skyLat * D2R;
                const _alt = Math.asin(Math.max(-1, Math.min(1, Math.sin(_la) * Math.sin(_dd) + Math.cos(_la) * Math.cos(_dd) * Math.cos(_H)))) * (180 / Math.PI);
                const _tw = Math.max(0, Math.min(1, (_alt + 16) / 22));   // 0 at −16° (night) → 1 by +6°
                if (_tw > 0.01) {
                    const _sp = proj(_sun.ra, _sun.dec);
                    const g = ctx.createRadialGradient(_sp[0], _sp[1], 0, _sp[0], _sp[1], Rdome);
                    g.addColorStop(0, `rgba(255, 170, 90, ${0.22 * _tw * a})`);
                    g.addColorStop(0.45, `rgba(120, 135, 210, ${0.10 * _tw * a})`);
                    g.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.save();
                    ctx.beginPath(); ctx.arc(cx, cy, Rdome, 0, Math.PI * 2); ctx.clip();
                    ctx.fillStyle = g; ctx.fillRect(cx - Rdome, cy - Rdome, Rdome * 2, Rdome * 2);
                    ctx.restore();
                }
                // Global day/night tint from the Sun's altitude: day → blue brighten, deep night → slight darken.
                const _day = Math.max(0, Math.min(1, (_alt + 6) / 16));      // 0 below −6°, full by +10°
                const _night = Math.max(0, Math.min(1, (-10 - _alt) / 8));   // deepens below −10°
                if (_day > 0.01 || _night > 0.01) {
                    ctx.save();
                    ctx.beginPath(); ctx.arc(cx, cy, Rdome, 0, Math.PI * 2); ctx.clip();
                    if (_day > 0.01)   { ctx.fillStyle = `rgba(120, 150, 210, ${0.18 * _day * a})`; ctx.fillRect(cx - Rdome, cy - Rdome, Rdome * 2, Rdome * 2); }
                    if (_night > 0.01) { ctx.fillStyle = `rgba(2, 6, 18, ${0.14 * _night * a})`;     ctx.fillRect(cx - Rdome, cy - Rdome, Rdome * 2, Rdome * 2); }
                    ctx.restore();
                }
            }
            // Pulsating Polaris (north celestial pole star). In dome mode its altitude = observer latitude,
            // so south of the equator proj() reports it below the horizon and it's skipped automatically.
            {
                const _pol = proj(37.95, 89.26);                     // Polaris: RA 2h31m ≈ 37.95°, Dec +89.26°
                if (_pol[2]) {
                    const _pt = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
                    const _pulse = 0.5 + 0.5 * Math.sin(_pt * 2);    // 0…1, ~3 s cycle
                    ctx.save();
                    ctx.shadowColor = `rgba(150, 200, 255, ${a})`;
                    ctx.shadowBlur = 5 + _pulse * 11;
                    ctx.fillStyle = `rgba(245, 250, 255, ${a * (0.7 + 0.3 * _pulse)})`;
                    ctx.beginPath();
                    ctx.arc(_pol[0], _pol[1], 2.4 + _pulse * 2.6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    ctx.fillStyle = `rgba(200, 220, 245, ${a * (0.45 + 0.5 * _pulse)})`;   // tiny label centred below the star, pulses with it
                    ctx.font = '8px Orbitron';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';
                    ctx.fillText(starLangDE ? 'POLARSTERN' : 'POLARIS', _pol[0], _pol[1] + 9);
                }
            }
            // Constellation names at each (visible) constellation's centroid — always on, +36% size, hovered one red.
            const nameA = a * 0.85;   // brightness tracks the stars (dim behind clock, bright in sky mode)
            if (showConstNames && nameA > 0.02 && typeof CONSTELLATION_NAMES !== 'undefined') {
                ctx.font = '12.24px Orbitron';                       // 9px + 36%
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const _nm = (starLangDE && typeof CONSTELLATION_NAMES_DE !== 'undefined') ? CONSTELLATION_NAMES_DE : CONSTELLATION_NAMES;
                const labels = [], _seen = {};
                for (const con of CONSTELLATION_LINES) {
                    if (_seen[con.id]) continue;             // dedupe (Serpens "Ser" appears twice → count/label once)
                    _seen[con.id] = 1;
                    const c = CON_CENTROIDS[con.id];
                    if (!c) continue;
                    const p = proj(c[0], c[1]);              // fixed centroid → smooth, no jump
                    if (!p[2]) continue;
                    // Fade in/out over the last ~6 % toward the horizon (no popping as a constellation rises/sets).
                    const f = dome ? Math.max(0, Math.min(1, (Rdome - Math.hypot(p[0] - cx, p[1] - cy)) / (Rdome * 0.06))) : 1;
                    labels.push({ t: _nm[con.id] || con.id, x: p[0], y: p[1], hot: con.id === hoverId, f });
                }
                visConCount = labels.length;
                // (1) 50% dark-blue backdrop boxes behind the labels, no border (alpha follows the horizon fade)
                const padX = 6, boxH = 19;
                for (const L of labels) {
                    const bw = ctx.measureText(L.t).width + padX * 2;
                    ctx.fillStyle = `rgba(8, 20, 42, ${0.5 * a * L.f})`;
                    ctx.beginPath();
                    ctx.roundRect(L.x - bw / 2, L.y - boxH / 2, bw, boxH, 5);   // slightly rounded, borderless
                    ctx.fill();
                }
                // (2) the labels themselves, hovered one red
                for (const L of labels) {
                    ctx.fillStyle = L.hot ? `rgba(0, 210, 255, ${Math.max(nameA, 0.95) * L.f})` : `rgba(150, 185, 235, ${nameA * L.f})`;
                    ctx.fillText(L.t, L.x, L.y);
                }
            }
            // Horizon fade: bodies fade out over the last ~5° as they set (and in as they rise) instead of popping.
            const horizonFade = (px, py) => dome ? Math.max(0, Math.min(1, (Rdome - Math.hypot(px - cx, py - cy)) / (Rdome * 0.06))) : 1;
            // Planets (Schlyter ephemeris): bright coloured markers + names; they sit on the ecliptic and drift over days.
            if (showPlanets && typeof planetPositions === 'function') {
                const _pls = planetPositions(getDisplayTime());
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.font = '600 10px Orbitron';
                for (const _pl of _pls) {
                    const _pp = proj(_pl.ra, _pl.dec);
                    if (!_pp[2]) continue;
                    const _f = horizonFade(_pp[0], _pp[1]);
                    ctx.save();
                    ctx.shadowColor = _pl.color;
                    ctx.shadowBlur = 8;
                    ctx.globalAlpha = a * _f;
                    ctx.fillStyle = _pl.color;
                    ctx.beginPath(); ctx.arc(_pp[0], _pp[1], 2.8, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                    ctx.fillStyle = `rgba(245, 194, 66, ${a * _f})`;   // λ orange (CLAUDE.md palette)
                    ctx.fillText(_pl.name, _pp[0], _pp[1] + 5);
                }
            }
            // Sun + Moon — bright bodies on the ecliptic (drawn near the planets).
            if (typeof sunPosition === 'function') {
                const _su = sunPosition(getDisplayTime());
                const _sp = proj(_su.ra, _su.dec);
                if (_sp[2]) {
                    const _f = horizonFade(_sp[0], _sp[1]);
                    ctx.save();
                    ctx.shadowColor = 'rgba(255, 210, 90, 0.9)'; ctx.shadowBlur = 16; ctx.globalAlpha = a * _f;
                    ctx.fillStyle = 'rgba(255, 224, 120, 1)';
                    ctx.beginPath(); ctx.arc(_sp[0], _sp[1], 6, 0, Math.PI * 2); ctx.fill();
                    ctx.restore();
                    ctx.fillStyle = `rgba(245, 194, 66, ${a * _f})`;
                    ctx.font = '600 10px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    ctx.fillText('Sonne', _sp[0], _sp[1] + 9);
                }
            }
            if (showMoon && typeof moonPosition === 'function') {
                const _mo = moonPosition(getDisplayTime());
                const _mp = proj(_mo.ra, _mo.dec);
                if (_mp[2]) {
                    const _f = horizonFade(_mp[0], _mp[1]);
                    let _ba = -Math.PI / 2;     // bright limb faces the Sun's on-screen direction
                    if (typeof sunPosition === 'function') { const _s2 = sunPosition(getDisplayTime()), _s2p = proj(_s2.ra, _s2.dec); _ba = Math.atan2(_s2p[1] - _mp[1], _s2p[0] - _mp[0]); }
                    drawMoonImg(ctx, _mp[0], _mp[1], 9, _mo.illum, _ba, a * _f);
                    ctx.fillStyle = `rgba(245, 194, 66, ${a * _f})`;   // λ orange like Sun/planets
                    ctx.font = '600 10px Orbitron'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                    ctx.fillText('Mond', _mp[0], _mp[1] + 12);
                }
            }
            // Shooting stars — occasional fading streaks (spawn only in planetarium; existing ones finish either way).
            if (skyTarget && Math.random() < 0.004) {
                const _r = Rdome * 0.9 * Math.sqrt(Math.random()), _th = Math.random() * Math.PI * 2;   // uniformly inside the dome
                const ex = cx + _r * Math.cos(_th), ey = cy + _r * Math.sin(_th);
                const ang = Math.random() * Math.PI * 2, spd = 6 + Math.random() * 5;
                meteors.push({ x: ex, y: ey, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, life: 0, max: 22 + Math.random() * 20 });
            }
            ctx.save();
            if (dome) { ctx.beginPath(); ctx.arc(cx, cy, Rdome, 0, Math.PI * 2); ctx.clip(); }   // keep streaks inside the horizon
            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i];
                m.x += m.vx; m.y += m.vy; m.life++;
                if (m.life > m.max) { meteors.splice(i, 1); continue; }
                const t = m.life / m.max, al = (t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8) * a;
                const tx = m.x - m.vx * 4, ty = m.y - m.vy * 4;
                const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
                g.addColorStop(0, `rgba(255, 255, 255, ${al})`);
                g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
            }
            ctx.restore();
            // "HORIZONT" curved along the bottom of the horizon — drawn last so it always sits on top.
            if (dome) {
                ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.7})`;
                ctx.font = '9px Orbitron';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const _hz = (starLangDE ? 'HORIZONT' : 'HORIZON'), _hls = 3, _hr = Rdome + 12;  // DE/Latin; baseline just outside the line
                const _hw = [..._hz].map(c => ctx.measureText(c).width);
                const _harc = _hw.reduce((s, w) => s + w, 0) + _hls * (_hz.length - 1);
                let _phi = Math.PI / 2 + (_harc / 2) / _hr;          // start at the left, walk right (decreasing φ; bottom = π/2, y down)
                for (let i = 0; i < _hz.length; i++) {
                    _phi -= (_hw[i] / 2) / _hr;
                    ctx.save();
                    ctx.translate(cx + _hr * Math.cos(_phi), cy + _hr * Math.sin(_phi));
                    ctx.rotate(_phi - Math.PI / 2);                  // tangent; tops point toward the centre → readable
                    ctx.fillText(_hz[i], 0, 0);
                    ctx.restore();
                    _phi -= (_hw[i] / 2 + _hls) / _hr;
                }
                // Cardinal directions (N top, O/east left, S bottom, W/west right — view looking up; frame is fixed).
                // Placed OUTSIDE the horizon ring (like HORIZONT); S sits a bit further out so it clears the HORIZONT label.
                const _co = Rdome + 14;          // just outside the ring (HORIZONT baseline is Rdome + 12)
                ctx.fillStyle = `rgba(150, 190, 240, ${a * 0.85})`;
                ctx.font = '700 14px Orbitron';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText('N', cx, cy - _co);
                ctx.fillText('O', cx - _co, cy);
                ctx.fillText('W', cx + _co, cy);
                ctx.fillText('S', cx, cy + Rdome + 28);   // below the HORIZONT word
            }
            ctx.restore();
        }
