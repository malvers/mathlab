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
    const $ = (id) => document.getElementById(id);

    // Status pin: green = recognised (.done), orange pulse = identifying (.pending), red = failed.
    // Voice waypoints get the mic glyph on their own dot (.voice) so they read differently from photos.
    function pinIcon(wp) {
        const isVoice = wp && wp.type === 'voice';
        let state = isVoice ? ' voice' : ' done';
        if (!isVoice) {
            if (wp.title === PENDING_TITLE) state = ' pending';
            else if (!wp.title || wp.title === FAIL_TITLE) state = ' failed';
        }
        return global.L.divIcon({
            className: 'wp-pin',
            html: '<div class="wp-dot' + state + '">' + (isVoice ? SPEAKER_SVG : CAM_PIN_SVG) + '</div>',
            iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
        });
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
    const FACT_ICON = { 'PlantNet': '🌿', 'Google Gemini': '✨', 'Heimat': '🌍' };
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
                const ic = FACT_ICON[r[0]]; // prepend the icon when the label is a known one
                return '<tr><th>' + esc((ic ? ic + ' ' : '') + r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>';
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
        const img = $('lightbox-img'), au = $('lightbox-audio'), vi = $('lightbox-voice'), lb = $('photo-lightbox'), lbp = $('lb-player');
        if (wp.type === 'voice') {
            // Voice waypoint → big speech icon in the photo's place + a centred audio player.
            if (img) { img.removeAttribute('src'); img.style.display = 'none'; }
            if (vi) vi.classList.add('show');
            if (lb) lb.classList.add('lb-voice');   // centre title + duration (voice only)
            if (lbp) lbp.classList.add('show');
            if (au) { au.src = wp.audio || ''; au.dataset.dur = wp.dur || ''; }
            $('lightbox-title').textContent = wp.title || 'Sprachnotiz';
            const head = wp.dur ? Number(wp.dur).toFixed(1) + ' s' : '';
            $('lightbox-text').textContent = wp.text ? (head ? head + ' — ' + wp.text : wp.text) : head;
        } else {
            if (au) { try { au.pause(); } catch (_) {} au.removeAttribute('src'); }
            if (lbp) lbp.classList.remove('show');
            if (vi) vi.classList.remove('show');
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

    // Inject the lightbox DOM once (if the host page doesn't already have it) and wire the controls.
    function mountLightbox() {
        if (!$('photo-lightbox')) {
            const lb = document.createElement('div');
            lb.id = 'photo-lightbox';
            lb.innerHTML =
                '<button id="lightbox-fs" aria-label="Vollbild umschalten" title="Vollbild"></button>' +
                '<button id="lightbox-close" aria-label="Schließen">&times;</button>' +
                '<div id="lightbox-count"></div>' +
                '<div class="lb-inner"><img id="lightbox-img" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><div id="lightbox-voice">' + SPEAKER_SVG + '</div><div id="lb-player"><button id="lb-play" aria-label="Abspielen/Pause"></button><div id="lb-track"><div id="lb-fill"></div></div><span id="lb-time">0:00 / 0:00</span><audio id="lightbox-audio" preload="metadata"></audio></div><div id="lightbox-title"></div><div id="lightbox-text"></div></div>' +
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
        let sx = 0, sy = 0, swiping = false;
        const lb = $('photo-lightbox');
        lb.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) { swiping = false; return; }
            sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true;
        }, { passive: true });
        lb.addEventListener('touchend', (e) => {
            if (!swiping) return;
            swiping = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - sx, dy = t.clientY - sy;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1); // swipe → navigate
            else showNav(); // a tap (not a swipe) → reveal the arrows + restart the fade timer
        }, { passive: true });
        // Desktop: any mouse movement over the lightbox reveals the arrows + restarts the timer.
        lb.addEventListener('mousemove', showNav);
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

    global.PhotoLayer = { pinIcon, mountLightbox, openLightbox, closeLightbox: close };
})(window);
