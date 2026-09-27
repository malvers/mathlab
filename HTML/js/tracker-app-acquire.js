// Doc Alvers Tracker - part 8 of 13: acquiring a position, re-fit after fullscreen.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---------------------------------------------------------------
        // Acquire a position: snap there at once, then keep refining until the
        // accuracy is good (or a timeout hits) — only then reveal the red dot.
        // ---------------------------------------------------------------
        function goToCurrentPosition(opts) {
            opts = opts || {};
            if (!('geolocation' in navigator)) {
                setStatus('Dieser Browser unterstützt keine Standortbestimmung.');
                return;
            }
            if (!window.isSecureContext) {
                setStatus('GPS braucht HTTPS oder localhost. Über file:// gibt es keine Position.');
                return;
            }
            if (acquireWatch != null) navigator.geolocation.clearWatch(acquireWatch);

            const GOOD_ACC = 15;       // metres: a great fix → settle at once
            const STABLE_MS = 3000;    // ms: accuracy stopped improving this long → settle at best
            const MAX_WAIT = 15000;    // ms: reveal anyway after this long
            const startedAt = Date.now();
            let best = null;
            let lastImproved = startedAt;
            let centred = false;

            setStatus('Warte auf bessere Positionsdaten …');

            function reveal() {
                if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
                if (!best) return;
                showDot();
                setStatus(`Position gefunden (±${Math.round(best.accuracy)} m).`);
            }

            acquireWatch = navigator.geolocation.watchPosition(
                pos => {
                    const here = [pos.coords.latitude, pos.coords.longitude];
                    const acc = pos.coords.accuracy != null ? pos.coords.accuracy : Infinity;
                    const now = Date.now();
                    // count it as progress only if accuracy drops meaningfully (ignore jitter)
                    if (!best || acc < best.accuracy - 0.5) { best = { here, accuracy: acc }; lastImproved = now; }

                    renderPosition(best.here, best.accuracy); // moves the still-hidden dot + accuracy readout

                    if (!centred) {
                        centred = true; // go to the position immediately on the first fix …
                        // … but NOT on start-up if we restored a saved viewport (keep where the user was).
                        if (opts.initial) { if (!viewRestored) map.setView(best.here, 16); }
                        else map.flyTo(best.here, Math.max(map.getZoom(), 16), { duration: 1.2 });
                    } else if (!(opts.initial && viewRestored)) {
                        map.panTo(best.here, { animate: true });
                    }

                    // settle once it is great, once it stops improving, or after the hard cap
                    const settle = best.accuracy <= GOOD_ACC
                        || (now - lastImproved) >= STABLE_MS
                        || (now - startedAt) > MAX_WAIT;
                    if (settle) reveal();
                    else setStatus(`Warte auf bessere Positionsdaten … (±${Math.round(best.accuracy)} m)`);
                },
                onError,
                { enableHighAccuracy: true, maximumAge: 0, timeout: 12000 }
            );

            // safety net: reveal the best fix even if updates stop coming
            setTimeout(() => { if (acquireWatch != null) reveal(); }, MAX_WAIT + 500);
        }

        function centerOnPosition() {
            cancelNavOverview(); // manual re-centre supersedes any pending auto-glide
            stopDotGlide();     // drop any in-flight smooth-follow glide → the flyTo owns the camera now
            clearHandMode();    // CENTER explicitly takes over → leave hand-mode (hide the resume arrow)
            autoZoomHold = false; // explicit "resume auto" → hand the zoom back to speed-driven auto-follow
            fitMode = false;    // centring on the dot is the opposite of "keep the whole track fitted"
            setFollowing(true); // re-enable auto-follow (and hide the recenter button)
            // Already have a position → glide there smoothly
            if (posMarker) {
                if (window.DebugWindow) DebugWindow.log('centerOnPosition: flyTo dot, zoom ' + Math.max(map.getZoom(), 16));
                map.flyTo(posMarker.getLatLng(), Math.max(map.getZoom(), 16), { duration: 1.2 });
                showDot();
                return;
            }
            if (window.DebugWindow) DebugWindow.log('centerOnPosition: no posMarker → goToCurrentPosition');
            goToCurrentPosition({ initial: false });
        }

        async function clearTrack(silent) {
            // Guard against losing a recording by accident (silent skips the confirm). Note: the
            // only caller passes silent=true → the await is never reached there, so it stays sync.
            if (!silent && track.length && !(await uiConfirm('Aktuellen Track wirklich löschen?', { danger: true, okText: 'Löschen' }))) return;
            if (typeof TrackBuffer !== 'undefined') TrackBuffer.clear();
            clearLoaded(); // a cleared/discarded track must not be restored on the next reload
            clearLiveTail(); lastDrawnIdx = 0; // drop the live bridge segment with the track
            track = [];
            loadedBounds = null; // no multi-loaded overlay anymore → FIT hides
            times = [];
            alts = [];
            speeds = [];
            activities = [];
            temps = [];
            totalDist = 0;
            lastFix = null;
            resetDem();
            trackLayer.clearLayers();
            clearWaypoints();
            setDist(0);
            setSpeed(0);
            setAlt(null);
            if (!tracking) { CyberClock.set(elTime, '00:00:00'); startTime = null; }
            if (!silent) toast('Track gelöscht.'); // silent clears (START / restore) shouldn't toast
        }

        // ---------------------------------------------------------------
        // Export as GPX (the standard GPS exchange format)
        // ---------------------------------------------------------------
        function buildGpx() {
            const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const name = 'Doc Alvers Tracker ' + (times[0] || '');
            const A = effectiveAlts(); // DEM-corrected when the DEM toggle is on, else raw GPS+baro
            const pts = track.map((p, i) =>
                `      <trkpt lat="${p[0].toFixed(7)}" lon="${p[1].toFixed(7)}">` +
                (A[i] != null ? `<ele>${A[i].toFixed(1)}</ele>` : '') +
                (times[i] ? `<time>${times[i]}</time>` : '') +
                `</trkpt>`
            ).join('\n');
            // Photo waypoints → standard <wpt> (must precede <trk> per the GPX schema)
            const wpts = waypoints.map(w =>
                `  <wpt lat="${w.lat.toFixed(7)}" lon="${w.lng.toFixed(7)}">` +
                (w.t ? `<time>${w.t}</time>` : '') +
                `<name>${esc(w.title || 'Foto')}</name>` +
                (w.text ? `<desc>${esc(w.text)}</desc>` : '') +
                `</wpt>`
            ).join('\n');
            return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Doc Alvers Mathe-Labor" xmlns="http://www.topografix.com/GPX/1/1">
${wpts}
  <trk>
    <name>${esc(name)}</name>
    <trkseg>
${pts}
    </trkseg>
  </trk>
</gpx>`;
        }

        function exportGpx() {
            if (track.length < 2) { toast('Kein Track zum Exportieren.'); return; }
            const blob = new Blob([buildGpx()], { type: 'application/gpx+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `track-${new Date().toISOString().replace(/[:.]/g, '-')}.gpx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast('GPX exportiert (' + track.length + ' Punkte).');
        }

        // ---------------------------------------------------------------
        // Double-tap the clock → toggle fullscreen
        // ---------------------------------------------------------------
        function toggleFullscreen() {
            const d = document;
            const inFs = d.fullscreenElement || d.webkitFullscreenElement;
            if (!inFs) {
                const el = d.documentElement;
                const req = el.requestFullscreen || el.webkitRequestFullscreen;
                if (req) req.call(el);
            } else {
                const exit = d.exitFullscreen || d.webkitExitFullscreen;
                if (exit) exit.call(d);
            }
        }

        let lastTapTime = 0;
        elTime.addEventListener('click', (e) => {
            e.stopPropagation(); // don't let the tap leak to the map underneath
            const now = Date.now();
            if (now - lastTapTime < 350) { toggleFullscreen(); lastTapTime = 0; } // second tap
            else lastTapTime = now;
        });

        // Re-fit the map after the viewport changes size on enter/leave fullscreen
        document.addEventListener('fullscreenchange', () => setTimeout(init, 120));
        document.addEventListener('webkitfullscreenchange', () => setTimeout(init, 120));

        // ===============================================================
        // Supabase — same project as VGP. The publishable key is public by
        // design; Row-Level-Security keeps each device's tracks private to
        // its anonymous auth.uid().
        // ===============================================================
        const SUPABASE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';
        let sb = null;

        // --- Sync-Code: a shared passphrase maps to ONE deterministic account, so several
        //     devices with the same code share their tracks. No code → anonymous (private). ---
        const SYNC_KEY = 'tracker.syncCode';
        function getSyncCode() { return localStorage.getItem(SYNC_KEY) || ''; }

        const EUR_PER_PHOTO = 0.0005; // ~0,05 ct per Gemini identification (Pl@ntNet is free)

        async function sha256hex(s) {
            const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
            return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
        }
        async function syncCreds(code) {
            const h = await sha256hex(code);
            // docalvers.de has valid MX → Supabase accepts the address (no mail is sent while
            // "Confirm email" is off). Local part is derived from the code.
            return { email: 't-' + h.slice(0, 32) + '@docalvers.de', password: 'p-' + code };
        }
        async function signInWithCode(code) {
            const { email, password } = await syncCreds(code);
            const first = await sb.auth.signInWithPassword({ email, password });
            if (first.error) {
                await sb.auth.signUp({ email, password }); // first device with this code → create it
                const re = await sb.auth.signInWithPassword({ email, password });
                if (re.error) throw new Error('Sync-Login fehlgeschlagen — „Confirm email" im Dashboard aus? (' + re.error.message + ')');
            }
        }

        async function ensureSb() {
            // Self-hosted lib loads same-origin before this runs; if it's still settling, wait briefly
            // (≤2 s) instead of hard-failing — robust on slow devices / first paint.
            for (let i = 0; i < 20 && !window.supabase; i++) await new Promise((r) => setTimeout(r, 100));
            if (!window.supabase) throw new Error('Supabase-Lib nicht geladen');
            // Route ALL Supabase REST/RPC/Edge traffic through the central circuit breaker (js/supa-gate.js)
            // so a 402 egress-lock / offline pauses every call in ONE place instead of hammering on.
            if (!sb) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY,
                window.SupaGate ? { global: { fetch: window.SupaGate.gatedFetch } } : undefined);
            const code = getSyncCode();
            const want = code ? (await syncCreds(code)).email : null; // null = anonymous identity
            const { data: { session } } = await sb.auth.getSession();
            const have = session && session.user ? (session.user.email || null) : undefined; // undefined = no session
            if (session && have === want) return sb; // already the right identity
            if (session) await sb.auth.signOut().catch(() => { });
            if (code) await signInWithCode(code);
            else {
                const { error } = await sb.auth.signInAnonymously();
                if (error) throw new Error('Anon-Login aus? ' + error.message);
            }
            return sb;
        }

        async function clearSyncCode() { localStorage.removeItem(SYNC_KEY); await ensureSb(); }

        // Connect to a code's shared account AND carry the current device's tracks over.
        // Crucial: read the current tracks BEFORE switching (switching signs the old session
        // out). Dedupe by name so re-connecting doesn't duplicate.
        async function connectSync(code) {
            await ensureSb();
            const { data: { session } } = await sb.auth.getSession();
            const have = session && session.user ? (session.user.email || null) : null;
            const want = (await syncCreds(code)).email;
            if (have === want) return -1; // already on this account
            const rows = (await sb.from('tracks').select('name, distance_m, points, waypoints')).data || [];
            await signInWithCode(code);           // create / sign into the account FIRST (throws on failure)
            localStorage.setItem(SYNC_KEY, code);  // persist the code ONLY after a successful login
            let n = 0;
            if (rows.length) {
                const known = new Set(((await sb.from('tracks').select('name')).data || []).map(r => r.name));
                const add = rows.filter(r => !known.has(r.name));
                if (add.length) {
                    const { error } = await sb.from('tracks')
                        .insert(add.map(r => ({ name: r.name, distance_m: r.distance_m, points: r.points, waypoints: r.waypoints })));
                    if (error) throw error;
                    n = add.length;
                }
            }
            return n;
        }

        // Save the current in-memory track. If a row already exists for this recording
        // (currentTrackId — set by the live autosync), UPDATE it instead of inserting a duplicate.
        // `status` ('recording' | 'done') hides in-progress tracks from the list; if that column
        // isn't migrated yet, we transparently retry without it (no regression to the old behaviour).
        async function saveTrack(name, status) {
            const c = await ensureSb();
            // [lat, lng, time, altitude(m), speed(km/h), activity] — alt/speed null when unknown
            const pts = track.map((p, i) => [p[0], p[1], times[i] || null, alts[i] != null ? alts[i] : null, speeds[i] != null ? speeds[i] : null, activities[i] || null, temps[i] != null ? temps[i] : null]);
            // strip the live Leaflet marker reference before persisting
            const wps = waypoints.map(w => wpSer(w, true)); // forSync → strip un-uploaded base64 (egress fix E)
            const row = { name: name, distance_m: Math.round(totalDist), points: pts, waypoints: wps, status: status || 'done' };
            const missingCol = e => e && /status/i.test(e.message || ''); // 'status' column not migrated yet
            if (currentTrackId) {                                          // UPDATE the existing (live-synced) row
                let { error } = await c.from('tracks').update(row).eq('id', currentTrackId);
                if (missingCol(error)) { const { status: _s, ...bare } = row; ({ error } = await c.from('tracks').update(bare).eq('id', currentTrackId)); }
                if (error) throw error;
                return currentTrackId;
            }
            let { data, error } = await c.from('tracks').insert(row).select('id').single();
            if (missingCol(error)) { const { status: _s, ...bare } = row; ({ data, error } = await c.from('tracks').insert(bare).select('id').single()); }
            if (error) throw error;
            currentTrackId = data ? data.id : null;
            return currentTrackId;
        }
