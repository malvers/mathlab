// worldclock-globe.js — the 3D globe (globe.gl / three-globe): marker, init, fit, resize, toggle.
// Loaded AFTER worldclock.js: globe STATE (globeInstance, lockedCity, globeManuallyDragged, GLOBE_KEY)
// stays there; these functions read/write it + cities/canvas/hideCityInfo at runtime (shared global scope).
// Extracted from worldclock.js (Phase 5 refactor) — behaviour unchanged.

        // Static red dot + pulsating ring at (lat, lng). Single source for the focus marker —
        // every "city selected" path (startup, reset, click, search) calls this.
        function setGlobeMarker(lat, lng) {
            if (!globeInstance) return;
            globeInstance
                .pointsData([{ lat, lng }])
                .pointLat('lat')
                .pointLng('lng')
                .pointColor(() => 'red')
                .pointAltitude(0.01)
                .pointRadius(0.6)
                .ringsData([{ lat, lng }])
                .ringColor(() => 'rgba(255, 0, 0, 1)')
                .ringMaxRadius(5)
                .ringPropagationSpeed(5)
                .ringRepeatPeriod(1000);
        }

        function initGlobeNow() {
            if (globeInstance) return;
            const stage = document.getElementById('globe-stage');
            if (!stage || typeof Globe === 'undefined') return;
            globeInstance = Globe()(stage)
                .globeImageUrl('https://unpkg.com/three-globe@2.27.0/example/img/earth-blue-marble.jpg')
                .bumpImageUrl('https://unpkg.com/three-globe@2.27.0/example/img/earth-topology.png')
                .backgroundColor('rgba(0,0,0,0)')
                .showAtmosphere(false)
                .pointOfView({ lat: 89.99, lng: 0, altitude: fitGlobeAltitude() });
            globeInstance.controls().enabled = false;
            // On startup: rotate to Dresden and show red dot
            const _dresden = cities.find(c => c.name === 'Dresden');
            if (_dresden) {
                lockedCity = _dresden;
                const globeLat = _dresden.globeLat !== undefined ? _dresden.globeLat : _dresden.lat;
                const globeLon = _dresden.globeLon !== undefined ? _dresden.globeLon : _dresden.lon;
                requestAnimationFrame(() => {
                    if (globeInstance && lockedCity === _dresden) {
                        globeInstance.pointOfView({ lat: globeLat, lng: globeLon, altitude: fitGlobeAltitude() }, 1000);
                    }
                });
                setGlobeMarker(globeLat, globeLon);
            }
            syncGlobeSize();
            requestAnimationFrame(syncGlobeSize);
            setTimeout(syncGlobeSize, 400);
        }

        window.resetGlobeCenter = function() {
            if (!globeInstance) return;
            const _dresden = cities.find(c => c.name === 'Dresden');
            if (!_dresden) return;
            const gLat = _dresden.globeLat !== undefined ? _dresden.globeLat : _dresden.lat;
            const gLon = _dresden.globeLon !== undefined ? _dresden.globeLon : _dresden.lon;
            lockedCity = _dresden;
            globeManuallyDragged = false;
            globeInstance.pointOfView({ lat: gLat, lng: gLon, altitude: fitGlobeAltitude() }, 1000);
            setGlobeMarker(gLat, gLon);
        };

        window.toggleGlobe = function() {
            window.useGlobe = !window.useGlobe;
            try { localStorage.setItem(GLOBE_KEY, window.useGlobe ? '1' : '0'); } catch (_) {}
            if (window.useGlobe) {
                document.body.classList.add('use-globe');
                initGlobeNow();
            } else {
                document.body.classList.remove('use-globe');
                lockedCity = null;
                if (globeInstance) globeInstance.ringsData([]).pointsData([]);
                hideCityInfo();
            }
        };

        // Camera altitude so the 3D Earth's on-screen size matches the 2D world disc (radius r*0.773),
        // i.e. the Earth sits exactly inside the city ring on any aspect ratio (fixes "globe too big" on mobile portrait).
        function fitGlobeAltitude() {
            try {
                const rect = canvas.getBoundingClientRect();
                const w = Math.max(80, rect.width || 0), h = Math.max(80, rect.height || 0);
                const desiredR = 0.4 * Math.min(w, h) * 0.773;   // px radius of the world disc (= clock-mode map)
                const cam = globeInstance && globeInstance.camera && globeInstance.camera();
                const fov = (cam && cam.fov) || 50;              // globe.gl vertical FOV (deg)
                const tanHalf = Math.tan(fov * Math.PI / 360);   // tan(fov/2)
                const K = (h / 2) / (tanHalf * desiredR);
                const alt = -1 + Math.sqrt(1 + K * K);           // camera at R*(1+alt) from centre → screen radius = desiredR
                return Math.min(10, Math.max(0.5, alt));
            } catch (_) { return 2.65; }
        }
        function syncGlobeSize() {
            if (!globeInstance) return;
            const stage = document.getElementById('globe-stage');
            const rect = stage.getBoundingClientRect();
            globeInstance.width(rect.width).height(rect.height);
            // Re-fit the Earth into the city ring after any resize / orientation change.
            const pov = globeInstance.pointOfView();
            globeInstance.pointOfView({ lat: pov.lat, lng: pov.lng, altitude: fitGlobeAltitude() }, 0);
        }
        if (window.useGlobe) {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.classList.add('use-globe');
                (function initGlobeWhenReady() {
                    if (typeof Globe === 'undefined') {
                        setTimeout(initGlobeWhenReady, 50);
                        return;
                    }
                    const stage = document.getElementById('globe-stage');
                    globeInstance = Globe()(stage)
                        .globeImageUrl('https://unpkg.com/three-globe@2.27.0/example/img/earth-blue-marble.jpg')
                        .bumpImageUrl('https://unpkg.com/three-globe@2.27.0/example/img/earth-topology.png')
                        .backgroundColor('rgba(0,0,0,0)')
                        .showAtmosphere(false)
                        .pointOfView({ lat: 89.99, lng: 0, altitude: fitGlobeAltitude() });
                    globeInstance.controls().enabled = false;
                    // On startup: rotate to Dresden and show red dot
                    const _dresden = cities.find(c => c.name === 'Dresden');
                    if (_dresden) {
                        lockedCity = _dresden;
                        const globeLat = _dresden.globeLat !== undefined ? _dresden.globeLat : _dresden.lat;
                        const globeLon = _dresden.globeLon !== undefined ? _dresden.globeLon : _dresden.lon;
                        requestAnimationFrame(() => {
                            if (globeInstance && lockedCity === _dresden) {
                                globeInstance.pointOfView({ lat: globeLat, lng: globeLon, altitude: fitGlobeAltitude() }, 1000);
                            }
                        });
                        setGlobeMarker(globeLat, globeLon);
                    }
                    // Force exact size & re-sync after layout settles
                    syncGlobeSize();
                    requestAnimationFrame(syncGlobeSize);
                    setTimeout(syncGlobeSize, 400);
                    window.addEventListener('resize', syncGlobeSize);
                })();
            });
        }
