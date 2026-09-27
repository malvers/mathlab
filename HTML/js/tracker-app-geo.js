// Doc Alvers Tracker - part 5 of 13: geolocation source (native plugin / browser), tuning readout, altitude, DEM.
// One of the classic scripts js/tracker-app-*.js, split from the single js/tracker.js (27.09.2026, refactor
// audit). They share ONE global scope (top-level let/const/function, no wrapper), so the order of the tags
// in tracker/tracker.html matters: code that runs while the files load must not reach into a later file,
// and a callback that can fire in between (a resolved promise, a timer) must not either.

        // ---------------------------------------------------------------
        // Geolocation source — prefer the native background plugin (Capacitor)
        // so recording continues with the screen off; fall back to the browser
        // API on the web. In a plain browser window.Capacitor is undefined, so
        // this whole block is a no-op and the web behaviour is unchanged.
        // ---------------------------------------------------------------
        const BgGeo = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.BackgroundGeolocation) || null;
        const useNativeGeo = !!(BgGeo && Capacitor.isNativePlatform && Capacitor.isNativePlatform());

        function startGeoWatch(onPos, onErr) {
            if (useNativeGeo) {
                // addWatcher returns a Promise<string> (the watcher id)
                return BgGeo.addWatcher(
                    {
                        backgroundTitle: 'Doc Alvers Tracker',
                        backgroundMessage: 'Aufzeichnung läuft …',
                        requestPermissions: true,
                        stale: false,
                        distanceFilter: 0,
                    },
                    (location, error) => {
                        if (error) {
                            onErr({ code: error.code === 'NOT_AUTHORIZED' ? 1 : 2, message: error.message || '' });
                            return;
                        }
                        // adapt the plugin's location shape to the W3C Geolocation shape
                        onPos({
                            coords: {
                                latitude: location.latitude,
                                longitude: location.longitude,
                                accuracy: location.accuracy,
                                speed: location.speed,
                                altitude: location.altitude,
                            },
                            timestamp: location.time || Date.now(),
                        });
                    }
                );
            }
            return navigator.geolocation.watchPosition(onPos, onErr, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000,
            });
        }

        function stopGeoWatch(id) {
            if (id == null) return;
            if (useNativeGeo) Promise.resolve(id).then(realId => BgGeo.removeWatcher({ id: realId }));
            else navigator.geolocation.clearWatch(id);
        }

        // ---------------------------------------------------------------
        // Start / Stop
        // ---------------------------------------------------------------
        // ---------------------------------------------------------------
        // Movement gate — the accelerometer (DeviceMotion) tells "standing
        // still" from "moving", so GPS jitter can't fake phantom motion.
        // Works on web + native while the screen is on. No sensor (desktop)
        // → motionReady stays false and the gate is simply inactive.
        // ---------------------------------------------------------------
        let _lastMotionT = 0;
        function onDeviceMotion(e) {
            const _now = Date.now();
            if (_now - _lastMotionT < 100) return;  // sensor fires ~60 Hz; ~10 Hz is plenty for the still/move gate
            _lastMotionT = _now;
            let ax, ay, az;
            const acc = e.acceleration;
            if (acc && acc.x != null) {            // gravity already removed
                ax = acc.x; ay = acc.y; az = acc.z;
            } else {
                const g = e.accelerationIncludingGravity;
                if (!g || g.x == null) return;
                _grav.x = 0.8 * _grav.x + 0.2 * g.x; // low-pass ≈ gravity, subtract for the dynamic part
                _grav.y = 0.8 * _grav.y + 0.2 * g.y;
                _grav.z = 0.8 * _grav.z + 0.2 * g.z;
                ax = g.x - _grav.x; ay = g.y - _grav.y; az = g.z - _grav.z;
            }
            const mag = Math.sqrt(ax * ax + ay * ay + az * az);
            motionEnergy = 0.8 * motionEnergy + 0.2 * mag;
            motionReady = true;
            if (motionStill && motionEnergy > MOTION_MOVE) motionStill = false;
            else if (!motionStill && motionEnergy < MOTION_STILL) motionStill = true;
        }
        function enableMotion() {
            if (typeof DeviceMotionEvent === 'undefined') return;
            // iOS 13+ needs an explicit permission, triggered here from the START gesture
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission()
                    .then(s => { if (s === 'granted') window.addEventListener('devicemotion', onDeviceMotion); })
                    .catch(() => { });
            } else {
                window.addEventListener('devicemotion', onDeviceMotion);
            }
        }
        function disableMotion() {
            window.removeEventListener('devicemotion', onDeviceMotion);
            motionReady = false; motionStill = true; motionEnergy = 0;
        }
        // Tiny tuning readout (Arial per debug convention) — now a pinned live line INSIDE the DebugWindow
        // (Doc 2026-07-01: "pack die Infos ins Debug-Window, nicht da zeigen"), no longer the on-screen bar.
        function updateMotionDbg(acc, minStep, still) {
            const base = motionReady
                ? (still ? 'STILL' : 'MOVE') + ' · e=' + motionEnergy.toFixed(2) + ' · step > ' + minStep.toFixed(1) + 'm'
                : (still ? 'HALT·band' : 'frei') + ' · kein Sensor · step > ' + minStep.toFixed(1) + 'm';
            if (window.DebugWindow && DebugWindow.status)
                DebugWindow.status('motion', spdDbg ? base + ' · ' + spdDbg : base); // BUG-1: append the speed-source readout
        }

        // ---------------------------------------------------------------
        // Altitude — barometer (native Baro plugin) fused with GPS height.
        // Browser / no barometer → GPS altitude only (rougher). The barometer
        // gives the smooth relative profile; GPS slowly calibrates the absolute.
        // ---------------------------------------------------------------
        function renderAltitude() {
            if (demOn) {
                const A = effectiveAlts();
                let last = null;
                for (let i = A.length - 1; i >= 0; i--) { if (A[i] != null) { last = A[i]; break; } }
                setAlt(last);
            } else {
                setAlt(fusedAlt);
            }
        }
        // Live terrain elevation (DEM, Open-Meteo via track-dem.js) — the ABSOLUTE anchor for altitude:
        // true MSL height, noise-free, no GPS geoid offset (Doc 2026-06-18). Cheap: track-dem caches per
        // ~90 m grid cell → staying in a cell makes NO network call; only a new cell triggers one lookup.
        function updateDemElev(here) {
            if (!here || !window.TrackDem) return;
            const k = Math.round(here[0] * 1000) + ',' + Math.round(here[1] * 1000);
            if (demElevBusy || (k === demElevKey && demElev != null)) return;
            demElevBusy = true;
            TrackDem.elevations([here]).then(function (arr) {
                if (arr && arr.length && arr[0] != null) { demElev = arr[0]; demElevKey = k; updateAltitude(null); }
            }).catch(function () { }).finally(function () { demElevBusy = false; });
        }

        function updateAltitude(gpsAlt) {
            if (gpsAlt != null) lastGpsAlt = gpsAlt;
            // Anchor preference: DEM (MSL, noise-free) → live GPS → last known GPS.
            const ref = (demElev != null) ? demElev : (gpsAlt != null ? gpsAlt : lastGpsAlt);
            if (baroReady && baroAlt != null) {
                if (ref != null) {
                    const diff = ref - baroAlt;
                    altOffset = (altOffset == null) ? diff : (0.95 * altOffset + 0.05 * diff);
                }
                fusedAlt = (altOffset != null) ? baroAlt + altOffset : baroAlt;
            } else {
                fusedAlt = ref; // no barometer (idle / web) → DEM terrain height, else GPS fallback (may be null)
            }
            renderAltitude();
        }

        const Baro = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Baro) || null;
        let baroListenerAdded = false;
        function startBaro() {
            if (!Baro) return; // web / no plugin → GPS-only altitude
            if (!baroListenerAdded) {
                Baro.addListener('baro', (d) => {
                    if (!d || d.altitude == null) return;
                    baroReady = true;
                    baroAlt = d.altitude;
                    fusedAlt = (altOffset != null) ? baroAlt + altOffset : baroAlt;
                    renderAltitude();
                });
                baroListenerAdded = true;
            }
            Baro.start().catch(() => { }); // resolves {available:false} on phones without a barometer
        }
        function stopBaro() { if (Baro) Baro.stop().catch(() => { }); }
