// Doc Alvers Tracker - part 4 of 13: position marker, HUD readout, travel triangle, smooth follow.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---------------------------------------------------------------
        // Position handling
        // ---------------------------------------------------------------
        // Draw / move the current-position marker, accuracy circle and HUD readout.
        // Shared by live tracking and the one-shot "centre" locate.
        function renderPosition(here, accuracy, holdPos) {
            // Fixed-pixel dot via circleMarker — keeps its size at every zoom level.
            // (An L.circle would use metres and balloon when zooming in.)
            if (!posMarker) {
                posMarker = L.circleMarker(here, {
                    radius: 7, color: '#fff', weight: 2,
                    fillColor: COL_RED, fillOpacity: 1,
                    className: 'pos-marker', pane: 'posDot', // always on top of map symbols
                }).addTo(map);
            } else if (!holdPos) {
                posMarker.setLatLng(here); // hold the dot steady when the gate says we're standing still
            }

            elAcc.innerHTML = accuracy != null ? '±<span class="sat-n">' + Math.round(accuracy) + '</span> m' : '±<span class="sat-n">–</span> m';
            elAcc.style.color = accColor(accuracy);
            // Native app: the real GnssStatus listener owns the source label. Only the web
            // falls back to the accuracy heuristic here.
            if (!gnssActive) elSrc.textContent = sourceLabel(accuracy);
            setGpsState(true);
        }

        // ---- travel-direction triangle ----
        // A small triangle at the position dot, rotated to the heading; shown only while moving.
        // Created once, then later fixes just move it + update its CSS rotation (no flicker).
        const HEADING_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 L18 18 L6 18 Z"/></svg>';
        function setHeading(here, bearing, show) {
            if (!show || bearing == null || isNaN(bearing)) {
                if (headingMarker) { map.removeLayer(headingMarker); headingMarker = null; }
                return;
            }
            if (!headingMarker) {
                const icon = L.divIcon({
                    className: 'heading-icon',
                    html: '<div class="heading-arrow">' + HEADING_SVG + '</div>',
                    iconSize: [40, 40], iconAnchor: [20, 20],
                });
                headingMarker = L.marker(here, { icon, interactive: false, keyboard: false, pane: 'posDot' }).addTo(map);
            } else {
                headingMarker.setLatLng(here);
            }
            const el = headingMarker.getElement();
            if (el) { const a = el.querySelector('.heading-arrow'); if (a) a.style.transform = 'rotate(' + bearing + 'deg)'; }
        }

        // The web Geolocation API hides the fix source — infer it from accuracy (heuristic).
        // The real provider (gps/network/fused) is only available in the native app.
        function sourceLabel(acc) {
            if (acc == null) return '';
            if (acc <= 15) return 'GPS';     // only GNSS is this precise
            if (acc <= 150) return 'WLAN';
            return 'FUNK';                    // cell tower / IP
        }

        function updateGpsReal(accuracy) {
            // Real GPS fix? Native sats in use, or an accuracy only GNSS reaches (≤15 m — the same
            // threshold sourceLabel() calls 'GPS'). Gates the travel-mode icon: in WLAN/cell the
            // speed (and thus the guessed mode) is unreliable → no icon at all.
            gpsReal = (gnssLatest && gnssLatest.used > 0) || (accuracy != null && accuracy <= 15);
            updateModeIcon(); // reflect the source immediately (also on rejected/teleport fixes)
        }

        function computeMovementGate(speed, accuracy, here) {
            // Movement gate: does the accelerometer confirm we actually move? If the sensor
            // says "still", GPS jitter is suppressed (no points, speed 0, dot + map held).
            // BUT a vehicle at steady cruise has almost no dynamic acceleration, so the sensor
            // can wrongly read "still" mid-drive. The gate's only job is to kill GPS jitter while
            // genuinely stopped (where GPS speed ≈ 0), so let a clear GPS speed override it: above
            // SPEED_MOVE_KMH (with usable accuracy) we trust GPS and keep recording. Then it only
            // suppresses true standstill — a red light, not the open road.
            const gpsKmh = (speed != null && speed >= 0) ? speed * 3.6 : null;
            const gpsMoving = gpsKmh != null && gpsKmh > SPEED_MOVE_KMH && (accuracy == null || accuracy <= MAX_ACC_M);
            const sensorStill = motionReady && motionStill && !gpsMoving;
            // POSITION deadband — ALWAYS on (sensor or not): a fix that stays within the GPS error
            // circle of the shown dot is noise, not motion → hold. This catches the case where the
            // accelerometer says "still" (e≈0) but the GPS speed-override (gpsMoving) wrongly fires on
            // an indoor phantom speed, AND the no-sensor (desktop/WLAN) standstill drift. A real move
            // (> band) still snaps through; sub-accuracy "movement" stays invisible (WLAN can't resolve it).
            let posStill = false;
            if (posMarker) {
                const shown = posMarker.getLatLng();
                const band = Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR);
                posStill = haversine([shown.lat, shown.lng], here) <= band;
            }
            const still = sensorStill || posStill;
            return { gpsKmh, still };
        }

        function renderInitialFix(here, accuracy, still) {
            const firstFix = !posMarker;
            renderPosition(here, accuracy, still && !firstFix);
            showDot();
            if (firstFix) map.setView(here, 17); // snap to the very first fix
            return firstFix;
        }

        function updateFuelLayer(here) {
            // Ambient, position-driven layer: nearby fuel-station prices. Runs on EVERY fix —
            // BEFORE the recording accuracy gate below — because its 5 km search radius doesn't
            // need a ≤ MAX_ACC_M fix (a coarse WLAN/IP browser fix is plenty). It has its own
            // 3 min / 2 km throttle, so this can't spam Tankerkönig. The track recording itself
            // stays strict at MAX_ACC_M; only the fuel layer is exempt. (Was below the gate, so it
            // never ran in a desktop browser where geolocation accuracy is worse than 50 m.)
            if (__fuel) __fuel.update(here);
            if (__traffic) __traffic.update(here);   // live Autobahn closures/roadworks/warnings (own throttle)
        }

        function rejectNoisyFix(accuracy, still) {
            // Reject noisy fixes for the recorded track
            if (accuracy != null && accuracy > MAX_ACC_M) {
                setStatus(`Warte auf besseres Signal … (±${Math.round(accuracy)} m)`);
                updateMotionDbg(accuracy, MIN_MOVE_M, still);
                return true;
            }
            return false;
        }

        function rejectTeleportFix(latitude, longitude, here, now, still, accuracy) {
            // Drop GPS "teleports": the first fix is often a coarse WLAN/cell guess; when the real
            // GPS fix lands the position leaps km in seconds → an absurd speed (962 km/h!) and a
            // bogus track leg. If a fix implies an impossible ground speed from the previous one,
            // re-baseline on it but ignore the jump itself (no speed, no point, no distance).
            if (lastFix) {
                const jdt = (now - lastFix.t) / 1000;
                const jumpKmh = jdt > 0 ? (haversine([lastFix.lat, lastFix.lng], here) / jdt) * 3.6 : Infinity;
                if (jumpKmh > MAX_JUMP_KMH) {
                    lastFix = { lat: latitude, lng: longitude, t: now }; // trust the new fix as the baseline
                    shownSpeed = 0; setSpeed(0);
                    if (following && !still) map.panTo(here, { animate: true });
                    updateMotionDbg(accuracy, MIN_MOVE_M, still);
                    return true;
                }
            }
            return false;
        }

        function updateAltitudePhase(pos, here) {
            // Altitude: fuse the precise barometer profile with the absolute anchor (DEM terrain, else GPS).
            updateDemElev(here);
            updateAltitude(pos.coords.altitude != null ? pos.coords.altitude : null);
        }

        function computeAndDisplaySpeed(speed, here, now, still) {
            // Speed display DECOUPLED from the recording gate (BUG-1). The gate only exists to
            // suppress position jitter while genuinely stopped, but it ALSO nulled the km/h readout
            // while slowly walking inside the accuracy band → the "0.0 / 1.7" flicker Doc saw. GPS
            // Doppler (coords.speed) measures velocity directly and is correct even inside that band,
            // so we trust it regardless of `still`. Only with NO Doppler do we fall back to the old
            // gated distance/time estimate → regression-free on devices that give no Doppler.
            let kmh = 0;
            let spdSrc;
            if (speed != null && speed >= 0) {
                kmh = speed * 3.6;              // raw GPS Doppler — independent of the gate
                spdSrc = 'dop';
            } else if (!still && lastFix) {
                const dt = (now - lastFix.t) / 1000;
                if (dt > 0) kmh = (haversine([lastFix.lat, lastFix.lng], here) / dt) * 3.6;
                spdSrc = 'calc';               // no Doppler → derived from distance/time (gated, as before)
            } else {
                spdSrc = 'gate0';              // no Doppler and gate says still → 0
            }
            if (kmh > MAX_JUMP_KMH) kmh = 0;   // a device-reported nonsense speed → ignore
            const rawKmh = kmh;                // pre-floor value — shown in the debug so standstill noise stays visible
            // Doppler can report a noisy 1–2 km/h at standstill; snap sub-walking-pace to 0 so a
            // parked readout stays a clean 0 instead of jittering. Tune SPEED_ZERO_KMH if needed.
            if (kmh < SPEED_ZERO_KMH) kmh = 0;
            shownSpeed = 0.6 * shownSpeed + 0.4 * kmh; // light EMA; no hard gate-kill anymore
            setSpeed(shownSpeed);
            // Interesting bits into the EXISTING debug surfaces (no new element):
            //  • live in the #motion-dbg bar: source + raw→shown km/h (see updateMotionDbg).
            //  • once in the DebugWindow: whether THIS device delivers coords.speed at all.
            spdDbg = 'spd:' + spdSrc + '=' + rawKmh.toFixed(1) + '→' + shownSpeed.toFixed(1);
            if (!dopplerLogged && gpsReal && window.DebugWindow) {
                dopplerLogged = true;
                DebugWindow.log(speed != null
                    ? 'BUG-1 Speed: coords.speed ✓ (' + (speed * 3.6).toFixed(1) + ' km/h Doppler) → Anzeige entkoppelt'
                    : 'BUG-1 Speed: coords.speed = null → Distanz/Zeit-Fallback');
            }
            updateModeIcon(); // keep the mode glyph (left of the clock) current
        }

        function computeBearing(hdg, gpsKmh, here, latitude, longitude) {
            // Travel direction: prefer the GPS heading; else the bearing of the last real step.
            // Only while moving → a triangle at the dot rotated to the course (hidden when still).
            let bearing = null;
            if (hdg != null && !isNaN(hdg) && (gpsKmh == null || gpsKmh > 1)) bearing = hdg;
            else if (lastFix && haversine([lastFix.lat, lastFix.lng], here) >= MIN_MOVE_M) {
                bearing = bearingBetween(lastFix.lat, lastFix.lng, latitude, longitude);
            }
            return bearing;
        }

        function recordTrackPoint(here, accuracy, now, still) {
            // Simulator (Doc 2026-06-24): never write the synthetic drive into the track / buffer / cloud —
            // the sim only needs the position marker + nav.update to run, not a recorded/synced track.
            if (simMode) return { minStep: MIN_MOVE_M };
            // Adaptive minimum step: within the GPS error circle everything is noise, so require
            // a move bigger than a fraction of the accuracy — never below MIN_MOVE_M. Each recorded
            // point carries its altitude (m) + speed (km/h) for the later elevation/speed profile.
            const minStep = Math.max(MIN_MOVE_M, (accuracy || 0) * ACC_STEP_FACTOR);
            const stamp = new Date(now).toISOString();
            const altVal = fusedAlt != null ? Math.round(fusedAlt * 10) / 10 : null;
            const spdVal = Math.round(shownSpeed * 10) / 10;
            const actVal = effectiveActivity();
            const ptsBefore = track.length;
            if (track.length === 0) {
                track.push(here); times.push(stamp); alts.push(altVal); speeds.push(spdVal); activities.push(actVal); temps.push(lastTemp); scheduleTrackRedraw();
            } else if (!still) {
                const step = haversine(track[track.length - 1], here);
                if (step >= minStep) {
                    totalDist += step;
                    track.push(here); times.push(stamp); alts.push(altVal); speeds.push(spdVal); activities.push(actVal); temps.push(lastTemp); scheduleTrackRedraw();
                }
            }
            if (track.length !== ptsBefore) {
                if (typeof TrackBuffer !== 'undefined') TrackBuffer.save(bufferSnapshot());
                scheduleSync(); // Stage 2: push to the cloud on the fly
                if (liveOn) broadcastLive(); // Stage 3: live position to viewers
            }
            setDist(totalDist);
            return { minStep };
        }

        function updateLastFix(latitude, longitude, now) {
            lastFix = { lat: latitude, lng: longitude, t: now };
        }

        // ---- Smooth follow glide (Doc 2026-06-26) ----
        // GPS fixes land ~1×/s. Snapping the dot to each fix and bursting the camera in 0.25 s made the
        // crosshair view lurch once a second. Instead we glide BOTH together across the measured fix
        // interval, LINEARLY:
        //   • the camera via ONE native Leaflet pan (animate + easeLinearity:1 → constant speed; fires
        //     moveend just ONCE, so saveView/refreshRecenter don't get spammed),
        //   • the dot + heading via a tiny rAF that only moves the markers (touches no map events).
        // Same start→here over the same duration, so a centred dot stays dead-centre while the world slides
        // seamlessly. followPrevLL is the dot's spot BEFORE this fix snapped it → the glide's start point.
        // A long gap (parked, off-route, mode switch) snaps instead of crawling a slow catch-up.
        let followPrevLL = null;
        let dotGlideRAF = null, dotFrom = null, dotTo = null, dotGlideStart = 0, dotGlideDur = 1000, lastFollowFixT = 0, lastGlidePaint = 0;
        function stopDotGlide() { if (dotGlideRAF) { cancelAnimationFrame(dotGlideRAF); dotGlideRAF = null; } }
        function dotGlideFrame() {
            const now = Date.now();
            const t = dotGlideDur > 0 ? Math.min(1, (now - dotGlideStart) / dotGlideDur) : 1;
            // Cap the marker repaint to ~30 fps (battery): skip the SVG move on frames < ~33 ms apart, but
            // always paint the final frame so the dot lands exactly on the fix.
            if (now - lastGlidePaint >= 33 || t >= 1) {
                lastGlidePaint = now;
                const lat = dotFrom[0] + (dotTo[0] - dotFrom[0]) * t;
                const lng = dotFrom[1] + (dotTo[1] - dotFrom[1]) * t;
                if (posMarker) posMarker.setLatLng([lat, lng]);
                if (headingMarker) headingMarker.setLatLng([lat, lng]);
            }
            if (t < 1) dotGlideRAF = requestAnimationFrame(dotGlideFrame);
            else dotGlideRAF = null;
        }
        // Start the dot glide toward a new fix. Returns the duration (ms) to pan the camera over, or false
        // when it should just snap (no dot yet, first fix, or too long a gap to glide nicely).
        function followSmooth(here) {
            if (!followPrevLL) return false;
            const now = Date.now();
            const interval = lastFollowFixT ? now - lastFollowFixT : 0;
            lastFollowFixT = now;
            if (interval <= 0 || interval > 3000) return false; // first fix / long gap → snap, no slow crawl
            dotFrom = followPrevLL;
            dotTo = [here[0], here[1]];
            dotGlideDur = Math.max(500, Math.min(2000, interval));
            dotGlideStart = now;
            if (!dotGlideRAF) dotGlideRAF = requestAnimationFrame(dotGlideFrame);
            return dotGlideDur;
        }
        function updateAutoFollow(here, still) {
            if (following && !still) { // auto-follow: glide to the dot; zoom by SPEED — but NOT in
                // 'remaining' FIT mode, where the remaining-route fit (below) owns the zoom so the two
                // don't fight over it (note #9).
                const tz = (fitMode === 'remaining' || autoZoomHold) ? null : speedZoom(shownSpeed);
                const zoomStep = tz != null && Math.abs(map.getZoom() - tz) >= 1 && Date.now() - lastAutoZoom > AUTOZOOM_COOLDOWN;
                const durMs = followSmooth(here); // glide the dot; false → snap (first fix / long gap)
                if (zoomStep) {
                    lastAutoZoom = Date.now();
                    map.setView(here, tz, { animate: true, duration: (durMs ? durMs / 1000 : 0.5), easeLinearity: 1.0 }); // pan + zoom, smooth
                } else if (durMs) {
                    map.panTo(here, { animate: true, duration: durMs / 1000, easeLinearity: 1.0 }); // glide camera in lockstep with the dot
                } else {
                    map.panTo(here, { animate: true }); // first fix / long gap → plain pan
                }
            }
        }

        function updateFitMode(here) {
            // FIT mode (3-state): 'all' keeps the WHOLE track in view; 'remaining' keeps the rest of the
            // route ahead in view (note #9). Two DECOUPLED motions so the frame tracks the shrinking rest
            // dynamically without zoom flutter (Doc 2026-06-21 — "wird einmal gemacht, dann nicht angepasst":
            // the missing piece was the continuous PAN; the zoom-only hysteresis left the camera frozen
            // between steps, and with zoomSnap:1 the snug-fit often never re-crossed the threshold at all):
            //   • ZOOM — bidirectional, hysteresis + cooldown (can't flutter): out when the rest spills past
            //     the frame (-0.12 slack), in when it sits well inside (-0.30 inset).
            //   • PAN  — EVERY fix, re-centre on the remaining route so the frame follows it as it shrinks.
            if (fitMode === 'all' && track.length > 1) {
                const tb = wholeRouteBounds(here);   // driven ∪ remaining → keep the WHOLE journey framed as it changes
                // autoZoomHold (manual +/−): keep centring on the journey but suspend the zoom re-frame so the held zoom sticks.
                if (tb && autoZoomHold) { try { map.panTo(tb.getCenter(), { animate: true }); } catch (e) { } }
                else if (tb && !map.getBounds().pad(-0.12).contains(tb)) { try { map.fitBounds(tb, { padding: fitPad() }); } catch (e) { } }
            } else if (fitMode === 'remaining' && __nav && __nav.remainingBounds) {
                const rb = __nav.remainingBounds(here);
                if (rb) {
                    const v = map.getBounds();
                    const grew = !v.pad(-0.12).contains(rb);   // rest spilled out of the frame → zoom OUT
                    const shrank = v.pad(-0.30).contains(rb);  // rest sits in the inner margin → zoom IN
                    // autoZoomHold (manual +/−) suspends the zoom re-frame → fall through to pan-only so the held zoom sticks.
                    if ((grew || shrank) && !autoZoomHold && Date.now() - lastAutoZoom > AUTOZOOM_COOLDOWN) {
                        lastAutoZoom = Date.now();
                        try { map.fitBounds(rb, { padding: fitPad() }); } catch (e) { }   // re-frame (zoom + centre)
                    } else {
                        try { map.panTo(rb.getCenter(), { animate: true }); } catch (e) { } // keep it centred between zoom steps
                    }
                }
            }
        }

        function updateNavigationAndDebug(here, still, accuracy, minStep) {
            refreshRecenter(); // show/hide the recenter button as needed
            updateAmbientTemp(here); // keep the ambient temperature fresh while recording (throttled) → stamped onto each point
            if (__nav && __nav.update) __nav.update(here, shownSpeed); // navigation: reroute + speed-scaled turn lead
            if (__speed) __speed.update(here, still, shownSpeed); // speed-limit sign for the current road
            if (__hazards) __hazards.update(here, shownSpeed); // point hazards (Bahnübergang/Stop/…) ahead
            if (__sun) __sun.update(here);                     // golden hour / sun position line (FEAT-2)
            if (__fines) __fines.refresh(); // live-update the Bußgeld panel while it's open
            updateMotionDbg(accuracy, minStep, still);
            if (tracking) setStatus(`Aufzeichnung läuft … ${track.length} Punkte`);
        }

        function onPosition(pos) {
            const { latitude, longitude, accuracy, speed } = pos.coords;
            const now = pos.timestamp || Date.now();
            const here = [latitude, longitude];
            followPrevLL = posMarker ? [posMarker.getLatLng().lat, posMarker.getLatLng().lng] : null; // dot's spot BEFORE this fix snaps it → glide start

            updateGpsReal(accuracy);                                          // Phase 1: source flag + mode icon
            const { gpsKmh, still } = computeMovementGate(speed, accuracy, here); // Phase 2: movement gate
            renderInitialFix(here, accuracy, still);                          // Phase 3: render marker + first-fix snap
            updateFuelLayer(here);                                            // Phase 4: ambient fuel layer (pre-gate)
            if (rejectNoisyFix(accuracy, still)) return;                      // Phase 5: drop low-accuracy fixes
            if (rejectTeleportFix(latitude, longitude, here, now, still, accuracy)) return; // Phase 6: drop teleports
            updateAltitudePhase(pos, here);                                   // Phase 7: barometer/DEM altitude fusion
            computeAndDisplaySpeed(speed, here, now, still);                  // Phase 8: speed (Doppler/calc) + EMA
            const bearing = computeBearing(pos.coords.heading, gpsKmh, here, latitude, longitude); // Phase 9: heading
            setHeading(here, bearing, !still && bearing != null);
            const { minStep } = recordTrackPoint(here, accuracy, now, still); // Phase 10: record point + sync/broadcast
            updateLastFix(latitude, longitude, now);                          // Phase 11: re-baseline (every accepted fix)
            updateAutoFollow(here, still);                                    // Phase 12: auto-follow pan/zoom
            updateFitMode(here);                                              // Phase 13a: FIT-mode re-fit
            updateNavigationAndDebug(here, still, accuracy, minStep);         // Phase 13b: nav + speed-sign + debug + status
            updateLiveTail(here);                                             // Phase 14: bridge coloured track → dot (no gap before the route)
        }

        function onError(err) {
            const messages = {
                1: 'Standortzugriff verweigert. Bitte in den Einstellungen erlauben.',
                2: 'Position nicht verfügbar (kein GPS-Signal).',
                3: 'Zeitüberschreitung beim Standort.',
            };
            setStatus(messages[err.code] || ('Fehler: ' + err.message));
        }
