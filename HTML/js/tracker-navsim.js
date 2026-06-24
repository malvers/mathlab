// Desk navigation simulator for the tracker. Loaded always, but only activates with ?sim=1.
//
// Purpose: reproduce and MEASURE the off-route reroute behaviour at the desk — no driving, no real GPS.
// It drives a virtual car along synthetic GPS fixes that are fed through the REAL onPosition pipeline
// (ctx.feed), so navigation/reroute/guidance behave exactly as in the field. While it runs, simMode in
// tracker.js suppresses recording/cloud-sync (ctx.setSim) so no fake fix ever reaches Supabase, and the
// real navigator.geolocation is neutralised below so no genuine desktop fix can fight the synthetic car.
//
// Usage: open the tracker with ?sim=1 → a "NAV-SIM" panel appears (bottom-left).
//   1) "Auto hier" drops the virtual car at the saved Home position.
//   2) Pick a destination via the normal "Ziel" popup (search/history/home).
//   3) "Fahren" → computes the route (if needed), then click the map to steer the car there;
//      click OFF the route to trigger a reroute. The DEBUG window logs each step (sim: …).
//      Watch whether the new route goes forward or U-turns.
window.TrackerNavSim = function (ctx) {
    const { map, feed, setSim, nav } = ctx;
    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('sim: ' + m); };

    let car = null;         // [lat,lng] current simulated position
    let target = null;      // [lat,lng] the car steers toward (null = parked)
    let brg = 0;            // current heading (deg, 0 = N)
    let maxKmh = 50;        // virtual max speed
    let timer = null;       // drive interval (real time)
    let clock = 0;          // sim timestamp (ms) — advances DT_SIM_MS per emitted fix
    const DT_SIM_MS = 1000; // each fix represents one simulated second (drives the speed maths)
    const DT_REAL_MS = 600; // wall-clock between fixes (how fast you watch it play out)

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
        const R = 6371000, d = distM / R, br = brgDeg * T, la1 = from[0] * T, lo1 = from[1] * T;
        const la2 = Math.asin(Math.sin(la1) * Math.cos(d) + Math.cos(la1) * Math.sin(d) * Math.cos(br));
        const lo2 = lo1 + Math.atan2(Math.sin(br) * Math.sin(d) * Math.cos(la1), Math.cos(d) - Math.sin(la1) * Math.sin(la2));
        return [la2 / T, ((lo2 / T + 540) % 360) - 180];
    }

    // ---- feed one synthetic fix through the real pipeline ----
    function emit() {
        clock += DT_SIM_MS;
        feed({
            coords: { latitude: car[0], longitude: car[1], accuracy: 5, speed: maxKmh / 3.6, heading: brg, altitude: null },
            timestamp: clock,
        });
    }

    // ---- drive loop: step the car toward the target at the set speed, one fix per DT_SIM_MS ----
    function tick() {
        if (!car || !target) return;
        const dist = haversine(car, target);
        const step = (maxKmh / 3.6) * (DT_SIM_MS / 1000); // metres covered this simulated second
        brg = bearingDeg(car, target);
        if (dist <= step) { car = target.slice(); target = null; emit(); stopLoop(); dbg('Wegpunkt erreicht — geparkt'); status('geparkt'); return; }
        car = moveAlong(car, brg, step);
        emit();
    }
    function startLoop() { if (!timer) timer = setInterval(tick, DT_REAL_MS); }
    function stopLoop() { if (timer) { clearInterval(timer); timer = null; } }

    // ---- "Auto hier" → place the car at the saved Home (Doc 2026-06-24) ----
    function loadHome() {
        try { const h = JSON.parse(localStorage.getItem('trk_nav_home') || 'null'); return (h && h.lat != null && h.lng != null) ? [h.lat, h.lng] : null; }
        catch (e) { return null; }
    }
    function placeCarAtHome() {
        const h = loadHome();
        if (h) { car = h; }
        else { const c = map.getCenter(); car = [c.lat, c.lng]; dbg('kein Home gesetzt → Auto auf Kartenmitte'); }
        brg = 0; target = null; clock = 0;
        map.setView(car, Math.max(map.getZoom(), 15));
        emit();
        dbg('Auto @ ' + car[0].toFixed(5) + ',' + car[1].toFixed(5) + (h ? ' (Home)' : ''));
        status(h ? 'Auto auf Home' : 'Auto auf Kartenmitte (kein Home)');
    }

    // ---- map click → steer the car (only while "Fahren" is armed) ----
    let driving = false;
    function onMapClick(e) {
        if (!driving) return;
        if (!car) { status('erst „Auto hier"'); dbg('kein Auto — „Auto hier" zuerst'); return; }
        target = [e.latlng.lat, e.latlng.lng];
        startLoop();
        dbg('fahre zu ' + target[0].toFixed(5) + ',' + target[1].toFixed(5) + ' @ ' + maxKmh + ' km/h');
        status('fährt …');
    }

    // ---- tiny UI panel (Orbitron, dark-blue, green actions per house rules) ----
    let elStatus = null, btnDrive = null;
    function status(m) { if (elStatus) elStatus.textContent = m; }
    function arm() { if (btnDrive) btnDrive.style.outline = driving ? '2px solid #f5c242' : 'none'; }
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
        p.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9000;width:260px;'
            + 'background:rgba(8,20,42,0.92);color:#cfe3ff;border:1px solid rgba(121,158,49,0.5);'
            + 'border-radius:10px;padding:10px;font-family:Orbitron,sans-serif;font-size:11px;'
            + 'box-shadow:0 4px 18px rgba(8,20,42,0.6);';

        const title = document.createElement('div');
        title.textContent = '🧪 NAV-SIM';
        title.style.cssText = 'font-weight:700;letter-spacing:1px;margin-bottom:8px;color:#f5c242;';
        p.appendChild(title);

        // speed row
        const sRow = document.createElement('div');
        sRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
        const sLbl = document.createElement('span');
        sLbl.textContent = maxKmh + ' km/h';
        sLbl.style.minWidth = '58px';
        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = '5'; slider.max = '250'; slider.step = '5'; slider.value = String(maxKmh);
        slider.setAttribute('aria-label', 'Sim Maximalgeschwindigkeit');
        slider.style.flex = '1';
        slider.addEventListener('input', () => { maxKmh = +slider.value; sLbl.textContent = maxKmh + ' km/h'; });
        sRow.appendChild(sLbl); sRow.appendChild(slider);
        p.appendChild(sRow);

        // buttons
        const bRow = document.createElement('div');
        bRow.appendChild(mkBtn('Auto hier', placeCarAtHome));
        btnDrive = mkBtn('Fahren', () => {
            if (nav && nav.hasDestination && nav.hasDestination() && nav.startNavigation) nav.startNavigation(); // ensure a route exists
            driving = true; arm();
            status('klick auf die Karte zum Lenken');
        });
        bRow.appendChild(btnDrive);
        bRow.appendChild(mkBtn('Stop', () => { stopLoop(); target = null; driving = false; arm(); status('gestoppt'); dbg('gestoppt'); }));
        p.appendChild(bRow);

        elStatus = document.createElement('div');
        elStatus.style.cssText = 'margin-top:8px;color:#9fc0ff;min-height:14px;line-height:1.4;';
        elStatus.textContent = '„Auto hier" → Ziel via Popup → „Fahren"';
        p.appendChild(elStatus);

        document.body.appendChild(p);
    }

    // ---- init ----
    setSim(true);                         // whole ?sim session is synthetic → never record/sync to the cloud
    // Neutralise the real geolocation so no genuine desktop fix can fight the synthetic car.
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition = function () { return 0; };
        navigator.geolocation.getCurrentPosition = function () { };
        navigator.geolocation.clearWatch = function () { };
    }
    map.on('click', onMapClick);
    buildPanel();
    dbg('Simulator aktiv (?sim=1). Recording/Cloud AUS, echtes GPS AUS.');

    return {
        isActive: () => true,
        setSpeed: (kmh) => { maxKmh = kmh; },
    };
};
