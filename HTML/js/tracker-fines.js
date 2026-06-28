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
    function renderBody(speedKmh, limit) {
        const body = $('fines-body');
        if (!body) return;
        const spd = Math.round(speedKmh || 0);

        // No usable limit → can't price a ticket. Be honest instead of guessing.
        if (limit === 'none') {
            body.innerHTML = banner('green', '∞', 'Kein Tempolimit', 'Freie Strecke (Autobahn, unbegrenzt) — kein Bußgeld fürs Tempo.');
            return;
        }
        if (typeof limit !== 'number') {
            body.innerHTML = banner('grey', '?', 'Limit unbekannt', 'Für diese Straße liegt (noch) kein Tempolimit vor — kein Bußgeld berechenbar.');
            return;
        }

        const over = spd - limit;
        const urban = limit <= 50;
        const where = urban ? 'innerorts' : 'außerorts';

        if (over <= 0) {
            body.innerHTML = banner('green', '✓', 'Alles im grünen Bereich',
                `${spd} km/h bei erlaubten ${limit} km/h (${where}). Kein Bußgeld.`);
            return;
        }

        const f = lookup(over, urban);
        const tiles = [
            tile('Bußgeld', f.euro + ' €'),
            tile('Punkte', f.points ? String(f.points) : '–'),
            tile('Fahrverbot', f.ban ? f.ban + ' Mon.' : '–'),
        ].join('');

        body.innerHTML = `
            <div class="fines-head">
                <div class="fines-speed"><b>${spd}</b><span> km/h</span></div>
                <div class="fines-vs">${over} km/h zu schnell · erlaubt ${limit} (${where})</div>
            </div>
            <div class="fines-tiles">${tiles}</div>
            <p class="fines-note">Regelsatz Pkw nach Bußgeldkatalog (BKatV), Stand 2026. Bei Voreintrag,
            Gefährdung o. Wiederholung kann es teurer werden. Ohne Gewähr.</p>`;
    }

    function tile(label, value) {
        return `<div class="fines-tile"><div class="fines-tile-v">${value}</div><div class="fines-tile-l">${label}</div></div>`;
    }
    function banner(tone, glyph, title, text) {
        return `<div class="fines-banner ${tone}"><div class="fines-banner-glyph">${glyph}</div>
            <div><div class="fines-banner-t">${title}</div><div class="fines-banner-x">${text}</div></div></div>`;
    }

    // Open the panel for the current situation (pulled from the speed-limit module).
    function show() {
        const limit = speed && speed.currentLimit ? speed.currentLimit() : null;
        const spd = speed && speed.lastSpeed ? speed.lastSpeed() : 0;
        renderBody(spd, limit);
        if (showPanel) showPanel('fines-panel');
    }

    return { show, lookup };
};
