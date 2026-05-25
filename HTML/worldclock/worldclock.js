        function toggleSidebar() {
            const panel = document.getElementById('side-panel');
            panel.classList.toggle('collapsed');
            if (window.CyberLeftChrome && typeof CyberLeftChrome.publishResolvedScale === 'function') {
                CyberLeftChrome.publishResolvedScale();
            }
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
                if (typeof init === 'function') init();
                if (window.CyberLeftChrome && typeof CyberLeftChrome.publishResolvedScale === 'function') {
                    CyberLeftChrome.publishResolvedScale();
                }
            }, 400);
        }

        CyberBranding.init({
            useExternalStyles: true,
            title: CyberI18n.get('ui.coach_title'),
            subtitle: 'World Clock',
        });
        CyberUI.init();

        (function setCoachTitleFromI18n() {
            const el = document.getElementById('coach-title-slot');
            if (el && typeof CyberI18n !== 'undefined' && typeof CyberI18n.get === 'function') {
                el.textContent = CyberI18n.get('ui.description');
            }
        })();

        if (window.CyberLeftChrome && typeof CyberLeftChrome.configure === 'function') {
            CyberLeftChrome.configure({ viewportOnlyZoom: true });
        }

        // --- SETUP ---
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('canvas-container');

        function resizeCanvasToContainer() {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }

        // --- WORLD CLOCK LOGIC ---
        const mapImg = new Image();
        mapImg.src = '../resources/worldmap_polar_north.png';
        let mapLoaded = false;
        mapImg.onload = () => { mapLoaded = true; init(); };

        // WKOE mode: white disc with WKOE logo instead of world map
        const wkoeLogoImg = new Image();
        wkoeLogoImg.src = 'WKOE%20frei.png';

        // South-pole polar map (pre-rendered asset) — clock background when CW; north map stays for CCW.
        const southMapImg = new Image();
        let southMapReady = false;
        southMapImg.onload = () => { southMapReady = true; };
        southMapImg.src = '../resources/worldmap_polar_south.png';

        // Round Moon disc (pre-rendered, public-domain NASA texture) — shown in a box under the city list
        const moonImg = new Image();
        let moonReady = false;
        moonImg.onload = () => { moonReady = true; };
        moonImg.src = '../resources/moon.png';

        // Pole label ("NORDPOL"/"SÜDPOL") + small red dot, drawn at the centre (= the pole) in screen space.
        function drawPoleMarker(w, h, r) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.letterSpacing = "2px";
            ctx.lineJoin = "round";
            ctx.font = `600 ${Math.max(9, r * 0.032)}px 'Orbitron', sans-serif`;
            const lbl = CW ? "SÜDPOL" : "NORDPOL";
            const ly = h / 2 - r * 0.05;                  // text slightly above the dot
            ctx.lineWidth = Math.max(1.5, r * 0.008);
            ctx.strokeStyle = "rgba(0,0,0,0.45)";
            ctx.strokeText(lbl, w / 2, ly);
            ctx.fillStyle = "rgba(235,242,248,0.6)";
            ctx.fillText(lbl, w / 2, ly);
            ctx.beginPath();                              // static red dot at the pole (centre)
            ctx.arc(w / 2, h / 2, Math.max(1.5, r * 0.008), 0, Math.PI * 2);
            ctx.fillStyle = "rgb(176,36,24)";
            ctx.fill();
            ctx.restore();
        }

        // Globe vs clock mode — precedence: URL ?globe= (wins) > localStorage > default (clock).
        const GLOBE_KEY = 'worldclock-globe';
        window.useGlobe = (function () {
            const p = new URLSearchParams(window.location.search).get('globe');
            if (p === '1') return true;
            if (p === '0') return false;
            const s = localStorage.getItem(GLOBE_KEY);
            if (s === '1') return true;
            if (s === '0') return false;
            return false;
        })();
        // Rotation direction — precedence: URL ?dir= (wins) > localStorage > default CCW.
        const DIR_KEY = 'worldclock-dir';
        function initialCW() {
            const p = new URLSearchParams(window.location.search).get('dir');   // link param overrides everything
            if (p === 'cw') return true;
            if (p === 'ccw') return false;
            const s = localStorage.getItem(DIR_KEY);                            // else the persisted choice
            if (s === 'cw') return true;
            if (s === 'ccw') return false;
            return false;                                                       // else default: counter-clockwise
        }
        let CW = initialCW();
        let dirSign = CW ? -1 : 1;
        // Flip direction at runtime, persist it, redraw. draw() reads CW/dirSign each frame → live.
        function setDirection(cw) {
            CW = cw; dirSign = CW ? -1 : 1;
            try { localStorage.setItem(DIR_KEY, CW ? 'cw' : 'ccw'); } catch (_) {}
            if (typeof draw === 'function') draw();   // redraw immediately so the flip is instant
        }
        let globeInstance = null;
        let globeIconHitbox = null;
        let dirIconHitbox = null;   // direction-toggle icon, drawn right of the globe icon

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
                globeInstance
                    .pointsData([{ lat: globeLat, lng: globeLon }])
                    .pointLat('lat')
                    .pointLng('lng')
                    .pointColor(() => 'red')
                    .pointAltitude(0.01)
                    .pointRadius(0.6)
                    .ringsData([{ lat: globeLat, lng: globeLon }])
                    .ringColor(() => 'rgba(255, 0, 0, 1)')
                    .ringMaxRadius(5)
                    .ringPropagationSpeed(5)
                    .ringRepeatPeriod(1000);
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
            globeInstance
                .pointsData([{ lat: gLat, lng: gLon }])
                .pointLat('lat').pointLng('lng')
                .pointColor(() => 'red')
                .pointAltitude(0.01).pointRadius(0.6)
                .ringsData([{ lat: gLat, lng: gLon }])
                .ringColor(() => 'rgba(255, 0, 0, 1)')
                .ringMaxRadius(5).ringPropagationSpeed(5).ringRepeatPeriod(1000);
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

        // --- City Info Box (Wikipedia) ---
        let cityInfoCurrentName = null;
        let cityInfoFetchToken = 0;
        const CITY_INFO_OVERRIDES = {
            "Kairo": "Kairo",
            "Bombay": "Mumbai",
            "Tokio": "Tokio",
            "Bagdad": "Bagdad",
            "Rio": "Rio de Janeiro",
            "Neuseeland": "Neuseeland",
            "Salomon-Inseln": "Salomonen",
            "Salomonische Inseln": "Salomonen",
            "Salomon inseln": "Salomonen",
            "San Francisco": "San Francisco",
            "Santa Fé": "Santa Fe (New Mexico)",
            "Azoren": "Azoren",
            "Kapverden": "Kap Verde",
            "Samoa": "Samoa",
            "Honolulu": "Honolulu",
            "Dawson": "Dawson City",
            "Karachi": "Karatschi",
            "Baku": "Baku",
            "Caracas": "Caracas",
            "Shanghai": "Shanghai",
            "Bangkok": "Bangkok",
            "Sydney": "Sydney",
            "Dakar": "Dakar",
            "Dresden": "Dresden",
            "New York": "New York City",
            "Chicago": "Chicago"
        };

        function fetchWikidataPopulation(qid) {
            const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}&property=P1082&format=json&origin=*`;
            return fetch(url)
                .then(r => r.json())
                .then(d => {
                    const claims = d.claims && d.claims.P1082;
                    if (!claims || !claims.length) return null;
                    // Pick most recent (largest pointInTime), else last entry
                    let best = null, bestTime = '';
                    for (const c of claims) {
                        const amount = c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value && c.mainsnak.datavalue.value.amount;
                        if (!amount) continue;
                        let time = '';
                        if (c.qualifiers && c.qualifiers.P585 && c.qualifiers.P585.length) {
                            time = c.qualifiers.P585[0].datavalue.value.time || '';
                        }
                        if (best === null || time > bestTime) {
                            best = parseFloat(amount);
                            bestTime = time;
                        }
                    }
                    return best;
                })
                .catch(() => null);
        }

        function showCityInfo(cityName) {
            if (!window.useGlobe) { hideCityInfo(); return; }
            const cleanName = cityName.replace(/\n/g, ' ').trim();
            if (cityInfoCurrentName === cleanName) {
                const box = document.getElementById('city-info-box');
                box.style.display = 'flex';
                requestAnimationFrame(updateCityInfoBoxPosition);
                return;
            }
            cityInfoCurrentName = cleanName;
            const token = ++cityInfoFetchToken;

            const box = document.getElementById('city-info-box');
            const titleEl = document.getElementById('city-info-title');
            const extractEl = document.getElementById('city-info-extract');
            const loadingEl = document.getElementById('city-info-loading');
            const popEl = document.getElementById('city-info-pop');
            const imgWrap = document.getElementById('city-info-img-wrap');
            const imgEl = document.getElementById('city-info-img');

            box.style.display = 'flex';
            setTimeout(updateCityInfoBoxPosition, 0);
            titleEl.textContent = cleanName.toUpperCase();
            extractEl.textContent = '';
            popEl.textContent = '';
            popEl.style.display = 'none';
            loadingEl.style.display = 'block';
            imgWrap.style.display = 'none';
            const sourceElInit = document.getElementById('city-info-source');
            if (sourceElInit) sourceElInit.style.display = 'none';

            const query = CITY_INFO_OVERRIDES[cleanName] || cleanName;
            const deUrl = `https://de.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const enUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

            Promise.allSettled([
                fetch(deUrl).then(r => r.ok ? r.json() : Promise.reject(r.status)),
                fetch(enUrl).then(r => r.ok ? r.json() : Promise.reject(r.status))
            ]).then(results => {
                if (token !== cityInfoFetchToken) return; // stale
                loadingEl.style.display = 'none';
                const de = results[0].status === 'fulfilled' ? results[0].value : null;
                const en = results[1].status === 'fulfilled' ? results[1].value : null;
                const primary = de || en;
                if (!primary) {
                    extractEl.textContent = 'Info nicht verfügbar (Wikipedia).';
                    return;
                }
                if (primary.title) titleEl.textContent = primary.title.toUpperCase();
                extractEl.textContent = primary.extract || 'Keine Beschreibung verfügbar.';

                // Prefer EN image (often skyline/landmark), fallback to DE
                let imgSrc = null;
                const enImg = en && (en.originalimage || en.thumbnail);
                const deImg = de && (de.originalimage || de.thumbnail);
                const img = enImg || deImg;
                if (img && img.source) imgSrc = img.source;
                const sourceEl = document.getElementById('city-info-source');
                if (imgSrc) {
                    imgEl.src = imgSrc;
                    imgWrap.style.display = 'block';
                    const pageUrl = de?.content_urls?.desktop?.page || en?.content_urls?.desktop?.page;
                    if (sourceEl && pageUrl) {
                        sourceEl.href = pageUrl;
                        sourceEl.style.display = 'block';
                    } else if (sourceEl) {
                        sourceEl.style.display = 'none';
                    }
                } else if (sourceEl) {
                    sourceEl.style.display = 'none';
                }

                // Try Wikidata for population
                const qid = (de && de.wikibase_item) || (en && en.wikibase_item);
                if (qid) {
                    fetchWikidataPopulation(qid).then(pop => {
                        if (token !== cityInfoFetchToken) return;
                        if (pop) {
                            popEl.textContent = `EINWOHNER: ${formatPopulation(pop)}`;
                            popEl.style.display = 'block';
                        }
                    });
                }
            });
        }

        function hideCityInfo() {
            cityInfoCurrentName = null;
            const box = document.getElementById('city-info-box');
            if (box) box.style.display = 'none';
        }

        function updateCityInfoBoxPosition() {
            const box = document.getElementById('city-info-box');
            const canvasEl = document.getElementById('canvas');
            if (!box || !canvasEl) return;

            const canvasRect = canvasEl.getBoundingClientRect();
            const w = canvasRect.width;
            const h = canvasRect.height;
            const size = Math.min(w, h) * 0.8;
            const r = size / 2;
            const cx = w / 2;

            // Responsive Box-Breite zur Uhr-Größe
            const clamp = (lo, v, hi) => Math.max(lo, Math.min(hi, v));
            const boxWidth = clamp(160, r * 0.62, 340);
            box.style.width = boxWidth + 'px';

            // Responsive Schriftgrößen
            const titleSize = clamp(11, r * 0.042, 20);
            const popSize = clamp(9, r * 0.032, 16);
            const extractSize = clamp(10, r * 0.034, 16);
            const imgHeight = clamp(60, r * 0.36, 200);

            const titleEl = document.getElementById('city-info-title');
            const popEl = document.getElementById('city-info-pop');
            const extractEl = document.getElementById('city-info-extract');
            const loadingEl = document.getElementById('city-info-loading');
            const imgWrap = document.getElementById('city-info-img-wrap');

            if (titleEl) titleEl.style.fontSize = titleSize + 'px';
            if (popEl) popEl.style.fontSize = popSize + 'px';
            if (extractEl) {
                extractEl.style.fontSize = extractSize + 'px';
                extractEl.style.maxHeight = (h * 0.55) + 'px';
            }
            if (loadingEl) loadingEl.style.fontSize = extractSize + 'px';
            if (imgWrap) imgWrap.style.height = imgHeight + 'px';

            // Position der "18" auf dem Stundenring (links, bei 9-Uhr-Position)
            // angle für i=18: (12-18)*(2PI/24) - PI/2 = -PI  →  cos = -1
            // tx = cos(-PI) * (r * 1.15 - r * 0.022) = -r * 1.128
            const hourLabelInset = r * 0.022;
            const eighteenX = canvasRect.left + cx - (r * 1.15 - hourLabelInset);

            // Box rechts-Kante 40px links der "18"
            const newLeft = eighteenX - 40 - boxWidth;
            box.style.left = Math.max(0, newLeft) + 'px';
        }
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
                        globeInstance
                            .pointsData([{ lat: globeLat, lng: globeLon }])
                            .pointLat('lat')
                            .pointLng('lng')
                            .pointColor(() => 'red')
                            .pointAltitude(0.01)
                            .pointRadius(0.6)
                            .ringsData([{ lat: globeLat, lng: globeLon }])
                            .ringColor(() => 'rgba(255, 0, 0, 1)')
                            .ringMaxRadius(5)
                            .ringPropagationSpeed(5)
                            .ringRepeatPeriod(1000);
                    }
                    // Force exact size & re-sync after layout settles
                    syncGlobeSize();
                    requestAnimationFrame(syncGlobeSize);
                    setTimeout(syncGlobeSize, 400);
                    window.addEventListener('resize', syncGlobeSize);
                })();
            });
        }


        // URL-Parameter: ?city=Leipzig benennt Dresden um.
        // Zusätzlich beliebig viele weitere Overrides per Stadtname als Schlüssel:
        //   ?Tokio=Osaka&NewYork=Boston&Bombay=Mumbai
        try {
            const params = new URLSearchParams(window.location.search);
            const norm = s => (s || '').toLowerCase().replace(/[\s\n]+/g, '');
            const customName = params.get('city');
            if (customName) {
                const dresden = cities.find(c => c.tz === 'Europe/Berlin');
                if (dresden) dresden.name = customName;
            }
            params.forEach((value, key) => {
                if (key === 'city' || key === 'name' || !value) return;
                const target = cities.find(c => norm(c.name) === norm(key));
                if (target) target.name = value;
            });
        } catch (e) { /* ignore */ }

        // Highlight the city matching the visitor's local timezone (fallback: Dresden)
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localCity = cities.find(c => c.tz === localTz) || cities.find(c => c.tz === "Europe/Berlin");
        if (localCity) localCity.highlight = true;

        let manualOffset = 0; // in minutes
        let debugDayOffset = 0; // DEBUG: step the displayed date (Arrow keys) to watch the Moon, in days
        let autoRotation = 0;
        let autoRotationEnabled = false;
        let isMouseDown = false;
        let globeRotationTimeout = null;
        let lockedCity = null; // Globe stays pointed at this city until clicked elsewhere

        let lastMouseAngle = 0;
        let globeLat = 89.99;  // Current globe view latitude (used by auto-rotation before user drag)
        let globeLng = 0;      // Current globe view longitude (used by auto-rotation before user drag)
        let globeManuallyDragged = false;  // Once true, TrackballControls owns the camera
        let isReturning = false;
        let cityFontGray = 200; // Dynamic gray for city labels
        let ringFontGray = 222; // Dynamic gray for standard ring hours
        // RELATED_CITIES_DB defined in world-cities.js (loaded above).

        // Pre-fetch Nachbarstädte via Photon falls TZ nicht in RELATED_CITIES_DB
        async function ensureNeighborsForTZ(tz, lat, lon, excludeName) {
            if (!tz || RELATED_CITIES_DB[tz]) return;
            if (window._neighborCache?.[tz]) return;
            try {
                if (typeof DebugWindow !== 'undefined') DebugWindow.log(`  Photon /reverse für ${tz} (${lat}, ${lon})`);
                const t0 = performance.now();
                const nr = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&limit=12&radius=200&layer=city`);
                const nd = await nr.json();
                const feats = nd.features || [];
                if (typeof DebugWindow !== 'undefined') DebugWindow.log(`  Photon HTTP ${nr.status} (${Math.round(performance.now() - t0)}ms), features: ${feats.length}`);
                const ccToFlag = cc => cc ? String.fromCodePoint(...cc.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '📍';
                if (!window._neighborCache) window._neighborCache = {};
                window._neighborCache[tz] = feats
                    .filter(f => f.properties?.name && f.properties.name.toLowerCase() !== (excludeName || '').toLowerCase())
                    .slice(0, 5)
                    .map(f => ({
                        name: f.properties.name,
                        f: ccToFlag(f.properties.countrycode),
                        lat: f.geometry.coordinates[1],
                        lng: f.geometry.coordinates[0]
                    }));
                if (typeof DebugWindow !== 'undefined') DebugWindow.log(`  ✓ Cache[${tz}]: ${window._neighborCache[tz].map(c => c.name).join(', ') || 'LEER'}`);
            } catch (err) {
                if (typeof DebugWindow !== 'undefined') DebugWindow.log(`  ✗ Photon-Fehler: ${err.message}`);
            }
        }

        let selectedCity = null; // Currently clicked city
        let hoveredCity = null; // New for hover preview
        let targetCity = null;  // Last city to show during fade-out
        let displayAlpha = 0;   // For smooth fade in/out
        let flagHitboxes = [];
        let hoveredFlagIndex = null; // Use index to distinguish same flags

        let redCheckHitbox = null; // Hitbox of the in-popup ROT checkbox in canvas coords
        let highlightBtnHitbox = null; // Hitbox of the HIGHLIGHT button in canvas coords
        let imprintHitbox = null;  // Hitbox of the "Impressum · ..." footer in canvas coords

        const RED_STORAGE_KEY = 'worldclock.redCities';
        try {
            const saved = JSON.parse(localStorage.getItem(RED_STORAGE_KEY) || '[]');
            const redSet = new Set(saved);
            cities.forEach(c => { if (redSet.has(c.tz)) c.red = true; });
        } catch (e) { /* ignore corrupt storage */ }
        function persistRedCities() {
            try {
                const reds = cities.filter(c => c.red).map(c => c.tz);
                localStorage.setItem(RED_STORAGE_KEY, JSON.stringify(reds));
            } catch (e) { /* ignore */ }
        }

        function getDisplayTime() {
            const now = new Date(window.getPlaybackTime ? window.getPlaybackTime() : Date.now());
            return new Date(now.getTime() + manualOffset * 60000 + debugDayOffset * 86400000);
        }

        // DEBUG: step the displayed date/time so the Moon (phase + orientation) can be watched.
        //   →/← = ±/∓ 1 day,   ↑/↓ = ±/∓ 1 hour,   0 = back to now.
        document.addEventListener('keydown', (e) => {
            const t = e.target;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
            if (e.key === 'ArrowRight')      debugDayOffset += 1;
            else if (e.key === 'ArrowLeft')  debugDayOffset -= 1;
            else if (e.key === 'ArrowUp')    debugDayOffset += 1 / 24;
            else if (e.key === 'ArrowDown')  debugDayOffset -= 1 / 24;
            else if (e.key === '0')          debugDayOffset = 0;
            else return;
            e.preventDefault();
            try { DebugWindow.log('[debug] Datum-Offset ' + debugDayOffset.toFixed(3) + ' d → ' + getDisplayTime().toLocaleString('de-DE')); } catch (_) {}
        });

        function getMouseAngle(e) {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - (rect.left + rect.width / 2);
            const my = e.clientY - (rect.top + rect.height / 2);
            return Math.atan2(my, mx);
        }

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mxCanvas = e.clientX - rect.left;
            const myCanvas = e.clientY - rect.top;
            const mx = e.clientX - (rect.left + rect.width / 2);
            const my = e.clientY - (rect.top + rect.height / 2);
            const dist = Math.sqrt(mx*mx + my*my);
            const mouseAngle = Math.atan2(my, mx) * 180 / Math.PI;

            // HIGHLIGHT button hit test (in popup, takes precedence)
            if (highlightBtnHitbox && targetCity &&
                mxCanvas >= highlightBtnHitbox.x && mxCanvas <= highlightBtnHitbox.x + highlightBtnHitbox.w &&
                myCanvas >= highlightBtnHitbox.y && myCanvas <= highlightBtnHitbox.y + highlightBtnHitbox.h) {
                targetCity.red = !targetCity.red;
                persistRedCities();
                return;
            }

            // Flag/neighbor city click → rotate globe
            if (flagHitboxes.length > 0) {
                const clickedBox = flagHitboxes.find(b =>
                    b.absX != null &&
                    mxCanvas >= b.absX && mxCanvas <= b.absX + b.w &&
                    myCanvas >= b.absY && myCanvas <= b.absY + b.h
                );
                if (clickedBox) {
                    showCityInfo(clickedBox.name);
                    if (globeInstance && clickedBox.lat != null) {
                        let lat = clickedBox.lat, lng = clickedBox.lng;
                        // Use globe coordinates if available
                        if (clickedBox.globeLat != null) lat = clickedBox.globeLat;
                        if (clickedBox.globeLon != null) lng = clickedBox.globeLon;
                        lockedCity = { lat, lng };
                        requestAnimationFrame(() => {
                            if (globeInstance) globeInstance.pointOfView({ lat, lng, altitude: fitGlobeAltitude() }, 1000);
                        });
                        // Update red dot + pulsating ring to new city
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
                    return;
                }
            }

            // Impressum hit test
            if (imprintHitbox &&
                mxCanvas >= imprintHitbox.x && mxCanvas <= imprintHitbox.x + imprintHitbox.w &&
                myCanvas >= imprintHitbox.y && myCanvas <= imprintHitbox.y + imprintHitbox.h) {
                window.location.href = 'impressum.html';
                return;
            }

            // Globe toggle icon hit test
            if (globeIconHitbox) {
                const dx = mxCanvas - globeIconHitbox.cx;
                const dy = myCanvas - globeIconHitbox.cy;
                if (Math.sqrt(dx*dx + dy*dy) <= globeIconHitbox.r) {
                    toggleGlobe();
                    return;
                }
            }
            // Direction-toggle icon hit test
            if (dirIconHitbox) {
                const dx = mxCanvas - dirIconHitbox.cx;
                const dy = myCanvas - dirIconHitbox.cy;
                if (Math.sqrt(dx*dx + dy*dy) <= dirIconHitbox.r) {
                    setDirection(!CW);
                    return;
                }
            }

            // Hit test for cities - rotate globe to city
            let hit = false;
            const size = Math.min(rect.width, rect.height) * 0.8;
            const r = size / 2;
            const time = getDisplayTime();
            const utcHours = time.getUTCHours() + time.getUTCMinutes() / 60 + time.getUTCSeconds() / 3600;
            const mapRotation = dirSign * (12 - (utcHours + 1)) * 15 + autoRotation;

            cities.forEach(city => {
                const cityAngle = (dirSign * (-city.lon) + mapRotation - 90);
                let diff = (mouseAngle - cityAngle + 540) % 360 - 180;

                // If distance is near the plaques and angle is close
                if (dist > r * 0.8 && dist < r * 1.1 && Math.abs(diff) < 7) {
                    selectedCity = city;
                    ensureNeighborsForTZ(city.tz, city.globeLat ?? city.lat, city.globeLon ?? city.lon, city.name);
                    showCityInfo(city.name);
                    if (globeInstance) {
                        lockedCity = city;
                        globeManuallyDragged = false;
                        const gLat = city.globeLat !== undefined ? city.globeLat : city.lat;
                        const gLon = city.globeLon !== undefined ? city.globeLon : city.lon;
                        const target = { lat: gLat, lng: gLon, altitude: fitGlobeAltitude() };

                        // Wait one frame so the render-loop pointOfView(.., 0) doesn't kill our animation
                        requestAnimationFrame(() => {
                            if (globeInstance && lockedCity === city) {
                                globeInstance.pointOfView(target, 1000);
                            }
                        });

                        // Static red dot + pulsating ring (1s) at city location
                        globeInstance
                            .pointsData([{ lat: gLat, lng: gLon }])
                            .pointLat('lat')
                            .pointLng('lng')
                            .pointColor(() => 'red')
                            .pointAltitude(0.01)
                            .pointRadius(0.6)
                            .ringsData([{ lat: gLat, lng: gLon }])
                            .ringColor(() => 'rgba(255, 0, 0, 1)')
                            .ringMaxRadius(5)
                            .ringPropagationSpeed(5)
                            .ringRepeatPeriod(1000);
                    }
                    hit = true;
                }
            });

            if (!hit) {
                selectedCity = null;
                if (lockedCity) {
                    lockedCity = null;
                    if (globeInstance) globeInstance.ringsData([]).pointsData([]);
                }
                hideCityInfo();
            }

            isMouseDown = true;
            isReturning = false;
            lastMouseAngle = Math.atan2(my, mx);
            autoRotationEnabled = false;
            const btn = document.getElementById('rotation-btn');
            if (btn) {
                btn.innerText = 'ROTATION START';
                btn.style.borderColor = 'var(--neon-blue)';
                btn.style.color = 'var(--neon-blue)';
                btn.style.boxShadow = 'none';
            }
        });

        window.addEventListener('mousemove', (e) => {
            window.lastMouseX = e.clientX;
            window.lastMouseY = e.clientY;
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - (rect.left + rect.width / 2);
            const my = e.clientY - (rect.top + rect.height / 2);
            // Existing hover logic continues as before

            if (isMouseDown) {
                // Globe mode is handled by globe.gl's TrackballControls directly
                if (!window.useGlobe) {
                    const currentAngle = Math.atan2(my, mx);
                    let delta = currentAngle - lastMouseAngle;
                    if (delta > Math.PI) delta -= Math.PI * 2;
                    if (delta < -Math.PI) delta += Math.PI * 2;

                    manualOffset -= dirSign * delta * (1440 / (Math.PI * 2));
                    lastMouseAngle = currentAngle;
                }
                hoveredCity = null;
            } else {
                // Hover hit-test
                const dist = Math.sqrt(mx*mx + my*my);
                const mouseAngle = Math.atan2(my, mx) * 180 / Math.PI;
                const size = Math.min(rect.width, rect.height) * 0.8;
                const r = size / 2;
                const time = getDisplayTime();
                const utcHours = time.getUTCHours() + time.getUTCMinutes() / 60 + time.getUTCSeconds() / 3600;
                const mapRotation = (12 - (utcHours + 1)) * 15 + autoRotation;

                let found = null;
                cities.forEach(city => {
                    const cityAngle = (-city.lon + mapRotation - 90);
                    let diff = (mouseAngle - cityAngle + 540) % 360 - 180;
                    if (dist > r * 0.8 && dist < r * 1.1 && Math.abs(diff) < 7) {
                        found = city;
                    }
                });
                hoveredCity = found;

                const mxC = e.clientX - rect.left;
                const myC = e.clientY - rect.top;
                let foundFlagIdx = null;
                if (targetCity && displayAlpha > 0.5) {
                    for (let box of flagHitboxes) {
                        if (box.absX != null &&
                            mxC >= box.absX && mxC <= box.absX + box.w &&
                            myC >= box.absY && myC <= box.absY + box.h) {
                            foundFlagIdx = box.index;
                            break;
                        }
                    }
                }
                hoveredFlagIndex = foundFlagIdx;

                const mxCanvas = e.clientX - rect.left;
                const myCanvas = e.clientY - rect.top;
                const overImprint = imprintHitbox &&
                    mxCanvas >= imprintHitbox.x && mxCanvas <= imprintHitbox.x + imprintHitbox.w &&
                    myCanvas >= imprintHitbox.y && myCanvas <= imprintHitbox.y + imprintHitbox.h;
                let overGlobeIcon = false;
                if (globeIconHitbox) {
                    const ddx = mxCanvas - globeIconHitbox.cx;
                    const ddy = myCanvas - globeIconHitbox.cy;
                    overGlobeIcon = Math.sqrt(ddx*ddx + ddy*ddy) <= globeIconHitbox.r;
                }
                let overDirIcon = false;
                if (dirIconHitbox) {
                    const ddx = mxCanvas - dirIconHitbox.cx;
                    const ddy = myCanvas - dirIconHitbox.cy;
                    overDirIcon = Math.sqrt(ddx*ddx + ddy*ddy) <= dirIconHitbox.r;
                }
                const onHittable = !!(found || foundFlagIdx !== null || overImprint || overGlobeIcon || overDirIcon);
                canvas.style.cursor = onHittable ? 'pointer' : 'default';
                // In globe mode, only capture pointer events when over a hittable element
                // so TrackballControls receives events for empty-area drags
                if (window.useGlobe) {
                    document.body.classList.toggle('canvas-hit', onHittable);
                }
            }
        });

        window.addEventListener('mouseup', () => {
            isMouseDown = false;
            isReturning = true; // Start smooth return
        });

        // Touch support for iPad/mobile rotation
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 0) return;
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const mxCanvas = touch.clientX - rect.left;
            const myCanvas = touch.clientY - rect.top;
            const mx = touch.clientX - (rect.left + rect.width / 2);
            const my = touch.clientY - (rect.top + rect.height / 2);

            // For two-finger touch, let TrackballControls handle it (pinch/rotate)
            if (e.touches.length >= 2) return;

            // Single touch: use same hit-test logic as mousedown
            const dist = Math.sqrt(mx*mx + my*my);
            const touchAngle = Math.atan2(my, mx) * 180 / Math.PI;

            // HIGHLIGHT button hit test
            if (highlightBtnHitbox && targetCity &&
                mxCanvas >= highlightBtnHitbox.x && mxCanvas <= highlightBtnHitbox.x + highlightBtnHitbox.w &&
                myCanvas >= highlightBtnHitbox.y && myCanvas <= highlightBtnHitbox.y + highlightBtnHitbox.h) {
                targetCity.red = !targetCity.red;
                persistRedCities();
                e.preventDefault();
                return;
            }

            // Flag/neighbor city hit test
            if (flagHitboxes.length > 0) {
                const clickedBox = flagHitboxes.find(b =>
                    b.absX != null &&
                    mxCanvas >= b.absX && mxCanvas <= b.absX + b.w &&
                    myCanvas >= b.absY && myCanvas <= b.absY + b.h
                );
                if (clickedBox) {
                    showCityInfo(clickedBox.name);
                    if (globeInstance && clickedBox.lat != null) {
                        let lat = clickedBox.lat, lng = clickedBox.lng;
                        if (clickedBox.globeLat != null) lat = clickedBox.globeLat;
                        if (clickedBox.globeLon != null) lng = clickedBox.globeLon;
                        lockedCity = { lat, lng };
                        requestAnimationFrame(() => {
                            if (globeInstance) globeInstance.pointOfView({ lat, lng, altitude: fitGlobeAltitude() }, 1000);
                        });
                    }
                    e.preventDefault();
                    return;
                }
            }

            // Impressum hit test
            if (imprintHitbox &&
                mxCanvas >= imprintHitbox.x && mxCanvas <= imprintHitbox.x + imprintHitbox.w &&
                myCanvas >= imprintHitbox.y && myCanvas <= imprintHitbox.y + imprintHitbox.h) {
                window.location.href = 'impressum.html';
                e.preventDefault();
                return;
            }

            // Direction-toggle hit test
            if (dirIconHitbox) {
                const dx = mxCanvas - dirIconHitbox.cx;
                const dy = myCanvas - dirIconHitbox.cy;
                if (Math.sqrt(dx*dx + dy*dy) <= dirIconHitbox.r) {
                    setDirection(!CW);
                    e.preventDefault();
                    return;
                }
            }
            // Globe toggle hit test
            if (globeIconHitbox) {
                const dx = mxCanvas - globeIconHitbox.cx;
                const dy = myCanvas - globeIconHitbox.cy;
                if (Math.sqrt(dx*dx + dy*dy) <= globeIconHitbox.r) {
                    toggleGlobe();
                    e.preventDefault();
                    return;
                }
            }

            isMouseDown = true;
            isReturning = false;
            lastMouseAngle = Math.atan2(my, mx);
            autoRotationEnabled = false;
        }, false);

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 0) return;
            // Two-finger touch: let TrackballControls handle it
            if (e.touches.length >= 2) return;

            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const mx = touch.clientX - (rect.left + rect.width / 2);
            const my = touch.clientY - (rect.top + rect.height / 2);

            if (isMouseDown) {
                if (!window.useGlobe) {
                    const currentAngle = Math.atan2(my, mx);
                    let delta = currentAngle - lastMouseAngle;
                    if (delta > Math.PI) delta -= Math.PI * 2;
                    if (delta < -Math.PI) delta += Math.PI * 2;
                    // Mirror mousemove: drive manualOffset so touchend triggers
                    // the same smooth return-to-real-time animation.
                    manualOffset -= dirSign * delta * (1440 / (Math.PI * 2));
                    lastMouseAngle = currentAngle;
                }
            }
        }, false);

        canvas.addEventListener('touchend', (e) => {
            isMouseDown = false;
            isReturning = true;
        }, false);

        // --- Render helpers extracted from drawFrame (intra-file; read/write top-level state directly) ---
        function drawNumbersRing(r) {
            const hourFontSize = Math.max(12, r * 0.0875);
            const hourLabelInset = r * 0.022;
            const tickInset = r * 0.016;
            const hourGlow12 = r * 0.047;
            const hourGlowOther = r * 0.031;
            ctx.font = `400 ${hourFontSize}px Orbitron`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (let i = 1; i <= 24; i++) {
                const angle = dirSign * (12 - i) * (Math.PI * 2 / 24) - Math.PI / 2;
                const tx = Math.cos(angle) * (r * 1.15 - hourLabelInset);
                const ty = Math.sin(angle) * (r * 1.15 - hourLabelInset);

                let color = `rgb(${ringFontGray},${ringFontGray},${ringFontGray})`;
                let glow = false;

                if (i === 12 || i === 6 || i === 18 || i === 24) { color = "#ffaa00"; glow = true; }
                if (window.__openMode && i !== 12 && i !== 18) {
                    const ranges = window.__openRanges || [];
                    const isOpen = ranges.some(([a, b]) => i >= a && i <= b);
                    if (isOpen) {
                        color = "rgb(121, 158, 49)";
                        glow = (i === 6 || i === 24);
                    }
                }

                ctx.save();
                ctx.fillStyle = color;
                if (glow) {
                    ctx.shadowBlur = (i === 12) ? hourGlow12 : hourGlowOther;
                    ctx.shadowColor = color;
                }
                ctx.fillText(i, tx, ty);
                ctx.restore();

                // Hour Ticks
                ctx.save();
                ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * (r * 1.02 - tickInset), Math.sin(angle) * (r * 1.02 - tickInset));
                ctx.lineTo(Math.cos(angle) * (r * 1.08 - tickInset), Math.sin(angle) * (r * 1.08 - tickInset));
                ctx.stroke();
                ctx.restore();

                // Half-Hour Ticks (Only Tics)
                const halfAngle = angle - (Math.PI / 24);
                ctx.save();
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.beginPath();
                ctx.moveTo(Math.cos(halfAngle) * (r * 1.02 - tickInset), Math.sin(halfAngle) * (r * 1.02 - tickInset));
                ctx.lineTo(Math.cos(halfAngle) * (r * 1.05 - tickInset), Math.sin(halfAngle) * (r * 1.05 - tickInset));
                ctx.stroke();
                ctx.restore();
            }
        }

        function drawDateLine(r, markerInset, mapRotation) {
            const dlAngle = dirSign * (-(-172.5)) * Math.PI / 180 - Math.PI / 2; // angular midpoint of the two cities
            const dlMarkerR = (r * 0.9) - markerInset;
            const Rt = r * 0.012;                    // circumradius of the small equilateral triangle (side = Rt·√3)
            const dlR = r * 0.773 - Rt;              // centre placed so the TIP sits on the world-disc rim (= MAP_SCALE)
            const cx0 = Math.cos(dlAngle) * dlR, cy0 = Math.sin(dlAngle) * dlR;
            ctx.save();
            ctx.fillStyle = "rgb(200, 200, 200)";    // light grey (triangle + label)
            ctx.beginPath();
            for (let k = 0; k < 3; k++) {            // 3 vertices 120° apart → equilateral; k=0 points radially outward
                const a = dlAngle + k * (2 * Math.PI / 3);
                const vx = cx0 + Math.cos(a) * Rt, vy = cy0 + Math.sin(a) * Rt;
                if (k === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
            }
            ctx.closePath();
            ctx.fill();
            // "DATUMSGRENZE" radial from the triangle toward the centre — kept upright (accounts for map rotation)
            const mapRot = mapRotation * Math.PI / 180;
            let R = Math.atan2(Math.sin(dlAngle + mapRot), Math.cos(dlAngle + mapRot)); // on-screen radial (outward)
            const flip = Math.abs(R) > Math.PI / 2;  // pointing left → would be upside-down, use inward direction
            if (flip) R = Math.atan2(Math.sin(R + Math.PI), Math.cos(R + Math.PI));
            ctx.translate(cx0, cy0);
            ctx.rotate(R - mapRot);                  // net on-screen rotation = R ∈ (-90°,90°) → upright
            ctx.font = `${r * 0.022}px Orbitron`;
            ctx.textBaseline = "middle";
            ctx.textAlign = flip ? "left" : "right";
            const dlx = flip ? Rt * 1.6 : -Rt * 1.6;
            ctx.lineJoin = "round";                       // dark halo for legibility — like the NORDPOL/SÜDPOL labels
            ctx.lineWidth = Math.max(1.2, r * 0.006);
            ctx.strokeStyle = "rgba(0,0,0,0.5)";
            ctx.strokeText("DATUMSGRENZE", dlx, 0);
            ctx.fillStyle = "rgb(128, 128, 128)";
            ctx.fillText("DATUMSGRENZE", dlx, 0);
            ctx.restore();
        }

        function drawImprint(r, h) {
            ctx.save();
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            const imprintFontSize = r * 0.031;
            ctx.font = `300 ${imprintFontSize}px Raleway`;
            const imprintText = "Impressum · © Dr. Michael R. Alvers";
            const imprintX = r * 0.06;
            const imprintY = h - r * 0.05;
            const imprintMetrics = ctx.measureText(imprintText);
            // Debug: fade imprint when clock-only mode is active (toggled by 'D')
            if ((window.__clockOnlyAlpha ?? 1) > 0.001) {
                ctx.save();
                ctx.globalAlpha *= (window.__clockOnlyAlpha ?? 1);
                ctx.fillStyle = "rgba(180, 200, 220, 0.7)";
                ctx.fillText(imprintText, imprintX, imprintY);
                ctx.restore();
            }
            imprintHitbox = {
                x: imprintX,
                y: imprintY - imprintFontSize * 1.4,
                w: imprintMetrics.width,
                h: imprintFontSize * 1.4
            };
            ctx.restore();
        }

        function drawMoon(mmx, mmy, mW, mH) {
            ctx.fillStyle = "rgba(0, 10, 30, 0.98)";
            ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(mmx, mmy, mW, mH, 5);
            ctx.fill();
            ctx.stroke();
            if (moonReady) {
                const moonSize = Math.min(mW, mH) - 30;
                const mcx = 0, mcy = mmy + mH / 2, mR = moonSize / 2;
                // Follow the displayed (scrubbable) time, not just real-time — so dragging the city ring
                // rocks the Moon smoothly through its daily parallactic swing; springs back to "now" on release.
                const t = getDisplayTime();
                // Bright-limb orientation for the selected city (continuous, lat/lon/time based).
                const mLat = (targetCity.globeLat ?? targetCity.lat) ?? 0;
                const mLon = (targetCity.globeLon ?? targetCity.lon) ?? 0;
                const rot = moonBrightLimbRotation(t, mLat, mLon);
                // Phase is global (same instant everywhere); only the orientation depends on location.
                const synodic = 29.530588853;
                const knownNew = Date.UTC(2000, 0, 6, 18, 14) / 86400000;  // reference new moon (days)
                const phase = (((t.getTime() / 86400000 - knownNew) / synodic) % 1 + 1) % 1;
                const a = Math.cos(phase * 2 * Math.PI) * mR;              // signed terminator x-extent
                ctx.save();
                // Draw everything in a canonical "bright limb on the right" frame, then rotate it into place.
                ctx.translate(mcx, mcy); ctx.rotate(rot); ctx.translate(-mcx, -mcy);
                // Soft warm glow behind the Moon (before the circle-clip, so the halo can reach past the disc).
                const _glow = ctx.createRadialGradient(mcx, mcy, mR * 0.85, mcx, mcy, mR * 1.25);
                _glow.addColorStop(0, 'rgba(255, 233, 170, 0.22)');
                _glow.addColorStop(1, 'rgba(255, 233, 170, 0)');
                ctx.fillStyle = _glow;
                ctx.fillRect(mcx - mR * 1.25, mcy - mR * 1.25, mR * 2.5, mR * 2.5);
                ctx.drawImage(moonImg, mcx - mR, mcy - mR, moonSize, moonSize);
                ctx.beginPath(); ctx.arc(mcx, mcy, mR, 0, Math.PI * 2); ctx.clip();
                // Warm the Moon a touch yellow (multiply keeps the shaded areas dark).
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = 'rgb(255, 236, 170)';
                ctx.fillRect(mcx - mR, mcy - mR, moonSize, moonSize);
                ctx.globalCompositeOperation = 'source-over';
                // Solid cover, soft terminator via blur. The outer boundary is pushed well past the clip (mR*1.6),
                // so the blurred limb edge gets clipped away → only the terminator (inner edge) is soft; limb stays crisp.
                ctx.fillStyle = "rgba(2, 4, 14, 0.92)";
                ctx.filter = 'blur(' + (mR * 0.16) + 'px)';
                ctx.beginPath();
                ctx.arc(mcx, mcy, mR * 1.6, -Math.PI / 2, Math.PI / 2, true);   // outer boundary beyond the clip circle
                ctx.ellipse(mcx, mcy, Math.abs(a), mR, 0, Math.PI / 2, -Math.PI / 2, a > 0); // terminator → blurs soft
                ctx.fill();
                ctx.filter = 'none';
                ctx.restore();
            }
        }

        // Legend (top-left) + search/link overlay + globe & direction mode icons.
        // Input: r. Writes globeIconHitbox / dirIconHitbox (top-level).
        function drawLegendAndIcons(r) {
            ctx.save();
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            const legendFontSize = r * 0.04;
            const legendX = r * 0.0625;
            const legendY1 = r * 0.10;
            const legendY2 = legendY1 + legendFontSize * 1.5;
            ctx.font = `500 ${legendFontSize}px Orbitron`;

            // Debug: fade canvas legend in clock-only mode (toggled by 'D')
            if ((window.__clockOnlyAlpha ?? 1) > 0.001) {
                ctx.save();
                ctx.globalAlpha *= (window.__clockOnlyAlpha ?? 1);
                ctx.fillStyle = "#ffaa00";
                ctx.fillText("SOMMERZEIT", legendX, legendY1);

                ctx.fillStyle = "rgba(220, 220, 220, 0.9)";
                ctx.fillText("NORMALZEIT", legendX, legendY2);

                // Season icons after the labels: ☀️ after SOMMERZEIT, ❄️ after NORMALZEIT — small, light, no overlap
                const _szW = ctx.measureText("SOMMERZEIT").width;   // measured with the Orbitron font still active
                const _nzW = ctx.measureText("NORMALZEIT").width;
                const _gap = legendFontSize * 0.25;
                const _emoX = legendX + Math.max(_szW, _nzW) + _gap;  // both icons aligned after the wider label
                const _sunSize = legendFontSize * 0.95;               // bigger sun
                const _snowSize = legendFontSize * 0.62;
                ctx.globalAlpha *= 0.7;                               // lighter
                ctx.font = `${_sunSize}px sans-serif`;
                ctx.fillText("☀️", _emoX, legendY1 + (legendFontSize - _sunSize) * 0.5);
                ctx.font = `${_snowSize}px sans-serif`;
                ctx.fillText("❄️", _emoX + (_sunSize - _snowSize) * 0.5, legendY2 + (legendFontSize - _snowSize) * 0.5);  // nudge right so it visually lines up with the bigger sun
                ctx.restore();
            }

            // Globe Toggle Icon (right of legend)
            const sommerW = ctx.measureText("SOMMERZEIT").width;
            const normalW = ctx.measureText("NORMALZEIT").width;
            const legendW = Math.max(sommerW, normalW);

            // Search input (HTML-Overlay, genau unter NORMALZEIT)
            const _si = document.getElementById('wc-search') || (() => {
                const el = document.createElement('input');
                el.id = 'wc-search';
                el.type = 'text';
                el.placeholder = 'Suchen…';
                el.autocomplete = 'off';
                el.style.cssText = 'position:fixed;background:rgba(0,10,30,0.92);color:#00d2ff;border:1px solid rgba(0,210,255,0.55);border-radius:4px;font-family:Orbitron,sans-serif;letter-spacing:0.05em;outline:none;padding:3px 8px;pointer-events:auto;z-index:1000;box-sizing:border-box;';
                document.body.appendChild(el);
                return el;
            })();
            const _cr2 = canvas.getBoundingClientRect();
            const _sx = _cr2.width / canvas.width;
            const _sy = _cr2.height / canvas.height;
            const _siLeft  = legendX * _sx + _cr2.left + 10;
            const _siTop   = (legendY2 + legendFontSize * 3.0) * _sy + _cr2.top + 34;
            const _siW     = legendW * _sx * 2 + 50;
            const _siH     = legendFontSize * 1.8 * _sy + 10;
            _si.style.left     = _siLeft + 'px';
            _si.style.top      = _siTop + 'px';
            _si.style.width    = _siW + 'px';
            _si.style.fontSize = (legendFontSize * 1.1 * _sy) + 'px';
            _si.style.height   = _siH + 'px';

            // Link icon below search input (left-aligned)
            const _lnk = document.getElementById('wc-link-icon') || (() => {
                const el = document.createElement('div');
                el.id = 'wc-link-icon';
                el.title = 'Personalisierten Link erstellen';
                el.style.cssText = 'position:fixed;cursor:pointer;z-index:1000;opacity:0.65;pointer-events:auto;color:#00d2ff;line-height:1;display:flex;align-items:center;gap:6px;';
                el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg><span style="font-family:Orbitron,sans-serif;font-size:10px;letter-spacing:0.05em;color:#00d2ff;">Personalisieren</span>';
                el.addEventListener('mouseenter', () => el.style.opacity = '1');
                el.addEventListener('mouseleave', () => el.style.opacity = '0.65');
                el.addEventListener('click', () => {
                    let pop = document.getElementById('wc-personalize-popup');
                    if (pop) { pop.style.display = pop.style.display === 'none' ? 'flex' : 'none'; return; }
                    pop = document.createElement('div');
                    pop.id = 'wc-personalize-popup';
                    pop.style.cssText = [
                        'position:fixed;z-index:2000;display:flex;flex-direction:column;gap:10px;',
                        'background:rgba(8,20,42,0.97);border:1px solid rgba(0,210,255,0.45);border-radius:6px;',
                        'padding:16px 18px;min-width:320px;max-width:420px;',
                        'font-family:Orbitron,sans-serif;color:#00d2ff;',
                        'top:50%;left:50%;transform:translate(-50%,-50%);',
                        'box-shadow:0 0 32px rgba(0,210,255,0.15);',
                    ].join('');
                    pop.innerHTML = [
                        '<div style="display:flex;justify-content:space-between;align-items:center;">',
                        '  <span style="font-size:11px;letter-spacing:1.5px;opacity:0.9;">PERSONALISIERTE UHR MIT NACHRICHT</span>',
                        '  <span id="wc-pop-close" style="cursor:pointer;opacity:0.55;line-height:1;display:flex;align-items:center;" title="Schließen">',
                        '    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">',
                        '      <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>',
                        '    </svg>',
                        '  </span>',
                        '</div>',
                        '<textarea id="wc-pop-input" placeholder="Deine Nachricht…" rows="4" maxlength="260"',
                        '  style="background:rgba(0,10,30,0.9);color:#00d2ff;border:1px solid rgba(0,210,255,0.4);',
                        '         border-radius:4px;padding:6px 8px;font-family:Orbitron,sans-serif;font-size:11px;',
                        '         letter-spacing:0.05em;outline:none;width:100%;box-sizing:border-box;resize:vertical;',
                        '         line-height:1.6;"></textarea>',
                        '<div id="wc-pop-counter" style="font-size:9px;opacity:0.4;text-align:right;letter-spacing:0.05em;">0 / 260</div>',
                        '<div id="wc-pop-emojis" style="display:flex;flex-wrap:wrap;gap:4px;padding:8px 4px;border-top:1px solid rgba(0,210,255,0.15);border-bottom:1px solid rgba(0,210,255,0.15);"></div>',
                        '<button id="wc-pop-copy" style="font-family:Orbitron,sans-serif;font-size:11px;letter-spacing:1.2px;',
                        '  padding:6px 12px;cursor:pointer;background:rgba(0,210,255,0.08);color:rgba(0,210,255,0.85);',
                        '  border:1px solid rgba(0,210,255,0.3);border-radius:4px;transition:background 0.15s;">LINK MIT NACHRICHT KOPIEREN</button>',
                    ].join('');
                    document.body.appendChild(pop);

                    const inp = document.getElementById('wc-pop-input');
                    const counter = document.getElementById('wc-pop-counter');
                    inp.addEventListener('input', () => {
                        counter.textContent = inp.value.length + ' / 260';
                        counter.style.opacity = inp.value.length > 230 ? '0.85' : '0.4';
                    });
                    const copyBtn = document.getElementById('wc-pop-copy');

                    copyBtn.addEventListener('click', () => {
                        const msg = inp.value.trim();
                        const params = new URLSearchParams(window.location.search);
                        params.delete('m');
                        params.delete('message');
                        try {
                            const compressed = pako.deflate(msg);
                            const b64 = btoa(String.fromCharCode(...compressed))
                                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                            params.set('m', b64);
                        } catch (_) {
                            params.set('message', msg);
                        }
                        const qs = params.toString();
                        const link = window.location.origin + '/worldclock/worldclock.html' + (qs ? '?' + qs : '');
                        navigator.clipboard.writeText(link).then(() => {
                            copyBtn.textContent = 'KOPIERT!';
                            setTimeout(() => { copyBtn.textContent = 'LINK MIT NACHRICHT KOPIEREN'; }, 1800);
                        }).catch(() => {
                            copyBtn.textContent = 'FEHLER';
                            setTimeout(() => { copyBtn.textContent = 'LINK MIT NACHRICHT KOPIEREN'; }, 1800);
                        });
                    });

                    // Emoji panel: click inserts at cursor position in textarea
                    const emojis = ['😀','😂','😉','😊','😍','🤔','🙈','👍','🙏','👋','❤️','🎉','✨','🔥','⭐','🌻','🌍','⏰','☀️','🌙','☕','🚀'];
                    const emojiPanel = document.getElementById('wc-pop-emojis');
                    emojis.forEach(e => {
                        const btn = document.createElement('span');
                        btn.textContent = e;
                        btn.style.cssText = 'cursor:pointer;font-size:18px;line-height:1;padding:3px 5px;border-radius:3px;user-select:none;transition:background 0.1s;';
                        btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,210,255,0.18)');
                        btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');
                        btn.addEventListener('mousedown', ev => ev.preventDefault());
                        btn.addEventListener('click', () => {
                            const start = inp.selectionStart;
                            const end = inp.selectionEnd;
                            const v = inp.value;
                            inp.value = v.slice(0, start) + e + v.slice(end);
                            const pos = start + e.length;
                            inp.setSelectionRange(pos, pos);
                            inp.focus();
                            inp.dispatchEvent(new Event('input'));
                        });
                        emojiPanel.appendChild(btn);
                    });

                    document.getElementById('wc-pop-close').addEventListener('click', () => {
                        pop.style.display = 'none';
                    });
                });
                document.body.appendChild(el);
                return el;
            })();
            _lnk.style.left = _siLeft + 'px';
            _lnk.style.top  = (_siTop + _siH + 12) + 'px';


            /* debug output disabled
            _dbg.textContent =
                `vw:${window.innerWidth}×${window.innerHeight}  dpr:${window.devicePixelRatio}\n` +
                `chrome:${Math.round(_chR.width)}×${Math.round(_chR.height)}  main:${Math.round(_mcR.width)}×${Math.round(_mcR.height)}\n` +
                `canvas BRC: ${Math.round(_cr2.left)},${Math.round(_cr2.top)} ${Math.round(_cr2.width)}×${Math.round(_cr2.height)}\n` +
                `canvas px: ${canvas.width}×${canvas.height}\n` +
                `legendX:${Math.round(legendX)} legendY2:${Math.round(legendY2)} legendW:${Math.round(legendW)}\n` +
                `_sx:${_sx.toFixed(3)} _sy:${_sy.toFixed(3)}\n` +
                `wc-search: left=${Math.round(_siLeft)} top=${Math.round(_siTop)} w=${Math.round(_siW)} h=${Math.round(_siH)}`;
            */

            const iconR = legendFontSize * 0.9;
            const iconCx = legendX + legendW + iconR * 3.2;
            const iconCy = (legendY1 + legendY2 + legendFontSize) / 2;

            // Debug: fade globe-toggle icon in clock-only mode (toggled by 'D')
            if ((window.__clockOnlyAlpha ?? 1) > 0.001) {
                ctx.save();
                ctx.globalAlpha *= (window.__clockOnlyAlpha ?? 1);
                ctx.strokeStyle = window.useGlobe ? "#00d2ff" : "#888888";
                ctx.fillStyle = "transparent";
                ctx.lineWidth = Math.max(1, legendFontSize * 0.08);

                // Outer circle (globe sphere)
                ctx.beginPath();
                ctx.arc(iconCx, iconCy, iconR, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // 5 horizontal latitude lines (thinner)
                ctx.lineWidth = Math.max(0.5, legendFontSize * 0.04);
                const latLines = [0.65, 0.30, 0, -0.30, -0.65];
                for (let lat of latLines) {
                    const offsetY = lat * iconR;
                    const lineWidth = iconR * Math.sqrt(1 - lat * lat) * 0.95;
                    ctx.beginPath();
                    ctx.moveTo(iconCx - lineWidth, iconCy + offsetY);
                    ctx.lineTo(iconCx + lineWidth, iconCy + offsetY);
                    ctx.stroke();
                }
                ctx.lineWidth = Math.max(1, legendFontSize * 0.08);

                // Central vertical meridian
                ctx.beginPath();
                ctx.moveTo(iconCx, iconCy - iconR);
                ctx.lineTo(iconCx, iconCy + iconR);
                ctx.stroke();

                // Vertical ellipse (3D depth)
                ctx.beginPath();
                ctx.ellipse(iconCx, iconCy, iconR * 0.48, iconR, 0, 0, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // Store hitbox in canvas coords (legend was translated by (-r, -r) earlier? check)
            globeIconHitbox = {
                cx: iconCx, cy: iconCy, r: iconR * 1.3
            };

            // --- Rotation-direction toggle icon: a circular arrow, right of the globe icon ---
            // Same coordinate space + hitbox style as the globe icon → reposition = change the offset below.
            const dirCx = iconCx + iconR * 3.1;
            const dirCy = iconCy + 1;
            if ((window.__clockOnlyAlpha ?? 1) > 0.001) {
                ctx.save();
                ctx.globalAlpha *= (window.__clockOnlyAlpha ?? 1);
                const dirColor = window.useGlobe ? "#00d2ff" : "#888888";   // match the globe icon's colour
                ctx.strokeStyle = dirColor;
                ctx.fillStyle = dirColor;
                ctx.lineWidth = Math.max(1, iconR * 0.07);                  // thinner
                ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                ctx.translate(dirCx, dirCy);
                if (!CW) ctx.scale(-1, 1);                 // default CCW = mirrored; CW = as drawn
                const ar = iconR * 0.98;                   // 98% of the globe icon
                const a0 = -Math.PI * 0.5, a1 = Math.PI * 0.95;   // ~260° arc, gap at the top-right for the head
                ctx.beginPath();
                ctx.arc(0, 0, ar, a0, a1);                 // clockwise (screen y-down)
                ctx.stroke();
                // arrowhead at the arc start (a0), pointing along the clockwise direction of travel
                const hx = Math.cos(a0) * ar, hy = Math.sin(a0) * ar;
                const tx = Math.sin(a0), ty = -Math.cos(a0);      // clockwise tangent
                const px = -ty, py = tx;                           // perpendicular
                const ah = iconR * 0.46, aw = iconR * 0.26;
                ctx.beginPath();
                ctx.moveTo(hx + tx * ah, hy + ty * ah);
                ctx.lineTo(hx - tx * ah * 0.2 + px * aw, hy - ty * ah * 0.2 + py * aw);
                ctx.lineTo(hx - tx * ah * 0.2 - px * aw, hy - ty * ah * 0.2 - py * aw);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            dirIconHitbox = { cx: dirCx, cy: dirCy, r: iconR * 1.4 };

            ctx.restore();
        }

        // Central selection panel: time box, neighbor city list, moon box, hover tooltip.
        // Inputs: r, cx, cy, mapRotation, time. Writes highlightBtnHitbox / flagHitboxes (top-level).
        function drawSelectionPanel(r, cx, cy, mapRotation, time) {
            ctx.save();
            ctx.globalAlpha = displayAlpha;

            // Position: center in normal mode, right side in globe mode
            const popupX = window.useGlobe ? cx + r * 1.2 + 90 : cx;
            const popupY = cy;
            ctx.translate(popupX, popupY);

            // Connecting Line (only in normal mode)
            if (!window.useGlobe) {
                const cityAngle = (dirSign * (-targetCity.lon) + mapRotation - 90) * Math.PI / 180;
                const startX = Math.cos(cityAngle) * (r * 0.78);
                const startY = Math.sin(cityAngle) * (r * 0.78);

                ctx.beginPath();
                ctx.strokeStyle = "#aaaaaa"; // Solid Gray
                ctx.lineWidth = 1;
                ctx.moveTo(startX, startY);
                ctx.lineTo(0, 0);
                ctx.stroke();
            }
            // -----------------------

            const localStr = time.toLocaleTimeString('de-DE', {
                timeZone: targetCity.tz,
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            const parts = localStr.split(':'); // [HH, MM, SS]

            const boxW = 190;
            const boxH = 118; // top: HIGHLIGHT button · extra room for the local date above the time
            const rBox = 5;
            const teamYOffset = -(100 + 150 + 2) / 2; // center the 3-box group in y: -(nH + mH + 2 gaps)/2

            // Background Box (Harmonized Style)
            ctx.fillStyle = "rgba(0, 10, 30, 0.98)";
            ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            const x = -boxW/2, y = -boxH/2 + teamYOffset;
            ctx.moveTo(x + rBox, y);
            ctx.lineTo(x + boxW - rBox, y);
            ctx.quadraticCurveTo(x + boxW, y, x + boxW, y + rBox);
            ctx.lineTo(x + boxW, y + boxH - rBox);
            ctx.quadraticCurveTo(x + boxW, y + boxH, x + boxW - rBox, y + boxH);
            ctx.lineTo(x + rBox, y + boxH);
            ctx.quadraticCurveTo(x, y + boxH, x, y + boxH - rBox);
            ctx.lineTo(x, y + rBox);
            ctx.quadraticCurveTo(x, y, x + rBox, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();


            ctx.textAlign = "center";

            // Status (Sommerzeit/Normalzeit) — compute first so HIGHLIGHT button can match its colors
            const dstStatus = getDSTLabel(targetCity.tz);
            const isSZ = (dstStatus === "SZ");
            const dstColor = isSZ ? "#ffaa00" : "rgba(220, 220, 220, 0.9)";
            const dstColorDim = isSZ ? "rgba(255, 170, 0, 0.6)" : "rgba(220, 220, 220, 0.5)";
            const dstColorBg = isSZ ? "rgba(255, 170, 0, 0.18)" : "rgba(220, 220, 220, 0.10)";

            // Highlight state — toggled by tapping the city name now (checkbox + hitbox set below).
            const isHighlightOn = !!(targetCity && targetCity.red);

            // City name + season icon + highlight checkbox. Name centred at 0; checkbox & icon mirrored ±_side → equal margins.
            ctx.textBaseline = "alphabetic";
            const _cityY = y + 32;
            const _cityLbl = targetCity.name.replace(/\n/g, ' ').toUpperCase();
            const _emoji = isSZ ? "☀️" : "❄️";
            const _emFont = (isSZ ? "12px" : "10px") + " sans-serif";   // snowflake reads bigger → a touch smaller
            const _cbS = 13, _gap = 8, _slot = 16, _dx = 3;   // _dx = debug nudge (shift whole row right)
            // Name, centred at x = 0
            ctx.fillStyle = "#00d2ff";              // always cyan — season shown by the icon, not the colour
            ctx.font = "bold 14px Orbitron"; ctx.textAlign = "center";
            const _cityW = ctx.measureText(_cityLbl).width;
            ctx.fillText(_cityLbl, _dx, _cityY);
            // Symmetric offset to each side element's centre (so left/right margins are equal regardless of glyph metrics)
            const _side = _cityW / 2 + _gap + _slot / 2;
            // Season emoji, glyph-centred at +_side (measure & draw both at center align — consistent)
            ctx.font = _emFont;
            const _emM = ctx.measureText(_emoji);
            const _emOff = (_emM.actualBoundingBoxRight !== undefined) ? -(_emM.actualBoundingBoxRight - _emM.actualBoundingBoxLeft) / 2 : 0;
            ctx.fillText(_emoji, _side + _emOff + _dx - 1, _cityY);   // emoji nudged 1px left
            // Highlight checkbox, centred at -_side (checked = red/highlighted)
            const _cbX = -_side - _cbS / 2 + _dx, _cbY = _cityY - 11;
            ctx.save();
            ctx.lineWidth = 1.5; ctx.lineJoin = "round";
            ctx.strokeStyle = isHighlightOn ? "rgb(176, 36, 24)" : "rgba(0, 210, 255, 0.55)";
            ctx.beginPath();
            ctx.roundRect(_cbX, _cbY, _cbS, _cbS, 3);
            if (isHighlightOn) { ctx.fillStyle = "rgba(176, 36, 24, 0.22)"; ctx.fill(); }
            ctx.stroke();
            if (isHighlightOn) {                                    // a clean check mark
                ctx.strokeStyle = "rgb(232, 100, 86)"; ctx.lineWidth = 2; ctx.lineCap = "round";   // brightened base red, visible on the dark fill
                ctx.beginPath();
                ctx.moveTo(_cbX + _cbS * 0.24, _cbY + _cbS * 0.52);
                ctx.lineTo(_cbX + _cbS * 0.43, _cbY + _cbS * 0.72);
                ctx.lineTo(_cbX + _cbS * 0.78, _cbY + _cbS * 0.27);
                ctx.stroke();
            }
            ctx.restore();
            // Tap target = whole symmetric group → toggles highlight
            highlightBtnHitbox = { x: popupX + (-_side - _slot / 2) + _dx - 4, y: popupY + (_cityY - 14), w: 2 * (_side + _slot / 2) + 8, h: 22 };

            // Local date at that city's timezone (above the time) — follows the displayed (debug-stepped) time
            const _now = time;
            const _wd = _now.toLocaleDateString('de-DE', { timeZone: targetCity.tz, weekday: 'short' }).replace('.', '').toUpperCase();
            const _dm = _now.toLocaleDateString('de-DE', { timeZone: targetCity.tz, day: 'numeric', month: 'long', year: 'numeric' });
            // Red when the shown date isn't the real "today" (in that city's timezone) — e.g. while debug-stepping.
            const _realDM = new Date().toLocaleDateString('de-DE', { timeZone: targetCity.tz, day: 'numeric', month: 'long', year: 'numeric' });
            ctx.fillStyle = (_dm === _realDM) ? "rgba(210, 225, 240, 0.85)" : "rgb(176, 36, 24)";
            ctx.font = "600 14.4px Orbitron";   // date +20%
            ctx.fillText(_wd + ' ' + _dm, 0, y + 66);

            // --- Digit Widgets --- (red when the shown time-of-day isn't the real "now" in that city)
            const _liveHM = new Date().toLocaleTimeString('de-DE', { timeZone: targetCity.tz, hour: '2-digit', minute: '2-digit' });
            const _timeIsLive = (_liveHM === parts[0] + ':' + parts[1]);
            const _timeColor = _timeIsLive ? "#fff" : "rgb(176, 36, 24)";
            const drawDigitBox = (val, xPos) => {
                ctx.fillStyle = _timeColor;
                ctx.font = "900 20px Orbitron";
                ctx.fillText(val, xPos, y + 100);
            };

            drawDigitBox(parts[0], -40); // HH
            drawDigitBox(parts[1], 0);   // MM
            drawDigitBox(parts[2], 40);  // SS

            // Colons (Restored) — kept 4px above the digit baseline (digits use y+85)
            ctx.fillStyle = _timeIsLive ? "#00d2ff" : "rgb(176, 36, 24)";   // colons red too when not live
            ctx.font = "bold 14px Orbitron";
            ctx.fillText(":", -20, y + 96);
            ctx.fillText(":", 20, y + 96);

            // --- Neighborhood Cities (Full Map Database with Flags) ---
            const neighbors = RELATED_CITIES_DB[targetCity.tz] || (window._neighborCache?.[targetCity.tz]) || [];
            const nW = 190, nH = 100; // Increased height for larger font
            const nx = -nW/2, ny = y + boxH + 1;   // 1px gap below the time box

            // Dark Background for the list (same frame as the time box above)
            ctx.fillStyle = "rgba(0, 10, 30, 0.98)";
            ctx.strokeStyle = "rgba(0, 210, 255, 0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(nx, ny, nW, nH, 5);
            ctx.fill();
            ctx.stroke();

            flagHitboxes = []; // clear hitboxes

            // Set uniform baseline for perfect vertical alignment
            ctx.textBaseline = "middle";

            neighbors.forEach((item, i) => {
                const centerY = ny + 16 + (i * 18);

                // City Name (Left)
                ctx.fillStyle = (dstStatus === "SZ") ? "#ffaa00" : "rgba(0, 210, 255, 0.9)";
                ctx.font = "400 14px Orbitron";
                ctx.textAlign = "left";
                ctx.fillText(item.name, nx + 10, centerY);

                // Flag (Right)
                ctx.font = "22px Arial"; // Standard Arial for Emojis
                ctx.textAlign = "right";
                // Emojis often need a small 1-2px vertical tweak to visually center
                ctx.fillText(item.f, nx + nW - 10, centerY + 1);

                // Save hitbox perfectly centered on the row
                // x/y: popup-translate-relative (for legacy hover check)
                // absX/absY: canvas-absolute (for click hit-test, account for popupX/popupY translate)
                const hbX = nx + 10;       // covers entire row (city name + flag area)
                const hbY = centerY - 13;
                const hbW = nW - 20;
                const hbH = 26;
                flagHitboxes.push({
                    x: hbX,
                    y: hbY,
                    w: hbW,
                    h: hbH,
                    absX: popupX + hbX,
                    absY: popupY + hbY,
                    countryCode: item.f,
                    index: i,
                    centerY: centerY,
                    lat: item.lat ?? null,
                    lng: item.lng ?? null,
                    globeLat: item.lat ?? null,
                    globeLng: item.lng ?? null,
                    name: item.name
                });
            });

            // Moon box under the city list (same frame)
            {
                const mW = nW, mH = 150;
                const mmx = nx, mmy = ny + nH + 1;    // 1px gap below the list
                drawMoon(mmx, mmy, mW, mH);
            }

            // Draw tooltip if flag is hovered
            if (hoveredFlagIndex !== null) {
                const hoveredBox = flagHitboxes.find(b => b.index === hoveredFlagIndex);
                if (hoveredBox) {
                    const countryName = getCountryName(hoveredBox.countryCode);
                    ctx.save();
                    ctx.font = "400 14px Orbitron";
                    const tw = ctx.measureText(countryName).width;
                    const tooltipW = tw + 20;
                    const tooltipH = 26;

                    const tx = nx + nW + 6; // Right of the box, 4px closer (was 10)
                    const ty = hoveredBox.centerY - tooltipH / 2; // Perfectly align with row

                    ctx.fillStyle = "rgba(0, 15, 30, 0.98)";
                    ctx.strokeStyle = "rgba(0, 210, 255, 0.4)"; // Match the list box border exactly
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.roundRect(tx, ty, tooltipW, tooltipH, 5);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = (dstStatus === "SZ") ? "#ffaa00" : "rgba(0, 210, 255, 0.9)";
                    ctx.textAlign = "left";
                    ctx.textBaseline = "middle";
                    ctx.fillText(countryName, tx + 10, hoveredBox.centerY);
                    ctx.restore();
                }
            }

            ctx.restore();
        }

        // City markers (plaques) glued to the rotating Earth — triangle pointer, coloured disc, name + season icon.
        // Inputs: r, mapRotation. Reads top-level cities / ctx / dirSign / wkoeLogoImg / getDSTLabel.
        function drawCityMarkers(r, mapRotation) {
            // All sizes relative to r (clock radius) for responsive scaling
            const diskR = r * 0.105;
            const markerInset = r * 0.022;
            const tipExtend = r * 0.019;
            const baseInset = r * 0.038;
            const cityFontNormal = Math.max(5, r * 0.030);
            const cityFontHighlight = Math.max(6, r * 0.034);
            const cityLineHeight = r * 0.038;
            const cityShadowBlur = r * 0.031;
            const isWkoeMode = document.documentElement.dataset.school === 'wkoe';
            cities.forEach(city => {
                const cityAngle = dirSign * (-city.lon) * Math.PI / 180 - Math.PI / 2;
                const markerR = (r * 0.9) - markerInset;
                const circleRadius = diskR;
                const mx = Math.cos(cityAngle) * markerR;
                const my = Math.sin(cityAngle) * markerR;
                const isWkoeDresden = isWkoeMode && city.name === 'Dresden';

                // Draw Precision Triangle (Pointer)
                ctx.save();
                ctx.fillStyle = "white";
                ctx.beginPath();
                const tipR = markerR + circleRadius + tipExtend;
                const baseR = markerR + circleRadius - baseInset;
                const spread = 0.06; // angular, no scaling needed

                ctx.moveTo(Math.cos(cityAngle) * tipR, Math.sin(cityAngle) * tipR);
                ctx.lineTo(Math.cos(cityAngle - spread) * baseR, Math.sin(cityAngle - spread) * baseR);
                ctx.lineTo(Math.cos(cityAngle + spread) * baseR, Math.sin(cityAngle + spread) * baseR);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                if (isWkoeDresden) {
                    // Light gray disc for Dresden in WKOE mode
                    ctx.save();
                    ctx.fillStyle = 'rgb(180, 180, 180)';
                    ctx.beginPath();
                    ctx.arc(mx, my, circleRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, circleRadius);
                    if (city.red) {
                        grad.addColorStop(0, 'rgb(176, 36, 24)');   // CLAUDE.md base red (Υ)
                        grad.addColorStop(1, 'rgb(40, 9, 6)');
                    } else if (city.highlight) {
                        {
                            grad.addColorStop(0, '#ffaa00');
                            grad.addColorStop(0.2, '#ffaa00');
                            grad.addColorStop(1, '#a05000');

                            ctx.save();
                            ctx.shadowBlur = cityShadowBlur;
                            ctx.shadowColor = '#e68a00';
                        }
                    } else {
                        grad.addColorStop(0, '#0033aa');
                        grad.addColorStop(1, '#000811');
                    }

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(mx, my, circleRadius, 0, Math.PI * 2);
                    ctx.fill();
                    if (city.highlight && !city.red) ctx.restore();
                }

                ctx.save();
                ctx.translate(mx, my);
                // Inverse the map rotation to keep text/logo level
                ctx.rotate(-mapRotation * Math.PI / 180);

                if (isWkoeDresden) {
                    if (wkoeLogoImg.complete && wkoeLogoImg.naturalWidth) {
                        // Fit logo inside the disc (diameter = 2*circleRadius), with margin.
                        // Logo PNG has a drop-shadow on the right/bottom, so visible shield is
                        // off-center inside its bounding box → compensate with a small shift.
                        const maxSide = circleRadius * 1.3;
                        const iw = wkoeLogoImg.naturalWidth;
                        const ih = wkoeLogoImg.naturalHeight;
                        const scale = Math.min(maxSide / iw, maxSide / ih);
                        const dw = iw * scale;
                        const dh = ih * scale;
                        const shadowShiftX = dw * 0.03; // shift right to counter shadow on left
                        const shadowShiftY = dh * 0.04; // shift down to counter shadow on top
                        ctx.drawImage(wkoeLogoImg, -dw / 2 + shadowShiftX, -dh / 2 + shadowShiftY, dw, dh);
                    }
                } else {
                    let lines = city.name.split('\n');

                    const dst = getDSTLabel(city.tz);
                    if (city.highlight) {
                        ctx.fillStyle = "rgb(0,0,40)";
                    } else if (dst === "SZ") {
                        ctx.fillStyle = "rgba(255,255,255,0.95)"; // white for Summer Time (sun icon below)
                    } else {
                        ctx.fillStyle = "rgba(220, 220, 220, 0.9)"; // light gray for Winter Time (snowflake below)
                    }
                    ctx.font = (city.highlight)
                        ? `900 ${cityFontHighlight}px Orbitron`
                        : `bold ${cityFontNormal}px Orbitron`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    const labelYShift = -r * 0.01;  // nudge name + icon up together (~5%)
                    lines.forEach((line, i) => {
                        ctx.fillText(line, 0, (i - (lines.length-1)/2) * cityLineHeight + labelYShift);
                    });

                    // Season icon under the name: ☀️ Summer Time, ❄️ Winter Time (native emoji = Apple look on macOS)
                    const seasonEmoji = (dst === "SZ") ? "☀️" : "❄️";
                    const emojiSize = r * ((dst === "SZ") ? 0.0315 : 0.0257);  // sun +5%; snowflake smaller (it looks bigger than the sun)
                    const lastLineY = ((lines.length - 1) / 2) * cityLineHeight;  // baseline of the last name line
                    ctx.font = `${emojiSize}px sans-serif`;
                    // Center by the emoji's actual glyph box — color emoji have an asymmetric advance, so textAlign:center looks off-left.
                    const _ey = lastLineY + cityLineHeight * 0.85 + r * 0.02 + labelYShift;
                    const _em = ctx.measureText(seasonEmoji);
                    const _epen = (_em.actualBoundingBoxRight !== undefined)
                        ? -(_em.actualBoundingBoxRight - _em.actualBoundingBoxLeft) / 2
                        : 0;
                    ctx.fillText(seasonEmoji, _epen, _ey);  // textAlign stays "center" → glyph box centered at 0
                }
                ctx.restore();
            });
        }

        function draw() {
            // Loop muss IMMER weiterlaufen — auch bei Fehlern, sonst friert die Uhr ein.
            try {
                drawFrame();
            } catch (e) {
                console.error('draw error:', e);
            }
            requestAnimationFrame(draw);
        }

        function drawFrame() {
            // DEBUG overlay (zum Aktivieren das /* … */ entfernen)
            /*
            const _dbg = document.getElementById('size-debug') || (function () {
                const d = document.createElement('div');
                d.id = 'size-debug';
                d.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#0ff;padding:6px 10px;font:11px monospace;z-index:99999;border:1px solid #0ff;border-radius:4px;pointer-events:none;white-space:pre;text-align:left;';
                document.body.appendChild(d);
                return d;
            })();
            const _vv = window.visualViewport;
            const _cr = canvas.getBoundingClientRect();
            const _mc = document.querySelector('#main-content');
            const _mcR = _mc ? _mc.getBoundingClientRect() : { width: 0, height: 0 };
            const _ch = document.querySelector('#cyber-left-chrome');
            const _chR = _ch ? _ch.getBoundingClientRect() : { width: 0, height: 0 };
            const _scale = getComputedStyle(document.documentElement).getPropertyValue('--cyber-left-scale').trim();
            const _nat = getComputedStyle(document.documentElement).getPropertyValue('--cyber-left-natural-w').trim();
            */

            if (!mapLoaded) return;

            // Smooth Return Logic
            if (isReturning && !isMouseDown) {
                if (Math.abs(manualOffset) < 0.1) {
                    manualOffset = 0;
                    isReturning = false;
                } else {
                    manualOffset *= 0.92; // Smooth exponential decay back to 0
                }
            }


            const time = getDisplayTime();
            const utcHours = time.getUTCHours() + time.getUTCMinutes() / 60 + time.getUTCSeconds() / 3600;

            const rect = canvas.getBoundingClientRect();
            const w = Math.max(80, rect.width || 0);
            const h = Math.max(80, rect.height || 0);
            const size = Math.min(w, h) * 0.8;
            const r = size / 2;
            const cx = w / 2;
            const cy = h / 2;

            // Sicherheitsnetz: bei degenerierten Maßen Frame überspringen.
            if (!Number.isFinite(r) || r < 1) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.save();
            ctx.translate(cx, cy);

            // (Glow removed)

            // 1. Draw Map (Rotating)
            if (autoRotationEnabled) autoRotation -= dirSign * 0.02;
            // Add +1 to account for Summer Time (CEST is UTC+2, Lon 15 is UTC+1)
            const mapRotation = dirSign * (12 - (utcHours + 1)) * 15 + autoRotation;
            
            ctx.save();
            ctx.rotate(mapRotation * Math.PI / 180);
            
            // Draw Map Image (Slightly Darker)
            ctx.save();
            ctx.globalAlpha = 0.8;
            ctx.rotate(-Math.PI / 2);
            
            // Clip to circle to remove dark blue corners
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.clip();
            
            if (!window.useGlobe) {
                // Globe edge = inner rim of the city bubbles: (markerR - diskR)/r = (0.9 - 0.022) - 0.105
                const MAP_SCALE = 0.773;
                const ms = size * MAP_SCALE, mo = -ms / 2;
                if (CW && southMapReady) {
                    ctx.drawImage(southMapImg, mo, mo, ms, ms);   // real South-Pole view
                } else {
                    if (CW) ctx.scale(-1, 1);                     // fallback until the south map loads
                    ctx.drawImage(mapImg, mo, mo, ms, ms);
                }
            }
            ctx.restore();
            if (window.useGlobe && globeInstance) {
                if (!lockedCity && !isMouseDown && !globeManuallyDragged) {
                    globeLat = CW ? -90 : 90;   // no city selected: CW → South Pole, CCW → North Pole
                    globeLng = -mapRotation;
                    globeInstance.pointOfView({ lat: globeLat, lng: globeLng, altitude: fitGlobeAltitude() }, 0);
                }
                if (!lockedCity) drawPoleMarker(w, h, r);   // pole label + red dot at centre (no city selected)
            }
            if (!window.useGlobe) drawPoleMarker(w, h, r);  // clock mode: pole is always at the centre

            // 2. City markers (plaques glued to the rotating Earth) + the date line
            drawCityMarkers(r, mapRotation);

            // International Date Line (red triangle + "DATUMSGRENZE" between Samoa and Wellington)
            drawDateLine(r, r * 0.022, mapRotation);   // 2nd arg = markerInset (only feeds a dead var inside)
            ctx.restore(); // End map rotation (Earth + Glued Markers)
            // 3. Draw Numbers Ring (Static) - relative sizes
            drawNumbersRing(r);

            // Open/Closed arc ring (?open=1 mode) — green for open hours, red for closed
            if (window.__openMode) {
                const ranges = window.__openRanges || [];
                const arcR = r * 1.00;
                const lineW = Math.max(1, r * 0.010);
                const hourToAngle = h => dirSign * (12 - h) * (Math.PI * 2 / 24) - Math.PI / 2;
                const anticlockwise = (dirSign === 1);
                ctx.save();
                ctx.lineWidth = lineW;
                ctx.lineCap = 'butt';
                // Red full ring (closed)
                ctx.strokeStyle = 'rgba(176, 36, 24, 0.85)';
                ctx.beginPath();
                ctx.arc(0, 0, arcR, 0, Math.PI * 2);
                ctx.stroke();
                // Green arcs (open)
                ctx.strokeStyle = 'rgba(121, 158, 49, 0.95)';
                ranges.forEach(([a, b]) => {
                    ctx.beginPath();
                    ctx.arc(0, 0, arcR, hourToAngle(a), hourToAngle(b), anticlockwise);
                    ctx.stroke();
                });
                ctx.restore();
            }

            // Thin circle at tic base (both modes)
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.02 - r * 0.016, 0, Math.PI * 2);   // tickInset = r*0.016 (was a numbers-ring local)
            ctx.stroke();
            ctx.restore();

            ctx.restore(); // Restore from main translation
            
            // --- Legend + mode icons (top-left); writes globeIconHitbox + dirIconHitbox ---
            drawLegendAndIcons(r);

            // --- Impressum (left bottom corner) ---
            drawImprint(r, h);
            
            const activeCity = selectedCity;
            if (activeCity) {
                targetCity = activeCity;
                displayAlpha = Math.min(1, displayAlpha + 0.15);
            } else {
                displayAlpha = Math.max(0, displayAlpha - 0.15);
            }

            redCheckHitbox = null; // Reset; will be set when popup is drawn
            highlightBtnHitbox = null; // Reset; will be set when popup is drawn

            // 7. Central selection panel (time box + neighbor list + moon + hover tooltip)
            if (displayAlpha > 0 && targetCity) drawSelectionPanel(r, cx, cy, mapRotation, time);
        }

        function setupUI() {
            const container = document.getElementById('ui-container');
            if (container) container.innerHTML = ''; // Clear previous to avoid duplicates
            
            const BRAND_BLUE = "#00d2ff";
            CyberUI.createCard('ui-container', 'Steuerung', `
                <div style="display: flex; flex-direction: column; gap: 10px; align-items: stretch; padding: 0;">
                    <button id="rotation-btn" class="cyber-btn" onclick="toggleRotation()"
                            style="width: 100%; border-color: var(--neon-blue); color: var(--neon-blue); padding: 8px;">
                        ROTATION START
                    </button>

                    <button class="cyber-btn" onclick="manualReset()"
                            style="width: 100%; border-color: #ff3366; color: #ff3366; padding: 8px;">
                        RESET
                    </button>

                    <div style="margin-top: 15px;">
                        <label style="color: var(--neon-blue); font-size: 10px; display: block; margin-bottom: 5px; font-family: Orbitron;">
                            STADT-KONTRAST: <span id="gray-val">${cityFontGray}</span>
                        </label>
                        <input type="range" min="0" max="250" value="${cityFontGray}" 
                               oninput="cityFontGray = parseInt(this.value); document.getElementById('gray-val').innerText = this.value;" 
                               style="width: 100%; cursor: pointer; accent-color: var(--neon-blue);">
                    </div>

                    <div style="margin-top: 15px;">
                        <label style="color: var(--neon-blue); font-size: 10px; display: block; margin-bottom: 5px; font-family: Orbitron;">
                            RING-KONTRAST: <span id="ring-gray-val">${ringFontGray}</span>
                        </label>
                        <input type="range" min="0" max="250" value="${ringFontGray}" 
                               oninput="ringFontGray = parseInt(this.value); document.getElementById('ring-gray-val').innerText = this.value;" 
                               style="width: 100%; cursor: pointer; accent-color: var(--neon-blue);">
                    </div>
                </div>
            `, BRAND_BLUE);
        }

        function toggleRotation() {
            autoRotationEnabled = !autoRotationEnabled;
            const btn = document.getElementById('rotation-btn');
            if (btn) {
                btn.innerText = autoRotationEnabled ? 'ROTATION STOP' : 'ROTATION START';
                btn.style.borderColor = autoRotationEnabled ? '#adff2f' : 'var(--neon-blue)';
                btn.style.color = autoRotationEnabled ? '#adff2f' : 'var(--neon-blue)';
                btn.style.boxShadow = autoRotationEnabled ? '0 0 15px rgba(173, 255, 47, 0.4)' : 'none';
            }
        }

        function manualReset() {
            manualOffset = 0;
            autoRotation = 0;
            autoRotationEnabled = false;
            const btn = document.getElementById('rotation-btn');
            if (btn) {
                btn.innerText = 'ROTATION START';
                btn.style.borderColor = 'var(--neon-blue)';
                btn.style.color = 'var(--neon-blue)';
                btn.style.boxShadow = 'none';
            }
        }

        let isAnimating = false;
        let uiMounted = false;
        function init() {
            resizeCanvasToContainer();
            if (!uiMounted) {
                setupUI(); // Mount the sidebar controls ONCE
                uiMounted = true;
            }
            updateCityInfoBoxPosition();
            if (!isAnimating && mapLoaded) {
                isAnimating = true;
                draw();
            }
        }

        // Debounced resize to avoid thrashing at small sizes / fast drags
        let _resizeRaf = null;
        window.addEventListener('resize', () => {
            if (_resizeRaf != null) return;
            _resizeRaf = requestAnimationFrame(() => {
                _resizeRaf = null;
                resizeCanvasToContainer();
                updateCityInfoBoxPosition();
            });
        });
        // Search autocomplete (lokale Städte + Nominatim-Fallback)
        (function initSearch() {
            let nominatimTimer = null;
            let lastNominatimResults = [];
            let currentItems = [];

            function renderDrop(drop, input, items) {
                currentItems = items;
                drop.style.left  = input.style.left;
                drop.style.top   = (parseFloat(input.style.top) + parseFloat(input.style.height || 20)) + 'px';
                drop.style.width = input.style.width;
                drop.innerHTML   = '';
                if (!items.length) { drop.style.display = 'none'; return; }

                items.forEach(item => {
                    const el = document.createElement('div');
                    el.style.cssText = 'padding:6px 10px;cursor:pointer;border-bottom:1px solid rgba(0,210,255,0.1);letter-spacing:0.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
                    if (item.sub) {
                        el.innerHTML = `<span style="color:#00d2ff">${item.label}</span><span style="color:rgba(0,210,255,0.45);font-size:9px;margin-left:6px">${item.sub}</span>`;
                    } else {
                        el.textContent = item.label;
                    }
                    el.addEventListener('mouseenter', () => el.style.background = 'rgba(0,210,255,0.15)');
                    el.addEventListener('mouseleave', () => el.style.background = '');
                    el.addEventListener('mousedown', () => {
                        if (item.city) {
                            selectedCity = item.city;
                            showCityInfo(item.city.name);
                            if (globeInstance) {
                                lockedCity = item.city;
                                globeManuallyDragged = false;
                                const gLat = item.city.globeLat, gLng = item.city.globeLon;
                                globeInstance.pointOfView({ lat: gLat, lng: gLng, altitude: fitGlobeAltitude() }, 1000);
                                globeInstance
                                    .pointsData([{ lat: gLat, lng: gLng }])
                                    .pointLat('lat').pointLng('lng')
                                    .pointColor(() => 'red').pointAltitude(0.01).pointRadius(0.6)
                                    .ringsData([{ lat: gLat, lng: gLng }])
                                    .ringColor(() => 'rgba(255,0,0,1)')
                                    .ringMaxRadius(5).ringPropagationSpeed(5).ringRepeatPeriod(1000);
                            }
                        } else if (item.nominatim) {
                            // Zeitzone via timeapi.io nachladen
                            const { lat, lon, name } = item.nominatim;
                            const loadingCity = { name, lat, lon, globeLat: lat, globeLon: lon, tz: 'UTC', color: '#00d2ff' };
                            selectedCity = loadingCity;
                            if (globeInstance) {
                                lockedCity = loadingCity;
                                globeManuallyDragged = false;
                                globeInstance.pointOfView({ lat, lng: lon, altitude: fitGlobeAltitude() }, 1000);
                                globeInstance
                                    .pointsData([{ lat, lng: lon }])
                                    .pointLat('lat').pointLng('lng')
                                    .pointColor(() => 'red').pointAltitude(0.01).pointRadius(0.6)
                                    .ringsData([{ lat, lng: lon }])
                                    .ringColor(() => 'rgba(255,0,0,1)')
                                    .ringMaxRadius(5).ringPropagationSpeed(5).ringRepeatPeriod(1000);
                            }
                            DebugWindow.log(`▶ Search-Klick: ${name} (lat=${lat}, lon=${lon})`);
                            fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lon}`)
                                .then(r => r.json())
                                .then(async d => {
                                    const tz = d.timeZone || 'UTC';
                                    DebugWindow.log(`  timeapi.io → tz=${tz}`);
                                    loadingCity.tz = tz;
                                    selectedCity = loadingCity;
                                    if (RELATED_CITIES_DB[tz]) {
                                        DebugWindow.log(`  ✓ DB-Treffer für ${tz}, kein Overpass nötig`);
                                    } else if (window._neighborCache?.[tz]) {
                                        DebugWindow.log(`  ✓ Cache-Treffer für ${tz} (${window._neighborCache[tz].length} Städte)`);
                                    } else {
                                        try {
                                            DebugWindow.log(`  Photon /reverse lat=${lat} lon=${lon}`);
                                            const t0 = performance.now();
                                            const nr = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&limit=12&radius=200&layer=city`);
                                            DebugWindow.log(`  Photon HTTP ${nr.status} (${Math.round(performance.now() - t0)}ms)`);
                                            const nd = await nr.json();
                                            const feats = nd.features || [];
                                            DebugWindow.log(`  Photon features: ${feats.length}`);
                                            // Country-code → Flag emoji
                                            const ccToFlag = cc => cc ? String.fromCodePoint(...cc.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '📍';
                                            if (!window._neighborCache) window._neighborCache = {};
                                            window._neighborCache[tz] = feats
                                                .filter(f => f.properties?.name && f.properties.name.toLowerCase() !== name.toLowerCase())
                                                .slice(0, 5)
                                                .map(f => ({
                                                    name: f.properties.name,
                                                    f: ccToFlag(f.properties.countrycode),
                                                    lat: f.geometry.coordinates[1],
                                                    lng: f.geometry.coordinates[0]
                                                }));
                                            DebugWindow.log(`  ✓ Cache[${tz}]: ${window._neighborCache[tz].map(c => c.name).join(', ') || 'LEER'}`);
                                        } catch (err) {
                                            DebugWindow.log(`  ✗ Photon-Fehler: ${err.message}`);
                                        }
                                    }
                                    showCityInfo(name);
                                })
                                .catch(err => {
                                    DebugWindow.log(`  ✗ timeapi.io-Fehler: ${err.message}`);
                                    showCityInfo(name);
                                });
                        }
                        input.value = item.label;
                        drop.style.display = 'none';
                    });
                    drop.appendChild(el);
                });
                drop.style.display = 'block';
            }

            function trySetup() {
                const input = document.getElementById('wc-search');
                if (!input) { setTimeout(trySetup, 100); return; }

                const drop = document.createElement('div');
                drop.id = 'wc-search-drop';
                drop.style.cssText = 'position:fixed;background:rgba(0,10,30,0.97);border:1px solid rgba(0,210,255,0.55);border-top:none;border-radius:0 0 6px 6px;font-family:Orbitron,sans-serif;font-size:11px;color:#00d2ff;z-index:1001;display:none;overflow-y:auto;max-height:200px;box-sizing:border-box;';
                document.body.appendChild(drop);

                async function showNeighbors() {
                    const city = selectedCity || targetCity;
                    if (!city) return;
                    const tz = city.tz;
                    const fromDB = RELATED_CITIES_DB[tz];
                    if (fromDB) {
                        renderDrop(drop, input, fromDB.map(c => ({
                            label: c.f + ' ' + c.name,
                            nominatim: { name: c.name, lat: c.lat, lon: c.lng }
                        })));
                        return;
                    }
                    // On the fly: Overpass — Städte im 300km Umkreis
                    const lat = city.globeLat ?? city.lat;
                    const lon = city.globeLon ?? city.lon;
                    renderDrop(drop, input, [{ label: '⏳ Lade Nachbarstädte…' }]);
                    try {
                        const q = `[out:json][timeout:10];(node(around:300000,${lat},${lon})[place=city];node(around:300000,${lat},${lon})[place=town];);out 6;`;
                        const res = await fetch('https://overpass-api.de/api/interpreter', {
                            method: 'POST', body: q
                        });
                        const data = await res.json();
                        const items = data.elements
                            .filter(e => e.tags?.name)
                            .slice(0, 5)
                            .map(e => ({
                                label: e.tags.name,
                                sub: e.tags['name:de'] || e.tags.place || '',
                                nominatim: { name: e.tags.name, lat: e.lat, lon: e.lon }
                            }));
                        renderDrop(drop, input, items.length ? items : []);
                    } catch (_) { drop.style.display = 'none'; }
                }

                input.addEventListener('focus', () => {
                    if (!input.value.trim()) showNeighbors();
                });

                input.addEventListener('input', () => {
                    const q = input.value.trim();
                    if (!q) {
                        showNeighbors();
                        return;
                    }
                    const ql = q.toLowerCase();

                    // Lokale Treffer sofort
                    const local = cities
                        .filter(c => c.name.replace(/\n/g, ' ').toLowerCase().includes(ql))
                        .map(c => ({ label: c.name.replace(/\n/g, ' '), city: c }));

                    renderDrop(drop, input, local.length ? local : [{ label: '⏳ Suche…' }]);

                    // Nominatim nach 400ms Pause
                    clearTimeout(nominatimTimer);
                    nominatimTimer = setTimeout(async () => {
                        try {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1&featuretype=settlement`,
                                { headers: { 'Accept-Language': 'de' } }
                            );
                            const data = await res.json();
                            const remote = data.map(r => ({
                                label: r.display_name.split(',')[0].trim(),
                                sub: r.display_name.split(',').slice(1, 3).join(',').trim(),
                                nominatim: {
                                    name: r.display_name.split(',')[0].trim(),
                                    display: r.display_name,
                                    lat: parseFloat(r.lat),
                                    lon: parseFloat(r.lon)
                                }
                            }));
                            const all = [...local, ...remote.filter(r =>
                                !local.some(l => l.label.toLowerCase() === r.label.toLowerCase())
                            )];
                            renderDrop(drop, input, all);
                        } catch (_) { /* Nominatim nicht verfügbar */ }
                    }, 400);
                });

                input.addEventListener('keydown', e => {
                    if (e.key !== 'Enter') return;
                    const real = currentItems.filter(i => i.city || i.nominatim);
                    if (real.length !== 1) return;
                    e.preventDefault();
                    drop.querySelector('div')?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                });

                document.addEventListener('mousedown', e => {
                    if (!drop.contains(e.target) && e.target !== input)
                        drop.style.display = 'none';
                });
            }
            trySetup();
        })();

        document.fonts.ready.then(init);

        // UI Controls & Interaction (wrapped in try/catch — CyberUI.on does not exist
        // on the current CyberUI, throws TypeError and blocks everything below).
        try { CyberUI.on('reset', manualReset); } catch (e) {
            try { DebugWindow.log('[CyberUI.on] failed: ' + e.message); } catch(_) {}
        }

        // --- DEBUG: Global keydown test ---
        // --- DEBUG: Clock-only mode — toggled by 'D'. Hides mini-rail, coach-box
        //     (SOMMERZEIT header), search input, and the canvas-drawn imprint.
        (function setupClockOnlyToggle() {
            function safeLog(msg) {
                try { DebugWindow.log(msg); } catch(_) {}
            }

            // Selectors of elements to hide in clock-only mode
            const HIDE_SELECTORS = [
                '#mini-rail',
                '#math-coach-box',
                '#wc-search',
                '#wc-link-icon',
                '.canvas-branding',        // SOMMERZEIT / NORMALZEIT title block
                '#central-debug-window'    // floating DEBUG window
            ];

            // Cover strip that paints over the grey ex-mini-rail column
            const cover  = document.getElementById('debug-clock-cover');
            const pieces = {
                top:    cover && cover.querySelector('[data-piece="top"]'),
                bottom: cover && cover.querySelector('[data-piece="bottom"]'),
                left:   cover && cover.querySelector('[data-piece="left"]'),
                right:  cover && cover.querySelector('[data-piece="right"]')
            };

            function updateStrip() {
                if (!cover || !pieces.left) return;
                const chrome = document.getElementById('cyber-left-chrome');
                const rect = chrome ? chrome.getBoundingClientRect() : { left: 0, top: 0, width: 66, height: window.innerHeight };
                pieces.left.style.cssText =
                    `position:absolute;background:#000616;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;`;
                pieces.top.style.cssText    = 'display:none;';
                pieces.bottom.style.cssText = 'display:none;';
                pieces.right.style.cssText  = 'display:none;';
                safeLog('[strip] left=' + rect.left + ' w=' + rect.width + ' h=' + rect.height);
            }

            let nextInteractionHandler = null;
            function detachNextInteraction() {
                if (!nextInteractionHandler) return;
                document.removeEventListener('mousedown', nextInteractionHandler, true);
                document.removeEventListener('keydown',   nextInteractionHandler, true);
                document.removeEventListener('wheel',     nextInteractionHandler, true);
                document.removeEventListener('touchstart',nextInteractionHandler, true);
                nextInteractionHandler = null;
            }

            // Auto-hide: 5 s after load / after each restore → switch into clock-only mode
            let autoHideTimer = null;
            const AUTO_HIDE_MS = 5000;
            function scheduleAutoHide() {
                if (autoHideTimer) clearTimeout(autoHideTimer);
                autoHideTimer = setTimeout(() => {
                    autoHideTimer = null;
                    applyMode(true);
                }, AUTO_HIDE_MS);
                safeLog('[autoHide] scheduled in ' + AUTO_HIDE_MS + 'ms');
            }
            function clearAutoHide() {
                if (!autoHideTimer) return;
                clearTimeout(autoHideTimer);
                autoHideTimer = null;
            }

            const FADE_OUT_MS = 2000;
            const FADE_IN_MS  = 250;

            // Canvas elements (SOMMERZEIT/NORMALZEIT/Globe/Impressum) read this each frame.
            window.__clockOnlyAlpha = 1;
            let alphaAnimRaf = null;
            function animateAlpha(toAlpha, durationMs) {
                if (alphaAnimRaf) cancelAnimationFrame(alphaAnimRaf);
                const from = window.__clockOnlyAlpha;
                const start = performance.now();
                function tick(t) {
                    const p = Math.min(1, (t - start) / durationMs);
                    window.__clockOnlyAlpha = from + (toAlpha - from) * p;
                    if (p < 1) alphaAnimRaf = requestAnimationFrame(tick);
                    else alphaAnimRaf = null;
                }
                alphaAnimRaf = requestAnimationFrame(tick);
            }

            function applyMode(active) {
                window.__clockOnlyMode = active;
                animateAlpha(active ? 0 : 1, active ? FADE_OUT_MS : FADE_IN_MS);
                HIDE_SELECTORS.forEach(sel => {
                    const el = document.querySelector(sel);
                    if (!el) { safeLog('[clockOnly] not found: ' + sel); return; }
                    el.style.transition = `opacity ${active ? FADE_OUT_MS : FADE_IN_MS}ms ease`;
                    // Cancel CSS animations (e.g. .canvas-branding's branding-fade-in
                    // with fill-mode forwards) — otherwise the animation's end-state
                    // (opacity:1) overrides our inline opacity:0.
                    el.style.animation = 'none';
                    // Force reflow so the transition is observed
                    void el.offsetWidth;
                    if (active) {
                        if (el.dataset.prevOpacity === undefined) {
                            el.dataset.prevOpacity = el.style.opacity || '';
                            el.dataset.prevPointer = el.style.pointerEvents || '';
                        }
                        el.style.opacity = '0';
                        el.style.pointerEvents = 'none';
                    } else {
                        el.style.opacity = el.dataset.prevOpacity || '';
                        el.style.pointerEvents = el.dataset.prevPointer || '';
                        delete el.dataset.prevOpacity;
                        delete el.dataset.prevPointer;
                    }
                });
                if (active) {
                    clearAutoHide();
                    updateStrip();
                    cover && cover.classList.add('show');
                    // Restore on the next user interaction. Defer one frame so the
                    // current D-keydown isn't picked up as the "next" interaction.
                    detachNextInteraction();
                    requestAnimationFrame(() => {
                        nextInteractionHandler = () => {
                            detachNextInteraction();
                            applyMode(false);
                            scheduleAutoHide();  // 5 s after this interaction → hide again
                        };
                        document.addEventListener('mousedown', nextInteractionHandler, true);
                        document.addEventListener('keydown',   nextInteractionHandler, true);
                        document.addEventListener('wheel',     nextInteractionHandler, true);
                        document.addEventListener('touchstart',nextInteractionHandler, true);
                    });
                } else {
                    cover && cover.classList.remove('show');
                    detachNextInteraction();
                }
                safeLog('[clockOnly] active=' + active);
            }

            window.addEventListener('resize', () => {
                if (cover && cover.classList.contains('show')) updateStrip();
            });

            function toggle() {
                const wasActive = !!window.__clockOnlyMode;
                applyMode(!wasActive);
                // Manual D-toggle from active→inactive: also schedule the 5 s auto-hide
                if (wasActive) scheduleAutoHide();
            }

            document.addEventListener('keydown', (e) => {
                if (e.key !== 'd' && e.key !== 'D') return;
                const t = e.target;
                if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
                toggle();
            }, true);

            // Initial: 5 s after load, hide
            scheduleAutoHide();
            safeLog('[clockOnly] toggle setup ready — press D');
        })();
