// js/tracker-fines.js — German speeding-fine lookup ("Bußgeldkatalog") for the tracker.
//
// Machine-readable copy of the federal Bußgeldkatalog-Verordnung (BKatV) speeding table for cars
// (Pkw ohne Anhänger). Given how far you are over the limit it tells you what a ticket would cost:
// Euro fine, points in Flensburg, and a driving ban in months. Tapping the red over-speed sign opens
// a panel built from this data ("Du würdest jetzt 260 €, 2 Punkte und 1 Monat Fahrverbot kassieren").
//
// Why static, not "live": there is no free official API and the BKatV changes only every few years
// (last reform Nov 2021). So the table lives here, key-less and offline-safe (CLAUDE.md rule 18), with
// its source + Stand noted below so it is trivial to update by hand when the catalogue changes.
//
// Source: Bußgeldkatalog-Verordnung (BKatV), Anlage zu §1 — speeding (Pkw). Stand: 2026-06.
//   Legal text: https://www.gesetze-im-internet.de/bkatv/
//   Readable tables: https://www.adac.de/verkehr/recht/bussgeld-punkte/geschwindigkeitsueberschreitung/
window.TrackerFines = function (ctx) {
    const { $, showPanel, speed } = ctx;

    // Regelsatz (standard) fines per over-limit bracket. `max` = upper bound of the bracket in km/h
    // over the limit (inclusive); the last bucket is open-ended. euro = €, points = Flensburg points,
    // ban = Fahrverbot in months (0 = none). Two tables: innerorts (urban) vs außerorts (rural).
    const SPEED_FINES = {
        urban: [ // innerorts — limit ≤ 50 km/h; pedestrians/cyclists → harsher
            { max: 10, euro: 30, points: 0, ban: 0 },
            { max: 15, euro: 50, points: 0, ban: 0 },
            { max: 20, euro: 70, points: 0, ban: 0 },
            { max: 25, euro: 115, points: 1, ban: 0 },
            { max: 30, euro: 180, points: 1, ban: 0 },
            { max: 40, euro: 260, points: 2, ban: 1 },
            { max: 50, euro: 400, points: 2, ban: 1 },
            { max: 60, euro: 560, points: 2, ban: 2 },
            { max: 70, euro: 700, points: 2, ban: 3 },
            { max: Infinity, euro: 800, points: 2, ban: 3 },
        ],
        rural: [ // außerorts — limit > 50 km/h
            { max: 10, euro: 20, points: 0, ban: 0 },
            { max: 15, euro: 40, points: 0, ban: 0 },
            { max: 20, euro: 60, points: 0, ban: 0 },
            { max: 25, euro: 100, points: 1, ban: 0 },
            { max: 30, euro: 150, points: 1, ban: 0 },
            { max: 40, euro: 200, points: 1, ban: 1 },
            { max: 50, euro: 320, points: 2, ban: 1 },
            { max: 60, euro: 480, points: 2, ban: 1 },
            { max: 70, euro: 600, points: 2, ban: 2 },
            { max: Infinity, euro: 700, points: 2, ban: 3 },
        ],
    };

    // Look up the Regelsatz for being `over` km/h above the limit. `urban` picks the table.
    // Returns { euro, points, ban } or null when `over` ≤ 0 (you are legal → no ticket).
    function lookup(over, urban) {
        if (!(over > 0)) return null;
        const table = urban ? SPEED_FINES.urban : SPEED_FINES.rural;
        for (const row of table) if (over <= row.max) return row;
        return table[table.length - 1];
    }

    // Build the panel body for the current speed vs. limit and return an outcome flag so the caller can
    // colour the trigger. limit: number km/h | 'none' (Autobahn, unbegrenzt) | null/undefined (unknown).
    // confirmed=false → the limit is only the generic legal default (no mapped sign), so a concrete fine
    // would be a guess: we mark the basis "~ / unbestätigt" and call the figure an estimate (honest, in
    // step with the dimmed/dashed sign — Doc 2026-06-29). Omitted/true → priced as a firm ticket.
    function renderBody(speedKmh, limit, confirmed) {
        const body = $('fines-body');
        if (!body) return;
        const spd = Math.round(speedKmh || 0);
        const unconf = (confirmed === false);

        // No usable limit → can't price a ticket. Be honest instead of guessing.
        if (limit === 'none') {
            body.innerHTML = banner('green', '∞', 'Kein Tempolimit', 'Freie Strecke (Autobahn, unbegrenzt) — kein Bußgeld fürs Tempo.');
            return;
        }
        if (typeof limit !== 'number') {
            body.innerHTML = banner('grey', '?', 'Limit unbekannt', 'Für diese Straße liegt (noch) kein Tempolimit vor — kein Bußgeld berechenbar.');
            return;
        }

        // Measurement tolerance the authorities deduct before charging: 3 km/h up to 100 km/h, 3 % above.
        // The fine is assessed on this "vorwerfbarer" value, not the raw reading — so we deduct it too.
        const tolSpeed = spd <= 100 ? spd - 3 : Math.floor(spd * 0.97);
        const tolNote = spd <= 100 ? '−3 km/h Tol.' : '−3 % Tol.';
        const over = tolSpeed - limit;
        const urban = limit <= 50;
        const where = urban ? 'innerorts' : 'außerorts';
        const lim = (unconf ? '~' : '') + limit;          // mark an unconfirmed limit as approximate
        const whereTxt = where + (unconf ? ', unbestätigt' : '');

        if (over <= 0) {
            body.innerHTML = banner('green', '✓', 'Alles im grünen Bereich',
                `${spd} km/h bei erlaubten ${lim} km/h (${whereTxt}), nach Toleranz. Kein Bußgeld.`);
            return;
        }

        const f = lookup(over, urban);
        const tiles = [
            tile('Bußgeld', (unconf ? '~' : '') + f.euro + ' €'),
            tile('Punkte', f.points ? String(f.points) : '–'),
            tile('Fahrverbot', f.ban ? f.ban + ' Mon.' : '–'),
        ].join('');

        // When the limit is only the generic default, say so plainly and call the figure an estimate.
        const estimateNote = unconf
            ? 'Limit ist nur der gesetzliche Regelfall (kein Schild erkannt) — Bußgeld nur als Schätzung. '
            : '';
        body.innerHTML = `
            <div class="fines-head">
                <div class="fines-speed"><b>${spd}</b><span> km/h</span></div>
                <div class="fines-vs">${over} km/h zu schnell · erlaubt ${lim} (${whereTxt}) · ${tolNote}</div>
            </div>
            <div class="fines-tiles">${tiles}</div>
            <p class="fines-note">${estimateNote}Regelsatz Pkw nach Bußgeldkatalog (BKatV), Stand 2026. Bei Voreintrag,
            Gefährdung o. Wiederholung kann es teurer werden. Ohne Gewähr.</p>`;
        fitTiles(); // shrink any label/value that's wider than its tile (e.g. "FAHRVERBOT" on a narrow phone)
    }

    // Font fit by REAL DOM metrics: shrink the font-size until the element's own rendered width
    // (scrollWidth — includes the actual web font Orbitron + letter-spacing) fits its tile. Canvas
    // measureText underestimated Orbitron (a wide font) and never shrank — scrollWidth can't be fooled.
    function fitToWidth(el, maxPx) {
        if (!el || maxPx <= 0) return;
        el.style.fontSize = ''; // start from the CSS base each render
        let size = parseFloat(getComputedStyle(el).fontSize);
        for (let i = 0; i < 60 && el.scrollWidth > maxPx && size > 6; i++) {
            size -= 0.5;
            el.style.fontSize = size + 'px';
        }
    }
    function fitTiles() {
        document.querySelectorAll('#fines-body .fines-tile').forEach((tile) => {
            const cs = getComputedStyle(tile);
            const avail = tile.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
            fitToWidth(tile.querySelector('.fines-tile-v'), avail);
            fitToWidth(tile.querySelector('.fines-tile-l'), avail);
        });
    }

    function tile(label, value) {
        return `<div class="fines-tile"><div class="fines-tile-v">${value}</div><div class="fines-tile-l">${label}</div></div>`;
    }
    function banner(tone, glyph, title, text) {
        return `<div class="fines-banner ${tone}"><div class="fines-banner-glyph">${glyph}</div>
            <div><div class="fines-banner-t">${title}</div><div class="fines-banner-x">${text}</div></div></div>`;
    }

    // Debug slider: when dragged above 0 it OVERRIDES the live speed so you can watch the fine jump at a
    // desk. 0 = off (real GPS). If there's no real limit while simulating (e.g. at the desk), assume a
    // 50-zone so the slider actually demonstrates something instead of "Limit unbekannt".
    function simSpeed() { const el = $('fines-sim'); const v = el ? +el.value : 0; return v > 0 ? v : null; }
    function curSpeed() { const s = simSpeed(); return s != null ? s : (speed && speed.lastSpeed ? speed.lastSpeed() : 0); }
    function curLimit() {
        const l = speed && speed.currentLimit ? speed.currentLimit() : null;
        return (simSpeed() != null && typeof l !== 'number') ? 50 : l;
    }
    // Is the current limit a mapped/signed value (true) or only the generic legal default / sim fallback?
    function curConfirmed() {
        const live = speed && speed.currentLimit ? speed.currentLimit() : null;
        if (simSpeed() != null && typeof live !== 'number') return false; // injected fallback 50 → estimate
        return !(speed && speed.currentConfirmed) || speed.currentConfirmed() !== false; // missing API → confirmed
    }

    // Open the panel for the current situation (pulled from the speed-limit module).
    function show() {
        renderBody(curSpeed(), curLimit(), curConfirmed());
        if (showPanel) showPanel('fines-panel');
    }

    // Live update: re-price from the latest GPS fix WHILE the panel is open (called each fix from the
    // position pipeline). No-op when the panel is closed, so it's free the rest of the time.
    function refresh() {
        const panel = $('fines-panel');
        if (!panel || !panel.classList.contains('open')) return;
        renderBody(curSpeed(), curLimit(), curConfirmed());
    }

    // Wire the debug slider (panel HTML is static → element is available at init). Dragging re-prices
    // live and updates the label; 0 snaps back to real GPS.
    const slider = $('fines-sim'), simVal = $('fines-sim-val');
    if (slider) slider.addEventListener('input', () => {
        if (simVal) simVal.textContent = +slider.value > 0 ? slider.value + ' km/h' : 'aus';
        renderBody(curSpeed(), curLimit(), curConfirmed());
    });

    return { show, refresh, lookup };
};
