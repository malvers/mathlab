package de.docalvers.docfit;

import java.util.Locale;

/**
 * How to read each value of the scale tab - the one table behind the small range bar and the line in every tile (Doc,
 * 20.11.2026: "Wir müssen die Informationen immer in die jeweilige Kachel bringen ... Und in jede Kachel so einen
 * kleinen Slider, wie der Wert zu interpretieren ist"). Pure Java, tested in RangesTest. Each scale has an axis, zones
 * (good / borderline / high) that cover it, the value with its zone, and one short German line with the reference.
 *
 * The references are those the app already uses (FitnessScore, BodyComposition, Girths), plus the neighbouring cut-offs
 * of the same papers:
 * - Körperfett: FitnessScore.limits - Gallagher 2000 for the sex and age group: below his lower healthy limit (BMI
 *   18.5; men 8 / 11 / 13 %, women 21 / 23 / 24 % by age group) borderline, up to his healthy limit good, up to his
 *   obese limit borderline, above high. Until 20.11.2026 the green band began at ACE's athletes' limit (men 6 %);
 *   Gallagher's age-based start replaced it (Doc, 20.11.2026: "entscheide du") - ACE stays in the fitness score only.
 * - Wasser: no clinical cut-off exists; the commonly quoted adult ranges (men 50-65 %, women 45-60 %) - "typisch", an
 *   orientation like the estimate itself (0.73 x fat-free mass).
 * - Muskel: Janssen I et al., Am J Epidemiol 2004;159:413-421 (doi:10.1093/aje/kwh058), skeletal muscle per height²:
 *   men high risk <= 8.50, moderate 8.51-10.75, normal >= 10.76 kg/m²; women <= 5.75, 5.76-6.75, >= 6.76 - shown in
 *   kg for the profile's height.
 * - BMI: WHO - below 18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, from 30 obese.
 * - Bauch: WHO, Waist circumference and waist-hip ratio, Geneva 2008 (2011): men from 94 cm increased, from 102 cm
 *   substantially increased risk; women 80 / 88 cm.
 * - Bauch/Größe: Ashwell 2016 (Girths): below 0.5 good, below 0.6 increased, from 0.6 high.
 * - Bauch/Hüfte: WHO 2008 (Girths): increased from 0.90 (men) / 0.85 (women).
 * Values are placed as they are shown (one decimal, ratios cut to two), so the zone always fits the number on screen.
 * The lines are short enough for one line in a tile (Doc, 20.11.2026: "dass da immer nur eine Zeile steht"); the sex
 * is the profile's, so it is not repeated.
 */
final class Ranges {
    enum Zone { GOOD, BORDER, HIGH }

    /** A stretch of the axis, from inclusive, to exclusive, and its word ("gesund", "Übergewicht"). */
    static final class Band {
        final double from, to;
        final Zone zone;
        final String word;

        Band(double from, double to, Zone zone, String word) {
            this.from = from;
            this.to = to;
            this.zone = zone;
            this.word = word;
        }
    }

    /** the longest reference line, so it fits one line in a tile */
    static final int NOTE_MAX = 26;

    /** One tile's scale: the axis, its zones, the value (NaN = none), the line under the bar, unit and decimals. */
    static final class Scale {
        final double min, max, value;
        final Band[] bands;
        final String note, unit;
        final int decimals;

        Scale(double min, double max, double value, String note, String unit, int decimals, Band... bands) {
            this.min = min;
            this.max = max;
            this.value = value;
            this.note = note;
            this.unit = unit;
            this.decimals = decimals;
            this.bands = bands;
        }

        /** The band the value lies in (below the axis: the first, above: the last), null without a value. */
        Band band() {
            if (!hasValue()) return null;
            for (Band b : bands) if (value < b.to) return b;
            return bands[bands.length - 1];
        }

        /** The word of the value's band ("gesund"), null without a value. */
        String word() {
            Band b = band();
            return b == null ? null : b.word;
        }

        /** A band as the detail sheet lists it: "unter 8 %", "8–20 %", "ab 25 %". */
        String span(int i) {
            Band b = bands[i];
            String u = unit.isEmpty() ? "" : " " + unit;
            if (i == 0) return "unter " + number(b.to) + u;
            if (i == bands.length - 1) return "ab " + number(b.from) + u;
            return number(b.from) + "–" + number(b.to) + u;
        }

        private String number(double v) {
            return String.format(Locale.GERMANY, "%." + decimals + "f", v);
        }

        boolean hasValue() {
            return !Double.isNaN(value);
        }

        /** The zone the value lies in (below the axis: the first, above: the last), null without a value. */
        Zone zone() {
            Band b = band();
            return b == null ? null : b.zone;
        }

        /** Where a value stands on the bar, 0 = left end, 1 = right end, clamped. */
        float at(double v) {
            return (float) Math.max(0, Math.min(1, (v - min) / (max - min)));
        }
    }

    // the references
    static final double WATER_MEN_LOW = 50, WATER_MEN_HIGH = 65, WATER_WOMEN_LOW = 45, WATER_WOMEN_HIGH = 60;
    static final double SMI_GOOD_MEN = 10.76, SMI_GOOD_WOMEN = 6.76;   // Janssen 2004 "normal" from here
    static final double WAIST_MEN = 94, WAIST_MEN_HIGH = 102, WAIST_WOMEN = 80, WAIST_WOMEN_HIGH = 88;

    private Ranges() {
    }

    private static boolean known(char sex) {
        return sex == Profile.MALE || sex == Profile.FEMALE;
    }

    /** Body fat in % for sex and age (FitnessScore.limits); null without sex or age. */
    static Scale fat(double percent, char sex, int age) {
        if (!known(sex) || age <= 0) return null;
        FitnessScore.Limits l = FitnessScore.limits(sex, age);
        double min = sex == Profile.MALE ? 0 : 10, max = min + 40;
        String ages = age < 40 ? "bis 39" : age < 60 ? "40–59" : "ab 60";
        return new Scale(min, max, tenth(percent),
                "gesund " + whole(l.lean) + "–" + whole(l.overweight) + " % (" + ages + ")", "%", 0,
                new Band(min, l.lean, Zone.BORDER, "sehr wenig"),
                new Band(l.lean, l.overweight, Zone.GOOD, "gesund"),
                new Band(l.overweight, l.obese, Zone.BORDER, "etwas viel"),
                new Band(l.obese, max, Zone.HIGH, "zu viel"));
    }

    /** Body water in %: the typical range for the sex; null without sex. */
    static Scale water(double percent, char sex) {
        if (!known(sex)) return null;
        boolean male = sex == Profile.MALE;
        double lo = male ? WATER_MEN_LOW : WATER_WOMEN_LOW, hi = male ? WATER_MEN_HIGH : WATER_WOMEN_HIGH;
        return new Scale(35, 75, tenth(percent), "typisch " + whole(lo) + "–" + whole(hi) + " %", "%", 0,
                new Band(35, lo, Zone.BORDER, "niedrig"),
                new Band(lo, hi, Zone.GOOD, "typisch"),
                new Band(hi, 75, Zone.BORDER, "hoch"));
    }

    /**
     * Skeletal muscle in kg against Janssen's cut-offs for the height: at or below the high-risk line high, up to the
     * normal line borderline, from there good. Null without sex or a usable height.
     */
    static Scale muscle(double kg, int heightCm, char sex) {
        if (!known(sex) || heightCm < Profile.MIN_HEIGHT || heightCm > Profile.MAX_HEIGHT) return null;
        boolean male = sex == Profile.MALE;
        double m2 = heightCm / 100.0 * (heightCm / 100.0);
        double low = (male ? FitnessScore.SMI_LOW_MEN : FitnessScore.SMI_LOW_WOMEN) * m2;
        double good = (male ? SMI_GOOD_MEN : SMI_GOOD_WOMEN) * m2;
        double min = (male ? 6 : 4) * m2, max = (male ? 14 : 10) * m2;
        // "at or below" the high-risk line: the next double above it starts the borderline zone
        return new Scale(min, max, tenth(kg), "gut ab " + Times.one(tenth(good), "kg"), "kg", 1,
                new Band(min, Math.nextUp(low), Zone.HIGH, "wenig"),
                new Band(Math.nextUp(low), tenth(good), Zone.BORDER, "mittel"),
                new Band(tenth(good), max, Zone.GOOD, "gut"));
    }

    /**
     * The weight against the WHO's BMI ranges for the height, in kg (18.5 / 25 / 30 × height²) - the only reading a
     * weight has; null without a usable height.
     */
    static Scale weight(double kg, int heightCm) {
        if (heightCm < Profile.MIN_HEIGHT || heightCm > Profile.MAX_HEIGHT) return null;
        double m2 = heightCm / 100.0 * (heightCm / 100.0);
        double under = tenth(FitnessScore.BMI_UNDER * m2), over = tenth(FitnessScore.BMI_OVER * m2);
        double obese = tenth(FitnessScore.BMI_OBESE * m2), min = tenth(15 * m2), max = tenth(40 * m2);
        return new Scale(min, max, Double.isNaN(kg) ? kg : Math.round(kg * 100) / 100.0,
                "normal " + Times.one(under, "") + "–" + Times.one(over, "") + " kg", "kg", 1,
                new Band(min, under, Zone.BORDER, "Untergewicht"),
                new Band(under, over, Zone.GOOD, "normal"),
                new Band(over, obese, Zone.BORDER, "Übergewicht"),
                new Band(obese, max, Zone.HIGH, "Adipositas"));
    }

    /** BMI after the WHO. */
    static Scale bmi(double bmi) {
        return new Scale(15, 40, tenth(bmi), "normal 18,5–24,9", "", 1,
                new Band(15, FitnessScore.BMI_UNDER, Zone.BORDER, "Untergewicht"),
                new Band(FitnessScore.BMI_UNDER, FitnessScore.BMI_OVER, Zone.GOOD, "normal"),
                new Band(FitnessScore.BMI_OVER, FitnessScore.BMI_OBESE, Zone.BORDER, "Übergewicht"),
                new Band(FitnessScore.BMI_OBESE, 40, Zone.HIGH, "Adipositas"));
    }

    /** Waist in mm (0 = none) after the WHO; null without sex. */
    static Scale waist(int waistMm, char sex) {
        if (!known(sex)) return null;
        boolean male = sex == Profile.MALE;
        double up = male ? WAIST_MEN : WAIST_WOMEN, high = male ? WAIST_MEN_HIGH : WAIST_WOMEN_HIGH;
        double min = male ? 60 : 55, max = male ? 130 : 120;
        return new Scale(min, max, waistMm > 0 ? waistMm / 10.0 : Double.NaN,
                "erhöht ab " + whole(up) + ", hoch ab " + whole(high), "cm", 0,
                new Band(min, up, Zone.GOOD, "gut"),
                new Band(up, high, Zone.BORDER, "erhöht"),
                new Band(high, max, Zone.HIGH, "hoch"));
    }

    /** Waist-to-height in hundredths (0 = none) after Ashwell. */
    static Scale waistToHeight(int hundredths) {
        double inc = Girths.WHTR_INCREASED / 100.0, high = Girths.WHTR_HIGH / 100.0;
        return new Scale(0.35, 0.75, hundredths > 0 ? hundredths / 100.0 : Double.NaN, "gut unter 0,5, hoch ab 0,6", "", 2,
                new Band(0.35, inc, Zone.GOOD, "gut"),
                new Band(inc, high, Zone.BORDER, "erhöht"),
                new Band(high, 0.75, Zone.HIGH, "hoch"));
    }

    /** Waist-to-hip in hundredths (0 = none) after the WHO; null without sex. */
    static Scale waistToHip(int hundredths, char sex) {
        if (!known(sex)) return null;
        int limit = sex == Profile.MALE ? Girths.WHR_MEN : Girths.WHR_WOMEN;
        double min = limit / 100.0 - 0.2, lim = limit / 100.0, max = lim + 0.2;
        return new Scale(min, max, hundredths > 0 ? hundredths / 100.0 : Double.NaN,
                "erhöht ab " + String.format(Locale.GERMANY, "%.2f", lim), "", 2,
                new Band(min, lim, Zone.GOOD, "gut"),
                new Band(lim, max, Zone.BORDER, "erhöht"));
    }

    private static double tenth(double v) {
        return Double.isNaN(v) ? v : Math.round(v * 10) / 10.0;
    }

    private static String whole(double v) {
        return String.format(Locale.GERMANY, "%.0f", v);
    }
}
