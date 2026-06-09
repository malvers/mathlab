// Non-destructive DEM elevation lookup (GPS-Nachbearbeitung, Stufe 1.3). For each [lat,lng] in the
// track, fetch the terrain elevation from Open-Meteo's free Elevation API (Copernicus GLO-90, ~90 m,
// CORS '*', no key, measured). Replaces the noisy GPS+baro altitude with a smooth, repeatable terrain
// height → a clean ascent figure and profile. Dedupes points to a ~90 m grid (the DEM's own cell size)
// so a dense walk → few unique cells → few API calls; caches results for the whole session. Returns a
// NEW array (one elevation in m, or null where the model has no data) of the SAME length and order as
// the track → the parallel times/speeds/activities/alts arrays stay aligned. Touches nothing stored.
//
// IIFE global like track-smooth.js. API:
//   TrackDem.elevations(track, onProgress?) -> Promise<Array<number|null>>
//     onProgress(done, total) — optional, called after each batch resolves (unique-cell counts).
(function (global) {
    'use strict';

    const ENDPOINT = 'https://api.open-meteo.com/v1/elevation';
    const MAX_PER_CALL = 100;   // Open-Meteo hard limit (measured: 101+ → error)
    const GRID = 1000;          // quantise to 1/1000° ≈ 70–110 m ≈ the GLO-90 cell → heavy dedup, no real loss
    const cache = new Map();    // "qlat,qlng" -> elevation (m) | null — persists for the session

    const q = (v) => Math.round(v * GRID) / GRID;            // snap a coord to the grid
    const key = (lat, lng) => Math.round(lat * GRID) + ',' + Math.round(lng * GRID);

    // One API call for up to MAX_PER_CALL grid cells; fills the cache. Throws on HTTP / shape error.
    async function fetchBatch(cells) {
        const lat = cells.map((c) => c.lat).join(',');
        const lng = cells.map((c) => c.lng).join(',');
        const res = await fetch(ENDPOINT + '?latitude=' + lat + '&longitude=' + lng);
        if (!res.ok) throw new Error('DEM HTTP ' + res.status);
        const data = await res.json();
        const el = data && data.elevation;
        if (!Array.isArray(el) || el.length !== cells.length) throw new Error('DEM: unerwartete Antwort');
        cells.forEach((c, i) => cache.set(c.key, (el[i] == null ? null : el[i])));
    }

    async function elevations(track, onProgress) {
        if (!Array.isArray(track) || !track.length) return [];

        // Collect the unique grid cells we do not have cached yet.
        const need = new Map(); // key -> { lat, lng, key }
        for (const p of track) {
            const k = key(p[0], p[1]);
            if (!cache.has(k) && !need.has(k)) need.set(k, { lat: q(p[0]), lng: q(p[1]), key: k });
        }
        const cells = Array.from(need.values());
        const total = cells.length;

        for (let i = 0; i < cells.length; i += MAX_PER_CALL) {
            await fetchBatch(cells.slice(i, i + MAX_PER_CALL));
            if (onProgress) onProgress(Math.min(cells.length, i + MAX_PER_CALL), total);
        }

        // Map every point back through the cache → same length/order as the track.
        return track.map((p) => {
            const v = cache.get(key(p[0], p[1]));
            return (v == null ? null : v);
        });
    }

    global.TrackDem = { elevations };
})(window);
