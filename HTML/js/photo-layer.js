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
    const $ = (id) => document.getElementById(id);

    // Status pin: green = recognised (.done), orange pulse = identifying (.pending), red = failed.
    function pinIcon(wp) {
        let state = ' done';
        if (wp.title === PENDING_TITLE) state = ' pending';
        else if (!wp.title || wp.title === FAIL_TITLE) state = ' failed';
        return global.L.divIcon({
            className: 'wp-pin',
            html: '<div class="wp-dot' + state + '">' + CAM_PIN_SVG + '</div>',
            iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30],
        });
    }

    // ---- one shared lightbox instance ----
    let list = [];   // the photos we can step through
    let idx = -1;    // index into list of the photo on display
    let wired = false;

    function showAt(i) {
        const wp = list[i];
        if (!wp) return;
        idx = i;
        $('lightbox-img').src = wp.img;
        $('lightbox-title').textContent = wp.title || '';
        $('lightbox-text').textContent = wp.text || '';
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
        $('lightbox-img').removeAttribute('src');
        idx = -1; list = [];
    }

    // Inject the lightbox DOM once (if the host page doesn't already have it) and wire the controls.
    function mountLightbox() {
        if (!$('photo-lightbox')) {
            const lb = document.createElement('div');
            lb.id = 'photo-lightbox';
            lb.innerHTML =
                '<button id="lightbox-close" aria-label="Schließen">&times;</button>' +
                '<div id="lightbox-count"></div>' +
                '<div class="lb-inner"><img id="lightbox-img" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><div id="lightbox-title"></div><div id="lightbox-text"></div></div>' +
                '<div id="lightbox-nav">' +
                '<button class="lb-arrow" id="lb-prev" aria-label="Vorheriges Foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>' +
                '<button class="lb-arrow" id="lb-next" aria-label="Nächstes Foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>' +
                '</div>';
            document.body.appendChild(lb);
        }
        if (wired) return;
        wired = true;
        $('lightbox-close').addEventListener('click', close);
        $('lb-prev').addEventListener('click', () => step(-1));
        $('lb-next').addEventListener('click', () => step(1));
        $('photo-lightbox').addEventListener('click', (e) => { if (e.target.id === 'photo-lightbox') close(); });
        document.addEventListener('keydown', (e) => {
            if (!$('photo-lightbox').classList.contains('open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') step(-1);
            else if (e.key === 'ArrowRight') step(1);
        });
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
        $('lightbox-count').style.display = multi ? 'block' : 'none';
        $('photo-lightbox').classList.add('open');
        if (global.PhotoFullscreen) global.PhotoFullscreen.enter($('photo-lightbox'));
    }

    global.PhotoLayer = { pinIcon, mountLightbox, openLightbox, closeLightbox: close };
})(window);
