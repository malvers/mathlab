// Shared scaffold JS for the read-only viewer pages (view.html + tour.html): the Supabase client,
// the OSM map + round zoom buttons, and the loading/error overlay helpers. One source of truth so a
// change (tile source, key, overlay behaviour) is made once (Doc 2026-07-06). Load AFTER Leaflet,
// supa-gate.js and the Supabase lib.
(function (global) {
    'use strict';
    // Publishable (anon) key — meant to be public; RLS + owner-scoped RPCs guard the data.
    const SUPABASE_URL = 'https://fyfhxzyymmurlaenmzse.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_ubQDiMD-X3N0vZvPVi229Q_-5Zootfk';
    const SUPA_HOST = 'fyfhxzyymmurlaenmzse.supabase.co';   // shown in connection-error messages
    const $ = id => document.getElementById(id);

    const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    function showMsg(html) { const m = $('msg'); if (m) { m.innerHTML = html; m.classList.remove('hidden'); } }
    function hideMsg() { const m = $('msg'); if (m) m.classList.add('hidden'); }

    // Supabase client routed through the central breaker (supa-gate) when present. null if the lib
    // failed to load — callers show a "Bibliothek nicht geladen" message.
    function supa() {
        if (!global.supabase) return null;
        return global.supabase.createClient(SUPABASE_URL, SUPABASE_KEY,
            global.SupaGate ? { global: { fetch: global.SupaGate.gatedFetch } } : undefined);
    }

    // Leaflet map + OSM tiles + the custom round zoom buttons (#zoom-in / #zoom-out). Returns the map.
    function createMap(center, zoom) {
        const map = L.map('map', { zoomControl: false, attributionControl: true }).setView(center || [51.05, 13.74], zoom || 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxNativeZoom: 19, maxZoom: 21, attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);
        map.attributionControl.setPrefix(false);
        const zi = $('zoom-in'), zo = $('zoom-out');
        if (zi) zi.addEventListener('click', () => map.zoomIn());
        if (zo) zo.addEventListener('click', () => map.zoomOut());
        return map;
    }

    // Recenter control for #fit-btn: frame the bounds the page supplies via getBounds() (L.latLngBounds
    // or null). Mirrors the app's recenter FAB — the crosshair (×) shows while the whole route is framed;
    // once the user pans/zooms away it flips to the "custom view" icon (tap → re-frame). Returns { fit }
    // so the page routes its initial auto-fit through here too, keeping the mode in sync.
    function fitControl(map, getBounds) {
        const b = $('fit-btn');
        let programmatic = false;
        function fit() {
            const bb = getBounds && getBounds();
            if (bb && bb.isValid && bb.isValid()) { programmatic = true; map.fitBounds(bb, { padding: [50, 50] }); if (b) b.dataset.mode = 'fit'; }
        }
        if (b) b.addEventListener('click', fit);
        map.on('moveend', () => {
            if (programmatic) { programmatic = false; return; }   // our own fit → stay framed
            if (b) b.dataset.mode = 'custom';                     // user moved → custom view
        });
        return { fit };
    }

    global.ViewerBase = { SUPABASE_URL, SUPABASE_KEY, SUPA_HOST, esc, showMsg, hideMsg, supa, createMap, fitControl };
})(window);
