package de.docalvers.docfit;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * The course of one value over all weigh-ins, for the detail sheets (Doc, 20.11.2026: "Wenn wir mehrere Messungen
 * haben, will ich natürlich den Verlauf sehen, so wie beim Fasten"): the points oldest first, the value's scale (the
 * zones behind the chart, from Ranges), the goal lines for the waist, and the stretch of the y axis. Weigh-ins without
 * the value (no resistance, no waist typed in) are left out. Pure Java, tested in HistoryTest; HistoryChart draws it.
 */
final class History {
    /** One point: the moment of the weigh-in and the value as shown. */
    static final class Point {
        final long time;
        final double value;

        Point(long time, double value) {
            this.time = time;
            this.value = value;
        }
    }

    /** A horizontal goal line with its label ("< 94 WHO grün"). */
    static final class Goal {
        final double value;
        final String label;

        Goal(double value, String label) {
            this.value = value;
            this.label = label;
        }
    }

    private History() {
    }

    private static int age(Weighings.Weighing w, Profile p) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(w.time);
        return p.ageIn(c.get(Calendar.YEAR));
    }

    /** The value of one weigh-in as its tile shows it; NaN where it has none. */
    static double value(Weighings.Weighing w, TileInfo.Key k, Profile p) {
        BodyComposition bc = BodyComposition.of(w, p);
        switch (k) {
            case WEIGHT:
                return w.kg();
            case FAT:
                return bc.fatPercent;
            case WATER:
                return bc.waterPercent;
            case MUSCLE:
                return bc.muscleKg;
            case BMI:
                return bc.bmi;
            case WAIST:
                return w.hasWaist() ? w.waistMm / 10.0 : Double.NaN;
            case HIP:
                return w.hasHip() ? w.hipMm / 10.0 : Double.NaN;
            case WHTR: {
                int h = Girths.waistToHeight(w.waistMm, p.heightCm);
                return h > 0 ? h / 100.0 : Double.NaN;
            }
            default: {
                int h = Girths.waistToHip(w.waistMm, w.hipMm);
                return h > 0 ? h / 100.0 : Double.NaN;
            }
        }
    }

    /** The scale of one weigh-in's value (its zones and reading), null where the value has none (HIP) or lacks data. */
    static Ranges.Scale scale(Weighings.Weighing w, TileInfo.Key k, Profile p) {
        double v = value(w, k, p);
        switch (k) {
            case WEIGHT:
                return Ranges.weight(v, p.heightCm);
            case FAT:
                return Ranges.fat(v, p.sex, age(w, p));
            case WATER:
                return Ranges.water(v, p.sex);
            case MUSCLE:
                return Ranges.muscle(v, p.heightCm, p.sex);
            case BMI:
                return Double.isNaN(v) ? null : Ranges.bmi(v);
            case WAIST:
                return Ranges.waist(w.waistMm, p.sex);
            case WHTR:
                return p.hasHeight() ? Ranges.waistToHeight(Girths.waistToHeight(w.waistMm, p.heightCm)) : null;
            case WHR:
                return Ranges.waistToHip(Girths.waistToHip(w.waistMm, w.hipMm), p.sex);
            default:
                return null;   // HIP: no threshold of its own
        }
    }

    /** All weigh-ins that have the value, oldest first ({@code newestFirst} as Weighings keeps them). */
    static List<Point> series(List<Weighings.Weighing> newestFirst, TileInfo.Key k, Profile p) {
        List<Point> out = new ArrayList<>();
        for (int i = newestFirst.size() - 1; i >= 0; i--) {
            Weighings.Weighing w = newestFirst.get(i);
            double v = value(w, k, p);
            if (!Double.isNaN(v)) out.add(new Point(w.time, v));
        }
        return out;
    }

    /**
     * The goal lines of the waist chart, from the profile: WHO red (men 102 / women 88 cm), WHO green (94 / 80 cm) and
     * where Bauch/Größe reaches 0.5 (half the height). None for the other values or without the sex.
     */
    static List<Goal> goals(TileInfo.Key k, Profile p) {
        List<Goal> out = new ArrayList<>();
        if (k != TileInfo.Key.WAIST || (p.sex != Profile.MALE && p.sex != Profile.FEMALE)) return out;
        boolean male = p.sex == Profile.MALE;
        double red = male ? Ranges.WAIST_MEN_HIGH : Ranges.WAIST_WOMEN_HIGH;
        double green = male ? Ranges.WAIST_MEN : Ranges.WAIST_WOMEN;
        out.add(new Goal(red, "< " + whole(red) + " WHO rot"));
        out.add(new Goal(green, "< " + whole(green) + " WHO grün"));
        if (p.hasHeight()) {
            double half = p.heightCm * Girths.WHTR_INCREASED / 100.0;
            out.add(new Goal(half, "< " + whole(half) + " Bauch/Größe 0,5"));
        }
        return out;
    }

    /**
     * The stretch of the y axis: the points and the goal lines, at least {@code minSpan} high, with a little room
     * above and below - the zones are drawn only where they fall into it.
     */
    static double[] yRange(List<Point> points, List<Goal> goals, double minSpan) {
        double lo = Double.MAX_VALUE, hi = -Double.MAX_VALUE;
        for (Point pt : points) {
            lo = Math.min(lo, pt.value);
            hi = Math.max(hi, pt.value);
        }
        for (Goal g : goals) {
            lo = Math.min(lo, g.value);
            hi = Math.max(hi, g.value);
        }
        if (lo > hi) return new double[]{0, 1};
        double span = Math.max(hi - lo, minSpan), mid = (lo + hi) / 2;
        lo = Math.min(lo, mid - span / 2);
        hi = Math.max(hi, mid + span / 2);
        double pad = (hi - lo) * 0.12;
        return new double[]{lo - pad, hi + pad};
    }

    /** Decimals of a value on the axis and in the sheet: ratios two, everything else one. */
    static int decimals(TileInfo.Key k) {
        return k == TileInfo.Key.WHTR || k == TileInfo.Key.WHR ? 2 : 1;
    }

    /** The unit after a value ("kg", "%", "cm", "" for BMI and the ratios). */
    static String unit(TileInfo.Key k) {
        switch (k) {
            case WEIGHT:
            case MUSCLE:
                return "kg";
            case FAT:
            case WATER:
                return "%";
            case WAIST:
            case HIP:
                return "cm";
            default:
                return "";
        }
    }

    /** The smallest y stretch for a value: a ratio 0.05, one decimal 2 units, whole numbers 4. */
    static double minSpan(int decimals) {
        return decimals >= 2 ? 0.05 : decimals == 1 ? 2 : 4;
    }

    private static String whole(double v) {
        return String.valueOf(Math.round(v));
    }
}
