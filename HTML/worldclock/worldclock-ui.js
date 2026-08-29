// worldclock-ui.js — left-column UI: city search (initSearch) + clock-only mode toggle ('D').
// Loaded AFTER worldclock.js: both IIFEs run immediately and use its globals (cities, selectCity,
// showCityInfo, init, DOM) at runtime. Extracted from worldclock.js (Phase 6 refactor) — unchanged.

// ===== City search =====
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
                                setGlobeMarker(gLat, gLng);
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
                                setGlobeMarker(lat, lon);
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
                    renderDrop(drop, input, [{ label: CyberI18n.get('worldclock.loading_neighbors') }]);
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

                    renderDrop(drop, input, local.length ? local : [{ label: CyberI18n.get('worldclock.searching') }]);

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

// ===== Clock-only mode (press D) =====
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
