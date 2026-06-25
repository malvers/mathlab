// Desk navigation simulator for the tracker. Loaded always, but only activates with ?sim=1.
//
// Purpose: reproduce and MEASURE the off-route reroute behaviour at the desk — no driving, no real GPS.
// The car AUTO-DRIVES along the computed OSRM route at the set speed, feeding synthetic GPS fixes through
// the REAL onPosition pipeline (ctx.feed) so navigation/reroute/guidance behave 1:1 with the field. To
// force an off-route situation, CLICK a point on the map WHILE DRIVING: the car beelines toward it (off the
// route) → reroute → we watch whether the new route goes FORWARD or says "wenden", then it resumes the new
// route. While it runs, simMode in tracker.js suppresses recording/cloud-sync (ctx.setSim) and the real
// navigator.geolocation is neutralised, so nothing real is touched and no desktop fix can fight the car.
//
// Usage (open with ?sim=1 → "NAVI-SIMULATION" panel, bottom-left):
//   1) "Home" drops the car at the saved Home.
//   2) Pick a destination via the normal "Ziel" popup.
//   3) "GO" → the car drives the route automatically (GO toggles to STOP).
//   4) Click the map mid-drive → the car deviates toward the click → reroute. Watch DEBUG (sim: …).
window.TrackerNavSim = function (ctx) {
    const { map, feed, setSim, nav } = ctx;
    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('sim: ' + m); };

    let car = null;          // [lat,lng] current simulated position
    let brg = 0;             // current heading (deg, 0 = N)
    let maxKmh = 50;         // virtual MAX speed (the slider) — physics keeps it below this in curves
    let vcur = 0;            // current speed (m/s) — accelerates/brakes toward the target, never jumps
    let timer = null;        // drive interval (real time)
    let clock = 0;           // sim timestamp (ms) — advances DT_SIM_MS per emitted fix
    const DT_SIM_MS = 1000;  // each fix represents one simulated second (drives the speed maths)
    const DT_REAL_MS = 600;  // wall-clock between fixes (how fast you watch it play out)

    // ---- speed physics ----
    const A_LAT = 3.0;       // m/s² comfortable lateral (cornering) acceleration → curve speed = √(A_LAT·R)
    const A_ACC = 1.8;       // m/s² acceleration on straights
    const A_BRAKE = 3.0;     // m/s² braking into curves
    const V_MIN = 8 / 3.6;   // m/s floor so tight curves don't crawl to a standstill

    // route-follow state
    let route = null;        // [[lat,lng]…] the route we're currently following
    let routeRef = null;     // identity of the adopted route array → detect a reroute (new array)
    let routeCum = null;     // cumulative segment lengths (m), routeCum[i] = dist from start to point i
    let routeVc = null;      // per-point curvature speed limit (m/s) for the nav route
    let s = 0;               // current distance travelled along the route (m)
    let detour = null;       // {pts,cum,vc,s} an OSRM ROAD route to a clicked deviation point; null = follow nav route
    const OSRM_CAR = 'https://routing.openstreetmap.de/routed-car/route/v1/driving/'; // same engine as tracker-nav
    let lastLog = 0;

    // ---- geo helpers (degrees) ----
    const T = Math.PI / 180;
    function bearingDeg(a, b) {
        const y = Math.sin((b[1] - a[1]) * T) * Math.cos(b[0] * T);
        const x = Math.cos(a[0] * T) * Math.sin(b[0] * T) - Math.sin(a[0] * T) * Math.cos(b[0] * T) * Math.cos((b[1] - a[1]) * T);
        return (Math.atan2(y, x) / T + 360) % 360;
    }
    function haversine(a, b) {
        const R = 6371000;
        const dLat = (b[0] - a[0]) * T, dLng = (b[1] - a[1]) * T;
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * T) * Math.cos(b[0] * T) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }
    function moveAlong(from, brgDeg, distM) {
        const R = 6371000, d = distM / R, b = brgDeg * T, la1 = from[0] * T, lo1 = from[1] * T;
        const la2 = Math.asin(Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(b));
        const lo2 = lo1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(la1), Math.cos(d) - Math.sin(la1) * Math.sin(la2));
        return [la2 / T, ((lo2 / T + 540) % 360) - 180];
    }
    function cumLengths(r) { const c = [0]; for (let i = 1; i < r.length; i++) c[i] = c[i - 1] + haversine(r[i - 1], r[i]); return c; }
    // Circumradius (m) of three consecutive points → local turn radius (Infinity when ~collinear/straight).
    function circumRadius(a, b, c) {
        const k = Math.cos(b[0] * T), X = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const A = X(a), B = X(b), C = X(c);
        const ab = Math.hypot(B[0] - A[0], B[1] - A[1]), bc = Math.hypot(C[0] - B[0], C[1] - B[1]), ca = Math.hypot(A[0] - C[0], A[1] - C[1]);
        const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
        return area < 1e-6 ? Infinity : (ab * bc * ca) / (4 * area);
    }
    // Per-point curvature speed limit (m/s): √(A_LAT·R), floored at V_MIN; endpoints/straights → "fast".
    function buildVcurve(pts) {
        const n = pts.length, v = new Array(n);
        for (let i = 0; i < n; i++) {
            if (i === 0 || i === n - 1) { v[i] = 999; continue; }
            let lim = Math.sqrt(A_LAT * circumRadius(pts[i - 1], pts[i], pts[i + 1]));
            if (!isFinite(lim) || lim > 999) lim = 999;
            v[i] = Math.max(V_MIN, lim);
        }
        return v;
    }
    // Tightest curve limit (m/s) within `look` metres ahead of `dist` → lets the car brake in time.
    function vcurveAhead(cum, vc, dist, look) {
        let lim = Infinity;
        for (let i = 0; i < cum.length; i++) {
            if (cum[i] < dist) continue;
            if (cum[i] > dist + look) break;
            if (vc[i] < lim) lim = vc[i];
        }
        return lim;
    }
    // Update vcur toward the target (curve limit ahead, capped by maxKmh) with real accel/brake limits.
    // Returns the metres travelled this simulated second.
    function speedStep(cum, vc, dist) {
        const dt = DT_SIM_MS / 1000;
        const look = Math.max(15, (vcur * vcur) / (2 * A_BRAKE) + vcur * 0.8); // braking distance + reaction
        const ahead = vcurveAhead(cum, vc, dist, look);
        const target = Math.min(maxKmh / 3.6, isFinite(ahead) ? ahead : 999);
        if (vcur < target) vcur = Math.min(target, vcur + A_ACC * dt);
        else vcur = Math.max(target, vcur - A_BRAKE * dt);
        return vcur * dt;
    }
    // point + heading at distance `dist` along route r (with cumulative lengths cum)
    function pointAt(r, cum, dist) {
        const total = cum[cum.length - 1];
        if (dist <= 0) return { pos: r[0].slice(), brg: bearingDeg(r[0], r[1] || r[0]) };
        if (dist >= total) { const a = r[r.length - 2] || r[0], b = r[r.length - 1]; return { pos: b.slice(), brg: bearingDeg(a, b) }; }
        let i = 1; while (i < cum.length && cum[i] < dist) i++;
        const a = r[i - 1], b = r[i], seg = cum[i] - cum[i - 1], t = seg ? (dist - cum[i - 1]) / seg : 0;
        return { pos: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], brg: bearingDeg(a, b) };
    }
    // nearest point on route → its cumulative distance (so we can re-sync after a reroute/deviation)
    function projectDist(r, cum, p) {
        let best = Infinity, bestS = 0;
        const k = Math.cos(p[0] * T);
        const xy = (ll) => [ll[1] * 111320 * k, ll[0] * 110540];
        const P = xy(p);
        for (let i = 1; i < r.length; i++) {
            const A = xy(r[i - 1]), B = xy(r[i]);
            const dx = B[0] - A[0], dy = B[1] - A[1], len2 = dx * dx + dy * dy;
            let t = len2 ? ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / len2 : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
            const d = Math.hypot(P[0] - (A[0] + t * dx), P[1] - (A[1] + t * dy));
            if (d < best) { best = d; bestS = cum[i - 1] + t * Math.sqrt(len2); }
        }
        return bestS;
    }

    // Adopt the current nav route; on a NEW array (reroute) re-project the car onto it. Returns false if none.
    function syncRoute() {
        const rp = nav && nav.routePoints && nav.routePoints();
        if (!rp || rp.length < 2) return false;
        if (rp !== routeRef) {
            routeRef = rp; route = rp; routeCum = cumLengths(route); routeVc = buildVcurve(route);
            s = car ? projectDist(route, routeCum, car) : 0;
            try { if (nav.frameRoute) nav.frameRoute(); } catch (e) { } // keep the whole (re)route in view
            dbg('Route übernommen (' + route.length + ' Pkt, ' + Math.round(routeCum[routeCum.length - 1]) + ' m)');
        }
        return true;
    }

    function emit() {
        clock += DT_SIM_MS;
        feed({ coords: { latitude: car[0], longitude: car[1], accuracy: 5, speed: vcur, heading: brg, altitude: null }, timestamp: clock });
    }

    function tick() {
        if (!car) return;
        if (detour) {                                     // drive the ROAD route to the clicked point (no fields)
            const dtotal = detour.cum[detour.cum.length - 1];
            detour.s += speedStep(detour.cum, detour.vc, detour.s);
            if (detour.s >= dtotal) {                      // arrived → resume following the (by now rerouted) line
                const e = pointAt(detour.pts, detour.cum, dtotal); car = e.pos; brg = e.brg; emit();
                detour = null; clearDevMarker(); routeRef = null; dbg('Abweichpunkt erreicht → folge der (neuen) Route'); status('zurück auf Route');
                return;
            }
            const at = pointAt(detour.pts, detour.cum, detour.s); car = at.pos; brg = at.brg; emit();
            if (clock - lastLog >= 3000) { lastLog = clock; dbg('weiche ab (Straße) → ' + Math.round(detour.s) + '/' + Math.round(dtotal) + ' m @ ' + Math.round(vcur * 3.6) + ' km/h'); }
            return;
        }
        if (!syncRoute()) { stopLoop(); status('keine Route — Ziel wählen + STARTEN'); dbg('keine Route zum Folgen'); return; }
        const total = routeCum[routeCum.length - 1];
        s += speedStep(routeCum, routeVc, s);
        if (s >= total) { const e = pointAt(route, routeCum, total); car = e.pos; brg = e.brg; emit(); stopLoop(); status('Ziel erreicht'); dbg('Ziel erreicht'); return; }
        const at = pointAt(route, routeCum, s);
        car = at.pos; brg = at.brg;
        emit();
        if (clock - lastLog >= 3000) { lastLog = clock; dbg('fahre … ' + Math.round(s) + '/' + Math.round(total) + ' m @ ' + Math.round(vcur * 3.6) + ' km/h'); }
    }
    function startLoop() { if (!timer) timer = setInterval(tick, DT_REAL_MS); setGoLabel(); }
    function stopLoop() { if (timer) { clearInterval(timer); timer = null; } setGoLabel(); }

    // ---- "Home" → place the car at the saved Home ----
    function loadHome() {
        try { const h = JSON.parse(localStorage.getItem('trk_nav_home') || 'null'); return (h && h.lat != null && h.lng != null) ? [h.lat, h.lng] : null; }
        catch (e) { return null; }
    }
    function placeCarAtHome() {
        stopLoop(); detour = null; clearDevMarker(); routeRef = null; route = null; s = 0; clock = 0; vcur = 0; paused = false;
        const h = loadHome();
        if (h) car = h; else { const c = map.getCenter(); car = [c.lat, c.lng]; dbg('kein Home gesetzt → Auto auf Kartenmitte'); }
        brg = 0;
        map.setView(car, Math.max(map.getZoom(), 15));
        emit();
        dbg('Auto @ ' + car[0].toFixed(5) + ',' + car[1].toFixed(5) + (h ? ' (Home)' : ''));
        status(h ? 'Auto auf Home — jetzt Ziel wählen' : 'Auto auf Kartenmitte (kein Home)');
    }

    // ---- "Fahren" → ensure a route exists, then auto-follow it ----
    async function startDriving() {
        if (!car) { status('erst „Go Home"'); dbg('kein Auto — „Go Home" zuerst'); return; }
        if (!(nav && nav.routePoints && nav.routePoints())) {
            if (nav && nav.hasDestination && nav.hasDestination() && nav.startNavigation) { status('Route wird berechnet …'); await nav.startNavigation(); }
        }
        routeRef = null;                       // force a fresh adopt + project
        if (!syncRoute()) { status('kein Ziel — erst im Ziel-Popup wählen'); dbg('kein Ziel/Route → nichts zu fahren'); return; }
        detour = null; s = 0; vcur = 0; paused = false;   // start at the route's beginning (≈ the car), from standstill
        startLoop();
        status('fährt die Route …');
    }

    // ---- tiny UI panel (Orbitron, dark-blue, green actions per house rules) ----
    let elStatus = null, btnGo = null;
    function status(m) { if (elStatus) elStatus.textContent = m; }
    // The drive button is a toggle: GO starts auto-following, STOP halts. Label tracks the loop state.
    function setGoLabel() { if (btnGo) btnGo.textContent = timer ? 'STOP' : 'GO'; }
    // GO/STOP: STOP pauses (keeps detour + marker + position); GO resumes there, or starts fresh if not paused.
    let paused = false;
    function onGo() {
        if (timer) { stopLoop(); paused = true; status(''); }            // pause — keep everything
        else if (paused) { paused = false; startLoop(); status('fährt …'); } // resume where we left off
        else { startDriving(); }                                          // fresh start
    }
    // Fetch an OSRM ROAD route (car profile) between two [lat,lng] points → [[lat,lng]…] or null. Used so a
    // deviation drives on real streets, never across fields.
    async function osrmRoute(from, to) {
        try {
            const c = from[1] + ',' + from[0] + ';' + to[1] + ',' + to[0];
            const r = await fetch(OSRM_CAR + c + '?overview=full&geometries=geojson');
            const d = await r.json();
            if (!d || d.code !== 'Ok' || !d.routes || !d.routes.length) return null;
            return (d.routes[0].geometry.coordinates || []).map((x) => [x[1], x[0]]); // GeoJSON [lon,lat] → [lat,lng]
        } catch (e) { return null; }
    }
    // Deviation-target marker (λ-orange ring) — shows where you clicked; cleared when the car reaches it.
    let devMarker = null;
    function setDevMarker(ll) {
        clearDevMarker();
        devMarker = L.circleMarker(ll, { radius: 9, color: '#fff', weight: 2, fillColor: 'rgb(245,194,66)', fillOpacity: 0.95 }).addTo(map);
    }
    function clearDevMarker() { if (devMarker) { map.removeLayer(devMarker); devMarker = null; } }
    // While driving, a map click routes the car ON ROADS to that point (off the nav route) → triggers a
    // reroute. When not driving, clicks are ignored so the map stays normally usable (pan/zoom/explore).
    async function onMapClick(e) {
        if (!timer || !car) return;            // only deviate while actually driving
        const to = [e.latlng.lat, e.latlng.lng];
        setDevMarker(to);                      // instant feedback at the clicked point; removed on arrival
        status('Abweich-Route …'); dbg('Abweich-Klick → route via Straßen zu ' + to[0].toFixed(5) + ',' + to[1].toFixed(5));
        const pts = await osrmRoute(car, to);
        if (!pts || pts.length < 2) { clearDevMarker(); status('keine Straße dahin'); dbg('OSRM: keine Abweich-Route'); return; }
        const cum = cumLengths(pts);
        detour = { pts, cum, vc: buildVcurve(pts), s: projectDist(pts, cum, car) };  // start at the car on the detour
    }
    function mkBtn(label, fn) {
        const b = document.createElement('button');
        b.textContent = label;
        b.style.cssText = 'font-family:Orbitron,sans-serif;font-size:11px;padding:6px 10px;margin:3px;'
            + 'background:rgb(121,158,49);color:#fff;border:none;border-radius:6px;cursor:pointer;';
        b.addEventListener('click', fn);
        return b;
    }
    function buildPanel() {
        const p = document.createElement('div');
        p.id = 'navsim-panel';
        p.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9000;width:270px;'
            + 'background:rgba(8,20,42,0.92);color:#cfe3ff;border:1px solid rgba(121,158,49,0.5);'
            + 'border-radius:10px;padding:10px;font-family:Orbitron,sans-serif;font-size:11px;'
            + 'box-shadow:0 4px 18px rgba(8,20,42,0.6);';

        const title = document.createElement('div');
        title.textContent = '🧪 NAVI-SIMULATION';
        title.style.cssText = 'font-weight:700;letter-spacing:1px;margin-bottom:8px;color:#f5c242;';
        p.appendChild(title);

        const sRow = document.createElement('div');
        sRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
        const sLbl = document.createElement('span');
        sLbl.textContent = maxKmh + ' km/h'; sLbl.style.minWidth = '58px';
        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = '5'; slider.max = '250'; slider.step = '5'; slider.value = String(maxKmh);
        slider.setAttribute('aria-label', 'Sim Maximalgeschwindigkeit'); slider.style.flex = '1';
        slider.addEventListener('input', () => { maxKmh = +slider.value; sLbl.textContent = maxKmh + ' km/h'; });
        sRow.appendChild(sLbl); sRow.appendChild(slider);
        p.appendChild(sRow);

        const bRow = document.createElement('div');
        bRow.appendChild(mkBtn('Go Home', placeCarAtHome));
        btnGo = mkBtn('GO', onGo);
        bRow.appendChild(btnGo);
        p.appendChild(bRow);
        setGoLabel();

        elStatus = document.createElement('div');
        elStatus.style.cssText = 'margin-top:8px;color:#9fc0ff;min-height:14px;line-height:1.4;';
        elStatus.textContent = '';   // no instructions; this line shows live status only
        p.appendChild(elStatus);

        document.body.appendChild(p);
    }

    // ---- init ----
    setSim(true);   // whole ?sim session is synthetic → never record/sync to the cloud
    if (navigator.geolocation) {   // neutralise real GPS so it can't fight the synthetic car
        navigator.geolocation.watchPosition = function () { return 0; };
        navigator.geolocation.getCurrentPosition = function () { };
        navigator.geolocation.clearWatch = function () { };
    }
    buildPanel();
    map.on('click', onMapClick);   // click while driving → deviate toward that point (off-route → reroute)
    dbg('Simulator aktiv (?sim=1). Recording/Cloud AUS, echtes GPS AUS.');

    return { isActive: () => true, setSpeed: (kmh) => { maxKmh = kmh; } };
};
