// Desk navigation simulator for the tracker. Loaded always, but only activates with ?sim=1.
//
// Purpose: reproduce and MEASURE the off-route reroute behaviour at the desk — no driving, no real GPS.
// It drives a virtual car along synthetic GPS fixes that are fed through the REAL onPosition pipeline
// (ctx.feed), so navigation/reroute/guidance behave exactly as in the field. While it runs, simMode in
// tracker.js suppresses cloud sync/broadcast (ctx.setSim) so no fake fix ever reaches Supabase.
//
// Usage: open the tracker with ?sim=1 → a "NAV-SIM" panel appears (bottom-left).
//   1) "Auto hier" drops the virtual car at the map centre.
//   2) "Ziel" → click the map to set a destination (a real OSRM route is computed).
//   3) "Fahren" → click the map to steer the car there; click OFF the route to trigger a reroute.
//   The DEBUG window logs each step (sim: …). Watch whether the new route goes forward or U-turns.
window.TrackerNavSim = function (ctx) {
    const { map, feed, setSim, nav, $ } = ctx;
    const dbg = (m) => { if (window.DebugWindow && DebugWindow.log) DebugWindow.log('sim: ' + m); };

    let mode = 'idle';      // 'dest' = next map click sets the destination; 'drive' = clicks steer the car
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
        if (dist <= step) { car = target.slice(); target = null; emit(); stopLoop(); dbg('Ziel-Wegpunkt erreicht — geparkt'); status('geparkt'); return; }
        car = moveAlong(car, brg, step);
        emit();
    }
    function startLoop() { if (!timer) timer = setInterval(tick, DT_REAL_MS); }
    function stopLoop() { if (timer) { clearInterval(timer); timer = null; } }

    // ---- map click → set destination or steer ----
    function onMapClick(e) {
        const ll = [e.latlng.lat, e.latlng.lng];
        if (mode === 'dest') {
            if (!car) { status('erst „Auto hier"'); dbg('kein Auto gesetzt — „Auto hier" zuerst'); return; }
            dbg('Ziel gesetzt → Route wird berechnet');
            if (nav && nav.navigateTo) nav.navigateTo(ll, 'SIM-Ziel');
            mode = 'drive'; arm();
            status('Ziel gesetzt — jetzt „Fahren": klick zum Lenken');
        } else if (mode === 'drive') {
            target = ll;
            startLoop();
            dbg('fahre zu ' + ll[0].toFixed(5) + ',' + ll[1].toFixed(5) + ' @ ' + maxKmh + ' km/h');
            status('fährt …');
        }
    }

    // ---- tiny UI panel (Orbitron, dark-blue, green actions per house rules) ----
    let elStatus = null, btnDest = null, btnDrive = null;
    function status(m) { if (elStatus) elStatus.textContent = m; }
    function arm() {
        if (btnDest) btnDest.style.outline = mode === 'dest' ? '2px solid #f5c242' : 'none';
        if (btnDrive) btnDrive.style.outline = mode === 'drive' ? '2px solid #f5c242' : 'none';
    }
    function mkBtn(label, fn) {
        const b = document.createElement('button');
        b.textContent = label;
        b.style.cssText = 'font-family:Orbitron,sans-serif;font-size:11px;padding:5px 8px;margin:2px;'
            + 'background:rgb(121,158,49);color:#fff;border:none;border-radius:6px;cursor:pointer;';
        b.addEventListener('click', fn);
        return b;
    }
    function buildPanel() {
        const p = document.createElement('div');
        p.id = 'navsim-panel';
        p.style.cssText = 'position:fixed;left:10px;bottom:10px;z-index:9000;width:188px;'
            + 'background:rgba(8,20,42,0.92);color:#cfe3ff;border:1px solid rgba(121,158,49,0.5);'
            + 'border-radius:10px;padding:8px;font-family:Orbitron,sans-serif;font-size:11px;'
            + 'box-shadow:0 4px 18px rgba(8,20,42,0.6);';

        const title = document.createElement('div');
        title.textContent = '🧪 NAV-SIM';
        title.style.cssText = 'font-weight:700;letter-spacing:1px;margin-bottom:6px;color:#f5c242;';
        p.appendChild(title);

        // speed row
        const sRow = document.createElement('div');
        sRow.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;';
        const sLbl = document.createElement('span');
        sLbl.textContent = maxKmh + ' km/h';
        sLbl.style.minWidth = '52px';
        const slider = document.createElement('input');
        slider.type = 'range'; slider.min = '5'; slider.max = '250'; slider.step = '5'; slider.value = String(maxKmh);
        slider.setAttribute('aria-label', 'Sim Maximalgeschwindigkeit');
        slider.style.flex = '1';
        slider.addEventListener('input', () => { maxKmh = +slider.value; sLbl.textContent = maxKmh + ' km/h'; });
        sRow.appendChild(sLbl); sRow.appendChild(slider);
        p.appendChild(sRow);

        // buttons
        const bRow = document.createElement('div');
        bRow.appendChild(mkBtn('Auto hier', () => {
            const c = map.getCenter(); car = [c.lat, c.lng]; brg = 0; target = null; clock = 0;
            emit(); dbg('Auto gesetzt @ ' + car[0].toFixed(5) + ',' + car[1].toFixed(5)); status('Auto gesetzt');
        }));
        btnDest = mkBtn('Ziel', () => { mode = 'dest'; arm(); status('klick aufs Ziel'); });
        btnDrive = mkBtn('Fahren', () => { mode = 'drive'; arm(); status('klick zum Lenken'); });
        bRow.appendChild(btnDest); bRow.appendChild(btnDrive);
        bRow.appendChild(mkBtn('Stop', () => { stopLoop(); target = null; status('gestoppt'); dbg('gestoppt'); }));
        p.appendChild(bRow);

        elStatus = document.createElement('div');
        elStatus.style.cssText = 'margin-top:6px;color:#9fc0ff;min-height:14px;';
        elStatus.textContent = '„Auto hier" → „Ziel" → „Fahren"';
        p.appendChild(elStatus);

        document.body.appendChild(p);
    }

    // ---- init ----
    setSim(true);                         // whole ?sim session is synthetic → never touch the cloud
    map.on('click', onMapClick);
    buildPanel();
    dbg('Simulator aktiv (?sim=1). Cloud-Sync AUS.');

    return {
        isActive: () => true,
        setSpeed: (kmh) => { maxKmh = kmh; },
    };
};
