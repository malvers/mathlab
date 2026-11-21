// The web's DocFit core (HTML/docfit/docfit-core.js) against the app's shared test values (core-vectors.json, written
// by CoreVectorsTest.java from made-up people): every body value, fitness score, tile zone, girth ratio, stopwatch
// text, blood-pressure category, blood-glucose reading and fasting day / banner / hint must come out the same as on the phone.
//     node docfit-app/test/test_core_vectors.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const C = require(join(here, '../../HTML/docfit/docfit-core.js'));
const V = JSON.parse(readFileSync(join(here, 'core-vectors.json'), 'utf8'));

let checks = 0, fails = 0;
function same(path, want, got) {
    checks++;
    if (want === null || got === null || want === undefined || got === undefined) {
        if (!(want == null && got == null)) fail(path, want, got);
        return;
    }
    if (typeof want === 'number' && typeof got === 'number') {
        if (Math.abs(want - got) > 1e-9) fail(path, want, got);
        return;
    }
    if (typeof want === 'object') {
        for (const k of Object.keys(want)) same(path + '.' + k, want[k], got[k]);
        if (!Array.isArray(want)) for (const k of Object.keys(got)) if (!(k in want)) fail(path + '.' + k, undefined, got[k]);
        return;
    }
    if (want !== got) fail(path, want, got);
}
function fail(path, want, got) {
    fails++;
    if (fails <= 20) console.log('FAIL', path, 'app:', JSON.stringify(want), 'web:', JSON.stringify(got));
}
const nn = v => (Number.isNaN(v) ? null : v);
function scale(s) {
    if (!s) return null;
    return {
        min: s.min, max: s.max, value: nn(s.value), note: s.note, unit: s.unit, decimals: s.decimals,
        bands: s.bands.map((b, i) => ({ from: b.from, to: b.to, zone: b.zone, word: b.word, span: s.span(i) })),
        zone: s.zone(), word: s.word(), at: s.hasValue() ? s.at(s.value) : null
    };
}

for (const [i, c] of V.body.entries()) {
    const p = { heightCm: c.in.heightCm, birthYear: c.in.birthYear, sex: c.in.sex };
    const w = { time: c.in.time, centiKg: c.in.centiKg, ohm: c.in.ohm };
    const bc = C.body(w, p);
    const fit = C.score(w, p);
    const age = C.Profile.ageIn(p, new Date(w.time).getFullYear());
    same('body[' + i + ']', c.out, {
        bmi: nn(bc.bmi), fat: nn(bc.fatPercent), water: nn(bc.waterPercent), muscle: nn(bc.muscleKg),
        gallagher: nn(bc.gallagherPercent), implausible: bc.fatImplausible, score: fit.score,
        scoreWord: C.word(fit.score), scoreText: fit.text,
        fatScale: scale(C.Ranges.fat(bc.fatPercent, p.sex, age)),
        waterScale: scale(C.Ranges.water(bc.waterPercent, p.sex)),
        muscleScale: scale(C.Ranges.muscle(bc.muscleKg, p.heightCm, p.sex)),
        bmiScale: scale(Number.isNaN(bc.bmi) ? null : C.Ranges.bmi(bc.bmi)),
        weightScale: scale(C.Ranges.weight(w.centiKg / 100, p.heightCm))
    });
}
for (const [i, c] of V.girths.entries()) {
    const whtr = C.Girths.waistToHeight(c.in.waistMm, c.in.heightCm), whr = C.Girths.waistToHip(c.in.waistMm, c.in.hipMm);
    same('girths[' + i + ']', c.out, {
        whtr, whr, waistCm: C.Girths.cm(c.in.waistMm), whtrText: C.Girths.ratio(whtr),
        waistScale: scale(C.Ranges.waist(c.in.waistMm, c.in.sex)),
        whtrScale: scale(C.Ranges.waistToHeight(whtr)),
        whrScale: scale(C.Ranges.waistToHip(whr, c.in.sex))
    });
}
for (const [i, c] of V.parseMm.entries()) same('parseMm[' + i + '] ' + JSON.stringify(c.in), c.out, C.Girths.parseMm(c.in));
for (const [i, c] of V.duration.entries()) same('duration[' + i + ']', c.out, C.Times.duration(c.in));
for (const [i, c] of V.bp.entries()) {
    same('bp[' + i + ']', c.out, C.Pressures.category(c.in[0], c.in[1]));
    same('bpCheck[' + i + ']', c.check, C.Pressures.check(c.in[0], c.in[1], 64));
}

const G = C.Glucose;
for (const [i, c] of V.glucose.entries()) {
    same('glucose[' + i + ']', { category: c.category, both: c.both }, { category: G.category(c.mgdl, c.context), both: G.both(c.mgdl) });
}
for (const [i, c] of V.glucoseTyped.entries()) {
    const v = G.parse(c.in);
    const unit = Number.isNaN(v) ? 'mmol' : G.detectUnit(v);
    const why = G.check(v, unit);
    same('glucoseTyped[' + i + '] ' + JSON.stringify(c.in), c, {
        in: c.in, value: Number.isNaN(v) ? null : v, unit, check: why,
        mgdl: why === null ? G.toMgdl(v, unit) : null,
        mgdlAsMmol: why === null ? G.toMgdl(v, unit === 'mmol' ? 'mgdl' : 'mmol') : null
    });
}

for (const [i, c] of V.fasts.entries()) {
    const f = { start: c.start, end: null, planned: c.planned };
    same('fasts[' + i + ']', { day: c.day, hours: c.hours, banner: c.banner },
        { day: C.Fasting.dayOf(f, c.now), hours: C.Fasting.hours(f, c.now), banner: C.Fasting.banner(f, c.now) });
}
for (const [i, c] of V.fastSafety.entries()) same('fastSafety[' + i + ']', c.level, C.Fasting.safety(c.sys, c.glu));

console.log(`${checks} Vergleiche, ${fails} Abweichungen`);
process.exit(fails ? 1 : 0);
