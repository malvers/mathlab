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
