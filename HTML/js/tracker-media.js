// Doc Alvers Tracker — Foto-Spur / media subsystem (camera, identify, lightbox, spiderfy,
// photo-decision overlay, 'Nachbrennen', voice notes, waypoints, auto-hide). Extracted from
// tracker.js (Phase-2 refactor, 2026-06-09). tracker.js calls window.TrackerMedia(ctx) once and
// uses the returned exports. ctx = { map,$,toast,ensureSb,wpSer,doSync,bufferSnapshot,
// addLivePhoto,SUPABASE_URL,SUPABASE_KEY,COL_ORANGE,EUR_PER_PHOTO + live getters/setters for
// lastFix,tracking,posMarker,currentTrackId,waypoints,wpMarkers,fannedCluster }.

window.TrackerMedia = function (T) {
    const { map, $, toast, ensureSb, wpSer, doSync, bufferSnapshot, addLivePhoto,
            SUPABASE_URL, SUPABASE_KEY, COL_ORANGE, EUR_PER_PHOTO } = T;

        // ===============================================================
        // Foto-Spur: snap a photo, nail it to the track at the current
        // position, and let Gemini (via the identify Edge Function) name
        // and explain what it is. The Gemini key lives server-side only.
        // ===============================================================
        const IDENTIFY_URL = SUPABASE_URL + '/functions/v1/identify';
        const CAM_PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
        const PENDING_TITLE = 'Wird erkannt …';
        const FAIL_TITLE = 'Erkennung fehlgeschlagen'; // photo kept, AI failed → "nachbrennen" target

        function currentLatLng() {
            if (T.lastFix) return [T.lastFix.lat, T.lastFix.lng];
            if (T.posMarker) { const p = T.posMarker.getLatLng(); return [p.lat, p.lng]; }
            return null;
        }

        // Scale an image source (data URL / object URL) longest-side down to `max` px → JPEG data URL.
        function downscaleSrcToJpeg(src, max, quality) {
            return new Promise((resolve, reject) => {
                const im = new Image();
                im.onerror = () => reject(new Error('Bild nicht dekodierbar'));
                im.onload = () => {
                    let w = im.naturalWidth, h = im.naturalHeight;
                    if (w >= h && w > max) { h = Math.round(h * max / w); w = max; }
                    else if (h > w && h > max) { w = Math.round(w * max / h); h = max; }
                    const cv = document.createElement('canvas');
                    cv.width = w; cv.height = h;
                    cv.getContext('2d').drawImage(im, 0, 0, w, h);
                    resolve(cv.toDataURL('image/jpeg', quality));
                };
                im.src = src;
            });
        }
        // Same, but from a File (web file-input path).
        function downscaleToJpeg(file, max, quality) {
            return new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.onerror = () => reject(new Error('Datei nicht lesbar'));
                fr.onload = () => downscaleSrcToJpeg(fr.result, max, quality).then(resolve, reject);
                fr.readAsDataURL(file);
            });
        }

        // Read a Blob into a base64 data-URL (used to feed an R2-hosted photo back to identify).
        function blobToDataUrl(blob) {
            return new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.onload = () => resolve(fr.result);
                fr.onerror = () => reject(fr.error || new Error('FileReader-Fehler'));
                fr.readAsDataURL(blob);
            });
        }

        // Ask the identify Edge Function (which holds the Gemini key) what the photo shows.
        async function identifyPhoto(dataUrl, lat, lng) {
            const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
            let token = SUPABASE_KEY;
            try {
                const { data: { session } } = await (await ensureSb()).auth.getSession();
                if (session && session.access_token) token = session.access_token;
            } catch (e) { /* fall back to the publishable key */ }
            const kb = Math.round(base64.length * 3 / 4 / 1024);
            const t0 = Date.now();
            DebugWindow.log('identify → ' + kb + ' KB gesendet …');
            const res = await fetch(IDENTIFY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + token },
                body: JSON.stringify((lat != null && lng != null)
                    ? { image: base64, mime: 'image/jpeg', lat: lat, lng: lng }   // give Gemini the location context
                    : { image: base64, mime: 'image/jpeg' }),
            });
            const j = await res.json().catch(() => ({}));
            const dt = ((Date.now() - t0) / 1000).toFixed(1);
            // Surface the Pl@ntNet outcome so we can SEE whether the botanical
            // specialist made the call (pn=score sci) or Gemini fell back.
            const pn = j._diag && j._diag.plantnet;
            const pnStr = pn && pn !== 'off'
                ? ' | pn=' + (pn.sci ? pn.score + ' ' + pn.sci
                             : pn.low != null ? 'low ' + pn.low
                             : pn.reject ? 'reject ' + pn.reject
                             : pn.err ? 'err' : JSON.stringify(pn))
                : '';
            const d = j._diag ? (pnStr + ' | tries=' + j._diag.tries + ' wait=' + j._diag.waitedMs + 'ms [' + (j._diag.statuses || []).join(',') + ']') : '';
            if (!res.ok) { DebugWindow.log('identify ✗ ' + dt + 's HTTP' + res.status + ' ' + (j.error || '') + d); throw new Error(j.error || ('KI ' + res.status)); }
            DebugWindow.log('identify ✓ ' + dt + 's „' + (j.title || '') + '"' + d);
            return { title: j.title || 'Unbekannt', text: j.text || '' };
        }

        // ---- "Statistik" card: actual consumption -----------------------------------
        // usage_stats() (DB function) returns { photos, analyses }: photos = Σ stored photo-
        // waypoints; analyses = count of identify_log rows = TRUE number of Gemini calls incl.
        // re-runs (the real cost driver). Re-indexing a photo doesn't add a photo but DOES add
        // an analysis → cost tracks analyses, not photos.
        async function loadUsage() {
            const photoEl = $('use-photos'), anaEl = $('use-analyses'), costEl = $('use-cost');
            if (!photoEl) return;
            photoEl.textContent = '…'; if (anaEl) anaEl.textContent = '…'; costEl.textContent = '…';
            try {
                const c = await ensureSb();
                const { data, error } = await c.rpc('usage_stats');
                if (error) throw error;
                const row = Array.isArray(data) ? data[0] : data;
                const photos = Number((row && row.photos) || 0);
                const analyses = Number((row && row.analyses) || 0);
                photoEl.textContent = photos + (photos === 1 ? ' Foto' : ' Fotos');
                if (anaEl) anaEl.textContent = analyses.toLocaleString('de-DE') + '×';
                // Cost follows the ANALYSES (each run = 1 Gemini call), not the stored photos.
                costEl.textContent = '~' + (analyses * EUR_PER_PHOTO).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
            } catch (e) {
                photoEl.textContent = '–'; if (anaEl) anaEl.textContent = '–'; costEl.textContent = '–';
                if (window.DebugWindow) DebugWindow.log('Verbrauch: ' + (e && (e.message || e)));
            }
        }

        // ---- waypoint markers ----
        function wpIcon(wp) { return PhotoLayer.pinIcon(wp); } // shared pin renderer (../js/photo-layer.js)
        function wpPopupHtml(wp) {
            const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const i = T.waypoints.indexOf(wp); // → lightbox uses this to find the waypoint on tap
            return '<div class="wp-pop"><img class="wp-pop-img" data-i="' + i + '" src="' + wp.img + '" alt="">' +
                '<div class="wp-pop-title">' + esc(wp.title) + '</div>' +
                (wp.text ? '<div class="wp-pop-text">' + esc(wp.text) + '</div>' : '') + '</div>';
        }

        // ---- Photo lightbox: shared with the viewer via ../js/photo-layer.js (pins + lightbox =
        //      ONE renderer). PhotoLayer reuses the existing #photo-lightbox DOM + wires all
        //      controls (close / prev-next / Esc / arrows / native immersive fullscreen). ----
        PhotoLayer.mountLightbox();
        function openPhotoLightbox(wp) { PhotoLayer.openLightbox(wp, T.waypoints); }
        // ---- Photo-pin fan-out (spiderfy): a stack fans out on hover (desktop) / tap (touch) so each
        //      photo is reachable — even at 100% overlap. The stack is the SAME connected component the
        //      badge uses (stored on the marker as `_stack` by PhotoLayer.applyStackBadges), so the
        //      fanned count always equals the badge number and is independent of which pin you tap.
        //      ALL geometry runs in DOT-CENTRE pixel space (the marker latlng is the TIP, 15px below
        //      the visible dot — PhotoLayer.DOT_DY), so the ring, hub and lines sit on the real dots. ----
        const COL_FAN = 'rgb(14, 36, 78)'; // dark-blue connector lines + ring on fanned-out pins

        function pinClusterComponent(marker) {
            return (marker._stack && marker._stack.length) ? marker._stack : [marker];
        }
        function fanOut(markers) {
            collapseFan();
            const n = markers.length;
            if (n < 2) return;
            // Hub = centroid of the DOT CENTRES in pixel space → sits under the visible pile (not 15px
            // low at the tips, not skewed by lat/lng averaging).
            const dpts = markers.map(m => PhotoLayer.dotPoint(map, m));
            let sx = 0, sy = 0;
            dpts.forEach(p => { sx += p.x; sy += p.y; });
            const hub = L.point(sx / n, sy / n);
            const hubLatLng = map.layerPointToLatLng(hub);
            const R = Math.max(48, n * 5.4); // keep ~34 px spacing around the ring
            const originals = markers.map(m => m.getLatLng());
            const lines = [];
            markers.forEach((m, i) => {
                const ang = (i / n) * 2 * Math.PI - Math.PI / 2; // start at the top
                const ringDot = L.point(hub.x + Math.cos(ang) * R, hub.y + Math.sin(ang) * R); // dot centre on ring
                // line: dot-centre hub → dot-centre on ring (polyline vertices have no anchor offset, so
                // BOTH ends land exactly on the dots, not 15px below at the tips)
                lines.push(L.polyline([hubLatLng, map.layerPointToLatLng(ringDot)], { weight: 1.5, color: COL_FAN, opacity: 0.55, interactive: false }).addTo(map));
                // place the marker so its DOT (not its tip) sits on the ring point
                m.setLatLng(PhotoLayer.dotPointToLatLng(map, ringDot));
                m.setZIndexOffset(1000);
                m.setIcon(PhotoLayer.pinIcon(m._wp, 0)); // fanned apart → drop the stack badge
                if (m._icon) m._icon.classList.add('wp-fanned'); // dark-blue ring marks fanned pins
            });
            // dashed box around the dot ring (+ room for the 30px dot height), centred on the dot hub
            const pad = R + 22;
            const box = L.rectangle(
                L.latLngBounds(
                    map.layerPointToLatLng(L.point(hub.x - pad, hub.y - pad)),
                    map.layerPointToLatLng(L.point(hub.x + pad, hub.y + pad))
                ),
                { color: COL_ORANGE, weight: 1.5, dashArray: '6 6', fill: false, opacity: 0.7, interactive: false }
            ).addTo(map);
            T.fannedCluster = { markers, originals, lines, box, center: hubLatLng, radius: R };
        }
        function collapseFan() {
            if (!T.fannedCluster) return;
            T.fannedCluster.markers.forEach((m, i) => { m.setLatLng(T.fannedCluster.originals[i]); });
            T.fannedCluster.lines.forEach(l => map.removeLayer(l));
            if (T.fannedCluster.box) map.removeLayer(T.fannedCluster.box);
            T.fannedCluster = null;
            PhotoLayer.applyStackBadges(T.wpMarkers, map); // restore tally badges + top-z after collapsing
        }
        function onPinClick(marker) {
            // a fanned pin → open it; a stacked pin → fan it; a lone pin → open it
            if (T.fannedCluster && T.fannedCluster.markers.indexOf(marker) !== -1) {
                const wp = marker._wp; collapseFan(); openPhotoLightbox(wp); return;
            }
            const cluster = pinClusterComponent(marker);
            if (cluster.length > 1) fanOut(cluster);
            else openPhotoLightbox(marker._wp);
        }
        function onPinHover(marker) { // desktop hover → fan a stack open
            if (T.fannedCluster) return;
            const cluster = pinClusterComponent(marker);
            if (cluster.length > 1) fanOut(cluster);
        }
        // collapse when the cursor leaves the fanned area, on a map tap, or on zoom
        map.on('mousemove', (e) => {
            if (!T.fannedCluster) return;
            if (e.layerPoint.distanceTo(map.latLngToLayerPoint(T.fannedCluster.center)) > T.fannedCluster.radius + 44) collapseFan();
        });
        map.on('click', collapseFan);
        map.on('zoomstart', collapseFan);
        // overlap is pixel-based → recompute the tally badges whenever the zoom level changes
        map.on('zoomend', () => PhotoLayer.applyStackBadges(T.wpMarkers, map));

        function addWaypoint(wp) {
            T.waypoints.push(wp);
            const m = L.marker([wp.lat, wp.lng], { icon: wpIcon(wp) }).addTo(map);
            m._wp = wp;
            m.on('click', () => onPinClick(m));     // tap (touch) / click (desktop)
            m.on('mouseover', () => onPinHover(m));  // hover (desktop) → fan a stack
            wp._marker = m;
            if (wp.title === PENDING_TITLE) m.setZIndexOffset(2000); // see refreshWaypoint
            T.wpMarkers.push(m);
            PhotoLayer.applyStackBadges(T.wpMarkers, map); // stamp tally badge on any new stack
            return wp;
        }
        function refreshWaypoint(wp) {
            if (!wp._marker) return;
            wp._marker.setIcon(wpIcon(wp)); // pending → done; the lightbox reads wp.title/text live
            // When pins stack (e.g. a dense botanical garden), the one currently being analyzed
            // (orange/pending) pops ABOVE the others (high z) so you can see which is in work;
            // once done it drops back to the base layer (0).
            wp._marker.setZIndexOffset(wp.title === PENDING_TITLE ? 2000 : 0);
            PhotoLayer.applyStackBadges(T.wpMarkers, map); // setIcon above cleared the badge → restore it
        }
        function clearWaypoints() {
            collapseFan();
            T.wpMarkers.forEach(m => map.removeLayer(m));
            T.wpMarkers = [];
            T.waypoints = [];
        }

        // ---- camera button → capture → pin → identify ----
        // Native (Capacitor) uses the @capacitor/camera plugin for a reliable capture;
        // the browser falls back to the hidden <input capture> picker. Same single source —
        // window.Capacitor is undefined on the web, so the native path is simply skipped.
        const camInput = $('cam-input');
        const vidInput = $('vid-input');
        const NativeCam = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Camera) || null;
        const useNativeCam = !!(NativeCam && Capacitor.isNativePlatform && Capacitor.isNativePlatform());

        // Return a JPEG data URL (already ~1024 px wide), or null if the user cancelled.
        // ---- In-app photo decision overlay ----
        // KI runs the AI INLINE (overlay stays open, shows the card) so the user can still ✓ keep
        // or ✗ discard AFTER seeing it. Resolves { action:'keep'|'discard', ai:{title,text}|null }.
        const PD_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        const PD_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        let pdMounted = false;
        function mountDecide() {
            if (pdMounted) return; pdMounted = true;
            const ov = document.createElement('div');
            ov.id = 'photo-decide';
            ov.innerHTML = '<div class="pd-card">' +
                '<div class="pd-scroll"><img id="pd-img" alt=""><div id="pd-result"></div></div>' +
                '<div class="pd-row">' +
                '<button class="pd-btn pd-ki" id="pd-ki" type="button" aria-label="Mit KI erkennen">KI</button>' +
                '<button class="pd-btn pd-keep" id="pd-keep" type="button" aria-label="Übernehmen">' + PD_CHECK + '</button>' +
                '<button class="pd-btn pd-x" id="pd-x" type="button" aria-label="Verwerfen">' + PD_X + '</button>' +
                '</div></div>';
            document.body.appendChild(ov);
        }
        // KI = AI as a reviewable PREVIEW: overlay stays open, shows the result, user still decides.
        function decidePhoto(img, ll) {
            return new Promise((resolve) => {
                mountDecide();
                const ov = $('photo-decide');
                $('pd-img').src = img;
                $('pd-result').innerHTML = '';
                ov.className = 'open'; // reset any prior loading/reviewed state
                const finish = (res) => {
                    ov.classList.remove('open', 'loading', 'reviewed');
                    $('pd-img').removeAttribute('src'); $('pd-result').innerHTML = '';
                    resolve(res);
                };
                $('pd-x').onclick = () => finish({ action: 'discard' });
                $('pd-keep').onclick = () => finish({ action: 'keep', ai: null }); // ✓ before KI → keep, no AI
                $('pd-ki').onclick = async () => {
                    ov.classList.add('loading'); // spinner; hide KI + ✓ (only ✗ stays to cancel)
                    $('pd-result').innerHTML = '<div class="pd-wait">🤖 KI erkennt …</div>';
                    let ai = null;
                    try { ai = await identifyPhoto(img, ll[0], ll[1]); } catch (e) { ai = null; }
                    ov.classList.remove('loading'); ov.classList.add('reviewed');
                    if (ai && ai.title) {
                        $('pd-result').innerHTML = '<div class="pd-title"></div>' +
                            (window.PhotoLayer && PhotoLayer.renderFacts ? PhotoLayer.renderFacts(ai.text) : '');
                        $('pd-result').querySelector('.pd-title').textContent = ai.title;
                        $('pd-keep').onclick = () => finish({ action: 'keep', ai: ai }); // ✓ → keep WITH the AI result
                    } else {
                        $('pd-result').innerHTML = '<div class="pd-wait">KI-Erkennung fehlgeschlagen.</div>';
                        $('pd-keep').onclick = () => finish({ action: 'keep', ai: null }); // ✓ → keep without AI
                    }
                };
            });
        }

        async function capturePhoto() {
            if (useNativeCam) {
                // Capture at full resolution and ALSO save the original to the Photos gallery;
                // then return a downscaled (~1024 px) copy for the track/Supabase waypoint.
                const photo = await NativeCam.getPhoto({
                    resultType: 'dataUrl', source: 'CAMERA',
                    quality: 90, correctOrientation: true, saveToGallery: true,
                });
                if (!(photo && photo.dataUrl)) return null;
                return await downscaleSrcToJpeg(photo.dataUrl, 1024, 0.7);
            }
            // web: trigger the hidden file input and resolve once a file is picked
            return new Promise((resolve) => {
                const onChange = async () => {
                    camInput.removeEventListener('change', onChange);
                    const file = camInput.files && camInput.files[0];
                    if (!file) return resolve(null);
                    try { resolve(await downscaleToJpeg(file, 1024, 0.7)); }
                    catch (e) { toast('Foto konnte nicht gelesen werden.'); resolve(null); }
                };
                camInput.value = '';
                camInput.addEventListener('change', onChange);
                camInput.click();
            });
        }

        // Drop the pin at `ll`. `ai` = {title,text} from the in-overlay KI run, or null (keep, no AI).
        // The AI already ran in the decision overlay → here we just commit the chosen result.
        async function addPhotoAt(img, ll, ai) {
            const wp = addWaypoint({ lat: ll[0], lng: ll[1], t: new Date().toISOString(), img, title: ai ? ai.title : 'Foto', text: ai ? ai.text : '' });
            toast(ai ? wp.title : 'Foto übernommen.');
            refreshWaypoint(wp);                       // pin shows immediately from the base64
            await finalizePhoto(wp);                   // swap wp.img → R2 URL (failure keeps base64, offline-resilient)
            // persist + broadcast AFTER the swap so the DB row and the LIVE message carry the small URL
            if (typeof TrackBuffer !== 'undefined') TrackBuffer.saveNow(bufferSnapshot());
            doSync(); // push the photo to the cloud NOW — don't wait for the next GPS point
            addLivePhoto(wp); // push the thumbnail (+ AI title/text) over the live channel
        }

        // New "one-point track" mode: a geotagged photo taken WITHOUT an active recording.
        // Saved as its own track (1 point + 1 photo waypoint) so it shows up in the list.
        async function saveOnePointTrack(name, ll, wp) {
            const c = await ensureSb();
            const { error } = await c.from('tracks').insert({
                name: name,
                distance_m: 0,
                points: [[ll[0], ll[1], wp.t, null, null]],
                waypoints: [wpSer(wp)],
            });
            if (error) throw error;
        }
        async function addPhotoPoint(img, ll, ai) {
            const wp = addWaypoint({ lat: ll[0], lng: ll[1], t: new Date().toISOString(), img, title: ai ? ai.title : 'Foto', text: ai ? ai.text : '' });
            toast(ai ? wp.title : 'Foto übernommen.');
            refreshWaypoint(wp);
            await finalizePhoto(wp); // R2 BEFORE the insert → the saved row carries the URL; on failure keep base64 and still save
            const valid = ai && wp.title && wp.title !== PENDING_TITLE && wp.title !== FAIL_TITLE;
            const name = valid ? wp.title : ('Foto ' + new Date().toLocaleString('de-DE'));
            try { await saveOnePointTrack(name, ll, wp); toast('Gespeichert: ' + name); }
            catch (e) { toast('Speichern fehlgeschlagen: ' + (e.message || e)); }
            // isolate from any later live-tracking session (the map pin stays visible)
            T.waypoints = T.waypoints.filter(x => x !== wp);
        }

        // ---- "Nachbrennen": re-run the AI identification for photos whose recognition
        //      failed or never finished. The image is always kept on the waypoint, so we
        //      just re-send it — now via the retry-enabled Edge Function. ----
        function wpNeedsId(wp) {
            if (!wp.title || wp.title === PENDING_TITLE || wp.title === FAIL_TITLE) return true;
            // Re-run anything NOT in the current clean format. Stale markers from earlier
            // generations: the "(Quelle: …)" stamp (oldest), the 🌿/✨ emoji pins, and the
            // dropped agreement verdict (— stimmt zu / — andere Einschätzung). The current
            // format ("PlantNet:" / "Google Gemini:" + value) carries none of these → done.
            if (wp.text && /\(Quelle:|🌿|✨|— stimmt zu|— andere Einschätzung/.test(wp.text)) return true;
            return false;
        }
        // Grey out "Fotos analysieren" when there is nothing left to (re-)identify.
        function updateReburnButton() {
            const btn = $('set-reburn');
            if (!btn) return;
            const none = T.waypoints.filter(wpNeedsId).length === 0;
            btn.disabled = none;
            btn.style.opacity = none ? '0.4' : '';
            btn.style.cursor = none ? 'default' : '';
        }
        async function persistReburn() {
            // A loaded/saved track has a DB row to update; a live recording is persisted by
            // the auto-save on STOP. Returns true if a row was actually written
            // (0 rows ⇒ the UPDATE RLS policy on `tracks` is still missing).
            if (T.currentTrackId == null) return false;
            const c = await ensureSb();
            const wps = T.waypoints.map(wpSer);
            const { data, error } = await c.from('tracks').update({ waypoints: wps }).eq('id', T.currentTrackId).select('id');
            if (error) throw error;
            return !!(data && data.length);
        }
        async function reburnTrack() {
            const todo = T.waypoints.filter(wpNeedsId);
            if (!todo.length) { toast('Nichts zu analysieren — alle Fotos sind erkannt.'); return; }
            DebugWindow.log('▶ ANALYSIEREN: ' + todo.length + ' offene Fotos (currentTrackId=' + T.currentTrackId + ')');
            // Light pacing only — paid tier allows ~1000/min, so this is no longer a quota
            // guard. The Edge Function still backstops with Gemini's "retry in Xs" hint.
            const RPM_GAP_MS = 300;
            let done = 0, ok = 0;
            for (let idx = 0; idx < todo.length; idx++) {
                const wp = todo[idx];
                done++;
                toast('Analysiere … ' + done + '/' + todo.length);
                // R2-hosted photos: fetch the bytes back to a data-URL for Gemini (identify slices off
                // the base64). On a fetch failure, SKIP without overwriting the existing title.
                let src = wp.img;
                if (/^https?:/.test(src)) {
                    try { src = await blobToDataUrl(await (await fetch(src)).blob()); }
                    catch (fe) { DebugWindow.log('Reburn-Fetch übersprungen: ' + (fe.message || fe)); continue; }
                }
                wp.title = PENDING_TITLE; wp.text = ''; refreshWaypoint(wp);
                try {
                    const r = await identifyPhoto(src, wp.lat, wp.lng);
                    wp.title = r.title; wp.text = r.text; ok++;
                } catch (e) {
                    wp.title = FAIL_TITLE; wp.text = (e.message || '') + ' — Foto bleibt am Track.';
                    // 429 = Gemini-Kontingent erschöpft → der Rest würde genauso scheitern.
                    // Batch abbrechen statt minutenlang gegen die Wand zu laufen.
                    if (/\b429\b/.test(e.message || '')) {
                        refreshWaypoint(wp);
                        DebugWindow.log('⛔ 429 (Quota erschöpft) — Batch abgebrochen bei ' + done + '/' + todo.length);
                        toast('Gemini-Limit erreicht — Rest abgebrochen, später nochmal.');
                        break;
                    }
                }
                refreshWaypoint(wp);
                if (idx < todo.length - 1) await new Promise(res => setTimeout(res, RPM_GAP_MS));
            }
            let persisted = false;
            try { persisted = await persistReburn(); }
            catch (e) { toast('Zurückschreiben fehlgeschlagen: ' + (e.message || e)); }
            if (T.currentTrackId != null && !persisted) {
                toast(ok + '/' + todo.length + ' erkannt — aber NICHT gespeichert (UPDATE-Policy fehlt).');
            } else {
                toast(ok + '/' + todo.length + ' analysiert' + (T.currentTrackId != null ? ' & gespeichert.' : '.'));
            }
        }

        $('cam-fab').addEventListener('click', async () => {
            if (!currentLatLng()) { toast('Noch keine Position — kurz auf GPS warten.'); return; }
            let img;
            try { img = await capturePhoto(); }
            catch (e) { toast('Kamera nicht verfügbar: ' + (e.message || e)); return; }
            if (!img) return; // cancelled
            const ll = currentLatLng();
            if (!ll) { toast('Position verloren — nochmal versuchen.'); return; }
            // In-app step: KI (KI-Vorschau, dann entscheiden) · ✓ (übernehmen ohne KI) · ✗ (verwerfen)
            const res = await decidePhoto(img, ll);
            if (!res || res.action === 'discard') return;
            if (T.tracking) await addPhotoAt(img, ll, res.ai);   // pin on the active track
            else await addPhotoPoint(img, ll, res.ai);          // idle → standalone one-point track
        });

        // Drop a VOICE waypoint at `ll`: a short recorded note pinned on the ACTIVE track.
        async function addVoiceAt(rec, ll) {
            const wp = addWaypoint({ type: 'voice', lat: ll[0], lng: ll[1], t: new Date().toISOString(),
                audio: rec.dataUrl, dur: rec.dur, mime: rec.mime, title: 'Sprachnotiz', text: '' });
            refreshWaypoint(wp);
            await finalizeVoice(wp, rec); // swap wp.audio → R2 URL (failure keeps base64, offline-resilient)
            if (typeof TrackBuffer !== 'undefined') TrackBuffer.saveNow(bufferSnapshot()); // persist the URL now
            doSync();                 // push to the cloud now — you stand still to record
            toast('Sprachnotiz · ' + rec.dur.toFixed(1) + 's');
        }
        // IDLE (not tracking): save the voice note as its own one-point track, like a one-point photo.
        async function addVoicePoint(rec, ll) {
            const wp = addWaypoint({ type: 'voice', lat: ll[0], lng: ll[1], t: new Date().toISOString(),
                audio: rec.dataUrl, dur: rec.dur, mime: rec.mime, title: 'Sprachnotiz', text: '' });
            refreshWaypoint(wp);
            await finalizeVoice(wp, rec); // R2 BEFORE the insert → the saved row carries the URL; on failure keep base64 and still save
            const name = 'Sprachnotiz ' + new Date().toLocaleString('de-DE');
            try { await saveOnePointTrack(name, ll, wp); toast('Gespeichert: Sprachnotiz'); }
            catch (e) { toast('Speichern fehlgeschlagen: ' + (e.message || e)); }
            T.waypoints = T.waypoints.filter(x => x !== wp); // isolate from any later tracking session
        }

        // ---- Mic FAB → Voice-Spur: tap to start, tap to stop → pin a voice note (cap 60 s) ----
        (function () {
            const micFab = $('mic-fab'), micTimer = $('mic-timer');
            if (!micFab) return;
            const MAX_MS = 60000; // cap a note at 60 s (keeps the R2 upload + offline base64 fallback reasonable)
            let timerIv = null, autoStop = null, busy = false;
            const fmt = (ms) => { const s = Math.floor(ms / 1000); return '● ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
            const tick = () => { micTimer.textContent = fmt(Math.min(VoiceNote.elapsedMs(), MAX_MS)); };
            function startUI() {
                micFab.classList.add('recording');
                micTimer.classList.add('show'); tick();
                timerIv = setInterval(tick, 250);
                autoStop = setTimeout(finish, MAX_MS); // hard stop at the cap
            }
            function stopUI() {
                micFab.classList.remove('recording');
                micTimer.classList.remove('show');
                if (timerIv) { clearInterval(timerIv); timerIv = null; }
                if (autoStop) { clearTimeout(autoStop); autoStop = null; }
            }
            async function finish() {
                if (!VoiceNote.isRecording()) return;
                stopUI();
                let rec;
                try { rec = await VoiceNote.stop(); }
                catch (e) { toast('Aufnahme-Fehler: ' + (e.message || e)); return; }
                if (!rec || rec.dur < 0.4) { toast('Zu kurz — verworfen.'); return; }
                const ll = currentLatLng();
                if (!ll) { toast('Position verloren — Notiz verworfen.'); return; }
                if (T.tracking) await addVoiceAt(rec, ll);
                else await addVoicePoint(rec, ll);
            }
            micFab.addEventListener('click', async () => {
                if (busy) return;
                if (VoiceNote.isRecording()) { await finish(); return; }
                if (!currentLatLng()) { toast('Noch keine Position — kurz auf GPS warten.'); return; }
                if (!VoiceNote.isSupported()) { toast('Audio-Aufnahme hier nicht verfügbar.'); return; }
                busy = true;
                try { await VoiceNote.start(); startUI(); }
                catch (e) { toast('Mikrofon nicht verfügbar: ' + (e.message || e)); }
                finally { busy = false; }
            });
        })();

        // ---- Video-Spur: tap the video FAB → native camera in video mode (file input) → a clip pinned
        //      on the track. The clip is uploaded to the media store (Cloudflare R2) via uploadMedia →
        //      wp.video = public URL. If the store isn't ready / offline, the local object-URL stays for
        //      this session (preview) and nothing huge is persisted — never block, never lose the take. ----
        // ONE persistent change-listener + ONE pending resolver. A cancelled file dialog fires NO
        // `change`, so a per-call listener would leak and every accumulated one would fire on the next
        // real pick → duplicate pins (Doc: "3× abgebrochen → 4× Video"). A fresh capture cancels the
        // stale resolver (null) so only the LATEST pick ever produces a clip.
        let vidResolve = null;
        if (vidInput) vidInput.addEventListener('change', () => {
            const r = vidResolve; vidResolve = null;
            if (r) r((vidInput.files && vidInput.files[0]) || null);
        });
        function captureVideo() {
            return new Promise((resolve) => {
                if (!vidInput) return resolve(null);
                if (vidResolve) { const old = vidResolve; vidResolve = null; old(null); } // drop a stale pending capture
                vidResolve = resolve;
                vidInput.value = '';
                vidInput.click();
            });
        }
        // Upload the clip; on success swap the local blob-URL for the public URL + persist. On failure
        // keep the local preview this session (store not ready / offline). Returns true on real upload.
        async function finalizeVideo(wp, file) {
            if (typeof uploadMedia !== 'function') { toast('Video lokal — Upload-Modul fehlt.'); return false; }
            try {
                const { authToken, ownerId } = await mediaAuth();
                const up = await uploadMedia(file, 'video', { authToken, ownerId });
                try { URL.revokeObjectURL(wp.video); } catch (_) {}
                wp.video = up.url; wp.mime = up.mime || wp.mime; delete wp._pending; delete wp._blob;
                refreshWaypoint(wp);
                if (typeof TrackBuffer !== 'undefined') TrackBuffer.saveNow(bufferSnapshot());
                doSync();
                toast('Video hochgeladen.');
                return true;
            } catch (e) {
                if (typeof DebugWindow !== 'undefined') DebugWindow.log('Video-Upload (noch) nicht möglich: ' + (e.message || e));
                toast('Video lokal — Upload folgt, sobald der Storage steht.');
                return false;
            }
        }
        // ---- Photo / voice → R2 (mirror the video path). The base64 stays in wp.img/wp.audio as the
        //      offline fallback; on a successful upload it is swapped for the public URL so the DB row
        //      and the LIVE message shrink. On failure the base64 stays → a photo/note is never lost. ----
        async function mediaAuth() {
            // signed-in user's token (gated media-sign verifies it) + id (namespaces the R2 key);
            // anon when not signed in → gated fn rejects → caller keeps base64 (offline-resilient)
            let authToken, ownerId = 'anon';
            try {
                const { data: { session } } = await (await ensureSb()).auth.getSession();
                if (session) {
                    if (session.access_token) authToken = session.access_token;
                    if (session.user && session.user.id) ownerId = session.user.id;
                }
            } catch (_) { /* not signed in → anon */ }
            return { authToken, ownerId };
        }
        // Upload a captured photo's bytes to R2; on success wp.img becomes the public URL. Identify
        // already ran on the in-memory base64 in decidePhoto, so it is unaffected. The `^data:` guard
        // makes it idempotent (a loaded URL track passes straight through).
        async function finalizePhoto(wp) {
            if (typeof uploadMedia !== 'function' || typeof dataUrlToBlob !== 'function') return false;
            if (!/^data:/.test(wp.img || '')) return true; // already a URL → nothing to do
            try {
                const { authToken, ownerId } = await mediaAuth();
                const up = await uploadMedia(dataUrlToBlob(wp.img), 'photo', { authToken, ownerId });
                wp.img = up.url; // base64 dropped → row + broadcast shrink
                return true;
            } catch (e) {
                if (typeof DebugWindow !== 'undefined') DebugWindow.log('Foto-Upload (noch) nicht möglich: ' + (e.message || e));
                return false; // keep wp.img = base64 — never lose the photo
            }
        }
        // Upload a voice note's bytes to R2; on success wp.audio becomes the public URL. Browser path
        // has rec.blob; the native path (rec.blob === null) falls back to dataUrlToBlob(wp.audio).
        async function finalizeVoice(wp, rec) {
            if (typeof uploadMedia !== 'function') return false;
            if (!/^data:/.test(wp.audio || '')) return true; // already a URL (or empty) → nothing to do
            try {
                const blob = (rec && rec.blob) || (typeof dataUrlToBlob === 'function' ? dataUrlToBlob(wp.audio) : null);
                if (!blob) return false;
                const { authToken, ownerId } = await mediaAuth();
                const up = await uploadMedia(blob, 'voice', { authToken, ownerId });
                wp.audio = up.url;
                return true;
            } catch (e) {
                if (typeof DebugWindow !== 'undefined') DebugWindow.log('Sprachnotiz-Upload (noch) nicht möglich: ' + (e.message || e));
                return false; // keep wp.audio = base64 — never lose the note
            }
        }
        function newVideoWp(file, ll) {
            return addWaypoint({
                type: 'video', lat: ll[0], lng: ll[1], t: new Date().toISOString(),
                video: URL.createObjectURL(file), mime: file.type || 'video/mp4',
                title: 'Video', text: '', _pending: true, _blob: file,
            });
        }
        async function addVideoAt(file, ll) {   // on the ACTIVE track
            const wp = newVideoWp(file, ll);
            refreshWaypoint(wp);
            const mb = file.size ? (Math.round(file.size / 1e5) / 10) + ' MB' : '';
            toast('Video aufgenommen' + (mb ? ' · ' + mb : ''));
            await finalizeVideo(wp, file);
        }
        async function addVideoPoint(file, ll) { // IDLE → standalone one-point track (like a one-point photo)
            const wp = newVideoWp(file, ll);
            refreshWaypoint(wp);
            const ok = await finalizeVideo(wp, file);
            if (!ok) return; // not uploaded → keep the session preview, don't persist a dead blob URL
            const name = 'Video ' + new Date().toLocaleString('de-DE');
            try { await saveOnePointTrack(name, ll, wp); toast('Gespeichert: ' + name); }
            catch (e) { toast('Speichern fehlgeschlagen: ' + (e.message || e)); }
            T.waypoints = T.waypoints.filter(x => x !== wp); // isolate from any later tracking session
        }
        (function () {
            const vidFab = $('vid-fab');
            if (!vidFab) return;
            vidFab.addEventListener('click', async () => {
                if (!currentLatLng()) { toast('Noch keine Position — kurz auf GPS warten.'); return; }
                let file;
                try { file = await captureVideo(); }
                catch (e) { toast('Kamera nicht verfügbar: ' + (e.message || e)); return; }
                if (!file) return; // cancelled
                const ll = currentLatLng();
                if (!ll) { toast('Position verloren — nochmal versuchen.'); return; }
                if (T.tracking) await addVideoAt(file, ll);
                else await addVideoPoint(file, ll);
            });
        })();

        // ---- Auto-hide the floating controls (HH + camera + mic + video), the top data header and
        //      the START/STOP control bar after 8 s of no interaction; any tap / move / click / key
        //      just brings them back (nothing else). Stays put while recording a voice note or while
        //      the radial popup is open (so Stop / the menu stay reachable). ----
        (function () {
            const IDLE_MS = 8000;
            let idleTimer = null;
            function popupOpen() { const m = $('mini-stack'); return !!(m && m.classList.contains('popup')); }
            function hide() {
                // never fade while you're mid-recording or the menu is fanned out
                if ((window.VoiceNote && VoiceNote.isRecording()) || popupOpen()) { schedule(); return; }
                document.body.classList.add('ui-idle');
            }
            function schedule() {
                if (idleTimer) clearTimeout(idleTimer);
                idleTimer = setTimeout(hide, IDLE_MS);
            }
            function wake() {
                if (document.body.classList.contains('ui-idle')) document.body.classList.remove('ui-idle');
                schedule();
            }
            ['pointerdown', 'pointermove', 'wheel', 'keydown'].forEach(
                (ev) => document.addEventListener(ev, wake, { passive: true })
            );
            schedule(); // start the 8 s countdown
        })();


    return { loadUsage, addWaypoint, clearWaypoints, updateReburnButton, reburnTrack };
};
