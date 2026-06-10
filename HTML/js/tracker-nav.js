// js/tracker-nav.js — Simple navigation for the tracker (address → route).
//
// Deliberately minimal (per plan-navigation-einfach.md): the user types a destination address,
// taps "Ziel setzen", then START both navigates AND records the track. No POI picking, no re-routing,
// no traffic. Free + key-less services only (CLAUDE.md rule 18):
//   - Geocoding: Nominatim  (address → lat/lng)
//   - Routing:   OSRM demo  (driving profile → route geometry + distance/duration)
//
// Additive: owns its own Leaflet layers (route polyline + destination pin) and the #nav-panel UI;
// the core (tracker.js) only asks hasDestination() on START and clearRoute() on STOP.
window.TrackerNav = function (ctx) {
    const { map, $, toast, showPanel, hidePanels } = ctx;

    const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
    const OSRM = 'https://router.project-osrm.org/route/v1/driving/';
    const COL_ROUTE = 'rgb(66, 135, 245)'; // blue — distinct from the green/orange track + red position dot

    let destLatLng = null;  // [lat, lng] of the set destination, or null
    let destLabel = '';     // human-readable address (for the panel + toasts)
    let destMarker = null;  // Leaflet pin at the destination
    let routeLine = null;   // Leaflet polyline of the computed route

    function hasDestination() { return !!destLatLng; }

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

    function shortLabel(s) { return (s || '').split(',').slice(0, 2).join(',').trim(); }

    // ---- Geocoding: the three address fields → the first Nominatim hit ----
    async function setDestination() {
        const city = ($('nav-city').value || '').trim();
        const street = ($('nav-street').value || '').trim();
        const nr = ($('nav-nr').value || '').trim();
        if (!city && !street) { toast('Bitte mindestens Stadt oder Straße angeben.'); return; }
        const q = [street + (nr ? ' ' + nr : ''), city].filter(Boolean).join(', ');
        toast('Suche Adresse …');
        let data;
        try {
            const url = NOMINATIM + '?format=jsonv2&limit=1&q=' + encodeURIComponent(q);
            const r = await fetch(url, { headers: { Accept: 'application/json' } });
            data = await r.json();
        } catch (e) { toast('Adress-Suche fehlgeschlagen (offline?).'); return; }
        if (!data || !data.length) { toast('Adresse nicht gefunden.'); return; }
        const hit = data[0];
        destLatLng = [parseFloat(hit.lat), parseFloat(hit.lon)];
        destLabel = hit.display_name || q;
        showDestMarker();
        // Frame both the current position and the destination so the relationship is clear; if we have
        // no fix yet, just centre on the destination.
        const from = curPos();
        try {
            if (from) map.fitBounds(L.latLngBounds([from, destLatLng]), { padding: [60, 60] });
            else map.setView(destLatLng, Math.max(map.getZoom(), 13));
        } catch (e) { }
        hidePanels();
        toast('Ziel gesetzt: ' + shortLabel(destLabel) + ' — jetzt START');
    }

    function showDestMarker() {
        if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
        if (destLatLng) destMarker = L.marker(destLatLng, { icon: destIcon(), title: destLabel }).addTo(map);
    }

    function clearRouteLine() { if (routeLine) { map.removeLayer(routeLine); routeLine = null; } }

    // Full teardown — used by "Ziel löschen" and by STOP (finish/discard) in the core.
    function clearRoute() {
        clearRouteLine();
        if (destMarker) { map.removeLayer(destMarker); destMarker = null; }
        destLatLng = null; destLabel = '';
        refreshPanel();
    }

    // ---- Routing: current position → destination, drawn as a polyline ----
    // Called by the core on START when a destination is set. Returns a promise (fire-and-forget there).
    async function startNavigation() {
        if (!destLatLng) return false;
        const from = curPos();
        if (!from) { toast('Navigation: warte auf GPS-Position …'); return false; }
        toast('Route wird berechnet …');
        let data;
        try {
            // OSRM wants lon,lat order; full geometry as GeoJSON for an easy polyline.
            const coords = from[1] + ',' + from[0] + ';' + destLatLng[1] + ',' + destLatLng[0];
            const r = await fetch(OSRM + coords + '?overview=full&geometries=geojson');
            data = await r.json();
        } catch (e) { toast('Route fehlgeschlagen (offline?).'); return false; }
        if (!data || data.code !== 'Ok' || !data.routes || !data.routes.length) { toast('Keine Route gefunden.'); return false; }
        const route = data.routes[0];
        drawRoute(route.geometry);
        const km = (route.distance / 1000).toFixed(1);
        const min = Math.round(route.duration / 60);
        toast('Route: ' + km + ' km · ca. ' + min + ' min nach ' + shortLabel(destLabel));
        return true;
    }

    function drawRoute(geojson) {
        clearRouteLine();
        const latlngs = (geojson.coordinates || []).map(c => [c[1], c[0]]); // GeoJSON is [lon,lat]
        if (!latlngs.length) return;
        // Two-layer line: a dark casing under a bright core, so the route reads on any map tile.
        routeLine = L.layerGroup([
            L.polyline(latlngs, { color: 'rgba(8,20,42,0.55)', weight: 11, opacity: 0.9, lineJoin: 'round' }),
            L.polyline(latlngs, { color: COL_ROUTE, weight: 6, opacity: 0.95, lineJoin: 'round' }),
        ]).addTo(map);
    }

    // ---- Panel ----
    function refreshPanel() {
        const cur = $('nav-current'), clr = $('nav-clear');
        if (cur) { cur.textContent = destLabel ? ('Ziel: ' + shortLabel(destLabel)) : ''; cur.hidden = !destLabel; }
        if (clr) clr.hidden = !destLabel;
    }

    function openPanel() { refreshPanel(); showPanel('nav-panel'); }

    // Wire the panel's own buttons once.
    const setBtn = $('nav-set'); if (setBtn) setBtn.addEventListener('click', setDestination);
    const clrBtn = $('nav-clear'); if (clrBtn) clrBtn.addEventListener('click', () => { clearRoute(); toast('Ziel gelöscht.'); });

    return { openPanel, hasDestination, startNavigation, clearRoute };
};
