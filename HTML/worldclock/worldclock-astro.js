// Worldclock — astronomy helpers (pure, no DOM, no shared state).

// Orientation of the Moon's bright limb as seen from (lat,lon) right now (Schlyter ephemeris).
// Returns the on-screen rotation so a "bright-on-the-right" disc points the bright limb correctly.
function moonBrightLimbRotation(date, latDeg, lonDeg) {
    const R = Math.PI / 180, DEG = 180 / Math.PI;
    const rev = x => ((x % 360) + 360) % 360;
    const d = (date.getTime() - Date.UTC(1999, 11, 31, 0, 0, 0)) / 86400000; // days since 1999-12-31 0h UT
    const ecl = (23.4393 - 3.563e-7 * d) * R;
    // --- Sun ---
    const ws = 282.9404 + 4.70935e-5 * d, es = 0.016709 - 1.151e-9 * d;
    const Ms = rev(356.0470 + 0.9856002585 * d);
    const Esun = Ms + es * DEG * Math.sin(Ms * R) * (1 + es * Math.cos(Ms * R));
    const xs0 = Math.cos(Esun * R) - es, ys0 = Math.sin(Esun * R) * Math.sqrt(1 - es * es);
    const rs = Math.hypot(xs0, ys0), vs = Math.atan2(ys0, xs0) * DEG, lons = rev(vs + ws);
    const xss = rs * Math.cos(lons * R), yss = rs * Math.sin(lons * R);
    const RAs = Math.atan2(yss * Math.cos(ecl), xss);
    const Decs = Math.atan2(yss * Math.sin(ecl), Math.hypot(xss, yss * Math.cos(ecl)));
    const Ls = rev(ws + Ms);
    // --- Moon ---
    const Nm = 125.1228 - 0.0529538083 * d, im = 5.1454, wm = 318.0634 + 0.1643573223 * d;
    const am = 60.2666, em = 0.054900, Mm = rev(115.3654 + 13.0649929509 * d);
    let Em = Mm + em * DEG * Math.sin(Mm * R) * (1 + em * Math.cos(Mm * R));
    for (let k = 0; k < 4; k++) Em = Em - (Em - em * DEG * Math.sin(Em * R) - Mm) / (1 - em * Math.cos(Em * R));
    const xv = am * (Math.cos(Em * R) - em), yv = am * Math.sqrt(1 - em * em) * Math.sin(Em * R);
    const vm = Math.atan2(yv, xv) * DEG, rm = Math.hypot(xv, yv), vw = (vm + wm) * R;
    const xh = rm * (Math.cos(Nm * R) * Math.cos(vw) - Math.sin(Nm * R) * Math.sin(vw) * Math.cos(im * R));
    const yh = rm * (Math.sin(Nm * R) * Math.cos(vw) + Math.cos(Nm * R) * Math.sin(vw) * Math.cos(im * R));
    const zh = rm * (Math.sin(vw) * Math.sin(im * R));
    const xe = xh, ye = yh * Math.cos(ecl) - zh * Math.sin(ecl), ze = yh * Math.sin(ecl) + zh * Math.cos(ecl);
    const RAm = Math.atan2(ye, xe), Decm = Math.atan2(ze, Math.hypot(xe, ye));
    // --- hour angle + parallactic angle + bright-limb position angle ---
    const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const LST = rev(rev(Ls + 180) + UT * 15 + lonDeg);          // local sidereal time (deg)
    const HA = rev(LST - RAm * DEG) * R;                        // hour angle (rad)
    const lat = latDeg * R;
    const q = Math.atan2(Math.sin(HA), Math.tan(lat) * Math.cos(Decm) - Math.sin(Decm) * Math.cos(HA));
    const chi = Math.atan2(Math.cos(Decs) * Math.sin(RAs - RAm),
        Math.sin(Decs) * Math.cos(Decm) - Math.cos(Decs) * Math.sin(Decm) * Math.cos(RAs - RAm));
    // bright limb angle from zenith = chi - q; map to canvas (bright drawn at +x, up = -90°)
    return -Math.PI / 2 - (chi - q);
}

// Local sidereal time (degrees) at longitude lonDeg for the given instant (Schlyter low-precision).
// = which right ascension is on the local meridian; rotates the star field over a sidereal day.
function siderealTimeDeg(date, lonDeg) {
    const rev = x => ((x % 360) + 360) % 360;
    const d = (date.getTime() - Date.UTC(1999, 11, 31, 0, 0, 0)) / 86400000;
    const ws = 282.9404 + 4.70935e-5 * d;
    const Ms = rev(356.0470 + 0.9856002585 * d);
    const Ls = rev(ws + Ms);                                  // Sun's mean longitude
    const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    return rev(rev(Ls + 180) + UT * 15 + lonDeg);
}

// Geocentric RA/Dec (degrees) of the five naked-eye planets for `date` (Schlyter low-precision, ~1–2′).
// Same machinery as the Sun/Moon above: orbital elements → heliocentric ecliptic → + Sun's geocentric → equatorial.
function planetPositions(date) {
    const R = Math.PI / 180, DEG = 180 / Math.PI;
    const rev = x => ((x % 360) + 360) % 360;
    const d = (date.getTime() - Date.UTC(1999, 11, 31, 0, 0, 0)) / 86400000;
    const ecl = (23.4393 - 3.563e-7 * d) * R;

    // Sun's geocentric rectangular ecliptic position (= minus Earth's heliocentric) — added to each planet.
    const ws = 282.9404 + 4.70935e-5 * d, es = 0.016709 - 1.151e-9 * d, Ms = rev(356.0470 + 0.9856002585 * d);
    const Esun = Ms + es * DEG * Math.sin(Ms * R) * (1 + es * Math.cos(Ms * R));
    const xvs = Math.cos(Esun * R) - es, yvs = Math.sqrt(1 - es * es) * Math.sin(Esun * R);
    const vs = Math.atan2(yvs, xvs) * DEG, rs = Math.hypot(xvs, yvs), lons = rev(vs + ws);
    const xs = rs * Math.cos(lons * R), ys = rs * Math.sin(lons * R);

    // [name, colour, N, i, w, a, e, M] — each linear element evaluated at day d (Schlyter elements).
    const P = [
        ['Merkur',  '#c9c4b8',  48.3313 + 3.24587e-5 * d,  7.0047 + 5.00e-8 * d,  29.1241 + 1.01444e-5 * d, 0.387098, 0.205635 + 5.59e-10 * d, 168.6562 + 4.0923344368 * d],
        ['Venus',   '#fde6b0',  76.6799 + 2.46590e-5 * d,  3.3946 + 2.75e-8 * d,  54.8910 + 1.38374e-5 * d, 0.723330, 0.006773 - 1.302e-9 * d,  48.0052 + 1.6021302244 * d],
        ['Mars',    '#ff7043',  49.5574 + 2.11081e-5 * d,  1.8497 - 1.78e-8 * d, 286.5016 + 2.92961e-5 * d, 1.523688, 0.093405 + 2.516e-9 * d,  18.6021 + 0.5240207766 * d],
        ['Jupiter', '#e6d6a0', 100.4542 + 2.76854e-5 * d,  1.3030 - 1.557e-7 * d, 273.8777 + 1.64505e-5 * d, 5.20256,  0.048498 + 4.469e-9 * d,  19.8950 + 0.0830853001 * d],
        ['Saturn',  '#e8dcb0', 113.6634 + 2.38980e-5 * d,  2.4886 - 1.081e-7 * d, 339.3939 + 2.97661e-5 * d, 9.55475,  0.055546 - 9.499e-9 * d, 316.9670 + 0.0334442282 * d],
    ];

    const out = [];
    for (const [name, color, N0, i0, w0, a, e, M0] of P) {
        const N = rev(N0) * R, iR = i0 * R, M = rev(M0);
        let E = M + e * DEG * Math.sin(M * R) * (1 + e * Math.cos(M * R));
        for (let k = 0; k < 5; k++) E = E - (E - e * DEG * Math.sin(E * R) - M) / (1 - e * Math.cos(E * R));
        const xv = a * (Math.cos(E * R) - e), yv = a * Math.sqrt(1 - e * e) * Math.sin(E * R);
        const v = Math.atan2(yv, xv) * DEG, r = Math.hypot(xv, yv), vw = (v + w0) * R;
        const xh = r * (Math.cos(N) * Math.cos(vw) - Math.sin(N) * Math.sin(vw) * Math.cos(iR));
        const yh = r * (Math.sin(N) * Math.cos(vw) + Math.cos(N) * Math.sin(vw) * Math.cos(iR));
        const zh = r * (Math.sin(vw) * Math.sin(iR));
        const xg = xh + xs, yg = yh + ys, zg = zh;                       // geocentric ecliptic
        const xe = xg, ye = yg * Math.cos(ecl) - zg * Math.sin(ecl), ze = yg * Math.sin(ecl) + zg * Math.cos(ecl);
        out.push({ name, color, ra: rev(Math.atan2(ye, xe) * DEG), dec: Math.atan2(ze, Math.hypot(xe, ye)) * DEG });
    }
    return out;
}

// Geocentric RA/Dec (degrees) of the Sun (Schlyter).
function sunPosition(date) {
    const R = Math.PI / 180, DEG = 180 / Math.PI, rev = x => ((x % 360) + 360) % 360;
    const d = (date.getTime() - Date.UTC(1999, 11, 31, 0, 0, 0)) / 86400000;
    const ecl = (23.4393 - 3.563e-7 * d) * R;
    const w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d, M = rev(356.0470 + 0.9856002585 * d);
    const E = M + e * DEG * Math.sin(M * R) * (1 + e * Math.cos(M * R));
    const xv = Math.cos(E * R) - e, yv = Math.sqrt(1 - e * e) * Math.sin(E * R);
    const lon = rev(Math.atan2(yv, xv) * DEG + w);
    const xs = Math.cos(lon * R), ys = Math.sin(lon * R);
    const xe = xs, ye = ys * Math.cos(ecl), ze = ys * Math.sin(ecl);
    return { ra: rev(Math.atan2(ye, xe) * DEG), dec: Math.atan2(ze, Math.hypot(xe, ye)) * DEG };
}

// Geocentric RA/Dec (degrees) + illuminated fraction (0..1) of the Moon (Schlyter).
function moonPosition(date) {
    const R = Math.PI / 180, DEG = 180 / Math.PI, rev = x => ((x % 360) + 360) % 360;
    const d = (date.getTime() - Date.UTC(1999, 11, 31, 0, 0, 0)) / 86400000;
    const ecl = (23.4393 - 3.563e-7 * d) * R;
    // Sun (for the elongation → illuminated fraction)
    const ws = 282.9404 + 4.70935e-5 * d, es = 0.016709 - 1.151e-9 * d, Ms = rev(356.0470 + 0.9856002585 * d);
    const Es = Ms + es * DEG * Math.sin(Ms * R) * (1 + es * Math.cos(Ms * R));
    const xss = Math.cos(Es * R) - es, yss = Math.sqrt(1 - es * es) * Math.sin(Es * R);
    const lons = rev(Math.atan2(yss, xss) * DEG + ws), xs1 = Math.cos(lons * R), ys1 = Math.sin(lons * R);
    const RAs = Math.atan2(ys1 * Math.cos(ecl), xs1), Decs = Math.atan2(ys1 * Math.sin(ecl), Math.hypot(xs1, ys1 * Math.cos(ecl)));
    // Moon
    const Nm = 125.1228 - 0.0529538083 * d, im = 5.1454, wm = 318.0634 + 0.1643573223 * d;
    const am = 60.2666, em = 0.054900, Mm = rev(115.3654 + 13.0649929509 * d);
    let Em = Mm + em * DEG * Math.sin(Mm * R) * (1 + em * Math.cos(Mm * R));
    for (let k = 0; k < 5; k++) Em = Em - (Em - em * DEG * Math.sin(Em * R) - Mm) / (1 - em * Math.cos(Em * R));
    const xv = am * (Math.cos(Em * R) - em), yv = am * Math.sqrt(1 - em * em) * Math.sin(Em * R);
    const vm = Math.atan2(yv, xv) * DEG, rm = Math.hypot(xv, yv), vw = (vm + wm) * R;
    const xh = rm * (Math.cos(Nm * R) * Math.cos(vw) - Math.sin(Nm * R) * Math.sin(vw) * Math.cos(im * R));
    const yh = rm * (Math.sin(Nm * R) * Math.cos(vw) + Math.cos(Nm * R) * Math.sin(vw) * Math.cos(im * R));
    const zh = rm * (Math.sin(vw) * Math.sin(im * R));
    const xe = xh, ye = yh * Math.cos(ecl) - zh * Math.sin(ecl), ze = yh * Math.sin(ecl) + zh * Math.cos(ecl);
    const RAm = Math.atan2(ye, xe), Decm = Math.atan2(ze, Math.hypot(xe, ye));
    const cosElong = Math.sin(Decs) * Math.sin(Decm) + Math.cos(Decs) * Math.cos(Decm) * Math.cos(RAs - RAm);
    return { ra: rev(RAm * DEG), dec: Decm * DEG, illum: (1 - cosElong) / 2 };
}
