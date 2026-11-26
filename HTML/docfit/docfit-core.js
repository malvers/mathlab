/*
 * DocFit core for the web - the SAME formulas as the Android app (docfit-app/android/.../docfit): BodyComposition,
 * FitnessScore, Ranges, Girths, Times, Pressures, ScoreBar, History and Trends (the "Verlauf" tab's series).
 * Doc, 20.11.2026: "DocFit im Web = identisch zum Phone".
 *
 * Kept identical by shared test values: CoreVectorsTest.java computes a grid of made-up people with the app's classes
 * into docfit-app/test/core-vectors.json, and docfit-app/test/test_core_vectors.mjs checks this file against it
 * (`node docfit-app/test/test_core_vectors.mjs`). Change a formula on the phone -> regenerate the file -> follow here.
 *
 * Every function mirrors its Java counterpart line by line (same order of operations, so the same doubles):
 * - body fat: Jebb 2000 (foot-to-foot, height in METRES), water 0.73 x fat-free mass, muscle Janssen 2000 (an
 *   estimate), BMI; plausibility against Gallagher 2000 (more than 8 points apart or below essential fat);
 * - fitness score 1-10 after Gallagher 2000 + ACE; tile zones (Ranges); WHtR / WHR (Girths); ESH categories.
 * Plain script, no dependencies: in the page it is window.DocFitCore, in node module.exports.
 */
(function (root) {
    'use strict';

    const MIN_HEIGHT = 100, MAX_HEIGHT = 250, MIN_YEAR = 1900;
    const MIN_OHM = 150, MAX_OHM = 1500;
    const MAX_GAP = 8, ESSENTIAL_WOMEN = 13, ESSENTIAL_MEN = 5;
    const BMI_UNDER = 18.5, BMI_OBESE = 30, BMI_OVER = 25;
    const SMI_LOW_MEN = 8.50, SMI_LOW_WOMEN = 5.75;
    const SMI_GOOD_MEN = 10.76, SMI_GOOD_WOMEN = 6.76;
    const WATER_MEN_LOW = 50, WATER_MEN_HIGH = 65, WATER_WOMEN_LOW = 45, WATER_WOMEN_HIGH = 60;
    const WAIST_MEN = 94, WAIST_MEN_HIGH = 102, WAIST_WOMEN = 80, WAIST_WOMEN_HIGH = 88;
    const WHTR_INCREASED = 50, WHTR_HIGH = 60, WHR_MEN = 90, WHR_WOMEN = 85;
    const GIRTH_MIN_MM = 500, GIRTH_MAX_MM = 2000;
    const WORDS = ['grottenschlecht', 'ausbaufähig', 'solide', 'fit', 'Top-Athlet'];
    const HINT_PROFILE = 'Fitness-Einordnung erst mit vollständigem Profil.';
    const HINT_FAT = 'Fitness-Einordnung erst, wenn die Waage Körperfett misst.';
    const HINT_IMPLAUSIBLE = 'Körperfett unplausibel – bitte noch einmal wiegen, barfuß und still stehen.';
    const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    // ---- small helpers (Java's String.format(Locale.GERMANY, ...), Math.round, Math.nextUp) ----------------------

    /** "%.<d>f" with a decimal comma - exact half-up like Java's Formatter */
    const fmt = (v, d) => v.toFixed(d).replace('.', ',');
    const pad2 = n => (n < 10 ? '0' : '') + n;
    /** Java's Math.round(double): floor(x + 0.5) */
    const jround = x => Math.floor(x + 0.5);
    const tenth = v => (Number.isNaN(v) ? v : jround(v * 10) / 10);
    function nextUp(x) {
        if (Number.isNaN(x) || x === Infinity) return x;
        if (x === 0) return Number.MIN_VALUE;
        const b = new DataView(new ArrayBuffer(8));
        b.setFloat64(0, x);
        let hi = b.getUint32(0), lo = b.getUint32(4);
        if (x > 0) { lo = (lo + 1) >>> 0; if (lo === 0) hi = (hi + 1) >>> 0; }
        else { if (lo === 0) hi = (hi - 1) >>> 0; lo = (lo - 1) >>> 0; }
        b.setUint32(0, hi); b.setUint32(4, lo);
        return b.getFloat64(0);
    }
    const known = sex => sex === 'm' || sex === 'w';

    // ---- Times ----------------------------------------------------------------------------------------------------

    const Times = {
        /** stopwatch: "mm:ss", from an hour "h:mm:ss", seconds cut */
        duration(ms) {
            if (ms < 0) ms = 0;
            const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
            return h > 0 ? h + ':' + pad2(m % 60) + ':' + pad2(s % 60) : pad2(m) + ':' + pad2(s % 60);
        },
        day(when) {
            const d = new Date(when);
            return DAYS[d.getDay()] + ' ' + pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
        },
        clock(when) {
            const d = new Date(when);
            return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
        },
        kg: kg => (Number.isNaN(kg) ? '–' : fmt(kg, 2) + ' kg'),
        one: (v, unit) => (Number.isNaN(v) ? '–' : fmt(v, 1) + (unit === '' ? '' : ' ' + unit))
    };

    // ---- Profile --------------------------------------------------------------------------------------------------

    /** { heightCm, birthYear, sex: 'm' | 'w' | '' } - 0 / '' = not entered */
    const Profile = {
        hasHeight: p => p.heightCm >= MIN_HEIGHT && p.heightCm <= MAX_HEIGHT,
        complete: p => Profile.hasHeight(p) && p.birthYear >= MIN_YEAR && known(p.sex),
        ageIn: (p, year) => (p.birthYear >= MIN_YEAR ? year - p.birthYear : 0)
    };

    // ---- BodyComposition ------------------------------------------------------------------------------------------

    const isMeasured = ohm => ohm >= MIN_OHM && ohm <= MAX_OHM;
    const plausible = (v, min, max) => (v > min && v < max ? v : NaN);

    function gallagher(bmi, age, male) {
        const sx = male ? 1 : 0;
        return 64.5 - 848 / bmi + 0.079 * age - 16.4 * sx + 0.05 * sx * age + 39.0 * sx / bmi;
    }

    function implausible(fat, gal, male) {
        if (Number.isNaN(fat)) return false;
        return fat < (male ? ESSENTIAL_MEN : ESSENTIAL_WOMEN) || (!Number.isNaN(gal) && Math.abs(fat - gal) > MAX_GAP);
    }

    /** { bmi, fatPercent, waterPercent, muscleKg, gallagherPercent, fatImplausible } - NaN where not computable */
    function bodyOf(weightKg, ohm, heightCm, age, sex) {
        const res = (bmi, fat, water, muscle, gal, imp) =>
            ({ bmi, fatPercent: fat, waterPercent: water, muscleKg: muscle, gallagherPercent: gal, fatImplausible: imp });
        if (weightKg <= 0 || heightCm < MIN_HEIGHT || heightCm > MAX_HEIGHT) return res(NaN, NaN, NaN, NaN, NaN, false);
        const m = heightCm / 100.0;
        const bmi = weightKg / (m * m);
        const male = sex === 'm';
        const isKnown = male || sex === 'w';
        const gal = isKnown && age > 0 ? gallagher(bmi, age, male) : NaN;
        if (!isMeasured(ohm) || age <= 0 || !isKnown) return res(bmi, NaN, NaN, NaN, gal, false);
        const lnH = Math.log(m);   // metres - see BodyComposition.java
        let fat = -156.1 - 89.1 * lnH + 45.6 * Math.log(weightKg) + 0.120 * age + 0.0494 * ohm
            + (male ? 0 : 19.6 * lnH);
        fat = plausible(fat, 0, 100);
        const water = Number.isNaN(fat) ? NaN : plausible(0.73 * (100 - fat), 0, 100);
        const h2r = heightCm * heightCm / ohm;
        const sm = 0.401 * h2r + (male ? 3.825 : 0) - 0.071 * age + 5.102;
        return res(bmi, fat, water, plausible(sm, 0, weightKg), gal, implausible(fat, gal, male));
    }

    /** one weigh-in { time, centiKg, ohm } with a profile: the age in the year of the weigh-in */
    function body(w, p) {
        return bodyOf(w.centiKg / 100.0, w.ohm, p.heightCm, Profile.ageIn(p, new Date(w.time).getFullYear()), p.sex);
    }

    // ---- FitnessScore ---------------------------------------------------------------------------------------------

    function limits(sex, age) {
        const g = age < 40 ? 0 : age < 60 ? 1 : 2;
        const male = sex === 'm';
        const lean = male ? [8, 11, 13] : [21, 23, 24];
        const healthy = male ? [20, 22, 25] : [33, 34, 36];
        const obese = male ? [25, 28, 30] : [39, 40, 42];
        const shift = healthy[g] - healthy[0];
        const who = male ? 'Männer' : 'Frauen';
        const ages = ['bis 39', 'von 40 bis 59', 'ab 60'];
        const average = (male ? 18 : 25) + shift;
        const fitness = Math.max((male ? 14 : 21) + shift, Math.floor((lean[g] + average) / 2));
        return { lean: lean[g], fitness, average, overweight: healthy[g], obese: obese[g], group: 'für ' + who + ' ' + ages[g] };
    }

    const halves = (v, from, to, best) => (v < (from + to) / 2 ? best : best - 1);

    function fatScore(fat, l) {
        if (fat < l.lean) return 7;
        if (fat < l.fitness) return halves(fat, l.lean, l.fitness, 10);
        if (fat < l.average) return halves(fat, l.fitness, l.average, 8);
        if (fat < l.overweight) return halves(fat, l.average, l.overweight, 6);
        if (fat < l.obese) return halves(fat, l.overweight, l.obese, 4);
        return halves(fat, l.obese, l.obese + 2 * (l.obese - l.overweight), 2);
    }

    const word = score => (score < 1 || score > 10 ? '' : WORDS[Math.floor((score - 1) / 2)]);
    const pct = v => fmt(v, 0) + ' %';

    function bmiWord(b) {
        if (b < BMI_UNDER) return 'Untergewicht';
        if (b < BMI_OVER) return 'Normalgewicht';
        if (b < BMI_OBESE) return 'Übergewicht';
        return 'Adipositas';
    }

    function fatWords(fat, l) {
        if (fat < l.lean) return 'sehr wenig – unter dem gesunden Bereich (ab ' + pct(l.lean) + '), auf Dauer zu wenig';
        if (fat < l.fitness) return l.group + ' im Bereich von Leistungssportlern';
        if (fat < l.average) return l.group + ' fit – Leistungssportler liegen unter ' + pct(l.fitness);
        if (fat < l.overweight) return l.group + ' im gesunden Bereich, Sportler liegen unter ' + pct(l.average);
        if (fat < l.obese) return l.group + ' etwas viel – gesund ist unter ' + pct(l.overweight);
        return l.group + ' deutlich zu viel – gesund ist unter ' + pct(l.overweight);
    }

    function scoreOf(fatPercent, bmi, muscleKg, heightCm, age, sex) {
        if (age <= 0 || heightCm <= 0 || !known(sex)) return { score: 0, text: HINT_PROFILE };
        if (Number.isNaN(fatPercent)) return { score: 0, text: HINT_FAT };
        const fat = jround(fatPercent * 10) / 10;
        const l = limits(sex, age);
        const score = fatScore(fat, l);
        let s = 'Körperfett ' + Times.one(fat, '%') + ': ' + fatWords(fat, l) + '.';
        let minus = '', points = 0;
        if (!Number.isNaN(bmi)) {
            const b = jround(bmi * 10) / 10;
            if (b < BMI_UNDER || b >= BMI_OBESE) {
                points++;
                minus += 'BMI ' + Times.one(b, '') + ' (WHO: ' + bmiWord(b) + ')';
            }
        }
        if (!Number.isNaN(muscleKg)) {
            const m = heightCm / 100.0;
            const smi = muscleKg / (m * m);
            if (smi <= (sex === 'm' ? SMI_LOW_MEN : SMI_LOW_WOMEN)) {
                points++;
                if (minus.length > 0) minus += ', ';
                minus += 'wenig Muskelmasse (' + Times.one(smi, 'kg/m²') + ')';
            }
        }
        if (points > 0) {
            s += (points === 1 ? ' Ein Punkt Abzug: ' : ' Je ein Punkt Abzug: ') + minus + '.';
        } else if (!Number.isNaN(bmi)) {
            const b = jround(bmi * 10) / 10;
            s += ' BMI ' + Times.one(b, '') + ' – laut WHO ' + bmiWord(b) + '.';
        }
        return { score: Math.max(1, Math.min(10, score - points)), text: s };
    }

    /** for one weigh-in, as FitnessScore.of(Weighing, Profile) */
    function score(w, p) {
        if (!Profile.complete(p)) return { score: 0, text: HINT_PROFILE };
        if (!isMeasured(w.ohm)) return { score: 0, text: HINT_FAT };
        const bc = body(w, p);
        if (bc.fatImplausible) return { score: 0, text: HINT_IMPLAUSIBLE };
        return scoreOf(bc.fatPercent, bc.bmi, bc.muscleKg, p.heightCm, Profile.ageIn(p, new Date(w.time).getFullYear()), p.sex);
    }

    /** ScoreBar.colorFor: red -> orange -> green over 1..10, colours as [r, g, b] */
    function scoreColor(s, low, mid, high) {
        const t = Math.max(0, Math.min(9, s - 1)) / 9;
        const mix = (a, b, u) => a.map((c, i) => jround(c + (b[i] - c) * Math.fround(u)));
        return t < 0.5 ? mix(low, mid, Math.fround(t * 2)) : mix(mid, high, Math.fround((t - 0.5) * 2));
    }

    // ---- Ranges ---------------------------------------------------------------------------------------------------

    function Scale(min, max, value, note, unit, decimals, bands) {
        this.min = min; this.max = max; this.value = value; this.note = note; this.unit = unit;
        this.decimals = decimals; this.bands = bands;
    }
    Scale.prototype.hasValue = function () { return !Number.isNaN(this.value); };
    Scale.prototype.band = function () {
        if (!this.hasValue()) return null;
        for (const b of this.bands) if (this.value < b.to) return b;
        return this.bands[this.bands.length - 1];
    };
    Scale.prototype.word = function () { const b = this.band(); return b ? b.word : null; };
    Scale.prototype.zone = function () { const b = this.band(); return b ? b.zone : null; };
    Scale.prototype.span = function (i) {
        const b = this.bands[i], u = this.unit === '' ? '' : ' ' + this.unit, n = v => fmt(v, this.decimals);
        if (i === 0) return 'unter ' + n(b.to) + u;
        if (i === this.bands.length - 1) return 'ab ' + n(b.from) + u;
        return n(b.from) + '–' + n(b.to) + u;
    };
    /** where a value stands on the bar, 0..1 (a float like the app's) */
    Scale.prototype.at = function (v) { return Math.fround(Math.max(0, Math.min(1, (v - this.min) / (this.max - this.min)))); };

    const band = (from, to, zone, w) => ({ from, to, zone, word: w });
    const whole = v => fmt(v, 0);

    const Ranges = {
        fat(percent, sex, age) {
            if (!known(sex) || age <= 0) return null;
            const l = limits(sex, age);
            const min = sex === 'm' ? 0 : 10, max = min + 40;
            const ages = age < 40 ? 'bis 39' : age < 60 ? '40–59' : 'ab 60';
            return new Scale(min, max, tenth(percent), 'gesund ' + whole(l.lean) + '–' + whole(l.overweight) + ' % (' + ages + ')',
                '%', 0, [band(min, l.lean, 'BORDER', 'sehr wenig'), band(l.lean, l.overweight, 'GOOD', 'gesund'),
                    band(l.overweight, l.obese, 'BORDER', 'etwas viel'), band(l.obese, max, 'HIGH', 'zu viel')]);
        },
        water(percent, sex) {
            if (!known(sex)) return null;
            const male = sex === 'm';
            const lo = male ? WATER_MEN_LOW : WATER_WOMEN_LOW, hi = male ? WATER_MEN_HIGH : WATER_WOMEN_HIGH;
            return new Scale(35, 75, tenth(percent), 'typisch ' + whole(lo) + '–' + whole(hi) + ' %', '%', 0,
                [band(35, lo, 'BORDER', 'niedrig'), band(lo, hi, 'GOOD', 'typisch'), band(hi, 75, 'BORDER', 'hoch')]);
        },
        muscle(kg, heightCm, sex) {
            if (!known(sex) || heightCm < MIN_HEIGHT || heightCm > MAX_HEIGHT) return null;
            const male = sex === 'm';
            const m2 = heightCm / 100.0 * (heightCm / 100.0);
            const low = (male ? SMI_LOW_MEN : SMI_LOW_WOMEN) * m2;
            const good = (male ? SMI_GOOD_MEN : SMI_GOOD_WOMEN) * m2;
            const min = (male ? 6 : 4) * m2, max = (male ? 14 : 10) * m2;
            return new Scale(min, max, tenth(kg), 'gut ab ' + Times.one(tenth(good), 'kg'), 'kg', 1,
                [band(min, nextUp(low), 'HIGH', 'wenig'), band(nextUp(low), tenth(good), 'BORDER', 'mittel'),
                    band(tenth(good), max, 'GOOD', 'gut')]);
        },
        weight(kg, heightCm) {
            if (heightCm < MIN_HEIGHT || heightCm > MAX_HEIGHT) return null;
            const m2 = heightCm / 100.0 * (heightCm / 100.0);
            const under = tenth(BMI_UNDER * m2), over = tenth(BMI_OVER * m2);
            const obese = tenth(BMI_OBESE * m2), min = tenth(15 * m2), max = tenth(40 * m2);
            return new Scale(min, max, Number.isNaN(kg) ? kg : jround(kg * 100) / 100.0,
                'normal ' + Times.one(under, '') + '–' + Times.one(over, '') + ' kg', 'kg', 1,
                [band(min, under, 'BORDER', 'Untergewicht'), band(under, over, 'GOOD', 'normal'),
                    band(over, obese, 'BORDER', 'Übergewicht'), band(obese, max, 'HIGH', 'Adipositas')]);
        },
        bmi(b) {
            return new Scale(15, 40, tenth(b), 'normal 18,5–24,9', '', 1,
                [band(15, BMI_UNDER, 'BORDER', 'Untergewicht'), band(BMI_UNDER, BMI_OVER, 'GOOD', 'normal'),
                    band(BMI_OVER, BMI_OBESE, 'BORDER', 'Übergewicht'), band(BMI_OBESE, 40, 'HIGH', 'Adipositas')]);
        },
        waist(waistMm, sex) {
            if (!known(sex)) return null;
            const male = sex === 'm';
            const up = male ? WAIST_MEN : WAIST_WOMEN, high = male ? WAIST_MEN_HIGH : WAIST_WOMEN_HIGH;
            const min = male ? 60 : 55, max = male ? 130 : 120;
            return new Scale(min, max, waistMm > 0 ? waistMm / 10.0 : NaN, 'erhöht ab ' + whole(up) + ', hoch ab ' + whole(high),
                'cm', 0, [band(min, up, 'GOOD', 'gut'), band(up, high, 'BORDER', 'erhöht'), band(high, max, 'HIGH', 'hoch')]);
        },
        waistToHeight(h) {
            const inc = WHTR_INCREASED / 100.0, high = WHTR_HIGH / 100.0;
            return new Scale(0.35, 0.75, h > 0 ? h / 100.0 : NaN, 'gut unter 0,5, hoch ab 0,6', '', 2,
                [band(0.35, inc, 'GOOD', 'gut'), band(inc, high, 'BORDER', 'erhöht'), band(high, 0.75, 'HIGH', 'hoch')]);
        },
        waistToHip(h, sex) {
            if (!known(sex)) return null;
            const limit = sex === 'm' ? WHR_MEN : WHR_WOMEN;
            const min = limit / 100.0 - 0.2, lim = limit / 100.0, max = lim + 0.2;
            return new Scale(min, max, h > 0 ? h / 100.0 : NaN, 'erhöht ab ' + fmt(lim, 2), '', 2,
                [band(min, lim, 'GOOD', 'gut'), band(lim, max, 'BORDER', 'erhöht')]);
        }
    };

    // ---- Girths ---------------------------------------------------------------------------------------------------

    const Girths = {
        parseMm(typed) {
            if (typed == null) return 0;
            let s = String(typed).trim().toLowerCase();
            if (s.endsWith('cm')) s = s.substring(0, s.length - 2).trim();
            if (s === '') return 0;
            s = s.replace(/,/g, '.');
            if (!/^\d{1,3}(\.\d+)?$/.test(s)) return -1;
            const mm = jround(parseFloat(s) * 10);
            return mm >= GIRTH_MIN_MM && mm <= GIRTH_MAX_MM ? mm : -1;
        },
        cm: mm => (mm > 0 ? fmt(mm / 10.0, 1) + ' cm' : '–'),
        field: mm => (mm > 0 ? fmt(mm / 10.0, 1) : ''),
        ratio: h => (h > 0 ? fmt(h / 100.0, 2) : '–'),
        waistToHeight(waistMm, heightCm) {
            if (waistMm <= 0 || heightCm < MIN_HEIGHT || heightCm > MAX_HEIGHT) return 0;
            return Math.trunc(waistMm * 10 / heightCm);
        },
        waistToHip(waistMm, hipMm) {
            if (waistMm <= 0 || hipMm <= 0) return 0;
            return Math.trunc(waistMm * 100 / hipMm);
        }
    };

    // ---- Pressures (ESH 2023) -------------------------------------------------------------------------------------

    const CATEGORIES = ['optimal', 'normal', 'hoch-normal', 'Hypertonie Grad 1', 'Hypertonie Grad 2', 'Hypertonie Grad 3'];
    const Pressures = {
        SYS_MIN: 70, SYS_MAX: 250, DIA_MIN: 40, DIA_MAX: 150, PULSE_MIN: 30, PULSE_MAX: 220, NOTE_MAX: 200,
        /** index 0..5 into CATEGORIES: the higher of the systolic and the diastolic category */
        categoryIndex(sys, dia) {
            const s = sys < 120 ? 0 : sys < 130 ? 1 : sys < 140 ? 2 : sys < 160 ? 3 : sys < 180 ? 4 : 5;
            const d = dia < 80 ? 0 : dia < 85 ? 1 : dia < 90 ? 2 : dia < 100 ? 3 : dia < 110 ? 4 : 5;
            return Math.max(s, d);
        },
        category(sys, dia) { return CATEGORIES[Pressures.categoryIndex(sys, dia)]; },
        check(sys, dia, pulse) {
            const P = Pressures;
            if (sys < P.SYS_MIN || sys > P.SYS_MAX) return 'Systolisch zwischen ' + P.SYS_MIN + ' und ' + P.SYS_MAX + ' mmHg.';
            if (dia < P.DIA_MIN || dia > P.DIA_MAX) return 'Diastolisch zwischen ' + P.DIA_MIN + ' und ' + P.DIA_MAX + ' mmHg.';
            if (sys <= dia) return 'Der systolische Wert muss höher sein als der diastolische.';
            if (pulse < P.PULSE_MIN || pulse > P.PULSE_MAX) return 'Puls zwischen ' + P.PULSE_MIN + ' und ' + P.PULSE_MAX + ' pro Minute.';
            return null;
        }
    };

    // ---- Glucose (Glucoses.java: typed in, stored as whole mg/dL, shown in both units) --------------------------

    const MG_PER_MMOL = 18.016;
    const Glucose = {
        MG_PER_MMOL, MMOL_BELOW: 35, MMOL_MIN: 1.0, MMOL_MAX: 35, MGDL_MIN: 18, MGDL_MAX: 630, NOTE_MAX: 200,
        /** stable keys as stored, the words only in the UI */
        CONTEXTS: ['fasting', 'before_meal', 'after_meal_2h', 'other'],
        CONTEXT_WORDS: ['nüchtern', 'vor dem Essen', 'nach dem Essen (2 h)', 'sonstige'],
        contextIndex(c) { return Glucose.CONTEXTS.indexOf(c); },
        /** the unit a typed number most likely is in: below 35 mmol/L, else mg/dL */
        detectUnit: typed => (typed < 35 ? 'mmol' : 'mgdl'),
        /** a typed number in its unit as canonical whole mg/dL */
        toMgdl: (typed, unit) => jround(unit === 'mmol' ? typed * MG_PER_MMOL : typed),
        /** a typed text as a number (comma or point), NaN when it is none - like Double.parseDouble */
        parse(typed) {
            const s = String(typed == null ? '' : typed).trim().replace(/,/g, '.');
            if (s === '' || !/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFdD]?$/.test(s)) return NaN;
            return parseFloat(s);
        },
        check(typed, unit) {
            if (Number.isNaN(typed)) return 'Bitte einen Wert eintragen, z. B. 5,6 (mmol/L) oder 101 (mg/dL).';
            if (unit === 'mmol' && (typed < 1.0 || typed > 35)) return 'In mmol/L zwischen 1,0 und 35,0.';
            if (unit === 'mgdl' && (typed < 18 || typed > 630)) return 'In mg/dL zwischen 18 und 630.';
            return null;
        },
        /** both units, always: "5,6 mmol/L · 101 mg/dL" */
        both: mgdl => fmt(mgdl / MG_PER_MMOL, 1) + ' mmol/L · ' + mgdl + ' mg/dL',
        /** by context only: fasting 100 / 126, two hours after a meal 140 / 200 mg/dL; the others have no limits */
        category(mgdl, context) {
            if (context === 'fasting') return mgdl < 100 ? 'NORMAL' : mgdl < 126 ? 'RAISED' : 'HIGH';
            if (context === 'after_meal_2h') return mgdl < 140 ? 'NORMAL' : mgdl < 200 ? 'RAISED' : 'HIGH';
            return 'NONE';
        },
        word: c => ({ NORMAL: 'normal', RAISED: 'erhöht', HIGH: 'hoch' }[c] || '')
    };

    // ---- Fasting mode (Fasts.java: a time range [start, end) per person, every reading inside belongs to it) -----

    const DAY_MS = 86400000, HOUR_MS = 3600000;
    const midnight = t => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
    const Fasting = {
        SYS_RED: 90, SYS_ORANGE: 100, MG_RED: 60, MG_ORANGE: 70,
        midnight,
        /** the day of the fast a moment falls on: the calendar day of the start is day 1 (Fasts.dayOf) */
        dayOf: (f, t) => Math.round((midnight(t) - midnight(f.start)) / DAY_MS) + 1,
        /** whole hours since the start, up to the end or, while it runs, up to now (Fasts.hours) */
        hours: (f, now) => Math.max(0, Math.floor(((f.end || now) - f.start) / HOUR_MS)),
        /** "Fasten · Tag 3 von 5 · 62 h", without a plan "Fasten · Tag 3 · 62 h" (Fasts.banner) */
        banner: (f, now) => 'Fasten · Tag ' + Fasting.dayOf(f, now) + (f.planned > 0 ? ' von ' + f.planned : '') + ' · ' + Fasting.hours(f, now) + ' h',
        progress(f, now) {
            return { running: !f.end, day: Fasting.dayOf(f, f.end ? Math.max(f.start, f.end - 1) : now), hours: Fasting.hours(f, now), planned: f.planned || 0 };
        },
        /** from its start up to (not including) its end; a running fast takes everything from its start (Fast.contains) */
        inside: (f, t) => t >= f.start && (!f.end || t < f.end),
        /** the calendar days of a fast as local dates 'YYYY-MM-DD' (FastLive.fast: up to now, or to the moment before its end) */
        days(f, now) {
            const last = f.end ? Math.max(f.start, f.end - 1) : now;
            const n = Math.max(1, Fasting.dayOf(f, last));
            const out = [];
            for (let i = 0; i < Math.min(n, 400); i++) {
                const d = new Date(midnight(f.start));
                d.setDate(d.getDate() + i);
                out.push(Fasting.localDay(d.getTime() + 12 * HOUR_MS));
            }
            return out;
        },
        localDay: t => { const d = new Date(t); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); },
        /** the hint for one value, 'RED' | 'ORANGE' | null - red below sys 90 / glucose 60, orange below 100 / 70 */
        sysLevel: sys => (!sys ? null : sys < Fasting.SYS_RED ? 'RED' : sys < Fasting.SYS_ORANGE ? 'ORANGE' : null),
        gluLevel: mg => (!mg ? null : mg < Fasting.MG_RED ? 'RED' : mg < Fasting.MG_ORANGE ? 'ORANGE' : null),
        /** both together as Fasts.safety: the worse of the two, 'NONE' when all is well */
        safety(sys, mg) {
            const l = [Fasting.sysLevel(sys), Fasting.gluLevel(mg)];
            return l.includes('RED') ? 'RED' : l.includes('ORANGE') ? 'ORANGE' : 'NONE';
        }
    };

    // ---- ScaleTexts (the lines the scale tab shows) ---------------------------------------------------------------

    const NOTE_EMPTY = 'Barfuß draufstellen – dann misst sie auch den Körperfettanteil.';
    const NOTE_PROFILE = 'Profil fehlt – unter „Profil“ Größe, Geburtsjahr und Geschlecht eintragen.';
    const NOTE_NO_FAT = 'Kein Körperfett gemessen – barfuß auf alle vier Metallflächen stellen und '
        + 'stehen bleiben, bis „Fertig“ kommt.';
    const ScaleTexts = {
        when: w => (w ? (Times.day(w.time) + ' · ' + Times.clock(w.time) + ' Uhr').toUpperCase() : ''),
        note(last, p) {
            if (!last) return NOTE_EMPTY;
            if (!Profile.complete(p)) return NOTE_PROFILE;
            if (last.centiKg > 0 && !isMeasured(last.ohm)) return NOTE_NO_FAT;
            if (Number.isNaN(body(last, p).fatPercent)) return 'Widerstand ' + last.ohm + ' Ω unplausibel – barfuß, Füße auf die Elektroden?';
            return '';
        }
    };

    // ---- counted sets (Entries.java, 26.11.2026) -------------------------------------------------------------------

    /**
     * Bells (dumbbells; "Dumbbells" until the evening of 26.11.2026) and Legs count repetitions instead of time: such a
     * docfit_run row is one set - reps, weight_kg (for dumbbells ONE dumbbell; null = without), move ('Curls',
     * 'Lateral Raises'), duration_ms 0.
     */
    const Sets = {
        COUNTED: ['Bells', 'Legs'],
        isSet: r => r.reps > 0,
        /** "5 kg", "2,5 kg", "2,25 kg" (Entries.kgText) */
        kg: w => String(+(+w).toFixed(2)).replace('.', ',') + ' kg',
        /** "12 ×", with a weight "12 × 5 kg" (Entries.setText) */
        text: r => r.reps + ' ×' + (r.weight_kg > 0 ? ' ' + Sets.kg(r.weight_kg) : ''),
        /** the moves of a counted exercise in the order of their chips (Entries.MOVES); none for the others */
        MOVES: { Bells: ['Curls', 'Lateral Raises'], Legs: [] },
        moves: kind => (Sets.MOVES[kind] || []).slice()
    };
    /** an exercise under its current name: "Two Balls" is "Balls", "Dumbbells" is "Bells" since 26.11.2026 (renamed) */
    const renamed = kind => (kind === 'Two Balls' ? 'Balls' : kind === 'Dumbbells' ? 'Bells' : kind);
    const kindOf = r => renamed(r.kind == null ? '' : r.kind);
    const moveOf = r => (r.move == null ? '' : String(r.move).trim());

    // ---- History (History.java: the course of one scale value, for the detail sheets and the Verlauf tab) --------

    /**
     * Points { time, value }, oldest first. A weigh-in is { time, centiKg, ohm, waistMm, hipMm }; the values by the
     * tiles' keys: 'weight', 'fat', 'water', 'muscle', 'bmi', 'waist', 'hip', 'whtr', 'whr'.
     */
    const History = {
        /** the value of one weigh-in as its tile shows it; NaN where it has none */
        value(w, k, p) {
            const bc = body(w, p);
            switch (k) {
                case 'weight': return w.centiKg / 100.0;
                case 'fat': return bc.fatPercent;
                case 'water': return bc.waterPercent;
                case 'muscle': return bc.muscleKg;
                case 'bmi': return bc.bmi;
                case 'waist': return w.waistMm > 0 ? w.waistMm / 10.0 : NaN;
                case 'hip': return w.hipMm > 0 ? w.hipMm / 10.0 : NaN;
                case 'whtr': { const h = Girths.waistToHeight(w.waistMm, p.heightCm); return h > 0 ? h / 100.0 : NaN; }
                default: { const h = Girths.waistToHip(w.waistMm, w.hipMm); return h > 0 ? h / 100.0 : NaN; }
            }
        },
        /** the scale of one weigh-in's value (its zones), null where the value has none (hip) or lacks data */
        scale(w, k, p) {
            const v = History.value(w, k, p);
            switch (k) {
                case 'weight': return Ranges.weight(v, p.heightCm);
                case 'fat': return Ranges.fat(v, p.sex, Profile.ageIn(p, new Date(w.time).getFullYear()));
                case 'water': return Ranges.water(v, p.sex);
                case 'muscle': return Ranges.muscle(v, p.heightCm, p.sex);
                case 'bmi': return Number.isNaN(v) ? null : Ranges.bmi(v);
                case 'waist': return Ranges.waist(w.waistMm, p.sex);
                case 'whtr': return Profile.hasHeight(p) ? Ranges.waistToHeight(Girths.waistToHeight(w.waistMm, p.heightCm)) : null;
                case 'whr': return Ranges.waistToHip(Girths.waistToHip(w.waistMm, w.hipMm), p.sex);
                default: return null;
            }
        },
        /** all weigh-ins that have the value, oldest first (newestFirst as the lists keep them) */
        series(newestFirst, k, p) {
            const out = [];
            for (let i = newestFirst.length - 1; i >= 0; i--) {
                const v = History.value(newestFirst[i], k, p);
                if (!Number.isNaN(v)) out.push({ time: newestFirst[i].time, value: v });
            }
            return out;
        },
        /** the waist's goal lines from the profile: WHO red, WHO green and half the height; none for the others */
        goals(k, p) {
            if (k !== 'waist' || !known(p.sex)) return [];
            const male = p.sex === 'm';
            const red = male ? WAIST_MEN_HIGH : WAIST_WOMEN_HIGH, green = male ? WAIST_MEN : WAIST_WOMEN;
            const out = [{ value: red, label: '< ' + jround(red) + ' WHO rot' }, { value: green, label: '< ' + jround(green) + ' WHO grün' }];
            if (Profile.hasHeight(p)) {
                const half = p.heightCm * WHTR_INCREASED / 100.0;
                out.push({ value: half, label: '< ' + jround(half) + ' Bauch/Größe 0,5' });
            }
            return out;
        },
        /** the y axis [lo, hi]: points and goal lines, at least minSpan high, 12 % room above and below */
        yRange(points, goals, minSpan) {
            let lo = Number.MAX_VALUE, hi = -Number.MAX_VALUE;
            for (const pt of points) { lo = Math.min(lo, pt.value); hi = Math.max(hi, pt.value); }
            for (const g of goals || []) { lo = Math.min(lo, g.value); hi = Math.max(hi, g.value); }
            if (lo > hi) return [0, 1];
            const span = Math.max(hi - lo, minSpan), mid = (lo + hi) / 2;
            lo = Math.min(lo, mid - span / 2);
            hi = Math.max(hi, mid + span / 2);
            const pad = (hi - lo) * 0.12;
            return [lo - pad, hi + pad];
        },
        /** decimals on the axis and in the sheet: ratios two, everything else one */
        decimals: k => (k === 'whtr' || k === 'whr' ? 2 : 1),
        unit: k => ({ weight: 'kg', muscle: 'kg', fat: '%', water: '%', waist: 'cm', hip: 'cm' }[k] || ''),
        /** the smallest y stretch: a ratio 0.05, one decimal 2 units, whole numbers 4 */
        minSpan: d => (d >= 2 ? 0.05 : d === 1 ? 2 : 4)
    };

    // ---- Trends (Trends.java: the data of the "Verlauf" tab) -------------------------------------------------------

    /**
     * The chosen stretch of time and one series per running value, all oldest first: blood pressure and pulse (docfit_bp
     * rows), the fasting glucose (docfit_glucose), the stopwatch times per exercise and the repetitions per set of the
     * counted exercises per move (docfit_run). The lists come in newest first, as DocFitData.list gives them.
     */
    const RANGE_DAYS = [28, 91, 365, 0];
    const Trends = {
        RANGE_WORDS: ['4 Wochen', '3 Monate', '1 Jahr', 'Alles'],
        DAY_MS, SYS: 0, DIA: 1, PULSE: 2,
        /** the first moment of a stretch (index into RANGE_WORDS); everything: -Infinity */
        from(range, now) {
            const r = Math.max(0, Math.min(range, RANGE_DAYS.length - 1));
            return RANGE_DAYS[r] === 0 ? -Infinity : now - RANGE_DAYS[r] * DAY_MS;
        },
        since: (oldestFirst, from) => oldestFirst.filter(p => p.time >= from),
        /** systolic, diastolic or pulse (readings without a pulse are left out) */
        pressure(newestFirst, which) {
            const out = [];
            for (let i = newestFirst.length - 1; i >= 0; i--) {
                const r = newestFirst[i], pulse = Math.max(0, r.pulse || 0);
                if (which === Trends.PULSE && pulse <= 0) continue;
                out.push({ time: r.measured_at, value: which === Trends.SYS ? r.sys : which === Trends.DIA ? r.dia : pulse });
            }
            return out;
        },
        /** the fasting glucose in mg/dL (other contexts are not comparable day to day) */
        fastingGlucose(newestFirst) {
            const out = [];
            for (let i = newestFirst.length - 1; i >= 0; i--) {
                const r = newestFirst[i];
                if (r.context === Glucose.CONTEXTS[0]) out.push({ time: r.measured_at, value: r.mg_dl });
            }
            return out;
        },
        /** the stopwatch times of one exercise in seconds (its counted sets are no times) */
        runs(newestFirst, kind) {
            const out = [];
            for (let i = newestFirst.length - 1; i >= 0; i--) {
                const r = newestFirst[i];
                if (kindOf(r) === kind && !Sets.isSet(r)) out.push({ time: r.started_at, value: r.duration_ms / 1000.0 });
            }
            return out;
        },
        /** the counted sets of one exercise made as move ('' = without a move), oldest first */
        sets(newestFirst, kind, move) {
            const out = [];
            for (let i = newestFirst.length - 1; i >= 0; i--) {
                const r = newestFirst[i];
                if (Sets.isSet(r) && kindOf(r) === kind && moveOf(r) === move) out.push(r);
            }
            return out;
        },
        /** the moves an exercise's sets were made as, one card each: its own moves in their order, then any other */
        setMoves(newestFirst, kind) {
            const seen = [];
            for (let i = newestFirst.length - 1; i >= 0; i--) {
                const r = newestFirst[i];
                if (Sets.isSet(r) && kindOf(r) === kind && !seen.includes(moveOf(r))) seen.push(moveOf(r));
            }
            const out = Sets.moves(kind).filter(m => seen.includes(m));
            for (const m of seen) if (!out.includes(m)) out.push(m);
            return out;
        },
        setsSince: (oldestFirst, from) => oldestFirst.filter(r => r.started_at >= from),
        /** the repetitions of sets as points, in their order */
        reps: sets => sets.map(r => ({ time: r.started_at, value: r.reps })),
        /** the newest value as shown in a card's head ("80,0 kg"); "–" without any */
        latest(oldestFirst, decimals, unit) {
            if (!oldestFirst.length) return '–';
            const n = fmt(oldestFirst[oldestFirst.length - 1].value, decimals);
            return unit === '' ? n : n + ' ' + unit;
        },
        /** seconds as the stopwatch shows them ("1:34") */
        clock(seconds) {
            const s = jround(seconds);
            return Math.floor(s / 60) + ':' + pad2(s % 60);
        }
    };

    /** the exercises in the order of their chips (Entries.KINDS): "Bells" last, away from "Balls" (Doc, 26.11.2026) */
    const KINDS = ['Planks', 'Balls', 'Legs', 'Bells'];
    /**
     * the exercise list a docfit_run row belongs to (Entries.listOf): one list per exercise (Doc, 26.11.2026); a row
     * from before there were exercises, or under a name no chip has any more, in the first one's
     */
    const listOf = r => { const k = kindOf(r || {}); return KINDS.includes(k) ? k : KINDS[0]; };

    const api = {
        Times, Profile, isMeasured, gallagher, implausible, bodyOf, body, limits, fatScore, word, bmiWord, scoreOf, score,
        scoreColor, Scale, Ranges, Girths, Pressures, CATEGORIES, Glucose, Fasting, ScaleTexts, Sets, History, Trends,
        fmt, tenth, nextUp,
        HINTS: { HINT_PROFILE, HINT_FAT, HINT_IMPLAUSIBLE }, KINDS, listOf
    };
    root.DocFitCore = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
