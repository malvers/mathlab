// Shared photo layer — waypoint pins (status colours) + the photo lightbox (counter, prev/next,
// keyboard, native immersive fullscreen). ONE implementation for BOTH the recorder (tracker.html)
// and the read-only viewer (view.html), so photo pins & the lightbox render and behave identically.
// Pairs with photo-layer.css. Requires Leaflet (window.L) at call time.
//
// Usage:
//   PhotoLayer.mountLightbox();                                  // once, after <body> exists
//   const m = L.marker(latlng, { icon: PhotoLayer.pinIcon(wp) }).addTo(map);
//   m.on('click', () => PhotoLayer.openLightbox(wp, waypoints)); // tap → straight to full-screen
(function (global) {
    'use strict';

    const PENDING_TITLE = 'Wird erkannt …';
    const FAIL_TITLE = 'Erkennung fehlgeschlagen';
    // Camera glyph, white stroke on the coloured dot.
    const CAM_PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
    // Microphone glyph for voice waypoints (Voice-Spur).
    const MIC_PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
    // Speaker glyph — the voice note's BIG lightbox visual. The map pin keeps the mic.
    const SPEAKER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    // Video-camera glyph for video waypoints (Video-Spur). The lightbox itself shows a real <video>.
    const VIDEO_PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>';
    const $ = (id) => document.getElementById(id);

    // Status pin: green = recognised (.done), orange pulse = identifying (.pending), red = failed.
    // Voice waypoints get the mic glyph on their own dot (.voice) so they read differently from photos.
    function pinIcon(wp, count) {
        const isVoice = wp && wp.type === 'voice';
        const isVideo = wp && wp.type === 'video';
        let state = isVoice ? ' voice' : (isVideo ? ' video' : ' done');
        if (!isVoice && !isVideo) {
            if (wp.title === PENDING_TITLE) state = ' pending';
            else if (!wp.title || wp.title === FAIL_TITLE) state = ' failed';
        }
        // count >= 2 → several waypoints sit on the exact same spot; show a tally
        // badge on the top-most pin so the stack is visible before you even tap it.
        const badge = (count && count > 1) ? '<span class="wp-badge">' + count + '</span>' : '';
        const glyph = isVoice ? SPEAKER_SVG : (isVideo ? VIDEO_PIN_SVG : CAM_PIN_SVG);
        return global.L.divIcon({
            className: 'wp-pin',
            html: '<div class="wp-dot' + state + '">' + glyph + '</div>' + badge,
            iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
        });
    }

    // Pins that visually overlap on screen ("a stack") get a tally badge on the TOP pin so
    // the pile is visible before you tap it. Overlap is a SCREEN concept, so it is measured
    // in pixels via the map projection and therefore depends on zoom — the count must be
    // recomputed on every `zoomend`. STACK_PX is the single source of truth for the threshold;
    // the fan-out reuses the SAME grouping (each marker's `_stack`), so the badge number always
    // equals the number of pins that fan out on tap — structurally, not by coincidence.
    //   - When `map` is given: pixel-distance clustering (catches near-but-not-identical fixes).
    //   - Without `map`: falls back to exact-coordinate grouping (zoom-independent).
    // Each marker must carry its waypoint as `m._wp`. The chosen count is stored on `m._badge`
    // so a fan-out can strip the badge and the collapse can restore it.
    const STACK_PX = 26;     // single source of truth: pins whose DOT CENTERS are within this many
                             // screen px form one stack — badge AND fan-out share this threshold
    const STACK_TOP_Z = 900; // raise the badged pin above its plain stackmates (pending = 2000 still wins)
    const DOT_DY = 15;       // the visible dot centre sits iconAnchor.y(30) − iconSize/2(15) = 15px ABOVE the tip

    // Project a marker's TIP latlng (its getLatLng, anchored bottom-centre) to the visible DOT-CENTRE
    // layer point — the optical position used for ALL clustering + fan geometry.
    function dotPoint(map, m) {
        const p = map.latLngToLayerPoint(m.getLatLng());
        return global.L.point(p.x, p.y - DOT_DY);
    }
    // Inverse: a DOT-CENTRE layer point → the TIP latlng to assign so the dot lands exactly there.
    function dotPointToLatLng(map, pt) {
        return map.layerPointToLatLng(global.L.point(pt.x, pt.y + DOT_DY));
    }

    function exactKey(wp) {
        return (Number(wp && wp.lat) || 0).toFixed(5) + ',' + (Number(wp && wp.lng) || 0).toFixed(5);
    }
    function isPending(m) { return !!(m && m._wp && m._wp.title === PENDING_TITLE); }
    // Badge the group member nearest the cluster's optical centre, FORCE it on top via zIndexOffset
    // (so a y-tie / DOM-order quirk can't hide the badge), and record the whole group on every marker
    // as `_stack` so the fan-out reuses the EXACT same partition (badge count == fanned count). A
    // pending pin is force-raised (z 2000) elsewhere, so if the stack has one the badge goes there.
    function stampGroup(group, topIdx) {
        const count = group.length;
        const pIdx = group.findIndex(isPending);
        if (pIdx !== -1) topIdx = pIdx;
        else if (topIdx == null) topIdx = count - 1;
        group.forEach((m, i) => {
            const badge = (count > 1 && i === topIdx) ? count : 0;
            m._badge = badge;
            m._stack = group; // fan-out reads this → fanned set is identical to the badged set
            m.setIcon(pinIcon(m._wp, badge));
            // leave pending pins' own z (2000) untouched; raise/relax everyone else
            if (!isPending(m)) m.setZIndexOffset(badge ? STACK_TOP_Z : 0);
        });
    }
    function applyStackBadges(markers, map) {
        if (!Array.isArray(markers)) return;
        const valid = markers.filter(m => m && m._wp);

        if (!map || typeof map.latLngToLayerPoint !== 'function') {
            // exact-coordinate fallback (all share the same spot → last added is on top)
            const groups = new Map();
            valid.forEach(m => {
                const k = exactKey(m._wp);
                if (!groups.has(k)) groups.set(k, []);
                groups.get(k).push(m);
            });
            groups.forEach(g => stampGroup(g));
            return;
        }

        // ONE clustering definition (shared with the fan via `m._stack`): connected components (BFS)
        // over DOT-CENTRE pixel distance, threshold STACK_PX. A dense blob → one component → one badge;
        // the fan reuses the same group so its count always matches what's shown.
        const n = valid.length;
        const pts = valid.map(m => dotPoint(map, m));
        const seen = new Array(n).fill(false);
        for (let i = 0; i < n; i++) {
            if (seen[i]) continue;
            const comp = [i];
            seen[i] = true;
            const queue = [i];
            while (queue.length) {
                const a = queue.pop();
                for (let k = 0; k < n; k++) {
                    if (!seen[k] && pts[a].distanceTo(pts[k]) <= STACK_PX) {
                        seen[k] = true;
                        comp.push(k);
                        queue.push(k);
                    }
                }
            }
            // Badge the pin nearest the component's dot-centre centroid (its optical middle, where the
            // fan erupts) — not the southernmost edge pin.
            let cx = 0, cy = 0;
            comp.forEach(idx => { cx += pts[idx].x; cy += pts[idx].y; });
            cx /= comp.length; cy /= comp.length;
            const ctr = global.L.point(cx, cy);
            let topLocal = 0, best = Infinity;
            for (let t = 0; t < comp.length; t++) {
                const d = pts[comp[t]].distanceTo(ctr);
                if (d < best) { best = d; topLocal = t; }
            }
            stampGroup(comp.map(idx => valid[idx]), topLocal);
        }
    }

    // ---- one shared lightbox instance ----
    let list = [];   // the photos we can step through
    let idx = -1;    // index into list of the photo on display
    let wired = false;
    let navTimer;    // 8 s idle timer that fades the prev/next arrows out

    // ---- manual fullscreen toggle (real OS fullscreen) ----
    // The auto-immersive path (PhotoFullscreen) is native-Android-only and no-ops
    // in a plain browser, so THIS button is what gives the read-only web viewer
    // true OS fullscreen (browser chrome away). A button click is always a valid
    // user gesture, so requestFullscreen is allowed where the auto path is blocked.
    const ENTER_FS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4H20V10M4 14V20H10"/></svg>';
    const EXIT_FS_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4V10H20M10 20V14H4"/></svg>';
    function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
    function refreshFsIcon() { const b = $('lightbox-fs'); if (b) b.innerHTML = fsElement() ? EXIT_FS_SVG : ENTER_FS_SVG; }
    function exitFs() {
        if (!fsElement()) return;
        const ex = document.exitFullscreen || document.webkitExitFullscreen;
        if (ex) { try { const r = ex.call(document); if (r && r.catch) r.catch(() => {}); } catch (_) {} }
    }
    function toggleFs() {
        const lb = $('photo-lightbox');
        if (!lb) return;
        if (fsElement()) { exitFs(); return; }
        const req = lb.requestFullscreen || lb.webkitRequestFullscreen;
        if (req) { try { const r = req.call(lb); if (r && r.catch) r.catch(() => {}); } catch (_) {} }
    }

    // The edge function encodes a photo's facts as "Label:\tValue" lines (PlantNet, Google
    // Gemini, Heimat); every other non-empty line is the free-text blurb. We show the blurb as a
    // paragraph and the labelled lines as a compact 2-column table. Transport stays plain text
    // (DB / live broadcast / GPX untouched) — only the lightbox DISPLAY becomes a real table.
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    }
    // Icon per fact label (matches the mockup): 🌿 botanical specialist, ✨ Gemini, 🌍 origin.
    const FACT_ICON = { 'PlantNet': '🌿', 'Gemini': '✨', 'Heimat': '🌍' };
    const FACT_RELABEL = { 'Google Gemini': 'Gemini' }; // shorten legacy stored labels for display
    function renderFacts(text) {
        const blurb = [], rows = [];
        String(text || '').split('\n').forEach((raw) => {
            const ln = raw.replace(/\s+$/, '');
            const ti = ln.indexOf('\t');
            if (ti > 0) rows.push([ln.slice(0, ti).replace(/:\s*$/, '').trim(), ln.slice(ti + 1).trim()]);
            else if (ln.trim()) blurb.push(ln.trim());
        });
        let html = '';
        if (blurb.length) html += '<div class="lb-blurb">' + esc(blurb.join(' ')) + '</div>';
        if (rows.length) html += '<table class="lb-facts"><tbody>' +
            rows.map((r) => {
                const label = FACT_RELABEL[r[0]] || r[0]; // "Google Gemini" → "Gemini"
                const ic = FACT_ICON[label]; // prepend the icon when the label is a known one
                return '<tr><th>' + esc((ic ? ic + ' ' : '') + label) + '</th><td>' + esc(r[1]) + '</td></tr>';
            }).join('') +
            '</tbody></table>';
        return html;
    }

    // Custom themed audio player driving the hidden #lightbox-audio: play/pause + seekable bar +
    // time. webm/opus blobs often report duration=Infinity → fall back to the recorded length on
    // data-dur (set in showAt). Wired once.
    function fmtClock(s) { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
    function wireAudioPlayer() {
        const au = $('lightbox-audio'), btn = $('lb-play'), track = $('lb-track'), fill = $('lb-fill'), time = $('lb-time');
        if (!au || !btn || au.__wired) return;
        au.__wired = true;
        const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
        function total() {
            if (isFinite(au.duration) && au.duration > 0) return au.duration;
            const d = parseFloat(au.dataset && au.dataset.dur);
            return isFinite(d) ? d : 0;
        }
        function icon() { btn.innerHTML = au.paused ? PLAY : PAUSE; }
        function paint() {
            const d = total();
            if (fill) fill.style.width = (d ? Math.min(100, au.currentTime / d * 100) : 0) + '%';
            if (time) time.textContent = fmtClock(au.currentTime) + ' / ' + fmtClock(d);
        }
        btn.addEventListener('click', () => { if (au.paused) { au.play().catch(() => {}); } else au.pause(); });
        au.addEventListener('play', icon);
        au.addEventListener('pause', icon);
        au.addEventListener('ended', () => { au.currentTime = 0; icon(); paint(); });
        au.addEventListener('timeupdate', paint);
        au.addEventListener('loadedmetadata', () => { icon(); paint(); });
        au.addEventListener('durationchange', paint);
        if (track) track.addEventListener('click', (e) => {
            const r = track.getBoundingClientRect(), d = total();
            if (d) { au.currentTime = Math.min(d, Math.max(0, (e.clientX - r.left) / r.width * d)); paint(); }
        });
        icon(); paint();
    }

    function showAt(i) {
        const wp = list[i];
        if (!wp) return;
        idx = i;
        const img = $('lightbox-img'), au = $('lightbox-audio'), vi = $('lightbox-voice'),
            vid = $('lightbox-video'), lb = $('photo-lightbox'), lbp = $('lb-player');
        // stop any currently-playing media first
        if (au) { try { au.pause(); } catch (_) {} au.removeAttribute('src'); }
        if (vid) { try { vid.pause(); } catch (_) {} }
        if (wp.type === 'voice') {
            // Voice waypoint → big speech icon in the photo's place + a centred audio player.
            if (img) { img.removeAttribute('src'); img.style.display = 'none'; }
            if (vid) { vid.removeAttribute('src'); vid.style.display = 'none'; }
            if (vi) vi.classList.add('show');
            if (lb) lb.classList.add('lb-voice');   // centre title + duration (voice only)
            if (lbp) lbp.classList.add('show');
            if (au) { au.src = wp.audio || ''; au.dataset.dur = wp.dur || ''; }
            $('lightbox-title').textContent = wp.title || 'Sprachnotiz';
            const head = wp.dur ? Number(wp.dur).toFixed(1) + ' s' : '';
            $('lightbox-text').textContent = wp.text ? (head ? head + ' — ' + wp.text : wp.text) : head;
        } else if (wp.type === 'video') {
            // Video waypoint → a real <video> player in the photo's place (native controls).
            if (img) { img.removeAttribute('src'); img.style.display = 'none'; }
            if (lbp) lbp.classList.remove('show');
            if (vi) vi.classList.remove('show');
            if (lb) lb.classList.remove('lb-voice');
            if (vid) { vid.src = wp.video || ''; vid.style.display = ''; }
            $('lightbox-title').textContent = wp.title || 'Video';
            $('lightbox-text').textContent = wp.text || '';
        } else {
            if (lbp) lbp.classList.remove('show');
            if (vi) vi.classList.remove('show');
            if (vid) { vid.removeAttribute('src'); vid.style.display = 'none'; }
            if (lb) lb.classList.remove('lb-voice');
            if (img) { img.src = wp.img; img.style.display = ''; }
            $('lightbox-title').textContent = wp.title || '';
            $('lightbox-text').innerHTML = renderFacts(wp.text);
        }
        $('lightbox-count').textContent = (i + 1) + '/' + list.length;
    }
    // Step through the photos, wrapping around (loop) at both ends.
    function step(d) {
        const n = list.length;
        if (n < 2 || idx < 0) return;
        showAt((idx + d + n) % n);
    }
    function close() {
        const lb = $('photo-lightbox');
        if (!lb) return;
        lb.classList.remove('open');
        if (global.PhotoFullscreen) global.PhotoFullscreen.exit(); // leave Android immersive fullscreen
        exitFs(); // …and leave web OS-fullscreen if the toggle button put us there
        $('lightbox-img').removeAttribute('src');
        const au = $('lightbox-audio'); if (au) { try { au.pause(); } catch (_) {} au.removeAttribute('src'); }
        const vid = $('lightbox-video'); if (vid) { try { vid.pause(); } catch (_) {} vid.removeAttribute('src'); }
        clearTimeout(navTimer);
        const nav = $('lightbox-nav'); if (nav) nav.classList.remove('faded');
        idx = -1; list = [];
    }

    // Auto-hide the prev/next arrows after 8 s idle; reveal them again on a TAP or mouse move
    // (NOT on a swipe — a swipe already navigates). Only relevant when there's more than one photo.
    function showNav() {
        if (list.length < 2) return;
        const nav = $('lightbox-nav');
        if (!nav) return;
        nav.classList.remove('faded');
        clearTimeout(navTimer);
        navTimer = setTimeout(() => nav.classList.add('faded'), 8000);
    }
    // Hide the arrows right away (a swipe navigates → the arrows should get out of the way).
    function hideNav() {
        clearTimeout(navTimer);
        const nav = $('lightbox-nav');
        if (nav) nav.classList.add('faded');
    }

    // Inject the lightbox DOM once (if the host page doesn't already have it) and wire the controls.
    function mountLightbox() {
        if (!$('photo-lightbox')) {
            const lb = document.createElement('div');
            lb.id = 'photo-lightbox';
            lb.innerHTML =
                '<button id="lightbox-fs" aria-label="Vollbild umschalten" title="Vollbild"></button>' +
                '<button id="lightbox-close" aria-label="Schließen">&times;</button>' +
                '<div id="lightbox-count"></div>' +
                '<div class="lb-inner"><img id="lightbox-img" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><video id="lightbox-video" playsinline preload="metadata" controls style="display:none"></video><div id="lightbox-voice">' + SPEAKER_SVG + '</div><div id="lb-player"><button id="lb-play" aria-label="Abspielen/Pause"></button><div id="lb-track"><div id="lb-fill"></div></div><span id="lb-time">0:00 / 0:00</span><audio id="lightbox-audio" preload="metadata"></audio></div><div id="lightbox-title"></div><div id="lightbox-text"></div></div>' +
                '<div id="lightbox-nav">' +
                '<button class="lb-arrow" id="lb-prev" aria-label="Vorheriges Foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>' +
                '<button class="lb-arrow" id="lb-next" aria-label="Nächstes Foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>' +
                '</div>';
            document.body.appendChild(lb);
        }
        if (wired) return;
        wired = true;
        // A host page may ship its OWN inline #photo-lightbox (the recorder does) that predates the
        // fullscreen toggle and so lacks #lightbox-fs. Inject it so the wiring below never hits null.
        if (!$('lightbox-fs')) {
            const host = $('photo-lightbox');
            if (host) {
                const fb = document.createElement('button');
                fb.id = 'lightbox-fs';
                fb.setAttribute('aria-label', 'Vollbild umschalten');
                fb.setAttribute('title', 'Vollbild');
                host.insertBefore(fb, host.firstChild);
            }
        }
        // A host's inline lightbox (the recorder) predates voice notes → inject the audio player so
        // voice waypoints can play. Sits inside .lb-inner, right before the title.
        if (!$('lb-player')) {
            const inner = document.querySelector('#photo-lightbox .lb-inner') || $('photo-lightbox');
            if (inner) {
                const p = document.createElement('div');
                p.id = 'lb-player';
                p.innerHTML = '<button id="lb-play" aria-label="Abspielen/Pause"></button>' +
                    '<div id="lb-track"><div id="lb-fill"></div></div>' +
                    '<span id="lb-time">0:00 / 0:00</span>' +
                    '<audio id="lightbox-audio" preload="metadata"></audio>';
                const t = $('lightbox-title');
                if (t && t.parentNode === inner) inner.insertBefore(p, t);
                else inner.appendChild(p);
            }
        }
        // …and the big speaker icon shown in place of the (missing) photo for a voice note.
        if (!$('lightbox-voice')) {
            const inner = document.querySelector('#photo-lightbox .lb-inner') || $('photo-lightbox');
            if (inner) {
                const v = document.createElement('div');
                v.id = 'lightbox-voice';
                v.innerHTML = SPEAKER_SVG;
                const p = $('lb-player');
                if (p && p.parentNode === inner) inner.insertBefore(v, p);
                else inner.appendChild(v);
            }
        }
        // …and a real <video> for video waypoints (a host's inline lightbox predates the Video-Spur).
        if (!$('lightbox-video')) {
            const inner = document.querySelector('#photo-lightbox .lb-inner') || $('photo-lightbox');
            if (inner) {
                const v = document.createElement('video');
                v.id = 'lightbox-video';
                v.setAttribute('playsinline', '');
                v.controls = true; v.preload = 'metadata';
                v.style.display = 'none';
                const im = $('lightbox-img');
                if (im && im.parentNode === inner) inner.insertBefore(v, im.nextSibling);
                else inner.appendChild(v);
            }
        }
        wireAudioPlayer();
        $('lightbox-close').addEventListener('click', close);
        if ($('lightbox-fs')) $('lightbox-fs').addEventListener('click', toggleFs);
        document.addEventListener('fullscreenchange', refreshFsIcon);
        document.addEventListener('webkitfullscreenchange', refreshFsIcon);
        refreshFsIcon();
        $('lb-prev').addEventListener('click', () => step(-1));
        $('lb-next').addEventListener('click', () => step(1));
        $('photo-lightbox').addEventListener('click', (e) => { if (e.target.id === 'photo-lightbox') close(); });
        document.addEventListener('keydown', (e) => {
            if (!$('photo-lightbox').classList.contains('open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') step(-1);
            else if (e.key === 'ArrowRight') step(1);
        });
        // Touch swipe — same as the arrows: swipe LEFT → next photo, swipe RIGHT → previous.
        // Single finger, mostly-horizontal move past a threshold; pinch/vertical scroll ignored.
        let sx = 0, sy = 0, swiping = false, moved = 0, usingTouch = false;
        const lb = $('photo-lightbox');
        lb.addEventListener('touchstart', (e) => {
            usingTouch = true; // touch device → ignore the synthetic mousemove a tap/drag fires
            if (e.touches.length !== 1) { swiping = false; return; }
            sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true; moved = 0;
        }, { passive: true });
        lb.addEventListener('touchmove', (e) => {
            if (!swiping || e.touches.length !== 1) return;
            moved = Math.max(moved, Math.hypot(e.touches[0].clientX - sx, e.touches[0].clientY - sy));
        }, { passive: true });
        lb.addEventListener('touchend', (e) => {
            if (!swiping) return;
            swiping = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - sx, dy = t.clientY - sy;
            moved = Math.max(moved, Math.hypot(dx, dy));
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { step(dx < 0 ? 1 : -1); hideNav(); } // swipe → navigate + hide arrows
            else if (moved < 10) showNav(); // ONLY a clean tap reveals the arrows — ANY drag shows nothing
        }, { passive: true });
        // Desktop ONLY (real mouse): movement reveals the arrows. Guarded so a touch-drag's synthetic
        // mousemove can't trigger it — on touch, the reveal happens strictly via the clean tap above.
        lb.addEventListener('mousemove', () => { if (!usingTouch) showNav(); });
    }

    // Open a photo full-screen. `all` (optional) is the array to step through with the arrows.
    function openLightbox(wp, all) {
        if (!wp) return;
        mountLightbox();
        list = (Array.isArray(all) && all.length) ? all : [wp];
        const i = list.indexOf(wp);
        if (i >= 0) showAt(i);
        else { list = [wp]; showAt(0); } // not in the list → show it alone, no looping
        const multi = list.length > 1;
        $('lightbox-nav').style.display = multi ? 'flex' : 'none';
        if (multi) showNav(); // arrows visible now, then auto-fade after 8 s
        $('lightbox-count').style.display = multi ? 'block' : 'none';
        $('photo-lightbox').classList.add('open');
        if (global.PhotoFullscreen) global.PhotoFullscreen.enter($('photo-lightbox'));
    }

    global.PhotoLayer = { pinIcon, applyStackBadges, dotPoint, dotPointToLatLng, DOT_DY, mountLightbox, openLightbox, closeLightbox: close, renderFacts };
})(window);
