// js/tracker-poi.js — Points of Interest overlay (FEAT-24). Named POIs from OpenStreetMap via Overpass
// for the VISIBLE map area (keyless — Regel 18), drawn as category-coloured pins; a tap offers
// "Navi hierhin" (tracker-nav.js). The active categories are the checkboxes in the POI panel
// (poi-cat-* in localStorage), so the layer follows what Doc ticked. Skeleton ported from tracker-fuel.js.
//
// ctx (from tracker.js): { map, toast, navigateTo(latlng,name), curPos()->[lat,lng]|null,
//                          showPanel(id), hidePanels() }
window.TrackerPoi = function (ctx) {
    const { map, toast, navigateTo, showPanel, hidePanels } = ctx;
    const el = (id) => document.getElementById(id);

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
        // OSM fixed speed cameras (highway=speed_camera, keyless). Display only — no in-drive warning
        // tone (Germany §23 StVO forbids operating a device that *warns* of enforcement while driving).
        // User-facing label is deliberately disguised as "Helmut Newton" (the photographer); the icon is a
        // hand-drawn dress (Kleid) — Lucide ships no dress glyph, so this is a custom A-line silhouette path.
        'poi-cat-speedcam': { def: false, lbl: 'Helmut Newton',  ic: '<path d="M6.4 4.2 9.2 3 12 4.7 14.8 3 17.6 4.2 14.8 10.9 18.2 21.5 5.8 21.5 9.2 10.9Z"/><path d="M9.2 10.9H14.8"/>', c: 'i', f: ['["highway"="speed_camera"]'] },
        // Feen — kuratierte Sagen-/Märchenorte aus einer LOKALEN JSON (feenorte-poi.json), NICHT Overpass.
        // `local:true` → eigene Leaflet-Ebene, einmal geladen, vom Overpass-Fetch (clearLayers) unberührt.
        // Sparkles-Icon (Lucide). Kein `f` (keine Overpass-Filter) → wird im Fetch-Pfad übersprungen.
        // Minimalist fairy mark: a winged magic wand topped with a star (wings + wand in one clean symbol).
        'poi-cat-feen':     { def: false, local: true, lbl: 'Feen', c: 'j', ic: '<path d="M12 21V9.5"/><path d="M12 3.2 12.91 4.69 14.4 5.6 12.91 6.51 12 8 11.09 6.51 9.6 5.6 11.09 4.69Z"/><path d="M12 10.5C9 8.5 8 11.5 11 12.5"/><path d="M12 10.5C15 8.5 16 11.5 13 12.5"/>' },
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
        const cats = enabledCats().filter((id) => !CATS[id].local); // local cats (Feen) load from JSON, not Overpass
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

    // ---- Feen: a curated LOCAL POI set (feenorte-poi.json), on its OWN layer so the Overpass
    //      render()'s clearLayers() can't wipe it. Loaded once, then just toggled on/off. ----
    const FEEN_URL = 'feenorte-poi.json' + (window.__ASSET_V || ''); // same dir as tracker.html; cache-bust if set
    const USER_FEEN_KEY = 'trk-feen-user'; // Doc's own added fairy places (this device only)
    let feenLayer = null, feenLoaded = false, feenLoading = false;

    // Doc's own Feen live in localStorage (the repo's JSON is read-only from the app). Each carries a
    // stable id so it can be removed again from its popup.
    function loadUserFeen() { try { return JSON.parse(localStorage.getItem(USER_FEEN_KEY) || '[]'); } catch (e) { return []; } }
    function saveUserFeen(arr) { try { localStorage.setItem(USER_FEEN_KEY, JSON.stringify(arr)); } catch (e) { } }

    function feenPopup(p, isUser) {
        const dkm = distKm(p.lat, p.lng);
        const sub = [p.region, p.kind].filter(Boolean).join(' · ');
        return '<div class="poi-popup"><div class="pp-name">' + esc(p.name) + '</div>'
            + '<div class="pp-type">' + esc(sub) + (dkm != null ? ' · ' + dkm.toFixed(1) + ' km' : '') + '</div>'
            + (p.desc ? '<div class="pp-desc">' + esc(p.desc) + '</div>' : '')
            + '<button id="poi-nav-btn" type="button">Bring mich hin</button>'
            + (isUser ? '<button id="poi-del-btn" type="button" class="poi-del">Entfernen</button>' : '')
            + '</div>';
    }

    // One marker for a fairy place. isUser → the popup also offers "Entfernen" (delete from storage).
    function addFeenMarker(p, isUser) {
        if (p.lat == null || p.lng == null || !feenLayer) return null;
        const m = L.marker([p.lat, p.lng], { icon: pin(CATS['poi-cat-feen']), keyboard: false })
            .bindPopup(feenPopup(p, isUser), { className: 'poi-pop' });
        m.on('popupopen', () => {
            const b = document.getElementById('poi-nav-btn');
            if (b) b.onclick = () => { map.closePopup(); if (navigateTo) navigateTo([p.lat, p.lng], p.name); };
            if (isUser) {
                const del = document.getElementById('poi-del-btn');
                if (del) del.onclick = () => removeUserFeen(p, m);
            }
        });
        m.addTo(feenLayer);
        return m;
    }

    function removeUserFeen(p, marker) {
        saveUserFeen(loadUserFeen().filter((x) => x.id !== p.id));
        map.closePopup();
        if (feenLayer && marker) feenLayer.removeLayer(marker);
        if (toast) toast('Feenort „' + p.name + '" entfernt.');
    }

    async function loadFeen() {
        if (feenLoaded || feenLoading) return;
        feenLoading = true;
        try {
            const r = await fetch(FEEN_URL);
            const d = await r.json().catch(() => ({}));
            const lst = (d && Array.isArray(d.pois)) ? d.pois : [];
            feenLayer = L.layerGroup();
            for (const p of lst) addFeenMarker(p, false);
            const usr = loadUserFeen();
            for (const p of usr) addFeenMarker(p, true);
            feenLoaded = true;
            dbg('feen: ' + lst.length + ' Orte + ' + usr.length + ' eigene geladen');
        } catch (e) { dbg('feen ERR ' + (e && (e.message || e))); }
        finally { feenLoading = false; }
    }
    async function updateFeen() {
        if (on('poi-cat-feen')) {
            await loadFeen();
            if (feenLayer && !map.hasLayer(feenLayer)) feenLayer.addTo(map);
        } else if (feenLayer && map.hasLayer(feenLayer)) {
            map.removeLayer(feenLayer);
        }
    }

    // Mirror each category's MAP-PIN icon in front of its panel label (single source: CATS[id].ic + its
    // colour class) — a mini of the actual pin, so the POI panel reads as one legend. Replaces the old
    // inline 🧚 emoji on Feen. aria-hidden: the label text already names the category.
    function paintPanelIcons() {
        Object.keys(CATS).forEach((id) => {
            const cb = document.getElementById(id);
            const row = cb && cb.closest('.set-row');
            const span = row && row.querySelector('span');
            if (!span || span.querySelector('.poi-cat-ic')) return;
            span.insertAdjacentHTML('afterbegin',
                '<span class="poi-cat-ic poi-pin poi-' + CATS[id].c + '" aria-hidden="true">'
                + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
                + 'stroke-linecap="round" stroke-linejoin="round">' + CATS[id].ic + '</svg></span>');
        });
    }

    // ---- "Feenort hinzufügen": geocode an address via Nominatim (keyless — Regel 18) or drop the
    //      current position, persist it to localStorage, and show it right away. ----
    function addMsg(t) { const m = el('feen-add-msg'); if (m) m.textContent = t || ''; }

    function openAddFeen() {
        if (el('feen-name')) el('feen-name').value = '';
        if (el('feen-addr')) el('feen-addr').value = '';
        if (el('feen-desc')) el('feen-desc').value = '';
        addMsg('');
        if (showPanel) showPanel('feen-add-panel');
    }

    // Save a finished place, make sure the Feen layer is on, show + fly to it. Saved BEFORE the
    // marker is drawn; if the layer wasn't loaded yet, loadFeen() picks it up from storage (no dupe).
    async function finishAddFeen(p) {
        p.id = 'u' + Date.now();
        saveUserFeen(loadUserFeen().concat([p]));
        localStorage.setItem('poi-cat-feen', '1');           // turn the category on so it's visible
        const cb = el('poi-cat-feen'); if (cb) cb.checked = true;
        if (!feenLoaded) { await loadFeen(); } else { addFeenMarker(p, true); }
        await updateFeen();
        if (hidePanels) hidePanels();
        try { map.setView([p.lat, p.lng], Math.max(map.getZoom(), 13), { animate: true }); } catch (e) { }
        if (toast) toast('Feenort „' + p.name + '" hinzugefügt.');
    }

    async function saveFromAddress() {
        const name = (el('feen-name') && el('feen-name').value || '').trim();
        const addr = (el('feen-addr') && el('feen-addr').value || '').trim();
        const desc = (el('feen-desc') && el('feen-desc').value || '').trim();
        if (!name) { addMsg('Bitte einen Namen eingeben.'); return; }
        if (!addr) { addMsg('Bitte eine Adresse/Ort eingeben — oder „Aktuelle Position" nehmen.'); return; }
        addMsg('Suche Adresse …');
        try {
            const u = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(addr);
            const r = await fetch(u, { headers: { 'Accept': 'application/json' } });
            const arr = await r.json().catch(() => []);
            if (!Array.isArray(arr) || !arr.length) { addMsg('Adresse nicht gefunden — bitte genauer angeben.'); return; }
            const lat = parseFloat(arr[0].lat), lng = parseFloat(arr[0].lon);
            if (isNaN(lat) || isNaN(lng)) { addMsg('Adresse nicht gefunden — bitte genauer angeben.'); return; }
            const region = (arr[0].display_name || '').split(',').slice(-2).join(',').trim();
            await finishAddFeen({ name, lat, lng, region, kind: 'Eigener Ort', desc });
        } catch (e) { addMsg('Suche fehlgeschlagen (offline?).'); }
    }

    function saveFromHere() {
        const c = ctx.curPos && ctx.curPos();
        if (!c) { addMsg('Keine aktuelle Position verfügbar.'); return; }
        const name = (el('feen-name') && el('feen-name').value || '').trim() || 'Feenort';
        const desc = (el('feen-desc') && el('feen-desc').value || '').trim();
        finishAddFeen({ name, lat: c[0], lng: c[1], region: '', kind: 'Eigener Ort', desc });
    }

    (function wireAddFeen() {
        const add = el('feen-add-btn'); if (add) add.onclick = openAddFeen;
        const save = el('feen-save'); if (save) save.onclick = saveFromAddress;
        const here = el('feen-here'); if (here) here.onclick = saveFromHere;
        const close = el('feen-add-close'); if (close) close.onclick = () => { if (hidePanels) hidePanels(); };
        const addr = el('feen-addr'); if (addr) addr.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveFromAddress(); } });
    })();

    // Re-query as the map settles on a new area, and on demand (categories changed / panel opened).
    map.on('moveend', schedule);
    function refresh() { lastBox = ''; updateFeen(); schedule(); }

    paintPanelIcons();
    updateFeen(); // show the Feen layer on load if its checkbox was left ticked

    return { refresh, fetch: fetchPois, clear: () => { if (layer) layer.clearLayers(); } };
};
