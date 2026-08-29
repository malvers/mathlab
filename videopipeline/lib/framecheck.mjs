// Does the picture still fit on the stage? Checked before recording, not after.
//
// Written after the Kovarianz shoot, where scenes 6 and 7 were only found to be
// broken by pulling frames out of the finished cut - seven minutes of recording
// per attempt.
//
// WHAT WORKS AND WHAT DOES NOT (measured on kovarianz.html, 1280x720):
//
//   A lab-supplied number is the reliable test. `probe` returns whatever the lab
//   itself knows about its size - for kovarianz that is stats.s1, the large
//   semi-axis in world units, against a limit derived from the stage scale. It
//   caught the real bug exactly and reports how far off a scene is.
//
//   Counting bright pixels along the border does NOT work for this. A thin curve
//   crosses the frame edge in only a few places, so the border reading barely
//   moves: sqrt(lambda1) of 190 - worse than the bug we actually had - still
//   measured 1.1 %, while scenes that were perfectly fine measured 1.8 % because
//   they legitimately draw lines to the edge. A bounding box fares no better; on
//   this lab it touches the border at every size. Both are kept out on purpose.
//
//   Coverage DOES work, for a different failure: when the subject leaves the view
//   altogether, the ink drops sharply (1.7 % against a typical 4.2 %). A size
//   check alone would call that fine.
//
// So: `probe` for geometry, coverage as the generic backstop.

/** Fraction of the canvas that carries ink. Cheap enough to run every scene. */
export async function measureCoverage(page, { selector = 'canvas', threshold = 150, step = 4 } = {}) {
    return page.evaluate(([sel, thr, step]) => {
        const c = document.querySelector(sel);
        if (!c || !c.getContext) return null;
        const g = c.getContext('2d');
        const W = c.width, H = c.height;
        if (!W || !H) return null;
        const d = g.getImageData(0, 0, W, H).data;
        let ink = 0, seen = 0;
        for (let y = 0; y < H; y += step) {
            for (let x = 0; x < W; x += step) {
                const i = (y * W + x) * 4;
                seen++;
                if (d[i] + d[i + 1] + d[i + 2] > thr) ink++;
            }
        }
        return ink / seen;
    }, [selector, threshold, step]);
}

/**
 * Watch every scene and print a verdict table.
 *
 * @param {object}   o
 * @param {function} o.probe        runs in the page, returns the lab's own size measure
 * @param {number}   o.limit        the value `probe` must stay below
 * @param {string}   o.probeLabel   what that number is, for the table
 * @param {number}   o.minCoverage  below this the subject has left the view
 */
export function frameWatch({ probe = null, limit = Infinity, probeLabel = 'Groesse',
                             minCoverage = 0.004, label = 'Bildkontrolle' } = {}) {
    const rows = [];
    return {
        async take(page, name, opts) {
            const coverage = await measureCoverage(page, opts);
            const size = probe ? await page.evaluate(probe) : null;
            rows.push({ name, coverage, size });
            return { coverage, size };
        },
        /** @returns {boolean} true when every scene is within limits */
        report() {
            if (!rows.length) return true;
            console.log(`  ${label}: ${probeLabel} < ${limit === Infinity ? '—' : limit}` +
                `, Deckung > ${(minCoverage * 100).toFixed(1)} %`);
            let ok = true;
            for (const r of rows) {
                const bad = [];
                if (r.size != null && r.size > limit) bad.push(`zu gross (${(r.size / limit * 100 - 100).toFixed(0)} % drueber)`);
                if (r.coverage != null && r.coverage < minCoverage) bad.push('fast nichts zu sehen');
                if (bad.length) ok = false;
                console.log(`    ${r.name.padEnd(5)}` +
                    (r.size != null ? ` ${probeLabel} ${r.size.toFixed(0).padStart(5)}` : '') +
                    `   Deckung ${(r.coverage * 100).toFixed(2).padStart(5)} %` +
                    (bad.length ? '   << ' + bad.join(', ') : ''));
            }
            console.log('  ' + (ok ? 'Bildkontrolle bestanden.'
                : 'ACHTUNG: Bild stimmt nicht — vor der Aufnahme korrigieren.'));
            return ok;
        },
        get rows() { return rows; },
    };
}
