// js/tracker-poi.js — Points of Interest overlay (FEAT-24). Named POIs from OpenStreetMap via Overpass
// for the VISIBLE map area (keyless — Regel 18), drawn as category-coloured pins; a tap offers
// "Navi hierhin" (tracker-nav.js). The active categories are the checkboxes in the POI panel
// (poi-cat-* in localStorage), so the layer follows what Doc ticked. Skeleton ported from tracker-fuel.js.
//
// ctx (from tracker.js): { map, toast, navigateTo(latlng,name), curPos()->[lat,lng]|null }
window.TrackerPoi = function (ctx) {
    const { map, toast, navigateTo } = ctx;

    // id (checkbox) → { default-on, label, Lucide-icon inner-SVG (stroke=currentColor), colour-class,
    // Overpass tag-filters }. Icons are inline Lucide paths (ISC-licensed) → no request, no emoji.
    const CATS = {
        'poi-cat-sights':   { def: true,  lbl: 'Sehenswürdigkeit', ic: '<path d="M10 18v-7"/><path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/>', c: 'a', f: ['["tourism"~"^(attraction|museum|gallery|artwork|theme_park|zoo)$"]'] },
        'poi-cat-views':    { def: true,  lbl: 'Aussicht',         ic: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>', c: 'b', f: ['["tourism"="viewpoint"]', '["natural"="peak"]', '["man_made"="tower"]["tower:type"="observation"]'] },
        'poi-cat-historic': { def: true,  lbl: 'Historisch',       ic: '<path d="M10 5V3"/><path d="M14 5V3"/><path d="M15 21v-3a3 3 0 0 0-6 0v3"/><path d="M18 3v8"/><path d="M18 5H6"/><path d="M22 11H2"/><path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9"/><path d="M6 3v8"/>', c: 'c', f: ['["historic"]'] },
        'poi-cat-nature':   { def: true,  lbl: 'Natur',            ic: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>', c: 'd', f: ['["natural"~"^(waterfall|spring|cave_entrance)$"]', '["leisure"~"^(nature_reserve|park|garden)$"]'] },
        'poi-cat-service':  { def: false, lbl: 'Rast/Service',     ic: '<path d="M3.5 21 14 3"/><path d="M20.5 21 10 3"/><path d="M15.5 21 12 15l-3.5 6"/><path d="M2 21h20"/>', c: 'e', f: ['["amenity"~"^(drinking_water|toilets|shelter|bench|charging_station)$"]', '["tourism"~"^(picnic_site|camp_site)$"]'] },
        'poi-cat-food':     { def: false, lbl: 'Essen/Trinken',    ic: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>', c: 'f', f: ['["amenity"~"^(restaurant|cafe|pub|biergarten|fast_food)$"]'] },
        'poi-cat-lodging':  { def: false, lbl: 'Übernachten',      ic: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>', c: 'g', f: ['["tourism"~"^(hotel|guest_house|hostel|camp_site)$"]'] },
        // "Tanken" = station LOCATIONS straight from OSM (keyless) — works without Tankerkönig. Live
        // PRICES remain the optional FEAT-26 enrichment (the separate fuel-price layer, once the key is set).
        'poi-cat-fuel':     { def: false, lbl: 'Tankstelle',       ic: '<path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5"/><path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16"/><path d="M2 21h13"/><path d="M3 9h11"/>', c: 'h', f: ['["amenity"="fuel"]'] },
        // Fixed speed cameras straight from OSM (keyless). Display only — no in-drive warning tone
        // (Germany §23 StVO forbids operating a device that *warns* of traffic enforcement while driving).
        'poi-cat-speedcam': { def: false, lbl: 'Blitzer',          ic: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>', c: 'i', f: ['["highway"="speed_camera"]'] },
    };
    const ENDPOINT = 'https://overpass-api.de/api/interpreter';
    const MIN_ZOOM = 11;           // wider than this → area too big → skip (protects Overpass)
    const MIN_INTERVAL_MS = 8000;  // throttle: same view re-queried at most this often
    const MAX_POIS = 80;           // cap pins so the map doesn't turn into a carpet
    const DEBOUNCE_MS = 400;       // settle after panning before querying (snappier first appearance)

    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('poi: ' + m); };

    let layer = null, busy = false, lastFetch = 0, lastBox = '', tmr = null;
    function ensureLayer() { if (!layer) layer = L.layerGroup().addTo(map); return layer; }

    function on(id) { const v = localStorage.getItem(id); return v == null ? CATS[id].def : v === '1'; }
    function enabledCats() { return Object.keys(CATS).filter(on); }

    // Which category a result belongs to (icon/colour) — first matching tag wins, roughly in CATS order.
    function catOf(t) {
        if (t.highway === 'speed_camera') return 'poi-cat-speedcam';
        if (t.amenity === 'fuel') return 'poi-cat-fuel';
        if (t.historic) return 'poi-cat-historic';
        if (t.tourism === 'viewpoint' || t.natural === 'peak' || t.man_made === 'tower') return 'poi-cat-views';
        if (t.natural || (t.leisure && /nature_reserve|park|garden/.test(t.leisure))) return 'poi-cat-nature';
        if (t.tourism && /attraction|museum|gallery|artwork|theme_park|zoo/.test(t.tourism)) return 'poi-cat-sights';
        if (t.amenity && /restaurant|cafe|pub|biergarten|fast_food/.test(t.amenity)) return 'poi-cat-food';
        if (t.tourism && /hotel|guest_house|hostel/.test(t.tourism)) return 'poi-cat-lodging';
        return 'poi-cat-service';
    }
    function typeLabel(t) { return (CATS[catOf(t)] || {}).lbl || 'POI'; }

    function esc(s) { return String(s == null ? '' : s).replace(/[<>&"]/g, ch => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[ch])); }

    function pin(c) {
        return L.divIcon({
            className: 'poi-pin-wrap',
            html: '<div class="poi-pin poi-' + c.c + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + c.ic + '</svg></div>',
            iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
        });
    }

    function distKm(lat, lng) {
        const c = ctx.curPos && ctx.curPos();
        if (!c) return null;
        const R = 6371, toR = Math.PI / 180;
        const dLat = (lat - c[0]) * toR, dLng = (lng - c[1]) * toR;
        const s = Math.sin(dLat / 2) ** 2 + Math.cos(c[0] * toR) * Math.cos(lat * toR) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(s));
    }

    function popupHtml(p) {
        const d = distKm(p.lat, p.lng);
        return '<div class="poi-popup"><div class="pp-name">' + esc(p.name) + '</div>'
            + '<div class="pp-type">' + esc(p.type) + (d != null ? ' · ' + d.toFixed(1) + ' km' : '') + '</div>'
            + '<button id="poi-nav-btn" type="button">Bring mich hin</button></div>';
    }

    function render(items) {
        const lyr = ensureLayer();
        lyr.clearLayers();
        for (const p of items) {
            const c = CATS[catOf(p.tags)];
            const m = L.marker([p.lat, p.lng], { icon: pin(c), keyboard: false }).bindPopup(popupHtml(p), { className: 'poi-pop' });
            m.on('popupopen', () => {
                const b = document.getElementById('poi-nav-btn');
                if (b) b.onclick = () => { map.closePopup(); if (navigateTo) navigateTo([p.lat, p.lng], p.name); };
            });
            m.addTo(lyr);
        }
    }

    function bboxStr() {
        const b = map.getBounds();
        return b.getSouth().toFixed(5) + ',' + b.getWest().toFixed(5) + ',' + b.getNorth().toFixed(5) + ',' + b.getEast().toFixed(5);
    }

    function buildQuery(cats, box) {
        let body = '';
        for (const id of cats) for (const f of CATS[id].f) body += 'node' + f + '(' + box + ');way' + f + '(' + box + ');';
        return '[out:json][timeout:25];(' + body + ');out center ' + MAX_POIS + ';';
    }

    async function fetchPois() {
        const cats = enabledCats();
        if (!cats.length) { if (layer) layer.clearLayers(); return; }
        // Below MIN_ZOOM the area is too big to query — but DON'T wipe the pins (FEAT-21's idle re-fit
        // zooms out to the whole track; clearing here made the POIs "disappear"). Keep them, skip fetching.
        if (map.getZoom() < MIN_ZOOM) { dbg('zoom<' + MIN_ZOOM + ' → keep pins, skip fetch'); return; }
        const box = bboxStr();
        if (busy || (box === lastBox && (Date.now() - lastFetch) < MIN_INTERVAL_MS)) return;
        busy = true; lastBox = box; lastFetch = Date.now();
        try {
            const r = await fetch(ENDPOINT, { method: 'POST', body: 'data=' + encodeURIComponent(buildQuery(cats, box)) });
            const d = await r.json().catch(() => ({}));
            const items = (d.elements || []).map((e) => {
                const lat = e.lat != null ? e.lat : (e.center && e.center.lat);
                const lng = e.lon != null ? e.lon : (e.center && e.center.lon);
                if (lat == null || lng == null) return null;
                const t = e.tags || {};
                return { lat, lng, tags: t, name: t.name || typeLabel(t), type: typeLabel(t) };
            }).filter(Boolean);
            dbg('got ' + items.length + ' POIs (' + cats.length + ' cats)');
            render(items);
        } catch (e) { dbg('ERR ' + (e && (e.message || e))); }  // offline / Overpass busy → stay quiet
        finally { busy = false; }
    }

    function schedule() { if (tmr) clearTimeout(tmr); tmr = setTimeout(fetchPois, DEBOUNCE_MS); }

    // Re-query as the map settles on a new area, and on demand (categories changed / panel opened).
    map.on('moveend', schedule);
    function refresh() { lastBox = ''; schedule(); }

    return { refresh, fetch: fetchPois, clear: () => { if (layer) layer.clearLayers(); } };
};
