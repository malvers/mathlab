// Desk navigation simulator for the tracker. Loaded always, but only activates with ?sim=1.
//
// Purpose: reproduce and MEASURE the off-route reroute behaviour at the desk — no driving, no real GPS.
// The car AUTO-DRIVES along the computed OSRM route at the set speed, feeding synthetic GPS fixes through
// the REAL onPosition pipeline (ctx.feed) so navigation/reroute/guidance behave 1:1 with the field. The
// "Abweichen" button sends it straight off the route (keeps heading, ignores the turn) → off-route → we
// watch whether the reroute goes FORWARD or says "wenden". While it runs, simMode in tracker.js suppresses
// recording/cloud-sync (ctx.setSim) and the real navigator.geolocation is neutralised, so nothing real is
// touched and no genuine desktop fix can fight the synthetic car.
//
// Usage (open with ?sim=1 → "NAV-SIM" panel, bottom-left):
//   1) "Auto hier" drops the car at the saved Home.
//   2) Pick a destination via the normal "Ziel" popup.
//   3) "Fahren" → the car drives the route automatically.
//   4) "Abweichen" → it leaves the route on purpose → reroute. Watch the DEBUG window (sim: …).
window.TrackerNavSim = function (ctx) {
    const { map, feed, setSim, nav } = ctx;
    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('sim: ' + m); };

    let car = null;          // [lat,lng] current simulated position
    let brg = 0;             // current heading (deg, 0 = N)
    let maxKmh = 50;         // virtual max speed
    let timer = null;        // drive interval (real time)
    let clock = 0;           // sim timestamp (ms) — advances DT_SIM_MS per emitted fix
    const DT_SIM_MS = 1000;  // each fix represents one simulated second (drives the speed maths)
    const DT_REAL_MS = 600;  // wall-clock between fixes (how fast you watch it play out)
    const DEVIATE_M = 250;   // how far "Abweichen" drives straight off the route before resuming

    // route-follow state
    let route = null;        // [[lat,lng]…] the route we're currently following
    let routeRef = null;     // identity of the adopted route array → detect a reroute (new array)
    let routeCum = null;     // cumulative segment lengths (m), routeCum[i] = dist from start to point i
    let s = 0;               // current distance travelled along the route (m)
    let deviating = 0;       // metres left to drive straight OFF the route (0 = following)
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
            routeRef = rp; route = rp; routeCum = cumLengths(route);
            s = car ? projectDist(route, routeCum, car) : 0;
            try { if (nav.frameRoute) nav.frameRoute(); } catch (e) { } // keep the whole (re)route in view
            dbg('Route übernommen (' + route.length + ' Pkt, ' + Math.round(routeCum[routeCum.length - 1]) + ' m)');
        }
        return true;
    }

    function emit() {
        clock += DT_SIM_MS;
        feed({ coords: { latitude: car[0], longitude: car[1], accuracy: 5, speed: maxKmh / 3.6, heading: brg, altitude: null }, timestamp: clock });
    }

    function tick() {
        if (!car) return;
        const step = (maxKmh / 3.6) * (DT_SIM_MS / 1000); // metres this simulated second
        if (deviating > 0) {                              // drive straight off the route (keep heading)
            car = moveAlong(car, brg, step);
            deviating -= step;
            emit();
            if (deviating <= 0) { routeRef = null; dbg('Abweichung beendet → folge der (neuen) Route'); status('zurück auf Route'); }
            return;
        }
        if (!syncRoute()) { stopLoop(); status('keine Route — Ziel wählen + STARTEN'); dbg('keine Route zum Folgen'); return; }
        const total = routeCum[routeCum.length - 1];
        s += step;
        if (s >= total) { const e = pointAt(route, routeCum, total); car = e.pos; brg = e.brg; emit(); stopLoop(); status('Ziel erreicht'); dbg('Ziel erreicht'); return; }
        const at = pointAt(route, routeCum, s);
        car = at.pos; brg = at.brg;
        emit();
        if (clock - lastLog >= 3000) { lastLog = clock; dbg('fahre … ' + Math.round(s) + '/' + Math.round(total) + ' m @ ' + maxKmh + ' km/h'); }
    }
    function startLoop() { if (!timer) timer = setInterval(tick, DT_REAL_MS); }
    function stopLoop() { if (timer) { clearInterval(timer); timer = null; } }

    // ---- "Auto hier" → place the car at the saved Home ----
    function loadHome() {
        try { const h = JSON.parse(localStorage.getItem('trk_nav_home') || 'null'); return (h && h.lat != null && h.lng != null) ? [h.lat, h.lng] : null; }
        catch (e) { return null; }
    }
    function placeCarAtHome() {
        stopLoop(); deviating = 0; routeRef = null; route = null; s = 0; clock = 0;
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
        if (!car) { status('erst „Auto hier"'); dbg('kein Auto — „Auto hier" zuerst'); return; }
        if (!(nav && nav.routePoints && nav.routePoints())) {
            if (nav && nav.hasDestination && nav.hasDestination() && nav.startNavigation) { status('Route wird berechnet …'); await nav.startNavigation(); }
        }
        routeRef = null;                       // force a fresh adopt + project
        if (!syncRoute()) { status('kein Ziel — erst im Ziel-Popup wählen'); dbg('kein Ziel/Route → nichts zu fahren'); return; }
        deviating = 0; s = 0;                  // start at the route's beginning (≈ the car)
        startLoop();
        status('fährt die Route …');
    }

    // ---- tiny UI panel (Orbitron, dark-blue, green actions per house rules) ----
    let elStatus = null;
    function status(m) { if (elStatus) elStatus.textContent = m; }
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
        title.textContent = '🧪 NAV-SIM';
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
        bRow.appendChild(mkBtn('Auto hier', placeCarAtHome));
        bRow.appendChild(mkBtn('Fahren', startDriving));
        bRow.appendChild(mkBtn('Abweichen', () => {
            if (!car) { status('erst „Auto hier"'); return; }
            deviating = DEVIATE_M; startLoop();
            dbg('Abweichen: ' + DEVIATE_M + ' m geradeaus, Heading ' + Math.round(brg));
            status('weicht ab …');
        }));
        bRow.appendChild(mkBtn('Stop', () => { stopLoop(); deviating = 0; status('gestoppt'); dbg('gestoppt'); }));
        p.appendChild(bRow);

        elStatus = document.createElement('div');
        elStatus.style.cssText = 'margin-top:8px;color:#9fc0ff;min-height:14px;line-height:1.4;';
        elStatus.textContent = '„Auto hier" → Ziel via Popup → „Fahren" → „Abweichen"';
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
    dbg('Simulator aktiv (?sim=1). Recording/Cloud AUS, echtes GPS AUS.');

    return { isActive: () => true, setSpeed: (kmh) => { maxKmh = kmh; } };
};
