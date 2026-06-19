// js/tracker-hud.js — the three HUD stat tiles (DISTANCE / SPEED / HÖHE).
// Extracted verbatim from tracker.js (2026-06-19, Scheibe-1 refactor) — behaviour unchanged.
// Owns the fixed-slot CyberClock widgets, their labels, and the adaptive distance unit. The host
// (tracker.js) keeps the track state and just calls these setters; only the small pieces of host
// state this needs (idle? / navigating?) come in through ctx so the DISTANCE tile can hide itself.
//
// ctx (from tracker.js): { isIdle: () => bool, navActive: () => bool }
window.TrackerHud = function (ctx) {
    const isIdle = ctx.isIdle, navActive = ctx.navActive;
    const $ = id => document.getElementById(id);
    const elDist = $('trk-dist'), elSpeed = $('trk-speed'), elAlt = $('trk-alt');
    const elDistLbl = $('trk-dist-lbl'), elSpeedLbl = $('trk-speed-lbl'), elAltLbl = $('trk-alt-lbl');

    // The three stats use the SAME fixed-slot widget so digits never jump as the value changes:
    // right-aligned, no leading zeros (blank slots on the left), group stays centred. KM/H = 999.9
    // (1 dec), HÖHE = 9999 m (int).
    const STAT_SIZE = 'clamp(1rem, 4.5vw, 1.4rem)';
    const STAT_COL = 'var(--cfg-stat-color, var(--orange))'; // live-config override (tracker-config.js); default = λ-orange
    const STAT_FONT = 'Orbitron'; // Doc: stat numbers back in Orbitron (HUD CSS widens slot + comma so it's not cramped)
    const STAT_SEP = ',';
    CyberClock.mountNum(elSpeed, { intSlots: 3, decimals: 1, size: STAT_SIZE, digitColor: STAT_COL, font: STAT_FONT, decimalSep: STAT_SEP });
    CyberClock.mountNum(elAlt, { intSlots: 4, decimals: 0, size: STAT_SIZE, digitColor: STAT_COL, font: STAT_FONT, decimalSep: STAT_SEP });

    // Centre each label under the VISIBLE digits (not the full right-aligned slot box). The number is
    // right-aligned (blank slots on the left), so shift the label right by half the left-blank width —
    // measured from the first non-empty slot → tracks the visible number.
    function centerStatLabel(w, lbl) {
        if (!w || !lbl || !w._ccDigits) return;
        let first = null;
        for (let i = 0; i < w._ccDigits.length; i++) { if (w._ccDigits[i].textContent !== '') { first = w._ccDigits[i]; break; } }
        if (!first) { lbl.style.transform = ''; return; }
        const shift = (first.getBoundingClientRect().left - w.getBoundingClientRect().left) / 2;
        lbl.style.transform = shift > 0.5 ? 'translateX(' + shift.toFixed(1) + 'px)' : '';
    }

    // The LEFT tile is dual-purpose: it shows DISTANCE while recording/navigating, and the ambient
    // TEMPERATURE while idle (Doc 2026-06-19 — distance is meaningless before a track exists, so the
    // freed tile carries something useful instead of sitting empty). updateDistVisibility() flips the
    // mode from the host's idle/nav state; setDist()/setTemp() store the latest value and only repaint
    // the tile when their own mode is the one currently shown.
    let tileMode = 'dist';   // 'dist' | 'temp'
    let lastDistM = 0;       // last distance (m) — repainted when mode flips back to 'dist'
    let lastTempC = null;    // last ambient temperature (°C) — null until the first fetch

    // Distance is ADAPTIVE: < 100 m → whole metres (label "m"); ≥ 100 m → km with 2 decimals
    // (label "KM"). Re-mount only when the unit flips (rare) → no jitter within a unit.
    function renderDist() {
        const meters = (lastDistM != null && lastDistM < 100);
        const want = meters ? 'm' : 'km';
        if (elDist.dataset.unit !== want) {
            CyberClock.mountNum(elDist, meters
                ? { intSlots: 3, decimals: 0, size: STAT_SIZE, digitColor: STAT_COL, font: STAT_FONT, decimalSep: STAT_SEP }
                : { intSlots: 3, decimals: 2, size: STAT_SIZE, digitColor: STAT_COL, font: STAT_FONT, decimalSep: STAT_SEP });
            elDist.dataset.unit = want;
            if (elDistLbl) elDistLbl.textContent = meters ? 'DISTANCE m' : 'DISTANCE KM';
        }
        CyberClock.setNum(elDist, lastDistM == null ? null : (meters ? Math.round(lastDistM) : lastDistM / 1000));
        centerStatLabel(elDist, elDistLbl);
    }
    // Temperature: 1 decimal, signed (the minus eats one of the 3 int slots → fits down to −99.9).
    // Until the first reading a single centred dash, same as the altitude tile.
    function renderTemp() {
        if (elDist.dataset.unit !== 'temp') {
            CyberClock.mountNum(elDist, { intSlots: 3, decimals: 1, size: STAT_SIZE, digitColor: STAT_COL, font: STAT_FONT, decimalSep: STAT_SEP });
            elDist.dataset.unit = 'temp';
            if (elDistLbl) elDistLbl.textContent = 'TEMP °C';
        }
        if (lastTempC == null || isNaN(lastTempC)) {
            const boxes = elDist._ccDigits, intN = elDist._ccIntN;
            if (boxes) {
                for (let i = 0; i < boxes.length; i++) { boxes[i].textContent = ''; boxes[i].style.display = 'none'; }
                boxes[intN - 1].textContent = '–'; boxes[intN - 1].style.display = '';
            }
        } else {
            CyberClock.setNum(elDist, lastTempC);
        }
        centerStatLabel(elDist, elDistLbl);
    }
    function renderTile() { if (tileMode === 'temp') renderTemp(); else renderDist(); }
    function setDist(distM) { lastDistM = distM; if (tileMode === 'dist') renderDist(); }
    function setTemp(c) { lastTempC = c; if (tileMode === 'temp') renderTemp(); }

    // Speed label: live readout vs a loaded track's average. setSpeed() restores the LIVE label on
    // every update (so live tracking, clear and multi-load all read "SPEED KM/H"); setSpeedAvg()
    // overrides it to the Ø average afterwards when a single saved track is shown.
    const SPEED_LBL_LIVE = (elSpeedLbl && elSpeedLbl.textContent) || 'SPEED KM/H';
    const SPEED_LBL_AVG = 'Ø KM/H';
    function setSpeed(kmh) { if (elSpeedLbl) elSpeedLbl.textContent = SPEED_LBL_LIVE; CyberClock.setNum(elSpeed, kmh); centerStatLabel(elSpeed, elSpeedLbl); }
    function setSpeedAvg(kmh) { setSpeed(kmh); if (elSpeedLbl) { elSpeedLbl.textContent = SPEED_LBL_AVG; centerStatLabel(elSpeed, elSpeedLbl); } }

    function setAlt(m) {
        if (m == null || isNaN(m)) {
            // no altitude fix yet → a single centred dash instead of blank slots
            const boxes = elAlt._ccDigits, intN = elAlt._ccIntN;
            if (boxes) {
                for (let i = 0; i < boxes.length; i++) { boxes[i].textContent = ''; boxes[i].style.display = 'none'; }
                boxes[intN - 1].textContent = '–'; boxes[intN - 1].style.display = '';
            }
        } else {
            CyberClock.setNum(elAlt, m);
        }
        centerStatLabel(elAlt, elAltLbl);
    }

    // Flip the left tile between DISTANCE (recording/navigating) and TEMP (genuine idle: not recording
    // AND not navigating). Kept the name updateDistVisibility so every host call site stays unchanged.
    function updateDistVisibility() {
        const want = (isIdle() && !navActive()) ? 'temp' : 'dist';
        if (want !== tileMode) { tileMode = want; renderTile(); }
    }

    // Re-centre all three labels (on resize, after a layout change).
    function recenterAll() {
        centerStatLabel(elDist, elDistLbl); centerStatLabel(elSpeed, elSpeedLbl); centerStatLabel(elAlt, elAltLbl);
    }

    return { setDist, setTemp, setSpeed, setSpeedAvg, setAlt, updateDistVisibility, centerStatLabel, recenterAll };
};
