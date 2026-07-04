// js/tracker-sun.js — FEAT-2: Goldene Stunde & Sonnenstand (Doc-Prio 1).
//
// Shows the best photo/hike light at the CURRENT location: the golden-hour windows, sunrise/sunset,
// blue hour, and the live sun height + compass direction. Position-driven (fed from onPosition like the
// speed sign) and self-ticking once a minute so the countdown/phase keeps moving while parked. No key,
// no network — pure astronomy from lat/lng + the device clock (CLAUDE.md rule 18).
//
// The solar maths is the standard NOAA algorithm (same Schlyter/NOAA lineage as worldclock-astro.js's
// sunPosition(), but standalone — that one is welded to the clock's globe/moon rendering). Exposed on
// window.TrackerSunMath so it can be unit-tested against a known almanac (Doc's rule: measure, not guess).
(function () {
    'use strict';

    const RAD = Math.PI / 180, DEG = 180 / Math.PI;
    const mod = (x, m) => ((x % m) + m) % m;
    const clamp = (x) => Math.max(-1, Math.min(1, x));

    // Sun's apparent declination (°) and the equation of time (minutes) for an instant (NOAA, J2000).
    function solarDeclEot(date) {
        const jd = date.getTime() / 86400000 + 2440587.5;   // Julian Day
        const T = (jd - 2451545) / 36525;                    // Julian centuries since J2000.0
        const L0 = mod(280.46646 + T * (36000.76983 + T * 0.0003032), 360);   // geometric mean longitude °
        const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);              // mean anomaly °
        const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);         // orbit eccentricity
        const Mr = M * RAD;
        const C = Math.sin(Mr) * (1.914602 - T * (0.004817 + 0.000014 * T))
            + Math.sin(2 * Mr) * (0.019993 - 0.000101 * T)
            + Math.sin(3 * Mr) * 0.000289;                   // equation of centre °
        const trueLong = L0 + C;
        const omega = 125.04 - 1934.136 * T;
        const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD);  // apparent longitude °
        const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - 0.001813 * T))) / 60) / 60;
        const eps = eps0 + 0.00256 * Math.cos(omega * RAD);                   // obliquity °
        const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD)) * DEG;
        const y = Math.tan(eps / 2 * RAD) ** 2;
        const L0r = L0 * RAD;
        const eot = 4 * DEG * (y * Math.sin(2 * L0r) - 2 * e * Math.sin(Mr)
            + 4 * e * y * Math.sin(Mr) * Math.cos(2 * L0r)
            - 0.5 * y * y * Math.sin(4 * L0r) - 1.25 * e * e * Math.sin(2 * Mr));  // minutes
        return { decl, eot };
    }

    // Live sun altitude (° above the horizon) + azimuth (° clockwise from north) + hour angle (° ; <0 = morning).
    function sunAltAz(date, lat, lng) {
        const { decl, eot } = solarDeclEot(date);
        const utcMin = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
        const tst = mod(utcMin + eot + 4 * lng, 1440);   // true solar time (min); lng east-positive
        const ha = tst / 4 - 180;                        // hour angle ° (0 at solar noon)
        const dr = decl * RAD, lr = lat * RAD, hr = ha * RAD;
        const alt = Math.asin(clamp(Math.sin(lr) * Math.sin(dr) + Math.cos(lr) * Math.cos(dr) * Math.cos(hr))) * DEG;
        // Azimuth from north, clockwise. atan2 form is stable at the horizon.
        const az = mod(Math.atan2(Math.sin(hr), Math.cos(hr) * Math.sin(lr) - Math.tan(dr) * Math.cos(lr)) * DEG + 180, 360);
        return { alt, az, ha, decl, eot };
    }

    // The times (local Date, or null if the sun never reaches that altitude that day) for the sun crossing a
    // target altitude h0 while RISING and while SETTING, for the local calendar day of `date`.
    function crossings(date, lat, lng, h0) {
        const y = date.getFullYear(), mo = date.getMonth(), d = date.getDate();
        const noonLocal = new Date(y, mo, d, 12, 0, 0);          // ~local solar noon instant → slow-varying decl/eot
        const { decl, eot } = solarDeclEot(noonLocal);
        const lr = lat * RAD, dr = decl * RAD;
        const arg = (Math.sin(h0 * RAD) - Math.sin(lr) * Math.sin(dr)) / (Math.cos(lr) * Math.cos(dr));
        if (arg > 1) return { rise: null, set: null };          // sun never gets that HIGH (polar night-ish)
        if (arg < -1) return { rise: null, set: null };         // sun never gets that LOW (never sets that far)
        const ha = Math.acos(clamp(arg)) * DEG;                 // ° half-day arc to h0
        const noonUtcMin = 720 - 4 * lng - eot;                 // solar noon in UTC minutes (lng east-positive)
        const base = Date.UTC(y, mo, d, 0, 0, 0);
        return {
            rise: new Date(base + (noonUtcMin - 4 * ha) * 60000),
            set: new Date(base + (noonUtcMin + 4 * ha) * 60000),
        };
    }

    // All the milestones for the local day at (lat,lng). Golden hour = sun −4°…+6°; blue hour = −6°…−4°;
    // sunrise/sunset at −0.833° (atmospheric refraction + the sun's own radius).
    function events(date, lat, lng) {
        const H_SET = -0.833, H_GOLD_HI = 6, H_GOLD_LO = -4, H_BLUE_LO = -6;
        const sun = crossings(date, lat, lng, H_SET);
        const gold = crossings(date, lat, lng, H_GOLD_HI);
        const goldLo = crossings(date, lat, lng, H_GOLD_LO);
        const blue = crossings(date, lat, lng, H_BLUE_LO);
        return {
            sunrise: sun.rise, sunset: sun.set,
            goldenAmStart: goldLo.rise, goldenAmEnd: gold.rise,   // morning golden band (−4° → +6°)
            goldenPmStart: gold.set, goldenPmEnd: goldLo.set,     // evening golden band (+6° → −4°)
            blueAmStart: blue.rise, blueAmEnd: goldLo.rise,       // dawn blue hour (−6° → −4°)
            bluePmStart: goldLo.set, bluePmEnd: blue.set,         // dusk blue hour (−4° → −6°)
        };
    }

    window.TrackerSunMath = { solarDeclEot, sunAltAz, crossings, events };

    // ---------------------------------------------------------------------------------------------------
    // UI: a slim line inside the top HUD header (#sun-line). Shows the current phase, the next milestone
    // time, and glows λ-orange during the golden/blue hour. Tap → a toast with the full breakdown.
    window.TrackerSun = function (ctx) {
        const $ = ctx.$ || ((id) => document.getElementById(id));
        const toast = typeof ctx.toast === 'function' ? ctx.toast : function () {};
        let pos = null, timer = null, wired = false;

        const hhmm = (dt) => dt ? dt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '—';
        const COMPASS = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
        const dir = (az) => COMPASS[Math.round(mod(az, 360) / 45) % 8];

        // "in 34 min" / "in 1:12 h" until a future Date (empty for past / null).
        function inWord(dt, now) {
            if (!dt) return '';
            const min = Math.round((dt.getTime() - now.getTime()) / 60000);
            if (min < 0 || min > 24 * 60) return '';
            if (min < 60) return 'in ' + min + ' min';
            return 'in ' + Math.floor(min / 60) + ':' + String(min % 60).padStart(2, '0') + ' h';
        }

        function phaseOf(alt) {
            if (alt >= 6) return 'day';
            if (alt >= -4) return 'golden';
            if (alt >= -6) return 'blue';
            return 'night';
        }

        // The single most useful upcoming moment, given the current phase and time-of-day.
        function nextMilestone(ev, now, rising) {
            const seq = rising
                ? [['Goldene Stunde', ev.goldenAmStart], ['Sonnenaufgang', ev.sunrise], ['Tag', ev.goldenAmEnd],
                   ['Goldene Stunde', ev.goldenPmStart], ['Sonnenuntergang', ev.sunset], ['Blaue Stunde', ev.goldenPmEnd], ['Nacht', ev.bluePmEnd]]
                : [['Goldene Stunde', ev.goldenPmStart], ['Sonnenuntergang', ev.sunset], ['Blaue Stunde', ev.goldenPmEnd], ['Nacht', ev.bluePmEnd]];
            for (const [label, dt] of seq) if (dt && dt.getTime() > now.getTime()) return { label, dt };
            // Nothing left today → tomorrow's sunrise.
            const t = new Date(now.getTime() + 86400000);
            const ev2 = events(t, pos[0], pos[1]);
            return { label: 'Sonnenaufgang', dt: ev2.sunrise };
        }

        function render() {
            const line = $('sun-line'); if (!line) return;
            if (!pos) { line.hidden = true; return; }
            const now = new Date();
            const here = sunAltAz(now, pos[0], pos[1]);
            const ev = events(now, pos[0], pos[1]);
            const phase = phaseOf(here.alt);
            const rising = here.ha < 0;
            const nx = nextMilestone(ev, now, rising);

            const ico = phase === 'day' ? '☀' : phase === 'night' ? '☾' : '✦';
            const main = (phase === 'golden' || phase === 'blue')
                ? (phase === 'golden' ? 'Goldene Stunde' : 'Blaue Stunde') + ' · bis ' + hhmm(nx.dt)
                : nx.label + ' ' + hhmm(nx.dt) + (inWord(nx.dt, now) ? ' (' + inWord(nx.dt, now) + ')' : '');
            const sub = '↑ ' + hhmm(ev.sunrise) + '  ↓ ' + hhmm(ev.sunset)
                + '   ' + (here.alt >= 0 ? '☉ ' + Math.round(here.alt) + '° ' + dir(here.az) : '');

            $('sun-ico').textContent = ico;
            $('sun-main').textContent = main;
            $('sun-sub').textContent = sub;
            line.classList.toggle('golden', phase === 'golden');
            line.classList.toggle('blue', phase === 'blue');
            line.hidden = false;

            if (!wired) {
                wired = true;
                line.addEventListener('click', showDetail);
            }
        }

        function showDetail() {
            if (!pos) return;
            const now = new Date();
            const ev = events(now, pos[0], pos[1]);
            const here = sunAltAz(now, pos[0], pos[1]);
            const band = (a, b) => hhmm(a) + '–' + hhmm(b);
            toast(
                'Sonne ' + Math.round(here.alt) + '° · ' + dir(here.az) + ' (' + Math.round(here.az) + '°)\n' +
                'Aufgang ' + hhmm(ev.sunrise) + ' · Untergang ' + hhmm(ev.sunset) + '\n' +
                'Goldene Stunde ' + band(ev.goldenAmStart, ev.goldenAmEnd) + ' · ' + band(ev.goldenPmStart, ev.goldenPmEnd) + '\n' +
                'Blaue Stunde ' + band(ev.blueAmStart, ev.blueAmEnd) + ' · ' + band(ev.bluePmStart, ev.bluePmEnd)
            );
        }

        function update(here) {
            if (!here || here[0] == null) return;
            pos = [here[0], here[1]];
            render();
            if (!timer) timer = setInterval(render, 60000);   // keep the countdown / phase live while parked
        }

        return { update, render, showDetail };
    };
})();
