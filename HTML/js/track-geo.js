// Geometry on the Earth's surface for the tracker family: the distance and the bearing between two
// points. Refactor audit 27.09.2026: haversine lived in eight tracker modules and bearingDeg in six, in
// five spellings of the same maths. One copy now, loaded first (tracker.html's module list, view.html,
// tour.html); the modules take what they need: const { haversine, bearingDeg } = window.TrackGeo;
//
// Points are [lat, lng] arrays (GPS fixes, track points) - bearingDeg also reads {lat, lon} objects
// (OSM way nodes from Overpass), as the speed-limit modules always did.
(function (global) {
    'use strict';
    const R = 6371000;               // Earth radius in metres
    const T = Math.PI / 180;         // degrees -> radians
    const lat = p => (p.lat != null ? p.lat : p[0]) * T;
    const lon = p => (p.lon != null ? p.lon : p[1]) * T;

    // Great-circle distance a -> b in metres.
    function haversine(a, b) {
        const la1 = lat(a), la2 = lat(b);
        const dLat = la2 - la1, dLon = lon(b) - lon(a);
        const x = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));   // min(1, ...): rounding never leaves asin's domain
    }

    // Initial compass bearing a -> b in degrees [0, 360), 0 = north.
    function bearingDeg(a, b) {
        const la1 = lat(a), la2 = lat(b), dLon = lon(b) - lon(a);
        const y = Math.sin(dLon) * Math.cos(la2);
        const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
        return (Math.atan2(y, x) / T + 360) % 360;
    }

    global.TrackGeo = { haversine, bearingDeg };
})(window);
