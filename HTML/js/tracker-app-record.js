// Doc Alvers Tracker - part 6 of 13: track lifecycle idle / recording / paused, idle live-follow.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---- Track lifecycle: idle → recording → paused → (finish) idle ----
        // Buttons: idle [START] · recording [STOP=pause] · paused [CONTINUE | STOP=finish+save].
        function setTrkState(s) {
            trkState = s;
            tracking = (s === 'recording');
            if (s !== 'recording' && _trackRedrawTimer) { clearTimeout(_trackRedrawTimer); _trackRedrawTimer = null; redrawTrack(); } // flush a pending live redraw → final track is complete at once
            if (s !== 'recording') clearLiveTail(); // pause/finish → no live bridge segment dangling off the dot
            updateDistVisibility(); // idle (& not navigating) → hide DISTANCE; recording/paused → show it
            const tg = $('trk-toggle'), fin = $('trk-finish'), disc = $('trk-discard');
            if (disc) disc.style.display = (s === 'paused') ? 'inline-flex' : 'none';
            if (s === 'idle') {
                tg.textContent = 'START'; tg.style.background = COL_GREEN; fin.style.display = 'none';
            } else if (s === 'recording') {
                tg.textContent = 'PAUSE'; tg.style.background = COL_RED; fin.style.display = 'none';
            } else { // paused → continue or save
                tg.textContent = 'CONTINUE'; tg.style.background = COL_GREEN; tg.style.color = '#fff';
                fin.textContent = 'SPEICHERN'; fin.style.background = 'rgb(245, 194, 66)'; fin.style.color = '#fff';
                fin.style.display = 'inline-flex';
            }
        }

        // Shared startup of the live watch + sensors (does NOT touch startTime → caller sets it).
        function startWatch() {
            stopAmbient(); // recording's own watch (onPosition) takes over the idle live-follow
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; }
            tracking = true;
            timerId = setInterval(updateDuration, 1000);
            watchId = startGeoWatch(onPosition, onError); // native background plugin if available, else web
            startGnss();     // native: real GnssStatus
            startActivity(); // native travel-mode detection
            enableMotion();  // accelerometer movement gate
            startBaro();     // native barometer → altitude
        }

        // ---- Idle live-follow ------------------------------------------------------------------
        // When NOT recording (and not navigating), keep a lightweight foreground position watch so the
        // dot tracks you and the map follows — like a maps app. Stops automatically while recording
        // (onPosition owns the watch then). Foreground only (navigator.geolocation, same as the initial
        // acquire) — NOT the background plugin, so there's no "Aufzeichnung läuft" notification when idle.
        const AMBIENT_PAN_M = 12; // only re-centre once the dot moved this far → no GPS-jitter jiggle
        // Idle ambient temperature → the freed DISTANCE tile shows the current °C while idle (Doc
        // 2026-06-19). Open-Meteo's keyless forecast API (same provider as the DEM elevation lookup),
        // throttled like the fuel layer (≥ 10 min OR ≥ 3 km moved) so it stays gentle. Offline / error
        // → keep the last value silently. Only fetched here in ambientOnPos, i.e. only while idle.
        const TEMP_REFRESH_MS = 600000; // 10 min
        const TEMP_REFRESH_M = 3000;    // or once we've moved 3 km
        let tempBusy = false, lastTempFetch = 0, lastTempLat = null, lastTempLng = null, lastTemp = null;
        // Road-wet state for the "bei Nässe" speed limit (maxspeed:conditional=… @ wet). Read for free from
        // the SAME Open-Meteo call that fetches the ambient temperature (one extra field). A road stays wet a
        // while after the rain stops, so we hold "wet" for WET_PERSIST_MS past the last precipitation reading.
        const WET_PERSIST_MS = 2 * 60 * 60 * 1000; // 2 h — roads dry slowly
        let ambientWet = false, lastWetMs = 0;
        async function updateAmbientTemp(here) {
            if (tempBusy || !here) return;
            const lat = here[0], lng = here[1];
            if (typeof lat !== 'number' || typeof lng !== 'number') return;
            const moved = (lastTempLat == null) ? Infinity : haversine([lastTempLat, lastTempLng], here);
            if (moved < TEMP_REFRESH_M && (Date.now() - lastTempFetch) < TEMP_REFRESH_MS) return;
            tempBusy = true;
            try {
                const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat.toFixed(4) +
                    '&longitude=' + lng.toFixed(4) + '&current=temperature_2m,precipitation';
                const r = await fetch(url);
                const d = await r.json().catch(() => null);
                const t = d && d.current && typeof d.current.temperature_2m === 'number' ? d.current.temperature_2m : null;
                if (t != null) {
                    lastTemp = t;                       // remembered for the recorded track (recordTrackPoint stamps each point)
                    if (!tracking) Hud.setTemp(t);      // show in the tile only while idle — while recording it holds the distance
                    lastTempFetch = Date.now(); lastTempLat = lat; lastTempLng = lng;
                }
                // Precipitation (mm in the current period) → road-wet state for the "bei Nässe" limit.
                const pr = d && d.current && typeof d.current.precipitation === 'number' ? d.current.precipitation : null;
                if (pr != null) {
                    if (pr > 0) lastWetMs = Date.now();
                    ambientWet = pr > 0 || (Date.now() - lastWetMs < WET_PERSIST_MS);
                }
            } catch (e) { /* offline / rate-limited → keep the last reading */ }
            finally { tempBusy = false; }
        }

        function ambientOnPos(pos) {
            if (!pos || !pos.coords || pos.coords.latitude == null) return;
            const here = [pos.coords.latitude, pos.coords.longitude];
            const now = Date.now();
            const accuracy = pos.coords.accuracy;
            const sp = pos.coords.speed;

            // Jitter guard, idle edition — the SAME movement gate the recording path uses (note the
            // accelerometer now also runs while idle, see startAmbient). A phone resting on a table
            // must NOT have its dot dance around: if the accelerometer says "still" (and GPS isn't
            // clearly moving), or the new fix sits inside the GPS error circle of the shown dot, we
            // HOLD the dot + skip the map pan. A real move (sensor energy, or a step beyond the band)
            // snaps straight through.
            const gpsKmh = (sp != null && sp >= 0) ? sp * 3.6 : null;
            const gpsMoving = gpsKmh != null && gpsKmh > SPEED_MOVE_KMH && (accuracy == null || accuracy <= MAX_ACC_M);
            const sensorStill = motionReady && motionStill && !gpsMoving;
            let posStill = false;
            if (posMarker) {
                const shown = posMarker.getLatLng();
                const band = Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR);
                posStill = haversine([shown.lat, shown.lng], here) <= band;
            }
            const firstFix = !posMarker;
            const still = (sensorStill || posStill) && !firstFix;

            // Live speedometer while idle: GPS Doppler (coords.speed) preferred — the velocity the
            // receiver measures directly. When the device gives NO Doppler, fall back to distance/time
            // EXACTLY like the recording path (computeAndDisplaySpeed): only when the movement gate says
            // we're moving (!still) AND the fix is accurate enough → a resting desk / coarse WLAN stays a
            // clean 0, but a moving car/phone without Doppler now shows its speed when idle too — i.e.
            // neither tracking nor navigating (Doc 2026-06-30). Same floor/EMA as the other paths.
            let kmh = 0;
            if (sp != null && sp >= 0) {
                kmh = sp * 3.6;                                  // GPS Doppler — preferred, independent of the gate
            } else if (!still && lastFix && (accuracy == null || accuracy <= MAX_ACC_M)) {
                const dt = (now - lastFix.t) / 1000;            // no Doppler → derive from distance/time (gated)
                if (dt > 0) kmh = (haversine([lastFix.lat, lastFix.lng], here) / dt) * 3.6;
            }
            // Do NOT zero on `still`: a clear Doppler reading IS real movement even when the dot sits
            // inside the accuracy band. At slow walking pace each step (~2 m/s) is shorter than the band,
            // so posStill stays true the whole time — gating speed on it read a steady 0 while walking
            // (Doc: 7,9 km/h → 0). `still` only holds the DOT steady (renderPosition / pan), not the readout.
            if (kmh > MAX_JUMP_KMH || kmh < SPEED_ZERO_KMH) kmh = 0; // nonsense / sub-walking floor → clean 0
            // Snap HARD to 0 when there's no movement — the EMA alone only decays (0.6·old) and gets
            // stuck around 0,1 km/h on WLAN/standstill (the irritating residual Doc saw). Smooth only
            // real motion upward.
            shownSpeed = (kmh === 0) ? 0 : (0.6 * shownSpeed + 0.4 * kmh);
            setSpeed(shownSpeed);
            // TEMP idle-gate diagnostics → existing #motion-dbg bar (Doc has DEBUG open). Shows whether
            // the accelerometer is live (STILL/MOVE + e=), the raw Doppler, and the gated speed.
            spdDbg = 'idle dop=' + (sp != null ? (sp * 3.6).toFixed(1) : 'null') + ' still=' + (still ? '1' : '0') + '→' + shownSpeed.toFixed(1);
            updateMotionDbg(accuracy, Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR), still);
            lastFix = { lat: here[0], lng: here[1], t: now };
            renderPosition(here, accuracy, still); // hold the dot steady when the gate says we stand
            showDot();
            if (liveOn) broadcastLive(); // Stage 3: also broadcast while idle → live WITHOUT recording (Doc 2026-07-08)
            // Idle altitude (no barometer here): show the DEM terrain height directly → no more „−".
            updateDemElev(here);
            updateAltitude(pos.coords.altitude != null ? pos.coords.altitude : null);
            updateAmbientTemp(here); // idle-only: current temperature in the (otherwise distance) tile
            if (__traffic) __traffic.update(here);   // live Autobahn traffic also while driving without recording
            if (__speed) __speed.update(here, still, shownSpeed); // speed-limit sign for the current road — also while idle (Doc 2026-06-30)
            if (__hazards) __hazards.update(here, shownSpeed); // point hazards ahead — also while idle
            if (__sun) __sun.update(here);                     // golden hour / sun position line — also while idle (FEAT-2)
            updateFuelLayer(here);                   // fuel-station prices also while idle (not only when recording) — Doc 2026-06-23
            if (acquireWatch != null) { navigator.geolocation.clearWatch(acquireWatch); acquireWatch = null; } // initial one-shot now redundant
            if (following && !handMode && !still) {
                const moved = map.distance(map.getCenter(), L.latLng(here));
                if (moved > AMBIENT_PAN_M) map.panTo(here, { animate: true });
            }
            refreshRecenter();
        }
        function startAmbient(keepFollow) {
            if (ambientId != null || watchId != null) return;     // already on, or recording owns the watch
            if (!('geolocation' in navigator)) return;
            if (!keepFollow) { following = true; refreshRecenter(); } // idle follows by default (Maps-style; CENTER/drag still toggle it)
            enableMotion();                                       // accelerometer also in idle → jitter guard works on the resting dot
            ambientId = navigator.geolocation.watchPosition(ambientOnPos, () => { },
                { enableHighAccuracy: true, maximumAge: 2000, timeout: 12000 });
        }
        function stopAmbient() {
            if (ambientId == null) return;
            try { navigator.geolocation.clearWatch(ambientId); } catch (e) { }
            ambientId = null;
        }
        // Battery: while IDLE (not recording/paused), the idle live-follow keeps a FULL-power GPS watch AND the
        // accelerometer running the whole time the app is open — and with nothing throttled on background, they
        // ran on with the screen off too, draining for nothing (you're not even recording). So pause both when
        // the page is hidden and re-arm on return. Recording/paused are untouched here: their own watch + the
        // native foreground service must keep going with the screen off. (Doc 2026-06-26)
        document.addEventListener('visibilitychange', () => {
            if (trkState !== 'idle') return;                      // recording/paused own the GPS → never touch it here
            if (document.hidden) { stopAmbient(); disableMotion(); }
            else { startAmbient(true); }                          // back in view → re-arm idle follow, keep the current follow state
        });

        // START (idle): a brand-new track. The previous (finished+saved) one is cleared from view.
        async function beginTracking() {
            if (!('geolocation' in navigator)) { setStatus('Dieser Browser unterstützt keine Standortbestimmung.'); return; }
            if (!window.isSecureContext) { setStatus('GPS braucht HTTPS oder localhost. Über file:// gibt es keine Position.'); return; }
            // A track is on screen (loaded or just finished) → don't wipe the VIEW without asking.
            // (It stays safe in the cloud / LADEN — START only clears the screen, it never deletes a row.)
            if (track.length && !(await uiConfirm('Neuen Track starten? Der angezeigte Track verschwindet nur aus der Ansicht und bleibt gespeichert.', { okText: 'Neu starten' }))) return;
            clearTrack(true); // silent — the displayed track was loaded/saved; START begins fresh
            currentTrackId = null; currentTrackName = autoTrackName(); // fresh live track; name from start (autosync + finish reuse it)
            startTime = Date.now();
            startWatch();
            $('hud-top').classList.add('shown'); // reveal the header on first start
            if (window.RainRadar && RainRadar.setShifted) RainRadar.setShifted(true); // drop the rain slider below the HUD
            setTrkState('recording');
            setStatus('Suche GPS-Signal …');
            if (__nav && __nav.hasDestination()) {
                // Navigation start: show the WHOLE route first (overview, like the framed map), hold it a
                // beat, THEN glide into the crosshair follow-view (centerOnPosition's flyTo = the fade).
                // following stays OFF during the hold so an incoming GPS fix can't yank the map off it.
                cancelNavOverview();
                fitMode = false;     // a leftover persistent FIT mode would re-fit every GPS fix → kill the glide
                setFollowing(false);
                if (window.DebugWindow) DebugWindow.log('NAV start: following→false, fitMode→false, computing route …');
                __nav.startNavigation().then(function (ok) {
                    if (window.DebugWindow) DebugWindow.log('NAV route resolved ok=' + ok);
                    if (ok === false) { setFollowing(true); return; }   // no route (e.g. offline) → just follow
                    const framed = __nav.frameRoute();                   // frame start → destination
                    if (window.DebugWindow) DebugWindow.log('NAV frameRoute=' + framed + ' → glide in ' + NAV_OVERVIEW_MS + 'ms');
                    navOverviewTimer = setTimeout(function () {
                        navOverviewTimer = null;
                        if (window.DebugWindow) DebugWindow.log('NAV glide fire: trkState=' + trkState + ' following=' + following);
                        if (trkState !== 'recording' || following) return;   // stopped, or user took over during the hold
                        // Dynamic route framing (Doc 2026-06-20, BUG-10): keep the REMAINING route in view and
                        // re-fit it as it shrinks, instead of a one-shot crosshair glide that never re-frames.
                        // From here the fitMode==='remaining' loop in onSuccess owns the camera (re-fit + zoom).
                        const ll = posMarker && posMarker.getLatLng && posMarker.getLatLng();
                        const rb = (ll && __nav && __nav.remainingBounds) ? __nav.remainingBounds([ll.lat, ll.lng]) : null;
                        if (rb) {
                            fitMode = 'remaining'; setFollowing(false);
                            try { map.fitBounds(rb, { padding: fitPad(), animate: true, duration: 0.8 }); } catch (e) { }
                            refreshRecenter();
                            if (window.DebugWindow) DebugWindow.log('NAV → dynamic remaining-route fit');
                        } else {
                            centerOnPosition();   // no route geometry yet → fall back to the crosshair follow
                        }
                    }, NAV_OVERVIEW_MS);
                });
            } else {
                // No navigation → follow the moving position right away. Otherwise a restored viewport
                // (or a left-over hand-set view) leaves the GPS dot un-followed while you drive.
                centerOnPosition();
            }
        }

        // STOP while recording → pause (keep all data, freeze the timer).
        function pauseTracking() {
            cancelNavOverview(); // stopped during the route-overview hold → don't auto-glide afterwards
            pauseStart = Date.now();
            stopGeoWatch(watchId); watchId = null;
            stopActivity(); disableMotion(); stopBaro();
            if (timerId) clearInterval(timerId); timerId = null;
            setTrkState('paused');
            if (typeof TrackBuffer !== 'undefined') TrackBuffer.saveNow(bufferSnapshot());
            doSync(); // Stage 2: flush to the cloud on pause
            setStatus(track.length ? `Pausiert · ${(totalDist / 1000).toFixed(2)} km` : 'Pausiert.');
            startAmbient(); // paused → resume idle live-follow so the dot keeps tracking you
        }

        // CONTINUE → resume the same track (don't count the pause as elapsed track time).
        function resumeTracking() {
            startTime += (Date.now() - pauseStart);
            startWatch();
            setTrkState('recording');
            setStatus('Aufzeichnung läuft …');
        }

        // STOP while paused → finish: auto-save the track, back to idle. Track stays drawn.
        async function finishTracking() {
            setTrkState('idle');
            startAmbient(); // back to idle → resume idle live-follow
            stopLive(true);
            if (__nav) __nav.clearRoute(); // STOP also clears the navigation route + destination pin
            if (__speed) __speed.clear();  // …and the speed-limit sign
            if (track.length >= 1) {
                const name = currentTrackName || autoTrackName();
                currentTrackName = name;
                toast('Speichere …');
                try {
                    currentTrackId = await saveTrack(name, 'done');   // proven online happy path (unchanged)
                    if (typeof TrackBuffer !== 'undefined') await TrackBuffer.clear();
                    refreshOutboxCount();
                    toast('Gespeichert: ' + name);
                } catch (e) {
                    // Save failed (offline / breaker-open). Put the finished track in the DURABLE multi-slot
                    // outbox — the next recording can no longer clobber it — then free the single live buffer.
                    // The auto-retry uploader lifts it to the cloud as soon as the network returns.
                    const entry = { id: currentTrackId || genLocalId(), snapshot: bufferSnapshot(), queuedAt: Date.now() };
                    try { if (typeof TrackBuffer !== 'undefined' && TrackBuffer.outbox) await TrackBuffer.outbox.put(entry); } catch (_) { }
                    if (typeof TrackBuffer !== 'undefined') await TrackBuffer.clear();
                    refreshOutboxCount();
                    scheduleFlush(4000);
                    toast('Offline gesichert – lädt automatisch hoch, sobald Netz da ist.');
                }
            } else {
                setStatus('Beendet.');
            }
        }

        $('trk-toggle').addEventListener('click', () => {
            if (__speed) __speed.unlockAudio(); // unlock the over-speed chime within this user gesture
            if (__compass) __compass.enable();  // start the compass (iOS needs this gesture for permission)
            if (trkState === 'idle') beginTracking();
            else if (trkState === 'recording') pauseTracking();
            else resumeTracking(); // paused
        });
        // VERWERFEN → throw the paused track away WITHOUT saving: stop, delete the autosynced
        // cloud row if one exists, wipe the crash buffer, reset the HUD, back to idle.
        // Destructive → confirm first.
        async function discardTracking() {
            if (!(await uiConfirm('Track löschen? Das lässt sich nicht rückgängig machen.', { danger: true, okText: 'Löschen' }))) return;
            setTrkState('idle');
            startAmbient(); // back to idle → resume idle live-follow
            stopLive(true);
            if (__nav) __nav.clearRoute(); // discard also clears the navigation route + destination pin
            if (__speed) __speed.clear();  // …and the speed-limit sign
            const id = currentTrackId;
            currentTrackId = null; currentTrackName = '';
            await clearTrack(true);
            setDist(0); setSpeed(0); setAlt(null); updateModeIcon(); // 0,0 → 🧍 (stehen) right away
            try { if (typeof TrackBuffer !== 'undefined') await TrackBuffer.clear(); } catch (e) { }
            if (id != null) { try { await removeTrack(id); } catch (e) { toast('Cloud-Löschen fehlgeschlagen: ' + (e.message || e)); } }
            toast('Track verworfen.');
        }
        $('trk-finish').addEventListener('click', () => { if (trkState === 'paused') finishTracking(); });
        $('trk-discard').addEventListener('click', () => { if (trkState === 'paused') discardTracking(); });
        setTrkState('idle');

        // Round-button labels: size the font by MEASURING the widest label (SPEICHERN/VERWERFEN…)
        // so it always fits the smaller circle — computed, not guessed; uniform; re-fit on resize.
        // Caps at the original font/diameter ratio so it never grows beyond design.
        const CONTROL_LABELS = ['START', 'PAUSE', 'CONTINUE', 'SPEICHERN', 'LÖSCHEN'];
        function fitControlText() {
            const btns = [$('trk-toggle'), $('trk-finish'), $('trk-discard')].filter(Boolean);
            if (!btns.length) return;
            const cs = getComputedStyle(btns[0]);
            const dia = parseFloat(cs.width);
            if (!dia) { const c = $('trk-controls'); if (c) c.classList.add('fitted'); return; }
            const border = parseFloat(cs.borderLeftWidth) || 0;
            const ls = parseFloat(cs.letterSpacing) || 0; // fixed px, size-independent
            const avail = dia - 2 * border - 2 * (dia * 0.12); // text chord minus side margin
            const ctx = fitControlText._ctx || (fitControlText._ctx = document.createElement('canvas').getContext('2d'));
            const REF = 100;
            ctx.font = '700 ' + REF + 'px ' + (cs.fontFamily || 'sans-serif');
            let need = Infinity;
            for (const lbl of CONTROL_LABELS) {
                const glyph = ctx.measureText(lbl).width;          // at REF px (no letter-spacing)
                const spacing = ls * Math.max(0, lbl.length - 1);  // px at final size
                const fs = (avail - spacing) * REF / glyph;        // px that makes this label = avail
                if (fs < need) need = fs;
            }
            const px = Math.max(7, Math.min(need, dia * 0.115) * 1.134); // cap = original ratio, +13.4% (Doc: +8%, then +5% more)
            btns.forEach(b => { b.style.fontSize = px.toFixed(1) + 'px'; });
            const ctrl = $('trk-controls'); if (ctrl) ctrl.classList.add('fitted'); // reveal — now sized, no flash
        }
        fitControlText();
        window.addEventListener('resize', () => {
            fitControlText();
            Hud.recenterAll();
        });
