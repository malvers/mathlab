// js/tracker-fuel.js — Tankstellen-Spur: nearby fuel stations + live prices on the map.
// While you drive, each pin shows the current price; the cheap ones glow green so a good deal
// nearby is obvious at a glance ("hier ist es grad besonders günstig"). Prices come from
// Tankerkönig (Markttransparenzstelle für Kraftstoffe) via the 'fuel-prices' Edge Function — the
// API key lives ONLY server-side, never in this public repo. Tankerkönig data is CC BY-NC.
//
// ctx (from tracker.js): { map, toast, SUPABASE_URL, SUPABASE_KEY, COL_GREEN, COL_ORANGE, COL_RED }
window.TrackerFuel = function (ctx) {
    const { map, toast, SUPABASE_URL, SUPABASE_KEY, navigateTo } = ctx;
    const ENDPOINT = SUPABASE_URL + '/functions/v1/fuel-prices';

    const RAD_KM = 5;            // search radius around the current position
    const REFRESH_MS = 180000;   // re-poll prices at most every 3 min …
    const REFRESH_MOVE_M = 2000; // … or once we've moved 2 km from the last fetch
    const CHEAP_EPS = 0.02;      // ≥2 ct below the local median = "cheap" (green); ≥2 ct above = pricey
    const FUELS = ['e5', 'e10', 'diesel'];

    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('fuel: ' + m); };

    let layer = null;
    let stations = [];
    let lastLat = null, lastLng = null, lastFetch = 0;
    let busy = false;
    let lastCheapId = null;      // so a cheap station is announced only once, not on every poll
    let fuelType = localStorage.getItem('trk-fuel-type') || 'e5';
    let enabled = localStorage.getItem('trk-fuel-on') !== '0'; // on by default

    // Two stacked panes so the price badge ALWAYS sits above the ⛽ station symbol (z1 symbol, z2 badge):
    // a separate marker each, the symbol on the lower pane, the price on the higher one. This way no
    // neighbouring station's symbol can ever cover a price — z-index decides, not Leaflet's lat order.
    function ensureLayer() {
        if (!layer) {
            if (!map.getPane('fuelSym')) map.createPane('fuelSym').style.zIndex = 610;
            if (!map.getPane('fuelPrice')) map.createPane('fuelPrice').style.zIndex = 620;
            layer = L.layerGroup().addTo(map);
        }
        return layer;
    }

    // metres between two lat/lng points (haversine — plenty accurate at city scale)
    function distM(aLat, aLng, bLat, bLng) {
        const R = 6371000, toRad = Math.PI / 180;
        const dLat = (bLat - aLat) * toRad, dLng = (bLng - aLng) * toRad;
        const s = Math.sin(dLat / 2) ** 2 +
            Math.cos(aLat * toRad) * Math.cos(bLat * toRad) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(s));
    }

    function priceOf(s) { const p = s[fuelType]; return (typeof p === 'number' && p > 0) ? p : null; }
    function fmt(p) { return p == null ? '—' : p.toFixed(3).replace('.', ','); } // 1.799 → "1,799"

    // Median price (open stations only) → the local reference for "cheap vs pricey".
    function medianPrice() {
        const ps = stations.filter(s => s.isOpen && priceOf(s) != null).map(priceOf).sort((a, b) => a - b);
        if (!ps.length) return null;
        const m = Math.floor(ps.length / 2);
        return ps.length % 2 ? ps[m] : (ps[m - 1] + ps[m]) / 2;
    }

    function tier(s, med) {
        const p = priceOf(s);
        if (p == null || !s.isOpen) return 'na';          // closed / no price → grey
        if (med == null) return 'mid';
        if (p <= med - CHEAP_EPS) return 'cheap';         // φ green
        if (p >= med + CHEAP_EPS) return 'exp';           // Υ red
        return 'mid';                                     // λ orange
    }

    // Pills are sized to their REAL rendered box (font metrics), NOT a guessed fixed width — a wider
    // price ("1,799" / 4 digits) used to overflow the old [56,22] box and spill out of the coloured
    // pill ("too narrow"). Leaflet still needs an explicit iconSize, so render the pill once off-screen
    // and read its offsetWidth/Height. One reused hidden host; the same stylesheet drives both.
    let measureHost = null;
    function measurePill(html) {
        if (!measureHost) {
            measureHost = document.createElement('div');
            measureHost.style.cssText = 'position:absolute;left:-9999px;top:-9999px;' +
                'visibility:hidden;pointer-events:none;display:inline-block;';
            document.body.appendChild(measureHost);
        }
        measureHost.innerHTML = html;
        const el = measureHost.firstElementChild;
        return [Math.ceil(el.offsetWidth), Math.ceil(el.offsetHeight)];
    }

    // Lower layer (z1): the ⛽ station symbol, anchored with its bottom on the geo point (map-pin style).
    function symIcon() {
        return L.divIcon({
            className: 'fuel-sym-wrap', html: '<div class="fuel-sym">⛽</div>',
            iconSize: [26, 26], iconAnchor: [13, 26],
        });
    }

    // Upper layer (z2): the coloured price badge, floating just above the symbol so the price stays readable.
    function priceIcon(s, med) {
        const html = '<div class="fuel-pin ' + tier(s, med) + '">' +
            '<span class="fuel-price">' + fmt(priceOf(s)) + '</span></div>';
        const [w, h] = measurePill(html);
        return L.divIcon({
            className: 'fuel-pin-wrap', html,
            iconSize: [w, h], iconAnchor: [Math.round(w / 2), h + 20], popupAnchor: [0, -h - 20],
        });
    }

    function popupHtml(s) {
        const row = (lbl, p) => '<div class="fp-row"><span>' + lbl + '</span><span>' + fmt(p) + ' €</span></div>';
        const addr = [s.street, s.houseNumber].filter(Boolean).join(' ') + (s.place ? ', ' + s.place : '');
        return '<div class="fuel-popup">' +
            '<div class="fp-name">' + (s.brand || s.name || 'Tankstelle') + '</div>' +
            (addr ? '<div class="fp-addr">' + addr + '</div>' : '') +
            row('Super E5', s.e5) + row('Super E10', s.e10) + row('Diesel', s.diesel) +
            '<div class="fp-meta">' + (s.isOpen ? 'geöffnet' : 'geschlossen') +
            (typeof s.dist === 'number' ? ' · ' + s.dist.toFixed(1) + ' km' : '') + '</div>' +
            '<button type="button" class="fp-nav">Bring mich hin</button></div>';
    }

    // Wire the "Bring mich hin" button each time the popup opens (Leaflet rebuilds the DOM), routing
    // to THIS station via tracker-nav. Both the symbol and the price marker share one station object.
    function bindPopupNav(marker, s) {
        marker.on('popupopen', (ev) => {
            const b = ev.popup.getElement().querySelector('.fp-nav');
            if (b) b.onclick = () => {
                map.closePopup();
                if (navigateTo) navigateTo([s.lat, s.lng], s.brand || s.name || 'Tankstelle');
            };
        });
    }

    function render() {
        const lyr = ensureLayer();
        lyr.clearLayers();
        if (!enabled) return;
        const med = medianPrice();
        for (const s of stations) {
            if (typeof s.lat !== 'number' || typeof s.lng !== 'number') continue;
            const html = popupHtml(s);
            const m1 = L.marker([s.lat, s.lng], { icon: symIcon(), pane: 'fuelSym', keyboard: false })
                .bindPopup(html).addTo(lyr);
            const m2 = L.marker([s.lat, s.lng], { icon: priceIcon(s, med), pane: 'fuelPrice', keyboard: false })
                .bindPopup(html).addTo(lyr);
            bindPopupNav(m1, s); bindPopupNav(m2, s);
        }
        announceCheapest(med);
    }

    // Gentle heads-up: the closest clearly-cheap open station, announced once (not on every poll).
    function announceCheapest(med) {
        if (med == null) { lastCheapId = null; return; }
        const cheap = stations
            .filter(s => s.isOpen && priceOf(s) != null && priceOf(s) <= med - CHEAP_EPS)
            .sort((a, b) => (a.dist || 1e9) - (b.dist || 1e9))[0];
        if (!cheap) { lastCheapId = null; return; }
        if (cheap.id === lastCheapId) return;             // already mentioned this one
        lastCheapId = cheap.id;
        const name = cheap.brand || cheap.name || 'Tankstelle';
        if (toast) toast('⛽ Günstig: ' + name + ' ' + fmt(priceOf(cheap)) + ' € (' + fuelType.toUpperCase() + ')');
    }

    async function fetchStations(lat, lng) {
        busy = true;
        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
                body: JSON.stringify({ lat, lng, rad: RAD_KM }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok || !d.ok) { dbg('ERR ' + (d.error || res.status)); return; }
            stations = d.stations || [];
            lastLat = lat; lastLng = lng; lastFetch = Date.now();
            dbg('got ' + stations.length + ' stations (r' + d.rad + 'km)');
            render();
        } catch (e) {
            dbg('ERR ' + (e && (e.message || e)));        // offline / not deployed yet → stay quiet
        } finally { busy = false; }
    }

    // Called from onPosition on every GPS fix. Re-polls only when we've moved far enough or enough
    // time has passed — keeps the (non-commercial) Tankerkönig usage gentle.
    function update(here) {
        if (!enabled || busy || !here) return;
        const lat = here[0], lng = here[1];
        if (typeof lat !== 'number' || typeof lng !== 'number') return;
        const moved = (lastLat == null) ? Infinity : distM(lastLat, lastLng, lat, lng);
        if (moved >= REFRESH_MOVE_M || (Date.now() - lastFetch) >= REFRESH_MS) fetchStations(lat, lng);
    }

    function setFuelType(t) {
        if (!FUELS.includes(t)) return;
        fuelType = t; localStorage.setItem('trk-fuel-type', t);
        lastCheapId = null; render();                     // recolour + re-evaluate cheap for the new fuel
    }
    function setEnabled(on) {
        enabled = !!on; localStorage.setItem('trk-fuel-on', enabled ? '1' : '0');
        if (!enabled) { if (layer) layer.clearLayers(); }
        else if (lastLat != null) render();
    }
    function clear() {
        if (layer) layer.clearLayers();
        stations = []; lastLat = lastLng = null; lastFetch = 0; lastCheapId = null;
    }

    return {
        update, setFuelType, setEnabled, clear,
        getStations: () => stations,
        get fuelType() { return fuelType; },
        get enabled() { return enabled; },
    };
};
