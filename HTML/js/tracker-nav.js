// js/tracker-nav.js — Simple navigation for the tracker (address → route + turn-by-turn voice).
//
// Per plan-navigation-einfach.md: type a destination address, tap "Ziel setzen", then START both
// navigates AND records the track. Includes off-route re-routing and spoken turn instructions
// (German, built from OSRM maneuvers — no external phrasing library). Free + key-less services only
// (CLAUDE.md rule 18):
//   - Geocoding: Nominatim  (address → lat/lng)
//   - Routing:   FOSSGIS OSRM (keyless) — routed-car (Straße) / routed-foot (Laufen) → geometry + maneuvers
//   - Voice:     Solita cloud TTS (the `tts` edge fn, js/solita-voice.js) when present — the SAME channel
//                that already speaks in the Pixel's Android WebView; speechSynthesis only as a fallback,
//                because on-device speechSynthesis stays SILENT in that WebView (no voice engine bound).
//
// Additive: owns its own Leaflet layers (route polyline + destination pin), the #nav-panel UI and the
// #nav-banner. The core (tracker.js) asks hasDestination() on START, feeds update([lat,lng]) on every
// GPS fix, and calls clearRoute() on STOP.
window.TrackerNav = function (ctx) {
    const { map, $, toast, showPanel, hidePanels } = ctx;

    const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
    // Wegetyp (Doc 2026-06-17): Straße (car) or Laufen (foot). FOSSGIS hosts keyless OSRM instances per
    // profile with the SAME API (geometry + maneuvers), so only the base URL changes. Foot routing uses
    // footpaths/pedestrian zones a car route can't; the maneuver→German mapping below is profile-agnostic.
    const OSRM_PROFILES = {
        car: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/',
        foot: 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/',
    };
    const ROUTE_KEY = 'trk_nav_routetype';
    let routeType = (localStorage.getItem(ROUTE_KEY) === 'foot') ? 'foot' : 'car';   // default: Straße
    const COL_ROUTE = 'rgb(66, 135, 245)'; // blue — distinct from the green/orange track + red position dot

    // Own map pane for the route, BELOW the position dot / heading triangle / track / markers, so the
    // white heading triangle and the red position dot always sit ON TOP of the blue line (Doc 2026-06-11).
    // z 350: above basemap tiles (200) + rain radar (250), below overlay paths/markers (400/600).
    try {
        if (map.createPane && !map.getPane('nav-route')) {
            map.createPane('nav-route');
            map.getPane('nav-route').style.zIndex = 350;
        }
    } catch (e) { }

    const OFFROUTE_M = 30;          // beyond this distance from the line → considered "off route" (Doc 2026-06-14: 45→30 for earlier reroute; watch d2route debug for flapping)
    const REROUTE_COOLDOWN_MS = 6000; // don't hammer OSRM: at most one reroute per this window (Doc 2026-06-14: 8s→6s)
    const OFFROUTE_CONSEC = 3;      // hysteresis: require this many consecutive off-route fixes before rerouting → no flapping on jitter / a brief excursion (Doc 2026-06-24)
    // Off-route reroute strategy (Doc 2026-06-25): the departure-bearing cone backfires at junctions —
    // forcing "forward-ish" departure makes OSRM drive on and U-turn LATER instead of turning around now
    // (e.g. immediately round a roundabout). Google reroutes plain fresh-to-destination and lets the road
    // graph + U-turn penalty decide. So we default the cone OFF; flip USE_DEPART_BEARING back to true to
    // compare in the sim.
    const USE_DEPART_BEARING = false;
    const BRG_RANGE_DEG = 90;       // (only used when USE_DEPART_BEARING) OSRM may depart within ±this of the travel heading
    const BRG_MIN_MOVE_M = 12;      // min travel between fixes for a trustworthy movement-derived heading
    const ANNOUNCE_FAR_M = 300;     // distance at which the pre-warning ("In 300 m …") is spoken
    const ANNOUNCE_NEAR_M = 40;     // distance at which the maneuver ("Jetzt …") is spoken + advanced
    const VOICE_KEY = 'trk_nav_voice';

    let destLatLng = null;  // [lat, lng] of the set destination, or null
    let destLabel = '';     // human-readable address (for the panel + toasts)
    let destMarker = null;  // Leaflet pin at the destination
    const HOME_KEY = 'trk_nav_home';
    const HIST_KEY = 'trk_nav_history';  // recent destinations [{lat,lng,label,t}] (localStorage), unlimited
    const LAST_KEY = 'trk_nav_last';     // last navigated destination {lat,lng,label} → restored on reload
    let home = null;        // saved "Zuhause" { lat, lng, label } (localStorage), or null
    let routeLine = null;   // Leaflet layerGroup of the computed route (casing + core)
    let routeCasing = null, routeCore = null; // the two polylines, kept so update() can re-slice them
    let routeLatLngs = null; // the route's points [[lat,lng]…] — for the off-route distance check
    let lastReroute = 0;    // timestamp of the last (re)route, for the cooldown
    let rerouting = false;  // a reroute fetch is in flight
    let lastBrgPos = null;  // last position used to derive the live travel heading
    let travelBrg = null;   // current travel bearing (deg, 0=N) from GPS movement → departure-direction constraint on reroute
    let offRouteCount = 0;  // consecutive off-route fixes → hysteresis against reroute flapping
    let navGen = 0;         // bumped whenever the route is cleared/replaced → invalidates in-flight fetches
    let maneuvers = null;   // [{loc:[lat,lng], type, modifier, exit, name, text}] for spoken guidance
    let mIdx = 0;           // index of the next maneuver to announce
    let annFar = false;     // pre-warning ("In … Metern") already spoken for the current maneuver
    let annNear = false;    // "Jetzt …" already spoken — said at ~40 m, but we DON'T advance until passed
    let mClosest = Infinity; // closest approach (m) to the current maneuver — to detect an overshoot
    let voiceOn = true;     // spoken guidance on/off (persisted in localStorage)
    let routeTotalDist = 0; // whole-route distance (m) at (re)route time — for ETA / remaining
    let routeTotalDur = 0;  // whole-route duration (s) at (re)route time — for ETA / remaining
    let tripTotalM = 0;     // total planned distance captured at the FIRST route → the FIXED "Strecke" shown in
                            // the banner. Reroutes recompute from the current position (→ routeTotalDist shrinks),
                            // but "Strecke" must stay the whole trip "von Anfang an" (Doc 2026-06-23).

    function hasDestination() { return !!destLatLng; }

    // ---- "Zuhause": the #nav-home button INSIDE the "Ziel"-dialog. Short tap → navigate home;
    //      long-press → save the CURRENT destination as home. Persisted in localStorage. ----
    function loadHome() {
        try { const h = JSON.parse(localStorage.getItem(HOME_KEY) || 'null'); return (h && h.lat != null && h.lng != null) ? h : null; }
        catch (e) { return null; }
    }
    // ---- Cloud sync of Home + destination history (public.nav_prefs, per user). localStorage stays the
    //      working store; the cloud just lets the SAME account (same sync code) roam across devices/origins.
    const cloudLoad = ctx.cloudPrefsLoad, cloudSave = ctx.cloudPrefsSave;
    function pushHomeCloud() { if (cloudSave) cloudSave({ home: home || null }); }
    function pushHistoryCloud() { if (cloudSave) cloudSave({ history: loadHistory() }); }
    // On start: pull the cloud copy (it wins, so a phone-set Home shows up here). If the cloud is empty,
    // seed it from whatever this device already has locally so the first device populates it.
    async function hydrateFromCloud() {
        if (!cloudLoad) return;
        let row; try { row = await cloudLoad(); } catch (e) { return; }
        if (!row) {
            const lh = loadHome(), lhist = loadHistory();
            if ((lh || (lhist && lhist.length)) && cloudSave) cloudSave({ home: lh || null, history: lhist || [] });
            return;
        }
        if (row.home && row.home.lat != null && row.home.lng != null) {
            home = row.home;
            try { localStorage.setItem(HOME_KEY, JSON.stringify(home)); } catch (e) { }
            refreshHome();
        }
        if (Array.isArray(row.history)) {
            try { localStorage.setItem(HIST_KEY, JSON.stringify(row.history)); } catch (e) { }
            renderHistory();
        }
    }
    // Keep the dialog's home hint in sync with whether a home is stored (the button itself lives in the
    // panel, so it's visible whenever the panel is open — no show/hide needed).
    function refreshHome() {
        const hint = $('nav-home-hint');
        if (hint) hint.textContent = home
            ? ('Zuhause: ' + shortLabel(home.label) + ' — lang drücken überschreibt mit dem aktuellen Ziel.')
            : 'Lang drücken: aktuelles Ziel als Zuhause speichern.';
    }
    function saveHome() {
        if (!destLatLng) { toast('Kein aktives Ziel — erst ein Ziel setzen, dann „Nach Hause" lang drücken.'); return; }
        home = { lat: destLatLng[0], lng: destLatLng[1], label: destLabel || 'Zuhause' };
        try { localStorage.setItem(HOME_KEY, JSON.stringify(home)); } catch (e) { }
        pushHomeCloud();   // roam the new Home to the user's other devices (same sync code)
        toast('Als Zuhause gespeichert: ' + shortLabel(home.label));
        refreshHome();
        renderHistory();   // refresh the pinned "Nach Hause" row with the new home
    }
    function goHome() {
        if (!home) { toast('Kein Zuhause gespeichert — Ziel setzen, dann „Nach Hause" lang drücken.'); return; }
        toast('Navigation nach Hause …');
        hidePanels();
        navigateTo([home.lat, home.lng], home.label);
    }

    function curPos() {
        const m = ctx.posMarker;
        const ll = m && m.getLatLng && m.getLatLng();
        return ll ? [ll.lat, ll.lng] : null;
    }

    // A small teardrop pin via divIcon (inline-styled → no extra CSS, and it can't break like
    // Leaflet's default marker image does when the icon assets aren't on the page).
    function destIcon() {
        return L.divIcon({
            className: 'nav-dest',
            html: '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);'
                + 'background:' + COL_ROUTE + ';border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>',
            iconSize: [18, 18], iconAnchor: [9, 18],
        });
    }

    function shortLabel(s) {
        const parts = (s || '').split(',').map((x) => x.trim()).filter(Boolean);
        if (!parts.length) return '';
        // Nominatim lists the house number FIRST ("8, Sachsenallee, …") → swap to natural German "Straße Nr."
        if (parts.length >= 2 && /^\d+[a-z]?$/i.test(parts[0])) return parts[1] + ' ' + parts[0];
        return parts.slice(0, 2).join(', ');
    }

    // ---- Geocoding: a free-text line → the first Nominatim hit (or null). Shared by the "Ziel setzen"
    // button, the Enter key, and the live-as-you-type lookup. Nominatim parses "Ort, Straße, Nr." itself.
    async function geocode(q) {
        const from = curPos();
        // With a GPS position we fetch SEVERAL candidates and pick the geographically NEAREST — so
        // "Tankstelle" / "Lidl" / "Bäcker" resolve to the one NEAR you, not Nominatim's globally most
        // "important" match (Doc 2026-06-23). Without GPS → limit=1, top hit as before.
        let url = NOMINATIM + '?format=jsonv2&limit=' + (from ? 10 : 1) + '&q=' + encodeURIComponent(q);
        // Soft bias toward the current position (NO `bounded` → only re-ranks; an explicit far city still
        // shows up among the candidates). ~±0.6° ≈ a regional box (left,top,right,bottom).
        if (from) {
            const d = 0.6;
            url += '&viewbox=' + [from[1] - d, from[0] + d, from[1] + d, from[0] - d].join(',');
        }
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        const data = await r.json();
        if (!data || !data.length) return null;
        if (!from) return data[0];   // no position → fall back to importance ranking
        // Pick the candidate closest to the current position (great-circle), not the most prominent one.
        let best = data[0], bestD = Infinity;
        for (const c of data) {
            const cd = haversine(from, [parseFloat(c.lat), parseFloat(c.lon)]);
            if (cd < bestD) { bestD = cd; best = c; }
        }
        return best;
    }

    // ---- Reverse geocoding: current coords → a human label (or null). Keyless Nominatim (rule 18). ----
    async function reverseGeocode(latlng) {
        const url = NOMINATIM.replace('/search', '/reverse')
            + '?format=jsonv2&lat=' + latlng[0] + '&lon=' + latlng[1];
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        const data = await r.json();
        return (data && data.display_name) ? data.display_name : null;
    }

    // ---- "Position merken": save the CURRENT position as a pin into the recent-destinations list, so it
    // shows up under "Letzte Ziele" and can be navigated to later (Doc-Wunsch; FEAT-3-verwandt). Reverse-
    // geocodes for a readable name; falls back to a timestamp label when offline. ----
    async function savePin() {
        const pos = curPos();
        if (!pos) { toast('Position merken: warte auf GPS-Position …'); return; }
        toast('Position wird gemerkt …');
        let label = null;
        try { label = await reverseGeocode(pos); } catch (e) { /* offline → fall back to coords/time */ }
        if (!label) {
            const t = new Date();
            label = 'Gemerkt ' + t.getHours() + ':' + String(t.getMinutes()).padStart(2, '0');
        }
        pushHistory(pos, '📍 ' + label, true);   // pin flag → grouped first in the scroll box; 📍 marks it visually
        toast('Position gemerkt: ' + shortLabel(label));
    }

    async function setDestination() {
        const q = ($('nav-dest').value || '').trim();
        if (!q) { toast('Bitte ein Ziel eingeben.'); return; }
        toast('Suche Adresse …');
        let hit;
        try { hit = await geocode(q); }
        catch (e) { toast('Adress-Suche fehlgeschlagen (offline?).'); return; }
        if (!hit) { toast('Adresse nicht gefunden.'); return; }
        applyDestination([parseFloat(hit.lat), parseFloat(hit.lon)], hit.display_name || q);
    }

    // Apply a KNOWN destination (coords + label) — no geocoding. Shared by setDestination (typed/dictated
    // address) and the navigation-history quick-pick: drop the pin, frame current pos ↔ destination, close
    // the panel, record it in the history. Does NOT route — START then navigates+records (same model as typing).
    function applyDestination(latlng, label) {
        if (!latlng || latlng[0] == null) return;
        destLatLng = [latlng[0], latlng[1]];
        destLabel = label || 'Ziel';
        showDestMarker();
        const from = curPos();
        try {
            if (from) map.fitBounds(L.latLngBounds([from, destLatLng]), { padding: [60, 60] });
            else map.setView(destLatLng, Math.max(map.getZoom(), 13));
        } catch (e) { }
        hidePanels();
        toast('Ziel gesetzt: ' + shortLabel(destLabel) + ' — jetzt START');
        refreshHome();
        clearFoundUI();   // the explicit set supersedes any live "found" hint
    }

    // ---- Navigation history: the last few destinations, as a quick-pick list in the Ziel-dialog ----
    function loadHistory() {
        try { const a = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); return Array.isArray(a) ? a : []; }
        catch (e) { return []; }
    }
    // Record a destination at the top; drop duplicates (same label OR within ~25 m). No cap (Doc 2026-06-21):
    // the list is unlimited — unneeded entries get deleted by hand; the scroll box keeps it compact.
    function pushHistory(latlng, label, pin) {
        if (!latlng || latlng[0] == null) return;
        const lab = (label || '').trim() || 'Ziel';
        const list = loadHistory().filter((h) =>
            h.label !== lab && haversine([h.lat, h.lng], [latlng[0], latlng[1]]) > 25);
        list.unshift({ lat: latlng[0], lng: latlng[1], label: lab, t: Date.now(), pin: !!pin });
        try { localStorage.setItem(HIST_KEY, JSON.stringify(list)); } catch (e) { }
        pushHistoryCloud();   // roam the updated destination list to the user's other devices
        renderHistory();
    }
    function removeHistory(h) {
        const list = loadHistory().filter((x) => !(x.label === h.label && x.lat === h.lat && x.lng === h.lng));
        try { localStorage.setItem(HIST_KEY, JSON.stringify(list)); } catch (e) { }
        pushHistoryCloud();   // roam the deletion to the user's other devices
        renderHistory();
    }
    // The home hint shown by the row's ⓘ as a toast (was a permanent line under the list — Doc 2026-06-21).
    function homeHintText() {
        return home
            ? ('Zuhause: ' + shortLabel(home.label) + ' — lang drücken überschreibt mit dem aktuellen Ziel.')
            : 'Lang drücken: aktuelles Ziel als Zuhause speichern.';
    }

    // Pinned first row: "Nach Hause". Short tap → set home as the destination (then START); long-press →
    // save the CURRENT destination as home. Never deletable, and it sits ABOVE the scroll box so it never
    // scrolls away. (Replaces the old standalone "Nach Hause" button — Doc 2026-06-21.)
    function homeRow() {
        const item = document.createElement('div'); item.className = 'nav-hist-item nav-hist-home';
        const go = document.createElement('button'); go.type = 'button'; go.className = 'nav-hist-go';
        go.title = home ? ('Nach Hause: ' + home.label) : 'Nach Hause';
        go.innerHTML = '<span class="nav-hist-pin"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" '
            + 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            + '<path d="M3 11l9-8 9 8"></path><path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10"></path>'
            + '<path d="M9 21v-6h6v6"></path></svg></span>';
        const lab = document.createElement('span'); lab.className = 'nav-hist-label'; lab.textContent = 'Nach Hause';
        go.appendChild(lab);
        let pressTimer = null, longFired = false, sx = 0, sy = 0;
        const cancel = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
        go.addEventListener('pointerdown', (e) => { longFired = false; sx = e.clientX; sy = e.clientY; cancel(); pressTimer = setTimeout(() => { pressTimer = null; longFired = true; saveHome(); }, 600); });
        go.addEventListener('pointermove', (e) => { if (pressTimer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) cancel(); });
        go.addEventListener('pointerup', cancel);
        go.addEventListener('pointercancel', cancel);
        go.addEventListener('pointerleave', cancel);
        go.addEventListener('click', () => {
            if (longFired) { longFired = false; return; }   // swallow the click that trails a long-press
            if (home) applyDestination([home.lat, home.lng], home.label);
            else toast('Kein Zuhause gespeichert — Ziel setzen, dann „Nach Hause" lang drücken.');
        });
        const info = document.createElement('button');
        info.type = 'button'; info.className = 'nav-hist-info'; info.setAttribute('aria-label', 'Hinweis');
        info.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" '
            + 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle>'
            + '<line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        info.addEventListener('click', (e) => { e.stopPropagation(); toast(homeHintText()); });
        item.appendChild(go);     // full-width tap target (set home / long-press save) — NOT deletable
        item.appendChild(info);   // right: ⓘ → shows the hint as a toast (instead of a permanent line)
        return item;
    }

    // A self-saved spot vs a navigated destination. The `pin` flag is authoritative; the 📍 label prefix
    // is the fallback so pins saved before the flag existed still group correctly.
    function isPin(h) { return h.pin === true || (h.label || '').startsWith('📍'); }

    // Rebuild the list DOM (textContent for OSM labels → no injection; the pin SVG is a fixed string).
    // "Nach Hause" is pinned on top (above the scroll box, never scrolls). INSIDE the scroll box the saved
    // 📍 pins come first, then the navigated destinations — both scroll/can be scrolled out (Doc 2026-06-21).
    function renderHistory() {
        const box = $('nav-history'); if (!box) return;
        const all = loadHistory();
        const ordered = [...all.filter(isPin), ...all.filter((h) => !isPin(h))]; // pins first, recency kept within each group
        box.innerHTML = '';
        box.hidden = false;   // always visible — the pinned Home row is always present
        const title = document.createElement('div');
        title.className = 'nav-history-title'; title.textContent = 'Letzte Ziele';
        box.appendChild(title);
        box.appendChild(homeRow());   // pinned first, above the scroll area
        const scroll = document.createElement('div'); scroll.className = 'nav-hist-scroll';
        ordered.forEach((h) => {
            const item = document.createElement('div'); item.className = 'nav-hist-item';
            const go = document.createElement('button'); go.type = 'button'; go.className = 'nav-hist-go'; go.title = h.label;
            go.innerHTML = '<span class="nav-hist-pin"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" '
                + 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                + '<path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>';
            const lab = document.createElement('span'); lab.className = 'nav-hist-label'; lab.textContent = shortLabel(h.label);
            go.appendChild(lab);
            go.addEventListener('click', () => applyDestination([h.lat, h.lng], h.label));
            const del = document.createElement('button');
            del.type = 'button'; del.className = 'nav-hist-del'; del.setAttribute('aria-label', 'Aus Verlauf entfernen'); del.textContent = '×';
            del.addEventListener('click', (e) => { e.stopPropagation(); removeHistory(h); });
            item.appendChild(go); item.appendChild(del);
            scroll.appendChild(item);
        });
        box.appendChild(scroll);
    }

    function showDestMarker() {
        if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
        if (destLatLng) destMarker = L.marker(destLatLng, { icon: destIcon(), title: destLabel }).addTo(map);
    }

    function clearRouteLine() { if (routeLine) { map.removeLayer(routeLine); routeLine = null; } routeCasing = null; routeCore = null; routeLatLngs = null; }

    // Full teardown — used by "Ziel löschen" and by STOP (finish/discard) in the core.
    function clearRoute() {
        navGen++;            // invalidate any reroute/route fetch still in flight (its result is now stale)
        rerouting = false;   // don't let an aborted reroute leave the flag stuck → would block future routing
        lastBrgPos = null; travelBrg = null; offRouteCount = 0;  // drop the stale travel heading for the next navigation
        clearRouteLine();
        if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
        destLatLng = null; destLabel = '';
        maneuvers = null; mIdx = 0; annFar = false; annNear = false; mClosest = Infinity;
        routeTotalDist = 0; routeTotalDur = 0; tripTotalM = 0;
        hideBanner();
        stopSpeech();
        refreshPanel();
        refreshHome(); // dest gone, but the FAB stays if a home is stored
        clearFoundUI();
        const di = $('nav-dest'); if (di) di.value = '';
    }

    // ---- Routing: a position → destination, drawn as a polyline ----
    // Shared by START (startNavigation) and the off-route reroute (update). `reroute` only tweaks toasts.
    async function computeRoute(from, reroute, brg) {
        const gen = navGen; // snapshot: if the route is cleared/replaced during the await, this result is stale
        toast(reroute ? 'Neue Route …' : 'Route wird berechnet …');
        let data;
        try {
            // OSRM wants lon,lat order; full geometry as GeoJSON for an easy polyline.
            const coords = from[1] + ',' + from[0] + ';' + destLatLng[1] + ',' + destLatLng[0];
            // Off-route reroute (Doc 2026-06-24): constrain the DEPARTURE direction to the live travel heading
            // via OSRM `bearings` (one entry per coordinate; the destination stays unconstrained → trailing ";").
            // This forbids OSRM from starting the new route with a U-turn back onto the rejected line.
            const bearings = (USE_DEPART_BEARING && brg != null) ? '&bearings=' + Math.round(brg) + ',' + BRG_RANGE_DEG + ';' : '';
            const r = await fetch(OSRM_PROFILES[routeType] + coords + '?overview=full&geometries=geojson&steps=true' + bearings);
            data = await r.json();
        } catch (e) { if (gen === navGen) toast('Route fehlgeschlagen (offline?).'); return false; }
        if (gen !== navGen || !destLatLng) return false; // cleared/superseded while fetching → drop this result
        if (!data || data.code !== 'Ok' || !data.routes || !data.routes.length) { toast('Keine Route gefunden.'); return false; }
        const best = data.routes[0];
        drawRoute(best.geometry);
        setGuidance(best);
        routeTotalDist = best.distance || 0; // for ETA / remaining in the banner
        if (!reroute) tripTotalM = routeTotalDist; // first route → fix the "Strecke" total; reroutes don't move it
        routeTotalDur = best.duration || 0;
        lastReroute = Date.now();
        const km = (best.distance / 1000).toFixed(1);
        const min = Math.round(best.duration / 60);
        toast((reroute ? 'Neue Route: ' : 'Route: ') + km + ' km · ca. ' + min + ' min'
            + (reroute ? '' : ' nach ' + shortLabel(destLabel)));
        return true;
    }

    // Called by the core on START when a destination is set. Fire-and-forget there.
    // Record the history HERE (one choke point for every path: typed, live, dictated, POI, Solita, home) —
    // a destination counts as "navigated to" once the route actually computes, not merely when it was set.
    async function startNavigation() {
        if (!destLatLng) return false;
        const from = curPos();
        if (!from) { toast('Navigation: warte auf GPS-Position …'); return false; }
        const ok = await computeRoute(from, false);
        if (ok) { pushHistory(destLatLng, destLabel); saveLastRoute(); }
        return ok;
    }

    // Persist / restore the last navigated destination so a reload doesn't lose it (Doc 2026-06-25).
    function saveLastRoute() {
        try { localStorage.setItem(LAST_KEY, JSON.stringify({ lat: destLatLng[0], lng: destLatLng[1], label: destLabel || 'Ziel' })); } catch (e) { }
    }
    function restoreLastRoute() {
        let d; try { d = JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); } catch (e) { return; }
        if (!d || d.lat == null || d.lng == null) return;
        destLatLng = [d.lat, d.lng];
        destLabel = d.label || 'Ziel';
        showDestMarker();   // re-arm the destination (marker + panel); navigation starts on the next START/GO
        refreshPanel();
        refreshHome();
    }

    // Set a destination directly by COORDINATES (a POI / map-pin tap, not a typed address) and route to
    // it. Shared entry for FEAT-24 (POI), FEAT-25 (map pin) and FEAT-3/4 (park / back-to-car).
    async function navigateTo(latlng, label) {
        if (!latlng || latlng[0] == null) return false;
        navGen++; clearRouteLine();                 // drop any in-flight / old route first
        destLatLng = [latlng[0], latlng[1]];
        destLabel = label || 'Ziel';
        showDestMarker();
        refreshPanel();
        refreshHome();
        const from = curPos();
        try {
            if (from) map.fitBounds(L.latLngBounds([from, destLatLng]), { padding: [60, 60] });
            else map.setView(destLatLng, Math.max(map.getZoom(), 14));
        } catch (e) { }
        return startNavigation();                   // routes from the current position + banner/voice
    }

    function drawRoute(geojson) {
        clearRouteLine();
        const latlngs = (geojson.coordinates || []).map(c => [c[1], c[0]]); // GeoJSON is [lon,lat]
        if (!latlngs.length) { routeLatLngs = null; return; }
        routeLatLngs = latlngs;
        // Two-layer line: a dark casing under a bright core, so the route reads on any map tile.
        // Weights match the own speed track (5) so the route never reads WIDER than the recorded
        // track (Doc 2026-06-14, note #2). Casing adds just a thin dark edge for contrast.
        routeCasing = L.polyline(latlngs, { pane: 'nav-route', color: 'rgba(8,20,42,0.55)', weight: 7, opacity: 0.9, lineJoin: 'round' });
        routeCore = L.polyline(latlngs, { pane: 'nav-route', color: COL_ROUTE, weight: 5, opacity: 0.95, lineJoin: 'round' });
        routeLine = L.layerGroup([routeCasing, routeCore]).addTo(map);
    }

    // Nearest route segment to a point: returns the segment end index `bi` and the 0..1 position `bt`
    // along it. Single source for "draw only ahead" (note #1) + remaining distance/bounds.
    function nearestSeg(here) {
        const k = Math.cos(here[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const p = xy(here);
        let bi = 1, bt = 0, bd = Infinity;
        for (let i = 1; i < routeLatLngs.length; i++) {
            const a = xy(routeLatLngs[i - 1]), b = xy(routeLatLngs[i]);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
            if (d < bd) { bd = d; bi = i; bt = t; }
        }
        return { bi, bt };
    }

    // Redraw the route so only the part AHEAD of the current position stays blue; the already-driven
    // stretch is dropped, leaving just the recorded speed track there (Doc 2026-06-14, note #1).
    function redrawAhead(here) {
        if (!routeCore || !routeLatLngs || routeLatLngs.length < 2) return;
        const ahead = [here].concat(routeLatLngs.slice(nearestSeg(here).bi));
        routeCasing.setLatLngs(ahead);
        routeCore.setLatLngs(ahead);
    }

    // ---- Off-route detection → reroute. Called from the core on every GPS fix with [lat,lng]. ----
    // Cheap equirectangular projection to metres (good enough at street scale) + point-to-segment.
    function distToRouteM(p) {
        if (!routeLatLngs || routeLatLngs.length < 2) return 0;
        const k = Math.cos(p[0] * Math.PI / 180);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const px = xy(p);
        let min = Infinity;
        for (let i = 1; i < routeLatLngs.length; i++) {
            const a = xy(routeLatLngs[i - 1]), b = xy(routeLatLngs[i]);
            const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((px[0] - a[0]) * dx + (px[1] - a[1]) * dy) / len2 : 0;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(px[0] - (a[0] + t * dx), px[1] - (a[1] + t * dy));
            if (d < min) min = d;
        }
        return min;
    }

    // Throttled debug readout of the live off-route distance (note #4) — so we MEASURE at what real
    // distance a reroute fires (or whether the cooldown is what delays it) instead of guessing.
    let _navDbgT = 0;
    function navDbg(d, state) {
        if (!window.DebugWindow || !DebugWindow.log) return;
        const now = Date.now();
        if (now - _navDbgT < 1500) return; // ~1.5 s cadence, don't flood the panel
        _navDbgT = now;
        DebugWindow.log('nav: d2route=' + Math.round(d) + 'm (limit ' + OFFROUTE_M + ') · ' + state);
    }

    function update(here) {
        // Only while a route is actually drawn; bail cheaply otherwise (no dest, not started, mid-fetch).
        if (!destLatLng || !routeLatLngs || !here) return;
        redrawAhead(here);                                           // keep only the road ahead blue (note #1)
        // Track the live travel heading from GPS movement → feeds the departure-direction constraint on reroute.
        if (lastBrgPos == null) { lastBrgPos = here; }
        else if (haversine(lastBrgPos, here) >= BRG_MIN_MOVE_M) { travelBrg = bearingDeg(lastBrgPos, here); lastBrgPos = here; }
        if (rerouting) return;
        const d = distToRouteM(here);
        const cooling = Date.now() - lastReroute < REROUTE_COOLDOWN_MS;
        if (d <= OFFROUTE_M) {                                       // on route → announce the upcoming maneuver
            offRouteCount = 0;
            navDbg(d, 'on-route');
            guidanceUpdate(here);
            return;
        }
        // OFF route: do NOT keep speaking the OLD route's turns — they point back to the old line and felt
        // like being "pulled back" (Doc 2026-06-23). Show a recompute hint and route afresh to the dest ASAP.
        offRouteCount++;
        navDbg(d, 'OFF ' + offRouteCount + '/' + OFFROUTE_CONSEC + (cooling ? ' · cooldown' : ''));
        if (offRouteCount < OFFROUTE_CONSEC) return;                 // hysteresis: ignore a brief excursion / GPS jitter
        showRecomputeBanner();
        if (cooling) return;                                         // throttle the OSRM calls (weaving)
        rerouting = true;
        // Depart in the actual travel direction (when we have a trustworthy heading) so the new route never
        // begins with a U-turn back onto the rejected line ("bitte wenden" unterbunden — Doc 2026-06-24).
        computeRoute([here[0], here[1]], true, travelBrg).finally(() => { rerouting = false; });
    }

    // ---- Turn-by-turn guidance (spoken + on-screen banner) ----
    function haversine(a, b) {
        const R = 6371000, t = Math.PI / 180;
        const dLat = (b[0] - a[0]) * t, dLng = (b[1] - a[1]) * t;
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(x));
    }
    // Initial bearing (deg, 0=N) from a=[lat,lng] to b=[lat,lng] — the live travel heading for reroutes.
    function bearingDeg(a, b) {
        const t = Math.PI / 180;
        const y = Math.sin((b[1] - a[1]) * t) * Math.cos(b[0] * t);
        const x = Math.cos(a[0] * t) * Math.sin(b[0] * t) - Math.sin(a[0] * t) * Math.cos(b[0] * t) * Math.cos((b[1] - a[1]) * t);
        return (Math.atan2(y, x) / t + 360) % 360;
    }

    // OSRM maneuver (type + modifier + road name) → a short German instruction. We map the data;
    // we do not invent phrasings beyond this table.
    const DIR = {
        left: 'links', right: 'rechts', 'slight left': 'leicht links', 'slight right': 'leicht rechts',
        'sharp left': 'scharf links', 'sharp right': 'scharf rechts', straight: 'geradeaus', uturn: 'wenden',
    };
    function phrase(man, name) {
        const onto = name ? ' auf ' + name : '';
        const dir = DIR[man.modifier] || '';
        switch (man.type) {
            case 'depart': return 'Losfahren' + onto;
            case 'arrive': return 'Ziel erreicht';
            case 'turn': return man.modifier === 'straight' ? 'Geradeaus weiter' + onto : (dir || 'abbiegen') + ' abbiegen' + onto;
            case 'merge': return 'Einfädeln' + (dir ? ' ' + dir : '') + onto;
            case 'on ramp': return 'Auffahren' + (dir ? ' ' + dir : '') + onto;
            case 'off ramp': return 'Abfahren' + (dir ? ' ' + dir : '') + onto;
            case 'fork': return (dir ? dir + ' halten' : 'der Spur folgen') + onto;
            case 'end of road': return (dir || 'abbiegen') + ' abbiegen' + onto;
            case 'roundabout': case 'rotary':
                return man.exit ? 'Im Kreisverkehr die ' + man.exit + '. Ausfahrt' + onto : 'In den Kreisverkehr' + onto;
            case 'continue': return man.modifier && man.modifier !== 'straight' ? dir + onto : 'Weiter' + onto;
            case 'new name': return 'Weiter' + onto;
            default: return dir ? dir + onto : 'Weiter' + onto;
        }
    }

    // Rich banner detail from OSRM step fields: exit number · road ref/name · signpost destinations.
    // e.g. "Ausf. 24 · A 60 · → Frankfurt am Main, Darmstadt". Empty → banner falls back to the verb text.
    function detailOf(s) {
        const parts = [];
        if (s.exits) parts.push('Ausf. ' + s.exits);
        const ref = (s.ref || '').split(';').map((x) => x.trim()).filter(Boolean)[0];
        const road = ref || s.name || '';
        if (road) parts.push(road);
        if (s.destinations) {
            const dst = s.destinations.replace(/;/g, ', ').replace(/^[^:]*:\s*/, '').trim(); // strip a leading "A60: "
            if (dst) parts.push('→ ' + dst);
        }
        return parts.join(' · ');
    }

    // OSRM emits a maneuver for EVERY step — including pure street-NAME changes ('new name') and plain
    // straight-ahead 'continue'. Those aren't real turns; announcing them spams "Weiter auf …" and sounds
    // choppy (Doc 2026-06-23: wenn nur der Straßenname wechselt → NICHTS ansagen). Skip them entirely → no
    // banner, no voice; guidance jumps to the next REAL turn. A 'continue' WITH a direction is kept.
    function isSilentManeuver(man) {
        const t = man.type, mod = man.modifier;
        if (t === 'new name' || t === 'notification') return true;
        if (t === 'continue' && (!mod || mod === 'straight')) return true;
        if (t === 'turn' && mod === 'straight') return true;   // geradeaus, nur Straßenname wechselt → keine Ansage ("Geradeaus weiter auf X" war der choppy Spam)
        return false;
    }

    function setGuidance(best) {
        maneuvers = [];
        (best.legs || []).forEach((leg) => (leg.steps || []).forEach((s) => {
            const loc = s.maneuver && s.maneuver.location;
            if (!loc) return;
            if (isSilentManeuver(s.maneuver)) return;   // street-name change / plain continue → no announcement
            maneuvers.push({
                loc: [loc[1], loc[0]], type: s.maneuver.type, modifier: s.maneuver.modifier,
                exit: s.maneuver.exit, name: s.name, text: phrase(s.maneuver, s.name), detail: detailOf(s),
            });
        }));
        mIdx = 0;
        while (mIdx < maneuvers.length && maneuvers[mIdx].type === 'depart') mIdx++; // skip the leading "depart"
        annFar = false; annNear = false; mClosest = Infinity;
    }

    // ---- ETA / remaining: distance left ALONG the route from the current position ----
    function remainingMeters(here) {
        if (!routeLatLngs || routeLatLngs.length < 2) return null;
        const { bi, bt } = nearestSeg(here);
        let rem = (1 - bt) * haversine(routeLatLngs[bi - 1], routeLatLngs[bi]);
        for (let i = bi + 1; i < routeLatLngs.length; i++) rem += haversine(routeLatLngs[i - 1], routeLatLngs[i]);
        return rem;
    }

    // Bounds of the REMAINING route (current position → end), for the FIT "Reststrecke" mode.
    // null if no route is drawn. Reuses the nearest-segment search (nearestSeg).
    function remainingBounds(here) {
        if (!routeLatLngs || routeLatLngs.length < 2 || !here) return null;
        const pts = [here].concat(routeLatLngs.slice(nearestSeg(here).bi));   // current pos + everything ahead
        if (destLatLng) pts.push(destLatLng);
        try { return L.latLngBounds(pts); } catch (e) { return null; }
    }

    // Raw remaining-distance/-time along the route — single source for both the on-screen banner
    // (tripLine) and the live broadcast's ETA (note #3, formatted by the viewer). null if no route.
    function tripData(here) {
        const rem = remainingMeters(here);
        if (rem == null || routeTotalDist <= 0) return null;
        return { remM: rem, remSec: routeTotalDur * (rem / routeTotalDist) };
    }
    function tripLine(here) {
        const d = tripData(here);
        if (!d) return '';
        const eta = new Date(Date.now() + d.remSec * 1000);
        const clock = eta.getHours() + ':' + String(eta.getMinutes()).padStart(2, '0');
        const fmt = (m) => m >= 10000 ? Math.round(m / 1000) + ' km'
            : m >= 1000 ? (m / 1000).toFixed(1) + ' km'
                : Math.round(m / 50) * 50 + ' m';
        // Labelled so the three numbers read themselves (Doc 2026-06-22): arrival · whole route · remaining.
        // German decimal comma („6,5 km"); the cryptic "ETA … 4.9 / 6.5 … min" is replaced by named fields.
        const km = (m) => fmt(m).replace('.', ',');
        const min = Math.round(d.remSec / 60);
        return 'ANKUNFT ' + clock + '  ·  STRECKE ' + km(tripTotalM || routeTotalDist) + '  ·  ZU FAHREN ' + km(d.remM) + ' (' + min + ' min)';
    }

    function announceDist(d) { return d > 500 ? Math.round(d / 100) * 100 : Math.round(d / 50) * 50; }
    function fmtDist(d) { return d >= 1000 ? (d / 1000).toFixed(1) + ' km' : Math.round(d / 10) * 10 + ' m'; }

    // ---- Spoken guidance, hardened for the Android WebView (note #8) ----
    // Android's WebView keeps speechSynthesis SILENT until (a) it's been kicked off once inside a real
    // user gesture ("unlock") and (b) the voice list has loaded. So: load voices (+ on voiceschanged),
    // prime on the first user tap anywhere, resume if the engine is paused, and prefer a de-DE voice.
    // Everything is best-effort and logged to the DebugWindow so we can SEE on the Pixel what happens.
    const hasTts = ('speechSynthesis' in window);
    let ttsVoice = null, ttsPrimed = false;
    function ttsLog(m) { try { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('tts: ' + m); } catch (e) { } }
    function loadVoices() {
        if (!hasTts) return;
        try {
            const vs = window.speechSynthesis.getVoices() || [];
            if (vs.length) {
                ttsVoice = vs.find(v => /^de([-_]|$)/i.test(v.lang)) || ttsVoice;
                ttsLog('voices=' + vs.length + (ttsVoice ? ' · de=' + ttsVoice.name : ' · no de voice'));
            }
        } catch (e) { ttsLog('getVoices failed: ' + e); }
    }
    function primeSpeech() {
        if (ttsPrimed || !hasTts) return;
        ttsPrimed = true;
        try {
            loadVoices();
            const u = new SpeechSynthesisUtterance(' '); // silent kick inside the gesture → unlocks the WebView
            u.volume = 0; u.lang = 'de-DE';
            u.onstart = () => ttsLog('prime ▶ onstart');
            u.onend = () => ttsLog('prime ■ onend');
            u.onerror = (e) => ttsLog('prime ✗ onerror ' + ((e && e.error) || ''));
            window.speechSynthesis.speak(u);
            ttsLog('primed on user gesture');
        } catch (e) { ttsLog('prime failed: ' + e); }
    }
    if (hasTts) {
        loadVoices();
        try { window.speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { }
        // The first user tap ANYWHERE unlocks speech (one-shot, then detaches).
        const onGesture = () => { primeSpeech(); document.removeEventListener('pointerdown', onGesture); document.removeEventListener('click', onGesture); };
        document.addEventListener('pointerdown', onGesture);
        document.addEventListener('click', onGesture);
        // Android WebView leaves the engine 'paused' mid-utterance (esp. longer ones) → it goes silent.
        // A gentle periodic resume while it's meant to be speaking keeps audio flowing.
        setInterval(() => { try { const ss = window.speechSynthesis; if (ss && ss.speaking && ss.paused) ss.resume(); } catch (e) { } }, 4000);
    }

    // ---- Spoken-guidance QUEUE ----
    // Turn prompts that land close together (e.g. "Jetzt links" then "danach rechts") must NOT cut each
    // other off — we play them ONE AFTER ANOTHER. SolitaVoice.speak's promise resolves at playback START,
    // so the END is detected via onstate(false) (audio.onended), with a watchdog so a hung/failed synth
    // can't freeze the queue. A small cap drops the OLDEST still-waiting line (never the one playing) so a
    // pathological burst can't pile up stale guidance. stopSpeech() empties the queue.
    let navSpeakQueue = [];
    let navSpeaking = false;
    const SPEAK_QUEUE_MAX = 3;   // waiting lines (excl. the one currently playing); beyond this drop the oldest
    function clearSpeakQueue() { navSpeakQueue = []; navSpeaking = false; }
    function drainSpeakQueue() {
        if (navSpeaking) return;
        const text = navSpeakQueue.shift();
        if (text == null) return;
        navSpeaking = true;
        speakNow(text, function () { navSpeaking = false; drainSpeakQueue(); });
    }
    // Play exactly ONE line; call done() once — when it finishes, fails, or the watchdog fires.
    function speakNow(text, done) {
        let finished = false;
        const finish = function () { if (finished) return; finished = true; clearTimeout(wd); done(); };
        const wd = setTimeout(finish, 15000); // watchdog: never let a stuck synth freeze the queue
        if (window.SolitaVoice && window.SolitaVoice.speak) {
            try {
                window.SolitaVoice.speak(text, { onstate: function (on) { if (!on) finish(); } }); // onstate(false) = playback ended
                ttsLog('SolitaVoice ▶ "' + text + '"');
                return;
            } catch (e) { ttsLog('SolitaVoice failed: ' + e + ' — fallback to speechSynthesis'); }
        }
        speakSynth(text, finish);
    }

    // Stop ANY in-flight guidance + drop everything still queued (cloud audio + on-device speechSynthesis).
    function stopSpeech() {
        clearSpeakQueue();
        try { if (window.SolitaVoice && window.SolitaVoice.stop) window.SolitaVoice.stop(); } catch (e) { }
        try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { }
    }

    // Enqueue a guidance line (the queue plays them in order). PRIMARY engine: Solita's cloud TTS (Google
    // via the `tts` edge fn, js/solita-voice.js) — the SAME path that speaks in the Pixel's Android WebView,
    // where on-device speechSynthesis stays silent. FALLBACK: speechSynthesis (desktop/standalone). De-dupes
    // an identical line that's already waiting, so a repeated tick doesn't stutter.
    // Spoken-only pronunciation fixes: some voices (esp. on-device "Anna") mangle names — "Dresdner" → it
    // says "Dräsdner". We respell ONLY what the TTS receives; the on-screen banner keeps the correct spelling.
    // Add pairs here as more bad pronunciations surface.
    const SAY_AS = { 'Dresdner': 'Dreesdner' };
    function fixSpeech(t) {
        let s = t;
        for (const k in SAY_AS) s = s.replace(new RegExp(k, 'g'), SAY_AS[k]);
        return s;
    }
    function speak(text) {
        if (!voiceOn) { ttsLog('skip (voice off)'); return; }
        text = fixSpeech(text);   // spoken-only pronunciation fixes (display text stays correct)
        if (navSpeakQueue[navSpeakQueue.length - 1] === text) return; // identical line already queued
        navSpeakQueue.push(text);
        while (navSpeakQueue.length > SPEAK_QUEUE_MAX) navSpeakQueue.shift(); // burst → drop oldest waiting (stale)
        drainSpeakQueue();
    }

    // On-device Web-Speech fallback (kept for desktop/standalone; SILENT in the Android WebView — see speak()).
    // onDone() (optional) lets the guidance queue advance once this line ends/fails.
    function speakSynth(text, onDone) {
        onDone = onDone || function () { };
        if (!voiceOn || !hasTts) { ttsLog(voiceOn ? 'skip (no API)' : 'skip (voice off)'); onDone(); return; }
        try {
            if (!ttsPrimed) primeSpeech();                 // belt-and-braces if no tap seen yet
            const ss = window.speechSynthesis;
            if (!ttsVoice) loadVoices();                   // voices may have arrived since init
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'de-DE';
            if (ttsVoice) u.voice = ttsVoice;
            u.onstart = () => ttsLog('▶ onstart: ' + text);
            u.onend = () => { ttsLog('■ onend'); onDone(); };
            u.onerror = (e) => { ttsLog('✗ onerror ' + ((e && e.error) || '') + ' — Android-WebView spricht evtl. nicht (natives TTS-Plugin nötig)'); onDone(); };
            // Android WebView bug: cancel() immediately followed by speak() DROPS the new utterance, and the
            // engine is often left 'paused'. So cancel, then speak on the NEXT tick (+ resume) so it isn't eaten.
            try { ss.cancel(); } catch (e) { }
            setTimeout(() => {
                try { if (ss.paused) ss.resume(); } catch (e) { }
                try { ss.speak(u); ttsLog('speak() aufgerufen · voices=' + ((window.speechSynthesis.getVoices() || []).length) + (ttsVoice ? ' · de=' + ttsVoice.name : ' · default') + ' · "' + text + '"'); }
                catch (e) { ttsLog('speak failed: ' + e); onDone(); }
            }, 70);
        } catch (e) { ttsLog('speak failed: ' + e); onDone(); }
    }

    // Maneuver arrows from Mapbox's `directions-icons` set (public domain / CC0): FILLED single-path glyphs,
    // viewBox 20×20, designed for exactly OSRM's type/modifier — far more legible at banner size than the old
    // thin outline strokes (Doc 2026-06-23: „nicht gut zu lesen"). Source: github.com/mapbox/directions-icons.
    const ARROW_PATH = {
        straight: 'M14.50342,8.96637L11.55157,7.62262A0.35755,0.35755,0,0,0,11.00916,8v9.49652A0.50346,0.50346,0,0,1,10.50568,18h-0.993a0.50346,0.50346,0,0,1-.50348-0.50348V8a0.35756,0.35756,0,0,0-.54242-0.37738L5.51489,8.96637a0.38659,0.38659,0,0,1-.40942-0.62354L10.00916,2l4.90369,6.34283A0.3866,0.3866,0,0,1,14.50342,8.96637Z',
        left:     'M10,5.97986l0.011,0.00183A6.06019,6.06019,0,0,1,16,12.05493V16H15.99689l0.002,1.50317A0.49614,0.49614,0,0,1,15.50269,18H14.49622A0.49622,0.49622,0,0,1,14,17.50378V12.05493a4.05782,4.05782,0,0,0-3.98877-4.07324H8.01245a0.3576,0.3576,0,0,0-.37738.54248L8.97882,11.476a0.38659,0.38659,0,0,1-.62354.40942L2.0083,7l6.347-4.922a0.38659,0.38659,0,0,1,.62354.40942L7.63507,5.43927a0.35757,0.35757,0,0,0,.37738.54242H10Z',
        right:    'M9.98877,7.98169A4.05782,4.05782,0,0,0,6,12.05493v5.44885A0.49622,0.49622,0,0,1,5.50378,18H4.49731a0.49614,0.49614,0,0,1-.49615-0.49683L4.00311,16H4V12.05493A6.06019,6.06019,0,0,1,9.989,5.98169L10,5.97986V5.98169h1.98755a0.35757,0.35757,0,0,0,.37738-0.54242L11.02118,2.48743A0.38659,0.38659,0,0,1,11.64471,2.078L17.9917,7l-6.347,4.88544a0.38659,0.38659,0,0,1-.62354-0.40942l1.34375-2.95184a0.3576,0.3576,0,0,0-.37738-0.54248H9.98877Z',
        sleft:    'M14.9859,14.043v3.46082A0.49621,0.49621,0,0,1,14.48974,18H13.48321a0.49614,0.49614,0,0,1-.49615-0.49683l0.0047-3.60767a5.21819,5.21819,0,0,0-1.665-4.144L8.87854,7.68585a0.35758,0.35758,0,0,0-.6405.16266l-0.91821,3.1106A0.38663,0.38663,0,0,1,6.58044,10.86L5,3l8.00476,0.44965a0.38658,0.38658,0,0,1,.20294.71777L10.25878,5.51758a0.3576,0.3576,0,0,0-.07019.6571l2.45746,2.07385A7.25158,7.25158,0,0,1,14.9859,14.043Z',
        sright:   'M7.35395,8.24854L9.81141,6.17468a0.3576,0.3576,0,0,0-.07019-0.6571L6.7923,4.16742a0.38658,0.38658,0,0,1,.20294-0.71777L15,3l-1.58044,7.86a0.38663,0.38663,0,0,1-.73938.09912L11.762,7.84851a0.35758,0.35758,0,0,0-.6405-0.16266L8.67328,9.75146a5.21819,5.21819,0,0,0-1.665,4.144l0.0047,3.60767A0.49614,0.49614,0,0,1,6.51679,18H5.51026a0.49621,0.49621,0,0,1-.49615-0.49622V14.043A7.25157,7.25157,0,0,1,7.35395,8.24854Z',
        shleft:   'M15.49771,17.99542a0.49779,0.49779,0,0,1-.49779-0.49779V4.99933L14.72014,4.993a2.56758,2.56758,0,0,0-2.0957.79L7.22917,10.39583a0.34918,0.34918,0,0,0,.08252.63177l2.92877,1.39331a0.38658,0.38658,0,0,1-.21344.71472l-8.0105.33209,1.69568-7.836a0.38661,0.38661,0,0,1,.74072-0.0882l0.8725,3.12372a0.35757,0.35757,0,0,0,.638.17206L5.9672,8.84377,11.3593,4.23468a4.46634,4.46634,0,0,1,3.38477-1.24121l0.26416,0.002a1.92935,1.92935,0,0,1,1.43408.56885,2.10247,2.10247,0,0,1,.55713,1.46045L16.9999,17.49761a0.49779,0.49779,0,0,1-.49779.49781h-1.0044Z',
        shright:  'M3.49789,17.99542a0.49779,0.49779,0,0,1-.49779-0.49781L3.00057,5.02472A2.10247,2.10247,0,0,1,3.5577,3.56427a1.92935,1.92935,0,0,1,1.43408-.56885l0.26416-.002A4.46634,4.46634,0,0,1,8.6407,4.23468L14.0328,8.84377l0.00378-.00446a0.35757,0.35757,0,0,0,.638-0.17206l0.8725-3.12372a0.38661,0.38661,0,0,1,.74072.0882l1.69568,7.836L9.973,13.13564a0.38658,0.38658,0,0,1-.21344-0.71472l2.92877-1.39331a0.34918,0.34918,0,0,0,.08252-0.63177L7.37557,5.783a2.56758,2.56758,0,0,0-2.0957-.79l-0.27979.00635v12.4983a0.49779,0.49779,0,0,1-.49779.49779H3.49789Z',
        uturn:    'M17,8v9.49652A0.50346,0.50346,0,0,1,16.49652,18h-0.993A0.50346,0.50346,0,0,1,15,17.49652V8A3.5,3.5,0,0,0,8,8v4H7.99091a0.35757,0.35757,0,0,0,.54242.37738l2.95184-1.34375a0.3866,0.3866,0,0,1,.40942.62354L6.99091,18,2.08716,11.65717a0.3866,0.3866,0,0,1,.40942-0.62354l2.95184,1.34375A0.3576,0.3576,0,0,0,5.99091,12H6V8A5.5,5.5,0,0,1,17,8Z',
        roundabout: 'M5.5,10.002a0.17879,0.17879,0,0,0,.27124.18866l1.47589-.67188a0.1933,0.1933,0,0,1,.20471.31177L5,13.002,2.54816,9.83051a0.1933,0.1933,0,0,1,.20471-0.31177l1.476,0.67188A0.17876,0.17876,0,0,0,4.5,10.002V10A5.51888,5.51888,0,0,1,7.25293,5.23437l0.5,0.86523A4.51856,4.51856,0,0,0,5.5,10v0.002Zm6.75146-3.89941A4.51948,4.51948,0,0,1,14.5,10h1a5.5223,5.5223,0,0,0-2.74756-4.7627L12.751,5.23724A0.17878,0.17878,0,0,1,12.72321,4.908L14.043,3.96576a0.19332,0.19332,0,0,0-.16766-0.33319l-3.97247.53766,1.52063,3.70911a0.19331,0.19331,0,0,0,.37238-0.02142L11.952,6.24377A0.17945,0.17945,0,0,1,12.25146,6.10254ZM12.74688,14.766a0.17879,0.17879,0,0,1,.299.14053l0.1561,1.61412a0.1933,0.1933,0,0,0,.37235.02141L15.095,12.833l-3.97245-.53766a0.1933,0.1933,0,0,0-.16764.33317l1.31982,0.94225a0.17879,0.17879,0,0,1-.02781.32923l0.00361-.00254a4.57684,4.57684,0,0,1-4.502,0l-0.501.86523a5.50442,5.50442,0,0,0,5.50391,0Z',
        arrive:   'M10,5a2,2,0,1,1,2-2A2,2,0,0,1,10,5Zm4.91284,8.35114L10.00916,7.0083,5.10547,13.35114a0.38659,0.38659,0,0,0,.40942.62354l2.95184-1.34375A0.35542,0.35542,0,0,1,9.00769,13H9v5.50006A0.49992,0.49992,0,0,0,9.49994,19h1.00012A0.49992,0.49992,0,0,0,11,18.50006V13.0083h0.00916a0.35757,0.35757,0,0,1,.54242-0.37738l2.95184,1.34375A0.3866,0.3866,0,0,0,14.91284,13.35114Z',
    };
    function arrowKey(m) {
        if (m.type === 'arrive') return 'arrive';
        if (m.type === 'roundabout' || m.type === 'rotary') return 'roundabout';
        if (m.modifier === 'uturn') return 'uturn';
        return { left: 'left', right: 'right', 'slight left': 'sleft', 'slight right': 'sright',
                 'sharp left': 'shleft', 'sharp right': 'shright' }[m.modifier] || 'straight';
    }
    function arrowSvg(m) {
        const d = ARROW_PATH[arrowKey(m)] || ARROW_PATH.straight;
        // Filled glyphs (fill = currentColor) so they keep theming with the banner (dark ink on the orange/green).
        return '<svg class="nav-arrow" viewBox="0 0 20 20" fill="currentColor"><path d="' + d + '"/></svg>';
    }
    // While off-route (before the new route arrives): show a neutral "recomputing" hint instead of the OLD
    // next turn, so the banner doesn't keep pointing back to the stale route. Guard so we don't re-parse the
    // DOM on every GPS fix; showBanner() clears the flag when normal guidance resumes.
    function showRecomputeBanner() {
        const el = $('nav-banner'); if (!el) return;
        if (el.dataset.recompute === '1') return;
        el.dataset.recompute = '1';
        el.innerHTML = '<div class="nav-main"><span class="nav-instr">Route wird neu berechnet …</span></div>';
        el.hidden = false;
    }
    // Two rows: maneuver (arrow + distance + road/ref + signpost destinations) · trip (ETA · remaining).
    function showBanner(m, d, trip) {
        const el = $('nav-banner'); if (!el) return;
        el.dataset.recompute = '';   // normal guidance resumed → allow the recompute hint to show again later
        el.innerHTML =
            '<div class="nav-main">' + arrowSvg(m)
            + '<span class="nav-dist"></span><span class="nav-instr"></span></div>'
            + '<div class="nav-trip"></div>'; // SVG from a fixed table (safe); text set below via textContent
        el.querySelector('.nav-dist').textContent = fmtDist(d);
        el.querySelector('.nav-instr').textContent = m.detail || m.text; // OSM names via textContent (no injection)
        const t = el.querySelector('.nav-trip');
        t.textContent = trip || ''; t.hidden = !trip;
        // Banner colour by Wegtyp: Laufen → green (default), Auto → orange (Doc 2026-06-21).
        el.classList.toggle('route-car', routeType === 'car');
        el.hidden = false;
    }
    function hideBanner() { const el = $('nav-banner'); if (el) el.hidden = true; }

    function advanceManeuver() {
        mIdx++; annFar = false; annNear = false; mClosest = Infinity;
        if (mIdx >= maneuvers.length) setTimeout(hideBanner, 3000);
    }

    function guidanceUpdate(here) {
        if (!maneuvers || mIdx >= maneuvers.length) return;
        const m = maneuvers[mIdx];
        const d = haversine(here, m.loc);
        if (d < mClosest) mClosest = d;
        showBanner(m, d, tripLine(here));
        if (m.type === 'arrive') {
            // Destination: you stop there (no overshoot to detect), so announce + finish at the near window.
            if (d <= ANNOUNCE_NEAR_M) { speak('Sie haben das Ziel erreicht.'); advanceManeuver(); if (ctx.onArrive) ctx.onArrive(); }
            else if (d <= ANNOUNCE_FAR_M && !annFar) { annFar = true; speak('In ' + announceDist(d) + ' Metern erreichen Sie das Ziel.'); }
            return;
        }
        // Pre-warning at ~300 m, "Jetzt …" at ~40 m — but KEEP this maneuver on the banner until you have
        // actually PASSED it (overshoot), so it doesn't jump to the NEXT turn while you're still taking this
        // one (Doc 2026-06-24: "die nächste kommt viel zu schnell, ich hab die eine noch nicht ausgeführt").
        if (d <= ANNOUNCE_NEAR_M && !annNear) { annNear = true; speak('Jetzt ' + m.text); }
        else if (d <= ANNOUNCE_FAR_M && !annFar) { annFar = true; speak('In ' + announceDist(d) + ' Metern ' + m.text + '.'); }
        if (mClosest <= 120 && d > mClosest + 30) advanceManeuver();   // passed the turn → only now show the next
    }

    // Reset the live "found" feedback (green line + name hint). Called when the dialog opens, the route is
    // cleared, or an explicit set supersedes it.
    function clearFoundUI() {
        const input = $('nav-dest'), hint = $('nav-found-hint');
        if (input) input.classList.remove('nav-found');
        if (hint) hint.hidden = true;
    }

    // ---- Panel ----
    function refreshPanel() {
        const cur = $('nav-current'), clr = $('nav-clear');
        if (cur) { cur.textContent = destLabel ? ('Ziel: ' + shortLabel(destLabel)) : ''; cur.hidden = !destLabel; }
        if (clr) clr.hidden = !destLabel;
    }

    function openPanel() { refreshPanel(); renderHistory(); clearFoundUI(); showPanel('nav-panel'); }

    // Frame the WHOLE route (start → destination) in view — the overview shown briefly at nav start
    // before the map glides into the crosshair follow-view. Falls back to current-position↔destination
    // if the route geometry isn't there yet. Returns true if it framed something.
    function frameRoute() {
        try {
            if (routeLatLngs && routeLatLngs.length > 1) {
                map.fitBounds(L.latLngBounds(routeLatLngs), { padding: [60, 60] });
                return true;
            }
            const from = curPos();
            if (from && destLatLng) { map.fitBounds(L.latLngBounds([from, destLatLng]), { padding: [60, 60] }); return true; }
        } catch (e) { }
        return false;
    }

    // "STARTEN" (Doc 2026-06-20): with live geocoding the destination is usually already set while typing.
    // One tap ensures a destination (geocode the line if it wasn't auto-set), closes the dialog, and kicks
    // off recording + navigation via the core — the START toggle then flips to PAUSE. The old two-step
    // "Ziel setzen, dann START" collapses into one.
    async function startFromDialog() {
        if (!hasDestination()) {
            const q = ($('nav-dest').value || '').trim();
            if (!q) { toast('Bitte ein Ziel eingeben.'); return; }
            toast('Suche Adresse …');
            let hit;
            try { hit = await geocode(q); }
            catch (e) { toast('Adress-Suche fehlgeschlagen (offline?).'); return; }
            if (!hit) { toast('Adresse nicht gefunden.'); return; }
            destLatLng = [parseFloat(hit.lat), parseFloat(hit.lon)];
            destLabel = hit.display_name || q;
            showDestMarker();
            refreshHome();
        }
        clearFoundUI();
        hidePanels();
        if (ctx.startTracking) ctx.startTracking();   // core: beginTracking() → recording + navigation
    }

    // Wire the panel's own buttons once.
    const setBtn = $('nav-set'); if (setBtn) setBtn.addEventListener('click', startFromDialog);
    const clrBtn = $('nav-clear'); if (clrBtn) clrBtn.addEventListener('click', () => { clearRoute(); try { localStorage.removeItem(LAST_KEY); } catch (e) { } toast('Ziel gelöscht.'); });
    const hereBtn = $('nav-here'); if (hereBtn) hereBtn.addEventListener('click', savePin);

    // Enter in the single line = STARTEN (faster than reaching for the button).
    const destInput = $('nav-dest');
    if (destInput) destInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); startFromDialog(); } });

    // Live geocoding while typing (Doc 2026-06-20): once a hit is found, turn the line GREEN, show the
    // resolved name, and SET the destination silently (drop the pin, NO panel-close, NO map-jump) — so
    // START works without a separate "Ziel setzen" tap. Debounced + position-biased; newer keystrokes win.
    (function initLiveGeocode() {
        const input = $('nav-dest'); if (!input) return;
        const hint = $('nav-found-hint');
        const nameEl = hint ? hint.querySelector('.nav-found-name') : null;
        const MIN_LEN = 4, DEBOUNCE_MS = 650;
        let timer = null, gen = 0, foundFor = '';

        function showFound(label) {
            input.classList.add('nav-found');
            if (nameEl) nameEl.textContent = shortLabel(label);
            if (hint) hint.hidden = false;
        }
        async function run(q) {
            const my = ++gen;
            let hit;
            try { hit = await geocode(q); } catch (e) { return; }  // offline → stay quiet, button still works
            if (my !== gen || ($('nav-dest').value || '').trim() !== q) return; // superseded by a newer keystroke
            if (!hit) { clearFoundUI(); foundFor = ''; return; }    // no match → no green (don't touch a prior set)
            destLatLng = [parseFloat(hit.lat), parseFloat(hit.lon)];
            destLabel = hit.display_name || q;
            showDestMarker();                                       // drop the pin; do NOT fit/center (no jump while typing)
            refreshHome();
            foundFor = q;
            showFound(destLabel);
        }
        input.addEventListener('input', () => {
            const q = (input.value || '').trim();
            if (q !== foundFor) clearFoundUI();                     // edited away from the match → drop the stale green
            if (timer) clearTimeout(timer);
            if (q.length < MIN_LEN) { gen++; return; }              // too short → cancel any pending lookup
            timer = setTimeout(() => run(q), DEBOUNCE_MS);
        });
    })();

    // Mic dictation: tap → speak the address → it fills the line (same Web-Speech API Solita uses, but a
    // simple one-shot here — no wake-word). No SR support (or denied) → the mic just hides; typing stays.
    (function initNavMic() {
        const micBtn = $('nav-mic'), input = $('nav-dest');
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!micBtn || !input) return;
        if (!SR) { micBtn.hidden = true; return; }
        let rec = null, listening = false;
        // Drive the visible "recording" state: the pulsing red mic button with the "la ola" wave inside it.
        // Toggled OPTIMISTICALLY on tap (not waiting for onstart, which is flaky/late in the Android WebView)
        // so Doc gets instant feedback that the mic is open.
        function setListeningUI(on) {
            listening = on;
            micBtn.classList.toggle('listening', on);
        }
        micBtn.addEventListener('click', () => {
            if (listening) { try { rec && rec.stop(); } catch (e) { } return; }   // tap again → stop
            rec = new SR();
            rec.lang = 'de-DE';
            rec.interimResults = true;
            rec.maxAlternatives = 1;
            rec.continuous = false;
            let finalText = '';
            setListeningUI(true);                                  // instant feedback, before the engine starts
            rec.onstart = () => setListeningUI(true);
            rec.onresult = (e) => {
                let interim = '';
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    const t = e.results[i][0].transcript;
                    if (e.results[i].isFinal) finalText += t; else interim += t;
                }
                input.value = (finalText + interim).replace(/\s+/g, ' ').trim();
            };
            rec.onerror = () => { /* denied / no-speech → just stop; onend cleans up */ };
            // After dictation, run the live lookup on the spoken text too (onresult set .value programmatically,
            // which doesn't fire 'input') → a dictated address also goes green + sets the destination.
            rec.onend = () => { setListeningUI(false); input.focus(); input.dispatchEvent(new Event('input')); };
            try { rec.start(); } catch (e) { setListeningUI(false); }
        });
    })();

    // Load the saved home + sync the hint. The "Nach Hause" action now lives as the pinned first row of
    // the history list (see homeRow) — tap to go, long-press to save — so there's no standalone button.
    (function initHome() {
        home = loadHome();   // instant from localStorage …
        refreshHome();
        hydrateFromCloud();  // … then let the cloud copy (same account) override / seed it
        restoreLastRoute();  // re-arm the last navigated destination (survives reload)
    })();

    // Voice toggle (persisted): default on, but the user can silence spoken guidance.
    voiceOn = localStorage.getItem(VOICE_KEY) !== '0';
    const voiceBox = $('nav-voice');
    if (voiceBox) {
        voiceBox.checked = voiceOn;
        voiceBox.addEventListener('change', () => {
            voiceOn = voiceBox.checked;
            localStorage.setItem(VOICE_KEY, voiceOn ? '1' : '0');
            if (!voiceOn) stopSpeech();
        });
    }

    // Wegetyp toggle (persisted): Straße (car) vs Laufen (foot) → switches the OSRM profile. If a destination
    // is active we recompute right away so the mode change is visible immediately.
    (function () {
        const seg = Array.from(document.querySelectorAll('.seg-btn[data-route]'));
        if (!seg.length) return;
        const reflect = () => seg.forEach((b) => b.classList.toggle('active', b.getAttribute('data-route') === routeType));
        seg.forEach((b) => b.addEventListener('click', () => {
            const t = b.getAttribute('data-route') === 'foot' ? 'foot' : 'car';
            if (t === routeType) return;
            routeType = t; localStorage.setItem(ROUTE_KEY, routeType); reflect();
            if (destLatLng) { const from = curPos(); if (from) computeRoute(from, false); }   // re-route in the new profile
        }));
        reflect();
    })();

    const api = { openPanel, hasDestination, startNavigation, navigateTo, clearRoute, update, remainingBounds, frameRoute, tripData, routePoints: () => routeLatLngs };
    // Bridge for the Solita navigate_to add-on (js/solita-navigate.js): the nav instance is module-private
    // in tracker.js (__nav), so publish a handle here so the voice tool can route programmatically without
    // touching tracker.js. Last constructed instance wins (there is only one).
    window.__trackerNav = api;
    return api;
};
